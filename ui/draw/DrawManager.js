import collider from '../event/Collider.js';
import RootComponent from './root/index.js';

class DrawManager {

  constructor() {
    this.root = null;
    this.drawingQueue = [];
  }

  draw(ctx) {
    ctx.clearRect(0,0,this.width,this.height);
    if (!this.root) {
      return;
    }
    this.root.takeTransformSnapshot();
    this.root.draw(ctx);
    this.drawQueue(ctx);
    this.root.update();
    collider.checkCollisions();
  }

  addToDrawQueue(component) {
    this.drawingQueue.push(component);
  }

  drawQueue(ctx) {
    this.drawingQueue.sort((a, b) => {
      const aPriority = Array.isArray(a.drawPriority) ? a.drawPriority : [a.drawPriority];
      const bPriority = Array.isArray(b.drawPriority) ? b.drawPriority : [b.drawPriority];
    
      const len = Math.min(aPriority.length, bPriority.length);
      for (let i = 0; i < len; i++) {
        if (aPriority[i] !== bPriority[i]) {
          return aPriority[i] - bPriority[i];
        }
      }
      return aPriority.length - bPriority.length;
    });

    for (let toDraw of this.drawingQueue) {
      toDraw.draw(ctx, true);
    }

    this.drawingQueue = [];
  }

}

let drawManager = new DrawManager();
export default drawManager;