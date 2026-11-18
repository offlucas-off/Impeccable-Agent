# Arquitetura do Motor (Baseada no ProPixelizer)

Este documento detalha como os princípios do **ProPixelizer** foram adaptados para um pipeline nativo em **WebGL2 + Three.js (`THREE.GLSL3`)**.

---

## 1. Visão Geral dos 4 Passes WebGL2 MRT

O WebGL2 garante suporte mínimo a `MAX_DRAW_BUFFERS >= 4`. O motor utiliza exatamente 4 anexos de cor por Render Target para eliminar passes extras desnecessários:

| Attachment | Conteúdo | Formato |
|---|---|---|
| `location = 0` (`gColor`) | Cor final sombreada & quantizada pela LUT em espaço sRGB + alfa | `RGBA16F` (fallback `RGBA8`) |
| `location = 1` (`gOutline`) | `rgb` = Cor da silhueta em sRGB · `a` = Opacidade do contorno | `RGBA8` |
| `location = 2` (`gMeta`) | `r` = `objectId/255` · `g` = `pixelSize/16` · `b` = Semente / Offset delta · `a` = `bevelWeight` | `RGBA8` |
| `location = 3` (`gNormalDepth`) | `rg` = Normal octaédrica em view-space · `b` = `edgeHighlight` · `a` = Profundidade linear `[0..1]` | `RGBA16F` (fallback `RGBA8`) |

---

## 2. Pixel Expansion (*Attempt #3*)

No render híbrido (`Only Pixelized Objects`), objetos comuns e objetos pixelizados coexistem com resolução total de tela:

1. No **Pass 1 (`objectShader.ts`)**, cada objeto pixelizado (incluindo malhas com *skinning* e *morph targets*) calcula sua origem projetada (`uPixelGridOriginPx`) e **descarta** fragmentos fora da semente central de cada bloco `P×P`.
2. Apenas o fragmento-semente roda iluminação, mapa de normais, sombras, rampa cel e lookup na LUT de paleta.
3. No **Pass 2 (`expansionShader.ts`)**, cada pixel da tela inspeciona a vizinhança controlada por `uSearchRadius` (até `±6`, cobrindo blocos **`1×1` até `10×10`**, inclusive `3×3`, `5×5`, `7×7`, `8×8`) para encontrar a semente cuja cobertura englobe o pixel com **menor profundidade linear**.
4. O delta exato até a semente vencedora (`bestCoord - p`) é empacotado em `outMeta.b` (`[-7..+7]` em 4 bits por eixo: `(dx + 7) * 16 + (dy + 7)`) para que o Pass 3 avalie os mesmos vizinhos para todos os pixels de um macropixel.
5. No modo **Cel Hard**, `uForceFlatDither = 1` força `effectiveP = 1` sem dithering para estilo anime/cel duro com contornos de silhueta e vincos.

---

## 3. Contornos por ID, Vincos & Bevel Edges

No **Pass 3 (`outlineEdgeShader.ts`)**, cada macropixel consulta 4 vizinhos a distância `±P` em pixels a partir de sua semente decodificada:

- **Silhuetas por Object ID**: Quando `nId != objId`, desenha `gOutline.rgb` somente se o pixel atual estiver à frente (`depth < nDepth + uIdDepthThreshold` quando `useDepthTestForIdOutlines = true`), evitando bordas fantasmas ao redor de oclusões. Partes que compartilham o mesmo `objectId` (como torso, capacete e escudo de personagens articulados) fundem sua silhueta externa em um único sprite.
- **Detecção de Arestas Internas (1 macropixel)**:
  - **Normal Creases**: Mede `1 - dot(N, nN)`. Um critério determinístico (`isPrimarySide`) escolhe apenas o lado mais próximo ou superior-esquerdo do vinco para traçar linhas nítidas de **1 macropixel**.
  - **Depth Edges**: Detecta degraus com normais idênticas (ex.: escadaria na cena *Creep & Edge Lab*) via `(nDepth - depth) > uEdgeDepthThreshold`.
- **Bevel Edges**: Recalcula uma normal média entre a face e os vizinhos da aresta (dobrando normais de silhueta para fora/trás) e soma a diferença de `dot(N, L)` iluminada — produzindo reflexos de borda que respondem ao ângulo do sol e da câmera.

---

## 4. Dual Palette LUT, Métricas & Dithering 4×4 / 8×8

- O pipeline mantém cálculos físicos/cel em espaço linear e converte para **sRGB** antes da consulta da LUT (`samplePaletteDualLut`).
- Cada paleta constrói sob demanda (`ensurePaletteLut`) duas texturas `256×16` (`16×16×16` fatiado em azul) suportando 6 métricas de conversão:
  - `hsv_weighted` (ProPixelizer clássico)
  - `oklab_perceptual` (distância perceptualmente uniforme de Björn Ottosson)
  - `hue_priority` (preservação agressiva de matizes saturados retrô)
  - `rgb_euclidean` (Redmean ponderado)
  - `value_nearest` (rampas ordenadas de luminância estilo GameBoy / 1-Bit)
  - `posterize_quant` (quantização discreta de profundidade por canal)
- Matrizes ordenadas **4×4 e 8×8** (`sampleDitherMatrix` usando `uDitherSize`) decidem pixel a pixel entre `C1` e `C2` em coordenadas alinhadas ao macropixel.

---

## 5. Voxelizador 3D Watertight & Exportadores (`Voxelizer.ts`)

Além da pixelização em espaço de tela, o módulo `Voxelizer` converte qualquer hierarquia `THREE.Object3D` (incluindo `SkinnedMesh` e `morph targets` avaliados no frame atual via `getVertexPosition`) em uma malha volumétrica de cubos:

- Calcula a distância exata ponto-a-triângulo em AABBs locais e amostra mapas de textura + cores de vértice + emissão.
- Remove automaticamente faces internas compartilhadas entre voxels adjacentes (*neighbor face culling*) e suporta dithering ordenado 3D por paleta.
- Exporta diretamente para **`.glb`** (`GLTFExporter` binário), **`.obj`** (`v x y z r g b` com cor por vértice) e **`.vox`** (formato binário MagicaVoxel v150 com troca Y-up -> Z-up).

---

## 6. Anti-Pixel-Creep & Isometria 2:1

Em `src/engine/snapping.ts`:
- Câmera ortográfica no ângulo clássico **`(30°, 45°, 0°)`** produz escadas limpas **2:1** sem serrilhado irregular.
- `snapCameraToPixelGrid` ajusta a câmera ao longo de seus próprios eixos `right` e `up` a múltiplos exatos de `worldPixelSize` (com compensação opcional subpixel em UV no Pass 4).
- `snapObjectForRender` fixa objetos no grid local de macropixels (`worldPixelSize * alignmentPixelSize`) e permite travar sub-peças à raiz (`alignPixelGrid`) + quantização angular *World Space* ou *Camera Space Y*.
- Todas as transformações originais são restauradas imediatamente após o Pass 1.
