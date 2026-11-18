import { GLSL_COMMON_HELPERS } from './common';

export const OBJECT_VERTEX_SHADER = /* glsl */ `
#include <common>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>

varying vec2 vUv;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vVertexColor;
varying vec3 vTangentView;
varying vec3 vBitangentView;

void main() {
  vUv = uv;
  #if defined( USE_COLOR_ALPHA )
    vVertexColor = color;
  #elif defined( USE_COLOR )
    vVertexColor = vec4(color, 1.0);
  #else
    vVertexColor = vec4(1.0);
  #endif

  vec3 objectNormal = vec3(normal);
  #ifdef USE_TANGENT
    vec3 objectTangent = vec3(tangent.xyz);
  #endif

  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>

  vec3 transformedNormal = objectNormal;
  #ifdef USE_INSTANCING
    mat3 instMat3 = mat3(instanceMatrix);
    transformedNormal = instMat3 * transformedNormal;
  #endif
  transformedNormal = normalMatrix * transformedNormal;
  vNormalView = normalize(transformedNormal);

  #ifdef USE_TANGENT
    vec3 transformedTangent = objectTangent;
    #ifdef USE_INSTANCING
      transformedTangent = instMat3 * transformedTangent;
    #endif
    transformedTangent = normalMatrix * transformedTangent;
    transformedTangent = transformedTangent - vNormalView * dot(transformedTangent, vNormalView);
    float tLen = length(transformedTangent);
    vTangentView = (tLen > 1e-6) ? (transformedTangent / tLen) : vec3(1.0, 0.0, 0.0);
    float tSign = (abs(tangent.w) > 0.5) ? sign(tangent.w) : 1.0;
    vec3 rawBitangent = cross(vNormalView, vTangentView) * tSign;
    float bLen = length(rawBitangent);
    vBitangentView = (bLen > 1e-6) ? (rawBitangent / bLen) : vec3(0.0, 1.0, 0.0);
  #else
    vTangentView = vec3(1.0, 0.0, 0.0);
    vBitangentView = vec3(0.0, 1.0, 0.0);
  #endif

  vec3 transformed = vec3(position);
  #include <morphtarget_vertex>
  #include <skinning_vertex>

  vec4 worldPosition = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    worldPosition = instanceMatrix * worldPosition;
  #endif
  worldPosition = modelMatrix * worldPosition;

  vec4 mvPosition = viewMatrix * worldPosition;
  vViewPos = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;

  #include <shadowmap_vertex>
}
`;

