import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { findDitherPair, hexToRgb, type RGB } from './palettes';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from './PixelizerMaterial';
import { bindGeometryToUalSkeleton } from './rigging/AutoRigBinder';
import {
  createCanonicalUalRig,
  type CanonicalUalRig,
  type UalGenderProfile,
} from './rigging/UalRigSpec';
import type {
  PixelizerMaterialOptions,
  VoxelEntry,
  VoxelGridResult,
  VoxelizerOptions,
} from './types';

interface TextureSampler {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  flipY: boolean;
  wrapRepeatS: boolean;
  wrapRepeatT: boolean;
}

const _tmpV0 = new THREE.Vector3();
const _tmpV1 = new THREE.Vector3();
const _tmpV2 = new THREE.Vector3();
const _closest = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _ap = new THREE.Vector3();
const _bp = new THREE.Vector3();
const _cp = new THREE.Vector3();
const _pointVec = new THREE.Vector3();
const _triBox = new THREE.Box3();
const _srgbHelper = new THREE.Color();
const _vcolSrgb = new THREE.Color();

function createTextureSampler(tex: THREE.Texture | null | undefined): TextureSampler | null {
  if (!tex || !tex.image || typeof document === 'undefined') return null;
  const img = tex.image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number };
  const rawW = img.width || img.videoWidth || 0;
  const rawH = img.height || img.videoHeight || 0;
  if (rawW <= 0 || rawH <= 0) return null;

  const w = Math.min(1024, rawW);
  const h = Math.min(1024, rawH);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  try {
    ctx.drawImage(tex.image as CanvasImageSource, 0, 0, w, h);
  } catch {
    return null;
  }
  const imageData = ctx.getImageData(0, 0, w, h);
  return {
    width: w,
    height: h,
    data: imageData.data,
    flipY: tex.flipY !== false,
    wrapRepeatS: tex.wrapS === THREE.RepeatWrapping,
    wrapRepeatT: tex.wrapT === THREE.RepeatWrapping,
  };
}

function sampleTextureSrgb(sampler: TextureSampler, u: number, v: number): RGB {
  let uu = u;
  let vv = v;
  if (sampler.wrapRepeatS) {
    uu = uu - Math.floor(uu);
  } else {
    uu = Math.max(0, Math.min(0.9999, uu));
  }
  if (sampler.wrapRepeatT) {
    vv = vv - Math.floor(vv);
  } else {
    vv = Math.max(0, Math.min(0.9999, vv));
  }

  const pyFrac = sampler.flipY ? 1 - vv : vv;
  const px = Math.min(sampler.width - 1, Math.max(0, Math.floor(uu * sampler.width)));
  const py = Math.min(sampler.height - 1, Math.max(0, Math.floor(pyFrac * sampler.height)));
  const idx = (py * sampler.width + px) * 4;
  return [sampler.data[idx], sampler.data[idx + 1], sampler.data[idx + 2]];
}

/**
 * Computes closest point on triangle (a, b, c) to point p and its barycentric weights (u, v, w).
 * Adapted from Ericson's Real-Time Collision Detection for watertight surface voxelization.
 */
function closestPointAndBarycentricOnTriangle(
  p: THREE.Vector3,
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  outClosest: THREE.Vector3
): [number, number, number] {
  _ab.subVectors(b, a);
  _ac.subVectors(c, a);
  _ap.subVectors(p, a);

  const d1 = _ab.dot(_ap);
  const d2 = _ac.dot(_ap);
  if (d1 <= 0 && d2 <= 0) {
    outClosest.copy(a);
    return [1, 0, 0];
  }

  _bp.subVectors(p, b);
  const d3 = _ab.dot(_bp);
  const d4 = _ac.dot(_bp);
  if (d3 >= 0 && d4 <= d3) {
    outClosest.copy(b);
    return [0, 1, 0];
  }

  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    outClosest.copy(a).addScaledVector(_ab, v);
    return [1 - v, v, 0];
  }

  _cp.subVectors(p, c);
  const d5 = _ab.dot(_cp);
  const d6 = _ac.dot(_cp);
  if (d6 >= 0 && d5 <= d6) {
    outClosest.copy(c);
    return [0, 0, 1];
  }

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    outClosest.copy(a).addScaledVector(_ac, w);
    return [1 - w, 0, w];
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
    const w = (d4 - d3) / (d4 - d3 + (d5 - d6));
    outClosest.copy(b).addScaledVector(_tmpV2.subVectors(c, b), w);
    return [0, 1 - w, w];
  }

  const denom = 1 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  const u = 1 - v - w;
  outClosest.copy(a).addScaledVector(_ab, v).addScaledVector(_ac, w);
  return [u, v, w];
}

