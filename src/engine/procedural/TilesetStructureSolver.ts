import * as THREE from 'three';
import structuralKnowledgeRaw from '../../data/structuralKnowledge.json';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import { buildVoxelMeshGroup, voxelizeObject3D } from '../Voxelizer';
import { buildProceduralProp, type PropKind } from './PropBuilder';
import { createSeededRng, mergeColoredParts, prepareColoredPart } from './SdfVoxelPrimitives';

export type StructureBiome = 'dungeon' | 'medieval' | 'city' | 'scifi';

export interface WfcCellSummary {
  gx: number;
  gz: number;
  kind: 'room' | 'corridor' | 'door' | 'courtyard';
  walls: { n: boolean; s: boolean; e: boolean; w: boolean };
  doors: { n: boolean; s: boolean; e: boolean; w: boolean };
  prop?: PropKind;
}

export interface GeneratedStructureResult {
  name: string;
  biome: StructureBiome;
  gridCols: number;
  gridRows: number;
  tileSizeM: number;
  cells: WfcCellSummary[];
  root: THREE.Group;
  materials: PixelizerMaterial[];
}

/**
 * Constraint-driven 3D WFC / Architectural Structure & Tileset Generator calibrated
 * from `structuralKnowledge.json` (empirical KayKit/Quaternius CC0 grid & doorway ratios).
 */
