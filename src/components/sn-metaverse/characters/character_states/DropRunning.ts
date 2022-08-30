import { EndWalk, JumpRunning, Sprint, Walk } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class DropRunning extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation(CharacterAnimationName.DROP_RUNNING, 0.1);
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    if (this.animationEnded(timeStep)) {
      this.character.setState(new Walk(this.character));
    }
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.noDirection()) {
      this.character.setState(new EndWalk(this.character));
    }

    if (this.anyDirection() && this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character));
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character));
    }
  }
}
