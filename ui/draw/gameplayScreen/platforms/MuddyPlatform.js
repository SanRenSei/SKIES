import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";

export default class MuddyPlatform extends BaseComponent {

  constructor() {
    super();
    this.withSize({w:75/600,h:0.02}).withSprite('swampPlatform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (player.dy < 0) {
      player.dy = 0.35;
      player.slowed = true;
    }
  }

}