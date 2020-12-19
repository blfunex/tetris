import { lerp as _lerp } from "./utils.js";

export type Point = [x: number, y: number];

export function Point(x: number, y: number): Point {
  return [x, y];
}

export namespace Point {
  export function set(point: Point, x: number, y: number) {
    point[0] = x;
    point[1] = y;
    return point;
  }

  export function copy(point: Point, clone: Point) {
    point[0] = clone[0];
    point[1] = clone[1];
    return point;
  }

  export function add(point: Point, a: Point, b: Point) {
    point[0] = a[0] + b[0];
    point[1] = a[1] + b[1];
    return point;
  }

  export function clone(point: Point) {
    return Point(point[0], point[1]);
  }

  export function lerp(point: Point, a: Point, b: Point, t: number) {
    point[0] = _lerp(a[0], b[0], t);
    point[1] = _lerp(a[1], b[1], t);
    return point;
  }
}
