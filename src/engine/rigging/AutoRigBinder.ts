import * as THREE from 'three';
import {
  PixelizerMaterial,
  convertStandardMaterialToPixelizer,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import { computeGeometryTangents } from '../procedural/SdfVoxelPrimitives';
import type { PixelizerMaterialOptions } from '../types';
import {
  UAL_SKELETON_SPEC,
  createCanonicalUalRig,
  type CanonicalUalRig,
  type UalGenderProfile,
} from './UalRigSpec';

export interface RigidPartSpec {
  name: string;
  boneName: string;
  geometry: THREE.BufferGeometry;
  materialOptions?: Partial<PixelizerMaterialOptions>;
  localOffset?: [number, number, number];
  localRotation?: [number, number, number];
}

interface WorldCapsuleSegment {
  boneIndex: number;
  boneName: string;
  a: THREE.Vector3;
  b: THREE.Vector3;
  radius: number;
}

const _p = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ap = new THREE.Vector3();
const _closest = new THREE.Vector3();

function closestPointDistSq(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): number {
  _ab.subVectors(b, a);
  const abLenSq = _ab.lengthSq();
  if (abLenSq < 1e-8) {
    return p.distanceToSquared(a);
  }
  _ap.subVectors(p, a);
  const t = Math.max(0, Math.min(1, _ap.dot(_ab) / abLenSq));
  _closest.copy(a).addScaledVector(_ab, t);
  return p.distanceToSquared(_closest);
}

/**
 * Extracts world-space capsule segments for the 17 structural UAL bones.
 */
export function buildUalCapsuleSegments(
  rig: CanonicalUalRig,
  preserveCurrentPose = false
): WorldCapsuleSegment[] {
  if (!preserveCurrentPose) {
    rig.skeleton.pose();
  }
  rig.armature.updateMatrixWorld(true);

  const indexByName = new Map<string, number>();
  rig.skeleton.bones.forEach((b, i) => indexByName.set(b.name, i));

  const worldPos = (boneName: string): THREE.Vector3 => {
    const b = rig.boneByName.get(boneName);
    const v = new THREE.Vector3();
    if (b) b.getWorldPosition(v);
    return v;
  };

  const segments: WorldCapsuleSegment[] = [];
  for (const cap of UAL_SKELETON_SPEC.structuralCapsules) {
    const bIdx = indexByName.get(cap.bone);
    const host = rig.boneByName.get(cap.bone);
    if (bIdx === undefined || !host) continue;

    const a = worldPos(cap.bone);
    let b: THREE.Vector3;
    if (cap.endBone) {
      b = worldPos(cap.endBone);
    } else {
      const localEnd = new THREE.Vector3(0, cap.endOffsetLocalY ?? 0.16, 0);
      b = host.localToWorld(localEnd);
    }

    segments.push({
      boneIndex: bIdx,
      boneName: cap.bone,
      a,
      b,
      radius: cap.radius * rig.scale,
    });
  }
  return segments;
}

function computeUalCapsuleSkinWeights(
  posAttr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  segments: WorldCapsuleSegment[],
  smoothnessFalloff = 0.065
): { skinIndices: Uint16Array; skinWeights: Float32Array } {
  const vCount = posAttr.count;
  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);
  const falloff = Math.max(0.02, smoothnessFalloff);
  const invSharpness = 1 / (falloff * falloff);

  for (let i = 0; i < vCount; i++) {
    _p.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));

    const bestByBone = new Map<number, number>();
    let minEffectiveDistSq = Infinity;
    let nearestBone = segments[0]?.boneIndex ?? 0;

    for (const seg of segments) {
      const dSq = closestPointDistSq(_p, seg.a, seg.b);
      const effD = Math.max(0, Math.sqrt(dSq) - seg.radius * 0.65);
      const effDSq = effD * effD;
      if (effDSq < minEffectiveDistSq) {
        minEffectiveDistSq = effDSq;
        nearestBone = seg.boneIndex;
      }
      const prev = bestByBone.get(seg.boneIndex);
      if (prev === undefined || effDSq < prev) {
        bestByBone.set(seg.boneIndex, effDSq);
      }
    }

    const scored: [number, number][] = [];
    for (const [bIdx, effDSq] of bestByBone.entries()) {
      const w = Math.exp(-effDSq * invSharpness);
      if (w > 1e-4) {
        scored.push([bIdx, w]);
      }
    }
    scored.sort((a, b) => b[1] - a[1]);

    if (scored.length === 0) {
      skinIndices[i * 4] = nearestBone;
      skinWeights[i * 4] = 1.0;
      continue;
    }

    const top = scored.slice(0, 4);
    let sum = 0;
    for (const [, w] of top) sum += w;
    if (sum <= 1e-8) {
      skinIndices[i * 4] = top[0][0];
      skinWeights[i * 4] = 1.0;
      continue;
    }

    const base = i * 4;
    for (let k = 0; k < top.length; k++) {
      skinIndices[base + k] = top[k][0];
      skinWeights[base + k] = top[k][1] / sum;
    }
  }

  return { skinIndices, skinWeights };
}

