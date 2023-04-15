import { _decorator, Component } from "cc";
import levels from "./Levels";
import { TileMapManager } from "./Tile/TileMapManager";
import { PlayerManager } from "./Player/PlayerManager";
import { TILE_HEIGHT, TILE_WIDTH } from "./Base/Const";
import { EnemyManager } from "./Enemy/EnemyManager";
import { DoorManager } from "./Door/DoorManager";
import { BurstsManager } from "./Burst/BurstsManager";
import { SpikesManager } from "./Spike/SpikesManager";
import { SmokeManager } from "./Smoke/SmokeManager";
import { ShakeManager } from "./Shake/ShakeManager";
import DataCenter from "./Base/DataCenter";
import { ENTITY_STATE } from "./Enum";
const { ccclass, property } = _decorator;

interface EntityData {
  x: number;
  y: number;
  state: ENTITY_STATE;
  params?: any;
  isDied?: boolean;
}

interface DataStack {
  player: EntityData;
  enemies: EntityData[];
  bursts: EntityData[];
  spikes: EntityData[];
  door: EntityData;
}

@ccclass("StageManager")
export class StageManager extends Component {
  public tileMapManager: TileMapManager = null;
  public playerManager: PlayerManager = null;
  public enemyManager: EnemyManager = null;
  public doorManager: DoorManager = null;
  public burstsManager: BurstsManager = null;
  public spikesManager: SpikesManager = null;
  public smokeManager: SmokeManager = null;
  public shakeManager: ShakeManager = null;
  private dataStack: DataStack[] = [];

  async init() {
    this.tileMapManager = this.getComponentInChildren(TileMapManager);
    this.playerManager = this.getComponentInChildren(PlayerManager);
    this.enemyManager = this.getComponentInChildren(EnemyManager);
    this.doorManager = this.getComponentInChildren(DoorManager);
    this.burstsManager = this.getComponentInChildren(BurstsManager);
    this.spikesManager = this.getComponentInChildren(SpikesManager);
    this.smokeManager = this.getComponentInChildren(SmokeManager);
    this.shakeManager = this.addComponent(ShakeManager);

    await this.tileMapManager.init();
    await this.playerManager.init();
    await this.enemyManager.init();
    await this.doorManager.init();
    await this.burstsManager.init();
    await this.spikesManager.init();
    await this.smokeManager.init();

    console.log("StageManager", this);
    DataCenter.stage = this;
  }

  start() {}

  adaptPos() {
    const distX = (-this.tileMapManager.row * TILE_WIDTH) / 2;
    const distY = (this.tileMapManager.col * TILE_HEIGHT) / 2;

    this.node.setPosition(distX, distY);
  }

  async toLevel(num: number) {
    const levelInfo = levels["level" + num];
    this.tileMapManager.setup(levelInfo.mapInfo);
    this.adaptPos();

    this.dataStack.length = 0;
    this.doorManager.setup(levelInfo.door);
    this.playerManager.setup(levelInfo.player);
    this.burstsManager.setup(levelInfo.bursts);
    this.spikesManager.setup(levelInfo.spikes);
    this.enemyManager.setup(levelInfo.enemies);
  }

  saveData() {
    const { playerManager, enemyManager, doorManager, burstsManager, spikesManager } = this;
    const data = {} as DataStack;
    this.dataStack.push(data);
    data.player = {
      x: playerManager.controller.x,
      y: playerManager.controller.y,
      state: playerManager.stateMachine.state,
      params: playerManager.stateMachine.direction,
      isDied: playerManager.stateMachine.isDied,
    };

    data.enemies = enemyManager.enemies.map(item => {
      return {
        x: item.controller.x,
        y: item.controller.y,
        state: item.stateMachine.state,
        params: item.stateMachine.direction,
        isDied: item.stateMachine.isDied,
      };
    });

    data.door = {
      x: doorManager.controller.x,
      y: doorManager.controller.y,
      state: doorManager.stateMachine.state,
      params: doorManager.stateMachine.direction,
      isDied: doorManager.stateMachine.isDied,
    };

    data.bursts = burstsManager.bursts.map(item => {
      return {
        x: item.controller.x,
        y: item.controller.y,
        state: item.stateMachine.state,
        isDied: item.stateMachine.isDied,
      };
    });

    data.spikes = spikesManager.spikes.map(item => {
      return {
        x: item.controller.x,
        y: item.controller.y,
        state: item.stateMachine.state,
        params: item.stateMachine.step,
      };
    });
  }

  resoreData() {
    const { playerManager, enemyManager, doorManager, burstsManager, spikesManager } = this;
    const data = this.dataStack.pop();

    if (!data) return;

    playerManager.controller.x = data.player.x;
    playerManager.controller.y = data.player.y;
    playerManager.stateMachine.state = data.player.state;
    playerManager.stateMachine.direction = data.player.params;
    playerManager.stateMachine.isDied = data.player.isDied;
    playerManager.controller.refresh();

    data.enemies.forEach((item, i) => {
      enemyManager.enemies[i].controller.x = item.x;
      enemyManager.enemies[i].controller.y = item.y;
      enemyManager.enemies[i].stateMachine.state = item.state;
      enemyManager.enemies[i].stateMachine.direction = item.params;
      enemyManager.enemies[i].stateMachine.isDied = item.isDied;
    });

    doorManager.controller.x = data.door.x;
    doorManager.controller.y = data.door.y;
    doorManager.stateMachine.state = data.door.state;
    doorManager.stateMachine.direction = data.door.params;
    doorManager.stateMachine.isDied = data.door.isDied;

    data.bursts.forEach((item, i) => {
      burstsManager.bursts[i].controller.x = item.x;
      burstsManager.bursts[i].controller.y = item.y;
      burstsManager.bursts[i].stateMachine.state = item.state;
      burstsManager.bursts[i].stateMachine.isDied = item.isDied;
    });

    data.spikes.forEach((item, i) => {
      spikesManager.spikes[i].controller.x = item.x;
      spikesManager.spikes[i].controller.y = item.y;
      spikesManager.spikes[i].stateMachine.state = item.state;
      spikesManager.spikes[i].stateMachine.step = item.params;
    });
  }
}
