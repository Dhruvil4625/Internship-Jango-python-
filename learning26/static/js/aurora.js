document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("aurora");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  var w = 0, h = 0, t = 0, rafId = 0;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var styles = getComputedStyle(document.documentElement);
  var c1 = styles.getPropertyValue("--primary").trim() || "#2563eb";
  var c2 = styles.getPropertyValue("--secondary").trim() || "#7c3aed";
  var c3 = "#22d3ee";

  var bubbles = [];
  var baseBubbles = 60;
  var fish = [];
  var plants = [];
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function seedBubbles() {
    bubbles.length = 0;
    for (var i = 0; i < baseBubbles; i++) {
      bubbles.push({
        x: Math.random(),
        y: 1 + Math.random() * 0.2,
        r: rand(2, 6),
        vy: rand(20, 60),
        vx: rand(-12, 12),
        a: rand(0.12, 0.28),
        col: Math.random() < 0.2 ? pick([c1, c2, c3]) : "#ffffff"
      });
    }
  }
  function burst(cx, cy, count) {
    for (var i = 0; i < count; i++) {
      bubbles.push({
        x: cx / w,
        y: cy / h,
        r: rand(6, 14),
        vy: rand(40, 90),
        vx: rand(-20, 20),
        a: rand(0.18, 0.45),
        col: pick([c1, c2, c3, "#38bdf8", "#34d399", "#f472b6", "#f59e0b"])
      });
    }
  }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function seedPlants() {
    plants.length = 0;
    var count = Math.max(10, Math.min(18, Math.floor(w / 120)));
    for (var i = 0; i < count; i++) {
      plants.push({
        x: Math.random(),          // normalized
        h: rand(120, 220),         // height
        a: rand(8, 26),            // sway amplitude px
        sp: rand(0.5, 1.2),        // sway speed
        w: rand(3, 6),             // stalk width
        phase: rand(0, Math.PI * 2),
        col: pick(["#22c55e", "#10b981", "#16a34a", "#0ea5e9"])
      });
    }
  }
  function seedFish() {
    fish.length = 0;
    var count = Math.max(6, Math.min(14, Math.floor(w / 160)));
    for (var i = 0; i < count; i++) {
      var dir = Math.random() < 0.5 ? -1 : 1;
      fish.push({
        x: Math.random() * w,
        y: rand(h * 0.2, h * 0.8),
        s: rand(0.6, 1.6),                // size scale
        v: rand(30, 80) * dir,            // velocity
        a: rand(6, 16),                   // vertical wiggle amplitude
        k: rand(0.8, 1.6),                // wiggle speed
        hue: pick([200, 210, 220, 260, 170, 30]),
        dir: dir,
        flip: Math.random() < 0.5 ? 1 : -1,
        t0: rand(0, Math.PI * 2)
      });
    }
  }

  function toRGBA(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function drawPlants() {
    var tnow = performance.now() / 1000;
    ctx.save();
    plants.forEach(function (p) {
      var baseX = p.x * w;
      var sway = Math.sin(tnow * p.sp + p.phase) * p.a;
      var x0 = baseX + sway * 0.4;
      var cp1x = baseX + sway * 0.8;
      var cp2x = baseX + sway * 0.6;
      var topY = h - p.h;
      var grad = ctx.createLinearGradient(baseX, h, baseX, topY);
      grad.addColorStop(0, "rgba(16,185,129,0.6)");
      grad.addColorStop(1, p.col);
      ctx.strokeStyle = grad;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(baseX, h + 4);
      ctx.bezierCurveTo(cp1x, h - p.h * 0.4, cp2x, h - p.h * 0.7, x0, topY);
      ctx.stroke();
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.ellipse(x0 + sway * 0.1, topY + 6, p.w * 1.2, p.w * 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawFish(dt) {
    var tnow = performance.now() / 1000;
    fish.forEach(function (f) {
      f.x += f.v * dt;
      f.y += Math.sin(tnow * f.k + f.t0) * 0.5;
      if (f.x < -60) { f.x = w + 60; f.y = rand(h * 0.2, h * 0.8); }
      if (f.x > w + 60) { f.x = -60; f.y = rand(h * 0.2, h * 0.8); }
      ctx.save();
      ctx.translate(f.x, f.y);
      if (f.v < 0) ctx.scale(-1, 1);
      ctx.scale(f.s, f.s);
      var bodyGrad = ctx.createLinearGradient(-20, 0, 24, 0);
      bodyGrad.addColorStop(0, "hsla(" + f.hue + ", 80%, 65%, 0.9)");
      bodyGrad.addColorStop(1, "hsla(" + (f.hue + 40) + ", 80%, 55%, 0.9)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      if (ctx.ellipse) {
        ctx.ellipse(0, 0, 22, 12, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.fillStyle = "hsla(" + (f.hue + 30) + ", 80%, 70%, 0.9)";
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(-36, 8);
      ctx.lineTo(-36, -8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0b1220";
      ctx.beginPath();
      ctx.arc(10, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = Math.max(800, window.innerWidth);
    h = Math.max(600, window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedBubbles();
    seedPlants();
    seedFish();
    draw(0, true);
  }

  function draw(dt, instant) {
    if (instant) t += 0.016;
    else t += dt;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    var blobs = [
      { x: 0.35 + 0.05 * Math.sin(t * 0.6), y: 0.3 + 0.06 * Math.cos(t * 0.5), r: 260, c: c1, a: 0.5 },
      { x: 0.65 + 0.06 * Math.cos(t * 0.4), y: 0.35 + 0.05 * Math.sin(t * 0.7), r: 300, c: c2, a: 0.45 },
      { x: 0.5 + 0.08 * Math.sin(t * 0.3), y: 0.65 + 0.07 * Math.cos(t * 0.35), r: 380, c: c3, a: 0.35 },
    ];

    blobs.forEach(function (b) {
      var x = b.x * w;
      var y = b.y * h;
      var r = b.r + 20 * Math.sin(t * 0.8);
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexToRgba(b.c, b.a));
      g.addColorStop(0.6, hexToRgba(b.c, b.a * 0.18));
      g.addColorStop(1, hexToRgba(b.c, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduce) {
      // Plants behind fish
      drawPlants();
      // Fish
      drawFish(dt);
      // Bubbles on top
      for (var i = 0; i < bubbles.length; i++) {
        var bub = bubbles[i];
        var bx = bub.x * w;
        var by = bub.y * h;
        var grad = ctx.createRadialGradient(bx, by, 0, bx, by, bub.r * 1.2);
        var col = toRGBA(bub.col || "#ffffff");
        grad.addColorStop(0, "rgba(" + col.r + "," + col.g + "," + col.b + "," + (bub.a * 0.9).toFixed(3) + ")");
        grad.addColorStop(0.5, "rgba(" + col.r + "," + col.g + "," + col.b + "," + (bub.a * 0.35).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, bub.r, 0, Math.PI * 2);
        ctx.fill();
        bub.y -= (bub.vy / h) * dt;
        bub.x += (bub.vx / w) * dt;
        bub.vx *= 0.99;
        bub.a *= 0.999;
        if (bub.y < -0.05 || bub.a < 0.03) {
          bub.x = Math.random();
          bub.y = 1 + Math.random() * 0.2;
          bub.r = rand(2, 6);
          bub.vy = rand(20, 60);
          bub.vx = rand(-12, 12);
          bub.a = rand(0.12, 0.28);
          bub.col = Math.random() < 0.15 ? pick([c1, c2, c3]) : "#ffffff";
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
    var vignette = ctx.createRadialGradient(w * 0.5, h * 0.2, Math.max(w, h) * 0.2, w * 0.5, h * 0.2, Math.max(w, h) * 0.9);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.10)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  var last = 0;
  function loop(now) {
    var dt = (now - last) / 1000;
    last = now;
    draw(dt, false);
    rafId = requestAnimationFrame(loop);
  }

  function hexToRgba(hex, alpha) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var num = parseInt(h, 16);
    var r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduce) {
    draw(0, true);
  } else {
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) cancelAnimationFrame(rafId);
    else {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    }
  });

  document.addEventListener("pointerdown", function (e) {
    if (reduce) return;
    var interactive = e.target.closest("a, button, input, textarea, select, .cta");
    if (interactive) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    burst(x, y, 28);
  });
});
