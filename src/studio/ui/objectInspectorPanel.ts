import * as THREE from 'three';
import { type PixelizerMaterial } from '../../engine/PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../../engine/PixelizerPipeline';
import type {
  AngleSnapMode,
  DitherSpaceMode,
  ShadingWorkflow,
  SnapOptions,
} from '../../engine/types';
import type { SceneItemEntry } from '../presets/demoScenes';
import { createEventRegistry, type StudioContext } from '../state/studioContext';

export interface ObjectInspectorPanelHandle {
  renderSceneItemList: () => void;
  syncObjectInspector: () => void;
  dispose: () => void;
}

function createPreviewTextureFromFile(file: File, isSrgb: boolean): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        URL.revokeObjectURL(url);
        tex.colorSpace = isSrgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      }
    );
  });
}

function drawTexturePreviewCanvas(
  canvas: HTMLCanvasElement,
  tex: THREE.Texture | null | undefined
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cw = canvas.width;
  const ch = canvas.height;
  ctx.clearRect(0, 0, cw, ch);
  if (!tex || !tex.image) return;

  ctx.imageSmoothingEnabled = false;
  const img = tex.image as
    | { data?: Uint8Array | Uint8ClampedArray; width?: number; height?: number }
    | CanvasImageSource;

  if (typeof img === 'object' && img !== null && 'data' in img && img.data && img.width && img.height) {
    const w = img.width;
    const h = img.height;
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    const tCtx = tmp.getContext('2d');
    if (!tCtx) return;
    const imageData = tCtx.createImageData(w, h);
    const src = img.data;
    const copyLen = Math.min(imageData.data.length, src.length);
    for (let i = 0; i < copyLen; i++) {
      imageData.data[i] = src[i];
    }
    tCtx.putImageData(imageData, 0, 0);
    ctx.save();
    if (!tex.flipY) {
      ctx.translate(0, ch);
      ctx.scale(1, -1);
    }
    ctx.drawImage(tmp, 0, 0, cw, ch);
    ctx.restore();
    return;
  }

  try {
    ctx.drawImage(img as CanvasImageSource, 0, 0, cw, ch);
  } catch {
    // Ignore unreadable cross-origin / incomplete image sources
  }
}

function measureObjectGeometryStats(obj: THREE.Object3D): {
  triangles: number;
  vertices: number;
  instances: number;
} {
  let triangles = 0;
  let vertices = 0;
  let instances = 0;
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const pos = child.geometry.getAttribute('position');
      const vCount = pos ? pos.count : 0;
      const tCount = child.geometry.index
        ? Math.floor(child.geometry.index.count / 3)
        : Math.floor(vCount / 3);
      const mult = child instanceof THREE.InstancedMesh ? child.count : 1;
      if (child instanceof THREE.InstancedMesh) instances += child.count;
      triangles += tCount * mult;
      vertices += vCount * mult;
    }
  });
  return { triangles, vertices, instances };
}

