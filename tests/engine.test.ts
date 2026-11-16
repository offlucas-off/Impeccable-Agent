import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  BUILTIN_DITHER_PATTERNS,
  BUILTIN_LIGHTING_RAMPS,
  BUILTIN_PALETTES,
  SteppedAnimationController,
  buildPaletteLutPair,
  buildVoxelMeshGroup,
  computeCameraGrid,
  createDitherTexture,
  createLightingRampTexture,
  exportVoxelGridToGlb,
  exportVoxelGridToObj,
  exportVoxelGridToVox,
  findDitherPair,
  hexToRgb,
  projectWorldToBufferPixel,
  restoreObjectTransform,
  rgbToHsv,
  rgbToOklab,
  sampleDitherThreshold,
  snapCameraToPixelGrid,
  snapObjectForRender,
  snapQuaternionAngles,
  voxelizeObject3D,
} from '../src/engine';
import { EXPANSION_FRAGMENT_SHADER } from '../src/engine/shaders/expansionShader';
import { OBJECT_VERTEX_SHADER } from '../src/engine/shaders/objectShader';
import type { CameraSnapConfig, SnapOptions } from '../src/engine/types';
import { pickPreferredClipIndex } from '../src/studio/loaders/modelLoader';

describe('Ordered 4x4 & 8x8 Dither Patterns', () => {
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

  it('supports 8x8 Bayer & Blue Noise matrices and creates 8x8 Nearest DataTextures', () => {
    expect(BUILTIN_DITHER_PATTERNS.length).toBeGreaterThanOrEqual(11);
    const bayer8 = BUILTIN_DITHER_PATTERNS.find((d) => d.id === 'bayer8x8')!;
    const blue8 = BUILTIN_DITHER_PATTERNS.find((d) => d.id === 'bluenoise8x8')!;
    expect(bayer8.size).toBe(8);
    expect(bayer8.thresholds.length).toBe(64);
    expect(blue8.size).toBe(8);
    expect(blue8.thresholds.length).toBe(64);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const v1 = sampleDitherThreshold(bayer8, x, y);
        const v2 = sampleDitherThreshold(blue8, x, y);
        expect(v1).toBeGreaterThan(0);
        expect(v1).toBeLessThan(1);
        expect(v2).toBeGreaterThan(0);
        expect(v2).toBeLessThan(1);
      }
    }
    expect(sampleDitherThreshold(bayer8, 10, 11)).toBeCloseTo(
      sampleDitherThreshold(bayer8, 2, 3),
      6
    );

    const tex = createDitherTexture(bayer8);
    expect(tex.image.width).toBe(8);
    expect(tex.image.height).toBe(8);
    expect(tex.magFilter).toBe(THREE.NearestFilter);
    tex.dispose();
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
  it('converts hex to RGB, HSV, and Oklab accurately', () => {
    expect(hexToRgb('#ff8000')).toEqual([255, 128, 0]);
    const [h, s, v] = rgbToHsv(255, 0, 0);
    expect(h).toBeCloseTo(0, 5);
    expect(s).toBeCloseTo(1, 5);
    expect(v).toBeCloseTo(1, 5);

    const [L0] = rgbToOklab(0, 0, 0);
    const [L1] = rgbToOklab(255, 255, 255);
    expect(L0).toBeCloseTo(0, 4);
    expect(L1).toBeCloseTo(1, 3);
  });

  it('matches exact GameBoy ramp ordering using value_nearest', () => {
    const gb = BUILTIN_PALETTES.find((p) => p.id === 'gameboy')!;
    const palRgb = gb.colors.map(hexToRgb);
    const dark = findDitherPair([10, 10, 10], palRgb, gb.method, gb.hsvWeights, 1.0, 1.0);
    expect(dark.c1).toEqual(palRgb[0]);
    const bright = findDitherPair([250, 255, 240], palRgb, gb.method, gb.hsvWeights, 1.0, 1.0);
    expect(bright.c1).toEqual(palRgb[3]);
  });

  it('includes expanded retro/perceptual palettes and computes oklab/hue_priority/posterize LUTs', () => {
    expect(BUILTIN_PALETTES.length).toBeGreaterThanOrEqual(17);
    for (const id of ['resurrect64', 'snes_pal', 'cyber_neon', 'rgb222', 'onebit_ink']) {
      const p = BUILTIN_PALETTES.find((x) => x.id === id);
      expect(p).toBeDefined();
      const lut = buildPaletteLutPair(p!);
      expect(lut.primaryTex.image.width).toBe(256);
      expect(lut.primaryTex.image.height).toBe(16);
      lut.primaryTex.dispose();
      lut.secondaryTex.dispose();
    }
  });

  it('avoids noisy opposite-hue dithering confetti on neutral steel greys and warm orange fur', () => {
    const endesga = BUILTIN_PALETTES.find((p) => p.id === 'endesga32')!;
    const palRgb = endesga.colors.map(hexToRgb);
    const brightGreen = hexToRgb('#63c74d');
    const hotRed = hexToRgb('#e43b44');

    // Neutral steel greys (Knight armor) should stay cool-grey/slate
    for (const g of [
      [130, 134, 140],
      [175, 178, 182],
      [205, 206, 208],
    ] as [number, number, number][]) {
      const pair = findDitherPair(g, palRgb, 'hsv_weighted', endesga.hsvWeights, 0.85, 1.0);
      expect(pair.c1).not.toEqual(brightGreen);
      expect(pair.c2).not.toEqual(brightGreen);
      expect(pair.c2).not.toEqual(hotRed);
    }

    // Warm orange robot dome / fox coat should never dither against bright green
    const orangePair = findDitherPair(
      [226, 135, 58],
      palRgb,
      'hsv_weighted',
      endesga.hsvWeights,
      0.85,
      1.0
    );
    expect(orangePair.c1).not.toEqual(brightGreen);
    expect(orangePair.c2).not.toEqual(brightGreen);
  });
});

