/* eslint-disable require-atomic-updates */
import { _decorator, Animation, Component, Sprite, Node, instantiate } from "cc";
import DataCenter from "../Base/DataCenter";
import { ISpikes } from "../Levels/index";
import { SpikeManager } from "./SpikeManager";
import { createUINode } from "../Utils";
import { ENTITY_TYPE_ENUM } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("SpikesManager")
export class SpikesManager extends Component {
  public spikes: Array<SpikeManager> = [];
  public spikeNode: Node;
  async init() {
    DataCenter.curSpike = this;
  }

  setup(infos: ISpikes[]) {
    this.node.destroyAllChildren();
    this.spikes.length = 0;

    const tasks: any[] = infos.map(async info => {
      return (async () => {
        const node = createUINode();
        const manager = node.addComponent(SpikeManager);

        node.addComponent(Sprite);
        await manager.init();

        this.spikes.push(manager);
        node.setParent(this.node);
        manager.setup(info);
      })();
    });

    this.node.setPosition(0, 0, 0);
    return Promise.all(tasks);
  }

  getSpikeByPos(x: number, y: number) {
    return this.spikes.find(b => {
      return b.controller.x === x && b.controller.y === y;
    });
  }

  start() {}
}
