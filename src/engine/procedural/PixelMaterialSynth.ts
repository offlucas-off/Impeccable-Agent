import * as THREE from 'three';
import {
  PixelizerMaterial,
  enforceHiFiTextureSampling,
  enforcePixelArtTextureSampling,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import {
  findDitherPair,
  hexToRgb,
  preparePaletteEntry,
  type RGB,
} from '../palettes';
import type { ColorPaletteConfig, PixelizerMaterialOptions } from '../types';
import {
  computeGeometryTangents,
  createSeededRng,
  mergeColoredParts,
} from './SdfVoxelPrimitives';
import type {
  FinishMode,
  LandmarkKind,
  MaterialRecipeId,
  TaggedGeometryPart,
} from './ProceduralGeometryKit';
import {
  inspectGeometryUvs,
  unwrapPixelAligned,
  type UnwrappedAtlasResult,
  type UnwrapOptions,
  type UvDiagnosticsReport,
  type UvIslandMeta,
} from './PixelUvUnwrapper';
import {
  bake3DCurvatureToUvIslands,
  bakeVertexAoAndCreases,
  subdivideForAo,
} from './VertexAndTexelBaker';

export interface SynthesizedMaterialTextures {
  albedoMap: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
  aoMap: THREE.DataTexture;
  metalnessMap: THREE.DataTexture;
  emissionMap: THREE.DataTexture | null;
  hasEmission: boolean;
  texWidth: number;
  texHeight: number;
  dilationPx?: number;
  quality: TextureQualityMetrics;
  dispose: () => void;
}

export interface SynthMaterialOptions {
  seed?: number;
  gtaoStrength?: number;
  gtaoRadiusPx?: number;
  normalStrength?: number;
  curvatureMap?: Float32Array | null;
  rarityTier?: 'normal' | 'common' | 'rare' | 'epic' | 'legendary';
  eyeHex?: string;
  eyeGlowHex?: string | null;
  browHex?: string;
  emblemHex?: string;
  emissiveRuneHex?: string | null;
  usePool?: boolean;
  cacheKey?: string;
  /** Default false: uses smooth trilinear Hi-Fi sampling; set true for retro NearestFilter */
  pixelArtSampling?: boolean;
  /** Minimum UV island edge dilation margin in pixels (default 4) */
  dilationPx?: number;
}

export interface TextureQualityMetrics {
  islandsEvaluated: number;
  meanEntropy: number;
  medianUniqueColors: number;
  flatFacesPercent: number;
  meanEdgeChangePercent: number;
}

// ---------------------------------------------------------------------------
// Bounded Texture Bundle Pool (prevents GPU texture leaks across interactive UI switches)
// ---------------------------------------------------------------------------

const MAX_POOLED_BUNDLES = 256;
const MATERIAL_TEXTURE_POOL = new Map<string, SynthesizedMaterialTextures>();
const MAX_POOLED_BAKED_ASSETS = 192;
const BAKED_ASSET_POOL = new Map<string, BakedAssetResult>();

function markTexturePooling(tex: THREE.DataTexture, pooled: boolean): void {
  tex.userData = { ...tex.userData, pooled };
}

function disposeBundleTextures(bundle: SynthesizedMaterialTextures): void {
  bundle.albedoMap.dispose();
  bundle.normalMap.dispose();
  bundle.roughnessMap.dispose();
  bundle.aoMap.dispose();
  bundle.metalnessMap.dispose();
  bundle.emissionMap?.dispose();
}

export function acquirePooledMaterialTextures(
  cacheKey: string,
  factory: () => SynthesizedMaterialTextures
): SynthesizedMaterialTextures {
  const existing = MATERIAL_TEXTURE_POOL.get(cacheKey);
  if (existing) {
    // Refresh LRU position
    MATERIAL_TEXTURE_POOL.delete(cacheKey);
    MATERIAL_TEXTURE_POOL.set(cacheKey, existing);
    return existing;
  }

  const created = factory();
  markTexturePooling(created.albedoMap, true);
  markTexturePooling(created.normalMap, true);
  markTexturePooling(created.roughnessMap, true);
  markTexturePooling(created.aoMap, true);
  markTexturePooling(created.metalnessMap, true);
  if (created.emissionMap) markTexturePooling(created.emissionMap, true);

  MATERIAL_TEXTURE_POOL.set(cacheKey, created);
  if (MATERIAL_TEXTURE_POOL.size > MAX_POOLED_BUNDLES) {
    const oldestKey = MATERIAL_TEXTURE_POOL.keys().next().value;
    if (oldestKey !== undefined) {
      const oldest = MATERIAL_TEXTURE_POOL.get(oldestKey);
      MATERIAL_TEXTURE_POOL.delete(oldestKey);
      if (oldest) {
        disposeBundleTextures(oldest);
      }
    }
  }
  return created;
}

export function clearPooledMaterialTextures(): void {
  for (const bundle of MATERIAL_TEXTURE_POOL.values()) {
    disposeBundleTextures(bundle);
  }
  MATERIAL_TEXTURE_POOL.clear();
  for (const asset of BAKED_ASSET_POOL.values()) {
    asset.geometry.dispose();
  }
  BAKED_ASSET_POOL.clear();
}

// ---------------------------------------------------------------------------
// Color, Hue-Shifted Stylized Shading, Spatial Hash & 2-Pass EDT Dilation
// ---------------------------------------------------------------------------

function clampByte(v: number, lo = 12, hi = 246): number {
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hexToRgb255(hex: string): [number, number, number] {
  const c = new THREE.Color(hex);
  const srgb = new THREE.Color();
  c.getRGB(srgb, THREE.SRGBColorSpace);
  return [
    clampByte(srgb.r * 255, 10, 246),
    clampByte(srgb.g * 255, 10, 246),
    clampByte(srgb.b * 255, 10, 246),
  ];
}

/**
 * Stylized hue-shifted tone variation: shadows shift slightly cooler toward indigo/plum,
 * highlights desaturate smoothly toward clean ivory-gold, never hitting pure 0 or 255.
 */
function shadeHueShiftRgb(
  base: [number, number, number],
  delta: number
): [number, number, number] {
  let r = base[0];
  let g = base[1];
  let b = base[2];
  if (delta >= 0) {
    const t = Math.min(0.48, delta);
    r = r + (242 - r) * t;
    g = g + (238 - g) * t * 0.96;
    b = b + (228 - b) * t * 0.88;
  } else {
    const t = Math.min(0.65, -delta);
    r = r * (1 - t * 0.78) + 32 * t;
    g = g * (1 - t * 0.82) + 28 * t;
    b = b * (1 - t * 0.64) + 50 * t;
  }
  return [clampByte(r, 14, 244), clampByte(g, 14, 244), clampByte(b, 14, 244)];
}

/**
 * Anime/Stylized Skin & Warm Organic Shading (reverse-engineered from Reze body1):
 * - Shadows boost saturation and shift hue toward warm peach/coral/rose
 * - Highlights desaturate and lift smoothly toward clean cool rose-ivory
 */
function shadeWarmSkinRgb(
  base: [number, number, number],
  delta: number,
  warmShadowTarget: [number, number, number] = [208, 112, 116]
): [number, number, number] {
  if (delta >= 0) {
    const t = Math.min(0.48, delta);
    return [
      clampByte(base[0] + (250 - base[0]) * t, 16, 246),
      clampByte(base[1] + (226 - base[1]) * t * 0.96, 16, 246),
      clampByte(base[2] + (220 - base[2]) * t * 0.92, 16, 246),
    ];
  }
  const t = Math.min(0.7, -delta);
  const satWarm = mixRgb(base, warmShadowTarget, t * 0.62);
  const darkScale = 1 - t * 0.24;
  return [
    clampByte(satWarm[0] * darkScale + warmShadowTarget[0] * t * 0.08, 18, 244),
    clampByte(satWarm[1] * darkScale + warmShadowTarget[1] * t * 0.04, 18, 244),
    clampByte(satWarm[2] * darkScale + warmShadowTarget[2] * t * 0.05, 18, 244),
  ];
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const k = clamp01(t);
  return [
    Math.round(a[0] * (1 - k) + b[0] * k),
    Math.round(a[1] * (1 - k) + b[1] * k),
    Math.round(a[2] * (1 - k) + b[2] * k),
  ];
}

function hash2d(x: number, y: number, seed: number): number {
  let n = (x * 374761393 + y * 668265263 + seed * 1597334677) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function smoothNoise2d(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2d(xi, yi, seed);
  const b = hash2d(xi + 1, yi, seed);
  const c = hash2d(xi, yi + 1, seed);
  const d = hash2d(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Exact 1D Felzenszwalb squared-distance envelope transform used to compute nearest covered
 * island texel across the full atlas (adapted from topotopo texture.ts).
 */
function edt1d(
  f: Float64Array,
  n: number,
  outDist: Float64Array,
  outSrc: Int32Array
): void {
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  let k = 0;
  v[0] = 0;
  z[0] = -1e18;
  z[1] = 1e18;

  for (let q = 1; q < n; q++) {
    let s = 0;
    while (k >= 0) {
      const r = v[k];
      s = (f[q] + q * q - (f[r] + r * r)) / (2 * q - 2 * r);
      if (s > z[k]) break;
      k--;
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = 1e18;
  }

  let cursor = 0;
  for (let q = 0; q < n; q++) {
    while (z[cursor + 1] < q) cursor++;
    const r = v[cursor];
    outDist[q] = (q - r) * (q - r) + f[r];
    outSrc[q] = r;
  }
}

export function dilateAtlasByEdt(
  mask: Uint8Array,
  width: number,
  height: number,
  albedoRgba: Uint8Array,
  normalRgba: Uint8Array,
  emissionRgba: Uint8Array | null,
  roughnessRgba?: Uint8Array | null,
  aoRgba?: Uint8Array | null,
  metalnessRgba?: Uint8Array | null,
  preserveAlpha = false
): void {
  const n = width * height;
  const maxDim = Math.max(width, height);
  const inf = 1e12;

  const colDist = new Float32Array(n);
  const colBestY = new Int32Array(n);
  const nearestSrc = new Int32Array(n);

  const fCol = new Float64Array(height);
  const dCol = new Float64Array(height);
  const sCol = new Int32Array(height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      fCol[y] = mask[y * width + x] ? 0 : inf;
    }
    edt1d(fCol, height, dCol, sCol);
    for (let y = 0; y < height; y++) {
      colDist[y * width + x] = dCol[y];
      colBestY[y * width + x] = sCol[y];
    }
  }

  const fRow = new Float64Array(width);
  const dRow = new Float64Array(width);
  const sRow = new Int32Array(width);
  for (let y = 0; y < height; y++) {
    const base = y * width;
    for (let x = 0; x < width; x++) fRow[x] = colDist[base + x];
    edt1d(fRow, width, dRow, sRow);
    for (let x = 0; x < width; x++) {
      const bestX = Math.max(0, Math.min(width - 1, sRow[x]));
      const bestY = Math.max(0, Math.min(height - 1, colBestY[y * width + bestX]));
      nearestSrc[base + x] = bestY * width + bestX;
    }
  }

  const copyAlbedo = albedoRgba.slice();
  const copyNormal = normalRgba.slice();
  const copyEmission = emissionRgba ? emissionRgba.slice() : null;
  const copyRough = roughnessRgba ? roughnessRgba.slice() : null;
  const copyAo = aoRgba ? aoRgba.slice() : null;
  const copyMetal = metalnessRgba ? metalnessRgba.slice() : null;

  for (let i = 0; i < n; i++) {
    if (mask[i]) continue;
    const src = nearestSrc[i];
    if (!mask[src] || maxDim <= 0) continue;
    const s4 = src * 4;
    const d4 = i * 4;
    albedoRgba[d4 + 0] = copyAlbedo[s4 + 0];
    albedoRgba[d4 + 1] = copyAlbedo[s4 + 1];
    albedoRgba[d4 + 2] = copyAlbedo[s4 + 2];
    if (!preserveAlpha) {
      albedoRgba[d4 + 3] = 255;
    }

    normalRgba[d4 + 0] = copyNormal[s4 + 0];
    normalRgba[d4 + 1] = copyNormal[s4 + 1];
    normalRgba[d4 + 2] = copyNormal[s4 + 2];
    normalRgba[d4 + 3] = 255;

    if (roughnessRgba && copyRough) {
      roughnessRgba[d4 + 0] = copyRough[s4 + 0];
      roughnessRgba[d4 + 1] = copyRough[s4 + 1];
      roughnessRgba[d4 + 2] = copyRough[s4 + 2];
      roughnessRgba[d4 + 3] = 255;
    }
    if (aoRgba && copyAo) {
      aoRgba[d4 + 0] = copyAo[s4 + 0];
      aoRgba[d4 + 1] = copyAo[s4 + 1];
      aoRgba[d4 + 2] = copyAo[s4 + 2];
      aoRgba[d4 + 3] = 255;
    }
    if (metalnessRgba && copyMetal) {
      metalnessRgba[d4 + 0] = copyMetal[s4 + 0];
      metalnessRgba[d4 + 1] = copyMetal[s4 + 1];
      metalnessRgba[d4 + 2] = copyMetal[s4 + 2];
      metalnessRgba[d4 + 3] = 255;
    }
    if (emissionRgba && copyEmission) {
      emissionRgba[d4 + 0] = copyEmission[s4 + 0];
      emissionRgba[d4 + 1] = copyEmission[s4 + 1];
      emissionRgba[d4 + 2] = copyEmission[s4 + 2];
      emissionRgba[d4 + 3] = 255;
    }
  }
}

// ---------------------------------------------------------------------------
// Sobel Height -> Tangent-Space OpenGL Normal Map (Hi-Fi 3D Calibrated)
// ---------------------------------------------------------------------------

function getRecipeNormalGain(materialKind: MaterialRecipeId): { gain: number; maxSlope: number } {
  switch (materialKind) {
    case 'dragon_scales':
      // Matches Black Dragon Dragon_Nor.jpg (~9-18 deg median, ~33 deg scale overlap lips)
      return { gain: 1.55, maxSlope: 0.62 };
    case 'wing_membrane':
    case 'muscle_hide':
    case 'stitched_leather':
    case 'stone_masonry':
    case 'mossy_cobble':
    case 'roof_shingle':
    case 'wood_planks':
    case 'timber_frame':
    case 'magma_obsidian':
      return { gain: 1.05, maxSlope: 0.44 };
    case 'forged_steel':
    case 'brushed_gold':
    case 'rarity_armor':
      return { gain: 0.9, maxSlope: 0.36 };
    case 'human_skin':
    case 'goblin_skin':
    case 'woven_cloth':
    case 'plaster_wall':
    case 'water_pool':
      // Matches free_base_mesh subtle OpenGL normals (~2.5-5 deg tilt, smooth skin/cloth)
      return { gain: 0.38, maxSlope: 0.22 };
    default:
      return { gain: 0.75, maxSlope: 0.32 };
  }
}

function computeIslandNormalsFromHeight(
  heightField: Float32Array,
  coverageMask: Uint8Array,
  width: number,
  height: number,
  islands: Pick<UvIslandMeta, 'pxBounds' | 'materialKind'>[],
  normalStrength: number
): Uint8Array {
  const out = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4 + 0] = 128;
    out[i * 4 + 1] = 128;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = 255;
  }

  const baseStrength = Math.max(0, Math.min(1.5, normalStrength)) * 0.95;
  if (baseStrength <= 1e-4) return out;

  for (const isl of islands) {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(width - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(height - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    const { gain, maxSlope } = getRecipeNormalGain(isl.materialKind);
    const strength = baseStrength * gain;

    for (let y = y0; y <= y1; y++) {
      const ym = Math.max(y0, y - 1);
      const yp = Math.min(y1, y + 1);
      for (let x = x0; x <= x1; x++) {
        const idx = y * width + x;
        if (!coverageMask[idx]) continue;
        const xm = Math.max(x0, x - 1);
        const xp = Math.min(x1, x + 1);

        // 3x3 Sobel gradients on island-clamped heightfield (OpenGL +X right, +Y up)
        const tl = heightField[yp * width + xm];
        const tc = heightField[yp * width + x];
        const tr = heightField[yp * width + xp];
        const ml = heightField[y * width + xm];
        const mr = heightField[y * width + xp];
        const bl = heightField[ym * width + xm];
        const bc = heightField[ym * width + x];
        const br = heightField[ym * width + xp];

        const dhdu = (tr + 2 * mr + br - (tl + 2 * ml + bl)) * 0.25;
        const dhdv = (tl + 2 * tc + tr - (bl + 2 * bc + br)) * 0.25;

        let nx = Math.max(-maxSlope, Math.min(maxSlope, -dhdu * strength));
        let ny = Math.max(-maxSlope, Math.min(maxSlope, -dhdv * strength));
        const nz = 1.0;
        const inv = 1 / Math.hypot(nx, ny, nz);
        nx *= inv;
        ny *= inv;
        const nzUnit = nz * inv;

        const o4 = idx * 4;
        out[o4 + 0] = Math.max(0, Math.min(255, Math.round((nx * 0.5 + 0.5) * 255)));
        out[o4 + 1] = Math.max(0, Math.min(255, Math.round((ny * 0.5 + 0.5) * 255)));
        out[o4 + 2] = Math.max(0, Math.min(255, Math.round((nzUnit * 0.5 + 0.5) * 255)));
        out[o4 + 3] = 255;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Material Recipe Pattern Generators (Hi-Fi Stylized, Zero Speckled Noise)
// ---------------------------------------------------------------------------

interface TexelSample {
  rgb: [number, number, number];
  height: number;
  roughness: number;
  metalness: number;
  emissiveRgb?: [number, number, number];
}

function sampleMaterialRecipe(
  recipe: MaterialRecipeId,
  lx: number,
  ly: number,
  w: number,
  h: number,
  baseRgb: [number, number, number],
  accentRgb: [number, number, number],
  seed: number,
  rarityTier: NonNullable<SynthMaterialOptions['rarityTier']>
): TexelSample {
  const u = w > 1 ? lx / (w - 1) : 0.5;
  const v = h > 1 ? ly / (h - 1) : 0.5;
  const minDim = Math.min(w, h);
  const borderPx = minDim >= 44 ? 2 : 1;
  const onPerimeter = lx < borderPx || ly < borderPx || lx >= w - borderPx || ly >= h - borderPx;
  const gradV = (v - 0.5) * 0.24;
  const gradU = (u - 0.5) * 0.08;
  const silverTrim: [number, number, number] = [224, 230, 238];
  const steelTrim: [number, number, number] = [184, 192, 214];
  const crimsonAccent: [number, number, number] = [184, 38, 48];
  const brassAccent: [number, number, number] = [216, 170, 74];

  switch (recipe) {
    case 'stone_masonry':
    case 'mossy_cobble': {
      const tinyTrim = w <= 6 || h <= 6;
      if (tinyTrim) {
        const slope = (u - 0.5) * 0.14 + (v - 0.5) * 0.22;
        let rgb = shadeHueShiftRgb(baseRgb, slope);
        let heightVal = 0.68 + slope * 0.3;
        let rough = 0.80;
        if (recipe === 'mossy_cobble' && (ly === 0 || (lx === 0 && seed % 2 === 0))) {
          rgb = mixRgb(rgb, accentRgb, 0.55);
          heightVal += 0.06;
          rough = 0.88;
        }
        return { rgb, height: heightVal, roughness: rough, metalness: 0.0 };
      }
      const rowH = Math.max(5, Math.min(16, Math.round(h / Math.max(2, Math.round(h / 10)))));
      const colW = Math.max(6, Math.min(24, Math.round(w / Math.max(2, Math.round(w / 14)))));
      const brickRow = Math.floor(ly / rowH);
      const staggerX = (brickRow % 2) * Math.floor(colW * 0.5);
      const bx = (lx + staggerX) % colW;
      const by = ly % rowH;
      const brickCol = Math.floor((lx + staggerX) / colW);
      const mortarW = minDim >= 40 ? 2 : 1;
      const mortar = bx < mortarW || by < mortarW;
      const brickId = hash2d(brickCol, brickRow, seed);

      // Smooth macro weathering + clean stylized stone blocks
      const macroWeather = (smoothNoise2d(u * 4.5, v * 4.5, seed + 41) - 0.5) * 0.09;
      const bevelBand = by === rowH - 1 ? 0.07 : by === mortarW ? -0.04 : 0;
      const brickTilt = ((bx / Math.max(1, colW - 1)) - 0.5) * 0.05;
      const brickDelta = (brickId - 0.5) * 0.12 + bevelBand + brickTilt + macroWeather + gradV * 0.35 + gradU;

      let rgb = mortar
        ? shadeHueShiftRgb(baseRgb, -0.22 + macroWeather * 0.3)
        : shadeHueShiftRgb(baseRgb, brickDelta);
      let heightVal = mortar ? 0.28 : 0.70 + (brickId - 0.5) * 0.08 + bevelBand * 0.6;
      let rough = mortar ? 0.92 : 0.76 + (brickId - 0.5) * 0.08;

      const mossPatch = smoothNoise2d(u * 5.2, v * 5.2, seed + 71);
      if (recipe === 'mossy_cobble') {
        const mossBlend = smoothstep(0.45, 0.72, mossPatch) * (v < 0.45 ? 0.75 : mortar ? 0.65 : 0.25);
        if (mossBlend > 0.01) {
          rgb = mixRgb(rgb, accentRgb, mossBlend);
          heightVal += mossBlend * 0.05;
          rough = rough * (1 - mossBlend) + 0.90 * mossBlend;
        }
      } else if (v < 0.24 && mossPatch > 0.5) {
        const damp = (0.24 - v) / 0.24;
        rgb = shadeHueShiftRgb(rgb, -0.10 * damp);
        rough -= damp * 0.12;
      }
      return { rgb, height: heightVal, roughness: clamp01(rough), metalness: 0.0 };
    }

    case 'wood_planks':
    case 'timber_frame': {
      // Painterly Bark (Jabami tron_tree_remast_tex.png): ~13:1..20:1 vertical brushstroke anisotropy
      const plankW = Math.max(6, Math.min(20, Math.round(w / Math.max(2, Math.round(w / 14)))));
      const plankIdx = Math.floor(lx / plankW);
      const seamW = w >= 40 ? 2 : 1;
      const seam = w >= 12 && lx % plankW < seamW;
      const strokeA = smoothNoise2d(lx * 0.18, ly * 0.014, seed + 11) - 0.5;
      const strokeB = smoothNoise2d(lx * 0.38 + 4.7, ly * 0.028, seed + 29) - 0.5;
      const barkFlow = strokeA * 0.26 + strokeB * 0.14;
      const plankVar = (hash2d(plankIdx, 19, seed) - 0.5) * 0.08;
      const mossMask = smoothNoise2d(u * 3.8, v * 2.2, seed + 53);
      const warmShadow: [number, number, number] = [48, 30, 22];
      const bottomOcc = v < 0.30 ? (0.30 - v) / 0.30 : 0;

      if (seam) {
        return {
          rgb: shadeHueShiftRgb(baseRgb, -0.22 + barkFlow * 0.2),
          height: 0.34,
          roughness: 0.88,
          metalness: 0.0,
        };
      }

      let rgb = shadeHueShiftRgb(baseRgb, plankVar + barkFlow + gradV * 0.36 + gradU * 0.6);
      if (mossMask > 0.56) {
        rgb = mixRgb(rgb, accentRgb, Math.min(0.48, (mossMask - 0.56) * 0.95));
      }
      if (bottomOcc > 0) {
        rgb = mixRgb(rgb, warmShadow, bottomOcc * 0.28);
      }
      return {
        rgb,
        height: 0.58 + barkFlow * 0.45,
        roughness: clamp01(0.76 - barkFlow * 0.14),
        metalness: 0.0,
      };
    }

    case 'roof_shingle': {
      if (w <= 6 || h <= 6) {
        const slope = (u * 0.35 + v * 0.65 - 0.45) * 0.26;
        return {
          rgb: shadeHueShiftRgb(baseRgb, slope),
          height: 0.62 + slope * 0.35,
          roughness: 0.78,
          metalness: 0.0,
        };
      }
      const courseH = Math.max(5, Math.min(14, Math.round(h / Math.max(2, Math.round(h / 9)))));
      const tileW = Math.max(5, Math.min(16, Math.round(w / Math.max(2, Math.round(w / 10)))));
      const row = Math.floor(ly / courseH);
      const stag = (row % 2) * Math.floor(tileW * 0.5);
      const col = Math.floor((lx + stag) / tileW);
      const localY = ly % courseH;
      const localX = (lx + stag) % tileW;
      const shadowLip = localY === 0;
      const lipBevel = localY === 1;
      const topRidge = localY === courseH - 1;
      const vEdge = localX === 0;
      const idVar = (hash2d(col, row, seed + 33) - 0.5) * 0.16;
      const mossLichen = smoothNoise2d(u * 5.0, v * 5.0, seed + 89);
      const slopeShade = (v - 0.3) * 0.18 + gradU + (topRidge ? 0.08 : 0) + (lipBevel ? 0.10 : 0);
      let rgb = shadowLip
        ? shadeHueShiftRgb(baseRgb, -0.26)
        : vEdge
          ? shadeHueShiftRgb(baseRgb, -0.14)
          : shadeHueShiftRgb(baseRgb, idVar + slopeShade);
      let rough = shadowLip ? 0.90 : 0.76 + (hash2d(col, row, seed + 5) - 0.5) * 0.08;
      if (!shadowLip && mossLichen > 0.65 && v < 0.68) {
        rgb = mixRgb(rgb, accentRgb, 0.38);
        rough = 0.88;
      }
      const stepSlope = (localY / Math.max(1, courseH - 1)) * 0.35;
      return {
        rgb,
        height: shadowLip ? 0.28 : 0.56 + stepSlope,
        roughness: clamp01(rough),
        metalness: 0.0,
      };
    }

    case 'plaster_wall': {
      const macro = smoothNoise2d(u * 4.2, v * 4.2, seed + 19) - 0.5;
      const dampBase = v < 0.3 ? (0.3 - v) * -0.38 : 0;
      const trimEdge = onPerimeter && w >= 8 && h >= 8;
      const innerInset = borderPx;
      const innerBevel =
        !trimEdge &&
        (lx === innerInset || lx === w - 1 - innerInset || ly === innerInset || ly === h - 1 - innerInset) &&
        w >= 12 &&
        h >= 12;
      const diagBevel = gradU + gradV * 0.45;
      const rgb = trimEdge
        ? shadeHueShiftRgb(accentRgb, -0.10 + gradU)
        : innerBevel
          ? shadeHueShiftRgb(baseRgb, 0.12 + gradU)
          : shadeHueShiftRgb(baseRgb, macro * 0.16 + dampBase + diagBevel);
      return {
        rgb,
        height: trimEdge ? 0.84 : innerBevel ? 0.74 : 0.62 + macro * 0.10,
        roughness: trimEdge ? 0.72 : 0.84 - macro * 0.06,
        metalness: 0.0,
      };
    }

    case 'forged_steel':
    case 'brushed_gold':
    case 'rarity_armor': {
      // Stylized Multi-Stop Metallic Specular Bands + Directional Anisotropy + Seam Linework + Rivets + Wear Highlights
      const diagCoord = v * 0.78 + u * 0.26;
      const primarySpecBand = Math.exp(-Math.pow((diagCoord - 0.72) * 3.4, 2)) * 0.22;
      const secondaryBounce = Math.exp(-Math.pow((v - 0.24) * 4.5, 2)) * 0.08;
      const brushedStreak = (smoothNoise2d(u * 2.8, v * 26.0, seed + 41) - 0.5) * 0.06;
      const warmShadow: [number, number, number] = [48, 30, 26];
      const bottomOcc = v < 0.30 ? (0.30 - v) / 0.30 : 0;

      const rimWidth = minDim >= 40 ? 2 : 1;
      const seamDist = rimWidth + 2;
      const isTrimRim = onPerimeter && w >= 10 && h >= 10;
      const isWearHighlight =
        !isTrimRim &&
        (lx === rimWidth || lx === w - 1 - rimWidth || ly === h - 1 - rimWidth) &&
        w >= 14 &&
        h >= 14;
      const isPlateSeam =
        !isTrimRim &&
        (lx === seamDist || lx === w - 1 - seamDist || ly === seamDist || ly === h - 1 - seamDist) &&
        w >= 18 &&
        h >= 18;

      let rgb = shadeHueShiftRgb(
        baseRgb,
        gradV * 0.55 + gradU + primarySpecBand + secondaryBounce + brushedStreak
      );
      if (bottomOcc > 0) {
        rgb = mixRgb(rgb, warmShadow, bottomOcc * 0.22);
      }
      let heightVal = 0.62 + primarySpecBand * 0.2 + brushedStreak * 0.25;
      let rough = 0.28 - primarySpecBand * 0.25 + (brushedStreak * 0.4);
      let metal = recipe === 'brushed_gold' ? 0.92 : 0.86;
      let emissiveRgb: [number, number, number] | undefined;

      if (isTrimRim) {
        const trimBase =
          recipe === 'brushed_gold'
            ? mixRgb(accentRgb, silverTrim, 0.38)
            : recipe === 'rarity_armor'
              ? mixRgb(accentRgb, silverTrim, 0.45)
              : mixRgb(baseRgb, steelTrim, 0.50);
        rgb = shadeHueShiftRgb(trimBase, 0.14 + primarySpecBand * 0.4 + gradU);
        heightVal = 0.80;
        rough = 0.20;
        metal = 0.92;
      } else if (isWearHighlight) {
        rgb = shadeHueShiftRgb(mixRgb(baseRgb, silverTrim, 0.35), 0.16);
        heightVal = 0.72;
        rough = 0.22;
      } else if (isPlateSeam) {
        const grooveAccent =
          recipe === 'rarity_armor' && rarityTier === 'epic'
            ? mixRgb(baseRgb, crimsonAccent, 0.25)
            : baseRgb;
        rgb = shadeHueShiftRgb(grooveAccent, -0.26);
        heightVal = 0.36;
        rough = 0.54;
        metal = 0.45;
      }

      // Corner armor rivets on substantive armor plates
      if (w >= 24 && h >= 24) {
        const rOff = seamDist + 3;
        const rRad = minDim >= 48 ? 2.2 : 1.5;
        const corners = [
          [rOff, rOff],
          [w - 1 - rOff, rOff],
          [rOff, h - 1 - rOff],
          [w - 1 - rOff, h - 1 - rOff],
        ];
        for (const [rx, ry] of corners) {
          const d = Math.hypot(lx - rx, ly - ry);
          if (d <= rRad) {
            const dome = 1 - (d / rRad) * (d / rRad);
            const rivetBase = recipe === 'brushed_gold' ? silverTrim : brassAccent;
            rgb = shadeHueShiftRgb(mixRgb(baseRgb, rivetBase, 0.6), 0.18 * dome);
            heightVal = 0.72 + dome * 0.22;
            rough = 0.20;
            metal = 0.92;
            break;
          }
        }
      }

      if (
        recipe === 'rarity_armor' &&
        (rarityTier === 'rare' || rarityTier === 'epic' || rarityTier === 'legendary') &&
        w >= 16 &&
        h >= 16
      ) {
        const cx = Math.floor(w * 0.5);
        const cy = Math.floor(h * 0.5);
        const sigilSpan = Math.max(2, Math.min(5, Math.floor(minDim * 0.12)));
        const manhattan = Math.abs(lx - cx) + Math.abs(ly - cy);
        if (manhattan <= sigilSpan) {
          const core = manhattan <= Math.max(1, sigilSpan - 2);
          emissiveRgb = core
            ? mixRgb(accentRgb, [246, 244, 232], 0.45)
            : mixRgb(accentRgb, [224, 232, 244], 0.2);
          rgb = emissiveRgb;
          heightVal = 0.88;
          rough = 0.18;
        }
      }
      return {
        rgb,
        height: heightVal,
        roughness: clamp01(rough),
        metalness: clamp01(metal),
        emissiveRgb,
      };
    }

    case 'stitched_leather':
    case 'woven_cloth': {
      // Multi-stop Stylized Gradient + Directional Painted Fabric Folds (Dress_Base_color) + Crisp 1-2px Seams
      const isCloth = recipe === 'woven_cloth';
      const warmShadow: [number, number, number] = isCloth ? [42, 30, 44] : [54, 30, 22];
      const bottomOcc = v < 0.32 ? (0.32 - v) / 0.32 : 0;

      // Smooth directional catenary folds (zero speckled noise)
      const foldPhase = (u * 3.6 + v * 1.15 + Math.sin(v * 3.8 + u * 1.2) * 0.35) * Math.PI;
      const foldWave = Math.sin(foldPhase) * 0.72 + Math.sin((u * 6.4 - v * 2.0) * Math.PI) * 0.28;
      const foldAmp = isCloth ? 0.14 : 0.065;
      const softGrain = isCloth ? 0 : (smoothNoise2d(u * 5.0, v * 5.0, seed + 61) - 0.5) * 0.05;
      const paintedFold = foldWave * foldAmp + softGrain;

      const rimW = minDim >= 44 ? 2 : 1;
      const isHemTrim = onPerimeter && w >= 10 && h >= 10;
      const stitchInset = rimW + 2;
      const onStitchLine =
        w >= 14 &&
        h >= 14 &&
        (lx === stitchInset ||
          lx === w - 1 - stitchInset ||
          ly === stitchInset ||
          ly === h - 1 - stitchInset);
      const isStitchDash = onStitchLine && ((lx + ly) % 4 < 2);
      const isDarkSeam =
        w >= 16 &&
        h >= 16 &&
        !isHemTrim &&
        (lx === rimW || lx === w - 1 - rimW || ly === rimW || ly === h - 1 - rimW);

      if (isHemTrim) {
        const hemCol = isCloth ? mixRgb(accentRgb, crimsonAccent, 0.22) : shadeHueShiftRgb(accentRgb, -0.14);
        return {
          rgb: shadeHueShiftRgb(hemCol, gradU + (v - 0.5) * 0.12),
          height: 0.72,
          roughness: isCloth ? 0.68 : 0.62,
          metalness: 0.0,
        };
      }
      if (isDarkSeam) {
        return {
          rgb: shadeHueShiftRgb(baseRgb, -0.32),
          height: 0.40,
          roughness: 0.86,
          metalness: 0.0,
        };
      }
      if (isStitchDash) {
        const stitchCol = isCloth
          ? mixRgb(accentRgb, silverTrim, 0.32)
          : mixRgb(accentRgb, brassAccent, 0.42);
        return {
          rgb: shadeHueShiftRgb(stitchCol, 0.14),
          height: 0.78,
          roughness: isCloth ? 0.62 : 0.55,
          metalness: 0.0,
        };
      }

      // Corner brass rivets on leather panels
      if (!isCloth && w >= 24 && h >= 24) {
        const rOff = stitchInset + 3;
        const rRad = minDim >= 48 ? 2.0 : 1.4;
        const corners = [
          [rOff, rOff],
          [w - 1 - rOff, rOff],
          [rOff, h - 1 - rOff],
          [w - 1 - rOff, h - 1 - rOff],
        ];
        for (const [rx, ry] of corners) {
          const d = Math.hypot(lx - rx, ly - ry);
          if (d <= rRad) {
            const dome = 1 - (d / rRad) * (d / rRad);
            return {
              rgb: shadeHueShiftRgb(brassAccent, 0.18 * dome),
              height: 0.76 + dome * 0.20,
              roughness: 0.26,
              metalness: 0.88,
            };
          }
        }
      }

      let rgb = shadeHueShiftRgb(baseRgb, paintedFold + gradV * 0.44 + gradU);
      if (bottomOcc > 0) {
        rgb = mixRgb(rgb, warmShadow, bottomOcc * 0.25);
      }
      return {
        rgb,
        height: 0.58 + paintedFold * 0.85,
        roughness: clamp01((isCloth ? 0.82 : 0.58) - foldWave * 0.06),
        metalness: 0.0,
      };
    }

    case 'human_skin':
    case 'goblin_skin':
    case 'orc_hide':
    case 'demon_hide': {
      // Reverse-engineered Reze Anime/Stylized Skin: zero speckled noise, warm coral/peach shadows, desaturated cool highlights
      const subsurface = (smoothNoise2d(u * 2.4, v * 2.4, seed + 93) - 0.5) * 0.10;
      const radialWarmth = Math.exp(-((u - 0.5) * (u - 0.5) + (v - 0.55) * (v - 0.55)) * 3.2) * 0.08;
      const contour =
        recipe === 'demon_hide' || recipe === 'orc_hide'
          ? Math.sin((u * 2.6 + v * 0.6) * Math.PI) * 0.075
          : 0;
      const delta = subsurface + radialWarmth + contour + gradV * 0.65 + gradU;
      const warmTarget: [number, number, number] =
        recipe === 'human_skin'
          ? [212, 116, 120]
          : recipe === 'goblin_skin'
            ? [76, 98, 52]
            : recipe === 'orc_hide'
              ? [84, 86, 48]
              : [128, 46, 48];
      let rgb = shadeWarmSkinRgb(baseRgb, delta, warmTarget);
      if (v < 0.34) {
        const occ = (0.34 - v) / 0.34;
        rgb = mixRgb(rgb, warmTarget, occ * 0.24);
      }
      return {
        rgb,
        height: 0.62 + subsurface * 0.25 + radialWarmth * 0.4 + contour * 0.5,
        roughness: clamp01(0.60 - radialWarmth * 0.6 - gradV * 0.12),
        metalness: 0.0,
      };
    }

    case 'dragon_scales': {
      // Imbricated overlapping teardrop/shield scale heightfield (Black Dragon Dragon_Nor.jpg regime)
      const scaleW = Math.max(5, Math.min(14, Math.round(minDim / 6.5)));
      const scaleH = Math.max(5, Math.round(scaleW * 1.12));
      const baseRow = Math.floor(ly / scaleH);

      let bestHeight = 0;
      let bestR2 = 1.0;
      let bestDx = 0;
      let bestId = 0.5;
      let bestRowBias = -1;

      // Evaluate current row and upper overlapping row (flipY=false => higher row overlaps lower)
      for (let rOff = 0; rOff <= 1; rOff++) {
        const row = baseRow + rOff;
        const stag = (row % 2) * scaleW * 0.5;
        const baseCol = Math.floor((lx + stag) / scaleW);
        for (let cOff = -1; cOff <= 1; cOff++) {
          const col = baseCol + cOff;
          const cx = col * scaleW + scaleW * 0.5 - stag;
          const cy = row * scaleH + scaleH * 0.5;
          const dx = (lx - cx) / (scaleW * 0.58);
          const dy = (ly - cy) / (scaleH * 0.64);
          // Pointed teardrop shield profile (narrower toward bottom overlap tip, fuller at base)
          const yScale = dy < 0 ? 0.85 : 1.32;
          const r2 = dx * dx * 1.15 + (dy - 0.06) * (dy - 0.06) * yScale;
          if (r2 < 1.0) {
            const keel = Math.max(0, 1 - Math.abs(dx) * 3.1) * 0.22 * (1 - r2);
            const dome = Math.pow(1 - r2, 0.72) * 0.78 + keel;
            if (row > bestRowBias || (row === bestRowBias && dome > bestHeight)) {
              bestRowBias = row;
              bestHeight = dome;
              bestR2 = r2;
              bestDx = dx;
              bestId = hash2d(col, row, seed + 211);
            }
          }
        }
      }

      const lipCrevice = smoothstep(0.68, 1.0, bestR2);
      const keelCatch = Math.max(0, 1 - Math.abs(bestDx) * 3.5) * (1 - lipCrevice) * 0.16;
      const jitter = (bestId - 0.5) * 0.14;
      const toneDelta = (bestHeight - 0.42) * 0.36 + keelCatch - lipCrevice * 0.28 + jitter + gradV * 0.48 + gradU;

      return {
        rgb: shadeHueShiftRgb(baseRgb, toneDelta),
        height: 0.22 + bestHeight * 0.72,
        roughness: clamp01(0.36 + lipCrevice * 0.34 - keelCatch * 0.3),
        metalness: 0.06,
      };
    }

    case 'wing_membrane': {
      // Translucent-feeling veined patagium with subsurface center warmth + raised vascular ribs
      const warp = (smoothNoise2d(u * 3.8, v * 3.8, seed + 307) - 0.5) * 0.42;
      const ribA = Math.abs(Math.sin((u * 3.6 + v * 0.7 + warp) * Math.PI));
      const ribB = Math.abs(Math.sin((v * 4.2 - u * 0.5 - warp * 0.8) * Math.PI));
      const veinDist = Math.min(ribA, ribB * 1.15);
      const vein = Math.pow(Math.max(0, 1 - veinDist * 4.8), 2.0);
      const centerGlow = Math.exp(-((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)) * 3.2);
      const leatherRipple = (smoothNoise2d(u * 9.0, v * 9.0, seed + 311) - 0.5) * 0.08;

      const translucentCore = mixRgb(baseRgb, accentRgb, centerGlow * 0.32);
      const webbed = mixRgb(translucentCore, shadeHueShiftRgb(accentRgb, -0.18), vein * 0.45);
      return {
        rgb: shadeHueShiftRgb(webbed, centerGlow * 0.16 + leatherRipple - vein * 0.08 + gradV * 0.32 + gradU),
        height: 0.40 + vein * 0.34 + leatherRipple * 0.3,
        roughness: clamp01(0.44 + vein * 0.18 - centerGlow * 0.08),
        metalness: 0.0,
      };
    }

    case 'muscle_hide': {
      // Smooth anatomical muscle bundle striations with warm subsurface shadow shift
      const warp = smoothNoise2d(u * 2.8, v * 2.8, seed + 401) * 1.4;
      const fiber = Math.sin((u * 4.8 + v * 0.6 + warp) * Math.PI);
      const secondary = Math.sin((v * 7.5 - u * 1.2) * Math.PI) * 0.25;
      const bundle = fiber * 0.78 + secondary * 0.22;
      return {
        rgb: shadeWarmSkinRgb(baseRgb, bundle * 0.18 + gradV * 0.48 + gradU, [126, 52, 54]),
        height: 0.52 + bundle * 0.28,
        roughness: clamp01(0.48 - bundle * 0.08),
        metalness: 0.0,
      };
    }

    case 'magma_obsidian': {
      const crackVal = Math.abs(smoothNoise2d(u * 5.2, v * 5.2, seed + 111) - 0.5);
      const isCrack = crackVal < 0.055;
      if (isCrack) {
        const heat = 1 - crackVal / 0.055;
        const glow = mixRgb(accentRgb, [252, 212, 118], 0.25 + heat * 0.45);
        return { rgb: glow, height: 0.22, roughness: 0.82, metalness: 0.0, emissiveRgb: glow };
      }
      const facet = smoothNoise2d(u * 8.0, v * 8.0, seed) - 0.5;
      return {
        rgb: shadeHueShiftRgb(baseRgb, facet * 0.20 + gradV * 0.45 + gradU),
        height: 0.78 + facet * 0.14,
        roughness: clamp01(0.32 - facet * 0.10),
        metalness: 0.12,
      };
    }

    case 'runic_glow': {
      const border = onPerimeter && w >= 6 && h >= 6;
      const glyph = ((Math.floor(u * 6) ^ Math.floor(v * 6)) % 3 === 0) && w >= 8 && h >= 8;
      const pulse = Math.exp(-((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)) * 2.5) * 0.22;
      const rgb = border
        ? shadeHueShiftRgb(accentRgb, 0.22 + gradU)
        : glyph
          ? mixRgb(baseRgb, [242, 240, 232], 0.42)
          : shadeHueShiftRgb(baseRgb, pulse + gradV * 0.38 + gradU);
      return {
        rgb,
        height: glyph ? 0.90 : 0.64,
        roughness: 0.28,
        metalness: 0.15,
        emissiveRgb: rgb,
      };
    }

    case 'bone_ivory': {
      const striation = Math.sin(u * Math.PI * 6.0 + smoothNoise2d(u * 3.0, v * 2.0, seed) * 1.8) * 0.07;
      const age = (smoothNoise2d(u * 4.0, v * 4.0, seed + 17) - 0.5) * 0.08;
      return {
        rgb: shadeHueShiftRgb(baseRgb, striation + age + gradV * 0.55 + gradU),
        height: 0.70 + striation * 0.45,
        roughness: clamp01(0.54 - gradV * 0.10),
        metalness: 0.0,
      };
    }

    case 'foliage_leaf': {
      // Jabami-inspired sculpted two-tier leaf lobe clusters (opaque for 3D canopies)
      const lobe1 = smoothNoise2d(u * 5.8, v * 5.8, seed + 21);
      const lobe2 = smoothNoise2d(u * 11.5, v * 11.5, seed + 47);
      const cluster = lobe1 * 0.72 + lobe2 * 0.28;
      const tierBlend = smoothstep(0.35, 0.75, cluster + (v - 0.5) * 0.25);
      const shadedTier = shadeHueShiftRgb(baseRgb, -0.20 + gradU);
      const sunlitTier = mixRgb(shadeHueShiftRgb(baseRgb, 0.20), accentRgb, 0.35);
      return {
        rgb: mixRgb(shadedTier, sunlitTier, tierBlend),
        height: 0.40 + cluster * 0.52,
        roughness: clamp01(0.72 - tierBlend * 0.14),
        metalness: 0.0,
      };
    }

    case 'water_pool': {
      const ripple =
        Math.sin((u * 4.5 + v * 4.5) * Math.PI) * 0.10 +
        (smoothNoise2d(u * 6.0, v * 6.0, seed) - 0.5) * 0.18;
      const foam = ripple > 0.13;
      return {
        rgb: foam
          ? mixRgb(baseRgb, [226, 244, 250], 0.55)
          : shadeHueShiftRgb(baseRgb, ripple + gradU),
        height: 0.5 + ripple * 0.3,
        roughness: foam ? 0.52 : 0.16,
        metalness: 0.05,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Semantic Landmarks (`head_front`, `chest_crest`, `door_front`, `shield_face`, `rune_panel`)
// Remember: DataTexture flipY=false -> smaller y is BOTTOM, larger y is TOP!
// ---------------------------------------------------------------------------

function applySemanticLandmark(
  isl: UvIslandMeta,
  width: number,
  heightField: Float32Array,
  albedoRgba: Uint8Array,
  emissionRgba: Uint8Array,
  opts: SynthMaterialOptions,
  roughnessField?: Float32Array
): boolean {
  if (isl.landmarkKind === 'none') return false;
  const { x: x0, y: y0, w, h } = isl.pxBounds;
  if (w < 6 || h < 6) return false;

  let wroteEmission = false;
  const setPx = (
    lx: number,
    ly: number,
    rgb: [number, number, number],
    heightVal: number,
    emitRgb?: [number, number, number],
    roughnessVal?: number
  ) => {
    if (lx < 0 || ly < 0 || lx >= w || ly >= h) return;
    const gx = x0 + lx;
    const gy = y0 + ly;
    const idx = gy * width + gx;
    const o4 = idx * 4;
    albedoRgba[o4 + 0] = clampByte(rgb[0], 14, 246);
    albedoRgba[o4 + 1] = clampByte(rgb[1], 14, 246);
    albedoRgba[o4 + 2] = clampByte(rgb[2], 14, 246);
    heightField[idx] = heightVal;
    if (roughnessField && roughnessVal !== undefined) {
      roughnessField[idx] = clamp01(roughnessVal);
    }
    if (emitRgb) {
      emissionRgba[o4 + 0] = emitRgb[0];
      emissionRgba[o4 + 1] = emitRgb[1];
      emissionRgba[o4 + 2] = emitRgb[2];
      emissionRgba[o4 + 3] = 255;
      wroteEmission = true;
    }
  };

  const blendPx = (
    lx: number,
    ly: number,
    rgb: [number, number, number],
    alpha: number,
    heightVal?: number,
    emitRgb?: [number, number, number],
    roughnessVal?: number
  ) => {
    if (lx < 0 || ly < 0 || lx >= w || ly >= h || alpha <= 0.005) return;
    const a = clamp01(alpha);
    const gx = x0 + lx;
    const gy = y0 + ly;
    const idx = gy * width + gx;
    const o4 = idx * 4;
    albedoRgba[o4 + 0] = clampByte(albedoRgba[o4 + 0] * (1 - a) + rgb[0] * a, 14, 246);
    albedoRgba[o4 + 1] = clampByte(albedoRgba[o4 + 1] * (1 - a) + rgb[1] * a, 14, 246);
    albedoRgba[o4 + 2] = clampByte(albedoRgba[o4 + 2] * (1 - a) + rgb[2] * a, 14, 246);
    if (heightVal !== undefined) {
      heightField[idx] = heightField[idx] * (1 - a) + heightVal * a;
    }
    if (roughnessField && roughnessVal !== undefined) {
      roughnessField[idx] = clamp01(roughnessField[idx] * (1 - a) + roughnessVal * a);
    }
    if (emitRgb) {
      emissionRgba[o4 + 0] = Math.round(emissionRgba[o4 + 0] * (1 - a) + emitRgb[0] * a);
      emissionRgba[o4 + 1] = Math.round(emissionRgba[o4 + 1] * (1 - a) + emitRgb[1] * a);
      emissionRgba[o4 + 2] = Math.round(emissionRgba[o4 + 2] * (1 - a) + emitRgb[2] * a);
      emissionRgba[o4 + 3] = 255;
      wroteEmission = true;
    }
  };

  if (isl.landmarkKind === 'head_front') {
    const sclera: [number, number, number] = [238, 241, 246];
    const scleraShadow: [number, number, number] = [204, 206, 222];
    const irisRgb = hexToRgb255(opts.eyeHex ?? '#2c68b8');
    const glowRgb = opts.eyeGlowHex ? hexToRgb255(opts.eyeGlowHex) : undefined;
    const browRgb = hexToRgb255(opts.browHex ?? '#2b2024');
    const skinBase = hexToRgb255(isl.baseHex);
    const blushCol: [number, number, number] = [244, 143, 158]; // #f48f9e from Reze body1

    if (w >= 20 && h >= 20) {
      const cx = (w - 1) * 0.5;
      const eyeY = h * 0.50;
      const eyeOffX = w * 0.22;
      const eyeRx = Math.max(2.4, w * 0.118);
      const eyeRy = Math.max(2.0, h * 0.095);

      // 1. Soft peach/coral cheek blush & subsurface nose warmth
      const blushY = h * 0.35;
      const blushOffX = w * 0.26;
      const blushRx = Math.max(2.0, w * 0.14);
      const blushRy = Math.max(1.5, h * 0.088);
      for (let ly = Math.max(0, Math.floor(blushY - blushRy * 2)); ly <= Math.min(h - 1, Math.ceil(blushY + blushRy * 2)); ly++) {
        for (let lx = 0; lx < w; lx++) {
          for (const side of [-1, 1]) {
            const dx = (lx - (cx + side * blushOffX)) / blushRx;
            const dy = (ly - blushY) / blushRy;
            const d2 = dx * dx + dy * dy;
            if (d2 < 2.2) {
              const weight = Math.exp(-d2 * 1.45) * 0.28;
              blendPx(lx, ly, blushCol, weight);
            }
          }
        }
      }

      // 2. Crisp stylized anime eyes (upper lash arc, shaded sclera, layered iris, pupil, specular catchlight)
      const pupilCol: [number, number, number] = [26, 20, 32];
      const upperIris = shadeHueShiftRgb(irisRgb, -0.28);
      const lowerIris = mixRgb(irisRgb, [232, 242, 252], 0.34);

      for (const side of [-1, 1]) {
        const ex = cx + side * eyeOffX;
        const xMin = Math.max(0, Math.floor(ex - eyeRx - 3));
        const xMax = Math.min(w - 1, Math.ceil(ex + eyeRx + 3));
        const yMin = Math.max(0, Math.floor(eyeY - eyeRy - 2));
        const yMax = Math.min(h - 1, Math.ceil(eyeY + eyeRy * 2.5 + 3));

        for (let ly = yMin; ly <= yMax; ly++) {
          for (let lx = xMin; lx <= xMax; lx++) {
            const dx = lx - ex;
            const dy = ly - eyeY;
            const nx = dx / eyeRx;
            const ny = dy / eyeRy;
            const eyeDist = Math.hypot(nx, ny);

            // Sclera & iris inside almond eye mask
            if (eyeDist <= 1.05) {
              const maskAlpha = 1 - smoothstep(0.86, 1.05, eyeDist);
              const ix = (dx + side * eyeRx * 0.06) / (eyeRx * 0.56);
              const iy = dy / (eyeRy * 0.88);
              const irisDist = Math.hypot(ix, iy);

              let col = ny > 0.25 ? mixRgb(sclera, scleraShadow, (ny - 0.25) * 0.9) : sclera;
              let emit: [number, number, number] | undefined;

              if (glowRgb) {
                col = irisDist < 0.45 ? mixRgb(glowRgb, [246, 244, 228], 0.45) : glowRgb;
                emit = col;
              } else if (irisDist <= 1.0) {
                const vIris = clamp01(0.5 + iy * 0.5);
                col = vIris > 0.55 ? mixRgb(irisRgb, upperIris, (vIris - 0.55) / 0.45) : mixRgb(lowerIris, irisRgb, vIris / 0.55);
                if (irisDist < 0.44) {
                  col = mixRgb(col, pupilCol, 1 - smoothstep(0.28, 0.44, irisDist));
                }
                // Crisp specular catchlight in upper-left of iris (remains legible down to 20px)
                const specD = Math.hypot(ix + 0.26, iy - 0.32);
                if (specD < 0.36) {
                  col = mixRgb(col, [250, 250, 255], 1 - smoothstep(0.14, 0.36, specD));
                }
              }

              blendPx(lx, ly, col, maskAlpha, glowRgb ? 0.86 : 0.42, emit, 0.16);
            }

            // Crisp painted upper eyeliner / lash line
            const archY = eyeY + eyeRy * (0.85 - 0.65 * Math.min(1.3, nx * nx));
            const lashThick = Math.max(0.95, eyeRy * 0.30);
            if (Math.abs(nx) <= 1.18 && Math.abs(ly - archY) <= lashThick) {
              const lashAlpha = (1 - smoothstep(lashThick * 0.45, lashThick, Math.abs(ly - archY))) * (1 - smoothstep(0.95, 1.18, Math.abs(nx)));
              blendPx(lx, ly, browRgb, lashAlpha * 0.92, 0.72, undefined, 0.48);
            }

            // Expressive tapered eyebrow arc
            const bx = dx / (eyeRx * 1.15);
            const browCenterY = eyeY + eyeRy * 1.68 + (1 - Math.min(1, bx * bx)) * eyeRy * 0.42;
            const browThick = Math.max(0.88, eyeRy * 0.25);
            if (Math.abs(bx) <= 1.05 && Math.abs(ly - browCenterY) <= browThick) {
              const browAlpha = (1 - smoothstep(browThick * 0.4, browThick, Math.abs(ly - browCenterY))) * (1 - smoothstep(0.75, 1.05, Math.abs(bx)));
              blendPx(lx, ly, browRgb, browAlpha * 0.88, 0.78, undefined, 0.62);
            }
          }
        }
      }

      // 3. Nose shadow wedge + soft coral-peach lip accent
      const noseY = Math.round(h * 0.36);
      const noseShadow = shadeWarmSkinRgb(skinBase, -0.32, [202, 108, 112]);
      const noseHi = shadeWarmSkinRgb(skinBase, 0.28);
      for (let dx = -1; dx <= 1; dx++) {
        blendPx(Math.round(cx) + dx, noseY, noseShadow, dx === 0 ? 0.55 : 0.28, 0.78);
        if (dx === 0) blendPx(Math.round(cx), noseY + 1, noseHi, 0.45, 0.82);
      }

      const mouthY = Math.max(2, Math.round(h * 0.22));
      const mouthHalf = Math.max(2, Math.round(w * 0.08));
      const lipCol = mixRgb(skinBase, [206, 98, 108], 0.62);
      for (let dx = -mouthHalf; dx <= mouthHalf; dx++) {
        const taper = 1 - Math.abs(dx) / (mouthHalf + 1);
        blendPx(Math.round(cx) + dx, mouthY, lipCol, 0.78 * taper, 0.48, undefined, 0.40);
        blendPx(Math.round(cx) + dx, mouthY - 1, shadeWarmSkinRgb(skinBase, -0.20), 0.35 * taper, 0.45);
      }
      return wroteEmission;
    }

    // Compact island (< 24px) crisp pixel-art eye fallback
    const eyeY = Math.round(h * 0.48);
    const eyeOffset = Math.max(2, Math.round(w * 0.22));
    const cx = Math.floor(w * 0.5);
    const eyeSpan = w >= 16 ? 3 : 2;
    const eyeHeight = h >= 14 ? 2 : 1;

    for (const side of [-1, 1]) {
      const exStart = cx + side * eyeOffset - Math.floor(eyeSpan * 0.5);
      for (let dy = 0; dy < eyeHeight; dy++) {
        for (let dx = 0; dx < eyeSpan; dx++) {
          const isPupil =
            eyeSpan >= 3 ? dx === 1 : dx === (side < 0 ? 1 : 0);
          const isGlint = dy === eyeHeight - 1 && dx === 0 && eyeSpan >= 2 && !glowRgb;
          const col = glowRgb
            ? isPupil
              ? mixRgb(glowRgb, [246, 242, 224], 0.4)
              : glowRgb
            : isGlint
              ? sclera
              : isPupil
                ? irisRgb
                : sclera;
          setPx(exStart + dx, eyeY + dy, col, glowRgb ? 0.85 : 0.42, glowRgb, 0.18);
        }
      }
      const browY = Math.min(h - 2, eyeY + eyeHeight + 1);
      for (let dx = -1; dx <= eyeSpan; dx++) {
        setPx(exStart + dx, browY, browRgb, 0.82);
      }
    }

    const mouthY = Math.max(1, Math.round(h * 0.22));
    const noseY = Math.round((eyeY + mouthY) * 0.5);
    setPx(cx, noseY, shadeWarmSkinRgb(skinBase, -0.22), 0.78);
    if (w >= 14) {
      setPx(cx - 1, mouthY, shadeWarmSkinRgb(skinBase, -0.30), 0.45);
      setPx(cx, mouthY, shadeWarmSkinRgb(skinBase, -0.30), 0.45);
      setPx(cx + 1, mouthY, shadeWarmSkinRgb(skinBase, -0.30), 0.45);
    }
    return wroteEmission;
  }

  if (isl.landmarkKind === 'door_front') {
    const iron = hexToRgb255('#343944');
    const brass = hexToRgb255(opts.emblemHex ?? '#d4a644');
    const strap1 = Math.round(h * 0.28);
    const strap2 = Math.round(h * 0.72);
    const strapH = h >= 32 ? 2 : 1;
    for (let lx = 0; lx < w; lx++) {
      for (let dy = 0; dy < strapH; dy++) {
        setPx(lx, strap1 + dy, iron, 0.88, undefined, 0.35);
        setPx(lx, strap2 + dy, iron, 0.88, undefined, 0.35);
      }
    }
    const hx = Math.max(2, Math.round(w * 0.75));
    const hy = Math.round(h * 0.48);
    setPx(hx, hy, brass, 0.94, undefined, 0.22);
    setPx(hx, hy - 1, shadeHueShiftRgb(brass, -0.2), 0.9, undefined, 0.25);
    setPx(hx - 1, hy, shadeHueShiftRgb(brass, 0.2), 0.92, undefined, 0.22);
    return wroteEmission;
  }

  if (isl.landmarkKind === 'chest_crest' || isl.landmarkKind === 'shield_face') {
    const cx = Math.floor(w * 0.5);
    const cy = Math.floor(h * 0.54);
    const accent = hexToRgb255(opts.emblemHex ?? isl.accentHex ?? '#d6b45a');
    const runeGlow = opts.emissiveRuneHex ? hexToRgb255(opts.emissiveRuneHex) : undefined;
    const rad = Math.max(2, Math.min(8, Math.floor(Math.min(w, h) * 0.22)));

    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        const man = Math.abs(dx) + Math.abs(dy);
        if (man > rad) continue;
        const isCore = man <= Math.max(0, rad - 2);
        const col = isCore && runeGlow ? runeGlow : isCore ? shadeHueShiftRgb(accent, 0.25) : accent;
        setPx(cx + dx, cy + dy, col, 0.92, isCore ? runeGlow : undefined, 0.24);
      }
    }
    return wroteEmission;
  }

  if (isl.landmarkKind === 'rune_panel') {
    const glow = opts.emissiveRuneHex
      ? hexToRgb255(opts.emissiveRuneHex)
      : hexToRgb255(isl.accentHex ?? '#52d6ff');
    const cx = Math.floor(w * 0.5);
    const cy = Math.floor(h * 0.5);
    const span = Math.max(2, Math.floor(Math.min(w, h) * 0.34));
    for (let k = -span; k <= span; k++) {
      setPx(cx, cy + k, glow, 0.85, glow, 0.2);
      if (Math.abs(k) === Math.floor(span * 0.6)) {
        setPx(cx - 1, cy + k, glow, 0.85, glow, 0.2);
        setPx(cx + 1, cy + k, glow, 0.85, glow, 0.2);
      }
    }
    return wroteEmission;
  }

  return wroteEmission;
}

// ---------------------------------------------------------------------------
// 2D Atlas Material Quality Metrics (adapted from img2blockbench benchmark-quality.py)
// ---------------------------------------------------------------------------

export function measureTextureQuality(
  albedoRgba: Uint8Array,
  islands: Pick<UvIslandMeta, 'pxBounds'>[],
  texWidth: number,
  texHeight: number
): TextureQualityMetrics {
  const substantive = islands.filter((isl) => {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(texWidth - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(texHeight - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    const w = x1 - x0 + 1;
    const h = y1 - y0 + 1;
    return w >= 2 && h >= 2 && w * h >= 12;
  });
  const targetIslands = substantive.length >= 2 ? substantive : islands;

  const entropies: number[] = [];
  const uniqueCounts: number[] = [];
  const edgeRates: number[] = [];

  for (const isl of targetIslands) {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(texWidth - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(texHeight - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    const w = x1 - x0 + 1;
    const h = y1 - y0 + 1;
    if (w < 2 || h < 2) continue;

    const counts = new Map<number, number>();
    const total = w * h;
    let changes = 0;
    let comps = 0;

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const o4 = (y * texWidth + x) * 4;
        const key =
          (albedoRgba[o4] << 16) | (albedoRgba[o4 + 1] << 8) | albedoRgba[o4 + 2];
        counts.set(key, (counts.get(key) ?? 0) + 1);

        if (x + 1 <= x1) {
          const r4 = (y * texWidth + (x + 1)) * 4;
          const rKey = (albedoRgba[r4] << 16) | (albedoRgba[r4 + 1] << 8) | albedoRgba[r4 + 2];
          comps++;
          if (key !== rKey) changes++;
        }
        if (y + 1 <= y1) {
          const u4 = ((y + 1) * texWidth + x) * 4;
          const uKey = (albedoRgba[u4] << 16) | (albedoRgba[u4 + 1] << 8) | albedoRgba[u4 + 2];
          comps++;
          if (key !== uKey) changes++;
        }
      }
    }

    let ent = 0;
    for (const c of counts.values()) {
      const p = c / total;
      ent -= p * Math.log2(p);
    }
    entropies.push(ent);
    uniqueCounts.push(counts.size);
    edgeRates.push(comps > 0 ? changes / comps : 0);
  }

  if (entropies.length === 0) {
    return {
      islandsEvaluated: 0,
      meanEntropy: 0,
      medianUniqueColors: 0,
      flatFacesPercent: 0,
      meanEdgeChangePercent: 0,
    };
  }

  const sortedUnique = [...uniqueCounts].sort((a, b) => a - b);
  const flatCount = uniqueCounts.filter((u) => u <= 3).length;

  return {
    islandsEvaluated: entropies.length,
    meanEntropy: Number((entropies.reduce((a, b) => a + b, 0) / entropies.length).toFixed(3)),
    medianUniqueColors: sortedUnique[Math.floor(sortedUnique.length / 2)],
    flatFacesPercent: Number(((flatCount / entropies.length) * 100).toFixed(2)),
    meanEdgeChangePercent: Number(
      ((edgeRates.reduce((a, b) => a + b, 0) / edgeRates.length) * 100).toFixed(2)
    ),
  };
}

// ---------------------------------------------------------------------------
// Hi-Fi Smooth GTAO + Curvature Wear + AO / Roughness Map Baking
// ---------------------------------------------------------------------------

const GTAO_DIR_X = [1, -1, 0, 0, 1, -1, 1, -1];
const GTAO_DIR_Y = [0, 0, 1, -1, 1, 1, -1, -1];
const GTAO_DIR_INV_LEN = [1, 1, 1, 1, 0.70710678, 0.70710678, 0.70710678, 0.70710678];

function applyHiFiGtaoWearAndBakeAo(
  heightField: Float32Array,
  coverageMask: Uint8Array,
  texWidth: number,
  texHeight: number,
  islands: UvIslandMeta[],
  albedoRgba: Uint8Array,
  roughnessField: Float32Array,
  aoRgba: Uint8Array,
  options: {
    gtaoStrength: number;
    gtaoRadiusPx: number;
    curvatureStrength: number;
    verticalGrimeStrength: number;
    curvatureMap: Float32Array | null;
    quantStep?: number;
  }
): void {
  const gtaoStrength = clamp01(options.gtaoStrength);
  const radius = Math.max(1, Math.min(8, Math.round(options.gtaoRadiusPx)));
  const curveStrength = Math.max(0, Math.min(0.55, options.curvatureStrength));
  const grimeStrength = Math.max(0, Math.min(0.6, options.verticalGrimeStrength));
  const curvatureMap = options.curvatureMap;
  const quantStep = options.quantStep ?? 0;

  let globalYMin = Infinity;
  let globalYMax = -Infinity;
  for (const isl of islands) {
    if (typeof isl.worldYMin === 'number' && Number.isFinite(isl.worldYMin)) {
      if (isl.worldYMin < globalYMin) globalYMin = isl.worldYMin;
    }
    if (typeof isl.worldYMax === 'number' && Number.isFinite(isl.worldYMax)) {
      if (isl.worldYMax > globalYMax) globalYMax = isl.worldYMax;
    }
  }
  const hasGlobalWorldY = globalYMax > globalYMin + 0.05 && Number.isFinite(globalYMin);
  const globalYSpan = hasGlobalWorldY ? Math.max(0.1, globalYMax - globalYMin) : 1.0;

  for (const isl of islands) {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(texWidth - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(texHeight - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    if (x1 < x0 || y1 < y0) continue;

    const skipHeavyDirt =
      isl.landmarkKind === 'head_front' ||
      isl.materialKind === 'human_skin' ||
      isl.materialKind === 'runic_glow';

    const islH = Math.max(1, y1 - y0 + 1);
    const islYMin = typeof isl.worldYMin === 'number' ? isl.worldYMin : 0;
    const islYMax = typeof isl.worldYMax === 'number' ? isl.worldYMax : 1;
    const avgNormY = typeof isl.avgNormalY === 'number' ? isl.avgNormalY : 0;

    const isMetalOrArmor =
      isl.materialKind === 'forged_steel' ||
      isl.materialKind === 'rarity_armor' ||
      isl.materialKind === 'brushed_gold';
    const isSkin =
      isl.materialKind === 'human_skin' || isl.materialKind === 'goblin_skin';
    const minShade = isSkin ? 0.72 : isMetalOrArmor ? 0.56 : 0.50;

    for (let y = y0; y <= y1; y++) {
      const vFrac = islH > 1 ? (y - y0) / (islH - 1) : 0.5;
      let zenithFactor = 0;
      if (!skipHeavyDirt) {
        if (hasGlobalWorldY) {
          const estY = isl.lockVertical
            ? islYMin + vFrac * (islYMax - islYMin)
            : (islYMin + islYMax) * 0.5;
          const yNorm = clamp01((estY - globalYMin) / globalYSpan);
          zenithFactor =
            -0.14 * (1 - yNorm) + 0.09 * yNorm + Math.max(-0.04, Math.min(0.05, avgNormY * 0.05));
        } else if (isl.lockVertical) {
          zenithFactor = -0.10 * (1 - vFrac) + 0.07 * vFrac;
        }
      }

      for (let x = x0; x <= x1; x++) {
        const idx = y * texWidth + x;
        if (!coverageMask[idx]) continue;

        const hCenter = heightField[idx];
        let maxHorizonSum = 0;
        for (let d = 0; d < 8; d++) {
          const dx = GTAO_DIR_X[d];
          const dy = GTAO_DIR_Y[d];
          const invLen = GTAO_DIR_INV_LEN[d];
          let bestSlope = 0;
          for (let step = 1; step <= radius; step++) {
            const nx = Math.max(x0, Math.min(x1, x + dx * step));
            const ny = Math.max(y0, Math.min(y1, y + dy * step));
            const dH = heightField[ny * texWidth + nx] - hCenter;
            if (dH > 0) {
              const slope = (dH * 4.0 * invLen) / step;
              if (slope > bestSlope) bestSlope = slope;
            }
          }
          maxHorizonSum += 1 / Math.sqrt(1 + bestSlope * bestSlope);
        }
        const rawAo = maxHorizonSum * 0.125;
        const ao = 1 - (1 - rawAo) * gtaoStrength;

        const hL = heightField[y * texWidth + Math.max(x0, x - 1)];
        const hR = heightField[y * texWidth + Math.min(x1, x + 1)];
        const hD = heightField[Math.max(y0, y - 1) * texWidth + x];
        const hU = heightField[Math.min(y1, y + 1) * texWidth + x];
        const curvature2D = (hCenter - 0.25 * (hL + hR + hD + hU)) * 2.8;
        const curv3D = curvatureMap && idx < curvatureMap.length ? curvatureMap[idx] : 0;

        const curveDelta2D = Math.max(-0.16, Math.min(0.16, curvature2D * curveStrength));
        const curveDelta3D =
          curv3D >= 0 ? Math.min(0.18, curv3D * 0.18) : Math.max(-0.18, curv3D * 0.20);
        const totalCurveDelta = Math.max(-0.22, Math.min(0.22, curveDelta2D + curveDelta3D));

        const o4 = idx * 4;
        const aoByte = clampByte(ao * (1 + Math.min(0, totalCurveDelta) * 0.5) * 255, 48, 255);
        aoRgba[o4 + 0] = aoByte;
        aoRgba[o4 + 1] = aoByte;
        aoRgba[o4 + 2] = aoByte;
        aoRgba[o4 + 3] = 255;

        // Subtle roughness cavity & edge-wear modulation
        roughnessField[idx] = clamp01(
          roughnessField[idx] + (1 - ao) * 0.14 - Math.max(0, totalCurveDelta) * 0.18
        );

        let r = albedoRgba[o4 + 0];
        let g = albedoRgba[o4 + 1];
        let b = albedoRgba[o4 + 2];

        const shadeFactor = Math.max(
          minShade,
          Math.min(1.20, ao + totalCurveDelta + zenithFactor)
        );
        if (shadeFactor < 1.0) {
          const shadowMix = (1 - shadeFactor) * 0.30;
          if (isSkin) {
            // Warm peach-coral ambient occlusion for anime/stylized skin
            r = r * shadeFactor * (1 - shadowMix) + 196 * shadowMix;
            g = g * shadeFactor * (1 - shadowMix) + 102 * shadowMix;
            b = b * shadeFactor * (1 - shadowMix) + 106 * shadowMix;
          } else {
            r = r * shadeFactor * (1 - shadowMix) + 32 * shadowMix;
            g = g * shadeFactor * (1 - shadowMix) + 30 * shadowMix;
            b = b * shadeFactor * (1 - shadowMix) + 48 * shadowMix;
          }
        } else if (shadeFactor > 1.0) {
          const hiMix = Math.min(0.22, (shadeFactor - 1.0) * 1.1);
          const targetR = isMetalOrArmor ? 232 : isSkin ? 250 : 240;
          const targetG = isMetalOrArmor ? 236 : isSkin ? 228 : 236;
          const targetB = isMetalOrArmor ? 244 : isSkin ? 222 : 224;
          r = r + (targetR - r) * hiMix;
          g = g + (targetG - g) * hiMix;
          b = b + (targetB - b) * hiMix;
        }

        if (isl.lockVertical && !skipHeavyDirt && grimeStrength > 0.01) {
          const bottomMask = Math.max(0, 1 - vFrac * 2.0);
          if (bottomMask > 0) {
            const effGrime = isSkin
              ? grimeStrength * 0.25
              : isMetalOrArmor
                ? grimeStrength * 0.45
                : grimeStrength * 0.75;
            const tint = bottomMask * effGrime;
            if (isl.materialKind === 'mossy_cobble' || isl.materialKind === 'stone_masonry') {
              r = r * (1 - tint) + 54 * tint;
              g = g * (1 - tint) + 82 * tint;
              b = b * (1 - tint) + 44 * tint;
            } else {
              r = r * (1 - tint) + 40 * tint;
              g = g * (1 - tint) + 34 * tint;
              b = b * (1 - tint) + 44 * tint;
            }
          }
        }

        const q = (val: number) =>
          quantStep > 0 ? Math.round(val / quantStep) * quantStep : Math.round(val);
        albedoRgba[o4 + 0] = Math.max(16, Math.min(244, q(r)));
        albedoRgba[o4 + 1] = Math.max(16, Math.min(244, q(g)));
        albedoRgba[o4 + 2] = Math.max(16, Math.min(244, q(b)));
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main Synthesis Entrypoints
// ---------------------------------------------------------------------------

export function synthesizeAtlasTextures(
  unwrapped: UnwrappedAtlasResult,
  options: SynthMaterialOptions = {}
): SynthesizedMaterialTextures {
  const build = (): SynthesizedMaterialTextures => {
    const seed = Math.floor(options.seed ?? 101);
    const rarity = options.rarityTier ?? 'normal';
    const w = unwrapped.texWidth;
    const h = unwrapped.texHeight;
    const count = w * h;
    const pixelArtSampling = options.pixelArtSampling === true;
    const dilationPx = Math.max(4, Math.round(options.dilationPx ?? unwrapped.paddingPx ?? 4));

    const albedoRgba = new Uint8Array(count * 4);
    const roughnessRgba = new Uint8Array(count * 4);
    const aoRgba = new Uint8Array(count * 4);
    const metalnessRgba = new Uint8Array(count * 4);
    const emissionRgba = new Uint8Array(count * 4);
    const heightField = new Float32Array(count).fill(0.5);
    const roughnessField = new Float32Array(count).fill(0.65);
    const metalnessField = new Float32Array(count).fill(0.0);
    const coverageMask = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
      const o4 = i * 4;
      aoRgba[o4 + 0] = 255;
      aoRgba[o4 + 1] = 255;
      aoRgba[o4 + 2] = 255;
      aoRgba[o4 + 3] = 255;
    }

    let hasEmission = false;

    for (const isl of unwrapped.islands) {
      const baseRgb = hexToRgb255(isl.baseHex);
      const accentRgb = hexToRgb255(isl.accentHex ?? isl.baseHex);
      const x0 = Math.max(0, isl.pxBounds.x);
      const y0 = Math.max(0, isl.pxBounds.y);
      const x1 = Math.min(w - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
      const y1 = Math.min(h - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
      const iw = Math.max(1, x1 - x0 + 1);
      const ih = Math.max(1, y1 - y0 + 1);

      for (let y = y0; y <= y1; y++) {
        const ly = y - y0;
        for (let x = x0; x <= x1; x++) {
          const lx = x - x0;
          const idx = y * w + x;
          coverageMask[idx] = 1;

          const sample = sampleMaterialRecipe(
            isl.materialKind,
            lx,
            ly,
            iw,
            ih,
            baseRgb,
            accentRgb,
            seed + isl.id * 37,
            rarity
          );
          if (!sample) continue;
          heightField[idx] = sample.height;
          roughnessField[idx] = sample.roughness;
          metalnessField[idx] = sample.metalness;
          const o4 = idx * 4;
          albedoRgba[o4 + 0] = sample.rgb[0];
          albedoRgba[o4 + 1] = sample.rgb[1];
          albedoRgba[o4 + 2] = sample.rgb[2];
          albedoRgba[o4 + 3] = 255;

          if (sample.emissiveRgb) {
            emissionRgba[o4 + 0] = sample.emissiveRgb[0];
            emissionRgba[o4 + 1] = sample.emissiveRgb[1];
            emissionRgba[o4 + 2] = sample.emissiveRgb[2];
            emissionRgba[o4 + 3] = 255;
            hasEmission = true;
          }
        }
      }

      if (
        applySemanticLandmark(
          isl,
          w,
          heightField,
          albedoRgba,
          emissionRgba,
          options,
          roughnessField
        )
      ) {
        hasEmission = true;
      }
    }

    // Apply smooth texel-space Horizon AO + Dihedral Curvature Wear + Zenithal Grime + bake AO map
    applyHiFiGtaoWearAndBakeAo(
      heightField,
      coverageMask,
      w,
      h,
      unwrapped.islands,
      albedoRgba,
      roughnessField,
      aoRgba,
      {
        gtaoStrength: options.gtaoStrength ?? 0.28,
        gtaoRadiusPx: options.gtaoRadiusPx ?? (w >= 512 ? 4 : 3),
        curvatureStrength: 0.08,
        verticalGrimeStrength: 0.07,
        curvatureMap: options.curvatureMap ?? null,
        quantStep: pixelArtSampling ? 6 : 0,
      }
    );

    for (let i = 0; i < count; i++) {
      if (!coverageMask[i]) continue;
      const o4 = i * 4;
      const rByte = clampByte(roughnessField[i] * 255, 16, 250);
      roughnessRgba[o4 + 0] = rByte;
      roughnessRgba[o4 + 1] = rByte;
      roughnessRgba[o4 + 2] = rByte;
      roughnessRgba[o4 + 3] = 255;

      const mByte = clampByte(metalnessField[i] * 255, 0, 255);
      metalnessRgba[o4 + 0] = mByte;
      metalnessRgba[o4 + 1] = mByte;
      metalnessRgba[o4 + 2] = mByte;
      metalnessRgba[o4 + 3] = 255;
    }

    // Compute smooth tangent-space OpenGL Sobel normals calibrated per material recipe
    const normalRgba = computeIslandNormalsFromHeight(
      heightField,
      coverageMask,
      w,
      h,
      unwrapped.islands,
      options.normalStrength ?? 0.42
    );

    // Dilate valid texels across >=4px padding gutters & background via 2-pass Felzenszwalb EDT
    dilateAtlasByEdt(
      coverageMask,
      w,
      h,
      albedoRgba,
      normalRgba,
      hasEmission ? emissionRgba : null,
      roughnessRgba,
      aoRgba,
      metalnessRgba
    );

    const quality = measureTextureQuality(albedoRgba, unwrapped.islands, w, h);

    const enforceSampling = pixelArtSampling
      ? enforcePixelArtTextureSampling
      : enforceHiFiTextureSampling;

    const albedoMap = enforceSampling(
      new THREE.DataTexture(albedoRgba, w, h, THREE.RGBAFormat),
      'albedo'
    );
    albedoMap.flipY = false;
    albedoMap.needsUpdate = true;
    markTexturePooling(albedoMap, false);

    const normalMap = enforceSampling(
      new THREE.DataTexture(normalRgba, w, h, THREE.RGBAFormat),
      'normal'
    );
    normalMap.flipY = false;
    normalMap.needsUpdate = true;
    markTexturePooling(normalMap, false);

    const roughnessMap = enforceSampling(
      new THREE.DataTexture(roughnessRgba, w, h, THREE.RGBAFormat),
      'normal'
    );
    roughnessMap.flipY = false;
    roughnessMap.needsUpdate = true;
    markTexturePooling(roughnessMap, false);

    const aoMap = enforceSampling(
      new THREE.DataTexture(aoRgba, w, h, THREE.RGBAFormat),
      'normal'
    );
    aoMap.flipY = false;
    aoMap.needsUpdate = true;
    markTexturePooling(aoMap, false);

    const metalnessMap = enforceSampling(
      new THREE.DataTexture(metalnessRgba, w, h, THREE.RGBAFormat),
      'normal'
    );
    metalnessMap.flipY = false;
    metalnessMap.needsUpdate = true;
    markTexturePooling(metalnessMap, false);

    let emissionMap: THREE.DataTexture | null = null;
    if (hasEmission) {
      emissionMap = enforceSampling(
        new THREE.DataTexture(emissionRgba, w, h, THREE.RGBAFormat),
        'emission'
      );
      emissionMap.flipY = false;
      emissionMap.needsUpdate = true;
      markTexturePooling(emissionMap, false);
    }

    return {
      albedoMap,
      normalMap,
      roughnessMap,
      aoMap,
      metalnessMap,
      emissionMap,
      hasEmission,
      texWidth: w,
      texHeight: h,
      dilationPx,
      quality,
      dispose: () => {
        if (albedoMap.userData?.pooled !== true) albedoMap.dispose();
        if (normalMap.userData?.pooled !== true) normalMap.dispose();
        if (roughnessMap.userData?.pooled !== true) roughnessMap.dispose();
        if (aoMap.userData?.pooled !== true) aoMap.dispose();
        if (metalnessMap.userData?.pooled !== true) metalnessMap.dispose();
        if (emissionMap && emissionMap.userData?.pooled !== true) emissionMap.dispose();
      },
    };
  };

  if (options.usePool && options.cacheKey) {
    return acquirePooledMaterialTextures(options.cacheKey, build);
  }
  return build();
}

// ---------------------------------------------------------------------------
// Shared Modular Tileset Sheet Atlas (`512x512` @ 64 px/m -> 0 overlaps, 8px gutter!)
// ---------------------------------------------------------------------------

export interface ModularTilesetSheet {
  textures: SynthesizedMaterialTextures;
  /** Maps any tile slot id ('floor_a'|'floor_b'|'floor_moss'|'floor_rune'|'wall_stone'|'wall_moss'|'plaza_cobble'|'timber_curb') -> UV bounds [u0,v0,u1,v1] */
  slots: Record<string, { u0: number; v0: number; u1: number; v1: number }>;
}

const SHEET_SLOT_DEFS: {
  id: string;
  recipe: MaterialRecipeId;
  baseHex: string;
  accentHex: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lockVertical: boolean;
  landmark?: 'rune_panel' | 'none';
}[] = [
  { id: 'floor_a', recipe: 'stone_masonry', baseHex: '#566470', accentHex: '#697a88', x: 8, y: 8, w: 96, h: 96, lockVertical: false },
  { id: 'floor_b', recipe: 'stone_masonry', baseHex: '#4f5c68', accentHex: '#60707c', x: 120, y: 8, w: 96, h: 96, lockVertical: false },
  { id: 'floor_moss', recipe: 'mossy_cobble', baseHex: '#505f66', accentHex: '#4a7a42', x: 232, y: 8, w: 96, h: 96, lockVertical: false },
  { id: 'floor_rune', recipe: 'runic_glow', baseHex: '#455a6e', accentHex: '#4ee6a8', x: 344, y: 8, w: 96, h: 96, lockVertical: false, landmark: 'rune_panel' },
  { id: 'wall_stone', recipe: 'stone_masonry', baseHex: '#677482', accentHex: '#808e9c', x: 8, y: 120, w: 96, h: 176, lockVertical: true },
  { id: 'wall_moss', recipe: 'mossy_cobble', baseHex: '#627079', accentHex: '#4e8344', x: 120, y: 120, w: 96, h: 176, lockVertical: true },
  { id: 'plaza_cobble', recipe: 'mossy_cobble', baseHex: '#8d8678', accentHex: '#6d7f55', x: 232, y: 120, w: 96, h: 96, lockVertical: false },
  { id: 'timber_curb', recipe: 'wood_planks', baseHex: '#734e32', accentHex: '#513724', x: 344, y: 120, w: 96, h: 96, lockVertical: true },
];

export function synthesizeModularTilesetSheet(
  biome: 'dungeon_ruins' | 'starter_city' = 'dungeon_ruins',
  seed = 777,
  gtaoStrength = 0.55,
  normalStrength = 0.42
): ModularTilesetSheet {
  const key = `tileset_sheet:${biome}:${seed}:${Math.round(gtaoStrength * 20)}:${Math.round(normalStrength * 20)}`;
  const size = 512;

  const islands: UvIslandMeta[] = SHEET_SLOT_DEFS.map((s, idx) => {
    const adjustedBase =
      biome === 'starter_city' && s.id === 'wall_stone'
        ? '#9aa2ad'
        : biome === 'starter_city' && s.id === 'floor_a'
          ? '#8a8275'
          : s.baseHex;
    return {
      id: idx,
      partTag: s.id,
      materialKind: s.recipe,
      baseHex: adjustedBase,
      accentHex: s.accentHex,
      landmarkKind: s.landmark ?? 'none',
      axisTag: s.lockVertical ? '+Z' : '+Y',
      lockVertical: s.lockVertical,
      rotated90: false,
      pxBounds: { x: s.x, y: s.y, w: s.w, h: s.h },
      contentPxBounds: { x: s.x, y: s.y, w: s.w, h: s.h },
      uvBounds: {
        u0: s.x / size,
        v0: s.y / size,
        u1: (s.x + s.w) / size,
        v1: (s.y + s.h) / size,
      },
      texelsPerMeter: 64,
      triIndices: [],
    };
  });

  const textures = acquirePooledMaterialTextures(key, () => {
    const fakeUnwrapped: UnwrappedAtlasResult = {
      geometry: new THREE.BufferGeometry(),
      texWidth: size,
      texHeight: size,
      texelsPerMeter: 64,
      paddingPx: 8,
      islands,
      triIslandIds: new Int32Array(0),
    };
    const out = synthesizeAtlasTextures(fakeUnwrapped, {
      seed,
      gtaoStrength,
      normalStrength,
      emissiveRuneHex: '#4ee6a8',
      dilationPx: 8,
    });
    fakeUnwrapped.geometry.dispose();
    return out;
  });

  const slots: Record<string, { u0: number; v0: number; u1: number; v1: number }> = {};
  for (const isl of islands) {
    slots[isl.partTag] = isl.uvBounds;
  }

  return { textures, slots };
}

export function synthesizeStructureBiomeSheet(
  biome: 'dungeon' | 'medieval' | 'city' | 'scifi',
  colors: { wallCol: string; trimCol: string; floorCol: string; accentCol: string },
  seed = 77,
  gtaoStrength = 0.55,
  normalStrength = 0.42
): ModularTilesetSheet {
  const colKey = `${colors.wallCol}_${colors.trimCol}_${colors.floorCol}_${colors.accentCol}`;
  const key = `struct_sheet:${biome}:${colKey}:${seed}:${Math.round(gtaoStrength * 20)}:${Math.round(normalStrength * 20)}`;
  const size = 512;

  const wallRecipe: MaterialRecipeId =
    biome === 'medieval'
      ? 'plaster_wall'
      : biome === 'scifi'
        ? 'forged_steel'
        : 'stone_masonry';
  const trimRecipe: MaterialRecipeId =
    biome === 'medieval'
      ? 'timber_frame'
      : biome === 'scifi' || biome === 'city'
        ? 'forged_steel'
        : 'stone_masonry';
  const floorRecipe: MaterialRecipeId =
    biome === 'dungeon' ? 'mossy_cobble' : 'stone_masonry';
  const roofRecipe: MaterialRecipeId =
    biome === 'medieval' || biome === 'dungeon' ? 'roof_shingle' : 'forged_steel';
  const accentRecipe: MaterialRecipeId =
    biome === 'dungeon' || biome === 'scifi' ? 'runic_glow' : 'brushed_gold';

  const defs: {
    id: string;
    recipe: MaterialRecipeId;
    baseHex: string;
    accentHex: string;
    x: number;
    y: number;
    w: number;
    h: number;
    lockVertical: boolean;
    landmark?: LandmarkKind;
  }[] = [
    { id: 'wall', recipe: wallRecipe, baseHex: colors.wallCol, accentHex: colors.trimCol, x: 8, y: 8, w: 152, h: 152, lockVertical: true },
    { id: 'trim', recipe: trimRecipe, baseHex: colors.trimCol, accentHex: colors.wallCol, x: 176, y: 8, w: 152, h: 152, lockVertical: true },
    { id: 'floor', recipe: floorRecipe, baseHex: colors.floorCol, accentHex: colors.trimCol, x: 344, y: 8, w: 152, h: 152, lockVertical: false },
    { id: 'roof', recipe: roofRecipe, baseHex: colors.accentCol, accentHex: colors.trimCol, x: 8, y: 176, w: 152, h: 152, lockVertical: false },
    {
      id: 'accent',
      recipe: accentRecipe,
      baseHex: colors.accentCol,
      accentHex: colors.trimCol,
      x: 176,
      y: 176,
      w: 152,
      h: 152,
      lockVertical: true,
      landmark: biome === 'dungeon' || biome === 'scifi' ? 'rune_panel' : 'none',
    },
    { id: 'wood', recipe: 'wood_planks', baseHex: '#6d482e', accentHex: '#3d2718', x: 344, y: 176, w: 152, h: 152, lockVertical: true },
  ];

  const islands: UvIslandMeta[] = defs.map((s, idx) => ({
    id: idx,
    partTag: s.id,
    materialKind: s.recipe,
    baseHex: s.baseHex,
    accentHex: s.accentHex,
    landmarkKind: s.landmark ?? 'none',
    axisTag: s.lockVertical ? '+Z' : '+Y',
    lockVertical: s.lockVertical,
    rotated90: false,
    pxBounds: { x: s.x, y: s.y, w: s.w, h: s.h },
    contentPxBounds: { x: s.x, y: s.y, w: s.w, h: s.h },
    uvBounds: {
      u0: s.x / size,
      v0: s.y / size,
      u1: (s.x + s.w) / size,
      v1: (s.y + s.h) / size,
    },
    texelsPerMeter: 64,
    triIndices: [],
  }));

  const hasGlow = biome === 'dungeon' || biome === 'scifi';
  const textures = acquirePooledMaterialTextures(key, () => {
    const fakeUnwrapped: UnwrappedAtlasResult = {
      geometry: new THREE.BufferGeometry(),
      texWidth: size,
      texHeight: size,
      texelsPerMeter: 64,
      paddingPx: 8,
      islands,
      triIslandIds: new Int32Array(0),
    };
    const out = synthesizeAtlasTextures(fakeUnwrapped, {
      seed,
      gtaoStrength,
      normalStrength,
      emissiveRuneHex: hasGlow ? colors.accentCol : null,
      dilationPx: 8,
    });
    fakeUnwrapped.geometry.dispose();
    return out;
  });

  const slots: Record<string, { u0: number; v0: number; u1: number; v1: number }> = {};
  for (const isl of islands) {
    slots[isl.partTag] = isl.uvBounds;
  }

  return { textures, slots };
}

/**
 * Remaps all triangles of a BufferGeometry into a specific slot region of a modular tileset sheet
 * preserving proportional `(x, y)` or `(x, z)` planar orientation with zero wrap/out-of-tile glitches.
 */
export function mapGeometryToSheetSlot(
  geo: THREE.BufferGeometry,
  slot: { u0: number; v0: number; u1: number; v1: number }
): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  const pos = g.getAttribute('position');
  const norm = g.getAttribute('normal');
  const uv = new Float32Array(pos.count * 2);

  g.computeBoundingBox();
  const bb = g.boundingBox!;
  const sx = Math.max(1e-4, bb.max.x - bb.min.x);
  const sy = Math.max(1e-4, bb.max.y - bb.min.y);
  const sz = Math.max(1e-4, bb.max.z - bb.min.z);

  const du = slot.u1 - slot.u0;
  const dv = slot.v1 - slot.v0;

  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(norm.getX(i));
    const ny = Math.abs(norm.getY(i));
    const nz = Math.abs(norm.getZ(i));
    let uFrac = 0.5;
    let vFrac = 0.5;

    if (ny >= nx && ny >= nz) {
      uFrac = (pos.getX(i) - bb.min.x) / sx;
      vFrac = (pos.getZ(i) - bb.min.z) / sz;
    } else if (nz >= nx) {
      uFrac = (pos.getX(i) - bb.min.x) / sx;
      vFrac = (pos.getY(i) - bb.min.y) / sy;
    } else {
      uFrac = (pos.getZ(i) - bb.min.z) / sz;
      vFrac = (pos.getY(i) - bb.min.y) / sy;
    }

    uv[i * 2 + 0] = slot.u0 + (0.04 + 0.92 * uFrac) * du;
    uv[i * 2 + 1] = slot.v0 + (0.04 + 0.92 * vFrac) * dv;
  }

  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

export function createDeterministicMaterialKey(parts: string[]): string {
  return parts.join('|');
}

export function makeDefaultSynthRng(seed: number): () => number {
  return createSeededRng(seed);
}

// ---------------------------------------------------------------------------
// Unified Baked Asset Pipeline (`textured_ao` | `classic_flat`)
// ---------------------------------------------------------------------------

export interface BakedAssetOptions extends Omit<UnwrapOptions, 'vertexColorMode' | 'computeTangents'> {
  finishMode?: FinishMode;
  seed?: number;
  aoRays?: number;
  aoMaxDist?: number;
  aoStrength?: number;
  creaseBoost?: number;
  gtaoStrength?: number;
  gtaoRadiusPx?: number;
  normalStrength?: number;
  subdivideMaxEdgeM?: number;
  rarityTier?: 'normal' | 'common' | 'rare' | 'epic' | 'legendary';
  eyeHex?: string;
  eyeGlowHex?: string | null;
  browHex?: string;
  emblemHex?: string;
  emissiveRuneHex?: string | null;
  usePool?: boolean;
  cacheKey?: string;
  inspectUvs?: boolean;
  partTagToBoneIndex?: ReadonlyMap<string, number>;
  /** Default false: uses smooth trilinear Hi-Fi texture sampling; set true for retro NearestFilter */
  pixelArtSampling?: boolean;
  /** Minimum UV island edge dilation in pixels (default 4) */
  dilationPx?: number;
  /** Lock exact texelsPerMeter without adaptive Hi-Fi upscaling */
  exactTexelsPerMeter?: boolean;
  /** Minimum islandScaleBias applied to `head_front` landmark parts (default 2.6) */
  uvScaleBias?: number;
  headFrontScaleBias?: number;
}

export interface UnwrapMetricsSummary {
  finishMode: FinishMode;
  texelsPerMeter: number;
  texWidth: number;
  texHeight: number;
  islandsCount: number;
  triangleCount: number;
  overlapPairs: number;
  meanEntropy: number;
  flatFacesPercent: number;
  meanEdgeChangePercent: number;
  minVertexAo: number;
}

export interface BakedAssetResult {
  geometry: THREE.BufferGeometry;
  finishMode: FinishMode;
  textures: SynthesizedMaterialTextures | null;
  hasTangents: boolean;
  uvReport: UvDiagnosticsReport | null;
  unwrapMetrics: UnwrapMetricsSummary;
  perVertexBoneIndices?: Uint16Array;
  dispose: () => void;
}

function estimatePartsSurfaceArea(parts: TaggedGeometryPart[]): { area: number; maxSpan: number } {
  let area = 0;
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  for (const p of parts) {
    const pos = p.geometry.getAttribute('position');
    if (!pos) continue;
    const idx = p.geometry.getIndex();
    const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);
    for (let t = 0; t < triCount; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3;
      const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      const ax = pos.getX(i0),
        ay = pos.getY(i0),
        az = pos.getZ(i0);
      const bx = pos.getX(i1),
        by = pos.getY(i1),
        bz = pos.getZ(i1);
      const cx = pos.getX(i2),
        cy = pos.getY(i2),
        cz = pos.getZ(i2);
      if (ax < minX) minX = ax;
      if (bx < minX) minX = bx;
      if (cx < minX) minX = cx;
      if (ay < minY) minY = ay;
      if (by < minY) minY = by;
      if (cy < minY) minY = cy;
      if (az < minZ) minZ = az;
      if (bz < minZ) minZ = bz;
      if (cz < minZ) minZ = cz;
      if (ax > maxX) maxX = ax;
      if (bx > maxX) maxX = bx;
      if (cx > maxX) maxX = cx;
      if (ay > maxY) maxY = ay;
      if (by > maxY) maxY = by;
      if (cy > maxY) maxY = cy;
      if (az > maxZ) maxZ = az;
      if (bz > maxZ) maxZ = bz;
      if (cz > maxZ) maxZ = cz;

      const e1x = bx - ax,
        e1y = by - ay,
        e1z = bz - az;
      const e2x = cx - ax,
        e2y = cy - ay,
        e2z = cz - az;
      const nx = e1y * e2z - e1z * e2y;
      const ny = e1z * e2x - e1x * e2z;
      const nz = e1x * e2y - e1y * e2x;
      area += 0.5 * Math.hypot(nx, ny, nz);
    }
  }
  const maxSpan = Number.isFinite(minX) ? Math.max(maxX - minX, maxY - minY, maxZ - minZ) : 1;
  return { area: Math.max(0.05, area), maxSpan };
}

function resolveAdaptiveHiFiTexelsPerMeter(
  parts: TaggedGeometryPart[],
  options: BakedAssetOptions
): { texelsPerMeter: number; minAtlasSize: number; maxAtlasSize: number; paddingPx: number } {
  const { area, maxSpan } = estimatePartsSurfaceArea(parts);
  const isLargeArchitecture = area > 25 || maxSpan > 6.0;
  const isBatchArchitecture =
    options.texelsPerMeter !== undefined && options.texelsPerMeter <= 36;
  let ppm: number;

  if (options.exactTexelsPerMeter && options.texelsPerMeter !== undefined) {
    ppm = options.texelsPerMeter;
  } else if (options.texelsPerMeter === undefined) {
    ppm = isLargeArchitecture
      ? Math.round(Math.max(64, Math.min(140, Math.sqrt(260000 / area))))
      : Math.round(Math.max(160, Math.min(220, Math.sqrt(380000 / area))));
  } else if (isBatchArchitecture) {
    // Preserve fast baking for large multi-piece architectural builders (CityBuilder / Dungeon)
    ppm = options.texelsPerMeter!;
  } else if (options.texelsPerMeter < 140) {
    const targetFill = parts.length <= 4 && area < 0.8 ? 96000 : 320000;
    const adaptive = isLargeArchitecture
      ? Math.round(Math.max(48, Math.min(80, Math.sqrt(180000 / area))))
      : Math.round(Math.max(144, Math.min(200, Math.sqrt(targetFill / area))));
    ppm = Math.max(options.texelsPerMeter, adaptive);
  } else {
    ppm = options.texelsPerMeter;
  }

  const paddingPx = Math.max(4, Math.round(options.paddingPx ?? 4));
  const minAtlasSize = options.minAtlasSize ?? 64;
  const maxAtlasSize = options.maxAtlasSize ?? 1024;
  if (options.maxAtlasSize !== undefined && !options.exactTexelsPerMeter) {
    const chartOverheadPx = parts.length * 4 * paddingPx * 24;
    const usablePx = Math.max(
      maxAtlasSize * maxAtlasSize * 0.22,
      maxAtlasSize * maxAtlasSize * 0.38 - chartOverheadPx
    );
    const maxSafePpm = Math.max(12, Math.floor(Math.sqrt(usablePx / area)));
    ppm = Math.min(ppm, maxSafePpm);
  }
  return { texelsPerMeter: ppm, minAtlasSize, maxAtlasSize, paddingPx };
}

function computePartsCacheSignature(parts: TaggedGeometryPart[]): string {
  let totalVerts = 0;
  let totalTris = 0;
  const headTags: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const g = p.geometry;
    const pos = g.getAttribute('position');
    const vCnt = pos?.count ?? 0;
    const tCnt = g.index ? Math.floor(g.index.count / 3) : Math.floor(vCnt / 3);
    totalVerts += vCnt;
    totalTris += tCnt;
    if (i < 3 || p.landmarkKind === 'head_front') {
      headTags.push(`${p.partTag}:${p.baseHex}`);
    }
  }
  return `${parts.length}:${totalVerts}:${totalTris}:${headTags.join(',')}`;
}

function measureMinVertexAo(geo: THREE.BufferGeometry): number {
  const col = geo.getAttribute('color');
  if (!col || col.count === 0) return 1;
  let minAo = 1;
  for (let i = 0; i < col.count; i++) {
    const lum = (col.getX(i) + col.getY(i) + col.getZ(i)) / 3;
    if (lum < minAo) minAo = lum;
  }
  return Number(minAo.toFixed(3));
}

/**
 * Unwraps, bakes vertex AO/creases, synthesizes procedural Hi-Fi stylized PBR textures
 * (`albedoMap`, `normalMap`, `roughnessMap`, `aoMap`, `metalnessMap`, `emissionMap`), and
 * optionally computes tangent frames & UV quality diagnostics in one unified call.
 *
 * When `finishMode === 'classic_flat'`, returns flat vertex-colored geometry matching legacy rendering.
 */
export function bakeTaggedPartsAsset(
  parts: TaggedGeometryPart[],
  options: BakedAssetOptions = {}
): BakedAssetResult {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 101);

  if (parts.length === 0) {
    const emptyGeo = mergeColoredParts([]);
    const metrics: UnwrapMetricsSummary = {
      finishMode,
      texelsPerMeter: options.texelsPerMeter ?? 180,
      texWidth: 0,
      texHeight: 0,
      islandsCount: 0,
      triangleCount: Math.floor((emptyGeo.getAttribute('position')?.count ?? 0) / 3),
      overlapPairs: 0,
      meanEntropy: 0,
      flatFacesPercent: 0,
      meanEdgeChangePercent: 0,
      minVertexAo: 1,
    };
    emptyGeo.userData = { ...emptyGeo.userData, unwrapMetrics: metrics };
    return {
      geometry: emptyGeo,
      finishMode,
      textures: null,
      hasTangents: false,
      uvReport: null,
      unwrapMetrics: metrics,
      dispose: () => emptyGeo.dispose(),
    };
  }

  if (finishMode === 'classic_flat') {
    const merged = mergeColoredParts(parts.map((p) => p.geometry));
    let perVertexBoneIndices: Uint16Array | undefined;
    if (options.partTagToBoneIndex) {
      const posCount = merged.getAttribute('position')?.count ?? 0;
      perVertexBoneIndices = new Uint16Array(posCount);
      let cursor = 0;
      for (const p of parts) {
        const g = p.geometry;
        const vCount = g.index
          ? g.index.count
          : (g.getAttribute('position')?.count ?? 0);
        const boneIdx = options.partTagToBoneIndex.get(p.partTag) ?? 0;
        const end = Math.min(posCount, cursor + vCount);
        for (let i = cursor; i < end; i++) {
          perVertexBoneIndices[i] = boneIdx;
        }
        cursor = end;
      }
    }

    const triCount = Math.floor((merged.getAttribute('position')?.count ?? 0) / 3);
    const metrics: UnwrapMetricsSummary = {
      finishMode,
      texelsPerMeter: 0,
      texWidth: 0,
      texHeight: 0,
      islandsCount: 0,
      triangleCount: triCount,
      overlapPairs: 0,
      meanEntropy: 0,
      flatFacesPercent: 100,
      meanEdgeChangePercent: 0,
      minVertexAo: measureMinVertexAo(merged),
    };
    merged.userData = { ...merged.userData, unwrapMetrics: metrics };
    return {
      geometry: merged,
      finishMode,
      textures: null,
      hasTangents: false,
      uvReport: null,
      unwrapMetrics: metrics,
      perVertexBoneIndices,
      dispose: () => merged.dispose(),
    };
  }

  // Track triangle ranges per part for fallback bone-index assignment
  const partTriEnds: { endTri: number; partTag: string }[] = [];
  let runningTris = 0;
  for (const p of parts) {
    const g = p.geometry;
    const tCnt = g.index
      ? Math.floor(g.index.count / 3)
      : Math.floor((g.getAttribute('position')?.count ?? 0) / 3);
    runningTris += tCnt;
    partTriEnds.push({ endTri: runningTris, partTag: p.partTag });
  }

  const headFrontPriority = options.uvScaleBias ?? options.headFrontScaleBias ?? 2.6;
  const prioritizedParts = parts.map((p) => {
    if (p.landmarkKind === 'head_front' || p.partTag === 'head_front') {
      const boosted = Math.max(p.islandScaleBias ?? 1.0, headFrontPriority);
      return boosted !== p.islandScaleBias ? { ...p, islandScaleBias: boosted } : p;
    }
    return p;
  });

  const subdivideEdgeM = options.subdivideMaxEdgeM ?? 0;
  const willSubdivide = subdivideEdgeM > 0;
  const { texelsPerMeter, minAtlasSize, maxAtlasSize, paddingPx } =
    resolveAdaptiveHiFiTexelsPerMeter(prioritizedParts, options);

  const aoStrength = options.aoStrength ?? 0.55;
  const gtaoStrength = options.gtaoStrength ?? Math.min(0.85, aoStrength);
  const normalStrength =
    options.pixelArtSampling === true
      ? (options.normalStrength ?? 0.36)
      : Math.max(options.normalStrength ?? 0.48, 0.36);

  const prePoolKey =
    options.usePool && options.cacheKey
      ? `${options.cacheKey}:s${seed}:tpm${texelsPerMeter}:max${maxAtlasSize}:sub${subdivideEdgeM}:ao${options.aoRays ?? 16}:${Math.round(aoStrength * 20)}:g${Math.round(gtaoStrength * 20)}:n${Math.round(normalStrength * 20)}:${options.rarityTier ?? 'normal'}:${options.pixelArtSampling ? 'px' : 'hf'}:b${options.partTagToBoneIndex ? 1 : 0}:${computePartsCacheSignature(prioritizedParts)}`
      : undefined;

  if (prePoolKey) {
    const cachedAsset = BAKED_ASSET_POOL.get(prePoolKey);
    if (cachedAsset) {
      BAKED_ASSET_POOL.delete(prePoolKey);
      BAKED_ASSET_POOL.set(prePoolKey, cachedAsset);
      const clonedGeo = cachedAsset.geometry.clone();
      clonedGeo.userData = { ...cachedAsset.geometry.userData };
      return {
        ...cachedAsset,
        geometry: clonedGeo,
        dispose: () => {
          clonedGeo.dispose();
          cachedAsset.textures?.dispose();
        },
      };
    }
  }

  const unwrapped = unwrapPixelAligned(prioritizedParts, {
    texelsPerMeter,
    paddingPx,
    minAtlasSize,
    maxAtlasSize,
    islandChartCosThreshold: options.islandChartCosThreshold ?? 0.91,
    sewChamfersToParentChart: options.sewChamfersToParentChart ?? true,
    computeTangents: !willSubdivide,
    vertexColorMode: 'white_for_ao',
  });
  const effectiveCacheKey = options.cacheKey
    ? `${options.cacheKey}:s${seed}:p${unwrapped.texWidth}x${unwrapped.texHeight}:g${Math.round(gtaoStrength * 20)}:n${Math.round(normalStrength * 20)}:${options.rarityTier ?? 'normal'}:${options.pixelArtSampling ? 'px' : 'hf'}`
    : undefined;
  const isCacheHit = Boolean(
    options.usePool && effectiveCacheKey && MATERIAL_TEXTURE_POOL.has(effectiveCacheKey)
  );

  // Compute 3D edge dihedral curvature map only when synthesizing a new un-pooled texture bundle
  const curvatureMap = isCacheHit
    ? null
    : bake3DCurvatureToUvIslands(
        unwrapped.geometry,
        unwrapped.islands,
        unwrapped.texWidth,
        unwrapped.texHeight
      );

  let outGeo = unwrapped.geometry;

  // Map per-vertex bone index cleanly before any post-processing
  let perVertexBoneIndices: Uint16Array | undefined;
  if (options.partTagToBoneIndex) {
    const boneMap = options.partTagToBoneIndex;
    const vertCount = outGeo.getAttribute('position')?.count ?? 0;
    const totalTris = Math.floor(vertCount / 3);
    perVertexBoneIndices = new Uint16Array(vertCount);
    let rangePtr = 0;

    for (let t = 0; t < totalTris; t++) {
      while (rangePtr < partTriEnds.length - 1 && t >= partTriEnds[rangePtr].endTri) {
        rangePtr++;
      }
      const islId = t < unwrapped.triIslandIds.length ? unwrapped.triIslandIds[t] : -1;
      const tag =
        islId >= 0 && islId < unwrapped.islands.length
          ? unwrapped.islands[islId].partTag
          : partTriEnds[rangePtr]?.partTag;
      const boneIdx = (tag !== undefined ? boneMap.get(tag) : undefined) ?? 0;
      const vBase = t * 3;
      perVertexBoneIndices[vBase + 0] = boneIdx;
      perVertexBoneIndices[vBase + 1] = boneIdx;
      perVertexBoneIndices[vBase + 2] = boneIdx;
    }
  }

  if (willSubdivide) {
    const savedUserData = { ...outGeo.userData };
    const origPos = outGeo.getAttribute('position') as THREE.BufferAttribute | undefined;
    const origBones = perVertexBoneIndices;
    const subGeo = subdivideForAo(outGeo, subdivideEdgeM);
    outGeo.dispose();
    subGeo.userData = { ...subGeo.userData, ...savedUserData };
    computeGeometryTangents(subGeo);
    outGeo = subGeo;

    // Interpolate / nearest-map per-vertex bone indices onto subdivided vertices
    if (origBones && origPos && origPos.count > 0) {
      const subPos = outGeo.getAttribute('position') as THREE.BufferAttribute;
      const newBones = new Uint16Array(subPos.count);
      for (let i = 0; i < subPos.count; i++) {
        const sx = subPos.getX(i);
        const sy = subPos.getY(i);
        const sz = subPos.getZ(i);
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let j = 0; j < origPos.count; j++) {
          const dx = sx - origPos.getX(j);
          const dy = sy - origPos.getY(j);
          const dz = sz - origPos.getZ(j);
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < bestDist) {
            bestDist = d2;
            bestIdx = origBones[j];
            if (d2 < 1e-8) break;
          }
        }
        newBones[i] = bestIdx;
      }
      perVertexBoneIndices = newBones;
    }
  }

  bakeVertexAoAndCreases(outGeo, {
    rays: options.aoRays ?? 16,
    maxDist: options.aoMaxDist ?? 0.65,
    strength: aoStrength,
    creaseBoost: options.creaseBoost ?? (aoStrength <= 0.01 ? 0 : 0.06),
  });

  const textures = synthesizeAtlasTextures(unwrapped, {
    seed,
    gtaoStrength,
    gtaoRadiusPx: options.gtaoRadiusPx ?? (unwrapped.texWidth >= 512 ? 4 : 3),
    normalStrength,
    curvatureMap,
    rarityTier: options.rarityTier ?? 'normal',
    eyeHex: options.eyeHex,
    eyeGlowHex: options.eyeGlowHex,
    browHex: options.browHex,
    emblemHex: options.emblemHex,
    emissiveRuneHex: options.emissiveRuneHex,
    usePool: Boolean(options.usePool && effectiveCacheKey),
    cacheKey: effectiveCacheKey,
    pixelArtSampling: options.pixelArtSampling,
    dilationPx: Math.max(4, options.dilationPx ?? paddingPx),
  });

  const triCount = Math.floor((outGeo.getAttribute('position')?.count ?? 0) / 3);
  let uvReport: UvDiagnosticsReport | null = null;
  if (options.inspectUvs !== false && triCount > 0 && triCount <= 6000) {
    uvReport = inspectGeometryUvs(
      outGeo,
      unwrapped.texelsPerMeter,
      unwrapped.texWidth,
      unwrapped.texHeight,
      willSubdivide
        ? undefined
        : {
            partTagByTri: (t) => {
              const islId = unwrapped.triIslandIds[t];
              return islId >= 0 ? unwrapped.islands[islId].partTag : 'mesh';
            },
          }
    );
  }

  const hasTangents = Boolean(outGeo.getAttribute('tangent'));
  const minVertexAo = measureMinVertexAo(outGeo);
  const unwrapMetrics: UnwrapMetricsSummary = {
    finishMode,
    texelsPerMeter: unwrapped.texelsPerMeter,
    texWidth: unwrapped.texWidth,
    texHeight: unwrapped.texHeight,
    islandsCount: unwrapped.islands.length,
    triangleCount: triCount,
    overlapPairs: uvReport?.overlapPairs ?? 0,
    meanEntropy: textures.quality.meanEntropy,
    flatFacesPercent: textures.quality.flatFacesPercent,
    meanEdgeChangePercent: textures.quality.meanEdgeChangePercent,
    minVertexAo,
  };
  outGeo.userData = { ...outGeo.userData, unwrapMetrics };

  const result: BakedAssetResult = {
    geometry: outGeo,
    finishMode,
    textures,
    hasTangents,
    uvReport,
    unwrapMetrics,
    perVertexBoneIndices,
    dispose: () => {
      outGeo.dispose();
      textures.dispose();
    },
  };

  if (prePoolKey) {
    const templateGeo = outGeo.clone();
    templateGeo.userData = { ...outGeo.userData };
    BAKED_ASSET_POOL.set(prePoolKey, {
      ...result,
      geometry: templateGeo,
    });
    if (BAKED_ASSET_POOL.size > MAX_POOLED_BAKED_ASSETS) {
      const oldestKey = BAKED_ASSET_POOL.keys().next().value;
      if (oldestKey !== undefined) {
        const oldest = BAKED_ASSET_POOL.get(oldestKey);
        BAKED_ASSET_POOL.delete(oldestKey);
        oldest?.geometry.dispose();
      }
    }
  }

  return result;
}

/**
 * Creates a `PixelizerMaterial` pre-configured for a `BakedAssetResult`, automatically wiring
 * `albedoMap`, `normalMap`, `useVertexTangents`, `emissionMap`, and safe linear vertex tints
 * (plus attaching `roughnessMap`, `aoMap`, `metalnessMap` in `userData` for PBR/GLB consumers).
 */
export function createPixelizerMaterialFromBaked(
  baked: BakedAssetResult,
  matOverrides: Partial<PixelizerMaterialOptions> = {},
  sharedResources?: PixelizerMaterialResources
): PixelizerMaterial {
  const hasTex = Boolean(baked.textures);
  const hasEmission = Boolean(baked.textures?.hasEmission && baked.textures.emissionMap);

  const opts: PixelizerMaterialOptions = {
    baseColor: '#ffffff',
    diffuseVertexColorWeight: 1.0,
    edgeHighlight: 0.42,
    edgeBevelWeight: 0.6,
    smoothness: 0.35,
    albedoMap: baked.textures?.albedoMap ?? null,
    normalMap: baked.textures?.normalMap ?? null,
    normalScale: hasTex ? 0.92 : 1.0,
    useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
    emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
    emissionColor: hasEmission ? '#ffffff' : '#000000',
    emissionIntensity: hasEmission ? 1.15 : 0.0,
    ...matOverrides,
  };

  const mat = new PixelizerMaterial(opts, sharedResources);
  mat.vertexColors = true;
  if (baked.textures) {
    mat.userData = {
      ...mat.userData,
      roughnessMap: baked.textures.roughnessMap,
      aoMap: baked.textures.aoMap,
      metalnessMap: baked.textures.metalnessMap,
    };
  }
  return mat;
}

// ---------------------------------------------------------------------------
// Stylized Alpha Leaf Cluster Texture Generator (Jabami leave_tree_05_tex regime)
// ---------------------------------------------------------------------------

export interface LeafClusterTextureOptions {
  size?: number;
  seed?: number;
  sunlitHex?: string;
  shadedHex?: string;
  clusterCount?: number;
  pixelArtSampling?: boolean;
}

export interface LeafClusterTextureResult {
  albedoMap: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
  alphaCoverage: number;
  dispose: () => void;
}

/**
 * Generates a crisp alpha-cutout leaf cluster texture matching `leave_tree_05_tex.png`:
 * ~27%–36% opaque leaf-lobe clusters, ~0.5px AA alpha boundary, two-tier sunlit/shaded greens,
 * 4px+ RGB edge dilation into transparent texels, and OpenGL tangent-space normals.
 */
export function generateLeafClusterTexture(
  options: LeafClusterTextureOptions = {}
): LeafClusterTextureResult {
  const size = Math.max(64, Math.min(1024, Math.round(options.size ?? 512)));
  const seed = Math.floor(options.seed ?? 505);
  const rng = createSeededRng(seed);
  const sunlitRgb = hexToRgb255(options.sunlitHex ?? '#47f379');
  const shadedRgb = hexToRgb255(options.shadedHex ?? '#2a8f47');
  const clusterCount = Math.max(8, Math.min(48, Math.round(options.clusterCount ?? 24)));

  interface LeafLobe {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    rot: number;
    sunlit: number;
    depth: number;
  }

  const lobes: LeafLobe[] = [];
  for (let c = 0; c < clusterCount; c++) {
    const gx = (0.14 + 0.72 * rng()) * size;
    const gy = (0.14 + 0.72 * rng()) * size;
    const subLobes = 2 + Math.floor(rng() * 2);
    for (let s = 0; s < subLobes; s++) {
      const ang = rng() * Math.PI * 2;
      const dist = rng() * size * 0.045;
      const baseR = size * (0.042 + rng() * 0.032);
      lobes.push({
        cx: gx + Math.cos(ang) * dist,
        cy: gy + Math.sin(ang) * dist,
        rx: baseR,
        ry: baseR * (0.76 + rng() * 0.34),
        rot: rng() * Math.PI,
        sunlit: clamp01(0.25 + (gy / size) * 0.55 + (rng() - 0.5) * 0.45),
        depth: c * 0.01 + s * 0.002,
      });
    }
  }

  const count = size * size;
  const albedoRgba = new Uint8Array(count * 4);
  const roughnessRgba = new Uint8Array(count * 4);
  const heightField = new Float32Array(count).fill(0.25);
  const coverageMask = new Uint8Array(count);
  const alphaField = new Float32Array(count);

  let opaqueCount = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bestScore = -1;
      let bestSunlit = 0.5;
      let bestNormDist = 2.0;

      for (const l of lobes) {
        const dx = x - l.cx;
        const dy = y - l.cy;
        const cos = Math.cos(l.rot);
        const sin = Math.sin(l.rot);
        const lx = (dx * cos + dy * sin) / l.rx;
        const ly = (-dx * sin + dy * cos) / l.ry;
        const theta = Math.atan2(ly, lx);
        // Scalloped 5-lobe botanical contour
        const scallop = 1.0 + 0.14 * Math.cos(theta * 5.0 + l.rot);
        const d = Math.hypot(lx, ly) / scallop;
        if (d <= 1.06) {
          const score = 1.0 - d + l.depth;
          if (score > bestScore) {
            bestScore = score;
            bestSunlit = l.sunlit;
            bestNormDist = d;
          }
        }
      }

      const idx = y * size + x;
      const o4 = idx * 4;
      if (bestScore > -0.5) {
        // Crisp ~0.5px AA alpha cutout boundary matching Jabami leave_tree_05_tex
        const edgePx = bestNormDist * size * 0.045;
        const aa = clamp01(1.0 - smoothstep(size * 0.045 - 0.65, size * 0.045 + 0.35, edgePx));
        alphaField[idx] = aa;
        if (aa > 0.05) {
          coverageMask[idx] = 1;
          if (aa > 0.5) opaqueCount++;
          const dome = Math.max(0, 1 - bestNormDist * bestNormDist);
          heightField[idx] = 0.45 + dome * 0.45;
          const col = mixRgb(shadedRgb, sunlitRgb, clamp01(bestSunlit * 0.75 + dome * 0.35));
          albedoRgba[o4 + 0] = col[0];
          albedoRgba[o4 + 1] = col[1];
          albedoRgba[o4 + 2] = col[2];
          albedoRgba[o4 + 3] = Math.round(aa * 255);

          const rByte = clampByte((0.68 - bestSunlit * 0.14) * 255, 24, 245);
          roughnessRgba[o4 + 0] = rByte;
          roughnessRgba[o4 + 1] = rByte;
          roughnessRgba[o4 + 2] = rByte;
          roughnessRgba[o4 + 3] = 255;
        }
      }
    }
  }

  const fakeIsland: Pick<UvIslandMeta, 'pxBounds' | 'materialKind'> = {
    pxBounds: { x: 0, y: 0, w: size, h: size },
    materialKind: 'foliage_leaf',
  };
  const normalRgba = computeIslandNormalsFromHeight(
    heightField,
    coverageMask,
    size,
    size,
    [fakeIsland],
    0.45
  );

  // Dilate RGB & normals into transparent gutters while preserving alpha channel
  dilateAtlasByEdt(
    coverageMask,
    size,
    size,
    albedoRgba,
    normalRgba,
    null,
    roughnessRgba,
    null,
    null,
    true
  );

  const enforceSampling =
    options.pixelArtSampling === true
      ? enforcePixelArtTextureSampling
      : enforceHiFiTextureSampling;

  const albedoMap = enforceSampling(
    new THREE.DataTexture(albedoRgba, size, size, THREE.RGBAFormat),
    'albedo'
  );
  albedoMap.flipY = false;
  albedoMap.needsUpdate = true;

  const normalMap = enforceSampling(
    new THREE.DataTexture(normalRgba, size, size, THREE.RGBAFormat),
    'normal'
  );
  normalMap.flipY = false;
  normalMap.needsUpdate = true;

  const roughnessMap = enforceSampling(
    new THREE.DataTexture(roughnessRgba, size, size, THREE.RGBAFormat),
    'normal'
  );
  roughnessMap.flipY = false;
  roughnessMap.needsUpdate = true;

  return {
    albedoMap,
    normalMap,
    roughnessMap,
    alphaCoverage: Number((opaqueCount / count).toFixed(4)),
    dispose: () => {
      albedoMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

const BAYER4_THRESH = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

function extractTextureRgba(tex: THREE.Texture): {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
} | null {
  const img = tex.image as
    | { data?: Uint8Array | Uint8ClampedArray; width?: number; height?: number }
    | HTMLImageElement
    | HTMLCanvasElement
    | undefined;
  if (!img) return null;

  const w = Math.max(1, Number(img.width ?? 1));
  const h = Math.max(1, Number(img.height ?? 1));

  if ('data' in img && img.data && img.data.length >= w * h * 4) {
    return { data: img.data, width: w, height: h };
  }

  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
      const read = ctx.getImageData(0, 0, w, h);
      return { data: read.data, width: w, height: h };
    }
  }
  return null;
}

/**
 * Quantizes an albedo texture onto an exact discrete palette (optionally with ordered Bayer 4x4 dithering)
 * so exported .GLB assets retain authentic retro palette reduction in external engines without LUT shaders.
 */
export function quantizeTextureToPalette(
  tex: THREE.Texture,
  palette: ColorPaletteConfig,
  applyDither = false
): THREE.DataTexture {
  const extracted = extractTextureRgba(tex);
  if (!extracted || palette.colors.length === 0) {
    const fallback = new Uint8Array([255, 255, 255, 255]);
    const dt = new THREE.DataTexture(fallback, 1, 1, THREE.RGBAFormat);
    dt.colorSpace = THREE.SRGBColorSpace;
    dt.needsUpdate = true;
    return enforcePixelArtTextureSampling(dt);
  }

  const { data: src, width, height } = extracted;
  const out = new Uint8Array(width * height * 4);
  const paletteRgb: RGB[] = palette.colors.map(hexToRgb);
  const prepared = paletteRgb.map(preparePaletteEntry);
  const ditherStrength = applyDither ? Math.max(0.25, palette.ditherStrength || 0.7) : 0;

  // 15-bit RGB quantization lookup memoizes palette matching across large atlases
  const lutMemo = new Map<number, { c1: RGB; c2: RGB; ratio: number }>();

  for (let y = 0; y < height; y++) {
    const rowOff = y * width;
    for (let x = 0; x < width; x++) {
      const p4 = (rowOff + x) * 4;
      const a = src[p4 + 3];
      if (a === 0) {
        out[p4 + 3] = 0;
        continue;
      }
      const r = src[p4 + 0];
      const g = src[p4 + 1];
      const b = src[p4 + 2];
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      const cached = lutMemo.get(key);
      let pair: { c1: RGB; c2: RGB; ratio: number };
      if (cached) {
        pair = cached;
      } else {
        pair = findDitherPair(
          [r, g, b],
          paletteRgb,
          palette.method,
          palette.hsvWeights,
          ditherStrength,
          palette.valueCurveGamma,
          prepared
        );
        lutMemo.set(key, pair);
      }

      let chosen = pair.c1;
      if (applyDither && pair.ratio > 0.01) {
        const thresh = (BAYER4_THRESH[(y & 3) * 4 + (x & 3)] + 0.5) / 16.0;
        if (pair.ratio > thresh) {
          chosen = pair.c2;
        }
      }

      out[p4 + 0] = Math.max(0, Math.min(255, Math.round(chosen[0])));
      out[p4 + 1] = Math.max(0, Math.min(255, Math.round(chosen[1])));
      out[p4 + 2] = Math.max(0, Math.min(255, Math.round(chosen[2])));
      out[p4 + 3] = a;
    }
  }

  const res = new THREE.DataTexture(out, width, height, THREE.RGBAFormat);
  res.colorSpace = THREE.SRGBColorSpace;
  res.flipY = tex.flipY;
  res.wrapS = tex.wrapS;
  res.wrapT = tex.wrapT;
  res.needsUpdate = true;
  return enforcePixelArtTextureSampling(res);
}


