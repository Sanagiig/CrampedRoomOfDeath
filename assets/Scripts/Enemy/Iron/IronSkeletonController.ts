import { _decorator, EventKeyboard, Input, input, KeyCode, v3, v2 } from "cc";
import { DIRECTION,DIRECTIVE } from "../../Enum";
import EntityController from "../../Base/Entity";
import DataCenter from "../../Base/DataCenter";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";

const { ccclass, property } = _decorator;

@ccclass("IronSkeletonController")
export class IronSkeletonController extends EntityController {
  private stateMachine: IronSkeletonStateMachine = null;
  public x = 2;
  public y = 8;
  // 倍速
  private multipleSpeed = 2.5;
  public isPause = false;
  public basicOffset = 1;

  init() {
    super.init();
    this.stateMachine = this.getComponent(IronSkeletonStateMachine);
  }

  start() {}

  refresh() {
    super.refresh();
  }
}
