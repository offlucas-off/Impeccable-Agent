import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { PixelizerMaterial, PixelizerMaterialResources } from '../../engine/PixelizerMaterial';
import {
  buildProceduralUalCharacter,
  type CharacterArchetype,
  type GeneratedCharacterResult,
} from '../../engine/procedural/CharacterBuilder';
import {
  buildProceduralProp,
  type GeneratedPropResult,
  type PropKind,
} from '../../engine/procedural/PropBuilder';
import {
  buildProceduralStructure,
  type GeneratedStructureResult,
  type StructureBiome,
} from '../../engine/procedural/TilesetStructureSolver';
import type { UalGenderProfile, UalRigBuildMode } from '../../engine/rigging/UalRigSpec';

export interface GeneratorHostContext {
  getSharedMaterialResources: () => PixelizerMaterialResources;
  mountGeneratedCharacter: (res: GeneratedCharacterResult) => void;
  mountGeneratedProp: (res: GeneratedPropResult) => void;
  mountGeneratedStructure: (res: GeneratedStructureResult) => void;
  getCurrentStructureRoot: () => THREE.Object3D | null;
  downloadBlob: (blob: Blob, filename: string) => void;
}

export function mountGeneratorPanel(
  container: HTMLElement,
  ctx: GeneratorHostContext
): void {
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>1. Character (65-Bone UAL Skeleton)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-char-arch">Archetype</label>
          <select id="gen-char-arch" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="knight">Knight (Sword + Shield)</option>
            <option value="ranger">Ranger (Axe + Torch)</option>
            <option value="mage">Mage (Staff + Hat)</option>
            <option value="zombie">Zombie (Horde + Axe)</option>
            <option value="villager">Villager (NPC Civilian)</option>
            <option value="golem">Stone Golem (Heavy)</option>
          </select>
        </div>

        <div class="field-row">
          <label class="field-label" for="gen-char-gender">UAL Proportion</label>
          <select id="gen-char-gender" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="male">Male (1.829 m)</option>
            <option value="female">Female (1.808 m)</option>
          </select>
        </div>

        <div class="field-row">
          <label class="field-label" for="gen-char-rig">Rig Topology</label>
          <select id="gen-char-rig" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="skinned_mesh">SkinnedMesh (Capsule Weights)</option>
            <option value="rigid_segments">NWL Rigid Bone Segments (0 Skin)</option>
          </select>
        </div>

        <div class="field-row">
          <span class="field-label">Style &amp; Seed</span>
          <div class="field-control">
            <select id="gen-char-style" class="select-ctrl select-ctrl-sm" style="width:94px;">
              <option value="lowpoly">Low-Poly</option>
              <option value="voxel">Voxel Rigged</option>
            </select>
            <input id="gen-char-seed" class="input-ctrl" type="number" value="42" style="width:68px;height:26px;" />
          </div>
        </div>

        <button id="gen-btn-character" class="btn btn-primary" type="button">
          Generate UAL Character (85 Anims)
        </button>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>2. Prop / Weapon (CC0 Calibrated)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-prop-kind">Prop Kind</label>
          <select id="gen-prop-kind" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="sword">Weapon: Sword (Socket +Z)</option>
            <option value="axe">Weapon: Battle Axe</option>
            <option value="shield">Offhand: Heater Shield</option>
            <option value="staff">Weapon: Arcane Staff</option>
            <option value="torch">Prop: Lit Torch</option>
            <option value="chest">Dungeon: Treasure Chest</option>
            <option value="barrel">Dungeon: Oak Barrel</option>
            <option value="table">Interior: Wooden Table</option>
            <option value="pillar">Architecture: Stone Pillar</option>
            <option value="crate">City/Port: Cargo Crate</option>
            <option value="tree">Biome: Pine Tree</option>
          </select>
        </div>
        <div class="field-row">
          <span class="field-label">Style &amp; Seed</span>
          <div class="field-control">
            <select id="gen-prop-style" class="select-ctrl select-ctrl-sm" style="width:94px;">
              <option value="lowpoly">Low-Poly</option>
              <option value="voxel">Voxel 3D</option>
            </select>
            <input id="gen-prop-seed" class="input-ctrl" type="number" value="1337" style="width:68px;height:26px;" />
          </div>
        </div>
        <button id="gen-btn-prop" class="btn" type="button">Spawn Autonomous Prop</button>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>3. Tileset &amp; Structure (WFC 3D)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-struct-biome">Biome Grammar</label>
          <select id="gen-struct-biome" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="dungeon">Dungeon Stone (KayKit Distilled)</option>
            <option value="medieval">Medieval Keep &amp; Keepers</option>
            <option value="city">Urban City Block</option>
            <option value="scifi">Sci-Fi Outpost Module</option>
          </select>
        </div>
        <div class="field-row">
          <span class="field-label">Grid / Floors</span>
          <div class="field-control">
            <select id="gen-struct-size" class="select-ctrl select-ctrl-sm" style="width:82px;">
              <option value="3">3 × 3</option>
              <option value="4" selected>4 × 4</option>
              <option value="5">5 × 5</option>
            </select>
            <select id="gen-struct-floors" class="select-ctrl select-ctrl-sm" style="width:82px;">
              <option value="1">1 Floor</option>
              <option value="2">2 Floors</option>
              <option value="3">3 Floors</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <span class="field-label">Style &amp; Seed</span>
          <div class="field-control">
            <select id="gen-struct-style" class="select-ctrl select-ctrl-sm" style="width:94px;">
              <option value="lowpoly">Low-Poly</option>
              <option value="voxel">Voxel 3D</option>
            </select>
            <input id="gen-struct-seed" class="input-ctrl" type="number" value="77" style="width:68px;height:26px;" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:6px;">
          <button id="gen-btn-structure" class="btn btn-primary" type="button">Generate WFC Structure</button>
          <button id="gen-btn-struct-glb" class="btn" type="button" title="Export generated structure to .GLB">.GLB</button>
        </div>
        <div id="gen-status" class="voxel-stats-box">
          <span>Knowledge Base: 482 CC0 KayKit assets distilled</span>
        </div>
      </div>
    </div>
  `;

  const statusEl = container.querySelector<HTMLElement>('#gen-status')!;

  container.querySelector('#gen-btn-character')!.addEventListener('click', () => {
    const archetype = container.querySelector<HTMLSelectElement>('#gen-char-arch')!
      .value as CharacterArchetype;
    const genderProfile = container.querySelector<HTMLSelectElement>('#gen-char-gender')!
      .value as UalGenderProfile;
    const rigMode = container.querySelector<HTMLSelectElement>('#gen-char-rig')!
      .value as UalRigBuildMode;
    const visualStyle = container.querySelector<HTMLSelectElement>('#gen-char-style')!
      .value as 'lowpoly' | 'voxel';
    const seed = Number(container.querySelector<HTMLInputElement>('#gen-char-seed')!.value) || 42;

    const result = buildProceduralUalCharacter(
      { archetype, genderProfile, rigMode, visualStyle, seed, voxelResolution: 24 },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedCharacter(result);
    statusEl.textContent = `Built ${archetype} (${genderProfile}, ${rigMode}, ${visualStyle}) on 65-bone UAL rig`;
  });

  container.querySelector('#gen-btn-prop')!.addEventListener('click', () => {
    const kind = container.querySelector<HTMLSelectElement>('#gen-prop-kind')!.value as PropKind;
    const visualStyle = container.querySelector<HTMLSelectElement>('#gen-prop-style')!
      .value as 'lowpoly' | 'voxel';
    const seed = Number(container.querySelector<HTMLInputElement>('#gen-prop-seed')!.value) || 1337;

    const result = buildProceduralProp(
      { kind, visualStyle, seed, voxelResolution: 22 },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedProp(result);
    statusEl.textContent = `Built ${kind} (${visualStyle}, ${result.dimensions.map((d) => d.toFixed(2)).join('×')}m)`;
  });

  container.querySelector('#gen-btn-structure')!.addEventListener('click', () => {
    const biome = container.querySelector<HTMLSelectElement>('#gen-struct-biome')!
      .value as StructureBiome;
    const gridN = Number(container.querySelector<HTMLSelectElement>('#gen-struct-size')!.value) || 4;
    const floors = Number(container.querySelector<HTMLSelectElement>('#gen-struct-floors')!.value) || 1;
    const visualStyle = container.querySelector<HTMLSelectElement>('#gen-struct-style')!
      .value as 'lowpoly' | 'voxel';
    const seed = Number(container.querySelector<HTMLInputElement>('#gen-struct-seed')!.value) || 77;

    const result = buildProceduralStructure(
      { biome, cols: gridN, rows: gridN, floors, visualStyle, seed },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedStructure(result);
    statusEl.textContent = `WFC ${biome} (${gridN}×${gridN}, ${floors}F): ${result.cells.length} connected cells`;
  });

  container.querySelector('#gen-btn-struct-glb')!.addEventListener('click', () => {
    void (async () => {
      const structRoot = ctx.getCurrentStructureRoot();
      if (!structRoot) {
        statusEl.textContent = 'Generate a WFC Structure first before exporting .GLB.';
        return;
      }
      const clone = structRoot.clone(true);
      const dispMats: THREE.Material[] = [];
      clone.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          const pm = o.material as PixelizerMaterial;
          const m = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            vertexColors: Boolean(o.geometry?.getAttribute('color')),
            metalness: 0.08,
            roughness: 0.78,
          });
          if (pm?.options?.baseColor) m.color.set(pm.options.baseColor);
          dispMats.push(m);
          o.material = m;
        }
      });
      const exporter = new GLTFExporter();
      const buf = await exporter.parseAsync(clone, { binary: true });
      for (const m of dispMats) m.dispose();
      if (buf instanceof ArrayBuffer) {
        ctx.downloadBlob(new Blob([buf], { type: 'model/gltf-binary' }), `${structRoot.name || 'wfc_structure'}.glb`);
        statusEl.textContent = `Exported ${structRoot.name || 'wfc_structure'}.glb`;
      }
    })();
  });
}