/**
 * Automatically computes normalized 4-influence skinIndex + skinWeight attributes
 * for any BufferGeometry aligned to the Quaternius UAL Rest Pose and wraps it in a SkinnedMesh.
 * Optionally accepts per-vertex hard bone index hints (`perVertexBoneIndices`) for crisp rigid voxel/armor chunks.
 */
export function bindGeometryToUalSkeleton(
  geometry: THREE.BufferGeometry,
  rig: CanonicalUalRig,
  matOptions: Partial<PixelizerMaterialOptions> = {},
  sharedResources?: PixelizerMaterialResources,
  options: {
    name?: string;
    smoothnessFalloff?: number;
    perVertexBoneIndices?: Uint16Array;
  } = {}
): { mesh: THREE.SkinnedMesh; material: PixelizerMaterial } {
  const posAttr = geometry.getAttribute('position');
  if (!posAttr) {
    throw new Error('Geometry requires a position attribute for AutoRigBinder.');
  }

  const vCount = posAttr.count;
  let skinIndices: Uint16Array;
  let skinWeights: Float32Array;
  const rigidHints = options.perVertexBoneIndices;

  if (rigidHints && rigidHints.length === vCount) {
    skinIndices = new Uint16Array(vCount * 4);
    skinWeights = new Float32Array(vCount * 4);
    for (let i = 0; i < vCount; i++) {
      skinIndices[i * 4] = rigidHints[i];
      skinWeights[i * 4] = 1.0;
    }
  } else {
    const segments = buildUalCapsuleSegments(rig, false);
    const weights = computeUalCapsuleSkinWeights(
      posAttr,
      segments,
      options.smoothnessFalloff ?? 0.065
    );
    skinIndices = weights.skinIndices;
    skinWeights = weights.skinWeights;
  }

  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

  const material = new PixelizerMaterial(
    {
      pixelated: true,
      pixelSize: 3,
      objectId: 10,
      outlineColor: '#14101c',
      outlineAlpha: 1.0,
      edgeHighlight: 0.35,
      edgeBevelWeight: 0.65,
      useColorGrading: true,
      diffuseVertexColorWeight: geometry.getAttribute('color') ? 1.0 : 0.0,
      ...matOptions,
    },
    sharedResources
  );
  if (geometry.getAttribute('color')) {
    material.vertexColors = true;
  }

  const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
  skinnedMesh.name = options.name ?? 'UAL_Skinned_Character';
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;
  skinnedMesh.frustumCulled = false;
  skinnedMesh.bind(rig.skeleton, new THREE.Matrix4());

  rig.armature.add(skinnedMesh);
  return { mesh: skinnedMesh, material };
}

/**
 * Attaches rigid modular sub-meshes directly as children of canonical UAL bones
 * (`skinnedMeshes: 0`, zero weight deformation — ideal for crisp 40px isometric sprites).
 */
