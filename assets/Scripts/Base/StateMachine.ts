import { Animation, AnimationClip, Component, _decorator, SpriteFrame, AnimationState, Sprite } from "cc";
import { capitalize } from "../Utils";
import { SpriteAnimClip } from "./SpriteAnimClip";
import { DIRECTION, ENTITY_STATE, DIRECTIVE, STATE_CHANGE_EVENT } from "../Enum";
const { ccclass, property } = _decorator;

/***
 * unit:milisecond
 */
export const ANIMATION_SPEED = 1 / 8;
ccclass("StateMachie");
export default abstract class StateMachie extends Component {
  public animationComponent: Animation = null;
  public waitList: Promise<SpriteFrame[]>[] = [];
  public clipMap: Map<string, SpriteAnimClip> = new Map();
  public isDied: boolean = false;

  protected _state: ENTITY_STATE = ENTITY_STATE.IDLE;
  protected _direction: DIRECTION = DIRECTION.TOP;

  async init(
    entityName: string,
    states: string[],
    dirs: string[],
    wrapMode?: AnimationClip.WrapMode,
    beforeAddClip?: (c: AnimationClip, s: string) => void,
  ) {
    this.animationComponent = this.getComponent(Animation) || this.addComponent(Animation);

    if (!this.getComponent(Sprite)) {
      this.addComponent(Sprite);
    }

    states.forEach(s => {
      dirs.forEach(d => {
        const path = `texture/${entityName}/${s}/${d}`;
        const name = capitalize(s) + capitalize(d);
        const wm = wrapMode || (s === "idle" ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal);
        const clip = new SpriteAnimClip(this, path, name, wm, ANIMATION_SPEED, beforeAddClip);
        this.clipMap.set(name, clip);
      });
    });

    this.animationComponent.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    await Promise.all(this.waitList);
  }

  get state() {
    return this._state;
  }

  set state(v: ENTITY_STATE) {
    this._state = v;
    this.updateState();
  }

  get direction() {
    return this._direction;
  }

  set direction(v: DIRECTION) {
    this._direction = v;
    this.updateState();
  }

  set directive(v: DIRECTIVE) {
    this.handleDirective(v);
  }

  abstract handleDirective(v: DIRECTIVE);

  getAnimationName(str: string) {
    return capitalize(str.toLowerCase().replace("_", ""));
  }

  updateState(): void {
    const stateName = this.getAnimationName(this._state);
    const dirName = this.getAnimationName(this._direction);
    this.animationComponent.play(`${stateName}${dirName}`);
  }

  onAnimationFinished(eventName: string, state: AnimationState) {
    const lname = state.clip.name.toLocaleLowerCase();

    if (lname.includes("death")) {
      this.isDied = true;
    }

    if (["turn", "block", "attack"].find(s => lname.includes(s))) {
      this.state = ENTITY_STATE.IDLE;
    }
  }
}
