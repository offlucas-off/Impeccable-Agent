import * as THREE from 'three';
import { type PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import { voxelizeObject3DRigged } from '../Voxelizer';
import {
  attachRigidPartsToUalRig,
  bindGeometryToUalSkeleton,
  type RigidPartSpec,
} from '../rigging/AutoRigBinder';
import {
  createCanonicalUalRig,
  mountPropToUalSocket,
  type CanonicalUalRig,
  type UalGenderProfile,
  type UalRigBuildMode,
} from '../rigging/UalRigSpec';
import {
  bakeTaggedPartsAsset,
  bakedToMaterialOptions,
  type UnwrapMetricsSummary,
} from './PixelMaterialSynth';
import {
  makeAnatomicalTorsoGeometry,
  makeBeveledBox,
  makeLatheProfile,
  makePauldronShellGeometry,
  makePleatedTabardGeometry,
  makeSculptedLimbGeometry,
  makeSplineLoftGeometry,
  subdivideGeometryLoop,
  tagPart,
  type FinishMode,
  type MaterialRecipeId,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { buildProceduralProp, type PropKind } from './PropBuilder';
import { createSeededRng } from './SdfVoxelPrimitives';

export type CharacterArchetype = 'knight' | 'ranger' | 'mage' | 'zombie' | 'villager' | 'golem';

export interface CharacterBuildOptions {
  archetype?: CharacterArchetype;
  genderProfile?: UalGenderProfile;
  rigMode?: UalRigBuildMode;
  visualStyle?: 'lowpoly' | 'voxel';
  voxelResolution?: number;
  seed?: number;
  equipMainHand?: PropKind | 'auto' | 'none';
  equipOffHand?: PropKind | 'auto' | 'none';
  pixelSize?: number;
  objectId?: number;
  finishMode?: FinishMode;
  aoStrength?: number;
  normalStrength?: number;
}

export interface GeneratedCharacterResult {
  name: string;
  archetype: CharacterArchetype;
  rigMode: UalRigBuildMode;
  visualStyle: 'lowpoly' | 'voxel';
  rig: CanonicalUalRig;
  root: THREE.Group;
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  dispose?: () => void;
}

interface ArchetypePalette {
  skin: string;
  armorPrimary: string;
  armorSecondary: string;
  cloth: string;
  accent: string;
  boots: string;
  hair: string;
  defaultMain: PropKind | 'none';
  defaultOff: PropKind | 'none';
  bulkyScale: number;
}

const ARCHETYPE_PALETTES: Record<CharacterArchetype, ArchetypePalette> = {
  knight: {
    skin: '#e0b090',
    armorPrimary: '#8a96ad',
    armorSecondary: '#545f75',
    cloth: '#8f2934',
    accent: '#e3b84c',
    boots: '#3f3532',
    hair: '#4d3321',
    defaultMain: 'sword',
    defaultOff: 'shield',
    bulkyScale: 1.08,
  },
  ranger: {
    skin: '#d9a482',
    armorPrimary: '#366642',
    armorSecondary: '#664329',
    cloth: '#264430',
    accent: '#c9a653',
    boots: '#452d1d',
    hair: '#693d1e',
    defaultMain: 'axe',
    defaultOff: 'torch',
    bulkyScale: 0.96,
  },
  mage: {
    skin: '#e3b89a',
    armorPrimary: '#47367d',
    armorSecondary: '#2c2254',
    cloth: '#6c49a8',
    accent: '#42e0f5',
    boots: '#302338',
    hair: '#cfd6e3',
    defaultMain: 'staff',
    defaultOff: 'none',
    bulkyScale: 0.95,
  },
  zombie: {
    skin: '#7eb36b',
    armorPrimary: '#635f52',
    armorSecondary: '#4d433b',
    cloth: '#7a4942',
    accent: '#9cd17b',
    boots: '#3b322e',
    hair: '#354032',
    defaultMain: 'axe',
    defaultOff: 'none',
    bulkyScale: 0.98,
  },
  villager: {
    skin: '#dfa987',
    armorPrimary: '#946b45',
    armorSecondary: '#61442a',
    cloth: '#466c8f',
    accent: '#d6ae5e',
    boots: '#47301e',
    hair: '#5c3c22',
    defaultMain: 'none',
    defaultOff: 'none',
    bulkyScale: 1.0,
  },
  golem: {
    skin: '#646c7d',
    armorPrimary: '#525866',
    armorSecondary: '#383d47',
    cloth: '#414652',
    accent: '#45e6ff',
    boots: '#2d313b',
    hair: '#788296',
    defaultMain: 'none',
    defaultOff: 'none',
    bulkyScale: 1.28,
  },
};

function getBoneSpanY(rig: CanonicalUalRig, boneName: string, fallback: number): number {
  const b = rig.boneByName.get(boneName);
  if (!b || b.children.length === 0) return fallback;
  for (const ch of b.children) {
    if (ch instanceof THREE.Bone && ch.position.y > 0.02) {
      return ch.position.y;
    }
  }
  return fallback;
}

function disposeCharacterMaterialsSafely(materials: PixelizerMaterial[]): void {
  const seen = new Set<THREE.Texture>();
  for (const mat of materials) {
    const o = mat.options;
    for (const tex of [
      o.albedoMap,
      o.normalMap,
      o.roughnessMap,
      o.aoMap,
      o.metalnessMap,
      o.emissionMap,
    ]) {
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

export type StylizedHairStyle =
  | 'layered_ponytail'
  | 'layered_bob'
  | 'swept_short'
  | 'under_hat_locks';

export interface StylizedHairOptions {
  style?: StylizedHairStyle;
  scale?: number;
  tagPrefix?: string;
  recipe?: MaterialRecipeId;
  accentHex?: string;
  includeBangs?: boolean;
}

function scaleLoftPts(
  pts: ReadonlyArray<readonly [number, number, number]>,
  s: number
): [number, number, number][] {
  return pts.map(([x, y, z]) => [x * s, y * s, z * s]);
}

function scaleLoftRadii(
  radii: ReadonlyArray<readonly [number, number]>,
  s: number
): [number, number][] {
  return radii.map(([rx, ry]) => [Math.max(0.004, rx * s), Math.max(0.004, ry * s)]);
}

/**
 * Builds curved, tapered `makeSplineLoftGeometry` hair strands (layered crown sweeps,
 * parted anime bangs above the brow line, cheek-framing side locks, and tapered back/ponytail)
 * mounted in `Head`-local coordinates (Blu/Reze-inspired layered silhouette).
 */
export function buildStylizedHairParts(
  hairHex: string,
  options: StylizedHairOptions = {}
): TaggedGeometryPart[] {
  const style = options.style ?? 'layered_ponytail';
  const s = options.scale ?? 1.0;
  const prefix = options.tagPrefix ?? 'hair';
  const recipe: MaterialRecipeId = options.recipe ?? 'woven_cloth';
  const accentHex = options.accentHex ?? hairHex;
  const includeBangs = options.includeBangs ?? true;
  const parts: TaggedGeometryPart[] = [];

  const pushStrand = (
    name: string,
    pts: ReadonlyArray<readonly [number, number, number]>,
    radii: ReadonlyArray<readonly [number, number]>,
    radialSegs = 6,
    tubularSegs = 6
  ) => {
    const geo = makeSplineLoftGeometry(
      scaleLoftPts(pts, s),
      scaleLoftRadii(radii, s),
      radialSegs,
      tubularSegs,
      { colorHex: hairHex }
    );
    parts.push(
      tagPart(geo, `${prefix}_${name}`, recipe, hairHex, {
        accentHex,
        lockVertical: false,
      })
    );
  };

  if (style !== 'under_hat_locks') {
    // Layered crown sweeps hugging the cranium without boxy cuboid edges
    pushStrand(
      'crown_center',
      [
        [0, 0.212, 0.095],
        [0, 0.242, 0.02],
        [0, 0.22, -0.075],
        [0, 0.118, -0.122],
        [0, 0.036, -0.116],
      ],
      [
        [0.048, 0.015],
        [0.068, 0.024],
        [0.074, 0.026],
        [0.056, 0.022],
        [0.03, 0.014],
      ],
      8,
      8
    );

    for (const [idx, sx] of [-1, 1].entries()) {
      pushStrand(
        `crown_side_${idx}`,
        [
          [sx * 0.052, 0.205, 0.082],
          [sx * 0.095, 0.218, 0.01],
          [sx * 0.104, 0.172, -0.068],
          [sx * 0.072, 0.088, -0.112],
          [sx * 0.042, 0.028, -0.108],
        ],
        [
          [0.036, 0.015],
          [0.048, 0.022],
          [0.052, 0.024],
          [0.04, 0.02],
          [0.022, 0.012],
        ],
        8,
        8
      );
    }
  }

  // Swept parted bangs (hovering cleanly in front of forehead, stopping above eye line)
  if (includeBangs) {
    if (style === 'under_hat_locks') {
      for (const [idx, sx] of [-1, 1].entries()) {
        pushStrand(
          `hat_bang_${idx}`,
          [
            [sx * 0.022, 0.205, 0.092],
            [sx * 0.062, 0.184, 0.115],
            [sx * 0.092, 0.145, 0.105],
          ],
          [
            [0.02, 0.01],
            [0.018, 0.01],
            [0.007, 0.006],
          ],
          6,
          6
        );
      }
    } else {
      pushStrand(
        'bang_l',
        [
          [-0.015, 0.225, 0.078],
          [-0.055, 0.205, 0.116],
          [-0.088, 0.165, 0.114],
          [-0.098, 0.128, 0.098],
        ],
        [
          [0.026, 0.012],
          [0.028, 0.013],
          [0.02, 0.01],
          [0.007, 0.006],
        ],
        6,
        7
      );
      pushStrand(
        'bang_r',
        [
          [0.012, 0.225, 0.078],
          [0.048, 0.206, 0.116],
          [0.084, 0.168, 0.114],
          [0.096, 0.13, 0.098],
        ],
        [
          [0.025, 0.012],
          [0.027, 0.013],
          [0.019, 0.01],
          [0.007, 0.006],
        ],
        6,
        7
      );
      // Asymmetric parted forehead wisps (matching Blu/Reze silhouette)
      pushStrand(
        'bang_c1',
        [
          [0.008, 0.224, 0.084],
          [-0.012, 0.202, 0.117],
          [-0.028, 0.174, 0.118],
          [-0.036, 0.154, 0.113],
        ],
        [
          [0.02, 0.01],
          [0.022, 0.011],
          [0.014, 0.008],
          [0.006, 0.005],
        ],
        6,
        6
      );
      pushStrand(
        'bang_c2',
        [
          [0.024, 0.222, 0.084],
          [0.034, 0.198, 0.116],
          [0.028, 0.172, 0.118],
          [0.018, 0.155, 0.114],
        ],
        [
          [0.018, 0.01],
          [0.02, 0.01],
          [0.012, 0.008],
          [0.005, 0.005],
        ],
        6,
        6
      );
    }
  }

  // Cheek-framing tapered side locks
  const longSide = style === 'layered_ponytail' || style === 'layered_bob';
  for (const [idx, sx] of [-1, 1].entries()) {
    if (longSide) {
      pushStrand(
        `side_${idx}`,
        [
          [sx * 0.096, 0.195, 0.048],
          [sx * 0.118, 0.145, 0.068],
          [sx * 0.115, 0.082, 0.07],
          [sx * 0.098, 0.025, 0.056],
        ],
        [
          [0.018, 0.022],
          [0.016, 0.022],
          [0.012, 0.016],
          [0.006, 0.007],
        ],
        6,
        7
      );
    } else {
      pushStrand(
        `side_${idx}`,
        [
          [sx * 0.096, 0.19, 0.045],
          [sx * 0.113, 0.142, 0.058],
          [sx * 0.105, 0.088, 0.052],
        ],
        [
          [0.016, 0.02],
          [0.014, 0.018],
          [0.006, 0.007],
        ],
        6,
        6
      );
    }
  }

  // Back silhouette: ponytail, layered bob, swept crest, or under-hat nape locks
  if (style === 'layered_ponytail') {
    pushStrand(
      'ponytail_main',
      [
        [0, 0.148, -0.118],
        [0, 0.122, -0.172],
        [0, 0.035, -0.198],
        [0, -0.065, -0.185],
        [0, -0.135, -0.152],
      ],
      [
        [0.026, 0.024],
        [0.042, 0.036],
        [0.038, 0.032],
        [0.024, 0.022],
        [0.008, 0.008],
      ],
      8,
      8
    );
    pushStrand(
      'ponytail_wisp',
      [
        [0.018, 0.142, -0.122],
        [0.042, 0.095, -0.176],
        [0.046, 0.01, -0.186],
        [0.028, -0.08, -0.168],
      ],
      [
        [0.016, 0.014],
        [0.022, 0.018],
        [0.016, 0.014],
        [0.006, 0.006],
      ],
      6,
      7
    );
  } else if (style === 'layered_bob') {
    for (const [idx, ox] of [-0.056, 0, 0.056].entries()) {
      pushStrand(
        `bob_back_${idx}`,
        [
          [ox, 0.175, -0.108],
          [ox * 1.18, 0.105, -0.128],
          [ox * 0.96, 0.035, -0.116],
          [ox * 0.7, 0.008, -0.095],
        ],
        [
          [0.032, 0.018],
          [0.036, 0.02],
          [0.026, 0.015],
          [0.008, 0.007],
        ],
        6,
        7
      );
    }
  } else if (style === 'swept_short') {
    for (const [idx, sx] of [-1, 1].entries()) {
      pushStrand(
        `swept_tip_${idx}`,
        [
          [sx * 0.032, 0.224, -0.025],
          [sx * 0.046, 0.23, -0.095],
          [sx * 0.034, 0.174, -0.136],
        ],
        [
          [0.026, 0.018],
          [0.024, 0.018],
          [0.007, 0.007],
        ],
        6,
        6
      );
    }
  } else if (style === 'under_hat_locks') {
    for (const [idx, ox] of [-0.048, 0, 0.048].entries()) {
      pushStrand(
        `nape_${idx}`,
        [
          [ox, 0.145, -0.112],
          [ox * 1.1, 0.08, -0.126],
          [ox * 0.9, 0.02, -0.108],
        ],
        [
          [0.026, 0.014],
          [0.024, 0.014],
          [0.008, 0.006],
        ],
        6,
        6
      );
    }
  }

  return parts;
}

/**
 * Generates an autonomous humanoid character built natively onto the 65-bone Quaternius UAL rig,
 * supporting both NWL rigid-bone segmentation (`skinnedMeshes: 0`) and smooth capsule SkinnedMesh / Voxel 3D.
 */
export function buildProceduralUalCharacter(
  options: CharacterBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedCharacterResult {
  const archetype = options.archetype ?? 'knight';
  const profile = options.genderProfile ?? 'male';
  const rigMode = options.rigMode ?? 'skinned_mesh';
  const visualStyle = options.visualStyle ?? 'lowpoly';
  const seed = options.seed ?? 42;
  const rng = createSeededRng(seed);
  const pal = ARCHETYPE_PALETTES[archetype];
  const objId = options.objectId ?? 10;
  const px = options.pixelSize ?? 1;
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;

  const skinRecipe: MaterialRecipeId =
    archetype === 'zombie'
      ? 'goblin_skin'
      : archetype === 'golem'
        ? 'stone_masonry'
        : 'human_skin';
  const armorPrimRecipe: MaterialRecipeId =
    archetype === 'golem'
      ? 'stone_masonry'
      : archetype === 'knight'
        ? 'forged_steel'
        : archetype === 'ranger'
          ? 'stitched_leather'
          : 'woven_cloth';
  const armorSecRecipe: MaterialRecipeId =
    archetype === 'golem'
      ? 'mossy_cobble'
      : archetype === 'knight'
        ? 'forged_steel'
        : 'stitched_leather';
  const clothRecipe: MaterialRecipeId = archetype === 'golem' ? 'stone_masonry' : 'woven_cloth';
  const bootsRecipe: MaterialRecipeId =
    archetype === 'golem'
      ? 'stone_masonry'
      : archetype === 'knight'
        ? 'forged_steel'
        : 'stitched_leather';
  const eyeHex =
    archetype === 'zombie' ? '#9cd17b' : archetype === 'golem' ? '#45e6ff' : '#285cc4';
  const eyeGlowHex =
    archetype === 'golem' ? '#45e6ff' : archetype === 'zombie' ? '#b4ec78' : null;
  const emitRuneHex = archetype === 'golem' || archetype === 'mage' ? pal.accent : null;

  const rig = createCanonicalUalRig(profile, 1.0);
  const bulk = pal.bulkyScale * (profile === 'female' ? 0.92 : 1.0) * (0.96 + rng() * 0.08);

  const pelvisLen = getBoneSpanY(rig, 'pelvis', 0.138);
  const spine1Len = getBoneSpanY(rig, 'spine_01', 0.124);
  const spine2Len = getBoneSpanY(rig, 'spine_02', 0.141);
  const spine3Len = getBoneSpanY(rig, 'spine_03', 0.173);
  const neckLen = getBoneSpanY(rig, 'neck_01', 0.083);
  const upperArmL = getBoneSpanY(rig, 'upperarm_l', 0.274);
  const lowerArmL = getBoneSpanY(rig, 'lowerarm_l', 0.273);
  const upperArmR = getBoneSpanY(rig, 'upperarm_r', 0.274);
  const lowerArmR = getBoneSpanY(rig, 'lowerarm_r', 0.273);
  const thighLen = getBoneSpanY(rig, 'thigh_l', 0.4);
  const calfLen = getBoneSpanY(rig, 'calf_l', 0.43);

  interface BoneTaggedGroup {
    name: string;
    boneName: string;
    parts: TaggedGeometryPart[];
    inspectUvs?: boolean;
  }

  const boneGroups: BoneTaggedGroup[] = [];

  // Pelvis & belt (anatomical sculpted pelvis + contoured belt & buckle)
  const pelvisGeo = makeAnatomicalTorsoGeometry(
    pelvisLen * 1.15,
    0.155 * bulk,
    0.115 * bulk,
    0.145 * bulk,
    0.105 * bulk,
    { radialSegs: 16, heightSegs: 5, hexColor: pal.cloth, musculature: 0.7 }
  );
  const beltGeo = makeAnatomicalTorsoGeometry(
    0.058,
    0.165 * bulk,
    0.125 * bulk,
    0.165 * bulk,
    0.125 * bulk,
    { radialSegs: 16, heightSegs: 4, hexColor: pal.accent, musculature: 0.3 }
  );
  boneGroups.push({
    name: 'Pelvis_Belt',
    boneName: 'pelvis',
    parts: [
      tagPart(pelvisGeo, 'char_pelvis_skirt', clothRecipe, pal.cloth),
      tagPart(
        beltGeo,
        'char_pelvis_belt',
        archetype === 'golem' ? 'runic_glow' : 'brushed_gold',
        pal.accent
      ),
    ],
  });

  // Lower & mid torso (anatomical V-tapered waist & sculpted ribcage/breastplate)
  const isArmoredChest = archetype === 'knight' || archetype === 'golem';
  boneGroups.push({
    name: 'Torso_Lower',
    boneName: 'spine_01',
    parts: [
      tagPart(
        makeAnatomicalTorsoGeometry(
          spine1Len * 1.1,
          0.14 * bulk,
          0.1 * bulk,
          0.155 * bulk,
          0.11 * bulk,
          { isArmored: isArmoredChest, radialSegs: 16, heightSegs: 5, hexColor: pal.armorSecondary }
        ),
        'char_spine1',
        armorSecRecipe,
        pal.armorSecondary,
        { accentHex: pal.accent }
      ),
    ],
  });

  boneGroups.push({
    name: 'Torso_Mid',
    boneName: 'spine_02',
    parts: [
      tagPart(
        makeAnatomicalTorsoGeometry(
          spine2Len * 1.12,
          0.155 * bulk,
          0.11 * bulk,
          0.18 * bulk,
          0.125 * bulk,
          { isArmored: isArmoredChest, radialSegs: 18, heightSegs: 6, hexColor: pal.armorPrimary }
        ),
        'char_spine2',
        armorPrimRecipe,
        pal.armorPrimary,
        { accentHex: pal.accent, landmarkKind: 'chest_crest' }
      ),
    ],
  });

  // Upper chest (+ pleated back mantle integrated on spine_03 without separate cloth mesh objects)
  const chestParts: TaggedGeometryPart[] = [
    tagPart(
      makeAnatomicalTorsoGeometry(
        spine3Len * 0.94,
        0.18 * bulk,
        0.125 * bulk,
        0.195 * bulk,
        0.13 * bulk,
        { isArmored: isArmoredChest, radialSegs: 18, heightSegs: 7, hexColor: pal.armorPrimary }
      ),
      'char_spine3',
      armorPrimRecipe,
      pal.armorPrimary,
      { accentHex: pal.accent }
    ),
  ];
  if (archetype === 'knight' || archetype === 'ranger') {
    const mantleGeo = makePleatedTabardGeometry(0.26 * bulk, 0.38 * bulk, 0.54, 0.036, 4, pal.cloth, {
      offset: [0, -0.13, -0.14 * bulk],
      flareZ: -0.05,
    });
    chestParts.push(
      tagPart(mantleGeo, 'char_back_mantle', 'woven_cloth', pal.cloth, { accentHex: pal.accent })
    );
  }
  boneGroups.push({ name: 'Torso_Chest', boneName: 'spine_03', parts: chestParts });

  // Neck
  boneGroups.push({
    name: 'Neck',
    boneName: 'neck_01',
    parts: [
      tagPart(
        makeSculptedLimbGeometry(
          neckLen * 1.1,
          0.056 * bulk,
          0.056 * bulk,
          0.05 * bulk,
          0.05 * bulk,
          { profile: 'taper', radialSegs: 14, heightSegs: 4, hexColor: pal.skin }
        ),
        'char_neck',
        skinRecipe,
        pal.skin
      ),
    ],
  });

  // Head + Clean Front-Facing Semantic Eyes/Brows + Sculpted Headgear / Stylized Hair
  const headGeo = makeBeveledBox(0.22 * bulk, 0.24 * bulk, 0.22 * bulk, 0.026 * bulk, pal.skin, {
    offset: [0, 0.11 * bulk, 0],
  });
  const headParts: TaggedGeometryPart[] = [
    tagPart(headGeo, 'head_front', skinRecipe, pal.skin, {
      landmarkKind: 'head_front',
      lockVertical: true,
      islandScaleBias: 2.6,
    }),
  ];
  if (archetype === 'knight') {
    const helmDome = makeLatheProfile(
      [
        [0.128 * bulk, 0.04 * bulk],
        [0.145 * bulk, 0.13 * bulk],
        [0.132 * bulk, 0.22 * bulk],
        [0.08 * bulk, 0.268 * bulk],
        [0.008 * bulk, 0.28 * bulk],
      ],
      16,
      pal.armorPrimary,
      { smoothRadialNormals: true }
    );
    const visorRaw = makeBeveledBox(0.2 * bulk, 0.058 * bulk, 0.08 * bulk, 0.014 * bulk, pal.armorSecondary, {
      offset: [0, 0.115 * bulk, 0.105 * bulk],
    });
    const visor = subdivideGeometryLoop(visorRaw, 1, { defaultHex: pal.armorSecondary });
    visorRaw.dispose();
    const crest = makeSplineLoftGeometry(
      [
        [0, 0.255 * bulk, 0.08 * bulk],
        [0, 0.315 * bulk, 0.0],
        [0, 0.285 * bulk, -0.11 * bulk],
        [0, 0.16 * bulk, -0.16 * bulk],
      ],
      [
        [0.018 * bulk, 0.03 * bulk],
        [0.028 * bulk, 0.05 * bulk],
        [0.025 * bulk, 0.045 * bulk],
        [0.012 * bulk, 0.022 * bulk],
      ],
      10,
      14,
      { colorHex: pal.cloth }
    );
    headParts.push(
      tagPart(helmDome, 'char_knight_helm', 'forged_steel', pal.armorPrimary, { accentHex: pal.accent }),
      tagPart(visor, 'char_knight_visor', 'forged_steel', pal.armorSecondary),
      tagPart(crest, 'char_knight_crest', 'woven_cloth', pal.cloth)
    );
  } else if (archetype === 'mage') {
    const brim = makeLatheProfile(
      [
        [0.135, 0.215 * bulk],
        [0.285, 0.224 * bulk],
        [0.275, 0.246 * bulk],
        [0.135, 0.252 * bulk],
      ],
      16,
      pal.armorPrimary,
      { smoothRadialNormals: true }
    );
    const cone = makeSplineLoftGeometry(
      [
        [0, 0.24 * bulk, 0],
        [0, 0.37 * bulk, -0.025],
        [0, 0.49 * bulk, -0.09],
        [0, 0.54 * bulk, -0.15],
      ],
      [0.145, 0.095, 0.045, 0.012],
      14,
      14,
      { colorHex: pal.cloth }
    );
    headParts.push(
      tagPart(brim, 'char_mage_brim', 'woven_cloth', pal.armorPrimary, { accentHex: pal.accent }),
      tagPart(cone, 'char_mage_cone', 'woven_cloth', pal.cloth, { accentHex: pal.accent }),
      ...buildStylizedHairParts(pal.hair, {
        style: 'under_hat_locks',
        scale: bulk,
        tagPrefix: 'char_hair',
        accentHex: pal.hair,
      })
    );
  } else if (archetype === 'ranger') {
    const rawHood = makeBeveledBox(0.25 * bulk, 0.24 * bulk, 0.26 * bulk, 0.036 * bulk, pal.armorPrimary, {
      offset: [0, 0.14 * bulk, -0.018],
    });
    const hood = subdivideGeometryLoop(rawHood, 1, { defaultHex: pal.armorPrimary });
    rawHood.dispose();
    headParts.push(
      tagPart(hood, 'char_ranger_hood', 'stitched_leather', pal.armorPrimary, { accentHex: pal.accent }),
      ...buildStylizedHairParts(pal.hair, {
        style: 'under_hat_locks',
        scale: bulk * 0.96,
        tagPrefix: 'char_hair',
        accentHex: pal.hair,
      })
    );
  } else if (archetype === 'golem') {
    headParts.push(
      ...buildStylizedHairParts(pal.hair, {
        style: 'swept_short',
        scale: bulk,
        tagPrefix: 'char_golem_crest',
        recipe: 'mossy_cobble',
        accentHex: pal.accent,
        includeBangs: false,
      })
    );
  } else {
    const hairStyle: StylizedHairStyle =
      archetype === 'villager' && profile === 'female'
        ? 'layered_ponytail'
        : archetype === 'villager'
          ? 'layered_bob'
          : 'swept_short';
    headParts.push(
      ...buildStylizedHairParts(pal.hair, {
        style: hairStyle,
        scale: bulk,
        tagPrefix: 'char_hair',
        accentHex: pal.hair,
      })
    );
  }
  boneGroups.push({ name: 'Head_Unit', boneName: 'Head', parts: headParts, inspectUvs: true });

  // Arms (Left & Right) + Curved Tiered Pauldrons
  const buildArm = (side: 'l' | 'r', uLen: number, lLen: number) => {
    const uParts: TaggedGeometryPart[] = [
      tagPart(
        makeSculptedLimbGeometry(
          uLen * 0.96,
          0.068 * bulk,
          0.068 * bulk,
          0.056 * bulk,
          0.056 * bulk,
          { profile: 'bicep', radialSegs: 14, heightSegs: 6, hexColor: pal.armorSecondary }
        ),
        `char_ua_${side}`,
        armorSecRecipe,
        pal.armorSecondary,
        { accentHex: pal.accent }
      ),
    ];
    if (archetype === 'knight' || archetype === 'golem') {
      const pauldron = makePauldronShellGeometry(
        0.18 * bulk,
        0.14 * bulk,
        0.19 * bulk,
        0.03,
        pal.armorPrimary
      );
      if (side === 'r') pauldron.rotateY(Math.PI);
      pauldron.translate(side === 'l' ? 0.03 : -0.03, 0.05, 0);
      uParts.push(
        tagPart(pauldron, `char_pauldron_${side}`, armorPrimRecipe, pal.armorPrimary, {
          accentHex: pal.accent,
          lockVertical: false,
        })
      );
    }
    boneGroups.push({ name: `UpperArm_${side}`, boneName: `upperarm_${side}`, parts: uParts });
    boneGroups.push({
      name: `LowerArm_${side}`,
      boneName: `lowerarm_${side}`,
      parts: [
        tagPart(
          makeSculptedLimbGeometry(
            lLen * 0.96,
            0.056 * bulk,
            0.056 * bulk,
            0.046 * bulk,
            0.046 * bulk,
            {
              profile: archetype === 'knight' ? 'armor_limb' : 'forearm',
              radialSegs: 14,
              heightSegs: 6,
              hexColor: pal.armorPrimary,
            }
          ),
          `char_la_${side}`,
          armorPrimRecipe,
          pal.armorPrimary,
          { accentHex: pal.accent }
        ),
      ],
    });
    boneGroups.push({
      name: `Hand_${side}`,
      boneName: `hand_${side}`,
      parts: [
        tagPart(
          makeSculptedLimbGeometry(
            0.12,
            0.046 * bulk,
            0.042 * bulk,
            0.04 * bulk,
            0.036 * bulk,
            { profile: 'taper', radialSegs: 12, heightSegs: 4, hexColor: pal.skin }
          ),
          `char_hand_${side}`,
          skinRecipe,
          pal.skin
        ),
      ],
    });
  };
  buildArm('l', upperArmL, lowerArmL);
  buildArm('r', upperArmR, lowerArmR);

  // Legs & Boots (Anatomical Thighs, Calves/Greaves & Boots)
  for (const side of ['l', 'r'] as const) {
    boneGroups.push({
      name: `Thigh_${side}`,
      boneName: `thigh_${side}`,
      parts: [
        tagPart(
          makeSculptedLimbGeometry(
            thighLen * 0.96,
            0.088 * bulk,
            0.088 * bulk,
            0.068 * bulk,
            0.068 * bulk,
            { profile: 'thigh', radialSegs: 14, heightSegs: 7, hexColor: pal.cloth }
          ),
          `char_thigh_${side}`,
          clothRecipe,
          pal.cloth
        ),
      ],
    });
    boneGroups.push({
      name: `Calf_${side}`,
      boneName: `calf_${side}`,
      parts: [
        tagPart(
          makeSculptedLimbGeometry(
            calfLen * 0.96,
            0.068 * bulk,
            0.068 * bulk,
            0.054 * bulk,
            0.054 * bulk,
            {
              profile: archetype === 'knight' ? 'armor_limb' : 'calf',
              radialSegs: 14,
              heightSegs: 7,
              hexColor: pal.boots,
            }
          ),
          `char_calf_${side}`,
          bootsRecipe,
          pal.boots
        ),
      ],
    });
    boneGroups.push({
      name: `Foot_${side}`,
      boneName: `foot_${side}`,
      parts: [
        tagPart(
          makeSculptedLimbGeometry(
            0.18,
            0.058 * bulk,
            0.065 * bulk,
            0.05 * bulk,
            0.055 * bulk,
            { profile: 'taper', radialSegs: 12, heightSegs: 4, hexColor: pal.boots }
          ),
          `char_foot_${side}`,
          bootsRecipe,
          pal.boots
        ),
      ],
    });
  }

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];
  let keyMetrics: UnwrapMetricsSummary | null = null;

  if (rigMode === 'rigid_segments' && visualStyle === 'lowpoly') {
    const partSpecs: RigidPartSpec[] = [];
    for (const grp of boneGroups) {
      const baked = bakeTaggedPartsAsset(grp.parts, {
        finishMode,
        texelsPerMeter: 64,
        seed: seed + grp.parts.length * 11,
        aoRays: 10,
        aoMaxDist: 0.34,
        aoStrength,
        normalStrength,
        eyeHex,
        eyeGlowHex,
        browHex: pal.hair,
        emblemHex: pal.accent,
        emissiveRuneHex: emitRuneHex,
        usePool: true,
        cacheKey: `ual_rigid:${archetype}:${profile}:${grp.name}`,
        inspectUvs: Boolean(grp.inspectUvs),
      });
      for (const p of grp.parts) p.geometry.dispose();
      if (grp.inspectUvs || !keyMetrics) keyMetrics = baked.unwrapMetrics;
      partSpecs.push({
        name: grp.name,
        boneName: grp.boneName,
        geometry: baked.geometry,
        materialOptions: bakedToMaterialOptions(baked, {
          workflow: armorPrimRecipe === 'forged_steel' ? 'metallic' : 'specular',
          metallic: armorPrimRecipe === 'forged_steel' ? 0.25 : 0.04,
        }),
      });
    }
    const rigidRes = attachRigidPartsToUalRig(rig, partSpecs, sharedResources, {
      objectId: objId,
      pixelSize: px,
    });
    meshes.push(...rigidRes.meshes);
    materials.push(...rigidRes.materials);
  } else {
    rig.skeleton.pose();
    rig.armature.updateMatrixWorld(true);
    const invArmature = new THREE.Matrix4().copy(rig.armature.matrixWorld).invert();
    const boneIdxByName = new Map<string, number>();
    rig.bones.forEach((b, i) => boneIdxByName.set(b.name, i));

    const worldParts: TaggedGeometryPart[] = [];
    const partTagToBoneIndex = new Map<string, number>();
    const mToArm = new THREE.Matrix4();

    for (const grp of boneGroups) {
      const bone = rig.boneByName.get(grp.boneName) ?? rig.rootBone;
      const bIdx = boneIdxByName.get(bone.name) ?? 0;
      mToArm.multiplyMatrices(invArmature, bone.matrixWorld);
      for (const p of grp.parts) {
        p.geometry.applyMatrix4(mToArm);
        partTagToBoneIndex.set(p.partTag, bIdx);
        worldParts.push(p);
      }
    }

    const baked = bakeTaggedPartsAsset(worldParts, {
      finishMode: visualStyle === 'voxel' ? 'textured_ao' : finishMode,
      texelsPerMeter: 48,
      seed,
      aoRays: 12,
      aoMaxDist: 0.42,
      aoStrength,
      normalStrength,
      eyeHex,
      eyeGlowHex,
      browHex: pal.hair,
      emblemHex: pal.accent,
      emissiveRuneHex: emitRuneHex,
      usePool: true,
      cacheKey: `ual_skin:${archetype}:${profile}`,
      partTagToBoneIndex,
      subdivideMaxEdgeM: 0,
      inspectUvs: false,
    });
    for (const p of worldParts) p.geometry.dispose();
    keyMetrics = baked.unwrapMetrics;

    if (visualStyle === 'voxel') {
      const tmpMat = new THREE.MeshStandardMaterial({
        map: baked.textures?.albedoMap ?? null,
        vertexColors: true,
      });
      const tmp = new THREE.Mesh(baked.geometry, tmpMat);
      const voxRes = voxelizeObject3DRigged(
        tmp,
        {
          resolution: options.voxelResolution ?? 24,
          profile,
          targetUalRig: rig,
          fillSolidInterior: true,
        },
        sharedResources,
        { objectId: objId, pixelSize: 1 }
      );
      baked.geometry.dispose();
      tmpMat.dispose();
      meshes.push(voxRes.skinnedMesh);
      materials.push(voxRes.material);
    } else {
      const bound = bindGeometryToUalSkeleton(
        baked.geometry,
        rig,
        bakedToMaterialOptions(baked, {
          objectId: objId,
          pixelSize: px,
          workflow: armorPrimRecipe === 'forged_steel' ? 'metallic' : 'specular',
          metallic: armorPrimRecipe === 'forged_steel' ? 0.25 : 0.04,
        }),
        sharedResources,
        {
          name: `UAL_${archetype}_Skinned`,
          perVertexBoneIndices: baked.perVertexBoneIndices,
        }
      );
      meshes.push(bound.mesh);
      materials.push(bound.material);
    }
  }

  // Equip weapons / offhand into canonical UAL sockets forwarding finishMode
  const mainKind =
    options.equipMainHand === 'auto' || options.equipMainHand === undefined
      ? pal.defaultMain
      : options.equipMainHand;
  const offKind =
    options.equipOffHand === 'auto' || options.equipOffHand === undefined
      ? pal.defaultOff
      : options.equipOffHand;

  if (mainKind !== 'none') {
    const propR = buildProceduralProp(
      {
        kind: mainKind,
        seed: seed + 11,
        visualStyle,
        objectId: objId,
        pixelSize: visualStyle === 'voxel' ? 1 : px,
        finishMode,
        aoStrength,
        normalStrength,
      },
      sharedResources
    );
    mountPropToUalSocket(rig, 'hand_r', propR.root);
    propR.root.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    materials.push(...propR.materials);
  }

  if (offKind !== 'none') {
    const propL = buildProceduralProp(
      {
        kind: offKind,
        seed: seed + 29,
        visualStyle,
        objectId: objId,
        pixelSize: visualStyle === 'voxel' ? 1 : px,
        finishMode,
        aoStrength,
        normalStrength,
      },
      sharedResources
    );
    mountPropToUalSocket(rig, 'hand_l', propL.root);
    propL.root.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    materials.push(...propL.materials);
  }

  const root = new THREE.Group();
  root.name = `Char_${archetype}_${seed}`;
  root.userData.unwrapMetrics = keyMetrics;
  root.add(rig.armature);

  return {
    name: root.name,
    archetype,
    rigMode,
    visualStyle,
    rig,
    root,
    meshes,
    materials,
    dispose: () => {
      for (const m of meshes) m.geometry.dispose();
      disposeCharacterMaterialsSafely(materials);
    },
  };
}

