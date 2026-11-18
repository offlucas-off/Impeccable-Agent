import type { VfxRecipe, VfxStageDef, VfxStageName, VfxTimelineCallbacks } from './VfxRecipe';

export class VfxTimelinePlayer {
  private recipe: VfxRecipe;
  private callbacks: VfxTimelineCallbacks;
  private elapsedSec = 0;
  private stageIndex = -1;
  private stageElapsedSec = 0;
  private firedEventMask = 0;
  private completed = false;

  constructor(recipe: VfxRecipe, callbacks: VfxTimelineCallbacks = {}) {
    this.recipe = recipe;
    this.callbacks = callbacks;
    if (this.recipe.stages.length > 0) {
      this.enterStage(0);
    } else {
      this.completed = true;
    }
  }

  public isComplete(): boolean {
    return this.completed;
  }

  public getCurrentStage(): VfxStageDef | null {
    if (this.stageIndex < 0 || this.stageIndex >= this.recipe.stages.length) return null;
    return this.recipe.stages[this.stageIndex];
  }

  public getNormalizedProgress(): number {
    if (this.recipe.totalDurationSec <= 0) return 1;
    return Math.min(1, Math.max(0, this.elapsedSec / this.recipe.totalDurationSec));
  }

  public update(dt: number): void {
    if (this.completed || dt <= 0) return;

    this.elapsedSec += dt;
    let remainingDt = dt;

    while (!this.completed && remainingDt > 0) {
      const stage = this.recipe.stages[this.stageIndex];
      if (!stage) {
        this.finish();
        break;
      }

      const stageDur = Math.max(1e-4, stage.durationSec);
      const prevElapsed = this.stageElapsedSec;
      const nextElapsed = prevElapsed + remainingDt;

      if (nextElapsed >= stageDur) {
        this.stageElapsedSec = stageDur;
        this.fireStageEvents(stage, 1.0);
        this.callbacks.onStageExit?.(stage.name);
        remainingDt = nextElapsed - stageDur;

        if (this.stageIndex + 1 < this.recipe.stages.length) {
          this.enterStage(this.stageIndex + 1);
        } else {
          this.finish();
          break;
        }
      } else {
        this.stageElapsedSec = nextElapsed;
        this.fireStageEvents(stage, this.stageElapsedSec / stageDur);
        remainingDt = 0;
      }
    }
  }

  private enterStage(index: number): void {
    this.stageIndex = index;
    this.stageElapsedSec = 0;
    this.firedEventMask = 0;
    const stage = this.recipe.stages[index];
    if (stage) {
      this.callbacks.onStageEnter?.(stage.name);
      this.fireStageEvents(stage, 0);
    }
  }

  private fireStageEvents(stage: VfxStageDef, progress01: number): void {
    const events = stage.events;
    if (!events || events.length === 0) return;
    for (let i = 0; i < events.length && i < 31; i++) {
      const bit = 1 << i;
      if ((this.firedEventMask & bit) !== 0) continue;
      const ev = events[i];
      if (progress01 >= ev.atProgress) {
        this.firedEventMask |= bit;
        if (ev.particles) this.callbacks.onSpawnParticles?.(ev.particles, stage.name);
        if (ev.shake !== undefined && ev.shake > 0) this.callbacks.onShake?.(ev.shake, stage.name);
        if (ev.hitStopSec !== undefined && ev.hitStopSec > 0) {
          this.callbacks.onHitStop?.(ev.hitStopSec, stage.name);
        }
        if (ev.audioCue) this.callbacks.onAudio?.(ev.audioCue, stage.name);
      }
    }
  }

  private finish(): void {
    if (this.completed) return;
    this.completed = true;
    this.callbacks.onComplete?.();
  }

  public reset(newRecipe?: VfxRecipe): void {
    if (newRecipe) this.recipe = newRecipe;
    this.elapsedSec = 0;
    this.stageIndex = -1;
    this.stageElapsedSec = 0;
    this.firedEventMask = 0;
    this.completed = false;
    if (this.recipe.stages.length > 0) {
      this.enterStage(0);
    } else {
      this.completed = true;
    }
  }
}

export function createSimpleRecipe(
  id: string,
  stages: Array<{ name: VfxStageName; durationSec: number; events?: VfxStageDef['events']; lightColor?: string; lightIntensity?: number; lightDistance?: number }>
): VfxRecipe {
  let totalDurationSec = 0;
  for (let i = 0; i < stages.length; i++) {
    totalDurationSec += stages[i].durationSec;
  }
  return {
    id,
    stages,
    totalDurationSec,
  };
}
