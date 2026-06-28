// ── Rain Canvas Animation ───────────────────────────────────
(function () {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;

  const ctx   = canvas.getContext('2d');
  let   drops = [];
  const COUNT = 120;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function initDrops() {
    drops = [];
    for (let i = 0; i < COUNT; i++) {
      drops.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        len:     Math.random() * 18 + 8,
        speed:   Math.random() * 6 + 4,
        opacity: Math.random() * 0.5 + 0.15,
        width:   Math.random() * 0.8 + 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.len * 0.15, d.y + d.len);
      ctx.strokeStyle = `rgba(34,211,238,${d.opacity})`;
      ctx.lineWidth   = d.width;
      ctx.lineCap     = 'round';
      ctx.stroke();

      d.y += d.speed;
      d.x -= d.speed * 0.15;

      if (d.y > canvas.height || d.x < 0) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initDrops(); });
  resize();
  initDrops();
  draw();
})();

// ── Probability Bar Animation ───────────────────────────────
window.addEventListener('load', () => {
  const bar = document.querySelector('.prob-bar-fill');
  if (bar) {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = target; }, 150);
  }
});

// ── Form Validation ─────────────────────────────────────────
(function () {
  const form = document.querySelector('.prediction-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    const inputs = form.querySelectorAll('input[type="number"]');
    let   valid  = true;

    inputs.forEach(input => {
      input.style.borderColor = '';
      if (input.value.trim() === '') {
        input.style.borderColor = '#DC2626';
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      alert('⚠️  Please fill in all fields before submitting.');
    }
  });
})();
