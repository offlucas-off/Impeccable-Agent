import * as THREE from 'three';
import { computeGeometryTangents, mergeColoredParts } from './SdfVoxelPrimitives';
import type { LandmarkKind, MaterialRecipeId, TaggedGeometryPart } from './ProceduralGeometryKit';

export interface UvIslandMeta {
  id: number;
  partTag: string;
  materialKind: MaterialRecipeId;
  baseHex: string;
  accentHex?: string;
  landmarkKind: LandmarkKind;
  axisTag: '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z' | 'chart';
  lockVertical: boolean;
  rotated90: boolean;
  /** Allocated integer texel box inside the atlas (without outer padding gutter). */
  pxBounds: { x: number; y: number; w: number; h: number };
  /** Exact UV extents covered by vertices of this island (inside pxBounds). */
  contentPxBounds: { x: number; y: number; w: number; h: number };
  uvBounds: { u0: number; v0: number; u1: number; v1: number };
  texelsPerMeter: number;
  triIndices: number[];
}

export interface UnwrappedAtlasResult {
  geometry: THREE.BufferGeometry;
  texWidth: number;
  texHeight: number;
  texelsPerMeter: number;
  paddingPx: number;
  islands: UvIslandMeta[];
  /** Island id per output triangle index (-1 if none). */
  triIslandIds: Int32Array;
}

export interface UnwrapOptions {
  texelsPerMeter?: number;
  paddingPx?: number;
  minAtlasSize?: number;
  maxAtlasSize?: number;
  computeTangents?: boolean;
  islandChartCosThreshold?: number;
  /** Default `'white_for_ao'` prevents double-multiplying baseHex (`albedoMap * vertexColor`) so vertexColor stores pure grayscale AO. */
  vertexColorMode?: 'white_for_ao' | 'preserve';
}

export interface UvOverlapExample {
  triA: number;
  triB: number;
  area: number;
  partA: string;
  partB: string;
}

export interface UvDensityOutlier {
  triIndex: number;
  partTag: string;
  density: number;
  ratioToTarget: number;
}

export interface UvDiagnosticsReport {
  triangleCount: number;
  nonFiniteTriangles: number;
  collapsedTriangles: number;
  outOfTileTriangles: number;
  overlapPairs: number;
  overlapArea: number;
  utilization: number;
  texWidth: number;
  texHeight: number;
  targetTexelsPerMeter: number;
  medianTexelsPerMeter: number;
  minTexelsPerMeter: number;
  maxTexelsPerMeter: number;
  uvDensityOutliers: UvDensityOutlier[];
  flatDetailCuboids: string[];
  overlapExamples: UvOverlapExample[];
}

// ---------------------------------------------------------------------------
// Geometry chart extraction & tangent projection
// ---------------------------------------------------------------------------

interface RawTriangle {
  triIdxInPart: number;
  p0: [number, number, number];
  p1: [number, number, number];
  p2: [number, number, number];
  normal: [number, number, number];
  area3D: number;
  axisBucket: '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z';
}

interface RawChart {
  part: TaggedGeometryPart;
  triIndices: number[];
  axisTag: UvIslandMeta['axisTag'];
  tangent: [number, number, number];
  bitangent: [number, number, number];
  normal: [number, number, number];
  landmarkKind: LandmarkKind;
  lockVertical: boolean;
  rawUs: number[];
  rawVs: number[];
  minU: number;
  maxU: number;
  minV: number;
  maxV: number;
  spanU: number;
  spanV: number;
}

function normalize3(x: number, y: number, z: number): [number, number, number] {
  const l = Math.hypot(x, y, z);
  return l > 1e-10 ? [x / l, y / l, z / l] : [0, 0, 1];
}

