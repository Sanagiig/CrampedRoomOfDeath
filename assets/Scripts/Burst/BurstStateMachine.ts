import { _decorator, Animation, Sprite, AnimationClip } from "cc";
import StateMachie from "../Base/StateMachine";
import { DIRECTIVE, DIRECTION, PLAYER_ENVENT, ENTITY_STATE } from "../Enum";
import DataCenter from "../Base/DataCenter";
import { BurstController } from "./BurstController";
import { capitalize } from "../Utils";
import { SpriteAnimClip } from "../Base/SpriteAnimClip";

const { ccclass, property } = _decorator;

const dir = "burst";
const states = ["idle", "death", "attack"];
const directions = ["idle"];

@ccclass("BurstStateMachine")
export class BurstStateMachine extends StateMachie {
  private controller: BurstController;

  async init() {
    this.animationComponent = this.getComponent(Animation) || this.addComponent(Animation);

    if (!this.getComponent(Sprite)) {
      this.addComponent(Sprite);
    }

    states.forEach(s => {
      directions.forEach(d => {
        const path = `texture/${dir}/${s}/${d}`;
        const name = capitalize(s) + capitalize(d);
        const clip = new SpriteAnimClip(this, path, name, AnimationClip.WrapMode.Normal);

        this.clipMap.set(name, clip);
      });
    });

    DataCenter.curPlayer.node.on(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
    this.controller = this.getComponent(BurstController);
    await Promise.all(this.waitList);
  }

  set directive(v: DIRECTIVE) {
    this.handleDirective(v);
  }

  handleDirective(d: DIRECTIVE) {}

  updateState(): void {
    const stateName = this.getAnimationName(this._state);
    this.animationComponent.play(`${stateName}Idle`);
  }

  toAttack() {
    if (this._state === ENTITY_STATE.ATTACK) {
      this.state = ENTITY_STATE.DEATH;
      console.log("burst kill", this);
      DataCenter.curPlayer.stateMachine.state = ENTITY_STATE.AIRDEATH;
    } else {
      this.state = ENTITY_STATE.ATTACK;
    }
  }

  onMoveEnd(x: number, y: number) {
    if (x === this.controller.x && y === this.controller.y && this.node.active) {
      this.toAttack();
    }
  }

  protected onDestroy(): void {
    DataCenter.curPlayer.node && DataCenter.curPlayer.node.off(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
  }
}
