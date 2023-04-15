import { _decorator, Animation } from "cc";
import StateMachie from "../Base/StateMachine";
import { DIRECTION, ENTITY_STATE, DIRECTIVE, CHANGE_DIRECTION, PLAYER_ENVENT } from "../Enum";
import DataCenter from "../Base/DataCenter";
import { PlayerController } from "./PlayerController";
import { BurstManager } from "../Burst/BurstManager";
import { ANIMATION_SPEED } from "../Base/SpriteAnimClip";
const { ccclass, property } = _decorator;

const dir = "player";
const states = [
  "idle",
  "turnleft",
  "turnright",
  "attack",
  "blockfront",
  "blockback",
  "blockleft",
  "blockright",
  "blockturnleft",
  "blockturnright",
  "death",
  "airdeath",
];
const directions = ["top", "bottom", "left", "right"];

@ccclass("PlayerStateMachine")
export class PlayerStateMachine extends StateMachie {
  public controller: PlayerController;
  async init() {
    this.controller = this.getComponent(PlayerController);
    await super.init(dir, states, directions,null,(clip,cname) =>{
      if (["Attack", "Death","Airdeath"].some(s => clip.name.includes(s))) {
        clip.events.push({
          frame: ANIMATION_SPEED,
          func: "onShake",
          params: [],
        });
        clip.updateEventDatas();
      }
    });

    this.node.on(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
  }

  getAftertDirection(d: CHANGE_DIRECTION) {
    const dirs = ["TOP", "LEFT", "BOTTOM", "RIGHT"] as DIRECTION[];
    const idx = dirs.indexOf(this._direction) + (d === CHANGE_DIRECTION.TURNLEFT ? 1 : -1);

    const resIdx = idx < 0 ? dirs.length - 1 : idx == dirs.length ? 0 : idx;
    return dirs[resIdx];
  }

  /**
   * 获取当前移动方向和武器朝向关系
   * @description 当两者方向相同为 front,相反为 back , 左和右都可以以移动方向作为block(根据素材设计划分)
   * 剩下就只有移动方向 上 | 下 ，并且武器方向 左 | 右 ，这就很容易根据 面向和移动方向获取究竟是什么碰撞了。
   * @param dir
   * @returns
   */
  getBlockDirection(dir: DIRECTION) {
    const dirs = ["TOP", "LEFT", "BOTTOM", "RIGHT"] as DIRECTION[];
    const curDir = this._direction;
    const dirNum = dirs.indexOf(dir);
    const curDirNum = dirs.indexOf(curDir);

    if (dir === curDir) {
      return "Blockfront";
    }

    if (Math.abs(curDirNum - dirNum) === 2) {
      return "Blockback";
    }

    switch (dir) {
      case DIRECTION.LEFT:
        return "Blockleft";
      case DIRECTION.RIGHT:
        return "Blockright";
      default:
        if (dir === DIRECTION.TOP) {
          return curDir === DIRECTION.LEFT ? "Blockleft" : "Blockright";
        } else {
          return curDir === DIRECTION.LEFT ? "Blockright" : "Blockleft";
        }
    }
  }

  /**
   * 获取当前移动方向 与武器方向需要判断的条件（点位 , 有两个点位的是一个可以移动，一个可以放枪【可旋转的位置】）
   * @param direction
   * @returns
   */
  getMoveCondition(direction: DIRECTION) {
    const { x, y } = this.controller;
    const condition: Array<[number, number]> = [];
    switch (direction) {
      case DIRECTION.TOP:
        // 抢的位置
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x, y - 1], [x, y - 2]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x, y - 1]);
            break;
          case DIRECTION.LEFT:
            condition.push([x, y - 1], [x - 1, y - 1]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x, y - 1], [x + 1, y - 1]);
            break;
        }
        break;
      case DIRECTION.BOTTOM:
        // 抢的位置
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x, y + 1]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x, y + 1], [x, y + 2]);
            break;
          case DIRECTION.LEFT:
            condition.push([x, y + 1], [x - 1, y + 1]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x, y + 1], [x + 1, y + 1]);
            break;
        }
        break;
      case DIRECTION.LEFT:
        // 抢的位置
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x - 1, y], [x - 1, y - 1]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x - 1, y], [x - 1, y + 1]);
            break;
          case DIRECTION.LEFT:
            condition.push([x - 1, y], [x - 2, y]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x - 1, y]);
            break;
        }
        break;
      case DIRECTION.RIGHT:
        // 抢的位置
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x + 1, y], [x + 1, y - 1]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x + 1, y], [x + 1, y + 1]);
            break;
          case DIRECTION.LEFT:
            condition.push([x + 1, y]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x + 1, y], [x + 2, y]);
            break;
        }
        break;
    }
    return condition;
  }

  getMovableStatus(mc, tc) {
    const { x: doorX, y: doorY } = DataCenter.curDoor.controller;
    const doorIsOpen = DataCenter.curDoor.stateMachine.isDied;

    const isMovable =
      DataCenter.curMap.isMovable(mc[0], mc[1]) && (doorIsOpen || mc[0] !== doorX || mc[1] !== doorY);
    // 针对移动方向抢的判断
    const isTunable = !tc || DataCenter.curMap.isTurnable(tc[0], tc[1]);
    return isMovable && isTunable;
  }

  /**
   * 获取当前旋转方向 与武器方向需要判断的条件（点位）
   * @param turnDirection
   * @returns
   */
  getTurnCondition(turnDirection: CHANGE_DIRECTION) {
    const { x, y } = this.controller;
    // [人旁边，武器旁边] 点位
    const condition: Array<[number, number]> = [];
    switch (turnDirection) {
      case CHANGE_DIRECTION.TURNLEFT:
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x - 1, y], [x - 1, y - 1]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x + 1, y], [x + 1, y + 1]);
            break;
          case DIRECTION.LEFT:
            condition.push([x, y + 1], [x - 1, y + 1]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x, y - 1], [x + 1, y - 1]);
            break;
        }
        break;
      case CHANGE_DIRECTION.TURNRIGHT:
        switch (this.direction) {
          case DIRECTION.TOP:
            condition.push([x + 1, y], [x + 1, y - 1]);
            break;
          case DIRECTION.BOTTOM:
            condition.push([x - 1, y], [x - 1, y + 1]);
            break;
          case DIRECTION.LEFT:
            condition.push([x, y - 1], [x - 1, y - 1]);
            break;
          case DIRECTION.RIGHT:
            condition.push([x, y + 1], [x + 1, y + 1]);
            break;
        }
        break;
    }
    return condition;
  }

  getTouchBurst(x: number, y: number) {
    return DataCenter.curBurst.getBurstByPos(x, y);
  }

  handleDirective(directive: DIRECTIVE) {
    if (this._state !== ENTITY_STATE.IDLE) {
      return;
    }

    
    DataCenter.stage.saveData();
    switch (directive) {
      case DIRECTIVE.TURNLEFT:
      case DIRECTIVE.TURNRIGHT:
        this.toTurn((directive as unknown) as CHANGE_DIRECTION);
        break;
      default:
        this.toMove((directive as unknown) as DIRECTION);
    }
  }

  toMove(direction: DIRECTION) {
    const [mc, tc] = this.getMoveCondition(direction);
    const burst = this.getTouchBurst(mc[0], mc[1]);
    const isMovable = this.getMovableStatus(mc, tc);

    //  防止当期脚下有碎石，前面有墙被通过
    if ((tc && !DataCenter.curMap.isTurnable(tc[0], tc[1])) || (!burst && !isMovable)) {
      DataCenter.stage.shakeManager.shake(direction);
      this.toBlock(this.getBlockDirection(direction));
      return;
    }

    DataCenter.curSmoke.controller.x = this.controller.x;
    DataCenter.curSmoke.controller.y = this.controller.y;
    DataCenter.curSmoke.stateMachine.state = ENTITY_STATE.IDLE;
    DataCenter.curSmoke.stateMachine.direction = direction;
    DataCenter.curSmoke.controller.refresh();
    this.controller.move(direction);
  }

  toTurn(directive: CHANGE_DIRECTION) {
    const condition = this.getTurnCondition(directive);
    const finalDirection = this.getAftertDirection(directive);
    const enemies = DataCenter.curEnemy.enemies;
    // 判断地形是否能够旋转 && 没有存活的敌人
    const isTurnable = condition.every(([x, y]) => {
      const isDeathOrMiss = enemies.every(enemy => {
        const { x: ex, y: ey } = enemy.controller;
        return enemy.stateMachine.isDied || x != ex || y != ey;
      });
      return DataCenter.curMap.isTurnable(x, y) && isDeathOrMiss;
    });

    if (!isTurnable) {
      const blockName = directive === CHANGE_DIRECTION.TURNLEFT ? "Blockturnleft" : "Blockturnright";
      DataCenter.stage.shakeManager.shake(finalDirection);
      this.toBlock(blockName);
      return;
    }

    this._direction = finalDirection;
    this.state = (directive as unknown) as ENTITY_STATE;
  }

  toBlock(blockName: string, direction: DIRECTION = this._direction) {
    const dirName = this.getAnimationName(direction);
    this.animationComponent.play(`${blockName}${dirName}`);
  }

  /**
   * 准备攻击，当前位置如果允许，则发动攻击
   * @param x
   * @param y
   */
  prepareToAttack(x: number = this.controller.x, y: number = this.controller.y) {
    const enemies = DataCenter.curEnemy.enemies;
    let attackX = x;
    let attackY = y;
    switch (this._direction) {
      case DIRECTION.TOP:
        attackY -= 2;
        break;
      case DIRECTION.BOTTOM:
        attackY += 2;
        break;
      case DIRECTION.LEFT:
        attackX -= 2;
        break;
      case DIRECTION.RIGHT:
        attackX += 2;
        break;
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const { x: ex, y: ey } = enemy.controller;
      if (ex == attackX && ey == attackY && enemy.stateMachine.state !== ENTITY_STATE.DEATH) {
        enemy.stateMachine.state = ENTITY_STATE.DEATH;
        this.state = ENTITY_STATE.ATTACK;
        break;
      }
    }
  }

  onMoveEnd(x: number, y: number) {
    this.prepareToAttack(x, y);
  }

  onShake() {
    DataCenter.stage.shakeManager.shake(this._direction);
  }

  updateState(): void {
    super.updateState();
    if (this._state === ENTITY_STATE.IDLE) {
      this.prepareToAttack();
    }
  }
}
