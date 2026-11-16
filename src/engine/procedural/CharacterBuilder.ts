import * as THREE from 'three';
import { type PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import { voxelizeObject3DRigged } from '../Voxelizer';
import {
  attachRigidPartsToUalRig,
  bindGeometryToUalSkeleton,
  type RigidPartSpec,
} from '../rigging/AutoRigBinder';
import {
  createCanonicalUalRig,
  mountPropToUalSocket,
  type CanonicalUalRig,
  type UalGenderProfile,
  type UalRigBuildMode,
} from '../rigging/UalRigSpec';
import { buildProceduralProp, type PropKind } from './PropBuilder';
import {
  createSeededRng,
  makeBoneSegmentBox,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';

export type CharacterArchetype = 'knight' | 'ranger' | 'mage' | 'zombie' | 'villager' | 'golem';

export interface CharacterBuildOptions {
  archetype?: CharacterArchetype;
  genderProfile?: UalGenderProfile;
  rigMode?: UalRigBuildMode;
  visualStyle?: 'lowpoly' | 'voxel';
  voxelResolution?: number;
  seed?: number;
  equipMainHand?: PropKind | 'auto' | 'none';
  equipOffHand?: PropKind | 'auto' | 'none';
  pixelSize?: number;
  objectId?: number;
}

export interface GeneratedCharacterResult {
  name: string;
  archetype: CharacterArchetype;
  rigMode: UalRigBuildMode;
  visualStyle: 'lowpoly' | 'voxel';
  rig: CanonicalUalRig;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
}

interface ArchetypePalette {
  skin: string;
  armorPrimary: string;
  armorSecondary: string;
  cloth: string;
  accent: string;
  boots: string;
  hair: string;
  defaultMain: PropKind | 'none';
  defaultOff: PropKind | 'none';
  bulkyScale: number;
}

const ARCHETYPE_PALETTES: Record<CharacterArchetype, ArchetypePalette> = {
  knight: {
    skin: '#e0b090',
    armorPrimary: '#8a96ad',
    armorSecondary: '#545f75',
    cloth: '#8f2934',
    accent: '#e3b84c',
    boots: '#3f3532',
    hair: '#4d3321',
    defaultMain: 'sword',
    defaultOff: 'shield',
    bulkyScale: 1.08,
  },
  ranger: {
    skin: '#d9a482',
    armorPrimary: '#366642',
    armorSecondary: '#664329',
    cloth: '#264430',
    accent: '#c9a653',
    boots: '#452d1d',
    hair: '#693d1e',
    defaultMain: 'axe',
    defaultOff: 'torch',
    bulkyScale: 0.96,
  },
  mage: {
    skin: '#e3b89a',
    armorPrimary: '#47367d',
    armorSecondary: '#2c2254',
    cloth: '#6c49a8',
    accent: '#42e0f5',
    boots: '#302338',
    hair: '#cfd6e3',
    defaultMain: 'staff',
    defaultOff: 'none',
    bulkyScale: 0.95,
  },
  zombie: {
    skin: '#7eb36b',
    armorPrimary: '#635f52',
    armorSecondary: '#4d433b',
    cloth: '#7a4942',
    accent: '#9cd17b',
    boots: '#3b322e',
    hair: '#354032',
    defaultMain: 'axe',
    defaultOff: 'none',
    bulkyScale: 0.98,
  },
  villager: {
    skin: '#dfa987',
    armorPrimary: '#946b45',
    armorSecondary: '#61442a',
    cloth: '#466c8f',
    accent: '#d6ae5e',
    boots: '#47301e',
    hair: '#5c3c22',
    defaultMain: 'none',
    defaultOff: 'none',
    bulkyScale: 1.0,
  },
  golem: {
    skin: '#646c7d',
    armorPrimary: '#525866',
    armorSecondary: '#383d47',
    cloth: '#414652',
    accent: '#45e6ff',
    boots: '#2d313b',
    hair: '#788296',
    defaultMain: 'none',
    defaultOff: 'none',
    bulkyScale: 1.28,
  },
};

function getBoneSpanY(rig: CanonicalUalRig, boneName: string, fallback: number): number {
  const b = rig.boneByName.get(boneName);
  if (!b || b.children.length === 0) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) {
      return ch.position.y;
    }
  }
  return fallback;
}

