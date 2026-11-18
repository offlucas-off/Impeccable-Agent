import type { PlayerClassId } from './PlayerEquipmentBuilder';

export type HelmetStyleId =
  | 'none'
  | 'full_helm'
  | 'open_helm'
  | 'winged_helm'
  | 'hood'
  | 'wizard_hat'
  | 'circlet'
  | 'horned_viking'
  | 'plumed_knight'
  | 'plague_mask'
  | 'assassin_cowl'
  | 'samurai_kabuto'
  | 'crown_king';

export type ChestStyleId =
  | 'plate_cuirass'
  | 'leather_brigandine'
  | 'ranger_coat'
  | 'arcane_robe'
  | 'royal_tabard'
  | 'scale_mail'
  | 'samurai_do'
  | 'necromancer_vest'
  | 'paladin_breastplate';

export type ShoulderStyleId =
  | 'none'
  | 'heavy_pauldrons'
  | 'asym_duelist'
  | 'fur_leather'
  | 'arcane_mantle';

export type LegsStyleId = 'plate_cuisses' | 'battle_kilt' | 'ranger_trousers';
export type BootsStyleId = 'steel_sabatons' | 'cuffed_boots' | 'light_greaves';
export type GlovesStyleId = 'heavy_gauntlets' | 'leather_bracers' | 'arcane_cuffs';

export type BackStyleId =
  | 'none'
  | 'short_cloak'
  | 'quiver_pack'
  | 'adventurer_backpack'
  | 'wings_valkyrie'
  | 'banner_crest';

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
  | 'wand'
  | 'halberd'
  | 'scythe'
  | 'flail'
  | 'katana'
  | 'twin_blade'
  | 'great_hammer'
  | 'scepter_orb';

export type WeaponOffhandStyleId =
  | 'none'
  | 'kite_shield'
  | 'round_shield'
  | 'tower_shield'
  | 'tome'
  | 'arcane_orb'
  | 'offhand_dagger'
  | 'quiver_arrow'
  | 'spiked_buckler'
  | 'lantern_offhand'
  | 'crystal_focus'
  | 'parrying_dagger';

export type MaterialThemeId =
  | 'rarity_auto'
  | 'steel'
  | 'dark_iron'
  | 'bronze'
  | 'gilded'
  | 'mithril'
  | 'obsidian'
  | 'emerald_elven'
  | 'crimson_blood';

export interface MaterialThemeDef {
  id: MaterialThemeId;
  labelPt: string;
  metalHex: string;
  trimHex: string;
  clothHex: string;
  accentHex: string;
  metalness: number;
  roughness: number;
}

