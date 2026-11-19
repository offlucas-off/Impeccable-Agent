// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { readFileSync } from 'node:fs';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { dirname, resolve } from 'node:path';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { describe, expect, it } from 'vitest';
import {
  AnimationLibraryBank,
  PixelizerMaterial,
  PixelizerPipeline,
  buildNwlPlayerCharacter,
  buildProceduralProp,
  buildQuadrupedAnimClips,
  conditionClipWithEquipment,
  createCanonicalQuadrupedRig,
  detectSubjectEquipment,
  exportRiggedAssetToGlb,
} from '../src/engine';
import {
  PIXELIZER_UNITY_IMPORTER_CS,
  getUnityImporterScript,
} from '../src/engine/unity/PixelizerUnityImporterTemplate';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readFileAsArrayBuffer(relPath: string): ArrayBuffer {
  const buf = readFileSync(resolve(ROOT_DIR, relPath)) as Uint8Array;
  return new Uint8Array(buf).buffer;
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

describe('Round 3: Unity 6 URP Bridge, Wing Anims, Hi-Fi Bloom & Foliage Cards', () => {
  it('PIXELIZER_UNITY_IMPORTER_CS includes SpriteImportMode.Multiple, AnimationClip, URP Lit setup, and AlphaClip handling', () => {
    expect(typeof PIXELIZER_UNITY_IMPORTER_CS).toBe('string');
    expect(getUnityImporterScript()).toBe(PIXELIZER_UNITY_IMPORTER_CS);
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('SpriteImportMode.Multiple');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('AnimationClip');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('Universal Render Pipeline/Lit');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('alphaClipThreshold');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('_AlphaClip');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('_Cutoff');
    expect(PIXELIZER_UNITY_IMPORTER_CS).toContain('_ALPHATEST_ON');
  });

  it('exportRiggedAssetToGlb preserves conditioned animation tracks when equipment is mounted', async () => {
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) {
      await bank.loadFromArrayBuffer(readFileAsArrayBuffer('public/animations/ual_master_library.glb'));
    }
    const rawWalk = bank.getClip('Jog_Fwd_Loop') ?? bank.getClip('Idle_Loop');
    expect(rawWalk).toBeTruthy();

    const player = buildNwlPlayerCharacter({
      classId: 'knight',
      rarity: 'rare',
      materialSeed: 303,
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
      const detected = detectSubjectEquipment(player.root);
      expect(detected.hasMainWeapon || detected.hasShield).toBe(true);

      const expectedConditioned = conditionClipWithEquipment(rawWalk!, detected);
      const expectedArmR = expectedConditioned.tracks.find((t) => t.name === 'upperarm_r.quaternion');
      const rawArmR = rawWalk!.tracks.find((t) => t.name === 'upperarm_r.quaternion');
      expect(expectedArmR).toBeDefined();
      expect(rawArmR).toBeDefined();

      const { buffer, validation } = await exportRiggedAssetToGlb(player.root, [rawWalk!], {
        name: 'r3_knight_conditioned',
        resetToRestPose: true,
      });

      expect(validation.clipCount).toBe(1);
      const loader = new GLTFLoader();
      const loaded = await loader.parseAsync(buffer, '');
      expect(loaded.animations.length).toBe(1);

      const exportedClip = loaded.animations[0];
      const exportedArmR = exportedClip.tracks.find((t) => t.name === 'upperarm_r.quaternion');
      expect(exportedArmR).toBeDefined();
      expect(exportedArmR!.values.length).toBe(expectedArmR!.values.length);

      // Exported track values must match the equipment-conditioned track and differ from raw unconditioned values
      let maxDiffFromExpected = 0;
      let maxDiffFromRaw = 0;
      for (let i = 0; i < exportedArmR!.values.length; i++) {
        maxDiffFromExpected = Math.max(
          maxDiffFromExpected,
          Math.abs(exportedArmR!.values[i] - expectedArmR!.values[i])
        );
        maxDiffFromRaw = Math.max(
          maxDiffFromRaw,
          Math.abs(exportedArmR!.values[i] - rawArmR!.values[i])
        );
      }
      expect(maxDiffFromExpected).toBeLessThan(1e-4);
      if (detected.hasMainWeapon) {
        expect(maxDiffFromRaw).toBeGreaterThan(1e-3);
      }
    } finally {
      if (!hadFileReader) {
        delete (globalThis as Record<string, unknown>).FileReader;
      }
      player.dispose();
    }
  });

  it('buildQuadrupedAnimClips(includeWings: true) produces wing and tail tracks across clips', () => {
    const rig = createCanonicalQuadrupedRig(1, { includeWings: true });
    expect(rig.bones.length).toBe(30);

    const clips = buildQuadrupedAnimClips(rig);
    expect(clips.length).toBeGreaterThanOrEqual(6);

    const expectedWingBones = [
      'wing_root_l',
      'wing_root_r',
      'wing_elbow_l',
      'wing_elbow_r',
      'wing_tip_l',
      'wing_tip_r',
    ];
    const expectedTailBones = ['tail_01', 'tail_02'];

    for (const clip of clips) {
      const trackNames = new Set(clip.tracks.map((t) => t.name));
      for (const bone of expectedWingBones) {
        const trackName = `${bone}.quaternion`;
        expect(trackNames.has(trackName), `${clip.name} missing ${trackName}`).toBe(true);
      }
      for (const tailBone of expectedTailBones) {
        const trackName = `${tailBone}.quaternion`;
        expect(trackNames.has(trackName), `${clip.name} missing ${trackName}`).toBe(true);
      }
    }

    const gallop = clips.find((c) => c.name === 'Run_Gallop');
    expect(gallop).toBeDefined();
    const wingRootL = gallop!.tracks.find((t) => t.name === 'wing_root_l.quaternion');
    expect(wingRootL).toBeDefined();
    expect(wingRootL!.times.length).toBeGreaterThanOrEqual(4);
  });

  it('PixelizerPipeline hifi_stylized uses selective high-threshold bloom (>= 0.85)', () => {
    const pipeline = makeMockPipeline();
    try {
      expect(pipeline.activeStylePreset).toBe('hifi_stylized');
      expect(pipeline.pipelineConfig.bloomEnabled).toBe(true);
      expect(pipeline.pipelineConfig.bloomThreshold).toBeGreaterThanOrEqual(0.85);
      expect(pipeline.pipelineConfig.bloomIntensity).toBeGreaterThan(0);

      pipeline.applyVisualStylePreset('nwl_snes');
      expect(pipeline.pipelineConfig.bloomEnabled).toBe(false);

      pipeline.applyVisualStylePreset('hifi_stylized');
      expect(pipeline.pipelineConfig.bloomEnabled).toBe(true);
      expect(pipeline.pipelineConfig.bloomThreshold).toBeGreaterThanOrEqual(0.85);
    } finally {
      pipeline.dispose();
    }
  });

  it('buildProceduralProp({ kind: "tree" }) includes alpha leaf cards with alphaClipThreshold >= 0.45 and DoubleSide', () => {
    const tree = buildProceduralProp({ kind: 'tree', seed: 101 });
    try {
      const leafMesh = tree.root.getObjectByName('tree_LeafCards');
      expect(leafMesh).toBeInstanceOf(THREE.Mesh);

      const mesh = leafMesh as THREE.Mesh;
      expect(mesh.material).toBeInstanceOf(PixelizerMaterial);

      const leafMat = mesh.material as PixelizerMaterial;
      expect(leafMat.side).toBe(THREE.DoubleSide);
      expect(leafMat.options.alphaClipThreshold).toBeGreaterThanOrEqual(0.45);
      expect(leafMat.options.albedoMap).toBeDefined();
    } finally {
      tree.dispose?.();
    }
  });
});
