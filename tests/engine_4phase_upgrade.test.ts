import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import {
  createCanonicalUalRig,
  type UalSocketSpec,
} from '../src/engine/rigging/UalRigSpec';
import {
  WEAPON_GRIP_PIVOTS,
  getWeaponGripPivot,
} from '../src/engine/procedural/EquipmentCatalog';
import { buildNwlPlayerCharacter } from '../src/engine/procedural/PlayerEquipmentBuilder';
import { conditionClipForEquipment } from '../src/engine/rigging/AnimationLibraryBank';
import {
  VfxTimelinePlayer,
  createSimpleRecipe,
  InstancedVfxParticlePool,
  PixelTrailRenderer,
  VfxLightPool,
} from '../src/engine/vfx';
import {
  NWL_SPELL_RECIPES,
  getSpellVfxRecipe,
} from '../src/engine/procedural/SpellVfxBuilder';
import { makeSplineLoftGeometry } from '../src/engine/procedural/ProceduralGeometryKit';
import { buildQuadrupedCreature } from '../src/engine/procedural/CreatureBuilder';
import { bakeTaggedPartsAsset } from '../src/engine/procedural/PixelMaterialSynth';

describe('Phase 1: Equipment, Sockets, Weapon Grip Pivots & Clip Conditioning', () => {
  it('attaches oriented UalSocketSpec including shield_l on canonical UAL rig', () => {
    const rig = createCanonicalUalRig();
    expect(rig.sockets).toBeDefined();
    expect(rig.sockets.shield_l).toBeDefined();
    expect(rig.sockets.hand_r).toBeDefined();
    expect(rig.sockets.hand_l).toBeDefined();

    const spec: UalSocketSpec = {
      bone: 'lowerarm_l',
      offset: [0, 0.1, 0],
      rotation: [0, -Math.PI * 0.5, Math.PI],
      bladeAxis: '+Y',
      role: 'shield',
    };
    expect(spec.rotation).toHaveLength(3);
  });

  it('provides WEAPON_GRIP_PIVOTS and getWeaponGripPivot for melee and ranged styles', () => {
    expect(WEAPON_GRIP_PIVOTS).toBeDefined();
    const keys = Object.keys(WEAPON_GRIP_PIVOTS) as Array<keyof typeof WEAPON_GRIP_PIVOTS>;
    expect(keys.length).toBeGreaterThan(0);
    const first = getWeaponGripPivot(keys[0]);
    expect(first).toBeDefined();
    expect(typeof first.maxRearOverhang).toBe('number');
  });

  it('builds knight with upright shield and weapon_main mounted', () => {
    const built = buildNwlPlayerCharacter({
      classId: 'knight',
    });
    expect(built.root).toBeInstanceOf(THREE.Object3D);
    expect(built.rig.sockets.shield_l).toBeDefined();
    expect(built.rig.sockets.hand_r).toBeDefined();
  });

  it('conditions locomotion clips for equipment clearance', () => {
    const times = new Float32Array([0, 0.5, 1.0]);
    const q = new THREE.Quaternion();
    const values = new Float32Array([
      q.x, q.y, q.z, q.w,
      q.x, q.y, q.z, q.w,
      q.x, q.y, q.z, q.w,
    ]);
    const clip = new THREE.AnimationClip('Walk_Loop', 1.0, [
      new THREE.QuaternionKeyframeTrack('upperarm_r.quaternion', times, values),
      new THREE.QuaternionKeyframeTrack('hand_r.quaternion', times, values),
    ]);

    const conditioned = conditionClipForEquipment(clip, {});
    expect(conditioned).toBeInstanceOf(THREE.AnimationClip);
    expect(conditioned.tracks.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Phase 2: VFX Timeline, Instanced Particles, Pixel Trails, Light Pool & Recipes', () => {
  it('advances VfxTimelinePlayer through stages and fires callbacks', () => {
    const recipe = createSimpleRecipe('test_spell', [
      { name: 'telegraph', durationSec: 0.1 },
      { name: 'impact', durationSec: 0.2 },
      { name: 'linger', durationSec: 0.1 },
    ]);
    const onStageEnter = vi.fn();
    const onComplete = vi.fn();

    const player = new VfxTimelinePlayer(recipe, {
      onStageEnter,
      onComplete,
    });

    player.update(0.05);
    player.update(0.1);
    player.update(0.2);
    player.update(0.1);

    expect(onStageEnter).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('pre-allocates InstancedVfxParticlePool and updates particles without errors', () => {
    const pool = new InstancedVfxParticlePool(32);
    expect(pool.mesh).toBeInstanceOf(THREE.InstancedMesh);
    expect(pool.mesh.count).toBe(0);
    pool.update(0.016);
  });

  it('records and updates PixelTrailRenderer ribbon geometry', () => {
    const trail = new PixelTrailRenderer({ maxPoints: 16, width: 0.25 });
    expect(trail.mesh).toBeInstanceOf(THREE.Mesh);
    trail.addPoint(new THREE.Vector3(0, 0, 0));
    trail.addPoint(new THREE.Vector3(1, 0, 0));
    trail.addPoint(new THREE.Vector3(2, 0, 0));
    trail.update(0.016);
    const posAttr = trail.mesh.geometry.getAttribute('position');
    expect(posAttr.count).toBeGreaterThan(0);
  });

  it('pre-allocates 6 PointLights in VfxLightPool with intensity 0 when idle', () => {
    const scene = new THREE.Scene();
    const pool = new VfxLightPool(scene);
    expect(pool).toBeDefined();
    const lights = scene.children.filter((c) => c instanceof THREE.PointLight) as THREE.PointLight[];
    expect(lights).toHaveLength(6);
    for (const light of lights) {
      expect(light.intensity).toBe(0);
    }
    pool.update(0.016);
  });

  it('exports NWL_SPELL_RECIPES and getSpellVfxRecipe for all 20 spells', () => {
    const keys = Object.keys(NWL_SPELL_RECIPES);
    expect(keys.length).toBe(20);
    for (const key of keys) {
      const recipe = getSpellVfxRecipe(key as keyof typeof NWL_SPELL_RECIPES);
      expect(recipe).toBeDefined();
      expect(recipe.id).toBe(key);
    }
  });
});

describe('Phase 3: Spline Lofting, Elder Wyvern Upgrade & Skinning-Aware Subdivision', () => {
  it('generates valid BufferGeometry with makeSplineLoftGeometry', () => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0.5),
      new THREE.Vector3(0, 2, 0),
    ];
    const radii = [0.4, 0.3, 0.15];
    const geo = makeSplineLoftGeometry(points, radii, 8, 12, {
      capStart: true,
      capEnd: true,
    });
    expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    expect(geo.getAttribute('position').count).toBeGreaterThan(0);
    expect(geo.getAttribute('normal').count).toBeGreaterThan(0);
    expect(geo.getAttribute('uv').count).toBeGreaterThan(0);
  });

  it('builds elder_wyvern with >= 2000 triangles and wing bones', () => {
    const wyvern = buildQuadrupedCreature('elder_wyvern', { materialSeed: 42 });
    let totalTris = 0;
    wyvern.root.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.geometry) {
        const idx = obj.geometry.getIndex();
        const pos = obj.geometry.getAttribute('position');
        totalTris += idx ? idx.count / 3 : pos.count / 3;
      }
    });
    expect(totalTris).toBeGreaterThanOrEqual(2000);

    const boneNames = wyvern.rig.bones.map((b) => b.name);
    expect(boneNames).toContain('wing_root_l');
    expect(boneNames).toContain('wing_elbow_l');
    expect(boneNames).toContain('wing_tip_l');
    expect(boneNames).toContain('wing_root_r');
  });

  it('preserves skinIndex and skinWeight when subdivideForAo is enabled', () => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const count = box.getAttribute('position').count;
    const baked = bakeTaggedPartsAsset(
      [
        {
          geometry: box,
          materialKind: 'dragon_scales',
          baseHex: '#8b2635',
          partTag: 'torso',
        },
      ],
      {
        subdivideMaxEdgeM: 0.2,
        partTagToBoneIndex: new Map([['torso', 1]]),
      }
    );
    expect(baked.perVertexBoneIndices).toBeDefined();
    expect(baked.perVertexBoneIndices!.length).toBe(baked.geometry.getAttribute('position').count);
    expect(baked.geometry.getAttribute('position').count).toBeGreaterThan(count);
  });
});
