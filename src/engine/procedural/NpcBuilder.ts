import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
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

export type NwlNpcId =
  | 'npc.ferreiro'
  | 'npc.mercador'
  | 'npc.tesoureiro'
  | 'npc.grimorista'
  | 'npc.comandante'
  | 'npc.guarda'
  | 'npc.naturalista'
  | 'npc.escriba'
  | 'npc.joalheira'
  | 'npc.bau';

export const NWL_NPC_IDS: readonly NwlNpcId[] = [
  'npc.ferreiro',
  'npc.mercador',
  'npc.tesoureiro',
  'npc.grimorista',
  'npc.comandante',
  'npc.guarda',
  'npc.naturalista',
  'npc.escriba',
  'npc.joalheira',
  'npc.bau',
];

export interface NpcProfileSpec {
  id: NwlNpcId;
  namePt: string;
  rolePt: string;
  buildingName: string;
  tunic: string;
  trim: string;
  accent: string;
  pants: string;
  hair: string;
  headgear: 'none' | 'bandana' | 'cap' | 'hat_mage' | 'helm' | 'circlet' | 'hood' | 'beret';
  prop: 'hammer' | 'coin_bag' | 'ledger' | 'tome' | 'halberd' | 'spear' | 'staff' | 'quill' | 'gem' | 'none';
}

export const NWL_NPC_PROFILES: Record<NwlNpcId, NpcProfileSpec> = {
  'npc.ferreiro': {
    id: 'npc.ferreiro',
    namePt: 'Ferreiro',
    rolePt: 'Melhora equipamentos',
    buildingName: 'Forja (4×4)',
    tunic: '#73172d',
    trim: '#fa6a0a',
    accent: '#b3b9d1',
    pants: '#3b1725',
    hair: '#141013',
    headgear: 'bandana',
    prop: 'hammer',
  },
  'npc.mercador': {
    id: 'npc.mercador',
    namePt: 'Mercador',
    rolePt: 'Compra e venda de itens',
    buildingName: 'Mercado (4×4)',
    tunic: '#285cc4',
    trim: '#f9a31b',
    accent: '#ffd541',
    pants: '#3b1725',
    hair: '#3b1725',
    headgear: 'beret',
    prop: 'coin_bag',
  },
  'npc.tesoureiro': {
    id: 'npc.tesoureiro',
    namePt: 'Tesoureiro',
    rolePt: 'Moedas e cofre real',
    buildingName: 'Tesouro (4×4)',
    tunic: '#4a3052',
    trim: '#ffd541',
    accent: '#f9a31b',
    pants: '#141013',
    hair: '#dae0ea',
    headgear: 'cap',
    prop: 'ledger',
  },
  'npc.grimorista': {
    id: 'npc.grimorista',
    namePt: 'Grimorista',
    rolePt: 'Magias e tomos arcanos',
    buildingName: 'Grimório (4×4)',
    tunic: '#285cc4',
    trim: '#249fde',
    accent: '#ffd541',
    pants: '#141013',
    hair: '#dae0ea',
    headgear: 'hat_mage',
    prop: 'tome',
  },
  'npc.comandante': {
    id: 'npc.comandante',
    namePt: 'Comandante',
    rolePt: 'Missões e campanha',
    buildingName: 'Salão do Comandante (5×5)',
    tunic: '#b4202a',
    trim: '#b3b9d1',
    accent: '#ffd541',
    pants: '#3b1725',
    hair: '#6d758d',
    headgear: 'circlet',
    prop: 'halberd',
  },
  'npc.guarda': {
    id: 'npc.guarda',
    namePt: 'Guarda',
    rolePt: 'Vigia do Portão da Cidade',
    buildingName: 'Portão da Cidade',
    tunic: '#b3b9d1',
    trim: '#285cc4',
    accent: '#dae0ea',
    pants: '#3b1725',
    hair: '#141013',
    headgear: 'helm',
    prop: 'spear',
  },
  'npc.naturalista': {
    id: 'npc.naturalista',
    namePt: 'Naturalista',
    rolePt: 'Bestiário e animais',
    buildingName: 'Praça da Fonte',
    tunic: '#1a7a3e',
    trim: '#24523b',
    accent: '#f9a31b',
    pants: '#3b1725',
    hair: '#73172d',
    headgear: 'hood',
    prop: 'staff',
  },
  'npc.escriba': {
    id: 'npc.escriba',
    namePt: 'Escriba',
    rolePt: 'Registros e conquistas',
    buildingName: 'Praça Central',
    tunic: '#3b1725',
    trim: '#dae0ea',
    accent: '#f9a31b',
    pants: '#141013',
    hair: '#6d758d',
    headgear: 'none',
    prop: 'quill',
  },
  'npc.joalheira': {
    id: 'npc.joalheira',
    namePt: 'Joalheira',
    rolePt: 'Joias e gemas encantadas',
    buildingName: 'Praça / Mercado',
    tunic: '#4a3052',
    trim: '#249fde',
    accent: '#ffd541',
    pants: '#3b1725',
    hair: '#fa6a0a',
    headgear: 'circlet',
    prop: 'gem',
  },
  'npc.bau': {
    id: 'npc.bau',
    namePt: 'Baú do Herói',
    rolePt: 'Guarda itens e loots raros',
    buildingName: 'Casa do Baú (3×3)',
    tunic: '#73172d',
    trim: '#f9a31b',
    accent: '#ffd541',
    pants: '#3b1725',
    hair: '#141013',
    headgear: 'none',
    prop: 'none',
  },
};

