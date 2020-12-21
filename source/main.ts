import { canvas, context, px } from "./canvas.js";

import Board, { LockResult } from "./Board.js";
import { Point } from "./Point.js";
import { BoardConstant } from "./BoardConstant.js";

const DOWN = Point(0, 1);
const LEFT = Point(-1, 0);
const RIGHT = Point(+1, 0);

const font = "'Major Mono Display', 'Courier New', Courier, monospace";

const [beat, beat_fast, tetris_slow, tetris] = document.querySelectorAll(
  "audio"
);

class Tetris {
  private readonly board = new Board();
  private piece = this.board.choose();
  private next = this.board.choose();

  score = 0;
  highscore = parseInt(localStorage.getItem("highscore") ?? "0", 10);

  constructor() {
    document.onkeydown = this.control.bind(this);
  }

  private control(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
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
    this.continueProgression(beat_fast, beat);
    this.continueProgression(tetris, tetris_slow);
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
      this.piece = this.next;
      this.next = board.choose();
    }
  }

  private transitionToFasterSound() {
    if (!tetris.muted) return;
    this.continueProgression(tetris_slow, tetris);
    this.continueProgression(beat, beat_fast);
  }

  private continueProgression(a: HTMLAudioElement, b: HTMLAudioElement) {
    b.currentTime = b.duration * (a.currentTime / a.currentTime);
    b.muted = false;
    a.muted = true;
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
    context.textBaseline = "middle";
    context.textAlign = "left";
    context.fillStyle = "#04D20A";
    this.rendered_score +=
      Math.sign(this.score - this.rendered_score) * 0.5;
    context.fillText(
      `${Math.round(this.rendered_score)}`,
      px * 1.5,
      px * 0.7
    );
    context.scale(0.25, 0.25);
    const x = 1.25;
    const y = 1.0;
    context.lineWidth = px / 4;
    context.strokeStyle = "#03EA09";
    context.strokeRect(x * px, y * px, 4 * px, 4 * px);
    this.next.tetromino.render(x, y, 0);
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
    context.font = `${px / 2}px ${font}`;
    context.fillText(
      "Press SPACE BAR to RETRY",
      BoardConstant.CENTER_X * px,
      (BoardConstant.HEIGHT - 3) * px
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
