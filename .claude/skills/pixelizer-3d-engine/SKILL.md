---
name: pixelizer-3d-engine
description: Build, use, customize, debug, and extend Pixelizer 3D Engine & NWL Production Studio (WebGL2 GLSL3 MRT multi-pass 3D-to-pixel-art pipeline, 1x1-10x10 sparse pixel expansion, Dual Palette LUTs, 65-bone Quaternius UAL rigging/animation, procedural sculpted & auto-UV textured RPG characters/equipment/NPCs/cities/monsters/1.5m tileset dungeons/3D spell VFX, 3D Voxelizer, 8-dir sprite sheet exporter, and browser Play Sandbox). Use when working inside or extending this engine or integrating its SDK.
file_names:
    - references/shader-pipeline-and-palettes.md
    - references/studio-sandbox-and-exporters.md
    - references/ual-rigging-and-procedural.md
---
# Pixelizer 3D Engine & NWL Production Studio

Use this skill whenever operating, debugging, extending, or building on **Pixelizer 3D Engine** (Three.js + WebGL2 MRT `GLSL3`).

---

## 1. Repository & Module Map

```text
src/
├── engine/
│   ├── index.ts                     # Barrel export for ALL public engine APIs
│   ├── types.ts                     # Config & data types (PipelineConfig, PixelizerMaterialOptions, etc.)
│   ├── PixelizerPipeline.ts         # 4-pass WebGL2 MRT + HDR Emissive Bloom orchestrator + applyVisualStylePreset()
│   ├── PixelizerMaterial.ts         # GLSL3 MRT shader material (cel, LUT, TBN normal maps, dithering, outline ID, bloom alpha)
│   ├── palettes.ts                  # Built-in palettes (incl. 24-color snes_pal_nwl, hades_ink) + Dual 256x16 LUTs
│   ├── dither.ts                    # 11 ordered 4x4 & 8x8 dither matrices
│   ├── lightingRamps.ts             # 1D lighting ramps (three_band, two_band, hades_graphic_ink, etc.)
│   ├── snapping.ts                  # Camera/object grid snapping & anti-pixel-creep
│   ├── steppedAnimation.ts          # Stepped flipbook animation timing (6-24 FPS)
│   ├── SpriteSheetExporter.ts       # Single PNG + Turntable + NWL 8-dir non-mirrored 108px sheets
│   ├── Voxelizer.ts                 # Watertight voxelization from textured/skinned/morphed meshes + .glb/.obj/.vox
│   ├── shaders/
│   │   ├── common.ts                # Linear<->sRGB, RGB<->HSV, octahedral normals, 4x4/8x8 dither sampling
│   │   ├── objectShader.ts          # Pass 1 MRT UberShader (Skinning + Morphs + TBN Normal Mapping + Seed Clipping + Bloom Alpha)
│   │   ├── expansionShader.ts       # Pass 2 Attempt #3 nearest-depth NxN expansion (1x1..10x10)
│   │   ├── outlineEdgeShader.ts     # Pass 3 Object ID outlines, normal/depth creases & bevel edges
│   │   └── upscaleShader.ts         # Pass 4 HDR Bloom extract/9-tap blur + Pixel-Art AA + subpixel motion + A/B split
│   ├── rigging/
│   │   ├── UalRigSpec.ts            # Canonical 65-bone Quaternius UAL skeleton & socket definitions
│   │   ├── AnimationLibraryBank.ts  # Shared singleton loader for ual_master_library.glb (85 clips)
│   │   ├── AutoRigBinder.ts         # Rigid sockets + 4-weight capsule skinning + static T/A-Pose -> 65-bone UAL auto-rig
│   │   ├── UalRetargeter.ts         # Retargets UAL clips to Mixamo/KayKit/Blender rigs
│   │   └── RiggedExporter.ts        # Normalized SkinnedMesh + embedded textured PNG .GLB exporter
│   └── procedural/
│       ├── SdfVoxelPrimitives.ts    # prepareColoredPart, computeGeometryTangents, mergeColoredParts, RNG
│       ├── ProceduralGeometryKit.ts # Sculpted beveled boxes, lathes, curved horns, shields, roofs, organic SDF, FinishMode
│       ├── PixelUvUnwrapper.ts      # Texel-locked (px/m) box6/cylindrical/planar auto-UV, island packing, UV diagnostics
│       ├── PixelMaterialSynth.ts    # Procedural pixel-art albedo/normal/emission atlas + semantic landmarks + Quality Metrics
│       ├── VertexAndTexelBaker.ts   # Pure-TS BVH hemisphere Vertex AO, UV-safe subdivideForAo, 8-dir texel GTAO & wear
│       ├── MeshSimplifier.ts        # Pure-TS O(V+T) UV-seam & normal-crease preserving decimation (>45k tris)
│       ├── PlayerEquipmentBuilder.ts# PlayerBaseShell (1.79m) + 3 classes x 6 slots x 5 rarities (90 textured items)
│       ├── NpcBuilder.ts            # 9 NWL NPCs (~1.70m) + animated npc.bau
│       ├── CityBuilder.ts           # NWL_Cidade_Principal_Portais (6 enterable 3-part houses, pitched roofs, Portal)
│       ├── MonsterBuilder.ts        # 5 NWL enemies (1.35m-2.10m) + sculpted SDF/magma Boss Demon (2.95m)
│       ├── NwlTilesetDungeon.ts     # 1.5m modular tileset kit + shared atlas sheet + BFS Dungeon Floor 1
│       ├── SpellVfxBuilder.ts       # 20 low-poly 3D pixelated spells, barriers & telegraphs
│       ├── PropBuilder.ts           # CC0-calibrated procedural props (chest, barrel, sword, tree, etc.)
│       ├── CharacterBuilder.ts      # General procedural UAL characters (Rigid/Skinned/Voxel)
│       ├── TilesetStructureSolver.ts# Multi-floor WFC building solver
│       └── InstancedBatchKit.ts     # GPU-instanced `THREE.InstancedMesh` batching + pixel snap alignment
├── sandbox/
│   └── NwlPlaySandbox.ts            # Interactive City + Portal -> Dungeon + Spell PointLights + Combat Juice (hit-stop/shake/floating nums/cooldowns)
├── studio/
│   ├── state/studioContext.ts       # Shared StudioContext, resource disposal & event registry
│   ├── loaders/
│   │   ├── zipExtractor.ts          # Browser-pure STORE/deflate-raw ZIP reader + ZIP64 guard
│   │   ├── objZipWorker.ts          # ES Web Worker for off-thread .zip/.obj/.mtl parsing & decimation
│   │   └── modelLoader.ts           # GLB/GLTF/OBJ/FBX/STL/ZIP loader + texture remaster + UAL clip binding
│   ├── presets/demoScenes.ts        # Built-in NWL & legacy studio presets
│   └── ui/                          # Modular panels: studioApp.ts, pipelinePanel.ts, objectInspectorPanel.ts, exportPanel.ts, stageManager.ts, generatorPanel.ts, paletteEditor.ts, animViewerPanel.ts
├── scripts/
│   └── export_nwl_headless.mjs      # Headless Playwright+SwiftShader CLI batch exporter (`npm run export:nwl`)
└── tests/
    ├── vitest.setup.ts              # Headless Node self + PNG-IHDR createImageBitmap shim for textured .GLB re-import
    ├── engine.test.ts
    ├── rigging_procedural.test.ts
    ├── nwl_production.test.ts
    ├── qualityGate.test.ts          # UV zero-overlap, texture entropy, flat-face, anti-fangs AO & GLB texture gate
    ├── wave3.test.ts                # SpotLight/Rim/2px Outline/UV-dither, InstancedMesh, quantized .GLB & Studio modules
    └── p1_upgrades.test.ts          # MeshSimplifier, ZIP/OBJ pipeline, Static T/A-Pose Auto-Rig, HDR Bloom & Sandbox Combat Juice
```

