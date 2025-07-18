import AnimatedSprite from "../../components/AnimatedSprite.js";
import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";

export default class Ligature extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 1;
    this.withPosition({x:0,y:-0.5}).withSize({w:0.33,h:0.2}).withCameraTransform(parent.cameraTransform);
    this.addChild(new AnimatedSprite(this, 'ligatureFace', 6));
    this.phase = 'start'; // start, move, fall, stun, rise, dead
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'move' : this.update_move(); break;
    }
    super.update();
  }

  update_start() {
    this.position.y += 0.005;
    if (this.position.y >= 0.9) {
      this.transitionToMove();
    }
  }

  update_move() {
    this.oscillate();
  }

  transitionToMove() {
    this.phase = 'move';
    this.movingRight = true;
  }

  oscillate() {
    if (this.movingRight) {
      this.position.x += 0.007;
      if (this.position.x > 0.6) {
        this.movingRight = false;
      }
      return;
    }
    this.position.x -= 0.007;
    if (this.position.x < -0.6) {
      this.movingRight = true;
    }
  }

  onCollide(player, collisionSpot) {
  }

}