import * as THREE from 'three';
import { mergeColoredParts, prepareColoredPart } from './SdfVoxelPrimitives';

export type FinishMode = 'textured_ao' | 'classic_flat';

export type MaterialRecipeId =
  | 'stone_masonry'
  | 'mossy_cobble'
  | 'wood_planks'
  | 'timber_frame'
  | 'plaster_wall'
  | 'roof_shingle'
  | 'forged_steel'
  | 'brushed_gold'
  | 'rarity_armor'
  | 'stitched_leather'
  | 'woven_cloth'
  | 'human_skin'
  | 'goblin_skin'
  | 'orc_hide'
  | 'demon_hide'
  | 'runic_glow'
  | 'magma_obsidian'
  | 'bone_ivory'
  | 'foliage_leaf'
  | 'water_pool'
  | 'dragon_scales'
  | 'wing_membrane'
  | 'muscle_hide';

export type LandmarkKind =
  | 'none'
  | 'head_front'
  | 'chest_crest'
  | 'door_front'
  | 'rune_panel'
  | 'shield_face';

export interface TaggedGeometryPart {
  geometry: THREE.BufferGeometry;
  partTag: string;
  materialKind: MaterialRecipeId;
  baseHex: string;
  accentHex?: string;
  projection?: 'auto' | 'box6' | 'cylindrical_y' | 'planar';
  lockVertical?: boolean;
  landmarkKind?: LandmarkKind;
  islandScaleBias?: number;
}

export function tagPart(
  geometry: THREE.BufferGeometry,
  partTag: string,
  materialKind: MaterialRecipeId,
  baseHex: string,
  options: {
    accentHex?: string;
    projection?: 'auto' | 'box6' | 'cylindrical_y' | 'planar';
    lockVertical?: boolean;
    landmarkKind?: LandmarkKind;
    islandScaleBias?: number;
  } = {}
): TaggedGeometryPart {
  geometry.userData = {
    ...geometry.userData,
    partTag,
    materialKind,
    baseHex,
    accentHex: options.accentHex,
    landmarkKind: options.landmarkKind ?? 'none',
  };
  return {
    geometry,
    partTag,
    materialKind,
    baseHex,
    accentHex: options.accentHex,
    projection: options.projection ?? 'auto',
    lockVertical: options.lockVertical ?? true,
    landmarkKind: options.landmarkKind ?? 'none',
    islandScaleBias: options.islandScaleBias ?? 1.0,
  };
}

// ---------------------------------------------------------------------------
// Low-level watertight winding & mesh construction helpers
// ---------------------------------------------------------------------------

interface TriMeshAccum {
  positions: number[];
  normals: number[];
  uvs: number[];
}

function createAccum(): TriMeshAccum {
  return { positions: [], normals: [], uvs: [] };
}

function pushTriWithHint(
  acc: TriMeshAccum,
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
  uvA: [number, number],
  uvB: [number, number],
  uvC: [number, number],
  outwardHint: [number, number, number],
  smoothNormals?: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ]
): void {
  const e1x = b[0] - a[0],
    e1y = b[1] - a[1],
    e1z = b[2] - a[2];
  const e2x = c[0] - a[0],
    e2y = c[1] - a[1],
    e2z = c[2] - a[2];
  let nx = e1y * e2z - e1z * e2y;
  let ny = e1z * e2x - e1x * e2z;
  let nz = e1x * e2y - e1y * e2x;
  const area2 = Math.hypot(nx, ny, nz);
  if (area2 < 1e-12) return;
  nx /= area2;
  ny /= area2;
  nz /= area2;

  const dot = nx * outwardHint[0] + ny * outwardHint[1] + nz * outwardHint[2];
  const flip = dot < 0;
  if (flip) {
    nx = -nx;
    ny = -ny;
    nz = -nz;
  }

  const pts = flip ? [a, c, b] : [a, b, c];
  const uvs = flip ? [uvA, uvC, uvB] : [uvA, uvB, uvC];
  const nrms = smoothNormals
    ? flip
      ? [smoothNormals[0], smoothNormals[2], smoothNormals[1]]
      : smoothNormals
    : [
        [nx, ny, nz] as [number, number, number],
        [nx, ny, nz] as [number, number, number],
        [nx, ny, nz] as [number, number, number],
      ];

  for (let i = 0; i < 3; i++) {
    acc.positions.push(pts[i][0], pts[i][1], pts[i][2]);
    acc.normals.push(nrms[i][0], nrms[i][1], nrms[i][2]);
    acc.uvs.push(uvs[i][0], uvs[i][1]);
  }
}

function pushQuadWithHint(
  acc: TriMeshAccum,
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
  d: [number, number, number],
  uvA: [number, number],
  uvB: [number, number],
  uvC: [number, number],
  uvD: [number, number],
  outwardHint: [number, number, number],
  smoothNormals?: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ]
): void {
  pushTriWithHint(
    acc,
    a,
    b,
    c,
    uvA,
    uvB,
    uvC,
    outwardHint,
    smoothNormals ? [smoothNormals[0], smoothNormals[1], smoothNormals[2]] : undefined
  );
  pushTriWithHint(
    acc,
    a,
    c,
    d,
    uvA,
    uvC,
    uvD,
    outwardHint,
    smoothNormals ? [smoothNormals[0], smoothNormals[2], smoothNormals[3]] : undefined
  );
}

function finishAccumToGeometry(
  acc: TriMeshAccum,
  hexColor: string,
  shadeJitter = 0,
  offset: [number, number, number] = [0, 0, 0]
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(acc.positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(acc.normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(acc.uvs, 2));
  if (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0) {
    geo.translate(offset[0], offset[1], offset[2]);
  }
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return prepareColoredPart(geo, hexColor, shadeJitter);
}

// ---------------------------------------------------------------------------
// 1. Watertight Chamfered / Beveled Primitives
// ---------------------------------------------------------------------------

/**
 * Watertight 26-face chamfered cuboid centered at origin (unless offset passed).
 * Keeps crisp flat face normals on the 6 main faces and 45-degree beveled edges + corners
 * so ProPixelizer Pass 3 catches crisp edge highlights & bevel folding cleanly.
 */
export function makeBeveledBox(
  width: number,
  height: number,
  depth: number,
  chamfer = 0.02,
  hexColor = '#ffffff',
  options: {
    offset?: [number, number, number];
    shadeJitter?: number;
    originBottom?: boolean;
  } = {}
): THREE.BufferGeometry {
  const minDim = Math.min(Math.abs(width), Math.abs(height), Math.abs(depth));
  const c = Math.max(0, Math.min(chamfer, minDim * 0.34));
  const yBias = options.originBottom ? height * 0.5 : 0;
  const off: [number, number, number] = [
    options.offset?.[0] ?? 0,
    (options.offset?.[1] ?? 0) + yBias,
    options.offset?.[2] ?? 0,
  ];

  if (c < 1e-4) {
    const fallback = new THREE.BoxGeometry(width, height, depth);
    if (off[0] || off[1] || off[2]) fallback.translate(off[0], off[1], off[2]);
    return prepareColoredPart(fallback, hexColor, options.shadeJitter ?? 0);
  }

  return makeBeveledTaperedHexahedron(
    width * 0.5,
    depth * 0.5,
    width * 0.5,
    depth * 0.5,
    -height * 0.5,
    height * 0.5,
    c,
    hexColor,
    off,
    options.shadeJitter ?? 0
  );
}

/**
 * Matches Quaternius UAL `makeBoneSegmentBox` bounds (`y = 0 .. length`),
 * with chamfered 45-degree edges and bottom/top chamfers.
 */
export function makeBeveledBoneSegmentBox(
  length: number,
  radiusBottomX: number,
  radiusBottomZ: number,
  radiusTopX: number,
  radiusTopZ: number,
  chamfer = 0.014,
  hexColor = '#ffffff'
): THREE.BufferGeometry {
  const minRadius = Math.min(radiusBottomX, radiusBottomZ, radiusTopX, radiusTopZ);
  const c = Math.max(0, Math.min(chamfer, minRadius * 0.42, length * 0.28));
  if (c < 1e-4) {
    const geo = new THREE.BoxGeometry(1, length, 1);
    const pos = geo.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + length * 0.5;
      const t = length > 1e-5 ? y / length : 0.5;
      const sx = (radiusBottomX * (1 - t) + radiusTopX * t) * 2;
      const sz = (radiusBottomZ * (1 - t) + radiusTopZ * t) * 2;
      pos.setXYZ(i, pos.getX(i) * sx, y, pos.getZ(i) * sz);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return prepareColoredPart(geo, hexColor);
  }
  return makeBeveledTaperedHexahedron(
    radiusBottomX,
    radiusBottomZ,
    radiusTopX,
    radiusTopZ,
    0,
    length,
    c,
    hexColor,
    [0, 0, 0],
    0
  );
}

function makeBeveledTaperedHexahedron(
  bx: number,
  bz: number,
  tx: number,
  tz: number,
  yMin: number,
  yMax: number,
  c: number,
  hexColor: string,
  offset: [number, number, number],
  shadeJitter: number
): THREE.BufferGeometry {
  const acc = createAccum();
  const h = yMax - yMin;
  const cxB = Math.min(c, bx * 0.48);
  const czB = Math.min(c, bz * 0.48);
  const cxT = Math.min(c, tx * 0.48);
  const czT = Math.min(c, tz * 0.48);
  const cy = Math.min(c, h * 0.42);

  // Inner extents on main faces
  const ibx = bx - cxB;
  const ibz = bz - czB;
  const itx = tx - cxT;
  const itz = tz - czT;
  const y0 = yMin;
  const y1 = yMin + cy;
  const y2 = yMax - cy;
  const y3 = yMax;

  // Taper factors at y1 and y2
  const t1 = h > 1e-5 ? cy / h : 0;
  const t2 = h > 1e-5 ? (h - cy) / h : 1;
  const lerpX = (t: number) => bx * (1 - t) + tx * t;
  const lerpZ = (t: number) => bz * (1 - t) + tz * t;
  const x1 = lerpX(t1),
    z1 = lerpZ(t1);
  const x2 = lerpX(t2),
    z2 = lerpZ(t2);
  const i1x = x1 - (cxB * (1 - t1) + cxT * t1);
  const i1z = z1 - (czB * (1 - t1) + czT * t1);
  const i2x = x2 - (cxB * (1 - t2) + cxT * t2);
  const i2z = z2 - (czB * (1 - t2) + czT * t2);

  const p = (x: number, y: number, z: number): [number, number, number] => [x, y, z];

  // 8 octants: sx in {-1, 1}, sz in {-1, 1}, sy in {-1, 1}
  // At each octant:
  //   vx = on ±X side face, vy = on ±Y top/bottom face, vz = on ±Z side face
  const oct = (sx: number, sy: number, sz: number) => {
    const isTop = sy > 0;
    const xFace = isTop ? x2 : x1;
    const zFace = isTop ? z2 : z1;
    const ixSide = isTop ? i2x : i1x;
    const izSide = isTop ? i2z : i1z;
    const ySide = isTop ? y2 : y1;
    const yCap = isTop ? y3 : y0;
    const ixCap = isTop ? itx : ibx;
    const izCap = isTop ? itz : ibz;
    return {
      vx: p(sx * xFace, ySide, sz * izSide),
      vy: p(sx * ixCap, yCap, sz * izCap),
      vz: p(sx * ixSide, ySide, sz * zFace),
    };
  };

  // Corners (-1/-1, +1/-1, -1/+1, +1/+1) x (bot -1, top +1)
  const C = {
    bmm: oct(-1, -1, -1),
    bpm: oct(1, -1, -1),
    bmp: oct(-1, -1, 1),
    bpp: oct(1, -1, 1),
    tmm: oct(-1, 1, -1),
    tpm: oct(1, 1, -1),
    tmp: oct(-1, 1, 1),
    tpp: oct(1, 1, 1),
  };

  // 1) 6 Main faces
  pushQuadWithHint(acc, C.bmp.vy, C.bpp.vy, C.bpm.vy, C.bmm.vy, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 0]); // -Y
  pushQuadWithHint(acc, C.tmp.vy, C.tpp.vy, C.tpm.vy, C.tmm.vy, [0, 0], [1, 0], [1, 1], [0, 1], [0, 1, 0]); // +Y
  pushQuadWithHint(acc, C.bmp.vz, C.bpp.vz, C.tpp.vz, C.tmp.vz, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]); // +Z
  pushQuadWithHint(acc, C.bpm.vz, C.bmm.vz, C.tmm.vz, C.tpm.vz, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]); // -Z
  pushQuadWithHint(acc, C.bpp.vx, C.bpm.vx, C.tpm.vx, C.tpp.vx, [0, 0], [1, 0], [1, 1], [0, 1], [1, 0, 0]); // +X
  pushQuadWithHint(acc, C.bmm.vx, C.bmp.vx, C.tmp.vx, C.tmm.vx, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 0, 0]); // -X

  // 2) 4 Vertical chamfer edges
  pushQuadWithHint(acc, C.bpp.vz, C.bpp.vx, C.tpp.vx, C.tpp.vz, [0, 0], [1, 0], [1, 1], [0, 1], [1, 0, 1]);
  pushQuadWithHint(acc, C.bpm.vx, C.bpm.vz, C.tpm.vz, C.tpm.vx, [0, 0], [1, 0], [1, 1], [0, 1], [1, 0, -1]);
  pushQuadWithHint(acc, C.bmm.vz, C.bmm.vx, C.tmm.vx, C.tmm.vz, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 0, -1]);
  pushQuadWithHint(acc, C.bmp.vx, C.bmp.vz, C.tmp.vz, C.tmp.vx, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 0, 1]);

  // 3) 4 Top bevel edges
  pushQuadWithHint(acc, C.tmp.vz, C.tpp.vz, C.tpp.vy, C.tmp.vy, [0, 0], [1, 0], [1, 1], [0, 1], [0, 1, 1]);
  pushQuadWithHint(acc, C.tpm.vz, C.tmm.vz, C.tmm.vy, C.tpm.vy, [0, 0], [1, 0], [1, 1], [0, 1], [0, 1, -1]);
  pushQuadWithHint(acc, C.tpp.vx, C.tpm.vx, C.tpm.vy, C.tpp.vy, [0, 0], [1, 0], [1, 1], [0, 1], [1, 1, 0]);
  pushQuadWithHint(acc, C.tmm.vx, C.tmp.vx, C.tmp.vy, C.tmm.vy, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 1, 0]);

  // 4) 4 Bottom bevel edges
  pushQuadWithHint(acc, C.bmp.vy, C.bpp.vy, C.bpp.vz, C.bmp.vz, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 1]);
  pushQuadWithHint(acc, C.bpm.vy, C.bmm.vy, C.bmm.vz, C.bpm.vz, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, -1]);
  pushQuadWithHint(acc, C.bpp.vy, C.bpm.vy, C.bpm.vx, C.bpp.vx, [0, 0], [1, 0], [1, 1], [0, 1], [1, -1, 0]);
  pushQuadWithHint(acc, C.bmm.vy, C.bmp.vy, C.bmp.vx, C.bmm.vx, [0, 0], [1, 0], [1, 1], [0, 1], [-1, -1, 0]);

  // 5) 8 Corner chamfer triangles
  pushTriWithHint(acc, C.tpp.vx, C.tpp.vy, C.tpp.vz, [0, 0], [1, 0], [0.5, 1], [1, 1, 1]);
  pushTriWithHint(acc, C.tpm.vx, C.tpm.vz, C.tpm.vy, [0, 0], [1, 0], [0.5, 1], [1, 1, -1]);
  pushTriWithHint(acc, C.tmm.vx, C.tmm.vy, C.tmm.vz, [0, 0], [1, 0], [0.5, 1], [-1, 1, -1]);
  pushTriWithHint(acc, C.tmp.vx, C.tmp.vz, C.tmp.vy, [0, 0], [1, 0], [0.5, 1], [-1, 1, 1]);

  pushTriWithHint(acc, C.bpp.vx, C.bpp.vz, C.bpp.vy, [0, 0], [1, 0], [0.5, 1], [1, -1, 1]);
  pushTriWithHint(acc, C.bpm.vx, C.bpm.vy, C.bpm.vz, [0, 0], [1, 0], [0.5, 1], [1, -1, -1]);
  pushTriWithHint(acc, C.bmm.vx, C.bmm.vz, C.bmm.vy, [0, 0], [1, 0], [0.5, 1], [-1, -1, -1]);
  pushTriWithHint(acc, C.bmp.vx, C.bmp.vy, C.bmp.vz, [0, 0], [1, 0], [0.5, 1], [-1, -1, 1]);

  return finishAccumToGeometry(acc, hexColor, shadeJitter, offset);
}

