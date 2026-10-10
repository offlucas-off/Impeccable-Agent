// Plugin "Cérebro Galáctico": a galáxia da prévia dentro do Obsidian, alimentada pelo
// metadataCache (notas e links) e pelos eventos do workspace e do vault. Só lê o cofre.
import { AbstractInputSuggest, App, ItemView, Plugin, PluginSettingTab, Scope, Setting, TAbstractFile, TFile, WorkspaceLeaf } from 'obsidian';
import { criarGalaxia, type Galaxia, type Grafo } from '../../motor/galaxia.js';
import { bonito, mapear, nomesDasRegioes, noDe, POSICOES, type Mapa, type Regiao } from './regioes';

const TIPO_VISAO = 'cerebro-galactico';
const ICONE = 'orbit';

interface Configuracoes {
  som: boolean;
  reduzidos: boolean;
  fundo: boolean;
  esconderArquivo: boolean;
  novaAba: boolean;
  notaCaptura: string;
  /** nota no centro da galáxia; se não existir, vale a nota mais ligada */
  nucleo: string;
  /** pasta de topo -> região escolhida pelo usuário (o resto é automático) */
  pastas: Record<string, string>;
}

const PADRAO: Configuracoes = {
  som: false,
  reduzidos: false,
  fundo: true,
  esconderArquivo: false,
  novaAba: true,
  notaCaptura: '01_ENTRADA.md',
  nucleo: '00_PAINEL.md',
  pastas: {},
};

const idDe = (caminho: string) => caminho.replace(/\.md$/i, '');
const ehNota = (f: TAbstractFile | null): f is TFile => f instanceof TFile && f.extension === 'md';

export default class CerebroGalactico extends Plugin {
  config: Configuracoes = { ...PADRAO };

