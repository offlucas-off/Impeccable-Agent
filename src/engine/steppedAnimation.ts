import * as THREE from 'three';
import { conditionClipForEquipment } from './rigging/AnimationLibraryBank';
import type { SteppedAnimationConfig } from './types';

export interface EquipmentConditioningFlags {
  hasMainWeapon: boolean;
  hasShield: boolean;
}

const CONDITIONED_CLIPS = new WeakSet<THREE.AnimationClip>();
const SHIELD_FLARE_AXIS = new THREE.Vector3(0, 0, 1);

function hasAncestorNamed(obj: THREE.Object3D, names: ReadonlySet<string>): boolean {
  let cur: THREE.Object3D | null = obj.parent;
  while (cur) {
    if (names.has(cur.name)) return true;
    cur = cur.parent;
  }
  return false;
}

const MAIN_HAND_ANCESTORS = new Set(['Socket_hand_r']);
const OFF_HAND_ANCESTORS = new Set(['Socket_shield_l', 'Socket_hand_l']);
const OFF_HAND_BONES = new Set(['lowerarm_l', 'hand_l']);

/**
 * Inspects a subject hierarchy for mounted right-hand weapons (`weapon_main` / `Socket_hand_r`)
 * or offhand shields/weapons (`weapon_off` / `Socket_shield_l` / `Socket_hand_l`).
 */
export function detectSubjectEquipment(root: THREE.Object3D): EquipmentConditioningFlags {
  let hasMainWeapon = false;
  let hasShield = false;

  root.traverse((obj) => {
    if (hasMainWeapon && hasShield) return;
    if (!(obj instanceof THREE.Mesh)) return;

    const equipSlot = obj.userData?.equipSlot as string | undefined;
    if (equipSlot === 'gloves') return;

    if (equipSlot === 'weapon_main') {
      hasMainWeapon = true;
      return;
    }
    if (equipSlot === 'weapon_off' || equipSlot === 'offhand') {
      hasShield = true;
      return;
    }

    const inOffSocket = hasAncestorNamed(obj, OFF_HAND_ANCESTORS);
    const inMainSocket = hasAncestorNamed(obj, MAIN_HAND_ANCESTORS);

    if (inOffSocket) {
      hasShield = true;
    } else if (inMainSocket) {
      hasMainWeapon = true;
    } else if (equipSlot === 'weapon') {
      if (hasAncestorNamed(obj, OFF_HAND_BONES)) {
        hasShield = true;
      } else {
        hasMainWeapon = true;
      }
    }
  });

  return { hasMainWeapon, hasShield };
}

/**
 * Clones and conditions an animation clip so equipped weapons and shields clear torso/head/thighs.
 * Uses `conditionClipForEquipment` from `AnimationLibraryBank.ts` and prevents double-conditioning.
 */
export function conditionClipWithEquipment(
  clip: THREE.AnimationClip,
  eq: EquipmentConditioningFlags
): THREE.AnimationClip {
  if (!eq.hasMainWeapon && !eq.hasShield) {
    return clip.clone();
  }
  if (CONDITIONED_CLIPS.has(clip)) {
    return clip;
  }

  const conditioned = conditionClipForEquipment(clip, {
    elbowFlareDeg: eq.hasMainWeapon ? 12 : 9,
    clearanceMeters: eq.hasMainWeapon && eq.hasShield ? 0.045 : 0.035,
    weaponLengthMeters: eq.hasMainWeapon ? 0.9 : 0.55,
  });

  if (eq.hasShield && /walk|run|sprint|jog|strafe|locomotion|idle/i.test(conditioned.name)) {
    const shieldFlareQuat = new THREE.Quaternion().setFromAxisAngle(
      SHIELD_FLARE_AXIS,
      THREE.MathUtils.degToRad(-9)
    );
    const q = new THREE.Quaternion();
    for (const track of conditioned.tracks) {
      if (track.name === 'upperarm_l.quaternion') {
        const vals = track.values;
        for (let i = 0; i + 3 < vals.length; i += 4) {
          q.set(vals[i], vals[i + 1], vals[i + 2], vals[i + 3])
            .multiply(shieldFlareQuat)
            .normalize();
          vals[i] = q.x;
          vals[i + 1] = q.y;
          vals[i + 2] = q.z;
          vals[i + 3] = q.w;
        }
      }
    }
  }

  CONDITIONED_CLIPS.add(conditioned);
  return conditioned;
}

