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
import {
  bakedToMaterialOptions,
  bakeTaggedPartsAsset,
  type UnwrapMetricsSummary,
} from './PixelMaterialSynth';
import {
  makeAnatomicalTorsoGeometry,
  makeAxeHeadGeometry,
  makeBeveledBox,
  makeCurvedHornGeometry,
  makeDomeShieldGeometry,
  makeLatheProfile,
  makePauldronShellGeometry,
  makePleatedTabardGeometry,
  makeRecurveBowGeometry,
  makeSculptedLimbGeometry,
  makeSdfOrganicMesh,
  makeSplineLoftGeometry,
  makeSwordBladeGeometry,
  sdCapsule,
  sdEllipsoid,
  sminPoly,
  subdivideGeometryLoop,
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

function makeBossWingMembraneGrid(
  ribStart: [number, number, number],
  ribEnd: [number, number, number],
  trailStart: [number, number, number],
  trailEnd: [number, number, number],
  uSegs: number,
  vSegs: number,
  archY: number,
  scallopDepth: number,
  tatterDepth: number,
  hexColor: string
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const frontGrid: [number, number, number][][] = [];
  const backGrid: [number, number, number][][] = [];

  // Approximate plane normal for subtle non-degenerate double-sided membrane thickness
  const ux = ribEnd[0] - ribStart[0];
  const uy = ribEnd[1] - ribStart[1];
  const uz = ribEnd[2] - ribStart[2];
  const vxDir = trailStart[0] - ribStart[0];
  const vyDir = trailStart[1] - ribStart[1];
  const vzDir = trailStart[2] - ribStart[2];
  let nx = uy * vzDir - uz * vyDir;
  let ny = uz * vxDir - ux * vzDir;
  let nz = ux * vyDir - uy * vxDir;
  const nLen = Math.hypot(nx, ny, nz) || 1;
  const halfThick = 0.0035;
  nx = (nx / nLen) * halfThick;
  ny = (ny / nLen) * halfThick;
  nz = (nz / nLen) * halfThick;

  for (let iv = 0; iv <= vSegs; iv++) {
    const v = iv / vSegs;
    const fRow: [number, number, number][] = [];
    const bRow: [number, number, number][] = [];
    for (let iu = 0; iu <= uSegs; iu++) {
      const u = iu / uSegs;
      const lx = ribStart[0] + (ribEnd[0] - ribStart[0]) * u;
      const ly = ribStart[1] + (ribEnd[1] - ribStart[1]) * u;
      const lz = ribStart[2] + (ribEnd[2] - ribStart[2]) * u;

      const tx = trailStart[0] + (trailEnd[0] - trailStart[0]) * u;
      const ty = trailStart[1] + (trailEnd[1] - trailStart[1]) * u;
      const tz = trailStart[2] + (trailEnd[2] - trailStart[2]) * u;

      // Parabolic scallop + ragged demonic notches near trailing edge
      const notch = Math.pow(Math.abs(Math.sin(u * Math.PI * 2.0)), 2.4) * tatterDepth;
      const scallop = (Math.sin(u * Math.PI) * scallopDepth + notch) * (v * v);
      const vx = lx + (tx - lx) * v;
      const vz = lz + (tz - lz) * v + scallop;
      const camber = Math.sin(v * Math.PI) * (0.4 + 0.6 * Math.sin(u * Math.PI)) * archY;
      const vy = ly + (ty - ly) * v + camber + scallop * 0.35;
      fRow.push([vx + nx, vy + ny, vz + nz]);
      bRow.push([vx - nx, vy - ny, vz - nz]);
    }
    frontGrid.push(fRow);
    backGrid.push(bRow);
  }

  for (let iv = 0; iv < vSegs; iv++) {
    const v0 = iv / vSegs;
    const v1 = (iv + 1) / vSegs;
    for (let iu = 0; iu < uSegs; iu++) {
      const u0 = iu / uSegs;
      const u1 = (iu + 1) / uSegs;
      const fa = frontGrid[iv][iu];
      const fb = frontGrid[iv][iu + 1];
      const fc = frontGrid[iv + 1][iu + 1];
      const fd = frontGrid[iv + 1][iu];
      positions.push(...fa, ...fb, ...fc, ...fa, ...fc, ...fd);
      uvs.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1);

      const ba = backGrid[iv][iu];
      const bb = backGrid[iv][iu + 1];
      const bc = backGrid[iv + 1][iu + 1];
      const bd = backGrid[iv + 1][iu];
      positions.push(...ba, ...bc, ...bb, ...ba, ...bd, ...bc);
      uvs.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return prepareColoredPart(geo, hexColor, 0.03);
}

function disposeMonsterMaterialsSafely(materials: PixelizerMaterial[]): void {
  const seen = new Set<THREE.Texture>();
  for (const mat of materials) {
    const o = mat.options;
    for (const tex of [
      o.albedoMap,
      o.normalMap,
      o.roughnessMap,
      o.aoMap,
      o.metalnessMap,
      o.emissionMap,
    ]) {
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
  const isBossDemon = id === 'demons.boss_demon';
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
      makeAnatomicalTorsoGeometry(
        pelvisLen * 1.15,
        0.155 * bulk,
        0.11 * bulk,
        0.145 * bulk,
        0.105 * bulk,
        { radialSegs: 16, heightSegs: 5, hexColor: spec.armorColor, musculature: 0.7 }
      ),
      'm_pelvis_skirt',
      armorRecipe,
      spec.armorColor,
      { accentHex: spec.accentColor }
    ),
    tagPart(
      makeAnatomicalTorsoGeometry(
        0.06,
        0.17 * bulk,
        0.125 * bulk,
        0.17 * bulk,
        0.125 * bulk,
        { radialSegs: 16, heightSegs: 4, hexColor: spec.trimColor, musculature: 0.3 }
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
  if (id === 'monster.dark_cultist') {
    pelvisParts.push(
      tagPart(
        makePleatedTabardGeometry(0.18 * bulk, 0.28 * bulk, 0.34 * bulk, 0.036 * bulk, 4, spec.armorColor, {
          offset: [0, -0.1 * bulk, -0.115 * bulk],
          flareZ: -0.032 * bulk,
        }),
        'cultist_robe_back',
        'woven_cloth',
        spec.armorColor,
        { accentHex: spec.accentColor }
      )
    );
  }
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
  if (id === 'monster.lizardman') {
    const lizTail = makeSplineLoftGeometry(
      [
        [0, 0.02, -0.1 * bulk],
        [0, -0.04, -0.28 * bulk],
        [0, -0.08, -0.52 * bulk],
      ],
      [0.068 * bulk, 0.044 * bulk, 0.014 * bulk],
      10,
      12,
      { colorHex: spec.skinColor, ridgeAmplitude: 0.018 }
    );
    pelvisParts.push(tagPart(lizTail, 'lizard_tail', 'orc_hide', spec.skinColor));
  }
  if (isBossDemon) {
    // Muscular spiked demonic tail curving back and upward from pelvis
    const demonTail = makeSplineLoftGeometry(
      [
        [0, 0.03, -0.1 * bulk],
        [0, -0.05, -0.28 * bulk],
        [0.03, -0.08, -0.48 * bulk],
        [0.06, 0.02, -0.64 * bulk],
      ],
      [0.052 * bulk, 0.036 * bulk, 0.022 * bulk, 0.008 * bulk],
      10,
      14,
      { colorHex: spec.skinColor, ridgeAmplitude: 0.012 }
    );
    const tailBarb = makeSwordBladeGeometry(0.065, 0.024, 0.11, 0.05, spec.armorColor);
    tailBarb.rotateX(-Math.PI * 0.35);
    tailBarb.translate(0.06, 0.03, -0.66 * bulk);
    pelvisParts.push(
      tagPart(demonTail, 'demon_tail', 'demon_hide', spec.skinColor, { lockVertical: false }),
      tagPart(tailBarb, 'demon_tail_barb', 'magma_obsidian', spec.armorColor, {
        accentHex: spec.accentColor,
        lockVertical: false,
      })
    );
  }
  addBakedBone('Monster_Pelvis', 'pelvis', pelvisParts);

  const spine1Parts: TaggedGeometryPart[] = [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine1Len * 1.12,
        (isSkeleton ? 0.068 : isBossDemon ? 0.132 : 0.14) * bulk,
        (isSkeleton ? 0.056 : isBossDemon ? 0.098 : 0.1) * bulk,
        (isSkeleton ? 0.082 : isBossDemon ? 0.172 : 0.16) * bulk,
        (isSkeleton ? 0.068 : isBossDemon ? 0.122 : 0.115) * bulk,
        {
          radialSegs: isBossDemon ? 16 : 14,
          heightSegs: isBossDemon ? 6 : 5,
          hexColor: spec.skinColor,
          musculature: isSkeleton ? 0.35 : isBossDemon ? 1.15 : 0.85,
        }
      ),
      'm_spine1_belly',
      skinRecipe,
      spec.skinColor,
      { accentHex: spec.accentColor }
    ),
  ];
  if (isBossDemon) {
    // Segmented obsidian flank rib plates framing athletic V-taper waist
    for (const [fIdx, sx] of [-1, 1].entries()) {
      const flankPlate = makeSplineLoftGeometry(
        [
          [sx * 0.115 * bulk, spine1Len * 0.18, 0.05 * bulk],
          [sx * 0.155 * bulk, spine1Len * 0.56, 0.0],
          [sx * 0.168 * bulk, spine1Len * 0.94, -0.05 * bulk],
        ],
        [
          [0.022 * bulk, 0.045 * bulk],
          [0.026 * bulk, 0.055 * bulk],
          [0.024 * bulk, 0.05 * bulk],
        ],
        8,
        10,
        { colorHex: spec.armorColor }
      );
      spine1Parts.push(
        tagPart(flankPlate, `demon_flank_plate_${fIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );
    }
  }
  addBakedBone('Monster_Spine1', 'spine_01', spine1Parts);

  const spine2Parts: TaggedGeometryPart[] = [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine2Len * 1.14,
        (isBossDemon ? 0.17 : 0.155) * bulk,
        (isBossDemon ? 0.118 : 0.11) * bulk,
        (isBossDemon ? 0.215 : 0.178) * bulk,
        (isBossDemon ? 0.14 : 0.125) * bulk,
        {
          isArmored: !isSkeleton,
          radialSegs: isBossDemon ? 18 : 16,
          heightSegs: isBossDemon ? 7 : 6,
          hexColor: spec.armorColor,
          musculature: isBossDemon ? 1.15 : 1.0,
        }
      ),
      'm_spine2_armor',
      isSkeleton ? 'bone_ivory' : armorRecipe,
      isSkeleton ? spec.skinColor : spec.armorColor,
      { accentHex: spec.accentColor }
    ),
  ];
  if (isBossDemon) {
    for (let sIdx = 0; sIdx < 2; sIdx++) {
      const sy = spine2Len * (0.34 + sIdx * 0.42);
      const dorsalSpur = makeCurvedHornGeometry(
        7,
        0.028,
        0.005,
        0.16,
        0,
        -0.06,
        7,
        '#d8be84'
      );
      dorsalSpur.rotateX(-Math.PI * 0.42);
      dorsalSpur.translate(0, sy, -0.125 * bulk);
      spine2Parts.push(
        tagPart(dorsalSpur, `demon_spine2_spur_${sIdx}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        })
      );
    }
  }
  if (isSkeleton) {
    // Sculpted ribcage arches around spine_02
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const ry = spine2Len * (0.24 + rIdx * 0.28);
      for (const [sIdx, sx] of [-1, 1].entries()) {
        const rib = makeSplineLoftGeometry(
          [
            [0, ry, -0.09 * bulk],
            [sx * 0.16 * bulk, ry + 0.008, 0],
            [sx * 0.03 * bulk, ry - 0.01, 0.12 * bulk],
          ],
          [0.015, 0.018, 0.012],
          8,
          8,
          { colorHex: spec.skinColor }
        );
        spine2Parts.push(tagPart(rib, `skel_rib2_${rIdx}_${sIdx}`, 'bone_ivory', spec.skinColor));
      }
    }
  }
  if (id === 'orcs.orc_04' || id === 'orcs.goblin_06') {
    const strap = makeSplineLoftGeometry(
      [
        [-0.17 * bulk, spine2Len * 0.15, 0.12 * bulk],
        [0, spine2Len * 0.54, 0.14 * bulk],
        [0.17 * bulk, spine2Len * 0.92, 0.12 * bulk],
      ],
      [0.026 * bulk, 0.028 * bulk, 0.026 * bulk],
      8,
      10,
      { colorHex: spec.trimColor }
    );
    spine2Parts.push(
      tagPart(strap, 'm_spine2_harness', 'stitched_leather', spec.trimColor, {
        accentHex: spec.accentColor,
      })
    );
  }
  addBakedBone('Monster_Spine2', 'spine_02', spine2Parts);

  // Upper chest (+ smooth high-res SDF musculature, gargoyle stone wings, crystal golem clusters, skeleton ribcage)
  const chestParts: TaggedGeometryPart[] = [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine3Len * (isBossDemon ? 1.04 : 0.94),
        (isBossDemon ? 0.215 : 0.185) * bulk,
        (isBossDemon ? 0.14 : 0.13) * bulk,
        (isBossDemon ? 0.275 : 0.21) * bulk,
        (isBossDemon ? 0.175 : 0.14) * bulk,
        {
          isArmored: !isSkeleton,
          radialSegs: isBossDemon ? 20 : 18,
          heightSegs: isBossDemon ? 8 : 7,
          hexColor: spec.armorColor,
          musculature: isBossDemon ? 1.25 : 1.0,
        }
      ),
      'm_spine3_core',
      isSkeleton ? 'bone_ivory' : armorRecipe,
      isSkeleton ? spec.skinColor : spec.armorColor,
      { accentHex: spec.accentColor, landmarkKind: 'chest_crest' }
    ),
  ];
  if (isSkeleton) {
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const ry = spine3Len * (0.2 + rIdx * 0.25);
      for (const [sIdx, sx] of [-1, 1].entries()) {
        const rib = makeSplineLoftGeometry(
          [
            [0, ry, -0.11 * bulk],
            [sx * 0.19 * bulk, ry + 0.01, 0],
            [sx * 0.03 * bulk, ry - 0.008, 0.14 * bulk],
          ],
          [0.016, 0.02, 0.013],
          8,
          8,
          { colorHex: spec.skinColor }
        );
        chestParts.push(tagPart(rib, `skel_rib3_${rIdx}_${sIdx}`, 'bone_ivory', spec.skinColor));
      }
    }
  } else if (id === 'monster.gargoyle') {
    const gargSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const torso = sdEllipsoid(x, y, z, 0, spine3Len * 0.52, 0.01, 0.22 * bulk, spine3Len * 0.54, 0.14 * bulk);
        const pecL = sdEllipsoid(x, y, z, 0.09 * bulk, spine3Len * 0.62, 0.09 * bulk, 0.095 * bulk, 0.07, 0.07 * bulk);
        const pecR = sdEllipsoid(x, y, z, -0.09 * bulk, spine3Len * 0.62, 0.09 * bulk, 0.095 * bulk, 0.07, 0.07 * bulk);
        return sminPoly(torso, Math.min(pecL, pecR), 0.03);
      },
      [-0.26 * bulk, 0.01, -0.16 * bulk],
      [0.26 * bulk, spine3Len * 1.05, 0.2 * bulk],
      22,
      spec.skinColor,
      { flatShaded: false }
    );
    chestParts.push(tagPart(gargSdf, 'gargoyle_chest_sdf', 'stone_masonry', spec.skinColor));
    // Sculpted stone bat wings on gargoyle
    for (const [wIdx, sx] of [-1, 1].entries()) {
      const wingArm = makeSplineLoftGeometry(
        [
          [sx * 0.12 * bulk, spine3Len * 0.68, -0.1 * bulk],
          [sx * 0.42 * bulk, spine3Len * 1.15, -0.18 * bulk],
          [sx * 0.72 * bulk, spine3Len * 0.92, -0.26 * bulk],
        ],
        [0.045, 0.032, 0.014],
        10,
        12,
        { colorHex: spec.skinColor }
      );
      const wingWeb = makePleatedTabardGeometry(0.42, 0.56, 0.48, 0.026, 3, spec.armorColor, {
        flareZ: -0.04,
      });
      wingWeb.rotateZ(sx * -0.45);
      wingWeb.rotateY(sx * 0.35);
      wingWeb.translate(sx * 0.4 * bulk, spine3Len * 0.65, -0.2 * bulk);
      chestParts.push(
        tagPart(wingArm, `gargoyle_wing_arm_${wIdx}`, 'stone_masonry', spec.skinColor),
        tagPart(wingWeb, `gargoyle_wing_web_${wIdx}`, 'stone_masonry', spec.armorColor)
      );
    }
  } else if (isGolem) {
    const golemSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const core = sdEllipsoid(x, y, z, 0, spine3Len * 0.54, 0, 0.24 * bulk, spine3Len * 0.58, 0.16 * bulk);
        const cragL = sdCapsule(x, y, z, 0.12 * bulk, spine3Len * 0.6, 0, 0.24 * bulk, spine3Len * 0.95, -0.02, 0.09 * bulk);
        const cragR = sdCapsule(x, y, z, -0.12 * bulk, spine3Len * 0.6, 0, -0.24 * bulk, spine3Len * 0.95, -0.02, 0.09 * bulk);
        return sminPoly(core, Math.min(cragL, cragR), 0.035);
      },
      [-0.32 * bulk, 0.01, -0.2 * bulk],
      [0.32 * bulk, spine3Len * 1.1, 0.2 * bulk],
      22,
      spec.skinColor,
      { flatShaded: false }
    );
    chestParts.push(tagPart(golemSdf, 'golem_torso_sdf', 'stone_masonry', spec.skinColor));
    for (const [cIdx, [cx, cy, cz, rx]] of [
      [-0.18, 0.95, -0.06, -0.45],
      [0.18, 0.95, -0.06, 0.45],
      [0, 0.58, 0.17, 0.0],
    ].entries()) {
      const shard = prepareColoredPart(new THREE.ConeGeometry(0.055 * bulk, 0.22 * bulk, 5), spec.accentColor);
      shard.rotateZ(-rx);
      if (cIdx === 2) shard.rotateX(Math.PI * 0.5);
      shard.translate(cx * bulk, spine3Len * cy, cz * bulk);
      chestParts.push(tagPart(shard, `golem_chest_crystal_${cIdx}`, 'runic_glow', spec.accentColor));
    }
  } else if (id === 'monster.dark_cultist') {
    const mantle = makeLatheProfile(
      [
        [0.16 * bulk, spine3Len * 0.68],
        [0.24 * bulk, spine3Len * 0.82],
        [0.15 * bulk, spine3Len * 0.96],
      ],
      14,
      spec.trimColor,
      { smoothRadialNormals: true }
    );
    const sigil = prepareColoredPart(new THREE.OctahedronGeometry(0.058, 1), spec.accentColor);
    sigil.translate(0, spine3Len * 0.54, 0.15 * bulk);
    chestParts.push(
      tagPart(mantle, 'cultist_mantle', 'woven_cloth', spec.trimColor),
      tagPart(sigil, 'cultist_sigil', 'runic_glow', spec.accentColor, { lockVertical: false })
    );
  } else if (isBossDemon) {
    // Broad sculpted demonic upper-chest musculature, trapezius yoke, lats & scapular wing mounts
    const demonSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const lats = sdEllipsoid(
          x,
          y,
          z,
          0,
          spine3Len * 0.6,
          -0.015 * bulk,
          0.295 * bulk,
          spine3Len * 0.52,
          0.145 * bulk
        );
        const trapL = sdCapsule(
          x,
          y,
          z,
          0.07 * bulk,
          spine3Len * 0.98,
          -0.02,
          0.275 * bulk,
          spine3Len * 0.82,
          -0.02,
          0.088 * bulk
        );
        const trapR = sdCapsule(
          x,
          y,
          z,
          -0.07 * bulk,
          spine3Len * 0.98,
          -0.02,
          -0.275 * bulk,
          spine3Len * 0.82,
          -0.02,
          0.088 * bulk
        );
        const pecL = sdEllipsoid(
          x,
          y,
          z,
          0.125 * bulk,
          spine3Len * 0.66,
          0.105 * bulk,
          0.115 * bulk,
          0.082,
          0.078 * bulk
        );
        const pecR = sdEllipsoid(
          x,
          y,
          z,
          -0.125 * bulk,
          spine3Len * 0.66,
          0.105 * bulk,
          0.115 * bulk,
          0.082,
          0.078 * bulk
        );
        const dorsalRidge = sdEllipsoid(
          x,
          y,
          z,
          0,
          spine3Len * 0.64,
          -0.125 * bulk,
          0.125 * bulk,
          spine3Len * 0.46,
          0.085 * bulk
        );
        return sminPoly(
          sminPoly(sminPoly(lats, Math.min(trapL, trapR), 0.036), Math.min(pecL, pecR), 0.032),
          dorsalRidge,
          0.03
        );
      },
      [-0.38 * bulk, 0.0, -0.22 * bulk],
      [0.38 * bulk, spine3Len * 1.12, 0.22 * bulk],
      26,
      spec.skinColor,
      { flatShaded: false }
    );
    // High spiked obsidian gorget collar framing the smaller proportional head
    const gorget = makeLatheProfile(
      [
        [0.16 * bulk, spine3Len * 0.82],
        [0.23 * bulk, spine3Len * 0.94],
        [0.19 * bulk, spine3Len * 1.06],
      ],
      18,
      spec.armorColor,
      { smoothRadialNormals: true }
    );
    // Sculpted obsidian pectoral chestplate ribs + glowing molten heart core
    const runeCore = prepareColoredPart(new THREE.OctahedronGeometry(0.068, 1), spec.accentColor);
    runeCore.scale(0.85, 1.3, 0.65);
    runeCore.translate(0, spine3Len * 0.62, 0.195 * bulk);
    chestParts.push(
      tagPart(demonSdf, 'demon_carapace_sdf', 'demon_hide', spec.skinColor, {
        accentHex: spec.trimColor,
        lockVertical: false,
      }),
      tagPart(gorget, 'demon_gorget', 'magma_obsidian', spec.armorColor, {
        accentHex: spec.accentColor,
      }),
      tagPart(runeCore, 'demon_chest_rune', 'runic_glow', spec.accentColor, {
        accentHex: '#ffd541',
        lockVertical: false,
      })
    );
    for (const [bIdx, sx] of [-1, 1].entries()) {
      const chestPlateArch = makeSplineLoftGeometry(
        [
          [sx * 0.04 * bulk, spine3Len * 0.44, 0.185 * bulk],
          [sx * 0.17 * bulk, spine3Len * 0.64, 0.17 * bulk],
          [sx * 0.25 * bulk, spine3Len * 0.86, 0.06 * bulk],
        ],
        [
          [0.026 * bulk, 0.018 * bulk],
          [0.036 * bulk, 0.024 * bulk],
          [0.028 * bulk, 0.02 * bulk],
        ],
        8,
        10,
        { colorHex: spec.armorColor }
      );
      const dorsalHorn = makeCurvedHornGeometry(
        8,
        0.038,
        0.007,
        0.24,
        sx * 0.055,
        -0.11,
        8,
        '#d8be84'
      );
      dorsalHorn.rotateX(-0.56);
      dorsalHorn.translate(sx * 0.105 * bulk, spine3Len * 0.72, -0.145 * bulk);

      const wingCollar = makeSplineLoftGeometry(
        [
          [sx * 0.055 * bulk, spine3Len * 0.56, -0.135 * bulk],
          [sx * 0.115 * bulk, spine3Len * 0.64, -0.175 * bulk],
        ],
        [0.078, 0.064],
        10,
        6,
        { colorHex: spec.skinColor }
      );
      chestParts.push(
        tagPart(chestPlateArch, `demon_chest_arch_${bIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(dorsalHorn, `demon_dorsal_spike_${bIdx}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        }),
        tagPart(wingCollar, `demon_wing_collar_${bIdx}`, 'demon_hide', spec.skinColor, {
          lockVertical: false,
        })
      );
    }
  } else if (isBoss) {
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
      26,
      spec.skinColor,
      { flatShaded: false }
    );
    const gorget = makeLatheProfile(
      [
        [0.14 * bulk, spine3Len * 0.78],
        [0.19 * bulk, spine3Len * 0.88],
        [0.14 * bulk, spine3Len * 0.96],
      ],
      16,
      spec.trimColor,
      { smoothRadialNormals: true }
    );
    const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.072, 1), spec.accentColor);
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
        8,
        0.04,
        0.008,
        0.24,
        sx * 0.04,
        -0.09,
        8,
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

  if (isBossDemon) {
    // Imposing articulated demonic bat wings attached to spine_03
    const lerp3 = (
      a: readonly [number, number, number],
      b: readonly [number, number, number],
      t: number
    ): [number, number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    for (const [wIdx, sx] of [-1, 1].entries()) {
      const side = sx > 0 ? 'l' : 'r';
      const wRoot: [number, number, number] = [sx * 0.1 * bulk, spine3Len * 0.62, -0.15 * bulk];
      const wElbow: [number, number, number] = [sx * 0.36, spine3Len * 0.92, -0.34];
      const wWrist: [number, number, number] = [sx * 0.72, spine3Len + 0.27, -0.26];

      const f1Mid: [number, number, number] = [sx * 0.98, spine3Len + 0.29, -0.38];
      const f1End: [number, number, number] = [sx * 1.24, spine3Len + 0.08, -0.56];
      const f2Mid: [number, number, number] = [sx * 0.94, spine3Len + 0.02, -0.44];
      const f2End: [number, number, number] = [sx * 1.12, spine3Len - 0.28, -0.62];
      const f3Mid: [number, number, number] = [sx * 0.76, spine3Len - 0.18, -0.46];
      const f3End: [number, number, number] = [sx * 0.82, spine3Len - 0.56, -0.62];
      const f4Mid: [number, number, number] = [sx * 0.52, spine3Len - 0.28, -0.44];
      const f4End: [number, number, number] = [sx * 0.48, spine3Len - 0.64, -0.56];

      const armSpar = makeSplineLoftGeometry(
        [wRoot, wElbow, wWrist],
        [0.068, 0.052, 0.038],
        10,
        12,
        { colorHex: spec.armorColor }
      );
      const thumbClaw = makeCurvedHornGeometry(
        7,
        0.032,
        0.005,
        0.18,
        sx * 0.04,
        0.08,
        8,
        '#d8be84'
      );
      thumbClaw.rotateX(0.35);
      thumbClaw.translate(wWrist[0], wWrist[1], wWrist[2]);

      const finger1 = makeSplineLoftGeometry([wWrist, f1Mid, f1End], [0.036, 0.024, 0.008], 8, 10, {
        colorHex: spec.armorColor,
      });
      const finger2 = makeSplineLoftGeometry([wWrist, f2Mid, f2End], [0.028, 0.018, 0.007], 7, 10, {
        colorHex: spec.armorColor,
      });
      const finger3 = makeSplineLoftGeometry([wWrist, f3Mid, f3End], [0.026, 0.016, 0.006], 7, 10, {
        colorHex: spec.armorColor,
      });
      const finger4 = makeSplineLoftGeometry([wWrist, f4Mid, f4End], [0.024, 0.015, 0.006], 7, 10, {
        colorHex: spec.armorColor,
      });

      const memHex = '#3b0d18';
      const innerTrailA: [number, number, number] = [sx * 0.11, spine3Len - 0.42, -0.22];
      const innerTrailB: [number, number, number] = [sx * 0.36, spine3Len - 0.54, -0.46];
      const bayFlank = makeBossWingMembraneGrid(
        wRoot,
        wElbow,
        innerTrailA,
        innerTrailB,
        6,
        5,
        0.05,
        0.06,
        0.025,
        memHex
      );
      const bayArm = makeBossWingMembraneGrid(
        wElbow,
        wWrist,
        innerTrailB,
        f4End,
        6,
        5,
        0.06,
        0.08,
        0.035,
        memHex
      );
      const bay43 = makeBossWingMembraneGrid(
        lerp3(wWrist, f4End, 0.1),
        lerp3(wWrist, f3End, 0.1),
        f4End,
        f3End,
        6,
        5,
        0.045,
        0.075,
        0.032,
        memHex
      );
      const bay32 = makeBossWingMembraneGrid(
        lerp3(wWrist, f3End, 0.1),
        lerp3(wWrist, f2End, 0.1),
        f3End,
        f2End,
        6,
        5,
        0.045,
        0.08,
        0.035,
        memHex
      );
      const bay21 = makeBossWingMembraneGrid(
        lerp3(wWrist, f2End, 0.1),
        lerp3(wWrist, f1End, 0.1),
        f2End,
        f1End,
        6,
        5,
        0.04,
        0.075,
        0.032,
        memHex
      );

      addBakedBone(`Monster_Wing_${side}`, 'spine_03', [
        tagPart(armSpar, `demon_wing_arm_${wIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(thumbClaw, `demon_wing_thumb_${wIdx}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        }),
        tagPart(finger1, `demon_wing_f1_${wIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(finger2, `demon_wing_f2_${wIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(finger3, `demon_wing_f3_${wIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(finger4, `demon_wing_f4_${wIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(bayFlank, `demon_wing_mem_flank_${wIdx}`, 'wing_membrane', memHex, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(bayArm, `demon_wing_mem_arm_${wIdx}`, 'wing_membrane', memHex, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(bay43, `demon_wing_mem_43_${wIdx}`, 'wing_membrane', memHex, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(bay32, `demon_wing_mem_32_${wIdx}`, 'wing_membrane', memHex, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(bay21, `demon_wing_mem_21_${wIdx}`, 'wing_membrane', memHex, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
      ]);
    }
  }

  addBakedBone('Monster_Neck', 'neck_01', [
    tagPart(
      makeSculptedLimbGeometry(
        neckLen * (isBossDemon ? 1.15 : 1.1),
        (isSkeleton ? 0.036 : isBossDemon ? 0.088 : 0.058) * bulk,
        (isSkeleton ? 0.036 : isBossDemon ? 0.084 : 0.058) * bulk,
        (isSkeleton ? 0.032 : isBossDemon ? 0.064 : 0.055) * bulk,
        (isSkeleton ? 0.032 : isBossDemon ? 0.062 : 0.055) * bulk,
        { profile: 'taper', radialSegs: 14, heightSegs: 4, hexColor: spec.skinColor }
      ),
      'm_neck',
      skinRecipe,
      spec.skinColor
    ),
  ]);

  // Head + Monster Silhouettes (sculpted cranium preserving semantic head_front eyes)
  const headScale = isGoblin ? 1.24 : bulk;
  const rawSkull = isBossDemon
    ? makeBeveledBox(0.155, 0.175, 0.17, 0.032, spec.skinColor, {
        offset: [0, 0.098, 0],
      })
    : makeBeveledBox(0.22 * headScale, 0.22 * headScale, 0.22 * headScale, 0.036 * headScale, spec.skinColor, {
        offset: [0, 0.11 * headScale, 0],
      });
  const sculptedSkull = subdivideGeometryLoop(rawSkull, 1, { defaultHex: spec.skinColor });
  rawSkull.dispose();
  const headParts: TaggedGeometryPart[] = [
    tagPart(
      sculptedSkull,
      'm_skull',
      skinRecipe,
      spec.skinColor,
      { landmarkKind: 'head_front', lockVertical: true }
    ),
  ];

  if (isSkeleton) {
    const jaw = subdivideGeometryLoop(
      makeBeveledBox(0.14 * bulk, 0.065 * bulk, 0.14 * bulk, 0.014 * bulk, spec.skinColor, {
        offset: [0, 0.03 * bulk, 0.045 * bulk],
      }),
      1,
      { defaultHex: spec.skinColor }
    );
    headParts.push(tagPart(jaw, 'skeleton_jaw', 'bone_ivory', spec.skinColor));
    if (id === 'monster.skeleton_warrior') {
      const helm = makeLatheProfile(
        [
          [0.13 * bulk, 0.14 * bulk],
          [0.14 * bulk, 0.19 * bulk],
          [0.09 * bulk, 0.24 * bulk],
          [0.01 * bulk, 0.255 * bulk],
        ],
        12,
        spec.armorColor,
        { smoothRadialNormals: true }
      );
      headParts.push(tagPart(helm, 'skeleton_helm', 'forged_steel', spec.armorColor));
    }
  } else if (isGoblin) {
    for (const [eIdx, sx] of [-1, 1].entries()) {
      const ear = makeCurvedHornGeometry(
        6,
        0.045,
        0.006,
        0.19,
        sx * 0.03,
        -0.02,
        8,
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
          subdivideGeometryLoop(
            makeBeveledBox(0.26 * headScale, 0.13, 0.26 * headScale, 0.024, spec.armorColor, {
              offset: [0, 0.21 * headScale, -0.01],
            }),
            1,
            { defaultHex: spec.armorColor }
          ),
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
        14,
        spec.armorColor,
        { smoothRadialNormals: true }
      );
      headParts.push(tagPart(helm, 'goblin_kettle_helm', 'forged_steel', spec.armorColor));
    } else if (id === 'orcs.goblin_02') {
      headParts.push(
        tagPart(
          makeLatheProfile(
            [
              [0.12 * headScale, 0.19 * headScale],
              [0.14 * headScale, 0.22 * headScale],
              [0.12 * headScale, 0.25 * headScale],
            ],
            12,
            spec.trimColor,
            { smoothRadialNormals: true }
          ),
          'shaman_bone_crown',
          'bone_ivory',
          spec.trimColor
        )
      );
      for (const [hIdx, sx] of [-1, 1].entries()) {
        const tuskHorn = makeCurvedHornGeometry(6, 0.032, 0.007, 0.15, sx * 0.03, 0.02, 7, '#dae0ea');
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
        subdivideGeometryLoop(
          makeBeveledBox(0.26 * bulk, 0.09, 0.18 * bulk, 0.018, spec.skinColor, {
            offset: [0, 0.05, 0.055],
          }),
          1,
          { defaultHex: spec.skinColor }
        ),
        'orc_jaw',
        'orc_hide',
        spec.skinColor
      ),
      tagPart(
        makeLatheProfile(
          [
            [0.12 * bulk, 0.18 * bulk],
            [0.138 * bulk, 0.21 * bulk],
            [0.12 * bulk, 0.24 * bulk],
          ],
          14,
          spec.trimColor,
          { smoothRadialNormals: true }
        ),
        'orc_brow_band',
        'forged_steel',
        spec.trimColor
      )
    );
    for (const [tIdx, sx] of [-1, 1].entries()) {
      const tusk = makeCurvedHornGeometry(6, 0.024, 0.005, 0.095, sx * 0.01, 0.025, 7, '#dae0ea');
      tusk.translate(sx * 0.08 * bulk, 0.075, 0.125 * bulk);
      headParts.push(
        tagPart(tusk, `orc_tusk_${tIdx}`, 'bone_ivory', '#dae0ea', { lockVertical: false })
      );
    }
  } else if (isGolem) {
    for (const [cIdx, sx] of [-0.07, 0, 0.07].entries()) {
      const spire = prepareColoredPart(
        new THREE.ConeGeometry(0.045 * bulk, (cIdx === 1 ? 0.24 : 0.16) * bulk, 6),
        spec.accentColor
      );
      spire.rotateZ(-sx * 2.2);
      spire.translate(sx * bulk, 0.26 * bulk, -0.02);
      headParts.push(tagPart(spire, `golem_crystal_${cIdx}`, 'runic_glow', spec.accentColor));
    }
  } else if (id === 'monster.dark_cultist') {
    headParts.push(
      tagPart(
        subdivideGeometryLoop(
          makeBeveledBox(0.25 * bulk, 0.24 * bulk, 0.26 * bulk, 0.032, spec.armorColor, {
            offset: [0, 0.13 * bulk, -0.02],
          }),
          1,
          { defaultHex: spec.armorColor }
        ),
        'cultist_hood',
        'woven_cloth',
        spec.armorColor,
        { accentHex: spec.accentColor }
      ),
      tagPart(
        makeSplineLoftGeometry(
          [
            [-0.12 * bulk, 0.06 * bulk, 0.08 * bulk],
            [0, 0.23 * bulk, 0.13 * bulk],
            [0.12 * bulk, 0.06 * bulk, 0.08 * bulk],
          ],
          [0.022, 0.028, 0.022],
          8,
          10,
          { colorHex: spec.trimColor }
        ),
        'cultist_hood_trim',
        'woven_cloth',
        spec.trimColor
      )
    );
  } else if (id === 'monster.lizardman') {
    const snout = makeSplineLoftGeometry(
      [
        [0, 0.09 * bulk, 0.06 * bulk],
        [0, 0.08 * bulk, 0.18 * bulk],
        [0, 0.07 * bulk, 0.26 * bulk],
      ],
      [
        [0.08 * bulk, 0.06 * bulk],
        [0.065 * bulk, 0.048 * bulk],
        [0.04 * bulk, 0.035 * bulk],
      ],
      10,
      10,
      { colorHex: spec.skinColor }
    );
    headParts.push(
      tagPart(snout, 'lizard_snout', 'orc_hide', spec.skinColor),
      tagPart(
        makeCurvedHornGeometry(6, 0.028 * bulk, 0.006 * bulk, 0.16 * bulk, 0, -0.1, 6, spec.trimColor),
        'lizard_crest',
        'bone_ivory',
        spec.trimColor,
        { lockVertical: false }
      )
    );
  } else if (isBossDemon) {
    // Proportional menacing demon head: angular jaw, heavy brow ridges, fangs, obsidian helm crest & swept horns
    const demonJaw = subdivideGeometryLoop(
      makeBeveledBox(0.125, 0.068, 0.145, 0.015, spec.skinColor, {
        offset: [0, 0.032, 0.044],
      }),
      1,
      { defaultHex: spec.skinColor }
    );
    const obsidianCrest = makeSplineLoftGeometry(
      [
        [0, 0.168, 0.068],
        [0, 0.198, -0.015],
        [0, 0.175, -0.105],
      ],
      [
        [0.026, 0.016],
        [0.036, 0.024],
        [0.02, 0.016],
      ],
      10,
      10,
      { colorHex: spec.armorColor }
    );
    headParts.push(
      tagPart(demonJaw, 'demon_jaw', 'demon_hide', spec.skinColor, { lockVertical: false }),
      tagPart(obsidianCrest, 'demon_obsidian_crest', 'magma_obsidian', spec.armorColor, {
        accentHex: spec.accentColor,
        lockVertical: false,
      })
    );
    for (const [hIdx, sx] of [-1, 1].entries()) {
      const browRidge = makeSplineLoftGeometry(
        [
          [0, 0.116, 0.092],
          [sx * 0.052, 0.132, 0.094],
          [sx * 0.092, 0.152, 0.064],
        ],
        [0.014, 0.02, 0.014],
        8,
        8,
        { colorHex: spec.skinColor }
      );
      const cheekRidge = makeSplineLoftGeometry(
        [
          [sx * 0.068, 0.064, 0.074],
          [sx * 0.086, 0.095, 0.025],
        ],
        [0.015, 0.018],
        7,
        6,
        { colorHex: spec.skinColor }
      );
      const fang = makeCurvedHornGeometry(6, 0.012, 0.002, 0.052, sx * 0.006, 0.012, 6, '#e8dcc0');
      fang.rotateX(-0.18);
      fang.translate(sx * 0.036, 0.042, 0.104);

      const hornCollar = makeLatheProfile(
        [
          [0.052, 0],
          [0.058, 0.025],
          [0.046, 0.045],
        ],
        10,
        spec.armorColor,
        { smoothRadialNormals: true }
      );
      hornCollar.rotateZ(sx * -0.76);
      hornCollar.rotateX(-0.54);
      hornCollar.translate(sx * 0.07, 0.152, 0.018);

      const greatHorn = makeCurvedHornGeometry(
        12,
        0.042,
        0.006,
        0.38,
        sx * 0.15,
        -0.22,
        10,
        '#d8be84'
      );
      greatHorn.rotateZ(sx * -0.76);
      greatHorn.rotateX(-0.54);
      greatHorn.translate(sx * 0.072, 0.154, 0.016);

      headParts.push(
        tagPart(browRidge, `demon_ridge_${hIdx}`, 'demon_hide', spec.skinColor, {
          lockVertical: false,
        }),
        tagPart(cheekRidge, `demon_cheek_${hIdx}`, 'demon_hide', spec.skinColor, {
          lockVertical: false,
        }),
        tagPart(fang, `demon_fang_${hIdx}`, 'bone_ivory', '#e8dcc0', {
          lockVertical: false,
        }),
        tagPart(hornCollar, `demon_horn_collar_${hIdx}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
        tagPart(greatHorn, `demon_great_horn_${hIdx}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        })
      );
    }
  } else if (isBoss || id === 'monster.gargoyle') {
    headParts.push(
      tagPart(
        makeLatheProfile(
          [
            [0.13 * bulk, 0.17 * bulk],
            [0.155 * bulk, 0.21 * bulk],
            [0.12 * bulk, 0.25 * bulk],
          ],
          14,
          spec.armorColor,
          { smoothRadialNormals: true }
        ),
        'demon_crown_brow',
        'magma_obsidian',
        spec.armorColor,
        { accentHex: spec.accentColor }
      )
    );
    if (id === 'monster.gargoyle') {
      const gargSnout = makeSplineLoftGeometry(
        [
          [0, 0.08 * bulk, 0.06 * bulk],
          [0, 0.07 * bulk, 0.19 * bulk],
        ],
        [
          [0.075 * bulk, 0.055 * bulk],
          [0.05 * bulk, 0.04 * bulk],
        ],
        10,
        8,
        { colorHex: spec.skinColor }
      );
      headParts.push(tagPart(gargSnout, 'gargoyle_snout', 'stone_masonry', spec.skinColor));
    }
    const hornHex = id === 'boss.dread_knight' ? spec.trimColor : id === 'monster.gargoyle' ? spec.skinColor : '#ffd541';
    for (const [hIdx, sx] of [-1, 1].entries()) {
      const horn = makeCurvedHornGeometry(
        10,
        0.066,
        0.01,
        0.46,
        sx * 0.14,
        -0.1,
        10,
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
  const limbRadScale = isSkeleton ? 0.56 : 1.0;
  for (const side of ['l', 'r'] as const) {
    const uParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          uArm * (isBossDemon ? 0.98 : 0.96),
          (isBossDemon ? 0.084 : 0.068) * bulk * limbRadScale,
          (isBossDemon ? 0.084 : 0.068) * bulk * limbRadScale,
          (isBossDemon ? 0.068 : 0.056) * bulk * limbRadScale,
          (isBossDemon ? 0.068 : 0.056) * bulk * limbRadScale,
          {
            profile: isSkeleton ? 'taper' : 'bicep',
            radialSegs: isBossDemon ? 16 : 14,
            heightSegs: isBossDemon ? 7 : 6,
            hexColor: spec.skinColor,
          }
        ),
        `m_ua_${side}`,
        skinRecipe,
        spec.skinColor
      ),
    ];
    if (isBossDemon) {
      // Broad properly-oriented obsidian shoulder pauldrons + twin swept shoulder horns
      const pScale = 1.24 * bulk;
      const pauldron = makePauldronShellGeometry(
        0.26 * pScale,
        0.2 * pScale,
        0.28 * pScale,
        0.045,
        spec.armorColor
      );
      if (side === 'l') {
        pauldron.rotateZ(Math.PI * 0.5);
        pauldron.translate(-0.045 * bulk, 0.045, 0);
      } else {
        pauldron.rotateY(Math.PI);
        pauldron.rotateZ(-Math.PI * 0.5);
        pauldron.translate(0.045 * bulk, 0.045, 0);
      }
      uParts.push(
        tagPart(pauldron, `m_pauldron_${side}`, armorRecipe, spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );

      const mainHorn = makeCurvedHornGeometry(
        8,
        0.044,
        0.007,
        0.26,
        0,
        -0.06,
        8,
        '#d8be84'
      );
      mainHorn.rotateZ(side === 'l' ? 0.92 : -0.92);
      mainHorn.translate(side === 'l' ? -0.095 * bulk : 0.095 * bulk, 0.06, 0);

      const outerSpur = makeCurvedHornGeometry(
        6,
        0.028,
        0.005,
        0.15,
        0,
        -0.03,
        7,
        spec.accentColor
      );
      outerSpur.rotateZ(side === 'l' ? 0.55 : -0.55);
      outerSpur.translate(side === 'l' ? -0.055 * bulk : 0.055 * bulk, 0.13, -0.03);

      uParts.push(
        tagPart(mainHorn, `demon_pauldron_horn_${side}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        }),
        tagPart(outerSpur, `demon_pauldron_spur_${side}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );
    } else if (id === 'orcs.orc_04' || id === 'orcs.goblin_06' || isBoss || id === 'monster.crystal_golem') {
      const pScale = isBoss ? 1.05 * bulk : id === 'orcs.orc_04' ? 0.82 * bulk : id === 'monster.crystal_golem' ? 0.95 * bulk : 0.64 * bulk;
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
      if (isBoss || id === 'orcs.orc_04' || id === 'monster.crystal_golem') {
        const pSpike = makeCurvedHornGeometry(
          6,
          0.042,
          0.008,
          isBoss ? 0.21 : 0.14,
          side === 'l' ? 0.04 : -0.04,
          0.01,
          8,
          spec.accentColor
        );
        pSpike.rotateZ(side === 'l' ? -0.78 : 0.78);
        pSpike.translate(side === 'l' ? 0.08 * bulk : -0.08 * bulk, 0.055, 0);
        uParts.push(
          tagPart(
            pSpike,
            `demon_pauldron_horn_${side}`,
            id === 'monster.crystal_golem' ? 'runic_glow' : 'bone_ivory',
            spec.accentColor,
            { lockVertical: false }
          )
        );
      }
    }
    addBakedBone(`Monster_UA_${side}`, `upperarm_${side}`, uParts);

    const laParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          lArm * (isBossDemon ? 0.98 : 0.96),
          (isBossDemon ? 0.072 : 0.058) * bulk * limbRadScale,
          (isBossDemon ? 0.072 : 0.058) * bulk * limbRadScale,
          (isBossDemon ? 0.056 : 0.048) * bulk * limbRadScale,
          (isBossDemon ? 0.056 : 0.048) * bulk * limbRadScale,
          {
            profile: isBoss || isGolem ? 'armor_limb' : 'forearm',
            radialSegs: isBossDemon ? 16 : 14,
            heightSegs: isBossDemon ? 7 : 6,
            hexColor: spec.armorColor,
          }
        ),
        `m_la_${side}`,
        isSkeleton ? 'bone_ivory' : armorRecipe,
        isSkeleton ? spec.skinColor : spec.armorColor,
        { accentHex: spec.accentColor }
      ),
    ];
    if (isBossDemon) {
      // Flared elbow spike + clawed forearm fin
      const elbowSpike = makeCurvedHornGeometry(
        7,
        0.032,
        0.005,
        0.18,
        0,
        -0.02,
        7,
        spec.armorColor
      );
      elbowSpike.rotateX(-Math.PI * 0.58);
      elbowSpike.translate(0, 0.03, -0.062 * bulk);
      laParts.push(
        tagPart(elbowSpike, `demon_elbow_spike_${side}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );
    }
    addBakedBone(`Monster_LA_${side}`, `lowerarm_${side}`, laParts);

    const handParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          isBossDemon ? 0.13 : 0.115,
          (isBossDemon ? 0.058 : 0.05) * bulk * limbRadScale,
          (isBossDemon ? 0.052 : 0.046) * bulk * limbRadScale,
          (isBossDemon ? 0.05 : 0.044) * bulk * limbRadScale,
          (isBossDemon ? 0.044 : 0.04) * bulk * limbRadScale,
          {
            profile: isBossDemon ? 'armor_limb' : 'taper',
            radialSegs: 12,
            heightSegs: 4,
            hexColor: isBossDemon ? spec.armorColor : spec.skinColor,
          }
        ),
        `m_hand_${side}`,
        isBossDemon ? armorRecipe : skinRecipe,
        isBossDemon ? spec.armorColor : spec.skinColor,
        isBossDemon ? { accentHex: spec.accentColor } : undefined
      ),
    ];
    if (isBossDemon) {
      // 4 curved gauntlet claws + thumb claw
      for (const [cIdx, cz] of [-0.034, -0.011, 0.011, 0.034].entries()) {
        const claw = makeCurvedHornGeometry(5, 0.011, 0.002, 0.088, 0, 0.02, 6, '#d8be84');
        claw.rotateZ(side === 'l' ? -0.35 : 0.35);
        claw.translate(side === 'l' ? 0.012 : -0.012, 0.118, cz * bulk);
        handParts.push(
          tagPart(claw, `demon_hand_claw_${side}_${cIdx}`, 'bone_ivory', '#d8be84', {
            lockVertical: false,
          })
        );
      }
      const thumbClaw = makeCurvedHornGeometry(5, 0.012, 0.002, 0.075, 0, 0.015, 6, '#d8be84');
      thumbClaw.rotateX(0.42);
      thumbClaw.translate(side === 'l' ? 0.018 : -0.018, 0.068, 0.048 * bulk);
      handParts.push(
        tagPart(thumbClaw, `demon_thumb_claw_${side}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        })
      );
    }

    if (side === 'r') {
      if (id === 'orcs.goblin_01' || id === 'monster.skeleton_warrior') {
        const hilt = makeLatheProfile(
          [
            [0.02, -0.09],
            [0.02, 0.09],
          ],
          10,
          '#3b1725',
          { smoothRadialNormals: true }
        );
        hilt.rotateX(Math.PI * 0.5);
        const guard = makeSplineLoftGeometry(
          [
            [-0.1, 0, 0.09],
            [0, 0, 0.08],
            [0.1, 0, 0.09],
          ],
          [0.012, 0.018, 0.012],
          8,
          8,
          { colorHex: spec.trimColor }
        );
        const blade = makeSwordBladeGeometry(
          0.08,
          0.032,
          id === 'monster.skeleton_warrior' ? 0.54 : 0.3,
          0.14,
          '#b3b9d1'
        );
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, 0, 0.09);
        handParts.push(
          tagPart(hilt, 'goblin_dagger_hilt', 'stitched_leather', '#3b1725', { lockVertical: false }),
          tagPart(guard, 'mob_sw_guard', 'brushed_gold', spec.trimColor, { lockVertical: false }),
          tagPart(blade, 'goblin_scimitar', 'forged_steel', '#b3b9d1', { lockVertical: false })
        );
      } else if (id === 'orcs.goblin_03' || id === 'monster.skeleton_archer') {
        const shaft = makeLatheProfile(
          [
            [0.014, -0.26],
            [0.014, 0.26],
          ],
          8,
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
          12,
          '#73172d',
          { smoothRadialNormals: true }
        );
        club.rotateX(Math.PI * 0.5);
        club.translate(0, 0, 0.14);
        handParts.push(tagPart(club, 'goblin_club', 'wood_planks', '#73172d', { lockVertical: false }));
      } else if (id === 'orcs.goblin_02' || id === 'monster.dark_cultist') {
        const staff = makeLatheProfile(
          [
            [0.02, -0.68],
            [0.025, 0.68],
          ],
          10,
          '#3b1725',
          { smoothRadialNormals: true }
        );
        staff.rotateX(Math.PI * 0.5);
        staff.translate(0, 0, 0.38);
        const skullTotem = subdivideGeometryLoop(
          makeBeveledBox(0.14, 0.14, 0.14, 0.022, '#dae0ea', { offset: [0, 0, 1.1] }),
          1,
          { defaultHex: '#dae0ea' }
        );
        const orb = prepareColoredPart(new THREE.OctahedronGeometry(0.08, 1), spec.accentColor);
        orb.translate(0, 0.11, 1.1);
        handParts.push(
          tagPart(staff, 'shaman_staff', 'wood_planks', '#3b1725', { lockVertical: false }),
          tagPart(skullTotem, 'shaman_totem', 'bone_ivory', '#dae0ea', { lockVertical: false }),
          tagPart(orb, 'shaman_orb', 'runic_glow', spec.accentColor, { lockVertical: false })
        );
      } else if (id === 'orcs.orc_04') {
        const handle = makeLatheProfile(
          [
            [0.028, -0.32],
            [0.032, 0.32],
          ],
          10,
          '#3b1725',
          { smoothRadialNormals: true }
        );
        handle.rotateX(Math.PI * 0.5);
        handle.translate(0, 0, 0.22);
        const maul = subdivideGeometryLoop(
          makeBeveledBox(0.24, 0.22, 0.44, 0.028, '#6d758d', { offset: [0, 0, 0.64] }),
          1,
          { defaultHex: '#6d758d' }
        );
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
          12,
          '#141013',
          { smoothRadialNormals: true }
        );
        grip.rotateX(Math.PI * 0.5);
        grip.translate(0, 0, 0.08);
        const guard = makeSplineLoftGeometry(
          [
            [-0.22, 0, 0.32],
            [0, 0, 0.27],
            [0.22, 0, 0.32],
          ],
          [0.026, 0.042, 0.026],
          10,
          10,
          { colorHex: '#b4202a' }
        );
        const blade = id === 'boss.minotaur_warlord'
          ? makeAxeHeadGeometry(0.32, 0.44, 0.065, true, '#6d758d')
          : makeSwordBladeGeometry(0.18, 0.06, 1.15, 0.28, '#6d758d');
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, 0, id === 'boss.minotaur_warlord' ? 0.68 : 0.33);
        const core = makeSwordBladeGeometry(0.065, 0.068, 0.82, 0.18, spec.accentColor);
        core.rotateX(Math.PI * 0.5);
        core.translate(0, 0, 0.42);
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
          tagPart(core, 'demon_sword_rune', 'runic_glow', spec.accentColor, { lockVertical: false })
        );
      }
    } else if (side === 'l') {
      if (id === 'orcs.goblin_01') {
        const dBlade = makeSwordBladeGeometry(0.065, 0.028, 0.22, 0.1, '#b3b9d1');
        dBlade.rotateX(Math.PI * 0.5);
        dBlade.translate(0, 0, 0.06);
        handParts.push(tagPart(dBlade, 'goblin_offhand_blade', 'forged_steel', '#b3b9d1', { lockVertical: false }));
      } else if (id === 'orcs.goblin_03' || id === 'monster.skeleton_archer') {
        const bow = makeRecurveBowGeometry(0.86, 0.18, 0.036, spec.trimColor);
        bow.translate(0, 0.04, 0.14);
        handParts.push(tagPart(bow, 'goblin_bow', 'wood_planks', spec.trimColor, { lockVertical: false }));
      } else if (id === 'orcs.goblin_06' || id === 'monster.skeleton_warrior') {
        const shield = makeDomeShieldGeometry(0.46, 0.52, 0.055, spec.armorColor);
        shield.rotateY(Math.PI * 0.5);
        shield.translate(0.11, 0.04, 0.06);
        const boss = makeLatheProfile(
          [
            [0.075, 0],
            [0.06, 0.03],
            [0.015, 0.055],
          ],
          12,
          spec.trimColor,
          { smoothRadialNormals: true }
        );
        boss.rotateZ(-Math.PI * 0.5);
        boss.translate(0.14, 0.04, 0.06);
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
    const sx = side === 'l' ? 1 : -1;
    const thighParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          thigh * (isBossDemon ? 0.98 : 0.96),
          (isBossDemon ? 0.112 : 0.092) * bulk * limbRadScale,
          (isBossDemon ? 0.114 : 0.092) * bulk * limbRadScale,
          (isBossDemon ? 0.082 : 0.072) * bulk * limbRadScale,
          (isBossDemon ? 0.084 : 0.072) * bulk * limbRadScale,
          {
            profile: isSkeleton ? 'taper' : 'thigh',
            radialSegs: isBossDemon ? 16 : 14,
            heightSegs: isBossDemon ? 8 : 7,
            hexColor: spec.skinColor,
          }
        ),
        `m_thigh_${side}`,
        skinRecipe,
        spec.skinColor
      ),
    ];
    if (isBossDemon) {
      // Sculpted outer obsidian thigh armor cuisse
      const cuisse = makePauldronShellGeometry(
        0.15 * bulk,
        0.24 * bulk,
        0.22 * bulk,
        0.032,
        spec.armorColor
      );
      if (side === 'r') cuisse.rotateY(Math.PI);
      cuisse.translate(sx * 0.065 * bulk, thigh * 0.45, 0.01);
      thighParts.push(
        tagPart(cuisse, `demon_thigh_plate_${side}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        })
      );
    }
    addBakedBone(`Monster_Thigh_${side}`, `thigh_${side}`, thighParts);

    const calfParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          calf * (isBossDemon ? 0.98 : 0.96),
          (isBossDemon ? 0.082 : 0.072) * bulk * limbRadScale,
          (isBossDemon ? 0.086 : 0.072) * bulk * limbRadScale,
          (isBossDemon ? 0.05 : 0.058) * bulk * limbRadScale,
          (isBossDemon ? 0.054 : 0.058) * bulk * limbRadScale,
          {
            profile: isBoss || isGolem ? 'armor_limb' : isSkeleton ? 'taper' : 'calf',
            radialSegs: isBossDemon ? 16 : 14,
            heightSegs: isBossDemon ? 8 : 7,
            hexColor: spec.armorColor,
          }
        ),
        `m_calf_${side}`,
        isSkeleton ? 'bone_ivory' : armorRecipe,
        isSkeleton ? spec.skinColor : spec.armorColor,
        { accentHex: spec.accentColor }
      ),
    ];
    if (isBossDemon) {
      // Digitigrade-inspired backward hock tendon bulge + sharp knee & hock spurs
      const hockCurve = makeSplineLoftGeometry(
        [
          [0, calf * 0.1, 0.036 * bulk],
          [0, calf * 0.34, 0.088 * bulk],
          [0, calf * 0.76, 0.028 * bulk],
        ],
        [0.036 * bulk, 0.044 * bulk, 0.022 * bulk],
        8,
        10,
        { colorHex: spec.skinColor }
      );
      const kneeSpur = makeCurvedHornGeometry(6, 0.032, 0.005, 0.15, 0, -0.025, 8, '#d8be84');
      kneeSpur.rotateX(-Math.PI * 0.44);
      kneeSpur.translate(0, 0.045, -0.075 * bulk);
      const hockSpur = makeCurvedHornGeometry(6, 0.024, 0.004, 0.13, 0, 0.02, 8, '#d8be84');
      hockSpur.rotateX(Math.PI * 0.65);
      hockSpur.translate(0, calf * 0.34, 0.098 * bulk);
      calfParts.push(
        tagPart(hockCurve, `demon_digitigrade_hock_${side}`, 'demon_hide', spec.skinColor, {
          lockVertical: false,
        }),
        tagPart(kneeSpur, `demon_knee_spur_${side}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        }),
        tagPart(hockSpur, `demon_hock_spur_${side}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        })
      );
    }
    addBakedBone(`Monster_Calf_${side}`, `calf_${side}`, calfParts);

    if (isBossDemon) {
      const hoofBody = subdivideGeometryLoop(
        makeBeveledBox(0.125 * bulk, 0.21, 0.092 * bulk, 0.022, spec.armorColor, {
          offset: [0, 0.095, 0.01],
        }),
        1,
        { defaultHex: spec.armorColor }
      );
      const footParts: TaggedGeometryPart[] = [
        tagPart(hoofBody, `m_foot_${side}`, 'magma_obsidian', spec.armorColor, {
          accentHex: spec.accentColor,
          lockVertical: false,
        }),
      ];
      for (const [tIdx, tx] of [-0.038 * bulk, 0, 0.038 * bulk].entries()) {
        const talon = makeCurvedHornGeometry(6, 0.018, 0.003, 0.105, 0, 0.02, 6, '#d8be84');
        talon.translate(tx, 0.175, 0.015);
        footParts.push(
          tagPart(talon, `demon_foot_talon_${side}_${tIdx}`, 'bone_ivory', '#d8be84', {
            lockVertical: false,
          })
        );
      }
      const heelSpur = makeCurvedHornGeometry(5, 0.018, 0.003, 0.095, 0, 0, 6, '#d8be84');
      heelSpur.rotateX(Math.PI * 0.85);
      heelSpur.translate(0, 0.01, -0.02);
      footParts.push(
        tagPart(heelSpur, `demon_heel_spur_${side}`, 'bone_ivory', '#d8be84', {
          lockVertical: false,
        })
      );
      addBakedBone(`Monster_Foot_${side}`, `foot_${side}`, footParts);
    } else {
      addBakedBone(`Monster_Foot_${side}`, `foot_${side}`, [
        tagPart(
          makeSculptedLimbGeometry(
            0.185,
            0.062 * bulk,
            0.072 * bulk,
            0.054 * bulk,
            0.06 * bulk,
            { profile: 'taper', radialSegs: 12, heightSegs: 4, hexColor: '#141013' }
          ),
          `m_foot_${side}`,
          'stitched_leather',
          '#141013'
        ),
      ]);
    }
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

