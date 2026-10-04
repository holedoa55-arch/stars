const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let W, H, dpr;
const stars = [];
const COLORS = ["#ffffff", "#e6f7ff", "#ffe9a3", "#dfe4ff", "#00e5ff", "#b026ff"];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeStars(count) {
  stars.length = 0;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      z: 0.3 + Math.random() * 0.7,
      r: Math.random() * 1.8 + 0.4,
      base: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.04,
      fall: 0.04 + Math.random() * 0.22,
      twinkle: 0.5 + Math.random(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      streak: Math.random() > 0.85,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (const s of stars) {
    s.base += s.speed;
    s.y += s.fall * s.z;
    if (s.y > H + 12) { s.y = -12; s.x = Math.random() * W; }

    const a = 0.35 * (0.5 + (Math.sin(s.base) * 0.5 + 0.5) * 0.5 * s.twinkle);
    const size = s.r * s.z * 1.6;

    if (s.streak) {
      const tail = 14 + Math.random() * 22;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + tail);
      grad.addColorStop(0, s.color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = grad;
      ctx.globalAlpha = a * 0.9;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x, s.y + tail);
      ctx.stroke();
    } else {
      ctx.fillStyle = s.color;
      ctx.globalAlpha = a;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resize();
  makeStars(Math.floor((W * H) / 8000));
});

resize();
makeStars(Math.floor((window.innerWidth * window.innerHeight) / 8000));
draw();