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
import type { UnwrapMetricsSummary } from '../../engine/procedural/PixelMaterialSynth';
import {
  buildNwlPlayerCharacter,
  type EquipSlot,
  type ItemRarity,
  type PlayerCharacterInstance,
  type PlayerClassId,
} from '../../engine/procedural/PlayerEquipmentBuilder';
import type { FinishMode } from '../../engine/procedural/ProceduralGeometryKit';
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

export interface GeneratorFinishOptions {
  finishMode: FinishMode;
  seed: number;
  aoStrength: number;
  normalStrength: number;
}

export interface GeneratorPanelHandle {
  getFinishOptions: () => GeneratorFinishOptions;
  updateQualityStats: (metrics?: UnwrapMetricsSummary | null) => void;
  rebuildLastGenerated: () => boolean;
}

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
    onCleanup?: () => void;
  }) => void;
  mountNwlSpellVfx: (res: GeneratedSpellVfxResult) => void;
  getCurrentPlayerInstance: () => PlayerCharacterInstance | null;
  getCurrentStructureRoot: () => THREE.Object3D | null;
  downloadBlob: (blob: Blob, filename: string) => void;
  onFinishOptionsChanged?: (opts: GeneratorFinishOptions) => void;
}

export function mountGeneratorPanel(
  container: HTMLElement,
  ctx: GeneratorHostContext
): GeneratorPanelHandle {
  container.innerHTML = `
    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Acabamento Procedural (Texel &amp; AO)</span></div>
      <div class="ctrl-section-body">
        <div class="field-row">
          <label class="field-label" for="gen-finish-mode">Finish Mode</label>
          <select id="gen-finish-mode" class="select-ctrl select-ctrl-sm" style="width:170px;">
            <option value="textured_ao" selected>Texturizado + AO + Normal (Novo)</option>
            <option value="classic_flat">Clássico Flat (Legado)</option>
          </select>
        </div>
        <div class="field-row">
          <label class="field-label" for="gen-mat-seed">Material Seed</label>
          <input id="gen-mat-seed" type="number" class="select-ctrl select-ctrl-sm" style="width:92px;" value="101" step="1" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Vertex &amp; Texel AO</span>
            <span id="gen-ao-val" class="slider-val">0.55</span>
          </div>
          <input id="gen-ao-str" type="range" min="0" max="1" step="0.05" value="0.55" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Normal Relief</span>
            <span id="gen-norm-val" class="slider-val">0.36</span>
          </div>
          <input id="gen-norm-str" type="range" min="0" max="1" step="0.05" value="0.36" />
        </div>
        <div id="gen-quality-stats" class="voxel-stats-box">
          <span>UV &amp; Texture Quality Gate pronto</span>
        </div>
      </div>
    </div>

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

  const selFinishMode = container.querySelector<HTMLSelectElement>('#gen-finish-mode')!;
  const inpMatSeed = container.querySelector<HTMLInputElement>('#gen-mat-seed')!;
  const rngAoStr = container.querySelector<HTMLInputElement>('#gen-ao-str')!;
  const valAoStr = container.querySelector<HTMLElement>('#gen-ao-val')!;
  const rngNormStr = container.querySelector<HTMLInputElement>('#gen-norm-str')!;
  const valNormStr = container.querySelector<HTMLElement>('#gen-norm-val')!;
  const qualityStatsEl = container.querySelector<HTMLElement>('#gen-quality-stats')!;
  const statusEl = container.querySelector<HTMLElement>('#gen-status')!;

  const getFinishOptions = (): GeneratorFinishOptions => ({
    finishMode: (selFinishMode.value as FinishMode) || 'textured_ao',
    seed: Math.floor(Number(inpMatSeed.value) || 101),
    aoStrength: Number(rngAoStr.value),
    normalStrength: Number(rngNormStr.value),
  });

  const updateQualityStats = (metrics?: UnwrapMetricsSummary | null) => {
    if (!metrics) {
      qualityStatsEl.textContent = 'UV & Texture Quality Gate pronto (sem bake ativo)';
      return;
    }
    if (metrics.finishMode === 'classic_flat' || metrics.texWidth === 0) {
      qualityStatsEl.textContent = `Modo: Clássico Flat · ${metrics.triangleCount} tris · sem atlas`;
      return;
    }
    qualityStatsEl.textContent =
      `Atlas ${metrics.texWidth}×${metrics.texHeight} @ ${metrics.texelsPerMeter}px/m · ` +
      `${metrics.islandsCount} ilhas · Overlap ${metrics.overlapPairs} · ` +
      `H=${metrics.meanEntropy.toFixed(2)} · MinAO=${metrics.minVertexAo.toFixed(2)}`;
  };

  let lastGeneratedAction: (() => void) | null = null;
  let lastDungeonSeed = 101;

  const notifyFinishChanged = () => {
    valAoStr.textContent = Number(rngAoStr.value).toFixed(2);
    valNormStr.textContent = Number(rngNormStr.value).toFixed(2);
    ctx.onFinishOptionsChanged?.(getFinishOptions());
  };

  selFinishMode.addEventListener('change', notifyFinishChanged);
  inpMatSeed.addEventListener('change', notifyFinishChanged);
  rngAoStr.addEventListener('change', notifyFinishChanged);
  rngAoStr.addEventListener('input', () => {
    valAoStr.textContent = Number(rngAoStr.value).toFixed(2);
  });
  rngNormStr.addEventListener('change', notifyFinishChanged);
  rngNormStr.addEventListener('input', () => {
    valNormStr.textContent = Number(rngNormStr.value).toFixed(2);
  });

  const runNwlHero = () => {
    const classId = container.querySelector<HTMLSelectElement>('#gen-nwl-class')!
      .value as PlayerClassId;
    const rarity = container.querySelector<HTMLSelectElement>('#gen-nwl-rarity')!
      .value as ItemRarity;
    const finish = getFinishOptions();
    const player = buildNwlPlayerCharacter(
      {
        classId,
        rarity,
        pixelSize: 3,
        finishMode: finish.finishMode,
        materialSeed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlPlayer(player);
    statusEl.textContent = `Herói ${classId.toUpperCase()} (${rarity}) no PlayerBaseShell 1.79m (6 slots · ${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-nwl-hero')!.addEventListener('click', () => {
    lastGeneratedAction = runNwlHero;
    runNwlHero();
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
    updateQualityStats(player.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined);
    statusEl.textContent = `Equipado ao vivo no bone: ${def.displayName}`;
  });

  const runNwlNpc = () => {
    const npcId = container.querySelector<HTMLSelectElement>('#gen-nwl-npc')!.value as NwlNpcId;
    const finish = getFinishOptions();
    const res = buildNwlNpc(
      npcId,
      {
        pixelSize: 3,
        finishMode: finish.finishMode,
        seed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlNpc(res);
    statusEl.textContent = `${res.spec.namePt} (${res.id}) · ${res.spec.buildingName}`;
  };

  container.querySelector('#gen-btn-npc')!.addEventListener('click', () => {
    lastGeneratedAction = runNwlNpc;
    runNwlNpc();
  });

  const runNwlMonster = () => {
    const mId = container.querySelector<HTMLSelectElement>('#gen-nwl-monster')!
      .value as NwlMonsterId;
    const finish = getFinishOptions();
    const res = buildNwlMonster(
      mId,
      {
        pixelSize: 3,
        finishMode: finish.finishMode,
        seed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlMonster(res);
    statusEl.textContent = `${res.spec.namePt} · ${res.spec.targetHeightM}m (~${res.spec.targetHeightPx}px)`;
  };

  container.querySelector('#gen-btn-monster')!.addEventListener('click', () => {
    lastGeneratedAction = runNwlMonster;
    runNwlMonster();
  });

  const runNwlTileset = () => {
    const biome = container.querySelector<HTMLSelectElement>('#gen-nwl-tileset')!
      .value as NwlTilesetBiome;
    const finish = getFinishOptions();
    const cat = buildNwlTilesetCatalog(biome, ctx.getSharedMaterialResources(), finish);
    ctx.mountNwlCustomScene({
      name: `Tileset NWL 1.5m: ${biome}`,
      description: `${cat.pieceCount} peças modulares (chão, paredes 3m, flora, altar, baú, armadilha, destrutíveis).`,
      root: cat.root,
      materials: cat.materials,
      isLargeStructure: true,
      onCleanup: () => cat.dispose(),
    });
    statusEl.textContent = `Kit Tileset ${biome} (${cat.pieceCount} peças · 1.5m)`;
  };

  container.querySelector('#gen-btn-tileset')!.addEventListener('click', () => {
    lastGeneratedAction = runNwlTileset;
    runNwlTileset();
  });

  const runDungeon1 = () => {
    const finish = getFinishOptions();
    const dung = buildGreenRuinsFloor1(lastDungeonSeed, ctx.getSharedMaterialResources(), {
      finishMode: finish.finishMode,
      seed: finish.seed,
      aoStrength: finish.aoStrength,
      normalStrength: finish.normalStrength,
    });
    ctx.mountNwlCustomScene({
      name: `Ruínas Verdes · Andar 1 (Seed ${lastDungeonSeed})`,
      description: `${dung.rooms.length} salas conectadas (1.5m/tile) · 5 Inimigos + Boss Demônio (2.95m) + Destrutíveis + Armadilhas.`,
      root: dung.root,
      materials: dung.materials,
      isLargeStructure: true,
      onUpdate: (t) => dung.update(t),
      onCleanup: () => dung.dispose(),
    });
    statusEl.textContent = `Ruínas Verdes Andar 1 gerado (Seed ${lastDungeonSeed} · ${dung.enemySpawns.length} monstros)`;
  };

  container.querySelector('#gen-btn-dungeon1')!.addEventListener('click', () => {
    lastDungeonSeed = Math.floor(Math.random() * 900 + 100);
    lastGeneratedAction = runDungeon1;
    runDungeon1();
  });

  container.querySelector('#gen-btn-spell')!.addEventListener('click', () => {
    lastGeneratedAction = null;
    const id = container.querySelector<HTMLSelectElement>('#gen-nwl-spell')!.value as NwlSpellVfxId;
    const vfx = buildNwlSpellVfx(id, ctx.getSharedMaterialResources());
    ctx.mountNwlSpellVfx(vfx);
    statusEl.textContent = `VFX 3D: ${vfx.meta.labelPt} (${vfx.triangleCount} tris · zero brilho suave)`;
  });

  const runUalCharacter = () => {
    const archetype = container.querySelector<HTMLSelectElement>('#gen-char-arch')!
      .value as CharacterArchetype;
    const genderProfile = container.querySelector<HTMLInputElement>('#gen-char-gender')!
      .value as UalGenderProfile;
    const rigMode = container.querySelector<HTMLSelectElement>('#gen-char-rig')!
      .value as UalRigBuildMode;
    const visualStyle = container.querySelector<HTMLSelectElement>('#gen-char-style')!
      .value as 'lowpoly' | 'voxel';
    const finish = getFinishOptions();

    const result = buildProceduralUalCharacter(
      {
        archetype,
        genderProfile,
        rigMode,
        visualStyle,
        seed: finish.seed,
        voxelResolution: 24,
        finishMode: finish.finishMode,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedCharacter(result);
    statusEl.textContent = `UAL ${archetype} (${rigMode}, ${visualStyle}, ${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-character')!.addEventListener('click', () => {
    lastGeneratedAction = runUalCharacter;
    runUalCharacter();
  });

  const runProp = () => {
    const kind = container.querySelector<HTMLSelectElement>('#gen-prop-kind')!.value as PropKind;
    const finish = getFinishOptions();
    const result = buildProceduralProp(
      {
        kind,
        visualStyle: 'lowpoly',
        seed: finish.seed,
        finishMode: finish.finishMode,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedProp(result);
    statusEl.textContent = `Prop ${kind} (${result.dimensions.map((d) => d.toFixed(2)).join('×')}m · ${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-prop')!.addEventListener('click', () => {
    lastGeneratedAction = runProp;
    runProp();
  });

  const runStructure = () => {
    const biome = container.querySelector<HTMLSelectElement>('#gen-struct-biome')!
      .value as StructureBiome;
    const finish = getFinishOptions();
    const result = buildProceduralStructure(
      {
        biome,
        cols: 4,
        rows: 4,
        floors: 1,
        visualStyle: 'lowpoly',
        seed: finish.seed,
        finishMode: finish.finishMode,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountGeneratedStructure(result);
    statusEl.textContent = `WFC ${biome} (4×4): ${result.cells.length} células (${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-structure')!.addEventListener('click', () => {
    lastGeneratedAction = runStructure;
    runStructure();
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
          const opts = pm?.options;
          const isMetal = opts?.workflow === 'metallic';
          const m = new THREE.MeshStandardMaterial({
            color: opts?.baseColor ? new THREE.Color(opts.baseColor) : '#ffffff',
            vertexColors: Boolean(o.geometry?.getAttribute('color')),
            map: opts?.albedoMap ?? null,
            normalMap: opts?.normalMap ?? null,
            emissive: opts?.emissionColor ? new THREE.Color(opts.emissionColor) : '#000000',
            emissiveMap: opts?.emissionMap ?? null,
            emissiveIntensity:
              opts && opts.emissionIntensity > 0 ? Math.min(0.45, opts.emissionIntensity * 0.3) : 0,
            metalness: isMetal ? Math.min(0.35, Math.max(0.05, opts.metallic)) : 0.08,
            roughness: opts ? Math.max(0.25, Math.min(0.95, 1.0 - opts.smoothness)) : 0.78,
            side: pm?.side ?? THREE.FrontSide,
          });
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

  return {
    getFinishOptions,
    updateQualityStats,
    rebuildLastGenerated: () => {
      if (!lastGeneratedAction) return false;
      lastGeneratedAction();
      return true;
    },
  };
}
