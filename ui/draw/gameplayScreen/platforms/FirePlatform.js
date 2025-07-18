import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import Gravity from "../../components/Gravity.js";

export default class FirePlatform extends BaseComponent {

  constructor() {
    super();
    this.lit = false;
    this.gracePeriod = null;
    this.withSize({w:75/600,h:0.02}).withSprite('platform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (!this.lit && player.dy < 0) {
      this.withSprite('firePlatform');
      this.lit = true;
      this.gracePeriod = new Date().getTime() + 1000;
      player.dy = 0.5;
      return;
    }
    if (this.lit && new Date().getTime() > this.gracePeriod) {
      player.dead = true;
    }
  }

}