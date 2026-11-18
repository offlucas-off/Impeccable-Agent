import * as THREE from 'three';
import {
  type PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import {
  attachRigidPartsToUalRig,
  type RigidPartSpec,
} from '../rigging/AutoRigBinder';
import {
  createCanonicalUalRig,
  type CanonicalUalRig,
} from '../rigging/UalRigSpec';
import type { PixelizerMaterialOptions } from '../types';
import {
  bakeTaggedPartsAsset,
  type BakedAssetResult,
  type UnwrapMetricsSummary,
} from './PixelMaterialSynth';
import {
  makeBeveledBoneSegmentBox,
  makeBeveledBox,
  makeCurvedHornGeometry,
  makeDomeShieldGeometry,
  makeLatheProfile,
  makePauldronShellGeometry,
  makePleatedTabardGeometry,
  makeRecurveBowGeometry,
  makeSdfOrganicMesh,
  makeSegmentedBeveledBox,
  makeSwordBladeGeometry,
  sdEllipsoid,
  sminPoly,
  tagPart,
  type FinishMode,
  type MaterialRecipeId,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { prepareColoredPart } from './SdfVoxelPrimitives';

export type NwlMonsterId =
  | 'orcs.goblin_01'
  | 'orcs.goblin_03'
  | 'orcs.goblin_06'
  | 'orcs.goblin_02'
  | 'orcs.orc_04'
  | 'demons.boss_demon'
  | 'monster.skeleton_warrior'
  | 'monster.skeleton_archer'
  | 'monster.dark_cultist'
  | 'monster.gargoyle'
  | 'monster.lizardman'
  | 'monster.crystal_golem'
  | 'boss.colossus_golem'
  | 'boss.minotaur_warlord'
  | 'boss.dread_knight';

export const NWL_MONSTER_IDS: readonly NwlMonsterId[] = [
  'orcs.goblin_01',
  'orcs.goblin_03',
  'orcs.goblin_06',
  'orcs.goblin_02',
  'orcs.orc_04',
  'demons.boss_demon',
  'monster.skeleton_warrior',
  'monster.skeleton_archer',
  'monster.dark_cultist',
  'monster.gargoyle',
  'monster.lizardman',
  'monster.crystal_golem',
  'boss.colossus_golem',
  'boss.minotaur_warlord',
  'boss.dread_knight',
];

export interface MonsterSpecMeta {
  id: NwlMonsterId;
  namePt: string;
  role: 'common' | 'ranged' | 'heavy' | 'boss';
  targetHeightM: number;
  targetHeightPx: number;
  maxHp: number;
  damage: number;
  moveSpeed: number;
  windupSec: number;
  attackRangeM: number;
  isRanged: boolean;
  skinColor: string;
  armorColor: string;
  trimColor: string;
  accentColor: string;
  bulk: number;
}

export const NWL_MONSTER_SPECS: Record<NwlMonsterId, MonsterSpecMeta> = {
  'orcs.goblin_01': {
    id: 'orcs.goblin_01',
    namePt: 'Goblin Batedor',
    role: 'common',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 45,
    damage: 9,
    moveSpeed: 3.1,
    windupSec: 0.42,
    attackRangeM: 1.5,
    isRanged: false,
    skinColor: '#1a7a3e',
    armorColor: '#3b1725',
    trimColor: '#6d758d',
    accentColor: '#df3e23',
    bulk: 0.88,
  },
  'orcs.goblin_03': {
    id: 'orcs.goblin_03',
    namePt: 'Goblin Arqueiro',
    role: 'ranged',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 38,
    damage: 11,
    moveSpeed: 2.5,
    windupSec: 0.48,
    attackRangeM: 7.5,
    isRanged: true,
    skinColor: '#1a7a3e',
    armorColor: '#24523b',
    trimColor: '#3b1725',
    accentColor: '#f9a31b',
    bulk: 0.85,
  },
  'orcs.goblin_06': {
    id: 'orcs.goblin_06',
    namePt: 'Goblin Escudeiro',
    role: 'common',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 68,
    damage: 10,
    moveSpeed: 2.3,
    windupSec: 0.45,
    attackRangeM: 1.6,
    isRanged: false,
    skinColor: '#24523b',
    armorColor: '#6d758d',
    trimColor: '#b3b9d1',
    accentColor: '#285cc4',
    bulk: 0.96,
  },
  'orcs.goblin_02': {
    id: 'orcs.goblin_02',
    namePt: 'Goblin Xamã',
    role: 'ranged',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 42,
    damage: 14,
    moveSpeed: 2.2,
    windupSec: 0.55,
    attackRangeM: 8.0,
    isRanged: true,
    skinColor: '#1a7a3e',
    armorColor: '#4a3052',
    trimColor: '#dae0ea',
    accentColor: '#249fde',
    bulk: 0.9,
  },
  'orcs.orc_04': {
    id: 'orcs.orc_04',
    namePt: 'Orc Bruto',
    role: 'heavy',
    targetHeightM: 2.1,
    targetHeightPx: 125,
    maxHp: 135,
    damage: 22,
    moveSpeed: 2.0,
    windupSec: 0.65,
    attackRangeM: 2.2,
    isRanged: false,
    skinColor: '#24523b',
    armorColor: '#73172d',
    trimColor: '#6d758d',
    accentColor: '#f9a31b',
    bulk: 1.24,
  },
  'demons.boss_demon': {
    id: 'demons.boss_demon',
    namePt: 'Lorde Demônio (Boss)',
    role: 'boss',
    targetHeightM: 2.95,
    targetHeightPx: 177,
    maxHp: 380,
    damage: 34,
    moveSpeed: 2.35,
    windupSec: 0.72,
    attackRangeM: 3.1,
    isRanged: false,
    skinColor: '#73172d',
    armorColor: '#141013',
    trimColor: '#b4202a',
    accentColor: '#fa6a0a',
    bulk: 1.32,
  },
  'monster.skeleton_warrior': {
    id: 'monster.skeleton_warrior',
    namePt: 'Esqueleto Guerreiro',
    role: 'common',
    targetHeightM: 1.75,
    targetHeightPx: 105,
    maxHp: 55,
    damage: 12,
    moveSpeed: 2.5,
    windupSec: 0.45,
    attackRangeM: 1.7,
    isRanged: false,
    skinColor: '#d8cfb8',
    armorColor: '#475569',
    trimColor: '#94a3b8',
    accentColor: '#38bdf8',
    bulk: 0.78,
  },
  'monster.skeleton_archer': {
    id: 'monster.skeleton_archer',
    namePt: 'Esqueleto Arqueiro',
    role: 'ranged',
    targetHeightM: 1.74,
    targetHeightPx: 104,
    maxHp: 44,
    damage: 13,
    moveSpeed: 2.3,
    windupSec: 0.5,
    attackRangeM: 8.0,
    isRanged: true,
    skinColor: '#d8cfb8',
    armorColor: '#334155',
    trimColor: '#64748b',
    accentColor: '#22d3ee',
    bulk: 0.76,
  },
  'monster.dark_cultist': {
    id: 'monster.dark_cultist',
    namePt: 'Cultista Sombrio',
    role: 'ranged',
    targetHeightM: 1.8,
    targetHeightPx: 108,
    maxHp: 62,
    damage: 16,
    moveSpeed: 2.4,
    windupSec: 0.52,
    attackRangeM: 7.5,
    isRanged: true,
    skinColor: '#9f8ea8',
    armorColor: '#2e1065',
    trimColor: '#a855f7',
    accentColor: '#e879f9',
    bulk: 0.94,
  },
  'monster.gargoyle': {
    id: 'monster.gargoyle',
    namePt: 'Gárgula de Pedra',
    role: 'heavy',
    targetHeightM: 1.95,
    targetHeightPx: 117,
    maxHp: 110,
    damage: 19,
    moveSpeed: 2.6,
    windupSec: 0.55,
    attackRangeM: 2.0,
    isRanged: false,
    skinColor: '#64748b',
    armorColor: '#475569',
    trimColor: '#94a3b8',
    accentColor: '#f59e0b',
    bulk: 1.15,
  },
  'monster.lizardman': {
    id: 'monster.lizardman',
    namePt: 'Homem-Lagarto',
    role: 'common',
    targetHeightM: 1.88,
    targetHeightPx: 112,
    maxHp: 85,
    damage: 15,
    moveSpeed: 2.8,
    windupSec: 0.44,
    attackRangeM: 2.1,
    isRanged: false,
    skinColor: '#2d6a4f',
    armorColor: '#7c5338',
    trimColor: '#d4a359',
    accentColor: '#facc15',
    bulk: 1.05,
  },
  'monster.crystal_golem': {
    id: 'monster.crystal_golem',
    namePt: 'Golem de Cristal',
    role: 'heavy',
    targetHeightM: 2.25,
    targetHeightPx: 135,
    maxHp: 165,
    damage: 24,
    moveSpeed: 1.85,
    windupSec: 0.68,
    attackRangeM: 2.3,
    isRanged: false,
    skinColor: '#3b4252',
    armorColor: '#1e3a8a',
    trimColor: '#38bdf8',
    accentColor: '#67e8f9',
    bulk: 1.32,
  },
  'boss.colossus_golem': {
    id: 'boss.colossus_golem',
    namePt: 'Colosso Rúnico (Boss 3.6m)',
    role: 'boss',
    targetHeightM: 3.6,
    targetHeightPx: 216,
    maxHp: 520,
    damage: 42,
    moveSpeed: 1.75,
    windupSec: 0.85,
    attackRangeM: 3.6,
    isRanged: false,
    skinColor: '#475569',
    armorColor: '#1e293b',
    trimColor: '#38bdf8',
    accentColor: '#7dd3fc',
    bulk: 1.48,
  },
  'boss.minotaur_warlord': {
    id: 'boss.minotaur_warlord',
    namePt: 'Senhor Minotauro (Boss 3.2m)',
    role: 'boss',
    targetHeightM: 3.2,
    targetHeightPx: 192,
    maxHp: 460,
    damage: 38,
    moveSpeed: 2.2,
    windupSec: 0.72,
    attackRangeM: 3.2,
    isRanged: false,
    skinColor: '#5c3a28',
    armorColor: '#3f271e',
    trimColor: '#d4a359',
    accentColor: '#ef4444',
    bulk: 1.38,
  },
  'boss.dread_knight': {
    id: 'boss.dread_knight',
    namePt: 'Cavaleiro do Pavor (Boss 3.0m)',
    role: 'boss',
    targetHeightM: 3.0,
    targetHeightPx: 180,
    maxHp: 430,
    damage: 36,
    moveSpeed: 2.4,
    windupSec: 0.65,
    attackRangeM: 3.1,
    isRanged: false,
    skinColor: '#1e1b24',
    armorColor: '#18181b',
    trimColor: '#9333ea',
    accentColor: '#c084fc',
    bulk: 1.3,
  },
};

export interface MonsterBuildOptions {
  pixelSize?: number;
  objectId?: number;
  finishMode?: FinishMode;
  seed?: number;
  aoStrength?: number;
  normalStrength?: number;
}

export interface GeneratedMonsterResult {
  id: NwlMonsterId;
  spec: MonsterSpecMeta;
  rig: CanonicalUalRig;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  dispose?: () => void;
}

function getBoneSpanY(rig: CanonicalUalRig, boneName: string, fallback: number): number {
  const b = rig.boneByName.get(boneName);
  if (!b) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) return ch.position.y;
  }
  return fallback;
}

