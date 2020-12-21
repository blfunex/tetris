import { context, pixel, px } from "./canvas.js";
import { TetrominoShape } from "./shapes.js";
export default class Tetromino {
    constructor(shapes, center) {
        this.shapes = shapes;
        this.center = center;
    }
    render(x, y, id) {
        const shapes = this.shapes;
        id = id % shapes.length;
        drawTetrominoShape(x, y, shapes[id]);
    }
    renderRotated(x, y, rotation) {
        drawTetromino(x, y, this.shapes[0], ...this.center, rotation);
    }
    renderPreview(x, y) {
        drawTetrominoShapeCentered(x, y, this.shapes[0]);
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
function drawTetrominoShapeCentered(x, y, tetromino) {
    const size = tetromino.length;
    const center = size * 0.5;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            // prettier-ignore
            tetromino[row][col] && pixel(x + col - center, y + row - center);
        }
    }
}
function drawTetromino(x, y, tetromino, cx, cy, rotation) {
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
