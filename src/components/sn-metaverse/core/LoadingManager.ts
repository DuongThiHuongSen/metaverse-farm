import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { World } from "../world/world";


export class LoadingManager {
  public onFinishedCallback!: () => void;

  private handleChangeLoading: (value: boolean) => void;
  private handleChangeProgress: (value: number) => void;

  private manager: THREE.LoadingManager;
  private world: World;
  private gltfLoader: GLTFLoader;

  constructor(
    world: World,
    changeLoading: (value: boolean) => void,
    changeProgress: (value: number) => void,
  ) {
    this.world = world;

    this.handleChangeLoading = changeLoading;
    this.handleChangeProgress = changeProgress;

    const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    dracoLoader.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/",
    );

    this.manager = new THREE.LoadingManager();

    this.gltfLoader = new GLTFLoader(this.manager);
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public loadGLTF(path: string, onLoadingFinished: (gltf: any) => void): void {
    this.manager.onProgress = (path, itemsLoaded, itemsTotal) => {
      const progress = ((itemsLoaded / itemsTotal) * 100) | 0;
      if (progress <= 100) {
        this.handleChangeProgress(progress);
      }
    };

    this.gltfLoader.load(path, (gltf) => {
      onLoadingFinished(gltf);
      this.doneLoading();
    });
  }

  public doneLoading(): void {
    if (this.onFinishedCallback !== undefined) {
      this.onFinishedCallback();
    }
    this.handleChangeLoading(false);
  }
}
