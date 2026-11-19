import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
import {
  buildNwlMonster,
  type GeneratedMonsterResult,
  type NwlMonsterId,
} from './MonsterBuilder';
import {
  computeGeometryTangents,
  createSeededRng,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';
import {
  makeBeveledBox,
  makeLatheProfile,
  makeSdfOrganicMesh,
  sdEllipsoid,
  sdfHashNoise3D,
  tagPart,
  type FinishMode,
  type TaggedGeometryPart,
} from './ProceduralGeometryKit';
import {
  bakeTaggedPartsAsset,
  createPixelizerMaterialFromBaked,
  mapGeometryToSheetSlot,
  synthesizeModularTilesetSheet,
} from './PixelMaterialSynth';
import { bakeVertexAoAndCreases } from './VertexAndTexelBaker';
import {
  buildInstancedPropBatch,
  type InstancePlacement,
} from './InstancedBatchKit';
import {
  buildJabamiLeafCardsGeometryAndMaterial,
  buildJabamiLeafCardsMesh,
  buildStylizedTreeTrunkAndCoreParts,
  type LeafCardSpec,
} from './PropBuilder';

export type NwlTilesetBiome = 'green_ruins' | 'city' | 'training_field';
export type DungeonRoomKind = 'entrance' | 'corridor' | 'combat' | 'treasure' | 'boss';

export const NWL_TILE_M = 1.5;
export const NWL_WALL_H = 3.0;

export interface NwlTilesetBuildOptions {
  finishMode?: FinishMode;
  seed?: number;
  aoStrength?: number;
  normalStrength?: number;
}

const RUINS_PAL = {
  mossStone: '#24523b',
  floraGreen: '#1a7a3e',
  stoneSlate: '#6d758d',
  stoneLight: '#b3b9d1',
  stoneDark: '#3b1725',
  voidDark: '#141013',
  wood: '#73172d',
  gold: '#f9a31b',
  goldBright: '#ffd541',
  ember: '#fa6a0a',
  crimson: '#b4202a',
  portalBlue: '#249fde',
  purple: '#4a3052',
};

function makeTileMat(
  res: PixelizerMaterialResources | undefined,
  pixelated: boolean,
  objectId: number,
  px = 3,
  emissive = '#000000',
  emissiveInt = 0
): PixelizerMaterial {
  const mat = new PixelizerMaterial(
    {
      pixelated,
      pixelSize: pixelated ? px : 1,
      objectId,
      outlineColor: '#14101c',
      outlineAlpha: pixelated ? 1 : 0,
      baseColor: '#ffffff',
      emissionColor: emissive,
      emissionIntensity: emissiveInt,
      edgeHighlight: pixelated ? 0.35 : 0.08,
      edgeBevelWeight: pixelated ? 0.72 : 0,
      smoothness: 0.18,
      useColorGrading: pixelated,
    },
    res
  );
  mat.vertexColors = true;
  return mat;
}

function attachSnap(obj: THREE.Object3D, px = 3, gridRef?: THREE.Object3D): void {
  obj.userData.pixelizer = {
    snap: {
      snapPosition: false,
      alignPixelGrid: true,
      alignmentPixelSize: px,
      angleSnapMode: 'none',
      angleResolutionDeg: 45,
    },
    gridReference: gridRef ?? obj,
  } satisfies PixelizerObjectAttachment;
}

function disposeMaterialsAndOwnedTextures(materials: PixelizerMaterial[]): void {
  const seenTex = new Set<THREE.Texture>();
  for (const m of materials) {
    const o = m.options;
    for (const tex of [o.albedoMap, o.normalMap, o.roughnessMap, o.emissionMap]) {
      if (tex && tex.userData?.pooled !== true && !seenTex.has(tex)) {
        seenTex.add(tex);
        tex.dispose();
      }
    }
    m.dispose();
  }
}

export interface GeneratedTilesetCatalog {
  name: string;
  biome: NwlTilesetBiome;
  pieceCount: number;
  tileSizeM: number;
  root: THREE.Group;
  materials: PixelizerMaterial[];
  dispose: () => void;
}

/**
 * Generates an inspected catalog grid of modular 1.5m NWL tileset pieces,
 * walls, doors, flora, destructibles (barrel/crate/vase), stairs, altar & traps.
 */
export function buildNwlTilesetCatalog(
  biome: NwlTilesetBiome = 'green_ruins',
  sharedResources?: PixelizerMaterialResources,
  options: NwlTilesetBuildOptions = {}
): GeneratedTilesetCatalog {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 303);
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;

  const root = new THREE.Group();
  root.name = `NWL_Tileset_${biome}`;
  const materials: PixelizerMaterial[] = [];
  const px = 1;

  const palFloorA =
    biome === 'green_ruins'
      ? RUINS_PAL.stoneSlate
      : biome === 'city'
      ? RUINS_PAL.stoneLight
      : RUINS_PAL.floraGreen;
  const palFloorB =
    biome === 'green_ruins'
      ? RUINS_PAL.mossStone
      : biome === 'city'
      ? RUINS_PAL.stoneSlate
      : RUINS_PAL.mossStone;
  const palWall =
    biome === 'training_field' ? RUINS_PAL.wood : RUINS_PAL.stoneLight;

  const pieceParts: TaggedGeometryPart[] = [];
  const floorParts: TaggedGeometryPart[] = [];
  let pieceCount = 0;

  const cellPos = (idx: number): [number, number] => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    return [(col - 2) * 2.4, (row - 1.5) * 2.4];
  };

  // Row 0 (5 Floor & Edge Variants — sculpted beveled masonry, mossy cobble, rune slab, cliff edge)
  for (let i = 0; i < 5; i++) {
    const [x, z] = cellPos(pieceCount++);
    const hex = i % 2 === 0 ? palFloorA : palFloorB;
    const slab = makeBeveledBox(NWL_TILE_M, 0.24, NWL_TILE_M, 0.025, hex, {
      offset: [x, 0.12, z],
    });
    const recipe =
      i === 2
        ? 'runic_glow'
        : i % 2 === 1
          ? 'mossy_cobble'
          : 'stone_masonry';
    floorParts.push(
      tagPart(slab, `cat_floor_${i}`, recipe, hex, {
        accentHex: i === 2 ? RUINS_PAL.portalBlue : RUINS_PAL.floraGreen,
        landmarkKind: i === 2 ? 'rune_panel' : 'none',
        lockVertical: false,
      })
    );

    if (i === 4) {
      const skirt = makeBeveledBox(NWL_TILE_M, 0.72, 0.28, 0.02, RUINS_PAL.stoneDark, {
        offset: [x, -0.24, z + 0.62],
      });
      floorParts.push(
        tagPart(skirt, 'cat_floor_cliff_skirt', 'stone_masonry', RUINS_PAL.stoneDark, {
          lockVertical: true,
        })
      );
    }
  }

  // Row 1 (5 Wall Modules: Straight, Outer Corner, Broken Low Wall, Arch Door, Torch Niche)
  const wallKinds = ['straight', 'corner', 'broken', 'arch', 'torch_wall'] as const;
  for (const wk of wallKinds) {
    const [x, z] = cellPos(pieceCount++);
    const baseTile = makeBeveledBox(NWL_TILE_M, 0.18, NWL_TILE_M, 0.02, palFloorA, {
      offset: [x, 0.09, z],
    });
    floorParts.push(
      tagPart(baseTile, `cat_wallbase_${wk}`, 'stone_masonry', palFloorA, {
        lockVertical: false,
      })
    );

    if (wk === 'straight') {
      const w = makeBeveledBox(NWL_TILE_M, NWL_WALL_H, 0.34, 0.03, palWall, {
        offset: [x, NWL_WALL_H * 0.5 + 0.18, z - 0.55],
      });
      pieceParts.push(
        tagPart(w, 'cat_wall_straight', 'stone_masonry', palWall, { lockVertical: true })
      );
    } else if (wk === 'corner') {
      const w1 = makeBeveledBox(NWL_TILE_M, NWL_WALL_H, 0.34, 0.03, palWall, {
        offset: [x, NWL_WALL_H * 0.5 + 0.18, z - 0.55],
      });
      const w2 = makeBeveledBox(0.34, NWL_WALL_H, NWL_TILE_M, 0.03, palFloorB, {
        offset: [x - 0.55, NWL_WALL_H * 0.5 + 0.18, z],
      });
      pieceParts.push(
        tagPart(w1, 'cat_wall_corner_a', 'stone_masonry', palWall, { lockVertical: true }),
        tagPart(w2, 'cat_wall_corner_b', 'mossy_cobble', palFloorB, { lockVertical: true })
      );
    } else if (wk === 'broken') {
      const wLow = makeBeveledBox(NWL_TILE_M, 1.35, 0.34, 0.03, palWall, {
        offset: [x, 0.85, z - 0.55],
      });
      const brick = makeBeveledBox(0.46, 0.38, 0.36, 0.025, palFloorB, {
        offset: [x - 0.36, 1.68, z - 0.55],
      });
      pieceParts.push(
        tagPart(wLow, 'cat_wall_broken', 'mossy_cobble', palWall, { lockVertical: true }),
        tagPart(brick, 'cat_wall_brick', 'stone_masonry', palFloorB, { lockVertical: true })
      );
    } else if (wk === 'arch') {
      for (const [jIdx, sx] of [-0.52, 0.52].entries()) {
        const jamb = makeBeveledBox(0.42, NWL_WALL_H, 0.36, 0.025, palWall, {
          offset: [x + sx, NWL_WALL_H * 0.5 + 0.18, z - 0.3],
        });
        pieceParts.push(
          tagPart(jamb, `cat_arch_jamb_${jIdx}`, 'stone_masonry', palWall, { lockVertical: true })
        );
      }
      const lintel = makeBeveledBox(NWL_TILE_M + 0.06, 0.72, 0.44, 0.035, RUINS_PAL.stoneDark, {
        offset: [x, 2.82, z - 0.3],
      });
      pieceParts.push(
        tagPart(lintel, 'cat_arch_lintel', 'stone_masonry', RUINS_PAL.stoneDark, {
          lockVertical: true,
        })
      );
    } else {
      const w = makeBeveledBox(NWL_TILE_M, NWL_WALL_H, 0.34, 0.03, palWall, {
        offset: [x, NWL_WALL_H * 0.5 + 0.18, z - 0.55],
      });
      const sconce = makeBeveledBox(0.2, 0.36, 0.24, 0.02, RUINS_PAL.stoneDark, {
        offset: [x, 1.85, z - 0.28],
      });
      const flame = makeBeveledBox(0.22, 0.26, 0.22, 0.05, RUINS_PAL.ember, {
        offset: [x, 2.16, z - 0.24],
      });
      pieceParts.push(
        tagPart(w, 'cat_torch_wall', 'stone_masonry', palWall, { lockVertical: true }),
        tagPart(sconce, 'cat_torch_sconce', 'forged_steel', RUINS_PAL.stoneDark, {
          lockVertical: true,
        }),
        tagPart(flame, 'cat_torch_flame', 'runic_glow', RUINS_PAL.ember, { lockVertical: false })
      );
    }
  }

  // Row 2 (5 Interactive & Nature Pieces: Tree, Boulder, Altar, Chest, Spike Trap)
  const catTreeLeafCards: LeafCardSpec[] = [];
  {
    const [x, z] = cellPos(pieceCount++);
    const catTree = buildStylizedTreeTrunkAndCoreParts({
      seed: seed + 11,
      scale: 0.92,
      barkHex: '#5a3921',
      foliageDarkHex: RUINS_PAL.floraGreen,
      foliageSunHex: '#47f379',
      tagPrefix: 'cat_tree',
      includeVoxelTiers: finishMode === 'classic_flat',
      sdfSteps: 10,
    });
    for (const part of catTree.taggedParts) {
      part.geometry.translate(x, 0, z);
      pieceParts.push(part);
    }
    for (const card of catTree.leafCards) {
      catTreeLeafCards.push({
        ...card,
        center: [card.center[0] + x, card.center[1], card.center[2] + z],
      });
    }
  }
  {
    const [x, z] = cellPos(pieceCount++);
    const boulder = makeSdfOrganicMesh(
      (px0, py0, pz0) => {
        const dRock = sdEllipsoid(px0, py0, pz0, x, 0.48, z, 0.62, 0.48, 0.56);
        return dRock + sdfHashNoise3D(px0 * 2.4, py0 * 2.4, pz0 * 2.4, seed + 5) * 0.09;
      },
      [x - 0.85, 0.0, z - 0.85],
      [x + 0.85, 1.1, z + 0.85],
      12,
      RUINS_PAL.stoneSlate
    );
    pieceParts.push(
      tagPart(boulder, 'cat_moss_boulder', 'mossy_cobble', RUINS_PAL.stoneSlate, {
        accentHex: RUINS_PAL.floraGreen,
        lockVertical: true,
      })
    );
  }
  {
    const [x, z] = cellPos(pieceCount++);
    const plinth = makeBeveledBox(1.12, 0.85, 0.8, 0.04, RUINS_PAL.purple, {
      offset: [x, 0.425, z],
    });
    const gem = makeBeveledBox(0.32, 0.36, 0.32, 0.08, RUINS_PAL.goldBright, {
      offset: [x, 1.15, z],
    });
    pieceParts.push(
      tagPart(plinth, 'cat_altar_plinth', 'stone_masonry', RUINS_PAL.purple, {
        lockVertical: true,
      }),
      tagPart(gem, 'cat_altar_gem', 'runic_glow', RUINS_PAL.goldBright, { lockVertical: false })
    );
  }
  {
    const [x, z] = cellPos(pieceCount++);
    const body = makeBeveledBox(0.88, 0.56, 0.58, 0.03, RUINS_PAL.wood, {
      offset: [x, 0.28, z],
    });
    const strap = makeBeveledBox(0.92, 0.16, 0.62, 0.018, RUINS_PAL.gold, {
      offset: [x, 0.42, z],
    });
    pieceParts.push(
      tagPart(body, 'cat_chest_body', 'wood_planks', RUINS_PAL.wood, { lockVertical: true }),
      tagPart(strap, 'cat_chest_strap', 'brushed_gold', RUINS_PAL.gold, {
        landmarkKind: 'chest_crest',
        lockVertical: true,
      })
    );
  }
  {
    const [x, z] = cellPos(pieceCount++);
    const plate = makeBeveledBox(1.25, 0.12, 1.25, 0.02, RUINS_PAL.stoneDark, {
      offset: [x, 0.06, z],
    });
    pieceParts.push(
      tagPart(plate, 'cat_trap_plate', 'stone_masonry', RUINS_PAL.stoneDark, { lockVertical: false })
    );
    let spIdx = 0;
    for (const sx of [-0.36, 0.36]) {
      for (const sz of [-0.36, 0.36]) {
        const spike = prepareColoredPart(new THREE.ConeGeometry(0.11, 0.58, 5), RUINS_PAL.stoneLight);
        spike.translate(x + sx, 0.4, z + sz);
        pieceParts.push(
          tagPart(spike, `cat_trap_spike_${spIdx++}`, 'forged_steel', RUINS_PAL.stoneLight, {
            lockVertical: true,
          })
        );
      }
    }
  }

  // Row 3 (Destructibles Intact & Broken + Descent Stairs)
  {
    const [x, z] = cellPos(pieceCount++);
    const barrel = makeLatheProfile(
      [
        [0.28, 0],
        [0.34, 0.38],
        [0.28, 0.76],
      ],
      8,
      RUINS_PAL.wood,
      { offset: [x - 0.32, 0, z], staveGrooveAmplitude: 0.045 }
    );
    const crate = makeBeveledBox(0.62, 0.62, 0.62, 0.028, RUINS_PAL.gold, {
      offset: [x + 0.35, 0.31, z],
    });
    pieceParts.push(
      tagPart(barrel, 'cat_barrel', 'wood_planks', RUINS_PAL.wood, { lockVertical: true }),
      tagPart(crate, 'cat_crate', 'wood_planks', RUINS_PAL.gold, { lockVertical: true })
    );
  }
  {
    const [x, z] = cellPos(pieceCount++);
    for (let k = 0; k < 4; k++) {
      const sh = makeBeveledBox(0.32, 0.1, 0.18, 0.015, k % 2 === 0 ? RUINS_PAL.wood : RUINS_PAL.stoneSlate);
      sh.rotateY(k * 0.8);
      sh.translate(x + (k - 1.5) * 0.25, 0.06, z + ((k % 2) - 0.5) * 0.3);
      pieceParts.push(
        tagPart(
          sh,
          `cat_debris_${k}`,
          k % 2 === 0 ? 'wood_planks' : 'stone_masonry',
          k % 2 === 0 ? RUINS_PAL.wood : RUINS_PAL.stoneSlate,
          { lockVertical: false }
        )
      );
    }
  }
  {
    const [x, z] = cellPos(pieceCount++);
    for (let s = 0; s < 4; s++) {
      const step = makeBeveledBox(1.3, 0.22, 0.35, 0.02, RUINS_PAL.stoneLight, {
        offset: [x, 0.78 - s * 0.2, z - 0.45 + s * 0.3],
      });
      pieceParts.push(
        tagPart(step, `cat_stair_${s}`, 'stone_masonry', RUINS_PAL.stoneLight, {
          lockVertical: true,
        })
      );
    }
  }

  const floorBaked = bakeTaggedPartsAsset(floorParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed,
    aoRays: 4,
    aoStrength: aoStrength * 0.45,
    normalStrength,
    emissiveRuneHex: RUINS_PAL.portalBlue,
    usePool: true,
    cacheKey: `nwl_cat_floor:${biome}`,
    inspectUvs: false,
  });
  for (const p of floorParts) p.geometry.dispose();

  const pieceBaked = bakeTaggedPartsAsset(pieceParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 19,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emblemHex: RUINS_PAL.goldBright,
    emissiveRuneHex: RUINS_PAL.ember,
    usePool: true,
    cacheKey: `nwl_cat_pieces:${biome}`,
    inspectUvs: false,
  });
  for (const p of pieceParts) p.geometry.dispose();

  const floorMat = createPixelizerMaterialFromBaked(
    floorBaked,
    {
      pixelated: false,
      objectId: 0,
      outlineAlpha: 0,
      edgeHighlight: 0.1,
      edgeBevelWeight: 0,
      smoothness: 0.18,
      useColorGrading: false,
    },
    sharedResources
  );
  const pieceMat = createPixelizerMaterialFromBaked(
    pieceBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 52,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.38,
      edgeBevelWeight: 0.72,
      smoothness: 0.2,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(floorMat, pieceMat);

  const floorMesh = new THREE.Mesh(floorBaked.geometry, floorMat);
  floorMesh.name = 'Tileset_Catalog_Floors';
  floorMesh.receiveShadow = true;
  attachSnap(floorMesh, 1, root);

  const pieceMesh = new THREE.Mesh(pieceBaked.geometry, pieceMat);
  pieceMesh.name = 'Tileset_Catalog_Pieces';
  pieceMesh.castShadow = true;
  pieceMesh.receiveShadow = true;
  attachSnap(pieceMesh, px, root);

  root.userData.unwrapMetrics = pieceBaked.unwrapMetrics;
  root.add(floorMesh, pieceMesh);

  if (finishMode !== 'classic_flat' && catTreeLeafCards.length > 0) {
    const { mesh: catLeafMesh, material: catLeafMat } = buildJabamiLeafCardsMesh(
      {
        cards: catTreeLeafCards,
        seed: seed + 17,
        sunlitHex: '#47f379',
        shadedHex: RUINS_PAL.floraGreen,
        referenceMetrics: pieceBaked.unwrapMetrics,
        pixelated: true,
        pixelSize: px,
        objectId: 52,
        alphaClipThreshold: 0.5,
        usePool: true,
        cacheKey: `nwl_catalog:${biome}:tree_leaf_cards:${seed}`,
        name: 'Tileset_Catalog_Tree_LeafCards',
      },
      sharedResources
    );
    attachSnap(catLeafMesh, px, root);
    root.add(catLeafMesh);
    materials.push(catLeafMat);
  }

  return {
    name: root.name,
    biome,
    pieceCount,
    tileSizeM: NWL_TILE_M,
    root,
    materials,
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.customDepthMaterial) obj.customDepthMaterial.dispose();
        }
      });
      disposeMaterialsAndOwnedTextures(materials);
    },
  };
}

