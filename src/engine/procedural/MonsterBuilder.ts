import * as THREE from 'three';
import {
  type PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import {
  attachRigidPartsToUalRig,
  type RigidPartSpec,
} from '../rigging/AutoRigBinder';
import {
  createCanonicalUalRig,
  type CanonicalUalRig,
} from '../rigging/UalRigSpec';
import {
  makeBoneSegmentBox,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';

export type NwlMonsterId =
  | 'orcs.goblin_01'
  | 'orcs.goblin_03'
  | 'orcs.goblin_06'
  | 'orcs.goblin_02'
  | 'orcs.orc_04'
  | 'demons.boss_demon';

export const NWL_MONSTER_IDS: readonly NwlMonsterId[] = [
  'orcs.goblin_01',
  'orcs.goblin_03',
  'orcs.goblin_06',
  'orcs.goblin_02',
  'orcs.orc_04',
  'demons.boss_demon',
];

export interface MonsterSpecMeta {
  id: NwlMonsterId;
  namePt: string;
  role: 'common' | 'ranged' | 'heavy' | 'boss';
  targetHeightM: number;
  targetHeightPx: number;
  maxHp: number;
  damage: number;
  moveSpeed: number;
  windupSec: number;
  attackRangeM: number;
  isRanged: boolean;
  skinColor: string;
  armorColor: string;
  trimColor: string;
  accentColor: string;
  bulk: number;
}

export const NWL_MONSTER_SPECS: Record<NwlMonsterId, MonsterSpecMeta> = {
  'orcs.goblin_01': {
    id: 'orcs.goblin_01',
    namePt: 'Goblin Batedor',
    role: 'common',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 45,
    damage: 9,
    moveSpeed: 3.1,
    windupSec: 0.42,
    attackRangeM: 1.5,
    isRanged: false,
    skinColor: '#1a7a3e',
    armorColor: '#3b1725',
    trimColor: '#6d758d',
    accentColor: '#df3e23',
    bulk: 0.88,
  },
  'orcs.goblin_03': {
    id: 'orcs.goblin_03',
    namePt: 'Goblin Arqueiro',
    role: 'ranged',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 38,
    damage: 11,
    moveSpeed: 2.5,
    windupSec: 0.48,
    attackRangeM: 7.5,
    isRanged: true,
    skinColor: '#1a7a3e',
    armorColor: '#24523b',
    trimColor: '#3b1725',
    accentColor: '#f9a31b',
    bulk: 0.85,
  },
  'orcs.goblin_06': {
    id: 'orcs.goblin_06',
    namePt: 'Goblin Escudeiro',
    role: 'common',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 68,
    damage: 10,
    moveSpeed: 2.3,
    windupSec: 0.45,
    attackRangeM: 1.6,
    isRanged: false,
    skinColor: '#24523b',
    armorColor: '#6d758d',
    trimColor: '#b3b9d1',
    accentColor: '#285cc4',
    bulk: 0.96,
  },
  'orcs.goblin_02': {
    id: 'orcs.goblin_02',
    namePt: 'Goblin Xamã',
    role: 'ranged',
    targetHeightM: 1.35,
    targetHeightPx: 82,
    maxHp: 42,
    damage: 14,
    moveSpeed: 2.2,
    windupSec: 0.55,
    attackRangeM: 8.0,
    isRanged: true,
    skinColor: '#1a7a3e',
    armorColor: '#4a3052',
    trimColor: '#dae0ea',
    accentColor: '#249fde',
    bulk: 0.9,
  },
  'orcs.orc_04': {
    id: 'orcs.orc_04',
    namePt: 'Orc Bruto',
    role: 'heavy',
    targetHeightM: 2.10,
    targetHeightPx: 125,
    maxHp: 135,
    damage: 22,
    moveSpeed: 2.0,
    windupSec: 0.65,
    attackRangeM: 2.2,
    isRanged: false,
    skinColor: '#24523b',
    armorColor: '#73172d',
    trimColor: '#6d758d',
    accentColor: '#f9a31b',
    bulk: 1.24,
  },
  'demons.boss_demon': {
    id: 'demons.boss_demon',
    namePt: 'Lorde Demônio (Boss)',
    role: 'boss',
    targetHeightM: 2.95,
    targetHeightPx: 177,
    maxHp: 380,
    damage: 34,
    moveSpeed: 2.35,
    windupSec: 0.72,
    attackRangeM: 3.1,
    isRanged: false,
    skinColor: '#73172d',
    armorColor: '#141013',
    trimColor: '#b4202a',
    accentColor: '#fa6a0a',
    bulk: 1.32,
  },
};

export interface GeneratedMonsterResult {
  id: NwlMonsterId;
  spec: MonsterSpecMeta;
  rig: CanonicalUalRig;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
}

function getBoneSpanY(rig: CanonicalUalRig, boneName: string, fallback: number): number {
  const b = rig.boneByName.get(boneName);
  if (!b) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) return ch.position.y;
  }
  return fallback;
}

