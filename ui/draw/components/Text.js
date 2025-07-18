
import BaseComponent from "./BaseComponent.js";

export default class Text extends BaseComponent {

  constructor(text, {color, weight} = {}) {
    super();
    this.color = color || '#000000';
    this.text = text;
    this.weight = weight || '400';
  }

  draw(ctx) {
    let {x,y,w,h} = this.transformSnapshot;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color || 'black';

    ctx.font = `${this.weight} 24px Arial`;
    let textWidth = ctx.measureText(this.text).width;
    let scaledFontSize = 24*w/textWidth;
    ctx.font = `${this.weight} ${Math.floor(scaledFontSize)}px Ariel`;

    ctx.fillText(this.text, x, y);
  }

}