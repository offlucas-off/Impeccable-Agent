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
  createSeededRng,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';

export type NwlTilesetBiome = 'green_ruins' | 'city' | 'training_field';
export type DungeonRoomKind = 'entrance' | 'corridor' | 'combat' | 'treasure' | 'boss';

export const NWL_TILE_M = 1.5;
export const NWL_WALL_H = 3.0;

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
  sharedResources?: PixelizerMaterialResources
): GeneratedTilesetCatalog {
  const root = new THREE.Group();
  root.name = `NWL_Tileset_${biome}`;
  const materials: PixelizerMaterial[] = [];
  const px = 3;

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

  const pieceParts: THREE.BufferGeometry[] = [];
  const floorParts: THREE.BufferGeometry[] = [];
  let pieceCount = 0;

  const cellPos = (idx: number): [number, number] => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    return [(col - 2) * 2.4, (row - 1.5) * 2.4];
  };

  // Row 0 (5 Floor & Edge Variants)
  for (let i = 0; i < 5; i++) {
    const [x, z] = cellPos(pieceCount++);
    const slab = new THREE.BoxGeometry(NWL_TILE_M, 0.24, NWL_TILE_M);
    slab.translate(x, 0.12, z);
    floorParts.push(prepareColoredPart(slab, i % 2 === 0 ? palFloorA : palFloorB));
    if (i === 1) {
      // Cracked stone inset
      const crack = new THREE.BoxGeometry(0.95, 0.04, 0.14);
      crack.rotateY(0.5);
      crack.translate(x, 0.25, z);
      floorParts.push(prepareColoredPart(crack, RUINS_PAL.voidDark));
    } else if (i === 2) {
      // Moss tuft variant
      const moss = new THREE.BoxGeometry(0.65, 0.08, 0.55);
      moss.translate(x + 0.22, 0.27, z - 0.18);
      floorParts.push(prepareColoredPart(moss, RUINS_PAL.floraGreen));
    } else if (i === 4) {
      // Void edge cliff border
      const skirt = new THREE.BoxGeometry(NWL_TILE_M, 0.72, 0.28);
      skirt.translate(x, -0.24, z + 0.62);
      floorParts.push(prepareColoredPart(skirt, RUINS_PAL.stoneDark));
    }
  }

  // Row 1 (5 Wall Modules: Straight, Outer Corner, Broken Low Wall, Arch Door, Torch Niche)
  const wallKinds = ['straight', 'corner', 'broken', 'arch', 'torch_wall'] as const;
  for (const wk of wallKinds) {
    const [x, z] = cellPos(pieceCount++);
    const baseTile = new THREE.BoxGeometry(NWL_TILE_M, 0.18, NWL_TILE_M);
    baseTile.translate(x, 0.09, z);
    floorParts.push(prepareColoredPart(baseTile, palFloorA));

    if (wk === 'straight') {
      const w = new THREE.BoxGeometry(NWL_TILE_M, NWL_WALL_H, 0.34);
      w.translate(x, NWL_WALL_H * 0.5 + 0.18, z - 0.55);
      pieceParts.push(prepareColoredPart(w, palWall));
    } else if (wk === 'corner') {
      const w1 = new THREE.BoxGeometry(NWL_TILE_M, NWL_WALL_H, 0.34);
      w1.translate(x, NWL_WALL_H * 0.5 + 0.18, z - 0.55);
      const w2 = new THREE.BoxGeometry(0.34, NWL_WALL_H, NWL_TILE_M);
      w2.translate(x - 0.55, NWL_WALL_H * 0.5 + 0.18, z);
      pieceParts.push(prepareColoredPart(w1, palWall), prepareColoredPart(w2, palFloorB));
    } else if (wk === 'broken') {
      const wLow = new THREE.BoxGeometry(NWL_TILE_M, 1.35, 0.34);
      wLow.translate(x, 0.85, z - 0.55);
      const brick = new THREE.BoxGeometry(0.42, 0.35, 0.36);
      brick.translate(x - 0.38, 1.65, z - 0.55);
      pieceParts.push(prepareColoredPart(wLow, palWall), prepareColoredPart(brick, palFloorB));
    } else if (wk === 'arch') {
      for (const sx of [-0.52, 0.52]) {
        const jamb = new THREE.BoxGeometry(0.42, NWL_WALL_H, 0.36);
        jamb.translate(x + sx, NWL_WALL_H * 0.5 + 0.18, z - 0.3);
        pieceParts.push(prepareColoredPart(jamb, palWall));
      }
      const lintel = new THREE.BoxGeometry(NWL_TILE_M, 0.72, 0.42);
      lintel.translate(x, 2.82, z - 0.3);
      pieceParts.push(prepareColoredPart(lintel, RUINS_PAL.stoneDark));
    } else {
      const w = new THREE.BoxGeometry(NWL_TILE_M, NWL_WALL_H, 0.34);
      w.translate(x, NWL_WALL_H * 0.5 + 0.18, z - 0.55);
      const sconce = new THREE.BoxGeometry(0.18, 0.36, 0.24);
      sconce.translate(x, 1.85, z - 0.28);
      const flame = new THREE.OctahedronGeometry(0.16, 0);
      flame.translate(x, 2.15, z - 0.22);
      pieceParts.push(
        prepareColoredPart(w, palWall),
        prepareColoredPart(sconce, RUINS_PAL.stoneDark),
        prepareColoredPart(flame, RUINS_PAL.ember)
      );
    }
  }

  // Row 2 (5 Interactive & Nature Pieces: Tree, Boulder, Altar, Chest, Spike Trap)
  {
    // Tree
    const [x, z] = cellPos(pieceCount++);
    const trunk = new THREE.CylinderGeometry(0.18, 0.26, 1.6, 6);
    trunk.translate(x, 0.8, z);
    const canopy = new THREE.ConeGeometry(0.85, 1.5, 6);
    canopy.translate(x, 2.1, z);
    pieceParts.push(
      prepareColoredPart(trunk, RUINS_PAL.wood),
      prepareColoredPart(canopy, RUINS_PAL.floraGreen)
    );
  }
  {
    // Moss Boulder
    const [x, z] = cellPos(pieceCount++);
    const rock = new THREE.DodecahedronGeometry(0.58, 0);
    rock.translate(x, 0.48, z);
    const mossCap = new THREE.BoxGeometry(0.62, 0.18, 0.52);
    mossCap.translate(x, 0.86, z);
    pieceParts.push(
      prepareColoredPart(rock, RUINS_PAL.stoneSlate),
      prepareColoredPart(mossCap, RUINS_PAL.floraGreen)
    );
  }
  {
    // Altar
    const [x, z] = cellPos(pieceCount++);
    const plinth = new THREE.BoxGeometry(1.1, 0.85, 0.78);
    plinth.translate(x, 0.42, z);
    const gem = new THREE.OctahedronGeometry(0.24, 0);
    gem.translate(x, 1.15, z);
    pieceParts.push(
      prepareColoredPart(plinth, RUINS_PAL.purple),
      prepareColoredPart(gem, RUINS_PAL.goldBright)
    );
  }
  {
    // Treasure Chest
    const [x, z] = cellPos(pieceCount++);
    const body = new THREE.BoxGeometry(0.88, 0.55, 0.58);
    body.translate(x, 0.28, z);
    const strap = new THREE.BoxGeometry(0.92, 0.16, 0.62);
    strap.translate(x, 0.42, z);
    pieceParts.push(
      prepareColoredPart(body, RUINS_PAL.wood),
      prepareColoredPart(strap, RUINS_PAL.gold)
    );
  }
  {
    // Spike Trap (Active)
    const [x, z] = cellPos(pieceCount++);
    const plate = new THREE.BoxGeometry(1.25, 0.12, 1.25);
    plate.translate(x, 0.06, z);
    pieceParts.push(prepareColoredPart(plate, RUINS_PAL.stoneDark));
    for (const sx of [-0.36, 0.36]) {
      for (const sz of [-0.36, 0.36]) {
        const spike = new THREE.ConeGeometry(0.11, 0.58, 4);
        spike.translate(x + sx, 0.4, z + sz);
        pieceParts.push(prepareColoredPart(spike, RUINS_PAL.stoneLight));
      }
    }
  }

  // Row 3 (Destructibles Intact & Broken + Descent Stairs)
  {
    // Barrel & Crate (Intact)
    const [x, z] = cellPos(pieceCount++);
    const barrel = new THREE.CylinderGeometry(0.32, 0.30, 0.76, 8);
    barrel.translate(x - 0.32, 0.38, z);
    const crate = new THREE.BoxGeometry(0.62, 0.62, 0.62);
    crate.translate(x + 0.35, 0.31, z);
    pieceParts.push(
      prepareColoredPart(barrel, RUINS_PAL.wood),
      prepareColoredPart(crate, RUINS_PAL.gold)
    );
  }
  {
    // Broken Debris (Barrel/Crate/Vase shattered)
    const [x, z] = cellPos(pieceCount++);
    for (let k = 0; k < 4; k++) {
      const shard = new THREE.BoxGeometry(0.32, 0.10, 0.18);
      shard.rotateY(k * 0.8);
      shard.translate(x + (k - 1.5) * 0.25, 0.06, z + ((k % 2) - 0.5) * 0.3);
      pieceParts.push(prepareColoredPart(shard, k % 2 === 0 ? RUINS_PAL.wood : RUINS_PAL.stoneSlate));
    }
  }
  {
    // Exit Descent Stairs
    const [x, z] = cellPos(pieceCount++);
    for (let s = 0; s < 4; s++) {
      const step = new THREE.BoxGeometry(1.3, 0.22, 0.35);
      step.translate(x, 0.78 - s * 0.2, z - 0.45 + s * 0.3);
      pieceParts.push(prepareColoredPart(step, RUINS_PAL.stoneLight));
    }
  }

  const floorMat = makeTileMat(sharedResources, false, 0, 1);
  const pieceMat = makeTileMat(sharedResources, true, 52, px);
  materials.push(floorMat, pieceMat);

  const floorMesh = new THREE.Mesh(mergeColoredParts(floorParts), floorMat);
  floorMesh.receiveShadow = true;
  attachSnap(floorMesh, 1, root);

  const pieceMesh = new THREE.Mesh(mergeColoredParts(pieceParts), pieceMat);
  pieceMesh.castShadow = true;
  pieceMesh.receiveShadow = true;
  attachSnap(pieceMesh, px, root);

  root.add(floorMesh, pieceMesh);

  return {
    name: root.name,
    biome,
    pieceCount,
    tileSizeM: NWL_TILE_M,
    root,
    materials,
    dispose: () => {
      floorMesh.geometry.dispose();
      pieceMesh.geometry.dispose();
      for (const m of materials) m.dispose();
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
  sharedResources?: PixelizerMaterialResources
): GeneratedGreenRuinsFloor1 {
  const rng = createSeededRng(seed);
  const cols = 19;
  const rows = 27;
  const px = 3;

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

  const floorGeos: THREE.BufferGeometry[] = [];
  const wallGeos: THREE.BufferGeometry[] = [];
  const foliageGeos: THREE.BufferGeometry[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!walkableGrid[r][c]) continue;
      const wp = cellToWorld(c, r);

      // Floor Tile (4 variants + moss + cracks)
      const slab = new THREE.BoxGeometry(NWL_TILE_M - 0.04, 0.24, NWL_TILE_M - 0.04);
      slab.translate(wp.x, -0.12, wp.z);
      const roll = rng();
      const tileCol =
        roll < 0.25
          ? RUINS_PAL.mossStone
          : roll < 0.78
          ? RUINS_PAL.stoneSlate
          : RUINS_PAL.stoneLight;
      floorGeos.push(prepareColoredPart(slab, tileCol));

      // Void island drop-off below floor
      const skirt = new THREE.BoxGeometry(NWL_TILE_M, 0.9, NWL_TILE_M);
      skirt.translate(wp.x, -0.70, wp.z);
      floorGeos.push(prepareColoredPart(skirt, RUINS_PAL.stoneDark));

      if (roll < 0.14) {
        const moss = new THREE.BoxGeometry(0.55, 0.05, 0.45);
        moss.translate(wp.x + (rng() - 0.5) * 0.5, 0.02, wp.z + (rng() - 0.5) * 0.5);
        floorGeos.push(prepareColoredPart(moss, RUINS_PAL.floraGreen));
      }

      // Perimeter Ruined Walls on North / West / East borders (leaving South view semi-low so iso camera never obscures hero!)
      const hasN = r + 1 < rows && walkableGrid[r + 1][c];
      const hasS = r - 1 >= 0 && walkableGrid[r - 1][c];
      const hasW = c - 1 >= 0 && walkableGrid[r][c - 1];
      const hasE = c + 1 < cols && walkableGrid[r][c + 1];

      if (!hasN) {
        const isBroken = rng() > 0.68;
        const h = isBroken ? 1.55 : NWL_WALL_H;
        const w = new THREE.BoxGeometry(NWL_TILE_M, h, 0.30);
        w.translate(wp.x, h * 0.5, wp.z - NWL_TILE_M * 0.5);
        wallGeos.push(prepareColoredPart(w, isBroken ? RUINS_PAL.mossStone : RUINS_PAL.stoneLight));
        if (rng() > 0.80) {
          // Torch sconce
          const sconce = new THREE.BoxGeometry(0.18, 0.35, 0.22);
          sconce.translate(wp.x, 1.85, wp.z - NWL_TILE_M * 0.35);
          const flame = new THREE.OctahedronGeometry(0.16, 0);
          flame.translate(wp.x, 2.15, wp.z - NWL_TILE_M * 0.30);
          wallGeos.push(
            prepareColoredPart(sconce, RUINS_PAL.stoneDark),
            prepareColoredPart(flame, RUINS_PAL.ember)
          );
        }
      }
      if (!hasW) {
        const h = rng() > 0.65 ? 1.6 : NWL_WALL_H;
        const w = new THREE.BoxGeometry(0.30, h, NWL_TILE_M);
        w.translate(wp.x - NWL_TILE_M * 0.5, h * 0.5, wp.z);
        wallGeos.push(prepareColoredPart(w, RUINS_PAL.stoneSlate));
      }
      if (!hasE) {
        const h = rng() > 0.6 ? 1.25 : 2.1; // Lower East wall for crisp Iso 45° visibility
        const w = new THREE.BoxGeometry(0.28, h, NWL_TILE_M);
        w.translate(wp.x + NWL_TILE_M * 0.5, h * 0.5, wp.z);
        wallGeos.push(prepareColoredPart(w, RUINS_PAL.mossStone));
      }
      if (!hasS) {
        // Low 0.55m ruined curb on South edge so camera always sees the hero clearly
        const curb = new THREE.BoxGeometry(NWL_TILE_M, 0.55, 0.24);
        curb.translate(wp.x, 0.27, wp.z + NWL_TILE_M * 0.5);
        wallGeos.push(prepareColoredPart(curb, RUINS_PAL.mossStone));
      }

      // Outer Ruins Foliage / Broken Trees on random borders
      if ((!hasN || !hasW) && rng() > 0.86) {
        const tx = wp.x + (!hasW ? -0.95 : 0);
        const tz = wp.z + (!hasN ? -0.95 : 0);
        const trunk = new THREE.CylinderGeometry(0.18, 0.26, 1.8, 6);
        trunk.translate(tx, 0.9, tz);
        const crown = new THREE.ConeGeometry(0.85, 1.5, 6);
        crown.translate(tx, 2.2, tz);
        foliageGeos.push(
          prepareColoredPart(trunk, RUINS_PAL.wood),
          prepareColoredPart(crown, RUINS_PAL.floraGreen)
        );
      }
    }
  }

  const floorMat = makeTileMat(sharedResources, false, 0, 1);
  const wallMat = makeTileMat(sharedResources, true, 54, px);
  materials.push(floorMat, wallMat);

  const floorMesh = new THREE.Mesh(mergeColoredParts(floorGeos), floorMat);
  floorMesh.name = 'Ruins_Floor_Grid';
  floorMesh.receiveShadow = true;
  attachSnap(floorMesh, 1, root);
  root.add(floorMesh);

  const wallMesh = new THREE.Mesh(
    mergeColoredParts([...wallGeos, ...foliageGeos]),
    wallMat
  );
  wallMesh.name = 'Ruins_Walls_Flora';
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

  const landmarkGeos: THREE.BufferGeometry[] = [];
  // Return Portal Arch
  for (const sx of [-0.95, 0.95]) {
    const p = new THREE.BoxGeometry(0.45, 2.6, 0.45);
    p.translate(returnPortalPos.x + sx, 1.3, returnPortalPos.z);
    landmarkGeos.push(prepareColoredPart(p, RUINS_PAL.purple));
  }
  const archTop = new THREE.BoxGeometry(2.5, 0.5, 0.5);
  archTop.translate(returnPortalPos.x, 2.75, returnPortalPos.z);
  landmarkGeos.push(prepareColoredPart(archTop, RUINS_PAL.stoneLight));

  // Treasure Chest
  const chestBox = new THREE.BoxGeometry(0.95, 0.62, 0.62);
  chestBox.translate(chestPos.x, 0.31, chestPos.z);
  const chestGold = new THREE.BoxGeometry(1.0, 0.16, 0.66);
  chestGold.translate(chestPos.x, 0.46, chestPos.z);
  landmarkGeos.push(
    prepareColoredPart(chestBox, RUINS_PAL.wood),
    prepareColoredPart(chestGold, RUINS_PAL.goldBright)
  );

  // Sacred/Pact Altar
  const altBase = new THREE.BoxGeometry(1.15, 0.85, 0.85);
  altBase.translate(altarPos.x, 0.42, altarPos.z);
  const altOrb = new THREE.OctahedronGeometry(0.28, 0);
  altOrb.translate(altarPos.x, 1.25, altarPos.z);
  landmarkGeos.push(
    prepareColoredPart(altBase, RUINS_PAL.purple),
    prepareColoredPart(altOrb, RUINS_PAL.portalBlue)
  );

  // Descent Stairs
  for (let s = 0; s < 4; s++) {
    const st = new THREE.BoxGeometry(1.8, 0.24, 0.42);
    st.translate(exitStairsPos.x, 0.85 - s * 0.22, exitStairsPos.z - 0.5 + s * 0.35);
    landmarkGeos.push(prepareColoredPart(st, RUINS_PAL.stoneLight));
  }

  const landmarkMat = makeTileMat(sharedResources, true, 56, px);
  materials.push(landmarkMat);
  const landmarkMesh = new THREE.Mesh(mergeColoredParts(landmarkGeos), landmarkMat);
  landmarkMesh.name = 'Ruins_Landmarks';
  landmarkMesh.castShadow = true;
  landmarkMesh.receiveShadow = true;
  attachSnap(landmarkMesh, px, root);
  root.add(landmarkMesh);

  const portalCoreMat = makeTileMat(sharedResources, true, 57, px, RUINS_PAL.portalBlue, 1.35);
  materials.push(portalCoreMat);
  const returnPortalCore = new THREE.Mesh(
    prepareColoredPart(new THREE.OctahedronGeometry(0.7, 0), RUINS_PAL.portalBlue),
    portalCoreMat
  );
  returnPortalCore.position.set(returnPortalPos.x, 1.4, returnPortalPos.z);
  attachSnap(returnPortalCore, px, root);
  root.add(returnPortalCore);

  // Traps in Corridor 2
  const traps: DungeonTrapZone[] = [];
  for (const rTrap of [12, 13]) {
    const wp = cellToWorld(9, rTrap);
    const spGeos: THREE.BufferGeometry[] = [];
    for (const sx of [-0.35, 0.35]) {
      for (const sz of [-0.35, 0.35]) {
        const sp = new THREE.ConeGeometry(0.11, 0.58, 4);
        sp.translate(sx, 0.29, sz);
        spGeos.push(prepareColoredPart(sp, RUINS_PAL.crimson));
      }
    }
    const trapMat = makeTileMat(sharedResources, true, 58, px);
    materials.push(trapMat);
    const spikesMesh = new THREE.Mesh(mergeColoredParts(spGeos), trapMat);
    spikesMesh.position.set(wp.x, 0, wp.z);
    attachSnap(spikesMesh, px, root);
    root.add(spikesMesh);
    traps.push({ worldPos: wp, radius: 0.72, active: false, spikesMesh });
  }

  // Destructibles (Barrels, Crates, Vases — Intact & Shattered state!)
  const destructibles: DungeonDestructibleProp[] = [];
  const destCells: { c: number; r: number; kind: 'barrel' | 'crate' | 'vase' }[] = [
    { c: 6, r: 8, kind: 'barrel' },
    { c: 12, r: 10, kind: 'crate' },
    { c: 7, r: 15, kind: 'vase' },
    { c: 12, r: 17, kind: 'barrel' },
    { c: 6, r: 21, kind: 'crate' },
  ];
  destCells.forEach((dc, idx) => {
    const wp = cellToWorld(dc.c, dc.r);
    const intactGeo =
      dc.kind === 'barrel'
        ? prepareColoredPart(new THREE.CylinderGeometry(0.32, 0.30, 0.76, 8), RUINS_PAL.wood)
        : dc.kind === 'crate'
        ? prepareColoredPart(new THREE.BoxGeometry(0.66, 0.66, 0.66), RUINS_PAL.gold)
        : prepareColoredPart(new THREE.CylinderGeometry(0.20, 0.28, 0.68, 7), RUINS_PAL.stoneLight);
    intactGeo.translate(0, 0.36, 0);

    const brokenParts: THREE.BufferGeometry[] = [];
    for (let k = 0; k < 4; k++) {
      const sh = new THREE.BoxGeometry(0.30, 0.10, 0.16);
      sh.rotateY(k * 0.9);
      sh.translate((k - 1.5) * 0.22, 0.06, ((k % 2) - 0.5) * 0.24);
      brokenParts.push(
        prepareColoredPart(sh, dc.kind === 'vase' ? RUINS_PAL.stoneLight : RUINS_PAL.wood)
      );
    }

    const dMat = makeTileMat(sharedResources, true, 60 + idx, px);
    materials.push(dMat);

    const intactMesh = new THREE.Mesh(intactGeo, dMat);
    intactMesh.position.copy(wp);
    intactMesh.castShadow = true;
    attachSnap(intactMesh, px, root);

    const brokenMesh = new THREE.Mesh(mergeColoredParts(brokenParts), dMat);
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
      { pixelSize: px, objectId: 110 + idx },
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

  const isWalkableWorld = (wx: number, wz: number): boolean => {
    const fc = Math.round(wx / NWL_TILE_M + (cols - 1) * 0.5);
    const fr = Math.round((rows - 1) * 0.5 - wz / NWL_TILE_M);
    if (fr < 0 || fr >= rows || fc < 0 || fc >= cols) return false;
    return walkableGrid[fr][fc];
  };

  const update = (time: number) => {
    returnPortalCore.rotation.y = time * 1.6;
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
      for (const m of materials) m.dispose();
    },
  };
}
