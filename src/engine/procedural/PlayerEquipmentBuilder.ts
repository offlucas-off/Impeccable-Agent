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
import {
  makeBoneSegmentBox,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';

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
  eye: '#141013',
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
 * All modular equipment parts wrap cleanly outside these standardized bone clearances
 * so swapping drops never z-fights or clips.
 */
function buildBaseShellSpecs(rig: CanonicalUalRig): RigidPartSpec[] {
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
  specs.push({
    name: 'Shell_Pelvis',
    boneName: 'pelvis',
    geometry: makeBoneSegmentBox(pelvisLen * 1.05, 0.135, 0.095, 0.13, 0.09, SHELL_COLORS.undershirtDark),
  });
  specs.push({
    name: 'Shell_Spine1',
    boneName: 'spine_01',
    geometry: makeBoneSegmentBox(spine1Len * 1.05, 0.125, 0.088, 0.135, 0.092, SHELL_COLORS.undershirt),
  });
  specs.push({
    name: 'Shell_Spine2',
    boneName: 'spine_02',
    geometry: makeBoneSegmentBox(spine2Len * 1.06, 0.138, 0.095, 0.152, 0.105, SHELL_COLORS.undershirt),
  });
  specs.push({
    name: 'Shell_Spine3',
    boneName: 'spine_03',
    geometry: makeBoneSegmentBox(spine3Len * 0.9, 0.155, 0.105, 0.165, 0.11, SHELL_COLORS.undershirt),
  });
  specs.push({
    name: 'Shell_Neck',
    boneName: 'neck_01',
    geometry: makeBoneSegmentBox(neckLen * 1.1, 0.05, 0.05, 0.048, 0.048, SHELL_COLORS.skinShadow),
  });

  // Head + simple clean face + short hair (NO loose hair physics)
  const headCube = new THREE.BoxGeometry(0.21, 0.23, 0.21);
  headCube.translate(0, 0.11, 0);
  const faceBand = new THREE.BoxGeometry(0.18, 0.09, 0.03);
  faceBand.translate(0, 0.10, 0.10);
  const hairCap = new THREE.BoxGeometry(0.22, 0.075, 0.22);
  hairCap.translate(0, 0.20, -0.01);
  specs.push({
    name: 'Shell_Head',
    boneName: 'Head',
    geometry: mergeColoredParts([
      prepareColoredPart(headCube, SHELL_COLORS.skin),
      prepareColoredPart(faceBand, SHELL_COLORS.skinShadow),
      prepareColoredPart(hairCap, SHELL_COLORS.hair),
    ]),
  });

  for (const side of ['l', 'r'] as const) {
    specs.push({
      name: `Shell_UpperArm_${side}`,
      boneName: `upperarm_${side}`,
      geometry: makeBoneSegmentBox(uArm * 0.94, 0.054, 0.054, 0.046, 0.046, SHELL_COLORS.undershirt),
    });
    specs.push({
      name: `Shell_LowerArm_${side}`,
      boneName: `lowerarm_${side}`,
      geometry: makeBoneSegmentBox(lArm * 0.94, 0.045, 0.045, 0.038, 0.038, SHELL_COLORS.skinShadow),
    });
    specs.push({
      name: `Shell_Hand_${side}`,
      boneName: `hand_${side}`,
      geometry: makeBoneSegmentBox(0.10, 0.038, 0.035, 0.034, 0.03, SHELL_COLORS.skin),
    });
    specs.push({
      name: `Shell_Thigh_${side}`,
      boneName: `thigh_${side}`,
      geometry: makeBoneSegmentBox(thigh * 0.94, 0.072, 0.072, 0.056, 0.056, SHELL_COLORS.undershirtDark),
    });
    specs.push({
      name: `Shell_Calf_${side}`,
      boneName: `calf_${side}`,
      geometry: makeBoneSegmentBox(calf * 0.94, 0.056, 0.056, 0.044, 0.044, SHELL_COLORS.undershirtDark),
    });
    specs.push({
      name: `Shell_Foot_${side}`,
      boneName: `foot_${side}`,
      geometry: makeBoneSegmentBox(0.14, 0.046, 0.054, 0.04, 0.045, SHELL_COLORS.undershirtDark),
    });
  }

  return specs;
}

interface ModularAttachmentSpec {
  boneName: string;
  geometry: THREE.BufferGeometry;
  emissive?: boolean;
}

/**
 * Generates bone-mounted geometry pieces for any (classId × slot × rarity)
 * keeping clean >=3.5cm geometric ribs/chamfers and ZERO cloth simulation.
 */
function buildSlotAttachments(
  rig: CanonicalUalRig,
  classId: PlayerClassId,
  slot: EquipSlot,
  rarity: ItemRarity
): ModularAttachmentSpec[] {
  const pal = RARITY_COLOR_TABLE[rarity];
  const tier = pal.tierLevel;
  const out: ModularAttachmentSpec[] = [];

  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

  if (slot === 'helmet') {
    const parts: THREE.BufferGeometry[] = [];
    if (classId === 'knight') {
      const dome = new THREE.BoxGeometry(0.26, 0.24, 0.26);
      dome.translate(0, 0.14, 0);
      const visor = new THREE.BoxGeometry(0.22, 0.07, 0.07);
      visor.translate(0, 0.11, 0.115);
      const brow = new THREE.BoxGeometry(0.27, 0.04, 0.27);
      brow.translate(0, 0.19, 0.01);
      parts.push(
        prepareColoredPart(dome, pal.primary),
        prepareColoredPart(visor, '#141013'),
        prepareColoredPart(brow, pal.trim)
      );
      if (tier >= 2) {
        const crest = new THREE.BoxGeometry(0.055, 0.10 + tier * 0.015, 0.24);
        crest.translate(0, 0.29, -0.01);
        parts.push(prepareColoredPart(crest, pal.secondary));
      }
      if (tier >= 4) {
        for (const sx of [-1, 1]) {
          const wing = new THREE.BoxGeometry(0.05, 0.14, 0.09);
          wing.rotateZ(sx * -0.35);
          wing.translate(sx * 0.15, 0.25, 0);
          parts.push(prepareColoredPart(wing, pal.trim));
        }
      }
    } else if (classId === 'archer') {
      const hood = new THREE.BoxGeometry(0.25, 0.22, 0.27);
      hood.translate(0, 0.14, -0.015);
      const cowlRim = new THREE.BoxGeometry(0.26, 0.05, 0.08);
      cowlRim.translate(0, 0.21, 0.10);
      parts.push(prepareColoredPart(hood, pal.primary), prepareColoredPart(cowlRim, pal.trim));
      if (tier >= 2) {
        const feather = new THREE.BoxGeometry(0.04, 0.18 + tier * 0.02, 0.06);
        feather.rotateZ(-0.28);
        feather.rotateX(-0.2);
        feather.translate(0.14, 0.25, -0.04);
        parts.push(prepareColoredPart(feather, pal.secondary));
      }
      if (tier >= 4) {
        const mask = new THREE.BoxGeometry(0.20, 0.06, 0.04);
        mask.translate(0, 0.07, 0.115);
        parts.push(prepareColoredPart(mask, pal.secondary));
      }
    } else {
      // Mage pointed hat / circlet (compact, rigid, crisp silhouette)
      const brim = new THREE.CylinderGeometry(0.28 + tier * 0.012, 0.30 + tier * 0.012, 0.04, 8);
      brim.translate(0, 0.23, 0);
      const band = new THREE.CylinderGeometry(0.16, 0.17, 0.055, 8);
      band.translate(0, 0.26, 0);
      const cone = new THREE.ConeGeometry(0.155, 0.32 + tier * 0.02, 8);
      cone.rotateX(-0.18);
      cone.translate(0, 0.42, -0.03);
      parts.push(
        prepareColoredPart(brim, pal.primary),
        prepareColoredPart(band, pal.trim),
        prepareColoredPart(cone, pal.secondary)
      );
      if (tier >= 3) {
        const gem = new THREE.OctahedronGeometry(0.045, 0);
        gem.translate(0, 0.27, 0.16);
        parts.push(prepareColoredPart(gem, pal.glow));
      }
    }
    out.push({ boneName: 'Head', geometry: mergeColoredParts(parts) });
  } else if (slot === 'chest') {
    // Pelvis belt/fauld + spine_01/02/03 torso armor + rigid pauldrons (NO cloth cape)
    const beltParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(0.07, 0.165, 0.125, 0.165, 0.125, pal.secondary),
    ];
    const buckle = new THREE.BoxGeometry(0.08, 0.07, 0.04);
    buckle.translate(0, 0.05, 0.12);
    beltParts.push(prepareColoredPart(buckle, pal.trim));
    // Rigid short tassets on hips (zero physics needed)
    if (classId === 'knight' || tier >= 3) {
      for (const sx of [-1, 1]) {
        const tasset = new THREE.BoxGeometry(0.09, 0.12, 0.13);
        tasset.translate(sx * 0.145, -0.02, 0);
        beltParts.push(prepareColoredPart(tasset, pal.primary));
      }
    }
    out.push({ boneName: 'pelvis', geometry: mergeColoredParts(beltParts) });

    out.push({
      name: 'Chest_Lower',
      boneName: 'spine_01',
      geometry: makeBoneSegmentBox(spine1Len * 1.05, 0.142, 0.104, 0.156, 0.114, pal.secondary),
    } as ModularAttachmentSpec);

    const midParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(spine2Len * 1.08, 0.16, 0.115, 0.18, 0.13, pal.primary),
    ];
    const chestBand = new THREE.BoxGeometry(0.28, 0.05, 0.24);
    chestBand.translate(0, spine2Len * 0.5, 0);
    midParts.push(prepareColoredPart(chestBand, pal.trim));
    out.push({ boneName: 'spine_02', geometry: mergeColoredParts(midParts) });

    const topParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(spine3Len * 0.94, 0.185, 0.13, 0.20, 0.135, pal.primary),
    ];
    // Class chest insignia / collar / quiver (all rigid!)
    if (classId === 'knight') {
      const gorget = new THREE.BoxGeometry(0.22, 0.06, 0.18);
      gorget.translate(0, spine3Len * 0.9, 0);
      const crest = new THREE.BoxGeometry(0.11, 0.11, 0.04);
      crest.translate(0, spine3Len * 0.48, 0.135);
      topParts.push(prepareColoredPart(gorget, pal.trim), prepareColoredPart(crest, pal.secondary));
    } else if (classId === 'archer') {
      // Rigid angled quiver + arrow fletchings mounted to upper back
      const quiver = new THREE.CylinderGeometry(0.055, 0.045, 0.38, 6);
      quiver.rotateZ(-0.42);
      quiver.translate(-0.08, 0.08, -0.15);
      const arrows = new THREE.ConeGeometry(0.05, 0.08, 6);
      arrows.rotateZ(-0.42);
      arrows.translate(-0.16, 0.26, -0.15);
      topParts.push(prepareColoredPart(quiver, pal.secondary), prepareColoredPart(arrows, pal.trim));
    } else {
      // Mage arcane mantle + rune medallion
      const mantle = new THREE.BoxGeometry(0.38, 0.065, 0.24);
      mantle.translate(0, spine3Len * 0.78, -0.01);
      const rune = new THREE.OctahedronGeometry(0.05, 0);
      rune.translate(0, spine3Len * 0.48, 0.135);
      topParts.push(prepareColoredPart(mantle, pal.trim), prepareColoredPart(rune, pal.glow));
    }
    out.push({ boneName: 'spine_03', geometry: mergeColoredParts(topParts) });

    // Pauldrons + upper arm sleeves
    for (const side of ['l', 'r'] as const) {
      const armParts: THREE.BufferGeometry[] = [
        makeBoneSegmentBox(uArm * 0.88, 0.068, 0.068, 0.058, 0.058, pal.secondary),
      ];
      const hasPauldron =
        classId === 'knight' ||
        (classId === 'archer' && side === 'l') ||
        (classId === 'mage' && tier >= 2) ||
        tier >= 3;
      if (hasPauldron) {
        const pW = classId === 'knight' ? 0.165 + tier * 0.008 : 0.135;
        const pH = classId === 'knight' ? 0.125 : 0.09;
        const pauldron = new THREE.BoxGeometry(pW, pH, pW);
        pauldron.translate(0, 0.04, 0);
        armParts.push(prepareColoredPart(pauldron, pal.primary));
        if (tier >= 3) {
          const rim = new THREE.BoxGeometry(pW + 0.03, 0.038, pW + 0.03);
          rim.translate(0, 0.01, 0);
          armParts.push(prepareColoredPart(rim, pal.trim));
        }
        if (tier >= 5) {
          const spike = new THREE.ConeGeometry(0.042, 0.11, 4);
          spike.translate(side === 'l' ? 0.04 : -0.04, 0.12, 0);
          armParts.push(prepareColoredPart(spike, pal.trim));
        }
      }
      out.push({ boneName: `upperarm_${side}`, geometry: mergeColoredParts(armParts) });
    }
  } else if (slot === 'legs') {
    for (const side of ['l', 'r'] as const) {
      const parts: THREE.BufferGeometry[] = [
        makeBoneSegmentBox(thigh * 0.88, 0.09, 0.09, 0.072, 0.072, pal.primary),
      ];
      const kneecap = new THREE.BoxGeometry(0.135, 0.08, 0.14);
      kneecap.translate(0, thigh * 0.86, 0.015);
      parts.push(prepareColoredPart(kneecap, pal.trim));
      if (tier >= 3) {
        const stripe = new THREE.BoxGeometry(0.155, thigh * 0.52, 0.06);
        stripe.translate(0, thigh * 0.45, 0);
        parts.push(prepareColoredPart(stripe, pal.secondary));
      }
      out.push({ boneName: `thigh_${side}`, geometry: mergeColoredParts(parts) });
    }
  } else if (slot === 'boots') {
    for (const side of ['l', 'r'] as const) {
      const calfParts: THREE.BufferGeometry[] = [
        makeBoneSegmentBox(calf * 0.72, 0.068, 0.068, 0.076, 0.076, pal.secondary),
      ];
      const cuff = new THREE.BoxGeometry(0.15, 0.065, 0.15);
      cuff.translate(0, calf * 0.34, 0);
      calfParts.push(prepareColoredPart(cuff, pal.trim));
      out.push({ boneName: `calf_${side}`, geometry: mergeColoredParts(calfParts) });

      const footParts: THREE.BufferGeometry[] = [
        makeBoneSegmentBox(0.175, 0.06, 0.068, 0.055, 0.06, pal.primary),
      ];
      if (tier >= 3) {
        const toe = new THREE.BoxGeometry(0.11, 0.05, 0.06);
        toe.translate(0, 0.15, 0.02);
        footParts.push(prepareColoredPart(toe, pal.trim));
      }
      out.push({ boneName: `foot_${side}`, geometry: mergeColoredParts(footParts) });
    }
  } else if (slot === 'gloves') {
    for (const side of ['l', 'r'] as const) {
      const bracerParts: THREE.BufferGeometry[] = [
        makeBoneSegmentBox(lArm * 0.62, 0.054, 0.054, 0.062, 0.062, pal.primary),
      ];
      if (tier >= 2) {
        const rim = new THREE.BoxGeometry(0.12, 0.048, 0.12);
        rim.translate(0, lArm * 0.56, 0);
        bracerParts.push(prepareColoredPart(rim, pal.trim));
      }
      out.push({ boneName: `lowerarm_${side}`, geometry: mergeColoredParts(bracerParts) });

      const handArmor = makeBoneSegmentBox(0.115, 0.05, 0.048, 0.044, 0.042, pal.secondary);
      out.push({ boneName: `hand_${side}`, geometry: handArmor });
    }
  } else if (slot === 'weapon') {
    if (classId === 'knight') {
      // Broadsword in hand_r (wide >=5cm blade facing camera) + Heater Shield in hand_l
      const swParts: THREE.BufferGeometry[] = [];
      const grip = new THREE.CylinderGeometry(0.024, 0.024, 0.24, 6);
      grip.rotateX(Math.PI * 0.5);
      const pommel = new THREE.OctahedronGeometry(0.045, 0);
      pommel.translate(0, 0, -0.14);
      const guard = new THREE.BoxGeometry(0.28 + tier * 0.015, 0.05, 0.065);
      guard.translate(0, 0, 0.13);
      const bladeLen = 0.72 + tier * 0.04;
      const bladeW = 0.105 + tier * 0.008;
      const blade = new THREE.BoxGeometry(bladeW, 0.042, bladeLen);
      blade.translate(0, 0, 0.16 + bladeLen * 0.5);
      const tip = new THREE.ConeGeometry(bladeW * 0.6, 0.16, 4);
      tip.rotateX(Math.PI * 0.5);
      tip.rotateZ(Math.PI * 0.25);
      tip.translate(0, 0, 0.16 + bladeLen + 0.07);
      swParts.push(
        prepareColoredPart(grip, '#3b1725'),
        prepareColoredPart(pommel, pal.trim),
        prepareColoredPart(guard, pal.trim),
        prepareColoredPart(blade, pal.primary),
        prepareColoredPart(tip, pal.glow)
      );
      out.push({ boneName: 'hand_r', geometry: mergeColoredParts(swParts) });

      const shParts: THREE.BufferGeometry[] = [];
      const shieldW = 0.44 + tier * 0.015;
      const shieldH = 0.58 + tier * 0.02;
      const body = new THREE.BoxGeometry(shieldW, shieldH, 0.065);
      const rim = new THREE.BoxGeometry(shieldW + 0.045, shieldH + 0.045, 0.04);
      const crossV = new THREE.BoxGeometry(0.08, shieldH - 0.10, 0.08);
      const crossH = new THREE.BoxGeometry(shieldW - 0.10, 0.08, 0.08);
      shParts.push(
        prepareColoredPart(rim, pal.trim),
        prepareColoredPart(body, pal.secondary),
        prepareColoredPart(crossV, pal.primary),
        prepareColoredPart(crossH, pal.primary)
      );
      for (const g of shParts) {
        g.rotateY(Math.PI * 0.5);
        g.translate(0.11, 0.06, 0.06);
      }
      out.push({ boneName: 'hand_l', geometry: mergeColoredParts(shParts) });
    } else if (classId === 'archer') {
      // Composite Bow in hand_l + nocked arrow in hand_r
      const bowParts: THREE.BufferGeometry[] = [];
      const riser = new THREE.BoxGeometry(0.055, 0.34, 0.07);
      const limbTop = new THREE.BoxGeometry(0.05, 0.42, 0.06);
      limbTop.rotateX(-0.28);
      limbTop.translate(0, 0.34, -0.06);
      const limbBot = new THREE.BoxGeometry(0.05, 0.42, 0.06);
      limbBot.rotateX(0.28);
      limbBot.translate(0, -0.34, -0.06);
      const tipTop = new THREE.BoxGeometry(0.065, 0.08, 0.08);
      tipTop.translate(0, 0.54, -0.14);
      const tipBot = new THREE.BoxGeometry(0.065, 0.08, 0.08);
      tipBot.translate(0, -0.54, -0.14);
      const stringBar = new THREE.BoxGeometry(0.025, 1.04, 0.025);
      stringBar.translate(0, 0, -0.14);
      bowParts.push(
        prepareColoredPart(riser, pal.trim),
        prepareColoredPart(limbTop, pal.primary),
        prepareColoredPart(limbBot, pal.primary),
        prepareColoredPart(tipTop, pal.secondary),
        prepareColoredPart(tipBot, pal.secondary),
        prepareColoredPart(stringBar, '#dae0ea')
      );
      for (const g of bowParts) g.translate(0, 0.05, 0.14);
      out.push({ boneName: 'hand_l', geometry: mergeColoredParts(bowParts) });

      const arrowShaft = new THREE.CylinderGeometry(0.018, 0.018, 0.68, 5);
      arrowShaft.rotateX(Math.PI * 0.5);
      arrowShaft.translate(0, 0, 0.25);
      const arrowHead = new THREE.ConeGeometry(0.045, 0.12, 4);
      arrowHead.rotateX(Math.PI * 0.5);
      arrowHead.translate(0, 0, 0.62);
      out.push({
        boneName: 'hand_r',
        geometry: mergeColoredParts([
          prepareColoredPart(arrowShaft, '#6d758d'),
          prepareColoredPart(arrowHead, pal.glow),
        ]),
      });
    } else {
      // Mage Runic Staff in hand_r + Floating Focus Orb in hand_l
      const stParts: THREE.BufferGeometry[] = [];
      const pole = new THREE.CylinderGeometry(0.032, 0.026, 1.56, 6);
      pole.rotateX(Math.PI * 0.5);
      pole.translate(0, 0, 0.42);
      const crown = new THREE.BoxGeometry(0.18 + tier * 0.015, 0.18 + tier * 0.015, 0.08);
      crown.rotateZ(Math.PI * 0.25);
      crown.translate(0, 0, 1.24);
      const crystal = new THREE.OctahedronGeometry(0.095 + tier * 0.01, 0);
      crystal.translate(0, 0, 1.32);
      stParts.push(
        prepareColoredPart(pole, pal.secondary),
        prepareColoredPart(crown, pal.trim),
        prepareColoredPart(crystal, pal.glow)
      );
      out.push({ boneName: 'hand_r', geometry: mergeColoredParts(stParts) });

      const tome = new THREE.BoxGeometry(0.18, 0.24, 0.07);
      tome.translate(0.04, 0.04, 0.08);
      const rune = new THREE.OctahedronGeometry(0.055, 0);
      rune.translate(0.04, 0.04, 0.14);
      out.push({
        boneName: 'hand_l',
        geometry: mergeColoredParts([
          prepareColoredPart(tome, pal.primary),
          prepareColoredPart(rune, pal.glow),
        ]),
      });
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

  const px = options.pixelSize ?? 3;
  const objId = options.objectId ?? 10;

  const rig = createCanonicalUalRig('male', NWL_HERO_SCALE);
  const root = new THREE.Group();
  root.name = `NWL_Hero_${currentClass}`;
  root.add(rig.armature);

  // Attach Base Shell cleanly on UAL bones
  const shellSpecs = buildBaseShellSpecs(rig);
  const shellRes = attachRigidPartsToUalRig(rig, shellSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  const baseMeshes: THREE.Mesh[] = [...shellRes.meshes];
  const equippedMeshes = new Map<EquipSlot, { mesh: THREE.Mesh; mat: PixelizerMaterial }[]>();
  const allMeshes: THREE.Mesh[] = [...baseMeshes];
  const allMaterials: PixelizerMaterial[] = [...shellRes.materials];

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
        e.mat.dispose();
      }
      equippedMeshes.delete(slot);
    }

    loadout[slot] = rarity;
    const def = getEquipmentPieceDef(currentClass, slot, rarity);
    const specs = buildSlotAttachments(rig, currentClass, slot, rarity);
    const mounted: { mesh: THREE.Mesh; mat: PixelizerMaterial }[] = [];

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const bone = rig.boneByName.get(spec.boneName) ?? rig.rootBone;
      const mat = new PixelizerMaterial(
        {
          pixelated: true,
          pixelSize: px,
          objectId: objId,
          outlineColor: '#14101c',
          outlineAlpha: 1.0,
          baseColor: '#ffffff',
          edgeHighlight: 0.35,
          edgeBevelWeight: 0.75,
          smoothness: 0.25,
          useColorGrading: true,
        },
        sharedResources
      );
      mat.vertexColors = true;
      const mesh = new THREE.Mesh(spec.geometry, mat);
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
      for (const mat of shellRes.materials) mat.dispose();
      for (const entries of equippedMeshes.values()) {
        for (const e of entries) {
          e.mesh.removeFromParent();
          e.mesh.geometry.dispose();
          e.mat.dispose();
        }
      }
      equippedMeshes.clear();
    },
  };
}
