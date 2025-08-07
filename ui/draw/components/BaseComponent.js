
import eventDispatcher from '../../event/Dispatcher.js';
import MathUtil from '../../util/mathUtil.js';
import spriteManager from '../SpriteManager.js';

export default class BaseComponent {

  constructor(parent=null) {
    this.parent = parent;
    this.cameraTransform = this.parent?.cameraTransform;
    this.children = [];
    this.display = true;
    this.drawPriority = 0;
    this.absolutePosition = null;
    this.position = {x:0,y:0};
    this.rotation = 0;
    this.scale = 1;
    this.size = {w:1,h:1};
    this.sprite = null;
    this.subscriptions = new Set();
    this.transformSnapshot = {x:0,y:0,s:1,w:1,h:1,r:0};
  }

  static createSprite(spriteName, transform) {
    return new BaseComponent().withSprite(spriteName).withTransform(transform);
  }

  withChild(child) {
    this.addChild(child);
    return this;
  }

  withDisplay(d) {
    this.display = d;
    return this;
  }

  withPriority(p) {
    this.drawPriority = p;
    return this;
  }

  withAbsolutePosition() {
    this.absolutePosition = true;
    return this;
  }

  withPosition(initialPosition) {
    this.position = {...this.position, ...initialPosition};
    this.takeTransformSnapshot();
    return this;
  }

  withCameraTransform(cameraTransform) {
    if (typeof cameraTransform == 'function') {
      this.cameraTransform = cameraTransform;
      return this;
    }
    this.cameraTransform = (coords) => {
      let {x,y,w,h,s,r} = coords;
      let drawWidth = 800, drawHeight = 600;
      return {
        x : drawWidth/2 + drawWidth*(x-cameraTransform.x)/cameraTransform.w,
        y : drawHeight/2 + drawHeight*(y-cameraTransform.y)/cameraTransform.h,
        w : w/cameraTransform.w*drawWidth,
        h : h/cameraTransform.h*drawHeight,
        s, r
      };
    }
    return this;
  }

  withRotation(initialRotation) {
    this.rotation = initialRotation;
    return this;
  }

  withTransform(transform) {
    this.withPosition(transform);
    this.withSize(transform);
    this.withRotation(transform.r || 0);
    return this;
  }

  withSize(initialSize) {
    if (typeof initialSize == 'number') {
      initialSize = {w:initialSize, h:initialSize};
    }
    this.size = {...this.size, ...initialSize};
    this.takeTransformSnapshot();
    return this;
  }

  withSprite(initialSprite) {
    this.sprite = initialSprite;
    return this;
  }

  computeRelativePosition() {
    return typeof this.position=='function'?this.position():this.position;
  }

  computeDrawInfo() {
    return this.applyCamera(this.transformSnapshot);
  }

  applyCamera(pos) {
    if (this.cameraTransform) {
      return this.cameraTransform(pos);
    }
    return pos;
  }

  computeWidth() {
    let width = this.size;
    if (typeof width=='function') {
      width = width();
    }
    if (typeof width=='object') {
      width = width.w;
    }
    return width;
  }

  computeHeight() {
    let height = this.size;
    if (typeof height=='function') {
      height = height();
    }
    if (typeof height=='object') {
      height = height.h;
    }
    return height;
  }

  computeSize() {
    return {w:this.computeWidth(), h:this.computeHeight()};
  }

  takeTransformSnapshot() {
    if (!this.parent || this.absolutePosition) {
      this.transformSnapshot = {...this.computeRelativePosition(), ...this.computeSize(), r: this.rotation, s: this.scale};
    } else {
      let parentTransform = this.parent.transformSnapshot;
      this.transformSnapshot = MathUtil.combineTransforms(parentTransform, {...this.computeRelativePosition(), ...this.computeSize(), r: this.rotation, s: this.scale});
    }
    this.children.forEach(c => c.takeTransformSnapshot());
    return this.transformSnapshot;
  }

  computeSprite() {
    if (typeof this.sprite=='function') {
      return this.sprite();
    }
    return this.sprite;
  }

  draw(ctx, queued = false) {
    if (this.drawPriority && !queued) {
      drawManager.addToDrawQueue(this);
      return;
    }
    if (this.display) {
      if (this.computeSprite()!=null) {
        let drawInfo = this.computeDrawInfo();
        spriteManager.drawSprite(ctx, this.computeSprite(), drawInfo.x - drawInfo.w/2, drawInfo.y - drawInfo.h/2, drawInfo.w, drawInfo.h, drawInfo.r, this.alpha);
      }
    }
    this.children.forEach(c => c.draw(ctx));
  }

  getRectShape() {
    return {...this.transformSnapshot,shape:'rect'};
  }

  update() {
    this.children.forEach(c => c.update());
  }

  subscribeTo(evtType, evtHandler) {
    eventDispatcher.subscribeTo(evtType, evtHandler);
    this.subscriptions.add({type:evtType, handler: evtHandler});
  }

  checkMouseIntersect(mouse) {
    let {x,y,w,h} = this.transformSnapshot;
    if (mouse.translatedX >= x-w/2 && mouse.translatedX <= x+w/2 && mouse.translatedY >= y-h/2 && mouse.translatedY <= y+h/2) {
      return true;
    }
    return false;
  }

  addChild(c) {
    this.children.push(c);
    c.parent = this;
    return c;
  }

  addChildren(children) {
    children.forEach(c => this.addChild(c));
  }

  removeChild(c) {
    this.children = this.children.filter(ch => ch!=c);
  }

  sterilize() {
    this.children.forEach(c => c.purge());
  }

  purge() {
    this.sterilize();
    this.subscriptions.forEach(s => {
      eventDispatcher.unsubscribeFrom(s.type, s.handler);
    })
    this.parent.removeChild(this);
  }

}