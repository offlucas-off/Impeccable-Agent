import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { describe, expect, it } from 'vitest';
import {
  buildNwlMonster,
  buildNwlPlayerCharacter,
  buildNwlSpellVfx,
  exportRiggedAssetToGlb,
  getSpellVfxRecipe,
} from '../src/engine';
import { InstancedVfxParticlePool } from '../src/engine/vfx';

function parseGlbJsonChunk(buffer: ArrayBuffer): Record<string, unknown> {
  const view = new DataView(buffer);
  expect(view.getUint32(0, true)).toBe(0x46546c67); // 'glTF'
  expect(view.getUint32(4, true)).toBe(2);
  const chunkLength = view.getUint32(12, true);
  expect(view.getUint32(16, true)).toBe(0x4e4f534a); // 'JSON'
  const jsonBytes = new Uint8Array(buffer, 20, chunkLength);
  return JSON.parse(new TextDecoder().decode(jsonBytes)) as Record<string, unknown>;
}

function countRootTriangles(root: THREE.Object3D): { totalTris: number; meshTris: Record<string, number> } {
  let totalTris = 0;
  const meshTris: Record<string, number> = {};
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      const idx = obj.geometry.getIndex();
      const pos = obj.geometry.getAttribute('position');
      const tris = idx ? Math.floor(idx.count / 3) : pos ? Math.floor(pos.count / 3) : 0;
      totalTris += tris;
      meshTris[obj.name || 'unnamed'] = (meshTris[obj.name || 'unnamed'] ?? 0) + tris;
    }
  });
  return { totalTris, meshTris };
}