/**
 * Quantizes continuous 3D animation playback (skeletal/GLTF clips or procedural animation time)
 * to discrete stepped intervals so 3D models animate like hand-drawn sprite flipbooks.
 */
export class SteppedAnimationController {
  private continuousTime = 0;
  private quantizedTime = 0;
  private mixer: THREE.AnimationMixer | null = null;
  private clips: THREE.AnimationClip[] = [];
  private activeAction: THREE.AnimationAction | null = null;
  private activeClipIndex = 0;

  public config: SteppedAnimationConfig = {
    enabled: true,
    fps: 8,
    playbackSpeed: 1.0,
    paused: false,
  };

  public bindModel(
    root: THREE.Object3D,
    animations: THREE.AnimationClip[],
    options?: {
      conditionEquipment?: boolean;
      equipmentFlags?: Partial<EquipmentConditioningFlags>;
    }
  ): void {
    this.dispose();
    this.continuousTime = 0;
    this.quantizedTime = 0;

    let finalClips = animations;
    if (options?.conditionEquipment !== false && animations.length > 0) {
      const detected = detectSubjectEquipment(root);
      const eq: EquipmentConditioningFlags = {
        hasMainWeapon: options?.equipmentFlags?.hasMainWeapon ?? detected.hasMainWeapon,
        hasShield: options?.equipmentFlags?.hasShield ?? detected.hasShield,
      };
      if (eq.hasMainWeapon || eq.hasShield) {
        finalClips = animations.map((clip) => conditionClipWithEquipment(clip, eq));
      }
    }

    this.clips = finalClips;
    if (finalClips.length > 0) {
      this.mixer = new THREE.AnimationMixer(root);
      this.playClip(0);
    }
  }

  public getClips(): THREE.AnimationClip[] {
    return this.clips;
  }

  public getActiveClipIndex(): number {
    return this.activeClipIndex;
  }

  public getActiveClip(): THREE.AnimationClip | null {
    return this.clips[this.activeClipIndex] ?? null;
  }

  public playClip(index: number, crossFadeSeconds = 0): void {
    if (!this.mixer || index < 0 || index >= this.clips.length) return;
    const prevAction = this.activeAction;
    this.activeClipIndex = index;
    const nextAction = this.mixer.clipAction(this.clips[index]);
    nextAction.reset();
    nextAction.play();
    if (prevAction && prevAction !== nextAction) {
      if (crossFadeSeconds > 0.01) {
        prevAction.crossFadeTo(nextAction, crossFadeSeconds, true);
      } else {
        prevAction.stop();
      }
    }
    this.activeAction = nextAction;
    this.mixer.setTime(this.quantizedTime);
  }

  public update(deltaSeconds: number): number {
    if (!this.config.paused) {
      this.continuousTime += deltaSeconds * this.config.playbackSpeed;
    }

    if (this.config.enabled && this.config.fps > 0) {
      const step = 1 / this.config.fps;
      this.quantizedTime = Math.floor(this.continuousTime / step) * step;
    } else {
      this.quantizedTime = this.continuousTime;
    }

    if (this.mixer) {
      this.mixer.setTime(this.quantizedTime);
    }

    return this.quantizedTime;
  }

  public setTime(seconds: number): void {
    this.continuousTime = Math.max(0, seconds);
    if (this.config.enabled && this.config.fps > 0) {
      const step = 1 / this.config.fps;
      this.quantizedTime = Math.floor(this.continuousTime / step) * step;
    } else {
      this.quantizedTime = this.continuousTime;
    }
    if (this.mixer) {
      this.mixer.setTime(this.quantizedTime);
    }
  }

  public getQuantizedTime(): number {
    return this.quantizedTime;
  }

  public getContinuousTime(): number {
    return this.continuousTime;
  }

  public dispose(): void {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = null;
    }
    this.activeAction = null;
    this.clips = [];
  }
}
