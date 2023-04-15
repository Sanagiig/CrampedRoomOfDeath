import { _decorator, UITransform } from "cc";
import EntityController from "../Base/Entity";
import DataCenter from "../Base/DataCenter";
import { BurstStateMachine } from "./BurstStateMachine";
import { TILE_WIDTH, TILE_HEIGHT } from "../Base/Const";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("BurstController")
export class BurstController extends EntityController {
  private stateMachine: BurstStateMachine = null;
  public isMove = false;
  public x = 0;
  public y = 0;

  init() {
    super.init();
    this.getComponent(UITransform).setContentSize(TILE_WIDTH * 1, TILE_HEIGHT * 1);
    this.stateMachine = this.getComponent(BurstStateMachine);
  }

  refresh() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT);
  }
}
