import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  UAL_ANIMATION_CATALOG,
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
