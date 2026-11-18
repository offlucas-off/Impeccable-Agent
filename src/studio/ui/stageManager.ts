import * as THREE from 'three';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../../engine/PixelizerMaterial';
import type { VisualStylePresetId } from '../../engine/PixelizerPipeline';
import {
  buildProceduralUalCharacter,
  type GeneratedCharacterResult,
} from '../../engine/procedural/CharacterBuilder';
import { buildNwlStarterCity } from '../../engine/procedural/CityBuilder';
import {
  NWL_MONSTER_IDS,
  buildNwlMonster,
  type GeneratedMonsterResult,
} from '../../engine/procedural/MonsterBuilder';
import { buildNwlNpc, type GeneratedNpcResult } from '../../engine/procedural/NpcBuilder';
import {
  buildGreenRuinsFloor1,
  buildNwlTilesetCatalog,
} from '../../engine/procedural/NwlTilesetDungeon';
import type { UnwrapMetricsSummary } from '../../engine/procedural/PixelMaterialSynth';
import {
  buildNwlPlayerCharacter,
  type PlayerCharacterInstance,
  type PlayerClassId,
} from '../../engine/procedural/PlayerEquipmentBuilder';
import type { GeneratedPropResult } from '../../engine/procedural/PropBuilder';
import {
  NWL_SPELL_VFX_CATALOG,
  buildNwlSpellVfx,
  buildSpellVfxShowcase,
  getSpellVfxRecipe,
  type GeneratedSpellVfxResult,
} from '../../engine/procedural/SpellVfxBuilder';
import {
  buildProceduralStructure,
  type GeneratedStructureResult,
} from '../../engine/procedural/TilesetStructureSolver';
import { AnimationLibraryBank } from '../../engine/rigging/AnimationLibraryBank';
import {
  conditionClipWithEquipment,
  detectSubjectEquipment,
} from '../../engine/steppedAnimation';
import {
  InstancedVfxParticlePool,
  PixelTrailRenderer,
  VfxLightPool,
  VfxTimelinePlayer,
} from '../../engine/vfx';
import { createNwlPlaySandbox } from '../../sandbox/NwlPlaySandbox';
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
import {
  CHARACTER_PRESETS,
  disposeGroupResources,
  type ActiveStage,
  type StudioContext,
} from '../state/studioContext';

export interface AutoFrameParams {
  orthoHeight: number;
  target: THREE.Vector3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  shadowHalf: number;
  cameraDistance: number;
}

/**
 * Computes Box3-based orthographic camera framing for any loaded preset or generated asset.
 */
export function computeAutoFrameParams(
  subjectRoot: THREE.Object3D,
  isLargeStructure = false
): AutoFrameParams {
  subjectRoot.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(subjectRoot);
  const size = new THREE.Vector3(1.2, 1.8, 1.2);
  const center = new THREE.Vector3(0, 0.9, 0);
  if (!box.isEmpty()) {
    box.getSize(size);
    box.getCenter(center);
  }

  if (isLargeStructure) {
    const orthoHeight = Number(
      THREE.MathUtils.clamp(
        Math.max(size.x, size.z) * 0.84 + size.y * 0.9,
        8.5,
        30.0
      ).toFixed(1)
    );
    return {
      orthoHeight,
      target: new THREE.Vector3(center.x, Math.max(1.2, center.y * 0.72), center.z),
      size,
      center,
      shadowHalf: 22,
      cameraDistance: 32,
    };
  }

  const safeY = Number.isFinite(size.y) && size.y > 0.05 ? size.y : 1.8;
  const orthoHeight = Number(THREE.MathUtils.clamp(safeY * 1.65, 2.6, 30.0).toFixed(1));
  const targetY = Number.isFinite(center.y) ? center.y : Math.max(0.5, safeY * 0.5);
  return {
    orthoHeight,
    target: new THREE.Vector3(
      Number.isFinite(center.x) ? center.x : 0,
      targetY,
      Number.isFinite(center.z) ? center.z : 0
    ),
    size,
    center,
    shadowHalf: Math.max(6, Math.ceil(Math.max(size.x, safeY, size.z) * 1.2)),
    cameraDistance: Math.max(12, orthoHeight * 1.8),
  };
}

export interface StudioSpellVfxRunner {
  root: THREE.Group;
  vfxLayerGroup: THREE.Group;
  vfx: GeneratedSpellVfxResult;
  timeline: VfxTimelinePlayer;
  particlePool: InstancedVfxParticlePool;
  trailRenderer: PixelTrailRenderer;
  lightPool: VfxLightPool;
  durationSec: number;
  step: (dt: number, motionTest?: boolean) => void;
  reset: () => void;
  dispose: () => void;
}

/**
 * Wires `VfxTimelinePlayer`, `InstancedVfxParticlePool`, `PixelTrailRenderer`, and `VfxLightPool`
 * around a `GeneratedSpellVfxResult` for continuous Studio playback and frame-by-frame spritesheet export.
 */
