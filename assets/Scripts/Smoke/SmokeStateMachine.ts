import { Animation, AnimationClip, _decorator } from "cc";
import StateMachie from "../Base/StateMachine";
import { DIRECTIVE, DIRECTION, PLAYER_ENVENT, ENTITY_STATE } from "../Enum";
import DataCenter from "../Base/DataCenter";
import { SmokeController } from "./SmokeController";

const { ccclass, property } = _decorator;

const dir = "smoke";
const states = ["idle"];
const directions = ["top", "left", "bottom", "right"];

@ccclass("SmokeStateMachine")
export class SmokeStateMachine extends StateMachie {
  private controller: SmokeController;
  async init() {
    this.controller = this.getComponent(SmokeController);
    await super.init(dir, states, directions, AnimationClip.WrapMode.Normal);
  }

  set directive(v: DIRECTIVE) {
    this.handleDirective(v);
  }

  handleDirective(d: DIRECTIVE) {}
}
