import * as THREE from 'three';
import {
  PixelizerMaterial,
  enforcePixelArtTextureSampling,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerMaterialOptions } from '../types';
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
  applyHeightGtaoAndWear,
  bakeVertexAoAndCreases,
  subdivideForAo,
} from './VertexAndTexelBaker';

export interface SynthesizedMaterialTextures {
  albedoMap: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  emissionMap: THREE.DataTexture | null;
  hasEmission: boolean;
  texWidth: number;
  texHeight: number;
  quality: TextureQualityMetrics;
  dispose: () => void;
}

export interface SynthMaterialOptions {
  seed?: number;
  gtaoStrength?: number;
  gtaoRadiusPx?: number;
  normalStrength?: number;
  rarityTier?: 'normal' | 'common' | 'rare' | 'epic' | 'legendary';
  eyeHex?: string;
  eyeGlowHex?: string | null;
  browHex?: string;
  emblemHex?: string;
  emissiveRuneHex?: string | null;
  usePool?: boolean;
  cacheKey?: string;
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

const MAX_POOLED_BUNDLES = 96;
const MATERIAL_TEXTURE_POOL = new Map<string, SynthesizedMaterialTextures>();

function markTexturePooling(tex: THREE.DataTexture, pooled: boolean): void {
  tex.userData = { ...tex.userData, pooled };
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
  if (created.emissionMap) markTexturePooling(created.emissionMap, true);

  MATERIAL_TEXTURE_POOL.set(cacheKey, created);
  if (MATERIAL_TEXTURE_POOL.size > MAX_POOLED_BUNDLES) {
    const oldestKey = MATERIAL_TEXTURE_POOL.keys().next().value;
    if (oldestKey !== undefined) {
      const oldest = MATERIAL_TEXTURE_POOL.get(oldestKey);
      MATERIAL_TEXTURE_POOL.delete(oldestKey);
      if (oldest) {
        oldest.albedoMap.dispose();
        oldest.normalMap.dispose();
        oldest.emissionMap?.dispose();
      }
    }
  }
  return created;
}

export function clearPooledMaterialTextures(): void {
  for (const bundle of MATERIAL_TEXTURE_POOL.values()) {
    bundle.albedoMap.dispose();
    bundle.normalMap.dispose();
    bundle.emissionMap?.dispose();
  }
  MATERIAL_TEXTURE_POOL.clear();
}

// ---------------------------------------------------------------------------
// Color, Deterministic Spatial Hash & 2-Pass EDT Dilation Utilities
// ---------------------------------------------------------------------------

function hexToRgb255(hex: string): [number, number, number] {
  const c = new THREE.Color(hex);
  const srgb = new THREE.Color();
  c.getRGB(srgb, THREE.SRGBColorSpace);
  return [
    Math.max(10, Math.min(246, Math.round(srgb.r * 255))),
    Math.max(10, Math.min(246, Math.round(srgb.g * 255))),
    Math.max(10, Math.min(246, Math.round(srgb.b * 255))),
  ];
}

/**
 * Pixel-art hue-shifted tone variation: shadows shift slightly cooler toward indigo,
 * highlights shift slightly warmer toward ivory-gold, never hitting pure 0 or 255.
 */
function shadeHueShiftRgb(
  base: [number, number, number],
  delta: number
): [number, number, number] {
  let r = base[0];
  let g = base[1];
  let b = base[2];
  if (delta >= 0) {
    const t = Math.min(0.45, delta);
    r = r + (242 - r) * t;
    g = g + (236 - g) * t * 0.95;
    b = b + (220 - b) * t * 0.85;
  } else {
    const t = Math.min(0.6, -delta);
    r = r * (1 - t * 0.78) + 28 * t;
    g = g * (1 - t * 0.8) + 28 * t;
    b = b * (1 - t * 0.66) + 48 * t;
  }
  return [
    Math.max(14, Math.min(244, Math.round(r))),
    Math.max(14, Math.min(244, Math.round(g))),
    Math.max(14, Math.min(244, Math.round(b))),
  ];
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const k = Math.max(0, Math.min(1, t));
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

function dilateAtlasByEdt(
  mask: Uint8Array,
  width: number,
  height: number,
  albedoRgba: Uint8Array,
  normalRgba: Uint8Array,
  emissionRgba: Uint8Array | null
): void {
  const n = width * height;
  const maxDim = Math.max(width, height);
  const inf = 1e12;

  const colDist = new Float64Array(n);
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

  for (let i = 0; i < n; i++) {
    if (mask[i]) continue;
    const src = nearestSrc[i];
    if (!mask[src] || maxDim <= 0) continue;
    const s4 = src * 4;
    const d4 = i * 4;
    albedoRgba[d4 + 0] = copyAlbedo[s4 + 0];
    albedoRgba[d4 + 1] = copyAlbedo[s4 + 1];
    albedoRgba[d4 + 2] = copyAlbedo[s4 + 2];
    albedoRgba[d4 + 3] = 255;

    normalRgba[d4 + 0] = copyNormal[s4 + 0];
    normalRgba[d4 + 1] = copyNormal[s4 + 1];
    normalRgba[d4 + 2] = copyNormal[s4 + 2];
    normalRgba[d4 + 3] = 255;

    if (emissionRgba && copyEmission) {
      emissionRgba[d4 + 0] = copyEmission[s4 + 0];
      emissionRgba[d4 + 1] = copyEmission[s4 + 1];
      emissionRgba[d4 + 2] = copyEmission[s4 + 2];
      emissionRgba[d4 + 3] = 255;
    }
  }
}

// ---------------------------------------------------------------------------
// Sobel Height -> Gentle Tangent-Space Normal Map (Pass 3 safe)
// ---------------------------------------------------------------------------

function computeIslandNormalsFromHeight(
  heightField: Float32Array,
  coverageMask: Uint8Array,
  width: number,
  height: number,
  islands: Pick<UvIslandMeta, 'pxBounds'>[],
  normalStrength: number
): Uint8Array {
  const out = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4 + 0] = 128;
    out[i * 4 + 1] = 128;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = 255;
  }