/**
 * Segmented watertight beveled cuboid with subdivided interior grids (`segsX × segsY × segsZ`)
 * and optional deterministic 3D vertex warp callback `warpFn(x, y, z) => [x', y', z']`.
 * Enables sculpted V-taper armor plates, weathered stone blocks, and sagging timber beams
 * while preserving 45-degree edge chamfers for Pass 3 crease highlights.
 */
export function makeSegmentedBeveledBox(
  width: number,
  height: number,
  depth: number,
  bevel = 0.02,
  segsX = 2,
  segsY = 2,
  segsZ = 2,
  warpFn?: (x: number, y: number, z: number) => [number, number, number],
  hexColor = '#ffffff',
  options: {
    offset?: [number, number, number];
    shadeJitter?: number;
    originBottom?: boolean;
  } = {}
): THREE.BufferGeometry {
  const nx = Math.max(1, Math.min(12, Math.round(segsX)));
  const ny = Math.max(1, Math.min(12, Math.round(segsY)));
  const nz = Math.max(1, Math.min(12, Math.round(segsZ)));
  const minDim = Math.min(Math.abs(width), Math.abs(height), Math.abs(depth));
  const c = Math.max(0.001, Math.min(bevel, minDim * 0.34));
  const hw = width * 0.5;
  const hh = height * 0.5;
  const hd = depth * 0.5;
  const yBias = options.originBottom ? hh : 0;
  const off: [number, number, number] = [
    options.offset?.[0] ?? 0,
    (options.offset?.[1] ?? 0) + yBias,
    options.offset?.[2] ?? 0,
  ];

  // Map grid indices (ix in 0..nx+2, iy in 0..ny+2, iz in 0..nz+2) to box with chamfer margin c at ends
  const axisCoord = (idx: number, n: number, half: number, ch: number): number => {
    if (idx <= 0) return -half;
    if (idx >= n + 2) return half;
    const inner = Math.max(0.001, half - ch);
    const t = (idx - 1) / n; // 0..1 across interior face
    return -inner + t * (2 * inner);
  };

  const evalPt = (ix: number, iy: number, iz: number): [number, number, number] => {
    let x = axisCoord(ix, nx, hw, c);
    let y = axisCoord(iy, ny, hh, c);
    let z = axisCoord(iz, nz, hd, c);

    // Project boundary ring points onto the 26-face chamfer hull
    const onX = ix === 0 ? -1 : ix === nx + 2 ? 1 : 0;
    const onY = iy === 0 ? -1 : iy === ny + 2 ? 1 : 0;
    const onZ = iz === 0 ? -1 : iz === nz + 2 ? 1 : 0;
    const bCount = Math.abs(onX) + Math.abs(onY) + Math.abs(onZ);
    if (bCount >= 2) {
      // Retract along active boundary axes so bevel edges & corner triangles sit at 45 degrees
      const retract = bCount === 2 ? c * 0.2929 : c * 0.4226;
      if (onX !== 0) x -= onX * retract;
      if (onY !== 0) y -= onY * retract;
      if (onZ !== 0) z -= onZ * retract;
    }

    if (warpFn) {
      return warpFn(x, y, z);
    }
    return [x, y, z];
  };

  const acc = createAccum();
  const NX = nx + 2;
  const NY = ny + 2;
  const NZ = nz + 2;

  // Emit all 6 topological sides of the (NX × NY × NZ) grid cube
  // +Z (iz = NZ) & -Z (iz = 0)
  for (let iy = 0; iy < NY; iy++) {
    for (let ix = 0; ix < NX; ix++) {
      const u0 = ix / NX,
        u1 = (ix + 1) / NX;
      const v0 = iy / NY,
        v1 = (iy + 1) / NY;
      pushQuadWithHint(
        acc,
        evalPt(ix, iy, NZ),
        evalPt(ix + 1, iy, NZ),
        evalPt(ix + 1, iy + 1, NZ),
        evalPt(ix, iy + 1, NZ),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, 0, 1]
      );
      pushQuadWithHint(
        acc,
        evalPt(ix + 1, iy, 0),
        evalPt(ix, iy, 0),
        evalPt(ix, iy + 1, 0),
        evalPt(ix + 1, iy + 1, 0),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, 0, -1]
      );
    }
  }

  // +X (ix = NX) & -X (ix = 0)
  for (let iy = 0; iy < NY; iy++) {
    for (let iz = 0; iz < NZ; iz++) {
      const u0 = iz / NZ,
        u1 = (iz + 1) / NZ;
      const v0 = iy / NY,
        v1 = (iy + 1) / NY;
      pushQuadWithHint(
        acc,
        evalPt(NX, iy, iz + 1),
        evalPt(NX, iy, iz),
        evalPt(NX, iy + 1, iz),
        evalPt(NX, iy + 1, iz + 1),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [1, 0, 0]
      );
      pushQuadWithHint(
        acc,
        evalPt(0, iy, iz),
        evalPt(0, iy, iz + 1),
        evalPt(0, iy + 1, iz + 1),
        evalPt(0, iy + 1, iz),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [-1, 0, 0]
      );
    }
  }

  // +Y (iy = NY) & -Y (iy = 0)
  for (let iz = 0; iz < NZ; iz++) {
    for (let ix = 0; ix < NX; ix++) {
      const u0 = ix / NX,
        u1 = (ix + 1) / NX;
      const v0 = iz / NZ,
        v1 = (iz + 1) / NZ;
      pushQuadWithHint(
        acc,
        evalPt(ix, NY, iz + 1),
        evalPt(ix + 1, NY, iz + 1),
        evalPt(ix + 1, NY, iz),
        evalPt(ix, NY, iz),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, 1, 0]
      );
      pushQuadWithHint(
        acc,
        evalPt(ix, 0, iz),
        evalPt(ix + 1, 0, iz),
        evalPt(ix + 1, 0, iz + 1),
        evalPt(ix, 0, iz + 1),
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, -1, 0]
      );
    }
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0, off);
}

/**
 * Sculpted flared A-frame pleated tabard / battle-coat tail or tasset plate with vertical fold pleats.
 * Spans vertically from `y = -height * 0.5` to `+height * 0.5` (or `y = 0 .. height` when `originTop` / `originBottom`),
 * widening from `topW` at the waist to `bottomW` at the hem for dark-fantasy warrior silhouettes without cloth physics.
 */
export function makePleatedTabardGeometry(
  topW = 0.22,
  bottomW = 0.32,
  height = 0.34,
  depth = 0.042,
  pleats = 3,
  hexColor = '#285cc4',
  options: {
    offset?: [number, number, number];
    flareZ?: number;
    shadeJitter?: number;
  } = {}
): THREE.BufferGeometry {
  const nPleats = Math.max(1, Math.min(7, Math.round(pleats)));
  const uCols = nPleats * 2 + 2;
  const vRows = 4;
  const flareZ = options.flareZ ?? 0.028;
  const halfT = Math.max(0.008, depth * 0.38);
  const pleatAmp = Math.max(0.006, depth * 0.36);
  const acc = createAccum();

  const sampleGrid = (iu: number, iv: number, isFront: boolean): [number, number, number] => {
    const u = iu / uCols; // 0..1 left to right
    const v = iv / vRows; // 0 = bottom hem, 1 = top waist
    const spanW = bottomW * (1 - v) + topW * v;
    const x = (u - 0.5) * spanW;
    const y = (v - 0.5) * height;
    // Pleat wave stronger toward bottom hem, smooth at waist
    const wave = Math.sin(u * nPleats * Math.PI * 2) * pleatAmp * (0.35 + 0.65 * (1 - v));
    const sweepZ = (1 - v) * (1 - v) * flareZ;
    const z = wave + sweepZ + (isFront ? halfT : -halfT);
    return [x, y, z];
  };

  const sampleNormal = (iu: number, iv: number, isFront: boolean): [number, number, number] => {
    const u = iu / uCols;
    const v = iv / vRows;
    const dzdu = Math.cos(u * nPleats * Math.PI * 2) * nPleats * Math.PI * 2 * pleatAmp * (0.35 + 0.65 * (1 - v));
    const dxdu = bottomW * (1 - v) + topW * v;
    const dzdv = -2 * (1 - v) * flareZ - Math.sin(u * nPleats * Math.PI * 2) * pleatAmp * 0.65;
    const dydv = height;
    const sign = isFront ? 1 : -1;
    const nx = -dzdu / Math.max(1e-4, dxdu) * sign;
    const ny = -dzdv / Math.max(1e-4, dydv) * sign;
    const nz = sign;
    const len = Math.hypot(nx, ny, nz) || 1;
    return [nx / len, ny / len, nz / len];
  };

  for (let iv = 0; iv < vRows; iv++) {
    const v0 = iv / vRows,
      v1 = (iv + 1) / vRows;
    for (let iu = 0; iu < uCols; iu++) {
      const u0 = iu / uCols,
        u1 = (iu + 1) / uCols;
      const f00 = sampleGrid(iu, iv, true);
      const f10 = sampleGrid(iu + 1, iv, true);
      const f11 = sampleGrid(iu + 1, iv + 1, true);
      const f01 = sampleGrid(iu, iv + 1, true);
      const nf00 = sampleNormal(iu, iv, true);
      const nf10 = sampleNormal(iu + 1, iv, true);
      const nf11 = sampleNormal(iu + 1, iv + 1, true);
      const nf01 = sampleNormal(iu, iv + 1, true);
      pushQuadWithHint(
        acc,
        f00,
        f10,
        f11,
        f01,
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, 0, 1],
        [nf00, nf10, nf11, nf01]
      );

      const b00 = sampleGrid(iu, iv, false);
      const b10 = sampleGrid(iu + 1, iv, false);
      const b11 = sampleGrid(iu + 1, iv + 1, false);
      const b01 = sampleGrid(iu, iv + 1, false);
      const nb00 = sampleNormal(iu, iv, false);
      const nb10 = sampleNormal(iu + 1, iv, false);
      const nb11 = sampleNormal(iu + 1, iv + 1, false);
      const nb01 = sampleNormal(iu, iv + 1, false);
      pushQuadWithHint(
        acc,
        b10,
        b00,
        b01,
        b11,
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        [0, 0, -1],
        [nb10, nb00, nb01, nb11]
      );
    }
  }

  // Watertight bottom hem & top waist caps
  for (let iu = 0; iu < uCols; iu++) {
    const u0 = iu / uCols,
      u1 = (iu + 1) / uCols;
    pushQuadWithHint(
      acc,
      sampleGrid(iu, 0, false),
      sampleGrid(iu + 1, 0, false),
      sampleGrid(iu + 1, 0, true),
      sampleGrid(iu, 0, true),
      [u0, 0],
      [u1, 0],
      [u1, 1],
      [u0, 1],
      [0, -1, 0]
    );
    pushQuadWithHint(
      acc,
      sampleGrid(iu, vRows, true),
      sampleGrid(iu + 1, vRows, true),
      sampleGrid(iu + 1, vRows, false),
      sampleGrid(iu, vRows, false),
      [u0, 0],
      [u1, 0],
      [u1, 1],
      [u0, 1],
      [0, 1, 0]
    );
  }

  // Watertight left & right side edges
  for (let iv = 0; iv < vRows; iv++) {
    const v0 = iv / vRows,
      v1 = (iv + 1) / vRows;
    pushQuadWithHint(
      acc,
      sampleGrid(0, iv, false),
      sampleGrid(0, iv, true),
      sampleGrid(0, iv + 1, true),
      sampleGrid(0, iv + 1, false),
      [0, v0],
      [1, v0],
      [1, v1],
      [0, v1],
      [-1, 0, 0]
    );
    pushQuadWithHint(
      acc,
      sampleGrid(uCols, iv, true),
      sampleGrid(uCols, iv, false),
      sampleGrid(uCols, iv + 1, false),
      sampleGrid(uCols, iv + 1, true),
      [0, v0],
      [1, v0],
      [1, v1],
      [0, v1],
      [1, 0, 0]
    );
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0, options.offset ?? [0, 0, 0]);
}

// ---------------------------------------------------------------------------
// 2. Lathe / Revolved Profiles, Curved Horns & Pauldron Shells
// ---------------------------------------------------------------------------

/**
 * Revolves a `[radius, y]` polyline profile cleanly around `+Y` (inspired by topotopo's `barrel.json`).
 * Avoids wrap-seam UV folds and pole degeneracy, supporting crisp faceted or smooth cylindrical shading.
 */
export function makeLatheProfile(
  pointsRY: [number, number][],
  radialSegs = 12,
  hexColor = '#ffffff',
  options: {
    smoothRadialNormals?: boolean;
    capBottom?: boolean;
    capTop?: boolean;
    staveGrooveAmplitude?: number;
    offset?: [number, number, number];
    shadeJitter?: number;
  } = {}
): THREE.BufferGeometry {
  const segs = Math.max(4, Math.round(radialSegs));
  const acc = createAccum();
  const grooveAmp = options.staveGrooveAmplitude ?? 0;

  // Compute total arc length for clean non-squished V coordinates
  let arcTotal = 0;
  const arcAt: number[] = [0];
  for (let i = 1; i < pointsRY.length; i++) {
    const dr = pointsRY[i][0] - pointsRY[i - 1][0];
    const dy = pointsRY[i][1] - pointsRY[i - 1][1];
    arcTotal += Math.hypot(dr, dy);
    arcAt.push(arcTotal);
  }
  const invArc = arcTotal > 1e-6 ? 1 / arcTotal : 1;

  // Precompute 2D profile normals in (r, y) plane
  const profileNormalsRY: [number, number][] = pointsRY.map((_, i) => {
    const prev = pointsRY[Math.max(0, i - 1)];
    const next = pointsRY[Math.min(pointsRY.length - 1, i + 1)];
    const dr = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dr, dy) || 1;
    // Outward normal for bottom->top profile with interior on left: (dy, -dr)
    return [dy / len, -dr / len];
  });

  const ringPos = (pIdx: number, s: number): [number, number, number] => {
    const [rBase, y] = pointsRY[pIdx];
    const angle = (s / segs) * Math.PI * 2;
    const staveMod =
      grooveAmp !== 0 && rBase > 1e-4 ? 1 - grooveAmp * Math.abs(Math.sin(angle * (segs * 0.5))) : 1;
    const r = Math.max(0, rBase * staveMod);
    return [Math.cos(angle) * r, y, Math.sin(angle) * r];
  };

  const smoothNrm = (pIdx: number, s: number): [number, number, number] => {
    const angle = (s / segs) * Math.PI * 2;
    const [nr, ny] = profileNormalsRY[pIdx];
    const l = Math.hypot(nr, ny) || 1;
    return [(Math.cos(angle) * nr) / l, ny / l, (Math.sin(angle) * nr) / l];
  };

  for (let i = 0; i < pointsRY.length - 1; i++) {
    const [r0, y0] = pointsRY[i];
    const [r1, y1] = pointsRY[i + 1];
    if (r0 < 1e-5 && r1 < 1e-5) continue;
    const v0 = arcAt[i] * invArc;
    const v1 = arcAt[i + 1] * invArc;
    const ym = (y0 + y1) * 0.5;
    const dr = r1 - r0;
    const dy = y1 - y0;

    for (let s = 0; s < segs; s++) {
      const sNext = (s + 1) % segs;
      const u0 = s / segs;
      const u1 = (s + 1) / segs;
      const a0 = ringPos(i, s);
      const b0 = ringPos(i, sNext);
      const a1 = ringPos(i + 1, s);
      const b1 = ringPos(i + 1, sNext);

      const angMid = ((s + 0.5) / segs) * Math.PI * 2;
      const cosM = Math.cos(angMid);
      const sinM = Math.sin(angMid);
      const hint: [number, number, number] = [cosM * dy, -dr, sinM * dy];
      if (Math.hypot(hint[0], hint[1], hint[2]) < 1e-6) {
        hint[0] = cosM;
        hint[2] = sinM;
      }

      if (r0 < 1e-5) {
        const apex: [number, number, number] = [0, y0, 0];
        const sn = options.smoothRadialNormals
          ? ([
              smoothNrm(i, s),
              smoothNrm(i + 1, sNext),
              smoothNrm(i + 1, s),
            ] as [[number, number, number], [number, number, number], [number, number, number]])
          : undefined;
        pushTriWithHint(
          acc,
          apex,
          b1,
          a1,
          [(u0 + u1) * 0.5, v0],
          [u1, v1],
          [u0, v1],
          [cosM, -0.5, sinM],
          sn
        );
      } else if (r1 < 1e-5) {
        const apex: [number, number, number] = [0, y1, 0];
        const sn = options.smoothRadialNormals
          ? ([
              smoothNrm(i, s),
              smoothNrm(i, sNext),
              smoothNrm(i + 1, s),
            ] as [[number, number, number], [number, number, number], [number, number, number]])
          : undefined;
        pushTriWithHint(
          acc,
          a0,
          b0,
          apex,
          [u0, v0],
          [u1, v0],
          [(u0 + u1) * 0.5, v1],
          [cosM, 0.5, sinM],
          sn
        );
      } else {
        const midPt = [
          (a0[0] + b0[0] + a1[0] + b1[0]) * 0.25,
          ym,
          (a0[2] + b0[2] + a1[2] + b1[2]) * 0.25,
        ];
        // Radial outward direction adjusted for profile slope
        const radialLen = Math.hypot(midPt[0], midPt[2]) || 1;
        const slopeOut: [number, number, number] = [
          (midPt[0] / radialLen) * (dy >= 0 ? 1 : -1) * Math.max(0.25, Math.abs(dy)),
          -dr,
          (midPt[2] / radialLen) * (dy >= 0 ? 1 : -1) * Math.max(0.25, Math.abs(dy)),
        ];
        const sn = options.smoothRadialNormals
          ? ([
              smoothNrm(i, s),
              smoothNrm(i, sNext),
              smoothNrm(i + 1, sNext),
              smoothNrm(i + 1, s),
            ] as [
              [number, number, number],
              [number, number, number],
              [number, number, number],
              [number, number, number],
            ])
          : undefined;
        pushQuadWithHint(
          acc,
          a0,
          b0,
          b1,
          a1,
          [u0, v0],
          [u1, v0],
          [u1, v1],
          [u0, v1],
          slopeOut,
          sn
        );
      }
    }
  }

  // Optional explicit endcaps if first/last radius > 0
  if (options.capBottom !== false && pointsRY[0][0] > 1e-4) {
    const y = pointsRY[0][1];
    const center: [number, number, number] = [0, y, 0];
    for (let s = 0; s < segs; s++) {
      const a = ringPos(0, s);
      const b = ringPos(0, (s + 1) % segs);
      pushTriWithHint(
        acc,
        center,
        a,
        b,
        [0.5, 0.5],
        [0.5 + 0.5 * Math.cos((s / segs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / segs) * Math.PI * 2)],
        [
          0.5 + 0.5 * Math.cos(((s + 1) / segs) * Math.PI * 2),
          0.5 + 0.5 * Math.sin(((s + 1) / segs) * Math.PI * 2),
        ],
        [0, -1, 0]
      );
    }
  }
  const lastIdx = pointsRY.length - 1;
  if (options.capTop !== false && pointsRY[lastIdx][0] > 1e-4) {
    const y = pointsRY[lastIdx][1];
    const center: [number, number, number] = [0, y, 0];
    for (let s = 0; s < segs; s++) {
      const a = ringPos(lastIdx, s);
      const b = ringPos(lastIdx, (s + 1) % segs);
      pushTriWithHint(
        acc,
        center,
        b,
        a,
        [0.5, 0.5],
        [
          0.5 + 0.5 * Math.cos(((s + 1) / segs) * Math.PI * 2),
          0.5 + 0.5 * Math.sin(((s + 1) / segs) * Math.PI * 2),
        ],
        [0.5 + 0.5 * Math.cos((s / segs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / segs) * Math.PI * 2)],
        [0, 1, 0]
      );
    }
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0, options.offset ?? [0, 0, 0]);
}