export interface DungeonRoomInfo {
  id: string;
  kind: DungeonRoomKind;
  minC: number;
  maxC: number;
  minR: number;
  maxR: number;
  centerWorld: THREE.Vector3;
}

export interface DungeonEnemySpawn {
  id: NwlMonsterId;
  roomId: string;
  worldPos: THREE.Vector3;
  monster: GeneratedMonsterResult;
}

export interface DungeonDestructibleProp {
  kind: 'barrel' | 'crate' | 'vase';
  worldPos: THREE.Vector3;
  intactMesh: THREE.Mesh;
  brokenMesh: THREE.Mesh;
  broken: boolean;
  shatter: () => void;
}

export interface DungeonTrapZone {
  worldPos: THREE.Vector3;
  radius: number;
  active: boolean;
  spikesMesh: THREE.Mesh;
}

export interface GeneratedGreenRuinsFloor1 {
  name: string;
  seed: number;
  tileSizeM: number;
  cols: number;
  rows: number;
  walkableGrid: boolean[][];
  rooms: DungeonRoomInfo[];
  root: THREE.Group;
  playerSpawnPos: THREE.Vector3;
  returnPortalPos: THREE.Vector3;
  exitStairsPos: THREE.Vector3;
  chestPos: THREE.Vector3;
  altarPos: THREE.Vector3;
  enemySpawns: DungeonEnemySpawn[];
  destructibles: DungeonDestructibleProp[];
  traps: DungeonTrapZone[];
  materials: PixelizerMaterial[];
  isWalkableWorld: (wx: number, wz: number) => boolean;
  cellToWorld: (c: number, r: number) => THREE.Vector3;
  update: (time: number) => void;
  dispose: () => void;
}

