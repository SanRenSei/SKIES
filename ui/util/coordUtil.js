import MathUtil from "./mathUtil.js";

export default class CoordUtil {

  static applyMovement(start, target, velocity) {
    let direction = MathUtil.diff2v(target, start);
    let distance = MathUtil.get2vMag(direction);
    if (velocity >= distance) {
      return target;
    }
    return MathUtil.add2v(start, MathUtil.mult2v(direction, velocity/distance));
  }

  static scaleSize(size, scale) {
    return {w:size.w*scale, h:size.h*scale};
  }

  static hexToDraw(hex) {
    let x=0, y=0;
    y = 100*hex.y;
    x += hex.x*75;
    y += hex.x*50;
    return {x,y};
  }

  static rectRectCollision(r1, r2) {
    return Math.abs(r1.x-r2.x) <= r1.w/2 + r2.w/2 && Math.abs(r1.y-r2.y) <= r1.h/2 + r2.h/2
  }

  static pointInRect(p, rect) {
    return p.x>=rect.x-rect.w/2 && p.x<=rect.x+rect.w/2 && p.y>=rect.y-rect.h/2 && p.y<=rect.y+rect.h/2;
  }

  static pointInOval(p, oval) {
    return ((p.x - oval.x) ** 2) / ((oval.w / 2) ** 2) + ((p.y - oval.y) ** 2) / ((oval.h / 2) ** 2) <= 1;
  }

  static ovalRectCollision(oval, rect) {
    let closestX = Math.max(rect.x - rect.w / 2, Math.min(oval.x, rect.x + rect.w / 2));
    let closestY = Math.max(rect.y - rect.h / 2, Math.min(oval.y, rect.y + rect.h / 2));
    return CoordUtil.pointInOval({x:closestX, y:closestY}, oval);
  }

  static ovalOvalCollision(o1, o2) {
    let dx = o1.x - o2.x;
    let dy = o1.y - o2.y;

    let scaleX = 2 / (o1.w + o2.w);
    let scaleY = 2 / (o1.h + o2.h);

    let normalizedDistance = (dx * scaleX) ** 2 + (dy * scaleY) ** 2;
    return normalizedDistance <= 1;
  }

  static negovalOvalCollision(negOval, oval) {
    let centerDist = MathUtil.diff2v(oval, negOval);
    let farDX = centerDist.x + centerDist.x/(Math.abs(centerDist.x)+Math.abs(centerDist.y))*oval.w/2;
    let farDY = centerDist.y + centerDist.y/(Math.abs(centerDist.x)+Math.abs(centerDist.y))*oval.h/2;
    const negOvalDist = (2*farDX/negOval.w)**2 + (2*farDY/negOval.h)**2;
    return negOvalDist > 1;
  }

  static checkShapeCollision(s1, s2) {
    let collisionFuncs = {
      negOval: {
        oval: CoordUtil.negovalOvalCollision
      },
      oval: {
        oval: CoordUtil.ovalOvalCollision,
        rect: CoordUtil.ovalRectCollision
      },
      rect: {
        rect: CoordUtil.rectRectCollision
      }
    };
    if (s1.shape>s2.shape) {
      return collisionFuncs[s2.shape][s1.shape](s2, s1);
    }
    return collisionFuncs[s1.shape][s2.shape](s1, s2);
  }

}