
import eventDispatcher from "../../event/Dispatcher.js";
import mouseInstance from "../../event/Mouse.js";
import CoordUtil from "../../util/coordUtil.js";
import BaseComponent from "./BaseComponent.js";

export default class Rect extends BaseComponent {

  constructor(params) {
    super();
    this.fillColor = null;
    if (params.fillColor) {
      this.fillColor = params.fillColor;
    }
  }

  draw(ctx) {
    let {x,y,w,h} = this.transformSnapshot;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - w/2, y - h/2, w, h);
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(x - w/2, y - h/2, w, h);
    }
    super.draw(ctx);
  }

  onClick(evtHandler) {
    this.subscribeTo('pointerdown', e => {
      if (CoordUtil.pointInRect({x:e.translatedX,y:e.translatedY}, {...this.transformSnapshot})) {
        evtHandler();
      } 
    });
    return this;
  }

}