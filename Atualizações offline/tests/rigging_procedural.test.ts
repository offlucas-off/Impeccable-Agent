// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { readFileSync } from 'node:fs';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { dirname, resolve } from 'node:path';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { describe, expect, it } from 'vitest';
import {
  AnimationLibraryBank,
  NWL_8_DIRECTIONS,
  SteppedAnimationController,
  UAL_ANIMATION_CATALOG,
  UAL_SKELETON_SPEC,
  buildProceduralProp,
  buildProceduralStructure,
  buildProceduralUalCharacter,
  createCanonicalUalRig,
  detectUalSkeletonCompatibility,
  exportRiggedAssetToGlb,
  findUalRigInHierarchy,
  makeClipInPlace,
  retargetUalClipsToModel,
  validateAndNormalizeRiggedHierarchy,
  voxelizeObject3DRigged,
} from '../src/engine';
import type { PropKind } from '../src/engine/procedural/PropBuilder';
import type { StructureBiome } from '../src/engine/procedural/TilesetStructureSolver';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readFileAsArrayBuffer(relPath: string): ArrayBuffer {
  const buf = readFileSync(resolve(ROOT_DIR, relPath)) as Uint8Array;
  return new Uint8Array(buf).buffer;
}

describe('Quaternius UAL Skeleton Spec & Master Animation Library', () => {
  it('matches canonical 65-bone Quaternius UAL topology and AnimViewer catalog', () => {
    expect(UAL_SKELETON_SPEC.boneCount).toBe(65);
    expect(UAL_SKELETON_SPEC.structuralBoneCount).toBe(22);
    expect(UAL_SKELETON_SPEC.fingerOptionalBoneCount).toBe(40);
    expect(UAL_SKELETON_SPEC.heights.maleMeters).toBeCloseTo(1.829, 2);
    expect(UAL_SKELETON_SPEC.heights.femaleMeters).toBeCloseTo(1.808, 2);

    expect(UAL_ANIMATION_CATALOG.playableCount).toBe(85);
    expect(UAL_ANIMATION_CATALOG.animViewerTotalTaxonomy).toBeGreaterThanOrEqual(230);
    expect(UAL_ANIMATION_CATALOG.categories).toContain('Combat & Combos');
    expect(UAL_ANIMATION_CATALOG.categories).toContain('Zombie');

    const rigM = createCanonicalUalRig('male', 1.0);
    const rigF = createCanonicalUalRig('female', 1.0);
    expect(rigM.bones.length).toBe(65);
    expect(rigF.bones.length).toBe(65);
    expect(detectUalSkeletonCompatibility(rigM.armature).compatible).toBe(true);
    expect(detectUalSkeletonCompatibility(rigF.armature).compatible).toBe(true);

    // Female upper arm origin is slightly closer to spine (shorter clavicle/shoulder) than male
    const shM = new THREE.Vector3();
    const shF = new THREE.Vector3();
    rigM.boneByName.get('upperarm_l')!.getWorldPosition(shM);
    rigF.boneByName.get('upperarm_l')!.getWorldPosition(shF);
    expect(Math.abs(shF.x)).toBeLessThan(Math.abs(shM.x));
  });

  it('loads real ual_master_library.glb (85 clips), filters by AnimViewer tags, and strips root motion', async () => {
    const bank = AnimationLibraryBank.getInstance();
    const ab = readFileAsArrayBuffer('public/animations/ual_master_library.glb');
    const clips = await bank.loadFromArrayBuffer(ab);

    expect(clips.length).toBe(85);
    expect(bank.getClip('Idle_Loop')).not.toBeNull();
    expect(bank.getClip('Sword_Regular_A')).not.toBeNull();
    expect(bank.getClip('Zombie_Walk_Fwd_Loop')).not.toBeNull();

    const swordMatches = bank.filter({ query: 'sword' });
    expect(swordMatches.length).toBeGreaterThanOrEqual(3);

    const rpgPreset = bank.getPresetClips('rpg_core');
    expect(rpgPreset.length).toBe(14);

    // Verify in-place utility preserves clip duration while zeroing horizontal root XZ drift
    const walkClip = bank.getClip('Jog_Fwd_Loop')!;
    const inPlace = makeClipInPlace(walkClip);
    expect(inPlace.duration).toBeCloseTo(walkClip.duration, 4);
    const rootTrack = inPlace.tracks.find((t) => t.name === 'root.position');
    if (rootTrack && rootTrack.values.length >= 6) {
      expect(rootTrack.values[rootTrack.values.length - 3]).toBeCloseTo(rootTrack.values[0], 5);
      expect(rootTrack.values[rootTrack.values.length - 1]).toBeCloseTo(rootTrack.values[2], 5);
    }
  });
});

