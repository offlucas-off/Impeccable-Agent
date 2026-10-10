# Cérebro em raio X: conhecimento (projeto arquivado)

> Arquivado em 2026-10-10 por ordem do dono, que trocou o conceito para galáxia. Código, prévia e capturas estão em `arquivo/plugin-cerebro-raio-x/`. Prévia publicada (privada): https://claude.ai/artifact/Wsk9MMy6u86eoamiEbeHEV (com carga de teste: `#carga1300`). Último commit antes do arquivo: `5bb4f58`.

## O que foi feito

- **Prévia do plugin Obsidian** em arquivo único e offline: o cofre como cérebro procedural em raio X. Notas viraram neurônios e `[[links]]`, sinapses, com o grafo real do espelho (1.114 notas e 5.955 sinapses).
- **Fluxo Impeccable completo:** shape, new-work (sorteio da skill com o mundo fixado pelo dono), build code-led, revisão final ("ship after fixes", com as 8 correções aplicadas).
- **Reação do dono:** "Ficou maravilhoso!", e daí veio a ideia da galáxia.

## O que vale reaproveitar (independe do visual)

1. **`scripts/extrair-grafo`:** extrator de grafo em Python, só biblioteca padrão e só leitura.
   - Resolve `[[links]]` como o Obsidian (caminho exato ou nome do arquivo, ignorando blocos de código).
   - É determinístico: duas execuções no mesmo commit geram o mesmo arquivo, byte a byte.
2. **Arquitetura leve para GPU integrada:**
   - Um objeto de pontos para as notas e um de linhas para os links, com atividade num atributo por nó (1.114 floats por quadro).
   - Brilho aditivo só no disparo, em vez de bloom em tela cheia.
   - DPR limitado a 1,5, pausa com a aba oculta e um único `requestAnimationFrame` cancelado no `visibilitychange`.
3. **Mapa de eventos do Obsidian:**
   - `workspace.on('file-open')` = abrir
   - `vault.on('modify')` = salvar (01_ENTRADA filtrado pelo caminho = captura)
   - `vault.on('create')` + `metadataCache.on('resolved')` = nota nova
   - `metadataCache.resolvedLinks` = o grafo
4. **Propagação em 2 saltos com leque limitado** (12 vizinhos no 1º salto, 4 no 2º; salvar = 16, com eco).
5. **Proporção de pastas desiguais:** área de cada sub-região proporcional à **raiz quadrada** do número de notas.
   - O VIDEO tem 401 das 459 notas do conhecimento; com a raiz, o motion-lab fica ~5× maior que GAMEDEV, e não 22×.
   - Sementes das sub-regiões espalhadas por máxima distância.
6. **EEG por área:** um canal por grupo de pastas, com os últimos 5 minutos, pico na cor do tipo e clique que leva à nota. Redesenhar a 4×/s basta, porque rola ~4 px/s.
7. **Carga de teste** `?carga=1300` ou `#carga1300` (Artifact do claude.ai só repassa a âncora `#` simples, nunca a query) para medir fps no notebook do dono.
8. **Posição estável por nota:** semente pelo caminho, então a mesma nota fica no mesmo lugar em toda sessão.

## Lições (para levar ao BRAIN VAULT)

- **Medição de fps no container não vale.** GPU por software (SwiftShader) mediu de 16 a 32 fps e depois caiu para ~1 fps sem mudança de código, quando faltou CPU. Antes de chamar uma queda de regressão, compare com o commit anterior na mesma hora.
- **Raio X aditivo:** a face achatada entre os hemisférios vira um disco brilhante no meio. Apague-a no shader com um atributo de "medial", em vez de só abrir a fissura.
- **Linhas aditivas saturam em tela pequena:** escale a opacidade das sinapses pela área da tela (√(w·h / 1440·900), entre 0,35 e 1).
- **Artifact do claude.ai:** a página não recebe `?query`. Parâmetro de prévia vai por `#âncora` simples, e o arquivo publicado não leva doctype/head/body.
