let highestZ = 1;
let stackOffset = 0;

/* =================================================
   MUSIC – SAME LOGIC AS YOUR WORKING PAGE
   ================================================= */

// mobile + desktop first interaction
function startMusicOnce() {
  const bgm = document.getElementById("bgm");
  if (bgm && bgm.paused) {
    bgm.play().catch(() => {});
  }
}

// first click / tap only
document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("touchstart", startMusicOnce, { once: true });

/* =================================================
   PAPER CLASS (UNCHANGED DRAG LOGIC)
   ================================================= */

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

/* =================================================
   INIT
   ================================================= */

document.querySelectorAll(".paper").forEach(paper => {
  new Paper().init(paper);
});
