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
  type UalSocketName,
} from '../rigging/UalRigSpec';
import type { PixelizerMaterialOptions } from '../types';
import {
  CLASS_DEFAULT_STYLE_LOADOUT,
  CLASS_NORMAL_PALETTES,
  MATERIAL_THEMES,
  SHELL_CLEARANCE,
  WEAPON_MOUNT_SPEC,
  getWeaponGripPivot,
  type EquipmentStyleLoadout,
  type WeaponMainStyleId,
} from './EquipmentCatalog';
import { buildStylizedHairParts } from './CharacterBuilder';
import {
  bakeTaggedPartsAsset,
  type BakedAssetResult,
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
  makeSplineLoftGeometry,
  makeSwordBladeGeometry,
  subdivideGeometryLoop,
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
    labelPt: 'Normal (Classe)',
    primary: '#5d697a',
    secondary: '#2c3340',
    trim: '#c5ae7e',
    glow: '#8fa4bf',
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
  styleLoadout: EquipmentStyleLoadout;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  equipSlot: (slot: EquipSlot, rarity: ItemRarity) => EquipmentPieceDef;
  equipFullRaritySet: (rarity: ItemRarity) => void;
  setStyleLoadout: (patch: Partial<EquipmentStyleLoadout>, rarityOverride?: ItemRarity) => void;
  equipStyleSlot: <K extends keyof EquipmentStyleLoadout>(
    key: K,
    style: EquipmentStyleLoadout[K],
    rarityOverride?: ItemRarity
  ) => void;
  setClass: (nextClass: PlayerClassId) => void;
  getEquippedDefs: () => EquipmentPieceDef[];
  dispose: () => void;
}

const NWL_HERO_SCALE = 1.79 / 1.829; // Exact 1.79m hero height = 108px at 60px/m

