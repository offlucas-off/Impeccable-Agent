import type * as THREE from 'three';

export type VfxStageName = 'telegraph' | 'cast' | 'flight' | 'impact' | 'linger';

export interface VfxParticleBurstSpec {
  count: number;
  colorHex: string;
  /** Optional intermediate color reached around age=0.45 before transitioning to endColor. */
  midColor?: THREE.ColorRepresentation;
  /** Optional target color at age=1.0 for color-over-life interpolation. */
  endColor?: THREE.ColorRepresentation;
  /** Optional initial scale multiplier at age=0 (defaults to 1.0). */
  startScale?: number;
  /** Optional final scale multiplier at age=1 (defaults to 0.0). */
  endScale?: number;
  speedMin: number;
  speedMax: number;
  lifeSec: number;
  sizeMin: number;
  sizeMax: number;
  gravity?: number;
  spreadAngleRad?: number;
  upwardBias?: number;
}

export interface VfxStageEvent {
  /** Normalized time within this stage (0..1) when the event fires */
  atProgress: number;
  particles?: VfxParticleBurstSpec;
  shake?: number;
  hitStopSec?: number;
  audioCue?: string;
}

export interface VfxStageDef {
  name: VfxStageName;
  durationSec: number;
  lightColor?: string;
  lightIntensity?: number;
  lightDistance?: number;
  events?: VfxStageEvent[];
}

export interface VfxRecipe {
  id: string;
  stages: VfxStageDef[];
  totalDurationSec: number;
}

export interface VfxTimelineCallbacks {
  onSpawnParticles?: (spec: VfxParticleBurstSpec, stage: VfxStageName) => void;
  onShake?: (amount: number, stage: VfxStageName) => void;
  onHitStop?: (durationSec: number, stage: VfxStageName) => void;
  onAudio?: (cue: string, stage: VfxStageName) => void;
  onStageEnter?: (stage: VfxStageName) => void;
  onStageExit?: (stage: VfxStageName) => void;
  onComplete?: () => void;
}
