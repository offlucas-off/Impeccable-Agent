import * as THREE from 'three';
import {
  AnimationLibraryBank,
  makeClipInPlace,
  type IndexedUalClip,
} from '../../engine/rigging/AnimationLibraryBank';
import {
  exportRiggedAssetToGlb,
  type RiggedExportValidation,
} from '../../engine/rigging/RiggedExporter';
import { retargetUalClipsToModel } from '../../engine/rigging/UalRetargeter';
import {
  UAL_ANIMATION_CATALOG,
  detectUalSkeletonCompatibility,
  findUalRigInHierarchy,
  mountPropToUalSocket,
} from '../../engine/rigging/UalRigSpec';
import { buildProceduralProp, type PropKind } from '../../engine/procedural/PropBuilder';
import type { PixelizerMaterialResources } from '../../engine/PixelizerMaterial';
import type { SteppedAnimationController } from '../../engine/steppedAnimation';

export interface AnimViewerHostContext {
  getSubjectRoot: () => THREE.Object3D | null;
  getNativeClips: () => THREE.AnimationClip[];
  setModelClips: (clips: THREE.AnimationClip[], activeName?: string) => void;
  setActiveClipByIndex: (index: number, crossFadeSec?: number) => void;
  getActiveClipName: () => string;
  getSkeletonOverlayEnabled: () => boolean;
  setSkeletonOverlayEnabled: (enabled: boolean) => void;
  onVoxelizeRiggedRequested: () => void;
  getSharedMaterialResources: () => PixelizerMaterialResources;
  onPropAttachedToSubject: (propRoot: THREE.Object3D) => void;
  getExportSlug: () => string;
  downloadBlob: (blob: Blob, filename: string) => void;
  animCtrl: SteppedAnimationController;
}

export interface AnimViewerPanelHandle {
  refreshFromActiveStage: () => void;
}

