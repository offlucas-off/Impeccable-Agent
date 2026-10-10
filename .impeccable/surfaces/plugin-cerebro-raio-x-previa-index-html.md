---
version: 1
slug: "plugin-cerebro-raio-x-previa-index-html"
primary_target: "plugin-cerebro-raio-x/previa/index.html"
related_targets: []
---

# Cérebro em raio X — plugin Obsidian (prévia)

Mode: Experience. One user (the owner), Obsidian desktop, Windows 11, integrated GPU, own tab or side panel, left running all day. UI copy pt-BR. Read-only over the vault. Data: metadataCache.resolvedLinks in the plugin; `previa/grafo.json` (scripts/extrair-grafo) in the preview. Rendering chosen by owner: Three.js points + procedural cortex shell (fresnel), firing glow additive (no full-screen bloom pass). EEG history strip approved by owner.

## Direction contract

THESIS: the vault is a living radiograph of the organ. Notes are neurons inside a translucent procedural cortex, and real work fires them. It refuses Obsidian's force-directed hairball and the neon sci-fi brain.

OWN-WORLD: ground #070b16 with a #0c1630 halo vignette. The cortex is a rim-lit fresnel shell in #569cff/#7ea2ff, dark in the middle, with gyri and sulci and a central fissure, reading like film X-ray. Neurons are cool small points and synapses are rgba(86,156,255,.35) hairlines at low alpha. Color appears only on firing, by type (regra #ff8a3d, incidente #ff4d4d, decisão #ffc233, método #2ee59d, conhecimento #569cff, projeto #8f7bff, fonte/pesquisa #7ea2ff, arquivo #58627e). Manrope from the theme. The HUD is hairline text, with no panels or cards.

STORY: open in the morning and the brain breathes with sparse background activity. Opening, saving, or creating notes lights their region, and a capture in 01_ENTRADA sends a wave from the thalamus. Clicking a neuron opens its note. The EEG strip keeps the morning's history.

FIRST VIEWPORT: the brain in three-quarter view, centred, filling about 78% of the height, rotating slowly. Top left: "Cérebro" with 1.114 neurônios · 5.955 sinapses in small tabular numbers. Top right: search (Ctrl+K) and a filters toggle. Bottom: 8 faint EEG channels, one per lobe, about 84px tall. A hover label follows the cursor.

FORM: grounded candidate 7 of 7 (EEG/oscilloscope phosphor trace), fused as the per-lobe event-history channel. The world is pinned by the brief (X-ray neural simulation plus the Cerebro theme). Seed key 5a3a6a92. Signature interaction: opening a note lights its neuron, a pulse travels two synapse hops, and a spike lands on that lobe's EEG channel.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open

- Lobe volume ∝ √notes so VIDEO (401) does not swallow the frontal lobe; sub-branches become gyri clusters.
- Plugin build waits for the owner's ok after the preview.
