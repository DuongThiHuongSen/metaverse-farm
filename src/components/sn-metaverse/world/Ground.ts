import * as CANNON from "cannon-es";
import { World } from "./world";

export class Ground {
  public world: World;
  constructor(world: World) {
    this.world = world;

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.physicsWorld.addBody(groundBody);
  }
}
