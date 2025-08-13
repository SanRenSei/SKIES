import CoordUtil from "../../../util/coordUtil.js";
import MathUtil from "../../../util/mathUtil.js";
import AnimatedSprite from "../../../core/components/AnimatedSprite.js";
import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";
import DirectionalMove from "../../../core/components/DirectionalMove.js";
import Gravity from "../../../core/components/Gravity.js";

class Egg extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.target = this.parent.player.transformSnapshot;
    this.withSprite('egg').withSize({w:1/16,h:1/16});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: 'enemy'}));
    this.addChild(new DirectionalMove(this, MathUtil.diff2v(this.target, this.transformSnapshot), 1));
  }

  onCollide(player) {
  }
}

class HomingCarrot extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.maxDr = 3;
    this.withSprite('carrot').withSize({w:1/32,h:1/64});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: 'enemy'}));
  }

  update() {
    super.update();
    this.maxDr -= 0.01;
    if (this.maxDr<0) {
      this.maxDr = 0;
    }
    let targetDir = MathUtil.diff2v(this.parent.player.transformSnapshot, this.transformSnapshot);
    let targetR = Math.atan2(targetDir.y, targetDir.x);
    this.withRotation(CoordUtil.applyRotation(this.rotation, targetR, this.maxDr*0.01));
    this.withPosition(MathUtil.add2v(this.transformSnapshot, {x:0.01*Math.cos(this.rotation), y:0.01*Math.sin(this.rotation)}));
  }

  onCollide(player) {
  }
}

class ParabolicCarrot extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.withSprite('carrot').withSize({w:1/32,h:1/64});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: 'enemy'}));
    this.addChild(new Gravity(this, { strength: 0.5}));
  }

  update() {
    super.update();
    this.position.x += this.dx*0.01;
  }

  onCollide(player) {
  }
}

export default class Bunny extends BaseComponent {

  constructor(parent) {
    super(parent);
    this.hp = 3;
    this.withPosition({x:-0.5 + Math.random(),y:0.05}).withSize({w:1/10,h:1/10});
    this.takeTransformSnapshot();
    this.addChild(new AnimatedSprite(this, 'bunnyRun', 6));
    this.moveLeft();
    this.attackDelay = 1000;
    this.queueAttack();
  }

  update() {
    super.update();
    if (new Date().getTime() > this.nextAttack) {
      this.doAttack();
    }
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

  doAttack() {
    if (Math.random() < 0.33) {
      this.doParabolicAttack();
    } else if (Math.random() < 0.66) {
      this.doHomingAttack();
    } else {
      this.doEggAttack();
    }
  }

  queueAttack() {
    this.nextAttack = new Date().getTime() + this.attackDelay + this.attackDelay*Math.random();
  }

  doHomingAttack() {
    this.parent.addChild(new HomingCarrot(this.parent)).withPosition(this.transformSnapshot).withRotation(Math.PI/2);
    this.queueAttack();
  }

  doParabolicAttack() {
    let carrot = this.parent.addChild(new ParabolicCarrot(this.parent)).withPosition(this.transformSnapshot).withRotation(Math.PI/2);
    let landingTime = 2 + 2*Math.random();
    carrot.dx = (this.parent.player.transformSnapshot.x - this.transformSnapshot.x);
    carrot.dy = (this.parent.player.transformSnapshot.y - this.transformSnapshot.x + 0.5 * 0.4 * landingTime ** 2) / landingTime;
    this.queueAttack();
  }

  doEggAttack() {
    this.parent.addChild(new Egg(this.parent).withPosition(this.transformSnapshot));
    this.queueAttack();
  }

}