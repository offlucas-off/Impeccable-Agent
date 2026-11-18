import * as THREE from 'three';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import type { VfxParticleBurstSpec } from './VfxRecipe';

const SCRATCH_POS = new THREE.Vector3();
const SCRATCH_QUAT = new THREE.Quaternion();
const SCRATCH_SCALE = new THREE.Vector3();
const SCRATCH_MAT = new THREE.Matrix4();
const SCRATCH_COLOR = new THREE.Color();

export class InstancedVfxParticlePool {
  public readonly mesh: THREE.InstancedMesh;
  public readonly material: PixelizerMaterial;
  public readonly maxParticles: number;

  private activeCount = 0;
  private px: Float32Array;
  private py: Float32Array;
  private pz: Float32Array;
  private vx: Float32Array;
  private vy: Float32Array;
  private vz: Float32Array;
  private life: Float32Array;
  private maxLife: Float32Array;
  private size: Float32Array;
  private gravity: Float32Array;
  private cr: Float32Array;
  private cg: Float32Array;
  private cb: Float32Array;

  constructor(maxParticles = 256, sharedResources?: PixelizerMaterialResources) {
    this.maxParticles = Math.max(16, maxParticles);

    const geom = new THREE.BoxGeometry(1, 1, 1);
    this.material = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 2,
        objectId: 240,
        outlineAlpha: 0.0,
        baseColor: '#ffffff',
        emissionColor: '#ffffff',
        emissionIntensity: 1.5,
        emissiveVertexColorWeight: 1.0,
        diffuseVertexColorWeight: 1.0,
        useDitheredTransparency: false,
      },
      sharedResources
    );

    this.mesh = new THREE.InstancedMesh(geom, this.material, this.maxParticles);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;

    // Initialize instanceColor buffer
    SCRATCH_COLOR.setHex(0xffffff);
    for (let i = 0; i < this.maxParticles; i++) {
      this.mesh.setColorAt(i, SCRATCH_COLOR);
    }
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      this.mesh.instanceColor.needsUpdate = true;
    }

    this.px = new Float32Array(this.maxParticles);
    this.py = new Float32Array(this.maxParticles);
    this.pz = new Float32Array(this.maxParticles);
    this.vx = new Float32Array(this.maxParticles);
    this.vy = new Float32Array(this.maxParticles);
    this.vz = new Float32Array(this.maxParticles);
    this.life = new Float32Array(this.maxParticles);
    this.maxLife = new Float32Array(this.maxParticles);
    this.size = new Float32Array(this.maxParticles);
    this.gravity = new Float32Array(this.maxParticles);
    this.cr = new Float32Array(this.maxParticles);
    this.cg = new Float32Array(this.maxParticles);
    this.cb = new Float32Array(this.maxParticles);
  }

  public spawnBurst(origin: THREE.Vector3, spec: VfxParticleBurstSpec, dir?: THREE.Vector3): void {
    SCRATCH_COLOR.set(spec.colorHex);
    const r = SCRATCH_COLOR.r;
    const g = SCRATCH_COLOR.g;
    const b = SCRATCH_COLOR.b;
    const grav = spec.gravity ?? -6.0;
    const spread = spec.spreadAngleRad ?? Math.PI;
    const upBias = spec.upwardBias ?? 0.35;

    for (let i = 0; i < spec.count; i++) {
      if (this.activeCount >= this.maxParticles) break;
      const idx = this.activeCount++;

      this.px[idx] = origin.x;
      this.py[idx] = origin.y;
      this.pz[idx] = origin.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * spread;
      const sinPhi = Math.sin(phi);
      let dx = sinPhi * Math.cos(theta);
      let dy = Math.cos(phi) + upBias;
      let dz = sinPhi * Math.sin(theta);

      if (dir) {
        dx += dir.x * 0.5;
        dy += dir.y * 0.5;
        dz += dir.z * 0.5;
      }

      const len = Math.hypot(dx, dy, dz) || 1;
      const spd = spec.speedMin + Math.random() * (spec.speedMax - spec.speedMin);
      this.vx[idx] = (dx / len) * spd;
      this.vy[idx] = (dy / len) * spd;
      this.vz[idx] = (dz / len) * spd;

      this.life[idx] = spec.lifeSec;
      this.maxLife[idx] = Math.max(0.01, spec.lifeSec);
      this.size[idx] = spec.sizeMin + Math.random() * (spec.sizeMax - spec.sizeMin);
      this.gravity[idx] = grav;

      this.cr[idx] = r;
      this.cg[idx] = g;
      this.cb[idx] = b;
    }
  }

  public update(dt: number): void {
    if (this.activeCount === 0) {
      this.mesh.count = 0;
      return;
    }

    let i = 0;
    while (i < this.activeCount) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        const last = this.activeCount - 1;
        if (i !== last) {
          this.px[i] = this.px[last];
          this.py[i] = this.py[last];
          this.pz[i] = this.pz[last];
          this.vx[i] = this.vx[last];
          this.vy[i] = this.vy[last];
          this.vz[i] = this.vz[last];
          this.life[i] = this.life[last];
          this.maxLife[i] = this.maxLife[last];
          this.size[i] = this.size[last];
          this.gravity[i] = this.gravity[last];
          this.cr[i] = this.cr[last];
          this.cg[i] = this.cg[last];
          this.cb[i] = this.cb[last];
        }
        this.activeCount--;
        continue;
      }

      this.vy[i] += this.gravity[i] * dt;
      this.px[i] += this.vx[i] * dt;
      this.py[i] += this.vy[i] * dt;
      this.pz[i] += this.vz[i] * dt;

      const t = Math.max(0, this.life[i] / this.maxLife[i]);
      // Stepped pixel scale shrink
      const steppedT = Math.ceil(t * 4) / 4;
      const s = this.size[i] * steppedT;

      SCRATCH_POS.set(this.px[i], this.py[i], this.pz[i]);
      SCRATCH_SCALE.set(s, s, s);
      SCRATCH_MAT.compose(SCRATCH_POS, SCRATCH_QUAT, SCRATCH_SCALE);
      this.mesh.setMatrixAt(i, SCRATCH_MAT);

      SCRATCH_COLOR.setRGB(this.cr[i], this.cg[i], this.cb[i]);
      this.mesh.setColorAt(i, SCRATCH_COLOR);

      i++;
    }

    this.mesh.count = this.activeCount;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  public clear(): void {
    this.activeCount = 0;
    this.mesh.count = 0;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
