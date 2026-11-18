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
import type { PixelizerMaterialOptions } from '../types';
import {
  bakeTaggedPartsAsset,
  createPixelizerMaterialFromBaked,
  type BakedAssetResult,
  type UnwrapMetricsSummary,
} from './PixelMaterialSynth';
import {
  makeAxeHeadGeometry,
  makeBeveledBoneSegmentBox,
  makeBeveledBox,
  makeLatheProfile,
  makeSwordBladeGeometry,
  tagPart,
  type FinishMode,
  type MaterialRecipeId,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { prepareColoredPart } from './SdfVoxelPrimitives';

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

export interface NpcBuildOptions {
  pixelSize?: number;
  objectId?: number;
  finishMode?: FinishMode;
  seed?: number;
  aoStrength?: number;
  normalStrength?: number;
}

export interface GeneratedNpcResult {
  id: NwlNpcId;
  spec: NpcProfileSpec;
  rig: CanonicalUalRig | null;
  lidPivot?: THREE.Group;
  setChestOpen?: (open: boolean) => void;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  dispose?: () => void;
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

function bakedToMaterialOptions(
  baked: BakedAssetResult,
  extras: Partial<PixelizerMaterialOptions> = {}
): Partial<PixelizerMaterialOptions> {
  const hasTex = Boolean(baked.textures);
  const hasEmission = Boolean(baked.textures?.hasEmission && baked.textures.emissionMap);
  return {
    baseColor: '#ffffff',
    diffuseVertexColorWeight: 1.0,
    edgeHighlight: 0.36,
    edgeBevelWeight: 0.72,
    smoothness: 0.22,
    albedoMap: baked.textures?.albedoMap ?? null,
    normalMap: baked.textures?.normalMap ?? null,
    normalScale: hasTex ? 0.85 : 1.0,
    useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
    emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
    emissionColor: hasEmission ? '#ffffff' : '#000000',
    emissionIntensity: hasEmission ? 1.15 : 0.0,
    ...extras,
  };
}

function disposeNpcMaterialsSafely(materials: PixelizerMaterial[]): void {
  const seen = new Set<THREE.Texture>();
  for (const mat of materials) {
    const o = mat.options;
    for (const tex of [o.albedoMap, o.normalMap, o.emissionMap]) {
      if (tex && !seen.has(tex)) {
        seen.add(tex);
        if (tex.userData?.pooled !== true) {
          tex.dispose();
        }
      }
    }
    mat.dispose();
  }
}

function buildNpcHandPropParts(kind: NpcProfileSpec['prop'], spec: NpcProfileSpec): TaggedGeometryPart[] {
  if (kind === 'none') return [];
  if (kind === 'hammer') {
    const handle = makeLatheProfile(
      [
        [0.024, -0.26],
        [0.02, 0.26],
      ],
      7,
      '#3b1725'
    );
    handle.rotateX(Math.PI * 0.5);
    handle.translate(0, 0, 0.16);
    const head = makeBeveledBox(0.18, 0.125, 0.125, 0.018, '#b3b9d1', { offset: [0, 0, 0.42] });
    return [
      tagPart(handle, 'npc_hammer_handle', 'wood_planks', '#3b1725', { lockVertical: false }),
      tagPart(head, 'npc_hammer_head', 'forged_steel', '#b3b9d1', { lockVertical: false }),
    ];
  }
  if (kind === 'coin_bag') {
    const bag = makeLatheProfile(
      [
        [0.04, -0.14],
        [0.115, -0.07],
        [0.09, 0.01],
        [0.035, 0.04],
        [0.06, 0.08],
      ],
      8,
      spec.trim
    );
    bag.translate(0, -0.02, 0.08);
    const tie = makeBeveledBox(0.065, 0.04, 0.065, 0.01, spec.accent, { offset: [0, 0.025, 0.08] });
    return [
      tagPart(bag, 'npc_coinbag', 'stitched_leather', spec.trim),
      tagPart(tie, 'npc_coinbag_tie', 'brushed_gold', spec.accent),
    ];
  }
  if (kind === 'ledger' || kind === 'tome') {
    const bookCol = kind === 'tome' ? '#4a3052' : '#73172d';
    const book = makeBeveledBox(0.22, 0.28, 0.072, 0.014, bookCol, { offset: [0, 0.05, 0.1] });
    const clasp = makeBeveledBox(0.065, 0.09, 0.09, 0.012, spec.accent, { offset: [0.06, 0.05, 0.1] });
    return [
      tagPart(book, 'npc_book', 'stitched_leather', bookCol, {
        landmarkKind: 'chest_crest',
        accentHex: spec.accent,
        lockVertical: false,
      }),
      tagPart(clasp, 'npc_book_clasp', kind === 'tome' ? 'runic_glow' : 'brushed_gold', spec.accent, {
        lockVertical: false,
      }),
    ];
  }
  if (kind === 'halberd' || kind === 'spear') {
    const shaft = makeLatheProfile(
      [
        [0.022, -0.88],
        [0.022, 0.88],
      ],
      7,
      '#3b1725'
    );
    shaft.rotateX(Math.PI * 0.5);
    shaft.translate(0, 0, 0.48);
    const blade = makeSwordBladeGeometry(
      kind === 'halberd' ? 0.095 : 0.07,
      0.032,
      0.16,
      0.14,
      '#b3b9d1'
    );
    blade.rotateX(Math.PI * 0.5);
    blade.translate(0, 0, 1.32);
    const out: TaggedGeometryPart[] = [
      tagPart(shaft, 'npc_pole_shaft', 'wood_planks', '#3b1725', { lockVertical: false }),
      tagPart(blade, 'npc_pole_tip', 'forged_steel', '#b3b9d1', { lockVertical: false }),
    ];
    if (kind === 'halberd') {
      const axe = makeAxeHeadGeometry(0.18, 0.22, 0.04, false, spec.accent);
      axe.rotateX(Math.PI * 0.5);
      axe.translate(0.03, 0, 1.24);
      out.push(tagPart(axe, 'npc_halberd_axe', 'forged_steel', spec.accent, { lockVertical: false }));
    }
    return out;
  }
  if (kind === 'staff') {
    const pole = makeLatheProfile(
      [
        [0.022, -0.75],
        [0.025, 0.75],
      ],
      7,
      '#3b1725'
    );
    pole.rotateX(Math.PI * 0.5);
    pole.translate(0, 0, 0.42);
    const leaf = prepareColoredPart(new THREE.OctahedronGeometry(0.08, 0), '#1a7a3e');
    leaf.translate(0, 0, 1.2);
    return [
      tagPart(pole, 'npc_staff_pole', 'wood_planks', '#3b1725', { lockVertical: false }),
      tagPart(leaf, 'npc_staff_orb', 'runic_glow', '#1a7a3e', { lockVertical: false }),
    ];
  }
  if (kind === 'quill') {
    const scroll = makeLatheProfile(
      [
        [0.045, -0.15],
        [0.045, 0.15],
      ],
      8,
      '#dae0ea'
    );
    scroll.rotateZ(Math.PI * 0.5);
    scroll.translate(0, 0.02, 0.08);
    const nib = prepareColoredPart(new THREE.ConeGeometry(0.026, 0.16, 4), spec.accent);
    nib.rotateX(Math.PI * 0.5);
    nib.translate(0.04, 0.06, 0.15);
    return [
      tagPart(scroll, 'npc_scroll', 'bone_ivory', '#dae0ea', { lockVertical: false }),
      tagPart(nib, 'npc_quill', 'brushed_gold', spec.accent, { lockVertical: false }),
    ];
  }
  const tray = makeLatheProfile(
    [
      [0.09, 0],
      [0.11, 0.04],
    ],
    8,
    spec.accent
  );
  tray.translate(0, 0, 0.12);
  const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.075, 0), '#249fde');
  gem.translate(0, 0.09, 0.12);
  return [
    tagPart(tray, 'npc_gem_tray', 'brushed_gold', spec.accent, { lockVertical: false }),
    tagPart(gem, 'npc_gem_stone', 'runic_glow', '#249fde', { lockVertical: false }),
  ];
}

