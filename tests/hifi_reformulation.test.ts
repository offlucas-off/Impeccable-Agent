import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRESET_STYLE,
  PixelizerMaterial,
  PixelizerPipeline,
  UNIFIED_PRESET_REGISTRY,
  bakeTaggedPartsAsset,
  buildNwlPlayerCharacter,
  buildQuadrupedCreature,
  dilateAtlasByEdt,
  enforceHiFiTextureSampling,
  findPresetById,
  generateLeafClusterTexture,
  getPresetDefaultStyle,
  subdivideGeometryLoop,
} from '../src/engine';

function countTriangles(root: THREE.Object3D): number {
  let tris = 0;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      const idx = obj.geometry.getIndex();
      const pos = obj.geometry.getAttribute('position');
      tris += idx ? idx.count / 3 : pos.count / 3;
    }
  });
  return tris;
}

function makeMockPipeline(): PixelizerPipeline {
  const fakeGl = { getExtension: () => null };
  const mockRenderer = {
    getContext: () => fakeGl,
    setSize: () => {},
    outputColorSpace: '',
    toneMapping: 0,
  } as unknown as THREE.WebGLRenderer;
  return new PixelizerPipeline(mockRenderer);
}

describe('Hi-Fi 3D Reformulation: Clean Hi-Fi render mode (no destructive pixelation)', () => {
  it('defaults the pipeline to hifi_stylized at native resolution with no pixel expansion/quantization/snapping', () => {
    const pipeline = makeMockPipeline();
    try {
      expect(pipeline.activeStylePreset).toBe('hifi_stylized');
      expect(pipeline.pipelineConfig.filterMode).toBe('hifi_stylized');
      expect(pipeline.pipelineConfig.usePixelExpansion).toBe(false);
      expect(pipeline.pipelineConfig.edgeHighlightStrength).toBe(0);
      expect(pipeline.pipelineConfig.edgeBevelStrength).toBe(0);
      expect(pipeline.pipelineConfig.bloomEnabled).toBe(false);
      expect(pipeline.cameraConfig.resolutionMode).toBe('fixed_downscale_ratio');
      expect(pipeline.cameraConfig.downscaleRatio).toBe(1);
      expect(pipeline.cameraConfig.snapCameraPosition).toBe(false);
    } finally {
      pipeline.dispose();
    }
  });

  it('applyVisualStylePreset("hifi_stylized") disables snapping/expansion and legacy presets still restore pixelation', () => {
    const pipeline = makeMockPipeline();
    try {
      pipeline.applyVisualStylePreset('nwl_snes');
      expect(pipeline.pipelineConfig.usePixelExpansion).toBe(true);
      expect(pipeline.cameraConfig.snapCameraPosition).toBe(true);
      expect(pipeline.pipelineConfig.filterMode).not.toBe('hifi_stylized');

      pipeline.applyVisualStylePreset('hifi_stylized');
      expect(pipeline.activeStylePreset).toBe('hifi_stylized');
      expect(pipeline.pipelineConfig.filterMode).toBe('hifi_stylized');
      expect(pipeline.pipelineConfig.usePixelExpansion).toBe(false);
      expect(pipeline.cameraConfig.downscaleRatio).toBe(1);
      expect(pipeline.cameraConfig.snapCameraPosition).toBe(false);
    } finally {
      pipeline.dispose();
    }
  });

  it('PixelizerMaterial defaults are non-pixelated: no outline, no dithered transparency, no colour grading', () => {
    const mat = new PixelizerMaterial({});
    try {
      expect(mat.options.pixelated).toBe(false);
      expect(mat.options.outlineAlpha).toBe(0);
      expect(mat.options.useDitheredTransparency).toBe(false);
      expect(mat.options.useColorGrading).toBe(false);
      expect(mat.uniforms.uPixelated.value).toBe(0);
      expect(mat.uniforms.uUsePixelExpansion.value).toBe(0);
      expect(mat.uniforms.uOutlineAlpha.value).toBe(0);
      expect(mat.uniforms.uUseColorGrading.value).toBe(0);
    } finally {
      mat.dispose();
    }

    const legacy = new PixelizerMaterial({ pixelated: true });
    try {
      expect(legacy.options.pixelated).toBe(true);
      expect(legacy.uniforms.uPixelated.value).toBe(1);
      expect(legacy.options.outlineAlpha).toBeGreaterThan(0);
    } finally {
      legacy.dispose();
    }
  });

  it('enforceHiFiTextureSampling gives trilinear mipmapped filtering and correct colour spaces', () => {
    const data = new Uint8Array(8 * 8 * 4).fill(200);
    const albedo = new THREE.DataTexture(data, 8, 8, THREE.RGBAFormat);
    albedo.magFilter = THREE.NearestFilter;
    albedo.minFilter = THREE.NearestFilter;
    enforceHiFiTextureSampling(albedo, 'albedo');
    expect(albedo.magFilter).toBe(THREE.LinearFilter);
    expect(albedo.minFilter).toBe(THREE.LinearMipmapLinearFilter);
    expect(albedo.generateMipmaps).toBe(true);
    expect(albedo.colorSpace).toBe(THREE.SRGBColorSpace);

    const normal = new THREE.DataTexture(data.slice(), 8, 8, THREE.RGBAFormat);
    enforceHiFiTextureSampling(normal, 'normal');
    expect(normal.colorSpace).toBe(THREE.NoColorSpace);

    const px = new THREE.DataTexture(new Uint8Array([1, 2, 3, 255]), 1, 1, THREE.RGBAFormat);
    enforceHiFiTextureSampling(px, 'albedo');
    expect(px.minFilter).toBe(THREE.LinearFilter);
    expect(px.generateMipmaps).toBe(false);
  });

  it('PresetRegistry defaults every flagship preset to hifi_stylized / non-pixelated', () => {
    expect(DEFAULT_PRESET_STYLE).toBe('hifi_stylized');
    for (const id of [
      'nwl_knight',
      'nwl_archer',
      'nwl_mage',
      'nwl_boss_demon',
      'nwl_chest',
      'nwl_starter_city',
      'nwl_dungeon_floor1',
    ]) {
      const entry = findPresetById(id);
      expect(entry, `preset ${id}`).toBeDefined();
      expect(getPresetDefaultStyle(entry!)).toBe('hifi_stylized');
      expect(entry!.defaultPixelated).toBe(false);
    }
    // No registry entry may silently default to a pixelating preset.
    const pixelatedDefaults = UNIFIED_PRESET_REGISTRY.filter((p) => p.defaultPixelated === true);
    expect(pixelatedDefaults.map((p) => p.id)).toEqual([]);
  });
});