/**
 * Curved tapered horn / tusk / claw extruded smoothly along a quadratic bend along local +Y.
 */
export function makeCurvedHornGeometry(
  segments = 10,
  baseRadius = 0.08,
  tipRadius = 0.01,
  length = 0.45,
  bendX = 0.14,
  bendZ = 0.1,
  radialSegs = 10,
  hexColor = '#cbb68a'
): THREE.BufferGeometry {
  const segCount = Math.max(3, segments);
  const radCount = Math.max(6, radialSegs);
  const acc = createAccum();

  const pts: THREE.Vector3[] = [];
  const radii: number[] = [];
  for (let i = 0; i <= segCount; i++) {
    const t = i / segCount;
    const x = bendX * (t * t * 1.45 - 0.15 * t);
    const y = length * (t - 0.12 * t * t);
    const z = bendZ * (t * t * 1.35 + 0.1 * t);
    pts.push(new THREE.Vector3(x, y, z));
    const taper = Math.pow(1 - t, 0.85);
    radii.push(baseRadius * taper + tipRadius * (1 - taper));
  }

  const rings: [number, number, number][][] = [];
  const ringNormals: [number, number, number][][] = [];
  const upPrev = new THREE.Vector3(0, 1, 0);
  let refSide = new THREE.Vector3(1, 0, 0);

  for (let i = 0; i <= segCount; i++) {
    const tangent = new THREE.Vector3();
    if (i < segCount) {
      tangent.subVectors(pts[i + 1], pts[i]);
    } else {
      tangent.subVectors(pts[i], pts[i - 1]);
    }
    tangent.normalize();
    if (i === 0) {
      refSide.crossVectors(upPrev, tangent);
      if (refSide.lengthSq() < 1e-4) refSide.set(1, 0, 0);
      refSide.normalize();
    } else {
      const dot = refSide.dot(tangent);
      refSide.addScaledVector(tangent, -dot).normalize();
    }
    const binormal = new THREE.Vector3().crossVectors(tangent, refSide).normalize();
    const r = radii[i];
    const ring: [number, number, number][] = [];
    const rNrm: [number, number, number][] = [];
    for (let s = 0; s < radCount; s++) {
      const a = (s / radCount) * Math.PI * 2;
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const p = pts[i]
        .clone()
        .addScaledVector(refSide, cosA * r)
        .addScaledVector(binormal, sinA * r);
      ring.push([p.x, p.y, p.z]);
      const n = refSide.clone().multiplyScalar(cosA).addScaledVector(binormal, sinA).normalize();
      rNrm.push([n.x, n.y, n.z]);
    }
    rings.push(ring);
    ringNormals.push(rNrm);
  }

  for (let i = 0; i < segCount; i++) {
    const v0 = i / segCount;
    const v1 = (i + 1) / segCount;
    for (let s = 0; s < radCount; s++) {
      const sNext = (s + 1) % radCount;
      const u0 = s / radCount;
      const u1 = (s + 1) / radCount;
      const a0 = rings[i][s];
      const b0 = rings[i][sNext];
      const a1 = rings[i + 1][s];
      const b1 = rings[i + 1][sNext];
      const na0 = ringNormals[i][s];
      const nb0 = ringNormals[i][sNext];
      const na1 = ringNormals[i + 1][s];
      const nb1 = ringNormals[i + 1][sNext];
      const midCenter = pts[i].clone().lerp(pts[i + 1], 0.5);
      const quadMid: [number, number, number] = [
        (a0[0] + b0[0] + a1[0] + b1[0]) * 0.25 - midCenter.x,
        (a0[1] + b0[1] + a1[1] + b1[1]) * 0.25 - midCenter.y,
        (a0[2] + b0[2] + a1[2] + b1[2]) * 0.25 - midCenter.z,
      ];
      pushQuadWithHint(
        acc,
        a0,
        b0,
        b1,
        a1,
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        quadMid,
        [na0, nb0, nb1, na1]
      );
    }
  }

  // Base cap & tip cap
  const baseC: [number, number, number] = [pts[0].x, pts[0].y, pts[0].z];
  const baseHintVec = pts[0].clone().sub(pts[1]).normalize();
  for (let s = 0; s < radCount; s++) {
    pushTriWithHint(
      acc,
      baseC,
      rings[0][(s + 1) % radCount],
      rings[0][s],
      [0.5, 0.5],
      [1, 0],
      [0, 1],
      [baseHintVec.x, baseHintVec.y, baseHintVec.z]
    );
  }
  const tipC: [number, number, number] = [pts[segCount].x, pts[segCount].y, pts[segCount].z];
  const tipHintVec = pts[segCount].clone().sub(pts[segCount - 1]).normalize();
  for (let s = 0; s < radCount; s++) {
    pushTriWithHint(
      acc,
      tipC,
      rings[segCount][s],
      rings[segCount][(s + 1) % radCount],
      [0.5, 0.5],
      [0, 1],
      [1, 0],
      [tipHintVec.x, tipHintVec.y, tipHintVec.z]
    );
  }

  return finishAccumToGeometry(acc, hexColor);
}

/**
 * Curved multi-segment armored shoulder pauldron shell with tiered overlapping lames,
 * raised trim border, and outer/inner thickness (centered near origin).
 */
export function makePauldronShellGeometry(
  width = 0.26,
  height = 0.2,
  depth = 0.28,
  thickness = 0.045,
  hexColor = '#8f9eb3'
): THREE.BufferGeometry {
  const acc = createAccum();
  const uSegs = 6;
  const vSegs = 6;

  const sample = (uIdx: number, vIdx: number, outer: boolean): [number, number, number] => {
    const u = (uIdx / uSegs - 0.5) * Math.PI * 0.96; // forward-back wrap
    const v = (vIdx / vSegs) * Math.PI * 0.58; // 0 = crest, 1 = flared outer rim
    const baseScale = outer ? 1.0 : Math.max(0.55, 1.0 - thickness / Math.max(0.12, width));
    // Tiered overlapping lame steps + raised lower rim lip on outer shell
    const lameStep = outer
      ? vIdx === 3
        ? 1.05
        : vIdx === 5
          ? 1.07
          : vIdx === vSegs
            ? 1.09
            : 1.0
      : 1.0;
    const ridgeSpine = outer ? 1.0 + 0.06 * Math.exp(-Math.pow((uIdx - uSegs * 0.5) / 1.4, 2)) : 1.0;
    const rScale = baseScale * lameStep * ridgeSpine;
    const x = Math.sin(v) * width * 0.56 * rScale;
    const y = (Math.cos(v) - 0.45) * height * 0.74 * rScale - (outer && vIdx >= 6 ? 0.009 : 0);
    const z = Math.sin(u) * Math.max(0.36, Math.sin(v) * 0.86 + 0.32) * depth * 0.5 * rScale;
    return [x, y, z];
  };

  const sampleNormal = (uIdx: number, vIdx: number, outer: boolean): [number, number, number] => {
    const p = sample(uIdx, vIdx, outer);
    const sgn = outer ? 1 : -1;
    const nx = p[0] * sgn;
    const ny = (p[1] + height * 0.25) * sgn;
    const nz = p[2] * sgn;
    const len = Math.hypot(nx, ny, nz) || 1;
    return [nx / len, ny / len, nz / len];
  };

  for (let vi = 0; vi < vSegs; vi++) {
    for (let ui = 0; ui < uSegs; ui++) {
      const a = sample(ui, vi, true);
      const b = sample(ui + 1, vi, true);
      const c = sample(ui + 1, vi + 1, true);
      const d = sample(ui, vi + 1, true);
      const na = sampleNormal(ui, vi, true);
      const nb = sampleNormal(ui + 1, vi, true);
      const nc = sampleNormal(ui + 1, vi + 1, true);
      const nd = sampleNormal(ui, vi + 1, true);
      const outHint: [number, number, number] = [
        (a[0] + c[0]) * 0.5,
        (a[1] + c[1]) * 0.5 + 0.1,
        (a[2] + c[2]) * 0.5,
      ];
      pushQuadWithHint(
        acc,
        a,
        b,
        c,
        d,
        [ui / uSegs, vi / vSegs],
        [(ui + 1) / uSegs, vi / vSegs],
        [(ui + 1) / uSegs, (vi + 1) / vSegs],
        [ui / uSegs, (vi + 1) / vSegs],
        outHint,
        [na, nb, nc, nd]
      );

      const ai = sample(ui, vi, false);
      const bi = sample(ui + 1, vi, false);
      const ci = sample(ui + 1, vi + 1, false);
      const di = sample(ui, vi + 1, false);
      pushQuadWithHint(
        acc,
        ai,
        di,
        ci,
        bi,
        [ui / uSegs, vi / vSegs],
        [ui / uSegs, (vi + 1) / vSegs],
        [(ui + 1) / uSegs, (vi + 1) / vSegs],
        [(ui + 1) / uSegs, vi / vSegs],
        [-outHint[0], -outHint[1], -outHint[2]]
      );
    }
  }

  // Rim wall at vIdx = vSegs and uIdx boundaries
  for (let ui = 0; ui < uSegs; ui++) {
    const o0 = sample(ui, vSegs, true);
    const o1 = sample(ui + 1, vSegs, true);
    const i1 = sample(ui + 1, vSegs, false);
    const i0 = sample(ui, vSegs, false);
    pushQuadWithHint(acc, o0, o1, i1, i0, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 0]);
    const to0 = sample(ui, 0, true);
    const to1 = sample(ui + 1, 0, true);
    const ti1 = sample(ui + 1, 0, false);
    const ti0 = sample(ui, 0, false);
    pushQuadWithHint(acc, to0, ti0, ti1, to1, [0, 0], [1, 0], [1, 1], [0, 1], [-0.4, 0.9, 0]);
  }
  for (let vi = 0; vi < vSegs; vi++) {
    const oF0 = sample(0, vi, true);
    const oF1 = sample(0, vi + 1, true);
    const iF1 = sample(0, vi + 1, false);
    const iF0 = sample(0, vi, false);
    pushQuadWithHint(acc, oF0, iF0, iF1, oF1, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);

    const oB0 = sample(uSegs, vi, true);
    const oB1 = sample(uSegs, vi + 1, true);
    const iB1 = sample(uSegs, vi + 1, false);
    const iB0 = sample(uSegs, vi, false);
    pushQuadWithHint(acc, oB0, oB1, iB1, iB0, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
  }

  return finishAccumToGeometry(acc, hexColor);
}

// ---------------------------------------------------------------------------
// 3. Weapon & Prop Silhouettes (Diamond Blade, Curved Axe, Shield, Bow)
// ---------------------------------------------------------------------------

/**
 * Tapered hex-fuller / diamond cross-section sword blade starting at y=0 and rising along +Y to `bodyLen + tipLen`.
 * Features a central fuller groove channel bounded by twin blood-ridge bevels for crisp Pass 3 specular & crease read.
 */
