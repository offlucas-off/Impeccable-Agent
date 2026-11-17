# Shader Pipeline, Palettes, Dithers & Style Presets

Detailed reference for editing the 4-pass WebGL2 `GLSL3` rendering pipeline and color grading system.

---

## 1. WebGL2 MRT Pipeline (`src/engine/PixelizerPipeline.ts`)

| Pass | Target / Shader | Behavior |
|---|---|---|
| **Pass 0** | Shadow Maps (`THREE.BasicShadowMap`) | Casts crisp shadows onto world & characters |
| **Pass 1** | `objectShader.ts` -> 4 MRT attachments | Evaluates skinning + morphs, performs sparse seed clipping for `pixelSize` `1..10`, cel lighting + Dual LUT + ordered dither |
| **Pass 2** | `expansionShader.ts` | Nearest-depth `Attempt #3` expansion across `[-uSearchRadius..+uSearchRadius]` (up to `±6` for `10×10`), packing winner delta into `gMeta.b` |
| **Pass 3** | `outlineEdgeShader.ts` | Draws depth-tested silhouettes by `objectId`, deterministic 1-macropixel normal creases, staircase depth edges, and light-reactive bevel edges |
| **Pass 4** | `upscaleShader.ts` | Pixel-Art AA (Cole Cecil filter) or Nearest upscale + camera subpixel motion compensation + live A/B split compare |

### MRT Color Attachments

- `location = 0` (`gColor`, `RGBA16F` or `RGBA8` fallback): Final LUT-graded sRGB albedo + alpha.
- `location = 1` (`gOutline`, `RGBA8`): `rgb` silhouette color in sRGB, `a` outline alpha.
- `location = 2` (`gMeta`, `RGBA8`): `r = objectId / 255`, `g = pixelSize / 16`, `b = packedDelta ((dx+7)*16 + (dy+7))`, `a = bevelWeight`.
- `location = 3` (`gNormalDepth`, `RGBA16F` or `RGBA8`): `rg = octahedral view normal`, `b = edgeHighlight` (`<0.5` darken, `>0.5` lighten), `a = linear depth [0..1]`.

### Pixel Expansion Window Rule

When editing `uSearchRadius` in `PixelizerPipeline.ts` or `expansionShader.ts`:
- `maxPixelSize = 1..2` -> `radius >= 1`
- `maxPixelSize = 3..4` -> `radius >= 2`
- `maxPixelSize = 5..6` -> `radius >= 3`
- `maxPixelSize = 7..8` -> `radius >= 4`
- `maxPixelSize = 9..10` -> `radius >= 6`
Remember that GLSL loop bounds must match `uSearchRadius` (currently capped at `6` in `expansionShader.ts`).

---

## 2. Adding a Color Palette (`src/engine/palettes.ts`)

Palettes compile on demand via `buildPaletteLutPair` into two `256×16` RGBA textures (`16×16×16` blue-sliced 3D LUTs storing best color `C1` and runner-up dither pair `C2`).

To add a built-in palette, append an entry to `BUILTIN_PALETTES`:

```ts
{
  id: 'my_palette',
  name: 'My Custom Palette (24)',
  colors: ['#14101c', '#3b1725', /* ...hex #RRGGBB entries... */],
  method: 'oklab_perceptual', // or 'hsv_weighted' | 'hue_priority' | 'rgb_euclidean' | 'value_nearest' | 'posterize_quant'
  hsvWeights: [0.4, 0.3, 1.0],
  enableDither: true,
  ditherStrength: 0.85, // 0..1
  valueCurveGamma: 1.0, // >1 deepens midtones, <1 brightens
}
```

### Selecting Conversion Metric
- `hue_priority` + `valueCurveGamma: 1.05`: Best for crisp dark-fantasy SNES palettes (`snes_pal_nwl`) preserving saturated reds/oranges/greens.
- `oklab_perceptual`: Smoothest hue/lightness perception on stylized/painterly palettes (`resurrect64`, `hades_ink`).
- `value_nearest`: Strict luminance ramp ordering (`gameboy_dmg`, `1bit_ink`).
- `posterize_quant`: Channel quantization (`rgb64`).

---

## 3. Adding Dither Matrices (`src/engine/dither.ts`) & Lighting Ramps (`src/engine/lightingRamps.ts`)

- **Dither pattern** (`4×4` = 16 ints `0..16`; `8×8` = 64 ints `0..64`):
  Add to `BUILTIN_DITHER_PATTERNS` with `size: 4 | 8` and `thresholds`. `createDitherTexture()` normalizes thresholds into `[0..1]` inside a nearest-sampled `DataTexture`.
- **Lighting Ramp** (`BUILTIN_LIGHTING_RAMPS`):
  Define sorted stops `{ position: 0..1, color: '#RRGGBB' }` and `smooth: false` (crisp cel bands) or `true`.
  **Watch out for shadow legibility**: Setting stop `0.0` too dark (near `#000000`) collapses dark armor/skin silhouettes into black blobs. Keep dramatic shadows around `#2b2042`..`#454860` unless pure 1-bit ink is intended.

---

## 4. Adding a Visual Style Preset

In `PixelizerPipeline.ts`:
1. Extend `export type VisualStylePresetId = 'nwl_snes' | 'hades_lab' | 'my_preset';`.
2. Add a branch in `applyVisualStylePreset(preset, scene)` setting:
   - `activePaletteId`, `activeDitherId`, `activeRampId`
   - `pipelineConfig.filterMode` (`'only_pixelized'` | `'full_scene'` | `'cel_hard'`)
   - `usePixelExpansion`, `normalEdgeThreshold`, `edgeHighlightStrength`, `edgeBevelStrength`
   - Light/ambient colors and intensities
   - Optional `scene.traverse(...)` updating `PixelizerMaterial` (`pixelSize`, `outlineColor`, `edgeHighlight`, `edgeBevelWeight`).
3. Expose the option in `#sel-style-preset` inside `src/studio/ui/studioApp.ts` and handle syncing UI controls (`selLightingRamp`, `paletteEditor.refresh()`, light rig uniforms).
