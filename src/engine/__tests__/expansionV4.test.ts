import { describe, expect, it } from 'vitest';
import {
  BACK_STYLES,
  EQUIPMENT_ARCHETYPE_PRESETS,
  HELMET_STYLES,
  MATERIAL_THEMES,
  WEAPON_MAIN_STYLES,
  WEAPON_OFFHAND_STYLES,
} from '../procedural/EquipmentCatalog';
import { buildNwlPlayerCharacter } from '../procedural/PlayerEquipmentBuilder';
import { createCanonicalQuadrupedRig, buildQuadrupedAnimClips } from '../rigging/QuadrupedRigSpec';
import { buildQuadrupedCreature, QUADRUPED_CREATURE_SPECS } from '../procedural/CreatureBuilder';
import { buildNwlMonster, NWL_MONSTER_SPECS } from '../procedural/MonsterBuilder';
import { buildProceduralProp } from '../procedural/PropBuilder';
import {
  buildArchitecturalStructure,
  buildDungeonByBiome,
  DUNGEON_BIOME_THEMES,
} from '../procedural/NwlTilesetDungeon';
import {
  findPresetById,
  getAllPresets,
  getPresetsByCategory,
  searchPresets,
  type PresetCategory,
} from '../PresetRegistry';
import { crc32, createZipUint8Array, runBatchExport } from '../BatchExporter';

describe('Expansion v4 — Waves 1-5', () => {
  it('PresetRegistry covers all 9 categories and supports search/lookup', () => {
    const all = getAllPresets();
    expect(all.length).toBeGreaterThanOrEqual(40);

    const categories: PresetCategory[] = [
      'heroes',
      'npcs',
      'monsters',
      'quadrupeds',
      'bosses',
      'props',
      'structures',
      'dungeons',
      'vfx',
    ];
    for (const cat of categories) {
      expect(getPresetsByCategory(cat).length).toBeGreaterThan(0);
    }

    expect(findPresetById('nwl_knight')?.name).toContain('Knight');
    expect(findPresetById('quad.grey_wolf')?.category).toBe('quadrupeds');
    expect(searchPresets('wyvern', 'all').length).toBeGreaterThan(0);
  });

  it('BatchExporter computes CRC32, builds valid STORE ZIP headers, and generates manifest.json', async () => {
    const data = new TextEncoder().encode('hello');
    expect(crc32(data)).toBe(0x3610a686);

    const zipBytes = createZipUint8Array([
      { path: 'test.txt', data },
    ]);
    // Local file header PK\x03\x04
    expect(zipBytes[0]).toBe(0x50);
    expect(zipBytes[1]).toBe(0x4b);
    expect(zipBytes[2]).toBe(0x03);
    expect(zipBytes[3]).toBe(0x04);

    const samplePresets = [findPresetById('nwl_knight')!, findPresetById('quad.grey_wolf')!];
    const { zipBlob, manifest } = await runBatchExport(
      samplePresets,
      {
        loadPreset: async () => {},
        capturePngDataUrl: () => 'data:image/png;base64,iVBORw0KGgo=',
        exportGlbBytes: async () => ({ bytes: new Uint8Array([1, 2, 3, 4]), triangles: 120 }),
        getStyleInfo: () => ({
          stylePreset: 'stylized_crisp',
          paletteId: 'snes_dark_fantasy_nwl',
          rampId: 'stylized_crisp',
        }),
      },
      {
        categories: ['heroes', 'quadrupeds'],
        includeGlb: true,
        includePng: false,
        include8DirSheet: false,
        quantizeGlb: false,
        ditherGlb: false,
      }
    );
    expect(manifest.totalAssets).toBe(2);
    expect(manifest.assets.every((a) => a.files.some((f) => f.endsWith('.glb')))).toBe(true);
    expect(zipBlob.size).toBeGreaterThan(100);
  });

  it('EquipmentCatalog & PlayerEquipmentBuilder support back slot, material themes, and archetypes', () => {
    expect(BACK_STYLES.length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(MATERIAL_THEMES).length).toBeGreaterThanOrEqual(6);
    expect(HELMET_STYLES.length).toBeGreaterThanOrEqual(10);
    expect(WEAPON_MAIN_STYLES.length).toBeGreaterThanOrEqual(10);
    expect(WEAPON_OFFHAND_STYLES.length).toBeGreaterThanOrEqual(6);
    expect(EQUIPMENT_ARCHETYPE_PRESETS.length).toBeGreaterThanOrEqual(6);

    const paladin = EQUIPMENT_ARCHETYPE_PRESETS.find((a) => a.id === 'paladin_royal')!;
    const player = buildNwlPlayerCharacter({
      classId: paladin.baseClass,
      rarity: 'epic',
      styleLoadout: paladin.loadout,
      finishMode: 'classic_flat',
    });
    expect(player.root.children.length).toBeGreaterThan(0);
    player.setStyleLoadout({
      ...paladin.loadout,
      back: 'dragon_wings',
      materialTheme: 'obsidian_flame',
    });
    expect(player.styleLoadout.back).toBe('dragon_wings');
    expect(player.styleLoadout.materialTheme).toBe('obsidian_flame');
    player.dispose();
  });

  it('QuadrupedRigSpec & CreatureBuilder create 24-bone rigs, 6 clips, and creatures including Elder Wyvern', () => {
    const rig = createCanonicalQuadrupedRig(1.0);
    expect(rig.bones.length).toBe(24);
    const clips = buildQuadrupedAnimClips(rig);
    expect(clips.length).toBe(6);

    expect(Object.keys(QUADRUPED_CREATURE_SPECS).length).toBe(8);
    for (const id of ['grey_wolf', 'town_reindeer', 'elder_wyvern'] as const) {
      const q = buildQuadrupedCreature(id, { finishMode: 'classic_flat' });
      expect(q.clips.length).toBe(6);
      expect(q.meshes.length).toBeGreaterThan(4);
      q.dispose();
    }
  });

  it('MonsterBuilder builds new bipedal monsters and Giant Bosses (3.0m - 3.6m)', () => {
    const expectedIds = [
      'monster.skeleton_warrior',
      'monster.dark_cultist',
      'monster.gargoyle',
      'monster.crystal_golem',
      'boss.colossus_golem',
      'boss.minotaur_warlord',
      'boss.dread_knight',
    ] as const;
    for (const id of expectedIds) {
      expect(NWL_MONSTER_SPECS[id]).toBeDefined();
      const m = buildNwlMonster(id, { finishMode: 'classic_flat' });
      expect(m.root.children.length).toBeGreaterThan(0);
      m.dispose();
    }
  });

  it('PropBuilder & NwlTilesetDungeon build new props, multi-biome dungeons, and architectural structures', () => {
    for (const kind of ['well', 'market_stall', 'crystal_cluster', 'brazier'] as const) {
      const prop = buildProceduralProp({ kind, finishMode: 'classic_flat' });
      expect(prop.root.children.length).toBeGreaterThan(0);
      prop.dispose();
    }

    expect(Object.keys(DUNGEON_BIOME_THEMES).length).toBe(5);
    const crypt = buildDungeonByBiome('gothic_crypt', 101, { finishMode: 'classic_flat' });
    expect(crypt.rooms.length).toBeGreaterThan(2);
    crypt.dispose();

    const tower = buildArchitecturalStructure('watchtower', { finishMode: 'classic_flat' });
    expect(tower.root.children.length).toBeGreaterThan(0);
    tower.dispose();
  });
});
