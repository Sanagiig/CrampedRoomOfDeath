import { _decorator } from "cc";
import StateMachie from "../Base/StateMachine";
import { DIRECTIVE, DIRECTION, PLAYER_ENVENT, ENTITY_STATE } from "../Enum";
import DataCenter from "../Base/DataCenter";
import { DoorController } from "./DoorController";

const { ccclass, property } = _decorator;

const dir = "door";
const states = ["idle", "death"];
const directions = ["top", "left", "death"];

@ccclass("DoorStateMachine")
export class DoorStateMachine extends StateMachie {
  private controller: DoorController;
  async init() {
    this.controller = this.getComponent(DoorController);
    await super.init(dir, states, directions);
    DataCenter.curPlayer.node.on(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
  }

  set directive(v: DIRECTIVE) {
    this.handleDirective(v);
  }

  handleDirective(d: DIRECTIVE) {}

  updateState(): void {
    const stateName = this.getAnimationName(this._state);
    if (this._state === ENTITY_STATE.IDLE) {
      switch (this._direction) {
        case DIRECTION.TOP:
        case DIRECTION.BOTTOM:
          this.animationComponent.play(`${stateName}Top`);
          break;
        case DIRECTION.LEFT:
        case DIRECTION.RIGHT:
          this.animationComponent.play(`${stateName}Left`);
          break;
      }
    } else {
      this.animationComponent.play(`${stateName}Death`);
    }
  }

  onMoveEnd(x: number, y: number) {
    const { x: curX, y: curY } = this.controller;
    const disX = Math.abs(curX - x);
    const disY = Math.abs(curY - y);

    const isAllEnemiesDie = DataCenter.curEnemy.enemies.every(
      enemy => enemy.stateMachine.state === ENTITY_STATE.DEATH,
    );

    if (isAllEnemiesDie) {
      this.state = ENTITY_STATE.DEATH;
      if ((disX === 0 && disY <= 1) || (disY === 0 && disX <= 1)) {
        DataCenter.game.nextLevel();
      }
    }
  }

  protected onDestroy(): void {
    DataCenter.curPlayer.node && DataCenter.curPlayer.node.off(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
  }
}
