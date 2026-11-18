import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
import { mergeColoredParts, prepareColoredPart } from './SdfVoxelPrimitives';
import type { VfxRecipe } from '../vfx/VfxRecipe';
import { createSimpleRecipe } from '../vfx/VfxTimelinePlayer';

export type NwlSpellVfxId =
  | 'projetil.flecha'
  | 'projetil.orbe'
  | 'projetil.virote'
  | 'seta_fogo'
  | 'adaga_venenosa'
  | 'investida'
  | 'barreira'
  | 'egide_refletora'
  | 'grito_de_guerra'
  | 'flecha_perfurante'
  | 'armadilha_de_gelo'
  | 'salto_sombrio'
  | 'nova_arcana'
  | 'prisao_gelo'
  | 'corrente_de_raios'
  | 'meteoro'
  | 'telegraph_circle'
  | 'telegraph_line'
  | 'telegraph_cone'
  | 'impact_spark';

export interface SpellMetaEntry {
  id: NwlSpellVfxId;
  labelPt: string;
  category: 'projectile' | 'knight' | 'archer' | 'mage' | 'telegraph' | 'impact';
  elementColor: string;
  durationSec: number;
}

export const NWL_SPELL_VFX_CATALOG: readonly SpellMetaEntry[] = [
  { id: 'projetil.flecha', labelPt: 'Projétil: Flecha', category: 'projectile', elementColor: '#f9a31b', durationSec: 0.9 },
  { id: 'projetil.orbe', labelPt: 'Projétil: Orbe Xamã', category: 'projectile', elementColor: '#1a7a3e', durationSec: 1.1 },
  { id: 'projetil.virote', labelPt: 'Projétil: Virote', category: 'projectile', elementColor: '#b3b9d1', durationSec: 0.85 },
  { id: 'seta_fogo', labelPt: 'Seta de Fogo', category: 'projectile', elementColor: '#fa6a0a', durationSec: 0.9 },
  { id: 'adaga_venenosa', labelPt: 'Adaga Venenosa', category: 'projectile', elementColor: '#1a7a3e', durationSec: 0.85 },
  { id: 'investida', labelPt: 'Investida', category: 'knight', elementColor: '#ffd541', durationSec: 0.45 },
  { id: 'barreira', labelPt: 'Barreira Sagrada', category: 'knight', elementColor: '#ffd541', durationSec: 1.2 },
  { id: 'egide_refletora', labelPt: 'Égide Refletora', category: 'knight', elementColor: '#249fde', durationSec: 1.4 },
  { id: 'grito_de_guerra', labelPt: 'Grito de Guerra', category: 'knight', elementColor: '#df3e23', durationSec: 0.7 },
  { id: 'flecha_perfurante', labelPt: 'Flecha Perfurante', category: 'archer', elementColor: '#249fde', durationSec: 0.8 },
  { id: 'armadilha_de_gelo', labelPt: 'Armadilha de Gelo', category: 'archer', elementColor: '#249fde', durationSec: 1.6 },
  { id: 'salto_sombrio', labelPt: 'Salto Sombrio', category: 'archer', elementColor: '#4a3052', durationSec: 0.55 },
  { id: 'nova_arcana', labelPt: 'Nova Arcana', category: 'mage', elementColor: '#249fde', durationSec: 0.65 },
  { id: 'prisao_gelo', labelPt: 'Prisão de Gelo', category: 'mage', elementColor: '#dae0ea', durationSec: 1.4 },
  { id: 'corrente_de_raios', labelPt: 'Corrente de Raios', category: 'mage', elementColor: '#ffd541', durationSec: 0.5 },
  { id: 'meteoro', labelPt: 'Meteoro', category: 'mage', elementColor: '#fa6a0a', durationSec: 1.1 },
  { id: 'telegraph_circle', labelPt: 'Aviso: Círculo', category: 'telegraph', elementColor: '#b4202a', durationSec: 0.9 },
  { id: 'telegraph_line', labelPt: 'Aviso: Linha', category: 'telegraph', elementColor: '#fa6a0a', durationSec: 0.9 },
  { id: 'telegraph_cone', labelPt: 'Aviso: Cone', category: 'telegraph', elementColor: '#df3e23', durationSec: 0.9 },
  { id: 'impact_spark', labelPt: 'Impacto: Faísca', category: 'impact', elementColor: '#ffd541', durationSec: 0.35 },
];

