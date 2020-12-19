import Board from "./Board";
import { BoardConstant } from "./BoardConstant";

export const canvas = document.createElement("canvas");
export const context = canvas.getContext("2d")!;

let height = 0;
let width = 0;

export let px = 0;

const enum FillMode {
  COVER,
  CONTAIN,
}

function fill(mode: FillMode) {
  const ratio = innerWidth / innerHeight;
  if (
    mode === FillMode.CONTAIN
      ? ratio < BoardConstant.WIDTH_RATIO
      : ratio > BoardConstant.WIDTH_RATIO
  ) {
    width = innerWidth;
    height = width * BoardConstant.HEIGHT_RATIO;
  } else {
    height = innerHeight;
    width = height * BoardConstant.WIDTH_RATIO;
  }
}

(window.onresize = function resize() {
  fill(FillMode.CONTAIN);

  px = height / BoardConstant.HEIGHT;

  canvas.height = height;
  canvas.width = width;
})();

const enum _ {
  EPSILON = 0.5,
  EPSILON_2 = EPSILON * 2,
}

export function pixel(x: number, y: number) {
  context.fillStyle = "#038607";
  context.fillRect(
    x * px - _.EPSILON,
    y * px - _.EPSILON,
    px + _.EPSILON_2,
    px + _.EPSILON_2
  );
}

export function clear() {
  context.fillStyle = "#55FE55";
  context.fillRect(0, 0, width, height);
}

const font = "'Courier New', Courier, monospace";

export function gameover(score: number, highscore: number) {
  context.fillStyle = "#038607";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#55FE55";
  context.font = `${px}px ${font}`;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(
    `SCORE: ${score}`,
    BoardConstant.CENTER_X * px,
    BoardConstant.CENTER_Y * px
  );
  context.font = `${px / 2}px ${font}`;
  context.fillText(
    `HIGHSCORE: ${highscore}`,
    BoardConstant.CENTER_X * px,
    (BoardConstant.CENTER_Y + 1) * px
  );
  context.fillText(
    "Press SPACE BAR to RETRY",
    BoardConstant.CENTER_X * px,
    (BoardConstant.HEIGHT - 1) * px
  );
}

document.body.append(canvas);
