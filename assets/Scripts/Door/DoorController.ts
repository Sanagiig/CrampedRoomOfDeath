import { _decorator } from "cc";
import EntityController from "../Base/Entity";
import DataCenter from "../Base/DataCenter";
import { DoorStateMachine } from "./DoorStateMachine";

const { ccclass, property } = _decorator;

@ccclass("DoorController")
export class DoorController extends EntityController {
  private stateMachine: DoorStateMachine = null;
  public x = 2;
  public y = 8;

  init() {
    super.init();
    this.stateMachine = this.getComponent(DoorStateMachine);
  }

  refresh() {
    super.refresh();
  }
}
