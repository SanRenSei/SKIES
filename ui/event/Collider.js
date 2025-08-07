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
      if (typeof shape.collidesWith == 'string') {
        shape.collidesWith = [shape.collidesWith];
      }
    }
    if (shape.type=='collidee' || shape.type=='both') {
      if (typeof shape.tags == 'string') {
        shape.tags = [shape.tags];
      }
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

  getShapeCollisions(collisionShape) {
    return collisionShape.collidesWith.flatMap(t => {
      if (!this.collidees[t]) {
        return [];
      }
      return this.collidees[t].filter(collidee => {
        return CoordUtil.checkShapeCollision(collisionShape.getCollisionShape(), collidee.getCollisionShape())
      });
    });
  }

}

let collider = new Collider();
export default collider;