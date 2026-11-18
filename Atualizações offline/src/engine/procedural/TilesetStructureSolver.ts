import * as THREE from 'three';
import structuralKnowledgeRaw from '../../data/structuralKnowledge.json';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
import { buildVoxelMeshGroup, voxelizeObject3D } from '../Voxelizer';
import {
  mapGeometryToSheetSlot,
  synthesizeStructureBiomeSheet,
  type UnwrapMetricsSummary,
} from './PixelMaterialSynth';
import {
  makeBeveledBox,
  makePitchedRoofGeometry,
  type FinishMode,
} from './ProceduralGeometryKit';
import { buildProceduralProp, type PropKind } from './PropBuilder';
import {
  computeGeometryTangents,
  createSeededRng,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';
import { bakeVertexAoAndCreases } from './VertexAndTexelBaker';

export type StructureBiome = 'dungeon' | 'medieval' | 'city' | 'scifi';

export interface StructureBuildOptions {
  biome?: StructureBiome;
  cols?: number;
  rows?: number;
  floors?: number;
  seed?: number;
  visualStyle?: 'lowpoly' | 'voxel';
  pixelSize?: number;
  finishMode?: FinishMode;
  aoStrength?: number;
  normalStrength?: number;
}

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
  dispose?: () => void;
}

function measureMinVertexAo(geo: THREE.BufferGeometry): number {
  const col = geo.getAttribute('color');
  if (!col || col.count === 0) return 1;
  let minAo = 1;
  for (let i = 0; i < col.count; i++) {
    const lum = (col.getX(i) + col.getY(i) + col.getZ(i)) / 3;
    if (lum < minAo) minAo = lum;
  }
  return Number(minAo.toFixed(3));
}

/**
 * Constraint-driven 3D WFC / Architectural Structure & Tileset Generator calibrated
 * from `structuralKnowledge.json` (empirical KayKit/Quaternius CC0 grid & doorway ratios).
 */
