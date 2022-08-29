import * as CANNON from "cannon-es";
import * as LODASH from "lodash";
import { ICollider } from "components/sn-metaverse/consts/types";

export class CapsuleCollider implements ICollider {
  public body!: CANNON.Body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.3,
      segments: 8,
      friction: 0.3,
    };
    options = this.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material("capsuleMat");
    mat.friction = options.friction;

    const capsuleBody = new CANNON.Body({
      mass: options.mass,
      position: options.position,
    });

    // Compound shape
    const sphereShape = new CANNON.Sphere(options.radius*3/4);
    const sphereShapeM = new CANNON.Sphere(options.radius*4/3);

    // Materials
    capsuleBody.material = mat;

    capsuleBody.addShape(
      sphereShapeM,
      new CANNON.Vec3(0, 0, 0),
    );

    capsuleBody.addShape(sphereShapeM, new CANNON.Vec3(0, options.height*4/3, 0));
    capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, options.height*2, 0));

    this.body = capsuleBody;
  }

  private setDefaults(options, defaults) {
    return LODASH.defaults({}, LODASH.clone(options), defaults);
  }
}
