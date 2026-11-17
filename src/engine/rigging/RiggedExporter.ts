import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PixelizerMaterial } from '../PixelizerMaterial';

export interface RiggedExportOptions {
  name?: string;
  selectedClipNames?: string[];
  resetToRestPose?: boolean;
  /** Clamp metalness <= 0.35 so engines without HDR EnvMaps (Godot/Three/Unity) don't render dark silhouettes */
  safeMaxMetalness?: number;
}

export interface RiggedExportValidation {
  meshCount: number;
  skinnedMeshCount: number;
  boneCount: number;
  clipCount: number;
  normalizedVertices: number;
  warnings: string[];
}

function convertToExportStandardMaterial(
  src: THREE.Material | null | undefined,
  hasVertexColors: boolean,
  safeMaxMetalness: number
): THREE.MeshStandardMaterial {
  if (src instanceof PixelizerMaterial) {
    const o = src.options;
    const isMetal = o.workflow === 'metallic';
    const metalness = isMetal ? Math.min(safeMaxMetalness, Math.max(0.05, o.metallic)) : 0.08;
    const roughness = Math.max(0.25, Math.min(0.95, 1.0 - o.smoothness));
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(o.baseColor),
      vertexColors: hasVertexColors || src.vertexColors,
      map: o.albedoMap ?? null,
      normalMap: o.normalMap ?? null,
      emissiveMap: o.emissionMap ?? null,
      emissive: new THREE.Color(o.emissionColor),
      emissiveIntensity: o.emissionIntensity > 0 ? Math.min(0.35, o.emissionIntensity * 0.25) : 0,
      metalness,
      roughness,
      side: src.side,
    });
  }

  if (src instanceof THREE.MeshStandardMaterial) {
    const cloned = src.clone();
    cloned.metalness = Math.min(safeMaxMetalness, cloned.metalness);
    return cloned;
  }

  const fallback = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cfd6e2'),
    vertexColors: hasVertexColors,
    metalness: 0.08,
    roughness: 0.72,
  });
  return fallback;
}

/**
 * Validates and fixes skinWeight normalization (`sum === 1.0`) on every SkinnedMesh in a hierarchy.
 */
export function validateAndNormalizeRiggedHierarchy(root: THREE.Object3D): RiggedExportValidation {
  let meshCount = 0;
  let skinnedMeshCount = 0;
  let boneCount = 0;
  let normalizedVertices = 0;
  const warnings: string[] = [];

  root.traverse((obj) => {
    if (obj instanceof THREE.Bone) {
      boneCount++;
    }
    if (obj instanceof THREE.Mesh) {
      meshCount++;
      if (obj instanceof THREE.SkinnedMesh) {
        skinnedMeshCount++;
        const geo = obj.geometry;
        const sw = geo.getAttribute('skinWeight');
        const si = geo.getAttribute('skinIndex');
        if (!sw || !si) {
          warnings.push(`SkinnedMesh "${obj.name}" sem skinIndex/skinWeight.`);
          return;
        }
        for (let i = 0; i < sw.count; i++) {
          const w0 = sw.getX(i);
          const w1 = sw.getY(i);
          const w2 = sw.getZ(i);
          const w3 = sw.getW(i);
          const sum = w0 + w1 + w2 + w3;
          if (Math.abs(sum - 1.0) > 1e-4) {
            if (sum > 1e-6) {
              sw.setXYZW(i, w0 / sum, w1 / sum, w2 / sum, w3 / sum);
            } else {
              sw.setXYZW(i, 1, 0, 0, 0);
            }
            normalizedVertices++;
          }
        }
        sw.needsUpdate = true;
      }
    }
  });

  return {
    meshCount,
    skinnedMeshCount,
    boneCount,
    clipCount: 0,
    normalizedVertices,
    warnings,
  };
}

const PNG_CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function pngCrc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = PNG_CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length, false);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, pngCrc32(out.subarray(4, 8 + data.length)), false);
  return out;
}

