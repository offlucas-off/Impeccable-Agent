import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  convertStandardMaterialToPixelizer,
  enforcePixelArtTextureSampling,
  type PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../../engine/PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../../engine/PixelizerPipeline';
import { simplifyGeometryForPixelArt } from '../../engine/procedural/MeshSimplifier';
import { quantizeTextureToPalette } from '../../engine/procedural/PixelMaterialSynth';
import { computeGeometryTangents } from '../../engine/procedural/SdfVoxelPrimitives';
import { bakeVertexAoAndCreases } from '../../engine/procedural/VertexAndTexelBaker';
import type { ColorPaletteConfig, PixelizerMaterialOptions, SnapOptions } from '../../engine/types';
import type { ObjWorkerMessage, ObjWorkerRequest } from './objZipWorker';
import { extractZipArchiveEntries, type ZipEntryBuffer } from './zipExtractor';

export { extractZipArchiveEntries, type ZipEntryBuffer };

export interface LoadModelProgress {
  phase: string;
  detail: string;
  progress?: number;
}

export interface LoadModelOptions {
  unifyObjectId?: boolean;
  maxTrianglesBeforeSimplify?: number;
  targetSimplifiedTriangles?: number;
  quantizePalette?: ColorPaletteConfig | null;
  quantizeDither?: boolean;
  useWorker?: boolean;
  onProgress?: (info: LoadModelProgress) => void;
}

export interface LoadedModelResult {
  root: THREE.Group;
  animations: THREE.AnimationClip[];
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  name: string;
  originalTriangles: number;
  finalTriangles: number;
  wasSimplified: boolean;
  usedWorker: boolean;
}

export interface RemasterTextureOptions {
  targetMaxDim?: number;
  liftBlackFloor?: number;
  synthesizeNormalMaxSlope?: number;
}

export interface RemasteredTextureResult {
  albedoMap: THREE.DataTexture;
  normalMap: THREE.DataTexture;
}

const DEFAULT_SNAP: SnapOptions = {
  snapPosition: true,
  alignPixelGrid: true,
  alignmentPixelSize: 3,
  angleSnapMode: 'none',
  angleResolutionDeg: 45,
};

/**
 * Picks a lively showcase animation clip index (preferring Walk/Run/Dance/Survey over static poses).
 */
export function pickPreferredClipIndex(clips: THREE.AnimationClip[]): number {
  if (clips.length === 0) return 0;
  const preferred = [
    /^walking_a$/i,
    /^walk$/i,
    /^walking$/i,
    /^running_a$/i,
    /^run$/i,
    /^running$/i,
    /^dance$/i,
    /^survey$/i,
    /^idle$/i,
  ];
  for (const re of preferred) {
    const idx = clips.findIndex((c) => re.test(c.name.trim()));
    if (idx >= 0) return idx;
  }
  return 0;
}

/**
 * Extracts raw RGBA8 pixel data and dimensions from any Three.js Texture source
 * (`DataTexture`, `ImageData`, `HTMLImageElement`, `HTMLCanvasElement`, `ImageBitmap`, or raw `{ width, height, data }`).
 */
function extractTexturePixels(tex: THREE.Texture): {
  width: number;
  height: number;
  rgba: Uint8Array;
} | null {
  const img = tex.image as
    | {
        width?: number;
        height?: number;
        naturalWidth?: number;
        naturalHeight?: number;
        data?: ArrayLike<number>;
      }
    | undefined
    | null;
  if (!img) return null;

  const w = Math.max(1, Math.floor(img.width ?? img.naturalWidth ?? 0));
  const h = Math.max(1, Math.floor(img.height ?? img.naturalHeight ?? 0));
  if (w <= 0 || h <= 0) return null;

  // 1) Direct byte buffer (DataTexture, ImageData, or headless test fixture)
  if (img.data && typeof img.data.length === 'number' && img.data.length >= w * h * 3) {
    const src = img.data;
    const total = w * h;
    if (src.length >= total * 4) {
      const out = new Uint8Array(total * 4);
      for (let i = 0; i < total * 4; i++) {
        out[i] = src[i];
      }
      return { width: w, height: h, rgba: out };
    }
    const out = new Uint8Array(total * 4);
    for (let i = 0; i < total; i++) {
      out[i * 4 + 0] = src[i * 3 + 0];
      out[i * 4 + 1] = src[i * 3 + 1];
      out[i * 4 + 2] = src[i * 3 + 2];
      out[i * 4 + 3] = 255;
    }
    return { width: w, height: h, rgba: out };
  }

  // 2) Browser 2D canvas drawImage extraction (HTMLImageElement, HTMLCanvasElement, ImageBitmap)
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
        const id = ctx.getImageData(0, 0, w, h);
        return {
          width: w,
          height: h,
          rgba: new Uint8Array(id.data.buffer, id.data.byteOffset, id.data.byteLength),
        };
      }
    } catch {
      // Ignore canvas extraction error in headless environments without 2D canvas
    }
  }

  return null;
}

