import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
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
  makeDomeShieldGeometry,
  makeLatheProfile,
  makePauldronShellGeometry,
  makeRecurveBowGeometry,
  makeSwordBladeGeometry,
  tagPart,
  type FinishMode,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { prepareColoredPart } from './SdfVoxelPrimitives';

export type PlayerClassId = 'knight' | 'archer' | 'mage';
export type EquipSlot = 'helmet' | 'chest' | 'legs' | 'boots' | 'gloves' | 'weapon';
export type ItemRarity = 'normal' | 'common' | 'rare' | 'epic' | 'legendary';

export const PLAYER_CLASSES: readonly PlayerClassId[] = ['knight', 'archer', 'mage'];
export const EQUIP_SLOTS: readonly EquipSlot[] = [
  'helmet',
  'chest',
  'legs',
  'boots',
  'gloves',
  'weapon',
];
export const ITEM_RARITIES: readonly ItemRarity[] = [
  'normal',
  'common',
  'rare',
  'epic',
  'legendary',
];

export interface RarityPaletteSpec {
  id: ItemRarity;
  labelPt: string;
  primary: string;
  secondary: string;
  trim: string;
  glow: string;
  tierLevel: number;
}

export const RARITY_COLOR_TABLE: Record<ItemRarity, RarityPaletteSpec> = {
  normal: {
    id: 'normal',
    labelPt: 'Normal (Neutro)',
    primary: '#b3b9d1',
    secondary: '#6d758d',
    trim: '#dae0ea',
    glow: '#dae0ea',
    tierLevel: 1,
  },
  common: {
    id: 'common',
    labelPt: 'Comum (Verde)',
    primary: '#1a7a3e',
    secondary: '#24523b',
    trim: '#b3b9d1',
    glow: '#1a7a3e',
    tierLevel: 2,
  },
  rare: {
    id: 'rare',
    labelPt: 'Raro (Azul)',
    primary: '#285cc4',
    secondary: '#249fde',
    trim: '#dae0ea',
    glow: '#249fde',
    tierLevel: 3,
  },
  epic: {
    id: 'epic',
    labelPt: 'Épico (Roxo)',
    primary: '#4a3052',
    secondary: '#73172d',
    trim: '#b3b9d1',
    glow: '#df3e23',
    tierLevel: 4,
  },
  legendary: {
    id: 'legendary',
    labelPt: 'Lendário (Laranja)',
    primary: '#fa6a0a',
    secondary: '#f9a31b',
    trim: '#ffd541',
    glow: '#ffd541',
    tierLevel: 5,
  },
};

export interface EquipmentPieceDef {
  id: string;
  classId: PlayerClassId;
  slot: EquipSlot;
  rarity: ItemRarity;
  displayName: string;
}

export type EquipmentLoadout = Record<EquipSlot, ItemRarity>;

export interface PlayerCharacterInstance {
  name: string;
  classId: PlayerClassId;
  rig: CanonicalUalRig;
  root: THREE.Group;
  loadout: EquipmentLoadout;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  equipSlot: (slot: EquipSlot, rarity: ItemRarity) => EquipmentPieceDef;
  equipFullRaritySet: (rarity: ItemRarity) => void;
  setClass: (nextClass: PlayerClassId) => void;
  getEquippedDefs: () => EquipmentPieceDef[];
  dispose: () => void;
}

const NWL_HERO_SCALE = 1.79 / 1.829; // Exact 1.79m hero height = 108px at 60px/m

const SHELL_COLORS = {
  skin: '#e0a882',
  skinShadow: '#b87b56',
  undershirt: '#3b1725',
  undershirtDark: '#141013',
  hair: '#3b1725',
  eye: '#285cc4',
};

const CLASS_META: Record<
  PlayerClassId,
  {
    nwlId: string;
    labelPt: string;
    tabardBase: string;
    skinTone: string;
    weaponPt: string;
    helmetPt: string;
    chestPt: string;
    legsPt: string;
    bootsPt: string;
    glovesPt: string;
  }
> = {
  knight: {
    nwlId: 'classe.cavaleiro',
    labelPt: 'Cavaleiro',
    tabardBase: '#285cc4',
    skinTone: SHELL_COLORS.skin,
    weaponPt: 'Espada & Escudo',
    helmetPt: 'Elmo Fechado',
    chestPt: 'Peitoral de Placas',
    legsPt: 'Grevas de Coxa',
    bootsPt: 'Sabretas de Aço',
    glovesPt: 'Manoplas',
  },
  archer: {
    nwlId: 'classe.arqueiro',
    labelPt: 'Arqueiro',
    tabardBase: '#24523b',
    skinTone: SHELL_COLORS.skin,
    weaponPt: 'Arco Composto',
    helmetPt: 'Capuz / Chapéu de Caça',
    chestPt: 'Gibão & Aljava',
    legsPt: 'Calça Reforçada',
    bootsPt: 'Botas de Rastreador',
    glovesPt: 'Braçadeiras de Tiro',
  },
  mage: {
    nwlId: 'classe.mago',
    labelPt: 'Mago',
    tabardBase: '#4a3052',
    skinTone: '#e0a882',
    weaponPt: 'Cajado Rúnico & Foco',
    helmetPt: 'Chapéu Pontudo / Diadema',
    chestPt: 'Túnica Arcana',
    legsPt: 'Calça Rúnica',
    bootsPt: 'Botas Místicas',
    glovesPt: 'Punhos Arcanos',
  },
};

