import CoordUtil from "../../../util/coordUtil.js";
import MathUtil from "../../../util/mathUtil.js";
import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";
import DirectionalMove from "../../../core/components/DirectionalMove.js";
import FadeOut from "../../../core/components/FadeOut.js";
import PositionTween from "../../../core/components/PositionTween.js";
import DoorPlatform from "../platforms/DoorPlatform.js";
import GoalPlatform from "../platforms/GoalPlatform.js";

class ExtendoHorn extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.baseCoords = {x:0.43,y:0.39};
    this.targetCoords = {x:0,y:0.5};
    this.length = 0.1;
    this.extending = true;
    this.withSprite('extendoHorn').withCameraTransform(parent.cameraTransform);
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['enemy']}));
  }

  update() {
    super.update();
    this.withPosition(CoordUtil.applyMovementNoStop(this.baseCoords, this.targetCoords, this.length/2));
    this.withRotation(-Math.atan2(this.baseCoords.y - this.targetCoords.y, this.baseCoords.x - this.targetCoords.x));
    this.withSize({w:this.length,h:0.02});
    if (this.length<1.5 && this.extending) {
      this.length += 0.01;
    }
    if (this.length>0.1 && !this.extending) {
      this.length -= 0.01;
    }
  }

  retract() {
    this.extending = false;
  }

  onCollide(player) {
    if (player.dy > 0) {
      player.dy = 0;
    }
  }
}

class Scale extends BaseComponent {
  constructor(parent) {
    super();
    this.absolutePosition = true;
    this.parent = parent;
    this.withSprite('tortsnapScale').withPosition(parent.transformSnapshot).withSize({w:2/64,h:2/64}).withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new CollisionShape(this, 'oval', 'collidee', {tags: ['enemy']}));
  }

  update() {
    super.update();
    if (this.transformSnapshot.x < -1 || this.transformSnapshot.x > 1) {
      this.purge();
    }
  }

  target(player) {
    let targetCoords = {...player.computeRelativePosition()};
    targetCoords.x += 1/16*(Math.random()-0/5);
    this.addChild(new DirectionalMove(this, MathUtil.diff2v(targetCoords, this.parent.computeRelativePosition()), 1));
    return this;
  }

  onCollide(player) {
    player.dead = true;
  }
}

class SpikyChestnut extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.active = true;
    this.extendoHorn = null;
    this.withSprite('spikyChestnut').withPosition({x:-1,y:-1}).withSize({w:1/8,h:1/8}).withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new CollisionShape(this, 'oval', 'collidee', {tags: ['enemy']}));
  }

  stickToHorn(extendoHorn) {
    this.extendoHorn = extendoHorn;
  }

  update() {
    super.update();
    if (this.extendoHorn) {
      this.withPosition(CoordUtil.applyMovementNoStop(this.extendoHorn.baseCoords, this.extendoHorn.targetCoords, this.extendoHorn.length));
    }
    if (this.position.x > 0) {
      this.position.x = 0;
      this.extendoHorn = null;
    }
  }

  destroy() {
    this.active = false;
    this.addChild(new FadeOut(this, 1000, () => {this.purge()}));
  }

  onCollide(player) {
    if (this.active) {
      player.dead = true;
    }
  }
}

class ExtendoNeck extends BaseComponent {
  constructor(parent) {
    super(parent);
    this.baseCoords = {x:0,y:-0.1};
    this.withAbsolutePosition().withSprite('tortsnapHeadNeck').withCameraTransform(parent.cameraTransform);
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['enemy']}));
  }

  update() {
    super.update();
    let targetCoords = this.parent.transformSnapshot;
    let length = MathUtil.get2vMag(MathUtil.diff2v(this.baseCoords, targetCoords));
    this.withPosition(MathUtil.mult2v(MathUtil.add2v(this.baseCoords, targetCoords), 0.5)).withSize({w:length,h:1/12})
      .withRotation(-Math.atan2(this.baseCoords.y - targetCoords.y, this.baseCoords.x - targetCoords.x));
  }

  onCollide(player) {
  }
}