export function attachRigidPartsToUalRig(
  rig: CanonicalUalRig,
  parts: RigidPartSpec[],
  sharedResources?: PixelizerMaterialResources,
  defaultMatOptions: Partial<PixelizerMaterialOptions> = {}
): { meshes: THREE.Mesh[]; materials: PixelizerMaterial[] } {
  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];

  for (const part of parts) {
    const targetBone = rig.boneByName.get(part.boneName) ?? rig.rootBone;
    const hasCol = Boolean(part.geometry.getAttribute('color'));
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        outlineColor: '#14101c',
        outlineAlpha: 1.0,
        edgeHighlight: 0.35,
        edgeBevelWeight: 0.6,
        useColorGrading: true,
        diffuseVertexColorWeight: hasCol ? 1.0 : 0.0,
        ...defaultMatOptions,
        ...part.materialOptions,
      },
      sharedResources
    );
    if (hasCol) mat.vertexColors = true;

    const mesh = new THREE.Mesh(part.geometry, mat);
    mesh.name = part.name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (part.localOffset) {
      mesh.position.set(part.localOffset[0], part.localOffset[1], part.localOffset[2]);
    }
    if (part.localRotation) {
      mesh.rotation.set(part.localRotation[0], part.localRotation[1], part.localRotation[2]);
    }
    targetBone.add(mesh);
    meshes.push(mesh);
    materials.push(mat);
  }

  return { meshes, materials };
}

export interface StaticHumanoidAutoRigOptions {
  profile?: UalGenderProfile;
  targetHeightM?: number;
  pixelSize?: number;
  objectId?: number;
  smoothnessFalloff?: number;
  name?: string;
}

export interface StaticHumanoidAutoRigResult {
  name: string;
  rig: CanonicalUalRig;
  root: THREE.Group;
  skinnedMeshes: THREE.SkinnedMesh[];
  materials: PixelizerMaterial[];
  detectedPose: 't_pose' | 'a_pose';
  armAngleDeg: number;
  dispose: () => void;
}

function cloneTextureSafely(tex: THREE.Texture | null | undefined): THREE.Texture | null {
  if (!tex) return null;
  const img = tex.image as
    | { width?: number; height?: number; data?: ArrayLike<number> }
    | undefined;
  if (tex instanceof THREE.DataTexture && img?.data && img.width && img.height) {
    const clonedData =
      img.data instanceof Float32Array
        ? new Float32Array(img.data)
        : img.data instanceof Uint16Array
          ? new Uint16Array(img.data)
          : new Uint8Array(img.data);
    const dt = new THREE.DataTexture(
      clonedData,
      img.width,
      img.height,
      tex.format as THREE.PixelFormat,
      tex.type
    );
    dt.flipY = tex.flipY;
    dt.wrapS = tex.wrapS;
    dt.wrapT = tex.wrapT;
    dt.minFilter = tex.minFilter;
    dt.magFilter = tex.magFilter;
    dt.generateMipmaps = tex.generateMipmaps;
    dt.colorSpace = tex.colorSpace;
    dt.name = tex.name;
    dt.needsUpdate = true;
    return dt;
  }
  const cloned = tex.clone();
  cloned.needsUpdate = true;
  return cloned;
}

function rotateBoneAroundWorldAxis(
  bone: THREE.Bone | undefined,
  axisWorld: THREE.Vector3,
  angleRad: number
): void {
  if (!bone || Math.abs(angleRad) < 1e-6) return;
  bone.updateMatrixWorld(true);
  const qParent = new THREE.Quaternion();
  if (bone.parent) {
    bone.parent.getWorldQuaternion(qParent);
  }
  const qBoneWorld = new THREE.Quaternion();
  bone.getWorldQuaternion(qBoneWorld);
  const qDelta = new THREE.Quaternion().setFromAxisAngle(axisWorld, angleRad);
  bone.quaternion.copy(qParent.invert().multiply(qDelta).multiply(qBoneWorld));
  bone.updateMatrixWorld(true);
}

/**
 * Automatically converts any static humanoid Object3D (e.g. imported AI mesh in T-pose or A-pose)
 * into a 65-bone Quaternius UAL rigged asset ready for the 85+ animation library & `.GLB` export.
 *
 * Steps:
 * 1. Normalizes geometry to canonical UAL height (`1.829m`, feet at `y = 0`, centered X/Z).
 * 2. Detects arm posture (`T-pose` vs `A-pose`) from arm vertex slope outward from shoulder joints.
 * 3. For `A-pose`, temporarily lowers UAL shoulder/upperarm bones to match the static silhouette,
 *    computes capsule skinning weights against A-pose bones, and Linear-Blend-Skins vertices + normals
 *    smoothly back into canonical UAL T-pose so standard clips play without shoulder twisting.
 * 4. Wraps each sub-mesh as a `THREE.SkinnedMesh` sharing the canonical 65-bone `Skeleton`, scaling
 *    the `Armature` to `targetHeightM` (default `1.79m`).
 */
