import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as LODASH from "lodash";
import { ICollider } from "components/sn-metaverse/consts/types";

export class BoxCollider implements ICollider {
  public body: CANNON.Body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new THREE.Vector3(),
      size: new THREE.Vector3(0.3, 0.3, 0.3),
      friction: 0.3,
    };
    options = this.setDefaults(options, defaults);
    this.options = options;

    options.position = new CANNON.Vec3(
      options.position.x,
      options.position.y,
      options.position.z,
    );
    options.size = new CANNON.Vec3(
      options.size.x,
      options.size.y,
      options.size.z,
    );

    const mat = new CANNON.Material("boxMat");
    if (options.friction) mat.friction = options.friction;

    const shape = new CANNON.Box(options.size);

    // Add phys sphere
    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      shape,
    });

    physBox.material = mat;

    this.body = physBox;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setDefaults(options: any, defaults: any) {
    return LODASH.defaults({}, LODASH.clone(options), defaults);
  }
}
