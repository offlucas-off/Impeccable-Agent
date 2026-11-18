import { simplifyRawIndexedOrNonIndexedBuffers } from '../../engine/procedural/MeshSimplifier';
import { extractZipArchiveEntries } from './zipExtractor';

export interface ObjWorkerRequest {
  id: number;
  kind: 'zip' | 'obj';
  name: string;
  buffer?: ArrayBuffer;
  text?: string;
  maxTrianglesBeforeSimplify: number;
  targetSimplifiedTriangles: number;
}

export interface ObjWorkerMeshBucket {
  name: string;
  materialName: string;
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array | null;
  colors: Float32Array | null;
  indices: Uint32Array;
}

export interface ObjWorkerTextureEntry {
  baseName: string;
  data: Uint8Array;
}

export type ObjWorkerMessage =
  | {
      id: number;
      type: 'progress';
      phase: string;
      detail: string;
      progress: number;
    }
  | {
      id: number;
      type: 'result';
      meshes: ObjWorkerMeshBucket[];
      mtlText: string | null;
      textures: ObjWorkerTextureEntry[];
      originalTriangles: number;
      finalTriangles: number;
      wasSimplified: boolean;
    }
  | {
      id: number;
      type: 'error';
      message: string;
    };

interface RawMeshBucketAccum {
  name: string;
  materialName: string;
  positions: number[];
  normals: number[];
  uvs: number[];
  colors: number[];
  hasNormals: boolean;
  hasUvs: boolean;
  hasColors: boolean;
  vertCount: number;
}

/**
 * Pure-TS multi-material Wavefront `.obj` parser supporting `v x y z [r g b]`, `vn`, `vt`,
 * `o`/`g`, `usemtl`, negative relative indices, and arbitrary n-gon fan triangulation.
 */