export function makeSwordBladeGeometry(
  width = 0.08,
  thickness = 0.036,
  bodyLen = 0.62,
  tipLen = 0.16,
  hexColor = '#cfd9e8'
): THREE.BufferGeometry {
  const acc = createAccum();
  const hw0 = width * 0.5;
  const hw1 = width * 0.42;
  const hf0 = width * 0.18;
  const hf1 = width * 0.14;
  const ht0 = thickness * 0.52;
  const ht1 = thickness * 0.42;
  const hg0 = thickness * 0.32; // recessed central fuller groove depth
  const hg1 = thickness * 0.28;
  const fullY = bodyLen * 0.78;

  // Base ring at y=0, fuller termination ring at y=fullY, shoulder ring at y=bodyLen, tip at y=bodyLen+tipLen
  const pR0: [number, number, number] = [hw0, 0, 0];
  const pL0: [number, number, number] = [-hw0, 0, 0];
  const fFR0: [number, number, number] = [hf0, 0, ht0];
  const fFC0: [number, number, number] = [0, 0, hg0];
  const fFL0: [number, number, number] = [-hf0, 0, ht0];
  const fBR0: [number, number, number] = [hf0, 0, -ht0];
  const fBC0: [number, number, number] = [0, 0, -hg0];
  const fBL0: [number, number, number] = [-hf0, 0, -ht0];

  const hwM = hw0 * 0.22 + hw1 * 0.78;
  const pRM: [number, number, number] = [hwM, fullY, 0];
  const pLM: [number, number, number] = [-hwM, fullY, 0];
  const fFRM: [number, number, number] = [hf1, fullY, ht1];
  const fFCM: [number, number, number] = [0, fullY, hg1];
  const fFLM: [number, number, number] = [-hf1, fullY, ht1];
  const fBRM: [number, number, number] = [hf1, fullY, -ht1];
  const fBCM: [number, number, number] = [0, fullY, -hg1];
  const fBLM: [number, number, number] = [-hf1, fullY, -ht1];

  const pR1: [number, number, number] = [hw1, bodyLen, 0];
  const pL1: [number, number, number] = [-hw1, bodyLen, 0];
  const pF1: [number, number, number] = [0, bodyLen, ht1];
  const pB1: [number, number, number] = [0, bodyLen, -ht1];
  const tip: [number, number, number] = [0, bodyLen + tipLen, 0];

  // Lower shaft with central fuller groove + twin bevels (front +Z and back -Z)
  pushQuadWithHint(acc, pR0, fFR0, fFRM, pRM, [0, 0], [0.35, 0], [0.35, 0.65], [0, 0.65], [1, 0, 1]);
  pushQuadWithHint(acc, fFR0, fFC0, fFCM, fFRM, [0.35, 0], [0.5, 0], [0.5, 0.65], [0.35, 0.65], [-0.2, 0, 1]);
  pushQuadWithHint(acc, fFC0, fFL0, fFLM, fFCM, [0.5, 0], [0.65, 0], [0.65, 0.65], [0.5, 0.65], [0.2, 0, 1]);
  pushQuadWithHint(acc, fFL0, pL0, pLM, fFLM, [0.65, 0], [1, 0], [1, 0.65], [0.65, 0.65], [-1, 0, 1]);

  pushQuadWithHint(acc, pL0, fBL0, fBLM, pLM, [0, 0], [0.35, 0], [0.35, 0.65], [0, 0.65], [-1, 0, -1]);
  pushQuadWithHint(acc, fBL0, fBC0, fBCM, fBLM, [0.35, 0], [0.5, 0], [0.5, 0.65], [0.35, 0.65], [0.2, 0, -1]);
  pushQuadWithHint(acc, fBC0, fBR0, fBRM, fBCM, [0.5, 0], [0.65, 0], [0.65, 0.65], [0.5, 0.65], [-0.2, 0, -1]);
  pushQuadWithHint(acc, fBR0, pR0, pRM, fBRM, [0.65, 0], [1, 0], [1, 0.65], [0.65, 0.65], [1, 0, -1]);

  // Upper fuller-to-diamond transition (fullY -> bodyLen)
  pushQuadWithHint(acc, pRM, fFRM, pF1, pR1, [0, 0.65], [0.4, 0.65], [0.5, 0.82], [0, 0.82], [1, 0, 1]);
  pushTriWithHint(acc, fFRM, fFCM, pF1, [0.35, 0.65], [0.5, 0.65], [0.5, 0.82], [0, 0.1, 1]);
  pushTriWithHint(acc, fFCM, fFLM, pF1, [0.5, 0.65], [0.65, 0.65], [0.5, 0.82], [0, 0.1, 1]);
  pushQuadWithHint(acc, fFLM, pLM, pL1, pF1, [0.6, 0.65], [1, 0.65], [1, 0.82], [0.5, 0.82], [-1, 0, 1]);

  pushQuadWithHint(acc, pLM, fBLM, pB1, pL1, [0, 0.65], [0.4, 0.65], [0.5, 0.82], [0, 0.82], [-1, 0, -1]);
  pushTriWithHint(acc, fBLM, fBCM, pB1, [0.35, 0.65], [0.5, 0.65], [0.5, 0.82], [0, 0.1, -1]);
  pushTriWithHint(acc, fBCM, fBRM, pB1, [0.5, 0.65], [0.65, 0.65], [0.5, 0.82], [0, 0.1, -1]);
  pushQuadWithHint(acc, fBRM, pRM, pR1, pB1, [0.6, 0.65], [1, 0.65], [1, 0.82], [0.5, 0.82], [1, 0, -1]);

  // Pointed diamond tip bevels (bodyLen -> bodyLen+tipLen)
  pushTriWithHint(acc, pR1, pF1, tip, [0, 0.82], [1, 0.82], [0.5, 1], [1, 0.3, 1]);
  pushTriWithHint(acc, pF1, pL1, tip, [0, 0.82], [1, 0.82], [0.5, 1], [-1, 0.3, 1]);
  pushTriWithHint(acc, pL1, pB1, tip, [0, 0.82], [1, 0.82], [0.5, 1], [-1, 0.3, -1]);
  pushTriWithHint(acc, pB1, pR1, tip, [0, 0.82], [1, 0.82], [0.5, 1], [1, 0.3, -1]);

  // Base cap at y=0
  pushTriWithHint(acc, pR0, fBR0, fFR0, [1, 0.5], [0.7, 0], [0.7, 1], [0, -1, 0]);
  pushQuadWithHint(acc, fFR0, fBR0, fBC0, fFC0, [0.7, 1], [0.7, 0], [0.5, 0], [0.5, 1], [0, -1, 0]);
  pushQuadWithHint(acc, fFC0, fBC0, fBL0, fFL0, [0.5, 1], [0.5, 0], [0.3, 0], [0.3, 1], [0, -1, 0]);
  pushTriWithHint(acc, fFL0, fBL0, pL0, [0.3, 1], [0.3, 0], [0, 0.5], [0, -1, 0]);

  return finishAccumToGeometry(acc, hexColor);
}

/**
 * Curved crescent axe head centered vertically along Y near origin, blade curving outward along +X (and -X if doubleBit).
 */
export function makeAxeHeadGeometry(
  reachX = 0.24,
  spanY = 0.28,
  thickness = 0.055,
  doubleBit = false,
  hexColor = '#b4bfd0'
): THREE.BufferGeometry {
  const acc = createAccum();
  const buildSide = (dir: 1 | -1) => {
    const segs = 8;
    const xNeck = dir * 0.03;
    const xInner = dir * (reachX * 0.62);
    const xOuter = dir * reachX;
    const tCenter = thickness * 0.5;
    const tBevel = thickness * 0.28;
    const tEdge = 0.008;

    for (let i = 0; i < segs; i++) {
      const f0 = i / segs - 0.5;
      const f1 = (i + 1) / segs - 0.5;
      const yIn0 = f0 * spanY * 0.5;
      const yIn1 = f1 * spanY * 0.5;
      const yOut0 = f0 * spanY;
      const yOut1 = f1 * spanY;
      const curve0 = Math.cos(f0 * Math.PI) * 0.04 * dir;
      const curve1 = Math.cos(f1 * Math.PI) * 0.04 * dir;

      const n0f: [number, number, number] = [xNeck, yIn0 * 0.55, tCenter];
      const n1f: [number, number, number] = [xNeck, yIn1 * 0.55, tCenter];
      const m0f: [number, number, number] = [xInner, yIn0, tBevel];
      const m1f: [number, number, number] = [xInner, yIn1, tBevel];
      const e0: [number, number, number] = [xOuter + curve0, yOut0, tEdge];
      const e1: [number, number, number] = [xOuter + curve1, yOut1, tEdge];

      const n0b: [number, number, number] = [xNeck, yIn0 * 0.55, -tCenter];
      const n1b: [number, number, number] = [xNeck, yIn1 * 0.55, -tCenter];
      const m0b: [number, number, number] = [xInner, yIn0, -tBevel];
      const m1b: [number, number, number] = [xInner, yIn1, -tBevel];
      const e0b: [number, number, number] = [xOuter + curve0, yOut0, -tEdge];
      const e1b: [number, number, number] = [xOuter + curve1, yOut1, -tEdge];

      // Cheek + sharpened bevel front & back
      pushQuadWithHint(acc, n0f, m0f, m1f, n1f, [0, i / segs], [0.6, i / segs], [0.6, (i + 1) / segs], [0, (i + 1) / segs], [0, 0, 1]);
      pushQuadWithHint(acc, m0f, e0, e1, m1f, [0.6, i / segs], [1, i / segs], [1, (i + 1) / segs], [0.6, (i + 1) / segs], [dir, 0, 1]);

      pushQuadWithHint(acc, m0b, n0b, n1b, m1b, [0.6, i / segs], [0, i / segs], [0, (i + 1) / segs], [0.6, (i + 1) / segs], [0, 0, -1]);
      pushQuadWithHint(acc, e0b, m0b, m1b, e1b, [1, i / segs], [0.6, i / segs], [0.6, (i + 1) / segs], [1, (i + 1) / segs], [dir, 0, -1]);

      // Thin cutting front rim
      pushQuadWithHint(acc, e0b, e1b, e1, e0, [0, 0], [1, 0], [1, 1], [0, 1], [dir, 0, 0]);

      if (i === 0) {
        pushQuadWithHint(acc, n0b, m0b, m0f, n0f, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 0]);
        pushQuadWithHint(acc, m0b, e0b, e0, m0f, [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 0]);
      }
      if (i === segs - 1) {
        pushQuadWithHint(acc, m1b, n1b, n1f, m1f, [0, 0], [1, 0], [1, 1], [0, 1], [0, 1, 0]);
        pushQuadWithHint(acc, e1b, m1b, m1f, e1, [0, 0], [1, 0], [1, 1], [0, 1], [0, 1, 0]);
      }
    }
  };

  buildSide(1);
  if (doubleBit) {
    buildSide(-1);
  }
  const blade = finishAccumToGeometry(acc, hexColor);
  const socket = makeBeveledBox(
    doubleBit ? 0.08 : 0.095,
    spanY * 0.42,
    thickness * 1.15,
    0.01,
    hexColor,
    { offset: [doubleBit ? 0 : -0.015, 0, 0] }
  );
  const merged = mergeColoredParts([blade, socket]);
  blade.dispose();
  socket.dispose();
  return merged;
}

/**
 * Sculpted multi-ring curved heater/kite shield with embossed outer rim facing outward along +Z.
 */
export function makeDomeShieldGeometry(
  width = 0.46,
  height = 0.56,
  thickness = 0.06,
  hexColor = '#66758f'
): THREE.BufferGeometry {
  const acc = createAccum();
  const hw = width * 0.5;
  const hh = height * 0.5;
  const bow = Math.min(0.085, width * 0.17);
  const rimT = thickness;

  // 16-point smooth heater/kite perimeter around shield face
  const baseCtrl: [number, number][] = [
    [-hw * 0.92, hh],
    [-hw * 0.46, hh * 1.03],
    [0, hh * 1.04],
    [hw * 0.46, hh * 1.03],
    [hw * 0.92, hh],
    [hw * 0.98, hh * 0.52],
    [hw, 0.02 * hh],
    [hw * 0.82, -hh * 0.34],
    [hw * 0.54, -hh * 0.65],
    [hw * 0.28, -hh * 0.86],
    [0, -hh],
    [-hw * 0.28, -hh * 0.86],
    [-hw * 0.54, -hh * 0.65],
    [-hw * 0.82, -hh * 0.34],
    [-hw, 0.02 * hh],
    [-hw * 0.98, hh * 0.52],
  ];
  const n = baseCtrl.length;
  const cy = 0.06 * hh;
  const ringRadii = [0.28, 0.62, 0.86, 1.0];

  const evalRingPt = (i: number, frac: number, zOff: number, emboss: number): [number, number, number] => {
    const [bx, by] = baseCtrl[i];
    const x = bx * frac;
    const y = cy + (by - cy) * frac;
    // Smooth spherical-parabolic dome curvature + raised rim lip at outer border
    const curveZ = bow * (1 - frac * frac * 1.28) + emboss;
    return [x, y, curveZ + zOff];
  };

  const frontRings = ringRadii.map((f, rIdx) => {
    const emboss = rIdx === 2 ? rimT * 0.14 : rIdx === 3 ? rimT * 0.1 : 0;
    return baseCtrl.map((_, i) => evalRingPt(i, f, rimT * 0.5, emboss));
  });
  const backRings = ringRadii.map((f) =>
    baseCtrl.map((_, i) => evalRingPt(i, f, -rimT * 0.5, 0))
  );
  const centerFront: [number, number, number] = [0, cy, bow + rimT * 0.52];
  const centerBack: [number, number, number] = [0, cy, bow - rimT * 0.5];

  const domeNormal = (pt: [number, number, number], sign: number): [number, number, number] => {
    const nx = (pt[0] / Math.max(0.05, hw)) * 0.42 * sign;
    const ny = ((pt[1] - cy) / Math.max(0.05, hh)) * 0.28 * sign;
    const nz = sign;
    const l = Math.hypot(nx, ny, nz) || 1;
    return [nx / l, ny / l, nz / l];
  };

  const uvOf = (pt: [number, number, number]): [number, number] => [
    Math.max(0, Math.min(1, pt[0] / width + 0.5)),
    Math.max(0, Math.min(1, pt[1] / height + 0.5)),
  ];

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    // Center fan to ring 0
    pushTriWithHint(
      acc,
      centerFront,
      frontRings[0][j],
      frontRings[0][i],
      [0.5, 0.53],
      uvOf(frontRings[0][j]),
      uvOf(frontRings[0][i]),
      [0, 0, 1],
      [domeNormal(centerFront, 1), domeNormal(frontRings[0][j], 1), domeNormal(frontRings[0][i], 1)]
    );
    pushTriWithHint(
      acc,
      centerBack,
      backRings[0][i],
      backRings[0][j],
      [0.5, 0.53],
      uvOf(backRings[0][i]),
      uvOf(backRings[0][j]),
      [0, 0, -1],
      [domeNormal(centerBack, -1), domeNormal(backRings[0][i], -1), domeNormal(backRings[0][j], -1)]
    );

    // Concentric dome rings (0->1->2->3)
    for (let r = 0; r < ringRadii.length - 1; r++) {
      const f00 = frontRings[r][i];
      const f10 = frontRings[r][j];
      const f11 = frontRings[r + 1][j];
      const f01 = frontRings[r + 1][i];
      pushQuadWithHint(
        acc,
        f00,
        f10,
        f11,
        f01,
        uvOf(f00),
        uvOf(f10),
        uvOf(f11),
        uvOf(f01),
        [0, 0, 1],
        [domeNormal(f00, 1), domeNormal(f10, 1), domeNormal(f11, 1), domeNormal(f01, 1)]
      );

      const b00 = backRings[r][i];
      const b10 = backRings[r][j];
      const b11 = backRings[r + 1][j];
      const b01 = backRings[r + 1][i];
      pushQuadWithHint(
        acc,
        b10,
        b00,
        b01,
        b11,
        uvOf(b10),
        uvOf(b00),
        uvOf(b01),
        uvOf(b11),
        [0, 0, -1],
        [domeNormal(b10, -1), domeNormal(b00, -1), domeNormal(b01, -1), domeNormal(b11, -1)]
      );
    }

    // Outer rim wall
    const outerF = frontRings[ringRadii.length - 1];
    const outerB = backRings[ringRadii.length - 1];
    const outX = (outerF[i][0] + outerF[j][0]) * 0.5;
    const outY = (outerF[i][1] + outerF[j][1]) * 0.5;
    pushQuadWithHint(
      acc,
      outerF[i],
      outerB[i],
      outerB[j],
      outerF[j],
      [i / n, 0],
      [i / n, 1],
      [(i + 1) / n, 1],
      [(i + 1) / n, 0],
      [outX, outY, 0]
    );
  }

  return finishAccumToGeometry(acc, hexColor);
}

/**
 * Sculpted recurve bow sweeping along Y from `-height/2 .. +height/2` with graceful curve in `±Z`.
 */
