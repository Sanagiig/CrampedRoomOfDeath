import { _decorator, v3 } from "cc";
import { DIRECTION, DIRECTIVE, PLAYER_ENVENT } from "../../Enum";
import EntityController from "../../Base/Entity";
import DataCenter from "../../Base/DataCenter";
import { PlayerManager } from "../../Player/PlayerManager";
import StateMachie from "../../Base/StateMachine";

const { ccclass, property } = _decorator;

@ccclass("EnemyController")
export class EnemyController extends EntityController {
  private playerManager: PlayerManager;
  private stateMachine: StateMachie;
  public x = 0;
  public y = 0;

  init() {
    super.init();
    this.playerManager = DataCenter.curPlayer;
    this.playerManager.node.on(PLAYER_ENVENT.MOVE_END, this.onPlayerMoveEnd, this);
  }

  start() {}

  refresh() {
    super.refresh();
  }

  protected onDestroy(): void {
    this.playerManager.node &&  this.playerManager.node.off(PLAYER_ENVENT.MOVE_END, this.onPlayerMoveEnd, this);
  }

  onPlayerMoveEnd(x: number, y: number) {
  }

  update(deltaTime: number) {}
}
