// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { readFileSync } from 'node:fs';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { dirname, resolve } from 'node:path';
// @ts-expect-error Node built-in used inside Vitest Node runner without @types/node
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  AnimationLibraryBank,
  BUILTIN_DITHER_PATTERNS,
  BUILTIN_LIGHTING_RAMPS,
  BUILTIN_PALETTES,
  PixelizerMaterial,
  PixelizerPipeline,
  autoRigStaticHumanoidToUal,
  buildPaletteLutPair,
  createDitherTexture,
  createLightingRampTexture,
  detectUalSkeletonCompatibility,
  exportRiggedAssetToGlb,
  simplifyGeometryForPixelArt,
} from '../src/engine';
import { OBJECT_FRAGMENT_SHADER } from '../src/engine/shaders/objectShader';
import { OUTLINE_EDGE_FRAGMENT_SHADER } from '../src/engine/shaders/outlineEdgeShader';
import {
  BLOOM_BLUR_FRAGMENT_SHADER,
  BLOOM_EXTRACT_FRAGMENT_SHADER,
  UPSCALE_FRAGMENT_SHADER,
} from '../src/engine/shaders/upscaleShader';
import { createNwlPlaySandbox } from '../src/sandbox/NwlPlaySandbox';
import { loadModelFromZipBuffer } from '../src/studio/loaders/modelLoader';
import { parseObjTextToBuckets } from '../src/studio/loaders/objZipWorker';
import { extractZipArchiveEntries } from '../src/studio/loaders/zipExtractor';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readFileAsArrayBuffer(relPath: string): ArrayBuffer {
  const buf = readFileSync(resolve(ROOT_DIR, relPath)) as Uint8Array;
  return new Uint8Array(buf).buffer;
}

function createSharedRes() {
  const pal = buildPaletteLutPair(BUILTIN_PALETTES[0]);
  const dith = createDitherTexture(BUILTIN_DITHER_PATTERNS[0]);
  const ramp = createLightingRampTexture(BUILTIN_LIGHTING_RAMPS[0]);
  return {
    lightingRampTex: ramp,
    palettePrimaryTex: pal.primaryTex,
    paletteSecondaryTex: pal.secondaryTex,
    paletteLutSize: pal.size,
    ditherTex: dith,
    ditherSize: 4 as const,
    disposeAll: () => {
      pal.primaryTex.dispose();
      pal.secondaryTex.dispose();
      dith.dispose();
      ramp.dispose();
    },
  };
}

function buildStoreZipBuffer(files: { name: string; data: Uint8Array }[]): ArrayBuffer {
  const enc = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const cdParts: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, 0, true); // STORE
    lv.setUint32(18, f.data.length, true);
    lv.setUint32(22, f.data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    localHeader.set(nameBytes, 30);

    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(10, 0, true); // STORE
    cv.setUint32(20, f.data.length, true);
    cv.setUint32(24, f.data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    cdHeader.set(nameBytes, 46);

    localParts.push(localHeader, f.data);
    cdParts.push(cdHeader);
    offset += localHeader.length + f.data.length;
  }

  const cdSize = cdParts.reduce((s, p) => s + p.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);

  const totalLen = offset + cdSize + eocd.length;
  const out = new Uint8Array(totalLen);
  let cursor = 0;
  for (const p of localParts) {
    out.set(p, cursor);
    cursor += p.length;
  }
  for (const p of cdParts) {
    out.set(p, cursor);
    cursor += p.length;
  }
  out.set(eocd, cursor);
  return out.buffer;
}

function createFakePngHeaderBytes(width = 32, height = 32): Uint8Array {
  const bytes = new Uint8Array(64);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  const dv = new DataView(bytes.buffer);
  dv.setUint32(8, 13, false); // IHDR length
  bytes.set([0x49, 0x48, 0x44, 0x52], 12); // IHDR
  dv.setUint32(16, width, false);
  dv.setUint32(20, height, false);
  for (let i = 24; i < bytes.length; i++) {
    bytes[i] = (i * 37 + 91) & 0xff;
  }
  return bytes;
}

