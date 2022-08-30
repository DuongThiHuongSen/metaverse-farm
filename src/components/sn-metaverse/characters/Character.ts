import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as LODASH from "lodash";


import {
  VectorSpringSimulator,
  RelativeSpringSimulator,
} from "../physics/spring_simulator";
import { IWorldEntity } from "../consts/types/IWorldEntity";
import { CollisionGroups, EntityType, EntityUpdateOrder } from 'components/sn-metaverse/consts/enums';
import { World } from 'components/sn-metaverse/world/world';
import { CapsuleCollider } from "components/sn-metaverse/physics/colliders";
import { KeyBinding } from 'components/sn-metaverse/core/KeyBinding';
import { ICharacterState, IControllable} from "components/sn-metaverse/consts/types";
import * as Utils from 'components/sn-metaverse/core/FunctionLibrary';
import { GroundImpactData } from './GroundImpactData';
import { Idle } from "./character_states/Idle";

export class Character extends THREE.Object3D implements IWorldEntity {
  public updateOrder: number = EntityUpdateOrder.CHARACTER;
  public entityType: EntityType = EntityType.Character;
  public world: World;
  public charState!: ICharacterState;

  public characterCapsule!: CapsuleCollider;
  public tiltContainer: THREE.Group;
  public modelContainer: THREE.Group;
  public materials: THREE.Material[] = [];
  public mixer: THREE.AnimationMixer;
  public animations: any[];
  public actions: { [action: string]: KeyBinding };

  // Movement
  public acceleration: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public velocityTarget: THREE.Vector3 = new THREE.Vector3();
  public orientation: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  public orientationTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  public arcadeVelocityInfluence: THREE.Vector3 = new THREE.Vector3();
  public moveSpeed = 4;

  public defaultVelocitySimulatorDamping = 0.8;
  public defaultVelocitySimulatorMass = 50;
  public velocitySimulator: VectorSpringSimulator;
  public defaultRotationSimulatorDamping = 0.5;
  public defaultRotationSimulatorMass = 10;
  public rotationSimulator: RelativeSpringSimulator;
  public viewVector: THREE.Vector3;
  public angularVelocity = 0;
  public arcadeVelocityIsAdditive = false;

  // Ray casting
  public raycastBox: THREE.Mesh;
  public rayResult: CANNON.RaycastResult = new CANNON.RaycastResult();
  public rayHasHit = false;
  public rayCastLength = 0.57;
  public raySafeOffset = 0.03;
  public wantsToJump = false;
  public initJumpSpeed = -1;
  public groundImpactData = new GroundImpactData();

  private physicsEnabled = true;

