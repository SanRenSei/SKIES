import AnimatedSprite from "../../components/AnimatedSprite.js";
import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import DirectionalMove from "../../components/DirectionalMove.js";
import MaterializeUp from "../../components/MaterializeUp.js";
import TiledSprite from "../../components/TiledSprite.js";
import NormalPlatform from "../platforms/NormalPlatform.js";

class RedCage extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.ready = false;
    this.hp = 10;
    this.withPosition({x:0,y:1/32}).withSize({w:1/16,h:1/16}).withSprite('redCage').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new MaterializeUp(this, 2000, () => {this.ready = true;}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['item']}));
  }
  onCollide(player) {
    if (!this.ready) {
      return;
    }
    player.getSnared(this);
  }
}

class GreenCage extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.ready = false;
    this.hp = 10;
    this.withPosition({x:0,y:1/32}).withSize({w:1/16,h:1/16}).withSprite('greenCage').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new MaterializeUp(this, 2000, () => {this.ready = true;}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['item']}));
  }
  onCollide(player) {
    if (!this.ready) {
      return;
    }
    player.getSnared(this);
  }
}

class StringyDoomLeft extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.absolutePosition = true;
    this.withPosition({x:1,y:2}).withSize({w:2,h:2}).withSprite('stringyDoomL').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new TiledSprite(this, {w:1/10,h:1/10}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
    this.addChild(new DirectionalMove(this, {x:-1,y:-1}, 1));
  }
  onCollide(player) {
    if (!player.snaredBy) {
      player.dead = true;
    }
  }
}

class StringyDoomRight extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.absolutePosition = true;
    this.withPosition({x:-1,y:2}).withSize({w:2,h:2}).withSprite('stringyDoomR').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new TiledSprite(this, {w:1/10,h:1/10}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['enemy']}));
    this.addChild(new DirectionalMove(this, {x:1,y:-1}, 1));
  }
  onCollide(player) {
    if (!player.snaredBy) {
      player.dead = true;
    }
  }
}

export default class Ligature extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 1;
    this.withPosition({x:0,y:-0.5}).withSize({w:0.33,h:0.2}).withCameraTransform(parent.cameraTransform);
    this.addChild(new AnimatedSprite(this, 'ligatureFace', 6));
    this.phase = 'start'; // start, makeCages, fall, stun, rise, dead
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'move' : this.update_move(); break;
      case 'makeCages' : this.update_makeCages(); break;
      case 'stringyDoom' : this.update_stringyDoom(); break;
    }
    super.update();
  }

  update_start() {
    this.position.y += 0.05;
    if (this.position.y >= 0.9) {
      this.transitionToMakeCages();
    }
  }

  update_move() {
    this.oscillate();
  }

  update_makeCages() {
    this.oscillate();
    if (new Date().getTime() > this.phaeStart + 2000) {
      this.transitionToStringyDoom();
    }
  }

  update_stringyDoom() {
    this.oscillate();
  }

  transitionToMove() {
    this.phase = 'move';
    this.movingRight = true;
  }

  transitionToMakeCages() {
    this.phaeStart = new Date().getTime();
    let platforms = this.parent.children.filter(p => p instanceof NormalPlatform);
    let greenPlatformId = Math.floor(Math.random()*platforms.length);
    platforms.forEach((p,i) => {
      if (i==greenPlatformId) {
        p.addChild(new GreenCage(this));
      } else {
        p.addChild(new RedCage(this));
      }
    });
    this.phase = 'makeCages';
  }

  transitionToStringyDoom() {
    this.addChild(new StringyDoomLeft(this));
    this.addChild(new StringyDoomRight(this));
    this.phase = 'stringyDoom';
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