function buildStaticHumanoidGroup(armSlopeDeg: number, scaleFactor = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = `StaticHumanoid_${armSlopeDeg}deg`;
  const mat = new THREE.MeshStandardMaterial({ color: '#b4bcc8' });

  const addBox = (
    name: string,
    w: number,
    h: number,
    d: number,
    cx: number,
    cy: number,
    cz: number,
    rotZ = 0
  ) => {
    const g = new THREE.BoxGeometry(w, h, d, 3, 6, 3);
    const m = new THREE.Mesh(g, mat);
    m.name = name;
    m.position.set(cx * scaleFactor, cy * scaleFactor, cz * scaleFactor);
    m.scale.setScalar(scaleFactor);
    m.rotation.z = rotZ;
    group.add(m);
  };

  // Feet sit at y=0, total height ~1.82m * scaleFactor
  addBox('Head', 0.24, 0.26, 0.24, 0, 1.69, 0);
  addBox('Torso', 0.36, 0.56, 0.22, 0, 1.24, 0);
  addBox('Pelvis', 0.30, 0.16, 0.20, 0, 0.90, 0);
  addBox('Leg_L', 0.14, 0.88, 0.14, 0.10, 0.44, 0);
  addBox('Leg_R', 0.14, 0.88, 0.14, -0.10, 0.44, 0);

  // Arms extending outward from shoulder (~x=+-0.19, y=1.44)
  const rad = THREE.MathUtils.degToRad(armSlopeDeg);
  const armLen = 0.56;
  const armMidOffset = 0.19 + (armLen * 0.5) * Math.cos(rad);
  const armMidY = 1.44 - (armLen * 0.5) * Math.sin(rad);
  // Left (+X): tilting downward (-rad around +Z); Right (-X): tilting downward (+rad around +Z)
  addBox('Arm_L', armLen, 0.11, 0.11, armMidOffset, armMidY, 0, -rad);
  addBox('Arm_R', armLen, 0.11, 0.11, -armMidOffset, armMidY, 0, rad);

  group.updateMatrixWorld(true);
  return group;
}

