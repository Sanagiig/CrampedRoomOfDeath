import {Component, _decorator, Sprite, UITransform} from "cc";
import {TILE_HEIGHT, TILE_WIDTH} from "../Base/Const";
import DataCenter from "./DataCenter";
const {ccclass, property} = _decorator;

export const ANIMATION_SPEED = 1 / 8;
ccclass("EntityController");
export default class EntityController extends Component {
  public x = 0;
  public y = 0;

  protected init() {
    const ui = this.getComponent(UITransform) || this.addComponent(UITransform);
    const sprite = this.getComponent(Sprite) || this.node.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    ui.setAnchorPoint(0, 1);
    ui.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);
  }

  protected refresh(dt?: number): void {
    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5 ,
    );
  }
}