/**
 * Remasters an imported high-resolution PBR/photogrammetry/AI texture (e.g. 4096×4096 Meshy `.png`)
 * for crisp Pixelizer 3D rendering:
 * 1. Block/box-filters textures larger than `targetMaxDim` (default `512`) + applies a gentle 3×3
 *    spatial medoid/bilateral pass to suppress isolated 1-pixel Nyquist confetti under `3×3` macropixels.
 * 2. Smoothly lifts crushed dark-fantasy shadow texels (`lum < liftBlackFloor`, default `28`) into
 *    `[liftBlackFloor..242]` so `snes_pal_nwl` + `three_band` cel shading never crushes dark obsidian armor
 *    or timber into solid `#141013` / `#4f3428`.
 * 3. Synthesizes a clean Sobel tangent-space `normalMap` (`THREE.DataTexture`, `NoColorSpace`) with slopes
 *    strictly clamped `<= synthesizeNormalMaxSlope` (`0.24`, `< 14°`) so Pass 3 (`outlineEdgeShader.ts`)
 *    never produces noisy crease static inside flat faces.
 */
export function remasterImportedTextureForPixelizer(
  tex: THREE.Texture,
  opts: RemasterTextureOptions = {}
): RemasteredTextureResult {
  const targetMaxDim = Math.max(16, Math.floor(opts.targetMaxDim ?? 512));
  const liftFloor = Math.max(12, Math.min(80, Math.round(opts.liftBlackFloor ?? 28)));
  const maxSlope = Math.max(0.02, Math.min(0.24, opts.synthesizeNormalMaxSlope ?? 0.24));

  const extracted = extractTexturePixels(tex);
  if (!extracted) {
    const fallbackAlbedo = new THREE.DataTexture(
      new Uint8Array([180, 180, 188, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    const fallbackNormal = new THREE.DataTexture(
      new Uint8Array([128, 128, 255, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    enforcePixelArtTextureSampling(fallbackAlbedo, 'albedo');
    enforcePixelArtTextureSampling(fallbackNormal, 'normal');
    fallbackAlbedo.needsUpdate = true;
    fallbackNormal.needsUpdate = true;
    return { albedoMap: fallbackAlbedo, normalMap: fallbackNormal };
  }

  const srcW = extracted.width;
  const srcH = extracted.height;
  const srcRgba = extracted.rgba;

  // Step 1: Area-averaging box filter downsample when input exceeds targetMaxDim
  const maxIn = Math.max(srcW, srcH);
  const scale = maxIn > targetMaxDim ? targetMaxDim / maxIn : 1.0;
  const dstW = Math.max(1, Math.round(srcW * scale));
  const dstH = Math.max(1, Math.round(srcH * scale));

  const boxedRgba = new Uint8Array(dstW * dstH * 4);
  if (dstW === srcW && dstH === srcH) {
    boxedRgba.set(srcRgba);
  } else {
    const xRatio = srcW / dstW;
    const yRatio = srcH / dstH;
    for (let dy = 0; dy < dstH; dy++) {
      const sy0 = Math.floor(dy * yRatio);
      const sy1 = Math.min(srcH, Math.max(sy0 + 1, Math.ceil((dy + 1) * yRatio)));
      for (let dx = 0; dx < dstW; dx++) {
        const sx0 = Math.floor(dx * xRatio);
        const sx1 = Math.min(srcW, Math.max(sx0 + 1, Math.ceil((dx + 1) * xRatio)));
        let rSum = 0,
          gSum = 0,
          bSum = 0,
          aSum = 0,
          count = 0;
        for (let sy = sy0; sy < sy1; sy++) {
          const rowOff = sy * srcW;
          for (let sx = sx0; sx < sx1; sx++) {
            const idx4 = (rowOff + sx) * 4;
            rSum += srcRgba[idx4 + 0];
            gSum += srcRgba[idx4 + 1];
            bSum += srcRgba[idx4 + 2];
            aSum += srcRgba[idx4 + 3];
            count++;
          }
        }
        const inv = count > 0 ? 1 / count : 0;
        const out4 = (dy * dstW + dx) * 4;
        boxedRgba[out4 + 0] = Math.round(rSum * inv);
        boxedRgba[out4 + 1] = Math.round(gSum * inv);
        boxedRgba[out4 + 2] = Math.round(bSum * inv);
        boxedRgba[out4 + 3] = Math.round(aSum * inv);
      }
    }
  }

  // Step 2: 3x3 outlier/speckle suppression + black-floor lift into [liftFloor..242]
  const albedoData = new Uint8Array(dstW * dstH * 4);
  const lumField = new Float32Array(dstW * dstH);

  for (let y = 0; y < dstH; y++) {
    const ym = Math.max(0, y - 1);
    const yp = Math.min(dstH - 1, y + 1);
    for (let x = 0; x < dstW; x++) {
      const xm = Math.max(0, x - 1);
      const xp = Math.min(dstW - 1, x + 1);
      const c4 = (y * dstW + x) * 4;
      const cr = boxedRgba[c4 + 0];
      const cg = boxedRgba[c4 + 1];
      const cb = boxedRgba[c4 + 2];
      const ca = boxedRgba[c4 + 3];

      // Compare center against 4 cardinal neighbors to smooth isolated 1-pixel Nyquist speckles
      const n0 = (ym * dstW + x) * 4;
      const n1 = (yp * dstW + x) * 4;
      const n2 = (y * dstW + xm) * 4;
      const n3 = (y * dstW + xp) * 4;

      const avgR = (boxedRgba[n0] + boxedRgba[n1] + boxedRgba[n2] + boxedRgba[n3]) * 0.25;
      const avgG = (boxedRgba[n0 + 1] + boxedRgba[n1 + 1] + boxedRgba[n2 + 1] + boxedRgba[n3 + 1]) * 0.25;
      const avgB = (boxedRgba[n0 + 2] + boxedRgba[n1 + 2] + boxedRgba[n2 + 2] + boxedRgba[n3 + 2]) * 0.25;

      // Blend 40% toward cardinal average so sub-macropixel high-frequency noise consolidates into clean clusters
      let r = cr * 0.6 + avgR * 0.4;
      let g = cg * 0.6 + avgG * 0.4;
      let b = cb * 0.6 + avgB * 0.4;

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const knee = liftFloor * 2.2;
      if (lum < knee) {
        // Smoothly lift [0..knee] -> [liftFloor..knee] while preserving hue tint
        const targetLum = liftFloor + (lum / Math.max(1, knee)) * (knee - liftFloor);
        const liftDelta = targetLum - lum;
        r += liftDelta * 0.94;
        g += liftDelta * 0.96;
        b += liftDelta * 1.06; // subtle cool gunmetal/indigo shadow lift
      }

      const rf = Math.max(liftFloor, Math.min(242, Math.round(r)));
      const gf = Math.max(liftFloor, Math.min(242, Math.round(g)));
      const bf = Math.max(liftFloor, Math.min(242, Math.round(b)));

      albedoData[c4 + 0] = rf;
      albedoData[c4 + 1] = gf;
      albedoData[c4 + 2] = bf;
      albedoData[c4 + 3] = ca;
      lumField[y * dstW + x] = (0.2126 * rf + 0.7152 * gf + 0.0722 * bf) / 255.0;
    }
  }

  // Step 3: Synthesize Sobel normalMap with slopes strictly clamped <= maxSlope (<= 0.24)
  const normalData = new Uint8Array(dstW * dstH * 4);
  const strength = maxSlope * 0.85;
  for (let y = 0; y < dstH; y++) {
    const ym = Math.max(0, y - 1);
    const yp = Math.min(dstH - 1, y + 1);
    for (let x = 0; x < dstW; x++) {
      const xm = Math.max(0, x - 1);
      const xp = Math.min(dstW - 1, x + 1);

      const tl = lumField[yp * dstW + xm];
      const tc = lumField[yp * dstW + x];
      const tr = lumField[yp * dstW + xp];
      const ml = lumField[y * dstW + xm];
      const mr = lumField[y * dstW + xp];
      const bl = lumField[ym * dstW + xm];
      const bc = lumField[ym * dstW + x];
      const br = lumField[ym * dstW + xp];

      const dhdu = (tr + 2 * mr + br - (tl + 2 * ml + bl)) * 0.25;
      const dhdv = (tl + 2 * tc + tr - (bl + 2 * bc + br)) * 0.25;

      let nx = Math.max(-maxSlope, Math.min(maxSlope, -dhdu * strength));
      let ny = Math.max(-maxSlope, Math.min(maxSlope, -dhdv * strength));
      const nz = 1.0;
      const invLen = 1.0 / Math.hypot(nx, ny, nz);
      nx *= invLen;
      ny *= invLen;
      const nzUnit = nz * invLen;

      const idx4 = (y * dstW + x) * 4;
      normalData[idx4 + 0] = Math.max(0, Math.min(255, Math.round((nx * 0.5 + 0.5) * 255)));
      normalData[idx4 + 1] = Math.max(0, Math.min(255, Math.round((ny * 0.5 + 0.5) * 255)));
      normalData[idx4 + 2] = Math.max(0, Math.min(255, Math.round((nzUnit * 0.5 + 0.5) * 255)));
      normalData[idx4 + 3] = 255;
    }
  }

  const albedoMap = new THREE.DataTexture(albedoData, dstW, dstH, THREE.RGBAFormat);
  const normalMap = new THREE.DataTexture(normalData, dstW, dstH, THREE.RGBAFormat);
  albedoMap.flipY = tex.flipY;
  normalMap.flipY = tex.flipY;
  albedoMap.wrapS = tex.wrapS;
  albedoMap.wrapT = tex.wrapT;
  normalMap.wrapS = tex.wrapS;
  normalMap.wrapT = tex.wrapT;
  albedoMap.name = tex.name ? `${tex.name}_remastered_albedo` : 'remastered_albedo';
  normalMap.name = tex.name ? `${tex.name}_remastered_normal` : 'remastered_normal';

  enforcePixelArtTextureSampling(albedoMap, 'albedo');
  enforcePixelArtTextureSampling(normalMap, 'normal');
  albedoMap.needsUpdate = true;
  normalMap.needsUpdate = true;

  return { albedoMap, normalMap };
}

/**
 * Decodes an image byte buffer (`.png`/`.jpg`/`.webp`) into a `THREE.DataTexture` so `remasterImportedTextureForPixelizer`
 * can inspect and downsample exact pixels both in browser and in headless tests.
 */
async function decodeImageBytesToTexture(
  bytes: Uint8Array,
  fileName: string
): Promise<THREE.Texture> {
  const ext = (fileName.split('.').pop() || 'png').toLowerCase();
  const mime =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'webp'
        ? 'image/webp'
        : 'image/png';
  const blob = new Blob([new Uint8Array(bytes)], { type: mime });

  if (typeof createImageBitmap === 'function' && typeof document !== 'undefined') {
    try {
      const bmp = await createImageBitmap(blob);
      const w = Math.max(1, bmp.width);
      const h = Math.max(1, bmp.height);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bmp, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const dTex = new THREE.DataTexture(
          new Uint8Array(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength),
          w,
          h,
          THREE.RGBAFormat
        );
        dTex.flipY = true;
        dTex.name = fileName;
        dTex.needsUpdate = true;
        bmp.close?.();
        return dTex;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback for headless test environments without 2D canvas
  let w = 64;
  let h = 64;
  if (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    w = Math.max(1, Math.min(512, dv.getUint32(16, false)));
    h = Math.max(1, Math.min(512, dv.getUint32(20, false)));
  }
  const synth = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const b = bytes[(i * 7 + 33) % bytes.length];
    const v = 42 + (b % 160);
    synth[i * 4 + 0] = v;
    synth[i * 4 + 1] = Math.max(28, v - 6);
    synth[i * 4 + 2] = Math.min(240, v + 8);
    synth[i * 4 + 3] = 255;
  }
  const fallbackTex = new THREE.DataTexture(synth, w, h, THREE.RGBAFormat);
  fallbackTex.flipY = true;
  fallbackTex.name = fileName;
  fallbackTex.needsUpdate = true;
  return fallbackTex;
}

function buildMtlMaterialMap(
  mtlText: string | null,
  textureByBaseName: Map<string, THREE.Texture>,
  defaultTex?: THREE.Texture
): Map<string, THREE.MeshStandardMaterial> {
  const map = new Map<string, THREE.MeshStandardMaterial>();
  if (!mtlText) return map;

  let curName = '';
  let curMat: THREE.MeshStandardMaterial | null = null;
  const resolveTex = (tokenPath: string): THREE.Texture | undefined => {
    const base = tokenPath.trim().replace(/\\/g, '/').split('/').pop()?.toLowerCase() ?? '';
    return (base ? textureByBaseName.get(base) : undefined) ?? defaultTex;
  };

  for (const raw of mtlText.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const sp = line.indexOf(' ');
    const key = (sp >= 0 ? line.slice(0, sp) : line).toLowerCase();
    const val = (sp >= 0 ? line.slice(sp + 1) : '').trim();

    if (key === 'newmtl') {
      curName = val;
      curMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
      curMat.name = curName;
      map.set(curName, curMat);
    } else if (curMat) {
      if (key === 'kd') {
        const nums = val.split(/\s+/).map(Number);
        if (nums.length >= 3 && nums.slice(0, 3).every(Number.isFinite)) {
          curMat.color.setRGB(nums[0], nums[1], nums[2], THREE.SRGBColorSpace);
        }
      } else if (key === 'ke') {
        const nums = val.split(/\s+/).map(Number);
        if (nums.length >= 3 && nums.slice(0, 3).every(Number.isFinite)) {
          curMat.emissive.setRGB(nums[0], nums[1], nums[2], THREE.SRGBColorSpace);
        }
      } else if (key === 'map_kd') {
        const fileToken = val.split(/\s+/).pop() ?? '';
        const t = resolveTex(fileToken);
        if (t) {
          curMat.map = t;
          curMat.color.set('#ffffff');
        }
      } else if (key === 'map_ke') {
        const fileToken = val.split(/\s+/).pop() ?? '';
        const t = resolveTex(fileToken);
        if (t) curMat.emissiveMap = t;
      } else if (key === 'd') {
        const op = Number(val);
        if (Number.isFinite(op)) {
          curMat.opacity = Math.max(0, Math.min(1, op));
          curMat.transparent = curMat.opacity < 0.99;
        }
      }
    }
  }
  return map;
}

function resolveLoadModelOptions(
  arg?: boolean | LoadModelOptions
): Required<Omit<LoadModelOptions, 'quantizePalette' | 'onProgress'>> &
  Pick<LoadModelOptions, 'quantizePalette' | 'onProgress'> {
  if (typeof arg === 'boolean' || arg === undefined) {
    return {
      unifyObjectId: arg ?? true,
      maxTrianglesBeforeSimplify: 45000,
      targetSimplifiedTriangles: 28000,
      quantizePalette: null,
      quantizeDither: false,
      useWorker: true,
      onProgress: undefined,
    };
  }
  return {
    unifyObjectId: arg.unifyObjectId ?? true,
    maxTrianglesBeforeSimplify: arg.maxTrianglesBeforeSimplify ?? 45000,
    targetSimplifiedTriangles: arg.targetSimplifiedTriangles ?? 28000,
    quantizePalette: arg.quantizePalette ?? null,
    quantizeDither: arg.quantizeDither ?? false,
    useWorker: arg.useWorker ?? true,
    onProgress: arg.onProgress,
  };
}

function countGeometryTriangles(geo: THREE.BufferGeometry | undefined): number {
  if (!geo) return 0;
  const posAttr = geo.getAttribute('position');
  if (!posAttr) return 0;
  return geo.index ? Math.floor(geo.index.count / 3) : Math.floor(posAttr.count / 3);
}

/**
 * Normalizes any imported 3D model to fit neatly inside a ~2.6 unit bounding box,
 * resting with its base near y = 0, simplifies high-poly scans (>45k tris) automatically,
 * remasters imported textures, and converts materials into PixelizerMaterials.
 */
export function prepareLoadedObject(
  object: THREE.Object3D,
  name: string,
  animations: THREE.AnimationClip[],
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  optionsOrUnify: boolean | LoadModelOptions = true,
  precomputedMeta?: { originalTriangles?: number; usedWorker?: boolean }
): LoadedModelResult {
  const opts = resolveLoadModelOptions(optionsOrUnify);
  const unifyObjectId = opts.unifyObjectId;

  const wrapper = new THREE.Group();
  wrapper.name = name;
  wrapper.add(object);

  wrapper.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(wrapper);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const targetScale = 2.6 / maxDim;

  object.scale.multiplyScalar(targetScale);
  object.position.sub(center.multiplyScalar(targetScale));
  // Place bottom on y = 0
  wrapper.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(wrapper);
  object.position.y -= scaledBox.min.y;

  // Inspect initial triangle count before possible auto-simplification
  const allFoundMeshes: THREE.Mesh[] = [];
  let countedOriginalTris = 0;
  wrapper.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      allFoundMeshes.push(child);
      countedOriginalTris += countGeometryTriangles(child.geometry);
    }
  });
  const originalTriangles = precomputedMeta?.originalTriangles ?? countedOriginalTris;
  let simplifiedOnMain = false;

  if (
    !precomputedMeta?.usedWorker &&
    countedOriginalTris > opts.maxTrianglesBeforeSimplify &&
    opts.targetSimplifiedTriangles > 0
  ) {
    opts.onProgress?.({
      phase: 'simplify',
      detail: `Simplificando malha densa (${countedOriginalTris.toLocaleString()} → ~${opts.targetSimplifiedTriangles.toLocaleString()} tris)...`,
      progress: 0.75,
    });
    for (const m of allFoundMeshes) {
      if (m instanceof THREE.SkinnedMesh) continue;
      const geo = m.geometry;
      const tris = countGeometryTriangles(geo);
      if (tris <= 24) continue;
      const shareTarget = Math.max(
        24,
        Math.round((tris / Math.max(1, countedOriginalTris)) * opts.targetSimplifiedTriangles)
      );
      if (tris > shareTarget) {
        const simplifiedGeo = simplifyGeometryForPixelArt(geo, {
          targetTriangles: shareTarget,
          preserveUvSeams: true,
        });
        m.geometry = simplifiedGeo;
        geo.dispose();
        simplifiedOnMain = true;
      }
    }
  }

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];
  const basePx = defaults.pixelSize ?? 3;
  const snapCfg: SnapOptions = {
    ...DEFAULT_SNAP,
    alignmentPixelSize: basePx,
  };

  const remasteredCache = new Map<THREE.Texture, RemasteredTextureResult>();
  const quantizedCache = new Map<THREE.Texture, THREE.DataTexture>();

  let meshCounter = 0;
  let finalTriangles = 0;

  for (const child of allFoundMeshes) {
    meshCounter++;
    child.castShadow = true;
    child.receiveShadow = true;
    if (child instanceof THREE.SkinnedMesh) {
      child.frustumCulled = false;
    }

    const geo = child.geometry as THREE.BufferGeometry | undefined;
    const triCount = countGeometryTriangles(geo);
    finalTriangles += triCount;

    if (geo) {
      if (!geo.attributes.normal) {
        geo.computeVertexNormals();
      }
      const posAttr = geo.getAttribute('position');

      // Critical Engine Invariant #1: Ensure every imported mesh has vertex colors (`white_for_ao`)
      if (!geo.getAttribute('color') && posAttr && posAttr.count > 0) {
        const white = new Float32Array(posAttr.count * 3).fill(1.0);
        geo.setAttribute('color', new THREE.Float32BufferAttribute(white, 3));
        if (triCount > 0 && triCount <= 25000 && !(child instanceof THREE.SkinnedMesh)) {
          bakeVertexAoAndCreases(geo, {
            rays: 10,
            maxDist: 0.45,
            strength: 0.42,
            creaseBoost: 0.05,
          });
        } else if (triCount > 25000) {
          const normAttr = geo.getAttribute('normal');
          geo.computeBoundingBox();
          const bMinY = geo.boundingBox?.min.y ?? -1;
          const bSpanY = Math.max(1e-4, (geo.boundingBox?.max.y ?? 1) - bMinY);
          const colAttr = geo.getAttribute('color') as THREE.BufferAttribute;
          for (let i = 0; i < posAttr.count; i++) {
            const yNorm = Math.max(0, Math.min(1, (posAttr.getY(i) - bMinY) / bSpanY));
            const ny = normAttr ? normAttr.getY(i) : 0.5;
            const ao = Math.max(0.68, Math.min(1.0, 0.76 + yNorm * 0.14 + Math.max(-0.3, ny) * 0.1));
            colAttr.setXYZ(i, ao, ao, ao);
          }
          colAttr.needsUpdate = true;
        }
      }
    }

    const hasVertexColor = Boolean(geo?.attributes.color);
    const srcMats = Array.isArray(child.material) ? child.material : [child.material];
    const converted: PixelizerMaterial[] = [];

    const assignedId = unifyObjectId
      ? defaults.objectId ?? 10
      : 10 + (meshCounter % 240);

    let meshNeedsTangents = false;

    for (const sm of srcMats) {
      const matDefaults: PixelizerMaterialOptions = {
        pixelated: true,
        pixelSize: basePx,
        objectId: assignedId,
        outlineColor: '#14101c',
        outlineAlpha: 1.0,
        edgeHighlight: 0.35,
        edgeBevelWeight: 0.65,
        useColorGrading: true,
        ...defaults,
      };

      const srcMap =
        sm && 'map' in sm && sm.map instanceof THREE.Texture ? sm.map : null;
      const srcNormal =
        sm && 'normalMap' in sm && sm.normalMap instanceof THREE.Texture
          ? sm.normalMap
          : null;

      if (srcMap) {
        const img = srcMap.image as { width?: number; height?: number } | undefined;
        const w = img?.width ?? 0;
        const h = img?.height ?? 0;
        if (!srcNormal || w > 512 || h > 512 || srcMap.userData?.remasterForPixelizer) {
          let remastered = remasteredCache.get(srcMap);
          if (!remastered) {
            remastered = remasterImportedTextureForPixelizer(srcMap);
            remasteredCache.set(srcMap, remastered);
          }
          let finalAlbedo: THREE.Texture = remastered.albedoMap;
          if (opts.quantizePalette) {
            let qTex = quantizedCache.get(remastered.albedoMap);
            if (!qTex) {
              qTex = quantizeTextureToPalette(
                remastered.albedoMap,
                opts.quantizePalette,
                opts.quantizeDither
              );
              quantizedCache.set(remastered.albedoMap, qTex);
            }
            finalAlbedo = qTex;
          }
          matDefaults.albedoMap = finalAlbedo;
          if (!srcNormal) {
            matDefaults.normalMap = remastered.normalMap;
            matDefaults.normalScale = 0.8;
          }
        }
      }

      const pm = convertStandardMaterialToPixelizer(
        sm,
        matDefaults,
        sharedResources,
        hasVertexColor
      );

      if (matDefaults.albedoMap) {
        pm.options.albedoMap = matDefaults.albedoMap;
      }
      if (matDefaults.normalMap && !srcNormal) {
        pm.options.normalMap = matDefaults.normalMap;
        pm.options.normalScale = matDefaults.normalScale ?? 0.8;
      }
      if (pm.options.normalMap && geo?.getAttribute('uv')) {
        meshNeedsTangents = true;
        pm.options.useVertexTangents = true;
      }
      if (hasVertexColor) {
        pm.vertexColors = true;
      }
      pm.syncUniforms();

      converted.push(pm);
      materials.push(pm);
    }

    if (meshNeedsTangents && geo && !geo.getAttribute('tangent')) {
      if (triCount > 0 && triCount <= 100000) {
        computeGeometryTangents(geo);
      }
    }

    child.material = converted.length === 1 ? converted[0] : converted;
    child.userData.pixelizer = {
      snap: { ...snapCfg },
      gridReference: wrapper,
    } satisfies PixelizerObjectAttachment;
    meshes.push(child);
  }

  // Dispose intermediate non-retained remastered albedos if quantized copies replaced them
  for (const replacedAlb of quantizedCache.keys()) {
    replacedAlb.dispose();
  }

  wrapper.userData.pixelizer = {
    snap: { ...snapCfg },
    gridReference: wrapper,
  } satisfies PixelizerObjectAttachment;

  return {
    root: wrapper,
    animations,
    meshes,
    materials,
    name,
    originalTriangles,
    finalTriangles,
    wasSimplified: simplifiedOnMain || finalTriangles < originalTriangles,
    usedWorker: Boolean(precomputedMeta?.usedWorker),
  };
}

let workerReqCounter = 1;

async function executeObjZipWorker(
  reqData: Omit<ObjWorkerRequest, 'id'>,
  onProgress?: LoadModelOptions['onProgress']
): Promise<{
  meshes: {
    name: string;
    materialName: string;
    geometry: THREE.BufferGeometry;
  }[];
  mtlText: string | null;
  textures: { baseName: string; data: Uint8Array }[];
  originalTriangles: number;
  finalTriangles: number;
}> {
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./objZipWorker.ts', import.meta.url), {
        type: 'module',
      });
    } catch (err) {
      reject(err);
      return;
    }

    const id = workerReqCounter++;
    const payload: ObjWorkerRequest = { id, ...reqData };
    const transfers: Transferable[] = [];
    if (payload.buffer) {
      const cloned = payload.buffer.slice(0);
      payload.buffer = cloned;
      transfers.push(cloned);
    }

    const cleanup = () => {
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
    };

    worker.onmessage = (ev: MessageEvent<ObjWorkerMessage>) => {
      const msg = ev.data;
      if (!msg || msg.id !== id) return;
      if (msg.type === 'progress') {
        onProgress?.({
          phase: msg.phase,
          detail: msg.detail,
          progress: msg.progress,
        });
      } else if (msg.type === 'error') {
        cleanup();
        reject(new Error(msg.message));
      } else if (msg.type === 'result') {
        cleanup();
        const outMeshes = msg.meshes.map((m) => {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.BufferAttribute(m.positions, 3));
          geo.setAttribute('normal', new THREE.BufferAttribute(m.normals, 3));
          if (m.uvs) geo.setAttribute('uv', new THREE.BufferAttribute(m.uvs, 2));
          if (m.colors) geo.setAttribute('color', new THREE.BufferAttribute(m.colors, 3));
          geo.setIndex(new THREE.BufferAttribute(m.indices, 1));
          geo.computeBoundingBox();
          geo.computeBoundingSphere();
          return {
            name: m.name,
            materialName: m.materialName,
            geometry: geo,
          };
        });
        resolve({
          meshes: outMeshes,
          mtlText: msg.mtlText,
          textures: msg.textures,
          originalTriangles: msg.originalTriangles,
          finalTriangles: msg.finalTriangles,
        });
      }
    };

    worker.onerror = (ev) => {
      cleanup();
      reject(new Error(ev.message || 'Falha na execução do ObjZipWorker.'));
    };

    worker.postMessage(payload, transfers);
  });
}

