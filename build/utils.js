export function lerp(a, b, t) {
    return a + (b - a) * t;
}
// prettier-ignore
export function lerp_angle(a, b, t) {
    let delta = repeat(b - a, TAU);
    if (delta > PI)
        delta -= TAU;
    return a + delta * t;
}
const PI = Math.PI;
const TAU = 2.0 * PI;
export function repeat(t, length) {
    return clamp(t - Math.floor(t / length) * length, 0, length);
}
export function clamp(x, min, max) {
    return Math.min(max, Math.max(min, x));
}
export function smooth_step(t) {
    return -2 * t * t * t + 3 * t * t;
}
const c5 = (2 * Math.PI) / 4.5;
export function easeInOutElastic(x) {
    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 +
                    1;
}
export function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
        return n1 * x * x;
    }
    else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}
const c1 = 1.70158;
const c3 = c1 + 1;
export function easeInBack(x) {
    return c3 * x * x * x - c1 * x * x;
}
export function easeOutBack(x) {
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
