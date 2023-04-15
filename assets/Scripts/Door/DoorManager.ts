import { _decorator, Component } from "cc";
import { IEntity } from "../Levels/index";
import { DoorController } from "./DoorController";
import { DoorStateMachine } from "./DoorStateMachine";
import DataCenter from "../Base/DataCenter";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("DoorManager")
export class DoorManager extends Component {
  public controller: DoorController;
  public stateMachine: DoorStateMachine;

  async init() {
    this.controller = this.getComponent(DoorController) || this.addComponent(DoorController);
    this.stateMachine = this.getComponent(DoorStateMachine) || this.addComponent(DoorStateMachine);

    await this.controller.init();
    await this.stateMachine.init();
    DataCenter.curDoor = this;
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