describe('Hi-Fi 3D Reformulation: upgraded geometry detail', () => {
  it('builds elder_wyvern with >= 6,000 triangles and keeps wing bones', () => {
    const wyvern = buildQuadrupedCreature('elder_wyvern', { materialSeed: 42 });
    try {
      expect(countTriangles(wyvern.root)).toBeGreaterThanOrEqual(6000);
      const boneNames = wyvern.rig.bones.map((b) => b.name);
      for (const n of ['wing_root_l', 'wing_elbow_l', 'wing_tip_l', 'wing_root_r']) {
        expect(boneNames).toContain(n);
      }
    } finally {
      wyvern.dispose?.();
    }
  });

  it('builds knight player with >= 2,500 triangles on a 65-bone rig', () => {
    const hero = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'normal', materialSeed: 7 });
    try {
      expect(countTriangles(hero.root)).toBeGreaterThanOrEqual(2500);
      expect(hero.rig.bones.length).toBe(65);
    } finally {
      hero.dispose();
    }
  });

  it('subdivideGeometryLoop quadruples triangles per iteration, keeps UVs finite and normals smooth', () => {
    const base = new THREE.IcosahedronGeometry(1, 0);
    const uvs = new Float32Array(base.getAttribute('position').count * 2);
    for (let i = 0; i < uvs.length; i++) uvs[i] = (i % 7) / 7;
    base.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const baseTris = base.getAttribute('position').count / 3;

    const once = subdivideGeometryLoop(base, 1);
    const twice = subdivideGeometryLoop(base, 2);
    const triCount = (g: THREE.BufferGeometry) =>
      g.index ? g.index.count / 3 : g.getAttribute('position').count / 3;
    expect(triCount(once)).toBe(baseTris * 4);
    expect(triCount(twice)).toBe(baseTris * 16);

    for (const g of [once, twice]) {
      expect(g.getAttribute('normal')).toBeDefined();
      expect(g.getAttribute('uv')).toBeDefined();
      const pos = g.getAttribute('position');
      const uv = g.getAttribute('uv');
      for (let i = 0; i < pos.count; i++) {
        expect(Number.isFinite(pos.getX(i) + pos.getY(i) + pos.getZ(i))).toBe(true);
        expect(Number.isFinite(uv.getX(i) + uv.getY(i))).toBe(true);
      }
      // Loop subdivision shrinks a convex polyhedron toward its limit surface (fairing).
      g.computeBoundingSphere();
      expect(g.boundingSphere!.radius).toBeLessThan(1.0001);
      expect(g.boundingSphere!.radius).toBeGreaterThan(0.6);
    }
  });
});

