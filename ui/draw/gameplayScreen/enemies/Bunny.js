import AnimatedSprite from "../../components/AnimatedSprite.js";
import BaseComponent from "../../components/BaseComponent.js";


export default class Bunny extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 3;
    this.withPosition({x:-0.5 + Math.random(),y:0.05}).withSize({w:1/10,h:1/10}).withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new AnimatedSprite(this, 'bunnyRun', 6));
    this.moveLeft();
  }

  update() {
    super.update();
    if (this.targetX > this.position.x) {
      this.position.x += 0.01;
      if (this.position.x >= this.targetX) {
        this.moveLeft();
      }
      return;
    }
    if (this.targetX < this.position.x) {
      this.position.x -= 0.01;
      if (this.position.x <= this.targetX) {
        this.moveRight();
      }
      return;
    }

  }

  moveLeft() {
    let range = this.position.x + 0.5;
    if (range<0) {
      range = 0;
    }
    this.targetX = -0.5 + range*Math.random();
    this.size.w = Math.abs(this.size.w);
  }

  moveRight() {
    let range = 0.5 - this.position.x;
    if (range<0) {
      range = 0;
    }
    this.targetX = 0.5 - range*Math.random();
    this.size.w = -Math.abs(this.size.w);
  }

}