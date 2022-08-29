import * as CANNON from "cannon-es";
import { ICollider } from "components/sn-metaverse/consts/types/ICollider";
import * as LODASH from "lodash";
import * as THREE from "three";
import { ShapeType, threeToCannon } from "three-to-cannon";

export class TrimeshCollider implements ICollider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mesh: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options: any;
  public body!: CANNON.Body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(mesh: THREE.Object3D, options: any) {
    this.mesh = mesh.clone();

    const defaults = {
      mass: 0,
      position: mesh.position,
      rotation: mesh.quaternion,
      friction: 0.3,
    };
    options = this.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material("triMat");
    mat.friction = options.friction;
    // mat.restitution = 0.7;

    const result = threeToCannon(this.mesh, { type: ShapeType.MESH });

    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      quaternion: options.rotation,
    });

    if (result !== null) {
      const { shape } = result;
      physBox.addShape(shape);
    }

    physBox.material = mat;

    this.body = physBox;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setDefaults(options: any, defaults: any) {
    return LODASH.defaults({}, LODASH.clone(options), defaults);
  }
}
