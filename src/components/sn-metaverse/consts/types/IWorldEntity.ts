import { IUpdatable } from "components/sn-metaverse/consts/types";
import { World } from "components/sn-metaverse/world/world";
import { EntityType } from "components/sn-metaverse/consts/enums";


export interface IWorldEntity extends IUpdatable {
  entityType: EntityType;

  addToWorld(world: World): void;
  removeFromWorld(world: World): void;
}
