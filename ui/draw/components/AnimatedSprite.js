
import BaseComponent from "./BaseComponent.js";

export default class AnimatedSprite extends BaseComponent {

  constructor(parent, baseSpriteName, numFrames, params) {
    super();
    this.parent = parent;
    this.baseSpriteName = baseSpriteName;
    this.numFrames = numFrames;
    this.loopTime = params?.loopTime || 1000;
    this.startTime = new Date().getTime();
    this.withSize(parent.computeSize());
  }

  update() {
    let frameNum = 1+Math.floor((new Date().getTime()-this.startTime)%this.loopTime/(this.loopTime/this.numFrames));
    this.parent.sprite = this.baseSpriteName + frameNum;
  }

}