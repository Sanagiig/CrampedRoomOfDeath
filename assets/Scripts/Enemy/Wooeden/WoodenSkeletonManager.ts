import { _decorator, Component } from "cc";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import { WoodenSkeletonController } from "./WoodenSkeletonController";
import { IEntity } from "../../Levels/index";

const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends Component {
  public stateMachine: WoodenSkeletonStateMachine;
  public controller: WoodenSkeletonController;
  async init() {
    this.stateMachine =
      this.getComponent(WoodenSkeletonStateMachine) ||
      this.addComponent(WoodenSkeletonStateMachine);
    this.controller =
      this.getComponent(WoodenSkeletonController) || this.addComponent(WoodenSkeletonController);

    await this.stateMachine.init();
    await this.controller.init();
  }

  setup(info: IEntity) {
    this.controller.x = info.x;
    this.controller.y = info.y;
    this.stateMachine.direction = info.direction;
    this.controller.refresh();
    this.stateMachine.updateState();
  }

  start() {}
}