describe('Hi-Fi 3D Reformulation: high-res atlas synthesis, dilation & tangent-space normal maps', () => {
  it('bakes a high-res atlas (>= 256px edge) with >= 4px dilation and a full PBR map set', () => {
    const sphere = new THREE.SphereGeometry(0.5, 24, 16);
    const baked = bakeTaggedPartsAsset(
      [{ geometry: sphere, materialKind: 'dragon_scales', baseHex: '#8b2635', partTag: 'torso' }],
      { seed: 11 }
    );
    try {
      const tex = baked.textures!;
      expect(tex).toBeTruthy();
      expect(Math.max(tex.texWidth, tex.texHeight)).toBeGreaterThanOrEqual(256);
      expect(tex.dilationPx).toBeGreaterThanOrEqual(4);
      expect(baked.unwrapMetrics.overlapPairs).toBe(0);
      expect(baked.unwrapMetrics.texelsPerMeter).toBeGreaterThanOrEqual(64);
      expect(baked.hasTangents).toBe(true);
      expect(baked.geometry.getAttribute('tangent')).toBeDefined();
      for (const m of [tex.albedoMap, tex.normalMap, tex.roughnessMap, tex.aoMap, tex.metalnessMap]) {
        expect(m).toBeInstanceOf(THREE.DataTexture);
        expect((m.image as { width: number }).width).toBe(tex.texWidth);
        expect((m.image as { height: number }).height).toBe(tex.texHeight);
      }
      // Hi-Fi sampling (trilinear mipmaps), not retro NearestFilter.
      expect(tex.albedoMap.magFilter).toBe(THREE.LinearFilter);
      expect(tex.albedoMap.minFilter).toBe(THREE.LinearMipmapLinearFilter);
      expect(tex.normalMap.colorSpace).toBe(THREE.NoColorSpace);
    } finally {
      baked.dispose();
    }
  });

  it('produces a tangent-space OpenGL-style normal map (blue-dominant, non-flat relief, unit-ish vectors)', () => {
    const sphere = new THREE.SphereGeometry(0.5, 24, 16);
    const baked = bakeTaggedPartsAsset(
      [{ geometry: sphere, materialKind: 'dragon_scales', baseHex: '#2f6b3a', partTag: 'torso' }],
      { seed: 5 }
    );
    try {
      const tex = baked.textures!;
      const data = tex.normalMap.image.data as Uint8Array;
      let n = 0;
      let sumZ = 0;
      let sumX = 0;
      let sumY = 0;
      let sumX2 = 0;
      let sumY2 = 0;
      let nonFlat = 0;
      let unitOk = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        const x = data[i] / 127.5 - 1;
        const y = data[i + 1] / 127.5 - 1;
        const z = data[i + 2] / 127.5 - 1;
        n++;
        sumX += x;
        sumY += y;
        sumZ += z;
        sumX2 += x * x;
        sumY2 += y * y;
        if (Math.abs(x) > 0.02 || Math.abs(y) > 0.02) nonFlat++;
        const len = Math.hypot(x, y, z);
        if (len > 0.9 && len < 1.1) unitOk++;
      }
      expect(n).toBeGreaterThan(1000);
      expect(sumZ / n).toBeGreaterThan(0.7); // tangent space: +Z (blue) dominates
      expect(Math.abs(sumX / n)).toBeLessThan(0.25); // X/Y perturbation centred near 0
      expect(Math.abs(sumY / n)).toBeLessThan(0.25);
      expect(sumX2 / n + sumY2 / n).toBeGreaterThan(1e-4); // actual scale relief exists
      expect(nonFlat / n).toBeGreaterThan(0.1);
      expect(unitOk / n).toBeGreaterThan(0.9);
    } finally {
      baked.dispose();
    }
  });

  it('dilateAtlasByEdt bleeds island colour into the empty margin (no dark border bleed)', () => {
    const w = 32;
    const h = 32;
    const mask = new Uint8Array(w * h);
    const albedo = new Uint8Array(w * h * 4);
    const normal = new Uint8Array(w * h * 4);
    for (let y = 12; y < 20; y++) {
      for (let x = 12; x < 20; x++) {
        const i = y * w + x;
        mask[i] = 1;
        albedo.set([200, 120, 60, 255], i * 4);
        normal.set([128, 128, 255, 255], i * 4);
      }
    }
    dilateAtlasByEdt(mask, w, h, albedo, normal, null);
    // Pixel 3 px away from the island edge must have inherited the island colour.
    for (const [x, y] of [[8, 16], [23, 16], [16, 8], [16, 23]]) {
      const i = (y * w + x) * 4;
      expect([albedo[i], albedo[i + 1], albedo[i + 2]]).toEqual([200, 120, 60]);
      expect([normal[i], normal[i + 1], normal[i + 2]]).toEqual([128, 128, 255]);
    }
  });

  it('generateLeafClusterTexture emits an alpha-cutout leaf card with partial coverage', () => {
    const leaf = generateLeafClusterTexture({ seed: 3 });
    try {
      const img = leaf.albedoMap.image as { width: number; height: number; data: Uint8Array };
      let opaque = 0;
      let clear = 0;
      const total = img.width * img.height;
      for (let i = 3; i < img.data.length; i += 4) {
        if (img.data[i] > 127) opaque++;
        else if (img.data[i] === 0) clear++;
      }
      expect(opaque / total).toBeGreaterThan(0.1);
      expect(opaque / total).toBeLessThan(0.6);
      expect(clear / total).toBeGreaterThan(0.3);
      expect(leaf.alphaCoverage).toBeGreaterThan(0.1);
    } finally {
      leaf.dispose();
    }
  });
});