export function mountObjectInspectorPanel(
  container: HTMLElement,
  ctx: StudioContext
): ObjectInspectorPanelHandle {
  const events = createEventRegistry();
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head">
        <span>Scene Items</span>
        <div style="display:flex;gap:4px;">
          <button id="btn-toggle-id-mode" class="btn btn-sm" type="button" title="Toggle shared character ID vs per-mesh split IDs">Unify/Split IDs</button>
          <button id="btn-apply-all-obj" class="btn btn-sm" type="button" title="Copy pixel size, outline & lighting ramp to all pixelized items">Apply All</button>
        </div>
      </div>
      <div class="ctrl-section-body">
        <div id="scene-item-list" class="scene-item-list"></div>
        <div id="obj-mesh-stats" class="voxel-stats-box">
          <span>Select a mesh to inspect triangles &amp; maps</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Pixelation &amp; Outlines</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-obj-pixelated">Pixelated Shader</label>
          <input id="chk-obj-pixelated" type="checkbox" checked />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Macropixel Size</span>
            <span id="val-obj-pxsize" class="slider-val">3×3</span>
          </div>
          <input id="rng-obj-pxsize" type="range" min="1" max="10" step="1" value="3" />
          <div class="preset-chip-row" id="px-preset-chips">
            <button type="button" class="chip-btn" data-px="1">1×1</button>
            <button type="button" class="chip-btn" data-px="2">2×2</button>
            <button type="button" class="chip-btn is-active" data-px="3">3×3</button>
            <button type="button" class="chip-btn" data-px="5">5×5</button>
            <button type="button" class="chip-btn" data-px="7">7×7</button>
            <button type="button" class="chip-btn" data-px="8">8×8</button>
          </div>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Object ID (Merges Silhouettes)</span>
            <span id="val-obj-id" class="slider-val">1</span>
          </div>
          <input id="rng-obj-id" type="range" min="0" max="250" step="1" value="1" />
        </div>
        <div class="field-row">
          <span class="field-label">Silhouette Outline</span>
          <div class="field-control">
            <input id="col-obj-outline" type="color" value="#14101c" />
            <input id="rng-obj-outalpha" type="range" min="0" max="1" step="0.05" value="1" style="width:90px;" />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-obj-outline-steps">Outline Thickness</label>
          <select id="sel-obj-outline-steps" class="select-ctrl select-ctrl-sm" style="width:140px;">
            <option value="1">1 px (Standard)</option>
            <option value="2">2 px (Bold / Boss)</option>
          </select>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Edge Highlight (&lt;0.5 Dark, &gt;0.5 Light)</span>
            <span id="val-obj-edgehl" class="slider-val">0.35</span>
          </div>
          <input id="rng-obj-edgehl" type="range" min="0" max="1" step="0.05" value="0.35" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Bevel Edges Weight</span>
            <span id="val-obj-bevel" class="slider-val">0.75</span>
          </div>
          <input id="rng-obj-bevel" type="range" min="0" max="1" step="0.05" value="0.75" />
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Material, Cel Rim &amp; Maps</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <span class="field-label">Shading Workflow</span>
          <div class="segmented" style="width:165px;">
            <button type="button" class="seg-btn is-active" data-wf="specular">Specular</button>
            <button type="button" class="seg-btn" data-wf="metallic">Metallic</button>
          </div>
        </div>
        <div class="field-row">
          <span class="field-label">Base Tint &amp; Emission</span>
          <div class="field-control">
            <input id="col-obj-base" type="color" value="#ffffff" title="Base Albedo Color" />
            <input id="col-obj-emit" type="color" value="#000000" title="Emission Color" />
            <input id="rng-obj-emit-int" type="range" min="0" max="3" step="0.1" value="1" style="width:74px;" title="Emission Intensity" />
          </div>
        </div>
        <div class="slider-row" id="row-obj-metallic" style="display:none;">
          <div class="slider-head">
            <span>Metallic</span>
            <span id="val-obj-metallic" class="slider-val">0.00</span>
          </div>
          <input id="rng-obj-metallic" type="range" min="0" max="1" step="0.05" value="0" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Smoothness</span>
            <span id="val-obj-smoothness" class="slider-val">0.25</span>
          </div>
          <input id="rng-obj-smoothness" type="range" min="0" max="1" step="0.05" value="0.25" />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-lighting-ramp">Lighting Ramp</label>
          <select id="sel-lighting-ramp" class="select-ctrl select-ctrl-sm"></select>
        </div>
        <div class="field-row">
          <span class="field-label">Shadow Tint</span>
          <div class="field-control">
            <input id="col-obj-shadow" type="color" value="#2e2b4f" />
            <input id="rng-obj-shadow-a" type="range" min="0" max="1" step="0.05" value="0.25" style="width:90px;" />
          </div>
        </div>
        <div class="field-row">
          <span class="field-label">Cel Rim Light</span>
          <div class="field-control">
            <input id="col-obj-rim" type="color" value="#ffd8a8" title="Cel Rim Light Color" />
            <input id="rng-obj-rim-int" type="range" min="0" max="2" step="0.05" value="0" style="width:74px;" title="Cel Rim Intensity" />
            <span id="val-obj-rim-int" class="slider-val" style="min-width:28px;">0.00</span>
          </div>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Rim Power / Cutoff</span>
            <span id="val-obj-rim-power" class="slider-val">3.2 / 0.36</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <input id="rng-obj-rim-power" type="range" min="1.2" max="7" step="0.2" value="3.2" title="Rim Fresnel Power" />
            <input id="rng-obj-rim-thresh" type="range" min="0.05" max="0.85" step="0.02" value="0.36" title="Rim Stepped Cutoff" />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-obj-dither-space">Dither Anchor</label>
          <select id="sel-obj-dither-space" class="select-ctrl select-ctrl-sm" style="width:148px;">
            <option value="screen_macropixel">Screen Macropixel</option>
            <option value="object_uv">Object UV Anchor</option>
          </select>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Opacity (Dither Cutout)</span>
            <span id="val-obj-alpha" class="slider-val">1.00</span>
          </div>
          <input id="rng-obj-alpha" type="range" min="0" max="1" step="0.05" value="1" />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-obj-grading">Apply Palette LUT</label>
          <input id="chk-obj-grading" type="checkbox" checked />
        </div>

        <div style="border-top:1px solid var(--border-subtle);padding-top:8px;display:flex;flex-direction:column;gap:6px;">
          <div class="tex-slot-row">
            <canvas id="tex-albedo-preview" class="tex-thumb-canvas" width="48" height="48"></canvas>
            <span class="tex-status" id="tex-albedo-name">Albedo: None</span>
            <label class="btn btn-sm" style="cursor:pointer;">Load<input id="file-tex-albedo" type="file" accept="image/*" style="display:none;" /></label>
            <button id="btn-clr-albedo" class="btn btn-sm" type="button">Clr</button>
          </div>
          <div class="tex-slot-row">
            <canvas id="tex-normal-preview" class="tex-thumb-canvas" width="48" height="48"></canvas>
            <span class="tex-status" id="tex-normal-name">Normal: None</span>
            <label class="btn btn-sm" style="cursor:pointer;">Load<input id="file-tex-normal" type="file" accept="image/*" style="display:none;" /></label>
            <button id="btn-clr-normal" class="btn btn-sm" type="button">Clr</button>
          </div>
          <div class="tex-slot-row">
            <canvas id="tex-emit-preview" class="tex-thumb-canvas" width="48" height="48"></canvas>
            <span class="tex-status" id="tex-emit-name">Emission: None</span>
            <label class="btn btn-sm" style="cursor:pointer;">Load<input id="file-tex-emit" type="file" accept="image/*" style="display:none;" /></label>
            <button id="btn-clr-emit" class="btn btn-sm" type="button">Clr</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Anti-Pixel-Creep Snapping</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="chk-snap-pos">Snap Object Position</label>
          <input id="chk-snap-pos" type="checkbox" checked />
        </div>
        <div class="field-row">
          <label class="field-label" for="chk-align-grid">Align Pixel Grid to Root</label>
          <input id="chk-align-grid" type="checkbox" checked />
        </div>
        <div class="field-row">
          <label class="field-label" for="sel-angle-snap">Angle Snap Mode</label>
          <select id="sel-angle-snap" class="select-ctrl select-ctrl-sm">
            <option value="none">None (Free)</option>
            <option value="world_space">World Space</option>
            <option value="camera_space_y">Camera Space Y (Sprite Dir)</option>
          </select>
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Angle Step</span>
            <span id="val-angle-deg" class="slider-val">45°</span>
          </div>
          <input id="rng-angle-deg" type="range" min="15" max="90" step="15" value="45" />
        </div>
      </div>
    </div>
  `;

  const sceneItemList = container.querySelector<HTMLDivElement>('#scene-item-list')!;
  const objMeshStats = container.querySelector<HTMLElement>('#obj-mesh-stats')!;
  const selLightingRamp = container.querySelector<HTMLSelectElement>('#sel-lighting-ramp')!;
  for (const r of ctx.pipeline.getLightingRamps()) {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.name;
    selLightingRamp.appendChild(opt);
  }
  selLightingRamp.value = ctx.pipeline.activeRampId;

  const chkObjPix = container.querySelector<HTMLInputElement>('#chk-obj-pixelated')!;
  const rngObjPxSize = container.querySelector<HTMLInputElement>('#rng-obj-pxsize')!;
  const valObjPxSize = container.querySelector<HTMLElement>('#val-obj-pxsize')!;
  const rngObjId = container.querySelector<HTMLInputElement>('#rng-obj-id')!;
  const valObjId = container.querySelector<HTMLElement>('#val-obj-id')!;
  const colObjOutline = container.querySelector<HTMLInputElement>('#col-obj-outline')!;
  const rngObjOutAlpha = container.querySelector<HTMLInputElement>('#rng-obj-outalpha')!;
  const selObjOutlineSteps = container.querySelector<HTMLSelectElement>('#sel-obj-outline-steps')!;
  const rngObjEdgeHl = container.querySelector<HTMLInputElement>('#rng-obj-edgehl')!;
  const valObjEdgeHl = container.querySelector<HTMLElement>('#val-obj-edgehl')!;
  const rngObjBevel = container.querySelector<HTMLInputElement>('#rng-obj-bevel')!;
  const valObjBevel = container.querySelector<HTMLElement>('#val-obj-bevel')!;
  const wfBtns = container.querySelectorAll<HTMLButtonElement>('[data-wf]');
  const rowObjMetallic = container.querySelector<HTMLElement>('#row-obj-metallic')!;
  const rngObjMetallic = container.querySelector<HTMLInputElement>('#rng-obj-metallic')!;
  const valObjMetallic = container.querySelector<HTMLElement>('#val-obj-metallic')!;
  const rngObjSmooth = container.querySelector<HTMLInputElement>('#rng-obj-smoothness')!;
  const valObjSmooth = container.querySelector<HTMLElement>('#val-obj-smoothness')!;
  const colObjBase = container.querySelector<HTMLInputElement>('#col-obj-base')!;
  const colObjEmit = container.querySelector<HTMLInputElement>('#col-obj-emit')!;
  const rngObjEmitInt = container.querySelector<HTMLInputElement>('#rng-obj-emit-int')!;
  const colObjShadow = container.querySelector<HTMLInputElement>('#col-obj-shadow')!;
  const rngObjShadowA = container.querySelector<HTMLInputElement>('#rng-obj-shadow-a')!;
  const colObjRim = container.querySelector<HTMLInputElement>('#col-obj-rim')!;
  const rngObjRimInt = container.querySelector<HTMLInputElement>('#rng-obj-rim-int')!;
  const valObjRimInt = container.querySelector<HTMLElement>('#val-obj-rim-int')!;
  const rngObjRimPower = container.querySelector<HTMLInputElement>('#rng-obj-rim-power')!;
  const rngObjRimThresh = container.querySelector<HTMLInputElement>('#rng-obj-rim-thresh')!;
  const valObjRimPower = container.querySelector<HTMLElement>('#val-obj-rim-power')!;
  const selObjDitherSpace = container.querySelector<HTMLSelectElement>('#sel-obj-dither-space')!;
  const rngObjAlpha = container.querySelector<HTMLInputElement>('#rng-obj-alpha')!;
  const valObjAlpha = container.querySelector<HTMLElement>('#val-obj-alpha')!;
  const chkObjGrading = container.querySelector<HTMLInputElement>('#chk-obj-grading')!;
  const chkSnapPos = container.querySelector<HTMLInputElement>('#chk-snap-pos')!;
  const chkAlignGrid = container.querySelector<HTMLInputElement>('#chk-align-grid')!;
  const selAngleSnap = container.querySelector<HTMLSelectElement>('#sel-angle-snap')!;
  const rngAngleDeg = container.querySelector<HTMLInputElement>('#rng-angle-deg')!;
  const valAngleDeg = container.querySelector<HTMLElement>('#val-angle-deg')!;

  const texAlbedoPreview = container.querySelector<HTMLCanvasElement>('#tex-albedo-preview')!;
  const texNormalPreview = container.querySelector<HTMLCanvasElement>('#tex-normal-preview')!;
  const texEmitPreview = container.querySelector<HTMLCanvasElement>('#tex-emit-preview')!;
  const texAlbedoName = container.querySelector<HTMLElement>('#tex-albedo-name')!;
  const texNormalName = container.querySelector<HTMLElement>('#tex-normal-name')!;
  const texEmitName = container.querySelector<HTMLElement>('#tex-emit-name')!;
  const pxChipBtns = container.querySelectorAll<HTMLButtonElement>('#px-preset-chips .chip-btn');

  function getSelectedItem(): SceneItemEntry | undefined {
    return (
      ctx.activeStage?.items.find((i) => i.id === ctx.selectedItemId) ??
      ctx.activeStage?.items[0]
    );
  }

  function renderSceneItemList(): void {
    sceneItemList.innerHTML = '';
    if (!ctx.activeStage) return;
    for (const item of ctx.activeStage.items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `scene-item-btn ${item.id === ctx.selectedItemId ? 'is-selected' : ''}`;
      const primary = item.materials[0];
      const badge = primary?.options.pixelated
        ? `ID${primary.options.objectId} · ${primary.options.pixelSize}×`
        : 'RAW';
      btn.innerHTML = `<span>${item.label}</span><span style="font-family:var(--font-mono);font-size:10px;color:var(--cyan-tech);">${badge}</span>`;
      btn.addEventListener('click', () => {
        ctx.selectedItemId = item.id;
        renderSceneItemList();
        syncObjectInspector();
      });
      sceneItemList.appendChild(btn);
    }
  }

  function syncObjectInspector(): void {
    selLightingRamp.value = ctx.pipeline.activeRampId;
    const item = getSelectedItem();
    const mat = item?.materials[0];
    if (!item || !mat) {
      objMeshStats.textContent = 'No mesh selected';
      drawTexturePreviewCanvas(texAlbedoPreview, null);
      drawTexturePreviewCanvas(texNormalPreview, null);
      drawTexturePreviewCanvas(texEmitPreview, null);
      return;
    }

    const stats = measureObjectGeometryStats(item.object);
    objMeshStats.textContent =
      stats.instances > 0
        ? `${stats.triangles.toLocaleString()} tris · ${stats.vertices.toLocaleString()} verts · ${stats.instances}× instanced`
        : `${stats.triangles.toLocaleString()} tris · ${stats.vertices.toLocaleString()} verts`;

    const o = mat.options;
    chkObjPix.checked = o.pixelated;
    rngObjPxSize.value = String(o.pixelSize);
    valObjPxSize.textContent = `${o.pixelSize}×${o.pixelSize}`;
    pxChipBtns.forEach((b) =>
      b.classList.toggle('is-active', Number(b.dataset.px) === o.pixelSize)
    );
    rngObjId.value = String(o.objectId);
    valObjId.textContent = String(o.objectId);
    colObjOutline.value = o.outlineColor;
    rngObjOutAlpha.value = String(o.outlineAlpha);
    selObjOutlineSteps.value = String(o.outlineWidthSteps >= 2 ? 2 : 1);
    rngObjEdgeHl.value = String(o.edgeHighlight);
    valObjEdgeHl.textContent = o.edgeHighlight.toFixed(2);
    rngObjBevel.value = String(o.edgeBevelWeight);
    valObjBevel.textContent = o.edgeBevelWeight.toFixed(2);

    wfBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.wf === o.workflow));
    rowObjMetallic.style.display = o.workflow === 'metallic' ? 'flex' : 'none';
    rngObjMetallic.value = String(o.metallic);
    valObjMetallic.textContent = o.metallic.toFixed(2);
    rngObjSmooth.value = String(o.smoothness);
    valObjSmooth.textContent = o.smoothness.toFixed(2);
    colObjBase.value = o.baseColor;
    colObjEmit.value = o.emissionColor;
    rngObjEmitInt.value = String(o.emissionIntensity);
    colObjShadow.value = o.shadowTint;
    rngObjShadowA.value = String(o.shadowTintAlpha);
    colObjRim.value = o.rimColor;
    rngObjRimInt.value = String(o.rimIntensity);
    valObjRimInt.textContent = o.rimIntensity.toFixed(2);
    rngObjRimPower.value = String(o.rimPower);
    rngObjRimThresh.value = String(o.rimSteppedThreshold);
    valObjRimPower.textContent = `${o.rimPower.toFixed(1)} / ${o.rimSteppedThreshold.toFixed(2)}`;
    selObjDitherSpace.value = o.ditherSpace;
    rngObjAlpha.value = String(o.alpha);
    valObjAlpha.textContent = o.alpha.toFixed(2);
    chkObjGrading.checked = o.useColorGrading;

    const formatTexBadge = (label: string, tex: THREE.Texture | null | undefined): string => {
      if (!tex) return `${label}: None`;
      const img = tex.image as { width?: number; height?: number } | undefined;
      if (img?.width && img?.height && img.width > 1) {
        return `${label}: ${img.width}×${img.height}`;
      }
      return `${label}: Custom Map`;
    };
    texAlbedoName.textContent = formatTexBadge('Albedo', o.albedoMap);
    texNormalName.textContent = formatTexBadge('Normal', o.normalMap);
    texEmitName.textContent = formatTexBadge('Emission', o.emissionMap);
    drawTexturePreviewCanvas(texAlbedoPreview, o.albedoMap);
    drawTexturePreviewCanvas(texNormalPreview, o.normalMap);
    drawTexturePreviewCanvas(texEmitPreview, o.emissionMap);

    const attach = item.snapTarget.userData.pixelizer as PixelizerObjectAttachment | undefined;
    if (attach) {
      chkSnapPos.checked = attach.snap.snapPosition;
      chkAlignGrid.checked = attach.snap.alignPixelGrid;
      selAngleSnap.value = attach.snap.angleSnapMode;
      rngAngleDeg.value = String(attach.snap.angleResolutionDeg);
      valAngleDeg.textContent = `${attach.snap.angleResolutionDeg}°`;
    }
  }

  function patchSelectedMaterials(
    patch: Partial<PixelizerMaterial['options']>
  ): void {
    const item = getSelectedItem();
    if (!item) return;
    for (const m of item.materials) {
      m.updateOptions(patch);
    }
    if (patch.pixelSize !== undefined) {
      const attach = item.snapTarget.userData.pixelizer as PixelizerObjectAttachment | undefined;
      if (attach) attach.snap.alignmentPixelSize = patch.pixelSize;
      item.object.traverse((c) => {
        const a = c.userData.pixelizer as PixelizerObjectAttachment | undefined;
        if (a) a.snap.alignmentPixelSize = patch.pixelSize!;
      });
    }
    renderSceneItemList();
  }

  function patchSelectedSnap(patch: Partial<SnapOptions>): void {
    const item = getSelectedItem();
    if (!item) return;
    const targets = new Set<THREE.Object3D>([item.snapTarget, item.object]);
    item.object.traverse((c) => targets.add(c));
    for (const t of targets) {
      const attach = t.userData.pixelizer as PixelizerObjectAttachment | undefined;
      if (attach) Object.assign(attach.snap, patch);
    }
  }

  events.listen(chkObjPix, 'change', () => patchSelectedMaterials({ pixelated: chkObjPix.checked }));
  events.listen(rngObjPxSize, 'input', () => {
    const v = Number(rngObjPxSize.value);
    valObjPxSize.textContent = `${v}×${v}`;
    pxChipBtns.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.px) === v));
    patchSelectedMaterials({ pixelSize: v });
  });
  pxChipBtns.forEach((btn) => {
    events.listen(btn, 'click', () => {
      const px = Number(btn.dataset.px) || 3;
      rngObjPxSize.value = String(px);
      valObjPxSize.textContent = `${px}×${px}`;
      pxChipBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      patchSelectedMaterials({ pixelSize: px });
    });
  });
  events.listen(rngObjId, 'input', () => {
    const v = Number(rngObjId.value);
    valObjId.textContent = String(v);
    patchSelectedMaterials({ objectId: v });
  });
  events.listen(colObjOutline, 'input', () => patchSelectedMaterials({ outlineColor: colObjOutline.value }));
  events.listen(rngObjOutAlpha, 'input', () => patchSelectedMaterials({ outlineAlpha: Number(rngObjOutAlpha.value) }));
  events.listen(selObjOutlineSteps, 'change', () =>
    patchSelectedMaterials({ outlineWidthSteps: Number(selObjOutlineSteps.value) >= 2 ? 2 : 1 })
  );
  events.listen(rngObjEdgeHl, 'input', () => {
    const v = Number(rngObjEdgeHl.value);
    valObjEdgeHl.textContent = v.toFixed(2);
    patchSelectedMaterials({ edgeHighlight: v });
  });
  events.listen(rngObjBevel, 'input', () => {
    const v = Number(rngObjBevel.value);
    valObjBevel.textContent = v.toFixed(2);
    patchSelectedMaterials({ edgeBevelWeight: v });
  });
  wfBtns.forEach((btn) => {
    events.listen(btn, 'click', () => {
      const wf = btn.dataset.wf as ShadingWorkflow;
      wfBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      rowObjMetallic.style.display = wf === 'metallic' ? 'flex' : 'none';
      patchSelectedMaterials({ workflow: wf });
    });
  });
  events.listen(rngObjMetallic, 'input', () => {
    const v = Number(rngObjMetallic.value);
    valObjMetallic.textContent = v.toFixed(2);
    patchSelectedMaterials({ metallic: v });
  });
  events.listen(rngObjSmooth, 'input', () => {
    const v = Number(rngObjSmooth.value);
    valObjSmooth.textContent = v.toFixed(2);
    patchSelectedMaterials({ smoothness: v });
  });
  events.listen(colObjBase, 'input', () => patchSelectedMaterials({ baseColor: colObjBase.value }));
  events.listen(colObjEmit, 'input', () => patchSelectedMaterials({ emissionColor: colObjEmit.value }));
  events.listen(rngObjEmitInt, 'input', () => patchSelectedMaterials({ emissionIntensity: Number(rngObjEmitInt.value) }));
  events.listen(colObjShadow, 'input', () => patchSelectedMaterials({ shadowTint: colObjShadow.value }));
  events.listen(rngObjShadowA, 'input', () => patchSelectedMaterials({ shadowTintAlpha: Number(rngObjShadowA.value) }));
  events.listen(colObjRim, 'input', () => patchSelectedMaterials({ rimColor: colObjRim.value }));
  events.listen(rngObjRimInt, 'input', () => {
    const v = Number(rngObjRimInt.value);
    valObjRimInt.textContent = v.toFixed(2);
    patchSelectedMaterials({ rimIntensity: v });
  });
  const updateRimShape = () => {
    const p = Number(rngObjRimPower.value);
    const t = Number(rngObjRimThresh.value);
    valObjRimPower.textContent = `${p.toFixed(1)} / ${t.toFixed(2)}`;
    patchSelectedMaterials({ rimPower: p, rimSteppedThreshold: t });
  };
  events.listen(rngObjRimPower, 'input', updateRimShape);
  events.listen(rngObjRimThresh, 'input', updateRimShape);
  events.listen(selObjDitherSpace, 'change', () =>
    patchSelectedMaterials({ ditherSpace: selObjDitherSpace.value as DitherSpaceMode })
  );
  events.listen(rngObjAlpha, 'input', () => {
    const v = Number(rngObjAlpha.value);
    valObjAlpha.textContent = v.toFixed(2);
    patchSelectedMaterials({ alpha: v });
  });
  events.listen(chkObjGrading, 'change', () => patchSelectedMaterials({ useColorGrading: chkObjGrading.checked }));

  events.listen(chkSnapPos, 'change', () => patchSelectedSnap({ snapPosition: chkSnapPos.checked }));
  events.listen(chkAlignGrid, 'change', () => patchSelectedSnap({ alignPixelGrid: chkAlignGrid.checked }));
  events.listen(selAngleSnap, 'change', () =>
    patchSelectedSnap({ angleSnapMode: selAngleSnap.value as AngleSnapMode })
  );
  events.listen(rngAngleDeg, 'input', () => {
    const v = Number(rngAngleDeg.value);
    valAngleDeg.textContent = `${v}°`;
    patchSelectedSnap({ angleResolutionDeg: v });
  });

  events.listen(container.querySelector('#btn-toggle-id-mode')!, 'click', () => {
    if (!ctx.activeStage) return;
    const pixItems = ctx.activeStage.items.filter((i) => i.materials.some((m) => m.options.pixelated));
    if (pixItems.length === 0) return;
    const ids = new Set(pixItems.map((i) => i.materials[0]?.options.objectId ?? 1));
    const shouldSplit = ids.size <= 1;
    pixItems.forEach((item, idx) => {
      const nextId = shouldSplit ? 10 + (idx % 240) : 10;
      for (const m of item.materials) {
        if (m.options.pixelated) m.updateOptions({ objectId: nextId });
      }
    });
    renderSceneItemList();
    syncObjectInspector();
  });

  events.listen(container.querySelector('#btn-apply-all-obj')!, 'click', () => {
    const src = getSelectedItem()?.materials[0];
    if (!src || !ctx.activeStage) return;
    for (const item of ctx.activeStage.items) {
      for (const m of item.materials) {
        if (m.options.pixelated) {
          m.updateOptions({
            pixelSize: src.options.pixelSize,
            outlineColor: src.options.outlineColor,
            outlineAlpha: src.options.outlineAlpha,
            outlineWidthSteps: src.options.outlineWidthSteps,
            edgeHighlight: src.options.edgeHighlight,
            edgeBevelWeight: src.options.edgeBevelWeight,
            rimColor: src.options.rimColor,
            rimIntensity: src.options.rimIntensity,
            rimPower: src.options.rimPower,
            rimSteppedThreshold: src.options.rimSteppedThreshold,
            ditherSpace: src.options.ditherSpace,
            useColorGrading: src.options.useColorGrading,
          });
        }
      }
      const attach = item.snapTarget.userData.pixelizer as PixelizerObjectAttachment | undefined;
      if (attach) attach.snap.alignmentPixelSize = src.options.pixelSize;
      item.object.traverse((c) => {
        const a = c.userData.pixelizer as PixelizerObjectAttachment | undefined;
        if (a) a.snap.alignmentPixelSize = src.options.pixelSize;
      });
    }
    renderSceneItemList();
  });

  const bindTextureSlot = (
    inputId: string,
    clearId: string,
    prop: 'albedoMap' | 'normalMap' | 'emissionMap',
    isSrgb: boolean
  ) => {
    const inp = container.querySelector<HTMLInputElement>(inputId)!;
    const clr = container.querySelector<HTMLButtonElement>(clearId)!;
    events.listen(inp, 'change', async () => {
      const f = inp.files?.[0];
      if (!f) return;
      const tex = await createPreviewTextureFromFile(f, isSrgb);
      patchSelectedMaterials({ [prop]: tex });
      syncObjectInspector();
      inp.value = '';
    });
    events.listen(clr, 'click', () => {
      patchSelectedMaterials({ [prop]: null });
      syncObjectInspector();
    });
  };
  bindTextureSlot('#file-tex-albedo', '#btn-clr-albedo', 'albedoMap', true);
  bindTextureSlot('#file-tex-normal', '#btn-clr-normal', 'normalMap', false);
  bindTextureSlot('#file-tex-emit', '#btn-clr-emit', 'emissionMap', true);

  events.listen(selLightingRamp, 'change', () => {
    ctx.pipeline.activeRampId = selLightingRamp.value;
  });

  return {
    renderSceneItemList,
    syncObjectInspector,
    dispose: () => events.cleanup(),
  };
}
