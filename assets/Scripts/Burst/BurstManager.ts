import { _decorator, Component } from "cc";
import { IEntity } from "../Levels/index";
import { BurstController } from "./BurstController";
import { BurstStateMachine } from "./BurstStateMachine";
import DataCenter from "../Base/DataCenter";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("BurstManager")
export class BurstManager extends Component {
  public controller: BurstController;
  public stateMachine: BurstStateMachine;

  async init() {
    this.controller = this.getComponent(BurstController) || this.addComponent(BurstController);
    this.stateMachine = this.getComponent(BurstStateMachine) || this.addComponent(BurstStateMachine);

    await this.controller.init();
    await this.stateMachine.init();
  }

  setup(info: IEntity) {
    this.controller.x = info.x;
    this.controller.y = info.y;
    this.stateMachine.direction = info.direction;
    this.stateMachine.state = ENTITY_STATE.IDLE;
    this.stateMachine.isDied = false;
    this.controller.refresh();
  }
}
