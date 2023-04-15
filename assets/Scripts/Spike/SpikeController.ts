import { _decorator, UITransform } from "cc";
import EntityController from "../Base/Entity";
import DataCenter from "../Base/DataCenter";
import { SpikeStateMachine } from "./SpikeStateMachine";
import { TILE_WIDTH, TILE_HEIGHT } from "../Base/Const";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("SpikeController")
export class SpikeController extends EntityController {
  private stateMachine: SpikeStateMachine = null;
  public isMove = false;
  public x = 0;
  public y = 0;

  init() {
    super.init();
    this.stateMachine = this.getComponent(SpikeStateMachine);
  }

  refresh() {
    super.refresh();
  }
}
