# Cérebro em raio X — plano (shape) e estado da prévia

> `/impeccable shape → new-work → animate/overdrive` · 2026-10-10 · Pedido 3 do dono.
> **Status: prévia pronta, plugin parado aguardando o ok do dono** (limite 1 do pedido).

## 1. Para quem e onde

- **Só o dono**, no Obsidian desktop (Windows 11, notebook com GPU integrada), numa aba própria ou no painel lateral.
- **Uso:** abrir no começo do dia e deixar rodando enquanto trabalha; navegar pelo cofre clicando nos neurônios.
- **Modo Impeccable: Experience.** A obra é o próprio cérebro e a interface quase some: só um título, a contagem, a busca, os filtros e o EEG.
- Textos da interface em português do Brasil. O plugin só lê o cofre; nunca grava, move nem apaga nada.

## 2. Direção (registrada em `.impeccable/surfaces/plugin-cerebro-raio-x-previa-index-html.md`)

- **Tese:** o cofre como uma radiografia viva do órgão. As notas são neurônios dentro de um córtex translúcido, e o trabalho real faz eles dispararem. Recusa o "novelo" do graph view e o cérebro neon de ficção científica.
- **Mundo:** fixado pelo dono (raio X de simulação neural + tema Cerebro). A skill sorteou, como elemento extra, um **traçado de EEG**, aprovado pelo dono como histórico.
- **Técnica (escolha do dono):** Three.js, com o córtex em casca procedural sombreada em fresnel (as duas faces somam, como num filme radiográfico), os neurônios num único objeto de pontos e as sinapses num único objeto de linhas. O brilho dos disparos é aditivo, sem passe de bloom em tela cheia: o bloom fica só onde há disparo e custa quase nada na GPU integrada.

## 3. Dados

- **Prévia:** `scripts/extrair-grafo <cofre> previa/grafo.json` (Python, só biblioteca padrão, só leitura). Resolve `[[links]]` como o Obsidian: caminho exato ou nome do arquivo, ignorando blocos de código.
  - **Resultado no espelho atual:** 1.114 notas e 5.955 sinapses, com 12 notas isoladas.
  - **Reprodutível:** duas execuções geraram o mesmo arquivo, byte a byte (`cmp` sem diferença).
- **Plugin:** `app.metadataCache.resolvedLinks`, atualizado no evento `resolved`. Não lê arquivo.

| Lobo | Pastas | Notas |
|---|---|---|
| Frontal | 60_CONHECIMENTO (sub-regiões por ramo) | 459 |
| Occipital | 30_INCIDENTES | 170 |
| Temporal | 20_REGRAS + 50_METODOS | 159 |
| Motor (faixa central) | 40_DECISOES | 156 |
| Cerebelo | 70_FONTES + 80_PESQUISA | 68 |
| Parietal | 10_PROJETOS (sub-regiões por projeto) | 56 |
| Tronco (apagado) | 99_ARQUIVO | 33 |
| Tálamo | raiz (00_PAINEL no centro) + 90_SISTEMA | 13 |

## 4. A proporção do VIDEO (o pedido pediu solução)

- **O frontal não desequilibra o volume.** Ele recebe 41% das notas e, na anatomia, ocupa cerca de 40% do córtex: o tamanho dos lobos fica anatômico, e a diferença aparece como densidade.
- **O desequilíbrio real é dentro do frontal:** VIDEO tem 401 das 459 notas (motion-lab 195, edicao-retencao 91). Sem tratamento, IA-SEGURANCA (26), GAMEDEV (9) e AUDIO (7) sumiriam.
- **Solução aplicada:** cada ramo vira uma sub-região, um giro, com área proporcional à **raiz quadrada** do número de notas. motion-lab fica cerca de 5× maior que GAMEDEV, e não 22× maior. As sementes das sub-regiões são espalhadas pela maior distância entre si, então cada ramo tem seu canto. O parietal usa a mesma regra para os projetos.
- O tamanho de cada neurônio segue o número de sinapses (em log), para os hubs (Motion Lab, HUB-VIDEO, NWL, CORTES-GAMER) se destacarem sem ofuscar.

## 5. Geometria (procedural, sem modelo baixado)

- **Hemisférios:** dois, com a fissura longitudinal entre eles e a face medial achatada (e apagada no raio X para não virar um disco no meio). Lobo temporal descendo na lateral, polo occipital mais baixo e frontal mais estreito.
- **Sulcos e giros:** saem das curvas de nível zero de um ruído 3D com distorção de domínio. É isso que forma vales sinuosos como os do córtex. A fissura de Sylvius e o sulco central são desenhados à mão.
- **Estruturas internas:** cerebelo com folhas horizontais, tronco com ponte, tálamo duplo no centro.
- **Sinapses:** curvas que mergulham pela substância branca, com o ponto de controle puxado para o centro, em vez de retas que cortam a casca.
- **Posições estáveis:** cada nota tem a mesma posição em toda sessão (semente pelo caminho da nota).

## 6. Raios (eventos) e o EEG