function cross3(
  a: [number, number, number],
  b: [number, number, number]
): [number, number, number] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot3(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function dominantAxisBucket(n: [number, number, number]): RawTriangle['axisBucket'] {
  const ax = Math.abs(n[0]),
    ay = Math.abs(n[1]),
    az = Math.abs(n[2]);
  if (az >= ax && az >= ay) return n[2] >= 0 ? '+Z' : '-Z';
  if (ax >= ay && ax >= az) return n[0] >= 0 ? '+X' : '-X';
  return n[1] >= 0 ? '+Y' : '-Y';
}

function canonicalFrameForAxis(axis: RawTriangle['axisBucket']): {
  tangent: [number, number, number];
  bitangent: [number, number, number];
  normal: [number, number, number];
} {
  // Convention: Right-handed (tangent x bitangent = outward normal) with +Y mapped to +V on all side walls/heads!
  switch (axis) {
    case '+Z':
      return { tangent: [1, 0, 0], bitangent: [0, 1, 0], normal: [0, 0, 1] };
    case '-Z':
      return { tangent: [-1, 0, 0], bitangent: [0, 1, 0], normal: [0, 0, -1] };
    case '+X':
      return { tangent: [0, 0, -1], bitangent: [0, 1, 0], normal: [1, 0, 0] };
    case '-X':
      return { tangent: [0, 0, 1], bitangent: [0, 1, 0], normal: [-1, 0, 0] };
    case '+Y':
      return { tangent: [1, 0, 0], bitangent: [0, 0, -1], normal: [0, 1, 0] };
    case '-Y':
      return { tangent: [1, 0, 0], bitangent: [0, 0, 1], normal: [0, -1, 0] };
  }
}

function chartBasisFromNormal(
  n: [number, number, number],
  lockVertical: boolean
): {
  tangent: [number, number, number];
  bitangent: [number, number, number];
  normal: [number, number, number];
} {
  const nn = normalize3(n[0], n[1], n[2]);
  if (Math.abs(nn[1]) > 0.94) {
    return canonicalFrameForAxis(nn[1] >= 0 ? '+Y' : '-Y');
  }
  const refUp: [number, number, number] = lockVertical ? [0, 1, 0] : [0, 1, 0];
  // First build horizontal right tangent perpendicular to (up, nn): T = normalize(up x nn)
  const rawT = cross3(refUp, nn);
  const tLen = Math.hypot(rawT[0], rawT[1], rawT[2]);
  const tangent = tLen > 1e-5 ? normalize3(rawT[0], rawT[1], rawT[2]) : ([1, 0, 0] as [number, number, number]);
  // Outward right-handed basis: T x B = N  => B = N x T
  const bitangent = normalize3(...cross3(nn, tangent));
  return { tangent, bitangent, normal: nn };
}

function buildPartTriangles(geo: THREE.BufferGeometry): RawTriangle[] {
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo;
  const pos = nonIndexed.getAttribute('position');
  const triCount = Math.floor(pos.count / 3);
  const tris: RawTriangle[] = [];

  for (let t = 0; t < triCount; t++) {
    const i0 = t * 3,
      i1 = t * 3 + 1,
      i2 = t * 3 + 2;
    const p0: [number, number, number] = [pos.getX(i0), pos.getY(i0), pos.getZ(i0)];
    const p1: [number, number, number] = [pos.getX(i1), pos.getY(i1), pos.getZ(i1)];
    const p2: [number, number, number] = [pos.getX(i2), pos.getY(i2), pos.getZ(i2)];

    const e1x = p1[0] - p0[0],
      e1y = p1[1] - p0[1],
      e1z = p1[2] - p0[2];
    const e2x = p2[0] - p0[0],
      e2y = p2[1] - p0[1],
      e2z = p2[2] - p0[2];
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    const normLen = Math.hypot(nx, ny, nz);
    const area3D = normLen * 0.5;
    const n: [number, number, number] =
      normLen > 1e-12 ? [nx / normLen, ny / normLen, nz / normLen] : [0, 1, 0];

    tris.push({
      triIdxInPart: t,
      p0,
      p1,
      p2,
      normal: n,
      area3D,
      axisBucket: dominantAxisBucket(n),
    });
  }

  if (nonIndexed !== geo) nonIndexed.dispose();
  return tris;
}

function buildTriangleAdjacency(tris: RawTriangle[]): number[][] {
  const adj: number[][] = Array.from({ length: tris.length }, () => []);
  const edgeMap = new Map<string, number[]>();
  const q = (p: [number, number, number]) =>
    `${Math.round(p[0] * 5000)},${Math.round(p[1] * 5000)},${Math.round(p[2] * 5000)}`;

  for (let t = 0; t < tris.length; t++) {
    const tri = tris[t];
    if (tri.area3D <= 1e-10) continue;
    const verts: [number, number, number][] = [tri.p0, tri.p1, tri.p2];
    for (let e = 0; e < 3; e++) {
      const k0 = q(verts[e]);
      const k1 = q(verts[(e + 1) % 3]);
      const ek = k0 < k1 ? `${k0}|${k1}` : `${k1}|${k0}`;
      let list = edgeMap.get(ek);
      if (!list) {
        list = [];
        edgeMap.set(ek, list);
      }
      list.push(t);
    }
  }

  for (const list of edgeMap.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        adj[list[i]].push(list[j]);
        adj[list[j]].push(list[i]);
      }
    }
  }
  return adj;
}