interface InternalFinishConfig {
  finishMode: FinishMode;
  materialSeed: number;
  aoStrength: number;
  normalStrength: number;
}

function getBoneSpanY(rig: CanonicalUalRig, boneName: string, fallback: number): number {
  const b = rig.boneByName.get(boneName);
  if (!b) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) {
      return ch.position.y;
    }
  }
  return fallback;
}

function disposePartsArray(parts: TaggedGeometryPart[]): void {
  for (const p of parts) {
    p.geometry.dispose();
  }
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
    smoothness: 0.25,
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

function disposeMaterialAndUnpooledTextures(mat: PixelizerMaterial): void {
  const opts = mat.options;
  const seen = new Set<THREE.Texture>();
  for (const tex of [opts.albedoMap, opts.normalMap, opts.emissionMap]) {
    if (tex && !seen.has(tex)) {
      seen.add(tex);
      if (tex.userData?.pooled !== true) {
        tex.dispose();
      }
    }
  }
  mat.dispose();
}

export function getEquipmentPieceDef(
  classId: PlayerClassId,
  slot: EquipSlot,
  rarity: ItemRarity
): EquipmentPieceDef {
  const cm = CLASS_META[classId];
  const rm = RARITY_COLOR_TABLE[rarity];
  const slotPt: Record<EquipSlot, string> = {
    helmet: cm.helmetPt,
    chest: cm.chestPt,
    legs: cm.legsPt,
    boots: cm.bootsPt,
    gloves: cm.glovesPt,
    weapon: cm.weaponPt,
  };
  return {
    id: `equip.${classId}.${slot}.${rarity}`,
    classId,
    slot,
    rarity,
    displayName: `${slotPt[slot]} [${rm.labelPt.split(' ')[0]}]`,
  };
}

/**
 * Generates all 90 modular item definitions (3 classes × 6 slots × 5 rarities).
 */
export function listAllPlayerEquipmentCatalog(): EquipmentPieceDef[] {
  const out: EquipmentPieceDef[] = [];
  for (const c of PLAYER_CLASSES) {
    for (const r of ITEM_RARITIES) {
      for (const s of EQUIP_SLOTS) {
        out.push(getEquipmentPieceDef(c, s, r));
      }
    }
  }
  return out;
}

/**
 * Builds the canonical 1.79m Player Base Shell onto the 65-bone UAL skeleton.
 * Uses beveled bone segments and textured `head_front` semantic eyes/brows (zero flat detail cuboids).
 */
function buildBaseShellSpecs(
  rig: CanonicalUalRig,
  cfg: InternalFinishConfig
): { specs: RigidPartSpec[]; headMetrics: UnwrapMetricsSummary } {
  const pelvisLen = getBoneSpanY(rig, 'pelvis', 0.138);
  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const neckLen = getBoneSpanY(rig, 'neck_01', 0.083);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

  const specs: RigidPartSpec[] = [];
  let headMetrics!: UnwrapMetricsSummary;

  const bakeShellBone = (
    name: string,
    boneName: string,
    parts: TaggedGeometryPart[],
    inspectUvs = false
  ) => {
    const baked = bakeTaggedPartsAsset(parts, {
      finishMode: cfg.finishMode,
      texelsPerMeter: 64,
      seed: cfg.materialSeed,
      aoRays: 10,
      aoMaxDist: 0.3,
      aoStrength: cfg.aoStrength,
      normalStrength: cfg.normalStrength,
      eyeHex: SHELL_COLORS.eye,
      browHex: SHELL_COLORS.hair,
      usePool: true,
      cacheKey: `nwl_shell:${name}`,
      inspectUvs,
    });
    disposePartsArray(parts);
    if (name === 'Shell_Head') {
      headMetrics = baked.unwrapMetrics;
    }
    specs.push({
      name,
      boneName,
      geometry: baked.geometry,
      materialOptions: bakedToMaterialOptions(baked, {
        smoothness: 0.18,
      }),
    });
  };

  bakeShellBone('Shell_Pelvis', 'pelvis', [
    tagPart(
      makeBeveledBoneSegmentBox(
        pelvisLen * 1.05,
        0.135,
        0.095,
        0.13,
        0.09,
        0.012,
        SHELL_COLORS.undershirtDark
      ),
      'shell_pelvis',
      'woven_cloth',
      SHELL_COLORS.undershirtDark
    ),
  ]);

  bakeShellBone('Shell_Spine1', 'spine_01', [
    tagPart(
      makeBeveledBoneSegmentBox(
        spine1Len * 1.05,
        0.125,
        0.088,
        0.135,
        0.092,
        0.012,
        SHELL_COLORS.undershirt
      ),
      'shell_spine1',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Spine2', 'spine_02', [
    tagPart(
      makeBeveledBoneSegmentBox(
        spine2Len * 1.06,
        0.138,
        0.095,
        0.152,
        0.105,
        0.013,
        SHELL_COLORS.undershirt
      ),
      'shell_spine2',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Spine3', 'spine_03', [
    tagPart(
      makeBeveledBoneSegmentBox(
        spine3Len * 0.9,
        0.155,
        0.105,
        0.165,
        0.11,
        0.014,
        SHELL_COLORS.undershirt
      ),
      'shell_spine3',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Neck', 'neck_01', [
    tagPart(
      makeBeveledBoneSegmentBox(neckLen * 1.1, 0.05, 0.05, 0.048, 0.048, 0.008, SHELL_COLORS.skinShadow),
      'shell_neck',
      'human_skin',
      SHELL_COLORS.skinShadow
    ),
  ]);

  // Head + textured semantic eyes/brows + beveled short hair (no protruding faceBand cuboid!)
  const headBox = makeBeveledBox(0.21, 0.23, 0.21, 0.02, SHELL_COLORS.skin, {
    offset: [0, 0.11, 0],
  });
  const hairCap = makeBeveledBox(0.22, 0.075, 0.22, 0.015, SHELL_COLORS.hair, {
    offset: [0, 0.2, -0.01],
  });
  bakeShellBone(
    'Shell_Head',
    'Head',
    [
      tagPart(headBox, 'shell_head', 'human_skin', SHELL_COLORS.skin, {
        landmarkKind: 'head_front',
        lockVertical: true,
      }),
      tagPart(hairCap, 'shell_hair', 'woven_cloth', SHELL_COLORS.hair, {
        lockVertical: true,
      }),
    ],
    true
  );

  for (const side of ['l', 'r'] as const) {
    bakeShellBone(`Shell_UpperArm_${side}`, `upperarm_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(uArm * 0.94, 0.054, 0.054, 0.046, 0.046, 0.009, SHELL_COLORS.undershirt),
        `shell_ua_${side}`,
        'woven_cloth',
        SHELL_COLORS.undershirt
      ),
    ]);
    bakeShellBone(`Shell_LowerArm_${side}`, `lowerarm_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(lArm * 0.94, 0.045, 0.045, 0.038, 0.038, 0.008, SHELL_COLORS.skinShadow),
        `shell_la_${side}`,
        'human_skin',
        SHELL_COLORS.skinShadow
      ),
    ]);
    bakeShellBone(`Shell_Hand_${side}`, `hand_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(0.1, 0.038, 0.035, 0.034, 0.03, 0.007, SHELL_COLORS.skin),
        `shell_hand_${side}`,
        'human_skin',
        SHELL_COLORS.skin
      ),
    ]);
    bakeShellBone(`Shell_Thigh_${side}`, `thigh_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          thigh * 0.94,
          0.072,
          0.072,
          0.056,
          0.056,
          0.011,
          SHELL_COLORS.undershirtDark
        ),
        `shell_thigh_${side}`,
        'woven_cloth',
        SHELL_COLORS.undershirtDark
      ),
    ]);
    bakeShellBone(`Shell_Calf_${side}`, `calf_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(
          calf * 0.94,
          0.056,
          0.056,
          0.044,
          0.044,
          0.009,
          SHELL_COLORS.undershirtDark
        ),
        `shell_calf_${side}`,
        'stitched_leather',
        SHELL_COLORS.undershirtDark
      ),
    ]);
    bakeShellBone(`Shell_Foot_${side}`, `foot_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(0.14, 0.046, 0.054, 0.04, 0.045, 0.008, SHELL_COLORS.undershirtDark),
        `shell_foot_${side}`,
        'stitched_leather',
        SHELL_COLORS.undershirtDark
      ),
    ]);
  }

  return { specs, headMetrics };
}

