import * as THREE from 'three'

export class World {
    public canvas;
    public renderer!: THREE.WebGLRenderer;
    public camera!: THREE.PerspectiveCamera;
    public graphicsWorld!: THREE.Scene;
    public cameraOperator!: THREE.CameraOperator;
}