export interface GeneratedNpcResult {
  id: NwlNpcId;
  spec: NpcProfileSpec;
  rig: CanonicalUalRig | null;
  lidPivot?: THREE.Group;
  setChestOpen?: (open: boolean) => void;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
}

const NWL_NPC_SCALE = 1.70 / 1.829; // ~1.70m ≈ 102px
const SKIN_BASE = '#e0a882';
const SKIN_SHADOW = '#b87b56';

function getSpan(rig: CanonicalUalRig, name: string, fallback: number): number {
  const b = rig.boneByName.get(name);
  if (!b) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) return ch.position.y;
  }
  return fallback;
}

function buildNpcHandProp(kind: NpcProfileSpec['prop'], spec: NpcProfileSpec): THREE.BufferGeometry | null {
  if (kind === 'none') return null;
  if (kind === 'hammer') {
    const handle = new THREE.CylinderGeometry(0.022, 0.024, 0.52, 6);
    handle.rotateX(Math.PI * 0.5);
    handle.translate(0, 0, 0.16);
    const head = new THREE.BoxGeometry(0.18, 0.12, 0.12);
    head.translate(0, 0, 0.42);
    return mergeColoredParts([
      prepareColoredPart(handle, '#3b1725'),
      prepareColoredPart(head, '#b3b9d1'),
    ]);
  }
  if (kind === 'coin_bag') {
    const bag = new THREE.DodecahedronGeometry(0.11, 0);
    bag.translate(0, -0.06, 0.08);
    const knot = new THREE.BoxGeometry(0.06, 0.05, 0.06);
    knot.translate(0, 0.04, 0.08);
    return mergeColoredParts([
      prepareColoredPart(bag, spec.trim),
      prepareColoredPart(knot, spec.accent),
    ]);
  }
  if (kind === 'ledger' || kind === 'tome') {
    const book = new THREE.BoxGeometry(0.22, 0.28, 0.07);
    book.translate(0, 0.05, 0.10);
    const clasp = new THREE.BoxGeometry(0.06, 0.09, 0.09);
    clasp.translate(0.06, 0.05, 0.10);
    return mergeColoredParts([
      prepareColoredPart(book, kind === 'tome' ? '#4a3052' : '#73172d'),
      prepareColoredPart(clasp, spec.accent),
    ]);
  }
  if (kind === 'halberd' || kind === 'spear') {
    const shaft = new THREE.CylinderGeometry(0.022, 0.022, 1.75, 6);
    shaft.rotateX(Math.PI * 0.5);
    shaft.translate(0, 0, 0.48);
    const blade = new THREE.ConeGeometry(kind === 'halberd' ? 0.09 : 0.055, 0.28, 4);
    blade.rotateX(Math.PI * 0.5);
    blade.translate(0, 0, 1.42);
    const parts = [prepareColoredPart(shaft, '#3b1725'), prepareColoredPart(blade, '#b3b9d1')];
    if (kind === 'halberd') {
      const axe = new THREE.BoxGeometry(0.18, 0.04, 0.22);
      axe.translate(0.09, 0, 1.24);
      parts.push(prepareColoredPart(axe, spec.accent));
    }
    return mergeColoredParts(parts);
  }
  if (kind === 'staff') {
    const pole = new THREE.CylinderGeometry(0.024, 0.022, 1.5, 6);
    pole.rotateX(Math.PI * 0.5);
    pole.translate(0, 0, 0.42);
    const leaf = new THREE.OctahedronGeometry(0.08, 0);
    leaf.translate(0, 0, 1.2);
    return mergeColoredParts([
      prepareColoredPart(pole, '#3b1725'),
      prepareColoredPart(leaf, '#1a7a3e'),
    ]);
  }
  if (kind === 'quill') {
    const scroll = new THREE.CylinderGeometry(0.045, 0.045, 0.30, 7);
    scroll.rotateZ(Math.PI * 0.5);
    scroll.translate(0, 0.02, 0.08);
    const nib = new THREE.ConeGeometry(0.025, 0.16, 4);
    nib.rotateX(Math.PI * 0.5);
    nib.translate(0.04, 0.06, 0.15);
    return mergeColoredParts([
      prepareColoredPart(scroll, '#dae0ea'),
      prepareColoredPart(nib, spec.accent),
    ]);
  }
  // gem
  const tray = new THREE.CylinderGeometry(0.11, 0.09, 0.04, 6);
  tray.translate(0, 0.02, 0.12);
  const gem = new THREE.OctahedronGeometry(0.075, 0);
  gem.translate(0, 0.09, 0.12);
  return mergeColoredParts([
    prepareColoredPart(tray, spec.accent),
    prepareColoredPart(gem, '#249fde'),
  ]);
}

