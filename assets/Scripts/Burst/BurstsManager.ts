/* eslint-disable require-atomic-updates */
import { _decorator, Animation, Component, Sprite, Node, instantiate } from "cc";
import DataCenter from "../Base/DataCenter";
import { IEntity } from "../Levels/index";
import { BurstManager } from "./BurstManager";
import { createUINode } from "../Utils";
import { ENTITY_TYPE_ENUM } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("BurstsManager")
export class BurstsManager extends Component {
  public bursts: Array<BurstManager> = [];
  async init() {
    DataCenter.curBurst = this;
  }

  setup(infos: IEntity[]) {
    this.node.destroyAllChildren();
    this.bursts.length = 0;
    const tasks: any[] = infos.map(async info => {
      return (async () => {
        const node = createUINode();
        const manager = node.addComponent(BurstManager)

        node.addComponent(Sprite);
        await manager.init();

        this.bursts.push(manager);
        node.setParent(this.node);
        manager.setup(info);
      })();
    });

    this.node.setPosition(0, 0, 0);
    return Promise.all(tasks);
  }

  getBurstByPos(x: number, y: number) {
    return this.bursts.find(b => {
      return b.controller.x === x && b.controller.y === y;
    });
  }

  start() {}
}
