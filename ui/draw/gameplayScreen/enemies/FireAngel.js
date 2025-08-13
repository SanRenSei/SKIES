import CoordUtil from "../../../util/coordUtil.js";
import MathUtil from "../../../util/mathUtil.js";
import AnimatedSprite from "../../../core/../core/components/AnimatedSprite.js";
import BaseComponent from "../../../core/../core/components/BaseComponent.js";
import CollisionShape from "../../../core/../core/components/CollisionShape.js";
import Gravity from "../../../core/../core/components/Gravity.js";

export default class FireAngel extends BaseComponent {

  constructor(parent) {
    super(parent);
    this.withSprite('fireAngel').withSize({w:1/6,h:1/6}).withPosition({x:-0.5,y:1/16});
    this.startTime = new Date().getTime();
  }

  update() {
    super.update();
    let elapsedTime = new Date().getTime() - this.startTime;
    this.withPosition({x:this.position.x, y: 1/16 + 1/16*Math.sin(elapsedTime/5000)});
  }

}