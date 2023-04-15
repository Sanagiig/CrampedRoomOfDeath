import { AnimationClip, Sprite, SpriteFrame, animation } from "cc";
import StateMachie from "./StateMachine";
import { loader } from "../Utils/loader";
import { sortSpriteFrame } from "../Utils";

export const ANIMATION_SPEED = 1 / 8;

export class SpriteAnimClip {
  clip: AnimationClip = null;
  constructor(
    private fsm: StateMachie,
    private path: string,
    public clipName: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed = ANIMATION_SPEED,
    private beforeAddClip?: (clip: AnimationClip, name: string) => void,
  ) {
    this.init();
  }

  async init() {
    const clip = new AnimationClip();
    const track = new animation.ObjectTrack();
    const ayncLoader = loader.loadDir(this.path, SpriteFrame);

    this.fsm.waitList.push(ayncLoader);
    const spriteFrames = await ayncLoader;
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, idx) => {
      return [idx * this.speed, item];
    });

    if (frames.length) {
      track.path = new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
      track.channel.curve.assignSorted(frames);
      clip.name = this.clipName;
      clip.duration = this.speed * frames.length;
      clip.wrapMode = this.wrapMode;
      clip.addTrack(track);

      if (this.beforeAddClip) {
        this.beforeAddClip(clip, this.clipName);
      }

      this.fsm.animationComponent.addClip(clip);
      this.clip = clip;
    }
  }

  run() {
    const anim = this.fsm.animationComponent;
    if (anim.defaultClip && anim.defaultClip.name === this.clipName) {
      return;
    }

    anim.defaultClip = this.clip;
    this.fsm.animationComponent.play();
  }
}
