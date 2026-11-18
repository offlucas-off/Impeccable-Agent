import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { createCanonicalUalRig, detectUalSkeletonCompatibility } from './UalRigSpec';

const ALIAS_GROUPS: Record<string, string[]> = {
  pelvis: ['pelvis', 'hips', 'hip', 'mixamorighips', 'bip01pelvis', 'root_hips'],
  spine_01: ['spine_01', 'spine', 'spine1', 'mixamorigspine', 'abdomen'],
  spine_02: ['spine_02', 'spine2', 'chest', 'torso', 'mixamorigspine1'],
  spine_03: ['spine_03', 'spine3', 'upperchest', 'mixamorigspine2'],
  neck_01: ['neck_01', 'neck', 'mixamorigneck'],
  Head: ['head', 'mixamorighead'],
  clavicle_l: ['clavicle_l', 'shoulder_l', 'leftshoulder', 'shoulder.l', 'mixamorigleftshoulder'],
  upperarm_l: ['upperarm_l', 'upperarm.l', 'upper_arm_l', 'leftarm', 'upperarml', 'arm_l', 'mixamorigleftarm'],
  lowerarm_l: ['lowerarm_l', 'lowerarm.l', 'lower_arm_l', 'forearm_l', 'leftforearm', 'lowerarml', 'mixamorigleftforearm'],
  hand_l: ['hand_l', 'hand.l', 'lefthand', 'handl', 'wrist_l', 'mixamoriglefthand'],
  clavicle_r: ['clavicle_r', 'shoulder_r', 'rightshoulder', 'shoulder.r', 'mixamorigrightshoulder'],
  upperarm_r: ['upperarm_r', 'upperarm.r', 'upper_arm_r', 'rightarm', 'upperarmr', 'arm_r', 'mixamorigrightarm'],
  lowerarm_r: ['lowerarm_r', 'lowerarm.r', 'lower_arm_r', 'forearm_r', 'rightforearm', 'lowerarmr', 'mixamorigrightforearm'],
  hand_r: ['hand_r', 'hand.r', 'righthand', 'handr', 'wrist_r', 'mixamorigrighthand'],
  thigh_l: ['thigh_l', 'thigh.l', 'upperleg_l', 'upperleg.l', 'leftupleg', 'upperlegl', 'leg_l', 'mixamorigleftupleg'],
  calf_l: ['calf_l', 'shin_l', 'shin.l', 'lowerleg_l', 'lowerleg.l', 'leftleg', 'lowerlegl', 'knee_l', 'mixamorigleftleg'],
  foot_l: ['foot_l', 'foot.l', 'leftfoot', 'footl', 'ankle_l', 'mixamorigleftfoot'],
  ball_l: ['ball_l', 'toe_l', 'toes_l', 'lefttoebase', 'mixamoriglefttoebase'],
  thigh_r: ['thigh_r', 'thigh.r', 'upperleg_r', 'upperleg.r', 'rightupleg', 'upperlegr', 'leg_r', 'mixamorigrightupleg'],
  calf_r: ['calf_r', 'shin_r', 'shin.r', 'lowerleg_r', 'lowerleg.r', 'rightleg', 'lowerlegr', 'knee_r', 'mixamorigrightleg'],
  foot_r: ['foot_r', 'foot.r', 'rightfoot', 'footr', 'ankle_r', 'mixamorigrightfoot'],
  ball_r: ['ball_r', 'toe_r', 'toes_r', 'righttoebase', 'mixamorigrighttoebase'],
};

function normalizeBoneName(name: string): string {
  return name.toLowerCase().replace(/^.*[:/]/, '').replace(/[^a-z0-9]/g, '');
}

/**
 * Builds a mapping `{ targetBoneName -> sourceUalBoneName }` for any external rig
 * (Mixamo, KayKit Rig_Medium, Three.js examples, Blender Humanoid).
 */
export function buildExternalToUalBoneMap(targetRoot: THREE.Object3D): Record<string, string> {
  const map: Record<string, string> = {};
  const reverseAlias = new Map<string, string>();
  for (const [ualBone, aliases] of Object.entries(ALIAS_GROUPS)) {
    for (const a of aliases) {
      reverseAlias.set(normalizeBoneName(a), ualBone);
    }
    reverseAlias.set(normalizeBoneName(ualBone), ualBone);
  }

  targetRoot.traverse((obj) => {
    if (obj instanceof THREE.Bone) {
      const norm = normalizeBoneName(obj.name);
      const ualMatch = reverseAlias.get(norm);
      if (ualMatch) {
        map[obj.name] = ualMatch;
      }
    }
  });
  return map;
}

/**
 * Retargets UAL AnimationClips onto any rigged target model:
 * - If the model already matches the canonical 65-bone UAL schema, clips bind zero-cost directly.
 * - Otherwise, maps external humanoid bones (Mixamo/KayKit/Blender) via SkeletonUtils.retargetClip.
 */
