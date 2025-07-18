import MathUtil from "../../../util/mathUtil.js";
import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import DirectionalMove from "../../components/DirectionalMove.js";
import PositionTracker from "../../components/PositionTracker.js";
import Shaker from "../../components/Shaker.js";

class BottomWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('horizontalWall').withPosition({x:0,y:1/64}).withSize({w:1,h:1/32});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.y = Math.max(player.position.y, this.position.y + this.size.h/2 + player.size.h/2);
    player.dy = 0;
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
  }
}

class LeftWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('verticalWall').withPosition({x:-0.5,y:0.5}).withSize({w:1/32,h:1});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.x = Math.max(player.position.x, this.position.x + this.size.h/2 + player.size.h/2);
  }
}

class RightWall extends BaseComponent {
  constructor() {
    super();
    this.absolutePosition = true;
    this.withSprite('verticalWall').withPosition({x:0.5,y:0.5}).withSize({w:1/32,h:1});
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }
  onCollide(player) {
    player.position.x = Math.min(player.position.x, this.position.x - this.size.h/2 - player.size.h/2);
  }
}

export default class Shortfuse extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 1;
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
          this.transitionToWait();
        }
      }
    });
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
    this.position.y += 0.05;
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

  update_dash() {

  }

  update_wait() {

  }

  transitionToTarget() {
    this.phaseStart = new Date().getTime();
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