describe('Autonomous Procedural Characters, Props, Structures & Round-Trip Rigged GLB', () => {
  it('builds Skinned, Rigid-NWL, and Rigged-Voxel characters onto 65-bone UAL rig and animates cleanly', async () => {
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) {
      await bank.loadFromArrayBuffer(readFileAsArrayBuffer('public/animations/ual_master_library.glb'));
    }
    const swordClip = bank.getClip('Sword_Regular_A')!;
    const zombieClip = bank.getClip('Zombie_Walk_Fwd_Loop')!;

    // 1. SkinnedMesh mode
    const knightSkinned = buildProceduralUalCharacter({
      archetype: 'knight',
      genderProfile: 'male',
      rigMode: 'skinned_mesh',
      visualStyle: 'lowpoly',
      seed: 42,
    });
    expect(detectUalSkeletonCompatibility(knightSkinned.root).compatible).toBe(true);
    const skinVal = validateAndNormalizeRiggedHierarchy(knightSkinned.root);
    expect(skinVal.boneCount).toBe(65);
    expect(skinVal.skinnedMeshCount).toBe(1);
    expect(skinVal.normalizedVertices).toBe(0);

    // Animate & verify hand_r moved from rest pose
    const handR = knightSkinned.rig.boneByName.get('hand_r')!;
    const restPos = new THREE.Vector3();
    knightSkinned.root.updateMatrixWorld(true);
    handR.getWorldPosition(restPos);

    const animCtrl = new SteppedAnimationController();
    animCtrl.bindModel(knightSkinned.root, [swordClip]);
    animCtrl.playClip(0);
    animCtrl.setTime(swordClip.duration * 0.45);
    knightSkinned.root.updateMatrixWorld(true);
    const swingPos = new THREE.Vector3();
    handR.getWorldPosition(swingPos);
    expect(swingPos.distanceTo(restPos)).toBeGreaterThan(0.05);
    animCtrl.dispose();

    // 2. NWL Rigid Segments mode (0 SkinnedMesh)
    const hunterRigid = buildProceduralUalCharacter({
      archetype: 'ranger',
      genderProfile: 'female',
      rigMode: 'rigid_segments',
      visualStyle: 'lowpoly',
      seed: 108,
    });
    expect(detectUalSkeletonCompatibility(hunterRigid.root).compatible).toBe(true);
    const rigidVal = validateAndNormalizeRiggedHierarchy(hunterRigid.root);
    expect(rigidVal.boneCount).toBe(65);
    expect(rigidVal.skinnedMeshCount).toBe(0);
    expect(rigidVal.meshCount).toBeGreaterThanOrEqual(14);

    // 3. Rigged Voxel mode
    const zombieVoxel = buildProceduralUalCharacter({
      archetype: 'zombie',
      rigMode: 'skinned_mesh',
      visualStyle: 'voxel',
      voxelResolution: 18,
      seed: 99,
    });
    const voxVal = validateAndNormalizeRiggedHierarchy(zombieVoxel.root);
    expect(voxVal.boneCount).toBe(65);
    expect(voxVal.skinnedMeshCount).toBe(1);
    expect(voxVal.normalizedVertices).toBe(0);

    // Check socket resolution helper on built rig
    expect(findUalRigInHierarchy(zombieVoxel.root)).not.toBeNull();

    // Animate zombie voxel mesh
    const zCtrl = new SteppedAnimationController();
    zCtrl.bindModel(zombieVoxel.root, [zombieClip]);
    zCtrl.playClip(0);
    zCtrl.setTime(zombieClip.duration * 0.4);
    zombieVoxel.root.updateMatrixWorld(true);
    const zHead = zombieVoxel.rig.boneByName.get('Head')!;
    const hp = new THREE.Vector3();
    zHead.getWorldPosition(hp);
    expect(hp.y).toBeGreaterThan(1.0);
    zCtrl.dispose();
  });

  it('exports valid rigged .GLB (65 bones + SkinnedMesh + 14 RPG clips) and re-imports cleanly', async () => {
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) {
      await bank.loadFromArrayBuffer(readFileAsArrayBuffer('public/animations/ual_master_library.glb'));
    }
    const rpgClips = bank.getPresetClips('rpg_core');
    expect(rpgClips.length).toBe(14);

    const charRes = buildProceduralUalCharacter({
      archetype: 'mage',
      genderProfile: 'female',
      rigMode: 'skinned_mesh',
      visualStyle: 'lowpoly',
      seed: 7,
    });

    const hadFileReader = 'FileReader' in globalThis;
    if (!hadFileReader) {
      (globalThis as Record<string, unknown>).FileReader = class NodeBlobReader {
        result: ArrayBuffer | string | null = null;
        onloadend: (() => void) | null = null;
        readAsArrayBuffer(blob: Blob): void {
          void blob.arrayBuffer().then((buf) => {
            this.result = buf;
            this.onloadend?.();
          });
        }
        readAsDataURL(blob: Blob): void {
          void blob.arrayBuffer().then((buf) => {
            const bytes = new Uint8Array(buf);
            let bin = '';
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            this.result = `data:application/octet-stream;base64,${btoa(bin)}`;
            this.onloadend?.();
          });
        }
      };
    }

    try {
      const { buffer, validation } = await exportRiggedAssetToGlb(charRes.root, rpgClips, {
        name: 'mage_rpg_test',
        selectedClipNames: rpgClips.map((c) => c.name),
        resetToRestPose: true,
      });

      expect(buffer.byteLength).toBeGreaterThan(4096);
      expect(validation.boneCount).toBe(65);
      expect(validation.skinnedMeshCount).toBe(1);
      expect(validation.clipCount).toBe(14);

      // Round-trip re-import via GLTFLoader
      const loader = new GLTFLoader();
      const reimported = await loader.parseAsync(buffer, '');
      expect(reimported.animations.length).toBe(14);

      const checkCompat = detectUalSkeletonCompatibility(reimported.scene);
      expect(checkCompat.compatible).toBe(true);
      let reBones = 0;
      let reSkinned = 0;
      reimported.scene.traverse((o) => {
        if (o instanceof THREE.Bone) reBones++;
        if (o instanceof THREE.SkinnedMesh) reSkinned++;
      });
      expect(reBones).toBe(65);
      expect(reSkinned).toBe(1);
    } finally {
      if (!hadFileReader) {
        delete (globalThis as Record<string, unknown>).FileReader;
      }
    }
  });

  it('voxelizes existing character geometry preserving canonical 65-bone UAL rig', () => {
    const src = buildProceduralUalCharacter({
      archetype: 'knight',
      rigMode: 'rigid_segments',
      visualStyle: 'lowpoly',
      seed: 55,
    });
    const voxRigged = voxelizeObject3DRigged(src.root, { resolution: 16 });
    expect(voxRigged.rig.bones.length).toBe(65);
    expect(voxRigged.skinnedMesh.isSkinnedMesh).toBe(true);
    const val = validateAndNormalizeRiggedHierarchy(voxRigged.root);
    expect(val.normalizedVertices).toBe(0);
    expect(voxRigged.grid.voxels.length).toBeGreaterThan(20);
  });

  it('builds CC0-calibrated Props & Weapons and +Z hand_r socket alignment', () => {
    const kinds: PropKind[] = [
      'sword', 'axe', 'shield', 'staff', 'torch', 'chest', 'barrel', 'table', 'pillar', 'crate', 'tree',
    ];
    for (const kind of kinds) {
      const prop = buildProceduralProp({ kind, seed: 123 });
      expect(prop.dimensions[0]).toBeGreaterThan(0.05);
      expect(prop.dimensions[1]).toBeGreaterThan(0.05);
      expect(prop.dimensions[2]).toBeGreaterThan(0.05);
      if (kind === 'sword') {
        expect(prop.recommendedSocket).toBe('hand_r');
        // Blade length aligns along +Z
        expect(prop.dimensions[2]).toBeGreaterThan(prop.dimensions[0]);
      }
    }
    const voxSword = buildProceduralProp({ kind: 'sword', visualStyle: 'voxel', voxelResolution: 16 });
    expect(voxSword.root.children.length).toBeGreaterThanOrEqual(1);
  });

  it('builds connected WFC 3D Structures across all 4 biomes', () => {
    const biomes: StructureBiome[] = ['dungeon', 'medieval', 'city', 'scifi'];
    for (const biome of biomes) {
      const s = buildProceduralStructure({
        biome,
        cols: 3,
        rows: 3,
        floors: 2,
        seed: 77,
      });
      expect(s.cells.length).toBeGreaterThanOrEqual(3);
      expect(s.root.children.length).toBeGreaterThanOrEqual(1);
    }
    expect(NWL_8_DIRECTIONS).toEqual(['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']);
  });

  it('retargets Quaternius UAL clips onto external Mixamo-named SkinnedMesh rig', async () => {
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) {
      await bank.loadFromArrayBuffer(readFileAsArrayBuffer('public/animations/ual_master_library.glb'));
    }
    // Construct external humanoid hierarchy with Mixamo-convention bone names
    const mixamoNames = [
      ['mixamorigHips', '', [0, 0.95, 0]],
      ['mixamorigSpine', 'mixamorigHips', [0, 0.14, 0]],
      ['mixamorigSpine1', 'mixamorigSpine', [0, 0.14, 0]],
      ['mixamorigSpine2', 'mixamorigSpine1', [0, 0.15, 0]],
      ['mixamorigNeck', 'mixamorigSpine2', [0, 0.16, 0]],
      ['mixamorigHead', 'mixamorigNeck', [0, 0.09, 0]],
      ['mixamorigLeftShoulder', 'mixamorigSpine2', [0.08, 0.12, 0]],
      ['mixamorigLeftArm', 'mixamorigLeftShoulder', [0.1, 0, 0]],
      ['mixamorigLeftForeArm', 'mixamorigLeftArm', [0, 0.26, 0]],
      ['mixamorigLeftHand', 'mixamorigLeftForeArm', [0, 0.24, 0]],
      ['mixamorigRightShoulder', 'mixamorigSpine2', [-0.08, 0.12, 0]],
      ['mixamorigRightArm', 'mixamorigRightShoulder', [-0.1, 0, 0]],
      ['mixamorigRightForeArm', 'mixamorigRightArm', [0, 0.26, 0]],
      ['mixamorigRightHand', 'mixamorigRightForeArm', [0, 0.24, 0]],
      ['mixamorigLeftUpLeg', 'mixamorigHips', [0.1, -0.05, 0]],
      ['mixamorigLeftLeg', 'mixamorigLeftUpLeg', [0, 0.4, 0]],
      ['mixamorigLeftFoot', 'mixamorigLeftLeg', [0, 0.4, 0]],
      ['mixamorigRightUpLeg', 'mixamorigHips', [-0.1, -0.05, 0]],
      ['mixamorigRightLeg', 'mixamorigRightUpLeg', [0, 0.4, 0]],
      ['mixamorigRightFoot', 'mixamorigRightLeg', [0, 0.4, 0]],
    ] as const;

    const extRoot = new THREE.Group();
    const bonesByName = new Map<string, THREE.Bone>();
    const bones: THREE.Bone[] = [];
    for (const [bName, parentName, pos] of mixamoNames) {
      const b = new THREE.Bone();
      b.name = bName;
      b.position.set(pos[0], pos[1], pos[2]);
      bones.push(b);
      bonesByName.set(bName, b);
      if (parentName && bonesByName.has(parentName)) {
        bonesByName.get(parentName)!.add(b);
      } else {
        extRoot.add(b);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0, 0.2, 0.5, 0], 3));
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 4));
    const skel = new THREE.Skeleton(bones);
    const skinned = new THREE.SkinnedMesh(geo, new THREE.MeshBasicMaterial());
    skinned.bind(skel, new THREE.Matrix4());
    extRoot.add(skinned);
    extRoot.updateMatrixWorld(true);

    const sampleClips = bank.getPresetClips('rpg_core').slice(0, 4);
    const res = retargetUalClipsToModel(extRoot, sampleClips);
    expect(res.mode).toBe('retargeted');
    expect(res.matchedBones).toBe(20);
    expect(res.clips.length).toBe(4);
    expect(res.clips[0].tracks.length).toBeGreaterThan(0);

    geo.dispose();
    (skinned.material as THREE.Material).dispose();
  });
});
