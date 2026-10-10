// Pastas do cofre -> regiões da galáxia. O cofre do Cérebro tem um mapa próprio (o mesmo de
// scripts/extrair-grafo); qualquer outro cofre é distribuído pelos braços por tamanho, e o
// usuário pode mover cada pasta de topo na aba de configurações.
import type { NoGrafo } from '../../motor/galaxia.js';

export type Regiao = 'frontal' | 'motor' | 'parietal' | 'temporal' | 'occipital' | 'cerebelo' | 'tronco' | 'talamo';

// onde cada região fica no desenho, como o usuário vê na configuração
export const POSICOES: Record<Regiao, string> = {
  frontal: 'Braço 1 (o mais longo)',
  motor: 'Braço 2',
  parietal: 'Ponta do braço 2',
  temporal: 'Braço 3',
  occipital: 'Ponta do braço 3',
  cerebelo: 'Braço 4',
  tronco: 'Halo, fora do disco',
  talamo: 'Núcleo',
};
const EH_REGIAO = (r: unknown): r is Regiao => typeof r === 'string' && r in POSICOES;

// pasta de topo do Cérebro -> (região, tipo de disparo)
const CEREBRO: Record<string, [Regiao, string]> = {
  '60_CONHECIMENTO': ['frontal', 'conhecimento'],
  '10_PROJETOS': ['parietal', 'projeto'],
  '20_REGRAS': ['temporal', 'regra'],
  '50_METODOS': ['temporal', 'metodo'],
  '30_INCIDENTES': ['occipital', 'incidente'],
  '40_DECISOES': ['motor', 'decisao'],
  '70_FONTES': ['cerebelo', 'fonte'],
  '80_PESQUISA': ['cerebelo', 'pesquisa'],
  '99_ARQUIVO': ['tronco', 'arquivo'],
  '90_SISTEMA': ['talamo', 'sistema'],
};
// tipo (cor da estrela) de quem não é do Cérebro: a cor acompanha a região
const TIPO_DA_REGIAO: Record<Regiao, string> = {
  frontal: 'conhecimento', motor: 'decisao', parietal: 'projeto', temporal: 'regra',
  occipital: 'incidente', cerebelo: 'fonte', tronco: 'arquivo', talamo: 'sistema',
};
// braços na ordem em que recebem as maiores pastas: os longos primeiro, as pontas por último
const ORDEM_BRACOS: Regiao[] = ['frontal', 'motor', 'temporal', 'cerebelo', 'parietal', 'occipital'];
const PARECE_ARQUIVO = /arquiv|archive|antig|^old$|lixeira|trash/i;

export interface Mapa {
  /** região final de cada pasta de topo (escolha do usuário ou automática) */
  regiao: Map<string, Regiao>;
  /** o que o automático escolheria, para mostrar na configuração */
  auto: Map<string, Regiao>;
  /** notas por pasta de topo, da maior para a menor */
  contagem: Map<string, number>;
  /** cofre com a estrutura do Cérebro: tipos de nota e nomes de região originais */
  cerebro: boolean;
}

export const pastaDe = (caminho: string) => (caminho.includes('/') ? caminho.slice(0, caminho.indexOf('/')) : '');

export function mapear(caminhos: string[], escolhas: Record<string, string>): Mapa {
  const contagem = new Map<string, number>();
  for (const c of caminhos) { const p = pastaDe(c); if (p) contagem.set(p, (contagem.get(p) ?? 0) + 1); }
  const pastas = [...contagem.keys()].sort((a, b) => contagem.get(b)! - contagem.get(a)! || a.localeCompare(b));
  const auto = new Map<string, Regiao>();
  const total = new Map<Regiao, number>();
  const somar = (r: Regiao, p: string) => { auto.set(p, r); total.set(r, (total.get(r) ?? 0) + contagem.get(p)!); };
  for (const p of pastas) if (CEREBRO[p]) somar(CEREBRO[p][0], p);
  const livres = ORDEM_BRACOS.filter((r) => !total.has(r));
  for (const p of pastas) {
    if (auto.has(p)) continue;
    if (PARECE_ARQUIVO.test(p)) { somar('tronco', p); continue; }
    // braço livre para a próxima maior pasta; acabaram, vai para o braço com menos notas
    const r = livres.shift() ?? ORDEM_BRACOS.reduce((m, b) => ((total.get(b) ?? 0) < (total.get(m) ?? 0) ? b : m));
    somar(r, p);
  }
  const regiao = new Map<string, Regiao>();
  for (const p of pastas) { const e = escolhas[p]; regiao.set(p, EH_REGIAO(e) ? e : auto.get(p)!); }
  const cerebro = pastas.filter((p) => CEREBRO[p]).length >= 3;
  return { regiao, auto, contagem, cerebro };
}

export function noDe(caminho: string, mapa: Mapa): NoGrafo {
  const id = caminho.replace(/\.md$/i, '');
  const partes = id.split('/');
  const topo = partes.length > 1 ? partes[0] : '';
  const l: Regiao = topo ? mapa.regiao.get(topo) ?? 'talamo' : 'talamo';
  const k = (mapa.cerebro && CEREBRO[topo]?.[1]) || TIPO_DA_REGIAO[l];
  // sub-região: aglomerado ao longo do braço. No Cérebro, o 2º nível de conhecimento
  // (VIDEO ganha mais um nível) e de projetos; nos outros cofres, o 2º nível de qualquer pasta.
  let s = '';
  if (CEREBRO[topo] && mapa.cerebro) {
    if (topo === '60_CONHECIMENTO' && partes.length > 2) s = partes[1] === 'VIDEO' && partes.length > 3 ? `VIDEO/${partes[2]}` : partes[1];
    else if (topo === '10_PROJETOS' && partes.length > 2) s = partes[1];
  } else if (partes.length > 2) {
    s = partes[1];
  }
  return { id, t: partes[partes.length - 1], l, k, s };
}

// "60_CONHECIMENTO" -> "Conhecimento"; "receitas-da-vó" -> "Receitas da vó"
export function bonito(pasta: string): string {
  let t = pasta.replace(/^[\d\s._-]+/, '').replace(/[_-]+/g, ' ').trim() || pasta;
  if (t === t.toUpperCase()) t = t.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// nomes das regiões que receberam pastas de fora do mapa do Cérebro, e o rótulo do halo
export function nomesDasRegioes(mapa: Mapa) {
  const porRegiao = new Map<Regiao, string[]>();
  for (const [p, r] of mapa.regiao) porRegiao.set(r, [...(porRegiao.get(r) ?? []), p]);
  const regioes: Partial<Record<Regiao, { nome: string; onde?: string }>> = {};
  for (const [r, pastas] of porRegiao) {
    if (r === 'talamo') continue;
    const doCerebro = mapa.cerebro && pastas.every((p) => CEREBRO[p]?.[0] === r);
    if (doCerebro) continue;
    const nomes = pastas.map(bonito);
    const nome = nomes.length > 2 ? `${nomes.slice(0, 2).join(' · ')} +${nomes.length - 2}` : nomes.join(' · ');
    regioes[r] = r === 'tronco' ? { nome } : { nome, onde: `região ${nome}` };
  }
  const halo = porRegiao.get('tronco') ?? [];
  const rotuloHalo = halo.length ? `Esconder o halo (${halo.length > 2 ? `${halo.slice(0, 2).join(', ')}…` : halo.join(', ')})` : 'Esconder o halo';
  return { regioes, rotuloHalo };
}