export interface GeneratedSpellVfxResult {
  id: NwlSpellVfxId;
  meta: SpellMetaEntry;
  triangleCount: number;
  root: THREE.Group;
  materials: PixelizerMaterial[];
  updatePhase: (progress01: number) => void;
  dispose: () => void;
}

function getTriCount(geo: THREE.BufferGeometry): number {
  if (geo.index) return Math.round(geo.index.count / 3);
  const pos = geo.getAttribute('position');
  return pos ? Math.round(pos.count / 3) : 0;
}

function createVfxMaterial(
  res: PixelizerMaterialResources | undefined,
  emissive: string,
  objectId = 150,
  vfxOpts?: {
    emissionIntensity?: number;
    fresnelPower?: number;
    dissolveThreshold?: number;
    uvScrollSpeed?: [number, number];
  }
): PixelizerMaterial {
  const mat = new PixelizerMaterial(
    {
      pixelated: true,
      pixelSize: 1,
      objectId,
      outlineColor: '#222736',
      outlineAlpha: 0.42,
      baseColor: '#ffffff',
      emissionColor: emissive,
      emissionIntensity: vfxOpts?.emissionIntensity ?? 0.85,
      emissiveVertexColorWeight: 0.9,
      edgeHighlight: 0.24,
      edgeBevelWeight: 0.45,
      smoothness: 0.12,
      useColorGrading: false,
    },
    res
  );
  mat.vertexColors = true;
  mat.setVfxParams({
    fresnelPower: vfxOpts?.fresnelPower ?? 1.8,
    dissolveThreshold: vfxOpts?.dissolveThreshold ?? 0.0,
    uvScrollSpeed: vfxOpts?.uvScrollSpeed ?? [0, 0],
  });
  return mat;
}

/**
 * Generates an autonomous flat-colored 3D pixelated Spell/Projectile/Telegraph VFX
 * adhering strictly to NWL rules (zero soft bloom, <=200 tris for projectiles).
 */