function bakedToMaterialOptions(
  baked: BakedAssetResult,
  extras: Partial<PixelizerMaterialOptions> = {}
): Partial<PixelizerMaterialOptions> {
  const hasTex = Boolean(baked.textures);
  const hasEmission = Boolean(baked.textures?.hasEmission && baked.textures.emissionMap);
  return {
    baseColor: '#ffffff',
    diffuseVertexColorWeight: 1.0,
    edgeHighlight: 0.36,
    edgeBevelWeight: 0.72,
    smoothness: 0.22,
    albedoMap: baked.textures?.albedoMap ?? null,
    normalMap: baked.textures?.normalMap ?? null,
    normalScale: hasTex ? 0.85 : 1.0,
    useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
    emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
    emissionColor: hasEmission ? '#ffffff' : '#000000',
    emissionIntensity: hasEmission ? 1.15 : 0.0,
    ...extras,
  };
}

function disposeMonsterMaterialsSafely(materials: PixelizerMaterial[]): void {
  const seen = new Set<THREE.Texture>();
  for (const mat of materials) {
    const o = mat.options;
    for (const tex of [o.albedoMap, o.normalMap, o.emissionMap]) {
      if (tex && !seen.has(tex)) {
        seen.add(tex);
        if (tex.userData?.pooled !== true) {
          tex.dispose();
        }
      }
    }
    mat.dispose();
  }
}

