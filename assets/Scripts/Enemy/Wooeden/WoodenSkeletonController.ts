import { _decorator, v3 } from "cc";
import { DIRECTION, DIRECTIVE, ENTITY_STATE, PLAYER_ENVENT } from "../../Enum";
import EntityController from "../../Base/Entity";
import DataCenter from "../../Base/DataCenter";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import { PlayerManager } from "../../Player/PlayerManager";

const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonController")
export class WoodenSkeletonController extends EntityController {
  private stateMachine: WoodenSkeletonStateMachine = null;
  private playerManager: PlayerManager;

  public x = 0;
  public y = 0;

  init() {
    super.init();
    this.stateMachine = this.getComponent(WoodenSkeletonStateMachine);
  }

  start() {}

  refresh() {
    super.refresh();
  }
}
