import * as THREE from 'three';
import { OBJECT_FRAGMENT_SHADER, OBJECT_VERTEX_SHADER } from './shaders/objectShader';
import type { PixelizerMaterialOptions, ShadingWorkflow } from './types';

let fallbackWhiteTex: THREE.DataTexture | null = null;
function getFallbackWhiteTexture(): THREE.DataTexture {
  if (!fallbackWhiteTex) {
    const data = new Uint8Array([255, 255, 255, 255]);
    fallbackWhiteTex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    fallbackWhiteTex.needsUpdate = true;
  }
  return fallbackWhiteTex;
}

export interface PixelizerMaterialResources {
  lightingRampTex: THREE.Texture;
  palettePrimaryTex: THREE.Texture;
  paletteSecondaryTex: THREE.Texture;
  paletteLutSize: number;
  ditherTex: THREE.Texture;
}

/**
 * Custom WebGL2 GLSL3 MRT Material replicating ProPixelizer's UberShader:
 * - Sparse Pixel Expansion seed clipping (Attempt #3)
 * - Cel shading via HSV Value sampled through 1D Lighting Ramp
 * - Specular or Metallic workflow + Shadow tint + Constant/Scene Ambient blend
 * - Dual Palette LUT color grading + 4x4 Ordered Dithering & Dithered Transparency
 * - Per-object ID, Outline Color/Alpha, Edge Highlight & Bevel Weight metadata output
 */
export class PixelizerMaterial extends THREE.ShaderMaterial {
  public options: Required<PixelizerMaterialOptions>;