/**
 * Generates **Ruínas Verdes — Andar 1** on the strict 1.5m NWL tile grid:
 * Entrance Portal Room -> Corridors -> 2 Combat Rooms -> Altar/Chest Wing -> Boss Demônio Arena + Descent Stairs.
 */
export function buildGreenRuinsFloor1(
  seed = 101,
  sharedResources?: PixelizerMaterialResources,
  options: NwlTilesetBuildOptions = {}
): GeneratedGreenRuinsFloor1 {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;
  const rng = createSeededRng(seed);
  const cols = 19;
  const rows = 27;
  const px = 1;

  const walkableGrid: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  const cellToWorld = (c: number, r: number): THREE.Vector3 => {
    const wx = (c - (cols - 1) * 0.5) * NWL_TILE_M;
    const wz = ((rows - 1) * 0.5 - r) * NWL_TILE_M; // r=0 South entrance -> progresses North (-Z)
    return new THREE.Vector3(wx, 0, wz);
  };

  const carveRect = (minC: number, maxC: number, minR: number, maxR: number) => {
    for (let r = Math.max(1, minR); r <= Math.min(rows - 2, maxR); r++) {
      for (let c = Math.max(1, minC); c <= Math.min(cols - 2, maxC); c++) {
        walkableGrid[r][c] = true;
      }
    }
  };

  const rooms: DungeonRoomInfo[] = [];
  const addRoom = (
    id: string,
    kind: DungeonRoomKind,
    minC: number,
    maxC: number,
    minR: number,
    maxR: number
  ) => {
    carveRect(minC, maxC, minR, maxR);
    const centerWorld = cellToWorld((minC + maxC) * 0.5, (minR + maxR) * 0.5);
    rooms.push({ id, kind, minC, maxC, minR, maxR, centerWorld });
  };

  // Connected NWL layout (South entrance -> North Boss Arena)
  addRoom('room_entrance', 'entrance', 7, 11, 1, 4);
  carveRect(8, 10, 4, 7); // corridor 1
  const shiftA = rng() > 0.5 ? 1 : -1;
  addRoom('room_combat_1', 'combat', 5 + shiftA, 13 + shiftA, 7, 11);
  carveRect(8, 10, 11, 14); // corridor 2 (traps)
  // Treasure/Altar wing to West
  carveRect(3, 8, 12, 13);
  addRoom('room_treasure', 'treasure', 1, 4, 11, 15);
  // Second combat room
  addRoom('room_combat_2', 'combat', 6, 13, 14, 18);
  carveRect(8, 10, 18, 20); // corridor to boss
  // Giant Demon Boss Arena
  addRoom('room_boss', 'boss', 5, 13, 20, 25);

  const root = new THREE.Group();
  root.name = `RuinasVerdes_Andar1_Seed${seed}`;
  const materials: PixelizerMaterial[] = [];

  const isTextured = finishMode === 'textured_ao';
  const sheet = isTextured
    ? synthesizeModularTilesetSheet(
        'dungeon_ruins',
        seed,
        Math.min(0.85, aoStrength),
        normalStrength
      )
    : null;

  const floorGeos: THREE.BufferGeometry[] = [];
  const wallGeos: THREE.BufferGeometry[] = [];
  const decorTaggedParts: TaggedGeometryPart[] = [];
  const torchPlacements: InstancePlacement[] = [];
  const treePlacements: InstancePlacement[] = [];

  const pushMappedTile = (
    geo: THREE.BufferGeometry,
    slotId: string,
    list: THREE.BufferGeometry[]
  ) => {
    if (sheet) {
      const mapped = mapGeometryToSheetSlot(geo, sheet.slots[slotId] ?? sheet.slots.floor_a);
      if (mapped !== geo) geo.dispose();
      list.push(mapped);
    } else {
      list.push(geo);
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!walkableGrid[r][c]) continue;
      const wp = cellToWorld(c, r);

      const roll = rng();
      const flatCol =
        roll < 0.25
          ? RUINS_PAL.mossStone
          : roll < 0.78
          ? RUINS_PAL.stoneSlate
          : RUINS_PAL.stoneLight;

      const slab = makeBeveledBox(
        NWL_TILE_M - 0.04,
        0.24,
        NWL_TILE_M - 0.04,
        isTextured ? 0.024 : 0,
        isTextured ? '#ffffff' : flatCol,
        { offset: [wp.x, -0.12, wp.z] }
      );
      const tileSlot =
        roll < 0.22
          ? 'floor_moss'
          : roll < 0.29
          ? 'floor_rune'
          : roll < 0.65
          ? 'floor_a'
          : 'floor_b';
      pushMappedTile(slab, tileSlot, floorGeos);

      // Void island drop-off below floor (cheap un-chamfered box to keep tri count lean)
      const skirt = prepareColoredPart(
        new THREE.BoxGeometry(NWL_TILE_M, 0.9, NWL_TILE_M),
        isTextured ? '#b8b0c4' : RUINS_PAL.stoneDark
      );
      skirt.translate(wp.x, -0.7, wp.z);
      pushMappedTile(skirt, 'wall_stone', floorGeos);

      // Perimeter Ruined Walls on North / West / East borders
      const hasN = r + 1 < rows && walkableGrid[r + 1][c];
      const hasS = r - 1 >= 0 && walkableGrid[r - 1][c];
      const hasW = c - 1 >= 0 && walkableGrid[r][c - 1];
      const hasE = c + 1 < cols && walkableGrid[r][c + 1];

      if (!hasN) {
        const isBroken = rng() > 0.68;
        const h = isBroken ? 1.55 : NWL_WALL_H;
        const w = makeBeveledBox(
          NWL_TILE_M,
          h,
          0.3,
          isTextured ? 0.025 : 0,
          isTextured ? '#ffffff' : isBroken ? RUINS_PAL.mossStone : RUINS_PAL.stoneLight,
          { offset: [wp.x, h * 0.5, wp.z - NWL_TILE_M * 0.5] }
        );
        pushMappedTile(w, isBroken ? 'wall_moss' : 'wall_stone', wallGeos);

        if (rng() > 0.8) {
          torchPlacements.push({
            position: [wp.x, 1.85, wp.z - NWL_TILE_M * 0.35],
          });
        }
      }
      if (!hasW) {
        const h = rng() > 0.65 ? 1.6 : NWL_WALL_H;
        const w = makeBeveledBox(
          0.3,
          h,
          NWL_TILE_M,
          isTextured ? 0.025 : 0,
          isTextured ? '#ffffff' : RUINS_PAL.stoneSlate,
          { offset: [wp.x - NWL_TILE_M * 0.5, h * 0.5, wp.z] }
        );
        pushMappedTile(w, 'wall_stone', wallGeos);
      }
      if (!hasE) {
        const h = rng() > 0.6 ? 1.25 : 2.1; // Lower East wall for Iso 45° visibility
        const w = makeBeveledBox(
          0.28,
          h,
          NWL_TILE_M,
          isTextured ? 0.025 : 0,
          isTextured ? '#ffffff' : RUINS_PAL.mossStone,
          { offset: [wp.x + NWL_TILE_M * 0.5, h * 0.5, wp.z] }
        );
        pushMappedTile(w, 'wall_moss', wallGeos);
      }
      if (!hasS) {
        const curb = makeBeveledBox(
          NWL_TILE_M,
          0.55,
          0.24,
          isTextured ? 0.02 : 0,
          isTextured ? '#ffffff' : RUINS_PAL.mossStone,
          { offset: [wp.x, 0.275, wp.z + NWL_TILE_M * 0.5] }
        );
        pushMappedTile(curb, 'wall_moss', wallGeos);
      }

      // Outer Ruins Foliage / Twisted Trees on random borders (collected for InstancedMesh batching)
      if ((!hasN || !hasW) && rng() > 0.9) {
        const tx = wp.x + (!hasW ? -0.95 : 0);
        const tz = wp.z + (!hasN ? -0.95 : 0);
        treePlacements.push({
          position: [tx, 0, tz],
          rotationY: ((c * 1.7 + r * 2.3) % (Math.PI * 2)),
          scale: 0.9 + ((c + r) % 3) * 0.08,
        });
      }
    }
  }

  // Build InstancedMesh batches for repeated dungeon wall torches & twisted ruin trees
  if (torchPlacements.length > 0) {
    const torchProtoParts: TaggedGeometryPart[] = [
      tagPart(
        makeBeveledBox(0.18, 0.35, 0.22, 0.018, RUINS_PAL.stoneDark),
        'ruins_torch_sconce',
        'forged_steel',
        RUINS_PAL.stoneDark,
        { lockVertical: true }
      ),
      tagPart(
        makeBeveledBox(0.2, 0.24, 0.2, 0.04, RUINS_PAL.ember, { offset: [0, 0.3, 0.05] }),
        'ruins_torch_flame',
        'runic_glow',
        RUINS_PAL.ember,
        { lockVertical: false }
      ),
    ];
    const torchBaked = bakeTaggedPartsAsset(torchProtoParts, {
      finishMode,
      texelsPerMeter: 32,
      maxAtlasSize: 512,
      seed: seed + 19,
      aoRays: 4,
      aoStrength,
      normalStrength,
      emissiveRuneHex: RUINS_PAL.ember,
      usePool: true,
      cacheKey: 'nwl_ruins:torch_proto',
      inspectUvs: false,
    });
    for (const p of torchProtoParts) p.geometry.dispose();
    const torchMat = createPixelizerMaterialFromBaked(
      torchBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: 55,
        outlineColor: '#14101c',
        outlineAlpha: 1,
        edgeHighlight: 0.36,
        edgeBevelWeight: 0.68,
        useColorGrading: true,
      },
      sharedResources
    );
    materials.push(torchMat);
    root.add(
      buildInstancedPropBatch({
        name: 'Ruins_Torches_Instanced',
        geometry: torchBaked.geometry,
        material: torchMat,
        placements: torchPlacements,
        pixelSize: px,
        gridReference: root,
        castShadow: false,
        receiveShadow: true,
      })
    );
  }

  if (treePlacements.length > 0) {
    const ruinsTreeParts = buildStylizedTreeTrunkAndCoreParts({
      seed: seed + 23,
      scale: 0.96,
      barkHex: '#5a3921',
      foliageDarkHex: RUINS_PAL.floraGreen,
      foliageSunHex: '#47f379',
      tagPrefix: 'ruins_tree',
      includeVoxelTiers: finishMode === 'classic_flat',
      sdfSteps: 10,
    });
    const treeBaked = bakeTaggedPartsAsset(ruinsTreeParts.taggedParts, {
      finishMode,
      texelsPerMeter: 32,
      maxAtlasSize: 512,
      seed: seed + 23,
      aoRays: 4,
      aoStrength,
      normalStrength,
      usePool: true,
      cacheKey: `nwl_ruins:tree_proto:${seed}`,
      inspectUvs: false,
    });
    for (const p of ruinsTreeParts.taggedParts) p.geometry.dispose();
    const treeMat = createPixelizerMaterialFromBaked(
      treeBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: 59,
        outlineColor: '#14101c',
        outlineAlpha: 1,
        edgeHighlight: 0.34,
        edgeBevelWeight: 0.65,
        useColorGrading: true,
      },
      sharedResources
    );
    materials.push(treeMat);
    root.add(
      buildInstancedPropBatch({
        name: 'Ruins_Trees_Instanced',
        geometry: treeBaked.geometry,
        material: treeMat,
        placements: treePlacements,
        pixelSize: px,
        gridReference: root,
        castShadow: true,
        receiveShadow: true,
      })
    );

    if (finishMode !== 'classic_flat' && ruinsTreeParts.leafCards.length > 0) {
      const leafLayer = buildJabamiLeafCardsGeometryAndMaterial(
        {
          cards: ruinsTreeParts.leafCards,
          seed: seed + 29,
          sunlitHex: '#47f379',
          shadedHex: RUINS_PAL.floraGreen,
          referenceMetrics: treeBaked.unwrapMetrics,
          pixelated: true,
          pixelSize: px,
          objectId: 59,
          alphaClipThreshold: 0.5,
          usePool: true,
          cacheKey: `nwl_ruins:tree_leaf_cards:${seed}`,
        },
        sharedResources
      );
      materials.push(leafLayer.material);
      const leafInstanced = buildInstancedPropBatch({
        name: 'Ruins_Tree_LeafCards_Instanced',
        geometry: leafLayer.geometry,
        material: leafLayer.material,
        placements: treePlacements,
        pixelSize: px,
        gridReference: root,
        castShadow: true,
        receiveShadow: true,
      });
      leafInstanced.customDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: leafLayer.albedoMap,
        alphaTest: 0.5,
        side: THREE.DoubleSide,
      });
      root.add(leafInstanced);
    }
  }

  const floorGeo = mergeColoredParts(floorGeos);
  for (const g of floorGeos) g.dispose();

  const wallGeo = mergeColoredParts(wallGeos);
  for (const g of wallGeos) g.dispose();

  if (sheet) {
    computeGeometryTangents(floorGeo);
    computeGeometryTangents(wallGeo);
    if (aoStrength > 0.05) {
      bakeVertexAoAndCreases(floorGeo, { rays: 4, maxDist: 0.55, strength: aoStrength * 0.45 });
      bakeVertexAoAndCreases(wallGeo, { rays: 4, maxDist: 0.65, strength: aoStrength });
    }
  }

  const hasSheetEmission = Boolean(sheet?.textures.hasEmission && sheet.textures.emissionMap);
  const floorMat = sheet
    ? new PixelizerMaterial(
        {
          pixelated: false,
          pixelSize: 1,
          objectId: 0,
          outlineAlpha: 0,
          baseColor: '#ffffff',
          albedoMap: sheet.textures.albedoMap,
          normalMap: sheet.textures.normalMap,
          normalScale: 0.72,
          useVertexTangents: true,
          emissionMap: hasSheetEmission ? sheet.textures.emissionMap : null,
          emissionColor: hasSheetEmission ? '#ffffff' : '#000000',
          emissionIntensity: hasSheetEmission ? 0.85 : 0,
          edgeHighlight: 0.08,
          edgeBevelWeight: 0,
          smoothness: 0.18,
          useColorGrading: false,
        },
        sharedResources
      )
    : makeTileMat(sharedResources, false, 0, 1);
  floorMat.vertexColors = true;

  const wallMat = sheet
    ? new PixelizerMaterial(
        {
          pixelated: true,
          pixelSize: px,
          objectId: 54,
          outlineColor: '#14101c',
          outlineAlpha: 1,
          baseColor: '#ffffff',
          albedoMap: sheet.textures.albedoMap,
          normalMap: sheet.textures.normalMap,
          normalScale: 0.85,
          useVertexTangents: true,
          edgeHighlight: 0.36,
          edgeBevelWeight: 0.7,
          smoothness: 0.2,
          useColorGrading: true,
        },
        sharedResources
      )
    : makeTileMat(sharedResources, true, 54, px);
  wallMat.vertexColors = true;

  materials.push(floorMat, wallMat);

  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.name = 'Ruins_Floor_Grid';
  floorMesh.receiveShadow = true;
  attachSnap(floorMesh, 1, root);
  root.add(floorMesh);

  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  wallMesh.name = 'Ruins_Walls_Grid';
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  attachSnap(wallMesh, px, root);
  root.add(wallMesh);

  // Interactive Landmarks: Return Portal (Entrance), Treasure Chest & Altar (Treasure Room), Exit Stairs (North Boss Room)
  const returnPortalPos = cellToWorld(9, 1.6);
  const playerSpawnPos = cellToWorld(9, 2.8);
  const chestPos = cellToWorld(2.2, 13.5);
  const altarPos = cellToWorld(2.8, 11.8);
  const exitStairsPos = cellToWorld(9, 24.5);

  const landmarkParts: TaggedGeometryPart[] = [...decorTaggedParts];
  for (const [pIdx, sx] of [-0.95, 0.95].entries()) {
    const p = makeBeveledBox(0.45, 2.6, 0.45, 0.035, RUINS_PAL.purple, {
      offset: [returnPortalPos.x + sx, 1.3, returnPortalPos.z],
    });
    landmarkParts.push(
      tagPart(p, `portal_pillar_${pIdx}`, 'stone_masonry', RUINS_PAL.purple, { lockVertical: true })
    );
  }
  const archTop = makeBeveledBox(2.5, 0.5, 0.5, 0.04, RUINS_PAL.stoneLight, {
    offset: [returnPortalPos.x, 2.75, returnPortalPos.z],
  });
  landmarkParts.push(
    tagPart(archTop, 'portal_lintel', 'stone_masonry', RUINS_PAL.stoneLight, { lockVertical: true })
  );

  // Treasure Chest
  const chestBox = makeBeveledBox(0.95, 0.62, 0.62, 0.03, RUINS_PAL.wood, {
    offset: [chestPos.x, 0.31, chestPos.z],
  });
  const chestGold = makeBeveledBox(1.0, 0.16, 0.66, 0.018, RUINS_PAL.goldBright, {
    offset: [chestPos.x, 0.46, chestPos.z],
  });
  landmarkParts.push(
    tagPart(chestBox, 'ruins_chest_box', 'wood_planks', RUINS_PAL.wood, { lockVertical: true }),
    tagPart(chestGold, 'ruins_chest_trim', 'brushed_gold', RUINS_PAL.goldBright, {
      landmarkKind: 'chest_crest',
      lockVertical: true,
    })
  );

  // Sacred/Pact Altar
  const altBase = makeBeveledBox(1.15, 0.85, 0.85, 0.04, RUINS_PAL.purple, {
    offset: [altarPos.x, 0.425, altarPos.z],
  });
  const altOrb = makeBeveledBox(0.36, 0.4, 0.36, 0.09, RUINS_PAL.portalBlue, {
    offset: [altarPos.x, 1.25, altarPos.z],
  });
  landmarkParts.push(
    tagPart(altBase, 'altar_base', 'stone_masonry', RUINS_PAL.purple, { lockVertical: true }),
    tagPart(altOrb, 'altar_orb', 'runic_glow', RUINS_PAL.portalBlue, { lockVertical: false })
  );

  // Descent Stairs
  for (let s = 0; s < 4; s++) {
    const st = makeBeveledBox(1.8, 0.24, 0.42, 0.022, RUINS_PAL.stoneLight, {
      offset: [exitStairsPos.x, 0.85 - s * 0.22, exitStairsPos.z - 0.5 + s * 0.35],
    });
    landmarkParts.push(
      tagPart(st, `exit_stair_${s}`, 'stone_masonry', RUINS_PAL.stoneLight, { lockVertical: true })
    );
  }

  const landmarkBaked = bakeTaggedPartsAsset(landmarkParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 31,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emblemHex: RUINS_PAL.goldBright,
    emissiveRuneHex: RUINS_PAL.ember,
    usePool: true,
    cacheKey: `nwl_ruins_landmarks:${seed}`,
    inspectUvs: false,
  });
  for (const p of landmarkParts) p.geometry.dispose();

  const landmarkMat = createPixelizerMaterialFromBaked(
    landmarkBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 56,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.38,
      edgeBevelWeight: 0.72,
      smoothness: 0.2,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(landmarkMat);
  const landmarkMesh = new THREE.Mesh(landmarkBaked.geometry, landmarkMat);
  landmarkMesh.name = 'Ruins_Landmarks';
  landmarkMesh.castShadow = true;
  landmarkMesh.receiveShadow = true;
  attachSnap(landmarkMesh, px, root);
  root.add(landmarkMesh);

  const portalParts = [
    tagPart(
      makeBeveledBox(0.85, 1.35, 0.25, 0.06, RUINS_PAL.portalBlue),
      'return_portal_core',
      'runic_glow',
      RUINS_PAL.portalBlue,
      { lockVertical: false }
    ),
  ];
  const portalBaked = bakeTaggedPartsAsset(portalParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 43,
    aoRays: 4,
    aoStrength: aoStrength * 0.3,
    normalStrength,
    emissiveRuneHex: RUINS_PAL.portalBlue,
    usePool: true,
    cacheKey: 'nwl_ruins_portal_core',
  });
  for (const p of portalParts) p.geometry.dispose();

  const portalCoreMat = createPixelizerMaterialFromBaked(
    portalBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 57,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      emissionColor: '#ffffff',
      emissionIntensity: 1.35,
      edgeHighlight: 0.3,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(portalCoreMat);
  const returnPortalCore = new THREE.Mesh(portalBaked.geometry, portalCoreMat);
  returnPortalCore.name = 'Ruins_ReturnPortal_Core';
  returnPortalCore.position.set(returnPortalPos.x, 1.4, returnPortalPos.z);
  attachSnap(returnPortalCore, px, root);
  root.add(returnPortalCore);

  // Traps in Corridor 2
  const traps: DungeonTrapZone[] = [];
  const trapParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(1.18, 0.1, 1.18, 0.015, RUINS_PAL.stoneDark, { offset: [0, 0.05, 0] }),
      'trap_base',
      'stone_masonry',
      RUINS_PAL.stoneDark,
      { lockVertical: false }
    ),
  ];
  let spId = 0;
  for (const sx of [-0.35, 0.35]) {
    for (const sz of [-0.35, 0.35]) {
      const sp = prepareColoredPart(new THREE.ConeGeometry(0.11, 0.58, 5), RUINS_PAL.crimson);
      sp.translate(sx, 0.29, sz);
      trapParts.push(
        tagPart(sp, `trap_spike_${spId++}`, 'forged_steel', RUINS_PAL.crimson, {
          lockVertical: true,
        })
      );
    }
  }
  const trapBaked = bakeTaggedPartsAsset(trapParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 51,
    aoRays: 4,
    aoStrength,
    normalStrength,
    usePool: true,
    cacheKey: 'nwl_ruins_spikes',
  });
  for (const p of trapParts) p.geometry.dispose();

  const trapMat = createPixelizerMaterialFromBaked(
    trapBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 58,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      workflow: 'metallic',
      metallic: 0.3,
      smoothness: 0.35,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(trapMat);

  for (const rTrap of [12, 13]) {
    const wp = cellToWorld(9, rTrap);
    const spikesMesh = new THREE.Mesh(trapBaked.geometry, trapMat);
    spikesMesh.name = `Ruins_SpikeTrap_${rTrap}`;
    spikesMesh.position.set(wp.x, 0, wp.z);
    attachSnap(spikesMesh, px, root);
    root.add(spikesMesh);
    traps.push({ worldPos: wp, radius: 0.72, active: false, spikesMesh });
  }

  // Destructibles (Barrels, Crates, Vases — Intact & Shattered state with procedural lathe/bevels!)
  const destructibles: DungeonDestructibleProp[] = [];
  const destCells: { c: number; r: number; kind: 'barrel' | 'crate' | 'vase' }[] = [
    { c: 6, r: 8, kind: 'barrel' },
    { c: 12, r: 10, kind: 'crate' },
    { c: 7, r: 15, kind: 'vase' },
    { c: 12, r: 17, kind: 'barrel' },
    { c: 6, r: 21, kind: 'crate' },
  ];

  const makeDestructibleParts = (kind: 'barrel' | 'crate' | 'vase'): TaggedGeometryPart[] => {
    if (kind === 'barrel') {
      return [
        tagPart(
          makeLatheProfile(
            [
              [0.26, 0],
              [0.33, 0.38],
              [0.26, 0.76],
            ],
            9,
            RUINS_PAL.wood,
            { staveGrooveAmplitude: 0.045 }
          ),
          'dest_barrel_body',
          'wood_planks',
          RUINS_PAL.wood,
          { lockVertical: true }
        ),
        tagPart(
          makeLatheProfile(
            [
              [0.32, 0.16],
              [0.34, 0.2],
              [0.32, 0.24],
            ],
            9,
            RUINS_PAL.stoneDark
          ),
          'dest_barrel_hoop',
          'forged_steel',
          RUINS_PAL.stoneDark,
          { lockVertical: true }
        ),
      ];
    }
    if (kind === 'crate') {
      return [
        tagPart(
          makeBeveledBox(0.66, 0.66, 0.66, 0.028, RUINS_PAL.gold, { offset: [0, 0.33, 0] }),
          'dest_crate_body',
          'wood_planks',
          RUINS_PAL.gold,
          { lockVertical: true }
        ),
        tagPart(
          makeBeveledBox(0.7, 0.12, 0.7, 0.016, RUINS_PAL.wood, { offset: [0, 0.6, 0] }),
          'dest_crate_rim',
          'timber_frame',
          RUINS_PAL.wood,
          { lockVertical: true }
        ),
      ];
    }
    return [
      tagPart(
        makeLatheProfile(
          [
            [0.18, 0],
            [0.28, 0.24],
            [0.24, 0.5],
            [0.14, 0.62],
            [0.2, 0.72],
          ],
          9,
          RUINS_PAL.stoneLight
        ),
        'dest_vase_body',
        'stone_masonry',
        RUINS_PAL.stoneLight,
        { lockVertical: true }
      ),
    ];
  };

  destCells.forEach((dc, idx) => {
    const wp = cellToWorld(dc.c, dc.r);
    const intactParts = makeDestructibleParts(dc.kind);
    const intactBaked = bakeTaggedPartsAsset(intactParts, {
      finishMode,
      texelsPerMeter: 32,
      maxAtlasSize: 512,
      seed: seed + 70,
      aoRays: 4,
      aoStrength,
      normalStrength,
      usePool: true,
      cacheKey: `nwl_ruins_dest:${dc.kind}`,
      inspectUvs: false,
    });
    for (const p of intactParts) p.geometry.dispose();

    const brokenParts: TaggedGeometryPart[] = [];
    for (let k = 0; k < 4; k++) {
      const sh = makeBeveledBox(
        0.3,
        0.1,
        0.16,
        0.014,
        dc.kind === 'vase' ? RUINS_PAL.stoneLight : RUINS_PAL.wood
      );
      sh.rotateY(k * 0.9);
      sh.translate((k - 1.5) * 0.22, 0.06, ((k % 2) - 0.5) * 0.24);
      brokenParts.push(
        tagPart(
          sh,
          `dest_shard_${k}`,
          dc.kind === 'vase' ? 'stone_masonry' : 'wood_planks',
          dc.kind === 'vase' ? RUINS_PAL.stoneLight : RUINS_PAL.wood,
          { lockVertical: false }
        )
      );
    }
    const brokenBaked = bakeTaggedPartsAsset(brokenParts, {
      finishMode,
      texelsPerMeter: 32,
      maxAtlasSize: 512,
      seed: seed + 90,
      aoRays: 4,
      aoStrength: aoStrength * 0.6,
      normalStrength,
      usePool: true,
      cacheKey: `nwl_ruins_broken:${dc.kind}`,
      inspectUvs: false,
    });
    for (const p of brokenParts) p.geometry.dispose();

    const dMat = createPixelizerMaterialFromBaked(
      intactBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: 60 + idx,
        outlineColor: '#14101c',
        outlineAlpha: 1,
        edgeHighlight: 0.38,
        useColorGrading: true,
      },
      sharedResources
    );
    const bMat = createPixelizerMaterialFromBaked(
      brokenBaked,
      {
        pixelated: true,
        pixelSize: px,
        objectId: 60 + idx,
        outlineColor: '#14101c',
        outlineAlpha: 1,
        useColorGrading: true,
      },
      sharedResources
    );
    materials.push(dMat, bMat);

    const intactMesh = new THREE.Mesh(intactBaked.geometry, dMat);
    intactMesh.name = `Destructible_${dc.kind}_${idx}`;
    intactMesh.position.copy(wp);
    intactMesh.castShadow = true;
    attachSnap(intactMesh, px, root);

    const brokenMesh = new THREE.Mesh(brokenBaked.geometry, bMat);
    brokenMesh.name = `Destructible_${dc.kind}_Broken_${idx}`;
    brokenMesh.position.copy(wp);
    brokenMesh.visible = false;
    attachSnap(brokenMesh, px, root);

    root.add(intactMesh, brokenMesh);

    const prop: DungeonDestructibleProp = {
      kind: dc.kind,
      worldPos: wp,
      intactMesh,
      brokenMesh,
      broken: false,
      shatter: () => {
        prop.broken = true;
        intactMesh.visible = false;
        brokenMesh.visible = true;
      },
    };
    destructibles.push(prop);
  });

  // 6. Randomized Enemy Spawns (all 5 regular enemy types + Boss Demônio in Arena!)
  const enemySpawns: DungeonEnemySpawn[] = [];
  const enemySpots: { id: NwlMonsterId; roomId: string; c: number; r: number }[] = [
    { id: 'orcs.goblin_01', roomId: 'room_combat_1', c: 7 + shiftA, r: 9 },
    { id: 'orcs.goblin_03', roomId: 'room_combat_1', c: 11 + shiftA, r: 9 },
    { id: 'orcs.goblin_06', roomId: 'room_combat_2', c: 8, r: 16 },
    { id: 'orcs.goblin_02', roomId: 'room_combat_2', c: 11, r: 16 },
    { id: 'orcs.orc_04', roomId: 'room_combat_2', c: 9, r: 17 },
    { id: 'demons.boss_demon', roomId: 'room_boss', c: 9, r: 22 },
  ];

  enemySpots.forEach((es, idx) => {
    const wp = cellToWorld(es.c, es.r);
    const monster = buildNwlMonster(
      es.id,
      {
        pixelSize: px,
        objectId: 110 + idx,
        finishMode,
        seed: seed + idx * 17,
        aoStrength,
        normalStrength,
      },
      sharedResources
    );
    monster.root.position.copy(wp);
    root.add(monster.root);
    materials.push(...monster.materials);
    enemySpawns.push({
      id: es.id,
      roomId: es.roomId,
      worldPos: wp,
      monster,
    });
  });

  root.userData.unwrapMetrics = landmarkBaked.unwrapMetrics;

  // Wave 3: Dynamic short-range PointLights (Return Portal, Sacred Altar, Boss Arena)
  const portalLight = new THREE.PointLight(RUINS_PAL.portalBlue, 2.6, 8.0, 1.8);
  portalLight.name = 'Ruins_ReturnPortal_Light';
  portalLight.position.set(returnPortalPos.x, 2.0, returnPortalPos.z);
  root.add(portalLight);

  const altarLight = new THREE.PointLight(RUINS_PAL.portalBlue, 2.0, 6.5, 1.8);
  altarLight.name = 'Ruins_Altar_Light';
  altarLight.position.set(altarPos.x, 1.85, altarPos.z);
  root.add(altarLight);

  const bossArenaPos = cellToWorld(9, 22);
  const bossLight = new THREE.PointLight(RUINS_PAL.ember, 3.0, 10.5, 1.6);
  bossLight.name = 'Ruins_BossArena_Light';
  bossLight.position.set(bossArenaPos.x, 2.8, bossArenaPos.z);
  root.add(bossLight);

  const isWalkableWorld = (wx: number, wz: number): boolean => {
    const fc = Math.round(wx / NWL_TILE_M + (cols - 1) * 0.5);
    const fr = Math.round((rows - 1) * 0.5 - wz / NWL_TILE_M);
    if (fr < 0 || fr >= rows || fc < 0 || fc >= cols) return false;
    return walkableGrid[fr][fc];
  };

  const update = (time: number) => {
    returnPortalCore.rotation.y = time * 1.6;
    portalLight.intensity = 2.4 + Math.sin(time * 3.5) * 0.35;
    bossLight.intensity = 2.8 + Math.sin(time * 2.4) * 0.4;
    const trapPhase = Math.sin(time * 2.2);
    const active = trapPhase > 0.25;
    for (const tr of traps) {
      tr.active = active;
      tr.spikesMesh.position.y = active ? 0 : -0.45;
    }
  };

  return {
    name: root.name,
    seed,
    tileSizeM: NWL_TILE_M,
    cols,
    rows,
    walkableGrid,
    rooms,
    root,
    playerSpawnPos,
    returnPortalPos,
    exitStairsPos,
    chestPos,
    altarPos,
    enemySpawns,
    destructibles,
    traps,
    materials,
    isWalkableWorld,
    cellToWorld,
    update,
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.InstancedMesh) obj.dispose();
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.customDepthMaterial) obj.customDepthMaterial.dispose();
        }
      });
      disposeMaterialsAndOwnedTextures(materials);
    },
  };
}

