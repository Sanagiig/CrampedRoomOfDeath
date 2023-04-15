import { _decorator, Component, resources, SpriteFrame } from "cc";
import { ITile } from "../Levels/index";
import { getRangeRand, createUINode } from "../Utils";
import { TileManager } from "./TileManager";
const { ccclass, property } = _decorator;

import DataCenter from "../Base/DataCenter";

@ccclass("TileMapManager")
export class TileMapManager extends Component {
  private spriteFrames: SpriteFrame[] = [];
  public isInitial = false;
  public row: number = 0;
  public col: number = 0;
  constructor(
    private sroucePath: string = "texture/tile/tile",
    private tileName: string = "tile (${})",
  ) {
    super();
  }

  async init() {
    await new Promise((res, rej) => {
      resources.loadDir(this.sroucePath, SpriteFrame, (err, asset) => {
        if (err) {
          console.error("TileManager load failed.", err);
          rej(err);
          return;
        }

        this.isInitial = true;
        this.spriteFrames = asset;
        res(asset);
      });
    });
    DataCenter.curMap = this;
  }

  start() {}

  setup(mapInfo: ITile[][]) {
    let num = 0;
    this.row = mapInfo.length;
    this.col = mapInfo[0].length;
    this.node.removeAllChildren();
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i];
      for (let j = 0; j < column.length; j++) {
        const item = column[j];
        num = item.src;

        if (!item.src || item.type === null) {
          continue;
        }

        if (num === 1 || num === 5 || (num === 9 && Math.random()) > 0.5) {
          num += getRangeRand(0, 4);
        }

        const tile = createUINode();
        const imgSrc = this.tileName.replace("${}", num.toString());
        const spriteFrame = this.spriteFrames.find(item => item.name === imgSrc);
        const type = item.type;
        const tileManager = tile.addComponent(TileManager);
        tile.setParent(this.node);
        tileManager.init(type, spriteFrame, i, j);
        this.node.addChild(tile);
      }
    }
  }

  getTargetNodeInstance(x: number, y: number) {
    const node = this.node.getChildByName(`${x}_${y}`);
    if (!node) {
      return false;
    }
    return node.getComponent(TileManager);
  }

  isMovable(x: number, y: number) {
    const instance = this.getTargetNodeInstance(x, y);
    return instance && instance.moveable;
  }

  isTurnable(x: number, y: number) {
    const instance = this.getTargetNodeInstance(x, y);
    return !instance || instance.turnable;
  }
}
