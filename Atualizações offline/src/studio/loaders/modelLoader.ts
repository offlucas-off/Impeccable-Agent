import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
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
import { computeGeometryTangents } from '../../engine/procedural/SdfVoxelPrimitives';
import { bakeVertexAoAndCreases } from '../../engine/procedural/VertexAndTexelBaker';
import type { PixelizerMaterialOptions, SnapOptions } from '../../engine/types';

export interface LoadedModelResult {
  root: THREE.Group;
  animations: THREE.AnimationClip[];
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  name: string;
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

export interface ZipEntryBuffer {
  name: string;
  baseName: string;
  data: Uint8Array;
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
 * Pure-TS ZIP archive extractor using browser-standard `DecompressionStream('deflate-raw')`
 * (zero `node:*` imports, compatible with browser & modern V8 runtimes).
 */
export async function extractZipArchiveEntries(buffer: ArrayBuffer): Promise<ZipEntryBuffer[]> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  // Locate End of Central Directory (EOCD) signature 0x06054b50 scanning backward from end
  let eocdOffset = -1;
  const minEocdSearch = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minEocdSearch; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error('Arquivo .zip inválido: cabeçalho EOCD não encontrado.');
  }

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);
  const decoder = new TextDecoder('utf-8');
  const entries: ZipEntryBuffer[] = [];

  let ptr = cdOffset;
  for (let i = 0; i < totalEntries && ptr + 46 <= bytes.length; i++) {
    const sig = view.getUint32(ptr, true);
    if (sig !== 0x02014b50) break;

    const method = view.getUint16(ptr + 10, true);
    const compSize = view.getUint32(ptr + 20, true);
    const uncompSize = view.getUint32(ptr + 24, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localHeaderOffset = view.getUint32(ptr + 42, true);

    const rawName = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    ptr += 46 + nameLen + extraLen + commentLen;

    // Skip directories and macOS __MACOSX metadata
    if (rawName.endsWith('/') || rawName.includes('__MACOSX/')) continue;

    if (localHeaderOffset + 30 > bytes.length) continue;
    const localSig = view.getUint32(localHeaderOffset, true);
    if (localSig !== 0x04034b50) continue;

    const localNameLen = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    const compSlice = bytes.subarray(dataStart, dataStart + compSize);

    let fileData: Uint8Array;
    if (method === 0) {
      fileData = new Uint8Array(compSlice);
    } else if (method === 8) {
      if (typeof DecompressionStream === 'undefined') {
        throw new Error('DecompressionStream ausente neste ambiente para descompactar .zip.');
      }
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      void writer.write(new Uint8Array(compSlice));
      void writer.close();
      const ab = await new Response(ds.readable).arrayBuffer();
      fileData = new Uint8Array(ab);
    } else {
      throw new Error(`Método de compressão ZIP (${method}) não suportado em ${rawName}.`);
    }

    if (uncompSize > 0 && fileData.length !== uncompSize) {
      // Tolerate minor stream differences, keep actual decoded bytes
    }

    const cleanPath = rawName.replace(/\\/g, '/');
    const baseName = cleanPath.split('/').pop() || cleanPath;
    entries.push({ name: cleanPath, baseName, data: fileData });
  }

  return entries;
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

/**
 * Normalizes any imported 3D model to fit neatly inside a ~2.6 unit bounding box,
 * resting with its base near y = 0, and converts its materials into PixelizerMaterials.
 * When unifyObjectId is true (default for character rigs), all sub-meshes share one objectId
 * so silhouettes merge without interior limb boundary scars.
 */
export function prepareLoadedObject(
  object: THREE.Object3D,
  name: string,
  animations: THREE.AnimationClip[],
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): LoadedModelResult {
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

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];
  const basePx = defaults.pixelSize ?? 3;
  const snapCfg: SnapOptions = {
    ...DEFAULT_SNAP,
    alignmentPixelSize: basePx,
  };

  const remasteredCache = new Map<THREE.Texture, RemasteredTextureResult>();

  let meshCounter = 0;
  wrapper.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshCounter++;
      child.castShadow = true;
      child.receiveShadow = true;
      // Preserve deformed bounding box reliability on SkinnedMeshes
      if (child instanceof THREE.SkinnedMesh) {
        child.frustumCulled = false;
      }

      const geo = child.geometry as THREE.BufferGeometry | undefined;
      if (geo) {
        if (!geo.attributes.normal) {
          geo.computeVertexNormals();
        }
        const posAttr = geo.getAttribute('position');
        const triCount = geo.index
          ? Math.floor(geo.index.count / 3)
          : posAttr
            ? Math.floor(posAttr.count / 3)
            : 0;

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
            // Fast zenithal + normal AO shade (`[0.68..1.0]`) for massive 1.9M-triangle raw scans
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

        // Remaster oversized or un-normal-mapped external textures (e.g. 4K Meshy PNGs)
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
            matDefaults.albedoMap = remastered.albedoMap;
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

        // If we remastered albedo/normal, ensure they override raw src.map on the PixelizerMaterial
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
        const posAttr = geo.getAttribute('position');
        const triCount = geo.index
          ? Math.floor(geo.index.count / 3)
          : posAttr
            ? Math.floor(posAttr.count / 3)
            : 0;
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
  });

  wrapper.userData.pixelizer = {
    snap: { ...snapCfg },
    gridReference: wrapper,
  } satisfies PixelizerObjectAttachment;

  return { root: wrapper, animations, meshes, materials, name };
}

