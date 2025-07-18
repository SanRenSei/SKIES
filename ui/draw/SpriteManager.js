import { spritePaths, miniSprites, processedSprites } from "../data/assetPaths.js";

class SpriteManager {

  constructor() {
    this.timeOffset = new Date().getTime();
    this.sprites = {};
    this.drawingQueue = [];
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

  drawSprite(ctx, spriteName, left, top, width, height, alpha=1) {
    if (spritePaths[spriteName] || processedSprites[spriteName]) {
      ctx.drawImage(this.getImage(spriteName), left, top, width, height);
      return;
    }
    if (miniSprites[spriteName]?.sheetName) {
      console.log('DRAW MINISPRITE')
      console.log(spriteName)
      let imgLocation = miniSprites[spriteName].sheetName;
      ctx.globalAlpha = alpha;
      ctx.drawImage(this.getImage(imgLocation), miniSprites[spriteName].left, miniSprites[spriteName].top, miniSprites[spriteName].width, miniSprites[spriteName].height, 
        left, top, width, height);
      ctx.globalAlpha = 1;
    }
  }

  queueSprite(spriteName, priority, left, top, width, height, alpha=1) {
    this.drawingQueue.push({ spriteName, priority, left, top, width, height, alpha });
  }

  queueText(text, priority, x, y) {
    this.drawingQueue.push({text, priority, x, y});
  }

  drawQueue(ctx) {
    this.drawingQueue.sort((a, b) => {
      const aPriority = Array.isArray(a.priority) ? a.priority : [a.priority];
      const bPriority = Array.isArray(b.priority) ? b.priority : [b.priority];
    
      const len = Math.min(aPriority.length, bPriority.length);
      for (let i = 0; i < len; i++) {
        if (aPriority[i] !== bPriority[i]) {
          return aPriority[i] - bPriority[i];
        }
      }
      return aPriority.length - bPriority.length;
    });

    window.drawingQueue = (this.drawingQueue);

    for (let toDraw of this.drawingQueue) {
      if (toDraw.spriteName) {
        this.drawSprite(ctx, toDraw.spriteName, toDraw.left, toDraw.top, toDraw.width, toDraw.height, toDraw.alpha);
      }
      if (toDraw.text) {
        let textWidth = ctx.measureText(toDraw.text);
        ctx.fillText(toDraw.text, toDraw.x - textWidth.width/2, toDraw.y);
      }
    }

    this.drawingQueue = [];
  }

}

let instance = new SpriteManager();
export default instance;