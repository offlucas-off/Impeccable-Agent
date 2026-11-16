import * as THREE from 'three';
import type { ColorPaletteConfig, ColorReductionMethod } from './types';

export const BUILTIN_PALETTES: ColorPaletteConfig[] = [
  {
    id: 'endesga32',
    name: 'Endesga 32 (Pixel Art)',
    colors: [
      '#be4a2f', '#d77643', '#ead4aa', '#e4a672', '#b86f50', '#733e39',
      '#3e2731', '#a22633', '#e43b44', '#f77622', '#feae34', '#fee761',
      '#63c74d', '#3e8948', '#265c42', '#193c3e', '#124e89', '#0099db',
      '#2ce8f5', '#ffffff', '#c0cbdc', '#8b9bb4', '#5a6988', '#3a4466',
      '#262b44', '#181425', '#ff0044', '#68386c', '#b55088', '#f6757a',
      '#e8b796', '#c28569',
    ],
    method: 'hsv_weighted',
    hsvWeights: [0.35, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.85,
    valueCurveGamma: 1.0,
  },
  {
    id: 'pico8',
    name: 'PICO-8 (16 Colors)',
    colors: [
      '#000000', '#1d2b53', '#7e2553', '#008751',
      '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
      '#ff004d', '#ffa300', '#ffec27', '#00e436',
      '#29adff', '#83769c', '#ff77a8', '#ffccaa',
    ],
    method: 'hsv_weighted',
    hsvWeights: [0.32, 0.28, 1.0],
    enableDither: true,
    ditherStrength: 0.9,
    valueCurveGamma: 1.0,
  },
  {
    id: 'gameboy',
    name: 'GameBoy DMG (4 Greens)',
    colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    method: 'value_nearest',
    hsvWeights: [0.0, 0.0, 1.0],
    enableDither: true,
    ditherStrength: 1.0,
    valueCurveGamma: 1.0,
  },
  {
    id: 'sweetie16',
    name: 'Sweetie 16',
    colors: [
      '#1a1c2c', '#5d275d', '#b13e53', '#ef7d57',
      '#ffcd75', '#a7f070', '#38b764', '#257179',
      '#29366f', '#3b5dc9', '#41a6f6', '#73eff7',
      '#f4f4f4', '#94b0c2', '#566c86', '#333c57',
    ],
    method: 'hsv_weighted',
    hsvWeights: [0.35, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.85,
    valueCurveGamma: 1.0,
  },
  {
    id: 'nes',
    name: 'NES (54 Colors)',
    colors: [
      '#7c7c7c', '#0000fc', '#0000bc', '#4428bc', '#940084', '#a80020', '#a81000', '#881400',
      '#503000', '#007800', '#006800', '#005800', '#004058', '#000000', '#bcbcbc', '#0078f8',
      '#0058f8', '#6844fc', '#d800cc', '#e40058', '#f83800', '#e45c10', '#ac7c00', '#00b800',
      '#00a800', '#00a844', '#008888', '#f8f8f8', '#3cbcfc', '#6888fc', '#9878f8', '#f878f8',
      '#f85898', '#f87858', '#fca044', '#f8b800', '#b8f818', '#58d854', '#58f898', '#00e8d8',
      '#787878', '#fcfcfc', '#a4e4fc', '#b8b8f8', '#d8b8f8', '#f8b8f8', '#f8a4c0', '#f0d0b0',
      '#fce0a8', '#f8d878', '#d8f878', '#b8f8b8', '#b8f8d8', '#00fcfc',
    ],
    method: 'rgb_euclidean',
    hsvWeights: [0.3, 0.2, 1.0],
    enableDither: true,
    ditherStrength: 0.75,
    valueCurveGamma: 1.0,
  },
  {
    id: 'snes_pal',
    name: 'PAL / Dark Fantasy (16)',
    colors: [
      '#141013', '#3b1725', '#73172d', '#b4202a',
      '#df3e23', '#fa6a0a', '#f9a31b', '#ffd541',
      '#24523b', '#1a7a3e', '#285cc4', '#249fde',
      '#6d758d', '#b3b9d1', '#dae0ea', '#4a3052',
    ],
    method: 'hsv_weighted',
    hsvWeights: [0.4, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.9,
    valueCurveGamma: 1.05,
  },
  {
    id: 'cga',
    name: 'CGA Mode 4',
    colors: ['#000000', '#55ffff', '#ff55ff', '#ffffff'],
    method: 'rgb_euclidean',
    hsvWeights: [0.2, 0.2, 1.0],
    enableDither: true,
    ditherStrength: 1.0,
    valueCurveGamma: 1.0,
  },
];

export type RGB = [number, number, number]; // 0..255

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0');
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d > 1e-6) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  const s = max <= 1e-6 ? 0 : d / max;
  return [h, s, max];
}

function colorDistance(
  a: RGB,
  b: RGB,
  method: ColorReductionMethod,
  hsvWeights: [number, number, number],
  valueGamma: number
): number {
  if (method === 'rgb_euclidean') {
    const dr = (a[0] - b[0]) / 255;
    const dg = (a[1] - b[1]) / 255;
    const db = (a[2] - b[2]) / 255;
    // Perceptual redmean weighting improves skin/shadow matches
    return 0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db;
  }
  const hsvA = rgbToHsv(a[0], a[1], a[2]);
  const hsvB = rgbToHsv(b[0], b[1], b[2]);
  if (method === 'value_nearest') {
    const lumA = Math.pow(0.299 * (a[0] / 255) + 0.587 * (a[1] / 255) + 0.114 * (a[2] / 255), valueGamma);
    const lumB = 0.299 * (b[0] / 255) + 0.587 * (b[1] / 255) + 0.114 * (b[2] / 255);
    return (lumA - lumB) * (lumA - lumB);
  }
  // hsv_weighted
  let dh = Math.abs(hsvA[0] - hsvB[0]);
  if (dh > 0.5) dh = 1.0 - dh;
  const ds = hsvA[1] - hsvB[1];
  const dv = Math.pow(hsvA[2], valueGamma) - hsvB[2];
  // Scale hue importance by saturation so desaturated greys don't fight hue
  const satFactor = Math.min(hsvA[1], hsvB[1]);
  return (
    hsvWeights[0] * satFactor * (dh * 2.0) ** 2 +
    hsvWeights[1] * ds * ds +
    hsvWeights[2] * dv * dv
  );
}

/**
 * Dual-color ordered dithering lookup pair (C1, C2, mixRatio) for a target RGB color.
 * Approximates ProPixelizer's Palette Builder LUT generation using perceptual error projection.
 */
export function findDitherPair(
  target: RGB,
  paletteRgb: RGB[],
  method: ColorReductionMethod,
  hsvWeights: [number, number, number],
  ditherStrength: number,
  valueGamma: number
): { c1: RGB; c2: RGB; ratio: number } {
  if (paletteRgb.length === 0) {
    return { c1: target, c2: target, ratio: 0 };
  }
  if (paletteRgb.length === 1) {
    return { c1: paletteRgb[0], c2: paletteRgb[0], ratio: 0 };
  }

  // Value-nearest sorted ramp dithering for monochrome / GameBoy palettes
  if (method === 'value_nearest') {
    const sorted = [...paletteRgb].sort(
      (a, b) =>
        0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2] -
        (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2])
    );
    const lums = sorted.map(
      (c) => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255
    );
    const tLum = Math.pow(
      (0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2]) / 255,
      valueGamma
    );
    if (tLum <= lums[0]) return { c1: sorted[0], c2: sorted[0], ratio: 0 };
    if (tLum >= lums[lums.length - 1]) {
      const last = sorted[sorted.length - 1];
      return { c1: last, c2: last, ratio: 0 };
    }
    for (let i = 0; i < sorted.length - 1; i++) {
      if (tLum >= lums[i] && tLum <= lums[i + 1]) {
        const span = Math.max(1e-5, lums[i + 1] - lums[i]);
        const frac = (tLum - lums[i]) / span;
        return {
          c1: sorted[i],
          c2: sorted[i + 1],
          ratio: ditherStrength > 0 ? Math.max(0, Math.min(1, (frac - 0.5) * ditherStrength + 0.5)) : frac >= 0.5 ? 1 : 0,
        };
      }
    }
  }

  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < paletteRgb.length; i++) {
    const d = colorDistance(target, paletteRgb[i], method, hsvWeights, valueGamma);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  const c1 = paletteRgb[bestIdx];
  if (ditherStrength <= 0.001) {
    return { c1, c2: c1, ratio: 0 };
  }

  // Find best companion color c2 whose line segment [c1, c2] minimizes error to target
  let bestC2 = c1;
  let bestT = 0;
  let bestProjErr = bestDist;

  for (let i = 0; i < paletteRgb.length; i++) {
    if (i === bestIdx) continue;
    const cand = paletteRgb[i];
    const vx = (cand[0] - c1[0]) / 255;
    const vy = (cand[1] - c1[1]) / 255;
    const vz = (cand[2] - c1[2]) / 255;
    const lenSq = vx * vx + vy * vy + vz * vz;
    if (lenSq < 1e-6) continue;

    // Limit jump distance so wildly contrasting colors don't dither aggressively
    if (lenSq > 0.75) continue;

    const tx = (target[0] - c1[0]) / 255;
    const ty = (target[1] - c1[1]) / 255;
    const tz = (target[2] - c1[2]) / 255;
    const t = Math.max(0, Math.min(0.5, (tx * vx + ty * vy + tz * vz) / lenSq));

    const mixColor: RGB = [
      c1[0] + (cand[0] - c1[0]) * t,
      c1[1] + (cand[1] - c1[1]) * t,
      c1[2] + (cand[2] - c1[2]) * t,
    ];
    const projErr = colorDistance(target, mixColor, method, hsvWeights, valueGamma);
    if (projErr < bestProjErr * 0.92) {
      bestProjErr = projErr;
      bestC2 = cand;
      bestT = t * ditherStrength;
    }
  }

  return { c1, c2: bestC2, ratio: Math.max(0, Math.min(1, bestT)) };
}