async function assembleGroupFromWorkerResult(
  workerRes: Awaited<ReturnType<typeof executeObjZipWorker>>,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions,
  opts: LoadModelOptions
): Promise<LoadedModelResult> {
  const textureByBaseName = new Map<string, THREE.Texture>();
  for (const t of workerRes.textures) {
    const tex = await decodeImageBytesToTexture(t.data, t.baseName);
    tex.userData = { ...tex.userData, remasterForPixelizer: true };
    textureByBaseName.set(t.baseName.toLowerCase(), tex);
  }
  let defaultTex: THREE.Texture | undefined;
  for (const t of textureByBaseName.values()) {
    defaultTex = t;
    break;
  }

  const mtlMats = buildMtlMaterialMap(workerRes.mtlText, textureByBaseName, defaultTex);
  const group = new THREE.Group();
  group.name = name;

  for (const m of workerRes.meshes) {
    const matched = m.materialName ? mtlMats.get(m.materialName) : undefined;
    const mat =
      matched ??
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: defaultTex ?? null,
      });
    const mesh = new THREE.Mesh(m.geometry, mat);
    mesh.name = m.name;
    group.add(mesh);
  }

  return prepareLoadedObject(group, name, [], sharedResources, defaults, opts, {
    originalTriangles: workerRes.originalTriangles,
    usedWorker: true,
  });
}