export function makeRecurveBowGeometry(
  height = 1.24,
  drawDepth = 0.24,
  thickness = 0.042,
  hexColor = '#7d522f'
): THREE.BufferGeometry {
  const segs = 18;
  const radSides = 6;
  const acc = createAccum();
  const hh = height * 0.5;

  const spineAt = (t: number): { y: number; z: number; rx: number; rz: number } => {
    const u = t * 2 - 1; // -1..+1
    const absU = Math.abs(u);
    // Main belly curve + recurve tip flare
    const zCurve = -drawDepth * (absU * absU * 1.15 - 0.15 * absU * absU * absU) + (absU > 0.72 ? (absU - 0.72) * 0.22 : 0);
    const taper = 1 - absU * 0.45;
    return {
      y: u * hh,
      z: zCurve,
      rx: thickness * 0.5 * taper,
      rz: thickness * 0.62 * taper,
    };
  };

  const ringPts = (s: { y: number; z: number; rx: number; rz: number }): [number, number, number][] => {
    const ring: [number, number, number][] = [];
    for (let k = 0; k < radSides; k++) {
      const a = (k / radSides) * Math.PI * 2;
      ring.push([Math.cos(a) * s.rx, s.y, s.z + Math.sin(a) * s.rz]);
    }
    return ring;
  };

  const ringNormals = (s: { rx: number; rz: number }): [number, number, number][] => {
    const nrms: [number, number, number][] = [];
    for (let k = 0; k < radSides; k++) {
      const a = (k / radSides) * Math.PI * 2;
      const nx = Math.cos(a) / Math.max(1e-4, s.rx);
      const nz = Math.sin(a) / Math.max(1e-4, s.rz);
      const l = Math.hypot(nx, nz) || 1;
      nrms.push([nx / l, 0, nz / l]);
    }
    return nrms;
  };

  const spines = Array.from({ length: segs + 1 }, (_, i) => spineAt(i / segs));
  const rings = spines.map(ringPts);
  const norms = spines.map(ringNormals);

  for (let i = 0; i < segs; i++) {
    const v0 = i / segs;
    const v1 = (i + 1) / segs;
    for (let k = 0; k < radSides; k++) {
      const kNext = (k + 1) % radSides;
      const a0 = rings[i][k],
        b0 = rings[i][kNext],
        a1 = rings[i + 1][k],
        b1 = rings[i + 1][kNext];
      const ang = ((k + 0.5) / radSides) * Math.PI * 2;
      const outDir: [number, number, number] = [Math.cos(ang), 0, Math.sin(ang)];
      pushQuadWithHint(
        acc,
        a0,
        b0,
        b1,
        a1,
        [k / radSides, v0],
        [(k + 1) / radSides, v0],
        [(k + 1) / radSides, v1],
        [k / radSides, v1],
        outDir,
        [norms[i][k], norms[i][kNext], norms[i + 1][kNext], norms[i + 1][k]]
      );
    }
  }
  // End caps
  const botC: [number, number, number] = [0, spines[0].y, spines[0].z];
  const topC: [number, number, number] = [0, spines[segs].y, spines[segs].z];
  for (let k = 0; k < radSides; k++) {
    const kNext = (k + 1) % radSides;
    pushTriWithHint(acc, botC, rings[0][k], rings[0][kNext], [0.5, 0.5], [0, 0], [1, 0], [0, -1, 0]);
    pushTriWithHint(acc, topC, rings[segs][kNext], rings[segs][k], [0.5, 0.5], [1, 1], [0, 1], [0, 1, 0]);
  }

  return finishAccumToGeometry(acc, hexColor);
}

// ---------------------------------------------------------------------------
// 4. Architecture Roof Generator (Pitched Gable & Hip Shells + Eaves + Gables)
// ---------------------------------------------------------------------------

export interface PitchedRoofResult {
  roofShell: THREE.BufferGeometry;
  ridgeTrim: THREE.BufferGeometry;
  gableFill: THREE.BufferGeometry;
}

/**
 * Generates a real sloped roof (`gable` or `hip`) with overhanging eaves, slab thickness,
 * soffit undersides, catenary ridge sag, protruding eave rafter tails, stepped gable bargeboards,
 * and triangular masonry/timber gable fills.
 * Base rests at local `y = 0` and rises to `peakHeight`.
 */
