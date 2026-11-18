import * as THREE from 'three';
import type { DitherPattern } from './types';

export const BUILTIN_DITHER_PATTERNS: DitherPattern[] = [
  {
    id: 'bayer4x4',
    name: 'Bayer 4×4 (Ordered)',
    size: 4,
    thresholds: [
      0, 8, 2, 10,
      12, 4, 14, 6,
      3, 11, 1, 9,
      15, 7, 13, 5,
    ],
  },
  {
    id: 'bayer8x8',
    name: 'Bayer 8×8 (Smooth Ordered)',
    size: 8,
    thresholds: [
      0, 32, 8, 40, 2, 34, 10, 42,
      48, 16, 56, 24, 50, 18, 58, 26,
      12, 44, 4, 36, 14, 46, 6, 38,
      60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41,
      51, 19, 59, 27, 49, 17, 57, 25,
      15, 47, 7, 39, 13, 45, 5, 37,
      63, 31, 55, 23, 61, 29, 53, 21,
    ],
  },
  {
    id: 'bluenoise8x8',
    name: 'Blue Noise 8×8 (Void & Cluster)',
    size: 8,
    thresholds: [
      34, 29, 17, 21, 30, 35, 12, 6,
      10, 48, 3, 42, 7, 52, 43, 25,
      59, 22, 54, 15, 37, 19, 0, 56,
      4, 38, 9, 46, 60, 27, 49, 14,
      45, 18, 62, 24, 2, 40, 8, 33,
      26, 53, 11, 31, 50, 16, 57, 20,
      5, 41, 47, 1, 36, 63, 28, 51,
      61, 13, 32, 55, 23, 44, 39, 58,
    ],
  },
  {
    id: 'bayer2x2',
    name: 'Bayer 2×2 (Classic)',
    size: 4,
    thresholds: [
      0, 8, 0, 8,
      12, 4, 12, 4,
      0, 8, 0, 8,
      12, 4, 12, 4,
    ],
  },
  {
    id: 'checkerboard',
    name: 'Checkerboard 50%',
    size: 4,
    thresholds: [
      0, 15, 0, 15,
      15, 0, 15, 0,
      0, 15, 0, 15,
      15, 0, 15, 0,
    ],
  },
  {
    id: 'crosshatch',
    name: 'Crosshatch 4×4 (Manga)',
    size: 4,
    thresholds: [
      1, 7, 11, 7,
      7, 3, 7, 15,
      11, 7, 1, 7,
      7, 15, 7, 3,
    ],
  },
  {
    id: 'halftone_dots',
    name: 'Halftone Dots 4×4',
    size: 4,
    thresholds: [
      13, 9, 8, 12,
      6, 1, 0, 5,
      7, 2, 3, 4,
      14, 10, 11, 15,
    ],
  },
  {
    id: 'diagonal',
    name: 'Diagonal Hatch 4×4',
    size: 4,
    thresholds: [
      0, 4, 8, 12,
      4, 8, 12, 0,
      8, 12, 0, 4,
      12, 0, 4, 8,
    ],
  },
  {
    id: 'scanlines',
    name: 'Horizontal Scanlines',
    size: 4,
    thresholds: [
      0, 2, 0, 2,
      10, 12, 10, 12,
      4, 6, 4, 6,
      14, 15, 14, 15,
    ],
  },
  {
    id: 'blue_cluster',
    name: 'Clustered Halftone 4×4',
    size: 4,
    thresholds: [
      12, 5, 6, 13,
      4, 0, 1, 7,
      11, 3, 2, 8,
      15, 10, 9, 14,
    ],
  },
  {
    id: 'flat',
    name: 'Flat (Hard Quantize · 0.5)',
    size: 4,
    thresholds: new Array(16).fill(8),
  },
];

/**
 * Evaluates a normalized threshold in (0, 1) at integer screen coordinates (x, y).
 * Supports both 4x4 (0..16) and 8x8 (0..64) ordered dither matrices.
 */
export function sampleDitherThreshold(
  pattern: DitherPattern,
  x: number,
  y: number
): number {
  const size = pattern.size === 8 ? 8 : 4;
  const maxVal = size === 8 ? 64 : 16;
  const ix = ((Math.floor(x) % size) + size) % size;
  const iy = ((Math.floor(y) % size) + size) % size;
  const v = pattern.thresholds[iy * size + ix] ?? maxVal / 2;
  return (v + 0.5) / maxVal;
}

/**
 * Builds an exact 4x4 or 8x8 RGBA8 Nearest DataTexture encoding thresholds in [0..1] in the R channel.
 */
export function createDitherTexture(pattern: DitherPattern): THREE.DataTexture {
  const size = pattern.size === 8 ? 8 : 4;
  const count = size * size;
  const maxVal = size === 8 ? 64 : 16;
  const denom = maxVal + 1;
  const data = new Uint8Array(count * 4);

  for (let i = 0; i < count; i++) {
    const val = Math.max(0, Math.min(maxVal, pattern.thresholds[i] ?? maxVal / 2));
    const byteVal = Math.min(255, Math.round(((val + 0.5) / denom) * 255));
    data[i * 4 + 0] = byteVal;
    data[i * 4 + 1] = byteVal;
    data[i * 4 + 2] = byteVal;
    data[i * 4 + 3] = 255;
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
