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

1. No **Pass 1 (`objectShader.ts`)**, cada objeto pixelizado calcula sua origem projetada (`uPixelGridOriginPx`) e **descarta** todos os fragmentos de tela que não sejam a semente central de cada bloco `P×P`.
2. Apenas o fragmento-semente roda o cálculo completo de iluminação, mapa de normais, sombras, rampa cel e lookup na LUT de paleta.
3. No **Pass 2 (`expansionShader.ts`)**, cada pixel da tela inspeciona a vizinhança `(dx, dy)` para encontrar a semente cuja cobertura `[-floor(P/2) .. P-1-floor(P/2)]` englobe o pixel e possua **menor profundidade linear**.
4. O delta exato até a semente vencedora (`bestCoord - p`) é empacotado em `outMeta.b` (`[-4..+4]` em cada eixo) para que o Pass 3 avalie exatamente os mesmos vizinhos para todos os pixels de um macropixel.

### Benefícios:
- Objetos de tamanhos `2×2`, `3×3`, `4×4` e objetos 3D lisos (`RAW`) ordenam-se naturalmente pelo Z-Buffer sem *sorting glitches*.
- Objetos movem-se e rotacionam sem deformar seus macropixels no espaço de mundo.

---

## 3. Contornos por ID, Vincos & Bevel Edges

No **Pass 3 (`outlineEdgeShader.ts`)**, cada macropixel consulta 4 vizinhos a distância `±P` em pixels a partir de sua semente decodificada:

- **Silhuetas por Object ID**: Quando `nId != objId`, desenha `gOutline.rgb` somente se o pixel atual estiver à frente (`depth < nDepth + uIdDepthThreshold` quando `useDepthTestForIdOutlines = true`), evitando bordas fantasmas ao redor de oclusões. Partes que compartilham o mesmo `objectId` (como torso, capacete e espada do Cavaleiro) fundem sua silhueta externa em um único sprite.
- **Detecção de Arestas Internas (1 macropixel)**:
  - **Normal Creases**: Mede `1 - dot(N, nN)`. Um critério determinístico (`isPrimarySide`) escolhe apenas o lado mais próximo ou superior-esquerdo do vinco para traçar linhas nítidas de **1 macropixel**.
  - **Depth Edges**: Detecta degraus com normais idênticas (ex.: escadaria na cena *Creep & Edge Lab*) via `(nDepth - depth) > uEdgeDepthThreshold`.
- **Bevel Edges**: Recalcula uma normal média entre a face e os vizinhos da aresta (dobrando normais de silhueta para fora/trás) e soma a diferença de `dot(N, L)` iluminada — produzindo reflexos de borda que respondem ao ângulo do sol e da câmera.

---

## 4. Dual Palette LUT & Ordered Dithering 4×4

- O pipeline mantém tudo em espaço linear durante o cálculo físico/cel-shading e converte para **sRGB** imediatamente antes da consulta da LUT (`samplePaletteDualLut`), assegurando fidelidade exata aos hexadecimais da paleta.
- Cada paleta gera duas texturas `256×16` (cubo `16×16×16` fatiado em azul):
  - `tPalettePrimary`: cor mais próxima `C1` + razão de mistura `A` no canal alfa.
  - `tPaletteSecondary`: cor vizinha complementar `C2` ao longo da projeção de menor erro.
- A matriz **4×4 (`tDither`)** comparada em coordenadas alinhadas ao macropixel (`floor((fragPx - originPx) / P)`) decide pixel a pixel entre `C1` e `C2`.

---

## 5. Anti-Pixel-Creep & Isometria 2:1

Em `src/engine/snapping.ts`:
- Câmera ortográfica no ângulo clássico **`(30°, 45°, 0°)`** produz escadas limpas **2:1** sem serrilhado irregular.
- `snapCameraToPixelGrid` ajusta a câmera ao longo de seus próprios eixos `right` e `up` a múltiplos exatos de `worldPixelSize` (com suporte opcional a compensação subpixel em UV no Pass 4).
- `snapObjectForRender` fixa objetos no grid local de macropixels (`worldPixelSize * alignmentPixelSize`) e permite travar sub-peças à raiz (`alignPixelGrid`) + quantização angular *World Space* ou *Camera Space Y*.
- Todas as transformações originais são restauradas imediatamente após o Pass 1, mantendo a física e os `OrbitControls` suaves sem jamais acumular erro numérico.
