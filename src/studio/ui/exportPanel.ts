import { exportRiggedAssetToGlb } from '../../engine/rigging/RiggedExporter';
import {
  captureSingleFrameDataUrl,
  exportNwlIsometricSheet,
  exportTurntableSpriteSheet,
  type SpriteSheetExportResult,
} from '../../engine/SpriteSheetExporter';
import { runBatchExport } from '../../engine/BatchExporter';
import {
  getAllPresets,
  PRESET_CATEGORY_LABELS,
  type PresetCategory,
  type PresetEntry,
} from '../../engine/PresetRegistry';
import {
  buildVoxelMeshGroup,
  exportVoxelGridToGlb,
  exportVoxelGridToObj,
  exportVoxelGridToVox,
  voxelizeObject3D,
} from '../../engine/Voxelizer';
import type { IsoProjectionMode, VoxelGridResult } from '../../engine/types';
import {
  createEventRegistry,
  disposeGroupResources,
  type StudioContext,
} from '../state/studioContext';
import { ICONS } from './icons';

export interface ExportPanelHandle {
  updateFlipbookPreview: (dt: number) => void;
  setVoxelMode: (active: boolean) => void;
  rebuildVoxelPreview: () => void;
  scheduleVoxelRebuild: () => void;
  generateCurrentVoxelGrid: () => VoxelGridResult | null;
  disposeVoxelPreview: () => void;
  syncConversionModeUi: () => void;
  exportSingleSnapshot: () => void;
  resetStatsOnStageChange: () => void;
  dispose: () => void;
}