export function buildNwlNpc(
  id: NwlNpcId,
  options: NpcBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedNpcResult {
  const spec = NWL_NPC_PROFILES[id];
  const px = options.pixelSize ?? 1;
  const objId = options.objectId ?? 22;
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 202);
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;

  if (id === 'npc.bau') {
    const root = new THREE.Group();
    root.name = 'npc.bau';
    const materials: PixelizerMaterial[] = [];
    const meshes: THREE.Mesh[] = [];

    const baseParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBox(0.86, 0.44, 0.58, 0.024, '#73172d', { offset: [0, 0.22, 0] }),
        'bau_wood_base',
        'wood_planks',
        '#73172d',
        { landmarkKind: 'chest_crest', accentHex: '#ffd541', lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.085, 0.46, 0.62, 0.012, '#f9a31b', { offset: [-0.28, 0.23, 0] }),
        'bau_band_l',
        'brushed_gold',
        '#f9a31b',
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.085, 0.46, 0.62, 0.012, '#f9a31b', { offset: [0.28, 0.23, 0] }),
        'bau_band_r',
        'brushed_gold',
        '#f9a31b',
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.14, 0.18, 0.075, 0.014, '#ffd541', { offset: [0, 0.34, 0.3] }),
        'bau_lock',
        'brushed_gold',
        '#ffd541',
        { landmarkKind: 'chest_crest', lockVertical: true }
      ),
    ];
    const baseBaked = bakeTaggedPartsAsset(baseParts, {
      finishMode,
      texelsPerMeter: 32,
      seed,
      aoStrength,
      normalStrength,
      emblemHex: '#ffd541',
      usePool: true,
      cacheKey: 'npc_bau:base',
    });
    for (const p of baseParts) p.geometry.dispose();

    const baseMat = createPixelizerMaterialFromBaked(
      baseBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: objId,
        outlineColor: '#14101c',
        edgeHighlight: 0.38,
        edgeBevelWeight: 0.85,
        useColorGrading: true,
      },
      sharedResources
    );
    materials.push(baseMat);

    const baseMesh = new THREE.Mesh(baseBaked.geometry, baseMat);
    baseMesh.name = 'Bau_Base';
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    root.add(baseMesh);
    meshes.push(baseMesh);

    const lidPivot = new THREE.Group();
    lidPivot.name = 'Bau_LidPivot';
    lidPivot.position.set(0, 0.44, -0.28);

    const lidParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBox(0.88, 0.2, 0.6, 0.022, '#73172d', { offset: [0, 0.1, 0.28] }),
        'bau_lid_main',
        'wood_planks',
        '#73172d',
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.8, 0.085, 0.5, 0.016, '#3b1725', { offset: [0, 0.22, 0.28] }),
        'bau_lid_top',
        'wood_planks',
        '#3b1725',
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.09, 0.23, 0.63, 0.012, '#f9a31b', { offset: [-0.28, 0.11, 0.28] }),
        'bau_lid_strap_l',
        'brushed_gold',
        '#f9a31b',
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.09, 0.23, 0.63, 0.012, '#f9a31b', { offset: [0.28, 0.11, 0.28] }),
        'bau_lid_strap_r',
        'brushed_gold',
        '#f9a31b',
        { lockVertical: true }
      ),
    ];
    const lidBaked = bakeTaggedPartsAsset(lidParts, {
      finishMode,
      texelsPerMeter: 32,
      seed: seed + 13,
      aoStrength,
      normalStrength,
      usePool: true,
      cacheKey: 'npc_bau:lid',
    });
    for (const p of lidParts) p.geometry.dispose();

    const lidMat = createPixelizerMaterialFromBaked(
      lidBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: objId,
        outlineColor: '#14101c',
        edgeHighlight: 0.38,
        edgeBevelWeight: 0.85,
        useColorGrading: true,
      },
      sharedResources
    );
    materials.push(lidMat);

    const lidMesh = new THREE.Mesh(lidBaked.geometry, lidMat);
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

    root.userData.unwrapMetrics = baseBaked.unwrapMetrics;

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
      dispose: () => {
        for (const m of meshes) m.geometry.dispose();
        disposeNpcMaterialsSafely(materials);
      },
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

  const tunicKind: MaterialRecipeId =
    id === 'npc.guarda' || id === 'npc.comandante'
      ? 'forged_steel'
      : id === 'npc.ferreiro' || id === 'npc.naturalista'
        ? 'stitched_leather'
        : 'woven_cloth';

  const emitHex =
    spec.prop === 'tome'
      ? '#249fde'
      : spec.prop === 'staff'
        ? '#1a7a3e'
        : spec.prop === 'gem' || spec.headgear === 'circlet'
          ? '#249fde'
          : null;

  const partSpecs: RigidPartSpec[] = [];
  let headMetrics: UnwrapMetricsSummary | null = null;

  const addBakedBone = (
    name: string,
    boneName: string,
    parts: TaggedGeometryPart[],
    inspectUvs = false
  ) => {
    const baked = bakeTaggedPartsAsset(parts, {
      finishMode,
      texelsPerMeter: 64,
      seed: seed + parts.length * 11,
      aoRays: 8,
      aoMaxDist: 0.32,
      aoStrength,
      normalStrength,
      eyeHex: '#285cc4',
      browHex: spec.hair,
      emblemHex: spec.accent,
      emissiveRuneHex: emitHex,
      usePool: true,
      cacheKey: `nwl_npc:${id}:${name}`,
      inspectUvs,
    });
    for (const p of parts) p.geometry.dispose();
    if (name === 'NPC_Head') {
      headMetrics = baked.unwrapMetrics;
    }
    partSpecs.push({
      name,
      boneName,
      geometry: baked.geometry,
      materialOptions: bakedToMaterialOptions(baked, {
        workflow: tunicKind === 'forged_steel' ? 'metallic' : 'specular',
        metallic: tunicKind === 'forged_steel' ? 0.24 : 0.0,
      }),
    });
  };

  addBakedBone('NPC_Pelvis', 'pelvis', [
    tagPart(
      makeBeveledBoneSegmentBox(pelvisLen * 1.1, 0.15, 0.105, 0.14, 0.1, 0.013, spec.pants),
      'npc_pelvis_pants',
      'woven_cloth',
      spec.pants
    ),
    tagPart(
      makeBeveledBoneSegmentBox(0.055, 0.16, 0.115, 0.16, 0.115, 0.01, spec.trim),
      'npc_pelvis_belt',
      'brushed_gold',
      spec.trim
    ),
  ]);

  addBakedBone('NPC_Spine1', 'spine_01', [
    tagPart(
      makeBeveledBoneSegmentBox(spine1Len * 1.1, 0.14, 0.1, 0.15, 0.11, 0.013, spec.tunic),
      'npc_spine1',
      tunicKind,
      spec.tunic,
      { accentHex: spec.trim }
    ),
  ]);

  addBakedBone('NPC_Spine2', 'spine_02', [
    tagPart(
      makeBeveledBoneSegmentBox(spine2Len * 1.1, 0.15, 0.11, 0.175, 0.125, 0.014, spec.tunic),
      'npc_spine2',
      tunicKind,
      spec.tunic,
      { accentHex: spec.trim, landmarkKind: 'chest_crest' }
    ),
  ]);

  const collar = makeBeveledBox(0.28, 0.052, 0.22, 0.01, spec.trim, {
    offset: [0, spine3Len * 0.78, 0],
  });
  addBakedBone('NPC_Spine3', 'spine_03', [
    tagPart(
      makeBeveledBoneSegmentBox(spine3Len * 0.92, 0.175, 0.12, 0.185, 0.128, 0.015, spec.tunic),
      'npc_spine3',
      tunicKind,
      spec.tunic,
      { accentHex: spec.trim }
    ),
    tagPart(collar, 'npc_collar', 'brushed_gold', spec.trim),
  ]);

  addBakedBone('NPC_Neck', 'neck_01', [
    tagPart(
      makeBeveledBoneSegmentBox(neckLen * 1.1, 0.052, 0.052, 0.048, 0.048, 0.008, SKIN_SHADOW),
      'npc_neck',
      'human_skin',
      SKIN_SHADOW
    ),
  ]);

  // Head + Semantic eyes/brows + Upgraded Headgear
  const headParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(0.215, 0.23, 0.215, 0.02, SKIN_BASE, { offset: [0, 0.11, 0] }),
      'npc_head',
      'human_skin',
      SKIN_BASE,
      { landmarkKind: 'head_front', lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.228, 0.09, 0.23, 0.016, spec.hair, { offset: [0, 0.2, -0.01] }),
      'npc_hair',
      'woven_cloth',
      spec.hair,
      { lockVertical: true }
    ),
  ];

  if (spec.headgear === 'helm') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.25, 0.22, 0.25, 0.024, spec.tunic, { offset: [0, 0.14, 0] }),
        'npc_helm',
        'forged_steel',
        spec.tunic
      ),
      tagPart(
        makeBeveledBox(0.054, 0.11, 0.22, 0.012, spec.trim, { offset: [0, 0.28, -0.01] }),
        'npc_helm_plume',
        'woven_cloth',
        spec.trim
      )
    );
  } else if (spec.headgear === 'hat_mage') {
    const brim = makeLatheProfile(
      [
        [0.14, 0.215],
        [0.27, 0.224],
        [0.26, 0.246],
        [0.14, 0.25],
      ],
      8,
      spec.tunic
    );
    const cone = makeLatheProfile(
      [
        [0.145, 0.24],
        [0.09, 0.39],
        [0.012, 0.535],
      ],
      8,
      spec.trim
    );
    headParts.push(
      tagPart(brim, 'npc_hat_brim', 'woven_cloth', spec.tunic, { accentHex: spec.trim }),
      tagPart(cone, 'npc_hat_cone', 'woven_cloth', spec.trim)
    );
  } else if (spec.headgear === 'beret' || spec.headgear === 'cap') {
    const cap = makeLatheProfile(
      [
        [0.125, 0.21],
        [0.15, 0.255],
        [0.11, 0.29],
      ],
      8,
      spec.trim
    );
    headParts.push(tagPart(cap, 'npc_cap', 'woven_cloth', spec.trim));
  } else if (spec.headgear === 'bandana') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.235, 0.068, 0.235, 0.012, spec.trim, { offset: [0, 0.195, 0] }),
        'npc_bandana',
        'woven_cloth',
        spec.trim
      )
    );
  } else if (spec.headgear === 'circlet') {
    const gem = prepareColoredPart(new THREE.OctahedronGeometry(0.036, 0), '#249fde');
    gem.translate(0, 0.195, 0.132);
    headParts.push(
      tagPart(
        makeBeveledBox(0.238, 0.042, 0.238, 0.01, spec.accent, { offset: [0, 0.19, 0] }),
        'npc_circlet',
        'brushed_gold',
        spec.accent
      ),
      tagPart(gem, 'npc_circlet_gem', 'runic_glow', '#249fde', { lockVertical: false })
    );
  } else if (spec.headgear === 'hood') {
    headParts.push(
      tagPart(
        makeBeveledBox(0.245, 0.21, 0.255, 0.022, spec.tunic, { offset: [0, 0.14, -0.015] }),
        'npc_hood',
        'stitched_leather',
        spec.tunic
      )
    );
  }
  addBakedBone('NPC_Head', 'Head', headParts, true);

  for (const side of ['l', 'r'] as const) {
    addBakedBone(`NPC_UA_${side}`, `upperarm_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(uArm * 0.96, 0.064, 0.064, 0.054, 0.054, 0.01, spec.tunic),
        `npc_ua_${side}`,
        tunicKind,
        spec.tunic
      ),
    ]);
    addBakedBone(`NPC_LA_${side}`, `lowerarm_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(lArm * 0.96, 0.052, 0.052, 0.044, 0.044, 0.008, spec.trim),
        `npc_la_${side}`,
        'stitched_leather',
        spec.trim
      ),
    ]);

    const handParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBoneSegmentBox(0.11, 0.044, 0.04, 0.038, 0.035, 0.007, SKIN_BASE),
        `npc_hand_${side}`,
        'human_skin',
        SKIN_BASE
      ),
    ];
    if (side === 'r') {
      handParts.push(...buildNpcHandPropParts(spec.prop, spec));
    }
    addBakedBone(`NPC_Hand_${side}`, `hand_${side}`, handParts);

    addBakedBone(`NPC_Thigh_${side}`, `thigh_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(thigh * 0.96, 0.082, 0.082, 0.064, 0.064, 0.012, spec.pants),
        `npc_thigh_${side}`,
        'woven_cloth',
        spec.pants
      ),
    ]);
    addBakedBone(`NPC_Calf_${side}`, `calf_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(calf * 0.96, 0.064, 0.064, 0.052, 0.052, 0.01, '#3b1725'),
        `npc_calf_${side}`,
        'stitched_leather',
        '#3b1725'
      ),
    ]);
    addBakedBone(`NPC_Foot_${side}`, `foot_${side}`, [
      tagPart(
        makeBeveledBoneSegmentBox(0.17, 0.054, 0.06, 0.048, 0.052, 0.009, '#141013'),
        `npc_foot_${side}`,
        'stitched_leather',
        '#141013'
      ),
    ]);
  }

  const rigidRes = attachRigidPartsToUalRig(rig, partSpecs, sharedResources, {
    objectId: objId,
    pixelSize: px,
  });

  const root = new THREE.Group();
  root.name = id;
  root.add(rig.armature);
  if (headMetrics) {
    root.userData.unwrapMetrics = headMetrics;
  }

  return {
    id,
    spec,
    rig,
    root,
    meshes: rigidRes.meshes,
    materials: rigidRes.materials,
    dispose: () => {
      for (const m of rigidRes.meshes) m.geometry.dispose();
      disposeNpcMaterialsSafely(rigidRes.materials);
    },
  };
}
