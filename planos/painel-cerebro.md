# Painel de saúde do Cérebro — plano de interface

> `/impeccable shape` · 2026-10-10 · sem código. Fonte: `SkynetBrain-leitura/90_SISTEMA/metricas.md` (gerado em 2026-10-09) e `metricas-historico.csv`. Produto em `PRODUCT.md`.
> Status: **aguardando confirmação do dono** (uma rodada de correção, depois vira build).

## 1. Para quem e em que momento

- **Um usuário só: o dono.** No PC, na revisão semanal (segunda, 09h), quando o `cerebro` traz a lista de aprovação em lote.
- **Estado de espírito:** vai decidir. Quer saber em segundos se algo pegou fogo, depois o que aprovar e o que está atrasado. Não quer ler Markdown cru.
- **Modo Impeccable:** Operate. O painel serve a tarefa, e a expressão nunca esconde estado nem número.
- **Só leitura.** O painel mostra e aponta. Aprovar, recusar e fechar continuam com o `cerebro`/BRAIN VAULT, que é o único escritor (RG-GLOBAL-008).

## 2. O que salta aos olhos em 5 segundos

Ordem tirada do protocolo de revisão do próprio cofre (BRAIN-VAULT.md: "feche primeiro as ATRASADAS e as alta reincidente"):

1. **Veredito numa frase**, no topo, com o número que manda. Com os dados de hoje:
   `Nenhuma atrasada · 5 alta reincidente vencem até 15/10 (3 em 12/10) · 9 propostas esperam você`
2. **Três contadores no estilo do console:**
   - ⛔ **5** fechar primeiro (atrasadas + alta reincidente)
   - ⚠ **9** aguardando aprovação
   - ℹ **31** aprovadas em aplicação

   Cada contador traz ícone e texto, não só cor.
3. **A escada está atrasada?** São **6 regras reincidindo abaixo do n3** (RG-CORTES-GAMER-022, RG-CORTES-GAMER-030, RG-GLOBAL-006, RG-GLOBAL-007, RG-GLOBAL-034, RG-NWL-047). Esse é o sinal que só o Cérebro tem: o erro voltou e a trava ainda é só texto.
4. **Onde sangra:** incidentes abertos por projeto. Hoje são **19: NWL 11 · CORTES-GAMER 4 · GLOBAL 2 · TESTEDISC 1 · VIDEO 1**.

O resto (eficácia, taxa de recomendações seguidas, custo em tokens) fica abaixo da dobra.

## 3. Direção escolhida: Console da Unity

**Tese:** o painel é o console que você já lê todo dia no NWL, aplicado à saúde do Cérebro. Ele recusa o arranjo padrão de painel (cartões de KPI soltos e gráfico de pizza).

Como a linguagem do console vira produto:

| Console da Unity | No painel |
|---|---|
| Contadores de erro/aviso/info no canto da barra | Os três contadores do item 2, que também filtram a lista |
| Collapse com badge `9×` à direita da linha | Cada regra numa linha, com o número de reincidências como badge e o degrau `n1`–`n4` ao lado |
| Ícone de severidade na margem esquerda | ⛔ vencida ou alta reincidente · ⚠ aguardando o dono · ℹ em aplicação dentro do prazo |
| Campo de busca e filtro | Chips por projeto (GLOBAL, NWL, CORTES-GAMER, MOZI, VIDEO, TESTEDISC) e busca por ID ou texto |
| Painel de detalhe embaixo, com o stack trace | Linha selecionada: proposta completa, `aplicar_por`, `prazo`, degrau atual → próximo, link para a nota |
| Tema escuro do editor | Escuro por padrão, para combinar com a Unity, com variante clara pelo `prefers-color-scheme` |

**Consequência para o build:** uma família de fonte do sistema e números tabulares; cor só para estado (vermelho, âmbar, neutro); densidade de console, com 30+ linhas visíveis sem rolar em 1080p; nenhuma animação decorativa.

**Risco declarado:** é familiar e pode ler como ferramenta de dev. A defesa é o veredito no topo, escrito em frase, e a ordem de revisão. O console organiza a tela, mas quem abre a leitura é o veredito.

## 4. Hierarquia e topologia (desktop, ≥ 1280 px)

```
┌──────────────────────────────────────────────────────────────────────┐
│ CÉREBRO · saúde        gerado 09/10 (há 1 dia)      ⛔5  ⚠9  ℹ31   │  barra
│ Nenhuma atrasada · 5 alta reincidente vencem até 15/10 · 9 esperam você│  veredito
├──────────────────────────────────────────────┬───────────────────────┤
│ [Todos] [GLOBAL] [NWL] [CORTES] … [buscar__] │ INCIDENTES ABERTOS 19 │
│ ── FECHAR PRIMEIRO (5) ───────────────────── │ NWL ███████████ 11    │
│ ⛔ RG-GLOBAL-006  n1  MAESTRO   12/10   2×   │ CORTES ████ 4         │
│ ⛔ RG-GLOBAL-007  n1  MAESTRO   12/10   1×   │ GLOBAL ██ 2           │
│ …                                            │ TESTEDISC █ · VIDEO █ │
│ ── AGUARDANDO SUA APROVAÇÃO (9) ──────────── │ 7 dias: 128 (55 reinc)│
│ ⚠ RG-GLOBAL-018  n1→n3  rec 1               │───────────────────────│
│ …                                            │ ESCADA                │
│ ── ESCADA ATRASADA (6) ───────────────────── │ n4 ●●●●●●●●  …        │
│ ⚠ RG-CORTES-GAMER-022  n1  2×               │ n3 ●●●●●●●●●●●  …     │
│ …                                            │ n2 ●●                 │
│ ── EM APLICAÇÃO (26) [recolhido] ─────────── │ n1 ●●●●●●●  ← 6 reinc │
├──────────────────────────────────────────────┴───────────────────────┤
│ DETALHE · RG-GLOBAL-006 · n1 → n2 · aplicar_por MAESTRO · prazo 12/10 │
│ incluir varredura de GUID/caminho no checkup antes de remoções  ↗nota │
├──────────────────────────────────────────────────────────────────────┤
│ ▸ Eficácia · ▸ Recomendações (87% seguidas, 7 aguardando) · ▸ Tokens  │  info
└──────────────────────────────────────────────────────────────────────┘
```

