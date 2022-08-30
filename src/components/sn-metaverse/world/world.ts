import * as CANNON from "cannon-es";
import { Character } from "components/sn-metaverse/characters/Character";
import { CollisionGroups } from 'components/sn-metaverse/consts/enums';
import { ScenarioData, ScenarioDataType, ScenarioType } from 'components/sn-metaverse/consts/enums/SceneChildType';
import { IUpdatable } from 'components/sn-metaverse/consts/types';
import { CameraOperator, InputManager, LoadingManager } from 'components/sn-metaverse/core';
import * as Utils from "components/sn-metaverse/core/FunctionLibrary";
import { Debug } from 'components/sn-metaverse/debug';
import { BoxCollider, TrimeshCollider } from 'components/sn-metaverse/physics/colliders';
import { Sky } from 'components/sn-metaverse/world/Sky';
import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module.js";
import { ScenePath } from 'types/ScenePath';
import { Environment } from './Environment';
import { Ground } from './Ground';
import { UIManager } from "./UIManager";

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

    public characters: Character[] = [];
    public characterScale = 5;

    //physics
    public physicsWorld!: CANNON.World;
    public inputManager!: InputManager;
    public debug!: Debug;
    public physicsFrameRate!: number;
    public clock!: THREE.Clock;
    public requestDelta!: number;
    public renderDelta!: number;
    public logicDelta!: number;
    public uiManager!: UIManager;

    // models
    public environment!: Environment;
    public sky!: Sky;
    public ground!: Ground;
    public updatables: IUpdatable[] = [];

    // render loop
    public physicsFrameTime!: number;
    public timeScale: number = 1;
    public timeScaleTarget: number = 1;
    public physicsMaxPrediction!: number;

    // constructor
    constructor(
        paths: ScenePath,
        changeLoading: (value: boolean) => void,
        changeProgress: (value: number) => void,
    ) {
        const scope = this;

        // Canvas
        this.paths = paths;
        this.canvas = document.getElementById(paths.canvasId)

        if (this.canvas) {
            // Renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
            });
            this.renderer.setPixelRatio(window.innerWidth / window.innerHeight);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Auto window resize
            const onWindowResize = () => {
                scope.camera.aspect = window.innerWidth / window.innerHeight;
                scope.camera.updateProjectionMatrix();
                scope.renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener("resize", onWindowResize, false);

            // ThreeJs scene
            this.graphicsWorld = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

            // Physics
            this.physicsWorld = new CANNON.World();
            this.physicsWorld.gravity.set(0, -9.82, 0);
            this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
            this.physicsWorld.allowSleep = true;

            this.physicsFrameRate = 60;
            this.physicsFrameTime = 1 / this.physicsFrameRate;
            this.physicsMaxPrediction = this.physicsFrameRate;

            // Render loop
            this.clock = new THREE.Clock();
            this.requestDelta = 0;
            this.renderDelta = 0;
            this.logicDelta = 0;

            this.inputManager = new InputManager(this, this.renderer.domElement);
            this.cameraOperator = new CameraOperator(this, this.camera, 0.3);
            this.cameraOperator.theta = 0;
            this.cameraOperator.phi = 15;

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
                    this.environment = new Environment(this);
                    this.sky = new Sky(this);
                    this.stats = Stats();
                    this.canvas.appendChild(this.stats.dom);
                    this.ground = new Ground(this);

                    this.loadScene(loadingManager, gltf);
                });
            }

            this.debug = new Debug(this);

            this.uiManager = new UIManager(this);

            this.generateHTML();

            this.render(this);
        }

    }

    public loadScene(loadingManager: LoadingManager, gltf: any) {
        // gltf.scene.position.set(0, -2.5, 0);
        gltf.scene.traverse((child) => {
            if (child.hasOwnProperty("userData")) {
                if (child.type === ScenarioType.MESH) {
                    this.sky.csm.setupMaterial(child.material);
                    Utils.setupMeshProperties(child);
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

        this.updatePhysics(timeStep);

        this.updatables.forEach((entity) => {
            entity.update(timeStep, unscaledTimeStep);
        });

        // Lerp time scale
        this.timeScale = THREE.MathUtils.lerp(
            this.timeScale,
            this.timeScaleTarget,
            0.2,
        );

        this.debug.update();

        if (this.stats) this.stats.update();
    }

    public updatePhysics(timeStep: number): void {
        this.physicsWorld.step(this.physicsFrameTime, timeStep);

        this.characters.forEach((char) => {
            if (this.isOutOfBounds(char.characterCapsule.body.position)) {
                this.outOfBoundsRespawn(char.characterCapsule.body);
            }
        });

        // this.vehicles.forEach((vehicle) => {

        // })
    }


    public scrollTheTimeScale(scrollAmount: number): void {
        // Changing time scale with scroll wheel
        const timeScaleBottomLimit = 0.003;
        const timeScaleChangeSpeed = 1.3;
        if (scrollAmount > 0) {
            this.timeScaleTarget /= timeScaleChangeSpeed;
            if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = 0;
        } else {
            this.timeScaleTarget *= timeScaleChangeSpeed;
            if (this.timeScaleTarget < timeScaleBottomLimit)
                this.timeScaleTarget = timeScaleBottomLimit;
            this.timeScaleTarget = Math.min(this.timeScaleTarget, 1);
        }
    }

    public isOutOfBounds(position: CANNON.Vec3): boolean {
        const inside =
            position.x > -211.882 &&
            position.x < 211.882 &&
            position.z > -169.098 &&
            position.z < 153.232 &&
            position.y > 0.107;
        const belowSeaLevel = position.y < 14.989;

        return !inside && belowSeaLevel;
    }

    public outOfBoundsRespawn(body: CANNON.Body, position?: CANNON.Vec3): void {
        const newPos = position || new CANNON.Vec3(0, 16, 0);
        const newQuat = new CANNON.Quaternion(0, 0, 0, 1);

        body.position.copy(newPos);
        body.interpolatedPosition.copy(newPos);
        body.quaternion.copy(newQuat);
        body.interpolatedQuaternion.copy(newQuat);
        body.velocity.setZero();
        body.angularVelocity.setZero();
    }

    public render(world: World): void {
        this.requestDelta = this.clock.getDelta();

        // Getting timeStep
        const unscaledTimeStep = this.requestDelta + this.renderDelta + this.logicDelta;
        let timeStep = unscaledTimeStep * this.timeScale;
        timeStep = Math.min(timeStep, 1 / 30); // min 30 fps

        // Logic
        world.update(timeStep, unscaledTimeStep);

        window.requestAnimationFrame(() => world.render(world));
        this.renderer.render(this.graphicsWorld, this.camera);

        // Measuring render time
        this.renderDelta = this.clock.getDelta();
    }

    public generateHTML(): void {
        const bodyWrapper: HTMLElement | null = document.getElementById(
            this.paths.bodyWrapper,
        );

        if (bodyWrapper) {
            console.log("this.renderer.domElement ===>", this.renderer.domElement);
            
            bodyWrapper.appendChild(this.renderer.domElement);

            // Bottom Menu generate
            this.uiManager.bottomMenuGenerate(bodyWrapper);
        }
    }

}