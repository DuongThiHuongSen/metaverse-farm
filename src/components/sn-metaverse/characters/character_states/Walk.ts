import { Idle, EndWalk, Sprint, JumpRunning } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character);

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation(CharacterAnimationName.RUN, 0.1);
    console.log('Run');
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.noDirection()) {
      this.character.setState(new EndWalk(this.character));
    }

    if (this.character.actions.run.isPressed) {
      this.character.setState(new Sprint(this.character));
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character));
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character));
    }

    if (this.noDirection()) {
      if (this.character.velocity.length() > 1) {
        this.character.setState(new EndWalk(this.character));
      } else {
        this.character.setState(new Idle(this.character));
      }
    }
  }
}
