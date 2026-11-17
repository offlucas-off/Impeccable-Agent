import * as THREE from 'three';
import type { UvIslandMeta } from './PixelUvUnwrapper';

// ---------------------------------------------------------------------------
// 4A. Pure-TS Median-Split Triangle BVH + Fibonacci Vertex AO + Anti-Fangs
// ---------------------------------------------------------------------------

interface BvhNode {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  left: number;
  right: number;
  start: number;
  count: number;
}

class TriBvh {
  private triMinX: Float32Array;
  private triMinY: Float32Array;
  private triMinZ: Float32Array;
  private triMaxX: Float32Array;
  private triMaxY: Float32Array;
  private triMaxZ: Float32Array;
  private triCentX: Float32Array;
  private triCentY: Float32Array;
  private triCentZ: Float32Array;
  private triVerts: Float32Array;
  private triNormals: Float32Array;
  private indices: Int32Array;
  private nodes: BvhNode[] = [];
  public readonly triCount: number;

  constructor(posAttr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, indexAttr: THREE.BufferAttribute | null) {
    const nt = indexAttr ? Math.floor(indexAttr.count / 3) : Math.floor(posAttr.count / 3);
    this.triCount = nt;
    this.triMinX = new Float32Array(nt);
    this.triMinY = new Float32Array(nt);
    this.triMinZ = new Float32Array(nt);
    this.triMaxX = new Float32Array(nt);
    this.triMaxY = new Float32Array(nt);
    this.triMaxZ = new Float32Array(nt);
    this.triCentX = new Float32Array(nt);
    this.triCentY = new Float32Array(nt);
    this.triCentZ = new Float32Array(nt);
    this.triVerts = new Float32Array(nt * 9);
    this.triNormals = new Float32Array(nt * 3);
    this.indices = new Int32Array(nt);

    for (let t = 0; t < nt; t++) {
      this.indices[t] = t;
      const i0 = indexAttr ? indexAttr.getX(t * 3) : t * 3;
      const i1 = indexAttr ? indexAttr.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = indexAttr ? indexAttr.getX(t * 3 + 2) : t * 3 + 2;

      const ax = posAttr.getX(i0),
        ay = posAttr.getY(i0),
        az = posAttr.getZ(i0);
      const bx = posAttr.getX(i1),
        by = posAttr.getY(i1),
        bz = posAttr.getZ(i1);
      const cx = posAttr.getX(i2),
        cy = posAttr.getY(i2),
        cz = posAttr.getZ(i2);

      const o9 = t * 9;
      this.triVerts[o9 + 0] = ax;
      this.triVerts[o9 + 1] = ay;
      this.triVerts[o9 + 2] = az;
      this.triVerts[o9 + 3] = bx;
      this.triVerts[o9 + 4] = by;
      this.triVerts[o9 + 5] = bz;
      this.triVerts[o9 + 6] = cx;
      this.triVerts[o9 + 7] = cy;
      this.triVerts[o9 + 8] = cz;

      this.triMinX[t] = Math.min(ax, bx, cx);
      this.triMinY[t] = Math.min(ay, by, cy);
      this.triMinZ[t] = Math.min(az, bz, cz);
      this.triMaxX[t] = Math.max(ax, bx, cx);
      this.triMaxY[t] = Math.max(ay, by, cy);
      this.triMaxZ[t] = Math.max(az, bz, cz);
      this.triCentX[t] = (ax + bx + cx) / 3;
      this.triCentY[t] = (ay + by + cy) / 3;
      this.triCentZ[t] = (az + bz + cz) / 3;

      const e1x = bx - ax,
        e1y = by - ay,
        e1z = bz - az;
      const e2x = cx - ax,
        e2y = cy - ay,
        e2z = cz - az;
      const nx = e1y * e2z - e1z * e2y;
      const ny = e1z * e2x - e1x * e2z;
      const nz = e1x * e2y - e1y * e2x;
      const l = Math.hypot(nx, ny, nz);
      this.triNormals[t * 3 + 0] = l > 1e-10 ? nx / l : 0;
      this.triNormals[t * 3 + 1] = l > 1e-10 ? ny / l : 1;
      this.triNormals[t * 3 + 2] = l > 1e-10 ? nz / l : 0;
    }

    if (nt > 0) {
      this.buildNode(0, nt);
    }
  }

