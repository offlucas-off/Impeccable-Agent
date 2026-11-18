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
  buildDungeonByBiome,
  buildArchitecturalStructure,
  DUNGEON_BIOME_THEMES,
  type ArchitecturalStructureId,
  type DungeonBiomeId,
  type NwlTilesetBiome,
} from '../../engine/procedural/NwlTilesetDungeon';
import {
  QUADRUPED_CREATURE_SPECS,
  buildQuadrupedCreature,
  type QuadrupedCreatureId,
} from '../../engine/procedural/CreatureBuilder';
import {
  PRESET_CATEGORY_LABELS,
  searchPresets,
  type PresetCategory,
  type PresetEntry,
} from '../../engine/PresetRegistry';
import type { UnwrapMetricsSummary } from '../../engine/procedural/PixelMaterialSynth';
import {
  BACK_STYLES,
  BOOTS_STYLES,
  CHEST_STYLES,
  CLASS_DEFAULT_STYLE_LOADOUT,
  EQUIPMENT_ARCHETYPE_PRESETS,
  GLOVES_STYLES,
  HELMET_STYLES,
  LEGS_STYLES,
  MATERIAL_THEMES,
  SHOULDER_STYLES,
  WEAPON_MAIN_STYLES,
  WEAPON_OFFHAND_STYLES,
  createRandomStyleLoadout,
  type BackStyleId,
  type BootsStyleId,
  type ChestStyleId,
  type EquipmentStyleLoadout,
  type GlovesStyleId,
  type HelmetStyleId,
  type LegsStyleId,
  type MaterialThemeId,
  type ShoulderStyleId,
  type WeaponMainStyleId,
  type WeaponOffhandStyleId,
} from '../../engine/procedural/EquipmentCatalog';
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
  spawnRegistryPreset?: (entry: PresetEntry) => Promise<void>;
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
    clips?: THREE.AnimationClip[];
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
            <span id="gen-ao-val" class="slider-val">0.28</span>
          </div>
          <input id="gen-ao-str" type="range" min="0" max="1" step="0.05" value="0.28" />
        </div>
        <div class="slider-row">
          <div class="slider-head">
            <span>Normal Relief</span>
            <span id="gen-norm-val" class="slider-val">0.14</span>
          </div>
          <input id="gen-norm-str" type="range" min="0" max="1" step="0.05" value="0.14" />
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
          <button id="gen-btn-swap-slot" class="btn btn-sm" type="button">Trocar Raridade</button>
        </div>

        <div style="border-top:1px solid var(--border-subtle);padding-top:6px;margin-top:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
            <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">Mix &amp; Match Modular</span>
            <button id="gen-btn-randomize-gear" class="btn btn-sm" type="button">Aleatorizar</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
            <select id="gen-style-helmet" class="select-ctrl select-ctrl-sm" title="Elmo">
              ${HELMET_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-chest" class="select-ctrl select-ctrl-sm" title="Peitoral">
              ${CHEST_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-shoulders" class="select-ctrl select-ctrl-sm" title="Ombreiras">
              ${SHOULDER_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-gloves" class="select-ctrl select-ctrl-sm" title="Luvas">
              ${GLOVES_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-legs" class="select-ctrl select-ctrl-sm" title="Calça / Kilt">
              ${LEGS_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-boots" class="select-ctrl select-ctrl-sm" title="Botas">
              ${BOOTS_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-weapon-main" class="select-ctrl select-ctrl-sm" title="Arma Principal">
              ${WEAPON_MAIN_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-weapon-offhand" class="select-ctrl select-ctrl-sm" title="Mão Secundária">
              ${WEAPON_OFFHAND_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-back" class="select-ctrl select-ctrl-sm" title="Acessório Dorsal (Costas)">
              ${BACK_STYLES.map((s) => `<option value="${s.id}">${s.labelPt}</option>`).join('')}
            </select>
            <select id="gen-style-material" class="select-ctrl select-ctrl-sm" title="Material / Acabamento">
              ${Object.values(MATERIAL_THEMES)
                .map((m) => `<option value="${m.id}">${m.labelPt}</option>`)
                .join('')}
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto;gap:5px;margin-top:5px;">
            <select id="gen-style-archetype" class="select-ctrl select-ctrl-sm" title="Arquétipos Prontos">
              <option value="">Arquétipo (1-Clique)...</option>
              ${EQUIPMENT_ARCHETYPE_PRESETS.map(
                (a) => `<option value="${a.id}">${a.labelPt}</option>`
              ).join('')}
            </select>
            <button id="gen-btn-archetype" class="btn btn-sm" type="button">Equipar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>NWL NPCs, Bestiário, Quadrúpedes &amp; Bosses</span></div>
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
        <div class="field-row">
          <label class="field-label" for="gen-quad-id">Quadrúpede / Wyvern</label>
          <div class="field-control">
            <select id="gen-quad-id" class="select-ctrl select-ctrl-sm" style="width:130px;">
              ${Object.values(QUADRUPED_CREATURE_SPECS)
                .map((q) => `<option value="${q.id}">${q.labelPt}</option>`)
                .join('')}
            </select>
            <button id="gen-btn-quad" class="btn btn-sm" type="button">Gerar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Dungeons Multi-Bioma, Estruturas &amp; VFX 3D</span></div>
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
        <div class="field-row">
          <label class="field-label" for="gen-dungeon-biome">Bioma Dungeon 1.5m</label>
          <div class="field-control">
            <select id="gen-dungeon-biome" class="select-ctrl select-ctrl-sm" style="width:128px;">
              ${Object.values(DUNGEON_BIOME_THEMES)
                .map((b) => `<option value="${b.id}">${b.labelPt}</option>`)
                .join('')}
            </select>
            <button id="gen-btn-dungeon-biome" class="btn btn-primary btn-sm" type="button">Gerar</button>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label" for="gen-arch-struct">Estrutura Cidade</label>
          <div class="field-control">
            <select id="gen-arch-struct" class="select-ctrl select-ctrl-sm" style="width:128px;">
              <option value="watchtower">Torre de Vigia</option>
              <option value="gatehouse">Muralha + Portão</option>
              <option value="stone_bridge">Ponte de Pedra</option>
              <option value="tavern_2story">Taverna 2 Andares</option>
            </select>
            <button id="gen-btn-arch-struct" class="btn btn-sm" type="button">Gerar</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:6px;">
          <button id="gen-btn-dungeon1" class="btn btn-sm" type="button">Gerar Ruínas Verdes · Andar 1</button>
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
            <option value="axe">Axe</option>
            <option value="shield">Shield</option>
            <option value="staff">Staff</option>
            <option value="torch">Torch</option>
            <option value="chest">Chest</option>
            <option value="barrel">Barrel</option>
            <option value="table">Table</option>
            <option value="pillar">Pillar</option>
            <option value="crate">Crate</option>
            <option value="tree">Tree</option>
            <option value="well">Poço (Well)</option>
            <option value="market_stall">Banca Mercado</option>
            <option value="anvil">Bigorna (Anvil)</option>
            <option value="cart">Carroça (Cart)</option>
            <option value="signpost">Placa (Signpost)</option>
            <option value="bench">Banco (Bench)</option>
            <option value="fountain">Fonte (Fountain)</option>
            <option value="hay_bale">Fardo de Feno</option>
            <option value="sack">Saco de Grãos</option>
            <option value="banner_stand">Estandarte Real</option>
            <option value="crystal_cluster">Cristais Místicos</option>
            <option value="statue_knight">Estátua Cavaleiro</option>
            <option value="tombstone">Lápide Gótica</option>
            <option value="cage">Jaula de Ferro</option>
            <option value="alchemist_table">Mesa Alquimista</option>
            <option value="bookshelf">Estante Livros</option>
            <option value="brazier">Braseiro Aceso</option>
            <option value="weapon_rack">Suporte Armas</option>
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

    <div class="ctrl-section">
      <div class="ctrl-section-head"><span>Asset Repository (Catálogo Unificado)</span></div>
      <div class="ctrl-section-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
          <input id="repo-search" class="input-ctrl" type="text" placeholder="Buscar asset/tag..." style="height:26px;" />
          <select id="repo-category" class="select-ctrl select-ctrl-sm">
            <option value="all">Todas Categorias</option>
            ${(Object.keys(PRESET_CATEGORY_LABELS) as PresetCategory[])
              .map((c) => `<option value="${c}">${PRESET_CATEGORY_LABELS[c]}</option>`)
              .join('')}
          </select>
        </div>
        <div id="repo-list" style="max-height:190px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;margin-top:6px;"></div>
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

  const selClass = container.querySelector<HTMLSelectElement>('#gen-nwl-class')!;
  const selRarity = container.querySelector<HTMLSelectElement>('#gen-nwl-rarity')!;
  const selHelmet = container.querySelector<HTMLSelectElement>('#gen-style-helmet')!;
  const selChest = container.querySelector<HTMLSelectElement>('#gen-style-chest')!;
  const selShoulders = container.querySelector<HTMLSelectElement>('#gen-style-shoulders')!;
  const selGloves = container.querySelector<HTMLSelectElement>('#gen-style-gloves')!;
  const selLegs = container.querySelector<HTMLSelectElement>('#gen-style-legs')!;
  const selBoots = container.querySelector<HTMLSelectElement>('#gen-style-boots')!;
  const selWeaponMain = container.querySelector<HTMLSelectElement>('#gen-style-weapon-main')!;
  const selWeaponOffhand = container.querySelector<HTMLSelectElement>('#gen-style-weapon-offhand')!;
  const selBack = container.querySelector<HTMLSelectElement>('#gen-style-back')!;
  const selMaterial = container.querySelector<HTMLSelectElement>('#gen-style-material')!;
  const selArchetype = container.querySelector<HTMLSelectElement>('#gen-style-archetype')!;

  const getStyleLoadout = (): EquipmentStyleLoadout => ({
    helmet: selHelmet.value as HelmetStyleId,
    chest: selChest.value as ChestStyleId,
    shoulders: selShoulders.value as ShoulderStyleId,
    gloves: selGloves.value as GlovesStyleId,
    legs: selLegs.value as LegsStyleId,
    boots: selBoots.value as BootsStyleId,
    weaponMain: selWeaponMain.value as WeaponMainStyleId,
    weaponOffhand: selWeaponOffhand.value as WeaponOffhandStyleId,
    back: (selBack.value as BackStyleId) || 'none',
    materialTheme: (selMaterial.value as MaterialThemeId) || 'default',
  });

  const applyStyleLoadoutToUi = (loadout: EquipmentStyleLoadout) => {
    selHelmet.value = loadout.helmet;
    selChest.value = loadout.chest;
    selShoulders.value = loadout.shoulders;
    selGloves.value = loadout.gloves;
    selLegs.value = loadout.legs;
    selBoots.value = loadout.boots;
    selWeaponMain.value = loadout.weaponMain;
    selWeaponOffhand.value = loadout.weaponOffhand;
    selBack.value = loadout.back ?? 'none';
    selMaterial.value = loadout.materialTheme ?? 'default';
  };

  selClass.addEventListener('change', () => {
    const classId = selClass.value as PlayerClassId;
    applyStyleLoadoutToUi(CLASS_DEFAULT_STYLE_LOADOUT[classId]);
  });

  const styleSelects = [
    selHelmet,
    selChest,
    selShoulders,
    selGloves,
    selLegs,
    selBoots,
    selWeaponMain,
    selWeaponOffhand,
    selBack,
    selMaterial,
  ];
  for (const sel of styleSelects) {
    sel.addEventListener('change', () => {
      const player = ctx.getCurrentPlayerInstance();
      if (!player) return;
      const next = getStyleLoadout();
      player.setStyleLoadout(next);
      updateQualityStats(player.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined);
      statusEl.textContent = `Mix & Match ao vivo: ${next.weaponMain} + ${next.weaponOffhand} (${next.helmet}, ${next.back ?? 'none'})`;
    });
  }

  const runNwlHero = () => {
    const classId = selClass.value as PlayerClassId;
    const rarity = selRarity.value as ItemRarity;
    const finish = getFinishOptions();
    const styleLoadout = getStyleLoadout();
    const player = buildNwlPlayerCharacter(
      {
        classId,
        rarity,
        styleLoadout,
        pixelSize: 1,
        finishMode: finish.finishMode,
        materialSeed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlPlayer(player);
    statusEl.textContent = `Herói ${classId.toUpperCase()} (${rarity}) · ${styleLoadout.weaponMain} + ${styleLoadout.helmet} (${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-nwl-hero')!.addEventListener('click', () => {
    lastGeneratedAction = runNwlHero;
    runNwlHero();
  });

  container.querySelector('#gen-btn-archetype')!.addEventListener('click', () => {
    const archId = selArchetype.value;
    const arch = EQUIPMENT_ARCHETYPE_PRESETS.find((a) => a.id === archId);
    if (!arch) {
      statusEl.textContent = 'Selecione um Arquétipo na lista para equipar.';
      return;
    }
    selClass.value = arch.baseClass;
    applyStyleLoadoutToUi(arch.loadout);
    lastGeneratedAction = runNwlHero;
    runNwlHero();
    statusEl.textContent = `Arquétipo equipado: ${arch.labelPt}`;
  });

  container.querySelector('#gen-btn-randomize-gear')!.addEventListener('click', () => {
    const rnd = createRandomStyleLoadout();
    applyStyleLoadoutToUi(rnd);
    const player = ctx.getCurrentPlayerInstance();
    if (player) {
      player.setStyleLoadout(rnd);
      updateQualityStats(player.root.userData.unwrapMetrics as UnwrapMetricsSummary | undefined);
      statusEl.textContent = `Equipamento aleatório: ${rnd.weaponMain} + ${rnd.weaponOffhand} · ${rnd.helmet}`;
    } else {
      lastGeneratedAction = runNwlHero;
      runNwlHero();
    }
  });

  container.querySelector('#gen-btn-swap-slot')!.addEventListener('click', () => {
    const slot = container.querySelector<HTMLSelectElement>('#gen-slot-sel')!.value as EquipSlot;
    const rarity = selRarity.value as ItemRarity;
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
        pixelSize: 1,
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
        pixelSize: 1,
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

  const runQuadruped = (overrideId?: QuadrupedCreatureId) => {
    const qId =
      overrideId ??
      (container.querySelector<HTMLSelectElement>('#gen-quad-id')!.value as QuadrupedCreatureId);
    const finish = getFinishOptions();
    const q = buildQuadrupedCreature(
      qId,
      {
        finishMode: finish.finishMode,
        materialSeed: finish.seed,
      },
      ctx.getSharedMaterialResources()
    );
    const estH = (q.spec.bodyH * q.spec.scale * 2.2).toFixed(2);
    const estL = (q.spec.bodyL * q.spec.scale).toFixed(2);
    ctx.mountNwlCustomScene({
      name: `${q.spec.labelPt} (${q.spec.id})`,
      description: `Rig Quadrúpede 24 Bones (${estH}m alt × ${estL}m comp · ${q.clips.length} animações).`,
      root: q.root,
      materials: q.materials,
      clips: q.clips,
      onCleanup: () => q.dispose(),
    });
    statusEl.textContent = `${q.spec.labelPt} · ~${estH}m · ${q.clips.length} clips`;
  };

  container.querySelector('#gen-btn-quad')!.addEventListener('click', () => {
    lastGeneratedAction = () => runQuadruped();
    runQuadruped();
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

  const runDungeonBiome = (overrideBiome?: DungeonBiomeId) => {
    const biomeId =
      overrideBiome ??
      (container.querySelector<HTMLSelectElement>('#gen-dungeon-biome')!.value as DungeonBiomeId);
    const finish = getFinishOptions();
    const dung = buildDungeonByBiome(
      biomeId,
      lastDungeonSeed,
      {
        finishMode: finish.finishMode,
        seed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    const theme = DUNGEON_BIOME_THEMES[biomeId];
    ctx.mountNwlCustomScene({
      name: `${theme.labelPt} (Seed ${lastDungeonSeed})`,
      description: `${dung.rooms.length} salas conectadas (1.5m/tile) · Bioma ${theme.labelPt} · ${dung.enemySpawns.length} monstros.`,
      root: dung.root,
      materials: dung.materials,
      isLargeStructure: true,
      onUpdate: (t) => dung.update(t),
      onCleanup: () => dung.dispose(),
    });
    statusEl.textContent = `${theme.labelPt} gerado (Seed ${lastDungeonSeed} · ${dung.enemySpawns.length} monstros)`;
  };

  container.querySelector('#gen-btn-dungeon-biome')!.addEventListener('click', () => {
    lastDungeonSeed = Math.floor(Math.random() * 900 + 100);
    lastGeneratedAction = () => runDungeonBiome();
    runDungeonBiome();
  });

  const runArchStructure = (overrideStruct?: ArchitecturalStructureId) => {
    const structId =
      overrideStruct ??
      (container.querySelector<HTMLSelectElement>('#gen-arch-struct')!
        .value as ArchitecturalStructureId);
    const finish = getFinishOptions();
    const st = buildArchitecturalStructure(
      structId,
      {
        finishMode: finish.finishMode,
        seed: finish.seed,
        aoStrength: finish.aoStrength,
        normalStrength: finish.normalStrength,
      },
      ctx.getSharedMaterialResources()
    );
    ctx.mountNwlCustomScene({
      name: `Estrutura: ${structId}`,
      description: `Estrutura arquitetônica modular para cidade medieval / fortaleza.`,
      root: st.root,
      materials: st.materials,
      isLargeStructure: true,
      onCleanup: () => st.dispose(),
    });
    statusEl.textContent = `Estrutura ${structId} gerada (${finish.finishMode})`;
  };

  container.querySelector('#gen-btn-arch-struct')!.addEventListener('click', () => {
    lastGeneratedAction = () => runArchStructure();
    runArchStructure();
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

  const NPC_ALIAS_MAP: Record<string, NwlNpcId> = {
    blacksmith: 'npc.ferreiro',
    merchant: 'npc.mercador',
    guard: 'npc.guarda',
    villager: 'npc.escriba',
  };

  const MONSTER_ALIAS_MAP: Record<string, NwlMonsterId> = {
    goblin_scout: 'orcs.goblin_01',
    goblin_raider: 'orcs.goblin_03',
    goblin_archer: 'orcs.goblin_06',
    goblin_shaman: 'orcs.goblin_02',
    orc_brute: 'orcs.orc_04',
    boss_demon: 'demons.boss_demon',
    skeleton_warrior: 'monster.skeleton_warrior',
    skeleton_archer: 'monster.skeleton_archer',
    dark_cultist: 'monster.dark_cultist',
    gargoyle: 'monster.gargoyle',
    lizardman: 'monster.lizardman',
    crystal_golem: 'monster.crystal_golem',
    colossus_golem: 'boss.colossus_golem',
    minotaur_warlord: 'boss.minotaur_warlord',
    dread_knight: 'boss.dread_knight',
  };

  const VFX_ALIAS_MAP: Record<string, NwlSpellVfxId> = {
    fire_nova: 'seta_fogo',
    ice_shatter: 'armadilha_de_gelo',
    arcane_sigil: 'nova_arcana',
  };

  const spawnRegistryPreset = async (entry: PresetEntry): Promise<void> => {
    const spec = entry.generatorSpec;
    const finish = getFinishOptions();
    if (!spec) return;

    if (spec.kind === 'player') {
      const classId = spec.subId as PlayerClassId;
      selClass.value = classId;
      applyStyleLoadoutToUi(CLASS_DEFAULT_STYLE_LOADOUT[classId]);
      lastGeneratedAction = runNwlHero;
      runNwlHero();
      return;
    }

    if (spec.kind === 'npc') {
      const npcId = (NPC_ALIAS_MAP[spec.subId] ?? spec.subId) as NwlNpcId;
      const res = buildNwlNpc(
        npcId,
        {
          pixelSize: 1,
          finishMode: finish.finishMode,
          seed: finish.seed,
          aoStrength: finish.aoStrength,
          normalStrength: finish.normalStrength,
        },
        ctx.getSharedMaterialResources()
      );
      ctx.mountNwlNpc(res);
      statusEl.textContent = `${entry.name} (${res.id})`;
      return;
    }

    if (spec.kind === 'monster') {
      const mId = (MONSTER_ALIAS_MAP[spec.subId] ?? spec.subId) as NwlMonsterId;
      const res = buildNwlMonster(
        mId,
        {
          pixelSize: 1,
          finishMode: finish.finishMode,
          seed: finish.seed,
          aoStrength: finish.aoStrength,
          normalStrength: finish.normalStrength,
        },
        ctx.getSharedMaterialResources()
      );
      ctx.mountNwlMonster(res);
      statusEl.textContent = `${entry.name} · ${res.spec.targetHeightM}m`;
      return;
    }

    if (spec.kind === 'quadruped') {
      const qId = spec.subId as QuadrupedCreatureId;
      lastGeneratedAction = () => runQuadruped(qId);
      runQuadruped(qId);
      return;
    }

    if (spec.kind === 'prop') {
      const kind = spec.subId as PropKind;
      const res = buildProceduralProp(
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
      ctx.mountGeneratedProp(res);
      statusEl.textContent = `Prop: ${entry.name}`;
      return;
    }

    if (spec.kind === 'structure') {
      if (spec.subId === 'medieval_town') {
        const res = buildProceduralStructure(
          {
            biome: 'medieval',
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
        ctx.mountGeneratedStructure(res);
        statusEl.textContent = `Estrutura: ${entry.name}`;
        return;
      }
      const structId = spec.subId as ArchitecturalStructureId;
      lastGeneratedAction = () => runArchStructure(structId);
      runArchStructure(structId);
      return;
    }

    if (spec.kind === 'dungeon') {
      const biomeId = spec.subId as DungeonBiomeId;
      lastGeneratedAction = () => runDungeonBiome(biomeId);
      runDungeonBiome(biomeId);
      return;
    }

    if (spec.kind === 'vfx') {
      const vfxId = (VFX_ALIAS_MAP[spec.subId] ?? spec.subId) as NwlSpellVfxId;
      const vfx = buildNwlSpellVfx(vfxId, ctx.getSharedMaterialResources());
      ctx.mountNwlSpellVfx(vfx);
      statusEl.textContent = `VFX 3D: ${entry.name}`;
    }
  };

  const inpRepoSearch = container.querySelector<HTMLInputElement>('#repo-search')!;
  const selRepoCategory = container.querySelector<HTMLSelectElement>('#repo-category')!;
  const repoListEl = container.querySelector<HTMLElement>('#repo-list')!;

  const renderRepoList = () => {
    const query = inpRepoSearch.value;
    const category = (selRepoCategory.value as PresetCategory | 'all') || 'all';
    const matches = searchPresets(query, category);
    if (matches.length === 0) {
      repoListEl.innerHTML =
        '<div style="font-size:11px;color:var(--text-muted);padding:6px;">Nenhum asset encontrado.</div>';
      return;
    }
    repoListEl.innerHTML = '';
    for (const entry of matches) {
      const row = document.createElement('div');
      row.style.cssText =
        'display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 6px;border-radius:4px;background:var(--bg-elevated,rgba(255,255,255,0.03));border:1px solid var(--border-subtle);';
      const info = document.createElement('div');
      info.style.cssText = 'min-width:0;flex:1;';
      info.innerHTML = `<div style="font-size:11px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${entry.name}</div><div style="font-size:10px;color:var(--text-muted);">${PRESET_CATEGORY_LABELS[entry.category]} · ${entry.approxHeightM}m</div>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm';
      btn.textContent = 'Spawn';
      btn.addEventListener('click', () => {
        void spawnRegistryPreset(entry);
      });
      row.append(info, btn);
      repoListEl.appendChild(row);
    }
  };

  inpRepoSearch.addEventListener('input', renderRepoList);
  selRepoCategory.addEventListener('change', renderRepoList);
  renderRepoList();

  return {
    getFinishOptions,
    updateQualityStats,
    rebuildLastGenerated: () => {
      if (!lastGeneratedAction) return false;
      lastGeneratedAction();
      return true;
    },
    spawnRegistryPreset,
  };
}
