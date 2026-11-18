import * as THREE from 'three';
import ualSkeletonSpecRaw from '../../data/ualSkeletonSpec.json';
import ualAnimationCatalogRaw from '../../data/ualAnimationCatalog.json';

export type UalGenderProfile = 'male' | 'female';
export type UalSocketName = 'hand_r' | 'hand_l' | 'head' | 'back';
export type UalRigBuildMode = 'skinned_mesh' | 'rigid_segments';

export interface UalBoneTransformSpec {
  translation: [number, number, number];
  rotation: [number, number, number, number];
  worldPos: [number, number, number];
}

export interface UalBoneSpec {
  order: number;
  name: string;
  parent: string;
  isStructural: boolean;
  isFingerOptional: boolean;
  male: UalBoneTransformSpec;
  female: UalBoneTransformSpec;
  children: string[];
}

export interface UalCapsuleSpec {
  bone: string;
  endBone?: string;
  endOffsetLocalY?: number;
  radius: number;
}

export interface UalSocketSpec {
  bone: string;
  offset: [number, number, number];
  bladeAxis: string;
  role: string;
}

export interface UalSkeletonSpec {
  schemaVersion: string;
  source: string;
  boneCount: number;
  structuralBoneCount: number;
  fingerOptionalBoneCount: number;
  upAxis: string;
  forwardAxis: string;
  limbLongAxisLocal: string;
  weaponForwardAxisLocal: string;
  heights: { maleMeters: number; femaleMeters: number };
  sockets: Record<UalSocketName, UalSocketSpec>;
  bones: UalBoneSpec[];
  structuralCapsules: UalCapsuleSpec[];
}

export interface UalPlayableClipMeta {
  name: string;
  library: 'UAL1' | 'UAL2';
  category: string;
  durationSec: number;
  loop: boolean;
  playable: boolean;
  rootMotionAvailable: boolean;
  tags: string[];
  tracks: number;
}

export interface UalAnimViewerEntry {
  name: string;
  library: string;
  category: string;
  tags: string[];
  includedInStandard: boolean;
}

export interface UalAnimationCatalog {
  schemaVersion: string;
  source: string;
  playableCount: number;
  animViewerTotalTaxonomy: number;
  categories: string[];
  presets: Record<string, string[]>;
  playableClips: UalPlayableClipMeta[];
  animViewerCatalog: UalAnimViewerEntry[];
}

export const UAL_SKELETON_SPEC = ualSkeletonSpecRaw as UalSkeletonSpec;
export const UAL_ANIMATION_CATALOG = ualAnimationCatalogRaw as UalAnimationCatalog;

export const UAL_BONE_NAMES: readonly string[] = UAL_SKELETON_SPEC.bones.map((b) => b.name);
export const UAL_STRUCTURAL_BONES: readonly string[] = UAL_SKELETON_SPEC.bones
  .filter((b) => b.isStructural)
  .map((b) => b.name);

export interface CanonicalUalRig {
  profile: UalGenderProfile;
  scale: number;
  armature: THREE.Group;
  rootBone: THREE.Bone;
  bones: THREE.Bone[];
  boneByName: Map<string, THREE.Bone>;
  skeleton: THREE.Skeleton;
  sockets: Record<UalSocketName, THREE.Group>;
}

/**
 * Constructs the canonical 65-bone Quaternius Universal Humanoid Armature
 * matching exact rest translations, orientations, and bone order of UAL 1 & 2.
 */
export function createCanonicalUalRig(
  profile: UalGenderProfile = 'male',
  scale = 1.0
): CanonicalUalRig {
  const armature = new THREE.Group();
  armature.name = 'Armature';
  if (Math.abs(scale - 1.0) > 1e-6) {
    armature.scale.setScalar(scale);
  }

  const bones: THREE.Bone[] = new Array(UAL_SKELETON_SPEC.bones.length);
  const boneByName = new Map<string, THREE.Bone>();

  for (const spec of UAL_SKELETON_SPEC.bones) {
    const bone = new THREE.Bone();
    bone.name = spec.name;
    const tr = profile === 'female' ? spec.female : spec.male;
    bone.position.set(tr.translation[0], tr.translation[1], tr.translation[2]);
    bone.quaternion.set(tr.rotation[0], tr.rotation[1], tr.rotation[2], tr.rotation[3]);
    bones[spec.order] = bone;
    boneByName.set(spec.name, bone);
  }

  for (const spec of UAL_SKELETON_SPEC.bones) {
    const child = bones[spec.order];
    if (spec.parent === 'Armature') {
      armature.add(child);
    } else {
      const parentBone = boneByName.get(spec.parent);
      if (parentBone) {
        parentBone.add(child);
      } else {
        armature.add(child);
      }
    }
  }

  const rootBone = boneByName.get('root') ?? bones[0];

  const sockets = {} as Record<UalSocketName, THREE.Group>;
  (Object.keys(UAL_SKELETON_SPEC.sockets) as UalSocketName[]).forEach((socketKey) => {
    const sk = UAL_SKELETON_SPEC.sockets[socketKey];
    const marker = new THREE.Group();
    marker.name = `Socket_${socketKey}`;
    marker.position.set(sk.offset[0], sk.offset[1], sk.offset[2]);
    const hostBone = boneByName.get(sk.bone) ?? rootBone;
    hostBone.add(marker);
    sockets[socketKey] = marker;
  });

  armature.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);
  skeleton.calculateInverses();

  return {
    profile,
    scale,
    armature,
    rootBone,
    bones,
    boneByName,
    skeleton,
    sockets,
  };
}

