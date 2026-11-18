# Pixelizer 3D Engine & NWL Production Studio

Motor **WebGL2 / Three.js em TypeScript** criado para transformar modelos e cenas 3D em **pixel art em tempo real com aparência 2D nítida e sem pixel creep**, inspirado na arquitetura multi-pass do **ProPixelizer** e equipado com suíte completa de **modelagem e texturização procedural**, **auto-rig UAL de 65 bones** e **NWL Play Sandbox**.

Inclui também a skill [**reverse-engineer-anything (REA)**](.agents/skills/reverse-engineer-anything/SKILL.md) instalada localmente no repositório e globalmente no ambiente.

---

## Principais Recursos

- **Pipeline WebGL2 MRT Multi-Pass (`PixelizerPipeline`)**:
  - **Pass 0 — Shadow Maps**: Sombras projetadas nítidas (`BasicShadowMap` / `PCFShadowMap`).
  - **Pass 1 — MRT Cena + Metadados (`objectShader.ts`)**: Renderiza em **4 Color Attachments** simultâneos (`Color`, `Outline`, `Meta`, `NormalDepth`), com cel-shading em ramp 1D, workflow Specular/Metallic, **Rim Light cel-shaded direcional**, ancoragem de dither em **Screen Macropixel** ou **Object UV**, suporte completo a **SkinnedMesh + Morph Targets** e Dual Palette LUT em tempo real.
  - **Pass 2 — Pixel Expansion (`Attempt #3`) (`expansionShader.ts`)**: Expansão por semente esparsa (*sparse seed clipping*) com janela de busca `-6..+6` por menor profundidade, permitindo **tamanhos de macropixel por objeto de `1×1` até `10×10`**, e renderização híbrida 3D + Pixel Art no mesmo Z-Buffer.
  - **Pass 3 — Contornos por ID & Arestas (`outlineEdgeShader.ts`)**: Silhuetas por `Object ID` (com opção de **1 px** ou **2 px bold outline** para chefes/ink), vincos por normal/profundidade, **Bevel Edges** reativos à luz e **Edge Highlights**.
  - **Pass 4 — HDR Emissive Bloom + Pixel-Art AA (`upscaleShader.ts`)**: Bloom emissivo alinhado aos macropixels (*extract* por canal alpha HDR codificado + blur Gaussiano separável 9-tap em meia resolução, ativo no estilo **Hades Graphic Ink** ou manualmente na aba Pipeline), upscale estilo Cole Cecil, compensação subpixel e comparador **A/B Split** ao vivo.

- **Modelagem & Texturização Procedural Avançada (`src/engine/procedural/`)**:
  - **`PixelUvUnwrapper` & `VertexAndTexelBaker`**: Desdobramento UV planar/cíclico/esférico sem sobreposição (`Overlapping Pairs = 0`), *baking* de AO ambiental, curvatura de bordas e mapas normais em espaço tangente.
  - **`PixelMaterialSynth` & `ProceduralGeometryKit`**: Síntese de albedo, normal map e rugosidade em `pixelNearest` para **15 receitas materiais** (aço forjado, ouro, pedra musgosa, madeira, couro, lava emissiva, cristal arcano etc.) nos modos *Textured + AO*, *Procedural Flat*, *Legacy Colors* e *Flat Palette*.
  - **Construtores NWL completos**: 3 classes de heróis modulares (`Knight`, `Archer`, `Mage` em `1.79m` com 5 raridades *Normal → Lendário*), **Cidade Principal dos Portais** (`CityBuilder`), **5 NPCs + Baú Interativo**, **Bestiário + Boss Demônio**, **Dungeon Tileset `1.5m` (`Ruínas Verdes Andar 1`)** e **15+ VFX 3D pixelados** (`SpellVfxBuilder`).

- **Importador Assíncrono `.zip` / `.obj` / `.mtl` + Redução `MeshSimplifier` + Auto-Rig UAL**:
  - **Extração & Parser em Web Worker (`zipExtractor.ts` / `objZipWorker.ts`)**: Importa modelos externos `.glb`, `.gltf`, `.obj`, `.mtl`, `.fbx`, `.stl` ou `.zip` completos com texturas e materiais sem congelar a UI.
  - **Decimação Automática (`MeshSimplifier.ts`)**: Simplifica malhas high-poly (> 45k tris) preservando UVs, normais e fronteiras antes de subir para a GPU, com remasterização de texturas para *pixelNearest*.
  - **Auto-Rigging para Esqueleto Canônico 65-Bone UAL (`AutoRigBinder.ts`)**: Detecta automaticamente **T-Pose ou A-Pose** em malhas humanoides estáticas, endireita os braços para a pose canônica, calcula pesos suaves por osso (LBS), normaliza a altura (`1.79m`) e aplica todas as **76 animações UAL**, permitindo exportar em **`.glb` articulado**.

