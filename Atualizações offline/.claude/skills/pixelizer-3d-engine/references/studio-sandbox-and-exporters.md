# Studio UI, Play Sandbox, Exporters & Quality Gate

Reference for wiring Studio UI panels, Finish Mode toggles, Play Sandbox, Voxelizer/GLB/Sprite exporters, and running automated Quality Gate + visual verification.

---

## 1. Modular Studio Architecture, Inspector Previews & Framing (`src/studio/`)

- **Modular Panels**:
  - [`studioContext.ts`](../../../src/studio/state/studioContext.ts): `StudioContext`, `disposeGroupResources` (preserves `userData.pooled === true`), and `createEventRegistry()`.
  - [`pipelinePanel.ts`](../../../src/studio/ui/pipelinePanel.ts): Pipeline resolution/dither/shadow + global `#sel-global-outline-steps`, `#sel-global-dither-space`, `#rng-global-rim`.
  - [`objectInspectorPanel.ts`](../../../src/studio/ui/objectInspectorPanel.ts): `#obj-mesh-stats` (tris/verts/instanced), Rim Light & 2px outline controls, and live pixelated `<canvas>` previews (`#tex-albedo-preview`, `#tex-normal-preview`, `#tex-emit-preview`).
  - [`exportPanel.ts`](../../../src/studio/ui/exportPanel.ts): Snapshot, NWL 8-dir sheets, Voxel 3D, plus `#btn-export-asset-glb` with `#chk-export-quantize-glb` & `#chk-export-quantize-dither`.
  - [`stageManager.ts`](../../../src/studio/ui/stageManager.ts): Presets (including `nwl_boss_demon`, `nwl_chest`), `applyStageCameraFraming`, UAL clip binding, and Play Sandbox transitions.
  - [`studioApp.ts`](../../../src/studio/ui/studioApp.ts): Viewport orchestrator, live `#hud-perf` (`calls · tris · ms`), and pure-browser `window.__PIXELIZER_STUDIO__` bridge.

---

## 2. Exporters (`Voxelizer.ts`, `SpriteSheetExporter.ts`, `RiggedExporter.ts`) & Headless CLI

### A. Textured 3D Voxelizer (`src/engine/Voxelizer.ts`)
- `voxelizeObject3D(root, ...)` and `voxelizeObject3DRigged(...)` build a `TextureSampler` directly from procedural `DataTexture` `albedoMap` (`flipY === false` respected!) as well as browser HTML image canvases, multiplying texel RGB with vertex colors and `baseColor` before quantizing cleanly to active palette + optional 3D checker dither.
- Exports bytes: `await exportVoxelGridToGlb(grid)`, `exportVoxelGridToObj(grid)`, `exportVoxelGridToVox(grid)`.

### B. NWL 8-Dir Isometric Sprite Sheet (`src/engine/SpriteSheetExporter.ts`)
- Enforces **8 real non-mirrored isometric directions** (`0°..315°`), `1 m = 60 px` -> `108 px` height inside `259×259` zero-clipping frames (`pixelSize: 1` forced during capture and restored in `finally`), binary alpha (`>= 128`), and `clippedFrames === 0`.

### C. Textured & Palette-Quantized `.GLB` Exporter (`src/engine/rigging/RiggedExporter.ts`)
- Safely detaches/restores circular `userData.pixelizer` pointers during `SkeletonUtils.clone()`, clamps `metalness <= 0.35`, and embeds `albedoMap`, `normalMap`, and `emissionMap`.
- Opt-in **`quantizeAlbedo: true`** calls `quantizeTextureToPalette(tex, palette, quantizeDither)` (`PixelMaterialSynth.ts`) to bake exact discrete palette colors (+ optional Bayer 4×4 dithering) directly into exported `.GLB` textures for external engines without LUT shaders.
- Includes Node headless shims (`ImageData`, `OffscreenCanvas`, `FileReader`) so Vitest runs `.GLB` texture serialization without DOM errors.

### D. Headless Batch CLI Exporter (`scripts/export_nwl_headless.mjs`)
- Runs Chromium + WebGL2 SwiftShader against `dist/` via `window.__PIXELIZER_STUDIO__`:
  ```bash
  npm run export:nwl -- --targets=knight,archer,mage,boss_demon,city,dungeon,chest --preset=nwl_snes --quantize-glb --out=exports/nwl
  ```
- Outputs `<id>_sheet_8dir.png`, `<id>_atlas.json`, `<id>.glb`, and `manifest.json` (tri count, `unwrapMetrics`, sheet dims, GLB byteLength, `renderStats`, `exportMs`). Supports `--targets=all`, `--dither-glb`, `--frames=N`, `--height=PX`, `--build`.

---

## 3. Browser Play Sandbox (`src/sandbox/NwlPlaySandbox.ts`)

`createNwlPlaySandbox(stageContainer, pipeline, callbacks)` creates the real-time ARPG loop (City -> Portal -> Randomized Dungeon Floor 1 -> Live Loot Drop slot equipping):
- Accepts optional `finishOptions?: { finishMode, seed, aoStrength, normalStrength }` passed forward into the Sandbox Hero, City, and Dungeon builders.
- Transient spell VFX and active projectiles automatically attach short-range `THREE.PointLight`s (`attachSpellPointLight`) for live local cel illumination.
- Controls: `WASD` move, `Space` attack, `Shift` dodge, `1-4` class skills, `E` interact (enter portal, pick up rarity gear, open/close house doors & `npc.bau`). Exit cleanly via `#sb-btn-exit` or `#btn-play-sandbox`.

---

## 4. Automated Test & Quality Gate Recipes

- **Tests**: [`tests/engine.test.ts`](../../../tests/engine.test.ts), [`tests/rigging_procedural.test.ts`](../../../tests/rigging_procedural.test.ts), [`tests/nwl_production.test.ts`](../../../tests/nwl_production.test.ts), [`tests/qualityGate.test.ts`](../../../tests/qualityGate.test.ts), and [`tests/wave3.test.ts`](../../../tests/wave3.test.ts).
- **Commands & Visual Check**:
  ```bash
  grep -rn "node:" src/
  npm run typecheck && npm test && npm run build
  ```
  Visual capture with Playwright + `/usr/bin/chromium` (`--use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`) must verify `0` console/page errors and inspect PNGs across NWL presets, `hades_lab` v2, Instanced City/Dungeon lights, Object Inspector previews, and `Play Sandbox`.
