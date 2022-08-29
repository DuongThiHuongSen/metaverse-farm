import * as THREE from "three";
import * as CANNON from "cannon-es";

import { SimulationFrame } from "components/sn-metaverse/physics/spring_simulator";
import { Space } from 'components/sn-metaverse/consts/enums/Space';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupMeshProperties(child: any): void {
  child.castShadow = true;
  child.receiveShadow = true;

  if (child.material.map !== null) {
    const mat = new THREE.MeshPhongMaterial();
    mat.shininess = 0;
    mat.name = child.material.name;
    mat.map = child.material.map;
    mat.aoMap = child.material.aoMap;
    mat.transparent = child.material.transparent;
    // mat.skinning = child.material.skinning;
    child.material = mat;
  }
}

export function cannonVector(vec: THREE.Vector3): CANNON.Vec3 {
  return new CANNON.Vec3(vec.x, vec.y, vec.z);
}

export function threeVector(vec: CANNON.Vec3): THREE.Vector3 {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}

export function threeQuat(quat: CANNON.Quaternion): THREE.Quaternion {
  return new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
}

export function cannonQuat(quat: THREE.Quaternion): CANNON.Quaternion {
  return new CANNON.Quaternion(quat.x, quat.y, quat.z, quat.w);
}

export function getRight(
  obj: THREE.Object3D,
  space: Space = Space.GLOBAL,
): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[0],
    matrix.elements[1],
    matrix.elements[2],
  );
}

export function getUp(
  obj: THREE.Object3D,
  space: Space = Space.GLOBAL,
): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[4],
    matrix.elements[5],
    matrix.elements[6],
  );
}

export function getForward(
  obj: THREE.Object3D,
  space: Space = Space.GLOBAL,
): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    matrix.elements[8],
    matrix.elements[9],
    matrix.elements[10],
  );
}

export function getBack(
  obj: THREE.Object3D,
  space: Space = Space.GLOBAL,
): THREE.Vector3 {
  const matrix = getMatrix(obj, space);
  return new THREE.Vector3(
    -matrix.elements[8],
    -matrix.elements[9],
    -matrix.elements[10],
  );
}

export function getMatrix(obj: THREE.Object3D, space: Space): THREE.Matrix4 {
  switch (space) {
    case Space.LOCAL:
      return obj.matrix;
    case Space.GLOBAL:
      return obj.matrixWorld;
  }
}

export function spring(
  source: number,
  dest: number,
  velocity: number,
  mass: number,
  damping: number,
): SimulationFrame {
  let acceleration = dest - source;
  acceleration /= mass;
  velocity += acceleration;
  velocity *= damping;

  const position = source + velocity;

  return new SimulationFrame(position, velocity);
}

export function springV(
  source: THREE.Vector3,
  dest: THREE.Vector3,
  velocity: THREE.Vector3,
  mass: number,
  damping: number,
): void {
  const acceleration = new THREE.Vector3().subVectors(dest, source);
  acceleration.divideScalar(mass);
  velocity.add(acceleration);
  velocity.multiplyScalar(damping);
  source.add(velocity);
}

export function getAngleBetweenVectors(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  dotTreshold = 0.0005,
): number {
  let angle: number;
  const dot = v1.dot(v2);

  // If dot is close to 1, we'll round angle to zero
  if (dot > 1 - dotTreshold) {
    angle = 0;
  } else {
    // Dot too close to -1
    if (dot < -1 + dotTreshold) {
      angle = Math.PI;
    } else {
      // Get angle difference in radians
      angle = Math.acos(dot);
    }
  }

  return angle;
}

export function getSignedAngleBetweenVectors(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  normal: THREE.Vector3 = new THREE.Vector3(0, 1, 0),
  dotTreshold = 0.0005,
): number {
  let angle = getAngleBetweenVectors(v1, v2, dotTreshold);

  // Get vector pointing up or down
  const cross = new THREE.Vector3().crossVectors(v1, v2);
  // Compare cross with normal to find out direction
  if (normal.dot(cross) < 0) {
    angle = -angle;
  }

  return angle;
}

export function haveDifferentSigns(n1: number, n2: number): boolean {
  return n1 < 0 !== n2 < 0;
}

export function appplyVectorMatrixXZ(
  a: THREE.Vector3,
  b: THREE.Vector3,
): THREE.Vector3 {
  return new THREE.Vector3(a.x * b.z + a.z * b.x, b.y, a.z * b.z + -a.x * b.x);
}
