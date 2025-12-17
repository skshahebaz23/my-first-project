let highestZ = 1;
let stackOffset = 0;

/* ================= MUSIC PLAY (MOBILE SAFE) ================= */
function playMusicOnce() {
  const music = document.getElementById("bgm");
  if (!music) return;

  if (music.paused) {
    music.muted = false;
    music.play().catch(() => {});
  }

  document.removeEventListener("click", playMusicOnce);
  document.removeEventListener("touchstart", playMusicOnce);
}

/* Mobile browsers need element interaction */
function bindMusicToElements() {
  document.querySelectorAll(".paper").forEach(paper => {
    paper.addEventListener("touchstart", playMusicOnce, { passive: true });
    paper.addEventListener("mousedown", playMusicOnce);
  });
}

document.addEventListener("DOMContentLoaded", bindMusicToElements);

/* ================= PAPER CLASS ================= */
class Paper {
  holding = false;
  startX = 0;
  startY = 0;
  paperX = 0;
  paperY = 0;
  rotation = Math.random() * 30 - 15;

  getPos(e) {
    if (e.touches) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  update(paper) {
    paper.style.transform =
      `translate(${this.paperX}px, ${this.paperY}px) rotate(${this.rotation}deg)`;
  }

  init(paper) {

    /* ===== CENTER STACK ===== */
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.paperX = centerX - paper.offsetWidth / 2 + stackOffset;
    this.paperY = centerY - paper.offsetHeight / 2 + stackOffset;

    stackOffset += 4;

    paper.style.position = "absolute";
    paper.style.left = "0";
    paper.style.top = "0";

    this.update(paper);

    /* ===== MOVE ===== */
    const move = (e) => {
      if (!this.holding) return;

      const pos = this.getPos(e);
      const dx = pos.x - this.startX;
      const dy = pos.y - this.startY;

      this.paperX += dx;
      this.paperY += dy;

      this.startX = pos.x;
      this.startY = pos.y;

      this.update(paper);
      e.preventDefault();
    };

    const down = (e) => {
      const pos = this.getPos(e);

      this.holding = true;
      this.startX = pos.x;
      this.startY = pos.y;

      paper.style.zIndex = highestZ++;
      playMusicOnce(); // 🔥 direct interaction
      e.preventDefault();
    };

    const up = () => {
      this.holding = false;
    };

    /* ===== DESKTOP ===== */
    paper.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    /* ===== MOBILE ===== */
    paper.addEventListener("touchstart", down, { passive: false });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
  }
}

/* ================= INIT ================= */
document.querySelectorAll(".paper").forEach(paper => {
  new Paper().init(paper);
});


