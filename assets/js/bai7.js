/* ==========================================================
   bai7.js — các hình vẽ và phần tương tác của Bài 7
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const tf = (v, d = 4, trim = false) => X.tfmt(v, d, trim);

  /* số ngẫu nhiên có hạt giống */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const gauss = r => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const svgBox = (host, W, H, maxW) => X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: `width:100%;height:auto;display:block;max-width:${maxW || W}px;margin:0 auto` }, host);
  const txt = (svg, x, y, s, attrs = {}) => { const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg); e.textContent = s; return e; };
  const math = el => { if (window.renderMath) window.renderMath(el); };
  const RED = { fill: "var(--s8)", "fill-opacity": .42 };
  const COL = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s7)"];
  /* nút chọn (seg): gọi cb(h) khi bấm */
  const seg = (id, cb) => {
    const box = $(id);
    box.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      [...box.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
      cb(+b.dataset.h);
    });
  };
  /* tổng bình phương của một bộ nhóm */
  const anova = groups => {
    const all = groups.flat(), N = all.length, k = groups.length;
    const gm = all.reduce((a, b) => a + b, 0) / N;
    const means = groups.map(g => g.reduce((a, b) => a + b, 0) / g.length);
    const ssb = groups.reduce((s, g, i) => s + g.length * (means[i] - gm) ** 2, 0);
    const ssw = groups.reduce((s, g, i) => s + g.reduce((t, x) => t + (x - means[i]) ** 2, 0), 0);
    const msb = ssb / (k - 1), msw = ssw / (N - k);
    return { N, k, gm, means, ssb, ssw, msb, msw, F: msb / msw };
  };
  /* hàng có trong Phụ lục 6 */
  const ROWS6 = new Set([...Array(30)].map((_, i) => i + 1).concat([40, 60, 120]));

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm7")) X.mindmap($("mm7"), {
    t: "Bài 7<br>ANOVA",
    c: [
      { t: "Ý tưởng", c: [{ t: "So $k\\ge3$ trung bình bằng một phép kiểm" }, { t: "Nhiều phép $T$ → lạm phát $\\alpha$" }, { t: "$SS=SSB+SSW$" }] },
      { t: "Giả thuyết, điều kiện", c: [{ t: "$H_0$: $\\mu_1=\\dots=\\mu_k$" }, { t: "$H$: có ít nhất hai $\\mu_i$ khác nhau" }, { t: "Độc lập · chuẩn · cùng $\\sigma^2$" }] },
      { t: "Tính toán", c: [{ t: "$SSB=\\sum n_i(\\overline x_i-\\overline x)^2$" }, { t: "$SSW=\\sum(n_i-1)s_i^2$" }, { t: "$MSB=\\frac{SSB}{k-1}$, $MSW=\\frac{SSW}{N-k}$" }] },
      { t: "Kết luận", c: [{ t: "$F=\\frac{MSB}{MSW}$ (luôn $MSB$ trên tử)" }, { t: "$C=F_{1-\\alpha}(k-1;\\,N-k)$, Phụ lục 6" }, { t: "$F&gt;C$ → bác bỏ $H_0$" }] },
      { t: "Nối bài cũ", c: [{ t: "$k=2$: $F=T^2$" }, { t: "$MSW$ = phương sai gộp" }, { t: "Không chuẩn → Kruskal–Wallis" }] },
      { t: "Hai yếu tố", c: [{ t: "$F_A$, $F_B$ chung mẫu số $MSW$" }, { t: "Ngẫu nhiên: $(h-1)(c-1)$ bậc tự do" }, { t: "Cùng người ↔ ghép cặp" }] },
      { t: "Bài ngược", c: [{ t: "Điền bảng ANOVA thiếu ô" }, { t: "Tìm $\\overline x_i$, $n_i$ (hệ hai ẩn)" }, { t: "Cỡ nhóm tối thiểu: $F=n\\left(\\frac ds\\right)^2$" }] }
    ]
  }, { colW: 250 });

  /* ---------------- 1.2 LẠM PHÁT α: MÔ PHỎNG ---------------- */
  if ($("inflWidget")) {
    const n = 10, REPS = 2000;
    let k = 3, run = 0;
    const sims = {};
    const simulate = (kk, r) => {
      const tc = X.tInv(0.975, 2 * n - 2), Fc = X.fInv(0.95, kk - 1, kk * (n - 1));
      let pairHit = 0, anovaHit = 0;
      for (let rep = 0; rep < REPS; rep++) {
        const g = [];
        for (let i = 0; i < kk; i++) { const a = []; for (let j = 0; j < n; j++) a.push(gauss(r)); g.push(a); }
        const res = anova(g);
        if (res.F > Fc) anovaHit++;
        const v = g.map((a, i) => a.reduce((s, x) => s + (x - res.means[i]) ** 2, 0) / (n - 1));
        let hit = false;
        for (let i = 0; i < kk && !hit; i++) for (let j = i + 1; j < kk; j++) {
          const sp2 = (v[i] + v[j]) / 2, T = (res.means[i] - res.means[j]) / Math.sqrt(sp2 * 2 / n);
          if (Math.abs(T) > tc) { hit = true; break; }
        }
        if (hit) pairHit++;
      }
      return { pair: pairHit / REPS, anova: anovaHit / REPS };
    };
    const render = () => {
      const key = k + "-" + run;
      if (!sims[key]) sims[key] = simulate(k, rng(7919 * k + 104729 * run + 17));
      const host = $("inflPlot");
      const c = X.chart(host, { height: 250, xmin: 1.5, xmax: 8.5, ymin: 0, ymax: 0.85, margin: { left: 46 } });
      c.axes({ xticks: [2, 3, 4, 5, 6, 7, 8], yticks: [0, 0.2, 0.4, 0.6, 0.8], yfmt: v => Math.round(v * 100) + "%", xlabel: "số nhóm k" });
      const data = [];
      for (let kk = 2; kk <= 8; kk++) data.push({ x: kk, y: 1 - Math.pow(0.95, kk * (kk - 1) / 2), fill: kk === k ? "var(--s1)" : "var(--border)" });
      c.bars(data, { maxW: 34 });
      c.hline(0.05, { stroke: "var(--s8)" });
      c.text(8.45, 0.075, "5%", { "text-anchor": "end", style: "fill:var(--s8);font-size:12px;font-weight:700" });
      Object.keys(sims).forEach(kk => {
        const [kv, rv] = kk.split("-").map(Number); if (rv !== run) return;
        c.dot(kv, sims[kk].pair, { fill: "var(--s2)", r: 6 });
        c.dot(kv, sims[kk].anova, { fill: "var(--s7)", r: 6 });
      });
      const m = k * (k - 1) / 2, s = sims[key];
      $("inflRead").innerHTML = `<div class="row"><span class="kv">$k=${k}$ nhóm → $m=C_{${k}}^2=${m}$ cặp</span><span class="kv">công thức: $1-0{,}95^{${m}}\\approx${tf(100 * (1 - Math.pow(0.95, m)), 1)}\\%$</span></div>` +
        `<div class="row"><span class="kv"><b style="color:var(--s2)">●</b> nhiều phép $T$ báo nhầm: <b>${f(100 * s.pair, 1)}%</b> số nghiên cứu</span><span class="kv"><b style="color:var(--s7)">●</b> một phép ANOVA: <b>${f(100 * s.anova, 1)}%</b></span></div>`;
      math($("inflRead"));
    };
    seg("inflRun", h => { if (h === 2) run++; else run = 0; render(); });
    X.bind(["inflK"], v => { k = v.inflK; render(); }, { inflK: v => String(v) });
    X.responsive($("inflPlot"), render);
  }

  /* ---------------- HÌNH 1.1: BA ĐIỀU KIỆN ---------------- */
  if ($("condFig")) X.responsive($("condFig"), () => {
    const host = $("condFig"); host.innerHTML = "";
    const one = host.clientWidth < 560;
    const PW = 320, PH = 190;
    const svg = one ? svgBox(host, PW, PH * 3, 420) : svgBox(host, PW * 3, PH, 980);
    const norm = (m, s) => x => Math.exp(-0.5 * ((x - m) / s) ** 2) / s;
    const skew = x => x <= 3.6 ? 0 : (x - 3.6) * Math.exp(-(x - 3.6) / 0.75) / 0.75 * 1.35;
    const panels = [
      { t: "① Đạt cả ba điều kiện", g: [norm(3, 0.8), norm(5, 0.8), norm(7, 0.8)] },
      { t: "② Nhóm cam lệch phải", g: [norm(3, 0.8), skew, norm(7, 0.8)] },
      { t: "③ Nhóm ngọc rộng gấp ba", g: [norm(3, 0.8), norm(5, 0.8), norm(7, 2.4)] }
    ];
    panels.forEach((p, i) => {
      const ox = one ? 0 : i * PW, oy = one ? i * PH : 0;
      const x0 = ox + 18, x1 = ox + PW - 18, yb = oy + PH - 22, top = oy + 50;
      const sx = v => x0 + v / 10 * (x1 - x0);
      txt(svg, ox + PW / 2, oy + 28, p.t, { class: "svg-strong", style: "font-size:20px" });
      X.el("line", { x1: x0, x2: x1, y1: yb, y2: yb, stroke: "var(--text-2)", "stroke-width": 1.5 }, svg);
      p.g.forEach((fn, j) => {
        let d = "";
        for (let q = 0; q <= 200; q++) { const v = q / 20, y = yb - Math.min(1.35, fn(v)) / 1.35 * (yb - top); d += (q ? "L" : "M") + sx(v).toFixed(1) + "," + y.toFixed(1); }
        X.el("path", { d, fill: "none", stroke: COL[j], "stroke-width": 3 }, svg);
      });
    });
  });

  /* nhãn “x̄ = …” với gạch trên thật (dấu ̄ ghép của phông chữ hay bị lệch) */
  const xbar = (svg, x, y, rest, attrs = {}) => {
    const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg);
    const a = X.el("tspan", { style: "text-decoration:overline" }, e); a.textContent = "x";
    const b = X.el("tspan", {}, e); b.textContent = rest;
    return e;
  };

  /* ---------------- BIỂU ĐỒ CHẤM DÙNG CHUNG ---------------- */
  /* groups: [[...]], names, ymin, ymax, ticks; trả về {svg, sy, cx} */
  function dotPlot(host, o) {
    host.innerHTML = "";
    const W = o.W || 500, H = o.H || 410, L = 66, R = o.R || 20, T = 44, B = 70;
    const svg = svgBox(host, W, H, o.maxW || 600);
    const sy = v => H - B - (v - o.ymin) / (o.ymax - o.ymin) * (H - B - T);
    const k = o.groups.length, cx = i => L + (i + 0.5) * (W - L - R) / k;
    o.ticks.forEach(v => {
      X.el("line", { x1: L, x2: W - R, y1: sy(v), y2: sy(v), class: "gridline" }, svg);
      txt(svg, L - 10, sy(v) + 8, X.fmt(v, 1, true), { "text-anchor": "end", style: "font-size:22px" });
    });
    if (o.unit) txt(svg, 4, 20, o.unit, { "text-anchor": "start", style: "font-size:21px" });
    const all = o.groups.flat(), gm = all.reduce((a, b) => a + b, 0) / all.length;
    X.el("line", { x1: L, x2: W - R, y1: sy(gm), y2: sy(gm), stroke: "var(--text-2)", "stroke-width": 2, "stroke-dasharray": "7 6" }, svg);
    o.groups.forEach((g, i) => {
      const m = g.reduce((a, b) => a + b, 0) / g.length, col = COL[i % 4];
      X.el("line", { x1: cx(i) - 44, x2: cx(i) + 44, y1: sy(m), y2: sy(m), stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, svg);
      g.forEach((v, j) => X.el("circle", { cx: cx(i) + (o.jit ? o.jit[j % o.jit.length] : 0), cy: sy(v), r: 9, fill: col, "fill-opacity": .85, stroke: "var(--surface)", "stroke-width": 1.5 }, svg));
      txt(svg, cx(i), H - B + 32, o.names[i], { class: "svg-strong", style: "font-size:23px" });
      xbar(svg, cx(i), H - B + 60, " = " + X.fmt(m, 2, true), { style: "font-size:21px;fill:" + col });
    });
    return { svg, sy, cx, gm, W, R, L };
  }

  /* ---------------- HÌNH 2.1: TÁCH ĐỘ LỆCH ---------------- */
  if ($("splitFig")) {
    const host = $("splitFig");
    const p = dotPlot(host, { groups: [[4, 5, 6], [7, 8, 9], [9, 11, 13]], names: ["P", "I", "K"], ymin: 3, ymax: 14, ticks: [4, 6, 8, 10, 12, 14], unit: "giờ", W: 540, R: 130 });
    const { svg, sy, cx } = p;
    const xK = cx(2);
    X.el("circle", { cx: xK, cy: sy(13), r: 14, fill: "none", stroke: "var(--s7)", "stroke-width": 3 }, svg);
    const arrow = (x, y1, y2, col) => {
      X.el("line", { x1: x, x2: x, y1: sy(y1), y2: sy(y2) + 10, stroke: col, "stroke-width": 4.5 }, svg);
      X.el("path", { d: `M${x - 9},${sy(y2) + 13} L${x},${sy(y2)} L${x + 9},${sy(y2) + 13} Z`, fill: col }, svg);
    };
    const ax = xK + 62;
    arrow(ax, 8, 11, "var(--s2)");
    arrow(ax, 11, 13, "var(--s3)");
    X.el("line", { x1: xK + 44, x2: ax, y1: sy(11), y2: sy(11), stroke: "var(--s3)", "stroke-width": 1.5, "stroke-dasharray": "3 4" }, svg);
    X.el("line", { x1: xK + 14, x2: ax, y1: sy(13), y2: sy(13), stroke: "var(--s7)", "stroke-width": 1.5, "stroke-dasharray": "3 4" }, svg);
    txt(svg, ax + 12, sy(9.5) + 8, "giữa: 3", { "text-anchor": "start", class: "svg-strong", style: "font-size:22px;fill:var(--s2)" });
    txt(svg, ax + 12, sy(12) + 8, "trong: 2", { "text-anchor": "start", class: "svg-strong", style: "font-size:22px;fill:var(--s3)" });
    xbar(svg, p.L + 6, sy(8) - 10, " = 8", { "text-anchor": "start", style: "font-size:21px" });
  }

  /* ---------------- 2.4 WIDGET: SSB VÀ SSW ---------------- */
  if ($("ssWidget")) {
    const DEV = [[-1.6, -0.7, 0.1, 0.8, 1.4], [-1.2, -0.9, 0.3, 0.6, 1.2], [-1.5, -0.3, -0.2, 0.7, 1.3]];
    const JIT = [-18, 12, -6, 18, -12];
    let d = 1.5, s = 1;
    const Fc = X.fInv(0.95, 2, 12);
    const render = () => {
      const host = $("ssPlot"); host.innerHTML = "";
      const groups = DEV.map((g, i) => g.map(e => 10 + (i - 1) * d + s * e));
      const W = 560, H = 400, L = 50, R = 16, T = 18, PB = 280;
      const svg = svgBox(host, W, H, 640);
      const sy = v => PB - (v - 0) / 20 * (PB - T);
      [0, 5, 10, 15, 20].forEach(v => { X.el("line", { x1: L, x2: W - R, y1: sy(v), y2: sy(v), class: "gridline" }, svg); txt(svg, L - 10, sy(v) + 7, String(v), { "text-anchor": "end", style: "font-size:22px" }); });
      const res = anova(groups);
      X.el("line", { x1: L, x2: W - R, y1: sy(res.gm), y2: sy(res.gm), stroke: "var(--text-2)", "stroke-width": 2, "stroke-dasharray": "7 6" }, svg);
      const cx = i => L + (i + 0.5) * (W - L - R) / 3;
      groups.forEach((g, i) => {
        X.el("line", { x1: cx(i) - 44, x2: cx(i) + 44, y1: sy(res.means[i]), y2: sy(res.means[i]), stroke: COL[i], "stroke-width": 4.5, "stroke-linecap": "round" }, svg);
        g.forEach((v, j) => X.el("circle", { cx: cx(i) + JIT[j], cy: sy(Math.max(-0.5, Math.min(20.5, v))), r: 8.5, fill: COL[i], "fill-opacity": .85, stroke: "var(--surface)", "stroke-width": 1.5 }, svg));
      });
      /* thanh chia SS */
      const bx = L, bw = W - L - R, by = 318, bh = 34, ss = res.ssb + res.ssw, pB = ss > 0 ? res.ssb / ss : 0;
      X.el("rect", { x: bx, y: by, width: bw * pB, height: bh, fill: "var(--s2)", "fill-opacity": .8 }, svg);
      X.el("rect", { x: bx + bw * pB, y: by, width: bw * (1 - pB), height: bh, fill: "var(--s3)", "fill-opacity": .8 }, svg);
      txt(svg, bx, by + bh + 32, `SSB = ${f(res.ssb, 1)} (${Math.round(100 * pB)}%)`, { "text-anchor": "start", class: "svg-strong", style: "font-size:22px;fill:var(--s2)" });
      txt(svg, bx + bw, by + bh + 32, `SSW = ${f(res.ssw, 1)}`, { "text-anchor": "end", class: "svg-strong", style: "font-size:22px;fill:var(--s3)" });
      const rej = res.F > Fc;
      $("ssRead").innerHTML = `<div class="row"><span class="kv">$SS=${tf(ss, 2)}=${tf(res.ssb, 2)}+${tf(res.ssw, 2)}$</span><span class="kv">$MSB=${tf(res.msb, 2)}$; $MSW=${tf(res.msw, 3)}$</span></div>` +
        `<div class="row"><span class="kv">$F=${tf(res.F, 2)}$ so với $C=F_{0{,}95}(2;12)=3{,}89$ → <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$" : "chưa đủ cơ sở bác bỏ"}</b></span></div>`;
      math($("ssRead"));
    };
    X.bind(["ssD", "ssS"], v => { d = v.ssD; s = v.ssS; render(); }, { ssD: v => X.fmt(v, 1, true), ssS: v => X.fmt(v, 1, true) });
  }

  /* ---------------- 3.3 WIDGET: PHÂN PHỐI FISHER ---------------- */
  if ($("fWidget")) {
    let a = 0.05, k = 3, n = 3, Fo = 13.5;
    const render = () => {
      const d1 = k - 1, d2 = k * (n - 1), C = X.fInv(1 - a, d1, d2);
      const xmax = Math.min(16, Math.max(5, C * 1.7, Fo + 0.8));
      let top = 0; for (let i = 1; i <= 300; i++) { const x = 0.06 + xmax * i / 300; top = Math.max(top, X.fPdf(x, d1, d2)); }
      top = Math.min(top, 1.2);
      const c = X.chart($("fPlot"), { height: 240, xmin: 0, xmax, ymin: 0, ymax: top * 1.3 });
      c.axes({ noy: true, nogrid: true, xticks: X.niceTicks(0, xmax, 6) });
      c.area(x => X.fPdf(x, d1, d2), C, xmax, RED);
      c.curve(x => X.fPdf(x, d1, d2), xmax / 600, xmax);
      c.vline(C, { stroke: "var(--s8)" }, 0, top * 1.1);
      c.text(C, top * 1.16, "C = " + f(C, 2), { "text-anchor": "start", dx: 3, style: "fill:var(--s8);font-size:12px" });
      const fx = Math.min(Fo, xmax * 0.995);
      c.vline(fx, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, top * 0.8);
      c.text(fx, top * 0.86, "F = " + f(Fo, 2), { "text-anchor": Fo > xmax * 0.7 ? "end" : "start", dx: Fo > xmax * 0.7 ? -3 : 3, class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
      const lv = a === 0.05 ? "0{,}95" : a === 0.025 ? "0{,}975" : "0{,}99";
      const rej = Fo > C;
      const note = ROWS6.has(d2) ? "" : ` <span class="small muted">(hàng ${d2} không có trong Phụ lục 6 — kẹp giữa hai hàng kề)</span>`;
      $("fRead").innerHTML = `<div class="row"><span class="kv">$N=${k * n}$; bậc tự do $(k-1;\\ N-k)=(${d1};\\ ${d2})$</span><span class="kv">$C=F_{${lv}}(${d1};\\ ${d2})\\approx${tf(C, 2)}$${note}</span></div>` +
        `<div class="row"><span class="kv">$F=${tf(Fo, 2)}$ → <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$" : "chưa đủ cơ sở bác bỏ $H_0$"}</b></span></div>`;
      math($("fRead"));
    };
    seg("fAlpha", h => { a = h / 100; render(); });
    X.bind(["fK", "fN", "fObs"], v => { k = v.fK; n = v.fN; Fo = v.fObs; render(); }, { fK: v => String(v), fN: v => String(v), fObs: v => X.fmt(v, 2, true) });
    X.responsive($("fPlot"), render);
  }

  /* ---------------- HÌNH 4.1: ĐỘ BỀN DÁN ---------------- */
  if ($("bondFig")) dotPlot($("bondFig"), {
    groups: [[23.4, 26.8, 24.6, 25.9, 23.8, 26.1], [20.9, 23.8, 22.1, 24.0, 21.2], [22.6, 25.7, 23.9, 24.8, 22.9, 25.4, 24.1]],
    names: ["R", "S", "U"], ymin: 20, ymax: 27.5, ticks: [20, 22, 24, 26], unit: "MPa", jit: [-14, 14, -6, 6, -20, 20, 0]
  });

  /* ---------------- 7.4 WIDGET: F = n(d/s)² ---------------- */
  if ($("scaleWidget")) {
    let n = 10, d = 1.2, s = 2;
    const crit = m => X.fInv(0.95, 2, 3 * m - 3);
    const render = () => {
      const r2 = (d / s) ** 2, F = n * r2, C = crit(n);
      let nmin = null;
      if (r2 > 0) for (let m = 2; m <= 400; m++) if (m * r2 > crit(m)) { nmin = m; break; }
      const ymax = 12;
      const c = X.chart($("scPlot"), { height: 250, xmin: 2, xmax: 40, ymin: 0, ymax });
      c.axes({ xticks: [2, 10, 20, 30, 40], yticks: [0, 3, 6, 9, 12], xlabel: "cỡ mỗi nhóm n" });
      c.curve(m => crit(m), 2, 40, { stroke: "var(--s8)", "stroke-width": 2.4 });
      const nEnd = r2 > 0 ? Math.min(40, ymax / r2) : 40;
      c.curve(m => m * r2, 2, nEnd, { stroke: "var(--s7)", "stroke-width": 2.6 });
      if (nmin && nmin <= 40) { c.vline(nmin, { stroke: "var(--s3)", "stroke-width": 1.6 }, 0, ymax * 0.92); c.text(nmin, ymax * 0.95, "n = " + nmin, { class: "svg-strong", style: "fill:var(--s3);font-size:12.5px" }); }
      c.dot(n, Math.min(F, ymax), { fill: "var(--s7)", r: 6 });
      c.text(39.5, crit(40) + 0.6, "C", { "text-anchor": "end", style: "fill:var(--s8);font-size:13px;font-weight:700" });
      const rej = F > C;
      $("scRead").innerHTML = `<div class="row"><span class="kv">$F=n\\left(\\frac ds\\right)^2=${n}\\cdot${tf(r2, 4, true)}=${tf(F, 3, true)}$</span><span class="kv">$C=F_{0{,}95}(2;\\ ${3 * n - 3})\\approx${tf(C, 2)}$ → <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$" : "chưa bác bỏ"}</b></span></div>` +
        `<div class="row"><span class="kv">cỡ nhóm nhỏ nhất để bác bỏ: <b>${nmin ? (nmin > 40 ? nmin + " (ngoài hình)" : nmin) : "không có (các trung bình trùng nhau)"}</b></span></div>`;
      math($("scRead"));
    };
    X.bind(["scN", "scD", "scS"], v => { n = v.scN; d = v.scD; s = v.scS; render(); }, { scN: v => String(v), scD: v => X.fmt(v, 1, true), scS: v => X.fmt(v, 1, true) });
    X.responsive($("scPlot"), render);
  }

  /* ---------------- HÌNH 8.1: HAI YẾU TỐ ---------------- */
  if ($("twoFig")) X.responsive($("twoFig"), () => {
    const M = [[1.5, 1.3, 1.9, 1.9, 2.9], [1.1, 2.1, 1.7, 2.7, 2.9], [1.5, 1.5, 2.5, 3.1, 2.9], [1.7, 2.5, 2.9, 2.9, 3.5]];
    const NAME = ["C", "T", "F", "M"];
    const c = X.chart($("twoFig"), { height: 270, xmin: 0.7, xmax: 5.3, ymin: 0.8, ymax: 3.9, margin: { top: 34 } });
    c.axes({ xticks: [1, 2, 3, 4, 5], yticks: [1, 1.5, 2, 2.5, 3, 3.5], yfmt: v => X.fmt(v, 1), xfmt: v => "người " + v });
    M.forEach((row, i) => {
      const d = row.map((v, j) => (j ? "L" : "M") + c.x(j + 1).toFixed(1) + "," + c.y(v).toFixed(1)).join("");
      X.el("path", { d, fill: "none", stroke: COL[i], "stroke-width": 2.6, "stroke-linejoin": "round" }, c.g);
      row.forEach((v, j) => c.dot(j + 1, v, { fill: COL[i], r: 4.5 }));
    });
    /* chú giải */
    const lg = X.el("g", {}, c.svg);
    NAME.forEach((nm, i) => {
      const x = c.m.left + 8 + i * 58;
      X.el("rect", { x, y: 9, width: 14, height: 14, rx: 3, fill: COL[i] }, lg);
      const t = X.el("text", { x: x + 19, y: 21, class: "svg-text", style: "font-size:13px" }, lg); t.textContent = nm;
    });
  });
});
