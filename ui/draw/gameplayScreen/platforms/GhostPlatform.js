import BaseComponent from "../../components/BaseComponent.js";
import CollisionShape from "../../components/CollisionShape.js";
import Gravity from "../../components/Gravity.js";

export default class GhostPlatform extends BaseComponent {

  constructor() {
    super();
    this.fake = true;
    this.withSize({w:75/600,h:0.02}).withSprite('ghostPlatform');
  }

}