# Cérebro Galáctico — plano e estado da prévia

> `/impeccable` redesign · 2026-10-10. Substitui o "Cérebro em raio X" (arquivado em `arquivo/plugin-cerebro-raio-x/`, conhecimento em `conhecimento/cerebro-em-raio-x.md`).
> **Status: prévia pronta, plugin parado aguardando o ok do dono.**
> Contrato de direção: `.impeccable/surfaces/plugin-cerebro-galactico-previa-index-html.md`.

## O que muda e o que fica

- **Muda o mundo:** de órgão em raio X para galáxia espiral, com a paleta SHO das suas referências (poeira ferrugem, laranja e dourada, cavidade teal e azul, núcleo branco-quente).
- **Navegação, escolha sua:** voo pela galáxia. A roda voa na direção do ponteiro, atravessando a poeira, e o clique faz um voo curvo até a estrela, com o campo de visão abrindo no meio do caminho.
- **Fica tudo do produto:** grafo real (1.114 notas e 5.955 sinapses), eventos do Obsidian, busca, filtros, carga de teste. A faixa de histórico "Sinal" saiu por decisão sua; a tela fica só com o céu. Fica também cada limite do pedido: só leitura, offline, GPU integrada, pausa com a aba oculta, efeitos reduzidos, `prefers-reduced-motion`.

## Mapa do cofre na galáxia

| Lugar | Pastas | Notas |
|---|---|---|
| Núcleo | raiz (00_PAINEL no centro exato) + 90_SISTEMA | 13 |
| Braço 1 | 60_CONHECIMENTO, ramos como aglomerados ao longo do braço (comprimento ∝ √notas) | 459 |
| Braço 2 | 20_REGRAS + 50_METODOS (dentro) → 30_INCIDENTES (ponta) | 159 + 170 |
| Braço 3 | 40_DECISOES (dentro) → 10_PROJETOS (ponta, aglomerado por projeto) | 156 + 56 |
| Braço 4 | 70_FONTES + 80_PESQUISA | 68 |
| Halo | 99_ARQUIVO, esparso e apagado | 33 |

## A poeira que cresce (global + local, escolha sua)

- **Global:** a opacidade de toda a poeira segue `0,2 + 0,8·(1 − e^(−sinapses/7000))`. Hoje, com 5.955 sinapses, está em **66%**; com 10.000, iria a 81%. O painel de filtros mostra o número.
- **Local:**
  - Cada nota sopra uma nuvem em volta da estrela, e é isso que desenha os braços.
  - Cada sinapse deixa um grão de poeira estelar que cintila no seu trajeto, todas as 5.955.
  - Até 2.600 sinapses também deixam gás no caminho; com mais que isso, a amostra compensa na opacidade.
  - Ao lado de dentro dos braços há faixas escuras de absorção, como a coluna escura da sua foto de referência.
- **Link novo:** acende o grão e deposita gás na hora, e a densidade global sobe.

## Trovões e efeitos (os quatro que você marcou)

| Evento | Efeito |
|---|---|
| Abrir nota | A estrela pulsa e a luz corre pelos filetes até 2 saltos, na cor do tipo, acendendo a poeira em volta |
| Salvar | **Relâmpago de verdade** da estrela até as 4 notas ligadas mais distantes (ao menos metade em outra região). Primeiro desce o líder em degraus, fraco, abrindo galhos; quando toca o destino vem a descarga (o canal inteiro acende), quase apaga, reacende e esfria para violeta. O clarão ilumina a poeira por dentro, como raio em nuvem. **No máximo um raio por nota a cada 15 s**; salvar de novo antes disso dá só um pulso suave |
| Captura no 01_ENTRADA | **Explosão estelar no núcleo:** estrela-clarão com raios de difração, 420 estilhaços que freiam e esfriam de branco para azul, ouro, laranja e ferrugem, gás que se expande devagar e acende com o clarão, frente de choque fina no plano do disco, tremor curto da câmera e raios curtos nos braços conforme a onda passa |
| Nota nova | **Estrela nascendo:** 44 grãos de poeira espiralam até um ponto, a estrela acende com um clarão e os filetes entram em seguida |
| Sem eventos | Estrelas cintilam e, a cada 9–18 s, um trovão distante acende um pedaço da poeira (com som, se ligado) |