export function buildNwlSpellVfx(
  id: NwlSpellVfxId,
  sharedResources?: PixelizerMaterialResources,
  objectId = 150
): GeneratedSpellVfxResult {
  const meta =
    NWL_SPELL_VFX_CATALOG.find((m) => m.id === id) ?? NWL_SPELL_VFX_CATALOG[0];
  const parts: THREE.BufferGeometry[] = [];
  let animKind: 'fly' | 'expand' | 'drop' | 'spin' | 'static' = 'expand';
  let groundGeom: THREE.BufferGeometry | null = null;
  let groundAnimKind: 'crater' | 'counterSpin' | 'none' = 'none';
  let baseEmission = 0.85;
  let fresnelPower = 1.8;
  let dissolveTail = false;
  let uvScrollSpeed: [number, number] = [0, 0];

  if (id === 'projetil.flecha' || id === 'flecha_perfurante') {
    animKind = 'fly';
    const colTip = id === 'flecha_perfurante' ? '#249fde' : '#dae0ea';
    const shaft = new THREE.BoxGeometry(0.05, 0.05, 0.78);
    const tip = new THREE.ConeGeometry(0.08, 0.22, 4);
    tip.rotateX(Math.PI * 0.5);
    tip.translate(0, 0, 0.46);
    const fletch = new THREE.BoxGeometry(0.16, 0.03, 0.16);
    fletch.translate(0, 0, -0.34);
    parts.push(
      prepareColoredPart(shaft, '#73172d'),
      prepareColoredPart(tip, colTip),
      prepareColoredPart(fletch, meta.elementColor)
    );
  } else if (id === 'projetil.virote') {
    animKind = 'fly';
    const bolt = new THREE.BoxGeometry(0.08, 0.08, 0.50);
    const tip = new THREE.ConeGeometry(0.09, 0.18, 4);
    tip.rotateX(Math.PI * 0.5);
    tip.translate(0, 0, 0.32);
    parts.push(prepareColoredPart(bolt, '#6d758d'), prepareColoredPart(tip, '#dae0ea'));
  } else if (id === 'seta_fogo') {
    // <= 200 tris projectile budget: 8 + 24 + 64 + 32 + 12 = 140 tris
    animKind = 'fly';
    baseEmission = 1.05;
    fresnelPower = 2.0;

    const core = new THREE.OctahedronGeometry(0.16, 0);
    core.scale(0.85, 0.85, 1.85);
    core.translate(0, 0, 0.12);
    parts.push(prepareColoredPart(core, '#fff4bd'));

    for (let i = 0; i < 3; i++) {
      const ang = (i / 3) * Math.PI * 2;
      const fin = new THREE.ConeGeometry(0.095, 0.42, 4);
      fin.rotateX(-Math.PI * 0.5);
      fin.rotateZ(ang);
      fin.translate(Math.cos(ang) * 0.11, Math.sin(ang) * 0.11, -0.02);
      parts.push(prepareColoredPart(fin, '#fa6a0a'));
    }

    const collar = new THREE.TorusGeometry(0.19, 0.03, 4, 8);
    collar.translate(0, 0, -0.06);
    parts.push(prepareColoredPart(collar, '#ffd541'));

    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + 0.4;
      const shard = new THREE.OctahedronGeometry(0.052, 0);
      shard.translate(Math.cos(ang) * 0.22, Math.sin(ang) * 0.22, -0.06);
      parts.push(prepareColoredPart(shard, '#ff9d2e'));
    }

    const tail = new THREE.ConeGeometry(0.12, 0.48, 6);
    tail.rotateX(-Math.PI * 0.5);
    tail.translate(0, 0, -0.34);
    parts.push(prepareColoredPart(tail, '#b4202a'));
  } else if (id === 'projetil.orbe' || id === 'adaga_venenosa') {
    animKind = 'fly';
    const core = new THREE.OctahedronGeometry(0.20, 0);
    const tail = new THREE.ConeGeometry(0.14, 0.45, 5);
    tail.rotateX(-Math.PI * 0.5);
    tail.translate(0, 0, -0.28);
    const cMain = '#1a7a3e';
    const cTail = '#24523b';
    parts.push(prepareColoredPart(core, cMain), prepareColoredPart(tail, cTail));
  } else if (id === 'nova_arcana' || id === 'grito_de_guerra') {
    animKind = 'expand';
    baseEmission = 0.95;
    fresnelPower = 2.2;
    dissolveTail = true;
    const runeRing = new THREE.TorusGeometry(1.15, 0.048, 4, 14);
    runeRing.rotateX(Math.PI * 0.5);
    runeRing.translate(0, 0.22, 0);
    parts.push(prepareColoredPart(runeRing, meta.elementColor));
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const seg = new THREE.BoxGeometry(0.62, 0.16, 0.20);
      seg.rotateY(-ang);
      seg.translate(Math.cos(ang) * 1.15, 0.18, Math.sin(ang) * 1.15);
      const crystal = new THREE.OctahedronGeometry(0.11, 0);
      crystal.translate(Math.cos(ang) * 1.18, 0.36, Math.sin(ang) * 1.18);
      parts.push(
        prepareColoredPart(seg, i % 2 === 0 ? meta.elementColor : '#dae0ea'),
        prepareColoredPart(crystal, '#fff3b8')
      );
    }
  } else if (id === 'barreira') {
    animKind = 'spin';
    groundAnimKind = 'counterSpin';
    baseEmission = 0.95;
    fresnelPower = 2.4;
    uvScrollSpeed = [0.25, 0.15];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const cx = Math.cos(ang) * 1.05;
      const cz = Math.sin(ang) * 1.05;
      const shield = new THREE.BoxGeometry(0.54, 0.82, 0.09);
      shield.rotateY(-ang + Math.PI * 0.5);
      shield.translate(cx, 0.84, cz);
      const topCap = new THREE.ConeGeometry(0.24, 0.22, 4);
      topCap.rotateY(-ang + Math.PI * 0.25);
      topCap.translate(cx, 1.36, cz);
      parts.push(
        prepareColoredPart(shield, i % 2 === 0 ? '#ffd541' : '#dae0ea'),
        prepareColoredPart(topCap, '#fff4bd')
      );

      const midAng = ang + Math.PI / 6;
      const pylon = new THREE.OctahedronGeometry(0.11, 0);
      pylon.scale(0.85, 1.65, 0.85);
      pylon.translate(Math.cos(midAng) * 1.08, 0.88, Math.sin(midAng) * 1.08);
      parts.push(prepareColoredPart(pylon, '#fff6c8'));
    }
    const gParts: THREE.BufferGeometry[] = [];
    const upperRing = new THREE.TorusGeometry(1.06, 0.034, 4, 12);
    upperRing.rotateX(Math.PI * 0.5);
    upperRing.translate(0, 1.32, 0);
    const lowerRing = new THREE.TorusGeometry(1.06, 0.034, 4, 12);
    lowerRing.rotateX(Math.PI * 0.5);
    lowerRing.translate(0, 0.34, 0);
    const groundRune = new THREE.CylinderGeometry(1.18, 1.24, 0.03, 12);
    groundRune.translate(0, 0.02, 0);
    gParts.push(
      prepareColoredPart(upperRing, '#fff3b8'),
      prepareColoredPart(lowerRing, '#ffd541'),
      prepareColoredPart(groundRune, '#b88418')
    );
    groundGeom = mergeColoredParts(gParts);
  } else if (id === 'egide_refletora') {
    animKind = 'spin';
    groundAnimKind = 'counterSpin';
    baseEmission = 0.98;
    fresnelPower = 2.6;
    uvScrollSpeed = [0.3, -0.2];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const cx = Math.cos(ang) * 1.02;
      const cz = Math.sin(ang) * 1.02;
      const kite = new THREE.OctahedronGeometry(0.32, 0);
      kite.scale(0.75, 1.55, 0.24);
      kite.rotateY(-ang + Math.PI * 0.5);
      kite.translate(cx, 0.86, cz);
      const innerPrism = new THREE.OctahedronGeometry(0.15, 0);
      innerPrism.scale(0.65, 1.4, 0.26);
      innerPrism.rotateY(-ang + Math.PI * 0.5);
      innerPrism.translate(cx * 1.04, 0.86, cz * 1.04);
      parts.push(
        prepareColoredPart(kite, i % 2 === 0 ? '#249fde' : '#a8ebff'),
        prepareColoredPart(innerPrism, '#ffffff')
      );
    }
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + 0.39;
      const node = new THREE.OctahedronGeometry(0.12, 0);
      node.translate(Math.cos(ang) * 1.14, 1.38, Math.sin(ang) * 1.14);
      parts.push(prepareColoredPart(node, '#ffd541'));
    }
    const gParts: THREE.BufferGeometry[] = [];
    const gyroA = new THREE.TorusGeometry(1.10, 0.032, 4, 12);
    gyroA.rotateX(Math.PI * 0.5 + 0.28);
    gyroA.translate(0, 0.86, 0);
    const gyroB = new THREE.TorusGeometry(1.10, 0.032, 4, 12);
    gyroB.rotateX(Math.PI * 0.5 - 0.28);
    gyroB.rotateZ(0.24);
    gyroB.translate(0, 0.86, 0);
    const groundRune = new THREE.CylinderGeometry(1.18, 1.24, 0.03, 12);
    groundRune.translate(0, 0.02, 0);
    gParts.push(
      prepareColoredPart(gyroA, '#249fde'),
      prepareColoredPart(gyroB, '#a8ebff'),
      prepareColoredPart(groundRune, '#185b8a')
    );
    groundGeom = mergeColoredParts(gParts);
  } else if (id === 'prisao_gelo' || id === 'armadilha_de_gelo') {
    animKind = 'spin';
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const shard = new THREE.ConeGeometry(0.18, id === 'prisao_gelo' ? 1.25 : 0.65, 4);
      shard.translate(Math.cos(ang) * 0.72, id === 'prisao_gelo' ? 0.62 : 0.32, Math.sin(ang) * 0.72);
      parts.push(prepareColoredPart(shard, i % 2 === 0 ? '#249fde' : '#dae0ea'));
    }
  } else if (id === 'corrente_de_raios') {
    animKind = 'expand';
    for (let i = 0; i < 4; i++) {
      const bolt = new THREE.BoxGeometry(0.16, 0.16, 0.88);
      bolt.rotateY(i % 2 === 0 ? 0.45 : -0.45);
      bolt.translate((i % 2 === 0 ? 0.18 : -0.18), 0.75, i * 0.72);
      parts.push(prepareColoredPart(bolt, i % 2 === 0 ? '#ffd541' : '#dae0ea'));
    }
  } else if (id === 'meteoro') {
    animKind = 'drop';
    groundAnimKind = 'crater';
    baseEmission = 1.05;
    fresnelPower = 2.2;
    dissolveTail = true;

    // Jagged molten inner core
    const moltenCore = new THREE.IcosahedronGeometry(0.42, 1);
    const corePos = moltenCore.getAttribute('position');
    for (let i = 0; i < corePos.count; i++) {
      const x = corePos.getX(i);
      const y = corePos.getY(i);
      const z = corePos.getZ(i);
      const jag = 1.0 + 0.16 * Math.sin(x * 9.3 + y * 7.1) * Math.cos(z * 8.7 - x * 4.2);
      corePos.setXYZ(i, x * jag, y * jag + 0.62, z * jag);
    }
    moltenCore.computeVertexNormals();
    parts.push(prepareColoredPart(moltenCore, '#fff0a3'));

    // Radiating magma spikes bursting through crust seams
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 + 0.3;
      const spike = new THREE.ConeGeometry(0.15, 0.46, 4);
      spike.rotateZ(-0.95);
      spike.rotateY(ang);
      spike.translate(Math.cos(ang) * 0.34, 0.56 + (i % 2) * 0.12, Math.sin(ang) * 0.34);
      parts.push(prepareColoredPart(spike, '#ff7c1a'));
    }

    // Faceted obsidian crust plates leaving glowing magma fissures between them
    const crustDirs: Array<[number, number, number, string]> = [
      [0.36, 0.72, 0.24, '#1b1623'],
      [-0.38, 0.68, 0.20, '#261e31'],
      [0.18, 0.84, -0.34, '#1b1623'],
      [-0.22, 0.52, -0.36, '#2a2236'],
      [0.02, 0.40, 0.40, '#1e1928'],
      [-0.08, 0.94, 0.04, '#241c2e'],
    ];
    crustDirs.forEach(([ox, oy, oz, col], idx) => {
      const plate = new THREE.CylinderGeometry(0.18, 0.27, 0.13, 5);
      plate.rotateX((idx - 2.5) * 0.52);
      plate.rotateZ((idx % 2 === 0 ? 1 : -1) * 0.68);
      plate.translate(ox, oy, oz);
      parts.push(prepareColoredPart(plate, col));
    });

    // Trailing fiery crown fins above falling meteor
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const fin = new THREE.ConeGeometry(0.12, 0.56, 4);
      fin.rotateZ((i % 2 === 0 ? 1 : -1) * 0.14);
      fin.translate(Math.cos(ang) * 0.24, 1.12, Math.sin(ang) * 0.24);
      parts.push(prepareColoredPart(fin, i % 2 === 0 ? '#fa6a0a' : '#ffd541'));
    }

    // Ground scorch crater + shockwave rune ring + emissive inner cracks
    const groundParts: THREE.BufferGeometry[] = [];
    const craterRim = new THREE.CylinderGeometry(1.42, 1.54, 0.08, 12);
    craterRim.translate(0, 0.04, 0);
    const outerRuneRing = new THREE.TorusGeometry(1.16, 0.045, 4, 14);
    outerRuneRing.rotateX(Math.PI * 0.5);
    outerRuneRing.translate(0, 0.08, 0);
    const innerMagmaRing = new THREE.TorusGeometry(0.68, 0.036, 4, 12);
    innerMagmaRing.rotateX(Math.PI * 0.5);
    innerMagmaRing.translate(0, 0.07, 0);
    groundParts.push(
      prepareColoredPart(craterRim, '#261722'),
      prepareColoredPart(outerRuneRing, '#ffd541'),
      prepareColoredPart(innerMagmaRing, '#fa6a0a')
    );

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const crack = new THREE.BoxGeometry(0.075, 0.045, 1.08);
      crack.rotateY(-ang);
      crack.translate(Math.cos(ang) * 0.62, 0.065, Math.sin(ang) * 0.62);
      const glyph = new THREE.ConeGeometry(0.11, 0.05, 3);
      glyph.rotateY(-ang);
      glyph.translate(Math.cos(ang) * 1.28, 0.08, Math.sin(ang) * 1.28);
      groundParts.push(
        prepareColoredPart(crack, i % 2 === 0 ? '#ffe27a' : '#ff7c1a'),
        prepareColoredPart(glyph, '#ffd541')
      );
    }
    groundGeom = mergeColoredParts(groundParts);
  } else if (id === 'investida' || id === 'salto_sombrio') {
    animKind = 'fly';
    for (let i = 0; i < 3; i++) {
      const chev = new THREE.BoxGeometry(0.85 - i * 0.18, 0.18, 0.24);
      chev.translate(0, 0.65, -i * 0.55);
      parts.push(prepareColoredPart(chev, i === 0 ? meta.elementColor : '#4a3052'));
    }
  } else if (id === 'telegraph_circle') {
    animKind = 'static';
    const ring = new THREE.CylinderGeometry(1.4, 1.4, 0.06, 12);
    ring.translate(0, 0.04, 0);
    const inner = new THREE.CylinderGeometry(1.1, 1.1, 0.08, 12);
    inner.translate(0, 0.05, 0);
    parts.push(prepareColoredPart(ring, '#b4202a'), prepareColoredPart(inner, '#fa6a0a'));
  } else if (id === 'telegraph_line') {
    animKind = 'static';
    const bar = new THREE.BoxGeometry(0.85, 0.06, 4.2);
    bar.translate(0, 0.04, 2.1);
    parts.push(prepareColoredPart(bar, '#fa6a0a'));
  } else if (id === 'telegraph_cone') {
    animKind = 'static';
    const cone = new THREE.BoxGeometry(1.8, 0.06, 2.4);
    cone.translate(0, 0.04, 1.4);
    parts.push(prepareColoredPart(cone, '#df3e23'));
  } else {
    // impact_spark (layered crystal shockwave burst)
    animKind = 'expand';
    baseEmission = 1.05;
    fresnelPower = 2.0;
    dissolveTail = true;

    const starA = new THREE.OctahedronGeometry(0.18, 0);
    starA.translate(0, 0.45, 0);
    const starB = new THREE.OctahedronGeometry(0.16, 0);
    starB.rotateY(Math.PI * 0.25);
    starB.translate(0, 0.45, 0);
    const shockRing = new THREE.TorusGeometry(0.44, 0.038, 4, 12);
    shockRing.rotateX(Math.PI * 0.5);
    shockRing.translate(0, 0.42, 0);
    parts.push(
      prepareColoredPart(starA, '#fff4bd'),
      prepareColoredPart(starB, '#ffd541'),
      prepareColoredPart(shockRing, '#fa6a0a')
    );

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + 0.25;
      const spike = new THREE.ConeGeometry(0.075, 0.40, 4);
      spike.rotateZ(-Math.PI * 0.5);
      spike.rotateY(-ang);
      spike.translate(Math.cos(ang) * 0.36, 0.45, Math.sin(ang) * 0.36);
      const sp = new THREE.OctahedronGeometry(0.09, 0);
      sp.translate(Math.cos(ang) * 0.52, 0.52, Math.sin(ang) * 0.52);
      parts.push(
        prepareColoredPart(spike, '#ffd541'),
        prepareColoredPart(sp, i % 2 === 0 ? '#fff4bd' : '#ff9d2e')
      );
    }
  }

  const merged = mergeColoredParts(parts);
  const mat = createVfxMaterial(sharedResources, meta.elementColor, objectId, {
    emissionIntensity: baseEmission,
    fresnelPower,
    uvScrollSpeed,
  });
  const mesh = new THREE.Mesh(merged, mat);
  mesh.name = `VFX_${id}`;
  mesh.castShadow = false;
  mesh.userData.pixelizer = {
    snap: {
      snapPosition: true,
      alignPixelGrid: true,
      alignmentPixelSize: 2,
      angleSnapMode: 'none',
      angleResolutionDeg: 45,
    },
    gridReference: mesh,
  } satisfies PixelizerObjectAttachment;

  const root = new THREE.Group();
  root.name = `SpellVfx_${id}`;
  root.add(mesh);

  let groundMesh: THREE.Mesh | null = null;
  if (groundGeom) {
    groundMesh = new THREE.Mesh(groundGeom, mat);
    groundMesh.name = `VFX_${id}_ground`;
    groundMesh.castShadow = false;
    root.add(groundMesh);
  }

  const updatePhase = (p01: number) => {
    const p = Math.max(0, Math.min(1, p01));
    const pulse = 0.85 + Math.sin(p * Math.PI * 6) * 0.24;
    let emission = baseEmission * pulse;
    if (id === 'meteoro' && p > 0.68) {
      emission += 0.55 * Math.sin(((p - 0.68) / 0.32) * Math.PI);
    }
    mat.options.emissionIntensity = emission;
    mat.uniforms.uEmissionIntensity.value = emission;
    const dissolve = dissolveTail && p > 0.78 ? ((p - 0.78) / 0.22) * 0.55 : 0.0;
    mat.setVfxParams({
      fresnelPower,
      dissolveThreshold: dissolve,
      uvScrollSpeed,
      time: p,
    });

    if (animKind === 'expand') {
      const s = 0.4 + p * 1.15;
      mesh.scale.set(s, 1.0 - p * 0.45, s);
    } else if (animKind === 'spin') {
      mesh.rotation.y = p * Math.PI * 2;
      if (groundMesh && groundAnimKind === 'counterSpin') {
        groundMesh.rotation.y = -p * Math.PI * 2;
      }
    } else if (animKind === 'drop') {
      mesh.position.y = (1 - p) * 2.8;
      mesh.rotation.y = p * Math.PI * 1.5;
      if (groundMesh && groundAnimKind === 'crater') {
        const craterScale = p < 0.7 ? 0.35 + p * 0.25 : 0.525 + ((p - 0.7) / 0.3) * 0.65;
        groundMesh.scale.set(craterScale, 1, craterScale);
        groundMesh.rotation.y = -p * 0.6;
      }
    } else if (animKind === 'fly') {
      mesh.rotation.z = p * Math.PI * 2;
    } else if (animKind === 'static') {
      const sPulse = 0.88 + Math.sin(p * Math.PI * 4) * 0.12;
      mesh.scale.set(sPulse, 1, sPulse);
    }
  };

  return {
    id,
    meta,
    triangleCount: getTriCount(merged) + (groundGeom ? getTriCount(groundGeom) : 0),
    root,
    materials: [mat],
    updatePhase,
    dispose: () => {
      merged.dispose();
      groundGeom?.dispose();
      mat.dispose();
    },
  };
}

