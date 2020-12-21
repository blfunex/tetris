import { context, pixel, px } from "./canvas.js";
import { TetrominoShape, TetrominoShapes } from "./shapes.js";

export default class Tetromino {
  static readonly Z = new Tetromino(TetrominoShape.Z, [1.5, 1.5]);
  static readonly S = new Tetromino(TetrominoShape.S, [1.5, 1.5]);
  static readonly T = new Tetromino(TetrominoShape.T, [1.5, 1.5]);
  static readonly J = new Tetromino(TetrominoShape.J, [1.5, 1.5]);
  static readonly L = new Tetromino(TetrominoShape.L, [1.5, 1.5]);
  static readonly O = new Tetromino(TetrominoShape.O, [2, 2]);
  static readonly I = new Tetromino(TetrominoShape.I, [2, 2]);

  render(x: number, y: number, id: number) {
    const shapes = this.shapes;
    id = id % shapes.length;
    drawTetrominoShape(x, y, shapes[id]);
  }

  renderRotated(x: number, y: number, rotation: number) {
    drawTetromino(x, y, this.shapes[0], ...this.center, rotation);
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

function drawTetromino(
  x: number,
  y: number,
  tetromino: TetrominoShape,
  cx: number,
  cy: number,
  rotation: number
) {
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
