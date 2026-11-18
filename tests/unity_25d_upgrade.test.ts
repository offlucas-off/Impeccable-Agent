import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  DIMETRIC_2_1_PITCH_RAD,
  ISO_YAW_STEP_RAD,
  TRUE_ISOMETRIC_PITCH_RAD,
  computeIsometricCameraPosition,
  getDimetricVerticalRatio,
  getIsometricPitchRad,
  snapToDimetricWorldGrid,
} from '../src/engine/snapping';
import {
  applyPostOutline1px,
  packTightSpriteFrames,
  type TightPackFrameInput,
} from '../src/engine/SpriteSheetExporter';

function makeRgbaFrame(
  width: number,
  height: number,
  opaqueRect?: { x: number; y: number; w: number; h: number; color?: [number, number, number, number] }
): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(width * height * 4);
  if (!opaqueRect) return buf;
  const [r, g, b, a] = opaqueRect.color ?? [200, 120, 60, 255];
  for (let y = opaqueRect.y; y < opaqueRect.y + opaqueRect.h; y++) {
    for (let x = opaqueRect.x; x < opaqueRect.x + opaqueRect.w; x++) {
      const idx = (y * width + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = a;
    }
  }
  return buf;
}

describe('Unity 2.5D Projection & Dimetric Snapping', () => {
  it('defines accurate 2:1 dimetric and true isometric pitch constants', () => {
    const dimetricDeg = (DIMETRIC_2_1_PITCH_RAD * 180) / Math.PI;
    const trueIsoDeg = (TRUE_ISOMETRIC_PITCH_RAD * 180) / Math.PI;

    expect(DIMETRIC_2_1_PITCH_RAD).toBeCloseTo(Math.atan(0.5), 10);
    expect(dimetricDeg).toBeCloseTo(26.565051, 5);
    expect(TRUE_ISOMETRIC_PITCH_RAD).toBeCloseTo(Math.atan(1 / Math.SQRT2), 10);
    expect(trueIsoDeg).toBeCloseTo(35.264389, 5);
    expect(ISO_YAW_STEP_RAD).toBeCloseTo(Math.PI / 4, 10);
  });

  it('returns matching pitch and vertical ratio for each projection mode', () => {
    expect(getIsometricPitchRad('dimetric_2_1')).toBe(DIMETRIC_2_1_PITCH_RAD);
    expect(getIsometricPitchRad('true_iso')).toBe(TRUE_ISOMETRIC_PITCH_RAD);

    expect(getDimetricVerticalRatio('dimetric_2_1')).toBe(0.5);
    expect(getDimetricVerticalRatio('true_iso')).toBeCloseTo(1 / Math.SQRT2, 10);
  });

  it('computes isometric camera positions at exact distance and 2:1 / true-iso pitch', () => {
    const target = new THREE.Vector3(3, 1.5, -2);
    const distance = 12;

    for (let i = 0; i < 8; i++) {
      const yaw = i * ISO_YAW_STEP_RAD;
      const posDimetric = computeIsometricCameraPosition(target, distance, yaw, 'dimetric_2_1');
      const offset = posDimetric.clone().sub(target);
      const horizDist = Math.hypot(offset.x, offset.z);

      expect(offset.length()).toBeCloseTo(distance, 6);
      expect(Math.atan2(offset.y, horizDist)).toBeCloseTo(DIMETRIC_2_1_PITCH_RAD, 6);
      expect(offset.y / horizDist).toBeCloseTo(0.5, 6);

      const posTrueIso = computeIsometricCameraPosition(target, distance, yaw, 'true_iso');
      const offsetIso = posTrueIso.clone().sub(target);
      const horizDistIso = Math.hypot(offsetIso.x, offsetIso.z);

      expect(offsetIso.length()).toBeCloseTo(distance, 6);
      expect(Math.atan2(offsetIso.y, horizDistIso)).toBeCloseTo(TRUE_ISOMETRIC_PITCH_RAD, 6);
    }
  });

  it('snaps world coordinates to the 2:1 dimetric pixel grid without creep', () => {
    const worldPixelSize = 0.05;
    const raw = new THREE.Vector3(1.234, 2.345, -0.876);

    const snappedDefault = snapToDimetricWorldGrid(raw, worldPixelSize);
    const snappedExplicit = snapToDimetricWorldGrid(raw, worldPixelSize, 'dimetric_2_1');

    expect(snappedDefault.x).toBeCloseTo(snappedExplicit.x, 10);
    expect(snappedDefault.y).toBeCloseTo(snappedExplicit.y, 10);
    expect(snappedDefault.z).toBeCloseTo(snappedExplicit.z, 10);

    // X snaps to multiples of worldPixelSize
    expect(snappedDefault.x / worldPixelSize).toBeCloseTo(Math.round(snappedDefault.x / worldPixelSize), 8);

    // Y snaps to worldPixelSize / cos(pitch) and Z snaps to worldPixelSize / sin(pitch)
    const yStep = worldPixelSize / Math.cos(DIMETRIC_2_1_PITCH_RAD);
    const zStep = worldPixelSize / Math.sin(DIMETRIC_2_1_PITCH_RAD);
    expect(snappedDefault.y / yStep).toBeCloseTo(Math.round(snappedDefault.y / yStep), 8);
    expect(snappedDefault.z / zStep).toBeCloseTo(Math.round(snappedDefault.z / zStep), 8);

    // Idempotent when re-snapped
    const resnapped = snapToDimetricWorldGrid(snappedDefault, worldPixelSize, 'dimetric_2_1');
    expect(resnapped.x).toBeCloseTo(snappedDefault.x, 10);
    expect(resnapped.y).toBeCloseTo(snappedDefault.y, 10);
    expect(resnapped.z).toBeCloseTo(snappedDefault.z, 10);

    // True iso uses different Y/Z step than dimetric_2_1
    const snappedTrueIso = snapToDimetricWorldGrid(raw, worldPixelSize, 'true_iso');
    expect(snappedTrueIso.z).not.toBeCloseTo(snappedDefault.z, 4);

    // Guards invalid/non-finite pixel sizes
    const safe = snapToDimetricWorldGrid(raw, Number.NaN);
    expect(Number.isFinite(safe.x)).toBe(true);
    expect(Number.isFinite(safe.y)).toBe(true);
    expect(Number.isFinite(safe.z)).toBe(true);
  });
});

