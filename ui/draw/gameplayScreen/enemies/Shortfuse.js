import MathUtil from "../../../util/mathUtil.js";
import AnimatedSprite from "../../components/AnimatedSprite.js";
import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import DirectionalMove from "../../components/DirectionalMove.js";
import PositionTracker from "../../components/PositionTracker.js";
import Shaker from "../../components/Shaker.js";
import TargetMove from "../../components/TargetMove.js";
import GoalPlatform from "../platforms/GoalPlatform.js";

class BottomWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('horizontalWall').withPosition({x:0,y:1/64}).withSize({w:1,h:1/32});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.y = Math.max(player.position.y, this.position.y + this.size.h/2 + player.size.h/2);
    player.dy = Math.max(player.dy, 0);
    player.canJump = true;
  }
}

class UpperWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('horizontalWall').withPosition({x:0,y:63/64}).withSize({w:1,h:1/32});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.y = Math.min(player.position.y, this.position.y - this.size.h/2 - player.size.h/2);
    player.dy = Math.min(player.dy, 0);
  }
}

class LeftWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('verticalWall').withPosition({x:-33/64,y:0.5}).withSize({w:1/32,h:1});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.x = Math.max(player.position.x, this.position.x + this.size.w/2 + player.size.w/2);
  }
}

class RightWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('verticalWall').withPosition({x:33/64,y:0.5}).withSize({w:1/32,h:1});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.x = Math.min(player.position.x, this.position.x - this.size.w/2 - player.size.w/2);
  }
}

class ElectricSquare extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.gracePeriod = new Date().getTime() + 1000;
    this.withSprite('electricSquare').withSize({w:1/32, h:1/32});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  setPath() {
    let pos = this.takeTransformSnapshot();
    if (pos.y <= 1/64 && pos.x > -33/64) {
      this.addChild(new TargetMove(this, {x:-33/64,y:1/64}, 1, () => this.setPath()));
    }
    if (pos.y < 63/64 && pos.x <= -33/64) {
      this.addChild(new TargetMove(this, {x:-33/64,y:63/64}, 1, () => this.setPath()));
    }
    if (pos.y >= 63/64 && pos.x < 33/64) {
      this.addChild(new TargetMove(this, {x:33/64,y:63/64}, 1, () => this.setPath()));
    }
    if (pos.y > 1/64 && pos.x >= 33/64) {
      this.addChild(new TargetMove(this, {x:33/64,y:1/64}, 1, () => this.setPath()));
    }
  }
  gracePeriodDone() {
    return new Date().getTime() > this.gracePeriod;
  }
  onCollide(player) {
    player.dead = true;
  }
}

