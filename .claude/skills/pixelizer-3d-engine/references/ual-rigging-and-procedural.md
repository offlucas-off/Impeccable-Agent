# 65-Bone UAL Rigging & Procedural Content Generation

Reference for extending rigged characters, modular equipment, NPCs, enterable structures, monsters, `1.5 m` tilesets, dungeons, and 3D spell VFX.

---

## 1. Canonical 65-Bone UAL Rig (`src/engine/rigging/`)

- `UalRigSpec.ts` loads `src/data/ualSkeletonSpec.json` (65 bones: 17 structural + 48 fingers) and provides:
  - `createCanonicalUalRig(profile: 'male' | 'female', scale?: number)`
  - Bone names: `pelvis`, `spine_01`, `spine_02`, `spine_03`, `neck_01`, `Head`, `clavicle_l/r`, `upperarm_l/r`, `lowerarm_l/r`, `hand_l/r`, `thigh_l/r`, `calf_l/r`, `foot_l/r`, `ball_l/r`.
  - Sockets: `hand_r`, `hand_l`, `head`, `back`.
- `AnimationLibraryBank.ts` loads `./animations/ual_master_library.glb` (85 Quaternius clips):
  - `await bank.ensureLoaded()` once; then `bank.getClip(name)` returns `THREE.AnimationClip | null`.
  - Use `UalRetargeter.retargetUalClipsToModel(root, clips)` when importing non-UAL Mixamo/KayKit/Blender rigs.

### Limb & Attachment Coordinate Rules

1. **Bone Local `+Y` Convention**: `makeBoneSegmentBox(length, ...)` starts at `y = 0` (the joint pivot) and extends to `y = length`.
2. **Shoulder Pauldrons / Spikes**: Arms hang downward in rest pose, meaning `+Y` points toward the elbow while `y ≈ 0` is at the shoulder socket and slight negative `y` points upward/outward in world space. Keep pauldrons/ridges centered at `y ≈ -0.02..+0.03` on `upperarm_l/r` so armor stays seated on the shoulder!
3. **Vertex Colors Required**: When merging parts via `prepareColoredPart` + `mergeColoredParts`, always set `mat.vertexColors = true` on `PixelizerMaterial`.

---

## 2. Adding Player Classes, Slots, or Rarities (`PlayerEquipmentBuilder.ts`)

`PlayerBaseShell` (`1.79 m` standardized inner body) exposes:
- `PLAYER_CLASSES`: `'knight' | 'archer' | 'mage'`
- `EQUIP_SLOTS`: `'helmet' | 'chest' | 'legs' | 'boots' | 'gloves' | 'weapon'`
- `ITEM_RARITIES`: `'normal' | 'common' | 'rare' | 'epic' | 'legendary'`
- `RARITY_COLOR_TABLE`: maps each rarity to distinct SNES palette hexes (`primary`, `secondary`, `trim`, `glow`).

To add a new equipment piece or class:
1. Add class ID to `PlayerClassId` & `PLAYER_CLASSES` (and label/spells in `generatorPanel.ts` & `NwlPlaySandbox.ts`).
2. Add geometry builders in `buildSlotAttachments(rig, classId, slot, rarity)` returning `RigidPartSpec[]` attached directly to UAL bones (`Head`, `spine_02`, `pelvis`/`thigh_l/r`, `calf_l/r`/`foot_l/r`, `lowerarm_l/r`/`hand_l/r`, `hand_r`/`hand_l`).
3. Ensure `mountSlot` sets `mesh.userData.equipSlot = slot`, `mesh.userData.equipRarity = rarity`, `mat.vertexColors = true`, and `gridReference: rig.armature`.
4. Maintain zero cloth simulation capes so silhouettes match clean modular swapping.

---

## 3. Adding NPCs & Enterable 3-Part Houses (`NpcBuilder.ts`, `CityBuilder.ts`)

- **NPCs (`buildNwlNpc`)**: Extend `NwlNpcId` and `NWL_NPC_PROFILES`. Humanoid NPCs target `~1.70 m` (`scale = 1.70 / 1.79`) with a distinct silhouette prop (`hammer`, `tome`, `halberd`, etc.) and headgear. `npc.bau` uses a hinged `lidPivot` animated via `setChestOpen(open)`.
- **3-Part Enterable Houses (`CityBuilder.ts`)**:
  - `baseGroup`: floor, interior props (anvil, counter, bookshelves, chests), lower doorway walls.
  - `capaGroup`: upper walls + colored gable/hip roof (`setInteriorOpen(true)` hides `capaGroup.visible = false` when the hero approaches/enters!).
  - `portaPivot`: hinged door swinging smoothly on `E` interaction or proximity.
  - Keep accurate `worldFootprintMin/Max` and `colliders` so the Sandbox player collides cleanly with walls outside the doorway.

---

## 4. Adding Bestiary Enemies & Bosses (`MonsterBuilder.ts`)

Extend `NwlMonsterId` and `NWL_MONSTER_SPECS`:
- Scale strictly enforces RPG readability (`targetHeightM`: e.g. `1.35 m` goblin -> `2.10 m` orc brute -> `2.95 m` boss demon).
- Build custom proportional bone spacing via `makeMonsterScaleRig(...)` + `attachRigidPartsToUalRig(...)`.
- Overlap connected details (horns, crowns, tusks, shoulder pauldrons, weapons) so no multi-segment mesh floats detached in orthographic view.

---

## 5. Adding Biome Tilesets & Procedural Dungeons (`NwlTilesetDungeon.ts`)

- Official grid size: **`NWL_TILE_M = 1.5`**, wall height **`NWL_WALL_H = 3.0`**.
- `buildNwlTilesetCatalog(biome)` showcases modular floor, wall, pillar, arch, trap, crate, altar, chest, and stairs pieces.
- `buildGreenRuinsFloor1(seed)`:
  1. Carves connected rooms (`entrance`, `corridor`, `combat`, `treasure`, `boss`) using `createSeededRng(seed)`.
  2. Guarantees a continuous `walkableGrid` path from `playerSpawnPos` to `exitStairsPos` (verify via BFS in tests!).
  3. Populates `colliders`, `destructibles`, `traps`, `enemySpawns`, `chestPos`, `altarPos`.

---

## 6. Adding 3D Pixelated Spell VFX (`SpellVfxBuilder.ts`)

- Add entries to `NwlSpellVfxId` and `NWL_SPELL_VFX_CATALOG`.
- Construct crisp geometric meshes (`Tetrahedron`, `Octahedron`, `Box`, `Cylinder`, `Cone`, `Torus` <= 6 radial segments) colored via `prepareColoredPart` and shaded by `PixelizerMaterial` (`pixelated: true, objectId, mat.vertexColors = true`).
- **Strict Rules**:
  - **Zero soft glow/blur sprites**: All magic effects are pixel-snapped faceted 3D geometry.
  - Keep projectile triangle counts **`<= 200` triangles** (checked by `nwl_production.test.ts`).
  - Implement `updatePhase(progress01)` to animate expansion, spin, fade/drop, or ring ripple without allocations per frame.
