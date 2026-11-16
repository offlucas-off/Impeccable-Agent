import * as THREE from 'three';
import { BUILTIN_DITHER_PATTERNS, createDitherTexture } from './dither';
import { BUILTIN_LIGHTING_RAMPS, createLightingRampTexture } from './lightingRamps';
import { BUILTIN_PALETTES, buildPaletteLutPair, type PaletteLutPair } from './palettes';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from './PixelizerMaterial';
import {
  EXPANSION_FRAGMENT_SHADER,
  FULLSCREEN_VERTEX_SHADER,
} from './shaders/expansionShader';
import { OUTLINE_EDGE_FRAGMENT_SHADER } from './shaders/outlineEdgeShader';
import { UPSCALE_FRAGMENT_SHADER } from './shaders/upscaleShader';
import {
  computeCameraGrid,
  projectWorldToBufferPixel,
  restoreObjectTransform,
  snapCameraToPixelGrid,
  snapObjectForRender,
  type ComputedCameraGrid,
  type SavedTransform,
} from './snapping';
import type {
  CameraSnapConfig,
  ColorPaletteConfig,
  DitherPattern4x4,
  LightingRampConfig,
  PipelineConfig,
  SnapOptions,
} from './types';

export interface PixelizerObjectAttachment {
  snap: SnapOptions;
  gridReference?: THREE.Object3D | null;
}

const MRT_CLEAR_VERTEX = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const MRT_CLEAR_FRAGMENT = /* glsl */ `
precision highp float;
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gOutline;
layout(location = 2) out vec4 gMeta;
layout(location = 3) out vec4 gNormalDepth;

uniform vec3 uBgColorSrgb;
uniform float uBgAlpha;

void main() {
  gColor = vec4(uBgColorSrgb, uBgAlpha);
  gOutline = vec4(0.0);
  gMeta = vec4(0.0);
  gNormalDepth = vec4(0.5, 0.5, 0.5, 1.0);
}
`;

/**
 * Multi-pass WebGL2 MRT Pixelizer Pipeline implementing ProPixelizer's architecture:
 *  Pass 0: Shadow Maps (Three.js standard solid mesh shadow pass)
 *  Pass 1: MRT Scene + Metadata (Color, Outline Color/Alpha, ID/PixelSize/Seed/Bevel, OctNormal/Edge/Depth)
 *  Pass 2: Pixel Expansion (Attempt #3 nearest-depth NxN macropixel expansion)
 *  Pass 3: Outlines + Depth/Normal Creases + Light-Reactive Bevel Edges
 *  Pass 4: Pixel Art Anti-Aliasing Upscale + Camera Subpixel Motion + A/B Split View
 */
