import CoordUtil from "../util/coordUtil.js";
import eventDispatcher from "./Dispatcher.js";

class Collider {

  constructor() {
    this.colliders = new Set();
    this.collidees = {};
  }

  addCollidee(group, shape) {
    if (!this.collidees[group]) {
      this.collidees[group] = new Set();
    }
    this.collidees[group].add(shape);
  }

  addShape(shape) {
    if (shape.type=='collider' || shape.type=='both') {
      this.colliders.add(shape);
    }
    if (shape.type=='collidee' || shape.type=='both') {
      shape.tags.forEach(t => this.addCollidee(t, shape));
    }
  }

  removeShape(shape) {
    this.colliders.delete(shape);
    shape.tags.forEach(t => this.collidees[t].delete(shape));
  }

  checkCollisions() {
    this.colliders.forEach(collider => {
      collider.collidesWith.forEach(t => {
        this.collidees[t] && this.collidees[t].forEach(collidee => {
          if (collider == collidee) {
            return;
          }
          if (CoordUtil.checkShapeCollision(collider.getCollisionShape(), collidee.getCollisionShape())) {
            eventDispatcher.dispatchEvent({type:'collision', collider, collidee});
          }
        })
      })
    })
  }

}

let collider = new Collider();
export default collider;