function encodeRgbaToPngBlob(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number, flipY: boolean): Blob {
  const rowBytes = width * 4 + 1;
  const raw = new Uint8Array(rowBytes * height);
  let adlerA = 1;
  let adlerB = 0;
  for (let y = 0; y < height; y++) {
    const srcY = flipY ? height - 1 - y : y;
    const dstRow = y * rowBytes;
    raw[dstRow] = 0; // filter type 0 (None)
    const b0 = 0;
    adlerA = (adlerA + b0) % 65521;
    adlerB = (adlerB + adlerA) % 65521;
    const srcOff = srcY * width * 4;
    for (let x = 0; x < width * 4; x++) {
      const v = rgba[srcOff + x];
      raw[dstRow + 1 + x] = v;
      adlerA = (adlerA + v) % 65521;
      adlerB = (adlerB + adlerA) % 65521;
    }
  }
  const adler32 = ((adlerB << 16) | adlerA) >>> 0;

  // Zlib stream using uncompressed DEFLATE stored blocks (max 65535 bytes per block)
  const blockCount = Math.max(1, Math.ceil(raw.length / 65535));
  const zlib = new Uint8Array(2 + blockCount * 5 + raw.length + 4);
  zlib[0] = 0x78;
  zlib[1] = 0x01;
  let zOff = 2;
  let rOff = 0;
  for (let b = 0; b < blockCount; b++) {
    const len = Math.min(65535, raw.length - rOff);
    const isFinal = b === blockCount - 1 ? 1 : 0;
    zlib[zOff++] = isFinal;
    zlib[zOff++] = len & 0xff;
    zlib[zOff++] = (len >>> 8) & 0xff;
    const nlen = (~len) & 0xffff;
    zlib[zOff++] = nlen & 0xff;
    zlib[zOff++] = (nlen >>> 8) & 0xff;
    zlib.set(raw.subarray(rOff, rOff + len), zOff);
    zOff += len;
    rOff += len;
  }
  new DataView(zlib.buffer).setUint32(zOff, adler32, false);

  const ihdrData = new Uint8Array(13);
  const iv = new DataView(ihdrData.buffer);
  iv.setUint32(0, width, false);
  iv.setUint32(4, height, false);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  const ihdr = pngChunk('IHDR', ihdrData);
  const idat = pngChunk('IDAT', zlib);
  const iend = pngChunk('IEND', new Uint8Array(0));
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const totalLen = sig.length + ihdr.length + idat.length + iend.length;
  const png = new Uint8Array(totalLen);
  let p = 0;
  png.set(sig, p);
  p += sig.length;
  png.set(ihdr, p);
  p += ihdr.length;
  png.set(idat, p);
  p += idat.length;
  png.set(iend, p);

  return new Blob([png.buffer], { type: 'image/png' });
}

function installHeadlessCanvasShimIfNeeded(): () => void {
  if (typeof document !== 'undefined' || typeof OffscreenCanvas !== 'undefined') {
    return () => {};
  }
  const g = globalThis as Record<string, unknown>;
  const hadImageData = 'ImageData' in g;
  const prevImageData = g.ImageData;
  const hadOffscreen = 'OffscreenCanvas' in g;
  const prevOffscreen = g.OffscreenCanvas;

  if (!hadImageData) {
    g.ImageData = class HeadlessImageData {
      readonly data: Uint8ClampedArray;
      readonly width: number;
      readonly height: number;
      constructor(data: Uint8ClampedArray, width: number, height: number) {
        this.data = data;
        this.width = width;
        this.height = height;
      }
    };
  }

  g.OffscreenCanvas = class HeadlessOffscreenCanvas {
    width: number;
    height: number;
    private pixels: Uint8ClampedArray | null = null;
    private flipY = false;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }

    getContext(_type: string) {
      return {
        translate: (_x: number, _y: number) => {},
        scale: (_sx: number, sy: number) => {
          if (sy < 0) this.flipY = !this.flipY;
        },
        putImageData: (img: { data: Uint8ClampedArray; width: number; height: number }) => {
          this.pixels = img.data;
          this.width = img.width;
          this.height = img.height;
        },
        drawImage: () => {},
      };
    }

    convertToBlob(): Promise<Blob> {
      const data = this.pixels ?? new Uint8ClampedArray(this.width * this.height * 4);
      return Promise.resolve(encodeRgbaToPngBlob(data, this.width, this.height, this.flipY));
    }
  };

  return () => {
    if (!hadOffscreen) delete g.OffscreenCanvas;
    else g.OffscreenCanvas = prevOffscreen;
    if (!hadImageData) delete g.ImageData;
    else g.ImageData = prevImageData;
  };
}