export const OBJECT_FRAGMENT_SHADER = /* glsl */ `
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

${GLSL_COMMON_HELPERS}

layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gOutline;
layout(location = 2) out vec4 gMeta;
layout(location = 3) out vec4 gNormalDepth;

varying vec2 vUv;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vVertexColor;
varying vec3 vTangentView;
varying vec3 vBitangentView;

uniform float uPixelated;
uniform float uPixelSize;
uniform float uUsePixelExpansion;
uniform vec2 uPixelGridOriginPx;
uniform float uObjectId;
uniform vec3 uOutlineColorSrgb;
uniform float uOutlineAlpha;
uniform float uEdgeHighlight;
uniform float uEdgeBevelWeight;

uniform vec3 uBaseColorLinear;
uniform float uAlpha;
uniform float uAlphaClipThreshold;
uniform float uUseDitheredTransparency;
uniform float uHasAlbedoMap;
uniform sampler2D uAlbedoMap;
uniform float uHasNormalMap;
uniform sampler2D uNormalMap;
uniform float uNormalScale;
uniform float uHasEmissionMap;
uniform sampler2D uEmissionMap;
uniform vec3 uEmissionColorLinear;
uniform float uEmissionIntensity;
uniform float uDiffuseVertexColorWeight;
uniform float uEmissiveVertexColorWeight;

uniform float uIsMetallicWorkflow;
uniform vec3 uSpecularColorLinear;
uniform float uMetallic;
uniform float uSmoothness;
uniform float uLightingRampRange;
uniform float uLightingRampOffset;
uniform vec3 uShadowTintLinear;
uniform float uShadowTintAlpha;
uniform vec3 uAmbientConstantLinear;
uniform float uAmbientConstantWeight;

uniform vec3 uRimColorLinear;
uniform float uRimIntensity;
uniform float uRimPower;
uniform float uRimThreshold;
uniform float uOutlineWidthSteps;
uniform float uDitherSpace;
uniform vec2 uAlbedoSize;

uniform sampler2D uLightingRampTex;
uniform float uUseColorGrading;
uniform sampler2D uPalettePrimaryTex;
uniform sampler2D uPaletteSecondaryTex;
uniform float uPaletteLutSize;
uniform sampler2D uDitherTex;
uniform float uDitherSize;
uniform float uForceFlatDither;

uniform float uCameraNear;
uniform float uCameraFar;
uniform float uIsOrthographic;
uniform float uEncodeBloomAlpha;

vec3 samplePaletteDualLut(vec3 srgbColor, vec2 ditherCoord) {
  vec3 c = clamp(srgbColor, 0.0, 1.0);
  float N = uPaletteLutSize;
  float sliceCount = N - 1.0;

  float rIdx = floor(c.r * sliceCount + 0.5);
  float gIdx = floor(c.g * sliceCount + 0.5);
  float bIdx = floor(c.b * sliceCount + 0.5);

  float texWidth = N * N;
  vec2 uv = vec2((bIdx * N + rIdx + 0.5) / texWidth, (gIdx + 0.5) / N);

  vec4 prim = texture(uPalettePrimaryTex, uv);
  vec3 sec = texture(uPaletteSecondaryTex, uv).rgb;

  float threshold = (uForceFlatDither > 0.5)
    ? 0.5
    : sampleDitherMatrix(uDitherTex, ditherCoord, uDitherSize);
  return (prim.a > threshold) ? sec : prim.rgb;
}

void main() {
  #ifndef USE_TANGENT
    vec3 dPosDx = dFdx(-vViewPos);
    vec3 dPosDy = dFdy(-vViewPos);
    vec2 dUvDx = dFdx(vUv);
    vec2 dUvDy = dFdy(vUv);
  #endif

  vec2 fragPx = floor(gl_FragCoord.xy);
  float P = max(1.0, floor(uPixelSize + 0.5));
  bool expansionActive = (uPixelated > 0.5) && (uUsePixelExpansion > 0.5) && (P > 1.0);

  // Attempt #3 (ProPixelizer Pixel Expansion): Keep only 1 centered seed per PxP macropixel
  if (expansionActive) {
    vec2 originPx = floor(uPixelGridOriginPx + 0.5);
    vec2 rel = fragPx - originPx;
    vec2 inCell = mod(rel, P);
    float seedCenter = floor(P * 0.5);
    if (abs(inCell.x - seedCenter) > 0.25 || abs(inCell.y - seedCenter) > 0.25) {
      discard;
    }
  }

  // Compute macropixel or UV-locked coordinate for ordered dithering
  vec2 ditherCoord = (uDitherSpace > 0.5)
    ? floor(vUv * ((uHasAlbedoMap > 0.5) ? max(uAlbedoSize, vec2(32.0)) : vec2(128.0)))
    : ((uPixelated > 0.5)
        ? floor((fragPx - floor(uPixelGridOriginPx + 0.5)) / P)
        : fragPx);

  vec4 albedoSample = (uHasAlbedoMap > 0.5) ? texture(uAlbedoMap, vUv) : vec4(1.0);
  float finalAlpha = albedoSample.a * uAlpha * vVertexColor.a;

  if (finalAlpha < uAlphaClipThreshold) {
    discard;
  }

  if (uUseDitheredTransparency > 0.5 && finalAlpha < 0.995) {
    float alphaThresh = sampleDitherMatrix(uDitherTex, ditherCoord, uDitherSize);
    if (finalAlpha <= alphaThresh) {
      discard;
    }
  }

  vec3 vertexTint = mix(vec3(1.0), vVertexColor.rgb, uDiffuseVertexColorWeight);
  vec3 albedoLinear = albedoSample.rgb * uBaseColorLinear * vertexTint;

  // Normal calculation (with tangent-space normal map via vertex tangents or dFdx/dFdy cotangent frame)
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
  vec3 N = normalize(vNormalView) * faceDirection;
  if (uHasNormalMap > 0.5) {
    vec3 mapN = texture(uNormalMap, vUv).xyz * 2.0 - 1.0;
    mapN.xy *= uNormalScale;
    #ifdef USE_TANGENT
      vec3 tDir = normalize(vTangentView) * faceDirection;
      vec3 bDir = normalize(vBitangentView) * faceDirection;
      mat3 tbn = mat3(tDir, bDir, N);
      N = normalize(tbn * mapN);
    #else
      vec3 q1perp = cross(dPosDy, N);
      vec3 q0perp = cross(N, dPosDx);
      vec3 T = q1perp * dUvDx.x + q0perp * dUvDy.x;
      vec3 B = q1perp * dUvDx.y + q0perp * dUvDy.y;
      float det = max(dot(T, T), dot(B, B));
      if (det > 1e-10) {
        float invMax = inversesqrt(det);
        T = T * invMax * faceDirection;
        B = B * invMax * faceDirection;
        mat3 tbn = mat3(T, B, N);
        N = normalize(tbn * mapN);
      }
    #endif
  }

  vec3 V = (uIsOrthographic > 0.5) ? vec3(0.0, 0.0, 1.0) : normalize(vViewPos);
  float shadowMask = getShadowMask();

  // Compute lighting (Directional + Point + Spot + Ambient + Specular/Metallic)
  vec3 directLight = vec3(0.0);
  vec3 specAccum = vec3(0.0);
  float ndotlMax = 0.0;
  vec3 mainLightDir = normalize(vec3(0.5, 0.8, 0.4));

  #if NUM_DIR_LIGHTS > 0
    mainLightDir = normalize(directionalLights[0].direction);
    for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
      vec3 L = normalize(directionalLights[i].direction);
      float ndl = max(dot(N, L), 0.0);
      float litFactor = ndl * ((i == 0) ? shadowMask : 1.0);
      ndotlMax = max(ndotlMax, litFactor);
      directLight += directionalLights[i].color * litFactor;

      if (uSmoothness > 0.01 && litFactor > 0.0) {
        vec3 H = normalize(L + V);
        float shininess = mix(4.0, 128.0, uSmoothness * uSmoothness);
        float specTerm = pow(max(dot(N, H), 0.0), shininess) * (uSmoothness * 0.85);
        vec3 specColor = (uIsMetallicWorkflow > 0.5)
          ? mix(vec3(0.04), albedoLinear, uMetallic)
          : uSpecularColorLinear;
        specAccum += directionalLights[i].color * specColor * specTerm * litFactor;
      }
    }
  #else
    ndotlMax = max(dot(N, mainLightDir), 0.0) * shadowMask;
    directLight = vec3(ndotlMax);
  #endif

  #if NUM_POINT_LIGHTS > 0
    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
      IncidentLight ptLight;
      getPointLightInfo(pointLights[i], -vViewPos, ptLight);
      if (ptLight.visible) {
        float ndl = max(dot(N, ptLight.direction), 0.0);
        directLight += ptLight.color * ndl;
        if (uSmoothness > 0.01 && ndl > 0.0) {
          vec3 H = normalize(ptLight.direction + V);
          float shininess = mix(4.0, 128.0, uSmoothness * uSmoothness);
          float specTerm = pow(max(dot(N, H), 0.0), shininess) * (uSmoothness * 0.85);
          vec3 specColor = (uIsMetallicWorkflow > 0.5)
            ? mix(vec3(0.04), albedoLinear, uMetallic)
            : uSpecularColorLinear;
          specAccum += ptLight.color * specColor * specTerm * ndl;
        }
      }
    }
  #endif

  #if NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
      IncidentLight spLight;
      getSpotLightInfo(spotLights[i], -vViewPos, spLight);
      if (spLight.visible) {
        float ndl = max(dot(N, spLight.direction), 0.0);
        directLight += spLight.color * ndl;
        if (uSmoothness > 0.01 && ndl > 0.0) {
          vec3 H = normalize(spLight.direction + V);
          float shininess = mix(4.0, 128.0, uSmoothness * uSmoothness);
          float specTerm = pow(max(dot(N, H), 0.0), shininess) * (uSmoothness * 0.85);
          vec3 specColor = (uIsMetallicWorkflow > 0.5)
            ? mix(vec3(0.04), albedoLinear, uMetallic)
            : uSpecularColorLinear;
          specAccum += spLight.color * specColor * specTerm * ndl;
        }
      }
    }
  #endif

  vec3 sceneAmbient = ambientLightColor;
  #if NUM_HEMI_LIGHTS > 0
    for (int i = 0; i < NUM_HEMI_LIGHTS; i++) {
      sceneAmbient += getHemisphereLightIrradiance(hemisphereLights[i], N);
    }
  #endif

  vec3 effectiveAmbient = mix(sceneAmbient, uAmbientConstantLinear, uAmbientConstantWeight);
  vec3 diffuseColor = albedoLinear * mix(1.0, 1.0 - uMetallic * 0.65, uIsMetallicWorkflow);

  vec3 rawLitLinear = diffuseColor * (directLight + effectiveAmbient) + specAccum;

  // Cel shading via HSV Value sampled through 1D Lighting Ramp
  vec3 rawLitSrgb = linearToSrgb(rawLitLinear);
  vec3 litHsv = rgbToHsv(rawLitSrgb);
  float rampCoord = clamp(litHsv.z * uLightingRampRange + uLightingRampOffset, 0.0, 1.0);
  vec3 rampSampleSrgb = texture(uLightingRampTex, vec2(rampCoord, 0.5)).rgb;

  vec3 celSrgb;
  if (uPixelated > 0.5) {
    // Preserve hue/saturation while applying stepped tonal ramp & shadow tint
    vec3 unlitSrgb = linearToSrgb(diffuseColor);
    vec3 shadedSrgb = unlitSrgb * rampSampleSrgb + linearToSrgb(specAccum);
    if (uShadowTintAlpha > 0.001) {
      float shadowAmount = clamp(1.0 - rampCoord * 1.4, 0.0, 1.0);
      vec3 shadowSrgb = linearToSrgb(uShadowTintLinear);
      shadedSrgb = mix(shadedSrgb, shadedSrgb * shadowSrgb * 1.5, shadowAmount * uShadowTintAlpha);
    }
    celSrgb = shadedSrgb;
  } else {
    celSrgb = rawLitSrgb;
  }

  // Stepped cel rim light (sharp fresnel edge highlight gated by main light alignment)
  vec3 rimSrgb = vec3(0.0);
  if (uRimIntensity > 0.001) {
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, max(0.5, uRimPower));
    float dirGate = smoothstep(-0.25, 0.55, dot(N, mainLightDir)) * (0.35 + 0.65 * shadowMask);
    float rimStep = step(uRimThreshold, fresnel * dirGate);
    rimSrgb = linearToSrgb(uRimColorLinear * uRimIntensity * rimStep);
  }

  // Add HDR emission + stepped rim light
  vec3 emissionSample = (uHasEmissionMap > 0.5) ? texture(uEmissionMap, vUv).rgb : vec3(1.0);
  vec3 emissiveTint = mix(vec3(1.0), vVertexColor.rgb, uEmissiveVertexColorWeight);
  vec3 emitLinear = emissionSample * uEmissionColorLinear * emissiveTint * uEmissionIntensity;
  vec3 emissionSrgb = linearToSrgb(emitLinear);
  vec3 combinedSrgb = celSrgb + rimSrgb + emissionSrgb;

  // Color grading via dual Palette LUT + 4x4/8x8 ordered dither
  if (uUseColorGrading > 0.5) {
    combinedSrgb = samplePaletteDualLut(combinedSrgb, ditherCoord);
  }

  // Linear normalized camera depth in [0, 1] across both ortho & perspective
  float linearDepth = clamp((vViewPos.z - uCameraNear) / max(1e-5, uCameraFar - uCameraNear), 0.0, 1.0);
  float clampedP = clamp(P, 1.0, 15.0);
  float wideFlag = (uOutlineWidthSteps >= 1.5) ? 16.0 : 0.0;
  float encodedMetaG = (uPixelated > 0.5) ? clamp((clampedP + wideFlag) / 32.0, 0.0, 1.0) : 0.0;

  float emitBoost = max(emitLinear.r, max(emitLinear.g, emitLinear.b));
  float encodedAlpha = (uEncodeBloomAlpha > 0.5)
    ? (0.5 + 0.5 * clamp(emitBoost / 1.5, 0.0, 1.0))
    : 1.0;

  gColor = vec4(combinedSrgb, encodedAlpha);
  gOutline = (uPixelated > 0.5)
    ? vec4(uOutlineColorSrgb, uOutlineAlpha)
    : vec4(0.0);
  gMeta = vec4(
    clamp(uObjectId / 255.0, 0.0, 1.0),
    encodedMetaG,
    expansionActive ? 1.0 : 0.0,
    clamp(uEdgeBevelWeight, 0.0, 1.0)
  );
  gNormalDepth = vec4(
    octEncode(N),
    clamp(uEdgeHighlight, 0.0, 1.0),
    clamp(linearDepth, 0.0, 1.0)
  );
}
`;
