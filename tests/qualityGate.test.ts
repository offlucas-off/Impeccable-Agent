import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { describe, expect, it } from 'vitest';
import {
  bake3DCurvatureToUvIslands,
  buildGreenRuinsFloor1,
  buildNwlMonster,
  buildNwlNpc,
  buildNwlPlayerCharacter,
  buildNwlStarterCity,
  buildProceduralProp,
  buildProceduralStructure,
  buildProceduralUalCharacter,
  detectFlatDetailCuboids,
  exportRiggedAssetToGlb,
  inspectGeometryUvs,
  makePleatedTabardGeometry,
  makeSegmentedBeveledBox,
  unwrapPixelAligned,
  type PropKind,
  type UnwrapMetricsSummary,
} from '../src/engine';
import {
  extractZipArchiveEntries,
  remasterImportedTextureForPixelizer,
} from '../src/studio/loaders/modelLoader';

function countUniqueVertexColors(root: THREE.Object3D): number {
  const seen = new Set<string>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const col = obj.geometry?.getAttribute('color');
      if (!col) return;
      for (let i = 0; i < col.count; i++) {
        const r = Math.round(col.getX(i) * 255);
        const g = Math.round(col.getY(i) * 255);
        const b = Math.round(col.getZ(i) * 255);
        seen.add(`${r},${g},${b}`);
      }
    }
  });
  return seen.size;
}

function assertMetricsPassGate(metrics: UnwrapMetricsSummary | undefined, label: string): void {
  expect(metrics, `${label} missing unwrapMetrics`).toBeDefined();
  expect(metrics!.finishMode, `${label} finishMode`).toBe('textured_ao');
  expect(metrics!.texWidth, `${label} texWidth`).toBeGreaterThanOrEqual(64);
  expect(metrics!.texHeight, `${label} texHeight`).toBeGreaterThanOrEqual(64);
  expect(metrics!.overlapPairs, `${label} overlapPairs`).toBe(0);
  expect(metrics!.meanEntropy, `${label} meanEntropy`).toBeGreaterThanOrEqual(1.8);
  expect(metrics!.flatFacesPercent, `${label} flatFacesPercent`).toBeLessThanOrEqual(10);
  expect(metrics!.meanEdgeChangePercent, `${label} meanEdgeChangePercent`).toBeGreaterThanOrEqual(12);
}

function assertRootMeshesPassUvGate(
  root: THREE.Object3D,
  fallbackMetrics: UnwrapMetricsSummary | undefined,
  label: string
): void {
  let inspected = 0;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry?.getAttribute('uv')) {
      const m =
        (obj.geometry.userData?.unwrapMetrics as UnwrapMetricsSummary | undefined) ??
        fallbackMetrics;
      const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      const albImg = mat?.options?.albedoMap?.image as { width?: number; height?: number } | undefined;
      const texW = m?.texWidth ?? albImg?.width ?? 128;
      const texH = m?.texHeight ?? albImg?.height ?? 128;
      const tpm = m?.texelsPerMeter ?? 64;
      const report = inspectGeometryUvs(obj.geometry, tpm, texW, texH, {
        flatCheckRoot: root,
      });
      expect(report.nonFiniteTriangles, `${label}:${obj.name} nonFinite`).toBe(0);
      expect(report.collapsedTriangles, `${label}:${obj.name} collapsed`).toBe(0);
      expect(report.outOfTileTriangles, `${label}:${obj.name} outOfTile`).toBe(0);
      expect(report.overlapPairs, `${label}:${obj.name} overlapPairs`).toBe(0);
      expect(obj.geometry.getAttribute('tangent'), `${label}:${obj.name} tangent`).toBeDefined();
      inspected++;
    }
  });
  expect(inspected, `${label} inspected mesh count`).toBeGreaterThan(0);
}

function parseGlbJsonChunk(buffer: ArrayBuffer): Record<string, unknown> {
  const view = new DataView(buffer);
  const magic = view.getUint32(0, true);
  expect(magic).toBe(0x46546c67); // 'glTF'
  const version = view.getUint32(4, true);
  expect(version).toBe(2);
  const chunkLength = view.getUint32(12, true);
  const chunkType = view.getUint32(16, true);
  expect(chunkType).toBe(0x4e4f534a); // 'JSON'
  const jsonBytes = new Uint8Array(buffer, 20, chunkLength);
  const text = new TextDecoder().decode(jsonBytes);
  return JSON.parse(text) as Record<string, unknown>;
}

