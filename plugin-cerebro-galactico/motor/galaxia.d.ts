// Tipos do motor para o plugin (main.ts). O motor em si é JavaScript puro.
export interface NoGrafo { id: string; t: string; l: string; k: string; s: string }
export interface Grafo { fonte?: string; notas: number; sinapses: number; nos: NoGrafo[]; arestas: [number, number][] }
export interface ConfigGalaxia { esconderArquivo?: boolean; fundo?: boolean; reduzidos?: boolean; som?: boolean }
export interface OpcoesGalaxia {
  carga?: number;
  simulacao?: boolean;
  config?: ConfigGalaxia;
  textoClique?: string;
  aoAbrir?: (id: string) => void;
  aoMudarConfig?: (config: Required<ConfigGalaxia>) => void;
  alvoTeclado?: EventTarget;
}
export interface Galaxia {
  indice(id: string): number;
  abrir(id: string): void;
  salvar(id: string): void;
  captura(): void;
  /** -1 quando a galáxia atingiu o limite de notas novas da sessão */
  nova(dados: NoGrafo, ligadas: string[]): number;
  ligar(a: string, b: string): void;
  remover(id: string): void;
  renomear(velho: string, novo: string, t: string): void;
  definirVisivel(visivel: boolean): void;
  definirConfig(config: ConfigGalaxia): void;
  destruir(): void;
}
export function criarGalaxia(raiz: HTMLElement, grafo: Grafo, opcoes?: OpcoesGalaxia): Galaxia | null;