export const MATERIAL_THEMES: Record<MaterialThemeId, MaterialThemeDef> = {
  rarity_auto: {
    id: 'rarity_auto',
    labelPt: 'Automático (Raridade)',
    metalHex: '#8d99ae',
    trimHex: '#d4a359',
    clothHex: '#3f5277',
    accentHex: '#4ea8de',
    metalness: 0.72,
    roughness: 0.34,
  },
  steel: {
    id: 'steel',
    labelPt: 'Aço Polido',
    metalHex: '#9aa7b8',
    trimHex: '#cbd5e1',
    clothHex: '#334155',
    accentHex: '#60a5fa',
    metalness: 0.82,
    roughness: 0.28,
  },
  dark_iron: {
    id: 'dark_iron',
    labelPt: 'Ferro Sombrio',
    metalHex: '#3f4552',
    trimHex: '#6b7280',
    clothHex: '#1e1b24',
    accentHex: '#a855f7',
    metalness: 0.76,
    roughness: 0.42,
  },
  bronze: {
    id: 'bronze',
    labelPt: 'Bronze Antigo',
    metalHex: '#a47148',
    trimHex: '#d99b52',
    clothHex: '#5c3a28',
    accentHex: '#fbbf24',
    metalness: 0.78,
    roughness: 0.36,
  },
  gilded: {
    id: 'gilded',
    labelPt: 'Ouro Real',
    metalHex: '#d4a843',
    trimHex: '#f6d365',
    clothHex: '#7f1d1d',
    accentHex: '#fef08a',
    metalness: 0.88,
    roughness: 0.24,
  },
  mithril: {
    id: 'mithril',
    labelPt: 'Mithril Prateado',
    metalHex: '#c7d8e8',
    trimHex: '#7dd3fc',
    clothHex: '#1e3a5f',
    accentHex: '#38bdf8',
    metalness: 0.9,
    roughness: 0.2,
  },
  obsidian: {
    id: 'obsidian',
    labelPt: 'Obsidiana Vulcânica',
    metalHex: '#25222c',
    trimHex: '#f97316',
    clothHex: '#18141c',
    accentHex: '#fb923c',
    metalness: 0.65,
    roughness: 0.22,
  },
  emerald_elven: {
    id: 'emerald_elven',
    labelPt: 'Élfico Esmeralda',
    metalHex: '#6a8d73',
    trimHex: '#d4b46a',
    clothHex: '#1f4d36',
    accentHex: '#4ade80',
    metalness: 0.74,
    roughness: 0.3,
  },
  crimson_blood: {
    id: 'crimson_blood',
    labelPt: 'Carmesim Sanguíneo',
    metalHex: '#7f242c',
    trimHex: '#d4a359',
    clothHex: '#450a0a',
    accentHex: '#f43f5e',
    metalness: 0.78,
    roughness: 0.32,
  },
};

export interface EquipmentStyleLoadout {
  helmet: HelmetStyleId;
  chest: ChestStyleId;
  shoulders: ShoulderStyleId;
  legs: LegsStyleId;
  boots: BootsStyleId;
  gloves: GlovesStyleId;
  back?: BackStyleId;
  weaponMain: WeaponMainStyleId;
  weaponOffhand: WeaponOffhandStyleId;
  materialTheme?: MaterialThemeId;
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
  { id: 'plumed_knight', labelPt: 'Elmo com Pluma Real', isMetal: true },
  { id: 'horned_viking', labelPt: 'Elmo Nórdico (Chifres)', isMetal: true },
  { id: 'samurai_kabuto', labelPt: 'Kabuto Samurai', isMetal: true },
  { id: 'crown_king', labelPt: 'Coroa Soberana', isMetal: true },
  { id: 'plague_mask', labelPt: 'Máscara de Peste', isMetal: false },
  { id: 'assassin_cowl', labelPt: 'Capuz + Máscara Sombria', isMetal: false },
  { id: 'hood', labelPt: 'Capuz de Patrulheiro', isMetal: false },
  { id: 'wizard_hat', labelPt: 'Chapéu Arcano Pontudo', isMetal: false },
  { id: 'circlet', labelPt: 'Diadema / Coroa Rúnica', isMetal: true },
  { id: 'none', labelPt: 'Sem Elmo (Rosto Livre)', isMetal: false },
];