export interface PaletteLutPair {
  primaryTex: THREE.DataTexture;   // 256 x 16 RGBA8: RGB = primary color, A = dither ratio
  secondaryTex: THREE.DataTexture; // 256 x 16 RGBA8: RGB = secondary color, A = 255
  size: number;
}

/**
 * Generates a pair of 16x16x16 (256x16) 3D LUT textures packed in 2D strips.
 * Lookup in shader:
 *   blueSlice = b * 15.0;
 *   slice0 = floor(blueSlice), slice1 = ceil(blueSlice), frac = fract(blueSlice)
 *   Primary & secondary colors are fetched with Nearest/Linear slice interpolation + 4x4 dither threshold!
 */
export function buildPaletteLutPair(config: ColorPaletteConfig): PaletteLutPair {
  const N = 16;
  const width = N * N; // 256
  const height = N;    // 16
  const primaryData = new Uint8Array(width * height * 4);
  const secondaryData = new Uint8Array(width * height * 4);
  const paletteRgb = config.colors.map(hexToRgb);

  for (let b = 0; b < N; b++) {
    for (let g = 0; g < N; g++) {
      for (let r = 0; r < N; r++) {
        const target: RGB = [
          Math.round((r / (N - 1)) * 255),
          Math.round((g / (N - 1)) * 255),
          Math.round((b / (N - 1)) * 255),
        ];
        const { c1, c2, ratio } = findDitherPair(
          target,
          paletteRgb,
          config.method,
          config.hsvWeights,
          config.enableDither ? config.ditherStrength : 0,
          config.valueCurveGamma
        );
        const x = b * N + r;
        const y = g;
        const idx = (y * width + x) * 4;

        primaryData[idx + 0] = Math.round(c1[0]);
        primaryData[idx + 1] = Math.round(c1[1]);
        primaryData[idx + 2] = Math.round(c1[2]);
        primaryData[idx + 3] = Math.round(ratio * 255);

        secondaryData[idx + 0] = Math.round(c2[0]);
        secondaryData[idx + 1] = Math.round(c2[1]);
        secondaryData[idx + 2] = Math.round(c2[2]);
        secondaryData[idx + 3] = 255;
      }
    }
  }

  const primaryTex = new THREE.DataTexture(primaryData, width, height, THREE.RGBAFormat);
  primaryTex.minFilter = THREE.NearestFilter;
  primaryTex.magFilter = THREE.NearestFilter;
  primaryTex.wrapS = THREE.ClampToEdgeWrapping;
  primaryTex.wrapT = THREE.ClampToEdgeWrapping;
  primaryTex.needsUpdate = true;

  const secondaryTex = new THREE.DataTexture(secondaryData, width, height, THREE.RGBAFormat);
  secondaryTex.minFilter = THREE.NearestFilter;
  secondaryTex.magFilter = THREE.NearestFilter;
  secondaryTex.wrapS = THREE.ClampToEdgeWrapping;
  secondaryTex.wrapT = THREE.ClampToEdgeWrapping;
  secondaryTex.needsUpdate = true;

  return { primaryTex, secondaryTex, size: N };
}

/**
 * Extracts up to maxColors unique hex colors from an uploaded HTMLImageElement / ImageBitmap.
 */
export function extractPaletteFromImage(
  img: HTMLImageElement | HTMLCanvasElement,
  maxColors = 32
): string[] {
  const canvas = document.createElement('canvas');
  const w = Math.min(128, img.width || 64);
  const h = Math.min(128, img.height || 64);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;
  const counts = new Map<string, number>();

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    const hex = rgbToHex([pixels[i], pixels[i + 1], pixels[i + 2]]);
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([hex]) => hex);
}

/**
 * Renders the primary LUT texture as a downloadable PNG data URL.
 */
export function exportPaletteLutToDataUrl(lut: PaletteLutPair): string {
  const width = lut.size * lut.size;
  const height = lut.size;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(width, height);
  const src = lut.primaryTex.image.data as Uint8Array;
  imgData.data.set(src);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
