import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import * as Utils from 'components/sn-metaverse/core/FunctionLibrary';

import {
  Sprint,
  Idle,
  IdleRotateLeft,
  IdleRotateRight,
  JumpRunning,
} from "./_stateLibrary";
export class StartWalkBase extends CharacterStateBase {
  constructor(character: Character) {
    super(character);

    this.character.rotationSimulator.mass = 20;
    this.character.rotationSimulator.damping = 0.7;

    this.character.setArcadeVelocityTarget(0.8);
    // this.character.velocitySimulator.damping = 0.5;
    // this.character.velocitySimulator.mass = 1;
  }
  public update(timeStep: number): void {
    super.update(timeStep);

    if (this.animationEnded(timeStep)) {
      // this.character.setState(new Walk(this.character));

      this.character.setCameraRelativeOrientationTarget();
      this.fallInAir();
    }
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character));
    }

    if (this.noDirection()) {
      if (this.timer < 0.1) {
        const angle = Utils.getSignedAngleBetweenVectors(
          this.character.orientation,
          this.character.orientationTarget,
        );

        if (angle > Math.PI * 0.4) {
          this.character.setState(new IdleRotateLeft(this.character));
        } else if (angle < -Math.PI * 0.4) {
          this.character.setState(new IdleRotateRight(this.character));
        } else {
          this.character.setState(new Idle(this.character));
        }
      } else {
        this.character.setState(new Idle(this.character));
      }
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character));
    }
  }
}
