import { _decorator, Animation } from "cc";
import StateMachie from "../../Base/StateMachine";
import { DIRECTION, DIRECTIVE, ENEMY_STATE } from "../../Enum";
import { AnimationState } from "cc";
const { ccclass, property } = _decorator;

const dir = "ironskeleton";
const states = ["idle", "attack", "death"];
const directions = ["top", "bottom", "left", "right"];

@ccclass("IronSkeletonStateMachine")
export class IronSkeletonStateMachine extends StateMachie {

  async init() {
    await super.init(dir, states, directions);
  }

  handleDirective(d: DIRECTIVE) {}

}
