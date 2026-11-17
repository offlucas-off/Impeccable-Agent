# Studio UI, Play Sandbox, Exporters & Quality Gate

Reference for wiring Studio UI panels, Finish Mode toggles, Play Sandbox, Voxelizer/GLB/Sprite exporters, and running automated Quality Gate + visual verification.

---

## 1. Studio Wiring, Finish Controls & Camera Framing (`studioApp.ts` & `generatorPanel.ts`)

- **Object Inspector Texture Badges (`studioApp.ts`)**: `#tex-albedo-name`, `#tex-normal-name`, `#tex-emit-name` report `Albedo: W×H`, `Normal: W×H`, `Emission: W×H` when procedural maps are attached (or `None` in `classic_flat`).
- **Generate Tab Finish Panel (`generatorPanel.ts`)**:
  - `#gen-finish-mode`: `'textured_ao'` (default) or `'classic_flat'` (legacy vertex colors). Toggling triggers `onFinishOptionsChanged` which cleanly rebuilds the current Hero, Prop, City, Dungeon, or active Play Sandbox zone with updated maps/metrics!
  - `#gen-mat-seed`, `#gen-ao-str` (`0..1`), `#gen-norm-str` (`0..1`).
  - `#gen-quality-stats`: Live summary showing `Atlas W×H @ P px/m · N ilhas · Overlap 0 · H=... · MinAO=...` (or flat triangle count when `classic_flat`).
- **`applyStageCameraFraming(box, isLargeStructure)`**: Frames `1m–3m` subjects tightly (`orthoHeight ~ 4.8..6.2`) and expands up to `orthoHeight = 28.0` / shadow frustum `±22` for Starter City & Dungeon Floor 1.
- **`disposeGroupResources(root)`**: Safely disposes geometries, materials, and unpooled textures while skipping textures marked `userData.pooled === true` so shared tileset atlases stay valid across scene switches.

---

## 2. Exporters (`Voxelizer.ts`, `SpriteSheetExporter.ts`, `RiggedExporter.ts`)

### A. Textured 3D Voxelizer (`src/engine/Voxelizer.ts`)
- `voxelizeObject3D(root, ...)` and `voxelizeObject3DRigged(...)` build a `TextureSampler` directly from procedural `DataTexture` `albedoMap` (`flipY === false` respected!) as well as browser HTML image canvases, multiplying texel RGB with vertex colors and `baseColor` before quantizing cleanly to active palette + optional 3D checker dither.
- Exports bytes: `await exportVoxelGridToGlb(grid)`, `exportVoxelGridToObj(grid)`, `exportVoxelGridToVox(grid)`.

### B. NWL 8-Dir Isometric Sprite Sheet (`src/engine/SpriteSheetExporter.ts`)
- Enforces **8 real non-mirrored isometric directions** (`0°..315°`), `1 m = 60 px` -> `108 px` height inside `259×259` zero-clipping frames (`pixelSize: 1` forced during capture and restored in `finally`), binary alpha (`>= 128`), and `clippedFrames === 0`.

### C. Textured Rigged `.GLB` Exporter (`src/engine/rigging/RiggedExporter.ts`)
- `convertToExportStandardMaterial` preserves `map: o.albedoMap`, `normalMap: o.normalMap`, and `emissiveMap: o.emissionMap` when exporting rigged heroes/NPCs/monsters or structures (`#gen-btn-struct-glb`) while clamping `metalness <= 0.35` so external viewers (Blender/Godot/Unity/Three) render bright, faithful PBR sprites.

---

## 3. Browser Play Sandbox (`src/sandbox/NwlPlaySandbox.ts`)

`createNwlPlaySandbox(stageContainer, pipeline, callbacks)` creates the real-time ARPG loop (City -> Portal -> Randomized Dungeon Floor 1 -> Live Loot Drop slot equipping):
- Accepts optional `finishOptions?: { finishMode, seed, aoStrength, normalStrength }` passed forward into the Sandbox Hero, City, and Dungeon builders.
- Controls: `WASD` move, `Space` attack, `Shift` dodge, `1-4` class skills, `E` interact (enter portal, pick up rarity gear, open/close house doors & `npc.bau`). Exit cleanly via `#sb-btn-exit` or `#btn-play-sandbox`.

---

## 4. Automated Test & Quality Gate Recipes

### Vitest Headless Node Environment (`vitest.config.ts` + `tests/vitest.setup.ts`)
- Exporting `.GLB` files with embedded PNG textures (`albedoMap`, `normalMap`) causes Three.js `GLTFLoader.parseAsync` to access `self.URL` and `createImageBitmap`.
- [`vitest.config.ts`](../../vitest.config.ts) mounts [`tests/vitest.setup.ts`](../../tests/vitest.setup.ts), which polyfills `globalThis.self` and provides a PNG-IHDR-aware `createImageBitmap` shim in test runtime without adding any Node globals to `src/` or `tsconfig` errors.

### Quality Gate (`tests/qualityGate.test.ts`)
Verifies all Phase 5 & 6 contracts deterministically:
1. **UV Integrity**: `nonFiniteTriangles === 0`, `collapsedTriangles === 0`, `outOfTileTriangles === 0`, `overlapPairs === 0`, `uvDensityOutliers <= 15%`, `tangent` (`vec4`) present.
2. **Silhouette / Primitives**: `detectFlatDetailCuboids(root).length === 0`.
3. **2D Atlas Material Richness (`measureTextureQuality`)**: `texWidth >= 64`, `meanEntropy >= 1.8`, `flatFacesPercent <= 10`, `meanEdgeChangePercent >= 12` (excluding `< 12 px²` corner micro-caps when larger islands exist).
4. **Builders Covered**: Props (`chest`, `barrel`, `sword`, `tree`), Player (`knight:legendary`), NPCs (`ferreiro`, `bau`), Monsters (`boss_demon`), UAL Characters, Starter City, Green Ruins Floor 1, and WFC Medieval Structure.
5. **Textured Voxelizer Diversity**: `>= 5` distinct vertex RGB clusters from textured props.
6. **Textured `.GLB` Round-Trip**: Valid GLTF `JSON` `textures` / `images` chunks and clean `GLTFLoader.parseAsync` reload (`meshCount >= 1`).
7. **Classic Flat Fallback**: `finishMode: 'classic_flat'` produces zero textures (`texWidth === 0`) and vertex-colored geometry.

### Commands & Visual Check
```bash
grep -rn "node:" src/
npm run typecheck && npm test && npm run build
```
Visual capture with Playwright + `/usr/bin/chromium` (`--use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`) must verify `0` console/page errors and inspect PNGs across `nwl_knight`, `nwl_archer`, `nwl_mage`, `nwl_bestiary`, `nwl_starter_city`, `nwl_dungeon_floor1`, textured props, A/B Split Compare, Pass 3 `edges` view, `hades_lab` 1×1, `Voxel 3D`, `classic_flat`, and `Play Sandbox`.
