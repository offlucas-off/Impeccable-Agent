import * as THREE from 'three';
import type { AngleSnapMode, CameraSnapConfig, IsoProjectionMode, SnapOptions } from './types';

export interface SavedTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
}

export interface ComputedCameraGrid {
  worldPixelSize: number;
  lowResWidth: number;
  lowResHeight: number;
  effectiveOrthoHeight: number;
  subpixelOffsetUv: THREE.Vector2;
}

/**
 * Computes exact low-resolution render target dimensions & world-space pixel size
 * matching ProPixelizerCamera's 3 resolution modes.
 */
export function computeCameraGrid(
  screenWidth: number,
  screenHeight: number,
  config: CameraSnapConfig
): ComputedCameraGrid {
  const safeW = Math.max(1, Math.floor(screenWidth));
  const safeH = Math.max(1, Math.floor(screenHeight));
  const aspect = safeW / safeH;

  let lowW = safeW;
  let lowH = safeH;
  let worldPixelSize = config.worldSpacePixelSize;
  let effectiveOrthoHeight = config.orthoHeight;

  if (config.resolutionMode === 'world_space_pixel_size') {
    worldPixelSize = Math.max(0.002, config.worldSpacePixelSize);
    lowH = Math.max(16, Math.min(safeH, Math.round(config.orthoHeight / worldPixelSize)));
    lowW = Math.max(16, Math.min(safeW, Math.round(lowH * aspect)));
    effectiveOrthoHeight = lowH * worldPixelSize;
  } else if (config.resolutionMode === 'fixed_downscale_ratio') {
    const ratio = Math.max(1, Math.round(config.downscaleRatio));
    lowW = Math.max(16, Math.floor(safeW / ratio));
    lowH = Math.max(16, Math.floor(safeH / ratio));
    worldPixelSize = config.orthoHeight / lowH;
  } else {
    // fixed_target_resolution
    lowH = Math.max(16, Math.min(safeH, Math.round(config.targetHeight)));
    lowW = Math.max(16, Math.min(safeW, Math.round(lowH * aspect)));
    worldPixelSize = config.orthoHeight / lowH;
  }

  return {
    worldPixelSize,
    lowResWidth: lowW,
    lowResHeight: lowH,
    effectiveOrthoHeight,
    subpixelOffsetUv: new THREE.Vector2(0, 0),
  };
}

/**
 * Snaps an orthographic camera's position in camera-local X/Y axes to multiples of worldPixelSize
 * to eliminate pixel creep across static geometry when panning.
 * Returns the saved original position and the sub-pixel offset in UV space for optional smooth motion.
 */
export function snapCameraToPixelGrid(
  camera: THREE.Camera,
  grid: ComputedCameraGrid,
  config: CameraSnapConfig,
  overrideStep?: number
): THREE.Vector3 | null {
  if (!config.snapCameraPosition || !(camera instanceof THREE.OrthographicCamera)) {
    grid.subpixelOffsetUv.set(0, 0);
    return null;
  }

  const saved = camera.position.clone();
  const step = Math.max(1e-5, overrideStep ?? grid.worldPixelSize);

  camera.updateMatrixWorld();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).normalize();
  const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize();
  const forward = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).normalize();

  const xProj = saved.dot(right);
  const yProj = saved.dot(up);
  const zProj = saved.dot(forward);

  const snappedX = Math.round(xProj / step) * step;
  const snappedY = Math.round(yProj / step) * step;

  const deltaX = xProj - snappedX;
  const deltaY = yProj - snappedY;

  camera.position
    .copy(right)
    .multiplyScalar(snappedX)
    .addScaledVector(up, snappedY)
    .addScaledVector(forward, zProj);
  camera.updateMatrixWorld();

  if (config.cameraSubpixelMotion) {
    // Subpixel offset in low-res UV coordinates so low-res quad glides smoothly on screen
    grid.subpixelOffsetUv.set(
      deltaX / (step * grid.lowResWidth),
      deltaY / (step * grid.lowResHeight)
    );
  } else {
    grid.subpixelOffsetUv.set(0, 0);
  }

  return saved;
}

/**
 * Snaps Euler angles either in World Space or Camera Space Y (billboard stepped directions).
 */
export function snapQuaternionAngles(
  quaternion: THREE.Quaternion,
  camera: THREE.Camera,
  mode: AngleSnapMode,
  angleResolutionDeg: number
): THREE.Quaternion {
  if (mode === 'none' || angleResolutionDeg <= 0.001) {
    return quaternion.clone();
  }
  const rad = THREE.MathUtils.degToRad(angleResolutionDeg);

  if (mode === 'world_space') {
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
    euler.x = Math.round(euler.x / rad) * rad;
    euler.y = Math.round(euler.y / rad) * rad;
    euler.z = Math.round(euler.z / rad) * rad;
    return new THREE.Quaternion().setFromEuler(euler);
  }

  // camera_space_y: snap X/Z in world space, snap yaw Y relative to camera forward azimuth
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  const camYaw = Math.atan2(camDir.x, camDir.z);

  const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
  euler.x = Math.round(euler.x / rad) * rad;
  euler.z = Math.round(euler.z / rad) * rad;
  const relYaw = euler.y - camYaw;
  const snappedRelYaw = Math.round(relYaw / rad) * rad;
  euler.y = camYaw + snappedRelYaw;
  return new THREE.Quaternion().setFromEuler(euler);
}

/**
 * Snaps an object's world position onto the camera's macropixel grid (in camera-space X/Y)
 * to eliminate pixel creep. Supports Align Pixel Grid relative to a reference transform.
 */
