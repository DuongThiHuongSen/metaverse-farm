import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { World } from "./world";

export class Environment {
  public world: World;

  constructor(world: World) {
    this.world = world;

    const pmremGenerator = new THREE.PMREMGenerator(this.world.renderer);

    this.world.graphicsWorld.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;

    this.world.graphicsWorld.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    this.world.graphicsWorld.add(dirLight);
  }
}
