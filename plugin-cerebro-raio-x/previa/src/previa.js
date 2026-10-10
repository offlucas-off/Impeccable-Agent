// Prévia do "Cérebro em raio X": grafo real do cofre dentro de um córtex procedural.
// Notas = neurônios, [[links]] = sinapses. No plugin, o grafo vem do metadataCache
// e os eventos vêm do workspace/vault; aqui, do grafo.json embutido e da simulação.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const GRAFO = JSON.parse(document.getElementById('grafo').textContent);
// ?carga=1300 completa o grafo com notas sintéticas (cópias de pasta e grau das reais)
// só para medir fps no tamanho pedido; o painel de filtros avisa que há carga de teste
const CARGA = Math.min(5000, parseInt(new URLSearchParams(location.search).get('carga') || '0', 10) || 0);
const SINTETICAS = Math.max(0, CARGA - GRAFO.nos.length);
if (SINTETICAS) {
  const reais = GRAFO.nos.length, porNo = (GRAFO.arestas.length * 2) / reais;
  let semente = 1;
  const r = () => { semente = (semente * 16807) % 2147483647; return semente / 2147483647; };
  for (let k = 0; k < SINTETICAS; k++) {
    const molde = GRAFO.nos[Math.floor(r() * reais)];
    GRAFO.nos.push({ ...molde, id: `${molde.id} (sintética ${k + 1})`, t: `Sintética ${k + 1}` });
    const i = GRAFO.nos.length - 1;
    for (let e = 0; e < Math.round(porNo / 2); e++) GRAFO.arestas.push([Math.floor(r() * i), i]);
  }
}

// ---------- vocabulário ----------
const COR = {
  regra: '#ff8a3d', incidente: '#ff4d4d', decisao: '#ffc233', metodo: '#2ee59d',
  conhecimento: '#569cff', projeto: '#8f7bff', fonte: '#7ea2ff', pesquisa: '#7ea2ff',
  arquivo: '#58627e', sistema: '#cfe0ff',
};
const LOBOS = [
  { id: 'frontal', nome: 'Frontal', curto: 'FRO', conteudo: 'conhecimento' },
  { id: 'motor', nome: 'Motor', curto: 'MOT', conteudo: 'decisões' },
  { id: 'parietal', nome: 'Parietal', curto: 'PAR', conteudo: 'projetos' },
  { id: 'temporal', nome: 'Temporal', curto: 'TEM', conteudo: 'regras e métodos' },
  { id: 'occipital', nome: 'Occipital', curto: 'OCC', conteudo: 'incidentes' },
  { id: 'cerebelo', nome: 'Cerebelo', curto: 'CER', conteudo: 'fontes e pesquisa' },
  { id: 'tronco', nome: 'Tronco', curto: 'TRO', conteudo: 'arquivo' },
  { id: 'talamo', nome: 'Tálamo', curto: 'TAL', conteudo: 'painel e sistema' },
];
const LOBO_IDX = Object.fromEntries(LOBOS.map((l, i) => [l.id, i]));
const NOME_TIPO = {
  regra: 'regra', incidente: 'incidente', decisao: 'decisão', metodo: 'método',
  conhecimento: 'conhecimento', projeto: 'projeto', fonte: 'fonte', pesquisa: 'pesquisa',
  arquivo: 'arquivo', sistema: 'sistema',
};

const mqReduzido = matchMedia('(prefers-reduced-motion: reduce)');
const estado = {
  esconderArquivo: false, fundo: true, reduzidos: false, eeg: true,
  lobo: null, selecionado: -1, sobre: -1, demo: true,
  get movimentoReduzido() { return mqReduzido.matches; },
};

