# Memorando de Melhorias — Pixelizer 3D Engine

> **Pasta oficial local:** `D:\01 - Pixelizer Engine`
> **Repositório GitHub:** `https://github.com/offlucas-off/Pixelizer-3d-Motor.git` (branch `main`)
> **Objetivo deste documento:** Registrar todas as evoluções arquiteturais, correções e padrões vigentes do motor para que qualquer agente de IA ou desenvolvedor saiba exatamente o que mudou, quais APIs usar e quais invariantes preservar.
> **Regra de manutenção:** Toda nova rodada de melhoria ou correção relevante deve adicionar uma seção datada no topo da linha do tempo abaixo antes do `git push`.

---

## Estado Atual do Motor (Resumo Executivo)

- **Modo de Renderização Padrão:** `hifi_stylized` (*Hi-Fi Stylized 3D*, sem pixelização/downsample/quantização destrutiva, resolução nativa `1x`, amostragem trilinear mipmapped `enforceHiFiTextureSampling`, IBL procedural de 3 bandas céu/horizonte/chão e Bloom seletivo de alto limiar `0.88` para emissivos). Os modos pixelados legados (`stylized_crisp`, `nwl_snes`, `hades_lab`) continuam disponíveis por seletor no Studio.
- **Pipeline Unity 2.5D / Unity 6 URP:** Suporte oficial à projeção dimétrica 2:1 (`26.565°` em X / `45°` em Y), *tight sprite packing* com metadados `_atlas.json`, exportação `.GLB` com todos os mapas PBR (`albedo`, `normal`, `metallicRoughness`, `occlusion`, `emissive`) + clipes condicionados sem clipping, e gerador do script Editor C# `PixelizerUnityImporter.cs`.
- **Qualidade de Modelos & Texturas:** Geometrias orgânicas de média/alta densidade (`elder_wyvern` ~16k tris, `boss_demon` ~21.9k tris, heróis ~6.9k–9k tris, árvores com *Alpha Leaf Cards* estilo `Jabami Tree`), atlas `512–1024px` com *edge dilation* `>= 4px` e shading estilizado calibrado por engenharia reversa (`Reze`, `Blu`, `Jabami Tree`, `free_base_mesh`, `Black Dragon`).

---

## Linha do Tempo das Melhorias (Mais Recente → Mais Antiga)

### 1. Rodada 3 — Ponte Unity 6 URP, Animações de Asa/Cauda, IBL/Bloom e Folhagem (`f8d5850`)
- **Ponte Automática Unity (`src/engine/unity/PixelizerUnityImporterTemplate.ts`, `BatchExporter.ts`, `exportPanel.ts`):**
  - Criado o template C# `Assets/Editor/PixelizerUnityImporter.cs` (`Tools/Pixelizer Engine/Import Sprite Atlas JSON` e `Configure Imported GLBs (URP)`), embutido por padrão nos `.ZIP` do `BatchExporter` e disponível para download direto no painel de exportação.
  - Converte coordenadas top-left do `_atlas.json` para bottom-left da Unity, preserva pivô nos pés, cria `AnimationClip`s a 8 FPS e configura materiais `"Universal Render Pipeline/Lit"` com `_AlphaClip`/`_Cutoff` (`DoubleSide`) para folhas.
  - `RiggedExporter.ts`: auto-detecta equipamentos (`detectSubjectEquipment`) e aplica `conditionClipWithEquipment` nas animações exportadas no `.GLB` + forward de `alphaTest`.
- **Animações Reais de Asa & Cauda + Polimento de Monstros (`QuadrupedRigSpec.ts`, `CreatureBuilder.ts`, `MonsterBuilder.ts`):**
  - `buildQuadrupedAnimClips` gera keyframes de batida de asa, planar, inclinação e chicote/balanço senoidal de cauda em todos os 6 clipes quando `wing_*` e `tail_*` estão presentes (`elder_wyvern`).
  - `demons.boss_demon` e `monster.gargoyle` ganharam sub-ossos/pivôs de asa articulados (`Monster_Wing_l`/`r`) com clipes próprios (`Idle_Winged`, `Walk_Winged`, `Flight_Flap`, `Attack_WingFlare`).
  - Polimento de silhueta em `boss.minotaur_warlord`, `boss.dread_knight` e `monster.crystal_golem`.
- **IBL Procedural & Bloom Seletivo (`PixelizerPipeline.ts`, `objectShader.ts`, `upscaleShader.ts`):**
  - `objectShader.ts` adiciona IBL procedural em 3 bandas (céu frio, horizonte, rebote quente do chão) ativo quando `uPixelated < 0.5`, além de compressão suave de highlights para metais.
  - `hifi_stylized` ativa Bloom seletivo (`bloomEnabled: true`, `bloomThreshold: 0.88`, `bloomIntensity: 0.28`) afetando apenas emissivos intensos.