function splitChartsWithoutFoldOrSelfOverlap(
  part: TaggedGeometryPart,
  tris: RawTriangle[],
  cosThreshold: number
): RawChart[] {
  const adj = buildTriangleAdjacency(tris);
  const visited = new Uint8Array(tris.length);
  // Process larger triangles first so flat major panels claim clean canonical planes before chamfers
  const order = tris
    .map((tr, i) => ({ i, area: tr.area3D }))
    .filter((x) => x.area > 1e-10)
    .sort((a, b) => b.area - a.area)
    .map((x) => x.i);

  const charts: RawChart[] = [];

  for (const seedIdx of order) {
    if (visited[seedIdx]) continue;
    const seedTri = tris[seedIdx];
    const canonical = canonicalFrameForAxis(seedTri.axisBucket);
    const isSeedCanonical = dot3(seedTri.normal, canonical.normal) >= 0.96;
    const axisCosThreshold = isSeedCanonical ? Math.max(cosThreshold, 0.94) : cosThreshold;

    const cluster: number[] = [seedIdx];
    visited[seedIdx] = 1;
    let sumNx = seedTri.normal[0] * seedTri.area3D;
    let sumNy = seedTri.normal[1] * seedTri.area3D;
    let sumNz = seedTri.normal[2] * seedTri.area3D;

    const queue: number[] = [seedIdx];
    let qHead = 0;

    while (qHead < queue.length) {
      const curr = queue[qHead++];
      const currN = tris[curr].normal;
      const avgN = normalize3(sumNx, sumNy, sumNz);

      for (const nb of adj[curr]) {
        if (visited[nb]) continue;
        const nbN = tris[nb].normal;
        // Strict local + average cone bound keeps cos >= 0.88 => texel ratio >= sqrt(0.88) = 0.938!
        if (dot3(avgN, nbN) < axisCosThreshold || dot3(currN, nbN) < axisCosThreshold) {
          continue;
        }
        // Extra fold prevention against current provisional plane normal
        const nextAvg = normalize3(
          sumNx + nbN[0] * tris[nb].area3D,
          sumNy + nbN[1] * tris[nb].area3D,
          sumNz + nbN[2] * tris[nb].area3D
        );
        if (dot3(nbN, nextAvg) < 0.88) continue;

        visited[nb] = 1;
        cluster.push(nb);
        sumNx += nbN[0] * tris[nb].area3D;
        sumNy += nbN[1] * tris[nb].area3D;
        sumNz += nbN[2] * tris[nb].area3D;
        queue.push(nb);
      }
    }

    const finalAvgN = normalize3(sumNx, sumNy, sumNz);
    const frame =
      isSeedCanonical && dot3(finalAvgN, canonical.normal) >= 0.96
        ? canonical
        : chartBasisFromNormal(finalAvgN, part.lockVertical !== false);

    // Sub-check cluster triangles individually: if any single triangle deviates too far or flips winding vs frame.normal,
    // peel it out into its own mini-chart so zero folds / zero density outliers occur!
    const validCluster: number[] = [];
    const rejected: number[] = [];
    for (const ti of cluster) {
      const tr = tris[ti];
      const d = dot3(tr.normal, frame.normal);
      if (d >= 0.88) {
        validCluster.push(ti);
      } else {
        rejected.push(ti);
      }
    }

    const pushClusterChart = (subTris: number[], axisTag: UvIslandMeta['axisTag'], fr: {
      tangent: [number, number, number];
      bitangent: [number, number, number];
      normal: [number, number, number];
    }) => {
      if (subTris.length === 0) return;

      // Project all vertices onto (fr.tangent, fr.bitangent)
      const rawUs: number[] = [];
      const rawVs: number[] = [];
      let minU = Infinity,
        maxU = -Infinity,
        minV = Infinity,
        maxV = -Infinity;

      for (const ti of subTris) {
        const tr = tris[ti];
        for (const pt of [tr.p0, tr.p1, tr.p2]) {
          const u = dot3(pt, fr.tangent);
          const v = dot3(pt, fr.bitangent);
          rawUs.push(u);
          rawVs.push(v);
          if (u < minU) minU = u;
          if (u > maxU) maxU = u;
          if (v < minV) minV = v;
          if (v > maxV) maxV = v;
        }
      }

      // Check for internal self-overlaps inside non-convex organic clusters
      const overlapFound = subTris.length > 2 && clusterHasLocalUvOverlap(rawUs, rawVs);
      if (overlapFound && subTris.length > 1) {
        // Bisect cleanly along U or V median to separate concave lobes without overlap!
        const midU = (minU + maxU) * 0.5;
        const midV = (minV + maxV) * 0.5;
        const splitAlongU = maxU - minU >= maxV - minV;
        const left: number[] = [];
        const right: number[] = [];
        for (let idx = 0; idx < subTris.length; idx++) {
          const cx = (rawUs[idx * 3] + rawUs[idx * 3 + 1] + rawUs[idx * 3 + 2]) / 3;
          const cy = (rawVs[idx * 3] + rawVs[idx * 3 + 1] + rawVs[idx * 3 + 2]) / 3;
          if (splitAlongU ? cx <= midU : cy <= midV) left.push(subTris[idx]);
          else right.push(subTris[idx]);
        }
        if (left.length > 0 && right.length > 0) {
          pushClusterChart(left, axisTag, fr);
          pushClusterChart(right, axisTag, fr);
          return;
        }
        // Fallback if centroid split coincided: single triangle charts guarantee 0 internal fold
        for (const ti of subTris) {
          const tf = chartBasisFromNormal(tris[ti].normal, part.lockVertical !== false);
          pushClusterChart([ti], 'chart', tf);
        }
        return;
      }

      const spanU = Math.max(1e-5, maxU - minU);
      const spanV = Math.max(1e-5, maxV - minV);
      let landmarkKind: LandmarkKind = 'none';
      if (part.landmarkKind && part.landmarkKind !== 'none') {
        if (part.landmarkKind === 'head_front' && axisTag === '+Z') landmarkKind = 'head_front';
        else if (part.landmarkKind === 'chest_crest' && axisTag === '+Z') landmarkKind = 'chest_crest';
        else if (part.landmarkKind === 'door_front' && (axisTag === '+Z' || axisTag === '-Z'))
          landmarkKind = 'door_front';
        else if (part.landmarkKind === 'shield_face' && axisTag === '+Z') landmarkKind = 'shield_face';
        else if (part.landmarkKind === 'rune_panel' && (axisTag === '+Z' || axisTag === '+X' || axisTag === '-X'))
          landmarkKind = 'rune_panel';
      }

      charts.push({
        part,
        triIndices: subTris,
        axisTag,
        tangent: fr.tangent,
        bitangent: fr.bitangent,
        normal: fr.normal,
        landmarkKind,
        lockVertical: part.lockVertical !== false,
        rawUs,
        rawVs,
        minU,
        maxU,
        minV,
        maxV,
        spanU,
        spanV,
      });
    };

    const tagAxis: UvIslandMeta['axisTag'] =
      frame === canonical ? seedTri.axisBucket : 'chart';
    pushClusterChart(validCluster, tagAxis, frame);
    for (const rTi of rejected) {
      const rFrame = chartBasisFromNormal(tris[rTi].normal, part.lockVertical !== false);
      pushClusterChart([rTi], 'chart', rFrame);
    }
  }

  return charts;
}

