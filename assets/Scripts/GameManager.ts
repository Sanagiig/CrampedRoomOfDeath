import { _decorator, Component, director, Label, Node } from "cc";
import { StageManager } from "./StageManager";
import DataCenter from "./Base/DataCenter";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: StageManager })
  private stageManager: StageManager = null;
  @property({ type: Label })
  private lavelLabel: Label = null;

  private curLevel = 20;
  private maxLevel = 21;

  async init() {
    DataCenter.game = this;
    await this.stageManager.init();
    this.stageManager.toLevel(this.curLevel);
  }

  start() {
    this.init();
  }

  nextLevel() {
    if (this.curLevel === this.maxLevel) {
      director.loadScene("Win");
      return;
    }
    this.lavelLabel.string = `Level ${++this.curLevel}`;
    this.stageManager.toLevel(this.curLevel);
  }

  restartGame() {
    director.loadScene("Game");
  }

  exitGame() {
    director.end();
  }
}
