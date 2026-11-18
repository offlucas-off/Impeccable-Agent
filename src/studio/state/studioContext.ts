import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PixelizerMaterial } from '../../engine/PixelizerMaterial';
import type { PixelizerPipeline } from '../../engine/PixelizerPipeline';
import type { PlayerCharacterInstance } from '../../engine/procedural/PlayerEquipmentBuilder';
import type { SteppedAnimationController } from '../../engine/steppedAnimation';
import type { VoxelGridResult } from '../../engine/types';
import type { PlaySandboxHandle } from '../../sandbox/NwlPlaySandbox';
import type { SceneItemEntry } from '../presets/demoScenes';
import type { AnimViewerPanelHandle } from '../ui/animViewerPanel';
import type { GeneratorPanelHandle } from '../ui/generatorPanel';

export interface ActiveStage {
  name: string;
  description: string;
  subjectRoot: THREE.Group;
  sceneRoot: THREE.Group;
  items: SceneItemEntry[];
  updateAnimation: (quantizedTime: number, motionTest: boolean) => void;
  onCleanup?: () => void;
}

export interface ActiveVoxelPreview {
  grid: VoxelGridResult;
  group: THREE.Group;
}

export interface CharacterPresetDef {
  url: string;
  filename: string;
  title: string;
  description: string;
}

export const CHARACTER_PRESETS: Record<string, CharacterPresetDef> = {
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

export interface StudioPanelCallbacks {
  syncPipelineUi: () => void;
  syncObjectInspector: () => void;
  renderSceneItemList: () => void;
  syncConversionModeUi: () => void;
  setVoxelMode: (active: boolean) => void;
  rebuildVoxelPreview: () => void;
  scheduleVoxelRebuild: () => void;
  generateCurrentVoxelGrid: () => VoxelGridResult | null;
  disposeVoxelPreview: () => void;
  syncSkeletonHelper: () => void;
  syncAnimClipSelector: (clips: THREE.AnimationClip[], activeIdx: number) => void;
  applyStage: (next: ActiveStage, preservePlayer?: boolean) => void;
  loadPresetSelection: (value: string) => Promise<void>;
  handleModelImport: (file: File) => Promise<void>;
  enterPlaySandbox: () => void;
  exitPlaySandbox: (reloadPreset?: boolean) => void;
  updateSunDirection: () => void;
  setCameraPose: (elevationDeg: number, azimuthDeg: number, dist?: number) => void;
  applyStageCameraFraming: (subjectRoot: THREE.Object3D, isLargeStructure: boolean) => void;
  getExportSlug: () => string;
  triggerDownload: (href: string, filename: string) => void;
  downloadBlob: (blob: Blob, filename: string) => void;
  withIsolatedSubject: <T>(fn: () => T) => T;
}

export interface StudioContext {
  rootElement: HTMLElement;
  stageEl: HTMLElement;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  pipeline: PixelizerPipeline;
  scene: THREE.Scene;
  overlayScene: THREE.Scene;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  orthoCamera: THREE.OrthographicCamera;
  perspCamera: THREE.PerspectiveCamera;
  activeCamera: THREE.Camera;
  orbitTarget: THREE.Vector3;
  controls: OrbitControls;
  animCtrl: SteppedAnimationController;

  lightAzimuthDeg: number;
  lightElevationDeg: number;
  skeletonHelper: THREE.SkeletonHelper | null;
  skeletonOverlayEnabled: boolean;
  animViewerHandle: AnimViewerPanelHandle | null;
  generatorHandle: GeneratorPanelHandle | null;
  lastStageOrigin: 'preset' | 'generator';
  nativeModelClips: THREE.AnimationClip[];
  activeStructureRoot: THREE.Object3D | null;
  activePlayerInstance: PlayerCharacterInstance | null;
  activeSandbox: PlaySandboxHandle | null;
  activeStage: ActiveStage | null;
  activeVoxel: ActiveVoxelPreview | null;
  isVoxelMode: boolean;
  loadRequestToken: number;
  selectedItemId: string;
  motionCreepTest: boolean;
  turntableEnabled: boolean;
  turntableSpeedDeg: number;
  wireframeOverlay: boolean;
  boundsOverlayEnabled: boolean;
  boundsHelper: THREE.Box3Helper | null;

  actions: StudioPanelCallbacks;
  onCleanup: (fn: () => void) => void;
  disposeAll: () => void;
}

export function disposeGroupResources(root: THREE.Object3D): void {
  const seenTex = new Set<THREE.Texture>();
  const seenMat = new Set<THREE.Material>();
  root.traverse((obj) => {
    if (obj instanceof THREE.InstancedMesh) {
      obj.dispose();
    }
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (!m || seenMat.has(m)) continue;
        seenMat.add(m);
        if (m instanceof PixelizerMaterial) {
          const o = m.options;
          for (const t of [o.albedoMap, o.normalMap, o.emissionMap]) {
            if (t && t.userData?.pooled !== true && !seenTex.has(t)) {
              seenTex.add(t);
              t.dispose();
            }
          }
        } else if (m instanceof THREE.MeshStandardMaterial) {
          for (const t of [m.map, m.normalMap, m.emissiveMap]) {
            if (t && t.userData?.pooled !== true && !seenTex.has(t)) {
              seenTex.add(t);
              t.dispose();
            }
          }
        }
        m.dispose();
      }
    }
  });
}

export function createEventRegistry(): {
  listen: <K extends keyof HTMLElementEventMap>(
    el: EventTarget,
    type: K | string,
    handler: EventListenerOrEventListenerObject
  ) => void;
  cleanup: () => void;
} {
  const entries: { el: EventTarget; type: string; handler: EventListenerOrEventListenerObject }[] = [];
  return {
    listen: (el, type, handler) => {
      el.addEventListener(type, handler);
      entries.push({ el, type, handler });
    },
    cleanup: () => {
      for (const e of entries) {
        e.el.removeEventListener(e.type, e.handler);
      }
      entries.length = 0;
    },
  };
}