---

## 2. Quick Start (Programmatic SDK)

```ts
import * as THREE from 'three';
import {
  PixelizerPipeline,
  buildNwlPlayerCharacter,
  buildProceduralProp,
} from './src/engine';

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
const pipeline = new PixelizerPipeline(renderer);
const scene = new THREE.Scene();

// 1. Apply NWL Official SNES Dark Fantasy (3x3, bloom off) or Experimental Lab Hades Ink (1x1, HDR bloom on)
pipeline.applyVisualStylePreset('nwl_snes', scene);

// 2. Spawn canonical 1.79m Hero on 65-bone UAL rig (with auto-UV + procedural pixel atlas + AO)
const hero = buildNwlPlayerCharacter(
  {
    classId: 'knight',
    rarity: 'rare',
    pixelSize: 3,
    objectId: 10,
    finishMode: 'textured_ao', // or 'classic_flat' for legacy vertex-only look
    aoStrength: 0.55,
    normalStrength: 0.36,
  },
  pipeline.getSharedResourcesForMaterial()
);
scene.add(hero.root);
hero.equipSlot('weapon', 'legendary'); // Swaps textured 3D weapon geometry live on hand_r bone

// 3. Build an auto-unwrapped procedural prop with UV/entropy metrics
const chest = buildProceduralProp({ kind: 'chest', finishMode: 'textured_ao', seed: 101 });
scene.add(chest.root);

// 4. Render through the 4-pass WebGL2 MRT pipeline (+ HDR bloom when enabled)
pipeline.render(scene, camera);
```

