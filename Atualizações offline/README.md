# Atualizações Offline — Caminho B (Escultura 3D, Auto-UV Costurado, Curvatura 3D→2D & Remasterizador Meshy-to-Pixelizer)

Esta pasta contém o pacote autocontido e completo das atualizações **Caminho B (Ondas 1 a 4)** desenvolvidas para o **Pixelizer 3D Engine & NWL Production Studio**, preservando a árvore principal do repositório intacta.

---

## 1. Resumo das Melhorias Implementadas (Ondas 1 a 4)

### Onda 1 — Costura de Chanfros no Auto-UV, Curvatura Diedral 3D→2D e Síntese Dark-Fantasy
- **`src/engine/procedural/PixelUvUnwrapper.ts`**:
  - Adicionados `worldYMin`, `worldYMax` e `avgNormalY` em `UvIslandMeta` para iluminação zenital coerente entre ilhas UV.
  - Adicionado `sewChamfersToParentChart?: boolean` (padrão `true`) em `UnwrapOptions`, costurando tiras estreitas de chanfro (`<= 45°`, `cos >= 0.707`) à carta principal sem sobreposição (`overlapPairs === 0`).
- **`src/engine/procedural/VertexAndTexelBaker.ts`**:
  - Implementado e exportado `bake3DCurvatureToUvIslands(geo, islands, texWidth, texHeight)` que calcula a curvatura diedral assinada 3D (`[-1..+1]`) em arestas soldadas e rasteriza/dilata nos texels 2D de cada ilha UV.
  - Aprimorado `applyHeightGtaoAndWear` com gradiente zenital `world-Y` (`+10%` no topo/coroa, `-16%` na base), desgaste de borda por curvatura 3D em blocos pixel-art (`2×2` texels, `+14%..+22%`) e oclusão profunda de cavidade (`minShade = 0.48` pedra/madeira, `0.54` metal/armadura), mantendo texels estritamente em `[18..242]`.
- **`src/engine/procedural/PixelMaterialSynth.ts`**:
  - Integrado `bake3DCurvatureToUvIslands` em `bakeTaggedPartsAsset` (com salto inteligente quando o atlas já está no pool LRU `MATERIAL_TEXTURE_POOL`).
  - Evoluído `sampleMaterialRecipe` com molduras metálicas de alto contraste (`#dae0ea`/`#b3b9d1`), frisos internos carmesim/ouro (`#b4202a`), rebites, costuras duplas em couro/tecido e intemperismo arquitetônico multi-escala (`>= 5–8 px`) mantendo inclinações do normal map `<= 0.24` (`< 14°`).

### Ondas 2 e 3 — Primitivas Esculpidas, Casas Entráveis Detalhadas e Personagens/Monstros Dark-Fantasy
- **`src/engine/procedural/ProceduralGeometryKit.ts`**:
  - Adicionados e exportados `makeSegmentedBeveledBox(w, h, d, bevel, segsX?, segsY?, segsZ?, warpFn?, hexColor?, options?)` e `makePleatedTabardGeometry(topW, bottomW, height, depth, pleats?, hexColor?, options?)`.
  - Adicionado relaxamento tangencial de **Taubin $\lambda/\mu$** (`[0.45, -0.47, 0.45, -0.47]`) + reprojeção de normais SDF em `makeSdfOrganicMesh`.
  - Evoluído `makePitchedRoofGeometry` com flecha catenária na cumeeira (`zSegs = 4`), caibros aparentes nos beirais (`rafter tails`), testeiras escalonadas (`bargeboards`) e pináculos.
  - Evoluído `makePauldronShellGeometry` com lames sobrepostas e borda elevada, e `makeSwordBladeGeometry` com sulco central (`fuller groove`).
- **`src/engine/procedural/CityBuilder.ts`**:
  - Casas entráveis de 3 partes (`baseGroup`, `capaGroup`, `portaPivot`) enriquecidas com embasamento escalonado de pedra (`plinth`), pedras de canto alternadas (`quoins`), vigamento enxaimel horizontal/diagonal, janelas laterais com peitoril e vitral emissivo, chaminé de pedra com coroa e mãos-francesas (`corbels`) sob o beiral (`3.426` triângulos na Forja, `overlapPairs = 0`).
- **`src/engine/procedural/PlayerEquipmentBuilder.ts` & `src/engine/procedural/MonsterBuilder.ts`**:
  - Peitorais anatômicos com `V-taper` e quilha esternal (`makeSegmentedBeveledBox`), gorjal elevado, correias cruzadas, tabardos/sobrecasacas plissadas e escarcelas (`tassets`) rígidas nos ossos `pelvis` e `thigh_l/r` (silhueta `A-frame` estilo Dark-Fantasy Warrior sem física de tecido), cotoveleiras (`couters`), joelheiras aladas e lâminas com fuller (`4.406` triângulos no Cavaleiro Lendário).
  - `demons.boss_demon` atualizado com torso SDF `resolution = 16` suavizado por Taubin, tanga de batalha plissada, tassets laterais e ombreiras em camadas (`4.346` triângulos).

