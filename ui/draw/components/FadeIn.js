
import BaseComponent from "./BaseComponent.js";

export default class FadeIn extends BaseComponent {

  constructor(parent, duration, onComplete = () => {}) {
    super();
    this.parent = parent;
    this.duration = duration;
    this.onComplete = onComplete;
    this.startTime = new Date().getTime();
  }

  update() {
    super.update();
    if (new Date().getTime() - this.startTime > this.duration) {
      this.onComplete();
      this.parent.sprite = this.sprite;
      this.purge();
      return;
    }
    let progress = (new Date().getTime() - this.startTime) / this.duration;
    if (progress>1) {
      progress = 1;
    }
    this.parent.alpha = progress;
  }

}