describe('Round 2 Polish Validation Gate', () => {
  it('exports NWL Knight player character to .GLB with normalTexture, metallicRoughnessTexture, and occlusionTexture', async () => {
    const player = buildNwlPlayerCharacter({
      classId: 'knight',
      rarity: 'rare',
      materialSeed: 101,
    });

    const hadFileReader = 'FileReader' in globalThis;
    if (!hadFileReader) {
      (globalThis as Record<string, unknown>).FileReader = class NodeBlobReader {
        result: ArrayBuffer | string | null = null;
        onloadend: (() => void) | null = null;
        readAsArrayBuffer(blob: Blob): void {
          void blob.arrayBuffer().then((buf) => {
            this.result = buf;
            this.onloadend?.();
          });
        }
        readAsDataURL(blob: Blob): void {
          void blob.arrayBuffer().then((buf) => {
            const bytes = new Uint8Array(buf);
            let bin = '';
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            this.result = `data:application/octet-stream;base64,${btoa(bin)}`;
            this.onloadend?.();
          });
        }
      };
    }

    try {
      const { buffer, validation } = await exportRiggedAssetToGlb(player.root, [], {
        name: 'nwl_knight_round2_pbr',
        resetToRestPose: true,
      });

      expect(buffer.byteLength).toBeGreaterThan(4096);
      expect(validation.boneCount).toBe(65);
      expect(validation.meshCount).toBeGreaterThan(0);

      const gltfJson = parseGlbJsonChunk(buffer);
      const materials = (gltfJson.materials ?? []) as Array<Record<string, unknown>>;
      const textures = (gltfJson.textures ?? []) as unknown[];

      expect(materials.length).toBeGreaterThan(0);
      expect(textures.length).toBeGreaterThanOrEqual(3);

      const hasNormal = materials.some((m) => m.normalTexture !== undefined);
      const hasOcclusion = materials.some((m) => m.occlusionTexture !== undefined);
      const hasMetallicRoughness = materials.some((m) => {
        const pbr = m.pbrMetallicRoughness as Record<string, unknown> | undefined;
        return pbr?.metallicRoughnessTexture !== undefined;
      });

      expect(hasNormal, 'GLB missing normalTexture').toBe(true);
      expect(hasOcclusion, 'GLB missing occlusionTexture').toBe(true);
      expect(hasMetallicRoughness, 'GLB missing metallicRoughnessTexture').toBe(true);

      const loader = new GLTFLoader();
      const loaded = await loader.parseAsync(buffer, '');
      expect(loaded.scene.children.length).toBeGreaterThan(0);
    } finally {
      if (!hadFileReader) {
        delete (globalThis as Record<string, unknown>).FileReader;
      }
      player.dispose();
    }
  });

  it('builds reworked demons.boss_demon with >= 10,000 tris, imposing wing/torso meshes, PBR maps, and ~2.95m scale hierarchy', () => {
    const boss = buildNwlMonster('demons.boss_demon', { seed: 404 });

    try {
      boss.root.updateMatrixWorld(true);
      const { totalTris, meshTris } = countRootTriangles(boss.root);

      expect(totalTris).toBeGreaterThanOrEqual(10_000);
      expect(meshTris['Monster_Wing_l']).toBeGreaterThan(200);
      expect(meshTris['Monster_Wing_r']).toBeGreaterThan(200);
      expect(meshTris['Monster_Spine3']).toBeGreaterThan(200);
      expect(meshTris['Monster_Head']).toBeGreaterThan(100);

      const box = new THREE.Box3().setFromObject(boss.root);
      const size = new THREE.Vector3();
      box.getSize(size);
      expect(size.y).toBeGreaterThanOrEqual(2.75);
      expect(size.y).toBeLessThanOrEqual(3.5);
      expect(size.x).toBeGreaterThanOrEqual(2.0); // imposing wingspan

      const hasFullPbr = boss.materials.some(
        (m) => Boolean(m.options.normalMap && m.options.roughnessMap && m.options.aoMap)
      );
      expect(hasFullPbr).toBe(true);
    } finally {
      boss.meshes.forEach((m) => m.geometry.dispose());
      boss.materials.forEach((m) => m.dispose());
    }
  });

  it('interpolates InstancedVfxParticlePool color/scale over age and builds upgraded meteoro & barreira VFX within budget', () => {
    const pool = new InstancedVfxParticlePool(32);
    const color = new THREE.Color();
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    try {
      // 1. Two-stop color + scale interpolation (white -> black, 1.0 -> 0.2)
      pool.spawnBurst(new THREE.Vector3(0, 0, 0), {
        count: 1,
        colorHex: '#ffffff',
        endColor: '#000000',
        startScale: 1.0,
        endScale: 0.2,
        speedMin: 0,
        speedMax: 0,
        lifeSec: 1.0,
        sizeMin: 0.5,
        sizeMax: 0.5,
        gravity: 0,
      });

      pool.update(0.001);
      expect(pool.mesh.count).toBe(1);
      pool.mesh.getColorAt(0, color);
      expect(color.r).toBeGreaterThan(0.95);
      expect(color.g).toBeGreaterThan(0.95);
      expect(color.b).toBeGreaterThan(0.95);
      pool.mesh.getMatrixAt(0, mat);
      mat.decompose(pos, quat, scale);
      expect(scale.x).toBeCloseTo(0.5, 2);

      pool.update(0.499); // age = 0.5
      pool.mesh.getColorAt(0, color);
      expect(color.r).toBeCloseTo(0.5, 1);
      expect(color.g).toBeCloseTo(0.5, 1);
      expect(color.b).toBeCloseTo(0.5, 1);
      pool.mesh.getMatrixAt(0, mat);
      mat.decompose(pos, quat, scale);
      expect(scale.x).toBeCloseTo(0.5 * 0.6, 2);

      pool.update(0.4); // age = 0.9
      pool.mesh.getColorAt(0, color);
      expect(color.r).toBeCloseTo(0.1, 1);
      expect(color.g).toBeCloseTo(0.1, 1);
      expect(color.b).toBeCloseTo(0.1, 1);

      // 2. Three-stop color interpolation (white -> red @0.45 -> blue @1.0)
      pool.clear();
      pool.spawnBurst(new THREE.Vector3(0, 0, 0), {
        count: 1,
        colorHex: '#ffffff',
        midColor: '#ff0000',
        endColor: '#0000ff',
        startScale: 1.0,
        endScale: 0.5,
        speedMin: 0,
        speedMax: 0,
        lifeSec: 1.0,
        sizeMin: 1.0,
        sizeMax: 1.0,
        gravity: 0,
      });

      pool.update(0.45); // exact midColor stop
      pool.mesh.getColorAt(0, color);
      expect(color.r).toBeGreaterThan(0.95);
      expect(color.g).toBeLessThan(0.05);
      expect(color.b).toBeLessThan(0.05);

      pool.update(0.5); // age = 0.95 -> near endColor (blue)
      pool.mesh.getColorAt(0, color);
      expect(color.b).toBeGreaterThan(0.85);
      expect(color.r).toBeLessThan(0.15);
    } finally {
      pool.dispose();
    }

    // 3. Upgraded SpellVfxBuilder geometries & budgets
    const meteoro = buildNwlSpellVfx('meteoro');
    const barreira = buildNwlSpellVfx('barreira');
    const setaFogo = buildNwlSpellVfx('seta_fogo');
    try {
      expect(meteoro.triangleCount).toBeGreaterThan(200);
      expect(meteoro.triangleCount).toBeLessThanOrEqual(1200);
      expect(meteoro.root.getObjectByName('VFX_meteoro')).toBeDefined();
      expect(meteoro.root.getObjectByName('VFX_meteoro_ground')).toBeDefined();
      meteoro.updatePhase(0.5);
      meteoro.updatePhase(0.85);

      const meteorRecipe = getSpellVfxRecipe('meteoro');
      const hasEndColor = meteorRecipe.stages.some((st) =>
        st.events?.some((ev) => ev.particles?.endColor !== undefined)
      );
      expect(hasEndColor).toBe(true);

      expect(barreira.triangleCount).toBeGreaterThan(150);
      expect(barreira.triangleCount).toBeLessThanOrEqual(1000);
      const barrierMain = barreira.root.getObjectByName('VFX_barreira');
      const barrierGround = barreira.root.getObjectByName('VFX_barreira_ground');
      expect(barrierMain).toBeDefined();
      expect(barrierGround).toBeDefined();
      barreira.updatePhase(0.5);
      expect(barrierMain!.rotation.y).toBeGreaterThan(0);
      expect(barrierGround!.rotation.y).toBeLessThan(0);

      expect(setaFogo.triangleCount).toBeLessThanOrEqual(200);
    } finally {
      meteoro.dispose();
      barreira.dispose();
      setaFogo.dispose();
    }
  });
});
