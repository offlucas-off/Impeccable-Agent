import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import pkg from '../package.json';
import {
  BUILTIN_PALETTES,
  PixelizerMaterial,
  buildGreenRuinsFloor1,
  buildInstancedPropBatch,
  buildNwlMonster,
  buildNwlPlayerCharacter,
  buildNwlStarterCity,
  exportRiggedAssetToGlb,
  hexToRgb,
  quantizeTextureToPalette,
} from '../src/engine';
import { OBJECT_FRAGMENT_SHADER } from '../src/engine/shaders/objectShader';
import { OUTLINE_EDGE_FRAGMENT_SHADER } from '../src/engine/shaders/outlineEdgeShader';
import { createEventRegistry } from '../src/studio/state/studioContext';
import { mountExportPanel } from '../src/studio/ui/exportPanel';
import { mountObjectInspectorPanel } from '../src/studio/ui/objectInspectorPanel';
import { mountPipelinePanel } from '../src/studio/ui/pipelinePanel';
import { createStageManager } from '../src/studio/ui/stageManager';
import { mountPixelizerStudio } from '../src/studio/ui/studioApp';

describe('Wave 3: Visual Upgrades, GPU Instancing, Quantized GLB & Architecture', () => {
  it('supports SpotLight, Cel Rim Light, 2px Outline Steps & UV-locked Dithering in PixelizerMaterial & shaders', () => {
    expect(OBJECT_FRAGMENT_SHADER).toContain('getSpotLightInfo');
    expect(OBJECT_FRAGMENT_SHADER).toContain('uRimIntensity');
    expect(OBJECT_FRAGMENT_SHADER).toContain('uRimThreshold');
    expect(OBJECT_FRAGMENT_SHADER).toContain('uDitherSpace');
    expect(OUTLINE_EDGE_FRAGMENT_SHADER).toContain('outlineSteps >= 2');
    expect(OUTLINE_EDGE_FRAGMENT_SHADER).toContain('ring2');

    const texData = new Uint8Array(16 * 32 * 4).fill(200);
    const albedoTex = new THREE.DataTexture(texData, 16, 32, THREE.RGBAFormat);
    albedoTex.needsUpdate = true;

    const mat = new PixelizerMaterial({
      pixelSize: 2,
      outlineWidthSteps: 2,
      rimColor: '#fa6a0a',
      rimIntensity: 0.72,
      rimPower: 2.8,
      rimSteppedThreshold: 0.34,
      ditherSpace: 'object_uv',
      albedoMap: albedoTex,
    });

    expect(mat.uniforms.uOutlineWidthSteps.value).toBe(2);
    expect(mat.uniforms.uRimIntensity.value).toBeCloseTo(0.72, 4);
    expect(mat.uniforms.uRimPower.value).toBeCloseTo(2.8, 4);
    expect(mat.uniforms.uRimThreshold.value).toBeCloseTo(0.34, 4);
    expect(mat.uniforms.uDitherSpace.value).toBe(1.0);
    expect(mat.uniforms.uAlbedoSize.value.x).toBe(16);
    expect(mat.uniforms.uAlbedoSize.value.y).toBe(32);

    mat.updateOptions({
      outlineWidthSteps: 1,
      ditherSpace: 'screen_macropixel',
      rimIntensity: 0,
    });
    expect(mat.uniforms.uOutlineWidthSteps.value).toBe(1);
    expect(mat.uniforms.uDitherSpace.value).toBe(0.0);
    expect(mat.uniforms.uRimIntensity.value).toBe(0);

    mat.dispose();
    albedoTex.dispose();
  });

  it('batches repeated props via THREE.InstancedMesh with Pixelizer alignment metadata', () => {
    const geo = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const mat = new PixelizerMaterial({ pixelSize: 3 });
    const inst = buildInstancedPropBatch({
      name: 'Test_Instanced_Props',
      geometry: geo,
      material: mat,
      pixelSize: 3,
      placements: [
        { position: [0, 0, 0], rotationY: 0 },
        { position: [2, 0, -3], rotationY: Math.PI * 0.5, scale: 1.5 },
        { position: [-4, 1, 1], scale: [1, 2, 1] },
      ],
    });

    expect(inst).toBeInstanceOf(THREE.InstancedMesh);
    expect(inst.count).toBe(3);
    expect(inst.userData.pixelizer.snap.alignPixelGrid).toBe(true);
    expect(inst.userData.pixelizer.snap.alignmentPixelSize).toBe(3);

    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    inst.getMatrixAt(1, m);
    pos.setFromMatrixPosition(m);
    expect(pos.x).toBeCloseTo(2, 4);
    expect(pos.z).toBeCloseTo(-3, 4);

    inst.dispose();
    geo.dispose();
    mat.dispose();
  });

  it('equips Starter City, Green Ruins Floor 1 & Boss Demon with InstancedMesh, dynamic lights & 2px Boss outline', () => {
    const city = buildNwlStarterCity();
    let cityInstancedCount = 0;
    let cityDynamicLights = 0;
    city.root.traverse((obj) => {
      if (obj instanceof THREE.InstancedMesh) cityInstancedCount++;
      if (obj instanceof THREE.PointLight || obj instanceof THREE.SpotLight) cityDynamicLights++;
    });
    expect(cityInstancedCount).toBeGreaterThanOrEqual(1);
    expect(cityDynamicLights).toBeGreaterThanOrEqual(2);
    city.update(0.5);
    city.dispose();

    const dung = buildGreenRuinsFloor1(101);
    let dungInstancedCount = 0;
    let dungPointLights = 0;
    dung.root.traverse((obj) => {
      if (obj instanceof THREE.InstancedMesh) dungInstancedCount++;
      if (obj instanceof THREE.PointLight) dungPointLights++;
    });
    expect(dungInstancedCount).toBeGreaterThanOrEqual(2);
    expect(dungPointLights).toBeGreaterThanOrEqual(2);
    dung.update(0.5);
    dung.dispose();

    const boss = buildNwlMonster('demons.boss_demon');
    expect(boss.root.userData.nwlIsBoss).toBe(true);
    expect(boss.materials.some((m) => m.options.outlineWidthSteps === 2)).toBe(true);
    expect(boss.materials.some((m) => m.options.rimIntensity > 0)).toBe(true);
    boss.dispose?.();
  }, 15000);

  it('quantizes DataTexture albedo cleanly onto SNES NWL palette and bakes quantized .GLB', async () => {
    const pal = BUILTIN_PALETTES.find((p) => p.id === 'snes_pal_nwl')!;
    expect(pal).toBeDefined();
    const validSet = new Set(
      pal.colors.map((hex) => {
        const [r, g, b] = hexToRgb(hex);
        return `${r},${g},${b}`;
      })
    );

    const w = 8;
    const h = 8;
    const raw = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        raw[idx + 0] = Math.round((x / (w - 1)) * 255);
        raw[idx + 1] = Math.round((y / (h - 1)) * 255);
        raw[idx + 2] = 140;
        raw[idx + 3] = 255;
      }
    }
    const srcTex = new THREE.DataTexture(raw, w, h, THREE.RGBAFormat);
    srcTex.needsUpdate = true;

    for (const applyDither of [false, true]) {
      const qTex = quantizeTextureToPalette(srcTex, pal, applyDither);
      const qData = qTex.image.data as Uint8Array;
      expect(qData.length).toBe(w * h * 4);
      for (let i = 0; i < w * h; i++) {
        const key = `${qData[i * 4]},${qData[i * 4 + 1]},${qData[i * 4 + 2]}`;
        expect(validSet.has(key)).toBe(true);
      }
      qTex.dispose();
    }
    srcTex.dispose();

    const hero = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'normal' });
    const { buffer, validation } = await exportRiggedAssetToGlb(hero.root, [], {
      name: 'knight_wave3_test',
      quantizeAlbedo: true,
      quantizePalette: pal,
      quantizeDither: true,
    });
    expect(buffer.byteLength).toBeGreaterThan(2048);
    const magic = new DataView(buffer).getUint32(0, true);
    expect(magic).toBe(0x46546c67); // 'glTF' little-endian header
    expect(validation.meshCount).toBeGreaterThanOrEqual(4);
    expect(validation.boneCount).toBe(65);
    hero.dispose();
  });

  it('exposes modular Studio panels & headless export:nwl CLI script', () => {
    expect(typeof createEventRegistry).toBe('function');
    expect(typeof mountPipelinePanel).toBe('function');
    expect(typeof mountObjectInspectorPanel).toBe('function');
    expect(typeof mountExportPanel).toBe('function');
    expect(typeof createStageManager).toBe('function');
    expect(typeof mountPixelizerStudio).toBe('function');
    expect(pkg.scripts['export:nwl']).toBe('node scripts/export_nwl_headless.mjs');
  });
});
