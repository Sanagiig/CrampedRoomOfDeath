import { _decorator, Component } from "cc";
import { PlayerStateMachine } from "./PlayerStateMachine";
import { PlayerController } from "./PlayerController";
import DataCenter from "../Base/DataCenter";
import { IEntity } from "../Levels/index";

const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  public stateMachine: PlayerStateMachine;
  public controller: PlayerController;
  async init() {
    this.stateMachine = this.getComponent(PlayerStateMachine);
    this.controller = this.getComponent(PlayerController);

    await this.stateMachine.init();
    await this.controller.init();
    DataCenter.curPlayer = this;
  }

  setup(info: IEntity) {
    this.controller.x = info.x;
    this.controller.y = info.y;
    this.stateMachine.direction = info.direction;
    this.controller.refresh();
  }

  start() {}
}
