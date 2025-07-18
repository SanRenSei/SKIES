
import audioManager from './AudioManager.js';
import spriteManager from './SpriteManager.js';

class PreloadManager {

  constructor() {}

  preload() {
    let audios = [];
    let sprites = [];
    audios.forEach(audio => {
      audioManager.load(audio);
    })
    sprites.forEach(sprite => {
      spriteManager.load(sprite);
    });
  }

}

let instance = new PreloadManager();
export default instance;

