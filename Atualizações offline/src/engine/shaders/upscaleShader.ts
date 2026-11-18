/**
 * Pass 4: Final Screen Composite, Pixel Art Anti-Aliasing Upscaler,
 * Camera Subpixel Motion Offset, and Live A/B Split-Compare Visualizer.
 */
export const UPSCALE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 fragColor;

varying vec2 vUv;

uniform sampler2D tPixelized;
uniform sampler2D tRaw3D;
uniform vec2 uLowResSize;
uniform vec2 uScreenSize;
uniform vec2 uSubpixelOffsetUv;
uniform float uUsePixelArtAA;
uniform float uSplitCompare;
uniform float uSplitPosition;
uniform float uShowRawOnly;
uniform float uTransparentBg;
uniform vec3 uBgColorSrgb;

// Cole Cecil / aa-pixel-art crisp texel-interior + 1px AA boundary shader
vec4 samplePixelArtAA(sampler2D tex, vec2 uv, vec2 texSize) {
  vec2 p = uv * texSize + 0.5;
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 scale = max(vec2(1.0), uScreenSize / max(texSize, vec2(1.0)));
  vec2 aa = clamp((f - 0.5) * scale + 0.5, 0.0, 1.0);
  vec2 sampleUv = (i - 0.5 + aa) / texSize;
  vec2 halfTexel = 0.5 / max(texSize, vec2(1.0));
  return texture(tex, clamp(sampleUv, halfTexel, vec2(1.0) - halfTexel));
}

void main() {
  vec2 shiftedUv = clamp(vUv + uSubpixelOffsetUv, vec2(0.0), vec2(1.0));

  vec4 pixelizedSample = (uUsePixelArtAA > 0.5)
    ? samplePixelArtAA(tPixelized, shiftedUv, uLowResSize)
    : texture(tPixelized, shiftedUv);

  vec4 rawSample = texture(tRaw3D, vUv);

  vec4 chosen = (uShowRawOnly > 0.5) ? rawSample : pixelizedSample;

  if (uSplitCompare > 0.5) {
    float divider = abs(vUv.x - uSplitPosition) * uScreenSize.x;
    if (vUv.x < uSplitPosition) {
      chosen = rawSample;
    } else {
      chosen = pixelizedSample;
    }
    if (divider < 1.5) {
      chosen = vec4(0.95, 0.72, 0.24, 1.0);
    }
  }

  if (uTransparentBg > 0.5) {
    fragColor = chosen;
  } else {
    vec3 comp = mix(uBgColorSrgb, chosen.rgb, chosen.a);
    fragColor = vec4(comp, 1.0);
  }
}
`;
