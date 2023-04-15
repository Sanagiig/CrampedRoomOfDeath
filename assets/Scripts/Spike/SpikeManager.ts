import { _decorator, Component } from "cc";
import { ISpikes } from "../Levels/index";
import { SpikeController } from "./SpikeController";
import { SpikeStateMachine } from "./SpikeStateMachine";
import DataCenter from "../Base/DataCenter";
import { ENTITY_STATE } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("SpikeManager")
export class SpikeManager extends Component {
  public controller: SpikeController;
  public stateMachine: SpikeStateMachine;

  async init() {
    this.controller = this.getComponent(SpikeController) || this.addComponent(SpikeController);
    this.stateMachine = this.getComponent(SpikeStateMachine) || this.addComponent(SpikeStateMachine);

    await this.controller.init();
    await this.stateMachine.init();
  }

  setup(info: ISpikes) {
    this.controller.x = info.x;
    this.controller.y = info.y;
    this.stateMachine.state = (info.type as unknown) as ENTITY_STATE;
    this.stateMachine.isDied = false;
    this.controller.refresh();
  }
}
