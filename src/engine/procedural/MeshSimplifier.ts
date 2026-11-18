import * as THREE from 'three';

export interface SimplifyRawBuffersInput {
  positions: Float32Array;
  normals?: Float32Array | null;
  uvs?: Float32Array | null;
  colors?: Float32Array | null;
  indices?: Uint32Array | Uint16Array | Int32Array | null;
}

export interface SimplifyRawBuffersOptions {
  targetTriangles?: number;
  preserveUvSeams?: boolean;
  minCellSize?: number;
  maxIterations?: number;
}

export interface SimplifyRawBuffersResult {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array | null;
  colors: Float32Array | null;
  indices: Uint32Array;
  originalTriangles: number;
  simplifiedTriangles: number;
}

export interface SimplifyGeometryOptions extends SimplifyRawBuffersOptions {
  recomputeNormalsIfMissing?: boolean;
}

/**
 * Pure TypeScript O(V + T) spatial vertex-clustering simplifier with UV-seam & normal-crease preservation.
 * Uses watertight shared 3D cell centroids for positions so UV/normal seams never tear into cracks,
 * while partitioning attribute sub-clusters by quantized (normalOctant, uvGridBin) so UV islands never smear.
 */
export function simplifyRawIndexedOrNonIndexedBuffers(
  input: SimplifyRawBuffersInput,
  options: SimplifyRawBuffersOptions = {}
): SimplifyRawBuffersResult {
  const targetTriangles = Math.max(12, Math.floor(options.targetTriangles ?? 28000));
  const preserveUvSeams = options.preserveUvSeams ?? true;
  const maxIterations = Math.max(1, Math.min(6, Math.floor(options.maxIterations ?? 4)));

  const srcPos = input.positions;
  const vertCount = Math.floor(srcPos.length / 3);
  const srcIdx = input.indices ?? null;
  const origTris = srcIdx ? Math.floor(srcIdx.length / 3) : Math.floor(vertCount / 3);

  const hasUv = Boolean(input.uvs && input.uvs.length >= vertCount * 2);
  const hasCol = Boolean(input.colors && input.colors.length >= vertCount * 3);
  const hasNorm = Boolean(input.normals && input.normals.length >= vertCount * 3);

  // Fast pass-through if already within budget
  if (origTris <= targetTriangles || vertCount < 3 || origTris < 1) {
    const outIdx = new Uint32Array(origTris * 3);
    if (srcIdx) {
      for (let i = 0; i < outIdx.length; i++) outIdx[i] = srcIdx[i];
    } else {
      for (let i = 0; i < outIdx.length; i++) outIdx[i] = i;
    }
    const outNorm =
      hasNorm && input.normals
        ? new Float32Array(input.normals.subarray(0, vertCount * 3))
        : computeVertexNormalsRaw(srcPos, outIdx);

    return {
      positions: new Float32Array(srcPos.subarray(0, vertCount * 3)),
      normals: outNorm,
      uvs: hasUv && input.uvs ? new Float32Array(input.uvs.subarray(0, vertCount * 2)) : null,
      colors:
        hasCol && input.colors ? new Float32Array(input.colors.subarray(0, vertCount * 3)) : null,
      indices: outIdx,
      originalTriangles: origTris,
      simplifiedTriangles: origTris,
    };
  }

  // 1. Compute tight AABB
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < vertCount; i++) {
    const i3 = i * 3;
    const x = srcPos[i3];
    const y = srcPos[i3 + 1];
    const z = srcPos[i3 + 2];
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }
  const spanX = Math.max(1e-5, maxX - minX);
  const spanY = Math.max(1e-5, maxY - minY);
  const spanZ = Math.max(1e-5, maxZ - minZ);
  const maxDim = Math.max(spanX, spanY, spanZ);

  // 2. Sample average edge length for accurate initial grid cell pitch
  const sampleCount = Math.min(origTris, 512);
  const sampleStep = Math.max(1, Math.floor(origTris / sampleCount));
  let edgeSum = 0;
  let edgeSamples = 0;
  for (let t = 0; t < origTris; t += sampleStep) {
    const t3 = t * 3;
    const i0 = srcIdx ? srcIdx[t3] : t3;
    const i1 = srcIdx ? srcIdx[t3 + 1] : t3 + 1;
    const i2 = srcIdx ? srcIdx[t3 + 2] : t3 + 2;
    const p0x = srcPos[i0 * 3],
      p0y = srcPos[i0 * 3 + 1],
      p0z = srcPos[i0 * 3 + 2];
    const p1x = srcPos[i1 * 3],
      p1y = srcPos[i1 * 3 + 1],
      p1z = srcPos[i1 * 3 + 2];
    const p2x = srcPos[i2 * 3],
      p2y = srcPos[i2 * 3 + 1],
      p2z = srcPos[i2 * 3 + 2];
    edgeSum += Math.hypot(p1x - p0x, p1y - p0y, p1z - p0z);
    edgeSum += Math.hypot(p2x - p1x, p2y - p1y, p2z - p1z);
    edgeSum += Math.hypot(p0x - p2x, p0y - p2y, p0z - p2z);
    edgeSamples += 3;
  }
  const avgEdge = edgeSamples > 0 ? edgeSum / edgeSamples : maxDim / 32;
  const minCell = Math.max(maxDim / 1800, options.minCellSize ?? maxDim / 1500);
  const ratio = Math.max(1.0, origTris / targetTriangles);
  let cellSize = Math.max(minCell, avgEdge * Math.sqrt(ratio) * 0.92);
  if (cellSize > maxDim * 0.25) {
    cellSize = maxDim / Math.max(4, Math.cbrt(targetTriangles * 1.4));
  }

  const srcNormals =
    hasNorm && input.normals ? input.normals : computeVertexNormalsRaw(srcPos, srcIdx, vertCount, origTris);
  const srcUvs = hasUv && input.uvs ? input.uvs : null;
  const srcColors = hasCol && input.colors ? input.colors : null;

  const vertPosCluster = new Int32Array(vertCount);
  const vertAttrCluster = new Int32Array(vertCount);
  const GRID_CAP = 2048;

  const runClusterPass = (pitch: number): SimplifyRawBuffersResult => {
    const safePitch = Math.max(maxDim / (GRID_CAP - 2), pitch);
    const invPitch = 1 / safePitch;

    // Map numeric spatial cell key -> position cluster id
    const cellToPosId = new Map<number, number>();
    const posSumX: number[] = [];
    const posSumY: number[] = [];
    const posSumZ: number[] = [];
    const posCounts: number[] = [];

    // Attribute sub-cluster map using compact stringless key via Map<number, number> when preserveUvSeams=false,
    // or compound numeric key when preserveUvSeams=true
    const attrKeyToId = new Map<string, number>();
    const attrToPosId: number[] = [];
    const attrNormSumX: number[] = [];
    const attrNormSumY: number[] = [];
    const attrNormSumZ: number[] = [];
    const attrUvSumU: number[] = [];
    const attrUvSumV: number[] = [];
    const attrColSumR: number[] = [];
    const attrColSumG: number[] = [];
    const attrColSumB: number[] = [];
    const attrCounts: number[] = [];

    for (let i = 0; i < vertCount; i++) {
      const i3 = i * 3;
      const x = srcPos[i3];
      const y = srcPos[i3 + 1];
      const z = srcPos[i3 + 2];

      const cx = Math.max(0, Math.min(GRID_CAP - 1, Math.floor((x - minX) * invPitch)));
      const cy = Math.max(0, Math.min(GRID_CAP - 1, Math.floor((y - minY) * invPitch)));
      const cz = Math.max(0, Math.min(GRID_CAP - 1, Math.floor((z - minZ) * invPitch)));
      const cellKey = (cx * GRID_CAP + cy) * GRID_CAP + cz;

      let posId = cellToPosId.get(cellKey);
      if (posId === undefined) {
        posId = posCounts.length;
        cellToPosId.set(cellKey, posId);
        posSumX.push(0);
        posSumY.push(0);
        posSumZ.push(0);
        posCounts.push(0);
      }
      posSumX[posId] += x;
      posSumY[posId] += y;
      posSumZ[posId] += z;
      posCounts[posId] += 1;
      vertPosCluster[i] = posId;

      const nx = srcNormals[i3];
      const ny = srcNormals[i3 + 1];
      const nz = srcNormals[i3 + 2];
      // Quantize normal into coarse sectors (2x2x2 signed quadrants + dominant axis)
      const nBin =
        (nx >= 0 ? 1 : 0) |
        (ny >= 0 ? 2 : 0) |
        (nz >= 0 ? 4 : 0) |
        ((Math.abs(nx) > Math.abs(ny) && Math.abs(nx) > Math.abs(nz)
          ? 0
          : Math.abs(ny) > Math.abs(nz)
            ? 1
            : 2) <<
          3);

      let u = 0,
        v = 0;
      let attrKey: string;
      if (preserveUvSeams && srcUvs) {
        u = srcUvs[i * 2];
        v = srcUvs[i * 2 + 1];
        const uq = Math.round(u * 20);
        const vq = Math.round(v * 20);
        attrKey = `${posId}|${nBin}|${uq}|${vq}`;
      } else {
        if (srcUvs) {
          u = srcUvs[i * 2];
          v = srcUvs[i * 2 + 1];
        }
        attrKey = `${posId}|${nBin}`;
      }

      let aId = attrKeyToId.get(attrKey);
      if (aId === undefined) {
        aId = attrCounts.length;
        attrKeyToId.set(attrKey, aId);
        attrToPosId.push(posId);
        attrNormSumX.push(0);
        attrNormSumY.push(0);
        attrNormSumZ.push(0);
        attrUvSumU.push(0);
        attrUvSumV.push(0);
        attrColSumR.push(0);
        attrColSumG.push(0);
        attrColSumB.push(0);
        attrCounts.push(0);
      }
      attrNormSumX[aId] += nx;
      attrNormSumY[aId] += ny;
      attrNormSumZ[aId] += nz;
      if (srcUvs) {
        attrUvSumU[aId] += u;
        attrUvSumV[aId] += v;
      }
      if (srcColors) {
        attrColSumR[aId] += srcColors[i3];
        attrColSumG[aId] += srcColors[i3 + 1];
        attrColSumB[aId] += srcColors[i3 + 2];
      }
      attrCounts[aId] += 1;
      vertAttrCluster[i] = aId;
    }

    // Finalize shared cell position centroids
    const posClusterCount = posCounts.length;
    const centX = new Float32Array(posClusterCount);
    const centY = new Float32Array(posClusterCount);
    const centZ = new Float32Array(posClusterCount);
    for (let p = 0; p < posClusterCount; p++) {
      const inv = 1 / Math.max(1, posCounts[p]);
      centX[p] = posSumX[p] * inv;
      centY[p] = posSumY[p] * inv;
      centZ[p] = posSumZ[p] * inv;
    }

    // Filter non-degenerate triangles & compact actually used attribute clusters
    const rawIndices: number[] = [];
    const remapAttr = new Int32Array(attrCounts.length).fill(-1);
    let compactVertCount = 0;

    for (let t = 0; t < origTris; t++) {
      const t3 = t * 3;
      const i0 = srcIdx ? srcIdx[t3] : t3;
      const i1 = srcIdx ? srcIdx[t3 + 1] : t3 + 1;
      const i2 = srcIdx ? srcIdx[t3 + 2] : t3 + 2;

      const p0 = vertPosCluster[i0];
      const p1 = vertPosCluster[i1];
      const p2 = vertPosCluster[i2];
      if (p0 === p1 || p1 === p2 || p0 === p2) continue;

      // Reject collinear / zero-area clustered triangles
      const ax = centX[p1] - centX[p0],
        ay = centY[p1] - centY[p0],
        az = centZ[p1] - centZ[p0];
      const bx = centX[p2] - centX[p0],
        by = centY[p2] - centY[p0],
        bz = centZ[p2] - centZ[p0];
      const cx = ay * bz - az * by;
      const cy = az * bx - ax * bz;
      const cz = ax * by - ay * bx;
      if (cx * cx + cy * cy + cz * cz <= 1e-16) continue;

      const a0 = vertAttrCluster[i0];
      const a1 = vertAttrCluster[i1];
      const a2 = vertAttrCluster[i2];

      let c0 = remapAttr[a0];
      if (c0 < 0) {
        c0 = compactVertCount++;
        remapAttr[a0] = c0;
      }
      let c1 = remapAttr[a1];
      if (c1 < 0) {
        c1 = compactVertCount++;
        remapAttr[a1] = c1;
      }
      let c2 = remapAttr[a2];
      if (c2 < 0) {
        c2 = compactVertCount++;
        remapAttr[a2] = c2;
      }

      rawIndices.push(c0, c1, c2);
    }

    const outPos = new Float32Array(compactVertCount * 3);
    const outNorm = new Float32Array(compactVertCount * 3);
    const outUv = srcUvs ? new Float32Array(compactVertCount * 2) : null;
    const outCol = srcColors ? new Float32Array(compactVertCount * 3) : null;

    for (let a = 0; a < attrCounts.length; a++) {
      const c = remapAttr[a];
      if (c < 0) continue;
      const pId = attrToPosId[a];
      const inv = 1 / Math.max(1, attrCounts[a]);

      const c3 = c * 3;
      outPos[c3] = centX[pId];
      outPos[c3 + 1] = centY[pId];
      outPos[c3 + 2] = centZ[pId];

      let nx = attrNormSumX[a] * inv;
      let ny = attrNormSumY[a] * inv;
      let nz = attrNormSumZ[a] * inv;
      const nLen = Math.hypot(nx, ny, nz);
      if (nLen > 1e-6) {
        nx /= nLen;
        ny /= nLen;
        nz /= nLen;
      } else {
        nx = 0;
        ny = 1;
        nz = 0;
      }
      outNorm[c3] = nx;
      outNorm[c3 + 1] = ny;
      outNorm[c3 + 2] = nz;

      if (outUv) {
        outUv[c * 2] = attrUvSumU[a] * inv;
        outUv[c * 2 + 1] = attrUvSumV[a] * inv;
      }
      if (outCol) {
        outCol[c3] = Math.max(0, Math.min(1, attrColSumR[a] * inv));
        outCol[c3 + 1] = Math.max(0, Math.min(1, attrColSumG[a] * inv));
        outCol[c3 + 2] = Math.max(0, Math.min(1, attrColSumB[a] * inv));
      }
    }

    const outIdx = new Uint32Array(rawIndices);
    return {
      positions: outPos,
      normals: outNorm,
      uvs: outUv,
      colors: outCol,
      indices: outIdx,
      originalTriangles: origTris,
      simplifiedTriangles: Math.floor(outIdx.length / 3),
    };
  };

  let best = runClusterPass(cellSize);
  for (let iter = 1; iter < maxIterations; iter++) {
    const tris = best.simplifiedTriangles;
    if (tris >= targetTriangles * 0.55 && tris <= targetTriangles * 1.35) {
      break;
    }
    if (tris > targetTriangles * 1.35) {
      const factor = Math.max(1.15, Math.min(2.4, Math.sqrt(tris / targetTriangles)));
      cellSize *= factor;
    } else if (tris < targetTriangles * 0.55) {
      cellSize = Math.max(minCell, cellSize * 0.68);
    }
    const candidate = runClusterPass(cellSize);
    if (
      Math.abs(candidate.simplifiedTriangles - targetTriangles) <
        Math.abs(best.simplifiedTriangles - targetTriangles) ||
      (best.simplifiedTriangles > targetTriangles * 1.35 && candidate.simplifiedTriangles <= best.simplifiedTriangles)
    ) {
      best = candidate;
    } else {
      break;
    }
  }

  return best;
}

