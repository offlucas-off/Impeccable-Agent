# Pixelizer 3D Engine & Workstation

Motor **WebGL2 / Three.js em TypeScript** criado para transformar modelos e cenas 3D em **pixel art em tempo real com aparência 2D nítida e sem pixel creep**, inspirado diretamente na arquitetura multi-pass do **ProPixelizer**.

Inclui também a skill [**reverse-engineer-anything (REA)**](.agents/skills/reverse-engineer-anything/SKILL.md) instalada localmente no repositório e globalmente no ambiente.

---

## Principais Recursos

- **Pipeline WebGL2 MRT Multi-Pass (`PixelizerPipeline`)**:
  - **Pass 0 — Shadow Maps**: Sombras projetadas nítidas (`BasicShadowMap` / `PCFShadowMap`).
  - **Pass 1 — MRT Cena + Metadados (`objectShader.ts`)**: Renderiza em **4 Color Attachments** simultâneos (`Color`, `Outline`, `Meta`, `NormalDepth`), com cel-shading em ramp 1D, workflow Specular/Metallic, emissão HDR, suporte completo a **SkinnedMesh + Morph Targets** e Dual Palette LUT em tempo real.
  - **Pass 2 — Pixel Expansion (`Attempt #3`) (`expansionShader.ts`)**: Expansão por semente esparsa (*sparse seed clipping*) com janela de busca `-6..+6` por menor profundidade, permitindo **tamanhos de macropixel por objeto de `1×1` até `10×10`** (incluindo atalhos rápidos `1×1`, `2×2`, `3×3`, `5×5`, `7×7`, `8×8`) e renderização híbrida 3D + Pixel Art no mesmo Z-Buffer.
  - **Modos de Conversão**: **Hybrid** (híbrido por objeto), **Full Scene** (buffer retrô global), **Cel Hard** (cel-shading plano `1×1` sem dithering) e **Voxel 3D** (gerador de blocos geométricos voxelizados ao vivo).
  - **Pass 3 — Contornos por ID & Arestas (`outlineEdgeShader.ts`)**:
    - Silhuetas por `Object ID` com teste de profundidade (personagens multi-malha podem unificar ou separar seus IDs com um clique).
    - Detecção de vincos internos por normal e descontinuidade de profundidade (escadas/degraus).
    - **Bevel Edges** reativos à luz direcional e **Edge Highlights** (`< 0.5` escurece, `> 0.5` clareia).
  - **Pass 4 — Upscale Pixel-Art AA (`upscaleShader.ts`)**: Anti-aliasing de borda em 1 pixel estilo Cole Cecil, compensação de movimento subpixel e comparador **A/B Split** ao vivo (`Raw 3D` vs `Pixelized`).

- **17 Paletas, 6 Métricas & 11 Matrizes Dither 4×4 / 8×8**:
  - **Paletas embutidas**: **Endesga 32**, **Resurrect 64**, **DawnBringer 32**, **Zughy 32**, **PICO-8**, **Sweetie 16**, **DawnBringer 16**, **SNES Dark Fantasy**, **NES 2C02**, **Commodore 64 (Pepto)**, **Cyberpunk Neon**, **Posterize RGB-64**, **GameBoy DMG**, **GameBoy Pocket**, **Virtual Boy**, **1-Bit Obra Dinn / Ink** e **CGA Mode 4**.
  - **Métricas de conversão**: *HSV Weighted*, *Oklab Perceptual*, *Hue Priority*, *RGB Redmean Euclidean*, *Luminance / Value Ramp* e *Posterize Bit-Depth Quant*.
  - **Matrizes de Dither**: *Bayer 4×4*, *Bayer 8×8*, *Blue Noise 8×8 (Void & Cluster)*, *Bayer 2×2*, *Checkerboard*, *Crosshatch Manga*, *Halftone Dots*, *Diagonal Hatch*, *Horizontal Scanlines*, *Clustered Halftone* e *Flat*.
  - Texturas **Dual 16×16×16 (`256×16`) LUT** geradas *on-demand* + editor interativo de swatches, extração de paleta a partir de PNG, matriz editável `4×4`/`8×8` e download da LUT em PNG.

- **Gerador & Exportador de Malha 3D Voxelizada (`Voxelizer`)**:
  - Converte objetos, cenas e personagens articulados (inclusive na pose animada/morph atual) em malhas de blocos voxelizados 3D *watertight* com *culling* de faces internas, quantização pela paleta ativa e dithering 3D ordenado opcional.
  - Preview interativo em tempo real no viewport (`Voxel 3D`) e exportação direta para **`.glb`** (glTF binário PBR), **`.obj`** (Wavefront com cor por vértice) e **`.vox`** (MagicaVoxel v150).

- **Personagens 3D Articulados + Anti-Pixel-Creep**:
  - 4 personagens `.glb` articulados incluídos em `public/models/` (**RPG Knight** CC0 · 76 clipes, **Expressive Bot** MIT · 14 clipes + morph targets, **Tactical Soldier** MIT · 4 clipes e **Wild Fox** CC0 · 3 clipes), além de importação *Drag & Drop* de `.glb`, `.gltf`, `.obj`, `.fbx` e `.stl`.
  - Snapping de câmera/objeto anti-*pixel-creep*, **Stepped Animation Controller** (6–24 FPS) e exportador de **PNG único** e **Sprite Sheets multi-direcionais (4 / 8 / 16 direções)** + Atlas JSON.

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
public/
└── models/                    # Personagens .glb articulados (Knight, RobotExpressive, Soldier, Fox) + ATTRIBUTION.md
src/
├── engine/
│   ├── PixelizerPipeline.ts   # Orquestração dos 4 passes WebGL2 MRT + modo Cel Hard + LUTs on-demand
│   ├── PixelizerMaterial.ts   # Material GLSL3 compatível com luzes/sombras/skinning/morph targets
│   ├── Voxelizer.ts           # Voxelizador 3D watertight + culling + exportadores .GLB / .OBJ / .VOX
│   ├── palettes.ts            # 17 paletas, conversão HSV/Oklab/Posterize e Dual LUT 256×16
│   ├── dither.ts              # 11 matrizes 4×4 e 8×8 + DataTexture RGBA
│   ├── lightingRamps.ts       # Rampas cel-shading 1D (2/3/4 bandas e smooth)
│   ├── snapping.ts            # Anti-pixel-creep de câmera, objeto e rotação
│   ├── steppedAnimation.ts    # Controle de animação stepped (flipbook FPS)
│   ├── SpriteSheetExporter.ts # Captura PNG e geração de Sprite Sheet + JSON Atlas
│   ├── types.ts               # Interfaces públicas do motor
│   └── shaders/
│       ├── common.ts          # Linear<->sRGB, RGB<->HSV, Encode Octaédrico, Dither 4x4/8x8
│       ├── objectShader.ts    # Pass 1 MRT UberShader (Morph + Skinning + MRT)
│       ├── expansionShader.ts # Pass 2 Pixel Expansion (Attempt #3, janela 1×1..10×10)
│       ├── outlineEdgeShader.ts # Pass 3 ID Outlines, Edges & Bevel Lighting
│       └── upscaleShader.ts   # Pass 4 Pixel-Art AA & A/B Split Compare
└── studio/
    ├── loaders/modelLoader.ts # Importador .glb/.gltf/.obj/.fbx/.stl + clip selector + ID unify/split
    ├── presets/demoScenes.ts  # 5 cenas demonstrativas procedurais
    └── ui/                    # Estação de trabalho Studio (Viewport + 4 abas + Voxel 3D)
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