function clusterHasLocalUvOverlap(us: number[], vs: number[]): boolean {
  const nt = Math.floor(us.length / 3);
  if (nt < 2) return false;
  const U = new Float64Array(nt * 6);
  for (let t = 0; t < nt; t++) {
    for (let k = 0; k < 3; k++) {
      U[t * 6 + k * 2] = us[t * 3 + k];
      U[t * 6 + k * 2 + 1] = vs[t * 3 + k];
    }
  }
  const { ok, signed } = uvTriangleAreas(U, nt);
  const valid: number[] = [];
  for (let t = 0; t < nt; t++) if (ok[t]) valid.push(t);
  let found = false;
  uvOverlapPairs(
    U,
    valid,
    signed,
    () => {
      found = true;
    },
    { maxTests: 5000 }
  );
  return found;
}

// ---------------------------------------------------------------------------
// Pixel-aligned skyline column packer (inspired by topotopo uvpack.ts)
// ---------------------------------------------------------------------------

interface PackBox {
  chartIdx: number;
  slotW: number;
  slotH: number;
  contentW: number;
  contentH: number;
  allowRotate: boolean;
}

interface PlacedBox {
  chartIdx: number;
  x: number;
  y: number;
  w: number;
  h: number;
  contentX: number;
  contentY: number;
  contentW: number;
  contentH: number;
  rotated90: boolean;
}

function tryPackSkyline(
  boxes: PackBox[],
  width: number,
  height: number,
  paddingPx: number
): PlacedBox[] | null {
  const usableW = width - 2;
  const usableH = height - 2;
  if (usableW <= 0 || usableH <= 0) return null;

  const colY = new Int32Array(usableW);
  const placed: PlacedBox[] = [];

  for (const b of boxes) {
    const reqW = b.slotW + paddingPx;
    const reqH = b.slotH + paddingPx;

    let bestX = -1;
    let bestY = Infinity;
    let bestRot = false;

    const scanOrientation = (rw: number, rh: number, isRot: boolean) => {
      if (rw > usableW || rh > usableH) return;
      for (let x = 0; x <= usableW - rw; x++) {
        let top = 0;
        for (let k = 0; k < rw; k++) {
          if (colY[x + k] > top) top = colY[x + k];
        }
        if (top + rh <= usableH && top < bestY) {
          bestY = top;
          bestX = x;
          bestRot = isRot;
        }
      }
    };

    scanOrientation(reqW, reqH, false);
    if (b.allowRotate && b.slotW !== b.slotH) {
      scanOrientation(reqH, reqW, true);
    }

    if (bestX < 0) return null;

    const rw = bestRot ? reqH : reqW;
    const rh = bestRot ? reqW : reqH;
    for (let k = 0; k < rw; k++) {
      colY[bestX + k] = bestY + rh;
    }

    const pxX = 1 + bestX;
    const pxY = 1 + bestY;
    const w = bestRot ? b.slotH : b.slotW;
    const h = bestRot ? b.slotW : b.slotH;
    const cw = bestRot ? b.contentH : b.contentW;
    const ch = bestRot ? b.contentW : b.contentH;

    placed.push({
      chartIdx: b.chartIdx,
      x: pxX,
      y: pxY,
      w,
      h,
      contentX: pxX + (w - cw) * 0.5,
      contentY: pxY + (h - ch) * 0.5,
      contentW: cw,
      contentH: ch,
      rotated90: bestRot,
    });
  }

  return placed;
}

const ATLAS_SIZE_CANDIDATES: [number, number][] = [
  [32, 32],
  [64, 32],
  [64, 64],
  [96, 64],
  [96, 96],
  [128, 96],
  [128, 128],
  [192, 128],
  [192, 192],
  [256, 192],
  [256, 256],
  [384, 256],
  [384, 384],
  [512, 384],
  [512, 512],
  [768, 512],
  [768, 768],
  [1024, 768],
  [1024, 1024],
];

// ---------------------------------------------------------------------------
// Public Auto-UV Unwrapper Entrypoint
// ---------------------------------------------------------------------------