export class PixelizerPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  public pipelineConfig: PipelineConfig;
  public cameraConfig: CameraSnapConfig;

  private mrtTarget: THREE.WebGLRenderTarget | null = null;
  private expansionTarget: THREE.WebGLRenderTarget | null = null;
  private outlinedTarget: THREE.WebGLRenderTarget | null = null;
  private rawTarget: THREE.WebGLRenderTarget | null = null;

  private quadGeo: THREE.BufferGeometry;
  private fsScene: THREE.Scene;
  private fsCamera: THREE.OrthographicCamera;
  private fsQuad: THREE.Mesh;

  private clearMat: THREE.ShaderMaterial;
  private expansionMat: THREE.ShaderMaterial;
  private outlineMat: THREE.ShaderMaterial;
  private upscaleMat: THREE.ShaderMaterial;

  // Active GPU lookup resources
  private ditherMap = new Map<string, { config: DitherPattern4x4; tex: THREE.DataTexture }>();
  private paletteMap = new Map<string, { config: ColorPaletteConfig; lut: PaletteLutPair }>();
  private rampMap = new Map<string, { config: LightingRampConfig; tex: THREE.DataTexture }>();

  public activePaletteId = 'endesga32';
  public activeDitherId = 'bayer4x4';
  public activeRampId = 'three_band';

  private lastGrid: ComputedCameraGrid | null = null;
  private renderWidth = 1;
  private renderHeight = 1;

  constructor(
    renderer: THREE.WebGLRenderer,
    pipelineConfig?: Partial<PipelineConfig>,
    cameraConfig?: Partial<CameraSnapConfig>
  ) {
    this.renderer = renderer;
    // Output shader produces final calibrated sRGB directly to avoid double-gamma on LUT palettes
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;

    this.pipelineConfig = {
      filterMode: 'only_pixelized',
      usePixelExpansion: true,
      useDepthTestForIdOutlines: true,
      idDepthThreshold: 0.008,
      useNormalsForEdgeDetection: true,
      normalEdgeThreshold: 0.22,
      useDepthTestForEdges: true,
      edgeDepthThreshold: 0.012,
      edgeHighlightStrength: 0.9,
      edgeBevelStrength: 1.0,
      lightDirection: [0.55, 0.85, 0.5],
      lightColor: '#fff6e8',
      lightIntensity: 1.35,
      ambientSkyColor: '#7f93c2',
      ambientIntensity: 0.55,
      backgroundColor: '#13161f',
      backgroundTransparent: false,
      debugView: 'final',
      splitCompare: false,
      splitPosition: 0.5,
      ...pipelineConfig,
    };

    this.cameraConfig = {
      orthographic: true,
      orthoHeight: 6.5,
      perspectiveFov: 38,
      resolutionMode: 'world_space_pixel_size',
      worldSpacePixelSize: 0.012,
      downscaleRatio: 3,
      targetHeight: 240,
      snapCameraPosition: true,
      cameraSubpixelMotion: false,
      upscaleMode: 'pixel_art_aa',
      ...cameraConfig,
    };

    // Fullscreen clip-space quad [-1, 1]
    this.quadGeo = new THREE.PlaneGeometry(2, 2);
    this.fsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.fsScene = new THREE.Scene();

    this.clearMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: MRT_CLEAR_VERTEX,
      fragmentShader: MRT_CLEAR_FRAGMENT,
      uniforms: {
        uBgColorSrgb: { value: new THREE.Vector3(0.07, 0.08, 0.12) },
        uBgAlpha: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.expansionMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: FULLSCREEN_VERTEX_SHADER,
      fragmentShader: EXPANSION_FRAGMENT_SHADER,
      uniforms: {
        tColor: { value: null },
        tOutline: { value: null },
        tMeta: { value: null },
        tNormalDepth: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uSearchRadius: { value: 3 },
        uEnabled: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.outlineMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: FULLSCREEN_VERTEX_SHADER,
      fragmentShader: OUTLINE_EDGE_FRAGMENT_SHADER,
      uniforms: {
        tColor: { value: null },
        tOutline: { value: null },
        tMeta: { value: null },
        tNormalDepth: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uUseDepthTestForId: { value: 1.0 },
        uIdDepthThreshold: { value: 0.008 },
        uUseNormalsForEdges: { value: 1.0 },
        uNormalEdgeThreshold: { value: 0.22 },
        uUseDepthTestForEdges: { value: 1.0 },
        uEdgeDepthThreshold: { value: 0.012 },
        uEdgeHighlightStrength: { value: 0.9 },
        uEdgeBevelStrength: { value: 1.0 },
        uLightDirView: { value: new THREE.Vector3(0.4, 0.8, 0.4).normalize() },
        uLightColorSrgb: { value: new THREE.Vector3(1.0, 0.96, 0.9) },
        uDebugView: { value: 0.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.upscaleMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: FULLSCREEN_VERTEX_SHADER,
      fragmentShader: UPSCALE_FRAGMENT_SHADER,
      uniforms: {
        tPixelized: { value: null },
        tRaw3D: { value: null },
        uLowResSize: { value: new THREE.Vector2(1, 1) },
        uScreenSize: { value: new THREE.Vector2(1, 1) },
        uSubpixelOffsetUv: { value: new THREE.Vector2(0, 0) },
        uUsePixelArtAA: { value: 1.0 },
        uSplitCompare: { value: 0.0 },
        uSplitPosition: { value: 0.5 },
        uShowRawOnly: { value: 0.0 },
        uTransparentBg: { value: 0.0 },
        uBgColorSrgb: { value: new THREE.Vector3(0.07, 0.08, 0.12) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.fsQuad = new THREE.Mesh(this.quadGeo, this.clearMat);
    this.fsQuad.frustumCulled = false;
    this.fsScene.add(this.fsQuad);

    this.initDefaultResources();
  }

  private initDefaultResources(): void {
    for (const d of BUILTIN_DITHER_PATTERNS) {
      this.ditherMap.set(d.id, { config: d, tex: createDitherTexture(d) });
    }
    for (const r of BUILTIN_LIGHTING_RAMPS) {
      this.rampMap.set(r.id, { config: r, tex: createLightingRampTexture(r) });
    }
    for (const p of BUILTIN_PALETTES) {
      this.paletteMap.set(p.id, { config: p, lut: buildPaletteLutPair(p) });
    }
  }

  public getDitherPatterns(): DitherPattern4x4[] {
    return [...this.ditherMap.values()].map((v) => v.config);
  }

  public getPalettes(): ColorPaletteConfig[] {
    return [...this.paletteMap.values()].map((v) => v.config);
  }

  public getLightingRamps(): LightingRampConfig[] {
    return [...this.rampMap.values()].map((v) => v.config);
  }

  public upsertDitherPattern(pattern: DitherPattern4x4): void {
    const existing = this.ditherMap.get(pattern.id);
    if (existing) existing.tex.dispose();
    this.ditherMap.set(pattern.id, {
      config: { ...pattern, thresholds: [...pattern.thresholds] },
      tex: createDitherTexture(pattern),
    });
  }

  public upsertPalette(config: ColorPaletteConfig): PaletteLutPair {
    const existing = this.paletteMap.get(config.id);
    if (existing) {
      existing.lut.primaryTex.dispose();
      existing.lut.secondaryTex.dispose();
    }
    const lut = buildPaletteLutPair(config);
    this.paletteMap.set(config.id, {
      config: { ...config, colors: [...config.colors] },
      lut,
    });
    return lut;
  }

  public getActivePaletteEntry(): { config: ColorPaletteConfig; lut: PaletteLutPair } {
    return (
      this.paletteMap.get(this.activePaletteId) ??
      this.paletteMap.values().next().value!
    );
  }

  public getActiveDitherEntry(): { config: DitherPattern4x4; tex: THREE.DataTexture } {
    return (
      this.ditherMap.get(this.activeDitherId) ??
      this.ditherMap.values().next().value!
    );
  }

  public getActiveRampEntry(): { config: LightingRampConfig; tex: THREE.DataTexture } {
    return (
      this.rampMap.get(this.activeRampId) ??
      this.rampMap.values().next().value!
    );
  }

  public getSharedResourcesForMaterial(
    paletteId?: string,
    ditherId?: string
  ): PixelizerMaterialResources {
    const pal =
      (paletteId ? this.paletteMap.get(paletteId) : undefined) ??
      this.getActivePaletteEntry();
    const dith =
      (ditherId ? this.ditherMap.get(ditherId) : undefined) ??
      this.getActiveDitherEntry();
    const ramp = this.getActiveRampEntry();

    return {
      lightingRampTex: ramp.tex,
      palettePrimaryTex: pal.lut.primaryTex,
      paletteSecondaryTex: pal.lut.secondaryTex,
      paletteLutSize: pal.lut.size,
      ditherTex: dith.tex,
    };
  }

  public getLastGrid(): ComputedCameraGrid | null {
    return this.lastGrid;
  }

  private supportsColorBufferFloat(): boolean {
    const gl = this.renderer.getContext();
    return Boolean(
      gl.getExtension('EXT_color_buffer_float') ||
        gl.getExtension('EXT_color_buffer_half_float')
    );
  }

  private ensureTargets(passW: number, passH: number, screenW: number, screenH: number): void {
    const needsPassResize =
      !this.mrtTarget ||
      this.mrtTarget.width !== passW ||
      this.mrtTarget.height !== passH;

    const floatType = this.supportsColorBufferFloat()
      ? THREE.HalfFloatType
      : THREE.UnsignedByteType;

    if (needsPassResize) {
      this.mrtTarget?.dispose();
      this.expansionTarget?.dispose();
      this.outlinedTarget?.dispose();

      // 4 MRT Attachments (WebGL2 minimum guarantee = 4)
      this.mrtTarget = new THREE.WebGLRenderTarget(passW, passH, {
        count: 4,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: floatType,
        depthBuffer: true,
        stencilBuffer: false,
      });
      this.mrtTarget.textures[0].type = floatType;
      this.mrtTarget.textures[1].type = THREE.UnsignedByteType;
      this.mrtTarget.textures[2].type = THREE.UnsignedByteType;
      this.mrtTarget.textures[3].type = floatType;

      this.expansionTarget = new THREE.WebGLRenderTarget(passW, passH, {
        count: 4,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: floatType,
        depthBuffer: false,
        stencilBuffer: false,
      });
      this.expansionTarget.textures[0].type = floatType;
      this.expansionTarget.textures[1].type = THREE.UnsignedByteType;
      this.expansionTarget.textures[2].type = THREE.UnsignedByteType;
      this.expansionTarget.textures[3].type = floatType;

      this.outlinedTarget = new THREE.WebGLRenderTarget(passW, passH, {
        minFilter:
          this.cameraConfig.upscaleMode === 'pixel_art_aa'
            ? THREE.LinearFilter
            : THREE.NearestFilter,
        magFilter:
          this.cameraConfig.upscaleMode === 'pixel_art_aa'
            ? THREE.LinearFilter
            : THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        depthBuffer: false,
        stencilBuffer: false,
      });
    } else if (this.outlinedTarget) {
      const targetFilter =
        this.cameraConfig.upscaleMode === 'pixel_art_aa'
          ? THREE.LinearFilter
          : THREE.NearestFilter;
      if (this.outlinedTarget.texture.magFilter !== targetFilter) {
        this.outlinedTarget.texture.minFilter = targetFilter;
        this.outlinedTarget.texture.magFilter = targetFilter;
        this.outlinedTarget.texture.needsUpdate = true;
      }
    }

    const needsRaw =
      this.pipelineConfig.splitCompare || this.pipelineConfig.debugView === 'raw_3d';
    if (
      needsRaw &&
      (!this.rawTarget ||
        this.rawTarget.width !== screenW ||
        this.rawTarget.height !== screenH)
    ) {
      this.rawTarget?.dispose();
      this.rawTarget = new THREE.WebGLRenderTarget(screenW, screenH, {
        count: 4,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        depthBuffer: true,
        stencilBuffer: false,
      });
      this.rawTarget.textures[3].type = floatType;
    }
  }

  public setSize(width: number, height: number): void {
    this.renderWidth = Math.max(1, Math.floor(width));
    this.renderHeight = Math.max(1, Math.floor(height));
    this.renderer.setSize(this.renderWidth, this.renderHeight, false);
  }

  /**
   * Executes the full 4-pass ProPixelizer-inspired rendering pipeline.
   * Snaps camera & registered Pixelizer objects before drawing, then cleanly restores transforms.
   */
  public render(
    scene: THREE.Scene,
    camera: THREE.Camera,
    outputTarget: THREE.WebGLRenderTarget | null = null
  ): void {
    const screenW = outputTarget ? outputTarget.width : this.renderWidth;
    const screenH = outputTarget ? outputTarget.height : this.renderHeight;
    const cfg = this.pipelineConfig;
    const camCfg = this.cameraConfig;

    const grid = computeCameraGrid(screenW, screenH, camCfg);
    this.lastGrid = grid;

    // Pass target resolution: lowRes in full_scene mode, screen CSS resolution in only_pixelized hybrid mode
    const passW = cfg.filterMode === 'full_scene' ? grid.lowResWidth : screenW;
    const passH = cfg.filterMode === 'full_scene' ? grid.lowResHeight : screenH;

    this.ensureTargets(passW, passH, screenW, screenH);
    if (!this.mrtTarget || !this.expansionTarget || !this.outlinedTarget) return;

    // Update orthographic frustum if requested
    if (camera instanceof THREE.OrthographicCamera) {
      const aspect = screenW / Math.max(1, screenH);
      const halfH = grid.effectiveOrthoHeight * 0.5;
      const halfW = halfH * aspect;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = screenW / Math.max(1, screenH);
      camera.fov = camCfg.perspectiveFov;
      camera.updateProjectionMatrix();
    }

    // 1. Optional Raw 3D pass for A/B split compare or Raw debug view (before snapping)
    const needsRaw = cfg.splitCompare || cfg.debugView === 'raw_3d';
    const materialsList: {
      mat: PixelizerMaterial;
      mesh: THREE.Mesh;
      origPixelated: boolean;
      origExpand: number;
    }[] = [];

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m instanceof PixelizerMaterial) {
            materialsList.push({
              mat: m,
              mesh: obj,
              origPixelated: m.options.pixelated,
              origExpand: m.uniforms.uUsePixelExpansion.value,
            });
          }
        }
      }
    });

    const bgSrgb = new THREE.Color();
    new THREE.Color(cfg.backgroundColor).getRGB(bgSrgb, THREE.SRGBColorSpace);
    const bgAlpha = cfg.backgroundTransparent ? 0.0 : 1.0;

    if (needsRaw && this.rawTarget) {
      for (const item of materialsList) {
        item.mat.uniforms.uPixelated.value = 0;
        item.mat.uniforms.uUsePixelExpansion.value = 0;
        item.mat.uniforms.uCameraNear.value =
          (camera as THREE.OrthographicCamera | THREE.PerspectiveCamera).near ?? 0.1;
        item.mat.uniforms.uCameraFar.value =
          (camera as THREE.OrthographicCamera | THREE.PerspectiveCamera).far ?? 100;
        item.mat.uniforms.uIsOrthographic.value =
          camera instanceof THREE.OrthographicCamera ? 1 : 0;
      }

      this.renderer.setRenderTarget(this.rawTarget);
      this.renderer.clearDepth();
      this.clearMat.uniforms.uBgColorSrgb.value.set(bgSrgb.r, bgSrgb.g, bgSrgb.b);
      this.clearMat.uniforms.uBgAlpha.value = bgAlpha;
      this.fsQuad.material = this.clearMat;
      this.renderer.render(this.fsScene, this.fsCamera);
      this.renderer.autoClear = false;
      this.renderer.render(scene, camera);
      this.renderer.autoClear = true;
    }

    // 2. Snap camera & snappable objects (eliminates pixel creep)
    const effectiveWorldPixelSize =
      cfg.filterMode === 'full_scene'
        ? grid.worldPixelSize
        : grid.effectiveOrthoHeight / Math.max(1, passH);

    const savedCamPos = snapCameraToPixelGrid(
      camera,
      grid,
      camCfg,
      effectiveWorldPixelSize
    );
    const savedObjects: { obj: THREE.Object3D; saved: SavedTransform }[] = [];

    scene.traverse((obj) => {
      const attachment = obj.userData.pixelizer as PixelizerObjectAttachment | undefined;
      if (attachment) {
        const saved = snapObjectForRender(
          obj,
          camera,
          effectiveWorldPixelSize,
          attachment.snap,
          attachment.gridReference
        );
        savedObjects.push({ obj, saved });
      }
    });
    scene.updateMatrixWorld(true);

    // 3. Synchronize materials with active palette, dither, ramp, grid origin, and mode
    let maxPixelSize = 1;
    const isSeedDebug = cfg.debugView === 'seed_dither';
    const expansionAllowed =
      (cfg.usePixelExpansion && cfg.filterMode === 'only_pixelized') ||
      (cfg.usePixelExpansion && cfg.filterMode === 'full_scene' && camCfg.downscaleRatio <= 2) ||
      isSeedDebug;

    const tempVec = new THREE.Vector3();

    for (const item of materialsList) {
      const m = item.mat;
      const res = this.getSharedResourcesForMaterial(
        m.options.paletteId,
        m.options.ditherPatternId
      );
      m.applySharedResources(res);

      const isPix = cfg.filterMode === 'full_scene' ? true : item.origPixelated;
      const effectiveP =
        cfg.filterMode === 'full_scene'
          ? (cfg.usePixelExpansion ? Math.min(3, item.origPixelated ? m.options.pixelSize : 1) : 1)
          : (isPix ? m.options.pixelSize : 0);

      if (effectiveP > maxPixelSize) maxPixelSize = effectiveP;

      m.uniforms.uPixelated.value = isPix ? 1 : 0;
      m.uniforms.uPixelSize.value = Math.max(1, effectiveP);
      m.uniforms.uUsePixelExpansion.value = expansionAllowed && effectiveP > 1 ? 1 : 0;
      m.uniforms.uCameraNear.value =
        (camera as THREE.OrthographicCamera | THREE.PerspectiveCamera).near ?? 0.1;
      m.uniforms.uCameraFar.value =
        (camera as THREE.OrthographicCamera | THREE.PerspectiveCamera).far ?? 100;
      m.uniforms.uIsOrthographic.value =
        camera instanceof THREE.OrthographicCamera ? 1 : 0;

      // Project object's (or gridReference's) world origin to pixel buffer coordinates
      const attachment = item.mesh.userData.pixelizer as PixelizerObjectAttachment | undefined;
      const refObj =
        attachment?.snap.alignPixelGrid && attachment.gridReference
          ? attachment.gridReference
          : item.mesh;
      refObj.getWorldPosition(tempVec);
      const originPx = projectWorldToBufferPixel(tempVec, camera, passW, passH);
      (m.uniforms.uPixelGridOriginPx.value as THREE.Vector2).copy(originPx);
    }

    // 4. Pass 1: Clear MRT + Render 3D Scene (shadows auto-updated by Three.js)
    this.renderer.setRenderTarget(this.mrtTarget);
    this.renderer.clearDepth();
    this.clearMat.uniforms.uBgColorSrgb.value.set(bgSrgb.r, bgSrgb.g, bgSrgb.b);
    this.clearMat.uniforms.uBgAlpha.value = bgAlpha;
    this.fsQuad.material = this.clearMat;
    this.renderer.render(this.fsScene, this.fsCamera);

    this.renderer.autoClear = false;
    this.renderer.render(scene, camera);
    this.renderer.autoClear = true;

    // Restore object & camera transforms immediately after scene render
    for (let i = savedObjects.length - 1; i >= 0; i--) {
      restoreObjectTransform(savedObjects[i].obj, savedObjects[i].saved);
    }
    if (savedCamPos) {
      camera.position.copy(savedCamPos);
      camera.updateMatrixWorld();
    }
    for (const item of materialsList) {
      item.mat.uniforms.uPixelated.value = item.origPixelated ? 1 : 0;
      item.mat.uniforms.uUsePixelExpansion.value = item.origExpand;
    }

    // 5. Pass 2: Pixel Expansion (Attempt #3)
    const searchRadius = Math.min(4, Math.max(1, Math.ceil(maxPixelSize * 0.5) + 1));
    this.expansionMat.uniforms.tColor.value = this.mrtTarget.textures[0];
    this.expansionMat.uniforms.tOutline.value = this.mrtTarget.textures[1];
    this.expansionMat.uniforms.tMeta.value = this.mrtTarget.textures[2];
    this.expansionMat.uniforms.tNormalDepth.value = this.mrtTarget.textures[3];
    (this.expansionMat.uniforms.uResolution.value as THREE.Vector2).set(passW, passH);
    this.expansionMat.uniforms.uSearchRadius.value = searchRadius;
    this.expansionMat.uniforms.uEnabled.value =
      expansionAllowed && !isSeedDebug ? 1.0 : 0.0;

    this.fsQuad.material = this.expansionMat;
    this.renderer.setRenderTarget(this.expansionTarget);
    this.renderer.render(this.fsScene, this.fsCamera);

    // 6. Pass 3: Outlines, Crease Edge Detection & Light-Reactive Bevel Edges
    const lightWorldDir = new THREE.Vector3(...cfg.lightDirection).normalize();
    const viewRot = new THREE.Matrix3().setFromMatrix4(camera.matrixWorldInverse);
    const lightViewDir = lightWorldDir.clone().applyMatrix3(viewRot).normalize();
    const lightSrgb = new THREE.Color();
    new THREE.Color(cfg.lightColor).getRGB(lightSrgb, THREE.SRGBColorSpace);

    const debugIdxMap: Record<PipelineConfig['debugView'], number> = {
      final: 0,
      raw_3d: 1,
      seed_dither: 2,
      object_ids: 3,
      normals: 4,
      depth: 5,
      edges: 6,
    };

    this.outlineMat.uniforms.tColor.value = this.expansionTarget.textures[0];
    this.outlineMat.uniforms.tOutline.value = this.expansionTarget.textures[1];
    this.outlineMat.uniforms.tMeta.value = this.expansionTarget.textures[2];
    this.outlineMat.uniforms.tNormalDepth.value = this.expansionTarget.textures[3];
    (this.outlineMat.uniforms.uResolution.value as THREE.Vector2).set(passW, passH);
    this.outlineMat.uniforms.uUseDepthTestForId.value = cfg.useDepthTestForIdOutlines ? 1 : 0;
    this.outlineMat.uniforms.uIdDepthThreshold.value = cfg.idDepthThreshold;
    this.outlineMat.uniforms.uUseNormalsForEdges.value = cfg.useNormalsForEdgeDetection ? 1 : 0;
    this.outlineMat.uniforms.uNormalEdgeThreshold.value = cfg.normalEdgeThreshold;
    this.outlineMat.uniforms.uUseDepthTestForEdges.value = cfg.useDepthTestForEdges ? 1 : 0;
    this.outlineMat.uniforms.uEdgeDepthThreshold.value = cfg.edgeDepthThreshold;
    this.outlineMat.uniforms.uEdgeHighlightStrength.value = cfg.edgeHighlightStrength;
    this.outlineMat.uniforms.uEdgeBevelStrength.value = cfg.edgeBevelStrength;
    (this.outlineMat.uniforms.uLightDirView.value as THREE.Vector3).copy(lightViewDir);
    (this.outlineMat.uniforms.uLightColorSrgb.value as THREE.Vector3).set(
      lightSrgb.r,
      lightSrgb.g,
      lightSrgb.b
    );
    this.outlineMat.uniforms.uDebugView.value = debugIdxMap[cfg.debugView] ?? 0;

    this.fsQuad.material = this.outlineMat;
    this.renderer.setRenderTarget(this.outlinedTarget);
    this.renderer.render(this.fsScene, this.fsCamera);

    // 7. Pass 4: Upscale + Subpixel Motion + Split Compare -> Screen or Export RenderTarget
    this.upscaleMat.uniforms.tPixelized.value = this.outlinedTarget.texture;
    this.upscaleMat.uniforms.tRaw3D.value =
      this.rawTarget?.textures[0] ?? this.outlinedTarget.texture;
    (this.upscaleMat.uniforms.uLowResSize.value as THREE.Vector2).set(passW, passH);
    (this.upscaleMat.uniforms.uScreenSize.value as THREE.Vector2).set(screenW, screenH);
    (this.upscaleMat.uniforms.uSubpixelOffsetUv.value as THREE.Vector2).copy(
      cfg.filterMode === 'full_scene' ? grid.subpixelOffsetUv : new THREE.Vector2(0, 0)
    );
    this.upscaleMat.uniforms.uUsePixelArtAA.value =
      cfg.filterMode === 'full_scene' && camCfg.upscaleMode === 'pixel_art_aa' ? 1 : 0;
    this.upscaleMat.uniforms.uSplitCompare.value = cfg.splitCompare ? 1 : 0;
    this.upscaleMat.uniforms.uSplitPosition.value = cfg.splitPosition;
    this.upscaleMat.uniforms.uShowRawOnly.value = cfg.debugView === 'raw_3d' ? 1 : 0;
    this.upscaleMat.uniforms.uTransparentBg.value = cfg.backgroundTransparent ? 1 : 0;
    (this.upscaleMat.uniforms.uBgColorSrgb.value as THREE.Vector3).set(
      bgSrgb.r,
      bgSrgb.g,
      bgSrgb.b
    );

    this.fsQuad.material = this.upscaleMat;
    this.renderer.setRenderTarget(outputTarget);
    this.renderer.render(this.fsScene, this.fsCamera);
  }

  public dispose(): void {
    this.mrtTarget?.dispose();
    this.expansionTarget?.dispose();
    this.outlinedTarget?.dispose();
    this.rawTarget?.dispose();
    this.quadGeo.dispose();
    this.clearMat.dispose();
    this.expansionMat.dispose();
    this.outlineMat.dispose();
    this.upscaleMat.dispose();
    for (const d of this.ditherMap.values()) d.tex.dispose();
    for (const r of this.rampMap.values()) r.tex.dispose();
    for (const p of this.paletteMap.values()) {
      p.lut.primaryTex.dispose();
      p.lut.secondaryTex.dispose();
    }
  }
}
