// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { readFileSync } from 'node:fs';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { dirname, resolve } from 'node:path';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
  AnimationLibraryBank,
  CLASS_NORMAL_PALETTES,
  PixelizerMaterial,
  PixelizerPipeline,
  SteppedAnimationController,
  UAL_SKELETON_SPEC,
  bakeTaggedPartsAsset,
  buildNwlNpc,
  buildNwlPlayerCharacter,
  buildNwlSpellVfx,
  buildNwlStarterCity,
  buildProceduralUalCharacter,
  clearPooledMaterialTextures,
  conditionClipForEquipment,
  conditionClipWithEquipment,
  detectSubjectEquipment,
  exportRiggedAssetToGlb,
  exportTurntableSpriteSheet,
  getSpellVfxRecipe,
  inspectGeometryUvs,
  makeBeveledBox,
  tagPart,
  type UnwrapMetricsSummary,
} from '../src/engine';
import { VfxTimelinePlayer } from '../src/engine/vfx';
import {
  computeAutoFrameParams,
  createStudioSpellVfxRunner,
} from '../src/studio/ui/stageManager';

function parseGlbJsonChunk(buffer: ArrayBuffer): Record<string, unknown> {
  const view = new DataView(buffer);
  expect(view.getUint32(0, true)).toBe(0x46546c67); // 'glTF'
  expect(view.getUint32(4, true)).toBe(2);
  const chunkLength = view.getUint32(12, true);
  expect(view.getUint32(16, true)).toBe(0x4e4f534a); // 'JSON'
  const jsonBytes = new Uint8Array(buffer, 20, chunkLength);
  return JSON.parse(new TextDecoder().decode(jsonBytes)) as Record<string, unknown>;
}

function getTextureMeanRgb(tex: THREE.Texture | null | undefined): {
  r: number;
  g: number;
  b: number;
  bytes: Uint8Array;
} {
  expect(tex).toBeDefined();
  const img = tex!.image as { data?: Uint8Array; width?: number; height?: number } | undefined;
  expect(img?.data).toBeInstanceOf(Uint8Array);
  const bytes = img!.data!;
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let count = 0;
  for (let i = 0; i + 3 < bytes.length; i += 4) {
    if (bytes[i + 3] < 16) continue;
    sr += bytes[i];
    sg += bytes[i + 1];
    sb += bytes[i + 2];
    count++;
  }
  expect(count).toBeGreaterThan(0);
  return { r: sr / count, g: sg / count, b: sb / count, bytes };
}

function countTriangles(mesh: THREE.Mesh): number {
  const idx = mesh.geometry.getIndex();
  const pos = mesh.geometry.getAttribute('position');
  return idx ? idx.count / 3 : pos.count / 3;
}

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function ensureUalLibraryLoaded(): Promise<void> {
  const bank = AnimationLibraryBank.getInstance();
  if (bank.isLoaded()) return Promise.resolve();
  const buf = readFileSync(resolve(ROOT_DIR, 'public/animations/ual_master_library.glb')) as Uint8Array;
  const ab = new Uint8Array(buf).buffer;
  return bank.loadFromArrayBuffer(ab).then(() => {});
}

