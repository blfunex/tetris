import Board from "./Board.js";
import { BoardConstant } from "./BoardConstant.js";
import { TetrominoShape } from "./shapes.js";
import Tetromino from "./Tetromino.js";
import { Point } from "./Point.js";
import { context } from "./canvas.js";
import { lerp_angle } from "./utils.js";

export default class Piece {
  get shapes() {
    return this.tetromino.shapes;
  }

  constructor(readonly board: Board, readonly tetromino: Tetromino) {}

  get shape() {
    const shapes = this.shapes;
    return shapes[this.index % shapes.length];
  }

  get next() {
    const shapes = this.shapes;
    return shapes[(this.index + 1) % shapes.length];
  }

  readonly position = Point(3, -2);
  public index = 0;

  private collision(x: number, y: number, shape: TetrominoShape) {
    const position = this.position;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        // if the square is empty, we skip it
        if (!shape[r][c]) {
          continue;
        }

        // coordinates of the piece after movement
        const px = position[0] + c + x;
        const py = position[1] + r + y;

        // outside canvas
        if (
          px < 0 ||
          px >= BoardConstant.WIDTH ||
          py >= BoardConstant.HEIGHT
        ) {
          return true;
        }

        // this is also outside but we start here
        if (py < 0) {
          continue;
        }

        // check if there is a locked piece alrady in place
        if (this.board.get(px, py)) {
          return true;
        }
      }
    }
    return false;
  }

  move(movement: Point) {
    const [x, y] = movement;

    if (this.collision(x, y, this.shape)) return false;

    Point.add(this.position, this.position, movement);

    return true;
  }

  rotate() {
    const next = this.next;

    let offset = 0;

    const position = this.position;

    if (this.collision(0, 0, next)) {
      offset = position[0] > BoardConstant.CENTER_X ? -1 : 1;
    }

    if (this.collision(offset, 0, next)) return false;

    position[0] += offset;

    this.index = (this.index + 1) % 4;

    return true;
  }

  private render_angle = 0;
  private render_position = Point(3, -1);

  render() {
    const index = this.index;
    const [x, y] = this.position;

    const angle = (this.render_angle = lerp_angle(
      this.render_angle,
      (index * Math.PI) / 2,
      0.1
    ));

    const [rx, ry] = Point.lerp(
      this.render_position,
      this.render_position,
      this.position,
      0.1
    );

    context.save();

    if (this.board.pixel) {
      context.fillStyle = "#03EA09";
      this.tetromino.render(x, y, index);
    }

    context.fillStyle = "#038607";
    this.tetromino.renderRotated(rx, ry, angle);

    context.restore();
  }
}
