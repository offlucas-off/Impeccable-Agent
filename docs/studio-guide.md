# Guia do Pixelizer Studio

## Barra Superior

- **Preset Selector**: Alterna entre 5 cenas prontas que demonstram recursos específicos:
  1. `Hover Rover & Drone`: Chassi multi-partes compartilhando `ID 1` (`3×3`) + drone `ID 2` (`2×2`) sobre piso 3D sem pixelização.
  2. `Pixel Knight & Gear`: Espada, escudo e armadura unidos por `Align Pixel Grid` + snap angular *Camera Space Y*.
  3. `Creep & Edge Lab`: Bancada de testes para bordas de profundidade em escadaria, oclusões entre IDs e teste de movimento contínuo.
  4. `Relic Chest & Crystal`: Alto contraste metálico com *Bevel Edges* e cristal emissivo `2×2`.
  5. `Hybrid 3D + Pixel`: Mistura de pilares e piso 3D originais com personagens pixelizados no mesmo Z-Buffer.
- **Import 3D**: Carrega modelos locais `.glb`, `.gltf`, `.obj`, `.fbx` ou `.stl` (também suporta arrastar e soltar direto no viewport).
- **A/B Split**: Divide o viewport em **RAW 3D** (esquerda) vs **PIXELIZED** (direita) com barra arrastável.
- **Creep Test**: Move continuamente o modelo selecionado sobre a grade da câmera para validar estabilidade visual sem *pixel shimmering*.
- **Debug View**: Inspeciona `Final Composite`, `Raw 3D`, `Pass 1 Seeds`, `Object IDs`, `Encoded Normals`, `Linear Depth` e `Outlines & Edges`.

---

## Abas do Inspetor Lateral

### 1. Pipeline
- Alterna entre modo **Hybrid** (`Only Pixelized Objects`) e **Full Scene** (`World Space Pixel Size`, `Downscale Ratio` ou `Target Height`).
- Ajusta **Cole Cecil Pixel-Art AA** vs **Nearest Neighbor**, tolerâncias de contorno por ID/Profundidade/Normal, força de **Bevel Edges**, direção/cor solar e fundo transparente.

### 2. Object
- Selecione qualquer peça ou sub-malha na lista `Scene Items` e use `Apply Style to All` para propagar configurações em lote.
- Configure `Pixelated Shader`, tamanho do bloco (`1×1`..`6×6`), `Object ID`, cor de silhueta, `Edge Highlight` (`< 0.5` escurece, `> 0.5` clareia) e `Bevel Edges Weight`.
- Carregue texturas customizadas em `Albedo`, `Normal` ou `Emission` diretamente na aba de material.
- Ative `Snap Object Position`, `Align Pixel Grid to Root` e `Angle Snap Mode` (`World Space` / `Camera Space Y`).

### 3. Palette
- Selecione uma paleta embutida ou extraia cores diretamente de qualquer imagem PNG via `From PNG`.
- Edite, adicione ou remova *swatches* em tempo real com visualização imediata no gradiente quantizado e botão **Download LUT** (`256×16`).
- Clique nas células da matriz **4×4 Ordered Dither** para customizar os limiares (`0..16`, `Shift+Click` decrementa).

### 4. Export
- **Single Frame Capture**: Gera PNG em alta resolução ou tamanho exato de sprite com transparência alfa preservada.
- **Sprite Sheet Generator**: Rotaciona automaticamente o objeto em `1`, `4`, `8` ou `16` direções × `1..12` quadros de animação stepped, exibindo um preview animado quadro-a-quadro e permitindo baixar o `.png` completo e o `.json` do atlas.
