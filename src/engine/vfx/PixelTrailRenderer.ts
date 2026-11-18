import * as THREE from 'three';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';

const SCRATCH_TAN = new THREE.Vector3();
const SCRATCH_SIDE = new THREE.Vector3();
const SCRATCH_UP = new THREE.Vector3(0, 1, 0);

export interface PixelTrailOptions {
  maxPoints?: number;
  width?: number;
  pixelSnapStep?: number;
  lifetimeSec?: number;
  colorHex?: string;
  emissionIntensity?: number;
  sharedResources?: PixelizerMaterialResources;
}

export class PixelTrailRenderer {
  public readonly mesh: THREE.Mesh;
  public readonly material: PixelizerMaterial;

  private readonly maxPoints: number;
  private readonly width: number;
  private readonly pixelSnapStep: number;
  private readonly lifetimeSec: number;

  private readonly ptsX: Float32Array;
  private readonly ptsY: Float32Array;
  private readonly ptsZ: Float32Array;
  private readonly ptsAge: Float32Array;
  private head = 0;
  private count = 0;

  private readonly posAttr: THREE.BufferAttribute;
  private readonly uvAttr: THREE.BufferAttribute;

  constructor(options: PixelTrailOptions = {}) {
    this.maxPoints = Math.max(8, options.maxPoints ?? 32);
    this.width = options.width ?? 0.24;
    this.pixelSnapStep = options.pixelSnapStep ?? 0.04;
    this.lifetimeSec = options.lifetimeSec ?? 0.35;

    this.ptsX = new Float32Array(this.maxPoints);
    this.ptsY = new Float32Array(this.maxPoints);
    this.ptsZ = new Float32Array(this.maxPoints);
    this.ptsAge = new Float32Array(this.maxPoints);

    const vertCount = this.maxPoints * 2;
    const positions = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);
    const indices = new Uint16Array((this.maxPoints - 1) * 6);

    for (let i = 0; i < this.maxPoints - 1; i++) {
      const v0 = i * 2;
      const v1 = v0 + 1;
      const v2 = v0 + 2;
      const v3 = v0 + 3;
      const idx = i * 6;
      indices[idx] = v0;
      indices[idx + 1] = v2;
      indices[idx + 2] = v1;
      indices[idx + 3] = v1;
      indices[idx + 4] = v2;
      indices[idx + 5] = v3;
    }

