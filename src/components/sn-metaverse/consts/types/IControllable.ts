import { IInputReceiver } from 'components/sn-metaverse/consts/types';
import { EntityType } from 'components/sn-metaverse/consts/enums';
import { Character } from 'components/sn-metaverse/characters/Character';


export interface IControllable extends IInputReceiver {
  entityType: EntityType;
  position: THREE.Vector3;
  controllingCharacter: Character;

  triggerAction(actionName: string, value: boolean): void;
  resetControls(): void;
  allowSleep(value: boolean): void;
  onInputChange(): void;
  noDirectionPressed(): boolean;
}
