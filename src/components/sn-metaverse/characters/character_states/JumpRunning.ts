import { CharacterStateBase } from "./CharacterStateBase";
import { Falling } from "./_stateLibrary";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { Character } from 'components/sn-metaverse/characters/Character';

export class JumpRunning extends CharacterStateBase implements ICharacterState {
  private alreadyJumped: boolean;

  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.mass = 100;
    this.playAnimation(CharacterAnimationName.JUMP_RUNNING, 0.03);
    this.alreadyJumped = false;
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    // Move in air
    if (this.alreadyJumped) {
      this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);
    }
    // Physically jump
    if (this.timer > 0.13 && !this.alreadyJumped) {
      this.character.jump(4);
      this.alreadyJumped = true;

      this.character.rotationSimulator.damping = 0.3;
      this.character.arcadeVelocityIsAdditive = true;
      this.character.setArcadeVelocityInfluence(0.05, 0, 0.05);
    } else if (this.timer > 0.24 && this.character.rayHasHit) {
      this.setAppropriateDropState();
    } else if (this.animationEnded(timeStep)) {
      this.character.setState(new Falling(this.character));
    }
  }
}
