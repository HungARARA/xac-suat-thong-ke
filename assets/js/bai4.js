/* ==========================================================
   bai4.js — các hình vẽ và phần tương tác của Bài 4
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

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm4")) X.mindmap($("mm4"), {
    t: "Bài 4<br>Ước lượng",
    c: [
      { t: "Ý tưởng", c: [{ t: "Điểm: $\\overline x\\to\\mu$, $f\\to p$, $s^2\\to\\sigma^2$" }, { t: "Khoảng = điểm ± hệ số × sai số chuẩn" }, { t: "“95%” là độ tin cậy của cách làm" }] },
      { t: "Hệ số", c: [{ t: "$z_{1-\\alpha/2}$: 1,645 · 1,96 · 2,576" }, { t: "$t^{\\,n-1}_{1-\\alpha/2}$ khi $n\\le30$, chưa biết $\\sigma$" }, { t: "$\\chi^2$ hai đầu cho phương sai" }] },
      { t: "Một mẫu", c: [{ t: "$\\mu$: 3 trường hợp" }, { t: "$p$: $f\\pm z\\sqrt{f(1-f)/n}$" }, { t: "$\\sigma^2$: $\\frac{(n-1)s^2}{\\chi^2}$" }] },
      { t: "Cỡ mẫu", c: [{ t: "$n\\ge(z\\sigma/\\varepsilon)^2$" }, { t: "$n\\ge\\frac{z^2f(1-f)}{\\varepsilon^2}$ hoặc $\\frac{z^2}{4\\varepsilon^2}$" }, { t: "Làm tròn lên · độ dài $=2\\varepsilon$" }] },
      { t: "Bài ngược", c: [{ t: "Tâm $\\frac{a+b}{2}$, bán kính $\\frac{b-a}{2}$" }, { t: "Tìm $z$ → độ tin cậy $2\\varphi(z)$" }, { t: "Tìm $s$, $n$, số người $k$" }] },
      { t: "Hai mẫu", c: [{ t: "$\\mu_1-\\mu_2$: 4 trường hợp, $s^2$ gộp" }, { t: "$p_1-p_2$" }, { t: "Đọc vị trí số 0" }] }
    ]
  }, { colW: 240 });

  /* ---------------- 100 KHOẢNG TIN CẬY ---------------- */
  if ($("ciSim")) {
    let n = 25, conf = 95, seed = 1;
    const run = () => {
      const r = rng(seed * 7919 + n * 31 + conf);
      const a = 1 - conf / 100, mu = 50, sig = 10;
      const k = n <= 30 ? X.tInv(1 - a / 2, n - 1) : X.invNorm(1 - a / 2);
      const rows = [];
      for (let i = 0; i < 100; i++) {
        let sm = 0, sq = 0; const xs = [];
        for (let j = 0; j < n; j++) { const v = mu + sig * gauss(r); xs.push(v); sm += v; }
        const m = sm / n; xs.forEach(v => { sq += (v - m) ** 2; });
        const s = Math.sqrt(sq / (n - 1)), e = k * s / Math.sqrt(n);
        rows.push({ m, lo: m - e, hi: m + e, ok: m - e < mu && mu < m + e });
      }
      const span = Math.max(4, Math.max(...rows.map(o => Math.max(o.hi - mu, mu - o.lo))) * 1.08);
      const c = X.chart($("ciPlot"), { height: 330, xmin: mu - span, xmax: mu + span, ymin: 0, ymax: 101, margin: { left: 30, top: 8 } });
      c.axes({ noy: true, nogrid: true, xlabel: "giá trị" });
      rows.forEach((o, i) => {
        X.el("line", { x1: c.x(o.lo), x2: c.x(o.hi), y1: c.y(i + 1), y2: c.y(i + 1), stroke: o.ok ? "var(--s3)" : "var(--s8)", "stroke-width": o.ok ? 1.6 : 2.6 }, c.g);
        X.el("circle", { cx: c.x(o.m), cy: c.y(i + 1), r: 1.6, fill: "var(--text-2)" }, c.g);
      });
      c.vline(mu, { stroke: "var(--text)", "stroke-width": 1.6, "stroke-dasharray": "" }, 0, 101);
      const hit = rows.filter(o => o.ok).length;
      $("ciRead").innerHTML = `<div class="row"><span class="kv">Hệ số dùng: <b>${n <= 30 ? "t" : "z"} = ${f(k, 3)}</b> (${n <= 30 ? `Student, ${n - 1} bậc tự do` : "chuẩn"})</span><span class="kv">Số khoảng chứa μ = 50: <b>${hit}/100</b></span><span class="kv">Trượt: <b style="color:var(--s8)">${100 - hit}</b> (lý thuyết khoảng ${f(100 - conf, 0)})</span></div>`;
    };
    X.bind(["ciN", "ciC"], v => { n = v.ciN; conf = v.ciC; run(); }, { ciN: v => String(v), ciC: v => String(v) });
    $("ciBtns").addEventListener("click", e => { if (e.target.dataset.a) { seed++; run(); } });
    X.responsive($("ciPlot"), run);
  }

  /* ---------------- ĐƯỜNG CHUÔNG VỚI HAI ĐUÔI ---------------- */
  function drawZ(host, conf, height = 230) {
    const a = 1 - conf / 100, z = X.invNorm(1 - a / 2);
    const c = X.chart(host, { height, xmin: -4, xmax: 4, ymin: 0, ymax: 0.46 });
    c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [0, 0.1, 0.2, 0.3, 0.4], yfmt: v => X.fmt(v, 1, true) });
    c.area(x => X.normPdf(x), -z, z, { fill: "var(--s1)", "fill-opacity": .3 });
    c.area(x => X.normPdf(x), -4, -z, { fill: "var(--s8)", "fill-opacity": .45 });
    c.area(x => X.normPdf(x), z, 4, { fill: "var(--s8)", "fill-opacity": .45 });
    c.curve(x => X.normPdf(x), -4, 4);
    c.vline(-z, { stroke: "var(--s8)" }, 0, 0.42); c.vline(z, { stroke: "var(--s8)" }, 0, 0.42);
    c.text(0, 0.14, `${X.fmt(conf, 1, true)}%`, { class: "svg-strong", style: "font-size:14px" });
    c.text(z, 0.43, `z = ${f(z, 3)}`, { class: "svg-strong", style: "fill:var(--s8);font-size:12.5px" });
    c.text(-z, 0.43, `−${f(z, 3)}`, { style: "fill:var(--s8);font-size:12.5px" });
    const tail = Math.min(3.6, z + 0.7);
    c.text(tail, 0.06, `${X.fmt(a / 2 * 100, 2, true)}%`, { style: "fill:var(--s8);font-size:12px" });
    c.text(-tail, 0.06, `${X.fmt(a / 2 * 100, 2, true)}%`, { style: "fill:var(--s8);font-size:12px" });
    return { a, z };
  }
  if ($("zFig")) X.responsive($("zFig"), () => drawZ($("zFig"), 95));
  if ($("zWidget")) {
    let conf = 95;
    const render = () => {
      const { a, z } = drawZ($("zPlot"), conf);
      $("zRead").innerHTML = `<div class="row"><span class="kv">$1-\\alpha=${tf(conf / 100, 3, true)}$</span><span class="kv">$\\alpha=${tf(a, 3, true)}$</span><span class="kv">mỗi đuôi $\\frac{\\alpha}{2}=${tf(a / 2, 4, true)}$</span><span class="kv">$1-\\frac{\\alpha}{2}=${tf(1 - a / 2, 4, true)}$</span><span class="kv">$z_{1-\\alpha/2}=${tf(z, 3)}$</span></div>`;
      math($("zRead"));
    };
    X.bind(["zc"], v => { conf = v.zc; render(); }, { zc: v => X.fmt(v, 1, true) });
    X.responsive($("zPlot"), render);
  }

  /* ---------------- STUDENT SO VỚI CHUẨN ---------------- */
  if ($("tFig")) X.responsive($("tFig"), () => {
    const c = X.chart($("tFig"), { height: 240, xmin: -4.5, xmax: 4.5, ymin: 0, ymax: 0.44 });
    c.axes({ xticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], yticks: [0, 0.1, 0.2, 0.3, 0.4], yfmt: v => X.fmt(v, 1, true) });
    c.area(x => X.tPdf(x, 4), 2.776, 4.5, { fill: "var(--s2)", "fill-opacity": .35 });
    c.area(x => X.normPdf(x), 1.96, 4.5, { fill: "var(--s1)", "fill-opacity": .3 });
    c.curve(x => X.normPdf(x), -4.5, 4.5, { stroke: "var(--s1)" });
    c.curve(x => X.tPdf(x, 4), -4.5, 4.5, { stroke: "var(--s2)", "stroke-width": 2.4 });
    c.vline(1.96, { stroke: "var(--s1)" }, 0, 0.3); c.vline(2.776, { stroke: "var(--s2)" }, 0, 0.3);
    c.text(1.96, 0.31, "1,96", { dy: -4, style: "fill:var(--s1);font-size:12px" });
    c.text(2.776, 0.31, "2,776", { dy: -18, style: "fill:var(--s2);font-size:12px" });
    c.text(-2.6, 0.36, "chuẩn N(0;1)", { style: "fill:var(--s1);font-size:12px" });
    c.text(-2.6, 0.32, "Student t(4)", { style: "fill:var(--s2);font-size:12px" });
  });

  /* ---------------- BÁN KÍNH THAY ĐỔI ---------------- */
  if ($("widthWidget")) {
    let n = 36, s = 12, conf = 95;
    const render = () => {
      const z = X.invNorm(1 - (1 - conf / 100) / 2), e = z * s / Math.sqrt(n), e0 = 1.96 * 12 / 6, m = 152;
      const c = X.chart($("widthPlot"), { height: 150, xmin: 105, xmax: 199, ymin: 0, ymax: 3, margin: { left: 20 } });
      c.axes({ noy: true, nogrid: true, xticks: [110, 120, 130, 140, 150, 160, 170, 180, 190], xlabel: "phút" });
      const bar = (lo, hi, y, col, w) => { X.el("line", { x1: c.x(Math.max(105, lo)), x2: c.x(Math.min(199, hi)), y1: c.y(y), y2: c.y(y), stroke: col, "stroke-width": w, "stroke-linecap": "round" }, c.g); };
      bar(m - e0, m + e0, 0.9, "var(--border-strong)", 6);
      bar(m - e, m + e, 2.0, "var(--s1)", 8);
      c.dot(m, 2.0, { fill: "var(--s2)" });
      c.text(m, 2.45, `${f(m - e, 2)} ; ${f(m + e, 2)}`, { class: "svg-strong", style: "font-size:12.5px" });
      c.text(m, 0.35, "mốc so sánh: n = 36, độ lệch 12, 95%", { style: "font-size:11.5px" });
      $("widthRead").innerHTML = `<div class="row"><span class="kv">$z=${tf(z, 3)}$</span><span class="kv">sai số chuẩn $\\frac{${tf(s, 1, true)}}{\\sqrt{${n}}}=${tf(s / Math.sqrt(n), 3)}$</span><span class="kv">bán kính $\\varepsilon=${tf(e, 3)}$</span><span class="kv">độ dài $2\\varepsilon=${tf(2 * e, 3)}$</span></div>`;
      math($("widthRead"));
    };
    X.bind(["wN", "wS", "wC"], v => { n = v.wN; s = v.wS; conf = v.wC; render(); }, { wN: v => String(v), wS: v => X.fmt(v, 1, true), wC: v => X.fmt(v, 1, true) });
    X.responsive($("widthPlot"), render);
  }

  /* ---------------- f(1−f) ---------------- */
  if ($("fqFig")) X.responsive($("fqFig"), () => {
    const c = X.chart($("fqFig"), { height: 220, xmin: 0, xmax: 1, ymin: 0, ymax: 0.3 });
    c.axes({ xticks: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1], yticks: [0, 0.05, 0.1, 0.15, 0.2, 0.25], yfmt: v => X.fmt(v, 2, true), xlabel: "f" });
    c.curve(x => x * (1 - x), 0, 1);
    c.hline(0.25, { stroke: "var(--s8)" });
    c.dot(0.5, 0.25, { fill: "var(--s8)" });
    c.text(0.5, 0.25, "lớn nhất: 0,25 khi f = 0,5", { dy: -10, class: "svg-strong", style: "fill:var(--s8);font-size:12px" });
    c.dot(0.62, 0.62 * 0.38, { fill: "var(--s2)" });
    c.text(0.62, 0.62 * 0.38, "f = 0,62 → 0,2356", { dx: 8, dy: 16, "text-anchor": "start", style: "fill:var(--s2);font-size:12px" });
  });

  /* ---------------- χ² CHO PHƯƠNG SAI ---------------- */
  if ($("chiFig")) X.responsive($("chiFig"), () => {
    const k = 20, lo = 9.591, hi = 34.17;
    const c = X.chart($("chiFig"), { height: 240, xmin: 0, xmax: 46, ymin: 0, ymax: 0.075 });
    c.axes({ xticks: [0, 10, 20, 30, 40], yticks: [0, 0.02, 0.04, 0.06], yfmt: v => X.fmt(v, 2, true) });
    c.area(x => X.chi2Pdf(x, k), lo, hi, { fill: "var(--s1)", "fill-opacity": .28 });
    c.area(x => X.chi2Pdf(x, k), 0.01, lo, { fill: "var(--s8)", "fill-opacity": .45 });
    c.area(x => X.chi2Pdf(x, k), hi, 46, { fill: "var(--s8)", "fill-opacity": .45 });
    c.curve(x => X.chi2Pdf(x, k), 0.01, 46);
    c.vline(lo, { stroke: "var(--s8)" }, 0, 0.068); c.vline(hi, { stroke: "var(--s8)" }, 0, 0.068);
    c.text(lo, 0.069, "9,591", { dy: -3, style: "fill:var(--s8);font-size:12px" });
    c.text(hi, 0.069, "34,170", { dy: -3, style: "fill:var(--s8);font-size:12px" });
    c.text(20, 0.022, "95%", { class: "svg-strong" });
    c.text(4.5, 0.012, "2,5%", { style: "fill:var(--s8);font-size:11.5px" });
    c.text(39, 0.012, "2,5%", { style: "fill:var(--s8);font-size:11.5px" });
  });

  /* ---------------- ĐỌC KHOẢNG CHO HIỆU ---------------- */
  if ($("diffFig")) {
    const svg = svgBox($("diffFig"), 600, 230, 640);
    const xs = v => 40 + (v + 10) * 25;
    X.el("line", { x1: 30, x2: 580, y1: 190, y2: 190, stroke: "var(--border-strong)", "stroke-width": 1.4 }, svg);
    for (let v = -10; v <= 12; v += 2) { X.el("line", { x1: xs(v), x2: xs(v), y1: 186, y2: 194, stroke: "var(--border-strong)" }, svg); txt(svg, xs(v), 212, String(v).replace("-", "−"), { style: "font-size:12px" }); }
    X.el("line", { x1: xs(0), x2: xs(0), y1: 20, y2: 190, stroke: "var(--text)", "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
    txt(svg, xs(0), 14, "0 = hai nhóm bằng nhau", { style: "font-size:12px" });
    const bars = [
      { lo: 2, hi: 9, y: 55, col: "var(--s3)", t: "(2; 9): nhóm 1 lớn hơn" },
      { lo: -3, hi: 5, y: 105, col: "var(--text-2)", t: "(−3; 5): chưa đủ cơ sở" },
      { lo: -8, hi: -1, y: 155, col: "var(--s2)", t: "(−8; −1): nhóm 2 lớn hơn" }
    ];
    bars.forEach(b => {
      X.el("line", { x1: xs(b.lo), x2: xs(b.hi), y1: b.y, y2: b.y, stroke: b.col, "stroke-width": 8, "stroke-linecap": "round" }, svg);
      txt(svg, xs((b.lo + b.hi) / 2), b.y - 12, b.t, { class: "svg-strong", style: `font-size:12.5px;fill:${b.col}` });
    });
  }
});
