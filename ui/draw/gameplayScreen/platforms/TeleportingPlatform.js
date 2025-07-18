import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";

export default class TeleportingPlatform extends BaseComponent {

  constructor() {
    super();
    this.used = false;
    this.withSize({w:75/600,h:0.02}).withSprite('teleportingPlatform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (player.dy < 0) {
      player.dy = 0.5;
      if (!this.used) {
        this.withPosition({x:1.33*Math.random()-0.66,y:this.position.y+0.2+0.3*Math.random()});
        this.used = true;
      }
    }
  }

}