// ---------- aleatório determinístico ----------
function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(r) {
  const u = Math.max(r(), 1e-9), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- ruído de gradiente 3D (giros e sulcos) ----------
const PERM = new Uint8Array(512);
{
  const r = rng(7031), p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
const G3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
function ruido(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const g = (h, dx, dy, dz) => { const q = G3[h % 12]; return q[0] * dx + q[1] * dy + q[2] * dz; };
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;
  const l = (a, b, t) => a + t * (b - a);
  return l(
    l(l(g(PERM[AA], x, y, z), g(PERM[BA], x - 1, y, z), u), l(g(PERM[AB], x, y - 1, z), g(PERM[BB], x - 1, y - 1, z), u), v),
    l(l(g(PERM[AA + 1], x, y, z - 1), g(PERM[BA + 1], x - 1, y, z - 1), u), l(g(PERM[AB + 1], x, y - 1, z - 1), g(PERM[BB + 1], x - 1, y - 1, z - 1), u), v),
    w);
}

// ---------- forma do cérebro ----------
// Hemisfério em coordenadas locais: x para fora, y para cima, z para a frente.
const MEIO = 0.032; // meia largura da fissura longitudinal
function superficieHemisferio(s, out) {
  const { x, y, z } = s;
  let X = x * 0.40, Y, Z = z * 0.80;
  Y = y > 0 ? y * (0.50 + 0.07 * Math.max(-z, 0) - 0.05 * Math.max(z, 0)) : y * 0.36;
  X *= 1 - 0.14 * Math.max(z, 0) - 0.22 * Math.max(-z - 0.45, 0);
  // lobo temporal: desce na lateral, entre a têmpora e a nuca
  const t = Math.exp(-(((z - 0.05) / 0.36) ** 2)) * Math.exp(-(((y + 0.55) / 0.32) ** 2)) * Math.max(0, Math.min(1, (x + 0.2) * 1.6));
  Y -= 0.12 * t; X += 0.03 * t; Z -= 0.03 * t;
  // polo occipital um pouco mais baixo, polo frontal mais curto embaixo
  Y -= 0.04 * Math.max(-z - 0.6, 0);
  if (y < -0.2 && z > 0.5) Z *= 0.94;
  // face medial achatada contra a fissura
  if (X < -0.27) X = -0.27 + (X + 0.27) * 0.22;
  out.set(X + 0.30 + MEIO, Y, Z);
  return out;
}
function loboDe(s) {
  const { x, y, z } = s;
  if (x < -0.62) return null; // face medial: sem neurônios
  if (y < -0.22 && z > -0.5 && z < 0.55 && x > -0.25) return 'temporal';
  if (z > 0.30) return 'frontal';
  if (z > 0.04 && y > -0.22) return 'motor';
  if (z < -0.55) return 'occipital';
  if (y > -0.22) return 'parietal';
  return z < -0.3 ? 'occipital' : 'temporal';
}
// sulcos: curvas de nível zero do ruído viram vales sinuosos, como no córtex
function sulco(px, py, pz) {
  const wx = ruido(px * 1.7 + 11, py * 1.7, pz * 1.7) * 0.55;
  const wy = ruido(px * 1.7, py * 1.7 + 23, pz * 1.7) * 0.55;
  const n = ruido(px * 4.6 + wx, py * 4.6 + wy, pz * 4.6);
  return { n, vale: Math.exp(-((n / 0.06) ** 2)) };
}

function geometriaHemisferio(lado) {
  let geo = new THREE.IcosahedronGeometry(1, 52);
  geo.deleteAttribute('normal'); geo.deleteAttribute('uv');
  geo = mergeVertices(geo);
  const pos = geo.attributes.position, n = pos.count;
  const crista = new Float32Array(n), medialA = new Float32Array(n);
  const s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Vector3(0.30 + MEIO, -0.02, 0);
  for (let i = 0; i < n; i++) {
    s.fromBufferAttribute(pos, i).normalize();
    superficieHemisferio(s, p);
    const { n: nn, vale } = sulco(p.x, p.y, p.z);
    // fissura lateral (Sylvius) e sulco central, desenhados à mão
    const silvio = s.x > -0.1 ? Math.exp(-(((s.y + 0.18 + 0.32 * (s.z - 0.1)) / 0.05) ** 2)) * (s.z > -0.35 && s.z < 0.6 ? 1 : 0) : 0;
    const central = s.y > -0.25 ? Math.exp(-(((s.z - 0.10 - 0.10 * s.y) / 0.035) ** 2)) : 0;
    const medial = s.x < -0.55 ? 0.3 : 1;
    const prof = (0.034 * vale + 0.045 * silvio + 0.03 * central) * medial - 0.008 * nn;
    const dir = p.clone().sub(c).normalize();
    p.addScaledVector(dir, -prof);
    p.x *= lado;
    pos.setXYZ(i, p.x, p.y, p.z);
    crista[i] = 1 - Math.min(1, vale + silvio + central);
    medialA[i] = THREE.MathUtils.smoothstep(-s.x, 0.28, 0.72);
  }
  geo.setAttribute('aCrista', new THREE.BufferAttribute(crista, 1));
  geo.setAttribute('aMedial', new THREE.BufferAttribute(medialA, 1));
  geo.computeVertexNormals();
  return geo;
}

function geometriaCerebelo() {
  let geo = new THREE.IcosahedronGeometry(1, 40);
  geo.deleteAttribute('normal'); geo.deleteAttribute('uv');
  geo = mergeVertices(geo);
  const pos = geo.attributes.position, n = pos.count, crista = new Float32Array(n);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const entalhe = 1 - 0.22 * Math.exp(-((v.x / 0.14) ** 2)) * (v.y > -0.2 ? 1 : 0.4);
    const r = 1 - 0.05 * (0.5 + 0.5 * Math.sin(v.y * 34 + v.z * 8 + ruido(v.x * 3, v.y * 3, v.z * 3) * 3));
    crista[i] = 0.5 + 0.5 * Math.sin(v.y * 34 + v.z * 8);
    pos.setXYZ(i, v.x * 0.40 * r, v.y * 0.17 * r * entalhe, v.z * 0.24 * r);
  }
  geo.setAttribute('aCrista', new THREE.BufferAttribute(crista, 1));
  geo.setAttribute('aMedial', new THREE.BufferAttribute(new Float32Array(n), 1));
  geo.computeVertexNormals();
  geo.translate(0, -0.40, -0.50);
  return geo;
}
const CEREBELO = { c: new THREE.Vector3(0, -0.40, -0.50), r: new THREE.Vector3(0.40, 0.17, 0.24) };
const TRONCO = { a: new THREE.Vector3(0, -0.26, -0.16), b: new THREE.Vector3(0, -0.86, -0.30) };

function geometriaTronco() {
  const geo = new THREE.CylinderGeometry(0.085, 0.055, TRONCO.a.distanceTo(TRONCO.b), 40, 24, true);
  const pos = geo.attributes.position, v = new THREE.Vector3();
  const crista = new Float32Array(pos.count).fill(1);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ponte = Math.exp(-(((v.y - 0.12) / 0.07) ** 2)) * Math.max(0, v.z / 0.085);
    v.z += 0.03 * ponte;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  geo.setAttribute('aCrista', new THREE.BufferAttribute(crista, 1));
  geo.setAttribute('aMedial', new THREE.BufferAttribute(new Float32Array(pos.count), 1));
  const meio = TRONCO.a.clone().add(TRONCO.b).multiplyScalar(0.5);
  const dir = TRONCO.a.clone().sub(TRONCO.b).normalize();
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir));
  geo.translate(meio.x, meio.y, meio.z);
  return geo;
}
const TALAMO = [new THREE.Vector3(-0.075, -0.06, -0.06), new THREE.Vector3(0.075, -0.06, -0.06)];
function geometriaTalamo() {
  const geos = TALAMO.map((c) => {
    const g = new THREE.SphereGeometry(1, 32, 20);
    g.scale(0.065, 0.05, 0.095); g.translate(c.x, c.y, c.z);
    return g;
  });
  const pos = new Float32Array(geos.reduce((n, g) => n + g.attributes.position.count * 3, 0));
  const nor = new Float32Array(pos.length);
  const idx = [];
  let off = 0, voff = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array, off); nor.set(g.attributes.normal.array, off);
    for (const k of g.index.array) idx.push(k + voff);
    off += g.attributes.position.array.length; voff += g.attributes.position.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('aCrista', new THREE.BufferAttribute(new Float32Array(pos.length / 3).fill(1), 1));
  geo.setAttribute('aMedial', new THREE.BufferAttribute(new Float32Array(pos.length / 3), 1));
  geo.setIndex(idx);
  return geo;
}

// ---------- posições dos neurônios ----------
const N0 = GRAFO.nos.length;
const CAP = N0 + 96; // espaço para notas novas
const nos = GRAFO.nos.map((n, i) => ({ ...n, i, viz: [] }));
for (const [a, b] of GRAFO.arestas) { nos[a].viz.push(b); nos[b].viz.push(a); }
const posicoes = new Float32Array(CAP * 3);

// sub-regiões do frontal (ramos do 60_CONHECIMENTO) e do parietal (projetos):
// área proporcional à raiz do número de notas, para o VIDEO não engolir o lobo
function semearSubregioes(lobo) {
  const contagem = new Map();
  for (const n of nos) if (n.l === lobo) contagem.set(n.s, (contagem.get(n.s) || 0) + 1);
  const subs = [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = subs.length ? subs[0][1] : 1;
  const r = rng(hash(lobo)), sementes = new Map(), s = new THREE.Vector3();
  const usadas = [];
  for (const [nome, qtd] of subs) {
    let melhor = null, melhorD = -1;
    for (let k = 0; k < 400; k++) {
      s.set(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
      if (s.lengthSq() > 1 || s.lengthSq() < 0.01) continue;
      s.normalize();
      if (loboDe(s) !== lobo || s.x < -0.35) continue;
      const d = usadas.length ? Math.min(...usadas.map((u) => u.distanceTo(s))) : 1;
      if (d > melhorD) { melhorD = d; melhor = s.clone(); }
      if (usadas.length === 0) break;
    }
    usadas.push(melhor);
    sementes.set(nome, { dir: melhor, sigma: 0.07 + 0.20 * Math.sqrt(qtd / max) });
  }
  return sementes;
}
const SUB = { frontal: semearSubregioes('frontal'), parietal: semearSubregioes('parietal') };

function posicionar(n) {
  const r = rng(hash(n.id));
  const out = new THREE.Vector3();
  if (n.id === '00_PAINEL') return out.set(0, -0.06, -0.06);
  if (n.l === 'talamo') {
    const c = TALAMO[r() < 0.5 ? 0 : 1];
    return out.set(c.x + gauss(r) * 0.025, c.y + gauss(r) * 0.02, c.z + gauss(r) * 0.035);
  }
  if (n.l === 'tronco') {
    const t = r();
    out.lerpVectors(TRONCO.a, TRONCO.b, 0.1 + t * 0.85);
    return out.add(new THREE.Vector3(gauss(r) * 0.025, 0, gauss(r) * 0.025));
  }
  if (n.l === 'cerebelo') {
    const s = new THREE.Vector3();
    do { s.set(gauss(r), gauss(r) * 0.8, gauss(r)).normalize(); } while (s.z > 0.55 && s.y > 0);
    const d = 0.78 + r() * 0.2;
    return out.set(CEREBELO.c.x + s.x * CEREBELO.r.x * d, CEREBELO.c.y + s.y * CEREBELO.r.y * d, CEREBELO.c.z + s.z * CEREBELO.r.z * d);
  }
  const lado = (hash(n.id + '#') & 1) ? 1 : -1;
  const sub = SUB[n.l]?.get(n.s);
  const s = new THREE.Vector3(), p = new THREE.Vector3();
  for (let k = 0; k < 200; k++) {
    if (sub) {
      s.copy(sub.dir).add(new THREE.Vector3(gauss(r), gauss(r), gauss(r)).multiplyScalar(sub.sigma));
    } else {
      s.set(gauss(r), gauss(r), gauss(r));
    }
    s.normalize();
    if (loboDe(s) === n.l) break;
  }
  superficieHemisferio(s, p);
  const c = new THREE.Vector3(0.30 + MEIO, -0.02, 0);
  const prof = n.l === 'tronco' ? 0.5 : 0.80 + r() * 0.17;
  p.sub(c).multiplyScalar(prof).add(c);
  p.x *= lado;
  return out.copy(p);
}
nos.forEach((n) => { const p = posicionar(n); posicoes.set([p.x, p.y, p.z], n.i * 3); });

// ---------- cena ----------
const palco = document.getElementById('palco');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
} catch (e) {
  document.getElementById('sem-webgl').hidden = false;
  throw e;
}
renderer.setClearColor(0x070b16, 1);
palco.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 50);
camera.position.set(2.05, 0.62, 2.35);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, -0.25, -0.06);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 0.9;
controls.maxDistance = 7;
controls.rotateSpeed = 0.6;
controls.autoRotateSpeed = 0.35;

