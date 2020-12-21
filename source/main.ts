import { canvas, context, px } from "./canvas.js";

import Board, { LockResult } from "./Board.js";
import { Point } from "./Point.js";
import { BoardConstant } from "./BoardConstant.js";

const DOWN = Point(0, 1);
const LEFT = Point(-1, 0);
const RIGHT = Point(+1, 0);

const font = "'Major Mono Display', 'Courier New', Courier, monospace";

const audios = document.querySelectorAll("audio");

const [
  beat,
  beat_fast,
  tetris_lofi,
  tetris_slow,
  tetris,
  line,
  no_line,
] = audios;

unmute();

const mobile = window.ontouchstart === null;

let touch_paused = 0;

class Tetris {
  private readonly board = new Board();
  private piece = this.board.choose();
  private next = this.board.choose();

  muted = JSON.parse(localStorage.getItem("tetris.muted") ?? "false");

  unmuteIfEnabled() {
    this.setSoundState(this.muted);
  }

  toggleSound() {
    const muted = (this.muted = !this.muted);
    localStorage.setItem("tetris.muted", JSON.stringify(muted));
    this.setSoundState(muted);
    return muted;
  }

  score = 0;
  highscore = parseInt(
    localStorage.getItem("tetris.highscore") ?? "0",
    10
  );

  constructor() {
    document.onkeydown = this.control.bind(this);

    this.unmuteIfEnabled();

    {
      let touchstartX = 0;
      let touchstartY = 0;
      let touchendX = 0;
      let touchendY = 0;

      target.addEventListener("touchstart", down);
      target.addEventListener("touchend", up);

      function down(e: TouchEvent) {
        if (touch_paused > 0) return;
        const touch = e.changedTouches[0];
        touchstartX = touch.screenX;
        touchstartY = touch.screenY;
      }

      function up(e: TouchEvent) {
        if (touch_paused > 0) return;
        const touch = e.changedTouches[0];
        touchendX = touch.screenX;
        touchendY = touch.screenY;
        gesture();
      }

      const gesture = () => {
        if (this.ended) return this.restart();

        const tx = 50;
        const ty = 50;

        const dx = touchendX - touchstartX;
        const dy = touchendY - touchstartY;

        if (dx >= tx) {
          this.right();
        } else if (dx <= -tx) {
          this.left();
        }

        const send = 2.5 * ty;

        if (dy >= send) {
          this.send();
        } else if (dy >= ty) {
          this.down();
        }

        if (dy <= -ty) {
          this.up();
        }
      };
    }
  }

  private setSoundState(muted: boolean) {
    if (muted) mute();
    else unmute();
  }

  private control(e: KeyboardEvent) {
    switch (e.key) {
      default:
        return;
      case "F1":
        this.toggleSound();
        break;
      case " ":
        this.send();
        this.restart();
        break;
      case "ArrowUp":
      case "w":
        this.up();
        break;
      case "ArrowLeft":
      case "a":
        this.left();
        break;
      case "ArrowRight":
      case "d":
        this.right();
        break;
      case "ArrowDown":
      case "s":
        this.down();
        break;
    }
    e.preventDefault();
  }

  private ended = false;

  private up() {
    this.piece.rotate();
  }

  private left() {
    this.piece.move(LEFT);
  }

  private right() {
    this.piece.move(RIGHT);
  }

  private down() {
    return this.piece.move(DOWN);
  }

  private send() {
    if (this.ended) return;
    while (this.down());
    this.lock(true);
  }

  private restart() {
    if (this.ended) {
      this.transitionToGameSound();
      this.board.clear();
      this.piece = this.board.choose();
      this.score = 0;
      this.ended = false;
    }
  }

  private sfx(sound: HTMLAudioElement) {
    sound.currentTime = 0;
    sound.play();
  }

  transitionToGameSound() {
    if (tetris_lofi.muted) return;
    this.continueProgression(tetris_lofi, tetris_slow);
    beat.muted = beat_fast.muted = true;
  }

  private transitionToMenuSound() {
    if (!tetris_lofi.muted) return;
    this.continueProgression(
      tetris.muted ? tetris_slow : tetris,
      tetris_lofi
    );
    beat.muted = beat_fast.muted = true;
  }

  private transitionToFastTetris() {
    if (tetris_slow.muted) return;
    this.continueProgression(tetris_slow, tetris);
  }

  private transitionToSlowTetris() {
    if (tetris.muted) return;
    this.continueProgression(tetris, tetris_slow);
  }

