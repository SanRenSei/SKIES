import MathUtil from "../../../util/mathUtil.js";
import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import DirectionalMove from "../../components/DirectionalMove.js";
import MaterializeUp from "../../components/MaterializeUp.js";
import Spin from "../../components/Spin.js";
import ButtonItem from "../items/ButtonItem.js";
import DoorPlatform from "../platforms/DoorPlatform.js";
import GoalPlatform from "../platforms/GoalPlatform.js";
import NormalPlatform from "../platforms/NormalPlatform.js";

export default class Spikesnap extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 3;
    this.withPosition({x:0,y:-0.5}).withSize({w:0.33,h:0.2}).withSprite('spikesnap').withCameraTransform(parent.cameraTransform);
    this.phase = 'start'; // start, move, fall, stun, rise, dead
    this.topHalf = new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}).withPosition({x:0,y:0.05}).withSize({w:0.33, h:0.1});
    this.bottomHalf = new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}).withPosition({x:0,y:-0.04}).withSize({w:0.28, h:0.08});
    this.addChildren([this.topHalf, this.bottomHalf]);
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'move' : this.update_move(); break;
      case 'fall' : this.update_fall(); break;
      case 'stun' : this.update_stun(); break;
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
    this.nextGear--;
    if (this.nextGear<=0) {
      this.nextGear = 50 - this.hp*10;
      this.addChild(new Gear(this).target(this.parent.player));
    }
    if (this.parent.children.filter(c => c instanceof DoorPlatform)[1].isOpen) {
      console.log(this.parent.children.filter(c => c instanceof DoorPlatform))
      this.transitionToFall();
    }
  }

  update_fall() {
    this.oscillate();
    this.dy += 0.01 * this.ddy;
    this.position.y += 0.01 * this.dy;
    if (this.position.y < 0.1 && this.dy < 0) {
      this.withSprite('spikedomeHurt');
      this.dy = -0.5*this.dy;
      this.bounces++;
    }
    if (this.bounces>=3) {
      this.dy = 0;
      this.transitionToStun();
    }
  }

  update_stun() {
    if (new Date().getTime() - this.stunStartTime > 2000) {
      this.transitionToRise();
    }
  }

  transitionToRise() {
    this.parent.children.filter(c => c instanceof DoorPlatform).forEach(p => p.close());
    this.withSprite('spikedome');
    this.phase = 'start';
  }

  transitionToMove() {
    let regularPlatforms = this.parent.children.filter(c => c instanceof NormalPlatform);
    let doorPlatforms = this.parent.children.filter(c => c instanceof DoorPlatform);
    regularPlatforms[Math.floor(3*Math.random())].addChild(new ButtonItem().withDoor(doorPlatforms[0]).withCameraTransform(this.cameraTransform));
    regularPlatforms[3+Math.floor(3*Math.random())].addChild(new ButtonItem().withDoor(doorPlatforms[1]).withCameraTransform(this.cameraTransform));
    this.phase = 'move';
    this.movingRight = true;
    this.nextGear = 50;
  }

  transitionToFall() {
    this.ddy = -0.5;
    this.dy = 0;
    this.bounces = 0;
    this.phase = 'fall';
  }

  transitionToStun() {
    this.hp--;
    this.stunStartTime = new Date().getTime();
    this.phase = 'stun';
    if (this.hp<=0) {
      this.phase = 'dead';
      this.parent.addChild(new GoalPlatform().withPosition({x:0,y:0.5}).withCameraTransform(this.parent.cameraTransform));
    }
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
    if (this.phase=='start') {
      return;
    }
    if (collisionSpot==this.topHalf) {
      player.dy = 0.25;
      player.position.y = Math.max(player.transformSnapshot.y, this.transformSnapshot.y + this.transformSnapshot.h/2 + player.transformSnapshot.h/2);
    }else {
      player.dead = true;
    }
  }

}