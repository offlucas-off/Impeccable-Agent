export const FULLSCREEN_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Pass 2: Pixel Expansion (Elliot Bentine Attempt #3).
 * Expands sparse macropixel seeds into exact PxP screen-space blocks using nearest depth,
 * enabling mixed per-object pixel sizes (1x..10x, incl. 3x3, 7x7, 8x8), sub-macropixel motion,
 * and unpixelated hybrid foreground/background depth sorting.
 */
export const EXPANSION_FRAGMENT_SHADER = /* glsl */ `
precision highp float;
precision highp int;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outOutline;
layout(location = 2) out vec4 outMeta;
layout(location = 3) out vec4 outNormalDepth;

uniform sampler2D tColor;
uniform sampler2D tOutline;
uniform sampler2D tMeta;
uniform sampler2D tNormalDepth;

uniform ivec2 uResolution;
uniform int uSearchRadius; // up to 6 for P<=12 (e.g. 4 for 7x7, 5 for 8x8..9x9)
uniform float uEnabled;

void main() {
  ivec2 p = ivec2(floor(gl_FragCoord.xy));
  p = clamp(p, ivec2(0), uResolution - ivec2(1));

  vec4 cColor = texelFetch(tColor, p, 0);
  vec4 cOutline = texelFetch(tOutline, p, 0);
  vec4 cMeta = texelFetch(tMeta, p, 0);
  vec4 cNormalDepth = texelFetch(tNormalDepth, p, 0);

  if (uEnabled < 0.5) {
    // Pass through without expansion (encode 0 offset = (7,7) -> 119/255)
    outColor = cColor;
    outOutline = cOutline;
    outMeta = vec4(cMeta.r, cMeta.g, (7.0 * 16.0 + 7.0) / 255.0, cMeta.a);
    outNormalDepth = cNormalDepth;
    return;
  }

  float bestDepth = cNormalDepth.a;
  ivec2 bestCoord = p;
  bool pickedSeed = (cMeta.b > 0.5);

  // If current pixel is already a valid seed, still check if a closer seed covers it
  for (int dy = -6; dy <= 6; dy++) {
    if (abs(dy) > uSearchRadius) continue;
    for (int dx = -6; dx <= 6; dx++) {
      if (abs(dx) > uSearchRadius) continue;

      ivec2 q = p + ivec2(dx, dy);
      if (q.x < 0 || q.y < 0 || q.x >= uResolution.x || q.y >= uResolution.y) {
        continue;
      }

      vec4 qMeta = texelFetch(tMeta, q, 0);
      if (qMeta.b < 0.5) continue; // Not an expanded seed pixel

      int Pq = int(floor(qMeta.g * 16.0 + 0.5));
      if (Pq <= 1) continue;

      int minOff = -(Pq / 2);
      int maxOff = Pq - 1 + minOff;
      ivec2 diff = p - q;

      if (diff.x >= minOff && diff.x <= maxOff && diff.y >= minOff && diff.y <= maxOff) {
        float qDepth = texelFetch(tNormalDepth, q, 0).a;
        if (qDepth < bestDepth) {
          bestDepth = qDepth;
          bestCoord = q;
          pickedSeed = true;
        }
      }
    }
  }

  vec4 winColor = (bestCoord == p) ? cColor : texelFetch(tColor, bestCoord, 0);
  vec4 winOutline = (bestCoord == p) ? cOutline : texelFetch(tOutline, bestCoord, 0);
  vec4 winMeta = (bestCoord == p) ? cMeta : texelFetch(tMeta, bestCoord, 0);
  vec4 winNormalDepth = (bestCoord == p) ? cNormalDepth : texelFetch(tNormalDepth, bestCoord, 0);

  ivec2 delta = clamp(bestCoord - p, ivec2(-7), ivec2(7));
  if (!pickedSeed) {
    delta = ivec2(0, 0);
  }
  float packedDelta = float((delta.x + 7) * 16 + (delta.y + 7)) / 255.0;

  outColor = winColor;
  outOutline = winOutline;
  outMeta = vec4(winMeta.r, winMeta.g, packedDelta, winMeta.a);
  outNormalDepth = winNormalDepth;
}
`;
