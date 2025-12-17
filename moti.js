let highestZ = 1;
let stackOffset = 0;
let audioUnlocked = false;

/* ================= AUDIO UNLOCK ================= */
function unlockAudio() {
  const music = document.getElementById("bgm");
  if (!music || audioUnlocked) return;

  music.muted = true;
  music.play().then(() => {
    music.pause();
    music.currentTime = 0;
    music.muted = false;
    audioUnlocked = true;
  }).catch(() => {});
}

/* ================= PLAY MUSIC ================= */
function playMusic() {
  const music = document.getElementById("bgm");
  if (!music) return;
  music.play().catch(() => {});
}

/* ================= PAPER CLASS ================= */
class Paper {
  holding = false;
  startX = 0;
  startY = 0;
  paperX = 0;
  paperY = 0;
  rotation = Math.random() * 30 - 15;

  getPos(e) {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };
  }

  update(paper) {
    paper.style.transform =
      `translate(${this.paperX}px, ${this.paperY}px) rotate(${this.rotation}deg)`;
  }

  init(paper) {

    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    this.paperX = centerX - paper.offsetWidth / 2 + stackOffset;
    this.paperY = centerY - paper.offsetHeight / 2 + stackOffset;
    stackOffset += 4;

    paper.style.position = "absolute";
    paper.style.left = "0";
    paper.style.top = "0";
    this.update(paper);

    const move = (e) => {
      if (!this.holding) return;
      const pos = this.getPos(e);
      this.paperX += pos.x - this.startX;
      this.paperY += pos.y - this.startY;
      this.startX = pos.x;
      this.startY = pos.y;
      this.update(paper);
      e.preventDefault();
    };

    const down = (e) => {
      unlockAudio();   // 🔓 FIRST
      playMusic();     // 🎵 THEN

      const pos = this.getPos(e);
      this.holding = true;
      this.startX = pos.x;
      this.startY = pos.y;
      paper.style.zIndex = highestZ++;
      e.preventDefault();
    };

    const up = () => this.holding = false;

    paper.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    paper.addEventListener("touchstart", down, { passive: false });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", up);
  }
}

/* ================= INIT ================= */
document.querySelectorAll(".paper").forEach(p => new Paper().init(p));
