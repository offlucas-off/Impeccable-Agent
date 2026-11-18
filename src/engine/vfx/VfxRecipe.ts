export type VfxStageName = 'telegraph' | 'cast' | 'flight' | 'impact' | 'linger';

export interface VfxParticleBurstSpec {
  count: number;
  colorHex: string;
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
