# Guia do Pixelizer Studio

## Barra Superior

- **Preset Selector**:
  - *Procedural Demos*: `Hover Rover & Drone`, `Pixel Knight & Gear`, `Creep & Edge Lab`, `Relic Chest & Crystal`, `Hybrid 3D + Pixel`.
  - *Articulated 3D Characters (GLB)*: **RPG Knight** (`Walking_A`, `Idle`, `Running_A`, 76 clipes CC0), **Expressive Bot** (14 clipes + *morph targets* faciais MIT), **Tactical Soldier** (armadura PBR, 4 clipes MIT) e **Wild Fox** (quadrúpede CC0).
- **Import 3D**: Carrega modelos locais `.glb`, `.gltf`, `.obj`, `.fbx` ou `.stl` (inclusive por arrastar e soltar direto no viewport).
- **A/B Split**: Divide o viewport em **RAW 3D** vs **PIXELIZED** com barra arrastável.
- **Creep Test**: Move continuamente o modelo selecionado sobre a grade para validar estabilidade sem *pixel shimmering*.
- **Debug View**: Inspeciona `Final Composite`, `Raw 3D`, `Pass 1 Seeds`, `Object IDs`, `Encoded Normals`, `Linear Depth` e `Outlines & Edges`.

---

## Abas do Inspetor Lateral

### 1. Pipeline
- Alterna o **Modo de Conversão** entre **Hybrid** (`Only Pixelized`), **Full Scene** (`World Space` / `Downscale` / `Target Height`), **Cel Hard** (cel-shading plano `1×1` sem dithering) e **Voxel 3D** (visualização geométrica em blocos 3D ao vivo).
- Ajusta **Cole Cecil Pixel-Art AA** vs **Nearest Neighbor**, tolerâncias de contorno por ID/Profundidade/Normal, força de **Bevel Edges**, direção/cor solar e fundo transparente.

### 2. Object
- Selecione qualquer sub-malha em `Scene Items`, alterne rapidamente entre silhueta unificada vs contornos por peça com **Unify/Split IDs**, e aplique parâmetros em lote com **Apply All**.
- Configure `Pixelated Shader`, macropixel **`1×1`..`10×10`** (com botões rápidos **`1×1`**, **`2×2`**, **`3×3`**, **`5×5`**, **`7×7`**, **`8×8`**), `Object ID`, contorno, `Edge Highlight` e `Bevel Edges Weight`.
- Carregue texturas customizadas em `Albedo`, `Normal` ou `Emission` e configure *Anti-Pixel-Creep Snapping*.

### 3. Palette
- Escolha entre **17 paletas embutidas** (Endesga 32, Resurrect 64, DawnBringer 32, Zughy 32, PICO-8, Sweetie 16, SNES, NES, C64, Cyberpunk Neon, Posterize RGB-64, GameBoy DMG/Pocket, Virtual Boy, 1-Bit Ink, CGA) ou extraia de qualquer PNG via `From PNG`.
- Selecione entre 6 métricas (*HSV Weighted*, *Oklab Perceptual*, *Hue Priority*, *RGB Euclidean*, *Value Ramp* e *Posterize Bit-Depth*) e **11 matrizes de Dither `4×4` e `8×8`** editáveis célula a célula.

### 4. Export (Sprites 2D + Malha Voxel 3D)
- **3D Voxel Mesh Generator & Export**: Escolha a resolução (`12..64` voxels), quantização opcional pela paleta ativa e dithering 3D ordenado; visualize em **Preview Voxel 3D in Viewport** ou exporte diretamente para **`.GLB`**, **`.OBJ`** ou **`.VOX` (MagicaVoxel)**.
- **Single Frame Capture (2D)**: Gera PNG isolado com transparência alfa opcional (funciona tanto em modo 2D pixelizado quanto sobre a malha Voxel 3D).
- **Sprite Sheet Generator**: Rotaciona o personagem/objeto (ou sua malha Voxel 3D) em `1`, `4`, `8` ou `16` direções × `1..12` quadros com download `.png` + atlas `.json`.
