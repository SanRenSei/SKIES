import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import Gravity from "../../components/Gravity.js";

export default class NormalPlatform extends BaseComponent {

  constructor() {
    super();
    this.withSize({w:75/600,h:0.02}).withSprite('platform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (player.dy < 0) {
      player.dy = 0.5;
    }
  }

}