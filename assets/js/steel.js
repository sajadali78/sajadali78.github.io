/* Steel & Copper: hero machine cross-sections.
   Draws a simplified dual-stator, hybrid-rotor machine on every
   canvas.hero__machine, using the same geometry and colours as the home page
   tour (journey.html). The rotor turns slowly with time and scroll position,
   only while its canvas is on screen; with prefers-reduced-motion it draws one
   still frame. data-seed (an integer) shifts the rotor offset and flux tint. */
(function () {
  "use strict";
  var canvases = document.querySelectorAll("canvas.hero__machine");
  if (!canvases.length) return;

  var TAU = Math.PI * 2, TOP = -Math.PI / 2;
  var R = { fin: 212, house: 190, osOut: 172, slotTop: 160, slotBot: 124, osIn: 121, rotOut: 118.5, pmIn: 111, rotIn: 80, isOut: 77.5, isSlotIn: 50, isIn: 44, shaft: 26 };
  var NS = 24, NR = 24, NIS = 12, NPM = 12, NFS = 6;
  var PHASE = ["#d0864a", "#b8a06a", "#9b5c3c"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function pol(r, a) { return [r * Math.cos(a), r * Math.sin(a)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }

  /* flux colour map and iron tone, as on the tour */
  var STOPS = [[0, hex("#1d3a52")], [0.35, hex("#2f7f86")], [0.6, hex("#8fb27a")], [0.8, hex("#e3a64b")], [1, hex("#e2583a")]];
  var IRON = hex("#3a464e");
  function cmap(v) {
    v = Math.max(0, Math.min(1, v));
    for (var i = 1; i < STOPS.length; i++) {
      if (v <= STOPS[i][0]) {
        var a = STOPS[i - 1], b = STOPS[i], t = (v - a[0]) / (b[0] - a[0]);
        return a[1].map(function (c, k) { return c + (b[1][k] - c) * t; });
      }
    }
    return STOPS[4][1];
  }
  function ironCol(v, vis) {
    var c = cmap(v);
    return "rgb(" + IRON.map(function (x, k) { return Math.round(x + (c[k] - x) * vis); }).join(",") + ")";
  }

  function sector(c, r1, r2, a1, a2) {
    c.beginPath(); c.arc(0, 0, r2, a1, a2); c.arc(0, 0, r1, a2, a1, true); c.closePath();
  }
  function poly(c, pts) {
    c.beginPath();
    pts.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); });
    c.closePath();
  }

  /* housing fins, built once as a path in world units */
  var finPath = null;
  function fins(c) {
    c.beginPath();
    for (var i = 0; i < 40; i++) {
      var a = i * TAU / 40, w = 3.2;
      var pts = [pol(R.house - 1, a - w / R.house), pol(R.fin, a - w / R.fin * 0.8), pol(R.fin, a + w / R.fin * 0.8), pol(R.house - 1, a + w / R.house)];
      c.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k < 4; k++) c.lineTo(pts[k][0], pts[k][1]);
      c.closePath();
    }
  }

  function slot(c, a, i, px) {
    var hb = 4.6 / R.slotBot, ht = 6.6 / R.slotTop, so = 1.6 / R.osIn;
    poly(c, [pol(R.osIn - 0.2, a - so), pol(R.slotBot - 1.5, a - so), pol(R.slotBot, a - hb), pol(R.slotTop, a - ht), pol(R.slotTop, a + ht), pol(R.slotBot, a + hb), pol(R.slotBot - 1.5, a + so), pol(R.osIn - 0.2, a + so)]);
    c.fillStyle = "#141b1f"; c.fill();
    poly(c, [pol(R.slotBot + 0.6, a - hb + 0.4 / R.slotBot), pol(R.slotTop - 0.6, a - ht + 0.5 / R.slotTop), pol(R.slotTop - 0.6, a + ht - 0.5 / R.slotTop), pol(R.slotBot + 0.6, a + hb - 0.4 / R.slotBot)]);
    c.strokeStyle = "rgba(214,205,170,.55)"; c.lineWidth = Math.max(0.35, px); c.stroke();
    poly(c, [pol(R.slotBot - 1.2, a - hb * 0.95), pol(R.slotBot + 1.4, a - hb * 0.98), pol(R.slotBot + 1.4, a + hb * 0.98), pol(R.slotBot - 1.2, a + hb * 0.95)]);
    c.fillStyle = "#6f6a55"; c.fill();
    var lower = PHASE[Math.floor(i / 2) % 3], upper = PHASE[Math.floor((i + 3) / 2) % 3];
    for (var rr = 127; rr < 158.5; rr += 2.9) {
      var lay = rr < 142.5 ? lower : upper;
      var w = lerp(3.4, 5.4, (rr - 124) / 36), n = Math.max(2, Math.floor(w / 1.45));
      for (var s = 0; s < n; s++) {
        var p = pol(rr, a + ((s - (n - 1) / 2) * 2.75) / rr);
        c.beginPath(); c.arc(p[0], p[1], 1.15, 0, TAU); c.fillStyle = lay; c.fill();
      }
    }
  }

  /* static layers: everything that does not turn. `under` sits beneath the
     flux tint, `over` (slots, windings, inner stator, shaft) sits above it. */
  function paintUnder(c, px) {
    fins(c); c.fillStyle = "#252e34"; c.fill();
    sector(c, R.osOut, R.house, 0, TAU); c.fillStyle = "#2b353b"; c.fill();
    c.strokeStyle = "rgba(140,155,160,.35)"; c.lineWidth = 1.2 * px; c.beginPath(); c.arc(0, 0, R.house, 0, TAU); c.stroke();
    for (var i = 0; i < 8; i++) {
      var b = pol(181, i * TAU / 8 + TAU / 16);
      c.beginPath(); c.arc(b[0], b[1], 3.2, 0, TAU); c.fillStyle = "#12181c"; c.fill(); c.stroke();
    }
    sector(c, R.osIn, R.osOut, 0, TAU); c.fillStyle = "#3a464e"; c.fill();
    sector(c, R.isIn, R.isOut, 0, TAU); c.fillStyle = "#3a464e"; c.fill();
  }
  function paintOver(c, px) {
    for (var i = 0; i < NS; i++) slot(c, TOP + i * TAU / NS, i, px);
    c.strokeStyle = "rgba(170,180,182,.45)"; c.lineWidth = px; c.beginPath(); c.arc(0, 0, R.osOut, 0, TAU); c.stroke();
    for (var j = 0; j < NIS; j++) {
      var a = j * TAU / NIS, hb = 4 / R.isSlotIn, ht = 6.5 / 73;
      poly(c, [pol(R.isSlotIn, a - hb), pol(73, a - ht), pol(75, a - 1.2 / 75), pol(R.isOut + 0.2, a - 1.2 / 77), pol(R.isOut + 0.2, a + 1.2 / 77), pol(75, a + 1.2 / 75), pol(73, a + ht), pol(R.isSlotIn, a + hb)]);
      c.fillStyle = "#141b1f"; c.fill();
      for (var rr = 53; rr < 72; rr += 3.4) {
        var n = rr > 62 ? 3 : 2;
        for (var s = 0; s < n; s++) {
          var p = pol(rr, a + (s - (n - 1) / 2) * 0.05);
          c.beginPath(); c.arc(p[0], p[1], 1.2, 0, TAU); c.fillStyle = PHASE[j % 3]; c.fill();
        }
      }
    }
    c.beginPath(); c.arc(0, 0, R.isIn, 0, TAU); c.fillStyle = "#161d21"; c.fill();
    c.beginPath(); c.arc(0, 0, R.shaft, 0, TAU); c.fillStyle = "#2c363c"; c.fill();
    c.strokeStyle = "rgba(170,180,182,.4)"; c.lineWidth = px; c.stroke();
    c.save(); c.beginPath(); c.arc(0, 0, R.shaft, 0, TAU); c.clip();
    c.strokeStyle = "rgba(170,180,182,.18)";
    for (var k = -30; k < 30; k += 4) { c.beginPath(); c.moveTo(k - 30, -30); c.lineTo(k + 30, 30); c.stroke(); }
    c.restore();
    c.strokeStyle = "rgba(208,134,74,.55)"; c.setLineDash([6 * px, 4 * px]);
    c.beginPath(); c.moveTo(-34, 0); c.lineTo(34, 0); c.moveTo(0, -34); c.lineTo(0, 34); c.stroke(); c.setLineDash([]);
  }

  /* rotating part: rotor iron, 12 alternating N/S magnets, flux-barrier windings */
  function paintRotor(c, rot, field, tint) {
    c.save(); c.rotate(rot);
    for (var i = 0; i < NR; i++) {
      var a1 = i * TAU / NR, a2 = a1 + TAU / NR, am = (a1 + a2) / 2;
      var s = 0.5 + 0.5 * Math.cos(2 * (am + rot - field));
      sector(c, R.rotIn, R.rotOut, a1 - 0.002, a2 + 0.002);
      c.fillStyle = ironCol(tint + 0.18 + 0.8 * s * 0.6, 0.55); c.fill();
    }
    for (var m = 0; m < NPM; m++) {
      var a = m * TAU / NPM, h = 0.78 * TAU / NPM / 2;
      sector(c, R.pmIn, R.rotOut - 0.4, a - h, a + h);
      c.fillStyle = m % 2 ? "#3f6280" : "#a4483a"; c.fill();
    }
    for (var f = 0; f < NFS; f++) {
      var fa = (f + 0.5) * TAU / NFS, hh = 0.16;
      sector(c, 86, 105, fa - hh * 0.55, fa + hh * 0.55); c.fillStyle = "#141b1f"; c.fill();
      for (var rr = 89; rr < 104; rr += 3.6) for (var q = -1; q <= 1; q++) {
        var p = pol(rr, fa + q * 0.045);
        c.beginPath(); c.arc(p[0], p[1], 1.25, 0, TAU); c.fillStyle = f % 2 ? "#b8a06a" : "#d0864a"; c.fill();
      }
    }
    c.restore();
  }

  /* flux density painted onto the stator iron; the pattern follows the field */
  function paintFlux(c, field, tint) {
    for (var i = 0; i < NS; i++) {
      var a1 = TOP + (i - 0.5) * TAU / NS, a2 = a1 + TAU / NS, am = (a1 + a2) / 2;
      sector(c, R.osIn, R.osOut, a1 - 0.002, a2 + 0.002);
      c.fillStyle = ironCol(tint + 0.18 + 0.8 * (0.5 + 0.5 * Math.cos(2 * (am - field))) * 0.56, 0.7); c.fill();
    }
    for (var j = 0; j < NIS * 2; j++) {
      var b1 = j * TAU / (NIS * 2), b2 = b1 + TAU / (NIS * 2), bm = (b1 + b2) / 2;
      sector(c, R.isIn, R.isOut, b1 - 0.002, b2 + 0.002);
      c.fillStyle = ironCol(tint + 0.18 + 0.8 * (0.5 + 0.5 * Math.cos(2 * (bm - field))) * 0.55, 0.6); c.fill();
    }
  }

  function Machine(cv) {
    var self = this;
    this.cv = cv; this.ctx = cv.getContext("2d");
    var seed = parseInt(cv.getAttribute("data-seed"), 10) || 0;
    this.offset = (seed * 0.37) % TAU;          // starting rotor angle
    this.tint = ((seed % 5) - 2) * 0.03;         // shifts the flux colours a little
    this.dir = seed % 2 ? -1 : 1;
    this.visible = false; this.raf = 0; this.t0 = performance.now(); this.w = 0; this.dpr = 1;
    this.under = document.createElement("canvas"); this.over = document.createElement("canvas");
    this.size();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        self.visible = es[es.length - 1].isIntersecting; self.kick();
      }).observe(cv);
    } else { this.visible = true; }
    if ("ResizeObserver" in window) new ResizeObserver(function () { self.size(); }).observe(cv);
    else window.addEventListener("resize", function () { self.size(); });
    if (reduce.addEventListener) reduce.addEventListener("change", function () { self.kick(); });
    this.kick();
  }
  Machine.prototype.size = function () {
    var box = this.cv.getBoundingClientRect();
    var w = Math.round(box.width);
    if (!w) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (w === this.w && dpr === this.dpr) return;
    this.w = w; this.dpr = dpr;
    var px = Math.round(w * dpr);
    this.cv.width = px; this.cv.height = px;
    this.S = px / 2 / (R.fin + 4);
    var self = this;
    [["under", paintUnder], ["over", paintOver]].forEach(function (l) {
      var c = self[l[0]]; c.width = px; c.height = px;
      var g = c.getContext("2d");
      g.translate(px / 2, px / 2); g.scale(self.S, self.S);
      l[1](g, 1 / self.S);
    });
    this.draw(performance.now());
  };
  Machine.prototype.draw = function (now) {
    var cv = this.cv, c = this.ctx, px = cv.width;
    if (!px) return;
    var still = reduce.matches;
    var rot = this.offset + (still ? 0 : this.dir * ((now - this.t0) / 1000 * 0.1 + (window.scrollY || 0) * 0.0011));
    var field = rot * 1.0;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, px, px);
    c.drawImage(this.under, 0, 0);
    c.translate(px / 2, px / 2); c.scale(this.S, this.S);
    paintFlux(c, field, this.tint);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(this.over, 0, 0);
    c.translate(px / 2, px / 2); c.scale(this.S, this.S);
    paintRotor(c, rot, field, this.tint);
  };
  Machine.prototype.kick = function () {
    var self = this;
    cancelAnimationFrame(this.raf); this.raf = 0;
    if (!this.visible) return;
    if (reduce.matches) { this.draw(this.t0); return; }
    (function loop(now) {
      self.draw(now);
      self.raf = requestAnimationFrame(loop);
    })(performance.now());
  };

  for (var i = 0; i < canvases.length; i++) new Machine(canvases[i]);
})();
