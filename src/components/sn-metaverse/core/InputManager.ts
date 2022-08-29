import { IInputReceiver, IUpdatable } from 'components/sn-metaverse/consts/types';
import { World } from "components/sn-metaverse/world/world";
import {
  EntityUpdateOrder
} from "components/sn-metaverse/consts/enums";

export class InputManager implements IUpdatable {
  public updateOrder: number = EntityUpdateOrder.INPUT_MANAGER;

  public world: World;
  public domElement: HTMLElement;
  public inputReceiver!: IInputReceiver;

  public boundOnMouseDown: (evt: MouseEvent) => void;
  public boundOnMouseMove: (evt: MouseEvent) => void;
  public boundOnMouseUp: (evt: MouseEvent) => void;
  public boundOnMouseWheelMove: (evt: WheelEvent) => void;
  // public boundOnPointerlockChange: (evt: any) => void;
  // public boundOnPointerlockError: (evt: any) => void;
  public boundOnKeyDown: (evt: KeyboardEvent) => void;
  public boundOnKeyUp: (evt: KeyboardEvent) => void;

  constructor(world: World, domElement: HTMLElement) {
    this.world = world;
    this.domElement = domElement;

    // Mouse
    this.boundOnMouseDown = (evt) => this.onMouseDown(evt);
    this.boundOnMouseMove = (evt) => this.onMouseMove(evt);
    this.boundOnMouseUp = (evt) => this.onMouseUp(evt);
    this.boundOnMouseWheelMove = (evt) => this.onMouseWheelMove(evt);

    // Init event listeners
    // Mouse
    this.domElement.addEventListener("mousedown", this.boundOnMouseDown, false);
    document.addEventListener("wheel", this.boundOnMouseWheelMove, false);

    // Keys
    this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
    this.boundOnKeyUp = (evt) => this.onKeyUp(evt);
    document.addEventListener("keydown", this.boundOnKeyDown, false);
    document.addEventListener("keyup", this.boundOnKeyUp, false);

    world.registerUpdatable(this);
  }

  public update(timeStep: number, unscaledTimeStep: number): void {
    if (
      this.inputReceiver === undefined &&
      this.world !== undefined &&
      this.world.cameraOperator !== undefined
    ) {
      this.setInputReceiver(this.world.cameraOperator);
    }

    this.inputReceiver?.inputReceiverUpdate(unscaledTimeStep);
  }

  public setInputReceiver(receiver: IInputReceiver): void {
    this.inputReceiver = receiver;
    this.inputReceiver.inputReceiverInit();
  }

  public onMouseDown(event: MouseEvent): void {
    this.domElement.addEventListener("mousemove", this.boundOnMouseMove, false);
    this.domElement.addEventListener("mouseup", this.boundOnMouseUp, false);

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(event, "mouse" + event.button, true);
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseMove(
        event,
        event.movementX,
        event.movementY,
      );
    }
  }

  public onMouseUp(event: MouseEvent): void {
    this.domElement.removeEventListener(
      "mousemove",
      this.boundOnMouseMove,
      false,
    );
    this.domElement.removeEventListener("mouseup", this.boundOnMouseUp, false);

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(
        event,
        "mouse" + event.button,
        false,
      );
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleKeyboardEvent(event, event.key, true);
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (this.inputReceiver) {
      this.inputReceiver.handleKeyboardEvent(event, event.key, false);
    }
  }

  public onMouseWheelMove(event: WheelEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseWheel(event, event.deltaY);
    }
  }
}