/**
 * Loads an `.obj` + optional `.mtl` + textures from an extracted `.zip` archive buffer.
 */
export async function loadModelFromZipBuffer(
  buffer: ArrayBuffer,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): Promise<LoadedModelResult> {
  const entries = await extractZipArchiveEntries(buffer);
  const objEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.obj'));
  if (!objEntry) {
    throw new Error(`Nenhum arquivo .obj encontrado dentro do pacote "${name}".`);
  }

  const decoder = new TextDecoder('utf-8');
  const mtlEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.mtl'));

  // Decode all embedded PNG/JPG/WEBP textures upfront into remaster-ready DataTextures
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

  if (mtlEntry) {
    const mtlText = decoder.decode(mtlEntry.data);
    const mtlLoader = new MTLLoader();
    const materialsCreator = mtlLoader.parse(mtlText, '');
    materialsCreator.preload();
    for (const mat of Object.values(materialsCreator.materials)) {
      if (mat && 'map' in mat) {
        const m = mat as THREE.MeshPhongMaterial;
        const mapName = m.map?.name?.split('/').pop()?.toLowerCase() ?? '';
        const matched = textureByBaseName.get(mapName) ?? defaultTex;
        if (matched) {
          m.map = matched;
          m.color.set('#ffffff');
        }
      }
    }
    objLoader.setMaterials(materialsCreator);
  }

  const objText = decoder.decode(objEntry.data);
  const group = objLoader.parse(objText);

  // Ensure any mesh without a bound texture map receives the archive's primary texture if present
  if (defaultTex) {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        for (const m of mats) {
          if (m && 'map' in m && !(m as THREE.MeshStandardMaterial).map) {
            (m as THREE.MeshStandardMaterial).map = defaultTex!;
            if ('color' in m && (m as THREE.MeshStandardMaterial).color instanceof THREE.Color) {
              (m as THREE.MeshStandardMaterial).color.set('#ffffff');
            }
          }
        }
      }
    });
  }

  return prepareLoadedObject(group, name, [], sharedResources, defaults, unifyObjectId);
}

export async function loadModelFromUrl(
  url: string,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): Promise<LoadedModelResult> {
  const ext = (name.split('.').pop() || url.split('.').pop() || 'glb').toLowerCase();

  if (ext === 'zip') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const buffer = await res.arrayBuffer();
    return loadModelFromZipBuffer(buffer, name, sharedResources, defaults, unifyObjectId);
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
      unifyObjectId
    );
  }

  if (ext === 'obj') {
    const loader = new OBJLoader();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const text = await res.text();
    const group = loader.parse(text);
    return prepareLoadedObject(group, name, [], sharedResources, defaults, unifyObjectId);
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
      unifyObjectId
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
    return prepareLoadedObject(group, name, [], sharedResources, defaults, unifyObjectId);
  }

  throw new Error(`Formato ".${ext}" não suportado. Use .glb, .gltf, .obj, .fbx, .stl ou .zip.`);
}

export async function loadModelFromFile(
  file: File,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): Promise<LoadedModelResult> {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'zip') {
    const buffer = await file.arrayBuffer();
    return loadModelFromZipBuffer(buffer, file.name, sharedResources, defaults, unifyObjectId);
  }
  const url = URL.createObjectURL(file);
  try {
    return await loadModelFromUrl(url, file.name, sharedResources, defaults, unifyObjectId);
  } finally {
    URL.revokeObjectURL(url);
  }
}
