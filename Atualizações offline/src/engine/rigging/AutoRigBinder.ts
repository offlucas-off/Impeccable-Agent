import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerMaterialOptions } from '../types';
import { UAL_SKELETON_SPEC, type CanonicalUalRig } from './UalRigSpec';

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
 * Extracts world-space capsule segments for the 17 structural UAL bones in Rest Pose.
 */
export function buildUalCapsuleSegments(rig: CanonicalUalRig): WorldCapsuleSegment[] {
  rig.skeleton.pose();
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
  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);
  const rigidHints = options.perVertexBoneIndices;

  if (rigidHints && rigidHints.length === vCount) {
    for (let i = 0; i < vCount; i++) {
      skinIndices[i * 4] = rigidHints[i];
      skinWeights[i * 4] = 1.0;
    }
  } else {
    const segments = buildUalCapsuleSegments(rig);
    const falloff = Math.max(0.02, options.smoothnessFalloff ?? 0.065);
    const invSharpness = 1 / (falloff * falloff);

    for (let i = 0; i < vCount; i++) {
      _p.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));

      // Accumulate best score per boneIndex
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