export function buildNwlMonster(
  id: NwlMonsterId,
  options: { pixelSize?: number; objectId?: number } = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedMonsterResult {
  const spec = NWL_MONSTER_SPECS[id];
  const rigScale = spec.targetHeightM / 1.829;
  const px = options.pixelSize ?? 3;
  const objId = options.objectId ?? 85;
  const bulk = spec.bulk;

  const rig = createCanonicalUalRig('male', rigScale);
  const pelvisLen = getBoneSpanY(rig, 'pelvis', 0.138);
  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const neckLen = getBoneSpanY(rig, 'neck_01', 0.083);
  const uArm = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lArm = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const thigh = getBoneSpanY(rig, 'thigh_l', 0.40);
  const calf = getBoneSpanY(rig, 'calf_l', 0.43);

  const partSpecs: RigidPartSpec[] = [
    {
      name: 'Monster_Pelvis',
      boneName: 'pelvis',
      geometry: mergeColoredParts([
        makeBoneSegmentBox(pelvisLen * 1.15, 0.155 * bulk, 0.11 * bulk, 0.145 * bulk, 0.105 * bulk, spec.armorColor),
        makeBoneSegmentBox(0.06, 0.17 * bulk, 0.125 * bulk, 0.17 * bulk, 0.125 * bulk, spec.trimColor),
      ]),
    },
    {
      name: 'Monster_Spine1',
      boneName: 'spine_01',
      geometry: makeBoneSegmentBox(spine1Len * 1.1, 0.14 * bulk, 0.10 * bulk, 0.16 * bulk, 0.115 * bulk, spec.skinColor),
    },
    {
      name: 'Monster_Spine2',
      boneName: 'spine_02',
      geometry: makeBoneSegmentBox(spine2Len * 1.12, 0.16 * bulk, 0.115 * bulk, 0.19 * bulk, 0.13 * bulk, spec.armorColor),
    },
  ];

  // Upper chest (+ spiked collar / boss chest rune)
  const chestParts: THREE.BufferGeometry[] = [
    makeBoneSegmentBox(spine3Len * 0.94, 0.185 * bulk, 0.13 * bulk, 0.21 * bulk, 0.14 * bulk, spec.armorColor),
  ];
  if (id === 'demons.boss_demon') {
    const chestPlate = new THREE.BoxGeometry(0.36 * bulk, 0.20, 0.28 * bulk);
    chestPlate.translate(0, spine3Len * 0.55, 0.02);
    const rune = new THREE.OctahedronGeometry(0.075, 0);
    rune.translate(0, spine3Len * 0.55, 0.165 * bulk);
    const backSpikes = new THREE.ConeGeometry(0.055, 0.22, 4);
    backSpikes.rotateX(-0.6);
    backSpikes.translate(0, spine3Len * 0.72, -0.18 * bulk);
    chestParts.push(
      prepareColoredPart(chestPlate, spec.trimColor),
      prepareColoredPart(rune, spec.accentColor),
      prepareColoredPart(backSpikes, '#ffd541')
    );
  }
  partSpecs.push({ name: 'Monster_Spine3', boneName: 'spine_03', geometry: mergeColoredParts(chestParts) });

  partSpecs.push({
    name: 'Monster_Neck',
    boneName: 'neck_01',
    geometry: makeBoneSegmentBox(neckLen * 1.1, 0.058 * bulk, 0.058 * bulk, 0.055 * bulk, 0.055 * bulk, spec.skinColor),
  });

  // Head + Monster Silhouettes (ears, tusks, shaman skull crown, giant demon horns)
  const isGoblin = id.startsWith('orcs.goblin');
  const headScale = isGoblin ? 1.24 : bulk;
  const headParts: THREE.BufferGeometry[] = [];
  const skull = new THREE.BoxGeometry(0.22 * headScale, 0.22 * headScale, 0.22 * headScale);
  skull.translate(0, 0.11 * headScale, 0);
  const eyeGlow = new THREE.BoxGeometry(0.16 * headScale, 0.045, 0.04);
  eyeGlow.translate(0, 0.12 * headScale, 0.105 * headScale);
  headParts.push(
    prepareColoredPart(skull, spec.skinColor),
    prepareColoredPart(eyeGlow, id === 'demons.boss_demon' ? '#ffd541' : spec.accentColor)
  );

  if (isGoblin) {
    // Signature wide pointed goblin ears
    for (const sx of [-1, 1]) {
      const ear = new THREE.ConeGeometry(0.055, 0.20, 4);
      ear.rotateZ(sx * -1.22);
      ear.translate(sx * 0.20 * headScale, 0.13 * headScale, 0);
      headParts.push(prepareColoredPart(ear, spec.skinColor));
    }
    if (id === 'orcs.goblin_03') {
      const hood = new THREE.BoxGeometry(0.26 * headScale, 0.14, 0.26 * headScale);
      hood.translate(0, 0.21 * headScale, -0.01);
      headParts.push(prepareColoredPart(hood, spec.armorColor));
    } else if (id === 'orcs.goblin_06') {
      const helm = new THREE.CylinderGeometry(0.16 * headScale, 0.18 * headScale, 0.11, 8);
      helm.translate(0, 0.21 * headScale, 0);
      headParts.push(prepareColoredPart(helm, spec.armorColor));
    } else if (id === 'orcs.goblin_02') {
      const boneCrown = new THREE.BoxGeometry(0.26 * headScale, 0.10, 0.24 * headScale);
      boneCrown.translate(0, 0.22 * headScale, 0);
      for (const sx of [-1, 1]) {
        const tuskHorn = new THREE.ConeGeometry(0.035, 0.14, 4);
        tuskHorn.rotateZ(sx * -0.4);
        tuskHorn.translate(sx * 0.10, 0.30 * headScale, 0.05);
        headParts.push(prepareColoredPart(tuskHorn, '#dae0ea'));
      }
      headParts.push(prepareColoredPart(boneCrown, spec.trimColor));
    }
  } else if (id === 'orcs.orc_04') {
    // Jaw + Tusks + Iron Brow Band
    const jaw = new THREE.BoxGeometry(0.26 * bulk, 0.09, 0.18 * bulk);
    jaw.translate(0, 0.05, 0.06);
    headParts.push(prepareColoredPart(jaw, spec.skinColor));
    for (const sx of [-1, 1]) {
      const tusk = new THREE.ConeGeometry(0.025, 0.09, 4);
      tusk.translate(sx * 0.085 * bulk, 0.11, 0.13 * bulk);
      headParts.push(prepareColoredPart(tusk, '#dae0ea'));
    }
    const brow = new THREE.BoxGeometry(0.26 * bulk, 0.06, 0.25 * bulk);
    brow.translate(0, 0.21 * bulk, 0);
    headParts.push(prepareColoredPart(brow, spec.trimColor));
  } else if (id === 'demons.boss_demon') {
    // Towering Boss Demon Crown & Solidly Anchored Swept Horns
    const brow = new THREE.BoxGeometry(0.28 * bulk, 0.09, 0.27 * bulk);
    brow.translate(0, 0.20 * bulk, 0.01);
    headParts.push(prepareColoredPart(brow, spec.armorColor));
    for (const sx of [-1, 1]) {
      const hornBase = new THREE.CylinderGeometry(0.048, 0.072, 0.16, 5);
      hornBase.rotateZ(sx * -0.78);
      hornBase.translate(sx * 0.13 * bulk, 0.23 * bulk, 0);
      const hornMid = new THREE.CylinderGeometry(0.036, 0.052, 0.16, 5);
      hornMid.rotateZ(sx * -0.25);
      hornMid.translate(sx * 0.20 * bulk, 0.30 * bulk, 0);
      const hornTip = new THREE.ConeGeometry(0.04, 0.20, 5);
      hornTip.rotateZ(sx * 0.22);
      hornTip.translate(sx * 0.21 * bulk, 0.41 * bulk, -0.01);
      headParts.push(
        prepareColoredPart(hornBase, spec.trimColor),
        prepareColoredPart(hornMid, spec.accentColor),
        prepareColoredPart(hornTip, '#ffd541')
      );
    }
  }
  partSpecs.push({ name: 'Monster_Head', boneName: 'Head', geometry: mergeColoredParts(headParts) });

  // Arms & Pauldrons (anchored tightly around local shoulder socket y=0)
  for (const side of ['l', 'r'] as const) {
    const uParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(uArm * 0.96, 0.068 * bulk, 0.068 * bulk, 0.056 * bulk, 0.056 * bulk, spec.skinColor),
    ];
    if (id === 'orcs.orc_04' || id === 'demons.boss_demon') {
      const pSize = id === 'demons.boss_demon' ? 0.22 * bulk : 0.17 * bulk;
      const pauldron = new THREE.BoxGeometry(pSize, pSize * 0.72, pSize);
      pauldron.translate(0, 0.03, 0);
      uParts.push(prepareColoredPart(pauldron, spec.armorColor));
      if (id === 'demons.boss_demon') {
        const ridge = new THREE.BoxGeometry(pSize * 0.55, 0.08, pSize * 0.78);
        ridge.translate(0, -pSize * 0.34, 0);
        const spike = new THREE.ConeGeometry(0.052, 0.14, 4);
        spike.rotateZ(side === 'l' ? -Math.PI * 0.65 : Math.PI * 0.65);
        spike.translate(side === 'l' ? pSize * 0.32 : -pSize * 0.32, -0.02, 0);
        uParts.push(
          prepareColoredPart(ridge, spec.trimColor),
          prepareColoredPart(spike, spec.accentColor)
        );
      }
    }
    partSpecs.push({ name: `Monster_UA_${side}`, boneName: `upperarm_${side}`, geometry: mergeColoredParts(uParts) });
    partSpecs.push({
      name: `Monster_LA_${side}`,
      boneName: `lowerarm_${side}`,
      geometry: makeBoneSegmentBox(lArm * 0.96, 0.058 * bulk, 0.058 * bulk, 0.048 * bulk, 0.048 * bulk, spec.armorColor),
    });

    const handParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(0.115, 0.05 * bulk, 0.046 * bulk, 0.044 * bulk, 0.04 * bulk, spec.skinColor),
    ];

    // Right / Left Weapons
    if (side === 'r') {
      if (id === 'orcs.goblin_01') {
        const hilt = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 5);
        hilt.rotateX(Math.PI * 0.5);
        const blade = new THREE.BoxGeometry(0.075, 0.035, 0.38);
        blade.translate(0, 0, 0.26);
        handParts.push(prepareColoredPart(hilt, '#3b1725'), prepareColoredPart(blade, '#b3b9d1'));
      } else if (id === 'orcs.goblin_03') {
        const shaft = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 5);
        shaft.rotateX(Math.PI * 0.5);
        shaft.translate(0, 0, 0.2);
        const head = new THREE.ConeGeometry(0.04, 0.10, 4);
        head.rotateX(Math.PI * 0.5);
        head.translate(0, 0, 0.5);
        handParts.push(prepareColoredPart(shaft, '#3b1725'), prepareColoredPart(head, '#f9a31b'));
      } else if (id === 'orcs.goblin_06') {
        const club = new THREE.CylinderGeometry(0.065, 0.03, 0.62, 6);
        club.rotateX(Math.PI * 0.5);
        club.translate(0, 0, 0.25);
        handParts.push(prepareColoredPart(club, '#73172d'));
      } else if (id === 'orcs.goblin_02') {
        const staff = new THREE.CylinderGeometry(0.024, 0.02, 1.38, 6);
        staff.rotateX(Math.PI * 0.5);
        staff.translate(0, 0, 0.38);
        const skullTotem = new THREE.BoxGeometry(0.14, 0.14, 0.14);
        skullTotem.translate(0, 0, 1.1);
        const orb = new THREE.OctahedronGeometry(0.08, 0);
        orb.translate(0, 0.11, 1.1);
        handParts.push(
          prepareColoredPart(staff, '#3b1725'),
          prepareColoredPart(skullTotem, '#dae0ea'),
          prepareColoredPart(orb, '#249fde')
        );
      } else if (id === 'orcs.orc_04') {
        const handle = new THREE.CylinderGeometry(0.032, 0.028, 0.65, 6);
        handle.rotateX(Math.PI * 0.5);
        handle.translate(0, 0, 0.22);
        const maul = new THREE.BoxGeometry(0.24, 0.22, 0.44);
        maul.translate(0, 0, 0.64);
        const spikes = new THREE.ConeGeometry(0.06, 0.14, 4);
        spikes.rotateX(Math.PI * 0.5);
        spikes.translate(0, 0, 0.90);
        handParts.push(
          prepareColoredPart(handle, '#3b1725'),
          prepareColoredPart(maul, '#6d758d'),
          prepareColoredPart(spikes, '#f9a31b')
        );
      } else if (id === 'demons.boss_demon') {
        // Giant Two-Handed Runic Demon Greatsword
        const grip = new THREE.CylinderGeometry(0.03, 0.03, 0.38, 6);
        grip.rotateX(Math.PI * 0.5);
        grip.translate(0, 0, 0.08);
        const guard = new THREE.BoxGeometry(0.42, 0.09, 0.10);
        guard.translate(0, 0, 0.28);
        const blade = new THREE.BoxGeometry(0.17, 0.06, 1.25);
        blade.translate(0, 0, 0.94);
        const core = new THREE.BoxGeometry(0.07, 0.075, 1.05);
        core.translate(0, 0, 0.92);
        const tip = new THREE.ConeGeometry(0.11, 0.24, 4);
        tip.rotateX(Math.PI * 0.5);
        tip.rotateZ(Math.PI * 0.25);
        tip.translate(0, 0, 1.66);
        handParts.push(
          prepareColoredPart(grip, '#141013'),
          prepareColoredPart(guard, '#b4202a'),
          prepareColoredPart(blade, '#6d758d'),
          prepareColoredPart(core, '#fa6a0a'),
          prepareColoredPart(tip, '#ffd541')
        );
      }
    } else if (side === 'l') {
      if (id === 'orcs.goblin_01') {
        const dBlade = new THREE.BoxGeometry(0.065, 0.03, 0.32);
        dBlade.translate(0, 0, 0.22);
        handParts.push(prepareColoredPart(dBlade, '#b3b9d1'));
      } else if (id === 'orcs.goblin_03') {
        const bow = new THREE.BoxGeometry(0.05, 0.85, 0.07);
        bow.translate(0, 0.04, 0.12);
        handParts.push(prepareColoredPart(bow, spec.trimColor));
      } else if (id === 'orcs.goblin_06') {
        const shield = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 8);
        shield.rotateZ(Math.PI * 0.5);
        shield.translate(0.10, 0.05, 0.06);
        const boss = new THREE.OctahedronGeometry(0.08, 0);
        boss.translate(0.14, 0.05, 0.06);
        handParts.push(
          prepareColoredPart(shield, spec.armorColor),
          prepareColoredPart(boss, spec.trimColor)
        );
      }
    }

    partSpecs.push({ name: `Monster_Hand_${side}`, boneName: `hand_${side}`, geometry: mergeColoredParts(handParts) });
  }

  for (const side of ['l', 'r'] as const) {
    partSpecs.push({
      name: `Monster_Thigh_${side}`,
      boneName: `thigh_${side}`,
      geometry: makeBoneSegmentBox(thigh * 0.96, 0.092 * bulk, 0.092 * bulk, 0.072 * bulk, 0.072 * bulk, spec.skinColor),
    });
    partSpecs.push({
      name: `Monster_Calf_${side}`,
      boneName: `calf_${side}`,
      geometry: makeBoneSegmentBox(calf * 0.96, 0.072 * bulk, 0.072 * bulk, 0.058 * bulk, 0.058 * bulk, spec.armorColor),
    });
    partSpecs.push({
      name: `Monster_Foot_${side}`,
      boneName: `foot_${side}`,
      geometry: makeBoneSegmentBox(0.185, 0.062 * bulk, 0.072 * bulk, 0.054 * bulk, 0.06 * bulk, '#141013'),
    });
  }

  const rigidRes = attachRigidPartsToUalRig(rig, partSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  const root = new THREE.Group();
  root.name = id;
  root.add(rig.armature);

  return {
    id,
    spec,
    rig,
    root,
    meshes: rigidRes.meshes,
    materials: rigidRes.materials,
  };
}
