# Cérebro Galáctico — plano e estado da prévia

> `/impeccable` redesign · 2026-10-10. Substitui o "Cérebro em raio X" (arquivado em `arquivo/plugin-cerebro-raio-x/`, conhecimento em `conhecimento/cerebro-em-raio-x.md`).
> **Status: prévia pronta, plugin parado aguardando o ok do dono.**
> Contrato de direção: `.impeccable/surfaces/plugin-cerebro-galactico-previa-index-html.md`.

## O que muda e o que fica

- **Muda o mundo:** de órgão em raio X para galáxia espiral, com a paleta SHO das suas referências (poeira ferrugem, laranja e dourada, cavidade teal e azul, núcleo branco-quente).
- **Navegação, escolha sua:** voo pela galáxia. A roda voa na direção do ponteiro, atravessando a poeira, e o clique faz um voo curvo até a estrela, com o campo de visão abrindo no meio do caminho.
- **Fica tudo do produto:** grafo real (1.114 notas e 5.955 sinapses), eventos do Obsidian, busca, filtros, histórico, carga de teste. Fica também cada limite do pedido: só leitura, offline, GPU integrada, pausa com a aba oculta, efeitos reduzidos, `prefers-reduced-motion`.

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
| Sem eventos | Estrelas cintilam e, a cada 9–18 s, um trovão distante acende um pedaço da poeira |

- **Estrelas-hub** (40 ou mais sinapses, e o 00_PAINEL) têm raios de difração em cruz, como a estrela azul da sua foto.

## Céu 360° (fundo)

- **Via Láctea completa:** uma faixa com bojo, faixas escuras de poeira e manchas de nebulosa, pintada uma vez na GPU (2048×1024) numa esfera em volta de tudo. Gire a câmera para qualquer lado e há céu.
- **14.000 estrelas de fundo,** 60% concentradas na faixa; as mais fortes com raios de difração.
- **540 galáxias estáticas** de um atlas procedural com 16 tipos (espirais, barradas, elípticas, de perfil, irregular, lenticular, nebulosa em concha e explosão de filamentos, como nas suas referências). As 120 maiores ficam mais perto e se deslocam devagar quando você voa (paralaxe); as 420 menores, ao fundo. Nenhuma cobre a faixa da Via Láctea, como no céu real.

## Desempenho (GPU integrada, 30 fps ou mais com 1.300 notas)

- **Poeira:** cerca de 3.800 nuvens e 500 faixas escuras, cada uma um ponto com textura de um atlas procedural 4×4 gerado no código. É desenhada em **meia resolução** e composta por cima, o que corta o custo de sobreposição em cerca de 4×. O tamanho tem teto relativo à tela, e a nuvem some perto da câmera.
- **Ajuste automático:** abaixo de 28 fps por 3 s, a resolução cai para 1× e a poeira para 60%. O painel avisa "qualidade ajustada".
- **Comum ao projeto anterior:** um único laço de render, pausa com a aba oculta, histórico redesenhado a 4×/s e carga de teste com `?carga=1300` ou `#carga1300`.
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

Capturas em `capturas/` (relógio virtual, fases exatas): 01 galáxia, 02a–c fases do raio, 03a–c fases da explosão, 04 voo, 05 painel lateral 380 px, 06 céu 360°.

## Depois do ok

- **Estrutura:** plugin TypeScript em `plugin-cerebro-galactico/plugin/` (manifest.json, main.js, styles.css), com `ItemView` própria, comando, ícone na faixa lateral e aba de configurações. three@0.185.1 embutido no bundle.
- **Finalização:** DESIGN.md e capturas com procedência.
- **Notas para o plugin:** uma folha oculta do Obsidian não dispara `visibilitychange`, então a pausa precisa vir dos eventos de layout e da visibilidade da própria folha; o tamanho vem de um `ResizeObserver` no contêiner (já é assim na prévia).

## Decisões em aberto

1. Clicar numa estrela abre a nota numa aba nova (proposta) ou na mesma?
2. O histórico ("Sinal") continua na galáxia ou sai para a tela ficar só com o céu?
3. Som de trovão opcional, desligado por padrão e ativado por você?
