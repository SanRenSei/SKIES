
import polyfill from './util/arrayUtil.js';
polyfill();

import drawManager from './draw/DrawManager.js';
import preloadManager from './draw/PreloadManager.js';
import mouse from './event/Mouse.js';
import featureFlags from './state/FeatureFlags.js';

let mainCanvas = document.getElementById('mainCanvas');
let ctx = mainCanvas.getContext('2d');

featureFlags.loadFlags(parseInt(new URL(document.location.toString()).searchParams.get('featureFlags')));

let draw = () => {
  drawManager.draw(ctx);
  setTimeout(update, 10);
}

let update = () => {
  setTimeout(draw, 10);
}

preloadManager.preload();
draw();