export function autoRigStaticHumanoidToUal(
  sourceRoot: THREE.Object3D,
  sharedResources?: PixelizerMaterialResources,
  options: StaticHumanoidAutoRigOptions = {}
): StaticHumanoidAutoRigResult {
  const profile: UalGenderProfile = options.profile ?? 'male';
  const canonicalHeight =
    profile === 'female'
      ? UAL_SKELETON_SPEC.heights.femaleMeters
      : UAL_SKELETON_SPEC.heights.maleMeters;
  const targetHeightM = Math.max(0.4, options.targetHeightM ?? 1.79);
  const pixelSize = options.pixelSize ?? 3;
  const objectId = options.objectId ?? 10;

  sourceRoot.updateMatrixWorld(true);
  const srcBox = new THREE.Box3().setFromObject(sourceRoot);
  if (srcBox.isEmpty()) {
    throw new Error('Modelo vazio: nenhuma malha encontrada para Auto-Rig UAL.');
  }

  const srcSize = new THREE.Vector3();
  const srcCenter = new THREE.Vector3();
  srcBox.getSize(srcSize);
  srcBox.getCenter(srcCenter);
  const normScale = canonicalHeight / Math.max(1e-4, srcSize.y);
  const minY = srcBox.min.y;

  const sourceMeshes: THREE.Mesh[] = [];
  sourceRoot.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry?.getAttribute('position')?.count) {
      sourceMeshes.push(obj);
    }
  });
  if (sourceMeshes.length === 0) {
    throw new Error('Nenhuma geometria válida encontrada no modelo para Auto-Rig UAL.');
  }

  // Transform all sub-mesh geometries cleanly into canonical 1.829m armature space
  const bakedMeshes: { srcMesh: THREE.Mesh; geo: THREE.BufferGeometry }[] = [];
  const tmpV = new THREE.Vector3();
  const tmpN = new THREE.Vector3();
  const normMat = new THREE.Matrix3();

  // Sample arm droop slope across X > 0.24 outward from canonical shoulder (0.192, 1.441)
  const shoulderX = 0.192;
  const shoulderY = 1.441;
  let sumDxDy = 0;
  let sumDxSq = 0;

  for (const sm of sourceMeshes) {
    const g = sm.geometry.clone();
    const pos = g.getAttribute('position');
    if (!g.getAttribute('normal')) {
      g.computeVertexNormals();
    }
    const norm = g.getAttribute('normal');
    normMat.getNormalMatrix(sm.matrixWorld);

    for (let i = 0; i < pos.count; i++) {
      tmpV.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(sm.matrixWorld);
      const cx = (tmpV.x - srcCenter.x) * normScale;
      const cy = (tmpV.y - minY) * normScale;
      const cz = (tmpV.z - srcCenter.z) * normScale;
      pos.setXYZ(i, cx, cy, cz);

      if (norm) {
        tmpN.set(norm.getX(i), norm.getY(i), norm.getZ(i)).applyMatrix3(normMat).normalize();
        norm.setXYZ(i, tmpN.x, tmpN.y, tmpN.z);
      }

      const absX = Math.abs(cx);
      if (absX >= 0.24 && absX <= 0.92 && cy >= 0.55 && cy <= 1.62) {
        const dx = absX - shoulderX;
        const dy = shoulderY - cy;
        sumDxDy += dx * dy;
        sumDxSq += dx * dx;
      }
    }
    pos.needsUpdate = true;
    if (norm) norm.needsUpdate = true;

    // Ensure vertex colors exist (`white_for_ao` + subtle vertical AO)
    if (!g.getAttribute('color')) {
      const cols = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const yn = Math.max(0, Math.min(1, pos.getY(i) / canonicalHeight));
        const ny = norm ? norm.getY(i) : 0.4;
        const ao = Math.max(0.7, Math.min(1.0, 0.78 + yn * 0.14 + Math.max(-0.25, ny) * 0.08));
        cols[i * 3] = ao;
        cols[i * 3 + 1] = ao;
        cols[i * 3 + 2] = ao;
      }
      g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    }

    bakedMeshes.push({ srcMesh: sm, geo: g });
  }

  const rawAngleRad = sumDxSq > 1e-5 ? Math.atan(sumDxDy / sumDxSq) : 0;
  const clampedArmRad = Math.max(0, Math.min(THREE.MathUtils.degToRad(58), rawAngleRad));
  const armAngleDeg = Math.round(Math.max(0, THREE.MathUtils.radToDeg(rawAngleRad)));
  const detectedPose: 't_pose' | 'a_pose' =
    clampedArmRad >= THREE.MathUtils.degToRad(14) ? 'a_pose' : 't_pose';

  // Construct canonical UAL rig in 1.0x canonical space for accurate capsule matching
  const rig = createCanonicalUalRig(profile, 1.0);
  const zAxis = new THREE.Vector3(0, 0, 1);

  let aPoseWorldMatrices: THREE.Matrix4[] | null = null;
  let segments: WorldCapsuleSegment[];

  if (detectedPose === 'a_pose') {
    rig.skeleton.pose();
    rig.armature.updateMatrixWorld(true);
    // Rotate +X left arm downward (-angle around +Z) and -X right arm downward (+angle around +Z)
    rotateBoneAroundWorldAxis(rig.boneByName.get('upperarm_l'), zAxis, -clampedArmRad);
    rotateBoneAroundWorldAxis(rig.boneByName.get('upperarm_r'), zAxis, clampedArmRad);
    aPoseWorldMatrices = rig.bones.map((b) => b.matrixWorld.clone());
    segments = buildUalCapsuleSegments(rig, true);
  } else {
    segments = buildUalCapsuleSegments(rig, false);
  }

  // Compute canonical T-pose rest matrices & inverse deltas if straightening from A-pose
  rig.skeleton.pose();
  rig.armature.updateMatrixWorld(true);
  const deltaMatrices: THREE.Matrix4[] | null = aPoseWorldMatrices
    ? rig.bones.map((b, idx) =>
        new THREE.Matrix4().multiplyMatrices(b.matrixWorld, aPoseWorldMatrices![idx].clone().invert())
      )
    : null;

  const skinnedMeshes: THREE.SkinnedMesh[] = [];
  const materials: PixelizerMaterial[] = [];
  const clonedTexSet = new Set<THREE.Texture>();
  const deltaNormMats = deltaMatrices
    ? deltaMatrices.map((m) => new THREE.Matrix3().setFromMatrix4(m))
    : null;

  for (let mIdx = 0; mIdx < bakedMeshes.length; mIdx++) {
    const { srcMesh, geo } = bakedMeshes[mIdx];
    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');

    const { skinIndices, skinWeights } = computeUalCapsuleSkinWeights(
      pos,
      segments,
      options.smoothnessFalloff ?? 0.075
    );
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    // Straighten A-pose geometry into canonical T-pose bind positions using the computed LBS weights
    if (deltaMatrices && deltaNormMats) {
      const pOut = new THREE.Vector3();
      const nOut = new THREE.Vector3();
      const pAccum = new THREE.Vector3();
      const nAccum = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        pAccum.set(0, 0, 0);
        nAccum.set(0, 0, 0);
        const i4 = i * 4;
        const sx = pos.getX(i);
        const sy = pos.getY(i);
        const sz = pos.getZ(i);
        const nx = norm ? norm.getX(i) : 0;
        const ny = norm ? norm.getY(i) : 1;
        const nz = norm ? norm.getZ(i) : 0;

        for (let k = 0; k < 4; k++) {
          const w = skinWeights[i4 + k];
          if (w <= 1e-6) continue;
          const bi = skinIndices[i4 + k];
          pOut.set(sx, sy, sz).applyMatrix4(deltaMatrices[bi]);
          pAccum.addScaledVector(pOut, w);
          nOut.set(nx, ny, nz).applyMatrix3(deltaNormMats[bi]);
          nAccum.addScaledVector(nOut, w);
        }

        pos.setXYZ(i, pAccum.x, pAccum.y, pAccum.z);
        if (norm) {
          if (nAccum.lengthSq() > 1e-8) nAccum.normalize();
          else nAccum.set(0, 1, 0);
          norm.setXYZ(i, nAccum.x, nAccum.y, nAccum.z);
        }
      }
      pos.needsUpdate = true;
      if (norm) norm.needsUpdate = true;
    }

    const srcMat = Array.isArray(srcMesh.material) ? srcMesh.material[0] : srcMesh.material;
    let mat: PixelizerMaterial;
    if (srcMat instanceof PixelizerMaterial) {
      const clonedAlbedo = cloneTextureSafely(srcMat.options.albedoMap);
      const clonedNormal = cloneTextureSafely(srcMat.options.normalMap);
      const clonedEmission = cloneTextureSafely(srcMat.options.emissionMap);
      if (clonedAlbedo) clonedTexSet.add(clonedAlbedo);
      if (clonedNormal) clonedTexSet.add(clonedNormal);
      if (clonedEmission) clonedTexSet.add(clonedEmission);

      mat = new PixelizerMaterial(
        {
          ...srcMat.options,
          pixelated: true,
          pixelSize,
          objectId,
          albedoMap: clonedAlbedo,
          normalMap: clonedNormal,
          emissionMap: clonedEmission,
          useVertexTangents: Boolean(clonedNormal && geo.getAttribute('uv')),
        },
        sharedResources
      );
      mat.vertexColors = Boolean(geo.getAttribute('color'));
    } else {
      mat = convertStandardMaterialToPixelizer(
        srcMat,
        {
          pixelated: true,
          pixelSize,
          objectId,
          outlineColor: '#14101c',
          edgeBevelWeight: 0.65,
          useColorGrading: true,
        },
        sharedResources,
        Boolean(geo.getAttribute('color'))
      );
      if (mat.options.albedoMap) {
        mat.options.albedoMap = cloneTextureSafely(mat.options.albedoMap);
        if (mat.options.albedoMap) clonedTexSet.add(mat.options.albedoMap);
      }
      if (mat.options.normalMap) {
        mat.options.normalMap = cloneTextureSafely(mat.options.normalMap);
        if (mat.options.normalMap) clonedTexSet.add(mat.options.normalMap);
        mat.options.useVertexTangents = Boolean(geo.getAttribute('uv'));
      }
      mat.syncUniforms();
    }

    if (mat.options.normalMap && geo.getAttribute('uv') && !geo.getAttribute('tangent')) {
      const triCount = geo.index ? geo.index.count / 3 : pos.count / 3;
      if (triCount > 0 && triCount <= 100000) {
        computeGeometryTangents(geo);
      }
    }
    if (mat.options.useVertexTangents && !geo.getAttribute('tangent')) {
      mat.updateOptions({ useVertexTangents: false });
    }

    geo.computeBoundingBox();
    geo.computeBoundingSphere();

    const skinned = new THREE.SkinnedMesh(geo, mat);
    skinned.name = srcMesh.name ? `${srcMesh.name}_UAL` : `AutoRig_Part_${mIdx}`;
    skinned.castShadow = true;
    skinned.receiveShadow = true;
    skinned.frustumCulled = false;
    skinned.userData.pixelizer = {
      snap: {
        snapPosition: true,
        alignPixelGrid: true,
        alignmentPixelSize: pixelSize,
        angleSnapMode: 'none',
        angleResolutionDeg: 45,
      },
      gridReference: rig.armature,
    };
    rig.armature.add(skinned);
    skinned.bind(rig.skeleton, new THREE.Matrix4());

    skinnedMeshes.push(skinned);
    materials.push(mat);
  }

  // Apply requested final world height (e.g. 1.79m NWL Hero standard) cleanly on Armature
  const finalScale = targetHeightM / canonicalHeight;
  rig.scale = finalScale;
  rig.armature.scale.setScalar(finalScale);
  rig.armature.updateMatrixWorld(true);
  rig.skeleton.calculateInverses();

  const rootName = options.name ?? (sourceRoot.name ? `${sourceRoot.name}_UAL` : 'AutoRig_UAL_Humanoid');
  rig.armature.name = rootName;
  rig.armature.userData.pixelizer = {
    snap: {
      snapPosition: true,
      alignPixelGrid: true,
      alignmentPixelSize: pixelSize,
      angleSnapMode: 'none',
      angleResolutionDeg: 45,
    },
    gridReference: rig.armature,
  };

  const dispose = () => {
    for (const sm of skinnedMeshes) {
      sm.geometry.dispose();
    }
    for (const m of materials) {
      m.dispose();
    }
    for (const t of clonedTexSet) {
      t.dispose();
    }
  };

  return {
    name: rootName,
    rig,
    root: rig.armature,
    skinnedMeshes,
    materials,
    detectedPose,
    armAngleDeg,
    dispose,
  };
}

