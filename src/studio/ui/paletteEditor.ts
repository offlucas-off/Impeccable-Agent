import {
  BUILTIN_PALETTES,
  extractPaletteFromImage,
  exportPaletteLutToDataUrl,
  findDitherPair,
  hexToRgb,
} from '../../engine/palettes';
import { sampleDitherThreshold } from '../../engine/dither';
import type { PixelizerPipeline } from '../../engine/PixelizerPipeline';
import type { ColorPaletteConfig, ColorReductionMethod, DitherPattern4x4 } from '../../engine/types';

export interface PaletteEditorCallbacks {
  onPaletteOrDitherChanged: () => void;
}

/**
 * Renders the interactive Palette Swatch Editor, 4x4 Dither Matrix Editor,
 * Palette-from-PNG extractor, and Dual-LUT Gradient Strip preview.
 */
export function mountPaletteEditorTab(
  container: HTMLElement,
  pipeline: PixelizerPipeline,
  callbacks: PaletteEditorCallbacks
): { refresh: () => void } {
  const palettes = pipeline.getPalettes();
  const dithers = pipeline.getDitherPatterns();

  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head">
        <span>Active Color Palette LUT</span>
        <button id="btn-export-lut" class="btn btn-sm" type="button">Download LUT</button>
      </div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="sel-palette">Palette Preset</label>
          <select id="sel-palette" class="select-ctrl select-ctrl-sm">
            ${palettes.map((p) => `<option value="${p.id}">${p.name} (${p.colors.length})</option>`).join('')}
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-color-metric">Matching Metric</label>
          <select id="sel-color-metric" class="select-ctrl select-ctrl-sm">
            <option value="hsv_weighted">HSV Weighted (ProPixelizer)</option>
            <option value="oklab_perceptual">Oklab Perceptual (Smooth)</option>
            <option value="hue_priority">Hue Priority (Vivid)</option>
            <option value="rgb_euclidean">RGB Redmean Euclidean</option>
            <option value="value_nearest">Luminance / Value Ramp</option>
            <option value="posterize_quant">Posterize Bit-Depth Quant</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-palette-dither">Color Dithering</label>
          <input id="chk-palette-dither" type="checkbox" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Dither Blend Window</span>
            <span id="val-dither-strength" class="slider-val">0.85</span>
          </div>
          <input id="rng-dither-strength" type="range" min="0" max="1" step="0.05" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>HSV Hue / Sat / Val Weights</span>
            <span id="val-hsv-weights" class="slider-val">0.35 / 0.25 / 1.00</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            <input id="rng-w-h" type="range" min="0.05" max="2.5" step="0.05" title="Hue Weight" />
            <input id="rng-w-s" type="range" min="0.05" max="2.5" step="0.05" title="Sat Weight" />
            <input id="rng-w-v" type="range" min="0.1" max="3.0" step="0.05" title="Value Weight" />
          </div>
        </div>
        <div>
          <div class="slider-head" style="margin-bottom:5px;">
            <span>Swatches (Click to edit)</span>
            <div style="display:flex;gap:5px;">
              <button id="btn-add-swatch" class="btn btn-sm" type="button">+ Color</button>
              <label class="btn btn-sm" style="cursor:pointer;">
                From PNG
                <input id="file-palette-img" type="file" accept="image/*" style="display:none;" />
              </label>
              <button id="btn-reset-palette" class="btn btn-sm" type="button">Reset</button>
            </div>
          </div>
          <div id="palette-swatch-grid" class="palette-swatch-grid"></div>
        </div>
        <div>
          <div class="slider-head" style="margin-bottom:4px;">
            <span>Live Quantized &amp; Dithered Ramp Preview</span>
          </div>
          <canvas id="canvas-lut-preview" class="lut-preview-canvas" width="256" height="32"></canvas>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head">
        <span id="dither-matrix-title">4×4 Ordered Dither Matrix</span>
      </div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="sel-dither-pattern">Pattern Preset</label>
          <select id="sel-dither-pattern" class="select-ctrl select-ctrl-sm">
            ${dithers.map((d) => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div id="dither-matrix-grid" class="dither-grid"></div>
          <div id="dither-matrix-hint" style="font-size:11px;color:var(--text-secondary);line-height:1.45;">
            Click cell to cycle threshold <strong>0..16</strong> (Shift+Click decrements).
          </div>
        </div>
      </div>
    </div>
  `;

  const selPalette = container.querySelector<HTMLSelectElement>('#sel-palette')!;
  const selMetric = container.querySelector<HTMLSelectElement>('#sel-color-metric')!;
  const chkDither = container.querySelector<HTMLInputElement>('#chk-palette-dither')!;
  const rngStrength = container.querySelector<HTMLInputElement>('#rng-dither-strength')!;
  const valStrength = container.querySelector<HTMLSpanElement>('#val-dither-strength')!;
  const rngWH = container.querySelector<HTMLInputElement>('#rng-w-h')!;
  const rngWS = container.querySelector<HTMLInputElement>('#rng-w-s')!;
  const rngWV = container.querySelector<HTMLInputElement>('#rng-w-v')!;
  const valHsvWeights = container.querySelector<HTMLSpanElement>('#val-hsv-weights')!;
  const swatchGrid = container.querySelector<HTMLDivElement>('#palette-swatch-grid')!;
  const btnAddSwatch = container.querySelector<HTMLButtonElement>('#btn-add-swatch')!;
  const fileImg = container.querySelector<HTMLInputElement>('#file-palette-img')!;
  const btnReset = container.querySelector<HTMLButtonElement>('#btn-reset-palette')!;
  const btnExportLut = container.querySelector<HTMLButtonElement>('#btn-export-lut')!;
  const canvasPreview = container.querySelector<HTMLCanvasElement>('#canvas-lut-preview')!;
  const selDitherPattern = container.querySelector<HTMLSelectElement>('#sel-dither-pattern')!;
  const ditherMatrixGrid = container.querySelector<HTMLDivElement>('#dither-matrix-grid')!;
  const ditherMatrixTitle = container.querySelector<HTMLElement>('#dither-matrix-title')!;
  const ditherMatrixHint = container.querySelector<HTMLElement>('#dither-matrix-hint')!;

  function cloneConfig(c: ColorPaletteConfig): ColorPaletteConfig {
    return {
      ...c,
      colors: [...c.colors],
      hsvWeights: [...c.hsvWeights] as [number, number, number],
    };
  }

  function renderGradientPreview(pal: ColorPaletteConfig, dither: DitherPattern4x4): void {
    const ctx = canvasPreview.getContext('2d')!;
    const w = canvasPreview.width;
    const h = canvasPreview.height;
    const img = ctx.createImageData(w, h);
    const paletteRgb = pal.colors.map(hexToRgb);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1);
        const hue = (y / h) * 0.85;
        // Vivid warm-to-cool luminance ramp to visualize color reduction + dither
        const r = Math.max(0, Math.min(255, Math.round(u * (1.0 - hue * 0.35) * 255)));
        const g = Math.max(0, Math.min(255, Math.round(u * (0.72 + Math.sin(u * Math.PI) * 0.25) * 255)));
        const b = Math.max(0, Math.min(255, Math.round(u * (0.35 + hue * 0.65) * 255)));

        const match = findDitherPair(
          [r, g, b],
          paletteRgb,
          pal.method,
          pal.hsvWeights,
          pal.enableDither ? pal.ditherStrength : 0,
          pal.valueCurveGamma
        );
        const thresh = sampleDitherThreshold(dither, x, y);
        const chosen = pal.enableDither && match.ratio > thresh ? match.c2 : match.c1;
        const idx = (y * w + x) * 4;
        img.data[idx] = chosen[0];
        img.data[idx + 1] = chosen[1];
        img.data[idx + 2] = chosen[2];
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function renderSwatches(pal: ColorPaletteConfig): void {
    swatchGrid.innerHTML = '';
    pal.colors.forEach((hex, idx) => {
      const cell = document.createElement('div');
      cell.className = 'swatch-cell';
      cell.style.background = hex;
      cell.title = `${hex} (Click to change)`;

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = hex;
      colorInput.style.cssText = 'position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;';
      colorInput.addEventListener('change', () => {
        const updated = cloneConfig(pipeline.getActivePaletteEntry().config);
        updated.colors[idx] = colorInput.value;
        pipeline.upsertPalette(updated);
        refresh();
        callbacks.onPaletteOrDitherChanged();
      });
      cell.appendChild(colorInput);

      if (pal.colors.length > 2) {
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'swatch-remove';
        rm.textContent = '×';
        rm.title = 'Remove swatch';
        rm.addEventListener('click', (e) => {
          e.stopPropagation();
          const updated = cloneConfig(pipeline.getActivePaletteEntry().config);
          updated.colors.splice(idx, 1);
          pipeline.upsertPalette(updated);
          refresh();
          callbacks.onPaletteOrDitherChanged();
        });
        cell.appendChild(rm);
      }
      swatchGrid.appendChild(cell);
    });
  }

  function renderDitherGrid(dither: DitherPattern4x4): void {
    const is8 = dither.size === 8;
    const maxVal = is8 ? 64 : 16;
    const step = is8 ? 4 : 1;
    ditherMatrixGrid.classList.toggle('is-8x8', is8);
    ditherMatrixTitle.textContent = is8
      ? '8×8 Ordered Dither Matrix'
      : '4×4 Ordered Dither Matrix';
    ditherMatrixHint.innerHTML = `Click cell to cycle threshold <strong>0..${maxVal}</strong> (Shift+Click decrements).`;

    ditherMatrixGrid.innerHTML = '';
    dither.thresholds.forEach((tVal, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dither-cell';
      const lum = Math.round((tVal / maxVal) * 210 + 20);
      btn.style.background = `rgb(${lum}, ${lum}, ${lum})`;
      btn.style.color = tVal > maxVal * 0.5 ? '#111' : '#f1f4f8';
      btn.textContent = String(tVal);
      btn.addEventListener('click', (e) => {
        const current = pipeline.getActiveDitherEntry().config;
        const nextThresholds = [...current.thresholds];
        const mod = maxVal + 1;
        nextThresholds[i] = e.shiftKey
          ? (nextThresholds[i] + mod - step) % mod
          : (nextThresholds[i] + step) % mod;
        pipeline.upsertDitherPattern({ ...current, thresholds: nextThresholds });
        refresh();
        callbacks.onPaletteOrDitherChanged();
      });
      ditherMatrixGrid.appendChild(btn);
    });
  }

  function refresh(): void {
    const pal = pipeline.getActivePaletteEntry().config;
    const dither = pipeline.getActiveDitherEntry().config;

    selPalette.value = pal.id;
    selMetric.value = pal.method;
    chkDither.checked = pal.enableDither;
    rngStrength.value = String(pal.ditherStrength);
    valStrength.textContent = pal.ditherStrength.toFixed(2);
    rngWH.value = String(pal.hsvWeights[0]);
    rngWS.value = String(pal.hsvWeights[1]);
    rngWV.value = String(pal.hsvWeights[2]);
    valHsvWeights.textContent = `${pal.hsvWeights[0].toFixed(2)} / ${pal.hsvWeights[1].toFixed(2)} / ${pal.hsvWeights[2].toFixed(2)}`;
    selDitherPattern.value = dither.id;

    renderSwatches(pal);
    renderDitherGrid(dither);
    renderGradientPreview(pal, dither);
  }

  selPalette.addEventListener('change', () => {
    pipeline.activePaletteId = selPalette.value;
    refresh();
    callbacks.onPaletteOrDitherChanged();
  });

  selMetric.addEventListener('change', () => {
    const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
    pal.method = selMetric.value as ColorReductionMethod;
    pipeline.upsertPalette(pal);
    refresh();
    callbacks.onPaletteOrDitherChanged();
  });

  chkDither.addEventListener('change', () => {
    const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
    pal.enableDither = chkDither.checked;
    pipeline.upsertPalette(pal);
    refresh();
    callbacks.onPaletteOrDitherChanged();
  });

  rngStrength.addEventListener('input', () => {
    const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
    pal.ditherStrength = Number(rngStrength.value);
    valStrength.textContent = pal.ditherStrength.toFixed(2);
    pipeline.upsertPalette(pal);
    renderGradientPreview(pal, pipeline.getActiveDitherEntry().config);
    callbacks.onPaletteOrDitherChanged();
  });

  const onWeightChange = () => {
    const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
    pal.hsvWeights = [Number(rngWH.value), Number(rngWS.value), Number(rngWV.value)];
    valHsvWeights.textContent = `${pal.hsvWeights[0].toFixed(2)} / ${pal.hsvWeights[1].toFixed(2)} / ${pal.hsvWeights[2].toFixed(2)}`;
    pipeline.upsertPalette(pal);
    renderGradientPreview(pal, pipeline.getActiveDitherEntry().config);
    callbacks.onPaletteOrDitherChanged();
  };
  rngWH.addEventListener('input', onWeightChange);
  rngWS.addEventListener('input', onWeightChange);
  rngWV.addEventListener('input', onWeightChange);

  btnAddSwatch.addEventListener('click', () => {
    const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
    pal.colors.push('#e49b38');
    pipeline.upsertPalette(pal);
    refresh();
    callbacks.onPaletteOrDitherChanged();
  });

  btnReset.addEventListener('click', () => {
    const orig = BUILTIN_PALETTES.find((p) => p.id === pipeline.activePaletteId);
    if (orig) {
      pipeline.upsertPalette(cloneConfig(orig));
      refresh();
      callbacks.onPaletteOrDitherChanged();
    }
  });

  fileImg.addEventListener('change', async () => {
    const file = fileImg.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = url;
      });
      const colors = extractPaletteFromImage(img, 24);
      if (colors.length >= 2) {
        const pal = cloneConfig(pipeline.getActivePaletteEntry().config);
        pal.colors = colors;
        pipeline.upsertPalette(pal);
        refresh();
        callbacks.onPaletteOrDitherChanged();
      }
    } finally {
      URL.revokeObjectURL(url);
      fileImg.value = '';
    }
  });

  btnExportLut.addEventListener('click', () => {
    const entry = pipeline.getActivePaletteEntry();
    const dataUrl = exportPaletteLutToDataUrl(entry.lut);
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${entry.config.id}-lut-256x16.png`;
    a.click();
  });

  selDitherPattern.addEventListener('change', () => {
    pipeline.activeDitherId = selDitherPattern.value;
    refresh();
    callbacks.onPaletteOrDitherChanged();
  });

  refresh();
  return { refresh };
}