export function unwrapPixelAligned(
  parts: TaggedGeometryPart[],
  options: UnwrapOptions = {}
): UnwrappedAtlasResult {
  const ppm = Math.max(8, options.texelsPerMeter ?? 32);
  const paddingPx = Math.max(2, Math.round(options.paddingPx ?? 3));
  const minAtlasSize = Math.max(32, options.minAtlasSize ?? 64);
  const maxAtlasSize = Math.max(minAtlasSize, options.maxAtlasSize ?? 1024);
  const cosThreshold = options.islandChartCosThreshold ?? 0.91;

  // 1) Extract coherent planar/smooth charts per part
  const allCharts: RawChart[] = [];
  const partTrianglesList: RawTriangle[][] = [];

  for (const part of parts) {
    const tris = buildPartTriangles(part.geometry);
    partTrianglesList.push(tris);
    const charts = splitChartsWithoutFoldOrSelfOverlap(part, tris, cosThreshold);
    allCharts.push(...charts);
  }

  if (allCharts.length === 0) {
    const emptyGeo = mergeColoredParts(parts.map((p) => p.geometry));
    return {
      geometry: emptyGeo,
      texWidth: minAtlasSize,
      texHeight: minAtlasSize,
      texelsPerMeter: ppm,
      paddingPx,
      islands: [],
      triIslandIds: new Int32Array(0),
    };
  }

  // 2) Compute exact integer texel slots + distortion-safe content dimensions
  const packBoxes: PackBox[] = allCharts.map((ch, idx) => {
    const bias = ch.part.islandScaleBias ?? 1.0;
    const rawW = ch.spanU * ppm * bias;
    const rawH = ch.spanV * ppm * bias;

    // For large panels >= 5.5px, snap to exact integer pixels (max <= 9.1% deviation, combined with cos>=0.91 never exceeds +-14%!).
    // For slim bevel strips or small facets < 5.5px, preserve exact physical ppm dimensions centered inside a >=2px padded slot.
    const snapW = rawW >= 5.5 ? Math.max(6, Math.round(rawW)) : rawW;
    const snapH = rawH >= 5.5 ? Math.max(6, Math.round(rawH)) : rawH;
    const slotW = Math.max(2, Math.ceil(snapW));
    const slotH = Math.max(2, Math.ceil(snapH));

    return {
      chartIdx: idx,
      slotW,
      slotH,
      contentW: Math.max(0.05, snapW),
      contentH: Math.max(0.05, snapH),
      allowRotate: !ch.lockVertical && ch.landmarkKind === 'none',
    };
  });

  // Sort tallest/largest first for dense skyline packing
  const sortedBoxes = [...packBoxes].sort(
    (a, b) => b.slotH - a.slotH || b.slotW - a.slotW || b.slotW * b.slotH - a.slotW * a.slotH
  );

  // 3) Pack without shrinking texel density (grow atlas candidate instead!)
  let chosenW = maxAtlasSize;
  let chosenH = maxAtlasSize;
  let placed: PlacedBox[] | null = null;

  for (const [cw, ch] of ATLAS_SIZE_CANDIDATES) {
    if (cw < minAtlasSize || ch < minAtlasSize) continue;
    if (cw > maxAtlasSize || ch > maxAtlasSize) continue;
    const attempt = tryPackSkyline(sortedBoxes, cw, ch, paddingPx);
    if (attempt) {
      chosenW = cw;
      chosenH = ch;
      placed = attempt;
      break;
    }
  }

  if (!placed) {
    // Emergency fallback larger canvas keeping integer scale
    const attempt = tryPackSkyline(sortedBoxes, maxAtlasSize * 2, maxAtlasSize * 2, paddingPx);
    if (attempt) {
      chosenW = maxAtlasSize * 2;
      chosenH = maxAtlasSize * 2;
      placed = attempt;
    } else {
      // Uniform mild fallback scale so packing never crashes even on huge multi-mesh calls
      const scaleFactor = 0.75;
      const scaledBoxes = sortedBoxes.map((b) => ({
        ...b,
        slotW: Math.max(2, Math.ceil(b.slotW * scaleFactor)),
        slotH: Math.max(2, Math.ceil(b.slotH * scaleFactor)),
        contentW: Math.max(0.05, b.contentW * scaleFactor),
        contentH: Math.max(0.05, b.contentH * scaleFactor),
      }));
      chosenW = maxAtlasSize;
      chosenH = maxAtlasSize;
      placed = tryPackSkyline(scaledBoxes, chosenW, chosenH, Math.max(1, paddingPx - 1)) ?? [];
    }
  }

  const placementByChart = new Map<number, PlacedBox>();
  for (const pb of placed) placementByChart.set(pb.chartIdx, pb);

  // 4) Assemble final non-indexed BufferGeometry preserving positions, normals, colors & exact packed UVs
  const outPositions: number[] = [];
  const outNormals: number[] = [];
  const outColors: number[] = [];
  const outUvs: number[] = [];
  const triIslandIdsList: number[] = [];
  const partTriGlobalStart: number[] = [];

  // Map per-part vertex indices by (partIndex, triIndexInPart)
  let totalOutTris = 0;
  for (let pIdx = 0; pIdx < parts.length; pIdx++) {
    partTriGlobalStart.push(totalOutTris);
    totalOutTris += partTrianglesList[pIdx].length;
  }

  const preserveColors = options.vertexColorMode === 'preserve';

  // First push every part's raw attributes into consolidated arrays cleanly
  for (let pIdx = 0; pIdx < parts.length; pIdx++) {
    const rawGeo = parts[pIdx].geometry;
    const nonIdx = rawGeo.index ? rawGeo.toNonIndexed() : rawGeo;
    if (!nonIdx.getAttribute('normal')) nonIdx.computeVertexNormals();
    const pos = nonIdx.getAttribute('position');
    const norm = nonIdx.getAttribute('normal');
    const col = preserveColors ? nonIdx.getAttribute('color') : undefined;
    const fallbackCol = preserveColors ? new THREE.Color(parts[pIdx].baseHex) : null;
    const triCount = Math.floor(pos.count / 3);

    for (let v = 0; v < triCount * 3; v++) {
      outPositions.push(pos.getX(v), pos.getY(v), pos.getZ(v));
      outNormals.push(norm.getX(v), norm.getY(v), norm.getZ(v));
      if (col) {
        outColors.push(col.getX(v), col.getY(v), col.getZ(v));
      } else if (fallbackCol) {
        outColors.push(fallbackCol.r, fallbackCol.g, fallbackCol.b);
      } else {
        outColors.push(1, 1, 1);
      }
      outUvs.push(0, 0);
    }
    for (let t = 0; t < triCount; t++) {
      triIslandIdsList.push(-1);
    }
    if (nonIdx !== rawGeo) nonIdx.dispose();
  }

  const partToIdx = new Map<TaggedGeometryPart, number>();
  parts.forEach((p, idx) => partToIdx.set(p, idx));

  const islands: UvIslandMeta[] = [];
  for (let cIdx = 0; cIdx < allCharts.length; cIdx++) {
    const ch = allCharts[cIdx];
    const pb = placementByChart.get(cIdx);
    if (!pb) continue;
    const pIdx = partToIdx.get(ch.part) ?? 0;
    const triOffset = partTriGlobalStart[pIdx];
    const islandId = islands.length;
    const globalTris: number[] = [];

    for (let tiIdx = 0; tiIdx < ch.triIndices.length; tiIdx++) {
      const localTriIdx = ch.triIndices[tiIdx];
      const globalTriIdx = triOffset + localTriIdx;
      globalTris.push(globalTriIdx);
      triIslandIdsList[globalTriIdx] = islandId;

      for (let k = 0; k < 3; k++) {
        const uNorm = (ch.rawUs[tiIdx * 3 + k] - ch.minU) / ch.spanU;
        const vNorm = (ch.rawVs[tiIdx * 3 + k] - ch.minV) / ch.spanV;
        let pxU: number;
        let pxV: number;
        if (pb.rotated90) {
          pxU = pb.contentX + vNorm * pb.contentW;
          pxV = pb.contentY + (1 - uNorm) * pb.contentH;
        } else {
          pxU = pb.contentX + uNorm * pb.contentW;
          pxV = pb.contentY + vNorm * pb.contentH;
        }
        const vertIdx = globalTriIdx * 3 + k;
        outUvs[vertIdx * 2 + 0] = pxU / chosenW;
        outUvs[vertIdx * 2 + 1] = pxV / chosenH;
      }
    }

    islands.push({
      id: islandId,
      partTag: ch.part.partTag,
      materialKind: ch.part.materialKind,
      baseHex: ch.part.baseHex,
      accentHex: ch.part.accentHex,
      landmarkKind: ch.landmarkKind,
      axisTag: ch.axisTag,
      lockVertical: ch.lockVertical,
      rotated90: pb.rotated90,
      pxBounds: { x: pb.x, y: pb.y, w: pb.w, h: pb.h },
      contentPxBounds: { x: pb.contentX, y: pb.contentY, w: pb.contentW, h: pb.contentH },
      uvBounds: {
        u0: pb.x / chosenW,
        v0: pb.y / chosenH,
        u1: (pb.x + pb.w) / chosenW,
        v1: (pb.y + pb.h) / chosenH,
      },
      texelsPerMeter: ppm,
      triIndices: globalTris,
    });
  }

  // Assign safe fallback inside island 0 center for any tiny degenerate tris that were skipped
  if (islands.length > 0) {
    const first = islands[0];
    const fu = (first.contentPxBounds.x + first.contentPxBounds.w * 0.5) / chosenW;
    const fv = (first.contentPxBounds.y + first.contentPxBounds.h * 0.5) / chosenH;
    for (let t = 0; t < triIslandIdsList.length; t++) {
      if (triIslandIdsList[t] >= 0) continue;
      for (let k = 0; k < 3; k++) {
        outUvs[(t * 3 + k) * 2] = fu;
        outUvs[(t * 3 + k) * 2 + 1] = fv;
      }
    }
  }

  const outGeo = new THREE.BufferGeometry();
  outGeo.setAttribute('position', new THREE.Float32BufferAttribute(outPositions, 3));
  outGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outNormals, 3));
  outGeo.setAttribute('color', new THREE.Float32BufferAttribute(outColors, 3));
  outGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outUvs, 2));
  outGeo.computeBoundingBox();
  outGeo.computeBoundingSphere();

  if (options.computeTangents !== false) {
    computeGeometryTangents(outGeo);
  }

  outGeo.userData = {
    ...outGeo.userData,
    texWidth: chosenW,
    texHeight: chosenH,
    texelsPerMeter: ppm,
    islandCount: islands.length,
  };

  return {
    geometry: outGeo,
    texWidth: chosenW,
    texHeight: chosenH,
    texelsPerMeter: ppm,
    paddingPx,
    islands,
    triIslandIds: Int32Array.from(triIslandIdsList),
  };
}