describe('Phase 5 & 6 Procedural Modeling, Auto-UV & Texturing Quality Gate', () => {
  it('validates unique-atlas UV geometry integrity & texture quality on Props (chest, barrel, sword, tree)', () => {
    const kinds: PropKind[] = ['chest', 'barrel', 'sword', 'tree'];
    for (const kind of kinds) {
      const res = buildProceduralProp({ kind, visualStyle: 'lowpoly', seed: 1337 });
      try {
        const metrics = res.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
        assertMetricsPassGate(metrics, `Prop:${kind}`);
        expect(detectFlatDetailCuboids(res.root).length).toBe(0);

        let inspected = false;
        res.root.traverse((obj) => {
          if (obj instanceof THREE.Mesh && metrics) {
            const report = inspectGeometryUvs(
              obj.geometry,
              metrics.texelsPerMeter,
              metrics.texWidth,
              metrics.texHeight,
              { flatCheckRoot: res.root }
            );
            expect(report.nonFiniteTriangles).toBe(0);
            expect(report.collapsedTriangles).toBe(0);
            expect(report.outOfTileTriangles).toBe(0);
            expect(report.overlapPairs).toBe(0);
            expect(report.flatDetailCuboids.length).toBe(0);
            expect(report.uvDensityOutliers.length / Math.max(1, report.triangleCount)).toBeLessThanOrEqual(0.15);
            expect(obj.geometry.getAttribute('tangent')).toBeDefined();
            inspected = true;
          }
        });
        expect(inspected).toBe(true);
      } finally {
        res.dispose?.();
      }
    }
  });

  it('validates UVs, anti-fangs Vertex AO, and zero flat detail cuboids across Player, NPCs, Monsters & UAL Characters', () => {
    const hero = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'legendary', materialSeed: 101 });
    try {
      const heroMetrics = hero.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(heroMetrics, 'Player:knight:legendary');
      assertRootMeshesPassUvGate(hero.root, heroMetrics, 'Player:knight:legendary');
      expect(detectFlatDetailCuboids(hero.root).length).toBe(0);
      expect(hero.materials.every((m) => m.options.albedoMap !== null && m.options.normalMap !== null)).toBe(true);
    } finally {
      hero.dispose();
    }

    for (const npcId of ['npc.ferreiro', 'npc.bau'] as const) {
      const npc = buildNwlNpc(npcId, { seed: 202 });
      try {
        const npcMetrics = npc.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
        assertMetricsPassGate(npcMetrics, `NPC:${npcId}`);
        expect(detectFlatDetailCuboids(npc.root).length).toBe(0);
      } finally {
        npc.dispose?.();
      }
    }

    const goblin = buildNwlMonster('orcs.goblin_01', { seed: 301 });
    try {
      const gobMetrics = goblin.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(gobMetrics, 'Monster:goblin_01');
      expect(detectFlatDetailCuboids(goblin.root).length).toBe(0);
    } finally {
      goblin.dispose?.();
    }

    const bossDemon = buildNwlMonster('demons.boss_demon', { seed: 404 });
    try {
      const bossMetrics = bossDemon.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(bossMetrics, 'Boss:demons.boss_demon');
      assertRootMeshesPassUvGate(bossDemon.root, bossMetrics, 'Boss:demons.boss_demon');
      expect(bossMetrics!.minVertexAo).toBeGreaterThanOrEqual(0.45);
      expect(detectFlatDetailCuboids(bossDemon.root).length).toBe(0);
      expect(bossDemon.materials.some((m) => m.options.emissionMap !== null)).toBe(true);
    } finally {
      bossDemon.dispose?.();
    }

    const ualKnight = buildProceduralUalCharacter({
      archetype: 'knight',
      rigMode: 'skinned_mesh',
      visualStyle: 'lowpoly',
      seed: 42,
    });
    try {
      const ualMetrics = ualKnight.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(ualMetrics, 'UAL:knight:skinned');
      expect(detectFlatDetailCuboids(ualKnight.root).length).toBe(0);
      const skinned = ualKnight.meshes.find((m) => m instanceof THREE.SkinnedMesh);
      expect(skinned).toBeDefined();
      expect(skinned!.geometry.getAttribute('uv')).toBeDefined();
      expect(skinned!.geometry.getAttribute('tangent')).toBeDefined();
    } finally {
      ualKnight.dispose?.();
    }
  });

  it('validates NWL Starter City and houses quality metrics', () => {
    const city = buildNwlStarterCity();
    try {
      const cityMetrics = city.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(cityMetrics, 'NWL_StarterCity');
      expect(detectFlatDetailCuboids(city.root).length).toBe(0);
      const firstHouse = city.houses[0];
      expect(firstHouse.materials.some((m) => m.options.albedoMap !== null)).toBe(true);
      const houseMetrics = firstHouse.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(houseMetrics, 'CityHouse:0');
      assertRootMeshesPassUvGate(firstHouse.root, houseMetrics, 'CityHouse:0');
    } finally {
      city.dispose();
    }
  }, 45000);

  it('validates Green Ruins Floor 1 and WFC Medieval Structure quality metrics', () => {
    const dungeon = buildGreenRuinsFloor1(101);
    try {
      const dungMetrics = dungeon.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(dungMetrics, 'GreenRuins_Floor1');
      expect(detectFlatDetailCuboids(dungeon.root).length).toBe(0);
      expect(dungeon.materials.some((m) => m.options.albedoMap !== null && m.options.normalMap !== null)).toBe(true);
    } finally {
      dungeon.dispose();
    }

    const wfcMedieval = buildProceduralStructure({
      biome: 'medieval',
      cols: 3,
      rows: 3,
      floors: 1,
      seed: 77,
    });
    try {
      const wfcMetrics = wfcMedieval.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined;
      assertMetricsPassGate(wfcMetrics, 'WFC:medieval');
      expect(detectFlatDetailCuboids(wfcMedieval.root).length).toBe(0);
      expect(wfcMedieval.materials[0]?.options.albedoMap).not.toBeNull();
      expect(wfcMedieval.materials[0]?.options.normalMap).not.toBeNull();
    } finally {
      wfcMedieval.dispose?.();
    }
  }, 15000);

  it('preserves rich RGB diversity when voxelizing textured procedural assets', () => {
    const chestVoxel = buildProceduralProp({
      kind: 'chest',
      visualStyle: 'voxel',
      voxelResolution: 20,
      seed: 1337,
    });
    try {
      expect(countUniqueVertexColors(chestVoxel.root)).toBeGreaterThanOrEqual(3);
    } finally {
      chestVoxel.dispose?.();
    }

    const knightVoxel = buildProceduralUalCharacter({
      archetype: 'knight',
      rigMode: 'skinned_mesh',
      visualStyle: 'voxel',
      voxelResolution: 18,
      seed: 42,
    });
    try {
      expect(countUniqueVertexColors(knightVoxel.root)).toBeGreaterThanOrEqual(3);
    } finally {
      knightVoxel.dispose?.();
    }
  });

  it('exports textured Rigged .GLB with TEXCOORD_0 and embedded PNG textures in headless Node', async () => {
    const knight = buildProceduralUalCharacter({
      archetype: 'knight',
      rigMode: 'skinned_mesh',
      visualStyle: 'lowpoly',
      seed: 42,
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
      const { buffer, validation } = await exportRiggedAssetToGlb(knight.root, [], {
        name: 'knight_textured_gate',
        resetToRestPose: true,
      });
      expect(buffer.byteLength).toBeGreaterThan(4096);
      expect(validation.boneCount).toBe(65);
      expect(validation.skinnedMeshCount).toBe(1);

      const gltfJson = parseGlbJsonChunk(buffer);
      const meshes = gltfJson.meshes as Array<{
        primitives: Array<{ attributes: Record<string, number> }>;
      }>;
      const images = (gltfJson.images as unknown[]) ?? [];
      const textures = (gltfJson.textures as unknown[]) ?? [];
      expect(meshes[0]?.primitives[0]?.attributes.TEXCOORD_0).toBeDefined();
      expect(images.length).toBeGreaterThanOrEqual(1);
      expect(textures.length).toBeGreaterThanOrEqual(1);

      // Verify GLTFLoader round-trip parses cleanly
      const loader = new GLTFLoader();
      const loaded = await loader.parseAsync(buffer, '');
      expect(loaded.scene.children.length).toBeGreaterThan(0);
    } finally {
      if (!hadFileReader) {
        delete (globalThis as Record<string, unknown>).FileReader;
      }
      knight.dispose?.();
    }
  });

  it('restores legacy null albedoMap/normalMap behavior under finishMode = classic_flat across all 8 builders', () => {
    const propFlat = buildProceduralProp({ kind: 'chest', finishMode: 'classic_flat' });
    const charFlat = buildProceduralUalCharacter({ archetype: 'knight', finishMode: 'classic_flat' });
    const playerFlat = buildNwlPlayerCharacter({
      classId: 'knight',
      rarity: 'rare',
      finishMode: 'classic_flat',
    });
    const npcFlat = buildNwlNpc('npc.ferreiro', { finishMode: 'classic_flat' });
    const monsterFlat = buildNwlMonster('orcs.goblin_01', { finishMode: 'classic_flat' });
    const cityFlat = buildNwlStarterCity(undefined, { finishMode: 'classic_flat' });
    const dungeonFlat = buildGreenRuinsFloor1(101, undefined, { finishMode: 'classic_flat' });
    const structFlat = buildProceduralStructure({
      biome: 'dungeon',
      cols: 3,
      rows: 3,
      finishMode: 'classic_flat',
    });

    try {
      const allSets = [
        { name: 'Prop', mats: propFlat.materials },
        { name: 'Character', mats: charFlat.materials },
        { name: 'Player', mats: playerFlat.materials },
        { name: 'Npc', mats: npcFlat.materials },
        { name: 'Monster', mats: monsterFlat.materials },
        { name: 'City', mats: cityFlat.materials },
        { name: 'Dungeon', mats: dungeonFlat.materials },
        { name: 'Structure', mats: structFlat.materials },
      ];

      for (const s of allSets) {
        expect(s.mats.length, `${s.name} materials count`).toBeGreaterThan(0);
        for (const m of s.mats) {
          expect(m.options.albedoMap, `${s.name} classic_flat albedoMap`).toBeNull();
          expect(m.options.normalMap, `${s.name} classic_flat normalMap`).toBeNull();
        }
      }
    } finally {
      propFlat.dispose?.();
      charFlat.dispose?.();
      playerFlat.dispose();
      npcFlat.dispose?.();
      monsterFlat.dispose?.();
      cityFlat.dispose();
      dungeonFlat.dispose();
      structFlat.dispose?.();
    }
  });

  it('validates Wave 1–4 Caminho B upgrades: sculpted primitives, 3D-to-2D curvature baking, and Meshy-to-Pixelizer texture remastering', async () => {
    // 1. Sculpted Primitives: makeSegmentedBeveledBox & makePleatedTabardGeometry
    const segBox = makeSegmentedBeveledBox(
      0.5,
      0.6,
      0.3,
      0.03,
      2,
      3,
      2,
      (x, y, z) => [x * (1 + y * 0.2), y, z]
    );
    expect(segBox.getAttribute('position').count).toBeGreaterThan(72);
    expect(segBox.getAttribute('normal')).toBeDefined();
    expect(segBox.getAttribute('color')).toBeDefined();

    const tabard = makePleatedTabardGeometry(0.28, 0.42, 0.48, 0.035, 3);
    expect(tabard.getAttribute('position').count).toBeGreaterThan(60);
    expect(tabard.getAttribute('normal')).toBeDefined();

    // 2. Auto-UV worldY metadata + 3D Dihedral Curvature Rasterization
    const unwrapRes = unwrapPixelAligned(
      [
        {
          geometry: segBox,
          partTag: 'test_cuirass',
          materialKind: 'rarity_armor',
          baseHex: '#3e4356',
          accentHex: '#b4202a',
          projection: 'box6',
          landmarkKind: 'none',
          lockVertical: true,
        },
      ],
      {
        texelsPerMeter: 64,
        sewChamfersToParentChart: true,
      }
    );
    expect(unwrapRes.islands.length).toBeGreaterThan(0);
    expect(unwrapRes.islands[0].worldYMin).toBeDefined();
    expect(unwrapRes.islands[0].worldYMax).toBeDefined();
    expect(unwrapRes.islands[0].avgNormalY).toBeDefined();

    const curvMap = bake3DCurvatureToUvIslands(
      unwrapRes.geometry,
      unwrapRes.islands,
      unwrapRes.texWidth,
      unwrapRes.texHeight
    );
    expect(curvMap.length).toBe(unwrapRes.texWidth * unwrapRes.texHeight);
    let nonZeroCurv = 0;
    for (let i = 0; i < curvMap.length; i++) {
      expect(curvMap[i]).toBeGreaterThanOrEqual(-1.0);
      expect(curvMap[i]).toBeLessThanOrEqual(1.0);
      if (Math.abs(curvMap[i]) > 0.01) nonZeroCurv++;
    }
    expect(nonZeroCurv).toBeGreaterThan(0);

    // 3. Meshy-to-Pixelizer Texture Remastering: downsample, black-floor lift >= 28, normal slope <= 0.24, confetti suppression
    const srcW = 128;
    const srcH = 128;
    const noisyData = new Uint8Array(srcW * srcH * 4);
    for (let y = 0; y < srcH; y++) {
      for (let x = 0; x < srcW; x++) {
        const idx = (y * srcW + x) * 4;
        // Inject crushed black (5,5,5) with isolated high-contrast 1px Nyquist speckles
        const isSpeckle = x % 5 === 0 && y % 5 === 0;
        const v = isSpeckle ? 235 : 5;
        noisyData[idx + 0] = v;
        noisyData[idx + 1] = v;
        noisyData[idx + 2] = v;
        noisyData[idx + 3] = 255;
      }
    }
    const rawTex = new THREE.DataTexture(noisyData, srcW, srcH, THREE.RGBAFormat);
    const remastered = remasterImportedTextureForPixelizer(rawTex, {
      targetMaxDim: 64,
      liftBlackFloor: 28,
      synthesizeNormalMaxSlope: 0.24,
    });

    const albImg = remastered.albedoMap.image as { width: number; height: number; data: Uint8Array };
    const nrmImg = remastered.normalMap.image as { width: number; height: number; data: Uint8Array };
    expect(albImg.width).toBe(64);
    expect(albImg.height).toBe(64);
    expect(remastered.albedoMap.magFilter).toBe(THREE.NearestFilter);
    expect(remastered.normalMap.colorSpace).toBe(THREE.NoColorSpace);

    let minCh = 255;
    let maxCh = 0;
    for (let i = 0; i < albImg.data.length; i += 4) {
      minCh = Math.min(minCh, albImg.data[i], albImg.data[i + 1], albImg.data[i + 2]);
      maxCh = Math.max(maxCh, albImg.data[i], albImg.data[i + 1], albImg.data[i + 2]);
    }
    expect(minCh).toBeGreaterThanOrEqual(28);
    expect(maxCh).toBeLessThanOrEqual(242);

    let maxNormalSlope = 0;
    for (let i = 0; i < nrmImg.data.length; i += 4) {
      const nx = (nrmImg.data[i] / 255) * 2 - 1;
      const ny = (nrmImg.data[i + 1] / 255) * 2 - 1;
      maxNormalSlope = Math.max(maxNormalSlope, Math.abs(nx), Math.abs(ny));
    }
    expect(maxNormalSlope).toBeLessThanOrEqual(0.245);

    // 4. Pure-TS ZIP store reader & ZIP64 sentinel rejection check
    const emptyZipEocd = new Uint8Array(22);
    emptyZipEocd[0] = 0x50;
    emptyZipEocd[1] = 0x4b;
    emptyZipEocd[2] = 0x05;
    emptyZipEocd[3] = 0x06;
    const entries = await extractZipArchiveEntries(emptyZipEocd.buffer);
    expect(entries).toEqual([]);

    const zip64Eocd = new Uint8Array(22);
    zip64Eocd.set(emptyZipEocd);
    const zip64View = new DataView(zip64Eocd.buffer);
    zip64View.setUint16(10, 0xffff, true);
    zip64View.setUint32(12, 0xffffffff, true);
    zip64View.setUint32(16, 0xffffffff, true);
    await expect(extractZipArchiveEntries(zip64Eocd.buffer)).rejects.toThrow(/ZIP64/i);
  });
});
