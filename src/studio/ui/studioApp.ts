import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  PixelizerPipeline,
  type VisualStylePresetId,
} from '../../engine/PixelizerPipeline';
import { exportNwlIsometricSheet } from '../../engine/SpriteSheetExporter';
import { voxelizeObject3DRigged } from '../../engine/Voxelizer';
import { exportRiggedAssetToGlb } from '../../engine/rigging/RiggedExporter';
import type { UnwrapMetricsSummary } from '../../engine/procedural/PixelMaterialSynth';
import { SteppedAnimationController } from '../../engine/steppedAnimation';
import type { DebugViewMode } from '../../engine/types';
import type { PlaySandboxHandle } from '../../sandbox/NwlPlaySandbox';
import {
  createEventRegistry,
  disposeGroupResources,
  type StudioContext,
} from '../state/studioContext';
import { mountAnimViewerPanel } from './animViewerPanel';
import { mountExportPanel } from './exportPanel';
import { mountGeneratorPanel } from './generatorPanel';
import { ICONS } from './icons';
import { mountObjectInspectorPanel } from './objectInspectorPanel';
import { mountPaletteEditorTab } from './paletteEditor';
import { mountPipelinePanel } from './pipelinePanel';
import { createStageManager } from './stageManager';

export interface PixelizerStudioBridge {
  loadPreset: (presetId: string) => Promise<void>;
  setStylePreset: (style: VisualStylePresetId) => void;
  getRenderStats: () => ReturnType<PixelizerPipeline['getRenderStats']>;
  exportCurrentNwlSheet: (opts?: { targetCharHeightPx?: number; framesPerDirection?: number }) => {
    width: number;
    height: number;
    rows: number;
    cols: number;
    clippedFrames: number;
    imageDataUrl: string;
    atlasJson: string;
  } | null;
  exportCurrentGlbBase64: (opts?: { quantizeAlbedo?: boolean; quantizeDither?: boolean }) => Promise<{
    base64: string;
    byteLength: number;
    meshCount: number;
    skinnedMeshCount: number;
    boneCount: number;
    clipCount: number;
  }> | null;
  getStageSummary: () => {
    name: string;
    heightM: number;
    triangles: number;
    unwrapMetrics: UnwrapMetricsSummary | null;
  } | null;
}

declare global {
  interface Window {
    __PIXELIZER_STUDIO__?: PixelizerStudioBridge;
  }
}

