/* ==========================================================
   bai5.js — các hình vẽ và phần tương tác của Bài 5
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const tf = (v, d = 4, trim = false) => X.tfmt(v, d, trim);

  const svgBox = (host, W, H, maxW) => X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: `width:100%;height:auto;display:block;max-width:${maxW || W}px;margin:0 auto` }, host);
  const txt = (svg, x, y, s, attrs = {}) => { const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg); e.textContent = s; return e; };
  const math = el => { if (window.renderMath) window.renderMath(el); };
  /* giá trị tới hạn làm tròn 3 chữ số như Phụ lục 3 */
  const zq = p => Math.round(X.invNorm(p) * 1000) / 1000;
  const RED = { fill: "var(--s8)", "fill-opacity": .42 };
  const PUR = { fill: "var(--s7)", "fill-opacity": .42 };
  /* nút chọn dạng H (seg): gọi cb(h) khi bấm */
  const seg = (id, cb) => {
    const box = $(id);
    box.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      [...box.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
      cb(+b.dataset.h);
    });
  };
  const decide = (h, z, C) => h === 1 ? z > C : h === 2 ? z < -C : Math.abs(z) > C;

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm5")) X.mindmap($("mm5"), {
    t: "Bài 5<br>Kiểm định",
    c: [
      { t: "Logic", c: [{ t: "$H_0:\\theta=\\theta_0$ · $H$: $&gt;$, $&lt;$, $\\ne$" }, { t: "Giả sử $H_0$ đúng → mẫu có quá hiếm?" }, { t: "Sai lầm loại 1 ($\\alpha$), loại 2 ($\\beta$)" }] },
      { t: "Bốn bước", c: [{ t: "B1 lập $H_0$, $H$" }, { t: "B2 giá trị tới hạn $C$: $z_{1-\\alpha}$ hoặc $z_{1-\\alpha/2}$" }, { t: "B3 giá trị thực nghiệm" }, { t: "B4 so sánh (xét dấu khi một phía)" }] },
      { t: "Một mẫu", c: [{ t: "$\\mu$: $Z$ (biết $\\sigma$ / $n&gt;30$), $T$ ($n\\le30$)" }, { t: "$p$: $Z$ với $p_0(1-p_0)$" }, { t: "$\\sigma^2$: $\\chi^2$, chỉ $H:\\sigma^2&gt;\\sigma_0^2$" }] },
      { t: "Hai mẫu", c: [{ t: "$\\sigma_1^2$ và $\\sigma_2^2$: $F$, $s^2$ lớn lên trên" }, { t: "$\\mu_1$ và $\\mu_2$: 4 trường hợp + ghép cặp" }, { t: "$p_1$ và $p_2$: tần suất gộp $f_0$" }] },
      { t: "p-value", c: [{ t: "một phía $0{,}5-\\varphi(|Z|)$" }, { t: "hai phía $2[0{,}5-\\varphi(|Z|)]$" }, { t: "p-value $&lt;\\alpha$ → bác bỏ" }] },
      { t: "Bài ngược", c: [{ t: "Ngưỡng $\\overline x^*$, số ca tới hạn $k$" }, { t: "Cỡ mẫu tối thiểu: làm tròn lên" }, { t: "Tìm $s$, $\\overline x$, $\\alpha$ từ $Z$, p-value" }] }
    ]
  }, { colW: 250 });

  /* ---------------- HÌNH 1.1: x̄ KHI H0 ĐÚNG ---------------- */
  if ($("nullFig")) X.responsive($("nullFig"), () => {
    const c = X.chart($("nullFig"), { height: 240, xmin: 142, xmax: 158, ymin: 0, ymax: 0.25 });
    c.axes({ xticks: [142, 144, 146, 148, 150, 152, 154, 156, 158], yticks: [0, 0.05, 0.1, 0.15, 0.2], yfmt: v => X.fmt(v, 2, true), xlabel: "phút" });
    const pdf = x => X.normPdf(x, 150, 2);
    c.area(pdf, 142, 146, RED);
    c.curve(pdf, 142, 158);
    c.vline(146.08, {}, 0, 0.215); c.vline(153.92, {}, 0, 0.215);
    c.text(150, 0.228, "95% mẫu: 146,08 – 153,92", { style: "font-size:12px;fill:var(--text-2)" });
    c.vline(146, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, 0.165);
    c.text(146, 0.175, "x̄ = 146", { "text-anchor": "end", dx: -4, class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
    c.text(144.2, 0.03, "2,28%", { style: "fill:var(--s8);font-size:12px;font-weight:700" });
  });

  /* ---------------- α VÀ β ---------------- */
  if ($("errWidget")) {
    let a = 0.05, mu = 146, n = 36;
    const render = () => {
      const se = 12 / Math.sqrt(n), zc = zq(1 - a), crit = 150 - zc * se;
      const beta = 1 - X.normCdf(crit, mu, se);
      const xmin = Math.min(mu, 150) - 4 * se, xmax = 150 + 4 * se, top = X.normPdf(0) / se;
      const c = X.chart($("errPlot"), { height: 250, xmin, xmax, ymin: 0, ymax: top * 1.25 });
      c.axes({ noy: true, nogrid: true, xlabel: "trung bình mẫu (phút)" });
      const p0 = x => X.normPdf(x, 150, se), p1 = x => X.normPdf(x, mu, se);
      c.area(p1, crit, xmax, { fill: "var(--s2)", "fill-opacity": .35 });
      c.area(p0, xmin, crit, RED);
      c.curve(p0, xmin, xmax, { stroke: "var(--s1)" });
      c.curve(p1, xmin, xmax, { stroke: "var(--s2)", "stroke-width": 2.4 });
      c.vline(crit, { stroke: "var(--s8)", "stroke-width": 2, "stroke-dasharray": "" }, 0, top * 1.1);
      c.text(crit, top * 1.15, `ngưỡng ${f(crit, 2)}`, { class: "svg-strong", style: "fill:var(--s8);font-size:12px" });
      c.text(150, top * 1.03, "H₀: μ = 150", { dx: 6, "text-anchor": "start", style: "fill:var(--s1);font-size:12px" });
      if (mu < 149.5) c.text(mu, top * 1.03, `μ = ${f(mu, 1, true)}`, { dx: -6, "text-anchor": "end", style: "fill:var(--s2);font-size:12px" });
      $("errRead").innerHTML = `<div class="row"><span class="kv">sai số chuẩn $\\frac{12}{\\sqrt{${n}}}=${tf(se, 3)}$</span><span class="kv">ngưỡng $150-${tf(zc, 3)}\\cdot${tf(se, 3)}=${tf(crit, 2)}$</span></div><div class="row"><span class="kv">sai lầm loại 1: $\\alpha=${tf(a, 3, true)}$</span><span class="kv">sai lầm loại 2: $\\beta\\approx${tf(beta, 3)}$</span><span class="kv">khả năng phát hiện $1-\\beta\\approx${tf(1 - beta, 3)}$</span></div>`;
      math($("errRead"));
    };
    X.bind(["errA", "errMu", "errN"], v => { a = v.errA; mu = v.errMu; n = v.errN; render(); }, { errA: v => X.fmt(v, 3, true), errMu: v => X.fmt(v, 1, true), errN: v => String(v) });
    X.responsive($("errPlot"), render);
  }

  /* ---------------- MIỀN BÁC BỎ TRÊN N(0;1) ---------------- */
  function drawRej(host, h, C, zobs, height = 240) {
    const c = X.chart(host, { height, xmin: -4, xmax: 4, ymin: 0, ymax: 0.47 });
    c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [0, 0.1, 0.2, 0.3, 0.4], yfmt: v => X.fmt(v, 1, true) });
    const pdf = x => X.normPdf(x);
    if (h !== 2) c.area(pdf, C, 4, RED);
    if (h !== 1) c.area(pdf, -4, -C, RED);
    c.curve(pdf, -4, 4);
    if (h !== 2) { c.vline(C, { stroke: "var(--s8)" }, 0, 0.42); c.text(C, 0.435, f(C, 3), { style: "fill:var(--s8);font-size:12px" }); }
    if (h !== 1) { c.vline(-C, { stroke: "var(--s8)" }, 0, 0.42); c.text(-C, 0.435, "−" + f(C, 3), { style: "fill:var(--s8);font-size:12px" }); }
    if (zobs != null) {
      const zz = Math.max(-3.9, Math.min(3.9, zobs));
      c.vline(zz, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, 0.33);
      c.text(zz, 0.345, "Z = " + f(zobs, 2), { class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
    }
    return c;
  }
  if ($("rejWidget")) {
    let h = 3, a = 0.05, zv = -2;
    const render = () => {
      const C = h === 3 ? zq(1 - a / 2) : zq(1 - a);
      drawRej($("rejPlot"), h, C, zv);
      const region = h === 1 ? `Z&gt;${tf(C, 3)}` : h === 2 ? `Z&lt;-${tf(C, 3)}` : `|Z|&gt;${tf(C, 3)}`;
      const lvl = h === 3 ? `z_{1-\\alpha/2}=z_{${tf(1 - a / 2, 4, true)}}` : `z_{1-\\alpha}=z_{${tf(1 - a, 3, true)}}`;
      const rej = decide(h, zv, C);
      $("rejRead").innerHTML = `<div class="row"><span class="kv">$C=${lvl}=${tf(C, 3)}$</span><span class="kv">miền bác bỏ: $${region}$</span></div><div class="row"><span class="kv">$Z=${tf(zv, 2)}$ → <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$" : "chưa đủ cơ sở bác bỏ $H_0$"}</b></span></div>`;
      math($("rejRead"));
    };
    seg("rejH", v => { h = v; render(); });
    X.bind(["rejA", "rejZ"], v => { a = v.rejA; zv = v.rejZ; render(); }, { rejA: v => X.fmt(v, 3, true), rejZ: v => X.fmt(v, 2) });
    X.responsive($("rejPlot"), render);
  }
  if ($("th1Fig")) X.responsive($("th1Fig"), () => drawRej($("th1Fig"), 3, 1.96, 2, 230));

  /* ---------------- STUDENT t(9) SO VỚI CHUẨN, MỘT PHÍA ---------------- */
  if ($("t9Fig")) X.responsive($("t9Fig"), () => {
    const c = X.chart($("t9Fig"), { height: 240, xmin: -4, xmax: 4, ymin: 0, ymax: 0.45 });
    c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [0, 0.1, 0.2, 0.3, 0.4], yfmt: v => X.fmt(v, 1, true) });
    c.area(x => X.normPdf(x), 1.645, 4, { fill: "var(--s1)", "fill-opacity": .3 });
    c.area(x => X.tPdf(x, 9), 1.833, 4, { fill: "var(--s2)", "fill-opacity": .4 });
    c.curve(x => X.normPdf(x), -4, 4, { stroke: "var(--s1)" });
    c.curve(x => X.tPdf(x, 9), -4, 4, { stroke: "var(--s2)", "stroke-width": 2.4 });
    c.vline(1.645, { stroke: "var(--s1)" }, 0, 0.3); c.vline(1.833, { stroke: "var(--s2)" }, 0, 0.3);
    c.text(1.645, 0.315, "1,645", { "text-anchor": "end", dx: -2, style: "fill:var(--s1);font-size:12px" });
    c.text(1.833, 0.315, "1,833", { "text-anchor": "start", dx: 2, style: "fill:var(--s2);font-size:12px" });
    c.text(-2.5, 0.37, "chuẩn N(0;1)", { style: "fill:var(--s1);font-size:12px" });
    c.text(-2.5, 0.33, "Student t(9)", { style: "fill:var(--s2);font-size:12px" });
  });

  /* ---------------- MÁY KIỂM ĐỊNH TRUNG BÌNH ---------------- */
  if ($("testWidget")) {
    let h = 2, xb = 146, n = 36, s = 12, a = 0.05;
    const render = () => {
      const se = s / Math.sqrt(n), Z = (xb - 150) / se;
      const C = h === 3 ? zq(1 - a / 2) : zq(1 - a), cr = C * se;
      const xmin = Math.min(150 - 4 * se, xb - 0.6 * se), xmax = Math.max(150 + 4 * se, xb + 0.6 * se), top = X.normPdf(0) / se;
      const c = X.chart($("tPlot"), { height: 240, xmin, xmax, ymin: 0, ymax: top * 1.3 });
      c.axes({ noy: true, nogrid: true, xlabel: "trung bình mẫu" });
      const pdf = x => X.normPdf(x, 150, se);
      if (h !== 2) c.area(pdf, 150 + cr, xmax, RED);
      if (h !== 1) c.area(pdf, xmin, 150 - cr, RED);
      c.curve(pdf, xmin, xmax);
      if (h !== 2) { c.vline(150 + cr, { stroke: "var(--s8)" }, 0, top * 1.12); c.text(150 + cr, top * 1.17, f(150 + cr, 2), { "text-anchor": "start", dx: 2, style: "fill:var(--s8);font-size:12px" }); }
      if (h !== 1) { c.vline(150 - cr, { stroke: "var(--s8)" }, 0, top * 1.12); c.text(150 - cr, top * 1.17, f(150 - cr, 2), { "text-anchor": "end", dx: -2, style: "fill:var(--s8);font-size:12px" }); }
      c.vline(xb, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, top * 0.8);
      c.text(xb, top * 0.86, "x̄ = " + f(xb, 1, true), { class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
      const rej = decide(h, Z, C);
      const pv = h === 1 ? 1 - X.normCdf(Z) : h === 2 ? X.normCdf(Z) : 2 * (1 - X.normCdf(Math.abs(Z)));
      const thr = h === 1 ? `\\overline x&gt;${tf(150 + cr, 2)}` : h === 2 ? `\\overline x&lt;${tf(150 - cr, 2)}` : `\\overline x&lt;${tf(150 - cr, 2)}\\ \\text{hoặc}\\ \\overline x&gt;${tf(150 + cr, 2)}`;
      $("tRead").innerHTML = `<div class="row"><span class="kv">sai số chuẩn $${tf(se, 3)}$</span><span class="kv">$Z=\\frac{${tf(xb, 1, true)}-150}{${tf(se, 3)}}=${tf(Z, 3)}$</span><span class="kv">$C=${tf(C, 3)}$</span></div><div class="row"><span class="kv">bác bỏ khi $${thr}$</span><span class="kv">p-value $\\approx${tf(pv, 4)}$</span></div><div class="row"><span class="kv">→ <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$" : "chưa đủ cơ sở bác bỏ $H_0$"}</b></span></div>`;
      math($("tRead"));
    };
    seg("tH", v => { h = v; render(); });
    X.bind(["tX", "tN", "tS", "tA"], v => { xb = v.tX; n = v.tN; s = v.tS; a = v.tA; render(); }, { tX: v => X.fmt(v, 1, true), tN: v => String(v), tS: v => X.fmt(v, 1, true), tA: v => X.fmt(v, 3, true) });
    X.responsive($("tPlot"), render);
  }

  /* ---------------- HÌNH 2.3: KHOẢNG TIN CẬY ↔ KIỂM ĐỊNH ---------------- */
  if ($("dualFig")) {
    const svg = svgBox($("dualFig"), 560, 250, 620);
    const lo = 4.35, hi = 5.1, xs = v => 30 + (v - lo) / (hi - lo) * 500;
    X.el("line", { x1: 20, x2: 540, y1: 200, y2: 200, stroke: "var(--border-strong)", "stroke-width": 1.4 }, svg);
    for (let v = 4.4; v <= 5.1001; v += 0.1) { X.el("line", { x1: xs(v), x2: xs(v), y1: 195, y2: 205, stroke: "var(--border-strong)" }, svg); txt(svg, xs(v), 232, X.fmt(v, 1), { style: "font-size:19px" }); }
    X.el("line", { x1: xs(4.5), x2: xs(4.5), y1: 30, y2: 200, stroke: "var(--s8)", "stroke-width": 2.5, "stroke-dasharray": "7 5" }, svg);
    txt(svg, xs(4.5), 22, "μ₀ = 4,5", { class: "svg-strong", style: "font-size:20px;fill:var(--s8)" });
    const bar = (a, b, y, col, t) => {
      X.el("line", { x1: xs(a), x2: xs(b), y1: y, y2: y, stroke: col, "stroke-width": 11, "stroke-linecap": "round" }, svg);
      X.el("circle", { cx: xs(4.74), cy: y, r: 6, fill: "var(--surface)", stroke: col, "stroke-width": 3 }, svg);
      txt(svg, xs(4.74) + 30, y - 18, t, { class: "svg-strong", style: `font-size:20px;fill:${col}` });
    };
    bar(4.5048, 4.9752, 88, "var(--s1)", "khoảng 95%: (4,505; 4,975)");
    bar(4.4309, 5.0491, 160, "var(--s2)", "khoảng 99%: (4,431; 5,049)");
  }

  /* ---------------- p-VALUE ---------------- */
  if ($("pvWidget")) {
    let h = 2, zv = -2;
    const render = () => {
      const c = X.chart($("pvPlot"), { height: 240, xmin: -4, xmax: 4, ymin: 0, ymax: 0.47 });
      c.axes({ xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [0, 0.1, 0.2, 0.3, 0.4], yfmt: v => X.fmt(v, 1, true) });
      const pdf = x => X.normPdf(x), az = Math.abs(zv), C5 = h === 3 ? 1.96 : 1.645;
      if (h === 1) c.area(pdf, zv, 4, PUR);
      else if (h === 2) c.area(pdf, -4, zv, PUR);
      else { c.area(pdf, az, 4, PUR); c.area(pdf, -4, -az, PUR); }
      c.curve(pdf, -4, 4);
      if (h !== 2) c.vline(C5, { stroke: "var(--s8)" }, 0, 0.42);
      if (h !== 1) c.vline(-C5, { stroke: "var(--s8)" }, 0, 0.42);
      const zz = Math.max(-3.9, Math.min(3.9, zv));
      c.vline(zz, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, 0.33);
      c.text(zz, 0.345, "Z = " + f(zv, 2), { class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
      const pv = h === 1 ? 1 - X.normCdf(zv) : h === 2 ? X.normCdf(zv) : 2 * (1 - X.normCdf(az));
      const same = h === 3 || (h === 1 ? zv >= 0 : zv <= 0);
      const how = h === 3 ? `2\\big[0{,}5-\\varphi(${tf(az, 2)})\\big]` : same ? `0{,}5-\\varphi(${tf(az, 2)})` : `0{,}5+\\varphi(${tf(az, 2)})`;
      const lv = [0.1, 0.05, 0.01].map(a => `<span class="kv">$\\alpha=${tf(a, 2, true)}$: <b style="color:${pv < a ? "var(--s8)" : "var(--s3)"}">${pv < a ? "bác bỏ" : "không bác bỏ"}</b></span>`).join("");
      $("pvRead").innerHTML = `<div class="row"><span class="kv">p-value $=${how}\\approx${tf(pv, 4)}$</span>${same ? "" : `<span class="kv">($Z$ nằm ngược phía với $H$)</span>`}</div><div class="row">${lv}</div>`;
      math($("pvRead"));
    };
    seg("pvH", v => { h = v; render(); });
    X.bind(["pvZ"], v => { zv = v.pvZ; render(); }, { pvZ: v => X.fmt(v, 2) });
    X.responsive($("pvPlot"), render);
  }

  /* ---------------- SỐ CA TỚI HẠN (TỈ LỆ) ---------------- */
  if ($("kWidget")) {
    let h = 2, n = 500, p0 = 0.7, a = 0.05;
    const render = () => {
      const se = Math.sqrt(p0 * (1 - p0) / n), C = h === 3 ? zq(1 - a / 2) : zq(1 - a);
      const mean = n * p0, sk = n * se, kLo = n * (p0 - C * se), kHi = n * (p0 + C * se);
      const xmin = Math.max(0, mean - 4.5 * sk), xmax = Math.min(n, mean + 4.5 * sk), top = X.normPdf(0) / sk;
      const c = X.chart($("kPlot"), { height: 230, xmin, xmax, ymin: 0, ymax: top * 1.3 });
      c.axes({ noy: true, nogrid: true, xlabel: "số ca k" });
      const pdf = x => X.normPdf(x, mean, sk);
      if (h !== 2) c.area(pdf, kHi, xmax, RED);
      if (h !== 1) c.area(pdf, xmin, kLo, RED);
      c.curve(pdf, xmin, xmax);
      const kmax = Math.ceil(kLo - 1e-9) - 1, kmin = Math.floor(kHi + 1e-9) + 1;
      if (h !== 2) { c.vline(kHi, { stroke: "var(--s8)" }, 0, top * 1.12); c.text(kHi, top * 1.17, `k ≥ ${kmin}`, { "text-anchor": "start", dx: 2, class: "svg-strong", style: "fill:var(--s8);font-size:12px" }); }
      if (h !== 1) { c.vline(kLo, { stroke: "var(--s8)" }, 0, top * 1.12); c.text(kLo, top * 1.17, `k ≤ ${kmax}`, { "text-anchor": "end", dx: -2, class: "svg-strong", style: "fill:var(--s8);font-size:12px" }); }
      c.text(mean, top * 0.45, `np₀ = ${f(mean, 1, true)}`, { style: "font-size:12px;fill:var(--text-2)" });
      const parts = [];
      if (h !== 1) parts.push(`$k&lt;${tf(kLo, 2)}$ → nhiều nhất <b>${kmax}</b> ca`);
      if (h !== 2) parts.push(`$k&gt;${tf(kHi, 2)}$ → ít nhất <b>${kmin}</b> ca`);
      const ok = mean >= 5 && n * (1 - p0) >= 5;
      $("kRead").innerHTML = `<div class="row"><span class="kv">sai số chuẩn $\\sqrt{\\frac{p_0(1-p_0)}{n}}=${tf(se, 4)}$</span><span class="kv">$C=${tf(C, 3)}$</span></div><div class="row"><span class="kv">bác bỏ $H_0$ khi ${parts.join(" hoặc ")}</span></div>${ok ? "" : `<div class="row"><span class="kv" style="color:var(--s8)">Cỡ mẫu quá nhỏ so với $p_0$ — xấp xỉ chuẩn không đáng tin.</span></div>`}`;
      math($("kRead"));
    };
    seg("kH", v => { h = v; render(); });
    X.bind(["kN", "kP", "kA"], v => { n = v.kN; p0 = v.kP; a = v.kA; render(); }, { kN: v => String(v), kP: v => X.fmt(v, 2, true), kA: v => X.fmt(v, 3, true) });
    X.responsive($("kPlot"), render);
  }

  /* ---------------- χ²(20) VÀ F(12;15), ĐUÔI PHẢI ---------------- */
  function drawRight(host, pdf, xmax, C, obs, labC, labObs, xticks) {
    let top = 0;
    for (let i = 1; i <= 400; i++) top = Math.max(top, pdf(xmax * i / 400));
    const c = X.chart(host, { height: 240, xmin: 0, xmax, ymin: 0, ymax: top * 1.3 });
    c.axes({ xticks, noy: true, nogrid: true });
    c.area(pdf, C, xmax, RED);
    c.curve(pdf, xmax / 800, xmax);
    c.vline(C, { stroke: "var(--s8)" }, 0, top * 1.1);
    c.text(C, top * 1.16, labC, { "text-anchor": "end", dx: -3, style: "fill:var(--s8);font-size:12px" });
    c.vline(obs, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" }, 0, top * 0.75);
    c.text(obs, top * 0.82, labObs, { "text-anchor": "start", dx: 3, class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
    c.text(C + (xmax - C) * 0.55, top * 0.12, "5%", { style: "fill:var(--s8);font-size:12px;font-weight:700" });
  }
  if ($("chiFig")) X.responsive($("chiFig"), () => drawRight($("chiFig"), x => X.chi2Pdf(x, 20), 50, 31.41, 37.81, "C = 31,41", "χ² = 37,81", [0, 10, 20, 30, 40, 50]));
  if ($("fFig")) X.responsive($("fFig"), () => drawRight($("fFig"), x => X.fPdf(x, 12, 15), 4.5, 2.48, 2.678, "C = 2,48", "F = 2,678", [0, 1, 2, 3, 4]));

  /* ---------------- HÌNH 7.1: GHÉP CẶP ---------------- */
  if ($("pairFig")) {
    const before = [4.2, 5.8, 6.5, 4.9, 5.4, 6.8, 4.6, 5.9, 5.1], after = [3.5, 5.5, 5.7, 4.7, 4.9, 5.9, 4.5, 5.3, 4.7];
    const svg = svgBox($("pairFig"), 560, 310, 620);
    const ys = v => 262 - (v - 3.2) / (7.0 - 3.2) * 210;
    [3.5, 4.5, 5.5, 6.5].forEach(v => {
      X.el("line", { x1: 50, x2: 548, y1: ys(v), y2: ys(v), class: "gridline" }, svg);
      txt(svg, 42, ys(v) + 6, X.fmt(v, 1), { "text-anchor": "end", style: "font-size:18px" });
    });
    txt(svg, 165, 26, "Hai nhóm rời", { class: "svg-strong", style: "font-size:20px" });
    txt(svg, 430, 26, "Nối từng người", { class: "svg-strong", style: "font-size:20px" });
    const jit = [-14, 8, -4, 14, -10, 4, 12, -8, 0];
    before.forEach((v, i) => X.el("circle", { cx: 110 + jit[i], cy: ys(v), r: 5.5, fill: "var(--s1)", "fill-opacity": .85 }, svg));
    after.forEach((v, i) => X.el("circle", { cx: 215 + jit[i], cy: ys(v), r: 5.5, fill: "var(--s2)", "fill-opacity": .85 }, svg));
    before.forEach((v, i) => {
      X.el("line", { x1: 370, x2: 490, y1: ys(v), y2: ys(after[i]), stroke: "var(--s3)", "stroke-width": 2 }, svg);
      X.el("circle", { cx: 370, cy: ys(v), r: 5, fill: "var(--s1)" }, svg);
      X.el("circle", { cx: 490, cy: ys(after[i]), r: 5, fill: "var(--s2)" }, svg);
    });
    [[110, "Trước", "var(--s1)"], [215, "Sau", "var(--s2)"], [370, "Trước", "var(--s1)"], [490, "Sau", "var(--s2)"]].forEach(([x, t, col]) => txt(svg, x, 298, t, { class: "svg-strong", style: `font-size:19px;fill:${col}` }));
    X.el("line", { x1: 290, x2: 290, y1: 40, y2: 270, stroke: "var(--border)", "stroke-dasharray": "4 4" }, svg);
  }
});
