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

export const QUADRUPED_WING_BONE_DEFS: QuadrupedBoneDef[] = [
  // Left Wing
  { name: 'wing_root_l', parent: 'spine_03', position: [0.16, 0.08, -0.02] },
  { name: 'wing_elbow_l', parent: 'wing_root_l', position: [0.38, 0.16, -0.06] },
  { name: 'wing_tip_l', parent: 'wing_elbow_l', position: [0.46, 0.04, -0.14] },
  // Right Wing
  { name: 'wing_root_r', parent: 'spine_03', position: [-0.16, 0.08, -0.02] },
  { name: 'wing_elbow_r', parent: 'wing_root_r', position: [-0.38, 0.16, -0.06] },
  { name: 'wing_tip_r', parent: 'wing_elbow_r', position: [-0.46, 0.04, -0.14] },
];

export interface CanonicalQuadrupedRig {
  rootBone: THREE.Bone;
  bones: THREE.Bone[];
  boneByName: Map<string, THREE.Bone>;
  skeleton: THREE.Skeleton;
}

export interface QuadrupedRigOptions {
  includeWings?: boolean;
}

export function createCanonicalQuadrupedRig(
  scale = 1.0,
  options: QuadrupedRigOptions = {}
): CanonicalQuadrupedRig {
  const boneByName = new Map<string, THREE.Bone>();
  const bones: THREE.Bone[] = [];
  const defs = options.includeWings
    ? [...QUADRUPED_BONE_DEFS, ...QUADRUPED_WING_BONE_DEFS]
    : QUADRUPED_BONE_DEFS;

  for (const def of defs) {
    const b = new THREE.Bone();
    b.name = def.name;
    b.position.set(def.position[0] * scale, def.position[1] * scale, def.position[2] * scale);
    boneByName.set(def.name, b);
    bones.push(b);
  }

  for (const def of defs) {
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

type EulerPose = [number, number, number];

function pushTrackIfBoneExists(
  rig: CanonicalQuadrupedRig,
  tracks: THREE.KeyframeTrack[],
  boneName: string,
  times: number[],
  eulers: EulerPose[]
): void {
  if (rig.boneByName.has(boneName)) {
    tracks.push(makeEulerTrack(boneName, times, eulers));
  }
}

/**
 * Adds sinusoidal tail sway/whip tracks across all present tail segments (`tail_01..tail_03`).
 */
function addTailTracks(
  rig: CanonicalQuadrupedRig,
  tracks: THREE.KeyframeTrack[],
  times: number[],
  tail1: EulerPose[],
  tail2: EulerPose[],
  tail3?: EulerPose[]
): void {
  pushTrackIfBoneExists(rig, tracks, 'tail_01', times, tail1);
  pushTrackIfBoneExists(rig, tracks, 'tail_02', times, tail2);
  if (tail3) {
    pushTrackIfBoneExists(rig, tracks, 'tail_03', times, tail3);
  }
}

/**
 * Mirrors canonical left-wing `[pitchX, foldBackY, liftZ]` poses onto `wing_root/elbow/tip_l` and `_r`,
 * with optional banking roll bias (`bankRoll[i]` adds to left lift and subtracts from right lift).
 */
function addWingTracks(
  rig: CanonicalQuadrupedRig,
  tracks: THREE.KeyframeTrack[],
  times: number[],
  rootPoses: EulerPose[],
  elbowPoses: EulerPose[],
  tipPoses: EulerPose[],
  opts: {
    bankRoll?: number[];
    rightRootOverride?: EulerPose[];
    rightElbowOverride?: EulerPose[];
    rightTipOverride?: EulerPose[];
  } = {}
): void {
  const bank = opts.bankRoll;
  const mirror = (poses: EulerPose[], sx: 1 | -1, applyBank: boolean): EulerPose[] =>
    poses.map(([rx, ry, rz], idx) => {
      const rollOffset = applyBank && bank ? bank[idx] ?? 0 : 0;
      return [rx, ry * sx, rz * sx + rollOffset];
    });

  pushTrackIfBoneExists(rig, tracks, 'wing_root_l', times, mirror(rootPoses, 1, true));
  pushTrackIfBoneExists(
    rig,
    tracks,
    'wing_root_r',
    times,
    opts.rightRootOverride ?? mirror(rootPoses, -1, true)
  );
  pushTrackIfBoneExists(rig, tracks, 'wing_elbow_l', times, mirror(elbowPoses, 1, false));
  pushTrackIfBoneExists(
    rig,
    tracks,
    'wing_elbow_r',
    times,
    opts.rightElbowOverride ?? mirror(elbowPoses, -1, false)
  );
  pushTrackIfBoneExists(rig, tracks, 'wing_tip_l', times, mirror(tipPoses, 1, false));
  pushTrackIfBoneExists(
    rig,
    tracks,
    'wing_tip_r',
    times,
    opts.rightTipOverride ?? mirror(tipPoses, -1, false)
  );
}

export function buildQuadrupedAnimClips(rig: CanonicalQuadrupedRig): THREE.AnimationClip[] {
  const pelvisY = rig.boneByName.get('pelvis')?.position.y ?? 0.58;

  // 1. Idle_Quad (2.0s) — calm breathing, gentle wing mantle & sinusoidal tail sway
  const idleTimes = [0, 0.5, 1.0, 1.5, 2.0];
  const idleTracks: THREE.KeyframeTrack[] = [
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
  ];
  addTailTracks(
    rig,
    idleTracks,
    idleTimes,
    [
      [0.1, -0.18, 0],
      [0.06, 0.0, 0],
      [0.1, 0.18, 0],
      [0.06, 0.0, 0],
      [0.1, -0.18, 0],
    ],
    [
      [-0.06, 0.0, 0],
      [0.02, -0.26, 0],
      [-0.06, 0.0, 0],
      [0.02, 0.26, 0],
      [-0.06, 0.0, 0],
    ],
    [
      [0.04, 0.28, 0],
      [0.08, 0.0, 0],
      [0.04, -0.28, 0],
      [0.08, 0.0, 0],
      [0.04, 0.28, 0],
    ]
  );
  addWingTracks(
    rig,
    idleTracks,
    idleTimes,
    [
      [-0.08, 0.32, 0.22],
      [-0.14, 0.26, 0.34],
      [-0.08, 0.32, 0.22],
      [-0.04, 0.36, 0.16],
      [-0.08, 0.32, 0.22],
    ],
    [
      [0.04, 0.24, -0.18],
      [0.02, 0.18, -0.08],
      [0.04, 0.24, -0.18],
      [0.06, 0.28, -0.24],
      [0.04, 0.24, -0.18],
    ],
    [
      [0.02, 0.14, -0.14],
      [-0.04, 0.08, -0.02],
      [0.02, 0.14, -0.14],
      [0.05, 0.18, -0.2],
      [0.02, 0.14, -0.14],
    ]
  );
  const idle = new THREE.AnimationClip('Idle_Quad', 2.0, idleTracks);

  // 2. Walk_Quad (1.0s) — stride gait, gliding wing banking & rhythmic tail sway
  const walkTimes = [0, 0.25, 0.5, 0.75, 1.0];
  const walkTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack('front_upper_l', walkTimes, [
      [0.42, 0, 0],
      [0, 0, 0],
      [-0.42, 0, 0],
      [0, 0, 0],
      [0.42, 0, 0],
    ]),
    makeEulerTrack('front_upper_r', walkTimes, [
      [-0.42, 0, 0],
      [0, 0, 0],
      [0.42, 0, 0],
      [0, 0, 0],
      [-0.42, 0, 0],
    ]),
    makeEulerTrack('back_thigh_l', walkTimes, [
      [-0.38, 0, 0],
      [0, 0, 0],
      [0.38, 0, 0],
      [0, 0, 0],
      [-0.38, 0, 0],
    ]),
    makeEulerTrack('back_thigh_r', walkTimes, [
      [0.38, 0, 0],
      [0, 0, 0],
      [-0.38, 0, 0],
      [0, 0, 0],
      [0.38, 0, 0],
    ]),
    makeEulerTrack('spine_02', walkTimes, [
      [0, 0.06, 0],
      [0, 0, 0],
      [0, -0.06, 0],
      [0, 0, 0],
      [0, 0.06, 0],
    ]),
  ];
  addTailTracks(
    rig,
    walkTracks,
    walkTimes,
    [
      [0.14, 0.22, 0],
      [0.08, 0.0, 0],
      [0.14, -0.22, 0],
      [0.08, 0.0, 0],
      [0.14, 0.22, 0],
    ],
    [
      [-0.06, 0.0, 0],
      [0.04, 0.28, 0],
      [-0.06, 0.0, 0],
      [0.04, -0.28, 0],
      [-0.06, 0.0, 0],
    ],
    [
      [0.06, -0.32, 0],
      [-0.04, 0.0, 0],
      [0.06, 0.32, 0],
      [-0.04, 0.0, 0],
      [0.06, -0.32, 0],
    ]
  );
  addWingTracks(
    rig,
    walkTracks,
    walkTimes,
    [
      [-0.08, 0.22, 0.18],
      [-0.18, 0.14, 0.42],
      [0.04, 0.22, 0.18],
      [0.1, 0.26, 0.08],
      [-0.08, 0.22, 0.18],
    ],
    [
      [0.02, 0.16, -0.12],
      [-0.06, 0.08, 0.08],
      [0.06, 0.16, -0.18],
      [0.08, 0.22, -0.26],
      [0.02, 0.16, -0.12],
    ],
    [
      [0.04, 0.12, -0.2],
      [-0.06, 0.04, -0.04],
      [0.08, 0.1, 0.14],
      [0.08, 0.16, -0.16],
      [0.04, 0.12, -0.2],
    ],
    { bankRoll: [0, 0.07, 0, -0.07, 0] }
  );
  const walk = new THREE.AnimationClip('Walk_Quad', 1.0, walkTracks);

  // 3. Run_Gallop (0.6s) — full aerodynamic wingbeat, banking & sinusoidal tail whip
  const gallopTimes = [0, 0.15, 0.3, 0.45, 0.6];
  const gallopTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack('front_upper_l', gallopTimes, [
      [0.7, 0, 0],
      [0.1, 0, 0],
      [-0.65, 0, 0],
      [-0.1, 0, 0],
      [0.7, 0, 0],
    ]),
    makeEulerTrack('front_upper_r', gallopTimes, [
      [0.55, 0, 0],
      [-0.1, 0, 0],
      [-0.7, 0, 0],
      [0.1, 0, 0],
      [0.55, 0, 0],
    ]),
    makeEulerTrack('back_thigh_l', gallopTimes, [
      [-0.65, 0, 0],
      [0, 0, 0],
      [0.7, 0, 0],
      [0.1, 0, 0],
      [-0.65, 0, 0],
    ]),
    makeEulerTrack('back_thigh_r', gallopTimes, [
      [-0.55, 0, 0],
      [0.1, 0, 0],
      [0.65, 0, 0],
      [0, 0, 0],
      [-0.55, 0, 0],
    ]),
    makeEulerTrack('spine_02', gallopTimes, [
      [0.14, 0, 0],
      [0, 0, 0.05],
      [-0.14, 0, 0],
      [0, 0, -0.05],
      [0.14, 0, 0],
    ]),
  ];
  addTailTracks(
    rig,
    gallopTracks,
    gallopTimes,
    [
      [0.24, -0.26, 0],
      [0.02, 0.0, 0],
      [-0.14, 0.26, 0],
      [0.04, 0.0, 0],
      [0.24, -0.26, 0],
    ],
    [
      [-0.12, 0.14, 0],
      [0.16, -0.34, 0],
      [-0.04, -0.14, 0],
      [0.18, 0.34, 0],
      [-0.12, 0.14, 0],
    ],
    [
      [0.12, 0.38, 0],
      [-0.18, 0.12, 0],
      [0.12, -0.38, 0],
      [-0.18, -0.12, 0],
      [0.12, 0.38, 0],
    ]
  );
  addWingTracks(
    rig,
    gallopTracks,
    gallopTimes,
    [
      [-0.22, -0.06, 0.74],
      [0.18, 0.04, 0.05],
      [0.28, 0.16, -0.52],
      [-0.18, 0.1, 0.24],
      [-0.22, -0.06, 0.74],
    ],
    [
      [-0.1, 0.22, -0.32],
      [-0.14, 0.04, 0.24],
      [0.16, 0.02, 0.16],
      [0.12, 0.24, -0.38],
      [-0.1, 0.22, -0.32],
    ],
    [
      [-0.08, 0.18, -0.44],
      [-0.12, -0.02, 0.28],
      [0.18, 0.04, 0.36],
      [0.14, 0.2, -0.36],
      [-0.08, 0.18, -0.44],
    ],
    { bankRoll: [0, 0.09, 0, -0.09, 0] }
  );
  const gallop = new THREE.AnimationClip('Run_Gallop', 0.6, gallopTracks);

  // 4. Attack_Bite (0.8s) — jaw lunge, intimidation wing flare & whip tail strike
  const attackTimes = [0, 0.25, 0.45, 0.8];
  const attackTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack('neck_01', attackTimes, [
      [-0.25, 0, 0],
      [0.45, 0, 0],
      [0.18, 0, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack('jaw', attackTimes, [
      [0, 0, 0],
      [0.58, 0, 0],
      [0.02, 0, 0],
      [0, 0, 0],
    ]),
  ];
  addTailTracks(
    rig,
    attackTracks,
    attackTimes,
    [
      [0.08, 0, 0],
      [0.38, 0.24, 0],
      [-0.24, -0.34, 0],
      [0.08, 0, 0],
    ],
    [
      [-0.05, 0, 0],
      [-0.25, 0.22, 0],
      [0.22, -0.45, 0],
      [-0.05, 0, 0],
    ],
    [
      [0, 0, 0],
      [-0.2, 0.35, 0],
      [0.3, -0.5, 0],
      [0, 0, 0],
    ]
  );
  addWingTracks(
    rig,
    attackTracks,
    attackTimes,
    [
      [-0.08, 0.3, 0.2],
      [-0.28, -0.2, 0.78],
      [0.26, 0.08, -0.36],
      [-0.08, 0.3, 0.2],
    ],
    [
      [0.04, 0.22, -0.16],
      [-0.14, -0.06, 0.24],
      [0.18, 0.12, 0.18],
      [0.04, 0.22, -0.16],
    ],
    [
      [0.02, 0.12, -0.12],
      [-0.12, -0.08, 0.3],
      [0.16, 0.1, 0.26],
      [0.02, 0.12, -0.12],
    ]
  );
  const bite = new THREE.AnimationClip('Attack_Bite', 0.8, attackTracks);

  // 5. Hit_Quad (0.5s) — startled recoil, wing flare-fold & tail tuck
  const hitTimes = [0, 0.15, 0.5];
  const hitTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack('spine_02', hitTimes, [
      [0, 0, 0],
      [-0.22, 0.12, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack('head', hitTimes, [
      [0, 0, 0],
      [-0.3, -0.18, 0],
      [0, 0, 0],
    ]),
  ];
  addTailTracks(
    rig,
    hitTracks,
    hitTimes,
    [
      [0.08, 0, 0],
      [-0.38, 0.28, 0],
      [0.08, 0, 0],
    ],
    [
      [0, 0, 0],
      [-0.32, -0.38, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [-0.28, 0.35, 0],
      [0, 0, 0],
    ]
  );
  addWingTracks(
    rig,
    hitTracks,
    hitTimes,
    [
      [-0.08, 0.3, 0.2],
      [-0.32, 0.38, 0.62],
      [-0.08, 0.3, 0.2],
    ],
    [
      [0.04, 0.22, -0.16],
      [0.12, 0.36, -0.46],
      [0.04, 0.22, -0.16],
    ],
    [
      [0.02, 0.12, -0.12],
      [0.16, 0.28, -0.38],
      [0.02, 0.12, -0.12],
    ]
  );
  const hit = new THREE.AnimationClip('Hit_Quad', 0.5, hitTracks);

  // 6. Death_Quad (0.9s) — collapse onto side, limp tail curl & folded wings
  const deathTimes = [0, 0.45, 0.9];
  const deathTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack('pelvis', deathTimes, [
      [0, 0, 0],
      [0, 0, 0.75],
      [0, 0, Math.PI * 0.48],
    ]),
    new THREE.VectorKeyframeTrack(
      'pelvis.position',
      deathTimes,
      [0, pelvisY, -0.28, 0, pelvisY * 0.55, -0.28, 0, pelvisY * 0.28, -0.28]
    ),
  ];
  addTailTracks(
    rig,
    deathTracks,
    deathTimes,
    [
      [0, 0, 0],
      [-0.28, 0.22, 0.18],
      [-0.48, 0.35, 0.32],
    ],
    [
      [0, 0, 0],
      [-0.24, 0.28, 0.15],
      [-0.42, 0.48, 0.25],
    ],
    [
      [0, 0, 0],
      [-0.2, 0.3, 0.1],
      [-0.36, 0.52, 0.2],
    ]
  );
  addWingTracks(
    rig,
    deathTracks,
    deathTimes,
    [
      [-0.08, 0.3, 0.2],
      [-0.2, 0.15, 0.45],
      [0.15, 0.55, -0.58],
    ],
    [
      [0.04, 0.22, -0.16],
      [-0.1, 0.2, -0.12],
      [0.12, 0.45, -0.45],
    ],
    [
      [0.02, 0.12, -0.12],
      [-0.08, 0.16, -0.1],
      [0.1, 0.35, -0.35],
    ],
    {
      rightRootOverride: [
        [-0.08, -0.3, -0.2],
        [-0.2, -0.15, -0.35],
        [0.12, -0.48, -0.18],
      ],
      rightElbowOverride: [
        [0.04, -0.22, 0.16],
        [-0.1, -0.2, 0.12],
        [0.1, -0.38, 0.22],
      ],
      rightTipOverride: [
        [0.02, -0.12, 0.12],
        [-0.08, -0.16, 0.1],
        [0.08, -0.32, 0.18],
      ],
    }
  );
  const death = new THREE.AnimationClip('Death_Quad', 0.9, deathTracks);

  return [idle, walk, gallop, bite, hit, death];
}
