import { context, pixel, px } from "./canvas.js";
import { TetrominoShape } from "./shapes.js";
import { lerp_angle } from "./utils.js";
export default class Tetromino {
    constructor(shapes, center) {
        this.shapes = shapes;
        this.center = center;
    }
    draw(x, y, rotation) {
        const shapes = this.shapes;
        rotation = rotation % shapes.length;
        drawTetrominoShape(x, y, shapes[rotation]);
    }
    render(x, y, rotation, previous, blending) {
        drawTetromino(x, y, this.shapes[0], ...this.center, rotation, previous, blending);
    }
}
Tetromino.Z = new Tetromino(TetrominoShape.Z, [1.5, 1.5]);
Tetromino.S = new Tetromino(TetrominoShape.S, [1.5, 1.5]);
Tetromino.T = new Tetromino(TetrominoShape.T, [1.5, 1.5]);
Tetromino.J = new Tetromino(TetrominoShape.J, [1.5, 1.5]);
Tetromino.L = new Tetromino(TetrominoShape.L, [1.5, 1.5]);
Tetromino.O = new Tetromino(TetrominoShape.O, [2, 2]);
Tetromino.I = new Tetromino(TetrominoShape.I, [2, 2]);
function drawTetrominoShape(x, y, tetromino) {
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
function drawTetromino(x, y, tetromino, cx, cy, current_rotation, previous_rotation, t) {
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
