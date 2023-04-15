import { _decorator, Animation, Sprite, AnimationClip, AnimationState } from "cc";
import StateMachie from "../Base/StateMachine";
import { DIRECTIVE, DIRECTION, PLAYER_ENVENT, ENTITY_STATE, STEP } from "../Enum";
import DataCenter from "../Base/DataCenter";
import { SpikeController } from "./SpikeController";
import { capitalize } from "../Utils";
import { SpriteAnimClip } from "../Base/SpriteAnimClip";

const { ccclass, property } = _decorator;

const dir = "spikes";
const states = ["spikesone", "spikestwo", "spikesthree", "spikesfour"];
const steps = ["zero", "one", "two", "three", "four", "five"];

@ccclass("SpikeStateMachine")
export class SpikeStateMachine extends StateMachie {
  private controller: SpikeController;
  private _step: STEP = STEP.ZERO;

  async init() {
    this.animationComponent = this.getComponent(Animation) || this.addComponent(Animation);

    if (!this.getComponent(Sprite)) {
      this.addComponent(Sprite);
    }

    states.forEach(s => {
      steps.forEach(d => {
        const path = `texture/${dir}/${s}/${d}`;
        const name = capitalize(s) + capitalize(d);
        const clip = new SpriteAnimClip(this, path, name, AnimationClip.WrapMode.Normal, 1);

        this.clipMap.set(name, clip);
      });
    });

    DataCenter.curPlayer.node.on(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
    this.animationComponent.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    this.controller = this.getComponent(SpikeController);
    await Promise.all(this.waitList);
  }

  set step(s: STEP) {
    this._step = s;
    this.updateState();
  }

  getMaxStep(): STEP {
    const numList = ["zero", "one", "two", "three", "four", "five"];
    return numList.findIndex(n => this._state.toLocaleLowerCase().includes(n)) + 1;
  }

  getNextStep(): STEP {
    const max = this.getMaxStep();
    return this._step < max ? this._step + 1 : 0;
  }

  handleDirective(d: DIRECTIVE) {}

  updateState(): void {
    const stepList = ["Zero", "One", "Two", "Three", "Four", "Five"];
    const stateName = this.getAnimationName(this._state);
    const stepName = stepList[this._step];
    this.animationComponent.play(`${stateName}${stepName}`);
  }

  toAttack(x?: number, y?: number) {
    if (!this.node.active) return;

    const player = DataCenter.curPlayer;
    const px = x || player.controller.x;
    const py = y || player.controller.y;

    if (
      this.controller.x === px &&
      this.controller.y === py &&
      player.stateMachine.state !== ENTITY_STATE.DEATH
    ) {
      console.log("sppike kill...",this.node);
      player.stateMachine.state = ENTITY_STATE.DEATH;
    }
  }

  onMoveEnd(x: number, y: number) {
    if (this._step === this.getMaxStep()) {
      this.toAttack(x, y);
    }
  }

  onAnimationFinished(eventName: string, state: AnimationState) {
    this.step = this.getNextStep();
    if (this._step === this.getMaxStep()) {
      this.toAttack();
    }
  }

  protected onDestroy(): void {
    DataCenter.curPlayer.node && DataCenter.curPlayer.node.off(PLAYER_ENVENT.MOVE_END, this.onMoveEnd, this);
  }
}
