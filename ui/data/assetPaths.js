import ImageUtil from "../util/imageUtil.js";

let spritePaths = {
  test: 'img/test.png',
  beach: 'img/beachHex.png',
  grass: 'img/grassHex.png'
};

['backgroundGround', 'backgroundLoop', 'happyGhost', 'sadGhost'].forEach(s => spritePaths[s] = `img/${s}.png`);
['ghostIconLeft1', 'ghostIconLeft2', 'ghostIconRight1', 'ghostIconRight2'].forEach(s => spritePaths[s] = `img/avatars/${s}.png`);
['beachballIconLeft1', 'beachballIconLeft2', 'beachballIconLeft3', 'beachballIconLeft4', 
  'beachballIconRight1', 'beachballIconRight2',  'beachballIconRight3', 'beachballIconRight4',
  'eightballIconLeft', 'eightballIconRight', 'bunnyIconLeft', 'bunnyIconRight', 'pumpkinIconLeft', 'pumpkinIconRight'
].forEach(s => spritePaths[s] = `img/avatars/${s}.png`);
['platform', 'goalPlatform', 'ghostPlatform', 'movingPlatform', 'muddyPlatform', 'teleportingPlatform', 'doorPlatform', 'doorPlatformTransparent', 'firePlatform'].forEach(s => spritePaths[s] = `img/platforms/${s}.png`);
['redButton', 'inventoryIcon'].forEach(s => spritePaths[s] = `img/${s}.png`);
['spikedome', 'spikedomeHurt', 'gear'].forEach(s => spritePaths[s] = `img/enemies/${s}.png`);
['fireball', 'shortfuse', 'horizontalWall', 'verticalWall', 'electricSquare', 'crosshairs'].forEach(s => spritePaths[s] = `img/enemies/${s}.png`);
['ligatureFace', 'ligatureFaceVulnerable', 'ligatureNoodles', 'greenCage', 'redCage', 'stringyDoomL', 'stringyDoomR'].forEach(s => spritePaths[s] = `img/enemies/${s}.png`);
['tortsnap', 'tortsnapNoHorn', 'extendoHorn', 'tortsnapScale', 'tortsnapHead', 'spikyChestnut'].forEach(s => spritePaths[s] = `img/enemies/${s}.png`);
['bunny'].forEach(s => spritePaths[s] = `img/enemies/${s}.png`);

let miniSprites = {
  whiteKing: { sheetName: 'chessPieceSheet', top: 10, height: 150, left: 0, width: 140 },
  tortsnapHeadClosed: { sheetName: 'tortsnapHead', top: 6, height: 43, left: 5, width: 41},
  tortsnapHeadOpen: { sheetName: 'tortsnapHead', top: 6, height: 43, left: 62, width: 41},
  tortsnapHeadNeck: { sheetName: 'tortsnapHead', top: 3, height: 64, left: 113, width: 182},
}

let animatedSprites = {
  ligatureFace: { sheetName: 'ligatureFace', height: 64, width: 64, frames: 6 },
  ligatureNoodles: { sheetName: 'ligatureNoodles', height: 64, width: 64, frames: 6 },
  ligatureNoodles_glowing: { sheetName: 'ligatureNoodles_glowing', height: 64, width: 64, frames: 6 },
  ligatureFaceVulnerable: { sheetName: 'ligatureFaceVulnerable', height: 64, width: 64, frames: 6 },
  bunnyRun: { sheetName: 'bunny', top: 192, height: 60, width: 60, frames: 6, cols: 4, vPad: 30},
}

Object.keys(animatedSprites).forEach(s => {
  let {sheetName, top, left, height, width, frames, cols, hPad, vPad} = animatedSprites[s];
  if (!cols) {
    cols = frames;
  }
  if (!left) {
    left = 0;
  }
  if (!top) {
    top = 0;
  }
  if (!hPad) {
    hPad = 0;
  }
  if (!vPad) {
    vPad = 0;
  }
  for (let i=0;i<frames;i++) {
    let frameLeft = left + (width+hPad)*(i%cols);
    let frameTop = top + (height+vPad)*Math.floor(i/cols);
    miniSprites[s+(i+1)] = {sheetName, top: frameTop, left: frameLeft, height, width};
  }
})

let processedSprites = {
  shortfuse_damaged: (spriteManager) => {
    let initialShortFuse = spriteManager.getImage('shortfuse');
    return ImageUtil.applyMask(initialShortFuse, 255, 0, 0);
  },
  ligatureNoodles_glowing: (spriteManager) => {
    let initialNoodles = spriteManager.getImage('ligatureNoodles');
    return ImageUtil.applyMask(initialNoodles, 255, 0, 0);
  }
}

let audioPaths = {
  track1: 'mp3/track1.mp3',
};

export { spritePaths, miniSprites, processedSprites, audioPaths };