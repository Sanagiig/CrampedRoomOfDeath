import { _decorator, Component } from "cc";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";
import { IronSkeletonController } from "./IronSkeletonController";
import { IEntity } from "../../Levels/index";

const { ccclass, property } = _decorator;

@ccclass("IronSkeletonManager")
export class IronSkeletonManager extends Component {
  public stateMachine: IronSkeletonStateMachine;
  public controller: IronSkeletonController;
  async init() {
    this.stateMachine = this.addComponent(IronSkeletonStateMachine);
    this.controller = this.addComponent(IronSkeletonController);

    await this.stateMachine.init();
    await this.controller.init();
  }

  setup(info: IEntity) {
    this.controller.x = info.x;
    this.controller.y = info.y;
    this.stateMachine.direction = info.direction;
    this.controller.refresh();
  }

  start() {}
}