describe('Five Improvements Validation Suite (Frentes 1–5)', () => {
  describe('Frente 1: Class normal palettes, live clip conditioning, and Box3 auto-framing', () => {
    it('gives knight, mage, and archer distinct non-washed-out normal-rarity palettes and chest albedo maps', () => {
      expect(CLASS_NORMAL_PALETTES.knight.primary).toBe('#5d697a');
      expect(CLASS_NORMAL_PALETTES.mage.primary).toBe('#39487a');
      expect(CLASS_NORMAL_PALETTES.archer.primary).toBe('#3f5e45');

      const knight = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'normal' });
      const mage = buildNwlPlayerCharacter({ classId: 'mage', rarity: 'normal' });
      const archer = buildNwlPlayerCharacter({ classId: 'archer', rarity: 'normal' });

      try {
        const findChestTorsoTex = (root: THREE.Object3D): THREE.Texture | null => {
          let fallback: THREE.Texture | null = null;
          let torso: THREE.Texture | null = null;
          root.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.userData?.equipSlot === 'chest') {
              const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
              if (mat instanceof PixelizerMaterial && mat.options.albedoMap) {
                if (!fallback) fallback = mat.options.albedoMap;
                if (obj.name.endsWith('_1')) torso = mat.options.albedoMap;
              }
            }
          });
          return torso ?? fallback;
        };

        const kStats = getTextureMeanRgb(findChestTorsoTex(knight.root));
        const mStats = getTextureMeanRgb(findChestTorsoTex(mage.root));
        const aStats = getTextureMeanRgb(findChestTorsoTex(archer.root));

        // None should be washed-out near-white (>210 across all channels)
        for (const s of [kStats, mStats, aStats]) {
          expect(Math.min(s.r, s.g, s.b)).toBeLessThan(180);
        }

        // Distinct color channels across classes
        const distKM = Math.hypot(kStats.r - mStats.r, kStats.g - mStats.g, kStats.b - mStats.b);
        const distKA = Math.hypot(kStats.r - aStats.r, kStats.g - aStats.g, kStats.b - aStats.b);
        const distMA = Math.hypot(mStats.r - aStats.r, mStats.g - aStats.g, mStats.b - aStats.b);
        expect(distKM).toBeGreaterThan(15);
        expect(distKA).toBeGreaterThan(15);
        expect(distMA).toBeGreaterThan(15);
        expect(aStats.g).toBeGreaterThan(aStats.b);
      } finally {
        knight.dispose();
        mage.dispose();
        archer.dispose();
      }
    });

    it('detects equipment and conditions Spell_Simple_Shoot & Sword_Regular_A without mutating source clips', async () => {
      await ensureUalLibraryLoaded();
      const bank = AnimationLibraryBank.getInstance();
      const spellClip = bank.getClip('Spell_Simple_Shoot');
      const swordClip = bank.getClip('Sword_Regular_A');
      const jogClip = bank.getClip('Jog_Fwd_Loop');
      expect(spellClip).not.toBeNull();
      expect(swordClip).not.toBeNull();
      expect(jogClip).not.toBeNull();

      const knight = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'normal' });
      const mage = buildNwlPlayerCharacter({ classId: 'mage', rarity: 'normal' });
      const mageNoOffhand = buildNwlPlayerCharacter({
        classId: 'mage',
        rarity: 'normal',
        styleLoadout: { weaponOffhand: 'none' },
      });

      try {
        expect(detectSubjectEquipment(knight.root)).toEqual({
          hasMainWeapon: true,
          hasShield: true,
        });
        expect(detectSubjectEquipment(mage.root)).toEqual({
          hasMainWeapon: true,
          hasShield: true,
        });
        expect(detectSubjectEquipment(mageNoOffhand.root)).toEqual({
          hasMainWeapon: true,
          hasShield: false,
        });

        // Direct conditionClipForEquipment on Spell_Simple_Shoot & Sword_Regular_A
        const spellOrigTrack = spellClip!.tracks.find((t) => t.name === 'hand_r.quaternion');
        const spellOrigSnap = spellOrigTrack ? Float32Array.from(spellOrigTrack.values) : null;

        const condSpell = conditionClipForEquipment(spellClip!, {
          elbowFlareDeg: 12,
          clearanceMeters: 0.045,
          weaponLengthMeters: 0.9,
        });
        const condSword = conditionClipForEquipment(swordClip!, {
          elbowFlareDeg: 12,
          clearanceMeters: 0.045,
          weaponLengthMeters: 0.9,
        });

        expect(condSpell).not.toBe(spellClip);
        expect(condSword).not.toBe(swordClip);
        if (spellOrigTrack && spellOrigSnap) {
          expect(Array.from(spellOrigTrack.values)).toEqual(Array.from(spellOrigSnap));
        }

        // Verify all quaternions remain finite and normalized after conditioning
        for (const clip of [condSpell, condSword]) {
          for (const track of clip.tracks) {
            if (!track.name.endsWith('.quaternion')) continue;
            const vals = track.values;
            for (let i = 0; i + 3 < vals.length; i += 4) {
              const len = Math.hypot(vals[i], vals[i + 1], vals[i + 2], vals[i + 3]);
              expect(Number.isFinite(len)).toBe(true);
              expect(len).toBeCloseTo(1, 3);
            }
          }
        }

        // Verify hand_r tip clearance against torso/head/thigh structural capsules on conditioned clips
        const bonePos = new Map<string, THREE.Vector3>();
        for (const b of UAL_SKELETON_SPEC.bones) {
          bonePos.set(b.name, new THREE.Vector3(...b.male.worldPos));
        }
        const handPos = bonePos.get('hand_r')!;
        const capsules = UAL_SKELETON_SPEC.structuralCapsules
          .filter((c) => ['spine_02', 'spine_03', 'Head', 'thigh_l', 'thigh_r'].includes(c.bone))
          .map((c) => ({ center: bonePos.get(c.bone)!, minDist: c.radius + 0.045 }));

        for (const clip of [condSpell, condSword]) {
          const handTrack = clip.tracks.find((t) => t.name === 'hand_r.quaternion');
          if (!handTrack) continue;
          const q = new THREE.Quaternion();
          const tip = new THREE.Vector3();
          for (let i = 0; i + 3 < handTrack.values.length; i += 4) {
            q.set(
              handTrack.values[i],
              handTrack.values[i + 1],
              handTrack.values[i + 2],
              handTrack.values[i + 3]
            );
            tip.set(0, 0, 1).applyQuaternion(q).multiplyScalar(0.9).add(handPos);
            const insideAny = capsules.some((cap) => tip.distanceTo(cap.center) < cap.minDist - 1e-3);
            expect(insideAny).toBe(false);
          }
        }

        // SteppedAnimationController auto-conditions bound clips when equipment is mounted
        const ctrl = new SteppedAnimationController();
        ctrl.bindModel(knight.root, [spellClip!, swordClip!, jogClip!]);
        try {
          const boundClips = ctrl.getClips();
          expect(boundClips.length).toBe(3);
          expect(boundClips[0]).not.toBe(spellClip);
          expect(boundClips[1]).not.toBe(swordClip);
          // Double-conditioning guard returns the already-conditioned clip
          expect(
            conditionClipWithEquipment(boundClips[2], { hasMainWeapon: true, hasShield: true })
          ).toBe(boundClips[2]);
        } finally {
          ctrl.dispose();
        }
      } finally {
        knight.dispose();
        mage.dispose();
        mageNoOffhand.dispose();
      }
    });

    it('computes Box3 auto-framing with tighter orthoHeight for heroes and clamped ceiling for large structures', () => {
      const knight = buildNwlPlayerCharacter({ classId: 'knight', rarity: 'normal' });
      try {
        const heroFrame = computeAutoFrameParams(knight.root, false);
        expect(heroFrame.orthoHeight).toBeGreaterThanOrEqual(2.6);
        expect(heroFrame.orthoHeight).toBeLessThanOrEqual(4.2);
        expect(heroFrame.target.y).toBeCloseTo(heroFrame.center.y, 3);
        expect(heroFrame.cameraDistance).toBeGreaterThanOrEqual(12);
      } finally {
        knight.dispose();
      }

      const giantGeo = new THREE.BoxGeometry(24, 18, 24);
      const giantMesh = new THREE.Mesh(giantGeo, new THREE.MeshBasicMaterial());
      giantMesh.position.set(0, 9, 0);
      try {
        const structFrame = computeAutoFrameParams(giantMesh, true);
        expect(structFrame.orthoHeight).toBeLessThanOrEqual(30.0);
        expect(structFrame.orthoHeight).toBeGreaterThanOrEqual(8.5);
      } finally {
        giantGeo.dispose();
        (giantMesh.material as THREE.Material).dispose();
      }
    });
  });

  describe('Frente 2: Full PBR Maps in .GLB Export (Unity 6 URP)', () => {
    it('embeds normalTexture, metallicRoughnessTexture, and occlusionTexture in the GLB JSON chunk without DataTexture warnings', async () => {
      await ensureUalLibraryLoaded();
      const swordClip = AnimationLibraryBank.getInstance().getClip('Sword_Regular_A');
      expect(swordClip).not.toBeNull();

      const knight = buildProceduralUalCharacter({
        archetype: 'knight',
        rigMode: 'skinned_mesh',
        visualStyle: 'lowpoly',
        seed: 42,
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        const { buffer, validation } = await exportRiggedAssetToGlb(
          knight.root,
          [swordClip!],
          { name: 'knight_pbr_test' }
        );
        expect(validation.meshCount).toBeGreaterThan(0);
        expect(validation.boneCount).toBeGreaterThanOrEqual(65);
        expect(validation.clipCount).toBe(1);

        const glbJson = parseGlbJsonChunk(buffer);
        const materials = (glbJson.materials ?? []) as Array<Record<string, unknown>>;
        const meshes = (glbJson.meshes ?? []) as Array<{
          primitives?: Array<{ attributes?: Record<string, number> }>;
        }>;
        const textures = (glbJson.textures ?? []) as unknown[];

        expect(materials.length).toBeGreaterThan(0);
        expect(textures.length).toBeGreaterThan(0);

        const hasNormal = materials.some((m) => m.normalTexture !== undefined);
        const hasOcclusion = materials.some((m) => m.occlusionTexture !== undefined);
        const hasMr = materials.some((m) => {
          const pbr = m.pbrMetallicRoughness as Record<string, unknown> | undefined;
          return pbr?.metallicRoughnessTexture !== undefined;
        });

        expect(hasNormal).toBe(true);
        expect(hasOcclusion).toBe(true);
        expect(hasMr).toBe(true);

        // Ensure metallicRoughnessTexture preserves roughnessFactor: 1 and metallicFactor: 1
        for (const m of materials) {
          const pbr = m.pbrMetallicRoughness as Record<string, unknown> | undefined;
          if (pbr?.metallicRoughnessTexture !== undefined) {
            expect(pbr.roughnessFactor).toBe(1);
            expect(pbr.metallicFactor).toBe(1);
          }
        }

        // Verify TEXCOORD_0 and TEXCOORD_1 are present for AO / PBR texture compatibility
        const hasTexCoord0 = meshes.some((m) =>
          (m.primitives ?? []).some((p) => p.attributes?.TEXCOORD_0 !== undefined)
        );
        const hasTexCoord1 = meshes.some((m) =>
          (m.primitives ?? []).some((p) => p.attributes?.TEXCOORD_1 !== undefined)
        );
        expect(hasTexCoord0).toBe(true);
        expect(hasTexCoord1).toBe(true);

        const dataTexWarnings = warnSpy.mock.calls.filter((args) =>
          args.some((a) => String(a).includes('GLTFExporter') || String(a).includes('drawImage'))
        );
        expect(dataTexWarnings.length).toBe(0);
      } finally {
        warnSpy.mockRestore();
        knight.dispose?.();
      }
    });
  });

  describe('Frente 3: VfxTimelinePlayer & Studio VFX runner frame-by-frame stepping', () => {
    it('steps VfxTimelinePlayer stages and drives StudioSpellVfxRunner particles/progress + reset', () => {
      const recipe = getSpellVfxRecipe('meteoro');
      const entered: string[] = [];
      const exited: string[] = [];
      let burstCount = 0;
      let completed = false;

      const player = new VfxTimelinePlayer(recipe, {
        onStageEnter: (s) => entered.push(s),
        onStageExit: (s) => exited.push(s),
        onSpawnParticles: () => {
          burstCount++;
        },
        onComplete: () => {
          completed = true;
        },
      });

      expect(entered).toEqual(['telegraph']);
      expect(player.getNormalizedProgress()).toBe(0);

      const stepDt = recipe.totalDurationSec / 12;
      for (let i = 0; i < 14; i++) {
        player.update(stepDt);
      }
      expect(player.isComplete()).toBe(true);
      expect(completed).toBe(true);
      const expectedStages = recipe.stages.map((s) => s.name);
      expect(entered).toEqual(expectedStages);
      expect(exited).toEqual(expectedStages);
      expect(burstCount).toBeGreaterThan(0);

      player.reset();
      expect(player.isComplete()).toBe(false);
      expect(player.getNormalizedProgress()).toBe(0);

      // Studio VFX runner integration
      const vfx = buildNwlSpellVfx('meteoro');
      const runner = createStudioSpellVfxRunner(vfx);
      try {
        expect(runner.durationSec).toBeGreaterThan(0);
        expect(runner.timeline.getNormalizedProgress()).toBe(0);
        for (let i = 0; i < 10; i++) {
          runner.step(0.08, false);
        }
        expect(runner.timeline.getNormalizedProgress()).toBeGreaterThan(0);
        expect(runner.particlePool.mesh.count).toBeGreaterThan(0);

        runner.reset();
        expect(runner.timeline.getNormalizedProgress()).toBe(0);
        expect(runner.timeline.getCurrentStage()?.name).toBe('telegraph');
        expect(runner.vfx.root.position.length()).toBe(0);
      } finally {
        runner.dispose();
      }
    });

    it('steps VFX timeline & onStepVfxFrame per frame inside exportTurntableSpriteSheet', () => {
      const prevDocument = (globalThis as { document?: unknown }).document;
      const fakeCtx = {
        createImageData: (w: number, h: number) => ({
          data: new Uint8ClampedArray(w * h * 4),
          width: w,
          height: h,
        }),
        putImageData: () => {},
        drawImage: () => {},
      };
      (globalThis as { document?: unknown }).document = {
        createElement: () => ({
          width: 0,
          height: 0,
          getContext: () => fakeCtx,
          toDataURL: () => 'data:image/png;base64,iVBORw0KGgo=',
        }),
      };

      const fakeGl = { getExtension: () => null };
      const fakeRenderer = {
        getContext: () => fakeGl,
        setSize: () => {},
        outputColorSpace: '',
        toneMapping: 0,
        readRenderTargetPixels: (
          _rt: unknown,
          _x: number,
          _y: number,
          w: number,
          h: number,
          out: Uint8Array
        ) => {
          out.fill(255);
          expect(out.length).toBe(w * h * 4);
        },
      } as unknown as THREE.WebGLRenderer;

      const pipeline = new PixelizerPipeline(fakeRenderer);
      pipeline.render = () => {};
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 20);
      const target = new THREE.Group();

      const timeline = new VfxTimelinePlayer(getSpellVfxRecipe('meteoro'));
      let resetCount = 0;
      const origReset = timeline.reset.bind(timeline);
      timeline.reset = () => {
        resetCount++;
        origReset();
      };
      const stepLog: Array<{ dir: number; frame: number; progress01: number }> = [];

      try {
        const res = exportTurntableSpriteSheet(
          pipeline,
          scene,
          camera,
          target,
          {
            directions: 2,
            framesPerDirection: 4,
            frameWidth: 32,
            frameHeight: 32,
            transparentBackground: true,
            startYawDeg: 0,
          },
          undefined,
          {
            vfxTimeline: timeline,
            vfxDurationSec: 1.0,
            onStepVfxFrame: (info) => {
              stepLog.push({
                dir: info.directionIndex,
                frame: info.frameIndex,
                progress01: info.progress01,
              });
            },
          }
        );

        expect(res.frames.length).toBe(8);
        expect(resetCount).toBe(2);
        expect(stepLog.length).toBe(8);
        expect(stepLog[0]).toEqual({ dir: 0, frame: 0, progress01: 0 });
        expect(stepLog[3].progress01).toBeCloseTo(0.75, 5);
        expect(stepLog[4]).toEqual({ dir: 1, frame: 0, progress01: 0 });
      } finally {
        pipeline.dispose();
        if (prevDocument === undefined) {
          delete (globalThis as { document?: unknown }).document;
        } else {
          (globalThis as { document?: unknown }).document = prevDocument;
        }
      }
    });
  });

  describe('Frente 4: NpcBuilder lofted hair on Head and head_front UV/texture priority', () => {
    it('mounts lofted curved hair geometry on Head and passes UV integrity on NPC_Head', () => {
      const joalheira = buildNwlNpc('npc.joalheira');
      const escriba = buildNwlNpc('npc.escriba');
      const guarda = buildNwlNpc('npc.guarda'); // helmeted baseline (no lofted hair)

      try {
        const getHeadMesh = (root: THREE.Object3D): THREE.Mesh => {
          let found: THREE.Mesh | null = null;
          root.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.name === 'NPC_Head') {
              found = obj;
            }
          });
          expect(found).not.toBeNull();
          return found!;
        };

        const jHead = getHeadMesh(joalheira.root);
        const eHead = getHeadMesh(escriba.root);
        const gHead = getHeadMesh(guarda.root);

        expect(jHead.parent?.name).toBe('Head');
        expect(eHead.parent?.name).toBe('Head');

        // Lofted spline hair adds curved strand topology well above helmeted baseline
        expect(countTriangles(jHead)).toBeGreaterThan(countTriangles(gHead) + 250);
        expect(countTriangles(eHead)).toBeGreaterThan(countTriangles(gHead) + 250);

        for (const [label, headMesh] of [
          ['joalheira', jHead],
          ['escriba', eHead],
        ] as const) {
          const metrics = headMesh.geometry.userData?.unwrapMetrics as
            | UnwrapMetricsSummary
            | undefined;
          expect(metrics, `${label} head unwrapMetrics`).toBeDefined();
          expect(metrics!.overlapPairs).toBe(0);
          const uvReport = inspectGeometryUvs(
            headMesh.geometry,
            metrics!.texelsPerMeter,
            metrics!.texWidth,
            metrics!.texHeight
          );
          expect(uvReport.nonFiniteTriangles).toBe(0);
          expect(uvReport.collapsedTriangles).toBe(0);
          expect(uvReport.overlapPairs).toBe(0);

          const mat = Array.isArray(headMesh.material)
            ? headMesh.material[0]
            : headMesh.material;
          expect(mat).toBeInstanceOf(PixelizerMaterial);
          const alb = (mat as PixelizerMaterial).options.albedoMap;
          expect(alb).toBeDefined();
        }
      } finally {
        joalheira.dispose?.();
        escriba.dispose?.();
        guarda.dispose?.();
      }
    });

    it('gives head_front priority UV space and paints crisp stylized eye/brow/blush texels', () => {
      const headPart = tagPart(
        makeBeveledBox(0.215, 0.23, 0.215, 0.022, '#f0c4a2', { offset: [0, 0.11, 0] }),
        'head_front',
        'human_skin',
        '#f0c4a2',
        { landmarkKind: 'head_front', lockVertical: true, islandScaleBias: 2.6 }
      );
      const smallAcc = tagPart(
        makeBeveledBox(0.18, 0.12, 0.18, 0.012, '#3a4659', { offset: [0, 0.22, -0.02] }),
        'hair_cap',
        'woven_cloth',
        '#3a4659'
      );

      const baked = bakeTaggedPartsAsset([headPart, smallAcc], {
        finishMode: 'textured_ao',
        texelsPerMeter: 48,
        seed: 77,
        aoRays: 4,
        eyeHex: '#285cc4',
        browHex: '#2f241c',
      });

      try {
        expect(baked.unwrapMetrics?.overlapPairs).toBe(0);
        expect(baked.textures?.albedoMap).toBeDefined();
        const alb = baked.textures!.albedoMap;
        const img = alb.image as { data: Uint8Array; width: number; height: number };
        expect(img.width).toBeGreaterThanOrEqual(64);
        expect(img.height).toBeGreaterThanOrEqual(64);

        // Check that eye iris/pupil/catchlight colors appear in the painted atlas (dark pupil + bright blue iris + warm skin)
        let darkPupilOrBrowPixels = 0;
        let blueIrisPixels = 0;
        let catchlightWhitePixels = 0;
        for (let i = 0; i + 3 < img.data.length; i += 4) {
          if (img.data[i + 3] < 128) continue;
          const r = img.data[i];
          const g = img.data[i + 1];
          const b = img.data[i + 2];
          if (r < 65 && g < 65 && b < 75) darkPupilOrBrowPixels++;
          if (b > r + 35 && b > 120) blueIrisPixels++;
          if (r > 235 && g > 235 && b > 235) catchlightWhitePixels++;
        }
        expect(darkPupilOrBrowPixels).toBeGreaterThan(4);
        expect(blueIrisPixels).toBeGreaterThan(2);
        expect(catchlightWhitePixels).toBeGreaterThan(1);
      } finally {
        baked.geometry.dispose();
        headPart.geometry.dispose();
        smallAcc.geometry.dispose();
        baked.textures?.albedoMap.dispose();
        baked.textures?.normalMap.dispose();
        baked.textures?.roughnessMap.dispose();
        baked.textures?.aoMap.dispose();
        baked.textures?.metalnessMap.dispose();
        baked.textures?.emissionMap?.dispose();
      }
    });
  });

  describe('Frente 5: buildNwlStarterCity fast bake with usePool / cached bakes', () => {
    it('builds NwlStarterCity with usePool/cached bakes finishing fast (< 8s) and sharing pooled textures', () => {
      clearPooledMaterialTextures();

      const tCold0 = performance.now();
      const cityCold = buildNwlStarterCity();
      const coldMs = performance.now() - tCold0;

      try {
        expect(coldMs).toBeLessThan(15000);
        expect(cityCold.houses.length).toBe(6);
        expect(cityCold.npcs.length).toBeGreaterThanOrEqual(9);
        expect(cityCold.materials.length).toBeGreaterThan(20);

        // Pooled textures should be flagged and shared across identical cached bakes (e.g., city_house:porta)
        let pooledTexCount = 0;
        const uniqueDoorAlbedoIds = new Set<string>();
        for (const mat of cityCold.materials) {
          const alb = mat.options.albedoMap;
          if (alb?.userData?.pooled === true) {
            pooledTexCount++;
            uniqueDoorAlbedoIds.add(alb.uuid);
          }
        }
        expect(pooledTexCount).toBeGreaterThan(0);
        expect(uniqueDoorAlbedoIds.size).toBeLessThan(pooledTexCount);
      } finally {
        cityCold.dispose();
      }

      // Cached/pooled rebuild hits BAKED_ASSET_POOL & texture cache and completes fast (< 8s)
      const tWarm0 = performance.now();
      const cityWarm = buildNwlStarterCity();
      const warmMs = performance.now() - tWarm0;
      try {
        expect(warmMs).toBeLessThan(8000);
        expect(cityWarm.houses.length).toBe(6);
      } finally {
        cityWarm.dispose();
      }
    });
  });
});
