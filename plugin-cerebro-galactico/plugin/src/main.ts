// Plugin "Cérebro Galáctico": a galáxia da prévia dentro do Obsidian, alimentada pelo
// metadataCache (notas e links) e pelos eventos do workspace e do vault. Só lê o cofre.
import { App, ItemView, Plugin, PluginSettingTab, Scope, Setting, TAbstractFile, TFile, WorkspaceLeaf } from 'obsidian';
import { criarGalaxia, type Galaxia, type Grafo, type NoGrafo } from '../../motor/galaxia.js';

const TIPO_VISAO = 'cerebro-galactico';
const ICONE = 'orbit';

interface Configuracoes {
  som: boolean;
  reduzidos: boolean;
  fundo: boolean;
  esconderArquivo: boolean;
  novaAba: boolean;
  notaCaptura: string;
}

const PADRAO: Configuracoes = {
  som: false,
  reduzidos: false,
  fundo: true,
  esconderArquivo: false,
  novaAba: true,
  notaCaptura: '01_ENTRADA.md',
};

// pasta de topo -> (lobo, tipo de disparo); o mesmo mapa de scripts/extrair-grafo
const LOBOS: Record<string, [string, string]> = {
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

const idDe = (caminho: string) => caminho.replace(/\.md$/i, '');
const ehNota = (f: TAbstractFile | null): f is TFile => f instanceof TFile && f.extension === 'md';

function noDe(caminho: string): NoGrafo {
  const id = idDe(caminho);
  const partes = id.split('/');
  const topo = partes.length > 1 ? partes[0] : '';
  const [l, k] = LOBOS[topo] ?? ['talamo', 'sistema'];
  let s = '';
  if (topo === '60_CONHECIMENTO' && partes.length > 2) {
    s = partes[1];
    if (s === 'VIDEO' && partes.length > 3) s = `VIDEO/${partes[2]}`;
  } else if (topo === '10_PROJETOS' && partes.length > 2) {
    s = partes[1];
  }
  return { id, t: partes[partes.length - 1], l, k, s };
}

export default class CerebroGalactico extends Plugin {
  config: Configuracoes = { ...PADRAO };

  async onload() {
    this.config = { ...PADRAO, ...(await this.loadData()) };
    this.registerView(TIPO_VISAO, (leaf) => new VisaoGalaxia(leaf, this));
    this.addRibbonIcon(ICONE, 'Abrir Cérebro Galáctico', () => this.abrirVisao());
    this.addCommand({ id: 'abrir', name: 'Abrir Cérebro Galáctico', callback: () => this.abrirVisao() });
    this.addSettingTab(new AbaConfiguracoes(this.app, this));
    // eventos do cofre só depois do carregamento: na abertura o vault dispara "create" para tudo
    this.app.workspace.onLayoutReady(() => this.ouvirCofre());
  }

  visao(): VisaoGalaxia | null {
    const folha = this.app.workspace.getLeavesOfType(TIPO_VISAO)[0];
    return folha?.view instanceof VisaoGalaxia ? folha.view : null;
  }

  // uma única visão: o HUD usa ids e a GPU não precisa de duas galáxias
  async abrirVisao() {
    const { workspace } = this.app;
    let folha = workspace.getLeavesOfType(TIPO_VISAO)[0];
    if (!folha) {
      folha = workspace.getLeaf('tab');
      await folha.setViewState({ type: TIPO_VISAO, active: true });
    }
    await workspace.revealLeaf(folha);
  }

  async salvarConfig(mudancas: Partial<Configuracoes>) {
    Object.assign(this.config, mudancas);
    await this.saveData(this.config);
  }

  private ouvirCofre() {
    const { workspace, vault, metadataCache } = this.app;
    this.registerEvent(workspace.on('file-open', (f) => { if (ehNota(f)) this.visao()?.aoAbrirArquivo(f); }));
    this.registerEvent(vault.on('modify', (f) => { if (ehNota(f)) this.visao()?.aoModificar(f); }));
    this.registerEvent(vault.on('create', (f) => { if (ehNota(f)) this.visao()?.aoCriar(f); }));
    this.registerEvent(vault.on('delete', (f) => { if (ehNota(f)) this.visao()?.aoApagar(f); }));
    this.registerEvent(vault.on('rename', (f, antigo) => { if (ehNota(f)) this.visao()?.aoRenomear(f, antigo); }));
    this.registerEvent(metadataCache.on('resolve', (f) => { if (ehNota(f)) this.visao()?.aoResolver(f); }));
  }
}

class VisaoGalaxia extends ItemView {
  private galaxia: Galaxia | null = null;
  private raiz: HTMLElement | null = null;
  // links já desenhados, por nota de origem: o diff contra o metadataCache acha os novos
  private links = new Map<string, Set<string>>();
  // notas criadas esperando o metadataCache resolver os links delas
  private pendentes = new Map<string, number>();
  private ultimoClique = { caminho: '', quando: 0 };
  private reconstruir = 0;

  constructor(leaf: WorkspaceLeaf, private plugin: CerebroGalactico) {
    super(leaf);
    // Ctrl/Cmd+K busca na galáxia enquanto a visão estiver ativa (sem cair no atalho global)
    this.scope = new Scope(this.app.scope);
    this.scope.register(['Mod'], 'k', () => {
      const campo = this.contentEl.querySelector<HTMLInputElement>('#busca-campo');
      campo?.focus(); campo?.select();
      return false;
    });
  }

  getViewType() { return TIPO_VISAO; }
  getDisplayText() { return 'Cérebro Galáctico'; }
  getIcon() { return ICONE; }

  async onOpen() {
    this.contentEl.addClass('cg-visao');
    // focável, para Esc e atalhos chegarem ao motor depois de um clique no céu
    this.contentEl.tabIndex = -1;
    this.registerDomEvent(this.contentEl, 'pointerdown', (e) => {
      if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement)) this.contentEl.focus({ preventScroll: true });
    });
    const visibilidade = () => this.galaxia?.definirVisivel(this.contentEl.isShown());
    this.registerEvent(this.app.workspace.on('layout-change', visibilidade));
    this.registerEvent(this.app.workspace.on('active-leaf-change', visibilidade));
    this.registerEvent(this.app.workspace.on('resize', visibilidade));
    // o metadataCache pode ainda estar indexando quando o Obsidian abre com a visão restaurada
    if (Object.keys(this.app.metadataCache.resolvedLinks).length === 0 && this.app.vault.getMarkdownFiles().length > 0) {
      this.registerEvent(this.app.metadataCache.on('resolved', () => { if (!this.galaxia) this.montar(); }));
      this.contentEl.setText('Lendo o cofre…');
      return;
    }
    this.montar();
  }

  async onClose() {
    window.clearTimeout(this.reconstruir);
    this.pendentes.forEach((t) => window.clearTimeout(t));
    this.desmontar();
  }

  remontar() { if (this.galaxia) this.montar(); }

  private montar() {
    this.desmontar();
    this.contentEl.empty();
    this.raiz = this.contentEl.createDiv();
    const config = this.plugin.config;
    this.galaxia = criarGalaxia(this.raiz, this.lerGrafo(), {
      config: { som: config.som, reduzidos: config.reduzidos, fundo: config.fundo, esconderArquivo: config.esconderArquivo },
      textoClique: config.novaAba ? 'Abriu numa aba nova' : 'Abriu',
      aoAbrir: (id) => this.abrirNota(id),
      aoMudarConfig: (c) => { void this.plugin.salvarConfig(c); },
      alvoTeclado: this.contentEl,
    });
    this.galaxia?.definirVisivel(this.contentEl.isShown());
  }

  private desmontar() {
    this.galaxia?.destruir();
    this.galaxia = null;
    this.raiz?.remove();
    this.raiz = null;
  }

  // o motor guarda espaço para ~96 notas novas por sessão; passou disso, remonta com o grafo atual
  private remontarDepois() {
    window.clearTimeout(this.reconstruir);
    this.reconstruir = window.setTimeout(() => this.montar(), 1200);
  }

  private lerGrafo(): Grafo {
    const arquivos = this.app.vault.getMarkdownFiles().sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    const indice = new Map(arquivos.map((f, i) => [f.path, i]));
    const nos = arquivos.map((f) => noDe(f.path));
    const pares = new Set<string>();
    const arestas: [number, number][] = [];
    this.links.clear();
    const resolvidos = this.app.metadataCache.resolvedLinks;
    for (const origem in resolvidos) {
      const i = indice.get(origem);
      if (i === undefined) continue;
      const destinos = new Set<string>();
      for (const destino in resolvidos[origem]) {
        const j = indice.get(destino);
        if (j === undefined || j === i) continue;
        destinos.add(destino);
        const a = Math.min(i, j), b = Math.max(i, j), chave = `${a}:${b}`;
        if (!pares.has(chave)) { pares.add(chave); arestas.push([a, b]); }
      }
      this.links.set(origem, destinos);
    }
    return { fonte: this.app.vault.getName(), notas: nos.length, sinapses: arestas.length, nos, arestas };
  }

  private async abrirNota(id: string) {
    const arquivo = this.app.vault.getFileByPath(`${id}.md`);
    if (!arquivo) return;
    this.ultimoClique = { caminho: arquivo.path, quando: Date.now() };
    const { workspace } = this.app;
    const folha = this.plugin.config.novaAba
      ? workspace.getLeaf('tab')
      : workspace.getLeavesOfType('markdown')[0] ?? workspace.getLeaf('tab');
    await folha.openFile(arquivo);
  }

  // ---- eventos do cofre (chamados pelo plugin) ----

  aoAbrirArquivo(f: TFile) {
    // o clique na estrela já acendeu a galáxia; o file-open que vem em seguida não repete
    if (f.path === this.ultimoClique.caminho && Date.now() - this.ultimoClique.quando < 1500) return;
    this.galaxia?.abrir(idDe(f.path));
  }

  aoModificar(f: TFile) {
    if (!this.galaxia) return;
    if (f.path === this.plugin.config.notaCaptura) this.galaxia.captura();
    else this.galaxia.salvar(idDe(f.path));
  }

  aoCriar(f: TFile) {
    if (!this.galaxia) return;
    // espera o metadataCache ler os links; nota vazia (Ctrl+N) nasce sozinha em 2 s
    this.pendentes.set(f.path, window.setTimeout(() => this.nascer(f.path), 2000));
  }

  aoResolver(f: TFile) {
    if (!this.galaxia) return;
    if (this.pendentes.has(f.path)) { this.nascer(f.path); return; }
    const galaxia = this.galaxia;
    if (galaxia.indice(idDe(f.path)) < 0) return;
    const atuais = Object.keys(this.app.metadataCache.resolvedLinks[f.path] ?? {});
    const conhecidos = this.links.get(f.path) ?? new Set<string>();
    for (const destino of atuais) {
      if (conhecidos.has(destino) || destino === f.path || !destino.endsWith('.md')) continue;
      // só conta como desenhado quando as duas estrelas existem
      if (galaxia.indice(idDe(destino)) < 0) continue;
      galaxia.ligar(idDe(f.path), idDe(destino));
      conhecidos.add(destino);
    }
    this.links.set(f.path, conhecidos);
  }

  private nascer(caminho: string) {
    const espera = this.pendentes.get(caminho);
    if (espera === undefined || !this.galaxia) return;
    window.clearTimeout(espera);
    this.pendentes.delete(caminho);
    const galaxia = this.galaxia;
    const resolvidos = this.app.metadataCache.resolvedLinks;
    const saida = Object.keys(resolvidos[caminho] ?? {}).filter((d) => d !== caminho && galaxia.indice(idDe(d)) >= 0);
    const entrada = Object.keys(resolvidos).filter((o) => o !== caminho && resolvidos[o][caminho] && galaxia.indice(idDe(o)) >= 0);
    const ligadas = [...new Set([...saida, ...entrada])];
    if (galaxia.nova(noDe(caminho), ligadas.map(idDe)) < 0) { this.remontarDepois(); return; }
    this.links.set(caminho, new Set(saida));
    for (const o of entrada) (this.links.get(o) ?? this.links.set(o, new Set()).get(o)!).add(caminho);
  }

  aoApagar(f: TFile) {
    const espera = this.pendentes.get(f.path);
    if (espera !== undefined) { window.clearTimeout(espera); this.pendentes.delete(f.path); }
    this.links.delete(f.path);
    this.galaxia?.remover(idDe(f.path));
  }

  aoRenomear(f: TFile, antigo: string) {
    const conhecidos = this.links.get(antigo);
    if (conhecidos) { this.links.delete(antigo); this.links.set(f.path, conhecidos); }
    for (const destinos of this.links.values()) if (destinos.delete(antigo)) destinos.add(f.path);
    this.galaxia?.renomear(idDe(antigo), idDe(f.path), f.basename);
  }

  aplicarConfig() {
    const c = this.plugin.config;
    this.galaxia?.definirConfig({ som: c.som, reduzidos: c.reduzidos, fundo: c.fundo, esconderArquivo: c.esconderArquivo });
  }
}

