import AnimatedSprite from "../../../core/components/AnimatedSprite.js";
import BaseComponent from "../../../core/components/BaseComponent.js";
import CollisionShape from "../../../core/components/CollisionShape.js";
import DirectionalMove from "../../../core/components/DirectionalMove.js";
import FadeIn from "../../../core/components/FadeIn.js";
import MaterializeUp from "../../../core/components/MaterializeUp.js";
import TiledSprite from "../../../core/components/TiledSprite.js";
import GoalPlatform from "../platforms/GoalPlatform.js";
import NormalPlatform from "../platforms/NormalPlatform.js";

class RedCage extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.ready = false;
    this.hp = 10;
    this.exploded = false;
    this.withPosition({x:0,y:1/32}).withSize({w:1/16,h:1/16}).withSprite('redCage').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new MaterializeUp(this, 2000, () => {this.ready = true;}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['item']}));
  }
  explode() {
    this.fireball = this.addChild(BaseComponent.createSprite('fireball', {x:0,y:0,w:1/16,h:1/16}).withCameraTransform(this.cameraTransform));
    this.fireball.addChild(new FadeIn(this.fireball, 1000, () => {
      this.purge();
    }));
    setTimeout(() => this.exploded=true, 500);
  }
  onCollide(player) {
    if (!this.ready) {
      return;
    }
    player.getSnared(this);
    if (this.exploded) {
      player.dead = true;
    }
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
    this.withPosition({x:1,y:1.5}).withSize({w:3,h:1}).withSprite('stringyDoomL').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new TiledSprite(this, {w:1/10,h:1/10}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
    this.addChild(new DirectionalMove(this, {x:-1,y:-1}, 1));
  }
  update() {
    super.update();
    if (this.transformSnapshot.y<-1) {
      this.purge();
    }
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
    this.withPosition({x:-1,y:1.5}).withSize({w:3,h:1}).withSprite('stringyDoomR').withCameraTransform(parent.cameraTransform);
    this.takeTransformSnapshot();
    this.addChild(new TiledSprite(this, {w:1/10,h:1/10}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags:['enemy']}));
    this.addChild(new DirectionalMove(this, {x:1,y:-1}, 1));
  }
  update() {
    super.update();
    if (this.transformSnapshot.y<-1) {
      this.purge();
    }
  }
  onCollide(player) {
    if (!player.snaredBy) {
      player.dead = true;
    }
  }
}

class Noodles extends BaseComponent {
  constructor(parent) {
    super();
    this.parent = parent;
    this.withSize({w:0.2,h:0.1}).withCameraTransform(parent.cameraTransform);
    this.noodles = this.addChild(new AnimatedSprite(this, 'ligatureNoodles', 6));
    this.noodles.alpha = 0.5;
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
  }

  onCollide(player) {
    if (this.parent.phase!='start' && this.parent.phase!='fall') {
      player.dead = true;
    }
  }

  glow() {
    this.redAura = this.addChild(new AnimatedSprite(this, 'ligatureNoodles_glowing', 6));
    this.redAura.startTime = this.noodles.startTime;
    this.redAura.addChild(new FadeIn(this.redAura, 2000));
  }

  hide() {
    this.redAura.purge();
    this.noodles.alpha = 0;
  }

  show() {
    this.noodles.alpha = 0.5;
  }
}

export default class Ligature extends BaseComponent {

  constructor(parent) {
    super();
    this.hp = 1;
    this.withPosition({x:0,y:-0.5}).withSize({w:0.33,h:0.2}).withCameraTransform(parent.cameraTransform);
    this.face = this.addChild(new AnimatedSprite(this, 'ligatureFace', 6));
    this.leftNoodles = this.addChild(new Noodles(this).withPosition({x:-0.15,y:0}));
    this.rightNoodles = this.addChild(new Noodles(this).withPosition({x:0.15,y:0}));
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['enemy']}));
    this.phase = 'start';
  }

  update() {
    switch (this.phase) {
      case 'start': this.update_start(); break;
      case 'move' : this.update_move(); break;
      case 'makeCages' : this.update_makeCages(); break;
      case 'stringyDoom' : this.update_stringyDoom(); break;
      case 'explodeCages' : this.update_explodeCages(); break;
      case 'fall' : this.update_fall(); break;
    }
    super.update();
  }

  update_start() {
    this.position.y += 0.005;
    if (this.position.y >= 0.9) {
      this.transitionToMakeCages();
    }
  }

  update_move() {
    this.oscillate();
  }

  update_makeCages() {
    this.oscillate();
    if (new Date().getTime() > this.phaseStart + 2000) {
      this.transitionToStringyDoom();
    }
  }

  update_stringyDoom() {
    this.oscillate();
    if (this.children.filter(c => c instanceof StringyDoomLeft).length==0) {
      this.transitionToExplodeCages();
    }
  }

  update_explodeCages() {
    this.oscillate();
    if (new Date().getTime() > this.phaseStart + 2000) {
      this.transitionToFall();
    }
  }

  update_fall() {
    this.oscillate();
    this.dy += 0.01 * this.ddy;
    this.position.y += 0.01 * this.dy;
    if (this.position.y < 0.1 && this.dy < 0) {
      this.dy = -0.5*this.dy;
      this.bounces++;
    }
    if (this.bounces>=3) {
      this.dy = 0;
      this.transitionToStart();
    }
  }

  transitionToStart() {
    this.face.baseSpriteName = 'ligatureFace';
    this.leftNoodles.show();
    this.rightNoodles.show();
    this.phase = 'start';
  }

  transitionToMove() {
    this.leftNoodles.show();
    this.rightNoodles.show();
    this.phase = 'move';
    this.movingRight = true;
  }

  transitionToMakeCages() {
    this.phaseStart = new Date().getTime();
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

  transitionToExplodeCages() {
    this.phaseStart = new Date().getTime();
    let platforms = this.parent.children.filter(p => p instanceof NormalPlatform);
    platforms.forEach(p => {
      p.children.filter(i => i instanceof RedCage).forEach(rc => rc.explode());
    });
    this.leftNoodles.glow();
    this.rightNoodles.glow();
    this.phase = 'explodeCages';
  }

  transitionToFall() {
    this.ddy = -0.5;
    this.dy = 0;
    this.bounces = 0;
    this.face.baseSpriteName = 'ligatureFaceVulnerable';
    this.leftNoodles.hide();
    this.rightNoodles.hide();
    this.phase = 'fall';
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

  onCollide(player) {
    if (this.phase=='fall' && this.bounces>=1) {
      if (this.hp<=0) {
        this.phase = 'dead';
        this.parent.addChild(new GoalPlatform().withPosition({x:0,y:0.5}).withCameraTransform(this.parent.cameraTransform));
      } else {
        this.transitionToStart();
      }
      return;
    }
    if (this.phase!='start' && this.phase!='fall') {
      player.dead = true;
    }
  }

}