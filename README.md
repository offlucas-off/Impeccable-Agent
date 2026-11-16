# Pixelizer 3D Engine & Workstation

Motor **WebGL2 / Three.js em TypeScript** criado para transformar modelos e cenas 3D em **pixel art em tempo real com aparência 2D nítida e sem pixel creep**, inspirado diretamente na arquitetura multi-pass do **ProPixelizer**.

Inclui também a skill [**reverse-engineer-anything (REA)**](.agents/skills/reverse-engineer-anything/SKILL.md) instalada localmente no repositório e globalmente no ambiente.

---

## Principais Recursos

- **Pipeline WebGL2 MRT Multi-Pass (`PixelizerPipeline`)**:
  - **Pass 0 — Shadow Maps**: Sombras projetadas nítidas (`BasicShadowMap` / `PCFShadowMap`).
  - **Pass 1 — MRT Cena + Metadados (`objectShader.ts`)**: Renderiza em **4 Color Attachments** simultâneos (`Color`, `Outline`, `Meta`, `NormalDepth`), com cel-shading em ramp 1D, workflow Specular/Metallic, emissão HDR e Dual Palette LUT em tempo real.
  - **Pass 2 — Pixel Expansion (`Attempt #3`) (`expansionShader.ts`)**: Expansão por semente esparsa (*sparse seed clipping*) com vizinhança 5×5–7×7 por menor profundidade, permitindo **tamanhos de macropixel por objeto (`1×1` até `6×6`)** e **renderização híbrida 3D + Pixel Art** no mesmo buffer de profundidade.
  - **Pass 3 — Contornos por ID & Arestas (`outlineEdgeShader.ts`)**:
    - Silhuetas por `Object ID` com teste de profundidade (objetos com mesmo ID fundem sua silhueta em um único sprite).
    - Detecção de vincos internos por normal e descontinuidade de profundidade (escadas/degraus com normais paralelas).
    - **Bevel Edges** reativos à luz direcional e **Edge Highlights** (`< 0.5` escurece, `> 0.5` clareia).
  - **Pass 4 — Upscale Pixel-Art AA (`upscaleShader.ts`)**: Anti-aliasing de borda em 1 pixel estilo Cole Cecil, compensação de movimento subpixel e comparador **A/B Split** ao vivo (`Raw 3D` vs `Pixelized`).

- **Cor, LUT Dual & Ordered Dithering 4×4**:
  - Paletas embutidas: **Endesga 32**, **PICO-8**, **GameBoy DMG**, **Sweetie 16**, **NES**, **PAL / Dark Fantasy**, **CGA Mode 4**.
  - Métricas de redução: *HSV Weighted*, *RGB Euclidean* e *Value Nearest*.
  - Texturas **Dual 16×16×16 (`256×16`) LUT** geradas na hora no navegador + editor interativo de swatches, extração de paleta a partir de PNG, matriz **Dither 4×4** editável célula a célula e download da LUT em PNG.

- **Anti-Pixel-Creep & Animação Quadro-a-Quadro**:
  - Snapping automático de câmera ortográfica no espaço da câmera (`worldPixelSize`).
  - Snapping de objetos em macropixels e alinhamento hierárquico à raiz (`alignPixelGrid`, ideal para armas/armaduras acopladas a personagens).
  - Snap angular *World Space* ou *Camera Space Y* (sprite direcional 4/8/16 ângulos).
  - **Stepped Animation Controller**: quantiza *skeletal clips* `.glb/.fbx` ou animações procedurais para FPS retrô (`6`, `8`, `12`, `16`, `24 FPS`).

- **Importador 3D & Gerador de Sprite Sheets**:
  - Importação direta (inclusive *Drag & Drop*) de arquivos **`.glb`**, **`.gltf`**, **`.obj`**, **`.fbx`** e **`.stl`**, além de texturas customizadas (`Albedo`, `Normal`, `Emission`).
  - Exportação de **PNG único** e **Sprite Sheets multi-direcionais (4 / 8 / 16 direções × N frames)** com **Atlas JSON** e pré-visualização animada *flipbook*.

---

## Como Executar

```bash
npm install
npm run dev       # Servidor de desenvolvimento Vite
npm test          # Testes unitários (Vitest)
npm run typecheck # Verificação estrita TypeScript
npm run build     # Build de produção em dist/
```

---

## Estrutura do Projeto

```text
src/
├── engine/
│   ├── PixelizerPipeline.ts   # Orquestração dos 4 passes WebGL2 MRT + Snapping
│   ├── PixelizerMaterial.ts   # Material GLSL3 compatível com luzes/sombras/skinning
│   ├── palettes.ts            # Paletas, conversão HSV/RGB e gerador Dual LUT 256×16
│   ├── dither.ts              # 7 matrizes 4×4 e DataTexture RGBA
│   ├── lightingRamps.ts       # Rampas cel-shading 1D (2/3/4 bandas e smooth)
│   ├── snapping.ts            # Anti-pixel-creep de câmera, objeto e rotação
│   ├── steppedAnimation.ts    # Controle de animação stepped (flipbook FPS)
│   ├── SpriteSheetExporter.ts # Captura PNG e geração de Sprite Sheet + JSON Atlas
│   ├── types.ts               # Interfaces públicas do motor
│   └── shaders/
│       ├── common.ts          # Linear<->sRGB, RGB<->HSV, Encode Octaédrico de Normais
│       ├── objectShader.ts    # Pass 1 MRT UberShader
│       ├── expansionShader.ts # Pass 2 Pixel Expansion (Attempt #3)
│       ├── outlineEdgeShader.ts # Pass 3 ID Outlines, Edges & Bevel Lighting
│       └── upscaleShader.ts   # Pass 4 Pixel-Art AA & A/B Split Compare
└── studio/
    ├── loaders/modelLoader.ts # Importador .glb/.gltf/.obj/.fbx/.stl
    ├── presets/demoScenes.ts  # 5 cenas demonstrativas interativas
    └── ui/                    # Estação de trabalho Studio (Viewport + 4 abas)
docs/
├── architecture.md            # Detalhamento técnico da arquitetura ProPixelizer -> WebGL2
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
  SteppedAnimationController,
} from './src/engine';

const renderer = new THREE.WebGLRenderer({ antialias: false });
const pipeline = new PixelizerPipeline(renderer, {
  filterMode: 'only_pixelized',
  usePixelExpansion: true,
});

const material = new PixelizerMaterial(
  {
    pixelated: true,
    pixelSize: 3,
    objectId: 10,
    baseColor: '#d96b38',
    outlineColor: '#14101c',
    edgeBevelWeight: 0.85,
  },
  pipeline.getSharedResourcesForMaterial()
);

const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(mesh);

// Loop de renderização
pipeline.render(scene, camera);
```

---

## Documentação Complementar

- [Arquitetura do Motor & Pipeline Multi-Pass](docs/architecture.md)
- [Guia de Uso do Pixelizer Studio](docs/studio-guide.md)
- [Skill reverse-engineer-anything (REA)](docs/rea-skill.md)
