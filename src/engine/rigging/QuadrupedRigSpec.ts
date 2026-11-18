import * as THREE from 'three';

export interface QuadrupedBoneDef {
  name: string;
  parent: string | null;
  position: [number, number, number];
}

export const QUADRUPED_BONE_DEFS: QuadrupedBoneDef[] = [
  { name: 'root', parent: null, position: [0, 0, 0] },
  { name: 'pelvis', parent: 'root', position: [0, 0.58, -0.28] },
  { name: 'spine_01', parent: 'pelvis', position: [0, 0.03, 0.18] },
  { name: 'spine_02', parent: 'spine_01', position: [0, 0.03, 0.2] },
  { name: 'spine_03', parent: 'spine_02', position: [0, 0.04, 0.22] },
  { name: 'neck_01', parent: 'spine_03', position: [0, 0.14, 0.16] },
  { name: 'head', parent: 'neck_01', position: [0, 0.14, 0.16] },
  { name: 'jaw', parent: 'head', position: [0, -0.05, 0.12] },
  { name: 'ear_l', parent: 'head', position: [0.09, 0.12, -0.02] },
  { name: 'ear_r', parent: 'head', position: [-0.09, 0.12, -0.02] },
  { name: 'tail_01', parent: 'pelvis', position: [0, 0.06, -0.14] },
  { name: 'tail_02', parent: 'tail_01', position: [0, -0.04, -0.22] },

  // Front Left Leg
  { name: 'front_upper_l', parent: 'spine_03', position: [0.14, -0.06, 0.04] },
  { name: 'front_lower_l', parent: 'front_upper_l', position: [0, -0.26, 0.02] },
  { name: 'front_paw_l', parent: 'front_lower_l', position: [0, -0.26, 0.04] },

  // Front Right Leg
  { name: 'front_upper_r', parent: 'spine_03', position: [-0.14, -0.06, 0.04] },
  { name: 'front_lower_r', parent: 'front_upper_r', position: [0, -0.26, 0.02] },
  { name: 'front_paw_r', parent: 'front_lower_r', position: [0, -0.26, 0.04] },

  // Back Left Leg
  { name: 'back_thigh_l', parent: 'pelvis', position: [0.14, -0.04, -0.02] },
  { name: 'back_shin_l', parent: 'back_thigh_l', position: [0, -0.26, -0.04] },
  { name: 'back_paw_l', parent: 'back_shin_l', position: [0, -0.26, 0.05] },

  // Back Right Leg
  { name: 'back_thigh_r', parent: 'pelvis', position: [-0.14, -0.04, -0.02] },
  { name: 'back_shin_r', parent: 'back_thigh_r', position: [0, -0.26, -0.04] },
  { name: 'back_paw_r', parent: 'back_shin_r', position: [0, -0.26, 0.05] },
];

export interface CanonicalQuadrupedRig {
  rootBone: THREE.Bone;
  bones: THREE.Bone[];
  boneByName: Map<string, THREE.Bone>;
  skeleton: THREE.Skeleton;
}

export function createCanonicalQuadrupedRig(scale = 1.0): CanonicalQuadrupedRig {
  const boneByName = new Map<string, THREE.Bone>();
  const bones: THREE.Bone[] = [];

  for (const def of QUADRUPED_BONE_DEFS) {
    const b = new THREE.Bone();
    b.name = def.name;
    b.position.set(def.position[0] * scale, def.position[1] * scale, def.position[2] * scale);
    boneByName.set(def.name, b);
    bones.push(b);
  }

  for (const def of QUADRUPED_BONE_DEFS) {
    if (def.parent) {
      const parent = boneByName.get(def.parent);
      const child = boneByName.get(def.name);
      if (parent && child) parent.add(child);
    }
  }

  const rootBone = boneByName.get('root')!;
  rootBone.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);
  return { rootBone, bones, boneByName, skeleton };
}

