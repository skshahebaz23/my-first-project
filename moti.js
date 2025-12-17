let highestZ = 1;

/* ===== MUSIC PLAY ===== */
function playMusic() {
  const music = document.getElementById("bgm");
  if (music && music.paused) music.play().catch(() => {});
  document.removeEventListener("click", playMusic);
  document.removeEventListener("touchstart", playMusic);
}
document.addEventListener("click", playMusic);
document.addEventListener("touchstart", playMusic);

/* ===== PAPER ===== */
class Paper {
  holding = false;
  x = 0;
  y = 0;
  prevX = 0;
  prevY = 0;
  rotation = Math.random() * 30 - 15;

  init(paper) {

    const move = (x, y) => {
      if (!this.holding) return;
      this.x += x - this.prevX;
      this.y += y - this.prevY;
      this.prevX = x;
      this.prevY = y;

      paper.style.transform =
        `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    };

    /* DESKTOP */
    paper.addEventListener("mousedown", e => {
      this.holding = true;
      paper.style.zIndex = highestZ++;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });

    document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
    document.addEventListener("mouseup", () => this.holding = false);

    /* MOBILE */
    paper.addEventListener("touchstart", e => {
      e.preventDefault(); // 🔥 VERY IMPORTANT
      this.holding = true;
      paper.style.zIndex = highestZ++;
      const t = e.touches[0];
      this.prevX = t.clientX;
      this.prevY = t.clientY;
    }, { passive: false });

    document.addEventListener("touchmove", e => {
      if (!this.holding) return;
      const t = e.touches[0];
      move(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchend", () => this.holding = false);
  }
}

document.querySelectorAll(".paper").forEach(p => {
  new Paper().init(p);
});
