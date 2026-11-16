import * as THREE from 'three';
import structuralKnowledgeRaw from '../../data/structuralKnowledge.json';
import { PixelizerMaterial, type PixelizerMaterialResources } from '../PixelizerMaterial';
import { voxelizeObject3D, buildVoxelMeshGroup } from '../Voxelizer';
import {
  createSeededRng,
  makeTaperedCylinderY,
  mergeColoredParts,
  prepareColoredPart,
} from './SdfVoxelPrimitives';

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
}

export interface GeneratedPropResult {
  kind: PropKind;
  root: THREE.Group;
  materials: PixelizerMaterial[];
  recommendedSocket: 'hand_r' | 'hand_l' | 'floor';
  dimensions: [number, number, number];
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
  const rng = createSeededRng(options.seed ?? 1337);
  const [d1, d2, d3] = DEFAULT_PROP_COLORS[options.kind];
  const cPrimary = options.primaryColor ?? d1;
  const cSecondary = options.secondaryColor ?? d2;
  const cAccent = options.accentColor ?? d3;
  const parts: THREE.BufferGeometry[] = [];
  let recommendedSocket: 'hand_r' | 'hand_l' | 'floor' = 'floor';
  let isMetallic = false;

  const knowledge = structuralKnowledgeRaw;
  const tmpl = (knowledge.propTemplates as Record<string, { defaultLengthM?: number }>)[options.kind];
  const scaleVar = 0.92 + rng() * 0.16;

  switch (options.kind) {
    case 'sword': {
      recommendedSocket = 'hand_r';
      isMetallic = true;
      const len = (tmpl?.defaultLengthM ?? 1.05) * scaleVar;
      const bladeW = 0.075 + rng() * 0.035;
      // Blade runs along +Z to match UAL hand_r grip convention!
      const grip = new THREE.CylinderGeometry(0.022, 0.024, 0.22, 6);
      grip.rotateX(Math.PI * 0.5);
      grip.translate(0, 0, -0.02);
      parts.push(prepareColoredPart(grip, cSecondary));

      const pommel = new THREE.OctahedronGeometry(0.038, 0);
      pommel.translate(0, 0, -0.14);
      parts.push(prepareColoredPart(pommel, cAccent));

      const guard = new THREE.BoxGeometry(0.24 + rng() * 0.08, 0.045, 0.05);
      guard.translate(0, 0, 0.1);
      parts.push(prepareColoredPart(guard, cAccent));

      const blade = new THREE.BoxGeometry(bladeW, 0.024, len * 0.72);
      blade.translate(0, 0, 0.12 + len * 0.36);
      parts.push(prepareColoredPart(blade, cPrimary));

      const tip = new THREE.ConeGeometry(bladeW * 0.55, 0.14, 4);
      tip.rotateX(Math.PI * 0.5);
      tip.rotateZ(Math.PI * 0.25);
      tip.translate(0, 0, 0.12 + len * 0.72 + 0.06);
      parts.push(prepareColoredPart(tip, cPrimary));
      break;
    }

    case 'axe': {
      recommendedSocket = 'hand_r';
      isMetallic = true;
      const len = (tmpl?.defaultLengthM ?? 0.95) * scaleVar;
      const shaft = new THREE.CylinderGeometry(0.024, 0.028, len, 6);
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, 0, len * 0.35);
      parts.push(prepareColoredPart(shaft, cSecondary));

      const head = new THREE.BoxGeometry(0.28 + rng() * 0.08, 0.04, 0.22);
      head.translate(0.06, 0, len * 0.78);
      parts.push(prepareColoredPart(head, cPrimary));

      const edge = new THREE.BoxGeometry(0.06, 0.028, 0.28);
      edge.translate(0.2, 0, len * 0.78);
      parts.push(prepareColoredPart(edge, cAccent));
      break;
    }

