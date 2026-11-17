import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { PixelizerMaterial, PixelizerMaterialResources } from '../../engine/PixelizerMaterial';
import {
  buildProceduralUalCharacter,
  type CharacterArchetype,
  type GeneratedCharacterResult,
} from '../../engine/procedural/CharacterBuilder';
import {
  NWL_MONSTER_SPECS,
  buildNwlMonster,
  type GeneratedMonsterResult,
  type NwlMonsterId,
} from '../../engine/procedural/MonsterBuilder';
import {
  NWL_NPC_PROFILES,
  buildNwlNpc,
  type GeneratedNpcResult,
  type NwlNpcId,
} from '../../engine/procedural/NpcBuilder';
import {
  buildGreenRuinsFloor1,
  buildNwlTilesetCatalog,
  type NwlTilesetBiome,
} from '../../engine/procedural/NwlTilesetDungeon';
import {
  buildNwlPlayerCharacter,
  type EquipSlot,
  type ItemRarity,
  type PlayerCharacterInstance,
  type PlayerClassId,
} from '../../engine/procedural/PlayerEquipmentBuilder';
import {
  buildProceduralProp,
  type GeneratedPropResult,
  type PropKind,
} from '../../engine/procedural/PropBuilder';
import {
  NWL_SPELL_VFX_CATALOG,
  buildNwlSpellVfx,
  type GeneratedSpellVfxResult,
  type NwlSpellVfxId,
} from '../../engine/procedural/SpellVfxBuilder';
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
  mountNwlPlayer: (res: PlayerCharacterInstance) => void;
  mountNwlNpc: (res: GeneratedNpcResult) => void;
  mountNwlMonster: (res: GeneratedMonsterResult) => void;
  mountNwlCustomScene: (opts: {
    name: string;
    description: string;
    root: THREE.Group;
    materials: PixelizerMaterial[];
    isLargeStructure?: boolean;
    onUpdate?: (t: number) => void;
  }) => void;
  mountNwlSpellVfx: (res: GeneratedSpellVfxResult) => void;
  getCurrentPlayerInstance: () => PlayerCharacterInstance | null;
  getCurrentStructureRoot: () => THREE.Object3D | null;
  downloadBlob: (blob: Blob, filename: string) => void;
}