export default class Tortsnap extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 1;
    this.withPosition({x:0.9,y:1/4}).withSize({w:1/2,h:1/2}).withSprite('tortsnap').withCameraTransform(parent.cameraTransform);
    this.phase = 'start'; // start, move, fall, stun, rise, dead
    this.head = null;
    this.subscribeTo('collision', evt => {
      if ( this.phase=='snap' && evt.collider.parent==this.head &&evt.collidee.parent instanceof SpikyChestnut) {
        evt.collidee.parent.destroy();
        this.transitionToDamaged();
      }
    });
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'extendohorn' : this.update_extendohorn(); break;
      case 'throwScales' : this.update_throwScales(); break;
      case 'retractHorn' : this.update_retractHorn(); break;
      case 'dig' : this.update_dig(); break;
      case 'rise' : this.update_rise(); break;
      case 'presnap' : this.update_presnap(); break;
      case 'snap' : this.update_snap(); break;
      case 'damaged' : this.update_damaged(); break;
    }
    super.update();
  }

  update_start() {
    this.position.x -= 0.005;
    if (this.position.x <= 0.5) {
      this.transitionToExtendohorn();
    }
  }

  update_extendohorn() {
    if (this.extendoHorn.length>=1.5) {
      this.transitionToThrowScales();
    }
  }

  update_throwScales() {
    this.nextScale--;
    if (this.nextScale<=0) {
      this.nextScale = 20 + this.hp*10;
      this.addChild(new Scale(this).target(this.parent.player));
    }
    if (new Date().getTime() > this.phaseStart + 5000) {
      this.transitionToRetractHorn();
    }
  }

  update_retractHorn() {
    if (this.extendoHorn.length<=0.1) {
      this.transitionToDig();
    }
  }

  update_dig() {
    this.position.x += 0.01*this.dx;
    this.position.y += 0.01*this.dy;
    this.dy -= 0.01;
    if (this.position.y < -0.5) {
      this.transitionToRise();
    }
  }

  update_rise() {
    this.position.y += 0.001;
    if (this.position.y >= 1/16) {
      this.transitionToPresnap();
    }
  }

  update_presnap() {
    if (new Date().getTime() - this.phaseStart > 2000) {
      this.transitionToSnap();
    }
  }

  update_snap() {
    let time = new Date().getTime() - this.phaseStart;
    if (time%1000 > 500) {
      this.head.withSprite('tortsnapHeadClosed');
    } else {
      this.head.withSprite('tortsnapHeadOpen');
    }
    if (this.position.y > 1.2 || this.position.x <= -1 || this.position.x >= 1) {
      this.transitionToSnapRecede();
    }
  }

  update_damaged() {
    this.withPosition({x:this.position.x, y:this.position.y - 0.005});
    if (this.head.transformSnapshot.y < -0.5) {
      if (this.hp>0) {
        this.transitionToStart();
      } else {
        this.transitionToDead();
      }
    }
  }

  transitionToStart() {
    this.head.purge();
    this.neck.purge();
    this.withSprite('tortsnap').withPosition({x:0.9,y:1/4}).withSize({w:1/2,h:1/2});
    this.phase = 'start';
  }

  transitionToExtendohorn() {
    this.extendoHorn = this.parent.addChild(new ExtendoHorn(this));
    this.withSprite('tortsnapNoHorn')
    this.phase = 'extendohorn';
  }

  transitionToThrowScales() {
    this.phase = 'throwScales';
    this.nextScale = 50;
    this.phaseStart = new Date().getTime();
  }

  transitionToRetractHorn() {
    this.extendoHorn.retract();
    let spikyChestnut = this.parent.addChild(new SpikyChestnut(this.parent));
    spikyChestnut.stickToHorn(this.extendoHorn);
    this.phase = 'retractHorn';
  }

  transitionToDig() {
    this.dx = -0.25;
    this.dy = 0.25;
    this.extendoHorn.purge();
    this.withSprite('tortsnap');
    this.phase = 'dig';
  }

  transitionToRise() {
    this.withSprite(null);
    this.position.x = 0;
    this.position.y = -0.25;
    this.neck = this.addChild(new ExtendoNeck(this));
    this.head = this.addChild(BaseComponent.createSprite('tortsnapHeadClosed', {x:0,y:0,w:1/8,h:1/8}).withCameraTransform(this.cameraTransform));
    this.head.takeTransformSnapshot();
    this.head.addChild(new CollisionShape(this.head, 'oval', 'both', {tags: 'enemy', collidesWith: 'enemy'}));
    this.head.onCollide = (player) => player.dead = true;
    this.phase = 'rise';
  }

  transitionToPresnap() {
    this.phase = 'presnap';
  }

  transitionToSnap() {
    this.snapMove = this.addChild(new DirectionalMove(this, MathUtil.diff2v(this.parent.player.transformSnapshot, this.transformSnapshot), 2));
    this.phase = 'snap';
  }

  transitionToSnapRecede() {
    this.snapMove.purge();
    this.snapMove = this.addChild(new PositionTween(this, {x:0, y:1/16}, 1000, () => {
      this.snapMove.purge();
      this.transitionToSnap();
    }))
    this.phase = 'snapRecede';
  }

  transitionToDamaged() {
    this.hp--;
    this.snapMove.purge();
    this.phase = 'damaged';
  }

  transitionToDead() {
    this.parent.addChild(new GoalPlatform().withPosition({x:0,y:0.5}).withCameraTransform(this.parent.cameraTransform));
    this.phase = 'dead';
  }

  onCollide(player, collisionSpot) {
    return;
  }

}