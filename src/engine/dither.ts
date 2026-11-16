import * as THREE from 'three';
import type { DitherPattern4x4 } from './types';

export const BUILTIN_DITHER_PATTERNS: DitherPattern4x4[] = [
  {
    id: 'bayer4x4',
    name: 'Bayer 4×4 (Ordered)',
    thresholds: [
      0, 8, 2, 10,
      12, 4, 14, 6,
      3, 11, 1, 9,
      15, 7, 13, 5,
    ],
  },
  {
    id: 'bayer2x2',
    name: 'Bayer 2×2 (Tiled)',
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
    thresholds: [
      0, 15, 0, 15,
      15, 0, 15, 0,
      0, 15, 0, 15,
      15, 0, 15, 0,
    ],
  },
  {
    id: 'diagonal',
    name: 'Diagonal Hatch',
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
    thresholds: [
      0, 2, 0, 2,
      10, 12, 10, 12,
      4, 6, 4, 6,
      14, 15, 14, 15,
    ],
  },
  {
    id: 'blue_cluster',
    name: 'Clustered Halftone',
    thresholds: [
      12, 5, 6, 13,
      4, 0, 1, 7,
      11, 3, 2, 8,
      15, 10, 9, 14,
    ],
  },
  {
    id: 'flat',
    name: 'Flat (Threshold 0.5)',
    thresholds: new Array(16).fill(8),
  },
];

/**
 * Evaluates a normalized threshold in [0, 1) at integer screen coordinates (x, y).
 */
export function sampleDitherThreshold(
  pattern: DitherPattern4x4,
  x: number,
  y: number
): number {
  const ix = ((Math.floor(x) % 4) + 4) % 4;
  const iy = ((Math.floor(y) % 4) + 4) % 4;
  const v = pattern.thresholds[iy * 4 + ix] ?? 8;
  return (v + 0.5) / 16.0;
}

/**
 * Builds a 4x4 RGBA8 Nearest DataTexture encoding thresholds in [0..1] in the R channel.
 */
export function createDitherTexture(pattern: DitherPattern4x4): THREE.DataTexture {
  const data = new Uint8Array(4 * 4 * 4);
  for (let i = 0; i < 16; i++) {
    const val = Math.max(0, Math.min(16, pattern.thresholds[i] ?? 8));
    // Map 0..16 -> 0..255 with centered bias (val + 0.5)/16.5 or val/16
    const byteVal = Math.min(255, Math.round(((val + 0.5) / 17.0) * 255));
    data[i * 4 + 0] = byteVal;
    data[i * 4 + 1] = byteVal;
    data[i * 4 + 2] = byteVal;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, 4, 4, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
