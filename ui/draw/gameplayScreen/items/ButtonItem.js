import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";

export default class ButtonItem extends BaseComponent {

  constructor() {
    super();
    this.gracePeriod = new Date().getTime() + 500;
    this.withPosition({x:0,y:0.02}).withSize({w:0.05,h:0.02}).withSprite('redButton');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['item']}));
  }

  withDoor(doorPlatform) {
    this.doorPlatform = doorPlatform;
    return this;
  }

  onCollide(player) {
    if (new Date().getTime() < this.gracePeriod) {
      return;
    }
    if (player.dy<0) {
      this.doorPlatform.open();
      this.purge();
    }
  }

}