export function parseObjTextToBuckets(
  objText: string,
  defaultName = 'model'
): {
  buckets: {
    name: string;
    materialName: string;
    positions: Float32Array;
    normals: Float32Array | null;
    uvs: Float32Array | null;
    colors: Float32Array | null;
    originalTriangles: number;
  }[];
  totalTriangles: number;
} {
  const vx: number[] = [];
  const vy: number[] = [];
  const vz: number[] = [];
  const vr: number[] = [];
  const vg: number[] = [];
  const vb: number[] = [];
  let anyVertColors = false;

  const ux: number[] = [];
  const uy: number[] = [];
  const nxArr: number[] = [];
  const nyArr: number[] = [];
  const nzArr: number[] = [];

  const bucketsByKey = new Map<string, RawMeshBucketAccum>();
  let currentGroup = defaultName;
  let currentMtl = '';

  const getBucket = (): RawMeshBucketAccum => {
    const key = `${currentGroup}::${currentMtl}`;
    let b = bucketsByKey.get(key);
    if (!b) {
      b = {
        name: currentMtl ? `${currentGroup}_${currentMtl}` : currentGroup,
        materialName: currentMtl,
        positions: [],
        normals: [],
        uvs: [],
        colors: [],
        hasNormals: false,
        hasUvs: false,
        hasColors: false,
        vertCount: 0,
      };
      bucketsByKey.set(key, b);
    }
    return b;
  };

  const resolveIdx = (raw: string | undefined, count: number): number => {
    if (!raw) return -1;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n === 0) return -1;
    return n > 0 ? n - 1 : count + n;
  };

  let lineStart = 0;
  const len = objText.length;
  while (lineStart < len) {
    let lineEnd = objText.indexOf('\n', lineStart);
    if (lineEnd < 0) lineEnd = len;
    const rawLine = objText.slice(lineStart, lineEnd).trim();
    lineStart = lineEnd + 1;

    if (!rawLine || rawLine.charCodeAt(0) === 35 /* '#' */) continue;

    const parts = rawLine.split(/\s+/);
    const cmd = parts[0];

    if (cmd === 'v' && parts.length >= 4) {
      vx.push(parseFloat(parts[1]) || 0);
      vy.push(parseFloat(parts[2]) || 0);
      vz.push(parseFloat(parts[3]) || 0);
      if (parts.length >= 7) {
        const cr = parseFloat(parts[4]);
        const cg = parseFloat(parts[5]);
        const cb = parseFloat(parts[6]);
        if (Number.isFinite(cr) && Number.isFinite(cg) && Number.isFinite(cb)) {
          vr.push(cr > 1 ? cr / 255 : cr);
          vg.push(cg > 1 ? cg / 255 : cg);
          vb.push(cb > 1 ? cb / 255 : cb);
          anyVertColors = true;
        } else {
          vr.push(1);
          vg.push(1);
          vb.push(1);
        }
      } else {
        vr.push(1);
        vg.push(1);
        vb.push(1);
      }
    } else if (cmd === 'vt' && parts.length >= 3) {
      ux.push(parseFloat(parts[1]) || 0);
      uy.push(parseFloat(parts[2]) || 0);
    } else if (cmd === 'vn' && parts.length >= 4) {
      nxArr.push(parseFloat(parts[1]) || 0);
      nyArr.push(parseFloat(parts[2]) || 0);
      nzArr.push(parseFloat(parts[3]) || 0);
    } else if (cmd === 'o' || cmd === 'g') {
      currentGroup = parts.slice(1).join(' ') || defaultName;
    } else if (cmd === 'usemtl') {
      currentMtl = parts.slice(1).join(' ');
    } else if (cmd === 'f' && parts.length >= 4) {
      const bucket = getBucket();
      const vCountPos = vx.length;
      const vCountUv = ux.length;
      const vCountNorm = nxArr.length;

      const cornerCount = parts.length - 1;
      const pIdx: number[] = new Array(cornerCount);
      const tIdx: number[] = new Array(cornerCount);
      const nIdx: number[] = new Array(cornerCount);

      for (let c = 0; c < cornerCount; c++) {
        const segs = parts[c + 1].split('/');
        pIdx[c] = resolveIdx(segs[0], vCountPos);
        tIdx[c] = resolveIdx(segs[1], vCountUv);
        nIdx[c] = resolveIdx(segs[2], vCountNorm);
      }

      const pushCorner = (c: number) => {
        const pi = pIdx[c];
        const px = pi >= 0 && pi < vCountPos ? vx[pi] : 0;
        const py = pi >= 0 && pi < vCountPos ? vy[pi] : 0;
        const pz = pi >= 0 && pi < vCountPos ? vz[pi] : 0;
        bucket.positions.push(px, py, pz);

        if (anyVertColors) {
          bucket.hasColors = true;
          const r = pi >= 0 && pi < vr.length ? vr[pi] : 1;
          const g = pi >= 0 && pi < vg.length ? vg[pi] : 1;
          const b = pi >= 0 && pi < vb.length ? vb[pi] : 1;
          bucket.colors.push(r, g, b);
        }

        const ti = tIdx[c];
        if (ti >= 0 && ti < vCountUv) {
          bucket.hasUvs = true;
          bucket.uvs.push(ux[ti], uy[ti]);
        } else if (bucket.hasUvs) {
          bucket.uvs.push(0, 0);
        }

        const ni = nIdx[c];
        if (ni >= 0 && ni < vCountNorm) {
          bucket.hasNormals = true;
          bucket.normals.push(nxArr[ni], nyArr[ni], nzArr[ni]);
        } else if (bucket.hasNormals) {
          bucket.normals.push(0, 1, 0);
        }
        bucket.vertCount++;
      };

      for (let c = 1; c < cornerCount - 1; c++) {
        if (pIdx[0] < 0 || pIdx[c] < 0 || pIdx[c + 1] < 0) continue;
        pushCorner(0);
        pushCorner(c);
        pushCorner(c + 1);
      }
    }
  }

  let totalTriangles = 0;
  const out: {
    name: string;
    materialName: string;
    positions: Float32Array;
    normals: Float32Array | null;
    uvs: Float32Array | null;
    colors: Float32Array | null;
    originalTriangles: number;
  }[] = [];

  for (const b of bucketsByKey.values()) {
    const triCount = Math.floor(b.vertCount / 3);
    if (triCount <= 0) continue;
    totalTriangles += triCount;

    let normArr: Float32Array | null = null;
    if (b.hasNormals && b.normals.length >= b.vertCount * 3) {
      normArr = new Float32Array(b.normals);
    }
    let uvArr: Float32Array | null = null;
    if (b.hasUvs && b.uvs.length >= b.vertCount * 2) {
      uvArr = new Float32Array(b.uvs);
    }
    let colArr: Float32Array | null = null;
    if (b.hasColors && b.colors.length >= b.vertCount * 3) {
      colArr = new Float32Array(b.colors);
    }

    out.push({
      name: b.name,
      materialName: b.materialName,
      positions: new Float32Array(b.positions),
      normals: normArr,
      uvs: uvArr,
      colors: colArr,
      originalTriangles: triCount,
    });
  }

  return { buckets: out, totalTriangles };
}