interface MeshTriangleSource {
  verts: Float32Array;
  uvs: Float32Array | null;
  vCols: Float32Array | null;
  triCount: number;
  baseSrgb: RGB;
  emissiveAddSrgb: RGB;
  texSampler: TextureSampler | null;
}

function collectMeshTriangles(root: THREE.Object3D): {
  sources: MeshTriangleSource[];
  bounds: THREE.Box3;
} {
  root.updateMatrixWorld(true);
  const invRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const sources: MeshTriangleSource[] = [];
  const bounds = new THREE.Box3();
  const meshToRoot = new THREE.Matrix4();
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !child.visible) return;
    const geo = child.geometry;
    if (!geo || !geo.attributes.position) return;

    if (child instanceof THREE.SkinnedMesh && child.skeleton) {
      child.skeleton.update();
    }

    meshToRoot.multiplyMatrices(invRoot, child.matrixWorld);

    const primaryMat = Array.isArray(child.material) ? child.material[0] : child.material;
    let baseSrgb: RGB = [220, 224, 232];
    let emissiveAddSrgb: RGB = [0, 0, 0];
    let albedoTex: THREE.Texture | null = null;

    if (primaryMat instanceof PixelizerMaterial) {
      baseSrgb = hexToRgb(primaryMat.options.baseColor);
      albedoTex = primaryMat.options.albedoMap;
      const emitInt = primaryMat.options.emissionIntensity ?? 0;
      if (emitInt > 0.05) {
        const er = hexToRgb(primaryMat.options.emissionColor);
        emissiveAddSrgb = [
          Math.min(180, Math.round(er[0] * emitInt * 0.45)),
          Math.min(180, Math.round(er[1] * emitInt * 0.45)),
          Math.min(180, Math.round(er[2] * emitInt * 0.45)),
        ];
      }
    } else if (primaryMat) {
      if ('color' in primaryMat && primaryMat.color instanceof THREE.Color) {
        primaryMat.color.getRGB(_srgbHelper, THREE.SRGBColorSpace);
        baseSrgb = [
          Math.round(_srgbHelper.r * 255),
          Math.round(_srgbHelper.g * 255),
          Math.round(_srgbHelper.b * 255),
        ];
      }
      if ('map' in primaryMat && primaryMat.map instanceof THREE.Texture) {
        albedoTex = primaryMat.map;
      }
    }

    const posAttr = geo.attributes.position;
    const uvAttr = geo.attributes.uv;
    const colAttr = geo.attributes.color;
    const index = geo.getIndex();
    const triCount = index ? Math.floor(index.count / 3) : Math.floor(posAttr.count / 3);
    if (triCount <= 0) return;

    const verts = new Float32Array(triCount * 9);
    const uvs = uvAttr ? new Float32Array(triCount * 6) : null;
    const vCols = colAttr ? new Float32Array(triCount * 9) : null;

    for (let t = 0; t < triCount; t++) {
      const i0 = index ? index.getX(t * 3 + 0) : t * 3 + 0;
      const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

      // getVertexPosition resolves morph targets AND SkinnedMesh bone deformation automatically
      child.getVertexPosition(i0, p0).applyMatrix4(meshToRoot);
      child.getVertexPosition(i1, p1).applyMatrix4(meshToRoot);
      child.getVertexPosition(i2, p2).applyMatrix4(meshToRoot);

      bounds.expandByPoint(p0);
      bounds.expandByPoint(p1);
      bounds.expandByPoint(p2);

      const vo = t * 9;
      verts[vo + 0] = p0.x; verts[vo + 1] = p0.y; verts[vo + 2] = p0.z;
      verts[vo + 3] = p1.x; verts[vo + 4] = p1.y; verts[vo + 5] = p1.z;
      verts[vo + 6] = p2.x; verts[vo + 7] = p2.y; verts[vo + 8] = p2.z;

      if (uvs && uvAttr) {
        const uo = t * 6;
        uvs[uo + 0] = uvAttr.getX(i0); uvs[uo + 1] = uvAttr.getY(i0);
        uvs[uo + 2] = uvAttr.getX(i1); uvs[uo + 3] = uvAttr.getY(i1);
        uvs[uo + 4] = uvAttr.getX(i2); uvs[uo + 5] = uvAttr.getY(i2);
      }

      if (vCols && colAttr) {
        vCols[vo + 0] = colAttr.getX(i0); vCols[vo + 1] = colAttr.getY(i0); vCols[vo + 2] = colAttr.getZ(i0);
        vCols[vo + 3] = colAttr.getX(i1); vCols[vo + 4] = colAttr.getY(i1); vCols[vo + 5] = colAttr.getZ(i1);
        vCols[vo + 6] = colAttr.getX(i2); vCols[vo + 7] = colAttr.getY(i2); vCols[vo + 8] = colAttr.getZ(i2);
      }
    }

    sources.push({
      verts,
      uvs,
      vCols,
      triCount,
      baseSrgb,
      emissiveAddSrgb,
      texSampler: createTextureSampler(albedoTex),
    });
  });

  return { sources, bounds };
}