describe('Lighting Ramps & Shader Macropixel Support', () => {
  it('generates 256x1 stepped & smooth ramp DataTextures', () => {
    for (const ramp of BUILTIN_LIGHTING_RAMPS) {
      const tex = createLightingRampTexture(ramp);
      expect(tex.image.width).toBe(256);
      expect(tex.image.height).toBe(1);
      tex.dispose();
    }
  });

  it('supports morph targets and 1x1..10x10 macropixel expansion shaders', () => {
    expect(OBJECT_VERTEX_SHADER).toContain('#include <morphtarget_vertex>');
    expect(OBJECT_VERTEX_SHADER).toContain('#include <skinning_vertex>');
    expect(EXPANSION_FRAGMENT_SHADER).toContain('for (int dx = -6; dx <= 6; dx++)');
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

describe('Stepped Animation Controller & Character Clips', () => {
  it('quantizes continuous timeline into crisp discrete steps', () => {
    const ctrl = new SteppedAnimationController();
    ctrl.config.enabled = true;
    ctrl.config.fps = 8;

    expect(ctrl.update(0.05)).toBeCloseTo(0.0, 5);
    expect(ctrl.update(0.05)).toBeCloseTo(0.0, 5);
    expect(ctrl.update(0.04)).toBeCloseTo(0.125, 5);

    ctrl.config.enabled = false;
    expect(ctrl.update(0.02)).toBeCloseTo(0.16, 5);
  });

  it('picks lively locomotion clips before static attack or T-pose clips', () => {
    const clips = [
      new THREE.AnimationClip('1H_Melee_Attack_Chop', 1, []),
      new THREE.AnimationClip('TPose', 1, []),
      new THREE.AnimationClip('Idle', 1, []),
      new THREE.AnimationClip('Walking_A', 1, []),
    ];
    expect(pickPreferredClipIndex(clips)).toBe(3);
  });
});

describe('3D Voxelizer & GLB / OBJ / VOX Mesh Exporters', () => {
  it('voxelizes a 3D hierarchy with neighbor face culling and palette quantization', () => {
    const root = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.0, 1.2),
      new THREE.MeshStandardMaterial({ color: '#e43b44' })
    );
    box.position.set(0, 1.0, 0);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 12, 10),
      new THREE.MeshStandardMaterial({ color: '#2ce8f5' })
    );
    head.position.set(0, 2.4, 0);
    root.add(box, head);

    const gbPalette = BUILTIN_PALETTES.find((p) => p.id === 'gameboy')!;
    const grid = voxelizeObject3D(root, {
      resolution: 18,
      palette: gbPalette,
      dither3d: true,
      fillSolidInterior: true,
    });

    expect(grid.voxels.length).toBeGreaterThan(100);
    expect(grid.faceCount).toBeGreaterThan(grid.voxels.length);
    // Neighbor face culling removes interior shared cube faces
    expect(grid.faceCount).toBeLessThan(grid.voxels.length * 6);
    expect(grid.geometry.getAttribute('position').count).toBe(grid.faceCount * 4);
    expect(grid.geometry.getAttribute('color').count).toBe(grid.faceCount * 4);
    expect(grid.geometry.getAttribute('normal').count).toBe(grid.faceCount * 4);

    // Every voxel color must strictly belong to the GameBoy 4-color palette
    const validRgbSet = new Set(gbPalette.colors.map((c) => hexToRgb(c).join(',')));
    for (const v of grid.voxels) {
      expect(validRgbSet.has(`${v.r},${v.g},${v.b}`)).toBe(true);
    }

    const preview = buildVoxelMeshGroup(grid);
    expect(preview.group.children.length).toBe(1);
    expect(preview.material.vertexColors).toBe(true);
    preview.material.dispose();
    grid.geometry.dispose();
  });

  it('exports valid .OBJ, MagicaVoxel .VOX, and binary glTF .GLB assets', async () => {
    const root = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: '#feae34' })
    );
    root.add(mesh);

    const grid = voxelizeObject3D(root, {
      resolution: 10,
      fillSolidInterior: true,
    });

    // 1. Wavefront OBJ check
    const obj = exportVoxelGridToObj(grid, 'test_crate');
    expect(obj).toContain('o test_crate');
    expect(obj).toMatch(/^v [-0-9.]+ [-0-9.]+ [-0-9.]+ [01]\.[0-9]+/m);
    expect(obj).toMatch(/^f \d+\/\/\d+ \d+\/\/\d+ \d+\/\/\d+/m);

    // 2. MagicaVoxel .VOX header & chunks check
    const vox = exportVoxelGridToVox(grid);
    const voxTag = String.fromCharCode(vox[0], vox[1], vox[2], vox[3]);
    const voxView = new DataView(vox.buffer);
    expect(voxTag).toBe('VOX ');
    expect(voxView.getInt32(4, true)).toBe(150);
    const mainTag = String.fromCharCode(vox[8], vox[9], vox[10], vox[11]);
    expect(mainTag).toBe('MAIN');

    // 3. Binary glTF .GLB check (minimal FileReader polyfill for Node environment)
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
      const glbBuf = await exportVoxelGridToGlb(grid, 'test_crate');
      const glbView = new DataView(glbBuf);
      // 0x46546C67 == 'glTF' little-endian
      expect(glbView.getUint32(0, true)).toBe(0x46546c67);
      expect(glbView.getUint32(4, true)).toBe(2);
      expect(glbView.getUint32(8, true)).toBe(glbBuf.byteLength);
    } finally {
      if (!hadFileReader) {
        delete (globalThis as Record<string, unknown>).FileReader;
      }
      grid.geometry.dispose();
    }
  });
});