- **Estrelas-hub** (40 ou mais sinapses, e o 00_PAINEL) têm raios de difração em cruz, como a estrela azul da sua foto.

## Céu 360° (fundo)

- **Via Láctea completa:** uma faixa com bojo, faixas escuras de poeira e manchas de nebulosa, pintada uma vez na GPU (2048×1024) numa esfera em volta de tudo. Gire a câmera para qualquer lado e há céu.
- **14.000 estrelas de fundo,** 60% concentradas na faixa; as mais fortes com raios de difração.
- **540 galáxias estáticas** de um atlas procedural com 16 tipos (espirais, barradas, elípticas, de perfil, irregular, lenticular, nebulosa em concha e explosão de filamentos, como nas suas referências). As 120 maiores ficam mais perto e se deslocam devagar quando você voa (paralaxe); as 420 menores, ao fundo. Nenhuma cobre a faixa da Via Láctea, como no céu real.

## Desempenho (GPU integrada, 30 fps ou mais com 1.300 notas)

- **Poeira:** cerca de 3.800 nuvens e 500 faixas escuras, cada uma um ponto com textura de um atlas procedural 4×4 gerado no código. É desenhada em **meia resolução** e composta por cima, o que corta o custo de sobreposição em cerca de 4×. O tamanho tem teto relativo à tela, e a nuvem some perto da câmera.
- **Ajuste automático:** abaixo de 28 fps por 3 s, a resolução cai para 1× e a poeira para 60%. O painel avisa "qualidade ajustada".
- **Comum ao projeto anterior:** um único laço de render, pausa com a aba oculta e carga de teste com `?carga=1300` ou `#carga1300`.
- **Medido aqui:** só GPU por software, então não vale como número. O real aparece no painel de filtros no seu notebook.

## Revisão final (aplicada)

O revisor de acabamento deu "entregar depois das correções". As 8 foram aplicadas:

