import CollisionShape from "../../components/CollisionShape.js";
import NormalPlatform from "./NormalPlatform.js";

export default class MovingPlatform extends NormalPlatform {

  constructor() {
    super();
    this.withPosition({x:0,y:0.5}).withSize({w:75/600,h:0.02}).withSprite('movingPlatform');
    this.goingRight = true;
    this.addChild(new CollisionShape(this, 'rect', 'collidee', {tags: ['platform']}));
  }

  update() {
    if (this.goingRight) {
      this.position.x += 0.01;
      if (this.position.x > 0.66) {
        this.goingRight = false;
      }
      return;
    }
    this.position.x -= 0.01;
    if (this.position.x < -0.66) {
      this.goingRight = true;
    }
  }

}