import * as THREE from 'three';
import { PixelizerMaterial } from '../../engine/PixelizerMaterial';
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
  buildSpellVfxShowcase,
  type GeneratedSpellVfxResult,
} from '../../engine/procedural/SpellVfxBuilder';
import {
  buildProceduralStructure,
  type GeneratedStructureResult,
} from '../../engine/procedural/TilesetStructureSolver';
import { AnimationLibraryBank } from '../../engine/rigging/AnimationLibraryBank';
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
    if (isLargeStructure) {
      subjectRoot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(subjectRoot);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const nextH = Number(
        Math.max(8.5, Math.min(28.0, Math.max(size.x, size.z) * 0.84 + size.y * 0.9)).toFixed(1)
      );
      ctx.pipeline.cameraConfig.orthoHeight = nextH;
      if (rngOrtho) rngOrtho.value = String(nextH);
      if (valOrtho) valOrtho.textContent = nextH.toFixed(1);
      ctx.orbitTarget.set(center.x, Math.max(1.2, center.y * 0.72), center.z);
      ctx.dirLight.shadow.camera.left = -22;
      ctx.dirLight.shadow.camera.right = 22;
      ctx.dirLight.shadow.camera.top = 22;
      ctx.dirLight.shadow.camera.bottom = -22;
      ctx.dirLight.shadow.camera.updateProjectionMatrix();
      ctx.actions.setCameraPose(30, 45, 32);
    } else {
      ctx.pipeline.cameraConfig.orthoHeight = 5.8;
      if (rngOrtho) rngOrtho.value = '5.8';
      if (valOrtho) valOrtho.textContent = '5.8';
      ctx.orbitTarget.set(0, 1.0, 0);
      ctx.dirLight.shadow.camera.left = -6;
      ctx.dirLight.shadow.camera.right = 6;
      ctx.dirLight.shadow.camera.top = 6;
      ctx.dirLight.shadow.camera.bottom = -6;
      ctx.dirLight.shadow.camera.updateProjectionMatrix();
      ctx.actions.setCameraPose(30, 45, 12);
    }
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
    if (refs.selStylePreset.value === 'hades_lab') {
      ctx.pipeline.applyVisualStylePreset('hades_lab', ctx.scene);
    }

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
    if ((refs.selStylePreset.value as VisualStylePresetId) === 'hades_lab') {
      ctx.pipeline.applyVisualStylePreset('hades_lab', ctx.scene);
    }
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
      const allClips = bank.getAll().map((x) => x.clip.clone());
      if (allClips.length === 0) return;
      ctx.nativeModelClips = allClips;
      ctx.animCtrl.bindModel(subjectRoot, allClips);
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
    const { wrapScene, items } = buildStageWrapAndItems(
      vfx.root,
      vfx.meta.labelPt,
      vfx.materials
    );

    applyStage({
      name: `Magia / VFX NWL: ${vfx.meta.labelPt}`,
      description: `VFX 3D pixelado sem blur suave (${vfx.triangleCount} tris · Flat Palette LUT · duração ${vfx.meta.durationSec}s).`,
      subjectRoot: vfx.root,
      sceneRoot: wrapScene,
      items,
      updateAnimation: (t, motionTest) => {
        const dur = Math.max(0.25, vfx.meta.durationSec);
        vfx.updatePhase((t % dur) / dur);
        vfx.root.position.x = motionTest ? Math.sin(t * 1.1) * 1.0 : 0;
      },
      onCleanup: () => vfx.dispose(),
    });
  }

  function mountNwlCustomScene(opts: {
    name: string;
    description: string;
    root: THREE.Group;
    materials: PixelizerMaterial[];
    isLargeStructure?: boolean;
    onUpdate?: (t: number) => void;
    onCleanup?: () => void;
  }): void {
    ctx.activeStructureRoot = opts.isLargeStructure ? opts.root : null;
    ctx.nativeModelClips = [];
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
          pixelSize: 3,
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
          pixelSize: 3,
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
            mx.clipAction(idle.clone()).play();
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
            pixelSize: 3,
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
          mx.clipAction(clip.clone()).play();
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
      const showcase = buildSpellVfxShowcase(ctx.pipeline.getSharedResourcesForMaterial());
      mountNwlCustomScene({
        name: 'NWL: Magias & VFX 3D Pixelados',
        description: `Catálogo com ${showcase.vfxItems.length} efeitos (projéteis, skills de classe, telegraphs e impactos sem blur suave).`,
        root: showcase.root,
        materials: showcase.materials,
        isLargeStructure: true,
        onUpdate: (t) => showcase.update(t),
        onCleanup: () => showcase.dispose(),
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