// ---------------------------------------------------------------------------
// UV Overlap & Quality Inspection (adapted from topotopo uvoverlap + img2blockbench)
// ---------------------------------------------------------------------------

const COLLAPSED_Q = 1e-9;
const OVERLAP_REL = 1e-7;

function triIntersectionArea2D(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let poly: number[] = [a[0], a[1], a[2], a[3], a[4], a[5]];
  for (let e = 0; e < 3 && poly.length >= 6; e++) {
    const ax = b[e * 2],
      ay = b[e * 2 + 1],
      bx = b[((e + 1) % 3) * 2],
      by = b[((e + 1) % 3) * 2 + 1];
    const out: number[] = [];
    const n = poly.length / 2;
    for (let i = 0; i < n; i++) {
      const cx = poly[i * 2],
        cy = poly[i * 2 + 1],
        dx = poly[((i + 1) % n) * 2],
        dy = poly[((i + 1) % n) * 2 + 1];
      const sc = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      const sd = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax);
      if (sc >= 0) out.push(cx, cy);
      if ((sc >= 0) !== (sd >= 0)) {
        const t = sc / (sc - sd);
        out.push(cx + (dx - cx) * t, cy + (dy - cy) * t);
      }
    }
    poly = out;
  }
  if (poly.length < 6) return 0;
  let s = 0;
  for (let i = 0, n = poly.length / 2; i < n; i++) {
    const j = (i + 1) % n;
    s += poly[i * 2] * poly[j * 2 + 1] - poly[j * 2] * poly[i * 2 + 1];
  }
  return Math.abs(s) / 2;
}

