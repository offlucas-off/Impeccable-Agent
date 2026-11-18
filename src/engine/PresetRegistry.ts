import type { VisualStylePresetId } from './types';

export type PresetCategory =
  | 'heroes'
  | 'npcs'
  | 'monsters'
  | 'quadrupeds'
  | 'bosses'
  | 'props'
  | 'structures'
  | 'dungeons'
  | 'vfx';

export interface PresetGeneratorSpec {
  kind:
    | 'player'
    | 'npc'
    | 'monster'
    | 'quadruped'
    | 'prop'
    | 'structure'
    | 'dungeon'
    | 'vfx';
  subId: string;
}

export interface PresetEntry {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
  tags: string[];
  approxHeightM: number;
  isLargeStructure?: boolean;
  supports8DirSheet?: boolean;
  stagePresetKey?: string;
  defaultStylePreset?: VisualStylePresetId;
  defaultPixelated?: boolean;
  generatorSpec?: PresetGeneratorSpec;
}

export const DEFAULT_PRESET_STYLE: VisualStylePresetId = 'hifi_stylized';

export const PRESET_CATEGORY_LABELS: Record<PresetCategory, string> = {
  heroes: 'Heróis & Classes',
  npcs: 'NPCs da Cidade',
  monsters: 'Monstros Bípedes',
  quadrupeds: 'Criaturas Quadrúpedes',
  bosses: 'Bosses Gigantes',
  props: 'Props & Mobília',
  structures: 'Estruturas & Cidade',
  dungeons: 'Dungeons 1.5m',
  vfx: 'Magias & VFX 3D',
};