---

## 3. Critical Engine Invariants (NEVER Violate These)

1. **`mat.vertexColors = true` + `vertexColorMode: 'white_for_ao'`**
   - `PixelizerMaterial` multiplies `albedoMap * uBaseColorLinear * vVertexColor`.
   - Textured builders (`bakeTaggedPartsAsset`) keep `vertexColorMode: 'white_for_ao'` (`(1, 1, 1)` scaled strictly by grayscale Vertex AO `[minShade..1.0]`) so `albedoMap` and `baseHex` are NEVER double-multiplied.
   - Three.js ONLY compiles `USE_COLOR` / `vColor` when `mat.vertexColors = true` is explicitly set. Never omit `mat.vertexColors = true`!
2. **TBN Tangents & Pixel-Art `DataTexture` Sampling**
   - Every textured procedural mesh with `normalMap` computes pure-TS Lengyel `vec4` vertex tangents via `computeGeometryTangents(geo)` and enables `useVertexTangents: true` (`USE_TANGENT` shader define in `PixelizerMaterial` / `objectShader.ts`). Non-indexed `dFdx/dFdy` cotangent TBN is automatic fallback only when tangents are absent.
   - Call `enforcePixelArtTextureSampling(tex, kind)` on procedural `DataTexture`s (`NearestFilter`, `generateMipmaps = false`, `flipY = false`, `albedo`/`emission` = `SRGBColorSpace`, `normal` = `NoColorSpace`).
   - Clamp procedural normal slopes `<= 0.24` (`< 14°`) so `outlineEdgeShader.ts` Pass 3 never creates noisy outline static inside flat stone/wood panels.
3. **Chunky Pixel-Art Clustering (No Nyquist Confetti Under `3×3`)**
   - `Attempt #3` pixel expansion samples only 1 texel per `P×P` macropixel. Keep tiled patterns (`stone_masonry`, `roof_shingle`, `wood_planks`) at chunky `>= 5-8 px` macro-clusters and avoid pure `#000000`/`#ffffff` extremes (clamp Texel Baker `[12..244]`).
   - Never inject `ditherStrength > 0.45` with missing midtones onto textured surfaces; `snes_pal_nwl` uses 24 RPG-calibrated swatches (including oak browns, gunmetal grey, sage moss, and parchment stone) under `oklab_perceptual`.
4. **Color Space, Tone Mapping & HDR Bloom Alpha Contract**
   - `PixelizerPipeline` enforces `renderer.outputColorSpace = THREE.LinearSRGBColorSpace` and `renderer.toneMapping = THREE.NoToneMapping`. Never enable ACES tone mapping or `SRGBColorSpace` on the renderer.
   - When `bloomEnabled === true`, MRT `gColor.a` encodes HDR emission above threshold (`0.5` neutral, `0.0` transparent background); Pass 2/Pass 3 paths preserve alpha polarity without tinting dark edges when bloom is toggled off.
