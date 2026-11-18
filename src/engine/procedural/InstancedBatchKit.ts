import * as THREE from 'three';
import type { PixelizerMaterial } from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';

export interface InstancePlacement {
  position: [number, number, number];
  rotationY?: number;
  scale?: [number, number, number] | number;
}

export interface InstancedBatchOptions {
  name: string;
  geometry: THREE.BufferGeometry;
  material: PixelizerMaterial;
  placements: InstancePlacement[];
  pixelSize?: number;
  gridReference?: THREE.Object3D | null;
  castShadow?: boolean;
  receiveShadow?: boolean;
  frustumCulled?: boolean;
}

/**
 * Creates a single GPU-instanced `THREE.InstancedMesh` batch for repeated static props
 * (lamps, pillars, rocks, torches, traps) wired into `PixelizerPipeline` snapping.
 */
export function buildInstancedPropBatch(options: InstancedBatchOptions): THREE.InstancedMesh {
  const count = Math.max(1, options.placements.length);
  const inst = new THREE.InstancedMesh(options.geometry, options.material, count);
  inst.name = options.name;
  inst.castShadow = options.castShadow ?? true;
  inst.receiveShadow = options.receiveShadow ?? true;
  inst.frustumCulled = options.frustumCulled ?? true;

  const dummy = new THREE.Object3D();
  options.placements.forEach((p, idx) => {
    dummy.position.set(p.position[0], p.position[1], p.position[2]);
    dummy.rotation.set(0, p.rotationY ?? 0, 0);
    if (typeof p.scale === 'number') {
      dummy.scale.setScalar(p.scale);
    } else if (Array.isArray(p.scale)) {
      dummy.scale.set(p.scale[0], p.scale[1], p.scale[2]);
    } else {
      dummy.scale.set(1, 1, 1);
    }
    dummy.updateMatrix();
    inst.setMatrixAt(idx, dummy.matrix);
  });

  inst.instanceMatrix.needsUpdate = true;
  inst.computeBoundingSphere();

  inst.userData.pixelizer = {
    snap: {
      snapPosition: false,
      alignPixelGrid: true,
      alignmentPixelSize: options.pixelSize ?? 1,
      angleSnapMode: 'none',
      angleResolutionDeg: 45,
    },
    gridReference: options.gridReference ?? inst,
  } satisfies PixelizerObjectAttachment;

  return inst;
}