export const UNIFIED_PRESET_REGISTRY: PresetEntry[] = [
  // ─── Heroes ────────────────────────────────────────────────────────────────
  {
    id: 'nwl_knight',
    name: 'Knight (Guerreiro)',
    category: 'heroes',
    description: 'Cavaleiro com armadura de placas, espada longa e escudo kite no braço.',
    tags: ['hero', 'knight', 'melee', 'plate', 'shield', 'ual'],
    approxHeightM: 1.8,
    supports8DirSheet: true,
    stagePresetKey: 'nwl_knight',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'player', subId: 'knight' },
  },
  {
    id: 'nwl_archer',
    name: 'Archer (Patrulheiro)',
    category: 'heroes',
    description: 'Arqueiro com capuz, aljava e arco recurvo no rig UAL.',
    tags: ['hero', 'archer', 'ranged', 'bow', 'leather', 'ual'],
    approxHeightM: 1.78,
    supports8DirSheet: true,
    stagePresetKey: 'nwl_archer',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'player', subId: 'archer' },
  },
  {
    id: 'nwl_mage',
    name: 'Mage (Arcanista)',
    category: 'heroes',
    description: 'Mago com chapéu pontudo, túnica rúnica, cajado e grimório.',
    tags: ['hero', 'mage', 'magic', 'staff', 'robe', 'ual'],
    approxHeightM: 1.78,
    supports8DirSheet: true,
    stagePresetKey: 'nwl_mage',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'player', subId: 'mage' },
  },

  // ─── NPCs ──────────────────────────────────────────────────────────────────
  {
    id: 'npc.blacksmith',
    name: 'Ferreiro da Cidade',
    category: 'npcs',
    description: 'NPC ferreiro com avental de couro e martelo de forja.',
    tags: ['npc', 'town', 'blacksmith', 'forge'],
    approxHeightM: 1.8,
    supports8DirSheet: true,
    generatorSpec: { kind: 'npc', subId: 'blacksmith' },
  },
  {
    id: 'npc.merchant',
    name: 'Mercador Viajante',
    category: 'npcs',
    description: 'NPC mercador com túnica ornamentada e bolsa de moedas.',
    tags: ['npc', 'town', 'merchant', 'shop'],
    approxHeightM: 1.76,
    supports8DirSheet: true,
    generatorSpec: { kind: 'npc', subId: 'merchant' },
  },
  {
    id: 'npc.guard',
    name: 'Guarda da Muralha',
    category: 'npcs',
    description: 'Guarda equipado com alabarda e elmo aberto.',
    tags: ['npc', 'town', 'guard', 'spear'],
    approxHeightM: 1.82,
    supports8DirSheet: true,
    generatorSpec: { kind: 'npc', subId: 'guard' },
  },
  {
    id: 'npc.villager',
    name: 'Aldeão / Habitante',
    category: 'npcs',
    description: 'Cidadão comum para povoar vilas e tavernas.',
    tags: ['npc', 'town', 'villager'],
    approxHeightM: 1.74,
    supports8DirSheet: true,
    generatorSpec: { kind: 'npc', subId: 'villager' },
  },

  // ─── Bipedal Monsters ──────────────────────────────────────────────────────
  {
    id: 'monster.goblin_scout',
    name: 'Goblin Batedor',
    category: 'monsters',
    description: 'Goblin ágil com adaga enferrujada e orelhas pontudas.',
    tags: ['monster', 'goblin', 'scout', 'ual'],
    approxHeightM: 1.25,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'goblin_scout' },
  },
  {
    id: 'monster.goblin_raider',
    name: 'Goblin Saqueador',
    category: 'monsters',
    description: 'Goblin armado com clava e ombreira de sucata.',
    tags: ['monster', 'goblin', 'raider', 'ual'],
    approxHeightM: 1.3,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'goblin_raider' },
  },
  {
    id: 'monster.goblin_archer',
    name: 'Goblin Arqueiro',
    category: 'monsters',
    description: 'Goblin atirador com arco curto improvisado.',
    tags: ['monster', 'goblin', 'archer', 'ranged'],
    approxHeightM: 1.26,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'goblin_archer' },
  },
  {
    id: 'monster.goblin_shaman',
    name: 'Goblin Xamã',
    category: 'monsters',
    description: 'Goblin conjurador com cajado de crânio e máscara ritual.',
    tags: ['monster', 'goblin', 'shaman', 'magic'],
    approxHeightM: 1.32,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'goblin_shaman' },
  },
  {
    id: 'monster.orc_brute',
    name: 'Orc Brutamontes',
    category: 'monsters',
    description: 'Guerreiro orc musculoso com machado pesado e presas.',
    tags: ['monster', 'orc', 'brute', 'heavy'],
    approxHeightM: 2.05,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'orc_brute' },
  },
  {
    id: 'monster.skeleton_warrior',
    name: 'Esqueleto Guerreiro',
    category: 'monsters',
    description: 'Morto-vivo esquelético com espada enferrujada e escudo partido.',
    tags: ['monster', 'undead', 'skeleton', 'crypt'],
    approxHeightM: 1.75,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'skeleton_warrior' },
  },
  {
    id: 'monster.skeleton_archer',
    name: 'Esqueleto Arqueiro',
    category: 'monsters',
    description: 'Esqueleto atirador com capuz esfarrapado e arco ósseo.',
    tags: ['monster', 'undead', 'skeleton', 'archer'],
    approxHeightM: 1.74,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'skeleton_archer' },
  },
  {
    id: 'monster.dark_cultist',
    name: 'Cultista Sombrio',
    category: 'monsters',
    description: 'Adeptus com manto encapuzado, máscara ritual e adaga curva.',
    tags: ['monster', 'cultist', 'dark', 'magic'],
    approxHeightM: 1.8,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'dark_cultist' },
  },
  {
    id: 'monster.gargoyle',
    name: 'Gárgula de Pedra',
    category: 'monsters',
    description: 'Criatura alada de granito com chifres e garras afiadas.',
    tags: ['monster', 'gargoyle', 'stone', 'wings'],
    approxHeightM: 1.95,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'gargoyle' },
  },
  {
    id: 'monster.lizardman',
    name: 'Homem-Lagarto',
    category: 'monsters',
    description: 'Guerreiro reptiliano com crista dorsal, cauda e lança tribal.',
    tags: ['monster', 'lizardman', 'reptile', 'spear'],
    approxHeightM: 1.88,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'lizardman' },
  },
  {
    id: 'monster.crystal_golem',
    name: 'Golem de Cristal',
    category: 'monsters',
    description: 'Construto elemental com aglomerados de cristal emissivo.',
    tags: ['monster', 'golem', 'crystal', 'elemental'],
    approxHeightM: 2.25,
    supports8DirSheet: true,
    generatorSpec: { kind: 'monster', subId: 'crystal_golem' },
  },

  // ─── Quadruped Creatures ───────────────────────────────────────────────────
  {
    id: 'quad.grey_wolf',
    name: 'Lobo Cinzento',
    category: 'quadrupeds',
    description: 'Lobo selvagem articulado no rig quadrúpede canônico de 24 bones.',
    tags: ['quadruped', 'wolf', 'beast', 'forest'],
    approxHeightM: 0.95,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'grey_wolf' },
  },
  {
    id: 'quad.alpha_wolf',
    name: 'Lobo Alfa (Sombrio)',
    category: 'quadrupeds',
    description: 'Lobo líder maior com juba eriçada e olhos brilhantes.',
    tags: ['quadruped', 'wolf', 'alpha', 'beast'],
    approxHeightM: 1.2,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'alpha_wolf' },
  },
  {
    id: 'quad.town_reindeer',
    name: 'Rena / Cervo Real',
    category: 'quadrupeds',
    description: 'Cervo com galhada ramificada para florestas e praças.',
    tags: ['quadruped', 'deer', 'reindeer', 'fauna'],
    approxHeightM: 1.45,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'town_reindeer' },
  },
  {
    id: 'quad.armored_boar',
    name: 'Javali Blindado',
    category: 'quadrupeds',
    description: 'Javali robusto com presas curvas e placas de ferro no dorso.',
    tags: ['quadruped', 'boar', 'armored', 'beast'],
    approxHeightM: 1.05,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'armored_boar' },
  },
  {
    id: 'quad.grizzly_bear',
    name: 'Urso Pardo',
    category: 'quadrupeds',
    description: 'Urso massivo com patas largas e ombreiras musculosas.',
    tags: ['quadruped', 'bear', 'beast', 'heavy'],
    approxHeightM: 1.55,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'grizzly_bear' },
  },
  {
    id: 'quad.war_horse',
    name: 'Cavalo de Guerra',
    category: 'quadrupeds',
    description: 'Corcel de batalha com barda frontal e crina esculpida.',
    tags: ['quadruped', 'horse', 'mount', 'knight'],
    approxHeightM: 1.75,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'war_horse' },
  },
  {
    id: 'quad.hellhound',
    name: 'Cão Infernal (Hellhound)',
    category: 'quadrupeds',
    description: 'Fera demoníaca com espinhos dorsais e núcleo flamejante.',
    tags: ['quadruped', 'hellhound', 'demon', 'fire'],
    approxHeightM: 1.25,
    supports8DirSheet: true,
    generatorSpec: { kind: 'quadruped', subId: 'hellhound' },
  },

  // ─── Giant Bosses ──────────────────────────────────────────────────────────
  {
    id: 'nwl_boss_demon',
    name: 'Boss: Demônio Abissal',
    category: 'bosses',
    description: 'Chefe bípede gigante (2.95m) com chifres, asas e montante flamejante.',
    tags: ['boss', 'demon', 'giant', 'ual'],
    approxHeightM: 2.95,
    supports8DirSheet: true,
    stagePresetKey: 'nwl_boss_demon',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'monster', subId: 'boss_demon' },
  },
  {
    id: 'boss.colossus_golem',
    name: 'Boss: Colosso Rúnico',
    category: 'bosses',
    description: 'Titã de pedra de 3.6m com núcleo rúnico brilhante e ombros assimétricos.',
    tags: ['boss', 'golem', 'colossus', 'giant'],
    approxHeightM: 3.6,
    supports8DirSheet: true,
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'monster', subId: 'colossus_golem' },
  },
  {
    id: 'boss.minotaur_warlord',
    name: 'Boss: Senhor Minotauro',
    category: 'bosses',
    description: 'Chefe taurino de 3.2m com chifres gigantes e machado colossal.',
    tags: ['boss', 'minotaur', 'warlord', 'giant'],
    approxHeightM: 3.2,
    supports8DirSheet: true,
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'monster', subId: 'minotaur_warlord' },
  },
  {
    id: 'boss.dread_knight',
    name: 'Boss: Cavaleiro do Pavor',
    category: 'bosses',
    description: 'Armadura negra espinhosa de 3.0m com montante rúnica e capa.',
    tags: ['boss', 'knight', 'dread', 'giant'],
    approxHeightM: 3.0,
    supports8DirSheet: true,
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'monster', subId: 'dread_knight' },
  },
  {
    id: 'boss.elder_wyvern',
    name: 'Boss: Wyvern Ancião',
    category: 'bosses',
    description: 'Dragão quadrúpede alado de 4.2m com asas articuladas e cauda.',
    tags: ['boss', 'wyvern', 'dragon', 'quadruped', 'giant'],
    approxHeightM: 4.2,
    supports8DirSheet: true,
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'quadruped', subId: 'elder_wyvern' },
  },

  // ─── Props ─────────────────────────────────────────────────────────────────
  {
    id: 'nwl_chest',
    name: 'Baú de Tesouro',
    category: 'props',
    description: 'Baú de madeira com ferragens e moedas.',
    tags: ['prop', 'chest', 'loot', 'dungeon'],
    approxHeightM: 0.9,
    stagePresetKey: 'nwl_chest',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'prop', subId: 'treasure_chest' },
  },
  {
    id: 'prop.wooden_barrel',
    name: 'Barril de Madeira',
    category: 'props',
    description: 'Barril reforçado com aros metálicos.',
    tags: ['prop', 'barrel', 'tavern', 'dungeon'],
    approxHeightM: 0.95,
    generatorSpec: { kind: 'prop', subId: 'wooden_barrel' },
  },
  {
    id: 'prop.supply_crate',
    name: 'Caixa de Suprimentos',
    category: 'props',
    description: 'Caixote reforçado com travas diagonais.',
    tags: ['prop', 'crate', 'town', 'market'],
    approxHeightM: 0.85,
    generatorSpec: { kind: 'prop', subId: 'supply_crate' },
  },
  {
    id: 'prop.torch_post',
    name: 'Poste com Tocha',
    category: 'props',
    description: 'Poste de ferro e madeira com chama emissiva.',
    tags: ['prop', 'torch', 'light', 'dungeon'],
    approxHeightM: 2.1,
    generatorSpec: { kind: 'prop', subId: 'torch_post' },
  },
  {
    id: 'prop.well',
    name: 'Poço da Vila',
    category: 'props',
    description: 'Poço de pedra circular com telhado de madeira e balde.',
    tags: ['prop', 'town', 'well', 'water'],
    approxHeightM: 2.5,
    generatorSpec: { kind: 'prop', subId: 'well' },
  },
  {
    id: 'prop.market_stall',
    name: 'Banca de Mercado',
    category: 'props',
    description: 'Barraca de feira com toldo listrado e balcão de madeira.',
    tags: ['prop', 'town', 'market', 'stall'],
    approxHeightM: 2.4,
    generatorSpec: { kind: 'prop', subId: 'market_stall' },
  },
  {
    id: 'prop.anvil',
    name: 'Bigorna de Ferreiro',
    category: 'props',
    description: 'Bigorna de ferro sobre cepo de carvalho.',
    tags: ['prop', 'town', 'forge', 'anvil'],
    approxHeightM: 0.95,
    generatorSpec: { kind: 'prop', subId: 'anvil' },
  },
  {
    id: 'prop.cart',
    name: 'Carroça de Carga',
    category: 'props',
    description: 'Carroça de madeira com rodas raiadas e varais.',
    tags: ['prop', 'town', 'cart', 'transport'],
    approxHeightM: 1.4,
    generatorSpec: { kind: 'prop', subId: 'cart' },
  },
  {
    id: 'prop.signpost',
    name: 'Placa Direcional',
    category: 'props',
    description: 'Poste com placas de madeira apontando rotas.',
    tags: ['prop', 'town', 'signpost', 'road'],
    approxHeightM: 2.0,
    generatorSpec: { kind: 'prop', subId: 'signpost' },
  },
  {
    id: 'prop.bench',
    name: 'Banco de Praça',
    category: 'props',
    description: 'Banco de madeira e ferro forjado.',
    tags: ['prop', 'town', 'bench', 'furniture'],
    approxHeightM: 0.9,
    generatorSpec: { kind: 'prop', subId: 'bench' },
  },
  {
    id: 'prop.fountain',
    name: 'Fonte de Pedra',
    category: 'props',
    description: 'Fonte ornamental de dois níveis com água azulada.',
    tags: ['prop', 'town', 'fountain', 'water'],
    approxHeightM: 2.2,
    generatorSpec: { kind: 'prop', subId: 'fountain' },
  },
  {
    id: 'prop.hay_bale',
    name: 'Fardo de Feno',
    category: 'props',
    description: 'Fardo cilíndrico/retangular amarrado com cordas.',
    tags: ['prop', 'farm', 'hay', 'town'],
    approxHeightM: 0.85,
    generatorSpec: { kind: 'prop', subId: 'hay_bale' },
  },
  {
    id: 'prop.sack',
    name: 'Saco de Grãos',
    category: 'props',
    description: 'Saco de estopa amarrado no topo.',
    tags: ['prop', 'market', 'sack', 'town'],
    approxHeightM: 0.75,
    generatorSpec: { kind: 'prop', subId: 'sack' },
  },
  {
    id: 'prop.banner_stand',
    name: 'Estandarte Real',
    category: 'props',
    description: 'Mastro metálico com bandeira heráldica vertical.',
    tags: ['prop', 'castle', 'banner', 'flag'],
    approxHeightM: 2.6,
    generatorSpec: { kind: 'prop', subId: 'banner_stand' },
  },
  {
    id: 'prop.crystal_cluster',
    name: 'Aglomerado de Cristais',
    category: 'props',
    description: 'Formação mineral de cristais prismáticos emissivos.',
    tags: ['prop', 'dungeon', 'crystal', 'magic'],
    approxHeightM: 1.5,
    generatorSpec: { kind: 'prop', subId: 'crystal_cluster' },
  },
  {
    id: 'prop.statue_knight',
    name: 'Estátua de Cavaleiro',
    category: 'props',
    description: 'Monumento de pedra com cavaleiro e espada sobre pedestal.',
    tags: ['prop', 'dungeon', 'statue', 'castle'],
    approxHeightM: 2.8,
    generatorSpec: { kind: 'prop', subId: 'statue_knight' },
  },
  {
    id: 'prop.tombstone',
    name: 'Lápide Gótica',
    category: 'props',
    description: 'Lápide de pedra desgastada com cruz entalhada.',
    tags: ['prop', 'crypt', 'tombstone', 'grave'],
    approxHeightM: 1.3,
    generatorSpec: { kind: 'prop', subId: 'tombstone' },
  },
  {
    id: 'prop.cage',
    name: 'Jaula de Ferro',
    category: 'props',
    description: 'Cela gradeada de ferro forjado para masmorras.',
    tags: ['prop', 'dungeon', 'cage', 'iron'],
    approxHeightM: 2.1,
    generatorSpec: { kind: 'prop', subId: 'cage' },
  },
  {
    id: 'prop.alchemist_table',
    name: 'Mesa de Alquimista',
    category: 'props',
    description: 'Bancada de madeira com frascos, poções e pergaminhos.',
    tags: ['prop', 'alchemy', 'table', 'potions'],
    approxHeightM: 1.3,
    generatorSpec: { kind: 'prop', subId: 'alchemist_table' },
  },
  {
    id: 'prop.bookshelf',
    name: 'Estante de Livros',
    category: 'props',
    description: 'Estante alta de biblioteca repleta de tomos coloridos.',
    tags: ['prop', 'library', 'bookshelf', 'furniture'],
    approxHeightM: 2.3,
    generatorSpec: { kind: 'prop', subId: 'bookshelf' },
  },
  {
    id: 'prop.brazier',
    name: 'Braseiro Aceso',
    category: 'props',
    description: 'Tripé de ferro com brasas e chama estilizada.',
    tags: ['prop', 'dungeon', 'brazier', 'fire'],
    approxHeightM: 1.35,
    generatorSpec: { kind: 'prop', subId: 'brazier' },
  },
  {
    id: 'prop.weapon_rack',
    name: 'Suporte de Armas',
    category: 'props',
    description: 'Rack de madeira exibindo espadas, machados e escudo.',
    tags: ['prop', 'armory', 'weapons', 'rack'],
    approxHeightM: 1.6,
    generatorSpec: { kind: 'prop', subId: 'weapon_rack' },
  },

  // ─── Structures & Cities ───────────────────────────────────────────────────
  {
    id: 'nwl_starter_city',
    name: 'Cidade Inicial Completa',
    category: 'structures',
    description: 'Vila medieval murada com praça, casas, NPCs e portais.',
    tags: ['structure', 'city', 'town', 'nwl'],
    approxHeightM: 6.5,
    isLargeStructure: true,
    stagePresetKey: 'nwl_starter_city',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
  },
  {
    id: 'struct.medieval_house',
    name: 'Casa Medieval (WFC)',
    category: 'structures',
    description: 'Construção modular enxaimel gerada via TilesetSolver.',
    tags: ['structure', 'house', 'medieval', 'wfc'],
    approxHeightM: 5.5,
    isLargeStructure: true,
    generatorSpec: { kind: 'structure', subId: 'medieval_town' },
  },
  {
    id: 'struct.watchtower',
    name: 'Torre de Vigia',
    category: 'structures',
    description: 'Torre de pedra defensiva com ameias e telhado cônico.',
    tags: ['structure', 'tower', 'castle', 'watchtower'],
    approxHeightM: 7.5,
    isLargeStructure: true,
    generatorSpec: { kind: 'structure', subId: 'watchtower' },
  },
  {
    id: 'struct.gatehouse',
    name: 'Muralha com Portão',
    category: 'structures',
    description: 'Portão fortificado com arco de pedra e grade levadiça.',
    tags: ['structure', 'gate', 'wall', 'castle'],
    approxHeightM: 5.2,
    isLargeStructure: true,
    generatorSpec: { kind: 'structure', subId: 'gatehouse' },
  },
  {
    id: 'struct.stone_bridge',
    name: 'Ponte de Pedra',
    category: 'structures',
    description: 'Ponte em arco sobre canal de água com parapeitos.',
    tags: ['structure', 'bridge', 'stone', 'town'],
    approxHeightM: 2.6,
    isLargeStructure: true,
    generatorSpec: { kind: 'structure', subId: 'stone_bridge' },
  },
  {
    id: 'struct.tavern_2story',
    name: 'Taverna 2 Andares',
    category: 'structures',
    description: 'Estalagem grande com balcão, chaminé e placa pendente.',
    tags: ['structure', 'tavern', 'inn', 'town'],
    approxHeightM: 6.8,
    isLargeStructure: true,
    generatorSpec: { kind: 'structure', subId: 'tavern_2story' },
  },

  // ─── Dungeons 1.5m ─────────────────────────────────────────────────────────
  {
    id: 'nwl_dungeon_floor1',
    name: 'Dungeon 1.5m: Ruínas Clássicas',
    category: 'dungeons',
    description: 'Masmorra modular 1.5m com salas, tochas, baús e pilares.',
    tags: ['dungeon', 'tileset', 'ruins', 'nwl'],
    approxHeightM: 3.2,
    isLargeStructure: true,
    stagePresetKey: 'nwl_dungeon_floor1',
    defaultStylePreset: 'hifi_stylized',
    defaultPixelated: false,
    generatorSpec: { kind: 'dungeon', subId: 'classic_ruins' },
  },
  {
    id: 'dungeon.gothic_crypt',
    name: 'Dungeon 1.5m: Cripta Gótica',
    category: 'dungeons',
    description: 'Catacumbas escuras com lápides, braseiros roxos e arcos góticos.',
    tags: ['dungeon', 'crypt', 'gothic', 'undead'],
    approxHeightM: 3.4,
    isLargeStructure: true,
    generatorSpec: { kind: 'dungeon', subId: 'gothic_crypt' },
  },
  {
    id: 'dungeon.magma_cavern',
    name: 'Dungeon 1.5m: Caverna Vulcânica',
    category: 'dungeons',
    description: 'Salões de basalto sobre magma incandescente e cristais de fogo.',
    tags: ['dungeon', 'magma', 'volcano', 'fire'],
    approxHeightM: 3.2,
    isLargeStructure: true,
    generatorSpec: { kind: 'dungeon', subId: 'magma_cavern' },
  },
  {
    id: 'dungeon.frost_temple',
    name: 'Dungeon 1.5m: Templo Congelado',
    category: 'dungeons',
    description: 'Ruínas glaciais com pilares de gelo translúcido e cristais azuis.',
    tags: ['dungeon', 'frost', 'ice', 'temple'],
    approxHeightM: 3.3,
    isLargeStructure: true,
    generatorSpec: { kind: 'dungeon', subId: 'frost_temple' },
  },
  {
    id: 'dungeon.shadow_forest',
    name: 'Dungeon 1.5m: Floresta Sombria',
    category: 'dungeons',
    description: 'Labirinto de ruínas tomadas por raízes, névoa e runas verdes.',
    tags: ['dungeon', 'forest', 'shadow', 'nature'],
    approxHeightM: 3.5,
    isLargeStructure: true,
    generatorSpec: { kind: 'dungeon', subId: 'shadow_forest' },
  },

  // ─── VFX 3D ────────────────────────────────────────────────────────────────
  {
    id: 'vfx.fire_nova',
    name: 'VFX: Nova de Fogo',
    category: 'vfx',
    description: 'Explosão radial de chamas e anel de choque.',
    tags: ['vfx', 'fire', 'spell'],
    approxHeightM: 1.6,
    generatorSpec: { kind: 'vfx', subId: 'fire_nova' },
  },
  {
    id: 'vfx.ice_shatter',
    name: 'VFX: Estilhaço Glacial',
    category: 'vfx',
    description: 'Lanças de gelo cristalino emergindo do solo.',
    tags: ['vfx', 'ice', 'spell'],
    approxHeightM: 1.8,
    generatorSpec: { kind: 'vfx', subId: 'ice_shatter' },
  },
  {
    id: 'vfx.arcane_sigil',
    name: 'VFX: Sigilo Arcano',
    category: 'vfx',
    description: 'Círculo rúnico flutuante com feixe vertical.',
    tags: ['vfx', 'arcane', 'spell'],
    approxHeightM: 2.0,
    generatorSpec: { kind: 'vfx', subId: 'arcane_sigil' },
  },
];

export function getAllPresets(): PresetEntry[] {
  return UNIFIED_PRESET_REGISTRY;
}

export function getPresetsByCategory(category: PresetCategory | 'all'): PresetEntry[] {
  if (category === 'all') return UNIFIED_PRESET_REGISTRY;
  return UNIFIED_PRESET_REGISTRY.filter((p) => p.category === category);
}

export function searchPresets(
  query: string,
  category: PresetCategory | 'all' = 'all'
): PresetEntry[] {
  const base = getPresetsByCategory(category);
  const q = query.trim().toLowerCase();
  if (!q) return base;
  return base.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function findPresetById(id: string): PresetEntry | undefined {
  return UNIFIED_PRESET_REGISTRY.find((p) => p.id === id);
}

export function getPresetDefaultStyle(presetOrId: string | PresetEntry): VisualStylePresetId {
  const entry = typeof presetOrId === 'string' ? findPresetById(presetOrId) : presetOrId;
  return entry?.defaultStylePreset ?? DEFAULT_PRESET_STYLE;
}