export function snapObjectForRender(
  object: THREE.Object3D,
  camera: THREE.Camera,
  worldPixelSize: number,
  snap: SnapOptions,
  gridReference?: THREE.Object3D | null
): SavedTransform {
  const saved: SavedTransform = {
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone(),
  };

  if (snap.angleSnapMode !== 'none') {
    const worldQuat = new THREE.Quaternion();
    object.getWorldQuaternion(worldQuat);
    const snappedWorldQuat = snapQuaternionAngles(
      worldQuat,
      camera,
      snap.angleSnapMode,
      snap.angleResolutionDeg
    );
    if (object.parent) {
      const parentWorldQuat = new THREE.Quaternion();
      object.parent.getWorldQuaternion(parentWorldQuat);
      object.quaternion.copy(parentWorldQuat.invert().multiply(snappedWorldQuat));
    } else {
      object.quaternion.copy(snappedWorldQuat);
    }
  }

  if (snap.snapPosition) {
    const macroStep = Math.max(
      1e-5,
      worldPixelSize * Math.max(1, snap.alignPixelGrid ? snap.alignmentPixelSize : 1)
    );

    camera.updateMatrixWorld();
    object.updateMatrixWorld(true);

    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize();
    const forward = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).normalize();

    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    let originOffsetX = 0;
    let originOffsetY = 0;
    if (snap.alignPixelGrid && gridReference && gridReference !== object) {
      const refWorld = new THREE.Vector3();
      gridReference.getWorldPosition(refWorld);
      originOffsetX = refWorld.dot(right);
      originOffsetY = refWorld.dot(up);
    }

    const x = worldPos.dot(right) - originOffsetX;
    const y = worldPos.dot(up) - originOffsetY;
    const z = worldPos.dot(forward);

    const sx = Math.round(x / macroStep) * macroStep + originOffsetX;
    const sy = Math.round(y / macroStep) * macroStep + originOffsetY;

    const snappedWorld = new THREE.Vector3()
      .copy(right)
      .multiplyScalar(sx)
      .addScaledVector(up, sy)
      .addScaledVector(forward, z);

    if (object.parent) {
      object.parent.worldToLocal(snappedWorld);
    }
    object.position.copy(snappedWorld);
  }

  object.updateMatrixWorld(true);
  return saved;
}

export function restoreObjectTransform(
  object: THREE.Object3D,
  saved: SavedTransform
): void {
  object.position.copy(saved.position);
  object.quaternion.copy(saved.quaternion);
  object.scale.copy(saved.scale);
  object.updateMatrixWorld(true);
}

/**
 * Projects a world position to pixel coordinates in the target render buffer (origin bottom-left).
 */
export function projectWorldToBufferPixel(
  worldPos: THREE.Vector3,
  camera: THREE.Camera,
  bufferWidth: number,
  bufferHeight: number
): THREE.Vector2 {
  const ndc = worldPos.clone().project(camera);
  const px = (ndc.x * 0.5 + 0.5) * bufferWidth;
  const py = (ndc.y * 0.5 + 0.5) * bufferHeight;
  return new THREE.Vector2(Math.round(px), Math.round(py));
}

/** 2:1 Dimetric ("Pixel-art iso") pitch angle: atan(0.5) ~= 26.565 deg */
export const DIMETRIC_2_1_PITCH_RAD = Math.atan(0.5);

/** True Isometric pitch angle: atan(1 / sqrt(2)) ~= 35.264 deg */
export const TRUE_ISOMETRIC_PITCH_RAD = Math.atan(1 / Math.SQRT2);

/** Standard 8-direction isometric yaw step: PI / 4 (45 deg) */
export const ISO_YAW_STEP_RAD = Math.PI / 4;

/**
 * Returns the camera elevation pitch in radians for the given isometric projection mode.
 */
export function getIsometricPitchRad(mode: IsoProjectionMode): number {
  return mode === 'true_iso' ? TRUE_ISOMETRIC_PITCH_RAD : DIMETRIC_2_1_PITCH_RAD;
}

/**
 * Returns the vertical-to-horizontal projection ratio tan(pitch) for the given mode.
 * Returns exact 0.5 for 'dimetric_2_1' (2:1 pixel-art iso).
 */
export function getDimetricVerticalRatio(mode: IsoProjectionMode): number {
  return mode === 'true_iso' ? 1 / Math.SQRT2 : 0.5;
}

/**
 * Computes an orthographic camera world position orbiting `target` at `distance`,
 * azimuth `yawRad`, and elevation pitch determined by `mode`.
 */
export function computeIsometricCameraPosition(
  target: THREE.Vector3,
  distance: number,
  yawRad: number,
  mode: IsoProjectionMode
): THREE.Vector3 {
  const pitchRad = getIsometricPitchRad(mode);
  const horizDist = distance * Math.cos(pitchRad);
  return new THREE.Vector3(
    target.x + Math.sin(yawRad) * horizDist,
    target.y + distance * Math.sin(pitchRad),
    target.z + Math.cos(yawRad) * horizDist
  );
}

/**
 * Snaps a world-space position onto the dimetric/isometric pixel grid so that
 * horizontal and vertical projections align cleanly to multiples of `worldPixelSize`
 * without subpixel creep.
 */
export function snapToDimetricWorldGrid(
  pos: THREE.Vector3,
  worldPixelSize: number,
  mode: IsoProjectionMode = 'dimetric_2_1'
): THREE.Vector3 {
  const step = Math.max(1e-5, Number.isFinite(worldPixelSize) ? worldPixelSize : 1e-5);
  const pitchRad = getIsometricPitchRad(mode);
  const yStep = step / Math.cos(pitchRad);
  const zStep = step / Math.sin(pitchRad);

  return new THREE.Vector3(
    Math.round(pos.x / step) * step,
    Math.round(pos.y / yStep) * yStep,
    Math.round(pos.z / zStep) * zStep
  );
}