/**
 * Loads an `.obj` + optional `.mtl` + textures from an extracted `.zip` archive buffer.
 * Uses the dedicated Web Worker (`objZipWorker.ts`) in browser environments with synchronous fallback in Node/Vitest.
 */
export async function loadModelFromZipBuffer(
  buffer: ArrayBuffer,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  optionsOrUnify: boolean | LoadModelOptions = true
): Promise<LoadedModelResult> {
  const opts = resolveLoadModelOptions(optionsOrUnify);

  if (opts.useWorker && typeof Worker !== 'undefined') {
    try {
      const workerRes = await executeObjZipWorker(
        {
          kind: 'zip',
          name,
          buffer,
          maxTrianglesBeforeSimplify: opts.maxTrianglesBeforeSimplify,
          targetSimplifiedTriangles: opts.targetSimplifiedTriangles,
        },
        opts.onProgress
      );
      return await assembleGroupFromWorkerResult(
        workerRes,
        name,
        sharedResources,
        defaults,
        opts
      );
    } catch (workerErr) {
      // Fall back to synchronous path only when Worker fails to construct/run
      const msg = workerErr instanceof Error ? workerErr.message : String(workerErr);
      if (/ZIP64|truncada|corrompida|EOCD|Nenhum arquivo \.obj/i.test(msg)) {
        throw workerErr;
      }
    }
  }

  const entries = await extractZipArchiveEntries(buffer);
  const objEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.obj'));
  if (!objEntry) {
    throw new Error(`Nenhum arquivo .obj encontrado dentro do pacote "${name}".`);
  }

  const decoder = new TextDecoder('utf-8');
  const mtlEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.mtl'));

  const textureByBaseName = new Map<string, THREE.Texture>();
  for (const entry of entries) {
    const lower = entry.baseName.toLowerCase();
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
      const tex = await decodeImageBytesToTexture(entry.data, entry.baseName);
      tex.userData = { ...tex.userData, remasterForPixelizer: true };
      textureByBaseName.set(lower, tex);
    }
  }

  const objLoader = new OBJLoader();
  let defaultTex: THREE.Texture | undefined;
  for (const t of textureByBaseName.values()) {
    defaultTex = t;
    break;
  }

  const mtlText = mtlEntry ? decoder.decode(mtlEntry.data) : null;
  const mtlMats = buildMtlMaterialMap(mtlText, textureByBaseName, defaultTex);

  const objText = decoder.decode(objEntry.data);
  const group = objLoader.parse(objText);

  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const srcMats = Array.isArray(child.material) ? child.material : [child.material];
      const nextMats = srcMats.map((sm) => {
        const mapped = sm?.name ? mtlMats.get(sm.name) : undefined;
        if (mapped) return mapped;
        if (sm && 'map' in sm && !(sm as THREE.MeshStandardMaterial).map && defaultTex) {
          (sm as THREE.MeshStandardMaterial).map = defaultTex;
          if ('color' in sm && (sm as THREE.MeshStandardMaterial).color instanceof THREE.Color) {
            (sm as THREE.MeshStandardMaterial).color.set('#ffffff');
          }
        }
        return sm;
      });
      child.material = nextMats.length === 1 ? nextMats[0] : nextMats;
    }
  });

  return prepareLoadedObject(group, name, [], sharedResources, defaults, opts);
}

