import ImageUtil from "../util/imageUtil.js";

let spritePaths = {
  test: 'img/test.png',
  beach: 'img/beachHex.png',
  grass: 'img/grassHex.png'
};

['backgroundGround', 'backgroundLoop', 'sleepingCat'].forEach(s => spritePaths[s] = `img/${s}.png`);
['ghostIconLeft1', 'ghostIconLeft2', 'ghostIconRight1', 'ghostIconRight2', 'happyGhost', 'sadGhost'].forEach(s => spritePaths[s] = `img/${s}.png`);
['beachballIconLeft1', 'beachballIconLeft2', 'beachballIconLeft3', 'beachballIconLeft4', 
  'beachballIconRight1', 'beachballIconRight2',  'beachballIconRight3', 'beachballIconRight4',
  'eightballIconLeft', 'eightballIconRight', 'bunnyIconLeft', 'bunnyIconRight', 'pumpkinIconLeft', 'pumpkinIconRight'
].forEach(s => spritePaths[s] = `img/${s}.png`);
['platform', 'goalPlatform', 'ghostPlatform', 'movingPlatform', 'teleportingPlatform', 'doorPlatform', 'doorPlatformTransparent', 'firePlatform'].forEach(s => spritePaths[s] = `img/${s}.png`);
['redButton', 'inventoryIcon'].forEach(s => spritePaths[s] = `img/${s}.png`);
['spikedome', 'spikedomeHurt', 'gear'].forEach(s => spritePaths[s] = `img/${s}.png`);
['fireball', 'shortfuse', 'horizontalWall', 'verticalWall', 'electricSquare', 'crosshairs'].forEach(s => spritePaths[s] = `img/${s}.png`);
['ligatureFace', 'greenCage', 'redCage', 'stringyDoomL', 'stringyDoomR'].forEach(s => spritePaths[s] = `img/${s}.png`);
['spikesnap'].forEach(s => spritePaths[s] = `img/${s}.png`);

let miniSprites = {
  whiteKing: { sheetName: 'chessPieceSheet', top: 10, height: 150, left: 0, width: 140 },
}

let animatedSprites = {
  ligatureFace: { sheetName: 'ligatureFace', height: 64, width: 64, frames: 6 },
  birdIdle: { sheetName: 'birdSheet', top: 0, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
  birdMove: { sheetName: 'birdSheet', top: 32, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
  birdFly: { sheetName: 'birdSheet', top: 96, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
  birdIdle_damaged: { sheetName: 'birdSheet_damaged', top: 0, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
  birdMove_damaged: { sheetName: 'birdSheet_damaged', top: 32, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
  birdFly_damaged: { sheetName: 'birdSheet_damaged', top: 96, left: 0, height: 32, width: 32, frames: 4, cols: 4, duration: 1000 },
}

Object.keys(animatedSprites).forEach(s => {
  let {sheetName, top, left, height, width, frames, cols} = animatedSprites[s];
  if (!cols) {
    cols = frames;
  }
  if (!left) {
    left = 0;
  }
  if (!top) {
    top = 0;
  }
  for (let i=0;i<frames;i++) {
    let frameLeft = left + width*(i%cols);
    let frameTop = top + height*Math.floor(i/cols);
    miniSprites[s+(i+1)] = {sheetName, top: frameTop, left: frameLeft, height, width};
  }
})

let processedSprites = {
  shortfuse_damaged: (spriteManager) => {
    let initialShortFuse = spriteManager.getImage('shortfuse');
    return ImageUtil.applyMask(initialShortFuse, 255, 0, 0);
  }
}

let audioPaths = {
  track1: 'mp3/track1.mp3',
};

export { spritePaths, miniSprites, processedSprites, audioPaths };