export default class Shortfuse extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 3;
    this.withPosition({x:0,y:-0.5}).withSize({w:0.1,h:0.1}).withSprite('shortfuse').withCameraTransform(parent.cameraTransform);
    this.phase = 'start'; // start, target, prepareDash, dash, wait, recover
    this.addChild(new CollisionShape(this, 'rect', 'both', {tags: ['enemy'], collidesWith: ['enemy']}));
    this.walls = [
      this.addChild(new BottomWall().withCameraTransform(this.cameraTransform)),
      this.addChild(new UpperWall().withCameraTransform(this.cameraTransform)),
      this.addChild(new LeftWall().withCameraTransform(this.cameraTransform)),
      this.addChild(new RightWall().withCameraTransform(this.cameraTransform)),
    ];
    this.subscribeTo('collision', evt => {
      if (evt.collider.parent==this) {
        if (this.walls.includes(evt.collidee.parent) && this.phase=='dash') {
          this.makeElectricSquareInWall(evt.collidee.parent);
          this.transitionToWait();
        }
        if (evt.collidee.parent instanceof ElectricSquare && evt.collidee.parent.gracePeriodDone() && this.phase == 'wait') {
          this.hp--;
          this.damageFlicker = this.addChild(new AnimatedSprite(this, ['shortfuse', 'shortfuse_damaged'], 2, {loopTime: 250}));
          if (this.hp>0) {
            this.transitionToRecover();
          } else {
            this.transitionToDead();
          }
        }
      }
    });
  }

  makeElectricSquareInWall(wall) {
    if (wall instanceof BottomWall) {
      this.addChild(new ElectricSquare()).withPosition({x:this.transformSnapshot.x, y:1/64}).withCameraTransform(this.cameraTransform).setPath();
    }
    if (wall instanceof UpperWall) {
      this.addChild(new ElectricSquare()).withPosition({x:this.transformSnapshot.x, y:63/64}).withCameraTransform(this.cameraTransform).setPath();
    }
    if (wall instanceof LeftWall) {
      this.addChild(new ElectricSquare()).withPosition({x:-33/64, y:this.transformSnapshot.y}).withCameraTransform(this.cameraTransform).setPath();
    }
    if (wall instanceof RightWall) {
      this.addChild(new ElectricSquare()).withPosition({x:33/64, y:this.transformSnapshot.y}).withCameraTransform(this.cameraTransform).setPath();
    }
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'target' : this.update_target(); break;
      case 'prepareDash' : this.update_prepareDash(); break;
      case 'dash' : this.update_dash(); break;
      case 'wait' : this.update_wait(); break;
      case 'recover' : this.update_recover(); break;
    }
    super.update();
  }

  update_start() {
    this.position.y += 0.01;
    if (this.position.y >= 0.9) {
      this.transitionToTarget();
    }
  }

  update_target() {
    if (new Date().getTime() > this.phaseStart + 2000) {
      this.transitionToPrepareDash();
    }
  }

  update_prepareDash() {
    if (new Date().getTime() > this.phaseStart + 2000) {
      this.transitionToDash();
    }
  }

  update_dash() {}

  update_wait() {
    if (new Date().getTime() > this.phaseStart + 3000) {
      this.transitionToRecover();
    }
  }

  update_recover() {}

  transitionToTarget() {
    this.phaseStart = new Date().getTime();
    if (this.damageFlicker) {
      this.damageFlicker.purge();
      this.damageFlicker = null;
    }
    this.crosshairs = BaseComponent.createSprite('crosshairs', {x:0,y:0,w:50/800,h:50/800}).withCameraTransform(this.cameraTransform).withAbsolutePosition()
      .withChild(new PositionTracker(this, this.parent.player, {speed: 1}));
    this.addChild(this.crosshairs);
    this.shaker = new Shaker(this, {shakeAmount:0.01});
    this.addChild(this.shaker);
    this.phase = 'target';
  }

  transitionToPrepareDash() {
    this.phaseStart = new Date().getTime();
    this.crosshairs.sterilize();
    this.phase = 'prepareDash';
  }

  transitionToDash() {
    this.crosshairs.purge();
    this.shaker.purge();
    let dashDirection = MathUtil.diff2v(this.crosshairs.transformSnapshot, this.transformSnapshot);
    this.dasher = new DirectionalMove(this, dashDirection, 4);
    this.addChild(this.dasher);
    this.phase = 'dash';
  }

  transitionToWait() {
    this.phaseStart = new Date().getTime();
    this.dasher.purge();
    this.phase = 'wait';
  }

  transitionToRecover() {
    this.addChild(new TargetMove(this, {x:0,y:0.5}, 0.5, () => {
      this.transitionToTarget();
    }));
    this.phase = 'recover';
  }

  transitionToDead() {
    this.phase = 'dead';
    this.parent.addChild(new GoalPlatform().withPosition({x:0,y:0.5}).withCameraTransform(this.parent.cameraTransform));
  }

  onCollide(player) {
    if (this.phase=='start') {
      return;
    }
    player.dead = true;
    if (this.dasher) {
      this.dasher.purge();
      this.phase = '';
    }
  }

}