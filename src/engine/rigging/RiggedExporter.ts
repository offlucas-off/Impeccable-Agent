import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PixelizerMaterial } from '../PixelizerMaterial';

export interface RiggedExportOptions {
  name?: string;
  selectedClipNames?: string[];
  resetToRestPose?: boolean;
  /** Clamp metalness <= 0.35 so engines without HDR EnvMaps (Godot/Three/Unity) don't render dark silhouettes */
  safeMaxMetalness?: number;
}

export interface RiggedExportValidation {
  meshCount: number;
  skinnedMeshCount: number;
  boneCount: number;
  clipCount: number;
  normalizedVertices: number;
  warnings: string[];
}

function convertToExportStandardMaterial(
  src: THREE.Material | null | undefined,
  hasVertexColors: boolean,
  safeMaxMetalness: number
): THREE.MeshStandardMaterial {
  if (src instanceof PixelizerMaterial) {
    const o = src.options;
    const isMetal = o.workflow === 'metallic';
    const metalness = isMetal ? Math.min(safeMaxMetalness, Math.max(0.05, o.metallic)) : 0.08;
    const roughness = Math.max(0.25, Math.min(0.95, 1.0 - o.smoothness));
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(o.baseColor),
      vertexColors: hasVertexColors || src.vertexColors,
      map: o.albedoMap ?? null,
      normalMap: o.normalMap ?? null,
      emissive: new THREE.Color(o.emissionColor),
      emissiveIntensity: o.emissionIntensity > 0 ? Math.min(0.35, o.emissionIntensity * 0.25) : 0,
      metalness,
      roughness,
      side: src.side,
    });
  }

  if (src instanceof THREE.MeshStandardMaterial) {
    const cloned = src.clone();
    cloned.metalness = Math.min(safeMaxMetalness, cloned.metalness);
    return cloned;
  }

  const fallback = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cfd6e2'),
    vertexColors: hasVertexColors,
    metalness: 0.08,
    roughness: 0.72,
  });
  return fallback;
}

/**
 * Validates and fixes skinWeight normalization (`sum === 1.0`) on every SkinnedMesh in a hierarchy.
 */
export function validateAndNormalizeRiggedHierarchy(root: THREE.Object3D): RiggedExportValidation {
  let meshCount = 0;
  let skinnedMeshCount = 0;
  let boneCount = 0;
  let normalizedVertices = 0;
  const warnings: string[] = [];

  root.traverse((obj) => {
    if (obj instanceof THREE.Bone) {
      boneCount++;
    }
    if (obj instanceof THREE.Mesh) {
      meshCount++;
      if (obj instanceof THREE.SkinnedMesh) {
        skinnedMeshCount++;
        const geo = obj.geometry;
        const sw = geo.getAttribute('skinWeight');
        const si = geo.getAttribute('skinIndex');
        if (!sw || !si) {
          warnings.push(`SkinnedMesh "${obj.name}" sem skinIndex/skinWeight.`);
          return;
        }
        for (let i = 0; i < sw.count; i++) {
          const w0 = sw.getX(i);
          const w1 = sw.getY(i);
          const w2 = sw.getZ(i);
          const w3 = sw.getW(i);
          const sum = w0 + w1 + w2 + w3;
          if (Math.abs(sum - 1.0) > 1e-4) {
            if (sum > 1e-6) {
              sw.setXYZW(i, w0 / sum, w1 / sum, w2 / sum, w3 / sum);
            } else {
              sw.setXYZW(i, 1, 0, 0, 0);
            }
            normalizedVertices++;
          }
        }
        sw.needsUpdate = true;
      }
    }
  });

  return {
    meshCount,
    skinnedMeshCount,
    boneCount,
    clipCount: 0,
    normalizedVertices,
    warnings,
  };
}

/**
 * Exports a rigged character (either SkinnedMesh or NWL rigid-bone-child assembly)
 * together with its canonical 65-bone Skeleton and selected AnimationClips into a binary .GLB.
 */
export async function exportRiggedAssetToGlb(
  sourceRoot: THREE.Object3D,
  clips: THREE.AnimationClip[],
  options: RiggedExportOptions = {}
): Promise<{ buffer: ArrayBuffer; validation: RiggedExportValidation }> {
  const safeMaxMetalness = options.safeMaxMetalness ?? 0.35;
  const resetToRestPose = options.resetToRestPose !== false;

  // Safely deep clone preserving Skeleton + Bone references without mutating viewport live state
  const clone = SkeletonUtils.clone(sourceRoot);
  if (options.name) {
    clone.name = options.name;
  }

  const disposableMats: THREE.Material[] = [];
  const boneNamesInClone = new Set<string>();

  clone.traverse((obj) => {
    if (obj instanceof THREE.Bone || obj.name) {
      boneNamesInClone.add(obj.name);
    }
    if (obj instanceof THREE.SkinnedMesh && obj.skeleton && resetToRestPose) {
      obj.skeleton.pose();
    }
    if (obj instanceof THREE.Mesh) {
      const hasCol = Boolean(obj.geometry?.getAttribute('color'));
      if (Array.isArray(obj.material)) {
        const nextMats = obj.material.map((m) => {
          const conv = convertToExportStandardMaterial(m, hasCol, safeMaxMetalness);
          disposableMats.push(conv);
          return conv;
        });
        obj.material = nextMats;
      } else {
        const conv = convertToExportStandardMaterial(obj.material, hasCol, safeMaxMetalness);
        disposableMats.push(conv);
        obj.material = conv;
      }
    }
  });

  const validation = validateAndNormalizeRiggedHierarchy(clone);

  // Filter animations to requested subset & drop orphaned tracks not targeting nodes in clone
  const selectedSet =
    options.selectedClipNames && options.selectedClipNames.length > 0
      ? new Set(options.selectedClipNames)
      : null;

  const exportClips: THREE.AnimationClip[] = [];
  for (const clip of clips) {
    if (selectedSet && !selectedSet.has(clip.name)) continue;
    const validTracks = clip.tracks.filter((t) => {
      const dot = t.name.lastIndexOf('.');
      const nodeName = dot > 0 ? t.name.slice(0, dot) : t.name;
      return boneNamesInClone.has(nodeName);
    });
    if (validTracks.length > 0) {
      const c = new THREE.AnimationClip(clip.name, clip.duration, validTracks.map((t) => t.clone()));
      exportClips.push(c);
    }
  }
  validation.clipCount = exportClips.length;

  clone.updateMatrixWorld(true);
  const exporter = new GLTFExporter();
  const res = await exporter.parseAsync(clone, {
    binary: true,
    onlyVisible: true,
    animations: exportClips,
  });

  for (const m of disposableMats) {
    m.dispose();
  }

  let buffer: ArrayBuffer;
  if (res instanceof ArrayBuffer) {
    buffer = res;
  } else {
    const encoded = new TextEncoder().encode(JSON.stringify(res));
    buffer = encoded.buffer;
  }

  return { buffer, validation };
}
