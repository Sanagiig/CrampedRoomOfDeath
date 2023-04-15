import { _decorator, Component } from "cc";
import { IEntity } from "../Levels/index";
import { SmokeController } from "./SmokeController";
import { SmokeStateMachine } from "./SmokeStateMachine";
import DataCenter from "../Base/DataCenter";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("SmokeManager")
export class SmokeManager extends Component {
  public controller: SmokeController;
  public stateMachine: SmokeStateMachine;

  async init() {
    this.controller = this.getComponent(SmokeController) || this.addComponent(SmokeController);
    this.stateMachine = this.getComponent(SmokeStateMachine) || this.addComponent(SmokeStateMachine);

    await this.controller.init();
    await this.stateMachine.init();
    DataCenter.curSmoke = this;
  }
}