export function createStudioSpellVfxRunner(
  vfx: GeneratedSpellVfxResult,
  sharedResources?: PixelizerMaterialResources
): StudioSpellVfxRunner {
  const root = new THREE.Group();
  root.name = `StudioVfx_${vfx.id}`;
  const vfxLayerGroup = new THREE.Group();
  vfxLayerGroup.name = `StudioVfxLayer_${vfx.id}`;

  const recipe = getSpellVfxRecipe(vfx.id);
  const durationSec = Math.max(0.25, recipe.totalDurationSec || vfx.meta.durationSec);
  const particlePool = new InstancedVfxParticlePool(256, sharedResources);
  const trailRenderer = new PixelTrailRenderer({
    maxPoints: 28,
    width: 0.22,
    lifetimeSec: 0.34,
    colorHex: vfx.meta.elementColor,
    sharedResources,
  });
  const lightPool = new VfxLightPool(vfxLayerGroup as unknown as THREE.Scene, 6);
  vfxLayerGroup.add(particlePool.mesh, trailRenderer.mesh);
  root.add(vfx.root, vfxLayerGroup);

  const isProjectile =
    vfx.meta.category === 'projectile' ||
    vfx.id === 'seta_fogo' ||
    vfx.id === 'adaga_venenosa' ||
    vfx.id === 'flecha_perfurante' ||
    vfx.id === 'investida' ||
    vfx.id === 'salto_sombrio';
  const isTelegraph = vfx.meta.category === 'telegraph';

  const emitOrigin = new THREE.Vector3(0, 0.55, 0);
  const computeEmitOrigin = (p: number): THREE.Vector3 => {
    if (vfx.id === 'meteoro') {
      return emitOrigin.set(vfx.root.position.x, 0.6 + (1 - p) * 2.8, vfx.root.position.z);
    }
    if (isProjectile) {
      return emitOrigin.set(vfx.root.position.x, 0.55, vfx.root.position.z);
    }
    if (isTelegraph) {
      return emitOrigin.set(vfx.root.position.x, 0.12, vfx.root.position.z);
    }
    return emitOrigin.set(
      vfx.root.position.x + Math.cos(p * Math.PI * 2) * 0.72,
      0.55,
      vfx.root.position.z + Math.sin(p * Math.PI * 2) * 0.72
    );
  };

  let loopElapsed = 0;
  let timeline: VfxTimelinePlayer | null = null;
  timeline = new VfxTimelinePlayer(recipe, {
    onStageEnter: (stageName) => {
      const stageDef = recipe.stages.find((s) => s.name === stageName);
      if (stageDef?.lightColor) {
        const p = timeline ? timeline.getNormalizedProgress() : 0;
        lightPool.spawnFlash(
          computeEmitOrigin(p),
          stageDef.lightColor,
          stageDef.lightIntensity ?? 1.8,
          stageDef.lightDistance ?? 5.5,
          Math.max(0.15, stageDef.durationSec)
        );
      }
    },
    onSpawnParticles: (spec) => {
      const p = timeline ? timeline.getNormalizedProgress() : 0;
      particlePool.spawnBurst(computeEmitOrigin(p), spec);
    },
  });

  const step = (dt: number, motionTest = false) => {
    const clampedDt = Math.max(0, Math.min(0.1, dt));
    if (clampedDt > 0 && timeline) {
      loopElapsed += clampedDt;
      if (timeline.isComplete()) {
        timeline.reset();
        loopElapsed = 0;
      }
      timeline.update(clampedDt);
    }

    const p = timeline ? timeline.getNormalizedProgress() : 0;
    if (isProjectile) {
      vfx.root.position.z = (p - 0.5) * 1.8;
    } else {
      vfx.root.position.z = 0;
    }
    vfx.root.position.x = motionTest ? Math.sin(loopElapsed * 2.4) * 1.0 : 0;
    vfx.updatePhase(p);

    if (clampedDt > 0) {
      if (!isTelegraph) {
        trailRenderer.addPoint(computeEmitOrigin(p));
      }
      lightPool.update(clampedDt);
      particlePool.update(clampedDt);
      trailRenderer.update(clampedDt);
    }
  };

  const reset = () => {
    loopElapsed = 0;
    vfx.root.position.set(0, 0, 0);
    vfx.updatePhase(0);
    lightPool.clear();
    timeline?.reset();
  };

  const dispose = () => {
    lightPool.dispose(vfxLayerGroup as unknown as THREE.Scene);
    particlePool.mesh.geometry.dispose();
    particlePool.material.dispose();
    trailRenderer.mesh.geometry.dispose();
    trailRenderer.material.dispose();
    vfx.dispose();
  };

  return {
    root,
    vfxLayerGroup,
    vfx,
    timeline,
    particlePool,
    trailRenderer,
    lightPool,
    durationSec,
    step,
    reset,
    dispose,
  };
}

export interface StageManagerHandle {
  buildStageWrapAndItems: (
    subjectRoot: THREE.Object3D,
    fallbackName: string,
    fallbackMats: PixelizerMaterial[],
    floorRadius?: number
  ) => { wrapScene: THREE.Group; items: SceneItemEntry[] };
  applyStageCameraFraming: (subjectRoot: THREE.Object3D, isLargeStructure: boolean) => void;
  applyStage: (next: ActiveStage, preservePlayer?: boolean) => void;
  mountLoadedModel: (
    loaded: LoadedModelResult,
    titleOverride?: string,
    descOverride?: string
  ) => void;
  bindUalClipsToSubject: (subjectRoot: THREE.Object3D, preferredName?: string) => void;
  mountNwlPlayer: (player: PlayerCharacterInstance, preferredClip?: string) => void;
  mountNwlNpc: (npc: GeneratedNpcResult) => void;
  mountNwlMonster: (monster: GeneratedMonsterResult) => void;
  mountNwlSpellVfx: (vfx: GeneratedSpellVfxResult) => void;
  mountNwlCustomScene: (opts: {
    name: string;
    description: string;
    root: THREE.Group;
    materials: PixelizerMaterial[];
    isLargeStructure?: boolean;
    onUpdate?: (t: number) => void;
    onCleanup?: () => void;
  }) => void;
  mountGeneratedCharacter: (res: GeneratedCharacterResult, preferredClip?: string) => void;
  mountGeneratedProp: (res: GeneratedPropResult) => void;
  mountGeneratedStructure: (res: GeneratedStructureResult) => void;
  loadDemoPreset: (presetId: DemoPresetId) => void;
  loadPresetSelection: (value: string) => Promise<void>;
  handleModelImport: (file: File) => Promise<void>;
  enterPlaySandbox: () => void;
  exitPlaySandbox: (reloadPreset?: boolean) => void;
  refreshStageSceneItems: () => void;
}

