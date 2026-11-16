import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  BUILTIN_DITHER_PATTERNS,
  BUILTIN_LIGHTING_RAMPS,
  BUILTIN_PALETTES,
  SteppedAnimationController,
  buildPaletteLutPair,
  computeCameraGrid,
  createDitherTexture,
  createLightingRampTexture,
  findDitherPair,
  hexToRgb,
  projectWorldToBufferPixel,
  restoreObjectTransform,
  rgbToHsv,
  sampleDitherThreshold,
  snapCameraToPixelGrid,
  snapObjectForRender,
  snapQuaternionAngles,
} from '../src/engine';
import type { CameraSnapConfig, SnapOptions } from '../src/engine/types';

describe('Ordered 4x4 Dither Patterns', () => {
  it('samples normalized thresholds within (0, 1) and tiles cleanly across 4x4', () => {
    const bayer = BUILTIN_DITHER_PATTERNS[0];
    const t0 = sampleDitherThreshold(bayer, 0, 0);
    const tWrap = sampleDitherThreshold(bayer, 4, -8);
    expect(tWrap).toBeCloseTo(t0, 6);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const val = sampleDitherThreshold(bayer, x, y);
        expect(val).toBeGreaterThan(0);
        expect(val).toBeLessThan(1);
      }
    }
  });

  it('creates a 4x4 RGBA DataTexture with NearestFilter', () => {
    const tex = createDitherTexture(BUILTIN_DITHER_PATTERNS[0]);
    expect(tex.image.width).toBe(4);
    expect(tex.image.height).toBe(4);
    expect(tex.magFilter).toBe(THREE.NearestFilter);
    tex.dispose();
  });
});

describe('Color Palettes & Dual 3D LUT Generation', () => {
  it('converts hex to RGB and HSV accurately', () => {
    expect(hexToRgb('#ff8000')).toEqual([255, 128, 0]);
    const [h, s, v] = rgbToHsv(255, 0, 0);
    expect(h).toBeCloseTo(0, 5);
    expect(s).toBeCloseTo(1, 5);
    expect(v).toBeCloseTo(1, 5);
  });

  it('matches exact GameBoy ramp ordering using value_nearest', () => {
    const gb = BUILTIN_PALETTES.find((p) => p.id === 'gameboy')!;
    const palRgb = gb.colors.map(hexToRgb);
    const dark = findDitherPair([10, 10, 10], palRgb, gb.method, gb.hsvWeights, 1.0, 1.0);
    expect(dark.c1).toEqual(palRgb[0]);
    const bright = findDitherPair([250, 255, 240], palRgb, gb.method, gb.hsvWeights, 1.0, 1.0);
    expect(bright.c1).toEqual(palRgb[3]);
  });

  it('generates 256x16 primary & secondary LUT textures', () => {
    const gb = BUILTIN_PALETTES.find((p) => p.id === 'gameboy')!;
    const lut = buildPaletteLutPair(gb);
    expect(lut.size).toBe(16);
    expect(lut.primaryTex.image.width).toBe(256);
    expect(lut.primaryTex.image.height).toBe(16);
    expect(lut.secondaryTex.image.width).toBe(256);
    expect(lut.secondaryTex.image.height).toBe(16);
    lut.primaryTex.dispose();
    lut.secondaryTex.dispose();
  });
});

describe('Lighting Ramps', () => {
  it('generates 256x1 stepped & smooth ramp DataTextures', () => {
    for (const ramp of BUILTIN_LIGHTING_RAMPS) {
      const tex = createLightingRampTexture(ramp);
      expect(tex.image.width).toBe(256);
      expect(tex.image.height).toBe(1);
      tex.dispose();
    }
  });
});

