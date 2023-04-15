import { _decorator } from "cc";
import StateMachie from "../../Base/StateMachine";
import { PLAYER_ENVENT, DIRECTIVE, DIRECTION, ENTITY_STATE } from "../../Enum";
import DataCenter from "../../Base/DataCenter";
import { WoodenSkeletonController } from "./WoodenSkeletonController";
const { ccclass, property } = _decorator;

const dir = "woodenskeleton";
const states = ["idle", "attack", "death"];
const directions = ["top", "bottom", "left", "right"];

@ccclass("WoodenSkeletonStateMachine")
export class WoodenSkeletonStateMachine extends StateMachie {
  async init() {
    await super.init(dir, states, directions);
    DataCenter.curPlayer.node.on(PLAYER_ENVENT.MOVE_END, this.onPlayerMoveEnd, this);
  }

  set directive(v: DIRECTIVE) {
    this.handleDirective(v);
  }

  handleDirective(d: DIRECTIVE) {}

  onPlayerMoveEnd(x: number, y: number) {
    if (this._state !== ENTITY_STATE.IDLE) {
      return;
    }

    const { x: curX, y: curY } = this.getComponent(WoodenSkeletonController);
    const disX = Math.abs(x - curX);
    const disY = Math.abs(y - curY);
    let direction;
    let state;

    // 玩家在敌人第一象限
    if (x >= curX && y <= curY) {
      direction = disX > disY ? DIRECTION.RIGHT : DIRECTION.TOP;
    } else if (x <= curX && y <= curY) {
      direction = disX > disY ? DIRECTION.LEFT : DIRECTION.TOP;
    } else if (x <= curX && y >= curY) {
      direction = disX > disY ? DIRECTION.LEFT : DIRECTION.BOTTOM;
    } else if (x >= curX && y >= curY) {
      direction = disX > disY ? DIRECTION.RIGHT : DIRECTION.BOTTOM;
    }

    this.direction = direction;
    switch (direction) {
      case DIRECTION.TOP:
        if (y == curY - 1 && x == curX) {
          state = ENTITY_STATE.ATTACK;
        }
        break;
      case DIRECTION.BOTTOM:
        if (y == curY + 1 && x == curX) {
          state = ENTITY_STATE.ATTACK;
        }
        break;
      case DIRECTION.LEFT:
        if (x == curX - 1 && y == curY) {
          state = ENTITY_STATE.ATTACK;
        }
        break;
      case DIRECTION.RIGHT:
        if (x == curX + 1 && y == curY) {
          state = ENTITY_STATE.ATTACK;
        }
        break;
    }

    if (state && this.node.active) {
      this.state = state;
      DataCenter.curPlayer.stateMachine.state = ENTITY_STATE.DEATH;
    }
  }

  protected onDestroy(): void {
    DataCenter.curPlayer.node && DataCenter.curPlayer.node.off(PLAYER_ENVENT.MOVE_END, this.onPlayerMoveEnd, this);
  }
}