export function createStageManager(
  ctx: StudioContext,
  refs: {
    selDemo: HTMLSelectElement;
    selStylePreset: HTMLSelectElement;
    btnPlaySandbox: HTMLButtonElement;
    captionTitle: HTMLElement;
    captionDesc: HTMLElement;
    sceneCaptionEl: HTMLElement;
    onResetExportStats: () => void;
  }
): StageManagerHandle {
  function applyStageCameraFraming(subjectRoot: THREE.Object3D, isLargeStructure: boolean): void {
    const rngOrtho = ctx.rootElement.querySelector<HTMLInputElement>('#rng-ortho-h');
    const valOrtho = ctx.rootElement.querySelector<HTMLElement>('#val-ortho-h');
    const frame = computeAutoFrameParams(subjectRoot, isLargeStructure);
    const zoomLocked = ctx.rootElement.dataset.zoomLocked === 'true';

    if (!zoomLocked) {
      ctx.pipeline.cameraConfig.orthoHeight = frame.orthoHeight;
      if (rngOrtho) {
        const curMax = Number(rngOrtho.max) || 28;
        if (frame.orthoHeight > curMax) {
          rngOrtho.max = String(Math.ceil(frame.orthoHeight));
        }
        rngOrtho.value = String(frame.orthoHeight);
      }
      if (valOrtho) valOrtho.textContent = frame.orthoHeight.toFixed(1);
    }

    ctx.orbitTarget.copy(frame.target);
    ctx.dirLight.shadow.camera.left = -frame.shadowHalf;
    ctx.dirLight.shadow.camera.right = frame.shadowHalf;
    ctx.dirLight.shadow.camera.top = frame.shadowHalf;
    ctx.dirLight.shadow.camera.bottom = -frame.shadowHalf;
    ctx.dirLight.shadow.camera.updateProjectionMatrix();
    ctx.actions.setCameraPose(30, 45, frame.cameraDistance);
  }

  function exitPlaySandbox(reloadPreset = true): void {
    if (!ctx.activeSandbox) return;
    ctx.scene.remove(ctx.activeSandbox.root);
    ctx.activeSandbox.dispose();
    ctx.activeSandbox = null;
    ctx.controls.enablePan = true;
    refs.btnPlaySandbox.classList.remove('is-active');
    if (!ctx.pipeline.pipelineConfig.splitCompare) {
      refs.sceneCaptionEl.style.display = 'block';
    }
    if (reloadPreset) {
      void loadPresetSelection(refs.selDemo.value || 'nwl_knight');
    }
  }

  function enterPlaySandbox(): void {
    if (ctx.activeSandbox) {
      exitPlaySandbox(true);
      return;
    }
    ctx.loadRequestToken++;
    ctx.isVoxelMode = false;
    ctx.actions.disposeVoxelPreview();
    if (ctx.activeStage) {
      ctx.activeStage.onCleanup?.();
      ctx.scene.remove(ctx.activeStage.sceneRoot);
      disposeGroupResources(ctx.activeStage.sceneRoot);
      ctx.activeStage = null;
    }
    ctx.activePlayerInstance = null;
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);

    ctx.activeSandbox = createNwlPlaySandbox(ctx.stageEl, ctx.pipeline, {
      onExitSandbox: () => exitPlaySandbox(true),
      finishOptions: ctx.generatorHandle?.getFinishOptions(),
      projectWorldToScreen: (worldPos) => {
        const w = ctx.stageEl.clientWidth || ctx.canvas.width || 1;
        const h = ctx.stageEl.clientHeight || ctx.canvas.height || 1;
        ctx.activeCamera.updateMatrixWorld();
        const projected = worldPos.clone().project(ctx.activeCamera);
        if (projected.z < -1 || projected.z > 1) return { x: 0, y: 0, visible: false };
        return {
          x: (projected.x * 0.5 + 0.5) * w,
          y: (-projected.y * 0.5 + 0.5) * h,
          visible: true,
        };
      },
      onZoneOrActorChanged: () => {
        if (!ctx.activeSandbox) return;
        const target = ctx.activeSandbox.getCameraTarget();
        ctx.orbitTarget.copy(target);
        ctx.actions.setCameraPose(30, 45, 16);
      },
    });
    ctx.scene.add(ctx.activeSandbox.root);
    ctx.pipeline.applyVisualStylePreset(
      (refs.selStylePreset.value as VisualStylePresetId) || 'stylized_crisp',
      ctx.scene
    );

    ctx.pipeline.cameraConfig.orthoHeight = 10.5;
    const rngOrtho = ctx.rootElement.querySelector<HTMLInputElement>('#rng-ortho-h');
    const valOrtho = ctx.rootElement.querySelector<HTMLElement>('#val-ortho-h');
    if (rngOrtho) rngOrtho.value = '10.5';
    if (valOrtho) valOrtho.textContent = '10.5';
    ctx.dirLight.shadow.camera.left = -16;
    ctx.dirLight.shadow.camera.right = 16;
    ctx.dirLight.shadow.camera.top = 16;
    ctx.dirLight.shadow.camera.bottom = -16;
    ctx.dirLight.shadow.camera.updateProjectionMatrix();

    ctx.controls.enablePan = false;
    refs.btnPlaySandbox.classList.add('is-active');
    refs.sceneCaptionEl.style.display = 'none';

    ctx.orbitTarget.copy(ctx.activeSandbox.getCameraTarget());
    ctx.actions.setCameraPose(30, 45, 16);
  }

  function applyStage(next: ActiveStage, preservePlayer = false): void {
    if (ctx.activeSandbox) exitPlaySandbox(false);
    ctx.isVoxelMode = false;
    ctx.actions.disposeVoxelPreview();
    if (!preservePlayer) ctx.activePlayerInstance = null;
    if (ctx.activeStage) {
      ctx.activeStage.onCleanup?.();
      ctx.scene.remove(ctx.activeStage.sceneRoot);
      disposeGroupResources(ctx.activeStage.sceneRoot);
    }
    ctx.activeStage = next;
    ctx.scene.add(next.sceneRoot);
    ctx.pipeline.applyVisualStylePreset(
      (refs.selStylePreset.value as VisualStylePresetId) || 'stylized_crisp',
      ctx.scene
    );
    applyStageCameraFraming(next.subjectRoot, ctx.activeStructureRoot === next.subjectRoot);
    refs.captionTitle.textContent = next.name;
    refs.captionDesc.textContent = next.description;
    refs.onResetExportStats();
    ctx.generatorHandle?.updateQualityStats(
      (next.subjectRoot.userData?.unwrapMetrics as UnwrapMetricsSummary | undefined) ?? null
    );
    ctx.selectedItemId =
      next.items.find((i) => i.materials[0]?.options.pixelated)?.id ?? next.items[0]?.id ?? '';
    ctx.actions.renderSceneItemList();
    ctx.actions.syncObjectInspector();
    ctx.actions.syncConversionModeUi();
    ctx.actions.syncSkeletonHelper();
    ctx.animViewerHandle?.refreshFromActiveStage();
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
      ctx.pipeline.getSharedResourcesForMaterial()
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

  function bindUalClipsToSubject(subjectRoot: THREE.Object3D, preferredName = 'Idle_Loop'): void {
    const bank = AnimationLibraryBank.getInstance();
    const applyBankClips = () => {
      if (ctx.activeStage?.subjectRoot !== subjectRoot) return;
      const detected = detectSubjectEquipment(subjectRoot);
      const player =
        ctx.activePlayerInstance && ctx.activePlayerInstance.root === subjectRoot
          ? ctx.activePlayerInstance
          : null;
      const eq = {
        hasMainWeapon: player
          ? (player.styleLoadout.weaponMain as string) !== 'none' || detected.hasMainWeapon
          : detected.hasMainWeapon,
        hasShield: player
          ? player.styleLoadout.weaponOffhand !== 'none' || detected.hasShield
          : detected.hasShield,
      };
      const allClips = bank.getAll().map((x) => {
        const cloned = x.clip.clone();
        return eq.hasMainWeapon || eq.hasShield
          ? conditionClipWithEquipment(cloned, eq)
          : cloned;
      });
      if (allClips.length === 0) return;
      ctx.nativeModelClips = allClips;
      ctx.animCtrl.bindModel(subjectRoot, allClips, { equipmentFlags: eq });
      let idx = allClips.findIndex((c) => c.name === preferredName);
      if (idx < 0) idx = pickPreferredClipIndex(allClips);
      ctx.animCtrl.playClip(idx);
      ctx.actions.syncAnimClipSelector(allClips, idx);
      ctx.animViewerHandle?.refreshFromActiveStage();
    };

    if (bank.isLoaded()) {
      applyBankClips();
    } else {
      void bank.ensureLoaded().then(applyBankClips);
    }
  }

  function mountLoadedModel(
    loaded: LoadedModelResult,
    titleOverride?: string,
    descOverride?: string
  ): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = loaded.animations;
    const { wrapScene, items } = buildStageWrapAndItems(
      loaded.root,
      loaded.name,
      loaded.materials
    );

    ctx.animCtrl.bindModel(loaded.root, loaded.animations);
    if (loaded.animations.length > 0) {
      const bestIdx = pickPreferredClipIndex(loaded.animations);
      ctx.animCtrl.playClip(bestIdx);
      ctx.actions.syncAnimClipSelector(loaded.animations, bestIdx);
    } else {
      ctx.actions.syncAnimClipSelector([], 0);
    }

    const triSummary = loaded.wasSimplified
      ? `${loaded.finalTriangles.toLocaleString()} tris (otimizado de ${loaded.originalTriangles.toLocaleString()}${loaded.usedWorker ? ' via Worker' : ''})`
      : `${loaded.finalTriangles.toLocaleString()} tris${loaded.usedWorker ? ' (via Worker)' : ''}`;

    applyStage({
      name: titleOverride ?? `Imported: ${loaded.name}`,
      description:
        descOverride ??
        `${loaded.meshes.length} mesh(es) · ${triSummary} · ${loaded.animations.length} animation clip(s).`,
      subjectRoot: loaded.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (motionTest) {
          loaded.root.position.x = Math.sin(t * 1.1) * 1.25;
          loaded.root.rotation.y = t * 0.45;
        } else {
          loaded.root.position.x = 0;
          if (ctx.animCtrl.getClips().length === 0) {
            loaded.root.rotation.y = t * 0.4;
          }
        }
      },
    });
  }

  function mountNwlPlayer(
    player: PlayerCharacterInstance,
    preferredClip?: string
  ): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    const { wrapScene, items } = buildStageWrapAndItems(
      player.root,
      `NWL ${player.classId}`,
      player.materials
    );
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
    ctx.activePlayerInstance = player;

    const clip =
      preferredClip ??
      (player.classId === 'knight'
        ? 'Sword_Regular_A'
        : player.classId === 'mage'
          ? 'Spell_Simple_Shoot'
          : 'Idle_Loop');

    applyStage(
      {
        name: `NWL Herói: ${player.classId.toUpperCase()} (1.79m · Shell)`,
        description: `BaseShell padronizado (65 bones UAL) com 6 slots modulares (Elmo, Peitoral, Calça, Bota, Luva, Arma) · 1m=60px (108px).`,
        subjectRoot: player.root,
        sceneRoot: wrapScene,
        items,
        updateAnimation: (t, motionTest) => {
          player.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
        },
        onCleanup: () => player.dispose(),
      },
      true
    );
    bindUalClipsToSubject(player.root, clip);
  }

  function mountNwlNpc(npc: GeneratedNpcResult): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    const { wrapScene, items } = buildStageWrapAndItems(
      npc.root,
      npc.spec.namePt,
      npc.materials
    );
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);

    applyStage({
      name: `NWL NPC: ${npc.spec.namePt} (${npc.id})`,
      description: `${npc.spec.rolePt} · Estrutura: ${npc.spec.buildingName} · ${npc.id === 'npc.bau' ? 'Baú interativo animado' : 'Rig UAL 1.70m (~102px)'}.`,
      subjectRoot: npc.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (npc.setChestOpen) {
          npc.setChestOpen(Math.sin(t * 1.8) > 0);
        }
        npc.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
      },
      onCleanup: () => npc.dispose?.(),
    });
    if (npc.rig) bindUalClipsToSubject(npc.root, 'Idle_Loop');
  }

  function mountNwlMonster(monster: GeneratedMonsterResult): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    const floorR = monster.spec.role === 'boss' ? 7.2 : 5.5;
    const { wrapScene, items } = buildStageWrapAndItems(
      monster.root,
      monster.spec.namePt,
      monster.materials,
      floorR
    );
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);

    applyStage({
      name: `Bestiário NWL: ${monster.spec.namePt}`,
      description: `Escala oficial ${monster.spec.targetHeightM.toFixed(2)}m (~${monster.spec.targetHeightPx}px @ 60px/m) · HP ${monster.spec.maxHp} · Dano ${monster.spec.damage}.`,
      subjectRoot: monster.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        monster.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.25 : 0;
      },
      onCleanup: () => monster.dispose?.(),
    });
    bindUalClipsToSubject(monster.root, 'Sword_Regular_A');
  }

  function mountNwlSpellVfx(vfx: GeneratedSpellVfxResult): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
    const runner = createStudioSpellVfxRunner(
      vfx,
      ctx.pipeline.getSharedResourcesForMaterial()
    );
    const { wrapScene, items } = buildStageWrapAndItems(
      vfx.root,
      vfx.meta.labelPt,
      vfx.materials
    );
    wrapScene.remove(vfx.root);
    runner.root.add(vfx.root, runner.vfxLayerGroup);
    wrapScene.add(runner.root);

    let prevT = 0;
    let steppedViaRenderFrame = false;
    runner.root.userData.vfxRunner = runner;
    runner.root.userData.onRenderFrame = (dt: number) => {
      steppedViaRenderFrame = true;
      runner.step(dt, ctx.motionCreepTest);
    };

    applyStage({
      name: `Magia / VFX NWL: ${vfx.meta.labelPt}`,
      description: `VFX 3D pixelado sem blur suave (${vfx.triangleCount} tris · Flat Palette LUT · duração ${vfx.meta.durationSec}s).`,
      subjectRoot: runner.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        if (steppedViaRenderFrame) {
          steppedViaRenderFrame = false;
          prevT = t;
          return;
        }
        const dt = t >= prevT ? Math.min(0.1, t - prevT) : 0.016;
        prevT = t;
        runner.step(dt, motionTest);
      },
      onCleanup: () => runner.dispose(),
    });
  }

  function mountNwlCustomScene(opts: {
    name: string;
    description: string;
    root: THREE.Group;
    materials: PixelizerMaterial[];
    isLargeStructure?: boolean;
    clips?: THREE.AnimationClip[];
    onUpdate?: (t: number) => void;
    onCleanup?: () => void;
  }): void {
    ctx.activeStructureRoot = opts.isLargeStructure ? opts.root : null;
    ctx.nativeModelClips = opts.clips ?? [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
    const floorR = opts.isLargeStructure ? 18 : 6;
    const { wrapScene, items } = buildStageWrapAndItems(
      opts.root,
      opts.name,
      opts.materials,
      floorR
    );

    applyStage({
      name: opts.name,
      description: opts.description,
      subjectRoot: opts.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        opts.onUpdate?.(t);
        opts.root.position.x = motionTest ? Math.sin(t * 0.6) * 0.8 : 0;
      },
      onCleanup: opts.onCleanup,
    });

    if (opts.clips && opts.clips.length > 0) {
      ctx.animCtrl.bindModel(opts.root, opts.clips);
      ctx.animCtrl.playClip(0);
      ctx.actions.syncAnimClipSelector(opts.clips, 0);
      ctx.animViewerHandle?.refreshFromActiveStage();
    }
  }

  function mountGeneratedCharacter(
    res: GeneratedCharacterResult,
    preferredClip = 'Sword_Regular_A'
  ): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    const { wrapScene, items } = buildStageWrapAndItems(res.root, res.name, res.materials);
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);

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
      onCleanup: () => res.dispose?.(),
    });

    const pref = res.archetype === 'zombie' ? 'Zombie_Walk_Fwd_Loop' : preferredClip;
    bindUalClipsToSubject(res.root, pref);
  }

  function mountGeneratedProp(res: GeneratedPropResult): void {
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
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
      onCleanup: () => res.dispose?.(),
    });
  }

  function mountGeneratedStructure(res: GeneratedStructureResult): void {
    ctx.activeStructureRoot = res.root;
    ctx.nativeModelClips = [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
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
        res.root.position.x = motionTest ? Math.sin(t * 0.8) * 1.1 : 0;
      },
      onCleanup: () => res.dispose?.(),
    });
  }

  function loadDemoPreset(presetId: DemoPresetId): void {
    ctx.loadRequestToken++;
    ctx.activeStructureRoot = null;
    ctx.nativeModelClips = [];
    ctx.animCtrl.dispose();
    ctx.actions.syncAnimClipSelector([], 0);
    const built: BuiltDemoScene = buildDemoScene(
      presetId,
      ctx.pipeline.getSharedResourcesForMaterial()
    );
    applyStage(built);
  }

  async function loadPresetSelection(value: string): Promise<void> {
    ctx.lastStageOrigin = 'preset';
    const finish = ctx.generatorHandle?.getFinishOptions();

    if (value === 'nwl_knight' || value === 'nwl_archer' || value === 'nwl_mage') {
      ctx.loadRequestToken++;
      const classMap: Record<string, PlayerClassId> = {
        nwl_knight: 'knight',
        nwl_archer: 'archer',
        nwl_mage: 'mage',
      };
      const player = buildNwlPlayerCharacter(
        {
          classId: classMap[value],
          rarity: 'normal',
          pixelSize: 1,
          finishMode: finish?.finishMode,
          materialSeed: finish?.seed,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountNwlPlayer(player);
      return;
    }

    if (value === 'nwl_boss_demon') {
      ctx.loadRequestToken++;
      const boss = buildNwlMonster(
        'demons.boss_demon',
        {
          pixelSize: 1,
          finishMode: finish?.finishMode,
          seed: finish?.seed,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountNwlMonster(boss);
      return;
    }

    if (value === 'nwl_chest') {
      ctx.loadRequestToken++;
      const chest = buildNwlNpc(
        'npc.bau',
        finish
          ? {
              finishMode: finish.finishMode,
              seed: finish.seed,
              aoStrength: finish.aoStrength,
              normalStrength: finish.normalStrength,
            }
          : {},
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountNwlNpc(chest);
      return;
    }

    if (value === 'nwl_starter_city') {
      ctx.loadRequestToken++;
      const city = buildNwlStarterCity(
        ctx.pipeline.getSharedResourcesForMaterial(),
        finish
          ? {
              finishMode: finish.finishMode,
              seed: finish.seed,
              aoStrength: finish.aoStrength,
              normalStrength: finish.normalStrength,
            }
          : undefined
      );
      const bank = AnimationLibraryBank.getInstance();
      const npcMixers: THREE.AnimationMixer[] = [];
      const attachNpcIdles = () => {
        const idle = bank.getClip('Idle_Loop');
        if (!idle) return;
        for (const p of city.npcs) {
          if (p.instance.rig) {
            const mx = new THREE.AnimationMixer(p.instance.root);
            const eq = detectSubjectEquipment(p.instance.root);
            const clip =
              eq.hasMainWeapon || eq.hasShield
                ? conditionClipWithEquipment(idle, eq)
                : idle.clone();
            mx.clipAction(clip).play();
            npcMixers.push(mx);
          }
        }
      };
      if (bank.isLoaded()) attachNpcIdles();
      else void bank.ensureLoaded().then(attachNpcIdles);

      let prevT = 0;
      mountNwlCustomScene({
        name: city.name,
        description: `6 casas entráveis (base/capa/porta), 9 NPCs (~1.70m), Baú do Herói e Portal das Profundezas · Grid 1.5m.`,
        root: city.root,
        materials: city.materials,
        isLargeStructure: true,
        onUpdate: (t) => {
          const dt = Math.max(0, Math.min(0.1, t - prevT));
          prevT = t;
          for (const mx of npcMixers) mx.update(dt);
          city.update(t);
        },
        onCleanup: () => city.dispose(),
      });
      return;
    }

    if (value === 'nwl_bestiary') {
      ctx.loadRequestToken++;
      const group = new THREE.Group();
      group.name = 'NWL_Bestiary_Lineup';
      const allMats: PixelizerMaterial[] = [];
      const actors: GeneratedMonsterResult[] = [];
      const xs = [-5.4, -3.5, -1.7, 0.2, 2.5, 5.4];
      NWL_MONSTER_IDS.forEach((id, i) => {
        const m = buildNwlMonster(
          id,
          {
            pixelSize: 1,
            finishMode: finish?.finishMode,
            seed: finish ? finish.seed + i * 17 : undefined,
            aoStrength: finish?.aoStrength,
            normalStrength: finish?.normalStrength,
          },
          ctx.pipeline.getSharedResourcesForMaterial()
        );
        m.root.position.set(xs[i], 0, 0);
        group.add(m.root);
        actors.push(m);
        allMats.push(...m.materials);
      });
      const mixers: THREE.AnimationMixer[] = [];
      const bank = AnimationLibraryBank.getInstance();
      const attachClips = () => {
        const clip = bank.getClip('Idle_Loop') ?? bank.getClip('Sword_Regular_A');
        if (!clip) return;
        for (const a of actors) {
          const mx = new THREE.AnimationMixer(a.root);
          const eq = detectSubjectEquipment(a.root);
          const actorClip =
            eq.hasMainWeapon || eq.hasShield
              ? conditionClipWithEquipment(clip, eq)
              : clip.clone();
          mx.clipAction(actorClip).play();
          mixers.push(mx);
        }
      };
      if (bank.isLoaded()) attachClips();
      else void bank.ensureLoaded().then(attachClips);

      let prevT = 0;
      mountNwlCustomScene({
        name: 'Bestiário NWL: 5 Inimigos + Boss Demônio',
        description: `Comparativo real de escala: 4 Goblins (1.35m / 82px), Orc Bruto (2.10m / 125px) e Lorde Demônio (2.95m / 177px).`,
        root: group,
        materials: allMats,
        isLargeStructure: true,
        onUpdate: (t) => {
          const dt = Math.max(0, Math.min(0.1, t - prevT));
          prevT = t;
          for (const mx of mixers) mx.update(dt);
        },
        onCleanup: () => actors.forEach((a) => a.dispose?.()),
      });
      return;
    }

    if (value === 'nwl_dungeon_floor1') {
      ctx.loadRequestToken++;
      const dung = buildGreenRuinsFloor1(
        finish?.seed ?? 101,
        ctx.pipeline.getSharedResourcesForMaterial(),
        finish
          ? {
              finishMode: finish.finishMode,
              seed: finish.seed,
              aoStrength: finish.aoStrength,
              normalStrength: finish.normalStrength,
            }
          : undefined
      );
      mountNwlCustomScene({
        name: dung.name,
        description: `${dung.rooms.length} salas conectadas (1.5m/tile) · 5 Inimigos + Boss Demônio + Armadilhas + Destrutíveis.`,
        root: dung.root,
        materials: dung.materials,
        isLargeStructure: true,
        onUpdate: (t) => dung.update(t),
        onCleanup: () => dung.dispose(),
      });
      return;
    }

    if (value === 'nwl_tileset_ruins') {
      ctx.loadRequestToken++;
      const cat = buildNwlTilesetCatalog(
        'green_ruins',
        ctx.pipeline.getSharedResourcesForMaterial(),
        finish
          ? {
              finishMode: finish.finishMode,
              seed: finish.seed,
              aoStrength: finish.aoStrength,
              normalStrength: finish.normalStrength,
            }
          : undefined
      );
      mountNwlCustomScene({
        name: cat.name,
        description: `${cat.pieceCount} peças modulares 1.5m (chão, paredes 3m, flora, altar, baú, armadilha, destrutíveis).`,
        root: cat.root,
        materials: cat.materials,
        isLargeStructure: true,
        onCleanup: () => cat.dispose(),
      });
      return;
    }

    if (value === 'nwl_spells_vfx') {
      ctx.loadRequestToken++;
      const sharedRes = ctx.pipeline.getSharedResourcesForMaterial();
      const showcase = buildSpellVfxShowcase(sharedRes);
      const vfxLayer = new THREE.Group();
      vfxLayer.name = 'NWL_Spell_VFX_Showcase_Layer';
      const particlePool = new InstancedVfxParticlePool(256, sharedRes);
      const trailRenderer = new PixelTrailRenderer({
        maxPoints: 32,
        width: 0.2,
        lifetimeSec: 0.3,
        colorHex: '#fa6a0a',
        sharedResources: sharedRes,
      });
      const lightPool = new VfxLightPool(vfxLayer as unknown as THREE.Scene, 6);
      vfxLayer.add(particlePool.mesh, trailRenderer.mesh);
      showcase.root.add(vfxLayer);

      const timelines = showcase.vfxItems.map((item, idx) => {
        const recipe = getSpellVfxRecipe(item.id);
        let tl: VfxTimelinePlayer | null = null;
        tl = new VfxTimelinePlayer(recipe, {
          onStageEnter: (stageName) => {
            const st = recipe.stages.find((s) => s.name === stageName);
            if (st?.lightColor) {
              lightPool.spawnFlash(
                item.root.position.clone().setY(item.root.position.y + 0.5),
                st.lightColor,
                st.lightIntensity ?? 1.6,
                st.lightDistance ?? 4.5,
                Math.max(0.15, st.durationSec)
              );
            }
          },
          onSpawnParticles: (spec) => {
            particlePool.spawnBurst(
              item.root.position.clone().setY(item.root.position.y + 0.4),
              spec
            );
          },
        });
        // Stagger initial phases so the 9 showcase spells pulse asynchronously
        if (idx > 0) tl.update((idx * 0.14) % Math.max(0.25, recipe.totalDurationSec));
        return tl;
      });

      const stepShowcase = (dt: number) => {
        const clamped = Math.max(0, Math.min(0.1, dt));
        if (clamped <= 0) return;
        for (let i = 0; i < showcase.vfxItems.length; i++) {
          const tl = timelines[i];
          if (tl.isComplete()) tl.reset();
          tl.update(clamped);
          showcase.vfxItems[i].updatePhase(tl.getNormalizedProgress());
        }
        const leadPos = showcase.vfxItems[0]?.root.position;
        if (leadPos) {
          const p0 = timelines[0].getNormalizedProgress();
          trailRenderer.addPoint(
            new THREE.Vector3(
              leadPos.x + Math.cos(p0 * Math.PI * 2) * 0.65,
              leadPos.y + 0.45,
              leadPos.z + Math.sin(p0 * Math.PI * 2) * 0.65
            )
          );
        }
        lightPool.update(clamped);
        particlePool.update(clamped);
        trailRenderer.update(clamped);
      };

      let prevT = 0;
      let steppedViaRenderFrame = false;
      showcase.root.userData.onRenderFrame = (dt: number) => {
        steppedViaRenderFrame = true;
        stepShowcase(dt);
      };

      mountNwlCustomScene({
        name: 'NWL: Magias & VFX 3D Pixelados',
        description: `Catálogo com ${showcase.vfxItems.length} efeitos (projéteis, skills de classe, telegraphs e impactos sem blur suave).`,
        root: showcase.root,
        materials: showcase.materials,
        isLargeStructure: true,
        onUpdate: (t) => {
          if (steppedViaRenderFrame) {
            steppedViaRenderFrame = false;
            prevT = t;
            return;
          }
          const dt = t >= prevT ? Math.min(0.1, t - prevT) : 0.016;
          prevT = t;
          stepShowcase(dt);
        },
        onCleanup: () => {
          lightPool.dispose(vfxLayer as unknown as THREE.Scene);
          particlePool.mesh.geometry.dispose();
          particlePool.material.dispose();
          trailRenderer.mesh.geometry.dispose();
          trailRenderer.material.dispose();
          showcase.dispose();
        },
      });
      return;
    }

    const seedOrDefault = (def: number) =>
      finish && finish.seed !== 101 ? finish.seed : def;

    if (value === 'ual_knight') {
      ctx.loadRequestToken++;
      const res = buildProceduralUalCharacter(
        {
          archetype: 'knight',
          rigMode: 'skinned_mesh',
          visualStyle: 'lowpoly',
          seed: seedOrDefault(42),
          finishMode: finish?.finishMode,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Sword_Regular_A');
      return;
    }
    if (value === 'ual_knight_rigid') {
      ctx.loadRequestToken++;
      const res = buildProceduralUalCharacter(
        {
          archetype: 'knight',
          rigMode: 'rigid_segments',
          visualStyle: 'lowpoly',
          seed: seedOrDefault(108),
          finishMode: finish?.finishMode,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Jog_Fwd_Loop');
      return;
    }
    if (value === 'ual_zombie') {
      ctx.loadRequestToken++;
      const res = buildProceduralUalCharacter(
        {
          archetype: 'zombie',
          rigMode: 'skinned_mesh',
          visualStyle: 'voxel',
          voxelResolution: 24,
          seed: seedOrDefault(99),
          finishMode: finish?.finishMode,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedCharacter(res, 'Zombie_Walk_Fwd_Loop');
      return;
    }
    if (value === 'ual_dungeon') {
      ctx.loadRequestToken++;
      const struct = buildProceduralStructure(
        {
          biome: 'dungeon',
          cols: 4,
          rows: 4,
          floors: 1,
          seed: seedOrDefault(77),
          finishMode: finish?.finishMode,
          aoStrength: finish?.aoStrength,
          normalStrength: finish?.normalStrength,
        },
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      mountGeneratedStructure(struct);
      return;
    }

    const spellMeta = NWL_SPELL_VFX_CATALOG.find((s) => s.id === value);
    if (spellMeta) {
      ctx.loadRequestToken++;
      const vfx = buildNwlSpellVfx(spellMeta.id, ctx.pipeline.getSharedResourcesForMaterial());
      mountNwlSpellVfx(vfx);
      return;
    }

    const charDef = CHARACTER_PRESETS[value];
    if (!charDef) {
      loadDemoPreset(value as DemoPresetId);
      return;
    }
    const token = ++ctx.loadRequestToken;
    refs.captionTitle.textContent = `Loading ${charDef.title}...`;
    refs.captionDesc.textContent = `Fetching articulated GLB (${charDef.filename})...`;
    try {
      const loaded = await loadModelFromUrl(
        charDef.url,
        charDef.filename,
        ctx.pipeline.getSharedResourcesForMaterial()
      );
      if (token !== ctx.loadRequestToken) {
        disposeGroupResources(loaded.root);
        return;
      }
      mountLoadedModel(loaded, charDef.title, charDef.description);
    } catch (err) {
      if (token !== ctx.loadRequestToken) return;
      refs.captionTitle.textContent = `Failed to load ${charDef.title}`;
      refs.captionDesc.textContent = err instanceof Error ? err.message : 'Model load error';
    }
  }

  async function handleModelImport(file: File): Promise<void> {
    const token = ++ctx.loadRequestToken;
    refs.captionTitle.textContent = `Importando ${file.name}...`;
    refs.captionDesc.textContent = 'Lendo arquivo e preparando pipeline Pixelizer 3D...';
    try {
      const loaded = await loadModelFromFile(
        file,
        ctx.pipeline.getSharedResourcesForMaterial(),
        {},
        {
          unifyObjectId: true,
          onProgress: (info) => {
            if (token !== ctx.loadRequestToken) return;
            refs.captionDesc.textContent = info.detail;
          },
        }
      );
      if (token !== ctx.loadRequestToken) {
        disposeGroupResources(loaded.root);
        return;
      }
      ctx.lastStageOrigin = 'preset';
      mountLoadedModel(loaded);
    } catch (err) {
      if (token !== ctx.loadRequestToken) return;
      const msg = err instanceof Error ? err.message : 'Failed to load 3D file';
      refs.captionTitle.textContent = `Erro ao importar ${file.name}`;
      refs.captionDesc.textContent = msg;
      alert(msg);
    }
  }

  function refreshStageSceneItems(): void {
    if (!ctx.activeStage) return;
    const { items } = buildStageWrapAndItems(
      ctx.activeStage.subjectRoot,
      ctx.activeStage.name,
      []
    );
    ctx.activeStage.items.splice(0, ctx.activeStage.items.length, ...items);
    ctx.actions.renderSceneItemList();
    ctx.actions.syncObjectInspector();
  }

  return {
    buildStageWrapAndItems,
    applyStageCameraFraming,
    applyStage,
    mountLoadedModel,
    bindUalClipsToSubject,
    mountNwlPlayer,
    mountNwlNpc,
    mountNwlMonster,
    mountNwlSpellVfx,
    mountNwlCustomScene,
    mountGeneratedCharacter,
    mountGeneratedProp,
    mountGeneratedStructure,
    loadDemoPreset,
    loadPresetSelection,
    handleModelImport,
    enterPlaySandbox,
    exitPlaySandbox,
    refreshStageSceneItems,
  };
}
