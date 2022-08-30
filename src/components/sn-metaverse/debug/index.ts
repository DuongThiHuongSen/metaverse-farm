import * as THREE from "three";
import * as CANNON from "cannon-es";
import { World } from 'components/sn-metaverse/world/world';


export class Debug {
  public world: World;

  // public stats: Stats;

  // public params: IDebugParam;
  // public cannonDebugRenderer: CannonDebugRenderer | undefined;

  constructor(world: World) {
    this.world = world;

    // this.cannonDebugRenderer = new CannonDebugRenderer(
    //   this.world.graphicsWorld,
    //   this.world.physicsWorld,
    // );

    const axesHelper = new THREE.AxesHelper(30);
    this.world.graphicsWorld.add(axesHelper);

    // this.stats = Stats();

    // Create right panel GUI
    // this.params = {
    //   charPosX: 0,
    //   charPosY: 0,
    //   charPosZ: 0,
    //   shadows: true,
    //   debugPhysics: true,
    //   sunElevation: 50,
    //   sunRotation: 145,
    //   createBox: () => {
    //     this.createBox(
    //       1, // width
    //       1, // height
    //       1, // depth
    //       new THREE.Vector3(-2, 15, 0),
    //     );
    //   },
    // };
    // this.createParamsGUI(this.world);
  }

  public update() {
    // this.stats.update();
    // if (this.cannonDebugRenderer && this.params.debugPhysics)
    //   this.cannonDebugRenderer.update();
  }

  private createBox(
    width: number,
    height: number,
    depth: number,
    position: THREE.Vector3,
  ) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);

    mesh.castShadow = true;
    mesh.position.copy(position);
    mesh.scale.set(width, height, depth);

    this.world.graphicsWorld.add(mesh);

    const shape = new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5),
    );

    const body = new CANNON.Body({
      mass: 80,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
    });

    const physPos = new CANNON.Vec3(position.x, position.y, position.z);

    body.position.copy(physPos);

    this.world.physicsWorld.addBody(body);
  }

  private async createParamsGUI(world: World) {
    // const dat = await import("dat.gui");
    // const gui = new dat.GUI();

    // Character
    // const characterFolder = gui.addFolder("Character");
    // characterFolder
    //   .add(this.params, "charPosX", -10, 10)
    //   .listen()
    //   .onChange((value) => {
    //     debug.params.charPosX = value;
    //   });
    // characterFolder
    //   .add(this.params, "charPosY", -10, 10)
    //   .listen()
    //   .onChange((value) => {
    //     debug.params.charPosY = value;
    //   });
    // characterFolder
    //   .add(this.params, "charPosZ", -10, 10)
    //   .listen()
    //   .onChange((value) => {
    //     debug.params.charPosZ = value;
    //   });

    // const worldFolder = gui.addFolder("World");
    // worldFolder.add(this.params, "createBox");

    // worldFolder
    //   .add(this.params, "sunElevation", 0, 180)
    //   .listen()
    //   .onChange((value) => {
    //     world.sky.phi = value;
    //   });
    // worldFolder
    //   .add(this.params, "sunRotation", 0, 360)
    //   .listen()
    //   .onChange((value) => {
    //     world.sky.theta = value;
    //   });

    // worldFolder.open();

    // const settingsFolder = gui.addFolder("Settings");
    // settingsFolder.add(this.params, "shadows").onChange((enabled) => {
    //   if (enabled) {
    //     world.sky.csm.lights.forEach((light) => {
    //       light.castShadow = true;
    //     });
    //   } else {
    //     world.sky.csm.lights.forEach((light) => {
    //       light.castShadow = false;
    //     });
    //   }
    // });
    // settingsFolder.add(this.params, "debugPhysics").onChange((enabled) => {
    //   if (enabled) {
    //     this.cannonDebugRenderer = new CannonDebugRenderer(
    //       world.graphicsWorld,
    //       world.physicsWorld,
    //     );
    //   } else {
    //     this.cannonDebugRenderer?.clearMeshes();
    //     this.cannonDebugRenderer = undefined;
    //   }

    //   world.characters.forEach((char) => {
    //     char.raycastBox.visible = enabled;
    //   });
    // });

    // gui.open();
  }
}
