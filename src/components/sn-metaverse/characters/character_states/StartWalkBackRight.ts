import { StartWalkBase } from "./StartWalkBase";
import { Character } from "../Character";
import { CharacterAnimationName } from "components/sn-metaverse/consts/enums/CharacterAnimationName";

export class StartWalkBackRight extends StartWalkBase {
  constructor(character: Character) {
    super(character);
    this.animationLength = character.setAnimation(
      CharacterAnimationName.START_BACK_RIGHT,
      0.1,
    );
  }
}