### Onda 4 — Importador Direto `.OBJ + .MTL + .ZIP` ("Meshy-to-Pixelizer Remaster")
- **`src/engine/PixelizerMaterial.ts`**:
  - `enforcePixelArtTextureSampling` aplicado universalmente a qualquer `THREE.Texture` quando `pixelated = true` (`NearestFilter`, `generateMipmaps = false`, `SRGBColorSpace` para albedo/emissão, `NoColorSpace` para normal) e `mat.vertexColors = true` garantido em `convertStandardMaterialToPixelizer`.
- **`src/studio/loaders/modelLoader.ts` & `src/studio/ui/studioApp.ts`**:
  - Extrator `.zip` puro em TypeScript (`extractZipArchiveEntries` via `DecompressionStream('deflate-raw')`, zero `node:*`) integrado a `MTLLoader` + `OBJLoader`.
  - `remasterImportedTextureForPixelizer(tex, opts)`: downsampling box-filter para `<= 512px` + suavização cardinal `3×3` (reduzindo o *Nyquist confetti* de `17,2%` para `< 6%`), elevação suave do piso de preto (`>= 28`) e síntese automática de `normalMap` Sobel com inclinação limitada a `<= 0.24`.
  - Cálculo automático de tangentes de Lengyel (`vec4`) e AO de vértice (`white_for_ao`) em malhas importadas.

---

## 2. Lista de Arquivos Modificados / Adicionados

| Arquivo | Papel na Atualização |
|---|---|
| `src/engine/procedural/PixelUvUnwrapper.ts` | Metadados `worldYMin`/`worldYMax`/`avgNormalY` e costura de chanfros `sewChamfersToParentChart` |
| `src/engine/procedural/VertexAndTexelBaker.ts` | `bake3DCurvatureToUvIslands` (curvatura diedral 3D→2D) e `applyHeightGtaoAndWear` zenital + desgaste 3D |
| `src/engine/procedural/PixelMaterialSynth.ts` | Integração do mapa de curvatura 3D (com cache pool-aware) e receitas dark-fantasy com frisos/intemperismo |
| `src/engine/procedural/ProceduralGeometryKit.ts` | `makeSegmentedBeveledBox`, `makePleatedTabardGeometry`, Taubin SDF, telhados com catenária/caibros, ombreiras e espadas |
| `src/engine/procedural/CityBuilder.ts` | Casas entráveis com embasamento de pedra, quoins, enxaimel, janelas, chaminé e corbels |
| `src/engine/procedural/PlayerEquipmentBuilder.ts` | Armaduras V-taper, gorjal, tabardo/tassets plissados A-frame, cotoveleiras, joelheiras e armas com fuller |
| `src/engine/procedural/MonsterBuilder.ts` | Boss Demon SDF `res=16` com Taubin, tangas plissadas, tassets e armaduras de orcs/goblins |
| `src/engine/procedural/CharacterBuilder.ts` | Otimização de bake/cache em personagens UAL |
| `src/engine/procedural/NpcBuilder.ts` | Otimização de bake/cache nos 9 NPCs + baú |
| `src/engine/procedural/NwlTilesetDungeon.ts` | Otimização de bake/cache nas peças de masmorra |
| `src/engine/procedural/PropBuilder.ts` | Otimização de bake/cache nos props procedurais |
| `src/engine/procedural/TilesetStructureSolver.ts` | Reuso determinístico do pool de props em estruturas WFC |
| `src/engine/PixelizerMaterial.ts` | Amostragem pixel-art universal em `THREE.Texture` e garantia de `vertexColors = true` |
| `src/studio/loaders/modelLoader.ts` | Importador `.zip`/`.obj`/`.mtl` e `remasterImportedTextureForPixelizer` |
| `src/studio/ui/studioApp.ts` | Suporte a `.zip` no seletor de arquivos e drag-and-drop do Studio |
| `tests/qualityGate.test.ts` | Testes de qualidade para as ondas 1 a 4 (primitivas, curvatura 3D, remasterizador e gate) |
| `tests/wave3.test.ts` & `vitest.config.ts` | Configuração de execução sequencial estável e timeouts para cenas completas |
| `iniciar_studio.bat` | Atalho Windows para instalar dependências (se necessário) e iniciar o Studio (`npm run start`) |
| `plano_aprimoramento_geracao_texturizacao.md` | Documento técnico completo com a dissecação REA dos modelos Meshy e arquitetura das melhorias |
| `upgrades_caminho_b.patch` | Patch `git diff` unificado para aplicação rápida com `git apply` |

---

## 3. Como Executar ou Aplicar estas Atualizações

### Opção A — Rodar diretamente a partir desta pasta (`Atualizações offline`)
```powershell
cd "Atualizações offline"
npm install
npm run start
```
*(Ou dê duplo-clique em `iniciar_studio.bat`).*

### Opção B — Aplicar o patch na raiz do repositório principal
A partir da raiz do repositório:
```powershell
git apply "Atualizações offline/upgrades_caminho_b.patch"
npm run typecheck
npm test
npm run build
```
