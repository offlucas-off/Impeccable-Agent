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
