# Skill `reverse-engineer-anything` (REA)

A skill oficial [**reverse-engineer-anything**](https://github.com/morluto/rea) (`rea-agents`, documentação em [rea.tools](https://rea.tools/)) foi instalada em três pontos para disponibilidade imediata tanto localmente no repositório quanto globalmente para o agente:

1. **Instalação global de skill do agente**: `~/.gemini/skills/reverse-engineer-anything/`
2. **Cópias versionadas no repositório**:
   - `.agents/skills/reverse-engineer-anything/` (`SKILL.md` + 8 guias em `references/`)
   - `.claude/skills/reverse-engineer-anything/`
3. **CLI `rea-agents`**: Instalada via npm em espaço de usuário (`~/.local/bin/rea`).

## Como Utilizar

### No fluxo do agente
Ao investigar artefatos compilados, bundles Web/Electron, pacotes ZIP/APK/DMG ou capturar ambientes executáveis, consulte `.agents/skills/reverse-engineer-anything/SKILL.md` e os manuais de referência em `.agents/skills/reverse-engineer-anything/references/`.

### Via linha de comando (`rea`)
```bash
# Auditoria de exposição em bundles web construídos
rea audit-release-exposure dist

# Análise estática de aplicação JavaScript / bundle
rea analyze-javascript-application /caminho/absoluto/app --json
```

> Durante a construção do **Pixelizer 3D Engine**, a CLI `rea audit-release-exposure dist` foi executada sobre o bundle de produção Vite para validar ausência de segredos ou exposição indevida no artefato final.