function computeVertexNormalsRaw(
  positions: Float32Array,
  indices?: Uint32Array | Uint16Array | Int32Array | null,
  vertCountOverride?: number,
  triCountOverride?: number
): Float32Array {
  const vCount = vertCountOverride ?? Math.floor(positions.length / 3);
  const tCount =
    triCountOverride ?? (indices ? Math.floor(indices.length / 3) : Math.floor(vCount / 3));
  const norms = new Float32Array(vCount * 3);

  for (let t = 0; t < tCount; t++) {
    const t3 = t * 3;
    const i0 = indices ? indices[t3] : t3;
    const i1 = indices ? indices[t3 + 1] : t3 + 1;
    const i2 = indices ? indices[t3 + 2] : t3 + 2;

    const p0x = positions[i0 * 3],
      p0y = positions[i0 * 3 + 1],
      p0z = positions[i0 * 3 + 2];
    const p1x = positions[i1 * 3],
      p1y = positions[i1 * 3 + 1],
      p1z = positions[i1 * 3 + 2];
    const p2x = positions[i2 * 3],
      p2y = positions[i2 * 3 + 1],
      p2z = positions[i2 * 3 + 2];

    const e1x = p1x - p0x,
      e1y = p1y - p0y,
      e1z = p1z - p0z;
    const e2x = p2x - p0x,
      e2y = p2y - p0y,
      e2z = p2z - p0z;
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;

    norms[i0 * 3] += nx;
    norms[i0 * 3 + 1] += ny;
    norms[i0 * 3 + 2] += nz;
    norms[i1 * 3] += nx;
    norms[i1 * 3 + 1] += ny;
    norms[i1 * 3 + 2] += nz;
    norms[i2 * 3] += nx;
    norms[i2 * 3 + 1] += ny;
    norms[i2 * 3 + 2] += nz;
  }

  for (let i = 0; i < vCount; i++) {
    const i3 = i * 3;
    const len = Math.hypot(norms[i3], norms[i3 + 1], norms[i3 + 2]);
    if (len > 1e-8) {
      norms[i3] /= len;
      norms[i3 + 1] /= len;
      norms[i3 + 2] /= len;
    } else {
      norms[i3] = 0;
      norms[i3 + 1] = 1;
      norms[i3 + 2] = 0;
    }
  }
  return norms;
}

