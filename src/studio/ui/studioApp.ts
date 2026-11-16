import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PixelizerMaterial } from '../../engine/PixelizerMaterial';
import {
  PixelizerPipeline,
  type PixelizerObjectAttachment,
} from '../../engine/PixelizerPipeline';
import {
  buildProceduralUalCharacter,
  type GeneratedCharacterResult,
} from '../../engine/procedural/CharacterBuilder';
import { type GeneratedPropResult } from '../../engine/procedural/PropBuilder';
import {
  buildProceduralStructure,
  type GeneratedStructureResult,
} from '../../engine/procedural/TilesetStructureSolver';
import { AnimationLibraryBank } from '../../engine/rigging/AnimationLibraryBank';
import {
  captureSingleFrameDataUrl,
  exportNwlIsometricSheet,
  exportTurntableSpriteSheet,
  type SpriteSheetExportResult,
} from '../../engine/SpriteSheetExporter';
import { SteppedAnimationController } from '../../engine/steppedAnimation';
import {
  buildVoxelMeshGroup,
  exportVoxelGridToGlb,
  exportVoxelGridToObj,
  exportVoxelGridToVox,
  voxelizeObject3D,
  voxelizeObject3DRigged,
} from '../../engine/Voxelizer';
import type {
  AngleSnapMode,
  DebugViewMode,
  LowResUpscaleMode,
  PixelizationFilterMode,
  ResolutionMode,
  ShadingWorkflow,
  SnapOptions,
  VoxelGridResult,
} from '../../engine/types';
import {
  loadModelFromFile,
  loadModelFromUrl,
  pickPreferredClipIndex,
  type LoadedModelResult,
} from '../loaders/modelLoader';
import {
  buildDemoScene,
  type BuiltDemoScene,
  type DemoPresetId,
  type SceneItemEntry,
} from '../presets/demoScenes';
import { mountAnimViewerPanel, type AnimViewerPanelHandle } from './animViewerPanel';
import { mountGeneratorPanel } from './generatorPanel';
import { ICONS } from './icons';
import { mountPaletteEditorTab } from './paletteEditor';

interface ActiveStage {
  name: string;
  description: string;
  subjectRoot: THREE.Group;
  sceneRoot: THREE.Group;
  items: SceneItemEntry[];
  updateAnimation: (quantizedTime: number, motionTest: boolean) => void;
}

interface ActiveVoxelPreview {
  grid: VoxelGridResult;
  group: THREE.Group;
}

interface CharacterPresetDef {
  url: string;
  filename: string;
  title: string;
  description: string;
}

const CHARACTER_PRESETS: Record<string, CharacterPresetDef> = {
  char_knight: {
    url: './models/Knight.glb',
    filename: 'Knight.glb',
    title: 'RPG Knight Warrior (CC0)',
    description:
      'KayKit articulated rig (15 meshes, 76 skeletal animations, texture atlas) using unified Object ID silhouettes.',
  },
  char_robot: {
    url: './models/RobotExpressive.glb',
    filename: 'RobotExpressive.glb',
    title: 'Expressive Robot (MIT)',
    description:
      'PBR rigged robot with blendshape morph targets & 14 clips rendered through dual palette LUT & bevel edges.',
  },
  char_soldier: {
    url: './models/Soldier.glb',
    filename: 'Soldier.glb',
    title: 'Tactical Soldier (MIT)',
    description:
      'High-detail Three.js SkinnedMesh soldier with Walk/Run/Idle clips & baked PBR armor textures.',
  },
  char_fox: {
    url: './models/Fox.glb',
    filename: 'Fox.glb',
    title: 'Quadruped Wild Fox (CC0)',
    description:
      'Low-poly skeletal creature with Survey/Walk/Run clips — great for 3×3 / 7×7 macropixel and 3D voxel testing.',
  },
};

