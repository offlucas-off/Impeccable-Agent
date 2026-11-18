import * as THREE from 'three';
import type { ColorPaletteConfig, ColorReductionMethod } from './types';

function generateRgbUniformPalette(levelsPerChannel: number): string[] {
  const out: string[] = [];
  for (let r = 0; r < levelsPerChannel; r++) {
    for (let g = 0; g < levelsPerChannel; g++) {
      for (let b = 0; b < levelsPerChannel; b++) {
        const rv = Math.round((r / (levelsPerChannel - 1)) * 255);
        const gv = Math.round((g / (levelsPerChannel - 1)) * 255);
        const bv = Math.round((b / (levelsPerChannel - 1)) * 255);
        out.push(rgbToHex([rv, gv, bv]));
      }
    }
  }
  return out;
}

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
    id: 'resurrect64',
    name: 'Resurrect 64 (Rich Oklab)',
    colors: [
      '#2e222f', '#3e3546', '#625565', '#966c6c', '#ab947a', '#694f62', '#7f708a', '#9babb2',
      '#c7dcd0', '#ffffff', '#6e2727', '#b33831', '#ea4f36', '#f57d4a', '#ae2334', '#e83b3b',
      '#fb6b1d', '#f79617', '#f9c22b', '#7a3045', '#9e4539', '#cd683d', '#e6904e', '#fbb954',
      '#4c3e24', '#676633', '#a2a947', '#d5e04b', '#fbff86', '#165a4c', '#239063', '#1ebc73',
      '#91db69', '#cddf6c', '#313638', '#374e4a', '#547e64', '#92a984', '#b2ba90', '#0b5e65',
      '#0b8a8f', '#0eaf9b', '#30e1b9', '#8ff8e2', '#323353', '#484a77', '#4d65b4', '#4d9be6',
      '#8fd3ff', '#45293f', '#6b3e75', '#905ea9', '#a884f3', '#eaaded', '#753c54', '#a24b6f',
      '#cf657f', '#ed8099', '#831c5d', '#c32454', '#f04f78', '#f68181', '#fca790', '#fdcbb0',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.4, 0.3, 1.0],
    enableDither: true,
    ditherStrength: 0.75,
    valueCurveGamma: 1.0,
  },
  {
    id: 'db32',
    name: 'DawnBringer 32 (RPG)',
    colors: [
      '#000000', '#222034', '#45283c', '#663931', '#8f563b', '#df7126', '#d9a066', '#eec39a',
      '#fbf236', '#99e550', '#6abe30', '#37946e', '#4b692f', '#524b24', '#323c39', '#3f3f74',
      '#306082', '#5b6ee1', '#639bff', '#5fcde4', '#cbdbfc', '#ffffff', '#9badb7', '#847e87',
      '#696a6a', '#595652', '#76428a', '#ac3232', '#d95763', '#d77bba', '#8f974a', '#8a6f30',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.35, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.85,
    valueCurveGamma: 1.0,
  },
  {
    id: 'zughy32',
    name: 'Zughy 32 (Pastel Fantasy)',
    colors: [
      '#472d3c', '#5e3643', '#7a444a', '#a05b53', '#bf7958', '#eea160', '#f4cca1', '#b6d53c',
      '#71aa34', '#397b44', '#3c5956', '#302c2e', '#5a5353', '#7d7071', '#a0938e', '#cfc6b8',
      '#dff6f5', '#8aebf1', '#28ccdf', '#3978a8', '#394778', '#39314b', '#564064', '#8e478c',
      '#cd6093', '#ffaeb6', '#f4b41b', '#f47e1b', '#e6482e', '#a93b3b', '#827094', '#4f546b',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.38, 0.28, 1.0],
    enableDither: true,
    ditherStrength: 0.8,
    valueCurveGamma: 1.0,
  },
  {
    id: 'pico8',
    name: 'PICO-8 (Fantasy Console)',
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
    id: 'db16',
    name: 'DawnBringer 16',
    colors: [
      '#140c1c', '#442434', '#30346d', '#4e4a4e',
      '#854c30', '#346524', '#d04648', '#757161',
      '#597dce', '#d27d2c', '#8595a1', '#6daa2c',
      '#d2aa99', '#6dc2ca', '#dad45e', '#deeed6',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.35, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.85,
    valueCurveGamma: 1.0,
  },
  {
    id: 'snes_pal',
    name: 'SNES Dark Fantasy (16)',
    colors: [
      '#141013', '#3b1725', '#73172d', '#b4202a',
      '#df3e23', '#fa6a0a', '#f9a31b', '#ffd541',
      '#24523b', '#1a7a3e', '#285cc4', '#249fde',
      '#6d758d', '#b3b9d1', '#dae0ea', '#4a3052',
    ],
    method: 'hue_priority',
    hsvWeights: [0.55, 0.35, 1.0],
    enableDither: true,
    ditherStrength: 0.9,
    valueCurveGamma: 1.05,
  },
  {
    id: 'snes_pal_nwl',
    name: 'NWL SNES Dark Fantasy (+Skin)',
    colors: [
      '#141013', '#3b1725', '#73172d', '#b4202a',
      '#df3e23', '#fa6a0a', '#f9a31b', '#ffd541',
      '#24523b', '#1a7a3e', '#4e7a48', '#285cc4',
      '#249fde', '#3e4356', '#6d758d', '#b3b9d1',
      '#dae0ea', '#4a3052', '#4f3428', '#7c4d32',
      '#8f8a82', '#c8bfa8', '#e0a882', '#b87b56',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.45, 0.35, 1.0],
    enableDither: true,
    ditherStrength: 0.35,
    valueCurveGamma: 1.0,
  },
  {
    id: 'hades_ink',
    name: 'Lab: Hades Graphic Ink (16)',
    colors: [
      '#07060b', '#151320', '#1d243b', '#35436e',
      '#73172d', '#bf1b2c', '#ff6a00', '#f9a31b',
      '#ffe44d', '#18e89e', '#0d7a5f', '#249fde',
      '#df2bff', '#a066ff', '#d4a234', '#f2ece4',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.45, 0.35, 1.0],
    enableDither: false,
    ditherStrength: 0.15,
    valueCurveGamma: 0.95,
  },
  {
    id: 'nes',
    name: 'NES 2C02 (Console)',
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
    id: 'c64',
    name: 'Commodore 64 (Pepto)',
    colors: [
      '#000000', '#ffffff', '#68372b', '#70a4b2',
      '#6f3d86', '#588d43', '#352879', '#b8c76f',
      '#6f4f25', '#433900', '#9a6759', '#444444',
      '#6c6c6c', '#9ad284', '#6c5eb5', '#959595',
    ],
    method: 'oklab_perceptual',
    hsvWeights: [0.3, 0.25, 1.0],
    enableDither: true,
    ditherStrength: 0.9,
    valueCurveGamma: 1.0,
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Neon (16)',
    colors: [
      '#0b0814', '#1b1132', '#331c54', '#582985',
      '#ff2a6d', '#ff6495', '#ff9f43', '#ffe66d',
      '#05d9e8', '#00a6fb', '#255c99', '#38ffa0',
      '#d1f7ff', '#7d7abc', '#493657', '#132a47',
    ],
    method: 'hue_priority',
    hsvWeights: [0.65, 0.4, 1.0],
    enableDither: true,
    ditherStrength: 0.85,
    valueCurveGamma: 1.0,
  },
  {
    id: 'rgb222',
    name: 'Posterize RGB-64 (Channel Quant)',
    colors: generateRgbUniformPalette(4),
    method: 'posterize_quant',
    hsvWeights: [0.25, 0.25, 1.0],
    enableDither: false,
    ditherStrength: 0.35,
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
    id: 'gb_pocket',
    name: 'GameBoy Pocket (4 Monos)',
    colors: ['#1b1e1b', '#525951', '#9aa191', '#dfe6d5'],
    method: 'value_nearest',
    hsvWeights: [0.0, 0.0, 1.0],
    enableDither: true,
    ditherStrength: 1.0,
    valueCurveGamma: 1.0,
  },
  {
    id: 'virtual_boy',
    name: 'Virtual Boy (4 Reds)',
    colors: ['#160000', '#5a0000', '#a80000', '#ff1a1a'],
    method: 'value_nearest',
    hsvWeights: [0.0, 0.0, 1.0],
    enableDither: true,
    ditherStrength: 1.0,
    valueCurveGamma: 1.0,
  },
  {
    id: 'onebit_ink',
    name: '1-Bit Obra Dinn / Ink',
    colors: ['#181425', '#f2ebd9'],
    method: 'value_nearest',
    hsvWeights: [0.0, 0.0, 1.0],
    enableDither: true,
    ditherStrength: 1.0,
    valueCurveGamma: 0.95,
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
export type OKLab = [number, number, number];

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

function srgbCompToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Perceptually uniform Oklab color space conversion (Björn Ottosson) for clean retro quantization.
 */
export function rgbToOklab(r: number, g: number, b: number): OKLab {
  const lr = srgbCompToLinear(r);
  const lg = srgbCompToLinear(g);
  const lb = srgbCompToLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export interface PreparedPaletteEntry {
  rgb: RGB;
  hsv: [number, number, number];
  lab: OKLab;
  lum: number;
}

export function preparePaletteEntry(rgb: RGB): PreparedPaletteEntry {
  return {
    rgb,
    hsv: rgbToHsv(rgb[0], rgb[1], rgb[2]),
    lab: rgbToOklab(rgb[0], rgb[1], rgb[2]),
    lum: (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255,
  };
}

function posterizeRgb(target: RGB, paletteCount: number): RGB {
  const levels = Math.max(3, Math.min(8, Math.round(Math.cbrt(Math.max(8, paletteCount))) + 1));
  const step = 255 / (levels - 1);
  return [
    Math.round(Math.round(target[0] / step) * step),
    Math.round(Math.round(target[1] / step) * step),
    Math.round(Math.round(target[2] / step) * step),
  ];
}

function preparedDistance(
  targetRgb: RGB,
  targetHsv: [number, number, number],
  targetLab: OKLab,
  cand: PreparedPaletteEntry,
  method: ColorReductionMethod,
  hsvWeights: [number, number, number],
  valueGamma: number
): number {
  if (method === 'rgb_euclidean' || method === 'posterize_quant') {
    const dr = (targetRgb[0] - cand.rgb[0]) / 255;
    const dg = (targetRgb[1] - cand.rgb[1]) / 255;
    const db = (targetRgb[2] - cand.rgb[2]) / 255;
    return 0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db;
  }

  if (method === 'oklab_perceptual') {
    const tL = Math.pow(Math.max(0, targetLab[0]), valueGamma);
    const dL = tL - cand.lab[0];
    const da = targetLab[1] - cand.lab[1];
    const db = targetLab[2] - cand.lab[2];
    const valWeight = Math.max(0.5, hsvWeights[2]);
    return valWeight * dL * dL + 1.85 * (da * da + db * db);
  }

  if (method === 'value_nearest') {
    const lumA = Math.pow(
      0.299 * (targetRgb[0] / 255) + 0.587 * (targetRgb[1] / 255) + 0.114 * (targetRgb[2] / 255),
      valueGamma
    );
    return (lumA - cand.lum) * (lumA - cand.lum);
  }

  // hsv_weighted or hue_priority
  let dh = Math.abs(targetHsv[0] - cand.hsv[0]);
  if (dh > 0.5) dh = 1.0 - dh;
  const ds = targetHsv[1] - cand.hsv[1];
  const dv = Math.pow(targetHsv[2], valueGamma) - cand.hsv[2];
  const satFactor =
    method === 'hue_priority'
      ? Math.pow(Math.max(0.05, Math.min(targetHsv[1], cand.hsv[1])), 0.7)
      : Math.min(targetHsv[1], cand.hsv[1]);
  const hueWeight = method === 'hue_priority' ? hsvWeights[0] * 2.4 : hsvWeights[0];
  const satWeight = method === 'hue_priority' ? hsvWeights[1] * 1.35 : hsvWeights[1] * 1.3;
  // Subtle Oklab chroma anchor protects neutral/achromatic surfaces (armor/stone) from vibrant tint spillover
  const labChromaErr =
    (targetLab[1] - cand.lab[1]) ** 2 + (targetLab[2] - cand.lab[2]) ** 2;
  const neutralGuard = targetHsv[1] < 0.2 ? 1.45 : 0.45;
  return (
    hueWeight * satFactor * (dh * 2.0) ** 2 +
    satWeight * ds * ds +
    hsvWeights[2] * dv * dv +
    neutralGuard * labChromaErr
  );
}

/**
 * Dual-color ordered dithering lookup pair (C1, C2, mixRatio) for a target RGB color.
 * Supports HSV weighted, Oklab perceptual, Hue-priority, Luminance ramp, RGB Euclidean,
 * and channel-posterized conversion formats.
 */
export function findDitherPair(
  target: RGB,
  paletteRgb: RGB[],
  method: ColorReductionMethod,
  hsvWeights: [number, number, number],
  ditherStrength: number,
  valueGamma: number,
  preparedCache?: PreparedPaletteEntry[]
): { c1: RGB; c2: RGB; ratio: number } {
  if (paletteRgb.length === 0) {
    return { c1: target, c2: target, ratio: 0 };
  }
  if (paletteRgb.length === 1) {
    return { c1: paletteRgb[0], c2: paletteRgb[0], ratio: 0 };
  }

  const effectiveTarget =
    method === 'posterize_quant' ? posterizeRgb(target, paletteRgb.length) : target;

  // Value-nearest sorted ramp dithering for 1-bit / GameBoy / monochrome palettes
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
      (0.299 * effectiveTarget[0] + 0.587 * effectiveTarget[1] + 0.114 * effectiveTarget[2]) / 255,
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
          ratio:
            ditherStrength > 0
              ? Math.max(0, Math.min(1, (frac - 0.5) * ditherStrength + 0.5))
              : frac >= 0.5
              ? 1
              : 0,
        };
      }
    }
  }

  const prep = preparedCache ?? paletteRgb.map(preparePaletteEntry);
  const tHsv = rgbToHsv(effectiveTarget[0], effectiveTarget[1], effectiveTarget[2]);
  const tLab = rgbToOklab(effectiveTarget[0], effectiveTarget[1], effectiveTarget[2]);

  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < prep.length; i++) {
    const d = preparedDistance(
      effectiveTarget,
      tHsv,
      tLab,
      prep[i],
      method,
      hsvWeights,
      valueGamma
    );
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  const c1Entry = prep[bestIdx];
  const c1 = c1Entry.rgb;
  if (ditherStrength <= 0.001) {
    return { c1, c2: c1, ratio: 0 };
  }

  const isMultiHuePalette = paletteRgb.length > 6;
  const maxPairLenSq = isMultiHuePalette ? 0.24 : 3.0;
  const c1ChromaSq =
    (c1Entry.lab[1] - tLab[1]) ** 2 + (c1Entry.lab[2] - tLab[2]) ** 2;

  // Find best companion color c2 minimizing perceptual mixture error + Yliluoma pattern noise penalty
  let bestC2 = c1;
  let bestT = 0;
  let bestScore = bestDist * (isMultiHuePalette ? 0.96 : 0.98);

  for (let i = 0; i < prep.length; i++) {
    if (i === bestIdx) continue;
    const candEntry = prep[i];
    const cand = candEntry.rgb;
    const vx = (cand[0] - c1[0]) / 255;
    const vy = (cand[1] - c1[1]) / 255;
    const vz = (cand[2] - c1[2]) / 255;
    const lenSq = vx * vx + vy * vy + vz * vz;
    if (lenSq < 1e-6 || lenSq > maxPairLenSq) continue;

    // Prevent introducing high-chroma complementary speckles onto neutral/subtle tones
    const pairA = c1Entry.lab[1] - candEntry.lab[1];
    const pairB = c1Entry.lab[2] - candEntry.lab[2];
    const pairChromaSq = pairA * pairA + pairB * pairB;
    if (isMultiHuePalette) {
      const candChromaErrSq =
        (candEntry.lab[1] - tLab[1]) ** 2 + (candEntry.lab[2] - tLab[2]) ** 2;
      if (candChromaErrSq > 0.012 && candChromaErrSq > c1ChromaSq * 4.0 + 0.006) {
        continue;
      }
    }

    const tx = (effectiveTarget[0] - c1[0]) / 255;
    const ty = (effectiveTarget[1] - c1[1]) / 255;
    const tz = (effectiveTarget[2] - c1[2]) / 255;
    const t = Math.max(0, Math.min(0.5, (tx * vx + ty * vy + tz * vz) / lenSq));

    const mixColor: RGB = [
      c1[0] + (cand[0] - c1[0]) * t,
      c1[1] + (cand[1] - c1[1]) * t,
      c1[2] + (cand[2] - c1[2]) * t,
    ];
    const mHsv = rgbToHsv(mixColor[0], mixColor[1], mixColor[2]);
    const mLab = rgbToOklab(mixColor[0], mixColor[1], mixColor[2]);
    const mixCand: PreparedPaletteEntry = {
      rgb: mixColor,
      hsv: mHsv,
      lab: mLab,
      lum: (0.299 * mixColor[0] + 0.587 * mixColor[1] + 0.114 * mixColor[2]) / 255,
    };

    const err = preparedDistance(
      effectiveTarget,
      tHsv,
      tLab,
      mixCand,
      method,
      hsvWeights,
      valueGamma
    );
    const pairL = c1Entry.lab[0] - candEntry.lab[0];
    const ditherNoisePenalty = isMultiHuePalette
      ? 0.08 * pairL * pairL + 0.45 * pairChromaSq
      : 0;

    const totalScore = err + ditherNoisePenalty;
    if (totalScore < bestScore) {
      bestScore = totalScore;
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
 */
export function buildPaletteLutPair(config: ColorPaletteConfig): PaletteLutPair {
  const N = 16;
  const width = N * N; // 256
  const height = N;    // 16
  const primaryData = new Uint8Array(width * height * 4);
  const secondaryData = new Uint8Array(width * height * 4);
  const paletteRgb = config.colors.map(hexToRgb);
  const preparedCache = paletteRgb.map(preparePaletteEntry);

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
          config.valueCurveGamma,
          preparedCache
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
