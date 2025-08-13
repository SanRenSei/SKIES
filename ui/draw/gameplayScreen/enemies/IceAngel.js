import CoordUtil from "../../../util/coordUtil.js";
import MathUtil from "../../../util/mathUtil.js";
import AnimatedSprite from "../../../core/components/AnimatedSprite.js";
import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";
import Gravity from "../../../core/components/Gravity.js";

export default class IceAngel extends BaseComponent {

  constructor(parent) {
    super(parent);
    this.withSprite('iceAngel').withSize({w:1/6,h:1/6}).withPosition({x:0.5,y:1});
    this.startTime = new Date().getTime();
  }

  update() {
    super.update();
    let elapsedTime = new Date().getTime() - this.startTime;
    this.withPosition({x:this.position.x, y: 1 + 1/16*Math.sin(elapsedTime/5000)});
  }

}