import { Vec2, v2 } from "cc";
import { PlayerManager } from "../Player/PlayerManager";
import { TileMapManager } from "../Tile/TileMapManager";
import { EnemyManager } from "../Enemy/EnemyManager";
import { DoorManager } from "../Door/DoorManager";
import { GameManager } from "../GameManager";
import { BurstsManager } from "../Burst/BurstsManager";
import { SpikesManager } from "../Spike/SpikesManager";
import { SmokeManager } from "../Smoke/SmokeManager";
import { StageManager } from "../StageManager";

interface MapInfo {
  startPos: Vec2;
}

class DataCenter {
  static game: GameManager;
  static stage: StageManager;
  static mapInfo: MapInfo = { startPos: v2(0, 0) };
  static curMap: TileMapManager;
  static curPlayer: PlayerManager;
  static curEnemy: EnemyManager;
  static curDoor: DoorManager;
  static curBurst: BurstsManager;
  static curSpike: SpikesManager;
  static curSmoke: SmokeManager;
}

export default DataCenter;
