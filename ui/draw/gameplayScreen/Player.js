import playerChars from "../../data/playerChars.js";
import featureFlags from "../../state/FeatureFlags.js";
import gameState from "../../state/GameState.js";
import AnimatedSprite from "../components/AnimatedSprite.js";
import BaseComponent from "../components/BaseComponent.js";
import CollisionShape from "../components/CollisionShape.js";
import Gravity from "../components/Gravity.js";
import Text from "../components/Text.js";

class PlayerMovement extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.targetX = this.parent.position.x;
    this.subscribeTo('tilt', evt => {
      this.dx = evt.gamma/50;
      if (this.dx>0) {
        this.parent.faceRight();
      }
      if (this.dx<0) {
        this.parent.faceLeft();
      }
      if (new Date().getTime() > this.textUpdateTime + 2000) {
        this.textUpdateTime = new Date().getTime();
      }
    })
    this.subscribeTo('pointermove', evt => {
      if (this.parent.dead || this.parent.snaredBy) {
        return;
      }
      this.targetX = (evt.translatedX-400)/600;
      if (this.targetX > this.parent.position.x) {
        this.parent.faceRight();
      }
      if (this.targetX < this.parent.position.x) {
        this.parent.faceLeft();
      }
    })
  }
  update() {
    super.update();
    let timestep = this.parent.slowed ? 0.025 : 0.05;
    if (this.dx) {
      this.parent.position.x += this.dx*timestep;
      this.checkBounds();
      return;
    }
    let dx = (this.targetX - this.parent.position.x);
    this.parent.position.x += dx*timestep;
    this.checkBounds();
  }

  checkBounds() {
    if (this.parent.position.x < -0.66) {
      this.parent.position.x = -0.66;
    }
    if (this.parent.position.x > 0.66) {
      this.parent.position.x = 0.66;
    }
  }
}

export default class Player extends BaseComponent {

  constructor(parent) {
    super();
    this.withPosition({x:0,y:0.05}).withSize({w:50/800,h:50/800}).withCameraTransform(parent.cameraTransform);
    this.snaredBy = null;
    this.canJump = false;
    this.slowed = false;
    this.dead = false;
    this.dy = 0;
    setTimeout(() => {this.canJump = true}, 100);
    this.subscribeTo('pointerdown', evt => {
      if (this.snaredBy) {
        this.snaredBy.hp--;
        if (this.snaredBy.hp<=0) {
          this.snaredBy.purge();
          this.snaredBy = null;
          this.dy = 0.5;
          this.gravity = this.addChild(new Gravity(this, {strength:0.3}));
        }
        return;
      }
      if (this.canJump && !this.dead) {
        this.canJump = false;
        this.dy = 0.5;
      }
    })
    this.setAvatar();
    this.gravity = this.addChild(new Gravity(this, {strength:0.3}));
    this.movement = this.addChild(new PlayerMovement(this));
    this.addChild(new CollisionShape(this, 'oval', 'collider', {collidesWith: ['platform', 'item', 'enemy']}));
    this.subscribeTo('collision', evt => {
      if (evt.collider.parent==this) {
        evt.collidee.parent.onCollide(this, evt.collidee);
      }
    })
  }

  setAvatar() {
    let avatarInfo = playerChars[gameState.playerAvatar];
    if (avatarInfo.animated) {
      this.animatedSprite = new AnimatedSprite(this, avatarInfo.right, avatarInfo.frames);
      this.addChild(this.animatedSprite);
    } else {
      this.withSprite(avatarInfo.right);
    }
  }

  faceLeft() {
    if (this.animatedSprite) {
      this.animatedSprite.baseSpriteName = playerChars[gameState.playerAvatar].left;
    } else {
      this.withSprite(playerChars[gameState.playerAvatar].left);
    }
  }

  faceRight() {
    if (this.animatedSprite) {
      this.animatedSprite.baseSpriteName = playerChars[gameState.playerAvatar].right;
    } else {
      this.withSprite(playerChars[gameState.playerAvatar].right);
    }
  }

  stopMoving() {
    this.gravity.purge();
  }

  getSnared(cage) {
    this.snaredBy = cage;
    this.withPosition({...cage.transformSnapshot});
    this.gravity.purge();
  }

}