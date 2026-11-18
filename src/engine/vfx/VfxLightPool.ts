import * as THREE from 'three';

interface LightSlot {
  light: THREE.PointLight;
  lifeSec: number;
  maxLifeSec: number;
  peakIntensity: number;
  active: boolean;
}

export class VfxLightPool {
  private readonly slots: LightSlot[] = [];

  constructor(scene: THREE.Scene, poolSize = 6) {
    const count = Math.max(4, Math.min(8, poolSize));
    for (let i = 0; i < count; i++) {
      const light = new THREE.PointLight(0xffffff, 0, 6, 2);
      light.castShadow = false;
      scene.add(light);
      this.slots.push({
        light,
        lifeSec: 0,
        maxLifeSec: 1,
        peakIntensity: 0,
        active: false,
      });
    }
  }

  public spawnFlash(
    position: THREE.Vector3,
    colorHex: string | number,
    intensity: number,
    distance: number,
    durationSec: number
  ): void {
    let chosen: LightSlot | null = null;
    for (let i = 0; i < this.slots.length; i++) {
      if (!this.slots[i].active) {
        chosen = this.slots[i];
        break;
      }
    }
    // Evict the slot with the least remaining life if pool is full
    if (!chosen) {
      chosen = this.slots[0];
      for (let i = 1; i < this.slots.length; i++) {
        if (this.slots[i].lifeSec < chosen.lifeSec) {
          chosen = this.slots[i];
        }
      }
    }

    chosen.active = true;
    chosen.lifeSec = Math.max(0.05, durationSec);
    chosen.maxLifeSec = chosen.lifeSec;
    chosen.peakIntensity = intensity;
    chosen.light.position.copy(position);
    chosen.light.color.set(colorHex);
    chosen.light.distance = distance;
    chosen.light.intensity = intensity;
  }

  public update(dt: number): void {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (!slot.active) continue;

      slot.lifeSec -= dt;
      if (slot.lifeSec <= 0) {
        slot.active = false;
        slot.light.intensity = 0;
      } else {
        const t = slot.lifeSec / slot.maxLifeSec;
        slot.light.intensity = slot.peakIntensity * t;
      }
    }
  }

  public clear(): void {
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].active = false;
      this.slots[i].light.intensity = 0;
    }
  }

  public dispose(scene: THREE.Scene): void {
    for (let i = 0; i < this.slots.length; i++) {
      scene.remove(this.slots[i].light);
      this.slots[i].light.dispose();
    }
    this.slots.length = 0;
  }
}
