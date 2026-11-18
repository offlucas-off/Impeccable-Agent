import type { PlayerClassId } from './PlayerEquipmentBuilder';

export type HelmetStyleId =
  | 'none'
  | 'full_helm'
  | 'open_helm'
  | 'winged_helm'
  | 'hood'
  | 'wizard_hat'
  | 'circlet';

export type ChestStyleId =
  | 'plate_cuirass'
  | 'leather_brigandine'
  | 'ranger_coat'
  | 'arcane_robe'
  | 'royal_tabard';

export type ShoulderStyleId =
  | 'none'
  | 'heavy_pauldrons'
  | 'asym_duelist'
  | 'fur_leather'
  | 'arcane_mantle';

export type LegsStyleId = 'plate_cuisses' | 'battle_kilt' | 'ranger_trousers';
export type BootsStyleId = 'steel_sabatons' | 'cuffed_boots' | 'light_greaves';
export type GlovesStyleId = 'heavy_gauntlets' | 'leather_bracers' | 'arcane_cuffs';

export type WeaponMainStyleId =
  | 'longsword'
  | 'greatsword'
  | 'battleaxe'
  | 'warhammer'
  | 'dagger'
  | 'spear'
  | 'recurve_bow'
  | 'crossbow'
  | 'arcane_staff'
  | 'wand';

export type WeaponOffhandStyleId =
  | 'none'
  | 'kite_shield'
  | 'round_shield'
  | 'tower_shield'
  | 'tome'
  | 'arcane_orb'
  | 'offhand_dagger'
  | 'quiver_arrow';

export interface EquipmentStyleLoadout {
  helmet: HelmetStyleId;
  chest: ChestStyleId;
  shoulders: ShoulderStyleId;
  legs: LegsStyleId;
  boots: BootsStyleId;
  gloves: GlovesStyleId;
  weaponMain: WeaponMainStyleId;
  weaponOffhand: WeaponOffhandStyleId;
}

export interface StyleOptionMeta<T extends string> {
  id: T;
  labelPt: string;
  isMetal?: boolean;
}

export const HELMET_STYLES: StyleOptionMeta<HelmetStyleId>[] = [
  { id: 'full_helm', labelPt: 'Elmo Fechado (Visor)', isMetal: true },
  { id: 'open_helm', labelPt: 'Barbuta Aberta', isMetal: true },
  { id: 'winged_helm', labelPt: 'Elmo Alado / Real', isMetal: true },
  { id: 'hood', labelPt: 'Capuz de Patrulheiro', isMetal: false },
  { id: 'wizard_hat', labelPt: 'Chapéu Arcano Pontudo', isMetal: false },
  { id: 'circlet', labelPt: 'Diadema / Coroa Rúnica', isMetal: true },
  { id: 'none', labelPt: 'Sem Elmo (Rosto Livre)', isMetal: false },
];

export const CHEST_STYLES: StyleOptionMeta<ChestStyleId>[] = [
  { id: 'plate_cuirass', labelPt: 'Couraça de Placas', isMetal: true },
  { id: 'leather_brigandine', labelPt: 'Brigandina de Couro', isMetal: false },
  { id: 'ranger_coat', labelPt: 'Casaco + Aljava', isMetal: false },
  { id: 'arcane_robe', labelPt: 'Túnica / Manto Arcano', isMetal: false },
  { id: 'royal_tabard', labelPt: 'Tabardo Real', isMetal: true },
];

export const SHOULDER_STYLES: StyleOptionMeta<ShoulderStyleId>[] = [
  { id: 'heavy_pauldrons', labelPt: 'Ombreiras Pesadas', isMetal: true },
  { id: 'asym_duelist', labelPt: 'Ombreira Assimétrica (Esq)', isMetal: false },
  { id: 'fur_leather', labelPt: 'Ombreiras de Couro', isMetal: false },
  { id: 'arcane_mantle', labelPt: 'Estola / Manto Rúnico', isMetal: false },
  { id: 'none', labelPt: 'Sem Ombreiras', isMetal: false },
];

export const LEGS_STYLES: StyleOptionMeta<LegsStyleId>[] = [
  { id: 'plate_cuisses', labelPt: 'Coxotes de Placa', isMetal: true },
  { id: 'battle_kilt', labelPt: 'Saia / Kilt de Batalha', isMetal: false },
  { id: 'ranger_trousers', labelPt: 'Calça Reforçada', isMetal: false },
];

export const BOOTS_STYLES: StyleOptionMeta<BootsStyleId>[] = [
  { id: 'steel_sabatons', labelPt: 'Sabatons de Aço', isMetal: true },
  { id: 'cuffed_boots', labelPt: 'Botas Dobradas', isMetal: false },
  { id: 'light_greaves', labelPt: 'Grevas Leves', isMetal: false },
];

export const GLOVES_STYLES: StyleOptionMeta<GlovesStyleId>[] = [
  { id: 'heavy_gauntlets', labelPt: 'Manoplas Pesadas', isMetal: true },
  { id: 'leather_bracers', labelPt: 'Braçadeiras de Couro', isMetal: false },
  { id: 'arcane_cuffs', labelPt: 'Punhos Rúnicos', isMetal: false },
];

