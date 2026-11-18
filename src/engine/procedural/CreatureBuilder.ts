import * as THREE from 'three';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import {
  buildQuadrupedAnimClips,
  createCanonicalQuadrupedRig,
  type CanonicalQuadrupedRig,
} from '../rigging/QuadrupedRigSpec';
import { bakeTaggedPartsAsset, type BakedAssetResult } from './PixelMaterialSynth';
import {
  makeBeveledBox,
  makeLatheProfile,
  tagPart,
  type FinishMode,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { prepareColoredPart } from './SdfVoxelPrimitives';

export type QuadrupedCreatureId =
  | 'grey_wolf'
  | 'alpha_wolf'
  | 'town_reindeer'
  | 'armored_boar'
  | 'grizzly_bear'
  | 'war_horse'
  | 'hellhound'
  | 'elder_wyvern';

export interface QuadrupedCreatureSpec {
  id: QuadrupedCreatureId;
  labelPt: string;
  scale: number;
  bodyW: number;
  bodyH: number;
  bodyL: number;
  legThick: number;
  snoutLen: number;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  eyeHex: string;
  hasAntlers?: boolean;
  hasTusks?: boolean;
  hasArmor?: boolean;
  hasMane?: boolean;
  hasSpines?: boolean;
  hasWings?: boolean;
}

export const QUADRUPED_CREATURE_SPECS: Record<QuadrupedCreatureId, QuadrupedCreatureSpec> = {
  grey_wolf: {
    id: 'grey_wolf',
    labelPt: 'Lobo Cinzento',
    scale: 0.95,
    bodyW: 0.26,
    bodyH: 0.28,
    bodyL: 0.68,
    legThick: 0.068,
    snoutLen: 0.17,
    primaryHex: '#6b7280',
    secondaryHex: '#d1d5db',
    accentHex: '#374151',
    eyeHex: '#facc15',
  },
  alpha_wolf: {
    id: 'alpha_wolf',
    labelPt: 'Lobo Alfa',
    scale: 1.2,
    bodyW: 0.3,
    bodyH: 0.32,
    bodyL: 0.72,
    legThick: 0.078,
    snoutLen: 0.19,
    primaryHex: '#334155',
    secondaryHex: '#94a3b8',
    accentHex: '#1e293b',
    eyeHex: '#38bdf8',
    hasMane: true,
  },
  town_reindeer: {
    id: 'town_reindeer',
    labelPt: 'Rena / Cervo Real',
    scale: 1.25,
    bodyW: 0.25,
    bodyH: 0.29,
    bodyL: 0.7,
    legThick: 0.056,
    snoutLen: 0.16,
    primaryHex: '#7c5338',
    secondaryHex: '#d6bfa9',
    accentHex: '#e5dcc5',
    eyeHex: '#1e1b18',
    hasAntlers: true,
  },
  armored_boar: {
    id: 'armored_boar',
    labelPt: 'Javali Blindado',
    scale: 1.05,
    bodyW: 0.36,
    bodyH: 0.36,
    bodyL: 0.64,
    legThick: 0.082,
    snoutLen: 0.14,
    primaryHex: '#4f3428',
    secondaryHex: '#64748b',
    accentHex: '#d4a359',
    eyeHex: '#ef4444',
    hasTusks: true,
    hasArmor: true,
  },
  grizzly_bear: {
    id: 'grizzly_bear',
    labelPt: 'Urso Pardo',
    scale: 1.35,
    bodyW: 0.42,
    bodyH: 0.42,
    bodyL: 0.76,
    legThick: 0.105,
    snoutLen: 0.14,
    primaryHex: '#5c3a28',
    secondaryHex: '#8d6248',
    accentHex: '#3b2418',
    eyeHex: '#f59e0b',
  },
  war_horse: {
    id: 'war_horse',
    labelPt: 'Cavalo de Guerra',
    scale: 1.45,
    bodyW: 0.3,
    bodyH: 0.34,
    bodyL: 0.82,
    legThick: 0.068,
    snoutLen: 0.21,
    primaryHex: '#4a3222',
    secondaryHex: '#94a3b8',
    accentHex: '#d4a359',
    eyeHex: '#1e1b18',
    hasArmor: true,
    hasMane: true,
  },
  hellhound: {
    id: 'hellhound',
    labelPt: 'Cão Infernal',
    scale: 1.18,
    bodyW: 0.28,
    bodyH: 0.3,
    bodyL: 0.72,
    legThick: 0.074,
    snoutLen: 0.18,
    primaryHex: '#3b1518',
    secondaryHex: '#18141c',
    accentHex: '#f97316',
    eyeHex: '#fb923c',
    hasSpines: true,
  },
  elder_wyvern: {
    id: 'elder_wyvern',
    labelPt: 'Boss: Wyvern Ancião',
    scale: 2.4,
    bodyW: 0.38,
    bodyH: 0.42,
    bodyL: 0.95,
    legThick: 0.1,
    snoutLen: 0.28,
    primaryHex: '#2f1f3d',
    secondaryHex: '#6b21a8',
    accentHex: '#f59e0b',
    eyeHex: '#fbbf24',
    hasSpines: true,
    hasWings: true,
  },
};

export interface QuadrupedCreatureInstance {
  id: QuadrupedCreatureId;
  name: string;
  spec: QuadrupedCreatureSpec;
  rig: CanonicalQuadrupedRig;
  root: THREE.Group;
  clips: THREE.AnimationClip[];
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  dispose: () => void;
}

export function buildQuadrupedCreature(
  id: QuadrupedCreatureId,
  options: {
    finishMode?: FinishMode;
    materialSeed?: number;
  } = {},
  sharedResources?: PixelizerMaterialResources
): QuadrupedCreatureInstance {
  const spec = QUADRUPED_CREATURE_SPECS[id];
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const materialSeed = options.materialSeed ?? 501;

  const rig = createCanonicalQuadrupedRig(spec.scale);
  const root = new THREE.Group();
  root.name = `NWL_Quad_${id}`;
  root.add(rig.rootBone);

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];

  const attachBaked = (
    boneName: string,
    parts: TaggedGeometryPart[],
    isMetal = false,
    suffix = ''
  ) => {
    const bone = rig.boneByName.get(boneName);
    if (!bone || parts.length === 0) return;

    const baked: BakedAssetResult = bakeTaggedPartsAsset(parts, {
      finishMode,
      texelsPerMeter: 56,
      seed: materialSeed,
      aoRays: 8,
      aoMaxDist: 0.4,
      aoStrength: 0.28,
      normalStrength: 0.14,
      emblemHex: spec.accentHex,
      emissiveRuneHex: spec.id === 'hellhound' || spec.id === 'elder_wyvern' ? spec.accentHex : null,
      usePool: true,
      cacheKey: `nwl_quad:${id}:${boneName}:${suffix}`,
    });
    for (const p of parts) p.geometry.dispose();

    const hasTex = Boolean(baked.textures);
    const hasEmission = Boolean(baked.textures?.hasEmission && baked.textures.emissionMap);
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        baseColor: '#ffffff',
        diffuseVertexColorWeight: 1.0,
        smoothness: isMetal ? 0.55 : 0.25,
        metallic: isMetal ? 0.65 : 0.05,
        albedoMap: baked.textures?.albedoMap ?? null,
        normalMap: baked.textures?.normalMap ?? null,
        normalScale: hasTex ? 0.85 : 1.0,
        useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
        emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
        emissionColor: hasEmission ? '#ffffff' : '#000000',
        emissionIntensity: hasEmission ? 1.1 : 0.0,
      },
      sharedResources
    );
    const mesh = new THREE.Mesh(baked.geometry, mat);
    mesh.name = `${id}_${boneName}${suffix}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bone.add(mesh);
    meshes.push(mesh);
    materials.push(mat);
  };

  const s = spec.scale;
  const bw = spec.bodyW * s;
  const bh = spec.bodyH * s;
  const leg = spec.legThick * s;

  // Pelvis & Spine segments
  attachBaked('pelvis', [
    tagPart(
      makeBeveledBox(bw * 0.96, bh * 0.95, 0.28 * s, 0.03 * s, spec.primaryHex),
      'quad_pelvis',
      'stitched_leather',
      spec.primaryHex
    ),
  ]);

  attachBaked('spine_01', [
    tagPart(
      makeBeveledBox(bw * 0.94, bh * 0.92, 0.26 * s, 0.03 * s, spec.primaryHex),
      'quad_spine1',
      'stitched_leather',
      spec.primaryHex
    ),
  ]);

  const spine2Parts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(bw * 1.05, bh * 1.02, 0.28 * s, 0.035 * s, spec.primaryHex),
      'quad_spine2',
      'stitched_leather',
      spec.primaryHex
    ),
  ];
  if (spec.hasArmor) {
    spine2Parts.push(
      tagPart(
        makeBeveledBox(bw * 1.12, bh * 0.45, 0.3 * s, 0.02 * s, spec.secondaryHex, {
          offset: [0, bh * 0.36, 0],
        }),
        'quad_saddle',
        'rarity_armor',
        spec.secondaryHex,
        { accentHex: spec.accentHex }
      )
    );
  }
  if (spec.hasSpines) {
    for (const i of [-0.08, 0.08]) {
      const sp = prepareColoredPart(new THREE.ConeGeometry(0.035 * s, 0.16 * s, 5), spec.accentHex);
      sp.translate(0, bh * 0.56, i * s);
      spine2Parts.push(tagPart(sp, `quad_spine_spike_${i}`, 'runic_glow', spec.accentHex));
    }
  }
  attachBaked('spine_02', spine2Parts, Boolean(spec.hasArmor));

  const spine3Parts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(bw * 1.12, bh * 1.08, 0.3 * s, 0.035 * s, spec.primaryHex),
      'quad_chest',
      'stitched_leather',
      spec.primaryHex
    ),
    tagPart(
      makeBeveledBox(bw * 0.88, bh * 0.52, 0.26 * s, 0.025 * s, spec.secondaryHex, {
        offset: [0, -bh * 0.26, 0.04 * s],
      }),
      'quad_chest_fur',
      'woven_cloth',
      spec.secondaryHex
    ),
  ];
  if (spec.hasWings) {
    for (const [wIdx, sx] of [-1, 1].entries()) {
      const wingArm = makeBeveledBox(0.72 * s, 0.08 * s, 0.12 * s, 0.015 * s, spec.primaryHex);
      wingArm.rotateZ(sx * 0.42);
      wingArm.translate(sx * 0.45 * s, bh * 0.42, -0.05 * s);
      const wingMembrane = makeBeveledBox(0.86 * s, 0.035 * s, 0.46 * s, 0.01 * s, spec.secondaryHex);
      wingMembrane.rotateZ(sx * 0.32);
      wingMembrane.translate(sx * 0.58 * s, bh * 0.34, -0.22 * s);
      spine3Parts.push(
        tagPart(wingArm, `wyvern_wing_arm_${wIdx}`, 'stitched_leather', spec.primaryHex),
        tagPart(wingMembrane, `wyvern_wing_mem_${wIdx}`, 'woven_cloth', spec.secondaryHex)
      );
    }
  }
  attachBaked('spine_03', spine3Parts);

  // Neck & Head & Jaw & Ears
  const neckParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(bw * 0.72, 0.26 * s, 0.24 * s, 0.025 * s, spec.primaryHex),
      'quad_neck',
      'stitched_leather',
      spec.primaryHex
    ),
  ];
  if (spec.hasMane) {
    neckParts.push(
      tagPart(
        makeBeveledBox(bw * 0.5, 0.28 * s, 0.16 * s, 0.02 * s, spec.accentHex, {
          offset: [0, 0.06 * s, -0.09 * s],
        }),
        'quad_mane',
        'woven_cloth',
        spec.accentHex
      )
    );
  }
  attachBaked('neck_01', neckParts);

  const headParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(bw * 0.78, 0.22 * s, 0.22 * s, 0.025 * s, spec.primaryHex),
      'quad_cranium',
      'stitched_leather',
      spec.primaryHex
    ),
    tagPart(
      makeBeveledBox(bw * 0.46, 0.12 * s, spec.snoutLen * s, 0.02 * s, spec.secondaryHex, {
        offset: [0, -0.02 * s, 0.13 * s + spec.snoutLen * 0.35 * s],
      }),
      'quad_snout',
      'stitched_leather',
      spec.secondaryHex
    ),
  ];
  for (const [eIdx, sx] of [-1, 1].entries()) {
    const eye = prepareColoredPart(new THREE.OctahedronGeometry(0.026 * s, 0), spec.eyeHex);
    eye.translate(sx * bw * 0.34, 0.04 * s, 0.1 * s);
    headParts.push(tagPart(eye, `quad_eye_${eIdx}`, 'runic_glow', spec.eyeHex));
  }
  if (spec.hasAntlers) {
    for (const [aIdx, sx] of [-1, 1].entries()) {
      const mainBeam = makeBeveledBox(0.03 * s, 0.34 * s, 0.03 * s, 0.006 * s, spec.accentHex);
      mainBeam.rotateZ(sx * -0.45);
      mainBeam.translate(sx * 0.14 * s, 0.24 * s, 0);
      const tine = makeBeveledBox(0.024 * s, 0.18 * s, 0.024 * s, 0.005 * s, spec.accentHex);
      tine.rotateZ(sx * 0.2);
      tine.rotateX(0.45);
      tine.translate(sx * 0.2 * s, 0.28 * s, 0.06 * s);
      headParts.push(
        tagPart(mainBeam, `antler_beam_${aIdx}`, 'bone_ivory', spec.accentHex),
        tagPart(tine, `antler_tine_${aIdx}`, 'bone_ivory', spec.accentHex)
      );
    }
  }
  if (spec.hasTusks) {
    for (const [tIdx, sx] of [-1, 1].entries()) {
      const tusk = prepareColoredPart(new THREE.ConeGeometry(0.025 * s, 0.14 * s, 5), '#f5e9d3');
      tusk.rotateX(0.35);
      tusk.rotateZ(sx * -0.35);
      tusk.translate(sx * 0.09 * s, -0.02 * s, 0.22 * s);
      headParts.push(tagPart(tusk, `boar_tusk_${tIdx}`, 'bone_ivory', '#f5e9d3'));
    }
  }
  attachBaked('head', headParts);

  attachBaked('jaw', [
    tagPart(
      makeBeveledBox(bw * 0.38, 0.07 * s, spec.snoutLen * 0.8 * s, 0.014 * s, spec.secondaryHex, {
        offset: [0, 0, spec.snoutLen * 0.3 * s],
      }),
      'quad_jaw',
      'stitched_leather',
      spec.secondaryHex
    ),
  ]);

  for (const side of ['l', 'r'] as const) {
    attachBaked(`ear_${side}`, [
      tagPart(
        prepareColoredPart(new THREE.ConeGeometry(0.042 * s, 0.13 * s, 5), spec.primaryHex),
        `quad_ear_${side}`,
        'stitched_leather',
        spec.primaryHex
      ),
    ]);
  }

  // Tail
  attachBaked('tail_01', [
    tagPart(
      makeLatheProfile(
        [
          [0.052 * s, 0],
          [0.036 * s, -0.22 * s],
        ],
        6,
        spec.primaryHex
      ),
      'quad_tail1',
      'stitched_leather',
      spec.primaryHex
    ),
  ]);
  attachBaked('tail_02', [
    tagPart(
      makeLatheProfile(
        [
          [0.036 * s, 0],
          [0.016 * s, -0.24 * s],
        ],
        6,
        spec.secondaryHex
      ),
      'quad_tail2',
      'woven_cloth',
      spec.secondaryHex
    ),
  ]);

  // 4 Legs
  for (const side of ['l', 'r'] as const) {
    attachBaked(`front_upper_${side}`, [
      tagPart(
        makeBeveledBox(leg * 1.15, 0.26 * s, leg * 1.25, 0.015 * s, spec.primaryHex, {
          offset: [0, -0.13 * s, 0],
        }),
        `quad_fu_${side}`,
        'stitched_leather',
        spec.primaryHex
      ),
    ]);
    attachBaked(`front_lower_${side}`, [
      tagPart(
        makeBeveledBox(leg * 0.9, 0.26 * s, leg * 0.95, 0.012 * s, spec.secondaryHex, {
          offset: [0, -0.13 * s, 0],
        }),
        `quad_fl_${side}`,
        'stitched_leather',
        spec.secondaryHex
      ),
    ]);
    attachBaked(`front_paw_${side}`, [
      tagPart(
        makeBeveledBox(leg * 1.1, 0.07 * s, leg * 1.35, 0.012 * s, spec.accentHex, {
          offset: [0, -0.02 * s, 0.02 * s],
        }),
        `quad_fp_${side}`,
        'stitched_leather',
        spec.accentHex
      ),
    ]);

    attachBaked(`back_thigh_${side}`, [
      tagPart(
        makeBeveledBox(leg * 1.25, 0.27 * s, leg * 1.4, 0.018 * s, spec.primaryHex, {
          offset: [0, -0.13 * s, 0],
        }),
        `quad_bt_${side}`,
        'stitched_leather',
        spec.primaryHex
      ),
    ]);
    attachBaked(`back_shin_${side}`, [
      tagPart(
        makeBeveledBox(leg * 0.88, 0.26 * s, leg * 0.95, 0.012 * s, spec.secondaryHex, {
          offset: [0, -0.13 * s, 0],
        }),
        `quad_bs_${side}`,
        'stitched_leather',
        spec.secondaryHex
      ),
    ]);
    attachBaked(`back_paw_${side}`, [
      tagPart(
        makeBeveledBox(leg * 1.1, 0.07 * s, leg * 1.35, 0.012 * s, spec.accentHex, {
          offset: [0, -0.02 * s, 0.02 * s],
        }),
        `quad_bp_${side}`,
        'stitched_leather',
        spec.accentHex
      ),
    ]);
  }

  const clips = buildQuadrupedAnimClips(rig);

  return {
    id,
    name: spec.labelPt,
    spec,
    rig,
    root,
    clips,
    meshes,
    materials,
    dispose: () => {
      for (const m of meshes) {
        m.removeFromParent();
        m.geometry.dispose();
      }
      for (const mat of materials) {
        const opts = mat.options;
        for (const tex of [opts.albedoMap, opts.normalMap, opts.emissionMap]) {
          if (tex && tex.userData?.pooled !== true) tex.dispose();
        }
        mat.dispose();
      }
    },
  };
}
