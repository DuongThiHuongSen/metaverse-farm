import { EndWalk, Walk } from "./_stateLibrary";
import { CharacterStateBase } from "./CharacterStateBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { ICharacterState } from "components/sn-metaverse/consts/types";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";


export class DropRolling extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.mass = 1;
    this.character.velocitySimulator.damping = 0.6;

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation(CharacterAnimationName.DROP_RUNNING_ROLL, 0.03);
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    if (this.animationEnded(timeStep)) {
      if (this.anyDirection()) {
        this.character.setState(new Walk(this.character));
      } else {
        this.character.setState(new EndWalk(this.character));
      }
    }
  }
}
