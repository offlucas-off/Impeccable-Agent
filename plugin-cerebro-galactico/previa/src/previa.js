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
  esconderArquivo: false, fundo: true, reduzidos: false, som: false,
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

// fundo: o chão do tema (#070b16) com o halo #0c1630 do tamanho do disco
const fundo = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uAspecto: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uAspecto;
      void main(){ vec2 p = (vUv - vec2(0.5, 0.55)) * vec2(uAspecto, 1.0) / min(uAspecto, 1.0);
        float h = smoothstep(0.9, 0.0, length(p));
        gl_FragColor = vec4(mix(vec3(0.0275, 0.043, 0.086), vec3(0.047, 0.086, 0.188), h * h * 0.8), 1.0); }`,
  }),
);
fundo.frustumCulled = false; fundo.renderOrder = -10;
scene.add(fundo);

// ---------- céu 360°: Via Láctea, estrelas e galáxias distantes ----------
// A Via Láctea e as estrelas ficam no infinito (acompanham a câmera). As galáxias ficam
// em camadas de 14 a 38 unidades e não acompanham: é a paralaxe delas que dá a profundidade no voo.
const RUIDO_GLSL = `
  float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { s += a * vn(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }`;
const NORMAL_VIA = new THREE.Vector3(0.42, 0.78, -0.46).normalize();
const grupoCeu = new THREE.Group();
grupoCeu.renderOrder = -9;
scene.add(grupoCeu);
// a Via Láctea é calculada uma vez na GPU para uma textura equirretangular e depois só amostrada
const texVia = (() => {
  const rt = new THREE.WebGLRenderTarget(2048, 1024, { depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false });
  const cena = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  cena.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: { uN: { value: NORMAL_VIA } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `uniform vec3 uN; varying vec2 vUv; ${RUIDO_GLSL}
      void main(){
        float lon = (vUv.x - 0.5) * 6.2831853, lat = (vUv.y - 0.5) * 3.1415927;
        vec3 dir = vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
        vec3 C = normalize(cross(uN, vec3(0.0, 0.0, 1.0)));
        float bojo = exp(-dot(dir - C, dir - C) / 0.35);
        float d = dot(dir, uN), d2 = d + (fbm(dir * 2.5) - 0.5) * 0.12;
        float brilho = exp(-d2 * d2 / 0.010) * (0.5 + 0.5 * bojo) + exp(-d2 * d2 / 0.06) * 0.22;
        float mancha = fbm(dir * 6.0 + 3.0);
        brilho *= 0.35 + mancha * 1.2;
        // faixas escuras de poeira, concentradas na linha central (a Grande Fenda)
        float faixa = smoothstep(0.47, 0.64, fbm(dir * 9.0 + 11.0)) * exp(-d * d / 0.005);
        brilho *= 1.0 - 0.85 * faixa;
        vec3 cor = mix(vec3(0.55, 0.62, 0.86), vec3(0.88, 0.75, 0.6), clamp(bojo * 0.8 + mancha * 0.3, 0.0, 1.0)) * brilho;
        // estrelas não resolvidas: o grão da faixa
        // regiões HII rosadas ao longo da faixa
        cor += vec3(0.78, 0.3, 0.38) * smoothstep(0.6, 0.78, fbm(dir * 4.0 + 20.0)) * exp(-d * d / 0.02) * 0.45;
        cor += vec3(0.05, 0.06, 0.1) * fbm(dir * 1.5 + 7.0) * 0.4;
        gl_FragColor = vec4(cor, 1.0); }`,
  })));
  renderer.setRenderTarget(rt); renderer.render(cena, cam); renderer.setRenderTarget(null);
  cena.children[0].geometry.dispose(); cena.children[0].material.dispose();
  return rt.texture;
})();
{
  const m = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, side: THREE.BackSide,
    uniforms: { uVia: { value: texVia }, uIntens: { value: 0.3 } },
    vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D uVia; uniform float uIntens; varying vec3 vD;
      void main(){ vec3 d = normalize(vD);
        vec2 uv = vec2(atan(d.x, d.z) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5);
        gl_FragColor = vec4(texture2D(uVia, uv).rgb * uIntens, 1.0); }`,
  });
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor;
  const via = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 32), m);
  via.frustumCulled = false; via.renderOrder = -9.5;
  grupoCeu.add(via);
}
// estrelas: 55% concentradas na faixa, as mais brilhantes com raios de difração
{
  const r = rng(404), n = 14000, pos = new Float32Array(n * 3), cor = new Float32Array(n * 3), tam = new Float32Array(n);
  const c = new THREE.Color(), v = new THREE.Vector3();
  const cores = ['#ffffff', '#cfe0ff', '#aac8ff', '#ffe2c4', '#ffd0a8', '#ffb98a'];
  for (let i = 0; i < n; i++) {
    v.set(gauss(r), gauss(r), gauss(r)).normalize();
    const naFaixa = r() < 0.6;
    if (naFaixa) { const d = v.dot(NORMAL_VIA); v.addScaledVector(NORMAL_VIA, -d + gauss(r) * 0.06).normalize(); }
    v.multiplyScalar(30);
    pos.set([v.x, v.y, v.z], i * 3);
    c.set(cores[Math.floor(r() * cores.length)]);
    cor.set([c.r, c.g, c.b], i * 3);
    tam[i] = naFaixa ? 0.3 + Math.pow(r(), 9) * 2.6 : 0.4 + Math.pow(r(), 7) * 3.2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aCor', new THREE.BufferAttribute(cor, 3));
  g.setAttribute('aTam', new THREE.BufferAttribute(tam, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uDpr: { value: 1 } },
    vertexShader: `attribute vec3 aCor; attribute float aTam; uniform float uDpr; varying vec3 vC; varying float vE;
      void main(){ vC = aCor; vE = step(2.0, aTam); vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aTam * uDpr * (1.6 + vE * 4.0); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vC; varying float vE;
      void main(){ vec2 d = gl_PointCoord - 0.5; float k = 1.0 + vE * 4.0;
        float a = exp(-dot(d, d) * 18.0 * k * k);
        vec2 q = abs(d) * 2.0;
        a += vE * (exp(-q.x * 60.0) * exp(-q.y * 4.0) + exp(-q.y * 60.0) * exp(-q.x * 4.0)) * 0.5;
        gl_FragColor = vec4(vC * a * 0.6, 1.0); }`,
  });
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor;
  const ceu = new THREE.Points(g, m); ceu.frustumCulled = false; ceu.renderOrder = -9; ceu.name = 'ceu';
  grupoCeu.add(ceu);
}
// atlas de galáxias e nebulosas distantes (4×4), gerado no código
function atlasGalaxias() {
  const C = 160, N = 4, cv = document.createElement('canvas');
  cv.width = cv.height = C * N;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(C * N, C * N);
  const ex = (x) => Math.exp(x);
  for (let cell = 0; cell < 16; cell++) {
    const ox = (cell % N) * C, oy = Math.floor(cell / N) * C, sd = cell * 5.31;
    const bracos = cell % 3 === 0 ? 3 : 2, giro = 2.2 + (cell % 4) * 0.5;
    for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
      const u = (x + 0.5) / C * 2 - 1, v = (y + 0.5) / C * 2 - 1;
      const r = Math.hypot(u, v), th = Math.atan2(v, u);
      const nz = ruido(u * 6 + sd, v * 6 - sd, 0.7) * 0.5 + 0.5;
      let R = 0, G = 0, B = 0;
      if (cell <= 7) { // espirais (6 e 7 barradas)
        const barra = cell >= 6;
        const s = Math.cos(bracos * (th - giro * Math.log(r + 0.04)));
        const braco = Math.pow(Math.max(0, s * 0.5 + 0.5), 3) * (barra ? Math.min(1, Math.max(0, (r - 0.18) * 5)) : 1);
        const disco = ex(-r * 3.4), nucleo = ex(-r * r * 70);
        let I = disco * (0.18 + 0.95 * braco * (0.55 + 0.45 * nz));
        if (barra) I += ex(-(u * u / 0.09 + v * v / 0.003)) * 0.6;
        R = nucleo * 1.2 + I * 0.62; G = nucleo * 1.05 + I * 0.72; B = nucleo * 0.8 + I * 1.0;
        if (braco > 0.7 && nz > 0.62) { R += disco * 0.5; G += disco * 0.18; B += disco * 0.3; }
      } else if (cell <= 9) { // elípticas
        const I = ex(-Math.pow(r / 0.16, 0.6) * 2.2) * 1.1;
        R = I; G = I * 0.86; B = I * 0.66;
      } else if (cell <= 11) { // de perfil, com faixa de poeira
        const disco = ex(-Math.abs(v) * 20 - Math.abs(u) * 2.6), bojo = ex(-(u * u + v * v * 3) * 28);
        const faixa = 1 - 0.85 * ex(-Math.pow((v - 0.012) * 70, 2)) * Math.max(0, 1 - Math.abs(u) * 1.1);
        const I = (disco * (0.6 + 0.4 * nz) + bojo) * faixa;
        R = I * 0.9 + bojo * 0.3; G = I * 0.85 + bojo * 0.2; B = I * 0.95;
      } else if (cell === 12) { // irregular
        let I = 0;
        for (let k = 0; k < 6; k++) { const bx = Math.sin(k * 2.1 + 1) * 0.35, by = Math.cos(k * 3.7) * 0.25; I += ex(-((u - bx) ** 2 + (v - by) ** 2) * 30) * (0.4 + (k % 3) * 0.2); }
        I *= 0.6 + 0.6 * nz; R = I * 0.7; G = I * 0.8; B = I * 1.05;
      } else if (cell === 13) { // nebulosa em casca: estrela azul, brilho violeta, casca laranja
        const casca = ex(-Math.pow((r - 0.6 - 0.1 * (nz - 0.5)) / 0.09, 2)) * (0.45 + 0.55 * Math.abs(Math.sin(th + 0.6))) * (0.5 + nz);
        const violeta = ex(-r * r * 7) * 0.55, estrela = ex(-r * r * 400);
        R = casca * 1.0 + violeta * 0.7 + estrela; G = casca * 0.5 + violeta * 0.35 + estrela; B = casca * 0.22 + violeta * 1.0 + estrela * 1.2;
      } else if (cell === 14) { // explosão de filamentos (Órion em infravermelho)
        const fil = Math.pow(0.5 + 0.5 * Math.sin(th * 23 + nz * 5), 6) * ex(-r * 3.2) * (0.6 + nz);
        const nucleo = ex(-r * r * 40) * 1.4;
        R = nucleo * 0.9 + fil * 1.0; G = nucleo * 0.95 + fil * 0.5; B = nucleo * 1.1 + fil * 0.3 + ex(-r * r * 9) * 0.2;
      } else { // lenticular
        const I = ex(-r * 4.5) * 0.7 + ex(-r * r * 50) * 0.8;
        R = I; G = I * 0.9; B = I * 0.78;
      }
      const borda = Math.max(0, Math.min(1, (1 - r) / 0.2));
      const k = ((oy + y) * C * N + ox + x) * 4;
      img.data[k] = Math.min(255, R * borda * 255); img.data[k + 1] = Math.min(255, G * borda * 255); img.data[k + 2] = Math.min(255, B * borda * 255);
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  return tex;
}
const uProjCeu = { value: 1 }, uCapCeu = { value: 200 };
{
  const r = rng(808), grandes = 120, n = grandes + 420;
  const pos = new Float32Array(n * 3), tam = new Float32Array(n), cel = new Float32Array(n), rot = new Float32Array(n), incl = new Float32Array(n), alfa = new Float32Array(n);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    // zona de evitação: quase nenhuma galáxia atrás da faixa da Via Láctea
    do v.set(gauss(r), gauss(r), gauss(r)).normalize(); while (Math.abs(v.dot(NORMAL_VIA)) < 0.13 && r() < 0.88);
    const grande = i < grandes, R = grande ? 14 + r() * 20 : 30 + r() * 8;
    pos.set([v.x * R, v.y * R, v.z * R], i * 3);
    const ang = grande ? THREE.MathUtils.degToRad(1.0 + Math.pow(r(), 2.2) * 6.5) : THREE.MathUtils.degToRad(0.25 + r() * 0.5);
    tam[i] = R * ang;
    const c = grande ? Math.floor(r() * 16) : Math.floor(r() * 12);
    cel[i] = c;
    rot[i] = r() * Math.PI * 2;
    incl[i] = c >= 10 && c <= 11 || c >= 13 && c <= 14 ? 1 : 0.25 + r() * 0.75;
    alfa[i] = grande ? 0.6 + r() * 0.5 : 0.35 + r() * 0.4;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  for (const [k, a] of [['aTam', tam], ['aCel', cel], ['aRot', rot], ['aIncl', incl], ['aAlfa', alfa]]) g.setAttribute(k, new THREE.BufferAttribute(a, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uAtlas: { value: atlasGalaxias() }, uProj: uProjCeu, uCap: uCapCeu },
    vertexShader: `attribute float aTam; attribute float aCel; attribute float aRot; attribute float aIncl; attribute float aAlfa;
      uniform float uProj; uniform float uCap; varying float vCel; varying float vRot; varying float vIncl; varying float vA;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float px = aTam * uProj / -mv.z;
        gl_PointSize = clamp(px, 1.5, uCap);
        vA = aAlfa * min(1.0, px / 1.5); vCel = aCel; vRot = aRot; vIncl = aIncl;
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform sampler2D uAtlas; varying float vCel; varying float vRot; varying float vIncl; varying float vA;
      void main(){ vec2 p = gl_PointCoord - 0.5;
        float c = cos(vRot), s = sin(vRot);
        p = vec2(c * p.x - s * p.y, (s * p.x + c * p.y) / vIncl) + 0.5;
        if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) discard;
        vec2 cel = vec2(mod(vCel, 4.0), floor(vCel / 4.0));
        gl_FragColor = vec4(texture2D(uAtlas, (cel + p) / 4.0).rgb * vA, 1.0); }`,
  });
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor;
  const galaxias = new THREE.Points(g, m);
  galaxias.frustumCulled = false; galaxias.renderOrder = -8;
  scene.add(galaxias);
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
const MAX_CLAROES = 8;
const claroes = Array.from({ length: MAX_CLAROES }, () => ({ pos: new THREE.Vector3(), cor: new THREE.Color(), t0: -1e9, forca: 0, raio: 0.1, dur: 600, piscar: false }));
const uClaroes = { value: claroes.map(() => new THREE.Vector4(0, 0, 0, 0)) };
const uClaroesCor = { value: claroes.map(() => new THREE.Vector3()) };
const uClaroesRaio = { value: claroes.map(() => 0.01) };
let claroProx = 0;
function clarao(pos, cor, forca, raio, dur, piscar = false) {
  const c = claroes[claroProx++ % MAX_CLAROES];
  // fotossensibilidade: com efeitos reduzidos ou movimento reduzido, nada pisca, só acende e apaga
  c.pos.copy(pos); c.cor.set(cor); c.t0 = agora; c.forca = forca; c.raio = raio; c.dur = dur;
  c.piscar = piscar && !estado.reduzidos && !estado.movimentoReduzido;
}
const CLARAO_GLSL = `
  uniform vec4 uClaroes[${MAX_CLAROES}]; uniform vec3 uClaroesCor[${MAX_CLAROES}]; uniform float uClaroesRaio[${MAX_CLAROES}];
  vec3 luzClaroes(vec3 p) {
    vec3 s = vec3(0.0);
    for (int i = 0; i < ${MAX_CLAROES}; i++) {
      vec4 c = uClaroes[i];
      if (c.w <= 0.001) continue;
      vec3 d = p - c.xyz;
      s += uClaroesCor[i] * c.w * exp(-dot(d, d) / uClaroesRaio[i]);
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
const uProjPoeira = { value: 1 }, uCap = { value: 100 }, uQualidade = { value: 1 }, uTela = { value: 1 };

function corDaPoeira(r, rr, regiao, out) {
  if (regiao === 'tronco') return out.copy(SHO.violeta).lerp(SHO.cavidade, rr() * 0.4);
  if (regiao === 'talamo' || r < 0.07) return out.copy(SHO.nucleo).lerp(SHO.ouro, rr() * 0.6);
  if (r < 0.2) return out.copy(SHO.teal).lerp(SHO.cavidade, rr() * 0.8);
  if (r < 0.32) return out.copy(SHO.teal).lerp(SHO.ouro, (r - 0.2) / 0.12 * (0.6 + rr() * 0.4));
  if (r < 0.62) return out.copy(SHO.ouro).lerp(SHO.laranja, (r - 0.32) / 0.3 * (0.5 + rr() * 0.5));
  return out.copy(SHO.laranja).lerp(SHO.ferrugem, Math.min(1, (r - 0.62) / 0.4) * (0.5 + rr() * 0.5));
}

const MAX_POEIRA_ARESTA = 2600;
const nuvemDados = { pos: [], cor: [], tam: [], alfa: [], var: [], rot: [], reg: [], keep: [] };
const escuraDados = { pos: [], cor: [], tam: [], alfa: [], var: [], rot: [], reg: [], keep: [] };
function soprar(dest, p, cor, tam, alfa, rr, reg) {
  dest.pos.push(p.x, p.y, p.z); dest.cor.push(cor.r, cor.g, cor.b); dest.tam.push(tam);
  dest.alfa.push(alfa); dest.var.push(Math.floor(rr() * 16)); dest.rot.push(rr() * Math.PI * 2); dest.reg.push(reg); dest.keep.push(rr());
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
    soprar(nuvemDados, p, corDaPoeira(r, rr, 'cavidade', c), 0.16 + rr() * 0.12, 0.07, rr, 7);
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
  g.setAttribute('aKeep', mk(dados.keep, 1));
  g.setDrawRange(0, dados.tam.length);
  return g;
}
const POEIRA_VS = `attribute vec3 aCor; attribute float aTam; attribute float aAlfa; attribute float aVar; attribute float aRot; attribute float aReg; attribute float aKeep;
  uniform float uProj; uniform float uCap; uniform float uQualidade; uniform float uDens; uniform float uRegiao; uniform float uEscondeArq;
  varying vec3 vCor; varying float vA; varying float vVar; varying float vRot; varying vec3 vLuz;
  ${CLARAO_GLSL}
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float z = -mv.z;
    float px = aTam * uProj / z;
    gl_PointSize = min(px, uCap);
    // perto da câmera a nuvem se abre e some: é o voo atravessando o gás
    float perto = smoothstep(0.015, 0.16, z);
    float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
    if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
    float corte = px > uCap ? (uCap / px) * (uCap / px) : 1.0;
    vA = aAlfa * uDens * perto * filtro * corte * step(aKeep, uQualidade);
    vCor = aCor; vVar = aVar; vRot = aRot; vLuz = luzClaroes(position) * filtro;
    gl_Position = projectionMatrix * mv;
    // invisível não custa nada: fora do recorte, tamanho zero
    if (vA < 0.003) { gl_PointSize = 0.0; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }
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
    uniforms: { uAtlas: { value: ATLAS }, uProj: uProjPoeira, uCap, uQualidade, uDens, uRegiao, uEscondeArq, uClaroes, uClaroesCor, uClaroesRaio },
    vertexShader: POEIRA_VS, fragmentShader: POEIRA_FS(escura),
  });
  m.blending = THREE.CustomBlending;
  if (escura) { m.blendSrc = m.blendSrcAlpha = THREE.ZeroFactor; m.blendDst = m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor; }
  else { m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor; m.blendSrcAlpha = THREE.ZeroFactor; m.blendDstAlpha = THREE.OneFactor; }
  return m;
}
const nuvemGeo = geometriaPoeira(nuvemDados, CAP_NUVEM);
const nuvens = new THREE.Points(nuvemGeo, materialPoeira(false));
nuvens.frustumCulled = false; nuvens.renderOrder = 1;
const escuraGeo = geometriaPoeira(escuraDados, escuraDados.tam.length);
const escura = new THREE.Points(escuraGeo, materialPoeira(true));
escura.frustumCulled = false; escura.renderOrder = 2;
// a poeira é desenhada em meia resolução (¼ dos fragmentos) e composta uma vez sobre o céu.
// A composição tem ombro suave: camadas densas chegam perto do branco sem estourar.
const cenaPoeira = new THREE.Scene();
cenaPoeira.add(nuvens, escura);
const ESCALA_POEIRA = 0.5;
const rtPoeira = new THREE.WebGLRenderTarget(1, 1, {
  type: renderer.capabilities.isWebGL2 && renderer.extensions.has('EXT_color_buffer_float') ? THREE.HalfFloatType : THREE.UnsignedByteType,
  depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
});
const composicao = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uPoeira: { value: rtPoeira.texture } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `uniform sampler2D uPoeira; varying vec2 vUv;
      void main(){ vec4 p = texture2D(uPoeira, vUv);
        gl_FragColor = vec4(vec3(1.0) - exp(-p.rgb * 1.15), p.a); }`,
  }),
);
composicao.material.blending = THREE.CustomBlending;
composicao.material.blendSrc = THREE.OneFactor; composicao.material.blendDst = THREE.SrcAlphaFactor;
composicao.material.blendSrcAlpha = THREE.ZeroFactor; composicao.material.blendDstAlpha = THREE.OneFactor;
composicao.frustumCulled = false; composicao.renderOrder = 1;
scene.add(composicao);

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
  uniforms: { uTempo, uDpr, uRegiao, uEscondeArq, uClaroes, uClaroesCor, uClaroesRaio, uDens, uTela },
  vertexShader: `attribute float aFase; attribute float aReg; attribute float aNasc; uniform float uTempo; uniform float uDpr; uniform float uRegiao; uniform float uEscondeArq; uniform float uDens; uniform float uTela;
    varying float vA; varying vec3 vLuz;
    ${CLARAO_GLSL}
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float pisca = 0.55 + 0.45 * sin(uTempo * (0.6 + fract(aFase) * 1.4) + aFase);
      float filtro = (uRegiao < 0.0 || abs(aReg - uRegiao) < 0.5) ? 1.0 : 0.12;
      if (uEscondeArq > 0.5 && abs(aReg - 6.0) < 0.5) filtro = 0.0;
      vA = pisca * filtro * aNasc * (0.5 + 0.5 * uDens) * uTela * smoothstep(0.0, 0.08, -mv.z);
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
  filPeso[k] = Math.exp(-tmpA.distanceTo(tmpB) * 3.2) * Math.min(1, 6 / Math.sqrt(Math.max(1, nos[a].viz.length * nos[b].viz.length)));
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
  uniforms: { uAlfa: { value: 0.07 }, uTela },
  vertexShader: `attribute float aAlfa; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vA = aAlfa * smoothstep(0.0, 0.1, -mv.z); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uAlfa; uniform float uTela; varying float vA; void main(){ gl_FragColor = vec4(vec3(1.0, 0.78, 0.5), uAlfa * uTela * vA); }`,
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
const aTam = new Float32Array(CAP), aAtiv = new Float32Array(CAP), aCor = new Float32Array(CAP * 3), aVis = new Float32Array(CAP), aNasc = new Float32Array(CAP), aEspinho = new Float32Array(CAP), aDim = new Float32Array(CAP);
const corTmp = new THREE.Color();
function configurarNo(n) {
  const grau = n.viz.length;
  aTam[n.i] = n.id === '00_PAINEL' ? 5.0 : 1.3 + Math.min(3.2, Math.log2(1 + grau) * 0.5);
  aEspinho[n.i] = (grau >= 40 || n.id === '00_PAINEL') ? 1 : 0;
  corTmp.set(COR[n.k] || COR.sistema);
  aCor.set([corTmp.r, corTmp.g, corTmp.b], n.i * 3);
  aVis[n.i] = 1;
  aNasc[n.i] = 1;
  aDim[n.i] = n.l === 'tronco' ? 0.4 : 1;
}
nos.forEach(configurarNo);
const noGeo = new THREE.BufferGeometry();
noGeo.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
for (const [k, arr, n] of [['aTam', aTam, 1], ['aAtiv', aAtiv, 1], ['aCor', aCor, 3], ['aVis', aVis, 1], ['aNasc', aNasc, 1], ['aEspinho', aEspinho, 1], ['aDim', aDim, 1]]) {
  noGeo.setAttribute(k, new THREE.BufferAttribute(arr, n));
}
noGeo.setDrawRange(0, N0);
const uEscala = { value: 1 };
const noMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false,
  uniforms: { uEscala },
  vertexShader: `attribute float aTam; attribute float aAtiv; attribute vec3 aCor; attribute float aVis; attribute float aNasc; attribute float aEspinho; attribute float aDim;
    uniform float uEscala;
    varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto; varying float vDim;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float a = clamp(aAtiv, 0.0, 1.6);
      vHalo = 1.0 + a * 6.0 + (1.0 - aNasc) * 10.0;
      vEsp = aEspinho;
      float z = -mv.z;
      gl_PointSize = min(aTam * vHalo * (1.0 + aEspinho * 2.6) * uEscala * clamp(1.6 / z, 0.6, 14.0), 260.0) * aVis;
      vAtiv = a; vCor = aCor; vVis = aVis; vDim = max(aDim, min(a, 1.0)); vPerto = smoothstep(0.004, 0.03, z);
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying float vAtiv; varying vec3 vCor; varying float vVis; varying float vHalo; varying float vEsp; varying float vPerto; varying float vDim;
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
      gl_FragColor = vec4(c * brilho * vVis * vPerto * vDim, 1.0); }`,
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

// ---------- fitas: segmentos expandidos em pixels de tela (raios e estilhaços) ----------
const uRes = { value: new THREE.Vector2(1, 1) };
function criarFitas(max, branco) {
  const pos = new Float32Array(max * 12), outro = new Float32Array(max * 12), lado = new Float32Array(max * 4), perfil = new Float32Array(max * 4);
  const alfa = new Float32Array(max * 4), larg = new Float32Array(max * 4), cor = new Float32Array(max * 12);
  const idx = new Uint32Array(max * 6);
  for (let s = 0; s < max; s++) {
    const v = s * 4;
    idx.set([v, v + 1, v + 2, v + 2, v + 1, v + 3], s * 6);
    lado.set([-1, 1, 1, -1], v); // em B a normal inverte, então o lado também
    perfil.set([-1, 1, -1, 1], v); // o lado de verdade na tela, para o brilho não cruzar a fita
  }
  const geo = new THREE.BufferGeometry();
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  const at = { position: [pos, 3], aOutro: [outro, 3], aLado: [lado, 1], aAlfa: [alfa, 1], aLarg: [larg, 1], aCor: [cor, 3] };
  for (const k in at) geo.setAttribute(k, new THREE.BufferAttribute(at[k][0], at[k][1]));
  geo.setAttribute('aPerfil', new THREE.BufferAttribute(perfil, 1));
  geo.setDrawRange(0, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
    uniforms: { uRes, uDpr, uBranco: { value: branco } },
    vertexShader: `attribute vec3 aOutro; attribute float aLado; attribute float aPerfil; attribute float aAlfa; attribute float aLarg; attribute vec3 aCor;
      uniform vec2 uRes; uniform float uDpr; varying float vA; varying float vL; varying vec3 vC;
      void main(){
        vec4 a = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 b = projectionMatrix * modelViewMatrix * vec4(aOutro, 1.0);
        vec2 sa = a.xy / max(a.w, 1e-4) * uRes, sb = b.xy / max(b.w, 1e-4) * uRes;
        vec2 dir = sb - sa; float L = length(dir); dir = L > 1e-3 ? dir / L : vec2(1.0, 0.0);
        // a ponta passa um pouco do vértice, e os segmentos se emendam sem falha nas curvas
        a.xy += (vec2(-dir.y, dir.x) * aLado - dir * 0.5) * aLarg * uDpr / uRes * a.w;
        vA = a.w > 0.0 ? aAlfa : 0.0; vL = aPerfil; vC = aCor;
        gl_Position = a; }`,
    fragmentShader: `uniform float uBranco; varying float vA; varying float vL; varying vec3 vC;
      void main(){ float x = abs(vL);
        float nucleo = exp(-x * x * 22.0), brilho = exp(-x * x * 3.0) * (1.0 - x * x);
        gl_FragColor = vec4((mix(vC, vec3(0.95, 0.97, 1.0), uBranco) * nucleo * 0.85 + vC * brilho * 0.3) * vA, 1.0); }`,
  });
  mat.blending = THREE.CustomBlending; mat.blendSrc = THREE.OneFactor; mat.blendDst = THREE.OneFactor;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  const f = {
    mesh, n: 0,
    seg(A, B, aA, aB, lA, lB, c) {
      if (f.n >= max) return;
      const v = f.n * 4, o = v * 3;
      pos[o] = pos[o + 3] = A.x; pos[o + 1] = pos[o + 4] = A.y; pos[o + 2] = pos[o + 5] = A.z;
      pos[o + 6] = pos[o + 9] = B.x; pos[o + 7] = pos[o + 10] = B.y; pos[o + 8] = pos[o + 11] = B.z;
      outro[o] = outro[o + 3] = B.x; outro[o + 1] = outro[o + 4] = B.y; outro[o + 2] = outro[o + 5] = B.z;
      outro[o + 6] = outro[o + 9] = A.x; outro[o + 7] = outro[o + 10] = A.y; outro[o + 8] = outro[o + 11] = A.z;
      alfa[v] = alfa[v + 1] = aA; alfa[v + 2] = alfa[v + 3] = aB;
      larg[v] = larg[v + 1] = lA; larg[v + 2] = larg[v + 3] = lB;
      for (let q = 0; q < 4; q++) { cor[o + q * 3] = c.r; cor[o + q * 3 + 1] = c.g; cor[o + q * 3 + 2] = c.b; }
      f.n++;
    },
    fim() {
      geo.setDrawRange(0, f.n * 6);
      if (f.n || f.sujo) for (const k in at) geo.attributes[k].needsUpdate = true;
      f.sujo = f.n > 0; f.n = 0;
    },
  };
  return f;
}

// ---------- raios (trovão) ----------
// Como um relâmpago de verdade: o líder escalonado desce fraco, em degraus, abrindo galhos;
// quando toca o destino vem a descarga de retorno (o canal inteiro acende), apaga,
// o mesmo canal recebe uma segunda descarga e fica um brilho residual violeta.
const MAX_RAIOS = 24;
const fitasRaio = criarFitas(MAX_RAIOS * 150, 1);
fitasRaio.mesh.renderOrder = 8;
const MAX_FAISCAS = MAX_RAIOS * 24;
const faiPos = new Float32Array(MAX_FAISCAS * 3), faiCor = new Float32Array(MAX_FAISCAS * 3), faiForca = new Float32Array(MAX_FAISCAS);
const faiGeo = new THREE.BufferGeometry();
faiGeo.setAttribute('position', new THREE.BufferAttribute(faiPos, 3));
faiGeo.setAttribute('aCor', new THREE.BufferAttribute(faiCor, 3));
faiGeo.setAttribute('aForca', new THREE.BufferAttribute(faiForca, 1));
const faiscas = new THREE.Points(faiGeo, materialPontoBrilhante());
faiscas.frustumCulled = false; faiscas.renderOrder = 8;
scene.add(fitasRaio.mesh, faiscas);
const raios = [];
const rRaio = rng(4242);
const tmpV = new THREE.Vector3();
// deslocamento do ponto médio, perpendicular ao trajeto; cada ponto guarda quando o líder chega nele
function tracarRaio(a, b, nivel, out, galhos, prof = 0, chegada0 = 0, janela = 1) {
  const pts = [a.clone(), b.clone()];
  const len = a.distanceTo(b), eixo = b.clone().sub(a).normalize();
  let desloc = len * (prof ? 0.17 : 0.12);
  for (let k = 0; k < nivel; k++) {
    for (let i = pts.length - 1; i > 0; i--) {
      const m = pts[i - 1].clone().add(pts[i]).multiplyScalar(0.5);
      tmpV.set(gauss(rRaio), gauss(rRaio) * 0.6, gauss(rRaio));
      tmpV.addScaledVector(eixo, -tmpV.dot(eixo) * 0.8);
      m.addScaledVector(tmpV, desloc);
      pts.splice(i, 0, m);
    }
    desloc *= 0.5;
  }
  const n = pts.length;
  const cheg = pts.map((_, i) => chegada0 + (i / (n - 1)) * janela);
  out.push({ pts, prof, cheg });
  for (let g = 0; g < galhos; g++) {
    const i = 2 + Math.floor(rRaio() * (n * 0.75 - 2));
    const dir = pts[i + 1].clone().sub(pts[i - 1]).normalize();
    dir.add(tmpV.set(gauss(rRaio), gauss(rRaio) * 0.5, gauss(rRaio)).multiplyScalar(0.85)).normalize();
    const fim = pts[i].clone().addScaledVector(dir, len * (0.08 + rRaio() * 0.16) * (prof ? 0.55 : 1));
    const sub = prof === 0 && !estado.reduzidos ? (rRaio() < 0.6 ? 2 : 1) : 0;
    tracarRaio(pts[i], fim, Math.max(2, nivel - 2), out, sub, prof + 1, cheg[i], janela * 0.55);
  }
  return out;
}
const COR_CANAL = new THREE.Color('#a8c0ff');
// raio(): o canal e um clarão suave no destino. O clarão da origem é de quem chama (um por evento).
function raio(de, para, cor, forca = 1, claraoDestino = true) {
  if (estado.movimentoReduzido) { if (claraoDestino) clarao(para, cor, 0.5 * forca, 0.12, 700); return; }
  const linhas = tracarRaio(de, para, 5, [], estado.reduzidos ? 1 : 3);
  if (raios.length >= MAX_RAIOS) raios.shift();
  raios.push({ linhas, t0: agora, cor: COR_CANAL.clone().lerp(new THREE.Color(cor), 0.3), forca, clarao: claraoDestino ? para.clone() : null });
}
const LIDER = 110, DUR_RAIO = LIDER + 760;
// brilho do canal principal e dos galhos ao longo do tempo (ms desde o início)
function envelopeRaio(ms) {
  if (estado.reduzidos || estado.movimentoReduzido) {
    const u = Math.min(1, ms / DUR_RAIO);
    return { prog: Math.min(1, ms / LIDER), canal: Math.pow(1 - u, 2), galho: Math.pow(1 - u, 2) * 0.6, ponta: 0 };
  }
  if (ms < LIDER) return { prog: (Math.floor(ms / LIDER * 8) + 1) / 8, canal: 0.28, galho: 0.2, ponta: 0.9 };
  const s = ms - LIDER;
  if (s < 55) return { prog: 1, canal: 1.3, galho: 0.8, ponta: 0 };
  if (s < 105) return { prog: 1, canal: 0.3, galho: 0.12, ponta: 0 };
  if (s < 165) return { prog: 1, canal: 1.0, galho: 0.28, ponta: 0 };
  return { prog: 1, canal: 0.75 * Math.exp(-(s - 165) / 190), galho: 0.35 * Math.exp(-(s - 165) / 90), ponta: 0 };
}
// cintilação dos clarões de raio: acende, quase apaga, reacende e morre
function cintila(u) {
  if (estado.reduzidos || estado.movimentoReduzido) return Math.pow(1 - u, 2);
  if (u < 0.12) return 1;
  if (u < 0.22) return 0.25;
  if (u < 0.42) return 0.9;
  return Math.max(0, 1 - (u - 0.42) / 0.58) * 0.8;
}
const LARG_RAIO = [7, 3.6, 2.2];
const corResidual = new THREE.Color('#9a7bff'), corTmpRaio = new THREE.Color();
function desenharRaios(t) {
  let nf = 0;
  for (let k = raios.length - 1; k >= 0; k--) {
    const r = raios[k], ms = t - r.t0;
    if (ms >= DUR_RAIO) { raios.splice(k, 1); continue; }
    const e = envelopeRaio(ms);
    // a descarga de retorno acende a poeira do destino
    if (r.clarao && ms >= LIDER) { clarao(r.clarao, '#cfe6ff', 0.55 * r.forca, 0.16, 650); r.clarao = null; }
    // depois da segunda descarga o canal esfria para violeta
    const frio = Math.min(1, Math.max(0, (ms - LIDER - 165) / 400));
    corTmpRaio.copy(r.cor).lerp(corResidual, frio);
    for (const { pts, prof, cheg } of r.linhas) {
      const base = (prof === 0 ? e.canal : e.galho / prof) * r.forca;
      if (base < 0.004 && !e.ponta) continue;
      const w = LARG_RAIO[Math.min(2, prof)], n = pts.length;
      for (let i = 1; i < n; i++) {
        if (cheg[i] > e.prog) break;
        const ponta = e.ponta && cheg[i] > e.prog - 0.07 ? e.ponta : 0;
        const a = Math.max(base, ponta) * (prof ? 1 - 0.5 * i / n : 1);
        const lA = prof ? w * (1 - 0.6 * (i - 1) / n) : w, lB = prof ? w * (1 - 0.6 * i / n) : w;
        fitasRaio.seg(pts[i - 1], pts[i], a, a, lA, lB, corTmpRaio);
        if (prof === 0 && i % 5 === 0 && nf < MAX_FAISCAS && a > 0.2) {
          faiPos[nf * 3] = pts[i].x; faiPos[nf * 3 + 1] = pts[i].y; faiPos[nf * 3 + 2] = pts[i].z;
          faiCor[nf * 3] = r.cor.r; faiCor[nf * 3 + 1] = r.cor.g; faiCor[nf * 3 + 2] = r.cor.b;
          faiForca[nf] = a * 0.3;
          nf++;
        }
      }
    }
  }
  fitasRaio.fim();
  faiGeo.setDrawRange(0, nf);
  faiGeo.attributes.position.needsUpdate = true; faiGeo.attributes.aCor.needsUpdate = true; faiGeo.attributes.aForca.needsUpdate = true;
}

// ---------- explosão da captura ----------
// Uma estrela que estoura no núcleo: clarão branco com raios de difração, estilhaços que
// esfriam de branco para azul, ouro e ferrugem, gás que se expande lento e uma frente de choque irregular.
const ondaMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
  uniforms: { uP: { value: 0 }, uSem: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform float uP; uniform float uSem; varying vec2 vUv;
    void main(){ vec2 q = vUv - 0.5; float r = length(q) * 2.0, a = atan(q.y, q.x);
      // frente irregular: a onda avança mais em uns ângulos que em outros
      float irr = sin(a * 7.0 + uSem) * 0.5 + sin(a * 13.0 - uSem * 2.0) * 0.3 + sin(a * 29.0 + uSem * 3.0) * 0.2;
      float fr = 0.95 + irr * 0.012;
      float frente = exp(-pow((r - fr) / 0.016, 2.0)) * (0.75 + 0.25 * sin(a * 3.0 + uSem));
      float rastro = exp(-pow((r - fr + 0.1) / 0.09, 2.0)) * step(r, fr);
      float f = pow(1.0 - uP, 1.5) * step(r, 1.0);
      vec3 c = vec3(0.7, 0.88, 1.0) * frente * 0.24 + mix(vec3(0.94, 0.55, 0.24), vec3(0.55, 0.23, 0.13), uP) * rastro * 0.3;
      gl_FragColor = vec4(c * f, 1.0); }`,
});
ondaMat.blending = THREE.CustomBlending; ondaMat.blendSrc = THREE.OneFactor; ondaMat.blendDst = THREE.OneFactor;
const ondaMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ondaMat);
ondaMesh.rotation.x = -Math.PI / 2; ondaMesh.visible = false; ondaMesh.renderOrder = 7; ondaMesh.frustumCulled = false;
scene.add(ondaMesh);
let onda = null;
// clarão estelar: núcleo branco, raios de difração e um véu violeta, como a estrela da referência
const explMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, depthTest: false,
  uniforms: { uF: { value: 0 }, uTam: { value: 100 } },
  vertexShader: 'uniform float uTam; void main(){ gl_PointSize = uTam; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform float uF;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
      float nucleo = exp(-r * r * 220.0) * 1.0 + exp(-r * r * 30.0) * 0.22 + exp(-r * 7.0) * 0.08;
      vec2 q = abs(d) * 2.0;
      float esp = exp(-q.x * 110.0) * exp(-q.y * 2.4) + exp(-q.y * 110.0) * exp(-q.x * 2.4);
      vec2 e = abs(vec2(d.x + d.y, d.x - d.y)) * 1.4142;
      float esp2 = (exp(-e.x * 160.0) * exp(-e.y * 6.0) + exp(-e.y * 160.0) * exp(-e.x * 6.0)) * 0.4;
      vec3 c = vec3(1.0, 0.97, 0.92) * nucleo + vec3(0.72, 0.84, 1.0) * esp * 0.9 + vec3(0.66, 0.78, 1.0) * esp2
             + vec3(0.72, 0.42, 0.95) * exp(-r * r * 5.0) * 0.12;
      gl_FragColor = vec4(c * uF * smoothstep(1.0, 0.55, r), 1.0); }`,
});
explMat.blending = THREE.CustomBlending; explMat.blendSrc = THREE.OneFactor; explMat.blendDst = THREE.OneFactor;
const explGeo = new THREE.BufferGeometry();
explGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
const explEstrela = new THREE.Points(explGeo, explMat);
explEstrela.frustumCulled = false; explEstrela.renderOrder = 9; explEstrela.visible = false;
scene.add(explEstrela);
const fitasEstilhaco = criarFitas(520, 0.3);
fitasEstilhaco.mesh.renderOrder = 8;
scene.add(fitasEstilhaco.mesh);
const estilhacos = [];
// gás da explosão: as mesmas nuvens da poeira, no alvo de meia resolução, acesas pelos clarões
const MAX_GAS_EXP = 140;
const gasExpGeo = geometriaPoeira({ pos: [], cor: [], tam: [], alfa: [], var: [], rot: [], reg: [], keep: [] }, MAX_GAS_EXP);
const gasExp = new THREE.Points(gasExpGeo, materialPoeira(false));
gasExp.frustumCulled = false; gasExp.renderOrder = 1;
cenaPoeira.add(gasExp);
const nuvensExp = [];
const rExp = rng(5150);
const ESFRIA = [[0, '#ffffff'], [0.1, '#9fd8ff'], [0.32, '#f0b44c'], [0.58, '#e0733a'], [1, '#8c3b22']].map(([u, c]) => [u, new THREE.Color(c)]);
function corEsfriando(u, out) {
  for (let k = 1; k < ESFRIA.length; k++) {
    if (u <= ESFRIA[k][0]) return out.copy(ESFRIA[k - 1][1]).lerp(ESFRIA[k][1], (u - ESFRIA[k - 1][0]) / (ESFRIA[k][0] - ESFRIA[k - 1][0]));
  }
  return out.copy(ESFRIA[ESFRIA.length - 1][1]);
}
function explodir() {
  const reduz = estado.reduzidos, parado = estado.movimentoReduzido;
  explosao = { t0: agora, dur: parado ? 900 : 2600 };
  if (parado) return;
  const qtd = reduz ? 140 : 420;
  for (let k = 0; k < qtd; k++) {
    const dir = new THREE.Vector3(gauss(rExp), gauss(rExp) * 0.32, gauss(rExp)).normalize();
    estilhacos.push({ dir, vel: 0.22 + Math.pow(rExp(), 0.6) * 1.15, t0: agora + rExp() * 60, vida: 1200 + rExp() * 1500, larg: 1.6 + rExp() * 2.2, rastro: 0.05 + rExp() * 0.12 });
  }
  if (estilhacos.length > 1200) estilhacos.splice(0, estilhacos.length - 1200);
  const nGas = reduz ? 50 : MAX_GAS_EXP;
  nuvensExp.length = 0;
  for (let k = 0; k < nGas; k++) {
    const dir = new THREE.Vector3(gauss(rExp), gauss(rExp) * 0.35, gauss(rExp)).normalize();
    const x = rExp(), cor = new THREE.Color();
    if (x < 0.55) cor.copy(SHO.laranja).lerp(SHO.ferrugem, rExp());
    else if (x < 0.82) cor.copy(SHO.ouro).lerp(SHO.nucleo, rExp() * 0.5);
    else cor.copy(SHO.teal).lerp(SHO.cavidade, rExp() * 0.5);
    nuvensExp.push({ dir, R: 0.18 + Math.pow(rExp(), 0.7) * 0.75, vida: 2400 + rExp() * 1400, tam: 0.1 + rExp() * 0.14, cor, varia: Math.floor(rExp() * 16), rot: rExp() * 6.28 });
  }
}
let explosao = null, abalo = null;
const desloc = new THREE.Vector3();
function desenharExplosao(t) {
  // estrela do clarão
  if (explosao) {
    const ms = t - explosao.t0, u = ms / explosao.dur;
    if (u >= 1) { explosao = null; explEstrela.visible = false; }
    else {
      const sobe = Math.min(1, ms / 60);
      explMat.uniforms.uF.value = (estado.movimentoReduzido ? 0.5 : 1) * 0.8 * sobe * Math.exp(-Math.max(0, ms - 60) / 520);
      explMat.uniforms.uTam.value = Math.min(1024, renderer.domElement.height * (0.26 + 0.16 * ease(Math.min(1, ms / 900))));
      explEstrela.visible = true;
    }
  }
  // estilhaços: arrasto exponencial, rastro na direção do movimento, esfriando com a idade
  const p = new THREE.Vector3(), q = new THREE.Vector3(), c = new THREE.Color();
  for (let k = estilhacos.length - 1; k >= 0; k--) {
    const s = estilhacos[k], ms = t - s.t0;
    if (ms >= s.vida) { estilhacos.splice(k, 1); continue; }
    if (ms < 0) continue;
    const tau = 0.85, ts = ms / 1000, u = ms / s.vida;
    const dist = s.vel * tau * (1 - Math.exp(-ts / tau)), v = s.vel * Math.exp(-ts / tau);
    p.copy(s.dir).multiplyScalar(0.012 + dist);
    q.copy(s.dir).multiplyScalar(Math.max(0.006, dist - v * s.rastro - 0.01));
    corEsfriando(u, c);
    const a = Math.pow(1 - u, 1.4) * Math.min(1, ms / 40);
    fitasEstilhaco.seg(q, p, 0, a, s.larg * 0.5, s.larg * (1 - u * 0.5), c);
  }
  fitasEstilhaco.fim();
  // gás em expansão
  let ng = 0;
  if (explosao && nuvensExp.length) {
    const ms = t - explosao.t0, P = gasExpGeo.attributes;
    for (const g of nuvensExp) {
      const u = ms / g.vida;
      if (u >= 1 || u < 0) continue;
      const e = 1 - Math.pow(1 - u, 3);
      P.position.array.set([g.dir.x * g.R * e, g.dir.y * g.R * e, g.dir.z * g.R * e], ng * 3);
      P.aCor.array.set([g.cor.r, g.cor.g, g.cor.b], ng * 3);
      P.aTam.array[ng] = g.tam * (0.5 + 1.6 * e);
      P.aAlfa.array[ng] = 0.3 * Math.min(1, u / 0.12) * Math.pow(1 - u, 1.4);
      P.aVar.array[ng] = g.varia; P.aRot.array[ng] = g.rot + u * 0.6; P.aReg.array[ng] = 7; P.aKeep.array[ng] = 0;
      ng++;
    }
    for (const k of ['position', 'aCor', 'aTam', 'aAlfa', 'aVar', 'aRot', 'aReg', 'aKeep']) P[k].needsUpdate = true;
  }
  gasExpGeo.setDrawRange(0, ng);
  // tremor curto da câmera (desligado com movimento ou efeitos reduzidos)
  desloc.set(0, 0, 0);
  if (abalo) {
    const u = (t - abalo.t0) / 520;
    if (u >= 1) abalo = null;
    else {
      const amp = 0.0045 * camera.position.distanceTo(controls.target) * Math.pow(1 - u, 2);
      desloc.set(Math.sin(t * 0.09) * amp, Math.sin(t * 0.13 + 1) * amp, Math.sin(t * 0.07 + 2) * amp);
    }
  }
}

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

// ---------- som de trovão (opcional, desligado por padrão; sintetizado na hora, sem arquivos) ----------
const som = { ctx: null, marrom: null, branco: null, saida: null };
function ligarSom() {
  if (!som.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return false;
    const c = som.ctx = new C(), n = c.sampleRate * 4;
    som.marrom = c.createBuffer(1, n, c.sampleRate); som.branco = c.createBuffer(1, c.sampleRate, c.sampleRate);
    // ruído marrom (grave, o ronco) e branco (o estalo do raio perto)
    const m = som.marrom.getChannelData(0), b = som.branco.getChannelData(0);
    let u = 0;
    for (let k = 0; k < n; k++) { u = (u + 0.02 * (Math.random() * 2 - 1)) / 1.02; m[k] = u * 3.5; }
    for (let k = 0; k < b.length; k++) b[k] = Math.random() * 2 - 1;
    const comp = c.createDynamicsCompressor();
    som.saida = c.createGain(); som.saida.gain.value = 0.55;
    som.saida.connect(comp).connect(c.destination);
  }
  som.ctx.resume();
  return true;
}
// estalo: o canal perto; ronco: o som que rola depois, em ondas, cada vez mais grave
function trovao({ estalo = 0, ronco = 0.5, atraso = 0, dur = 2.6, grave = 220 } = {}) {
  if (!estado.som || !som.ctx || document.hidden) return;
  const c = som.ctx, t0 = c.currentTime + atraso / 1000;
  if (estalo) {
    const src = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
    src.buffer = som.branco; hp.type = 'highpass'; hp.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(estalo, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    src.connect(hp).connect(g).connect(som.saida); src.start(t0, Math.random() * 0.5, 0.4);
  }
  const src = c.createBufferSource(), lp = c.createBiquadFilter(), g = c.createGain();
  src.buffer = som.marrom; src.playbackRate.value = 0.8 + Math.random() * 0.4;
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(grave * 2.2, t0); lp.frequency.exponentialRampToValueAtTime(grave * 0.45, t0 + dur);
  const pico = estalo ? 0.06 : 0.25;
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(ronco, t0 + pico);
  g.gain.exponentialRampToValueAtTime(ronco * 0.4, t0 + dur * 0.22);
  g.gain.exponentialRampToValueAtTime(ronco * 0.75, t0 + dur * 0.36);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(lp).connect(g).connect(som.saida); src.start(t0, Math.random() * (4 - dur - 0.2), dur + 0.1);
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
const INTERVALO_RAIO = 15000, ultimoRaio = new Map();
const nascendo = [];
const eventos = {
  abrir(i, origem = 'abriu') {
    if (!vivo(i)) return;
    propagar(i, 1.0, 2, corDe(i), 12);
    clarao(posDe(i), corDe(i), 0.35, 0.08, 900);
    if (origem) aviso(`${origem === 'clique' ? 'Abriria numa aba nova' : 'Abriu'} **${nos[i].t}** · ${NOME_TIPO[nos[i].k]} no ${nomeRegiao(i).onde}`, corDe(i));
  },
  salvar(i) {
    if (!vivo(i)) return;
    // o Obsidian salva a cada ~2 s enquanto se digita: raio cheio no máximo 1 vez a cada 15 s por nota
    if (agora - (ultimoRaio.get(i) ?? -1e9) < INTERVALO_RAIO) {
      propagar(i, 0.7, 1, corDe(i), 6);
      clarao(posDe(i), corDe(i), 0.3, 0.12, 900);
      aviso(`Salvou **${nos[i].t}** de novo · pulso suave (raio no máximo a cada 15 s)`, corDe(i));
      return;
    }
    ultimoRaio.set(i, agora);
    disparar(i, 1.5);
    const a = posDe(i), qtd = estado.reduzidos ? 2 : 4;
    // as ligadas mais distantes, ao menos metade fora da região: o raio cruza o céu
    const viz = nos[i].viz.filter(vivo).map((j) => [j, a.distanceTo(posDe(j))]).sort((x, y) => y[1] - x[1]);
    const fora = viz.filter(([j]) => nos[j].l !== nos[i].l), dentro = viz.filter(([j]) => nos[j].l === nos[i].l);
    const metade = fora.slice(0, Math.ceil(qtd / 2));
    const resto = [...fora.slice(metade.length), ...dentro].sort((x, y) => y[1] - x[1]).slice(0, qtd - metade.length);
    const escolhidos = [...metade, ...resto].map(([j]) => j);
    clarao(a, corDe(i), 0.55, 0.13, 900, true);
    trovao({ estalo: 0.5, ronco: 0.6, atraso: estado.movimentoReduzido ? 0 : LIDER, dur: 2.4, grave: 260 });
    escolhidos.forEach((j, k) => setTimeout(() => {
      raio(a, posDe(j), corDe(i), k ? 0.75 : 1, k < 3);
      setTimeout(() => disparar(j, 0.9), estado.movimentoReduzido ? 0 : LIDER);
    }, estado.movimentoReduzido ? 0 : k * 40));
    aviso(`Salvou **${nos[i].t}** · raio para ${escolhidos.length} ${escolhidos.length === 1 ? 'nota ligada' : 'notas ligadas'}`, corDe(i));
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
    ['position', 'aTam', 'aCor', 'aVis', 'aEspinho', 'aDim'].forEach((k) => { noGeo.attributes[k].needsUpdate = true; });
    // grãos de poeira espiralando para o ponto onde a estrela vai acender
    const qtd = estado.reduzidos ? 18 : 44;
    for (let g = 0; g < qtd && graos.length < MAX_COND; g++) {
      const ang = rr() * Math.PI * 2, r = 0.05 + rr() * 0.07;
      graos.push({ alvo: p.clone(), ang, r, y: gauss(rr) * 0.02, t0: agora + rr() * 200, dur: 1300 + rr() * 300, cor: corDaPoeira(Math.hypot(p.x, p.z), rr, n.l, new THREE.Color()) });
    }
    nascendo.push({ i, t0: agora, arestas: novas });
    uDens.value = densidade(arestas.length);
    document.getElementById('n-notas').textContent = fmt(nos.length - SINTETICAS);
    document.getElementById('n-sinapses').textContent = fmt(arestas.length - (GRAFO.arestas.length - GRAFO.sinapses));
    atualizarTextoPoeira();
    aviso(`Nasceu **${n.t}** no ${nomeRegiao(i).onde}, ligada a ${novas.length} notas`, corDe(i));
  },
  captura() {
    // 01_ENTRADA mudou: tempestade a partir do núcleo
    onda = { t0: agora, dur: estado.movimentoReduzido ? 1 : 2400 };
    ondaMat.uniforms.uSem.value = Math.random() * 100;
    disparar(painel, 1.6);
    explodir();
    // um único clarão forte (sem piscar) e, depois, o brilho laranja do gás aceso
    clarao(new THREE.Vector3(0, 0, 0), '#fff1d6', 0.5, 0.24, 1300);
    setTimeout(() => clarao(new THREE.Vector3(0, 0, 0), '#e0733a', 0.35, 0.5, 1800), estado.movimentoReduzido ? 0 : 260);
    if (!estado.movimentoReduzido && !estado.reduzidos) abalo = { t0: agora };
    trovao({ estalo: 0.35, ronco: 0.95, dur: 3.8, grave: 130 });
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
  realceBase = 0.28 * Math.min(1, 4 / Math.sqrt(Math.max(1, viz.length)));
  realceMat.opacity = realceBase;
  realceDesde = centralizar ? -1 : agora;
  if (centralizar) voarPara(a, 0.32);
}
let realceBase = 0.28, realceDesde = -1;
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
  ['position', 'aCor', 'aTam', 'aAlfa', 'aVar', 'aRot', 'aReg', 'aKeep'].forEach((k) => {
    const src = { position: nuvemDados.pos, aCor: nuvemDados.cor, aTam: nuvemDados.tam, aAlfa: nuvemDados.alfa, aVar: nuvemDados.var, aRot: nuvemDados.rot, aReg: nuvemDados.reg, aKeep: nuvemDados.keep }[k];
    g.attributes[k].array.set(src); g.attributes[k].needsUpdate = true;
  });
  g.setDrawRange(0, n);
  uQualidade.value = estado.reduzidos || estado.qualidadeAjustada ? 0.6 : 1;
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
document.getElementById('f-som').addEventListener('change', (e) => {
  estado.som = e.target.checked && ligarSom();
  e.target.checked = estado.som;
  if (estado.som) trovao({ ronco: 0.3, dur: 2.2, grave: 180 }); // um ronco baixo confirma que o som está ligado
});

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
  uProjPoeira.value = uProj.value * ESCALA_POEIRA;
  uCap.value = Math.max(24, 0.12 * h * dpr * ESCALA_POEIRA);
  rtPoeira.setSize(Math.max(1, Math.round(w * dpr * ESCALA_POEIRA)), Math.max(1, Math.round(h * dpr * ESCALA_POEIRA)));
  uTela.value = THREE.MathUtils.clamp(Math.min(w, h) / 800, 0.35, 1);
  uRes.value.set(w * dpr / 2, h * dpr / 2);
  uProjCeu.value = uProj.value; uCapCeu.value = 0.2 * h * dpr;
  scene.getObjectByName('ceu').material.uniforms.uDpr.value = dpr;
  fundo.material.uniforms.uAspecto.value = w / h;
}
// observa o palco, não a janela: no plugin a aba muda de tamanho sem 'resize' na janela
new ResizeObserver(() => redimensionar()).observe(palco);
redimensionar();

document.addEventListener('visibilitychange', () => {
  rodando = !document.hidden;
  if (som.ctx) { if (rodando && estado.som) som.ctx.resume(); else som.ctx.suspend(); }
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
      if (vivo(i)) {
        clarao(posDe(i), Math.random() < 0.5 ? '#f0b44c' : '#3cc3d0', 0.32, 0.12, 900, true);
        // trovão distante: o som chega depois do clarão, como no céu de verdade
        trovao({ ronco: 0.16, atraso: 700 + Math.random() * 1200, dur: 3, grave: 150 });
      }
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
    uClaroesRaio.value[k] = c.raio * c.raio;
  }

  // onda de choque: anel no plano do disco, raios curtos nos braços quando ela passa
  if (onda) {
    const p = Math.min(1, (t - onda.t0) / onda.dur);
    const r = 0.05 + ease(p) * 1.05;
    ondaMesh.visible = true; ondaMesh.scale.setScalar(r); ondaMat.uniforms.uP.value = p;
    if (!onda.raios) onda.raios = [0.3, 0.55, 0.8].map((x) => ({ x, feito: false }));
    for (const rz of onda.raios) {
      if (!rz.feito && r > rz.x) {
        rz.feito = true;
        for (let q = 0; q < (estado.reduzidos ? 1 : 2); q++) {
          const cands = nos.filter((n) => vivo(n.i) && Math.abs(Math.hypot(posicoes[n.i * 3], posicoes[n.i * 3 + 2]) - rz.x) < 0.04);
          const a = cands[Math.floor(Math.random() * cands.length)];
          if (a && a.viz.length) raio(posDe(a.i), posDe(a.viz[Math.floor(Math.random() * a.viz.length)]), '#cfe6ff', 0.8, false);
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

  // raios, estilhaços e gás da explosão
  desenharRaios(t);
  desenharExplosao(t);

  if (realceDesde >= 0) {
    const u = (t - realceDesde) / 3000;
    realceMat.opacity = realceBase * Math.max(0, 1 - u);
    if (u >= 1) { realceDesde = -1; realceGeo.setDrawRange(0, 0); }
  }

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
  renderer.setRenderTarget(rtPoeira);
  renderer.setClearColor(0x000000, 1); renderer.clear(true, false, false);
  camera.position.add(desloc);
  grupoCeu.position.copy(camera.position);
  renderer.render(cenaPoeira, camera);
  renderer.setRenderTarget(null);
  renderer.setClearColor(0x070b16, 1);
  renderer.render(scene, camera);
  camera.position.sub(desloc);

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