export const CHEST_STYLES: StyleOptionMeta<ChestStyleId>[] = [
  { id: 'plate_cuirass', labelPt: 'Couraça de Placas', isMetal: true },
  { id: 'paladin_breastplate', labelPt: 'Peitoral de Paladino', isMetal: true },
  { id: 'scale_mail', labelPt: 'Cota de Escamas', isMetal: true },
  { id: 'samurai_do', labelPt: 'Armadura Lamelar (Dō)', isMetal: true },
  { id: 'royal_tabard', labelPt: 'Tabardo Real', isMetal: true },
  { id: 'leather_brigandine', labelPt: 'Brigandina de Couro', isMetal: false },
  { id: 'ranger_coat', labelPt: 'Casaco + Aljava', isMetal: false },
  { id: 'arcane_robe', labelPt: 'Túnica / Manto Arcano', isMetal: false },
  { id: 'necromancer_vest', labelPt: 'Veste Necromântica', isMetal: false },
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

export const BACK_STYLES: StyleOptionMeta<BackStyleId>[] = [
  { id: 'none', labelPt: 'Sem Acessório Dorsal', isMetal: false },
  { id: 'short_cloak', labelPt: 'Capa Curta de Viajante', isMetal: false },
  { id: 'quiver_pack', labelPt: 'Aljava Dorsal Completa', isMetal: false },
  { id: 'adventurer_backpack', labelPt: 'Mochila de Aventureiro', isMetal: false },
  { id: 'wings_valkyrie', labelPt: 'Asas de Valquíria', isMetal: true },
  { id: 'banner_crest', labelPt: 'Estandarte Dorsal (Sashimono)', isMetal: false },
];

export const WEAPON_MAIN_STYLES: StyleOptionMeta<WeaponMainStyleId>[] = [
  { id: 'longsword', labelPt: 'Espada Longa (1H)', isMetal: true },
  { id: 'greatsword', labelPt: 'Montante / Greatsword (2H)', isMetal: true },
  { id: 'katana', labelPt: 'Katana Curva', isMetal: true },
  { id: 'twin_blade', labelPt: 'Lâmina Dupla', isMetal: true },
  { id: 'battleaxe', labelPt: 'Machado de Batalha', isMetal: true },
  { id: 'warhammer', labelPt: 'Martelo de Guerra', isMetal: true },
  { id: 'great_hammer', labelPt: 'Martelo Colossal (2H)', isMetal: true },
  { id: 'flail', labelPt: 'Mangual com Corrente', isMetal: true },
  { id: 'dagger', labelPt: 'Adaga / Punhal', isMetal: true },
  { id: 'spear', labelPt: 'Lança de Infantaria', isMetal: true },
  { id: 'halberd', labelPt: 'Alabarda Real', isMetal: true },
  { id: 'scythe', labelPt: 'Foice Ceifadora', isMetal: true },
  { id: 'recurve_bow', labelPt: 'Arco Recurvo', isMetal: false },
  { id: 'crossbow', labelPt: 'Besta Tática', isMetal: false },
  { id: 'arcane_staff', labelPt: 'Cajado Arcano', isMetal: false },
  { id: 'scepter_orb', labelPt: 'Cetro com Orbe Flutuante', isMetal: true },
  { id: 'wand', labelPt: 'Varinha Rúnica', isMetal: false },
];

export const WEAPON_OFFHAND_STYLES: StyleOptionMeta<WeaponOffhandStyleId>[] = [
  { id: 'kite_shield', labelPt: 'Escudo Gota (Kite)', isMetal: true },
  { id: 'round_shield', labelPt: 'Escudo Redondo (Broquel)', isMetal: true },
  { id: 'tower_shield', labelPt: 'Escudo Torre Pesado', isMetal: true },
  { id: 'spiked_buckler', labelPt: 'Broquel com Espinhos', isMetal: true },
  { id: 'tome', labelPt: 'Grimório Arcano', isMetal: false },
  { id: 'arcane_orb', labelPt: 'Orbe Rúnico', isMetal: false },
  { id: 'crystal_focus', labelPt: 'Cristal Foco Flutuante', isMetal: false },
  { id: 'lantern_offhand', labelPt: 'Lanterna de Explorador', isMetal: true },
  { id: 'offhand_dagger', labelPt: 'Adaga Secundária', isMetal: true },
  { id: 'parrying_dagger', labelPt: 'Adaga de Aparar (Main-Gauche)', isMetal: true },
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
    back: 'short_cloak',
    weaponMain: 'longsword',
    weaponOffhand: 'kite_shield',
    materialTheme: 'rarity_auto',
  },
  archer: {
    helmet: 'hood',
    chest: 'ranger_coat',
    shoulders: 'asym_duelist',
    legs: 'ranger_trousers',
    boots: 'cuffed_boots',
    gloves: 'leather_bracers',
    back: 'quiver_pack',
    weaponMain: 'recurve_bow',
    weaponOffhand: 'quiver_arrow',
    materialTheme: 'rarity_auto',
  },
  mage: {
    helmet: 'wizard_hat',
    chest: 'arcane_robe',
    shoulders: 'arcane_mantle',
    legs: 'battle_kilt',
    boots: 'light_greaves',
    gloves: 'arcane_cuffs',
    back: 'none',
    weaponMain: 'arcane_staff',
    weaponOffhand: 'tome',
    materialTheme: 'rarity_auto',
  },
};

