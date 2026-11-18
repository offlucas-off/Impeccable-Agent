import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../engine/PixelizerMaterial';
import type { PixelizerPipeline } from '../engine/PixelizerPipeline';
import { buildNwlStarterCity, type GeneratedStarterCity } from '../engine/procedural/CityBuilder';
import {
  NWL_MONSTER_SPECS,
  type GeneratedMonsterResult,
} from '../engine/procedural/MonsterBuilder';
import {
  buildGreenRuinsFloor1,
  type GeneratedGreenRuinsFloor1,
} from '../engine/procedural/NwlTilesetDungeon';
import {
  EQUIP_SLOTS,
  ITEM_RARITIES,
  RARITY_COLOR_TABLE,
  buildNwlPlayerCharacter,
  getEquipmentPieceDef,
  type EquipSlot,
  type ItemRarity,
  type PlayerCharacterInstance,
  type PlayerClassId,
} from '../engine/procedural/PlayerEquipmentBuilder';
import type { FinishMode } from '../engine/procedural/ProceduralGeometryKit';
import { mergeColoredParts, prepareColoredPart } from '../engine/procedural/SdfVoxelPrimitives';
import {
  buildNwlSpellVfx,
  type GeneratedSpellVfxResult,
  type NwlSpellVfxId,
} from '../engine/procedural/SpellVfxBuilder';
import { AnimationLibraryBank } from '../engine/rigging/AnimationLibraryBank';

export type SandboxZoneId = 'city' | 'dungeon';

interface ActiveEnemyActor {
  spawnId: string;
  namePt: string;
  role: 'common' | 'ranged' | 'heavy' | 'boss';
  instance: GeneratedMonsterResult;
  hp: number;
  maxHp: number;
  damage: number;
  moveSpeed: number;
  attackRange: number;
  windupSec: number;
  isRanged: boolean;
  dead: boolean;
  state: 'idle' | 'chase' | 'windup' | 'cooldown';
  stateTimer: number;
  telegraph?: GeneratedSpellVfxResult;
  mixer?: THREE.AnimationMixer;
  idleAction?: THREE.AnimationAction;
  walkAction?: THREE.AnimationAction;
  attackAction?: THREE.AnimationAction;
}

interface ActiveProjectile {
  vfx: GeneratedSpellVfxResult;
  fromEnemy: boolean;
  dir: THREE.Vector3;
  speed: number;
  damage: number;
  lifeSec: number;
  maxLifeSec: number;
}

interface ActiveTransientVfx {
  vfx: GeneratedSpellVfxResult;
  elapsed: number;
  duration: number;
}

interface DroppedLootItem {
  slot: EquipSlot;
  rarity: ItemRarity;
  mesh: THREE.Mesh;
  mat: PixelizerMaterial;
  worldPos: THREE.Vector3;
  bobSeed: number;
}

interface ClassSpellBarItem {
  key: string;
  vfxId: NwlSpellVfxId;
  labelPt: string;
  cooldownSec: number;
  range: number;
  damage: number;
  isProjectile: boolean;
  isDash?: boolean;
}

const CLASS_SPELLS: Record<PlayerClassId, ClassSpellBarItem[]> = {
  knight: [
    { key: '1', vfxId: 'investida', labelPt: 'Investida', cooldownSec: 2.5, range: 3.5, damage: 28, isProjectile: false, isDash: true },
    { key: '2', vfxId: 'barreira', labelPt: 'Barreira', cooldownSec: 5.0, range: 2.5, damage: 15, isProjectile: false },
    { key: '3', vfxId: 'grito_de_guerra', labelPt: 'Grito', cooldownSec: 4.5, range: 3.8, damage: 24, isProjectile: false },
    { key: '4', vfxId: 'egide_refletora', labelPt: 'Égide', cooldownSec: 6.0, range: 3.0, damage: 32, isProjectile: false },
  ],
  archer: [
    { key: '1', vfxId: 'flecha_perfurante', labelPt: 'Perfurar', cooldownSec: 2.0, range: 10.0, damage: 30, isProjectile: true },
    { key: '2', vfxId: 'armadilha_de_gelo', labelPt: 'Armadilha', cooldownSec: 4.5, range: 3.0, damage: 22, isProjectile: false },
    { key: '3', vfxId: 'adaga_venenosa', labelPt: 'Veneno', cooldownSec: 2.2, range: 8.5, damage: 24, isProjectile: true },
    { key: '4', vfxId: 'salto_sombrio', labelPt: 'Salto', cooldownSec: 3.5, range: 3.5, damage: 16, isProjectile: false, isDash: true },
  ],
  mage: [
    { key: '1', vfxId: 'seta_fogo', labelPt: 'Seta Fogo', cooldownSec: 1.4, range: 10.0, damage: 28, isProjectile: true },
    { key: '2', vfxId: 'nova_arcana', labelPt: 'Nova Arcana', cooldownSec: 3.5, range: 3.8, damage: 34, isProjectile: false },
    { key: '3', vfxId: 'prisao_gelo', labelPt: 'Prisão Gelo', cooldownSec: 5.0, range: 3.2, damage: 26, isProjectile: false },
    { key: '4', vfxId: 'meteoro', labelPt: 'Meteoro', cooldownSec: 6.5, range: 4.2, damage: 55, isProjectile: false },
  ],
};

export interface SandboxStateSnapshot {
  zone: SandboxZoneId;
  classId: PlayerClassId;
  hp: number;
  maxHp: number;
  seed: number;
  enemiesAlive: number;
  bossHp: number | null;
  bossMaxHp: number | null;
  lastEventText: string;
}

export interface SandboxCombatJuiceState {
  hitStopRemaining: number;
  shakeIntensity: number;
  activeFloatingCount: number;
  spellCooldowns: number[];
}