/**
 * Builds a complete visual showcase stage containing representative Spell VFX,
 * projectiles, & ground telegraphs arranged cleanly on a dark stone grid.
 */
export function buildSpellVfxShowcase(
  sharedResources?: PixelizerMaterialResources
): {
  root: THREE.Group;
  vfxItems: GeneratedSpellVfxResult[];
  materials: PixelizerMaterial[];
  update: (time: number) => void;
  dispose: () => void;
} {
  const root = new THREE.Group();
  root.name = 'NWL_Spell_VFX_Showcase';
  const materials: PixelizerMaterial[] = [];
  const vfxItems: GeneratedSpellVfxResult[] = [];

  const featured: NwlSpellVfxId[] = [
    'seta_fogo',
    'nova_arcana',
    'prisao_gelo',
    'corrente_de_raios',
    'meteoro',
    'barreira',
    'armadilha_de_gelo',
    'telegraph_circle',
    'impact_spark',
  ];

  featured.forEach((id, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const vfx = buildNwlSpellVfx(id, sharedResources, 160 + idx);
    vfx.root.position.set((col - 1) * 3.0, 0.4, (row - 1) * 3.0);
    root.add(vfx.root);
    vfxItems.push(vfx);
    materials.push(...vfx.materials);
  });

  const update = (time: number) => {
    vfxItems.forEach((v, idx) => {
      const p = (time * 0.8 + idx * 0.14) % 1;
      v.updatePhase(p);
    });
  };

  return {
    root,
    vfxItems,
    materials,
    update,
    dispose: () => {
      for (const v of vfxItems) v.dispose();
    },
  };
}