export function mountAnimViewerPanel(
  container: HTMLElement,
  ctx: AnimViewerHostContext
): AnimViewerPanelHandle {
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head">
        <span>Quaternius UAL AnimViewer</span>
        <span id="av-rig-badge" class="rig-badge">Loading UAL...</span>
      </div>
      <div class="ctrl-section-body">
        <div class="segmented" id="av-lib-seg" style="width:100%;">
          <button type="button" class="seg-btn is-active" data-lib="ALL">All (85+)</button>
          <button type="button" class="seg-btn" data-lib="UAL1">UAL 1</button>
          <button type="button" class="seg-btn" data-lib="UAL2">UAL 2</button>
          <button type="button" class="seg-btn" data-lib="MODEL">Model</button>
        </div>

        <div class="field-row">
          <label class="field-label" for="av-sel-cat">Category</label>
          <select id="av-sel-cat" class="select-ctrl select-ctrl-sm" style="width:185px;">
            <option value="All">All Categories (260 taxonomy)</option>
          </select>
        </div>

        <input id="av-search" class="input-ctrl" type="search" placeholder="Search clip or AnimViewer tag (sword, zombie, climb)..." />

        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11.5px;color:var(--text-secondary);">
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
            <input id="av-chk-skel" type="checkbox" /> SkeletonHelper
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
            <input id="av-chk-crossfade" type="checkbox" checked /> Crossfade
          </label>
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
            <input id="av-chk-inplace" type="checkbox" /> In-Place
          </label>
        </div>

        <div id="av-clip-list" class="anim-clip-list"></div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>UAL Rig Binding, Sockets &amp; Voxel Rig</span></div>
      <div class="ctrl-section-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button id="av-btn-retarget" class="btn btn-sm" type="button" title="Bind all 85 Quaternius UAL clips onto the active model">
            Retarget UAL → Model
          </button>
          <button id="av-btn-voxelize-rig" class="btn btn-sm" type="button" title="Convert active mesh into voxel SkinnedMesh preserving 65-bone UAL rig">
            Voxelize Preserving Rig
          </button>
        </div>

        <div class="field-row">
          <span class="field-label">Hand R / L Sockets</span>
          <div class="field-control">
            <select id="av-sock-r" class="select-ctrl select-ctrl-sm" style="width:84px;">
              <option value="sword">Sword</option>
              <option value="axe">Axe</option>
              <option value="staff">Staff</option>
              <option value="torch">Torch</option>
              <option value="none">Empty</option>
            </select>
            <select id="av-sock-l" class="select-ctrl select-ctrl-sm" style="width:84px;">
              <option value="shield">Shield</option>
              <option value="torch">Torch</option>
              <option value="none">Empty</option>
            </select>
            <button id="av-btn-equip" class="btn btn-sm" type="button">Equip</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Export Rigged .GLB (Skeleton + Clips)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="av-export-preset">Clip Bundle</label>
          <select id="av-export-preset" class="select-ctrl select-ctrl-sm" style="width:185px;">
            <option value="rpg_core">RPG Core (14 clips)</option>
            <option value="parkour">Parkour &amp; Traversal (14 clips)</option>
            <option value="npc_work">NPC &amp; Work (13 clips)</option>
            <option value="zombie">Zombie Horde (7 clips)</option>
            <option value="current">Current Active Clip Only</option>
            <option value="all">All Loaded Clips (85+)</option>
          </select>
        </div>
        <button id="av-btn-export-glb" class="btn btn-primary" type="button">
          Export Rigged .GLB
        </button>
        <div id="av-export-status" class="voxel-stats-box">
          <span>Ready — exports canonical Bones + SkinWeights + Clips</span>
        </div>
      </div>
    </div>
  `;

  const rigBadge = container.querySelector<HTMLElement>('#av-rig-badge')!;
  const libBtns = container.querySelectorAll<HTMLButtonElement>('#av-lib-seg .seg-btn');
  const selCat = container.querySelector<HTMLSelectElement>('#av-sel-cat')!;
  const inpSearch = container.querySelector<HTMLInputElement>('#av-search')!;
  const chkSkel = container.querySelector<HTMLInputElement>('#av-chk-skel')!;
  const chkCrossfade = container.querySelector<HTMLInputElement>('#av-chk-crossfade')!;
  const chkInPlace = container.querySelector<HTMLInputElement>('#av-chk-inplace')!;
  const clipListEl = container.querySelector<HTMLElement>('#av-clip-list')!;
  const exportStatusEl = container.querySelector<HTMLElement>('#av-export-status')!;

  for (const cat of UAL_ANIMATION_CATALOG.categories) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selCat.appendChild(opt);
  }

  let activeLibFilter: 'ALL' | 'UAL1' | 'UAL2' | 'MODEL' = 'ALL';
  const bank = AnimationLibraryBank.getInstance();

  function buildPreparedClipList(rawList: THREE.AnimationClip[]): THREE.AnimationClip[] {
    return chkInPlace.checked ? rawList.map((c) => makeClipInPlace(c)) : rawList;
  }

  function refreshRigBadge(): void {
    const subj = ctx.getSubjectRoot();
    if (!subj) {
      rigBadge.textContent = 'No Rig';
      return;
    }
    const compat = detectUalSkeletonCompatibility(subj);
    let boneCount = 0;
    let skinnedCount = 0;
    subj.traverse((o) => {
      if (o instanceof THREE.Bone) boneCount++;
      if (o instanceof THREE.SkinnedMesh) skinnedCount++;
    });
    if (compat.compatible) {
      rigBadge.textContent = `UAL 65B · ${skinnedCount > 0 ? 'Skinned' : 'Rigid'}`;
    } else if (boneCount > 0) {
      rigBadge.textContent = `Ext ${boneCount}B (${compat.matchedStructuralBones}/17 UAL)`;
    } else {
      rigBadge.textContent = 'Static Mesh';
    }
  }

  function renderClipList(): void {
    const q = inpSearch.value.trim().toLowerCase();
    const cat = selCat.value;
    const activeName = ctx.getActiveClipName();

    let rows: { name: string; lib: string; category: string; dur: number; tags: string[]; rm: boolean; clip: THREE.AnimationClip }[] = [];

    if (activeLibFilter === 'MODEL') {
      const native = ctx.getNativeClips();
      for (const c of native) {
        if (q && !c.name.toLowerCase().includes(q)) continue;
        rows.push({
          name: c.name,
          lib: 'MOD',
          category: 'Model',
          dur: c.duration,
          tags: [],
          rm: false,
          clip: c,
        });
      }
    } else {
      const filtered: IndexedUalClip[] = bank.filter({
        query: q,
        category: cat,
        library: activeLibFilter,
      });
      rows = filtered.map((item) => ({
        name: item.name,
        lib: item.meta.library,
        category: item.meta.category,
        dur: item.meta.durationSec,
        tags: item.meta.tags,
        rm: item.meta.rootMotionAvailable,
        clip: item.clip,
      }));
    }

    if (rows.length === 0) {
      clipListEl.innerHTML = `<div style="padding:10px;color:var(--text-muted);font-size:11px;text-align:center;">No clips match filter.</div>`;
      return;
    }

    clipListEl.innerHTML = rows
      .map((r, idx) => {
        const isAct = r.name === activeName;
        const tagsPreview = r.tags.slice(0, 2).join(', ');
        return `
          <button type="button" class="anim-clip-row ${isAct ? 'is-selected' : ''}" data-clip-idx="${idx}" data-clip-name="${r.name}">
            <div style="display:flex;align-items:center;gap:6px;min-width:0;">
              <span class="clip-lib-tag">${r.lib}</span>
              <span class="clip-name-text">${r.name}</span>
            </div>
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
              ${tagsPreview ? `<span class="clip-tag-hint">${tagsPreview}</span>` : ''}
              <span class="clip-dur-text">${r.dur.toFixed(1)}s</span>
            </div>
          </button>
        `;
      })
      .join('');

    clipListEl.querySelectorAll<HTMLButtonElement>('.anim-clip-row').forEach((btn) => {
      btn.addEventListener('click', () => {
        const clipName = btn.dataset.clipName!;
        const subj = ctx.getSubjectRoot();
        if (!subj) return;
        const crossFade = chkCrossfade.checked ? 0.2 : 0;

        if (activeLibFilter === 'MODEL') {
          const currentClips = ctx.animCtrl.getClips();
          const foundIdx = currentClips.findIndex((c) => c.name === clipName);
          if (foundIdx >= 0) {
            ctx.setActiveClipByIndex(foundIdx, crossFade);
          }
        } else {
          // Ensure UAL clips are bound/retargeted onto current stage subject
          let currentClips = ctx.animCtrl.getClips();
          let foundIdx = currentClips.findIndex((c) => c.name === clipName);
          if (foundIdx < 0) {
            const ualRaw = bank.getAll().map((x) => x.clip);
            const ret = retargetUalClipsToModel(subj, buildPreparedClipList(ualRaw));
            if (ret.clips.length > 0) {
              ctx.setModelClips(ret.clips, clipName);
              currentClips = ctx.animCtrl.getClips();
              foundIdx = currentClips.findIndex((c) => c.name === clipName);
            }
          }
          if (foundIdx >= 0) {
            ctx.setActiveClipByIndex(foundIdx, crossFade);
          } else {
            exportStatusEl.textContent = 'Model lacks compatible bones for UAL clip — try generating a UAL Character.';
          }
        }
        renderClipList();
      });
    });
  }

  libBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeLibFilter = btn.dataset.lib as 'ALL' | 'UAL1' | 'UAL2' | 'MODEL';
      libBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      renderClipList();
    });
  });
  selCat.addEventListener('change', renderClipList);
  inpSearch.addEventListener('input', renderClipList);

  chkSkel.addEventListener('change', () => {
    ctx.setSkeletonOverlayEnabled(chkSkel.checked);
  });

  chkInPlace.addEventListener('change', () => {
    const subj = ctx.getSubjectRoot();
    if (!subj || !bank.isLoaded()) return;
    const compat = detectUalSkeletonCompatibility(subj);
    if (compat.compatible) {
      const prepared = buildPreparedClipList(bank.getAll().map((x) => x.clip));
      ctx.setModelClips(prepared, ctx.getActiveClipName());
    }
  });

  container.querySelector('#av-btn-retarget')!.addEventListener('click', () => {
    void (async () => {
      const subj = ctx.getSubjectRoot();
      if (!subj) return;
      await bank.ensureLoaded();
      const rawUal = buildPreparedClipList(bank.getAll().map((x) => x.clip));
      const res = retargetUalClipsToModel(subj, rawUal);
      if (res.clips.length > 0) {
        ctx.setModelClips(res.clips, 'Idle_Loop');
        exportStatusEl.textContent = `${res.mode}: mapped ${res.matchedBones} bones · ${res.clips.length} UAL clips ready!`;
        renderClipList();
      } else {
        exportStatusEl.textContent = `Retarget skipped (${res.matchedBones} matching humanoid bones found).`;
      }
    })();
  });

  container.querySelector('#av-btn-voxelize-rig')!.addEventListener('click', () => {
    ctx.onVoxelizeRiggedRequested();
  });

  container.querySelector('#av-btn-equip')!.addEventListener('click', () => {
    const subj = ctx.getSubjectRoot();
    if (!subj) return;
    const rig = findUalRigInHierarchy(subj);
    if (!rig) {
      exportStatusEl.textContent = 'Equip requires a UAL 65-bone character (generate one in Generate tab!).';
      return;
    }
    const kindR = container.querySelector<HTMLSelectElement>('#av-sock-r')!.value as PropKind | 'none';
    const kindL = container.querySelector<HTMLSelectElement>('#av-sock-l')!.value as PropKind | 'none';
    const sharedRes = ctx.getSharedMaterialResources();

    rig.sockets.hand_r.clear();
    if (kindR !== 'none') {
      const propR = buildProceduralProp({ kind: kindR, seed: Date.now() & 0xffff }, sharedRes);
      mountPropToUalSocket(rig, 'hand_r', propR.root);
      ctx.onPropAttachedToSubject(propR.root);
    }

    rig.sockets.hand_l.clear();
    if (kindL !== 'none') {
      const propL = buildProceduralProp({ kind: kindL, seed: (Date.now() + 7) & 0xffff }, sharedRes);
      mountPropToUalSocket(rig, 'hand_l', propL.root);
      ctx.onPropAttachedToSubject(propL.root);
    }
    exportStatusEl.textContent = `Equipped R=${kindR}, L=${kindL} onto canonical UAL sockets.`;
  });

  container.querySelector('#av-btn-export-glb')!.addEventListener('click', () => {
    void (async () => {
      const subj = ctx.getSubjectRoot();
      if (!subj) return;
      const preset = container.querySelector<HTMLSelectElement>('#av-export-preset')!.value;
      const modelClips = ctx.animCtrl.getClips();

      let selectedNames: string[] | undefined;
      if (preset === 'current') {
        const act = ctx.getActiveClipName();
        selectedNames = act ? [act] : undefined;
      } else if (preset !== 'all') {
        selectedNames = UAL_ANIMATION_CATALOG.presets[preset] ?? undefined;
      }

      exportStatusEl.textContent = 'Exporting rigged .GLB with skeleton + clips...';
      try {
        const { buffer, validation }: { buffer: ArrayBuffer; validation: RiggedExportValidation } =
          await exportRiggedAssetToGlb(subj, modelClips, {
            name: ctx.getExportSlug(),
            selectedClipNames: selectedNames,
            resetToRestPose: true,
          });
        const filename = `${ctx.getExportSlug()}_rigged_${preset}.glb`;
        ctx.downloadBlob(new Blob([buffer], { type: 'model/gltf-binary' }), filename);
        exportStatusEl.textContent =
          `Exported ${filename}: ${validation.boneCount}B · ${validation.skinnedMeshCount} Skinned · ${validation.clipCount} clips`;
      } catch (err) {
        exportStatusEl.textContent = `Export failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    })();
  });

  // Ensure UAL bank loads lazily cleanly
  void bank.ensureLoaded().then(() => {
    renderClipList();
    refreshRigBadge();
  }).catch(() => {
    rigBadge.textContent = 'UAL offline';
  });

  return {
    refreshFromActiveStage: () => {
      chkSkel.checked = ctx.getSkeletonOverlayEnabled();
      refreshRigBadge();
      renderClipList();
    },
  };
}
