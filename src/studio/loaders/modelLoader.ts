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
 * Normalizes any imported 3D model to fit neatly inside a ~2.8 unit bounding box,
 * resting with its base near y = 0, and converts its materials into PixelizerMaterials.
 */
export function prepareLoadedObject(
  object: THREE.Object3D,
  name: string,
  animations: THREE.AnimationClip[],
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {}
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

  let meshCounter = 0;
  wrapper.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshCounter++;
      child.castShadow = true;
      child.receiveShadow = true;

      const geo = child.geometry;
      if (geo && !geo.attributes.normal) {
        geo.computeVertexNormals();
      }
      const hasVertexColor = Boolean(geo?.attributes.color);

      const srcMats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      const converted: PixelizerMaterial[] = [];

      for (const sm of srcMats) {
        const pm = convertStandardMaterialToPixelizer(
          sm,
          {
            pixelated: true,
            pixelSize: 3,
            objectId: 10 + (meshCounter % 240),
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
        snap: { ...DEFAULT_SNAP },
        gridReference: wrapper,
      } satisfies PixelizerObjectAttachment;
      meshes.push(child);
    }
  });

  wrapper.userData.pixelizer = {
    snap: { ...DEFAULT_SNAP },
    gridReference: wrapper,
  } satisfies PixelizerObjectAttachment;

  return { root: wrapper, animations, meshes, materials, name };
}

export async function loadModelFromFile(
  file: File,
  sharedResources: PixelizerMaterialResources,
  defaults: PixelizerMaterialOptions = {}
): Promise<LoadedModelResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const url = URL.createObjectURL(file);

  try {
    if (ext === 'glb' || ext === 'gltf') {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(url);
      return prepareLoadedObject(
        gltf.scene,
        file.name,
        gltf.animations ?? [],
        sharedResources,
        defaults
      );
    }

    if (ext === 'obj') {
      const loader = new OBJLoader();
      const text = await file.text();
      const group = loader.parse(text);
      return prepareLoadedObject(group, file.name, [], sharedResources, defaults);
    }

    if (ext === 'fbx') {
      const loader = new FBXLoader();
      const fbx = await loader.loadAsync(url);
      return prepareLoadedObject(
        fbx,
        file.name,
        fbx.animations ?? [],
        sharedResources,
        defaults
      );
    }

    if (ext === 'stl') {
      const loader = new STLLoader();
      const buffer = await file.arrayBuffer();
      const geo = loader.parse(buffer);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: '#c4cdd9' })
      );
      const group = new THREE.Group();
      group.add(mesh);
      return prepareLoadedObject(group, file.name, [], sharedResources, defaults);
    }

    throw new Error(
      `Formato ".${ext}" não suportado. Use .glb, .gltf, .obj, .fbx ou .stl.`
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
