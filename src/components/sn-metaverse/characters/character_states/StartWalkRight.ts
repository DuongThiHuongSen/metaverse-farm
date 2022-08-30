import { StartWalkBase } from "./StartWalkBase";
import { Character } from 'components/sn-metaverse/characters/Character';
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class StartWalkRight extends StartWalkBase {
  constructor(character: Character) {
    super(character);
    this.animationLength = character.setAnimation(
      CharacterAnimationName.START_RIGHT,
      0.1,
    );
  }
}
