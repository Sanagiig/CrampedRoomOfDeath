import { _decorator, EventKeyboard, Input, input, KeyCode, v3, v2 } from "cc";
import { DIRECTION, PLAYER_ENVENT } from "../Enum";
import { PlayerStateMachine } from "./PlayerStateMachine";
import { DIRECTIVE } from "../Enum";
import EntityController from "../Base/Entity";
import DataCenter from "../Base/DataCenter";
import { PlayerManager } from "./PlayerManager";

const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends EntityController {
  private playerStateMachine: PlayerStateMachine = null;
  private isMoving = false;
  private moveVec = v3(0, 0, 0);
  private prePos = v3(0, 0, 0);
  private during = 0;
  public x = 2;
  public y = 8;
  // 倍速
  private multipleSpeed = 2.5;
  public isPause = false;
  public basicOffset = 1;

  init() {
    super.init();
    this.playerStateMachine = this.getComponent(PlayerStateMachine);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  start() {}

  getDirection() {
    return this.playerStateMachine.direction;
  }

  up() {
    this.playerStateMachine.directive = DIRECTIVE.TOP;
  }

  down() {
    this.playerStateMachine.directive = DIRECTIVE.BOTTOM;
  }

  left() {
    this.playerStateMachine.directive = DIRECTIVE.LEFT;
  }

  right() {
    this.playerStateMachine.directive = DIRECTIVE.RIGHT;
  }

  turnLeft() {
    this.playerStateMachine.directive = DIRECTIVE.TURNLEFT;
  }

  turnRight() {
    this.playerStateMachine.directive = DIRECTIVE.TURNRIGHT;
  }

  move(dir: DIRECTION) {
    if (this.isMoving) return;

    const { basicOffset } = this;
    this.moveVec.set(0, 0, 0);
    this.isMoving = true;
    switch (dir) {
      case DIRECTION.TOP:
        this.moveVec.y -= basicOffset;
        break;
      case DIRECTION.BOTTOM:
        this.moveVec.y += basicOffset;
        break;
      case DIRECTION.LEFT:
        this.moveVec.x -= basicOffset;
        break;
      case DIRECTION.RIGHT:
        this.moveVec.x += basicOffset;
        break;
    }

    this.isMoving = true;
    this.prePos.set(this.x, this.y, 0);
  }

  private updatePos(dt: number) {
    const d = this.moveVec;
    const offsetX = d.x * dt * this.multipleSpeed;
    const offsetY = d.y * dt * this.multipleSpeed;

    if (this.during < 1) {
      this.during += dt * this.multipleSpeed;
      this.x += offsetX;
      this.y += offsetY;
    } else {
      this.isMoving = false;
      this.during = 0;
      this.x = this.prePos.x + d.x;
      this.y = this.prePos.y + d.y;
      this.triggerMoveEnd();
    }
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.ARROW_UP:
      case KeyCode.KEY_W:
        this.up();
        break;
      case KeyCode.ARROW_DOWN:
      case KeyCode.KEY_S:
        this.down();
        break;
      case KeyCode.ARROW_LEFT:
      case KeyCode.KEY_A:
        this.left();
        break;
      case KeyCode.ARROW_RIGHT:
      case KeyCode.KEY_D:
        this.right();
        break;
      case KeyCode.KEY_Q:
        this.turnLeft();
        break;
      case KeyCode.KEY_E:
        this.turnRight();
        break;
    }
  }

  protected onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown);
  }

  triggerMoveEnd() {
    this.getComponent(PlayerManager).node.emit(PLAYER_ENVENT.MOVE_END, this.x, this.y);
  }

  refresh() {
    super.refresh();
  }

  update(deltaTime: number) {
    if (this.isMoving) {
      this.updatePos(deltaTime * this.multipleSpeed);
      this.refresh();
    }
  }
}
