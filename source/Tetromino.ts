import { context, pixel, px } from "./canvas.js";
import { TetrominoShape, TetrominoShapes } from "./shapes.js";
import { lerp_angle } from "./utils.js";

export default class Tetromino {
  static readonly Z = new Tetromino(TetrominoShape.Z, [1.5, 1.5]);
  static readonly S = new Tetromino(TetrominoShape.S, [1.5, 1.5]);
  static readonly T = new Tetromino(TetrominoShape.T, [1.5, 1.5]);
  static readonly J = new Tetromino(TetrominoShape.J, [1.5, 1.5]);
  static readonly L = new Tetromino(TetrominoShape.L, [1.5, 1.5]);
  static readonly O = new Tetromino(TetrominoShape.O, [2, 2]);
  static readonly I = new Tetromino(TetrominoShape.I, [2, 2]);

  draw(x: number, y: number, rotation: number) {
    const shapes = this.shapes;
    rotation = rotation % shapes.length;
    drawTetrominoShape(x, y, shapes[rotation]);
  }

  render(
    x: number,
    y: number,
    rotation: number,
    previous: number,
    blending: number
  ) {
    drawTetromino(
      x,
      y,
      this.shapes[0],
      ...this.center,
      rotation,
      previous,
      blending
    );
  }

  constructor(
    readonly shapes: TetrominoShapes,
    readonly center: [x: number, y: number]
  ) {}
}

function drawTetrominoShape(
  x: number,
  y: number,
  tetromino: TetrominoShape
) {
  const size = tetromino.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // prettier-ignore
      tetromino[row][col] &&
        pixel(x + col, y + row);
    }
  }
}

const PIo2 = Math.PI / 2;

function drawTetromino(
  x: number,
  y: number,
  tetromino: TetrominoShape,
  cx: number,
  cy: number,
  current_rotation: number,
  previous_rotation: number,
  t: number
) {
  current_rotation *= PIo2;
  previous_rotation *= PIo2;

  const rotation = lerp_angle(previous_rotation, current_rotation, t);

  context.save();

  x += cx;
  y += cy;

  x *= px;
  y *= px;

  context.translate(x, y);
  context.rotate(rotation);

  drawTetrominoShape(-cx, -cy, tetromino);

  context.restore();
}