  private buildNode(start: number, count: number): number {
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity,
      maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;
    let cMinX = Infinity,
      cMinY = Infinity,
      cMinZ = Infinity,
      cMaxX = -Infinity,
      cMaxY = -Infinity,
      cMaxZ = -Infinity;

    for (let i = start; i < start + count; i++) {
      const t = this.indices[i];
      if (this.triMinX[t] < minX) minX = this.triMinX[t];
      if (this.triMinY[t] < minY) minY = this.triMinY[t];
      if (this.triMinZ[t] < minZ) minZ = this.triMinZ[t];
      if (this.triMaxX[t] > maxX) maxX = this.triMaxX[t];
      if (this.triMaxY[t] > maxY) maxY = this.triMaxY[t];
      if (this.triMaxZ[t] > maxZ) maxZ = this.triMaxZ[t];

      const cx = this.triCentX[t],
        cy = this.triCentY[t],
        cz = this.triCentZ[t];
      if (cx < cMinX) cMinX = cx;
      if (cx > cMaxX) cMaxX = cx;
      if (cy < cMinY) cMinY = cy;
      if (cy > cMaxY) cMaxY = cy;
      if (cz < cMinZ) cMinZ = cz;
      if (cz > cMaxZ) cMaxZ = cz;
    }

    const nodeIdx = this.nodes.length;
    this.nodes.push({
      minX,
      minY,
      minZ,
      maxX,
      maxY,
      maxZ,
      left: -1,
      right: -1,
      start,
      count,
    });

    if (count <= 6) return nodeIdx;

    const sx = cMaxX - cMinX,
      sy = cMaxY - cMinY,
      sz = cMaxZ - cMinZ;
    const centArr = sx >= sy && sx >= sz ? this.triCentX : sy >= sz ? this.triCentY : this.triCentZ;
    const splitVal =
      sx >= sy && sx >= sz ? (cMinX + cMaxX) * 0.5 : sy >= sz ? (cMinY + cMaxY) * 0.5 : (cMinZ + cMaxZ) * 0.5;

    // In-place Hoare partition around centroid midpoint
    let i = start;
    let j = start + count - 1;
    while (i <= j) {
      while (i <= j && centArr[this.indices[i]] <= splitVal) i++;
      while (i <= j && centArr[this.indices[j]] > splitVal) j--;
      if (i < j) {
        const tmp = this.indices[i];
        this.indices[i] = this.indices[j];
        this.indices[j] = tmp;
        i++;
        j--;
      }
    }

    let leftCount = i - start;
    if (leftCount === 0 || leftCount === count) {
      leftCount = count >> 1;
    }

    const leftIdx = this.buildNode(start, leftCount);
    const rightIdx = this.buildNode(start + leftCount, count - leftCount);
    this.nodes[nodeIdx].left = leftIdx;
    this.nodes[nodeIdx].right = rightIdx;
    return nodeIdx;
  }

  public raycastClosest(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    minDist: number,
    maxDist: number
  ): { hit: boolean; dist: number; isBackface: boolean } {
    if (this.nodes.length === 0) return { hit: false, dist: maxDist, isBackface: false };

    const invX = Math.abs(dx) > 1e-10 ? 1 / dx : 1e10;
    const invY = Math.abs(dy) > 1e-10 ? 1 / dy : 1e10;
    const invZ = Math.abs(dz) > 1e-10 ? 1 / dz : 1e10;

    let bestDist = maxDist;
    let bestBackface = false;
    let hit = false;

    const stack = [0];
    while (stack.length > 0) {
      const ni = stack.pop()!;
      const node = this.nodes[ni];

      // Slab AABB intersection
      const tx1 = (node.minX - ox) * invX,
        tx2 = (node.maxX - ox) * invX;
      let tmin = Math.min(tx1, tx2),
        tmax = Math.max(tx1, tx2);
      const ty1 = (node.minY - oy) * invY,
        ty2 = (node.maxY - oy) * invY;
      tmin = Math.max(tmin, Math.min(ty1, ty2));
      tmax = Math.min(tmax, Math.max(ty1, ty2));
      const tz1 = (node.minZ - oz) * invZ,
        tz2 = (node.maxZ - oz) * invZ;
      tmin = Math.max(tmin, Math.min(tz1, tz2));
      tmax = Math.min(tmax, Math.max(tz1, tz2));

      if (tmax < Math.max(0, tmin) || tmin > bestDist) continue;

      if (node.left < 0) {
        // Leaf triangles (Möller–Trumbore)
        for (let i = node.start; i < node.start + node.count; i++) {
          const t = this.indices[i];
          const o9 = t * 9;
          const ax = this.triVerts[o9],
            ay = this.triVerts[o9 + 1],
            az = this.triVerts[o9 + 2];
          const e1x = this.triVerts[o9 + 3] - ax,
            e1y = this.triVerts[o9 + 4] - ay,
            e1z = this.triVerts[o9 + 5] - az;
          const e2x = this.triVerts[o9 + 6] - ax,
            e2y = this.triVerts[o9 + 7] - ay,
            e2z = this.triVerts[o9 + 8] - az;

          const hx = dy * e2z - dz * e2y;
          const hy = dz * e2x - dx * e2z;
          const hz = dx * e2y - dy * e2x;
          const det = e1x * hx + e1y * hy + e1z * hz;
          if (Math.abs(det) < 1e-10) continue;

          const invDet = 1 / det;
          const sx = ox - ax,
            sy = oy - ay,
            sz = oz - az;
          const u = (sx * hx + sy * hy + sz * hz) * invDet;
          if (u < -1e-4 || u > 1 + 1e-4) continue;

          const qx = sy * e1z - sz * e1y;
          const qy = sz * e1x - sx * e1z;
          const qz = sx * e1y - sy * e1x;
          const v = (dx * qx + dy * qy + dz * qz) * invDet;
          if (v < -1e-4 || u + v > 1 + 1e-4) continue;

          const dist = (e2x * qx + e2y * qy + e2z * qz) * invDet;
          if (dist >= minDist && dist < bestDist) {
            bestDist = dist;
            const nDot =
              this.triNormals[t * 3] * dx +
              this.triNormals[t * 3 + 1] * dy +
              this.triNormals[t * 3 + 2] * dz;
            bestBackface = nDot > 0.01;
            hit = true;
          }
        }
      } else {
        stack.push(node.left, node.right);
      }
    }

    return { hit, dist: bestDist, isBackface: bestBackface };
  }
}

