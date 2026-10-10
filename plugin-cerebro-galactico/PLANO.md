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
| Salvar | **Relâmpago ramificado** da estrela até até 6 notas ligadas: acende, quase apaga, reacende e morre. O clarão ilumina a poeira por dentro, como raio em nuvem |
| Captura no 01_ENTRADA | **Tempestade no núcleo:** clarão central, anel de choque no plano do disco e raios curtos nos braços conforme a onda passa |
| Nota nova | **Estrela nascendo:** 44 grãos de poeira espiralam até um ponto, a estrela acende com um clarão e os filetes entram em seguida |
| Sem eventos | Estrelas cintilam e, a cada 9–18 s, um trovão distante acende um pedaço da poeira |

- **Estrelas-hub** (40 ou mais sinapses, e o 00_PAINEL) têm raios de difração em cruz, como a estrela azul da sua foto.

## Desempenho (GPU integrada, 30 fps ou mais com 1.300 notas)

- **Poeira:** cerca de 3.800 nuvens e 500 faixas escuras, cada uma um ponto com textura de um atlas procedural 4×4 gerado no código. O tamanho é limitado a 360 px, e a nuvem some perto da câmera, o que reduz o custo quando a câmera entra na poeira.
- **Ajuste automático:** abaixo de 28 fps por 3 s, a resolução cai para 1× e a poeira para 60%. O painel avisa "qualidade ajustada".
- **Comum ao projeto anterior:** um único laço de render, pausa com a aba oculta, histórico redesenhado a 4×/s e carga de teste com `?carga=1300` ou `#carga1300`.
- **Medido aqui:** só GPU por software, então não vale como número. O real aparece no painel de filtros no seu notebook.

## Depois do ok

- **Estrutura:** plugin TypeScript em `plugin-cerebro-galactico/plugin/` (manifest.json, main.js, styles.css), com `ItemView` própria, comando, ícone na faixa lateral e aba de configurações. three@0.185.1 embutido no bundle.
- **Finalização:** revisão final, DESIGN.md e capturas com procedência.

## Decisões em aberto

1. Clicar numa estrela abre a nota numa aba nova (proposta) ou na mesma?
2. O histórico ("Sinal") continua na galáxia ou sai para a tela ficar só com o céu?
3. Som de trovão opcional, desligado por padrão e ativado por você?