const SHELL_COLORS = {
  skin: '#e0a882',
  skinShadow: '#b87b56',
  undershirt: '#343d4d',
  undershirtDark: '#2c3340',
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
      makeAnatomicalTorsoGeometry(
        pelvisLen * 1.05,
        0.135,
        0.095,
        0.13,
        0.09,
        { radialSegs: 10, heightSegs: 4, hexColor: SHELL_COLORS.undershirtDark, musculature: 0.6 }
      ),
      'shell_pelvis',
      'woven_cloth',
      SHELL_COLORS.undershirtDark
    ),
  ]);

  bakeShellBone('Shell_Spine1', 'spine_01', [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine1Len * 1.05,
        0.125,
        0.088,
        0.135,
        0.092,
        { radialSegs: 10, heightSegs: 4, hexColor: SHELL_COLORS.undershirt, musculature: 0.85 }
      ),
      'shell_spine1',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Spine2', 'spine_02', [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine2Len * 1.06,
        0.138,
        0.095,
        0.152,
        0.105,
        { radialSegs: 10, heightSegs: 4, hexColor: SHELL_COLORS.undershirt, musculature: 0.9 }
      ),
      'shell_spine2',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Spine3', 'spine_03', [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine3Len * 0.9,
        0.155,
        0.105,
        0.165,
        0.11,
        { radialSegs: 10, heightSegs: 4, hexColor: SHELL_COLORS.undershirt, musculature: 1.0 }
      ),
      'shell_spine3',
      'woven_cloth',
      SHELL_COLORS.undershirt
    ),
  ]);

  bakeShellBone('Shell_Neck', 'neck_01', [
    tagPart(
      makeSculptedLimbGeometry(neckLen * 1.1, 0.05, 0.05, 0.048, 0.048, {
        profile: 'taper',
        radialSegs: 10,
        heightSegs: 4,
        hexColor: SHELL_COLORS.skinShadow,
      }),
      'shell_neck',
      'human_skin',
      SHELL_COLORS.skinShadow
    ),
  ]);

  // Head + clean front-facing semantic eyes/brows + compact base skullcap (preserves head_front landmark)
  const headBox = makeBeveledBox(0.214, 0.234, 0.214, 0.024, SHELL_COLORS.skin, {
    offset: [0, 0.11, 0],
  });
  const hairCap = makeBeveledBox(0.218, 0.074, 0.218, 0.02, SHELL_COLORS.hair, {
    offset: [0, 0.2, -0.01],
  });
  bakeShellBone(
    'Shell_Head',
    'Head',
    [
      tagPart(headBox, 'head_front', 'human_skin', SHELL_COLORS.skin, {
        landmarkKind: 'head_front',
        lockVertical: true,
        islandScaleBias: 2.4,
      }),
      tagPart(hairCap, 'shell_hair', 'woven_cloth', SHELL_COLORS.hair, {
        accentHex: SHELL_COLORS.hair,
        lockVertical: true,
      }),
    ],
    true
  );

  for (const side of ['l', 'r'] as const) {
    bakeShellBone(`Shell_UpperArm_${side}`, `upperarm_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(uArm * 0.94, 0.054, 0.054, 0.046, 0.046, {
          profile: 'bicep',
          radialSegs: 10,
          heightSegs: 4,
          hexColor: SHELL_COLORS.undershirt,
        }),
        `shell_ua_${side}`,
        'woven_cloth',
        SHELL_COLORS.undershirt
      ),
    ]);
    bakeShellBone(`Shell_LowerArm_${side}`, `lowerarm_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(lArm * 0.94, 0.045, 0.045, 0.038, 0.038, {
          profile: 'forearm',
          radialSegs: 10,
          heightSegs: 4,
          hexColor: SHELL_COLORS.skinShadow,
        }),
        `shell_la_${side}`,
        'human_skin',
        SHELL_COLORS.skinShadow
      ),
    ]);
    bakeShellBone(`Shell_Hand_${side}`, `hand_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(0.1, 0.038, 0.035, 0.034, 0.03, {
          profile: 'taper',
          radialSegs: 8,
          heightSegs: 4,
          hexColor: SHELL_COLORS.skin,
        }),
        `shell_hand_${side}`,
        'human_skin',
        SHELL_COLORS.skin
      ),
    ]);
    bakeShellBone(`Shell_Thigh_${side}`, `thigh_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(thigh * 0.94, 0.072, 0.072, 0.056, 0.056, {
          profile: 'thigh',
          radialSegs: 10,
          heightSegs: 4,
          hexColor: SHELL_COLORS.undershirtDark,
        }),
        `shell_thigh_${side}`,
        'woven_cloth',
        SHELL_COLORS.undershirtDark
      ),
    ]);
    bakeShellBone(`Shell_Calf_${side}`, `calf_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(calf * 0.94, 0.056, 0.056, 0.044, 0.044, {
          profile: 'calf',
          radialSegs: 10,
          heightSegs: 4,
          hexColor: SHELL_COLORS.undershirtDark,
        }),
        `shell_calf_${side}`,
        'stitched_leather',
        SHELL_COLORS.undershirtDark
      ),
    ]);
    bakeShellBone(`Shell_Foot_${side}`, `foot_${side}`, [
      tagPart(
        makeSculptedLimbGeometry(0.14, 0.046, 0.054, 0.04, 0.045, {
          profile: 'taper',
          radialSegs: 8,
          heightSegs: 4,
          hexColor: SHELL_COLORS.undershirtDark,
        }),
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
 * Generates bone-mounted geometry pieces for any (slot × style × rarity)
 * using anatomical ShellClearance envelopes, standardized UAL grip pivots, and procedural PBR atlases.
 */
function buildSlotAttachments(
  rig: CanonicalUalRig,
  classId: PlayerClassId,
  slot: EquipSlot,
  rarity: ItemRarity,
  cfg: InternalFinishConfig,
  styleLoadout: EquipmentStyleLoadout
): ModularAttachmentSpec[] {
  const basePal = RARITY_COLOR_TABLE[rarity];
  const themeId = styleLoadout.materialTheme ?? 'rarity_auto';
  const theme = themeId !== 'rarity_auto' ? MATERIAL_THEMES[themeId] : null;
  const classNormal = !theme && rarity === 'normal' ? CLASS_NORMAL_PALETTES[classId] : null;
  const pal = theme
    ? {
        ...basePal,
        primary: theme.metalHex,
        secondary: theme.clothHex,
        trim: theme.trimHex,
        glow: theme.accentHex,
      }
    : classNormal
      ? {
          ...basePal,
          primary: classNormal.primary,
          secondary: classNormal.secondary,
          trim: classNormal.trim,
          glow: classNormal.glow,
        }
      : basePal;
  const paletteScope = theme ? themeId : classNormal ? `normal_${classId}` : rarity;
  const tier = pal.tierLevel;
  const out: ModularAttachmentSpec[] = [];

  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

function applyWeaponGripPivotAndClamp(
  parts: TaggedGeometryPart[],
  style: WeaponMainStyleId
): void {
  const pivot = getWeaponGripPivot(style);
  const gY = WEAPON_MOUNT_SPEC.handGripCenterY;
  const gZ = WEAPON_MOUNT_SPEC.handGripCenterZ;
  const minZ = gZ - pivot.maxRearOverhang;
  for (const part of parts) {
    const geo = part.geometry;
    if (pivot.pitchRad !== 0 || pivot.yawRad !== 0) {
      geo.translate(0, -gY, -gZ);
      if (pivot.pitchRad !== 0) geo.rotateX(pivot.pitchRad);
      if (pivot.yawRad !== 0) geo.rotateY(pivot.yawRad);
      geo.translate(0, gY, gZ);
    }
    const pos = geo.getAttribute('position');
    if (pos) {
      let clamped = false;
      for (let i = 0; i < pos.count; i++) {
        if (pos.getZ(i) < minZ) {
          pos.setZ(i, minZ);
          clamped = true;
        }
      }
      if (clamped) pos.needsUpdate = true;
    }
  }
}

  const bakeBoneParts = (
    boneName: string,
    parts: TaggedGeometryPart[],
    styleKey: string,
    opts: { isMetal?: boolean; inspectUvs?: boolean } = {}
  ) => {
    if (parts.length === 0) return;
    if ((slot as string) === 'weapon_main' && boneName === 'hand_r') {
      applyWeaponGripPivotAndClamp(parts, styleKey as WeaponMainStyleId);
    }
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
      cacheKey: `nwl_equip:${slot}:${styleKey}:${rarity}:${paletteScope}:${boneName}`,
      inspectUvs: Boolean(opts.inspectUvs),
    });
    disposePartsArray(parts);
    out.push({ boneName, baked, isMetal: Boolean(opts.isMetal) });
  };

  if (slot === 'helmet') {
    const hStyle = styleLoadout.helmet;
    if (hStyle === 'none') {
      const hairParts = buildStylizedHairParts(SHELL_COLORS.hair, {
        style: classId === 'mage' ? 'layered_ponytail' : classId === 'archer' ? 'layered_bob' : 'swept_short',
        tagPrefix: 'equip_hair',
        accentHex: SHELL_COLORS.hair,
      });
      bakeBoneParts('Head', hairParts, `hair_${classId}`, { isMetal: false, inspectUvs: false });
      return out;
    }
    const parts: TaggedGeometryPart[] = [];
    const hw = SHELL_CLEARANCE.headW + SHELL_CLEARANCE.plateMargin * 2.2;
    const hh = SHELL_CLEARANCE.headH + SHELL_CLEARANCE.plateMargin * 1.4;
    const hr = hw * 0.54;

    if (hStyle === 'full_helm' || hStyle === 'winged_helm') {
      const dome = makeLatheProfile(
        [
          [hr * 0.94, 0.015],
          [hr * 1.04, 0.08],
          [hr * 1.02, 0.16],
          [hr * 0.78, 0.235],
          [hr * 0.36, 0.268],
          [0.008, 0.278],
        ],
        14,
        pal.primary,
        { smoothRadialNormals: true, capBottom: false, capTop: false }
      );
      const visor = makeBeveledBox(hw * 0.84, 0.058, 0.082, 0.014, '#141013', {
        offset: [0, 0.11, hw * 0.43],
      });
      const browGuard = makeLatheProfile(
        [
          [hr * 1.02, 0.155],
          [hr * 1.1, 0.178],
          [hr * 1.02, 0.2],
        ],
        14,
        pal.trim,
        { smoothRadialNormals: true, capBottom: false, capTop: false }
      );
      parts.push(
        tagPart(dome, 'helm_dome', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(visor, 'helm_visor', 'forged_steel', '#141013'),
        tagPart(browGuard, 'helm_trim', 'brushed_gold', pal.trim)
      );
      if (tier >= 2 || hStyle === 'winged_helm') {
        const crest = makeSplineLoftGeometry(
          [
            [0, 0.25, 0.09],
            [0, 0.31 + tier * 0.008, 0.01],
            [0, 0.275, -0.09],
            [0, 0.18, -0.16],
          ],
          [
            [0.016, 0.022],
            [0.022, 0.032],
            [0.02, 0.028],
            [0.012, 0.018],
          ],
          8,
          10,
          { colorHex: pal.secondary }
        );
        parts.push(tagPart(crest, 'helm_crest', 'rarity_armor', pal.secondary, { accentHex: pal.trim }));
      }
      if (hStyle === 'winged_helm' || tier >= 4) {
        for (const [wIdx, sx] of [-1, 1].entries()) {
          const wing = makeCurvedHornGeometry(
            6,
            0.032,
            0.008,
            0.18,
            sx * 0.05,
            -0.04,
            8,
            pal.trim
          );
          wing.rotateZ(sx * -0.42);
          wing.translate(sx * (hr * 0.98), 0.19, -0.01);
          parts.push(tagPart(wing, `helm_wing_${wIdx}`, 'brushed_gold', pal.trim, { lockVertical: false }));
        }
      }
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'open_helm') {
      // Barbuta: open face (+Z) so semantic eyes/brows stay cleanly visible
      const crown = makeLatheProfile(
        [
          [hr * 1.02, 0.165],
          [hr * 0.96, 0.22],
          [hr * 0.62, 0.26],
          [0.008, 0.274],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      const backRaw = makeBeveledBox(hw, 0.185, 0.088, 0.02, pal.primary, {
        offset: [0, 0.11, -hw * 0.35],
      });
      const backPlate = subdivideGeometryLoop(backRaw, 1, { defaultHex: pal.primary });
      backRaw.dispose();
      const cheekLRaw = makeBeveledBox(0.052, 0.155, 0.145, 0.014, pal.secondary, {
        offset: [hw * 0.42, 0.098, 0.02],
      });
      const cheekL = subdivideGeometryLoop(cheekLRaw, 1, { defaultHex: pal.secondary });
      cheekLRaw.dispose();
      const cheekRRaw = makeBeveledBox(0.052, 0.155, 0.145, 0.014, pal.secondary, {
        offset: [-hw * 0.42, 0.098, 0.02],
      });
      const cheekR = subdivideGeometryLoop(cheekRRaw, 1, { defaultHex: pal.secondary });
      cheekRRaw.dispose();
      const brow = makeLatheProfile(
        [
          [hr * 1.02, 0.162],
          [hr * 1.09, 0.182],
          [hr * 1.02, 0.202],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      parts.push(
        tagPart(crown, 'open_helm_crown', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(backPlate, 'open_helm_back', 'rarity_armor', pal.primary),
        tagPart(cheekL, 'open_helm_cheek_l', 'rarity_armor', pal.secondary),
        tagPart(cheekR, 'open_helm_cheek_r', 'rarity_armor', pal.secondary),
        tagPart(brow, 'open_helm_brow', 'brushed_gold', pal.trim)
      );
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'hood') {
      const hoodRaw = makeBeveledBox(hw * 1.02, hh * 0.92, hw + 0.025, 0.036, pal.primary, {
        offset: [0, 0.138, -0.022],
      });
      const hood = subdivideGeometryLoop(hoodRaw, 1, { defaultHex: pal.primary });
      hoodRaw.dispose();
      const cowlRim = makeSplineLoftGeometry(
        [
          [-hw * 0.44, 0.08, 0.08],
          [-hw * 0.36, 0.22, 0.115],
          [0, 0.245, 0.125],
          [hw * 0.36, 0.22, 0.115],
          [hw * 0.44, 0.08, 0.08],
        ],
        [0.024, 0.028, 0.032, 0.028, 0.024],
        10,
        14,
        { colorHex: pal.trim }
      );
      parts.push(
        tagPart(hood, 'archer_hood', 'stitched_leather', pal.primary, { accentHex: pal.trim }),
        tagPart(cowlRim, 'archer_cowl', 'stitched_leather', pal.trim)
      );
      if (tier >= 2) {
        const feather = makeSplineLoftGeometry(
          [
            [0.12, 0.18, -0.01],
            [0.155, 0.26, -0.04],
            [0.185, 0.34 + tier * 0.015, -0.09],
          ],
          [
            [0.012, 0.018],
            [0.018, 0.032],
            [0.006, 0.012],
          ],
          8,
          10,
          { colorHex: pal.secondary }
        );
        parts.push(tagPart(feather, 'archer_feather', 'woven_cloth', pal.secondary));
      }
      bakeBoneParts('Head', parts, hStyle, { isMetal: false, inspectUvs: true });
    } else if (hStyle === 'circlet') {
      const band = makeLatheProfile(
        [
          [hr * 0.9, 0.172],
          [hr * 0.96, 0.192],
          [hr * 0.9, 0.212],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.042, 0), pal.glow);
      gem.translate(0, 0.205, hr * 0.95);
      parts.push(
        tagPart(band, 'circlet_band', 'brushed_gold', pal.trim),
        tagPart(gem, 'circlet_gem', 'runic_glow', pal.glow, { lockVertical: false })
      );
      if (tier >= 3) {
        for (const [sIdx, sx] of [-1, 0, 1].entries()) {
          const spire = makeCurvedHornGeometry(5, 0.016, 0.003, sx === 0 ? 0.09 : 0.065, 0, -0.01, 6, pal.trim);
          spire.translate(sx * 0.072, 0.205, hr * 0.88);
          parts.push(tagPart(spire, `circlet_spire_${sIdx}`, 'brushed_gold', pal.trim));
        }
      }
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'horned_viking') {
      const dome = makeLatheProfile(
        [
          [hr * 0.98, 0.135],
          [hr * 1.0, 0.19],
          [hr * 0.72, 0.245],
          [0.008, 0.262],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      const noseGuard = makeBeveledBox(0.036, 0.11, 0.036, 0.01, pal.trim, {
        offset: [0, 0.115, hw * 0.48],
      });
      const brow = makeLatheProfile(
        [
          [hr * 1.0, 0.132],
          [hr * 1.07, 0.155],
          [hr * 1.0, 0.178],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      parts.push(
        tagPart(dome, 'viking_dome', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(noseGuard, 'viking_nose', 'brushed_gold', pal.trim),
        tagPart(brow, 'viking_brow', 'brushed_gold', pal.trim)
      );
      for (const [hIdx, sx] of [-1, 1].entries()) {
        const hornBase = makeCurvedHornGeometry(9, 0.042, 0.006, 0.24, sx * 0.08, -0.04, 10, '#e5dcc5');
        hornBase.rotateZ(sx * -0.92);
        hornBase.rotateY(sx * 0.2);
        hornBase.translate(sx * (hr * 0.92), 0.18, 0.01);
        parts.push(tagPart(hornBase, `viking_horn_${hIdx}`, 'bone_ivory', '#e5dcc5', { lockVertical: false }));
      }
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'plumed_knight') {
      const dome = makeLatheProfile(
        [
          [hr * 0.94, 0.015],
          [hr * 1.04, 0.08],
          [hr * 1.02, 0.16],
          [hr * 0.78, 0.235],
          [hr * 0.36, 0.268],
          [0.008, 0.278],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      const visorRaw = makeBeveledBox(hw * 0.85, 0.056, 0.08, 0.014, '#141013', {
        offset: [0, 0.11, hw * 0.43],
      });
      const visor = subdivideGeometryLoop(visorRaw, 1, { defaultHex: '#141013' });
      visorRaw.dispose();
      const plumeHolder = makeBeveledBox(0.048, 0.06, 0.08, 0.012, pal.trim, {
        offset: [0, 0.27, -0.02],
      });
      const plume = makeSplineLoftGeometry(
        [
          [0, 0.295, 0.03],
          [0, 0.365, -0.05],
          [0, 0.31, -0.16],
          [0, 0.18, -0.22],
        ],
        [
          [0.02, 0.035],
          [0.036, 0.065],
          [0.032, 0.055],
          [0.015, 0.025],
        ],
        10,
        14,
        { colorHex: pal.secondary }
      );
      parts.push(
        tagPart(dome, 'plumed_dome', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(visor, 'plumed_visor', 'forged_steel', '#141013'),
        tagPart(plumeHolder, 'plumed_holder', 'brushed_gold', pal.trim),
        tagPart(plume, 'plumed_crest', 'woven_cloth', pal.secondary, { accentHex: pal.trim })
      );
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'plague_mask') {
      const hoodRaw = makeBeveledBox(hw, hh * 0.9, hw + 0.02, 0.032, pal.secondary, {
        offset: [0, 0.14, -0.015],
      });
      const hood = subdivideGeometryLoop(hoodRaw, 1, { defaultHex: pal.secondary });
      hoodRaw.dispose();
      const brim = makeLatheProfile(
        [
          [0.135, 0.22],
          [0.275, 0.23],
          [0.265, 0.25],
          [0.135, 0.256],
        ],
        16,
        pal.secondary,
        { smoothRadialNormals: true }
      );
      const beak = makeCurvedHornGeometry(8, 0.048, 0.008, 0.19, 0, -0.04, 8, '#d8cfb8');
      beak.rotateX(Math.PI * 0.56);
      beak.translate(0, 0.105, hw * 0.48);
      parts.push(
        tagPart(hood, 'plague_hood', 'stitched_leather', pal.secondary),
        tagPart(brim, 'plague_brim', 'stitched_leather', pal.secondary),
        tagPart(beak, 'plague_beak', 'bone_ivory', '#d8cfb8', { lockVertical: false })
      );
      bakeBoneParts('Head', parts, hStyle, { isMetal: false, inspectUvs: true });
    } else if (hStyle === 'assassin_cowl') {
      const cowlRaw = makeBeveledBox(hw, hh * 0.92, hw + 0.02, 0.032, pal.secondary, {
        offset: [0, 0.14, -0.018],
      });
      const cowl = subdivideGeometryLoop(cowlRaw, 1, { defaultHex: pal.secondary });
      cowlRaw.dispose();
      const maskRaw = makeBeveledBox(hw * 0.88, 0.095, 0.08, 0.018, '#18181b', {
        offset: [0, 0.075, hw * 0.41],
      });
      const mask = subdivideGeometryLoop(maskRaw, 1, { defaultHex: '#18181b' });
      maskRaw.dispose();
      const scarf = makeLatheProfile(
        [
          [hr * 1.04, 0.005],
          [hr * 1.1, 0.032],
          [hr * 0.98, 0.06],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      parts.push(
        tagPart(cowl, 'assassin_cowl', 'woven_cloth', pal.secondary, { accentHex: pal.trim }),
        tagPart(mask, 'assassin_mask', 'stitched_leather', '#18181b'),
        tagPart(scarf, 'assassin_scarf', 'woven_cloth', pal.primary)
      );
      bakeBoneParts('Head', parts, hStyle, { isMetal: false, inspectUvs: true });
    } else if (hStyle === 'samurai_kabuto') {
      const bowl = makeLatheProfile(
        [
          [hr * 1.04, 0.145],
          [hr * 1.02, 0.2],
          [hr * 0.7, 0.252],
          [0.008, 0.268],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      const shikoro = makePleatedTabardGeometry(hw * 0.96, hw * 1.24, 0.13, 0.032, 3, pal.secondary, {
        offset: [0, 0.1, -hr * 0.72],
        flareZ: -0.04,
      });
      const crestL = makeCurvedHornGeometry(6, 0.018, 0.005, 0.16, -0.03, 0.02, 6, pal.trim);
      crestL.rotateZ(0.45);
      crestL.translate(-0.045, 0.21, hr * 0.92);
      const crestR = makeCurvedHornGeometry(6, 0.018, 0.005, 0.16, 0.03, 0.02, 6, pal.trim);
      crestR.rotateZ(-0.45);
      crestR.translate(0.045, 0.21, hr * 0.92);
      parts.push(
        tagPart(bowl, 'kabuto_bowl', 'rarity_armor', pal.primary, { accentHex: pal.trim }),
        tagPart(shikoro, 'kabuto_shikoro', 'rarity_armor', pal.secondary),
        tagPart(crestL, 'kabuto_crest_l', 'brushed_gold', pal.trim, { lockVertical: false }),
        tagPart(crestR, 'kabuto_crest_r', 'brushed_gold', pal.trim, { lockVertical: false })
      );
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else if (hStyle === 'crown_king') {
      const band = makeLatheProfile(
        [
          [hr * 0.92, 0.18],
          [hr * 0.98, 0.205],
          [hr * 0.92, 0.232],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      parts.push(tagPart(band, 'crown_band', 'brushed_gold', pal.trim));
      for (const [pIdx, angle] of [0, 1, 2, 3, 4, 5].entries()) {
        const rad = (angle / 6) * Math.PI * 2;
        const spire = makeCurvedHornGeometry(5, 0.016, 0.003, pIdx % 2 === 0 ? 0.095 : 0.065, 0, 0, 6, pal.trim);
        spire.translate(Math.sin(rad) * (hr * 0.92), 0.228, Math.cos(rad) * (hr * 0.92));
        parts.push(tagPart(spire, `crown_spire_${pIdx}`, 'brushed_gold', pal.trim));
      }
      const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.038, 0), pal.glow);
      gem.translate(0, 0.215, hr * 0.96);
      parts.push(tagPart(gem, 'crown_gem', 'runic_glow', pal.glow, { lockVertical: false }));
      bakeBoneParts('Head', parts, hStyle, { isMetal: true, inspectUvs: true });
    } else {
      // wizard_hat
      const brim = makeLatheProfile(
        [
          [0.138, 0.215],
          [0.29 + tier * 0.01, 0.224],
          [0.28 + tier * 0.01, 0.246],
          [0.138, 0.252],
        ],
        16,
        pal.primary,
        { smoothRadialNormals: true }
      );
      const band = makeLatheProfile(
        [
          [0.168, 0.246],
          [0.16, 0.295],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      const cone = makeSplineLoftGeometry(
        [
          [0, 0.285, 0],
          [0, 0.4, -0.03],
          [0, 0.51 + tier * 0.01, -0.1],
          [0, 0.54 + tier * 0.012, -0.17],
        ],
        [0.155, 0.1, 0.048, 0.01],
        14,
        14,
        { colorHex: pal.secondary }
      );
      parts.push(
        tagPart(brim, 'mage_hat_brim', 'woven_cloth', pal.primary, { accentHex: pal.trim }),
        tagPart(band, 'mage_hat_band', 'brushed_gold', pal.trim),
        tagPart(cone, 'mage_hat_cone', 'woven_cloth', pal.secondary, { accentHex: pal.trim })
      );
      if (tier >= 3) {
        const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.045, 0), pal.glow);
        gem.translate(0, 0.27, 0.165);
        parts.push(tagPart(gem, 'mage_hat_gem', 'runic_glow', pal.glow, { lockVertical: false }));
      }
      bakeBoneParts('Head', parts, hStyle, { isMetal: false, inspectUvs: true });
    }
  } else if (slot === 'chest') {
    const cStyle = styleLoadout.chest;
    const sStyle = styleLoadout.shoulders;
    const isChestMetal =
      cStyle === 'plate_cuirass' ||
      cStyle === 'royal_tabard' ||
      cStyle === 'scale_mail' ||
      cStyle === 'samurai_do' ||
      cStyle === 'paladin_breastplate';
    const margin = isChestMetal ? SHELL_CLEARANCE.plateMargin : SHELL_CLEARANCE.clothMargin;
    const chestRecipe = isChestMetal
      ? 'rarity_armor'
      : cStyle === 'arcane_robe' || cStyle === 'necromancer_vest'
        ? 'woven_cloth'
        : 'stitched_leather';

    const beltParts: TaggedGeometryPart[] = [
      tagPart(
        makeAnatomicalTorsoGeometry(
          0.078,
          SHELL_CLEARANCE.pelvisHalfW + margin + 0.015,
          SHELL_CLEARANCE.pelvisHalfD + margin + 0.015,
          SHELL_CLEARANCE.pelvisHalfW + margin + 0.012,
          SHELL_CLEARANCE.pelvisHalfD + margin + 0.012,
          { radialSegs: 16, heightSegs: 4, hexColor: pal.secondary, musculature: 0.3 }
        ),
        'belt_strap',
        'stitched_leather',
        pal.secondary,
        { accentHex: pal.trim }
      ),
      tagPart(
        subdivideGeometryLoop(
          makeBeveledBox(0.095, 0.082, 0.05, 0.014, pal.trim, {
            offset: [0, 0.05, SHELL_CLEARANCE.pelvisHalfD + margin + 0.014],
          }),
          1,
          { defaultHex: pal.trim }
        ),
        'belt_buckle',
        'brushed_gold',
        pal.trim,
        { landmarkKind: 'chest_crest' }
      ),
    ];

    const tabardLenFront = cStyle === 'arcane_robe' ? 0.34 : cStyle === 'royal_tabard' ? 0.3 : 0.22 + tier * 0.008;
    const tabardLenBack = cStyle === 'arcane_robe' ? 0.38 : 0.28 + tier * 0.01;
    beltParts.push(
      tagPart(
        makePleatedTabardGeometry(0.16, tabardLenFront, 0.24, 0.032, 3, pal.secondary, {
          offset: [0, -0.07, SHELL_CLEARANCE.pelvisHalfD + margin + 0.008],
          flareZ: 0.024,
        }),
        'belt_tabard_front',
        cStyle === 'plate_cuirass' || cStyle === 'arcane_robe' || cStyle === 'royal_tabard'
          ? 'woven_cloth'
          : chestRecipe,
        pal.secondary,
        { accentHex: pal.trim }
      ),
      tagPart(
        makePleatedTabardGeometry(0.19, tabardLenBack, 0.28, 0.034, 3, pal.primary, {
          offset: [0, -0.09, -(SHELL_CLEARANCE.pelvisHalfD + margin + 0.008)],
          flareZ: -0.032,
        }),
        'belt_tabard_back',
        cStyle === 'arcane_robe' || cStyle === 'royal_tabard' ? 'woven_cloth' : chestRecipe,
        pal.primary,
        { accentHex: pal.trim }
      )
    );

    if (cStyle === 'plate_cuirass' || cStyle === 'royal_tabard' || cStyle === 'leather_brigandine') {
      for (const [tIdx, sx] of [-1, 1].entries()) {
        const tasset = makePleatedTabardGeometry(
          0.105,
          0.145 + tier * 0.006,
          0.19,
          0.036,
          2,
          pal.primary,
          { flareZ: 0.018 }
        );
        tasset.rotateY(sx * (Math.PI * 0.5));
        tasset.rotateZ(sx * -0.16);
        tasset.translate(sx * (SHELL_CLEARANCE.pelvisHalfW + margin + 0.005), -0.04, 0);
        beltParts.push(
          tagPart(tasset, `belt_tasset_${tIdx}`, chestRecipe, pal.primary, { accentHex: pal.trim })
        );
      }
    }
    bakeBoneParts('pelvis', beltParts, `${cStyle}`, { isMetal: isChestMetal });

    bakeBoneParts(
      'spine_01',
      [
        tagPart(
          makeAnatomicalTorsoGeometry(
            spine1Len * 1.05,
            SHELL_CLEARANCE.spine1HalfW + margin * 0.6,
            SHELL_CLEARANCE.spine1HalfD + margin * 0.6,
            SHELL_CLEARANCE.spine2HalfW + margin * 0.6,
            SHELL_CLEARANCE.spine2HalfD + margin * 0.6,
            { isArmored: isChestMetal, radialSegs: 16, heightSegs: 5, hexColor: pal.secondary }
          ),
          'chest_lower',
          chestRecipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
      ],
      `${cStyle}`,
      { isMetal: isChestMetal }
    );

    const midW = (SHELL_CLEARANCE.spine2HalfW + margin) * 2.02;
    const midD = (SHELL_CLEARANCE.spine2HalfD + margin) * 1.98;
    const midCuirass = makeAnatomicalTorsoGeometry(
      spine2Len * 1.1,
      SHELL_CLEARANCE.spine2HalfW + margin * 0.9,
      SHELL_CLEARANCE.spine2HalfD + margin * 0.9,
      SHELL_CLEARANCE.spine2HalfW + margin * 1.08,
      SHELL_CLEARANCE.spine2HalfD + margin * 1.05,
      { isArmored: isChestMetal, radialSegs: 18, heightSegs: 6, hexColor: pal.primary }
    );
    const midBand = makeAnatomicalTorsoGeometry(
      0.048,
      midW * 0.49,
      midD * 0.5,
      midW * 0.49,
      midD * 0.5,
      { radialSegs: 16, heightSegs: 4, hexColor: pal.trim, musculature: 0.25 }
    );
    midBand.translate(0, spine2Len * 0.14, 0);
    const crossBelt = makeSplineLoftGeometry(
      [
        [-midW * 0.48, spine2Len * 0.15, midD * 0.46],
        [0, spine2Len * 0.54, midD * 0.54],
        [midW * 0.48, spine2Len * 0.92, midD * 0.44],
      ],
      [0.022, 0.024, 0.022],
      8,
      10,
      { colorHex: pal.trim }
    );

    bakeBoneParts(
      'spine_02',
      [
        tagPart(midCuirass, 'chest_mid', chestRecipe, pal.primary, {
          accentHex: pal.trim,
          landmarkKind: 'chest_crest',
        }),
        tagPart(midBand, 'chest_band', 'brushed_gold', pal.trim),
        tagPart(crossBelt, 'chest_cross_strap', 'stitched_leather', pal.trim),
      ],
      `${cStyle}`,
      { isMetal: isChestMetal }
    );

    const upW = (SHELL_CLEARANCE.spine3HalfW + margin) * 2.08;
    const upD = (SHELL_CLEARANCE.spine3HalfD + margin) * 2.08;
    const upperCuirass = makeAnatomicalTorsoGeometry(
      spine3Len * 0.96,
      SHELL_CLEARANCE.spine2HalfW + margin * 1.04,
      SHELL_CLEARANCE.spine2HalfD + margin * 1.02,
      SHELL_CLEARANCE.spine3HalfW + margin * 1.12,
      SHELL_CLEARANCE.spine3HalfD + margin * 1.06,
      { isArmored: isChestMetal, radialSegs: 18, heightSegs: 7, hexColor: pal.primary }
    );
    const gorgetCollar = makeLatheProfile(
      [
        [0.108, spine3Len * 0.85],
        [0.132, spine3Len * 0.92],
        [0.114, spine3Len * 1.0],
      ],
      16,
      pal.trim,
      { smoothRadialNormals: true }
    );
    const topParts: TaggedGeometryPart[] = [
      tagPart(upperCuirass, 'chest_upper', chestRecipe, pal.primary, { accentHex: pal.trim }),
      tagPart(gorgetCollar, 'chest_gorget_collar', 'brushed_gold', pal.trim),
    ];

    if (cStyle === 'plate_cuirass' || cStyle === 'royal_tabard') {
      const crest = subdivideGeometryLoop(
        makeBeveledBox(0.125, 0.125, 0.048, 0.014, pal.secondary, {
          offset: [0, spine3Len * 0.48, upD * 0.51],
        }),
        1,
        { defaultHex: pal.secondary }
      );
      const backGuard = subdivideGeometryLoop(
        makeBeveledBox(0.24, 0.16, 0.045, 0.014, pal.secondary, {
          offset: [0, spine3Len * 0.52, -upD * 0.5],
        }),
        1,
        { defaultHex: pal.secondary }
      );
      topParts.push(
        tagPart(crest, 'chest_crest', 'rarity_armor', pal.secondary, {
          landmarkKind: 'chest_crest',
          accentHex: pal.trim,
        }),
        tagPart(backGuard, 'chest_dorsal_plate', 'rarity_armor', pal.secondary, {
          accentHex: pal.trim,
        })
      );
    } else if (cStyle === 'ranger_coat') {
      const quiver = makeLatheProfile(
        [
          [0.042, -0.18],
          [0.056, 0.16],
          [0.06, 0.18],
        ],
        12,
        pal.secondary,
        { smoothRadialNormals: true }
      );
      quiver.rotateZ(-0.42);
      quiver.translate(-0.08, 0.08, -upD * 0.56);
      const arrows = makeBeveledBox(0.085, 0.08, 0.085, 0.012, pal.trim);
      arrows.rotateZ(-0.42);
      arrows.translate(-0.16, 0.26, -upD * 0.56);
      topParts.push(
        tagPart(quiver, 'archer_quiver', 'stitched_leather', pal.secondary, { accentHex: pal.trim }),
        tagPart(arrows, 'archer_fletching', 'woven_cloth', pal.trim)
      );
    } else if (cStyle === 'arcane_robe' || cStyle === 'necromancer_vest') {
      const mantle = makeLatheProfile(
        [
          [upW * 0.5, spine3Len * 0.72],
          [upW * 0.56, spine3Len * 0.8],
          [upW * 0.46, spine3Len * 0.88],
        ],
        16,
        pal.trim,
        { smoothRadialNormals: true }
      );
      const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.052, 0), pal.glow);
      rune.translate(0, spine3Len * 0.48, upD * 0.53);
      topParts.push(
        tagPart(mantle, 'mage_mantle', 'brushed_gold', pal.trim),
        tagPart(rune, 'mage_chest_rune', 'runic_glow', pal.glow, { lockVertical: false })
      );
      if (cStyle === 'necromancer_vest') {
        const collar = makePleatedTabardGeometry(upW * 0.9, upW * 1.15, 0.12, 0.028, 3, pal.secondary, {
          offset: [0, spine3Len * 0.94, -upD * 0.35],
          flareZ: -0.04,
        });
        topParts.push(tagPart(collar, 'necro_collar', 'woven_cloth', pal.secondary));
      }
    } else if (cStyle === 'paladin_breastplate' || cStyle === 'scale_mail' || cStyle === 'samurai_do') {
      const crest = makeBeveledBox(0.11, 0.12, 0.04, 0.012, pal.trim, {
        offset: [0, spine3Len * 0.5, upD * 0.51],
      });
      topParts.push(tagPart(crest, `${cStyle}_crest`, 'brushed_gold', pal.trim));
      if (cStyle === 'samurai_do') {
        for (const rIdx of [0, 1]) {
          const lame = makeAnatomicalTorsoGeometry(
            0.036,
            upW * 0.51,
            upD * 0.51,
            upW * 0.52,
            upD * 0.52,
            { isArmored: true, radialSegs: 16, heightSegs: 4, hexColor: pal.secondary }
          );
          lame.translate(0, spine3Len * (0.28 + rIdx * 0.36), 0);
          topParts.push(tagPart(lame, `samurai_lame_${rIdx}`, 'rarity_armor', pal.secondary));
        }
      }
    }

    // Back slot dorsal attachments (mounted cleanly behind spine_03)
    const bStyle = styleLoadout.back ?? 'none';
    if (bStyle === 'short_cloak') {
      const cloak = makePleatedTabardGeometry(0.28, 0.56, 0.36, 0.034, 4, pal.secondary, {
        offset: [0, spine3Len * 0.72, -(upD * 0.54)],
        flareZ: -0.09,
      });
      const clasp = makeBeveledBox(0.26, 0.048, 0.045, 0.01, pal.trim, {
        offset: [0, spine3Len * 0.88, -(upD * 0.45)],
      });
      topParts.push(
        tagPart(cloak, 'back_cloak', 'woven_cloth', pal.secondary, { accentHex: pal.trim }),
        tagPart(clasp, 'back_cloak_clasp', 'brushed_gold', pal.trim)
      );
    } else if (bStyle === 'quiver_pack') {
      const quiver = makeLatheProfile(
        [
          [0.042, -0.18],
          [0.058, 0.2],
        ],
        12,
        '#5c3a28',
        { smoothRadialNormals: true }
      );
      quiver.rotateZ(-0.4);
      quiver.translate(-0.07, 0.09, -(upD * 0.58));
      const arrows = makeBeveledBox(0.09, 0.08, 0.09, 0.012, pal.trim);
      arrows.rotateZ(-0.4);
      arrows.translate(-0.15, 0.28, -(upD * 0.58));
      topParts.push(
        tagPart(quiver, 'back_quiver', 'stitched_leather', '#5c3a28', { accentHex: pal.trim }),
        tagPart(arrows, 'back_quiver_arrows', 'woven_cloth', pal.trim)
      );
    } else if (bStyle === 'adventurer_backpack') {
      const pack = makeBeveledBox(0.26, 0.3, 0.16, 0.025, '#6d4b36', {
        offset: [0, spine3Len * 0.45, -(upD * 0.5 + 0.085)],
      });
      const bedroll = makeLatheProfile(
        [
          [0.055, -0.14],
          [0.055, 0.14],
        ],
        12,
        pal.secondary,
        { smoothRadialNormals: true }
      );
      bedroll.rotateZ(Math.PI * 0.5);
      bedroll.translate(0, spine3Len * 0.92, -(upD * 0.5 + 0.08));
      const buckle = makeBeveledBox(0.18, 0.045, 0.04, 0.008, pal.trim, {
        offset: [0, spine3Len * 0.48, -(upD * 0.5 + 0.165)],
      });
      topParts.push(
        tagPart(pack, 'back_pack', 'stitched_leather', '#6d4b36'),
        tagPart(bedroll, 'back_bedroll', 'woven_cloth', pal.secondary, { lockVertical: false }),
        tagPart(buckle, 'back_pack_buckle', 'brushed_gold', pal.trim)
      );
    } else if (bStyle === 'wings_valkyrie') {
      for (const [wIdx, sx] of [-1, 1].entries()) {
        const wingMain = makeSplineLoftGeometry(
          [
            [sx * 0.06, spine3Len * 0.7, -(upD * 0.52)],
            [sx * 0.2, spine3Len * 1.1, -(upD * 0.6)],
            [sx * 0.36, spine3Len * 1.45, -(upD * 0.7)],
          ],
          [
            [0.025, 0.045],
            [0.04, 0.09],
            [0.015, 0.035],
          ],
          10,
          12,
          { colorHex: pal.trim }
        );
        const wingInner = makeSplineLoftGeometry(
          [
            [sx * 0.05, spine3Len * 0.62, -(upD * 0.5)],
            [sx * 0.16, spine3Len * 0.86, -(upD * 0.56)],
            [sx * 0.25, spine3Len * 1.04, -(upD * 0.62)],
          ],
          [
            [0.02, 0.035],
            [0.03, 0.065],
            [0.01, 0.025],
          ],
          8,
          10,
          { colorHex: pal.glow }
        );
        topParts.push(
          tagPart(wingMain, `back_wing_main_${wIdx}`, 'brushed_gold', pal.trim),
          tagPart(wingInner, `back_wing_inner_${wIdx}`, 'runic_glow', pal.glow)
        );
      }
    } else if (bStyle === 'banner_crest') {
      const pole = makeLatheProfile(
        [
          [0.016, -0.05],
          [0.016, 0.72],
        ],
        10,
        '#4f3428'
      );
      pole.translate(0, spine3Len * 0.5, -(upD * 0.58));
      const crossbar = makeBeveledBox(0.26, 0.028, 0.028, 0.006, pal.trim, {
        offset: [0, spine3Len * 0.5 + 0.68, -(upD * 0.58)],
      });
      const cloth = makePleatedTabardGeometry(0.22, 0.26, 0.46, 0.022, 3, pal.primary, {
        offset: [0, spine3Len * 0.5 + 0.44, -(upD * 0.6)],
        flareZ: -0.02,
      });
      topParts.push(
        tagPart(pole, 'back_banner_pole', 'wood_planks', '#4f3428'),
        tagPart(crossbar, 'back_banner_bar', 'brushed_gold', pal.trim),
        tagPart(cloth, 'back_banner_cloth', 'woven_cloth', pal.primary, { accentHex: pal.trim })
      );
    }

    bakeBoneParts('spine_03', topParts, `${cStyle}_${bStyle}`, { isMetal: isChestMetal });

    // Upper arms + decoupled Sculpted Pauldron style
    for (const side of ['l', 'r'] as const) {
      const armR = SHELL_CLEARANCE.upperArmR + margin;
      const armParts: TaggedGeometryPart[] = [
        tagPart(
          makeSculptedLimbGeometry(uArm * 0.88, armR, armR, armR - 0.008, armR - 0.008, {
            profile: isChestMetal ? 'armor_limb' : 'bicep',
            radialSegs: 10,
            heightSegs: 5,
            hexColor: pal.secondary,
          }),
          `arm_sleeve_${side}`,
          chestRecipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
      ];

      const mountSide =
        sStyle === 'heavy_pauldrons' ||
        sStyle === 'fur_leather' ||
        sStyle === 'arcane_mantle' ||
        (sStyle === 'asym_duelist' && side === 'l');

      if (mountSide) {
        const isPauldronMetal = sStyle === 'heavy_pauldrons';
        const pW = sStyle === 'heavy_pauldrons' ? 0.198 + tier * 0.008 : 0.162;
        const pH = sStyle === 'heavy_pauldrons' ? 0.168 : 0.128;
        const pauldron = makePauldronShellGeometry(pW, pH, pW * 1.14, 0.036, pal.primary);
        if (side === 'r') pauldron.rotateY(Math.PI);
        // Anatomical clearance outward & upward so upperarm never clips spine_03
        pauldron.translate(side === 'l' ? 0.018 : -0.018, 0.026, 0);
        armParts.push(
          tagPart(
            pauldron,
            `pauldron_${side}`,
            isPauldronMetal ? 'rarity_armor' : 'stitched_leather',
            pal.primary,
            { accentHex: pal.trim, lockVertical: true }
          )
        );
        if (tier >= 2 || sStyle === 'arcane_mantle') {
          const rim = makeLatheProfile(
            [
              [pW * 0.48, -0.014],
              [pW * 0.56, 0.004],
              [pW * 0.48, 0.022],
            ],
            10,
            pal.trim,
            { smoothRadialNormals: true }
          );
          rim.translate(side === 'l' ? 0.014 : -0.014, 0.004, 0);
          armParts.push(tagPart(rim, `pauldron_rim_${side}`, 'brushed_gold', pal.trim));
        }
        if (sStyle === 'heavy_pauldrons' && tier >= 4) {
          const spike = makeCurvedHornGeometry(6, 0.034, 0.005, 0.12, side === 'l' ? 0.03 : -0.03, 0, 8, pal.trim);
          spike.translate(side === 'l' ? 0.045 : -0.045, 0.06, 0);
          armParts.push(tagPart(spike, `pauldron_spike_${side}`, 'brushed_gold', pal.trim));
        }
      }
      bakeBoneParts(`upperarm_${side}`, armParts, `${cStyle}_${sStyle}`, {
        isMetal: isChestMetal || sStyle === 'heavy_pauldrons',
      });
    }
  } else if (slot === 'legs') {
    const lStyle = styleLoadout.legs;
    const isMetal = lStyle === 'plate_cuisses';
    const margin = isMetal ? SHELL_CLEARANCE.plateMargin : SHELL_CLEARANCE.clothMargin;
    const recipe = isMetal ? 'rarity_armor' : lStyle === 'battle_kilt' ? 'woven_cloth' : 'stitched_leather';

    for (const side of ['l', 'r'] as const) {
      const sx = side === 'l' ? 1 : -1;
      const topR = SHELL_CLEARANCE.thighR + margin;
      const botR = topR - 0.016;
      const parts: TaggedGeometryPart[] = [
        tagPart(
          makeSculptedLimbGeometry(thigh * 0.88, topR, topR, botR, botR, {
            profile: isMetal ? 'armor_limb' : 'thigh',
            radialSegs: 10,
            heightSegs: 5,
            hexColor: pal.primary,
          }),
          `thigh_guard_${side}`,
          recipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
      ];

      if (lStyle === 'plate_cuisses' || lStyle === 'battle_kilt') {
        const skirtW = lStyle === 'battle_kilt' ? 0.135 : 0.11;
        const flaredCuisse = makePleatedTabardGeometry(
          skirtW,
          0.15 + tier * 0.006,
          thigh * 0.64,
          0.034,
          2,
          pal.secondary,
          { flareZ: 0.018 }
        );
        flaredCuisse.rotateY(sx * (Math.PI * 0.5));
        flaredCuisse.rotateZ(sx * -0.12);
        flaredCuisse.translate(sx * (topR * 0.84), thigh * 0.36, 0);
        parts.push(
          tagPart(flaredCuisse, `thigh_cuisse_skirt_${side}`, recipe, pal.secondary, {
            accentHex: pal.trim,
          })
        );
      }

      if (lStyle === 'plate_cuisses' || tier >= 2) {
        const kneecap = makeBeveledBox(0.145, 0.092, 0.15, 0.02, pal.trim, {
          offset: [0, thigh * 0.86, 0.02],
        });
        parts.push(
          tagPart(
            kneecap,
            `kneecap_${side}`,
            isMetal ? 'brushed_gold' : 'stitched_leather',
            pal.trim
          )
        );
      }
      if (isMetal && tier >= 3) {
        const kneeFin = makeBeveledBox(0.06, 0.11, 0.075, 0.014, pal.primary, {
          offset: [sx * 0.07, thigh * 0.86, 0.025],
        });
        parts.push(
          tagPart(kneeFin, `knee_wing_${side}`, recipe, pal.primary, { accentHex: pal.trim })
        );
      }
      bakeBoneParts(`thigh_${side}`, parts, lStyle, { isMetal });
    }
  } else if (slot === 'boots') {
    const bStyle = styleLoadout.boots;
    const isMetal = bStyle === 'steel_sabatons';
    const margin = isMetal ? SHELL_CLEARANCE.plateMargin : SHELL_CLEARANCE.clothMargin;
    const recipe = isMetal ? 'rarity_armor' : 'stitched_leather';

    for (const side of ['l', 'r'] as const) {
      const cR = SHELL_CLEARANCE.calfR + margin;
      const cuff = makeLatheProfile(
        [
          [cR * 0.96, calf * 0.3],
          [cR * 1.12, calf * 0.34],
          [cR * 0.96, calf * 0.38],
        ],
        10,
        pal.trim,
        { smoothRadialNormals: true }
      );
      const calfParts: TaggedGeometryPart[] = [
        tagPart(
          makeSculptedLimbGeometry(calf * 0.74, cR - 0.004, cR - 0.004, cR + 0.006, cR + 0.006, {
            profile: isMetal ? 'armor_limb' : 'calf',
            radialSegs: 10,
            heightSegs: 5,
            hexColor: pal.secondary,
          }),
          `greave_${side}`,
          recipe,
          pal.secondary,
          { accentHex: pal.trim }
        ),
        tagPart(
          cuff,
          `boot_cuff_${side}`,
          isMetal ? 'brushed_gold' : 'stitched_leather',
          pal.trim
        ),
      ];
      if (bStyle === 'steel_sabatons' || bStyle === 'light_greaves') {
        const shinCrest = makeSplineLoftGeometry(
          [
            [0, calf * 0.08, cR * 0.92],
            [0, calf * 0.36, cR * 1.12],
            [0, calf * 0.64, cR * 0.94],
          ],
          [0.018, 0.026, 0.016],
          6,
          6,
          { colorHex: pal.trim }
        );
        calfParts.push(
          tagPart(
            shinCrest,
            `greave_shin_crest_${side}`,
            isMetal ? 'brushed_gold' : 'stitched_leather',
            pal.trim
          )
        );
      }
      bakeBoneParts(`calf_${side}`, calfParts, bStyle, { isMetal });

      const fR = SHELL_CLEARANCE.footR + margin * 0.7;
      const footParts: TaggedGeometryPart[] = [
        tagPart(
          makeSculptedLimbGeometry(0.175, fR, fR + 0.008, fR - 0.005, fR, {
            profile: isMetal ? 'armor_limb' : 'taper',
            radialSegs: 10,
            heightSegs: 4,
            hexColor: pal.primary,
          }),
          `sabaton_${side}`,
          recipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
      ];
      if (isMetal && tier >= 3) {
        const toe = makeBeveledBox(0.11, 0.052, 0.065, 0.012, pal.trim, {
          offset: [0, 0.15, 0.02],
        });
        footParts.push(tagPart(toe, `sabaton_toe_${side}`, 'brushed_gold', pal.trim));
      }
      bakeBoneParts(`foot_${side}`, footParts, bStyle, { isMetal });
    }
  } else if (slot === 'gloves') {
    const gStyle = styleLoadout.gloves;
    const isMetal = gStyle === 'heavy_gauntlets';
    const margin = isMetal ? SHELL_CLEARANCE.plateMargin * 0.85 : SHELL_CLEARANCE.clothMargin;
    const recipe = isMetal ? 'rarity_armor' : gStyle === 'arcane_cuffs' ? 'woven_cloth' : 'stitched_leather';

    for (const side of ['l', 'r'] as const) {
      const sx = side === 'l' ? 1 : -1;
      const aR = SHELL_CLEARANCE.lowerArmR + margin;
      const elbowCop = makeBeveledBox(0.115, 0.078, 0.115, 0.016, pal.trim, {
        offset: [sx * 0.018, 0.04, -0.022],
      });
      const bracerParts: TaggedGeometryPart[] = [
        tagPart(
          makeSculptedLimbGeometry(lArm * 0.64, aR, aR, aR + 0.006, aR + 0.006, {
            profile: isMetal ? 'armor_limb' : 'forearm',
            radialSegs: 10,
            heightSegs: 4,
            hexColor: pal.primary,
          }),
          `bracer_${side}`,
          recipe,
          pal.primary,
          { accentHex: pal.trim }
        ),
        tagPart(
          elbowCop,
          `elbow_cop_${side}`,
          isMetal ? 'brushed_gold' : 'stitched_leather',
          pal.trim
        ),
      ];
      if (tier >= 2 || gStyle === 'arcane_cuffs') {
        const rim = makeLatheProfile(
          [
            [aR * 0.98, lArm * 0.52],
            [aR * 1.14, lArm * 0.56],
            [aR * 0.98, lArm * 0.6],
          ],
          10,
          pal.trim,
          { smoothRadialNormals: true }
        );
        bracerParts.push(tagPart(rim, `bracer_cuff_${side}`, 'brushed_gold', pal.trim));
      }
      bakeBoneParts(`lowerarm_${side}`, bracerParts, gStyle, { isMetal });

      const hR = SHELL_CLEARANCE.handR + margin * 0.75;
      bakeBoneParts(
        `hand_${side}`,
        [
          tagPart(
            makeSculptedLimbGeometry(0.115, hR, hR, hR - 0.006, hR - 0.006, {
              profile: 'armor_limb',
              radialSegs: 8,
              heightSegs: 4,
              hexColor: pal.secondary,
            }),
            `gauntlet_${side}`,
            recipe,
            pal.secondary,
            { accentHex: pal.trim }
          ),
        ],
        gStyle,
        { isMetal }
      );
    }
  } else if (slot === 'weapon') {
    const mainStyle = styleLoadout.weaponMain;
    const offStyle = styleLoadout.weaponOffhand;
    const gY = WEAPON_MOUNT_SPEC.handGripCenterY;
    const gZ = WEAPON_MOUNT_SPEC.handGripCenterZ;

    // 1. Main Weapon (hand_r, except recurve_bow which mounts on hand_l)
    if (mainStyle === 'recurve_bow') {
      const bow = makeRecurveBowGeometry(1.16, 0.22, 0.046, pal.primary);
      const riser = makeBeveledBox(0.062, 0.28, 0.072, 0.012, pal.trim);
      const stringBar = makeBeveledBox(0.024, 1.0, 0.024, 0.004, '#dae0ea', {
        offset: [0, 0, -0.14],
      });
      for (const g of [bow, riser, stringBar]) {
        g.translate(0, WEAPON_MOUNT_SPEC.bowGripOffsetY, WEAPON_MOUNT_SPEC.bowGripOffsetZ);
      }
      bakeBoneParts(
        'hand_l',
        [
          tagPart(bow, 'archer_bow', 'wood_planks', pal.primary, { accentHex: pal.trim }),
          tagPart(riser, 'archer_riser', 'brushed_gold', pal.trim),
          tagPart(stringBar, 'archer_string', 'bone_ivory', '#dae0ea'),
        ],
        mainStyle,
        { isMetal: false }
      );
    } else if (mainStyle === 'longsword' || mainStyle === 'greatsword' || mainStyle === 'dagger') {
      const isHeavy = mainStyle === 'greatsword';
      const isDagger = mainStyle === 'dagger';
      const gripLen = isHeavy ? 0.22 : isDagger ? 0.09 : 0.13;
      const grip = makeLatheProfile(
        [
          [0.024, -gripLen],
          [0.02, -gripLen * 0.2],
          [0.022, gripLen * 0.8],
        ],
        12,
        '#3b1725',
        { smoothRadialNormals: true }
      );
      grip.rotateX(Math.PI * 0.5);
      grip.translate(0, gY, gZ);

      const pommel = makeLatheProfile(
        [
          [0.012, -0.04],
          [0.038, -0.015],
          [0.036, 0.015],
          [0.018, 0.035],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      pommel.rotateX(Math.PI * 0.5);
      pommel.translate(0, gY, gZ - gripLen - 0.02);

      const guardW = isHeavy ? 0.36 + tier * 0.02 : isDagger ? 0.16 : 0.26 + tier * 0.015;
      const guard = makeSplineLoftGeometry(
        [
          [-guardW * 0.5, gY, gZ + gripLen * 0.88 + 0.025],
          [-guardW * 0.25, gY, gZ + gripLen * 0.85],
          [0, gY, gZ + gripLen * 0.84],
          [guardW * 0.25, gY, gZ + gripLen * 0.85],
          [guardW * 0.5, gY, gZ + gripLen * 0.88 + 0.025],
        ],
        [
          [0.014, 0.018],
          [0.022, 0.028],
          [0.028, 0.034],
          [0.022, 0.028],
          [0.014, 0.018],
        ],
        10,
        12,
        { colorHex: pal.trim }
      );
      const bladeLen = isHeavy ? 1.08 + tier * 0.05 : isDagger ? 0.38 + tier * 0.02 : 0.72 + tier * 0.04;
      const bladeW = isHeavy ? 0.135 + tier * 0.01 : isDagger ? 0.065 : 0.102 + tier * 0.008;
      const blade = makeSwordBladeGeometry(bladeW, 0.04, bladeLen * 0.82, bladeLen * 0.22, pal.primary);
      blade.rotateX(Math.PI * 0.5);
      blade.translate(0, gY, gZ + gripLen * 0.95);

      bakeBoneParts(
        'hand_r',
        [
          tagPart(grip, 'sw_grip', 'stitched_leather', '#3b1725', { lockVertical: false }),
          tagPart(pommel, 'sw_pommel', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(guard, 'sw_guard', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(blade, 'sw_blade', tier >= 3 ? 'rarity_armor' : 'forged_steel', pal.primary, {
            accentHex: pal.glow,
            lockVertical: false,
          }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'battleaxe') {
      const haft = makeLatheProfile(
        [
          [0.028, -0.22],
          [0.022, 0.05],
          [0.028, 0.58],
        ],
        12,
        '#4f3428',
        { smoothRadialNormals: true }
      );
      haft.rotateX(Math.PI * 0.5);
      haft.translate(0, gY, gZ + 0.06);
      const collar = makeLatheProfile(
        [
          [0.042, -0.06],
          [0.048, 0],
          [0.042, 0.06],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      collar.rotateX(Math.PI * 0.5);
      collar.translate(0, gY, gZ + 0.48);
      const axeHead = makeAxeHeadGeometry(0.24 + tier * 0.014, 0.28 + tier * 0.014, 0.052, true, pal.primary);
      axeHead.rotateX(Math.PI * 0.5);
      axeHead.translate(0, gY, gZ + 0.49);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(haft, 'axe_haft', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(collar, 'axe_collar', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(axeHead, 'axe_blade_double', 'rarity_armor', pal.primary, {
            accentHex: pal.glow,
            lockVertical: false,
          }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'warhammer') {
      const haft = makeLatheProfile(
        [
          [0.028, -0.22],
          [0.022, 0.05],
          [0.028, 0.56],
        ],
        12,
        '#4f3428',
        { smoothRadialNormals: true }
      );
      haft.rotateX(Math.PI * 0.5);
      haft.translate(0, gY, gZ + 0.06);
      const head = subdivideGeometryLoop(
        makeBeveledBox(0.32 + tier * 0.02, 0.16, 0.17, 0.024, pal.primary, {
          offset: [0, gY, gZ + 0.52],
        }),
        1,
        { defaultHex: pal.primary }
      );
      const bands = makeLatheProfile(
        [
          [0.095, -0.032],
          [0.105, 0],
          [0.095, 0.032],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      bands.rotateX(Math.PI * 0.5);
      bands.translate(0, gY, gZ + 0.52);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(haft, 'hammer_haft', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(head, 'hammer_head', 'rarity_armor', pal.primary, {
            accentHex: pal.glow,
            lockVertical: false,
          }),
          tagPart(bands, 'hammer_bands', 'brushed_gold', pal.trim, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'spear') {
      const pole = makeLatheProfile(
        [
          [0.024, -0.45],
          [0.026, 0.92],
        ],
        12,
        '#6d4b36',
        { smoothRadialNormals: true }
      );
      pole.rotateX(Math.PI * 0.5);
      pole.translate(0, gY, gZ + 0.08);
      const collar = makeLatheProfile(
        [
          [0.04, -0.04],
          [0.048, 0],
          [0.036, 0.04],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      collar.rotateX(Math.PI * 0.5);
      collar.translate(0, gY, gZ + 0.96);
      const tip = makeSwordBladeGeometry(0.11, 0.042, 0.24, 0.18, pal.primary);
      tip.rotateX(Math.PI * 0.5);
      tip.translate(0, gY, gZ + 0.98);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(pole, 'spear_pole', 'wood_planks', '#6d4b36', { lockVertical: false }),
          tagPart(collar, 'spear_collar', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(tip, 'spear_tip', 'forged_steel', pal.primary, {
            accentHex: pal.glow,
            lockVertical: false,
          }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'crossbow') {
      const stock = subdivideGeometryLoop(
        makeBeveledBox(0.068, 0.085, 0.52, 0.014, '#4f3428', {
          offset: [0, gY + 0.01, gZ + 0.14],
        }),
        1,
        { defaultHex: '#4f3428' }
      );
      const prod = makeRecurveBowGeometry(0.58, 0.12, 0.038, pal.primary);
      prod.rotateZ(Math.PI * 0.5);
      prod.translate(0, gY + 0.02, gZ + 0.36);
      const bolt = makeSwordBladeGeometry(0.034, 0.02, 0.26, 0.08, pal.trim);
      bolt.rotateX(Math.PI * 0.5);
      bolt.translate(0, gY + 0.06, gZ + 0.08);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(stock, 'xbow_stock', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(prod, 'xbow_prod', 'rarity_armor', pal.primary, { lockVertical: false }),
          tagPart(bolt, 'xbow_bolt', 'brushed_gold', pal.trim, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: false }
      );
    } else if (mainStyle === 'halberd') {
      const pole = makeLatheProfile(
        [
          [0.024, -0.45],
          [0.028, 0.98],
        ],
        12,
        '#4f3428',
        { smoothRadialNormals: true }
      );
      pole.rotateX(Math.PI * 0.5);
      pole.translate(0, gY, gZ + 0.08);
      const axeBlade = makeAxeHeadGeometry(0.24, 0.28, 0.038, false, pal.primary);
      axeBlade.rotateX(Math.PI * 0.5);
      axeBlade.translate(0, gY, gZ + 0.88);
      const spike = makeSwordBladeGeometry(0.085, 0.036, 0.22, 0.16, pal.primary);
      spike.rotateX(Math.PI * 0.5);
      spike.translate(0, gY, gZ + 1.04);
      const hook = makeCurvedHornGeometry(6, 0.022, 0.004, 0.12, -0.04, 0.02, 6, pal.trim);
      hook.rotateZ(Math.PI * 0.5);
      hook.translate(-0.02, gY, gZ + 0.92);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(pole, 'halberd_pole', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(axeBlade, 'halberd_axe', 'rarity_armor', pal.primary, { accentHex: pal.glow, lockVertical: false }),
          tagPart(spike, 'halberd_spike', 'forged_steel', pal.primary, { lockVertical: false }),
          tagPart(hook, 'halberd_hook', 'brushed_gold', pal.trim, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'scythe') {
      const pole = makeSplineLoftGeometry(
        [
          [0, gY, gZ - 0.34],
          [0, gY + 0.02, gZ + 0.3],
          [0, gY, gZ + 0.96],
        ],
        [0.024, 0.026, 0.028],
        12,
        14,
        { colorHex: '#3b2820' }
      );
      const collar = makeLatheProfile(
        [
          [0.04, -0.06],
          [0.046, 0],
          [0.04, 0.06],
        ],
        10,
        pal.trim,
        { smoothRadialNormals: true }
      );
      collar.rotateX(Math.PI * 0.5);
      collar.translate(0, gY, gZ + 0.98);
      const scytheBlade = makeSplineLoftGeometry(
        [
          [0, gY, gZ + 0.98],
          [0.2, gY, gZ + 0.99],
          [0.36, gY, gZ + 0.9],
          [0.44, gY, gZ + 0.72],
        ],
        [
          [0.048, 0.014],
          [0.045, 0.013],
          [0.032, 0.01],
          [0.008, 0.004],
        ],
        8,
        14,
        { colorHex: pal.primary }
      );
      bakeBoneParts(
        'hand_r',
        [
          tagPart(pole, 'scythe_pole', 'wood_planks', '#3b2820', { lockVertical: false }),
          tagPart(collar, 'scythe_collar', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(scytheBlade, 'scythe_blade_a', 'forged_steel', pal.primary, { accentHex: pal.glow, lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'flail') {
      const haft = makeLatheProfile(
        [
          [0.024, -0.18],
          [0.026, 0.36],
        ],
        10,
        '#4f3428',
        { smoothRadialNormals: true }
      );
      haft.rotateX(Math.PI * 0.5);
      haft.translate(0, gY, gZ + 0.05);
      const chain = makeSplineLoftGeometry(
        [
          [0, gY, gZ + 0.41],
          [0, gY - 0.03, gZ + 0.54],
          [0, gY - 0.06, gZ + 0.66],
        ],
        [0.016, 0.014, 0.016],
        8,
        10,
        { colorHex: pal.trim }
      );
      const ball = prepareColoredPart(new THREE.IcosahedronGeometry(0.115, 1), pal.primary);
      ball.translate(0, gY - 0.06, gZ + 0.68);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(haft, 'flail_haft', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(chain, 'flail_chain', 'forged_steel', pal.trim, { lockVertical: false }),
          tagPart(ball, 'flail_ball', 'rarity_armor', pal.primary, { accentHex: pal.glow, lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'katana') {
      const grip = makeLatheProfile(
        [
          [0.022, -0.16],
          [0.022, 0.14],
        ],
        10,
        '#1f2937',
        { smoothRadialNormals: true }
      );
      grip.rotateX(Math.PI * 0.5);
      grip.translate(0, gY, gZ);
      const tsuba = makeLatheProfile(
        [
          [0.065, -0.012],
          [0.065, 0.012],
        ],
        14,
        pal.trim,
        { smoothRadialNormals: true }
      );
      tsuba.rotateX(Math.PI * 0.5);
      tsuba.translate(0, gY, gZ + 0.14);
      const blade = makeSwordBladeGeometry(0.056, 0.024, 0.72, 0.18, pal.primary);
      blade.rotateX(Math.PI * 0.5 - 0.05);
      blade.translate(0, gY + 0.02, gZ + 0.16);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(grip, 'katana_grip', 'stitched_leather', '#1f2937', { lockVertical: false }),
          tagPart(tsuba, 'katana_tsuba', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(blade, 'katana_blade', 'forged_steel', pal.primary, { accentHex: pal.glow, lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'twin_blade') {
      const grip = makeLatheProfile(
        [
          [0.024, -0.16],
          [0.024, 0.16],
        ],
        10,
        '#3b1725',
        { smoothRadialNormals: true }
      );
      grip.rotateX(Math.PI * 0.5);
      grip.translate(0, gY, gZ);
      const bladeF = makeSwordBladeGeometry(0.08, 0.032, 0.48, 0.16, pal.primary);
      bladeF.rotateX(Math.PI * 0.5);
      bladeF.translate(0, gY, gZ + 0.16);
      const bladeB = makeSwordBladeGeometry(0.08, 0.032, 0.48, 0.16, pal.primary);
      bladeB.rotateX(-Math.PI * 0.5);
      bladeB.translate(0, gY, gZ - 0.16);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(grip, 'twin_grip', 'stitched_leather', '#3b1725', { lockVertical: false }),
          tagPart(bladeF, 'twin_blade_f', 'rarity_armor', pal.primary, { accentHex: pal.glow, lockVertical: false }),
          tagPart(bladeB, 'twin_blade_b', 'rarity_armor', pal.primary, { accentHex: pal.glow, lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'great_hammer') {
      const haft = makeLatheProfile(
        [
          [0.028, -0.32],
          [0.032, 0.72],
        ],
        12,
        '#4f3428',
        { smoothRadialNormals: true }
      );
      haft.rotateX(Math.PI * 0.5);
      haft.translate(0, gY, gZ + 0.08);
      const head = subdivideGeometryLoop(
        makeBeveledBox(0.42 + tier * 0.02, 0.22, 0.22, 0.028, pal.primary, {
          offset: [0, gY, gZ + 0.68],
        }),
        1,
        { defaultHex: pal.primary }
      );
      const bands = makeLatheProfile(
        [
          [0.125, -0.04],
          [0.135, 0],
          [0.125, 0.04],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      bands.rotateX(Math.PI * 0.5);
      bands.translate(0, gY, gZ + 0.68);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(haft, 'ghammer_haft', 'wood_planks', '#4f3428', { lockVertical: false }),
          tagPart(head, 'ghammer_head', 'rarity_armor', pal.primary, { accentHex: pal.glow, lockVertical: false }),
          tagPart(bands, 'ghammer_bands', 'brushed_gold', pal.trim, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else if (mainStyle === 'scepter_orb') {
      const shaft = makeLatheProfile(
        [
          [0.022, -0.14],
          [0.028, 0.48],
        ],
        12,
        pal.secondary,
        { smoothRadialNormals: true }
      );
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, gY, gZ);
      const cradle = makeLatheProfile(
        [
          [0.03, 0],
          [0.085, 0.05],
          [0.06, 0.09],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      cradle.rotateX(Math.PI * 0.5);
      cradle.translate(0, gY, gZ + 0.49);
      const orb = prepareColoredPart(new THREE.IcosahedronGeometry(0.088, 1), pal.glow);
      orb.translate(0, gY, gZ + 0.62);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(shaft, 'scepter_shaft', 'brushed_gold', pal.secondary, { lockVertical: false }),
          tagPart(cradle, 'scepter_cradle', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(orb, 'scepter_orb', 'runic_glow', pal.glow, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: true }
      );
    } else {
      // arcane_staff or wand
      const isWand = mainStyle === 'wand';
      const pole = makeLatheProfile(
        isWand
          ? [
              [0.02, -0.06],
              [0.024, 0.38],
            ]
          : [
              [0.026, -0.34],
              [0.03, 0.45],
              [0.036, 1.18],
            ],
        12,
        pal.secondary,
        { smoothRadialNormals: true }
      );
      pole.rotateX(Math.PI * 0.5);
      pole.translate(0, gY, gZ + 0.02);
      const topZ = isWand ? gZ + 0.44 : gZ + 1.24;
      const crown = makeLatheProfile(
        [
          [0.038, -0.04],
          [(isWand ? 0.065 : 0.1) + tier * 0.008, 0.04],
          [(isWand ? 0.045 : 0.07) + tier * 0.006, 0.08],
        ],
        12,
        pal.trim,
        { smoothRadialNormals: true }
      );
      crown.rotateX(Math.PI * 0.5);
      crown.translate(0, gY, topZ - 0.02);
      const crystal = prepareColoredPart(
        new THREE.OctahedronGeometry((isWand ? 0.062 : 0.095) + tier * 0.01, 1),
        pal.glow
      );
      crystal.translate(0, gY, topZ + 0.08);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(pole, 'staff_pole', 'wood_planks', pal.secondary, { lockVertical: false }),
          tagPart(crown, 'staff_crown', 'brushed_gold', pal.trim, { lockVertical: false }),
          tagPart(crystal, 'staff_crystal', 'runic_glow', pal.glow, { lockVertical: false }),
        ],
        mainStyle,
        { isMetal: false }
      );
    }

    // 2. Offhand Weapon / Shield / Focus
    if (mainStyle === 'recurve_bow' && offStyle === 'quiver_arrow') {
      const shaft = makeLatheProfile(
        [
          [0.018, 0],
          [0.018, 0.65],
        ],
        10,
        '#6d758d'
      );
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, gY, gZ - 0.1);
      const head = makeSwordBladeGeometry(0.056, 0.028, 0.05, 0.1, pal.glow);
      head.rotateX(Math.PI * 0.5);
      head.translate(0, gY, gZ + 0.54);
      bakeBoneParts(
        'hand_r',
        [
          tagPart(shaft, 'archer_arrow_shaft', 'wood_planks', '#6d758d', { lockVertical: false }),
          tagPart(head, 'archer_arrow_head', tier >= 3 ? 'runic_glow' : 'forged_steel', pal.glow, {
            lockVertical: false,
          }),
        ],
        offStyle,
        { isMetal: false }
      );
    } else if (
      mainStyle !== 'recurve_bow' &&
      offStyle !== 'none' &&
      offStyle !== 'quiver_arrow'
    ) {
      if (
        offStyle === 'kite_shield' ||
        offStyle === 'round_shield' ||
        offStyle === 'tower_shield' ||
        offStyle === 'spiked_buckler'
      ) {
        const shieldW =
          offStyle === 'tower_shield'
            ? 0.54 + tier * 0.015
            : offStyle === 'round_shield'
              ? 0.44
              : offStyle === 'spiked_buckler'
                ? 0.36
                : 0.44 + tier * 0.015;
        const shieldH =
          offStyle === 'tower_shield'
            ? 0.82 + tier * 0.02
            : offStyle === 'round_shield'
              ? 0.44
              : offStyle === 'spiked_buckler'
                ? 0.36
                : 0.58 + tier * 0.02;
        const dome = makeDomeShieldGeometry(shieldW, shieldH, 0.065, pal.secondary);
        const boss = makeLatheProfile(
          [
            [0.085, 0],
            [0.072, 0.032],
            [0.025, 0.055],
            [0.004, 0.064],
          ],
          14,
          pal.trim,
          { smoothRadialNormals: true }
        );
        boss.rotateX(Math.PI * 0.5);
        boss.translate(0, 0.03, 0.088);
        const shieldGeos: THREE.BufferGeometry[] = [dome, boss];
        let spikeGeo: THREE.BufferGeometry | null = null;
        if (offStyle === 'spiked_buckler') {
          spikeGeo = makeCurvedHornGeometry(6, 0.038, 0.004, 0.14, 0, 0, 8, pal.trim);
          spikeGeo.rotateX(Math.PI * 0.5);
          spikeGeo.translate(0, 0.03, 0.13);
          shieldGeos.push(spikeGeo);
        }
        for (const g of shieldGeos) {
          g.rotateZ(Math.PI);
          g.rotateY(-Math.PI * 0.5);
          g.translate(
            WEAPON_MOUNT_SPEC.shieldBraceOffsetX,
            lArm * 0.50 + WEAPON_MOUNT_SPEC.shieldBraceOffsetY,
            WEAPON_MOUNT_SPEC.shieldBraceOffsetZ
          );
        }
        const shieldParts: TaggedGeometryPart[] = [
          tagPart(dome, 'shield_body', 'rarity_armor', pal.secondary, {
            landmarkKind: 'shield_face',
            accentHex: pal.trim,
            lockVertical: false,
          }),
          tagPart(boss, 'shield_boss', 'brushed_gold', pal.trim, { lockVertical: false }),
        ];
        if (spikeGeo) {
          shieldParts.push(
            tagPart(spikeGeo, 'buckler_spike', 'forged_steel', pal.trim, { lockVertical: false })
          );
        }
        bakeBoneParts('lowerarm_l', shieldParts, offStyle, { isMetal: true });
      } else if (offStyle === 'tome') {
        const tome = makeBeveledBox(0.18, 0.24, 0.072, 0.014, pal.primary, {
          offset: [
            WEAPON_MOUNT_SPEC.offhandPropOffsetX,
            WEAPON_MOUNT_SPEC.offhandPropOffsetY,
            WEAPON_MOUNT_SPEC.offhandPropOffsetZ,
          ],
        });
        const rune = prepareColoredPart(new THREE.OctahedronGeometry(0.055, 0), pal.glow);
        rune.translate(
          WEAPON_MOUNT_SPEC.offhandPropOffsetX,
          WEAPON_MOUNT_SPEC.offhandPropOffsetY,
          WEAPON_MOUNT_SPEC.offhandPropOffsetZ + 0.06
        );
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
          offStyle,
          { isMetal: false }
        );
      } else if (offStyle === 'arcane_orb') {
        const orb = prepareColoredPart(new THREE.OctahedronGeometry(0.105, 1), pal.glow);
        orb.translate(0.02, 0.08, 0.09);
        const ring = makeBeveledBox(0.18, 0.032, 0.18, 0.008, pal.trim, {
          offset: [0.02, 0.08, 0.09],
        });
        bakeBoneParts(
          'hand_l',
          [
            tagPart(orb, 'arcane_orb_core', 'runic_glow', pal.glow, { lockVertical: false }),
            tagPart(ring, 'arcane_orb_ring', 'brushed_gold', pal.trim, { lockVertical: false }),
          ],
          offStyle,
          { isMetal: false }
        );
      } else if (offStyle === 'offhand_dagger') {
        const grip = makeLatheProfile(
          [
            [0.02, -0.09],
            [0.018, 0.08],
          ],
          6,
          '#3b1725'
        );
        grip.rotateX(Math.PI * 0.5);
        grip.translate(0, gY, gZ);
        const guard = makeBeveledBox(0.15, 0.04, 0.05, 0.01, pal.trim, {
          offset: [0, gY, gZ + 0.08],
        });
        const blade = makeSwordBladeGeometry(0.062, 0.032, 0.28, 0.1, pal.primary);
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, gY, gZ + 0.1);
        bakeBoneParts(
          'hand_l',
          [
            tagPart(grip, 'off_dagger_grip', 'stitched_leather', '#3b1725', { lockVertical: false }),
            tagPart(guard, 'off_dagger_guard', 'brushed_gold', pal.trim, { lockVertical: false }),
            tagPart(blade, 'off_dagger_blade', 'forged_steel', pal.primary, {
              accentHex: pal.glow,
              lockVertical: false,
            }),
          ],
          offStyle,
          { isMetal: true }
        );
      } else if (offStyle === 'lantern_offhand') {
        const handle = makeBeveledBox(0.036, 0.08, 0.036, 0.008, pal.trim, {
          offset: [0, gY + 0.02, gZ + 0.06],
        });
        const cage = makeBeveledBox(0.11, 0.14, 0.11, 0.014, pal.primary, {
          offset: [0, gY - 0.08, gZ + 0.08],
        });
        const flame = prepareColoredPart(new THREE.OctahedronGeometry(0.055, 0), pal.glow);
        flame.translate(0, gY - 0.08, gZ + 0.08);
        bakeBoneParts(
          'hand_l',
          [
            tagPart(handle, 'lantern_handle', 'brushed_gold', pal.trim, { lockVertical: false }),
            tagPart(cage, 'lantern_cage', 'forged_steel', pal.primary, { lockVertical: false }),
            tagPart(flame, 'lantern_flame', 'runic_glow', pal.glow, { lockVertical: false }),
          ],
          offStyle,
          { isMetal: true }
        );
      } else if (offStyle === 'crystal_focus') {
        const shard = prepareColoredPart(new THREE.OctahedronGeometry(0.095, 0), pal.glow);
        shard.scale(0.75, 1.4, 0.75);
        shard.translate(0.02, 0.09, 0.09);
        const orbit = makeBeveledBox(0.16, 0.028, 0.16, 0.006, pal.trim);
        orbit.rotateZ(0.45);
        orbit.translate(0.02, 0.09, 0.09);
        bakeBoneParts(
          'hand_l',
          [
            tagPart(shard, 'focus_shard', 'runic_glow', pal.glow, { lockVertical: false }),
            tagPart(orbit, 'focus_orbit', 'brushed_gold', pal.trim, { lockVertical: false }),
          ],
          offStyle,
          { isMetal: false }
        );
      } else if (offStyle === 'parrying_dagger') {
        const grip = makeLatheProfile(
          [
            [0.02, -0.09],
            [0.018, 0.08],
          ],
          6,
          '#1f2937'
        );
        grip.rotateX(Math.PI * 0.5);
        grip.translate(0, gY, gZ);
        const basket = makeBeveledBox(0.22, 0.06, 0.055, 0.012, pal.trim, {
          offset: [0, gY, gZ + 0.08],
        });
        const blade = makeSwordBladeGeometry(0.052, 0.028, 0.34, 0.12, pal.primary);
        blade.rotateX(Math.PI * 0.5);
        blade.translate(0, gY, gZ + 0.1);
        bakeBoneParts(
          'hand_l',
          [
            tagPart(grip, 'parry_grip', 'stitched_leather', '#1f2937', { lockVertical: false }),
            tagPart(basket, 'parry_basket', 'brushed_gold', pal.trim, { lockVertical: false }),
            tagPart(blade, 'parry_blade', 'forged_steel', pal.primary, { accentHex: pal.glow, lockVertical: false }),
          ],
          offStyle,
          { isMetal: true }
        );
      }
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
    styleLoadout?: Partial<EquipmentStyleLoadout>;
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
  const styleLoadout: EquipmentStyleLoadout = {
    ...CLASS_DEFAULT_STYLE_LOADOUT[currentClass],
    ...options.styleLoadout,
  };

  const cfg: InternalFinishConfig = {
    finishMode: options.finishMode ?? 'textured_ao',
    materialSeed: Math.floor(options.materialSeed ?? 101),
    aoStrength: options.aoStrength ?? 0.28,
    normalStrength: options.normalStrength ?? 0.14,
  };

  const px = options.pixelSize ?? 1;
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
    const specs = buildSlotAttachments(rig, currentClass, slot, rarity, cfg, styleLoadout);
    const mounted: { mesh: THREE.Mesh; mat: PixelizerMaterial }[] = [];

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const mat = new PixelizerMaterial(
        bakedToMaterialOptions(spec.baked, {
          pixelated: true,
          pixelSize: px,
          objectId: objId,
          outlineColor: '#222736',
          outlineAlpha: 0.42,
          workflow: spec.isMetal ? 'metallic' : 'specular',
          metallic: spec.isMetal ? 0.26 : 0.0,
          smoothness: spec.isMetal ? 0.34 : 0.22,
          useColorGrading: false,
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
      const socketName: UalSocketName | null =
        ((slot as string) === 'offhand' || (slot as string) === 'weapon_off') && spec.boneName === 'lowerarm_l'
          ? 'shield_l'
          : spec.boneName === 'hand_r'
            ? 'hand_r'
            : spec.boneName === 'hand_l'
              ? 'hand_l'
              : null;
      const mountParent =
        (socketName ? rig.sockets[socketName] : undefined) ??
        rig.boneByName.get(spec.boneName) ??
        rig.rootBone;
      mountParent.add(mesh);
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

  const setStyleLoadout = (
    patch: Partial<EquipmentStyleLoadout>,
    rarityOverride?: ItemRarity
  ) => {
    const affected = new Set<EquipSlot>();
    if (patch.helmet !== undefined) {
      styleLoadout.helmet = patch.helmet;
      affected.add('helmet');
    }
    if (patch.chest !== undefined) {
      styleLoadout.chest = patch.chest;
      affected.add('chest');
    }
    if (patch.shoulders !== undefined) {
      styleLoadout.shoulders = patch.shoulders;
      affected.add('chest');
    }
    if (patch.legs !== undefined) {
      styleLoadout.legs = patch.legs;
      affected.add('legs');
    }
    if (patch.boots !== undefined) {
      styleLoadout.boots = patch.boots;
      affected.add('boots');
    }
    if (patch.gloves !== undefined) {
      styleLoadout.gloves = patch.gloves;
      affected.add('gloves');
    }
    if (patch.back !== undefined) {
      styleLoadout.back = patch.back;
      affected.add('chest');
    }
    if (patch.weaponMain !== undefined) {
      styleLoadout.weaponMain = patch.weaponMain;
      affected.add('weapon');
    }
    if (patch.weaponOffhand !== undefined) {
      styleLoadout.weaponOffhand = patch.weaponOffhand;
      affected.add('weapon');
    }
    if (patch.materialTheme !== undefined) {
      styleLoadout.materialTheme = patch.materialTheme;
      for (const s of EQUIP_SLOTS) affected.add(s);
    }
    for (const s of affected) {
      mountSlot(s, rarityOverride ?? loadout[s]);
    }
  };

  const equipStyleSlot = <K extends keyof EquipmentStyleLoadout>(
    key: K,
    style: EquipmentStyleLoadout[K],
    rarityOverride?: ItemRarity
  ) => {
    styleLoadout[key] = style;
    if (key === 'materialTheme') {
      for (const s of EQUIP_SLOTS) {
        mountSlot(s, rarityOverride ?? loadout[s]);
      }
      return;
    }
    const slotMap: Record<Exclude<keyof EquipmentStyleLoadout, 'materialTheme'>, EquipSlot> = {
      helmet: 'helmet',
      chest: 'chest',
      shoulders: 'chest',
      legs: 'legs',
      boots: 'boots',
      gloves: 'gloves',
      back: 'chest',
      weaponMain: 'weapon',
      weaponOffhand: 'weapon',
    };
    const targetSlot = slotMap[key as Exclude<keyof EquipmentStyleLoadout, 'materialTheme'>];
    mountSlot(targetSlot, rarityOverride ?? loadout[targetSlot]);
  };

  const setClass = (nextClass: PlayerClassId) => {
    currentClass = nextClass;
    Object.assign(styleLoadout, CLASS_DEFAULT_STYLE_LOADOUT[nextClass]);
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
    styleLoadout,
    meshes: allMeshes,
    materials: allMaterials,
    equipSlot: mountSlot,
    equipFullRaritySet,
    setStyleLoadout,
    equipStyleSlot,
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
