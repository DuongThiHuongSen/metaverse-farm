import * as CANNON from "cannon-es";
import { CollisionGroups } from 'components/sn-metaverse/consts/enums';
import { ScenarioData, ScenarioDataType, ScenarioType } from 'components/sn-metaverse/consts/enums/SceneChildType';
import { CameraOperator, InputManager, LoadingManager } from 'components/sn-metaverse/core';
import * as Utils from "components/sn-metaverse/core/FunctionLibrary";
import { BoxCollider, TrimeshCollider } from 'components/sn-metaverse/physics/colliders';
import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module.js";
import { AppState } from 'types/AppState';
import { ScenePath } from 'types/ScenePath';
import { Environment } from './Environment';
import { Ground } from './Ground';
import { IUpdatable } from 'components/sn-metaverse/consts/types';

export class World {
    //param
    public paths: ScenePath;

    //property
    public canvas;
    public renderer!: THREE.WebGLRenderer;
    public camera!: THREE.PerspectiveCamera;
    public graphicsWorld!: THREE.Scene;
    public cameraOperator!: CameraOperator;
    public stats;

    //physics
    public physicsWorld!: CANNON.World;
    public inputManager!: InputManager;

    // models
    public environment!: Environment;
    // public sky!: Sky;
    public ground!: Ground;
    public updatables: IUpdatable[] = [];
    // constructor
    constructor(
        paths: ScenePath,
        appState: AppState,
        changeLoading: (value: boolean) => void,
        changeProgress: (value: number) => void,
    ) {
        // Canvas
        this.paths = paths;
        this.canvas = document.getElementById(paths.canvasId)

        if (paths.squarePath) {
            const loadingManager = new LoadingManager(
                this,
                changeLoading,
                changeProgress,
            );
            loadingManager.onFinishedCallback = () => {
                this.update(1, 1);
            };

            loadingManager.loadGLTF(paths.squarePath, (gltf) => {
                // this.environment = new Environment(this);
                // this.sky = new Sky(this);
                this.stats = Stats();
                this.canvas.appendChild(this.stats.dom);
                // this.ground = new Ground(this);

                this.loadScene(loadingManager, gltf);
            });
        }
    }

    public loadScene(loadingManager: LoadingManager, gltf: any) {
        // gltf.scene.position.set(0, -2.5, 0);
        gltf.scene.traverse((child) => {
            if (child.hasOwnProperty("userData")) {
                if (child.type === ScenarioType.MESH) {
                    // this.sky.csm.setupMaterial(child.material);
                    Utils.setupMeshProperties(child);
                    console.log('ScenarioType.MESH');

                }

                if (child.userData.hasOwnProperty("data")) {
                    if (child.userData.data === ScenarioData.PHYSICS) {
                        if (child.userData.type === ScenarioDataType.BOX) {
                            const phys = new BoxCollider({
                                size: new THREE.Vector3(
                                    child.scale.x,
                                    child.scale.y,
                                    child.scale.z,
                                ),
                            });

                            phys.body.position.copy(Utils.cannonVector(child.position));
                            phys.body.quaternion.copy(Utils.cannonQuat(child.quaternion));

                            phys.body.shapes.forEach((shape) => {
                                shape.collisionFilterMask = ~CollisionGroups.TRIMESHCOLLIDERS;
                            });

                            this.physicsWorld.addBody(phys.body);
                        } else if (child.userData.type === ScenarioDataType.TRIMESH) {
                            const phys = new TrimeshCollider(child, {});
                            this.physicsWorld.addBody(phys.body);
                        } else {
                            // console.log(child);
                        }
                        child.visible = false;
                    }
                    console.log("ScenarioData.PHYSICS");

                }
            }
        });
        this.graphicsWorld.add(gltf.scene);

        this.cameraOperator.phi = 15;

        // this.loadCharacter(loadingManager);

        // this.loadVehicle(loadingManager);
    }

    public registerUpdatable(registree: IUpdatable): void {
        this.updatables.push(registree);
        this.updatables.sort((a, b) => (a.updateOrder > b.updateOrder ? 1 : -1));
    }

    public update(timeStep: number, unscaledTimeStep): void {

        // this.updatePhysics(timeStep);

        this.updatables.forEach((entity) => {
            entity.update(timeStep, unscaledTimeStep);
        });

        // Lerp time scale
        // this.timeScale = THREE.MathUtils.lerp(
        //     this.timeScale,
        //     this.timeScaleTarget,
        //     0.2,
        // );

        // this.debug.update();

        if (this.stats) this.stats.update();
    }

    // public updatePhysics(timeStep: number): void {
    //     this.physicsWorld.step(this.physicsFrameTime, timeStep);

    //     this.characters.forEach((char) => {
    //         if (this.isOutOfBounds(char.characterCapsule.body.position)) {
    //             this.outOfBoundsRespawn(char.characterCapsule.body);
    //         }
    //     });

    //     this.vehicles.forEach((vehicle) => {

    //     })
    // }
}