1. Poeira em meia resolução com composição suave (o centro não estoura mais).
2. Núcleo dourado-quente em vez de branco chapado; a cavidade em teal e azul ganhou anel próprio.
3. Filetes mais finos em hubs com muitas ligações, para o centro não virar novelo.
4. Fundo sem véu violeta; halo proporcional à altura da tela.
5. Raio com no máximo um disparo por nota a cada 15 s.
6. Realce da busca e da nota aberta mais discreto, apagando em 3 s quando não veio de clique.
7. Brilhos e filetes escalam com o tamanho da tela (painel lateral estreito fica legível).
8. Textos do canto (#marca e #evento) com fundo suave para ler sobre a poeira, e posição própria no celular.

Capturas em `capturas/` (relógio virtual, fases exatas): 01 galáxia, 02a–c fases do raio, 03a–c fases da explosão, 04 voo, 05 painel lateral 380 px, 06 céu 360°, 07 filtros com o som, 08 plugin (visão), 09 plugin (captura).

## Plugin do Obsidian (construído)

**Instalar:** copie `plugin/manifest.json`, `plugin/main.js` e `plugin/styles.css` para `<cofre>/.obsidian/plugins/cerebro-galactico/`, reinicie o Obsidian (ou recarregue os plugins) e ative "Cérebro Galáctico" em Configurações → Plugins da comunidade. Abre pelo ícone de órbita na faixa lateral ou pelo comando "Abrir Cérebro Galáctico". Só desktop; tudo embutido, funciona offline.

- **Um motor só:** `motor/galaxia.js` + `motor/galaxia.css` + `motor/hud.js` rodam tanto na prévia (`npm run previa`) quanto no plugin (`npm run plugin`). O CSS vive sob `.cg-raiz` e mede o painel por container query (`@container galaxia`), não pela janela, porque a visão do Obsidian pode ser uma coluna estreita.
- **Grafo:** notas de `vault.getMarkdownFiles()`, links de `metadataCache.resolvedLinks`, mesmas regiões de `scripts/extrair-grafo`.
- **Eventos ao vivo:** abrir nota (`file-open`) → pulso; salvar (`modify`) → raio, no máximo 1 por nota a cada 15 s; salvar a nota de captura (padrão `01_ENTRADA.md`) → tempestade do núcleo; nota criada → nasce já ligada aos links dela; link novo → filete acende; renomear e apagar acompanham. Passou de ~96 notas novas na sessão, a galáxia se remonta sozinha com o grafo atual.
- **Clique numa estrela** abre a nota numa aba nova (`getLeaf('tab')`); o `file-open` que vem em seguida não repete o efeito. Na aba de configurações dá para reaproveitar a última aba de nota.
- **Configurações:** som de trovão (desligado), efeitos reduzidos, atividade de fundo, esconder 99_ARQUIVO, abrir em aba nova, nota de captura. As chaves do painel de filtros e as da aba de configurações são as mesmas e ficam salvas.
- **Pausa:** a galáxia para de desenhar quando a aba fica oculta (eventos de layout + visibilidade da folha), quando a janela some e quando a visão fecha (libera a GPU).
- **Ctrl/Cmd+K** busca dentro da galáxia enquanto ela está ativa, sem disparar o atalho global do Obsidian.
- **Verificação:** typecheck (`npm run typecheck`) limpo; o plugin rodou num simulador da API do Obsidian no Chromium com o cofre real (1.114 notas): visão, salvar, captura, nota nova, link novo, renomear, apagar, clique, configurações nos dois sentidos, pausa e fechamento, sem erros no console. Capturas 08 e 09. Falta o teste no Obsidian de verdade, na GPU integrada do dono (meta: 30 fps ou mais; o painel de filtros mostra o fps medido).

## Pronto para qualquer cofre (2026-10-10)

- **Regiões configuráveis:** cada pasta de topo cai numa região (braços 1 a 4, pontas dos braços 2 e 3, halo, núcleo). O automático usa o mapa do Cérebro quando reconhece as pastas; nos outros cofres dá os braços longos às maiores pastas, manda pastas de arquivo para o halo e reparte o resto pelo braço com menos notas. Na aba de configurações, um menu por pasta (com a escolha automática visível) e "Voltar tudo ao automático".
- **Nomes de região vêm das pastas** ("60_CONHECIMENTO" vira "Conhecimento"; "Receitas · Viagens +2"). No cofre do Cérebro, nomes e tipos de nota continuam os originais.
- **Nota do núcleo** configurável (padrão `00_PAINEL.md`; sem ela, a nota com mais links). **Nota de captura** com sugestões de notas; vazio desliga.
- **Casos de borda:** cofre vazio mostra "A galáxia nasce com a primeira nota." e monta sozinho na primeira nota; pasta de topo nova remonta a galáxia; filtros só mostram regiões com notas; nomes de pasta entram escapados no HUD.
- **Publicação:** `plugin/README.md`, `plugin/LICENSE` (MIT), `plugin/versions.json`, comando renomeado para "Abrir a galáxia" (o Obsidian já prefixa o nome do plugin).
- **Verificado** no simulador da API com três cofres: o do Cérebro (igual a antes), um genérico com 11 pastas e subpastas, e um vazio. Sem erros. Capturas 10 e 11.
- **Para entrar na lista da comunidade falta:** um repositório público só do plugin (com `manifest.json` na raiz), uma release com `main.js`, `manifest.json` e `styles.css`, e o pull request em `obsidianmd/obsidian-releases`. O `fundingUrl` do manifest entra quando as contas de apoio existirem.

## Decisões do dono (2026-10-10)

1. **Clique numa estrela abre a nota numa aba nova.** Na prévia o aviso diz "Abriria numa aba nova"; no plugin, `workspace.getLeaf('tab').openFile()`.
2. **A faixa "Sinal" saiu.** Os botões da simulação e o aviso de evento desceram para o rodapé.
3. **Som de trovão opcional, desligado por padrão.** Chave "Som de trovão" nos filtros (no plugin, também na aba de configurações). O som é sintetizado na hora (Web Audio, sem arquivos, offline): estalo e ronco ao salvar, chegando junto com a descarga; estrondo grave e longo na captura; e, no trovão distante, o som chega um pouco depois do clarão, como no céu real. Silencia com a aba oculta.
