import * as THREE from 'three';
import structuralKnowledgeRaw from '../../data/structuralKnowledge.json';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import { voxelizeObject3D, buildVoxelMeshGroup } from '../Voxelizer';
import { createSeededRng } from './SdfVoxelPrimitives';
import {
  makeAxeHeadGeometry,
  makeBeveledBox,
  makeDomeShieldGeometry,
  makeLatheProfile,
  makeSdfOrganicMesh,
  makeSwordBladeGeometry,
  sdEllipsoid,
  sminPoly,
  sdfHashNoise3D,
  tagPart,
  type FinishMode,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import {
  bakeTaggedPartsAsset,
  createPixelizerMaterialFromBaked,
} from './PixelMaterialSynth';

export type PropKind =
  | 'sword'
  | 'axe'
  | 'shield'
  | 'staff'
  | 'torch'
  | 'chest'
  | 'barrel'
  | 'table'
  | 'pillar'
  | 'crate'
  | 'tree';

export interface PropBuildOptions {
  kind: PropKind;
  seed?: number;
  visualStyle?: 'lowpoly' | 'voxel';
  voxelResolution?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  objectId?: number;
  pixelSize?: number;
  finishMode?: FinishMode;
  aoStrength?: number;
  normalStrength?: number;
}

export interface GeneratedPropResult {
  kind: PropKind;
  root: THREE.Group;
  materials: PixelizerMaterial[];
  recommendedSocket: 'hand_r' | 'hand_l' | 'floor';
  dimensions: [number, number, number];
  dispose?: () => void;
}

const DEFAULT_PROP_COLORS: Record<PropKind, [string, string, string]> = {
  sword: ['#cad6e6', '#5e3c24', '#e0b34c'],
  axe: ['#9ba8ba', '#613c21', '#d8a642'],
  shield: ['#3b5f9e', '#d6b34d', '#5c4128'],
  staff: ['#5d3d23', '#7a58d6', '#38f0ff'],
  torch: ['#613b22', '#3b3e47', '#ff942e'],
  chest: ['#7a4d2b', '#414754', '#e8c04d'],
  barrel: ['#7d502d', '#3e434d', '#5e3b20'],
  table: ['#805230', '#5e3c22', '#42464f'],
  pillar: ['#737c8e', '#4c5363', '#a6b0c4'],
  crate: ['#8c5b32', '#613c21', '#4a311e'],
  tree: ['#5a3921', '#387d44', '#55a654'],
};

/**
 * Autonomously builds an RPG prop or handheld weapon calibrated to the empirical CC0 metrics
 * in `structuralKnowledge.json` and aligned for UAL hand sockets (`+Z` forward axis) or world floor (`y=0`).
 */
export function buildProceduralProp(
  options: PropBuildOptions,
  sharedResources?: PixelizerMaterialResources
): GeneratedPropResult {
  const seed = Math.floor(options.seed ?? 1337);
  const rng = createSeededRng(seed);
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const [d1, d2, d3] = DEFAULT_PROP_COLORS[options.kind];
  const cPrimary = options.primaryColor ?? d1;
  const cSecondary = options.secondaryColor ?? d2;
  const cAccent = options.accentColor ?? d3;
  const taggedParts: TaggedGeometryPart[] = [];
  let recommendedSocket: 'hand_r' | 'hand_l' | 'floor' = 'floor';
  let isMetallic = false;
  let hasRunicGlow = false;
  let emblemHex: string | undefined;

  const knowledge = structuralKnowledgeRaw;
  const tmpl = (knowledge.propTemplates as Record<string, { defaultLengthM?: number }>)[
    options.kind
  ];
  const scaleVar = 0.92 + rng() * 0.16;

  switch (options.kind) {
    case 'sword': {
      recommendedSocket = 'hand_r';
      isMetallic = true;
      const len = (tmpl?.defaultLengthM ?? 1.05) * scaleVar;
      const bladeW = 0.08 + rng() * 0.03;

      const grip = makeLatheProfile(
        [
          [0.024, 0],
          [0.02, 0.06],
          [0.022, 0.14],
          [0.025, 0.22],
        ],
        8,
        cSecondary
      );
      grip.rotateX(Math.PI * 0.5);
      grip.translate(0, 0, -0.13);
      taggedParts.push(tagPart(grip, 'sword_grip', 'stitched_leather', cSecondary, { lockVertical: false }));

      const pommel = makeBeveledBox(0.064, 0.056, 0.064, 0.016, cAccent, {
        offset: [0, 0, -0.155],
      });
      taggedParts.push(tagPart(pommel, 'sword_pommel', 'brushed_gold', cAccent, { lockVertical: false }));

      const guard = makeBeveledBox(0.25 + rng() * 0.06, 0.044, 0.056, 0.012, cAccent, {
        offset: [0, 0, 0.1],
      });
      taggedParts.push(tagPart(guard, 'sword_guard', 'brushed_gold', cAccent, { lockVertical: false }));

      const blade = makeSwordBladeGeometry(bladeW, 0.032, len * 0.68, 0.17, cPrimary);
      blade.rotateX(Math.PI * 0.5);
      blade.translate(0, 0, 0.12);
      taggedParts.push(
        tagPart(blade, 'sword_blade', 'forged_steel', cPrimary, {
          accentHex: cAccent,
          lockVertical: false,
        })
      );
      break;
    }

    case 'axe': {
      recommendedSocket = 'hand_r';
      isMetallic = true;
      const len = (tmpl?.defaultLengthM ?? 0.95) * scaleVar;

      const shaft = makeLatheProfile(
        [
          [0.032, 0],
          [0.024, len * 0.2],
          [0.022, len * 0.65],
          [0.028, len],
        ],
        8,
        cSecondary
      );
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, 0, -0.12);
      taggedParts.push(tagPart(shaft, 'axe_shaft', 'wood_planks', cSecondary, { lockVertical: false }));

      const collar = makeBeveledBox(0.065, 0.065, 0.12, 0.012, cAccent, {
        offset: [0, 0, len * 0.72 - 0.12],
      });
      taggedParts.push(tagPart(collar, 'axe_collar', 'brushed_gold', cAccent, { lockVertical: false }));

      const head = makeAxeHeadGeometry(0.25 + rng() * 0.06, 0.28, 0.052, false, cPrimary);
      head.rotateX(Math.PI * 0.5);
      head.translate(0.015, 0, len * 0.72 - 0.12);
      taggedParts.push(
        tagPart(head, 'axe_head', 'forged_steel', cPrimary, {
          accentHex: cAccent,
          lockVertical: false,
        })
      );
      break;
    }

    case 'shield': {
      recommendedSocket = 'hand_l';
      isMetallic = true;
      emblemHex = cAccent;
      const diam = 0.62 * scaleVar;

      const body = makeDomeShieldGeometry(diam * 0.86, diam * 1.05, 0.058, cPrimary);
      body.rotateY(Math.PI * 0.5);
      body.translate(0.07, 0.02, 0.04);
      taggedParts.push(
        tagPart(body, 'shield_body', 'forged_steel', cPrimary, {
          accentHex: cSecondary,
          landmarkKind: 'shield_face',
          lockVertical: true,
        })
      );

      const trimBar = makeBeveledBox(0.045, diam * 0.92, 0.08, 0.01, cSecondary, {
        offset: [0.05, 0.02, 0.04],
      });
      taggedParts.push(tagPart(trimBar, 'shield_brace', 'wood_planks', cSecondary, { lockVertical: true }));

      const boss = makeBeveledBox(0.052, 0.14, 0.14, 0.018, cAccent, {
        offset: [0.115, 0.04, 0.04],
      });
      taggedParts.push(tagPart(boss, 'shield_boss', 'brushed_gold', cAccent, { lockVertical: false }));
      break;
    }

    case 'staff': {
      recommendedSocket = 'hand_r';
      hasRunicGlow = true;
      const len = 1.62 * scaleVar;

      const shaft = makeLatheProfile(
        [
          [0.032, 0],
          [0.025, len * 0.12],
          [0.022, len * 0.72],
          [0.036, len * 0.88],
          [0.056, len * 0.96],
        ],
        8,
        cPrimary
      );
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, 0, -0.2);
      taggedParts.push(tagPart(shaft, 'staff_shaft', 'timber_frame', cPrimary, { lockVertical: false }));

      const crownZ = len * 0.96 - 0.2;
      const cradle = makeBeveledBox(0.14, 0.14, 0.1, 0.022, cSecondary, {
        offset: [0, 0, crownZ + 0.04],
      });
      taggedParts.push(tagPart(cradle, 'staff_cradle', 'brushed_gold', cSecondary, { lockVertical: false }));

      const orb = makeBeveledBox(0.11, 0.11, 0.13, 0.028, cAccent, {
        offset: [0, 0, crownZ + 0.14],
      });
      taggedParts.push(tagPart(orb, 'staff_crystal', 'runic_glow', cAccent, { lockVertical: false }));
      break;
    }

    case 'torch': {
      recommendedSocket = 'hand_l';
      hasRunicGlow = true;

      const handle = makeLatheProfile(
        [
          [0.02, 0],
          [0.025, 0.35],
          [0.034, 0.54],
        ],
        8,
        cPrimary
      );
      handle.rotateX(Math.PI * 0.5);
      handle.translate(0, 0, -0.06);
      taggedParts.push(tagPart(handle, 'torch_handle', 'wood_planks', cPrimary, { lockVertical: false }));

      const cup = makeLatheProfile(
        [
          [0.036, 0],
          [0.072, 0.07],
          [0.064, 0.1],
        ],
        8,
        cSecondary
      );
      cup.rotateX(Math.PI * 0.5);
      cup.translate(0, 0, 0.48);
      taggedParts.push(tagPart(cup, 'torch_cup', 'forged_steel', cSecondary, { lockVertical: false }));

      const flame = makeBeveledBox(0.1, 0.1, 0.16, 0.03, cAccent, {
        offset: [0, 0, 0.62],
      });
      taggedParts.push(tagPart(flame, 'torch_flame', 'runic_glow', cAccent, { lockVertical: false }));
      break;
    }

    case 'chest': {
      const w = 1.0 * scaleVar;
      const h = 0.72 * scaleVar;
      const d = 0.66 * scaleVar;
      emblemHex = cAccent;

      const base = makeBeveledBox(w, h * 0.58, d, 0.026, cPrimary, {
        offset: [0, h * 0.29, 0],
      });
      taggedParts.push(tagPart(base, 'chest_base', 'wood_planks', cPrimary, { lockVertical: true }));

      const lidLower = makeBeveledBox(w * 0.98, h * 0.24, d * 0.96, 0.032, cPrimary, {
        offset: [0, h * 0.68, 0],
      });
      taggedParts.push(tagPart(lidLower, 'chest_lid_lower', 'wood_planks', cPrimary, { lockVertical: true }));

      const lidCrown = makeBeveledBox(w * 0.94, h * 0.14, d * 0.76, 0.03, cPrimary, {
        offset: [0, h * 0.85, 0],
      });
      taggedParts.push(tagPart(lidCrown, 'chest_lid_crown', 'wood_planks', cPrimary, { lockVertical: true }));

      for (const [bIdx, sx] of [-w * 0.36, w * 0.36].entries()) {
        const band = makeBeveledBox(0.08, h * 0.92, d + 0.04, 0.014, cSecondary, {
          offset: [sx, h * 0.46, 0],
        });
        taggedParts.push(tagPart(band, `chest_band_${bIdx}`, 'forged_steel', cSecondary, { lockVertical: true }));
      }

      const lock = makeBeveledBox(0.16, 0.18, 0.06, 0.015, cAccent, {
        offset: [0, h * 0.56, d * 0.5 + 0.015],
      });
      taggedParts.push(
        tagPart(lock, 'chest_lock', 'brushed_gold', cAccent, {
          landmarkKind: 'chest_crest',
          lockVertical: true,
        })
      );
      break;
    }

    case 'barrel': {
      const r = 0.36 * scaleVar;
      const h = 0.94 * scaleVar;

      const body = makeLatheProfile(
        [
          [r * 0.82, 0],
          [r * 0.94, h * 0.22],
          [r, h * 0.5],
          [r * 0.94, h * 0.78],
          [r * 0.82, h],
        ],
        10,
        cPrimary,
        { staveGrooveAmplitude: 0.045, smoothRadialNormals: false }
      );
      taggedParts.push(tagPart(body, 'barrel_staves', 'wood_planks', cPrimary, { lockVertical: true }));

      for (const [hIdx, yFrac] of [0.18, 0.8].entries()) {
        const hoop = makeLatheProfile(
          [
            [r * 0.99, yFrac * h - 0.035],
            [r * 1.03, yFrac * h],
            [r * 0.99, yFrac * h + 0.035],
          ],
          10,
          cSecondary
        );
        taggedParts.push(tagPart(hoop, `barrel_hoop_${hIdx}`, 'forged_steel', cSecondary, { lockVertical: true }));
      }

      const bung = makeBeveledBox(r * 0.3, 0.04, r * 0.3, 0.008, cAccent, {
        offset: [0, h + 0.005, 0],
      });
      taggedParts.push(tagPart(bung, 'barrel_lid_cap', 'wood_planks', cAccent, { lockVertical: true }));
      break;
    }

    case 'table': {
      const w = 1.75 * scaleVar;
      const h = 0.84 * scaleVar;
      const d = 0.96 * scaleVar;

      const top = makeBeveledBox(w, 0.11, d, 0.022, cPrimary, {
        offset: [0, h - 0.055, 0],
      });
      taggedParts.push(tagPart(top, 'table_top', 'wood_planks', cPrimary, { lockVertical: true }));

      const apron = makeBeveledBox(w * 0.86, 0.09, d * 0.78, 0.014, cAccent, {
        offset: [0, h - 0.14, 0],
      });
      taggedParts.push(tagPart(apron, 'table_apron', 'timber_frame', cAccent, { lockVertical: true }));

      let legIdx = 0;
      for (const lx of [-w * 0.41, w * 0.41]) {
        for (const lz of [-d * 0.37, d * 0.37]) {
          const leg = makeBeveledBox(0.13, h - 0.11, 0.13, 0.018, cSecondary, {
            offset: [lx, (h - 0.11) * 0.5, lz],
          });
          taggedParts.push(
            tagPart(leg, `table_leg_${legIdx++}`, 'timber_frame', cSecondary, { lockVertical: true })
          );
        }
      }
      break;
    }

    case 'pillar': {
      const h = 3.2 * scaleVar;
      const base = makeBeveledBox(0.92, 0.34, 0.92, 0.04, cSecondary, {
        offset: [0, 0.17, 0],
      });
      taggedParts.push(tagPart(base, 'pillar_base', 'stone_masonry', cSecondary, { lockVertical: true }));

      const shaft = makeLatheProfile(
        [
          [0.36, 0.34],
          [0.32, 0.5],
          [0.29, h - 0.52],
          [0.34, h - 0.34],
        ],
        10,
        cPrimary,
        { staveGrooveAmplitude: 0.03 }
      );
      taggedParts.push(tagPart(shaft, 'pillar_shaft', 'stone_masonry', cPrimary, { lockVertical: true }));

      const cap = makeBeveledBox(0.96, 0.34, 0.96, 0.04, cAccent, {
        offset: [0, h - 0.17, 0],
      });
      taggedParts.push(tagPart(cap, 'pillar_cap', 'mossy_cobble', cAccent, { lockVertical: true }));
      break;
    }

    case 'crate': {
      const s = 0.9 * scaleVar;
      const box = makeBeveledBox(s, s, s, 0.032, cPrimary, {
        offset: [0, s * 0.5, 0],
      });
      taggedParts.push(tagPart(box, 'crate_body', 'wood_planks', cPrimary, { lockVertical: true }));

      const frameTop = makeBeveledBox(s * 1.05, s * 0.14, s * 1.05, 0.018, cSecondary, {
        offset: [0, s - s * 0.07, 0],
      });
      const frameBot = makeBeveledBox(s * 1.05, s * 0.14, s * 1.05, 0.018, cSecondary, {
        offset: [0, s * 0.07, 0],
      });
      const brace = makeBeveledBox(s * 0.96, 0.12, 0.06, 0.012, cAccent, {
        offset: [0, s * 0.5, s * 0.49],
      });
      brace.rotateZ(0.65);
      taggedParts.push(
        tagPart(frameTop, 'crate_trim_top', 'timber_frame', cSecondary, { lockVertical: true }),
        tagPart(frameBot, 'crate_trim_bot', 'timber_frame', cSecondary, { lockVertical: true }),
        tagPart(brace, 'crate_brace', 'timber_frame', cAccent, { lockVertical: true })
      );
      break;
    }

    case 'tree': {
      const trunkH = (1.45 + rng() * 0.35) * scaleVar;
      const trunk = makeLatheProfile(
        [
          [0.34, 0],
          [0.24, 0.25],
          [0.18, trunkH * 0.72],
          [0.14, trunkH + 0.15],
        ],
        8,
        cPrimary,
        { staveGrooveAmplitude: 0.05 }
      );
      taggedParts.push(tagPart(trunk, 'tree_trunk', 'timber_frame', cPrimary, { lockVertical: true }));

      const rCan = 0.95 * scaleVar;
      const yMid = trunkH + 0.65 * scaleVar;
      const canopyGeo = makeSdfOrganicMesh(
        (x, y, z) => {
          const dMain = sdEllipsoid(x, y, z, 0, yMid, 0, rCan, rCan * 0.72, rCan);
          const dTop = sdEllipsoid(x, y, z, 0.1 * scaleVar, yMid + 0.52 * scaleVar, -0.06 * scaleVar, rCan * 0.68, rCan * 0.56, rCan * 0.68);
          const dSide = sdEllipsoid(x, y, z, -0.45 * scaleVar, yMid - 0.14 * scaleVar, 0.25 * scaleVar, rCan * 0.56, rCan * 0.45, rCan * 0.56);
          const base = sminPoly(sminPoly(dMain, dTop, 0.22), dSide, 0.2);
          return base + sdfHashNoise3D(x * 2.5, y * 2.5, z * 2.5, seed) * 0.08;
        },
        [-rCan * 1.4, trunkH - 0.1, -rCan * 1.4],
        [rCan * 1.4, yMid + rCan * 1.25, rCan * 1.4],
        14,
        cSecondary
      );
      taggedParts.push(
        tagPart(canopyGeo, 'tree_canopy', 'foliage_leaf', cSecondary, {
          accentHex: cAccent,
          lockVertical: true,
        })
      );
      break;
    }
  }

  const ppm = recommendedSocket === 'floor' ? 32 : 64;
  const baked = bakeTaggedPartsAsset(taggedParts, {
    finishMode,
    texelsPerMeter: ppm,
    seed,
    aoRays: 12,
    aoMaxDist: recommendedSocket === 'floor' ? 0.65 : 0.35,
    aoStrength: options.aoStrength ?? 0.55,
    normalStrength: options.normalStrength ?? 0.36,
    emblemHex,
    emissiveRuneHex: hasRunicGlow ? cAccent : null,
    usePool: true,
    cacheKey: `prop:${options.kind}:${ppm}`,
    inspectUvs: options.visualStyle !== 'voxel',
  });
  for (const p of taggedParts) p.geometry.dispose();

  const root = new THREE.Group();
  root.name = `Prop_${options.kind}`;
  root.userData.recommendedSocket = recommendedSocket;
  root.userData.unwrapMetrics = baked.unwrapMetrics;

  const materials: PixelizerMaterial[] = [];
  const objId = options.objectId ?? 22;
  const px = options.pixelSize ?? 1;

  if (options.visualStyle === 'voxel') {
    const bakedMat = createPixelizerMaterialFromBaked(
      baked,
      {
        pixelated: false,
        objectId: objId,
        workflow: isMetallic ? 'metallic' : 'specular',
        metallic: isMetallic ? 0.32 : 0.05,
        smoothness: isMetallic ? 0.45 : 0.18,
      },
      sharedResources
    );
    const tmpMesh = new THREE.Mesh(baked.geometry, bakedMat);
    const voxRes = options.voxelResolution ?? (recommendedSocket === 'floor' ? 22 : 18);
    const grid = voxelizeObject3D(tmpMesh, {
      resolution: voxRes,
      preserveWorldScale: true,
      fillSolidInterior: true,
    });
    bakedMat.dispose();
    baked.dispose();

    const { group, material } = buildVoxelMeshGroup(grid, sharedResources, {
      objectId: objId,
      pixelSize: 1,
      workflow: isMetallic ? 'metallic' : 'specular',
      metallic: isMetallic ? 0.35 : 0.05,
    });
    root.add(group);
    materials.push(material);
  } else {
    const mat = createPixelizerMaterialFromBaked(
      baked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: objId,
        outlineColor: '#12101a',
        outlineAlpha: 1.0,
        edgeHighlight: 0.4,
        edgeBevelWeight: 0.62,
        useColorGrading: true,
        workflow: isMetallic ? 'metallic' : 'specular',
        metallic: isMetallic ? 0.32 : 0.05,
        smoothness: isMetallic ? 0.45 : 0.2,
      },
      sharedResources
    );
    const mesh = new THREE.Mesh(baked.geometry, mat);
    mesh.name = `${options.kind}_Mesh`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    materials.push(mat);
  }

  const box = new THREE.Box3().setFromObject(root);
  const sz = new THREE.Vector3();
  box.getSize(sz);

  return {
    kind: options.kind,
    root,
    materials,
    recommendedSocket,
    dimensions: [Number(sz.x.toFixed(3)), Number(sz.y.toFixed(3)), Number(sz.z.toFixed(3))],
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      for (const m of materials) {
        const o = m.options;
        for (const t of [o.albedoMap, o.normalMap, o.emissionMap]) {
          if (t && t.userData?.pooled !== true) t.dispose();
        }
        m.dispose();
      }
    },
  };
}

