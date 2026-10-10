// Prévia do "Cérebro Galáctico": o cofre como galáxia espiral que se atravessa voando.
// Notas = estrelas; cada [[link]] = sinapse que deposita poeira estelar no seu trajeto.
// No plugin, o grafo vem do metadataCache e os eventos do workspace/vault; aqui, do
// grafo.json embutido e da simulação.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GRAFO = JSON.parse(document.getElementById('grafo').textContent);
// carga de teste: ?carga=1300 (arquivo local) ou #carga1300 (página hospedada)
const CARGA = Math.min(5000, parseInt(new URLSearchParams(location.search).get('carga') || (location.hash.match(/^#carga(\d+)$/) || [])[1] || '0', 10) || 0);
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
  arquivo: '#58627e', sistema: '#fff1d6',
};
// regiões da galáxia (o extrator ainda chama de "lobo": l)
const REGIOES = [
  { id: 'frontal', nome: 'Conhecimento', curto: 'CON', onde: 'braço do conhecimento' },
  { id: 'motor', nome: 'Decisões', curto: 'DEC', onde: 'braço das decisões' },
  { id: 'parietal', nome: 'Projetos', curto: 'PRO', onde: 'ponta do braço das decisões' },
  { id: 'temporal', nome: 'Regras e métodos', curto: 'REG', onde: 'braço das regras' },
  { id: 'occipital', nome: 'Incidentes', curto: 'INC', onde: 'ponta do braço das regras' },
  { id: 'cerebelo', nome: 'Fontes', curto: 'FON', onde: 'braço das fontes' },
  { id: 'tronco', nome: 'Arquivo', curto: 'ARQ', onde: 'halo' },
  { id: 'talamo', nome: 'Núcleo', curto: 'NUC', onde: 'núcleo' },
];
const REG_IDX = Object.fromEntries(REGIOES.map((l, i) => [l.id, i]));
const NOME_TIPO = {
  regra: 'regra', incidente: 'incidente', decisao: 'decisão', metodo: 'método',
  conhecimento: 'conhecimento', projeto: 'projeto', fonte: 'fonte', pesquisa: 'pesquisa',
  arquivo: 'arquivo', sistema: 'sistema',
};
// paleta SHO das referências do dono
const SHO = {
  ferrugem: new THREE.Color('#8c3b22'), laranja: new THREE.Color('#e0733a'), ouro: new THREE.Color('#f0b44c'),
  teal: new THREE.Color('#3cc3d0'), cavidade: new THREE.Color('#2a4fb8'), nucleo: new THREE.Color('#fff1d6'),
  violeta: new THREE.Color('#4a3a8c'),
};

const mqReduzido = matchMedia('(prefers-reduced-motion: reduce)');
const estado = {
  esconderArquivo: false, fundo: true, reduzidos: false, eeg: true,
  regiao: null, selecionado: -1, sobre: -1, demo: true, qualidadeAjustada: false,
  get movimentoReduzido() { return mqReduzido.matches; },
};

// ---------- aleatório determinístico e ruído ----------
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

// ---------- geometria da galáxia ----------
// espiral logarítmica: θ(r) = θ0 + K·ln(r/R0); y é o eixo do disco
const K = 2.35, R0 = 0.14;
const BRACOS = {
  frontal: { theta0: 0, r: [0.18, 1.0] },
  temporal: { theta0: Math.PI / 2, r: [0.16, 0.56] },
  occipital: { theta0: Math.PI / 2, r: [0.56, 1.0] },
  motor: { theta0: Math.PI, r: [0.16, 0.6] },
  parietal: { theta0: Math.PI, r: [0.6, 0.96] },
  cerebelo: { theta0: Math.PI * 1.5, r: [0.2, 0.82] },
};
const thetaDe = (theta0, r) => theta0 + K * Math.log(Math.max(r, 0.02) / R0);

const N0 = GRAFO.nos.length;
const CAP = N0 + 96;
const nos = GRAFO.nos.map((n, i) => ({ ...n, i, viz: [] }));
for (const [a, b] of GRAFO.arestas) { nos[a].viz.push(b); nos[b].viz.push(a); }
const posicoes = new Float32Array(CAP * 3);

// sub-regiões viram aglomerados ao longo do braço; comprimento ∝ √notas
function faixasDeSub(regiao) {
  const contagem = new Map();
  for (const n of nos) if (n.l === regiao) contagem.set(n.s, (contagem.get(n.s) || 0) + 1);
  const subs = [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const [r0, r1] = BRACOS[regiao].r;
  const pesos = subs.map(([, q]) => Math.sqrt(q)), total = pesos.reduce((a, b) => a + b, 0) || 1;
  // alterna dentro/fora para o maior não ficar sempre colado ao núcleo
  const ordem = subs.map((_, k) => k).sort((a, b) => (a % 2) - (b % 2) || (a % 2 ? b - a : a - b));
  const faixas = new Map();
  let r = r0;
  for (const k of ordem) {
    const len = (r1 - r0) * pesos[k] / total;
    faixas.set(subs[k][0], [r, r + len]);
    r += len;
  }
  return faixas;
}
const FAIXAS = { frontal: faixasDeSub('frontal'), parietal: faixasDeSub('parietal') };

function posicionar(n) {
  const r = rng(hash(n.id));
  const out = new THREE.Vector3();
  if (n.id === '00_PAINEL') return out.set(0, 0, 0);
  if (n.l === 'talamo') {
    return out.set(gauss(r) * 0.035, gauss(r) * 0.022, gauss(r) * 0.035);
  }
  if (n.l === 'tronco') {
    const ang = r() * Math.PI * 2, rr = 1.04 + r() * 0.34;
    return out.set(Math.cos(ang) * rr, gauss(r) * 0.07, Math.sin(ang) * rr);
  }
  const braco = BRACOS[n.l] || BRACOS.frontal;
  const faixa = FAIXAS[n.l]?.get(n.s) || braco.r;
  const raio = faixa[0] + Math.pow(r(), 0.85) * (faixa[1] - faixa[0]);
  const espalha = 0.065 + raio * 0.035;
  const theta = thetaDe(braco.theta0, raio) + gauss(r) * espalha;
  const rr = raio + gauss(r) * 0.016;
  return out.set(Math.cos(theta) * rr, gauss(r) * 0.016 * (1.25 - raio * 0.6), Math.sin(theta) * rr);
}
nos.forEach((n) => { const p = posicionar(n); posicoes.set([p.x, p.y, p.z], n.i * 3); });

// curva da sinapse: arqueia em direção ao núcleo e acompanha o giro dos braços
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3(), tmpP = new THREE.Vector3();
function controle(a, b, out) {
  out.addVectors(a, b).multiplyScalar(0.5);
  const d = a.distanceTo(b);
  const encolhe = 1 - Math.min(0.45, d * 0.35);
  const ang = 0.28 * Math.min(1, d);
  const x = out.x * encolhe, z = out.z * encolhe;
  return out.set(x * Math.cos(ang) - z * Math.sin(ang), out.y, x * Math.sin(ang) + z * Math.cos(ang));
}
function pontoCurva(a, c, b, t, out) {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z);
}

// ---------- cena ----------
const palco = document.getElementById('palco');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
} catch (e) {
  document.getElementById('sem-webgl').hidden = false;
  throw e;
}
renderer.setClearColor(0x070b16, 1);
palco.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const FOV = 50;
const camera = new THREE.PerspectiveCamera(FOV, 1, 0.005, 80);
const ALVO_CENTRO = new THREE.Vector3(0, -0.05, 0.12);
const DIR_CENTRO = new THREE.Vector3(0, Math.sin(THREE.MathUtils.degToRad(40)), Math.cos(THREE.MathUtils.degToRad(40)));
camera.position.copy(ALVO_CENTRO).addScaledVector(DIR_CENTRO, 1.5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(ALVO_CENTRO);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 0.03;
controls.maxDistance = 6;
controls.zoomToCursor = true;
controls.zoomSpeed = 1.1;
controls.rotateSpeed = 0.55;
controls.autoRotateSpeed = 0.12;

// fundo: halo do tema e um véu violeta muito leve (referência do voo pela nebulosa)
const fundo = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uAspecto: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uAspecto;
      void main(){ vec2 p = (vUv - vec2(0.5, 0.55)) * vec2(uAspecto, 1.0);
        float h = smoothstep(0.95, 0.0, length(p));
        float v = smoothstep(0.9, 0.0, length(p - vec2(-0.55 * uAspecto, 0.35)));
        vec3 c = mix(vec3(0.0275, 0.043, 0.086), vec3(0.047, 0.086, 0.188), h * 0.85);
        c += vec3(0.05, 0.025, 0.09) * v * 0.55;
        gl_FragColor = vec4(c, 1.0); }`,
  }),
);
fundo.frustumCulled = false; fundo.renderOrder = -10;
scene.add(fundo);

// céu distante (cenário, não são notas)
{
  const r = rng(404), n = 1600, pos = new Float32Array(n * 3), cor = new Float32Array(n * 3), tam = new Float32Array(n);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3(gauss(r), gauss(r), gauss(r)).normalize().multiplyScalar(30);
    pos.set([v.x, v.y, v.z], i * 3);
    c.set(['#ffffff', '#cfe0ff', '#ffe2c4', '#ffd0a8'][Math.floor(r() * 4)]);
    cor.set([c.r, c.g, c.b], i * 3);
    tam[i] = 0.5 + Math.pow(r(), 3) * 1.6;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aCor', new THREE.BufferAttribute(cor, 3));
  g.setAttribute('aTam', new THREE.BufferAttribute(tam, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uDpr: { value: 1 } },
    vertexShader: `attribute vec3 aCor; attribute float aTam; uniform float uDpr; varying vec3 vC;
      void main(){ vC = aCor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aTam * uDpr * 1.6; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float a = exp(-dot(d, d) * 18.0); gl_FragColor = vec4(vC, a * 0.55); }`,
  });
  const ceu = new THREE.Points(g, m); ceu.frustumCulled = false; ceu.renderOrder = -9; ceu.name = 'ceu';
  scene.add(ceu);
}

// ---------- atlas de nuvens procedurais (4×4) ----------
function atlasNuvens() {
  const C = 128, N = 4, cv = document.createElement('canvas');
  cv.width = cv.height = C * N;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(C * N, C * N);
  for (let cell = 0; cell < N * N; cell++) {
    const ox = (cell % N) * C, oy = Math.floor(cell / N) * C, sx = cell * 13.7, sy = cell * 7.3;
    for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
      const u = x / C - 0.5, v = y / C - 0.5;
      const wx = ruido(u * 3 + sx, v * 3 + sy, 1.7) * 0.35, wy = ruido(u * 3 + sx, v * 3 + sy, 9.1) * 0.35;
      let f = 0, amp = 0.5, fr = 2.2;
      for (let o = 0; o < 4; o++) { f += amp * ruido((u + wx) * fr + sx, (v + wy) * fr + sy, o * 3.3); amp *= 0.5; fr *= 2.1; }
      const rad = Math.sqrt(u * u + v * v) * 2;
      const queda = Math.max(0, 1 - rad);
      const val = Math.max(0, Math.min(1, (f * 1.6 + 0.42))) * Math.pow(queda, 1.6);
      const k = ((oy + y) * C * N + ox + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(val * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  return tex;
}
const ATLAS = atlasNuvens();

// ---------- clarões: luz de raios e ondas acendendo a poeira por dentro ----------
const MAX_CLAROES = 6;
const claroes = Array.from({ length: MAX_CLAROES }, () => ({ pos: new THREE.Vector3(), cor: new THREE.Color(), t0: -1e9, forca: 0, raio: 0.1, dur: 600, piscar: false }));
const uClaroes = { value: claroes.map(() => new THREE.Vector4(0, 0, 0, 0)) };
const uClaroesCor = { value: claroes.map(() => new THREE.Vector3()) };
let claroProx = 0;
function clarao(pos, cor, forca, raio, dur, piscar = false) {
  const c = claroes[claroProx++ % MAX_CLAROES];
  c.pos.copy(pos); c.cor.set(cor); c.t0 = agora; c.forca = forca; c.raio = raio; c.dur = dur; c.piscar = piscar;
}
const CLARAO_GLSL = `
  uniform vec4 uClaroes[${MAX_CLAROES}]; uniform vec3 uClaroesCor[${MAX_CLAROES}];
  vec3 luzClaroes(vec3 p) {
    vec3 s = vec3(0.0);
    for (int i = 0; i < ${MAX_CLAROES}; i++) {
      vec4 c = uClaroes[i];
      if (c.w <= 0.001) continue;
      vec3 d = p - c.xyz;
      s += uClaroesCor[i] * c.w * exp(-dot(d, d) / 0.012);
    }
    return s;
  }`;

// ---------- poeira ----------
// brilhante: nuvens SHO; escura: faixas de absorção. Cada nota sopra uma nuvem,
// cada sinapse (amostrada) deixa gás no trajeto. A opacidade global cresce com o total.
const densidade = (s) => 0.2 + 0.8 * (1 - Math.exp(-s / 7000));
const uDens = { value: densidade(GRAFO.arestas.length) };
const uProj = { value: 1 };
const uRegiao = { value: -1 };
const uEscondeArq = { value: 0 };

function corDaPoeira(r, rr, regiao, out) {
  if (regiao === 'tronco') return out.copy(SHO.violeta).lerp(SHO.cavidade, rr() * 0.4);
  if (r < 0.2) return out.copy(SHO.teal).lerp(SHO.cavidade, rr() * 0.8);
  if (r < 0.32) return out.copy(SHO.teal).lerp(SHO.ouro, (r - 0.2) / 0.12 * (0.6 + rr() * 0.4));
  if (r < 0.62) return out.copy(SHO.ouro).lerp(SHO.laranja, (r - 0.32) / 0.3 * (0.5 + rr() * 0.5));
  return out.copy(SHO.laranja).lerp(SHO.ferrugem, Math.min(1, (r - 0.62) / 0.4) * (0.5 + rr() * 0.5));
}

const MAX_POEIRA_ARESTA = 2600;
const nuvemDados = { pos: [], cor: [], tam: [], alfa: [], var: [], rot: [], reg: [] };
const escuraDados = { pos: [], cor: [], tam: [], alfa: [], var: [], rot: [], reg: [] };
function soprar(dest, p, cor, tam, alfa, rr, reg) {
  dest.pos.push(p.x, p.y, p.z); dest.cor.push(cor.r, cor.g, cor.b); dest.tam.push(tam);
  dest.alfa.push(alfa); dest.var.push(Math.floor(rr() * 16)); dest.rot.push(rr() * Math.PI * 2); dest.reg.push(reg);
}
{
  const rr = rng(1234), c = new THREE.Color(), p = new THREE.Vector3();
  // núcleo: brilho quente e cavidade teal em volta
  for (let k = 0; k < 26; k++) {
    p.set(gauss(rr) * 0.05, gauss(rr) * 0.02, gauss(rr) * 0.05);
    c.copy(SHO.nucleo).lerp(SHO.ouro, rr() * 0.5);
    soprar(nuvemDados, p, c, 0.16 + rr() * 0.18, 0.16, rr, 7);
  }
  for (let k = 0; k < 40; k++) {
    const a = rr() * Math.PI * 2, r = 0.1 + rr() * 0.14;
    p.set(Math.cos(a) * r, gauss(rr) * 0.02, Math.sin(a) * r);
    soprar(nuvemDados, p, corDaPoeira(r, rr, 'talamo', c), 0.16 + rr() * 0.12, 0.07, rr, 7);
  }
  // uma nuvem por nota
  for (const n of nos) {
    p.fromArray(posicoes, n.i * 3);
    const r = Math.hypot(p.x, p.z);
    p.x += gauss(rr) * 0.03; p.z += gauss(rr) * 0.03; p.y += gauss(rr) * 0.008;
    const tronco = n.l === 'tronco';
    soprar(nuvemDados, p, corDaPoeira(r, rr, n.l, c), (tronco ? 0.1 : 0.1) + rr() * 0.1, tronco ? 0.035 : 0.13, rr, REG_IDX[n.l] ?? 7);
    // faixa escura do lado de dentro do braço
    if (!tronco && n.l !== 'talamo' && rr() < 0.45) {
      const ang = Math.atan2(p.z, p.x), r2 = Math.max(0.05, r - 0.035 - rr() * 0.03);
      const q = new THREE.Vector3(Math.cos(ang + 0.05) * r2, p.y, Math.sin(ang + 0.05) * r2);
      soprar(escuraDados, q, c.setRGB(0, 0, 0), 0.07 + rr() * 0.07, 0.3, rr, REG_IDX[n.l] ?? 7);
    }
  }
}
// gás das sinapses: amostrado até MAX_POEIRA_ARESTA (a densidade global compensa o resto)
const arestas = GRAFO.arestas.map(([a, b]) => [a, b]);
function gasDaAresta(k, rr, alfaExtra = 1) {
  const [a, b] = arestas[k];
  tmpA.fromArray(posicoes, a * 3); tmpB.fromArray(posicoes, b * 3); controle(tmpA, tmpB, tmpC);
  pontoCurva(tmpA, tmpC, tmpB, 0.2 + rr() * 0.6, tmpP);
  const r = Math.hypot(tmpP.x, tmpP.z), c = new THREE.Color();
  corDaPoeira(r, rr, nos[a].l, c);
  soprar(nuvemDados, tmpP, c, 0.06 + rr() * 0.07, 0.085 * alfaExtra, rr, REG_IDX[nos[a].l] ?? 7);
}
{
  const rr = rng(77), passo = Math.max(1, arestas.length / MAX_POEIRA_ARESTA);
  for (let k = 0; k < arestas.length; k += passo) gasDaAresta(Math.floor(k), rr, Math.min(2, passo));
}

const CAP_NUVEM = nuvemDados.tam.length + 600;
function geometriaPoeira(dados, cap) {
  const g = new THREE.BufferGeometry();
  const mk = (arr, n) => { const a = new Float32Array(cap * n); a.set(arr); return new THREE.BufferAttribute(a, n); };
  g.setAttribute('position', mk(dados.pos, 3));
  g.setAttribute('aCor', mk(dados.cor, 3));
  g.setAttribute('aTam', mk(dados.tam, 1));
  g.setAttribute('aAlfa', mk(dados.alfa, 1));
  g.setAttribute('aVar', mk(dados.var, 1));
  g.setAttribute('aRot', mk(dados.rot, 1));
  g.setAttribute('aReg', mk(dados.reg, 1));
  g.setDrawRange(0, dados.tam.length);
  return g;
}
const POEIRA_VS = `attribute vec3 aCor; attribute float aTam; attribute float aAlfa; attribute float aVar; attribute float aRot; attribute float aReg;
  uniform float uProj; uniform float uDens; uniform float uRegiao; uniform float uEscondeArq;
  varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  ${CLARAO_GLSL}
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float z = -mv.z;
    float px = aTam * uProj / z;
    gl_PointSize = min(px, 360.0);
    // perto da câmera a nuvem se abre e some: é o voo atravessando o gás
    float perto = smoothstep(0.015, 0.16, z);
    float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
    if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
    vA = aAlfa * uDens * perto * filtro * min(1.0, px / 360.0 > 1.0 ? 360.0 / px : 1.0);
    vCor = aCor; vVar = aVar; vRot = aRot; vLuz = luzClaroes(position) * filtro;
    gl_Position = projectionMatrix * mv;
  }`;
const POEIRA_FS = (escura) => `uniform sampler2D uAtlas; varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  void main(){
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
    if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
    vec2 cel = vec2(mod(vVar, 4.0), floor(vVar / 4.0));
    float t = texture2D(uAtlas, (cel + p) / 4.0).a;
    ${escura
      ? 'float l = clamp(dot(vLuz, vec3(0.33)), 0.0, 1.0); gl_FragColor = vec4(0.0, 0.0, 0.0, t * vA * (1.0 - l));'
      : 'gl_FragColor = vec4(vCor * t * vA + vLuz * t * 0.9, 1.0);'}
  }`;
function materialPoeira(escura) {
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false,
    uniforms: { uAtlas: { value: ATLAS }, uProj, uDens, uRegiao, uEscondeArq, uClaroes, uClaroesCor },
    vertexShader: POEIRA_VS, fragmentShader: POEIRA_FS(escura),
  });
  m.blending = THREE.CustomBlending;
  if (escura) { m.blendSrc = THREE.ZeroFactor; m.blendDst = THREE.OneMinusSrcAlphaFactor; }
  else { m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor; }
  return m;
}
const nuvemGeo = geometriaPoeira(nuvemDados, CAP_NUVEM);
const nuvens = new THREE.Points(nuvemGeo, materialPoeira(false));
nuvens.frustumCulled = false; nuvens.renderOrder = 1;
const escuraGeo = geometriaPoeira(escuraDados, escuraDados.tam.length);
const escura = new THREE.Points(escuraGeo, materialPoeira(true));
escura.frustumCulled = false; escura.renderOrder = 2;
scene.add(nuvens, escura);

// ---------- brilhos: um grão de poeira estelar por sinapse ----------
const CAP_ARESTAS = arestas.length + 400;
const brilhoPos = new Float32Array(CAP_ARESTAS * 3), brilhoFase = new Float32Array(CAP_ARESTAS), brilhoReg = new Float32Array(CAP_ARESTAS), brilhoNasc = new Float32Array(CAP_ARESTAS).fill(1);
function brilhoDaAresta(k, rr) {
  const [a, b] = arestas[k];
  tmpA.fromArray(posicoes, a * 3); tmpB.fromArray(posicoes, b * 3); controle(tmpA, tmpB, tmpC);
  pontoCurva(tmpA, tmpC, tmpB, 0.15 + rr() * 0.7, tmpP);
  brilhoPos.set([tmpP.x + gauss(rr) * 0.006, tmpP.y + gauss(rr) * 0.003, tmpP.z + gauss(rr) * 0.006], k * 3);
  brilhoFase[k] = rr() * 100;
  brilhoReg[k] = REG_IDX[nos[a].l] ?? 7;
}
{ const rr = rng(31); arestas.forEach((_, k) => brilhoDaAresta(k, rr)); }
const brilhoGeo = new THREE.BufferGeometry();
brilhoGeo.setAttribute('position', new THREE.BufferAttribute(brilhoPos, 3));
brilhoGeo.setAttribute('aFase', new THREE.BufferAttribute(brilhoFase, 1));
brilhoGeo.setAttribute('aReg', new THREE.BufferAttribute(brilhoReg, 1));
brilhoGeo.setAttribute('aNasc', new THREE.BufferAttribute(brilhoNasc, 1));
brilhoGeo.setDrawRange(0, arestas.length);
const uTempo = { value: 0 }, uDpr = { value: 1 };
const brilhoMat = new THREE.ShaderMaterial({
  transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uTempo, uDpr, uRegiao, uEscondeArq, uClaroes, uClaroesCor, uDens },
  vertexShader: `attribute float aFase; attribute float aReg; attribute float aNasc; uniform float uTempo; uniform float uDpr; uniform float uRegiao; uniform float uEscondeArq; uniform float uDens;
    varying float vA; varying vec3 vLuz;
    ${CLARAO_GLSL}
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float pisca = 0.55 + 0.45 * sin(uTempo * (0.6 + fract(aFase) * 1.4) + aFase);
      float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
      if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
      vA = pisca * filtro * aNasc * (0.5 + 0.5 * uDens) * smoothstep(0.0, 0.08, -mv.z);
      vLuz = luzClaroes(position);
      gl_PointSize = (1.3 + 1.6 * aNasc * step(aNasc, 0.999)) * uDpr * clamp(1.4 / -mv.z, 0.8, 3.0);
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying float vA; varying vec3 vLuz;
    void main(){ vec2 d = gl_PointCoord - 0.5; float g = exp(-dot(d, d) * 14.0);
      gl_FragColor = vec4((vec3(1.0, 0.86, 0.62) * 0.4 + vLuz * 1.2) * g * vA, 1.0); }`,
});
brilhoMat.blending = THREE.CustomBlending; brilhoMat.blendSrc = THREE.OneFactor; brilhoMat.blendDst = THREE.OneFactor;
const brilhos = new THREE.Points(brilhoGeo, brilhoMat);
brilhos.frustumCulled = false; brilhos.renderOrder = 3;
scene.add(brilhos);

// ---------- filetes: as sinapses quase invisíveis, só para ligar o desenho ----------
const SEG = 5;
const filPos = new Float32Array(CAP_ARESTAS * SEG * 6), filAlfa = new Float32Array(CAP_ARESTAS * SEG * 2), filPeso = new Float32Array(CAP_ARESTAS);
function escreverFilete(k) {
  const [a, b] = arestas[k];
  tmpA.fromArray(posicoes, a * 3); tmpB.fromArray(posicoes, b * 3); controle(tmpA, tmpB, tmpC);
  filPeso[k] = Math.exp(-tmpA.distanceTo(tmpB) * 3.2);
  let o = k * SEG * 6;
  const prev = tmpA.clone();
  for (let s = 1; s <= SEG; s++) {
    pontoCurva(tmpA, tmpC, tmpB, s / SEG, tmpP);
    filPos[o++] = prev.x; filPos[o++] = prev.y; filPos[o++] = prev.z;
    filPos[o++] = tmpP.x; filPos[o++] = tmpP.y; filPos[o++] = tmpP.z;
    prev.copy(tmpP);
  }
}
arestas.forEach((_, k) => escreverFilete(k));
const filGeo = new THREE.BufferGeometry();
filGeo.setAttribute('position', new THREE.BufferAttribute(filPos, 3));
filGeo.setAttribute('aAlfa', new THREE.BufferAttribute(filAlfa, 1));
filGeo.setDrawRange(0, arestas.length * SEG * 2);
const filMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  uniforms: { uAlfa: { value: 0.07 } },
  vertexShader: `attribute float aAlfa; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = aAlfa * smoothstep(0.0, 0.1, -mv.z); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uAlfa; varying float vA; void main(){ gl_FragColor = vec4(vec3(1.0, 0.78, 0.5), uAlfa * vA); }`,
});
const filetes = new THREE.LineSegments(filGeo, filMat);
filetes.frustumCulled = false; filetes.renderOrder = 4;
scene.add(filetes);

const realceGeo = new THREE.BufferGeometry();
const realcePos = new Float32Array(400 * SEG * 6);
realceGeo.setAttribute('position', new THREE.BufferAttribute(realcePos, 3));
realceGeo.setDrawRange(0, 0);
const realceMat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false });
const realce = new THREE.LineSegments(realceGeo, realceMat);
realce.frustumCulled = false; realce.renderOrder = 5;
scene.add(realce);

// ---------- estrelas (notas) ----------
const aTam = new Float32Array(CAP), aAtiv = new Float32Array(CAP), aCor = new Float32Array(CAP * 3), aVis = new Float32Array(CAP), aNasc = new Float32Array(CAP), aEspinho = new Float32Array(CAP);
const corTmp = new THREE.Color();
function configurarNo(n) {
  const grau = n.viz.length;
  aTam[n.i] = n.id === '00_PAINEL' ? 5.0 : 1.3 + Math.min(3.2, Math.log2(1 + grau) * 0.5);
  aEspinho[n.i] = (grau >= 40 || n.id === '00_PAINEL') ? 1 : 0;
  corTmp.set(COR[n.k] || COR.sistema);
  aCor.set([corTmp.r, corTmp.g, corTmp.b], n.i * 3);
  aVis[n.i] = 1;
  aNasc[n.i] = 1;
}
nos.forEach(configurarNo);
const noGeo = new THREE.BufferGeometry();
noGeo.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
for (const [k, arr, n] of [['aTam', aTam, 1], ['aAtiv', aAtiv, 1], ['aCor', aCor, 3], ['aVis', aVis, 1], ['aNasc', aNasc, 1], ['aEspinho', aEspinho, 1]]) {
  noGeo.setAttribute(k, new THREE.BufferAttribute(arr, n));
}
noGeo.setDrawRange(0, N0);
const uEscala = { value: 1 };
const noMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false,
  uniforms: { uEscala, uArquivo: { value: new THREE.Color('#58627e') }, uClaroes, uClaroesCor },
  vertexShader: `attribute float aTam; attribute float aAtiv; attribute vec3 aCor; attribute float aVis; attribute float aNasc; attribute float aEspinho;
    uniform float uEscala;
    varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float a = clamp(aAtiv, 0.0, 1.6);
      vHalo = 1.0 + a * 6.0 + (1.0 - aNasc) * 10.0;
      vEsp = aEspinho;
      float z = -mv.z;
      gl_PointSize = min(aTam * vHalo * (1.0 + aEspinho * 2.6) * uEscala * clamp(1.6 / z, 0.6, 14.0), 260.0) * aVis;
      vAtiv = a; vCor = aCor; vVis = aVis; vPerto = smoothstep(0.004, 0.03, z);
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0;
      if (r2 > 1.0) discard;
      float esc = vHalo * (1.0 + vEsp * 2.6);
      float nucleo = exp(-r2 * 7.0 * esc * esc);
      float halo = exp(-r2 * 4.0) * min(vAtiv, 1.0);
      // raios de difração em cruz nas estrelas-hub, como na foto de referência
      vec2 q = abs(d) * 2.0;
      float esp = vEsp * (exp(-q.x * 70.0) * exp(-q.y * 3.2) + exp(-q.y * 70.0) * exp(-q.x * 3.2)) * (0.55 + vAtiv);
      vec3 repouso = mix(vec3(1.0, 0.96, 0.9), vCor, 0.38);
      vec3 c = mix(repouso, vCor, smoothstep(0.0, 0.35, vAtiv));
      float brilho = nucleo * (0.9 + vAtiv * 1.6) + halo * 0.6 + esp * 0.7;
      gl_FragColor = vec4(c * brilho * vVis * vPerto, 1.0); }`,
});
noMat.blending = THREE.CustomBlending; noMat.blendSrc = THREE.OneFactor; noMat.blendDst = THREE.OneFactor;
const estrelas = new THREE.Points(noGeo, noMat);
estrelas.frustumCulled = false; estrelas.renderOrder = 6;
scene.add(estrelas);

// ---------- pulsos de luz pelos filetes ----------
const MAX_PULSOS = 700;
const pulPos = new Float32Array(MAX_PULSOS * 3), pulCor = new Float32Array(MAX_PULSOS * 3), pulForca = new Float32Array(MAX_PULSOS);
const pulGeo = new THREE.BufferGeometry();
pulGeo.setAttribute('position', new THREE.BufferAttribute(pulPos, 3));
pulGeo.setAttribute('aCor', new THREE.BufferAttribute(pulCor, 3));
pulGeo.setAttribute('aForca', new THREE.BufferAttribute(pulForca, 1));
const pontoBrilhanteVS = `attribute vec3 aCor; attribute float aForca; uniform float uEscala; varying vec3 vCor; varying float vF;
  void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vCor = aCor; vF = aForca;
    gl_PointSize = min((2.0 + 6.0 * aForca) * uEscala * clamp(1.6 / -mv.z, 0.6, 10.0), 120.0); gl_Position = projectionMatrix * mv; }`;
const pontoBrilhanteFS = `varying vec3 vCor; varying float vF;
  void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d) * 4.0; if (r2 > 1.0) discard;
    float g = exp(-r2 * 6.0) * 0.8 + exp(-r2 * 40.0);
    gl_FragColor = vec4(vCor * g * vF, 1.0); }`;
function materialPontoBrilhante() {
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, uniforms: { uEscala }, vertexShader: pontoBrilhanteVS, fragmentShader: pontoBrilhanteFS });
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor;
  return m;
}
const pulsosObj = new THREE.Points(pulGeo, materialPontoBrilhante());
pulsosObj.frustumCulled = false; pulsosObj.renderOrder = 7;
scene.add(pulsosObj);
const pulsos = [];

// ---------- raios (trovão) ----------
const MAX_RAIOS = 24, PONTOS_RAIO = 72;
const raioPos = new Float32Array(MAX_RAIOS * PONTOS_RAIO * 2 * 3), raioAlfa = new Float32Array(MAX_RAIOS * PONTOS_RAIO * 2);
const raioGeo = new THREE.BufferGeometry();
raioGeo.setAttribute('position', new THREE.BufferAttribute(raioPos, 3));
raioGeo.setAttribute('aAlfa', new THREE.BufferAttribute(raioAlfa, 1));
raioGeo.setDrawRange(0, 0);
const raioMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false,
  vertexShader: `attribute float aAlfa; varying float vA; void main(){ vA = aAlfa; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `varying float vA; void main(){ gl_FragColor = vec4(vec3(0.92, 0.96, 1.0) * vA, 1.0); }`,
});
raioMat.blending = THREE.CustomBlending; raioMat.blendSrc = THREE.OneFactor; raioMat.blendDst = THREE.OneFactor;
const raiosLinhas = new THREE.LineSegments(raioGeo, raioMat);
raiosLinhas.frustumCulled = false; raiosLinhas.renderOrder = 8;
const MAX_FAISCAS = MAX_RAIOS * 40;
const faiPos = new Float32Array(MAX_FAISCAS * 3), faiCor = new Float32Array(MAX_FAISCAS * 3), faiForca = new Float32Array(MAX_FAISCAS);
const faiGeo = new THREE.BufferGeometry();
faiGeo.setAttribute('position', new THREE.BufferAttribute(faiPos, 3));
faiGeo.setAttribute('aCor', new THREE.BufferAttribute(faiCor, 3));
faiGeo.setAttribute('aForca', new THREE.BufferAttribute(faiForca, 1));
const faiscas = new THREE.Points(faiGeo, materialPontoBrilhante());
faiscas.frustumCulled = false; faiscas.renderOrder = 8;
scene.add(raiosLinhas, faiscas);
const raios = [];
const rRaio = rng(4242);
// deslocamento do ponto médio: o caminho quebrado do relâmpago, com galhos
function tracarRaio(a, b, nivel, out, galhos) {
  const pts = [a.clone(), b.clone()];
  let desloc = a.distanceTo(b) * 0.3;
  for (let k = 0; k < nivel; k++) {
    for (let i = pts.length - 1; i > 0; i--) {
      const m = pts[i - 1].clone().add(pts[i]).multiplyScalar(0.5);
      m.add(new THREE.Vector3(gauss(rRaio), gauss(rRaio) * 0.5, gauss(rRaio)).multiplyScalar(desloc));
      pts.splice(i, 0, m);
    }
    desloc *= 0.52;
  }
  out.push(pts);
  if (galhos > 0) {
    for (let g = 0; g < galhos; g++) {
      const i = 2 + Math.floor(rRaio() * (pts.length - 4));
      const dir = pts[i + 1].clone().sub(pts[i - 1]).normalize();
      dir.add(new THREE.Vector3(gauss(rRaio), gauss(rRaio) * 0.4, gauss(rRaio)).multiplyScalar(0.9)).normalize();
      const fim = pts[i].clone().addScaledVector(dir, a.distanceTo(b) * (0.18 + rRaio() * 0.22));
      tracarRaio(pts[i], fim, Math.max(2, nivel - 2), out, 0);
    }
  }
  return out;
}
function raio(de, para, cor, forca = 1) {
  if (estado.movimentoReduzido) { clarao(para, cor, 0.5 * forca, 0.1, 500); return; }
  const linhas = tracarRaio(de, para, 5, [], estado.reduzidos ? 1 : 3);
  if (raios.length >= MAX_RAIOS) raios.shift();
  raios.push({ linhas, t0: agora, dur: 520, cor: new THREE.Color(cor), forca });
  clarao(de, cor, 0.9 * forca, 0.1, 700, true);
  clarao(para, '#cfe6ff', 0.7 * forca, 0.1, 600, true);
}
// cintilação do relâmpago: acende, quase apaga, reacende e morre
function cintila(u) {
  if (u < 0.12) return 1;
  if (u < 0.22) return 0.25;
  if (u < 0.42) return 0.9;
  return Math.max(0, 1 - (u - 0.42) / 0.58) * 0.8;
}

