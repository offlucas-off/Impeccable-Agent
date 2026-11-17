import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
import {
  buildNwlNpc,
  type GeneratedNpcResult,
  type NwlNpcId,
} from './NpcBuilder';
import { mergeColoredParts, prepareColoredPart } from './SdfVoxelPrimitives';

export type CityHouseKind =
  | 'grimorio'
  | 'forja'
  | 'mercado'
  | 'bau'
  | 'tesouro'
  | 'salao';

export interface EnterableHousePart {
  id: CityHouseKind;
  namePt: string;
  tilesW: number;
  tilesD: number;
  worldCenter: THREE.Vector3;
  worldFootprintMin: THREE.Vector2;
  worldFootprintMax: THREE.Vector2;
  doorWorldPos: THREE.Vector3;
  root: THREE.Group;
  baseGroup: THREE.Group;
  capaGroup: THREE.Group;
  portaPivot: THREE.Group;
  isOpen: boolean;
  setInteriorOpen: (open: boolean) => void;
  npcId?: NwlNpcId;
  materials: PixelizerMaterial[];
}

export interface CityNpcPlacement {
  id: NwlNpcId;
  instance: GeneratedNpcResult;
  worldPos: THREE.Vector3;
}

export interface CityColliderBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  tag: string;
}

export interface GeneratedStarterCity {
  name: string;
  tileSizeM: number;
  boundsRadiusM: number;
  root: THREE.Group;
  houses: EnterableHousePart[];
  npcs: CityNpcPlacement[];
  portalPos: THREE.Vector3;
  portalCore: THREE.Mesh;
  playerSpawnPos: THREE.Vector3;
  colliders: CityColliderBox[];
  materials: PixelizerMaterial[];
  update: (time: number, heroPos?: THREE.Vector3) => { nearHouse: EnterableHousePart | null; nearNpc: CityNpcPlacement | null; inPortal: boolean };
  dispose: () => void;
}

const CITY_COLORS = {
  stoneDark: '#3b1725',
  stoneSlate: '#6d758d',
  stoneLight: '#b3b9d1',
  pavingA: '#6d758d',
  pavingB: '#b3b9d1',
  grass: '#24523b',
  grassBright: '#1a7a3e',
  woodDark: '#3b1725',
  wood: '#73172d',
  roofRed: '#b4202a',
  roofBlue: '#285cc4',
  roofPurple: '#4a3052',
  roofGreen: '#24523b',
  gold: '#f9a31b',
  goldBright: '#ffd541',
  ember: '#fa6a0a',
  portalCore: '#249fde',
  portalEdge: '#df3e23',
};

const NWL_TILE = 1.5;

interface HouseSpec {
  id: CityHouseKind;
  namePt: string;
  tilesW: number;
  tilesD: number;
  roofColor: string;
  trimColor: string;
  wallColor: string;
  cx: number;
  cz: number;
  rotY: number;
  npcId: NwlNpcId;
}

function makeCityMat(
  res: PixelizerMaterialResources | undefined,
  objectId: number,
  pixelSize = 3,
  emissiveHex = '#000000',
  emissiveInt = 0
): PixelizerMaterial {
  const mat = new PixelizerMaterial(
    {
      pixelated: true,
      pixelSize,
      objectId,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      baseColor: '#ffffff',
      emissionColor: emissiveHex,
      emissionIntensity: emissiveInt,
      edgeHighlight: 0.34,
      edgeBevelWeight: 0.72,
      smoothness: 0.2,
      useColorGrading: true,
    },
    res
  );
  mat.vertexColors = true;
  return mat;
}

function tagPixelizer(obj: THREE.Object3D, pixelSize = 3, gridRef?: THREE.Object3D): void {
  obj.userData.pixelizer = {
    snap: {
      snapPosition: false,
      alignPixelGrid: true,
      alignmentPixelSize: pixelSize,
      angleSnapMode: 'none',
      angleResolutionDeg: 45,
    },
    gridReference: gridRef ?? obj,
  } satisfies PixelizerObjectAttachment;
}

