---
name: pixelizer-3d-engine
description: Build, use, customize, debug, and extend Pixelizer 3D Engine & NWL Production Studio (WebGL2 GLSL3 MRT multi-pass 3D-to-pixel-art pipeline, 1x1-10x10 sparse pixel expansion, Dual Palette LUTs, 65-bone Quaternius UAL rigging/animation, procedural modular RPG characters/equipment/NPCs/cities/monsters/1.5m tileset dungeons/3D spell VFX, 3D Voxelizer, 8-dir sprite sheet exporter, and browser Play Sandbox). Use when working inside or extending this engine or integrating its SDK.
metadata:
  version: "1.0"
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
│   ├── PixelizerPipeline.ts         # 4-pass WebGL2 MRT orchestrator + applyVisualStylePreset()
│   ├── PixelizerMaterial.ts         # GLSL3 MRT shader material (cel shading, LUT, dithering, outline ID)
│   ├── palettes.ts                  # Built-in palettes (incl. snes_pal_nwl, hades_ink) + Dual 256x16 LUT builder
│   ├── dither.ts                    # 11 ordered 4x4 & 8x8 dither matrices
│   ├── lightingRamps.ts             # 1D lighting ramps (three_band, two_band, hades_graphic_ink, etc.)
│   ├── snapping.ts                  # Camera/object grid snapping & anti-pixel-creep
│   ├── steppedAnimation.ts          # Stepped flipbook animation timing (6-24 FPS)
│   ├── SpriteSheetExporter.ts       # Single PNG + Turntable + NWL 8-dir non-mirrored 108px sheets
│   ├── Voxelizer.ts                 # Watertight voxelization from animated/morphed meshes + .glb/.obj/.vox
│   ├── shaders/
│   │   ├── common.ts                # Linear<->sRGB, RGB<->HSV, octahedral normals, 4x4/8x8 dither sampling
│   │   ├── objectShader.ts          # Pass 1 MRT UberShader (Skinning + Morphs + Seed Clipping)
│   │   ├── expansionShader.ts       # Pass 2 Attempt #3 nearest-depth NxN expansion (1x1..10x10)
│   │   ├── outlineEdgeShader.ts     # Pass 3 Object ID outlines, normal/depth creases & bevel edges
│   │   └── upscaleShader.ts         # Pass 4 Pixel-Art AA, subpixel UV motion, A/B split compare
│   ├── rigging/
│   │   ├── UalRigSpec.ts            # Canonical 65-bone Quaternius UAL skeleton & socket definitions
│   │   ├── AnimationLibraryBank.ts  # Shared singleton loader for ual_master_library.glb (85 clips)
│   │   ├── AutoRigBinder.ts         # Rigid socket attachment + automatic 4-weight capsule skinning
│   │   ├── UalRetargeter.ts         # Retargets UAL clips to Mixamo/KayKit/Blender rigs
│   │   └── RiggedExporter.ts        # Normalized SkinnedMesh + clips .GLB exporter
│   └── procedural/
│       ├── SdfVoxelPrimitives.ts    # prepareColoredPart, mergeColoredParts, makeBoneSegmentBox, RNG
│       ├── PlayerEquipmentBuilder.ts# PlayerBaseShell (1.79m) + 3 classes x 6 slots x 5 rarities (90 items)
│       ├── NpcBuilder.ts            # 9 NWL NPCs (~1.70m) + animated npc.bau
│       ├── CityBuilder.ts           # NWL_Cidade_Principal_Portais (6 enterable 3-part houses, Portal)
│       ├── MonsterBuilder.ts        # 5 NWL enemies (1.35m-2.10m) + Boss Demon (2.95m)
│       ├── NwlTilesetDungeon.ts     # 1.5m modular tileset kit + BFS-verified Ruinas Verdes Floor 1
│       ├── SpellVfxBuilder.ts       # 20 low-poly 3D pixelated spells, barriers & telegraphs
│       ├── PropBuilder.ts           # CC0-calibrated procedural props
│       ├── CharacterBuilder.ts      # General procedural UAL characters
│       └── TilesetStructureSolver.ts# Multi-floor WFC building solver
├── sandbox/
│   └── NwlPlaySandbox.ts            # Interactive City + Portal -> Randomized Dungeon Floor 1 loop
├── studio/
│   ├── loaders/modelLoader.ts       # GLB/GLTF/OBJ/FBX/STL loader + clip binding + ID split/unify
│   ├── presets/demoScenes.ts        # Built-in legacy studio presets
│   └── ui/                          # studioApp.ts, generatorPanel.ts, paletteEditor.ts, animViewerPanel.ts
├── data/
│   ├── ualSkeletonSpec.json
│   ├── ualAnimationCatalog.json
│   └── structuralKnowledge.json
└── tests/
    ├── engine.test.ts
    ├── rigging_procedural.test.ts
    └── nwl_production.test.ts
```

---

## 2. Quick Start (Programmatic SDK)

```ts
import * as THREE from 'three';
import {
  PixelizerMaterial,
  PixelizerPipeline,
  buildNwlPlayerCharacter,
  buildNwlStarterCity,
} from './src/engine';

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
const pipeline = new PixelizerPipeline(renderer);
const scene = new THREE.Scene();

// 1. Apply NWL Official SNES Dark Fantasy (3x3) or Experimental Lab Hades Ink (1x1)
pipeline.applyVisualStylePreset('nwl_snes', scene);

// 2. Spawn canonical 1.79m Hero on 65-bone UAL rig and swap equipment live
const hero = buildNwlPlayerCharacter(
  { classId: 'knight', rarity: 'rare', pixelSize: 3, objectId: 10 },
  pipeline.getSharedResourcesForMaterial()
);
scene.add(hero.root);
hero.equipSlot('weapon', 'legendary'); // Swaps 3D weapon geometry directly on hand_r bone

