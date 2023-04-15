import { _decorator, Component, director, Label, Node, ProgressBar, resources } from "cc";
const { ccclass, property } = _decorator;

const textList = [
  "初始化坐标",
  "肉鸽算法",
  "地图",
  "关卡数据",
  "陷阱",
  "武器",
  "主角的秘密武器",
  "强力的敌人",
  "任意门",
  "通关奖励",
];
@ccclass("LoadingManager")
export class LoadingManager extends Component {
  @property({ type: ProgressBar })
  bar: ProgressBar = null;
  @property({ type: Label })
  loadingText: Label = null;

  protected onLoad(): void {
    resources.preloadDir(
      "texture",
      (cur, total) => {
        const idx = Math.ceil((cur / total) * 10);
        this.bar.progress = cur / total;
        this.loadingText.string = `正在加载${textList[idx] || ""}...`;
      },
      () => {
        director.loadScene("Game");
      },
    );
  }
}
