import * as THREE from 'three';

export type PixelizationFilterMode = 'only_pixelized' | 'full_scene';

export type ResolutionMode =
  | 'world_space_pixel_size'
  | 'fixed_downscale_ratio'
  | 'fixed_target_resolution';

export type LowResUpscaleMode = 'nearest' | 'pixel_art_aa';

export type AngleSnapMode = 'none' | 'world_space' | 'camera_space_y';

export type ShadingWorkflow = 'specular' | 'metallic';

export type ColorReductionMethod =
  | 'rgb_euclidean'
  | 'hsv_weighted'
  | 'value_nearest';

export type DebugViewMode =
  | 'final'
  | 'raw_3d'
  | 'seed_dither'
  | 'object_ids'
  | 'normals'
  | 'depth'
  | 'edges';

export interface DitherPattern4x4 {
  id: string;
  name: string;
  /** 16 threshold integers in row-major 4x4 order (range 0..16) */
  thresholds: number[];
}

export interface ColorPaletteConfig {
  id: string;
  name: string;
  /** Hex colors (#RRGGBB) */
  colors: string[];
  method: ColorReductionMethod;
  hsvWeights: [number, number, number];
  enableDither: boolean;
  ditherStrength: number;
  valueCurveGamma: number;
}

export interface LightingRampStop {
  position: number; // 0..1
  color: string;    // #RRGGBB or intensity tint
}

export interface LightingRampConfig {
  id: string;
  name: string;
  smooth: boolean;
  stops: LightingRampStop[];
}

export interface PixelizerMaterialOptions {
  /** Whether this object participates in per-object pixelization */
  pixelated?: boolean;
  /** Macropixel size in base pixels (1..6) */
  pixelSize?: number;
  /** Unique integer ID in 0..255; matching IDs merge silhouettes without inner outline */
  objectId?: number;
  /** Silhouette outline hex color */
  outlineColor?: string;
  /** Silhouette outline strength 0..1 */
  outlineAlpha?: number;
  /** Interior crease edge tint (< 0.5 darkens, 0.5 neutral, > 0.5 lightens) */
  edgeHighlight?: number;
  /** Light-reactive edge normal bevel weight 0..1 */
  edgeBevelWeight?: number;

  /** Surface appearance */
  baseColor?: string;
  alpha?: number;
  alphaClipThreshold?: number;
  useDitheredTransparency?: boolean;
  albedoMap?: THREE.Texture | null;
  normalMap?: THREE.Texture | null;
  normalScale?: number;
  emissionMap?: THREE.Texture | null;
  emissionColor?: string;
  emissionIntensity?: number;
  diffuseVertexColorWeight?: number;
  emissiveVertexColorWeight?: number;

  /** Lighting & Cel shading */
  workflow?: ShadingWorkflow;
  specularColor?: string;
  metallic?: number;
  smoothness?: number;
  lightingRampRange?: number;
  lightingRampOffset?: number;
  shadowTint?: string;
  shadowTintAlpha?: number;
  ambientConstantColor?: string;
  ambientConstantWeight?: number;

  /** Color grading & dithering */
  useColorGrading?: boolean;
  paletteId?: string;
  ditherPatternId?: string;
}

export interface SnapOptions {
  snapPosition: boolean;
  alignPixelGrid: boolean;
  alignmentPixelSize: number;
  angleSnapMode: AngleSnapMode;
  angleResolutionDeg: number;
}

export interface CameraSnapConfig {
  orthographic: boolean;
  orthoHeight: number;
  perspectiveFov: number;
  resolutionMode: ResolutionMode;
  worldSpacePixelSize: number;
  downscaleRatio: number;
  targetHeight: number;
  snapCameraPosition: boolean;
  cameraSubpixelMotion: boolean;
  upscaleMode: LowResUpscaleMode;
}

export interface PipelineConfig {
  filterMode: PixelizationFilterMode;
  usePixelExpansion: boolean;
  useDepthTestForIdOutlines: boolean;
  idDepthThreshold: number;
  useNormalsForEdgeDetection: boolean;
  normalEdgeThreshold: number;
  useDepthTestForEdges: boolean;
  edgeDepthThreshold: number;
  edgeHighlightStrength: number;
  edgeBevelStrength: number;
  lightDirection: [number, number, number];
  lightColor: string;
  lightIntensity: number;
  ambientSkyColor: string;
  ambientIntensity: number;
  backgroundColor: string;
  backgroundTransparent: boolean;
  debugView: DebugViewMode;
  splitCompare: boolean;
  splitPosition: number; // 0..1
}

export interface SteppedAnimationConfig {
  enabled: boolean;
  fps: number;
  playbackSpeed: number;
  paused: boolean;
}

export interface SpriteSheetExportOptions {
  directions: number;       // e.g. 4, 8, 16
  framesPerDirection: number;
  frameWidth: number;
  frameHeight: number;
  transparentBackground: boolean;
  startYawDeg: number;
}