/**
 * Builds an enterable NWL building in 3 clean parts:
 *  - `base`: floor, back/side walls, interior profession furniture
 *  - `capa`: roof & front gable walls (hidden smoothly when player steps near/inside)
 *  - `porta`: hinged door pivot
 */
export function buildEnterableNwlHouse(
  spec: HouseSpec,
  sharedResources?: PixelizerMaterialResources,
  objectId = 31
): EnterableHousePart {
  const px = 3;
  const w = spec.tilesW * NWL_TILE;
  const d = spec.tilesD * NWL_TILE;
  const wallH = 3.0; // NWL official 2 tiles height = 3.0m
  const wallT = 0.24;
  const doorW = 1.35;
  const doorH = 2.2;

  const root = new THREE.Group();
  root.name = `House_${spec.id}_${spec.tilesW}x${spec.tilesD}`;
  root.position.set(spec.cx, 0, spec.cz);
  root.rotation.y = spec.rotY;

  const baseGroup = new THREE.Group();
  baseGroup.name = `${spec.id}_base`;
  const capaGroup = new THREE.Group();
  capaGroup.name = `${spec.id}_capa`;
  const portaPivot = new THREE.Group();
  portaPivot.name = `${spec.id}_porta`;

  const materials: PixelizerMaterial[] = [];
  const matBase = makeCityMat(sharedResources, objectId, px);
  const matCapa = makeCityMat(sharedResources, objectId + 1, px);
  const matDoor = makeCityMat(sharedResources, objectId + 2, px);
  materials.push(matBase, matCapa, matDoor);

  // --- PART 1: BASE (Floor + Rear Wall + Side Walls + Interior Props) ---
  const baseParts: THREE.BufferGeometry[] = [];
  const floor = new THREE.BoxGeometry(w, 0.16, d);
  floor.translate(0, 0.08, 0);
  baseParts.push(prepareColoredPart(floor, CITY_COLORS.woodDark));

  // Interior stone rug center
  const rug = new THREE.BoxGeometry(w - 1.1, 0.04, d - 1.1);
  rug.translate(0, 0.17, 0);
  baseParts.push(prepareColoredPart(rug, spec.roofColor));

  // Back wall (-Z)
  const backWall = new THREE.BoxGeometry(w, wallH, wallT);
  backWall.translate(0, wallH * 0.5, -d * 0.5 + wallT * 0.5);
  baseParts.push(prepareColoredPart(backWall, spec.wallColor));

  // Left & Right walls (lowered slightly near front so iso camera reads interior well)
  for (const sx of [-1, 1]) {
    const sideWall = new THREE.BoxGeometry(wallT, wallH, d);
    sideWall.translate(sx * (w * 0.5 - wallT * 0.5), wallH * 0.5, 0);
    baseParts.push(prepareColoredPart(sideWall, spec.wallColor));

    const post = new THREE.BoxGeometry(wallT + 0.12, wallH + 0.1, wallT + 0.12);
    post.translate(sx * (w * 0.5 - wallT * 0.4), (wallH + 0.1) * 0.5, -d * 0.5 + wallT * 0.4);
    baseParts.push(prepareColoredPart(post, spec.trimColor));
  }

  // Interior Profession Furniture (clearly visible when capa hides!)
  if (spec.id === 'forja') {
    const anvilBase = new THREE.BoxGeometry(0.65, 0.55, 0.45);
    anvilBase.translate(-1.2, 0.44, -0.4);
    const anvilHorn = new THREE.BoxGeometry(0.85, 0.24, 0.34);
    anvilHorn.translate(-1.2, 0.80, -0.4);
    const furnace = new THREE.BoxGeometry(1.3, 1.8, 1.0);
    furnace.translate(1.2, 1.0, -d * 0.5 + 0.72);
    const emberBox = new THREE.BoxGeometry(0.7, 0.45, 0.3);
    emberBox.translate(1.2, 0.65, -d * 0.5 + 1.12);
    baseParts.push(
      prepareColoredPart(anvilBase, CITY_COLORS.woodDark),
      prepareColoredPart(anvilHorn, CITY_COLORS.stoneLight),
      prepareColoredPart(furnace, CITY_COLORS.stoneSlate),
      prepareColoredPart(emberBox, CITY_COLORS.ember)
    );
  } else if (spec.id === 'grimorio') {
    for (const bx of [-1.4, 1.4]) {
      const shelf = new THREE.BoxGeometry(1.4, 2.0, 0.45);
      shelf.translate(bx, 1.15, -d * 0.5 + 0.55);
      const books = new THREE.BoxGeometry(1.2, 1.4, 0.22);
      books.translate(bx, 1.18, -d * 0.5 + 0.70);
      baseParts.push(
        prepareColoredPart(shelf, CITY_COLORS.wood),
        prepareColoredPart(books, CITY_COLORS.portalCore)
      );
    }
    const lectern = new THREE.CylinderGeometry(0.18, 0.28, 1.05, 6);
    lectern.translate(0, 0.68, -0.5);
    const orb = new THREE.OctahedronGeometry(0.22, 0);
    orb.translate(0, 1.42, -0.5);
    baseParts.push(
      prepareColoredPart(lectern, CITY_COLORS.woodDark),
      prepareColoredPart(orb, CITY_COLORS.goldBright)
    );
  } else if (spec.id === 'mercado') {
    const counter = new THREE.BoxGeometry(w * 0.58, 0.95, 0.65);
    counter.translate(0, 0.62, -0.8);
    const crateA = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    crateA.translate(-1.5, 0.48, -1.2);
    const crateB = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    crateB.translate(1.5, 0.43, -1.2);
    baseParts.push(
      prepareColoredPart(counter, CITY_COLORS.wood),
      prepareColoredPart(crateA, CITY_COLORS.gold),
      prepareColoredPart(crateB, CITY_COLORS.roofGreen)
    );
  } else if (spec.id === 'bau') {
    const table = new THREE.BoxGeometry(1.3, 0.78, 0.8);
    table.translate(1.1, 0.55, -0.7);
    baseParts.push(prepareColoredPart(table, CITY_COLORS.wood));
  } else if (spec.id === 'tesouro') {
    const vaultPedestal = new THREE.BoxGeometry(1.6, 0.75, 0.9);
    vaultPedestal.translate(0, 0.52, -1.2);
    const goldPile = new THREE.ConeGeometry(0.55, 0.55, 6);
    goldPile.translate(-1.4, 0.44, -1.1);
    const goldPile2 = new THREE.ConeGeometry(0.45, 0.48, 6);
    goldPile2.translate(1.4, 0.40, -1.1);
    baseParts.push(
      prepareColoredPart(vaultPedestal, CITY_COLORS.stoneLight),
      prepareColoredPart(goldPile, CITY_COLORS.goldBright),
      prepareColoredPart(goldPile2, CITY_COLORS.gold)
    );
  } else if (spec.id === 'salao') {
    const warTable = new THREE.BoxGeometry(2.2, 0.82, 1.35);
    warTable.translate(0, 0.56, -0.4);
    const mapBoard = new THREE.BoxGeometry(1.8, 0.08, 1.0);
    mapBoard.translate(0, 1.00, -0.4);
    const bannerL = new THREE.BoxGeometry(0.55, 1.8, 0.08);
    bannerL.translate(-2.0, 1.6, -d * 0.5 + 0.32);
    const bannerR = new THREE.BoxGeometry(0.55, 1.8, 0.08);
    bannerR.translate(2.0, 1.6, -d * 0.5 + 0.32);
    baseParts.push(
      prepareColoredPart(warTable, CITY_COLORS.woodDark),
      prepareColoredPart(mapBoard, CITY_COLORS.grassBright),
      prepareColoredPart(bannerL, CITY_COLORS.roofRed),
      prepareColoredPart(bannerR, CITY_COLORS.roofRed)
    );
  }

  const baseMesh = new THREE.Mesh(mergeColoredParts(baseParts), matBase);
  baseMesh.name = `${spec.id}_BaseMesh`;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  tagPixelizer(baseMesh, px, root);
  baseGroup.add(baseMesh);

  // --- PART 2: CAPA (Front wall with doorway + Sloped Roof + Chimney/Signage) ---
  const capaParts: THREE.BufferGeometry[] = [];
  const sideDoorW = (w - doorW) * 0.5;
  for (const sx of [-doorW * 0.5 - sideDoorW * 0.5, doorW * 0.5 + sideDoorW * 0.5]) {
    const fw = new THREE.BoxGeometry(sideDoorW, wallH, wallT);
    fw.translate(sx, wallH * 0.5, d * 0.5 - wallT * 0.5);
    capaParts.push(prepareColoredPart(fw, spec.wallColor));
  }
  const lintelH = wallH - doorH;
  const lintel = new THREE.BoxGeometry(doorW, lintelH, wallT);
  lintel.translate(0, doorH + lintelH * 0.5, d * 0.5 - wallT * 0.5);
  capaParts.push(prepareColoredPart(lintel, spec.trimColor));

  // Stepped/pitched roof in clean geometric layers (no texture maps)
  const roofTiers = 3;
  for (let i = 0; i < roofTiers; i++) {
    const frac = i / roofTiers;
    const rw = w + 0.45 - frac * (w * 0.58);
    const rd = d + 0.45 - frac * (d * 0.42);
    const slab = new THREE.BoxGeometry(rw, 0.45, rd);
    slab.translate(0, wallH + 0.22 + i * 0.44, 0);
    capaParts.push(prepareColoredPart(slab, i === roofTiers - 1 ? spec.trimColor : spec.roofColor));
  }
  // Shop sign board above door
  const sign = new THREE.BoxGeometry(1.1, 0.42, 0.14);
  sign.translate(0, doorH + 0.35, d * 0.5 + 0.12);
  capaParts.push(prepareColoredPart(sign, CITY_COLORS.gold));

  const capaMesh = new THREE.Mesh(mergeColoredParts(capaParts), matCapa);
  capaMesh.name = `${spec.id}_CapaMesh`;
  capaMesh.castShadow = true;
  capaMesh.receiveShadow = true;
  tagPixelizer(capaMesh, px, root);
  capaGroup.add(capaMesh);

  // --- PART 3: PORTA (Hinged animated door at front center) ---
  portaPivot.position.set(-doorW * 0.5, 0.16, d * 0.5 - wallT * 0.5);
  const doorSlab = new THREE.BoxGeometry(doorW - 0.08, doorH - 0.18, 0.14);
  doorSlab.translate(doorW * 0.5 - 0.04, (doorH - 0.18) * 0.5, 0);
  const doorBand = new THREE.BoxGeometry(doorW - 0.16, 0.14, 0.18);
  doorBand.translate(doorW * 0.5 - 0.04, doorH * 0.45, 0);
  const handle = new THREE.BoxGeometry(0.12, 0.16, 0.22);
  handle.translate(doorW - 0.26, 1.0, 0);
  const doorMesh = new THREE.Mesh(
    mergeColoredParts([
      prepareColoredPart(doorSlab, CITY_COLORS.wood),
      prepareColoredPart(doorBand, CITY_COLORS.gold),
      prepareColoredPart(handle, CITY_COLORS.goldBright),
    ]),
    matDoor
  );
  doorMesh.name = `${spec.id}_PortaMesh`;
  doorMesh.castShadow = true;
  doorMesh.receiveShadow = true;
  tagPixelizer(doorMesh, px, root);
  portaPivot.add(doorMesh);

  root.add(baseGroup, capaGroup, portaPivot);

  // Door world pos & rotated footprint
  root.updateMatrixWorld(true);
  const doorLocal = new THREE.Vector3(0, 0, d * 0.5 + 0.8);
  const doorWorldPos = doorLocal.clone().applyMatrix4(root.matrixWorld);
  const cosR = Math.abs(Math.cos(spec.rotY));
  const sinR = Math.abs(Math.sin(spec.rotY));
  const halfX = (w * cosR + d * sinR) * 0.5;
  const halfZ = (w * sinR + d * cosR) * 0.5;

  const housePart: EnterableHousePart = {
    id: spec.id,
    namePt: spec.namePt,
    tilesW: spec.tilesW,
    tilesD: spec.tilesD,
    worldCenter: new THREE.Vector3(spec.cx, 0, spec.cz),
    worldFootprintMin: new THREE.Vector2(spec.cx - halfX, spec.cz - halfZ),
    worldFootprintMax: new THREE.Vector2(spec.cx + halfX, spec.cz + halfZ),
    doorWorldPos,
    root,
    baseGroup,
    capaGroup,
    portaPivot,
    isOpen: false,
    setInteriorOpen: (open: boolean) => {
      housePart.isOpen = open;
      capaGroup.visible = !open;
      portaPivot.rotation.y = open ? -Math.PI * 0.48 : 0;
    },
    npcId: spec.npcId,
    materials,
  };
  return housePart;
}

