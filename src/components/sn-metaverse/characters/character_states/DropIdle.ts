import { Idle, JumpIdle, StartWalkForward } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class DropIdle extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.damping = 0.5;
    this.character.velocitySimulator.mass = 7;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation(CharacterAnimationName.DROP_IDLE, 0.1);

    if (this.anyDirection()) {
      this.character.setState(new StartWalkForward(character));
    }
  }

  public update(timeStep: number): void {
    super.update(timeStep);
    this.character.setCameraRelativeOrientationTarget();
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
      this.character.setState(new StartWalkForward(this.character));
    }
  }
}