export function buildNwlNpc(
  id: NwlNpcId,
  options: { pixelSize?: number; objectId?: number } = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedNpcResult {
  const spec = NWL_NPC_PROFILES[id];
  const px = options.pixelSize ?? 3;
  const objId = options.objectId ?? 22;

  if (id === 'npc.bau') {
    // Interactive animated Hero Chest (separate lid pivot)
    const root = new THREE.Group();
    root.name = 'npc.bau';
    const materials: PixelizerMaterial[] = [];
    const meshes: THREE.Mesh[] = [];

    const makeChestMat = () => {
      const m = new PixelizerMaterial(
        {
          pixelated: true,
          pixelSize: px,
          objectId: objId,
          outlineColor: '#14101c',
          baseColor: '#ffffff',
          edgeHighlight: 0.38,
          edgeBevelWeight: 0.85,
          useColorGrading: true,
        },
        sharedResources
      );
      m.vertexColors = true;
      materials.push(m);
      return m;
    };

    const baseWood = new THREE.BoxGeometry(0.86, 0.44, 0.58);
    baseWood.translate(0, 0.22, 0);
    const bandL = new THREE.BoxGeometry(0.08, 0.46, 0.62);
    bandL.translate(-0.28, 0.23, 0);
    const bandR = new THREE.BoxGeometry(0.08, 0.46, 0.62);
    bandR.translate(0.28, 0.23, 0);
    const lock = new THREE.BoxGeometry(0.14, 0.18, 0.07);
    lock.translate(0, 0.34, 0.30);
    const baseGeo = mergeColoredParts([
      prepareColoredPart(baseWood, '#73172d'),
      prepareColoredPart(bandL, '#f9a31b'),
      prepareColoredPart(bandR, '#f9a31b'),
      prepareColoredPart(lock, '#ffd541'),
    ]);
    const baseMesh = new THREE.Mesh(baseGeo, makeChestMat());
    baseMesh.name = 'Bau_Base';
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    root.add(baseMesh);
    meshes.push(baseMesh);

    const lidPivot = new THREE.Group();
    lidPivot.name = 'Bau_LidPivot';
    lidPivot.position.set(0, 0.44, -0.28);

    const lidMain = new THREE.BoxGeometry(0.88, 0.20, 0.60);
    lidMain.translate(0, 0.10, 0.28);
    const lidTop = new THREE.BoxGeometry(0.80, 0.08, 0.50);
    lidTop.translate(0, 0.22, 0.28);
    const lidStrapL = new THREE.BoxGeometry(0.09, 0.23, 0.63);
    lidStrapL.translate(-0.28, 0.11, 0.28);
    const lidStrapR = new THREE.BoxGeometry(0.09, 0.23, 0.63);
    lidStrapR.translate(0.28, 0.11, 0.28);
    const lidGeo = mergeColoredParts([
      prepareColoredPart(lidMain, '#73172d'),
      prepareColoredPart(lidTop, '#3b1725'),
      prepareColoredPart(lidStrapL, '#f9a31b'),
      prepareColoredPart(lidStrapR, '#f9a31b'),
    ]);
    const lidMesh = new THREE.Mesh(lidGeo, makeChestMat());
    lidMesh.name = 'Bau_Lid';
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    lidPivot.add(lidMesh);
    root.add(lidPivot);
    meshes.push(lidMesh);

    for (const m of meshes) {
      m.userData.pixelizer = {
        snap: {
          snapPosition: true,
          alignPixelGrid: true,
          alignmentPixelSize: px,
          angleSnapMode: 'none',
          angleResolutionDeg: 45,
        },
        gridReference: root,
      } satisfies PixelizerObjectAttachment;
    }

    return {
      id,
      spec,
      rig: null,
      lidPivot,
      setChestOpen: (open: boolean) => {
        lidPivot.rotation.x = open ? -Math.PI * 0.42 : 0;
      },
      root,
      meshes,
      materials,
    };
  }

  const rig = createCanonicalUalRig('male', NWL_NPC_SCALE);
  const pelvisLen = getSpan(rig, 'pelvis', 0.138);
  const spine1Len = getSpan(rig, 'spine_01', 0.124);
  const spine2Len = getSpan(rig, 'spine_02', 0.141);
  const spine3Len = getSpan(rig, 'spine_03', 0.173);
  const neckLen = getSpan(rig, 'neck_01', 0.083);
  const uArm = getSpan(rig, 'upperarm_l', 0.274);
  const lArm = getSpan(rig, 'lowerarm_l', 0.273);
  const thigh = getSpan(rig, 'thigh_l', 0.40);
  const calf = getSpan(rig, 'calf_l', 0.43);

  const partSpecs: RigidPartSpec[] = [
    {
      name: 'NPC_Pelvis',
      boneName: 'pelvis',
      geometry: mergeColoredParts([
        makeBoneSegmentBox(pelvisLen * 1.1, 0.15, 0.105, 0.14, 0.10, spec.pants),
        makeBoneSegmentBox(0.055, 0.16, 0.115, 0.16, 0.115, spec.trim),
      ]),
    },
    {
      name: 'NPC_Spine1',
      boneName: 'spine_01',
      geometry: makeBoneSegmentBox(spine1Len * 1.1, 0.14, 0.10, 0.15, 0.11, spec.tunic),
    },
    {
      name: 'NPC_Spine2',
      boneName: 'spine_02',
      geometry: makeBoneSegmentBox(spine2Len * 1.1, 0.15, 0.11, 0.175, 0.125, spec.tunic),
    },
    {
      name: 'NPC_Spine3',
      boneName: 'spine_03',
      geometry: mergeColoredParts([
        makeBoneSegmentBox(spine3Len * 0.92, 0.175, 0.12, 0.185, 0.128, spec.tunic),
        (() => {
          const collar = new THREE.BoxGeometry(0.28, 0.05, 0.22);
          collar.translate(0, spine3Len * 0.78, 0);
          return prepareColoredPart(collar, spec.trim);
        })(),
      ]),
    },
    {
      name: 'NPC_Neck',
      boneName: 'neck_01',
      geometry: makeBoneSegmentBox(neckLen * 1.1, 0.052, 0.052, 0.048, 0.048, SKIN_SHADOW),
    },
  ];

  // Head + Headgear
  const headParts: THREE.BufferGeometry[] = [];
  const head = new THREE.BoxGeometry(0.215, 0.23, 0.215);
  head.translate(0, 0.11, 0);
  const hair = new THREE.BoxGeometry(0.228, 0.09, 0.23);
  hair.translate(0, 0.20, -0.01);
  headParts.push(prepareColoredPart(head, SKIN_BASE), prepareColoredPart(hair, spec.hair));

  if (spec.headgear === 'helm') {
    const h = new THREE.BoxGeometry(0.25, 0.22, 0.25);
    h.translate(0, 0.14, 0);
    const plume = new THREE.BoxGeometry(0.05, 0.11, 0.22);
    plume.translate(0, 0.28, -0.01);
    headParts.push(prepareColoredPart(h, spec.tunic), prepareColoredPart(plume, spec.trim));
  } else if (spec.headgear === 'hat_mage') {
    const brim = new THREE.CylinderGeometry(0.26, 0.27, 0.035, 8);
    brim.translate(0, 0.23, 0);
    const cone = new THREE.ConeGeometry(0.145, 0.30, 8);
    cone.translate(0, 0.39, -0.02);
    headParts.push(prepareColoredPart(brim, spec.tunic), prepareColoredPart(cone, spec.trim));
  } else if (spec.headgear === 'beret' || spec.headgear === 'cap') {
    const cap = new THREE.CylinderGeometry(0.14, 0.125, 0.08, 8);
    cap.translate(0, 0.25, 0);
    headParts.push(prepareColoredPart(cap, spec.trim));
  } else if (spec.headgear === 'bandana') {
    const band = new THREE.BoxGeometry(0.235, 0.065, 0.235);
    band.translate(0, 0.195, 0);
    headParts.push(prepareColoredPart(band, spec.trim));
  } else if (spec.headgear === 'circlet') {
    const ring = new THREE.BoxGeometry(0.238, 0.04, 0.238);
    ring.translate(0, 0.19, 0);
    const gem = new THREE.OctahedronGeometry(0.035, 0);
    gem.translate(0, 0.195, 0.13);
    headParts.push(prepareColoredPart(ring, spec.accent), prepareColoredPart(gem, '#249fde'));
  } else if (spec.headgear === 'hood') {
    const hood = new THREE.BoxGeometry(0.245, 0.21, 0.255);
    hood.translate(0, 0.14, -0.015);
    headParts.push(prepareColoredPart(hood, spec.tunic));
  }
  partSpecs.push({ name: 'NPC_Head', boneName: 'Head', geometry: mergeColoredParts(headParts) });

  for (const side of ['l', 'r'] as const) {
    partSpecs.push({
      name: `NPC_UA_${side}`,
      boneName: `upperarm_${side}`,
      geometry: makeBoneSegmentBox(uArm * 0.96, 0.064, 0.064, 0.054, 0.054, spec.tunic),
    });
    partSpecs.push({
      name: `NPC_LA_${side}`,
      boneName: `lowerarm_${side}`,
      geometry: makeBoneSegmentBox(lArm * 0.96, 0.052, 0.052, 0.044, 0.044, spec.trim),
    });
    const handParts: THREE.BufferGeometry[] = [
      makeBoneSegmentBox(0.11, 0.044, 0.04, 0.038, 0.035, SKIN_BASE),
    ];
    if (side === 'r') {
      const propGeo = buildNpcHandProp(spec.prop, spec);
      if (propGeo) handParts.push(propGeo);
    }
    partSpecs.push({
      name: `NPC_Hand_${side}`,
      boneName: `hand_${side}`,
      geometry: mergeColoredParts(handParts),
    });
    partSpecs.push({
      name: `NPC_Thigh_${side}`,
      boneName: `thigh_${side}`,
      geometry: makeBoneSegmentBox(thigh * 0.96, 0.082, 0.082, 0.064, 0.064, spec.pants),
    });
    partSpecs.push({
      name: `NPC_Calf_${side}`,
      boneName: `calf_${side}`,
      geometry: makeBoneSegmentBox(calf * 0.96, 0.064, 0.064, 0.052, 0.052, '#3b1725'),
    });
    partSpecs.push({
      name: `NPC_Foot_${side}`,
      boneName: `foot_${side}`,
      geometry: makeBoneSegmentBox(0.17, 0.054, 0.06, 0.048, 0.052, '#141013'),
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
