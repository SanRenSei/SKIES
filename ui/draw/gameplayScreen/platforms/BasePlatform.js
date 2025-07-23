import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";

export default class BasePlatform extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:0,y:-0.5}).withSize({w:1.33,h:1});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (player.dy<=0) {
      player.canJump = true;
      player.dy = Math.max(player.dy, 0);
    }
    player.position.y = Math.max(player.position.y, player.size.h/2);
  }

}