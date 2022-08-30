import { Character } from "../Character";
import { Walk, JumpIdle } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";
import { ICharacterState } from "components/sn-metaverse/consts/types";


export class Idle extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.damping = 0.6;
    this.character.velocitySimulator.mass = 10;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation(CharacterAnimationName.IDLE, 0.1);
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.anyDirection()) {
      this.character.setState(new Walk(this.character));
      this.setAppropriateStartWalkState();
    }
    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpIdle(this.character));
    }
  }
}