export interface VertexAoOptions {
  /** Number of cosine-weighted Fibonacci hemisphere rays per welded vertex (default 16). */
  rays?: number;
  /** Occlusion reach radius in meters (default 0.65). */
  maxDist?: number;
  /** AO darkening strength [0..1] (default 0.52). */
  strength?: number;
  /** Boost subtle bright rim on convex bevels / darken seams (default 0.06). */
  creaseBoost?: number;
  /** Enable anti-fang buried vertex healing (default true). */
  healBuriedFangs?: boolean;
}

const FIB_DIRS_CACHE = new Map<number, Float32Array>();

function getCosineFibonacciSamples(n: number): Float32Array {
  const cached = FIB_DIRS_CACHE.get(n);
  if (cached) return cached;
  const out = new Float32Array(n * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const z = Math.sqrt(1 - (i + 0.5) / n);
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const phi = goldenAngle * i;
    out[i * 3 + 0] = Math.cos(phi) * r;
    out[i * 3 + 1] = Math.sin(phi) * r;
    out[i * 3 + 2] = z; // local +N aligned axis
  }
  FIB_DIRS_CACHE.set(n, out);
  return out;
}

/**
 * Bakes fast pure-TS BVH hemisphere ambient occlusion + dihedral crease contrast directly
 * onto `geometry.attributes.color`. Non-destructive: preserves base colors in `userData._preAoColor`
 * so repeated Studio slider updates re-evaluate AO cleanly without compounding dark stains.
 */
