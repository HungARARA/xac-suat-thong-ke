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
      { t: "Biến ngẫu nhiên", c: [{ t: "Rời rạc: bảng $p_i\\ge0$, $\\sum p_i=1$" }, { t: "Liên tục: mật độ $f(x)\\ge0$, $\\int f=1$" }] },
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

  /* Phản ví dụ (i): g(x) = 2x/3 trên [−1;2] — tổng bằng 1 nhưng có phần âm */
  if ($("negFig")) X.responsive($("negFig"), () => {
    const g = x => (x >= -1 && x <= 2) ? 2 / 3 * x : 0;
    const c = X.chart($("negFig"), { height: 250, xmin: -1.6, xmax: 2.6, ymin: -0.9, ymax: 1.6 });
    c.axes({ xticks: [-1, 0, 1, 2], yticks: [-2 / 3, 0, 2 / 3, 4 / 3], xfmt: v => String(v), yfmt: v => ({ "-2": "−2/3", "0": "0", "2": "2/3", "4": "4/3" })[Math.round(v * 3)] });
    c.hline(0, { stroke: "var(--text)", "stroke-dasharray": "none", "stroke-width": 1.4 });
    c.area(g, 0, 2, { fill: "var(--s1)", "fill-opacity": .3 });
    c.area(g, -1, 0, { fill: "var(--s8)", "fill-opacity": .35 });
    c.curve(() => 0, -1.6, -1, { stroke: "var(--s1)" });
    c.curve(g, -1, 0, { stroke: "var(--s8)" });
    c.curve(g, 0, 2, { stroke: "var(--s1)" });
    c.curve(() => 0, 2, 2.6, { stroke: "var(--s1)" });
    c.vline(-1, {}, -2 / 3, 0); c.vline(2, {}, 0, 4 / 3);
    c.text(1.35, 0.3, "+4/3", { class: "svg-strong", style: "fill:var(--s1)" });
    c.text(-0.72, -0.3, "−1/3", { class: "svg-strong", style: "fill:var(--s8)" });
    c.text(-0.3, -0.82, "g(x) < 0", { class: "svg-text", style: "fill:var(--s8);font-size:12px", "text-anchor": "start" });
    c.hover(xv => `x = ${f(xv, 2)} → g(x) = ${f(g(xv), 4)}`, { ty: xv => c.y(Math.max(0, g(xv))) });
  });

  /* Phản ví dụ (ii): h(x) = x(3 − x) có diện tích 4,5; nhân k = 2/9 thì còn 1 */
  if ($("scaleFig")) X.responsive($("scaleFig"), () => {
    const h = x => (x >= 0 && x <= 3) ? x * (3 - x) : 0;
    const c = X.chart($("scaleFig"), { height: 260, xmin: -0.4, xmax: 3.4, ymin: 0, ymax: 2.5 });
    c.axes({ xticks: [0, 1, 2, 3], yticks: [0, 0.5, 1, 1.5, 2], xfmt: v => String(v) });
    c.area(h, 0, 3, { fill: "var(--s2)", "fill-opacity": .16 });
    c.area(fd, 0, 3, { fill: "var(--s1)", "fill-opacity": .35 });
    c.curve(h, -0.4, 3.4, { stroke: "var(--s2)" });
    c.curve(fd, -0.4, 3.4, { stroke: "var(--s1)" });
    X.el("line", { x1: c.x(2.2), x2: c.x(2.2), y1: c.y(h(2.2) - 0.08), y2: c.y(fd(2.2) + 0.1), stroke: "var(--text-2)", "stroke-width": 1.4, "marker-end": "url(#arrK)" }, c.g);
    const mk = X.el("marker", { id: "arrK", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, X.el("defs", {}, c.svg));
    X.el("path", { d: "M0,0L10,5L0,10Z", fill: "var(--text-2)" }, mk);
    c.text(2.28, 1.1, "× 2/9", { class: "svg-strong", "text-anchor": "start" });
    c.text(1.3, 1.2, "diện tích 4,5", { class: "svg-strong", style: "fill:var(--s2);font-size:12.5px" });
    c.text(1.5, 0.15, "diện tích 1", { class: "svg-strong", style: "fill:var(--s1);font-size:12.5px" });
  });

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
      const c1 = X.chart($("cdfTop"), { height: 210, xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 0.7, aria: "mật độ của thời gian tê môi, tô diện tích bên trái x" });
      c1.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.25, 0.5], xfmt: v => f(v, 1, true), xlabel: "x (giờ)" });
      c1.area(fd, -0.5, x, { fill: "var(--s2)", "fill-opacity": .35 });
      c1.curve(fd, -0.5, 3.5, { stroke: "var(--s1)" });
      c1.vline(x, { stroke: "var(--s2)" });
      if (x > 0.6) c1.text(Math.min(x, 3) / 2, 0.05, "F = " + f(Fd(x), 4), { class: "svg-strong", style: "font-size:12px" });
      c1.text(-0.45, 0.63, "mật độ f(x) của thời gian tê môi X", { "text-anchor": "start", class: "svg-text" });
      const c2 = X.chart($("cdfBot"), { height: 210, xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 1.12, aria: "đồ thị hàm phân phối F(x) của thời gian tê môi" });
      c2.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.5, 1], xfmt: v => f(v, 1, true), xlabel: "x (giờ)" });
      c2.curve(Fd, -0.5, 3.5, { stroke: "var(--s3)" });
      c2.hline(Fd(x), { stroke: "var(--s2)" });
      c2.vline(x, { stroke: "var(--s2)" }, 0, Fd(x));
      c2.dot(x, Fd(x), { fill: "var(--s2)" });
      c2.text(-0.45, 1.04, "hàm phân phối F(x) = P(X < x)", { "text-anchor": "start", class: "svg-text" });
      const pct = ft(Fd(x) * 100, 1);
      $("cdfRead").innerHTML = `Diện tích tô cam ở hình trên = ${T(`P(X\\lt ${tf(x, 2, true)})=F(${tf(x, 2, true)})=${tf(Fd(x))}`)} = độ cao của chấm cam ở hình dưới.<br><span class="small muted">${x <= 0 ? "Chưa bệnh nhân nào hết tê trước mốc này." : x >= 3 ? "Mọi bệnh nhân đều đã hết tê trước mốc này (100%)." : "Nghĩa là khoảng " + pct + "% bệnh nhân đã hết tê trước mốc " + f(x, 2, true) + " giờ."}</span>`;
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

  /* >>> MỤC 5 (viết lại) >>> */
  /* ---------------- MỤC 5: VẠCH CẮT x TRÊN BIỂU ĐỒ CỘT (rời rạc) ---------------- */
  if ($("s05-cut")) {
    const s05p = [0.006, 0.092, 0.398, 0.504];
    const s05pt = ["0{,}006", "0{,}092", "0{,}398", "0{,}504"];
    let s05x = 0.5;
    const near = (a, b) => Math.abs(a - b) < 1e-9;
    const render = () => {
      const x = s05x;
      const c = X.chart($("s05-cutPlot"), { height: 230, xmin: -1, xmax: 4, ymin: 0, ymax: 0.66, aria: "biểu đồ cột với vạch cắt x" });
      c.axes({ xticks: [-1, 0, 1, 2, 3, 4], yticks: [0, 0.2, 0.4, 0.6], xfmt: v => String(v).replace("-", "−"), xlabel: "giá trị của X" });
      /* nền nhạt cho phần nằm bên trái vạch */
      X.el("rect", { x: c.x(-1), y: c.y(0.66), width: Math.max(0, c.x(x) - c.x(-1)), height: c.y(0) - c.y(0.66), fill: "var(--s2)", "fill-opacity": .07 }, c.g);
      c.bars(s05p.map((v, i) => ({ x: i, y: v, fill: i < x - 1e-9 ? "var(--s2)" : soft("var(--text-2)") })), { maxW: 46 });
      s05p.forEach((v, i) => c.text(i, v, f(v, 3), { dy: -6, class: i < x - 1e-9 ? "svg-strong" : "svg-text" }));
      c.vline(x, { stroke: "var(--s8)", "stroke-width": 2.2, "stroke-dasharray": "none" });
      c.text(x, 0.62, "vạch x = " + f(x, 2, true), { class: "svg-strong", style: "fill:var(--s8);font-size:12px", "text-anchor": x > 2.6 ? "end" : "start", dx: x > 2.6 ? -6 : 6 });
      const xs = tf(x, 2, true);
      const inn = [], out = [];
      for (let i = 0; i < 4; i++) (i < x - 1e-9 ? inn : out).push(i);
      const sum = inn.reduce((s, i) => s + s05p[i], 0);
      let html = "";
      html += inn.length
        ? `Giá trị của ${T("X")} nhỏ hơn hẳn ${T("x=" + xs)}: <b>${inn.join("; ")}</b> → được cộng (cột cam).`
        : `Không có giá trị nào của ${T("X")} nhỏ hơn hẳn ${T("x=" + xs)} → chưa cộng gì.`;
      const on = [0, 1, 2, 3].find(k => near(x, k));
      if (on !== undefined) html += `<br>Cột ${T("X=" + on)} nằm <b>ngay trên vạch</b>: ${T(on + "\\lt " + on)} là sai → <b>chưa</b> được cộng (dấu ${T("\\lt")} chặt).`;
      const expr = inn.length ? inn.map(i => s05pt[i]).join("+") + (inn.length > 1 ? "=" + tf(sum, 3, true) : "") : "0";
      html += `<br>${T(`F(${xs})=P(X\\lt ${xs})=${expr}`)}`;
      $("s05-cutRead").innerHTML = html;
    };
    X.bind(["s05-x"], v => { s05x = v["s05-x"]; render(); }, { "s05-x": v => f(v, 2, true) });
    X.responsive($("s05-cutPlot"), render);
    const pre = $("s05-pre");
    if (pre) pre.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      const sl = $("s05-x"); sl.value = b.getAttribute("data-v");
      pre.querySelectorAll("button").forEach(o => o.classList.toggle("on", o === b));
      sl.dispatchEvent(new Event("input"));
    }));
  }

  /* ---------------- MỤC 5: BA VỊ TRÍ CỦA VẠCH x (liên tục) ---------------- */
  if ($("s05-cases")) {
    const cases = [
      { id: "s05-c1", x: -0.5, t1: "x = −0,5 (x ≤ 0)", t2: "không có diện tích → F = 0" },
      { id: "s05-c2", x: 1, t1: "x = 1 (0 < x ≤ 3)", t2: "tô từ 0 tới 1 → F = 7/27 ≈ 0,2593" },
      { id: "s05-c3", x: 3.5, t1: "x = 3,5 (x > 3)", t2: "tô hết cả vòm → F = 1" }
    ];
    cases.forEach(cs => {
      if (!$(cs.id)) return;
      X.responsive($(cs.id), () => {
        const c = X.chart($(cs.id), { height: 175, minWidth: 220, xmin: -1, xmax: 4, ymin: 0, ymax: 0.8, margin: { left: 34, right: 10, top: 10, bottom: 30 }, aria: "vị trí vạch x " + cs.t1 });
        c.axes({ xticks: [0, 1, 2, 3], yticks: [0, 0.5], xfmt: v => String(v) });
        c.area(fd, -1, cs.x, { fill: "var(--s2)", "fill-opacity": .4 });
        c.curve(fd, -1, 4, { stroke: "var(--s1)" });
        c.vline(cs.x, { stroke: "var(--s8)", "stroke-width": 2, "stroke-dasharray": "none" }, 0, 0.54);
        c.text(-0.9, 0.7, cs.t1, { class: "svg-strong", style: "fill:var(--s8);font-size:12px", "text-anchor": "start" });
        c.text(-0.9, 0.6, cs.t2, { class: "svg-text", style: "font-size:11.5px", "text-anchor": "start" });
      });
    });
  }
  /* <<< MỤC 5 <<< */

  /* >>> MỤC 6 (viết lại) >>> */
  /* ---------------- MỤC 6: ĐỌC NGƯỢC ĐỒ THỊ F (phân vị tê môi) ---------------- */
  if ($("s06-inv")) {
    let a = 0.5;
    const inv = p => { let lo = 0, hi = 3; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Fd(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
    const render = () => {
      const xa = inv(a);
      const c1 = X.chart($("s06-top"), { height: 180, xmin: -0.3, xmax: 3.3, ymin: 0, ymax: 0.62, margin: { bottom: 30 } });
      c1.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.25, 0.5] });
      c1.area(fd, -0.3, xa, { fill: "var(--s2)", "fill-opacity": .35 });
      c1.curve(fd, -0.3, 3.3, { stroke: "var(--s1)" });
      c1.vline(xa, { stroke: "var(--s2)", "stroke-width": 2 });
      c1.text(-0.2, 0.55, "mật độ f(x)", { "text-anchor": "start", class: "svg-text" });
      if (a >= 0.15) c1.text(Math.max(0.35, xa - 0.45), 0.12, "diện tích α", { class: "svg-strong", style: "fill:var(--s2)" });
      const c2 = X.chart($("s06-bot"), { height: 210, xmin: -0.3, xmax: 3.3, ymin: 0, ymax: 1.08, margin: { bottom: 30 } });
      c2.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.25, 0.5, 0.75, 1] });
      c2.curve(Fd, -0.3, 3.3, { stroke: "var(--s3)" });
      X.el("line", { x1: c2.x(-0.3), x2: c2.x(xa), y1: c2.y(a), y2: c2.y(a), stroke: "var(--s2)", "stroke-width": 2 }, c2.g);
      c2.vline(xa, { stroke: "var(--s2)", "stroke-width": 2, "stroke-dasharray": "" }, 0, a);
      c2.dot(xa, a, { fill: "var(--s2)" });
      c2.dot(xa, 0, { fill: "var(--s2)", r: 4 });
      c2.text(-0.25, a, "α", { dy: -6, "text-anchor": "start", class: "svg-strong", style: "fill:var(--s2)" });
      const lx = c2.text(xa, a / 2, "x", { dx: 6, "text-anchor": "start", class: "svg-strong", style: "fill:var(--s2)" });
      X.el("tspan", { dy: 4, style: "font-size:10px" }, lx).textContent = "α";
      c2.text(-0.2, 1.0, "hàm phân phối F(x)", { "text-anchor": "start", class: "svg-text" });
      $("s06-read").innerHTML = `${T(`\\alpha=${tf(a, 2, true)}`)} → ${T(`x_{${tf(a, 2, true)}}\\approx${tf(xa, 2)}`)} giờ: khoảng ${f(a * 100, 0)}% bệnh nhân đã hết tê trước mốc này. Thử lại: ${T(`F(x_\\alpha)=${tf(Fd(xa), 2)}`)}.`;
    };
    X.bind(["s06-a"], v => { a = v["s06-a"]; render(); }, { "s06-a": v => f(v, 2) });
    X.responsive($("s06-top"), render);
  }
  /* <<< MỤC 6 <<< */

  /* >>> MỤC 7 (viết lại) >>> */
  /* ---------------- MỤC 7: MÔ PHỎNG “LÀM THẬT NHIỀU ĐỢT” ---------------- */
  if ($("s07-sim")) {
    const ps7 = [0.9, 0.8, 0.7], NMAX = 2000;
    let runs = [], n7 = 10;
    const gen = () => {
      runs = [];
      for (let i = 0; i < NMAX; i++) { let k = 0; ps7.forEach(p => { if (Math.random() < p) k++; }); runs.push(k); }
    };
    gen();
    const render = () => {
      const n = n7;
      const c = X.chart($("s07-simPlot"), { height: 250, xmin: 0, xmax: n, ymin: 0, ymax: 3.2, margin: { left: 40 } });
      c.axes({ yticks: [0, 1, 2, 3], yfmt: v => String(v), xlabel: "số đợt đã làm" });
      const avgs = []; let s = 0, d = "";
      const cnt = [0, 0, 0, 0];
      for (let k = 1; k <= n; k++) {
        s += runs[k - 1]; cnt[runs[k - 1]]++;
        const a = s / k; avgs.push(a);
        d += (k === 1 ? "M" : "L") + c.x(k).toFixed(2) + "," + c.y(a).toFixed(2);
      }
      c.hline(2.4, { stroke: "var(--s2)", "stroke-width": 2, "stroke-dasharray": "6 4" });
      c.text(n, 2.4, "E(X) = 2,4", { "text-anchor": "end", dy: 18, class: "svg-strong", style: "fill:var(--s2)" });
      X.el("path", { d, fill: "none", stroke: "var(--s1)", "stroke-width": 2, "stroke-linejoin": "round" }, c.g);
      c.hover(xv => {
        const k = Math.round(xv); if (k < 1 || k > n) return null;
        return `Sau ${k} đợt: trung bình ≈ ${f(avgs[k - 1], 3)} ca/đợt`;
      }, { ty: xv => c.y(avgs[Math.max(0, Math.min(n - 1, Math.round(xv) - 1))]) });
      const avg = s / n;
      $("s07-simRead").innerHTML =
        `Trong <b>${n}</b> đợt: ${cnt[0]} đợt có 0 ca · ${cnt[1]} đợt có 1 ca · ${cnt[2]} đợt có 2 ca · ${cnt[3]} đợt có 3 ca thành công.<br>` +
        `Tổng số ca thành công = ${T(`0\\cdot${cnt[0]}+1\\cdot${cnt[1]}+2\\cdot${cnt[2]}+3\\cdot${cnt[3]}=${s}`)}<br>` +
        `Trung bình mỗi đợt: ${T(`\\dfrac{${s}}{${n}}\\approx${tf(avg, 3)}`)} <span class="muted">(lệch khỏi 2,4 một khoảng ${f(Math.abs(avg - 2.4), 3)})</span><br>` +
        `<span class="small muted">Theo xác suất, ${n} đợt “nên” có khoảng ${f(n * 0.006, 1, true)} · ${f(n * 0.092, 1, true)} · ${f(n * 0.398, 1, true)} · ${f(n * 0.504, 1, true)} đợt cho 0 · 1 · 2 · 3 ca.</span>`;
    };
    X.bind(["s07-n"], v => { n7 = v["s07-n"]; render(); }, { "s07-n": v => String(v) });
    $("s07-rerun").addEventListener("click", () => { gen(); render(); });
    X.responsive($("s07-simPlot"), render);
  }

  /* ---------------- MỤC 7: BẬP BÊNH — DỜI ĐIỂM TỰA ---------------- */
  if ($("s07-seesaw")) {
    const pm7 = [0.006, 0.092, 0.398, 0.504];
    let cpos = 1.5;
    const render = () => {
      const c = X.chart($("s07-seePlot"), { height: 270, xmin: -0.7, xmax: 3.7, ymin: -0.42, ymax: 0.66, margin: { bottom: 30, left: 20, top: 18 } });
      c.axes({ xticks: [0, 1, 2, 3], yticks: [], noy: true, nogrid: true, xfmt: v => String(v) });
      let L = 0, R = 0;
      const lt = [], rt = [];
      pm7.forEach((p, i) => {
        const dd = i - cpos;
        if (dd < -1e-9) { L += -dd * p; lt.push(`(${tf(cpos, 2, true)}-${i})\\cdot${tf(p, 3, true)}`); }
        else if (dd > 1e-9) { R += dd * p; rt.push(`(${i}-${tf(cpos, 2, true)})\\cdot${tf(p, 3, true)}`); }
      });
      const M = R - L;
      const bal = Math.abs(M) < 0.0005;
      const ang = bal ? 0 : Math.sign(M) * Math.max(1.5, Math.min(9, Math.abs(M) * 20));
      const px = c.x(cpos), py = c.y(0);
      const g = X.el("g", { transform: `rotate(${ang.toFixed(2)} ${px.toFixed(2)} ${py.toFixed(2)})` }, c.g);
      X.el("rect", { x: c.x(-0.6), y: py - 2, width: c.x(3.6) - c.x(-0.6), height: 5, rx: 2, fill: "var(--text-2)" }, g);
      const bw = Math.min(46, (c.x(1) - c.x(0)) * 0.6);
      pm7.forEach((p, i) => {
        const y0 = c.y(p), h = Math.max(1.5, py - 2 - y0);
        X.el("rect", { x: c.x(i) - bw / 2, y: py - 2 - h, width: bw, height: h, rx: 3, fill: "var(--s1)" }, g);
        const t = X.el("text", { x: c.x(i), y: py - 2 - h - 6, "text-anchor": "middle", class: "svg-strong" }, g);
        t.textContent = f(p, 3);
      });
      X.el("path", { d: `M${px},${py + 3} l-15,27 h30Z`, fill: bal ? "var(--s3)" : "var(--s2)" }, c.g);
      const lab = X.el("text", { x: px, y: py + 48, "text-anchor": "middle", class: "svg-strong", style: `fill:${bal ? "var(--s3)" : "var(--s2)"}` }, c.g);
      lab.textContent = `điểm tựa ${f(cpos, 2)}`;
      const side = bal
        ? `<b style="color:var(--s3)">Cân bằng!</b> Hai bên kéo bằng nhau — điểm tựa đang ở đúng ${T("E(X)=2{,}4")}.`
        : M > 0
          ? `<b style="color:var(--s2)">Bên phải nặng hơn</b> → ván nghiêng sang phải. Muốn cân bằng: dời điểm tựa <b>sang phải</b>.`
          : `<b style="color:var(--s2)">Bên trái nặng hơn</b> → ván nghiêng sang trái. Muốn cân bằng: dời điểm tựa <b>sang trái</b>.`;
      $("s07-seeRead").innerHTML =
        `Lực kéo bên trái ${T(`=${lt.length ? lt.join("+") + "=" : ""}${tf(L, 4, true)}`)}<br>` +
        `Lực kéo bên phải ${T(`=${rt.length ? rt.join("+") + "=" : ""}${tf(R, 4, true)}`)}<br>` + side;
    };
    X.bind(["s07-c"], v => { cpos = v["s07-c"]; render(); }, { "s07-c": v => f(v, 2) });
    X.responsive($("s07-seePlot"), render);
  }

  /* ---------------- MỤC 7: CỘNG CÁC DẢI MỎNG x·f(x)·Δx ---------------- */
  if ($("s07-strips")) {
    let k7 = 3;
    const render = () => {
      const k = k7, w = 3 / k;
      const c = X.chart($("s07-stripPlot"), { height: 250, xmin: -0.2, xmax: 3.2, ymin: 0, ymax: 0.6 });
      c.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [0, 0.2, 0.4, 0.6], xlabel: "x (giờ)" });
      let sp = 0, se = 0;
      for (let j = 0; j < k; j++) {
        const a = j * w, m = a + w / 2, h = fd(m);
        X.el("rect", { x: c.x(a), y: c.y(h), width: c.x(a + w) - c.x(a), height: c.y(0) - c.y(h), fill: "var(--s3)", "fill-opacity": .28, stroke: "var(--s3)", "stroke-width": k > 40 ? 0.4 : 1 }, c.g);
        if (k <= 6) c.dot(m, h, { fill: "var(--s3)", r: 3.5 });
        sp += h * w; se += m * h * w;
      }
      c.curve(fd, -0.2, 3.2, { stroke: "var(--s1)" });
      c.vline(1.5, { stroke: "var(--s2)", "stroke-width": 1.5 });
      c.text(1.5, 0.56, "1,5", { class: "svg-strong", style: "fill:var(--s2)", dx: 16 });
      c.hover(xv => {
        if (xv < 0 || xv > 3) return null;
        const j = Math.min(k - 1, Math.floor(xv / w)), m = j * w + w / 2, p = fd(m) * w;
        return `Dải quanh x ≈ ${f(m, 2)}: xác suất ≈ ${f(p, 4)}; x × xác suất ≈ ${f(m * p, 4)}`;
      }, { ty: xv => c.y(fd(xv)) });
      $("s07-stripRead").innerHTML =
        `${k} dải, mỗi dải rộng ${T(`\\Delta x=${tf(w, 3, true)}`)} giờ.<br>` +
        `Tổng xác suất các dải ${T(`\\sum f(x)\\,\\Delta x\\approx${tf(sp, 4)}`)} <span class="muted">(đúng ra phải là 1)</span><br>` +
        `Tổng “giá trị × xác suất” ${T(`\\sum x\\,f(x)\\,\\Delta x\\approx${tf(se, 4)}`)} <span class="muted">→ tiến tới ${T("E(X)=1{,}5")} khi dải mỏng dần</span>`;
    };
    X.bind(["s07-k"], v => { k7 = v["s07-k"]; render(); }, { "s07-k": v => String(v) });
    X.responsive($("s07-stripPlot"), render);
  }
  /* <<< MỤC 7 <<< */

  /* >>> MỤC 8 (viết lại) >>> */
  /* ---------------- MỤC 8: DỜI VÀ GIÃN Y = aX + b ---------------- */
  if ($("s08-linWidget")) {
    const xs = [0, 1, 2, 3], ps = [0.006, 0.092, 0.398, 0.504];
    const EX = 2.4, DX = 0.46, SX = Math.sqrt(DX);
    let st = { "s08-a": 2, "s08-b": 0 };
    const render = () => {
      const a = st["s08-a"], b = st["s08-b"];
      const m = new Map();
      xs.forEach((x, i) => { const y = +(a * x + b).toFixed(6); m.set(y, (m.get(y) || 0) + ps[i]); });
      const data = [...m.entries()].sort((u, v) => u[0] - v[0]).map(([x, y]) => ({ x, y, fill: "var(--s1)" }));
      const E = a * EX + b, D = a * a * DX, s = Math.abs(a) * SX;
      const c = X.chart($("s08-linPlot"), { height: 250, xmin: -14, xmax: 14, ymin: 0, ymax: 1.15 });
      c.axes({ xticks: [-12, -8, -4, 0, 4, 8, 12], yticks: [0, 0.5, 1], xfmt: v => String(v), xlabel: "giá trị của Y" });
      if (s > 0) {
        const lo = Math.max(-14, E - s), hi = Math.min(14, E + s);
        X.el("rect", { x: c.x(lo), y: c.y(1.04), width: c.x(hi) - c.x(lo), height: c.y(0) - c.y(1.04), fill: "var(--s2)", "fill-opacity": .12 }, c.g);
      }
      c.bars(data, { maxW: 26 });
      c.vline(E, { stroke: "var(--s2)", "stroke-width": 2, "stroke-dasharray": "" });
      c.text(Math.max(-12, Math.min(12, E)), 1.07, "E(Y) = " + f(E, 2, true), { class: "svg-strong", style: "fill:var(--s2)" });
      const aT = a === 1 ? "" : a === -1 ? "-" : tf(a, 1, true);
      const bT = b === 0 ? "" : (b > 0 ? "+" : "") + tf(b, 0, true);
      const yT = a === 0 ? `Y=${tf(b, 0, true)}` : `Y=${aT}X${bT}`;
      const aP = a < 0 ? `(${tf(a, 1, true)})` : tf(a, 1, true);
      $("s08-linRead").innerHTML =
        `${T(yT)}<br>` +
        `${T(`E(Y)=${aP}\\cdot2{,}4${b < 0 ? "" : "+"}${tf(b, 0, true)}=${tf(E, 2, true)}`)} · ` +
        `${T(`D(Y)=${aP}^2\\cdot0{,}46=${tf(D, 4, true)}`)} · ` +
        `${T(`\\sigma(Y)=|${tf(a, 1, true)}|\\cdot0{,}678\\approx${tf(s, 3, true)}`)}` +
        `<br><span class="small muted">${T("b")} không xuất hiện trong ${T("D(Y)")} và ${T("\\sigma(Y)")}: dời không làm phân phối rộng thêm.</span>`;
    };
    X.bind(["s08-a", "s08-b"], v => { st = v; render(); }, { "s08-a": v => f(v, 1, true), "s08-b": v => f(v, 0, true) });
    X.responsive($("s08-linPlot"), render);
  }
  /* <<< MỤC 8 <<< */

  /* >>> MỤC 9 (viết lại) >>> */
  /* ---------------- MỤC 9: MÔ PHỎNG KHÁM NHIỀU NHÓM 8 NGƯỜI ---------------- */
  if ($("s09-sim")) {
    const n = 8, p = 0.25;
    const cnt = new Array(n + 1).fill(0);
    let groups = 0, sum = 0, sum2 = 0, last = null;
    const theo = []; for (let k = 0; k <= n; k++) theo.push(X.binom(k, n, p));
    const one = () => {
      const seq = []; let x = 0;
      for (let i = 0; i < n; i++) { const s = Math.random() < p; seq.push(s); if (s) x++; }
      cnt[x]++; groups++; sum += x; sum2 += x * x;
      return seq;
    };
    const drawRow = () => {
      const row = $("s09-simRow");
      if (!last) { row.innerHTML = `<span class="small muted">Chưa khám nhóm nào — bấm “Khám 1 nhóm”.</span>`; return; }
      const x = last.filter(Boolean).length;
      row.innerHTML = `<span class="small muted" style="margin-right:6px">Nhóm vừa khám:</span>` + last.map(s =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin:2px;border-radius:50%;font-weight:700;font-size:13px;` +
        (s ? `background:var(--s8);color:#fff">L` : `background:var(--surface-2);color:var(--text-2);border:1px solid var(--border)">–`) + `</span>`).join("") +
        ` <span style="margin-left:6px">→ ${T(`X=${x}`)}</span>`;
    };
    const render = () => {
      drawRow();
      const fr = cnt.map(c => groups ? c / groups : 0);
      const ymax = Math.max(0.35, ...fr) * 1.15;
      const c = X.chart($("s09-simPlot"), { height: 240, xmin: -0.8, xmax: n + 0.8, ymin: 0, ymax });
      c.axes({ xticks: [0, 1, 2, 3, 4, 5, 6, 7, 8], xfmt: v => String(v), ycount: 4, xlabel: "k (số người lệch)" });
      c.bars(fr.map((v, k) => ({ x: k, y: v, fill: soft("var(--s1)") })), { maxW: 40, ratio: 0.75 });
      theo.forEach((v, k) => c.dot(k, v, { fill: "var(--s2)" }));
      c.vline(n * p, { stroke: "var(--s2)" });
      if (groups) c.vline(sum / groups, { stroke: "var(--s1)", "stroke-dasharray": "", "stroke-width": 2 });
      c.hover(xv => {
        const k = Math.round(xv); if (k < 0 || k > n) return null;
        return `k = ${k}: thực tế ${f(fr[k], 3)} (${cnt[k]}/${groups} nhóm) · lí thuyết ${f(theo[k], 4)}`;
      }, { snap: v => Math.round(v), ty: xv => c.y(Math.max(fr[Math.round(xv)] || 0, theo[Math.round(xv)] || 0)) });
      if (!groups) { $("s09-simRead").innerHTML = `Lí thuyết: ${T(`E(X)=np=2`)} · ${T(`D(X)=npq=1{,}5`)}`; return; }
      const mean = sum / groups, v = sum2 / groups - mean * mean;
      $("s09-simRead").innerHTML = `Đã khám <b>${groups}</b> nhóm · trung bình thực tế ${T(`\\bar x=${tf(mean, 3)}`)} (lí thuyết ${T(`E(X)=2`)}) · phương sai thực tế ${T(`${tf(v, 3)}`)} (lí thuyết ${T(`D(X)=1{,}5`)})`;
    };
    $("s09-sim1").onclick = () => { last = one(); render(); };
    $("s09-sim100").onclick = () => { for (let i = 0; i < 100; i++) last = one(); render(); };
    $("s09-simReset").onclick = () => { cnt.fill(0); groups = 0; sum = 0; sum2 = 0; last = null; render(); };
    X.responsive($("s09-simPlot"), render);
  }
  /* <<< MỤC 9 <<< */

  /* >>> MỤC 10 (viết lại) >>> */
  /* ---------------- MỤC 10.1: ĐO RĂNG CỬA CỦA n NGƯỜI → HÌNH CHUÔNG ---------------- */
  if ($("s10-hist")) {
    const MU = 8.5, SD = 0.5, BW = 0.25, LO = 6.5, HI = 10.5;
    const NB = Math.round((HI - LO) / BW);
    let n = 200, showCurve = false, data = [];
    const gauss = () => {
      let u = 0;
      while (u === 0) u = Math.random();
      const v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const sample = () => { data = Array.from({ length: n }, () => MU + SD * gauss()); };
    const segN = $("s10-histN"), segC = $("s10-histCurve");
    const render = () => {
      [...segN.children].forEach(b => b.classList.toggle("on", +b.dataset.n === n));
      [...segC.children].forEach(b => b.classList.toggle("on", (b.dataset.k === "1") === showCurve));
      const cnt = new Array(NB).fill(0);
      let sum = 0, mid = 0;
      data.forEach(v => {
        sum += v;
        if (v > 8 && v < 9) mid++;
        const k = Math.floor((v - LO) / BW);
        if (k >= 0 && k < NB) cnt[k]++;
      });
      const prop = cnt.map(k => k / n);
      const ymax = Math.max(0.24, Math.max(...prop) * 1.15);
      const c = X.chart($("s10-histPlot"), { height: 250, xmin: LO, xmax: HI, ymin: 0, ymax, aria: "biểu đồ cột số đo chiều rộng răng cửa" });
      c.axes({ xticks: [7, 7.5, 8, 8.5, 9, 9.5, 10], xfmt: v => f(v, 1, true), yfmt: v => f(v * 100, 0) + "%", ycount: 4, xlabel: "mm" });
      c.bars(prop.map((p, i) => {
        const xc = LO + (i + 0.5) * BW;
        return { x: xc, y: p, fill: xc > 8 && xc < 9 ? "var(--s1)" : soft("var(--s1)") };
      }), { ratio: 0.94, maxW: 90 });
      if (showCurve) c.curve(x => X.normPdf(x, MU, SD) * BW, LO, HI, { stroke: "var(--s2)", "stroke-width": 2.6 });
      c.hover(xv => {
        const k = Math.floor((xv - LO) / BW);
        if (k < 0 || k >= NB) return null;
        const a = LO + k * BW;
        return `${f(a, 2, true)}–${f(a + BW, 2, true)} mm: ${cnt[k]} người (${f(prop[k] * 100, 1)}%)`;
      });
      $("s10-histRead").innerHTML = `Đã đo <b>${n.toLocaleString("vi-VN")}</b> người · trung bình các số đo ≈ <b>${f(sum / n, 2)} mm</b> · ` +
        `trong khoảng 8–9 mm (cột đậm): <b>${mid}</b> người = <b>${f(mid / n * 100, 1)}%</b>` +
        (showCurve ? `<br><span class="small">Đường cam: tỉ lệ <i>dự đoán</i> cho mỗi cột theo đường chuông ${T("N(8{,}5;\\,0{,}25)")}. Càng nhiều người, các cột càng ôm sát đường này.</span>` : "");
    };
    [...segN.children].forEach(b => b.onclick = () => { n = +b.dataset.n; sample(); render(); });
    [...segC.children].forEach(b => b.onclick = () => { showCurve = b.dataset.k === "1"; render(); });
    $("s10-histAgain").onclick = () => { sample(); render(); };
    sample();
    X.responsive($("s10-histPlot"), render);
  }
  /* <<< MỤC 10 <<< */

  /* >>> MỤC 11 (viết lại) >>> */
  /* ---------------- MỤC 11: BA HÀM l, G, φ (kéo x) ---------------- */
  if ($("s11-three")) {
    const render = () => {
      const x = parseFloat($("s11-x").value);
      const out = document.querySelector('output[for="s11-x"]'); if (out) out.textContent = f(x, 2);
      const c = X.chart($("s11-threePlot"), { height: 250, xmin: -4, xmax: 4, ymin: 0, ymax: 0.46, margin: { top: 18, left: 44 } });
      c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [0, 0.1, 0.2, 0.3, 0.4], xfmt: v => String(v), xlabel: "z" });
      const l = v => X.normPdf(v);
      c.area(l, -4, x, { fill: "var(--s1)", "fill-opacity": .16 });
      if (x > 0) c.area(l, 0, x, { fill: "var(--s2)", "fill-opacity": .5 });
      if (x < 0) c.area(l, x, 0, { fill: "var(--s2)", "fill-opacity": .5 });
      c.curve(l, -4, 4, { stroke: "var(--s1)" });
      c.vline(0, { stroke: "var(--text-2)", "stroke-dasharray": "2 3" }, 0, l(0));
      c.vline(x, { stroke: "var(--s8)", "stroke-width": 3.2, "stroke-dasharray": "none" }, 0, l(x));
      c.dot(x, l(x), { fill: "var(--s8)" });
      c.text(x, l(x), "l(" + f(x, 2) + ")", { dy: -10, class: "svg-strong", style: "font-size:12px;fill:var(--s8)" });
      const G = X.normCdf(x), p = X.phi(x);
      const dau = x < 0 ? ` <span class="small muted">(vùng cam nằm bên trái 0: đi ngược từ 0 sang trái nên mang dấu trừ)</span>` : "";
      const gNote = x > 0 ? "— toàn bộ vùng tô (xanh nhạt + cam)" : x < 0 ? "— chỉ vùng xanh nhạt bên trái x; vùng cam nằm bên phải x nên KHÔNG thuộc G (G = 0,5 − vùng cam)" : "— vùng xanh nhạt, đúng nửa trái chuông";
      $("s11-threeRead").innerHTML =
        `<div><b style="color:var(--s8)">Chiều cao</b> ${T(`l(${tf(x, 2)})\\approx${tf(l(x), 4)}`)} <span class="small muted">— vạch đỏ, KHÔNG phải xác suất</span></div>` +
        `<div style="margin-top:4px"><b style="color:var(--s1)">Diện tích bên trái</b> ${T(`G(${tf(x, 2)})=P(Z\\lt ${tf(x, 2)})\\approx${tf(G, 4)}`)} <span class="small muted">${gNote}</span></div>` +
        `<div style="margin-top:4px"><b style="color:var(--s2)">Diện tích từ 0 đến x</b> ${T(`\\varphi(${tf(x, 2)})\\approx${tf(p, 4)}`)}${dau}</div>` +
        `<div class="small" style="margin-top:6px">Kiểm tra: ${T(`0{,}5+\\varphi(${tf(x, 2)})=0{,}5+(${tf(p, 4)})=${tf(0.5 + p, 4)}`)} — đúng bằng ${T("G")}.</div>`;
    };
    $("s11-x").addEventListener("input", render);
    X.responsive($("s11-threePlot"), render);
  }

  /* ---------------- MỤC 11: CHUẨN HOÁ = ĐỔI THƯỚC ĐO ---------------- */
  if ($("s11-zWidget")) {
    const sets = [
      { name: "Huyết áp", mu: 118, sd: 10, unit: "mmHg", d: 0, tex: "N(118;\\,100)" },
      { name: "Đường huyết", mu: 5, sd: 0.6, unit: "mmol/L", d: 2, tex: "N(5;\\,0{,}36)" },
      { name: "Chuẩn tắc", mu: 0, sd: 1, unit: "", d: 1, tex: "N(0;\\,1)" }
    ];
    let k = 0;
    const btns = $("s11-zBtns");
    sets.forEach((s, i) => {
      const b = document.createElement("button"); b.type = "button"; b.dataset.k = i;
      b.textContent = s.name; if (i === 0) b.className = "on"; btns.appendChild(b);
      b.addEventListener("click", () => { k = i; btns.querySelectorAll("button").forEach(o => o.classList.toggle("on", o === b)); render(); });
    });
    const render = () => {
      const s = sets[k], zv = parseFloat($("s11-zx").value), x = s.mu + zv * s.sd;
      const xs = v => ft(v, s.d + 1);
      const out = document.querySelector('output[for="s11-zx"]'); if (out) out.textContent = "x = " + xs(x) + (s.unit ? " " + s.unit : "");
      const pdf = v => X.normPdf(v, s.mu, s.sd), pk = pdf(s.mu);
      const c = X.chart($("s11-zPlot"), { height: 250, xmin: s.mu - 4 * s.sd, xmax: s.mu + 4 * s.sd, ymin: 0, ymax: pk * 1.18, margin: { left: 34, bottom: 58, top: 14 } });
      const ks = [-3, -2, -1, 0, 1, 2, 3];
      c.axes({ xticks: ks.map(t => s.mu + t * s.sd), xfmt: v => xs(v), noy: true, nogrid: true });
      ks.forEach(t => c.text(s.mu + t * s.sd, 0, (t > 0 ? "+" : t < 0 ? "−" : "") + Math.abs(t), { dy: 38, style: "font-size:11.5px;fill:var(--s7)" }));
      X.el("text", { x: 4, y: c.y(0) + 19, class: "svg-text", style: "font-size:11px" }, c.g).textContent = "x";
      X.el("text", { x: 4, y: c.y(0) + 38, class: "svg-text", style: "font-size:11px;fill:var(--s7)" }, c.g).textContent = "z";
      c.area(pdf, s.mu - 4 * s.sd, x, { fill: "var(--s2)", "fill-opacity": .4 });
      c.curve(pdf, s.mu - 4 * s.sd, s.mu + 4 * s.sd, { stroke: "var(--s1)" });
      c.vline(x, { stroke: "var(--s8)", "stroke-dasharray": "none", "stroke-width": 2 }, 0, pdf(x));
      const G = X.normCdf(zv);
      const lr = zv > 0 ? "bên phải (cao hơn) trung bình" : zv < 0 ? "bên trái (thấp hơn) trung bình" : "đúng bằng trung bình";
      $("s11-zRead").innerHTML =
        `<div>${T(`X\\sim ${s.tex}`)}: ${T(`\\mu=${tf(s.mu, 2, true)}`)}, ${T(`\\sigma=${tf(s.sd, 2, true)}`)}${s.unit ? " " + s.unit : ""}</div>` +
        `<div style="margin-top:4px">${T(`z=\\frac{${tf(x, s.d + 1, true)}-${tf(s.mu, 2, true)}}{${tf(s.sd, 2, true)}}=${tf(zv, 1)}`)} → mốc nằm ${zv === 0 ? "" : "cách trung bình " + ft(Math.abs(zv), 1) + " lần σ, "}${lr}.</div>` +
        `<div style="margin-top:4px">Diện tích cam ${T(`=P(X\\lt ${tf(x, s.d + 1, true)})=P(Z\\lt ${tf(zv, 1)})\\approx${tf(G, 4)}`)}</div>`;
    };
    $("s11-zx").addEventListener("input", render);
    X.responsive($("s11-zPlot"), render);
  }

  /* ---------------- MỤC 11: HÌNH CHUÔNG TÔ VÙNG CHO TỪNG DẠNG ---------------- */
  const s11Bell = (id, o) => {
    const host = $(id); if (!host) return;
    X.responsive(host, () => {
      const mu = o.mu, sd = o.sd, pdf = v => X.normPdf(v, mu, sd), pk = pdf(mu);
      const c = X.chart(host, { height: 210, xmin: mu - 3.6 * sd, xmax: mu + 3.6 * sd, ymin: 0, ymax: pk * 1.3, margin: { left: 22, right: 14, bottom: 52, top: 10 }, minWidth: 260 });
      const ks = [-3, -2, -1, 0, 1, 2, 3];
      c.axes({ xticks: ks.map(t => mu + t * sd), xfmt: v => ft(v, 2), noy: true, nogrid: true });
      ks.forEach(t => c.text(mu + t * sd, 0, (t > 0 ? "+" : t < 0 ? "−" : "") + Math.abs(t), { dy: 36, style: "font-size:11px;fill:var(--s7)" }));
      X.el("text", { x: 2, y: c.y(0) + 19, class: "svg-text", style: "font-size:11px" }, c.g).textContent = "x";
      X.el("text", { x: 2, y: c.y(0) + 36, class: "svg-text", style: "font-size:11px;fill:var(--s7)" }, c.g).textContent = "z";
      (o.regions || []).forEach(r => c.area(pdf, r.a === -Infinity ? mu - 3.6 * sd : r.a, r.b === Infinity ? mu + 3.6 * sd : r.b, { fill: r.fill || "var(--s2)", "fill-opacity": r.op ?? .45 }));
      c.curve(pdf, mu - 3.6 * sd, mu + 3.6 * sd, { stroke: "var(--s1)", "stroke-width": 2 });
      (o.marks || []).forEach(m => {
        c.vline(m.x, { stroke: m.color || "var(--s8)", "stroke-dasharray": "none", "stroke-width": 1.8 }, 0, pk * 1.12);
        c.text(m.x, pk * 1.12, m.label, { dy: -2, class: "svg-strong", style: "font-size:11.5px;fill:" + (m.color || "var(--s8)") });
      });
      (o.labels || []).forEach(t => c.text(t.x, pk * t.y, t.s, { class: "svg-strong", style: "font-size:" + (t.size || 12) + "px" + (t.color ? ";fill:" + t.color : "") }));
    });
  };
  {
    const B = { mu: 118, sd: 10 }, L = "var(--s3)", R = "var(--s2)";
    if ($("s11-fLt")) s11Bell("s11-fLt", Object.assign({}, B, {
      regions: [{ a: -Infinity, b: 118, fill: L, op: .35 }, { a: 118, b: 125, fill: R, op: .5 }],
      marks: [{ x: 125, label: "125" }],
      labels: [{ x: 108, y: 0.35, s: "0,5" }, { x: 121.5, y: 0.5, s: "φ(0,7)", size: 11 }]
    }));
    if ($("s11-fLt2")) s11Bell("s11-fLt2", Object.assign({}, B, {
      regions: [{ a: -Infinity, b: 100, fill: R, op: .55 }, { a: 100, b: 118, fill: L, op: .18 }],
      marks: [{ x: 100, label: "100" }],
      labels: [{ x: 93, y: 0.22, s: "cần tìm", size: 11 }, { x: 110, y: 0.4, s: "0,4641", size: 11 }]
    }));
    if ($("s11-fGt")) s11Bell("s11-fGt", Object.assign({}, B, {
      regions: [{ a: 118, b: 140, fill: L, op: .18 }, { a: 140, b: Infinity, fill: R, op: .6 }],
      marks: [{ x: 140, label: "140" }],
      labels: [{ x: 127, y: 0.4, s: "φ(2,2)", size: 11 }, { x: 146, y: 0.2, s: "cần tìm", size: 11 }]
    }));
    if ($("s11-fGt2")) s11Bell("s11-fGt2", Object.assign({}, B, {
      regions: [{ a: 110, b: 118, fill: L, op: .45 }, { a: 118, b: Infinity, fill: R, op: .45 }],
      marks: [{ x: 110, label: "110" }],
      labels: [{ x: 114, y: 0.45, s: "φ(0,8)", size: 10.5 }, { x: 128, y: 0.35, s: "0,5" }]
    }));
    if ($("s11-fBw")) s11Bell("s11-fBw", Object.assign({}, B, {
      regions: [{ a: 110, b: 118, fill: L, op: .45 }, { a: 118, b: 130, fill: R, op: .45 }],
      marks: [{ x: 110, label: "110" }, { x: 130, label: "130" }],
      labels: [{ x: 114, y: 0.45, s: "φ(0,8)", size: 10.5 }, { x: 124, y: 0.45, s: "φ(1,2)", size: 10.5 }]
    }));
    if ($("s11-fBw2")) s11Bell("s11-fBw2", Object.assign({}, B, {
      regions: [{ a: 118, b: 125, fill: L, op: .2 }, { a: 125, b: 140, fill: R, op: .55 }],
      marks: [{ x: 125, label: "125" }, { x: 140, label: "140" }],
      labels: [{ x: 121.5, y: 0.5, s: "bỏ", size: 11 }, { x: 131, y: 0.4, s: "cần tìm", size: 11 }]
    }));
    if ($("s11-fSym")) s11Bell("s11-fSym", Object.assign({}, B, {
      regions: [{ a: 103, b: 118, fill: L, op: .45 }, { a: 118, b: 133, fill: R, op: .45 }],
      marks: [{ x: 103, label: "103" }, { x: 133, label: "133" }],
      labels: [{ x: 111, y: 0.45, s: "φ(1,5)", size: 11 }, { x: 125, y: 0.45, s: "φ(1,5)", size: 11 }]
    }));
    if ($("s11-fInv")) s11Bell("s11-fInv", Object.assign({}, B, {
      regions: [{ a: -Infinity, b: 134.45, fill: L, op: .2 }, { a: 134.45, b: Infinity, fill: R, op: .65 }],
      marks: [{ x: 134.45, label: "h = ?" }],
      labels: [{ x: 115, y: 0.45, s: "0,95" }, { x: 141, y: 0.18, s: "0,05", size: 11 }]
    }));
  }
  /* <<< MỤC 11 <<< */

  /* >>> MỤC 13 (viết lại) >>> */
  /* ---------------- MỤC 13: MỖI SỐ NGUYÊN LÀ MỘT CỘT RỘNG 1 ---------------- */
  if ($("s13-barFig")) {
    const n = 200, p = 0.2, mu = 40, sd = Math.sqrt(32);
    const render = () => {
      const c = X.chart($("s13-barFig"), { height: 240, xmin: 37.3, xmax: 42.7, ymin: 0, ymax: 0.09, aria: "năm cột nhị thức từ 38 đến 42 nối liền nhau" });
      c.axes({ xticks: [38, 39, 40, 41, 42], xfmt: v => String(v), ycount: 3, yfmt: v => f(v, 2, true) });
      const xs = [38, 39, 40, 41, 42];
      c.bars(xs.map(k => ({ x: k, y: X.binom(k, n, p), fill: k === 40 ? "var(--s1)" : soft("var(--s1)") })), { ratio: 0.995, maxW: 999 });
      c.curve(x => X.normPdf(x, mu, sd), 37.3, 42.7, { stroke: "var(--s2)" });
      [37.5, 38.5, 39.5, 40.5, 41.5, 42.5].forEach(e => {
        c.vline(e, { stroke: "var(--text-2)" });
        c.text(e, 0.083, f(e, 1), { style: "font-size:11px" });
      });
      c.text(40, X.binom(40, n, p) + 0.004, "cột 40", { class: "svg-strong", style: "font-size:12px" });
      c.hover(xv => {
        if (xv < 37.5 || xv > 42.5) return null;
        const k = Math.round(xv);
        return `Số thực ${ft(xv, 2)} thuộc cột <b>${k}</b><br>(cột ${k} chạy từ ${f(k - 0.5, 1)} đến ${f(k + 0.5, 1)})`;
      });
    };
    X.responsive($("s13-barFig"), render);
  }

  /* ---------------- MỤC 13: NĂM QUY TẮC ±0,5 TRÊN CÙNG MỘT HÌNH ---------------- */
  if ($("s13-ruleWidget")) {
    const n = 200, p = 0.2, mu = 40, sd = Math.sqrt(32);
    let rule = "gt", st = { "s13-k": 40 };
    const seg = $("s13-ruleSeg");
    [...seg.children].forEach(b => b.onclick = () => {
      rule = b.dataset.k; [...seg.children].forEach(x => x.classList.toggle("on", x === b)); render();
    });
    const inSet = (j, k) => rule === "eq" ? j === k : rule === "le" ? j <= k : rule === "lt" ? j < k : rule === "ge" ? j >= k : j > k;
    const render = () => {
      const k = Math.round(st["s13-k"]);
      const lo = 24, hi = 56;
      const ymax = 0.085;
      const c = X.chart($("s13-rulePlot"), { height: 250, xmin: lo - 0.6, xmax: hi + 0.6, ymin: 0, ymax, aria: "cột nhị thức B(200; 0,2) và diện tích dưới đường chuông" });
      c.axes({ xticks: [25, 30, 35, 40, 45, 50, 55], xfmt: v => String(v), ycount: 3, yfmt: v => f(v, 2, true) });
      // biên trái L và biên phải R của vùng tô (sau hiệu chỉnh)
      let L = -Infinity, R = Infinity;
      if (rule === "eq") { L = k - 0.5; R = k + 0.5; }
      else if (rule === "le") R = k + 0.5;
      else if (rule === "lt") R = k - 0.5;
      else if (rule === "ge") L = k - 0.5;
      else L = k + 0.5;
      const xs = []; for (let j = lo; j <= hi; j++) xs.push(j);
      c.bars(xs.map(j => ({ x: j, y: X.binom(j, n, p), fill: inSet(j, k) ? "var(--s1)" : soft("var(--s1)") })), { ratio: 0.9, maxW: 40 });
      // vùng cam vẽ đè lên cột (trong suốt) để luôn nhìn thấy
      c.area(x => X.normPdf(x, mu, sd), Math.max(L, lo - 0.6), Math.min(R, hi + 0.6), { fill: "var(--s2)", "fill-opacity": .3 });
      c.curve(x => X.normPdf(x, mu, sd), lo - 0.6, hi + 0.6, { stroke: "var(--s2)" });
      [L, R].filter(isFinite).forEach(e => {
        c.vline(e, { stroke: "var(--s8)", "stroke-dasharray": "5 3", "stroke-width": 1.6 });
        c.text(e, ymax * 0.93, f(e, 1), { class: "svg-strong", style: "font-size:12px" });
      });
      // giá trị chính xác (cộng các cột) và hai cách xấp xỉ
      let exact = 0; for (let j = 0; j <= n; j++) if (inSet(j, k)) exact += X.binom(j, n, p);
      const withC = X.normCdf(R, mu, sd) - X.normCdf(L, mu, sd);
      const noC = rule === "eq" ? 0 : (rule === "le" || rule === "lt") ? X.normCdf(k, mu, sd) : 1 - X.normCdf(k, mu, sd);
      const h = v => tf(v, 1);
      const tex = {
        eq: `P(X=${k})\\approx P(${h(k - 0.5)}\\lt Y\\lt ${h(k + 0.5)})`,
        le: `P(X\\le ${k})\\approx P(Y\\lt ${h(k + 0.5)})`,
        lt: `P(X\\lt ${k})=P(X\\le ${k - 1})\\approx P(Y\\lt ${h(k - 0.5)})`,
        ge: `P(X\\ge ${k})\\approx P(Y\\gt ${h(k - 0.5)})`,
        gt: `P(X\\gt ${k})=P(X\\ge ${k + 1})\\approx P(Y\\gt ${h(k + 0.5)})`
      }[rule];
      const why = {
        eq: `Chỉ lấy đúng cột ${k}: từ mép trái ${f(k - 0.5, 1)} đến mép phải ${f(k + 0.5, 1)}.`,
        le: `Cột ${k} được lấy trọn, nên đi tới mép phải của nó: ${f(k + 0.5, 1)}.`,
        lt: `Cột ${k} bị loại; cột cuối được lấy là ${k - 1}, mép phải của nó là ${f(k - 0.5, 1)}.`,
        ge: `Cột ${k} được lấy trọn, nên bắt đầu từ mép trái của nó: ${f(k - 0.5, 1)}.`,
        gt: `Cột ${k} bị loại; cột đầu tiên được lấy là ${k + 1}, mép trái của nó là ${f(k + 0.5, 1)}.`
      }[rule];
      $("s13-ruleRead").innerHTML = `${T(tex)}<br><span class="small">${why}</span><br>
        Chính xác (cộng các cột xanh đậm): <b>${f(exact, 4)}</b> ·
        Có hiệu chỉnh (vùng cam): <b>${f(withC, 4)}</b> ·
        Không hiệu chỉnh (cắt ngay tại ${k}): <b>${f(noC, 4)}</b>`;
    };
    X.bind(["s13-k"], v => { st = v; render(); }, { "s13-k": v => String(v) });
    X.responsive($("s13-rulePlot"), render);
  }
  /* <<< MỤC 13 <<< */

  /* >>> MỤC 14 (viết lại) >>> */
  /* ---------------- MỤC 14 (mới): tự gieo χ², Student so với Z, trung bình mẫu ---------------- */
  if ($("s14-chiSim")) {
    let k = 3, vals = [], last = null;
    const randn = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
    const drawOne = () => { const z = []; for (let i = 0; i < k; i++) z.push(randn()); const s = z.reduce((a, b) => a + b * b, 0); vals.push(s); last = { z, s }; };
    const render = () => {
      const xmax = Math.max(10, k + 5 * Math.sqrt(2 * k)), nb = 40, bw = xmax / nb;
      const cnt = new Array(nb).fill(0); vals.forEach(v => { const i = Math.floor(v / bw); if (i >= 0 && i < nb) cnt[i]++; });
      const N = vals.length;
      const dens = cnt.map(c => N ? c / (N * bw) : 0);
      let pm = 0; for (let x = bw / 2; x < xmax; x += xmax / 300) pm = Math.max(pm, X.chi2Pdf(x, k));
      const ymax = Math.min(Math.max(pm, ...dens) * 1.15, 1.2);
      const c = X.chart($("s14-chiPlot"), { height: 250, xmin: 0, xmax, ymin: 0, ymax });
      c.axes({ ycount: 4, xcount: 8 });
      if (N) c.bars(dens.map((d, i) => ({ x: (i + 0.5) * bw, y: Math.min(d, ymax), fill: soft("var(--s1)") })), { ratio: 0.96, maxW: 60 });
      c.curve(x => X.chi2Pdf(x, k), 1e-6, xmax, { stroke: "var(--s2)" });
      c.vline(k, { stroke: "var(--text-2)" });
      c.text(k, ymax * 0.92, "E = k = " + k, { "text-anchor": "start", dx: 6 });
      if (last && last.s <= xmax) c.dot(last.s, 0, { fill: "var(--s8)" });
      let html = "";
      if (last) {
        const zs = last.z.map(v => T(tf(v, 2))).join("; ");
        const sq = last.z.map(v => tf(v * v, 2)).join("+");
        html += `Lần gieo mới nhất: ${k} số ${T("Z")} là ${zs}<br>${T(`\\chi^2=${sq}=${tf(last.s, 2)}`)} <span class="small muted">(chấm đỏ trên trục ngang)</span>`;
      } else html += "Bấm <b>Gieo 1 lần</b> để tự tạo một giá trị χ².";
      if (N >= 2) {
        const m = vals.reduce((a, b) => a + b, 0) / N;
        const v = vals.reduce((a, b) => a + (b - m) * (b - m), 0) / N;
        html += `<br>Đã gieo ${N} lần · trung bình các giá trị ≈ <b>${f(m, 2)}</b> (lý thuyết ${T(`E=k=${k}`)}) · phương sai ≈ <b>${f(v, 2)}</b> (lý thuyết ${T(`D=2k=${2 * k}`)})`;
      }
      $("s14-chiRead").innerHTML = html;
    };
    $("s14-chi1").onclick = () => { drawOne(); render(); };
    $("s14-chi500").onclick = () => { for (let i = 0; i < 500; i++) drawOne(); render(); };
    $("s14-chiClr").onclick = () => { vals = []; last = null; render(); };
    X.bind(["s14-chiK"], v => { if (v["s14-chiK"] !== k) { k = v["s14-chiK"]; vals = []; last = null; } render(); }, { "s14-chiK": v => String(v) });
    X.responsive($("s14-chiPlot"), render);
  }

  if ($("s14-tz")) {
    let n = 3;
    const render = () => {
      const c = X.chart($("s14-tzPlot"), { height: 240, xmin: -5, xmax: 5, ymin: 0, ymax: 0.45 });
      c.axes({ ycount: 4, xticks: [-4, -3, -1.96, -1, 0, 1, 1.96, 3, 4], xfmt: v => f(v, 2, true) });
      c.area(x => X.tPdf(x, n), -5, -1.96, { fill: "var(--s2)", "fill-opacity": .35 });
      c.area(x => X.tPdf(x, n), 1.96, 5, { fill: "var(--s2)", "fill-opacity": .35 });
      c.curve(x => X.normPdf(x), -5, 5, { stroke: "var(--muted)", "stroke-dasharray": "5 5", "stroke-width": 1.5 });
      c.curve(x => X.tPdf(x, n), -5, 5, { stroke: "var(--s1)" });
      c.vline(-1.96, { stroke: "var(--s2)" }); c.vline(1.96, { stroke: "var(--s2)" });
      const tail = 2 * (1 - X.tCdf(1.96, n));
      $("s14-tzRead").innerHTML = `Hai đuôi ngoài ${T("\\pm1{,}96")}: ${T(`P(|T(${n})|>1{,}96)\\approx${tf(tail, 4)}`)} so với ${T("P(|Z|>1{,}96)=0{,}05")}` +
        `<br>Đỉnh: ${T(`T(${n})`)} cao ${f(X.tPdf(0, n), 3)}, ${T("Z")} cao 0,399 · Mốc để giữa có 95%: ${T(`t_{0{,}975}(${n})\\approx${tf(X.tInv(0.975, n), 3)}`)} so với ${T("z_{0{,}975}=1{,}96")}` +
        (n >= 3 ? ` · ${T(`D(T)=\\frac{n}{n-2}\\approx${tf(n / (n - 2), 2)}`)}` : "");
    };
    X.bind(["s14-tzN"], v => { n = v["s14-tzN"]; render(); }, { "s14-tzN": v => String(v) });
    X.responsive($("s14-tzPlot"), render);
  }

  if ($("s14-xbar")) {
    const mu = 95, sg = 12; let st = { "s14-xbN": 36, "s14-xbA": 98 };
    const render = () => {
      const n = st["s14-xbN"], a = st["s14-xbA"], se = sg / Math.sqrt(n);
      const pk = 1 / (se * Math.sqrt(2 * Math.PI));
      const c = X.chart($("s14-xbPlot"), { height: 250, xmin: 55, xmax: 135, ymin: 0, ymax: Math.max(pk, 0.04) * 1.12 });
      c.axes({ ycount: 4, xcount: 8, xlabel: "mg/dL" });
      c.area(x => X.normPdf(x, mu, se), 55, a, { fill: "var(--s2)", "fill-opacity": .35 });
      c.curve(x => X.normPdf(x, mu, sg), 55, 135, { stroke: "var(--muted)", "stroke-dasharray": "5 5", "stroke-width": 1.5 });
      c.curve(x => X.normPdf(x, mu, se), 55, 135, { stroke: "var(--s1)" });
      c.vline(a, { stroke: "var(--s2)" });
      const z = (a - mu) / se, z1 = (a - mu) / sg;
      $("s14-xbRead").innerHTML = `${T(`\\overline{X}\\sim N\\big(95;\\ \\tfrac{144}{${n}}\\big)`)}, ${T(`\\sigma(\\overline{X})=\\frac{12}{\\sqrt{${n}}}\\approx${tf(se, 3)}`)}` +
        `<br>${T(`z=\\frac{${tf(a, 1, true)}-95}{${tf(se, 3)}}\\approx${tf(z, 2)}`)} → ${T(`P(\\overline{X}<${tf(a, 1, true)})\\approx${tf(X.normCdf(z), 4)}`)} (phần tô cam)` +
        `<br><span class="small muted">So với một người: ${T(`P(X<${tf(a, 1, true)})\\approx${tf(X.normCdf(z1), 4)}`)} (dưới đường nét đứt)</span>`;
    };
    X.bind(["s14-xbN", "s14-xbA"], v => { st = v; render(); }, { "s14-xbN": v => String(v), "s14-xbA": v => f(v, 1, true) });
    X.responsive($("s14-xbPlot"), render);
  }
  /* <<< MỤC 14 <<< */
});
