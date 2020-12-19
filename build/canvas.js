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
    context.fillStyle = "#038607";
    context.fillRect(x * px - 0.5 /* EPSILON */, y * px - 0.5 /* EPSILON */, px + 1 /* EPSILON_2 */, px + 1 /* EPSILON_2 */);
}
export function clear() {
    context.fillStyle = "#55FE55";
    context.fillRect(0, 0, width, height);
}
const font = "'Courier New', Courier, monospace";
export function gameover(score, highscore) {
    context.fillStyle = "#038607";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#55FE55";
    context.font = `${px}px ${font}`;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(`SCORE: ${score}`, 5 /* CENTER_X */ * px, 10 /* CENTER_Y */ * px);
    context.font = `${px / 2}px ${font}`;
    context.fillText(`HIGHSCORE: ${highscore}`, 5 /* CENTER_X */ * px, (10 /* CENTER_Y */ + 1) * px);
    context.fillText("Press SPACE BAR to RETRY", 5 /* CENTER_X */ * px, (20 /* HEIGHT */ - 1) * px);
}
document.body.append(canvas);