function makeEulerTrack(
  boneName: string,
  times: number[],
  eulers: Array<[number, number, number]>
): THREE.QuaternionKeyframeTrack {
  const values: number[] = [];
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (const [rx, ry, rz] of eulers) {
    e.set(rx, ry, rz, 'XYZ');
    q.setFromEuler(e);
    values.push(q.x, q.y, q.z, q.w);
  }
  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

export function buildQuadrupedAnimClips(rig: CanonicalQuadrupedRig): THREE.AnimationClip[] {
  const pelvisY = rig.boneByName.get('pelvis')?.position.y ?? 0.58;

  // 1. Idle_Quad (2.0s)
  const idle = new THREE.AnimationClip('Idle_Quad', 2.0, [
    makeEulerTrack('spine_02', [0, 1.0, 2.0], [
      [0.02, 0, 0],
      [-0.03, 0, 0],
      [0.02, 0, 0],
    ]),
    makeEulerTrack('head', [0, 1.0, 2.0], [
      [0.03, -0.05, 0],
      [-0.03, 0.05, 0],
      [0.03, -0.05, 0],
    ]),
    makeEulerTrack('tail_01', [0, 0.5, 1.0, 1.5, 2.0], [
      [0.1, -0.18, 0],
      [0.05, 0.18, 0],
      [0.1, -0.18, 0],
      [0.05, 0.18, 0],
      [0.1, -0.18, 0],
    ]),
  ]);

  // 2. Walk_Quad (1.0s)
  const walk = new THREE.AnimationClip('Walk_Quad', 1.0, [
    makeEulerTrack('front_upper_l', [0, 0.25, 0.5, 0.75, 1.0], [
      [0.42, 0, 0],
      [0, 0, 0],
      [-0.42, 0, 0],
      [0, 0, 0],
      [0.42, 0, 0],
    ]),
    makeEulerTrack('front_upper_r', [0, 0.25, 0.5, 0.75, 1.0], [
      [-0.42, 0, 0],
      [0, 0, 0],
      [0.42, 0, 0],
      [0, 0, 0],
      [-0.42, 0, 0],
    ]),
    makeEulerTrack('back_thigh_l', [0, 0.25, 0.5, 0.75, 1.0], [
      [-0.38, 0, 0],
      [0, 0, 0],
      [0.38, 0, 0],
      [0, 0, 0],
      [-0.38, 0, 0],
    ]),
    makeEulerTrack('back_thigh_r', [0, 0.25, 0.5, 0.75, 1.0], [
      [0.38, 0, 0],
      [0, 0, 0],
      [-0.38, 0, 0],
      [0, 0, 0],
      [0.38, 0, 0],
    ]),
    makeEulerTrack('spine_02', [0, 0.25, 0.5, 0.75, 1.0], [
      [0, 0.06, 0],
      [0, 0, 0],
      [0, -0.06, 0],
      [0, 0, 0],
      [0, 0.06, 0],
    ]),
  ]);

  // 3. Run_Gallop (0.6s)
  const gallop = new THREE.AnimationClip('Run_Gallop', 0.6, [
    makeEulerTrack('front_upper_l', [0, 0.15, 0.3, 0.45, 0.6], [
      [0.7, 0, 0],
      [0.1, 0, 0],
      [-0.65, 0, 0],
      [-0.1, 0, 0],
      [0.7, 0, 0],
    ]),
    makeEulerTrack('front_upper_r', [0, 0.15, 0.3, 0.45, 0.6], [
      [0.55, 0, 0],
      [-0.1, 0, 0],
      [-0.7, 0, 0],
      [0.1, 0, 0],
      [0.55, 0, 0],
    ]),
    makeEulerTrack('back_thigh_l', [0, 0.15, 0.3, 0.45, 0.6], [
      [-0.65, 0, 0],
      [0, 0, 0],
      [0.7, 0, 0],
      [0.1, 0, 0],
      [-0.65, 0, 0],
    ]),
    makeEulerTrack('back_thigh_r', [0, 0.15, 0.3, 0.45, 0.6], [
      [-0.55, 0, 0],
      [0.1, 0, 0],
      [0.65, 0, 0],
      [0, 0, 0],
      [-0.55, 0, 0],
    ]),
    makeEulerTrack('spine_02', [0, 0.15, 0.3, 0.45, 0.6], [
      [0.14, 0, 0],
      [0, 0, 0],
      [-0.14, 0, 0],
      [0, 0, 0],
      [0.14, 0, 0],
    ]),
  ]);

  // 4. Attack_Bite (0.8s)
  const bite = new THREE.AnimationClip('Attack_Bite', 0.8, [
    makeEulerTrack('neck_01', [0, 0.25, 0.45, 0.8], [
      [-0.25, 0, 0],
      [0.45, 0, 0],
      [0.18, 0, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack('jaw', [0, 0.25, 0.45, 0.8], [
      [0, 0, 0],
      [0.58, 0, 0],
      [0.02, 0, 0],
      [0, 0, 0],
    ]),
  ]);

  // 5. Hit_Quad (0.5s)
  const hit = new THREE.AnimationClip('Hit_Quad', 0.5, [
    makeEulerTrack('spine_02', [0, 0.15, 0.5], [
      [0, 0, 0],
      [-0.22, 0.12, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack('head', [0, 0.15, 0.5], [
      [0, 0, 0],
      [-0.3, -0.18, 0],
      [0, 0, 0],
    ]),
  ]);

  // 6. Death_Quad (0.9s)
  const death = new THREE.AnimationClip('Death_Quad', 0.9, [
    makeEulerTrack('pelvis', [0, 0.45, 0.9], [
      [0, 0, 0],
      [0, 0, 0.75],
      [0, 0, Math.PI * 0.48],
    ]),
    new THREE.VectorKeyframeTrack(
      'pelvis.position',
      [0, 0.45, 0.9],
      [0, pelvisY, -0.28, 0, pelvisY * 0.55, -0.28, 0, pelvisY * 0.28, -0.28]
    ),
  ]);

  return [idle, walk, gallop, bite, hit, death];
}
