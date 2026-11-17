# Shader Pipeline, TBN Normal Mapping, Palettes & Style Presets

Detailed reference for editing the 4-pass WebGL2 `GLSL3` rendering pipeline, TBN tangent space, and color grading system.

---

## 1. WebGL2 MRT Pipeline (`src/engine/PixelizerPipeline.ts`)

| Pass | Target / Shader | Behavior |
|---|---|---|
| **Pass 0** | Shadow Maps (`THREE.BasicShadowMap`) | Casts crisp shadows onto world & characters |
| **Pass 1** | `objectShader.ts` -> 4 MRT attachments | Skinning + Morphs + Lengyel TBN (`USE_TANGENT`) / cotangent TBN fallback + Sparse seed clipping (`1..10`) + Cel lighting + Dual LUT + Ordered dither |
| **Pass 2** | `expansionShader.ts` | Nearest-depth `Attempt #3` expansion across `[-uSearchRadius..+uSearchRadius]` (up to `±6` for `10×10`), packing winner delta into `gMeta.b` |
| **Pass 3** | `outlineEdgeShader.ts` | Depth-tested silhouettes by `objectId`, deterministic 1-macropixel normal creases, staircase depth edges, and light-reactive bevel edges |
| **Pass 4** | `upscaleShader.ts` | Pixel-Art AA (Cole Cecil filter) or Nearest upscale + camera subpixel motion compensation + live A/B split compare |

### TBN Tangent Contract (`PixelizerMaterial.ts` & `objectShader.ts`)

- Whenever procedural geometry supplies a `tangent` (`vec4`) attribute and `normalMap !== null`, pass `useVertexTangents: true` in `PixelizerMaterialOptions`.
- `PixelizerMaterial` automatically toggles `#define USE_TANGENT` on `syncUniforms()`, transforms tangent + bitangent (`cross(N, T) * sign(tangent.w)`) in view space (including `skinning`/`instancing`), and falls back cleanly to `dFdx/dFdy` screen-space cotangent frames when `USE_TANGENT` is unset.
- Call `enforcePixelArtTextureSampling(tex, 'albedo' | 'normal' | 'emission')` whenever creating or attaching pixel-art `DataTexture`s (`NearestFilter`, `generateMipmaps = false`, `SRGBColorSpace` for albedo/emission, `NoColorSpace` for tangent-space normals).

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

## 2. Color Palettes & Dithering (`src/engine/palettes.ts`)

Palettes compile on demand via `buildPaletteLutPair` into two `256×16` RGBA textures (`16×16×16` blue-sliced 3D LUTs storing best color `C1` and runner-up dither pair `C2`).

### NWL Official Palette (`snes_pal_nwl`)
- Contains **24 curated dark-fantasy swatches**: preserves all 18 original SNES Dark Fantasy colors (including skin `#e0a882`, `#b87b56`) plus 6 material midtones (`#3e4356` gunmetal, `#4f3428` oak, `#7c4d32` chestnut, `#4e7a48` sage moss, `#8f8a82` warm stone, `#c8bfa8` parchment plaster).
- Uses `method: 'oklab_perceptual'` with `ditherStrength: 0.35`, preventing neutral steel armor and wooden props from picking up false green/purple/orange confetti under Dual LUT sampling.

To add a built-in palette, append an entry to `BUILTIN_PALETTES`:

```ts
{
  id: 'my_palette',
  name: 'My Custom Palette (24)',
  colors: ['#14101c', '#3b1725', /* ...hex #RRGGBB entries... */],
  method: 'oklab_perceptual', // or 'hsv_weighted' | 'hue_priority' | 'rgb_euclidean' | 'value_nearest' | 'posterize_quant'
  hsvWeights: [0.4, 0.3, 1.0],
  enableDither: true,
  ditherStrength: 0.35, // keep <= 0.45 for textured procedural atlases
  valueCurveGamma: 1.0,
}
```

### Selecting Conversion Metric
- `oklab_perceptual`: Best overall hue/chroma neutrality across both procedural textures (`textured_ao`) and painterly palettes (`snes_pal_nwl`, `resurrect64`, `hades_ink`).
- `hue_priority` (`snes_pal`, `cyber_neon`): Emphasizes saturated primary/accent hues.
- `value_nearest`: Strict luminance ramp ordering (`gameboy`, `1bit_ink`).
- `posterize_quant`: Channel quantization (`rgb222`).

---

## 3. Lighting Ramps (`src/engine/lightingRamps.ts`) & Visual Style Presets

- **Dither patterns (`src/engine/dither.ts`)**: `4×4` (16 ints `0..16`) or `8×8` (64 ints `0..64`).
- **Lighting Ramps (`BUILTIN_LIGHTING_RAMPS`)**: Sorted `{ position, color }` stops (`smooth: false` for crisp cel bands). Keep shadow stop `0.0` lifted (`#2b2042`..`#454860`) so dark armors/hides retain readable silhouette edges.
- **Visual Style Presets (`applyVisualStylePreset` in `PixelizerPipeline.ts`)**:
  - `'nwl_snes'` (Official Default): `snes_pal_nwl`, `bayer4x4`, `three_band`, `pixelSize: 3`, `filterMode: 'only_pixelized'`.
  - `'hades_lab'` (Experimental): `hades_ink`, `bayer4x4`, `hades_graphic_ink`, `pixelSize: 1`, `filterMode: 'only_pixelized'`. Compatible with all `textured_ao` assets.
