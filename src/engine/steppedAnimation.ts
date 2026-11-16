import * as THREE from 'three';
import type { SteppedAnimationConfig } from './types';

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
    animations: THREE.AnimationClip[]
  ): void {
    this.dispose();
    this.continuousTime = 0;
    this.quantizedTime = 0;
    this.clips = animations;
    if (animations.length > 0) {
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

  public playClip(index: number): void {
    if (!this.mixer || index < 0 || index >= this.clips.length) return;
    if (this.activeAction) {
      this.activeAction.stop();
    }
    this.activeClipIndex = index;
    this.activeAction = this.mixer.clipAction(this.clips[index]);
    this.activeAction.reset();
    this.activeAction.play();
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
