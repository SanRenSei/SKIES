import BaseComponent from "../../core/components/BaseComponent.js";
import BasePlatform from "./platforms/BasePlatform.js";
import Player from "./Player.js";

import levelData from "../../data/levelData.js";
import GoalPlatform from "./platforms/GoalPlatform.js";
import LosePopup from "./LosePopup.js";
import MathUtil from "../../util/mathUtil.js";
import DoorPlatform from "./platforms/DoorPlatform.js";
import ButtonItem from "./items/ButtonItem.js";
import PlatformTypes from "./platforms/PlatformTypes.js";
import Spikedome from "./enemies/Spikedome.js";
import Fireball from "./enemies/Fireball.js";
import Shortfuse from "./enemies/Shortfuse.js";
import Ligature from "./enemies/Ligature.js";
import Tortsnap from "./enemies/Tortsnap.js";
import Bunny from "./enemies/Bunny.js";
import drawManager from "../../core/DrawManager.js";
import WingedCageSpawner from "./enemies/WingedCageSpawner.js";
import FireAngel from "./enemies/FireAngel.js";
import IceAngel from "./enemies/IceAngel.js";

export default class GameplayScreen extends BaseComponent {

  constructor({levelNum}) {
    super();
    this.absolutePosition = true;
    this.cameraTop = 2.28;
    this.cameraTransform = (coords) => {
      return {x:coords.x*600+drawManager.width/2, y: (this.cameraTop-coords.y)*600, w: coords.w*600, h: coords.h*600, r: coords.r, s: coords.s};
    }
    this.addChild(BaseComponent.createSprite('backgroundGround', {x:0,y:0.72,w:1.33,h:2}).withCameraTransform(this.cameraTransform));
    this.backgroundLoops = [
      BaseComponent.createSprite('backgroundLoop', {x:0,y:2.72,w:1.33,h:2}).withCameraTransform(this.cameraTransform),
      BaseComponent.createSprite('backgroundLoop', {x:0,y:4.72,w:1.33,h:2}).withCameraTransform(this.cameraTransform),
      BaseComponent.createSprite('backgroundLoop', {x:0,y:6.72,w:1.33,h:2}).withCameraTransform(this.cameraTransform)
    ]
    this.addChildren(this.backgroundLoops);
    this.player = new Player(this);
    this.addChild(this.player);
    this.addChild(new BasePlatform().withCameraTransform(this.cameraTransform));
    let levelInfo = levelData[levelNum];
    this.generatePlatforms(levelInfo);
    this.generateEnemies(levelInfo);
    if (levelInfo.cameraLock) {
      this.cameraLock = true;
    }
    this.levelNum = levelNum;
    this.done = false;
  }

  update() {
    this.updateCamera();
    this.updateBackground();
    this.checkLoss();
    super.update();
  }

  updateCamera() {
    if (this.cameraLock) {
      return;
    }
    this.cameraTop = Math.max(this.cameraTop, 0.6 + this.player.position.y);
  }

  updateBackground() {
    this.backgroundLoops.forEach(bl => {
      if (bl.computeDrawInfo().y > 2*drawManager.height) {
        bl.position.y += 6;
      }
    })
  }

  checkLoss() {
    if (!this.done && this.player.computeDrawInfo().y > 1.1*drawManager.height) {
      this.player.stopMoving();
      this.addChild(new LosePopup());
      this.done = true;
    }
    if (!this.done && this.player.dead) {
      this.player.stopMoving();
      this.addChild(new LosePopup());
      this.done = true;
    }
  }

  generatePlatforms(levelInfo) {
    if (levelInfo.platformPreset) {
      this.generatePresetPlatforms(levelInfo);
      return;
    }
    let currentHeight = 0;
    while (currentHeight < levelInfo.height) {
      let oldCurrentHeight = currentHeight;
      currentHeight += levelInfo.minSpace + Math.random()*(levelInfo.maxSpace - levelInfo.minSpace);
      let platformType = MathUtil.weightedRandom(levelInfo.platformDistribution);
      if (platformType == PlatformTypes.TYPE_DOOR) {
        let prevPlatform = this.children[this.children.length-1];
        if (prevPlatform instanceof BasePlatform || prevPlatform.fake) {
          platformType = PlatformTypes.TYPE_GHOST;
        }
      }
      let platform = PlatformTypes.platformFromType(platformType).withPosition({x:1.33*Math.random()-0.66, y: currentHeight}).withCameraTransform(this.cameraTransform);
      if (platform instanceof DoorPlatform) {
        platform.position.x = 0;
        let prevPlatform = this.children[this.children.length-1];
        prevPlatform.addChild(new ButtonItem().withDoor(platform).withCameraTransform(this.cameraTransform));
      }
      if (platform.fake) {
        currentHeight = oldCurrentHeight;
      }
      this.addChild(platform);
    }
    currentHeight += levelInfo.minSpace + Math.random()*(levelInfo.maxSpace - levelInfo.minSpace);
    this.addChild(new GoalPlatform().withPosition({x:0, y: currentHeight}).withCameraTransform(this.cameraTransform));
  }

  generatePresetPlatforms(levelInfo) {
    levelInfo.platformPreset.forEach(p => {
      let child = this.addChild(PlatformTypes.platformFromType(p.type).withPosition({x:p.x,y:p.y}).withCameraTransform(this.cameraTransform));
      if (p.w) {
        child.withSize({w:p.w});
      }
    })
  }

  generateEnemies(levelInfo) {
    levelInfo.enemyPreset?.forEach(e => {
      switch (e.type) {
        case 'bunny' : this.addChild(new Bunny(this)); break;
        case 'cageSpawner' : this.addChild(new WingedCageSpawner(this)); break;
        case 'fireAngel' : this.addChild(new FireAngel(this)); break;
        case 'fireball' : this.addChild(new Fireball(this).withPosition({x:e.x,y:e.y})); break;
        case 'iceAngel' : this.addChild(new IceAngel(this)); break;
        case 'ligature' : this.addChild(new Ligature(this)); break;
        case 'shortfuse' : this.addChild(new Shortfuse(this)); break;
        case 'spikedome' : this.addChild(new Spikedome(this)); break;
        case 'tortsnap' : this.addChild(new Tortsnap(this)); break;
      }
    })
  }

}