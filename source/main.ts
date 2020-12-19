import { canvas, context, gameover } from "./canvas.js";

import { clamp, easeOutBack as ease, lerp } from "./utils.js";

import Board, { LockResult } from "./Board.js";
import { Point } from "./Point.js";

const DOWN = Point(0, 1);
const LEFT = Point(-1, 0);
const RIGHT = Point(+1, 0);

class Tetris {
  private readonly board = new Board();
  private piece = this.board.choose();

  score = 0;
  highscore = parseInt(localStorage.getItem("highscore") ?? "0", 10);

  constructor() {
    document.onkeydown = this.control.bind(this);
  }

  private control(e: KeyboardEvent) {
    switch (e.key) {
      case " ":
        if (this.ended) {
          this.board.clear();
          this.piece = this.board.choose();
          this.score = 0;
          this.ended = false;
        }
        break;
      case "ArrowUp":
      case "w":
        this.piece.rotate();
        return;
      case "ArrowLeft":
      case "a":
        this.piece.move(LEFT);
        return;
      case "ArrowRight":
      case "d":
        this.piece.move(RIGHT);
        return;
      case "ArrowDown":
      case "s":
        this.piece.move(DOWN);
        return;
    }
  }

  private ended = false;

  private end() {
    const score = this.score;
    if (score > this.highscore) {
      this.highscore = score;
      localStorage.setItem("highscore", score.toString());
    }
    this.ended = true;
  }

  private lock(moved: boolean) {
    if (moved) return;
    const board = this.board;
    const result = board.lock(this.piece);
    if (result === LockResult.GAME_OVER) return this.end();
    else {
      this.score += result === LockResult.NOTHING ? 5 : result * 20;
      this.piece = board.choose();
    }
  }

  update() {
    if (this.ended) return;
    this.piece.update();
    this.lock(this.piece.move(DOWN));
  }

  render() {
    if (this.ended) {
      gameover(this.score, this.highscore);
    } else {
      this.board.render();
      this.piece.render(blending);
      this.renderScore();
    }
  }

  private renderedScore = 0;

  renderScore() {
    context.save();
    context.fillStyle = "red";
    this.renderedScore += Math.sign(this.score - this.renderedScore);
    // @ts-ignore
    context.fillText(this.renderedScore, 100, 100);
    context.restore();
  }
}

const tetris = new Tetris();

function update() {
  tetris.update();
}

function render() {
  tetris.render();
}

export let blending = 0;

{
  let then = performance.now();

  const UPS = 1.75;

  const step = 1000 / UPS;

  let accumulator = 0;

  (function frame(now) {
    const dt = now - then;

    accumulator += dt;

    while (accumulator >= step) {
      accumulator -= step;
      update();
    }

    blending = accumulator / step;

    // blending = clamp(blending * 1.1, 0, 1);
    // blending = ease(blending * blending);

    render();

    then = now;

    requestAnimationFrame(frame);
  })(then);
}
