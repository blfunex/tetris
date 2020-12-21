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

const offset = 100 * window.devicePixelRatio;

function fill(mode: FillMode) {
  const ratio = innerWidth / innerHeight;
  if (
    mode === FillMode.CONTAIN
      ? ratio < BoardConstant.WIDTH_RATIO
      : ratio > BoardConstant.WIDTH_RATIO
  ) {
    width = innerWidth - offset;
    height = width * BoardConstant.HEIGHT_RATIO;
  } else {
    height = innerHeight - offset;
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

document.body.append(canvas);
