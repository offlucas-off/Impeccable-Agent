import * as THREE from 'three';
import type { PixelizerPipeline } from './PixelizerPipeline';
import type { SteppedAnimationController } from './steppedAnimation';
import type { SpriteSheetExportOptions } from './types';

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

export function exportTurntableSpriteSheet(
  pipeline: PixelizerPipeline,
  scene: THREE.Scene,
  camera: THREE.Camera,
  targetObject: THREE.Object3D,
  options: SpriteSheetExportOptions,
  animController?: SteppedAnimationController
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

  for (let d = 0; d < rows; d++) {
    const yawDeg = startYawDeg + (d / rows) * 360;
    targetObject.rotation.y = origYaw + THREE.MathUtils.degToRad(yawDeg);

    for (let f = 0; f < cols; f++) {
      if (animController) {
        const t = cols > 1 ? (f / cols) * clipDuration : origTime;
        animController.setTime(t);
      }

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

export interface NwlIsometricSheetOptions {
  targetCharHeightPx?: number; // default 40
  boxSizePx?: number;          // auto >= max(96, round(charH * 2.4)) to prevent Death01 clipping
  framesPerDirection?: number; // default 8
  alphaThreshold?: number;     // default 110 -> binary hard alpha 0 / 255
  directions?: readonly string[];
}

export const NWL_8_DIRECTIONS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'] as const;

/**
 * Exports a strict non-mirrored 8-direction (S, SE, E, NE, N, NW, W, SW) isometric spritesheet
 * calibrated for NWL target height (40px default) with binary hard alpha (`0`/`255`) and safe padding
 * so extended clips (e.g., Death01) never clip against tile edges (`edge_clipping_count == 0`).
 */
export function exportNwlIsometricSheet(
  pipeline: PixelizerPipeline,
  scene: THREE.Scene,
  targetObject: THREE.Object3D,
  options: NwlIsometricSheetOptions = {},
  animController?: SteppedAnimationController
): SpriteSheetExportResult & { clippedFrames: number } {
  const charH = Math.max(24, Math.min(256, Math.round(options.targetCharHeightPx ?? 40)));
  const boxPx = Math.max(96, Math.round(options.boxSizePx ?? charH * 2.4));
  const cols = Math.max(1, options.framesPerDirection ?? 8);
  const dirs = options.directions ?? NWL_8_DIRECTIONS;
  const rows = dirs.length;
  const alphaThresh = options.alphaThreshold ?? 110;

  // Isometric orthographic camera looking down at pitch ~35.264°
  // Calibrated so a ~1.83m UAL humanoid (~1.494m projected height at 35.264° pitch) occupies `charH` pixels inside `boxPx`
  const orthoSpan = 1.494 * (boxPx / charH);
  const camDist = 12;
  const pitchRad = Math.atan(1 / Math.SQRT2); // ~35.264°
  const isoCam = new THREE.OrthographicCamera(
    -orthoSpan * 0.5,
    orthoSpan * 0.5,
    orthoSpan * 0.5,
    -orthoSpan * 0.5,
    0.1,
    50
  );
  isoCam.position.set(
    0,
    0.88 + camDist * Math.sin(pitchRad),
    camDist * Math.cos(pitchRad)
  );
  isoCam.lookAt(0, 0.88, 0);
  isoCam.updateProjectionMatrix();

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
  const pixels = new Uint8Array(boxPx * boxPx * 4);
  const clipDuration = animController?.getActiveClip()?.duration || 1.0;
  let clippedFrames = 0;

  try {
    for (let d = 0; d < rows; d++) {
      const yawDeg = (d / rows) * 360;
      targetObject.rotation.y = origYaw + THREE.MathUtils.degToRad(yawDeg);

      for (let f = 0; f < cols; f++) {
        if (animController) {
          const t = cols > 1 ? (f / cols) * clipDuration : origTime;
          animController.setTime(t);
        }

        pipeline.render(scene, isoCam, rt);
        pipeline.renderer.readRenderTargetPixels(rt, 0, 0, boxPx, boxPx, pixels);

        let touchesEdge = false;
        for (let y = 0; y < boxPx; y++) {
          const srcRow = (boxPx - 1 - y) * boxPx * 4;
          const dstRow = y * boxPx * 4;
          for (let x = 0; x < boxPx; x++) {
            const si = srcRow + x * 4;
            const di = dstRow + x * 4;
            const a = pixels[si + 3] >= alphaThresh ? 255 : 0;
            if (a === 255 && (x === 0 || x === boxPx - 1 || y === 0 || y === boxPx - 1)) {
              touchesEdge = true;
            }
            imgData.data[di + 0] = pixels[si + 0];
            imgData.data[di + 1] = pixels[si + 1];
            imgData.data[di + 2] = pixels[si + 2];
            imgData.data[di + 3] = a;
          }
        }
        if (touchesEdge) clippedFrames++;

        frameCtx.putImageData(imgData, 0, 0);
        const x = f * boxPx;
        const y = d * boxPx;
        sheetCtx.drawImage(frameCanvas, x, y);

        frames.push({
          name: `${dirs[d]}_frame_${f}`,
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
  } finally {
    targetObject.rotation.y = origYaw;
    if (animController) animController.setTime(origTime);
    pipeline.pipelineConfig.backgroundTransparent = prevBg;
    pipeline.pipelineConfig.splitCompare = prevSplit;
    Object.assign(pipeline.cameraConfig, prevCamCfg);
    for (const s of savedPixelSizes) s.mat.updateOptions({ pixelSize: s.px });
    rt.dispose();
  }

  const atlasPayload = {
    meta: {
      generator: 'Pixelizer 3D Engine (NWL 8-Dir Non-Mirrored Isometric)',
      targetCharacterHeightPx: charH,
      directions: dirs,
      mirrored: false,
      hardAlphaThreshold: alphaThresh,
      clippedFrames,
      size: { w: sheetW, h: sheetH },
      frameSize: { w: boxPx, h: boxPx },
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
    clippedFrames,
  };
}

