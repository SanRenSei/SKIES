
import collider from "../../event/Collider.js";
import BaseComponent from "./BaseComponent.js";

export default class CollisionShape extends BaseComponent {

  constructor(parent, shape, type, {tags, collidesWith}) {
    super();
    this.parent = parent;
    this.shape = shape;
    this.type = type;
    this.tags = tags || [];
    this.collidesWith = collidesWith || [];
    this.withSize(parent.computeSize());
    this.takeTransformSnapshot();
    collider.addShape(this);
  }

  getCollisionShape() {
    return {shape: this.shape, ...this.transformSnapshot};
  }

  purge() {
    collider.removeShape(this);
  }

}