export interface ArchetypePreset {
  id: string;
  labelPt: string;
  baseClass: PlayerClassId;
  loadout: EquipmentStyleLoadout;
}

export const EQUIPMENT_ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'paladin_royal',
    labelPt: 'Paladino Real',
    baseClass: 'knight',
    loadout: {
      helmet: 'plumed_knight',
      chest: 'paladin_breastplate',
      shoulders: 'heavy_pauldrons',
      legs: 'plate_cuisses',
      boots: 'steel_sabatons',
      gloves: 'heavy_gauntlets',
      back: 'wings_valkyrie',
      weaponMain: 'great_hammer',
      weaponOffhand: 'tower_shield',
      materialTheme: 'gilded',
    },
  },
  {
    id: 'shadow_assassin',
    labelPt: 'Assassino Sombrio',
    baseClass: 'archer',
    loadout: {
      helmet: 'assassin_cowl',
      chest: 'leather_brigandine',
      shoulders: 'asym_duelist',
      legs: 'ranger_trousers',
      boots: 'cuffed_boots',
      gloves: 'leather_bracers',
      back: 'short_cloak',
      weaponMain: 'twin_blade',
      weaponOffhand: 'parrying_dagger',
      materialTheme: 'dark_iron',
    },
  },
  {
    id: 'nordic_barbarian',
    labelPt: 'Bárbaro Nórdico',
    baseClass: 'knight',
    loadout: {
      helmet: 'horned_viking',
      chest: 'scale_mail',
      shoulders: 'fur_leather',
      legs: 'battle_kilt',
      boots: 'cuffed_boots',
      gloves: 'leather_bracers',
      back: 'adventurer_backpack',
      weaponMain: 'battleaxe',
      weaponOffhand: 'spiked_buckler',
      materialTheme: 'bronze',
    },
  },
  {
    id: 'runic_archmage',
    labelPt: 'Arquimago Rúnico',
    baseClass: 'mage',
    loadout: {
      helmet: 'crown_king',
      chest: 'necromancer_vest',
      shoulders: 'arcane_mantle',
      legs: 'battle_kilt',
      boots: 'light_greaves',
      gloves: 'arcane_cuffs',
      back: 'short_cloak',
      weaponMain: 'scepter_orb',
      weaponOffhand: 'crystal_focus',
      materialTheme: 'mithril',
    },
  },
  {
    id: 'elven_ranger',
    labelPt: 'Patrulheiro Élfico',
    baseClass: 'archer',
    loadout: {
      helmet: 'circlet',
      chest: 'ranger_coat',
      shoulders: 'asym_duelist',
      legs: 'ranger_trousers',
      boots: 'light_greaves',
      gloves: 'leather_bracers',
      back: 'quiver_pack',
      weaponMain: 'recurve_bow',
      weaponOffhand: 'quiver_arrow',
      materialTheme: 'emerald_elven',
    },
  },
  {
    id: 'samurai_ronin',
    labelPt: 'Samurai Ronin',
    baseClass: 'knight',
    loadout: {
      helmet: 'samurai_kabuto',
      chest: 'samurai_do',
      shoulders: 'heavy_pauldrons',
      legs: 'battle_kilt',
      boots: 'steel_sabatons',
      gloves: 'heavy_gauntlets',
      back: 'banner_crest',
      weaponMain: 'katana',
      weaponOffhand: 'lantern_offhand',
      materialTheme: 'crimson_blood',
    },
  },
];

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