  public controlledObject!: IControllable;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(world: World, gltf: any) {
    super();

    this.world = world;
    this.readCharacterData(gltf);
    this.animations = gltf.animations;

    // The visuals group is centered for easy character tilting
    this.tiltContainer = new THREE.Group();
    this.add(this.tiltContainer);

    // Model container is used to reliably ground the character, as animation can alter the position of the model itself
    this.modelContainer = new THREE.Group();
    // this.modelContainer.position.y = -1.2;
    this.modelContainer.position.y = -0.6;
    this.tiltContainer.add(this.modelContainer);
    this.modelContainer.add(gltf.scene);

    this.mixer = new THREE.AnimationMixer(gltf.scene);

    this.velocitySimulator = new VectorSpringSimulator(
      60,
      this.defaultVelocitySimulatorMass,
      this.defaultVelocitySimulatorDamping,
    );
    this.rotationSimulator = new RelativeSpringSimulator(
      60,
      this.defaultRotationSimulatorMass,
      this.defaultRotationSimulatorDamping,
    );

    this.viewVector = new THREE.Vector3();

    // Actions
    this.actions = {
      up: new KeyBinding("ArrowUp", "W"),
      down: new KeyBinding("ArrowDown", "S"),
      left: new KeyBinding("ArrowLeft", "A"),
      right: new KeyBinding("ArrowRight", "D"),
      run: new KeyBinding("Shift"),
      jump: new KeyBinding(" "),
      use: new KeyBinding("E"),
      enter: new KeyBinding("F"),
      enter_passenger: new KeyBinding("G"),
      seat_switch: new KeyBinding("X"),
    };

    // Player Capsule
    this.characterCapsule = new CapsuleCollider({
      mass: 1,
      position: new CANNON.Vec3(),
      height: 0.5 * this.world.characterScale,
      radius: 0.3 * this.world.characterScale,
      segments: 8 * this.world.characterScale,
      friction: 0.0,
    });
    // capsulePhysics.physical.collisionFilterMask = ~CollisionGroups.Trimesh;
    this.characterCapsule.body.shapes.forEach((shape) => {
      // tslint:disable-next-line: no-bitwise
      shape.collisionFilterMask = ~CollisionGroups.TRIMESHCOLLIDERS;
    });
    this.characterCapsule.body.allowSleep = false;

    // Move character to different collision group for raycasting
    this.characterCapsule.body.collisionFilterGroup = 2;

    // Disable character rotation
    this.characterCapsule.body.fixedRotation = true;
    this.characterCapsule.body.updateMassProperties();

    // Raycast debug
    const boxGeo = new THREE.BoxGeometry(
      0.1 * this.world.characterScale,
      0.1 * this.world.characterScale,
      0.1 * this.world.characterScale,
    );
    const boxMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.raycastBox = new THREE.Mesh(boxGeo, boxMat);
    // this.raycastBox.visible = this.world.debug.params.debugPhysics;
    // this.rayCastLength = 0.57 * this.world.characterScale;
    this.rayCastLength = 0.57 * this.world.characterScale;
    this.raySafeOffset = 0.03 * this.world.characterScale;
    // this.raycastBox.position.set(0, -2, 0);

    this.moveSpeed = 4 * this.world.characterScale;

    this.world.physicsWorld.addEventListener("preStep", () => {
      this.physicsPreStep(this.characterCapsule.body, this);
    });

    this.world.physicsWorld.addEventListener("postStep", () => {
      this.physicsPostStep(this.characterCapsule.body, this);
    });

    this.setState(new Idle(this));
  }

  public setArcadeVelocityInfluence(
    x: number,
    y: number = x,
    z: number = x,
  ): void {
    this.arcadeVelocityInfluence.set(x, y, z);
  }

