import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../PixelizerPipeline';
import { mergeColoredParts, prepareColoredPart } from './SdfVoxelPrimitives';

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
  objectId = 150
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
      emissionIntensity: 0.75,
      edgeHighlight: 0.22,
      edgeBevelWeight: 0.45,
      smoothness: 0.1,
      useColorGrading: false,
    },
    res
  );
  mat.vertexColors = true;
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
  } else if (id === 'projetil.orbe' || id === 'seta_fogo' || id === 'adaga_venenosa') {
    animKind = 'fly';
    const core = new THREE.OctahedronGeometry(0.20, 0);
    const tail = new THREE.ConeGeometry(0.14, 0.45, 5);
    tail.rotateX(-Math.PI * 0.5);
    tail.translate(0, 0, -0.28);
    const cMain =
      id === 'seta_fogo'
        ? '#ffd541'
        : id === 'adaga_venenosa'
        ? '#1a7a3e'
        : '#1a7a3e';
    const cTail = id === 'seta_fogo' ? '#fa6a0a' : '#24523b';
    parts.push(prepareColoredPart(core, cMain), prepareColoredPart(tail, cTail));
  } else if (id === 'nova_arcana' || id === 'grito_de_guerra') {
    animKind = 'expand';
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const seg = new THREE.BoxGeometry(0.65, 0.18, 0.22);
      seg.rotateY(-ang);
      seg.translate(Math.cos(ang) * 1.15, 0.18, Math.sin(ang) * 1.15);
      parts.push(prepareColoredPart(seg, i % 2 === 0 ? meta.elementColor : '#dae0ea'));
    }
  } else if (id === 'barreira' || id === 'egide_refletora') {
    animKind = 'spin';
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const shield = new THREE.BoxGeometry(0.58, 0.92, 0.12);
      shield.rotateY(-ang + Math.PI * 0.5);
      shield.translate(Math.cos(ang) * 1.05, 0.85, Math.sin(ang) * 1.05);
      parts.push(prepareColoredPart(shield, i % 2 === 0 ? meta.elementColor : '#dae0ea'));
    }
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
    const rock = new THREE.DodecahedronGeometry(0.58, 0);
    rock.translate(0, 0.6, 0);
    const crater = new THREE.CylinderGeometry(1.35, 1.45, 0.12, 8);
    crater.translate(0, 0.06, 0);
    parts.push(prepareColoredPart(rock, '#fa6a0a'), prepareColoredPart(crater, '#73172d'));
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
    // impact_spark
    animKind = 'expand';
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + 0.4;
      const sp = new THREE.OctahedronGeometry(0.14, 0);
      sp.translate(Math.cos(ang) * 0.35, 0.45, Math.sin(ang) * 0.35);
      parts.push(prepareColoredPart(sp, i % 2 === 0 ? '#ffd541' : '#fa6a0a'));
    }
  }

  const merged = mergeColoredParts(parts);
  const mat = createVfxMaterial(sharedResources, meta.elementColor, objectId);
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

  const updatePhase = (p01: number) => {
    const p = Math.max(0, Math.min(1, p01));
    if (animKind === 'expand') {
      const s = 0.4 + p * 1.15;
      mesh.scale.set(s, 1.0 - p * 0.45, s);
    } else if (animKind === 'spin') {
      mesh.rotation.y = p * Math.PI * 2;
    } else if (animKind === 'drop') {
      mesh.position.y = (1 - p) * 2.8;
    } else if (animKind === 'fly') {
      mesh.rotation.z = p * Math.PI * 2;
    }
  };

  return {
    id,
    meta,
    triangleCount: getTriCount(merged),
    root,
    materials: [mat],
    updatePhase,
    dispose: () => {
      merged.dispose();
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