function bufferAttrToFloat32(attr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, itemSize: number): Float32Array {
  if (attr instanceof THREE.BufferAttribute && attr.array instanceof Float32Array && !attr.normalized) {
    return attr.array.length >= attr.count * itemSize
      ? attr.array.subarray(0, attr.count * itemSize)
      : new Float32Array(attr.array);
  }
  const out = new Float32Array(attr.count * itemSize);
  for (let i = 0; i < attr.count; i++) {
    out[i * itemSize + 0] = attr.getX(i);
    if (itemSize >= 2) out[i * itemSize + 1] = attr.getY(i);
    if (itemSize >= 3) out[i * itemSize + 2] = attr.getZ(i);
  }
  return out;
}

/**
 * Simplifies any high-poly BufferGeometry down to `targetTriangles` (default `28000`)
 * while keeping watertight UV seams and recomputing clean bounding bounds.
 */
export function simplifyGeometryForPixelArt(
  geo: THREE.BufferGeometry,
  options: SimplifyGeometryOptions = {}
): THREE.BufferGeometry {
  const posAttr = geo.getAttribute('position');
  if (!posAttr) return geo.clone();

  const normAttr = geo.getAttribute('normal');
  const uvAttr = geo.getAttribute('uv');
  const colAttr = geo.getAttribute('color');
  const idxAttr = geo.getIndex();

  const res = simplifyRawIndexedOrNonIndexedBuffers(
    {
      positions: bufferAttrToFloat32(posAttr, 3),
      normals: normAttr ? bufferAttrToFloat32(normAttr, 3) : null,
      uvs: uvAttr ? bufferAttrToFloat32(uvAttr, 2) : null,
      colors: colAttr ? bufferAttrToFloat32(colAttr, 3) : null,
      indices: idxAttr
        ? (idxAttr.array as Uint32Array | Uint16Array | Int32Array)
        : null,
    },
    options
  );

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(res.positions, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(res.normals, 3));
  if (res.uvs) {
    out.setAttribute('uv', new THREE.BufferAttribute(res.uvs, 2));
  }
  if (res.colors) {
    out.setAttribute('color', new THREE.BufferAttribute(res.colors, 3));
  }
  out.setIndex(new THREE.BufferAttribute(res.indices, 1));
  if (options.recomputeNormalsIfMissing && !normAttr) {
    out.computeVertexNormals();
  }
  out.computeBoundingBox();
  out.computeBoundingSphere();
  out.userData = {
    ...geo.userData,
    simplifiedFromTriangles: res.originalTriangles,
    simplifiedToTriangles: res.simplifiedTriangles,
  };
  return out;
}