/**
 * Watertight 3D surface voxelizer for static, multi-part, rigged (SkinnedMesh),
 * and morph-targeted Three.js hierarchies.
 * Produces surface-culled block BufferGeometry ready for live rendering + GLB / OBJ / VOX export.
 */
export function voxelizeObject3D(
  root: THREE.Object3D,
  options: VoxelizerOptions
): VoxelGridResult {
  const resolution = Math.max(6, Math.min(80, Math.round(options.resolution)));
  const { sources, bounds } = collectMeshTriangles(root);

  if (sources.length === 0 || bounds.isEmpty()) {
    return {
      dimensions: [1, 1, 1],
      voxelSize: 0.1,
      origin: new THREE.Vector3(),
      voxels: [],
      faceCount: 0,
      triangleCount: 0,
      geometry: new THREE.BufferGeometry(),
    };
  }

  const size = new THREE.Vector3();
  bounds.getSize(size);
  const maxSpan = Math.max(size.x, size.y, size.z, 0.001);
  const voxelSize = maxSpan / resolution;

  const nx = Math.max(1, Math.min(resolution + 2, Math.ceil(size.x / voxelSize) + 1));
  const ny = Math.max(1, Math.min(resolution + 2, Math.ceil(size.y / voxelSize) + 1));
  const nz = Math.max(1, Math.min(resolution + 2, Math.ceil(size.z / voxelSize) + 1));

  // Align voxel grid origin cleanly to bottom-center or min bounds
  const origin = new THREE.Vector3(
    bounds.min.x - voxelSize * 0.5,
    bounds.min.y,
    bounds.min.z - voxelSize * 0.5
  );

  // Sparse accumulator: key = ix + nx * (iy + ny * iz)
  const accum = new Map<number, [number, number, number, number]>();
  const keyOf = (ix: number, iy: number, iz: number) => ix + nx * (iy + ny * iz);
  const radiusSq = (voxelSize * 0.56) ** 2;

  for (const src of sources) {
    const { verts, uvs, vCols, triCount, baseSrgb, emissiveAddSrgb, texSampler } = src;

    for (let t = 0; t < triCount; t++) {
      const vo = t * 9;
      _tmpV0.set(verts[vo + 0], verts[vo + 1], verts[vo + 2]);
      _tmpV1.set(verts[vo + 3], verts[vo + 4], verts[vo + 5]);
      _tmpV2.set(verts[vo + 6], verts[vo + 7], verts[vo + 8]);

      _triBox.makeEmpty();
      _triBox.expandByPoint(_tmpV0);
      _triBox.expandByPoint(_tmpV1);
      _triBox.expandByPoint(_tmpV2);

      const minIx = Math.max(0, Math.floor((_triBox.min.x - origin.x) / voxelSize) - 1);
      const maxIx = Math.min(nx - 1, Math.ceil((_triBox.max.x - origin.x) / voxelSize));
      const minIy = Math.max(0, Math.floor((_triBox.min.y - origin.y) / voxelSize) - 1);
      const maxIy = Math.min(ny - 1, Math.ceil((_triBox.max.y - origin.y) / voxelSize));
      const minIz = Math.max(0, Math.floor((_triBox.min.z - origin.z) / voxelSize) - 1);
      const maxIz = Math.min(nz - 1, Math.ceil((_triBox.max.z - origin.z) / voxelSize));

      const uo = t * 6;
      for (let iz = minIz; iz <= maxIz; iz++) {
        const cz = origin.z + (iz + 0.5) * voxelSize;
        for (let iy = minIy; iy <= maxIy; iy++) {
          const cy = origin.y + (iy + 0.5) * voxelSize;
          for (let ix = minIx; ix <= maxIx; ix++) {
            const cx = origin.x + (ix + 0.5) * voxelSize;
            _pointVec.set(cx, cy, cz);

            const [b0, b1, b2] = closestPointAndBarycentricOnTriangle(
              _pointVec,
              _tmpV0,
              _tmpV1,
              _tmpV2,
              _closest
            );

            if (_pointVec.distanceToSquared(_closest) > radiusSq) continue;

            let r = baseSrgb[0];
            let g = baseSrgb[1];
            let b = baseSrgb[2];

            if (texSampler && uvs) {
              const u = uvs[uo + 0] * b0 + uvs[uo + 2] * b1 + uvs[uo + 4] * b2;
              const v = uvs[uo + 1] * b0 + uvs[uo + 3] * b1 + uvs[uo + 5] * b2;
              const texRgb = sampleTextureSrgb(texSampler, u, v);
              r = Math.round((r / 255) * texRgb[0]);
              g = Math.round((g / 255) * texRgb[1]);
              b = Math.round((b / 255) * texRgb[2]);
            }

            if (vCols) {
              const cr = vCols[vo + 0] * b0 + vCols[vo + 3] * b1 + vCols[vo + 6] * b2;
              const cg = vCols[vo + 1] * b0 + vCols[vo + 4] * b1 + vCols[vo + 7] * b2;
              const cb = vCols[vo + 2] * b0 + vCols[vo + 5] * b1 + vCols[vo + 8] * b2;
              _vcolSrgb.setRGB(cr, cg, cb, THREE.LinearSRGBColorSpace);
              _vcolSrgb.getRGB(_vcolSrgb, THREE.SRGBColorSpace);
              r = Math.round(r * Math.min(1, Math.max(0, _vcolSrgb.r)));
              g = Math.round(g * Math.min(1, Math.max(0, _vcolSrgb.g)));
              b = Math.round(b * Math.min(1, Math.max(0, _vcolSrgb.b)));
            }

            r = Math.min(255, r + emissiveAddSrgb[0]);
            g = Math.min(255, g + emissiveAddSrgb[1]);
            b = Math.min(255, b + emissiveAddSrgb[2]);

            const k = keyOf(ix, iy, iz);
            const prev = accum.get(k);
            if (prev) {
              prev[0] += r;
              prev[1] += g;
              prev[2] += b;
              prev[3] += 1;
            } else {
              accum.set(k, [r, g, b, 1]);
            }
          }
        }
      }
    }
  }

  // Optional slight solid-fill pass for enclosed interior pinholes
  if (options.fillSolidInterior && accum.size > 0) {
    const fillEntries: [number, [number, number, number, number]][] = [];
    for (let iz = 1; iz < nz - 1; iz++) {
      for (let iy = 1; iy < ny - 1; iy++) {
        for (let ix = 1; ix < nx - 1; ix++) {
          const k = keyOf(ix, iy, iz);
          if (accum.has(k)) continue;
          let count = 0;
          let sr = 0;
          let sg = 0;
          let sb = 0;
          const neighbors = [
            keyOf(ix + 1, iy, iz),
            keyOf(ix - 1, iy, iz),
            keyOf(ix, iy + 1, iz),
            keyOf(ix, iy - 1, iz),
            keyOf(ix, iy, iz + 1),
            keyOf(ix, iy, iz - 1),
          ];
          for (const nk of neighbors) {
            const n = accum.get(nk);
            if (n) {
              count++;
              sr += n[0] / n[3];
              sg += n[1] / n[3];
              sb += n[2] / n[3];
            }
          }
          if (count >= 5) {
            fillEntries.push([k, [sr / count, sg / count, sb / count, 1]]);
          }
        }
      }
    }
    for (const [k, v] of fillEntries) accum.set(k, v);
  }

  // Convert accumulated colors + optional palette quantization & 3D dithering
  const paletteRgb = options.palette?.colors.map(hexToRgb) ?? null;
  const voxels: VoxelEntry[] = [];
  const occupied = new Map<number, VoxelEntry>();

  for (const [k, sum] of accum.entries()) {
    const ix = k % nx;
    const rem = Math.floor(k / nx);
    const iy = rem % ny;
    const iz = Math.floor(rem / ny);

    let r = Math.round(sum[0] / sum[3]);
    let g = Math.round(sum[1] / sum[3]);
    let b = Math.round(sum[2] / sum[3]);

    if (options.palette && paletteRgb && paletteRgb.length > 0) {
      const pair = findDitherPair(
        [r, g, b],
        paletteRgb,
        options.palette.method,
        options.palette.hsvWeights,
        options.dither3d ? options.palette.ditherStrength : 0,
        options.palette.valueCurveGamma
      );
      const bayer3d =
        (((ix & 1) * 4 + (iy & 1) * 2 + (iz & 1) * 1) + 0.5) / 8.0;
      const chosen =
        options.dither3d && pair.ratio > bayer3d ? pair.c2 : pair.c1;
      r = Math.round(chosen[0]);
      g = Math.round(chosen[1]);
      b = Math.round(chosen[2]);
    }

    const entry: VoxelEntry = { ix, iy, iz, r, g, b };
    voxels.push(entry);
    occupied.set(k, entry);
  }

  // Build exposed-face-culled mesh geometry
  const faces: {
    dir: [number, number, number];
    corners: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]];
  }[] = [
    { dir: [1, 0, 0], corners: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]] },
    { dir: [-1, 0, 0], corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
    { dir: [0, 1, 0], corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
    { dir: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
    { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
    { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
  ];

  const posList: number[] = [];
  const normList: number[] = [];
  const colList: number[] = [];
  const uvList: number[] = [];
  const idxList: number[] = [];

  let faceCount = 0;
  let vCursor = 0;

  for (const vx of voxels) {
    _srgbHelper.setRGB(vx.r / 255, vx.g / 255, vx.b / 255, THREE.SRGBColorSpace);
    const ox = origin.x + vx.ix * voxelSize;
    const oy = (options.preserveWorldScale === false ? 0 : origin.y) + vx.iy * voxelSize;
    const oz = origin.z + vx.iz * voxelSize;

    for (const f of faces) {
      const nix = vx.ix + f.dir[0];
      const niy = vx.iy + f.dir[1];
      const niz = vx.iz + f.dir[2];
      if (
        nix >= 0 && nix < nx &&
        niy >= 0 && niy < ny &&
        niz >= 0 && niz < nz &&
        occupied.has(keyOf(nix, niy, niz))
      ) {
        continue;
      }

      for (const c of f.corners) {
        posList.push(ox + c[0] * voxelSize, oy + c[1] * voxelSize, oz + c[2] * voxelSize);
        normList.push(f.dir[0], f.dir[1], f.dir[2]);
        colList.push(_srgbHelper.r, _srgbHelper.g, _srgbHelper.b);
      }
      uvList.push(0, 0, 1, 0, 1, 1, 0, 1);
      idxList.push(
        vCursor, vCursor + 1, vCursor + 2,
        vCursor, vCursor + 2, vCursor + 3
      );
      vCursor += 4;
      faceCount++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(posList, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normList, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colList, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvList, 2));
  geometry.setIndex(idxList);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return {
    dimensions: [nx, ny, nz],
    voxelSize,
    origin,
    voxels,
    faceCount,
    triangleCount: faceCount * 2,
    geometry,
  };
}

/**
 * Wraps a VoxelGridResult in a PixelizerMaterial mesh inside a Group so it can be
 * rendered live in the Studio viewport (either raw crisp 3D blocks or pixelated outlines).
 */
export function buildVoxelMeshGroup(
  grid: VoxelGridResult,
  sharedResources?: PixelizerMaterialResources,
  matOptions: Partial<PixelizerMaterialOptions> = {}
): { group: THREE.Group; mesh: THREE.Mesh; material: PixelizerMaterial } {
  const mat = new PixelizerMaterial(
    {
      pixelated: true,
      pixelSize: 1,
      objectId: 55,
      outlineColor: '#12101a',
      outlineAlpha: 0.9,
      edgeHighlight: 0.42,
      edgeBevelWeight: 0.55,
      useColorGrading: false,
      diffuseVertexColorWeight: 1.0,
      smoothness: 0.12,
      ...matOptions,
    },
    sharedResources
  );
  mat.vertexColors = true;
  const mesh = new THREE.Mesh(grid.geometry, mat);
  mesh.name = 'Voxelized Block Mesh';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const group = new THREE.Group();
  group.name = 'Voxelized Mesh Root';
  group.add(mesh);
  return { group, mesh, material: mat };
}

/**
 * Exports a voxelized mesh to Wavefront .OBJ with per-vertex RGB colors (v x y z r g b).
 */
export function exportVoxelGridToObj(grid: VoxelGridResult, name = 'pixelizer_voxel'): string {
  const lines: string[] = [
    `# Pixelizer 3D Voxelized Mesh (${grid.voxels.length} voxels, ${grid.faceCount} faces)`,
    `o ${name.replace(/\s+/g, '_')}`,
    'vn 1 0 0',
    'vn -1 0 0',
    'vn 0 1 0',
    'vn 0 -1 0',
    'vn 0 0 1',
    'vn 0 0 -1',
  ];

  const pos = grid.geometry.getAttribute('position');
  const norm = grid.geometry.getAttribute('normal');
  const col = grid.geometry.getAttribute('color');
  const index = grid.geometry.getIndex();
  if (!pos || !col || !index) return lines.join('\n');

  const srgb = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    srgb.setRGB(col.getX(i), col.getY(i), col.getZ(i), THREE.LinearSRGBColorSpace);
    lines.push(
      `v ${pos.getX(i).toFixed(5)} ${pos.getY(i).toFixed(5)} ${pos.getZ(i).toFixed(5)} ${srgb.r.toFixed(4)} ${srgb.g.toFixed(4)} ${srgb.b.toFixed(4)}`
    );
  }

  for (let t = 0; t < index.count; t += 3) {
    const a = index.getX(t);
    const b = index.getX(t + 1);
    const c = index.getX(t + 2);
    const nx = norm ? Math.round(norm.getX(a)) : 0;
    const ny = norm ? Math.round(norm.getY(a)) : 1;
    const nz = norm ? Math.round(norm.getZ(a)) : 0;
    let vnIdx = 3;
    if (nx > 0) vnIdx = 1;
    else if (nx < 0) vnIdx = 2;
    else if (ny > 0) vnIdx = 3;
    else if (ny < 0) vnIdx = 4;
    else if (nz > 0) vnIdx = 5;
    else if (nz < 0) vnIdx = 6;
    lines.push(`f ${a + 1}//${vnIdx} ${b + 1}//${vnIdx} ${c + 1}//${vnIdx}`);
  }

  return lines.join('\n');
}

/**
 * Exports a voxelized mesh to a standard binary .GLB asset with linear PBR vertex colors.
 */
export async function exportVoxelGridToGlb(
  grid: VoxelGridResult,
  name = 'pixelizer_voxel'
): Promise<ArrayBuffer> {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.72,
    metalness: 0.08,
  });
  const mesh = new THREE.Mesh(grid.geometry, mat);
  mesh.name = name;
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(mesh, { binary: true });
  mat.dispose();
  if (result instanceof ArrayBuffer) {
    return result;
  }
  const encoded = new TextEncoder().encode(JSON.stringify(result));
  return encoded.buffer;
}

/**
 * Exports a voxelized grid to MagicaVoxel binary .VOX format (version 150).
 * Swaps Y-up (Three.js) to Z-up (MagicaVoxel) and packs unique RGB palette up to 255 colors.
 */
export function exportVoxelGridToVox(grid: VoxelGridResult): Uint8Array {
  const sx = Math.max(1, Math.min(255, grid.dimensions[0]));
  const sy = Math.max(1, Math.min(255, grid.dimensions[2]));
  const sz = Math.max(1, Math.min(255, grid.dimensions[1]));

  const paletteList: RGB[] = [];
  const paletteIndexMap = new Map<string, number>();

  const getPaletteIndex = (r: number, g: number, b: number): number => {
    const key = `${r},${g},${b}`;
    const found = paletteIndexMap.get(key);
    if (found !== undefined) return found;
    if (paletteList.length < 255) {
      const idx = paletteList.length + 1; // MagicaVoxel palette indices are 1..255
      paletteList.push([r, g, b]);
      paletteIndexMap.set(key, idx);
      return idx;
    }
    // Find nearest existing color when exceeding 255 colors
    let bestIdx = 1;
    let bestDist = Infinity;
    for (let i = 0; i < paletteList.length; i++) {
      const p = paletteList[i];
      const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i + 1;
      }
    }
    return bestIdx;
  };

  const validVoxels: [number, number, number, number][] = [];
  for (const v of grid.voxels) {
    if (v.ix < 0 || v.ix >= sx || v.iz < 0 || v.iz >= sy || v.iy < 0 || v.iy >= sz) {
      continue;
    }
    const ci = getPaletteIndex(v.r, v.g, v.b);
    validVoxels.push([v.ix, sy - 1 - v.iz, v.iy, ci]);
  }

  const sizePayloadLen = 12;
  const xyziPayloadLen = 4 + validVoxels.length * 4;
  const rgbaPayloadLen = 256 * 4;

  const sizeChunkLen = 12 + sizePayloadLen;
  const xyziChunkLen = 12 + xyziPayloadLen;
  const rgbaChunkLen = 12 + rgbaPayloadLen;
  const childrenSize = sizeChunkLen + xyziChunkLen + rgbaChunkLen;
  const totalBytes = 8 + 12 + childrenSize;

  const out = new Uint8Array(totalBytes);
  const view = new DataView(out.buffer);
  let ptr = 0;

  const writeTag = (tag: string) => {
    for (let i = 0; i < 4; i++) out[ptr++] = tag.charCodeAt(i);
  };
  const writeI32 = (val: number) => {
    view.setInt32(ptr, val, true);
    ptr += 4;
  };

  // Header
  writeTag('VOX ');
  writeI32(150);

  // MAIN chunk
  writeTag('MAIN');
  writeI32(0);
  writeI32(childrenSize);

  // SIZE chunk
  writeTag('SIZE');
  writeI32(sizePayloadLen);
  writeI32(0);
  writeI32(sx);
  writeI32(sy);
  writeI32(sz);

  // XYZI chunk
  writeTag('XYZI');
  writeI32(xyziPayloadLen);
  writeI32(0);
  writeI32(validVoxels.length);
  for (const [x, y, z, c] of validVoxels) {
    out[ptr++] = x & 0xff;
    out[ptr++] = y & 0xff;
    out[ptr++] = z & 0xff;
    out[ptr++] = c & 0xff;
  }

  // RGBA palette chunk (256 slots: entry 0 = color index 1)
  writeTag('RGBA');
  writeI32(rgbaPayloadLen);
  writeI32(0);
  for (let i = 0; i < 256; i++) {
    const col = paletteList[i] ?? [0, 0, 0];
    out[ptr++] = col[0] & 0xff;
    out[ptr++] = col[1] & 0xff;
    out[ptr++] = col[2] & 0xff;
    out[ptr++] = 255;
  }

  return out;
}