function uvTriangleAreas(U: Float64Array, nt: number): { ok: Uint8Array; signed: Float64Array } {
  const ok = new Uint8Array(nt),
    signed = new Float64Array(nt);
  for (let t = 0; t < nt; t++) {
    const o6 = t * 6;
    let finite = true;
    for (let k = 0; k < 6; k++) if (!Number.isFinite(U[o6 + k])) finite = false;
    if (!finite) continue;
    const du1 = U[o6 + 2] - U[o6],
      dv1 = U[o6 + 3] - U[o6 + 1],
      du2 = U[o6 + 4] - U[o6],
      dv2 = U[o6 + 5] - U[o6 + 1];
    const cr = du1 * dv2 - du2 * dv1;
    const e2 =
      du1 * du1 + dv1 * dv1 + du2 * du2 + dv2 * dv2 + (du2 - du1) ** 2 + (dv2 - dv1) ** 2;
    if (!(Math.abs(cr) > COLLAPSED_Q * e2)) continue;
    ok[t] = 1;
    signed[t] = cr / 2;
  }
  return { ok, signed };
}

function uvOverlapPairs(
  U: Float64Array,
  valid: number[],
  signed: Float64Array,
  onPair: (ta: number, tb: number, area: number) => void,
  opts: { maxTests?: number } = {}
): void {
  const nv = valid.length;
  if (nv < 2) return;
  const maxTests = opts.maxTests ?? 2_000_000;
  let minU = Infinity,
    minV = Infinity,
    maxU = -Infinity,
    maxV = -Infinity;
  for (const t of valid) {
    for (let k = 0; k < 3; k++) {
      const u = U[t * 6 + k * 2],
        v = U[t * 6 + k * 2 + 1];
      if (u < minU) minU = u;
      if (u > maxU) maxU = u;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
  }
  const nt = U.length / 6;
  const ccw = new Float64Array(nt * 6);
  const bb = new Float64Array(nt * 4);
  for (const t of valid) {
    const o6 = t * 6;
    if (signed[t] > 0) {
      for (let k = 0; k < 6; k++) ccw[o6 + k] = U[o6 + k];
    } else {
      ccw[o6] = U[o6];
      ccw[o6 + 1] = U[o6 + 1];
      ccw[o6 + 2] = U[o6 + 4];
      ccw[o6 + 3] = U[o6 + 5];
      ccw[o6 + 4] = U[o6 + 2];
      ccw[o6 + 5] = U[o6 + 3];
    }
    bb[t * 4] = Math.min(U[o6], U[o6 + 2], U[o6 + 4]);
    bb[t * 4 + 1] = Math.min(U[o6 + 1], U[o6 + 3], U[o6 + 5]);
    bb[t * 4 + 2] = Math.max(U[o6], U[o6 + 2], U[o6 + 4]);
    bb[t * 4 + 3] = Math.max(U[o6 + 1], U[o6 + 3], U[o6 + 5]);
  }
  const span = Math.max(maxU - minU, maxV - minV, 1e-12);
  const cells = Math.max(1, Math.min(256, Math.ceil(Math.sqrt(nv / 2))));
  const cs = span / cells;
  const nx = Math.max(1, Math.min(256, Math.ceil((maxU - minU) / cs) || 1));
  const ny = Math.max(1, Math.min(256, Math.ceil((maxV - minV) / cs) || 1));
  const cellOf = (u: number, n: number, lo: number) =>
    Math.max(0, Math.min(n - 1, Math.floor((u - lo) / cs)));

  const counts = new Int32Array(nx * ny + 1);
  for (const t of valid) {
    for (let y = cellOf(bb[t * 4 + 1], ny, minV); y <= cellOf(bb[t * 4 + 3], ny, minV); y++) {
      for (let x = cellOf(bb[t * 4], nx, minU); x <= cellOf(bb[t * 4 + 2], nx, minU); x++) {
        counts[y * nx + x + 1]++;
      }
    }
  }
  for (let i = 0; i < nx * ny; i++) counts[i + 1] += counts[i];
  const items = new Int32Array(counts[nx * ny]);
  const fill = counts.slice(0, nx * ny);
  for (const t of valid) {
    for (let y = cellOf(bb[t * 4 + 1], ny, minV); y <= cellOf(bb[t * 4 + 3], ny, minV); y++) {
      for (let x = cellOf(bb[t * 4], nx, minU); x <= cellOf(bb[t * 4 + 2], nx, minU); x++) {
        items[fill[y * nx + x]++] = t;
      }
    }
  }

  let tested = 0;
  for (let c = 0; c < nx * ny; c++) {
    const s = counts[c],
      e = counts[c + 1],
      cx = c % nx,
      cy = Math.floor(c / nx);
    for (let i = s; i < e; i++) {
      for (let j = i + 1; j < e; j++) {
        if (tested >= maxTests) return;
        const ta = items[i],
          tb = items[j];
        const lu = Math.max(bb[ta * 4], bb[tb * 4]);
        const lv = Math.max(bb[ta * 4 + 1], bb[tb * 4 + 1]);
        if (lu >= Math.min(bb[ta * 4 + 2], bb[tb * 4 + 2]) || lv >= Math.min(bb[ta * 4 + 3], bb[tb * 4 + 3])) {
          continue;
        }
        if (cellOf(lu, nx, minU) !== cx || cellOf(lv, ny, minV) !== cy) continue;
        tested++;
        const t0 = Math.min(ta, tb),
          t1 = Math.max(ta, tb);
        const area = triIntersectionArea2D(
          ccw.subarray(t0 * 6, t0 * 6 + 6),
          ccw.subarray(t1 * 6, t1 * 6 + 6)
        );
        if (area > OVERLAP_REL * Math.min(Math.abs(signed[t0]), Math.abs(signed[t1]))) {
          onPair(t0, t1, area);
        }
      }
    }
  }
}

const FLAT_DETAIL_NAME_RE = /(?:eye|pupil|glint|nostril|brow|stripe|faceband|crack)/i;

export function detectFlatDetailCuboids(root?: THREE.Object3D): string[] {
  if (!root) return [];
  const hits: string[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && FLAT_DETAIL_NAME_RE.test(obj.name)) {
      hits.push(obj.name);
    }
  });
  return hits;
}

