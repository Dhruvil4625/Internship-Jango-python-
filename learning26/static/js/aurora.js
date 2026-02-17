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
  var mouse = { x: 0.5, y: 0.3, active: false };
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
        z: Math.random(),                  // depth 0..1
        s: rand(0.7, 1.4),                 // base size scale
        v: rand(30, 80) * dir,             // velocity
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
    var ordered = plants.slice().sort(function (a, b) { return a.h - b.h; });
    ordered.forEach(function (p) {
      var baseX = p.x * w;
      var depth = (p.h - 120) / 100;
      if (depth < 0) depth = 0;
      if (depth > 1) depth = 1;
      var alpha = 0.35 + depth * 0.55;
      var sway = Math.sin(tnow * p.sp + p.phase) * p.a;
      ctx.globalAlpha = alpha;
      var blades = 3;
      for (var i = 0; i < blades; i++) {
        var offsetSide = i - 1;
        var bladeOffset = offsetSide * (p.w * 1.8);
        var bladeHeight = p.h * (0.7 + i * 0.15);
        var x0 = baseX + bladeOffset + sway * (0.4 + i * 0.1);
        var cp1x = baseX + bladeOffset + sway * (0.9 + i * 0.1);
        var cp2x = baseX + bladeOffset + sway * (0.6 + i * 0.12);
        var topY = h - bladeHeight;
        var grad = ctx.createLinearGradient(x0, h, x0, topY);
        grad.addColorStop(0, "rgba(4,47,46,0.95)");
        grad.addColorStop(0.4, "rgba(16,185,129,0.9)");
        grad.addColorStop(1, "rgba(45,212,191,0.55)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.w * (0.9 + i * 0.25);
        ctx.beginPath();
        ctx.moveTo(baseX + bladeOffset, h + 6);
        ctx.bezierCurveTo(cp1x, h - bladeHeight * 0.4, cp2x, h - bladeHeight * 0.8, x0, topY);
        ctx.stroke();
        var tipLen = p.w * (3.2 + i);
        var tipWidth = p.w * (1.3 + i * 0.3);
        ctx.fillStyle = "rgba(94,234,212,0.8)";
        ctx.beginPath();
        ctx.ellipse(x0, topY + 4, tipWidth, tipLen, 0.4 * offsetSide, 0, Math.PI * 2);
        ctx.fill();
      }
      var highlightX = baseX + sway * 0.25;
      var highlightTop = h - p.h * 0.9;
      var highlightGrad = ctx.createLinearGradient(highlightX, h, highlightX, highlightTop);
      highlightGrad.addColorStop(0, "rgba(0,0,0,0)");
      highlightGrad.addColorStop(0.4, "rgba(190,242,100,0.4)");
      highlightGrad.addColorStop(1, "rgba(190,242,100,0.0)");
      ctx.strokeStyle = highlightGrad;
      ctx.lineWidth = p.w * 0.5;
      ctx.beginPath();
      ctx.moveTo(highlightX, h);
      ctx.bezierCurveTo(highlightX + sway * 0.4, h - p.h * 0.35, highlightX + sway * 0.6, h - p.h * 0.8, highlightX + sway * 0.3, highlightTop);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawFish(dt) {
    var tnow = performance.now() / 1000;
    var ordered = fish.slice().sort(function (a, b) { return a.z - b.z; });
    ordered.forEach(function (f) {
      var depth = f.z;
      var speedFactor = 0.4 + (1 - depth) * 0.8;
      f.x += f.v * dt * speedFactor;
      f.y += Math.sin(tnow * f.k + f.t0) * 0.5;
      if (f.x < -80) { f.x = w + 80; f.y = rand(h * 0.2, h * 0.8); }
      if (f.x > w + 80) { f.x = -80; f.y = rand(h * 0.2, h * 0.8); }
      var scaleDepth = f.s * (0.7 + (1 - depth) * 0.9);
      var alpha = 0.35 + (1 - depth) * 0.65;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(f.x, f.y);
      if (f.v < 0) ctx.scale(-1, 1);
      ctx.scale(scaleDepth, scaleDepth);
      var bodyGrad = ctx.createLinearGradient(-26, -6, 30, 4);
      bodyGrad.addColorStop(0, "hsla(" + (f.hue - 20) + ", 80%, 52%, 1)");
      bodyGrad.addColorStop(0.4, "hsla(" + f.hue + ", 90%, 68%, 1)");
      bodyGrad.addColorStop(0.9, "hsla(" + (f.hue + 35) + ", 90%, 58%, 1)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      if (ctx.ellipse) {
        ctx.ellipse(0, 0, 26, 14, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.fillStyle = "hsla(" + (f.hue - 10) + ", 80%, 30%, 0.7)";
      ctx.beginPath();
      ctx.ellipse(-2, 4, 24, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      var highlight = ctx.createLinearGradient(-12, -9, 16, -2);
      highlight.addColorStop(0, "rgba(255,255,255,0)");
      highlight.addColorStop(0.5, "rgba(255,255,255,0.9)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.ellipse(2, -5, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "hsla(" + (f.hue + 40) + ", 90%, 75%, 0.8)";
      ctx.beginPath();
      ctx.moveTo(-26, 0);
      ctx.quadraticCurveTo(-40, 10, -40, 0);
      ctx.quadraticCurveTo(-40, -10, -26, 0);
      ctx.fill();
      ctx.fillStyle = "hsla(" + (f.hue + 60) + ", 95%, 78%, 0.7)";
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.quadraticCurveTo(-2, -18, 4, -12);
      ctx.quadraticCurveTo(-4, -12, -10, -10);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 10);
      ctx.quadraticCurveTo(0, 18, 6, 12);
      ctx.quadraticCurveTo(-2, 12, -6, 10);
      ctx.fill();
      ctx.fillStyle = "hsla(" + (f.hue + 70) + ", 95%, 85%, 0.65)";
      for (var i = 0; i < 3; i++) {
        var px = -4 + i * 7;
        ctx.beginPath();
        ctx.moveTo(px, -8);
        ctx.quadraticCurveTo(px + 3, 0, px, 8);
        ctx.strokeStyle = "hsla(" + (f.hue + 70) + ", 95%, 85%, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.fillStyle = "#0b1220";
      ctx.beginPath();
      ctx.arc(10, -3, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(11, -3.6, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
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

  function drawSeaBackground(now) {
    // Multi-level sea gradient
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, "#0ea5e9");
    grad.addColorStop(0.25, "#0b7bb7");
    grad.addColorStop(0.55, "#0a4f8a");
    grad.addColorStop(1.0, "#082f49");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Cursor spotlight tint
    if (mouse.active) {
      var x = mouse.x * w;
      var y = mouse.y * h;
      var r = Math.max(w, h) * 0.25;
      var cg = ctx.createRadialGradient(x, y, 0, x, y, r);
      cg.addColorStop(0, "rgba(34, 211, 238, 0.28)");
      cg.addColorStop(0.6, "rgba(99, 102, 241, 0.16)");
      cg.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function draw(dt, instant) {
    if (instant) t += 0.016;
    else t += dt;
    ctx.clearRect(0, 0, w, h);

    // Sea
    drawSeaBackground(performance.now());

    if (!reduce) {
      // Plants behind fish
      drawPlants();
      // Fish
      drawFish(dt);
      // Bubbles on top
      ctx.globalCompositeOperation = "lighter";
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

  document.addEventListener("pointermove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / Math.max(1, rect.width);
    mouse.y = (e.clientY - rect.top) / Math.max(1, rect.height);
    mouse.active = true;
  });
  document.addEventListener("pointerleave", function () {
    mouse.active = false;
  });
});