export const WEAPON_MAIN_STYLES: StyleOptionMeta<WeaponMainStyleId>[] = [
  { id: 'longsword', labelPt: 'Espada Longa (1H)', isMetal: true },
  { id: 'greatsword', labelPt: 'Montante / Greatsword (2H)', isMetal: true },
  { id: 'battleaxe', labelPt: 'Machado de Batalha', isMetal: true },
  { id: 'warhammer', labelPt: 'Martelo de Guerra', isMetal: true },
  { id: 'dagger', labelPt: 'Adaga / Punhal', isMetal: true },
  { id: 'spear', labelPt: 'Lança / Alabarda', isMetal: true },
  { id: 'recurve_bow', labelPt: 'Arco Recurvo', isMetal: false },
  { id: 'crossbow', labelPt: 'Besta Tática', isMetal: false },
  { id: 'arcane_staff', labelPt: 'Cajado Arcano', isMetal: false },
  { id: 'wand', labelPt: 'Varinha / Cetro', isMetal: false },
];

export const WEAPON_OFFHAND_STYLES: StyleOptionMeta<WeaponOffhandStyleId>[] = [
  { id: 'kite_shield', labelPt: 'Escudo Gota (Kite)', isMetal: true },
  { id: 'round_shield', labelPt: 'Escudo Redondo (Broquel)', isMetal: true },
  { id: 'tower_shield', labelPt: 'Escudo Torre Pesado', isMetal: true },
  { id: 'tome', labelPt: 'Grimório Arcano', isMetal: false },
  { id: 'arcane_orb', labelPt: 'Orbe Rúnico', isMetal: false },
  { id: 'offhand_dagger', labelPt: 'Adaga Secundária', isMetal: true },
  { id: 'quiver_arrow', labelPt: 'Flecha Pronta (Arco)', isMetal: false },
  { id: 'none', labelPt: 'Mão Livre (Vazio)', isMetal: false },
];

export const CLASS_DEFAULT_STYLE_LOADOUT: Record<PlayerClassId, EquipmentStyleLoadout> = {
  knight: {
    helmet: 'full_helm',
    chest: 'plate_cuirass',
    shoulders: 'heavy_pauldrons',
    legs: 'plate_cuisses',
    boots: 'steel_sabatons',
    gloves: 'heavy_gauntlets',
    weaponMain: 'longsword',
    weaponOffhand: 'kite_shield',
  },
  archer: {
    helmet: 'hood',
    chest: 'ranger_coat',
    shoulders: 'asym_duelist',
    legs: 'ranger_trousers',
    boots: 'cuffed_boots',
    gloves: 'leather_bracers',
    weaponMain: 'recurve_bow',
    weaponOffhand: 'quiver_arrow',
  },
  mage: {
    helmet: 'wizard_hat',
    chest: 'arcane_robe',
    shoulders: 'arcane_mantle',
    legs: 'battle_kilt',
    boots: 'light_greaves',
    gloves: 'arcane_cuffs',
    weaponMain: 'arcane_staff',
    weaponOffhand: 'tome',
  },
};

/**
 * Anatomical clearance envelopes derived from BaseShell dimensions (meters)
 * to eliminate Z-fighting and skin/undershirt poke-through during UAL animations.
 */
export const SHELL_CLEARANCE = {
  pelvisHalfW: 0.135,
  pelvisHalfD: 0.095,
  spine1HalfW: 0.135,
  spine1HalfD: 0.092,
  spine2HalfW: 0.152,
  spine2HalfD: 0.105,
  spine3HalfW: 0.165,
  spine3HalfD: 0.11,
  headW: 0.21,
  headH: 0.23,
  headD: 0.21,
  upperArmR: 0.054,
  lowerArmR: 0.045,
  handR: 0.038,
  thighR: 0.072,
  calfR: 0.056,
  footR: 0.054,
  clothMargin: 0.012,
  plateMargin: 0.02,
} as const;

/**
 * Standardized UAL grip & socket mount offsets (in bone-local meters).
 * Grip origin [0, 0, 0] sits at the palm center of hand_r / hand_l.
 */
export const WEAPON_MOUNT_SPEC = {
  handGripCenterY: 0.035,
  handGripCenterZ: 0.025,
  shieldBraceOffsetX: -0.075,
  shieldBraceOffsetY: 0.0,
  shieldBraceOffsetZ: 0.015,
  bowGripOffsetY: 0.03,
  bowGripOffsetZ: 0.085,
  offhandPropOffsetX: 0.035,
  offhandPropOffsetY: 0.035,
  offhandPropOffsetZ: 0.065,
} as const;

export function getRecommendedClipForWeapon(weaponMain: WeaponMainStyleId): string {
  switch (weaponMain) {
    case 'recurve_bow':
    case 'crossbow':
      return 'Idle_Loop';
    case 'arcane_staff':
    case 'wand':
      return 'CastSpell';
    default:
      return 'Sword_Regular_A';
  }
}

export function createRandomStyleLoadout(rng: () => number = Math.random): EquipmentStyleLoadout {
  const pick = <T,>(arr: StyleOptionMeta<T & string>[]): T =>
    arr[Math.floor(rng() * arr.length)].id;
  const weaponMain = pick(WEAPON_MAIN_STYLES);
  const offhandPool =
    weaponMain === 'recurve_bow'
      ? WEAPON_OFFHAND_STYLES.filter((o) => o.id === 'quiver_arrow' || o.id === 'none')
      : weaponMain === 'greatsword' || weaponMain === 'spear'
        ? WEAPON_OFFHAND_STYLES.filter((o) => o.id === 'none' || o.id === 'round_shield')
        : WEAPON_OFFHAND_STYLES.filter((o) => o.id !== 'quiver_arrow');

  return {
    helmet: pick(HELMET_STYLES),
    chest: pick(CHEST_STYLES),
    shoulders: pick(SHOULDER_STYLES),
    legs: pick(LEGS_STYLES),
    boots: pick(BOOTS_STYLES),
    gloves: pick(GLOVES_STYLES),
    weaponMain,
    weaponOffhand: offhandPool[Math.floor(rng() * offhandPool.length)].id,
  };
}