function serializeIndexedGeometryToObj(
  geo: THREE.BufferGeometry,
  groupName = 'HighPolyScan',
  mtlName = 'ScanArmor'
): string {
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  const norm = geo.getAttribute('normal');
  const idx = geo.getIndex();
  const lines: string[] = [
    'mtllib scan.mtl',
    `o ${groupName}`,
    `usemtl ${mtlName}`,
  ];
  for (let i = 0; i < pos.count; i++) {
    lines.push(
      `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}`
    );
  }
  if (uv) {
    for (let i = 0; i < uv.count; i++) {
      lines.push(`vt ${uv.getX(i).toFixed(4)} ${uv.getY(i).toFixed(4)}`);
    }
  }
  if (norm) {
    for (let i = 0; i < norm.count; i++) {
      lines.push(
        `vn ${norm.getX(i).toFixed(4)} ${norm.getY(i).toFixed(4)} ${norm.getZ(i).toFixed(4)}`
      );
    }
  }
  const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);
  for (let t = 0; t < triCount; t++) {
    const a = (idx ? idx.getX(t * 3) : t * 3) + 1;
    const b = (idx ? idx.getX(t * 3 + 1) : t * 3 + 1) + 1;
    const c = (idx ? idx.getX(t * 3 + 2) : t * 3 + 2) + 1;
    if (uv && norm) {
      lines.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`);
    } else if (uv) {
      lines.push(`f ${a}/${a} ${b}/${b} ${c}/${c}`);
    } else {
      lines.push(`f ${a} ${b} ${c}`);
    }
  }
  return lines.join('\n');
}

describe('P1 Upgrade 1: MeshSimplifier, Multi-Material OBJ Parser & ZIP Pipeline', () => {
  it('simplifies high-poly geometry >50k tris down cleanly while preserving UVs, normals, and bounds', () => {
    const hiPoly = new THREE.SphereGeometry(1.2, 180, 160);
    const idx = hiPoly.getIndex()!;
    const origTris = idx.count / 3;
    expect(origTris).toBeGreaterThan(50000);

    const simplified = simplifyGeometryForPixelArt(hiPoly, {
      targetTriangles: 14000,
      preserveUvSeams: true,
    });
    const outIdx = simplified.getIndex()!;
    const outPos = simplified.getAttribute('position');
    const outNorm = simplified.getAttribute('normal');
    const outUv = simplified.getAttribute('uv');
    const simpTris = outIdx.count / 3;

    expect(simpTris).toBeLessThan(origTris);
    expect(simpTris).toBeLessThanOrEqual(22000);
    expect(simpTris).toBeGreaterThanOrEqual(4000);
    expect(outNorm).toBeDefined();
    expect(outUv).toBeDefined();

    for (let i = 0; i < outIdx.count; i++) {
      expect(outIdx.getX(i)).toBeLessThan(outPos.count);
    }
    for (let i = 0; i < outPos.array.length; i++) {
      expect(Number.isFinite((outPos.array as Float32Array)[i])).toBe(true);
    }

    simplified.computeBoundingBox();
    const size = new THREE.Vector3();
    simplified.boundingBox!.getSize(size);
    expect(size.x).toBeGreaterThan(2.25);
    expect(size.x).toBeLessThan(2.55);

    hiPoly.dispose();
    simplified.dispose();
  });

  it('parses multi-material OBJ with vertex colors, negative indices & n-gons', () => {
    const objText = `
      g PlateMesh
      usemtl Steel
      v 0 0 0 255 128 0
      v 1 0 0 255 128 0
      v 1 1 0 255 128 0
      v 0 1 0 255 128 0
      v -0.5 0.5 0 0.2 0.4 0.8
      vt 0 0
      vt 1 0
      vt 1 1
      vt 0 1
      vt 0.2 0.5
      vn 0 0 1
      f -5/-5/-1 -4/-4/-1 -3/-3/-1 -2/-2/-1
      usemtl Cloth
      f 1/1/1 2/2/1 3/3/1 4/4/1 5/5/1
    `;
    const parsed = parseObjTextToBuckets(objText, 'MultiTest');
    expect(parsed.buckets.length).toBe(2);
    expect(parsed.totalTriangles).toBe(5); // 2 tris from quad + 3 tris from 5-gon
    expect(parsed.buckets[0].materialName).toBe('Steel');
    expect(parsed.buckets[0].colors).not.toBeNull();
    expect(parsed.buckets[0].colors![0]).toBeCloseTo(1.0, 2);
    expect(parsed.buckets[0].colors![1]).toBeCloseTo(128 / 255, 2);
    expect(parsed.buckets[1].materialName).toBe('Cloth');
    expect(parsed.buckets[1].originalTriangles).toBe(3);
  });

  it('loads high-poly OBJ+MTL+PNG from ZIP archive, auto-simplifies >45k tris, and rejects ZIP64 sentinels', async () => {
    const sphere = new THREE.SphereGeometry(0.85, 160, 150); // ~47,680 tris
    const hiObj = serializeIndexedGeometryToObj(sphere, 'ScanBust', 'ScanArmor');
    const mtlText = 'newmtl ScanArmor\nKd 0.9 0.85 0.8\nmap_Kd bust_albedo.png\n';
    const pngBytes = createFakePngHeaderBytes(64, 64);
    sphere.dispose();

    const enc = new TextEncoder();
    const zipBuf = buildStoreZipBuffer([
      { name: 'scan/bust.obj', data: enc.encode(hiObj) },
      { name: 'scan/scan.mtl', data: enc.encode(mtlText) },
      { name: 'scan/textures/bust_albedo.png', data: pngBytes },
    ]);

    const res = createSharedRes();
    const loaded = await loadModelFromZipBuffer(zipBuf, 'highpoly_scan.zip', res, {}, {
      maxTrianglesBeforeSimplify: 45000,
      targetSimplifiedTriangles: 18000,
      useWorker: false,
    });

    expect(loaded.wasSimplified).toBe(true);
    expect(loaded.originalTriangles).toBeGreaterThan(45000);
    expect(loaded.finalTriangles).toBeLessThanOrEqual(28000);
    expect(loaded.meshes.length).toBeGreaterThanOrEqual(1);
    expect(loaded.materials[0].options.albedoMap).not.toBeNull();
    expect(loaded.materials[0].options.normalMap).not.toBeNull();

    loaded.root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(loaded.root);
    expect(box.min.y).toBeGreaterThan(-0.05);
    expect(box.min.y).toBeLessThan(0.05);

    for (const m of loaded.meshes) m.geometry.dispose();
    for (const mat of loaded.materials) mat.dispose();
    res.disposeAll();

    // Verify ZIP64 EOCD sentinel rejection
    const badZip = new Uint8Array(22);
    const bv = new DataView(badZip.buffer);
    bv.setUint32(0, 0x06054b50, true);
    bv.setUint16(10, 0xffff, true);
    await expect(extractZipArchiveEntries(badZip.buffer)).rejects.toThrow(/ZIP64/i);
  }, 30000);
});

describe('P1 Upgrade 2: Static Humanoid T/A-Pose -> 65-Bone UAL Auto-Rig', () => {
  it('auto-rigs both T-Pose and A-Pose static humanoids to canonical 1.79m UAL skeleton and exports GLB', async () => {
    const res = createSharedRes();
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) {
      await bank.loadFromArrayBuffer(readFileAsArrayBuffer('public/animations/ual_master_library.glb'));
    }

    // 1. T-Pose static humanoid (oversized 2x -> normalized back to 1.79m)
    const tPoseStatic = buildStaticHumanoidGroup(0, 2.0);
    const tRigged = autoRigStaticHumanoidToUal(tPoseStatic, res, {
      targetHeightM: 1.79,
      name: 'Auto_TPose',
    });

    expect(tRigged.detectedPose).toBe('t_pose');
    expect(tRigged.rig.bones.length).toBe(65);
    expect(detectUalSkeletonCompatibility(tRigged.root).compatible).toBe(true);

    tRigged.root.updateMatrixWorld(true);
    const tBox = new THREE.Box3().setFromObject(tRigged.root);
    const tSize = new THREE.Vector3();
    tBox.getSize(tSize);
    expect(tSize.y).toBeCloseTo(1.79, 1);

    // 2. A-Pose static humanoid (38-deg arm slope downward)
    const aPoseStatic = buildStaticHumanoidGroup(38, 1.0);
    const aRigged = autoRigStaticHumanoidToUal(aPoseStatic, res, {
      targetHeightM: 1.79,
      name: 'Auto_APose',
    });

    expect(aRigged.detectedPose).toBe('a_pose');
    expect(aRigged.armAngleDeg).toBeGreaterThanOrEqual(20);
    expect(aRigged.skinnedMeshes.length).toBeGreaterThanOrEqual(7);
    expect(detectUalSkeletonCompatibility(aRigged.root).compatible).toBe(true);

    // Verify straightened rest arm Y coordinates sit noticeably above dropped A-pose tip height (~1.26 vs ~1.44 canonical)
    const armMesh = aRigged.skinnedMeshes.find((m) => m.name.startsWith('Arm_L'))!;
    expect(armMesh).toBeDefined();
    const armPos = armMesh.geometry.getAttribute('position');
    let avgArmY = 0;
    for (let i = 0; i < armPos.count; i++) avgArmY += armPos.getY(i);
    avgArmY /= Math.max(1, armPos.count);
    // In canonical 1.829m space before finalScale, shoulder is ~1.44m (vs ~1.26m A-pose midpoint)
    expect(avgArmY).toBeGreaterThan(1.36);

    // Verify UAL animation deforms SkinnedMesh boneTransform matrices cleanly
    const idleClip = bank.getClip('Sword_Regular_A')!.clone();
    const mixer = new THREE.AnimationMixer(aRigged.root);
    mixer.clipAction(idleClip).play();
    mixer.update(0.35);
    aRigged.root.updateMatrixWorld(true);
    const handWorldPos = new THREE.Vector3();
    aRigged.rig.boneByName.get('hand_r')!.getWorldPosition(handWorldPos);
    expect(Number.isFinite(handWorldPos.y)).toBe(true);

    // Export auto-rigged A-Pose model to valid binary glTF GLB
    const glb = await exportRiggedAssetToGlb(aRigged.root, [idleClip], {
      name: 'autorig_apose_test',
    });
    expect(glb.buffer.byteLength).toBeGreaterThan(2048);
    expect(new DataView(glb.buffer).getUint32(0, true)).toBe(0x46546c67);
    expect(glb.validation.boneCount).toBe(65);
    expect(glb.validation.skinnedMeshCount).toBeGreaterThanOrEqual(7);

    tPoseStatic.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    aPoseStatic.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    tRigged.dispose();
    aRigged.dispose();
    res.disposeAll();
  }, 25000);
});

describe('P1 Upgrade 3: HDR Emissive Bloom Shaders & Pipeline Presets', () => {
  it('encodes HDR emission inside gColor.a only when enabled and restores binary outline alpha', () => {
    expect(OBJECT_FRAGMENT_SHADER).toContain('uniform float uEncodeBloomAlpha;');
    expect(OBJECT_FRAGMENT_SHADER).toContain('0.5 + 0.5 * clamp(emitBoost / 1.5, 0.0, 1.0)');
    expect(BLOOM_EXTRACT_FRAGMENT_SHADER).toContain('uniform float uBloomThreshold;');
    expect(BLOOM_BLUR_FRAGMENT_SHADER).toContain('uniform vec2 uTexelStep;');
    expect(UPSCALE_FRAGMENT_SHADER).toContain('uniform sampler2D tBloom;');
    expect(UPSCALE_FRAGMENT_SHADER).toContain('uniform float uBloomEnabled;');
    expect(UPSCALE_FRAGMENT_SHADER).toContain('uniform float uBloomIntensity;');
    expect(OUTLINE_EDGE_FRAGMENT_SHADER).toContain('(cColor.a > 0.25) ? 1.0 : 0.0');

    const res = createSharedRes();
    const mat = new PixelizerMaterial({
      pixelSize: 2,
      emissionColor: '#249fde',
      emissionIntensity: 1.1,
    }, res);
    expect(mat.uniforms.uEncodeBloomAlpha.value).toBe(0.0);
    mat.dispose();
    res.disposeAll();
  });

  it('toggles bloom configuration across nwl_snes and hades_lab visual presets', () => {
    const fakeGl = {
      getExtension: () => null,
    };
    const mockRenderer = {
      getContext: () => fakeGl,
      setSize: () => {},
      outputColorSpace: '',
      toneMapping: 0,
    } as unknown as THREE.WebGLRenderer;

    const pipeline = new PixelizerPipeline(mockRenderer);
    expect(pipeline.pipelineConfig.bloomEnabled).toBe(true);
    expect(pipeline.pipelineConfig.bloomThreshold).toBeGreaterThanOrEqual(0.85);

    pipeline.applyVisualStylePreset('hades_lab');
    expect(pipeline.pipelineConfig.bloomEnabled).toBe(true);
    expect(pipeline.pipelineConfig.bloomThreshold).toBeCloseTo(0.35, 3);
    expect(pipeline.pipelineConfig.bloomIntensity).toBeCloseTo(0.55, 3);

    pipeline.applyVisualStylePreset('nwl_snes');
    expect(pipeline.pipelineConfig.bloomEnabled).toBe(false);
    expect(pipeline.pipelineConfig.bloomThreshold).toBeCloseTo(0.38, 3);

    pipeline.dispose();
  });
});

interface MockElement {
  tagName: string;
  id: string;
  className: string;
  innerHTML: string;
  textContent: string;
  children: MockElement[];
  dataset: Record<string, string>;
  value: string;
  selectedOptions: { text: string }[];
  listeners: Map<string, ((ev?: unknown) => void)[]>;
  style: {
    display: string;
    left: string;
    top: string;
    opacity: string;
    props: Record<string, string>;
    setProperty: (k: string, v: string) => void;
    removeProperty: (k: string) => void;
  };
  classList: {
    set: Set<string>;
    toggle: (cls: string, force?: boolean) => void;
    contains: (cls: string) => boolean;
  };
  ownerDocument: MockDocument;
  appendChild: (c: MockElement) => MockElement;
  remove: () => void;
  addEventListener: (ev: string, fn: (e?: unknown) => void) => void;
  click: () => void;
  querySelector: <T = MockElement>(sel: string) => T | null;
  querySelectorAll: <T = MockElement>(sel: string) => T[];
}

interface MockDocument {
  createElement: (tag: string) => MockElement;
}

function createMockStageContainer(): HTMLElement {
  const createEl = (tag: string, ownerDoc: MockDocument): MockElement => {
    const clsSet = new Set<string>();
    const el: MockElement = {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      innerHTML: '',
      textContent: '',
      children: [],
      dataset: {},
      value: 'knight',
      selectedOptions: [{ text: 'Cavaleiro' }],
      listeners: new Map(),
      style: {
        display: '',
        left: '',
        top: '',
        opacity: '',
        props: {},
        setProperty(k, v) {
          this.props[k] = v;
        },
        removeProperty(k) {
          delete this.props[k];
        },
      },
      classList: {
        set: clsSet,
        toggle(cls, force) {
          if (force === true || (force === undefined && !clsSet.has(cls))) clsSet.add(cls);
          else clsSet.delete(cls);
        },
        contains(cls) {
          return clsSet.has(cls);
        },
      },
      ownerDocument: ownerDoc,
      appendChild(c) {
        this.children.push(c);
        return c;
      },
      remove() {
        // Detach cleanly
      },
      addEventListener(ev, fn) {
        const list = this.listeners.get(ev) ?? [];
        list.push(fn);
        this.listeners.set(ev, list);
      },
      click() {
        for (const fn of this.listeners.get('click') ?? []) fn({});
      },
      querySelector<T = MockElement>(sel: string): T | null {
        return this.querySelectorAll<T>(sel)[0] ?? null;
      },
      querySelectorAll<T = MockElement>(_sel: string): T[] {
        return [];
      },
    };
    return el;
  };

  const enhanceEl = (el: MockElement, ownerDoc: MockDocument): MockElement => {
    const cache = new Map<string, MockElement>();
    const spellBtns: MockElement[] = [];

    const ensureId = (id: string) => {
      if (!cache.has(id)) {
        const c = enhanceEl(
          createEl(id.includes('sel') ? 'select' : id.includes('btn') ? 'button' : 'div', ownerDoc),
          ownerDoc
        );
        c.id = id;
        cache.set(id, c);
      }
      return cache.get(id)!;
    };

    Object.defineProperty(el, 'innerHTML', {
      get: () => '',
      set: (html: string) => {
        if (html.includes('sb-spell-btn')) {
          spellBtns.length = 0;
          const matches = html.matchAll(/data-sp="(\d+)"/g);
          for (const m of matches) {
            const btn = createEl('button', ownerDoc);
            btn.className = 'sb-spell-btn';
            btn.dataset.sp = m[1];
            const tagSpan = createEl('span', ownerDoc);
            btn.querySelector = <T = MockElement>(s: string) =>
              s === '.sb-cd-tag' ? (tagSpan as unknown as T) : null;
            spellBtns.push(btn);
          }
        }
      },
    });

    el.querySelector = <T = MockElement>(sel: string): T | null => {
      if (sel.startsWith('#')) return ensureId(sel.slice(1)) as unknown as T;
      if (sel === '.sb-spell-btn') return (el.querySelectorAll<MockElement>(sel)[0] ?? null) as unknown as T;
      return null;
    };
    el.querySelectorAll = <T = MockElement>(sel: string): T[] => {
      if (sel === '.sb-spell-btn') {
        const collected: MockElement[] = [...spellBtns];
        for (const child of [...el.children, ...cache.values()]) {
          for (const sub of child.querySelectorAll<MockElement>(sel)) {
            if (!collected.includes(sub)) collected.push(sub);
          }
        }
        return collected as unknown as T[];
      }
      return [];
    };
    return el;
  };

  const doc: MockDocument = {
    createElement(tag) {
      return enhanceEl(createEl(tag, doc), doc);
    },
  };

  return enhanceEl(createEl('div', doc), doc) as unknown as HTMLElement;
}

describe('P1 Upgrade 4: NWL Play Sandbox Combat Juice (Cooldowns, Shake Decay, Hit-Stop & Cleanup)', () => {
  it('activates spell cooldown overlays, applies damped camera shake + hit-stop on hits, and disposes cleanly', () => {
    const res = createSharedRes();
    const fakePipeline = {
      getSharedResourcesForMaterial: () => ({
        lightingRampTex: res.lightingRampTex,
        palettePrimaryTex: res.palettePrimaryTex,
        paletteSecondaryTex: res.paletteSecondaryTex,
        paletteLutSize: res.paletteLutSize,
        ditherTex: res.ditherTex,
        ditherSize: res.ditherSize,
      }),
    } as unknown as PixelizerPipeline;

    const stage = createMockStageContainer();
    const sandbox = createNwlPlaySandbox(stage, fakePipeline, {
      onExitSandbox: () => {},
      projectWorldToScreen: () => ({ x: 400, y: 300, visible: true }),
    });

    sandbox.enterZone('dungeon', 202);
    expect(sandbox.getState().zone).toBe('dungeon');

    // Trigger spell slot 0 ('Investida') via rendered spell button click
    const spellBtn0 = sandbox.hudElement.querySelectorAll('.sb-spell-btn')[0] as unknown as MockElement;
    expect(spellBtn0).toBeDefined();
    spellBtn0.click();

    const afterSpell = sandbox.getCombatJuiceState();
    expect(afterSpell.spellCooldowns[0]).toBeGreaterThan(2.0);
    expect(afterSpell.shakeIntensity).toBeGreaterThan(0.05);
    expect(spellBtn0.classList.contains('is-on-cooldown')).toBe(true);

    // Step update() across frames and verify shake vector peaks then cleanly decays to zero
    sandbox.update(0.016);
    const peakShake = sandbox.getCameraShakeOffset().length();
    expect(peakShake).toBeGreaterThan(0);

    for (let i = 0; i < 45; i++) {
      sandbox.update(0.02);
    }
    const decayed = sandbox.getCombatJuiceState();
    expect(decayed.shakeIntensity).toBeLessThan(0.01);
    expect(sandbox.getCameraShakeOffset().length()).toBeLessThan(0.01);
    expect(decayed.spellCooldowns[0]).toBeLessThan(afterSpell.spellCooldowns[0]);

    sandbox.dispose();
    const disposedState = sandbox.getCombatJuiceState();
    expect(disposedState.activeFloatingCount).toBe(0);
    expect(disposedState.shakeIntensity).toBe(0);
    res.disposeAll();
  }, 30000);
});
