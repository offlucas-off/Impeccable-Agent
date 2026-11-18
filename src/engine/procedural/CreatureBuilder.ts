import * as THREE from 'three';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import {
  buildQuadrupedAnimClips,
  createCanonicalQuadrupedRig,
  type CanonicalQuadrupedRig,
} from '../rigging/QuadrupedRigSpec';
import { bakeTaggedPartsAsset, type BakedAssetResult } from './PixelMaterialSynth';
import {
  makeAnatomicalTorsoGeometry,
  makeBeveledBox,
  makeCurvedHornGeometry,
  makeSculptedLimbGeometry,
  makeSdfOrganicMesh,
  makeSplineLoftGeometry,
  makeSwordBladeGeometry,
  sdCapsule,
  sdEllipsoid,
  sminPoly,
  tagPart,
  type FinishMode,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import { prepareColoredPart } from './SdfVoxelPrimitives';

/**
 * Builds a smooth doubly-curved bat-like patagium wing membrane between leading-edge ribs
 * and scalloped trailing-edge points (double-sided for clean visibility from above & below).
 */
function makeWingMembraneGrid(
  ribStart: [number, number, number],
  ribEnd: [number, number, number],
  trailStart: [number, number, number],
  trailEnd: [number, number, number],
  uSegs: number,
  vSegs: number,
  archY: number,
  scallopDepth: number,
  hexColor: string
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const grid: [number, number, number][][] = [];

  for (let iv = 0; iv <= vSegs; iv++) {
    const v = iv / vSegs;
    const row: [number, number, number][] = [];
    for (let iu = 0; iu <= uSegs; iu++) {
      const u = iu / uSegs;
      const lx = ribStart[0] + (ribEnd[0] - ribStart[0]) * u;
      const ly = ribStart[1] + (ribEnd[1] - ribStart[1]) * u;
      const lz = ribStart[2] + (ribEnd[2] - ribStart[2]) * u;

      const tx = trailStart[0] + (trailEnd[0] - trailStart[0]) * u;
      const ty = trailStart[1] + (trailEnd[1] - trailStart[1]) * u;
      const tz = trailStart[2] + (trailEnd[2] - trailStart[2]) * u;

      // Parabolic scallop inward along trailing edge (u in 0..1)
      const scallop = Math.sin(u * Math.PI) * scallopDepth * (v * v);
      const vx = lx + (tx - lx) * v;
      const vz = lz + (tz - lz) * v + scallop;
      // Gentle bat-wing upward airfoil camber
      const camber = Math.sin(v * Math.PI) * (0.4 + 0.6 * Math.sin(u * Math.PI)) * archY;
      const vy = ly + (ty - ly) * v + camber;
      row.push([vx, vy, vz]);
    }
    grid.push(row);
  }

  for (let iv = 0; iv < vSegs; iv++) {
    const v0 = iv / vSegs;
    const v1 = (iv + 1) / vSegs;
    for (let iu = 0; iu < uSegs; iu++) {
      const u0 = iu / uSegs;
      const u1 = (iu + 1) / uSegs;
      const a = grid[iv][iu];
      const b = grid[iv][iu + 1];
      const c = grid[iv + 1][iu + 1];
      const d = grid[iv + 1][iu];
      // Front face
      positions.push(...a, ...b, ...c, ...a, ...c, ...d);
      uvs.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1);
      // Back face (double-sided)
      positions.push(...a, ...c, ...b, ...a, ...d, ...c);
      uvs.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return prepareColoredPart(geo, hexColor, 0.03);
}

export type QuadrupedCreatureId =
  | 'grey_wolf'
  | 'alpha_wolf'
  | 'town_reindeer'
  | 'armored_boar'
  | 'grizzly_bear'
  | 'war_horse'
  | 'hellhound'
  | 'elder_wyvern';

export interface QuadrupedCreatureSpec {
  id: QuadrupedCreatureId;
  labelPt: string;
  scale: number;
  bodyW: number;
  bodyH: number;
  bodyL: number;
  legThick: number;
  snoutLen: number;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  eyeHex: string;
  hasAntlers?: boolean;
  hasTusks?: boolean;
  hasArmor?: boolean;
  hasMane?: boolean;
  hasSpines?: boolean;
  hasWings?: boolean;
}

export const QUADRUPED_CREATURE_SPECS: Record<QuadrupedCreatureId, QuadrupedCreatureSpec> = {
  grey_wolf: {
    id: 'grey_wolf',
    labelPt: 'Lobo Cinzento',
    scale: 0.95,
    bodyW: 0.26,
    bodyH: 0.28,
    bodyL: 0.68,
    legThick: 0.068,
    snoutLen: 0.17,
    primaryHex: '#6b7280',
    secondaryHex: '#d1d5db',
    accentHex: '#374151',
    eyeHex: '#facc15',
  },
  alpha_wolf: {
    id: 'alpha_wolf',
    labelPt: 'Lobo Alfa',
    scale: 1.2,
    bodyW: 0.3,
    bodyH: 0.32,
    bodyL: 0.72,
    legThick: 0.078,
    snoutLen: 0.19,
    primaryHex: '#334155',
    secondaryHex: '#94a3b8',
    accentHex: '#1e293b',
    eyeHex: '#38bdf8',
    hasMane: true,
  },
  town_reindeer: {
    id: 'town_reindeer',
    labelPt: 'Rena / Cervo Real',
    scale: 1.25,
    bodyW: 0.25,
    bodyH: 0.29,
    bodyL: 0.7,
    legThick: 0.056,
    snoutLen: 0.16,
    primaryHex: '#7c5338',
    secondaryHex: '#d6bfa9',
    accentHex: '#e5dcc5',
    eyeHex: '#1e1b18',
    hasAntlers: true,
  },
  armored_boar: {
    id: 'armored_boar',
    labelPt: 'Javali Blindado',
    scale: 1.05,
    bodyW: 0.36,
    bodyH: 0.36,
    bodyL: 0.64,
    legThick: 0.082,
    snoutLen: 0.14,
    primaryHex: '#4f3428',
    secondaryHex: '#64748b',
    accentHex: '#d4a359',
    eyeHex: '#ef4444',
    hasTusks: true,
    hasArmor: true,
  },
  grizzly_bear: {
    id: 'grizzly_bear',
    labelPt: 'Urso Pardo',
    scale: 1.35,
    bodyW: 0.42,
    bodyH: 0.42,
    bodyL: 0.76,
    legThick: 0.105,
    snoutLen: 0.14,
    primaryHex: '#5c3a28',
    secondaryHex: '#8d6248',
    accentHex: '#3b2418',
    eyeHex: '#f59e0b',
  },
  war_horse: {
    id: 'war_horse',
    labelPt: 'Cavalo de Guerra',
    scale: 1.45,
    bodyW: 0.3,
    bodyH: 0.34,
    bodyL: 0.82,
    legThick: 0.068,
    snoutLen: 0.21,
    primaryHex: '#4a3222',
    secondaryHex: '#94a3b8',
    accentHex: '#d4a359',
    eyeHex: '#1e1b18',
    hasArmor: true,
    hasMane: true,
  },
  hellhound: {
    id: 'hellhound',
    labelPt: 'Cão Infernal',
    scale: 1.18,
    bodyW: 0.28,
    bodyH: 0.3,
    bodyL: 0.72,
    legThick: 0.074,
    snoutLen: 0.18,
    primaryHex: '#3b1518',
    secondaryHex: '#18141c',
    accentHex: '#f97316',
    eyeHex: '#fb923c',
    hasSpines: true,
  },
  elder_wyvern: {
    id: 'elder_wyvern',
    labelPt: 'Boss: Wyvern Ancião',
    scale: 2.4,
    bodyW: 0.38,
    bodyH: 0.42,
    bodyL: 0.95,
    legThick: 0.1,
    snoutLen: 0.28,
    primaryHex: '#2f1f3d',
    secondaryHex: '#6b21a8',
    accentHex: '#f59e0b',
    eyeHex: '#fbbf24',
    hasSpines: true,
    hasWings: true,
  },
};

export interface QuadrupedCreatureInstance {
  id: QuadrupedCreatureId;
  name: string;
  spec: QuadrupedCreatureSpec;
  rig: CanonicalQuadrupedRig;
  root: THREE.Group;
  clips: THREE.AnimationClip[];
  meshes: THREE.Mesh[];
  materials: PixelizerMaterial[];
  dispose: () => void;
}

export function buildQuadrupedCreature(
  id: QuadrupedCreatureId,
  options: {
    finishMode?: FinishMode;
    materialSeed?: number;
  } = {},
  sharedResources?: PixelizerMaterialResources
): QuadrupedCreatureInstance {
  const spec = QUADRUPED_CREATURE_SPECS[id];
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const materialSeed = options.materialSeed ?? 501;

  const rig = createCanonicalQuadrupedRig(spec.scale, { includeWings: Boolean(spec.hasWings) });
  const root = new THREE.Group();
  root.name = `NWL_Quad_${id}`;
  root.add(rig.rootBone);

  const meshes: THREE.Mesh[] = [];
  const materials: PixelizerMaterial[] = [];

  const attachBaked = (
    boneName: string,
    parts: TaggedGeometryPart[],
    isMetal = false,
    suffix = ''
  ) => {
    const bone = rig.boneByName.get(boneName);
    if (!bone || parts.length === 0) return;

    const baked: BakedAssetResult = bakeTaggedPartsAsset(parts, {
      finishMode,
      texelsPerMeter: id === 'elder_wyvern' ? 72 : 56,
      exactTexelsPerMeter: id === 'elder_wyvern',
      maxAtlasSize: id === 'elder_wyvern' ? 512 : 1024,
      seed: materialSeed,
      aoRays: id === 'elder_wyvern' ? 4 : 8,
      aoMaxDist: 0.4,
      aoStrength: id === 'elder_wyvern' ? 0.42 : 0.32,
      normalStrength: id === 'elder_wyvern' ? 0.34 : 0.22,
      emblemHex: spec.accentHex,
      emissiveRuneHex: spec.id === 'hellhound' || spec.id === 'elder_wyvern' ? spec.accentHex : null,
      usePool: true,
      cacheKey: `nwl_quad:${id}:${boneName}:${suffix}`,
    });
    for (const p of parts) p.geometry.dispose();

    const hasTex = Boolean(baked.textures);
    const hasEmission = Boolean(baked.textures?.hasEmission && baked.textures.emissionMap);
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        baseColor: '#ffffff',
        diffuseVertexColorWeight: 1.0,
        smoothness: isMetal ? 0.55 : 0.25,
        metallic: isMetal ? 0.65 : 0.05,
        albedoMap: baked.textures?.albedoMap ?? null,
        normalMap: baked.textures?.normalMap ?? null,
        normalScale: hasTex ? 0.85 : 1.0,
        useVertexTangents: Boolean(baked.hasTangents && baked.textures?.normalMap),
        emissionMap: hasEmission ? (baked.textures?.emissionMap ?? null) : null,
        emissionColor: hasEmission ? '#ffffff' : '#000000',
        emissionIntensity: hasEmission ? 1.1 : 0.0,
      },
      sharedResources
    );
    const mesh = new THREE.Mesh(baked.geometry, mat);
    mesh.name = `${id}_${boneName}${suffix}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bone.add(mesh);
    meshes.push(mesh);
    materials.push(mat);
  };

  const s = spec.scale;
  const bw = spec.bodyW * s;
  const bh = spec.bodyH * s;
  const leg = spec.legThick * s;
  const isWyvern = id === 'elder_wyvern';
  const bodyMat = isWyvern ? 'dragon_scales' : 'muscle_hide';

  if (isWyvern) {
    // -----------------------------------------------------------------------
    // ELDER WYVERN: High-Detail 3D Dragon (~11,000-15,000 tris)
    // -----------------------------------------------------------------------

    // 1. Pelvis (sculpted muscular hip girdle + dorsal pelvic spike)
    const wyvernPelvisSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const core = sdEllipsoid(x, y, z, 0, 0.01 * s, 0, bw * 0.5, bh * 0.46, 0.17 * s);
        const hipL = sdEllipsoid(x, y, z, bw * 0.36, -0.02 * s, -0.02 * s, bw * 0.22, bh * 0.34, 0.14 * s);
        const hipR = sdEllipsoid(x, y, z, -bw * 0.36, -0.02 * s, -0.02 * s, bw * 0.22, bh * 0.34, 0.14 * s);
        const crest = sdCapsule(x, y, z, 0, bh * 0.25, -0.09 * s, 0, bh * 0.34, 0.08 * s, 0.045 * s);
        return sminPoly(sminPoly(core, Math.min(hipL, hipR), 0.06 * s), crest, 0.04 * s);
      },
      [-bw * 0.65, -bh * 0.55, -0.24 * s],
      [bw * 0.65, bh * 0.58, 0.22 * s],
      11,
      spec.primaryHex,
      { flatShaded: false }
    );
    const pelvisSpike = makeCurvedHornGeometry(8, 0.032 * s, 0.005 * s, 0.16 * s, 0, -0.09 * s, 8, spec.accentHex);
    pelvisSpike.translate(0, bh * 0.34, -0.02 * s);
    attachBaked('pelvis', [
      tagPart(wyvernPelvisSdf, 'wyvern_pelvis_sdf', 'dragon_scales', spec.primaryHex),
      tagPart(pelvisSpike, 'wyvern_pelvis_spine', 'bone_ivory', spec.accentHex, { lockVertical: false }),
    ]);

    // 2. Spine 01 (muscular tucked waist + ventral belly scutes + dorsal spines)
    const wyvernSpine1 = makeSplineLoftGeometry(
      [
        [0, -0.01 * s, -0.14 * s],
        [0, 0.01 * s, 0],
        [0, 0.02 * s, 0.14 * s],
      ],
      [
        [bw * 0.44, bh * 0.42],
        [bw * 0.4, bh * 0.38],
        [bw * 0.46, bh * 0.44],
      ],
      16,
      16,
      { colorHex: spec.primaryHex, ridgeAmplitude: 0.028 * s, bellyFlatten: 0.22 }
    );
    const sp1Spikes: TaggedGeometryPart[] = [
      tagPart(wyvernSpine1, 'wyvern_spine1_loft', 'dragon_scales', spec.primaryHex),
    ];
    for (const [k, zOff] of [-0.06, 0.06].entries()) {
      const sp = makeCurvedHornGeometry(7, 0.03 * s, 0.005 * s, 0.15 * s, 0, -0.08 * s, 8, spec.accentHex);
      sp.translate(0, bh * 0.36, zOff * s);
      sp1Spikes.push(tagPart(sp, `wyvern_sp1_horn_${k}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }
    attachBaked('spine_01', sp1Spikes);

    // 3. Spine 02 (mid ribcage SDF + ventral belly scute ridge + dorsal spines)
    const wyvernSpine2Sdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const rib = sdEllipsoid(x, y, z, 0, 0.02 * s, 0, bw * 0.56, bh * 0.52, 0.18 * s);
        const keel = sdEllipsoid(x, y, z, 0, -bh * 0.28, 0.02 * s, bw * 0.34, bh * 0.24, 0.16 * s);
        const spine = sdCapsule(x, y, z, 0, bh * 0.36, -0.1 * s, 0, bh * 0.4, 0.1 * s, 0.05 * s);
        return sminPoly(sminPoly(rib, keel, 0.06 * s), spine, 0.04 * s);
      },
      [-bw * 0.66, -bh * 0.6, -0.24 * s],
      [bw * 0.66, bh * 0.64, 0.24 * s],
      10,
      spec.primaryHex,
      { flatShaded: false }
    );
    const belly2 = makeSplineLoftGeometry(
      [
        [0, -bh * 0.4, -0.1 * s],
        [0, -bh * 0.44, 0.02 * s],
        [0, -bh * 0.4, 0.12 * s],
      ],
      [
        [bw * 0.28, 0.045 * s],
        [bw * 0.32, 0.05 * s],
        [bw * 0.28, 0.045 * s],
      ],
      8,
      8,
      { colorHex: spec.secondaryHex }
    );
    const sp2Parts: TaggedGeometryPart[] = [
      tagPart(wyvernSpine2Sdf, 'wyvern_spine2_sdf', 'dragon_scales', spec.primaryHex),
      tagPart(belly2, 'wyvern_belly2', 'muscle_hide', spec.secondaryHex),
    ];
    for (const [k, zOff] of [-0.07, 0.07].entries()) {
      const sp = makeCurvedHornGeometry(8, 0.036 * s, 0.005 * s, 0.19 * s, 0, -0.1 * s, 8, spec.accentHex);
      sp.translate(0, bh * 0.46, zOff * s);
      sp2Parts.push(tagPart(sp, `wyvern_sp2_horn_${k}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }
    attachBaked('spine_02', sp2Parts);

    // 4. Spine 03 (massive sculpted chest/ribcage + pectorals + wing/neck collars + ventral keel)
    const wyvernChestSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const chest = sdEllipsoid(x, y, z, 0, 0.02 * s, 0.02 * s, bw * 0.62, bh * 0.58, 0.22 * s);
        const sternum = sdEllipsoid(x, y, z, 0, -bh * 0.26, 0.08 * s, bw * 0.38, bh * 0.32, 0.19 * s);
        const pecL = sdEllipsoid(x, y, z, bw * 0.32, -0.04 * s, 0.12 * s, bw * 0.28, bh * 0.28, 0.16 * s);
        const pecR = sdEllipsoid(x, y, z, -bw * 0.32, -0.04 * s, 0.12 * s, bw * 0.28, bh * 0.28, 0.16 * s);
        const shL = sdEllipsoid(x, y, z, bw * 0.48, bh * 0.18, -0.02 * s, bw * 0.24, bh * 0.24, 0.15 * s);
        const shR = sdEllipsoid(x, y, z, -bw * 0.48, bh * 0.18, -0.02 * s, bw * 0.24, bh * 0.24, 0.15 * s);
        const dorsal = sdCapsule(x, y, z, 0, bh * 0.36, -0.12 * s, 0, bh * 0.44, 0.12 * s, 0.06 * s);
        const base = sminPoly(sminPoly(chest, sternum, 0.07 * s), Math.min(pecL, pecR), 0.06 * s);
        return sminPoly(sminPoly(base, Math.min(shL, shR), 0.06 * s), dorsal, 0.04 * s);
      },
      [-bw * 0.78, -bh * 0.66, -0.26 * s],
      [bw * 0.78, bh * 0.7, 0.3 * s],
      11,
      spec.primaryHex,
      { flatShaded: false }
    );
    const chestVentralPlates = makeSplineLoftGeometry(
      [
        [0, -bh * 0.44, -0.08 * s],
        [0, -bh * 0.48, 0.06 * s],
        [0, -bh * 0.32, 0.2 * s],
      ],
      [
        [bw * 0.32, 0.055 * s],
        [bw * 0.36, 0.06 * s],
        [bw * 0.28, 0.05 * s],
      ],
      10,
      8,
      { colorHex: spec.secondaryHex }
    );
    const spine3Parts: TaggedGeometryPart[] = [
      tagPart(wyvernChestSdf, 'wyvern_chest_sdf', 'dragon_scales', spec.primaryHex),
      tagPart(chestVentralPlates, 'wyvern_chest_scutes', 'muscle_hide', spec.secondaryHex),
    ];

    for (const [k, zOff] of [-0.08, 0.06].entries()) {
      const sp = makeCurvedHornGeometry(9, 0.042 * s, 0.006 * s, 0.22 * s, 0, -0.11 * s, 8, spec.accentHex);
      sp.translate(0, bh * 0.5, zOff * s);
      spine3Parts.push(tagPart(sp, `wyvern_sp3_horn_${k}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }

    // 5. Articulated 3-Fingered Wings (wing_root -> wing_elbow -> wing_tip) + Curved Patagium
    for (const [wIdx, side] of (['l', 'r'] as const).entries()) {
      const sx = side === 'l' ? 1 : -1;

      // Muscular wing shoulder collar bridging spine_03 -> wing_root
      const wingCollarGeo = makeSplineLoftGeometry(
        [
          [sx * bw * 0.3, bh * 0.16, 0.02 * s],
          [sx * bw * 0.48, bh * 0.24, 0.0],
          [sx * (bw * 0.56 + 0.05 * s), bh * 0.3, -0.02 * s],
        ],
        [0.105 * s, 0.088 * s, 0.068 * s],
        10,
        8,
        { colorHex: spec.primaryHex }
      );
      spine3Parts.push(
        tagPart(wingCollarGeo, `wyvern_wing_collar_${wIdx}`, 'dragon_scales', spec.primaryHex)
      );

      // wing_root: Humerus bone + bicep muscle + inner patagium to flank
      const armGeo = makeSplineLoftGeometry(
        [
          [0, 0, 0],
          [sx * 0.17 * s, 0.1 * s, -0.02 * s],
          [sx * 0.38 * s, 0.16 * s, -0.06 * s],
        ],
        [0.072 * s, 0.058 * s, 0.046 * s],
        10,
        9,
        { colorHex: spec.primaryHex }
      );
      const innerMemGeo = makeWingMembraneGrid(
        [0, 0, -0.02 * s],
        [sx * 0.38 * s, 0.16 * s, -0.06 * s],
        [-sx * 0.04 * s, -0.18 * s, -0.34 * s],
        [sx * 0.24 * s, -0.08 * s, -0.32 * s],
        4,
        4,
        0.045 * s,
        0.05 * s,
        spec.secondaryHex
      );
      attachBaked(`wing_root_${side}`, [
        tagPart(armGeo, `wyvern_wing_arm_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(innerMemGeo, `wyvern_wing_inner_mem_${wIdx}`, 'wing_membrane', spec.secondaryHex),
      ]);

      // wing_elbow: Forearm spar + thumb claw + 3 articulated finger phalanges + curved patagium bays
      const sparGeo = makeSplineLoftGeometry(
        [
          [0, 0, 0],
          [sx * 0.23 * s, 0.03 * s, -0.07 * s],
          [sx * 0.46 * s, 0.04 * s, -0.14 * s],
        ],
        [0.046 * s, 0.032 * s, 0.018 * s],
        8,
        9,
        { colorHex: spec.primaryHex }
      );
      const thumbClaw = makeCurvedHornGeometry(7, 0.018 * s, 0.003 * s, 0.11 * s, sx * 0.02 * s, 0.06 * s, 8, spec.accentHex);
      thumbClaw.rotateX(0.55);
      thumbClaw.translate(sx * 0.44 * s, 0.05 * s, -0.11 * s);

      // 3 radiating wing finger phalanges from wrist [0.46, 0.04, -0.14]*s (local to wing_elbow)
      const f1End: [number, number, number] = [sx * 0.56 * s, -0.03 * s, -0.34 * s];
      const f2End: [number, number, number] = [sx * 0.34 * s, -0.1 * s, -0.42 * s];
      const f3End: [number, number, number] = [sx * 0.12 * s, -0.15 * s, -0.4 * s];
      const wrist: [number, number, number] = [sx * 0.44 * s, 0.04 * s, -0.14 * s];
      const elbowPt: [number, number, number] = [0, 0, 0];
      const elbowTrail: [number, number, number] = [-sx * 0.06 * s, -0.18 * s, -0.32 * s];

      const finger1 = makeSplineLoftGeometry(
        [wrist, [sx * 0.52 * s, 0.01 * s, -0.25 * s], f1End],
        [0.016 * s, 0.011 * s, 0.005 * s],
        6,
        6,
        { colorHex: spec.primaryHex }
      );
      const finger2 = makeSplineLoftGeometry(
        [wrist, [sx * 0.4 * s, -0.02 * s, -0.29 * s], f2End],
        [0.015 * s, 0.01 * s, 0.005 * s],
        6,
        6,
        { colorHex: spec.primaryHex }
      );
      const finger3 = makeSplineLoftGeometry(
        [wrist, [sx * 0.28 * s, -0.05 * s, -0.28 * s], f3End],
        [0.014 * s, 0.009 * s, 0.004 * s],
        6,
        6,
        { colorHex: spec.primaryHex }
      );

      // Patagium bays spanning elbow->wrist->f3->f2->f1
      const bayA = makeWingMembraneGrid(elbowPt, wrist, elbowTrail, f3End, 4, 4, 0.04 * s, 0.055 * s, spec.secondaryHex);
      const bayB = makeWingMembraneGrid(wrist, f2End, f3End, f2End, 4, 3, 0.03 * s, 0.045 * s, spec.secondaryHex);
      const bayC = makeWingMembraneGrid(wrist, f1End, f2End, f1End, 4, 3, 0.03 * s, 0.04 * s, spec.secondaryHex);

      attachBaked(`wing_elbow_${side}`, [
        tagPart(sparGeo, `wyvern_wing_spar_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(thumbClaw, `wyvern_wing_thumb_${wIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false }),
        tagPart(finger1, `wyvern_wing_f1_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(finger2, `wyvern_wing_f2_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(finger3, `wyvern_wing_f3_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(bayA, `wyvern_wing_bayA_${wIdx}`, 'wing_membrane', spec.secondaryHex),
        tagPart(bayB, `wyvern_wing_bayB_${wIdx}`, 'wing_membrane', spec.secondaryHex),
        tagPart(bayC, `wyvern_wing_bayC_${wIdx}`, 'wing_membrane', spec.secondaryHex),
      ]);

      // wing_tip: Leading primary wingtip phalanx + outer trailing patagium sail
      const tipBone = makeSplineLoftGeometry(
        [
          [0, 0, 0],
          [sx * 0.22 * s, 0.01 * s, -0.08 * s],
          [sx * 0.44 * s, -0.03 * s, -0.2 * s],
        ],
        [0.02 * s, 0.013 * s, 0.005 * s],
        8,
        8,
        { colorHex: spec.primaryHex }
      );
      const tipSail = makeWingMembraneGrid(
        [0, 0, 0],
        [sx * 0.44 * s, -0.03 * s, -0.2 * s],
        [sx * 0.1 * s, -0.07 * s, -0.22 * s],
        [sx * 0.34 * s, -0.06 * s, -0.28 * s],
        4,
        4,
        0.025 * s,
        0.035 * s,
        spec.secondaryHex
      );
      attachBaked(`wing_tip_${side}`, [
        tagPart(tipBone, `wyvern_wing_tip_${wIdx}`, 'dragon_scales', spec.primaryHex),
        tagPart(tipSail, `wyvern_wing_tip_mem_${wIdx}`, 'wing_membrane', spec.secondaryHex),
      ]);
    }

    // Smooth neck-base collar bridging spine_03 to neck_01
    const neckCollarGeo = makeSplineLoftGeometry(
      [
        [0, bh * 0.08, 0.04 * s],
        [0, bh * 0.26, 0.1 * s],
        [0, bh * 0.42, 0.15 * s],
      ],
      [
        [bw * 0.52, 0.16 * s],
        [bw * 0.46, 0.145 * s],
        [bw * 0.4, 0.13 * s],
      ],
      10,
      8,
      { colorHex: spec.primaryHex, ridgeAmplitude: 0.025 * s }
    );
    spine3Parts.push(
      tagPart(neckCollarGeo, 'wyvern_neck_collar', 'dragon_scales', spec.primaryHex)
    );
    attachBaked('spine_03', spine3Parts);

    // 6. S-Curved Multi-Ring Neck + Throat Plates + Dorsal Neck Spines
    const neckGeo = makeSplineLoftGeometry(
      [
        [0, -0.08 * s, -0.06 * s],
        [0, 0.02 * s, 0.01 * s],
        [0, 0.11 * s, 0.09 * s],
        [0, 0.19 * s, 0.15 * s],
      ],
      [
        [bw * 0.42, 0.135 * s],
        [bw * 0.35, 0.115 * s],
        [bw * 0.29, 0.098 * s],
        [bw * 0.24, 0.088 * s],
      ],
      12,
      14,
      { colorHex: spec.primaryHex, ridgeAmplitude: 0.024 * s, bellyFlatten: 0.18 }
    );
    const wyvernNeckParts: TaggedGeometryPart[] = [
      tagPart(neckGeo, 'wyvern_neck_loft', 'dragon_scales', spec.primaryHex),
    ];
    // 5 layered crescent throat plates along ventral S-curve
    for (let tp = 0; tp < 5; tp++) {
      const f = tp / 4;
      const plate = makeSplineLoftGeometry(
        [
          [-bw * (0.28 - f * 0.1), (-0.04 + f * 0.2) * s, (0.04 + f * 0.12) * s],
          [0, (-0.06 + f * 0.2) * s, (0.09 + f * 0.12) * s],
          [bw * (0.28 - f * 0.1), (-0.04 + f * 0.2) * s, (0.04 + f * 0.12) * s],
        ],
        [0.016 * s, 0.028 * s, 0.016 * s],
        6,
        6,
        { colorHex: spec.secondaryHex }
      );
      wyvernNeckParts.push(tagPart(plate, `wyvern_throat_plate_${tp}`, 'muscle_hide', spec.secondaryHex));
    }
    // 4 dorsal neck spikes
    for (let ns = 0; ns < 4; ns++) {
      const f = ns / 3;
      const sp = makeCurvedHornGeometry(7, 0.026 * s, 0.004 * s, 0.14 * s, 0, -0.07 * s, 8, spec.accentHex);
      sp.rotateX(-0.35);
      sp.translate(0, (0.0 + f * 0.17) * s, (-0.06 + f * 0.1) * s);
      wyvernNeckParts.push(tagPart(sp, `wyvern_neck_spine_${ns}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }
    attachBaked('neck_01', wyvernNeckParts);

    // 7. Detailed Horned Skull (SDF skull + brow ridges + nostrils + horns + glowing orbs + upper fangs)
    const wyvernSkullGeo = makeSdfOrganicMesh(
      (x, y, z) => {
        const cranium = sdEllipsoid(x, y, z, 0, 0.03 * s, -0.02 * s, 0.135 * s, 0.115 * s, 0.155 * s);
        const snout = sdCapsule(x, y, z, 0, -0.005 * s, 0.06 * s, 0, -0.02 * s, 0.29 * s, 0.068 * s);
        const muzzle = sdEllipsoid(x, y, z, 0, -0.018 * s, 0.27 * s, 0.072 * s, 0.052 * s, 0.065 * s);
        const browL = sdEllipsoid(x, y, z, 0.088 * s, 0.065 * s, 0.05 * s, 0.048 * s, 0.034 * s, 0.078 * s);
        const browR = sdEllipsoid(x, y, z, -0.088 * s, 0.065 * s, 0.05 * s, 0.048 * s, 0.034 * s, 0.078 * s);
        const cheekL = sdEllipsoid(x, y, z, 0.11 * s, -0.015 * s, 0.01 * s, 0.042 * s, 0.042 * s, 0.07 * s);
        const cheekR = sdEllipsoid(x, y, z, -0.11 * s, -0.015 * s, 0.01 * s, 0.042 * s, 0.042 * s, 0.07 * s);
        const nosL = sdEllipsoid(x, y, z, 0.042 * s, 0.022 * s, 0.28 * s, 0.022 * s, 0.018 * s, 0.026 * s);
        const nosR = sdEllipsoid(x, y, z, -0.042 * s, 0.022 * s, 0.28 * s, 0.022 * s, 0.018 * s, 0.026 * s);
        let d = sminPoly(cranium, snout, 0.055 * s);
        d = sminPoly(d, muzzle, 0.035 * s);
        d = sminPoly(d, Math.min(browL, browR), 0.028 * s);
        d = sminPoly(d, Math.min(cheekL, cheekR), 0.026 * s);
        d = sminPoly(d, Math.min(nosL, nosR), 0.018 * s);
        return d;
      },
      [-0.22 * s, -0.15 * s, -0.22 * s],
      [0.22 * s, 0.22 * s, 0.39 * s],
      12,
      spec.primaryHex,
      { flatShaded: false }
    );
    const wyvernHeadParts: TaggedGeometryPart[] = [
      tagPart(wyvernSkullGeo, 'wyvern_skull_sdf', 'dragon_scales', spec.primaryHex),
    ];
    // Nasal horn
    const nasalHorn = makeCurvedHornGeometry(8, 0.026 * s, 0.004 * s, 0.11 * s, 0, -0.04 * s, 8, spec.accentHex);
    nasalHorn.rotateX(0.32);
    nasalHorn.translate(0, 0.03 * s, 0.26 * s);
    wyvernHeadParts.push(tagPart(nasalHorn, 'wyvern_nasal_horn', 'bone_ivory', spec.accentHex, { lockVertical: false }));

    for (const [hIdx, sx] of [-1, 1].entries()) {
      // Great swept-back crown horns
      const greatHorn = makeCurvedHornGeometry(9, 0.05 * s, 0.007 * s, 0.44 * s, sx * 0.14 * s, -0.26 * s, 8, spec.accentHex);
      greatHorn.rotateX(-0.68);
      greatHorn.rotateZ(sx * -0.24);
      greatHorn.translate(sx * 0.085 * s, 0.1 * s, -0.06 * s);
      wyvernHeadParts.push(
        tagPart(greatHorn, `wyvern_great_horn_${hIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false })
      );

      // Secondary cheek/temple horns
      const cheekHorn = makeCurvedHornGeometry(8, 0.028 * s, 0.005 * s, 0.2 * s, sx * 0.09 * s, -0.14 * s, 8, spec.accentHex);
      cheekHorn.rotateX(-0.85);
      cheekHorn.rotateZ(sx * -0.45);
      cheekHorn.translate(sx * 0.11 * s, 0.0 * s, -0.03 * s);
      wyvernHeadParts.push(
        tagPart(cheekHorn, `wyvern_cheek_horn_${hIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false })
      );

      // Recessed glowing dragon orb (named wyvern_orbital_* to keep FLAT_DETAIL_NAME_RE clean)
      const orb = prepareColoredPart(new THREE.SphereGeometry(0.024 * s, 10, 8), spec.eyeHex);
      orb.translate(sx * 0.095 * s, 0.035 * s, 0.075 * s);
      wyvernHeadParts.push(tagPart(orb, `wyvern_orbital_${hIdx}`, 'runic_glow', spec.eyeHex));
    }

    // Upper teeth & prominent fangs
    for (const [fIdx, [fx, fz, rad, len]] of [
      [-0.052, 0.28, 0.013, 0.058],
      [0.052, 0.28, 0.013, 0.058],
      [-0.058, 0.22, 0.01, 0.042],
      [0.058, 0.22, 0.01, 0.042],
      [-0.062, 0.16, 0.01, 0.04],
      [0.062, 0.16, 0.01, 0.04],
      [-0.022, 0.305, 0.009, 0.036],
      [0.022, 0.305, 0.009, 0.036],
    ].entries()) {
      const fang = prepareColoredPart(new THREE.ConeGeometry(rad * s, len * s, 6), '#f5e9d3');
      fang.rotateX(Math.PI);
      fang.translate(fx * s, -0.062 * s, fz * s);
      wyvernHeadParts.push(tagPart(fang, `wyvern_upper_fang_${fIdx}`, 'bone_ivory', '#f5e9d3', { lockVertical: false }));
    }
    attachBaked('head', wyvernHeadParts);

    // 8. Articulated Sculpted Jaw + Chin Horn + Lower Fangs
    const jawSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const base = sdCapsule(x, y, z, 0, 0, -0.02 * s, 0, -0.01 * s, 0.18 * s, 0.048 * s);
        const ramusL = sdCapsule(x, y, z, 0.05 * s, 0.01 * s, -0.03 * s, 0.035 * s, -0.01 * s, 0.15 * s, 0.028 * s);
        const ramusR = sdCapsule(x, y, z, -0.05 * s, 0.01 * s, -0.03 * s, -0.035 * s, -0.01 * s, 0.15 * s, 0.028 * s);
        return sminPoly(base, Math.min(ramusL, ramusR), 0.02 * s);
      },
      [-0.12 * s, -0.08 * s, -0.08 * s],
      [0.12 * s, 0.08 * s, 0.24 * s],
      8,
      spec.secondaryHex,
      { flatShaded: false }
    );
    const chinHorn = makeCurvedHornGeometry(7, 0.022 * s, 0.004 * s, 0.11 * s, 0, -0.06 * s, 8, spec.accentHex);
    chinHorn.rotateX(Math.PI * 0.88);
    chinHorn.translate(0, -0.035 * s, 0.14 * s);
    const wyvernJawParts: TaggedGeometryPart[] = [
      tagPart(jawSdf, 'wyvern_jaw_sdf', 'dragon_scales', spec.secondaryHex),
      tagPart(chinHorn, 'wyvern_chin_spike', 'bone_ivory', spec.accentHex, { lockVertical: false }),
    ];
    for (const [fIdx, [fx, fz]] of [
      [-0.038, 0.16],
      [0.038, 0.16],
      [-0.045, 0.11],
      [0.045, 0.11],
      [-0.048, 0.06],
      [0.048, 0.06],
    ].entries()) {
      const fang = prepareColoredPart(new THREE.ConeGeometry(0.009 * s, 0.038 * s, 6), '#f5e9d3');
      fang.translate(fx * s, 0.032 * s, fz * s);
      wyvernJawParts.push(tagPart(fang, `wyvern_lower_fang_${fIdx}`, 'bone_ivory', '#f5e9d3', { lockVertical: false }));
    }
    attachBaked('jaw', wyvernJawParts);

    // 9. Swept-back Draconic Ear Fins
    for (const side of ['l', 'r'] as const) {
      const sx = side === 'l' ? 1 : -1;
      const earFin = makeCurvedHornGeometry(9, 0.036 * s, 0.005 * s, 0.2 * s, sx * 0.08 * s, -0.14 * s, 8, spec.primaryHex);
      earFin.rotateX(-0.95);
      attachBaked(`ear_${side}`, [
        tagPart(earFin, `wyvern_ear_fin_${side}`, 'dragon_scales', spec.primaryHex, { lockVertical: false }),
      ]);
    }

    // 10. Tapered Spined Tail + Spade Tip
    const tail1Geo = makeSplineLoftGeometry(
      [
        [0, 0, 0],
        [0, -0.02 * s, -0.12 * s],
        [0, -0.04 * s, -0.24 * s],
      ],
      [0.092 * s, 0.072 * s, 0.056 * s],
      10,
      10,
      { colorHex: spec.primaryHex, ridgeAmplitude: 0.02 * s, bellyFlatten: 0.2 }
    );
    const tail1Parts: TaggedGeometryPart[] = [
      tagPart(tail1Geo, 'wyvern_tail1_loft', 'dragon_scales', spec.primaryHex),
    ];
    for (const [k, zOff] of [-0.05, -0.14, -0.22].entries()) {
      const sp = makeCurvedHornGeometry(6, 0.024 * s, 0.004 * s, 0.13 * s, 0, -0.07 * s, 6, spec.accentHex);
      sp.translate(0, 0.045 * s, zOff * s);
      tail1Parts.push(tagPart(sp, `wyvern_t1_spine_${k}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }
    attachBaked('tail_01', tail1Parts);

    const tail2Geo = makeSplineLoftGeometry(
      [
        [0, 0, 0],
        [0, -0.02 * s, -0.18 * s],
        [0, -0.01 * s, -0.38 * s],
        [0, 0.04 * s, -0.58 * s],
      ],
      [0.056 * s, 0.038 * s, 0.022 * s, 0.008 * s],
      8,
      12,
      { colorHex: spec.primaryHex, ridgeAmplitude: 0.014 * s }
    );
    const tailSpade = makeSwordBladeGeometry(0.11 * s, 0.026 * s, 0.14 * s, 0.14 * s, spec.accentHex);
    tailSpade.rotateX(-Math.PI * 0.5);
    tailSpade.translate(0, 0.04 * s, -0.54 * s);
    const tail2Parts: TaggedGeometryPart[] = [
      tagPart(tail2Geo, 'wyvern_tail2_loft', 'dragon_scales', spec.primaryHex),
      tagPart(tailSpade, 'wyvern_tail_spade', 'bone_ivory', spec.accentHex, { lockVertical: false }),
    ];
    for (const [k, [yOff, zOff]] of [
      [0.02, -0.08],
      [0.0, -0.2],
      [0.01, -0.34],
      [0.03, -0.46],
    ].entries()) {
      const sp = makeCurvedHornGeometry(6, 0.018 * s, 0.003 * s, 0.1 * s, 0, -0.06 * s, 7, spec.accentHex);
      sp.translate(0, yOff * s, zOff * s);
      tail2Parts.push(tagPart(sp, `wyvern_t2_spine_${k}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
    }
    attachBaked('tail_02', tail2Parts);

    // 11. Muscular Clawed Legs (4 limbs × 3 segments + 12 articulated clawed toes + dewclaws)
    for (const side of ['l', 'r'] as const) {
      // Front upper (humeral muscle loft)
      const fUpper = makeSplineLoftGeometry(
        [
          [0, 0.02 * s, 0],
          [0, -0.12 * s, 0.015 * s],
          [0, -0.26 * s, 0.02 * s],
        ],
        [
          [leg * 0.85, leg * 0.95],
          [leg * 0.72, leg * 0.82],
          [leg * 0.56, leg * 0.62],
        ],
        10,
        8,
        { colorHex: spec.primaryHex }
      );
      attachBaked(`front_upper_${side}`, [
        tagPart(fUpper, `wyvern_fu_${side}`, 'dragon_scales', spec.primaryHex),
      ]);

      // Front lower (forearm + elbow spur)
      const fLower = makeSplineLoftGeometry(
        [
          [0, 0.01 * s, 0],
          [0, -0.13 * s, 0.02 * s],
          [0, -0.26 * s, 0.04 * s],
        ],
        [
          [leg * 0.58, leg * 0.64],
          [leg * 0.48, leg * 0.52],
          [leg * 0.42, leg * 0.46],
        ],
        8,
        8,
        { colorHex: spec.secondaryHex }
      );
      const elbowSpur = makeCurvedHornGeometry(6, 0.022 * s, 0.004 * s, 0.1 * s, 0, -0.05 * s, 7, spec.accentHex);
      elbowSpur.rotateX(-0.9);
      elbowSpur.translate(0, -0.02 * s, -0.04 * s);
      attachBaked(`front_lower_${side}`, [
        tagPart(fLower, `wyvern_fl_${side}`, 'dragon_scales', spec.secondaryHex),
        tagPart(elbowSpur, `wyvern_elbow_spur_${side}`, 'bone_ivory', spec.accentHex, { lockVertical: false }),
      ]);

      // Back thigh (heavy digitigrade haunch)
      const bThigh = makeSplineLoftGeometry(
        [
          [0, 0.03 * s, 0],
          [0, -0.11 * s, 0.02 * s],
          [0, -0.26 * s, -0.04 * s],
        ],
        [
          [leg * 0.96, leg * 1.15],
          [leg * 0.82, leg * 0.96],
          [leg * 0.56, leg * 0.64],
        ],
        10,
        8,
        { colorHex: spec.primaryHex }
      );
      attachBaked(`back_thigh_${side}`, [
        tagPart(bThigh, `wyvern_bt_${side}`, 'dragon_scales', spec.primaryHex),
      ]);

      // Back shin (digitigrade hock)
      const bShin = makeSplineLoftGeometry(
        [
          [0, 0.01 * s, 0],
          [0, -0.13 * s, 0.01 * s],
          [0, -0.26 * s, 0.05 * s],
        ],
        [
          [leg * 0.56, leg * 0.64],
          [leg * 0.44, leg * 0.5],
          [leg * 0.4, leg * 0.45],
        ],
        8,
        8,
        { colorHex: spec.secondaryHex }
      );
      attachBaked(`back_shin_${side}`, [
        tagPart(bShin, `wyvern_bs_${side}`, 'dragon_scales', spec.secondaryHex),
      ]);

      // Sculpted Clawed Paws (front & back): pad + 3 articulated toes + curved talons + dewclaw
      for (const [pawKind, boneName] of [
        ['fp', `front_paw_${side}`],
        ['bp', `back_paw_${side}`],
      ] as const) {
        const pad = makeSculptedLimbGeometry(0.14 * s, leg * 0.56, 0.042 * s, leg * 0.42, 0.032 * s, {
          profile: 'taper',
          radialSegs: 8,
          heightSegs: 4,
          hexColor: spec.primaryHex,
        });
        pad.rotateX(Math.PI * 0.5);
        pad.translate(0, -0.015 * s, -0.04 * s);
        const pawParts: TaggedGeometryPart[] = [
          tagPart(pad, `wyvern_${pawKind}_pad_${side}`, 'dragon_scales', spec.primaryHex),
        ];
        for (const [tIdx, ang] of [-0.42, 0, 0.42].entries()) {
          const dirX = Math.sin(ang);
          const dirZ = Math.cos(ang);
          const toe = makeSplineLoftGeometry(
            [
              [dirX * 0.02 * s, -0.01 * s, 0.03 * s],
              [dirX * 0.055 * s, -0.022 * s, (0.03 + dirZ * 0.07) * s],
              [dirX * 0.085 * s, -0.03 * s, (0.03 + dirZ * 0.13) * s],
            ],
            [0.026 * s, 0.02 * s, 0.014 * s],
            6,
            5,
            { colorHex: spec.primaryHex }
          );
          const talon = makeCurvedHornGeometry(5, 0.015 * s, 0.002 * s, 0.085 * s, 0, 0.045 * s, 6, spec.accentHex);
          talon.rotateX(Math.PI * 0.56);
          talon.rotateY(ang);
          talon.translate(dirX * 0.085 * s, -0.028 * s, (0.03 + dirZ * 0.13) * s);
          pawParts.push(
            tagPart(toe, `wyvern_${pawKind}_toe_${side}_${tIdx}`, 'dragon_scales', spec.primaryHex),
            tagPart(talon, `wyvern_${pawKind}_talon_${side}_${tIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false })
          );
        }
        const dewclaw = makeCurvedHornGeometry(5, 0.013 * s, 0.002 * s, 0.06 * s, 0, -0.03 * s, 6, spec.accentHex);
        dewclaw.rotateX(-Math.PI * 0.62);
        dewclaw.translate(0, 0.0 * s, -0.04 * s);
        pawParts.push(tagPart(dewclaw, `wyvern_${pawKind}_dewclaw_${side}`, 'bone_ivory', spec.accentHex, { lockVertical: false }));
        attachBaked(boneName, pawParts);
      }
    }
  } else {
    // -----------------------------------------------------------------------
    // Standard Quadrupeds (Wolf, Bear, Boar, Horse, Reindeer, Hellhound)
    // Sculpted anatomical torsos, limbs, and curved antlers/tusks
    // -----------------------------------------------------------------------
    const pelvisGeo = makeAnatomicalTorsoGeometry(
      0.28 * s,
      bw * 0.45,
      bh * 0.44,
      bw * 0.48,
      bh * 0.46,
      { centered: true, hexColor: spec.primaryHex, radialSegs: 14, heightSegs: 6 }
    );
    pelvisGeo.rotateX(Math.PI * 0.5);
    attachBaked('pelvis', [tagPart(pelvisGeo, 'quad_pelvis', bodyMat, spec.primaryHex)]);

    const spine1Geo = makeAnatomicalTorsoGeometry(
      0.26 * s,
      bw * 0.46,
      bh * 0.44,
      bw * 0.49,
      bh * 0.46,
      { centered: true, hexColor: spec.primaryHex, radialSegs: 14, heightSegs: 6 }
    );
    spine1Geo.rotateX(Math.PI * 0.5);
    attachBaked('spine_01', [tagPart(spine1Geo, 'quad_spine1', bodyMat, spec.primaryHex)]);

    const spine2Geo = makeAnatomicalTorsoGeometry(
      0.28 * s,
      bw * 0.5,
      bh * 0.48,
      bw * 0.54,
      bh * 0.52,
      { centered: true, hexColor: spec.primaryHex, radialSegs: 14, heightSegs: 6 }
    );
    spine2Geo.rotateX(Math.PI * 0.5);
    const spine2Parts: TaggedGeometryPart[] = [
      tagPart(spine2Geo, 'quad_spine2', bodyMat, spec.primaryHex),
    ];
    if (spec.hasArmor) {
      spine2Parts.push(
        tagPart(
          makeBeveledBox(bw * 1.12, bh * 0.45, 0.3 * s, 0.02 * s, spec.secondaryHex, {
            offset: [0, bh * 0.36, 0],
          }),
          'quad_saddle',
          'rarity_armor',
          spec.secondaryHex,
          { accentHex: spec.accentHex }
        )
      );
    }
    if (spec.hasSpines) {
      for (const [spIdx, zOff] of [-0.08, 0.08].entries()) {
        const sp = makeCurvedHornGeometry(6, 0.032 * s, 0.005 * s, 0.16 * s, 0, -0.06 * s, 6, spec.accentHex);
        sp.translate(0, bh * 0.44, zOff * s);
        spine2Parts.push(tagPart(sp, `quad_spine_spike_${spIdx}`, 'runic_glow', spec.accentHex, { lockVertical: false }));
      }
    }
    attachBaked('spine_02', spine2Parts, Boolean(spec.hasArmor));

    const spine3Geo = makeAnatomicalTorsoGeometry(
      0.3 * s,
      bw * 0.54,
      bh * 0.52,
      bw * 0.56,
      bh * 0.54,
      { centered: true, hexColor: spec.primaryHex, radialSegs: 16, heightSegs: 6 }
    );
    spine3Geo.rotateX(Math.PI * 0.5);
    const chestFur = makeSculptedLimbGeometry(0.24 * s, bw * 0.38, 0.12 * s, bw * 0.42, 0.13 * s, {
      profile: 'taper',
      radialSegs: 12,
      heightSegs: 5,
      hexColor: spec.secondaryHex,
    });
    chestFur.rotateX(Math.PI * 0.5);
    chestFur.translate(0, -bh * 0.24, -0.06 * s);
    attachBaked('spine_03', [
      tagPart(spine3Geo, 'quad_chest', bodyMat, spec.primaryHex),
      tagPart(chestFur, 'quad_chest_fur', 'woven_cloth', spec.secondaryHex),
    ]);

    const neckGeo = makeSplineLoftGeometry(
      [
        [0, -0.04 * s, -0.03 * s],
        [0, 0.1 * s, 0.04 * s],
        [0, 0.22 * s, 0.12 * s],
      ],
      [
        [bw * 0.38, 0.12 * s],
        [bw * 0.33, 0.105 * s],
        [bw * 0.28, 0.095 * s],
      ],
      12,
      10,
      { colorHex: spec.primaryHex }
    );
    const neckParts: TaggedGeometryPart[] = [
      tagPart(neckGeo, 'quad_neck', bodyMat, spec.primaryHex),
    ];
    if (spec.hasMane) {
      const maneGeo = makeSplineLoftGeometry(
        [
          [0, -0.02 * s, -0.08 * s],
          [0, 0.1 * s, -0.05 * s],
          [0, 0.22 * s, 0.04 * s],
        ],
        [0.09 * s, 0.11 * s, 0.075 * s],
        10,
        10,
        { colorHex: spec.accentHex, ridgeAmplitude: 0.03 * s }
      );
      neckParts.push(tagPart(maneGeo, 'quad_mane', 'woven_cloth', spec.accentHex));
    }
    attachBaked('neck_01', neckParts);

    const headSdf = makeSdfOrganicMesh(
      (x, y, z) => {
        const cran = sdEllipsoid(x, y, z, 0, 0.01 * s, -0.01 * s, bw * 0.4, 0.11 * s, 0.12 * s);
        const snout = sdCapsule(x, y, z, 0, -0.015 * s, 0.06 * s, 0, -0.025 * s, (0.08 + spec.snoutLen) * s, 0.058 * s);
        return sminPoly(cran, snout, 0.04 * s);
      },
      [-bw * 0.5, -0.14 * s, -0.16 * s],
      [bw * 0.5, 0.16 * s, (0.16 + spec.snoutLen) * s],
      18,
      spec.primaryHex,
      { flatShaded: false }
    );
    const headParts: TaggedGeometryPart[] = [
      tagPart(headSdf, 'quad_cranium', bodyMat, spec.primaryHex),
    ];
    for (const [eIdx, sx] of [-1, 1].entries()) {
      const eye = prepareColoredPart(new THREE.SphereGeometry(0.024 * s, 8, 6), spec.eyeHex);
      eye.translate(sx * bw * 0.34, 0.04 * s, 0.09 * s);
      headParts.push(tagPart(eye, `quad_orbital_${eIdx}`, 'runic_glow', spec.eyeHex));
    }
    if (spec.hasAntlers) {
      for (const [aIdx, sx] of [-1, 1].entries()) {
        const mainBeam = makeCurvedHornGeometry(7, 0.02 * s, 0.006 * s, 0.34 * s, sx * 0.1 * s, -0.04 * s, 7, spec.accentHex);
        mainBeam.rotateZ(sx * -0.45);
        mainBeam.translate(sx * 0.08 * s, 0.1 * s, 0);
        const tine = makeCurvedHornGeometry(5, 0.014 * s, 0.004 * s, 0.18 * s, sx * 0.03 * s, 0.05 * s, 6, spec.accentHex);
        tine.rotateZ(sx * 0.2);
        tine.rotateX(0.45);
        tine.translate(sx * 0.16 * s, 0.22 * s, 0.04 * s);
        headParts.push(
          tagPart(mainBeam, `antler_beam_${aIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false }),
          tagPart(tine, `antler_tine_${aIdx}`, 'bone_ivory', spec.accentHex, { lockVertical: false })
        );
      }
    }
    if (spec.hasTusks) {
      for (const [tIdx, sx] of [-1, 1].entries()) {
        const tusk = makeCurvedHornGeometry(6, 0.022 * s, 0.004 * s, 0.14 * s, sx * 0.03 * s, 0.03 * s, 6, '#f5e9d3');
        tusk.rotateX(0.35);
        tusk.rotateZ(sx * -0.35);
        tusk.translate(sx * 0.08 * s, -0.02 * s, 0.2 * s);
        headParts.push(tagPart(tusk, `boar_tusk_${tIdx}`, 'bone_ivory', '#f5e9d3', { lockVertical: false }));
      }
    }
    attachBaked('head', headParts);

    const jawGeo = makeSculptedLimbGeometry(spec.snoutLen * 0.8 * s, bw * 0.18, 0.035 * s, bw * 0.12, 0.026 * s, {
      profile: 'taper',
      radialSegs: 10,
      heightSegs: 4,
      hexColor: spec.secondaryHex,
    });
    jawGeo.rotateX(Math.PI * 0.5);
    attachBaked('jaw', [tagPart(jawGeo, 'quad_jaw', bodyMat, spec.secondaryHex)]);

    for (const side of ['l', 'r'] as const) {
      attachBaked(`ear_${side}`, [
        tagPart(
          makeCurvedHornGeometry(5, 0.036 * s, 0.006 * s, 0.13 * s, 0, -0.02 * s, 7, spec.primaryHex),
          `quad_ear_${side}`,
          bodyMat,
          spec.primaryHex,
          { lockVertical: false }
        ),
      ]);
    }

    attachBaked('tail_01', [
      tagPart(
        makeSplineLoftGeometry(
          [
            [0, 0, 0],
            [0, -0.02 * s, -0.22 * s],
          ],
          [0.052 * s, 0.036 * s],
          10,
          10,
          { colorHex: spec.primaryHex }
        ),
        'quad_tail1',
        bodyMat,
        spec.primaryHex
      ),
    ]);
    attachBaked('tail_02', [
      tagPart(
        makeSplineLoftGeometry(
          [
            [0, 0, 0],
            [0, -0.04 * s, -0.24 * s],
          ],
          [0.036 * s, 0.014 * s],
          10,
          10,
          { colorHex: spec.secondaryHex }
        ),
        'quad_tail2',
        'woven_cloth',
        spec.secondaryHex
      ),
    ]);

    for (const side of ['l', 'r'] as const) {
      const fu = makeSculptedLimbGeometry(0.26 * s, leg * 0.5, leg * 0.55, leg * 0.64, leg * 0.72, {
        profile: 'bicep',
        radialSegs: 12,
        heightSegs: 6,
        hexColor: spec.primaryHex,
      });
      fu.translate(0, -0.26 * s, 0);
      attachBaked(`front_upper_${side}`, [tagPart(fu, `quad_fu_${side}`, bodyMat, spec.primaryHex)]);

      const fl = makeSculptedLimbGeometry(0.26 * s, leg * 0.4, leg * 0.42, leg * 0.5, leg * 0.54, {
        profile: 'forearm',
        radialSegs: 10,
        heightSegs: 6,
        hexColor: spec.secondaryHex,
      });
      fl.translate(0, -0.26 * s, 0);
      attachBaked(`front_lower_${side}`, [tagPart(fl, `quad_fl_${side}`, bodyMat, spec.secondaryHex)]);

      const fp = makeSculptedLimbGeometry(0.11 * s, leg * 0.54, 0.035 * s, leg * 0.45, 0.03 * s, {
        profile: 'taper',
        radialSegs: 10,
        heightSegs: 4,
        hexColor: spec.accentHex,
      });
      fp.rotateX(Math.PI * 0.5);
      fp.translate(0, -0.02 * s, -0.02 * s);
      attachBaked(`front_paw_${side}`, [tagPart(fp, `quad_fp_${side}`, 'stitched_leather', spec.accentHex)]);

      const bt = makeSculptedLimbGeometry(0.27 * s, leg * 0.52, leg * 0.58, leg * 0.72, leg * 0.82, {
        profile: 'thigh',
        radialSegs: 12,
        heightSegs: 6,
        hexColor: spec.primaryHex,
      });
      bt.translate(0, -0.27 * s, 0);
      attachBaked(`back_thigh_${side}`, [tagPart(bt, `quad_bt_${side}`, bodyMat, spec.primaryHex)]);

      const bs = makeSculptedLimbGeometry(0.26 * s, leg * 0.38, leg * 0.42, leg * 0.48, leg * 0.52, {
        profile: 'calf',
        radialSegs: 10,
        heightSegs: 6,
        hexColor: spec.secondaryHex,
      });
      bs.translate(0, -0.26 * s, 0);
      attachBaked(`back_shin_${side}`, [tagPart(bs, `quad_bs_${side}`, bodyMat, spec.secondaryHex)]);

      const bp = makeSculptedLimbGeometry(0.11 * s, leg * 0.54, 0.035 * s, leg * 0.45, 0.03 * s, {
        profile: 'taper',
        radialSegs: 10,
        heightSegs: 4,
        hexColor: spec.accentHex,
      });
      bp.rotateX(Math.PI * 0.5);
      bp.translate(0, -0.02 * s, -0.02 * s);
      attachBaked(`back_paw_${side}`, [tagPart(bp, `quad_bp_${side}`, 'stitched_leather', spec.accentHex)]);
    }
  }

  const clips = buildQuadrupedAnimClips(rig);

  return {
    id,
    name: spec.labelPt,
    spec,
    rig,
    root,
    clips,
    meshes,
    materials,
    dispose: () => {
      for (const m of meshes) {
        m.removeFromParent();
        m.geometry.dispose();
      }
      for (const mat of materials) {
        const opts = mat.options;
        for (const tex of [opts.albedoMap, opts.normalMap, opts.emissionMap]) {
          if (tex && tex.userData?.pooled !== true) tex.dispose();
        }
        mat.dispose();
      }
    },
  };
}