/**
 * Generates an autonomous humanoid character built natively onto the 65-bone Quaternius UAL rig,
 * supporting both NWL rigid-bone segmentation (`skinnedMeshes: 0`) and smooth capsule SkinnedMesh / Voxel 3D.
 */
export function buildProceduralUalCharacter(
  options: CharacterBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedCharacterResult {
  const archetype = options.archetype ?? 'knight';
  const profile = options.genderProfile ?? 'male';
  const rigMode = options.rigMode ?? 'skinned_mesh';
  const visualStyle = options.visualStyle ?? 'lowpoly';
  const seed = options.seed ?? 42;
  const rng = createSeededRng(seed);
  const pal = ARCHETYPE_PALETTES[archetype];
  const objId = options.objectId ?? 10;
  const px = options.pixelSize ?? 3;

  const rig = createCanonicalUalRig(profile, 1.0);
  const bulk = pal.bulkyScale * (profile === 'female' ? 0.92 : 1.0) * (0.96 + rng() * 0.08);

  const pelvisLen = getBoneSpanY(rig, 'pelvis', 0.138);
  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const neckLen = getBoneSpanY(rig, 'neck_01', 0.083);
  const upperArmL = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lowerArmL = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const upperArmR = getBoneSpanY(rig, 'upperarm_r', 0.274);
  const lowerArmR = getBoneSpanY(rig, 'lowerarm_r', 0.273);
  const thighLen = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calfLen = getBoneSpanY(rig, 'calf_l', 0.43);

  const partSpecs: RigidPartSpec[] = [];

  // Pelvis & belt
  partSpecs.push({
    name: 'Pelvis_Belt',
    boneName: 'pelvis',
    geometry: mergeColoredParts([
      makeBoneSegmentBox(pelvisLen * 1.15, 0.155 * bulk, 0.115 * bulk, 0.145 * bulk, 0.105 * bulk, pal.cloth),
      makeBoneSegmentBox(0.055, 0.165 * bulk, 0.125 * bulk, 0.165 * bulk, 0.125 * bulk, pal.accent),
    ]),
  });

  // Lower & mid torso
  partSpecs.push({
    name: 'Torso_Lower',
    boneName: 'spine_01',
    geometry: makeBoneSegmentBox(spine1Len * 1.1, 0.14 * bulk, 0.10 * bulk, 0.155 * bulk, 0.11 * bulk, pal.armorSecondary),
  });
  partSpecs.push({
    name: 'Torso_Mid',
    boneName: 'spine_02',
    geometry: makeBoneSegmentBox(spine2Len * 1.12, 0.155 * bulk, 0.11 * bulk, 0.18 * bulk, 0.125 * bulk, pal.armorPrimary),
  });

  // Upper chest + collar/cape
  const chestParts: THREE.BufferGeometry[] = [
    makeBoneSegmentBox(spine3Len * 0.92, 0.18 * bulk, 0.125 * bulk, 0.195 * bulk, 0.13 * bulk, pal.armorPrimary),
  ];
  if (archetype === 'knight' || archetype === 'ranger') {
    const capeGeo = new THREE.BoxGeometry(0.32 * bulk, 0.56, 0.04);
    capeGeo.translate(0, -0.14, -0.14 * bulk);
    chestParts.push(prepareColoredPart(capeGeo, pal.cloth));
  }
  partSpecs.push({ name: 'Torso_Chest', boneName: 'spine_03', geometry: mergeColoredParts(chestParts) });

  // Neck + Head (+ Helmet/Hood/Hair)
  partSpecs.push({
    name: 'Neck',
    boneName: 'neck_01',
    geometry: makeBoneSegmentBox(neckLen * 1.1, 0.055 * bulk, 0.055 * bulk, 0.05 * bulk, 0.05 * bulk, pal.skin),
  });

  const headParts: THREE.BufferGeometry[] = [];
  const headCube = new THREE.BoxGeometry(0.22 * bulk, 0.24 * bulk, 0.22 * bulk);
  headCube.translate(0, 0.11 * bulk, 0);
  headParts.push(prepareColoredPart(headCube, pal.skin));

  if (archetype === 'knight') {
    const helm = new THREE.BoxGeometry(0.25 * bulk, 0.25 * bulk, 0.25 * bulk);
    helm.translate(0, 0.14 * bulk, 0);
    const visor = new THREE.BoxGeometry(0.21 * bulk, 0.07 * bulk, 0.08 * bulk);
    visor.translate(0, 0.11 * bulk, 0.11 * bulk);
    const crest = new THREE.BoxGeometry(0.05 * bulk, 0.12 * bulk, 0.24 * bulk);
    crest.translate(0, 0.28 * bulk, -0.02);
    headParts.push(
      prepareColoredPart(helm, pal.armorPrimary),
      prepareColoredPart(visor, pal.armorSecondary),
      prepareColoredPart(crest, pal.cloth)
    );
  } else if (archetype === 'mage') {
    const brim = new THREE.CylinderGeometry(0.27, 0.28, 0.03, 8);
    brim.translate(0, 0.23 * bulk, 0);
    const cone = new THREE.ConeGeometry(0.16, 0.34, 8);
    cone.rotateX(-0.15);
    cone.translate(0, 0.4 * bulk, -0.03);
    headParts.push(prepareColoredPart(brim, pal.armorPrimary), prepareColoredPart(cone, pal.cloth));
  } else if (archetype === 'ranger') {
    const hood = new THREE.BoxGeometry(0.245 * bulk, 0.24 * bulk, 0.255 * bulk);
    hood.translate(0, 0.14 * bulk, -0.015);
    headParts.push(prepareColoredPart(hood, pal.armorPrimary));
  } else {
    const hair = new THREE.BoxGeometry(0.235 * bulk, 0.1 * bulk, 0.235 * bulk);
    hair.translate(0, 0.21 * bulk, -0.01);
    headParts.push(prepareColoredPart(hair, pal.hair));
  }
  partSpecs.push({ name: 'Head_Unit', boneName: 'Head', geometry: mergeColoredParts(headParts) });

  // Arms (Left & Right) + Optional Pauldrons
  const buildArm = (side: 'l' | 'r', uLen: number, lLen: number) => {
    const uParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(uLen * 0.96, 0.068 * bulk, 0.068 * bulk, 0.056 * bulk, 0.056 * bulk, pal.armorSecondary),
    ];
    if (archetype === 'knight' || archetype === 'golem') {
      const pauldron = new THREE.BoxGeometry(0.16 * bulk, 0.12 * bulk, 0.16 * bulk);
      pauldron.translate(0, 0.04, 0);
      uParts.push(prepareColoredPart(pauldron, pal.armorPrimary));
    }
    partSpecs.push({
      name: `UpperArm_${side}`,
      boneName: `upperarm_${side}`,
      geometry: mergeColoredParts(uParts),
    });
    partSpecs.push({
      name: `LowerArm_${side}`,
      boneName: `lowerarm_${side}`,
      geometry: makeBoneSegmentBox(lLen * 0.96, 0.056 * bulk, 0.056 * bulk, 0.046 * bulk, 0.046 * bulk, pal.armorPrimary),
    });
    partSpecs.push({
      name: `Hand_${side}`,
      boneName: `hand_${side}`,
      geometry: makeBoneSegmentBox(0.12, 0.046 * bulk, 0.042 * bulk, 0.04 * bulk, 0.036 * bulk, pal.skin),
    });
  };
  buildArm('l', upperArmL, lowerArmL);
  buildArm('r', upperArmR, lowerArmR);

  // Legs & Boots (Left & Right)
  for (const side of ['l', 'r'] as const) {
    partSpecs.push({
      name: `Thigh_${side}`,
      boneName: `thigh_${side}`,
      geometry: makeBoneSegmentBox(thighLen * 0.96, 0.088 * bulk, 0.088 * bulk, 0.068 * bulk, 0.068 * bulk, pal.cloth),
    });
    partSpecs.push({
      name: `Calf_${side}`,
      boneName: `calf_${side}`,
      geometry: makeBoneSegmentBox(calfLen * 0.96, 0.068 * bulk, 0.068 * bulk, 0.054 * bulk, 0.054 * bulk, pal.boots),
    });
    partSpecs.push({
      name: `Foot_${side}`,
      boneName: `foot_${side}`,
      geometry: makeBoneSegmentBox(0.18, 0.058 * bulk, 0.065 * bulk, 0.05 * bulk, 0.055 * bulk, pal.boots),
    });
  }

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];

  // Always assemble rigid parts onto the bone hierarchy first so bone-local transforms yield exact Rest Pose geometry
  const rigidRes = attachRigidPartsToUalRig(rig, partSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  if (rigMode === 'rigid_segments' && visualStyle === 'lowpoly') {
    meshes.push(...rigidRes.meshes);
    materials.push(...rigidRes.materials);
  } else {
    // Convert rigid-bone assembly either into Voxel SkinnedMesh or unified capsule SkinnedMesh
    rig.armature.updateMatrixWorld(true);
    const invArmature = new THREE.Matrix4().copy(rig.armature.matrixWorld).invert();
    const worldParts: THREE.BufferGeometry[] = [];
    const partBoneIndices: number[] = [];
    const boneIdxByName = new Map<string, number>();
    rig.bones.forEach((b, i) => boneIdxByName.set(b.name, i));

    for (const m of rigidRes.meshes) {
      const mToArm = new THREE.Matrix4().multiplyMatrices(invArmature, m.matrixWorld);
      const g = m.geometry.clone().applyMatrix4(mToArm);
      worldParts.push(g);
      const bName = m.parent instanceof THREE.Bone ? m.parent.name : 'pelvis';
      const bIdx = boneIdxByName.get(bName) ?? 0;
      const vc = g.getAttribute('position').count;
      for (let k = 0; k < vc; k++) partBoneIndices.push(bIdx);
      m.parent?.remove(m);
      m.geometry.dispose();
    }
    for (const mat of rigidRes.materials) mat.dispose();

    const unifiedGeo = mergeColoredParts(worldParts);
    for (const wp of worldParts) wp.dispose();

    if (visualStyle === 'voxel') {
      // Build temp unskinned mesh in Rest Pose and voxelize onto this exact UAL rig
      const tmp = new THREE.Mesh(unifiedGeo, new THREE.MeshStandardMaterial({ vertexColors: true }));
      const voxRes = voxelizeObject3DRigged(
        tmp,
        {
          resolution: options.voxelResolution ?? 24,
          profile,
          targetUalRig: rig,
          fillSolidInterior: true,
        },
        sharedResources,
        { objectId: objId, pixelSize: 1 }
      );
      unifiedGeo.dispose();
      (tmp.material as THREE.Material).dispose();
      meshes.push(voxRes.skinnedMesh);
      materials.push(voxRes.material);
    } else {
      const perVertHints = new Uint16Array(partBoneIndices);
      const bound = bindGeometryToUalSkeleton(
        unifiedGeo,
        rig,
        { objectId: objId, pixelSize: px },
        sharedResources,
        {
          name: `UAL_${archetype}_Skinned`,
          perVertexBoneIndices: perVertHints,
        }
      );
      meshes.push(bound.mesh);
      materials.push(bound.material);
    }
  }

  // Equip weapons / offhand into canonical UAL sockets
  const mainKind =
    options.equipMainHand === 'auto' || options.equipMainHand === undefined
      ? pal.defaultMain
      : options.equipMainHand;
  const offKind =
    options.equipOffHand === 'auto' || options.equipOffHand === undefined
      ? pal.defaultOff
      : options.equipOffHand;

  if (mainKind !== 'none') {
    const propR = buildProceduralProp(
      { kind: mainKind, seed: seed + 11, visualStyle, objectId: objId, pixelSize: visualStyle === 'voxel' ? 1 : px },
      sharedResources
    );
    mountPropToUalSocket(rig, 'hand_r', propR.root);
    propR.root.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    materials.push(...propR.materials);
  }

  if (offKind !== 'none') {
    const propL = buildProceduralProp(
      { kind: offKind, seed: seed + 29, visualStyle, objectId: objId, pixelSize: visualStyle === 'voxel' ? 1 : px },
      sharedResources
    );
    mountPropToUalSocket(rig, 'hand_l', propL.root);
    propL.root.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    materials.push(...propL.materials);
  }

  const root = new THREE.Group();
  root.name = `Char_${archetype}_${seed}`;
  root.add(rig.armature);

  return {
    name: root.name,
    archetype,
    rigMode,
    visualStyle,
    rig,
    root,
    meshes,
    materials,
  };
}