// 3. Render through the 4-pass WebGL2 MRT pipeline
pipeline.render(scene, camera);
```

---

## 3. Critical Engine Invariants (NEVER Violate These)

1. **`mat.vertexColors = true` Is Mandatory for Vertex-Colored Geometry**
   - `PixelizerMaterial` sets `diffuseVertexColorWeight: 1.0`, **but Three.js only compiles `USE_COLOR` / `vColor` when `mat.vertexColors = true`**.
   - Every mesh built via `prepareColoredPart` or `mergeColoredParts` **must** set `mat.vertexColors = true` on its `PixelizerMaterial`; otherwise meshes render solid white!
2. **Color Space & Tone Mapping Owned by Pipeline**
   - `PixelizerPipeline` enforces `renderer.outputColorSpace = THREE.LinearSRGBColorSpace` and `renderer.toneMapping = THREE.NoToneMapping`.
   - Lighting computes in linear space and LUT/upscale shaders output final calibrated sRGB. Never enable ACES tone mapping or `THREE.SRGBColorSpace` on the renderer.
3. **Bone Socket & Limb Orientation (`+Y` Along Bone, `y = 0` at Parent Joint)**
   - In `UalRigSpec`, limb bones point along bone local `+Y` (`makeBoneSegmentBox` spans `y = 0 .. length`).
   - Attachments near the shoulder/hip joint (`pauldrons`, boots cuffs, demon shoulder ridges) must stay anchored around `y = 0` (shoulder top caps use slightly **negative** local `y`, because upper arms point downward in world rest pose!).
   - Head accessories (helms, hats, horns) mount on `Head` relative to its local head center (~`y = 0.08..0.24`). Never leave secondary horn/spike segments offset without connecting overlap.
4. **Shared `objectId` Merges Outlines; Distinct `objectId` Separates Actors**
   - Neighboring fragments with identical `objectId` merge into one continuous silhouette (no inner seam lines between a knight's torso, helmet, and shield).
   - Use distinct `objectId` values (`1..255`) for separate characters, houses, or floor vs entities (`0` = unpixelized/background).
5. **Grid Alignment (`gridReference`) Prevents Sub-Part Jitter**
   - Multi-part rigged entities (`PlayerEquipmentBuilder`, `NpcBuilder`, `MonsterBuilder`) set `snapPosition: false, alignPixelGrid: true` with `gridReference: rig.armature` on child meshes so limb/gear parts lock to the parent root's pixel grid without tearing.
6. **`AnimationLibraryBank.getClip(name)` Return Type**
   - `bank.getClip(name)` returns `THREE.AnimationClip | null` directly. `bank.getAll()` returns `IndexedUalClip[]` (where `.clip` holds the `THREE.AnimationClip`).
7. **NWL Canonical Scale & Constraints**
   - Scale standard: **`1 m = 60 px`**.
   - `PlayerBaseShell`: `1.79 m` (`~108 px` at export); NPCs: `~1.70 m` (`~102 px`); Modular Tiles: `1.5 m` (`90 px`); Goblins: `1.35 m`; Orc Brute: `2.10 m`; Demon Boss: `2.95 m`.
   - Zero cloth physics capes on modular hero sets.
   - `Lab: Hades Graphic Ink (1×1)` (`hades_lab`) is strictly an isolated experimental preset; `nwl_snes` (`NWL: SNES Dark Fantasy 3×3`) is the production default.
8. **TypeScript Constraints in `tests/`**
   - Keep Vitest files free of Node-only types (`node:*` / `@types/node` globals) because `tsconfig.json` includes `tests/` and runs `tsc --noEmit` strictly in browser lib mode.

---

## 4. Reference Guides (Read Based on Task)

- **Shaders, MRT Passes, Palettes, Dithers & Lighting Ramps**: Read [shader-pipeline-and-palettes.md](references/shader-pipeline-and-palettes.md).
  Use when editing GLSL3 shaders, pixel sizes (`1×1..10×10`), edge/bevel behavior, Dual LUT color grading, dither matrices, lighting ramps, or adding `VisualStylePresetId` themes.
- **65-Bone UAL Rigging, Procedural Builders & Assets**: Read [ual-rigging-and-procedural.md](references/ual-rigging-and-procedural.md).
  Use when adding player classes/equipment slots/rarities, NPCs, enterable 3-part buildings, enemies/bosses, `1.5m` biome tilesets, dungeon generators, WFC structures, props, or 3D pixelated spells/VFX.
- **Studio UI, Play Sandbox, Voxelizer & Exporters**: Read [studio-sandbox-and-exporters.md](references/studio-sandbox-and-exporters.md).
  Use when modifying `studioApp.ts`, panels, presets, `NwlPlaySandbox.ts`, `Voxelizer.ts` (`.glb`/`.obj`/`.vox`), `SpriteSheetExporter.ts` (`108px` 8-dir sheets), or running visual Playwright/Vitest verification.

---

## 5. Mandatory Verification Checklist After Any Change

Run inside the repository root:

```bash
npm run typecheck && npm test && npm run build
```

When changing shaders, procedural geometry, materials, camera framing, Studio UI, or Sandbox behavior, also verify visually with **headless Chromium + WebGL2 SwiftShader**:
- Serve `vite preview` and run Playwright with `--no-sandbox --use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`.
- Assert `console` error count === `0` and `pageerror` count === `0`.
- Visually inspect captured screenshots to verify: vertex colors (not white), attached rig parts (no floating horns/armor), readable shadows, and `clippedFrames === 0` on 8-dir sprite sheets.
- If adding new public symbols, re-export them from [`src/engine/index.ts`](../../src/engine/index.ts) and add unit coverage under `tests/`.
