import CoordUtil from "../../../util/coordUtil.js";
import MathUtil from "../../../util/mathUtil.js";
import AnimatedSprite from "../../../core/components/AnimatedSprite.js";
import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";
import Gravity from "../../../core/components/Gravity.js";

class Cage extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.withSprite('blackCage').withSize({w:1/16,h:1/16}).withPosition({x:1,y:1});
    this.wings = this.addChild(new AnimatedSprite(this, 'cageWings', 2));
    this.period = 1000 + 2000*Math.random();
    this.amplitude = 0.2+0.2*Math.random();
    this.speed = 0.2+0.2*Math.random();
    this.startTime = new Date().getTime();
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: 'enemy'}));
  }

  update() {
    super.update();
    if (this.wings) {
      let elapsedTime = new Date().getTime() - this.startTime;
      this.withPosition({x:1-this.speed*elapsedTime/1000, y: 1 - this.amplitude*Math.sin(elapsedTime/this.period)});
      return;
    }
  }

  onCollide(player) {
    if (this.wings) {
      this.wings.purge();
      this.wings = null;
      this.addChild(new Gravity(this, {strength: 0.3}));
    }
  }
}

export default class WingedCageSpawner extends BaseComponent {

  constructor(parent) {
    super(parent);
    this.lastCage = new Date().getTime();
  }

  update() {
    super.update();
    if (new Date().getTime() > this.lastCage + 4000) {
      this.spawnCage();
    }
  }

  spawnCage() {
    this.parent.addChild(new Cage(this.parent));
    this.lastCage = new Date().getTime();
  }

}