import { spritePaths, miniSprites, processedSprites } from "../data/assetPaths.js";

class SpriteManager {

  constructor() {
    this.timeOffset = new Date().getTime();
    this.sprites = {};
  }

  load(spriteName) {
    if (!this.sprites[spriteName] && spritePaths[spriteName]) {
      let newImage = new Image();
      this.sprites[spriteName] = newImage;
      newImage.src = spritePaths[spriteName];
      return;
    }
    if (!this.sprites[spriteName] && processedSprites[spriteName]) {
      let newImage = processedSprites[spriteName](this);
      this.sprites[spriteName] = newImage;
      return;
    }
  }

  storeSVG(spriteName, svgStr) {
    let newImage = new Image();
    newImage.src = 'data:image/svg+xml;charset=utf-8,' + svgStr;
    this.sprites[spriteName] = newImage;
  }

  clearSVG(spriteName) {
    this.sprites[spriteName] = null;
  }

  isLoaded(spriteName) {
    if (!this.sprites[spriteName]) {
      this.load(spriteName);
      return false;
    }
    return this.sprites[spriteName].complete;
  }

  getImage(spriteName) {
    if (!this.sprites[spriteName]) {
      this.load(spriteName);
    }
    return this.sprites[spriteName];
  }

  drawImage(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh, r=0, a=1) {
    if (r == 0 && dw > 0 && dh > 0) {
      ctx.globalAlpha = a;
      ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
      return;
    }
    if (dw < 0) {
      console.log('REVERSE')
    }

    let centerX = dx + dw / 2;
    let centerY = dy + dh / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(r);
    if (dw < 0 || dh < 0) {
      ctx.scale(Math.sign(dw), Math.sign(dh));
      dw = Math.abs(dw);
      dh = Math.abs(dh);
    }
    ctx.globalAlpha = a;
    ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  drawSprite(ctx, spriteName, left, top, width, height, rotation, alpha=1) {
    if (spritePaths[spriteName] || processedSprites[spriteName]) {
      let s = this.getImage(spriteName);
      this.drawImage(ctx, s, 0, 0, s.width, s.height, left, top, width, height, rotation, alpha);
      return;
    }
    if (miniSprites[spriteName]?.sheetName) {
      let s = miniSprites[spriteName];
      this.drawImage(ctx, this.getImage(miniSprites[spriteName].sheetName), s.left, s.top, s.width, s.height, left, top, width, height, rotation, alpha);
    }
  }

}

let instance = new SpriteManager();
export default instance;