export function mountGeneratorPanel(
  container: HTMLElement,
  ctx: GeneratorHostContext
): void {
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>NWL Herói Modular (1.79m · 6 Slots × 5 Raridades)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-nwl-class">Classe NWL</label>
          <select id="gen-nwl-class" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="knight">Cavaleiro (Espada + Escudo)</option>
            <option value="archer">Arqueiro (Arco + Aljava)</option>
            <option value="mage">Mago (Cajado + Foco)</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="gen-nwl-rarity">Raridade do Set</label>
          <select id="gen-nwl-rarity" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="normal">Normal (Sem cor / Neutro)</option>
            <option value="common">Comum (Verde)</option>
            <option value="rare">Raro (Azul)</option>
            <option value="epic">Épico (Roxo)</option>
            <option value="legendary">Lendário (Laranja)</option>
          </select>
        </div>
        <button id="gen-btn-nwl-hero" class="btn btn-primary" type="button">
          Spawnar Herói Modular (Base Shell)
        </button>

        <div style="border-top:1px solid var(--border-subtle);padding-top:6px;margin-top:4px;display:grid;grid-template-columns:1fr 1fr;gap:5px;">
          <select id="gen-slot-sel" class="select-ctrl select-ctrl-sm">
            <option value="helmet">Slot: Elmo / Capacete</option>
            <option value="chest">Slot: Peitoral</option>
            <option value="legs">Slot: Calça</option>
            <option value="boots">Slot: Bota</option>
            <option value="gloves">Slot: Luva</option>
            <option value="weapon">Slot: Arma</option>
          </select>
          <button id="gen-btn-swap-slot" class="btn btn-sm" type="button">Trocar Peça</button>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>NWL NPCs, Bestiário &amp; Boss Demônio</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-nwl-npc">NPC / Baú (1.70m)</label>
          <div class="field-control">
            <select id="gen-nwl-npc" class="select-ctrl select-ctrl-sm" style="width:130px;">
              ${Object.values(NWL_NPC_PROFILES)
                .map((n) => `<option value="${n.id}">${n.namePt}</option>`)
                .join('')}
            </select>
            <button id="gen-btn-npc" class="btn btn-sm" type="button">Gerar</button>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="gen-nwl-monster">Inimigo / Boss</label>
          <div class="field-control">
            <select id="gen-nwl-monster" class="select-ctrl select-ctrl-sm" style="width:130px;">
              ${Object.values(NWL_MONSTER_SPECS)
                .map((m) => `<option value="${m.id}">${m.namePt} (${m.targetHeightM}m)</option>`)
                .join('')}
            </select>
            <button id="gen-btn-monster" class="btn btn-sm" type="button">Gerar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>NWL Tilesets 1.5m, Dungeon 1 &amp; Magias 3D</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-nwl-tileset">Tileset Modular</label>
          <div class="field-control">
            <select id="gen-nwl-tileset" class="select-ctrl select-ctrl-sm" style="width:128px;">
              <option value="green_ruins">Ruínas Verdes</option>
              <option value="city">Cidade Portais</option>
              <option value="training_field">Campo Treino</option>
            </select>
            <button id="gen-btn-tileset" class="btn btn-sm" type="button">Kit</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:6px;">
          <button id="gen-btn-dungeon1" class="btn btn-primary btn-sm" type="button">Gerar Ruínas Verdes · Andar 1</button>
          <button id="gen-btn-struct-glb" class="btn btn-sm" type="button" title="Exportar estrutura/tileset para .GLB">.GLB</button>
        </div>
        <div class="field-row">
          <label class="field-label" for="gen-nwl-spell">Magia / VFX 3D</label>
          <div class="field-control">
            <select id="gen-nwl-spell" class="select-ctrl select-ctrl-sm" style="width:128px;">
              ${NWL_SPELL_VFX_CATALOG.map(
                (s) => `<option value="${s.id}">${s.labelPt}</option>`
              ).join('')}
            </select>
            <button id="gen-btn-spell" class="btn btn-sm" type="button">Ver VFX</button>
          </div>
        </div>
        <div id="gen-status" class="voxel-stats-box">
          <span>NWL Modular Engine · Escala 1m = 60px (1.79m = 108px) · Grade 1.5m</span>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Ferramentas Base (UAL &amp; WFC Avançado)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-char-arch">UAL Base Arch</label>
          <select id="gen-char-arch" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="knight">Knight</option>
            <option value="ranger">Ranger</option>
            <option value="mage">Mage</option>
            <option value="zombie">Zombie</option>
            <option value="villager">Villager</option>
            <option value="golem">Stone Golem</option>
          </select>
        </div>
        <div class="field-row">
          <span class="field-label">Style &amp; Rig</span>
          <div class="field-control">
            <select id="gen-char-rig" class="select-ctrl select-ctrl-sm" style="width:94px;">
              <option value="rigid_segments">NWL Rigid</option>
              <option value="skinned_mesh">Skinned</option>
            </select>
            <select id="gen-char-style" class="select-ctrl select-ctrl-sm" style="width:76px;">
              <option value="lowpoly">LowPoly</option>
              <option value="voxel">Voxel</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button id="gen-btn-character" class="btn btn-sm" type="button">UAL Char</button>
          <button id="gen-btn-prop" class="btn btn-sm" type="button">Prop CC0</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:6px;">
          <select id="gen-prop-kind" class="select-ctrl select-ctrl-sm">
            <option value="sword">Sword</option>
            <option value="shield">Shield</option>
            <option value="staff">Staff</option>
            <option value="chest">Chest</option>
            <option value="barrel">Barrel</option>
            <option value="tree">Tree</option>
          </select>
          <select id="gen-struct-biome" class="select-ctrl select-ctrl-sm" style="width:98px;">
            <option value="dungeon">WFC Dungeon</option>
            <option value="medieval">WFC Keep</option>
            <option value="city">WFC City</option>
          </select>
        </div>
        <button id="gen-btn-structure" class="btn btn-sm" type="button">WFC Auto Structure (4×4)</button>
        <input id="gen-char-gender" type="hidden" value="male" />
        <input id="gen-char-seed" type="hidden" value="42" />
        <input id="gen-prop-style" type="hidden" value="lowpoly" />
        <input id="gen-prop-seed" type="hidden" value="1337" />
        <input id="gen-struct-size" type="hidden" value="4" />
        <input id="gen-struct-floors" type="hidden" value="1" />
        <input id="gen-struct-style" type="hidden" value="lowpoly" />
        <input id="gen-struct-seed" type="hidden" value="77" />
      </div>
    </div>
  `;

  const statusEl = container.querySelector<HTMLElement>('#gen-status')!;

  container.querySelector('#gen-btn-nwl-hero')!.addEventListener('click', () => {
    const classId = container.querySelector<HTMLSelectElement>('#gen-nwl-class')!
      .value as PlayerClassId;
    const rarity = container.querySelector<HTMLSelectElement>('#gen-nwl-rarity')!
      .value as ItemRarity;
    const player = buildNwlPlayerCharacter(
      { classId, rarity, pixelSize: 3 },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlPlayer(player);
    statusEl.textContent = `Herói ${classId.toUpperCase()} (${rarity}) no PlayerBaseShell 1.79m (6 slots equipados)`;
  });

  container.querySelector('#gen-btn-swap-slot')!.addEventListener('click', () => {
    const slot = container.querySelector<HTMLSelectElement>('#gen-slot-sel')!.value as EquipSlot;
    const rarity = container.querySelector<HTMLSelectElement>('#gen-nwl-rarity')!
      .value as ItemRarity;
    const player = ctx.getCurrentPlayerInstance();
    if (!player) {
      statusEl.textContent = 'Gere primeiro o Herói Modular NWL acima para trocar peças ao vivo!';
      return;
    }
    const def = player.equipSlot(slot, rarity);
    statusEl.textContent = `Equipado ao vivo no bone: ${def.displayName}`;
  });

  container.querySelector('#gen-btn-npc')!.addEventListener('click', () => {
    const npcId = container.querySelector<HTMLSelectElement>('#gen-nwl-npc')!.value as NwlNpcId;
    const res = buildNwlNpc(npcId, { pixelSize: 3 }, ctx.getSharedMaterialResources());
    ctx.mountNwlNpc(res);
    statusEl.textContent = `${res.spec.namePt} (${res.id}) · ${res.spec.buildingName}`;
  });

  container.querySelector('#gen-btn-monster')!.addEventListener('click', () => {
    const mId = container.querySelector<HTMLSelectElement>('#gen-nwl-monster')!
      .value as NwlMonsterId;
    const res = buildNwlMonster(mId, { pixelSize: 3 }, ctx.getSharedMaterialResources());
    ctx.mountNwlMonster(res);
    statusEl.textContent = `${res.spec.namePt} · ${res.spec.targetHeightM}m (~${res.spec.targetHeightPx}px)`;
  });

  container.querySelector('#gen-btn-tileset')!.addEventListener('click', () => {
    const biome = container.querySelector<HTMLSelectElement>('#gen-nwl-tileset')!
      .value as NwlTilesetBiome;
    const cat = buildNwlTilesetCatalog(biome, ctx.getSharedMaterialResources());
    ctx.mountNwlCustomScene({
      name: `Tileset NWL 1.5m: ${biome}`,
      description: `${cat.pieceCount} peças modulares (chão, paredes 3m, flora, altar, baú, armadilha, destrutíveis).`,
      root: cat.root,
      materials: cat.materials,
      isLargeStructure: true,
    });
    statusEl.textContent = `Kit Tileset ${biome} (${cat.pieceCount} peças · 1.5m)`;
  });

  container.querySelector('#gen-btn-dungeon1')!.addEventListener('click', () => {
    const seed = Math.floor(Math.random() * 900 + 100);
    const dung = buildGreenRuinsFloor1(seed, ctx.getSharedMaterialResources());
    ctx.mountNwlCustomScene({
      name: `Ruínas Verdes · Andar 1 (Seed ${seed})`,
      description: `${dung.rooms.length} salas conectadas (1.5m/tile) · 5 Inimigos + Boss Demônio (2.95m) + Destrutíveis + Armadilhas.`,
      root: dung.root,
      materials: dung.materials,
      isLargeStructure: true,
      onUpdate: (t) => dung.update(t),
    });
    statusEl.textContent = `Ruínas Verdes Andar 1 gerado (Seed ${seed} · ${dung.enemySpawns.length} monstros)`;
  });

  container.querySelector('#gen-btn-spell')!.addEventListener('click', () => {
    const id = container.querySelector<HTMLSelectElement>('#gen-nwl-spell')!.value as NwlSpellVfxId;
    const vfx = buildNwlSpellVfx(id, ctx.getSharedMaterialResources());
    ctx.mountNwlSpellVfx(vfx);
    statusEl.textContent = `VFX 3D: ${vfx.meta.labelPt} (${vfx.triangleCount} tris · zero brilho suave)`;
  });

  container.querySelector('#gen-btn-character')!.addEventListener('click', () => {
    const archetype = container.querySelector<HTMLSelectElement>('#gen-char-arch')!
      .value as CharacterArchetype;
    const genderProfile = container.querySelector<HTMLInputElement>('#gen-char-gender')!
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
    statusEl.textContent = `UAL ${archetype} (${rigMode}, ${visualStyle})`;
  });

  container.querySelector('#gen-btn-prop')!.addEventListener('click', () => {
    const kind = container.querySelector<HTMLSelectElement>('#gen-prop-kind')!.value as PropKind;
    const result = buildProceduralProp(
      { kind, visualStyle: 'lowpoly', seed: 1337 },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedProp(result);
    statusEl.textContent = `Prop ${kind} (${result.dimensions.map((d) => d.toFixed(2)).join('×')}m)`;
  });

  container.querySelector('#gen-btn-structure')!.addEventListener('click', () => {
    const biome = container.querySelector<HTMLSelectElement>('#gen-struct-biome')!
      .value as StructureBiome;
    const result = buildProceduralStructure(
      { biome, cols: 4, rows: 4, floors: 1, visualStyle: 'lowpoly', seed: 77 },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedStructure(result);
    statusEl.textContent = `WFC ${biome} (4×4): ${result.cells.length} células`;
  });

  container.querySelector('#gen-btn-struct-glb')!.addEventListener('click', () => {
    void (async () => {
      const structRoot = ctx.getCurrentStructureRoot();
      if (!structRoot) {
        statusEl.textContent = 'Gere primeiro um Tileset / Dungeon / Cidade para exportar .GLB.';
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
        ctx.downloadBlob(
          new Blob([buf], { type: 'model/gltf-binary' }),
          `${structRoot.name || 'nwl_structure'}.glb`
        );
        statusEl.textContent = `Exportado ${structRoot.name || 'nwl_structure'}.glb`;
      }
    })();
  });
}