    case 'shield': {
      recommendedSocket = 'hand_l';
      const diam = 0.64 * scaleVar;
      const body = new THREE.CylinderGeometry(diam * 0.5, diam * 0.44, 0.06, 8);
      body.rotateZ(Math.PI * 0.5);
      body.translate(0.08, 0.02, 0.04);
      parts.push(prepareColoredPart(body, cPrimary));

      const rim = new THREE.CylinderGeometry(diam * 0.54, diam * 0.5, 0.045, 8);
      rim.rotateZ(Math.PI * 0.5);
      rim.translate(0.065, 0.02, 0.04);
      parts.push(prepareColoredPart(rim, cSecondary));

      const boss = new THREE.OctahedronGeometry(0.09, 0);
      boss.translate(0.11, 0.02, 0.04);
      parts.push(prepareColoredPart(boss, cAccent));
      break;
    }

    case 'staff': {
      recommendedSocket = 'hand_r';
      const len = 1.62 * scaleVar;
      const shaft = new THREE.CylinderGeometry(0.024, 0.028, len, 6);
      shaft.rotateX(Math.PI * 0.5);
      shaft.translate(0, 0, len * 0.35);
      parts.push(prepareColoredPart(shaft, cPrimary));

      const ring = new THREE.TorusGeometry(0.085, 0.02, 5, 8);
      ring.translate(0, 0, len * 0.85 + 0.06);
      parts.push(prepareColoredPart(ring, cSecondary));

      const orb = new THREE.OctahedronGeometry(0.065, 0);
      orb.translate(0, 0, len * 0.85 + 0.06);
      parts.push(prepareColoredPart(orb, cAccent));
      break;
    }

    case 'torch': {
      recommendedSocket = 'hand_l';
      const handle = new THREE.CylinderGeometry(0.026, 0.02, 0.58, 6);
      handle.rotateX(Math.PI * 0.5);
      handle.translate(0, 0, 0.22);
      parts.push(prepareColoredPart(handle, cPrimary));

      const cup = new THREE.CylinderGeometry(0.065, 0.04, 0.08, 6);
      cup.rotateX(Math.PI * 0.5);
      cup.translate(0, 0, 0.52);
      parts.push(prepareColoredPart(cup, cSecondary));

      const flame = new THREE.ConeGeometry(0.06, 0.18, 5);
      flame.rotateX(Math.PI * 0.5);
      flame.translate(0, 0, 0.62);
      parts.push(prepareColoredPart(flame, cAccent));
      break;
    }

    case 'chest': {
      const w = 1.0 * scaleVar;
      const h = 0.72 * scaleVar;
      const d = 0.66 * scaleVar;
      const base = new THREE.BoxGeometry(w, h * 0.6, d);
      base.translate(0, h * 0.3, 0);
      parts.push(prepareColoredPart(base, cPrimary));

      const lid = new THREE.CylinderGeometry(d * 0.5, d * 0.5, w, 6, 1, false, 0, Math.PI);
      lid.rotateZ(Math.PI * 0.5);
      lid.translate(0, h * 0.6, 0);
      parts.push(prepareColoredPart(lid, cPrimary));

      for (const sx of [-w * 0.36, w * 0.36]) {
        const band = new THREE.BoxGeometry(0.07, h * 0.88, d + 0.04);
        band.translate(sx, h * 0.44, 0);
        parts.push(prepareColoredPart(band, cSecondary));
      }
      const lock = new THREE.BoxGeometry(0.14, 0.16, 0.06);
      lock.translate(0, h * 0.58, d * 0.5 + 0.02);
      parts.push(prepareColoredPart(lock, cAccent));
      break;
    }

    case 'barrel': {
      const r = 0.36 * scaleVar;
      const h = 0.94 * scaleVar;
      const body = makeTaperedCylinderY(r * 0.86, r * 0.86, h, 8, cPrimary);
      const belly = makeTaperedCylinderY(r, r * 0.92, h * 0.5, 8, cPrimary, [0, h * 0.25, 0]);
      parts.push(body, belly);
      for (const yFrac of [0.16, 0.82]) {
        const hoop = makeTaperedCylinderY(r * 1.02, r * 1.02, 0.06, 8, cSecondary, [0, h * yFrac, 0]);
        parts.push(hoop);
      }
      break;
    }