// ---------- onda de choque da captura ----------
const ondaMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
  uniforms: { uP: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform float uP; varying vec2 vUv;
    void main(){ float r = length(vUv - 0.5) * 2.0;
      float anel = exp(-pow((r - 0.96) / 0.035, 2.0)) + 0.35 * exp(-pow((r - 0.9) / 0.08, 2.0));
      float a = anel * pow(1.0 - uP, 1.6) * step(r, 1.0);
      gl_FragColor = vec4(vec3(0.62, 0.92, 1.0) * a * 1.2, 1.0); }`,
});
ondaMat.blending = THREE.CustomBlending; ondaMat.blendSrc = THREE.OneFactor; ondaMat.blendDst = THREE.OneFactor;
const ondaMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ondaMat);
ondaMesh.rotation.x = -Math.PI / 2; ondaMesh.visible = false; ondaMesh.renderOrder = 7; ondaMesh.frustumCulled = false;
scene.add(ondaMesh);
let onda = null;

// ---------- nascimento: poeira que condensa numa estrela ----------
const MAX_COND = 240;
const condPos = new Float32Array(MAX_COND * 3), condCor = new Float32Array(MAX_COND * 3), condForca = new Float32Array(MAX_COND);
const condGeo = new THREE.BufferGeometry();
condGeo.setAttribute('position', new THREE.BufferAttribute(condPos, 3));
condGeo.setAttribute('aCor', new THREE.BufferAttribute(condCor, 3));
condGeo.setAttribute('aForca', new THREE.BufferAttribute(condForca, 1));
const condensacao = new THREE.Points(condGeo, materialPontoBrilhante());
condensacao.frustumCulled = false; condensacao.renderOrder = 7;
scene.add(condensacao);
const graos = [];

function vivo(i) { return aVis[i] > 0.5 && aNasc[i] > 0; }
function disparar(i, forca) { aAtiv[i] = Math.max(aAtiv[i], forca); }
const posDe = (i, out = new THREE.Vector3()) => out.fromArray(posicoes, i * 3);
function enviarPulso(de, para, forca, cor, aoChegar) {
  if (pulsos.length >= (estado.reduzidos ? 160 : MAX_PULSOS)) return;
  if (!vivo(de) || !vivo(para)) return;
  const a = posDe(de), b = posDe(para), c = controle(a, b, new THREE.Vector3());
  const dur = estado.movimentoReduzido ? 0 : 300 + a.distanceTo(b) * 700;
  pulsos.push({ a, b, c, t0: agora, dur, forca, cor, aoChegar });
}
const rEmb = rng(99);
function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rEmb() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function propagar(i, forca, saltos, cor, leque = 12) {
  disparar(i, forca);
  if (saltos <= 0) return;
  const viz = embaralhar(nos[i].viz.filter(vivo)).slice(0, leque);
  viz.forEach((j, k) => {
    setTimeout(() => enviarPulso(i, j, forca * 0.8, cor, () => {
      propagar(j, forca * 0.55, saltos - 1, cor, Math.max(3, Math.floor(leque / 2.5)));
    }), estado.movimentoReduzido ? 0 : k * 30);
  });
}

// ---------- sinal: um canal por região ----------
const eeg = { canvas: document.querySelector('#eeg canvas'), eventos: [], janela: 300000 };
const ctxEEG = eeg.canvas.getContext('2d');
let eegUltimo = 0, eegPendente = false;
function registrarEEG(i, amp, cor) {
  eeg.eventos.push({ t: Date.now(), canal: REG_IDX[nos[i].l] ?? 7, amp, cor, no: i });
  if (eeg.eventos.length > 2000) eeg.eventos.splice(0, 500);
  eegPendente = true;
}
function geometriaEEG(W, H) {
  const estreito = W < 560;
  return { estreito, x0: estreito ? 40 : 118, x1: W - (estreito ? 12 : 22), topo: 6, alt: (H - 6 - 18) / REGIOES.length };
}
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
  const { estreito, x0, x1, topo, alt } = geometriaEEG(W, H);
  const grad = c.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(7,11,22,0)'); grad.addColorStop(0.35, 'rgba(7,11,22,.7)'); grad.addColorStop(1, 'rgba(7,11,22,.9)');
  c.fillStyle = grad; c.fillRect(0, 0, W, H);
  c.font = '500 11px Manrope, system-ui, sans-serif';
  c.textBaseline = 'middle';
  const span = eeg.janela, passo = 2;
  const porCanal = REGIOES.map(() => []);
  const minT = now - span - 4000;
  for (const e of eeg.eventos) if (e.t > minT) porCanal[e.canal].push(e);
  REGIOES.forEach((l, ci) => {
    const y = topo + alt * (ci + 0.5);
    const filtrado = estado.regiao && estado.regiao !== l.id;
    c.fillStyle = filtrado ? 'rgba(141,151,179,.45)' : '#8d97b3';
    c.textAlign = 'left';
    c.fillText(estreito ? l.curto : l.nome, estreito ? 8 : 22, y);
    const nAm = Math.floor((x1 - x0) / passo) + 1;
    const val = new Float32Array(nAm), maior = new Float32Array(nAm), corPico = new Array(nAm).fill(null);
    for (let a = 0; a < nAm; a++) {
      const t = now - (x1 - (x0 + a * passo)) / (x1 - x0) * span;
      val[a] = (ruido(Math.floor(t / 700) * 0.37, ci * 3.1, 0.5) + 0.6 * ruido(t / 300, ci * 7.7, 2.5)) * 0.9;
    }
    for (const e of porCanal[ci]) {
      const xe = x1 - (now - e.t) / span * (x1 - x0);
      const a0 = Math.max(0, Math.floor((xe - 21 - x0) / passo)), a1 = Math.min(nAm - 1, Math.ceil((xe + 42 - x0) / passo));
      for (let a = a0; a <= a1; a++) {
        const d = (x0 + a * passo - xe) / 7;
        const k = e.amp * (Math.exp(-(d * d) * 1.4) * 9 - Math.exp(-((d - 1.2) ** 2) * 1.2) * 4);
        val[a] += k;
        if (Math.abs(k) > maior[a]) { maior[a] = Math.abs(k); corPico[a] = e.cor; }
      }
    }
    const base = filtrado ? 'rgba(240,180,76,.10)' : 'rgba(240,180,76,.30)';
    let corAtual = null;
    for (let a = 1; a < nAm; a++) {
      const cor = (maior[a - 1] > 0.4 ? corPico[a - 1] : null) || (maior[a] > 0.4 ? corPico[a] : null) || base;
      const xa = x0 + (a - 1) * passo, xb = x0 + a * passo;
      const ya = y - val[a - 1] * (alt / 12), yb = y - val[a] * (alt / 12);
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
  c.fillText('−5 min', x0, H - 8);
  c.textAlign = 'right';
  c.fillText('agora', x1, H - 8);
}
function eventoNoEEG(cx, cy) {
  const r = eeg.canvas.getBoundingClientRect();
  const { x0, x1, topo, alt } = geometriaEEG(r.width, r.height);
  const x = cx - r.left, y = cy - r.top;
  const canal = Math.floor((y - topo) / alt);
  if (canal < 0 || canal >= REGIOES.length || x < x0 - 6) return null;
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
const nomeRegiao = (i) => REGIOES[REG_IDX[nos[i].l] ?? 7];
const avisoEl = document.getElementById('evento');
let avisoTimer = 0;
function aviso(texto, cor) {
  avisoEl.innerHTML = '';
  const bola = document.createElement('i'); bola.style.background = cor;
  avisoEl.append(bola);
  texto.split('**').forEach((p, k) => { if (k % 2) { const b = document.createElement('b'); b.textContent = p; avisoEl.append(b); } else avisoEl.append(p); });
  avisoEl.style.opacity = 1;
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => { avisoEl.style.opacity = 0; }, 6000);
}
const painel = Math.max(0, nos.findIndex((n) => n.id === '00_PAINEL'));
const nascendo = [];
const eventos = {
  abrir(i, origem = 'abriu') {
    if (!vivo(i)) return;
    propagar(i, 1.0, 2, corDe(i), 12);
    clarao(posDe(i), corDe(i), 0.35, 0.08, 900);
    registrarEEG(i, 0.75, corDe(i));
    if (origem) aviso(`${origem === 'clique' ? 'Abriria' : 'Abriu'} **${nos[i].t}** · ${NOME_TIPO[nos[i].k]} no ${nomeRegiao(i).onde}`, corDe(i));
  },
  salvar(i) {
    if (!vivo(i)) return;
    disparar(i, 1.5);
    const a = posDe(i);
    const alvos = embaralhar(nos[i].viz.filter(vivo)).slice(0, estado.reduzidos ? 3 : 6);
    alvos.forEach((j, k) => setTimeout(() => {
      raio(a, posDe(j), corDe(i), 1);
      setTimeout(() => disparar(j, 0.9), 60);
    }, estado.movimentoReduzido ? 0 : k * 70));
    registrarEEG(i, 1.0, corDe(i));
    aviso(`Salvou **${nos[i].t}** · raio para ${alvos.length} ${alvos.length === 1 ? 'nota ligada' : 'notas ligadas'}`, corDe(i));
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
    const ligar = [origem, ...embaralhar(base.viz.slice()).slice(0, 2)];
    const rr = rng(hash(n.id));
    const novas = [];
    for (const j of ligar) {
      if (arestas.length >= CAP_ARESTAS) break;
      arestas.push([j, i]); n.viz.push(j); nos[j].viz.push(i);
      const k = arestas.length - 1;
      escreverFilete(k); brilhoDaAresta(k, rr); brilhoNasc[k] = 0;
      for (let s = 0; s < SEG * 2; s++) filAlfa[k * SEG * 2 + s] = 0;
      novas.push(k);
      // a sinapse nova deposita gás: a poeira local engrossa
      if (nuvemDados.tam.length < CAP_NUVEM) { gasDaAresta(k, rr, 1.4); }
    }
    // uma nuvem nova em volta da estrela
    if (nuvemDados.tam.length < CAP_NUVEM) {
      const c = new THREE.Color(); corDaPoeira(Math.hypot(p.x, p.z), rr, n.l, c);
      soprar(nuvemDados, p, c, 0.12, 0.08, rr, REG_IDX[n.l] ?? 7);
    }
    atualizarPoeira();
    filGeo.setDrawRange(0, arestas.length * SEG * 2);
    brilhoGeo.setDrawRange(0, arestas.length);
    filGeo.attributes.position.needsUpdate = true;
    brilhoGeo.attributes.position.needsUpdate = true; brilhoGeo.attributes.aFase.needsUpdate = true; brilhoGeo.attributes.aReg.needsUpdate = true;
    noGeo.setDrawRange(0, nos.length);
    ['position', 'aTam', 'aCor', 'aVis', 'aEspinho'].forEach((k) => { noGeo.attributes[k].needsUpdate = true; });
    // grãos de poeira espiralando para o ponto onde a estrela vai acender
    const qtd = estado.reduzidos ? 18 : 44;
    for (let g = 0; g < qtd && graos.length < MAX_COND; g++) {
      const ang = rr() * Math.PI * 2, r = 0.05 + rr() * 0.07;
      graos.push({ alvo: p.clone(), ang, r, y: gauss(rr) * 0.02, t0: agora + rr() * 200, dur: 1300 + rr() * 300, cor: corDaPoeira(Math.hypot(p.x, p.z), rr, n.l, new THREE.Color()) });
    }
    nascendo.push({ i, t0: agora, arestas: novas });
    uDens.value = densidade(arestas.length);
    registrarEEG(i, 0.85, corDe(i));
    document.getElementById('n-notas').textContent = fmt(nos.length - SINTETICAS);
    document.getElementById('n-sinapses').textContent = fmt(arestas.length - (GRAFO.arestas.length - GRAFO.sinapses));
    atualizarTextoPoeira();
    aviso(`Nasceu **${n.t}** no ${nomeRegiao(i).onde}, ligada a ${novas.length} notas`, corDe(i));
  },
  captura() {
    // 01_ENTRADA mudou: tempestade a partir do núcleo
    onda = { t0: agora, dur: estado.movimentoReduzido ? 1 : 2200 };
    disparar(painel, 1.4);
    clarao(new THREE.Vector3(0, 0, 0), '#cfe6ff', 0.8, 0.18, 1100, true);
    REGIOES.forEach((_, ci) => { eeg.eventos.push({ t: Date.now(), canal: ci, amp: 0.45, cor: '#cfe6ff', no: painel }); });
    eegPendente = true;
    aviso('Captura nova no **01_ENTRADA** · tempestade a partir do núcleo', '#cfe6ff');
  },
};

// ---------- interação ----------
const rotulo = document.getElementById('rotulo');
const ponteiro = { x: 0, y: 0, dentro: false, moveu: true, baixo: null };
const proj = new THREE.Vector3();
function noSobPonteiro(px, py) {
  const r = renderer.domElement.getBoundingClientRect();
  let melhor = -1, melhorZ = Infinity;
  for (let i = 0; i < nos.length; i++) {
    if (!vivo(i)) continue;
    proj.fromArray(posicoes, i * 3).project(camera);
    if (proj.z > 1 || proj.z < -1) continue;
    const sx = (proj.x * 0.5 + 0.5) * r.width + r.left, sy = (-proj.y * 0.5 + 0.5) * r.height + r.top;
    const d = Math.hypot(sx - px, sy - py);
    if (d < 9 + aTam[i] * 1.5) {
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
  rotulo.querySelector('span').textContent = `${nomeRegiao(i).nome} · ${NOME_TIPO[n.k]} · ${n.viz.length} ${n.viz.length === 1 ? 'sinapse' : 'sinapses'}`;
  const w = rotulo.offsetWidth;
  rotulo.style.left = `${Math.min(x, innerWidth - w - 20)}px`;
  rotulo.style.top = `${y}px`;
  rotulo.classList.add('visivel');
}
renderer.domElement.addEventListener('pointermove', (e) => { ponteiro.x = e.clientX; ponteiro.y = e.clientY; ponteiro.dentro = true; ponteiro.moveu = true; });
renderer.domElement.addEventListener('pointerleave', () => { ponteiro.dentro = false; estado.sobre = -1; mostrarRotulo(-1); });
renderer.domElement.addEventListener('pointerdown', (e) => { ponteiro.baixo = [e.clientX, e.clientY]; pausarGiro(); voo = null; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!ponteiro.baixo) return;
  const moveu = Math.hypot(e.clientX - ponteiro.baixo[0], e.clientY - ponteiro.baixo[1]);
  ponteiro.baixo = null;
  if (moveu > 4) return;
  const i = noSobPonteiro(e.clientX, e.clientY);
  if (i >= 0) { selecionar(i, true); eventos.abrir(i, 'clique'); } else selecionar(-1);
});
renderer.domElement.addEventListener('wheel', () => { pausarGiro(); voo = null; }, { passive: true });

function selecionar(i, centralizar) {
  estado.selecionado = i;
  if (i < 0) { realceGeo.setDrawRange(0, 0); voltarAoCentro(); return; }
  const viz = nos[i].viz.filter(vivo).slice(0, 400);
  const a = posDe(i), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3();
  let o = 0;
  for (const j of viz) {
    posDe(j, b); controle(a, b, c);
    const prev = a.clone();
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
  if (centralizar) voarPara(a, 0.32);
}
// voo cinematográfico: a câmera atravessa a poeira, o campo de visão abre e fecha
let voo = null;
const distanciaCentro = () => 1.5 * Math.max(1, 1.3 / (palco.clientWidth / palco.clientHeight));
function voarPara(alvo, dist, dir = camera.position.clone().sub(controls.target).normalize()) {
  const cam1 = alvo.clone().addScaledVector(dir, dist);
  voo = {
    t0: agora, dur: estado.movimentoReduzido ? 1 : 1700,
    alvo0: controls.target.clone(), alvo1: alvo.clone(),
    cam0: camera.position.clone(), cam1,
    meio: camera.position.clone().lerp(cam1, 0.5).add(new THREE.Vector3(0, 0.08 * camera.position.distanceTo(cam1), 0)),
  };
}
function voltarAoCentro() {
  if (controls.target.distanceTo(ALVO_CENTRO) < 0.01 && Math.abs(camera.position.distanceTo(controls.target) - distanciaCentro()) < 0.05) return;
  voarPara(ALVO_CENTRO, distanciaCentro(), DIR_CENTRO.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z)));
}
let giroTimer = 0;
function pausarGiro() {
  controls.autoRotate = false;
  clearTimeout(giroTimer);
  giroTimer = setTimeout(() => { voltarAoCentro(); controls.autoRotate = !estado.movimentoReduzido; }, 25000);
}
controls.autoRotate = !estado.movimentoReduzido;
mqReduzido.addEventListener('change', () => { controls.autoRotate = !estado.movimentoReduzido; });

// busca por título (sem acento, sem caixa)
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const campo = document.getElementById('busca-campo'), lista = document.getElementById('resultados');
let achados = [], ativo = 0;
function buscar() {
  const q = semAcento(campo.value.trim());
  lista.innerHTML = '';
  if (!q) { lista.hidden = true; campo.setAttribute('aria-expanded', 'false'); return; }
  achados = [];
  for (let i = 0; i < nos.length; i++) {
    if (!vivo(i)) continue;
    const k = semAcento(nos[i].t).indexOf(q);
    if (k >= 0) achados.push([k === 0 ? 0 : 1, -nos[i].viz.length, i]);
  }
  achados.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  achados = achados.slice(0, 8).map((a) => a[2]);
  ativo = 0;
  if (!achados.length) {
    const li = document.createElement('li'); li.className = 'vazio';
    li.textContent = 'Nenhuma estrela com esse título.';
    lista.append(li);
  }
  achados.forEach((i, k) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option'); li.id = `r${k}`;
    li.setAttribute('aria-selected', k === 0 ? 'true' : 'false');
    const p = document.createElement('span'); p.className = 'ponto'; p.style.background = corDe(i);
    const t = document.createElement('span'); t.className = 'titulo'; t.textContent = nos[i].t;
    const l = document.createElement('span'); l.className = 'lobo'; l.textContent = nomeRegiao(i).nome;
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
const regioesEl = document.getElementById('lobos');
[{ id: null, nome: 'Todas' }, ...REGIOES].forEach((l) => {
  const b = document.createElement('button');
  b.textContent = l.nome; b.title = l.onde ? `${l.nome}: ${l.onde}` : 'Todas as regiões';
  b.setAttribute('aria-pressed', l.id === null ? 'true' : 'false');
  b.addEventListener('click', () => {
    estado.regiao = l.id;
    [...regioesEl.children].forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    aplicarVisibilidade();
    desenharEEG(true);
  });
  regioesEl.append(b);
});
function aplicarVisibilidade() {
  for (let i = 0; i < nos.length; i++) {
    const n = nos[i];
    let v = 1;
    if (estado.esconderArquivo && n.l === 'tronco') v = 0;
    else if (estado.regiao && n.l !== estado.regiao) v = 0.14;
    aVis[i] = v;
  }
  for (let k = 0; k < arestas.length; k++) {
    if (nascendo.some((x) => x.arestas.includes(k))) continue;
    const [a, b] = arestas[k];
    const v = Math.min(aVis[a], aVis[b]);
    const base = (v >= 1 ? 1 : v > 0 ? 0.08 : 0) * filPeso[k];
    for (let s = 0; s < SEG * 2; s++) filAlfa[k * SEG * 2 + s] = base;
  }
  uRegiao.value = estado.regiao ? REG_IDX[estado.regiao] : -1;
  uEscondeArq.value = estado.esconderArquivo ? 1 : 0;
  noGeo.attributes.aVis.needsUpdate = true;
  filGeo.attributes.aAlfa.needsUpdate = true;
}
function atualizarPoeira() {
  const g = nuvemGeo, n = nuvemDados.tam.length;
  ['position', 'aCor', 'aTam', 'aAlfa', 'aVar', 'aRot', 'aReg'].forEach((k) => {
    const src = { position: nuvemDados.pos, aCor: nuvemDados.cor, aTam: nuvemDados.tam, aAlfa: nuvemDados.alfa, aVar: nuvemDados.var, aRot: nuvemDados.rot, aReg: nuvemDados.reg }[k];
    g.attributes[k].array.set(src); g.attributes[k].needsUpdate = true;
  });
  g.setDrawRange(0, Math.round(n * (estado.reduzidos || estado.qualidadeAjustada ? 0.6 : 1)));
}
function atualizarTextoPoeira() {
  document.getElementById('poeira').innerHTML = '';
  const el = document.getElementById('poeira');
  const b = document.createElement('b'); b.textContent = `${Math.round(uDens.value * 100)}%`;
  el.append('Poeira estelar ', b, ` · cresce com as sinapses (${fmt(arestas.length - (GRAFO.arestas.length - GRAFO.sinapses))})`);
}
document.getElementById('f-arquivo').addEventListener('change', (e) => { estado.esconderArquivo = e.target.checked; aplicarVisibilidade(); });
document.getElementById('f-fundo').addEventListener('change', (e) => { estado.fundo = e.target.checked; });
document.getElementById('f-reduzidos').addEventListener('change', (e) => { estado.reduzidos = e.target.checked; atualizarPoeira(); redimensionar(false); });
document.getElementById('f-eeg').addEventListener('change', (e) => {
  estado.eeg = e.target.checked;
  document.getElementById('eeg').hidden = !estado.eeg;
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
botaoDemo.addEventListener('click', () => { estado.demo = !estado.demo; botaoDemo.setAttribute('aria-pressed', String(estado.demo)); });
let proxDemo = 1800;
function passoDemo(dt) {
  if (!estado.demo) return;
  proxDemo -= dt;
  if (proxDemo > 0) return;
  const r = rSim();
  if (r < 0.55) { const i = proximaNota(); selecionar(i, false); eventos.abrir(i); proxDemo = 3200 + rSim() * 3500; }
  else if (r < 0.82) { eventos.salvar(foco); proxDemo = 2800 + rSim() * 2600; }
  else if (r < 0.91) { eventos.captura(); proxDemo = 4600; }
  else { eventos.nova(foco); proxDemo = 4600; }
}
{
  const agora0 = Date.now(), r = rng(5);
  for (let k = 0; k < 46; k++) {
    const i = Math.floor(r() * N0), t = agora0 - r() * eeg.janela * 0.98;
    eeg.eventos.push({ t, canal: REG_IDX[nos[i].l] ?? 7, amp: r() < 0.25 ? 0.18 : 0.5 + r() * 0.5, cor: corDe(i), no: i });
  }
  eeg.eventos.sort((a, b) => a.t - b.t);
}

// ---------- laço ----------
const fmt = (n) => n.toLocaleString('pt-BR');
document.getElementById('n-notas').textContent = fmt(GRAFO.notas);
document.getElementById('n-sinapses').textContent = fmt(GRAFO.sinapses);
let agora = performance.now(), ultimo = agora, fundoTimer = 600, trovaoLonge = 9000, rodando = true, raf = 0;
const quadros = []; const perfEl = document.getElementById('desempenho');
let lentoDesde = 0;
aplicarVisibilidade();
atualizarTextoPoeira();

function redimensionar(reenquadrar = true) {
  const w = palco.clientWidth, h = palco.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, estado.reduzidos || estado.qualidadeAjustada ? 1 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  if (reenquadrar && !voo) {
    camera.position.sub(controls.target).setLength(distanciaCentro()).add(controls.target);
  }
  camera.updateProjectionMatrix();
  // tamanho de mundo → pixels: metade da altura do viewport sobre tan(fov/2)
  uProj.value = (h * dpr / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  uEscala.value = h * dpr * 0.0016;
  uDpr.value = dpr;
  scene.getObjectByName('ceu').material.uniforms.uDpr.value = dpr;
  fundo.material.uniforms.uAspecto.value = w / h;
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
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function quadro(t) {
  if (!rodando) return;
  agora = t;
  const dt = Math.min(64, t - ultimo); ultimo = t;
  quadros.push(dt); if (quadros.length > 90) quadros.shift();
  uTempo.value = t / 1000;

  // atividade de fundo: estrelas cintilando e, de vez em quando, um trovão distante na poeira
  if (estado.fundo) {
    fundoTimer -= dt;
    if (fundoTimer <= 0) {
      const i = Math.floor(Math.random() * nos.length);
      if (vivo(i)) {
        disparar(i, 0.22 + Math.random() * 0.12);
        if (Math.random() < 0.15 && !estado.reduzidos) {
          const j = nos[i].viz[Math.floor(Math.random() * nos[i].viz.length)];
          if (j !== undefined) enviarPulso(i, j, 0.35, corDe(i), () => disparar(j, 0.18));
        }
      }
      fundoTimer = (estado.reduzidos ? 900 : 280) + Math.random() * 520;
    }
    trovaoLonge -= dt;
    if (trovaoLonge <= 0 && !estado.movimentoReduzido) {
      const i = Math.floor(Math.random() * N0);
      if (vivo(i)) clarao(posDe(i), Math.random() < 0.5 ? '#f0b44c' : '#3cc3d0', 0.32, 0.12, 900, true);
      trovaoLonge = 9000 + Math.random() * 9000;
    }
  }
  passoDemo(dt);

  // clarões → uniformes (com a cintilação de relâmpago quando pedida)
  for (let k = 0; k < MAX_CLAROES; k++) {
    const c = claroes[k], u = (t - c.t0) / c.dur;
    const f = u < 0 || u >= 1 ? 0 : c.forca * (c.piscar ? cintila(u) : Math.pow(1 - u, 2));
    uClaroes.value[k].set(c.pos.x, c.pos.y, c.pos.z, f);
    uClaroesCor.value[k].set(c.cor.r, c.cor.g, c.cor.b);
  }

  // onda de choque: anel no plano do disco, raios curtos nos braços quando ela passa
  if (onda) {
    const p = Math.min(1, (t - onda.t0) / onda.dur);
    const r = 0.05 + ease(p) * 1.25;
    ondaMesh.visible = true; ondaMesh.scale.setScalar(r); ondaMat.uniforms.uP.value = p;
    if (!onda.raios) onda.raios = [0.3, 0.55, 0.8].map((x) => ({ x, feito: false }));
    for (const rz of onda.raios) {
      if (!rz.feito && r > rz.x) {
        rz.feito = true;
        for (let q = 0; q < (estado.reduzidos ? 1 : 2); q++) {
          const cands = nos.filter((n) => vivo(n.i) && Math.abs(Math.hypot(posicoes[n.i * 3], posicoes[n.i * 3 + 2]) - rz.x) < 0.04);
          const a = cands[Math.floor(Math.random() * cands.length)];
          if (a && a.viz.length) raio(posDe(a.i), posDe(a.viz[Math.floor(Math.random() * a.viz.length)]), '#cfe6ff', 0.8);
        }
      }
    }
    for (let i = 0; i < nos.length; i++) {
      if (!vivo(i)) continue;
      const d = Math.hypot(posicoes[i * 3], posicoes[i * 3 + 2]);
      if (Math.abs(d - r) < 0.02) disparar(i, 0.4);
    }
    if (p >= 1) { onda = null; ondaMesh.visible = false; }
  }

  const decai = Math.exp(-dt / 850);
  for (let i = 0; i < nos.length; i++) aAtiv[i] = aAtiv[i] > 0.001 ? aAtiv[i] * decai : 0;
  noGeo.attributes.aAtiv.needsUpdate = true;

  // grãos condensando
  let ng = 0;
  for (let k = graos.length - 1; k >= 0; k--) {
    const g = graos[k], u = (t - g.t0) / g.dur;
    if (u >= 1) { graos.splice(k, 1); continue; }
    if (u < 0) continue;
    const e = easeInOut(u), ang = g.ang + e * 5.5, rr = g.r * (1 - e);
    condPos[ng * 3] = g.alvo.x + Math.cos(ang) * rr; condPos[ng * 3 + 1] = g.alvo.y + g.y * (1 - e); condPos[ng * 3 + 2] = g.alvo.z + Math.sin(ang) * rr;
    condCor[ng * 3] = g.cor.r; condCor[ng * 3 + 1] = g.cor.g; condCor[ng * 3 + 2] = g.cor.b;
    condForca[ng] = 0.25 + e * 0.6;
    ng++;
  }
  condGeo.setDrawRange(0, ng);
  condGeo.attributes.position.needsUpdate = true; condGeo.attributes.aCor.needsUpdate = true; condGeo.attributes.aForca.needsUpdate = true;

  // nascimento: a estrela acende quando a poeira termina de cair; depois entram as sinapses
  for (let k = nascendo.length - 1; k >= 0; k--) {
    const b = nascendo[k], p = Math.min(1, (t - b.t0) / (estado.movimentoReduzido ? 1 : 2400));
    const acende = Math.max(0, (p - 0.58) / 0.42);
    aNasc[b.i] = acende > 0 ? Math.max(0.001, ease(acende)) : 0;
    if (acende > 0 && !b.clarao) { b.clarao = true; clarao(posDe(b.i), corDe(b.i), 1.1, 0.1, 900); disparar(b.i, 1.3); }
    const q = Math.max(0, (p - 0.7) / 0.3);
    for (const a of b.arestas) {
      for (let s = 0; s < SEG * 2; s++) filAlfa[a * SEG * 2 + s] = q * 2;
      brilhoNasc[a] = q;
    }
    filGeo.attributes.aAlfa.needsUpdate = true; brilhoGeo.attributes.aNasc.needsUpdate = true;
    if (p >= 1) { nascendo.splice(k, 1); aplicarVisibilidade(); }
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
  pulGeo.attributes.position.needsUpdate = true; pulGeo.attributes.aCor.needsUpdate = true; pulGeo.attributes.aForca.needsUpdate = true;

  // raios: linhas brancas cintilando + faíscas coloridas ao longo do caminho
  let nl = 0, nf = 0;
  for (let k = raios.length - 1; k >= 0; k--) {
    const r = raios[k], u = (t - r.t0) / r.dur;
    if (u >= 1) { raios.splice(k, 1); continue; }
    const a = cintila(u) * r.forca;
    for (const pts of r.linhas) {
      for (let i = 1; i < pts.length && nl < MAX_RAIOS * PONTOS_RAIO; i++) {
        const A = pts[i - 1], B = pts[i];
        raioPos.set([A.x, A.y, A.z, B.x, B.y, B.z], nl * 6);
        raioAlfa[nl * 2] = raioAlfa[nl * 2 + 1] = a;
        nl++;
        if (i % 2 === 0 && nf < MAX_FAISCAS) {
          faiPos.set([B.x, B.y, B.z], nf * 3);
          faiCor.set([r.cor.r, r.cor.g, r.cor.b], nf * 3);
          faiForca[nf] = a * 0.55;
          nf++;
        }
      }
    }
  }
  raioGeo.setDrawRange(0, nl * 2); faiGeo.setDrawRange(0, nf);
  raioGeo.attributes.position.needsUpdate = true; raioGeo.attributes.aAlfa.needsUpdate = true;
  faiGeo.attributes.position.needsUpdate = true; faiGeo.attributes.aCor.needsUpdate = true; faiGeo.attributes.aForca.needsUpdate = true;

  // voo: curva suave por cima, campo de visão abre no meio do caminho
  if (voo) {
    const p = Math.min(1, (t - voo.t0) / voo.dur), e = easeInOut(p);
    controls.target.lerpVectors(voo.alvo0, voo.alvo1, e);
    pontoCurva(voo.cam0, voo.meio, voo.cam1, e, camera.position);
    camera.fov = FOV + (estado.movimentoReduzido ? 0 : 9 * Math.sin(Math.PI * e));
    camera.updateProjectionMatrix();
    if (p >= 1) { voo = null; camera.fov = FOV; camera.updateProjectionMatrix(); }
  }

  if (ponteiro.dentro && ponteiro.moveu && !ponteiro.baixo) {
    ponteiro.moveu = false;
    const i = noSobPonteiro(ponteiro.x, ponteiro.y);
    if (i !== estado.sobre) { estado.sobre = i; renderer.domElement.classList.toggle('sobre-no', i >= 0); }
    mostrarRotulo(i, ponteiro.x, ponteiro.y);
  }

  controls.update();
  renderer.render(scene, camera);
  desenharEEG(eegPendente); eegPendente = false;

  if (quadros.length >= 30 && Math.round(t / 500) !== Math.round((t - dt) / 500)) {
    const media = quadros.reduce((a, b) => a + b, 0) / quadros.length;
    const fps = 1000 / media;
    window.__fps = fps;
    // GPU integrada: abaixo de 28 fps por 3 s, baixa a resolução e afina a poeira uma vez
    if (fps < 28 && !estado.qualidadeAjustada) {
      lentoDesde = lentoDesde || t;
      if (t - lentoDesde > 3000) { estado.qualidadeAjustada = true; atualizarPoeira(); redimensionar(false); }
    } else lentoDesde = 0;
    perfEl.textContent = `Desempenho: ${Math.round(fps)} fps · ${fmt(nos.length)} estrelas${SINTETICAS ? ` (${fmt(SINTETICAS)} sintéticas, carga de teste)` : ''}${estado.qualidadeAjustada ? ' · qualidade ajustada' : ''}`;
  }
  raf = requestAnimationFrame(quadro);
}
raf = requestAnimationFrame(quadro);
window.__previa = { eventos, nos, selecionar, estado, camera, controls, voarPara };