export interface WeaponGripPivotSpec {
  /** Forward pitch around local X in radians (+15° to +25°). */
  pitchRad: number;
  /** Outward yaw around local Y in radians (-12°). */
  yawRad: number;
  /** Maximum allowed rear overhang behind handGripCenterZ (meters). */
  maxRearOverhang: number;
}

const DEG2RAD = Math.PI / 180;
const GRIP_1H: WeaponGripPivotSpec = {
  pitchRad: 18 * DEG2RAD,
  yawRad: -12 * DEG2RAD,
  maxRearOverhang: 0.14,
};
const GRIP_2H: WeaponGripPivotSpec = {
  pitchRad: 22 * DEG2RAD,
  yawRad: -12 * DEG2RAD,
  maxRearOverhang: 0.18,
};
const GRIP_POLEARM: WeaponGripPivotSpec = {
  pitchRad: 24 * DEG2RAD,
  yawRad: -12 * DEG2RAD,
  maxRearOverhang: 0.22,
};
const GRIP_STAFF: WeaponGripPivotSpec = {
  pitchRad: 42 * DEG2RAD,
  yawRad: -18 * DEG2RAD,
  maxRearOverhang: 0.16,
};
const GRIP_RANGED: WeaponGripPivotSpec = {
  pitchRad: 0,
  yawRad: 0,
  maxRearOverhang: 0.2,
};

export const WEAPON_GRIP_PIVOTS: Partial<Record<WeaponMainStyleId, WeaponGripPivotSpec>> = {
  longsword: GRIP_1H,
  katana: GRIP_1H,
  dagger: GRIP_1H,
  twin_blade: GRIP_1H,
  flail: GRIP_1H,
  scepter_orb: GRIP_STAFF,
  wand: GRIP_STAFF,
  greatsword: GRIP_2H,
  great_hammer: GRIP_2H,
  battleaxe: GRIP_2H,
  arcane_staff: GRIP_STAFF,
  spear: GRIP_POLEARM,
  halberd: GRIP_POLEARM,
  scythe: GRIP_POLEARM,
  recurve_bow: GRIP_RANGED,
  crossbow: GRIP_RANGED,
};

export function getWeaponGripPivot(style: WeaponMainStyleId): WeaponGripPivotSpec {
  return WEAPON_GRIP_PIVOTS[style] ?? GRIP_1H;
}

export function getRecommendedClipForWeapon(weaponMain: WeaponMainStyleId): string {
  switch (weaponMain) {
    case 'recurve_bow':
    case 'crossbow':
      return 'Idle_Loop';
    case 'arcane_staff':
    case 'scepter_orb':
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
      : weaponMain === 'greatsword' ||
          weaponMain === 'spear' ||
          weaponMain === 'halberd' ||
          weaponMain === 'scythe' ||
          weaponMain === 'great_hammer'
        ? WEAPON_OFFHAND_STYLES.filter((o) => o.id === 'none' || o.id === 'round_shield')
        : WEAPON_OFFHAND_STYLES.filter((o) => o.id !== 'quiver_arrow');

  const themeKeys = Object.keys(MATERIAL_THEMES) as MaterialThemeId[];

  return {
    helmet: pick(HELMET_STYLES),
    chest: pick(CHEST_STYLES),
    shoulders: pick(SHOULDER_STYLES),
    legs: pick(LEGS_STYLES),
    boots: pick(BOOTS_STYLES),
    gloves: pick(GLOVES_STYLES),
    back: pick(BACK_STYLES),
    weaponMain,
    weaponOffhand: offhandPool[Math.floor(rng() * offhandPool.length)].id,
    materialTheme: themeKeys[Math.floor(rng() * themeKeys.length)],
  };
}
