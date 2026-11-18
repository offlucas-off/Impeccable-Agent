import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  UAL_ANIMATION_CATALOG,
  UAL_SKELETON_SPEC,
  type UalPlayableClipMeta,
} from './UalRigSpec';

export interface IndexedUalClip {
  name: string;
  clip: THREE.AnimationClip;
  meta: UalPlayableClipMeta;
}

/**
 * Shared singleton repository holding Quaternius UAL 1 & 2 AnimationClips
 * without duplicating geometry, plus optional user-imported GLB animation banks.
 */
export class AnimationLibraryBank {
  private static instance: AnimationLibraryBank | null = null;
  private clipsByName = new Map<string, IndexedUalClip>();
  private orderedClips: IndexedUalClip[] = [];
  private loadPromise: Promise<IndexedUalClip[]> | null = null;
  private loaded = false;

  public static getInstance(): AnimationLibraryBank {
    if (!AnimationLibraryBank.instance) {
      AnimationLibraryBank.instance = new AnimationLibraryBank();
    }
    return AnimationLibraryBank.instance;
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  public async ensureLoaded(url = './animations/ual_master_library.glb'): Promise<IndexedUalClip[]> {
    if (this.loaded) return this.orderedClips;
    if (!this.loadPromise) {
      this.loadPromise = this.loadFromUrl(url).catch((err) => {
        this.loadPromise = null;
        throw err;
      });
    }
    return this.loadPromise;
  }

  public async loadFromUrl(url: string): Promise<IndexedUalClip[]> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao carregar UAL Master Library (${res.status}) em ${url}`);
    }
    const buf = await res.arrayBuffer();
    return this.loadFromArrayBuffer(buf);
  }

  public async loadFromArrayBuffer(buffer: ArrayBuffer): Promise<IndexedUalClip[]> {
    const loader = new GLTFLoader();
    const gltf = await loader.parseAsync(buffer, '');
    this.ingestClips(gltf.animations ?? []);
    this.loaded = true;
    return this.orderedClips;
  }

  public ingestClips(clips: THREE.AnimationClip[], sourceTag: 'UAL1' | 'UAL2' = 'UAL1'): number {
    const metaByName = new Map<string, UalPlayableClipMeta>();
    for (const m of UAL_ANIMATION_CATALOG.playableClips) {
      metaByName.set(m.name, m);
    }

    let added = 0;
    for (const rawClip of clips) {
      const name = rawClip.name.trim();
      if (!name) continue;
      const cleanClip = sanitizeUalClipTracks(rawClip);
      const meta: UalPlayableClipMeta = metaByName.get(name) ?? {
        name,
        library: sourceTag,
        category: inferCategoryFallback(name),
        durationSec: Number(cleanClip.duration.toFixed(4)),
        loop: name.endsWith('_Loop') || name.includes('Idle'),
        playable: true,
        rootMotionAvailable: false,
        tags: [],
        tracks: cleanClip.tracks.length,
      };
      const entry: IndexedUalClip = { name, clip: cleanClip, meta };
      if (!this.clipsByName.has(name)) {
        this.orderedClips.push(entry);
        added++;
      } else {
        const idx = this.orderedClips.findIndex((c) => c.name === name);
        if (idx >= 0) this.orderedClips[idx] = entry;
      }
      this.clipsByName.set(name, entry);
    }
    return added;
  }

  public getAll(): IndexedUalClip[] {
    return this.orderedClips;
  }

  public getClip(name: string): THREE.AnimationClip | null {
    return this.clipsByName.get(name)?.clip ?? null;
  }

  public getClipsByNames(names: string[]): THREE.AnimationClip[] {
    const out: THREE.AnimationClip[] = [];
    for (const n of names) {
      const found = this.clipsByName.get(n);
      if (found) out.push(found.clip);
    }
    return out;
  }

  public getPresetClips(presetId: string): THREE.AnimationClip[] {
    if (presetId === 'all') {
      return this.orderedClips.map((c) => c.clip);
    }
    const list = UAL_ANIMATION_CATALOG.presets[presetId];
    if (!list) return this.orderedClips.map((c) => c.clip);
    return this.getClipsByNames(list);
  }

  public filter(options: {
    query?: string;
    category?: string;
    library?: 'ALL' | 'UAL1' | 'UAL2';
  }): IndexedUalClip[] {
    const q = (options.query ?? '').trim().toLowerCase();
    const cat = options.category && options.category !== 'All' ? options.category : null;
    const lib = options.library && options.library !== 'ALL' ? options.library : null;

    return this.orderedClips.filter((item) => {
      if (lib && item.meta.library !== lib) return false;
      if (cat && item.meta.category !== cat) return false;
      if (q) {
        const inName = item.name.toLowerCase().includes(q);
        const inCat = item.meta.category.toLowerCase().includes(q);
        const inTags = item.meta.tags.some((t) => t.toLowerCase().includes(q));
        if (!inName && !inCat && !inTags) return false;
      }
      return true;
    });
  }
}

/**
 * Strips any Armature/object prefix so tracks target bare canonical UAL bone names (`pelvis.quaternion`).
 */
export function sanitizeUalClipTracks(clip: THREE.AnimationClip): THREE.AnimationClip {
  const cloned = clip.clone();
  for (const track of cloned.tracks) {
    const dotIdx = track.name.lastIndexOf('.');
    if (dotIdx > 0) {
      const nodePart = track.name.slice(0, dotIdx);
      const propPart = track.name.slice(dotIdx);
      const slashIdx = Math.max(nodePart.lastIndexOf('/'), nodePart.lastIndexOf(':'));
      if (slashIdx >= 0) {
        track.name = nodePart.slice(slashIdx + 1) + propPart;
      }
    }
  }
  return cloned;
}

/**
 * Removes root XZ horizontal translation from root/pelvis tracks for in-place preview or sprite capture.
 */
export function makeClipInPlace(clip: THREE.AnimationClip): THREE.AnimationClip {
  const cloned = clip.clone();
  for (const track of cloned.tracks) {
    if (track.name === 'root.position') {
      const vals = track.values;
      if (vals.length >= 3) {
        const x0 = vals[0];
        const z0 = vals[2];
        for (let i = 0; i < vals.length; i += 3) {
          vals[i] = x0;
          vals[i + 2] = z0;
        }
      }
    }
  }
  return cloned;
}

export interface ConditionClipForEquipmentOptions {
  /** Override locomotion detection; if omitted, inferred from clip name. */
  isLocomotion?: boolean;
  /** Outward abduction on upperarm_r in degrees (default 11°, range 8°–15°). */
  elbowFlareDeg?: number;
  /** Minimum clearance from structural capsules in meters (default 0.03m). */
  clearanceMeters?: number;
  /** Effective weapon reach from hand_r in meters (default 0.85m). */
  weaponLengthMeters?: number;
}

const CLEARANCE_CAPSULE_BONES = new Set(['spine_02', 'spine_03', 'Head', 'thigh_l', 'thigh_r']);

/**
 * Conditions an animation clip for equipped weapons:
 * 1. Applies soft outward abduction on `upperarm_r` (+8°–15°) for locomotion clips.
 * 2. Clamps `hand_r` quaternion against `UAL_SKELETON_SPEC.structuralCapsules`
 *    (`spine_02`, `spine_03`, `Head`, `thigh_l`, `thigh_r`) to maintain >= 0.03m clearance.
 */
export function conditionClipForEquipment(
  clip: THREE.AnimationClip,
  opts: ConditionClipForEquipmentOptions = {}
): THREE.AnimationClip {
  const cloned = clip.clone();
  const isLocomotion =
    opts.isLocomotion ?? /walk|run|sprint|jog|strafe|locomotion|idle/i.test(clip.name);
  const flareDeg = THREE.MathUtils.clamp(opts.elbowFlareDeg ?? 11, 8, 15);
  const clearance = opts.clearanceMeters ?? 0.03;
  const weaponLen = opts.weaponLengthMeters ?? 0.85;

  const bonePosMap = new Map<string, THREE.Vector3>();
  for (const b of UAL_SKELETON_SPEC.bones) {
    bonePosMap.set(
      b.name,
      new THREE.Vector3(b.male.worldPos[0], b.male.worldPos[1], b.male.worldPos[2])
    );
  }
  const handPos = bonePosMap.get('hand_r') ?? new THREE.Vector3(-0.35, 0.95, 0.05);
  const capsules = UAL_SKELETON_SPEC.structuralCapsules
    .filter((c) => CLEARANCE_CAPSULE_BONES.has(c.bone))
    .map((c) => ({
      center: bonePosMap.get(c.bone) ?? new THREE.Vector3(),
      minDist: c.radius + clearance,
    }));

  const flareQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    THREE.MathUtils.degToRad(flareDeg)
  );
  const outwardDir = new THREE.Vector3(-1, 0, 0.35).normalize();
  const q = new THREE.Quaternion();
  const tipDir = new THREE.Vector3();
  const tipPos = new THREE.Vector3();
  const awayQuat = new THREE.Quaternion();

  for (const track of cloned.tracks) {
    if (isLocomotion && track.name === 'upperarm_r.quaternion') {
      const vals = track.values;
      for (let i = 0; i + 3 < vals.length; i += 4) {
        q.set(vals[i], vals[i + 1], vals[i + 2], vals[i + 3]).multiply(flareQuat).normalize();
        vals[i] = q.x;
        vals[i + 1] = q.y;
        vals[i + 2] = q.z;
        vals[i + 3] = q.w;
      }
    } else if (track.name === 'hand_r.quaternion' && capsules.length > 0) {
      const vals = track.values;
      for (let i = 0; i + 3 < vals.length; i += 4) {
        q.set(vals[i], vals[i + 1], vals[i + 2], vals[i + 3]);
        tipDir.set(0, 0, 1).applyQuaternion(q);
        tipPos.copy(handPos).addScaledVector(tipDir, weaponLen);
        const needsClamp = capsules.some((cap) => tipPos.distanceTo(cap.center) < cap.minDist);
        if (needsClamp) {
          awayQuat.setFromUnitVectors(tipDir, outwardDir);
          q.premultiply(awayQuat.slerp(new THREE.Quaternion(), 0.55)).normalize();
          vals[i] = q.x;
          vals[i + 1] = q.y;
          vals[i + 2] = q.z;
          vals[i + 3] = q.w;
        }
      }
    }
  }

  return cloned;
}

function inferCategoryFallback(name: string): string {
  const nl = name.toLowerCase();
  if (nl.includes('zombie')) return 'Zombie';
  if (nl.includes('slide') || nl.includes('climb') || nl.includes('ninja') || nl.includes('roll')) {
    return 'Parkour & Traversal';
  }
  if (nl.includes('sword') || nl.includes('pistol') || nl.includes('punch') || nl.includes('melee') || nl.includes('shield') || nl.includes('hit') || nl.includes('death') || nl.includes('spell')) {
    return 'Combat & Combos';
  }
  if (nl.includes('farm') || nl.includes('tree') || nl.includes('fixing') || nl.includes('chest') || nl.includes('pickup') || nl.includes('interact')) {
    return 'Work & Interaction';
  }
  if (nl.includes('walk') || nl.includes('jog') || nl.includes('sprint') || nl.includes('jump') || nl.includes('swim') || nl.includes('crawl') || nl.includes('crouch') || nl.includes('push')) {
    return 'Locomotion';
  }
  return 'Emotes & Stances';
}