  constructor(
    options: PixelizerMaterialOptions = {},
    sharedResources?: PixelizerMaterialResources
  ) {
    const white = getFallbackWhiteTexture();
    const resolved: Required<PixelizerMaterialOptions> = {
      pixelated: options.pixelated ?? true,
      pixelSize: options.pixelSize ?? 3,
      objectId: options.objectId ?? 1,
      outlineColor: options.outlineColor ?? '#14101c',
      outlineAlpha: options.outlineAlpha ?? 1.0,
      edgeHighlight: options.edgeHighlight ?? 0.35,
      edgeBevelWeight: options.edgeBevelWeight ?? 0.65,
      baseColor: options.baseColor ?? '#ffffff',
      alpha: options.alpha ?? 1.0,
      alphaClipThreshold: options.alphaClipThreshold ?? 0.1,
      useDitheredTransparency: options.useDitheredTransparency ?? true,
      albedoMap: options.albedoMap ?? null,
      normalMap: options.normalMap ?? null,
      normalScale: options.normalScale ?? 1.0,
      emissionMap: options.emissionMap ?? null,
      emissionColor: options.emissionColor ?? '#000000',
      emissionIntensity: options.emissionIntensity ?? 1.0,
      diffuseVertexColorWeight: options.diffuseVertexColorWeight ?? 1.0,
      emissiveVertexColorWeight: options.emissiveVertexColorWeight ?? 0.0,
      workflow: options.workflow ?? 'specular',
      specularColor: options.specularColor ?? '#333333',
      metallic: options.metallic ?? 0.0,
      smoothness: options.smoothness ?? 0.25,
      lightingRampRange: options.lightingRampRange ?? 1.0,
      lightingRampOffset: options.lightingRampOffset ?? 0.0,
      shadowTint: options.shadowTint ?? '#2e2b4f',
      shadowTintAlpha: options.shadowTintAlpha ?? 0.25,
      ambientConstantColor: options.ambientConstantColor ?? '#485068',
      ambientConstantWeight: options.ambientConstantWeight ?? 0.35,
      useColorGrading: options.useColorGrading ?? true,
      paletteId: options.paletteId ?? '',
      ditherPatternId: options.ditherPatternId ?? '',
    };

    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      {
        uPixelated: { value: resolved.pixelated ? 1 : 0 },
        uPixelSize: { value: resolved.pixelSize },
        uUsePixelExpansion: { value: 1 },
        uPixelGridOriginPx: { value: new THREE.Vector2(0, 0) },
        uObjectId: { value: resolved.objectId },
        uOutlineColorSrgb: { value: new THREE.Vector3(0.08, 0.06, 0.11) },
        uOutlineAlpha: { value: resolved.outlineAlpha },
        uEdgeHighlight: { value: resolved.edgeHighlight },
        uEdgeBevelWeight: { value: resolved.edgeBevelWeight },

        uBaseColorLinear: { value: new THREE.Color(resolved.baseColor) },
        uAlpha: { value: resolved.alpha },
        uAlphaClipThreshold: { value: resolved.alphaClipThreshold },
        uUseDitheredTransparency: { value: resolved.useDitheredTransparency ? 1 : 0 },
        uHasAlbedoMap: { value: resolved.albedoMap ? 1 : 0 },
        uAlbedoMap: { value: resolved.albedoMap ?? white },
        uHasNormalMap: { value: resolved.normalMap ? 1 : 0 },
        uNormalMap: { value: resolved.normalMap ?? white },
        uNormalScale: { value: resolved.normalScale },
        uHasEmissionMap: { value: resolved.emissionMap ? 1 : 0 },
        uEmissionMap: { value: resolved.emissionMap ?? white },
        uEmissionColorLinear: { value: new THREE.Color(resolved.emissionColor) },
        uEmissionIntensity: { value: resolved.emissionIntensity },
        uDiffuseVertexColorWeight: { value: resolved.diffuseVertexColorWeight },
        uEmissiveVertexColorWeight: { value: resolved.emissiveVertexColorWeight },

        uIsMetallicWorkflow: { value: resolved.workflow === 'metallic' ? 1 : 0 },
        uSpecularColorLinear: { value: new THREE.Color(resolved.specularColor) },
        uMetallic: { value: resolved.metallic },
        uSmoothness: { value: resolved.smoothness },
        uLightingRampRange: { value: resolved.lightingRampRange },
        uLightingRampOffset: { value: resolved.lightingRampOffset },
        uShadowTintLinear: { value: new THREE.Color(resolved.shadowTint) },
        uShadowTintAlpha: { value: resolved.shadowTintAlpha },
        uAmbientConstantLinear: { value: new THREE.Color(resolved.ambientConstantColor) },
        uAmbientConstantWeight: { value: resolved.ambientConstantWeight },

        uLightingRampTex: { value: sharedResources?.lightingRampTex ?? white },
        uUseColorGrading: { value: resolved.useColorGrading ? 1 : 0 },
        uPalettePrimaryTex: { value: sharedResources?.palettePrimaryTex ?? white },
        uPaletteSecondaryTex: { value: sharedResources?.paletteSecondaryTex ?? white },
        uPaletteLutSize: { value: sharedResources?.paletteLutSize ?? 16 },
        uDitherTex: { value: sharedResources?.ditherTex ?? white },

        uCameraNear: { value: 0.1 },
        uCameraFar: { value: 100.0 },
        uIsOrthographic: { value: 1.0 },
      },
    ]);

    super({
      glslVersion: THREE.GLSL3,
      vertexShader: OBJECT_VERTEX_SHADER,
      fragmentShader: OBJECT_FRAGMENT_SHADER,
      uniforms,
      lights: true,
      transparent: false,
      depthTest: true,
      depthWrite: true,
    });

    this.options = resolved;
    this.syncUniforms();
  }

  public updateOptions(patch: Partial<PixelizerMaterialOptions>): void {
    Object.assign(this.options, patch);
    this.syncUniforms();
  }

  public setWorkflow(workflow: ShadingWorkflow): void {
    this.options.workflow = workflow;
    this.syncUniforms();
  }

  public applySharedResources(resources: PixelizerMaterialResources): void {
    this.uniforms.uLightingRampTex.value = resources.lightingRampTex;
    this.uniforms.uPalettePrimaryTex.value = resources.palettePrimaryTex;
    this.uniforms.uPaletteSecondaryTex.value = resources.paletteSecondaryTex;
    this.uniforms.uPaletteLutSize.value = resources.paletteLutSize;
    this.uniforms.uDitherTex.value = resources.ditherTex;
  }

  public syncUniforms(): void {
    const o = this.options;
    const white = getFallbackWhiteTexture();

    this.uniforms.uPixelated.value = o.pixelated ? 1 : 0;
    this.uniforms.uPixelSize.value = o.pixelSize;
    this.uniforms.uObjectId.value = o.objectId;

    const outCol = new THREE.Color(o.outlineColor);
    const outSrgb = new THREE.Color();
    outCol.getRGB(outSrgb, THREE.SRGBColorSpace);
    (this.uniforms.uOutlineColorSrgb.value as THREE.Vector3).set(
      outSrgb.r,
      outSrgb.g,
      outSrgb.b
    );

    this.uniforms.uOutlineAlpha.value = o.outlineAlpha;
    this.uniforms.uEdgeHighlight.value = o.edgeHighlight;
    this.uniforms.uEdgeBevelWeight.value = o.edgeBevelWeight;

    (this.uniforms.uBaseColorLinear.value as THREE.Color).set(o.baseColor);
    this.uniforms.uAlpha.value = o.alpha;
    this.uniforms.uAlphaClipThreshold.value = o.alphaClipThreshold;
    this.uniforms.uUseDitheredTransparency.value = o.useDitheredTransparency ? 1 : 0;

    this.uniforms.uHasAlbedoMap.value = o.albedoMap ? 1 : 0;
    this.uniforms.uAlbedoMap.value = o.albedoMap ?? white;
    this.uniforms.uHasNormalMap.value = o.normalMap ? 1 : 0;
    this.uniforms.uNormalMap.value = o.normalMap ?? white;
    this.uniforms.uNormalScale.value = o.normalScale;
    this.uniforms.uHasEmissionMap.value = o.emissionMap ? 1 : 0;
    this.uniforms.uEmissionMap.value = o.emissionMap ?? white;

    (this.uniforms.uEmissionColorLinear.value as THREE.Color).set(o.emissionColor);
    this.uniforms.uEmissionIntensity.value = o.emissionIntensity;
    this.uniforms.uDiffuseVertexColorWeight.value = o.diffuseVertexColorWeight;
    this.uniforms.uEmissiveVertexColorWeight.value = o.emissiveVertexColorWeight;

    this.uniforms.uIsMetallicWorkflow.value = o.workflow === 'metallic' ? 1 : 0;
    (this.uniforms.uSpecularColorLinear.value as THREE.Color).set(o.specularColor);
    this.uniforms.uMetallic.value = o.metallic;
    this.uniforms.uSmoothness.value = o.smoothness;
    this.uniforms.uLightingRampRange.value = o.lightingRampRange;
    this.uniforms.uLightingRampOffset.value = o.lightingRampOffset;

    (this.uniforms.uShadowTintLinear.value as THREE.Color).set(o.shadowTint);
    this.uniforms.uShadowTintAlpha.value = o.shadowTintAlpha;
    (this.uniforms.uAmbientConstantLinear.value as THREE.Color).set(o.ambientConstantColor);
    this.uniforms.uAmbientConstantWeight.value = o.ambientConstantWeight;

    this.uniforms.uUseColorGrading.value = o.useColorGrading ? 1 : 0;
  }
}

