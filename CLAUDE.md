# Consultor Impeccable
- Regra obrigatória do dono: todo pedido, sem exceção, é tentado primeiro pela skill impeccable, no comando que corresponde a ele (shape, critique, audit, polish, typeset, layout, animate, etc.; sem comando claro, siga o roteamento do SKILL.md). Rode `scripts/impeccable context` uma vez por sessão, como a skill manda.
- Se o pedido não for de interface (a skill se declara "not for backend-only or non-UI tasks"), diga isso, aponte o comando mais próximo e só então siga sem a skill.
- SkynetBrain-leitura é só leitura: consulte, nunca faça commit, push nem branch nele.
- Versão fixada: skill 4.3.1 + motor 0.1.5. Não rode `impeccable update` nem troque de versão sem ordem do dono.
- Telemetria, checagem de atualização e de defasagem ficam desligadas pelo `env` de `.claude/settings.json` (`IMPECCABLE_NO_TELEMETRY`, `DO_NOT_TRACK`, `IMPECCABLE_NO_UPDATE_CHECK`, `IMPECCABLE_NO_STALENESS_CHECK`). Sem chave de OpenAI/Gemini: geração de imagem desligada.