- **NWL Play Sandbox com Combat Juice (`NwlPlaySandbox.ts`)**:
  - Arena jogável ao vivo com movimentação isométrica (`WASD`), ataque básico (`Espaço`), esquiva com *i-frames* (`Shift`), 4 magias por classe (`1–4`) com barras/timers de *cooldown*, inimigos com telegrafia e IA, portal Cidade ↔ Dungeon e **Combat Juice** (hit-stop de impacto, *camera shake* amortecido sem derivar a câmera, e números flutuantes de dano/crítico/cura).

---

## Como Executar

```bash
npm install
npm run dev       # Servidor de desenvolvimento Vite
npm test          # Suíte de testes unitários & Quality Gates (Vitest)
npm run typecheck # Verificação estrita TypeScript
npm run build     # Build de produção otimizado (chunks separados em dist/)
```

**Atalhos Windows (execução com duplo clique):**
- `iniciar_studio.bat` — instala dependências na primeira execução, inicia o servidor Vite e abre o navegador.
- `abrir_studio_local.bat` — atalho UTF-8 em português que inicia o estúdio via `iniciar_studio.bat`.

---

## Estrutura do Projeto

```text
public/
└── models/                    # Personagens .glb articulados (Knight, RobotExpressive, Soldier, Fox) + ATTRIBUTION.md
src/
├── engine/
│   ├── PixelizerPipeline.ts   # Orquestração MRT WebGL2 + HDR Bloom + Presets Visuais (NWL SNES / Hades Ink)
│   ├── PixelizerMaterial.ts   # Material GLSL3 (luzes, sombras, skinning, morph targets, rim, dither, bloom alpha)
│   ├── Voxelizer.ts           # Voxelizador 3D watertight + modo articulado UAL + exportadores .GLB / .OBJ / .VOX
│   ├── rigging/               # UalRigSpec (65 bones), AnimationLibraryBank, AutoRigBinder (T/A-Pose), UalRetargeter, RiggedExporter
│   ├── procedural/            # PixelUvUnwrapper, PixelMaterialSynth, MeshSimplifier, City/Dungeon/Equip/Monster/VFX Builders
│   └── shaders/               # common, objectShader, expansionShader, outlineEdgeShader, upscaleShader (Bloom + AA)
├── sandbox/
│   └── NwlPlaySandbox.ts      # Sandbox jogável Cidade + Dungeon + IA + Loot + Combat Juice (hit-stop/shake/floating text)
└── studio/
    ├── loaders/               # zipExtractor, objZipWorker, modelLoader (.glb/.gltf/.obj/.mtl/.fbx/.stl/.zip + MeshSimplifier)
    ├── presets/demoScenes.ts  # Cenas demonstrativas e presets NWL
    └── ui/                    # Estação de trabalho modular (Pipeline, Palette, Object, Generate, Anim Viewer, Export)
docs/
├── architecture.md            # Detalhamento técnico da arquitetura ProPixelizer -> WebGL2 + Voxelizer
├── studio-guide.md            # Guia prático do Pixelizer Studio
└── rea-skill.md               # Uso e localização da skill reverse-engineer-anything (REA)
```

---

## Exemplo de Uso Programático (SDK)

```ts
import * as THREE from 'three';
import {
  PixelizerMaterial,
  PixelizerPipeline,
  voxelizeObject3D,
  exportVoxelGridToVox,
} from './src/engine';

const renderer = new THREE.WebGLRenderer({ antialias: false });
const pipeline = new PixelizerPipeline(renderer, {
  filterMode: 'only_pixelized',
  usePixelExpansion: true,
  bloomEnabled: true,
});

const material = new PixelizerMaterial(
  {
    pixelated: true,
    pixelSize: 3, // suporta 1..10 (1x1, 3x3, 7x7, etc.)
    objectId: 10,
    baseColor: '#d96b38',
    outlineColor: '#14101c',
    edgeBevelWeight: 0.85,
  },
  pipeline.getSharedResourcesForMaterial()
);

const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(mesh);

// Render 2D pixelizado em tempo real
pipeline.render(scene, camera);

// Conversão opcional para malha 3D voxelizada (.glb / .obj / .vox)
const grid = voxelizeObject3D(mesh, { resolution: 24, dither3d: true });
const voxBytes = exportVoxelGridToVox(grid);
```

---

## Documentação Complementar

- [Arquitetura do Motor & Pipeline Multi-Pass](docs/architecture.md)
- [Guia de Uso do Pixelizer Studio](docs/studio-guide.md)
- [Atribuição dos Modelos 3D (CC0 / MIT)](public/models/ATTRIBUTION.md)
- [Skill reverse-engineer-anything (REA)](docs/rea-skill.md)
