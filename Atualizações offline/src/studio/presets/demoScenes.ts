import * as THREE from 'three';
import {
  PixelizerMaterial,
  type PixelizerMaterialResources,
} from '../../engine/PixelizerMaterial';
import type { PixelizerObjectAttachment } from '../../engine/PixelizerPipeline';
import type { PixelizerMaterialOptions, SnapOptions } from '../../engine/types';

export type DemoPresetId =
  | 'rover'
  | 'knight'
  | 'creep_lab'
  | 'relic_chest'
  | 'hybrid_diorama';

export interface SceneItemEntry {
  id: string;
  label: string;
  object: THREE.Object3D;
  materials: PixelizerMaterial[];
  snapTarget: THREE.Object3D;
}

export interface BuiltDemoScene {
  id: DemoPresetId;
  name: string;
  description: string;
  subjectRoot: THREE.Group;
  sceneRoot: THREE.Group;
  items: SceneItemEntry[];
  updateAnimation: (quantizedTime: number, motionTestActive: boolean) => void;
}

function makeSnap(overrides: Partial<SnapOptions> = {}): SnapOptions {
  return {
    snapPosition: true,
    alignPixelGrid: true,
    alignmentPixelSize: 3,
    angleSnapMode: 'none',
    angleResolutionDeg: 45,
    ...overrides,
  };
}

function attachPixelizer(
  obj: THREE.Object3D,
  snap: SnapOptions,
  gridReference?: THREE.Object3D | null
): void {
  obj.userData.pixelizer = {
    snap,
    gridReference: gridReference ?? obj,
  } satisfies PixelizerObjectAttachment;
}

function createCheckerFloorTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#232836';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#2b3242';
  ctx.fillRect(0, 0, size / 2, size / 2);
  ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
  ctx.strokeStyle = '#364055';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

let cachedFloorTex: THREE.CanvasTexture | null = null;
function getFloorTex(): THREE.CanvasTexture {
  if (!cachedFloorTex) {
    cachedFloorTex = createCheckerFloorTexture();
    cachedFloorTex.userData = { ...cachedFloorTex.userData, pooled: true };
  }
  return cachedFloorTex;
}

function makeMesh(
  name: string,
  geo: THREE.BufferGeometry,
  matOpts: PixelizerMaterialOptions,
  res: PixelizerMaterialResources,
  snap: SnapOptions,
  gridRef?: THREE.Object3D
): { mesh: THREE.Mesh; mat: PixelizerMaterial } {
  const mat = new PixelizerMaterial(matOpts, res);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  attachPixelizer(mesh, snap, gridRef ?? mesh);
  return { mesh, mat };
}

function createGroundPlane(
  res: PixelizerMaterialResources,
  pixelated = false,
  pixelSize = 2
): { mesh: THREE.Mesh; mat: PixelizerMaterial } {
  const mat = new PixelizerMaterial(
    {
      pixelated,
      pixelSize,
      objectId: 0,
      outlineAlpha: 0,
      edgeHighlight: 0.5,
      edgeBevelWeight: 0,
      baseColor: '#98a6bf',
      albedoMap: getFloorTex(),
      smoothness: 0.05,
      useColorGrading: pixelated,
      ambientConstantWeight: 0.25,
    },
    res
  );
  const geo = new THREE.CylinderGeometry(5.5, 5.8, 0.28, 32);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'Ground Platform';
  mesh.position.set(0, -0.14, 0);
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  attachPixelizer(mesh, makeSnap({ snapPosition: false, alignPixelGrid: false }));
  return { mesh, mat };
}