/**
 * Generates the complete NWL Starter City ("Cidade Principal dos Portais"):
 * - 1.5m tile grid plaza + roads + perimeter wall/gate
 * - All 6 enterable 3-part profession buildings (Grimório, Forja, Mercado, Baú, Tesouro, Salão)
 * - Central Fountain, Well, Lamp Posts, Market Stall, Portal das Profundezas
 * - All 9 NPCs + interactive `npc.bau` placed cleanly
 */
export function buildNwlStarterCity(
  sharedResources?: PixelizerMaterialResources
): GeneratedStarterCity {
  const root = new THREE.Group();
  root.name = 'NWL_Cidade_Principal_Portais';
  const materials: PixelizerMaterial[] = [];
  const colliders: CityColliderBox[] = [];
  const px = 3;

  // 1. Base Island Ground & 1.5m Tile Plaza (24m x 24m)
  const groundParts: THREE.BufferGeometry[] = [];
  const grassSlab = new THREE.BoxGeometry(27, 0.5, 27);
  grassSlab.translate(0, -0.26, 0);
  groundParts.push(prepareColoredPart(grassSlab, CITY_COLORS.grass));

  // Void cliff skirt
  const cliff = new THREE.BoxGeometry(26.4, 1.4, 26.4);
  cliff.translate(0, -1.2, 0);
  groundParts.push(prepareColoredPart(cliff, CITY_COLORS.stoneDark));

  // 1.5m plaza paving stones in grid
  for (let gx = -5; gx <= 5; gx++) {
    for (let gz = -5; gz <= 5; gz++) {
      const isRoad = Math.abs(gx) <= 1 || Math.abs(gz) <= 1;
      const inPlaza = Math.abs(gx) <= 3 && Math.abs(gz) <= 3;
      if (!isRoad && !inPlaza) continue;
      const tile = new THREE.BoxGeometry(NWL_TILE - 0.06, 0.06, NWL_TILE - 0.06);
      tile.translate(gx * NWL_TILE, 0.02, gz * NWL_TILE);
      const alt = (gx + gz) & 1;
      groundParts.push(
        prepareColoredPart(tile, alt === 0 ? CITY_COLORS.pavingA : CITY_COLORS.pavingB)
      );
    }
  }

  const groundMat = new PixelizerMaterial(
    {
      pixelated: false,
      objectId: 0,
      outlineAlpha: 0,
      edgeBevelWeight: 0,
      baseColor: '#ffffff',
      useColorGrading: false,
      smoothness: 0.06,
    },
    sharedResources
  );
  groundMat.vertexColors = true;
  materials.push(groundMat);
  const groundMesh = new THREE.Mesh(mergeColoredParts(groundParts), groundMat);
  groundMesh.name = 'City_Ground_Grid_1.5m';
  groundMesh.receiveShadow = true;
  groundMesh.castShadow = false;
  tagPixelizer(groundMesh, 1, root);
  root.add(groundMesh);

  // 2. City Props (Fountain, Well, Walls/Gate, Lamps, Market Stall)
  const propsParts: THREE.BufferGeometry[] = [];

  // Central Plaza Fountain at (-2.4, 0, 2.4) leaving hero spawn open at (0,0,2.5)
  const ftnBase = new THREE.CylinderGeometry(1.4, 1.6, 0.42, 8);
  ftnBase.translate(-3.0, 0.21, 3.0);
  const ftnWater = new THREE.CylinderGeometry(1.15, 1.15, 0.34, 8);
  ftnWater.translate(-3.0, 0.28, 3.0);
  const ftnPillar = new THREE.CylinderGeometry(0.28, 0.38, 1.1, 8);
  ftnPillar.translate(-3.0, 0.78, 3.0);
  propsParts.push(
    prepareColoredPart(ftnBase, CITY_COLORS.stoneLight),
    prepareColoredPart(ftnWater, CITY_COLORS.portalCore),
    prepareColoredPart(ftnPillar, CITY_COLORS.stoneSlate)
  );
  colliders.push({ minX: -4.4, maxX: -1.6, minZ: 1.6, maxZ: 4.4, tag: 'fountain' });

  // City Well at (3.2, 0, 3.2)
  const wellRing = new THREE.CylinderGeometry(0.68, 0.75, 0.65, 8);
  wellRing.translate(3.2, 0.32, 3.2);
  const wellRoof = new THREE.ConeGeometry(0.85, 0.55, 6);
  wellRoof.translate(3.2, 1.85, 3.2);
  propsParts.push(
    prepareColoredPart(wellRing, CITY_COLORS.stoneSlate),
    prepareColoredPart(wellRoof, CITY_COLORS.roofRed)
  );
  colliders.push({ minX: 2.4, maxX: 4.0, minZ: 2.4, maxZ: 4.0, tag: 'well' });

  // Lamp posts around the main crossroad
  for (const [lx, lz] of [
    [-1.8, -1.8],
    [1.8, -1.8],
    [-1.8, 5.2],
    [1.8, 5.2],
  ]) {
    const pole = new THREE.CylinderGeometry(0.08, 0.11, 2.2, 6);
    pole.translate(lx, 1.1, lz);
    const lantern = new THREE.BoxGeometry(0.32, 0.38, 0.32);
    lantern.translate(lx, 2.25, lz);
    propsParts.push(
      prepareColoredPart(pole, CITY_COLORS.stoneDark),
      prepareColoredPart(lantern, CITY_COLORS.goldBright)
    );
  }

  // Southern City Gate Wall (facing entrance)
  for (const gx of [-8.2, -5.2, 5.2, 8.2]) {
    const wall = new THREE.BoxGeometry(3.0, 2.8, 0.7);
    wall.translate(gx, 1.4, 10.6);
    const merlon = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    merlon.translate(gx, 3.0, 10.6);
    propsParts.push(
      prepareColoredPart(wall, CITY_COLORS.stoneSlate),
      prepareColoredPart(merlon, CITY_COLORS.stoneLight)
    );
    colliders.push({ minX: gx - 1.5, maxX: gx + 1.5, minZ: 10.1, maxZ: 11.1, tag: 'city_wall' });
  }

  const cityPropsMat = makeCityMat(sharedResources, 30, px);
  materials.push(cityPropsMat);
  const cityPropsMesh = new THREE.Mesh(mergeColoredParts(propsParts), cityPropsMat);
  cityPropsMesh.name = 'City_Plaza_Props';
  cityPropsMesh.castShadow = true;
  cityPropsMesh.receiveShadow = true;
  tagPixelizer(cityPropsMesh, px, root);
  root.add(cityPropsMesh);

  // 3. Portal das Profundezas (Northern focal point at 0, 0, -9.2)
  const portalPos = new THREE.Vector3(0, 0, -9.2);
  const portalArchParts: THREE.BufferGeometry[] = [];
  const stepBase = new THREE.BoxGeometry(4.2, 0.32, 2.6);
  stepBase.translate(0, 0.16, -9.2);
  const pillarL = new THREE.BoxGeometry(0.65, 3.4, 0.65);
  pillarL.translate(-1.35, 1.8, -9.2);
  const pillarR = new THREE.BoxGeometry(0.65, 3.4, 0.65);
  pillarR.translate(1.35, 1.8, -9.2);
  const archTop = new THREE.BoxGeometry(3.7, 0.72, 0.85);
  archTop.translate(0, 3.65, -9.2);
  const keystone = new THREE.OctahedronGeometry(0.36, 0);
  keystone.translate(0, 3.68, -8.75);
  portalArchParts.push(
    prepareColoredPart(stepBase, CITY_COLORS.stoneSlate),
    prepareColoredPart(pillarL, CITY_COLORS.roofPurple),
    prepareColoredPart(pillarR, CITY_COLORS.roofPurple),
    prepareColoredPart(archTop, CITY_COLORS.stoneLight),
    prepareColoredPart(keystone, CITY_COLORS.portalEdge)
  );
  const portalArchMat = makeCityMat(sharedResources, 38, px);
  materials.push(portalArchMat);
  const portalArchMesh = new THREE.Mesh(mergeColoredParts(portalArchParts), portalArchMat);
  portalArchMesh.name = 'Portal_Profundezas_Arch';
  portalArchMesh.castShadow = true;
  portalArchMesh.receiveShadow = true;
  tagPixelizer(portalArchMesh, px, root);
  root.add(portalArchMesh);

  const portalCoreMat = makeCityMat(sharedResources, 39, px, '#249fde', 1.45);
  materials.push(portalCoreMat);
  const portalCoreGeo = mergeColoredParts([
    prepareColoredPart(new THREE.OctahedronGeometry(0.95, 0), CITY_COLORS.portalCore),
    prepareColoredPart(new THREE.BoxGeometry(0.28, 2.1, 0.28), '#df3e23'),
  ]);
  const portalCore = new THREE.Mesh(portalCoreGeo, portalCoreMat);
  portalCore.name = 'Portal_Core_Loop';
  portalCore.position.set(0, 1.95, -9.2);
  tagPixelizer(portalCore, px, root);
  root.add(portalCore);

  // 4. All 6 Enterable Profession Houses (NWL 3-part spec: base + capa + porta)
  const houseSpecs: HouseSpec[] = [
    {
      id: 'forja',
      namePt: 'Forja do Ferreiro (4×4)',
      tilesW: 4,
      tilesD: 4,
      roofColor: CITY_COLORS.roofRed,
      trimColor: CITY_COLORS.stoneLight,
      wallColor: CITY_COLORS.stoneSlate,
      cx: -6.8,
      cz: -4.2,
      rotY: Math.PI * 0.5,
      npcId: 'npc.ferreiro',
    },
    {
      id: 'grimorio',
      namePt: 'Casa do Grimório (4×4)',
      tilesW: 4,
      tilesD: 4,
      roofColor: CITY_COLORS.roofBlue,
      trimColor: CITY_COLORS.goldBright,
      wallColor: CITY_COLORS.stoneSlate,
      cx: 6.8,
      cz: -4.2,
      rotY: -Math.PI * 0.5,
      npcId: 'npc.grimorista',
    },
    {
      id: 'mercado',
      namePt: 'Mercado Central (4×4)',
      tilesW: 4,
      tilesD: 4,
      roofColor: CITY_COLORS.roofGreen,
      trimColor: CITY_COLORS.gold,
      wallColor: '#b3b9d1',
      cx: -6.8,
      cz: 3.6,
      rotY: Math.PI * 0.5,
      npcId: 'npc.mercador',
    },
    {
      id: 'tesouro',
      namePt: 'Cofre do Tesouro (4×4)',
      tilesW: 4,
      tilesD: 4,
      roofColor: CITY_COLORS.roofPurple,
      trimColor: CITY_COLORS.goldBright,
      wallColor: CITY_COLORS.stoneLight,
      cx: 6.8,
      cz: 3.6,
      rotY: -Math.PI * 0.5,
      npcId: 'npc.tesoureiro',
    },
    {
      id: 'bau',
      namePt: 'Casa do Baú (3×3)',
      tilesW: 3,
      tilesD: 3,
      roofColor: CITY_COLORS.wood,
      trimColor: CITY_COLORS.gold,
      wallColor: CITY_COLORS.stoneLight,
      cx: -6.2,
      cz: -9.8,
      rotY: 0,
      npcId: 'npc.bau',
    },
    {
      id: 'salao',
      namePt: 'Salão do Comandante (5×5)',
      tilesW: 5,
      tilesD: 5,
      roofColor: CITY_COLORS.roofRed,
      trimColor: CITY_COLORS.goldBright,
      wallColor: CITY_COLORS.stoneSlate,
      cx: 6.8,
      cz: -10.5,
      rotY: 0,
      npcId: 'npc.comandante',
    },
  ];

  const houses: EnterableHousePart[] = [];
  houseSpecs.forEach((hs, i) => {
    const h = buildEnterableNwlHouse(hs, sharedResources, 41 + i * 3);
    houses.push(h);
    root.add(h.root);
    materials.push(...h.materials);
  });

  // 5. All 9 NPCs + `npc.bau` placed accurately inside houses / plaza / gate
  const npcPlacementsSpec: { id: NwlNpcId; pos: [number, number, number]; yaw: number }[] = [
    { id: 'npc.ferreiro', pos: [-6.8, 0.16, -4.2], yaw: Math.PI * 0.5 },
    { id: 'npc.grimorista', pos: [6.8, 0.16, -4.2], yaw: -Math.PI * 0.5 },
    { id: 'npc.mercador', pos: [-6.8, 0.16, 3.6], yaw: Math.PI * 0.5 },
    { id: 'npc.tesoureiro', pos: [6.8, 0.16, 3.6], yaw: -Math.PI * 0.5 },
    { id: 'npc.bau', pos: [-6.8, 0.16, -10.2], yaw: 0 },
    { id: 'npc.comandante', pos: [6.8, 0.16, -10.8], yaw: 0 },
    { id: 'npc.guarda', pos: [2.2, 0, 9.6], yaw: Math.PI },
    { id: 'npc.naturalista', pos: [-2.8, 0, 5.4], yaw: 0.4 },
    { id: 'npc.escriba', pos: [3.4, 0, 1.0], yaw: -0.6 },
    { id: 'npc.joalheira', pos: [-3.4, 0, -1.2], yaw: 0.5 },
  ];

  const npcs: CityNpcPlacement[] = [];
  npcPlacementsSpec.forEach((np, i) => {
    const instance = buildNwlNpc(np.id, { pixelSize: px, objectId: 70 + i }, sharedResources);
    instance.root.position.set(...np.pos);
    instance.root.rotation.y = np.yaw;
    root.add(instance.root);
    materials.push(...instance.materials);
    npcs.push({
      id: np.id,
      instance,
      worldPos: new THREE.Vector3(...np.pos),
    });
  });

  const playerSpawnPos = new THREE.Vector3(0, 0, 1.8);

  const update = (time: number, heroPos?: THREE.Vector3) => {
    portalCore.rotation.y = time * 1.4;
    portalCore.position.y = 1.95 + Math.sin(time * 2.2) * 0.12;

    let nearHouse: EnterableHousePart | null = null;
    let nearNpc: CityNpcPlacement | null = null;
    let inPortal = false;

    if (heroPos) {
      for (const h of houses) {
        const insideX =
          heroPos.x >= h.worldFootprintMin.x - 0.65 &&
          heroPos.x <= h.worldFootprintMax.x + 0.65;
        const insideZ =
          heroPos.z >= h.worldFootprintMin.y - 0.65 &&
          heroPos.z <= h.worldFootprintMax.y + 0.65;
        const nearDoor = heroPos.distanceTo(h.doorWorldPos) < 1.65;
        const open = (insideX && insideZ) || nearDoor;
        if (h.isOpen !== open) h.setInteriorOpen(open);
        if (open) nearHouse = h;
      }

      let bestDist = 2.4;
      for (const npc of npcs) {
        const d = heroPos.distanceTo(npc.worldPos);
        if (npc.id === 'npc.bau' && npc.instance.setChestOpen) {
          npc.instance.setChestOpen(d < 2.2);
        }
        if (d < bestDist) {
          bestDist = d;
          nearNpc = npc;
        }
      }

      inPortal = heroPos.distanceTo(portalPos) < 2.1;
    }

    return { nearHouse, nearNpc, inPortal };
  };

  return {
    name: root.name,
    tileSizeM: NWL_TILE,
    boundsRadiusM: 12.8,
    root,
    houses,
    npcs,
    portalPos,
    portalCore,
    playerSpawnPos,
    colliders,
    materials,
    update,
    dispose: () => {
      for (const n of npcs) {
        n.instance.root.traverse((o) => {
          if (o instanceof THREE.Mesh) o.geometry?.dispose();
        });
      }
      for (const m of materials) m.dispose();
    },
  };
}