describe('Unity 2.5D Tight Sprite Packing & Post-Outline', () => {
  it('trims transparent borders, preserves pixels, and handles untrimmed/empty frames', () => {
    const trimmedInput: TightPackFrameInput = {
      name: 'Idle_S_00',
      direction: 'S',
      clip: 'Idle',
      frameIndex: 0,
      width: 32,
      height: 40,
      rgba: makeRgbaFrame(32, 40, { x: 6, y: 5, w: 12, h: 20, color: [10, 200, 30, 255] }),
    };

    const untrimmedInput: TightPackFrameInput = {
      name: 'Idle_S_01',
      direction: 'S',
      clip: 'Idle',
      frameIndex: 1,
      width: 10,
      height: 10,
      rgba: makeRgbaFrame(10, 10, { x: 0, y: 0, w: 10, h: 10, color: [255, 0, 0, 255] }),
    };

    const emptyInput: TightPackFrameInput = {
      name: 'Idle_S_02',
      direction: 'S',
      clip: 'Idle',
      frameIndex: 2,
      width: 16,
      height: 16,
      rgba: makeRgbaFrame(16, 16),
    };

    const result = packTightSpriteFrames([trimmedInput, untrimmedInput, emptyInput], {
      padding: 2,
      maxWidth: 128,
    });

    const f0 = result.unityMeta.frames[0];
    expect(f0.trimmed).toBe(true);
    expect(f0.sourceSize).toEqual({ w: 32, h: 40 });
    expect(f0.spriteSourceSize).toEqual({ x: 6, y: 5, w: 12, h: 20 });
    expect(f0.rect.w).toBe(12);
    expect(f0.rect.h).toBe(20);

    // Verify trimmed pixel data landed accurately in atlasRgba
    for (let y = 0; y < f0.rect.h; y++) {
      for (let x = 0; x < f0.rect.w; x++) {
        const p = ((f0.rect.y + y) * result.atlasWidth + (f0.rect.x + x)) * 4;
        expect(result.atlasRgba[p]).toBe(10);
        expect(result.atlasRgba[p + 1]).toBe(200);
        expect(result.atlasRgba[p + 2]).toBe(30);
        expect(result.atlasRgba[p + 3]).toBe(255);
      }
    }

    const f1 = result.unityMeta.frames[1];
    expect(f1.trimmed).toBe(false);
    expect(f1.spriteSourceSize).toEqual({ x: 0, y: 0, w: 10, h: 10 });

    const f2 = result.unityMeta.frames[2];
    expect(f2.trimmed).toBe(true);
    expect(f2.rect.w).toBe(1);
    expect(f2.rect.h).toBe(1);
  });

  it('shelf-packs multiple frames with padding and zero rect overlap', () => {
    const sizes = [
      { w: 20, h: 30 },
      { w: 24, h: 18 },
      { w: 16, h: 28 },
      { w: 28, h: 22 },
      { w: 14, h: 26 },
      { w: 22, h: 14 },
    ];

    const inputs: TightPackFrameInput[] = sizes.map((s, idx) => ({
      name: `Walk_SE_${idx}`,
      direction: 'SE',
      clip: 'Walk',
      frameIndex: idx,
      width: s.w + 4,
      height: s.h + 4,
      rgba: makeRgbaFrame(s.w + 4, s.h + 4, { x: 2, y: 2, w: s.w, h: s.h }),
    }));

    const padding = 2;
    const result = packTightSpriteFrames(inputs, { padding, maxWidth: 64 });
    const frames = result.unityMeta.frames;

    expect(frames).toHaveLength(inputs.length);
    // Should wrap onto multiple rows under maxWidth: 64
    expect(result.atlasWidth).toBeLessThanOrEqual(64);

    for (let i = 0; i < frames.length; i++) {
      const a = frames[i].rect;
      expect(a.x).toBeGreaterThanOrEqual(padding);
      expect(a.y).toBeGreaterThanOrEqual(padding);
      expect(a.x + a.w + padding).toBeLessThanOrEqual(result.atlasWidth);
      expect(a.y + a.h + padding).toBeLessThanOrEqual(result.atlasHeight);

      for (let j = i + 1; j < frames.length; j++) {
        const b = frames[j].rect;
        // Strict non-overlap with padding separation on at least one axis
        const separatedX = a.x + a.w + padding <= b.x || b.x + b.w + padding <= a.x;
        const separatedY = a.y + a.h + padding <= b.y || b.y + b.h + padding <= a.y;
        expect(separatedX || separatedY).toBe(true);
      }
    }
  });

  it('preserves normalized Unity bottom-left foot pivot after asymmetric trimming', () => {
    // Source 40x40, default bottom-center anchor is (20, 40)
    // Trimmed box x=[10..29] (w=20), y=[4..35] (h=32)
    // Expected Unity pivot:
    //   pivotX = (20 - 10) / 20 = 0.5
    //   pivotY = (4 + 32 - 40) / 32 = -4 / 32 = -0.125
    const asymmetricDefaultAnchor: TightPackFrameInput = {
      name: 'Attack_E_00',
      direction: 'E',
      clip: 'Attack',
      frameIndex: 0,
      width: 40,
      height: 40,
      rgba: makeRgbaFrame(40, 40, { x: 10, y: 4, w: 20, h: 32 }),
    };

    // Custom foot anchor inside the trimmed box: anchorPx=(18, 30)
    // Trimmed box x=[8..27] (w=20), y=[10..39] (h=30)
    // Expected Unity pivot:
    //   pivotX = (18 - 8) / 20 = 0.5
    //   pivotY = (10 + 30 - 30) / 30 = 10 / 30 = 0.333333
    const customAnchor: TightPackFrameInput = {
      name: 'Attack_E_01',
      direction: 'E',
      clip: 'Attack',
      frameIndex: 1,
      width: 40,
      height: 40,
      rgba: makeRgbaFrame(40, 40, { x: 8, y: 10, w: 20, h: 30 }),
      anchorPx: { x: 18, y: 30 },
    };

    const result = packTightSpriteFrames([asymmetricDefaultAnchor, customAnchor]);
    expect(result.unityMeta.frames[0].pivot.x).toBeCloseTo(0.5, 5);
    expect(result.unityMeta.frames[0].pivot.y).toBeCloseTo(-0.125, 5);

    expect(result.unityMeta.frames[1].pivot.x).toBeCloseTo(0.5, 5);
    expect(result.unityMeta.frames[1].pivot.y).toBeCloseTo(1 / 3, 5);
  });

  it('emits valid UnitySpriteAtlasMetadata for dimetric_2_1 and true_iso', () => {
    const input: TightPackFrameInput = {
      name: 'Hero_S_00',
      direction: 'S',
      clip: 'Idle',
      frameIndex: 0,
      width: 16,
      height: 24,
      rgba: makeRgbaFrame(16, 24, { x: 2, y: 2, w: 12, h: 20 }),
    };

    const dimetric = packTightSpriteFrames([input], {
      projection: 'dimetric_2_1',
      pixelsPerUnit: 60,
      version: '2.5.0',
    });

    expect(dimetric.unityMeta.version).toBe('2.5.0');
    expect(dimetric.unityMeta.projection).toBe('dimetric_2_1');
    expect(dimetric.unityMeta.pitchDeg).toBeCloseTo(26.565, 3);
    expect(dimetric.unityMeta.pixelsPerUnit).toBe(60);
    expect(dimetric.unityMeta.atlasSize).toEqual({ w: dimetric.atlasWidth, h: dimetric.atlasHeight });
    expect(dimetric.unityMeta.frames[0]).toMatchObject({
      name: 'Hero_S_00',
      direction: 'S',
      clip: 'Idle',
      frameIndex: 0,
      trimmed: true,
    });

    const trueIso = packTightSpriteFrames([input], { projection: 'true_iso' });
    expect(trueIso.unityMeta.projection).toBe('true_iso');
    expect(trueIso.unityMeta.pitchDeg).toBeCloseTo(35.264, 3);
  });

  it('applies 4-connected 1px post-outline on binary alpha buffers', () => {
    // 5x5 buffer with a single opaque pixel at (2, 2)
    const buf = makeRgbaFrame(5, 5, { x: 2, y: 2, w: 1, h: 1, color: [100, 150, 200, 255] });
    applyPostOutline1px(buf, 5, 5, [12, 34, 56, 255]);

    const getAlpha = (x: number, y: number) => buf[(y * 5 + x) * 4 + 3];
    const getColor = (x: number, y: number) => {
      const i = (y * 5 + x) * 4;
      return [buf[i], buf[i + 1], buf[i + 2], buf[i + 3]];
    };

    // Center pixel remains untouched
    expect(getColor(2, 2)).toEqual([100, 150, 200, 255]);

    // 4-connected neighbors get outline color
    expect(getColor(1, 2)).toEqual([12, 34, 56, 255]);
    expect(getColor(3, 2)).toEqual([12, 34, 56, 255]);
    expect(getColor(2, 1)).toEqual([12, 34, 56, 255]);
    expect(getColor(2, 3)).toEqual([12, 34, 56, 255]);

    // Diagonal neighbors remain transparent
    expect(getAlpha(1, 1)).toBe(0);
    expect(getAlpha(3, 1)).toBe(0);
    expect(getAlpha(1, 3)).toBe(0);
    expect(getAlpha(3, 3)).toBe(0);
  });
});
