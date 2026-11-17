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
  | 'water_pool';

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
  segments = 6,
  baseRadius = 0.08,
  tipRadius = 0.01,
  length = 0.45,
  bendX = 0.14,
  bendZ = 0.1,
  radialSegs = 6,
  hexColor = '#cbb68a'
): THREE.BufferGeometry {
  const segCount = Math.max(2, segments);
  const radCount = Math.max(4, radialSegs);
  const acc = createAccum();

  const pts: THREE.Vector3[] = [];
  const radii: number[] = [];
  for (let i = 0; i <= segCount; i++) {
    const t = i / segCount;
    const x = bendX * (t * t * 1.45 - 0.15 * t);
    const y = length * (t - 0.12 * t * t);
    const z = bendZ * (t * t * 1.35 + 0.1 * t);
    pts.push(new THREE.Vector3(x, y, z));
    radii.push(baseRadius * (1 - t) + tipRadius * t);
  }

  const rings: [number, number, number][][] = [];
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
    for (let s = 0; s < radCount; s++) {
      const a = (s / radCount) * Math.PI * 2;
      const p = pts[i]
        .clone()
        .addScaledVector(refSide, Math.cos(a) * r)
        .addScaledVector(binormal, Math.sin(a) * r);
      ring.push([p.x, p.y, p.z]);
    }
    rings.push(ring);
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
      const midCenter = pts[i].clone().lerp(pts[i + 1], 0.5);
      const quadMid: [number, number, number] = [
        (a0[0] + b0[0] + a1[0] + b1[0]) * 0.25 - midCenter.x,
        (a0[1] + b0[1] + a1[1] + b1[1]) * 0.25 - midCenter.y,
        (a0[2] + b0[2] + a1[2] + b1[2]) * 0.25 - midCenter.z,
      ];
      pushQuadWithHint(acc, a0, b0, b1, a1, [u0, v0], [u1, v0], [u1, v1], [u0, v1], quadMid);
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
 * Curved multi-segment armored shoulder pauldron shell with outer/inner thickness (centered near origin).
 */
export function makePauldronShellGeometry(
  width = 0.26,
  height = 0.2,
  depth = 0.28,
  thickness = 0.045,
  hexColor = '#8f9eb3'
): THREE.BufferGeometry {
  const acc = createAccum();
  const uSegs = 4;
  const vSegs = 3;

  const sample = (uIdx: number, vIdx: number, outer: boolean): [number, number, number] => {
    const u = (uIdx / uSegs - 0.5) * Math.PI * 0.92; // forward-back wrap
    const v = (vIdx / vSegs) * Math.PI * 0.54; // 0 = crest, 1 = flared outer rim
    const rScale = outer ? 1.0 : Math.max(0.55, 1.0 - thickness / Math.max(0.12, width));
    const x = Math.sin(v) * width * 0.55 * rScale;
    const y = (Math.cos(v) - 0.45) * height * 0.72 * rScale;
    const z = Math.sin(u) * Math.max(0.35, Math.sin(v) * 0.85 + 0.32) * depth * 0.5 * rScale;
    return [x, y, z];
  };

  for (let vi = 0; vi < vSegs; vi++) {
    for (let ui = 0; ui < uSegs; ui++) {
      const a = sample(ui, vi, true);
      const b = sample(ui + 1, vi, true);
      const c = sample(ui + 1, vi + 1, true);
      const d = sample(ui, vi + 1, true);
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
        outHint
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
 * Tapered diamond cross-section sword blade starting at y=0 and rising along +Y to `bodyLen + tipLen`.
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
  const ht0 = thickness * 0.5;
  const ht1 = thickness * 0.4;
  const edgeTh = Math.max(0.004, thickness * 0.14);

  // Base oct-diamond at y=0, upper ring at y=bodyLen, tip at y=bodyLen+tipLen
  const pR0: [number, number, number] = [hw0, 0, 0];
  const pL0: [number, number, number] = [-hw0, 0, 0];
  const pF0: [number, number, number] = [0, 0, ht0];
  const pB0: [number, number, number] = [0, 0, -ht0];

  const pR1: [number, number, number] = [hw1, bodyLen, 0];
  const pL1: [number, number, number] = [-hw1, bodyLen, 0];
  const pF1: [number, number, number] = [0, bodyLen, ht1];
  const pB1: [number, number, number] = [0, bodyLen, -ht1];

  const tip: [number, number, number] = [0, bodyLen + tipLen, 0];

  // Bevel panels (4 crisp bevel facets along shaft + 4 tip bevel facets)
  pushQuadWithHint(acc, pR0, pF0, pF1, pR1, [0, 0], [1, 0], [1, 0.8], [0, 0.8], [1, 0, 1]);
  pushQuadWithHint(acc, pF0, pL0, pL1, pF1, [0, 0], [1, 0], [1, 0.8], [0, 0.8], [-1, 0, 1]);
  pushQuadWithHint(acc, pL0, pB0, pB1, pL1, [0, 0], [1, 0], [1, 0.8], [0, 0.8], [-1, 0, -1]);
  pushQuadWithHint(acc, pB0, pR0, pR1, pB1, [0, 0], [1, 0], [1, 0.8], [0, 0.8], [1, 0, -1]);

  pushTriWithHint(acc, pR1, pF1, tip, [0, 0.8], [1, 0.8], [0.5, 1], [1, 0.3, 1]);
  pushTriWithHint(acc, pF1, pL1, tip, [0, 0.8], [1, 0.8], [0.5, 1], [-1, 0.3, 1]);
  pushTriWithHint(acc, pL1, pB1, tip, [0, 0.8], [1, 0.8], [0.5, 1], [-1, 0.3, -1]);
  pushTriWithHint(acc, pB1, pR1, tip, [0, 0.8], [1, 0.8], [0.5, 1], [1, 0.3, -1]);

  // Base cap
  pushQuadWithHint(
    acc,
    pR0,
    [pB0[0], 0, Math.min(-edgeTh, pB0[2])],
    pL0,
    [pF0[0], 0, Math.max(edgeTh, pF0[2])],
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, -1, 0]
  );

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
    const segs = 4;
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
 * Faceted curved heater/kite shield facing outward along +Z.
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
  const bow = Math.min(0.08, width * 0.16);
  const rimT = thickness;

  // Outline ring (top-left, top-mid, top-right, waist-right, point-bot, waist-left)
  const pts2d: [number, number, number][] = [
    [-hw * 0.92, hh, -bow * 0.35],
    [0, hh * 1.04, bow * 0.5],
    [hw * 0.92, hh, -bow * 0.35],
    [hw, 0.02 * hh, -bow * 0.42],
    [hw * 0.54, -hh * 0.65, -bow * 0.2],
    [0, -hh, bow * 0.2],
    [-hw * 0.54, -hh * 0.65, -bow * 0.2],
    [-hw, 0.02 * hh, -bow * 0.42],
  ];
  const centerFront: [number, number, number] = [0, 0.06 * hh, bow + rimT * 0.5];
  const centerBack: [number, number, number] = [0, 0.06 * hh, bow - rimT * 0.5];

  const frontRing = pts2d.map((pt) => [pt[0], pt[1], pt[2] + rimT * 0.5] as [number, number, number]);
  const backRing = pts2d.map((pt) => [pt[0], pt[1], pt[2] - rimT * 0.5] as [number, number, number]);

  const n = pts2d.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const u0 = (frontRing[i][0] / width) + 0.5;
    const v0 = (frontRing[i][1] / height) + 0.5;
    const u1 = (frontRing[j][0] / width) + 0.5;
    const v1 = (frontRing[j][1] / height) + 0.5;

    pushTriWithHint(
      acc,
      centerFront,
      frontRing[i],
      frontRing[j],
      [0.5, 0.53],
      [u0, v0],
      [u1, v1],
      [0, 0, 1]
    );
    pushTriWithHint(
      acc,
      centerBack,
      backRing[j],
      backRing[i],
      [0.5, 0.53],
      [u1, v1],
      [u0, v0],
      [0, 0, -1]
    );
    const outX = (frontRing[i][0] + frontRing[j][0]) * 0.5;
    const outY = (frontRing[i][1] + frontRing[j][1]) * 0.5;
    pushQuadWithHint(
      acc,
      frontRing[i],
      backRing[i],
      backRing[j],
      frontRing[j],
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
  const segs = 10;
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

  const ringPts = (s: { y: number; z: number; rx: number; rz: number }): [number, number, number][] => [
    [s.rx, s.y, s.z],
    [0, s.y, s.z + s.rz],
    [-s.rx, s.y, s.z],
    [0, s.y, s.z - s.rz],
  ];

  const rings = Array.from({ length: segs + 1 }, (_, i) => ringPts(spineAt(i / segs)));
  for (let i = 0; i < segs; i++) {
    const v0 = i / segs;
    const v1 = (i + 1) / segs;
    for (let k = 0; k < 4; k++) {
      const kNext = (k + 1) % 4;
      const a0 = rings[i][k],
        b0 = rings[i][kNext],
        a1 = rings[i + 1][k],
        b1 = rings[i + 1][kNext];
      const outDir: [number, number, number] = [
        k === 0 ? 1 : k === 2 ? -1 : 0,
        0,
        k === 1 ? 1 : k === 3 ? -1 : 0,
      ];
      pushQuadWithHint(acc, a0, b0, b1, a1, [k / 4, v0], [(k + 1) / 4, v0], [(k + 1) / 4, v1], [k / 4, v1], outDir);
    }
  }
  // End caps
  pushQuadWithHint(acc, rings[0][0], rings[0][1], rings[0][2], rings[0][3], [0, 0], [1, 0], [1, 1], [0, 1], [0, -1, 0]);
  pushQuadWithHint(
    acc,
    rings[segs][0],
    rings[segs][3],
    rings[segs][2],
    rings[segs][1],
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 1, 0]
  );

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
 * soffit undersides, ridge beam cap, and triangular masonry/timber gable fills.
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
  } = {}
): PitchedRoofResult {
  const style = options.style ?? 'gable';
  const roofHex = options.roofHex ?? '#8a3e38';
  const trimHex = options.trimHex ?? '#4a3322';
  const gableHex = options.gableHex ?? '#c9beaa';

  const hw = width * 0.5 + overhang;
  const hd = depth * 0.5 + overhang;
  const bHw = width * 0.5;
  const bHd = depth * 0.5;
  const accRoof = createAccum();
  const accGable = createAccum();

  if (style === 'gable') {
    // Ridge along Z axis (x = 0)
    const ridgeTop: [number, number, number][] = [
      [0, peakHeight + slabThickness, hd],
      [0, peakHeight + slabThickness, -hd],
    ];
    const ridgeBot: [number, number, number][] = [
      [0, peakHeight, hd],
      [0, peakHeight, -hd],
    ];

    const eaveRTopFront: [number, number, number] = [hw, slabThickness, hd];
    const eaveRTopBack: [number, number, number] = [hw, slabThickness, -hd];
    const eaveRBotFront: [number, number, number] = [hw, 0, hd];
    const eaveRBotBack: [number, number, number] = [hw, 0, -hd];

    const eaveLTopFront: [number, number, number] = [-hw, slabThickness, hd];
    const eaveLTopBack: [number, number, number] = [-hw, slabThickness, -hd];
    const eaveLBotFront: [number, number, number] = [-hw, 0, hd];
    const eaveLBotBack: [number, number, number] = [-hw, 0, -hd];

    // Top pitched slopes (Right +X, Left -X)
    pushQuadWithHint(accRoof, eaveRTopFront, eaveRTopBack, ridgeTop[1], ridgeTop[0], [0, 0], [1, 0], [1, 1], [0, 1], [1, 1, 0]);
    pushQuadWithHint(accRoof, eaveLTopBack, eaveLTopFront, ridgeTop[0], ridgeTop[1], [0, 0], [1, 0], [1, 1], [0, 1], [-1, 1, 0]);

    // Bottom soffits
    pushQuadWithHint(accRoof, eaveRBotBack, eaveRBotFront, ridgeBot[0], ridgeBot[1], [0, 0], [1, 0], [1, 1], [0, 1], [-1, -1, 0]);
    pushQuadWithHint(accRoof, eaveLBotFront, eaveLBotBack, ridgeBot[1], ridgeBot[0], [0, 0], [1, 0], [1, 1], [0, 1], [1, -1, 0]);

    // Side fascias
    pushQuadWithHint(accRoof, eaveRBotFront, eaveRBotBack, eaveRTopBack, eaveRTopFront, [0, 0], [1, 0], [1, 1], [0, 1], [1, 0, 0]);
    pushQuadWithHint(accRoof, eaveLBotBack, eaveLBotFront, eaveLTopFront, eaveLTopBack, [0, 0], [1, 0], [1, 1], [0, 1], [-1, 0, 0]);

    // Front & back rake fascia caps
    pushQuadWithHint(accRoof, ridgeBot[0], eaveRBotFront, eaveRTopFront, ridgeTop[0], [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
    pushQuadWithHint(accRoof, eaveLBotFront, ridgeBot[0], ridgeTop[0], eaveLTopFront, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, 1]);
    pushQuadWithHint(accRoof, eaveRBotBack, ridgeBot[1], ridgeTop[1], eaveRTopBack, [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);
    pushQuadWithHint(accRoof, ridgeBot[1], eaveLBotBack, eaveLTopBack, ridgeTop[1], [0, 0], [1, 0], [1, 1], [0, 1], [0, 0, -1]);

    // Gable triangular walls recessed cleanly under eaves
    const gh = Math.max(0.15, peakHeight - (overhang / Math.max(0.25, bHw)) * peakHeight * 0.25);
    pushTriWithHint(accGable, [-bHw, 0, bHd], [bHw, 0, bHd], [0, gh, bHd], [0, 0], [1, 0], [0.5, 1], [0, 0, 1]);
    pushTriWithHint(accGable, [bHw, 0, -bHd], [-bHw, 0, -bHd], [0, gh, -bHd], [0, 0], [1, 0], [0.5, 1], [0, 0, -1]);
  } else {
    // Hip roof: 4 pitched trapezoidal/triangular faces converging to shorter ridge line along Z
    const ridgeHalfZ = Math.max(0.05, hd - hw * 0.85);
    const rFTop: [number, number, number] = [0, peakHeight + slabThickness, ridgeHalfZ];
    const rBTop: [number, number, number] = [0, peakHeight + slabThickness, -ridgeHalfZ];
    const rFBot: [number, number, number] = [0, peakHeight, ridgeHalfZ];
    const rBBot: [number, number, number] = [0, peakHeight, -ridgeHalfZ];

    const cRFTop: [number, number, number] = [hw, slabThickness, hd];
    const cRBTop: [number, number, number] = [hw, slabThickness, -hd];
    const cLBTop: [number, number, number] = [-hw, slabThickness, -hd];
    const cLFTop: [number, number, number] = [-hw, slabThickness, hd];

    const cRFBot: [number, number, number] = [hw, 0, hd];
    const cRBBot: [number, number, number] = [hw, 0, -hd];
    const cLBBot: [number, number, number] = [-hw, 0, -hd];
    const cLFBot: [number, number, number] = [-hw, 0, hd];

    // Top faces
    pushQuadWithHint(accRoof, cRFTop, cRBTop, rBTop, rFTop, [0, 0], [1, 0], [0.85, 1], [0.15, 1], [1, 1, 0]);
    pushQuadWithHint(accRoof, cLBTop, cLFTop, rFTop, rBTop, [0, 0], [1, 0], [0.85, 1], [0.15, 1], [-1, 1, 0]);
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
  const ridgeTrim = makeBeveledBox(0.16, 0.14, ridgeLen, 0.025, trimHex, {
    offset: [0, peakHeight + slabThickness + 0.02, 0],
  });

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
  resolution = 16,
  hexColor = '#667788',
  options: {
    flatShaded?: boolean;
    shadeJitter?: number;
  } = {}
): THREE.BufferGeometry {
  const n = Math.max(6, Math.min(36, Math.round(resolution)));
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

  const emitCellQuad = (v0: number, v1: number, v2: number, v3: number, flip: boolean) => {
    if (v0 < 0 || v1 < 0 || v2 < 0 || v3 < 0) return;
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
  };

  // Emit quads dual to surface-crossing grid edges
  for (let iz = 1; iz < gN - 1; iz++) {
    for (let iy = 1; iy < gN - 1; iy++) {
      for (let ix = 1; ix < gN - 1; ix++) {
        const vHere = valAt(ix, iy, iz);
        const inside = vHere < 0;

        // Edge along +X: shared by cells (ix, iy-1, iz-1), (ix, iy, iz-1), (ix, iy, iz), (ix, iy-1, iz)
        if (ix + 1 < gN) {
          const vX = valAt(ix + 1, iy, iz) < 0;
          if (inside !== vX) {
            emitCellQuad(
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
            emitCellQuad(
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
            emitCellQuad(
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
