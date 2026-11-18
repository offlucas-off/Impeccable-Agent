import * as THREE from 'three';
import type { PixelizerPipeline } from './PixelizerPipeline';
import type { SteppedAnimationController } from './steppedAnimation';
import type { IsoProjectionMode, SpriteSheetExportOptions } from './types';
import { getIsometricPitchRad } from './snapping';

export interface SpriteSheetAtlasFrame {
  name: string;
  directionIndex: number;
  yawDeg: number;
  frameIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteSheetExportResult {
  imageDataUrl: string;
  atlasJson: string;
  cols: number;
  rows: number;
  width: number;
  height: number;
  frames: SpriteSheetAtlasFrame[];
}

/**
 * Captures single frames or multi-angle turntable + stepped animation sprite sheets
 * with optional transparent backgrounds directly from the WebGL2 PixelizerPipeline.
 */
export function captureSingleFrameDataUrl(
  pipeline: PixelizerPipeline,
  scene: THREE.Scene,
  camera: THREE.Camera,
  width: number,
  height: number,
  transparentBackground: boolean
): string {
  const prevBg = pipeline.pipelineConfig.backgroundTransparent;
  const prevSplit = pipeline.pipelineConfig.splitCompare;
  pipeline.pipelineConfig.backgroundTransparent = transparentBackground;
  pipeline.pipelineConfig.splitCompare = false;

  const rt = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  pipeline.render(scene, camera, rt);

  const pixels = new Uint8Array(width * height * 4);
  pipeline.renderer.readRenderTargetPixels(rt, 0, 0, width, height, pixels);
  rt.dispose();

  pipeline.pipelineConfig.backgroundTransparent = prevBg;
  pipeline.pipelineConfig.splitCompare = prevSplit;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);

