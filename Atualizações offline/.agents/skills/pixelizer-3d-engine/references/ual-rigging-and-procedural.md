# 65-Bone UAL Rigging, Sculpted Geometry, Auto-UV & Procedural Generation

Reference for extending sculpted procedural assets, texel-locked auto-UV unwrapping, procedural pixel textures, Vertex/Texel AO baking, modular gear, NPCs, enterable cities, monsters, `1.5 m` tilesets, dungeons, and 3D spell VFX.

---

## 1. Advanced Procedural Modeling, Auto-UV & Texture Pipeline (Phases 0–4)

Every major procedural builder routes through the 4-stage pipeline and honors `FinishMode = 'textured_ao' | 'classic_flat'`:

### Stage A: Sculpted Watertight Primitives (`src/engine/procedural/ProceduralGeometryKit.ts`)
Eliminate boxy flat cuboids (`detectFlatDetailCuboids` enforces zero `1x1` flat detail boxes >= 2% triangles):
- **`makeBeveledBox(w, h, d, bevel, segs?)`**: Chamfered plates/beams with clean bevel catchlights.
- **`makeBeveledBoneSegmentBox(len, w, d, bevel?)`**: Limb-aligned beveled armor/limb segments (`y = 0 .. len`).
- **`makeLatheProfile(points, radialSegs?)`**: Turned pottery, potion flasks, crowns, staff orbs, fountain basins, and wooden barrels.
- **`makeCurvedHornGeometry(...)` & `makePauldronShellGeometry(...)`**: Curved Boss/monster horns anchored safely inside skull sockets and cupped shoulder pauldrons.
- **`makeSwordBladeGeometry(...)`, `makeAxeHeadGeometry(...)`, `makeDomeShieldGeometry(...)`, `makeRecurveBowGeometry(...)`**: Tapered multi-plane blades, crescent axes, bossed shields, and curved bow limbs.
- **`makePitchedRoofGeometry(...)`**: True overhanging gable/hip roofs with ridge caps (`CityBuilder`).
- **`makeSdfOrganicMesh(...)` + `sdSphere`, `sdEllipsoid`, `sdCapsule`, `sdRoundedBox`, `sminPoly`, `sdfHashNoise3D`**: Organic marching/isosurface creature torsos, boulders, tree canopies, and rock formations.
- Tag parts with `tagPart(geo, partTag, materialKind, baseHex, { accentHex, projection, lockVertical, landmarkKind, islandScaleBias })`.

### Stage B: Pixel-Aligned Auto-UV (`src/engine/procedural/PixelUvUnwrapper.ts`)
- `unwrapPixelAligned(parts, options)` extracts planar `box6` / `cylindrical_y` / `planar` charts (respecting `lockVertical` so brick/planks stay upright) and packs integer texel rectangles at calibrated `texelsPerMeter` (`32` for props/architecture, `64` for `1.79m` heroes/weapons/monsters) with zero island overlap (`paddingPx: 3`).
- Always keeps `vertexColorMode: 'white_for_ao'` (default) so `vertexColors` only carries grayscale AO weighting while `albedoMap` carries the full color pigment.
- Run `inspectGeometryUvs(...)` and `detectFlatDetailCuboids(...)` to catch collapsed UVs, out-of-tile coords, density outliers, or un-beveled detail cuboids.

### Stage C: Procedural Pixel-Art Texture Synthesis (`src/engine/procedural/PixelMaterialSynth.ts`)
- 20 curated `MaterialRecipeId` generators (`stone_masonry`, `mossy_cobble`, `wood_planks`, `timber_frame`, `plaster_wall`, `roof_shingle`, `forged_steel`, `brushed_gold`, `rarity_armor`, `stitched_leather`, `woven_cloth`, `human_skin`, `goblin_skin`, `orc_hide`, `demon_hide`, `runic_glow`, `magma_obsidian`, `bone_ivory`, `foliage_leaf`, `water_pool`) plus semantic landmarks (`head_front` crisp eyes/brows/mouth, `chest_crest`, `shield_face`, `door_front` iron straps/brass ring, `rune_panel`).
- Tiles/bricks/shingles use `>= 5-8 px` coarse macro-clusters so `3×3` point sampling in `Attempt #3` never spatial-aliases into confetti.
- Heightfield Sobel gradients generate subtle normal maps (`<= 0.24` slope) dilated smoothly across gutters via 2-pass Felzenszwalb EDT (`dilateAtlasByEdt`).
- Shared dungeon/city sheets use `synthesizeModularTilesetSheet` / `synthesizeStructureBiomeSheet` + `mapGeometryToSheetSlot` + `acquirePooledMaterialTextures` (LRU pool capped at `96` bundles; cleared safely via `clearPooledMaterialTextures()`).
- **One-call Unified Baker**: Use `bakeTaggedPartsAsset(parts, options)` + `createPixelizerMaterialFromBaked(baked, overrides, sharedResources)`. Supports instant toggle `finishMode: 'classic_flat'`.