export type DungeonBiomeId =
  | 'classic_ruins'
  | 'gothic_crypt'
  | 'magma_cavern'
  | 'frost_temple'
  | 'shadow_forest';

export interface DungeonBiomeTheme {
  id: DungeonBiomeId;
  labelPt: string;
  tintHex: string;
  accentHex: string;
  lightHex: string;
}

export const DUNGEON_BIOME_THEMES: Record<DungeonBiomeId, DungeonBiomeTheme> = {
  classic_ruins: {
    id: 'classic_ruins',
    labelPt: 'Ruínas Clássicas',
    tintHex: '#ffffff',
    accentHex: '#249fde',
    lightHex: '#fa6a0a',
  },
  gothic_crypt: {
    id: 'gothic_crypt',
    labelPt: 'Cripta Gótica',
    tintHex: '#8b8fa8',
    accentHex: '#a855f7',
    lightHex: '#c084fc',
  },
  magma_cavern: {
    id: 'magma_cavern',
    labelPt: 'Caverna Vulcânica',
    tintHex: '#7f4f44',
    accentHex: '#f97316',
    lightHex: '#fb923c',
  },
  frost_temple: {
    id: 'frost_temple',
    labelPt: 'Templo Congelado',
    tintHex: '#93c5fd',
    accentHex: '#38bdf8',
    lightHex: '#7dd3fc',
  },
  shadow_forest: {
    id: 'shadow_forest',
    labelPt: 'Floresta Sombria',
    tintHex: '#4d7c5d',
    accentHex: '#22c55e',
    lightHex: '#4ade80',
  },
};

