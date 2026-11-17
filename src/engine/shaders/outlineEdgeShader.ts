import { GLSL_COMMON_HELPERS } from './common';

/**
 * Pass 3: Depth-tested ID Silhouette Outlines + Normal/Depth Crease Edge Detection +
 * Light-Reactive Bevel Edge Normal Folding + Edge Highlights.
 *
 * Uses the exact macropixel seed coordinate recovered from Pass 2 (tExpMeta.b) so that
 * every pixel inside a PxP macropixel computes identical outline/edge/bevel results.
 */
export const OUTLINE_EDGE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;
precision highp int;

${GLSL_COMMON_HELPERS}

layout(location = 0) out vec4 outFinalColor;

uniform sampler2D tColor;
uniform sampler2D tOutline;
uniform sampler2D tMeta;
uniform sampler2D tNormalDepth;

uniform ivec2 uResolution;
uniform float uUseDepthTestForId;
uniform float uIdDepthThreshold;
uniform float uUseNormalsForEdges;
uniform float uNormalEdgeThreshold;
uniform float uUseDepthTestForEdges;
uniform float uEdgeDepthThreshold;
uniform float uEdgeHighlightStrength;
uniform float uEdgeBevelStrength;
uniform vec3 uLightDirView;
uniform vec3 uLightColorSrgb;
uniform float uDebugView; // 0=final, 1=raw_3d(handled elsewhere), 2=seed_dither, 3=object_ids, 4=normals, 5=depth, 6=edges

ivec2 decodeSeedCoord(ivec2 p, vec4 meta) {
  int packed = int(floor(meta.b * 255.0 + 0.5));
  int dx = (packed / 16) - 7;
  int dy = (packed % 16) - 7;
  return clamp(p + ivec2(dx, dy), ivec2(0), uResolution - ivec2(1));
}

vec3 idToDebugColor(int id) {
  if (id == 0) return vec3(0.08, 0.09, 0.12);
  float h = fract(float(id) * 0.61803398875);
  return hsvToRgb(vec3(h, 0.78, 0.92));
}