export interface PlaySandboxHandle {
  root: THREE.Group;
  hudElement: HTMLElement;
  enterZone: (zone: SandboxZoneId, newSeed?: number) => void;
  setClass: (cls: PlayerClassId) => void;
  equipSlotRarity: (slot: EquipSlot, rarity: ItemRarity) => void;
  equipAllRarity: (rarity: ItemRarity) => void;
  spawnRandomDropNearHero: (forcedRarity?: ItemRarity, forcedSlot?: EquipSlot) => void;
  update: (dt: number) => void;
  getState: () => SandboxStateSnapshot;
  getCameraTarget: () => THREE.Vector3;
  getCameraShakeOffset: () => THREE.Vector3;
  getCombatJuiceState: () => SandboxCombatJuiceState;
  dispose: () => void;
}

export function createNwlPlaySandbox(
  stageContainer: HTMLElement,
  pipeline: PixelizerPipeline,
  callbacks: {
    onExitSandbox: () => void;
    onZoneOrActorChanged?: () => void;
    projectWorldToScreen?: (
      worldPos: THREE.Vector3
    ) => { x: number; y: number; visible: boolean } | null;
    finishOptions?: {
      finishMode?: FinishMode;
      seed?: number;
      aoStrength?: number;
      normalStrength?: number;
    };
  }
): PlaySandboxHandle {
  const root = new THREE.Group();
  root.name = 'NWL_Play_Sandbox';

  const res = (): PixelizerMaterialResources => pipeline.getSharedResourcesForMaterial();
  const sandboxFinish = {
    finishMode: callbacks.finishOptions?.finishMode ?? ('textured_ao' as FinishMode),
    seed: Math.floor(callbacks.finishOptions?.seed ?? 101),
    aoStrength: callbacks.finishOptions?.aoStrength ?? 0.55,
    normalStrength: callbacks.finishOptions?.normalStrength ?? 0.36,
  };

  // Build Hero (canonical 1.79m base shell + 6 modular equip slots)
  const hero: PlayerCharacterInstance = buildNwlPlayerCharacter(
    {
      classId: 'knight',
      rarity: 'normal',
      pixelSize: 3,
      objectId: 10,
      finishMode: sandboxFinish.finishMode,
      materialSeed: sandboxFinish.seed,
      aoStrength: sandboxFinish.aoStrength,
      normalStrength: sandboxFinish.normalStrength,
    },
    res()
  );
  hero.root.position.set(0, 0, 1.8);
  root.add(hero.root);

  let heroMixer: THREE.AnimationMixer | null = null;
  let heroActionName = '';
  const heroClipActions = new Map<string, THREE.AnimationAction>();

  const setupHeroClips = () => {
    const bank = AnimationLibraryBank.getInstance();
    if (!bank.isLoaded()) return;
    heroMixer = new THREE.AnimationMixer(hero.root);
    heroClipActions.clear();
    const wanted = ['Idle_Loop', 'Jog_Fwd_Loop', 'Walk_Loop', 'Sword_Regular_A', 'Spell_Simple_Shoot', 'Roll', 'Dodge', 'Hit_Chest'];
    for (const c of bank.getAll()) {
      if (wanted.includes(c.name) || wanted.some((w) => c.name.includes(w))) {
        heroClipActions.set(c.name, heroMixer.clipAction(c.clip.clone()));
      }
    }
    const idle = heroClipActions.get('Idle_Loop');
    if (idle) {
      idle.play();
      heroActionName = 'Idle_Loop';
    }
  };
  const bank = AnimationLibraryBank.getInstance();
  if (bank.isLoaded()) setupHeroClips();
  else void bank.ensureLoaded().then(setupHeroClips);

  const playHeroClip = (name: string) => {
    if (!heroMixer || heroActionName === name) return;
    const next = heroClipActions.get(name) ?? heroClipActions.get('Idle_Loop');
    if (!next) return;
    const prev = heroClipActions.get(heroActionName);
    if (prev && prev !== next) prev.fadeOut(0.12);
    next.reset().fadeIn(0.12).play();
    heroActionName = name;
  };

  let zone: SandboxZoneId = 'city';
  let dungeonSeed = 101;
  let city: GeneratedStarterCity | null = null;
  let dungeon: GeneratedGreenRuinsFloor1 | null = null;
  let enemies: ActiveEnemyActor[] = [];
  const projectiles: ActiveProjectile[] = [];
  const transientVfxs: ActiveTransientVfx[] = [];
  const lootDrops: DroppedLootItem[] = [];

  let heroHp = 120;
  const heroMaxHp = 120;
  let heroYaw = 0;
  let dodgeTimer = 0;
  let attackTimer = 0;
  let invulnTimer = 0;
  const spellCooldowns = [0, 0, 0, 0];
  let simTime = 0;
  let lastEventText = 'Bem-vindo à Cidade Principal dos Portais!';

  interface FloatingNumberItem {
    el: HTMLElement;
    worldPos: THREE.Vector3;
    velocityY: number;
    offsetX: number;
    age: number;
    duration: number;
  }

  let hitStopTimer = 0;
  let shakeIntensity = 0;
  const shakeOffset = new THREE.Vector3();
  const floatingNumbers: FloatingNumberItem[] = [];
  const MAX_FLOATING_NUMBERS = 24;

  const keysPressed = new Set<string>();

  const addShake = (amount: number) => {
    shakeIntensity = Math.min(0.65, shakeIntensity + amount);
  };

  const triggerHitStop = (sec: number) => {
    hitStopTimer = Math.max(hitStopTimer, Math.min(0.06, sec));
  };

  let elFloatingLayer: HTMLElement | null = null;

  const spawnFloatingText = (
    worldPos: THREE.Vector3,
    text: string,
    kind: 'normal' | 'crit' | 'heal' | 'player_hit' = 'normal'
  ) => {
    if (!elFloatingLayer) return;
    while (floatingNumbers.length >= MAX_FLOATING_NUMBERS) {
      floatingNumbers.shift()?.el.remove();
    }
    const doc = elFloatingLayer.ownerDocument ?? document;
    const el = doc.createElement('span');
    el.className =
      kind === 'crit'
        ? 'sb-float-num is-crit'
        : kind === 'heal'
          ? 'sb-float-num is-heal'
          : kind === 'player_hit'
            ? 'sb-float-num is-player-hit'
            : 'sb-float-num';
    el.textContent = text;
    elFloatingLayer.appendChild(el);

    const item: FloatingNumberItem = {
      el,
      worldPos: worldPos.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.35,
          1.35,
          (Math.random() - 0.5) * 0.35
        )
      ),
      velocityY: kind === 'crit' ? 1.85 : 1.35,
      offsetX: (Math.random() - 0.5) * 14,
      age: 0,
      duration: kind === 'crit' ? 0.92 : 0.72,
    };

    const proj = callbacks.projectWorldToScreen?.(item.worldPos);
    if (proj && proj.visible) {
      el.style.display = 'block';
      el.style.left = `${(proj.x + item.offsetX).toFixed(1)}px`;
      el.style.top = `${proj.y.toFixed(1)}px`;
    } else if (callbacks.projectWorldToScreen) {
      el.style.display = 'none';
    }
    floatingNumbers.push(item);
  };

  const clearDynamicEntities = () => {
    for (const p of projectiles) {
      p.vfx.root.removeFromParent();
      p.vfx.dispose();
    }
    projectiles.length = 0;
    for (const t of transientVfxs) {
      t.vfx.root.removeFromParent();
      t.vfx.dispose();
    }
    transientVfxs.length = 0;
    for (const l of lootDrops) {
      l.mesh.removeFromParent();
      l.mesh.geometry.dispose();
      l.mat.dispose();
    }
    lootDrops.length = 0;
    for (const e of enemies) {
      e.telegraph?.root.removeFromParent();
      e.telegraph?.dispose();
    }
    enemies = [];
    for (const fn of floatingNumbers) {
      fn.el.remove();
    }
    floatingNumbers.length = 0;
    hitStopTimer = 0;
    shakeIntensity = 0;
    shakeOffset.set(0, 0, 0);
  };

  const attachSpellPointLight = (id: NwlSpellVfxId, targetRoot: THREE.Object3D): void => {
    let colorHex: string | null = null;
    let intensity = 2.0;
    let distance = 5.5;
    if (id === 'seta_fogo' || id === 'meteoro' || id === 'impact_spark') {
      colorHex = '#fa6a0a';
      intensity = id === 'meteoro' ? 2.6 : 1.75;
      distance = id === 'meteoro' ? 7.0 : 5.0;
    } else if (
      id === 'barreira' ||
      id === 'egide_refletora' ||
      id === 'nova_arcana' ||
      id === 'corrente_de_raios' ||
      id === 'armadilha_de_gelo' ||
      id === 'prisao_gelo' ||
      id === 'projetil.orbe'
    ) {
      colorHex = '#249fde';
      intensity = 1.8;
      distance = 5.2;
    } else if (id === 'investida' || id === 'grito_de_guerra') {
      colorHex = '#ffd541';
      intensity = 1.5;
      distance = 4.6;
    }
    if (!colorHex) return;
    const pl = new THREE.PointLight(colorHex, intensity, distance, 1.5);
    pl.position.set(0, 0.75, 0);
    targetRoot.add(pl);
  };

  const spawnVfxAt = (id: NwlSpellVfxId, pos: THREE.Vector3, yaw = 0, durationOverride?: number) => {
    const vfx = buildNwlSpellVfx(id, res(), 170);
    attachSpellPointLight(id, vfx.root);
    vfx.root.position.copy(pos);
    vfx.root.rotation.y = yaw;
    root.add(vfx.root);
    transientVfxs.push({
      vfx,
      elapsed: 0,
      duration: durationOverride ?? vfx.meta.durationSec,
    });
  };

  const spawnDropAt = (pos: THREE.Vector3, slot: EquipSlot, rarity: ItemRarity) => {
    const pal = RARITY_COLOR_TABLE[rarity];
    const crystal = new THREE.OctahedronGeometry(0.24, 0);
    crystal.translate(0, 0.32, 0);
    const ring = new THREE.CylinderGeometry(0.32, 0.34, 0.06, 8);
    ring.translate(0, 0.05, 0);
    const geo = mergeColoredParts([
      prepareColoredPart(crystal, pal.primary),
      prepareColoredPart(ring, pal.glow),
    ]);
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 2,
        objectId: 185,
        outlineColor: '#14101c',
        baseColor: '#ffffff',
        emissionColor: pal.glow,
        emissionIntensity: 0.7,
        useColorGrading: true,
      },
      res()
    );
    mat.vertexColors = true;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `Drop_${slot}_${rarity}`;
    mesh.position.copy(pos);
    root.add(mesh);
    lootDrops.push({
      slot,
      rarity,
      mesh,
      mat,
      worldPos: pos.clone(),
      bobSeed: Math.random() * Math.PI * 2,
    });
  };

  const spawnRandomDropNearHero = (forcedRarity?: ItemRarity, forcedSlot?: EquipSlot) => {
    const slot =
      forcedSlot ?? EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)];
    const rarity =
      forcedRarity ?? ITEM_RARITIES[Math.floor(Math.random() * ITEM_RARITIES.length)];
    const angle = Math.random() * Math.PI * 2;
    const p = new THREE.Vector3(
      hero.root.position.x + Math.cos(angle) * 1.4,
      0,
      hero.root.position.z + Math.sin(angle) * 1.4
    );
    spawnDropAt(p, slot, rarity);
    const def = getEquipmentPieceDef(hero.classId, slot, rarity);
    lastEventText = `Item dropado no chão: ${def.displayName}`;
    syncHud();
  };

  const enterZone = (nextZone: SandboxZoneId, newSeed?: number) => {
    clearDynamicEntities();
    if (city) {
      city.root.removeFromParent();
      city.dispose();
      city = null;
    }
    if (dungeon) {
      dungeon.root.removeFromParent();
      dungeon.dispose();
      dungeon = null;
    }

    zone = nextZone;
    if (zone === 'city') {
      city = buildNwlStarterCity(res(), sandboxFinish);
      root.add(city.root);
      hero.root.position.copy(city.playerSpawnPos);
      heroHp = heroMaxHp;
      lastEventText = 'Cidade Principal dos Portais — fale com NPCs ou entre no Portal!';
    } else {
      dungeonSeed = newSeed ?? Math.floor(Math.random() * 9000 + 100);
      dungeon = buildGreenRuinsFloor1(dungeonSeed, res(), sandboxFinish);
      root.add(dungeon.root);
      hero.root.position.copy(dungeon.playerSpawnPos);

      const bankLoaded = AnimationLibraryBank.getInstance();
      const allClips = bankLoaded.isLoaded() ? bankLoaded.getAll() : [];

      enemies = dungeon.enemySpawns.map((sp) => {
        const meta = NWL_MONSTER_SPECS[sp.id];
        let mixer: THREE.AnimationMixer | undefined;
        let idleAction: THREE.AnimationAction | undefined;
        let walkAction: THREE.AnimationAction | undefined;
        let attackAction: THREE.AnimationAction | undefined;
        if (allClips.length > 0) {
          mixer = new THREE.AnimationMixer(sp.monster.root);
          const cIdle = allClips.find((c) => c.name === 'Idle_Loop');
          const cWalk = allClips.find((c) => c.name === 'Walk_Loop' || c.name === 'Jog_Fwd_Loop');
          const cAtk = allClips.find((c) => c.name === 'Sword_Regular_A' || c.name === 'Punch_Cross');
          if (cIdle) {
            idleAction = mixer.clipAction(cIdle.clip.clone());
            idleAction.play();
          }
          if (cWalk) walkAction = mixer.clipAction(cWalk.clip.clone());
          if (cAtk) attackAction = mixer.clipAction(cAtk.clip.clone());
        }
        return {
          spawnId: sp.id,
          namePt: meta.namePt,
          role: meta.role,
          instance: sp.monster,
          hp: meta.maxHp,
          maxHp: meta.maxHp,
          damage: meta.damage,
          moveSpeed: meta.moveSpeed,
          attackRange: meta.attackRangeM,
          windupSec: meta.windupSec,
          isRanged: meta.isRanged,
          dead: false,
          state: 'idle',
          stateTimer: 0,
          mixer,
          idleAction,
          walkAction,
          attackAction,
        };
      });
      lastEventText = `Ruínas Verdes — Andar 1 (Seed ${dungeonSeed}) · 5 Inimigos + Boss Demônio!`;
    }
    callbacks.onZoneOrActorChanged?.();
    syncHud();
  };

  // Combat Execution Helpers
  const hitEnemiesInRadius = (center: THREE.Vector3, radius: number, dmg: number) => {
    const isHeavy = dmg >= 30;
    for (const e of enemies) {
      if (e.dead) continue;
      const dist = e.instance.root.position.distanceTo(center);
      if (dist <= radius) {
        e.hp = Math.max(0, e.hp - dmg);
        spawnVfxAt('impact_spark', e.instance.root.position.clone(), 0, 0.3);
        spawnFloatingText(
          e.instance.root.position,
          isHeavy ? `${Math.round(dmg)}!` : `${Math.round(dmg)}`,
          isHeavy ? 'crit' : 'normal'
        );
        addShake(isHeavy ? 0.24 : 0.12);
        if (isHeavy) triggerHitStop(0.04);

        if (e.hp <= 0) {
          e.dead = true;
          e.telegraph?.root.removeFromParent();
          e.telegraph?.dispose();
          e.telegraph = undefined;
          e.instance.root.rotation.x = -Math.PI * 0.45;
          e.instance.root.position.y = 0.2;
          addShake(e.role === 'boss' ? 0.38 : 0.22);
          triggerHitStop(0.055);
          spawnFloatingText(
            e.instance.root.position.clone().add(new THREE.Vector3(0, 0.35, 0)),
            'KILL!',
            'crit'
          );
          // Guaranteed rarity drop on defeat! Boss drops Epic or Legendary!
          const slot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)];
          const rarity: ItemRarity =
            e.role === 'boss'
              ? Math.random() > 0.4 ? 'legendary' : 'epic'
              : ITEM_RARITIES[Math.min(4, Math.floor(Math.random() * 4) + 1)];
          spawnDropAt(e.instance.root.position.clone().setY(0), slot, rarity);
          lastEventText = `${e.namePt} derrotado! Dropou [${RARITY_COLOR_TABLE[rarity].labelPt}]`;
        }
      }
    }
    if (dungeon) {
      for (const d of dungeon.destructibles) {
        if (!d.broken && d.worldPos.distanceTo(center) <= radius) {
          d.shatter();
          spawnVfxAt('impact_spark', d.worldPos.clone(), 0, 0.25);
          addShake(0.14);
          triggerHitStop(0.025);
          spawnFloatingText(d.worldPos, 'QUEBRADO!', 'normal');
          if (Math.random() > 0.35) {
            const slot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)];
            const rarity = ITEM_RARITIES[Math.floor(Math.random() * 4)];
            spawnDropAt(d.worldPos.clone(), slot, rarity);
          }
        }
      }
    }
  };

  const triggerBasicAttack = () => {
    if (attackTimer > 0) return;
    attackTimer = 0.36;
    const forward = new THREE.Vector3(Math.sin(heroYaw), 0, Math.cos(heroYaw));
    if (hero.classId === 'knight') {
      playHeroClip('Sword_Regular_A');
      const strikeCenter = hero.root.position.clone().addScaledVector(forward, 1.25);
      spawnVfxAt('impact_spark', strikeCenter, heroYaw, 0.25);
      hitEnemiesInRadius(strikeCenter, 2.0, 24);
    } else {
      playHeroClip('Spell_Simple_Shoot');
      const projId: NwlSpellVfxId = hero.classId === 'archer' ? 'projetil.flecha' : 'seta_fogo';
      const vfx = buildNwlSpellVfx(projId, res(), 175);
      attachSpellPointLight(projId, vfx.root);
      vfx.root.position.copy(hero.root.position).add(new THREE.Vector3(0, 1.0, 0));
      vfx.root.rotation.y = heroYaw;
      root.add(vfx.root);
      projectiles.push({
        vfx,
        fromEnemy: false,
        dir: forward,
        speed: 13.5,
        damage: 22,
        lifeSec: 0,
        maxLifeSec: 1.1,
      });
    }
  };

  const triggerSpell = (slotIndex: number) => {
    const spell = CLASS_SPELLS[hero.classId][slotIndex];
    if (!spell || spellCooldowns[slotIndex] > 0) return;
    spellCooldowns[slotIndex] = spell.cooldownSec;
    const forward = new THREE.Vector3(Math.sin(heroYaw), 0, Math.cos(heroYaw));
    playHeroClip('Spell_Simple_Shoot');

    if (spell.isDash) {
      invulnTimer = 0.45;
      const stepPos = hero.root.position.clone().addScaledVector(forward, 2.4);
      if (!dungeon || dungeon.isWalkableWorld(stepPos.x, stepPos.z)) {
        hero.root.position.copy(stepPos);
      }
      spawnVfxAt(spell.vfxId, hero.root.position.clone(), heroYaw);
      hitEnemiesInRadius(hero.root.position, spell.range, spell.damage);
      addShake(0.12);
    } else if (spell.isProjectile) {
      const vfx = buildNwlSpellVfx(spell.vfxId, res(), 176);
      attachSpellPointLight(spell.vfxId, vfx.root);
      vfx.root.position.copy(hero.root.position).add(new THREE.Vector3(0, 1.0, 0));
      vfx.root.rotation.y = heroYaw;
      root.add(vfx.root);
      projectiles.push({
        vfx,
        fromEnemy: false,
        dir: forward,
        speed: 14.5,
        damage: spell.damage,
        lifeSec: 0,
        maxLifeSec: 1.2,
      });
    } else {
      const targetPos =
        spell.vfxId === 'meteoro'
          ? hero.root.position.clone().addScaledVector(forward, 3.2)
          : hero.root.position.clone();
      spawnVfxAt(spell.vfxId, targetPos, heroYaw);
      addShake(spell.vfxId === 'meteoro' ? 0.34 : 0.16);
      hitEnemiesInRadius(targetPos, spell.range, spell.damage);
    }
    lastEventText = `Magia lançada: ${spell.labelPt}!`;
    syncSpellCooldownUi();
    syncHud();
  };

  const triggerDodge = () => {
    if (dodgeTimer > 0) return;
    dodgeTimer = 0.43; // NWL spec §3: 0.43s invulnerability
    invulnTimer = 0.45;
    playHeroClip('Roll');
  };

  const interactNearest = () => {
    // Pick up any nearby drop first
    for (let i = lootDrops.length - 1; i >= 0; i--) {
      const d = lootDrops[i];
      if (d.worldPos.distanceTo(hero.root.position) < 1.8) {
        const def = hero.equipSlot(d.slot, d.rarity);
        d.mesh.removeFromParent();
        d.mesh.geometry.dispose();
        d.mat.dispose();
        lootDrops.splice(i, 1);
        spawnFloatingText(hero.root.position, `+${def.slot.toUpperCase()}`, 'heal');
        lastEventText = `Equipado: ${def.displayName}`;
        syncHud();
        return;
      }
    }
    if (zone === 'city' && city) {
      const resCity = city.update(simTime, hero.root.position);
      if (resCity.inPortal) {
        enterZone('dungeon');
        return;
      }
      if (resCity.nearNpc) {
        lastEventText = `${resCity.nearNpc.instance.spec.namePt}: "${resCity.nearNpc.instance.spec.rolePt}"`;
        syncHud();
      }
    } else if (zone === 'dungeon' && dungeon) {
      if (hero.root.position.distanceTo(dungeon.returnPortalPos) < 2.1) {
        enterZone('city');
        return;
      }
      if (hero.root.position.distanceTo(dungeon.chestPos) < 2.2) {
        spawnRandomDropNearHero('epic');
        return;
      }
      if (hero.root.position.distanceTo(dungeon.altarPos) < 2.2) {
        const healed = Math.max(0, heroMaxHp - heroHp);
        heroHp = heroMaxHp;
        spawnFloatingText(
          hero.root.position,
          healed > 0 ? `+${Math.round(healed)} HP` : 'HP FULL',
          'heal'
        );
        lastEventText = 'Altar Sagrado ativado: HP restaurado ao máximo!';
        syncHud();
        return;
      }
      if (hero.root.position.distanceTo(dungeon.exitStairsPos) < 2.2) {
        enterZone('dungeon', dungeonSeed + 1);
      }
    }
  };

  // Build Sandbox Overlay HUD inside stageContainer
  const hudDoc = stageContainer.ownerDocument ?? document;
  const hudElement = hudDoc.createElement('div');
  hudElement.className = 'nwl-sandbox-hud';
  hudElement.innerHTML = `
    <div class="sb-floating-layer" id="sb-floating-layer"></div>
    <div class="sb-top-bar">
      <div class="sb-status-pill">
        <strong id="sb-zone-title">Cidade Principal dos Portais</strong>
        <span id="sb-hp-text">HP 120/120</span>
        <span id="sb-boss-badge" style="display:none;color:#fa6a0a;"></span>
      </div>
      <div class="sb-actions">
        <select id="sb-class-sel" class="select-ctrl select-ctrl-sm" title="Trocar Classe">
          <option value="knight">Cavaleiro</option>
          <option value="archer">Arqueiro</option>
          <option value="mage">Mago</option>
        </select>
        <select id="sb-rarity-set" class="select-ctrl select-ctrl-sm" title="Equipar Set Completo">
          <option value="normal">Set: Normal</option>
          <option value="common">Set: Comum (Verde)</option>
          <option value="rare">Set: Raro (Azul)</option>
          <option value="epic">Set: Épico (Roxo)</option>
          <option value="legendary">Set: Lendário (Laranja)</option>
        </select>
        <button id="sb-btn-drop" class="btn btn-sm" type="button" title="Dropar item aleatório no chão">Testar Drop</button>
        <button id="sb-btn-portal" class="btn btn-sm btn-primary" type="button">Ir p/ Ruínas 1</button>
        <button id="sb-btn-exit" class="btn btn-sm" type="button">Sair Sandbox</button>
      </div>
    </div>

    <div id="sb-event-banner" class="sb-event-banner">Bem-vindo à Cidade Principal dos Portais!</div>

    <div class="sb-bottom-bar">
      <div class="sb-spell-row" id="sb-spell-row"></div>
      <div class="sb-controls-hint">
        <span><strong>WASD</strong> Mover</span>
        <span><strong>Espaço</strong> Atacar</span>
        <span><strong>Shift</strong> Esquiva</span>
        <span><strong>1–4</strong> Magias</span>
        <span><strong>E</strong> Portal / Loot / NPC</span>
      </div>
    </div>
  `;
  stageContainer.appendChild(hudElement);

  elFloatingLayer = hudElement.querySelector<HTMLElement>('#sb-floating-layer');
  const elZone = hudElement.querySelector<HTMLElement>('#sb-zone-title')!;
  const elHp = hudElement.querySelector<HTMLElement>('#sb-hp-text')!;
  const elBoss = hudElement.querySelector<HTMLElement>('#sb-boss-badge')!;
  const elBanner = hudElement.querySelector<HTMLElement>('#sb-event-banner')!;
  const elSpellRow = hudElement.querySelector<HTMLElement>('#sb-spell-row')!;
  const selClass = hudElement.querySelector<HTMLSelectElement>('#sb-class-sel')!;
  const selRaritySet = hudElement.querySelector<HTMLSelectElement>('#sb-rarity-set')!;
  const btnPortal = hudElement.querySelector<HTMLButtonElement>('#sb-btn-portal')!;

  function syncSpellCooldownUi(): void {
    const list = CLASS_SPELLS[hero.classId];
    const btns = elSpellRow.querySelectorAll<HTMLButtonElement>('.sb-spell-btn');
    btns.forEach((btn, i) => {
      const sp = list[i];
      const rem = spellCooldowns[i] ?? 0;
      const onCd = rem > 0.01 && Boolean(sp && sp.cooldownSec > 0);
      btn.classList.toggle('is-on-cooldown', onCd);
      const tag = btn.querySelector<HTMLElement>('.sb-cd-tag');
      if (onCd && sp) {
        const pct = Math.min(100, Math.max(0, (rem / sp.cooldownSec) * 100));
        btn.style.setProperty('--cd-pct', `${pct.toFixed(1)}%`);
        if (tag) {
          tag.style.display = 'inline';
          tag.textContent = `${rem.toFixed(1)}s`;
        }
      } else {
        btn.style.removeProperty('--cd-pct');
        if (tag) {
          tag.style.display = 'none';
          tag.textContent = '';
        }
      }
    });
  }

  const renderSpellBar = () => {
    const list = CLASS_SPELLS[hero.classId];
    elSpellRow.innerHTML = list
      .map(
        (sp, idx) =>
          `<button class="sb-spell-btn" data-sp="${idx}" type="button" style="border-color:${sp.cooldownSec > 0 ? RARITY_COLOR_TABLE[hero.loadout.weapon].glow : '#323a4a'}"><b>[${sp.key}]</b> ${sp.labelPt}<span class="sb-cd-tag" style="display:none;"></span></button>`
      )
      .join('');
    elSpellRow.querySelectorAll<HTMLButtonElement>('.sb-spell-btn').forEach((btn) => {
      btn.addEventListener('click', () => triggerSpell(Number(btn.dataset.sp) || 0));
    });
    syncSpellCooldownUi();
  };

  function syncHud(): void {
    elZone.textContent =
      zone === 'city' ? 'Cidade Principal dos Portais' : `Ruínas Verdes · Andar 1 (#${dungeonSeed})`;
    elHp.textContent = `HP ${Math.ceil(heroHp)}/${heroMaxHp}`;
    btnPortal.textContent = zone === 'city' ? 'Ir p/ Ruínas 1' : 'Voltar Cidade';
    elBanner.textContent = lastEventText;

    const boss = enemies.find((e) => e.role === 'boss');
    if (zone === 'dungeon' && boss) {
      elBoss.style.display = 'inline';
      elBoss.textContent = boss.dead
        ? 'Boss Demônio: DERROTADO'
        : `Boss Demônio: ${Math.ceil(boss.hp)}/${boss.maxHp}`;
    } else {
      elBoss.style.display = 'none';
    }
  }

  selClass.addEventListener('change', () => {
    hero.setClass(selClass.value as PlayerClassId);
    renderSpellBar();
    lastEventText = `Classe alterada para ${selClass.selectedOptions?.[0]?.text ?? selClass.value}`;
    callbacks.onZoneOrActorChanged?.();
    syncHud();
  });

  selRaritySet.addEventListener('change', () => {
    const r = selRaritySet.value as ItemRarity;
    hero.equipFullRaritySet(r);
    lastEventText = `Set completo equipado: ${RARITY_COLOR_TABLE[r].labelPt}`;
    syncHud();
  });

  hudElement.querySelector('#sb-btn-drop')!.addEventListener('click', () => spawnRandomDropNearHero());
  btnPortal.addEventListener('click', () => enterZone(zone === 'city' ? 'dungeon' : 'city'));
  hudElement.querySelector('#sb-btn-exit')!.addEventListener('click', () => callbacks.onExitSandbox());

  const onKeyDown = (e: KeyboardEvent) => {
    const targetTag = (e.target as { tagName?: string } | null)?.tagName;
    if (targetTag === 'INPUT' || targetTag === 'SELECT') return;
    const k = e.key.toLowerCase();
    keysPressed.add(k);
    if (k === ' ') {
      e.preventDefault?.();
      triggerBasicAttack();
    } else if (k === 'shift') {
      triggerDodge();
    } else if (k === '1' || k === '2' || k === '3' || k === '4') {
      triggerSpell(Number(k) - 1);
    } else if (k === 'e') {
      interactNearest();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    keysPressed.delete(e.key.toLowerCase());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  renderSpellBar();
  enterZone('city');

  const update = (dt: number) => {
    const clampedDt = Math.min(0.05, Math.max(0.001, dt));

    if (shakeIntensity > 0.0001) {
      const t = simTime * 55 + hitStopTimer * 80;
      shakeOffset.set(
        Math.sin(t * 1.7) * shakeIntensity * 0.35,
        Math.cos(t * 2.3) * shakeIntensity * 0.28,
        Math.sin(t * 1.3 + 1.1) * shakeIntensity * 0.35
      );
      shakeIntensity = Math.max(0, shakeIntensity - clampedDt * 2.6);
    } else {
      shakeIntensity = 0;
      shakeOffset.set(0, 0, 0);
    }

    for (let i = floatingNumbers.length - 1; i >= 0; i--) {
      const fn = floatingNumbers[i];
      fn.age += clampedDt;
      fn.worldPos.y += fn.velocityY * clampedDt;
      fn.velocityY = Math.max(0.2, fn.velocityY - clampedDt * 1.4);
      if (fn.age >= fn.duration) {
        fn.el.remove();
        floatingNumbers.splice(i, 1);
        continue;
      }
      const alpha =
        fn.age > fn.duration * 0.65
          ? 1 - (fn.age - fn.duration * 0.65) / (fn.duration * 0.35)
          : 1;
      fn.el.style.opacity = alpha.toFixed(2);
      const proj = callbacks.projectWorldToScreen?.(fn.worldPos);
      if (proj && proj.visible) {
        fn.el.style.display = 'block';
        fn.el.style.left = `${(proj.x + fn.offsetX).toFixed(1)}px`;
        fn.el.style.top = `${proj.y.toFixed(1)}px`;
      } else if (callbacks.projectWorldToScreen) {
        fn.el.style.display = 'none';
      }
    }
    syncSpellCooldownUi();

    if (hitStopTimer > 0) {
      hitStopTimer = Math.max(0, hitStopTimer - clampedDt);
      return;
    }

    simTime += clampedDt;
    if (dodgeTimer > 0) dodgeTimer = Math.max(0, dodgeTimer - clampedDt);
    if (attackTimer > 0) attackTimer = Math.max(0, attackTimer - clampedDt);
    if (invulnTimer > 0) invulnTimer = Math.max(0, invulnTimer - clampedDt);
    for (let i = 0; i < 4; i++) {
      if (spellCooldowns[i] > 0) spellCooldowns[i] = Math.max(0, spellCooldowns[i] - clampedDt);
    }

    // Isometric screen-aligned movement vector (camera at +X, +Z looking toward origin)
    // Screen Up (-X,-Z), Screen Right (+X,-Z)
    let inUp = 0;
    let inRight = 0;
    if (keysPressed.has('w') || keysPressed.has('arrowup')) inUp += 1;
    if (keysPressed.has('s') || keysPressed.has('arrowdown')) inUp -= 1;
    if (keysPressed.has('d') || keysPressed.has('arrowright')) inRight += 1;
    if (keysPressed.has('a') || keysPressed.has('arrowleft')) inRight -= 1;

    const moveVec = new THREE.Vector3();
    if (inUp !== 0 || inRight !== 0) {
      // screenUp = (-1, 0, -1), screenRight = (1, 0, -1)
      moveVec.set(inRight - inUp, 0, -inRight - inUp).normalize();
      heroYaw = Math.atan2(moveVec.x, moveVec.z);
    } else if (dodgeTimer > 0) {
      moveVec.set(Math.sin(heroYaw), 0, Math.cos(heroYaw));
    }

    const speed = dodgeTimer > 0 ? 8.2 : 4.6;
    if (moveVec.lengthSq() > 0.001) {
      const nextX = hero.root.position.x + moveVec.x * speed * clampedDt;
      const nextZ = hero.root.position.z + moveVec.z * speed * clampedDt;
      if (zone === 'city' && city) {
        const clampedX = Math.max(-11.2, Math.min(11.2, nextX));
        const clampedZ = Math.max(-11.5, Math.min(11.2, nextZ));
        const blocked = city.colliders.some(
          (c) =>
            clampedX > c.minX - 0.35 &&
            clampedX < c.maxX + 0.35 &&
            clampedZ > c.minZ - 0.35 &&
            clampedZ < c.maxZ + 0.35
        );
        if (!blocked) hero.root.position.set(clampedX, 0, clampedZ);
      } else if (zone === 'dungeon' && dungeon) {
        if (dungeon.isWalkableWorld(nextX, hero.root.position.z)) hero.root.position.x = nextX;
        if (dungeon.isWalkableWorld(hero.root.position.x, nextZ)) hero.root.position.z = nextZ;
      }
      if (attackTimer <= 0 && dodgeTimer <= 0) playHeroClip('Jog_Fwd_Loop');
    } else if (attackTimer <= 0 && dodgeTimer <= 0) {
      playHeroClip('Idle_Loop');
    }

    hero.root.rotation.y = heroYaw;
    heroMixer?.update(clampedDt);

    // City update (house capa auto-hide, chest auto-open, portal check)
    if (zone === 'city' && city) {
      const resCity = city.update(simTime, hero.root.position);
      if (resCity.inPortal) {
        enterZone('dungeon');
        return;
      }
    }

    // Auto pickup loot when stepping close
    for (let i = lootDrops.length - 1; i >= 0; i--) {
      const d = lootDrops[i];
      d.mesh.rotation.y = simTime * 2.0 + d.bobSeed;
      d.mesh.position.y = Math.sin(simTime * 3.5 + d.bobSeed) * 0.08;
      if (d.worldPos.distanceTo(hero.root.position) < 0.95) {
        const def = hero.equipSlot(d.slot, d.rarity);
        d.mesh.removeFromParent();
        d.mesh.geometry.dispose();
        d.mat.dispose();
        lootDrops.splice(i, 1);
        spawnFloatingText(hero.root.position, `+${def.slot.toUpperCase()}`, 'heal');
        lastEventText = `Equipado automaticamente: ${def.displayName}`;
        syncHud();
      }
    }

    // Dungeon AI, Traps, Boss
    if (zone === 'dungeon' && dungeon) {
      dungeon.update(simTime);

      for (const e of enemies) {
        if (e.dead) continue;
        e.mixer?.update(clampedDt);
        const ePos = e.instance.root.position;
        const toHero = hero.root.position.clone().sub(ePos);
        const dist = toHero.length();

        if (e.state === 'idle' && dist < 9.5) {
          e.state = 'chase';
        }

        if (e.state === 'chase') {
          if (dist > 0.01) e.instance.root.rotation.y = Math.atan2(toHero.x, toHero.z);
          if (dist <= e.attackRange) {
            e.state = 'windup';
            e.stateTimer = e.windupSec;
            if (!e.isRanged) {
              const tele = buildNwlSpellVfx('telegraph_circle', res(), 178);
              tele.root.position.copy(ePos);
              root.add(tele.root);
              e.telegraph = tele;
            }
          } else {
            const step = toHero.normalize().multiplyScalar(e.moveSpeed * clampedDt);
            const nx = ePos.x + step.x;
            const nz = ePos.z + step.z;
            if (dungeon.isWalkableWorld(nx, nz)) ePos.set(nx, 0, nz);
            if (e.walkAction && !e.walkAction.isRunning()) {
              e.idleAction?.stop();
              e.walkAction.play();
            }
          }
        } else if (e.state === 'windup') {
          e.stateTimer -= clampedDt;
          if (e.stateTimer <= 0) {
            e.telegraph?.root.removeFromParent();
            e.telegraph?.dispose();
            e.telegraph = undefined;
            if (e.attackAction) {
              e.attackAction.reset().setLoop(THREE.LoopOnce, 1).play();
            }
            if (e.isRanged) {
              const pId: NwlSpellVfxId =
                e.spawnId === 'orcs.goblin_02' ? 'projetil.orbe' : 'projetil.flecha';
              const vfx = buildNwlSpellVfx(pId, res(), 179);
              attachSpellPointLight(pId, vfx.root);
              vfx.root.position.copy(ePos).add(new THREE.Vector3(0, 0.9, 0));
              const dir = toHero.clone().setY(0).normalize();
              vfx.root.rotation.y = Math.atan2(dir.x, dir.z);
              root.add(vfx.root);
              projectiles.push({
                vfx,
                fromEnemy: true,
                dir,
                speed: 8.0,
                damage: e.damage,
                lifeSec: 0,
                maxLifeSec: 1.5,
              });
            } else if (dist <= e.attackRange + 0.6 && invulnTimer <= 0) {
              heroHp = Math.max(0, heroHp - e.damage);
              invulnTimer = 0.5;
              spawnVfxAt('impact_spark', hero.root.position.clone(), 0, 0.25);
              addShake(0.28);
              triggerHitStop(0.045);
              spawnFloatingText(hero.root.position, `-${Math.round(e.damage)}`, 'player_hit');
              if (heroHp <= 0) {
                lastEventText = 'Você caiu nas Ruínas! Retornando à Cidade...';
                enterZone('city');
                return;
              }
            }
            e.state = 'cooldown';
            e.stateTimer = 0.9;
          }
        } else if (e.state === 'cooldown') {
          e.stateTimer -= clampedDt;
          if (e.stateTimer <= 0) e.state = 'chase';
        }
      }
      syncHud();
    }

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.lifeSec += clampedDt;
      p.vfx.root.position.addScaledVector(p.dir, p.speed * clampedDt);
      p.vfx.updatePhase(p.lifeSec / p.maxLifeSec);

      let hit = p.lifeSec >= p.maxLifeSec;
      if (p.fromEnemy) {
        if (p.vfx.root.position.distanceTo(hero.root.position.clone().setY(1.0)) < 0.75 && invulnTimer <= 0) {
          heroHp = Math.max(0, heroHp - p.damage);
          invulnTimer = 0.5;
          spawnVfxAt('impact_spark', hero.root.position.clone(), 0, 0.25);
          addShake(0.24);
          triggerHitStop(0.04);
          spawnFloatingText(hero.root.position, `-${Math.round(p.damage)}`, 'player_hit');
          hit = true;
          if (heroHp <= 0) {
            enterZone('city');
            return;
          }
        }
      } else {
        for (const e of enemies) {
          if (e.dead) continue;
          const targetCenter = e.instance.root.position.clone().setY(0.9);
          if (p.vfx.root.position.distanceTo(targetCenter) < (e.role === 'boss' ? 1.25 : 0.78)) {
            hitEnemiesInRadius(e.instance.root.position, 0.9, p.damage);
            hit = true;
            break;
          }
        }
      }
      if (hit) {
        p.vfx.root.removeFromParent();
        p.vfx.dispose();
        projectiles.splice(i, 1);
      }
    }

    // Update transient VFX
    for (let i = transientVfxs.length - 1; i >= 0; i--) {
      const t = transientVfxs[i];
      t.elapsed += clampedDt;
      t.vfx.updatePhase(t.elapsed / t.duration);
      if (t.elapsed >= t.duration) {
        t.vfx.root.removeFromParent();
        t.vfx.dispose();
        transientVfxs.splice(i, 1);
      }
    }
  };

  return {
    root,
    hudElement,
    enterZone,
    setClass: (cls) => {
      selClass.value = cls;
      hero.setClass(cls);
      renderSpellBar();
      callbacks.onZoneOrActorChanged?.();
      syncHud();
    },
    equipSlotRarity: (slot, rarity) => {
      hero.equipSlot(slot, rarity);
      syncHud();
    },
    equipAllRarity: (rarity) => {
      selRaritySet.value = rarity;
      hero.equipFullRaritySet(rarity);
      syncHud();
    },
    spawnRandomDropNearHero,
    update,
    getState: () => {
      const boss = enemies.find((e) => e.role === 'boss');
      return {
        zone,
        classId: hero.classId,
        hp: heroHp,
        maxHp: heroMaxHp,
        seed: dungeonSeed,
        enemiesAlive: enemies.filter((e) => !e.dead).length,
        bossHp: boss ? boss.hp : null,
        bossMaxHp: boss ? boss.maxHp : null,
        lastEventText,
      };
    },
    getCameraTarget: () => hero.root.position.clone().add(new THREE.Vector3(0, 1.0, 0)),
    getCameraShakeOffset: () => shakeOffset.clone(),
    getCombatJuiceState: () => ({
      hitStopRemaining: hitStopTimer,
      shakeIntensity,
      activeFloatingCount: floatingNumbers.length,
      spellCooldowns: [...spellCooldowns],
    }),
    dispose: () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      }
      hudElement.remove();
      clearDynamicEntities();
      city?.dispose();
      dungeon?.dispose();
      hero.dispose();
    },
  };
}
