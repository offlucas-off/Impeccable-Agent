/**
 * Bloom Extract Pass: Isolates HDR emissive glow encoded in Pass 2 expansion alpha (> 0.5)
 * so glowing runes, lava, portals, and spells bloom across pixel blocks without blurring edges.
 */
export const BLOOM_EXTRACT_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 fragColor;

varying vec2 vUv;

uniform sampler2D tSource;
uniform float uBloomThreshold;

void main() {
  vec4 c = texture(tSource, vUv);
  float emitSignal = clamp((c.a - 0.506) * 3.03, 0.0, 1.5);
  float luma = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  float effectiveThresh = max(0.05, uBloomThreshold);
  float soft = clamp((emitSignal - effectiveThresh) / max(0.05, 1.5 - effectiveThresh), 0.0, 1.0);
  float strength = soft * clamp(0.95 + emitSignal * 1.45 + luma * 0.35, 0.0, 2.8);
  fragColor = vec4(c.rgb * strength, 1.0);
}
`;

/**
 * Separable 9-tap Gaussian Bloom Blur Pass (Horizontal or Vertical via uTexelStep).
 */
export const BLOOM_BLUR_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 fragColor;

varying vec2 vUv;

uniform sampler2D tSource;
uniform vec2 uTexelStep;

void main() {
  vec3 acc = texture(tSource, vUv).rgb * 0.2270270270;
  acc += texture(tSource, clamp(vUv + uTexelStep * 1.0, vec2(0.0), vec2(1.0))).rgb * 0.1945945946;
  acc += texture(tSource, clamp(vUv - uTexelStep * 1.0, vec2(0.0), vec2(1.0))).rgb * 0.1945945946;
  acc += texture(tSource, clamp(vUv + uTexelStep * 2.0, vec2(0.0), vec2(1.0))).rgb * 0.1216216216;
  acc += texture(tSource, clamp(vUv - uTexelStep * 2.0, vec2(0.0), vec2(1.0))).rgb * 0.1216216216;
  acc += texture(tSource, clamp(vUv + uTexelStep * 3.0, vec2(0.0), vec2(1.0))).rgb * 0.0540540541;
  acc += texture(tSource, clamp(vUv - uTexelStep * 3.0, vec2(0.0), vec2(1.0))).rgb * 0.0540540541;
  acc += texture(tSource, clamp(vUv + uTexelStep * 4.0, vec2(0.0), vec2(1.0))).rgb * 0.0162162162;
  acc += texture(tSource, clamp(vUv - uTexelStep * 4.0, vec2(0.0), vec2(1.0))).rgb * 0.0162162162;
  fragColor = vec4(acc, 1.0);
}
`;

/**
 * Pass 4: Final Screen Composite, Pixel Art Anti-Aliasing Upscaler,
 * HDR Emissive Bloom Additive Composite, Camera Subpixel Motion Offset, and Live A/B Split-Compare Visualizer.
 */
export const UPSCALE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

layout(location = 0) out vec4 fragColor;

varying vec2 vUv;

uniform sampler2D tPixelized;
uniform sampler2D tRaw3D;
uniform sampler2D tBloom;
uniform vec2 uLowResSize;
uniform vec2 uScreenSize;
uniform vec2 uSubpixelOffsetUv;
uniform float uUsePixelArtAA;
uniform float uSplitCompare;
uniform float uSplitPosition;
uniform float uShowRawOnly;
uniform float uTransparentBg;
uniform vec3 uBgColorSrgb;
uniform float uBloomEnabled;
uniform float uBloomIntensity;
uniform float uExposure;
uniform float uContrast;
uniform float uVignetteStrength;

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

vec3 applyPostGrade(vec3 col) {
  vec3 graded = col * max(0.1, uExposure);
  graded = (graded - 0.5) * max(0.2, uContrast) + 0.5;
  if (uVignetteStrength > 0.001) {
    vec2 centered = vUv - 0.5;
    float dist = dot(centered, centered) * 2.4;
    float vig = clamp(1.0 - dist * uVignetteStrength, 0.25, 1.0);
    graded *= vig;
  }
  return clamp(graded, 0.0, 1.0);
}

void main() {
  vec2 shiftedUv = clamp(vUv + uSubpixelOffsetUv, vec2(0.0), vec2(1.0));

  vec4 pixelizedSample = (uUsePixelArtAA > 0.5)
    ? samplePixelArtAA(tPixelized, shiftedUv, uLowResSize)
    : texture(tPixelized, shiftedUv);

  vec4 rawSample = texture(tRaw3D, vUv);

  vec4 chosen = (uShowRawOnly > 0.5) ? rawSample : pixelizedSample;
  vec3 bloom = (uBloomEnabled > 0.5 && uShowRawOnly < 0.5)
    ? texture(tBloom, shiftedUv).rgb * uBloomIntensity
    : vec3(0.0);

  if (uSplitCompare > 0.5) {
    float divider = abs(vUv.x - uSplitPosition) * uScreenSize.x;
    if (vUv.x < uSplitPosition) {
      chosen = rawSample;
      bloom = vec3(0.0);
    } else {
      chosen = pixelizedSample;
    }
    if (divider < 1.5) {
      chosen = vec4(0.95, 0.72, 0.24, 1.0);
      bloom = vec3(0.0);
    }
  }

  if (uTransparentBg > 0.5) {
    float bloomAlpha = clamp(max(bloom.r, max(bloom.g, bloom.b)), 0.0, 1.0);
    vec3 compTrans = clamp(chosen.rgb * chosen.a + bloom, 0.0, 1.0);
    fragColor = vec4(applyPostGrade(compTrans), max(chosen.a, bloomAlpha));
  } else {
    vec3 comp = clamp(mix(uBgColorSrgb, chosen.rgb, chosen.a) + bloom, 0.0, 1.0);
    fragColor = vec4(applyPostGrade(comp), 1.0);
  }
}
`;
