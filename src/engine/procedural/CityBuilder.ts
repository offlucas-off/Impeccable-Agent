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
import {
  computeGeometryTangents,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';
import {
  makeBeveledBox,
  makeLatheProfile,
  makePitchedRoofGeometry,
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

export type CityHouseKind =
  | 'grimorio'
  | 'forja'
  | 'mercado'
  | 'bau'
  | 'tesouro'
  | 'salao';

export interface CityBuildOptions {
  finishMode?: FinishMode;
  seed?: number;
  aoStrength?: number;
  normalStrength?: number;
}

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

function disposeCityMaterials(materials: PixelizerMaterial[]): void {
  const seenTex = new Set<THREE.Texture>();
  for (const m of materials) {
    const o = m.options;
    for (const tex of [o.albedoMap, o.normalMap, o.emissionMap]) {
      if (tex && tex.userData?.pooled !== true && !seenTex.has(tex)) {
        seenTex.add(tex);
        tex.dispose();
      }
    }
    m.dispose();
  }
}

/**
 * Builds an enterable NWL building in 3 clean parts:
 *  - `base`: floor, back/side walls, interior profession furniture
 *  - `capa`: real sloped pitched roof & front gable walls (hidden smoothly when player steps near/inside)
 *  - `porta`: hinged door pivot
 */
export function buildEnterableNwlHouse(
  spec: HouseSpec,
  sharedResources?: PixelizerMaterialResources,
  objectId = 31,
  options: CityBuildOptions = {}
): EnterableHousePart {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 401);
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;

  const px = 1;
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

  // --- PART 1: BASE (Floor + Stepped Stone Plinth + Quoins + Enxaimel Timber + Windows + Interior Props) ---
  const baseParts: TaggedGeometryPart[] = [];
  const floor = makeBeveledBox(w, 0.16, d, 0.018, CITY_COLORS.woodDark, { offset: [0, 0.08, 0] });
  baseParts.push(
    tagPart(floor, `${spec.id}_floor`, 'wood_planks', CITY_COLORS.woodDark, { lockVertical: false })
  );

  // Stepped exterior stone foundation plinth along rear & side walls
  const plinthBack = makeBeveledBox(w + 0.18, 0.42, wallT + 0.14, 0.024, CITY_COLORS.stoneSlate, {
    offset: [0, 0.21, -d * 0.5 + wallT * 0.45],
  });
  baseParts.push(
    tagPart(plinthBack, `${spec.id}_plinth_back`, 'mossy_cobble', CITY_COLORS.stoneSlate, {
      accentHex: CITY_COLORS.grass,
      lockVertical: true,
    })
  );

  const rug = makeBeveledBox(w - 1.1, 0.04, d - 1.1, 0.012, spec.roofColor, {
    offset: [0, 0.17, 0],
  });
  baseParts.push(
    tagPart(rug, `${spec.id}_rug`, 'woven_cloth', spec.roofColor, { lockVertical: false })
  );

  const backWall = makeBeveledBox(w, wallH, wallT, 0.025, spec.wallColor, {
    offset: [0, wallH * 0.5, -d * 0.5 + wallT * 0.5],
  });
  baseParts.push(
    tagPart(backWall, `${spec.id}_backwall`, 'plaster_wall', spec.wallColor, {
      accentHex: spec.trimColor,
      lockVertical: true,
    })
  );

  // Rear horizontal timber belt + diagonal enxaimel cross-braces
  const backBelt = makeBeveledBox(w + 0.08, 0.14, wallT + 0.08, 0.018, CITY_COLORS.woodDark, {
    offset: [0, wallH * 0.52, -d * 0.5 + wallT * 0.48],
  });
  baseParts.push(
    tagPart(backBelt, `${spec.id}_back_belt`, 'timber_frame', CITY_COLORS.woodDark, {
      lockVertical: true,
    })
  );
  for (const [bIdx, sx] of [-1, 1].entries()) {
    const brace = makeBeveledBox(0.11, 1.32, wallT + 0.07, 0.015, CITY_COLORS.woodDark);
    brace.rotateZ(sx * 0.46);
    brace.translate(sx * (w * 0.28), wallH * 0.74, -d * 0.5 + wallT * 0.48);
    baseParts.push(
      tagPart(brace, `${spec.id}_back_brace_${bIdx}`, 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: false,
      })
    );
  }

  for (const [sIdx, sx] of [-1, 1].entries()) {
    const sideWall = makeBeveledBox(wallT, wallH, d, 0.025, spec.wallColor, {
      offset: [sx * (w * 0.5 - wallT * 0.5), wallH * 0.5, 0],
    });
    const plinthSide = makeBeveledBox(wallT + 0.14, 0.42, d + 0.12, 0.024, CITY_COLORS.stoneSlate, {
      offset: [sx * (w * 0.5 - wallT * 0.45), 0.21, 0],
    });
    const post = makeBeveledBox(wallT + 0.12, wallH + 0.1, wallT + 0.12, 0.02, spec.trimColor, {
      offset: [sx * (w * 0.5 - wallT * 0.4), (wallH + 0.1) * 0.5, -d * 0.5 + wallT * 0.4],
    });
    const sideBelt = makeBeveledBox(wallT + 0.08, 0.14, d + 0.06, 0.018, CITY_COLORS.woodDark, {
      offset: [sx * (w * 0.5 - wallT * 0.48), wallH * 0.52, 0],
    });
    // Protruding medieval window frame + sill on each side wall
    const winFrame = makeBeveledBox(0.14, 0.86, 0.94, 0.018, CITY_COLORS.woodDark, {
      offset: [sx * (w * 0.5 + 0.03), 1.72, 0],
    });
    const winSill = makeBeveledBox(0.22, 0.11, 1.12, 0.018, CITY_COLORS.stoneLight, {
      offset: [sx * (w * 0.5 + 0.06), 1.25, 0],
    });
    const winPane = makeBeveledBox(0.08, 0.64, 0.72, 0.01, CITY_COLORS.goldBright, {
      offset: [sx * (w * 0.5 + 0.02), 1.72, 0],
    });
    baseParts.push(
      tagPart(sideWall, `${spec.id}_sidewall_${sIdx}`, 'plaster_wall', spec.wallColor, {
        lockVertical: true,
      }),
      tagPart(plinthSide, `${spec.id}_plinth_side_${sIdx}`, 'mossy_cobble', CITY_COLORS.stoneSlate, {
        accentHex: CITY_COLORS.grass,
        lockVertical: true,
      }),
      tagPart(post, `${spec.id}_post_${sIdx}`, 'timber_frame', spec.trimColor, {
        lockVertical: true,
      }),
      tagPart(sideBelt, `${spec.id}_side_belt_${sIdx}`, 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      }),
      tagPart(winFrame, `${spec.id}_win_frame_${sIdx}`, 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      }),
      tagPart(winSill, `${spec.id}_win_sill_${sIdx}`, 'stone_masonry', CITY_COLORS.stoneLight, {
        lockVertical: true,
      }),
      tagPart(winPane, `${spec.id}_win_pane_${sIdx}`, 'runic_glow', CITY_COLORS.goldBright, {
        lockVertical: true,
      })
    );

    // 4 alternating corner stone quoins along each rear vertical corner edge
    for (let q = 0; q < 4; q++) {
      const isEven = q % 2 === 0;
      const qW = isEven ? 0.44 : 0.32;
      const qD = isEven ? 0.32 : 0.44;
      const qY = 0.62 + q * 0.62;
      const quoin = makeBeveledBox(qW, 0.34, qD, 0.022, CITY_COLORS.stoneLight, {
        offset: [
          sx * (w * 0.5 - qW * 0.36),
          qY,
          -d * 0.5 + qD * 0.36,
        ],
      });
      baseParts.push(
        tagPart(quoin, `${spec.id}_quoin_rear_${sIdx}_${q}`, 'stone_masonry', CITY_COLORS.stoneLight, {
          lockVertical: true,
        })
      );
    }
  }

  // Interior Profession Furniture (clearly visible when capa hides!)
  if (spec.id === 'forja') {
    const anvilBase = makeBeveledBox(0.65, 0.55, 0.45, 0.02, CITY_COLORS.woodDark, {
      offset: [-1.2, 0.44, -0.4],
    });
    const anvilHorn = makeBeveledBox(0.88, 0.24, 0.34, 0.022, CITY_COLORS.stoneLight, {
      offset: [-1.2, 0.8, -0.4],
    });
    const furnace = makeBeveledBox(1.3, 1.8, 1.0, 0.04, CITY_COLORS.stoneSlate, {
      offset: [1.2, 1.0, -d * 0.5 + 0.72],
    });
    const emberBox = makeBeveledBox(0.7, 0.45, 0.3, 0.03, CITY_COLORS.ember, {
      offset: [1.2, 0.65, -d * 0.5 + 1.12],
    });
    baseParts.push(
      tagPart(anvilBase, 'forja_anvil_stand', 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      }),
      tagPart(anvilHorn, 'forja_anvil_head', 'forged_steel', CITY_COLORS.stoneLight, {
        lockVertical: false,
      }),
      tagPart(furnace, 'forja_furnace', 'stone_masonry', CITY_COLORS.stoneSlate, {
        lockVertical: true,
      }),
      tagPart(emberBox, 'forja_ember', 'runic_glow', CITY_COLORS.ember, { lockVertical: false })
    );
  } else if (spec.id === 'grimorio') {
    for (const [bIdx, bx] of [-1.4, 1.4].entries()) {
      const shelf = makeBeveledBox(1.4, 2.0, 0.45, 0.025, CITY_COLORS.wood, {
        offset: [bx, 1.15, -d * 0.5 + 0.55],
      });
      const books = makeBeveledBox(1.2, 1.4, 0.22, 0.015, CITY_COLORS.portalCore, {
        offset: [bx, 1.18, -d * 0.5 + 0.7],
      });
      baseParts.push(
        tagPart(shelf, `grim_shelf_${bIdx}`, 'wood_planks', CITY_COLORS.wood, {
          lockVertical: true,
        }),
        tagPart(books, `grim_tomes_${bIdx}`, 'woven_cloth', CITY_COLORS.portalCore, {
          lockVertical: true,
        })
      );
    }
    const lectern = makeLatheProfile(
      [
        [0.3, 0.16],
        [0.18, 0.55],
        [0.16, 1.0],
        [0.28, 1.18],
      ],
      8,
      CITY_COLORS.woodDark,
      { offset: [0, 0, -0.5] }
    );
    const orb = makeBeveledBox(0.32, 0.32, 0.32, 0.075, CITY_COLORS.goldBright, {
      offset: [0, 1.42, -0.5],
    });
    baseParts.push(
      tagPart(lectern, 'grim_lectern', 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      }),
      tagPart(orb, 'grim_orb', 'runic_glow', CITY_COLORS.goldBright, { lockVertical: false })
    );
  } else if (spec.id === 'mercado') {
    const counter = makeBeveledBox(w * 0.58, 0.95, 0.65, 0.025, CITY_COLORS.wood, {
      offset: [0, 0.62, -0.8],
    });
    const crateA = makeBeveledBox(0.65, 0.65, 0.65, 0.025, CITY_COLORS.gold, {
      offset: [-1.5, 0.48, -1.2],
    });
    const crateB = makeBeveledBox(0.55, 0.55, 0.55, 0.022, CITY_COLORS.roofGreen, {
      offset: [1.5, 0.43, -1.2],
    });
    baseParts.push(
      tagPart(counter, 'merc_counter', 'wood_planks', CITY_COLORS.wood, { lockVertical: true }),
      tagPart(crateA, 'merc_crate_a', 'wood_planks', CITY_COLORS.gold, { lockVertical: true }),
      tagPart(crateB, 'merc_crate_b', 'wood_planks', CITY_COLORS.roofGreen, { lockVertical: true })
    );
  } else if (spec.id === 'bau') {
    const table = makeBeveledBox(1.3, 0.78, 0.8, 0.025, CITY_COLORS.wood, {
      offset: [1.1, 0.55, -0.7],
    });
    baseParts.push(
      tagPart(table, 'bau_table', 'wood_planks', CITY_COLORS.wood, { lockVertical: true })
    );
  } else if (spec.id === 'tesouro') {
    const vaultPedestal = makeBeveledBox(1.6, 0.75, 0.9, 0.03, CITY_COLORS.stoneLight, {
      offset: [0, 0.52, -1.2],
    });
    const goldPile = makeLatheProfile(
      [
        [0.56, 0.16],
        [0.36, 0.42],
        [0.14, 0.64],
      ],
      7,
      CITY_COLORS.goldBright,
      { offset: [-1.4, 0, -1.1] }
    );
    const goldPile2 = makeLatheProfile(
      [
        [0.46, 0.16],
        [0.3, 0.38],
        [0.12, 0.56],
      ],
      7,
      CITY_COLORS.gold,
      { offset: [1.4, 0, -1.1] }
    );
    baseParts.push(
      tagPart(vaultPedestal, 'tesouro_pedestal', 'stone_masonry', CITY_COLORS.stoneLight, {
        lockVertical: true,
      }),
      tagPart(goldPile, 'tesouro_gold_1', 'brushed_gold', CITY_COLORS.goldBright, {
        lockVertical: true,
      }),
      tagPart(goldPile2, 'tesouro_gold_2', 'brushed_gold', CITY_COLORS.gold, {
        lockVertical: true,
      })
    );
  } else if (spec.id === 'salao') {
    const warTable = makeBeveledBox(2.2, 0.82, 1.35, 0.03, CITY_COLORS.woodDark, {
      offset: [0, 0.56, -0.4],
    });
    const mapBoard = makeBeveledBox(1.8, 0.08, 1.0, 0.015, CITY_COLORS.grassBright, {
      offset: [0, 1.0, -0.4],
    });
    const bannerL = makeBeveledBox(0.55, 1.8, 0.08, 0.015, CITY_COLORS.roofRed, {
      offset: [-2.0, 1.6, -d * 0.5 + 0.32],
    });
    const bannerR = makeBeveledBox(0.55, 1.8, 0.08, 0.015, CITY_COLORS.roofRed, {
      offset: [2.0, 1.6, -d * 0.5 + 0.32],
    });
    baseParts.push(
      tagPart(warTable, 'salao_wartable', 'wood_planks', CITY_COLORS.woodDark, {
        lockVertical: true,
      }),
      tagPart(mapBoard, 'salao_mapboard', 'woven_cloth', CITY_COLORS.grassBright, {
        lockVertical: false,
      }),
      tagPart(bannerL, 'salao_standard_l', 'woven_cloth', CITY_COLORS.roofRed, {
        lockVertical: true,
      }),
      tagPart(bannerR, 'salao_standard_r', 'woven_cloth', CITY_COLORS.roofRed, {
        lockVertical: true,
      })
    );
  }

  // --- PART 2: CAPA (Front wall with doorway + Sloped Pitched Roof + Chimney + Corbels + Shop Signage) ---
  const capaParts: TaggedGeometryPart[] = [];
  const sideDoorW = (w - doorW) * 0.5;
  for (const [fIdx, sx] of [-doorW * 0.5 - sideDoorW * 0.5, doorW * 0.5 + sideDoorW * 0.5].entries()) {
    const fw = makeBeveledBox(sideDoorW, wallH, wallT, 0.025, spec.wallColor, {
      offset: [sx, wallH * 0.5, d * 0.5 - wallT * 0.5],
    });
    const frontPlinth = makeBeveledBox(sideDoorW + 0.08, 0.42, wallT + 0.14, 0.024, CITY_COLORS.stoneSlate, {
      offset: [sx, 0.21, d * 0.5 - wallT * 0.45],
    });
    const frontBelt = makeBeveledBox(sideDoorW + 0.04, 0.14, wallT + 0.08, 0.018, CITY_COLORS.woodDark, {
      offset: [sx, wallH * 0.52, d * 0.5 - wallT * 0.48],
    });
    capaParts.push(
      tagPart(fw, `${spec.id}_front_wall_${fIdx}`, 'plaster_wall', spec.wallColor, {
        lockVertical: true,
      }),
      tagPart(frontPlinth, `${spec.id}_front_plinth_${fIdx}`, 'mossy_cobble', CITY_COLORS.stoneSlate, {
        accentHex: CITY_COLORS.grass,
        lockVertical: true,
      }),
      tagPart(frontBelt, `${spec.id}_front_belt_${fIdx}`, 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      })
    );

    // Front corner stone quoins (4 alternating blocks per front vertical corner)
    const cornerDir = fIdx === 0 ? -1 : 1;
    for (let q = 0; q < 4; q++) {
      const isEven = q % 2 === 0;
      const qW = isEven ? 0.44 : 0.32;
      const qD = isEven ? 0.32 : 0.44;
      const qY = 0.62 + q * 0.62;
      const quoin = makeBeveledBox(qW, 0.34, qD, 0.022, CITY_COLORS.stoneLight, {
        offset: [
          cornerDir * (w * 0.5 - qW * 0.36),
          qY,
          d * 0.5 - qD * 0.36,
        ],
      });
      capaParts.push(
        tagPart(quoin, `${spec.id}_quoin_front_${fIdx}_${q}`, 'stone_masonry', CITY_COLORS.stoneLight, {
          lockVertical: true,
        })
      );
    }
  }
  const lintelH = wallH - doorH;
  const lintel = makeBeveledBox(doorW, lintelH, wallT, 0.02, spec.trimColor, {
    offset: [0, doorH + lintelH * 0.5, d * 0.5 - wallT * 0.5],
  });
  capaParts.push(
    tagPart(lintel, `${spec.id}_front_lintel`, 'timber_frame', spec.trimColor, {
      lockVertical: true,
    })
  );

  // Real sloped roof (hip for Grimório / Tesouro / Salão, gable for Forja / Mercado / Baú)
  const roofStyle: 'gable' | 'hip' =
    spec.id === 'grimorio' || spec.id === 'tesouro' || spec.id === 'salao' ? 'hip' : 'gable';
  const peakH = spec.tilesW >= 5 ? 1.55 : 1.28;
  const roofRes = makePitchedRoofGeometry(w, d, 0.28, peakH, 0.14, {
    style: roofStyle,
    roofHex: spec.roofColor,
    trimHex: spec.trimColor,
    gableHex: spec.wallColor,
  });
  roofRes.roofShell.translate(0, wallH, 0);
  roofRes.ridgeTrim.translate(0, wallH, 0);
  roofRes.gableFill.translate(0, wallH, 0);

  capaParts.push(
    tagPart(roofRes.roofShell, `${spec.id}_roof_shell`, 'roof_shingle', spec.roofColor, {
      lockVertical: false,
    }),
    tagPart(roofRes.ridgeTrim, `${spec.id}_roof_ridge`, 'timber_frame', spec.trimColor, {
      lockVertical: false,
    }),
    tagPart(roofRes.gableFill, `${spec.id}_roof_gable`, 'plaster_wall', spec.wallColor, {
      lockVertical: true,
    })
  );

  // Stone chimney stack with stepped crown cap breaking upper roof silhouette
  const chimX = spec.id === 'forja' ? 1.2 : -w * 0.24;
  const chimZ = -d * 0.24;
  const chimBaseY = wallH + peakH * 0.38;
  const chimStack = makeBeveledBox(0.58, 1.32, 0.58, 0.028, CITY_COLORS.stoneSlate, {
    offset: [chimX, chimBaseY + 0.66, chimZ],
  });
  const chimCap = makeBeveledBox(0.72, 0.16, 0.72, 0.022, CITY_COLORS.stoneLight, {
    offset: [chimX, chimBaseY + 1.36, chimZ],
  });
  capaParts.push(
    tagPart(chimStack, `${spec.id}_chimney_stack`, 'stone_masonry', CITY_COLORS.stoneSlate, {
      lockVertical: true,
    }),
    tagPart(chimCap, `${spec.id}_chimney_cap`, 'stone_masonry', CITY_COLORS.stoneLight, {
      lockVertical: true,
    })
  );

  // Eave support corbel brackets under front roof overhang
  for (const [cIdx, cx] of [-w * 0.34, -doorW * 0.55, doorW * 0.55, w * 0.34].entries()) {
    const corbel = makeBeveledBox(0.14, 0.28, 0.26, 0.016, CITY_COLORS.woodDark, {
      offset: [cx, wallH - 0.14, d * 0.5 + 0.08],
    });
    capaParts.push(
      tagPart(corbel, `${spec.id}_eave_corbel_${cIdx}`, 'timber_frame', CITY_COLORS.woodDark, {
        lockVertical: true,
      })
    );
  }

  const sign = makeBeveledBox(1.15, 0.42, 0.14, 0.02, CITY_COLORS.gold, {
    offset: [0, doorH + 0.35, d * 0.5 + 0.12],
  });
  capaParts.push(
    tagPart(sign, `${spec.id}_sign`, 'wood_planks', CITY_COLORS.gold, {
      landmarkKind: 'chest_crest',
      lockVertical: true,
    })
  );

  // --- PART 3: PORTA (Hinged animated door at front center) ---
  portaPivot.position.set(-doorW * 0.5, 0.16, d * 0.5 - wallT * 0.5);
  const doorSlab = makeBeveledBox(doorW - 0.08, doorH - 0.18, 0.14, 0.018, CITY_COLORS.wood, {
    offset: [doorW * 0.5 - 0.04, (doorH - 0.18) * 0.5, 0],
  });
  const handle = makeBeveledBox(0.14, 0.16, 0.22, 0.018, CITY_COLORS.goldBright, {
    offset: [doorW - 0.26, 1.0, 0],
  });
  const portaParts: TaggedGeometryPart[] = [
    tagPart(doorSlab, 'city_door_slab', 'wood_planks', CITY_COLORS.wood, {
      landmarkKind: 'door_front',
      lockVertical: true,
    }),
    tagPart(handle, 'city_door_handle', 'brushed_gold', CITY_COLORS.goldBright, {
      lockVertical: false,
    }),
  ];

  // Bake each structural sub-part cleanly with LRU pool reuse
  const baseBaked = bakeTaggedPartsAsset(baseParts, {
    finishMode,
    texelsPerMeter: 24,
    maxAtlasSize: 512,
    seed,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emissiveRuneHex: spec.id === 'forja' ? CITY_COLORS.ember : CITY_COLORS.goldBright,
    usePool: true,
    cacheKey: `city_house:${spec.id}:base`,
    inspectUvs: false,
  });
  for (const p of baseParts) p.geometry.dispose();

  const capaBaked = bakeTaggedPartsAsset(capaParts, {
    finishMode,
    texelsPerMeter: 24,
    maxAtlasSize: 512,
    seed: seed + 7,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emblemHex: CITY_COLORS.goldBright,
    usePool: true,
    cacheKey: `city_house:${spec.id}:capa`,
    inspectUvs: false,
  });
  for (const p of capaParts) p.geometry.dispose();

  const portaBaked = bakeTaggedPartsAsset(portaParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 13,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emblemHex: CITY_COLORS.goldBright,
    usePool: true,
    cacheKey: 'city_house:porta',
    inspectUvs: false,
  });
  for (const p of portaParts) p.geometry.dispose();

  const matBase = createPixelizerMaterialFromBaked(
    baseBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.72,
      smoothness: 0.2,
      useColorGrading: true,
    },
    sharedResources
  );
  const matCapa = createPixelizerMaterialFromBaked(
    capaBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: objectId + 1,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.72,
      smoothness: 0.22,
      useColorGrading: true,
    },
    sharedResources
  );
  const matDoor = createPixelizerMaterialFromBaked(
    portaBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: objectId + 2,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.72,
      smoothness: 0.25,
      useColorGrading: true,
    },
    sharedResources
  );
  const materials: PixelizerMaterial[] = [matBase, matCapa, matDoor];

  const baseMesh = new THREE.Mesh(baseBaked.geometry, matBase);
  baseMesh.name = `${spec.id}_BaseMesh`;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  tagPixelizer(baseMesh, px, root);
  baseGroup.add(baseMesh);

  const capaMesh = new THREE.Mesh(capaBaked.geometry, matCapa);
  capaMesh.name = `${spec.id}_CapaMesh`;
  capaMesh.castShadow = true;
  capaMesh.receiveShadow = true;
  tagPixelizer(capaMesh, px, root);
  capaGroup.add(capaMesh);

  const doorMesh = new THREE.Mesh(portaBaked.geometry, matDoor);
  doorMesh.name = `${spec.id}_PortaMesh`;
  doorMesh.castShadow = true;
  doorMesh.receiveShadow = true;
  tagPixelizer(doorMesh, px, root);
  portaPivot.add(doorMesh);

  root.userData.unwrapMetrics = capaBaked.unwrapMetrics;
  root.add(baseGroup, capaGroup, portaPivot);

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
  sharedResources?: PixelizerMaterialResources,
  options: CityBuildOptions = {}
): GeneratedStarterCity {
  const finishMode: FinishMode = options.finishMode ?? 'textured_ao';
  const seed = Math.floor(options.seed ?? 777);
  const aoStrength = options.aoStrength ?? 0.55;
  const normalStrength = options.normalStrength ?? 0.36;
  const isTextured = finishMode === 'textured_ao';

  const root = new THREE.Group();
  root.name = 'NWL_Cidade_Principal_Portais';
  const materials: PixelizerMaterial[] = [];
  const colliders: CityColliderBox[] = [];
  const px = 1;

  // 1. Base Island Ground & 1.5m Tile Plaza (27m x 27m)
  const sheet = isTextured
    ? synthesizeModularTilesetSheet(
        'starter_city',
        seed,
        Math.min(0.85, aoStrength * 0.7),
        normalStrength
      )
    : null;

  const groundParts: THREE.BufferGeometry[] = [];
  const pushGroundMapped = (geo: THREE.BufferGeometry, slotId: string) => {
    if (sheet) {
      const mapped = mapGeometryToSheetSlot(geo, sheet.slots[slotId] ?? sheet.slots.plaza_cobble);
      if (mapped !== geo) geo.dispose();
      groundParts.push(mapped);
    } else {
      groundParts.push(geo);
    }
  };

  // Void cliff skirt
  const cliff = prepareColoredPart(
    new THREE.BoxGeometry(26.4, 1.4, 26.4),
    isTextured ? '#968da2' : CITY_COLORS.stoneDark
  );
  cliff.translate(0, -1.2, 0);
  pushGroundMapped(cliff, 'wall_stone');

  // Tiled grass lawn cells around island so cobble grass texture repeats cleanly without stretch
  for (let gx = -4; gx <= 4; gx++) {
    for (let gz = -4; gz <= 4; gz++) {
      const grassTile = prepareColoredPart(
        new THREE.BoxGeometry(3.0, 0.5, 3.0),
        isTextured ? '#8db87c' : CITY_COLORS.grass
      );
      grassTile.translate(gx * 3.0, -0.26, gz * 3.0);
      pushGroundMapped(grassTile, 'floor_moss');
    }
  }

  // 1.5m plaza paving stones in grid
  for (let gx = -5; gx <= 5; gx++) {
    for (let gz = -5; gz <= 5; gz++) {
      const isRoad = Math.abs(gx) <= 1 || Math.abs(gz) <= 1;
      const inPlaza = Math.abs(gx) <= 3 && Math.abs(gz) <= 3;
      if (!isRoad && !inPlaza) continue;
      const alt = (gx + gz) & 1;
      const tile = makeBeveledBox(
        NWL_TILE - 0.06,
        0.08,
        NWL_TILE - 0.06,
        isTextured ? 0.015 : 0,
        isTextured ? '#ffffff' : alt === 0 ? CITY_COLORS.pavingA : CITY_COLORS.pavingB,
        { offset: [gx * NWL_TILE, 0.02, gz * NWL_TILE] }
      );
      pushGroundMapped(tile, alt === 0 ? 'plaza_cobble' : 'floor_a');
    }
  }

  const groundGeo = mergeColoredParts(groundParts);
  for (const g of groundParts) g.dispose();
  if (sheet) {
    computeGeometryTangents(groundGeo);
    if (aoStrength > 0.05) {
      bakeVertexAoAndCreases(groundGeo, { rays: 4, maxDist: 0.5, strength: aoStrength * 0.42 });
    }
  }

  const groundMat = new PixelizerMaterial(
    {
      pixelated: false,
      objectId: 0,
      outlineAlpha: 0,
      edgeBevelWeight: 0,
      baseColor: '#ffffff',
      albedoMap: sheet?.textures.albedoMap ?? null,
      normalMap: sheet?.textures.normalMap ?? null,
      normalScale: 0.65,
      useVertexTangents: Boolean(sheet),
      useColorGrading: false,
      smoothness: 0.08,
    },
    sharedResources
  );
  groundMat.vertexColors = true;
  materials.push(groundMat);
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.name = 'City_Ground_Grid_1.5m';
  groundMesh.receiveShadow = true;
  groundMesh.castShadow = false;
  tagPixelizer(groundMesh, 1, root);
  root.add(groundMesh);

  // 2. City Props (Fountain, Well, Walls/Gate, Lamps)
  const propsParts: TaggedGeometryPart[] = [];

  // Central Plaza Fountain at (-3.0, 0, 3.0) leaving hero spawn open
  const ftnBase = makeLatheProfile(
    [
      [1.65, 0],
      [1.6, 0.36],
      [1.42, 0.46],
      [1.22, 0.42],
      [1.15, 0.16],
    ],
    12,
    CITY_COLORS.stoneLight,
    { offset: [-3.0, 0, 3.0] }
  );
  const ftnWater = makeLatheProfile(
    [
      [1.16, 0.18],
      [1.16, 0.35],
    ],
    12,
    CITY_COLORS.portalCore,
    { offset: [-3.0, 0, 3.0] }
  );
  const ftnPillar = makeLatheProfile(
    [
      [0.42, 0.16],
      [0.26, 0.72],
      [0.52, 1.08],
      [0.2, 1.42],
    ],
    10,
    CITY_COLORS.stoneSlate,
    { offset: [-3.0, 0, 3.0] }
  );
  propsParts.push(
    tagPart(ftnBase, 'plaza_fountain_basin', 'stone_masonry', CITY_COLORS.stoneLight, {
      lockVertical: true,
    }),
    tagPart(ftnWater, 'plaza_fountain_water', 'water_pool', CITY_COLORS.portalCore, {
      lockVertical: false,
    }),
    tagPart(ftnPillar, 'plaza_fountain_spire', 'stone_masonry', CITY_COLORS.stoneSlate, {
      lockVertical: true,
    })
  );
  colliders.push({ minX: -4.4, maxX: -1.6, minZ: 1.6, maxZ: 4.4, tag: 'fountain' });

  // City Well at (3.2, 0, 3.2) with wooden posts and hipped shingle roof
  const wellRing = makeLatheProfile(
    [
      [0.78, 0],
      [0.72, 0.68],
      [0.55, 0.68],
    ],
    10,
    CITY_COLORS.stoneSlate,
    { offset: [3.2, 0, 3.2] }
  );
  const wellPostL = makeBeveledBox(0.14, 1.35, 0.14, 0.015, CITY_COLORS.woodDark, {
    offset: [2.62, 1.25, 3.2],
  });
  const wellPostR = makeBeveledBox(0.14, 1.35, 0.14, 0.015, CITY_COLORS.woodDark, {
    offset: [3.78, 1.25, 3.2],
  });
  const wellRoofRes = makePitchedRoofGeometry(1.5, 1.5, 0.14, 0.65, 0.1, {
    style: 'hip',
    roofHex: CITY_COLORS.roofRed,
    trimHex: CITY_COLORS.woodDark,
  });
  wellRoofRes.roofShell.translate(3.2, 1.85, 3.2);
  wellRoofRes.ridgeTrim.translate(3.2, 1.85, 3.2);
  wellRoofRes.gableFill.dispose();

  propsParts.push(
    tagPart(wellRing, 'plaza_well_ring', 'mossy_cobble', CITY_COLORS.stoneSlate, {
      lockVertical: true,
    }),
    tagPart(wellPostL, 'plaza_well_post_l', 'timber_frame', CITY_COLORS.woodDark, {
      lockVertical: true,
    }),
    tagPart(wellPostR, 'plaza_well_post_r', 'timber_frame', CITY_COLORS.woodDark, {
      lockVertical: true,
    }),
    tagPart(wellRoofRes.roofShell, 'plaza_well_roof', 'roof_shingle', CITY_COLORS.roofRed, {
      lockVertical: false,
    }),
    tagPart(wellRoofRes.ridgeTrim, 'plaza_well_cap', 'timber_frame', CITY_COLORS.woodDark, {
      lockVertical: false,
    })
  );
  colliders.push({ minX: 2.4, maxX: 4.0, minZ: 2.4, maxZ: 4.0, tag: 'well' });

  // Lamp posts around the main crossroad -> GPU InstancedMesh batch (single baked archetype)
  const lampPlacements: InstancePlacement[] = [
    { position: [-1.8, 0, -1.8] },
    { position: [1.8, 0, -1.8] },
    { position: [-1.8, 0, 5.2] },
    { position: [1.8, 0, 5.2] },
  ];
  const lampProtoParts: TaggedGeometryPart[] = [
    tagPart(
      makeLatheProfile(
        [
          [0.14, 0],
          [0.1, 0.5],
          [0.08, 2.05],
        ],
        6,
        CITY_COLORS.stoneDark
      ),
      'lamp_pole',
      'forged_steel',
      CITY_COLORS.stoneDark,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.38, 0.1, 0.38, 0.02, CITY_COLORS.stoneDark, { offset: [0, 2.45, 0] }),
      'lamp_cap',
      'forged_steel',
      CITY_COLORS.stoneDark,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.28, 0.34, 0.28, 0.03, CITY_COLORS.goldBright, { offset: [0, 2.24, 0] }),
      'lamp_glow',
      'runic_glow',
      CITY_COLORS.goldBright,
      { lockVertical: false }
    ),
  ];
  const lampBaked = bakeTaggedPartsAsset(lampProtoParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 13,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emissiveRuneHex: CITY_COLORS.goldBright,
    usePool: true,
    cacheKey: 'city:lamp_post_proto',
    inspectUvs: false,
  });
  for (const p of lampProtoParts) p.geometry.dispose();

  const lampInstMat = createPixelizerMaterialFromBaked(
    lampBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 31,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.7,
      smoothness: 0.25,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(lampInstMat);
  const lampInstanced = buildInstancedPropBatch({
    name: 'City_Lamp_Posts_Instanced',
    geometry: lampBaked.geometry,
    material: lampInstMat,
    placements: lampPlacements,
    pixelSize: px,
    gridReference: root,
    castShadow: true,
    receiveShadow: true,
  });
  root.add(lampInstanced);

  // Calibrated dynamic plaza lights (Portal arcane beacon + SpotLight + Forge glow)
  const portalPointLight = new THREE.PointLight('#249fde', 1.4, 9.5, 1.8);
  portalPointLight.position.set(0, 2.2, -8.8);
  const portalSpotTarget = new THREE.Object3D();
  portalSpotTarget.position.set(0, 0, -8.2);
  const portalSpotLight = new THREE.SpotLight('#249fde', 1.8, 12.0, Math.PI * 0.28, 0.35, 1.5);
  portalSpotLight.position.set(0, 4.4, -9.2);
  portalSpotLight.target = portalSpotTarget;
  const forgeWarmLight = new THREE.PointLight('#fa6a0a', 1.1, 8.0, 1.8);
  forgeWarmLight.position.set(-4.8, 2.2, -4.2);
  root.add(portalPointLight, portalSpotTarget, portalSpotLight, forgeWarmLight);

  // Southern City Gate Wall (facing entrance)
  for (const [gIdx, gx] of [-8.2, -5.2, 5.2, 8.2].entries()) {
    const wall = makeBeveledBox(3.0, 2.8, 0.7, 0.035, CITY_COLORS.stoneSlate, {
      offset: [gx, 1.4, 10.6],
    });
    const merlon = makeBeveledBox(0.84, 0.5, 0.82, 0.028, CITY_COLORS.stoneLight, {
      offset: [gx, 3.0, 10.6],
    });
    propsParts.push(
      tagPart(wall, `gate_wall_${gIdx}`, 'stone_masonry', CITY_COLORS.stoneSlate, {
        lockVertical: true,
      }),
      tagPart(merlon, `gate_merlon_${gIdx}`, 'stone_masonry', CITY_COLORS.stoneLight, {
        lockVertical: true,
      })
    );
    colliders.push({ minX: gx - 1.5, maxX: gx + 1.5, minZ: 10.1, maxZ: 11.1, tag: 'city_wall' });
  }

  const propsBaked = bakeTaggedPartsAsset(propsParts, {
    finishMode,
    texelsPerMeter: 24,
    maxAtlasSize: 512,
    seed: seed + 17,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emissiveRuneHex: CITY_COLORS.goldBright,
    usePool: true,
    cacheKey: 'city:plaza_props',
    inspectUvs: false,
  });
  for (const p of propsParts) p.geometry.dispose();

  const cityPropsMat = createPixelizerMaterialFromBaked(
    propsBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 30,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.72,
      smoothness: 0.22,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(cityPropsMat);
  const cityPropsMesh = new THREE.Mesh(propsBaked.geometry, cityPropsMat);
  cityPropsMesh.name = 'City_Plaza_Props';
  cityPropsMesh.castShadow = true;
  cityPropsMesh.receiveShadow = true;
  tagPixelizer(cityPropsMesh, px, root);
  root.add(cityPropsMesh);

  // 3. Portal das Profundezas (Northern focal point at 0, 0, -9.2)
  const portalPos = new THREE.Vector3(0, 0, -9.2);
  const portalArchParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(4.2, 0.32, 2.6, 0.035, CITY_COLORS.stoneSlate, { offset: [0, 0.16, -9.2] }),
      'portal_dais',
      'stone_masonry',
      CITY_COLORS.stoneSlate,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.65, 3.4, 0.65, 0.04, CITY_COLORS.roofPurple, { offset: [-1.35, 1.8, -9.2] }),
      'portal_pillar_l',
      'stone_masonry',
      CITY_COLORS.roofPurple,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.65, 3.4, 0.65, 0.04, CITY_COLORS.roofPurple, { offset: [1.35, 1.8, -9.2] }),
      'portal_pillar_r',
      'stone_masonry',
      CITY_COLORS.roofPurple,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(3.7, 0.72, 0.85, 0.045, CITY_COLORS.stoneLight, { offset: [0, 3.65, -9.2] }),
      'portal_arch_lintel',
      'stone_masonry',
      CITY_COLORS.stoneLight,
      { lockVertical: true }
    ),
    tagPart(
      makeBeveledBox(0.42, 0.48, 0.32, 0.07, CITY_COLORS.portalEdge, { offset: [0, 3.68, -8.75] }),
      'portal_keystone',
      'runic_glow',
      CITY_COLORS.portalEdge,
      { lockVertical: false }
    ),
  ];

  const archBaked = bakeTaggedPartsAsset(portalArchParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 29,
    aoRays: 4,
    aoStrength,
    normalStrength,
    emissiveRuneHex: CITY_COLORS.portalEdge,
    usePool: true,
    cacheKey: 'city:portal_arch',
    inspectUvs: false,
  });
  for (const p of portalArchParts) p.geometry.dispose();

  const portalArchMat = createPixelizerMaterialFromBaked(
    archBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 38,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      edgeHighlight: 0.36,
      edgeBevelWeight: 0.72,
      smoothness: 0.22,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(portalArchMat);
  const portalArchMesh = new THREE.Mesh(archBaked.geometry, portalArchMat);
  portalArchMesh.name = 'Portal_Profundezas_Arch';
  portalArchMesh.castShadow = true;
  portalArchMesh.receiveShadow = true;
  tagPixelizer(portalArchMesh, px, root);
  root.add(portalArchMesh);

  const portalCoreParts: TaggedGeometryPart[] = [
    tagPart(
      makeBeveledBox(1.15, 1.75, 0.34, 0.09, CITY_COLORS.portalCore),
      'portal_core_crystal',
      'runic_glow',
      CITY_COLORS.portalCore,
      { lockVertical: false }
    ),
    tagPart(
      makeBeveledBox(0.32, 2.2, 0.32, 0.04, CITY_COLORS.portalEdge),
      'portal_core_spindle',
      'runic_glow',
      CITY_COLORS.portalEdge,
      { lockVertical: false }
    ),
  ];
  const coreBaked = bakeTaggedPartsAsset(portalCoreParts, {
    finishMode,
    texelsPerMeter: 32,
    maxAtlasSize: 512,
    seed: seed + 41,
    aoRays: 4,
    aoStrength: aoStrength * 0.25,
    normalStrength,
    emissiveRuneHex: CITY_COLORS.portalCore,
    usePool: true,
    cacheKey: 'city:portal_core',
    inspectUvs: false,
  });
  for (const p of portalCoreParts) p.geometry.dispose();

  const portalCoreMat = createPixelizerMaterialFromBaked(
    coreBaked,
    {
      pixelated: true,
      pixelSize: px,
      objectId: 39,
      outlineColor: '#14101c',
      outlineAlpha: 1,
      emissionColor: '#ffffff',
      emissionIntensity: 1.45,
      edgeHighlight: 0.3,
      useColorGrading: true,
    },
    sharedResources
  );
  materials.push(portalCoreMat);
  const portalCore = new THREE.Mesh(coreBaked.geometry, portalCoreMat);
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
    const h = buildEnterableNwlHouse(hs, sharedResources, 41 + i * 3, {
      finishMode,
      seed: 401,
      aoStrength,
      normalStrength,
    });
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
    const instance = buildNwlNpc(
      np.id,
      {
        pixelSize: px,
        objectId: 70 + i,
        finishMode,
        seed: 202,
        aoStrength,
        normalStrength,
      },
      sharedResources
    );
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

  root.userData.unwrapMetrics = propsBaked.unwrapMetrics;
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
      root.traverse((obj) => {
        if (obj instanceof THREE.InstancedMesh) obj.dispose();
        if (obj instanceof THREE.Mesh) obj.geometry?.dispose();
      });
      disposeCityMaterials(materials);
    },
  };
}

