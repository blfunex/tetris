export const canvas = document.createElement("canvas");
export const context = canvas.getContext("2d");
let height = 0;
let width = 0;
export let px = 0;
function fill(mode) {
    const ratio = innerWidth / innerHeight;
    if (mode === 1 /* CONTAIN */
        ? ratio < 0.5 /* WIDTH_RATIO */
        : ratio > 0.5 /* WIDTH_RATIO */) {
        width = innerWidth;
        height = width * 2 /* HEIGHT_RATIO */;
    }
    else {
        height = innerHeight;
        width = height * 0.5 /* WIDTH_RATIO */;
    }
}
(window.onresize = function resize() {
    fill(1 /* CONTAIN */);
    px = height / 20 /* HEIGHT */;
    canvas.height = height;
    canvas.width = width;
})();
export function pixel(x, y) {
    context.fillRect(x * px - 0.5 /* EPSILON */, y * px - 0.5 /* EPSILON */, px + 1 /* EPSILON_2 */, px + 1 /* EPSILON_2 */);
}
export function clear() {
    context.fillStyle = "#55FE55";
    context.fillRect(0, 0, width, height);
}
document.body.append(canvas);