export function bakeVertexAoAndCreases(
  geo: THREE.BufferGeometry,
  options: VertexAoOptions = {}
): THREE.BufferGeometry {
  const rays = Math.max(6, Math.min(64, Math.round(options.rays ?? 16)));
  const maxDist = Math.max(0.1, options.maxDist ?? 0.65);
  const strength = Math.max(0, Math.min(1, options.strength ?? 0.52));
  const creaseBoost = Math.max(0, Math.min(0.2, options.creaseBoost ?? 0.05));
  const healBuried = options.healBuriedFangs ?? true;

  const pos = geo.getAttribute('position');
  if (!pos || pos.count === 0) return geo;
  if (!geo.getAttribute('normal')) geo.computeVertexNormals();
  const norm = geo.getAttribute('normal');
  const idx = geo.getIndex();
  const count = pos.count;

  let colAttr = geo.getAttribute('color') as THREE.BufferAttribute | undefined;
  if (!colAttr) {
    const white = new Float32Array(count * 3).fill(1);
    colAttr = new THREE.Float32BufferAttribute(white, 3);
    geo.setAttribute('color', colAttr);
  }

  // Save clean unbaked color once so Studio AO intensity changes remain reversible
  let baseColors = geo.userData._preAoColor as Float32Array | undefined;
  if (!baseColors || baseColors.length !== count * 3) {
    baseColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      baseColors[i * 3 + 0] = colAttr.getX(i);
      baseColors[i * 3 + 1] = colAttr.getY(i);
      baseColors[i * 3 + 2] = colAttr.getZ(i);
    }
    geo.userData._preAoColor = baseColors;
  }

  if (strength <= 1e-4 && creaseBoost <= 1e-4) {
    for (let i = 0; i < count; i++) {
      colAttr.setXYZ(i, baseColors[i * 3], baseColors[i * 3 + 1], baseColors[i * 3 + 2]);
    }
    colAttr.needsUpdate = true;
    return geo;
  }

  const bvh = new TriBvh(pos, idx);
  if (bvh.triCount === 0) return geo;

  // 1) Weld vertices sharing quantized spatial position for fast shared AO + spatial neighbor graph
  const q = (v: number) => Math.round(v * 2000);
  const posKeyToVerts = new Map<string, number[]>();
  const vertPosKey = new Array<string>(count);
  const aoKeyToVerts = new Map<string, number[]>();

  for (let i = 0; i < count; i++) {
    const pk = `${q(pos.getX(i))},${q(pos.getY(i))},${q(pos.getZ(i))}`;
    vertPosKey[i] = pk;
    let pList = posKeyToVerts.get(pk);
    if (!pList) {
      pList = [];
      posKeyToVerts.set(pk, pList);
    }
    pList.push(i);

    const nq = (v: number) => Math.round(v * 50);
    const ak = `${pk}|${nq(norm.getX(i))},${nq(norm.getY(i))},${nq(norm.getZ(i))}`;
    let aList = aoKeyToVerts.get(ak);
    if (!aList) {
      aList = [];
      aoKeyToVerts.set(ak, aList);
    }
    aList.push(i);
  }

  // Build spatial edge adjacency across position keys for anti-fang BFS & crease measurement
  const adjPosKeys = new Map<string, Set<string>>();
  const addEdge = (aKey: string, bKey: string) => {
    if (aKey === bKey) return;
    let sa = adjPosKeys.get(aKey);
    if (!sa) {
      sa = new Set();
      adjPosKeys.set(aKey, sa);
    }
    sa.add(bKey);
  };
  const nt = idx ? Math.floor(idx.count / 3) : Math.floor(count / 3);
  for (let t = 0; t < nt; t++) {
    const i0 = idx ? idx.getX(t * 3) : t * 3;
    const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    const k0 = vertPosKey[i0],
      k1 = vertPosKey[i1],
      k2 = vertPosKey[i2];
    addEdge(k0, k1);
    addEdge(k1, k0);
    addEdge(k1, k2);
    addEdge(k2, k1);
    addEdge(k2, k0);
    addEdge(k0, k2);
  }

  // 2) Dihedral crease modulation per unique position key (convex ridges catch light, concave creases darken)
  const creaseFactorByPosKey = new Map<string, number>();
  for (const [pk, pVerts] of posKeyToVerts) {
    // Check max angle spread among welded face normals at same vertex
    const n0x = norm.getX(pVerts[0]),
      n0y = norm.getY(pVerts[0]),
      n0z = norm.getZ(pVerts[0]);
    let minDot = 1;
    for (let k = 1; k < pVerts.length; k++) {
      const d =
        n0x * norm.getX(pVerts[k]) + n0y * norm.getY(pVerts[k]) + n0z * norm.getZ(pVerts[k]);
      if (d < minDot) minDot = d;
    }
    // Convex corner/bevel vertices meet normals at ~45..90 deg (minDot in [0..0.75])
    if (minDot < 0.82 && minDot > -0.2) {
      creaseFactorByPosKey.set(pk, 1.0 + creaseBoost * 0.75);
    } else {
      creaseFactorByPosKey.set(pk, 1.0);
    }
  }

  // 3) Evaluate cosine-weighted Fibonacci hemisphere occlusion + vertexBuried anti-fang detection
  const fibSamples = getCosineFibonacciSamples(rays);
  const aoByVert = new Float32Array(count).fill(1);
  const buriedByVert = new Uint8Array(count);

  const probeOffsets: [number, number, number][] = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  for (const verts of aoKeyToVerts.values()) {
    const rep = verts[0];
    const px = pos.getX(rep),
      py = pos.getY(rep),
      pz = pos.getZ(rep);
    let nx = norm.getX(rep),
      ny = norm.getY(rep),
      nz = norm.getZ(rep);
    const nLen = Math.hypot(nx, ny, nz);
    if (nLen < 1e-6) {
      nx = 0;
      ny = 1;
      nz = 0;
    } else {
      nx /= nLen;
      ny /= nLen;
      nz /= nLen;
    }

    // Check if vertex is embedded inside another solid sub-part (`vertexBuried` from avao)
    let isBuried = false;
    if (healBuried) {
      let backCount = 0;
      for (const d of probeOffsets) {
        const res = bvh.raycastClosest(
          px + nx * 0.002,
          py + ny * 0.002,
          pz + nz * 0.002,
          d[0],
          d[1],
          d[2],
          0.0025,
          0.2
        );
        if (res.hit && res.isBackface) backCount++;
      }
      if (backCount >= 4) isBuried = true;
    }

    if (isBuried) {
      for (const vi of verts) {
        buriedByVert[vi] = 1;
        aoByVert[vi] = 0.72;
      }
      continue;
    }

    // Orthonormal tangent basis around N
    const refX = Math.abs(ny) < 0.9 ? 0 : 1;
    const refY = Math.abs(ny) < 0.9 ? 1 : 0;
    let tx = refY * nz - 0 * ny;
    let ty = 0 * nx - refX * nz;
    let tz = refX * ny - refY * nx;
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl;
    ty /= tl;
    tz /= tl;
    const bx = ny * tz - nz * ty;
    const by = nz * tx - nx * tz;
    const bz = nx * ty - ny * tx;

    const ox = px + nx * 0.0035;
    const oy = py + ny * 0.0035;
    const oz = pz + nz * 0.0035;

    let occlusionSum = 0;
    for (let r = 0; r < rays; r++) {
      const lx = fibSamples[r * 3 + 0];
      const ly = fibSamples[r * 3 + 1];
      const lz = fibSamples[r * 3 + 2];
      const dx = tx * lx + bx * ly + nx * lz;
      const dy = ty * lx + by * ly + ny * lz;
      const dz = tz * lx + bz * ly + nz * lz;

      const hit = bvh.raycastClosest(ox, oy, oz, dx, dy, dz, 0.002, maxDist);
      if (hit.hit && !hit.isBackface) {
        const atten = 1 - hit.dist / maxDist;
        occlusionSum += atten * atten;
      }
    }

    const occRatio = Math.min(1, occlusionSum / rays);
    const ao = Math.max(0.38, Math.min(1.0, 1 - occRatio * strength));
    for (const vi of verts) {
      aoByVert[vi] = ao;
    }
  }

  // 4) `fillBuriedAo`: flood-fill buried vertices from non-buried exposed neighbors (prevents black "fangs")
  if (healBuried) {
    const posKeyAo = new Map<string, number>();
    const posKeyBuried = new Map<string, boolean>();
    for (const [pk, pVerts] of posKeyToVerts) {
      let sum = 0;
      let nonBuriedCnt = 0;
      for (const vi of pVerts) {
        if (!buriedByVert[vi]) {
          sum += aoByVert[vi];
          nonBuriedCnt++;
        }
      }
      if (nonBuriedCnt > 0) {
        posKeyAo.set(pk, sum / nonBuriedCnt);
        posKeyBuried.set(pk, false);
      } else {
        posKeyAo.set(pk, 0.72);
        posKeyBuried.set(pk, true);
      }
    }

    for (let pass = 0; pass < 3; pass++) {
      for (const [pk, isB] of posKeyBuried) {
        if (!isB) continue;
        const nbs = adjPosKeys.get(pk);
        if (!nbs || nbs.size === 0) continue;
        let nbSum = 0;
        let nbValid = 0;
        for (const nbk of nbs) {
          if (!posKeyBuried.get(nbk)) {
            nbSum += posKeyAo.get(nbk) ?? 0.78;
            nbValid++;
          }
        }
        if (nbValid > 0) {
          posKeyAo.set(pk, Math.max(0.58, nbSum / nbValid));
          posKeyBuried.set(pk, false);
        }
      }
    }

    for (let i = 0; i < count; i++) {
      if (buriedByVert[i]) {
        aoByVert[i] = posKeyAo.get(vertPosKey[i]) ?? 0.72;
      }
    }
  }

  // 5) Write final AO * crease * baseColor safely clamped to valid linear range [0.35..1.07]
  for (let i = 0; i < count; i++) {
    const creaseMul = creaseFactorByPosKey.get(vertPosKey[i]) ?? 1.0;
    const mul = Math.max(0.35, Math.min(1.07, aoByVert[i] * creaseMul));
    const r = Math.min(1, Math.max(0, baseColors[i * 3 + 0] * mul));
    const g = Math.min(1, Math.max(0, baseColors[i * 3 + 1] * mul));
    const b = Math.min(1, Math.max(0, baseColors[i * 3 + 2] * mul));
    colAttr.setXYZ(i, r, g, b);
  }
  colAttr.needsUpdate = true;

  return geo;
}