- **Lista principal (coluna larga):** grupos fixos na ordem da revisão. Os grupos vazios encolhem para uma linha ("Atrasadas · nenhuma"), mas continuam visíveis, porque "zero atrasadas" também é informação.
- **Coluna lateral:** incidentes abertos por projeto, em barras horizontais com número (clicar filtra a lista), e o **mapa da escada**: as regras com reincidência em pontos por degrau. Ponto cheio = reincidiu. A linha do n1/n2 com ponto cheio é o alerta.
- **Detalhe:** fica embaixo e fixo, como no console. Linha selecionada por clique ou teclado (↑/↓). Sem modal.
- **Info, abaixo da dobra:** eficácia (mediana de dias até a regra, % de altas em n≥3, blindagens por semana), recomendações (taxa e recusas listadas) e a tabela de tokens por projeto. Tudo recolhido por padrão.
- **Larguras menores (< 1100 px):** a coluna lateral desce para baixo do veredito como faixa horizontal, e o detalhe vira bloco expandido sob a linha. Celular não é alvo, mas a página não pode quebrar.

## 5. Estados

| Estado | Quando | O que aparece |
|---|---|---|
| **Alerta** | atrasada > 0, **ou** alta reincidente com prazo ≤ 2 dias, **ou** reincidência abaixo de n3 | Veredito com ⛔ e o número; o grupo "Fechar primeiro" vem aberto no topo; a barra ganha a cor de erro só no contador, nunca a página inteira |
| **Atenção** | sem vencidos, mas fila de aprovação > 0 | Veredito neutro com ⚠: "9 propostas esperam você"; o grupo de aprovação abre primeiro |
| **Tudo em dia** | 0 atrasadas, 0 alta reincidente, fila vazia, 0 reincidência abaixo de n3 | Console limpo, contadores `0 · 0 · N`, veredito "Nada para segunda. Escada em dia." e a última data de reincidência. É o estado-prêmio: silencioso, mas inequívoco |
| **Vazio / primeira vez** | seção sem itens (ex.: "Candidatas a arquivo: nenhuma") ou histórico com menos de 2 dias | A linha da seção diz o que entraria ali e por quê ("regra sem reincidência há ≥ 60 dias, severidade não alta"); tendência some em vez de desenhar um gráfico de 1 ponto |
| **Desatualizado** | `gerado em` com mais de 2 dias | Faixa âmbar sob a barra: "Dados de 09/10, o script não rodou desde então". O veredito continua, marcado como antigo |
| **Erro de leitura** | o script não conseguiu ler uma seção | A seção mostra o erro em texto ("Seção Reincidências não lida: formato mudou") em vez de sumir. Painel parcial nunca se passa por painel limpo |

**Faixas reais para dimensionar (09/10):** fila de 0–9 (pico histórico de 39 em 04/10); aprovadas de 0–31+; reincidentes 37 regras, de 1× a 9×; incidentes abertos 19, com 7 dias chegando a 129; IDs de até 21 caracteres (`RG-CORTES-GAMER-030`); propostas com 150+ caracteres.

## 6. Escopo e limites

- **Entrega:** um `.html` estático gerado pelo `metricas.py` ao lado do `metricas.md`, a cada execução. CSS inline, sem rede, abre do disco. JS só para filtro e seleção, e a página tem que funcionar sem ele (grupos com `<details>`).
- **Não muda:** o `metricas.md` continua igual (os agentes leem ele) e a cadeia de escrita não muda.
- **Anti-objetivos:** botões de aprovar ou recusar; gráfico de pizza; cartões de KPI soltos sem ordem; cor como única pista; animação de entrada; qualquer número que não venha do cofre.

## 7. Decisões em aberto (o build não deve inventar)

1. **Link para a nota:** IDs abrem no Obsidian (`obsidian://open?vault=<nome>&file=<ID>`)? Precisa do nome do cofre.
2. **Texto completo:** o `metricas.md` corta as propostas em 150 caracteres. O detalhe deve ler a nota original (o script tem acesso ao cofre)?
3. **Reincidência depois da trava:** `RG-GLOBAL-011` e `RG-NWL-017` têm 9× já em n4. O md não diz se reincidiram **depois** de chegar ao n4. Se sim, é "trava furada" e merece ⛔. O script precisa da data da última reincidência e da data em que o degrau subiu.
4. **Idade dos incidentes abertos:** não está no md. Com ela, "aberto há 9 dias" pesa mais que "aberto ontem" (o script pode ler o campo `data` das notas INC).
5. **Tendência:** usar o CSV para setas de "desde a última revisão" (ex.: fila 4 → 9)? Com 6 dias de histórico, só vale como seta, não como gráfico.

## Próximo passo

Confirmada (ou corrigida uma vez), a direção segue para o build, com contrato de direção no surface brief, código no `metricas.py` do cofre (pelo BRAIN VAULT, já que aqui é só leitura) e revisão final da Impeccable.
