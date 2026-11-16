export const GLSL_COMMON_HELPERS = /* glsl */ `
vec3 linearToSrgb(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

vec3 srgbToLinear(vec3 c) {
  vec3 lo = c / 12.92;
  vec3 hi = pow(max((c + 0.055) / 1.055, vec3(0.0)), vec3(2.4));
  return mix(lo, hi, step(vec3(0.04045), c));
}

vec3 rgbToHsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-6;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsvToRgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Octahedral unit normal encoding to [0, 1]^2
vec2 octEncode(vec3 n) {
  n /= (abs(n.x) + abs(n.y) + abs(n.z) + 1e-6);
  if (n.z < 0.0) {
    vec2 signNotZero = vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    n.xy = (1.0 - abs(n.yx)) * signNotZero;
  }
  return n.xy * 0.5 + 0.5;
}

vec3 octDecode(vec2 f) {
  f = f * 2.0 - 1.0;
  vec3 n = vec3(f.x, f.y, 1.0 - abs(f.x) - abs(f.y));
  float t = clamp(-n.z, 0.0, 1.0);
  n.x += (n.x >= 0.0) ? -t : t;
  n.y += (n.y >= 0.0) ? -t : t;
  return normalize(n);
}

float sampleDither4x4(sampler2D ditherTex, vec2 pixelCoord) {
  vec2 uv = (mod(floor(pixelCoord), 4.0) + 0.5) / 4.0;
  return texture(ditherTex, uv).r;
}
`;
