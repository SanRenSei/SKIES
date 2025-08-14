
import polyfill from './util/arrayUtil.js';
polyfill();

import drawManager from './core/DrawManager.js';
import preloadManager from './core/PreloadManager.js';
import './event/DeviceTilt.js';
import './event/Mouse.js';
import featureFlags from './state/FeatureFlags.js';
import RootComponent from './draw/root/index.js';

let mainCanvas = document.getElementById('mainCanvas');
let ctx = mainCanvas.getContext('2d');

featureFlags.loadFlags(parseInt(new URL(document.location.toString()).searchParams.get('featureFlags')));

drawManager.height = parseInt(mainCanvas.height);
drawManager.width = parseInt(mainCanvas.width);
drawManager.root = new RootComponent();

let draw = () => {
  drawManager.draw(ctx);
  setTimeout(update, 10);
}

let update = () => {
  setTimeout(draw, 10);
}

preloadManager.preload();
draw();