/**
 * Adaptive triangle midpoint subdivision for static large ground/wall slabs (not for SkinnedMesh!).
 * Gives smooth vertex-AO contact shadows along floor-to-wall intersections.
 */
export function subdivideForAo(
  geo: THREE.BufferGeometry,
  maxEdgeM = 0.6,
  maxPasses = 2
): THREE.BufferGeometry {
  let curr = geo.index ? geo.toNonIndexed() : geo.clone();
  for (let pass = 0; pass < maxPasses; pass++) {
    const pos = curr.getAttribute('position');
    if (!pos) break;
    const norm = curr.getAttribute('normal');
    const uv = curr.getAttribute('uv');
    const col = curr.getAttribute('color');
    const tan = curr.getAttribute('tangent');
    const nt = Math.floor(pos.count / 3);

    let anySplit = false;
    const outPos: number[] = [];
    const outNorm: number[] = [];
    const outUv: number[] = [];
    const outCol: number[] = [];
    const outTan: number[] = [];

    const pushVertFrom = (
      iA: number,
      iB: number,
      t: number
    ) => {
      outPos.push(
        pos.getX(iA) * (1 - t) + pos.getX(iB) * t,
        pos.getY(iA) * (1 - t) + pos.getY(iB) * t,
        pos.getZ(iA) * (1 - t) + pos.getZ(iB) * t
      );
      if (norm) {
        const nx = norm.getX(iA) * (1 - t) + norm.getX(iB) * t;
        const ny = norm.getY(iA) * (1 - t) + norm.getY(iB) * t;
        const nz = norm.getZ(iA) * (1 - t) + norm.getZ(iB) * t;
        const l = Math.hypot(nx, ny, nz) || 1;
        outNorm.push(nx / l, ny / l, nz / l);
      }
      if (uv) {
        outUv.push(
          uv.getX(iA) * (1 - t) + uv.getX(iB) * t,
          uv.getY(iA) * (1 - t) + uv.getY(iB) * t
        );
      }
      if (col) {
        outCol.push(
          col.getX(iA) * (1 - t) + col.getX(iB) * t,
          col.getY(iA) * (1 - t) + col.getY(iB) * t,
          col.getZ(iA) * (1 - t) + col.getZ(iB) * t
        );
      }
      if (tan) {
        const tx = tan.getX(iA) * (1 - t) + tan.getX(iB) * t;
        const ty = tan.getY(iA) * (1 - t) + tan.getY(iB) * t;
        const tz = tan.getZ(iA) * (1 - t) + tan.getZ(iB) * t;
        const l = Math.hypot(tx, ty, tz) || 1;
        outTan.push(tx / l, ty / l, tz / l, tan.getW(iA));
      }
    };

    const emitTri = (
      a0: [number, number, number],
      a1: [number, number, number],
      a2: [number, number, number]
    ) => {
      pushVertFrom(a0[0], a0[1], a0[2]);
      pushVertFrom(a1[0], a1[1], a1[2]);
      pushVertFrom(a2[0], a2[1], a2[2]);
    };

    for (let tri = 0; tri < nt; tri++) {
      const i0 = tri * 3,
        i1 = tri * 3 + 1,
        i2 = tri * 3 + 2;
      const d01 = Math.hypot(
        pos.getX(i1) - pos.getX(i0),
        pos.getY(i1) - pos.getY(i0),
        pos.getZ(i1) - pos.getZ(i0)
      );
      const d12 = Math.hypot(
        pos.getX(i2) - pos.getX(i1),
        pos.getY(i2) - pos.getY(i1),
        pos.getZ(i2) - pos.getZ(i1)
      );
      const d20 = Math.hypot(
        pos.getX(i0) - pos.getX(i2),
        pos.getY(i0) - pos.getY(i2),
        pos.getZ(i0) - pos.getZ(i2)
      );

      if (Math.max(d01, d12, d20) <= maxEdgeM) {
        emitTri([i0, i0, 0], [i1, i1, 0], [i2, i2, 0]);
        continue;
      }

      anySplit = true;
      // Clean 1-to-4 midpoint split preserves planar UVs and normals with zero T-junctions across matched edges
      const v0: [number, number, number] = [i0, i0, 0];
      const v1: [number, number, number] = [i1, i1, 0];
      const v2: [number, number, number] = [i2, i2, 0];
      const m01: [number, number, number] = [i0, i1, 0.5];
      const m12: [number, number, number] = [i1, i2, 0.5];
      const m20: [number, number, number] = [i2, i0, 0.5];

      emitTri(v0, m01, m20);
      emitTri(m01, v1, m12);
      emitTri(m20, m12, v2);
      emitTri(m01, m12, m20);
    }

    if (!anySplit) break;

    const next = new THREE.BufferGeometry();
    next.setAttribute('position', new THREE.Float32BufferAttribute(outPos, 3));
    if (norm) next.setAttribute('normal', new THREE.Float32BufferAttribute(outNorm, 3));
    if (uv) next.setAttribute('uv', new THREE.Float32BufferAttribute(outUv, 2));
    if (col) next.setAttribute('color', new THREE.Float32BufferAttribute(outCol, 3));
    if (tan) next.setAttribute('tangent', new THREE.Float32BufferAttribute(outTan, 4));
    curr.dispose();
    curr = next;
  }
  curr.computeBoundingBox();
  curr.computeBoundingSphere();
  return curr;
}