    case 'table': {
      const w = 1.75 * scaleVar;
      const h = 0.84 * scaleVar;
      const d = 0.96 * scaleVar;
      const top = new THREE.BoxGeometry(w, 0.1, d);
      top.translate(0, h - 0.05, 0);
      parts.push(prepareColoredPart(top, cPrimary));
      for (const lx of [-w * 0.42, w * 0.42]) {
        for (const lz of [-d * 0.38, d * 0.38]) {
          const leg = new THREE.BoxGeometry(0.12, h - 0.1, 0.12);
          leg.translate(lx, (h - 0.1) * 0.5, lz);
          parts.push(prepareColoredPart(leg, cSecondary));
        }
      }
      break;
    }

    case 'pillar': {
      const h = 3.2 * scaleVar;
      const base = new THREE.BoxGeometry(0.86, 0.32, 0.86);
      base.translate(0, 0.16, 0);
      parts.push(prepareColoredPart(base, cSecondary));

      const shaft = makeTaperedCylinderY(0.32, 0.28, h - 0.64, 8, cPrimary, [0, 0.32, 0]);
      parts.push(shaft);

      const cap = new THREE.BoxGeometry(0.92, 0.32, 0.92);
      cap.translate(0, h - 0.16, 0);
      parts.push(prepareColoredPart(cap, cAccent));
      break;
    }

    case 'crate': {
      const s = 0.9 * scaleVar;
      const box = new THREE.BoxGeometry(s, s, s);
      box.translate(0, s * 0.5, 0);
      parts.push(prepareColoredPart(box, cPrimary));
      const frame = new THREE.BoxGeometry(s * 1.05, s * 0.14, s * 1.05);
      const frameTop = frame.clone().translate(0, s - s * 0.07, 0);
      const frameBot = frame.translate(0, s * 0.07, 0);
      parts.push(prepareColoredPart(frameTop, cSecondary), prepareColoredPart(frameBot, cSecondary));
      break;
    }

    case 'tree': {
      const trunkH = (1.35 + rng() * 0.45) * scaleVar;
      const trunk = makeTaperedCylinderY(0.26, 0.16, trunkH, 6, cPrimary);
      parts.push(trunk);

      const clusterCount = 3;
      for (let i = 0; i < clusterCount; i++) {
        const cr = (0.85 - i * 0.16) * scaleVar;
        const cone = new THREE.ConeGeometry(cr, cr * 1.35, 7);
        cone.translate((rng() - 0.5) * 0.14, trunkH + i * cr * 0.72 + cr * 0.4, (rng() - 0.5) * 0.14);
        parts.push(prepareColoredPart(cone, i % 2 === 0 ? cSecondary : cAccent));
      }
      break;
    }
  }

  const mergedGeo = mergeColoredParts(parts);
  for (const p of parts) p.dispose();

  const root = new THREE.Group();
  root.name = `Prop_${options.kind}`;
  root.userData.recommendedSocket = recommendedSocket;

  const materials: PixelizerMaterial[] = [];
  const objId = options.objectId ?? 22;
  const px = options.pixelSize ?? 3;

  if (options.visualStyle === 'voxel') {
    const tmpMesh = new THREE.Mesh(mergedGeo, new THREE.MeshStandardMaterial({ vertexColors: true }));
    const voxRes = options.voxelResolution ?? (recommendedSocket === 'floor' ? 22 : 18);
    const grid = voxelizeObject3D(tmpMesh, {
      resolution: voxRes,
      preserveWorldScale: true,
      fillSolidInterior: true,
    });
    mergedGeo.dispose();
    const { group, material } = buildVoxelMeshGroup(grid, sharedResources, {
      objectId: objId,
      pixelSize: 1,
      workflow: isMetallic ? 'metallic' : 'specular',
      metallic: isMetallic ? 0.35 : 0.05,
    });
    root.add(group);
    materials.push(material);
  } else {
    const mat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: px,
        objectId: objId,
        outlineColor: '#12101a',
        outlineAlpha: 1.0,
        edgeHighlight: 0.38,
        edgeBevelWeight: 0.6,
        useColorGrading: true,
        diffuseVertexColorWeight: 1.0,
        workflow: isMetallic ? 'metallic' : 'specular',
        metallic: isMetallic ? 0.32 : 0.05,
        smoothness: isMetallic ? 0.45 : 0.18,
      },
      sharedResources
    );
    mat.vertexColors = true;
    const mesh = new THREE.Mesh(mergedGeo, mat);
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
  };
}
