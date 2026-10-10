// Monta o plugin do Obsidian em plugin/: main.js (motor + three.js embutidos, offline),
// styles.css (motor/galaxia.css + Manrope do tema + encaixe na visão) e manifest.json.
// Instalar: copiar os três arquivos para <cofre>/.obsidian/plugins/cerebro-galactico/.
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => readFileSync(join(raiz, p), 'utf8');

await build({
  entryPoints: [join(raiz, 'plugin/src/main.ts')],
  outfile: join(raiz, 'plugin/main.js'),
  bundle: true, minify: true, format: 'cjs', platform: 'browser', target: 'es2020',
  external: ['obsidian', 'electron', '@codemirror/*', '@lezer/*'],
  legalComments: 'none', logLevel: 'warning',
  banner: { js: '/* Cérebro Galáctico — gerado por scripts/montar-plugin.mjs a partir de plugin/src e motor/. Não edite à mão. */' },
});

const tema = ler('../referencias/tema-cerebro/theme.css');
const fontes = [...tema.matchAll(/@font-face\{font-family:'Manrope';[^}]*font-weight:(\d+)[^}]*\}/g)]
  .filter((m) => ['400', '500', '700'].includes(m[1]))
  .map((m) => m[0]).join('\n');
if (!fontes) throw new Error('Manrope não encontrada em referencias/tema-cerebro/theme.css');

const encaixe = `
/* a visão do Obsidian vira o palco inteiro: sem padding, sem rolagem */
.workspace-leaf-content[data-type="cerebro-galactico"] .view-content.cg-visao {
  padding: 0; overflow: hidden; position: relative; background: #070b16; outline: none;
}
.cg-visao > .cg-raiz { position: absolute; inset: 0; }
`;
writeFileSync(join(raiz, 'plugin/styles.css'),
  `/* Cérebro Galáctico — gerado por scripts/montar-plugin.mjs. Não edite à mão; edite motor/galaxia.css. */\n${fontes}\n${encaixe}\n${ler('motor/galaxia.css')}`);
const js = readFileSync(join(raiz, 'plugin/main.js'));
console.log(`plugin/main.js: ${(js.length / 1024).toFixed(0)} KB · plugin/styles.css pronto`);
