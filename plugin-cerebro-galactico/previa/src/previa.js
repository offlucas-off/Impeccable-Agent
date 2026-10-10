// Prévia no navegador: o mesmo motor do plugin, com os botões que simulam o Obsidian.
import { criarGalaxia } from '../../motor/galaxia.js';

const GRAFO = JSON.parse(document.getElementById('grafo').textContent);
const carga = parseInt(new URLSearchParams(location.search).get('carga')
  || (location.hash.match(/^#carga(\d+)$/) || [])[1] || '0', 10) || 0;

window.__previa = criarGalaxia(document.getElementById('raiz'), GRAFO, { simulacao: true, carga });