/**
 * Attaches an equipment prop cleanly into a canonical UAL socket, clearing previous attached props.
 */
export function mountPropToUalSocket(
  rig: CanonicalUalRig,
  socketName: UalSocketName,
  prop: THREE.Object3D | null
): void {
  const socket = rig.sockets[socketName];
  if (!socket) return;
  while (socket.children.length > 0) {
    socket.remove(socket.children[0]);
  }
  if (prop) {
    socket.add(prop);
  }
}

/**
 * Checks if an existing Object3D hierarchy already follows the Quaternius UAL bone schema.
 */
export function detectUalSkeletonCompatibility(root: THREE.Object3D): {
  compatible: boolean;
  matchedStructuralBones: number;
  totalStructuralBones: number;
  missingCoreBones: string[];
} {
  const foundNames = new Set<string>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Bone || obj.name) {
      foundNames.add(obj.name);
    }
  });
  const missing: string[] = [];
  for (const req of UAL_STRUCTURAL_BONES) {
    if (!foundNames.has(req)) {
      missing.push(req);
    }
  }
  const matched = UAL_STRUCTURAL_BONES.length - missing.length;
  return {
    compatible: missing.length === 0,
    matchedStructuralBones: matched,
    totalStructuralBones: UAL_STRUCTURAL_BONES.length,
    missingCoreBones: missing,
  };
}

/**
 * Resolves a CanonicalUalRig descriptor (bones + sockets, creating socket markers on the fly if missing)
 * from any existing Object3D whose bones match the Quaternius UAL schema.
 */
export function findUalRigInHierarchy(root: THREE.Object3D): CanonicalUalRig | null {
  const compat = detectUalSkeletonCompatibility(root);
  if (!compat.compatible) return null;

  const boneByName = new Map<string, THREE.Bone>();
  let armature: THREE.Group | null = null;
  const bones: THREE.Bone[] = [];

  root.traverse((obj) => {
    if (obj.name === 'Armature' && obj instanceof THREE.Group) {
      armature = obj;
    }
    if (obj instanceof THREE.Bone && !boneByName.has(obj.name)) {
      boneByName.set(obj.name, obj);
    }
  });

  for (const spec of UAL_SKELETON_SPEC.bones) {
    const found = boneByName.get(spec.name);
    if (found) bones[spec.order] = found;
  }
  const orderedBones = bones.filter(Boolean);
  const rootBone = boneByName.get('root') ?? orderedBones[0];
  if (!rootBone) return null;

  const sockets = {} as Record<UalSocketName, THREE.Group>;
  (Object.keys(UAL_SKELETON_SPEC.sockets) as UalSocketName[]).forEach((socketKey) => {
    const sk = UAL_SKELETON_SPEC.sockets[socketKey];
    const hostBone = boneByName.get(sk.bone) ?? rootBone;
    let marker = hostBone.children.find(
      (c): c is THREE.Group => c.name === `Socket_${socketKey}` && c instanceof THREE.Group
    );
    if (!marker) {
      marker = new THREE.Group();
      marker.name = `Socket_${socketKey}`;
      marker.position.set(sk.offset[0], sk.offset[1], sk.offset[2]);
      hostBone.add(marker);
    }
    sockets[socketKey] = marker;
  });

  let existingSkel: THREE.Skeleton | null = null;
  root.traverse((obj) => {
    if (!existingSkel && obj instanceof THREE.SkinnedMesh && obj.skeleton) {
      existingSkel = obj.skeleton;
    }
  });

  return {
    profile: 'male',
    scale: 1.0,
    armature: armature ?? (root as THREE.Group),
    rootBone,
    bones: orderedBones,
    boneByName,
    skeleton: existingSkel ?? new THREE.Skeleton(orderedBones),
    sockets,
  };
}