| Evento no plugin | API do Obsidian | O que acontece |
|---|---|---|
| Abrir nota | `workspace.on('file-open')` | O neurônio acende e o pulso viaja **2 saltos**, até 12 vizinhos no 1º salto e 4 no 2º |
| Editar e salvar | `vault.on('modify')` | Pulso mais forte (1,45×), com 16 vizinhos e eco nos vizinhos após 380 ms |
| Nota nova | `vault.on('create')` + `resolved` | O neurônio nasce com brilho em 1,4 s e as sinapses entram depois |
| 01_ENTRADA mudou | `vault.on('modify')` filtrado pelo caminho | Onda esférica curta a partir do tálamo, com pico em todos os canais |
| Sem eventos | — | Disparos fracos e esparsos (1 a cada 260–780 ms); 18% deles mandam um pulso a um vizinho |

- **Cores:** só no disparo, por tipo, com os tokens do pedido. Em repouso, tudo é azul-raio-X.
- **EEG:** 8 canais (um por lobo) na borda inferior, com os últimos 5 minutos. Cada evento real vira um pico na cor do tipo. Passar o mouse mostra a nota, e clicar no pico vai até ela.

## 7. Interação

- **Navegação:** arrastar gira, a roda aproxima, e o giro automático lento para ao interagir e volta depois de 20 s.
- **Clique:** clicar num neurônio abre a nota e centraliza a câmera nela; as sinapses dela ficam realçadas na cor do tipo. Na prévia, mostra "Abriria …".
- **Hover:** mostra o título, o lobo, o tipo e o número de sinapses.
- **Busca:** `Ctrl K`, sem diferenciar acento nem caixa, com até 8 resultados ordenados por "começa com" e depois por número de sinapses. Enter voa até o neurônio.
- **Filtros:** esconder 99_ARQUIVO, mostrar só um lobo (os outros ficam a 14%), atividade de fundo, efeitos reduzidos, EEG. O painel de filtros mostra os **fps ao vivo**.
- **Painel lateral estreito (≤ 560 px):** a busca vira ícone, o EEG usa siglas e a câmera se afasta para o cérebro caber na largura.

## 8. Desempenho e acessibilidade

- **3 draw calls principais** (casca, sinapses, neurônios), mais pulsos e realce. Nenhum passe de pós-processamento.
- **Por quadro:** atividade só de 1.114 floats, pulsos até 700 (160 nos efeitos reduzidos) e hover com no máximo 1 busca por quadro.
- **Resolução:** DPR limitado a 1,5 (1,0 nos efeitos reduzidos). Pede a GPU de baixo consumo.
- **Pausa:** para tudo quando a aba fica oculta (`visibilitychange`). No plugin, também quando a folha não está visível.
- **`prefers-reduced-motion`:** sem giro automático; pulsos chegam na hora, sem viajar; o EEG atualiza 1×/s; transições zeradas.
- **Medido aqui:** só em Chromium headless com **SwiftShader (GPU por software, sem placa)**: 16 a 32 fps com 1.114 neurônios, caindo para ~1 fps quando o container ficou sem CPU (a build anterior caiu igual, então não é regressão). Não representa a GPU integrada.
- **Para medir no notebook:** abra `previa/index.html?carga=1300` e veja a linha de desempenho no painel de filtros. Ela completa o grafo com 186 notas sintéticas e avisa "carga de teste".

## 9. Depois do ok (limite 2 do pedido)

- **Estrutura:** `manifest.json`, `main.js` e `styles.css` em `plugin-cerebro-raio-x/plugin/`; TypeScript compilado com esbuild e three@0.185.1 embutido no bundle, com versão exata (publicada em 2026-07-01).
- **Abertura:** `ItemView` própria, comando "Abrir Cérebro em raio X" e ícone na faixa lateral. Funciona em aba ou no painel lateral.
- **Configurações:** aba do plugin com os mesmos filtros, a velocidade do giro e a janela do EEG.
- **Restrições:** nenhuma URL externa, sem telemetria, só leitura. Combina com o tema Cerebro e não mexe nele.
- **Finalização:** revisão final da Impeccable, DESIGN.md registrado pelo documentador e capturas com procedência.

## 10. Revisão final da prévia (impeccable-finish-reviewer): "ship after fixes", 8 correções aplicadas

1. 99_ARQUIVO apagado de verdade no tronco (cor #58627e e 45% do brilho em repouso).
2. Um único laço de render: esconder e mostrar a aba não duplica mais o requestAnimationFrame (vazamento num dia inteiro aberto).
3. A câmera volta à vista de 3/4 centrada com Esc, com clique no vazio ou depois de 20 s sem interação.
4. A casca usa os tokens do tema (#569cff / #7ea2ff).
5. O brilho das sinapses se ajusta à área da tela, para o painel lateral não virar uma placa azul.
6. O EEG redesenha 4×/s, ou na hora quando chega um evento (antes eram 30×/s), e cada pico só é calculado na sua janela. Entrou o `?carga=1300`.
7. Contraste: rótulos do EEG, legenda, desempenho e atalho passaram para #8d97b3 (cerca de 6,8:1).
8. As sinapses de uma nota nova voltam ao brilho normal depois do nascimento.

Também saiu o vidro decorativo (backdrop-filter) da busca, e o contrato registra o EEG com 132 px.

## 11. Decisões em aberto

1. **Clique num neurônio:** abre a nota na mesma aba ou numa aba nova? (Proposta: aba nova, deixando o cérebro aberto.)
2. **No painel lateral:** o EEG some por padrão? Hoje ele aparece, com siglas.
3. **Nota nova sem links:** onde ela nasce? (Proposta: na sub-região da pasta, e liga quando o `resolved` trouxer os links.)
