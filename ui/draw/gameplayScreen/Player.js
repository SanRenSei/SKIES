import playerChars from "../../data/playerChars.js";
import gameState from "../../state/GameState.js";
import AnimatedSprite from "../components/AnimatedSprite.js";
import BaseComponent from "../components/BaseComponent.js";
import CollisionShape from "../components/CollisionShape.js";
import Gravity from "../components/Gravity.js";

export default class Player extends BaseComponent {

  constructor() {
    super();
    this.withPosition({x:0,y:0.05}).withSize({w:50/800,h:50/800});
    this.canJump = false;
    this.dead = false;
    setTimeout(() => {this.canJump = true}, 1000);
    this.subscribeTo('pointermove', evt => {
      if (this.dead) {
        return;
      }
      let newX = (evt.translatedX-400)/600;
      if (newX > this.position.x) {
        this.faceRight();
      }
      if (newX < this.position.x) {
        this.faceLeft();
      }
      this.position.x = newX;
    })
    this.subscribeTo('pointerdown', evt => {
      if (this.canJump && !this.dead) {
        this.canJump = false;
        this.dy = 0.5;
      }
    })
    this.setAvatar();
    this.gravity = new Gravity(this, {strength:0.3});
    this.addChild(this.gravity);
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

}