export function buildNwlMonster(
  id: NwlMonsterId,
  options: MonsterBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedMonsterResult {
  const spec = NWL_MONSTER_SPECS[id];
  const rigScale = spec.targetHeightM / 1.829;
  const px = options.pixelSize ?? 1;
  const objId = options.objectId ?? 85;
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 303);
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;
  const bulk = spec.bulk;

  const isGoblin = id.startsWith('orcs.goblin');
  const isBoss = spec.role === 'boss';
  const isSkeleton = id.startsWith('monster.skeleton');
  const isGolem = id === 'monster.crystal_golem' || id === 'boss.colossus_golem';
  const skinRecipe: MaterialRecipeId = isGoblin
    ? 'goblin_skin'
    : id === 'orcs.orc_04' || id === 'monster.lizardman'
      ? 'orc_hide'
      : isSkeleton
        ? 'bone_ivory'
        : isGolem || id === 'monster.gargoyle'
          ? 'stone_masonry'
          : 'demon_hide';
  const armorRecipe: MaterialRecipeId = isBoss
    ? 'magma_obsidian'
    : isGoblin && (id === 'orcs.goblin_03' || id === 'orcs.goblin_02')
      ? 'woven_cloth'
      : id === 'monster.dark_cultist'
        ? 'woven_cloth'
        : 'forged_steel';
  const emitHex = isBoss
    ? spec.accentColor
    : id === 'orcs.goblin_02' || id === 'monster.crystal_golem' || id === 'monster.dark_cultist'
      ? spec.accentColor
      : null;

  const rig = createCanonicalUalRig('male', rigScale);
  const pelvisLen = getBoneSpanY(rig, 'pelvis', 0.138);
  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const neckLen = getBoneSpanY(rig, 'neck_01', 0.083);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.4);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

  const partSpecs: RigidPartSpec[] = [];
  let keyMetrics: UnwrapMetricsSummary | null = null;

  const addBakedBone = (
    name: string,
    boneName: string,
    parts: TaggedGeometryPart[],
    inspectUvs = false
  ) => {
    const baked = bakeTaggedPartsAsset(parts, {
      finishMode,
      texelsPerMeter: 64,
      seed: seed + parts.length * 13,
      aoRays: 10,
      aoMaxDist: 0.34,
      aoStrength: Math.min(0.52, aoStrength),
      normalStrength,
      eyeHex: spec.accentColor,
      eyeGlowHex: isBoss ? '#ffd541' : spec.accentColor,
      browHex: spec.armorColor,
      emblemHex: spec.trimColor,
      emissiveRuneHex: emitHex,
      usePool: true,
      cacheKey: `nwl_monster:${id}:${name}`,
      inspectUvs,
    });
    for (const p of parts) p.geometry.dispose();
    if (name === 'Monster_Spine3' || (name === 'Monster_Head' && !keyMetrics)) {
      keyMetrics = baked.unwrapMetrics;
    }
    partSpecs.push({
      name,
      boneName,
      geometry: baked.geometry,
      materialOptions: bakedToMaterialOptions(baked, {
        workflow: armorRecipe === 'forged_steel' ? 'metallic' : 'specular',
        metallic: armorRecipe === 'forged_steel' ? 0.25 : 0.05,
      }),
    });
  };

  const pelvisParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBoneSegmentBox(
        pelvisLen * 1.15,
        0.155 * bulk,
        0.11 * bulk,
        0.145 * bulk,
        0.105 * bulk,
        0.015,
        spec.armorColor
      ),
      'm_pelvis_skirt',
      armorRecipe,
      spec.armorColor,
      { accentHex: spec.accentColor }
    ),
    tagPart(
      makeBeveledBoneSegmentBox(
        0.06,
        0.17 * bulk,
        0.125 * bulk,
        0.17 * bulk,
        0.125 * bulk,
        0.012,
        spec.trimColor
      ),
      'm_pelvis_belt',
      isBoss ? 'magma_obsidian' : 'brushed_gold',
      spec.trimColor,
      { accentHex: spec.accentColor }
    ),
    // Rigid bone-mounted pleated battle-loincloth / war-tabard
    tagPart(
      makePleatedTabardGeometry(
        0.15 * bulk,
        0.22 * bulk,
        0.24 * bulk,
        0.032 * bulk,
        3,
        spec.armorColor,
        { offset: [0, -0.06 * bulk, 0.115 * bulk], flareZ: 0.022 * bulk }
      ),
      'm_pelvis_loincloth_front',
      isBoss ? 'magma_obsidian' : 'woven_cloth',
      spec.armorColor,
      { accentHex: spec.accentColor }
    ),
  ];
  if (id === 'orcs.orc_04' || id === 'orcs.goblin_06' || isBoss) {
    for (const [tIdx, sx] of [-1, 1].entries()) {
      const tasset = makePleatedTabardGeometry(
        0.1 * bulk,
        0.14 * bulk,
        0.19 * bulk,
        0.032 * bulk,
        2,
        spec.trimColor,
        { flareZ: 0.016 * bulk }
      );
      tasset.rotateY(sx * (Math.PI * 0.5));
      tasset.rotateZ(sx * -0.15);
      tasset.translate(sx * 0.15 * bulk, -0.03 * bulk, 0);
      pelvisParts.push(
        tagPart(tasset, `m_pelvis_tasset_${tIdx}`, armorRecipe, spec.trimColor, {
          accentHex: spec.accentColor,
        })
      );
    }
  }
  addBakedBone('Monster_Pelvis', 'pelvis', pelvisParts);

  addBakedBone('Monster_Spine1', 'spine_01', [
    tagPart(
      makeBeveledBoneSegmentBox(
        spine1Len * 1.1,
        0.14 * bulk,
        0.1 * bulk,
        0.16 * bulk,
        0.115 * bulk,
        0.014,
        spec.skinColor
      ),
      'm_spine1_belly',
      skinRecipe,
      spec.skinColor,
      { accentHex: spec.accentColor }
    ),
  ]);

  const spine2Parts: TaggedGeometryPart[] = [
    tagPart(
      makeSegmentedBeveledBox(
        0.34 * bulk,
        spine2Len * 1.12,
        0.24 * bulk,
        0.016,
        2,
        2,
        2,
        (x, y, z) => {
          const vNorm = spine2Len > 1e-4 ? y / (spine2Len * 0.56) : 0;
          const taper = 1.0 + vNorm * 0.11;
          return [x * taper, y + spine2Len * 0.54, z];
        },
        spec.armorColor
      ),
      'm_spine2_armor',
      armorRecipe,
      spec.armorColor,
      { accentHex: spec.accentColor }
    ),
  ];
  if (id === 'orcs.orc_04' || id === 'orcs.goblin_06') {
    const strap = makeBeveledBox(0.36 * bulk, 0.048 * bulk, 0.26 * bulk, 0.01, spec.trimColor);
    strap.rotateZ(0.34);
    strap.translate(0, spine2Len * 0.54, 0);
    spine2Parts.push(
      tagPart(strap, 'm_spine2_harness', 'stitched_leather', spec.trimColor, {
        accentHex: spec.accentColor,
      })
    );
  }
  addBakedBone('Monster_Spine2', 'spine_02', spine2Parts);

  // Upper chest (+ higher-resolution Taubin-smoothed SDF musculature + glowing chest rune + dorsal spines for Boss Demon)
  const chestParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBoneSegmentBox(
        spine3Len * 0.94,
        0.185 * bulk,
        0.13 * bulk,
        0.21 * bulk,
        0.14 * bulk,
        0.018,
        spec.armorColor
      ),
      'm_spine3_core',
      armorRecipe,
      spec.armorColor,
      { accentHex: spec.accentColor, landmarkKind: 'chest_crest' }
    ),
  ];
  if (isBoss) {
    const sdfChest = makeSdfOrganicMesh(
      (x, y, z) => {
        const torso = sdEllipsoid(
          x,
          y,
          z,
          0,
          spine3Len * 0.54,
          0.02,
          0.22 * bulk,
          spine3Len * 0.54,
          0.145 * bulk
        );
        const pecL = sdEllipsoid(
          x,
          y,
          z,
          0.095 * bulk,
          spine3Len * 0.62,
          0.095 * bulk,
          0.098 * bulk,
          0.072,
          0.072 * bulk
        );
        const pecR = sdEllipsoid(
          x,
          y,
          z,
          -0.095 * bulk,
          spine3Len * 0.62,
          0.095 * bulk,
          0.098 * bulk,
          0.072,
          0.072 * bulk
        );
        const dorsal = sdEllipsoid(
          x,
          y,
          z,
          0,
          spine3Len * 0.62,
          -0.095 * bulk,
          0.11 * bulk,
          spine3Len * 0.44,
          0.08 * bulk
        );
        return sminPoly(sminPoly(torso, Math.min(pecL, pecR), 0.032), dorsal, 0.028);
      },
      [-0.27 * bulk, 0.01, -0.17 * bulk],
      [0.27 * bulk, spine3Len * 1.04, 0.21 * bulk],
      16,
      spec.skinColor,
      { flatShaded: true }
    );
    const gorget = makeBeveledBox(0.37 * bulk, 0.08, 0.28 * bulk, 0.015, spec.trimColor, {
      offset: [0, spine3Len * 0.84, 0],
    });
    const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.072, 0), spec.accentColor);
    rune.translate(0, spine3Len * 0.58, 0.175 * bulk);
    chestParts.push(
      tagPart(sdfChest, 'demon_carapace_sdf', 'demon_hide', spec.skinColor, {
        accentHex: spec.trimColor,
        lockVertical: false,
      }),
      tagPart(gorget, 'demon_gorget', 'magma_obsidian', spec.trimColor, {
        accentHex: spec.accentColor,
      }),
      tagPart(rune, 'demon_chest_rune', 'runic_glow', spec.accentColor, {
        accentHex: '#ffd541',
        lockVertical: false,
      })
    );
    for (const [dIdx, sx] of [-1, 1].entries()) {
      const dorsalHorn = makeCurvedHornGeometry(
        4,
        0.04,
        0.008,
        0.22,
        sx * 0.04,
        -0.09,
        5,
        '#ffd541'
      );
      dorsalHorn.rotateX(-0.52);
      dorsalHorn.translate(sx * 0.11 * bulk, spine3Len * 0.66, -0.12 * bulk);
      chestParts.push(
        tagPart(dorsalHorn, `demon_dorsal_spike_${dIdx}`, 'bone_ivory', '#ffd541', {
          lockVertical: false,
        })
      );
    }
  }
  addBakedBone('Monster_Spine3', 'spine_03', chestParts, false);

  addBakedBone('Monster_Neck', 'neck_01', [
    tagPart(
      makeBeveledBoneSegmentBox(
        neckLen * 1.1,
        0.058 * bulk,
        0.058 * bulk,
        0.055 * bulk,
        0.055 * bulk,
        0.01,
        spec.skinColor
      ),
      'm_neck',
      skinRecipe,
      spec.skinColor
    ),
  ]);

  // Head + Monster Silhouettes (semantic head_front eyes, goblin ears, orc tusks, giant boss horns)
  const headScale = isGoblin ? 1.24 : bulk;
  const headParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(0.22 * headScale, 0.22 * headScale, 0.22 * headScale, 0.02 * headScale, spec.skinColor, {
        offset: [0, 0.11 * headScale, 0],
      }),
      'm_skull',
      skinRecipe,
      spec.skinColor,
      { landmarkKind: 'head_front', lockVertical: true }
    ),
  ];

  if (isGoblin) {
    for (const [eIdx, sx] of [-1, 1].entries()) {
      const ear = makeCurvedHornGeometry(
        4,
        0.045,
        0.006,
        0.19,
        sx * 0.03,
        -0.02,
        5,
        spec.skinColor
      );
      ear.rotateZ(sx * -1.24);
      ear.translate(sx * 0.105 * headScale, 0.13 * headScale, 0);
      headParts.push(
        tagPart(ear, `goblin_ear_${eIdx}`, skinRecipe, spec.skinColor, { lockVertical: false })
      );
    }
    if (id === 'orcs.goblin_03') {
      headParts.push(
        tagPart(
          makeBeveledBox(0.26 * headScale, 0.13, 0.26 * headScale, 0.02, spec.armorColor, {
            offset: [0, 0.21 * headScale, -0.01],
          }),
          'goblin_hood',
          'woven_cloth',
          spec.armorColor
        )
      );
    } else if (id === 'orcs.goblin_06') {
      const helm = makeLatheProfile(
        [
          [0.165 * headScale, 0.16 * headScale],
          [0.18 * headScale, 0.2 * headScale],
          [0.12 * headScale, 0.27 * headScale],
          [0.01 * headScale, 0.3 * headScale],
        ],
        8,
        spec.armorColor
      );
      headParts.push(tagPart(helm, 'goblin_kettle_helm', 'forged_steel', spec.armorColor));
    } else if (id === 'orcs.goblin_02') {
      headParts.push(
        tagPart(
          makeBeveledBox(0.26 * headScale, 0.095, 0.24 * headScale, 0.018, spec.trimColor, {
            offset: [0, 0.22 * headScale, 0],
          }),
          'shaman_bone_crown',
          'bone_ivory',
          spec.trimColor
        )
      );
      for (const [hIdx, sx] of [-1, 1].entries()) {
        const tuskHorn = makeCurvedHornGeometry(4, 0.032, 0.007, 0.15, sx * 0.03, 0.02, 5, '#dae0ea');
        tuskHorn.rotateZ(sx * -0.35);
        tuskHorn.translate(sx * 0.095, 0.24 * headScale, 0.04);
        headParts.push(
          tagPart(tuskHorn, `shaman_crown_horn_${hIdx}`, 'bone_ivory', '#dae0ea', {
            lockVertical: false,
          })
        );
      }
    }
  } else if (id === 'orcs.orc_04') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.26 * bulk, 0.09, 0.18 * bulk, 0.016, spec.skinColor, {
          offset: [0, 0.05, 0.055],
        }),
        'orc_jaw',
        'orc_hide',
        spec.skinColor
      ),
      tagPart(
        makeBeveledBox(0.26 * bulk, 0.065, 0.25 * bulk, 0.014, spec.trimColor, {
          offset: [0, 0.21 * bulk, 0],
        }),
        'orc_brow_band',
        'forged_steel',
        spec.trimColor
      )
    );
    for (const [tIdx, sx] of [-1, 1].entries()) {
      const tusk = makeCurvedHornGeometry(4, 0.024, 0.005, 0.095, sx * 0.01, 0.025, 5, '#dae0ea');
      tusk.translate(sx * 0.08 * bulk, 0.075, 0.125 * bulk);
      headParts.push(
        tagPart(tusk, `orc_tusk_${tIdx}`, 'bone_ivory', '#dae0ea', { lockVertical: false })
      );
    }
  } else if (isGolem) {
    for (const [cIdx, sx] of [-0.07, 0, 0.07].entries()) {
      const spire = prepareColoredPart(
        new THREE.ConeGeometry(0.045 * bulk, (cIdx === 1 ? 0.22 : 0.15) * bulk, 5),
        spec.accentColor
      );
      spire.rotateZ(-sx * 2.2);
      spire.translate(sx * bulk, 0.26 * bulk, -0.02);
      headParts.push(tagPart(spire, `golem_crystal_${cIdx}`, 'runic_glow', spec.accentColor));
    }
  } else if (id === 'monster.dark_cultist') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.25 * bulk, 0.24 * bulk, 0.26 * bulk, 0.025, spec.armorColor, {
          offset: [0, 0.13 * bulk, -0.02],
        }),
        'cultist_hood',
        'woven_cloth',
        spec.armorColor,
        { accentHex: spec.accentColor }
      )
    );
  } else if (id === 'monster.lizardman') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.15 * bulk, 0.1 * bulk, 0.18 * bulk, 0.016, spec.skinColor, {
          offset: [0, 0.08 * bulk, 0.14 * bulk],
        }),
        'lizard_snout',
        'orc_hide',
        spec.skinColor
      ),
      tagPart(
        makeBeveledBox(0.04 * bulk, 0.1 * bulk, 0.24 * bulk, 0.01, spec.trimColor, {
          offset: [0, 0.22 * bulk, -0.02],
        }),
        'lizard_crest',
        'bone_ivory',
        spec.trimColor
      )
    );
  } else if (isBoss || id === 'monster.gargoyle') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.28 * bulk, 0.09, 0.27 * bulk, 0.02, spec.armorColor, {
          offset: [0, 0.2 * bulk, 0.01],
        }),
        'demon_crown_brow',
        'magma_obsidian',
        spec.armorColor,
        { accentHex: spec.accentColor }
      )
    );
    const hornHex = id === 'boss.dread_knight' ? spec.trimColor : id === 'monster.gargoyle' ? spec.skinColor : '#ffd541';
    for (const [hIdx, sx] of [-1, 1].entries()) {
      const horn = makeCurvedHornGeometry(
        6,
        0.066,
        0.012,
        0.44,
        sx * 0.13,
        -0.08,
        6,
        hornHex
      );
      horn.rotateZ(sx * -0.18);
      horn.translate(sx * 0.105 * bulk, 0.2 * bulk, 0);
      headParts.push(
        tagPart(horn, `demon_great_horn_${hIdx}`, 'bone_ivory', hornHex, {
          lockVertical: false,
        })
      );
    }
  }
  addBakedBone('Monster_Head', 'Head', headParts, false);

  // Arms, Pauldrons & Weapons
  for (const side of ['l', 'r'] as const) {
    const uParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBoneSegmentBox(
          uArm * 0.96,
          0.068 * bulk,
          0.068 * bulk,
          0.056 * bulk,
          0.056 * bulk,
          0.012,
          spec.skinColor
        ),
        `m_ua_${side}`,
        skinRecipe,
        spec.skinColor
      ),
    ];
    if (id === 'orcs.orc_04' || id === 'orcs.goblin_06' || isBoss) {
      const pScale = isBoss ? 1.05 * bulk : id === 'orcs.orc_04' ? 0.82 * bulk : 0.64 * bulk;
      const pauldron = makePauldronShellGeometry(
        0.24 * pScale,
        0.18 * pScale,
        0.24 * pScale,
        0.04,
        spec.armorColor
      );
      if (side === 'r') pauldron.rotateY(Math.PI);
      pauldron.translate(side === 'l' ? 0.025 : -0.025, 0.025, 0);
      uParts.push(
        tagPart(pauldron, `m_pauldron_${side}`, armorRecipe, spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );
      if (isBoss || id === 'orcs.orc_04') {
        const pSpike = makeCurvedHornGeometry(
          4,
          0.042,
          0.008,
          isBoss ? 0.19 : 0.13,
          side === 'l' ? 0.04 : -0.04,
          0.01,
          5,
          spec.accentColor
        );
        pSpike.rotateZ(side === 'l' ? -0.78 : 0.78);
        pSpike.translate(side === 'l' ? 0.08 * bulk : -0.08 * bulk, 0.055, 0);
        uParts.push(
          tagPart(pSpike, `demon_pauldron_horn_${side}`, 'bone_ivory', spec.accentColor, {
            lockVertical: false,
          })
        );
      }
    }
    addBakedBone(`Monster_UA_${side}`, `upperarm_${side}`, uParts);

    addBakedBone(`Monster_LA_${side}`, `lowerarm_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          lArm * 0.96,
          0.058 * bulk,
          0.058 * bulk,
          0.048 * bulk,
          0.048 * bulk,
          0.01,
          spec.armorColor
        ),
        `m_la_${side}`,
        armorRecipe,
        spec.armorColor,
        { accentHex: spec.accentColor }
      ),
    ]);

    const handParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBoneSegmentBox(
          0.115,
          0.05 * bulk,
          0.046 * bulk,
          0.044 * bulk,
          0.04 * bulk,
          0.009,
          spec.skinColor
        ),
        `m_hand_${side}`,
        skinRecipe,
        spec.skinColor
      ),
    ];

    if (side === 'r') {
      if (id === 'orcs.goblin_01') {
        const hilt = makeLatheProfile(
          [
            [0.02, -0.09],
            [0.02, 0.09],
          ],
          6,
          '#3b1725'
        );
        hilt.rotateX(Math.PI * 0.5);
        const blade = makeSwordBladeGeometry(0.08, 0.032, 0.3, 0.1, '#b3b9d1');
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, 0, 0.09);
        handParts.push(
          tagPart(hilt, 'goblin_dagger_hilt', 'stitched_leather', '#3b1725', { lockVertical: false }),
          tagPart(blade, 'goblin_scimitar', 'forged_steel', '#b3b9d1', { lockVertical: false })
        );
      } else if (id === 'orcs.goblin_03') {
        const shaft = makeLatheProfile(
          [
            [0.014, -0.26],
            [0.014, 0.26],
          ],
          6,
          '#3b1725'
        );
        shaft.rotateX(Math.PI * 0.5);
        shaft.translate(0, 0, 0.2);
        const tip = makeSwordBladeGeometry(0.05, 0.022, 0.04, 0.09, '#f9a31b');
        tip.rotateX(Math.PI * 0.5);
        tip.translate(0, 0, 0.44);
        handParts.push(
          tagPart(shaft, 'goblin_arrow_shaft', 'wood_planks', '#3b1725', { lockVertical: false }),
          tagPart(tip, 'goblin_arrow_tip', 'brushed_gold', '#f9a31b', { lockVertical: false })
        );
      } else if (id === 'orcs.goblin_06') {
        const club = makeLatheProfile(
          [
            [0.026, -0.18],
            [0.034, 0.08],
            [0.068, 0.28],
            [0.055, 0.42],
          ],
          7,
          '#73172d'
        );
        club.rotateX(Math.PI * 0.5);
        club.translate(0, 0, 0.14);
        handParts.push(tagPart(club, 'goblin_club', 'wood_planks', '#73172d', { lockVertical: false }));
      } else if (id === 'orcs.goblin_02') {
        const staff = makeLatheProfile(
          [
            [0.02, -0.68],
            [0.025, 0.68],
          ],
          6,
          '#3b1725'
        );
        staff.rotateX(Math.PI * 0.5);
        staff.translate(0, 0, 0.38);
        const skullTotem = makeBeveledBox(0.14, 0.14, 0.14, 0.018, '#dae0ea', { offset: [0, 0, 1.1] });
        const orb = prepareColoredPart(new THREE.OctahedronGeometry(0.08, 0), '#249fde');
        orb.translate(0, 0.11, 1.1);
        handParts.push(
          tagPart(staff, 'shaman_staff', 'wood_planks', '#3b1725', { lockVertical: false }),
          tagPart(skullTotem, 'shaman_totem', 'bone_ivory', '#dae0ea', { lockVertical: false }),
          tagPart(orb, 'shaman_orb', 'runic_glow', '#249fde', { lockVertical: false })
        );
      } else if (id === 'orcs.orc_04') {
        const handle = makeLatheProfile(
          [
            [0.028, -0.32],
            [0.032, 0.32],
          ],
          7,
          '#3b1725'
        );
        handle.rotateX(Math.PI * 0.5);
        handle.translate(0, 0, 0.22);
        const maul = makeBeveledBox(0.24, 0.22, 0.44, 0.024, '#6d758d', { offset: [0, 0, 0.64] });
        const spike = makeSwordBladeGeometry(0.09, 0.045, 0.05, 0.14, '#f9a31b');
        spike.rotateX(Math.PI * 0.5);
        spike.translate(0, 0, 0.86);
        handParts.push(
          tagPart(handle, 'orc_maul_handle', 'wood_planks', '#3b1725', { lockVertical: false }),
          tagPart(maul, 'orc_maul_head', 'forged_steel', '#6d758d', { lockVertical: false }),
          tagPart(spike, 'orc_maul_spike', 'brushed_gold', '#f9a31b', { lockVertical: false })
        );
      } else if (isBoss) {
        const grip = makeLatheProfile(
          [
            [0.028, -0.18],
            [0.032, 0.18],
          ],
          7,
          '#141013'
        );
        grip.rotateX(Math.PI * 0.5);
        grip.translate(0, 0, 0.08);
        const guard = makeBeveledBox(0.42, 0.09, 0.1, 0.015, '#b4202a', { offset: [0, 0, 0.28] });
        const blade = makeSwordBladeGeometry(0.18, 0.06, 1.15, 0.28, '#6d758d');
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, 0, 0.33);
        const core = makeBeveledBox(0.065, 0.072, 1.0, 0.01, '#fa6a0a', { offset: [0, 0, 0.9] });
        handParts.push(
          tagPart(grip, 'demon_sword_grip', 'stitched_leather', '#141013', { lockVertical: false }),
          tagPart(guard, 'demon_sword_guard', 'magma_obsidian', '#b4202a', {
            accentHex: '#fa6a0a',
            lockVertical: false,
          }),
          tagPart(blade, 'demon_sword_blade', 'magma_obsidian', '#6d758d', {
            accentHex: '#fa6a0a',
            lockVertical: false,
          }),
          tagPart(core, 'demon_sword_rune', 'runic_glow', '#fa6a0a', { lockVertical: false })
        );
      }
    } else if (side === 'l') {
      if (id === 'orcs.goblin_01') {
        const dBlade = makeSwordBladeGeometry(0.065, 0.028, 0.22, 0.1, '#b3b9d1');
        dBlade.rotateX(Math.PI * 0.5);
        dBlade.translate(0, 0, 0.06);
        handParts.push(tagPart(dBlade, 'goblin_offhand_blade', 'forged_steel', '#b3b9d1', { lockVertical: false }));
      } else if (id === 'orcs.goblin_03') {
        const bow = makeRecurveBowGeometry(0.86, 0.18, 0.036, spec.trimColor);
        bow.translate(0, 0.04, 0.14);
        handParts.push(tagPart(bow, 'goblin_bow', 'wood_planks', spec.trimColor, { lockVertical: false }));
      } else if (id === 'orcs.goblin_06') {
        const shield = makeDomeShieldGeometry(0.46, 0.52, 0.055, spec.armorColor);
        shield.rotateY(Math.PI * 0.5);
        shield.translate(0.11, 0.04, 0.06);
        const boss = makeBeveledBox(0.06, 0.14, 0.14, 0.015, spec.trimColor, {
          offset: [0.15, 0.04, 0.06],
        });
        handParts.push(
          tagPart(shield, 'goblin_shield', 'forged_steel', spec.armorColor, {
            landmarkKind: 'shield_face',
            accentHex: spec.trimColor,
            lockVertical: false,
          }),
          tagPart(boss, 'goblin_shield_boss', 'brushed_gold', spec.trimColor, { lockVertical: false })
        );
      }
    }

    addBakedBone(`Monster_Hand_${side}`, `hand_${side}`, handParts);
  }

  for (const side of ['l', 'r'] as const) {
    addBakedBone(`Monster_Thigh_${side}`, `thigh_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          thigh * 0.96,
          0.092 * bulk,
          0.092 * bulk,
          0.072 * bulk,
          0.072 * bulk,
          0.014,
          spec.skinColor
        ),
        `m_thigh_${side}`,
        skinRecipe,
        spec.skinColor
      ),
    ]);
    addBakedBone(`Monster_Calf_${side}`, `calf_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          calf * 0.96,
          0.072 * bulk,
          0.072 * bulk,
          0.058 * bulk,
          0.058 * bulk,
          0.012,
          spec.armorColor
        ),
        `m_calf_${side}`,
        armorRecipe,
        spec.armorColor,
        { accentHex: spec.accentColor }
      ),
    ]);
    addBakedBone(`Monster_Foot_${side}`, `foot_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          0.185,
          0.062 * bulk,
          0.072 * bulk,
          0.054 * bulk,
          0.06 * bulk,
          0.011,
          '#141013'
        ),
        `m_foot_${side}`,
        'stitched_leather',
        '#141013'
      ),
    ]);
  }

  const rigidRes = attachRigidPartsToUalRig(rig, partSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  if (id === 'demons.boss_demon') {
    for (const m of rigidRes.meshes) {
      m.userData.nwlIsBoss = true;
    }
    for (const mat of rigidRes.materials) {
      mat.updateOptions({
        outlineWidthSteps: 2,
        rimColor: '#fa6a0a',
        rimIntensity: 0.35,
        rimPower: 3.0,
        rimSteppedThreshold: 0.36,
      });
    }
  }

  const root = new THREE.Group();
  root.name = id;
  root.userData.unwrapMetrics = keyMetrics;
  if (id === 'demons.boss_demon') {
    root.userData.nwlIsBoss = true;
  }
  root.add(rig.armature);

  return {
    id,
    spec,
    rig,
    root,
    meshes: rigidRes.meshes,
    materials: rigidRes.materials,
    dispose: () => {
      for (const m of rigidRes.meshes) m.geometry.dispose();
      disposeMonsterMaterialsSafely(rigidRes.materials);
    },
  };
}