- **Árvores com Alpha Leaf Cards (`PropBuilder.ts`, `CityBuilder.ts`, `NwlTilesetDungeon.ts`):**
  - Substituição de copas sólidas por 20 *leaf cards* cruzados em alpha cutout (`generateLeafClusterTexture`, `alphaClipThreshold: 0.5`, `THREE.DoubleSide`, variação de tons sol/sombra) nas árvores, `Starter City` e `Green Ruins`.
- **Testes:** `tests/round3_unity_hifi.test.ts` (5/5).

### 2. Rodada 2 — Unificação PBR no `.GLB`, Rework do `boss_demon` e Polimento VFX (`194f7be`)
- **Propagação Completa de Mapas PBR (`types.ts`, `PixelizerMaterial.ts`, `PixelMaterialSynth.ts` e builders):**
  - `PixelizerMaterialOptions` passou a aceitar `roughnessMap`, `aoMap` e `metalnessMap`; criado o helper compartilhado `bakedToMaterialOptions` em `PixelMaterialSynth.ts` substituindo duplicatas locais em `CharacterBuilder`, `PlayerEquipmentBuilder`, `NpcBuilder` e `MonsterBuilder`.
- **Rework Anatômico de `demons.boss_demon` (`MonsterBuilder.ts`):**
  - Corrigida a proporção cabeçuda/"chibi": crânio proporcional com presas/crista/chifres curvados, tronco muscular largo via SDF/lofting, ombreiras alinhadas, pernas digitígradas com garras, cauda com ferrão e 2 asas demoníacas com membrana recortada (**~21.8k–21.9k tris**, altura `~3.16m`).
- **VFX Color-over-Life & Shader GPU (`VfxRecipe.ts`, `VfxParticlePool.ts`, `SpellVfxBuilder.ts`, `objectShader.ts`):**
  - Suporte a `colorHex -> midColor -> endColor` e `startScale -> endScale` por partícula.
  - Adicionado `#ifdef USE_INSTANCING_COLOR` em `OBJECT_VERTEX_SHADER` (`objectShader.ts`) corrigindo partículas que antes renderizavam brancas na GPU.
  - `meteoro`, `seta_fogo`, `barreira`, `egide_refletora` e `impact_spark` enriquecidos dentro do orçamento de triângulos de projétil (`<= 200` tris).
- **Testes:** `tests/round2_polish.test.ts` (3/3).

### 3. Melhorias Estruturais em 5 Frentes (`6726257`)
- **Condicionamento ao Vivo & Auto-Framing (`steppedAnimation.ts`, `stageManager.ts`, `studioApp.ts`, `generatorPanel.ts`):**
  - `conditionClipWithEquipment` aplicado automaticamente no Studio ao carregar/trocar equipamentos (eliminando clipping do cajado em `Spell_Simple_Shoot`).
  - `computeAutoFrameParams` ajusta `orthoHeight` via `Box3` ao carregar qualquer modelo.
- **Paletas Ricas por Classe (`EquipmentCatalog.ts`, `PlayerEquipmentBuilder.ts`):**
  - `CLASS_NORMAL_PALETTES` diferencia `rarity: 'normal'` (Cavaleiro aço grafite `#5d697a`, Mago índigo `#39487a`, Arqueiro musgo/couro `#3f5e45` / `#6e4b32`).
- **Exportador `.GLB` PBR (`RiggedExporter.ts`):**
  - Empacota `roughnessMap` + `metalnessMap` em `metallicRoughnessTexture` sem warnings de `DataTexture` e duplica `uv -> uv1` para `occlusionTexture`.
- **VFX no Studio & Sprite Sheet (`stageManager.ts`, `SpriteSheetExporter.ts`):**
  - `createStudioSpellVfxRunner` executa `VfxTimelinePlayer`, `InstancedVfxParticlePool`, `PixelTrailRenderer` e `VfxLightPool` no preview do Studio com suporte a captura quadro a quadro.
- **Cabelos *Lofted* & Aceleração de Bake (`CharacterBuilder.ts`, `NpcBuilder.ts`, `PixelMaterialSynth.ts`, `CityBuilder.ts`, `NwlTilesetDungeon.ts`):**
  - `buildStylizedHairParts` com mechas curvas por arquétipo e prioridade UV em `head_front` (`islandScaleBias >= 2.4`).
  - Cache LRU `BAKED_ASSET_POOL` + `aoRays: 4` / `maxAtlasSize: 512` em arquitetura, reduzindo o bake da `Starter City` de `~16s` para `~6.2s` (cold) e `~304ms` (warm).