export function makePitchedRoofGeometry(
  width: number,
  depth: number,
  overhang = 0.22,
  peakHeight = 1.25,
  slabThickness = 0.14,
  options: {
    style?: 'gable' | 'hip';
    roofHex?: string;
    trimHex?: string;
    gableHex?: string;
    ridgeSag?: number;
    rafterCount?: number;
  } = {}
): PitchedRoofResult {
  const style = options.style ?? 'gable';
  const roofHex = options.roofHex ?? '#8a3e38';
  const trimHex = options.trimHex ?? '#4a3322';
  const gableHex = options.gableHex ?? '#c9beaa';
  const sag = options.ridgeSag ?? Math.min(0.08, peakHeight * 0.055);

  const hw = width * 0.5 + overhang;
  const hd = depth * 0.5 + overhang;
  const bHw = width * 0.5;
  const bHd = depth * 0.5;
  const accRoof = createAccum();
  const accGable = createAccum();
  const trimParts: THREE.BufferGeometry[] = [];

  if (style === 'gable') {
    // Segmented ridge along Z axis (4 span segments for subtle catenary mid-span sag)
    const zSegs = 4;
    for (let s = 0; s < zSegs; s++) {
      const f0 = s / zSegs;
      const f1 = (s + 1) / zSegs;
      const z0 = hd - f0 * (2 * hd);
      const z1 = hd - f1 * (2 * hd);
      // Parabolic catenary sag: 0 at gable ends (f=0,1), max at mid-span (f=0.5)
      const sag0 = 4 * f0 * (1 - f0) * sag;
      const sag1 = 4 * f1 * (1 - f1) * sag;
      const eaveSag0 = sag0 * 0.25;
      const eaveSag1 = sag1 * 0.25;

      const rTop0: [number, number, number] = [0, peakHeight + slabThickness - sag0, z0];
      const rTop1: [number, number, number] = [0, peakHeight + slabThickness - sag1, z1];
      const rBot0: [number, number, number] = [0, peakHeight - sag0, z0];
      const rBot1: [number, number, number] = [0, peakHeight - sag1, z1];

      const eRTop0: [number, number, number] = [hw, slabThickness - eaveSag0, z0];
      const eRTop1: [number, number, number] = [hw, slabThickness - eaveSag1, z1];
      const eRBot0: [number, number, number] = [hw, -eaveSag0, z0];
      const eRBot1: [number, number, number] = [hw, -eaveSag1, z1];

      const eLTop0: [number, number, number] = [-hw, slabThickness - eaveSag0, z0];
      const eLTop1: [number, number, number] = [-hw, slabThickness - eaveSag1, z1];
      const eLBot0: [number, number, number] = [-hw, -eaveSag0, z0];
      const eLBot1: [number, number, number] = [-hw, -eaveSag1, z1];

      // Top pitched slopes (Right +X, Left -X)
      pushQuadWithHint(accRoof, eRTop0, eRTop1, rTop1, rTop0, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [1, 1, 0]);
      pushQuadWithHint(accRoof, eLTop1, eLTop0, rTop0, rTop1, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [-1, 1, 0]);

      // Bottom soffits
      pushQuadWithHint(accRoof, eRBot1, eRBot0, rBot0, rBot1, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [-1, -1, 0]);
      pushQuadWithHint(accRoof, eLBot0, eLBot1, rBot1, rBot0, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [1, -1, 0]);

      // Side fascias
      pushQuadWithHint(accRoof, eRBot0, eRBot1, eRTop1, eRTop0, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [1, 0, 0]);
      pushQuadWithHint(accRoof, eLBot1, eLBot0, eLTop0, eLTop1, [f0, 0], [f1, 0], [f1, 1], [f0, 1], [-1, 0, 0]);
    }

    // Front & back rake fascia caps (at z = +hd and z = -hd where sag = 0)
    const rTopF: [number, number, number] = [0, peakHeight + slabThickness, hd];
    const rBotF: [number, number, number] = [0, peakHeight, hd];
    const rTopB: [number, number, number] = [0, peakHeight + slabThickness, -hd];
    const rBotB: [number, number, number] = [0, peakHeight, -hd];

    pushQuadWithHint(accRoof, rBotF, [hw, 0, hd], [hw, slabThickness, hd], rTopF, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
    pushQuadWithHint(accRoof, [-hw, 0, hd], rBotF, rTopF, [-hw, slabThickness, hd], [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
    pushQuadWithHint(accRoof, [hw, 0, -hd], rBotB, rTopB, [hw, slabThickness, -hd], [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);
    pushQuadWithHint(accRoof, rBotB, [-hw, 0, -hd], [-hw, slabThickness, -hd], rTopB, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);

    // Gable triangular walls recessed cleanly under eaves
    const gh = Math.max(0.15, peakHeight - (overhang / Math.max(0.25, bHw)) * peakHeight * 0.25);
    pushTriWithHint(accGable, [-bHw, 0, bHd], [bHw, 0, bHd], [0, gh, bHd], [0, 0], [1, 0], [0.5, 1], [0, 0, 1]);
    pushTriWithHint(accGable, [bHw, 0, -bHd], [-bHw, 0, -bHd], [0, gh, -bHd], [0, 0], [1, 0], [0.5, 1], [0, 0, -1]);

    // Stepped gable bargeboards + king-post finial at front/back gable rakes when roof is house-sized
    if (width >= 2.2) {
      const slopeAngle = Math.atan2(peakHeight, hw);
      const rakeLen = Math.hypot(hw, peakHeight) + 0.08;
      for (const sz of [-1, 1]) {
        const zPos = sz * (hd - 0.05);
        for (const sx of [-1, 1]) {
          const barge = makeBeveledBox(rakeLen, 0.11, 0.12, 0.016, trimHex);
          barge.rotateZ(-sx * slopeAngle);
          barge.translate(sx * hw * 0.5, peakHeight * 0.5 + slabThickness * 0.4, zPos);
          trimParts.push(barge);
        }
        const finial = makeBeveledBox(0.14, 0.34, 0.14, 0.02, trimHex, {
          offset: [0, peakHeight + slabThickness * 0.65, sz * (hd - 0.04)],
        });
        trimParts.push(finial);
      }
    }
  } else {
    // Hip roof: 4 pitched trapezoidal/triangular faces converging to shorter ridge line along Z
    const ridgeHalfZ = Math.max(0.05, hd - hw * 0.85);
    const rFTop: [number, number, number] = [0, peakHeight + slabThickness, ridgeHalfZ];
    const rMidTop: [number, number, number] = [0, peakHeight + slabThickness - sag * 0.65, 0];
    const rBTop: [number, number, number] = [0, peakHeight + slabThickness, -ridgeHalfZ];
    const rFBot: [number, number, number] = [0, peakHeight, ridgeHalfZ];
    const rBBot: [number, number, number] = [0, peakHeight, -ridgeHalfZ];

    const cRFTop: [number, number, number] = [hw, slabThickness, hd];
    const cRMTop: [number, number, number] = [hw, slabThickness - sag * 0.2, 0];
    const cRBTop: [number, number, number] = [hw, slabThickness, -hd];
    const cLBTop: [number, number, number] = [-hw, slabThickness, -hd];
    const cLMTop: [number, number, number] = [-hw, slabThickness - sag * 0.2, 0];
    const cLFTop: [number, number, number] = [-hw, slabThickness, hd];

    const cRFBot: [number, number, number] = [hw, 0, hd];
    const cRBBot: [number, number, number] = [hw, 0, -hd];
    const cLBBot: [number, number, number] = [-hw, 0, -hd];
    const cLFBot: [number, number, number] = [-hw, 0, hd];

    // Top faces (2-segment side slopes with mid-span sag + front/back hip triangles)
    pushQuadWithHint(accRoof, cRFTop, cRMTop, rMidTop, rFTop, [0, 0], [0.5, 0], [0.5, 1], [0.15, 1], [1, 1, 0]);
    pushQuadWithHint(accRoof, cRMTop, cRBTop, rBTop, rMidTop, [0.5, 0], [1, 0], [0.85, 1], [0.5, 1], [1, 1, 0]);
    pushQuadWithHint(accRoof, cLBTop, cLMTop, rMidTop, rBTop, [0, 0], [0.5, 0], [0.5, 1], [0.15, 1], [-1, 1, 0]);
    pushQuadWithHint(accRoof, cLMTop, cLFTop, rFTop, rMidTop, [0.5, 0], [1, 0], [0.85, 1], [0.5, 1], [-1, 1, 0]);
    pushTriWithHint(accRoof, cLFTop, cRFTop, rFTop, [0, 0], [1, 0], [0.5, 1], [0, 1, 1]);
    pushTriWithHint(accRoof, cRBTop, cLBTop, rBTop, [0, 0], [1, 0], [0.5, 1], [0, 1, -1]);

    // Bottom soffits
    pushQuadWithHint(accRoof, cRBBot, cRFBot, rFBot, rBBot, [0, 0], [1, 0], [0.85, 1], [0.15, 1], [-1, -1, 0]);
    pushQuadWithHint(accRoof, cLFBot, cLBBot, rBBot, rFBot, [0, 0], [1, 0], [0.85, 1], [0.15, 1], [1, -1, 0]);
    pushTriWithHint(accRoof, cRFBot, cLFBot, rFBot, [0, 0], [1, 0], [0.5, 1], [0, -1, -1]);
    pushTriWithHint(accRoof, cLBBot, cRBBot, rBBot, [0, 0], [1, 0], [0.5, 1], [0, -1, 1]);

    // Outer eaves fascia
    pushQuadWithHint(accRoof, cRFBot, cRBBot, cRBTop, cRFTop, [0, 0], [1, 0], [1, 1], [0, 1], [1, 0, 0]);
    pushQuadWithHint(accRoof, cLBBot, cLFBot, cLFTop, cLBTop, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 0, 0]);
    pushQuadWithHint(accRoof, cLFBot, cRFBot, cRFTop, cLFTop, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
    pushQuadWithHint(accRoof, cRBBot, cLBBot, cLBTop, cRBTop, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);

    // Subtle tiny closed fill inside peak so gableFill isn't empty
    pushTriWithHint(accGable, [-0.04, 0, 0], [0.04, 0, 0], [0, 0.04, 0], [0, 0], [1, 0], [0.5, 1], [0, 0, 1]);
    pushTriWithHint(accGable, [0.04, 0, 0], [-0.04, 0, 0], [0, 0.04, 0], [0, 0], [1, 0], [0.5, 1], [0, 0, -1]);
  }

  const ridgeLen = style === 'gable' ? hd * 2 + 0.06 : Math.max(0.2, hd * 2 - hw * 1.7 + 0.08);
  const ridgeBeam = makeSegmentedBeveledBox(
    0.16,
    0.14,
    ridgeLen,
    0.025,
    1,
    1,
    3,
    (x, y, z) => {
      const u = ridgeLen > 1e-4 ? z / (ridgeLen * 0.5) : 0;
      const sagDrop = (1 - u * u) * sag * (style === 'gable' ? 1.0 : 0.65);
      return [x, y - sagDrop, z];
    },
    trimHex,
    { offset: [0, peakHeight + slabThickness + 0.02, 0] }
  );
  trimParts.push(ridgeBeam);

  // Protruding eave rafter tails along left & right eaves
  const nRafters = options.rafterCount ?? (depth >= 2.2 ? Math.min(6, Math.max(3, Math.round(depth / 1.15))) : 0);
  if (nRafters >= 2) {
    for (let r = 0; r < nRafters; r++) {
      const f = nRafters > 1 ? r / (nRafters - 1) : 0.5;
      const rz = (f - 0.5) * (depth - 0.36);
      const eaveSag = 4 * f * (1 - f) * sag * (style === 'gable' ? 0.25 : 0.15);
      for (const sx of [-1, 1]) {
        const tail = makeBeveledBox(overhang + 0.14, 0.09, 0.095, 0.015, trimHex, {
          offset: [sx * (bHw + overhang * 0.52), -0.02 - eaveSag, rz],
        });
        trimParts.push(tail);
      }
    }
  }

  const ridgeTrim = trimParts.length === 1 ? trimParts[0] : mergeColoredParts(trimParts);
  if (trimParts.length > 1) {
    for (const p of trimParts) p.dispose();
  }

  return {
    roofShell: finishAccumToGeometry(accRoof, roofHex),
    ridgeTrim,
    gableFill: finishAccumToGeometry(accGable, gableHex),
  };
}

// ---------------------------------------------------------------------------
// 5. Organic SDF Combinators & Surface-Nets Mesher (pure TS, watertight)
// ---------------------------------------------------------------------------

export function sdSphere(x: number, y: number, z: number, cx: number, cy: number, cz: number, r: number): number {
  return Math.hypot(x - cx, y - cy, z - cz) - r;
}

export function sdEllipsoid(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  cz: number,
  rx: number,
  ry: number,
  rz: number
): number {
  const dx = (x - cx) / Math.max(1e-4, rx);
  const dy = (y - cy) / Math.max(1e-4, ry);
  const dz = (z - cz) / Math.max(1e-4, rz);
  const k0 = Math.hypot(dx, dy, dz);
  if (k0 < 1e-6) return -Math.min(rx, ry, rz);
  const dx2 = dx / Math.max(1e-4, rx);
  const dy2 = dy / Math.max(1e-4, ry);
  const dz2 = dz / Math.max(1e-4, rz);
  const k1 = Math.hypot(dx2, dy2, dz2);
  return (k0 * (k0 - 1)) / Math.max(1e-5, k1);
}

export function sdCapsule(
  px: number,
  py: number,
  pz: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  r: number
): number {
  const pax = px - ax,
    pay = py - ay,
    paz = pz - az;
  const bax = bx - ax,
    bay = by - ay,
    baz = bz - az;
  const baLen2 = bax * bax + bay * bay + baz * baz;
  const h = baLen2 > 1e-8 ? Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / baLen2)) : 0;
  return Math.hypot(pax - bax * h, pay - bay * h, paz - baz * h) - r;
}

export function sdRoundedBox(
  px: number,
  py: number,
  pz: number,
  cx: number,
  cy: number,
  cz: number,
  hx: number,
  hy: number,
  hz: number,
  r: number
): number {
  const qx = Math.abs(px - cx) - Math.max(0, hx - r);
  const qy = Math.abs(py - cy) - Math.max(0, hy - r);
  const qz = Math.abs(pz - cz) - Math.max(0, hz - r);
  const ox = Math.max(qx, 0),
    oy = Math.max(qy, 0),
    oz = Math.max(qz, 0);
  return Math.hypot(ox, oy, oz) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

export function sminPoly(a: number, b: number, k: number): number {
  if (k <= 1e-5) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * h * k * (1 / 6);
}

export function sdfHashNoise3D(x: number, y: number, z: number, seed = 1337): number {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  const xf = x - xi,
    yf = y - yi,
    zf = z - zi;
  const fade = (t: number) => t * t * (3 - 2 * t);
  const h = (ix: number, iy: number, iz: number) => {
    let n = (ix * 374761393 + iy * 668265263 + iz * 2147483647 + seed * 1597334677) | 0;
    n = (n ^ (n >>> 13)) * 1274126177;
    return (((n ^ (n >>> 16)) >>> 0) & 0xffff) / 65535 - 0.5;
  };
  const ux = fade(xf),
    uy = fade(yf),
    uz = fade(zf);
  const c000 = h(xi, yi, zi),
    c100 = h(xi + 1, yi, zi);
  const c010 = h(xi, yi + 1, zi),
    c110 = h(xi + 1, yi + 1, zi);
  const c001 = h(xi, yi, zi + 1),
    c101 = h(xi + 1, yi, zi + 1);
  const c011 = h(xi, yi + 1, zi + 1),
    c111 = h(xi + 1, yi + 1, zi + 1);
  const x00 = c000 + (c100 - c000) * ux;
  const x10 = c010 + (c110 - c010) * ux;
  const x01 = c001 + (c101 - c001) * ux;
  const x11 = c011 + (c111 - c011) * ux;
  const y0 = x00 + (x10 - x00) * uy;
  const y1 = x01 + (x11 - x01) * uy;
  return y0 + (y1 - y0) * uz;
}

/**
 * Pure-TS Surface Nets SDF extractor with gradient normal orientation.
 * Fast, produces clean watertight manifold quads split into outward-wound triangles.
 */
export function makeSdfOrganicMesh(
  evalSdf: (x: number, y: number, z: number) => number,
  boundsMin: [number, number, number],
  boundsMax: [number, number, number],
  resolution = 22,
  hexColor = '#667788',
  options: {
    flatShaded?: boolean;
    shadeJitter?: number;
  } = {}
): THREE.BufferGeometry {
  const n = Math.max(6, Math.min(48, Math.round(resolution)));
  const dx = (boundsMax[0] - boundsMin[0]) / n;
  const dy = (boundsMax[1] - boundsMin[1]) / n;
  const dz = (boundsMax[2] - boundsMin[2]) / n;
  const padMin: [number, number, number] = [boundsMin[0] - dx, boundsMin[1] - dy, boundsMin[2] - dz];
  const gN = n + 3; // sample grid size (+1 padding outside on each side so closed surface stays watertight)
  const strideY = gN;
  const strideZ = gN * gN;
  const field = new Float32Array(gN * gN * gN);

  for (let iz = 0; iz < gN; iz++) {
    const z = padMin[2] + iz * dz;
    for (let iy = 0; iy < gN; iy++) {
      const y = padMin[1] + iy * dy;
      const base = iz * strideZ + iy * strideY;
      for (let ix = 0; ix < gN; ix++) {
        const x = padMin[0] + ix * dx;
        // Pad outer shell positive so surface closes inside bounds
        const onOuter = ix === 0 || iy === 0 || iz === 0 || ix === gN - 1 || iy === gN - 1 || iz === gN - 1;
        const val = evalSdf(x, y, z);
        field[base + ix] = onOuter ? Math.max(0.05, val) : val;
      }
    }
  }

  const cN = gN - 1;
  const cellVertIdx = new Int32Array(cN * cN * cN).fill(-1);
  const vertPos: [number, number, number][] = [];
  const vertNrm: [number, number, number][] = [];

  const valAt = (ix: number, iy: number, iz: number) => field[iz * strideZ + iy * strideY + ix];
  const gradAt = (x: number, y: number, z: number): [number, number, number] => {
    const eps = Math.min(dx, dy, dz) * 0.35;
    const gx = evalSdf(x + eps, y, z) - evalSdf(x - eps, y, z);
    const gy = evalSdf(x, y + eps, z) - evalSdf(x, y - eps, z);
    const gz = evalSdf(x, y, z + eps) - evalSdf(x, y, z - eps);
    const l = Math.hypot(gx, gy, gz) || 1;
    return [gx / l, gy / l, gz / l];
  };

  // Edge pairs inside unit cell
  const cubeEdges: [number, number, number, number, number, number][] = [
    [0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 0],
    [0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [0, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1],
  ];

  for (let cz = 0; cz < cN; cz++) {
    for (let cy = 0; cy < cN; cy++) {
      for (let cx = 0; cx < cN; cx++) {
        let mask = 0;
        let bit = 0;
        for (let oz = 0; oz <= 1; oz++) {
          for (let oy = 0; oy <= 1; oy++) {
            for (let ox = 0; ox <= 1; ox++) {
              if (valAt(cx + ox, cy + oy, cz + oz) < 0) mask |= 1 << bit;
              bit++;
            }
          }
        }
        if (mask === 0 || mask === 255) continue;

        let sumX = 0,
          sumY = 0,
          sumZ = 0,
          crossCount = 0;
        for (const [ax, ay, az, bx, by, bz] of cubeEdges) {
          const va = valAt(cx + ax, cy + ay, cz + az);
          const vb = valAt(cx + bx, cy + by, cz + bz);
          if ((va < 0) === (vb < 0)) continue;
          const denom = va - vb;
          const t = Math.abs(denom) > 1e-8 ? Math.max(0, Math.min(1, va / denom)) : 0.5;
          sumX += ax + (bx - ax) * t;
          sumY += ay + (by - ay) * t;
          sumZ += az + (bz - az) * t;
          crossCount++;
        }
        if (crossCount === 0) continue;
        const px = padMin[0] + (cx + sumX / crossCount) * dx;
        const py = padMin[1] + (cy + sumY / crossCount) * dy;
        const pz = padMin[2] + (cz + sumZ / crossCount) * dz;

        const cid = cz * cN * cN + cy * cN + cx;
        cellVertIdx[cid] = vertPos.length;
        vertPos.push([px, py, pz]);
        vertNrm.push(gradAt(px, py, pz));
      }
    }
  }

  const acc = createAccum();
  const cIdx = (cx: number, cy: number, cz: number) => cellVertIdx[cz * cN * cN + cy * cN + cx];
  const cellQuadList: [number, number, number, number, boolean][] = [];

  const recordCellQuad = (v0: number, v1: number, v2: number, v3: number, flip: boolean) => {
    if (v0 < 0 || v1 < 0 || v2 < 0 || v3 < 0) return;
    cellQuadList.push([v0, v1, v2, v3, flip]);
  };

  // Collect quads dual to surface-crossing grid edges
  for (let iz = 1; iz < gN - 1; iz++) {
    for (let iy = 1; iy < gN - 1; iy++) {
      for (let ix = 1; ix < gN - 1; ix++) {
        const vHere = valAt(ix, iy, iz);
        const inside = vHere < 0;

        // Edge along +X: shared by cells (ix, iy-1, iz-1), (ix, iy, iz-1), (ix, iy, iz), (ix, iy-1, iz)
        if (ix + 1 < gN) {
          const vX = valAt(ix + 1, iy, iz) < 0;
          if (inside !== vX) {
            recordCellQuad(
              cIdx(ix, iy - 1, iz - 1),
              cIdx(ix, iy, iz - 1),
              cIdx(ix, iy, iz),
              cIdx(ix, iy - 1, iz),
              inside
            );
          }
        }
        // Edge along +Y
        if (iy + 1 < gN) {
          const vY = valAt(ix, iy + 1, iz) < 0;
          if (inside !== vY) {
            recordCellQuad(
              cIdx(ix - 1, iy, iz - 1),
              cIdx(ix - 1, iy, iz),
              cIdx(ix, iy, iz),
              cIdx(ix, iy, iz - 1),
              inside
            );
          }
        }
        // Edge along +Z
        if (iz + 1 < gN) {
          const vZ = valAt(ix, iy, iz + 1) < 0;
          if (inside !== vZ) {
            recordCellQuad(
              cIdx(ix - 1, iy - 1, iz),
              cIdx(ix, iy - 1, iz),
              cIdx(ix, iy, iz),
              cIdx(ix - 1, iy, iz),
              inside
            );
          }
        }
      }
    }
  }

  // 2-Pass Taubin lambda/mu tangential relaxation (lambda = 0.45, mu = -0.47)
  // Eliminates voxel/Surface-Nets stair-stepping while preserving volume and silhouette ridges
  if (vertPos.length > 0 && cellQuadList.length > 0) {
    const vNeighbors: number[][] = Array.from({ length: vertPos.length }, () => []);
    const addNb = (a: number, b: number) => {
      if (a !== b && !vNeighbors[a].includes(b)) vNeighbors[a].push(b);
      if (a !== b && !vNeighbors[b].includes(a)) vNeighbors[b].push(a);
    };
    for (const [v0, v1, v2, v3] of cellQuadList) {
      addNb(v0, v1);
      addNb(v1, v2);
      addNb(v2, v3);
      addNb(v3, v0);
    }

    const taubinWeights = [0.45, -0.47, 0.45, -0.47];
    const nextPos: [number, number, number][] = vertPos.map((p) => [p[0], p[1], p[2]]);
    for (const w of taubinWeights) {
      for (let i = 0; i < vertPos.length; i++) {
        const nbs = vNeighbors[i];
        if (nbs.length === 0) continue;
        let avgX = 0,
          avgY = 0,
          avgZ = 0;
        for (const nb of nbs) {
          avgX += vertPos[nb][0];
          avgY += vertPos[nb][1];
          avgZ += vertPos[nb][2];
        }
        const inv = 1 / nbs.length;
        let lx = avgX * inv - vertPos[i][0];
        let ly = avgY * inv - vertPos[i][1];
        let lz = avgZ * inv - vertPos[i][2];
        // Tangential projection preserves sharp normal ridges & prevents shrinkage
        const nrm = vertNrm[i];
        const nDot = lx * nrm[0] + ly * nrm[1] + lz * nrm[2];
        lx -= nDot * nrm[0] * 0.45;
        ly -= nDot * nrm[1] * 0.45;
        lz -= nDot * nrm[2] * 0.45;
        nextPos[i][0] = vertPos[i][0] + w * lx;
        nextPos[i][1] = vertPos[i][1] + w * ly;
        nextPos[i][2] = vertPos[i][2] + w * lz;
      }
      for (let i = 0; i < vertPos.length; i++) {
        vertPos[i][0] = nextPos[i][0];
        vertPos[i][1] = nextPos[i][1];
        vertPos[i][2] = nextPos[i][2];
        vertNrm[i] = gradAt(vertPos[i][0], vertPos[i][1], vertPos[i][2]);
      }
    }
  }

  for (const [v0, v1, v2, v3, flip] of cellQuadList) {
    const p0 = vertPos[v0],
      p1 = vertPos[v1],
      p2 = vertPos[v2],
      p3 = vertPos[v3];
    const avgN: [number, number, number] = [
      (vertNrm[v0][0] + vertNrm[v1][0] + vertNrm[v2][0] + vertNrm[v3][0]) * 0.25,
      (vertNrm[v0][1] + vertNrm[v1][1] + vertNrm[v2][1] + vertNrm[v3][1]) * 0.25,
      (vertNrm[v0][2] + vertNrm[v1][2] + vertNrm[v2][2] + vertNrm[v3][2]) * 0.25,
    ];
    const smooth = options.flatShaded
      ? undefined
      : flip
        ? ([vertNrm[v0], vertNrm[v3], vertNrm[v2], vertNrm[v1]] as [
            [number, number, number],
            [number, number, number],
            [number, number, number],
            [number, number, number],
          ])
        : ([vertNrm[v0], vertNrm[v1], vertNrm[v2], vertNrm[v3]] as [
            [number, number, number],
            [number, number, number],
            [number, number, number],
            [number, number, number],
          ]);
    if (flip) {
      pushQuadWithHint(acc, p0, p3, p2, p1, [0, 0], [0, 1], [1, 1], [1, 0], avgN, smooth);
    } else {
      pushQuadWithHint(acc, p0, p1, p2, p3, [0, 0], [1, 0], [1, 1], [0, 1], avgN, smooth);
    }
  }

  if (acc.positions.length === 0) {
    return makeBeveledBox(
      Math.max(0.1, boundsMax[0] - boundsMin[0]) * 0.5,
      Math.max(0.1, boundsMax[1] - boundsMin[1]) * 0.5,
      Math.max(0.1, boundsMax[2] - boundsMin[2]) * 0.5,
      0.03,
      hexColor,
      {
        offset: [
          (boundsMin[0] + boundsMax[0]) * 0.5,
          (boundsMin[1] + boundsMax[1]) * 0.5,
          (boundsMin[2] + boundsMax[2]) * 0.5,
        ],
      }
    );
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0);
}

export interface SplineLoftOptions {
  colorHex?: string | number;
  capStart?: boolean;
  capEnd?: boolean;
  flatShaded?: boolean;
  shadeJitter?: number;
  twistRad?: number;
  /** Optional dorsal spine keel amplitude (applied near top angle sinT > 0.6). */
  ridgeAmplitude?: number;
  /** Optional ventral belly flattening factor (0..0.45). */
  bellyFlatten?: number;
}

/**
 * Sweeps elliptical/muscular cross-sections along a Catmull-Rom spline using
 * parallel-transported frames to avoid Frenet-Serret flipping.
 */
export function makeSplineLoftGeometry(
  points: ReadonlyArray<THREE.Vector3 | readonly [number, number, number]>,
  radii: ReadonlyArray<number | readonly [number, number]>,
  radialSegs = 14,
  tubularSegs = 24,
  options: SplineLoftOptions = {}
): THREE.BufferGeometry {
  const colorHex = typeof options.colorHex === 'number'
    ? `#${options.colorHex.toString(16).padStart(6, '0')}`
    : (options.colorHex ?? '#ffffff');
  const capStart = options.capStart ?? true;
  const capEnd = options.capEnd ?? true;
  const flatShaded = options.flatShaded ?? false;
  const shadeJitter = options.shadeJitter ?? 0;
  const twistRad = options.twistRad ?? 0;
  const ridgeAmp = options.ridgeAmplitude ?? 0;
  const bellyFlatten = Math.max(0, Math.min(0.45, options.bellyFlatten ?? 0));

  if (points.length < 2) {
    return makeBeveledBox(0.1, 0.1, 0.1, 0.02, colorHex);
  }

  const vecPoints = points.map((p) =>
    p instanceof THREE.Vector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2])
  );
  const curve = new THREE.CatmullRomCurve3(vecPoints, false, 'centripetal', 0.5);

  const normRadii: [number, number][] =
    radii.length > 0
      ? radii.map((r) => (typeof r === 'number' ? [r, r] : [r[0], r[1]]))
      : [[0.1, 0.1]];

  const sampleRadii = (t: number): [number, number] => {
    if (normRadii.length === 1) return normRadii[0];
    const scaled = Math.max(0, Math.min(1, t)) * (normRadii.length - 1);
    const i0 = Math.floor(scaled);
    const i1 = Math.min(normRadii.length - 1, i0 + 1);
    const f = scaled - i0;
    return [
      normRadii[i0][0] + (normRadii[i1][0] - normRadii[i0][0]) * f,
      normRadii[i0][1] + (normRadii[i1][1] - normRadii[i0][1]) * f,
    ];
  };

  const tSegs = Math.max(2, Math.floor(tubularSegs));
  const rSegs = Math.max(4, Math.floor(radialSegs));

  const centers: THREE.Vector3[] = [];
  const tangents: THREE.Vector3[] = [];
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];
  const ringRadii: [number, number][] = [];

  for (let i = 0; i <= tSegs; i++) {
    const t = i / tSegs;
    centers.push(curve.getPoint(t));
    const tan = curve.getTangent(t).normalize();
    if (tan.lengthSq() < 1e-8) tan.set(0, 1, 0);
    tangents.push(tan);
    ringRadii.push(sampleRadii(t));
  }

  // Initial normal perpendicular to first tangent
  const up = Math.abs(tangents[0].y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const n0 = new THREE.Vector3().crossVectors(up, tangents[0]).normalize();
  const b0 = new THREE.Vector3().crossVectors(tangents[0], n0).normalize();
  normals.push(n0);
  binormals.push(b0);

  // Parallel transport frames along the curve
  const rotAxis = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  for (let i = 1; i <= tSegs; i++) {
    const prevN = normals[i - 1].clone();
    rotAxis.crossVectors(tangents[i - 1], tangents[i]);
    if (rotAxis.lengthSq() > 1e-10) {
      rotAxis.normalize();
      const dot = Math.max(-1, Math.min(1, tangents[i - 1].dot(tangents[i])));
      quat.setFromAxisAngle(rotAxis, Math.acos(dot));
      prevN.applyQuaternion(quat);
    }
    prevN.addScaledVector(tangents[i], -prevN.dot(tangents[i])).normalize();
    const bin = new THREE.Vector3().crossVectors(tangents[i], prevN).normalize();
    normals.push(prevN);
    binormals.push(bin);
  }

  // Build ring vertices & smooth normals
  const ringVerts: [number, number, number][][] = [];
  const ringVertNormals: [number, number, number][][] = [];

  for (let i = 0; i <= tSegs; i++) {
    const t = i / tSegs;
    const c = centers[i];
    const n = normals[i];
    const b = binormals[i];
    const [rx, ry] = ringRadii[i];
    const twist = twistRad * t;
    const verts: [number, number, number][] = [];
    const vNorms: [number, number, number][] = [];

    for (let j = 0; j <= rSegs; j++) {
      const theta = (j / rSegs) * Math.PI * 2 + twist;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let effRx = rx;
      let effRy = ry;
      if (ridgeAmp > 0 && sinT > 0.5) {
        const k = (sinT - 0.5) * 2;
        effRy += ridgeAmp * k * k;
      }
      if (bellyFlatten > 0 && sinT < -0.35) {
        effRy *= 1 - bellyFlatten * ((-sinT - 0.35) / 0.65);
      }

      const px = c.x + (n.x * cosT * effRx + b.x * sinT * effRy);
      const py = c.y + (n.y * cosT * effRx + b.y * sinT * effRy);
      const pz = c.z + (n.z * cosT * effRx + b.z * sinT * effRy);
      verts.push([px, py, pz]);

      // Elliptical normal: (cosT / rx, sinT / ry)
      const nx = n.x * (cosT / Math.max(1e-4, effRx)) + b.x * (sinT / Math.max(1e-4, effRy));
      const ny = n.y * (cosT / Math.max(1e-4, effRx)) + b.y * (sinT / Math.max(1e-4, effRy));
      const nz = n.z * (cosT / Math.max(1e-4, effRx)) + b.z * (sinT / Math.max(1e-4, effRy));
      const len = Math.hypot(nx, ny, nz) || 1;
      vNorms.push([nx / len, ny / len, nz / len]);
    }
    ringVerts.push(verts);
    ringVertNormals.push(vNorms);
  }

  const acc = createAccum();

  for (let i = 0; i < tSegs; i++) {
    const v0 = i / tSegs;
    const v1 = (i + 1) / tSegs;
    for (let j = 0; j < rSegs; j++) {
      const u0 = j / rSegs;
      const u1 = (j + 1) / rSegs;
      const p00 = ringVerts[i][j];
      const p10 = ringVerts[i][j + 1];
      const p11 = ringVerts[i + 1][j + 1];
      const p01 = ringVerts[i + 1][j];

      const n00 = ringVertNormals[i][j];
      const n10 = ringVertNormals[i][j + 1];
      const n11 = ringVertNormals[i + 1][j + 1];
      const n01 = ringVertNormals[i + 1][j];

      const avgN: [number, number, number] = [
        (n00[0] + n10[0] + n11[0] + n01[0]) * 0.25,
        (n00[1] + n10[1] + n11[1] + n01[1]) * 0.25,
        (n00[2] + n10[2] + n11[2] + n01[2]) * 0.25,
      ];
      const smooth = flatShaded ? undefined : ([n00, n10, n11, n01] as [
        [number, number, number],
        [number, number, number],
        [number, number, number],
        [number, number, number],
      ]);
      pushQuadWithHint(acc, p00, p10, p11, p01, [u0, v0], [u1, v0], [u1, v1], [u0, v1], avgN, smooth);
    }
  }

  if (capStart) {
    const c0: [number, number, number] = [centers[0].x, centers[0].y, centers[0].z];
    const capN: [number, number, number] = [-tangents[0].x, -tangents[0].y, -tangents[0].z];
    for (let j = 0; j < rSegs; j++) {
      pushTriWithHint(acc, c0, ringVerts[0][j + 1], ringVerts[0][j], [0.5, 0], [0, 0], [1, 0], capN);
    }
  }

  if (capEnd) {
    const c1: [number, number, number] = [centers[tSegs].x, centers[tSegs].y, centers[tSegs].z];
    const capN: [number, number, number] = [tangents[tSegs].x, tangents[tSegs].y, tangents[tSegs].z];
    for (let j = 0; j < rSegs; j++) {
      pushTriWithHint(acc, c1, ringVerts[tSegs][j], ringVerts[tSegs][j + 1], [0.5, 1], [0, 1], [1, 1], capN);
    }
  }

  return finishAccumToGeometry(acc, colorHex, shadeJitter);
}

// ---------------------------------------------------------------------------
// 6. Loop Subdivision & Sculpted Anatomical Limb / Torso / Armor Builders
// ---------------------------------------------------------------------------

export interface LoopSubdivideOptions {
  /** Recompute area-weighted smooth normals across welded vertices (default: true). */
  smoothNormals?: boolean;
  /** Optional vertex-color fallback hex if input geometry has no color attribute. */
  defaultHex?: string;
}

/**
 * Watertight Loop Subdivision for triangle BufferGeometries.
 * Welds spatial positions for smooth C2 surface fairing while interpolating UVs and
 * vertex colors strictly per-triangle so UV seams and material borders never smear.
 */
export function subdivideGeometryLoop(
  geo: THREE.BufferGeometry,
  iterations = 1,
  options: LoopSubdivideOptions = {}
): THREE.BufferGeometry {
  const iters = Math.max(0, Math.min(3, Math.round(iterations)));
  const smoothNormals = options.smoothNormals ?? true;
  let current = geo.index ? geo.toNonIndexed() : geo.clone();
  if (!current.getAttribute('normal')) {
    current.computeVertexNormals();
  }

  for (let step = 0; step < iters; step++) {
    const pos = current.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!pos || pos.count < 3) break;

    const uvAttr = current.getAttribute('uv') as THREE.BufferAttribute | undefined;
    const colAttr = current.getAttribute('color') as THREE.BufferAttribute | undefined;
    const nrmAttr = current.getAttribute('normal') as THREE.BufferAttribute | undefined;
    const triCount = Math.floor(pos.count / 3);
    if (triCount === 0 || triCount > 25000) break;

    // 1. Weld spatial vertex coordinates
    const spatialKeyToIdx = new Map<string, number>();
    const spatialPos: [number, number, number][] = [];
    const cornerSpatial = new Int32Array(triCount * 3);

    for (let c = 0; c < triCount * 3; c++) {
      const x = pos.getX(c);
      const y = pos.getY(c);
      const z = pos.getZ(c);
      const key = `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`;
      let sIdx = spatialKeyToIdx.get(key);
      if (sIdx === undefined) {
        sIdx = spatialPos.length;
        spatialKeyToIdx.set(key, sIdx);
        spatialPos.push([x, y, z]);
      }
      cornerSpatial[c] = sIdx;
    }

    // 2. Build edge adjacency & vertex neighbors
    interface EdgeInfo {
      a: number;
      b: number;
      opposites: number[];
    }
    const edgeMap = new Map<string, EdgeInfo>();
    const neighbors: Set<number>[] = Array.from({ length: spatialPos.length }, () => new Set<number>());

    const edgeKey = (u: number, v: number) => (u < v ? `${u}_${v}` : `${v}_${u}`);
    const registerEdge = (u: number, v: number, opp: number) => {
      if (u === v) return;
      neighbors[u].add(v);
      neighbors[v].add(u);
      const k = edgeKey(u, v);
      let info = edgeMap.get(k);
      if (!info) {
        info = { a: Math.min(u, v), b: Math.max(u, v), opposites: [] };
        edgeMap.set(k, info);
      }
      info.opposites.push(opp);
    };

    for (let t = 0; t < triCount; t++) {
      const s0 = cornerSpatial[t * 3 + 0];
      const s1 = cornerSpatial[t * 3 + 1];
      const s2 = cornerSpatial[t * 3 + 2];
      registerEdge(s0, s1, s2);
      registerEdge(s1, s2, s0);
      registerEdge(s2, s0, s1);
    }

    // 3. Compute new Loop vertex positions
    const newSpatialPos: [number, number, number][] = new Array(spatialPos.length);
    for (let v = 0; v < spatialPos.length; v++) {
      const nbs = Array.from(neighbors[v]);
      const k = nbs.length;
      if (k === 0) {
        newSpatialPos[v] = spatialPos[v];
        continue;
      }
      const boundaryNbs: number[] = [];
      for (const nb of nbs) {
        const info = edgeMap.get(edgeKey(v, nb));
        if (info && info.opposites.length === 1) {
          boundaryNbs.push(nb);
        }
      }
      const p = spatialPos[v];
      if (boundaryNbs.length >= 2) {
        const b0 = spatialPos[boundaryNbs[0]];
        const b1 = spatialPos[boundaryNbs[1]];
        newSpatialPos[v] = [
          0.75 * p[0] + 0.125 * (b0[0] + b1[0]),
          0.75 * p[1] + 0.125 * (b0[1] + b1[1]),
          0.75 * p[2] + 0.125 * (b0[2] + b1[2]),
        ];
      } else {
        const beta = k === 3 ? 3 / 16 : 3 / (8 * k);
        const selfW = 1 - k * beta;
        let sx = 0,
          sy = 0,
          sz = 0;
        for (const nb of nbs) {
          sx += spatialPos[nb][0];
          sy += spatialPos[nb][1];
          sz += spatialPos[nb][2];
        }
        newSpatialPos[v] = [selfW * p[0] + beta * sx, selfW * p[1] + beta * sy, selfW * p[2] + beta * sz];
      }
    }

    // 4. Compute new Loop edge points
    const edgeMidPos = new Map<string, [number, number, number]>();
    for (const [k, info] of edgeMap.entries()) {
      const pa = spatialPos[info.a];
      const pb = spatialPos[info.b];
      if (info.opposites.length === 2) {
        const pc = spatialPos[info.opposites[0]];
        const pd = spatialPos[info.opposites[1]];
        edgeMidPos.set(k, [
          0.375 * (pa[0] + pb[0]) + 0.125 * (pc[0] + pd[0]),
          0.375 * (pa[1] + pb[1]) + 0.125 * (pc[1] + pd[1]),
          0.375 * (pa[2] + pb[2]) + 0.125 * (pc[2] + pd[2]),
        ]);
      } else {
        edgeMidPos.set(k, [0.5 * (pa[0] + pb[0]), 0.5 * (pa[1] + pb[1]), 0.5 * (pa[2] + pb[2])]);
      }
    }

    // 5. Emit 4 subdivided triangles per input triangle
    const outCount = triCount * 12;
    const outPos = new Float32Array(outCount * 3);
    const outNrm = new Float32Array(outCount * 3);
    const outUv = new Float32Array(outCount * 2);
    const hasCol = Boolean(colAttr || options.defaultHex);
    const outCol = hasCol ? new Float32Array(outCount * 3) : null;
    const defCol = options.defaultHex ? new THREE.Color(options.defaultHex) : new THREE.Color('#ffffff');

    const getUv = (c: number): [number, number] => (uvAttr ? [uvAttr.getX(c), uvAttr.getY(c)] : [0, 0]);
    const getCol = (c: number): [number, number, number] =>
      colAttr ? [colAttr.getX(c), colAttr.getY(c), colAttr.getZ(c)] : [defCol.r, defCol.g, defCol.b];
    const getNrm = (c: number): [number, number, number] =>
      nrmAttr ? [nrmAttr.getX(c), nrmAttr.getY(c), nrmAttr.getZ(c)] : [0, 1, 0];

    let ptr = 0;
    const pushVert = (
      p: [number, number, number],
      n: [number, number, number],
      uv: [number, number],
      col: [number, number, number]
    ) => {
      outPos[ptr * 3 + 0] = p[0];
      outPos[ptr * 3 + 1] = p[1];
      outPos[ptr * 3 + 2] = p[2];
      const nl = Math.hypot(n[0], n[1], n[2]) || 1;
      outNrm[ptr * 3 + 0] = n[0] / nl;
      outNrm[ptr * 3 + 1] = n[1] / nl;
      outNrm[ptr * 3 + 2] = n[2] / nl;
      outUv[ptr * 2 + 0] = uv[0];
      outUv[ptr * 2 + 1] = uv[1];
      if (outCol) {
        outCol[ptr * 3 + 0] = col[0];
        outCol[ptr * 3 + 1] = col[1];
        outCol[ptr * 3 + 2] = col[2];
      }
      ptr++;
    };

    const avg2 = <T extends number[]>(a: T, b: T): T =>
      a.map((v, idx) => 0.5 * (v + b[idx])) as T;

    for (let t = 0; t < triCount; t++) {
      const c0 = t * 3 + 0;
      const c1 = t * 3 + 1;
      const c2 = t * 3 + 2;
      const s0 = cornerSpatial[c0];
      const s1 = cornerSpatial[c1];
      const s2 = cornerSpatial[c2];

      const p0 = newSpatialPos[s0];
      const p1 = newSpatialPos[s1];
      const p2 = newSpatialPos[s2];
      const pm01 = edgeMidPos.get(edgeKey(s0, s1)) ?? avg2(p0, p1);
      const pm12 = edgeMidPos.get(edgeKey(s1, s2)) ?? avg2(p1, p2);
      const pm20 = edgeMidPos.get(edgeKey(s2, s0)) ?? avg2(p2, p0);

      const u0 = getUv(c0), u1 = getUv(c1), u2 = getUv(c2);
      const um01 = avg2(u0, u1), um12 = avg2(u1, u2), um20 = avg2(u2, u0);

      const k0 = getCol(c0), k1 = getCol(c1), k2 = getCol(c2);
      const km01 = avg2(k0, k1), km12 = avg2(k1, k2), km20 = avg2(k2, k0);

      const n0 = getNrm(c0), n1 = getNrm(c1), n2 = getNrm(c2);
      const nm01 = avg2(n0, n1), nm12 = avg2(n1, n2), nm20 = avg2(n2, n0);

      // Tri A: (0, m01, m20)
      pushVert(p0, n0, u0, k0);
      pushVert(pm01, nm01, um01, km01);
      pushVert(pm20, nm20, um20, km20);
      // Tri B: (m01, 1, m12)
      pushVert(pm01, nm01, um01, km01);
      pushVert(p1, n1, u1, k1);
      pushVert(pm12, nm12, um12, km12);
      // Tri C: (m20, m12, 2)
      pushVert(pm20, nm20, um20, km20);
      pushVert(pm12, nm12, um12, km12);
      pushVert(p2, n2, u2, k2);
      // Tri D: (m01, m12, m20)
      pushVert(pm01, nm01, um01, km01);
      pushVert(pm12, nm12, um12, km12);
      pushVert(pm20, nm20, um20, km20);
    }

    if (smoothNormals) {
      const accumN = new Map<string, [number, number, number]>();
      for (let t = 0; t < triCount * 4; t++) {
        const i0 = t * 3, i1 = t * 3 + 1, i2 = t * 3 + 2;
        const ax = outPos[i1 * 3] - outPos[i0 * 3];
        const ay = outPos[i1 * 3 + 1] - outPos[i0 * 3 + 1];
        const az = outPos[i1 * 3 + 2] - outPos[i0 * 3 + 2];
        const bx = outPos[i2 * 3] - outPos[i0 * 3];
        const by = outPos[i2 * 3 + 1] - outPos[i0 * 3 + 1];
        const bz = outPos[i2 * 3 + 2] - outPos[i0 * 3 + 2];
        const fnx = ay * bz - az * by;
        const fny = az * bx - ax * bz;
        const fnz = ax * by - ay * bx;
        for (const vi of [i0, i1, i2]) {
          const key = `${Math.round(outPos[vi * 3] * 1e5)},${Math.round(outPos[vi * 3 + 1] * 1e5)},${Math.round(outPos[vi * 3 + 2] * 1e5)}`;
          let accN = accumN.get(key);
          if (!accN) {
            accN = [0, 0, 0];
            accumN.set(key, accN);
          }
          accN[0] += fnx;
          accN[1] += fny;
          accN[2] += fnz;
        }
      }
      for (let i = 0; i < outCount; i++) {
        const key = `${Math.round(outPos[i * 3] * 1e5)},${Math.round(outPos[i * 3 + 1] * 1e5)},${Math.round(outPos[i * 3 + 2] * 1e5)}`;
        const accN = accumN.get(key);
        if (accN) {
          const l = Math.hypot(accN[0], accN[1], accN[2]);
          if (l > 1e-8) {
            outNrm[i * 3] = accN[0] / l;
            outNrm[i * 3 + 1] = accN[1] / l;
            outNrm[i * 3 + 2] = accN[2] / l;
          }
        }
      }
    }

    const nextGeo = new THREE.BufferGeometry();
    nextGeo.setAttribute('position', new THREE.Float32BufferAttribute(outPos, 3));
    nextGeo.setAttribute('normal', new THREE.Float32BufferAttribute(outNrm, 3));
    nextGeo.setAttribute('uv', new THREE.Float32BufferAttribute(outUv, 2));
    if (outCol) {
      nextGeo.setAttribute('color', new THREE.Float32BufferAttribute(outCol, 3));
    }
    nextGeo.userData = { ...current.userData };
    current.dispose();
    current = nextGeo;
  }

  current.computeBoundingBox();
  current.computeBoundingSphere();
  return current;
}

export type SculptedLimbProfile =
  | 'bicep'
  | 'forearm'
  | 'thigh'
  | 'calf'
  | 'armor_limb'
  | 'taper'
  | 'cylinder';

export interface SculptedLimbOptions {
  profile?: SculptedLimbProfile;
  radialSegs?: number;
  heightSegs?: number;
  hexColor?: string;
  shadeJitter?: number;
  /** Optional subtle muscle/armor rib intensity (default 1.0). */
  sculptStrength?: number;
}

/**
 * Generates an organic sculpted limb or contoured armor segment along bone local `+Y` (`y = 0 .. length`),
 * replacing rigid beveled limb boxes with anatomical muscle curves & smooth vertex normals.
 */
export function makeSculptedLimbGeometry(
  length: number,
  radiusBottomX: number,
  radiusBottomZ: number,
  radiusTopX: number,
  radiusTopZ: number,
  options: SculptedLimbOptions = {}
): THREE.BufferGeometry {
  const profile = options.profile ?? 'taper';
  const rSegs = Math.max(8, Math.round(options.radialSegs ?? 14));
  const hSegs = Math.max(4, Math.round(options.heightSegs ?? 7));
  const hexColor = options.hexColor ?? '#ffffff';
  const strength = options.sculptStrength ?? 1.0;
  const acc = createAccum();

  const evalRing = (iy: number): { pos: [number, number, number][]; nrm: [number, number, number][] } => {
    const t = iy / hSegs; // 0 = bottom joint, 1 = top joint
    const y = t * length;
    const baseRx = radiusBottomX * (1 - t) + radiusTopX * t;
    const baseRz = radiusBottomZ * (1 - t) + radiusTopZ * t;

    // Anatomical axial profile swell
    let axialScaleX = 1.0;
    let axialScaleZ = 1.0;
    let zShift = 0;
    if (profile === 'thigh') {
      // Quadriceps anterior swell & hamstring curve (y=0 hip -> y=len knee)
      const quad = Math.sin(t * Math.PI) * 0.14 * strength;
      axialScaleX += quad * 0.65;
      axialScaleZ += quad;
      zShift = Math.sin(t * Math.PI) * baseRz * 0.08 * strength;
    } else if (profile === 'calf') {
      // Gastrocnemius bulge around t = 0.34 (below knee y=0), slim ankle toward t -> 1
      const gastro = Math.exp(-Math.pow((t - 0.34) / 0.24, 2)) * 0.24 * strength;
      axialScaleX += gastro * 0.72;
      axialScaleZ += gastro;
      zShift = -Math.exp(-Math.pow((t - 0.34) / 0.26, 2)) * baseRz * 0.16 * strength;
    } else if (profile === 'bicep') {
      // Deltoid cap near t=0.18 (shoulder y=0) + bicep belly at t=0.52
      const delt = Math.exp(-Math.pow((t - 0.16) / 0.2, 2)) * 0.18 * strength;
      const bic = Math.exp(-Math.pow((t - 0.52) / 0.24, 2)) * 0.12 * strength;
      axialScaleX += delt + bic * 0.5;
      axialScaleZ += delt * 0.8 + bic;
    } else if (profile === 'forearm') {
      // Brachioradialis swell near t=0.32 (below elbow y=0), wrist taper toward t -> 1
      const brach = Math.exp(-Math.pow((t - 0.32) / 0.25, 2)) * 0.16 * strength;
      axialScaleX += brach;
      axialScaleZ += brach * 0.85;
    } else if (profile === 'armor_limb') {
      // Flared cuff rims near t=0.1 and t=0.9 + central plate arch
      const cuffLow = Math.exp(-Math.pow((t - 0.09) / 0.08, 2)) * 0.11 * strength;
      const cuffHi = Math.exp(-Math.pow((t - 0.9) / 0.08, 2)) * 0.12 * strength;
      const belly = Math.sin(t * Math.PI) * 0.08 * strength;
      axialScaleX += cuffLow + cuffHi + belly;
      axialScaleZ += cuffLow + cuffHi + belly;
    } else if (profile === 'taper') {
      const belly = Math.sin(t * Math.PI) * 0.08 * strength;
      axialScaleX += belly;
      axialScaleZ += belly;
    }

    // Gentle end-bevel tuck so joint seams look rounded instead of razor-sharp cylinders
    const endTuck =
      iy === 0 || iy === hSegs ? 0.86 : iy === 1 || iy === hSegs - 1 ? 0.98 : 1.0;

    const ringPos: [number, number, number][] = [];
    const ringNrm: [number, number, number][] = [];
    for (let s = 0; s <= rSegs; s++) {
      const theta = (s / rSegs) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Subtle shin/armor front ridge along +Z (sinT > 0.5)
      let ridgeMod = 1.0;
      if ((profile === 'armor_limb' || profile === 'calf') && sinT > 0.45) {
        ridgeMod += 0.07 * (sinT - 0.45) * strength;
      }

      const rx = Math.max(1e-4, baseRx * axialScaleX * endTuck);
      const rz = Math.max(1e-4, baseRz * axialScaleZ * endTuck * ridgeMod);
      const px = cosT * rx;
      const pz = sinT * rz + zShift;
      ringPos.push([px, y, pz]);

      const nx = cosT / rx;
      const nz = sinT / rz;
      const ny = iy === 0 ? -0.25 : iy === hSegs ? 0.25 : 0;
      const len = Math.hypot(nx, ny, nz) || 1;
      ringNrm.push([nx / len, ny / len, nz / len]);
    }
    return { pos: ringPos, nrm: ringNrm };
  };

  const rings = Array.from({ length: hSegs + 1 }, (_, iy) => evalRing(iy));
  for (let iy = 0; iy < hSegs; iy++) {
    const v0 = iy / hSegs;
    const v1 = (iy + 1) / hSegs;
    for (let s = 0; s < rSegs; s++) {
      const u0 = s / rSegs;
      const u1 = (s + 1) / rSegs;
      const p00 = rings[iy].pos[s];
      const p10 = rings[iy].pos[s + 1];
      const p11 = rings[iy + 1].pos[s + 1];
      const p01 = rings[iy + 1].pos[s];
      const n00 = rings[iy].nrm[s];
      const n10 = rings[iy].nrm[s + 1];
      const n11 = rings[iy + 1].nrm[s + 1];
      const n01 = rings[iy + 1].nrm[s];
      const hint: [number, number, number] = [
        (n00[0] + n10[0] + n11[0] + n01[0]) * 0.25,
        0,
        (n00[2] + n10[2] + n11[2] + n01[2]) * 0.25,
      ];
      pushQuadWithHint(
        acc,
        p00,
        p10,
        p11,
        p01,
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        hint,
        [n00, n10, n11, n01]
      );
    }
  }

  // Watertight domed bottom & top caps
  const botCenter: [number, number, number] = [0, 0, 0];
  const topCenter: [number, number, number] = [0, length, 0];
  for (let s = 0; s < rSegs; s++) {
    pushTriWithHint(
      acc,
      botCenter,
      rings[0].pos[s],
      rings[0].pos[s + 1],
      [0.5, 0.5],
      [0.5 + 0.5 * Math.cos((s / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / rSegs) * Math.PI * 2)],
      [0.5 + 0.5 * Math.cos(((s + 1) / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin(((s + 1) / rSegs) * Math.PI * 2)],
      [0, -1, 0]
    );
    pushTriWithHint(
      acc,
      topCenter,
      rings[hSegs].pos[s + 1],
      rings[hSegs].pos[s],
      [0.5, 0.5],
      [0.5 + 0.5 * Math.cos(((s + 1) / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin(((s + 1) / rSegs) * Math.PI * 2)],
      [0.5 + 0.5 * Math.cos((s / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / rSegs) * Math.PI * 2)],
      [0, 1, 0]
    );
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0);
}

export interface AnatomicalTorsoOptions {
  isArmored?: boolean;
  radialSegs?: number;
  heightSegs?: number;
  hexColor?: string;
  shadeJitter?: number;
  centered?: boolean;
  /** Pectoral/ribcage bulge amplitude (default 1.0). */
  musculature?: number;
}

/**
 * Generates an anatomical sculpted torso / breastplate segment spanning `y = 0 .. length`
 * (or centered around `y = 0` when `centered: true`), featuring pectoral swell, sternal keel/groove,
 * dorsal spine contour, and waist-to-shoulder V-taper.
 */
export function makeAnatomicalTorsoGeometry(
  length: number,
  bottomRX: number,
  bottomRZ: number,
  topRX: number,
  topRZ: number,
  options: AnatomicalTorsoOptions = {}
): THREE.BufferGeometry {
  const isArmored = options.isArmored ?? false;
  const rSegs = Math.max(10, Math.round(options.radialSegs ?? 18));
  const hSegs = Math.max(4, Math.round(options.heightSegs ?? 8));
  const hexColor = options.hexColor ?? '#ffffff';
  const musc = options.musculature ?? 1.0;
  const yStart = options.centered ? -length * 0.5 : 0;
  const acc = createAccum();

  const evalRing = (iy: number): { pos: [number, number, number][]; nrm: [number, number, number][] } => {
    const t = iy / hSegs;
    const y = yStart + t * length;
    const baseRx = bottomRX * (1 - t) + topRX * t;
    const baseRz = bottomRZ * (1 - t) + topRZ * t;

    // Ribcage flare at upper chest (t ~ 0.65) and subtle waist taper near t ~ 0.2
    const ribFlare = Math.sin(t * Math.PI) * 0.08 * musc;
    const endBevel = iy === 0 || iy === hSegs ? 0.9 : 1.0;

    const ringPos: [number, number, number][] = [];
    const ringNrm: [number, number, number][] = [];

    for (let s = 0; s <= rSegs; s++) {
      const theta = (s / rSegs) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Squared-ellipse superellipse blend gives broad heroic shoulders & flatter front/back chest
      const absC = Math.abs(cosT);
      const absS = Math.abs(sinT);
      const sqBlend = 0.88;
      const ex = Math.sign(cosT) * Math.pow(absC, sqBlend);
      const ez = Math.sign(sinT) * Math.pow(absS, sqBlend);

      let rx = Math.max(1e-4, baseRx * (1 + ribFlare) * endBevel);
      let rz = Math.max(1e-4, baseRz * (1 + ribFlare * 0.8) * endBevel);
      let zOffset = 0;

      // Front (+Z, sinT > 0): Pectoralis / Sternal keel (armored) or sternal furrow (organic)
      if (sinT > 0.1) {
        const pecBell = Math.exp(-Math.pow((t - 0.64) / 0.26, 2));
        const pecX = Math.exp(-Math.pow((absC - 0.45) / 0.34, 2));
        zOffset += pecBell * pecX * baseRz * 0.16 * musc;
        if (isArmored && absC < 0.28) {
          // Heroic breastplate medial keel
          zOffset += (1 - absC / 0.28) * baseRz * 0.12 * Math.sin(t * Math.PI) * musc;
        } else if (!isArmored && absC < 0.2) {
          // Subtle anatomical sternum groove
          zOffset -= (1 - absC / 0.2) * baseRz * 0.045 * pecBell * musc;
        }
      }
      // Back (-Z, sinT < -0.1): Scapula / trapezius swell + spinal furrow
      if (sinT < -0.1) {
        const scapX = Math.exp(-Math.pow((absC - 0.42) / 0.3, 2));
        zOffset -= scapX * baseRz * 0.08 * Math.sin(t * Math.PI) * musc;
        if (absC < 0.18) {
          zOffset += (1 - absC / 0.18) * baseRz * 0.06 * musc; // inward spinal valley
        }
      }
      if (isArmored && t > 0.86) {
        // Subtle raised collar / gorget flange
        rx *= 1.03;
        rz *= 1.03;
      }

      const px = ex * rx;
      const pz = ez * rz + zOffset;
      ringPos.push([px, y, pz]);

      const nx = cosT / rx;
      const nz = sinT / rz;
      const ny = iy === 0 ? -0.2 : iy === hSegs ? 0.2 : 0;
      const len = Math.hypot(nx, ny, nz) || 1;
      ringNrm.push([nx / len, ny / len, nz / len]);
    }
    return { pos: ringPos, nrm: ringNrm };
  };

  const rings = Array.from({ length: hSegs + 1 }, (_, iy) => evalRing(iy));
  for (let iy = 0; iy < hSegs; iy++) {
    const v0 = iy / hSegs;
    const v1 = (iy + 1) / hSegs;
    for (let s = 0; s < rSegs; s++) {
      const u0 = s / rSegs;
      const u1 = (s + 1) / rSegs;
      const p00 = rings[iy].pos[s];
      const p10 = rings[iy].pos[s + 1];
      const p11 = rings[iy + 1].pos[s + 1];
      const p01 = rings[iy + 1].pos[s];
      const n00 = rings[iy].nrm[s];
      const n10 = rings[iy].nrm[s + 1];
      const n11 = rings[iy + 1].nrm[s + 1];
      const n01 = rings[iy + 1].nrm[s];
      const hint: [number, number, number] = [
        (n00[0] + n10[0] + n11[0] + n01[0]) * 0.25,
        0,
        (n00[2] + n10[2] + n11[2] + n01[2]) * 0.25,
      ];
      pushQuadWithHint(
        acc,
        p00,
        p10,
        p11,
        p01,
        [u0, v0],
        [u1, v0],
        [u1, v1],
        [u0, v1],
        hint,
        [n00, n10, n11, n01]
      );
    }
  }

  // Watertight bottom & top caps
  const botCenter: [number, number, number] = [0, yStart, 0];
  const topCenter: [number, number, number] = [0, yStart + length, 0];
  for (let s = 0; s < rSegs; s++) {
    pushTriWithHint(
      acc,
      botCenter,
      rings[0].pos[s],
      rings[0].pos[s + 1],
      [0.5, 0.5],
      [0.5 + 0.5 * Math.cos((s / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / rSegs) * Math.PI * 2)],
      [0.5 + 0.5 * Math.cos(((s + 1) / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin(((s + 1) / rSegs) * Math.PI * 2)],
      [0, -1, 0]
    );
    pushTriWithHint(
      acc,
      topCenter,
      rings[hSegs].pos[s + 1],
      rings[hSegs].pos[s],
      [0.5, 0.5],
      [0.5 + 0.5 * Math.cos(((s + 1) / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin(((s + 1) / rSegs) * Math.PI * 2)],
      [0.5 + 0.5 * Math.cos((s / rSegs) * Math.PI * 2), 0.5 + 0.5 * Math.sin((s / rSegs) * Math.PI * 2)],
      [0, 1, 0]
    );
  }

  return finishAccumToGeometry(acc, hexColor, options.shadeJitter ?? 0);
}