export function mountExportPanel(
  container: HTMLElement,
  ctx: StudioContext
): ExportPanelHandle {
  const events = createEventRegistry();
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>NWL 108px Isometric Sheet (8 Real Dirs)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <span class="field-label">Target Height / Frames</span>
          <div class="field-control">
            <input id="num-nwl-h" class="input-ctrl" type="number" min="24" max="256" value="108" style="width:66px;height:26px;" title="Target Character Height (px · NWL=108)" />
            <input id="num-nwl-frames" class="input-ctrl" type="number" min="1" max="16" value="8" style="width:66px;height:26px;" title="Frames per direction" />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-nwl-projection">Projection</label>
          <select id="sel-nwl-projection" class="select-ctrl select-ctrl-sm">
            <option value="dimetric_2_1" selected>Dimetric 2:1 (26.565° · Unity 2.5D)</option>
            <option value="true_iso">True Iso (35.264°)</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-nwl-tight-pack">Tight Pack + Unity JSON</label>
          <input id="chk-nwl-tight-pack" type="checkbox" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-nwl-post-outline">Post-Outline 1px</label>
          <input id="chk-nwl-post-outline" type="checkbox" />
        </div>
        <button id="btn-generate-nwl-sheet" class="btn btn-primary" type="button">
          <span>Export NWL 8-Dir Sheet (Zero Clipping)</span>
        </button>
        <div id="nwl-sheet-stats" class="voxel-stats-box">
          <span>8 Real Dirs (No flipX) · Escala 1m=60px (108px) · Binary Alpha</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Scene / Asset .GLB Export</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-export-quantize-glb">Exportar Albedo Quantizado</label>
          <input id="chk-export-quantize-glb" type="checkbox" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-export-quantize-dither">Quantize with Bayer 4×4 Dither</label>
          <input id="chk-export-quantize-dither" type="checkbox" />
        </div>
        <button id="btn-export-asset-glb" class="btn" type="button">
          <span>Export Current Subject .GLB</span>
        </button>
        <div id="asset-glb-status" class="voxel-stats-box">
          <span>Default: original sRGB textures (or check Quantizado)</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Batch Export (Todos os Presets Configurados)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="sel-batch-category">Categoria</label>
          <select id="sel-batch-category" class="select-ctrl select-ctrl-sm">
            <option value="all">Todos os Presets (${getAllPresets().length})</option>
            ${(Object.keys(PRESET_CATEGORY_LABELS) as PresetCategory[])
              .map(
                (cat) =>
                  `<option value="${cat}">${PRESET_CATEGORY_LABELS[cat]}</option>`
              )
              .join('')}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
          <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);">
            <input id="chk-batch-glb" type="checkbox" checked /> .GLB
          </label>
          <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);">
            <input id="chk-batch-png" type="checkbox" checked /> .PNG
          </label>
          <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);">
            <input id="chk-batch-sheet" type="checkbox" /> 8-Dir
          </label>
        </div>
        <button id="btn-batch-export" class="btn btn-primary" type="button">
          ${ICONS.download}
          <span>Exportar Pacote .ZIP (Estilo Atual)</span>
        </button>
        <div id="batch-export-status" class="voxel-stats-box">
          <span>Gera .ZIP único com manifest.json no estilo ativo do Studio</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>3D Voxel Mesh Generator &amp; Export</span></div>
      <div class="ctrl-section-body">
        <div class="slider-row">
          <div class="slider-head">
            <span>Voxel Grid Resolution</span>
            <span id="val-voxel-res" class="slider-val">32 voxels</span>
          </div>
          <input id="rng-voxel-res" type="range" min="12" max="64" step="2" value="32" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-voxel-pal">Quantize to Active Palette</label>
          <input id="chk-voxel-pal" type="checkbox" checked />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-voxel-dither">3D Ordered Checker Dither</label>
          <input id="chk-voxel-dither" type="checkbox" checked />
        </div>
        <div class="voxel-stats-box">
          <span id="voxel-export-stats">Grid Ready — click Preview or Export</span>
        </div>
        <button id="btn-voxel-preview" class="btn" type="button">
          <span>Preview Voxel 3D in Viewport</span>
        </button>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
          <button id="btn-export-glb" class="btn btn-primary btn-sm" type="button">Export .GLB</button>
          <button id="btn-export-obj" class="btn btn-sm" type="button">Export .OBJ</button>
          <button id="btn-export-vox" class="btn btn-sm" type="button">Export .VOX</button>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Single Frame Capture (2D)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <span class="field-label">Dimensions (px)</span>
          <div class="field-control">
            <input id="num-snap-w" class="input-ctrl" type="number" min="32" max="2048" value="256" style="width:74px;height:26px;" />
            <span>×</span>
            <input id="num-snap-h" class="input-ctrl" type="number" min="32" max="2048" value="256" style="width:74px;height:26px;" />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-exp-alpha">Transparent Background</label>
          <input id="chk-exp-alpha" type="checkbox" checked />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-exp-isolate">Isolate Subject (Hide Floor)</label>
          <input id="chk-exp-isolate" type="checkbox" checked />
        </div>
        <button id="btn-export-single" class="btn btn-primary" type="button">
          ${ICONS.download}
          <span>Export Crisp PNG</span>
        </button>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Sprite Sheet Generator</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="sel-sheet-dirs">Turntable Directions</label>
          <select id="sel-sheet-dirs" class="select-ctrl select-ctrl-sm">
            <option value="1">1 (Front Only)</option>
            <option value="4">4 Directions (90°)</option>
            <option value="8" selected>8 Directions (45°)</option>
            <option value="16">16 Directions (22.5°)</option>
          </select>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Frames Per Direction</span>
            <span id="val-sheet-frames" class="slider-val">6</span>
          </div>
          <input id="rng-sheet-frames" type="range" min="1" max="12" step="1" value="6" />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-sheet-size">Frame Tile Size</label>
          <select id="sel-sheet-size" class="select-ctrl select-ctrl-sm">
            <option value="64">64 × 64 px</option>
            <option value="128" selected>128 × 128 px</option>
            <option value="192">192 × 192 px</option>
            <option value="256">256 × 256 px</option>
          </select>
        </div>
        <button id="btn-generate-sheet" class="btn btn-primary" type="button">
          <span>Generate Sprite Sheet &amp; Atlas</span>
        </button>
      </div>
    </div>

    <div class="ctrl-section" id="sheet-result-card" style="display:none;">
      <div class="ctrl-section-head">
        <span id="sheet-result-meta">Sprite Preview</span>
        <div style="display:flex;gap:6px;">
          <button id="btn-dl-sheet-png" class="btn btn-sm" type="button">PNG</button>
          <button id="btn-dl-sheet-json" class="btn btn-sm" type="button">JSON</button>
        </div>
      </div>
      <div class="ctrl-section-body">
        <div class="sprite-preview-box">
          <canvas id="sprite-anim-preview" class="sprite-preview-canvas" width="128" height="128"></canvas>
        </div>
        <div class="field-row">
          <span class="field-label">Preview Dir Row</span>
          <input id="rng-preview-dir" type="range" min="0" max="7" step="1" value="0" style="width:140px;" />
        </div>
        <img id="sheet-thumb-img" class="sheet-thumb-img" alt="Generated Sprite Sheet" />
      </div>
    </div>
  `;

  const rngVoxelRes = container.querySelector<HTMLInputElement>('#rng-voxel-res')!;
  const valVoxelRes = container.querySelector<HTMLElement>('#val-voxel-res')!;
  const chkVoxelPal = container.querySelector<HTMLInputElement>('#chk-voxel-pal')!;
  const chkVoxelDither = container.querySelector<HTMLInputElement>('#chk-voxel-dither')!;
  const voxelStatsEl = container.querySelector<HTMLElement>('#voxel-export-stats')!;
  const btnVoxelPreview = container.querySelector<HTMLButtonElement>('#btn-voxel-preview')!;
  const chkQuantizeGlb = container.querySelector<HTMLInputElement>('#chk-export-quantize-glb')!;
  const chkQuantizeDither = container.querySelector<HTMLInputElement>('#chk-export-quantize-dither')!;
  const assetGlbStatus = container.querySelector<HTMLElement>('#asset-glb-status')!;

  const rngSheetFrames = container.querySelector<HTMLInputElement>('#rng-sheet-frames')!;
  const valSheetFrames = container.querySelector<HTMLElement>('#val-sheet-frames')!;
  const sheetResultCard = container.querySelector<HTMLElement>('#sheet-result-card')!;
  const sheetResultMeta = container.querySelector<HTMLElement>('#sheet-result-meta')!;
  const sheetThumbImg = container.querySelector<HTMLImageElement>('#sheet-thumb-img')!;
  const spriteAnimPreview = container.querySelector<HTMLCanvasElement>('#sprite-anim-preview')!;
  const rngPreviewDir = container.querySelector<HTMLInputElement>('#rng-preview-dir')!;
  const nwlStatsEl = container.querySelector<HTMLElement>('#nwl-sheet-stats')!;

  let sheetResult: SpriteSheetExportResult | null = null;
  let sheetImgEl: HTMLImageElement | null = null;
  let sheetAnimTimer = 0;
  let sheetFrameCursor = 0;
  let voxelRebuildTimer: ReturnType<typeof setTimeout> | null = null;

  function syncConversionModeUi(): void {
    btnVoxelPreview.classList.toggle('is-active', ctx.isVoxelMode);
    btnVoxelPreview.textContent = ctx.isVoxelMode
      ? 'Exit Voxel 3D Preview'
      : 'Preview Voxel 3D in Viewport';
    ctx.actions.syncPipelineUi();
  }

  function disposeVoxelPreview(): void {
    if (ctx.activeVoxel) {
      ctx.activeVoxel.group.removeFromParent();
      disposeGroupResources(ctx.activeVoxel.group);
      ctx.activeVoxel.grid.geometry.dispose();
      ctx.activeVoxel = null;
    }
    if (ctx.activeStage) {
      ctx.activeStage.subjectRoot.visible = true;
    }
  }

  function generateCurrentVoxelGrid(): VoxelGridResult | null {
    if (!ctx.activeStage) return null;
    const prevVis = ctx.activeStage.subjectRoot.visible;
    ctx.activeStage.subjectRoot.visible = true;
    if (ctx.animCtrl.getClips().length > 0) {
      ctx.animCtrl.setTime(ctx.animCtrl.getQuantizedTime());
    }
    ctx.activeStage.subjectRoot.updateMatrixWorld(true);

    const resolution = Number(rngVoxelRes.value) || 32;
    const usePal = chkVoxelPal.checked;
    const dither3d = chkVoxelDither.checked;
    const grid = voxelizeObject3DRiggedOrStatic(resolution, usePal, dither3d);
    ctx.activeStage.subjectRoot.visible = prevVis;
    voxelStatsEl.textContent = `${grid.dimensions.join('×')} · ${grid.voxels.length.toLocaleString()} voxels · ${grid.faceCount.toLocaleString()} faces`;
    return grid;
  }

  function voxelizeObject3DRiggedOrStatic(
    resolution: number,
    usePal: boolean,
    dither3d: boolean
  ): VoxelGridResult {
    return buildStaticGrid(resolution, usePal, dither3d);
  }

  function buildStaticGrid(
    resolution: number,
    usePal: boolean,
    dither3d: boolean
  ): VoxelGridResult {
    return voxelizeObject3D(ctx.activeStage!.subjectRoot, {
      resolution,
      palette: usePal ? ctx.pipeline.getActivePaletteEntry().config : null,
      dither3d,
      fillSolidInterior: true,
      preserveWorldScale: true,
    });
  }

  function rebuildVoxelPreview(): void {
    if (!ctx.activeStage) return;
    disposeVoxelPreview();
    const grid = generateCurrentVoxelGrid();
    if (!grid) return;

    const { group } = buildVoxelMeshGroup(grid, ctx.pipeline.getSharedResourcesForMaterial());
    group.position.copy(ctx.activeStage.subjectRoot.position);
    group.rotation.copy(ctx.activeStage.subjectRoot.rotation);
    group.scale.copy(ctx.activeStage.subjectRoot.scale);
    ctx.activeStage.sceneRoot.add(group);
    ctx.activeStage.subjectRoot.visible = false;
    ctx.activeVoxel = { grid, group };
  }

  function scheduleVoxelRebuild(): void {
    if (!ctx.isVoxelMode) return;
    if (voxelRebuildTimer) clearTimeout(voxelRebuildTimer);
    voxelRebuildTimer = setTimeout(() => {
      voxelRebuildTimer = null;
      if (ctx.isVoxelMode) rebuildVoxelPreview();
    }, 90);
  }

  function setVoxelMode(active: boolean): void {
    if (active) {
      if (ctx.pipeline.pipelineConfig.filterMode === 'full_scene') {
        ctx.pipeline.pipelineConfig.filterMode = 'only_pixelized';
      }
      ctx.isVoxelMode = true;
      rebuildVoxelPreview();
    } else {
      ctx.isVoxelMode = false;
      disposeVoxelPreview();
    }
    syncConversionModeUi();
  }

  function acquireGridForExport(): { grid: VoxelGridResult; isTemp: boolean; res: number } | null {
    const res = Number(rngVoxelRes.value) || 32;
    if (ctx.isVoxelMode && ctx.activeVoxel) {
      return { grid: ctx.activeVoxel.grid, isTemp: false, res };
    }
    const grid = generateCurrentVoxelGrid();
    if (!grid) return null;
    return { grid, isTemp: true, res };
  }

  function exportSingleSnapshot(): void {
    const w = Number(container.querySelector<HTMLInputElement>('#num-snap-w')!.value) || 256;
    const h = Number(container.querySelector<HTMLInputElement>('#num-snap-h')!.value) || 256;
    const alpha = container.querySelector<HTMLInputElement>('#chk-exp-alpha')!.checked;
    const url = ctx.actions.withIsolatedSubject(() =>
      captureSingleFrameDataUrl(ctx.pipeline, ctx.scene, ctx.activeCamera, w, h, alpha)
    );
    ctx.actions.triggerDownload(url, `pixelizer-frame-${w}x${h}.png`);
  }

  function showSheetPreview(result: SpriteSheetExportResult, tile: number, label: string): void {
    sheetResult = result;
    sheetResultCard.style.display = 'block';
    sheetResultMeta.textContent = label;
    sheetThumbImg.src = result.imageDataUrl;
    rngPreviewDir.max = String(Math.max(0, result.rows - 1));
    rngPreviewDir.value = '0';
    spriteAnimPreview.width = tile;
    spriteAnimPreview.height = tile;

    const img = new Image();
    img.onload = () => {
      sheetImgEl = img;
    };
    img.src = result.imageDataUrl;
  }

  events.listen(rngVoxelRes, 'input', () => {
    valVoxelRes.textContent = `${rngVoxelRes.value} voxels`;
    scheduleVoxelRebuild();
  });
  events.listen(chkVoxelPal, 'change', scheduleVoxelRebuild);
  events.listen(chkVoxelDither, 'change', scheduleVoxelRebuild);
  events.listen(btnVoxelPreview, 'click', () => setVoxelMode(!ctx.isVoxelMode));

  events.listen(container.querySelector('#btn-export-asset-glb')!, 'click', () => {
    void (async () => {
      if (!ctx.activeStage) return;
      const quantize = chkQuantizeGlb.checked;
      const dither = chkQuantizeDither.checked;
      assetGlbStatus.textContent = quantize
        ? 'Quantizing albedo & baking .GLB...'
        : 'Packing .GLB...';
      try {
        const { buffer, validation } = await exportRiggedAssetToGlb(
          ctx.activeStage.subjectRoot,
          ctx.animCtrl.getClips(),
          {
            name: ctx.actions.getExportSlug(),
            quantizeAlbedo: quantize,
            quantizePalette: ctx.pipeline.getActivePaletteEntry().config,
            quantizeDither: dither,
          }
        );
        const suffix = quantize ? '_quantized.glb' : '.glb';
        const fname = `${ctx.actions.getExportSlug()}${suffix}`;
        ctx.actions.downloadBlob(new Blob([buffer], { type: 'model/gltf-binary' }), fname);
        assetGlbStatus.textContent = `${fname} (${(buffer.byteLength / 1024).toFixed(1)} KB · ${validation.meshCount} meshes · ${validation.clipCount} clips)`;
      } catch (err) {
        assetGlbStatus.textContent = `Error: ${err instanceof Error ? err.message : String(err)}`;
      }
    })();
  });

  const batchStatusEl = container.querySelector<HTMLElement>('#batch-export-status')!;
  events.listen(container.querySelector('#btn-batch-export')!, 'click', () => {
    void (async () => {
      const catVal = container.querySelector<HTMLSelectElement>('#sel-batch-category')!.value;
      const includeGlb = container.querySelector<HTMLInputElement>('#chk-batch-glb')!.checked;
      const includePng = container.querySelector<HTMLInputElement>('#chk-batch-png')!.checked;
      const include8DirSheet = container.querySelector<HTMLInputElement>('#chk-batch-sheet')!.checked;
      const quantizeGlb = chkQuantizeGlb.checked;
      const ditherGlb = chkQuantizeDither.checked;

      const presets = getAllPresets();
      const categories: PresetCategory[] | 'all' =
        catVal === 'all' ? 'all' : [catVal as PresetCategory];

      batchStatusEl.textContent = 'Iniciando Batch Export...';
      try {
        const { zipBlob, manifest } = await runBatchExport(
          presets,
          {
            loadPreset: async (entry: PresetEntry) => {
              if (entry.stagePresetKey) {
                await ctx.actions.loadPresetSelection(entry.stagePresetKey);
              } else if (
                ctx.generatorHandle &&
                'spawnRegistryPreset' in ctx.generatorHandle &&
                typeof (ctx.generatorHandle as { spawnRegistryPreset?: (e: PresetEntry) => Promise<void> }).spawnRegistryPreset === 'function'
              ) {
                await (ctx.generatorHandle as { spawnRegistryPreset: (e: PresetEntry) => Promise<void> }).spawnRegistryPreset(entry);
              }
              await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            },
            capturePngDataUrl: (size) =>
              ctx.actions.withIsolatedSubject(() =>
                captureSingleFrameDataUrl(ctx.pipeline, ctx.scene, ctx.activeCamera, size, size, true)
              ),
            exportSheet: (targetHeightPx, framesPerDirection) => {
              if (!ctx.activeStage) return null;
              return ctx.actions.withIsolatedSubject(() =>
                exportNwlIsometricSheet(
                  ctx.pipeline,
                  ctx.scene,
                  ctx.activeStage!.subjectRoot,
                  {
                    targetCharHeightPx: targetHeightPx,
                    framesPerDirection,
                    alphaThreshold: 110,
                  },
                  !ctx.isVoxelMode && ctx.animCtrl.getClips().length > 0
                    ? ctx.animCtrl
                    : undefined
                )
              );
            },
            exportGlbBytes: async (quantize, dither) => {
              if (!ctx.activeStage) return null;
              const { buffer, validation } = await exportRiggedAssetToGlb(
                ctx.activeStage.subjectRoot,
                ctx.animCtrl.getClips(),
                {
                  name: ctx.actions.getExportSlug(),
                  quantizeAlbedo: quantize,
                  quantizePalette: ctx.pipeline.getActivePaletteEntry().config,
                  quantizeDither: dither,
                }
              );
              let tris = 0;
              ctx.activeStage.subjectRoot.traverse((o) => {
                if ('isMesh' in o && (o as { isMesh?: boolean }).isMesh) {
                  const geo = (o as { geometry?: { index?: { count: number }; attributes?: { position?: { count: number } } } }).geometry;
                  if (geo?.index) tris += Math.floor(geo.index.count / 3);
                  else if (geo?.attributes?.position) tris += Math.floor(geo.attributes.position.count / 3);
                }
              });
              void validation;
              return { bytes: new Uint8Array(buffer), triangles: tris };
            },
            getStyleInfo: () => ({
              stylePreset: ctx.pipeline.activeStylePreset,
              paletteId: ctx.pipeline.activePaletteId,
              rampId: ctx.pipeline.activeRampId,
            }),
          },
          {
            categories,
            includeGlb,
            includePng,
            include8DirSheet,
            quantizeGlb,
            ditherGlb,
            onProgress: (done, total, currentName) => {
              batchStatusEl.textContent = `Exportando ${done}/${total}: ${currentName}`;
            },
          }
        );

        const fname = `pixelizer_batch_${catVal}_${ctx.pipeline.activeStylePreset}.zip`;
        ctx.actions.downloadBlob(zipBlob, fname);
        batchStatusEl.textContent = `Concluído! ${manifest.totalAssets} assets -> ${fname} (${(zipBlob.size / 1024).toFixed(1)} KB)`;
      } catch (err) {
        batchStatusEl.textContent = `Erro no Batch: ${err instanceof Error ? err.message : String(err)}`;
      }
    })();
  });

  events.listen(container.querySelector('#btn-export-obj')!, 'click', () => {
    const acquired = acquireGridForExport();
    if (!acquired) return;
    const slug = ctx.actions.getExportSlug();
    const objText = exportVoxelGridToObj(acquired.grid, slug);
    ctx.actions.downloadBlob(
      new Blob([objText], { type: 'text/plain;charset=utf-8' }),
      `${slug}_voxel_${acquired.res}.obj`
    );
    if (acquired.isTemp) acquired.grid.geometry.dispose();
  });

  events.listen(container.querySelector('#btn-export-glb')!, 'click', () => {
    void (async () => {
      const acquired = acquireGridForExport();
      if (!acquired) return;
      const slug = ctx.actions.getExportSlug();
      const buf = await exportVoxelGridToGlb(acquired.grid, slug);
      ctx.actions.downloadBlob(
        new Blob([buf], { type: 'model/gltf-binary' }),
        `${slug}_voxel_${acquired.res}.glb`
      );
      if (acquired.isTemp) acquired.grid.geometry.dispose();
    })();
  });

  events.listen(container.querySelector('#btn-export-vox')!, 'click', () => {
    const acquired = acquireGridForExport();
    if (!acquired) return;
    const slug = ctx.actions.getExportSlug();
    const bytes = exportVoxelGridToVox(acquired.grid);
    ctx.actions.downloadBlob(
      new Blob([bytes.slice().buffer], { type: 'application/octet-stream' }),
      `${slug}_voxel_${acquired.res}.vox`
    );
    if (acquired.isTemp) acquired.grid.geometry.dispose();
  });

  events.listen(container.querySelector('#btn-export-single')!, 'click', exportSingleSnapshot);

  events.listen(rngSheetFrames, 'input', () => {
    valSheetFrames.textContent = rngSheetFrames.value;
  });

  events.listen(container.querySelector('#btn-generate-nwl-sheet')!, 'click', () => {
    if (!ctx.activeStage) return;
    const targetH = Number(container.querySelector<HTMLInputElement>('#num-nwl-h')!.value) || 40;
    const frames = Number(container.querySelector<HTMLInputElement>('#num-nwl-frames')!.value) || 8;
    const projection = (container.querySelector<HTMLSelectElement>('#sel-nwl-projection')?.value ??
      'dimetric_2_1') as IsoProjectionMode;
    const tightPack =
      container.querySelector<HTMLInputElement>('#chk-nwl-tight-pack')?.checked ?? false;
    const postOutlinePx =
      container.querySelector<HTMLInputElement>('#chk-nwl-post-outline')?.checked ?? false;
    const target =
      ctx.isVoxelMode && ctx.activeVoxel ? ctx.activeVoxel.group : ctx.activeStage.subjectRoot;

    const res = ctx.actions.withIsolatedSubject(() =>
      exportNwlIsometricSheet(
        ctx.pipeline,
        ctx.scene,
        target,
        {
          targetCharHeightPx: targetH,
          framesPerDirection: frames,
          projection,
          tightPack,
          postOutlinePx,
        },
        !ctx.isVoxelMode && ctx.animCtrl.getClips().length > 0 ? ctx.animCtrl : undefined
      )
    );

    const tile = res.frames[0]?.w ?? 96;
    if (res.unityMeta) {
      const slug = ctx.actions.getExportSlug();
      ctx.actions.triggerDownload(res.imageDataUrl, `${slug}_sheet_8dir.png`);
      ctx.actions.downloadBlob(
        new Blob([res.atlasJson], { type: 'application/json' }),
        `${slug}_atlas.json`
      );
      nwlStatsEl.textContent = `${res.width}×${res.height}px (${res.unityMeta.frames.length} tight frames · ${res.unityMeta.projection} ${res.unityMeta.pitchDeg.toFixed(2)}°) · clippedFrames=${res.clippedFrames}`;
    } else {
      nwlStatsEl.textContent = `${res.width}×${res.height}px (${tile}×${tile} box, 8 non-mirrored dirs · ${projection}) · clippedFrames=${res.clippedFrames}`;
    }
    showSheetPreview(res, tile, `NWL ${targetH}px (${res.rows}×${res.cols} · clip=${res.clippedFrames})`);
  });

  events.listen(container.querySelector('#btn-generate-sheet')!, 'click', () => {
    if (!ctx.activeStage) return;
    const dirs = Number(container.querySelector<HTMLSelectElement>('#sel-sheet-dirs')!.value);
    const framesPerDir = Number(rngSheetFrames.value);
    const tile = Number(container.querySelector<HTMLSelectElement>('#sel-sheet-size')!.value);
    const alpha = container.querySelector<HTMLInputElement>('#chk-exp-alpha')!.checked;
    const turntableTarget =
      ctx.isVoxelMode && ctx.activeVoxel ? ctx.activeVoxel.group : ctx.activeStage.subjectRoot;

    const result = ctx.actions.withIsolatedSubject(() =>
      exportTurntableSpriteSheet(
        ctx.pipeline,
        ctx.scene,
        ctx.activeCamera,
        turntableTarget,
        {
          directions: dirs,
          framesPerDirection: framesPerDir,
          frameWidth: tile,
          frameHeight: tile,
          transparentBackground: alpha,
          startYawDeg: 0,
        },
        !ctx.isVoxelMode && ctx.animCtrl.getClips().length > 0 ? ctx.animCtrl : undefined
      )
    );

    showSheetPreview(result, tile, `Sheet: ${result.width}×${result.height}px (${result.rows}×${result.cols})`);
  });

  events.listen(container.querySelector('#btn-dl-sheet-png')!, 'click', () => {
    if (sheetResult) ctx.actions.triggerDownload(sheetResult.imageDataUrl, `${ctx.actions.getExportSlug()}_spritesheet.png`);
  });
  events.listen(container.querySelector('#btn-dl-sheet-json')!, 'click', () => {
    if (!sheetResult) return;
    const blob = new Blob([sheetResult.atlasJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    ctx.actions.triggerDownload(url, `${ctx.actions.getExportSlug()}_atlas.json`);
    URL.revokeObjectURL(url);
  });

  return {
    updateFlipbookPreview: (dt: number) => {
      if (sheetResult && sheetImgEl && sheetImgEl.complete) {
        sheetAnimTimer += dt;
        const stepDur =
          ctx.animCtrl.config.enabled && ctx.animCtrl.config.fps > 0
            ? 1 / ctx.animCtrl.config.fps
            : 0.12;
        if (sheetAnimTimer >= stepDur) {
          sheetAnimTimer = 0;
          sheetFrameCursor = (sheetFrameCursor + 1) % sheetResult.cols;
        }
        const dirRow = Math.min(sheetResult.rows - 1, Number(rngPreviewDir.value) || 0);
        const tileW = spriteAnimPreview.width;
        const tileH = spriteAnimPreview.height;
        const ctx2d = spriteAnimPreview.getContext('2d');
        if (!ctx2d) return;
        ctx2d.imageSmoothingEnabled = false;
        ctx2d.clearRect(0, 0, tileW, tileH);
        ctx2d.drawImage(
          sheetImgEl,
          sheetFrameCursor * tileW,
          dirRow * tileH,
          tileW,
          tileH,
          0,
          0,
          tileW,
          tileH
        );
      }
    },
    setVoxelMode,
    rebuildVoxelPreview,
    scheduleVoxelRebuild,
    generateCurrentVoxelGrid,
    disposeVoxelPreview,
    syncConversionModeUi,
    exportSingleSnapshot,
    resetStatsOnStageChange: () => {
      voxelStatsEl.textContent = 'Grid Ready — click Preview or Export';
    },
    dispose: () => {
      if (voxelRebuildTimer) clearTimeout(voxelRebuildTimer);
      events.cleanup();
    },
  };
}