- **Testes:** `tests/five_improvements.test.ts` (9/9).

### 4. Reformulação Hi-Fi Stylized 3D & Engenharia Reversa (`31d0445`, `cf525e8`)
- **Modo `hifi_stylized` Padrão (`PixelizerPipeline.ts`, `PixelizerMaterial.ts`, `PresetRegistry.ts`, `pipelinePanel.ts`, `studioApp.ts`):**
  - Desativa pixelização destrutiva, *pixel expansion*, snap de câmera e quantização por padrão para visualização 3D limpa.
- **Modelagem Orgânica & Retexturização (`ProceduralGeometryKit.ts`, `CreatureBuilder.ts`, `PixelMaterialSynth.ts`):**
  - Adicionados `subdivideGeometryLoop`, `makeSculptedLimbGeometry`, `makeAnatomicalTorsoGeometry` e `makeSplineLoftGeometry` (`14×24`), elevando `elder_wyvern` para `~16.1k tris` com colares orgânicos na raiz das asas/pescoço.
  - Síntese de texturas calibrada com métricas de `LAB-RESEARCH` (`Reze`, `Blu`, `Jabami Tree`, `free_base_mesh`, `Black Dragon`): sombras quentes em pele (`shadeWarmSkinRgb`), dobras pintadas (*Painted Folds*), linework `~1px`, *Painterly Bark* vertical `~13:1`, `dilateAtlasByEdt` (`>= 4px`) e normal maps OpenGL calibrados por receita (`2–5°` em pele/tecido vs `9–33°` em `dragon_scales`).
- **Testes:** `tests/hifi_reformulation.test.ts` (12/12).

### 5. Correções de Equipamentos, Pipeline VFX & Projeção Unity 2.5D (`edafe9b`, `0a01ed7`, `84653e4`)
- **Helmet & Shield (`PlayerEquipmentBuilder.ts`, `UalRigSpec.ts`, `EquipmentCatalog.ts`, `AnimationLibraryBank.ts`):**
  - Corrigido escudo invertido 180° em `lowerarm_l` (`rotateZ(π)` + `rotateY(-π/2)`).
  - Corrigido capacete flutuando (montagem direta no osso `Head` em vez do socket `head` com offset).
  - Criados sockets orientados (`UalSocketSpec.rotation`), `WEAPON_GRIP_PIVOTS` (`GRIP_1H/2H/POLEARM/STAFF`) e solver *capsule-clearance* (`conditionClipForEquipment`, folga `>= 0.03m`).
- **Arquitetura VFX (`src/engine/vfx/*`, `SpellVfxBuilder.ts`, `NwlPlaySandbox.ts`):**
  - Criados `VfxRecipe`, `VfxTimelinePlayer`, `InstancedVfxParticlePool`, `PixelTrailRenderer` e `VfxLightPool` (pool fixo de 6 `PointLight`s evitando recompilação de `NUM_POINT_LIGHTS`).
- **Projeção Dimétrica 2:1 & Atlas Unity (`snapping.ts`, `SpriteSheetExporter.ts`, `exportPanel.ts`, `scripts/export_nwl_headless.mjs`):**
  - Projeção dimétrica 2:1 (`Math.atan(0.5)` ≈ `26.565°` em X, `45°` em Y), `packTightSpriteFrames` com pivô nos pés + `_atlas.json`, e `applyPostOutline1px`.
- **Testes:** `tests/unity_25d_upgrade.test.ts` (9/9) e `tests/engine_4phase_upgrade.test.ts` (12/12).

---

## Diretrizes para Agentes & Desenvolvedores Futuros
1. **Não duplicar `bakedToMaterialOptions`:** Use sempre a exportação de `src/engine/procedural/PixelMaterialSynth.ts` para preservar os 6 mapas PBR (`albedo`, `normal`, `roughness`, `ao`, `metalness`, `emission`).
2. **Não criar `THREE.PointLight` dinâmico por cast:** Use `VfxLightPool` (`src/engine/vfx/VfxLightPool.ts`) para manter `NUM_POINT_LIGHTS` constante e evitar recompilação de shader em WebGL2.
3. **Orçamento de Bake em Criaturas/Cidades:** Mantenha `maxAtlasSize: 512` e `aoRays: 4` em módulos arquitetônicos repetidos e criaturas multi-osso (> 10k tris) para evitar regressões de tempo de geração.
4. **Higiene Git:** A pasta local `LAB-RESEARCH/` contém ativos binários de estudo de terceiros e **não** deve ser comitada no GitHub.