interface ModularAttachmentSpec {
  boneName: string;
  baked: BakedAssetResult;
  isMetal: boolean;
}

/**
 * Generates bone-mounted geometry pieces for any (classId × slot × rarity)
 * using beveled armor primitives, curved pauldrons, sculpted blades/shields/bows, and procedural PBR atlases.
 */
function buildSlotAttachments(
  rig: CanonicalUalRig,
  classId: PlayerClassId,
  slot: EquipSlot,
  rarity: ItemRarity,
  cfg: InternalFinishConfig
): ModularAttachmentSpec[] {
  const pal = RARITY_COLOR_TABLE[rarity];
  const tier = pal.tierLevel;
  const out: ModularAttachmentSpec[] = [];
  const armorRecipe = classId === 'archer' ? 'stitched_leather' : 'rarity_armor';

  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

  const bakeBoneParts = (
    boneName: string,
    parts: TaggedGeometryPart[],
    opts: { isMetal?: boolean; inspectUvs?: boolean } = {}
  ) => {
    const baked = bakeTaggedPartsAsset(parts, {
      finishMode: cfg.finishMode,
      texelsPerMeter: 64,
      seed: cfg.materialSeed + tier * 7,
      aoRays: 10,
      aoMaxDist: 0.36,
      aoStrength: cfg.aoStrength,
      normalStrength: cfg.normalStrength,
      rarityTier: rarity,
      emblemHex: pal.trim,
      emissiveRuneHex: tier >= 3 ? pal.glow : null,
      usePool: true,
      cacheKey: `nwl_equip:${classId}:${slot}:${rarity}:${boneName}`,
      inspectUvs: Boolean(opts.inspectUvs),
    });
    disposePartsArray(parts);
    out.push({ boneName, baked, isMetal: Boolean(opts.isMetal) });
  };

  if (slot === 'helmet') {
    const parts: TaggedGeometryPart[] = [];
    if (classId === 'knight') {
      const dome = makeBeveledBox(0.26, 0.24, 0.26, 0.025, pal.primary, { offset: [0, 0.14, 0] });
      const visor = makeBeveledBox(0.22, 0.07, 0.07, 0.012, '#141013', { offset: [0, 0.11, 0.115] });
      const trimBand = makeBeveledBox(0.27, 0.044, 0.27, 0.01, pal.trim, { offset: [0, 0.19, 0.01] });
      parts.push(
        tagPart(dome, 'knight_helm_dome', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(visor, 'knight_helm_visor', 'forged_steel', '#141013'),
        tagPart(trimBand, 'knight_helm_trim', 'brushed_gold', pal.trim)
      );
      if (tier >= 2) {
        const crest = makeBeveledBox(0.056, 0.1 + tier * 0.015, 0.24, 0.012, pal.secondary, {
          offset: [0, 0.29, -0.01],
        });
        parts.push(tagPart(crest, 'knight_helm_crest', 'rarity_armor', pal.secondary, { accentHex: pal.trim }));
      }
      if (tier >= 4) {
        for (const [wIdx, sx] of [-1, 1].entries()) {
          const wing = makeBeveledBox(0.052, 0.14, 0.095, 0.01, pal.trim);
          wing.rotateZ(sx * -0.35);
          wing.translate(sx * 0.15, 0.25, 0);
          parts.push(tagPart(wing, `knight_helm_wing_${wIdx}`, 'brushed_gold', pal.trim));
        }
      }
      bakeBoneParts('Head', parts, { isMetal: true, inspectUvs: true });
    } else if (classId === 'archer') {
      const hood = makeBeveledBox(0.25, 0.22, 0.27, 0.024, pal.primary, { offset: [0, 0.14, -0.015] });
      const cowlRim = makeBeveledBox(0.26, 0.055, 0.085, 0.012, pal.trim, { offset: [0, 0.21, 0.1] });
      parts.push(
        tagPart(hood, 'archer_hood', 'stitched_leather', pal.primary, { accentHex: pal.trim }),
        tagPart(cowlRim, 'archer_cowl', 'stitched_leather', pal.trim)
      );
      if (tier >= 2) {
        const feather = makeBeveledBox(0.042, 0.18 + tier * 0.02, 0.065, 0.008, pal.secondary);
        feather.rotateZ(-0.28);
        feather.rotateX(-0.2);
        feather.translate(0.14, 0.25, -0.04);
        parts.push(tagPart(feather, 'archer_feather', 'woven_cloth', pal.secondary));
      }
      if (tier >= 4) {
        const mask = makeBeveledBox(0.2, 0.06, 0.045, 0.01, pal.secondary, { offset: [0, 0.07, 0.115] });
        parts.push(tagPart(mask, 'archer_mask', 'stitched_leather', pal.secondary));
      }
      bakeBoneParts('Head', parts, { isMetal: false, inspectUvs: true });
    } else {
      // Mage pointed hat sculpted via LatheProfile
      const brim = makeLatheProfile(
        [
          [0.145, 0.215],
          [0.285 + tier * 0.012, 0.224],
          [0.275 + tier * 0.012, 0.248],
          [0.145, 0.252],
        ],
        8,
        pal.primary
      );
      const band = makeLatheProfile(
        [
          [0.168, 0.248],
          [0.162, 0.3],
        ],
        8,
        pal.trim
      );
      const cone = makeLatheProfile(
        [
          [0.155, 0.0],
          [0.09, 0.16],
          [0.012, 0.31 + tier * 0.02],
        ],
        8,
        pal.secondary
      );
      cone.rotateX(-0.18);
      cone.translate(0, 0.285, -0.02);
      parts.push(
        tagPart(brim, 'mage_hat_brim', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(band, 'mage_hat_band', 'brushed_gold', pal.trim),
        tagPart(cone, 'mage_hat_cone', 'woven_cloth', pal.secondary, { accentHex: pal.trim })
      );
      if (tier >= 3) {
        const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.045, 0), pal.glow);
        gem.translate(0, 0.27, 0.165);
        parts.push(tagPart(gem, 'mage_hat_gem', 'runic_glow', pal.glow, { lockVertical: false }));
      }
      bakeBoneParts('Head', parts, { isMetal: false, inspectUvs: true });
    }
  } else if (slot === 'chest') {
    const beltParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBoneSegmentBox(0.072, 0.165, 0.125, 0.165, 0.125, 0.012, pal.secondary),
        'belt_strap',
        'stitched_leather',
        pal.secondary,
        { accentHex: pal.trim }
      ),
      tagPart(
        makeBeveledBox(0.085, 0.075, 0.045, 0.01, pal.trim, { offset: [0, 0.05, 0.12] }),
        'belt_buckle',
        'brushed_gold',
        pal.trim,
        { landmarkKind: 'chest_crest' }
      ),
    ];
    if (classId === 'knight' || tier >= 3) {
      for (const [tIdx, sx] of [-1, 1].entries()) {
        const tasset = makeBeveledBox(0.092, 0.125, 0.135, 0.014, pal.primary, {
          offset: [sx * 0.145, -0.02, 0],
        });
        beltParts.push(tagPart(tasset, `belt_tasset_${tIdx}`, armorRecipe, pal.primary, { accentHex: pal.trim }));
      }
    }
    bakeBoneParts('pelvis', beltParts, { isMetal: classId === 'knight' });

    bakeBoneParts(
      'spine_01',
      [
        tagPart(
          makeBeveledBoneSegmentBox(spine1Len * 1.05, 0.142, 0.104, 0.156, 0.114, 0.014, pal.secondary),
          'chest_lower',
          armorRecipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
      ],
      { isMetal: classId === 'knight' }
    );

    bakeBoneParts(
      'spine_02',
      [
        tagPart(
          makeBeveledBoneSegmentBox(spine2Len * 1.08, 0.16, 0.115, 0.18, 0.13, 0.015, pal.primary),
          'chest_mid',
          armorRecipe,
          pal.primary,
          { accentHex: pal.trim, landmarkKind: 'chest_crest' }
        ),
        tagPart(
          makeBeveledBox(0.28, 0.052, 0.24, 0.01, pal.trim, { offset: [0, spine2Len * 0.5, 0] }),
          'chest_band',
          'brushed_gold',
          pal.trim
        ),
      ],
      { isMetal: classId === 'knight', inspectUvs: true }
    );

    const topParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBoneSegmentBox(spine3Len * 0.94, 0.185, 0.13, 0.2, 0.135, 0.016, pal.primary),
        'chest_upper',
        armorRecipe,
        pal.primary,
        { accentHex: pal.trim }
      ),
    ];
    if (classId === 'knight') {
      const gorget = makeBeveledBox(0.22, 0.06, 0.18, 0.012, pal.trim, {
        offset: [0, spine3Len * 0.9, 0],
      });
      const crest = makeBeveledBox(0.115, 0.115, 0.044, 0.01, pal.secondary, {
        offset: [0, spine3Len * 0.48, 0.135],
      });
      topParts.push(
        tagPart(gorget, 'knight_gorget', 'brushed_gold', pal.trim),
        tagPart(crest, 'knight_crest', 'rarity_armor', pal.secondary, {
          landmarkKind: 'chest_crest',
          accentHex: pal.trim,
        })
      );
    } else if (classId === 'archer') {
      const quiver = makeLatheProfile(
        [
          [0.044, -0.18],
          [0.056, 0.18],
        ],
        7,
        pal.secondary
      );
      quiver.rotateZ(-0.42);
      quiver.translate(-0.08, 0.08, -0.15);
      const arrows = makeBeveledBox(0.085, 0.08, 0.085, 0.012, pal.trim);
      arrows.rotateZ(-0.42);
      arrows.translate(-0.16, 0.26, -0.15);
      topParts.push(
        tagPart(quiver, 'archer_quiver', 'stitched_leather', pal.secondary, { accentHex: pal.trim }),
        tagPart(arrows, 'archer_fletching', 'woven_cloth', pal.trim)
      );
    } else {
      const mantle = makeBeveledBox(0.38, 0.065, 0.24, 0.014, pal.trim, {
        offset: [0, spine3Len * 0.78, -0.01],
      });
      const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.05, 0), pal.glow);
      rune.translate(0, spine3Len * 0.48, 0.138);
      topParts.push(
        tagPart(mantle, 'mage_mantle', 'brushed_gold', pal.trim),
        tagPart(rune, 'mage_chest_rune', 'runic_glow', pal.glow, { lockVertical: false })
      );
    }
    bakeBoneParts('spine_03', topParts, { isMetal: classId === 'knight' });

    for (const side of ['l', 'r'] as const) {
      const armParts: TaggedGeometryPart[] = [
        tagPart(
          makeBeveledBoneSegmentBox(uArm * 0.88, 0.068, 0.068, 0.058, 0.058, 0.01, pal.secondary),
          `arm_sleeve_${side}`,
          armorRecipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
      ];
      const hasPauldron =
        classId === 'knight' ||
        (classId === 'archer' && side === 'l') ||
        (classId === 'mage' && tier >= 2) ||
        tier >= 3;
      if (hasPauldron) {
        const pW = classId === 'knight' ? 0.18 + tier * 0.008 : 0.145;
        const pH = classId === 'knight' ? 0.155 : 0.115;
        const pauldron = makePauldronShellGeometry(pW, pH, pW * 1.12, 0.032, pal.primary);
        if (side === 'r') {
          pauldron.rotateY(Math.PI);
        }
        pauldron.translate(side === 'l' ? 0.01 : -0.01, 0.05, 0);
        armParts.push(
          tagPart(pauldron, `pauldron_${side}`, armorRecipe, pal.primary, {
            accentHex: pal.trim,
            lockVertical: true,
          })
        );
        if (tier >= 3) {
          const rim = makeBeveledBox(pW + 0.025, 0.038, pW + 0.025, 0.008, pal.trim, {
            offset: [0, 0.01, 0],
          });
          armParts.push(tagPart(rim, `pauldron_rim_${side}`, 'brushed_gold', pal.trim));
        }
        if (tier >= 5) {
          const spike = prepareColoredPart(new THREE.ConeGeometry(0.042, 0.11, 5), pal.trim);
          spike.translate(side === 'l' ? 0.045 : -0.045, 0.12, 0);
          armParts.push(tagPart(spike, `pauldron_spike_${side}`, 'brushed_gold', pal.trim));
        }
      }
      bakeBoneParts(`upperarm_${side}`, armParts, { isMetal: classId === 'knight' });
    }
  } else if (slot === 'legs') {
    for (const side of ['l', 'r'] as const) {
      const parts: TaggedGeometryPart[] = [
        tagPart(
          makeBeveledBoneSegmentBox(thigh * 0.88, 0.09, 0.09, 0.072, 0.072, 0.013, pal.primary),
          `thigh_guard_${side}`,
          armorRecipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
        tagPart(
          makeBeveledBox(0.135, 0.082, 0.14, 0.014, pal.trim, {
            offset: [0, thigh * 0.86, 0.015],
          }),
          `kneecap_${side}`,
          'brushed_gold',
          pal.trim
        ),
      ];
      if (tier >= 3) {
        const outerPlate = makeBeveledBox(0.155, thigh * 0.52, 0.062, 0.01, pal.secondary, {
          offset: [0, thigh * 0.45, 0],
        });
        parts.push(
          tagPart(outerPlate, `thigh_plate_${side}`, armorRecipe, pal.secondary, {
            accentHex: pal.trim,
          })
        );
      }
      bakeBoneParts(`thigh_${side}`, parts, { isMetal: classId === 'knight' });
    }
  } else if (slot === 'boots') {
    for (const side of ['l', 'r'] as const) {
      const calfParts: TaggedGeometryPart[] = [
        tagPart(
          makeBeveledBoneSegmentBox(calf * 0.72, 0.068, 0.068, 0.076, 0.076, 0.012, pal.secondary),
          `greave_${side}`,
          armorRecipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
        tagPart(
          makeBeveledBox(0.15, 0.065, 0.15, 0.012, pal.trim, {
            offset: [0, calf * 0.34, 0],
          }),
          `boot_cuff_${side}`,
          'brushed_gold',
          pal.trim
        ),
      ];
      bakeBoneParts(`calf_${side}`, calfParts, { isMetal: classId === 'knight' });

      const footParts: TaggedGeometryPart[] = [
        tagPart(
          makeBeveledBoneSegmentBox(0.175, 0.06, 0.068, 0.055, 0.06, 0.01, pal.primary),
          `sabaton_${side}`,
          armorRecipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
      ];
      if (tier >= 3) {
        const toe = makeBeveledBox(0.11, 0.052, 0.065, 0.01, pal.trim, {
          offset: [0, 0.15, 0.02],
        });
        footParts.push(tagPart(toe, `sabaton_toe_${side}`, 'brushed_gold', pal.trim));
      }
      bakeBoneParts(`foot_${side}`, footParts, { isMetal: classId === 'knight' });
    }
  } else if (slot === 'gloves') {
    for (const side of ['l', 'r'] as const) {
      const bracerParts: TaggedGeometryPart[] = [
        tagPart(
          makeBeveledBoneSegmentBox(lArm * 0.62, 0.054, 0.054, 0.062, 0.062, 0.01, pal.primary),
          `bracer_${side}`,
          armorRecipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
      ];
      if (tier >= 2) {
        const rim = makeBeveledBox(0.12, 0.048, 0.12, 0.01, pal.trim, {
          offset: [0, lArm * 0.56, 0],
        });
        bracerParts.push(tagPart(rim, `bracer_cuff_${side}`, 'brushed_gold', pal.trim));
      }
      bakeBoneParts(`lowerarm_${side}`, bracerParts, { isMetal: classId === 'knight' });

      bakeBoneParts(
        `hand_${side}`,
        [
          tagPart(
            makeBeveledBoneSegmentBox(0.115, 0.05, 0.048, 0.044, 0.042, 0.008, pal.secondary),
            `gauntlet_${side}`,
            armorRecipe,
            pal.secondary,
            { accentHex: pal.trim }
          ),
        ],
        { isMetal: classId === 'knight' }
      );
    }
  } else if (slot === 'weapon') {
    if (classId === 'knight') {
      const grip = makeLatheProfile(
        [
          [0.024, -0.12],
          [0.022, 0.12],
        ],
        7,
        '#3b1725'
      );
      grip.rotateX(Math.PI * 0.5);
      const pommel = makeBeveledBox(0.072, 0.064, 0.072, 0.016, pal.trim, {
        offset: [0, 0, -0.14],
      });
      const guard = makeBeveledBox(0.28 + tier * 0.015, 0.05, 0.065, 0.012, pal.trim, {
        offset: [0, 0, 0.13],
      });
      const bladeLen = 0.72 + tier * 0.04;
      const bladeW = 0.105 + tier * 0.008;
      const blade = makeSwordBladeGeometry(bladeW, 0.04, bladeLen * 0.82, bladeLen * 0.22, pal.primary);
      blade.rotateX(Math.PI * 0.5);
      blade.translate(0, 0, 0.15);

      bakeBoneParts(
        'hand_r',
        [
          tagPart(grip, 'knight_sw_grip', 'stitched_leather', '#3b1725', { lockVertical: false }),
          tagPart(pommel, 'knight_sw_pommel', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(guard, 'knight_sw_guard', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(blade, 'knight_sw_blade', tier >= 3 ? 'rarity_armor' : 'forged_steel', pal.primary, {
            accentHex: pal.glow,
            lockVertical: false,
          }),
        ],
        { isMetal: true }
      );

      const shieldW = 0.44 + tier * 0.015;
      const shieldH = 0.58 + tier * 0.02;
      const dome = makeDomeShieldGeometry(shieldW, shieldH, 0.065, pal.secondary);
      const boss = makeBeveledBox(0.11, 0.12, 0.055, 0.016, pal.trim, {
        offset: [0, 0.03, 0.095],
      });
      for (const g of [dome, boss]) {
        g.rotateY(Math.PI * 0.5);
        g.translate(0.11, 0.06, 0.06);
      }
      bakeBoneParts(
        'hand_l',
        [
          tagPart(dome, 'knight_shield_body', 'rarity_armor', pal.secondary, {
            landmarkKind: 'shield_face',
            accentHex: pal.trim,
            lockVertical: false,
          }),
          tagPart(boss, 'knight_shield_boss', 'brushed_gold', pal.trim, { lockVertical: false }),
        ],
        { isMetal: true }
      );
    } else if (classId === 'archer') {
      const bow = makeRecurveBowGeometry(1.16, 0.22, 0.046, pal.primary);
      const riser = makeBeveledBox(0.062, 0.28, 0.072, 0.012, pal.trim);
      const stringBar = makeBeveledBox(0.024, 1.0, 0.024, 0.004, '#dae0ea', {
        offset: [0, 0, -0.14],
      });
      for (const g of [bow, riser, stringBar]) {
        g.translate(0, 0.05, 0.14);
      }
      bakeBoneParts(
        'hand_l',
        [
          tagPart(bow, 'archer_bow', 'wood_planks', pal.primary, { accentHex: pal.trim }),
          tagPart(riser, 'archer_riser', 'brushed_gold', pal.trim),
          tagPart(stringBar, 'archer_string', 'bone_ivory', '#dae0ea'),
        ],
        { isMetal: false }
      );

      const shaft = makeLatheProfile(
        [
          [0.018, 0],
          [0.018, 0.65],
        ],
        6,
        '#6d758d'
      );
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, 0, -0.08);
      const head = makeSwordBladeGeometry(0.056, 0.028, 0.05, 0.1, pal.glow);
      head.rotateX(Math.PI * 0.5);
      head.translate(0, 0, 0.56);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(shaft, 'archer_arrow_shaft', 'wood_planks', '#6d758d', { lockVertical: false }),
          tagPart(head, 'archer_arrow_head', tier >= 3 ? 'runic_glow' : 'forged_steel', pal.glow, {
            lockVertical: false,
          }),
        ],
        { isMetal: false }
      );
    } else {
      const pole = makeLatheProfile(
        [
          [0.026, -0.34],
          [0.03, 0.45],
          [0.036, 1.18],
        ],
        7,
        pal.secondary
      );
      pole.rotateX(Math.PI * 0.5);
      pole.translate(0, 0, 0.04);
      const crown = makeBeveledBox(0.18 + tier * 0.015, 0.18 + tier * 0.015, 0.082, 0.018, pal.trim);
      crown.rotateZ(Math.PI * 0.25);
      crown.translate(0, 0, 1.24);
      const crystal = prepareColoredPart(new THREE.OctahedronGeometry(0.095 + tier * 0.01, 0), pal.glow);
      crystal.translate(0, 0, 1.32);

      bakeBoneParts(
        'hand_r',
        [
          tagPart(pole, 'mage_staff_pole', 'wood_planks', pal.secondary, { lockVertical: false }),
          tagPart(crown, 'mage_staff_crown', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(crystal, 'mage_staff_crystal', 'runic_glow', pal.glow, { lockVertical: false }),
        ],
        { isMetal: false }
      );

      const tome = makeBeveledBox(0.18, 0.24, 0.072, 0.014, pal.primary, {
        offset: [0.04, 0.04, 0.08],
      });
      const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.055, 0), pal.glow);
      rune.translate(0.04, 0.04, 0.14);
      bakeBoneParts(
        'hand_l',
        [
          tagPart(tome, 'mage_tome', 'stitched_leather', pal.primary, {
            landmarkKind: 'chest_crest',
            accentHex: pal.trim,
            lockVertical: false,
          }),
          tagPart(rune, 'mage_tome_rune', 'runic_glow', pal.glow, { lockVertical: false }),
        ],
        { isMetal: false }
      );
    }
  }

  return out;
}

/**
 * Creates a full NWL 1.79m Player character on the canonical 65-bone UAL rig
 * with the standardized base shell + live-swappable 6-slot × 5-rarity modular equipment.
 */
export function buildNwlPlayerCharacter(
  options: {
    classId?: PlayerClassId;
    rarity?: ItemRarity;
    loadout?: Partial<EquipmentLoadout>;
    pixelSize?: number;
    objectId?: number;
    finishMode?: FinishMode;
    materialSeed?: number;
    aoStrength?: number;
    normalStrength?: number;
  } = {},
  sharedResources?: PixelizerMaterialResources
): PlayerCharacterInstance {
  let currentClass: PlayerClassId = options.classId ?? 'knight';
  const defaultRarity: ItemRarity = options.rarity ?? 'normal';
  const loadout: EquipmentLoadout = {
    helmet: options.loadout?.helmet ?? defaultRarity,
    chest: options.loadout?.chest ?? defaultRarity,
    legs: options.loadout?.legs ?? defaultRarity,
    boots: options.loadout?.boots ?? defaultRarity,
    gloves: options.loadout?.gloves ?? defaultRarity,
    weapon: options.loadout?.weapon ?? defaultRarity,
  };

  const cfg: InternalFinishConfig = {
    finishMode: options.finishMode ?? 'textured_ao',
    materialSeed: Math.floor(options.materialSeed ?? 101),
    aoStrength: options.aoStrength ?? 0.55,
    normalStrength: options.normalStrength ?? 0.36,
  };

  const px = options.pixelSize ?? 3;
  const objId = options.objectId ?? 10;

  const rig = createCanonicalUalRig('male', NWL_HERO_SCALE);
  const root = new THREE.Group();
  root.name = `NWL_Hero_${currentClass}`;
  root.add(rig.armature);

  // Attach Base Shell cleanly on UAL bones
  const { specs: shellSpecs, headMetrics } = buildBaseShellSpecs(rig, cfg);
  const shellRes = attachRigidPartsToUalRig(rig, shellSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  const baseMeshes: THREE.Mesh[] = [...shellRes.meshes];
  const equippedMeshes = new Map<EquipSlot, { mesh: THREE.Mesh; mat: PixelizerMaterial }[]>();
  const allMeshes: THREE.Mesh[] = [...baseMeshes];
  const allMaterials: PixelizerMaterial[] = [...shellRes.materials];

  root.userData.unwrapMetrics = headMetrics;

  const rebuildMeshLists = () => {
    allMeshes.length = 0;
    allMaterials.length = 0;
    allMeshes.push(...baseMeshes);
    allMaterials.push(...shellRes.materials);
    for (const entries of equippedMeshes.values()) {
      for (const e of entries) {
        allMeshes.push(e.mesh);
        allMaterials.push(e.mat);
      }
    }
  };

  const mountSlot = (slot: EquipSlot, rarity: ItemRarity): EquipmentPieceDef => {
    const existing = equippedMeshes.get(slot);
    if (existing) {
      for (const e of existing) {
        e.mesh.removeFromParent();
        e.mesh.geometry.dispose();
        disposeMaterialAndUnpooledTextures(e.mat);
      }
      equippedMeshes.delete(slot);
    }

    loadout[slot] = rarity;
    const def = getEquipmentPieceDef(currentClass, slot, rarity);
    const specs = buildSlotAttachments(rig, currentClass, slot, rarity, cfg);
    const mounted: { mesh: THREE.Mesh; mat: PixelizerMaterial }[] = [];

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const bone = rig.boneByName.get(spec.boneName) ?? rig.rootBone;
      const mat = new PixelizerMaterial(
        bakedToMaterialOptions(spec.baked, {
          pixelated: true,
          pixelSize: px,
          objectId: objId,
          outlineColor: '#14101c',
          outlineAlpha: 1.0,
          workflow: spec.isMetal ? 'metallic' : 'specular',
          metallic: spec.isMetal ? 0.26 : 0.0,
          smoothness: spec.isMetal ? 0.34 : 0.22,
          useColorGrading: true,
        }),
        sharedResources
      );
      mat.vertexColors = true;
      const mesh = new THREE.Mesh(spec.baked.geometry, mat);
      mesh.name = `Equip_${currentClass}_${slot}_${rarity}_${i}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.equipSlot = slot;
      mesh.userData.equipRarity = rarity;
      mesh.userData.pixelizer = {
        snap: {
          snapPosition: false,
          alignPixelGrid: true,
          alignmentPixelSize: px,
          angleSnapMode: 'none',
          angleResolutionDeg: 45,
        },
        gridReference: rig.armature,
      } satisfies PixelizerObjectAttachment;
      bone.add(mesh);
      mounted.push({ mesh, mat });

      if (spec.baked.uvReport) {
        root.userData.unwrapMetrics = spec.baked.unwrapMetrics;
      }
    }

    equippedMeshes.set(slot, mounted);
    rebuildMeshLists();
    return def;
  };

  const equipFullRaritySet = (rarity: ItemRarity) => {
    for (const s of EQUIP_SLOTS) mountSlot(s, rarity);
  };

  const setClass = (nextClass: PlayerClassId) => {
    currentClass = nextClass;
    root.name = `NWL_Hero_${currentClass}`;
    for (const s of EQUIP_SLOTS) {
      mountSlot(s, loadout[s]);
    }
  };

  // Mount initial loadout across all 6 slots
  for (const s of EQUIP_SLOTS) {
    mountSlot(s, loadout[s]);
  }

  return {
    name: root.name,
    get classId() {
      return currentClass;
    },
    rig,
    root,
    loadout,
    meshes: allMeshes,
    materials: allMaterials,
    equipSlot: mountSlot,
    equipFullRaritySet,
    setClass,
    getEquippedDefs: () => EQUIP_SLOTS.map((s) => getEquipmentPieceDef(currentClass, s, loadout[s])),
    dispose: () => {
      for (const m of baseMeshes) {
        m.removeFromParent();
        m.geometry.dispose();
      }
      for (const mat of shellRes.materials) disposeMaterialAndUnpooledTextures(mat);
      for (const entries of equippedMeshes.values()) {
        for (const e of entries) {
          e.mesh.removeFromParent();
          e.mesh.geometry.dispose();
          disposeMaterialAndUnpooledTextures(e.mat);
        }
      }
      equippedMeshes.clear();
    },
  };
}
