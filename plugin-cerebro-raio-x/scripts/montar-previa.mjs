// Monta previa/index.html: um arquivo único, offline, com three.js, o grafo real
// e as fontes Manrope do tema Cerebro embutidos. Uso: npm run previa
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => readFileSync(join(raiz, p), 'utf8');

const js = (await build({
  entryPoints: [join(raiz, 'previa/src/previa.js')],
  bundle: true, minify: true, format: 'iife', target: 'es2020', write: false, legalComments: 'none',
})).outputFiles[0].text;

// Manrope 400/500/700 do tema (mesmo arquivo que o dono usa no cofre)
const tema = ler('../referencias/tema-cerebro/theme.css');
const fontes = [...tema.matchAll(/@font-face\{font-family:'Manrope';[^}]*font-weight:(\d+)[^}]*\}/g)]
  .filter((m) => ['400', '500', '700'].includes(m[1]))
  .map((m) => m[0]).join('\n');
if (!fontes) throw new Error('Manrope não encontrada em referencias/tema-cerebro/theme.css');

const grafo = ler('previa/grafo.json').replace(/</g, '\\u003c');
const html = ler('previa/src/previa.html')
  .replace('{{FONTES}}', () => fontes)
  .replace('{{GRAFO}}', () => grafo)
  .replace('{{JS}}', () => js.replace(/<\/script/gi, '<\\/script'));

if (/https?:\/\//.test(html.replace(/http:\/\/www\.w3\.org\/2000\/svg/g, ''))) {
  const achado = html.match(/https?:\/\/[^\s"')]+/g).filter((u) => !u.startsWith('http://www.w3.org/2000/svg'));
  if (achado.length) console.warn('aviso: URLs no arquivo (texto, não carregadas):', [...new Set(achado)].slice(0, 5));
}
writeFileSync(join(raiz, 'previa/index.html'), html);
console.log(`previa/index.html: ${(html.length / 1024).toFixed(0)} KB`);
