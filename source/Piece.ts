import Board from "./Board.js";
import { BoardConstant } from "./BoardConstant.js";
import { TetrominoShape } from "./shapes.js";
import Tetromino from "./Tetromino.js";
import { lerp } from "./utils.js";
import { Point } from "./Point.js";
import { blending } from "./main.js";
import { context } from "./canvas.js";

export default class Piece {
  get shapes() {
    return this.tetromino.shapes;
  }

  constructor(readonly board: Board, readonly tetromino: Tetromino) {}

  get shape() {
    const shapes = this.shapes;
    return shapes[(this.angle + this.rotation) % shapes.length];
  }

  get next() {
    const shapes = this.shapes;
    return shapes[(this.angle + this.rotation + 1) % shapes.length];
  }

  readonly position = Point(3, -2);
  public angle = 0;

  private position_prev = Point.clone(this.position);
  private angle_prev = 0;

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

  private movement = Point(0, 0);

  move(movement: Point) {
    const [x, y] = movement;
    const [nx, ny] = this.movement;

    if (this.collision(x + nx, y + ny, this.shape)) return false;

    Point.add(this.movement, this.movement, movement);

    return true;
  }

  private rotation = 0;

  rotate() {
    const next = this.next;

    let offset = 0;

    const movement = this.movement;

    const [x] = this.position;
    const [mx, my] = movement;

    if (this.collision(mx, my, next)) {
      offset = x + mx > BoardConstant.CENTER_X ? -1 : 1;
    }

    if (this.collision(mx + offset, my, next)) return false;

    movement[0] += offset;

    this.angle = (this.angle + this.rotation + 1) % 4;

    return true;
  }

  update() {
    this.angle_prev = this.angle + this.rotation;

    Point.copy(this.position_prev, this.position);

    Point.add(this.position, this.position, this.movement);
    Point.set(this.movement, 0, 0);

    this.rotation = 0;
  }

  private position_projected = Point(0, 0);

  render(blending: number) {
    const angle = this.angle + this.rotation;
    const angle_prev = this.angle_prev;

    const [nx, ny] = Point.add(
      this.position_projected,
      this.position,
      this.movement
    );

    const [x, y] = Point.lerp(
      this.position_projected,
      this.position,
      this.position_projected,
      blending
    );

    context.save();
    this.tetromino.render(x, y, angle, angle_prev, blending);
    context.globalAlpha = 0.3;
    this.tetromino.draw(nx, ny, angle);
    context.restore();
  }
}