function getElementParticlePalette(meta: SpellMetaEntry): {
  colorHex: string;
  midColor: string;
  endColor: string;
} {
  if (meta.id === 'meteoro' || meta.id === 'seta_fogo' || meta.id === 'grito_de_guerra') {
    return { colorHex: '#fff4cc', midColor: '#fa6a0a', endColor: '#361822' };
  }
  if (meta.id === 'impact_spark' || meta.id === 'barreira' || meta.id === 'corrente_de_raios' || meta.id === 'investida') {
    return { colorHex: '#fff8d6', midColor: '#ffd541', endColor: '#6b3e14' };
  }
  if (meta.id === 'egide_refletora' || meta.id === 'nova_arcana' || meta.id === 'prisao_gelo' || meta.id === 'armadilha_de_gelo' || meta.id === 'flecha_perfurante') {
    return { colorHex: '#e6fbff', midColor: '#249fde', endColor: '#192f4d' };
  }
  if (meta.id === 'projetil.orbe' || meta.id === 'adaga_venenosa') {
    return { colorHex: '#d4ffe0', midColor: '#1a7a3e', endColor: '#14291d' };
  }
  if (meta.id === 'salto_sombrio') {
    return { colorHex: '#d8b4ff', midColor: '#4a3052', endColor: '#16111c' };
  }
  return { colorHex: '#fff4d6', midColor: meta.elementColor, endColor: '#282230' };
}