void main() {
  ivec2 p = ivec2(floor(gl_FragCoord.xy));
  p = clamp(p, ivec2(0), uResolution - ivec2(1));

  vec4 cColor = texelFetch(tColor, p, 0);
  vec4 cOutline = texelFetch(tOutline, p, 0);
  vec4 cMeta = texelFetch(tMeta, p, 0);
  vec4 cND = texelFetch(tNormalDepth, p, 0);

  int objId = int(floor(cMeta.r * 255.0 + 0.5));
  int metaCode = int(floor(cMeta.g * 32.0 + 0.5));
  int pixelSize = metaCode % 16;
  int outlineSteps = (metaCode >= 16) ? 2 : 1;
  float bevelWeight = cMeta.a;
  vec3 N = octDecode(cND.rg);
  float edgeHighlightVal = cND.b;
  float depth = cND.a;

  // Debug inspection views (before outline composite)
  if (uDebugView > 2.5 && uDebugView < 3.5) {
    outFinalColor = vec4(idToDebugColor(objId), 1.0);
    return;
  }
  if (uDebugView > 3.5 && uDebugView < 4.5) {
    outFinalColor = vec4(objId > 0 || cColor.a > 0.0 ? (N * 0.5 + 0.5) : vec3(0.07), 1.0);
    return;
  }
  if (uDebugView > 4.5 && uDebugView < 5.5) {
    float dVis = 1.0 - clamp(depth * 1.4, 0.0, 1.0);
    outFinalColor = vec4(vec3(dVis), 1.0);
    return;
  }

  // Only pixelated objects (pixelSize > 0) receive ProPixelizer ID outlines and pixel-art crease edges
  if (pixelSize <= 0) {
    if (uDebugView > 5.5) {
      outFinalColor = vec4(0.06, 0.07, 0.09, 1.0);
    } else {
      outFinalColor = cColor;
    }
    return;
  }

  ivec2 seedP = decodeSeedCoord(p, cMeta);
  int stepPx = max(1, pixelSize);

  ivec2 dirs[4];
  dirs[0] = ivec2(stepPx, 0);
  dirs[1] = ivec2(-stepPx, 0);
  dirs[2] = ivec2(0, stepPx);
  dirs[3] = ivec2(0, -stepPx);

  bool isSilhouetteOutline = false;
  bool isCreaseEdge = false;
  bool isDepthEdge = false;
  vec3 avgNeighborNormal = N;
  vec2 silhouetteAwayDir = vec2(0.0);
  float normalCount = 1.0;

  for (int i = 0; i < 4; i++) {
    ivec2 nCoord = seedP + dirs[i];
    if (nCoord.x < 0 || nCoord.y < 0 || nCoord.x >= uResolution.x || nCoord.y >= uResolution.y) {
      // Screen boundary neighbor
      if (objId > 0) {
        isSilhouetteOutline = true;
      }
      continue;
    }

    vec4 nMeta = texelFetch(tMeta, nCoord, 0);
    vec4 nND = texelFetch(tNormalDepth, nCoord, 0);
    int nId = int(floor(nMeta.r * 255.0 + 0.5));
    float nDepth = nND.a;
    vec3 nN = octDecode(nND.rg);

    // 1. Silhouette ID outline detection (with optional depth testing so only foreground draws outline)
    if (nId != objId && objId > 0) {
      bool passesDepth = (uUseDepthTestForId < 0.5) || (depth < nDepth + uIdDepthThreshold);
      if (passesDepth) {
        isSilhouetteOutline = true;
        silhouetteAwayDir += vec2(dirs[i]);
      }
      continue;
    }

    // 2. Interior depth discontinuity edge (e.g., staircase steps with identical normals)
    if (uUseDepthTestForEdges > 0.5) {
      if ((nDepth - depth) > uEdgeDepthThreshold) {
        isDepthEdge = true;
      }
    }

    // 3. Interior normal crease edge (1px deterministic single-sided convex edge)
    if (uUseNormalsForEdges > 0.5) {
      float normalDiff = 1.0 - max(dot(N, nN), -1.0);
      if (normalDiff > uNormalEdgeThreshold) {
        // Pick nearer or upper/left side of crease for clean 1-macropixel staircases
        float depthDelta = nDepth - depth;
        vec3 biasVec = vec3(0.45, 0.85, 0.25);
        bool isPrimarySide = (abs(depthDelta) > 0.002)
          ? (depth < nDepth)
          : (dot(N - nN, biasVec) > 0.0);
        if (isPrimarySide) {
          isCreaseEdge = true;
          avgNeighborNormal += nN;
          normalCount += 1.0;
        }
      }
    }
  }

  // Optional 2-macropixel bold silhouette outline (for Bosses & Hades Graphic Ink v2)
  if (!isSilhouetteOutline && outlineSteps >= 2 && objId > 0) {
    ivec2 ring2[8];
    ring2[0] = ivec2(stepPx * 2, 0);
    ring2[1] = ivec2(-stepPx * 2, 0);
    ring2[2] = ivec2(0, stepPx * 2);
    ring2[3] = ivec2(0, -stepPx * 2);
    ring2[4] = ivec2(stepPx, stepPx);
    ring2[5] = ivec2(-stepPx, stepPx);
    ring2[6] = ivec2(stepPx, -stepPx);
    ring2[7] = ivec2(-stepPx, -stepPx);
    for (int i = 0; i < 8; i++) {
      ivec2 nCoord = seedP + ring2[i];
      if (nCoord.x < 0 || nCoord.y < 0 || nCoord.x >= uResolution.x || nCoord.y >= uResolution.y) {
        isSilhouetteOutline = true;
        break;
      }
      int nId = int(floor(texelFetch(tMeta, nCoord, 0).r * 255.0 + 0.5));
      if (nId != objId) {
        float nDepth = texelFetch(tNormalDepth, nCoord, 0).a;
        if ((uUseDepthTestForId < 0.5) || (depth < nDepth + uIdDepthThreshold)) {
          isSilhouetteOutline = true;
          silhouetteAwayDir += vec2(ring2[i]);
        }
      }
    }
  }

  vec3 color = cColor.rgb;
  bool anyEdge = isCreaseEdge || isDepthEdge;

  if (uDebugView > 5.5) {
    vec3 edgeDebug = vec3(0.06, 0.07, 0.09);
    if (anyEdge) edgeDebug = vec3(0.35, 0.85, 1.0);
    if (isSilhouetteOutline && cOutline.a > 0.01) edgeDebug = vec3(1.0, 0.45, 0.25);
    outFinalColor = vec4(edgeDebug, 1.0);
    return;
  }

  // Apply Bevel Edges (light-reactive edge normals + rear normal folding for rim lights)
  if ((anyEdge || isSilhouetteOutline) && bevelWeight > 0.001 && uEdgeBevelStrength > 0.001) {
    vec3 bevelNormal = normalize(avgNeighborNormal / normalCount);
    if (isSilhouetteOutline && length(silhouetteAwayDir) > 0.01) {
      vec3 foldDir = normalize(vec3(normalize(silhouetteAwayDir), -0.45));
      bevelNormal = normalize(mix(bevelNormal, foldDir, 0.65));
    }
    float baseNdl = max(dot(N, uLightDirView), 0.0);
    float bevelNdl = max(dot(bevelNormal, uLightDirView), 0.0);
    float bevelDelta = (bevelNdl - baseNdl) * bevelWeight * uEdgeBevelStrength;
    color = clamp(color + uLightColorSrgb * bevelDelta * 0.55, 0.0, 1.0);
  }

  // Apply Interior Edge Highlight (<0.5 darkens, >0.5 lightens)
  if (anyEdge && abs(edgeHighlightVal - 0.5) > 0.005) {
    float delta = (edgeHighlightVal - 0.5) * 2.0 * uEdgeHighlightStrength;
    if (delta >= 0.0) {
      color = mix(color, vec3(1.0), clamp(delta, 0.0, 1.0));
    } else {
      color = mix(color, vec3(0.0), clamp(-delta, 0.0, 1.0));
    }
  }

  // Apply Silhouette ID Outline last (highest visual priority)
  if (isSilhouetteOutline && cOutline.a > 0.001) {
    color = mix(color, cOutline.rgb, cOutline.a);
  }

  outFinalColor = vec4(color, cColor.a);
}
`;
