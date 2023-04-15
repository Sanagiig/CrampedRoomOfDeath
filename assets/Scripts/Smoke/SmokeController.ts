import { _decorator } from "cc";
import EntityController from "../Base/Entity";
import DataCenter from "../Base/DataCenter";
import { SmokeStateMachine } from "./SmokeStateMachine";

const { ccclass, property } = _decorator;

@ccclass("SmokeController")
export class SmokeController extends EntityController {
  private stateMachine: SmokeStateMachine = null;
  public x = 0;
  public y = 0;

  init() {
    super.init();
    this.stateMachine = this.getComponent(SmokeStateMachine);
  }

  refresh() {
    super.refresh();
  }
}
