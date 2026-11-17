import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function createSeededRng(seed: number): () => number {
  let a = (Math.floor(seed) || 1) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Stamps linear vertex colors onto an uncolored BufferGeometry and ensures non-indexed attributes
 * so geometries merge seamlessly with crisp per-part vertex coloring.
 */
export function prepareColoredPart(
  geo: THREE.BufferGeometry,
  hexColor: string,
  shadeJitter = 0.0
): THREE.BufferGeometry {
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo.clone();
  geo.dispose();
  if (!nonIndexed.getAttribute('normal')) {
    nonIndexed.computeVertexNormals();
  }
  const pos = nonIndexed.getAttribute('position');
  if (!nonIndexed.getAttribute('uv')) {
    nonIndexed.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.count * 2), 2));
  }
  const col = new THREE.Color(hexColor);
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const jitter = shadeJitter > 0 ? 1 + (Math.sin(i * 12.9898) * 0.5) * shadeJitter : 1;
    colors[i * 3 + 0] = Math.min(1, Math.max(0, col.r * jitter));
    colors[i * 3 + 1] = Math.min(1, Math.max(0, col.g * jitter));
    colors[i * 3 + 2] = Math.min(1, Math.max(0, col.b * jitter));
  }
  nonIndexed.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return nonIndexed;
}

/**
 * Computes Lengyel 4-component (`tx, ty, tz, w`) vertex tangents in pure TypeScript without external WASM.
 * Smooth vertices sharing position & normal average their tangent frames cleanly while hard creases stay split.
 * Degenerate UV triangles safely fall back to a valid orthogonal tangent (zero NaN).
 */
export function computeGeometryTangents(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  if (!pos || !uv) return geo;
  if (!geo.getAttribute('normal')) {
    geo.computeVertexNormals();
  }
  const norm = geo.getAttribute('normal');
  const index = geo.getIndex();
  const count = pos.count;
  const triCount = index ? Math.floor(index.count / 3) : Math.floor(count / 3);

  const tanSum = new Float32Array(count * 3);
  const bitanSum = new Float32Array(count * 3);
  const keyToVerts = new Map<string, number[]>();

  const q = (v: number) => Math.round(v * 2000);
  for (let i = 0; i < count; i++) {
    const key = `${q(pos.getX(i))},${q(pos.getY(i))},${q(pos.getZ(i))}|${q(norm.getX(i))},${q(norm.getY(i))},${q(norm.getZ(i))}`;
    let list = keyToVerts.get(key);
    if (!list) {
      list = [];
      keyToVerts.set(key, list);
    }
    list.push(i);
  }

  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3 + 0) : t * 3 + 0;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

    const x0 = pos.getX(i0), y0 = pos.getY(i0), z0 = pos.getZ(i0);
    const x1 = pos.getX(i1), y1 = pos.getY(i1), z1 = pos.getZ(i1);
    const x2 = pos.getX(i2), y2 = pos.getY(i2), z2 = pos.getZ(i2);

    const e1x = x1 - x0, e1y = y1 - y0, e1z = z1 - z0;
    const e2x = x2 - x0, e2y = y2 - y0, e2z = z2 - z0;

    const u0 = uv.getX(i0), v0 = uv.getY(i0);
    const du1 = uv.getX(i1) - u0, dv1 = uv.getY(i1) - v0;
    const du2 = uv.getX(i2) - u0, dv2 = uv.getY(i2) - v0;

    const det = du1 * dv2 - du2 * dv1;
    if (Math.abs(det) <= 1e-12) continue;

    const invDet = 1 / det;
    const tx = (e1x * dv2 - e2x * dv1) * invDet;
    const ty = (e1y * dv2 - e2y * dv1) * invDet;
    const tz = (e1z * dv2 - e2z * dv1) * invDet;
    const bx = (e2x * du1 - e1x * du2) * invDet;
    const by = (e2y * du1 - e1y * du2) * invDet;
    const bz = (e2z * du1 - e1z * du2) * invDet;

    for (const vi of [i0, i1, i2]) {
      tanSum[vi * 3 + 0] += tx;
      tanSum[vi * 3 + 1] += ty;
      tanSum[vi * 3 + 2] += tz;
      bitanSum[vi * 3 + 0] += bx;
      bitanSum[vi * 3 + 1] += by;
      bitanSum[vi * 3 + 2] += bz;
    }
  }

  // Average accumulated tangents across vertices sharing welded position + normal
  const weldedTan = new Float32Array(count * 3);
  const weldedBitan = new Float32Array(count * 3);
  for (const list of keyToVerts.values()) {
    let sx = 0, sy = 0, sz = 0;
    let bxp = 0, byp = 0, bzp = 0;
    for (const vi of list) {
      sx += tanSum[vi * 3 + 0];
      sy += tanSum[vi * 3 + 1];
      sz += tanSum[vi * 3 + 2];
      bxp += bitanSum[vi * 3 + 0];
      byp += bitanSum[vi * 3 + 1];
      bzp += bitanSum[vi * 3 + 2];
    }
    for (const vi of list) {
      weldedTan[vi * 3 + 0] = sx;
      weldedTan[vi * 3 + 1] = sy;
      weldedTan[vi * 3 + 2] = sz;
      weldedBitan[vi * 3 + 0] = bxp;
      weldedBitan[vi * 3 + 1] = byp;
      weldedBitan[vi * 3 + 2] = bzp;
    }
  }

  const tangents = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const nx = norm.getX(i), ny = norm.getY(i), nz = norm.getZ(i);
    let tx = weldedTan[i * 3 + 0];
    let ty = weldedTan[i * 3 + 1];
    let tz = weldedTan[i * 3 + 2];

    const dotNT = nx * tx + ny * ty + nz * tz;
    tx -= nx * dotNT;
    ty -= ny * dotNT;
    tz -= nz * dotNT;

    let len = Math.hypot(tx, ty, tz);
    if (len > 1e-8) {
      tx /= len;
      ty /= len;
      tz /= len;
      const cx = ny * tz - nz * ty;
      const cy = nz * tx - nx * tz;
      const cz = nx * ty - ny * tx;
      const bx = weldedBitan[i * 3 + 0];
      const by = weldedBitan[i * 3 + 1];
      const bz = weldedBitan[i * 3 + 2];
      const sign = cx * bx + cy * by + cz * bz < 0 ? -1 : 1;
      tangents[i * 4 + 0] = tx;
      tangents[i * 4 + 1] = ty;
      tangents[i * 4 + 2] = tz;
      tangents[i * 4 + 3] = sign;
    } else {
      // Safe orthogonal fallback when UV triangle is degenerate
      const ax = Math.abs(ny) < 0.9 ? 0 : 1;
      const ay = Math.abs(ny) < 0.9 ? 1 : 0;
      const az = 0;
      let fx = ay * nz - az * ny;
      let fy = az * nx - ax * nz;
      let fz = ax * ny - ay * nx;
      len = Math.hypot(fx, fy, fz);
      if (len > 1e-8) {
        fx /= len;
        fy /= len;
        fz /= len;
      } else {
        fx = 1;
        fy = 0;
        fz = 0;
      }
      tangents[i * 4 + 0] = fx;
      tangents[i * 4 + 1] = fy;
      tangents[i * 4 + 2] = fz;
      tangents[i * 4 + 3] = 1;
    }
  }

  geo.setAttribute('tangent', new THREE.Float32BufferAttribute(tangents, 4));
  return geo;
}

