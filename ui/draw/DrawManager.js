import collider from '../event/Collider.js';
import RootComponent from './root/index.js';

import SpriteManager from './SpriteManager.js';

class DrawManager {

  constructor() {
    this.root = new RootComponent();
  }

  draw(ctx) {
    ctx.clearRect(0,0,this.width,this.height);
    this.root.takeTransformSnapshot();
    this.root.draw(ctx);
    //SpriteManager.drawQueue(ctx);
    this.root.update();
    collider.checkCollisions();
  }

}

let instance = new DrawManager();
export default instance;