  // Flip Y from WebGL bottom-left origin to canvas top-left origin
  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * width * 4;
    const dstRow = y * width * 4;
    imgData.data.set(pixels.subarray(srcRow, srcRow + width * 4), dstRow);
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export interface VfxFrameStepInfo {
  progress01: number;
  frameIndex: number;
  totalFrames: number;
  directionIndex: number;
  dtSeconds: number;
}

export interface VfxTimelineSteppable {
  update: (dt: number) => void;
  reset?: () => void;
  totalDurationSec?: number;
}

export interface SpriteSheetVfxOptions {
  /** Optional frame-by-frame VFX callback invoked right before each frame render. */
  onStepVfxFrame?: (info: VfxFrameStepInfo) => void;
  /** Optional VfxTimelinePlayer (or compatible stepper) advanced per frame. */
  vfxTimeline?: VfxTimelineSteppable;
  /** Total duration in seconds used when stepping `vfxTimeline` (defaults to timeline duration or 1.0s). */
  vfxDurationSec?: number;
}

export function exportTurntableSpriteSheet(
  pipeline: PixelizerPipeline,
  scene: THREE.Scene,
  camera: THREE.Camera,
  targetObject: THREE.Object3D,
  options: SpriteSheetExportOptions,
  animController?: SteppedAnimationController,
  vfxOptions?: SpriteSheetVfxOptions
): SpriteSheetExportResult {
  const {
    directions,
    framesPerDirection,
    frameWidth,
    frameHeight,
    transparentBackground,
    startYawDeg,
  } = options;

  const cols = Math.max(1, framesPerDirection);
  const rows = Math.max(1, directions);
  const sheetW = cols * frameWidth;
  const sheetH = rows * frameHeight;

  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetW;
  sheetCanvas.height = sheetH;
  const sheetCtx = sheetCanvas.getContext('2d')!;

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = frameWidth;
  frameCanvas.height = frameHeight;
  const frameCtx = frameCanvas.getContext('2d')!;
  const imgData = frameCtx.createImageData(frameWidth, frameHeight);

  const rt = new THREE.WebGLRenderTarget(frameWidth, frameHeight, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  const prevBg = pipeline.pipelineConfig.backgroundTransparent;
  const prevSplit = pipeline.pipelineConfig.splitCompare;
  const origYaw = targetObject.rotation.y;
  const origTime = animController?.getContinuousTime() ?? 0;

  pipeline.pipelineConfig.backgroundTransparent = transparentBackground;
  pipeline.pipelineConfig.splitCompare = false;

  const frames: SpriteSheetAtlasFrame[] = [];
  const pixels = new Uint8Array(frameWidth * frameHeight * 4);
  const clipDuration =
    animController && animController.getClips().length > 0
      ? animController.getClips()[animController.getActiveClipIndex()]?.duration || 1.0
      : 1.0;

  const vfxDuration = Math.max(
    0.1,
    vfxOptions?.vfxDurationSec ?? vfxOptions?.vfxTimeline?.totalDurationSec ?? 1.0
  );
  const vfxDt = cols > 0 ? vfxDuration / cols : vfxDuration;

  for (let d = 0; d < rows; d++) {
    const yawDeg = startYawDeg + (d / rows) * 360;
    targetObject.rotation.y = origYaw + THREE.MathUtils.degToRad(yawDeg);
    vfxOptions?.vfxTimeline?.reset?.();

    for (let f = 0; f < cols; f++) {
      if (animController) {
        const t = cols > 1 ? (f / cols) * clipDuration : origTime;
        animController.setTime(t);
      }

      const dtSeconds = f === 0 ? 0 : vfxDt;
      if (f > 0) {
        vfxOptions?.vfxTimeline?.update(vfxDt);
      }
      vfxOptions?.onStepVfxFrame?.({
        progress01: cols > 0 ? f / cols : 0,
        frameIndex: f,
        totalFrames: cols,
        directionIndex: d,
        dtSeconds,
      });

      pipeline.render(scene, camera, rt);
      pipeline.renderer.readRenderTargetPixels(rt, 0, 0, frameWidth, frameHeight, pixels);

      for (let y = 0; y < frameHeight; y++) {
        const srcRow = (frameHeight - 1 - y) * frameWidth * 4;
        const dstRow = y * frameWidth * 4;
        imgData.data.set(
          pixels.subarray(srcRow, srcRow + frameWidth * 4),
          dstRow
        );
      }
      frameCtx.putImageData(imgData, 0, 0);

      const x = f * frameWidth;
      const y = d * frameHeight;
      sheetCtx.drawImage(frameCanvas, x, y);

      frames.push({
        name: `dir_${d}_frame_${f}`,
        directionIndex: d,
        yawDeg: Math.round(yawDeg % 360),
        frameIndex: f,
        x,
        y,
        w: frameWidth,
        h: frameHeight,
      });
    }
  }

  // Restore original state
  targetObject.rotation.y = origYaw;
  if (animController) {
    animController.setTime(origTime);
  }
  pipeline.pipelineConfig.backgroundTransparent = prevBg;
  pipeline.pipelineConfig.splitCompare = prevSplit;
  rt.dispose();

  const atlasPayload = {
    meta: {
      generator: 'Pixelizer 3D Engine',
      size: { w: sheetW, h: sheetH },
      frameSize: { w: frameWidth, h: frameHeight },
      directions: rows,
      framesPerDirection: cols,
    },
    frames,
  };

  return {
    imageDataUrl: sheetCanvas.toDataURL('image/png'),
    atlasJson: JSON.stringify(atlasPayload, null, 2),
    cols,
    rows,
    width: sheetW,
    height: sheetH,
    frames,
  };
}

export interface NwlIsometricSheetOptions extends SpriteSheetVfxOptions {
  targetCharHeightPx?: number; // default 108 (NWL official: 1.79m = 108px, 1m = 60px)
  boxSizePx?: number;          // auto >= max(96, round(charH * 2.4)) to prevent Death01 clipping
  framesPerDirection?: number; // default 8
  alphaThreshold?: number;     // default 110 -> binary hard alpha 0 / 255
  directions?: readonly string[];
  projection?: IsoProjectionMode; // default 'dimetric_2_1' (~26.565 deg)
  postOutlinePx?: boolean;        // clean 1px outline on binary-alpha buffer
  postOutlineColor?: [number, number, number, number]; // default [0, 0, 0, 255]
  tightPack?: boolean;            // shelf-pack trimmed frames & emit Unity metadata
  clipName?: string;              // optional animation clip label for Unity metadata
}

export interface UnitySpriteFrameMeta {
  name: string;
  direction: string;
  clip: string;
  frameIndex: number;
  rect: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  pivot: { x: number; y: number };
  trimmed: boolean;
}

export interface UnitySpriteAtlasMetadata {
  version: string;
  projection: IsoProjectionMode;
  pitchDeg: number;
  pixelsPerUnit: number;
  atlasSize: { w: number; h: number };
  frames: UnitySpriteFrameMeta[];
}

export interface TightPackFrameInput {
  name: string;
  direction: string;
  clip: string;
  frameIndex: number;
  width: number;
  height: number;
  rgba: Uint8Array | Uint8ClampedArray;
  /** Optional anchor in source-frame top-left pixel coords; defaults to bottom-center (width * 0.5, height) */
  anchorPx?: { x: number; y: number };
}

export interface TightPackOptions {
  padding?: number;
  maxWidth?: number;
  projection?: IsoProjectionMode;
  pixelsPerUnit?: number;
  version?: string;
}

export interface TightPackResult {
  atlasRgba: Uint8ClampedArray;
  atlasWidth: number;
  atlasHeight: number;
  unityMeta: UnitySpriteAtlasMetadata;
}

/**
 * Applies a crisp 1px 4-connected outline onto a binary-alpha RGBA buffer in place.
 * Avoids WebGL mip/linear haloing by operating strictly on discrete alpha > 0 pixels.
 */
export function applyPostOutline1px(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  color: [number, number, number, number] = [0, 0, 0, 255]
): void {
  const alphaCopy = new Uint8Array(width * height);
  for (let i = 0; i < alphaCopy.length; i++) {
    alphaCopy[i] = rgba[i * 4 + 3];
  }

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + x;
      if (alphaCopy[idx] > 0) continue;

      const hasNeighbor =
        (x > 0 && alphaCopy[idx - 1] > 0) ||
        (x < width - 1 && alphaCopy[idx + 1] > 0) ||
        (y > 0 && alphaCopy[idx - width] > 0) ||
        (y < height - 1 && alphaCopy[idx + width] > 0);

      if (hasNeighbor) {
        const p = idx * 4;
        rgba[p] = color[0];
        rgba[p + 1] = color[1];
        rgba[p + 2] = color[2];
        rgba[p + 3] = color[3];
      }
    }
  }
}

