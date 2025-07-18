import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import WinPopup from "../WinPopup.js";

export default class GoalPlatform extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:0,y:0.5}).withSize({w:1.33,h:0.05}).withSprite('goalPlatform');
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  onCollide(player) {
    if (!this.parent.done && player.dy < 0) {
      player.dy = 0;
      this.parent.player.stopMoving();
      this.parent.addChild(new WinPopup());
      this.parent.done = true;
    }
  }

}