    const geom = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(positions, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.uvAttr = new THREE.BufferAttribute(uvs, 2);
    this.uvAttr.setUsage(THREE.DynamicDrawUsage);

    geom.setAttribute('position', this.posAttr);
    geom.setAttribute('uv', this.uvAttr);
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.setDrawRange(0, 0);

    const colorHex = options.colorHex ?? '#ff9933';
    this.material = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 2,
        objectId: 241,
        outlineAlpha: 0.0,
        baseColor: colorHex,
        emissionColor: colorHex,
        emissionIntensity: options.emissionIntensity ?? 1.8,
        useDitheredTransparency: true,
        alpha: 0.95,
      },
      options.sharedResources
    );
    this.material.side = THREE.DoubleSide;

    this.mesh = new THREE.Mesh(geom, this.material);
    this.mesh.frustumCulled = false;
  }

  public addPoint(pos: THREE.Vector3): void {
    this.head = (this.head + 1) % this.maxPoints;
    this.ptsX[this.head] = pos.x;
    this.ptsY[this.head] = pos.y;
    this.ptsZ[this.head] = pos.z;
    this.ptsAge[this.head] = 0;
    if (this.count < this.maxPoints) {
      this.count++;
    }
  }

  public update(dt: number, cameraPos?: THREE.Vector3): void {
    if (this.count < 2) {
      this.mesh.geometry.setDrawRange(0, 0);
      return;
    }

    // Age points and prune expired tail
    let validCount = 0;
    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - i + this.maxPoints) % this.maxPoints;
      this.ptsAge[idx] += dt;
      if (this.ptsAge[idx] <= this.lifetimeSec) {
        validCount++;
      } else {
        break;
      }
    }
    this.count = validCount;

    if (this.count < 2) {
      this.mesh.geometry.setDrawRange(0, 0);
      return;
    }

    const posArr = this.posAttr.array as Float32Array;
    const uvArr = this.uvAttr.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      const idx = (this.head - i + this.maxPoints) % this.maxPoints;
      const x = this.ptsX[idx];
      const y = this.ptsY[idx];
      const z = this.ptsZ[idx];

      // Tangent along trail
      if (i < this.count - 1) {
        const nextIdx = (this.head - (i + 1) + this.maxPoints) % this.maxPoints;
        SCRATCH_TAN.set(
          this.ptsX[nextIdx] - x,
          this.ptsY[nextIdx] - y,
          this.ptsZ[nextIdx] - z
        );
      } else {
        const prevIdx = (this.head - (i - 1) + this.maxPoints) % this.maxPoints;
        SCRATCH_TAN.set(
          x - this.ptsX[prevIdx],
          y - this.ptsY[prevIdx],
          z - this.ptsZ[prevIdx]
        );
      }

      if (SCRATCH_TAN.lengthSq() < 1e-6) {
        SCRATCH_TAN.set(0, 0, 1);
      } else {
        SCRATCH_TAN.normalize();
      }

      if (cameraPos) {
        SCRATCH_SIDE.set(cameraPos.x - x, cameraPos.y - y, cameraPos.z - z).normalize();
        SCRATCH_SIDE.cross(SCRATCH_TAN).normalize();
      } else {
        SCRATCH_SIDE.crossVectors(SCRATCH_TAN, SCRATCH_UP);
        if (SCRATCH_SIDE.lengthSq() < 1e-6) {
          SCRATCH_SIDE.set(1, 0, 0);
        } else {
          SCRATCH_SIDE.normalize();
        }
      }

      const age01 = Math.min(1, Math.max(0, this.ptsAge[idx] / this.lifetimeSec));
      // Stepped pixel-grid aligned width taper
      const rawHalfW = this.width * 0.5 * (1 - age01);
      const halfW = Math.max(
        0,
        Math.round(rawHalfW / this.pixelSnapStep) * this.pixelSnapStep
      );

      const vBase = i * 6;
      posArr[vBase] = x - SCRATCH_SIDE.x * halfW;
      posArr[vBase + 1] = y - SCRATCH_SIDE.y * halfW;
      posArr[vBase + 2] = z - SCRATCH_SIDE.z * halfW;

      posArr[vBase + 3] = x + SCRATCH_SIDE.x * halfW;
      posArr[vBase + 4] = y + SCRATCH_SIDE.y * halfW;
      posArr[vBase + 5] = z + SCRATCH_SIDE.z * halfW;

      const u = i / Math.max(1, this.count - 1);
      const uvBase = i * 4;
      uvArr[uvBase] = u;
      uvArr[uvBase + 1] = 0;
      uvArr[uvBase + 2] = u;
      uvArr[uvBase + 3] = 1;
    }

    // Stepped dithered dissolve based on oldest point
    const tailIdx = (this.head - (this.count - 1) + this.maxPoints) % this.maxPoints;
    const tailAge01 = Math.min(1, this.ptsAge[tailIdx] / this.lifetimeSec);
    const steppedDissolve = Math.floor(tailAge01 * 4) / 4;
    this.material.setVfxParams({ dissolveThreshold: steppedDissolve * 0.35 });

    this.posAttr.needsUpdate = true;
    this.uvAttr.needsUpdate = true;
    this.mesh.geometry.setDrawRange(0, (this.count - 1) * 6);
  }

  public clear(): void {
    this.count = 0;
    this.mesh.geometry.setDrawRange(0, 0);
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