// halo de fundo do tema: #0c1630 no centro sumindo em #070b16
const fundo = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uAspecto: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uAspecto;
      void main(){ vec2 p = (vUv - vec2(0.5, 0.56)) * vec2(uAspecto, 1.0);
        float h = smoothstep(0.85, 0.0, length(p));
        vec3 c = mix(vec3(0.0275, 0.043, 0.086), vec3(0.047, 0.086, 0.188), h * 0.9);
        gl_FragColor = vec4(c, 1.0); }`,
  }),
);
fundo.frustumCulled = false; fundo.renderOrder = -10;
scene.add(fundo);

// raio X: casca em fresnel, as duas faces somam como filme radiográfico
const raioX = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uBase: { value: 0.006 }, uBorda: { value: 0.24 },
    uCor1: { value: new THREE.Color('#569cff') }, uCor2: { value: new THREE.Color('#7ea2ff') },
    uIntensidade: { value: 1 },
  },
  vertexShader: `attribute float aCrista; attribute float aMedial; varying vec3 vN; varying vec3 vV; varying float vCrista; varying float vMedial;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vCrista = aCrista; vMedial = aMedial;
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uBase; uniform float uBorda; uniform vec3 uCor1; uniform vec3 uCor2; uniform float uIntensidade;
    varying vec3 vN; varying vec3 vV; varying float vCrista; varying float vMedial;
    void main(){ float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
      float borda = pow(f, 2.6);
      float a = (uBase + borda * uBorda) * mix(0.18, 1.0, vCrista * vCrista) * (1.0 - 0.88 * vMedial) * uIntensidade;
      gl_FragColor = vec4(mix(uCor1, uCor2, borda), a); }`,
});
const cortex = new THREE.Group();
for (const lado of [1, -1]) cortex.add(new THREE.Mesh(geometriaHemisferio(lado), raioX));
const cerebeloMat = raioX.clone(); cerebeloMat.uniforms.uIntensidade.value = 0.8;
const estruturaInterna = raioX.clone(); estruturaInterna.uniforms.uIntensidade.value = 0.75;
cortex.add(new THREE.Mesh(geometriaCerebelo(), cerebeloMat));
cortex.add(new THREE.Mesh(geometriaTronco(), estruturaInterna));
cortex.add(new THREE.Mesh(geometriaTalamo(), estruturaInterna));
cortex.children.forEach((m) => { m.renderOrder = 1; });
scene.add(cortex);

// ---------- sinapses: curvas que passam pela substância branca ----------
const SEG = 6;
const CAP_ARESTAS = GRAFO.arestas.length + 400;
const arestas = GRAFO.arestas.map(([a, b]) => [a, b]);
const sinPos = new Float32Array(CAP_ARESTAS * SEG * 2 * 3);
const sinAlfa = new Float32Array(CAP_ARESTAS * SEG * 2);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3(), tmpP = new THREE.Vector3();
function controle(a, b, out) {
  // ponto de controle puxado para o centro: a fibra mergulha em vez de cortar reto
  out.addVectors(a, b).multiplyScalar(0.5);
  const d = a.distanceTo(b);
  return out.multiplyScalar(1 - Math.min(0.55, d * 0.45)).add(new THREE.Vector3(0, -0.04, 0).multiplyScalar(d));
}
function pontoCurva(a, c, b, t, out) {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z);
}
function escreverAresta(k) {
  const [a, b] = arestas[k];
  tmpA.fromArray(posicoes, a * 3); tmpB.fromArray(posicoes, b * 3); controle(tmpA, tmpB, tmpC);
  let o = k * SEG * 6;
  let prev = tmpA.clone();
  for (let s = 1; s <= SEG; s++) {
    pontoCurva(tmpA, tmpC, tmpB, s / SEG, tmpP);
    sinPos[o++] = prev.x; sinPos[o++] = prev.y; sinPos[o++] = prev.z;
    sinPos[o++] = tmpP.x; sinPos[o++] = tmpP.y; sinPos[o++] = tmpP.z;
    prev.copy(tmpP);
  }
}
arestas.forEach((_, k) => escreverAresta(k));
const sinGeo = new THREE.BufferGeometry();
sinGeo.setAttribute('position', new THREE.BufferAttribute(sinPos, 3));
sinGeo.setAttribute('aAlfa', new THREE.BufferAttribute(sinAlfa, 1));
sinGeo.setDrawRange(0, arestas.length * SEG * 2);
const sinMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  uniforms: { uCor: { value: new THREE.Color('#569cff') }, uAlfa: { value: 0.35 * 0.085 }, uPerto: { value: 1.8 }, uLonge: { value: 3.6 } },
  vertexShader: `attribute float aAlfa; varying float vA; uniform float uPerto; uniform float uLonge;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vA = aAlfa * mix(1.0, 0.35, smoothstep(uPerto, uLonge, -mv.z));
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform vec3 uCor; uniform float uAlfa; varying float vA;
    void main(){ gl_FragColor = vec4(uCor, uAlfa * vA); }`,
});
const sinapses = new THREE.LineSegments(sinGeo, sinMat);
sinapses.frustumCulled = false; sinapses.renderOrder = 2;
scene.add(sinapses);

// realce das sinapses da nota selecionada
const realceGeo = new THREE.BufferGeometry();
const realcePos = new Float32Array(400 * SEG * 6);
realceGeo.setAttribute('position', new THREE.BufferAttribute(realcePos, 3));
realceGeo.setDrawRange(0, 0);
const realceMat = new THREE.LineBasicMaterial({ color: '#7ea2ff', transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false });
const realce = new THREE.LineSegments(realceGeo, realceMat);
realce.frustumCulled = false; realce.renderOrder = 3;
scene.add(realce);

// ---------- neurônios ----------
const aTam = new Float32Array(CAP), aAtiv = new Float32Array(CAP), aCor = new Float32Array(CAP * 3), aVis = new Float32Array(CAP), aNasc = new Float32Array(CAP), aApagado = new Float32Array(CAP);
const corTmp = new THREE.Color();
function configurarNo(n) {
  const grau = n.viz.length;
  aTam[n.i] = n.id === '00_PAINEL' ? 3.4 : 1.0 + Math.min(2.6, Math.log2(1 + grau) * 0.42);
  corTmp.set(COR[n.k] || COR.sistema);
  aCor.set([corTmp.r, corTmp.g, corTmp.b], n.i * 3);
  aVis[n.i] = 1;
  aNasc[n.i] = 1;
  aApagado[n.i] = n.l === 'tronco' ? 1 : 0;
}
nos.forEach(configurarNo);
const noGeo = new THREE.BufferGeometry();
noGeo.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
noGeo.setAttribute('aTam', new THREE.BufferAttribute(aTam, 1));
noGeo.setAttribute('aAtiv', new THREE.BufferAttribute(aAtiv, 1));
noGeo.setAttribute('aCor', new THREE.BufferAttribute(aCor, 3));
noGeo.setAttribute('aVis', new THREE.BufferAttribute(aVis, 1));
noGeo.setAttribute('aNasc', new THREE.BufferAttribute(aNasc, 1));
noGeo.setAttribute('aApagado', new THREE.BufferAttribute(aApagado, 1));
noGeo.setDrawRange(0, N0);
const noMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  uniforms: { uEscala: { value: 1 }, uRepouso: { value: new THREE.Color('#9dbdff') }, uArquivo: { value: new THREE.Color('#58627e') }, uPerto: { value: 1.8 }, uLonge: { value: 3.6 } },
  vertexShader: `attribute float aTam; attribute float aAtiv; attribute vec3 aCor; attribute float aVis; attribute float aNasc; attribute float aApagado;
    uniform float uEscala; uniform float uPerto; uniform float uLonge;
    varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vNevoa; varying float vHalo; varying float vApagado;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float a = clamp(aAtiv, 0.0, 1.6);
      vHalo = 1.0 + a * 7.0 + (1.0 - aNasc) * 9.0;
      gl_PointSize = aTam * vHalo * uEscala / -mv.z * aVis;
      vAtiv = a; vCor = aCor; vVis = aVis; vApagado = aApagado; vNevoa = mix(1.0, 0.32, smoothstep(uPerto, uLonge, -mv.z));
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform vec3 uRepouso; uniform vec3 uArquivo; varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vNevoa; varying float vHalo; varying float vApagado;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0;
      if (r2 > 1.0) discard;
      float nucleo = exp(-r2 * 9.0 * vHalo * vHalo);
      float halo = exp(-r2 * 5.0) * min(vAtiv, 1.0);
      vec3 c = mix(mix(uRepouso, uArquivo, vApagado), vCor, smoothstep(0.0, 0.35, vAtiv));
      float brilho = nucleo * (0.55 * mix(1.0, 0.45, vApagado) + vAtiv * 1.6) * vNevoa + halo * 0.55;
      gl_FragColor = vec4(c * brilho * vVis, 1.0); }`,
});
noMat.blending = THREE.CustomBlending;
noMat.blendSrc = THREE.OneFactor; noMat.blendDst = THREE.OneFactor;
const neuronios = new THREE.Points(noGeo, noMat);
neuronios.frustumCulled = false; neuronios.renderOrder = 4;
scene.add(neuronios);

// ---------- pulsos: o disparo viajando pela sinapse ----------
const MAX_PULSOS = 700;
const pulPos = new Float32Array(MAX_PULSOS * 3), pulCor = new Float32Array(MAX_PULSOS * 3), pulForca = new Float32Array(MAX_PULSOS);
const pulGeo = new THREE.BufferGeometry();
pulGeo.setAttribute('position', new THREE.BufferAttribute(pulPos, 3));
pulGeo.setAttribute('aCor', new THREE.BufferAttribute(pulCor, 3));
pulGeo.setAttribute('aForca', new THREE.BufferAttribute(pulForca, 1));
const pulMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, blending: THREE.CustomBlending,
  blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
  uniforms: { uEscala: { value: 1 } },
  vertexShader: `attribute vec3 aCor; attribute float aForca; uniform float uEscala; varying vec3 vCor; varying float vF;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vCor = aCor; vF = aForca;
      gl_PointSize = (2.0 + 5.0 * aForca) * uEscala / -mv.z; gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying vec3 vCor; varying float vF;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0; if (r2 > 1.0) discard;
      float g = exp(-r2 * 6.0) * 0.9 + exp(-r2 * 40.0);
      gl_FragColor = vec4(vCor * g * vF, 1.0); }`,
});
const pulsosObj = new THREE.Points(pulGeo, pulMat);
pulsosObj.frustumCulled = false; pulsosObj.renderOrder = 5;
scene.add(pulsosObj);
const pulsos = [];

function vivo(i) { return aVis[i] > 0.5 && aNasc[i] > 0; }
function disparar(i, forca) { aAtiv[i] = Math.max(aAtiv[i], forca); }
function enviarPulso(de, para, forca, cor, aoChegar) {
  if (pulsos.length >= (estado.reduzidos ? 160 : MAX_PULSOS)) return;
  if (!vivo(de) || !vivo(para)) return;
  const a = new THREE.Vector3().fromArray(posicoes, de * 3), b = new THREE.Vector3().fromArray(posicoes, para * 3);
  const c = controle(a, b, new THREE.Vector3());
  const dur = estado.movimentoReduzido ? 0 : 260 + a.distanceTo(b) * 620;
  pulsos.push({ a, b, c, t0: agora, dur, forca, cor, aoChegar });
}
// espalha o disparo por N saltos, com no máximo 'leque' vizinhos por neurônio
function propagar(i, forca, saltos, cor, leque = 12, eco = false) {
  disparar(i, forca);
  if (saltos <= 0) return;
  const viz = embaralhar(nos[i].viz.filter(vivo)).slice(0, leque);
  viz.forEach((j, k) => {
    setTimeout(() => enviarPulso(i, j, forca * 0.8, cor, () => {
      propagar(j, forca * 0.55, saltos - 1, cor, Math.max(3, Math.floor(leque / 2.5)));
      if (eco) setTimeout(() => disparar(j, forca * 0.4), 380);
    }), estado.movimentoReduzido ? 0 : k * 28);
  });
}
const rEmb = rng(99);
function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rEmb() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

// ---------- EEG: um canal por lobo ----------
const eeg = { canvas: document.querySelector('#eeg canvas'), eventos: [], janela: 300000 };
const ctxEEG = eeg.canvas.getContext('2d');
function registrarEEG(i, amp, cor) {
  const n = nos[i];
  eeg.eventos.push({ t: Date.now(), canal: LOBO_IDX[n.l] ?? 7, amp, cor, no: i });
  if (eeg.eventos.length > 2000) eeg.eventos.splice(0, 500);
  eegPendente = true;
}
let eegUltimo = 0, eegPendente = false;
function desenharEEG(force) {
  if (!estado.eeg) return;
  const now = Date.now();
  if (!force && now - eegUltimo < (estado.movimentoReduzido ? 1000 : 250)) return;
  eegUltimo = now;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = eeg.canvas.clientWidth, H = eeg.canvas.clientHeight;
  if (eeg.canvas.width !== Math.round(W * dpr) || eeg.canvas.height !== Math.round(H * dpr)) {
    eeg.canvas.width = Math.round(W * dpr); eeg.canvas.height = Math.round(H * dpr);
  }
  const c = ctxEEG;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, W, H);
  const estreito = W < 560;
  const x0 = estreito ? 40 : 88, x1 = W - (estreito ? 12 : 22), topo = 6, alt = (H - topo - 16) / LOBOS.length;
  const grad = c.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(7,11,22,0)'); grad.addColorStop(0.35, 'rgba(7,11,22,.72)'); grad.addColorStop(1, 'rgba(7,11,22,.9)');
  c.fillStyle = grad; c.fillRect(0, 0, W, H);
  c.font = '500 11px Manrope, system-ui, sans-serif';
  c.textBaseline = 'middle';
  const span = eeg.janela, passo = 2;
  const porCanal = LOBOS.map(() => []);
  const minT = now - span - 4000;
  for (const e of eeg.eventos) if (e.t > minT) porCanal[e.canal].push(e);
  LOBOS.forEach((l, ci) => {
    const y = topo + alt * (ci + 0.5);
    const filtrado = estado.lobo && estado.lobo !== l.id;
    c.fillStyle = filtrado ? 'rgba(141,151,179,.45)' : '#8d97b3';
    c.textAlign = 'left';
    c.fillText(estreito ? l.curto : l.nome, estreito ? 8 : 22, y);
    const evs = porCanal[ci];
    // traço de base: ruído baixo e determinístico pelo tempo, rola para a esquerda
    c.lineWidth = 1;
    c.beginPath();
    let corAtual = null;
    const segmentos = [];
    // base de ruído; cada pico só soma nas amostras da sua janela (−21 a +42 px)
    const nAm = Math.floor((x1 - x0) / passo) + 1;
    const val = new Float32Array(nAm), maior = new Float32Array(nAm), corPico = new Array(nAm).fill(null);
    for (let a = 0; a < nAm; a++) {
      const t = now - (x1 - (x0 + a * passo)) / (x1 - x0) * span;
      val[a] = (ruido(Math.floor(t / 700) * 0.37, ci * 3.1, 0.5) + 0.6 * ruido(t / 300, ci * 7.7, 2.5)) * 0.9;
    }
    for (const e of evs) {
      const xe = x1 - (now - e.t) / span * (x1 - x0);
      const a0 = Math.max(0, Math.floor((xe - 21 - x0) / passo)), a1 = Math.min(nAm - 1, Math.ceil((xe + 42 - x0) / passo));
      for (let a = a0; a <= a1; a++) {
        const d = (x0 + a * passo - xe) / 7;
        const k = e.amp * (Math.exp(-(d * d) * 1.4) * 9 - Math.exp(-((d - 1.2) ** 2) * 1.2) * 4);
        val[a] += k;
        if (Math.abs(k) > maior[a]) { maior[a] = Math.abs(k); corPico[a] = e.cor; }
      }
    }
    for (let a = 0; a < nAm; a++) {
      segmentos.push([x0 + a * passo, y - val[a] * (alt / 12), maior[a] > 0.4 ? corPico[a] : null]);
    }
    const base = filtrado ? 'rgba(86,156,255,.12)' : 'rgba(86,156,255,.35)';
    for (let k = 1; k < segmentos.length; k++) {
      const [xa, ya, ca] = segmentos[k - 1], [xb, yb, cb] = segmentos[k];
      const cor = ca || cb || base;
      if (cor !== corAtual) {
        if (corAtual) c.stroke();
        c.beginPath(); c.strokeStyle = cor; c.lineWidth = cor === base ? 1 : 1.4; corAtual = cor;
        c.moveTo(xa, ya);
      }
      c.lineTo(xb, yb);
    }
    if (corAtual) c.stroke();
  });
  c.fillStyle = '#8d97b3'; c.textAlign = 'left';
  c.fillText('−5 min', x0, H - 7);
  c.textAlign = 'right';
  c.fillText('agora', x1, H - 7);
}
function eventoNoEEG(cx, cy) {
  const r = eeg.canvas.getBoundingClientRect();
  const W = r.width, H = r.height, estreito = W < 560;
  const x0 = estreito ? 40 : 88, x1 = W - (estreito ? 12 : 22), topo = 6, alt = (H - topo - 16) / LOBOS.length;
  const x = cx - r.left, y = cy - r.top;
  const canal = Math.floor((y - topo) / alt);
  if (canal < 0 || canal >= LOBOS.length || x < x0 - 6) return null;
  const t = Date.now() - (x1 - x) / (x1 - x0) * eeg.janela;
  let melhor = null, md = Infinity;
  for (const e of eeg.eventos) {
    if (e.canal !== canal || e.amp < 0.3) continue;
    const dpx = Math.abs(e.t - t) / eeg.janela * (x1 - x0);
    if (dpx < 10 && dpx < md) { md = dpx; melhor = e; }
  }
  return melhor;
}

// ---------- eventos (no plugin: workspace 'file-open', vault 'modify' / 'create') ----------
const corDe = (i) => COR[nos[i].k] || COR.sistema;
const avisoEl = document.getElementById('evento');
let avisoTimer = 0;
function aviso(texto, cor) {
  avisoEl.innerHTML = '';
  const bola = document.createElement('i'); bola.style.background = cor;
  avisoEl.append(bola);
  const partes = texto.split('**');
  partes.forEach((p, k) => { if (k % 2) { const b = document.createElement('b'); b.textContent = p; avisoEl.append(b); } else avisoEl.append(p); });
  avisoEl.style.opacity = 1;
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => { avisoEl.style.opacity = 0; }, 6000);
}
const eventos = {
  abrir(i, origem = 'abriu') {
    if (!vivo(i)) return;
    propagar(i, 1.0, 2, corDe(i), 12);
    registrarEEG(i, 0.75, corDe(i));
    if (origem) aviso(`${origem === 'clique' ? 'Abriria' : 'Abriu'} **${nos[i].t}** · ${NOME_TIPO[nos[i].k]} no ${LOBOS[LOBO_IDX[nos[i].l]].nome.toLowerCase()}`, corDe(i));
  },
  salvar(i) {
    if (!vivo(i)) return;
    propagar(i, 1.45, 2, corDe(i), 16, true);
    setTimeout(() => disparar(i, 1.1), 420);
    registrarEEG(i, 1.0, corDe(i));
    aviso(`Salvou **${nos[i].t}**`, corDe(i));
  },
  nova(origem) {
    if (nos.length >= CAP) return;
    const base = nos[origem];
    const i = nos.length;
    const n = { id: `${base.id.split('/')[0]}/Nota nova ${i - N0 + 1}`, t: `Nota nova ${i - N0 + 1}`, l: base.l, k: base.k, s: base.s, i, viz: [] };
    nos.push(n);
    const p = posicionar(n);
    posicoes.set([p.x, p.y, p.z], i * 3);
    configurarNo(n);
    aNasc[i] = 0;
    // liga a nota nova à de origem e a dois vizinhos dela (os [[links]] que ela traria)
    const ligar = [origem, ...embaralhar(base.viz.slice()).slice(0, 2)];
    for (const j of ligar) {
      if (arestas.length >= CAP_ARESTAS) break;
      arestas.push([j, i]); n.viz.push(j); nos[j].viz.push(i);
      escreverAresta(arestas.length - 1);
      const o = (arestas.length - 1) * SEG * 2;
      for (let s = 0; s < SEG * 2; s++) sinAlfa[o + s] = 0;
    }
    sinGeo.setDrawRange(0, arestas.length * SEG * 2);
    sinGeo.attributes.position.needsUpdate = true;
    noGeo.setDrawRange(0, nos.length);
    ['position', 'aTam', 'aCor', 'aVis', 'aApagado'].forEach((k) => { noGeo.attributes[k].needsUpdate = true; });
    nascendo.push({ i, t0: agora, arestas: ligar.length });
    registrarEEG(i, 0.85, corDe(i));
    document.getElementById('n-notas').textContent = fmt(nos.length);
    document.getElementById('n-sinapses').textContent = fmt(arestas.length);
    aviso(`Nasceu **${n.t}** em ${base.id.split('/')[0]}, ligada a ${ligar.length} notas`, corDe(i));
  },
  captura() {
    // 01_ENTRADA mudou: onda curta saindo do tálamo
    onda = { t0: agora, r: 0 };
    disparar(painel, 1.3);
    LOBOS.forEach((l, ci) => setTimeout(() => {
      eeg.eventos.push({ t: Date.now(), canal: ci, amp: 0.45, cor: '#cfe0ff', no: painel });
      eegPendente = true;
    }, (7 - ci) * 0 + ci * 90));
    aviso('Captura nova no **01_ENTRADA** · onda a partir do centro', '#cfe0ff');
  },
};
const painel = Math.max(0, nos.findIndex((n) => n.id === '00_PAINEL'));
let onda = null;
const nascendo = [];

// ---------- interação ----------
const rotulo = document.getElementById('rotulo');
const ponteiro = { x: 0, y: 0, dentro: false, moveu: true, baixo: null };
const proj = new THREE.Vector3();
function noSobPonteiro(px, py) {
  const r = renderer.domElement.getBoundingClientRect();
  let melhor = -1, melhorZ = Infinity;
  const limite = 9;
  for (let i = 0; i < nos.length; i++) {
    if (!vivo(i)) continue;
    proj.fromArray(posicoes, i * 3).project(camera);
    if (proj.z > 1) continue;
    const sx = (proj.x * 0.5 + 0.5) * r.width + r.left, sy = (-proj.y * 0.5 + 0.5) * r.height + r.top;
    const d = Math.hypot(sx - px, sy - py);
    const raio = limite + aTam[i] * 1.5;
    if (d < raio) {
      const score = proj.z + d * 0.0006;
      if (score < melhorZ) { melhorZ = score; melhor = i; }
    }
  }
  return melhor;
}
function mostrarRotulo(i, x, y) {
  if (i < 0) { rotulo.classList.remove('visivel'); return; }
  const n = nos[i];
  rotulo.querySelector('strong').textContent = n.t;
  rotulo.querySelector('span').textContent = `${LOBOS[LOBO_IDX[n.l]].nome} · ${NOME_TIPO[n.k]} · ${n.viz.length} ${n.viz.length === 1 ? 'sinapse' : 'sinapses'}`;
  const w = rotulo.offsetWidth;
  rotulo.style.left = `${Math.min(x, innerWidth - w - 20)}px`;
  rotulo.style.top = `${y}px`;
  rotulo.classList.add('visivel');
}
renderer.domElement.addEventListener('pointermove', (e) => {
  ponteiro.x = e.clientX; ponteiro.y = e.clientY; ponteiro.dentro = true; ponteiro.moveu = true;
});
renderer.domElement.addEventListener('pointerleave', () => { ponteiro.dentro = false; estado.sobre = -1; mostrarRotulo(-1); });
renderer.domElement.addEventListener('pointerdown', (e) => { ponteiro.baixo = [e.clientX, e.clientY]; pausarGiro(); });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!ponteiro.baixo) return;
  const moveu = Math.hypot(e.clientX - ponteiro.baixo[0], e.clientY - ponteiro.baixo[1]);
  ponteiro.baixo = null;
  if (moveu > 4) return;
  const i = noSobPonteiro(e.clientX, e.clientY);
  if (i >= 0) { selecionar(i, true); eventos.abrir(i, 'clique'); } else selecionar(-1);
});
renderer.domElement.addEventListener('wheel', pausarGiro, { passive: true });

function selecionar(i, centralizar) {
  estado.selecionado = i;
  if (i < 0) { realceGeo.setDrawRange(0, 0); voltarAoCentro(); return; }
  const viz = nos[i].viz.filter(vivo).slice(0, 400);
  const a = new THREE.Vector3().fromArray(posicoes, i * 3), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3();
  let o = 0;
  for (const j of viz) {
    b.fromArray(posicoes, j * 3); controle(a, b, c);
    let prev = a.clone();
    for (let s = 1; s <= SEG; s++) {
      pontoCurva(a, c, b, s / SEG, p);
      realcePos[o++] = prev.x; realcePos[o++] = prev.y; realcePos[o++] = prev.z;
      realcePos[o++] = p.x; realcePos[o++] = p.y; realcePos[o++] = p.z;
      prev.copy(p);
    }
  }
  realceGeo.attributes.position.needsUpdate = true;
  realceGeo.setDrawRange(0, viz.length * SEG * 2);
  realceMat.color.set(corDe(i));
  if (centralizar) voarPara(a);
}
let voo = null;
const ALVO_CENTRO = new THREE.Vector3(0, -0.25, -0.06);
const distanciaCentro = () => 2.85 * Math.max(1, 1.12 / (palco.clientWidth / palco.clientHeight));
function voarPara(alvo, dist = Math.max(1.1, Math.min(camera.position.distanceTo(controls.target), 2.1))) {
  const dir = camera.position.clone().sub(controls.target).normalize();
  voo = {
    t0: agora, dur: estado.movimentoReduzido ? 1 : 900,
    alvo0: controls.target.clone(), alvo1: alvo.clone(),
    cam0: camera.position.clone(), cam1: alvo.clone().add(dir.multiplyScalar(dist)),
  };
}
// volta à vista de 3/4 centrada (depois de um clique, Esc ou 20 s sem mexer)
function voltarAoCentro() {
  if (controls.target.distanceTo(ALVO_CENTRO) < 0.01 && Math.abs(camera.position.distanceTo(controls.target) - distanciaCentro()) < 0.05) return;
  voarPara(ALVO_CENTRO, distanciaCentro());
}
let giroTimer = 0;
function pausarGiro() {
  controls.autoRotate = false;
  clearTimeout(giroTimer);
  giroTimer = setTimeout(() => { voltarAoCentro(); controls.autoRotate = !estado.movimentoReduzido; }, 20000);
}
controls.autoRotate = !estado.movimentoReduzido;
mqReduzido.addEventListener('change', () => { controls.autoRotate = !estado.movimentoReduzido; });

// busca por título (sem acento, sem caixa)
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const indice = nos.map((n) => semAcento(n.t));
const campo = document.getElementById('busca-campo'), lista = document.getElementById('resultados');
let achados = [], ativo = 0;
function buscar() {
  const q = semAcento(campo.value.trim());
  lista.innerHTML = '';
  if (!q) { lista.hidden = true; campo.setAttribute('aria-expanded', 'false'); return; }
  achados = [];
  for (let i = 0; i < nos.length; i++) {
    const t = indice[i] ?? semAcento(nos[i].t);
    const k = t.indexOf(q);
    if (k >= 0 && vivo(i)) achados.push([k === 0 ? 0 : 1, -nos[i].viz.length, i]);
  }
  achados.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  achados = achados.slice(0, 8).map((a) => a[2]);
  ativo = 0;
  if (!achados.length) {
    const li = document.createElement('li'); li.className = 'vazio';
    li.textContent = 'Nenhuma nota com esse título.';
    lista.append(li);
  }
  achados.forEach((i, k) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option'); li.id = `r${k}`;
    li.setAttribute('aria-selected', k === 0 ? 'true' : 'false');
    const p = document.createElement('span'); p.className = 'ponto'; p.style.background = corDe(i);
    const t = document.createElement('span'); t.className = 'titulo'; t.textContent = nos[i].t;
    const l = document.createElement('span'); l.className = 'lobo'; l.textContent = LOBOS[LOBO_IDX[nos[i].l]].nome;
    li.append(p, t, l);
    li.addEventListener('mousedown', (e) => { e.preventDefault(); escolher(i); });
    lista.append(li);
  });
  lista.hidden = false; campo.setAttribute('aria-expanded', 'true');
}
function escolher(i) {
  campo.value = ''; buscar(); campo.blur();
  pausarGiro(); selecionar(i, true); eventos.abrir(i, 'clique');
}
campo.addEventListener('input', buscar);
campo.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!achados.length) return;
    ativo = (ativo + (e.key === 'ArrowDown' ? 1 : -1) + achados.length) % achados.length;
    [...lista.children].forEach((li, k) => li.setAttribute('aria-selected', k === ativo ? 'true' : 'false'));
    campo.setAttribute('aria-activedescendant', `r${ativo}`);
  } else if (e.key === 'Enter' && achados.length) {
    escolher(achados[ativo]);
  } else if (e.key === 'Escape') {
    campo.value = ''; buscar(); campo.blur();
  }
});
campo.addEventListener('blur', () => setTimeout(() => { lista.hidden = true; }, 120));
addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); campo.focus(); campo.select(); }
  else if (e.key === 'Escape' && document.activeElement !== campo) { selecionar(-1); fecharFiltros(); }
});

// filtros
const botaoFiltros = document.getElementById('botao-filtros'), painelFiltros = document.getElementById('filtros');
function fecharFiltros() { painelFiltros.hidden = true; botaoFiltros.setAttribute('aria-expanded', 'false'); }
botaoFiltros.addEventListener('click', () => {
  const abrir = painelFiltros.hidden;
  painelFiltros.hidden = !abrir; botaoFiltros.setAttribute('aria-expanded', String(abrir));
});
document.addEventListener('pointerdown', (e) => {
  if (!painelFiltros.hidden && !painelFiltros.contains(e.target) && !botaoFiltros.contains(e.target)) fecharFiltros();
});
const lobosEl = document.getElementById('lobos');
[{ id: null, nome: 'Todos' }, ...LOBOS].forEach((l) => {
  const b = document.createElement('button');
  b.textContent = l.nome; b.title = l.conteudo ? `${l.nome}: ${l.conteudo}` : 'Todos os lobos';
  b.setAttribute('aria-pressed', l.id === null ? 'true' : 'false');
  b.addEventListener('click', () => {
    estado.lobo = l.id;
    [...lobosEl.children].forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    aplicarVisibilidade();
  });
  lobosEl.append(b);
});
function aplicarVisibilidade() {
  for (let i = 0; i < nos.length; i++) {
    const n = nos[i];
    let v = 1;
    if (estado.esconderArquivo && n.l === 'tronco') v = 0;
    else if (estado.lobo && n.l !== estado.lobo) v = 0.14;
    aVis[i] = v;
  }
  for (let k = 0; k < arestas.length; k++) {
    const [a, b] = arestas[k];
    const v = Math.min(aVis[a], aVis[b]);
    const base = v >= 1 ? 1 : v > 0 ? 0.08 : 0;
    const o = k * SEG * 2;
    if (k >= GRAFO.arestas.length && nascendo.some((x) => arestas[k].includes(x.i))) continue;
    for (let s = 0; s < SEG * 2; s++) sinAlfa[o + s] = base;
  }
  noGeo.attributes.aVis.needsUpdate = true;
  sinGeo.attributes.aAlfa.needsUpdate = true;
}
aplicarVisibilidade();
document.getElementById('f-arquivo').addEventListener('change', (e) => { estado.esconderArquivo = e.target.checked; aplicarVisibilidade(); });
document.getElementById('f-fundo').addEventListener('change', (e) => { estado.fundo = e.target.checked; });
document.getElementById('f-reduzidos').addEventListener('change', (e) => { estado.reduzidos = e.target.checked; redimensionar(false); });
document.getElementById('f-eeg').addEventListener('change', (e) => {
  estado.eeg = e.target.checked;
  document.getElementById('eeg').style.display = estado.eeg ? '' : 'none';
});
eeg.canvas.addEventListener('click', (e) => {
  const ev = eventoNoEEG(e.clientX, e.clientY);
  if (ev && vivo(ev.no)) { pausarGiro(); selecionar(ev.no, true); eventos.abrir(ev.no, 'clique'); }
});
eeg.canvas.addEventListener('mousemove', (e) => {
  const ev = eventoNoEEG(e.clientX, e.clientY);
  eeg.canvas.style.cursor = ev ? 'pointer' : 'default';
  if (ev) mostrarRotulo(ev.no, e.clientX, e.clientY - 18); else if (!ponteiro.dentro) mostrarRotulo(-1);
});
eeg.canvas.addEventListener('mouseleave', () => mostrarRotulo(-1));

// ---------- simulação (só na prévia) ----------
const rSim = rng(2024);
const projetos = nos.filter((n) => n.l === 'parietal' && n.viz.length > 20).map((n) => n.i);
let foco = projetos[0] ?? 0;
function proximaNota() {
  // caminha pelo cofre como numa sessão real: do foco para um vizinho, às vezes volta ao projeto
  const viz = nos[foco].viz.filter(vivo);
  if (!viz.length || rSim() < 0.18) foco = projetos[Math.floor(rSim() * projetos.length)] ?? foco;
  else foco = viz[Math.floor(rSim() * viz.length)];
  return foco;
}
document.querySelectorAll('#simular [data-evento]').forEach((b) => b.addEventListener('click', () => {
  const tipo = b.dataset.evento;
  if (tipo === 'abrir') { const i = proximaNota(); selecionar(i, false); eventos.abrir(i); }
  else if (tipo === 'salvar') eventos.salvar(estado.selecionado >= 0 ? estado.selecionado : foco);
  else if (tipo === 'nova') eventos.nova(estado.selecionado >= 0 ? estado.selecionado : foco);
  else eventos.captura();
}));
const botaoDemo = document.getElementById('demo');
botaoDemo.addEventListener('click', () => {
  estado.demo = !estado.demo; botaoDemo.setAttribute('aria-pressed', String(estado.demo));
});
let proxDemo = 1500;
function passoDemo(dt) {
  if (!estado.demo) return;
  proxDemo -= dt;
  if (proxDemo > 0) return;
  const r = rSim();
  if (r < 0.58) { const i = proximaNota(); selecionar(i, false); eventos.abrir(i); proxDemo = 3200 + rSim() * 3500; }
  else if (r < 0.84) { eventos.salvar(foco); proxDemo = 2600 + rSim() * 2600; }
  else if (r < 0.93) { eventos.captura(); proxDemo = 4200; }
  else { eventos.nova(foco); proxDemo = 4200; }
}
// histórico inicial para o EEG não abrir vazio: últimos minutos de uma manhã
{
  const agora0 = Date.now(), r = rng(5);
  for (let k = 0; k < 46; k++) {
    const i = Math.floor(r() * N0), t = agora0 - r() * eeg.janela * 0.98;
    eeg.eventos.push({ t, canal: LOBO_IDX[nos[i].l] ?? 7, amp: r() < 0.25 ? 0.18 : 0.5 + r() * 0.5, cor: corDe(i), no: i });
  }
  eeg.eventos.sort((a, b) => a.t - b.t);
}

// ---------- laço ----------
const fmt = (n) => n.toLocaleString('pt-BR');
document.getElementById('n-notas').textContent = fmt(GRAFO.notas);
document.getElementById('n-sinapses').textContent = fmt(GRAFO.sinapses);
let agora = performance.now(), ultimo = agora, fundoTimer = 600, rodando = true, raf = 0;
const quadros = []; const perfEl = document.getElementById('desempenho');
const centro = new THREE.Vector3(0, -0.06, -0.06);

function redimensionar(reenquadrar = true) {
  const w = palco.clientWidth, h = palco.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, estado.reduzidos ? 1 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // painel estreito: afasta a câmera para o cérebro caber na largura
  camera.fov = 34;
  if (reenquadrar) {
    // o cérebro tem ~1,75 de largura vista em 3/4: afasta até caber na largura
    const ajuste = Math.max(1, 1.12 / (w / h));
    camera.position.sub(controls.target).setLength(2.85 * ajuste).add(controls.target);
  }
  camera.updateProjectionMatrix();
  const escala = h * dpr * 0.0105 * Math.sqrt(Math.max(1, camera.position.distanceTo(controls.target) / 2.85));
  noMat.uniforms.uEscala.value = escala;
  pulMat.uniforms.uEscala.value = escala;
  fundo.material.uniforms.uAspecto.value = w / h;
  sinMat.uniforms.uAlfa.value = 0.35 * 0.085 * THREE.MathUtils.clamp(Math.sqrt((w * h) / (1440 * 900)), 0.35, 1);
  desenharEEG(true);
}
addEventListener('resize', () => redimensionar());
redimensionar();

document.addEventListener('visibilitychange', () => {
  rodando = !document.hidden;
  cancelAnimationFrame(raf);
  if (rodando) { ultimo = performance.now(); raf = requestAnimationFrame(quadro); }
});

const ease = (t) => 1 - Math.pow(1 - t, 3);
function quadro(t) {
  if (!rodando) return;
  agora = t;
  const dt = Math.min(64, t - ultimo); ultimo = t;
  quadros.push(dt); if (quadros.length > 90) quadros.shift();

  // atividade de fundo: esparsa e fraca
  if (estado.fundo) {
    fundoTimer -= dt;
    if (fundoTimer <= 0) {
      const i = Math.floor(Math.random() * nos.length);
      if (vivo(i)) {
        disparar(i, 0.22 + Math.random() * 0.12);
        if (Math.random() < 0.18 && !estado.reduzidos) {
          const j = nos[i].viz[Math.floor(Math.random() * nos[i].viz.length)];
          if (j !== undefined) enviarPulso(i, j, 0.35, corDe(i), () => disparar(j, 0.18));
        }
      }
      fundoTimer = (estado.reduzidos ? 900 : 260) + Math.random() * 520;
    }
  }
  passoDemo(dt);

  // onda da captura: casca que se expande a partir do tálamo
  if (onda) {
    const r = (t - onda.t0) / 1000 * 0.9;
    const r0 = onda.r; onda.r = r;
    for (let i = 0; i < nos.length; i++) {
      if (!vivo(i)) continue;
      const d = Math.hypot(posicoes[i * 3] - centro.x, posicoes[i * 3 + 1] - centro.y, posicoes[i * 3 + 2] - centro.z);
      if (d >= r0 && d < r) disparar(i, 0.42);
    }
    if (r > 1.2) onda = null;
  }

  // decaimento do disparo
  const decai = Math.exp(-dt / 850);
  for (let i = 0; i < nos.length; i++) if (aAtiv[i] > 0.001) aAtiv[i] *= decai; else aAtiv[i] = 0;
  noGeo.attributes.aAtiv.needsUpdate = true;

  // nascimento: o neurônio aparece com brilho e as sinapses entram em seguida
  for (let k = nascendo.length - 1; k >= 0; k--) {
    const b = nascendo[k], p = Math.min(1, (t - b.t0) / (estado.movimentoReduzido ? 1 : 1400));
    aNasc[b.i] = Math.max(0.001, ease(p));
    if (p > 0.35) {
      const q = Math.min(1, (p - 0.35) / 0.65);
      for (let a = arestas.length - 1; a >= 0 && a >= arestas.length - 60; a--) {
        if (arestas[a][1] !== b.i) continue;
        const o = a * SEG * 2;
        for (let s = 0; s < SEG * 2; s++) sinAlfa[o + s] = q * 2.2;
      }
      sinGeo.attributes.aAlfa.needsUpdate = true;
    }
    if (p >= 1) { disparar(b.i, 1.2); nascendo.splice(k, 1); aplicarVisibilidade(); }
  }
  noGeo.attributes.aNasc.needsUpdate = true;

  // pulsos
  let n = 0;
  for (let k = pulsos.length - 1; k >= 0; k--) {
    const p = pulsos[k];
    const u = p.dur ? (t - p.t0) / p.dur : 1;
    if (u >= 1) { pulsos.splice(k, 1); p.aoChegar && p.aoChegar(); continue; }
    if (n >= MAX_PULSOS) continue;
    pontoCurva(p.a, p.c, p.b, u, tmpP);
    pulPos[n * 3] = tmpP.x; pulPos[n * 3 + 1] = tmpP.y; pulPos[n * 3 + 2] = tmpP.z;
    corTmp.set(p.cor);
    pulCor[n * 3] = corTmp.r; pulCor[n * 3 + 1] = corTmp.g; pulCor[n * 3 + 2] = corTmp.b;
    pulForca[n] = p.forca * (u < 0.15 ? u / 0.15 : 1);
    n++;
  }
  pulGeo.setDrawRange(0, n);
  pulGeo.attributes.position.needsUpdate = true;
  pulGeo.attributes.aCor.needsUpdate = true;
  pulGeo.attributes.aForca.needsUpdate = true;

  // voo até a nota escolhida
  if (voo) {
    const p = Math.min(1, (t - voo.t0) / voo.dur), e = ease(p);
    controls.target.lerpVectors(voo.alvo0, voo.alvo1, e);
    camera.position.lerpVectors(voo.cam0, voo.cam1, e);
    if (p >= 1) voo = null;
  }

  // hover: no máximo uma busca por quadro, só se o ponteiro mexeu
  if (ponteiro.dentro && ponteiro.moveu && !ponteiro.baixo) {
    ponteiro.moveu = false;
    const i = noSobPonteiro(ponteiro.x, ponteiro.y);
    if (i !== estado.sobre) { estado.sobre = i; renderer.domElement.classList.toggle('sobre-no', i >= 0); }
    mostrarRotulo(i, ponteiro.x, ponteiro.y);
  }

  controls.update();
  // névoa de profundidade relativa à distância da câmera, para ler frente e fundo em qualquer zoom
  const dist = camera.position.distanceTo(controls.target);
  noMat.uniforms.uPerto.value = sinMat.uniforms.uPerto.value = dist - 0.7;
  noMat.uniforms.uLonge.value = sinMat.uniforms.uLonge.value = dist + 0.9;
  renderer.render(scene, camera);
  desenharEEG(eegPendente); eegPendente = false;

  if (quadros.length >= 30 && Math.round(t / 500) !== Math.round((t - dt) / 500)) {
    const media = quadros.reduce((a, b) => a + b, 0) / quadros.length;
    perfEl.textContent = `Desempenho: ${Math.round(1000 / media)} fps · ${fmt(nos.length)} neurônios${SINTETICAS ? ` (${fmt(SINTETICAS)} sintéticos, carga de teste)` : ''}`;
    window.__fps = 1000 / media;
  }
  raf = requestAnimationFrame(quadro);
}
raf = requestAnimationFrame(quadro);
window.__previa = { eventos, nos, selecionar, estado, camera, controls };
