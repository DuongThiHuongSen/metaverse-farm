import { StartWalkBase } from "./StartWalkBase";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";
import { Character } from 'components/sn-metaverse/characters/Character';

export class StartWalkLeft extends StartWalkBase {
  constructor(character: Character) {
    super(character);
    this.animationLength = character.setAnimation(
      CharacterAnimationName.START_LEFT,
      0.1,
    );
  }
}