export interface RiggedVoxelResult {
  grid: VoxelGridResult;
  rig: CanonicalUalRig;
  skinnedMesh: THREE.SkinnedMesh;
  material: PixelizerMaterial;
  root: THREE.Group;
}

/**
 * Finds the dominant bone for each voxel of an existing Object3D (supporting SkinnedMesh weights,
 * rigid bone-parented meshes, or static geometry via canonical UAL capsule auto-rigging)
 * and produces a live animated Voxel SkinnedMesh on the canonical 65-bone UAL Skeleton.
 */
export function voxelizeObject3DRigged(
  root: THREE.Object3D,
  options: VoxelizerOptions & {
    profile?: UalGenderProfile;
    targetUalRig?: CanonicalUalRig;
  },
  sharedResources?: PixelizerMaterialResources,
  matOptions: Partial<PixelizerMaterialOptions> = {}
): RiggedVoxelResult {
  // Temporarily restore any source SkinnedMesh or Bone hierarchy to its bind/rest pose before sampling
  const savedRotations: { obj: THREE.Object3D; q: THREE.Quaternion; p: THREE.Vector3 }[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.SkinnedMesh && obj.skeleton) {
      for (const b of obj.skeleton.bones) {
        savedRotations.push({ obj: b, q: b.quaternion.clone(), p: b.position.clone() });
      }
      obj.skeleton.pose();
    }
  });
  root.updateMatrixWorld(true);

  const rig = options.targetUalRig ?? createCanonicalUalRig(options.profile ?? 'male', 1.0);
  const boneIndexByName = new Map<string, number>();
  rig.bones.forEach((b, idx) => boneIndexByName.set(b.name, idx));

  // Extract rest-pose bone center hints if the source has rigid bone-parented meshes on UAL bone names
  const boneWeightedSamplePoints: { worldPos: THREE.Vector3; boneIndex: number }[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.parent instanceof THREE.Bone) {
      const bIdx = boneIndexByName.get(obj.parent.name);
      if (bIdx !== undefined) {
        const center = new THREE.Vector3();
        obj.geometry.computeBoundingBox();
        if (obj.geometry.boundingBox) {
          obj.geometry.boundingBox.getCenter(center);
          obj.localToWorld(center);
          boneWeightedSamplePoints.push({ worldPos: center, boneIndex: bIdx });
        }
      }
    }
  });

  // Build static surface grid in Rest Pose
  const grid = voxelizeObject3D(root, { ...options, preserveWorldScale: true });

  // Restore source bone poses
  for (const s of savedRotations) {
    s.obj.quaternion.copy(s.q);
    s.obj.position.copy(s.p);
  }
  root.updateMatrixWorld(true);

  // Align voxel vertices cleanly onto the canonical UAL height (~1.83m) with feet at y = 0
  const geo = grid.geometry;
  geo.computeBoundingBox();
  const rawBb = geo.boundingBox ? geo.boundingBox.clone() : null;
  if (rawBb && !rawBb.isEmpty()) {
    const h = rawBb.max.y - rawBb.min.y;
    const targetH = rig.profile === 'female' ? 1.808 : 1.829;
    const scaleFactor = h > 0.05 ? targetH / h : 1.0;
    const cx = (rawBb.min.x + rawBb.max.x) * 0.5;
    const cz = (rawBb.min.z + rawBb.max.z) * 0.5;
    geo.translate(-cx, -rawBb.min.y, -cz);
    if (Math.abs(scaleFactor - 1.0) > 1e-3) {
      geo.scale(scaleFactor, scaleFactor, scaleFactor);
    }
    for (const sp of boneWeightedSamplePoints) {
      sp.worldPos.x = (sp.worldPos.x - cx) * scaleFactor;
      sp.worldPos.y = (sp.worldPos.y - rawBb.min.y) * scaleFactor;
      sp.worldPos.z = (sp.worldPos.z - cz) * scaleFactor;
    }
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
  }

  let perVertexBoneIndices: Uint16Array | undefined;
  if (boneWeightedSamplePoints.length >= 4 && rawBb) {
    const posAttr = geo.getAttribute('position');
    if (posAttr) {
      perVertexBoneIndices = new Uint16Array(posAttr.count);
      const vp = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vp.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
        let bestIdx = boneWeightedSamplePoints[0].boneIndex;
        let bestDist = Infinity;
        for (const sp of boneWeightedSamplePoints) {
          const d = vp.distanceToSquared(sp.worldPos);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = sp.boneIndex;
          }
        }
        perVertexBoneIndices[i] = bestIdx;
      }
    }
  }

  const { mesh: skinnedMesh, material } = bindGeometryToUalSkeleton(
    geo,
    rig,
    {
      pixelated: true,
      pixelSize: 1,
      objectId: 10,
      outlineColor: '#12101a',
      outlineAlpha: 0.92,
      edgeHighlight: 0.4,
      edgeBevelWeight: 0.55,
      useColorGrading: false,
      diffuseVertexColorWeight: 1.0,
      smoothness: 0.14,
      ...matOptions,
    },
    sharedResources,
    {
      name: 'Voxelized_Rigged_Character',
      smoothnessFalloff: 0.045,
      perVertexBoneIndices,
    }
  );

  const outRoot = new THREE.Group();
  outRoot.name = 'Voxelized Rigged Root';
  outRoot.add(rig.armature);

  return {
    grid,
    rig,
    skinnedMesh,
    material,
    root: outRoot,
  };
}