  public handleKeyboardEvent(
    event: KeyboardEvent,
    code: string,
    pressed: boolean,
  ): void {
    if (this.controlledObject) {
      this.controlledObject.handleKeyboardEvent(event, code, pressed);
    } else {
      // Free camera
      // if (code === "KeyC" && pressed === true && event.shiftKey === true) {
      //   this.resetControls();
      //   this.world.cameraOperator.characterCaller = this;
      //   this.world.inputManager.setInputReceiver(this.world.cameraOperator);
      // } else {
      for (const action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          const binding = this.actions[action];

          if (
            LODASH.includes(binding.eventCodes, code) ||
            LODASH.includes(binding.eventCodes, code.toUpperCase())
          ) {
            this.triggerAction(action, pressed);
          }
        }
      }
      // }
    }
  }

  public handleMouseButton(
    event: MouseEvent,
    code: string,
    pressed: boolean,
  ): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseButton(event, code, pressed);
    } else {
      for (const action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          const binding = this.actions[action];
          if (
            LODASH.includes(binding.eventCodes, code) ||
            LODASH.includes(binding.eventCodes, code.toUpperCase())
          ) {
            this.triggerAction(action, pressed);
          }
        }
      }
    }
  }

  public handleMouseMove(
    event: MouseEvent,
    deltaX: number,
    deltaY: number,
  ): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseMove(event, deltaX, deltaY);
    } else {
      this.world.cameraOperator.move(deltaX, deltaY);
    }
  }

  public handleMouseWheel(event: WheelEvent, value: number): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseWheel(event, value);
    } else {
      this.world.scrollTheTimeScale(value);
    }
  }

  public triggerAction(actionName: string, value: boolean): void {
    // Get action and set it's parameters
    const action = this.actions[actionName];

    if (action.isPressed !== value) {
      // Set value
      action.isPressed = value;

      // Reset the 'just' attributes
      action.justPressed = false;
      action.justReleased = false;

      // Set the 'just' attributes
      if (value) action.justPressed = true;
      else action.justReleased = true;

      // Tell player to handle states according to new inpute
      this.charState.onInputChange();

      // Reset the 'just' attributes
      action.justPressed = false;
      action.justReleased = false;
    }
  }

  public takeControl(): void {
    if (this.world !== undefined) {
      this.world.inputManager.setInputReceiver(this);
    } else {
      console.warn(
        "Attempting to take control of a character that doesn't belong to a world.",
      );
    }
  }

  public resetControls(): void {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        this.triggerAction(action, false);
      }
    }
  }

  public update(timeStep: number, unscaledTimeStep: number): void {
    this.charState?.update(timeStep);

    if (this.physicsEnabled) this.springMovement(timeStep);
    if (this.physicsEnabled) this.springRotation(timeStep);
    if (this.physicsEnabled) this.rotateModel();
    if (this.mixer !== undefined) this.mixer.update(timeStep);

    if (this.physicsEnabled) {
      this.position.set(
        this.characterCapsule.body.interpolatedPosition.x,
        this.characterCapsule.body.interpolatedPosition.y,
        this.characterCapsule.body.interpolatedPosition.z,
      );
    } else {
      const newPos = new THREE.Vector3();
      this.getWorldPosition(newPos);

      this.characterCapsule.body.position.copy(Utils.cannonVector(newPos));
      this.characterCapsule.body.interpolatedPosition.copy(
        Utils.cannonVector(newPos),
      );
    }

    this.updateMatrixWorld();
  }

  public inputReceiverInit(): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.inputReceiverInit();
      return;
    }

    this.world.cameraOperator.setRadius(3 * this.world.characterScale, true);
    this.world.cameraOperator.followMode = false;
    // this.world.dirLight.target = this;
  }

  public inputReceiverUpdate(timeStep: number): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.inputReceiverUpdate(timeStep);
    } else {
      // Look in camera's direction
      this.viewVector = new THREE.Vector3().subVectors(
        this.position,
        this.world.camera.position,
      );
      this.getWorldPosition(this.world.cameraOperator.target);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readCharacterData(gltf: any): void {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        Utils.setupMeshProperties(child);

        if (child.material) {
          this.materials.push(child.material);
        }
      }
    });
  }

  public setState(state: ICharacterState): void {
    this.charState = state;
    this.charState.onInputChange();
  }

  public setPosition(x: number, y: number, z: number): void {
    if (this.physicsEnabled) {
      this.characterCapsule.body.previousPosition = new CANNON.Vec3(x, y, z);
      this.characterCapsule.body.position = new CANNON.Vec3(x, y, z);
      this.characterCapsule.body.interpolatedPosition = new CANNON.Vec3(
        x,
        y,
        z,
      );
    } else {
      this.position.x = x;
      this.position.y = y;
      this.position.z = z;
    }
  }

  public springMovement(timeStep: number): void {
    // Simulator
    this.velocitySimulator.target.copy(this.velocityTarget);
    this.velocitySimulator.simulate(timeStep);
    // Update values
    this.velocity.copy(this.velocitySimulator.position);
    this.acceleration.copy(this.velocitySimulator.velocity);
  }

  public springRotation(timeStep: number): void {
    // Spring rotation
    // Figure out angle between current and target orientation
    const angle = Utils.getSignedAngleBetweenVectors(
      this.orientation,
      this.orientationTarget,
    );
    // Simulator
    this.rotationSimulator.target = angle;
    this.rotationSimulator.simulate(timeStep);
    const rot = this.rotationSimulator.position;
    // Updating values
    this.orientation.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
    this.angularVelocity = this.rotationSimulator.velocity;
  }

  public rotateModel(): void {
    this.lookAt(
      this.position.x + this.orientation.x,
      this.position.y + this.orientation.y,
      this.position.z + this.orientation.z,
    );
    this.tiltContainer.rotation.z =
      -this.angularVelocity * 2.3 * this.velocity.length();
    this.tiltContainer.position.setY(
      Math.cos(Math.abs(this.angularVelocity * 2.3 * this.velocity.length())) /
        2 -
        0.5,
    );
  }

  public jump(initJumpSpeed = -1): void {
    this.wantsToJump = true;
    this.initJumpSpeed = initJumpSpeed;
  }

  public setCameraRelativeOrientationTarget(): void {
    // if (this.vehicleEntryInstance === null) {
    const moveVector = this.getCameraRelativeMovementVector();

    if (moveVector.x === 0 && moveVector.y === 0 && moveVector.z === 0) {
      this.setOrientation(this.orientation);
    } else {
      this.setOrientation(moveVector);
    }
    // }
  }

  public getLocalMovementDirection(): THREE.Vector3 {
    const positiveX = this.actions.right.isPressed ? -1 : 0;
    const negativeX = this.actions.left.isPressed ? 1 : 0;
    const positiveZ = this.actions.up.isPressed ? 1 : 0;
    const negativeZ = this.actions.down.isPressed ? -1 : 0;

    return new THREE.Vector3(
      positiveX + negativeX,
      0,
      positiveZ + negativeZ,
    ).normalize();
  }

  public getCameraRelativeMovementVector(): THREE.Vector3 {
    const localDirection = this.getLocalMovementDirection();
    const flatViewVector = new THREE.Vector3(
      this.viewVector.x,
      0,
      this.viewVector.z,
    ).normalize();

    return Utils.appplyVectorMatrixXZ(flatViewVector, localDirection);
  }

  public setAnimation(clipName: string, fadeIn: number): number {
    if (this.mixer) {
      const clip = THREE.AnimationClip.findByName(this.animations, clipName);

      const action = this.mixer.clipAction(clip);
      if (action === null) {
        console.error(`Animation ${clipName} not found!`);
        return 0;
      }

      this.mixer.stopAllAction();
      action.fadeIn(fadeIn);
      action.play();

      return action.getClip().duration;
    }

    return 0;
  }

  public setPhysicsEnabled(value: boolean): void {
    this.physicsEnabled = value;

    if (value) {
      this.world.physicsWorld.addBody(this.characterCapsule.body);
    } else {
      this.world.physicsWorld.removeBody(this.characterCapsule.body);
    }
  }

  public physicsPreStep(body: CANNON.Body, character: Character): void {
    character.feetRaycast();

    // Raycast debug
    if (character.rayHasHit) {
      if (character.raycastBox.visible) {
        character.raycastBox.position.x = character.rayResult.hitPointWorld.x;
        character.raycastBox.position.y = character.rayResult.hitPointWorld.y;
        character.raycastBox.position.z = character.rayResult.hitPointWorld.z;
      }
    } else {
      if (character.raycastBox.visible) {
        character.raycastBox.position.set(
          body.position.x,
          body.position.y - character.rayCastLength - character.raySafeOffset,
          body.position.z,
        );
      }
    }
  }

  public feetRaycast(): void {
    // Player ray casting
    // Create ray
    const body = this.characterCapsule.body;
    const start = new CANNON.Vec3(
      body.position.x,
      body.position.y,
      body.position.z,
    );
    const end = new CANNON.Vec3(
      body.position.x,
      body.position.y - this.rayCastLength - this.raySafeOffset,
      body.position.z,
    );
    // Raycast options
    const rayCastOptions = {
      collisionFilterMask: CollisionGroups.DEFAULT,
      skipBackfaces: true /* ignore back faces */,
    };
    // Cast the ray
    this.rayHasHit = this.world.physicsWorld.raycastClosest(
      start,
      end,
      rayCastOptions,
      this.rayResult,
    );
  }

  public physicsPostStep(body: CANNON.Body, character: Character): void {
    // Get velocities
    const simulatedVelocity = new THREE.Vector3(
      body.velocity.x,
      body.velocity.y,
      body.velocity.z,
    );

    // Take local velocity
    let arcadeVelocity = new THREE.Vector3()
      .copy(character.velocity)
      .multiplyScalar(character.moveSpeed);
    // Turn local into global
    arcadeVelocity = Utils.appplyVectorMatrixXZ(
      character.orientation,
      arcadeVelocity,
    );

    let newVelocity = new THREE.Vector3();

    // Additive velocity mode
    if (character.arcadeVelocityIsAdditive) {
      newVelocity.copy(simulatedVelocity);

      const globalVelocityTarget = Utils.appplyVectorMatrixXZ(
        character.orientation,
        character.velocityTarget,
      );
      const add = new THREE.Vector3()
        .copy(arcadeVelocity)
        .multiply(character.arcadeVelocityInfluence);

      if (
        Math.abs(simulatedVelocity.x) <
          Math.abs(globalVelocityTarget.x * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.x, arcadeVelocity.x)
      ) {
        newVelocity.x += add.x;
      }
      if (
        Math.abs(simulatedVelocity.y) <
          Math.abs(globalVelocityTarget.y * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.y, arcadeVelocity.y)
      ) {
        newVelocity.y += add.y;
      }
      if (
        Math.abs(simulatedVelocity.z) <
          Math.abs(globalVelocityTarget.z * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.z, arcadeVelocity.z)
      ) {
        newVelocity.z += add.z;
      }
    } else {
      newVelocity = new THREE.Vector3(
        THREE.MathUtils.lerp(
          simulatedVelocity.x,
          arcadeVelocity.x,
          character.arcadeVelocityInfluence.x,
        ),
        THREE.MathUtils.lerp(
          simulatedVelocity.y,
          arcadeVelocity.y,
          character.arcadeVelocityInfluence.y,
        ),
        THREE.MathUtils.lerp(
          simulatedVelocity.z,
          arcadeVelocity.z,
          character.arcadeVelocityInfluence.z,
        ),
      );
    }

    // If we're hitting the ground, stick to ground
    if (character.rayHasHit) {
      // Flatten velocity
      newVelocity.y = 0;

      // Move on top of moving objects
      if (
        character.rayResult.body !== null &&
        character.rayResult.body.mass > 0
      ) {
        const pointVelocity = new CANNON.Vec3();
        character.rayResult.body.getVelocityAtWorldPoint(
          character.rayResult.hitPointWorld,
          pointVelocity,
        );
        newVelocity.add(Utils.threeVector(pointVelocity));
      }

      // Measure the normal vector offset from direct "up" vector
      // and transform it into a matrix
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3(
        character.rayResult.hitNormalWorld.x,
        character.rayResult.hitNormalWorld.y,
        character.rayResult.hitNormalWorld.z,
      );
      const q = new THREE.Quaternion().setFromUnitVectors(up, normal);
      const m = new THREE.Matrix4().makeRotationFromQuaternion(q);

      // Rotate the velocity vector
      newVelocity.applyMatrix4(m);

      // Compensate for gravity
      // newVelocity.y -= body.world.physicsWorld.gravity.y / body.character.world.physicsFrameRate;

      // Apply velocity
      body.velocity.x = newVelocity.x;
      body.velocity.y = newVelocity.y;
      body.velocity.z = newVelocity.z;
      // Ground character
      body.position.y =
        character.rayResult.hitPointWorld.y +
        character.rayCastLength +
        newVelocity.y / character.world.physicsFrameRate;
    } else {
      // If we're in air
      body.velocity.x = newVelocity.x;
      body.velocity.y = newVelocity.y;
      body.velocity.z = newVelocity.z;

      // Save last in-air information
      character.groundImpactData.velocity.x = body.velocity.x;
      character.groundImpactData.velocity.y = body.velocity.y;
      character.groundImpactData.velocity.z = body.velocity.z;
    }

    // // Jumping
    if (character.wantsToJump) {
      // If initJumpSpeed is set
      if (character.initJumpSpeed > -1) {
        // Flatten velocity
        body.velocity.y = 0;
        const speed = Math.max(
          character.velocitySimulator.position.length() * 4,
          character.initJumpSpeed,
        );
        body.velocity = Utils.cannonVector(
          character.orientation.clone().multiplyScalar(speed),
        );
      } else {
        // Moving objects compensation
        const add = new CANNON.Vec3();
        if (character.rayResult.body !== null) {
          character.rayResult.body.getVelocityAtWorldPoint(
            character.rayResult.hitPointWorld,
            add,
          );
          body.velocity.vsub(add, body.velocity);
        }
      }

      // Add positive vertical velocity
      body.velocity.y += 5;
      // Move above ground by 2x safe offset value
      body.position.y += character.raySafeOffset * 2;
      // Reset flag
      character.wantsToJump = false;
    }
  }

  public addToWorld(world: World): void {
    this.world = world;

    world.characters.push(this);

    world.physicsWorld.addBody(this.characterCapsule.body);

    world.graphicsWorld.add(this);
    world.graphicsWorld.add(this.raycastBox);

    this.materials.forEach((mat) => {
      world.sky.csm.setupMaterial(mat);
    });
  }

  public removeFromWorld(world: World): void {
    //
  }

  public setArcadeVelocityTarget(velZ: number, velX = 0, velY = 0): void {
    this.velocityTarget.z = velZ;
    this.velocityTarget.x = velX;
    this.velocityTarget.y = velY;
  }

  public setOrientation(vector: THREE.Vector3, instantly = false): void {
    const lookVector = new THREE.Vector3().copy(vector).setY(0).normalize();
    this.orientationTarget.copy(lookVector);

    if (instantly) {
      this.orientation.copy(lookVector);
    }
  }
}