class AbaConfiguracoes extends PluginSettingTab {
  constructor(app: App, private plugin: CerebroGalactico) {
    super(app, plugin);
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const chave = (nome: string, desc: string, campo: 'som' | 'reduzidos' | 'fundo' | 'esconderArquivo' | 'novaAba') =>
      new Setting(containerEl).setName(nome).setDesc(desc).addToggle((t) => t
        .setValue(this.plugin.config[campo])
        .onChange(async (v) => {
          await this.plugin.salvarConfig({ [campo]: v });
          if (campo === 'novaAba') this.plugin.visao()?.remontar();
          else this.plugin.visao()?.aplicarConfig();
        }));

    chave('Som de trovão', 'Cada raio e cada captura têm trovão sintetizado. Desligado por padrão.', 'som');
    chave('Efeitos reduzidos', 'Menos poeira e menos raios por evento. Ajuda em GPU integrada fraca.', 'reduzidos');
    chave('Atividade de fundo', 'Pulsos suaves de neurônios quando nada acontece no cofre.', 'fundo');
    chave('Esconder 99_ARQUIVO', 'Tira o halo do arquivo morto da galáxia.', 'esconderArquivo');
    chave('Abrir em aba nova', 'Clique numa estrela abre a nota numa aba nova. Desligado, reaproveita a última aba de nota.', 'novaAba');

    new Setting(containerEl)
      .setName('Nota de captura')
      .setDesc('Salvar esta nota dispara a tempestade a partir do núcleo. Caminho a partir da raiz do cofre.')
      .addText((t) => t
        .setPlaceholder(PADRAO.notaCaptura)
        .setValue(this.plugin.config.notaCaptura)
        .onChange(async (v) => { await this.plugin.salvarConfig({ notaCaptura: v.trim() || PADRAO.notaCaptura }); }));
  }
}