/**
 * Converts a standard Three.js MeshStandardMaterial / MeshPhongMaterial / MeshBasicMaterial
 * from an imported GLB/OBJ/FBX into a PixelizerMaterial preserving maps, vertexColors, side, and colors.
 */
export function convertStandardMaterialToPixelizer(
  src: THREE.Material | null | undefined,
  defaults: PixelizerMaterialOptions,
  sharedResources?: PixelizerMaterialResources,
  hasVertexColorAttr = false
): PixelizerMaterial {
  const opts: PixelizerMaterialOptions = { ...defaults };

  if (src && 'color' in src && src.color instanceof THREE.Color) {
    opts.baseColor = '#' + src.color.getHexString();
  }
  if (src && 'map' in src && src.map instanceof THREE.Texture) {
    opts.albedoMap = src.map;
  }
  if (src && 'normalMap' in src && src.normalMap instanceof THREE.Texture) {
    opts.normalMap = src.normalMap;
  }
  if (src && 'emissive' in src && src.emissive instanceof THREE.Color) {
    opts.emissionColor = '#' + src.emissive.getHexString();
  }
  if (src && 'emissiveMap' in src && src.emissiveMap instanceof THREE.Texture) {
    opts.emissionMap = src.emissiveMap;
  }
  if (src && 'emissiveIntensity' in src && typeof src.emissiveIntensity === 'number') {
    opts.emissionIntensity = src.emissiveIntensity;
  }
  if (src && 'metalness' in src && typeof src.metalness === 'number') {
    opts.metallic = src.metalness;
    if (src.metalness > 0.15) opts.workflow = 'metallic';
  }
  if (src && 'roughness' in src && typeof src.roughness === 'number') {
    opts.smoothness = Math.max(0, Math.min(1, 1.0 - src.roughness));
  }
  if (src && 'opacity' in src && typeof src.opacity === 'number') {
    opts.alpha = src.opacity;
  }
  if (src && 'alphaTest' in src && typeof src.alphaTest === 'number' && src.alphaTest > 0) {
    opts.alphaClipThreshold = src.alphaTest;
  }

  const mat = new PixelizerMaterial(opts, sharedResources);
  if (src) {
    mat.side = src.side;
    if (src.vertexColors && hasVertexColorAttr) {
      mat.vertexColors = true;
    }
  } else if (hasVertexColorAttr) {
    mat.vertexColors = true;
  }
  return mat;
}
