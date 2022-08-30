import { Idle, Walk, JumpIdle } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { Character } from 'components/sn-metaverse/characters/Character';
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";


export class IdleRotateRight
  extends CharacterStateBase
  implements ICharacterState
{
  constructor(character: Character) {
    super(character);

    this.character.rotationSimulator.mass = 30;
    this.character.rotationSimulator.damping = 0.6;

    this.character.velocitySimulator.damping = 0.6;
    this.character.velocitySimulator.mass = 10;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation(CharacterAnimationName.ROTATE_RIGHT, 0.1);
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
      if (this.character.velocity.length() > 0.5) {
        this.character.setState(new Walk(this.character));
      } else {
        this.setAppropriateStartWalkState();
      }
    }
  }
}
