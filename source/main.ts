import { canvas, context, px } from "./canvas.js";

import Board, { LockResult } from "./Board.js";
import { Point } from "./Point.js";
import { BoardConstant } from "./BoardConstant.js";

const DOWN = Point(0, 1);
const LEFT = Point(-1, 0);
const RIGHT = Point(+1, 0);

const font = "'Courier New', Courier, monospace";

const [beat, beat_fast, tetris_slow, tetris] = document.querySelectorAll(
  "audio"
);

class Tetris {
  private readonly board = new Board();
  private piece = this.board.choose();

  score = 0;
  highscore = parseInt(localStorage.getItem("highscore") ?? "0", 10);

  constructor() {
    document.onkeydown = this.control.bind(this);
  }

  private control(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
      case "F1":
        this.board.pixel = !this.board.pixel;
        break;
      case " ":
        if (this.ended) {
          this.startSound();
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

  private startSound() {
    beat.currentTime = 0;
    beat_fast.currentTime = 0;
    tetris_slow.currentTime = 0;
    tetris.muted = beat_fast.muted = true;
    beat.muted = tetris_slow.muted = false;
  }

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
    if (result === LockResult.GAME_OVER) {
      beat.muted = beat_fast.muted = true;
      return this.end();
    } else {
      if (this.board.height >= 10) {
        this.transitionToFasterSound();
      }
      this.score += result === LockResult.NOTHING ? 5 : result * 20;
      this.piece = board.choose();
    }
  }

  private transitionToFasterSound() {
    if (!tetris.muted) return;
    tetris.currentTime =
      tetris.duration *
      (tetris_slow.currentTime / tetris_slow.currentTime);
    tetris.muted = beat_fast.muted = false;
    tetris_slow.muted = beat.muted = true;
  }

  update() {
    if (this.ended) return;
    this.lock(this.piece.move(DOWN));
  }

  render() {
    if (this.ended) {
      this.renderGameOver(this.score, this.highscore);
    } else {
      this.board.render();
      this.piece.render();
      this.renderScore();
    }
  }

  private rendered_score = 0;

  renderScore() {
    context.save();
    context.font = `900 ${px}px ${font}`;
    context.textBaseline = "top";
    context.textAlign = "left";
    context.fillStyle = "#04D20A";
    this.rendered_score +=
      Math.sign(this.score - this.rendered_score) * 0.5;
    context.fillText(
      `${Math.round(this.rendered_score)} ${this.board.height}`,
      px * 0.5,
      px * 0.5
    );
    context.restore();
  }

  renderGameOver(score: number, highscore: number) {
    const width = canvas.width;
    const height = canvas.height;

    context.fillStyle = "#038607";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#55FE55";
    context.font = `bolder ${px}px ${font}`;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
      `SCORE: ${score}`,
      BoardConstant.CENTER_X * px,
      BoardConstant.CENTER_Y * px
    );
    context.font = `${px / 2}px ${font}`;
    context.fillText(
      `HIGHSCORE: ${highscore}`,
      BoardConstant.CENTER_X * px,
      (BoardConstant.CENTER_Y + 1) * px
    );
    context.font = `${px / 4}px ${font}`;
    context.fillText(
      "Use F1 to toggle non-animated Tetrominos.",
      BoardConstant.CENTER_X * px,
      (BoardConstant.HEIGHT - 1.4) * px
    );
    context.font = `${px / 2}px ${font}`;
    context.fillText(
      "Press SPACE BAR to RETRY",
      BoardConstant.CENTER_X * px,
      (BoardConstant.HEIGHT - 1) * px
    );
  }
}

const game = new Tetris();

{
  let then = performance.now();

  const UPS = 3 / 2;

  const step = 1000 / UPS;

  let accumulator = 0;

  (function frame(now) {
    const dt = now - then;

    accumulator += dt;

    while (accumulator >= step) {
      accumulator -= step;
      game.update();
    }

    game.render();

    then = now;

    requestAnimationFrame(frame);
  })(then);

  beat.currentTime = 0;
  beat_fast.currentTime = 0;
  tetris_slow.currentTime = 0;
}