const ctxScope =
  typeof self !== 'undefined'
    ? (self as unknown as {
        onmessage: ((ev: MessageEvent<ObjWorkerRequest>) => void) | null;
        postMessage: (msg: ObjWorkerMessage, transfer?: Transferable[]) => void;
      })
    : null;

if (ctxScope) {
  ctxScope.onmessage = async (ev: MessageEvent<ObjWorkerRequest>) => {
    const req = ev.data;
    try {
      const decoder = new TextDecoder('utf-8');
      let objText = req.text ?? '';
      let mtlText: string | null = null;
      const textures: ObjWorkerTextureEntry[] = [];

      if (req.kind === 'zip') {
        if (!req.buffer) throw new Error('Worker ZIP sem buffer.');
        ctxScope.postMessage({
          id: req.id,
          type: 'progress',
          phase: 'extract',
          detail: 'Descompactando pacote .zip em background...',
          progress: 0.15,
        });

        const entries = await extractZipArchiveEntries(req.buffer);
        const objEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.obj'));
        if (!objEntry) {
          throw new Error(`Nenhum arquivo .obj encontrado dentro do pacote "${req.name}".`);
        }
        objText = decoder.decode(objEntry.data);

        const mtlEntry = entries.find((e) => e.baseName.toLowerCase().endsWith('.mtl'));
        if (mtlEntry) {
          mtlText = decoder.decode(mtlEntry.data);
        }

        for (const entry of entries) {
          const lower = entry.baseName.toLowerCase();
          if (
            lower.endsWith('.png') ||
            lower.endsWith('.jpg') ||
            lower.endsWith('.jpeg') ||
            lower.endsWith('.webp')
          ) {
            textures.push({
              baseName: entry.baseName,
              data: new Uint8Array(entry.data),
            });
          }
        }
      }

      ctxScope.postMessage({
        id: req.id,
        type: 'progress',
        phase: 'parse',
        detail: 'Interpretando vértices, UVs e grupos .obj...',
        progress: 0.45,
      });

      const parsed = parseObjTextToBuckets(objText, req.name.replace(/\.[^.]+$/, ''));
      const origTotal = parsed.totalTriangles;
      const shouldSimplify =
        origTotal > req.maxTrianglesBeforeSimplify && req.targetSimplifiedTriangles > 0;

      if (shouldSimplify) {
        ctxScope.postMessage({
          id: req.id,
          type: 'progress',
          phase: 'simplify',
          detail: `Simplificando malha densa (${origTotal.toLocaleString()} → ~${req.targetSimplifiedTriangles.toLocaleString()} tris)...`,
          progress: 0.72,
        });
      }

      const meshes: ObjWorkerMeshBucket[] = [];
      let finalTriangles = 0;

      for (const b of parsed.buckets) {
        const shareTarget = shouldSimplify
          ? Math.max(
              24,
              Math.round((b.originalTriangles / Math.max(1, origTotal)) * req.targetSimplifiedTriangles)
            )
          : b.originalTriangles + 1;

        const sim = simplifyRawIndexedOrNonIndexedBuffers(
          {
            positions: b.positions,
            normals: b.normals,
            uvs: b.uvs,
            colors: b.colors,
          },
          { targetTriangles: shareTarget, preserveUvSeams: true }
        );
        finalTriangles += sim.simplifiedTriangles;

        // Allocate clean independent buffers for transferable posting
        const pos = new Float32Array(sim.positions);
        const norm = new Float32Array(sim.normals);
        const uv = sim.uvs ? new Float32Array(sim.uvs) : null;
        const col = sim.colors ? new Float32Array(sim.colors) : null;
        const idx = new Uint32Array(sim.indices);

        meshes.push({
          name: b.name,
          materialName: b.materialName,
          positions: pos,
          normals: norm,
          uvs: uv,
          colors: col,
          indices: idx,
        });
      }

      const transfers: Transferable[] = [];
      for (const m of meshes) {
        transfers.push(m.positions.buffer, m.normals.buffer, m.indices.buffer);
        if (m.uvs) transfers.push(m.uvs.buffer);
        if (m.colors) transfers.push(m.colors.buffer);
      }
      for (const t of textures) {
        transfers.push(t.data.buffer);
      }

      ctxScope.postMessage(
        {
          id: req.id,
          type: 'result',
          meshes,
          mtlText,
          textures,
          originalTriangles: origTotal,
          finalTriangles,
          wasSimplified: shouldSimplify && finalTriangles < origTotal,
        },
        transfers
      );
    } catch (err) {
      ctxScope.postMessage({
        id: req.id,
        type: 'error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };
}