/**
 * Trims transparent borders and shelf-packs sprite frames with padding, preserving the
 * exact bottom-center foot pivot in normalized [0..1] Unity SpriteRenderer coordinates.
 * Pure Node-compatible helper (no WebGL or DOM required).
 */
export function packTightSpriteFrames(
  inputs: readonly TightPackFrameInput[],
  options: TightPackOptions = {}
): TightPackResult {
  const padding = Math.max(0, Math.round(options.padding ?? 2));
  const maxWidth = Math.max(64, Math.round(options.maxWidth ?? 2048));
  const projection: IsoProjectionMode = options.projection ?? 'dimetric_2_1';
  const pitchDeg = Number(((getIsometricPitchRad(projection) * 180) / Math.PI).toFixed(3));
  const pixelsPerUnit = options.pixelsPerUnit ?? 60;
  const version = options.version ?? '1.0';

  interface PreparedFrame {
    inputIndex: number;
    input: TightPackFrameInput;
    trimX: number;
    trimY: number;
    trimW: number;
    trimH: number;
    trimmed: boolean;
    pivotX: number;
    pivotY: number;
    rectX: number;
    rectY: number;
  }

  const prepared: PreparedFrame[] = inputs.map((input, inputIndex) => {
    const { width, height, rgba } = input;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = 0; x < width; x++) {
        if (rgba[(row + x) * 4 + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const empty = maxX < minX || maxY < minY;
    const trimX = empty ? 0 : minX;
    const trimY = empty ? 0 : minY;
    const trimW = empty ? 1 : maxX - minX + 1;
    const trimH = empty ? 1 : maxY - minY + 1;
    const trimmed =
      trimX !== 0 || trimY !== 0 || trimW !== width || trimH !== height;

    const anchorX = input.anchorPx?.x ?? width * 0.5;
    const anchorY = input.anchorPx?.y ?? height;
    const pivotX = Math.round(((anchorX - trimX) / trimW) * 1e6) / 1e6;
    const pivotY = Math.round(((trimY + trimH - anchorY) / trimH) * 1e6) / 1e6;

    return {
      inputIndex,
      input,
      trimX,
      trimY,
      trimW,
      trimH,
      trimmed,
      pivotX,
      pivotY,
      rectX: 0,
      rectY: 0,
    };
  });

  // Sort tallest-first for compact shelf packing
  const sorted = [...prepared].sort((a, b) => b.trimH - a.trimH || b.trimW - a.trimW);

  let cursorX = padding;
  let cursorY = padding;
  let rowHeight = 0;
  let usedWidth = padding;

  for (const item of sorted) {
    if (cursorX + item.trimW + padding > maxWidth && cursorX > padding) {
      cursorX = padding;
      cursorY += rowHeight + padding;
      rowHeight = 0;
    }
    item.rectX = cursorX;
    item.rectY = cursorY;
    cursorX += item.trimW + padding;
    rowHeight = Math.max(rowHeight, item.trimH);
    usedWidth = Math.max(usedWidth, cursorX);
  }

  const atlasWidth = Math.max(1, usedWidth);
  const atlasHeight = Math.max(1, cursorY + rowHeight + padding);
  const atlasRgba = new Uint8ClampedArray(atlasWidth * atlasHeight * 4);

  for (const item of prepared) {
    const { input, trimX, trimY, trimW, trimH, rectX, rectY } = item;
    for (let y = 0; y < trimH; y++) {
      const srcRow = ((trimY + y) * input.width + trimX) * 4;
      const dstRow = ((rectY + y) * atlasWidth + rectX) * 4;
      atlasRgba.set(input.rgba.subarray(srcRow, srcRow + trimW * 4), dstRow);
    }
  }

  const frames: UnitySpriteFrameMeta[] = prepared.map((item) => ({
    name: item.input.name,
    direction: item.input.direction,
    clip: item.input.clip,
    frameIndex: item.input.frameIndex,
    rect: { x: item.rectX, y: item.rectY, w: item.trimW, h: item.trimH },
    sourceSize: { w: item.input.width, h: item.input.height },
    spriteSourceSize: { x: item.trimX, y: item.trimY, w: item.trimW, h: item.trimH },
    pivot: { x: item.pivotX, y: item.pivotY },
    trimmed: item.trimmed,
  }));

  return {
    atlasRgba,
    atlasWidth,
    atlasHeight,
    unityMeta: {
      version,
      projection,
      pitchDeg,
      pixelsPerUnit,
      atlasSize: { w: atlasWidth, h: atlasHeight },
      frames,
    },
  };
}

export const NWL_8_DIRECTIONS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'] as const;

/**
 * Exports a strict non-mirrored 8-direction (S, SE, E, NE, N, NW, W, SW) isometric spritesheet
 * calibrated for NWL scale (1m = 60px -> 108px for 1.79m hero, or 40px legacy option) with binary
 * hard alpha (`0`/`255`) and safe padding so extended clips (e.g., Death01) or giant bosses never clip.
 */
export function exportNwlIsometricSheet(
  pipeline: PixelizerPipeline,
  scene: THREE.Scene,
  targetObject: THREE.Object3D,
  options: NwlIsometricSheetOptions = {},
  animController?: SteppedAnimationController
): SpriteSheetExportResult & { clippedFrames: number; unityMeta?: UnitySpriteAtlasMetadata } {
  const charH = Math.max(24, Math.min(320, Math.round(options.targetCharHeightPx ?? 108)));
  const boxPx = Math.max(96, Math.round(options.boxSizePx ?? charH * 2.4));
  const cols = Math.max(1, options.framesPerDirection ?? 8);
  const dirs = options.directions ?? NWL_8_DIRECTIONS;
  const rows = dirs.length;
  const alphaThresh = options.alphaThreshold ?? 110;
  const projection: IsoProjectionMode = options.projection ?? 'dimetric_2_1';
  const postOutlinePx = Boolean(options.postOutlinePx);
  const postOutlineColor: [number, number, number, number] = options.postOutlineColor ?? [0, 0, 0, 255];
  const tightPack = Boolean(options.tightPack);
  const clipLabel = options.clipName || animController?.getActiveClip()?.name || 'idle';

  // Measure target bounds so giant creatures (e.g., Demon Boss ~2.95m) also fit cleanly inside boxPx
  targetObject.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(targetObject);
  const sizeVec = new THREE.Vector3();
  const centerVec = new THREE.Vector3();
  bounds.getSize(sizeVec);
  bounds.getCenter(centerVec);
  const actorHeightM = Math.max(1.79, sizeVec.y || 1.79);
  const focusY = Number.isFinite(centerVec.y) && sizeVec.y > 0.2 ? centerVec.y : 0.88;

  // Isometric orthographic camera looking down at pitchRad (26.565 deg for dimetric_2_1, 35.264 deg for true_iso)
  // Calibrated so the projected vertical height of the actor occupies `charH` pixels
  const camDist = 14;
  const pitchRad = getIsometricPitchRad(projection);
  const projectedHeightFactor = Math.cos(pitchRad) + 0.0314 * Math.sin(pitchRad);
  const orthoSpan = actorHeightM * projectedHeightFactor * (boxPx / charH);
  const isoCam = new THREE.OrthographicCamera(
    -orthoSpan * 0.5,
    orthoSpan * 0.5,
    orthoSpan * 0.5,
    -orthoSpan * 0.5,
    0.1,
    60
  );
  isoCam.position.set(
    0,
    focusY + camDist * Math.sin(pitchRad),
    camDist * Math.cos(pitchRad)
  );
  isoCam.lookAt(0, focusY, 0);
  isoCam.updateProjectionMatrix();
  isoCam.updateMatrixWorld();

  // Project ground-plane origin (0, 0, 0) to source pixel coords for exact foot pivot preservation
  const footNdc = new THREE.Vector3(0, 0, 0).project(isoCam);
  const footAnchorPx = {
    x: (footNdc.x * 0.5 + 0.5) * boxPx,
    y: (1 - (footNdc.y * 0.5 + 0.5)) * boxPx,
  };

  const sheetW = cols * boxPx;
  const sheetH = rows * boxPx;
  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetW;
  sheetCanvas.height = sheetH;
  const sheetCtx = sheetCanvas.getContext('2d')!;

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = boxPx;
  frameCanvas.height = boxPx;
  const frameCtx = frameCanvas.getContext('2d')!;
  const imgData = frameCtx.createImageData(boxPx, boxPx);

  const rt = new THREE.WebGLRenderTarget(boxPx, boxPx, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  const prevBg = pipeline.pipelineConfig.backgroundTransparent;
  const prevSplit = pipeline.pipelineConfig.splitCompare;
  const prevCamCfg = { ...pipeline.cameraConfig };
  const origYaw = targetObject.rotation.y;
  const origTime = animController?.getContinuousTime() ?? 0;

  // Save & temporarily force crisp 1px pixelization for ~40px target sprite height
  const savedPixelSizes: { mat: { options: { pixelSize: number }; updateOptions: (p: { pixelSize: number }) => void }; px: number }[] = [];
  targetObject.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const pm = m as unknown as { options?: { pixelSize?: number }; updateOptions?: (p: { pixelSize: number }) => void };
        if (pm.options && typeof pm.options.pixelSize === 'number' && pm.updateOptions && pm.options.pixelSize !== 1) {
          savedPixelSizes.push({ mat: pm as { options: { pixelSize: number }; updateOptions: (p: { pixelSize: number }) => void }, px: pm.options.pixelSize });
          pm.updateOptions({ pixelSize: 1 });
        }
      }
    }
  });

  pipeline.pipelineConfig.backgroundTransparent = true;
  pipeline.pipelineConfig.splitCompare = false;
  pipeline.cameraConfig.orthographic = true;
  pipeline.cameraConfig.resolutionMode = 'fixed_downscale_ratio';
  pipeline.cameraConfig.downscaleRatio = 1;
  pipeline.cameraConfig.orthoHeight = orthoSpan;
  pipeline.cameraConfig.upscaleMode = 'nearest';
  pipeline.cameraConfig.snapCameraPosition = false;

  const frames: SpriteSheetAtlasFrame[] = [];
  const tightInputs: TightPackFrameInput[] = [];
  const pixels = new Uint8Array(boxPx * boxPx * 4);
  const frameBuf = tightPack ? null : imgData.data;
  const clipDuration = animController?.getActiveClip()?.duration || 1.0;
  let clippedFrames = 0;

  const vfxDuration = Math.max(
    0.1,
    options.vfxDurationSec ?? options.vfxTimeline?.totalDurationSec ?? 1.0
  );
  const vfxDt = cols > 0 ? vfxDuration / cols : vfxDuration;

  try {
    for (let d = 0; d < rows; d++) {
      const yawDeg = (d / rows) * 360;
      targetObject.rotation.y = origYaw + THREE.MathUtils.degToRad(yawDeg);
      options.vfxTimeline?.reset?.();

      for (let f = 0; f < cols; f++) {
        if (animController) {
          const t = cols > 1 ? (f / cols) * clipDuration : origTime;
          animController.setTime(t);
        }

        const dtSeconds = f === 0 ? 0 : vfxDt;
        if (f > 0) {
          options.vfxTimeline?.update(vfxDt);
        }
        options.onStepVfxFrame?.({
          progress01: cols > 0 ? f / cols : 0,
          frameIndex: f,
          totalFrames: cols,
          directionIndex: d,
          dtSeconds,
        });

        pipeline.render(scene, isoCam, rt);
        pipeline.renderer.readRenderTargetPixels(rt, 0, 0, boxPx, boxPx, pixels);

        const rgba = frameBuf ?? new Uint8ClampedArray(boxPx * boxPx * 4);
        for (let y = 0; y < boxPx; y++) {
          const srcRow = (boxPx - 1 - y) * boxPx * 4;
          const dstRow = y * boxPx * 4;
          for (let x = 0; x < boxPx; x++) {
            const si = srcRow + x * 4;
            const di = dstRow + x * 4;
            const a = pixels[si + 3] >= alphaThresh ? 255 : 0;
            rgba[di + 0] = pixels[si + 0];
            rgba[di + 1] = pixels[si + 1];
            rgba[di + 2] = pixels[si + 2];
            rgba[di + 3] = a;
          }
        }

        if (postOutlinePx) {
          applyPostOutline1px(rgba, boxPx, boxPx, postOutlineColor);
        }

        let touchesEdge = false;
        for (let y = 0; y < boxPx && !touchesEdge; y++) {
          for (let x = 0; x < boxPx; x++) {
            if (
              (x === 0 || x === boxPx - 1 || y === 0 || y === boxPx - 1) &&
              rgba[(y * boxPx + x) * 4 + 3] > 0
            ) {
              touchesEdge = true;
              break;
            }
          }
        }
        if (touchesEdge) clippedFrames++;

        const frameName = `${dirs[d]}_frame_${f}`;
        if (tightPack) {
          tightInputs.push({
            name: frameName,
            direction: dirs[d],
            clip: clipLabel,
            frameIndex: f,
            width: boxPx,
            height: boxPx,
            rgba,
            anchorPx: footAnchorPx,
          });
        } else {
          frameCtx.putImageData(imgData, 0, 0);
          const x = f * boxPx;
          const y = d * boxPx;
          sheetCtx.drawImage(frameCanvas, x, y);

          frames.push({
            name: frameName,
            directionIndex: d,
            yawDeg: Math.round(yawDeg % 360),
            frameIndex: f,
            x,
            y,
            w: boxPx,
            h: boxPx,
          });
        }
      }
    }
  } finally {
    targetObject.rotation.y = origYaw;
    if (animController) animController.setTime(origTime);
    pipeline.pipelineConfig.backgroundTransparent = prevBg;
    pipeline.pipelineConfig.splitCompare = prevSplit;
    Object.assign(pipeline.cameraConfig, prevCamCfg);
    for (const s of savedPixelSizes) s.mat.updateOptions({ pixelSize: s.px });
    rt.dispose();
  }

  let outWidth = sheetW;
  let outHeight = sheetH;
  let unityMeta: UnitySpriteAtlasMetadata | undefined;

  if (tightPack) {
    const pixelsPerUnit = Math.max(1, Math.round(charH / 1.79));
    const packed = packTightSpriteFrames(tightInputs, {
      padding: 2,
      projection,
      pixelsPerUnit,
    });
    outWidth = packed.atlasWidth;
    outHeight = packed.atlasHeight;
    unityMeta = packed.unityMeta;

    sheetCanvas.width = outWidth;
    sheetCanvas.height = outHeight;
    const atlasImgData = sheetCtx.createImageData(outWidth, outHeight);
    atlasImgData.data.set(packed.atlasRgba);
    sheetCtx.putImageData(atlasImgData, 0, 0);

    for (let i = 0; i < packed.unityMeta.frames.length; i++) {
      const uf = packed.unityMeta.frames[i];
      const d = dirs.indexOf(uf.direction);
      const yawDeg = d >= 0 ? (d / rows) * 360 : 0;
      frames.push({
        name: uf.name,
        directionIndex: d >= 0 ? d : 0,
        yawDeg: Math.round(yawDeg % 360),
        frameIndex: uf.frameIndex,
        x: uf.rect.x,
        y: uf.rect.y,
        w: uf.rect.w,
        h: uf.rect.h,
      });
    }
  }

  const atlasPayload = unityMeta ?? {
    meta: {
      generator: 'Pixelizer 3D Engine (NWL 8-Dir Non-Mirrored Isometric)',
      targetCharacterHeightPx: charH,
      projection,
      postOutlinePx,
      directions: dirs,
      mirrored: false,
      hardAlphaThreshold: alphaThresh,
      clippedFrames,
      size: { w: outWidth, h: outHeight },
      frameSize: { w: boxPx, h: boxPx },
    },
    frames,
  };

  return {
    imageDataUrl: sheetCanvas.toDataURL('image/png'),
    atlasJson: JSON.stringify(atlasPayload, null, 2),
    cols,
    rows,
    width: outWidth,
    height: outHeight,
    frames,
    clippedFrames,
    unityMeta,
  };
}