### Stage D: Anti-Fangs Vertex AO & Texel GTAO (`src/engine/procedural/VertexAndTexelBaker.ts`)
- `subdivideForAo(geo, maxEdgeM)` performs T-junction-free 1-to-4 midpoint splits cleanly on non-skinned props/architecture (skip on `SkinnedMesh` by passing `partTagToBoneIndex`).
- `bakeVertexAoAndCreases(geo, opts)` traces multi-ray hemisphere occlusion against a pure-TS median-split `TriBvh` and clamps shadows cleanly to prevent jagged "dark fang" triangle artifacts.
- `applyHeightGtaoAndWear(...)` adds 8-directional island-clamped horizon GTAO, discrete Laplacian bevel catchlights, vertical grime (`lockVertical` bottom weighting), and clean `8`-step quantization (`[12..244]`) on non-landmark surfaces.

---

## 2. Canonical 65-Bone UAL Rig (`src/engine/rigging/`)

- `UalRigSpec.ts` loads `src/data/ualSkeletonSpec.json` (65 bones: 17 structural + 48 fingers) and provides `createCanonicalUalRig(profile, scale)`.
- `AnimationLibraryBank.ts` loads `./animations/ual_master_library.glb` (`getClip(name)` returns `THREE.AnimationClip | null`).
- **Bone Local `+Y` Convention**: `makeBeveledBoneSegmentBox(length, ...)` starts at `y = 0` and extends to `y = length`. Shoulder pauldrons/ridges anchor near `y ≈ -0.02..+0.03` on `upperarm_l/r`.
- **Single-atlas Skinned Binding**: Pass `partTagToBoneIndex` into `bakeTaggedPartsAsset` to receive aligned `perVertexBoneIndices` for merged `SkinnedMesh` binding without corrupting skin weights.

---

## 3. Extending Builders (`Player`, `NPC`, `City`, `Monster`, `Tilesets`, `Spells`)

All builders accept `{ finishMode?: FinishMode, materialSeed?: number, aoStrength?: number, normalStrength?: number }`:
- **Player Equipment (`PlayerEquipmentBuilder.ts`)**: `PlayerBaseShell` (`1.79 m`), `'knight' | 'archer' | 'mage'` × 6 slots × 5 rarities (`90` textured items). Swapping slots via `hero.equipSlot(slot, rarity)` preserves pooled/fresh `albedoMap`/`normalMap`/`emissionMap` and updates `hero.root.userData.unwrapMetrics`. Zero cloth capes.
- **NPCs (`NpcBuilder.ts`)**: 9 NPCs (`~1.70 m`) with landmark faces + hinged animated `npc.bau`.
- **Starter City (`CityBuilder.ts`)**: `NWL_Cidade_Principal_Portais` with 6 enterable 3-part houses, `InstancedMesh` lamp posts (`buildInstancedPropBatch` in [`InstancedBatchKit.ts`](../../../src/engine/procedural/InstancedBatchKit.ts)), Fountain, Portal `PointLight`/`SpotLight`, and Forge `PointLight`.
- **Bestiary (`MonsterBuilder.ts`)**: `1.35 m` Goblins -> `2.10 m` Orc Brute -> `2.95 m` Boss Demon (`userData.nwlIsBoss = true`, `outlineWidthSteps: 2`, `#fa6a0a` Cel Rim Light, `makeSdfOrganicMesh` torso + `makeCurvedHornGeometry`).
- **1.5 m Tilesets & Dungeon Floor 1 (`NwlTilesetDungeon.ts`)**: `NWL_TILE_M = 1.5`, `NWL_WALL_H = 3.0`, shared textured `256×256` atlas sheet, `InstancedMesh` batches (`Ruins_Torches_Instanced`, `Ruins_Trees_Instanced`), animated `PointLight`s at Portal/Altar/Boss, and BFS-verified walkable grid to Boss room.
- **3D Spell VFX (`SpellVfxBuilder.ts`)**: Keep `<= 200` triangles per projectile, faceted pixel-snapped solids, zero soft radial glow sprites.