export function retargetUalClipsToModel(
  targetRoot: THREE.Object3D,
  ualClips: THREE.AnimationClip[],
  fps = 15
): {
  mode: 'native_ual' | 'retargeted' | 'unmapped';
  matchedBones: number;
  clips: THREE.AnimationClip[];
} {
  const compat = detectUalSkeletonCompatibility(targetRoot);
  if (compat.compatible) {
    return {
      mode: 'native_ual',
      matchedBones: compat.matchedStructuralBones,
      clips: ualClips.map((c) => c.clone()),
    };
  }

  let firstSkinned: THREE.SkinnedMesh | null = null;
  targetRoot.traverse((obj) => {
    if (!firstSkinned && obj instanceof THREE.SkinnedMesh && obj.skeleton) {
      firstSkinned = obj;
    }
  });

  const boneMap = buildExternalToUalBoneMap(targetRoot);
  const matchedCount = Object.keys(boneMap).length;

  if (!firstSkinned || matchedCount < 6) {
    return {
      mode: 'unmapped',
      matchedBones: matchedCount,
      clips: [],
    };
  }

  // Create canonical UAL source helper mesh to drive SkeletonUtils.retargetClip accurately
  const srcRig = createCanonicalUalRig('male', 1.0);
  const dummyGeo = new THREE.BufferGeometry();
  dummyGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0, 0.1, 0, 0], 3));
  dummyGeo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 4));
  dummyGeo.setAttribute('skinWeight', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 4));
  const srcSkinned = new THREE.SkinnedMesh(dummyGeo, new THREE.MeshBasicMaterial());
  srcSkinned.bind(srcRig.skeleton, new THREE.Matrix4());
  srcRig.armature.add(srcSkinned);
  srcRig.armature.updateMatrixWorld(true);

  const targetSkinned = firstSkinned as THREE.SkinnedMesh;
  targetSkinned.skeleton.pose();
  targetRoot.updateMatrixWorld(true);

  // Compute rest-pose localOffsets between canonical UAL bones and target rig bones
  const localOffsets: Record<string, THREE.Matrix4> = {};
  const srcRestQ = new THREE.Quaternion();
  const dstRestQ = new THREE.Quaternion();
  const deltaQ = new THREE.Quaternion();
  for (const dstBone of targetSkinned.skeleton.bones) {
    const ualName = boneMap[dstBone.name];
    if (!ualName) continue;
    const srcBone = srcRig.boneByName.get(ualName);
    if (!srcBone) continue;
    srcBone.getWorldQuaternion(srcRestQ);
    dstBone.getWorldQuaternion(dstRestQ);
    deltaQ.copy(srcRestQ).invert().multiply(dstRestQ);
    localOffsets[dstBone.name] = new THREE.Matrix4().makeRotationFromQuaternion(deltaQ);
  }

  const hipTargetName =
    Object.keys(boneMap).find((k) => boneMap[k] === 'pelvis') ?? 'pelvis';

  const normalizeTracksToNodeNames = (clip: THREE.AnimationClip): THREE.AnimationClip => {
    for (const tr of clip.tracks) {
      if (tr.name.startsWith('.bones[')) {
        tr.name = tr.name.replace(/^\.bones\[([^\]]+)\]\./, '$1.');
      }
    }
    return clip;
  };

  const retargeted: THREE.AnimationClip[] = [];
  for (const clip of ualClips) {
    try {
      const out = SkeletonUtils.retargetClip(targetSkinned, srcSkinned, clip, {
        names: boneMap,
        hip: hipTargetName,
        localOffsets,
        preserveBonePositions: true,
        preserveBoneMatrix: true,
        fps,
      } as unknown as Record<string, unknown>);
      out.name = clip.name;
      retargeted.push(normalizeTracksToNodeNames(out));
    } catch {
      // Fallback: rename tracks matching direct map
      const cloned = clip.clone();
      const ualToTarget = new Map<string, string>();
      for (const [tBone, uBone] of Object.entries(boneMap)) {
        ualToTarget.set(uBone, tBone);
      }
      cloned.tracks = cloned.tracks.filter((tr) => {
        const dot = tr.name.lastIndexOf('.');
        if (dot < 0) return false;
        const b = tr.name.slice(0, dot);
        const mapped = ualToTarget.get(b);
        if (!mapped) return false;
        tr.name = mapped + tr.name.slice(dot);
        return true;
      });
      if (cloned.tracks.length > 0) retargeted.push(cloned);
    }
  }

  targetSkinned.skeleton.pose();
  targetRoot.updateMatrixWorld(true);
  dummyGeo.dispose();
  (srcSkinned.material as THREE.Material).dispose();

  return {
    mode: 'retargeted',
    matchedBones: matchedCount,
    clips: retargeted,
  };
}