  private transitionToFastBeat() {
    if (beat.muted) return;
    this.continueProgression(beat, beat_fast);
  }

  private transitionToSlowBeat() {
    if (beat_fast.muted) return;
    this.continueProgression(beat_fast, beat);
  }

  private end() {
    touch_paused = 4;
    const score = this.score;
    if (score > this.highscore) {
      this.highscore = score;
      localStorage.setItem("tetris.highscore", score.toString());
    }
    this.ended = true;
  }

  private lock(moved: boolean) {
    if (moved) return;
    const board = this.board;
    const result = board.lock(this.piece);
    if (result === LockResult.GAME_OVER) {
      this.transitionToMenuSound();
      return this.end();
    } else {
      this.score += result === LockResult.NOTHING ? 5 : result * 20;
      this.piece = this.next;
      this.next = board.choose();
    }
  }

  private continueProgression(a: HTMLAudioElement, b: HTMLAudioElement) {
    b.currentTime = b.duration * (a.currentTime / a.duration);
    b.muted = false;
    a.muted = true;
  }

  update() {
    if (touch_paused > 0) touch_paused--;
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

  private changeSounds(previous: number, current: number) {
    if (previous < current) {
      if (current >= 5) {
        this.transitionToSlowBeat();
      }
      if (current >= 10) {
        this.transitionToFastBeat();
      }
      if (current >= 15) {
        this.transitionToFastTetris();
      }
      this.sfx(no_line);
    } else if (previous > current) {
      if (current < 15) {
        this.transitionToSlowTetris();
      }
      if (current < 10) {
        this.transitionToSlowBeat();
      }
      if (current < 5) {
        beat.muted = beat_fast.muted = true;
      }
      this.sfx(line);
    }
  }

  renderScore() {
    context.save();
    context.font = `900 ${px}px ${font}`;
    context.textBaseline = "middle";
    context.textAlign = "left";
    context.fillStyle = "#03AC08";
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
    const o = px / 8;
    context.strokeStyle = "#3BDF40";
    context.strokeRect(
      x * px - o,
      y * px - o,
      4 * px + 2 * o,
      4 * px + 2 * o
    );
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
      `score: ${score}`,
      BoardConstant.CENTER_X * px,
      BoardConstant.CENTER_Y * px
    );
    context.font = `${px / 2}px ${font}`;
    context.fillText(
      `highscore: ${highscore}`,
      BoardConstant.CENTER_X * px,
      (BoardConstant.CENTER_Y + 1) * px
    );
    context.font = `${px / 2}px ${font}`;
    context.fillText(
      `${mobile ? "touch" : "press space"} to restart`,
      BoardConstant.CENTER_X * px,
      (BoardConstant.HEIGHT - 3) * px
    );
  }
}

const target = document.body;
const game = new Tetris();

const button = document.querySelector("button")!;

button.classList.toggle("active", !game.muted);

button.onclick = e => {
  const muted = game.toggleSound();
  button.classList.toggle("active", !muted);
  e.stopPropagation();
  e.preventDefault();
};

if (!mobile) {
  tetris_lofi.play();
  tetris_lofi.muted = false;
  game.unmuteIfEnabled();
}

target.onclick = () => {
  if (mobile && !(target === document.fullscreenElement)) {
    target.requestFullscreen();

    tetris_lofi.currentTime = 0;
    tetris_lofi.play();
    game.unmuteIfEnabled();
  } else {
    target.onclick = null;
  }
};

(function home() {
  context.fillStyle = "#038607";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#55FE55";
  context.font = `bolder ${2.15 * px}px ${font}`;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(
    `tetris`,
    BoardConstant.CENTER_X * px,
    BoardConstant.CENTER_Y * px
  );
  context.font = `${px / 2}px ${font}`;
  context.fillText(
    `${mobile ? "tap" : "click"} to start`,
    BoardConstant.CENTER_X * px,
    (BoardConstant.HEIGHT - 3) * px
  );
  // @ts-ignore
  requestAnimationFrame(target.onclick ? home : run);
})();

function unmute() {
  beat.volume = beat_fast.volume = 0.5;
  tetris.volume = tetris_slow.volume = 0.4;
  tetris_lofi.volume = 0.6;
}

function mute() {
  for (const audio of audios) audio.volume = 0;
}

let then = performance.now();

document.onvisibilitychange = () => {
  if (document.visibilityState === "visible") {
    game.unmuteIfEnabled();
    then = performance.now();
  } else {
    mute();
  }
};

function run() {
  then = performance.now();

  game.transitionToGameSound();

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
}
