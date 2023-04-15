import { Component, game, _decorator, v3 } from "cc";
import { DIRECTION } from "../Enum";
const { ccclass } = _decorator;

@ccclass("ShakeManager")
export class ShakeManager extends Component {
  private isShaking = false;
  private shakeType: DIRECTION;
  private startTime: number;
  private prePos = v3(0, 0, 0);

  stop() {
    this.isShaking = false;
  }

  shake(type: DIRECTION) {
    this.shakeType = type;
    this.startTime = game.totalTime;
    this.prePos = this.node.getPosition();
    this.isShaking = true;
  }

  shakeUpdate() {
    if (this.isShaking) {
      const shakeAmount = 1.2;
      const duration = 200;
      const frequency = 18;
      const totalTime = game.totalTime - this.startTime;
      const pos = this.prePos.clone();
      const offset = shakeAmount * Math.sin((frequency * Math.PI * totalTime) / 1000);

      if (totalTime >= duration) {
        this.isShaking = false;
        this.node.setPosition(this.prePos);
        return;
      }

      switch (this.shakeType) {
        case DIRECTION.TOP:
          pos.y -= offset;
          break;
        case DIRECTION.BOTTOM:
          pos.y += offset;
          break;
        case DIRECTION.LEFT:
          pos.x -= offset;
          break;
        case DIRECTION.RIGHT:
          pos.x += offset;
          break;
      }
      this.node.setPosition(pos);
    }
  }

  update() {
    this.shakeUpdate();
  }
}