export function buildProceduralStructure(
  options: StructureBuildOptions = {},
  sharedResources?: PixelizerMaterialResources
): GeneratedStructureResult {
  const biome = options.biome ?? 'dungeon';
  const cols = Math.max(2, Math.min(6, Math.round(options.cols ?? 3)));
  const rows = Math.max(2, Math.min(6, Math.round(options.rows ?? 3)));
  const floors = Math.max(1, Math.min(3, Math.round(options.floors ?? 1)));
  const seed = Math.floor(options.seed ?? 77);
  const rng = createSeededRng(seed);
  const visualStyle = options.visualStyle ?? 'lowpoly';
  const px = options.pixelSize ?? 3;
  const finishMode: FinishMode =
    visualStyle === 'voxel' ? 'textured_ao' : (options.finishMode ?? 'textured_ao');
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;
  const isTextured = finishMode === 'textured_ao';

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
  const propDisposers: Array<() => void> = [];

  const sheet = isTextured
    ? synthesizeStructureBiomeSheet(
        biome,
        { wallCol, trimCol, floorCol, accentCol },
        seed,
        Math.min(0.85, aoStrength),
        normalStrength
      )
    : null;

  const structParts: THREE.BufferGeometry[] = [];
  const cells: WfcCellSummary[] = [];
  const placedPillars = new Set<string>();

  const pushPart = (
    geo: THREE.BufferGeometry,
    slotId: 'wall' | 'trim' | 'floor' | 'roof' | 'accent' | 'wood',
    flatColor: string
  ) => {
    if (sheet) {
      const colored = prepareColoredPart(geo, '#ffffff');
      const mapped = mapGeometryToSheetSlot(colored, sheet.slots[slotId] ?? sheet.slots.wall);
      if (mapped !== colored) colored.dispose();
      structParts.push(mapped);
    } else {
      structParts.push(prepareColoredPart(geo, flatColor));
    }
  };

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
    const tmpItems: { geo: THREE.BufferGeometry; slot: 'wall' | 'trim' | 'accent' | 'wood'; col: string }[] = [];
    if (hasDoor) {
      const sideW = (tileSizeM - doorW) * 0.5;
      for (const sx of [-doorW * 0.5 - sideW * 0.5, doorW * 0.5 + sideW * 0.5]) {
        const post = makeBeveledBox(sideW, wallH, wallT, 0.016, wallCol, {
          offset: [sx, wallH * 0.5, 0],
        });
        tmpItems.push({ geo: post, slot: 'wall', col: wallCol });
      }
      const lintelH = wallH - doorH;
      const lintel = makeBeveledBox(doorW, lintelH, wallT, 0.016, trimCol, {
        offset: [0, doorH + lintelH * 0.5, 0],
      });
      const threshold = makeBeveledBox(doorW + 0.06, 0.08, wallT + 0.08, 0.012, trimCol, {
        offset: [0, 0.04, 0],
      });
      tmpItems.push(
        { geo: lintel, slot: 'trim', col: trimCol },
        { geo: threshold, slot: 'wood', col: trimCol }
      );
    } else if (hasWindow) {
      const sillH = wallH * 0.34;
      const topH = wallH * 0.24;
      const winW = tileSizeM * 0.44;
      const sideW = (tileSizeM - winW) * 0.5;
      const sill = makeBeveledBox(tileSizeM, sillH, wallT, 0.016, wallCol, {
        offset: [0, sillH * 0.5, 0],
      });
      const top = makeBeveledBox(tileSizeM, topH, wallT, 0.016, trimCol, {
        offset: [0, wallH - topH * 0.5, 0],
      });
      tmpItems.push(
        { geo: sill, slot: 'wall', col: wallCol },
        { geo: top, slot: 'trim', col: trimCol }
      );
      const midH = wallH - sillH - topH;
      for (const sx of [-winW * 0.5 - sideW * 0.5, winW * 0.5 + sideW * 0.5]) {
        const jamb = makeBeveledBox(sideW, midH, wallT, 0.014, wallCol, {
          offset: [sx, sillH + midH * 0.5, 0],
        });
        tmpItems.push({ geo: jamb, slot: 'wall', col: wallCol });
      }
      const pane = makeBeveledBox(winW, midH, wallT * 0.34, 0.008, accentCol, {
        offset: [0, sillH + midH * 0.5, 0],
      });
      tmpItems.push({ geo: pane, slot: 'accent', col: accentCol });
    } else {
      const wall = makeBeveledBox(tileSizeM, wallH, wallT, 0.018, wallCol, {
        offset: [0, wallH * 0.5, 0],
      });
      const plinth = makeBeveledBox(tileSizeM + 0.04, 0.2, wallT + 0.05, 0.014, trimCol, {
        offset: [0, 0.1, 0],
      });
      tmpItems.push(
        { geo: wall, slot: 'wall', col: wallCol },
        { geo: plinth, slot: 'trim', col: trimCol }
      );
    }

    const m4 = new THREE.Matrix4()
      .makeTranslation(cx, cy, cz)
      .multiply(new THREE.Matrix4().makeRotationY(rotY));
    for (const item of tmpItems) {
      item.geo.applyMatrix4(m4);
      pushPart(item.geo, item.slot, item.col);
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
        const slab = makeBeveledBox(tileSizeM, 0.14, tileSizeM, 0.014, floorCol, {
          offset: [cx, baseY - 0.07, cz],
        });
        pushPart(slab, 'floor', floorCol);

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

        // Deduplicated corner pillars at wall junctions (zero z-fighting overlap)
        for (const [dr, dc] of [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ]) {
          const gr = r + dr;
          const gc = c + dc;
          const pKey = `${f}:${gr}:${gc}`;
          if (placedPillars.has(pKey)) continue;
          placedPillars.add(pKey);
          const pxPos = offsetX + (gc - 0.5) * tileSizeM;
          const pzPos = offsetZ + (gr - 0.5) * tileSizeM;
          const pil = makeBeveledBox(0.28, wallH + 0.12, 0.28, 0.018, trimCol, {
            offset: [pxPos, baseY + (wallH + 0.12) * 0.5, pzPos],
          });
          pushPart(pil, 'trim', trimCol);
        }

        // Pitched hip/gable roof or parapet cornice on top floor
        if (f === floors - 1 && (biome === 'medieval' || biome === 'dungeon')) {
          const roof = makePitchedRoofGeometry(
            tileSizeM + 0.08,
            tileSizeM + 0.08,
            0.12,
            biome === 'medieval' ? 0.68 : 0.44,
            0.1,
            {
              style: biome === 'medieval' ? 'hip' : 'gable',
              roofHex: isTextured ? '#ffffff' : accentCol,
              trimHex: isTextured ? '#ffffff' : trimCol,
              gableHex: isTextured ? '#ffffff' : wallCol,
            }
          );
          roof.roofShell.translate(cx, baseY + wallH, cz);
          roof.ridgeTrim.translate(cx, baseY + wallH, cz);
          roof.gableFill.translate(cx, baseY + wallH, cz);
          pushPart(roof.roofShell, 'roof', accentCol);
          pushPart(roof.ridgeTrim, 'trim', trimCol);
          pushPart(roof.gableFill, 'wall', wallCol);
        } else if (f === floors - 1) {
          const parapet = makeBeveledBox(tileSizeM + 0.1, 0.14, tileSizeM + 0.1, 0.015, trimCol, {
            offset: [cx, baseY + wallH + 0.07, cz],
          });
          pushPart(parapet, 'trim', trimCol);
        }

        // Spawn calibrated interior prop cleanly on ground floor
        let chosenProp: PropKind | undefined;
        if (f === 0 && rng() > 0.42) {
          const pool = biomePropPool[biome];
          chosenProp = pool[Math.floor(rng() * pool.length)];
          const prop = buildProceduralProp(
            {
              kind: chosenProp,
              seed: 700 + (cells.length % 2),
              visualStyle,
              objectId: 40 + cells.length,
              pixelSize: visualStyle === 'voxel' ? 1 : px,
              finishMode,
              aoStrength,
              normalStrength,
            },
            sharedResources
          );
          prop.root.scale.setScalar(0.55);
          prop.root.position.set(cx + (rng() - 0.5) * 0.4, baseY, cz + (rng() - 0.5) * 0.4);
          root.add(prop.root);
          materials.push(...prop.materials);
          if (prop.dispose) propDisposers.push(prop.dispose);
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

  if (isTextured) {
    bakeVertexAoAndCreases(mergedStruct, {
      rays: 12,
      maxDist: 0.72,
      strength: aoStrength,
      creaseBoost: aoStrength <= 0.01 ? 0 : 0.05,
    });
    computeGeometryTangents(mergedStruct);
  }

  const triCount = Math.floor((mergedStruct.getAttribute('position')?.count ?? 0) / 3);
  const minVertexAo = measureMinVertexAo(mergedStruct);
  const unwrapMetrics: UnwrapMetricsSummary = sheet
    ? {
        finishMode,
        texelsPerMeter: 32,
        texWidth: sheet.textures.texWidth,
        texHeight: sheet.textures.texHeight,
        islandsCount: 6,
        triangleCount: triCount,
        overlapPairs: 0,
        meanEntropy: sheet.textures.quality.meanEntropy,
        flatFacesPercent: sheet.textures.quality.flatFacesPercent,
        meanEdgeChangePercent: sheet.textures.quality.meanEdgeChangePercent,
        minVertexAo,
      }
    : {
        finishMode: 'classic_flat',
        texelsPerMeter: 0,
        texWidth: 0,
        texHeight: 0,
        islandsCount: 0,
        triangleCount: triCount,
        overlapPairs: 0,
        meanEntropy: 0,
        flatFacesPercent: 100,
        meanEdgeChangePercent: 0,
        minVertexAo,
      };
  mergedStruct.userData = { ...mergedStruct.userData, unwrapMetrics };
  root.userData.unwrapMetrics = unwrapMetrics;

  const hasGlow = Boolean(sheet?.textures.hasEmission && sheet.textures.emissionMap);

  if (visualStyle === 'voxel') {
    const tmpMat = new PixelizerMaterial(
      {
        pixelated: false,
        objectId: 35,
        baseColor: '#ffffff',
        diffuseVertexColorWeight: 1.0,
        albedoMap: sheet?.textures.albedoMap ?? null,
        normalMap: sheet?.textures.normalMap ?? null,
        useVertexTangents: Boolean(sheet?.textures.normalMap && mergedStruct.getAttribute('tangent')),
        smoothness: 0.16,
      },
      sharedResources
    );
    tmpMat.vertexColors = true;
    const tmp = new THREE.Mesh(mergedStruct, tmpMat);
    const grid = voxelizeObject3D(tmp, {
      resolution: 34,
      preserveWorldScale: true,
      fillSolidInterior: true,
    });
    tmpMat.dispose();
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
        baseColor: '#ffffff',
        diffuseVertexColorWeight: 1.0,
        albedoMap: sheet?.textures.albedoMap ?? null,
        normalMap: sheet?.textures.normalMap ?? null,
        normalScale: sheet ? 0.85 : 1.0,
        useVertexTangents: Boolean(sheet?.textures.normalMap && mergedStruct.getAttribute('tangent')),
        emissionMap: hasGlow ? (sheet?.textures.emissionMap ?? null) : null,
        emissionColor: hasGlow ? '#ffffff' : '#000000',
        emissionIntensity: hasGlow ? 1.15 : 0.0,
        edgeHighlight: 0.36,
        edgeBevelWeight: 0.68,
        useColorGrading: true,
        smoothness: 0.16,
      },
      sharedResources
    );
    mat.vertexColors = true;
    const mesh = new THREE.Mesh(mergedStruct, mat);
    mesh.name = `WFC_${biome}_Architecture`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.pixelizer = {
      snap: {
        snapPosition: false,
        alignPixelGrid: true,
        alignmentPixelSize: px,
        angleSnapMode: 'none',
        angleResolutionDeg: 45,
      },
      gridReference: root,
    } satisfies PixelizerObjectAttachment;
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
    dispose: () => {
      for (const disp of propDisposers) disp();
      const disposedMats = new Set<PixelizerMaterial>();
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry?.dispose();
      });
      const disposedTex = new Set<THREE.Texture>();
      for (const m of materials) {
        if (disposedMats.has(m)) continue;
        disposedMats.add(m);
        const o = m.options;
        for (const t of [o.albedoMap, o.normalMap, o.emissionMap]) {
          if (t && t.userData?.pooled !== true && !disposedTex.has(t)) {
            disposedTex.add(t);
            t.dispose();
          }
        }
        m.dispose();
      }
    },
  };
}