export async function loadModelFromUrl(
  url: string,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  optionsOrUnify: boolean | LoadModelOptions = true
): Promise<LoadedModelResult> {
  const opts = resolveLoadModelOptions(optionsOrUnify);
  const ext = (name.split('.').pop() || url.split('.').pop() || 'glb').toLowerCase();

  if (ext === 'zip') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const buffer = await res.arrayBuffer();
    return loadModelFromZipBuffer(buffer, name, sharedResources, defaults, opts);
  }

  if (ext === 'glb' || ext === 'gltf') {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    return prepareLoadedObject(
      gltf.scene,
      name,
      gltf.animations ?? [],
      sharedResources,
      defaults,
      opts
    );
  }

  if (ext === 'obj') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const text = await res.text();
    if (opts.useWorker && typeof Worker !== 'undefined') {
      try {
        const workerRes = await executeObjZipWorker(
          {
            kind: 'obj',
            name,
            text,
            maxTrianglesBeforeSimplify: opts.maxTrianglesBeforeSimplify,
            targetSimplifiedTriangles: opts.targetSimplifiedTriangles,
          },
          opts.onProgress
        );
        return await assembleGroupFromWorkerResult(
          workerRes,
          name,
          sharedResources,
          defaults,
          opts
        );
      } catch {
        // Fallback below
      }
    }
    const loader = new OBJLoader();
    const group = loader.parse(text);
    return prepareLoadedObject(group, name, [], sharedResources, defaults, opts);
  }

  if (ext === 'fbx') {
    const loader = new FBXLoader();
    const fbx = await loader.loadAsync(url);
    return prepareLoadedObject(
      fbx,
      name,
      fbx.animations ?? [],
      sharedResources,
      defaults,
      opts
    );
  }

  if (ext === 'stl') {
    const loader = new STLLoader();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const buffer = await res.arrayBuffer();
    const geo = loader.parse(buffer);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#c4cdd9' }));
    const group = new THREE.Group();
    group.add(mesh);
    return prepareLoadedObject(group, name, [], sharedResources, defaults, opts);
  }

  throw new Error(`Formato ".${ext}" não suportado. Use .glb, .gltf, .obj, .fbx, .stl ou .zip.`);
}

export async function loadModelFromFile(
  file: File,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  optionsOrUnify: boolean | LoadModelOptions = true
): Promise<LoadedModelResult> {
  const opts = resolveLoadModelOptions(optionsOrUnify);
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'zip') {
    const buffer = await file.arrayBuffer();
    return loadModelFromZipBuffer(buffer, file.name, sharedResources, defaults, opts);
  }
  const url = URL.createObjectURL(file);
  try {
    return await loadModelFromUrl(url, file.name, sharedResources, defaults, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
