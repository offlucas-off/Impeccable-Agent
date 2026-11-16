import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  convertStandardMaterialToPixelizer,
  type PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../../engine/PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../../engine/PixelizerPipeline';
import type { PixelizerMaterialOptions, SnapOptions } from '../../engine/types';

export interface LoadedModelResult {
  root: THREE.Group;
  animations: THREE.AnimationClip[];
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  name: string;
}

const DEFAULT_SNAP: SnapOptions = {
  snapPosition: true,
  alignPixelGrid: true,
  alignmentPixelSize: 3,
  angleSnapMode: 'none',
  angleResolutionDeg: 45,
};

/**
 * Picks a lively showcase animation clip index (preferring Walk/Run/Dance/Survey over static poses).
 */
export function pickPreferredClipIndex(clips: THREE.AnimationClip[]): number {
  if (clips.length === 0) return 0;
  const preferred = [
    /^walking_a$/i,
    /^walk$/i,
    /^walking$/i,
    /^running_a$/i,
    /^run$/i,
    /^running$/i,
    /^dance$/i,
    /^survey$/i,
    /^idle$/i,
  ];
  for (const re of preferred) {
    const idx = clips.findIndex((c) => re.test(c.name.trim()));
    if (idx >= 0) return idx;
  }
  return 0;
}

/**
 * Normalizes any imported 3D model to fit neatly inside a ~2.6 unit bounding box,
 * resting with its base near y = 0, and converts its materials into PixelizerMaterials.
 * When unifyObjectId is true (default for character rigs), all sub-meshes share one objectId
 * so silhouettes merge without interior limb boundary scars.
 */
export function prepareLoadedObject(
  object: THREE.Object3D,
  name: string,
  animations: THREE.AnimationClip[],
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): LoadedModelResult {
  const wrapper = new THREE.Group();
  wrapper.name = name;
  wrapper.add(object);

  wrapper.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(wrapper);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const targetScale = 2.6 / maxDim;

  object.scale.multiplyScalar(targetScale);
  object.position.sub(center.multiplyScalar(targetScale));
  // Place bottom on y = 0
  wrapper.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(wrapper);
  object.position.y -= scaledBox.min.y;

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];
  const basePx = defaults.pixelSize ?? 3;
  const snapCfg: SnapOptions = {
    ...DEFAULT_SNAP,
    alignmentPixelSize: basePx,
  };

  let meshCounter = 0;
  wrapper.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshCounter++;
      child.castShadow = true;
      child.receiveShadow = true;
      // Preserve deformed bounding box reliability on SkinnedMeshes
      if (child instanceof THREE.SkinnedMesh) {
        child.frustumCulled = false;
      }

      const geo = child.geometry;
      if (geo && !geo.attributes.normal) {
        geo.computeVertexNormals();
      }
      const hasVertexColor = Boolean(geo?.attributes.color);

      const srcMats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      const converted: PixelizerMaterial[] = [];

      const assignedId = unifyObjectId
        ? defaults.objectId ?? 10
        : 10 + (meshCounter % 240);

      for (const sm of srcMats) {
        const pm = convertStandardMaterialToPixelizer(
          sm,
          {
            pixelated: true,
            pixelSize: basePx,
            objectId: assignedId,
            outlineColor: '#14101c',
            outlineAlpha: 1.0,
            edgeHighlight: 0.35,
            edgeBevelWeight: 0.65,
            useColorGrading: true,
            ...defaults,
          },
          sharedResources,
          hasVertexColor
        );
        converted.push(pm);
        materials.push(pm);
      }

      child.material = converted.length === 1 ? converted[0] : converted;
      child.userData.pixelizer = {
        snap: { ...snapCfg },
        gridReference: wrapper,
      } satisfies PixelizerObjectAttachment;
      meshes.push(child);
    }
  });

  wrapper.userData.pixelizer = {
    snap: { ...snapCfg },
    gridReference: wrapper,
  } satisfies PixelizerObjectAttachment;

  return { root: wrapper, animations, meshes, materials, name };
}

export async function loadModelFromUrl(
  url: string,
  name: string,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): Promise<LoadedModelResult> {
  const ext = (name.split('.').pop() || url.split('.').pop() || 'glb').toLowerCase();

  if (ext === 'glb' || ext === 'gltf') {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    return prepareLoadedObject(
      gltf.scene,
      name,
      gltf.animations ?? [],
      sharedResources,
      defaults,
      unifyObjectId
    );
  }

  if (ext === 'obj') {
    const loader = new OBJLoader();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const text = await res.text();
    const group = loader.parse(text);
    return prepareLoadedObject(group, name, [], sharedResources, defaults, unifyObjectId);
  }

  if (ext === 'fbx') {
    const loader = new FBXLoader();
    const fbx = await loader.loadAsync(url);
    return prepareLoadedObject(
      fbx,
      name,
      fbx.animations ?? [],
      sharedResources,
      defaults,
      unifyObjectId
    );
  }

  if (ext === 'stl') {
    const loader = new STLLoader();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}`);
    const buffer = await res.arrayBuffer();
    const geo = loader.parse(buffer);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#c4cdd9' }));
    const group = new THREE.Group();
    group.add(mesh);
    return prepareLoadedObject(group, name, [], sharedResources, defaults, unifyObjectId);
  }

  throw new Error(`Formato ".${ext}" não suportado. Use .glb, .gltf, .obj, .fbx ou .stl.`);
}

export async function loadModelFromFile(
  file: File,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {},
  unifyObjectId = true
): Promise<LoadedModelResult> {
  const url = URL.createObjectURL(file);
  try {
    return await loadModelFromUrl(url, file.name, sharedResources, defaults, unifyObjectId);
  } finally {
    URL.revokeObjectURL(url);
  }
}
