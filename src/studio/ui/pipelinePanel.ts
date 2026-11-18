import * as THREE from 'three';
import { PixelizerMaterial } from '../../engine/PixelizerMaterial';
import type {
  DitherSpaceMode,
  LowResUpscaleMode,
  PixelizationFilterMode,
  ResolutionMode,
} from '../../engine/types';
import { createEventRegistry, type StudioContext } from '../state/studioContext';

export interface PipelinePanelHandle {
  syncFromPipeline: () => void;
  dispose: () => void;
}

export function mountPipelinePanel(
  container: HTMLElement,
  ctx: StudioContext
): PipelinePanelHandle {
  const events = createEventRegistry();
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Render Path &amp; Camera Grid</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-hifi-mode">Hi-Fi Stylized 3D (Sem Pixelização)</label>
          <input id="chk-hifi-mode" type="checkbox" checked />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Conversion Mode</span>
            <span id="val-conv-mode" class="slider-val">Hi-Fi 3D</span>
          </div>
          <div class="segmented" style="width:100%;">
            <button type="button" class="seg-btn is-active" data-filter="hifi_stylized">Hi-Fi 3D</button>
            <button type="button" class="seg-btn" data-filter="only_pixelized">Hybrid</button>
            <button type="button" class="seg-btn" data-filter="full_scene">Full Scene</button>
            <button type="button" class="seg-btn" data-filter="cel_hard">Cel Hard</button>
            <button type="button" class="seg-btn" id="btn-mode-voxel" data-voxel="1">Voxel 3D</button>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-pixel-expansion">Pixel Expansion (Attempt #3)</label>
          <input id="chk-pixel-expansion" type="checkbox" />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-res-mode">Resolution Mode</label>
          <select id="sel-res-mode" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="fixed_downscale_ratio" selected>Downscale Ratio</option>
            <option value="world_space_pixel_size">World Pixel Size</option>
            <option value="fixed_target_resolution">Target Height (px)</option>
          </select>
        </div>
        <div class="slider-row" id="row-world-px" style="display:none;">
          <div class="slider-head">
            <span>World Pixel Size</span>
            <span id="val-world-px" class="slider-val">0.012</span>
          </div>
          <input id="rng-world-px" type="range" min="0.008" max="0.065" step="0.002" value="0.012" />
        </div>
        <div class="slider-row" id="row-downscale">
          <div class="slider-head">
            <span>Downscale Factor</span>
            <span id="val-downscale" class="slider-val">1×</span>
          </div>
          <input id="rng-downscale" type="range" min="1" max="8" step="1" value="1" />
        </div>
        <div class="slider-row" id="row-target-h" style="display:none;">
          <div class="slider-head">
            <span>Target Vertical Res</span>
            <span id="val-target-h" class="slider-val">720px</span>
          </div>
          <input id="rng-target-h" type="range" min="90" max="1080" step="10" value="720" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Camera Zoom / Ortho Height</span>
            <span id="val-ortho-h" class="slider-val">5.8</span>
          </div>
          <input id="rng-ortho-h" type="range" min="2.2" max="28.0" step="0.2" value="5.8" />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-upscale">Upscale Filter</label>
          <select id="sel-upscale" class="select-ctrl select-ctrl-sm">
            <option value="pixel_art_aa">Pixel-Art AA (Crisp)</option>
            <option value="nearest">Nearest Neighbor</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-snap-cam">Snap Camera to Grid</label>
          <input id="chk-snap-cam" type="checkbox" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-subpixel-cam">Subpixel Smooth Pan</label>
          <input id="chk-subpixel-cam" type="checkbox" />
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Outlines, Edges &amp; Wave 3 Rim</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-id-depth">Depth-Tested ID Outlines</label>
          <input id="chk-id-depth" type="checkbox" checked />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>ID Depth Threshold</span>
            <span id="val-id-depth" class="slider-val">0.008</span>
          </div>
          <input id="rng-id-depth" type="range" min="0.001" max="0.04" step="0.001" value="0.008" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-norm-edge">Normal Crease Edges</label>
          <input id="chk-norm-edge" type="checkbox" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Normal Sensitivity</span>
            <span id="val-norm-edge" class="slider-val">0.68</span>
          </div>
          <input id="rng-norm-edge" type="range" min="0.04" max="0.85" step="0.02" value="0.68" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-depth-edge">Depth Step Edges (Staircases)</label>
          <input id="chk-depth-edge" type="checkbox" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Edge Depth Threshold</span>
            <span id="val-edge-depth" class="slider-val">0.015</span>
          </div>
          <input id="rng-edge-depth" type="range" min="0.002" max="0.05" step="0.002" value="0.015" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Edge Highlight Strength</span>
            <span id="val-edge-hl-str" class="slider-val">0.00</span>
          </div>
          <input id="rng-edge-hl-str" type="range" min="0" max="1.5" step="0.05" value="0.0" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Bevel Edges Reactivity</span>
            <span id="val-bevel-str" class="slider-val">0.00</span>
          </div>
          <input id="rng-bevel-str" type="range" min="0" max="1.5" step="0.05" value="0.0" />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-global-outline-steps">Scene Outline Width</label>
          <select id="sel-global-outline-steps" class="select-ctrl select-ctrl-sm" style="width:140px;">
            <option value="1">1 px (SNES Default)</option>
            <option value="2">2 px (Ink / Boss)</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-global-dither-space">Dither Anchor Space</label>
          <select id="sel-global-dither-space" class="select-ctrl select-ctrl-sm" style="width:140px;">
            <option value="screen_macropixel">Screen Macropixel</option>
            <option value="object_uv">Object UV Anchor</option>
          </select>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Global Cel Rim Intensity</span>
            <span id="val-global-rim" class="slider-val">0.00</span>
          </div>
          <input id="rng-global-rim" type="range" min="0" max="1.5" step="0.05" value="0" />
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>HDR Emissive Bloom (Pixel-Aligned)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-bloom-enabled">Enable HDR Bloom</label>
          <input id="chk-bloom-enabled" type="checkbox" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Bloom Threshold</span>
            <span id="val-bloom-thresh" class="slider-val">0.38</span>
          </div>
          <input id="rng-bloom-thresh" type="range" min="0.10" max="1.20" step="0.02" value="0.38" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Bloom Intensity</span>
            <span id="val-bloom-int" class="slider-val">0.45</span>
          </div>
          <input id="rng-bloom-int" type="range" min="0" max="1.80" step="0.05" value="0.45" />
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Sun Light &amp; Stage</span></div>
      <div class="ctrl-section-body">
        <div class="slider-row">
          <div class="slider-head">
            <span>Light Azimuth</span>
            <span id="val-light-az" class="slider-val">42°</span>
          </div>
          <input id="rng-light-az" type="range" min="-180" max="180" step="2" value="42" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Light Elevation</span>
            <span id="val-light-el" class="slider-val">54°</span>
          </div>
          <input id="rng-light-el" type="range" min="10" max="85" step="2" value="54" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Light Intensity</span>
            <span id="val-light-int" class="slider-val">1.40</span>
          </div>
          <input id="rng-light-int" type="range" min="0.1" max="3.0" step="0.05" value="1.4" />
        </div>
        <div class="field-row">
          <span class="field-label">Sun / Ambient Color</span>
          <div class="field-control">
            <input id="col-light" type="color" value="#fff6e8" title="Directional Light Color" />
            <input id="col-ambient" type="color" value="#7f93c2" title="Ambient Hemisphere Color" />
          </div>
        </div>
        <div class="field-row">
          <span class="field-label">Background</span>
          <div class="field-control">
            <input id="col-bg" type="color" value="#13161f" />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-bg-trans">Clear Alpha</label>
          <input id="chk-bg-trans" type="checkbox" />
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Post-Grade &amp; Preview ao Vivo</span></div>
      <div class="ctrl-section-body">
        <div class="slider-row">
          <div class="slider-head">
            <span>Exposure</span>
            <span id="val-exposure" class="slider-val">1.00</span>
          </div>
          <input id="rng-exposure" type="range" min="0.50" max="1.80" step="0.05" value="1.00" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Contrast</span>
            <span id="val-contrast" class="slider-val">1.00</span>
          </div>
          <input id="rng-contrast" type="range" min="0.60" max="1.60" step="0.05" value="1.00" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Vignette</span>
            <span id="val-vignette" class="slider-val">0.00</span>
          </div>
          <input id="rng-vignette" type="range" min="0" max="0.80" step="0.05" value="0" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-turntable">Auto Turntable 360°</label>
          <input id="chk-turntable" type="checkbox" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Turntable Speed</span>
            <span id="val-turntable-spd" class="slider-val">35°/s</span>
          </div>
          <input id="rng-turntable-spd" type="range" min="5" max="120" step="5" value="35" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-secondary);">
            <input id="chk-wireframe" type="checkbox" /> Wireframe
          </label>
          <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-secondary);">
            <input id="chk-bounds-box" type="checkbox" /> Bounds + Metros
          </label>
        </div>
        <div id="val-bounds-info" class="voxel-stats-box" style="display:none;">
          <span>Bounds: —</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Presets Customizados (Local)</span></div>
      <div class="ctrl-section-body">
        <div style="display:grid;grid-template-columns:1fr auto;gap:5px;">
          <input id="inp-custom-preset-name" class="input-ctrl" type="text" placeholder="Nome do preset..." style="height:26px;" />
          <button id="btn-save-custom-preset" class="btn btn-sm btn-primary" type="button">Salvar</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto auto;gap:5px;margin-top:4px;">
          <select id="sel-custom-presets" class="select-ctrl select-ctrl-sm"></select>
          <button id="btn-load-custom-preset" class="btn btn-sm" type="button">Aplicar</button>
          <button id="btn-del-custom-preset" class="btn btn-sm" type="button">×</button>
        </div>
      </div>
    </div>
  `;

  const chkHifiMode = container.querySelector<HTMLInputElement>('#chk-hifi-mode')!;
  const valConvMode = container.querySelector<HTMLElement>('#val-conv-mode')!;
  const filterBtns = container.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const btnModeVoxel = container.querySelector<HTMLButtonElement>('#btn-mode-voxel')!;
  const selResMode = container.querySelector<HTMLSelectElement>('#sel-res-mode')!;
  const rowWorldPx = container.querySelector<HTMLElement>('#row-world-px')!;
  const rowDownscale = container.querySelector<HTMLElement>('#row-downscale')!;
  const rowTargetH = container.querySelector<HTMLElement>('#row-target-h')!;
  const rngWorldPx = container.querySelector<HTMLInputElement>('#rng-world-px')!;
  const valWorldPx = container.querySelector<HTMLElement>('#val-world-px')!;
  const rngDownscale = container.querySelector<HTMLInputElement>('#rng-downscale')!;
  const valDownscale = container.querySelector<HTMLElement>('#val-downscale')!;
  const rngTargetH = container.querySelector<HTMLInputElement>('#rng-target-h')!;
  const valTargetH = container.querySelector<HTMLElement>('#val-target-h')!;
  const rngOrthoH = container.querySelector<HTMLInputElement>('#rng-ortho-h')!;
  const valOrthoH = container.querySelector<HTMLElement>('#val-ortho-h')!;
  const selUpscale = container.querySelector<HTMLSelectElement>('#sel-upscale')!;
  const chkSnapCam = container.querySelector<HTMLInputElement>('#chk-snap-cam')!;
  const chkSubpixelCam = container.querySelector<HTMLInputElement>('#chk-subpixel-cam')!;

  const chkExp = container.querySelector<HTMLInputElement>('#chk-pixel-expansion')!;
  const chkIdDepth = container.querySelector<HTMLInputElement>('#chk-id-depth')!;
  const rngIdDepth = container.querySelector<HTMLInputElement>('#rng-id-depth')!;
  const valIdDepth = container.querySelector<HTMLElement>('#val-id-depth')!;
  const chkNormEdge = container.querySelector<HTMLInputElement>('#chk-norm-edge')!;
  const rngNormEdge = container.querySelector<HTMLInputElement>('#rng-norm-edge')!;
  const valNormEdge = container.querySelector<HTMLElement>('#val-norm-edge')!;
  const chkDepthEdge = container.querySelector<HTMLInputElement>('#chk-depth-edge')!;
  const rngEdgeDepth = container.querySelector<HTMLInputElement>('#rng-edge-depth')!;
  const valEdgeDepth = container.querySelector<HTMLElement>('#val-edge-depth')!;
  const rngEdgeHlStr = container.querySelector<HTMLInputElement>('#rng-edge-hl-str')!;
  const valEdgeHlStr = container.querySelector<HTMLElement>('#val-edge-hl-str')!;
  const rngBevelStr = container.querySelector<HTMLInputElement>('#rng-bevel-str')!;
  const valBevelStr = container.querySelector<HTMLElement>('#val-bevel-str')!;
  const colLight = container.querySelector<HTMLInputElement>('#col-light')!;
  const colAmbient = container.querySelector<HTMLInputElement>('#col-ambient')!;
  const colBg = container.querySelector<HTMLInputElement>('#col-bg')!;
  const chkBgTrans = container.querySelector<HTMLInputElement>('#chk-bg-trans')!;
  const rngLightInt = container.querySelector<HTMLInputElement>('#rng-light-int')!;
  const valLightInt = container.querySelector<HTMLElement>('#val-light-int')!;
  const selGlobalOutlineSteps = container.querySelector<HTMLSelectElement>('#sel-global-outline-steps')!;
  const selGlobalDitherSpace = container.querySelector<HTMLSelectElement>('#sel-global-dither-space')!;
  const rngGlobalRim = container.querySelector<HTMLInputElement>('#rng-global-rim')!;
  const valGlobalRim = container.querySelector<HTMLElement>('#val-global-rim')!;
  const chkBloomEnabled = container.querySelector<HTMLInputElement>('#chk-bloom-enabled')!;
  const rngBloomThresh = container.querySelector<HTMLInputElement>('#rng-bloom-thresh')!;
  const valBloomThresh = container.querySelector<HTMLElement>('#val-bloom-thresh')!;
  const rngBloomInt = container.querySelector<HTMLInputElement>('#rng-bloom-int')!;
  const valBloomInt = container.querySelector<HTMLElement>('#val-bloom-int')!;

  const bindCheck = (id: string, fn: (checked: boolean) => void) => {
    const el = container.querySelector<HTMLInputElement>(id)!;
    events.listen(el, 'change', () => fn(el.checked));
  };
  const bindRange = (
    id: string,
    valId: string,
    fmt: (v: number) => string,
    fn: (v: number) => void
  ) => {
    const el = container.querySelector<HTMLInputElement>(id)!;
    const val = container.querySelector<HTMLElement>(valId)!;
    events.listen(el, 'input', () => {
      const n = Number(el.value);
      val.textContent = fmt(n);
      fn(n);
    });
  };

  const applyLegacyOrHifiMode = (useHifi: boolean) => {
    const preset = useHifi ? 'hifi_stylized' : 'nwl_snes';
    ctx.pipeline.applyVisualStylePreset(preset, ctx.scene);
    const selStyle = ctx.rootElement.querySelector<HTMLSelectElement>('#sel-style-preset');
    if (selStyle) selStyle.value = preset;
    ctx.dirLight.color.set(ctx.pipeline.pipelineConfig.lightColor);
    ctx.dirLight.intensity = ctx.pipeline.pipelineConfig.lightIntensity;
    ctx.hemiLight.color.set(ctx.pipeline.pipelineConfig.ambientSkyColor);
    ctx.ambientLight.color.set(ctx.pipeline.pipelineConfig.ambientSkyColor);
    if (ctx.isVoxelMode) {
      ctx.actions.setVoxelMode(false);
    } else {
      ctx.actions.syncConversionModeUi();
    }
    syncFromPipeline();
    ctx.actions.syncObjectInspector();
  };

  events.listen(chkHifiMode, 'change', () => {
    applyLegacyOrHifiMode(chkHifiMode.checked);
  });

  filterBtns.forEach((btn) => {
    events.listen(btn, 'click', () => {
      const nextFilter = btn.dataset.filter as PixelizationFilterMode;
      if (nextFilter === 'hifi_stylized') {
        applyLegacyOrHifiMode(true);
        return;
      }
      if (ctx.pipeline.pipelineConfig.filterMode === 'hifi_stylized') {
        ctx.pipeline.applyVisualStylePreset(
          nextFilter === 'cel_hard' ? 'hades_lab' : 'nwl_snes',
          ctx.scene
        );
        const selStyle = ctx.rootElement.querySelector<HTMLSelectElement>('#sel-style-preset');
        if (selStyle) selStyle.value = ctx.pipeline.activeStylePreset;
      }
      ctx.pipeline.pipelineConfig.filterMode = nextFilter;
      if (ctx.isVoxelMode) {
        ctx.actions.setVoxelMode(false);
      } else {
        ctx.actions.syncConversionModeUi();
      }
      syncFromPipeline();
      ctx.actions.syncObjectInspector();
    });
  });

  events.listen(btnModeVoxel, 'click', () => {
    ctx.actions.setVoxelMode(!ctx.isVoxelMode);
  });

  bindCheck('#chk-pixel-expansion', (v) => (ctx.pipeline.pipelineConfig.usePixelExpansion = v));

  events.listen(selResMode, 'change', () => {
    const mode = selResMode.value as ResolutionMode;
    ctx.pipeline.cameraConfig.resolutionMode = mode;
    rowWorldPx.style.display = mode === 'world_space_pixel_size' ? 'flex' : 'none';
    rowDownscale.style.display = mode === 'fixed_downscale_ratio' ? 'flex' : 'none';
    rowTargetH.style.display = mode === 'fixed_target_resolution' ? 'flex' : 'none';
  });

  bindRange('#rng-world-px', '#val-world-px', (v) => v.toFixed(3), (v) => (ctx.pipeline.cameraConfig.worldSpacePixelSize = v));
  bindRange('#rng-downscale', '#val-downscale', (v) => `${v}×`, (v) => (ctx.pipeline.cameraConfig.downscaleRatio = v));
  bindRange('#rng-target-h', '#val-target-h', (v) => `${v}px`, (v) => (ctx.pipeline.cameraConfig.targetHeight = v));
  bindRange('#rng-ortho-h', '#val-ortho-h', (v) => v.toFixed(1), (v) => (ctx.pipeline.cameraConfig.orthoHeight = v));

  events.listen(container.querySelector<HTMLSelectElement>('#sel-upscale')!, 'change', (e) => {
    ctx.pipeline.cameraConfig.upscaleMode = (e.target as HTMLSelectElement).value as LowResUpscaleMode;
  });
  bindCheck('#chk-snap-cam', (v) => (ctx.pipeline.cameraConfig.snapCameraPosition = v));
  bindCheck('#chk-subpixel-cam', (v) => (ctx.pipeline.cameraConfig.cameraSubpixelMotion = v));

  bindCheck('#chk-id-depth', (v) => (ctx.pipeline.pipelineConfig.useDepthTestForIdOutlines = v));
  bindRange('#rng-id-depth', '#val-id-depth', (v) => v.toFixed(3), (v) => (ctx.pipeline.pipelineConfig.idDepthThreshold = v));
  bindCheck('#chk-norm-edge', (v) => (ctx.pipeline.pipelineConfig.useNormalsForEdgeDetection = v));
  bindRange('#rng-norm-edge', '#val-norm-edge', (v) => v.toFixed(2), (v) => (ctx.pipeline.pipelineConfig.normalEdgeThreshold = v));
  bindCheck('#chk-depth-edge', (v) => (ctx.pipeline.pipelineConfig.useDepthTestForEdges = v));
  bindRange('#rng-edge-depth', '#val-edge-depth', (v) => v.toFixed(3), (v) => (ctx.pipeline.pipelineConfig.edgeDepthThreshold = v));
  bindRange('#rng-edge-hl-str', '#val-edge-hl-str', (v) => v.toFixed(2), (v) => (ctx.pipeline.pipelineConfig.edgeHighlightStrength = v));
  bindRange('#rng-bevel-str', '#val-bevel-str', (v) => v.toFixed(2), (v) => (ctx.pipeline.pipelineConfig.edgeBevelStrength = v));

  const patchAllPixelizedMaterials = (patch: Partial<PixelizerMaterial['options']>) => {
    ctx.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m instanceof PixelizerMaterial && m.options.objectId !== 0) {
            m.updateOptions(patch);
          }
        }
      }
    });
    ctx.actions.syncObjectInspector();
  };

  events.listen(selGlobalOutlineSteps, 'change', () => {
    patchAllPixelizedMaterials({
      outlineWidthSteps: Number(selGlobalOutlineSteps.value) >= 2 ? 2 : 1,
    });
  });

  events.listen(selGlobalDitherSpace, 'change', () => {
    patchAllPixelizedMaterials({
      ditherSpace: selGlobalDitherSpace.value as DitherSpaceMode,
    });
  });

  events.listen(rngGlobalRim, 'input', () => {
    const v = Number(rngGlobalRim.value);
    valGlobalRim.textContent = v.toFixed(2);
    patchAllPixelizedMaterials({ rimIntensity: v });
  });

  bindCheck('#chk-bloom-enabled', (v) => (ctx.pipeline.pipelineConfig.bloomEnabled = v));
  bindRange('#rng-bloom-thresh', '#val-bloom-thresh', (v) => v.toFixed(2), (v) => (ctx.pipeline.pipelineConfig.bloomThreshold = v));
  bindRange('#rng-bloom-int', '#val-bloom-int', (v) => v.toFixed(2), (v) => (ctx.pipeline.pipelineConfig.bloomIntensity = v));

  bindRange('#rng-light-az', '#val-light-az', (v) => `${v}°`, (v) => {
    ctx.lightAzimuthDeg = v;
    ctx.actions.updateSunDirection();
  });
  bindRange('#rng-light-el', '#val-light-el', (v) => `${v}°`, (v) => {
    ctx.lightElevationDeg = v;
    ctx.actions.updateSunDirection();
  });
  bindRange('#rng-light-int', '#val-light-int', (v) => v.toFixed(2), (v) => {
    ctx.dirLight.intensity = v;
    ctx.pipeline.pipelineConfig.lightIntensity = v;
  });

  events.listen(colLight, 'input', () => {
    ctx.dirLight.color.set(colLight.value);
    ctx.pipeline.pipelineConfig.lightColor = colLight.value;
  });
  events.listen(colAmbient, 'input', () => {
    ctx.hemiLight.color.set(colAmbient.value);
    ctx.ambientLight.color.set(colAmbient.value);
    ctx.pipeline.pipelineConfig.ambientSkyColor = colAmbient.value;
  });
  events.listen(colBg, 'input', () => {
    ctx.pipeline.pipelineConfig.backgroundColor = colBg.value;
  });
  bindCheck('#chk-bg-trans', (v) => (ctx.pipeline.pipelineConfig.backgroundTransparent = v));

  // Wave 1: Post-Grade & Preview ao Vivo
  const rngExposure = container.querySelector<HTMLInputElement>('#rng-exposure')!;
  const valExposure = container.querySelector<HTMLElement>('#val-exposure')!;
  const rngContrast = container.querySelector<HTMLInputElement>('#rng-contrast')!;
  const valContrast = container.querySelector<HTMLElement>('#val-contrast')!;
  const rngVignette = container.querySelector<HTMLInputElement>('#rng-vignette')!;
  const valVignette = container.querySelector<HTMLElement>('#val-vignette')!;
  const chkTurntable = container.querySelector<HTMLInputElement>('#chk-turntable')!;
  const rngTurntableSpd = container.querySelector<HTMLInputElement>('#rng-turntable-spd')!;
  const valTurntableSpd = container.querySelector<HTMLElement>('#val-turntable-spd')!;
  const chkWireframe = container.querySelector<HTMLInputElement>('#chk-wireframe')!;
  const chkBoundsBox = container.querySelector<HTMLInputElement>('#chk-bounds-box')!;
  const valBoundsInfo = container.querySelector<HTMLElement>('#val-bounds-info')!;

  bindRange('#rng-exposure', '#val-exposure', (v) => v.toFixed(2), (v) => {
    ctx.pipeline.pipelineConfig.exposure = v;
  });
  bindRange('#rng-contrast', '#val-contrast', (v) => v.toFixed(2), (v) => {
    ctx.pipeline.pipelineConfig.contrast = v;
  });
  bindRange('#rng-vignette', '#val-vignette', (v) => v.toFixed(2), (v) => {
    ctx.pipeline.pipelineConfig.vignetteStrength = v;
  });
  bindCheck('#chk-turntable', (v) => {
    ctx.turntableEnabled = v;
  });
  bindRange('#rng-turntable-spd', '#val-turntable-spd', (v) => `${v}°/s`, (v) => {
    ctx.turntableSpeedDeg = v;
  });

  bindCheck('#chk-wireframe', (v) => {
    ctx.wireframeOverlay = v;
    ctx.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if ('wireframe' in m) {
            (m as THREE.Material & { wireframe: boolean }).wireframe = v;
          }
        }
      }
    });
  });

  const refreshBoundsOverlay = (enabled: boolean) => {
    ctx.boundsOverlayEnabled = enabled;
    if (ctx.boundsHelper) {
      ctx.overlayScene.remove(ctx.boundsHelper);
      ctx.boundsHelper.dispose();
      ctx.boundsHelper = null;
    }
    if (enabled && ctx.activeStage?.subjectRoot) {
      const box = new THREE.Box3().setFromObject(ctx.activeStage.subjectRoot);
      if (!box.isEmpty()) {
        ctx.boundsHelper = new THREE.Box3Helper(box, new THREE.Color('#38bdf8'));
        ctx.overlayScene.add(ctx.boundsHelper);
        const size = box.getSize(new THREE.Vector3());
        valBoundsInfo.style.display = 'block';
        valBoundsInfo.textContent = `Dimensões: ${size.x.toFixed(2)}m × ${size.y.toFixed(2)}m × ${size.z.toFixed(2)}m`;
      } else {
        valBoundsInfo.style.display = 'none';
      }
    } else {
      valBoundsInfo.style.display = 'none';
    }
  };
  bindCheck('#chk-bounds-box', refreshBoundsOverlay);

  // Wave 1: Custom Presets (localStorage)
  const CUSTOM_PRESETS_KEY = 'pixelizer_custom_presets_v1';
  const inpPresetName = container.querySelector<HTMLInputElement>('#inp-custom-preset-name')!;
  const btnSavePreset = container.querySelector<HTMLButtonElement>('#btn-save-custom-preset')!;
  const selCustomPresets = container.querySelector<HTMLSelectElement>('#sel-custom-presets')!;
  const btnLoadPreset = container.querySelector<HTMLButtonElement>('#btn-load-custom-preset')!;
  const btnDelPreset = container.querySelector<HTMLButtonElement>('#btn-del-custom-preset')!;

  interface SavedCustomPreset {
    name: string;
    stylePreset: string;
    paletteId: string;
    rampId: string;
    lightAzimuthDeg: number;
    lightElevationDeg: number;
    pipelineConfig: Record<string, unknown>;
  }

  const readCustomPresets = (): SavedCustomPreset[] => {
    try {
      const raw = window.localStorage.getItem(CUSTOM_PRESETS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeCustomPresets = (list: SavedCustomPreset[]) => {
    try {
      window.localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(list));
    } catch {
      // ignore storage quota errors
    }
  };

  const refreshCustomPresetsSelect = () => {
    const list = readCustomPresets();
    selCustomPresets.innerHTML = list.length
      ? list.map((p) => `<option value="${p.name.replace(/"/g, '&quot;')}">${p.name}</option>`).join('')
      : '<option value="">(Nenhum preset salvo)</option>';
  };
  refreshCustomPresetsSelect();

  events.listen(btnSavePreset, 'click', () => {
    const name = inpPresetName.value.trim() || `Custom_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
    const list = readCustomPresets().filter((p) => p.name !== name);
    list.unshift({
      name,
      stylePreset: ctx.pipeline.activeStylePreset,
      paletteId: ctx.pipeline.activePaletteId,
      rampId: ctx.pipeline.activeRampId,
      lightAzimuthDeg: ctx.lightAzimuthDeg,
      lightElevationDeg: ctx.lightElevationDeg,
      pipelineConfig: { ...ctx.pipeline.pipelineConfig },
    });
    writeCustomPresets(list.slice(0, 24));
    inpPresetName.value = '';
    refreshCustomPresetsSelect();
    selCustomPresets.value = name;
  });

  events.listen(btnLoadPreset, 'click', () => {
    const name = selCustomPresets.value;
    if (!name) return;
    const found = readCustomPresets().find((p) => p.name === name);
    if (!found) return;
    Object.assign(ctx.pipeline.pipelineConfig, found.pipelineConfig);
    ctx.lightAzimuthDeg = found.lightAzimuthDeg ?? ctx.lightAzimuthDeg;
    ctx.lightElevationDeg = found.lightElevationDeg ?? ctx.lightElevationDeg;
    ctx.actions.updateSunDirection();
    ctx.dirLight.intensity = ctx.pipeline.pipelineConfig.lightIntensity;
    ctx.dirLight.color.set(ctx.pipeline.pipelineConfig.lightColor);
    ctx.hemiLight.color.set(ctx.pipeline.pipelineConfig.ambientSkyColor);
    ctx.ambientLight.color.set(ctx.pipeline.pipelineConfig.ambientSkyColor);
    syncFromPipeline();
  });

  events.listen(btnDelPreset, 'click', () => {
    const name = selCustomPresets.value;
    if (!name) return;
    writeCustomPresets(readCustomPresets().filter((p) => p.name !== name));
    refreshCustomPresetsSelect();
  });

  const syncFromPipeline = () => {
    const cfg = ctx.pipeline.pipelineConfig;
    const cam = ctx.pipeline.cameraConfig;
    const mode = cfg.filterMode;
    chkHifiMode.checked = !ctx.isVoxelMode && mode === 'hifi_stylized';
    valConvMode.textContent = ctx.isVoxelMode
      ? 'Voxel 3D'
      : mode === 'hifi_stylized'
        ? 'Hi-Fi 3D'
        : mode === 'full_scene'
          ? 'Full Scene'
          : mode === 'cel_hard'
            ? 'Cel Hard'
            : 'Hybrid';
    filterBtns.forEach((b) =>
      b.classList.toggle('is-active', !ctx.isVoxelMode && b.dataset.filter === mode)
    );
    btnModeVoxel.classList.toggle('is-active', ctx.isVoxelMode);

    selResMode.value = cam.resolutionMode;
    rowWorldPx.style.display = cam.resolutionMode === 'world_space_pixel_size' ? 'flex' : 'none';
    rowDownscale.style.display = cam.resolutionMode === 'fixed_downscale_ratio' ? 'flex' : 'none';
    rowTargetH.style.display = cam.resolutionMode === 'fixed_target_resolution' ? 'flex' : 'none';
    rngWorldPx.value = String(cam.worldSpacePixelSize);
    valWorldPx.textContent = cam.worldSpacePixelSize.toFixed(3);
    rngDownscale.value = String(cam.downscaleRatio);
    valDownscale.textContent = `${cam.downscaleRatio}×`;
    rngTargetH.value = String(cam.targetHeight);
    valTargetH.textContent = `${cam.targetHeight}px`;
    rngOrthoH.value = String(cam.orthoHeight);
    valOrthoH.textContent = cam.orthoHeight.toFixed(1);
    selUpscale.value = cam.upscaleMode;
    chkSnapCam.checked = cam.snapCameraPosition;
    chkSubpixelCam.checked = cam.cameraSubpixelMotion;

    chkExp.checked = cfg.usePixelExpansion;
    chkIdDepth.checked = cfg.useDepthTestForIdOutlines;
    rngIdDepth.value = String(cfg.idDepthThreshold);
    valIdDepth.textContent = cfg.idDepthThreshold.toFixed(3);
    chkNormEdge.checked = cfg.useNormalsForEdgeDetection;
    rngNormEdge.value = String(cfg.normalEdgeThreshold);
    valNormEdge.textContent = cfg.normalEdgeThreshold.toFixed(2);
    chkDepthEdge.checked = cfg.useDepthTestForEdges;
    rngEdgeDepth.value = String(cfg.edgeDepthThreshold);
    valEdgeDepth.textContent = cfg.edgeDepthThreshold.toFixed(3);
    rngEdgeHlStr.value = String(cfg.edgeHighlightStrength);
    valEdgeHlStr.textContent = cfg.edgeHighlightStrength.toFixed(2);
    rngBevelStr.value = String(cfg.edgeBevelStrength);
    valBevelStr.textContent = cfg.edgeBevelStrength.toFixed(2);
    chkBloomEnabled.checked = cfg.bloomEnabled;
    rngBloomThresh.value = String(cfg.bloomThreshold);
    valBloomThresh.textContent = cfg.bloomThreshold.toFixed(2);
    rngBloomInt.value = String(cfg.bloomIntensity);
    valBloomInt.textContent = cfg.bloomIntensity.toFixed(2);
    colLight.value = cfg.lightColor;
    colAmbient.value = cfg.ambientSkyColor;
    colBg.value = cfg.backgroundColor;
    chkBgTrans.checked = cfg.backgroundTransparent;
    rngLightInt.value = String(cfg.lightIntensity);
    valLightInt.textContent = cfg.lightIntensity.toFixed(2);

    const exp = cfg.exposure ?? 1.0;
    const con = cfg.contrast ?? 1.0;
    const vig = cfg.vignetteStrength ?? 0.0;
    rngExposure.value = String(exp);
    valExposure.textContent = exp.toFixed(2);
    rngContrast.value = String(con);
    valContrast.textContent = con.toFixed(2);
    rngVignette.value = String(vig);
    valVignette.textContent = vig.toFixed(2);
    chkTurntable.checked = ctx.turntableEnabled;
    rngTurntableSpd.value = String(ctx.turntableSpeedDeg);
    valTurntableSpd.textContent = `${ctx.turntableSpeedDeg}°/s`;
    chkWireframe.checked = ctx.wireframeOverlay;
    chkBoundsBox.checked = ctx.boundsOverlayEnabled;
    refreshBoundsOverlay(ctx.boundsOverlayEnabled);

    const isHades = ctx.pipeline.activeStylePreset === 'hades_lab';
    selGlobalOutlineSteps.value = isHades ? '2' : '1';
    selGlobalDitherSpace.value = isHades ? 'object_uv' : 'screen_macropixel';
    const rimGuess = isHades ? 0.72 : 0.0;
    rngGlobalRim.value = String(rimGuess);
    valGlobalRim.textContent = rimGuess.toFixed(2);
  };

  return {
    syncFromPipeline,
    dispose: () => events.cleanup(),
  };
}
