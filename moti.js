let highestZ = 1;

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
    return { x: e.clientX, y: e.clientY };
  }

  updateTransform(paper) {
    paper.style.transform =
      `translate(${this.paperX}px, ${this.paperY}px) rotate(${this.rotation}deg)`;
  }

  init(paper) {
    // ✨ ORIGINAL POSITION KO LIKALNA (WITHOUT MOVING IT)
    const rect = paper.getBoundingClientRect();
    this.paperX = rect.left;
    this.paperY = rect.top;

    paper.style.position = "fixed";      // SAME EXACT POSITION
    this.updateTransform(paper);         // Apply rotation + fixed starting position

    const move = (e) => {
      if (!this.holding) return;

      const pos = this.getPos(e);

      const dx = pos.x - this.startX;
      const dy = pos.y - this.startY;

      this.paperX += dx;
      this.paperY += dy;

      this.startX = pos.x;
      this.startY = pos.y;

      this.updateTransform(paper);
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

    // Mouse
    paper.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    // Touch
    paper.addEventListener("touchstart", down, { passive: false });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
  }
}

document.querySelectorAll(".paper").forEach((paper) => {
  new Paper().init(paper);
});
