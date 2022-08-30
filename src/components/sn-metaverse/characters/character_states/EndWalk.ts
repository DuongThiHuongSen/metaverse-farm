import { Idle, Walk, Sprint, JumpIdle } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";


export class EndWalk extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.setArcadeVelocityTarget(0);
    this.animationLength = character.setAnimation(
      CharacterAnimationName.STOP,
      0.1,
    );
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    if (this.animationEnded(timeStep)) {
      this.character.setState(new Idle(this.character));
    }

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpIdle(this.character));
    }

    if (this.anyDirection()) {
      if (this.character.actions.run.isPressed) {
        this.character.setState(new Sprint(this.character));
      } else {
        if (this.character.velocity.length() > 0.5) {
          this.character.setState(new Walk(this.character));
        } else {
          this.setAppropriateStartWalkState();
        }
      }
    }
  }
}
