import * as THREE from 'three';
import type { LightingRampConfig } from './types';

export const BUILTIN_LIGHTING_RAMPS: LightingRampConfig[] = [
  {
    id: 'three_band',
    name: '3-Band Cel (Classic)',
    smooth: false,
    stops: [
      { position: 0.0, color: '#3b425c' },
      { position: 0.28, color: '#7d88a8' },
      { position: 0.65, color: '#ffffff' },
    ],
  },
  {
    id: 'two_band',
    name: '2-Band Hard Ink',
    smooth: false,
    stops: [
      { position: 0.0, color: '#454860' },
      { position: 0.42, color: '#ffffff' },
    ],
  },
  {
    id: 'hades_graphic_ink',
    name: 'Hades Graphic Ink (Lab)',
    smooth: false,
    stops: [
      { position: 0.0, color: '#2b2042' },
      { position: 0.34, color: '#ffffff' },
    ],
  },
  {
    id: 'four_band',
    name: '4-Band Sprite Shading',
    smooth: false,
    stops: [
      { position: 0.0, color: '#2b2d42' },
      { position: 0.22, color: '#5c6684' },
      { position: 0.52, color: '#aab6ce' },
      { position: 0.8, color: '#ffffff' },
    ],
  },
  {
    id: 'gameboy_ramp',
    name: '4-Step Monochrome',
    smooth: false,
    stops: [
      { position: 0.0, color: '#282828' },
      { position: 0.25, color: '#606060' },
      { position: 0.55, color: '#a8a8a8' },
      { position: 0.82, color: '#f8f8f8' },
    ],
  },
  {
    id: 'smooth_retro',
    name: 'Soft Stepped',
    smooth: true,
    stops: [
      { position: 0.0, color: '#383d54' },
      { position: 0.35, color: '#9ca7c4' },
      { position: 0.85, color: '#ffffff' },
    ],
  },
];

function hexToRgbBytes(hex: string): [number, number, number] {
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

/**
 * Generates a 256x1 RGBA8 DataTexture representing the cel-shading lighting ramp.
 */
export function createLightingRampTexture(
  config: LightingRampConfig
): THREE.DataTexture {
  const width = 256;
  const data = new Uint8Array(width * 4);
  const stops = [...config.stops].sort((a, b) => a.position - b.position);
  if (stops.length === 0) {
    stops.push({ position: 0, color: '#ffffff' });
  }

  for (let x = 0; x < width; x++) {
    const t = x / (width - 1);
    let r = 255;
    let g = 255;
    let b = 255;

    if (!config.smooth) {
      let chosen = stops[0];
      for (const s of stops) {
        if (t >= s.position) chosen = s;
      }
      [r, g, b] = hexToRgbBytes(chosen.color);
    } else {
      let left = stops[0];
      let right = stops[stops.length - 1];
      for (let i = 0; i < stops.length - 1; i++) {
        if (t >= stops[i].position && t <= stops[i + 1].position) {
          left = stops[i];
          right = stops[i + 1];
          break;
        }
      }
      if (t <= stops[0].position) {
        [r, g, b] = hexToRgbBytes(stops[0].color);
      } else if (t >= stops[stops.length - 1].position) {
        [r, g, b] = hexToRgbBytes(stops[stops.length - 1].color);
      } else {
        const span = Math.max(1e-5, right.position - left.position);
        const f = Math.max(0, Math.min(1, (t - left.position) / span));
        const [r0, g0, b0] = hexToRgbBytes(left.color);
        const [r1, g1, b1] = hexToRgbBytes(right.color);
        r = Math.round(r0 + (r1 - r0) * f);
        g = Math.round(g0 + (g1 - g0) * f);
        b = Math.round(b0 + (b1 - b0) * f);
      }
    }

    data[x * 4 + 0] = r;
    data[x * 4 + 1] = g;
    data[x * 4 + 2] = b;
    data[x * 4 + 3] = 255;
  }

  const tex = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat);
  tex.minFilter = config.smooth ? THREE.LinearFilter : THREE.NearestFilter;
  tex.magFilter = config.smooth ? THREE.LinearFilter : THREE.NearestFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}