function disposeGroupResources(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) m?.dispose();
    }
  });
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
          <optgroup label="Procedural Demos">
            <option value="rover">Preset: Hover Rover &amp; Drone</option>
            <option value="knight">Preset: Pixel Knight &amp; Gear</option>
            <option value="creep_lab">Preset: Creep &amp; Edge Lab</option>
            <option value="relic_chest">Preset: Relic Chest &amp; Crystal</option>
            <option value="hybrid_diorama">Preset: Hybrid 3D + Pixel</option>
          </optgroup>
          <optgroup label="UAL 65-Bone Autonomous (85 Anims)">
            <option value="ual_knight">UAL: Knight (Skinned + Sword)</option>
            <option value="ual_knight_rigid">UAL: NWL Rigid Knight (0 Skin)</option>
            <option value="ual_zombie">UAL: Zombie (Voxel Rigged)</option>
            <option value="ual_dungeon">WFC: Procedural Dungeon 4×4</option>
          </optgroup>
          <optgroup label="Articulated 3D Characters (GLB)">
            <option value="char_knight">Char: RPG Knight (CC0 · 76 Clips)</option>
            <option value="char_robot">Char: Expressive Bot (MIT · 14 Clips)</option>
            <option value="char_soldier">Char: Tactical Soldier (MIT · 4 Clips)</option>
            <option value="char_fox">Char: Wild Fox (CC0 · 3 Clips)</option>
          </optgroup>
        </select>
        <label class="btn" title="Import .glb, .gltf, .obj, .fbx or .stl">
          ${ICONS.upload}
          <span>Import 3D</span>
          <input id="file-model-input" type="file" accept=".glb,.gltf,.obj,.fbx,.stl" style="display:none;" />
        </label>
      </div>

      <div class="topbar-center">
        <button id="btn-split-compare" class="btn" type="button" title="Toggle Raw 3D vs Pixelized Split Compare">
          ${ICONS.split}
          <span>A/B Split</span>
        </button>
        <button id="btn-motion-test" class="btn" type="button" title="Sweep object across grid to test Pixel Creep snapping">
          ${ICONS.grid}
          <span>Creep Test</span>
        </button>
        <select id="sel-debug-view" class="select-ctrl" aria-label="Debug Render Pass">
          <option value="final">View: Final Composite</option>
          <option value="raw_3d">View: Raw 3D (Unpixelized)</option>
          <option value="seed_dither">View: Pass 1 Seeds</option>
          <option value="object_ids">View: Object IDs</option>
          <option value="normals">View: Encoded Normals</option>
          <option value="depth">View: Linear Depth</option>
          <option value="edges">View: Outlines &amp; Edges</option>
        </select>
      </div>

      <div class="topbar-right">
        <button id="btn-quick-png" class="btn btn-primary" type="button">
          ${ICONS.camera}
          <span>Snapshot PNG</span>
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
          <div id="scene-caption-title" class="scene-caption-title">Hover Rover &amp; Scout Drone</div>
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
          <!-- TAB 1: PIPELINE -->
          <div class="tab-pane is-active" data-pane="pipeline">
            <div class="ctrl-section">
              <div class="ctrl-section-head"><span>Render Path &amp; Camera Grid</span></div>
              <div class="ctrl-section-body">
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Conversion Mode</span>
                    <span id="val-conv-mode" class="slider-val">Hybrid</span>
                  </div>
                  <div class="segmented" style="width:100%;">
                    <button type="button" class="seg-btn is-active" data-filter="only_pixelized">Hybrid</button>
                    <button type="button" class="seg-btn" data-filter="full_scene">Full Scene</button>
                    <button type="button" class="seg-btn" data-filter="cel_hard">Cel Hard</button>
                    <button type="button" class="seg-btn" id="btn-mode-voxel" data-voxel="1">Voxel 3D</button>
                  </div>
                </div>
                <div class="field-row">
                  <label class="field-label" for="chk-pixel-expansion">Pixel Expansion (Attempt #3)</label>
                  <input id="chk-pixel-expansion" type="checkbox" checked />
                </div>
                <div class="field-row">
                  <label class="field-label" for="sel-res-mode">Resolution Mode</label>
                  <select id="sel-res-mode" class="select-ctrl select-ctrl-sm" style="width:170px;">
                    <option value="world_space_pixel_size">World Pixel Size</option>
                    <option value="fixed_downscale_ratio">Downscale Ratio</option>
                    <option value="fixed_target_resolution">Target Height (px)</option>
                  </select>
                </div>
                <div class="slider-row" id="row-world-px">
                  <div class="slider-head">
                    <span>World Pixel Size</span>
                    <span id="val-world-px" class="slider-val">0.024</span>
                  </div>
                  <input id="rng-world-px" type="range" min="0.008" max="0.065" step="0.002" value="0.024" />
                </div>
                <div class="slider-row" id="row-downscale" style="display:none;">
                  <div class="slider-head">
                    <span>Downscale Factor</span>
                    <span id="val-downscale" class="slider-val">3×</span>
                  </div>
                  <input id="rng-downscale" type="range" min="1" max="8" step="1" value="3" />
                </div>
                <div class="slider-row" id="row-target-h" style="display:none;">
                  <div class="slider-head">
                    <span>Target Vertical Res</span>
                    <span id="val-target-h" class="slider-val">220px</span>
                  </div>
                  <input id="rng-target-h" type="range" min="90" max="480" step="10" value="220" />
                </div>
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Camera Zoom / Ortho Height</span>
                    <span id="val-ortho-h" class="slider-val">5.8</span>
                  </div>
                  <input id="rng-ortho-h" type="range" min="2.2" max="22.0" step="0.2" value="5.8" />
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
                  <input id="chk-snap-cam" type="checkbox" checked />
                </div>
                <div class="field-row">
                  <label class="field-label" for="chk-subpixel-cam">Subpixel Smooth Pan</label>
                  <input id="chk-subpixel-cam" type="checkbox" />
                </div>
              </div>
            </div>

            <div class="ctrl-section">
              <div class="ctrl-section-head"><span>Outlines, Edges &amp; Bevel Lighting</span></div>
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
                  <input id="chk-norm-edge" type="checkbox" checked />
                </div>
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Normal Sensitivity</span>
                    <span id="val-norm-edge" class="slider-val">0.22</span>
                  </div>
                  <input id="rng-norm-edge" type="range" min="0.04" max="0.85" step="0.02" value="0.22" />
                </div>
                <div class="field-row">
                  <label class="field-label" for="chk-depth-edge">Depth Step Edges (Staircases)</label>
                  <input id="chk-depth-edge" type="checkbox" checked />
                </div>
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Edge Depth Threshold</span>
                    <span id="val-edge-depth" class="slider-val">0.012</span>
                  </div>
                  <input id="rng-edge-depth" type="range" min="0.002" max="0.05" step="0.002" value="0.012" />
                </div>
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Edge Highlight Strength</span>
                    <span id="val-edge-hl-str" class="slider-val">0.90</span>
                  </div>
                  <input id="rng-edge-hl-str" type="range" min="0" max="1.5" step="0.05" value="0.9" />
                </div>
                <div class="slider-row">
                  <div class="slider-head">
                    <span>Bevel Edges Reactivity</span>
                    <span id="val-bevel-str" class="slider-val">1.00</span>
                  </div>
                  <input id="rng-bevel-str" type="range" min="0" max="1.5" step="0.05" value="1.0" />
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
                    <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary);">
                      <input id="chk-bg-trans" type="checkbox" /> Clear Alpha
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: OBJECT & SHADER -->
          <div class="tab-pane" data-pane="object">
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
                  <input id="rng-obj-id" type="range" min="0" max="60" step="1" value="1" />
                </div>
                <div class="field-row">
                  <span class="field-label">Silhouette Outline</span>
                  <div class="field-control">
                    <input id="col-obj-outline" type="color" value="#14101c" />
                    <input id="rng-obj-outalpha" type="range" min="0" max="1" step="0.05" value="1" style="width:90px;" />
                  </div>
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
              <div class="ctrl-section-head"><span>Material &amp; Cel Lighting</span></div>
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
                    <span class="tex-status" id="tex-albedo-name">Albedo: None</span>
                    <label class="btn btn-sm" style="cursor:pointer;">Load<input id="file-tex-albedo" type="file" accept="image/*" style="display:none;" /></label>
                    <button id="btn-clr-albedo" class="btn btn-sm" type="button">Clr</button>
                  </div>
                  <div class="tex-slot-row">
                    <span class="tex-status" id="tex-normal-name">Normal: None</span>
                    <label class="btn btn-sm" style="cursor:pointer;">Load<input id="file-tex-normal" type="file" accept="image/*" style="display:none;" /></label>
                    <button id="btn-clr-normal" class="btn btn-sm" type="button">Clr</button>
                  </div>
                  <div class="tex-slot-row">
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
          </div>

          <!-- TAB 3: PALETTE & DITHER -->
          <div class="tab-pane" data-pane="palette" id="pane-palette-host"></div>

          <!-- TAB 4: ANIMVIEWER & RIGGING -->
          <div class="tab-pane" data-pane="anim" id="pane-anim-host"></div>

          <!-- TAB 5: AUTONOMOUS GENERATORS -->
          <div class="tab-pane" data-pane="generate" id="pane-generate-host"></div>

          <!-- TAB 6: EXPORT (SPRITES + NWL + 3D VOXEL MESH) -->
          <div class="tab-pane" data-pane="export">
            <div class="ctrl-section">
              <div class="ctrl-section-head"><span>NWL 40px Isometric Sheet (8 Real Dirs)</span></div>
              <div class="ctrl-section-body">
                <div class="field-row">
                  <span class="field-label">Target Height / Frames</span>
                  <div class="field-control">
                    <input id="num-nwl-h" class="input-ctrl" type="number" min="24" max="128" value="40" style="width:66px;height:26px;" title="Target Character Height (px)" />
                    <input id="num-nwl-frames" class="input-ctrl" type="number" min="1" max="16" value="8" style="width:66px;height:26px;" title="Frames per direction" />
                  </div>
                </div>
                <button id="btn-generate-nwl-sheet" class="btn btn-primary" type="button">
                  <span>Export NWL 8-Dir Sheet (Zero Clipping)</span>
                </button>
                <div id="nwl-sheet-stats" class="voxel-stats-box">
                  <span>8 Real Dirs (No flipX) · Binary Hard Alpha · ≥96px Safe Box</span>
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
          </div>
        </div>
      </aside>
    </main>
  `;

  // DOM References
  const stageEl = rootElement.querySelector<HTMLElement>('#viewport-stage')!;
  const canvas = rootElement.querySelector<HTMLCanvasElement>('#studio-canvas')!;
  const dropOverlay = rootElement.querySelector<HTMLElement>('#drop-overlay')!;
  const captionTitle = rootElement.querySelector<HTMLElement>('#scene-caption-title')!;
  const captionDesc = rootElement.querySelector<HTMLElement>('#scene-caption-desc')!;
  const splitHandle = rootElement.querySelector<HTMLElement>('#split-handle')!;
  const splitLabels = rootElement.querySelector<HTMLElement>('#split-labels')!;

  const hudBuf = rootElement.querySelector<HTMLElement>('#hud-buf')!;
  const hudWpx = rootElement.querySelector<HTMLElement>('#hud-wpx')!;
  const hudCam = rootElement.querySelector<HTMLElement>('#hud-cam')!;
  const hudStep = rootElement.querySelector<HTMLElement>('#hud-step')!;

  // Initialize Three.js WebGL2 Renderer + Pipeline
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // ProPixelizer strictly requires disabling MSAA on pixelized targets
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  const pipeline = new PixelizerPipeline(renderer, {
    filterMode: 'only_pixelized',
    usePixelExpansion: true,
    backgroundColor: '#13161f',
  }, {
    orthographic: true,
    orthoHeight: 5.8,
    worldSpacePixelSize: 0.024,
  });

  // Scene & Lights
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

  let lightAzimuthDeg = 42;
  let lightElevationDeg = 54;
  function updateSunDirection(): void {
    const az = THREE.MathUtils.degToRad(lightAzimuthDeg);
    const el = THREE.MathUtils.degToRad(lightElevationDeg);
    const x = Math.cos(el) * Math.sin(az);
    const y = Math.sin(el);
    const z = Math.cos(el) * Math.cos(az);
    dirLight.position.set(x * 12, y * 12, z * 12);
    pipeline.pipelineConfig.lightDirection = [x, y, z];
  }
  updateSunDirection();

  // Dual Cameras (Ortho default at 2:1 Iso 30°, 45° + Persp)
  const orthoCamera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 80);
  const perspCamera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 80);
  let activeCamera: THREE.Camera = orthoCamera;

  const orbitTarget = new THREE.Vector3(0, 1.0, 0);
  const controls = new OrbitControls(activeCamera, canvas);
  controls.enableDamping = false;
  controls.target.copy(orbitTarget);

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
  // Exact ProPixelizer 2:1 Isometric angle (30 deg pitch, 45 deg yaw)
  setCameraPose(30, 45);

  const animCtrl = new SteppedAnimationController();
  const overlayScene = new THREE.Scene();
  let skeletonHelper: THREE.SkeletonHelper | null = null;
  let skeletonOverlayEnabled = false;
  let animViewerHandle: AnimViewerPanelHandle | null = null;
  let nativeModelClips: THREE.AnimationClip[] = [];
  let activeStructureRoot: THREE.Object3D | null = null;

  let activeStage: ActiveStage | null = null;
  let activeVoxel: ActiveVoxelPreview | null = null;
  let isVoxelMode = false;
  let loadRequestToken = 0;
  let selectedItemId = '';
  let motionCreepTest = false;
  let sheetResult: SpriteSheetExportResult | null = null;
  let sheetImgEl: HTMLImageElement | null = null;
  let sheetAnimTimer = 0;
  let sheetFrameCursor = 0;

  const selAnimClip = rootElement.querySelector<HTMLSelectElement>('#sel-anim-clip')!;
  const sceneItemList = rootElement.querySelector<HTMLDivElement>('#scene-item-list')!;
  const selLightingRamp = rootElement.querySelector<HTMLSelectElement>('#sel-lighting-ramp')!;
  const valConvMode = rootElement.querySelector<HTMLElement>('#val-conv-mode')!;
  const filterBtns = rootElement.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const btnModeVoxel = rootElement.querySelector<HTMLButtonElement>('#btn-mode-voxel')!;
  const rngVoxelRes = rootElement.querySelector<HTMLInputElement>('#rng-voxel-res')!;
  const valVoxelRes = rootElement.querySelector<HTMLElement>('#val-voxel-res')!;
  const chkVoxelPal = rootElement.querySelector<HTMLInputElement>('#chk-voxel-pal')!;
  const chkVoxelDither = rootElement.querySelector<HTMLInputElement>('#chk-voxel-dither')!;
  const voxelStatsEl = rootElement.querySelector<HTMLElement>('#voxel-export-stats')!;
  const btnVoxelPreview = rootElement.querySelector<HTMLButtonElement>('#btn-voxel-preview')!;

  // Populate Lighting Ramps dropdown
  for (const r of pipeline.getLightingRamps()) {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.name;
    selLightingRamp.appendChild(opt);
  }
  selLightingRamp.value = pipeline.activeRampId;

  function syncSkeletonHelper(): void {
    if (skeletonHelper) {
      skeletonHelper.removeFromParent();
      skeletonHelper.dispose();
      skeletonHelper = null;
    }
    if (!skeletonOverlayEnabled || !activeStage) return;
    let hasBone = false;
    activeStage.subjectRoot.traverse((o) => {
      if (o instanceof THREE.Bone) hasBone = true;
    });
    if (!hasBone) return;
    skeletonHelper = new THREE.SkeletonHelper(activeStage.subjectRoot);
    const mat = skeletonHelper.material as THREE.LineBasicMaterial;
    mat.color.set('#45e6ff');
    mat.depthTest = false;
    mat.transparent = true;
    mat.opacity = 0.92;
    overlayScene.add(skeletonHelper);
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

  function syncConversionModeUi(): void {
    const mode = pipeline.pipelineConfig.filterMode;
    const modeLabel =
      mode === 'full_scene'
        ? 'Full Scene'
        : mode === 'cel_hard'
        ? 'Cel Hard'
        : 'Hybrid';
    valConvMode.textContent = isVoxelMode ? 'Voxel 3D' : modeLabel;
    filterBtns.forEach((b) =>
      b.classList.toggle('is-active', !isVoxelMode && b.dataset.filter === mode)
    );
    btnModeVoxel.classList.toggle('is-active', isVoxelMode);
    btnVoxelPreview.classList.toggle('is-active', isVoxelMode);
    btnVoxelPreview.textContent = isVoxelMode
      ? 'Exit Voxel 3D Preview'
      : 'Preview Voxel 3D in Viewport';
  }

  function disposeVoxelPreview(): void {
    if (activeVoxel) {
      activeVoxel.group.removeFromParent();
      disposeGroupResources(activeVoxel.group);
      activeVoxel.grid.geometry.dispose();
      activeVoxel = null;
    }
    if (activeStage) {
      activeStage.subjectRoot.visible = true;
    }
  }

  function generateCurrentVoxelGrid(): VoxelGridResult | null {
    if (!activeStage) return null;
    const prevVis = activeStage.subjectRoot.visible;
    activeStage.subjectRoot.visible = true;
    if (animCtrl.getClips().length > 0) {
      animCtrl.setTime(animCtrl.getQuantizedTime());
    }
    activeStage.subjectRoot.updateMatrixWorld(true);

    const resolution = Number(rngVoxelRes.value) || 32;
    const usePal = chkVoxelPal.checked;
    const dither3d = chkVoxelDither.checked;
    const grid = voxelizeObject3D(activeStage.subjectRoot, {
      resolution,
      palette: usePal ? pipeline.getActivePaletteEntry().config : null,
      dither3d,
      fillSolidInterior: true,
      preserveWorldScale: true,
    });

    activeStage.subjectRoot.visible = prevVis;
    voxelStatsEl.textContent = `${grid.dimensions.join('×')} · ${grid.voxels.length.toLocaleString()} voxels · ${grid.faceCount.toLocaleString()} faces`;
    return grid;
  }

  function rebuildVoxelPreview(): void {
    if (!activeStage) return;
    disposeVoxelPreview();
    const grid = generateCurrentVoxelGrid();
    if (!grid) return;

    const { group } = buildVoxelMeshGroup(grid, pipeline.getSharedResourcesForMaterial());
    group.position.copy(activeStage.subjectRoot.position);
    group.rotation.copy(activeStage.subjectRoot.rotation);
    group.scale.copy(activeStage.subjectRoot.scale);
    activeStage.sceneRoot.add(group);
    activeStage.subjectRoot.visible = false;
    activeVoxel = { grid, group };
  }

  function setVoxelMode(active: boolean): void {
    if (active) {
      if (pipeline.pipelineConfig.filterMode === 'full_scene') {
        pipeline.pipelineConfig.filterMode = 'only_pixelized';
      }
      isVoxelMode = true;
      rebuildVoxelPreview();
    } else {
      isVoxelMode = false;
      disposeVoxelPreview();
    }
    syncConversionModeUi();
  }

  function applyStageCameraFraming(subjectRoot: THREE.Object3D, isLargeStructure: boolean): void {
    const rngOrtho = rootElement.querySelector<HTMLInputElement>('#rng-ortho-h');
    const valOrtho = rootElement.querySelector<HTMLElement>('#val-ortho-h');
    if (isLargeStructure) {
      subjectRoot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(subjectRoot);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const nextH = Number(
        Math.max(8.5, Math.min(20.0, Math.max(size.x, size.z) * 0.72 + size.y * 0.88)).toFixed(1)
      );
      pipeline.cameraConfig.orthoHeight = nextH;
      if (rngOrtho) rngOrtho.value = String(nextH);
      if (valOrtho) valOrtho.textContent = nextH.toFixed(1);
      orbitTarget.set(center.x, Math.max(1.2, center.y * 0.78), center.z);
      dirLight.shadow.camera.left = -12;
      dirLight.shadow.camera.right = 12;
      dirLight.shadow.camera.top = 12;
      dirLight.shadow.camera.bottom = -12;
      dirLight.shadow.camera.updateProjectionMatrix();
      setCameraPose(30, 45, 22);
    } else {
      pipeline.cameraConfig.orthoHeight = 5.8;
      if (rngOrtho) rngOrtho.value = '5.8';
      if (valOrtho) valOrtho.textContent = '5.8';
      orbitTarget.set(0, 1.0, 0);
      dirLight.shadow.camera.left = -6;
      dirLight.shadow.camera.right = 6;
      dirLight.shadow.camera.top = 6;
      dirLight.shadow.camera.bottom = -6;
      dirLight.shadow.camera.updateProjectionMatrix();
      setCameraPose(30, 45, 12);
    }
  }

  function applyStage(next: ActiveStage): void {
    isVoxelMode = false;
    disposeVoxelPreview();
    if (activeStage) {
      scene.remove(activeStage.sceneRoot);
      disposeGroupResources(activeStage.sceneRoot);
    }
    activeStage = next;
    scene.add(next.sceneRoot);
    applyStageCameraFraming(next.subjectRoot, activeStructureRoot === next.subjectRoot);
    captionTitle.textContent = next.name;
    captionDesc.textContent = next.description;
    voxelStatsEl.textContent = 'Grid Ready — click Preview or Export';
    selectedItemId =
      next.items.find((i) => i.materials[0]?.options.pixelated)?.id ?? next.items[0]?.id ?? '';
    renderSceneItemList();
    syncObjectInspector();
    syncConversionModeUi();
    syncSkeletonHelper();
    animViewerHandle?.refreshFromActiveStage();
  }

  function buildStageWrapAndItems(
    subjectRoot: THREE.Object3D,
    fallbackName: string,
    fallbackMats: PixelizerMaterial[],
    floorRadius = 5.5
  ): { wrapScene: THREE.Group; items: SceneItemEntry[] } {
    const wrapScene = new THREE.Group();
    const floorMat = new PixelizerMaterial(
      {
        pixelated: false,
        objectId: 0,
        outlineAlpha: 0,
        edgeBevelWeight: 0,
        baseColor: '#485266',
        useColorGrading: false,
        smoothness: 0.08,
      },
      pipeline.getSharedResourcesForMaterial()
    );
    const floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(floorRadius, floorRadius + 0.2, 0.2, 36),
      floorMat
    );
    floorMesh.position.set(0, -0.115, 0);
    floorMesh.receiveShadow = true;
    wrapScene.add(floorMesh, subjectRoot);

    const items: SceneItemEntry[] = [];
    let meshIdx = 0;
    subjectRoot.traverse((m) => {
      if (m instanceof THREE.Mesh) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        const pixMats = mats.filter((x): x is PixelizerMaterial => x instanceof PixelizerMaterial);
        if (pixMats.length > 0) {
          items.push({
            id: `mesh_${meshIdx}`,
            label: m.name || `Mesh Part #${meshIdx + 1}`,
            object: m,
            materials: pixMats,
            snapTarget: subjectRoot,
          });
          meshIdx++;
        }
      }
    });

    if (items.length === 0) {
      items.push({
        id: 'root',
        label: fallbackName,
        object: subjectRoot,
        materials: fallbackMats,
        snapTarget: subjectRoot,
      });
    }
    return { wrapScene, items };
  }

  function mountLoadedModel(
    loaded: LoadedModelResult,
    titleOverride?: string,
    descOverride?: string
  ): void {
    activeStructureRoot = null;
    nativeModelClips = loaded.animations;
    const { wrapScene, items } = buildStageWrapAndItems(
      loaded.root,
      loaded.name,
      loaded.materials
    );

    animCtrl.bindModel(loaded.root, loaded.animations);
    if (loaded.animations.length > 0) {
      const bestIdx = pickPreferredClipIndex(loaded.animations);
      animCtrl.playClip(bestIdx);
      syncAnimClipSelector(loaded.animations, bestIdx);
    } else {
      syncAnimClipSelector([], 0);
    }

    applyStage({
      name: titleOverride ?? `Imported: ${loaded.name}`,
      description:
        descOverride ??
        `${loaded.meshes.length} mesh(es) converted to PixelizerMaterial · ${loaded.animations.length} animation clip(s).`,
      subjectRoot: loaded.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (motionTest) {
          loaded.root.position.x = Math.sin(t * 1.1) * 1.25;
          loaded.root.rotation.y = t * 0.45;
        } else {
          loaded.root.position.x = 0;
          if (animCtrl.getClips().length === 0) {
            loaded.root.rotation.y = t * 0.4;
          }
        }
      },
    });
  }

  function bindUalClipsToSubject(subjectRoot: THREE.Object3D, preferredName = 'Idle_Loop'): void {
    const bank = AnimationLibraryBank.getInstance();
    const applyBankClips = () => {
      if (activeStage?.subjectRoot !== subjectRoot) return;
      const allClips = bank.getAll().map((x) => x.clip.clone());
      if (allClips.length === 0) return;
      nativeModelClips = allClips;
      animCtrl.bindModel(subjectRoot, allClips);
      let idx = allClips.findIndex((c) => c.name === preferredName);
      if (idx < 0) idx = pickPreferredClipIndex(allClips);
      animCtrl.playClip(idx);
      syncAnimClipSelector(allClips, idx);
      animViewerHandle?.refreshFromActiveStage();
    };

    if (bank.isLoaded()) {
      applyBankClips();
    } else {
      void bank.ensureLoaded().then(applyBankClips);
    }
  }

  function mountGeneratedCharacter(
    res: GeneratedCharacterResult,
    preferredClip = 'Sword_Regular_A'
  ): void {
    activeStructureRoot = null;
    nativeModelClips = [];
    const { wrapScene, items } = buildStageWrapAndItems(res.root, res.name, res.materials);
    animCtrl.dispose();
    syncAnimClipSelector([], 0);

    applyStage({
      name: `UAL ${res.archetype.toUpperCase()} (${res.rigMode === 'rigid_segments' ? 'NWL Rigid' : 'Skinned'})`,
      description: `Canonical 65-bone Quaternius UAL Rig (${res.rig.profile}) · ${res.visualStyle} · Ready for 85 UAL clips & .GLB export.`,
      subjectRoot: res.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (motionTest) {
          res.root.position.x = Math.sin(t * 1.1) * 1.25;
          res.root.rotation.y = t * 0.45;
        } else {
          res.root.position.x = 0;
        }
      },
    });

    const pref = res.archetype === 'zombie' ? 'Zombie_Walk_Fwd_Loop' : preferredClip;
    bindUalClipsToSubject(res.root, pref);
  }

  function mountGeneratedProp(res: GeneratedPropResult): void {
    activeStructureRoot = null;
    nativeModelClips = [];
    animCtrl.dispose();
    syncAnimClipSelector([], 0);
    const { wrapScene, items } = buildStageWrapAndItems(res.root, res.kind, res.materials);
    applyStage({
      name: `Prop: ${res.kind.toUpperCase()}`,
      description: `Autonomous CC0-calibrated prop (${res.dimensions.map((d) => d.toFixed(2)).join('×')}m · socket: ${res.recommendedSocket}).`,
      subjectRoot: res.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        res.root.rotation.y = t * 0.55;
        res.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
      },
    });
  }

  function mountGeneratedStructure(res: GeneratedStructureResult): void {
    activeStructureRoot = res.root;
    nativeModelClips = [];
    animCtrl.dispose();
    syncAnimClipSelector([], 0);
    const { wrapScene, items } = buildStageWrapAndItems(
      res.root,
      res.name,
      res.materials,
      Math.max(7.5, res.gridCols * 2.2)
    );
    applyStage({
      name: `WFC Structure: ${res.biome.toUpperCase()} (${res.gridCols}×${res.gridRows})`,
      description: `Connected architectural layout (${res.cells.length} rooms/corridors) distilled from KayKit CC0 structural grammar.`,
      subjectRoot: res.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (motionTest) {
          res.root.position.x = Math.sin(t * 0.8) * 1.1;
        } else {
          res.root.position.x = 0;
        }
      },
    });
  }

  function loadDemoPreset(presetId: DemoPresetId): void {
    loadRequestToken++;
    activeStructureRoot = null;
    nativeModelClips = [];
    animCtrl.dispose();
    syncAnimClipSelector([], 0);
    const built: BuiltDemoScene = buildDemoScene(presetId, pipeline.getSharedResourcesForMaterial());
    applyStage(built);
  }

  async function loadPresetSelection(value: string): Promise<void> {
    if (value === 'ual_knight') {
      loadRequestToken++;
      const res = buildProceduralUalCharacter(
        { archetype: 'knight', rigMode: 'skinned_mesh', visualStyle: 'lowpoly', seed: 42 },
        pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Sword_Regular_A');
      return;
    }
    if (value === 'ual_knight_rigid') {
      loadRequestToken++;
      const res = buildProceduralUalCharacter(
        { archetype: 'knight', rigMode: 'rigid_segments', visualStyle: 'lowpoly', seed: 108 },
        pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Jog_Fwd_Loop');
      return;
    }
    if (value === 'ual_zombie') {
      loadRequestToken++;
      const res = buildProceduralUalCharacter(
        { archetype: 'zombie', rigMode: 'skinned_mesh', visualStyle: 'voxel', voxelResolution: 24, seed: 99 },
        pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Zombie_Walk_Fwd_Loop');
      return;
    }
    if (value === 'ual_dungeon') {
      loadRequestToken++;
      const struct = buildProceduralStructure(
        { biome: 'dungeon', cols: 4, rows: 4, floors: 1, seed: 77 },
        pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedStructure(struct);
      return;
    }

    const charDef = CHARACTER_PRESETS[value];
    if (!charDef) {
      loadDemoPreset(value as DemoPresetId);
      return;
    }
    const token = ++loadRequestToken;
    captionTitle.textContent = `Loading ${charDef.title}...`;
    captionDesc.textContent = `Fetching articulated GLB (${charDef.filename})...`;
    try {
      const loaded = await loadModelFromUrl(
        charDef.url,
        charDef.filename,
        pipeline.getSharedResourcesForMaterial()
      );
      if (token !== loadRequestToken) {
        disposeGroupResources(loaded.root);
        return;
      }
      mountLoadedModel(loaded, charDef.title, charDef.description);
    } catch (err) {
      if (token !== loadRequestToken) return;
      captionTitle.textContent = `Failed to load ${charDef.title}`;
      captionDesc.textContent = err instanceof Error ? err.message : 'Model load error';
    }
  }

  async function handleModelImport(file: File): Promise<void> {
    const token = ++loadRequestToken;
    try {
      const loaded = await loadModelFromFile(file, pipeline.getSharedResourcesForMaterial());
      if (token !== loadRequestToken) {
        disposeGroupResources(loaded.root);
        return;
      }
      mountLoadedModel(loaded);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load 3D file');
    }
  }

  function getSelectedItem(): SceneItemEntry | undefined {
    return activeStage?.items.find((i) => i.id === selectedItemId) ?? activeStage?.items[0];
  }

  function renderSceneItemList(): void {
    sceneItemList.innerHTML = '';
    if (!activeStage) return;
    for (const item of activeStage.items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `scene-item-btn ${item.id === selectedItemId ? 'is-selected' : ''}`;
      const primary = item.materials[0];
      const badge = primary?.options.pixelated
        ? `ID${primary.options.objectId} · ${primary.options.pixelSize}×`
        : 'RAW';
      btn.innerHTML = `<span>${item.label}</span><span style="font-family:var(--font-mono);font-size:10px;color:var(--cyan-tech);">${badge}</span>`;
      btn.addEventListener('click', () => {
        selectedItemId = item.id;
        renderSceneItemList();
        syncObjectInspector();
      });
      sceneItemList.appendChild(btn);
    }
  }

  // Object Inspector Bindings
  const chkObjPix = rootElement.querySelector<HTMLInputElement>('#chk-obj-pixelated')!;
  const rngObjPxSize = rootElement.querySelector<HTMLInputElement>('#rng-obj-pxsize')!;
  const valObjPxSize = rootElement.querySelector<HTMLElement>('#val-obj-pxsize')!;
  const rngObjId = rootElement.querySelector<HTMLInputElement>('#rng-obj-id')!;
  const valObjId = rootElement.querySelector<HTMLElement>('#val-obj-id')!;
  const colObjOutline = rootElement.querySelector<HTMLInputElement>('#col-obj-outline')!;
  const rngObjOutAlpha = rootElement.querySelector<HTMLInputElement>('#rng-obj-outalpha')!;
  const rngObjEdgeHl = rootElement.querySelector<HTMLInputElement>('#rng-obj-edgehl')!;
  const valObjEdgeHl = rootElement.querySelector<HTMLElement>('#val-obj-edgehl')!;
  const rngObjBevel = rootElement.querySelector<HTMLInputElement>('#rng-obj-bevel')!;
  const valObjBevel = rootElement.querySelector<HTMLElement>('#val-obj-bevel')!;
  const wfBtns = rootElement.querySelectorAll<HTMLButtonElement>('[data-wf]');
  const rowObjMetallic = rootElement.querySelector<HTMLElement>('#row-obj-metallic')!;
  const rngObjMetallic = rootElement.querySelector<HTMLInputElement>('#rng-obj-metallic')!;
  const valObjMetallic = rootElement.querySelector<HTMLElement>('#val-obj-metallic')!;
  const rngObjSmooth = rootElement.querySelector<HTMLInputElement>('#rng-obj-smoothness')!;
  const valObjSmooth = rootElement.querySelector<HTMLElement>('#val-obj-smoothness')!;
  const colObjBase = rootElement.querySelector<HTMLInputElement>('#col-obj-base')!;
  const colObjEmit = rootElement.querySelector<HTMLInputElement>('#col-obj-emit')!;
  const rngObjEmitInt = rootElement.querySelector<HTMLInputElement>('#rng-obj-emit-int')!;
  const colObjShadow = rootElement.querySelector<HTMLInputElement>('#col-obj-shadow')!;
  const rngObjShadowA = rootElement.querySelector<HTMLInputElement>('#rng-obj-shadow-a')!;
  const rngObjAlpha = rootElement.querySelector<HTMLInputElement>('#rng-obj-alpha')!;
  const valObjAlpha = rootElement.querySelector<HTMLElement>('#val-obj-alpha')!;
  const chkObjGrading = rootElement.querySelector<HTMLInputElement>('#chk-obj-grading')!;
  const chkSnapPos = rootElement.querySelector<HTMLInputElement>('#chk-snap-pos')!;
  const chkAlignGrid = rootElement.querySelector<HTMLInputElement>('#chk-align-grid')!;
  const selAngleSnap = rootElement.querySelector<HTMLSelectElement>('#sel-angle-snap')!;
  const rngAngleDeg = rootElement.querySelector<HTMLInputElement>('#rng-angle-deg')!;
  const valAngleDeg = rootElement.querySelector<HTMLElement>('#val-angle-deg')!;
  const texAlbedoName = rootElement.querySelector<HTMLElement>('#tex-albedo-name')!;
  const texNormalName = rootElement.querySelector<HTMLElement>('#tex-normal-name')!;
  const texEmitName = rootElement.querySelector<HTMLElement>('#tex-emit-name')!;
  const pxChipBtns = rootElement.querySelectorAll<HTMLButtonElement>('#px-preset-chips .chip-btn');

  let voxelRebuildTimer: ReturnType<typeof setTimeout> | null = null;
  function scheduleVoxelRebuild(): void {
    if (!isVoxelMode) return;
    if (voxelRebuildTimer) clearTimeout(voxelRebuildTimer);
    voxelRebuildTimer = setTimeout(() => {
      voxelRebuildTimer = null;
      if (isVoxelMode) rebuildVoxelPreview();
    }, 90);
  }

  function syncObjectInspector(): void {
    const item = getSelectedItem();
    const mat = item?.materials[0];
    if (!item || !mat) return;
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
    rngObjAlpha.value = String(o.alpha);
    valObjAlpha.textContent = o.alpha.toFixed(2);
    chkObjGrading.checked = o.useColorGrading;

    texAlbedoName.textContent = o.albedoMap ? 'Albedo: Custom Map' : 'Albedo: None';
    texNormalName.textContent = o.normalMap ? 'Normal: Custom Map' : 'Normal: None';
    texEmitName.textContent = o.emissionMap ? 'Emission: Custom Map' : 'Emission: None';

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

  chkObjPix.addEventListener('change', () => patchSelectedMaterials({ pixelated: chkObjPix.checked }));
  rngObjPxSize.addEventListener('input', () => {
    const v = Number(rngObjPxSize.value);
    valObjPxSize.textContent = `${v}×${v}`;
    pxChipBtns.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.px) === v));
    patchSelectedMaterials({ pixelSize: v });
  });
  pxChipBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const px = Number(btn.dataset.px) || 3;
      rngObjPxSize.value = String(px);
      valObjPxSize.textContent = `${px}×${px}`;
      pxChipBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      patchSelectedMaterials({ pixelSize: px });
    });
  });
  rngObjId.addEventListener('input', () => {
    const v = Number(rngObjId.value);
    valObjId.textContent = String(v);
    patchSelectedMaterials({ objectId: v });
  });
  colObjOutline.addEventListener('input', () => patchSelectedMaterials({ outlineColor: colObjOutline.value }));
  rngObjOutAlpha.addEventListener('input', () => patchSelectedMaterials({ outlineAlpha: Number(rngObjOutAlpha.value) }));
  rngObjEdgeHl.addEventListener('input', () => {
    const v = Number(rngObjEdgeHl.value);
    valObjEdgeHl.textContent = v.toFixed(2);
    patchSelectedMaterials({ edgeHighlight: v });
  });
  rngObjBevel.addEventListener('input', () => {
    const v = Number(rngObjBevel.value);
    valObjBevel.textContent = v.toFixed(2);
    patchSelectedMaterials({ edgeBevelWeight: v });
  });
  wfBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const wf = btn.dataset.wf as ShadingWorkflow;
      wfBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      rowObjMetallic.style.display = wf === 'metallic' ? 'flex' : 'none';
      patchSelectedMaterials({ workflow: wf });
    });
  });
  rngObjMetallic.addEventListener('input', () => {
    const v = Number(rngObjMetallic.value);
    valObjMetallic.textContent = v.toFixed(2);
    patchSelectedMaterials({ metallic: v });
  });
  rngObjSmooth.addEventListener('input', () => {
    const v = Number(rngObjSmooth.value);
    valObjSmooth.textContent = v.toFixed(2);
    patchSelectedMaterials({ smoothness: v });
  });
  colObjBase.addEventListener('input', () => patchSelectedMaterials({ baseColor: colObjBase.value }));
  colObjEmit.addEventListener('input', () => patchSelectedMaterials({ emissionColor: colObjEmit.value }));
  rngObjEmitInt.addEventListener('input', () => patchSelectedMaterials({ emissionIntensity: Number(rngObjEmitInt.value) }));
  colObjShadow.addEventListener('input', () => patchSelectedMaterials({ shadowTint: colObjShadow.value }));
  rngObjShadowA.addEventListener('input', () => patchSelectedMaterials({ shadowTintAlpha: Number(rngObjShadowA.value) }));
  rngObjAlpha.addEventListener('input', () => {
    const v = Number(rngObjAlpha.value);
    valObjAlpha.textContent = v.toFixed(2);
    patchSelectedMaterials({ alpha: v });
  });
  chkObjGrading.addEventListener('change', () => patchSelectedMaterials({ useColorGrading: chkObjGrading.checked }));

  chkSnapPos.addEventListener('change', () => patchSelectedSnap({ snapPosition: chkSnapPos.checked }));
  chkAlignGrid.addEventListener('change', () => patchSelectedSnap({ alignPixelGrid: chkAlignGrid.checked }));
  selAngleSnap.addEventListener('change', () =>
    patchSelectedSnap({ angleSnapMode: selAngleSnap.value as AngleSnapMode })
  );
  rngAngleDeg.addEventListener('input', () => {
    const v = Number(rngAngleDeg.value);
    valAngleDeg.textContent = `${v}°`;
    patchSelectedSnap({ angleResolutionDeg: v });
  });

  // Toggle unified silhouette Object ID vs split per-mesh Object IDs
  rootElement.querySelector('#btn-toggle-id-mode')!.addEventListener('click', () => {
    if (!activeStage) return;
    const pixItems = activeStage.items.filter((i) => i.materials.some((m) => m.options.pixelated));
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

  // Apply style to all pixelized meshes
  rootElement.querySelector('#btn-apply-all-obj')!.addEventListener('click', () => {
    const src = getSelectedItem()?.materials[0];
    if (!src || !activeStage) return;
    for (const item of activeStage.items) {
      for (const m of item.materials) {
        if (m.options.pixelated) {
          m.updateOptions({
            pixelSize: src.options.pixelSize,
            outlineColor: src.options.outlineColor,
            outlineAlpha: src.options.outlineAlpha,
            edgeHighlight: src.options.edgeHighlight,
            edgeBevelWeight: src.options.edgeBevelWeight,
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

  // Texture Slot Uploads
  const bindTextureSlot = (
    inputId: string,
    clearId: string,
    prop: 'albedoMap' | 'normalMap' | 'emissionMap',
    isSrgb: boolean
  ) => {
    const inp = rootElement.querySelector<HTMLInputElement>(inputId)!;
    const clr = rootElement.querySelector<HTMLButtonElement>(clearId)!;
    inp.addEventListener('change', async () => {
      const f = inp.files?.[0];
      if (!f) return;
      const tex = await createPreviewTextureFromFile(f, isSrgb);
      patchSelectedMaterials({ [prop]: tex });
      syncObjectInspector();
      inp.value = '';
    });
    clr.addEventListener('click', () => {
      patchSelectedMaterials({ [prop]: null });
      syncObjectInspector();
    });
  };
  bindTextureSlot('#file-tex-albedo', '#btn-clr-albedo', 'albedoMap', true);
  bindTextureSlot('#file-tex-normal', '#btn-clr-normal', 'normalMap', false);
  bindTextureSlot('#file-tex-emit', '#btn-clr-emit', 'emissionMap', true);

  selLightingRamp.addEventListener('change', () => {
    pipeline.activeRampId = selLightingRamp.value;
  });

  // Palette & Dither Tab
  mountPaletteEditorTab(rootElement.querySelector<HTMLElement>('#pane-palette-host')!, pipeline, {
    onPaletteOrDitherChanged: () => {
      if (isVoxelMode && chkVoxelPal.checked) {
        scheduleVoxelRebuild();
      }
    },
  });

  // Tab Navigation
  const tabBtns = rootElement.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const tabPanes = rootElement.querySelectorAll<HTMLElement>('.tab-pane');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      tabPanes.forEach((p) => p.classList.toggle('is-active', p.dataset.pane === target));
    });
  });

  // Topbar Controls
  const selDemo = rootElement.querySelector<HTMLSelectElement>('#sel-demo-scene')!;
  selDemo.addEventListener('change', () => {
    void loadPresetSelection(selDemo.value);
  });

  const fileModelInput = rootElement.querySelector<HTMLInputElement>('#file-model-input')!;
  fileModelInput.addEventListener('change', () => {
    const f = fileModelInput.files?.[0];
    if (f) void handleModelImport(f);
    fileModelInput.value = '';
  });

  // Drag & Drop 3D File Upload on Viewport
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    dropOverlay.classList.add('is-visible');
  };
  const onDragLeave = () => dropOverlay.classList.remove('is-visible');
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    dropOverlay.classList.remove('is-visible');
    const f = e.dataTransfer?.files?.[0];
    if (f) void handleModelImport(f);
  };
  stageEl.addEventListener('dragover', onDragOver);
  stageEl.addEventListener('dragleave', onDragLeave);
  stageEl.addEventListener('drop', onDrop);

  // Split Compare Toggle & Drag Handle
  const sceneCaptionEl = rootElement.querySelector<HTMLElement>('#scene-caption')!;
  const btnSplit = rootElement.querySelector<HTMLButtonElement>('#btn-split-compare')!;
  btnSplit.addEventListener('click', () => {
    pipeline.pipelineConfig.splitCompare = !pipeline.pipelineConfig.splitCompare;
    btnSplit.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    splitHandle.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    splitLabels.classList.toggle('is-active', pipeline.pipelineConfig.splitCompare);
    sceneCaptionEl.style.display = pipeline.pipelineConfig.splitCompare ? 'none' : 'block';
  });

  let draggingSplit = false;
  splitHandle.addEventListener('pointerdown', (e) => {
    draggingSplit = true;
    splitHandle.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    if (!draggingSplit) return;
    const rect = stageEl.getBoundingClientRect();
    const pos = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / Math.max(1, rect.width)));
    pipeline.pipelineConfig.splitPosition = pos;
    splitHandle.style.left = `${pos * 100}%`;
  });
  window.addEventListener('pointerup', () => {
    draggingSplit = false;
  });

  const btnMotion = rootElement.querySelector<HTMLButtonElement>('#btn-motion-test')!;
  btnMotion.addEventListener('click', () => {
    motionCreepTest = !motionCreepTest;
    btnMotion.classList.toggle('is-active', motionCreepTest);
  });

  const selDebugView = rootElement.querySelector<HTMLSelectElement>('#sel-debug-view')!;
  selDebugView.addEventListener('change', () => {
    pipeline.pipelineConfig.debugView = selDebugView.value as DebugViewMode;
  });

  // Pipeline Tab Conversion Mode Controls (Hybrid, Full Scene, Cel Hard, Voxel 3D)
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pipeline.pipelineConfig.filterMode = btn.dataset.filter as PixelizationFilterMode;
      if (isVoxelMode) {
        setVoxelMode(false);
      } else {
        syncConversionModeUi();
      }
    });
  });
  btnModeVoxel.addEventListener('click', () => {
    setVoxelMode(!isVoxelMode);
  });

  const bindCheck = (id: string, fn: (checked: boolean) => void) => {
    const el = rootElement.querySelector<HTMLInputElement>(id)!;
    el.addEventListener('change', () => fn(el.checked));
  };
  const bindRange = (
    id: string,
    valId: string,
    fmt: (v: number) => string,
    fn: (v: number) => void
  ) => {
    const el = rootElement.querySelector<HTMLInputElement>(id)!;
    const val = rootElement.querySelector<HTMLElement>(valId)!;
    el.addEventListener('input', () => {
      const n = Number(el.value);
      val.textContent = fmt(n);
      fn(n);
    });
  };

  bindCheck('#chk-pixel-expansion', (v) => (pipeline.pipelineConfig.usePixelExpansion = v));

  const selResMode = rootElement.querySelector<HTMLSelectElement>('#sel-res-mode')!;
  const rowWorldPx = rootElement.querySelector<HTMLElement>('#row-world-px')!;
  const rowDownscale = rootElement.querySelector<HTMLElement>('#row-downscale')!;
  const rowTargetH = rootElement.querySelector<HTMLElement>('#row-target-h')!;
  selResMode.addEventListener('change', () => {
    const mode = selResMode.value as ResolutionMode;
    pipeline.cameraConfig.resolutionMode = mode;
    rowWorldPx.style.display = mode === 'world_space_pixel_size' ? 'flex' : 'none';
    rowDownscale.style.display = mode === 'fixed_downscale_ratio' ? 'flex' : 'none';
    rowTargetH.style.display = mode === 'fixed_target_resolution' ? 'flex' : 'none';
  });

  bindRange('#rng-world-px', '#val-world-px', (v) => v.toFixed(3), (v) => (pipeline.cameraConfig.worldSpacePixelSize = v));
  bindRange('#rng-downscale', '#val-downscale', (v) => `${v}×`, (v) => (pipeline.cameraConfig.downscaleRatio = v));
  bindRange('#rng-target-h', '#val-target-h', (v) => `${v}px`, (v) => (pipeline.cameraConfig.targetHeight = v));
  bindRange('#rng-ortho-h', '#val-ortho-h', (v) => v.toFixed(1), (v) => (pipeline.cameraConfig.orthoHeight = v));

  rootElement.querySelector<HTMLSelectElement>('#sel-upscale')!.addEventListener('change', (e) => {
    pipeline.cameraConfig.upscaleMode = (e.target as HTMLSelectElement).value as LowResUpscaleMode;
  });
  bindCheck('#chk-snap-cam', (v) => (pipeline.cameraConfig.snapCameraPosition = v));
  bindCheck('#chk-subpixel-cam', (v) => (pipeline.cameraConfig.cameraSubpixelMotion = v));

  bindCheck('#chk-id-depth', (v) => (pipeline.pipelineConfig.useDepthTestForIdOutlines = v));
  bindRange('#rng-id-depth', '#val-id-depth', (v) => v.toFixed(3), (v) => (pipeline.pipelineConfig.idDepthThreshold = v));
  bindCheck('#chk-norm-edge', (v) => (pipeline.pipelineConfig.useNormalsForEdgeDetection = v));
  bindRange('#rng-norm-edge', '#val-norm-edge', (v) => v.toFixed(2), (v) => (pipeline.pipelineConfig.normalEdgeThreshold = v));
  bindCheck('#chk-depth-edge', (v) => (pipeline.pipelineConfig.useDepthTestForEdges = v));
  bindRange('#rng-edge-depth', '#val-edge-depth', (v) => v.toFixed(3), (v) => (pipeline.pipelineConfig.edgeDepthThreshold = v));
  bindRange('#rng-edge-hl-str', '#val-edge-hl-str', (v) => v.toFixed(2), (v) => (pipeline.pipelineConfig.edgeHighlightStrength = v));
  bindRange('#rng-bevel-str', '#val-bevel-str', (v) => v.toFixed(2), (v) => (pipeline.pipelineConfig.edgeBevelStrength = v));

  bindRange('#rng-light-az', '#val-light-az', (v) => `${v}°`, (v) => {
    lightAzimuthDeg = v;
    updateSunDirection();
  });
  bindRange('#rng-light-el', '#val-light-el', (v) => `${v}°`, (v) => {
    lightElevationDeg = v;
    updateSunDirection();
  });
  bindRange('#rng-light-int', '#val-light-int', (v) => v.toFixed(2), (v) => {
    dirLight.intensity = v;
  });
  rootElement.querySelector<HTMLInputElement>('#col-light')!.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    dirLight.color.set(val);
    pipeline.pipelineConfig.lightColor = val;
  });
  rootElement.querySelector<HTMLInputElement>('#col-ambient')!.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    hemiLight.color.set(val);
    ambientLight.color.set(val);
  });
  rootElement.querySelector<HTMLInputElement>('#col-bg')!.addEventListener('input', (e) => {
    pipeline.pipelineConfig.backgroundColor = (e.target as HTMLInputElement).value;
  });
  bindCheck('#chk-bg-trans', (v) => (pipeline.pipelineConfig.backgroundTransparent = v));

  // Bottom Viewport Camera & Playback Dock
  rootElement.querySelector('#btn-cam-iso')!.addEventListener('click', () => setCameraPose(30, 45));
  rootElement.querySelector('#btn-cam-front')!.addEventListener('click', () => setCameraPose(12, 0));
  rootElement.querySelector('#btn-cam-side')!.addEventListener('click', () => setCameraPose(12, 90));
  rootElement.querySelector('#btn-cam-top')!.addEventListener('click', () => setCameraPose(88, 45));

  const btnProj = rootElement.querySelector<HTMLButtonElement>('#btn-toggle-proj')!;
  btnProj.addEventListener('click', () => {
    const toOrtho = !(activeCamera instanceof THREE.OrthographicCamera);
    const oldCam = activeCamera;
    activeCamera = toOrtho ? orthoCamera : perspCamera;
    activeCamera.position.copy(oldCam.position);
    activeCamera.quaternion.copy(oldCam.quaternion);
    controls.object = activeCamera;
    controls.update();
    pipeline.cameraConfig.orthographic = toOrtho;
    btnProj.textContent = toOrtho ? 'Ortho' : 'Persp';
    btnProj.classList.toggle('is-active', toOrtho);
  });

  const btnPlay = rootElement.querySelector<HTMLButtonElement>('#btn-anim-play')!;
  btnPlay.addEventListener('click', () => {
    animCtrl.config.paused = !animCtrl.config.paused;
    btnPlay.innerHTML = animCtrl.config.paused ? ICONS.play : ICONS.pause;
  });

  rootElement.querySelector<HTMLSelectElement>('#sel-step-fps')!.addEventListener('change', (e) => {
    const fps = Number((e.target as HTMLSelectElement).value);
    animCtrl.config.enabled = fps > 0;
    animCtrl.config.fps = fps;
  });
  selAnimClip.addEventListener('change', () => {
    animCtrl.playClip(Number(selAnimClip.value), 0.18);
    animViewerHandle?.refreshFromActiveStage();
    if (isVoxelMode) scheduleVoxelRebuild();
  });

  // Export & 3D Voxelizer Actions
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
    const raw = (activeStage?.name || selDemo.value || 'pixelizer_model')
      .toLowerCase()
      .replace(/^imported:\s*/i, '')
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return raw || 'pixelizer_model';
  }

  function refreshStageSceneItems(): void {
    if (!activeStage) return;
    const { items } = buildStageWrapAndItems(activeStage.subjectRoot, activeStage.name, []);
    // Keep only non-floor meshes
    activeStage.items.splice(0, activeStage.items.length, ...items);
    renderSceneItemList();
    syncObjectInspector();
  }

  // Mount AnimViewer & Generator Tabs (after downloadBlob/getExportSlug exist)
  animViewerHandle = mountAnimViewerPanel(
    rootElement.querySelector<HTMLElement>('#pane-anim-host')!,
    {
      getSubjectRoot: () => activeStage?.subjectRoot ?? null,
      getNativeClips: () => nativeModelClips,
      setModelClips: (clips, activeName) => {
        if (!activeStage) return;
        animCtrl.bindModel(activeStage.subjectRoot, clips);
        let idx = activeName ? clips.findIndex((c) => c.name === activeName) : -1;
        if (idx < 0) idx = pickPreferredClipIndex(clips);
        animCtrl.playClip(idx);
        syncAnimClipSelector(clips, idx);
        animViewerHandle?.refreshFromActiveStage();
      },
      setActiveClipByIndex: (index, crossFadeSec = 0) => {
        animCtrl.playClip(index, crossFadeSec);
        selAnimClip.value = String(index);
        if (isVoxelMode) scheduleVoxelRebuild();
      },
      getActiveClipName: () => animCtrl.getActiveClip()?.name ?? '',
      getSkeletonOverlayEnabled: () => skeletonOverlayEnabled,
      setSkeletonOverlayEnabled: (enabled) => {
        skeletonOverlayEnabled = enabled;
        syncSkeletonHelper();
      },
      onVoxelizeRiggedRequested: () => {
        if (!activeStage) return;
        const resolution = Number(rngVoxelRes.value) || 24;
        const usePal = chkVoxelPal.checked;
        const dither3d = chkVoxelDither.checked;
        const voxRes = voxelizeObject3DRigged(
          activeStage.subjectRoot,
          {
            resolution,
            palette: usePal ? pipeline.getActivePaletteEntry().config : null,
            dither3d,
            fillSolidInterior: true,
          },
          pipeline.getSharedResourcesForMaterial()
        );
        const { wrapScene, items } = buildStageWrapAndItems(
          voxRes.root,
          'Voxelized UAL Rig',
          [voxRes.material]
        );
        animCtrl.dispose();
        applyStage({
          name: `Voxel Rigged: ${activeStage.name}`,
          description: `${voxRes.grid.dimensions.join('×')} (${voxRes.grid.voxels.length} voxels) auto-rigged onto 65-bone UAL Skeleton.`,
          subjectRoot: voxRes.root,
          sceneRoot: wrapScene,
          items,
          updateAnimation: (t, motionTest) => {
            voxRes.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
          },
        });
        bindUalClipsToSubject(voxRes.root, 'Idle_Loop');
      },
      getSharedMaterialResources: () => pipeline.getSharedResourcesForMaterial(),
      onPropAttachedToSubject: () => {
        refreshStageSceneItems();
        syncSkeletonHelper();
      },
      getExportSlug,
      downloadBlob,
      animCtrl,
    }
  );

  mountGeneratorPanel(rootElement.querySelector<HTMLElement>('#pane-generate-host')!, {
    getSharedMaterialResources: () => pipeline.getSharedResourcesForMaterial(),
    mountGeneratedCharacter: (res) => mountGeneratedCharacter(res, 'Sword_Regular_A'),
    mountGeneratedProp,
    mountGeneratedStructure,
    getCurrentStructureRoot: () => activeStructureRoot,
    downloadBlob,
  });

  function acquireGridForExport(): { grid: VoxelGridResult; isTemp: boolean; res: number } | null {
    const res = Number(rngVoxelRes.value) || 32;
    if (isVoxelMode && activeVoxel) {
      return { grid: activeVoxel.grid, isTemp: false, res };
    }
    const grid = generateCurrentVoxelGrid();
    if (!grid) return null;
    return { grid, isTemp: true, res };
  }

  rngVoxelRes.addEventListener('input', () => {
    valVoxelRes.textContent = `${rngVoxelRes.value} voxels`;
    scheduleVoxelRebuild();
  });
  chkVoxelPal.addEventListener('change', () => scheduleVoxelRebuild());
  chkVoxelDither.addEventListener('change', () => scheduleVoxelRebuild());
  btnVoxelPreview.addEventListener('click', () => {
    setVoxelMode(!isVoxelMode);
  });

  rootElement.querySelector('#btn-export-obj')!.addEventListener('click', () => {
    const acquired = acquireGridForExport();
    if (!acquired) return;
    const slug = getExportSlug();
    const objText = exportVoxelGridToObj(acquired.grid, slug);
    downloadBlob(
      new Blob([objText], { type: 'text/plain;charset=utf-8' }),
      `${slug}_voxel_${acquired.res}.obj`
    );
    if (acquired.isTemp) acquired.grid.geometry.dispose();
  });

  rootElement.querySelector('#btn-export-glb')!.addEventListener('click', () => {
    void (async () => {
      const acquired = acquireGridForExport();
      if (!acquired) return;
      const slug = getExportSlug();
      const buf = await exportVoxelGridToGlb(acquired.grid, slug);
      downloadBlob(
        new Blob([buf], { type: 'model/gltf-binary' }),
        `${slug}_voxel_${acquired.res}.glb`
      );
      if (acquired.isTemp) acquired.grid.geometry.dispose();
    })();
  });

  rootElement.querySelector('#btn-export-vox')!.addEventListener('click', () => {
    const acquired = acquireGridForExport();
    if (!acquired) return;
    const slug = getExportSlug();
    const bytes = exportVoxelGridToVox(acquired.grid);
    downloadBlob(
      new Blob([bytes.slice().buffer], { type: 'application/octet-stream' }),
      `${slug}_voxel_${acquired.res}.vox`
    );
    if (acquired.isTemp) acquired.grid.geometry.dispose();
  });

  function withIsolatedSubject<T>(fn: () => T): T {
    const isolate =
      rootElement.querySelector<HTMLInputElement>('#chk-exp-isolate')?.checked ?? true;
    const hidden: { obj: THREE.Object3D; vis: boolean }[] = [];
    if (isolate && activeStage) {
      for (const child of activeStage.sceneRoot.children) {
        if (child !== activeStage.subjectRoot && child !== activeVoxel?.group) {
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

  function exportSingleSnapshot(): void {
    const w = Number(rootElement.querySelector<HTMLInputElement>('#num-snap-w')!.value) || 256;
    const h = Number(rootElement.querySelector<HTMLInputElement>('#num-snap-h')!.value) || 256;
    const alpha = rootElement.querySelector<HTMLInputElement>('#chk-exp-alpha')!.checked;
    const url = withIsolatedSubject(() =>
      captureSingleFrameDataUrl(pipeline, scene, activeCamera, w, h, alpha)
    );
    triggerDownload(url, `pixelizer-frame-${w}x${h}.png`);
  }

  rootElement.querySelector('#btn-quick-png')!.addEventListener('click', exportSingleSnapshot);
  rootElement.querySelector('#btn-export-single')!.addEventListener('click', exportSingleSnapshot);

  const rngSheetFrames = rootElement.querySelector<HTMLInputElement>('#rng-sheet-frames')!;
  const valSheetFrames = rootElement.querySelector<HTMLElement>('#val-sheet-frames')!;
  rngSheetFrames.addEventListener('input', () => {
    valSheetFrames.textContent = rngSheetFrames.value;
  });

  const sheetResultCard = rootElement.querySelector<HTMLElement>('#sheet-result-card')!;
  const sheetResultMeta = rootElement.querySelector<HTMLElement>('#sheet-result-meta')!;
  const sheetThumbImg = rootElement.querySelector<HTMLImageElement>('#sheet-thumb-img')!;
  const spriteAnimPreview = rootElement.querySelector<HTMLCanvasElement>('#sprite-anim-preview')!;
  const rngPreviewDir = rootElement.querySelector<HTMLInputElement>('#rng-preview-dir')!;
  const nwlStatsEl = rootElement.querySelector<HTMLElement>('#nwl-sheet-stats')!;

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

  rootElement.querySelector('#btn-generate-nwl-sheet')!.addEventListener('click', () => {
    if (!activeStage) return;
    const targetH = Number(rootElement.querySelector<HTMLInputElement>('#num-nwl-h')!.value) || 40;
    const frames = Number(rootElement.querySelector<HTMLInputElement>('#num-nwl-frames')!.value) || 8;
    const target = isVoxelMode && activeVoxel ? activeVoxel.group : activeStage.subjectRoot;

    const res = withIsolatedSubject(() =>
      exportNwlIsometricSheet(
        pipeline,
        scene,
        target,
        {
          targetCharHeightPx: targetH,
          framesPerDirection: frames,
        },
        !isVoxelMode && animCtrl.getClips().length > 0 ? animCtrl : undefined
      )
    );

    const tile = res.frames[0]?.w ?? 96;
    nwlStatsEl.textContent = `${res.width}×${res.height}px (${tile}×${tile} box, 8 non-mirrored dirs) · clippedFrames=${res.clippedFrames}`;
    showSheetPreview(res, tile, `NWL ${targetH}px (${res.rows}×${res.cols} · clip=${res.clippedFrames})`);
  });

  rootElement.querySelector('#btn-generate-sheet')!.addEventListener('click', () => {
    if (!activeStage) return;
    const dirs = Number(rootElement.querySelector<HTMLSelectElement>('#sel-sheet-dirs')!.value);
    const framesPerDir = Number(rngSheetFrames.value);
    const tile = Number(rootElement.querySelector<HTMLSelectElement>('#sel-sheet-size')!.value);
    const alpha = rootElement.querySelector<HTMLInputElement>('#chk-exp-alpha')!.checked;
    const turntableTarget =
      isVoxelMode && activeVoxel ? activeVoxel.group : activeStage.subjectRoot;

    const result = withIsolatedSubject(() =>
      exportTurntableSpriteSheet(
        pipeline,
        scene,
        activeCamera,
        turntableTarget,
        {
          directions: dirs,
          framesPerDirection: framesPerDir,
          frameWidth: tile,
          frameHeight: tile,
          transparentBackground: alpha,
          startYawDeg: 0,
        },
        !isVoxelMode && animCtrl.getClips().length > 0 ? animCtrl : undefined
      )
    );

    showSheetPreview(result, tile, `Sheet: ${result.width}×${result.height}px (${result.rows}×${result.cols})`);
  });

  rootElement.querySelector('#btn-dl-sheet-png')!.addEventListener('click', () => {
    if (sheetResult) triggerDownload(sheetResult.imageDataUrl, `${getExportSlug()}_spritesheet.png`);
  });
  rootElement.querySelector('#btn-dl-sheet-json')!.addEventListener('click', () => {
    if (!sheetResult) return;
    const blob = new Blob([sheetResult.atlasJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${getExportSlug()}_atlas.json`);
    URL.revokeObjectURL(url);
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

  // Initialize Default Scene
  loadDemoPreset('rover');

  // Animation & Render Loop
  let rafId = 0;
  let lastNow = performance.now();

  const animate = (now: number) => {
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;

    const qTime = animCtrl.update(dt);
    activeStage?.updateAnimation(qTime, motionCreepTest);
    if (activeVoxel && activeStage) {
      activeVoxel.group.position.copy(activeStage.subjectRoot.position);
      activeVoxel.group.rotation.copy(activeStage.subjectRoot.rotation);
      activeVoxel.group.scale.copy(activeStage.subjectRoot.scale);
    }
    controls.update();

    pipeline.render(scene, activeCamera);
    if (skeletonOverlayEnabled && skeletonHelper) {
      renderer.setRenderTarget(null);
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(overlayScene, activeCamera);
      renderer.autoClear = true;
    }

    // Update Telemetry HUD
    const grid = pipeline.getLastGrid();
    if (grid) {
      const isFull = pipeline.pipelineConfig.filterMode === 'full_scene';
      hudBuf.textContent = isFull
        ? `${grid.lowResWidth}×${grid.lowResHeight}`
        : `${canvas.width}×${canvas.height}`;
      hudWpx.textContent = grid.worldPixelSize.toFixed(3);
      hudCam.textContent = activeCamera instanceof THREE.OrthographicCamera ? 'ORTHO' : 'PERSP';
      hudStep.textContent = animCtrl.config.enabled ? `${animCtrl.config.fps} FPS` : 'SMOOTH';
    }

    // Update Flipbook Sprite Sheet Preview
    if (sheetResult && sheetImgEl && sheetImgEl.complete) {
      sheetAnimTimer += dt;
      const stepDur = animCtrl.config.enabled && animCtrl.config.fps > 0 ? 1 / animCtrl.config.fps : 0.12;
      if (sheetAnimTimer >= stepDur) {
        sheetAnimTimer = 0;
        sheetFrameCursor = (sheetFrameCursor + 1) % sheetResult.cols;
      }
      const dirRow = Math.min(sheetResult.rows - 1, Number(rngPreviewDir.value) || 0);
      const tileW = spriteAnimPreview.width;
      const tileH = spriteAnimPreview.height;
      const ctx = spriteAnimPreview.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, tileW, tileH);
      ctx.drawImage(
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
  };
  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    if (voxelRebuildTimer) clearTimeout(voxelRebuildTimer);
    if (skeletonHelper) {
      skeletonHelper.removeFromParent();
      skeletonHelper.dispose();
    }
    disposeVoxelPreview();
    ro.disconnect();
    stageEl.removeEventListener('dragover', onDragOver);
    stageEl.removeEventListener('dragleave', onDragLeave);
    stageEl.removeEventListener('drop', onDrop);
    animCtrl.dispose();
    controls.dispose();
    if (activeStage) disposeGroupResources(activeStage.sceneRoot);
    pipeline.dispose();
    renderer.dispose();
  };
}