export function buildDemoScene(
  presetId: DemoPresetId,
  res: PixelizerMaterialResources
): BuiltDemoScene {
  const sceneRoot = new THREE.Group();
  const subjectRoot = new THREE.Group();
  sceneRoot.add(subjectRoot);
  const items: SceneItemEntry[] = [];

  if (presetId === 'rover') {
    const floor = createGroundPlane(res, false);
    sceneRoot.add(floor.mesh);
    items.push({
      id: 'ground',
      label: 'Ground (Unpixelated Hybrid)',
      object: floor.mesh,
      materials: [floor.mat],
      snapTarget: floor.mesh,
    });

    const rover = new THREE.Group();
    rover.name = 'Hover Rover';
    attachPixelizer(rover, makeSnap({ alignmentPixelSize: 3 }));
    subjectRoot.add(rover);

    const chassisSnap = makeSnap({ alignmentPixelSize: 3 });
    const hull = makeMesh(
      'Hull',
      new THREE.BoxGeometry(1.5, 0.55, 2.2),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 1,
        baseColor: '#d96b38',
        outlineColor: '#14101c',
        edgeHighlight: 0.3,
        edgeBevelWeight: 0.85,
        smoothness: 0.25,
      },
      res,
      chassisSnap,
      rover
    );
    hull.mesh.position.set(0, 0.72, 0);
    rover.add(hull.mesh);

    const cabin = makeMesh(
      'Cockpit',
      new THREE.BoxGeometry(1.05, 0.48, 1.05),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 1,
        baseColor: '#2ea8d6',
        outlineColor: '#14101c',
        edgeHighlight: 0.65,
        edgeBevelWeight: 0.75,
        smoothness: 0.75,
      },
      res,
      chassisSnap,
      rover
    );
    cabin.mesh.position.set(0, 1.18, -0.15);
    rover.add(cabin.mesh);

    // Thrusters / Wheels (shared objectId = 1 so silhouette merges cleanly!)
    const podMat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 1,
        baseColor: '#485269',
        outlineColor: '#14101c',
        edgeHighlight: 0.28,
        edgeBevelWeight: 0.7,
        workflow: 'metallic',
        metallic: 0.55,
        smoothness: 0.4,
      },
      res
    );
    const podGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.26, 12);
    podGeo.rotateZ(Math.PI / 2);
    const podOffsets: [number, number, number][] = [
      [-0.86, 0.45, 0.72],
      [0.86, 0.45, 0.72],
      [-0.86, 0.45, -0.72],
      [0.86, 0.45, -0.72],
    ];
    for (const [x, y, z] of podOffsets) {
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(x, y, z);
      pod.castShadow = true;
      pod.receiveShadow = true;
      attachPixelizer(pod, chassisSnap, rover);
      rover.add(pod);
    }

    // Glowing Headlights
    const lampMat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 1,
        baseColor: '#ffe07d',
        emissionColor: '#ffbf3f',
        emissionIntensity: 1.3,
        outlineColor: '#14101c',
      },
      res
    );
    const lampGeo = new THREE.BoxGeometry(0.28, 0.14, 0.12);
    for (const sx of [-0.45, 0.45]) {
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(sx, 0.74, 1.12);
      attachPixelizer(lamp, chassisSnap, rover);
      rover.add(lamp);
    }

    // Spinning Radar Dish
    const dish = makeMesh(
      'Radar',
      new THREE.ConeGeometry(0.28, 0.35, 8),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 1,
        baseColor: '#ead4aa',
        outlineColor: '#14101c',
        edgeBevelWeight: 0.8,
      },
      res,
      chassisSnap,
      rover
    );
    dish.mesh.position.set(0, 1.58, -0.2);
    dish.mesh.rotation.x = Math.PI * 0.7;
    rover.add(dish.mesh);

    // Companion Drone (different Object ID = 2 & finer Pixel Size = 2x!)
    const drone = makeMesh(
      'Scout Drone',
      new THREE.OctahedronGeometry(0.34, 1),
      {
        pixelated: true,
        pixelSize: 2,
        objectId: 2,
        baseColor: '#63c74d',
        emissionColor: '#3ce66d',
        emissionIntensity: 0.35,
        outlineColor: '#101b16',
        edgeHighlight: 0.72,
        edgeBevelWeight: 0.85,
        smoothness: 0.45,
      },
      res,
      makeSnap({ alignmentPixelSize: 2 })
    );
    drone.mesh.position.set(1.35, 1.65, 0.4);
    subjectRoot.add(drone.mesh);

    items.push({
      id: 'rover_body',
      label: 'Hover Rover (ID 1 · 3×3)',
      object: rover,
      materials: [hull.mat, cabin.mat, podMat, lampMat, dish.mat],
      snapTarget: rover,
    });
    items.push({
      id: 'drone',
      label: 'Scout Drone (ID 2 · 2×2)',
      object: drone.mesh,
      materials: [drone.mat],
      snapTarget: drone.mesh,
    });

    return {
      id: 'rover',
      name: 'Hover Rover & Scout Drone',
      description:
        'Multi-part chassis sharing Object ID 1 with aligned pixel grids + independent 2×2 Scout Drone (ID 2) casting solid shadows onto an unpixelated ground.',
      subjectRoot,
      sceneRoot,
      items,
      updateAnimation: (t, motionTest) => {
        rover.position.y = Math.sin(t * 2.5) * 0.08;
        if (motionTest) {
          rover.position.x = Math.sin(t * 0.9) * 1.4;
          rover.position.z = Math.cos(t * 0.9) * 0.8;
        } else {
          rover.position.x = 0;
          rover.position.z = 0;
        }
        dish.mesh.rotation.y = t * 2.4;
        drone.mesh.position.set(
          rover.position.x + Math.cos(t * 1.6) * 1.55,
          1.75 + Math.sin(t * 3.1) * 0.22,
          rover.position.z + Math.sin(t * 1.6) * 1.15
        );
        drone.mesh.rotation.y = -t * 1.8;
      },
    };
  }

  if (presetId === 'knight') {
    const floor = createGroundPlane(res, false);
    sceneRoot.add(floor.mesh);
    items.push({
      id: 'ground',
      label: 'Arena Floor (Unpixelated)',
      object: floor.mesh,
      materials: [floor.mat],
      snapTarget: floor.mesh,
    });

    const knight = new THREE.Group();
    knight.name = 'Pixel Knight';
    const rootSnap = makeSnap({
      alignmentPixelSize: 3,
      angleSnapMode: 'camera_space_y',
      angleResolutionDeg: 45,
    });
    attachPixelizer(knight, rootSnap);
    subjectRoot.add(knight);

    const partSnap = makeSnap({ alignmentPixelSize: 3 });

    const armor = makeMesh(
      'Armor Torso',
      new THREE.BoxGeometry(0.85, 0.95, 0.55),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#8b9bb4',
        workflow: 'metallic',
        metallic: 0.72,
        smoothness: 0.52,
        outlineColor: '#14101c',
        edgeHighlight: 0.7,
        edgeBevelWeight: 0.85,
      },
      res,
      partSnap,
      knight
    );
    armor.mesh.position.set(0, 1.15, 0);
    knight.add(armor.mesh);

    const helmet = makeMesh(
      'Helmet',
      new THREE.BoxGeometry(0.66, 0.62, 0.64),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#c0cbdc',
        workflow: 'metallic',
        metallic: 0.8,
        smoothness: 0.6,
        outlineColor: '#14101c',
        edgeHighlight: 0.75,
        edgeBevelWeight: 0.9,
      },
      res,
      partSnap,
      knight
    );
    helmet.mesh.position.set(0, 1.98, 0);
    knight.add(helmet.mesh);

    const plume = makeMesh(
      'Plume',
      new THREE.BoxGeometry(0.18, 0.36, 0.65),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#e43b44',
        outlineColor: '#14101c',
        edgeBevelWeight: 0.5,
      },
      res,
      partSnap,
      knight
    );
    plume.mesh.position.set(0, 2.42, -0.05);
    knight.add(plume.mesh);

    const cape = makeMesh(
      'Cape',
      new THREE.BoxGeometry(0.8, 1.05, 0.14),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#a22633',
        outlineColor: '#14101c',
        edgeHighlight: 0.35,
      },
      res,
      partSnap,
      knight
    );
    cape.mesh.position.set(0, 1.05, -0.35);
    cape.mesh.rotation.x = 0.16;
    knight.add(cape.mesh);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.3, 0.68, 0.34);
    const legL = makeMesh(
      'Left Leg',
      legGeo,
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#3a4466',
        outlineColor: '#14101c',
      },
      res,
      partSnap,
      knight
    );
    legL.mesh.position.set(-0.22, 0.34, 0);
    const legR = makeMesh(
      'Right Leg',
      legGeo,
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#3a4466',
        outlineColor: '#14101c',
      },
      res,
      partSnap,
      knight
    );
    legR.mesh.position.set(0.22, 0.34, 0);
    knight.add(legL.mesh, legR.mesh);

    // Sword & Shield (Aligned Pixel Grid + Shared ID 10 OR independent)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0.68, 1.2, 0.12);
    knight.add(swordGroup);

    const blade = makeMesh(
      'Sword Blade',
      new THREE.BoxGeometry(0.14, 1.25, 0.08),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#e8f1ff',
        emissionColor: '#4fb3d9',
        emissionIntensity: 0.25,
        workflow: 'metallic',
        metallic: 0.9,
        smoothness: 0.8,
        outlineColor: '#14101c',
        edgeHighlight: 0.85,
        edgeBevelWeight: 0.95,
      },
      res,
      partSnap,
      knight
    );
    blade.mesh.position.set(0, 0.52, 0.22);
    blade.mesh.rotation.x = 0.55;
    swordGroup.add(blade.mesh);

    const shield = makeMesh(
      'Shield',
      new THREE.BoxGeometry(0.16, 0.78, 0.65),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 10,
        baseColor: '#124e89',
        outlineColor: '#14101c',
        edgeHighlight: 0.78,
        edgeBevelWeight: 0.9,
      },
      res,
      partSnap,
      knight
    );
    shield.mesh.position.set(-0.62, 1.15, 0.22);
    knight.add(shield.mesh);

    items.push({
      id: 'knight_body',
      label: 'Knight Armor (ID 10 · 3×3)',
      object: knight,
      materials: [
        armor.mat,
        helmet.mat,
        plume.mat,
        cape.mat,
        legL.mat,
        legR.mat,
      ],
      snapTarget: knight,
    });
    items.push({
      id: 'knight_gear',
      label: 'Sword & Shield (Aligned Grid)',
      object: swordGroup,
      materials: [blade.mat, shield.mat],
      snapTarget: knight,
    });

    return {
      id: 'knight',
      name: 'Pixel Knight & Equipment',
      description:
        'Demonstrates shared Object ID 10 merging character + sword + shield into one sprite silhouette, Camera Space Y 45° angle snapping, and stepped flipbook walk cycle.',
      subjectRoot,
      sceneRoot,
      items,
      updateAnimation: (t, motionTest) => {
        const swing = Math.sin(t * 7.0);
        legL.mesh.rotation.x = swing * 0.55;
        legR.mesh.rotation.x = -swing * 0.55;
        swordGroup.rotation.x = -swing * 0.35;
        shield.mesh.position.y = 1.15 + Math.abs(swing) * 0.05;
        cape.mesh.rotation.x = 0.18 + Math.abs(swing) * 0.14;
        if (motionTest) {
          knight.position.x = Math.sin(t * 1.2) * 1.5;
          knight.rotation.y = Math.cos(t * 1.2) > 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
        } else {
          knight.position.x = 0;
          knight.rotation.y = t * 0.55;
        }
      },
    };
  }

  if (presetId === 'creep_lab') {
    const floor = createGroundPlane(res, false);
    sceneRoot.add(floor.mesh);
    items.push({
      id: 'ground',
      label: 'Floor (Unpixelated)',
      object: floor.mesh,
      materials: [floor.mat],
      snapTarget: floor.mesh,
    });

    // Staircase (tests Depth-tested Interior Edge Outlines!)
    const stairsGroup = new THREE.Group();
    stairsGroup.name = 'Staircase';
    attachPixelizer(stairsGroup, makeSnap({ alignmentPixelSize: 3 }));
    subjectRoot.add(stairsGroup);

    const stairMat = new PixelizerMaterial(
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 20,
        baseColor: '#8b9bb4',
        outlineColor: '#14101c',
        edgeHighlight: 0.25,
        edgeBevelWeight: 0.7,
        smoothness: 0.15,
      },
      res
    );
    for (let i = 0; i < 6; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 0.42), stairMat);
      step.position.set(-0.85, 0.14 + i * 0.28, 0.9 - i * 0.35);
      step.castShadow = true;
      step.receiveShadow = true;
      attachPixelizer(step, makeSnap({ alignmentPixelSize: 3 }), stairsGroup);
      stairsGroup.add(step);
    }

    // Moving Cube & Smooth Sphere (different IDs + pixel sizes for overlap & creep testing!)
    const moverCube = makeMesh(
      'Moving Cube (4×4)',
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      {
        pixelated: true,
        pixelSize: 4,
        objectId: 21,
        baseColor: '#f77622',
        outlineColor: '#181425',
        edgeHighlight: 0.72,
        edgeBevelWeight: 0.9,
      },
      res,
      makeSnap({ alignmentPixelSize: 4 })
    );
    moverCube.mesh.position.set(1.05, 0.85, 0.55);
    subjectRoot.add(moverCube.mesh);

    const sphere = makeMesh(
      'Smooth Sphere (3×3)',
      new THREE.SphereGeometry(0.65, 24, 18),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 22,
        baseColor: '#0099db',
        outlineColor: '#181425',
        smoothness: 0.65,
        edgeBevelWeight: 0.6,
      },
      res,
      makeSnap({ alignmentPixelSize: 3 })
    );
    sphere.mesh.position.set(0.85, 1.35, -0.55);
    subjectRoot.add(sphere.mesh);

    items.push({
      id: 'stairs',
      label: 'Staircase (ID 20 · Depth Edges)',
      object: stairsGroup,
      materials: [stairMat],
      snapTarget: stairsGroup,
    });
    items.push({
      id: 'cube',
      label: 'Moving Cube (ID 21 · 4×4)',
      object: moverCube.mesh,
      materials: [moverCube.mat],
      snapTarget: moverCube.mesh,
    });
    items.push({
      id: 'sphere',
      label: 'Smooth Sphere (ID 22 · 3×3)',
      object: sphere.mesh,
      materials: [sphere.mat],
      snapTarget: sphere.mesh,
    });

    return {
      id: 'creep_lab',
      name: 'Pixel Creep & Edge Lab',
      description:
        'Test bench for Depth-Tested ID Outlines (cube overlapping sphere/stairs), Depth-Tested Staircase Edges (flat normals), and Pixel Creep Snapping during smooth motion.',
      subjectRoot,
      sceneRoot,
      items,
      updateAnimation: (t, motionTest) => {
        const amp = motionTest ? 1.25 : 0.45;
        moverCube.mesh.position.x = 0.95 + Math.sin(t * 1.1) * amp;
        moverCube.mesh.position.y = 0.85 + Math.abs(Math.cos(t * 1.5)) * 0.35;
        moverCube.mesh.rotation.y = t * 0.6;
        sphere.mesh.position.y = 1.25 + Math.sin(t * 1.8) * 0.28;
      },
    };
  }

  if (presetId === 'relic_chest') {
    const floor = createGroundPlane(res, false);
    sceneRoot.add(floor.mesh);
    items.push({
      id: 'ground',
      label: 'Pedestal Floor',
      object: floor.mesh,
      materials: [floor.mat],
      snapTarget: floor.mesh,
    });

    const chestGroup = new THREE.Group();
    chestGroup.name = 'Relic Chest';
    attachPixelizer(chestGroup, makeSnap({ alignmentPixelSize: 3 }));
    subjectRoot.add(chestGroup);

    const wood = makeMesh(
      'Chest Body',
      new THREE.BoxGeometry(1.45, 0.85, 0.98),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 30,
        baseColor: '#733e39',
        outlineColor: '#181425',
        edgeHighlight: 0.32,
        edgeBevelWeight: 0.85,
        smoothness: 0.15,
      },
      res,
      makeSnap({ alignmentPixelSize: 3 }),
      chestGroup
    );
    wood.mesh.position.set(0, 0.44, 0);
    chestGroup.add(wood.mesh);

    const gold = makeMesh(
      'Gold Trim',
      new THREE.BoxGeometry(1.52, 0.2, 1.04),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 30,
        baseColor: '#feae34',
        workflow: 'metallic',
        metallic: 0.9,
        smoothness: 0.78,
        outlineColor: '#181425',
        edgeHighlight: 0.85,
        edgeBevelWeight: 0.95,
      },
      res,
      makeSnap({ alignmentPixelSize: 3 }),
      chestGroup
    );
    gold.mesh.position.set(0, 0.84, 0);
    chestGroup.add(gold.mesh);

    const lid = makeMesh(
      'Chest Lid',
      new THREE.CylinderGeometry(0.49, 0.49, 1.44, 10, 1, false, 0, Math.PI),
      {
        pixelated: true,
        pixelSize: 3,
        objectId: 30,
        baseColor: '#8d4c41',
        outlineColor: '#181425',
        edgeHighlight: 0.35,
        edgeBevelWeight: 0.8,
      },
      res,
      makeSnap({ alignmentPixelSize: 3 }),
      chestGroup
    );
    lid.mesh.rotation.z = Math.PI / 2;
    lid.mesh.rotation.x = Math.PI / 2;
    lid.mesh.position.set(0, 0.88, 0);
    chestGroup.add(lid.mesh);

    const crystal = makeMesh(
      'Arcane Relic Crystal',
      new THREE.OctahedronGeometry(0.38, 0),
      {
        pixelated: true,
        pixelSize: 2,
        objectId: 31,
        baseColor: '#2ce8f5',
        emissionColor: '#00c8ff',
        emissionIntensity: 0.95,
        outlineColor: '#12243a',
        edgeHighlight: 0.9,
        edgeBevelWeight: 1.0,
        smoothness: 0.9,
      },
      res,
      makeSnap({ alignmentPixelSize: 2 })
    );
    crystal.mesh.position.set(0, 1.85, 0);
    subjectRoot.add(crystal.mesh);

    items.push({
      id: 'chest',
      label: 'Relic Chest (ID 30 · Metallic Trim)',
      object: chestGroup,
      materials: [wood.mat, gold.mat, lid.mat],
      snapTarget: chestGroup,
    });
    items.push({
      id: 'crystal',
      label: 'Arcane Crystal (ID 31 · 2×2 Emissive)',
      object: crystal.mesh,
      materials: [crystal.mat],
      snapTarget: crystal.mesh,
    });

    return {
      id: 'relic_chest',
      name: 'Relic Chest & Arcane Crystal',
      description:
        'High-contrast metallic gold bevel highlights + HDR emissive crystal floating at finer 2×2 macropixels.',
      subjectRoot,
      sceneRoot,
      items,
      updateAnimation: (t, motionTest) => {
        crystal.mesh.position.y = 1.88 + Math.sin(t * 2.4) * 0.16;
        crystal.mesh.rotation.y = t * 1.4;
        if (motionTest) {
          chestGroup.position.x = Math.sin(t * 0.9) * 1.1;
          crystal.mesh.position.x = chestGroup.position.x;
        } else {
          chestGroup.position.x = 0;
          crystal.mesh.position.x = 0;
        }
      },
    };
  }

  // hybrid_diorama
  const floor = createGroundPlane(res, false);
  sceneRoot.add(floor.mesh);
  items.push({
    id: 'ground',
    label: 'Stone Floor (Unpixelated 3D)',
    object: floor.mesh,
    materials: [floor.mat],
    snapTarget: floor.mesh,
  });

  const pillar = makeMesh(
    'Unpixelated Temple Pillar',
    new THREE.CylinderGeometry(0.42, 0.48, 2.2, 8),
    {
      pixelated: false,
      objectId: 0,
      baseColor: '#63718a',
      smoothness: 0.2,
      useColorGrading: false,
    },
    res,
    makeSnap({ snapPosition: false })
  );
  pillar.mesh.position.set(-1.35, 1.1, -0.8);
  sceneRoot.add(pillar.mesh);

  const golem = makeMesh(
    'Pixel Golem (4×4)',
    new THREE.IcosahedronGeometry(0.75, 1),
    {
      pixelated: true,
      pixelSize: 4,
      objectId: 40,
      baseColor: '#3e8948',
      outlineColor: '#121c16',
      edgeHighlight: 0.25,
      edgeBevelWeight: 0.85,
      smoothness: 0.35,
    },
    res,
    makeSnap({ alignmentPixelSize: 4 })
  );
  golem.mesh.position.set(0.1, 0.95, 0.15);
  subjectRoot.add(golem.mesh);

  const orb = makeMesh(
    'Orbiting Orb (2×2)',
    new THREE.TorusKnotGeometry(0.28, 0.09, 48, 8),
    {
      pixelated: true,
      pixelSize: 2,
      objectId: 41,
      baseColor: '#ff77a8',
      emissionColor: '#ff004d',
      emissionIntensity: 0.45,
      outlineColor: '#1d0d1c',
      edgeHighlight: 0.78,
      edgeBevelWeight: 0.9,
      smoothness: 0.75,
    },
    res,
    makeSnap({ alignmentPixelSize: 2 })
  );
  orb.mesh.position.set(1.1, 1.65, 0.5);
  subjectRoot.add(orb.mesh);

  items.push({
    id: 'pillar',
    label: 'Temple Pillar (Unpixelated)',
    object: pillar.mesh,
    materials: [pillar.mat],
    snapTarget: pillar.mesh,
  });
  items.push({
    id: 'golem',
    label: 'Pixel Golem (ID 40 · 4×4)',
    object: golem.mesh,
    materials: [golem.mat],
    snapTarget: golem.mesh,
  });
  items.push({
    id: 'orb',
    label: 'Torus Knot Orb (ID 41 · 2×2)',
    object: orb.mesh,
    materials: [orb.mat],
    snapTarget: orb.mesh,
  });

  return {
    id: 'hybrid_diorama',
    name: 'Hybrid 3D + Pixel Diorama',
    description:
      'Breath of Fire IV inspired hybrid rendering: unpixelated 3D temple pillar & ground mixed seamlessly with 4×4 Golem and 2×2 Torus Knot.',
    subjectRoot,
    sceneRoot,
    items,
    updateAnimation: (t, motionTest) => {
      golem.mesh.position.y = 0.95 + Math.sin(t * 2.0) * 0.12;
      golem.mesh.rotation.y = t * 0.45;
      if (motionTest) {
        golem.mesh.position.x = Math.sin(t * 1.1) * 1.1;
      } else {
        golem.mesh.position.x = 0.1;
      }
      orb.mesh.position.set(
        Math.cos(t * 1.4) * 1.4,
        1.55 + Math.sin(t * 2.8) * 0.25,
        Math.sin(t * 1.4) * 1.2
      );
      orb.mesh.rotation.x = t * 1.1;
      orb.mesh.rotation.y = t * 1.7;
    },
  };
}
