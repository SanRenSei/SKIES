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
    if (featureFlags.flags.debug) {
      console.log('DEBUG')
      this.textUpdateTime = new Date().getTime();
      this.debug = this.addChild(new Text('???', {weight: 700}).withSize({w:1/2,h:1/2}).withCameraTransform(parent.cameraTransform));
      this.subscribeTo('tilt', evt => {
        if (new Date().getTime() > this.textUpdateTime + 2000) {
          this.debug.text = `${evt.alpha} ${evt.beta} ${evt.gamma}`;
          this.textUpdateTime = new Date().getTime();
        }
      })
    }
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
    let dx = (this.targetX - this.parent.position.x);
    let timestep = 0.05;
    this.parent.position.x += dx*timestep;
  }
}

export default class Player extends BaseComponent {

  constructor(parent) {
    super();
    this.withPosition({x:0,y:0.05}).withSize({w:50/800,h:50/800}).withCameraTransform(parent.cameraTransform);
    this.snaredBy = null;
    this.canJump = false;
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
    this.addChild(new CollisionShape(this, 'rect', 'collider', {collidesWith: ['platform', 'item', 'enemy']}));
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