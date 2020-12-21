import { clear, context, pixel } from "./canvas.js";
import Piece from "./Piece.js";
import Tetromino from "./Tetromino.js";
export default class Board {
    constructor() {
        this.pixel = false;
        this.height = 0;
        this.board = Array.from({
            length: 200 /* BOARD_ARRAY_LENGTH */,
        }, () => 0);
    }
    clear() {
        this.board.fill(0);
        this.height = 0;
    }
    choose() {
        const bag = Board.tetrominos;
        const prototype = bag[(Math.random() * bag.length) | 0];
        const tetromino = new Tetromino(prototype.shapes, prototype.center);
        return new Piece(this, tetromino);
    }
    get(x, y) {
        return this.board[this.index(x, y)] !== 0;
    }
    set(x, y, value) {
        this.board[this.index(x, y)] = value ? 1 : 0;
    }
    render() {
        clear();
        context.fillStyle = "#038607";
        for (let r = 0; r < 20 /* HEIGHT */; r++) {
            for (let c = 0; c < 10 /* WIDTH */; c++) {
                if (this.get(c, r)) {
                    pixel(c, r);
                }
            }
        }
    }
    lock(piece) {
        let reward = 0;
        const position = piece.position;
        const x = position[0];
        const y = position[1];
        const shape = piece.shape;
        const size = shape.length;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                // we skip the vacant squares
                if (!shape[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (y + r < 0) {
                    return -1 /* GAME_OVER */;
                }
                // we lock the piece
                this.set(x + c, y + r, true);
                this.height = Math.max(20 - (y + r), this.height);
            }
        }
        for (let r = 0; r < 20 /* HEIGHT */; r++) {
            let line = true;
            for (let c = 0; c < 10 /* WIDTH */; c++) {
                line = line && this.get(c, r);
            }
            if (line) {
                // if the row is full
                // we move down all the rows above it
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < 10 /* WIDTH */; c++) {
                        this.set(c, y, this.get(c, y - 1));
                    }
                }
                // the top row board[0][..] has no row above it
                for (let c = 0; c < 10 /* WIDTH */; c++) {
                    this.set(c, 0, false);
                }
                // increment the score
                reward++;
            }
        }
        return reward;
    }
    index(x, y) {
        return x + y * 10 /* BOARD_ARRAY_STRIDE */;
    }
}
Board.tetrominos = [
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
    Tetromino.T,
    Tetromino.Z,
];
