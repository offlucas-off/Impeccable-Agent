# Studio UI, Play Sandbox, Exporters & Quality Gate

Reference for wiring Studio UI panels, Finish Mode toggles, Play Sandbox, Voxelizer/GLB/Sprite exporters, and running automated Quality Gate + visual verification.

---

## 1. Modular Studio Architecture, Inspector Previews & Framing (`src/studio/`)

- **Modular Panels (`src/studio/ui/`)**:
  - [`studioContext.ts`](../../../src/studio/state/studioContext.ts): `StudioContext`, `disposeGroupResources` (preserves `userData.pooled === true`), and `createEventRegistry()`.
  - [`pipelinePanel.ts`](../../../src/studio/ui/pipelinePanel.ts): Pipeline resolution/dither/shadow, global `#sel-global-outline-steps`, `#sel-global-dither-space`, `#rng-global-rim`, plus **HDR Emissive Bloom** controls (`#chk-bloom-enabled`, `#rng-bloom-thresh`, `#rng-bloom-int`).
  - [`objectInspectorPanel.ts`](../../../src/studio/ui/objectInspectorPanel.ts): `#obj-mesh-stats` (tris/verts/instanced), Rim Light & 2px outline controls, and live pixelated `<canvas>` previews (`#tex-albedo-preview`, `#tex-normal-preview`, `#tex-emit-preview`).
  - [`animViewerPanel.ts`](../../../src/studio/ui/animViewerPanel.ts): 85+ Quaternius clips browser, `Retarget UAL`, `Voxelize Preserving Rig`, `#av-btn-autorig` (converts static T/A-Pose humanoids into 65-bone UAL `SkinnedMesh`), hand R/L prop sockets, and `.GLB` bundle exporter.
  - [`exportPanel.ts`](../../../src/studio/ui/exportPanel.ts): Snapshot, NWL 8-dir sheets, Voxel 3D, plus `#btn-export-asset-glb` with `#chk-export-quantize-glb` & `#chk-export-quantize-dither`.
  - [`stageManager.ts`](../../../src/studio/ui/stageManager.ts): Presets (including `nwl_boss_demon`, `nwl_chest`), `applyStageCameraFraming`, UAL clip binding, async model import caption reporting (`otimizado de ... via Worker`), and Play Sandbox transitions.
  - [`studioApp.ts`](../../../src/studio/ui/studioApp.ts): Viewport orchestrator, `#hud-perf`, `applyStylePresetFromUi` (syncs bloom & palette controls), and pure-browser `window.__PIXELIZER_STUDIO__` bridge.
- **Async Model Loader & Vite Build (`src/studio/loaders/` & `vite.config.ts`)**:
  - [`zipExtractor.ts`](../../../src/studio/loaders/zipExtractor.ts): Pure-TS STORE & `deflate-raw` (`DecompressionStream`) archive reader rejecting ZIP64 EOCD sentinels (`0xffff` / `0xffffffff`).
  - [`objZipWorker.ts`](../../../src/studio/loaders/objZipWorker.ts): Module Web Worker for `.zip` / `.obj` parsing (`v x y z r g b`, negative indices, n-gons, multi-material buckets) and `MeshSimplifier` decimation (`>45k` tris -> `~24k` tris), with automatic main-thread fallback in Node/Vitest (`useWorker: false`).
  - [`modelLoader.ts`](../../../src/studio/loaders/modelLoader.ts): Unified `.glb`/`.gltf`/`.obj`/`.mtl`/`.fbx`/`.stl`/`.zip` loader + `remasterImportedTextureForPixelizer` (area downsample, black-floor lift, soft Sobel normal generation, optional palette quantization).
  - [`vite.config.ts`](../../../vite.config.ts): Configured with `worker: { format: 'es' }` and `manualChunks` separating `three-core` and `three-addons`. Root Windows launchers: `iniciar_studio.bat` & `abrir_studio_local.bat`.

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

## 3. Browser Play Sandbox & Combat Juice (`src/sandbox/NwlPlaySandbox.ts`)

`createNwlPlaySandbox(stageContainer, pipeline, callbacks)` creates the real-time ARPG loop (City -> Portal -> Randomized Dungeon Floor 1 -> Live Loot Drop slot equipping):
- Accepts optional `finishOptions?: { finishMode, seed, aoStrength, normalStrength }` and `projectWorldToScreen` callback for HUD projection.
- Transient spell VFX and active projectiles automatically attach short-range `THREE.PointLight`s (`attachSpellPointLight`) for live local cel illumination.
- **Combat Juice**:
  - **Hit-Stop (`hitStopTimer <= 0.06s`)**: Pauses actor movement/simulation cleanly on heavy hits (`>=30` dmg), kills, and destructible breaks while still updating damped camera shake and floating text timers.
  - **Damped Camera Shake (`getCameraShakeOffset()`)**: Decaying camera-shake offset vector queried by `studioApp.ts` so camera target/orbit never drifts.
  - **Pooled Floating Numbers (`#sb-floating-layer`)**: `.sb-float-num` spans (`.is-crit`, `.is-heal`, `.is-player-hit`, capped at `24`) projected into screen coordinates.
  - **Spell Cooldown Overlays**: Updates `.sb-spell-btn` with `.is-on-cooldown`, `--cd-pct`, and `.sb-cd-tag` countdown timer; `getCombatJuiceState()` exposes internal metrics for testing, and `dispose()` removes all HUD elements & `window` listeners (`typeof window !== 'undefined'` guarded).
- Controls: `WASD` move, `Space` attack, `Shift` dodge, `1-4` class skills, `E` interact (enter portal, pick up rarity gear, open/close house doors & `npc.bau`). Exit cleanly via `#sb-btn-exit` or `#btn-play-sandbox`.

---

## 4. Automated Test & Quality Gate Recipes

- **Tests**: [`tests/engine.test.ts`](../../../tests/engine.test.ts), [`tests/rigging_procedural.test.ts`](../../../tests/rigging_procedural.test.ts), [`tests/nwl_production.test.ts`](../../../tests/nwl_production.test.ts), [`tests/qualityGate.test.ts`](../../../tests/qualityGate.test.ts), [`tests/wave3.test.ts`](../../../tests/wave3.test.ts), and [`tests/p1_upgrades.test.ts`](../../../tests/p1_upgrades.test.ts).
- **Commands & Visual Check**:
  ```bash
  grep -rn "node:" src/
  npm run typecheck && npm test && npm run build
  ```
  Visual capture with Playwright + `/usr/bin/chromium` (`--use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`) must verify `0` console/page errors and inspect PNGs across NWL presets, `hades_lab` v2 (+ HDR Bloom), Instanced City/Dungeon lights, Worker `.zip` + Static T/A-Pose Auto-Rig, and `Play Sandbox` Combat Juice.
