/* eslint-disable require-atomic-updates */
import { _decorator, Animation, Component, Sprite, Node, instantiate } from "cc";
import DataCenter from "../Base/DataCenter";
import { IEntity } from "../Levels/index";
import { IronSkeletonManager } from "./Iron/IronSkeletonManager";
import { WoodenSkeletonManager } from "./Wooeden/WoodenSkeletonManager";
import { createUINode } from "../Utils";
import { ENTITY_TYPE_ENUM } from "../Enum";

const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
  public enemies: Array<WoodenSkeletonManager | IronSkeletonManager> = [];
  async init() {
    DataCenter.curEnemy = this;
  }

  setup(infos: IEntity[]) {
    this.node.destroyAllChildren();
    this.enemies.length = 0;

    const tasks: any[] = infos.map(async info => {
      return (async () => {
        const node = createUINode();
        let manager;
        switch (info.type) {
          case ENTITY_TYPE_ENUM.SKELETON_WOODEN:
            manager = node.addComponent(WoodenSkeletonManager);

            break;
          case ENTITY_TYPE_ENUM.SKELETON_IRON:
            manager = node.addComponent(IronSkeletonManager);
            break;
        }

        node.addComponent(Sprite);
        await manager.init();
        node.active = true;
        this.enemies.push(manager);
        node.setParent(this.node);
        manager.setup(info);
      })();
    });

    this.node.setPosition(0, 0, 0);
    return Promise.all(tasks);
  }

  start() {}
}
