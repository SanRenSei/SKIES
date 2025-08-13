import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";

export default class DoorPlatform extends BaseComponent {

  constructor() {
    super();
    this.isOpen = false;
    this.fake = true;
    this.withSize({w:1.33,h:0.04}).withSprite('doorPlatform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  open() {
    this.isOpen = true;
    this.withSprite('doorPlatformTransparent');
  }

  close() {
    this.isOpen = false;
    this.withSprite('doorPlatform');
  }

  onCollide(player) {
    if (this.isOpen) {
      return;
    }
    if (player.dy > 0) {
      player.dy = 0;
    }
  }

}