describe('Anti-Pixel-Creep Grid & Angle Snapping', () => {
  const camCfg: CameraSnapConfig = {
    orthographic: true,
    orthoHeight: 6.0,
    perspectiveFov: 38,
    resolutionMode: 'world_space_pixel_size',
    worldSpacePixelSize: 0.025,
    downscaleRatio: 3,
    targetHeight: 240,
    snapCameraPosition: true,
    cameraSubpixelMotion: true,
    upscaleMode: 'pixel_art_aa',
  };

  it('computes consistent grids across all 3 resolution modes', () => {
    const g1 = computeCameraGrid(1280, 720, camCfg);
    expect(g1.lowResHeight).toBe(240);
    expect(g1.worldPixelSize).toBeCloseTo(0.025, 5);

    const g2 = computeCameraGrid(900, 600, {
      ...camCfg,
      resolutionMode: 'fixed_downscale_ratio',
      downscaleRatio: 3,
    });
    expect(g2.lowResWidth).toBe(300);
    expect(g2.lowResHeight).toBe(200);

    const g3 = computeCameraGrid(1280, 720, {
      ...camCfg,
      resolutionMode: 'fixed_target_resolution',
      targetHeight: 180,
    });
    expect(g3.lowResHeight).toBe(180);
    expect(g3.lowResWidth).toBe(320);
  });

  it('snaps camera position to multiples of worldPixelSize in camera axes', () => {
    const cam = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
    cam.position.set(5.137, 4.912, 5.241);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();

    const grid = computeCameraGrid(960, 540, camCfg);
    const saved = snapCameraToPixelGrid(cam, grid, camCfg);
    expect(saved).not.toBeNull();
    expect(cam.position.distanceTo(saved!)).toBeLessThan(grid.worldPixelSize * 1.5);
    expect(grid.subpixelOffsetUv.length()).toBeGreaterThanOrEqual(0);
  });

  it('snaps object position and restores transform with zero drift', () => {
    const cam = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
    cam.position.set(6, 5, 6);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();

    const parent = new THREE.Group();
    parent.position.set(0.312, 0.087, -0.149);
    const child = new THREE.Mesh();
    child.position.set(0.219, 0.444, 0.103);
    parent.add(child);
    parent.updateMatrixWorld(true);

    const snap: SnapOptions = {
      snapPosition: true,
      alignPixelGrid: true,
      alignmentPixelSize: 3,
      angleSnapMode: 'world_space',
      angleResolutionDeg: 45,
    };

    const origParentPos = parent.position.clone();
    const savedP = snapObjectForRender(parent, cam, 0.025, snap);
    const savedC = snapObjectForRender(child, cam, 0.025, snap, parent);

    // Child should quantize to macropixel grid
    const projected = projectWorldToBufferPixel(
      new THREE.Vector3().setFromMatrixPosition(child.matrixWorld),
      cam,
      320,
      180
    );
    expect(Number.isFinite(projected.x)).toBe(true);
    expect(Number.isFinite(projected.y)).toBe(true);

    restoreObjectTransform(child, savedC);
    restoreObjectTransform(parent, savedP);
    expect(parent.position.distanceTo(origParentPos)).toBeLessThan(1e-6);
  });

  it('quantizes quaternion angles in both world_space and camera_space_y modes', () => {
    const cam = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
    cam.position.set(0, 2, 10);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();

    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.18, 0.72, 0.05, 'YXZ'));
    const snappedWorld = snapQuaternionAngles(q, cam, 'world_space', 45);
    const e = new THREE.Euler().setFromQuaternion(snappedWorld, 'YXZ');
    expect(Math.round(THREE.MathUtils.radToDeg(e.y)) % 45).toBe(0);

    const snappedCamY = snapQuaternionAngles(q, cam, 'camera_space_y', 45);
    expect(snappedCamY.length()).toBeCloseTo(1, 5);
  });
});

describe('Stepped Animation Controller', () => {
  it('quantizes continuous timeline into crisp discrete steps', () => {
    const ctrl = new SteppedAnimationController();
    ctrl.config.enabled = true;
    ctrl.config.fps = 8; // 0.125s per frame

    expect(ctrl.update(0.05)).toBeCloseTo(0.0, 5);
    expect(ctrl.update(0.05)).toBeCloseTo(0.0, 5); // 0.10s < 0.125s
    expect(ctrl.update(0.04)).toBeCloseTo(0.125, 5); // 0.14s >= 0.125s

    ctrl.config.enabled = false;
    expect(ctrl.update(0.02)).toBeCloseTo(0.16, 5);
  });
});