// ---------------------------------------------------------------------------
// 4B. Texel-Space Heightfield GTAO + Curvature Wear + Vertical Grime Ramp
// ---------------------------------------------------------------------------

export interface TexelGtaoOptions {
  gtaoStrength?: number;
  gtaoRadiusPx?: number;
  curvatureStrength?: number;
  verticalGrimeStrength?: number;
}

const DIR_X = [1, -1, 0, 0, 1, -1, 1, -1];
const DIR_Y = [0, 0, 1, -1, 1, 1, -1, -1];
const DIR_INV_LEN = [1, 1, 1, 1, 0.70710678, 0.70710678, 0.70710678, 0.70710678];

/**
 * Applies horizon heightfield ambient occlusion (GTAO 8-directional), discrete curvature bevel
 * catchlight, and vertical grime/moss gradient strictly clamped inside each island's pixel bounds.
 * Respects `DataTexture` `flipY = false` convention: smaller `y` = bottom (`v = 0`), larger `y` = top (`v = 1`).
 */
export function applyHeightGtaoAndWear(
  heightField: Float32Array,
  coverageMask: Uint8Array,
  texWidth: number,
  texHeight: number,
  islands: Pick<UvIslandMeta, 'pxBounds' | 'materialKind' | 'lockVertical' | 'landmarkKind'>[],
  albedoRgba: Uint8Array,
  options: TexelGtaoOptions = {}
): void {
  const gtaoStrength = Math.max(0, Math.min(1, options.gtaoStrength ?? 0.55));
  const radius = Math.max(1, Math.min(6, Math.round(options.gtaoRadiusPx ?? 3)));
  const curveStrength = Math.max(0, Math.min(0.5, options.curvatureStrength ?? 0.2));
  const grimeStrength = Math.max(0, Math.min(0.6, options.verticalGrimeStrength ?? 0.22));

  for (const isl of islands) {
    const x0 = Math.max(0, isl.pxBounds.x);
    const y0 = Math.max(0, isl.pxBounds.y);
    const x1 = Math.min(texWidth - 1, isl.pxBounds.x + isl.pxBounds.w - 1);
    const y1 = Math.min(texHeight - 1, isl.pxBounds.y + isl.pxBounds.h - 1);
    if (x1 < x0 || y1 < y0) continue;

    // Skip landmarks like faces where aggressive grime would muddy crisp 2px eyes
    const skipHeavyDirt =
      isl.landmarkKind === 'head_front' ||
      isl.materialKind === 'human_skin' ||
      isl.materialKind === 'runic_glow';

    const islH = Math.max(1, y1 - y0 + 1);
    for (let y = y0; y <= y1; y++) {
      // Convention flipY = false => y0 is bottom (v=0), y1 is top (v=1)
      const vFrac = islH > 1 ? (y - y0) / (islH - 1) : 0.5;
      for (let x = x0; x <= x1; x++) {
        const idx = y * texWidth + x;
        if (!coverageMask[idx]) continue;

        const hCenter = heightField[idx];

        // 1) 8-direction height horizon AO clamped to island bounds
        let maxHorizonSum = 0;
        for (let d = 0; d < 8; d++) {
          const dx = DIR_X[d];
          const dy = DIR_Y[d];
          const invLen = DIR_INV_LEN[d];
          let bestSlope = 0;
          for (let step = 1; step <= radius; step++) {
            const nx = Math.max(x0, Math.min(x1, x + dx * step));
            const ny = Math.max(y0, Math.min(y1, y + dy * step));
            const dH = heightField[ny * texWidth + nx] - hCenter;
            if (dH > 0) {
              const slope = (dH * 4.2 * invLen) / step;
              if (slope > bestSlope) bestSlope = slope;
            }
          }
          maxHorizonSum += 1 / Math.sqrt(1 + bestSlope * bestSlope);
        }
        const rawAo = maxHorizonSum * 0.125;
        const ao = 1 - (1 - rawAo) * gtaoStrength;

        // 2) Discrete 4-neighbor Laplacian curvature for subtle edge highlight vs pocket shade
        const hL = heightField[y * texWidth + Math.max(x0, x - 1)];
        const hR = heightField[y * texWidth + Math.min(x1, x + 1)];
        const hD = heightField[Math.max(y0, y - 1) * texWidth + x];
        const hU = heightField[Math.min(y1, y + 1) * texWidth + x];
        const curvature = (hCenter - 0.25 * (hL + hR + hD + hU)) * 3.0;
        const curveDelta = Math.max(-0.18, Math.min(0.18, curvature * curveStrength));

        // 3) Hue-shifted shading & vertical dirt/moss near lower vFrac when world-vertical
        const rgbaOffset = idx * 4;
        let r = albedoRgba[rgbaOffset + 0];
        let g = albedoRgba[rgbaOffset + 1];
        let b = albedoRgba[rgbaOffset + 2];

        const isBrightOrSkin =
          isl.materialKind === 'forged_steel' ||
          isl.materialKind === 'rarity_armor' ||
          isl.materialKind === 'brushed_gold' ||
          isl.materialKind === 'human_skin' ||
          isl.materialKind === 'goblin_skin';
        const minShade = isBrightOrSkin ? 0.72 : 0.64;
        const shadeFactor = Math.max(minShade, Math.min(1.16, ao + curveDelta));
        if (shadeFactor < 1.0) {
          // Subtle cool hue-shift without turning neutral steel/wood violet
          const shadowMix = (1 - shadeFactor) * 0.24;
          r = r * shadeFactor * (1 - shadowMix) + 32 * shadowMix;
          g = g * shadeFactor * (1 - shadowMix) + 34 * shadowMix;
          b = b * shadeFactor * (1 - shadowMix) + 52 * shadowMix;
        } else if (shadeFactor > 1.0) {
          // Warm highlight shift on raised ridges/edges
          const hiMix = Math.min(0.22, (shadeFactor - 1.0) * 1.25);
          r = r + (242 - r) * hiMix;
          g = g + (236 - g) * hiMix;
          b = b + (216 - b) * hiMix * 0.85;
        }

        if (isl.lockVertical && !skipHeavyDirt && grimeStrength > 0.01) {
          const bottomMask = Math.max(0, 1 - vFrac * 2.1); // bottom 45% gets grounded grime/moss
          if (bottomMask > 0) {
            const effGrime = isBrightOrSkin ? grimeStrength * 0.45 : grimeStrength * 0.75;
            const tint = bottomMask * effGrime;
            if (isl.materialKind === 'mossy_cobble' || isl.materialKind === 'stone_masonry') {
              r = r * (1 - tint) + 58 * tint;
              g = g * (1 - tint) + 84 * tint;
              b = b * (1 - tint) + 46 * tint;
            } else {
              r = r * (1 - tint) + 42 * tint;
              g = g * (1 - tint) + 38 * tint;
              b = b * (1 - tint) + 46 * tint;
            }
          }
        }

        const islW = Math.max(1, x1 - x0 + 1);
        const quantStep =
          isl.landmarkKind === 'none' &&
          isl.materialKind !== 'runic_glow' &&
          islW >= 8 &&
          islH >= 8
            ? 8
            : 0;

        // Strict ProPixelizer/Hytale rule: never clip to pure #000000 or #ffffff
        const q = (v: number) =>
          quantStep > 0 ? Math.round(v / quantStep) * quantStep : Math.round(v);
        albedoRgba[rgbaOffset + 0] = Math.max(12, Math.min(244, q(r)));
        albedoRgba[rgbaOffset + 1] = Math.max(12, Math.min(244, q(g)));
        albedoRgba[rgbaOffset + 2] = Math.max(12, Math.min(244, q(b)));
      }
    }
  }
}