  async onload() {
    const salvo = await this.loadData();
    this.config = { ...PADRAO, ...salvo, pastas: { ...(salvo?.pastas ?? {}) } };
    this.registerView(TIPO_VISAO, (leaf) => new VisaoGalaxia(leaf, this));
    this.addRibbonIcon(ICONE, 'Abrir Cérebro Galáctico', () => this.abrirVisao());
    this.addCommand({ id: 'abrir', name: 'Abrir a galáxia', callback: () => this.abrirVisao() });
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
  private mapa: Mapa | null = null;

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

  remontar() { this.montar(); }

  private montar() {
    this.desmontar();
    this.contentEl.empty();
    const config = this.plugin.config;
    const grafo = this.lerGrafo();
    if (grafo.nos.length === 0) {
      // cofre sem notas: nada para desenhar ainda
      const vazio = this.contentEl.createDiv({ cls: 'cg-vazio' });
      vazio.createEl('strong', { text: 'A galáxia nasce com a primeira nota.' });
      vazio.createSpan({ text: 'Crie uma nota no cofre e ela acende aqui.' });
      return;
    }
    const { regioes, rotuloHalo } = nomesDasRegioes(this.mapa!);
    this.raiz = this.contentEl.createDiv();
    this.galaxia = criarGalaxia(this.raiz, grafo, {
      config: { som: config.som, reduzidos: config.reduzidos, fundo: config.fundo, esconderArquivo: config.esconderArquivo },
      textoClique: config.novaAba ? 'Abriu numa aba nova' : 'Abriu',
      aoAbrir: (id) => this.abrirNota(id),
      aoMudarConfig: (c) => { void this.plugin.salvarConfig(c); },
      alvoTeclado: this.contentEl,
      regioes,
      rotuloHalo,
      nucleo: idDe(config.nucleo),
      mostrarTipo: this.mapa!.cerebro,
      nomeCaptura: config.notaCaptura ? idDe(config.notaCaptura).split('/').pop() : undefined,
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
    this.mapa = mapear(arquivos.map((f) => f.path), this.plugin.config.pastas);
    const nos = arquivos.map((f) => noDe(f.path, this.mapa!));
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
    if (this.plugin.config.notaCaptura && f.path === this.plugin.config.notaCaptura) this.galaxia.captura();
    else this.galaxia.salvar(idDe(f.path));
  }

  aoCriar(f: TFile) {
    // primeira nota de um cofre vazio: monta a galáxia
    if (!this.galaxia) { if (this.contentEl.querySelector('.cg-vazio')) this.remontarDepois(); return; }
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
    // pasta de topo nova: o mapa automático muda, então a galáxia se remonta
    if (!this.mapa || (caminho.includes('/') && !this.mapa.regiao.has(caminho.split('/')[0]))) { this.remontarDepois(); return; }
    if (galaxia.nova(noDe(caminho, this.mapa), ligadas.map(idDe)) < 0) { this.remontarDepois(); return; }
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

  /** pastas de topo do cofre com a região de cada uma, para a configuração */
  mapaAtual(): Mapa {
    return mapear(this.app.vault.getMarkdownFiles().map((f) => f.path), this.plugin.config.pastas);
  }

  aplicarConfig() {
    const c = this.plugin.config;
    this.galaxia?.definirConfig({ som: c.som, reduzidos: c.reduzidos, fundo: c.fundo, esconderArquivo: c.esconderArquivo });
  }
}

// sugestões de notas do cofre para os campos de caminho
class SugestaoNota extends AbstractInputSuggest<TFile> {
  constructor(app: App, private campo: HTMLInputElement, private escolher: (f: TFile) => void) {
    super(app, campo);
  }
  getSuggestions(busca: string) {
    const q = busca.toLowerCase();
    return this.app.vault.getMarkdownFiles().filter((f) => f.path.toLowerCase().includes(q)).slice(0, 30);
  }
  renderSuggestion(f: TFile, el: HTMLElement) { el.setText(f.path); }
  selectSuggestion(f: TFile) { this.campo.value = f.path; this.escolher(f); this.close(); }
}

class AbaConfiguracoes extends PluginSettingTab {
  private remontar = 0;

  constructor(app: App, private plugin: CerebroGalactico) {
    super(app, plugin);
  }

  // mudanças que alteram o desenho remontam a galáxia, uma vez só depois da última
  private remontarGalaxia() {
    window.clearTimeout(this.remontar);
    this.remontar = window.setTimeout(() => this.plugin.visao()?.remontar(), 600);
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const chave = (nome: string, desc: string, campo: 'som' | 'reduzidos' | 'fundo' | 'esconderArquivo' | 'novaAba') =>
      new Setting(containerEl).setName(nome).setDesc(desc).addToggle((t) => t
        .setValue(this.plugin.config[campo])
        .onChange(async (v) => {
          await this.plugin.salvarConfig({ [campo]: v });
          if (campo === 'novaAba') this.remontarGalaxia();
          else this.plugin.visao()?.aplicarConfig();
        }));

    chave('Som de trovão', 'Cada raio e cada captura têm trovão sintetizado. Desligado por padrão.', 'som');
    chave('Efeitos reduzidos', 'Menos poeira e menos raios por evento. Ajuda em GPU integrada fraca.', 'reduzidos');
    chave('Atividade de fundo', 'Pulsos suaves entre as estrelas quando nada acontece no cofre.', 'fundo');
    chave('Esconder o halo', 'Tira da galáxia as pastas que estão no halo (o arquivo morto).', 'esconderArquivo');
    chave('Abrir em aba nova', 'Clique numa estrela abre a nota numa aba nova. Desligado, reaproveita a última aba de nota.', 'novaAba');

    this.notas();
    this.regioes();
  }

  private campoNota(nome: string, desc: string, campo: 'nucleo' | 'notaCaptura') {
    new Setting(this.containerEl).setName(nome).setDesc(desc).addSearch((t) => {
      t.setPlaceholder(PADRAO[campo]).setValue(this.plugin.config[campo]);
      const salvar = async (v: string) => { await this.plugin.salvarConfig({ [campo]: v.trim() }); this.remontarGalaxia(); };
      new SugestaoNota(this.app, t.inputEl, (f) => void salvar(f.path));
      t.onChange((v) => void salvar(v));
    });
  }

  private notas() {
    new Setting(this.containerEl).setName('Notas especiais').setHeading();
    this.campoNota('Nota do núcleo', 'Fica no centro da galáxia, maior que as outras, e é de onde sai a tempestade. Se não existir, o núcleo é a nota com mais links.', 'nucleo');
    this.campoNota('Nota de captura', 'Salvar esta nota dispara a tempestade a partir do núcleo. Vazio desliga.', 'notaCaptura');
  }

  private regioes() {
    const { containerEl } = this;
    new Setting(containerEl).setName('Regiões').setHeading()
      .setDesc('Cada pasta de topo do cofre ocupa uma região da galáxia. No automático, as maiores pastas ficam com os braços longos e pastas de arquivo vão para o halo. Notas soltas na raiz ficam no núcleo.');
    const mapa = this.plugin.visao()?.mapaAtual() ?? mapear(this.app.vault.getMarkdownFiles().map((f) => f.path), this.plugin.config.pastas);
    if (mapa.contagem.size === 0) {
      new Setting(containerEl).setDesc('O cofre ainda não tem pastas: todas as notas ficam no núcleo.');
      return;
    }
    const regioes = Object.keys(POSICOES) as Regiao[];
    for (const [pasta, qtd] of mapa.contagem) {
      const auto = mapa.auto.get(pasta)!;
      new Setting(containerEl)
        .setName(pasta)
        .setDesc(`${qtd.toLocaleString('pt-BR')} ${qtd === 1 ? 'nota' : 'notas'}${bonito(pasta) !== pasta ? ` · aparece como “${bonito(pasta)}”` : ''}`)
        .addDropdown((d) => {
          d.addOption('', `Automático: ${POSICOES[auto]}`);
          for (const r of regioes) d.addOption(r, POSICOES[r]);
          d.setValue(this.plugin.config.pastas[pasta] ?? '');
          d.onChange(async (v) => {
            const pastas = { ...this.plugin.config.pastas };
            if (v) pastas[pasta] = v; else delete pastas[pasta];
            await this.plugin.salvarConfig({ pastas });
            this.remontarGalaxia();
          });
        });
    }
    new Setting(containerEl).addButton((b) => b.setButtonText('Voltar tudo ao automático').onClick(async () => {
      await this.plugin.salvarConfig({ pastas: {} });
      this.remontarGalaxia();
      this.display();
    }));
  }
}