5. **Bone Socket & Limb Orientation (`+Y` Along Bone, `y = 0` at Parent Joint)**
   - Limb bones point along bone local `+Y` (`makeBeveledBoneSegmentBox` spans `y = 0 .. length`). Shoulder pauldrons stay centered near `y ≈ -0.02..+0.03` on `upperarm_l/r`.
   - Static humanoid auto-rigging (`autoRigStaticHumanoidToUal`) straightens A-Pose arms (`armAngleDeg >= 14°`) into canonical UAL T-Pose bind space (`1.79 m`) before binding SkinnedMeshes.
6. **Shared `objectId` Merges Outlines; `gridReference` Prevents Sub-Part Jitter**
   - Identical `objectId` (`1..255`) merges sub-parts into one outer silhouette. Multi-part rigged actors bind `gridReference: rig.armature` on child attachments.
7. **NWL Canonical Scale & `FinishMode` Parity**
   - Scale standard: **`1 m = 60 px`** (`PlayerBaseShell = 1.79 m`, NPCs `~1.70 m`, Tiles `1.5 m`, Boss Demon `2.95 m`). Zero cloth physics capes on modular hero sets.
   - Preserve `finishMode?: 'textured_ao' | 'classic_flat'` across all procedural builders so Studio & Sandbox can toggle seamlessly without breaking legacy tests.
8. **Strict Browser Purity & Worker Safety in `src/`**
   - Zero Node built-in imports anywhere in `src/` (and avoid writing `node:` even inside comments in `src/` so `grep -rn "node:" src/` returns 0 matches cleanly). Node `.GLB` re-import tests rely on [`vitest.config.ts`](../../vitest.config.ts) + [`tests/vitest.setup.ts`](../../tests/vitest.setup.ts), while Vite bundles `objZipWorker.ts` via `worker: { format: 'es' }` and splits Three.js chunks cleanly via `manualChunks`.

---

## 4. Reference Guides (Read Based on Task)

- **Shaders, TBN Normal Maps, HDR Bloom, Palettes & Style Presets**: Read [shader-pipeline-and-palettes.md](references/shader-pipeline-and-palettes.md).
- **65-Bone UAL Rigging, Static Auto-Rig, Sculpted Primitives, MeshSimplifier & Builders**: Read [ual-rigging-and-procedural.md](references/ual-rigging-and-procedural.md).
- **Studio UI, Async ZIP/OBJ Loader, Play Sandbox Combat Juice, Exporters & Quality Gate**: Read [studio-sandbox-and-exporters.md](references/studio-sandbox-and-exporters.md).

---

## 5. Mandatory Verification Checklist After Any Change

Run inside the repository root:

```bash
grep -rn "node:" src/   # must return 0 matches
npm run typecheck && npm test && npm run build
```

When changing shaders, procedural geometry, materials, camera framing, Studio UI, loaders, or Sandbox behavior, also verify visually with **headless Chromium + WebGL2 SwiftShader**:
- Serve `vite preview` and run Playwright (`executablePath: '/usr/bin/chromium'`) with `--no-sandbox --use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`.
- Assert `console` errors `=== 0`, `pageerror` count `=== 0`, `#tex-albedo-name` / `#tex-normal-name` populated in `textured_ao`, `Overlap 0` in `#gen-quality-stats`, HDR Bloom state toggling across `nwl_snes` vs `hades_lab`, Worker high-poly `.zip` decimation + Static T/A-Pose Auto-Rig (`#av-btn-autorig` -> `UAL 65B`), and Play Sandbox Combat Juice (`.is-on-cooldown` + `.sb-float-num`), then inspect all PNG screenshots via `view_file`.
- Re-export new public symbols from [`src/engine/index.ts`](../../src/engine/index.ts) and add unit/integration checks under `tests/` when extending builders, shaders, or loaders.
