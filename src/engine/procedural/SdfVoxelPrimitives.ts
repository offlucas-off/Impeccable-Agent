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
 * Safely merges multiple colored geometries (matching attributes: position, normal, uv, color).
 */
export function mergeColoredParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (parts.length === 0) {
    return prepareColoredPart(new THREE.BoxGeometry(0.1, 0.1, 0.1), '#ffffff');
  }
  const normalized = parts.map((p) => {
    const g = p.index ? p.toNonIndexed() : p;
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const count = g.getAttribute('position').count;
    if (!g.getAttribute('uv')) {
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
    }
    if (!g.getAttribute('color')) {
      const ones = new Float32Array(count * 3).fill(1);
      g.setAttribute('color', new THREE.Float32BufferAttribute(ones, 3));
    }
    return g;
  });
  const merged = mergeGeometries(normalized, false);
  for (const p of normalized) {
    if (!parts.includes(p)) p.dispose();
  }
  if (!merged) {
    return normalized[0].clone();
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