export function buildDungeonByBiome(
  biomeId: DungeonBiomeId,
  seed = 101,
  options: NwlTilesetBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedGreenRuinsFloor1 {
  const result = buildGreenRuinsFloor1(seed, sharedResources, options);
  const theme = DUNGEON_BIOME_THEMES[biomeId] ?? DUNGEON_BIOME_THEMES.classic_ruins;
  result.root.name = `NWL_Dungeon_${biomeId}`;

  if (biomeId !== 'classic_ruins') {
    const tint = new THREE.Color(theme.tintHex);
    for (const mat of result.materials) {
      if (mat.options.emissionIntensity && mat.options.emissionIntensity > 0.2) {
        mat.updateOptions({ emissionColor: theme.accentHex });
      } else if (mat.options.baseColor) {
        const cur = new THREE.Color(mat.options.baseColor);
        cur.multiply(tint);
        mat.updateOptions({ baseColor: `#${cur.getHexString()}` });
      }
    }
    result.root.traverse((obj: THREE.Object3D) => {
      if (obj instanceof THREE.PointLight) {
        obj.color.set(theme.lightHex);
      }
    });
  }

  return result;
}

export type ArchitecturalStructureId =
  | 'watchtower'
  | 'gatehouse'
  | 'stone_bridge'
  | 'tavern_2story';

export interface NwlArchitecturalStructureResult {
  id: ArchitecturalStructureId;
  name: string;
  root: THREE.Group;
  materials: PixelizerMaterial[];
  dispose: () => void;
}

export function buildArchitecturalStructure(
  id: ArchitecturalStructureId,
  options: NwlTilesetBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): NwlArchitecturalStructureResult {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 707);
  const parts: TaggedGeometryPart[] = [];

  if (id === 'watchtower') {
    const plinth = makeBeveledBox(3.4, 0.9, 3.4, 0.06, '#475569', { offset: [0, 0.45, 0] });
    const shaft = makeBeveledBox(2.7, 4.4, 2.7, 0.06, '#64748b', { offset: [0, 3.1, 0] });
    const deck = makeBeveledBox(3.3, 0.35, 3.3, 0.05, '#7c5338', { offset: [0, 5.45, 0] });
    const roof = prepareColoredPart(new THREE.ConeGeometry(2.45, 2.1, 4), '#7f1d1d');
    roof.rotateY(Math.PI * 0.25);
    roof.translate(0, 6.65, 0);
    const door = makeBeveledBox(0.95, 1.55, 0.2, 0.02, '#4f3428', { offset: [0, 1.25, 1.35] });
    parts.push(
      tagPart(plinth, 'tower_plinth', 'stone_masonry', '#475569'),
      tagPart(shaft, 'tower_shaft', 'stone_masonry', '#64748b'),
      tagPart(deck, 'tower_deck', 'wood_planks', '#7c5338'),
      tagPart(roof, 'tower_roof', 'woven_cloth', '#7f1d1d'),
      tagPart(door, 'tower_door', 'wood_planks', '#4f3428')
    );
    for (const [bIdx, [bx, bz]] of [
      [-1.35, -1.35],
      [1.35, -1.35],
      [-1.35, 1.35],
      [1.35, 1.35],
    ].entries()) {
      parts.push(
        tagPart(
          makeBeveledBox(0.45, 0.65, 0.45, 0.03, '#475569', { offset: [bx, 5.95, bz] }),
          `tower_merlon_${bIdx}`,
          'stone_masonry',
          '#475569'
        )
      );
    }
  } else if (id === 'gatehouse') {
    const towerL = makeBeveledBox(1.8, 4.6, 2.2, 0.05, '#64748b', { offset: [-1.9, 2.3, 0] });
    const towerR = makeBeveledBox(1.8, 4.6, 2.2, 0.05, '#64748b', { offset: [1.9, 2.3, 0] });
    const bridge = makeBeveledBox(2.2, 1.4, 1.8, 0.05, '#475569', { offset: [0, 3.8, 0] });
    const roofL = makeBeveledBox(2.0, 0.9, 2.4, 0.04, '#7f1d1d', { offset: [-1.9, 5.05, 0] });
    const roofR = makeBeveledBox(2.0, 0.9, 2.4, 0.04, '#7f1d1d', { offset: [1.9, 5.05, 0] });
    const gate = makeBeveledBox(1.9, 2.4, 0.16, 0.02, '#334155', { offset: [0, 1.8, 0] });
    parts.push(
      tagPart(towerL, 'gate_tower_l', 'stone_masonry', '#64748b'),
      tagPart(towerR, 'gate_tower_r', 'stone_masonry', '#64748b'),
      tagPart(bridge, 'gate_bridge', 'stone_masonry', '#475569'),
      tagPart(roofL, 'gate_roof_l', 'woven_cloth', '#7f1d1d'),
      tagPart(roofR, 'gate_roof_r', 'woven_cloth', '#7f1d1d'),
      tagPart(gate, 'gate_portcullis', 'forged_steel', '#334155')
    );
  } else if (id === 'stone_bridge') {
    const pierL = makeBeveledBox(1.4, 1.4, 2.8, 0.05, '#475569', { offset: [-2.4, 0.7, 0] });
    const pierR = makeBeveledBox(1.4, 1.4, 2.8, 0.05, '#475569', { offset: [2.4, 0.7, 0] });
    const deck = makeBeveledBox(6.2, 0.45, 2.6, 0.05, '#64748b', { offset: [0, 1.55, 0] });
    const railF = makeBeveledBox(6.2, 0.65, 0.24, 0.03, '#94a3b8', { offset: [0, 2.05, 1.15] });
    const railB = makeBeveledBox(6.2, 0.65, 0.24, 0.03, '#94a3b8', { offset: [0, 2.05, -1.15] });
    parts.push(
      tagPart(pierL, 'bridge_pier_l', 'stone_masonry', '#475569'),
      tagPart(pierR, 'bridge_pier_r', 'stone_masonry', '#475569'),
      tagPart(deck, 'bridge_deck', 'stone_masonry', '#64748b'),
      tagPart(railF, 'bridge_rail_f', 'stone_masonry', '#94a3b8'),
      tagPart(railB, 'bridge_rail_b', 'stone_masonry', '#94a3b8')
    );
  } else {
    // tavern_2story
    const floor1 = makeBeveledBox(4.8, 2.5, 4.0, 0.05, '#64748b', { offset: [0, 1.25, 0] });
    const floor2 = makeBeveledBox(5.2, 2.2, 4.4, 0.05, '#d6cbb8', { offset: [0, 3.6, 0] });
    const roofA = makeBeveledBox(5.6, 0.24, 3.2, 0.04, '#991b1b');
    roofA.rotateX(0.52);
    roofA.translate(0, 5.45, 1.1);
    const roofB = makeBeveledBox(5.6, 0.24, 3.2, 0.04, '#991b1b');
    roofB.rotateX(-0.52);
    roofB.translate(0, 5.45, -1.1);
    const chimney = makeBeveledBox(0.7, 2.4, 0.7, 0.04, '#475569', { offset: [1.8, 5.2, -0.8] });
    const door = makeBeveledBox(1.05, 1.85, 0.16, 0.02, '#4f3428', { offset: [0, 0.95, 2.0] });
    const sign = makeBeveledBox(0.85, 0.55, 0.08, 0.015, '#d4a359', { offset: [1.3, 2.5, 2.25] });
    parts.push(
      tagPart(floor1, 'tavern_f1', 'stone_masonry', '#64748b'),
      tagPart(floor2, 'tavern_f2', 'woven_cloth', '#d6cbb8'),
      tagPart(roofA, 'tavern_roof_a', 'woven_cloth', '#991b1b'),
      tagPart(roofB, 'tavern_roof_b', 'woven_cloth', '#991b1b'),
      tagPart(chimney, 'tavern_chimney', 'stone_masonry', '#475569'),
      tagPart(door, 'tavern_door', 'wood_planks', '#4f3428'),
      tagPart(sign, 'tavern_sign', 'brushed_gold', '#d4a359')
    );
  }

  const baked = bakeTaggedPartsAsset(parts, {
    finishMode,
    texelsPerMeter: 24,
    maxAtlasSize: 512,
    seed,
    aoRays: 4,
    aoMaxDist: 0.9,
    aoStrength: options.aoStrength ?? 0.3,
    normalStrength: options.normalStrength ?? 0.14,
    usePool: true,
    cacheKey: `nwl_struct:${id}:${finishMode}`,
  });
  for (const p of parts) p.geometry.dispose();

  const mat = createPixelizerMaterialFromBaked(
    baked,
    {
      pixelated: true,
      pixelSize: 2,
      objectId: 75,
      smoothness: 0.22,
    },
    sharedResources
  );
  const mesh = new THREE.Mesh(baked.geometry, mat);
  mesh.name = `Struct_${id}`;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const root = new THREE.Group();
  root.name = `NWL_Structure_${id}`;
  root.add(mesh);

  return {
    id,
    name: root.name,
    root,
    materials: [mat],
    dispose: () => {
      mesh.geometry.dispose();
      const opts = mat.options;
      for (const tex of [opts.albedoMap, opts.normalMap, opts.emissionMap]) {
        if (tex && tex.userData?.pooled !== true) tex.dispose();
      }
      mat.dispose();
    },
  };
}


