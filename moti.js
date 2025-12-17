let highestZ = 1;

/* ================= MUSIC PLAY ON FIRST TOUCH / CLICK ================= */
function playMusicOnce() {
  const music = document.getElementById("bgm");
  if (music && music.paused) {
    music.play().catch(() => {});
  }
  document.removeEventListener("click", playMusicOnce);
  document.removeEventListener("touchstart", playMusicOnce);
}

document.addEventListener("click", playMusicOnce);
document.addEventListener("touchstart", playMusicOnce);

/* ================= PAPER CLASS ================= */
class Paper {
  holdingPaper = false;
  mouseX = 0;
  mouseY = 0;
  prevX = 0;
  prevY = 0;
  currentX = 0;
  currentY = 0;
  rotation = Math.random() * 30 - 15;

  init(paper) {

    /* ===== MOVE FUNCTION ===== */
    const movePaper = (x, y) => {
      if (!this.holdingPaper) return;

      const dx = x - this.prevX;
      const dy = y - this.prevY;

      this.currentX += dx;
      this.currentY += dy;

      this.prevX = x;
      this.prevY = y;

      paper.style.transform =
        `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
    };

    /* ===== MOUSE EVENTS ===== */
    paper.addEventListener("mousedown", (e) => {
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });

    document.addEventListener("mousemove", (e) => {
      movePaper(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", () => {
      this.holdingPaper = false;
    });

    /* ===== TOUCH EVENTS (MOBILE) ===== */
    paper.addEventListener("touchstart", (e) => {
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      const touch = e.touches[0];
      this.prevX = touch.clientX;
      this.prevY = touch.clientY;
    });

    document.addEventListener("touchmove", (e) => {
      if (!this.holdingPaper) return;
      const touch = e.touches[0];
      movePaper(touch.clientX, touch.clientY);
      e.preventDefault(); // 👈 IMPORTANT for mobile
    }, { passive: false });

    document.addEventListener("touchend", () => {
      this.holdingPaper = false;
    });
  }
}

/* ================= INIT ================= */
document.querySelectorAll(".paper").forEach(paper => {
  new Paper().init(paper);
});
