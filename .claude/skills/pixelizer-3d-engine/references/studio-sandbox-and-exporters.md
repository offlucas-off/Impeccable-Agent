# Studio UI, Play Sandbox, Exporters & Testing Cookbook

Reference for wiring new Studio controls/presets, extending the browser Play Sandbox, running exporters, and testing automatically.

---

## 1. Studio Wiring & Camera Framing (`src/studio/ui/studioApp.ts`)

- **`applyStage(..., preservePlayer)`**: Replaces the active stage scene, registers materials (`allSceneMaterials`), updates object inspector (`syncObjectInspector`), mounts animation mixer/clips onto `AnimationLibraryBank`, and preserves `activePlayerInstance` when live slot swaps occur.
- **`applyStageCameraFraming(box, isLargeStructure)`**:
  - Single heroes/props (`1 m - 3 m`): Tight isometric 2:1 frame (`orthoHeight ~ 4.8..6.2`).
  - Large dioramas (`Starter City`, `Dungeon Floor 1`): Expands `orthoHeight` up to `28.0`, pulls camera distance to `~32`, and widens directional shadow frustum to `±22` so city edges and tall roofs aren't clipped.
- **Generator Tab (`src/studio/ui/generatorPanel.ts`)**: Wire generator callbacks through `GeneratorHostContext` (`mountNwlPlayer`, `mountNwlNpc`, `mountNwlMonster`, `mountNwlCustomScene`, `mountNwlSpellVfx`, `getCurrentPlayerInstance`).

---

## 2. Exporters (`Voxelizer.ts`, `SpriteSheetExporter.ts`, `RiggedExporter.ts`)

### A. 3D Voxelizer (`src/engine/Voxelizer.ts`)
- `voxelizeObject3D(root, { resolution, palette, dither3d, fillSolidInterior, preserveWorldScale })`:
  Evaluates world positions of `Mesh`, `SkinnedMesh` (via `boneTransform`), and morph targets, builds culled watertight voxel faces, and returns `VoxelGridResult`.
- Export bytes: `await exportVoxelGridToGlb(grid)`, `exportVoxelGridToObj(grid)`, `exportVoxelGridToVox(grid)` (MagicaVoxel `Y-up -> Z-up`).

### B. Sprite Sheet Exporter (`src/engine/SpriteSheetExporter.ts`)
- `exportNwlCharacterSpriteSheet(pipeline, scene, camera, targetObject, animController, opts)`:
  - Enforces **8 real non-mirrored isometric directions** (`0°..315°` in `45°` steps; never flips horizontally).
  - Calibrated for **`1 m = 60 px` -> `108 px`** character height inside `259×259` zero-clipping frames (`boxPx`), forcing crisp `pixelSize: 1` during capture and restoring material options in `finally`.
  - Applies hard alpha threshold (`>= 128` -> `255` else `0`) and counts `clippedFrames` touching frame boundaries (must remain `0`).

### C. Rigged `.GLB` Exporter (`src/engine/rigging/RiggedExporter.ts`)
- `validateAndNormalizeRiggedHierarchy(root)` checks/fixes `skinWeight` sums `=== 1.0`.
- `exportRiggedCharacterGlb(root, clips, options)` clamps `metalness <= 0.35` so external engines without HDR EnvMaps (Godot/Unity/Three) don't turn dark silhouettes.

---

## 3. Extending Browser Play Sandbox (`src/sandbox/NwlPlaySandbox.ts`)

`createNwlPlaySandbox(stageContainer, pipeline, callbacks)` creates a self-contained real-time ARPG loop:
- **Controls**: `WASD` movement with collider clamping (`city.colliders` / `dungeon.walkableGrid`), `Space` melee/shot attack, `Shift` dodge roll, `1-4` class skills (`CLASS_SPELLS`), `E` context interact (enter/exit portal, pick up dropped loot, toggle houses/chest).
- **Live Modular Loot**: `dropRandomLoot()` spawns floating rarity-colored item orbs; picking up swaps the exact slot on `hero.equipSlot(slot, rarity)` live in 3D.
- **Enemy AI**: State machine (`idle` -> `chase` -> `windup` with 3D telegraph -> `cooldown` attack/projectile).
- **Clean Disposal**: Always clear `projectiles`, `transientVfxs`, `lootDrops`, `city`/`dungeon`, DOM HUD overlay, and window `keydown`/`keyup` listeners in `dispose()`.

---

## 4. Automated Test & Visual Verification Recipes

### Unit Tests (`tests/nwl_production.test.ts`, `tests/rigging_procedural.test.ts`, `tests/engine.test.ts`)
- Keep all Vitest files strictly compatible with `tsconfig.json` (no Node built-ins unless explicitly ambient-typed; use pure TypeScript + Three.js).
- Run: `npm run typecheck && npm test && npm run build`.

### Headless Chromium WebGL2 Visual Check (Playwright + SwiftShader)
```js
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium', // or default playwright binary
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
```
Assert `console` errors `=== 0` and `pageerror` count `=== 0` across presets, class/rarity swaps, `Play Sandbox`, `hades_lab`, and `Export NWL 8-Dir Sheet`.
