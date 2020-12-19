import { pixel } from "./canvas.js";
import { TetrominoShape } from "./shapes.js";
export class Tetromino {
    constructor(shape, center) {
        this.shape = shape;
        this.center = center;
    }
}
Tetromino.Z = new Tetromino(TetrominoShape.Z, [1.5, 1.5]);
Tetromino.S = new Tetromino(TetrominoShape.S, [1.5, 1.5]);
Tetromino.T = new Tetromino(TetrominoShape.T, [1.5, 1.5]);
Tetromino.J = new Tetromino(TetrominoShape.J, [1.5, 1.5]);
Tetromino.L = new Tetromino(TetrominoShape.L, [1.5, 1.5]);
Tetromino.O = new Tetromino(TetrominoShape.O, [1.5, 1.5]);
Tetromino.I = new Tetromino(TetrominoShape.I, [1.5, 1.5]);
export function drawTetrominoShape(x, y, tetromino) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            // prettier-ignore
            tetromino[row][col] &&
                pixel(x + col, y + row);
        }
    }
}
export function drawTetromino(x, y, tetromino, rotation) { }
