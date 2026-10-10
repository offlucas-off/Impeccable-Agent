// Marcação do HUD, compartilhada entre a prévia e o plugin do Obsidian.
// Os ids vivem dentro de .cg-raiz; o plugin mantém uma única visão aberta.
const SIMULACAO = `<div id="simular" class="hud" role="group" aria-label="Simular eventos do Obsidian (só na prévia)">
  <span class="legenda">Prévia · simular</span>
  <button data-evento="abrir">Abrir nota</button>
  <button data-evento="salvar">Salvar</button>
  <button data-evento="nova">Nota nova</button>
  <button data-evento="captura">Captura no 01_ENTRADA</button>
  <button id="demo" aria-pressed="true">Manhã de trabalho</button>
</div>`;

export function htmlHud(opcoes = {}) {
  const simulacao = opcoes.simulacao ? SIMULACAO : '';
  return `<div id="palco" aria-label="O cofre como galáxia em três dimensões. Arraste para girar, role para voar na direção do ponteiro, clique numa estrela para abrir a nota."></div>
<div id="grao" aria-hidden="true"></div>

<header id="marca" class="hud">
  <h1>Cérebro Galáctico</h1>
  <p><b id="n-notas">0</b> estrelas · <b id="n-sinapses">0</b> sinapses</p>
</header>

<div id="comandos" class="hud">
  <div id="busca" role="search">
    <svg class="lupa" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.75"/><path d="m10.6 10.6 3.4 3.4" stroke-linecap="round"/></svg>
    <input id="busca-campo" type="search" placeholder="Buscar nota…" aria-label="Buscar nota pelo título" autocomplete="off" spellcheck="false" role="combobox" aria-controls="resultados" aria-expanded="false">
    <kbd>Ctrl K</kbd>
    <ul id="resultados" role="listbox" aria-label="Notas encontradas" hidden></ul>
  </div>
  <div style="position:relative">
    <button id="botao-filtros" class="botao-icone" aria-expanded="false" aria-controls="filtros" title="Filtros">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 4.5h7M12.5 4.5H14M2 11.5h2M7.5 11.5H14"/><circle cx="10.75" cy="4.5" r="1.75"/><circle cx="5.75" cy="11.5" r="1.75"/></svg>
      <span class="sr" hidden>Filtros</span>
    </button>
    <div id="filtros" hidden>
      <h2>Mostrar</h2>
      <div>
        <label class="chave">Esconder 99_ARQUIVO (halo) <input type="checkbox" id="f-arquivo"></label>
        <label class="chave">Atividade de fundo <input type="checkbox" id="f-fundo" checked></label>
        <label class="chave">Efeitos reduzidos <input type="checkbox" id="f-reduzidos"></label>
        <label class="chave">Som de trovão <input type="checkbox" id="f-som"></label>
      </div>
      <h2>Só uma região</h2>
      <div id="lobos"></div>
      <p id="poeira"></p>
      <p id="desempenho">Medindo desempenho…</p>
    </div>
  </div>
</div>

<div id="rotulo" class="hud" role="tooltip"><strong></strong><span></span></div>
<p id="evento" class="hud" aria-live="polite"></p>

${simulacao}

<div id="sem-webgl" hidden><div><strong>A galáxia precisa de WebGL.</strong>Este computador ou navegador não liberou a aceleração gráfica.</div></div>`;
}