export function buildProceduralStructure(
  options: {
    biome?: StructureBiome;
    cols?: number;
    rows?: number;
    floors?: number;
    seed?: number;
    visualStyle?: 'lowpoly' | 'voxel';
    pixelSize?: number;
  } = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedStructureResult {
  const biome = options.biome ?? 'dungeon';
  const cols = Math.max(2, Math.min(6, Math.round(options.cols ?? 3)));
  const rows = Math.max(2, Math.min(6, Math.round(options.rows ?? 3)));
  const floors = Math.max(1, Math.min(3, Math.round(options.floors ?? 1)));
  const rng = createSeededRng(options.seed ?? 77);
  const visualStyle = options.visualStyle ?? 'lowpoly';
  const px = options.pixelSize ?? 3;

  const knowledge = structuralKnowledgeRaw;
  const biomeCfg = (
    knowledge.wfcBiomes as Record<
      StructureBiome,
      { tileSizeM: number; floorHeightM: number; palette: Record<string, string> }
    >
  )[biome];

  // Compact studio preview tile scale (2.0m per tile keeps whole building clearly framed)
  const tileSizeM = 2.0;
  const wallH = (biomeCfg.floorHeightM / biomeCfg.tileSizeM) * tileSizeM;
  const wallT = 0.22;
  const doorW = 0.92;
  const doorH = 1.32;

  const pal = biomeCfg.palette;
  const wallCol = pal.stone ?? pal.concrete ?? pal.hull ?? '#606a7c';
  const trimCol = pal.trim ?? pal.panel ?? pal.wood ?? '#383e4d';
  const floorCol = pal.floor ?? pal.plaster ?? pal.deck ?? pal.asphalt ?? '#3e4554';
  const accentCol = pal.accent ?? pal.roof ?? pal.glow ?? '#d98c3f';

  // Generate connected room mask via randomized walk (WFC-compatible occupancy)
  const occupied: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  let curR = Math.floor(rows / 2);
  let curC = Math.floor(cols / 2);
  occupied[curR][curC] = true;
  const targetCells = Math.max(3, Math.round(cols * rows * 0.72));
  let filled = 1;

  for (let step = 0; step < cols * rows * 4 && filled < targetCells; step++) {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const [dr, dc] = dirs[Math.floor(rng() * 4)];
    const nr = Math.max(0, Math.min(rows - 1, curR + dr));
    const nc = Math.max(0, Math.min(cols - 1, curC + dc));
    curR = nr;
    curC = nc;
    if (!occupied[curR][curC]) {
      occupied[curR][curC] = true;
      filled++;
    }
  }

  const root = new THREE.Group();
  root.name = `WFC_${biome}_${cols}x${rows}`;
  const materials: PixelizerMaterial[] = [];

  const structParts: THREE.BufferGeometry[] = [];
  const cells: WfcCellSummary[] = [];

  const offsetX = -((cols - 1) * tileSizeM) * 0.5;
  const offsetZ = -((rows - 1) * tileSizeM) * 0.5;

  const addWallSegment = (
    cx: number,
    cy: number,
    cz: number,
    rotY: number,
    hasDoor: boolean,
    hasWindow: boolean
  ) => {
    const groupTmp: THREE.BufferGeometry[] = [];
    if (hasDoor) {
      const sideW = (tileSizeM - doorW) * 0.5;
      for (const sx of [-doorW * 0.5 - sideW * 0.5, doorW * 0.5 + sideW * 0.5]) {
        const post = new THREE.BoxGeometry(sideW, wallH, wallT);
        post.translate(sx, wallH * 0.5, 0);
        groupTmp.push(prepareColoredPart(post, wallCol));
      }
      const lintelH = wallH - doorH;
      const lintel = new THREE.BoxGeometry(doorW, lintelH, wallT);
      lintel.translate(0, doorH + lintelH * 0.5, 0);
      groupTmp.push(prepareColoredPart(lintel, trimCol));
    } else if (hasWindow) {
      const sillH = wallH * 0.34;
      const topH = wallH * 0.24;
      const winW = tileSizeM * 0.44;
      const sideW = (tileSizeM - winW) * 0.5;
      const sill = new THREE.BoxGeometry(tileSizeM, sillH, wallT);
      sill.translate(0, sillH * 0.5, 0);
      const top = new THREE.BoxGeometry(tileSizeM, topH, wallT);
      top.translate(0, wallH - topH * 0.5, 0);
      groupTmp.push(prepareColoredPart(sill, wallCol), prepareColoredPart(top, trimCol));
      const midH = wallH - sillH - topH;
      for (const sx of [-winW * 0.5 - sideW * 0.5, winW * 0.5 + sideW * 0.5]) {
        const jamb = new THREE.BoxGeometry(sideW, midH, wallT);
        jamb.translate(sx, sillH + midH * 0.5, 0);
        groupTmp.push(prepareColoredPart(jamb, wallCol));
      }
      const pane = new THREE.BoxGeometry(winW, midH, wallT * 0.3);
      pane.translate(0, sillH + midH * 0.5, 0);
      groupTmp.push(prepareColoredPart(pane, accentCol));
    } else {
      const wall = new THREE.BoxGeometry(tileSizeM, wallH, wallT);
      wall.translate(0, wallH * 0.5, 0);
      const plinth = new THREE.BoxGeometry(tileSizeM + 0.04, 0.2, wallT + 0.05);
      plinth.translate(0, 0.1, 0);
      groupTmp.push(prepareColoredPart(wall, wallCol), prepareColoredPart(plinth, trimCol));
    }

    const m4 = new THREE.Matrix4()
      .makeTranslation(cx, cy, cz)
      .multiply(new THREE.Matrix4().makeRotationY(rotY));
    for (const g of groupTmp) {
      g.applyMatrix4(m4);
      structParts.push(g);
    }
  };

  let doorPlaced = false;
  const biomePropPool: Record<StructureBiome, PropKind[]> = {
    dungeon: ['chest', 'barrel', 'crate', 'pillar'],
    medieval: ['barrel', 'table', 'crate', 'tree'],
    city: ['crate', 'pillar', 'table', 'tree'],
    scifi: ['crate', 'pillar', 'table', 'barrel'],
  };

  for (let f = 0; f < floors; f++) {
    const baseY = f * wallH;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!occupied[r][c]) continue;
        const cx = offsetX + c * tileSizeM;
        const cz = offsetZ + r * tileSizeM;

        // Floor slab
        const slab = new THREE.BoxGeometry(tileSizeM, 0.14, tileSizeM);
        slab.translate(cx, baseY - 0.07, cz);
        structParts.push(prepareColoredPart(slab, floorCol));

        const nOpen = r > 0 && occupied[r - 1][c];
        const sOpen = r < rows - 1 && occupied[r + 1][c];
        const wOpen = c > 0 && occupied[r][c - 1];
        const eOpen = c < cols - 1 && occupied[r][c + 1];

        const walls = { n: !nOpen, s: !sOpen, e: !eOpen, w: !wOpen };
        const doors = { n: false, s: false, e: false, w: false };

        // Place main entrance door on an exposed South-facing wall on ground floor
        if (f === 0 && walls.s && !doorPlaced) {
          doors.s = true;
          doorPlaced = true;
        }

        if (walls.n) addWallSegment(cx, baseY, cz - tileSizeM * 0.5, 0, doors.n, rng() > 0.55);
        if (walls.s) addWallSegment(cx, baseY, cz + tileSizeM * 0.5, 0, doors.s, !doors.s && rng() > 0.65);
        if (walls.w) addWallSegment(cx - tileSizeM * 0.5, baseY, cz, Math.PI * 0.5, doors.w, rng() > 0.65);
        if (walls.e) addWallSegment(cx + tileSizeM * 0.5, baseY, cz, Math.PI * 0.5, doors.e, rng() > 0.65);

        // Corner pillars at wall junctions
        for (const [dx, dz] of [
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
        ]) {
          const pil = new THREE.BoxGeometry(0.28, wallH + 0.12, 0.28);
          pil.translate(cx + dx * tileSizeM, baseY + (wallH + 0.12) * 0.5, cz + dz * tileSizeM);
          structParts.push(prepareColoredPart(pil, trimCol));
        }

        // Roof cap on top floor
        if (f === floors - 1 && (biome === 'medieval' || biome === 'dungeon')) {
          const roof = new THREE.BoxGeometry(tileSizeM + 0.12, 0.16, tileSizeM + 0.12);
          roof.translate(cx, baseY + wallH + 0.08, cz);
          structParts.push(prepareColoredPart(roof, accentCol));
        }

        // Spawn calibrated interior prop cleanly on ground floor
        let chosenProp: PropKind | undefined;
        if (f === 0 && rng() > 0.42) {
          const pool = biomePropPool[biome];
          chosenProp = pool[Math.floor(rng() * pool.length)];
          const prop = buildProceduralProp(
            {
              kind: chosenProp,
              seed: Math.floor(rng() * 9999),
              visualStyle,
              objectId: 40 + cells.length,
              pixelSize: visualStyle === 'voxel' ? 1 : px,
            },
            sharedResources
          );
          prop.root.scale.setScalar(0.55);
          prop.root.position.set(cx + (rng() - 0.5) * 0.4, baseY, cz + (rng() - 0.5) * 0.4);
          root.add(prop.root);
          materials.push(...prop.materials);
        }

        if (f === 0) {
          cells.push({
            gx: c,
            gz: r,
            kind: doors.s ? 'door' : 'room',
            walls,
            doors,
            prop: chosenProp,
          });
        }
      }
    }
  }

  const mergedStruct = mergeColoredParts(structParts);
  for (const p of structParts) p.dispose();

  if (visualStyle === 'voxel') {
    const tmp = new THREE.Mesh(mergedStruct, new THREE.MeshStandardMaterial({ vertexColors: true }));
    const grid = voxelizeObject3D(tmp, { resolution: 34, preserveWorldScale: true, fillSolidInterior: true });
    mergedStruct.dispose();
    const { group, material } = buildVoxelMeshGroup(grid, sharedResources, {
      objectId: 35,
      pixelSize: 1,
    });
    root.add(group);
    materials.push(material);
  } else {
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: px,
        objectId: 35,
        outlineColor: '#12101a',
        outlineAlpha: 1.0,
        edgeHighlight: 0.36,
        edgeBevelWeight: 0.62,
        useColorGrading: true,
        diffuseVertexColorWeight: 1.0,
        smoothness: 0.14,
      },
      sharedResources
    );
    mat.vertexColors = true;
    const mesh = new THREE.Mesh(mergedStruct, mat);
    mesh.name = `WFC_${biome}_Architecture`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    materials.push(mat);
  }

  return {
    name: root.name,
    biome,
    gridCols: cols,
    gridRows: rows,
    tileSizeM,
    cells,
    root,
    materials,
  };
}