/**
 * Exports a rigged character (either SkinnedMesh or NWL rigid-bone-child assembly)
 * together with its canonical 65-bone Skeleton and selected AnimationClips into a binary .GLB.
 */
export async function exportRiggedAssetToGlb(
  sourceRoot: THREE.Object3D,
  clips: THREE.AnimationClip[],
  options: RiggedExportOptions = {}
): Promise<{ buffer: ArrayBuffer; validation: RiggedExportValidation }> {
  const safeMaxMetalness = options.safeMaxMetalness ?? 0.35;
  const resetToRestPose = options.resetToRestPose !== false;

  // Safely deep clone preserving Skeleton + Bone references without mutating viewport live state
  const clone = SkeletonUtils.clone(sourceRoot);
  if (options.name) {
    clone.name = options.name;
  }

  const disposableMats: THREE.Material[] = [];
  const boneNamesInClone = new Set<string>();

  clone.traverse((obj) => {
    if (obj instanceof THREE.Bone || obj.name) {
      boneNamesInClone.add(obj.name);
    }
    if (obj instanceof THREE.SkinnedMesh && obj.skeleton && resetToRestPose) {
      obj.skeleton.pose();
    }
    if (obj instanceof THREE.Mesh) {
      const hasCol = Boolean(obj.geometry?.getAttribute('color'));
      if (Array.isArray(obj.material)) {
        const nextMats = obj.material.map((m) => {
          const conv = convertToExportStandardMaterial(m, hasCol, safeMaxMetalness);
          disposableMats.push(conv);
          return conv;
        });
        obj.material = nextMats;
      } else {
        const conv = convertToExportStandardMaterial(obj.material, hasCol, safeMaxMetalness);
        disposableMats.push(conv);
        obj.material = conv;
      }
    }
  });

  const validation = validateAndNormalizeRiggedHierarchy(clone);

  // Filter animations to requested subset & drop orphaned tracks not targeting nodes in clone
  const selectedSet =
    options.selectedClipNames && options.selectedClipNames.length > 0
      ? new Set(options.selectedClipNames)
      : null;

  const exportClips: THREE.AnimationClip[] = [];
  for (const clip of clips) {
    if (selectedSet && !selectedSet.has(clip.name)) continue;
    const validTracks = clip.tracks.filter((t) => {
      const dot = t.name.lastIndexOf('.');
      const nodeName = dot > 0 ? t.name.slice(0, dot) : t.name;
      return boneNamesInClone.has(nodeName);
    });
    if (validTracks.length > 0) {
      const c = new THREE.AnimationClip(clip.name, clip.duration, validTracks.map((t) => t.clone()));
      exportClips.push(c);
    }
  }
  validation.clipCount = exportClips.length;

  clone.updateMatrixWorld(true);
  const cleanupCanvasShim = installHeadlessCanvasShimIfNeeded();
  let res: ArrayBuffer | Record<string, unknown>;
  try {
    const exporter = new GLTFExporter();
    res = await exporter.parseAsync(clone, {
      binary: true,
      onlyVisible: true,
      animations: exportClips,
    });
  } finally {
    cleanupCanvasShim();
    for (const m of disposableMats) {
      m.dispose();
    }
  }

  let buffer: ArrayBuffer;
  if (res instanceof ArrayBuffer) {
    buffer = res;
  } else {
    const encoded = new TextEncoder().encode(JSON.stringify(res));
    buffer = encoded.buffer;
  }

  return { buffer, validation };
}
