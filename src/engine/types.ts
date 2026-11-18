import * as THREE from 'three';

export type PixelizationFilterMode =
  | 'hifi_stylized'
  | 'only_pixelized'
  | 'full_scene'
  | 'cel_hard';

export type VisualStylePresetId =
  | 'hifi_stylized'
  | 'stylized_crisp'
  | 'nwl_snes'
  | 'hades_lab';

export type ResolutionMode =
  | 'world_space_pixel_size'
  | 'fixed_downscale_ratio'
  | 'fixed_target_resolution';

export type LowResUpscaleMode = 'nearest' | 'pixel_art_aa';

export type AngleSnapMode = 'none' | 'world_space' | 'camera_space_y';

export type IsoProjectionMode = 'dimetric_2_1' | 'true_iso';

export interface IsoProjectionConfig {
  mode: IsoProjectionMode;
  yawRad: number;
  distance: number;
}

export type ShadingWorkflow = 'specular' | 'metallic';

export type DitherSpaceMode = 'screen_macropixel' | 'object_uv';

export type ColorReductionMethod =
  | 'rgb_euclidean'
  | 'hsv_weighted'
  | 'oklab_perceptual'
  | 'hue_priority'
  | 'value_nearest'
  | 'posterize_quant';

export type DebugViewMode =
  | 'final'
  | 'raw_3d'
  | 'seed_dither'
  | 'object_ids'
  | 'normals'
  | 'depth'
  | 'edges';

export interface DitherPattern {
  id: string;
  name: string;
  /** Grid size: 4 (4x4 = 16 entries) or 8 (8x8 = 64 entries) */
  size?: 4 | 8;
  /** Threshold integers in row-major order (0..16 for 4x4, 0..64 for 8x8) */
  thresholds: number[];
}

export type DitherPattern4x4 = DitherPattern;

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
  /** Macropixel size in base pixels (1..10, e.g. 1x1, 3x3, 7x7) */
  pixelSize?: number;
  /** Unique integer ID in 0..255; matching IDs merge silhouettes without inner outline */
  objectId?: number;
  /** Silhouette outline hex color */
  outlineColor?: string;
  /** Silhouette outline strength 0..1 */
  outlineAlpha?: number;
  /** Silhouette outline width in macropixel steps (1 = crisp 1px, 2 = bold boss/Hades ink) */
  outlineWidthSteps?: 1 | 2;
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
  /** Optional PBR roughness map (linear / NoColorSpace) propagated to userData & GLB export */
  roughnessMap?: THREE.Texture | null;
  /** Optional PBR ambient occlusion map (linear / NoColorSpace) propagated to userData & GLB export */
  aoMap?: THREE.Texture | null;
  /** Optional PBR metalness map (linear / NoColorSpace) propagated to userData & GLB export */
  metalnessMap?: THREE.Texture | null;
  /** Enable vertex `tangent` (vec4) attribute TBN when geometry supplies valid tangents */
  useVertexTangents?: boolean;
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
  /** Optional PBR roughness [0..1] alias (mapped to smoothness = 1 - roughness when smoothness is omitted) */
  roughness?: number;
  lightingRampRange?: number;
  lightingRampOffset?: number;
  shadowTint?: string;
  shadowTintAlpha?: number;
  ambientConstantColor?: string;
  ambientConstantWeight?: number;

  /** Stepped cel rim light (Fresnel highlight gated by main light) */
  rimColor?: string;
  rimIntensity?: number;
  rimPower?: number;
  rimSteppedThreshold?: number;

  /** Color grading & dithering */
  useColorGrading?: boolean;
  paletteId?: string;
  ditherPatternId?: string;
  /** Coordinate domain for ordered dithering ('screen_macropixel' | 'object_uv') */
  ditherSpace?: DitherSpaceMode;
}

export interface RenderTelemetryStats {
  drawCalls: number;
  triangles: number;
  passWidth: number;
  passHeight: number;
  lastRenderMs: number;
  avgRenderMs: number;
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
  bloomEnabled: boolean;
  bloomThreshold: number;
  bloomIntensity: number;
  exposure?: number;
  contrast?: number;
  vignetteStrength?: number;
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

export interface VoxelizerOptions {
  /** Voxels along the longest bounding-box axis (8..80) */
  resolution: number;
  /** Optional palette quantization of voxel colors */
  palette?: ColorPaletteConfig | null;
  /** Apply 3D ordered checkerboard dithering when quantizing to palette */
  dither3d?: boolean;
  /** Fill hollow interiors slightly to avoid pinholes */
  fillSolidInterior?: boolean;
  /** Center bottom at y=0 and preserve input bounding scale */
  preserveWorldScale?: boolean;
}

export interface VoxelEntry {
  ix: number;
  iy: number;
  iz: number;
  r: number; // 0..255
  g: number; // 0..255
  b: number; // 0..255
}

export interface VoxelGridResult {
  dimensions: [number, number, number];
  voxelSize: number;
  origin: THREE.Vector3;
  voxels: VoxelEntry[];
  faceCount: number;
  triangleCount: number;
  geometry: THREE.BufferGeometry;
}
