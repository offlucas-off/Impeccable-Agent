import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  BUILTIN_LIGHTING_RAMPS,
  BUILTIN_PALETTES,
  BOOTS_STYLES,
  CHEST_STYLES,
  EQUIP_SLOTS,
  GLOVES_STYLES,
  HELMET_STYLES,
  ITEM_RARITIES,
  LEGS_STYLES,
  NWL_MONSTER_IDS,
  NWL_NPC_IDS,
  NWL_SPELL_VFX_CATALOG,
  PLAYER_CLASSES,
  PixelizerPipeline,
  RARITY_COLOR_TABLE,
  SHOULDER_STYLES,
  WEAPON_MAIN_STYLES,
  WEAPON_OFFHAND_STYLES,
  buildGreenRuinsFloor1,
  buildNwlMonster,
  buildNwlNpc,
  buildNwlPlayerCharacter,
  buildNwlSpellVfx,
  buildNwlStarterCity,
  buildNwlTilesetCatalog,
  createRandomStyleLoadout,
  listAllPlayerEquipmentCatalog,
} from '../src/engine';

describe('NWL Production Pipeline (Presets, Modular Gear, City, Bestiary, Dungeon & VFX)', () => {
  it('defines SNES Dark Fantasy NWL official palette and experimental Hades Ink preset', () => {
    const snesNwl = BUILTIN_PALETTES.find((p) => p.id === 'snes_pal_nwl')!;
    expect(snesNwl).toBeDefined();
    expect(snesNwl.colors.length).toBeGreaterThanOrEqual(16);
    expect(snesNwl.colors.map((c) => c.toLowerCase())).toContain('#e0a882');
    expect(snesNwl.colors.map((c) => c.toLowerCase())).toContain('#b87b56');

    const hadesPal = BUILTIN_PALETTES.find((p) => p.id === 'hades_ink')!;
    expect(hadesPal).toBeDefined();
    expect(hadesPal.colors.length).toBeGreaterThanOrEqual(14);

    const hadesRamp = BUILTIN_LIGHTING_RAMPS.find((r) => r.id === 'hades_graphic_ink')!;
    expect(hadesRamp).toBeDefined();
    expect(hadesRamp.stops[0].color.toLowerCase()).toBe('#2b2042');
    expect(BUILTIN_LIGHTING_RAMPS.some((r) => r.id === 'three_band')).toBe(true);
  });

  it('builds PlayerBaseShell (1.79m) with 3 classes, 6 slots × 5 rarities (90 items) and swaps armor on UAL bones', () => {
    const catalog = listAllPlayerEquipmentCatalog();
    expect(catalog.length).toBe(PLAYER_CLASSES.length * EQUIP_SLOTS.length * ITEM_RARITIES.length);
    expect(catalog.length).toBe(90);

    // Distinct rarity colors for all 5 tiers
    const primaryColors = new Set(ITEM_RARITIES.map((r) => RARITY_COLOR_TABLE[r].primary.toLowerCase()));
    expect(primaryColors.size).toBe(5);

    for (const cls of PLAYER_CLASSES) {
      const hero = buildNwlPlayerCharacter({ classId: cls, rarity: 'normal' });
      hero.root.updateMatrixWorld(true);
      const shellBox = new THREE.Box3();
      for (const m of hero.meshes) {
        if (!m.userData.equipSlot) shellBox.expandByObject(m);
      }
      const shellSize = new THREE.Vector3();
      shellBox.getSize(shellSize);
      expect(shellSize.y).toBeGreaterThan(1.68);
      expect(shellSize.y).toBeLessThan(1.90);

      const fullBox = new THREE.Box3().setFromObject(hero.root);
      const fullSize = new THREE.Vector3();
      fullBox.getSize(fullSize);
      expect(fullSize.y).toBeLessThan(2.30); // Wizard hat / upright staff clearance
      expect(hero.rig.bones.length).toBe(65);

      // Zero cloth physics capes
      let hasCape = false;
      hero.root.traverse((o) => {
        if (o.name.toLowerCase().includes('cape') || o.name.toLowerCase().includes('cloth')) {
          hasCape = true;
        }
      });
      expect(hasCape).toBe(false);

      // Live slot swap attaches new geometry cleanly onto bones and updates metadata
      const prevChestMeshes = hero.meshes.filter((m) => m.userData.equipSlot === 'chest');
      expect(prevChestMeshes.length).toBeGreaterThanOrEqual(1);
      const swappedDef = hero.equipSlot('chest', 'legendary');
      expect(swappedDef.rarity).toBe('legendary');
      const nextChestMeshes = hero.meshes.filter((m) => m.userData.equipSlot === 'chest');
      expect(nextChestMeshes.length).toBeGreaterThanOrEqual(1);
      expect(nextChestMeshes[0]).not.toBe(prevChestMeshes[0]);
      expect(
        nextChestMeshes.some((m) => ['spine_01', 'spine_02', 'spine_03'].includes(m.parent?.name ?? ''))
      ).toBe(true);

      hero.equipFullRaritySet('rare');
      for (const s of EQUIP_SLOTS) {
        expect(hero.loadout[s]).toBe('rare');
      }

      hero.setClass(cls === 'knight' ? 'mage' : 'knight');
      expect(hero.classId).toBe(cls === 'knight' ? 'mage' : 'knight');
      hero.dispose();
    }
  });

  it('builds Starter City with 9 NPCs (~1.70m), interactive npc.bau, and 6 enterable 3-part houses', () => {
    expect(NWL_NPC_IDS.length).toBe(10); // 9 humanoid NPCs + interactive npc.bau
    for (const id of NWL_NPC_IDS) {
      const npc = buildNwlNpc(id);
      npc.root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(npc.root);
      const size = new THREE.Vector3();
      box.getSize(size);
      if (id === 'npc.bau') {
        expect(npc.lidPivot).toBeDefined();
        npc.setChestOpen?.(true);
        expect(npc.lidPivot!.rotation.x).toBeLessThan(0);
      } else {
        expect(npc.rig?.bones.length).toBe(65);
        expect(size.y).toBeGreaterThan(1.52);
        expect(size.y).toBeLessThanOrEqual(2.10); // Allows pointed mage hat on top of 1.70m body
      }
    }

    const city = buildNwlStarterCity();
    expect(city.tileSizeM).toBe(1.5);
    expect(city.houses.length).toBe(6);
    expect(city.npcs.length).toBe(10);
    expect(city.colliders.length).toBeGreaterThanOrEqual(6);

    for (const house of city.houses) {
      expect(house.baseGroup).toBeDefined();
      expect(house.capaGroup.visible).toBe(true);
      expect(house.portaPivot).toBeDefined();

      house.setInteriorOpen(true);
      expect(house.capaGroup.visible).toBe(false);
      expect(Math.abs(house.portaPivot.rotation.y)).toBeGreaterThan(0.5);

      house.setInteriorOpen(false);
      expect(house.capaGroup.visible).toBe(true);
    }

    const portalResult = city.update(0.5, city.portalPos.clone());
    expect(portalResult.inPortal).toBe(true);
    city.dispose();
  });

  it('enforces Bestiary scale hierarchy across 5 enemies and Giant Boss Demon (~2.95m)', () => {
    expect(NWL_MONSTER_IDS.length).toBeGreaterThanOrEqual(15);
    const heights: Record<string, number> = {};

    for (const id of NWL_MONSTER_IDS) {
      const m = buildNwlMonster(id);
      m.root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(m.root);
      const size = new THREE.Vector3();
      box.getSize(size);
      heights[id] = size.y;
      expect(m.rig.bones.length).toBe(65);
      m.meshes.forEach((mesh) => mesh.geometry.dispose());
      m.materials.forEach((mat) => mat.dispose());
    }

    expect(heights['orcs.goblin_01']).toBeLessThan(1.65);
    expect(heights['orcs.orc_04']).toBeGreaterThan(heights['orcs.goblin_01'] + 0.45);
    expect(heights['demons.boss_demon']).toBeGreaterThanOrEqual(2.75);
    expect(heights['demons.boss_demon']).toBeGreaterThan(heights['orcs.orc_04'] + 0.55);
  });

  it('builds 1.5m Tileset catalog and connected Green Ruins Floor 1 Dungeon with BFS-reachable Boss room', () => {
    const catalog = buildNwlTilesetCatalog('green_ruins');
    expect(catalog.tileSizeM).toBe(1.5);
    expect(catalog.pieceCount).toBeGreaterThanOrEqual(15);
    catalog.dispose();

    const dung = buildGreenRuinsFloor1(101);
    expect(dung.tileSizeM).toBe(1.5);
    expect(dung.rooms.length).toBeGreaterThanOrEqual(5);
    expect(dung.destructibles.length).toBeGreaterThanOrEqual(4);
    expect(dung.traps.length).toBeGreaterThanOrEqual(2);

    // Every Green Ruins Floor 1 enemy + boss demon spawned in Floor 1
    const floor1Ids = [
      'orcs.goblin_01',
      'orcs.goblin_03',
      'orcs.goblin_06',
      'orcs.goblin_02',
      'orcs.orc_04',
      'demons.boss_demon',
    ] as const;
    const spawnedIds = new Set(dung.enemySpawns.map((s) => s.id));
    for (const reqId of floor1Ids) {
      expect(spawnedIds.has(reqId)).toBe(true);
    }

    // Verify walkable path via BFS from playerSpawnPos to exitStairsPos
    const toCell = (pos: THREE.Vector3): [number, number] => {
      const halfC = dung.cols / 2;
      const halfR = dung.rows / 2;
      return [
        Math.floor(pos.x / dung.tileSizeM + halfC),
        Math.floor(pos.z / dung.tileSizeM + halfR),
      ];
    };

    const [startC, startR] = toCell(dung.playerSpawnPos);
    const [goalC, goalR] = toCell(dung.exitStairsPos);
    expect(dung.walkableGrid[startR]?.[startC]).toBe(true);
    expect(dung.walkableGrid[goalR]?.[goalC]).toBe(true);

    const visited = new Set<string>();
    const queue: [number, number][] = [[startC, startR]];
    visited.add(`${startC},${startR}`);
    let reachedBossExit = false;

    while (queue.length > 0) {
      const [c, r] = queue.shift()!;
      if (c === goalC && r === goalR) {
        reachedBossExit = true;
        break;
      }
      for (const [dc, dr] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nc = c + dc;
        const nr = r + dr;
        const key = `${nc},${nr}`;
        if (!visited.has(key) && dung.walkableGrid[nr]?.[nc]) {
          visited.add(key);
          queue.push([nc, nr]);
        }
      }
    }
    expect(reachedBossExit).toBe(true);
    dung.dispose();
  });

  it('builds 20 low-poly 3D pixelated Spell & Combat VFX items within projectile triangle budget', () => {
    expect(NWL_SPELL_VFX_CATALOG.length).toBe(20);
    for (const entry of NWL_SPELL_VFX_CATALOG) {
      const vfx = buildNwlSpellVfx(entry.id);
      expect(vfx.triangleCount).toBeGreaterThan(0);
      if (entry.category === 'projectile') {
        expect(vfx.triangleCount).toBeLessThanOrEqual(200);
      }
      vfx.updatePhase(0.5);
      vfx.dispose();
    }
  });

  it('defaults to Form-First stylized_crisp ramp/pipeline and supports modular EquipmentStyleLoadout mix-and-match', () => {
    const crispRamp = BUILTIN_LIGHTING_RAMPS.find((r) => r.id === 'crisp_stylized');
    expect(crispRamp).toBeDefined();
    expect(PixelizerPipeline).toBeDefined();

    // Verify all style catalogs can be mounted and swapped live without errors
    const hero = buildNwlPlayerCharacter({
      classId: 'knight',
      rarity: 'epic',
      styleLoadout: {
        helmet: 'winged_helm',
        chest: 'royal_tabard',
        shoulders: 'heavy_pauldrons',
        legs: 'battle_kilt',
        boots: 'steel_sabatons',
        gloves: 'heavy_gauntlets',
        weaponMain: 'battleaxe',
        weaponOffhand: 'tower_shield',
      },
    });

    expect(hero.styleLoadout.helmet).toBe('winged_helm');
    expect(hero.styleLoadout.weaponMain).toBe('battleaxe');
    expect(hero.styleLoadout.weaponOffhand).toBe('tower_shield');
    expect(hero.meshes.length).toBeGreaterThan(10);

    // Swap individual style slots
    hero.equipStyleSlot('helmet', 'wizard_hat');
    expect(hero.styleLoadout.helmet).toBe('wizard_hat');
    hero.equipStyleSlot('weaponMain', 'crossbow');
    expect(hero.styleLoadout.weaponMain).toBe('crossbow');

    // Exercise every main weapon and offhand style
    for (const w of WEAPON_MAIN_STYLES) {
      hero.equipStyleSlot('weaponMain', w.id);
      expect(hero.styleLoadout.weaponMain).toBe(w.id);
    }
    for (const off of WEAPON_OFFHAND_STYLES) {
      hero.equipStyleSlot('weaponOffhand', off.id);
      expect(hero.styleLoadout.weaponOffhand).toBe(off.id);
    }
    for (const h of HELMET_STYLES) {
      hero.equipStyleSlot('helmet', h.id);
      expect(hero.styleLoadout.helmet).toBe(h.id);
    }
    for (const c of CHEST_STYLES) {
      hero.equipStyleSlot('chest', c.id);
      expect(hero.styleLoadout.chest).toBe(c.id);
    }
    for (const sh of SHOULDER_STYLES) {
      hero.equipStyleSlot('shoulders', sh.id);
      expect(hero.styleLoadout.shoulders).toBe(sh.id);
    }
    for (const l of LEGS_STYLES) {
      hero.equipStyleSlot('legs', l.id);
      expect(hero.styleLoadout.legs).toBe(l.id);
    }
    for (const b of BOOTS_STYLES) {
      hero.equipStyleSlot('boots', b.id);
      expect(hero.styleLoadout.boots).toBe(b.id);
    }
    for (const g of GLOVES_STYLES) {
      hero.equipStyleSlot('gloves', g.id);
      expect(hero.styleLoadout.gloves).toBe(g.id);
    }

    const rnd = createRandomStyleLoadout(() => 0.42);
    hero.setStyleLoadout(rnd, 'legendary');
    expect(hero.loadout.weapon).toBe('legendary');
    hero.dispose();
  });
});
