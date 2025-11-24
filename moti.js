let highestZ = 1;

class Paper {
  holding = false;
  startX = 0;
  startY = 0;
  paperX = 0;
  paperY = 0;

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

  init(paper) {

    const move = (e) => {
      if (!this.holding) return;

      const pos = this.getPos(e);

      const dx = pos.x - this.startX;
      const dy = pos.y - this.startY;

      this.paperX += dx;
      this.paperY += dy;

      this.startX = pos.x;
      this.startY = pos.y;

      paper.style.transform =
        `translate(${this.paperX}px, ${this.paperY}px)`;

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