export function inspectGeometryUvs(
  geo: THREE.BufferGeometry,
  targetTexelsPerMeter: number,
  texWidth: number,
  texHeight: number,
  options: {
    partTagByTri?: (triIdx: number) => string;
    flatCheckRoot?: THREE.Object3D;
    densityTolerance?: number;
  } = {}
): UvDiagnosticsReport {
  const tol = options.densityTolerance ?? 0.15;
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  const idx = geo.getIndex();
  const nt = pos ? (idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3)) : 0;

  const U = new Float64Array(nt * 6);
  let nonFiniteTriangles = 0;
  let collapsedTriangles = 0;
  let outOfTileTriangles = 0;

  const densities: number[] = [];
  const uvDensityOutliers: UvDensityOutlier[] = [];
  let minDensity = Infinity;
  let maxDensity = 0;
  let uvAreaSum = 0;

  if (pos && uv) {
    for (let t = 0; t < nt; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3;
      const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      const u0 = uv.getX(i0),
        v0 = uv.getY(i0);
      const u1 = uv.getX(i1),
        v1 = uv.getY(i1);
      const u2 = uv.getX(i2),
        v2 = uv.getY(i2);
      const o6 = t * 6;
      U[o6] = u0;
      U[o6 + 1] = v0;
      U[o6 + 2] = u1;
      U[o6 + 3] = v1;
      U[o6 + 4] = u2;
      U[o6 + 5] = v2;

      if (![u0, v0, u1, v1, u2, v2].every(Number.isFinite)) {
        nonFiniteTriangles++;
        continue;
      }
      if (
        u0 < -1e-4 ||
        u0 > 1 + 1e-4 ||
        v0 < -1e-4 ||
        v0 > 1 + 1e-4 ||
        u1 < -1e-4 ||
        u1 > 1 + 1e-4 ||
        v1 < -1e-4 ||
        v1 > 1 + 1e-4 ||
        u2 < -1e-4 ||
        u2 > 1 + 1e-4 ||
        v2 < -1e-4 ||
        v2 > 1 + 1e-4
      ) {
        outOfTileTriangles++;
      }

      const du1 = u1 - u0,
        dv1 = v1 - v0,
        du2 = u2 - u0,
        dv2 = v2 - v0;
      const cr = du1 * dv2 - du2 * dv1;
      const e2 = du1 * du1 + dv1 * dv1 + du2 * du2 + dv2 * dv2 + (du2 - du1) ** 2 + (dv2 - dv1) ** 2;
      if (!(Math.abs(cr) > COLLAPSED_Q * e2)) {
        collapsedTriangles++;
        continue;
      }
      const triUvArea = Math.abs(cr) * 0.5;
      uvAreaSum += triUvArea;

      // 3D surface area for texel density metric
      const ax = pos.getX(i1) - pos.getX(i0),
        ay = pos.getY(i1) - pos.getY(i0),
        az = pos.getZ(i1) - pos.getZ(i0);
      const bx = pos.getX(i2) - pos.getX(i0),
        by = pos.getY(i2) - pos.getY(i0),
        bz = pos.getZ(i2) - pos.getZ(i0);
      const area3D =
        0.5 * Math.hypot(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
      if (area3D >= 2e-6) {
        const triPpm = Math.sqrt((triUvArea * texWidth * texHeight) / area3D);
        densities.push(triPpm);
        if (triPpm < minDensity) minDensity = triPpm;
        if (triPpm > maxDensity) maxDensity = triPpm;
        const ratio = triPpm / targetTexelsPerMeter;
        if (Math.abs(ratio - 1) > tol) {
          uvDensityOutliers.push({
            triIndex: t,
            partTag: options.partTagByTri ? options.partTagByTri(t) : 'mesh',
            density: Number(triPpm.toFixed(2)),
            ratioToTarget: Number(ratio.toFixed(3)),
          });
        }
      }
    }
  }

  const { ok, signed } = uvTriangleAreas(U, nt);
  const valid: number[] = [];
  for (let t = 0; t < nt; t++) if (ok[t]) valid.push(t);

  let overlapPairs = 0;
  let overlapArea = 0;
  const overlapExamples: UvOverlapExample[] = [];
  uvOverlapPairs(U, valid, signed, (t0, t1, area) => {
    overlapPairs++;
    overlapArea += area;
    if (overlapExamples.length < 10) {
      overlapExamples.push({
        triA: t0,
        triB: t1,
        area,
        partA: options.partTagByTri ? options.partTagByTri(t0) : 'mesh',
        partB: options.partTagByTri ? options.partTagByTri(t1) : 'mesh',
      });
    }
  });

  densities.sort((a, b) => a - b);
  const medianTexelsPerMeter =
    densities.length > 0 ? densities[Math.floor(densities.length / 2)] : 0;

  return {
    triangleCount: nt,
    nonFiniteTriangles,
    collapsedTriangles,
    outOfTileTriangles,
    overlapPairs,
    overlapArea,
    utilization: uvAreaSum,
    texWidth,
    texHeight,
    targetTexelsPerMeter,
    medianTexelsPerMeter: Number(medianTexelsPerMeter.toFixed(2)),
    minTexelsPerMeter: densities.length > 0 ? Number(minDensity.toFixed(2)) : 0,
    maxTexelsPerMeter: densities.length > 0 ? Number(maxDensity.toFixed(2)) : 0,
    uvDensityOutliers,
    flatDetailCuboids: detectFlatDetailCuboids(options.flatCheckRoot),
    overlapExamples,
  };
}
