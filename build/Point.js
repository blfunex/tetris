import { lerp as _lerp } from "./utils.js";
export function Point(x, y) {
    return [x, y];
}
(function (Point) {
    function set(point, x, y) {
        point[0] = x;
        point[1] = y;
        return point;
    }
    Point.set = set;
    function copy(point, clone) {
        point[0] = clone[0];
        point[1] = clone[1];
        return point;
    }
    Point.copy = copy;
    function add(point, a, b) {
        point[0] = a[0] + b[0];
        point[1] = a[1] + b[1];
        return point;
    }
    Point.add = add;
    function clone(point) {
        return Point(point[0], point[1]);
    }
    Point.clone = clone;
    function lerp(point, a, b, t) {
        point[0] = _lerp(a[0], b[0], t);
        point[1] = _lerp(a[1], b[1], t);
        return point;
    }
    Point.lerp = lerp;
})(Point || (Point = {}));
