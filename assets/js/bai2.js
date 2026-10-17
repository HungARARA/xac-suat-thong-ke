/* ==========================================================
   bai2.js — các hình vẽ và phần tương tác của Bài 2
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const T = s => X.tex(s);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const ft = (v, d = 4) => X.fmt(v, d, true);
  const tf = (v, d = 4, trim = false) => X.tfmt(v, d, trim);
  const soft = c => `color-mix(in srgb, ${c} 40%, var(--surface))`;

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm2")) X.mindmap($("mm2"), {
    t: "Bài 2<br>Phân phối xác suất",
    c: [
      { t: "Biến ngẫu nhiên", c: [{ t: "Rời rạc: bảng $p_i$, $\\sum p_i=1$" }, { t: "Liên tục: mật độ $f(x)$, $\\int f=1$" }] },
      { t: "Tích phân", c: [{ t: "= diện tích dưới đường cong" }, { t: "Nguyên hàm: tăng mũ, chia mũ mới" }, { t: "$\\int_a^b f=F(b)-F(a)$" }] },
      { t: "Hàm phân phối", c: [{ t: "$F(x)=P(X\\lt x)$" }, { t: "Rời rạc: bậc thang" }, { t: "Phân vị: $F(x_\\alpha)=\\alpha$" }] },
      { t: "Đặc trưng số", c: [{ t: "$E(X)$: điểm cân bằng" }, { t: "$D(X)=E(X^2)-[E(X)]^2$" }, { t: "$E(aX+b)$, $D(aX+b)=a^2D$" }] },
      { t: "Nhị thức", c: [{ t: "$B(n;p)$: $C_n^mp^mq^{n-m}$" }, { t: "$E=np$, $D=npq$" }] },
      { t: "Chuẩn", c: [{ t: "$N(\\mu;\\sigma^2)$ — nhớ khai căn" }, { t: "Chuẩn hoá $z=\\frac{x-\\mu}{\\sigma}$" }, { t: "Tra $\\varphi$, $z_\\alpha$" }, { t: "Xấp xỉ nhị thức ± 0,5" }] },
      { t: "Cho thống kê", c: [{ t: "$\\chi^2(k)$: $E=k$, $D=2k$" }, { t: "Student $T(n)$: đối xứng" }, { t: "Fisher $F(m;n)$" }] }
    ]
  }, { colW: 250 });

  /* ---------------- HÌNH 1.1: Ω → X ---------------- */
  if ($("rvMap")) {
    const host = $("rvMap");
    const W = 560, H = 330;
    const svg = X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: "width:100%;height:auto;display:block;max-width:620px;margin:0 auto" }, host);
    const cols = ["var(--s8)", "var(--s4)", "var(--s1)", "var(--s3)"];
    const outs = [];
    for (let m = 7; m >= 0; m--) { const b = [4, 2, 1].map(x => (m & x) ? 1 : 0); outs.push({ b, k: b.reduce((a, c) => a + c, 0) }); }
    outs.sort((a, b) => b.k - a.k);
    const t = (x, y, s, st = "", anchor = "middle", cls = "svg-strong") => { const e = X.el("text", { x, y, "text-anchor": anchor, class: cls, style: st }, svg); e.textContent = s; return e; };
    t(95, 22, "Không gian mẫu Ω (8 kết quả)", "font-size:13px");
    t(440, 22, "Giá trị của X", "font-size:13px");
    X.el("rect", { x: 20, y: 34, width: 150, height: 286, rx: 12, fill: "var(--surface-2)", stroke: "var(--border-strong)" }, svg);
    const vy = { 3: 70, 2: 145, 1: 225, 0: 295 };
    [0, 1, 2, 3].forEach(k => {
      X.el("circle", { cx: 440, cy: vy[k], r: 20, fill: cols[k], "fill-opacity": .18, stroke: cols[k], "stroke-width": 2 }, svg);
      t(440, vy[k] + 5, String(k), `fill:${cols[k]};font-size:16px`);
      t(470, vy[k] + 5, ["P=0,006", "P=0,092", "P=0,398", "P=0,504"][k], "font-size:12.5px", "start", "svg-text");
    });
    outs.forEach((o, i) => {
      const y = 52 + i * 34;
      t(95, y + 5, o.b.map(v => v ? "✓" : "✗").join("  "), `fill:${cols[o.k]};font-size:15px;letter-spacing:2px`);
      X.el("path", { d: `M172,${y} C300,${y} 300,${vy[o.k]} 418,${vy[o.k]}`, fill: "none", stroke: cols[o.k], "stroke-width": 1.4, opacity: .7 }, svg);
    });
  }

  /* ---------------- BIỂU ĐỒ PMF (Ví dụ 2.1) ---------------- */
  const pmf = [0.006, 0.092, 0.398, 0.504];
  if ($("pmfChart")) X.responsive($("pmfChart"), () => {
    const c = X.chart($("pmfChart"), { height: 220, xmin: -0.7, xmax: 3.7, ymin: 0, ymax: 0.6 });
    c.axes({ xticks: [0, 1, 2, 3], xfmt: v => String(v), yticks: [0, 0.2, 0.4, 0.6] });
    c.bars(pmf.map((v, i) => ({ x: i, y: v, fill: "var(--s1)" })), { maxW: 56 });
    pmf.forEach((v, i) => c.text(i, v, f(v, 3), { dy: -6, class: "svg-strong" }));
    c.hover(xv => { const k = Math.round(xv); if (k < 0 || k > 3) return null; return `P(X = ${k}) = ${f(pmf[k], 3)}`; }, { snap: v => Math.round(v), ty: xv => c.y(pmf[Math.max(0, Math.min(3, Math.round(xv)))]) });
  });

  /* ---------------- RIEMANN ---------------- */
  if ($("riemannWidget")) {
    let n = 4;
    const render = () => {
      const c = X.chart($("riemannPlot"), { height: 260, xmin: 0, xmax: 2.1, ymin: 0, ymax: 4.6 });
      c.axes({ xticks: [0, 0.5, 1, 1.5, 2], yticks: [0, 1, 2, 3, 4] });
      const h = 2 / n; let s = 0;
      for (let i = 0; i < n; i++) {
        const x0 = i * h, yv = x0 * x0; s += yv * h;
        X.el("rect", { x: c.x(x0), y: c.y(yv), width: Math.max(0.5, c.x(x0 + h) - c.x(x0)), height: c.y(0) - c.y(yv), fill: "var(--s2)", "fill-opacity": .35, stroke: "var(--s2)", "stroke-width": n > 40 ? 0.4 : 1 }, c.g);
      }
      c.area(x => x * x, 0, 2, { fill: "var(--s1)", "fill-opacity": .08 });
      c.curve(x => x * x, 0, 2.1, { stroke: "var(--s1)" });
      c.text(1.55, 3.5, "y = x²", { class: "svg-strong", style: "fill:var(--s1)" });
      $("riemannRead").innerHTML = `${n} hình chữ nhật, mỗi hình rộng ${T("\\Delta x=" + tf(h, 4, true))}: tổng diện tích ≈ <b>${f(s, 4)}</b> · diện tích thật ${T("\\tfrac83")} ≈ 2,6667 · còn thiếu <b>${f(8 / 3 - s, 4)}</b>`;
    };
    X.bind(["rn"], v => { n = v.rn; render(); }, { rn: v => String(v) });
    X.responsive($("riemannPlot"), render);
  }

  /* ---------------- HÌNH THANG ---------------- */
  if ($("trapFig")) X.responsive($("trapFig"), () => {
    const c = X.chart($("trapFig"), { height: 230, xmin: 0, xmax: 4, ymin: 0, ymax: 9.5 });
    c.axes({ xticks: [0, 1, 2, 3, 4], yticks: [0, 3, 7], xfmt: v => String(v) });
    c.area(x => 2 * x + 1, 1, 3, { fill: "var(--s3)", "fill-opacity": .3 });
    c.curve(x => 2 * x + 1, 0, 4, { stroke: "var(--s3)" });
    c.vline(1, {}, 0, 3); c.vline(3, {}, 0, 7);
    c.dot(1, 3, { fill: "var(--s3)" }); c.dot(3, 7, { fill: "var(--s3)" });
    c.text(0.72, 3.3, "f(1)=3", { class: "svg-strong" }); c.text(3.1, 7.1, "f(3)=7", { class: "svg-strong", "text-anchor": "start", dy: 16 });
    c.text(2, 2, "diện tích = 10", { class: "svg-strong" });
    c.text(2.6, 8.4, "y = 2x + 1", { class: "svg-text", "text-anchor": "end" });
  });

  /* ---------------- MẬT ĐỘ TÊ MÔI ---------------- */
  const fd = x => (x >= 0 && x <= 3) ? 2 / 9 * x * (3 - x) : 0;
  const Fd = x => x <= 0 ? 0 : x >= 3 ? 1 : x * x / 3 - 2 * x ** 3 / 27;
  if ($("densWidget")) {
    let st = { da: 1, db: 2 };
    const render = () => {
      let a = Math.min(st.da, st.db), b = Math.max(st.da, st.db);
      const c = X.chart($("densPlot"), { height: 250, xmin: -0.4, xmax: 3.4, ymin: 0, ymax: 0.6 });
      c.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.2, 0.4, 0.6], xlabel: "x (giờ)" });
      c.area(fd, a, b, { fill: "var(--s1)", "fill-opacity": .3 });
      c.curve(fd, -0.4, 3.4, { stroke: "var(--s1)" });
      c.vline(a); c.vline(b);
      const P = Fd(b) - Fd(a);
      c.text((a + b) / 2, Math.min(0.2, fd((a + b) / 2) / 2), f(P, 4), { class: "svg-strong" });
      c.hover(xv => `x = ${f(xv, 2)} → f(x) = ${f(fd(xv), 4)}`, { ty: xv => c.y(fd(xv)) });
      $("densRead").innerHTML = `${T(`P(${tf(a, 2, true)}\\lt X\\lt ${tf(b, 2, true)})=F(${tf(b, 2, true)})-F(${tf(a, 2, true)})=${tf(Fd(b))}-${tf(Fd(a))}=${tf(P)}`)}<br><span class="small muted">với ${T("F(x)=\\frac{x^2}{3}-\\frac{2x^3}{27}")} trên ${T("[0;3]")} (xem mục 5).</span>`;
    };
    X.bind(["da", "db"], v => { st = v; render(); }, { da: v => f(v, 2), db: v => f(v, 2) });
    X.responsive($("densPlot"), render);
  }

  /* ---------------- HÀM BẬC THANG ---------------- */
  if ($("stepFig")) X.responsive($("stepFig"), () => {
    const c = X.chart($("stepFig"), { height: 250, xmin: -1, xmax: 4.2, ymin: 0, ymax: 1.1 });
    c.axes({ xticks: [-1, 0, 1, 2, 3, 4], yticks: [0, 0.496, 1], xfmt: v => String(v), yfmt: v => f(v, 3, true), nogrid: true });
    const levels = [[-1, 0, 0], [0, 1, 0.006], [1, 2, 0.098], [2, 3, 0.496], [3, 4.2, 1]];
    levels.forEach(([a, b, v], i) => {
      X.el("line", { x1: c.x(a), x2: c.x(b), y1: c.y(v), y2: c.y(v), stroke: "var(--s1)", "stroke-width": 3 }, c.g);
      if (i > 0) X.el("circle", { cx: c.x(a), cy: c.y(v), r: 5, fill: "var(--surface)", stroke: "var(--s1)", "stroke-width": 2 }, c.g);
      if (i < levels.length - 1) X.el("circle", { cx: c.x(b), cy: c.y(v), r: 5, fill: "var(--s1)" }, c.g);
      if (i > 0 && i < 4) X.el("line", { x1: c.x(a), x2: c.x(a), y1: c.y(levels[i - 1][2]), y2: c.y(v), stroke: "var(--s1)", "stroke-width": 1, "stroke-dasharray": "3 3" }, c.g);
    });
    X.el("line", { x1: c.x(3), x2: c.x(3), y1: c.y(0.496), y2: c.y(1), stroke: "var(--s1)", "stroke-width": 1, "stroke-dasharray": "3 3" }, c.g);
    c.text(0.5, 0.006, "0,006", { dy: -8, class: "svg-text" }); c.text(1.5, 0.098, "0,098", { dy: -8, class: "svg-text" });
    c.text(2.5, 0.496, "0,496", { dy: -8, class: "svg-text" }); c.text(3.6, 1, "1", { dy: -8, class: "svg-text" });
    c.text(2.92, 0.75, "nhảy 0,504 tại x = 3", { class: "svg-text", style: "font-size:12px", "text-anchor": "end" });
  });

  /* ---------------- MẬT ĐỘ ↔ HÀM PHÂN PHỐI ---------------- */
  if ($("cdfWidget")) {
    let x = 1.5;
    const render = () => {
      const c1 = X.chart($("cdfTop"), { height: 190, xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 0.6, margin: { bottom: 30 } });
      c1.axes({ xticks: [0, 1, 2, 3], yticks: [0, 0.25, 0.5], xfmt: v => String(v) });
      c1.area(fd, -0.5, x, { fill: "var(--s2)", "fill-opacity": .35 });
      c1.curve(fd, -0.5, 3.5, { stroke: "var(--s1)" });
      c1.vline(x, { stroke: "var(--s2)" });
      c1.text(-0.2, 0.52, "mật độ f(x)", { "text-anchor": "start", class: "svg-text" });
      const c2 = X.chart($("cdfBot"), { height: 190, xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 1.08, margin: { bottom: 30 } });
      c2.axes({ xticks: [0, 1, 2, 3], yticks: [0, 0.5, 1], xfmt: v => String(v) });
      c2.curve(Fd, -0.5, 3.5, { stroke: "var(--s3)" });
      c2.hline(Fd(x), { stroke: "var(--s2)" });
      c2.vline(x, { stroke: "var(--s2)" }, 0, Fd(x));
      c2.dot(x, Fd(x), { fill: "var(--s2)" });
      c2.text(-0.2, 0.95, "hàm phân phối F(x)", { "text-anchor": "start", class: "svg-text" });
      $("cdfRead").innerHTML = `Diện tích tô ở hình trên = ${T(`F(${tf(x, 2, true)})=${tf(Fd(x))}`)} = độ cao của điểm ở hình dưới.`;
    };
    X.bind(["cx"], v => { x = v.cx; render(); }, { cx: v => f(v, 2) });
    X.responsive($("cdfTop"), render);
  }

  /* ---------------- PHÂN VỊ ---------------- */
  if ($("qWidget")) {
    let a = 0.5; const fq = x => (x >= 0 && x <= 2) ? x / 2 : 0;
    const render = () => {
      const xa = 2 * Math.sqrt(a);
      const c = X.chart($("qPlot"), { height: 220, xmin: -0.3, xmax: 2.4, ymin: 0, ymax: 1.15 });
      c.axes({ xticks: [0, 0.5, 1, 1.5, 2], yticks: [0, 0.5, 1] });
      c.area(fq, 0, xa, { fill: "var(--s7)", "fill-opacity": .3 });
      c.curve(fq, -0.3, 2.4, { stroke: "var(--s7)" });
      c.vline(xa, { stroke: "var(--s7)" });
      c.text(xa * 0.66, fq(xa * 0.66) / 3, "diện tích α", { class: "svg-strong" });
      $("qRead").innerHTML = `${T(`\\frac{x_\\alpha^2}{4}=${tf(a, 2, true)}\\Rightarrow x_{${tf(a, 2, true)}}=2\\sqrt{${tf(a, 2, true)}}\\approx ${tf(xa)}`)}`;
    };
    X.bind(["qa"], v => { a = v.qa; render(); }, { qa: v => f(v, 2) });
    X.responsive($("qPlot"), render);
  }

  /* ---------------- ĐIỂM CÂN BẰNG ---------------- */
  if ($("balanceFig")) X.responsive($("balanceFig"), () => {
    const c = X.chart($("balanceFig"), { height: 250, xmin: -0.7, xmax: 3.7, ymin: -0.2, ymax: 0.6, margin: { bottom: 30 } });
    c.axes({ xticks: [0, 1, 2, 3], yticks: [0, 0.2, 0.4], xfmt: v => String(v) });
    X.el("rect", { x: c.x(-0.6), y: c.y(0) - 2, width: c.x(3.6) - c.x(-0.6), height: 5, rx: 2, fill: "var(--text-2)" }, c.g);
    c.bars(pmf.map((v, i) => ({ x: i, y: v, fill: "var(--s1)" })), { maxW: 46 });
    const ex = 2.4, tri = 18;
    X.el("path", { d: `M${c.x(ex)},${c.y(0) + 4} l${-tri / 1.2},${tri * 1.5} h${tri * 1.66}Z`, fill: "var(--s2)" }, c.g);
    c.text(ex, -0.19, "E(X) = 2,4", { class: "svg-strong", style: "fill:var(--s2)" });
  });

  /* ---------------- ĐỘ PHÂN TÁN ---------------- */
  if ($("spreadWidget")) {
    const presets = [
      { b: "Ít phân tán", p: [0, 0.1, 0.8, 0.1, 0] },
      { b: "Vừa", p: [0.05, 0.2, 0.5, 0.2, 0.05] },
      { b: "Phân tán nhiều", p: [0.3, 0.1, 0.2, 0.1, 0.3] }
    ];
    let cur = 1;
    const seg = $("spreadBtns");
    presets.forEach((pr, i) => { const b = document.createElement("button"); b.textContent = pr.b; b.onclick = () => { cur = i; render(); }; seg.appendChild(b); });
    const render = () => {
      [...seg.children].forEach((b, j) => b.classList.toggle("on", j === cur));
      const p = presets[cur].p; const E = p.reduce((a, v, i) => a + i * v, 0); const E2 = p.reduce((a, v, i) => a + i * i * v, 0);
      const D = E2 - E * E, s = Math.sqrt(D);
      const c = X.chart($("spreadPlot"), { height: 240, xmin: -0.7, xmax: 4.7, ymin: 0, ymax: 0.98 });
      c.axes({ xticks: [0, 1, 2, 3, 4], yticks: [0, 0.4, 0.8], xfmt: v => String(v) });
      X.el("rect", { x: c.x(E - s), y: c.y(0.9), width: c.x(E + s) - c.x(E - s), height: c.y(0) - c.y(0.9), fill: "var(--s2)", "fill-opacity": .1 }, c.g);
      c.bars(p.map((v, i) => ({ x: i, y: v, fill: "var(--s1)" })), { maxW: 50 });
      c.vline(E, { stroke: "var(--s2)", "stroke-width": 2, "stroke-dasharray": "" });
      c.text(E, 0.92, "E(X) = 2", { class: "svg-strong", style: "fill:var(--s2)", dy: -4 });
      $("spreadRead").innerHTML = `${T(`E(X)=${tf(E, 2, true)}`)} · ${T(`E(X^2)=${tf(E2, 2, true)}`)} · ${T(`D(X)=${tf(E2, 2, true)}-2^2=${tf(D, 2, true)}`)} · ${T(`\\sigma(X)\\approx${tf(s, 3)}`)}`;
    };
    render();
  }

  /* ---------------- NHỊ THỨC + ĐƯỜNG CHUẨN ---------------- */
  if ($("binWidget2")) {
    let st = { b2n: 8, b2p: 0.25 }, overlay = false;
    const tog = $("b2Toggle");
    [...tog.children].forEach(b => b.onclick = () => { overlay = b.dataset.k === "1"; [...tog.children].forEach(x => x.classList.toggle("on", x === b)); render(); });
    const render = () => {
      const n = st.b2n, p = st.b2p, mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      const lo = Math.max(0, Math.floor(mu - 4.5 * sd - 1)), hi = Math.min(n, Math.ceil(mu + 4.5 * sd + 1));
      const P = []; for (let k = lo; k <= hi; k++) P.push([k, X.binom(k, n, p)]);
      const ymax = Math.max(...P.map(v => v[1]), sd > 0 ? X.normPdf(mu, mu, sd) : 0) * 1.15;
      const c = X.chart($("b2Plot"), { height: 250, xmin: lo - 0.8, xmax: hi + 0.8, ymin: 0, ymax });
      const step = Math.max(1, Math.ceil((hi - lo) / 12));
      const xt = []; for (let k = lo; k <= hi; k += step) xt.push(k);
      c.axes({ xticks: xt, xfmt: v => String(v), ycount: 4 });
      c.bars(P.map(([k, v]) => ({ x: k, y: v, fill: soft("var(--s1)") })), { maxW: 40, ratio: 0.8 });
      if (overlay && sd > 0) c.curve(x => X.normPdf(x, mu, sd), lo - 0.8, hi + 0.8, { stroke: "var(--s2)" });
      c.vline(mu, { stroke: "var(--s2)" });
      c.hover(xv => { const k = Math.round(xv); if (k < 0 || k > n) return null; return `P(X = ${k}) = ${f(X.binom(k, n, p), 4)}`; }, { snap: v => Math.round(v), ty: xv => c.y(X.binom(Math.round(xv), n, p)) });
      $("b2Read").innerHTML = `${T(`E(X)=np=${tf(mu, 2, true)}`)} · ${T(`D(X)=npq=${tf(sd * sd, 3, true)}`)} · ${T(`\\sigma\\approx${tf(sd, 3)}`)}` +
        (overlay ? `<br><span class="small">Đường cam: ${T(`N(${tf(mu, 2, true)};\\,${tf(sd * sd, 3, true)})`)}. ${n * p >= 5 && n * (1 - p) >= 5 ? "Đủ điều kiện xấp xỉ (np ≥ 5, nq ≥ 5) — đường cong ôm sát các cột." : "Chưa đủ điều kiện (np hoặc nq &lt; 5) — đường cong lệch so với cột."}</span>` : "");
    };
    X.bind(["b2n", "b2p"], v => { st = v; render(); }, { b2n: v => String(v), b2p: v => f(v, 2) });
    X.responsive($("b2Plot"), render);
  }

  /* ---------------- CHUẨN μ, σ ---------------- */
  if ($("normWidget")) {
    let st = { nmu: 1, nsd: 1.5 };
    const render = () => {
      const { nmu: mu, nsd: sd } = st;
      const c = X.chart($("normPlot"), { height: 260, xmin: -8, xmax: 8, ymin: 0, ymax: 0.85 });
      c.axes({ xticks: [-8, -6, -4, -2, 0, 2, 4, 6, 8], yticks: [0, 0.2, 0.4, 0.6, 0.8], xfmt: v => String(v) });
      c.curve(x => X.normPdf(x), -8, 8, { stroke: "var(--muted)", "stroke-dasharray": "5 5", "stroke-width": 1.5 });
      c.area(x => X.normPdf(x, mu, sd), mu - sd, mu + sd, { fill: "var(--s1)", "fill-opacity": .14 });
      c.curve(x => X.normPdf(x, mu, sd), -8, 8, { stroke: "var(--s1)" });
      const pk = X.normPdf(mu, mu, sd);
      c.vline(mu, { stroke: "var(--s1)" }, 0, pk);
      c.vline(mu - sd, { "stroke-dasharray": "2 3" }, 0, X.normPdf(mu - sd, mu, sd));
      c.vline(mu + sd, { "stroke-dasharray": "2 3" }, 0, X.normPdf(mu + sd, mu, sd));
      c.dot(mu, pk);
      c.hover(xv => `x = ${f(xv, 2)} → f(x) = ${f(X.normPdf(xv, mu, sd), 4)}`, { ty: xv => c.y(X.normPdf(xv, mu, sd)) });
      $("normRead").innerHTML = `${T(`X\\sim N(${tf(mu, 1, true)};\\,${tf(sd * sd, 2, true)})`)} · đỉnh tại ${T("x=" + tf(mu, 1, true))}, cao ${T(`\\frac{1}{${tf(sd, 1, true)}\\sqrt{2\\pi}}\\approx${tf(pk, 4)}`)} · vùng tô ${T("\\mu\\pm\\sigma")} luôn chiếm ≈ 68,26% diện tích.`;
    };
    X.bind(["nmu", "nsd"], v => { st = v; render(); }, { nmu: v => f(v, 1), nsd: v => f(v, 1) });
    X.responsive($("normPlot"), render);
  }

  /* ---------------- QUY TẮC 68–95–99,7 ---------------- */
  if ($("ruleFig")) X.responsive($("ruleFig"), () => {
    const c = X.chart($("ruleFig"), { height: 260, xmin: -4, xmax: 4, ymin: 0, ymax: 0.5, margin: { top: 22 } });
    c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], xfmt: v => v === 0 ? "μ" : (v > 0 ? "μ+" : "μ−") + (Math.abs(v) === 1 ? "" : Math.abs(v)) + "σ", noy: true, nogrid: true });
    const pdf = x => X.normPdf(x);
    c.area(pdf, -3, 3, { fill: "var(--s1)", "fill-opacity": .12 });
    c.area(pdf, -2, 2, { fill: "var(--s1)", "fill-opacity": .16 });
    c.area(pdf, -1, 1, { fill: "var(--s1)", "fill-opacity": .22 });
    c.curve(pdf, -4, 4, { stroke: "var(--s1)" });
    const br = (a, yv, lab) => {
      X.el("line", { x1: c.x(-a), x2: c.x(a), y1: c.y(yv), y2: c.y(yv), stroke: "var(--text-2)", "stroke-width": 1.2, "marker-end": "" }, c.g);
      [-a, a].forEach(v => X.el("line", { x1: c.x(v), x2: c.x(v), y1: c.y(yv) - 5, y2: c.y(yv) + 5, stroke: "var(--text-2)" }, c.g));
      c.text(0, yv, lab, { dy: -5, class: "svg-strong", style: "font-size:12.5px" });
    };
    br(1, 0.2, "68,26%"); br(2, 0.08, "95,44%"); br(3, 0.02, "99,73%");
  });

  /* ---------------- 4 DIỆN TÍCH ---------------- */
  if ($("areaFigs")) {
    const host = $("areaFigs");
    const items = [
      { cap: "$G(1)=P(Z\\lt 1)=0{,}5+\\varphi(1)=0{,}8413$", a: -4, b: 1 },
      { cap: "$\\varphi(1)$: diện tích từ 0 đến 1 $=0{,}3413$", a: 0, b: 1 },
      { cap: "$P(Z\\gt 1)=0{,}5-\\varphi(1)=0{,}1587$", a: 1, b: 4 },
      { cap: "$P(-0{,}5\\lt Z\\lt 1{,}5)=\\varphi(1{,}5)+\\varphi(0{,}5)=0{,}6247$", a: -0.5, b: 1.5 }
    ];
    const boxes = items.map(it => {
      const d = document.createElement("div");
      d.innerHTML = `<div class="pl"></div><div class="center small">${it.cap}</div>`;
      host.appendChild(d); window.renderMath(d); return [d.querySelector(".pl"), it];
    });
    const draw = () => boxes.forEach(([pl, it]) => {
      const c = X.chart(pl, { height: 150, xmin: -3.5, xmax: 3.5, ymin: 0, ymax: 0.45, margin: { left: 14, right: 14, bottom: 26, top: 8 }, minWidth: 220 });
      c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], xfmt: v => String(v), noy: true, nogrid: true });
      c.area(x => X.normPdf(x), it.a, it.b, { fill: "var(--s2)", "fill-opacity": .4 });
      c.curve(x => X.normPdf(x), -3.5, 3.5, { stroke: "var(--s1)", "stroke-width": 1.8 });
    });
    X.responsive(host, draw);
  }

  /* ---------------- MÁY TÍNH PHÂN PHỐI CHUẨN ---------------- */
  const phiTab = z => { const a = Math.abs(z); if (a >= 4) return Math.sign(z) * 0.5; const v = X.phi(Math.round(a * 100) / 100); return Math.sign(z) * (a >= 3 ? +v.toFixed(5) : +v.toFixed(4)); };
  const phiFmt = z => { const a = Math.abs(z); if (a >= 4) return (z < 0 ? "-" : "") + "0{,}5"; const v = phiTab(z); return tf(v, a >= 3 ? 5 : 4); };
  if ($("calcWidget")) {
    const ids = ["cmu", "csd", "cmode", "ca", "cb"];
    const render = () => {
      const mu = parseFloat($("cmu").value), sd = parseFloat($("csd").value), mode = $("cmode").value;
      const a = parseFloat($("ca").value), b = parseFloat($("cb").value);
      $("cb").disabled = mode !== "between"; $("cb").parentElement.style.opacity = mode === "between" ? 1 : .45;
      if (!(sd > 0) || !isFinite(mu)) { $("calcRead").innerHTML = "Nhập σ &gt; 0."; return; }
      const z = x => Math.round((x - mu) / sd * 100) / 100;
      let lo, hi, steps = [], res;
      const zs = x => `\\frac{${tf(x, 4, true)}-${tf(mu, 4, true)}}{${tf(sd, 4, true)}}\\approx${tf(z(x), 2)}`;
      if (mode === "between") {
        lo = Math.min(a, b); hi = Math.max(a, b);
        const z1 = z(lo), z2 = z(hi);
        res = phiTab(z2) - phiTab(z1);
        steps = [`z_1=${zs(lo)},\\quad z_2=${zs(hi)}`,
          `P(${tf(lo, 4, true)}\\lt X\\lt ${tf(hi, 4, true)})=\\varphi(${tf(z2, 2)})-\\varphi(${tf(z1, 2)})`,
          `=${phiFmt(z2)}-(${phiFmt(z1)})=${tf(res)}`];
      } else if (mode === "gt") {
        lo = a; hi = mu + 5 * sd; const z1 = z(a); res = 0.5 - phiTab(z1);
        steps = [`z=${zs(a)}`, `P(X\\gt ${tf(a, 4, true)})=0{,}5-\\varphi(${tf(z1, 2)})=0{,}5-(${phiFmt(z1)})=${tf(res)}`];
      } else if (mode === "lt") {
        lo = mu - 5 * sd; hi = a; const z1 = z(a); res = 0.5 + phiTab(z1);
        steps = [`z=${zs(a)}`, `P(X\\lt ${tf(a, 4, true)})=0{,}5+\\varphi(${tf(z1, 2)})=0{,}5+(${phiFmt(z1)})=${tf(res)}`];
      } else {
        const e = Math.abs(a); lo = mu - e; hi = mu + e; const ze = Math.round(e / sd * 100) / 100; res = 2 * phiTab(ze);
        steps = [`\\frac{\\varepsilon}{\\sigma}=\\frac{${tf(e, 4, true)}}{${tf(sd, 4, true)}}\\approx${tf(ze, 2)}`, `P(|X-${tf(mu, 4, true)}|\\lt ${tf(e, 4, true)})=2\\varphi(${tf(ze, 2)})=2\\cdot ${phiFmt(ze)}=${tf(res)}`];
      }
      const c = X.chart($("calcPlot"), { height: 230, xmin: mu - 4 * sd, xmax: mu + 4 * sd, ymin: 0, ymax: X.normPdf(mu, mu, sd) * 1.15 });
      c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3].map(k => mu + k * sd), xfmt: v => ft(v, 2), noy: true });
      c.area(x => X.normPdf(x, mu, sd), lo, hi, { fill: "var(--s2)", "fill-opacity": .4 });
      c.curve(x => X.normPdf(x, mu, sd), mu - 4 * sd, mu + 4 * sd, { stroke: "var(--s1)" });
      const exact = mode === "between" ? X.normCdf(hi, mu, sd) - X.normCdf(lo, mu, sd) : mode === "gt" ? 1 - X.normCdf(a, mu, sd) : mode === "lt" ? X.normCdf(a, mu, sd) : X.normCdf(hi, mu, sd) - X.normCdf(lo, mu, sd);
      $("calcRead").innerHTML = `<div>${T(`\\mu=${tf(mu, 4, true)},\\ \\sigma=${tf(sd, 4, true)}`)}</div>` + steps.map(s => `<div style="margin-top:4px">${T(s)}</div>`).join("") +
        `<div class="small muted" style="margin-top:6px">Giá trị không làm tròn z: ${f(exact, 4)} (chênh lệch nhỏ do bảng chỉ có 2 chữ số thập phân).</div>`;
    };
    ids.forEach(id => $(id).addEventListener("input", render));
    X.responsive($("calcPlot"), render);
  }

  /* ---------------- BẢNG φ TƯƠNG TÁC ---------------- */
  if ($("phiWidget")) {
    const tb = $("phiTable");
    let h = `<table class="compact" style="font-variant-numeric:tabular-nums"><thead><tr><th style="position:sticky;top:0;z-index:2">x</th>`;
    for (let c = 0; c < 10; c++) h += `<th style="position:sticky;top:0;z-index:1" data-c="${c}">0,0${c}</th>`;
    h += `</tr></thead><tbody>`;
    for (let r = 0; r < 40; r++) {
      h += `<tr><th data-r="${r}">${(r / 10).toFixed(1).replace(".", ",")}</th>`;
      for (let c = 0; c < 10; c++) { const v = X.phi(r / 10 + c / 100); h += `<td id="ph_${r}_${c}">${r >= 30 ? v.toFixed(5).replace(".", ",") : v.toFixed(4).replace(".", ",")}</td>`; }
      h += `</tr>`;
    }
    tb.innerHTML = h + `</tbody></table>`;
    let last = [];
    const mark = (r, c) => {
      last.forEach(e => { e.style.background = ""; e.style.color = ""; e.style.fontWeight = ""; });
      last = [];
      if (r < 0) return;
      for (let cc = 0; cc < 10; cc++) { const e = $(`ph_${r}_${cc}`); e.style.background = "var(--s1-soft)"; last.push(e); }
      for (let rr = 0; rr < 40; rr++) { const e = $(`ph_${rr}_${c}`); e.style.background = "var(--s1-soft)"; last.push(e); }
      const cell = $(`ph_${r}_${c}`); cell.style.background = "var(--s2)"; cell.style.color = "#fff"; cell.style.fontWeight = "800";
      tb.scrollTop = Math.max(0, cell.offsetTop - tb.clientHeight / 2);
    };
    const fwd = () => {
      let x = parseFloat($("phiX").value); if (!isFinite(x)) return;
      const a = Math.abs(x), ar = Math.round(a * 100) / 100;
      if (ar >= 4) { mark(-1); $("phiRead").innerHTML = `${T(`|x|\\ge4\\Rightarrow\\varphi(${tf(x, 2)})\\approx${x < 0 ? "-" : ""}0{,}5`)}`; return; }
      const r = Math.floor(ar * 10 + 1e-9), c = Math.round(ar * 100 - r * 10);
      mark(r, c);
      const v = phiTab(ar);
      $("phiRead").innerHTML = `Tra xuôi: ${T(tf(ar, 2))} → hàng ${T(tf(r / 10, 1))}, cột ${T("0{,}0" + c)} → ${T(`\\varphi(${tf(ar, 2)})=${tf(v, ar >= 3 ? 5 : 4)}`)}` +
        (x < 0 ? ` → ${T(`\\varphi(${tf(-ar, 2)})=-${tf(v, ar >= 3 ? 5 : 4)}`)}` : "") + (Math.abs(a - ar) > 1e-9 ? ` <span class="muted">(đã làm tròn x về 2 chữ số)</span>` : "");
    };
    const rev = () => {
      let v = parseFloat($("phiV").value); if (!isFinite(v)) return;
      if (Math.abs(v) >= 0.5) { $("phiRead").innerHTML = "φ(x) luôn nhỏ hơn 0,5 về độ lớn."; return; }
      const av = Math.abs(v); let best = 0, bd = 9;
      for (let i = 0; i < 400; i++) { const d = Math.abs(X.phi(i / 100) - av); if (d < bd) { bd = d; best = i; } }
      const r = Math.floor(best / 10), c = best % 10; mark(r, c);
      const ex = X.invNorm(0.5 + av);
      $("phiRead").innerHTML = `Tra ngược: ô gần ${T(tf(av, 4))} nhất là hàng ${T(tf(r / 10, 1))}, cột ${T("0{,}0" + c)} → ${T(`x\\approx${v < 0 ? "-" : ""}${tf(best / 100, 2)}`)} <span class="muted">(giá trị chính xác ≈ ${f(v < 0 ? -ex : ex, 4)})</span>`;
    };
    $("phiX").addEventListener("input", fwd); $("phiV").addEventListener("input", rev);
    fwd();
  }

  /* ---------------- HIỆU CHỈNH LIÊN TỤC ---------------- */
  if ($("ccWidget")) {
    let st = {};
    const render = () => {
      const n = st.ccn, p = st.ccp; const aEl = $("cca"), bEl = $("ccb");
      aEl.max = n; bEl.max = n;
      let a = Math.min(+aEl.value, n), b = Math.min(+bEl.value, n); if (a > b) [a, b] = [b, a];
      document.querySelector('output[for="cca"]').textContent = a; document.querySelector('output[for="ccb"]').textContent = b;
      const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      const lo = Math.max(0, Math.floor(mu - 4 * sd)), hi = Math.min(n, Math.ceil(mu + 4 * sd));
      const xs = []; for (let k = lo; k <= hi; k++) xs.push(k);
      const ymax = Math.max(X.normPdf(mu, mu, sd), ...xs.map(k => X.binom(k, n, p))) * 1.15;
      const c = X.chart($("ccPlot"), { height: 260, xmin: lo - 1, xmax: hi + 1, ymin: 0, ymax });
      const step = Math.max(1, Math.ceil((hi - lo) / 12)); const xt = []; for (let k = lo; k <= hi; k += step) xt.push(k);
      c.axes({ xticks: xt, xfmt: v => String(v), ycount: 4 });
      c.area(x => X.normPdf(x, mu, sd), a - 0.5, b + 0.5, { fill: "var(--s2)", "fill-opacity": .25 });
      c.bars(xs.map(k => ({ x: k, y: X.binom(k, n, p), fill: k >= a && k <= b ? "var(--s1)" : soft("var(--s1)") })), { ratio: 0.98, maxW: 60 });
      c.curve(x => X.normPdf(x, mu, sd), lo - 1, hi + 1, { stroke: "var(--s2)" });
      c.vline(a - 0.5, { stroke: "var(--s2)" }); c.vline(b + 0.5, { stroke: "var(--s2)" });
      let exact = 0; for (let k = a; k <= b; k++) exact += X.binom(k, n, p);
      const withC = X.normCdf(b + 0.5, mu, sd) - X.normCdf(a - 0.5, mu, sd);
      const noC = X.normCdf(b, mu, sd) - X.normCdf(a, mu, sd);
      $("ccRead").innerHTML = `${T(`\\mu=np=${tf(mu, 2, true)},\\ \\sigma=\\sqrt{npq}\\approx${tf(sd, 3)}`)}<br>
        Chính xác (cộng các cột): ${T(`P(${a}\\le X\\le ${b})`)} = <b>${f(exact, 4)}</b> ·
        Có hiệu chỉnh ${T(`(${tf(a - 0.5, 1)};\\,${tf(b + 0.5, 1)})`)}: <b>${f(withC, 4)}</b> ·
        Không hiệu chỉnh ${T(`(${a};\\,${b})`)}: <b>${f(noC, 4)}</b>`;
    };
    X.bind(["ccn", "ccp", "cca", "ccb"], v => { st = v; render(); }, { ccn: v => String(v), ccp: v => f(v, 2), cca: v => String(v), ccb: v => String(v) });
    X.responsive($("ccPlot"), render);
  }

  /* ---------------- CHI², STUDENT, FISHER ---------------- */
  if ($("famWidget")) {
    let fam = "chi"; let st = {};
    const seg = $("famBtns");
    [["chi", "Khi bình phương χ²"], ["t", "Student T"], ["f", "Fisher F"]].forEach(([k, lab]) => {
      const b = document.createElement("button"); b.textContent = lab; b.dataset.k = k;
      b.onclick = () => { fam = k; [...seg.children].forEach(x => x.classList.toggle("on", x.dataset.k === k)); render(); };
      seg.appendChild(b);
    });
    [...seg.children][0].classList.add("on");
    const render = () => {
      const k1 = st.fk1, k2 = st.fk2, al = st.fal;
      $("fk2wrap").style.display = fam === "f" ? "" : "none";
      $("fk1name").textContent = fam === "chi" ? "k" : fam === "t" ? "n" : "m (tử)";
      let pdf, q, xmin, xmax, ymax, extra = "", name;
      if (fam === "chi") {
        pdf = x => X.chi2Pdf(x, k1); q = X.chi2Inv(al, k1);
        xmin = 0; xmax = Math.max(10, k1 + 5 * Math.sqrt(2 * k1));
        let mx = 0; for (let x = 0.05; x < xmax; x += xmax / 300) mx = Math.max(mx, pdf(x)); ymax = Math.min(mx * 1.15, 0.6);
        name = `\\chi^2_{${tf(al, 3, true)}}(${k1})`; extra = `${T(`E=${k1},\\ D=${2 * k1}`)}`;
      } else if (fam === "t") {
        pdf = x => X.tPdf(x, k1); q = X.tInv(al, k1); xmin = -5; xmax = 5; ymax = 0.45;
        name = `t_{${tf(al, 3, true)}}(${k1})`; extra = `so với ${T(`z_{${tf(al, 3, true)}}=${tf(X.invNorm(al), 3)}`)} của chuẩn tắc (đường nét đứt)`;
      } else {
        pdf = x => X.fPdf(x, k1, k2); q = X.fInv(al, k1, k2); xmin = 0; xmax = Math.max(4, Math.min(q * 1.4, 12));
        let mx = 0; for (let x = 0.02; x < xmax; x += xmax / 300) mx = Math.max(mx, pdf(x)); ymax = Math.min(mx * 1.15, 1.5);
        name = `F_{${tf(al, 3, true)}}(${k1};\\,${k2})`; extra = `thứ tự ${T("(m;n)")} quan trọng: ${T(`F_{${tf(al, 3, true)}}(${k2};\\,${k1})=${tf(X.fInv(al, k2, k1), 3)}`)}`;
      }
      const c = X.chart($("famPlot"), { height: 250, xmin, xmax, ymin: 0, ymax });
      c.axes({ ycount: 4, xcount: 8 });
      c.area(pdf, xmin + 1e-6, Math.min(q, xmax), { fill: "var(--s2)", "fill-opacity": .3 });
      if (fam === "t") c.curve(x => X.normPdf(x), xmin, xmax, { stroke: "var(--muted)", "stroke-dasharray": "5 5", "stroke-width": 1.5 });
      c.curve(pdf, xmin + 1e-6, xmax, { stroke: "var(--s1)" });
      if (q <= xmax) c.vline(q, { stroke: "var(--s2)" });
      $("famRead").innerHTML = `Diện tích bên trái mốc = ${T("\\alpha=" + tf(al, 3, true))} → ${T(`${name}\\approx${tf(q, 3)}`)} · ${extra}`;
    };
    X.bind(["fk1", "fk2", "fal"], v => { st = v; render(); }, { fk1: v => String(v), fk2: v => String(v), fal: v => f(v, 3, true) });
    X.responsive($("famPlot"), render);
  }

  /* ---------------- TRA NHANH ---------------- */
  if ($("lookWidget")) {
    const err = {
      chi: { "5|0.95": "10,070", "8|0.9": "13,326", "13|0.05": "5,982", "15|0.005": "5,601", "20|0.005": "7,343", "22|0.005": "8,543", "22|0.05": "12,388", "22|0.99": "30,289", "30|0.01": "14,930", "50|0.025": "32,307", "50|0.05": "34,754", "100|0.975": "128,561" },
      t: { "1|0.995": "63,675", "1|0.999": "636,619", "3|0.999": "10,213", "60|0.95": "1,674" },
      f: {
        "3|2|0.95": "19,6", "10|7|0.95": "3,65", "10|8|0.95": "3,34", "15|29|0.95": "2,63", "30|16|0.95": "2,09",
        "7|9|0.975": "4,52", "9|60|0.975": "2,23", "24|5|0.975": "6,38", "40|26|0.975": "1,09", "60|16|0.975": "2,15"
      }
    };
    /* Phụ lục 6c trang 2: cột m = 40 (từ n = 3) in lặp lại cột m = 30. Ô có n hoặc m = +∞ không nhập được ở đây nên không ghi. */
    [[3, "26,50"], [4, "13,84"], [5, "9,38"], [6, "7,23"], [7, "5,99"], [8, "5,20"], [9, "4,65"], [10, "4,25"], [11, "3,94"], [12, "3,70"],
     [13, "3,51"], [14, "3,35"], [15, "3,21"], [16, "3,10"], [17, "3,00"], [18, "2,92"], [19, "2,84"], [20, "2,78"], [21, "2,72"], [22, "2,67"],
     [23, "2,62"], [24, "2,58"], [25, "2,54"], [26, "2,50"], [27, "2,47"], [28, "2,44"], [29, "2,41"], [30, "2,39"], [40, "2,20"], [60, "2,03"], [120, "1,86"]]
      .forEach(([n, s]) => { err.f[`40|${n}|0.99`] = s; });
    const render = () => {
      const ty = $("lkType").value, a = parseFloat($("lkA").value), m = parseInt($("lkM").value), n = parseInt($("lkN").value);
      $("lkM").parentElement.style.opacity = ty === "f" ? 1 : .45; $("lkM").disabled = ty !== "f";
      if (!(a > 0 && a < 1) || !(n >= 1) || (ty === "f" && !(m >= 1))) { $("lkRead").innerHTML = "Nhập 0 &lt; α &lt; 1 và bậc tự do ≥ 1."; return; }
      let q, s, key;
      if (ty === "chi") { q = X.chi2Inv(a, n); s = `\\chi^2_{${tf(a, 3, true)}}(${n})`; key = `${n}|${+a}`; }
      else if (ty === "t") { q = X.tInv(a, n); s = `t_{${tf(a, 3, true)}}(${n})`; key = `${n}|${+a}`; }
      else { q = X.fInv(a, m, n); s = `F_{${tf(a, 3, true)}}(${m};\\,${n})`; key = `${m}|${n}|${+a}`; }
      const e = err[ty][key];
      $("lkRead").innerHTML = `${T(`${s}=${tf(q, ty === "f" ? 2 : 3)}`)}` + (e ? ` <span style="color:var(--s8);font-weight:700">· Giáo trình in nhầm là ${e}</span>` : "") +
        `<div class="small muted" style="margin-top:4px">Nghĩa là diện tích bên trái mốc này bằng ${f(a, 3, true)}.${ty === "t" && a < 0.5 ? ` Bảng chỉ có α ≥ 0,9: dùng ${T(`t_{${tf(a, 3, true)}}=-t_{${tf(1 - a, 3, true)}}`)}.` : ""}</div>`;
    };
    ["lkType", "lkA", "lkM", "lkN"].forEach(id => $(id).addEventListener("input", render));
    render();
  }
});
