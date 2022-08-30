import { ICharacterState } from "components/sn-metaverse/consts/types";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class Falling extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.mass = 100;
    this.character.rotationSimulator.damping = 0.3;

    this.character.arcadeVelocityIsAdditive = true;
    this.character.setArcadeVelocityInfluence(0.05, 0, 0.05);

    this.playAnimation(CharacterAnimationName.FALLING, 0.3);
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();
    this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);

    if (this.character.rayHasHit) {
      this.setAppropriateDropState();
    }
  }
}