  // Clamp subtle slope <= 0.24 (< 14 deg, so Pass 3 normalEdgeThreshold=0.14..0.22 ignores flat brick surfaces!)
  const strength = Math.max(0, Math.min(0.95, normalStrength)) * 0.45;
  if (strength <= 1e-4) return out;

  for (const isl of islands) {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(width - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(height - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    for (let y = y0; y <= y1; y++) {
      const ym = Math.max(y0, y - 1);
      const yp = Math.min(y1, y + 1);
      for (let x = x0; x <= x1; x++) {
        const idx = y * width + x;
        if (!coverageMask[idx]) continue;
        const xm = Math.max(x0, x - 1);
        const xp = Math.min(x1, x + 1);

        // 3x3 Sobel gradients on island-clamped heightfield
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

        let nx = Math.max(-0.24, Math.min(0.24, -dhdu * strength));
        let ny = Math.max(-0.24, Math.min(0.24, -dhdv * strength));
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
// Material Recipe Pattern Generators (Clean Pixel-Art, Zero Salt-and-Pepper Noise)
// ---------------------------------------------------------------------------

interface TexelSample {
  rgb: [number, number, number];
  height: number;
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
  const v = h > 1 ? ly / (h - 1) : 0.5;
  const onPerimeter = lx === 0 || ly === 0 || lx === w - 1 || ly === h - 1;
  const gradV = (v - 0.5) * 0.22; // crisp top-to-bottom cel tone falloff

  switch (recipe) {
    case 'stone_masonry':
    case 'mossy_cobble': {
      const tinyTrim = w <= 4 || h <= 4;
      if (tinyTrim) {
        const block = Math.floor((lx + ly * 2) / 2);
        const grain = ((block % 3) - 1) * 0.08 + ((lx + ly * 2) / Math.max(2, w + h) - 0.5) * 0.16;
        let rgb = shadeHueShiftRgb(baseRgb, grain + gradV * 0.45);
        let heightVal = 0.68 + grain * 0.35;
        if (recipe === 'mossy_cobble' && (ly === 0 || (lx === 0 && seed % 2 === 0))) {
          rgb = mixRgb(rgb, accentRgb, 0.5);
          heightVal += 0.06;
        }
        return { rgb, height: heightVal };
      }
      const rowH = h >= 12 ? 6 : 4;
      const colW = w >= 14 ? 8 : 5;
      const brickRow = Math.floor(ly / rowH);
      const staggerX = (brickRow % 2) * Math.floor(colW * 0.5);
      const bx = (lx + staggerX) % colW;
      const by = ly % rowH;
      const brickCol = Math.floor((lx + staggerX) / colW);
      const mortar = bx === 0 || by === 0;
      const brickId = hash2d(brickCol, brickRow, seed);
      const brickDelta = (brickId - 0.5) * 0.15 + (by === rowH - 1 ? 0.06 : 0) + gradV * 0.35;
      let rgb = mortar
        ? shadeHueShiftRgb(baseRgb, -0.22)
        : shadeHueShiftRgb(baseRgb, brickDelta);
      let heightVal = mortar ? 0.3 : 0.72 + (brickId - 0.5) * 0.12;
      if (recipe === 'mossy_cobble') {
        const mx = Math.floor(lx / 2);
        const my = Math.floor(ly / 2);
        const mossPatch = smoothNoise2d(mx * 0.42, my * 0.42, seed + 71);
        if ((v < 0.34 && mossPatch > 0.44) || (mortar && mossPatch > 0.6)) {
          rgb = mixRgb(rgb, accentRgb, 0.68);
          heightVal += 0.07;
        }
      }
      return { rgb, height: heightVal };
    }

    case 'wood_planks':
    case 'timber_frame': {
      const plankW = w >= 14 ? 5 : 4;
      const plankIdx = Math.floor(lx / plankW);
      const seam = lx % plankW === 0 && w >= 6;
      const narrowFiber =
        w < 6 || h < 6 ? ((Math.floor(lx / 2) + Math.floor(ly / 2) + seed) % 3 - 1) * 0.07 : 0;
      const clusterY = Math.floor(ly / 2);
      const grain =
        Math.sin((clusterY + plankIdx * 2) * 0.9 + hash2d(plankIdx, 0, seed) * 4) * 0.065 +
        narrowFiber;
      const plankVar = (hash2d(plankIdx, 19, seed) - 0.5) * 0.14;
      const nailSpot =
        !seam &&
        lx % plankW === Math.floor(plankW * 0.5) &&
        (ly === 1 || ly === h - 2) &&
        h >= 8;
      if (nailSpot) {
        return { rgb: shadeHueShiftRgb(accentRgb, -0.06), height: 0.88 };
      }
      if (seam) {
        return { rgb: shadeHueShiftRgb(baseRgb, -0.22), height: 0.34 };
      }
      return {
        rgb: shadeHueShiftRgb(baseRgb, plankVar + grain + gradV * 0.35),
        height: 0.72 + grain * 0.35,
      };
    }

    case 'roof_shingle': {
      if (w <= 4 || h <= 4) {
        const slope = ((lx + ly * 2) / Math.max(2, w + h * 2) - 0.4) * 0.22;
        return {
          rgb: shadeHueShiftRgb(baseRgb, slope),
          height: 0.62 + slope * 0.35,
        };
      }
      const courseH = h >= 12 ? 6 : 4;
      const tileW = w >= 12 ? 6 : 4;
      const row = Math.floor(ly / courseH);
      const stag = (row % 2) * Math.floor(tileW * 0.5);
      const col = Math.floor((lx + stag) / tileW);
      const shadowLip = ly % courseH === 0;
      const topRidge = ly % courseH === courseH - 1;
      const vEdge = (lx + stag) % tileW === 0;
      const idVar = (hash2d(col, row, seed + 33) - 0.5) * 0.11;
      const slopeShade = (v - 0.3) * 0.12 + (topRidge ? 0.06 : 0);
      const rgb = shadowLip
        ? shadeHueShiftRgb(baseRgb, -0.18)
        : vEdge
          ? shadeHueShiftRgb(baseRgb, -0.09)
          : shadeHueShiftRgb(baseRgb, idVar + slopeShade);
      const stepSlope = ((ly % courseH) / Math.max(1, courseH - 1)) * 0.28;
      return { rgb, height: shadowLip ? 0.34 : 0.6 + stepSlope };
    }

    case 'plaster_wall': {
      const mx = Math.floor(lx / 3);
      const my = Math.floor(ly / 3);
      const macro = smoothNoise2d(mx * 0.48, my * 0.48, seed + 19) - 0.5;
      const trimEdge = (ly === 0 || ly === h - 1 || lx === 0 || lx === w - 1) && w >= 6 && h >= 6;
      const diagBevel = w < 6 || h < 6 ? ((lx + ly * 2) / Math.max(2, w + h) - 0.5) * 0.18 : 0;
      const rgb = trimEdge
        ? shadeHueShiftRgb(accentRgb, -0.08)
        : shadeHueShiftRgb(baseRgb, macro * 0.14 + diagBevel + gradV * 0.4);
      return { rgb, height: trimEdge ? 0.82 : 0.62 + macro * 0.12 };
    }

    case 'forged_steel':
    case 'brushed_gold':
    case 'rarity_armor': {
      // Crisp cel armor sheen band & bevel rim with zero high-frequency sparkle noise
      const sheenBand = Math.exp(-Math.pow((v - 0.68) * 3.0, 2)) * 0.18;
      const diag = w < 5 || h < 5 ? ((lx * 0.9 + ly * 1.3) / Math.max(2, w + h) - 0.5) * 0.18 : 0;
      const macroBrush =
        (smoothNoise2d(Math.floor(lx / 2) * 0.35, Math.floor(ly / 2) * 0.45, seed) - 0.5) * 0.08 +
        diag;
      const borderHigh = onPerimeter && w >= 4 && h >= 4;
      const cornerRivet =
        w >= 9 &&
        h >= 9 &&
        ((lx === 1 || lx === w - 2) && (ly === 1 || ly === h - 2));

      let rgb = shadeHueShiftRgb(baseRgb, gradV * 0.55 + sheenBand + macroBrush);
      let heightVal = 0.72 + sheenBand * 0.22;
      let emissiveRgb: [number, number, number] | undefined;

      if (borderHigh) {
        const edgeCol = recipe === 'rarity_armor' ? accentRgb : baseRgb;
        rgb = mixRgb(shadeHueShiftRgb(edgeCol, 0.18), rgb, 0.3);
        heightVal = 0.86;
      }
      if (cornerRivet) {
        rgb = shadeHueShiftRgb(accentRgb, 0.2);
        heightVal = 0.94;
      }

      // Rare / Epic / Legendary trim runes along centerline when island large enough
      if (
        recipe === 'rarity_armor' &&
        (rarityTier === 'rare' || rarityTier === 'epic' || rarityTier === 'legendary') &&
        w >= 8 &&
        h >= 8
      ) {
        const cx = Math.floor(w * 0.5);
        const cy = Math.floor(h * 0.5);
        const manhattan = Math.abs(lx - cx) + Math.abs(ly - cy);
        if (manhattan <= 1) {
          emissiveRgb = mixRgb(accentRgb, [242, 240, 224], 0.3);
          rgb = emissiveRgb;
          heightVal = 0.95;
        }
      }
      return { rgb, height: heightVal, emissiveRgb };
    }

    case 'stitched_leather':
    case 'woven_cloth': {
      const wave = Math.sin(lx * 0.95 + ly * 0.45) * 0.055;
      const crease = smoothNoise2d(lx * 0.24, ly * 0.16, seed + 51) - 0.5;
      const isStitch =
        recipe === 'stitched_leather' &&
        (lx === 1 || lx === w - 2 || ly === 1 || ly === h - 2) &&
        ((lx + ly) % 2 === 0) &&
        w >= 6 &&
        h >= 6;
      if (isStitch) {
        return { rgb: shadeHueShiftRgb(accentRgb, 0.25), height: 0.85 };
      }
      const rgb = shadeHueShiftRgb(baseRgb, crease * 0.26 + wave + gradV * 0.65);
      return { rgb, height: 0.62 + crease * 0.18 + wave * 0.4 };
    }

    case 'human_skin':
    case 'goblin_skin':
    case 'orc_hide':
    case 'demon_hide': {
      const organic = smoothNoise2d(lx * 0.24, ly * 0.24, seed + 93) - 0.5;
      const ridge =
        recipe === 'demon_hide' || recipe === 'orc_hide'
          ? Math.abs(Math.sin(lx * 0.55 + ly * 0.55 + organic * 2.5)) * 0.14
          : 0;
      const scaleSpot =
        recipe === 'demon_hide' && hash2d(Math.floor(lx / 2), Math.floor(ly / 2), seed + 17) > 0.72
          ? -0.14
          : 0;
      return {
        rgb: shadeHueShiftRgb(baseRgb, organic * 0.22 + ridge + scaleSpot + gradV * 0.7),
        height: 0.66 + organic * 0.2 + ridge,
      };
    }

    case 'magma_obsidian': {
      const crackVal = Math.abs(smoothNoise2d(lx * 0.26, ly * 0.26, seed + 111) - 0.5);
      const isCrack = crackVal < 0.065;
      if (isCrack) {
        const glow = mixRgb(accentRgb, [252, 204, 108], 0.35);
        return { rgb: glow, height: 0.25, emissiveRgb: glow };
      }
      const chip = (hash2d(Math.floor(lx / 2), Math.floor(ly / 2), seed) - 0.5) * 0.18;
      return { rgb: shadeHueShiftRgb(baseRgb, chip + gradV * 0.45), height: 0.78 };
    }

    case 'runic_glow': {
      const border = onPerimeter && w >= 4 && h >= 4;
      const glyph = ((lx ^ ly) % 3 === 0) && w >= 5 && h >= 5;
      const rgb = border
        ? shadeHueShiftRgb(accentRgb, 0.25)
        : glyph
          ? mixRgb(baseRgb, [242, 240, 232], 0.45)
          : shadeHueShiftRgb(baseRgb, gradV * 0.4);
      return { rgb, height: glyph ? 0.9 : 0.65, emissiveRgb: rgb };
    }

    case 'bone_ivory': {
      const striation = Math.sin(ly * 0.7 + hash2d(lx, 0, seed) * 2) * 0.08;
      return {
        rgb: shadeHueShiftRgb(baseRgb, striation + gradV * 0.6),
        height: 0.72 + striation * 0.5,
      };
    }

    case 'foliage_leaf': {
      const cluster = smoothNoise2d(lx * 0.35, ly * 0.35, seed + 21);
      const leaf = (hash2d(Math.floor(lx / 2), Math.floor(ly / 2), seed + 5) - 0.5) * 0.25;
      return {
        rgb: shadeHueShiftRgb(baseRgb, (cluster - 0.45) * 0.35 + leaf + gradV * 0.65),
        height: 0.55 + cluster * 0.35,
      };
    }

    case 'water_pool': {
      const ripple = Math.sin(lx * 0.7 + ly * 0.7) * 0.12 + (smoothNoise2d(lx * 0.25, ly * 0.25, seed) - 0.5) * 0.2;
      const foam = ripple > 0.14;
      return {
        rgb: foam ? mixRgb(baseRgb, [224, 242, 248], 0.55) : shadeHueShiftRgb(baseRgb, ripple),
        height: 0.5 + ripple * 0.3,
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
  opts: SynthMaterialOptions
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
    emitRgb?: [number, number, number]
  ) => {
    if (lx < 0 || ly < 0 || lx >= w || ly >= h) return;
    const gx = x0 + lx;
    const gy = y0 + ly;
    const idx = gy * width + gx;
    const o4 = idx * 4;
    albedoRgba[o4 + 0] = Math.max(12, Math.min(245, rgb[0]));
    albedoRgba[o4 + 1] = Math.max(12, Math.min(245, rgb[1]));
    albedoRgba[o4 + 2] = Math.max(12, Math.min(245, rgb[2]));
    heightField[idx] = heightVal;
    if (emitRgb) {
      emissionRgba[o4 + 0] = emitRgb[0];
      emissionRgba[o4 + 1] = emitRgb[1];
      emissionRgba[o4 + 2] = emitRgb[2];
      emissionRgba[o4 + 3] = 255;
      wroteEmission = true;
    }
  };

  if (isl.landmarkKind === 'head_front') {
    const sclera: [number, number, number] = [232, 238, 244];
    const irisRgb = hexToRgb255(opts.eyeHex ?? '#2c68b8');
    const glowRgb = opts.eyeGlowHex ? hexToRgb255(opts.eyeGlowHex) : undefined;
    const browRgb = hexToRgb255(opts.browHex ?? '#352620');
    const skinBase = hexToRgb255(isl.baseHex);

    // Symmetry eyes positioned nicely in upper-mid face (v ~ 0.45..0.60)
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
            eyeSpan >= 3 ? dx === (side < 0 ? 1 : 1) : dx === (side < 0 ? 1 : 0);
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
          setPx(exStart + dx, eyeY + dy, col, glowRgb ? 0.85 : 0.42, glowRgb);
        }
      }
      // Expressive eyebrow 1-2px above eye
      const browY = Math.min(h - 2, eyeY + eyeHeight + 1);
      for (let dx = -1; dx <= eyeSpan; dx++) {
        setPx(exStart + dx, browY, browRgb, 0.82);
      }
    }

    // Subtle nose / cheek blush & mouth / chin anchor (flipY=false -> smaller y is chin!)
    const mouthY = Math.max(1, Math.round(h * 0.22));
    const noseY = Math.round((eyeY + mouthY) * 0.5);
    setPx(cx, noseY, shadeHueShiftRgb(skinBase, -0.18), 0.78);
    if (w >= 14) {
      setPx(cx - 1, mouthY, shadeHueShiftRgb(skinBase, -0.28), 0.45);
      setPx(cx, mouthY, shadeHueShiftRgb(skinBase, -0.28), 0.45);
      setPx(cx + 1, mouthY, shadeHueShiftRgb(skinBase, -0.28), 0.45);
    }
    return wroteEmission;
  }

  if (isl.landmarkKind === 'door_front') {
    const iron = hexToRgb255('#343944');
    const brass = hexToRgb255(opts.emblemHex ?? '#d4a644');
    const strap1 = Math.round(h * 0.28);
    const strap2 = Math.round(h * 0.72);
    for (let lx = 0; lx < w; lx++) {
      setPx(lx, strap1, iron, 0.88);
      setPx(lx, strap2, iron, 0.88);
    }
    // Chunky brass ring / handle on right edge
    const hx = Math.max(2, Math.round(w * 0.75));
    const hy = Math.round(h * 0.48);
    setPx(hx, hy, brass, 0.94);
    setPx(hx, hy - 1, shadeHueShiftRgb(brass, -0.2), 0.9);
    setPx(hx - 1, hy, shadeHueShiftRgb(brass, 0.2), 0.92);
    return wroteEmission;
  }

  if (isl.landmarkKind === 'chest_crest' || isl.landmarkKind === 'shield_face') {
    const cx = Math.floor(w * 0.5);
    const cy = Math.floor(h * 0.54);
    const accent = hexToRgb255(opts.emblemHex ?? isl.accentHex ?? '#d6b45a');
    const runeGlow = opts.emissiveRuneHex ? hexToRgb255(opts.emissiveRuneHex) : undefined;
    const rad = Math.max(2, Math.min(4, Math.floor(Math.min(w, h) * 0.22)));

    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        const man = Math.abs(dx) + Math.abs(dy);
        if (man > rad) continue;
        const isCore = man <= Math.max(0, rad - 2);
        const col = isCore && runeGlow ? runeGlow : isCore ? shadeHueShiftRgb(accent, 0.25) : accent;
        setPx(cx + dx, cy + dy, col, 0.92, isCore ? runeGlow : undefined);
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
      setPx(cx, cy + k, glow, 0.85, glow);
      if (Math.abs(k) === Math.floor(span * 0.6)) {
        setPx(cx - 1, cy + k, glow, 0.85, glow);
        setPx(cx + 1, cy + k, glow, 0.85, glow);
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

    const albedoRgba = new Uint8Array(count * 4);
    const emissionRgba = new Uint8Array(count * 4);
    const heightField = new Float32Array(count).fill(0.5);
    const coverageMask = new Uint8Array(count);

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
          heightField[idx] = sample.height;
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

      if (applySemanticLandmark(isl, w, heightField, albedoRgba, emissionRgba, options)) {
        hasEmission = true;
      }
    }

    // Apply Phase 4B texel-space Horizon AO + Laplacian Curvature Wear + Vertical Grime
    applyHeightGtaoAndWear(heightField, coverageMask, w, h, unwrapped.islands, albedoRgba, {
      gtaoStrength: options.gtaoStrength ?? 0.55,
      gtaoRadiusPx: options.gtaoRadiusPx ?? 3,
      curvatureStrength: 0.22,
      verticalGrimeStrength: 0.2,
    });

    // Compute subtle tangent-space Sobel normals (clamped so Pass 3 ignores flat areas)
    const normalRgba = computeIslandNormalsFromHeight(
      heightField,
      coverageMask,
      w,
      h,
      unwrapped.islands,
      options.normalStrength ?? 0.36
    );

    // Dilate valid texels across padding gutters via 2-pass Felzenszwalb EDT
    dilateAtlasByEdt(
      coverageMask,
      w,
      h,
      albedoRgba,
      normalRgba,
      hasEmission ? emissionRgba : null
    );

    const quality = measureTextureQuality(albedoRgba, unwrapped.islands, w, h);

    const albedoMap = enforcePixelArtTextureSampling(
      new THREE.DataTexture(albedoRgba, w, h, THREE.RGBAFormat),
      'albedo'
    );
    albedoMap.flipY = false;
    albedoMap.needsUpdate = true;
    markTexturePooling(albedoMap, false);

    const normalMap = enforcePixelArtTextureSampling(
      new THREE.DataTexture(normalRgba, w, h, THREE.RGBAFormat),
      'normal'
    );
    normalMap.flipY = false;
    normalMap.needsUpdate = true;
    markTexturePooling(normalMap, false);

    let emissionMap: THREE.DataTexture | null = null;
    if (hasEmission) {
      emissionMap = enforcePixelArtTextureSampling(
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
      emissionMap,
      hasEmission,
      texWidth: w,
      texHeight: h,
      quality,
      dispose: () => {
        if (albedoMap.userData?.pooled !== true) albedoMap.dispose();
        if (normalMap.userData?.pooled !== true) normalMap.dispose();
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
// Shared Modular Tileset Sheet Atlas (`256x256` @ 32 px/m -> 0 overlaps, ultra-fast!)
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
  { id: 'floor_a', recipe: 'stone_masonry', baseHex: '#566470', accentHex: '#697a88', x: 4, y: 4, w: 48, h: 48, lockVertical: false },
  { id: 'floor_b', recipe: 'stone_masonry', baseHex: '#4f5c68', accentHex: '#60707c', x: 60, y: 4, w: 48, h: 48, lockVertical: false },
  { id: 'floor_moss', recipe: 'mossy_cobble', baseHex: '#505f66', accentHex: '#4a7a42', x: 116, y: 4, w: 48, h: 48, lockVertical: false },
  { id: 'floor_rune', recipe: 'runic_glow', baseHex: '#455a6e', accentHex: '#4ee6a8', x: 172, y: 4, w: 48, h: 48, lockVertical: false, landmark: 'rune_panel' },
  { id: 'wall_stone', recipe: 'stone_masonry', baseHex: '#677482', accentHex: '#808e9c', x: 4, y: 60, w: 48, h: 88, lockVertical: true },
  { id: 'wall_moss', recipe: 'mossy_cobble', baseHex: '#627079', accentHex: '#4e8344', x: 60, y: 60, w: 48, h: 88, lockVertical: true },
  { id: 'plaza_cobble', recipe: 'mossy_cobble', baseHex: '#8d8678', accentHex: '#6d7f55', x: 116, y: 60, w: 48, h: 48, lockVertical: false },
  { id: 'timber_curb', recipe: 'wood_planks', baseHex: '#734e32', accentHex: '#513724', x: 172, y: 60, w: 48, h: 48, lockVertical: true },
];

export function synthesizeModularTilesetSheet(
  biome: 'dungeon_ruins' | 'starter_city' = 'dungeon_ruins',
  seed = 777,
  gtaoStrength = 0.55,
  normalStrength = 0.35
): ModularTilesetSheet {
  const key = `tileset_sheet:${biome}:${seed}:${Math.round(gtaoStrength * 20)}:${Math.round(normalStrength * 20)}`;
  const size = 256;

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
      texelsPerMeter: 32,
      triIndices: [],
    };
  });

  const textures = acquirePooledMaterialTextures(key, () => {
    const fakeUnwrapped: UnwrappedAtlasResult = {
      geometry: new THREE.BufferGeometry(),
      texWidth: size,
      texHeight: size,
      texelsPerMeter: 32,
      paddingPx: 4,
      islands,
      triIslandIds: new Int32Array(0),
    };
    const out = synthesizeAtlasTextures(fakeUnwrapped, {
      seed,
      gtaoStrength,
      normalStrength,
      emissiveRuneHex: '#4ee6a8',
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
  normalStrength = 0.36
): ModularTilesetSheet {
  const colKey = `${colors.wallCol}_${colors.trimCol}_${colors.floorCol}_${colors.accentCol}`;
  const key = `struct_sheet:${biome}:${colKey}:${seed}:${Math.round(gtaoStrength * 20)}:${Math.round(normalStrength * 20)}`;
  const size = 256;

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
    { id: 'wall', recipe: wallRecipe, baseHex: colors.wallCol, accentHex: colors.trimCol, x: 4, y: 4, w: 76, h: 76, lockVertical: true },
    { id: 'trim', recipe: trimRecipe, baseHex: colors.trimCol, accentHex: colors.wallCol, x: 88, y: 4, w: 76, h: 76, lockVertical: true },
    { id: 'floor', recipe: floorRecipe, baseHex: colors.floorCol, accentHex: colors.trimCol, x: 172, y: 4, w: 76, h: 76, lockVertical: false },
    { id: 'roof', recipe: roofRecipe, baseHex: colors.accentCol, accentHex: colors.trimCol, x: 4, y: 88, w: 76, h: 76, lockVertical: false },
    {
      id: 'accent',
      recipe: accentRecipe,
      baseHex: colors.accentCol,
      accentHex: colors.trimCol,
      x: 88,
      y: 88,
      w: 76,
      h: 76,
      lockVertical: true,
      landmark: biome === 'dungeon' || biome === 'scifi' ? 'rune_panel' : 'none',
    },
    { id: 'wood', recipe: 'wood_planks', baseHex: '#6d482e', accentHex: '#3d2718', x: 172, y: 88, w: 76, h: 76, lockVertical: true },
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
    texelsPerMeter: 32,
    triIndices: [],
  }));

  const hasGlow = biome === 'dungeon' || biome === 'scifi';
  const textures = acquirePooledMaterialTextures(key, () => {
    const fakeUnwrapped: UnwrappedAtlasResult = {
      geometry: new THREE.BufferGeometry(),
      texWidth: size,
      texHeight: size,
      texelsPerMeter: 32,
      paddingPx: 4,
      islands,
      triIslandIds: new Int32Array(0),
    };
    const out = synthesizeAtlasTextures(fakeUnwrapped, {
      seed,
      gtaoStrength,
      normalStrength,
      emissiveRuneHex: hasGlow ? colors.accentCol : null,
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
 * Unwraps, bakes vertex AO/creases, synthesizes procedural pixel-art PBR textures, and
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
      texelsPerMeter: options.texelsPerMeter ?? 32,
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

  // Skinned meshes must not alter topology/vertex counts during bake
  const subdivideEdgeM = options.partTagToBoneIndex ? 0 : (options.subdivideMaxEdgeM ?? 0);
  const willSubdivide = subdivideEdgeM > 0;

  const unwrapped = unwrapPixelAligned(parts, {
    texelsPerMeter: options.texelsPerMeter ?? 32,
    paddingPx: options.paddingPx ?? 3,
    minAtlasSize: options.minAtlasSize ?? 64,
    maxAtlasSize: options.maxAtlasSize ?? 1024,
    islandChartCosThreshold: options.islandChartCosThreshold ?? 0.91,
    computeTangents: !willSubdivide,
    vertexColorMode: 'white_for_ao',
  });

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
    const subGeo = subdivideForAo(outGeo, subdivideEdgeM);
    outGeo.dispose();
    subGeo.userData = { ...subGeo.userData, ...savedUserData };
    computeGeometryTangents(subGeo);
    outGeo = subGeo;
  }

  const aoStrength = options.aoStrength ?? 0.55;
  const gtaoStrength = options.gtaoStrength ?? Math.min(0.85, aoStrength);
  const normalStrength = options.normalStrength ?? 0.36;

  bakeVertexAoAndCreases(outGeo, {
    rays: options.aoRays ?? 16,
    maxDist: options.aoMaxDist ?? 0.65,
    strength: aoStrength,
    creaseBoost: options.creaseBoost ?? (aoStrength <= 0.01 ? 0 : 0.06),
  });

  const effectiveCacheKey = options.cacheKey
    ? `${options.cacheKey}:s${seed}:g${Math.round(gtaoStrength * 20)}:n${Math.round(normalStrength * 20)}:${options.rarityTier ?? 'normal'}`
    : undefined;

  const textures = synthesizeAtlasTextures(unwrapped, {
    seed,
    gtaoStrength,
    gtaoRadiusPx: options.gtaoRadiusPx ?? 3,
    normalStrength,
    rarityTier: options.rarityTier ?? 'normal',
    eyeHex: options.eyeHex,
    eyeGlowHex: options.eyeGlowHex,
    browHex: options.browHex,
    emblemHex: options.emblemHex,
    emissiveRuneHex: options.emissiveRuneHex,
    usePool: Boolean(options.usePool && effectiveCacheKey),
    cacheKey: effectiveCacheKey,
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

  return {
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
}

/**
 * Creates a `PixelizerMaterial` pre-configured for a `BakedAssetResult`, automatically wiring
 * `albedoMap`, `normalMap`, `useVertexTangents`, `emissionMap`, and safe linear vertex tints.
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
    smoothness: 0.25,
    albedoMap: baked.textures?.albedoMap ?? null,
    normalMap: baked.textures?.normalMap ?? null,
    normalScale: hasTex ? 0.85 : 1.0,
    useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
    emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
    emissionColor: hasEmission ? '#ffffff' : '#000000',
    emissionIntensity: hasEmission ? 1.15 : 0.0,
    ...matOverrides,
  };

  const mat = new PixelizerMaterial(opts, sharedResources);
  mat.vertexColors = true;
  return mat;
}