export function mountPixelizerStudio(rootElement: HTMLElement): () => void {
  rootElement.innerHTML = `
    <header class="studio-topbar">
      <div class="topbar-left">
        <div class="brand-lockup">
          <div class="brand-mark" aria-hidden="true">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
          <div>
            <h1 class="brand-title">Pixelizer 3D Engine</h1>
            <div class="brand-sub">WebGL2 MRT Pipeline</div>
          </div>
        </div>
        <select id="sel-demo-scene" class="select-ctrl" aria-label="Demo Scene Preset">
          <optgroup label="Nowhereland (NWL Oficial)">
            <option value="nwl_knight">NWL: Herói Cavaleiro (1.79m · Shell)</option>
            <option value="nwl_archer">NWL: Herói Arqueiro (1.79m · Arco)</option>
            <option value="nwl_mage">NWL: Herói Mago (1.79m · Cajado)</option>
            <option value="nwl_starter_city">NWL: Cidade dos Portais (6 Casas + 9 NPCs)</option>
            <option value="nwl_bestiary">NWL: Bestiário (5 Inimigos + Boss Demônio)</option>
            <option value="nwl_dungeon_floor1">NWL: Ruínas Verdes · Andar 1</option>
            <option value="nwl_tileset_ruins">NWL: Tileset Modular 1.5m</option>
            <option value="nwl_spells_vfx">NWL: Magias &amp; VFX 3D Pixelados</option>
          </optgroup>
          <optgroup label="Referência Visual">
            <option value="char_fox">Ref: Wild Fox (SNES Dark Fantasy 3×3)</option>
          </optgroup>
          <optgroup label="Legacy Archive (Genéricos)">
            <option value="rover">Legacy: Hover Rover &amp; Drone</option>
            <option value="knight">Legacy: Pixel Knight &amp; Gear</option>
            <option value="creep_lab">Legacy: Creep &amp; Edge Lab</option>
            <option value="relic_chest">Legacy: Relic Chest &amp; Crystal</option>
            <option value="hybrid_diorama">Legacy: Hybrid 3D + Pixel</option>
            <option value="ual_knight">Legacy UAL: Skinned Knight</option>
            <option value="ual_knight_rigid">Legacy UAL: Rigid Knight</option>
            <option value="ual_zombie">Legacy UAL: Zombie (Voxel)</option>
            <option value="ual_dungeon">Legacy WFC: Dungeon 4×4</option>
            <option value="char_knight">Legacy GLB: RPG Knight (76 Clips)</option>
            <option value="char_robot">Legacy GLB: Expressive Bot</option>
            <option value="char_soldier">Legacy GLB: Tactical Soldier</option>
          </optgroup>
        </select>
        <select id="sel-style-preset" class="select-ctrl" aria-label="Visual Style Preset" title="Preset Visual Oficial vs Teste Experimental">
          <option value="nwl_snes">Estilo: NWL SNES Dark Fantasy (3×3)</option>
          <option value="hades_lab">Lab: Hades Graphic Ink v2 (2px + Rim)</option>
        </select>
        <button id="btn-play-sandbox" class="btn btn-primary" type="button" title="Abrir Sandbox Jogável (Cidade + Ruínas Andar 1)">
          ${ICONS.play}
          <span>Play Sandbox</span>
        </button>
      </div>

      <div class="topbar-center">
        <label class="btn btn-sm" title="Import .glb, .gltf, .obj, .fbx or .stl">
          ${ICONS.upload}
          <span>Import 3D</span>
          <input id="file-model-input" type="file" accept=".glb,.gltf,.obj,.fbx,.stl" style="display:none;" />
        </label>
        <button id="btn-split-compare" class="btn btn-sm" type="button" title="Toggle Raw 3D vs Pixelized Split Compare">
          ${ICONS.split}
          <span>A/B</span>
        </button>
        <button id="btn-motion-test" class="btn btn-sm" type="button" title="Sweep object across grid to test Pixel Creep snapping">
          ${ICONS.grid}
          <span>Creep</span>
        </button>
        <select id="sel-debug-view" class="select-ctrl select-ctrl-sm" aria-label="Debug Render Pass">
          <option value="final">View: Final</option>
          <option value="raw_3d">View: Raw 3D</option>
          <option value="seed_dither">View: Seeds</option>
          <option value="object_ids">View: Object IDs</option>
          <option value="normals">View: Normals</option>
          <option value="depth">View: Depth</option>
          <option value="edges">View: Outlines</option>
        </select>
      </div>

      <div class="topbar-right">
        <button id="btn-quick-png" class="btn" type="button">
          ${ICONS.camera}
          <span>Snapshot</span>
        </button>
      </div>
    </header>

    <main class="studio-workspace">
      <section class="viewport-stage" id="viewport-stage">
        <canvas id="studio-canvas" class="viewport-canvas"></canvas>

        <div id="drop-overlay" class="drop-overlay">
          <strong>Drop 3D Model Here</strong>
          <span>Supports .GLB, .GLTF, .OBJ, .FBX, and .STL</span>
        </div>

        <div id="scene-caption" class="scene-caption">
          <div id="scene-caption-title" class="scene-caption-title">Nowhereland Studio</div>
          <div id="scene-caption-desc" class="scene-caption-desc"></div>
        </div>

        <div id="split-labels" class="split-labels">
          <span class="split-tag">RAW 3D</span>
          <span class="split-tag">PIXELIZED</span>
        </div>

        <div id="split-handle" class="split-handle" style="left:50%;">
          <div class="split-handle-knob">||</div>
        </div>

        <div class="viewport-bottom-bar">
          <div id="viewport-hud" class="viewport-hud">
            <span class="hud-metric">BUF <strong id="hud-buf">320×180</strong></span>
            <span class="hud-metric">PX <strong id="hud-wpx">0.012</strong>u</span>
            <span class="hud-metric">CAM <strong id="hud-cam">ORTHO</strong></span>
            <span class="hud-metric">STEP <strong id="hud-step">8 FPS</strong></span>
            <span class="hud-metric">PERF <strong id="hud-perf">0c · 0t · 0ms</strong></span>
          </div>

          <div class="viewport-dock">
            <button class="btn btn-sm" id="btn-cam-iso" type="button">Iso 2:1</button>
            <button class="btn btn-sm" id="btn-cam-front" type="button">Front</button>
            <button class="btn btn-sm" id="btn-cam-side" type="button">Side</button>
            <button class="btn btn-sm" id="btn-cam-top" type="button">Top</button>
            <div class="dock-sep"></div>
            <button class="btn btn-sm is-active" id="btn-toggle-proj" type="button">Ortho</button>
            <div class="dock-sep"></div>
            <button class="btn btn-sm btn-icon" id="btn-anim-play" type="button" title="Play / Pause Stepped Animation">
              ${ICONS.pause}
            </button>
            <select id="sel-step-fps" class="select-ctrl select-ctrl-sm" aria-label="Stepped FPS">
              <option value="0">Smooth (60+ FPS)</option>
              <option value="6">Stepped 6 FPS</option>
              <option value="8" selected>Stepped 8 FPS</option>
              <option value="12">Stepped 12 FPS</option>
              <option value="16">Stepped 16 FPS</option>
              <option value="24">Stepped 24 FPS</option>
            </select>
            <select id="sel-anim-clip" class="select-ctrl select-ctrl-sm" style="display:none;" aria-label="Animation Clip"></select>
          </div>
        </div>
      </section>

      <aside class="inspector-panel">
        <nav class="inspector-tabs" role="tablist">
          <button class="tab-btn is-active" data-tab="pipeline" type="button">Pipeline</button>
          <button class="tab-btn" data-tab="object" type="button">Object</button>
          <button class="tab-btn" data-tab="palette" type="button">Palette</button>
          <button class="tab-btn" data-tab="anim" type="button">Anim/Rig</button>
          <button class="tab-btn" data-tab="generate" type="button">Generate</button>
          <button class="tab-btn" data-tab="export" type="button">Export</button>
        </nav>

        <div class="inspector-body">
          <div class="tab-pane is-active" data-pane="pipeline" id="pane-pipeline-host"></div>
          <div class="tab-pane" data-pane="object" id="pane-object-host"></div>
          <div class="tab-pane" data-pane="palette" id="pane-palette-host"></div>
          <div class="tab-pane" data-pane="anim" id="pane-anim-host"></div>
          <div class="tab-pane" data-pane="generate" id="pane-generate-host"></div>
          <div class="tab-pane" data-pane="export" id="pane-export-host"></div>
        </div>
      </aside>
    </main>
  `;

  const events = createEventRegistry();
  const cleanupHandlers: (() => void)[] = [];

  const stageEl = rootElement.querySelector<HTMLElement>('#viewport-stage')!;
  const canvas = rootElement.querySelector<HTMLCanvasElement>('#studio-canvas')!;
  const dropOverlay = rootElement.querySelector<HTMLElement>('#drop-overlay')!;
  const captionTitle = rootElement.querySelector<HTMLElement>('#scene-caption-title')!;
  const captionDesc = rootElement.querySelector<HTMLElement>('#scene-caption-desc')!;
  const sceneCaptionEl = rootElement.querySelector<HTMLElement>('#scene-caption')!;
  const splitHandle = rootElement.querySelector<HTMLElement>('#split-handle')!;
  const splitLabels = rootElement.querySelector<HTMLElement>('#split-labels')!;

  const hudBuf = rootElement.querySelector<HTMLElement>('#hud-buf')!;
  const hudWpx = rootElement.querySelector<HTMLElement>('#hud-wpx')!;
  const hudCam = rootElement.querySelector<HTMLElement>('#hud-cam')!;
  const hudStep = rootElement.querySelector<HTMLElement>('#hud-step')!;
  const hudPerf = rootElement.querySelector<HTMLElement>('#hud-perf')!;

  const selDemo = rootElement.querySelector<HTMLSelectElement>('#sel-demo-scene')!;
  const selStylePreset = rootElement.querySelector<HTMLSelectElement>('#sel-style-preset')!;
  const btnPlaySandbox = rootElement.querySelector<HTMLButtonElement>('#btn-play-sandbox')!;
  const selAnimClip = rootElement.querySelector<HTMLSelectElement>('#sel-anim-clip')!;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // ProPixelizer strictly requires disabling MSAA on pixelized targets
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  const pipeline = new PixelizerPipeline(
    renderer,
    {
      filterMode: 'only_pixelized',
      usePixelExpansion: true,
      backgroundColor: '#13161f',
    },
    {
      orthographic: true,
      orthoHeight: 5.8,
      worldSpacePixelSize: 0.024,
    }
  );

  const scene = new THREE.Scene();
  const dirLight = new THREE.DirectionalLight('#fff6e8', 1.4);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 35;
  dirLight.shadow.camera.left = -6;
  dirLight.shadow.camera.right = 6;
  dirLight.shadow.camera.top = 6;
  dirLight.shadow.camera.bottom = -6;
  dirLight.shadow.bias = -0.0006;

  const hemiLight = new THREE.HemisphereLight('#7f93c2', '#262b38', 0.6);
  const ambientLight = new THREE.AmbientLight('#7f93c2', 0.35);
  scene.add(dirLight, hemiLight, ambientLight);

  const orthoCamera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 80);
  const perspCamera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 80);
  const orbitTarget = new THREE.Vector3(0, 1.0, 0);
  const controls = new OrbitControls(orthoCamera, canvas);
  controls.enableDamping = false;
  controls.target.copy(orbitTarget);

  const animCtrl = new SteppedAnimationController();
  const overlayScene = new THREE.Scene();

  const ctx: StudioContext = {
    rootElement,
    stageEl,
    canvas,
    renderer,
    pipeline,
    scene,
    overlayScene,
    dirLight,
    hemiLight,
    ambientLight,
    orthoCamera,
    perspCamera,
    activeCamera: orthoCamera,
    orbitTarget,
    controls,
    animCtrl,

    lightAzimuthDeg: 42,
    lightElevationDeg: 54,
    skeletonHelper: null,
    skeletonOverlayEnabled: false,
    animViewerHandle: null,
    generatorHandle: null,
    lastStageOrigin: 'preset',
    nativeModelClips: [],
    activeStructureRoot: null,
    activePlayerInstance: null,
    activeSandbox: null,
    activeStage: null,
    activeVoxel: null,
    isVoxelMode: false,
    loadRequestToken: 0,
    selectedItemId: '',
    motionCreepTest: false,

    actions: {} as StudioContext['actions'],
    onCleanup: (fn) => cleanupHandlers.push(fn),
    disposeAll: () => {},
  };

  function updateSunDirection(): void {
    const az = THREE.MathUtils.degToRad(ctx.lightAzimuthDeg);
    const el = THREE.MathUtils.degToRad(ctx.lightElevationDeg);
    const x = Math.cos(el) * Math.sin(az);
    const y = Math.sin(el);
    const z = Math.cos(el) * Math.cos(az);
    dirLight.position.set(x * 12, y * 12, z * 12);
    pipeline.pipelineConfig.lightDirection = [x, y, z];
  }
  updateSunDirection();

  function setCameraPose(elevationDeg: number, azimuthDeg: number, dist = 12): void {
    const el = THREE.MathUtils.degToRad(elevationDeg);
    const az = THREE.MathUtils.degToRad(azimuthDeg);
    const offset = new THREE.Vector3(
      dist * Math.cos(el) * Math.sin(az),
      dist * Math.sin(el),
      dist * Math.cos(el) * Math.cos(az)
    );
    orthoCamera.position.copy(orbitTarget).add(offset);
    orthoCamera.zoom = 1;
    perspCamera.position.copy(orbitTarget).add(offset.clone().multiplyScalar(0.62));
    controls.target.copy(orbitTarget);
    controls.update();
  }
  setCameraPose(30, 45);

  function syncSkeletonHelper(): void {
    if (ctx.skeletonHelper) {
      ctx.skeletonHelper.removeFromParent();
      ctx.skeletonHelper.dispose();
      ctx.skeletonHelper = null;
    }
    if (!ctx.skeletonOverlayEnabled || !ctx.activeStage) return;
    let hasBone = false;
    ctx.activeStage.subjectRoot.traverse((o) => {
      if (o instanceof THREE.Bone) hasBone = true;
    });
    if (!hasBone) return;
    ctx.skeletonHelper = new THREE.SkeletonHelper(ctx.activeStage.subjectRoot);
    const mat = ctx.skeletonHelper.material as THREE.LineBasicMaterial;
    mat.color.set('#45e6ff');
    mat.depthTest = false;
    mat.transparent = true;
    mat.opacity = 0.92;
    overlayScene.add(ctx.skeletonHelper);
  }

  function syncAnimClipSelector(clips: THREE.AnimationClip[], activeIdx: number): void {
    if (clips.length > 0) {
      selAnimClip.innerHTML = clips
        .map((clip, i) => `<option value="${i}">${clip.name || `Clip ${i + 1}`}</option>`)
        .join('');
      selAnimClip.value = String(Math.max(0, Math.min(clips.length - 1, activeIdx)));
      selAnimClip.style.display = 'inline-block';
    } else {
      selAnimClip.innerHTML = '';
      selAnimClip.style.display = 'none';
    }
  }

  function triggerDownload(href: string, filename: string): void {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.click();
  }

  function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getExportSlug(): string {
    const raw = (ctx.activeStage?.name || selDemo.value || 'pixelizer_model')
      .toLowerCase()
      .replace(/^imported:\s*/i, '')
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return raw || 'pixelizer_model';
  }

  function withIsolatedSubject<T>(fn: () => T): T {
    const isolate =
      rootElement.querySelector<HTMLInputElement>('#chk-exp-isolate')?.checked ?? true;
    const hidden: { obj: THREE.Object3D; vis: boolean }[] = [];
    if (isolate && ctx.activeStage) {
      for (const child of ctx.activeStage.sceneRoot.children) {
        if (child !== ctx.activeStage.subjectRoot && child !== ctx.activeVoxel?.group) {
          hidden.push({ obj: child, vis: child.visible });
          child.visible = false;
        }
      }
    }
    try {
      return fn();
    } finally {
      for (const h of hidden) h.obj.visible = h.vis;
    }
  }

  // Mount Modular Panels
  const pipelinePanel = mountPipelinePanel(
    rootElement.querySelector<HTMLElement>('#pane-pipeline-host')!,
    ctx
  );
  const objectPanel = mountObjectInspectorPanel(
    rootElement.querySelector<HTMLElement>('#pane-object-host')!,
    ctx
  );
  const exportPanel = mountExportPanel(
    rootElement.querySelector<HTMLElement>('#pane-export-host')!,
    ctx
  );

  const stageMgr = createStageManager(ctx, {
    selDemo,
    selStylePreset,
    btnPlaySandbox,
    captionTitle,
    captionDesc,
    sceneCaptionEl,
    onResetExportStats: exportPanel.resetStatsOnStageChange,
  });

  ctx.actions = {
    syncPipelineUi: pipelinePanel.syncFromPipeline,
    syncObjectInspector: objectPanel.syncObjectInspector,
    renderSceneItemList: objectPanel.renderSceneItemList,
    syncConversionModeUi: exportPanel.syncConversionModeUi,
    setVoxelMode: exportPanel.setVoxelMode,
    rebuildVoxelPreview: exportPanel.rebuildVoxelPreview,
    scheduleVoxelRebuild: exportPanel.scheduleVoxelRebuild,
    generateCurrentVoxelGrid: exportPanel.generateCurrentVoxelGrid,
    disposeVoxelPreview: exportPanel.disposeVoxelPreview,
    syncSkeletonHelper,
    syncAnimClipSelector,
    applyStage: stageMgr.applyStage,
    loadPresetSelection: stageMgr.loadPresetSelection,
    handleModelImport: stageMgr.handleModelImport,
    enterPlaySandbox: stageMgr.enterPlaySandbox,
    exitPlaySandbox: stageMgr.exitPlaySandbox,
    updateSunDirection,
    setCameraPose,
    applyStageCameraFraming: stageMgr.applyStageCameraFraming,
    getExportSlug,
    triggerDownload,
    downloadBlob,
    withIsolatedSubject,
  };

  const paletteEditor = mountPaletteEditorTab(
    rootElement.querySelector<HTMLElement>('#pane-palette-host')!,
    pipeline,
    {
      onPaletteOrDitherChanged: () => {
        const chkVoxelPal = rootElement.querySelector<HTMLInputElement>('#chk-voxel-pal');
        if (ctx.isVoxelMode && chkVoxelPal?.checked) {
          exportPanel.scheduleVoxelRebuild();
        }
      },
    }
  );

  ctx.animViewerHandle = mountAnimViewerPanel(
    rootElement.querySelector<HTMLElement>('#pane-anim-host')!,
    {
      getSubjectRoot: () => ctx.activeStage?.subjectRoot ?? null,
      getNativeClips: () => ctx.nativeModelClips,
      setModelClips: (clips, activeName) => {
        if (!ctx.activeStage) return;
        animCtrl.bindModel(ctx.activeStage.subjectRoot, clips);
        let idx = activeName ? clips.findIndex((c) => c.name === activeName) : -1;
        if (idx < 0) idx = 0;
        animCtrl.playClip(idx);
        syncAnimClipSelector(clips, idx);
        ctx.animViewerHandle?.refreshFromActiveStage();
      },
      setActiveClipByIndex: (index, crossFadeSec = 0) => {
        animCtrl.playClip(index, crossFadeSec);
        selAnimClip.value = String(index);
        if (ctx.isVoxelMode) exportPanel.scheduleVoxelRebuild();
      },
      getActiveClipName: () => animCtrl.getActiveClip()?.name ?? '',
      getSkeletonOverlayEnabled: () => ctx.skeletonOverlayEnabled,
      setSkeletonOverlayEnabled: (enabled) => {
        ctx.skeletonOverlayEnabled = enabled;
        syncSkeletonHelper();
      },
      onVoxelizeRiggedRequested: () => {
        if (!ctx.activeStage) return;
        const rngVoxelRes = rootElement.querySelector<HTMLInputElement>('#rng-voxel-res');
        const chkVoxelPal = rootElement.querySelector<HTMLInputElement>('#chk-voxel-pal');
        const chkVoxelDither = rootElement.querySelector<HTMLInputElement>('#chk-voxel-dither');
        const voxRes = voxelizeObject3DRigged(
          ctx.activeStage.subjectRoot,
          {
            resolution: Number(rngVoxelRes?.value) || 24,
            palette: chkVoxelPal?.checked ? pipeline.getActivePaletteEntry().config : null,
            dither3d: Boolean(chkVoxelDither?.checked),
            fillSolidInterior: true,
          },
          pipeline.getSharedResourcesForMaterial()
        );
        const { wrapScene, items } = stageMgr.buildStageWrapAndItems(
          voxRes.root,
          'Voxelized UAL Rig',
          [voxRes.material]
        );
        animCtrl.dispose();
        stageMgr.applyStage({
          name: `Voxel Rigged: ${ctx.activeStage.name}`,
          description: `${voxRes.grid.dimensions.join('×')} (${voxRes.grid.voxels.length} voxels) auto-rigged onto 65-bone UAL Skeleton.`,
          subjectRoot: voxRes.root,
          sceneRoot: wrapScene,
          items,
          updateAnimation: (t, motionTest) => {
            voxRes.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
          },
        });
        stageMgr.bindUalClipsToSubject(voxRes.root, 'Idle_Loop');
      },
      getSharedMaterialResources: () => pipeline.getSharedResourcesForMaterial(),
      onPropAttachedToSubject: () => {
        stageMgr.refreshStageSceneItems();
        syncSkeletonHelper();
      },
      getExportSlug,
      downloadBlob,
      animCtrl,
    }
  );

  ctx.generatorHandle = mountGeneratorPanel(
    rootElement.querySelector<HTMLElement>('#pane-generate-host')!,
    {
      getSharedMaterialResources: () => pipeline.getSharedResourcesForMaterial(),
      mountGeneratedCharacter: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountGeneratedCharacter(res, 'Sword_Regular_A');
      },
      mountGeneratedProp: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountGeneratedProp(res);
      },
      mountGeneratedStructure: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountGeneratedStructure(res);
      },
      mountNwlPlayer: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountNwlPlayer(res);
      },
      mountNwlNpc: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountNwlNpc(res);
      },
      mountNwlMonster: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountNwlMonster(res);
      },
      mountNwlCustomScene: (opts) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountNwlCustomScene(opts);
      },
      mountNwlSpellVfx: (res) => {
        ctx.lastStageOrigin = 'generator';
        stageMgr.mountNwlSpellVfx(res);
      },
      getCurrentPlayerInstance: () => ctx.activePlayerInstance,
      getCurrentStructureRoot: () => ctx.activeStructureRoot,
      downloadBlob,
      onFinishOptionsChanged: () => {
        if (ctx.activeSandbox) {
          const curZone = ctx.activeSandbox.getState().zone;
          stageMgr.exitPlaySandbox(false);
          stageMgr.enterPlaySandbox();
          const restored = ctx.activeSandbox as PlaySandboxHandle | null;
          if (curZone === 'dungeon') restored?.enterZone('dungeon');
          return;
        }
        if (ctx.lastStageOrigin === 'generator' && ctx.generatorHandle?.rebuildLastGenerated()) {
          return;
        }
        void stageMgr.loadPresetSelection(selDemo.value || 'nwl_knight');
      },
    }
  );

  // Tab Navigation
  const tabBtns = rootElement.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const tabPanes = rootElement.querySelectorAll<HTMLElement>('.tab-pane');
  tabBtns.forEach((btn) => {
    events.listen(btn, 'click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      tabPanes.forEach((p) => p.classList.toggle('is-active', p.dataset.pane === target));
    });
  });

  // Topbar & Dock Event Bindings
  events.listen(selDemo, 'change', () => {
    void stageMgr.loadPresetSelection(selDemo.value);
  });

  const applyStylePresetFromUi = (preset: VisualStylePresetId) => {
    selStylePreset.value = preset;
    pipeline.applyVisualStylePreset(preset, scene);
    dirLight.color.set(pipeline.pipelineConfig.lightColor);
    dirLight.intensity = pipeline.pipelineConfig.lightIntensity;
    hemiLight.color.set(pipeline.pipelineConfig.ambientSkyColor);
    ambientLight.color.set(pipeline.pipelineConfig.ambientSkyColor);
    paletteEditor.refresh();
    exportPanel.syncConversionModeUi();
    objectPanel.syncObjectInspector();
  };

  events.listen(selStylePreset, 'change', () => {
    applyStylePresetFromUi(selStylePreset.value as VisualStylePresetId);
  });

  events.listen(btnPlaySandbox, 'click', () => stageMgr.enterPlaySandbox());

  const fileModelInput = rootElement.querySelector<HTMLInputElement>('#file-model-input')!;
  events.listen(fileModelInput, 'change', () => {
    const f = fileModelInput.files?.[0];
    if (f) void stageMgr.handleModelImport(f);
    fileModelInput.value = '';
  });

  events.listen(stageEl, 'dragover', (e) => {
    (e as DragEvent).preventDefault();
    dropOverlay.classList.add('is-visible');
  });
  events.listen(stageEl, 'dragleave', () => dropOverlay.classList.remove('is-visible'));
  events.listen(stageEl, 'drop', (e) => {
    const de = e as DragEvent;
    de.preventDefault();
    dropOverlay.classList.remove('is-visible');
    const f = de.dataTransfer?.files?.[0];
    if (f) void stageMgr.handleModelImport(f);
  });

  const btnSplit = rootElement.querySelector<HTMLButtonElement>('#btn-split-compare')!;
  events.listen(btnSplit, 'click', () => {
    pipeline.pipelineConfig.splitCompare = !pipeline.pipelineConfig.splitCompare;
    btnSplit.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    splitHandle.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    splitLabels.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    sceneCaptionEl.style.display = pipeline.pipelineConfig.splitCompare ? 'none' : 'block';
  });

  let draggingSplit = false;
  events.listen(splitHandle, 'pointerdown', (e) => {
    draggingSplit = true;
    splitHandle.setPointerCapture((e as PointerEvent).pointerId);
  });
  events.listen(window, 'pointermove', (e) => {
    if (!draggingSplit) return;
    const rect = stageEl.getBoundingClientRect();
    const pos = Math.max(
      0.05,
      Math.min(0.95, ((e as PointerEvent).clientX - rect.left) / Math.max(1, rect.width))
    );
    pipeline.pipelineConfig.splitPosition = pos;
    splitHandle.style.left = `${pos * 100}%`;
  });
  events.listen(window, 'pointerup', () => {
    draggingSplit = false;
  });

  const btnMotion = rootElement.querySelector<HTMLButtonElement>('#btn-motion-test')!;
  events.listen(btnMotion, 'click', () => {
    ctx.motionCreepTest = !ctx.motionCreepTest;
    btnMotion.classList.toggle('is-active', ctx.motionCreepTest);
  });

  const selDebugView = rootElement.querySelector<HTMLSelectElement>('#sel-debug-view')!;
  events.listen(selDebugView, 'change', () => {
    pipeline.pipelineConfig.debugView = selDebugView.value as DebugViewMode;
  });

  events.listen(rootElement.querySelector('#btn-quick-png')!, 'click', exportPanel.exportSingleSnapshot);
  events.listen(rootElement.querySelector('#btn-cam-iso')!, 'click', () => setCameraPose(30, 45));
  events.listen(rootElement.querySelector('#btn-cam-front')!, 'click', () => setCameraPose(12, 0));
  events.listen(rootElement.querySelector('#btn-cam-side')!, 'click', () => setCameraPose(12, 90));
  events.listen(rootElement.querySelector('#btn-cam-top')!, 'click', () => setCameraPose(88, 45));

  const btnProj = rootElement.querySelector<HTMLButtonElement>('#btn-toggle-proj')!;
  events.listen(btnProj, 'click', () => {
    const toOrtho = !(ctx.activeCamera instanceof THREE.OrthographicCamera);
    const oldCam = ctx.activeCamera;
    ctx.activeCamera = toOrtho ? orthoCamera : perspCamera;
    ctx.activeCamera.position.copy(oldCam.position);
    ctx.activeCamera.quaternion.copy(oldCam.quaternion);
    controls.object = ctx.activeCamera;
    controls.update();
    pipeline.cameraConfig.orthographic = toOrtho;
    btnProj.textContent = toOrtho ? 'Ortho' : 'Persp';
    btnProj.classList.toggle('is-active', toOrtho);
  });

  const btnPlay = rootElement.querySelector<HTMLButtonElement>('#btn-anim-play')!;
  events.listen(btnPlay, 'click', () => {
    animCtrl.config.paused = !animCtrl.config.paused;
    btnPlay.innerHTML = animCtrl.config.paused ? ICONS.play : ICONS.pause;
  });

  events.listen(rootElement.querySelector<HTMLSelectElement>('#sel-step-fps')!, 'change', (e) => {
    const fps = Number((e.target as HTMLSelectElement).value);
    animCtrl.config.enabled = fps > 0;
    animCtrl.config.fps = fps;
  });
  events.listen(selAnimClip, 'change', () => {
    animCtrl.playClip(Number(selAnimClip.value), 0.18);
    ctx.animViewerHandle?.refreshFromActiveStage();
    if (ctx.isVoxelMode) exportPanel.scheduleVoxelRebuild();
  });

  // Viewport ResizeObserver
  const handleResize = () => {
    const rect = stageEl.getBoundingClientRect();
    const w = Math.max(2, Math.floor(rect.width));
    const h = Math.max(2, Math.floor(rect.height));
    pipeline.setSize(w, h);
  };
  const ro = new ResizeObserver(handleResize);
  ro.observe(stageEl);
  handleResize();

  // Headless CLI & Automation Bridge (pure browser, zero Node dependencies)
  window.__PIXELIZER_STUDIO__ = {
    loadPreset: async (presetId: string) => {
      selDemo.value = presetId;
      await stageMgr.loadPresetSelection(presetId);
    },
    setStylePreset: (style: VisualStylePresetId) => {
      applyStylePresetFromUi(style);
    },
    getRenderStats: () => pipeline.getRenderStats(),
    exportCurrentNwlSheet: (opts) => {
      if (!ctx.activeStage) return null;
      const target =
        ctx.isVoxelMode && ctx.activeVoxel ? ctx.activeVoxel.group : ctx.activeStage.subjectRoot;
      const res = withIsolatedSubject(() =>
        exportNwlIsometricSheet(
          pipeline,
          scene,
          target,
          {
            targetCharHeightPx: opts?.targetCharHeightPx ?? 108,
            framesPerDirection: opts?.framesPerDirection ?? 8,
          },
          !ctx.isVoxelMode && animCtrl.getClips().length > 0 ? animCtrl : undefined
        )
      );
      return {
        width: res.width,
        height: res.height,
        rows: res.rows,
        cols: res.cols,
        clippedFrames: res.clippedFrames,
        imageDataUrl: res.imageDataUrl,
        atlasJson: res.atlasJson,
      };
    },
    exportCurrentGlbBase64: (opts) => {
      if (!ctx.activeStage) return null;
      return exportRiggedAssetToGlb(ctx.activeStage.subjectRoot, animCtrl.getClips(), {
        name: getExportSlug(),
        quantizeAlbedo: opts?.quantizeAlbedo ?? false,
        quantizePalette: pipeline.getActivePaletteEntry().config,
        quantizeDither: opts?.quantizeDither ?? false,
      }).then(({ buffer, validation }) => {
        const bytes = new Uint8Array(buffer);
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return {
          base64: btoa(bin),
          byteLength: buffer.byteLength,
          meshCount: validation.meshCount,
          skinnedMeshCount: validation.skinnedMeshCount,
          boneCount: validation.boneCount,
          clipCount: validation.clipCount,
        };
      });
    },
    getStageSummary: () => {
      if (!ctx.activeStage) return null;
      ctx.activeStage.subjectRoot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(ctx.activeStage.subjectRoot);
      const size = new THREE.Vector3();
      box.getSize(size);
      const stats = pipeline.getRenderStats();
      return {
        name: ctx.activeStage.name,
        heightM: Number(size.y.toFixed(3)),
        triangles: stats.triangles,
        unwrapMetrics:
          (ctx.activeStage.subjectRoot.userData?.unwrapMetrics as UnwrapMetricsSummary | undefined) ??
          null,
      };
    },
  };

  // Initialize Default NWL Scene & Official Style Preset
  applyStylePresetFromUi('nwl_snes');
  selDemo.value = 'nwl_knight';
  void stageMgr.loadPresetSelection('nwl_knight');

  // Animation & Render Loop
  let rafId = 0;
  let lastNow = performance.now();

  const animate = (now: number) => {
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;

    if (ctx.activeSandbox) {
      ctx.activeSandbox.update(dt);
      const tgt = ctx.activeSandbox.getCameraTarget();
      const nextTarget = controls.target.clone().lerp(tgt, Math.min(1, dt * 8));
      const delta = nextTarget.clone().sub(controls.target);
      controls.target.copy(nextTarget);
      orthoCamera.position.add(delta);
      perspCamera.position.add(delta);
    } else {
      const qTime = animCtrl.update(dt);
      ctx.activeStage?.updateAnimation(qTime, ctx.motionCreepTest);
      if (ctx.activeVoxel && ctx.activeStage) {
        ctx.activeVoxel.group.position.copy(ctx.activeStage.subjectRoot.position);
        ctx.activeVoxel.group.rotation.copy(ctx.activeStage.subjectRoot.rotation);
        ctx.activeVoxel.group.scale.copy(ctx.activeStage.subjectRoot.scale);
      }
    }
    controls.update();

    pipeline.render(scene, ctx.activeCamera);
    if (ctx.skeletonOverlayEnabled && ctx.skeletonHelper) {
      renderer.setRenderTarget(null);
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(overlayScene, ctx.activeCamera);
      renderer.autoClear = true;
    }

    const grid = pipeline.getLastGrid();
    const perf = pipeline.getRenderStats();
    if (grid) {
      const isFull = pipeline.pipelineConfig.filterMode === 'full_scene';
      hudBuf.textContent = isFull
        ? `${grid.lowResWidth}×${grid.lowResHeight}`
        : `${canvas.width}×${canvas.height}`;
      hudWpx.textContent = grid.worldPixelSize.toFixed(3);
      hudCam.textContent = ctx.activeCamera instanceof THREE.OrthographicCamera ? 'ORTHO' : 'PERSP';
      hudStep.textContent = animCtrl.config.enabled ? `${animCtrl.config.fps} FPS` : 'SMOOTH';
      hudPerf.textContent = `${perf.drawCalls}c · ${perf.triangles}t · ${perf.avgRenderMs.toFixed(1)}ms`;
    }

    exportPanel.updateFlipbookPreview(dt);
  };
  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    delete window.__PIXELIZER_STUDIO__;
    events.cleanup();
    pipelinePanel.dispose();
    objectPanel.dispose();
    exportPanel.dispose();
    for (const fn of cleanupHandlers) fn();
    if (ctx.skeletonHelper) {
      ctx.skeletonHelper.removeFromParent();
      ctx.skeletonHelper.dispose();
    }
    exportPanel.disposeVoxelPreview();
    if (ctx.activeSandbox) {
      scene.remove(ctx.activeSandbox.root);
      ctx.activeSandbox.dispose();
      ctx.activeSandbox = null;
    }
    ro.disconnect();
    animCtrl.dispose();
    controls.dispose();
    if (ctx.activeStage) {
      ctx.activeStage.onCleanup?.();
      disposeGroupResources(ctx.activeStage.sceneRoot);
    }
    pipeline.dispose();
    renderer.dispose();
  };
}
