import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import PositionTracker from "../../components/PositionTracker.js";

export default class Fireball extends BaseComponent {

  constructor(parent) {
    super();
    this.withPosition({x:0,y:-0.5}).withSize({w:0.05,h:0.05}).withSprite('fireball').withCameraTransform(parent.cameraTransform);
    this.phase = 'dormant'; // dormant, active
    this.addChild(new CollisionShape(this, 'oval', 'collidee', {tags: ['enemy']}));
  }

  update() {
    switch (this.phase) {
      case 'dormant': this.update_dormant(); break;
    }
    super.update();
  }

  update_dormant() {
    let player = this.parent.player;
    if (player.position.y > this.position.y - 1) {
      this.transitionToActive();
    }
  }

  transitionToActive() {
    this.addChild(new PositionTracker(this, this.parent.player, {speed:0.5}));
    this.phase = 'active';
  }

  onCollide(player) {
    player.dead = true;
  }

}