function buildDefaultRecipe(meta: SpellMetaEntry): VfxRecipe {
  const isProjectile = meta.category === 'projectile' || meta.id === 'seta_fogo' || meta.id === 'adaga_venenosa' || meta.id === 'flecha_perfurante';
  const isTelegraph = meta.category === 'telegraph';
  const pal = getElementParticlePalette(meta);

  if (isTelegraph) {
    return createSimpleRecipe(meta.id, [
      { name: 'telegraph', durationSec: meta.durationSec, lightColor: meta.elementColor, lightIntensity: 0.8, lightDistance: 3.5 },
    ]);
  }
  if (isProjectile) {
    return createSimpleRecipe(meta.id, [
      { name: 'cast', durationSec: 0.08, lightColor: meta.elementColor, lightIntensity: 1.2, lightDistance: 4.0, events: [{ atProgress: 0, audioCue: `cast_${meta.id}` }] },
      { name: 'flight', durationSec: Math.max(0.2, meta.durationSec - 0.18) },
      {
        name: 'impact',
        durationSec: 0.1,
        lightColor: meta.elementColor,
        lightIntensity: 1.8,
        lightDistance: 5.0,
        events: [
          {
            atProgress: 0,
            shake: 0.14,
            particles: {
              count: 14,
              colorHex: pal.colorHex,
              midColor: pal.midColor,
              endColor: pal.endColor,
              startScale: 1.15,
              endScale: 0.0,
              speedMin: 2.0,
              speedMax: 5.2,
              lifeSec: 0.38,
              sizeMin: 0.06,
              sizeMax: 0.13,
            },
            audioCue: `hit_${meta.id}`,
          },
        ],
      },
    ]);
  }
  if (meta.id === 'meteoro') {
    return createSimpleRecipe(meta.id, [
      { name: 'telegraph', durationSec: 0.35, lightColor: '#b4202a', lightIntensity: 1.0, lightDistance: 5.0 },
      {
        name: 'flight',
        durationSec: 0.45,
        lightColor: meta.elementColor,
        lightIntensity: 1.8,
        lightDistance: 6.0,
        events: [
          {
            atProgress: 0.35,
            particles: {
              count: 12,
              colorHex: '#fff4cc',
              midColor: '#fa6a0a',
              endColor: '#361822',
              startScale: 1.0,
              endScale: 0.0,
              speedMin: 1.4,
              speedMax: 3.6,
              lifeSec: 0.35,
              sizeMin: 0.06,
              sizeMax: 0.12,
              gravity: -1.5,
            },
          },
        ],
      },
      {
        name: 'impact',
        durationSec: 0.15,
        lightColor: meta.elementColor,
        lightIntensity: 2.8,
        lightDistance: 7.5,
        events: [
          {
            atProgress: 0,
            shake: 0.34,
            hitStopSec: 0.045,
            particles: {
              count: 34,
              colorHex: '#fff7d1',
              midColor: '#fa6a0a',
              endColor: '#2d1620',
              startScale: 1.35,
              endScale: 0.0,
              speedMin: 2.5,
              speedMax: 7.2,
              lifeSec: 0.58,
              sizeMin: 0.08,
              sizeMax: 0.19,
            },
            audioCue: 'impact_meteoro',
          },
        ],
      },
      {
        name: 'linger',
        durationSec: 0.25,
        events: [
          {
            atProgress: 0.1,
            particles: {
              count: 10,
              colorHex: '#fa6a0a',
              endColor: '#261822',
              startScale: 0.9,
              endScale: 0.0,
              speedMin: 0.8,
              speedMax: 2.2,
              lifeSec: 0.45,
              sizeMin: 0.05,
              sizeMax: 0.11,
              gravity: 1.6,
            },
          },
        ],
      },
    ]);
  }
  return createSimpleRecipe(meta.id, [
    { name: 'cast', durationSec: 0.1, lightColor: meta.elementColor, lightIntensity: 1.4, lightDistance: 4.5 },
    {
      name: 'impact',
      durationSec: Math.max(0.2, meta.durationSec - 0.25),
      lightColor: meta.elementColor,
      lightIntensity: 1.9,
      lightDistance: 5.5,
      events: [
        {
          atProgress: 0.1,
          shake: 0.16,
          particles: {
            count: 16,
            colorHex: pal.colorHex,
            midColor: pal.midColor,
            endColor: pal.endColor,
            startScale: 1.15,
            endScale: 0.0,
            speedMin: 1.8,
            speedMax: 4.8,
            lifeSec: 0.42,
            sizeMin: 0.06,
            sizeMax: 0.14,
          },
          audioCue: `cast_${meta.id}`,
        },
      ],
    },
    { name: 'linger', durationSec: 0.15 },
  ]);
}

export const NWL_SPELL_RECIPES: Record<NwlSpellVfxId, VfxRecipe> = Object.fromEntries(
  NWL_SPELL_VFX_CATALOG.map((meta) => [meta.id, buildDefaultRecipe(meta)])
) as Record<NwlSpellVfxId, VfxRecipe>;

export function getSpellVfxRecipe(id: NwlSpellVfxId): VfxRecipe {
  return NWL_SPELL_RECIPES[id];
}