/**
 * Safely merges multiple colored geometries (matching attributes: position, normal, uv, color, optional tangent).
 */
export function mergeColoredParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (parts.length === 0) {
    return prepareColoredPart(new THREE.BoxGeometry(0.1, 0.1, 0.1), '#ffffff');
  }
  const includeTangents = parts.some((p) => Boolean(p.getAttribute('tangent')));
  const keepNames = includeTangents
    ? new Set(['position', 'normal', 'uv', 'color', 'tangent'])
    : new Set(['position', 'normal', 'uv', 'color']);

  const normalized = parts.map((p) => {
    const g = p.index ? p.toNonIndexed() : p.clone();
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const count = g.getAttribute('position').count;
    if (!g.getAttribute('uv')) {
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
    }
    if (!g.getAttribute('color')) {
      const ones = new Float32Array(count * 3).fill(1);
      g.setAttribute('color', new THREE.Float32BufferAttribute(ones, 3));
    }
    if (includeTangents && !g.getAttribute('tangent')) {
      computeGeometryTangents(g);
    }
    for (const attrName of Object.keys(g.attributes)) {
      if (!keepNames.has(attrName)) {
        g.deleteAttribute(attrName);
      }
    }
    return g;
  });

  const merged = mergeGeometries(normalized, false);
  for (const p of normalized) {
    p.dispose();
  }
  if (!merged) {
    return parts[0].index ? parts[0].toNonIndexed() : parts[0].clone();
  }
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

/**
 * Builds a tapered box segment along local +Y from y=0 to y=length (Quaternius UAL limb local convention).
 */
export function makeBoneSegmentBox(
  length: number,
  radiusBottomX: number,
  radiusBottomZ: number,
  radiusTopX: number,
  radiusTopZ: number,
  hexColor: string
): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(1, length, 1);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i) + length * 0.5; // shift bottom to y = 0, top to y = length
    const z = pos.getZ(i);
    const t = length > 1e-5 ? y / length : 0.5;
    const sx = (radiusBottomX * (1 - t) + radiusTopX * t) * 2;
    const sz = (radiusBottomZ * (1 - t) + radiusTopZ * t) * 2;
    pos.setXYZ(i, x * sx, y, z * sz);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return prepareColoredPart(geo, hexColor);
}

/**
 * Builds an octagonal prism / cylinder tapered along +Y starting at y=0.
 */
export function makeTaperedCylinderY(
  bottomRadius: number,
  topRadius: number,
  height: number,
  radialSegs: number,
  hexColor: string,
  offset: [number, number, number] = [0, 0, 0]
): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(topRadius, bottomRadius, height, radialSegs);
  geo.translate(offset[0], offset[1] + height * 0.5, offset[2]);
  return prepareColoredPart(geo, hexColor);
}
