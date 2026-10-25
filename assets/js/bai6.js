/* ==========================================================
   bai6.js — các hình vẽ và phần tương tác của Bài 6
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const tf = (v, d = 4, trim = false) => X.tfmt(v, d, trim);

  const svgBox = (host, W, H, maxW) => X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: `width:100%;height:auto;display:block;max-width:${maxW || W}px;margin:0 auto` }, host);
  const txt = (svg, x, y, s, attrs = {}) => { const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg); e.textContent = s; return e; };
  const math = el => { if (window.renderMath) window.renderMath(el); };
  const RED = { fill: "var(--s8)", "fill-opacity": .42 };
  /* nút chọn (seg): gọi cb(h) khi bấm */
  const seg = (id, cb) => {
    const box = $(id);
    box.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      [...box.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
      cb(+b.dataset.h);
    });
  };
  /* hạng trung bình cho giá trị trùng */
  const ranks = vals => {
    const idx = vals.map((v, i) => i).sort((i, j) => vals[i] - vals[j]);
    const r = new Array(vals.length);
    let i = 0;
    while (i < idx.length) {
      let j = i;
      while (j + 1 < idx.length && vals[idx[j + 1]] === vals[idx[i]]) j++;
      for (let q = i; q <= j; q++) r[idx[q]] = (i + j + 2) / 2;
      i = j + 1;
    }
    return r;
  };

  /* Phụ lục 7, 8 (bản đã sửa): [C1, C2]; null = ô trống */
  const PL7 = {5:[[0,15],null,null,null], 6:[[2,19],[0,21],null,null], 7:[[3,25],[2,26],[0,28],null], 8:[[5,31],[3,33],[1,35],[0,36]], 9:[[8,37],[5,40],[3,42],[1,44]], 10:[[10,45],[8,47],[5,50],[3,52]], 11:[[13,53],[10,56],[7,59],[5,61]], 12:[[17,61],[13,65],[10,68],[7,71]], 13:[[21,70],[17,74],[12,79],[10,81]], 14:[[25,80],[21,84],[16,89],[13,92]], 15:[[30,90],[25,95],[19,101],[16,104]], 16:[[35,101],[29,107],[23,113],[19,117]], 17:[[41,112],[34,119],[27,126],[23,130]], 18:[[47,124],[40,131],[32,139],[27,144]], 19:[[53,137],[46,144],[37,153],[32,158]], 20:[[60,150],[52,158],[43,167],[37,173]]};
  const PL8 = {4:[[[11,25]],[[10,26]],[null],[null]],
    5:[[[12,28],[19,36]],[[11,29],[17,38]],[[10,30],[16,39]],[null,[15,40]]],
    6:[[[13,31],[20,40],[28,50]],[[12,32],[18,42],[26,52]],[[11,33],[17,43],[24,54]],[[10,34],[16,44],[23,55]]],
    7:[[[14,34],[21,44],[29,55],[39,66]],[[13,35],[20,45],[27,57],[36,69]],[[11,37],[18,47],[25,59],[34,71]],[[10,38],[16,49],[24,60],[32,73]]],
    8:[[[15,37],[23,47],[31,59],[41,71],[51,85]],[[14,38],[21,49],[29,61],[38,74],[49,87]],[[12,40],[19,51],[27,63],[35,77],[45,91]],[[11,41],[17,53],[25,65],[34,78],[43,93]]],
    9:[[[16,40],[24,51],[33,63],[43,76],[54,90],[66,105]],[[14,42],[22,53],[31,65],[40,79],[51,93],[62,109]],[[13,43],[20,55],[28,68],[37,82],[47,97],[59,112]],[[11,45],[18,57],[26,70],[35,84],[45,99],[56,115]]],
    10:[[[17,43],[26,54],[35,67],[45,81],[56,96],[69,111],[82,128]],[[15,45],[23,57],[32,70],[42,84],[53,99],[65,115],[78,132]],[[13,47],[21,59],[29,73],[39,87],[49,103],[61,119],[74,136]],[[12,48],[19,61],[27,75],[37,89],[47,105],[58,122],[71,139]]]};
  const ALPHA = [0.05, 0.025, 0.01, 0.005];
  const LVTEX = ["W_{0{,}95}", "W_{0{,}975}", "W_{0{,}99}", "W_{0{,}995}"];
  /* năm ô bảng gốc làm tròn xác suất (đuôi nhỉnh hơn α một chút) */
  const ROUND7 = { "12-2": 1, "13-3": 1, "14-2": 1, "14-3": 1, "15-3": 1 };

  /* phân phối chính xác khi H0 đúng */
  const srDist = k => {
    const M = k * (k + 1) / 2, c = new Array(M + 1).fill(0);
    c[0] = 1;
    for (let r = 1; r <= k; r++) for (let s = M; s >= r; s--) c[s] += c[s - r];
    const tot = Math.pow(2, k);
    return c.map(v => v / tot);
  };
  const rsDist = (n1, N) => {
    const M = N * (N + 1) / 2;
    const dp = Array.from({ length: n1 + 1 }, () => new Array(M + 1).fill(0));
    dp[0][0] = 1;
    for (let r = 1; r <= N; r++) for (let j = Math.min(n1, r); j >= 1; j--) for (let s = M; s >= r; s--) dp[j][s] += dp[j - 1][s - r];
    const row = dp[n1], tot = row.reduce((a, b) => a + b, 0);
    return row.map(v => v / tot);
  };
  const sumTo = (p, a, b) => { let s = 0; for (let i = Math.max(0, a); i <= Math.min(p.length - 1, b); i++) s += p[i]; return s; };

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm6")) X.mindmap($("mm6"), {
    t: "Bài 6<br>Phi tham số",
    c: [
      { t: "Đếm tần số → $\\chi^2$", c: [{ t: "Độc lập: $n'_{ij}=\\frac{h_ic_j}{n}$, $\\theta=(r-1)(s-1)$" }, { t: "Nhiều tỉ lệ = bảng nhóm × có/không" }, { t: "Phù hợp: $n'_i=np_i$, $\\theta=k-1$" }] },
      { t: "Điều kiện $\\chi^2$", c: [{ t: "Tần số lý thuyết $\\ge5$" }, { t: "$\\theta=1$: hiệu chỉnh Yates" }, { t: "$\\theta&gt;1$: gộp hàng, cột kế cận" }] },
      { t: "Xếp hạng", c: [{ t: "Trùng → hạng trung bình" }, { t: "Tổng hạng $=\\frac{n(n+1)}{2}$" }] },
      { t: "Dấu và hạng", c: [{ t: "Một mẫu: $d=x-M_{e0}$" }, { t: "Ghép cặp: $d=x-y$" }, { t: "$W=T^+$, Phụ lục 7 $(C_1;C_2)$" }] },
      { t: "Tổng hạng", c: [{ t: "Hai nhóm, nhóm 1 ít người hơn" }, { t: "$W=T_1$, Phụ lục 8" }] },
      { t: "Kruskal–Wallis", c: [{ t: "Ba nhóm trở lên" }, { t: "$W$ so với $\\chi^2_{1-\\alpha}(k-1)$" }, { t: "So từng cặp: $D_{ij}$ và $C_k$" }] }
    ]
  }, { colW: 250 });

  /* ---------------- 1.3 GIÁ TRỊ BẤT THƯỜNG ---------------- */
  if ($("outWidget")) {
    const base = [5, 6, 6, 7, 8, 9];
    let v = 30;
    const render = () => {
      const vals = base.concat([v]), rk = ranks(vals);
      const mean = vals.reduce((a, b) => a + b, 0) / 7;
      const s = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / 6);
      $("outPlot").innerHTML = "";
      const svg = svgBox($("outPlot"), 600, 250, 660);
      /* hàng ô: 7 giá trị đã sắp xếp, hạng ở dưới */
      vals.forEach((x, i) => {
        const bx = 22 + i * 82, col = i === 6 ? "var(--s2)" : "var(--s1)";
        X.el("rect", { x: bx, y: 12, width: 66, height: 48, rx: 8, fill: col, "fill-opacity": .15, stroke: col, "stroke-width": 2 }, svg);
        txt(svg, bx + 33, 45, String(x), { class: "svg-strong", style: `font-size:22px;fill:${col}` });
        txt(svg, bx + 33, 90, "hạng " + f(rk[i], 1, true), { style: "font-size:19px" });
      });
      /* trục số 0 → 60 ngày */
      const xs = d => 30 + d * 545 / 60;
      X.el("line", { x1: 30, x2: 575, y1: 196, y2: 196, stroke: "var(--text-2)", "stroke-width": 1.5 }, svg);
      [0, 10, 20, 30, 40, 50, 60].forEach(d => { X.el("line", { x1: xs(d), x2: xs(d), y1: 196, y2: 203, stroke: "var(--text-2)" }, svg); txt(svg, xs(d), 224, String(d), { style: "font-size:19px" }); });
      txt(svg, 575, 246, "ngày", { "text-anchor": "end", style: "font-size:19px" });
      X.el("line", { x1: xs(7), x2: xs(7), y1: 128, y2: 196, stroke: "var(--s1)", "stroke-width": 3 }, svg);
      X.el("line", { x1: xs(mean), x2: xs(mean), y1: 128, y2: 196, stroke: "var(--s8)", "stroke-width": 3 }, svg);
      txt(svg, xs(7) - 6, 124, "trung vị 7", { "text-anchor": "end", class: "svg-strong", style: "font-size:19px;fill:var(--s1)" });
      txt(svg, xs(mean) + 6, 124, "trung bình " + f(mean, 2), { "text-anchor": "start", class: "svg-strong", style: "font-size:19px;fill:var(--s8)" });
      const seen = {};
      vals.forEach((x, i) => {
        const lv = seen[x] = (seen[x] || 0) + 1;
        X.el("circle", { cx: xs(x), cy: 186 - (lv - 1) * 12, r: 6, fill: i === 6 ? "var(--s2)" : "var(--s1)", stroke: "var(--surface)", "stroke-width": 1.5 }, svg);
      });
      $("outRead").innerHTML = `<div class="row"><span class="kv">trung bình $\\overline x=${tf(mean, 2)}$</span><span class="kv">độ lệch chuẩn $s=${tf(s, 2)}$</span><span class="kv">trung vị $=7$</span><span class="kv">hạng của bệnh nhân 7: <b>${f(rk[6], 1, true)}</b></span></div>`;
      math($("outRead"));
    };
    X.bind(["outV"], o => { v = o.outV; render(); }, { outV: x => String(x) });
  }

  /* ---------------- 2.4 BẬC TỰ DO: BẢNG 3 × 4 ---------------- */
  if ($("dfFig")) {
    const svg = svgBox($("dfFig"), 590, 330, 620);
    const cx = [115, 207, 299, 391, 483], cw = 92, ry = [50, 110, 170, 230], rh = 60;
    ["Cột 1", "Cột 2", "Cột 3", "Cột 4", "Tổng"].forEach((s, j) => txt(svg, cx[j] + cw / 2, 38, s, { class: "svg-strong", style: "font-size:19px" }));
    ["Hàng 1", "Hàng 2", "Hàng 3", "Tổng"].forEach((s, i) => txt(svg, 60, ry[i] + 37, s, { class: "svg-strong", style: "font-size:19px" }));
    for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) {
      const total = i === 3 || j === 4, free = i < 2 && j < 3;
      X.el("rect", { x: cx[j], y: ry[i], width: cw, height: rh, fill: free ? "var(--s1)" : total ? "var(--surface)" : "var(--text-2)", "fill-opacity": free ? .2 : total ? 1 : .12, stroke: total ? "var(--text)" : "var(--border)", "stroke-width": total ? 2 : 1 }, svg);
      let s = "", attrs = { style: "font-size:19px" };
      if (i === 3 && j === 4) { s = "n"; attrs = { class: "svg-strong", style: "font-size:20px" }; }
      else if (j === 4) { s = "h" + "₁₂₃"[i]; attrs = { class: "svg-strong", style: "font-size:20px" }; }
      else if (i === 3) { s = "c" + "₁₂₃₄"[j]; attrs = { class: "svg-strong", style: "font-size:20px" }; }
      else if (free) { s = "tự chọn"; attrs = { class: "svg-strong", style: "font-size:19px;fill:var(--s1)" }; }
      else s = "bị ép";
      txt(svg, cx[j] + cw / 2, ry[i] + 37, s, attrs);
    }
    txt(svg, 295, 320, "6 ô tự chọn = (3 − 1)(4 − 1)", { class: "svg-strong", style: "font-size:19px;fill:var(--s1)" });
  }

  /* ---------------- 2.5 PHÂN PHỐI χ²(2) ---------------- */
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
    c.text(obs, top * 0.82, labObs, { "text-anchor": "end", dx: -3, class: "svg-strong", style: "fill:var(--s7);font-size:12.5px" });
    c.text(C + (xmax - C) * 0.3, top * 0.12, "5%", { style: "fill:var(--s8);font-size:12px;font-weight:700" });
  }
  if ($("chiFig6")) X.responsive($("chiFig6"), () => drawRight($("chiFig6"), x => X.chi2Pdf(x, 2), 14, 5.991, 11.973, "C = 5,991", "χ² = 11,973", [0, 2, 4, 6, 8, 10, 12, 14]));

  /* ---------------- 2.6 BẢNG 2 × 2 = Z² ---------------- */
  if ($("x22Widget")) {
    const n1 = 80, n2 = 120, n = 200;
    let a = 20, cc = 54;
    const render = () => {
      const b = n1 - a, d = n2 - cc, c1 = a + cc, c2 = b + d;
      const chi = n * (a * d - b * cc) ** 2 / (n1 * n2 * c1 * c2);
      const f1 = a / n1, f2 = cc / n2, f0 = c1 / n;
      const Z = (f1 - f2) / Math.sqrt(f0 * (1 - f0) * (1 / n1 + 1 / n2));
      const Emin = Math.min(n1 * c1, n1 * c2, n2 * c1, n2 * c2) / n;
      const c = X.chart($("x22Plot"), { height: 230, xmin: 0.3, xmax: 2.7, ymin: 0, ymax: 1 });
      c.axes({ xticks: [1, 2], xfmt: v => (v === 1 ? "Dùng chỉ (80)" : "Không dùng (120)"), yticks: [0, 0.25, 0.5, 0.75, 1], yfmt: v => f(v * 100, 0) + "%" });
      c.bars([{ x: 1, y: f1, fill: "var(--s1)" }, { x: 2, y: f2, fill: "var(--s2)" }], { ratio: 0.45, maxW: 90 });
      c.hline(f0, { stroke: "var(--s7)", "stroke-width": 1.6 });
      c.text(2.68, f0 + 0.03, `f₀ = ${f(f0 * 100, 1, true)}%`, { "text-anchor": "end", style: "fill:var(--s7);font-size:12px;font-weight:700" });
      c.text(1, f1 + 0.04, `${f(f1 * 100, 1, true)}%`, { class: "svg-strong" });
      c.text(2, f2 + 0.04, `${f(f2 * 100, 1, true)}%`, { class: "svg-strong" });
      const rej = chi > 3.841;
      $("x22Read").innerHTML = `<div class="row"><span class="kv">bảng: $a=${a}$, $b=${b}$, $c=${cc}$, $d=${d}$</span><span class="kv">tần số lý thuyết nhỏ nhất $${tf(Emin, 2, true)}$${Emin < 5 ? " — <b>cần Yates</b>" : ""}</span></div><div class="row"><span class="kv">$\\chi^2=${tf(chi, 3)}$</span><span class="kv">$Z=${tf(Z, 3)}$, $Z^2=${tf(Z * Z, 3)}$</span><span class="kv">${rej ? "$\\chi^2&gt;3{,}841$: bác bỏ $H_0$ (có liên quan)" : "$\\chi^2\\le3{,}841$: chưa bác bỏ $H_0$"}</span></div>`;
      math($("x22Read"));
    };
    X.bind(["x22a", "x22c"], o => { a = o.x22a; cc = o.x22c; render(); }, { x22a: x => String(x), x22c: x => String(x) });
    X.responsive($("x22Plot"), render);
  }

  /* ---------------- 3.2 KHỚP CẮN: ĐẾM ĐƯỢC VÀ LẼ RA ---------------- */
  if ($("gofFig")) X.responsive($("gofFig"), () => {
    const obs = [118, 66, 16], exp = [130, 60, 10];
    const c = X.chart($("gofFig"), { height: 250, xmin: 0.4, xmax: 3.6, ymin: 0, ymax: 155 });
    c.axes({ xticks: [1, 2, 3], xfmt: v => ["", "Loại I", "Loại II", "Loại III"][v], yticks: [0, 40, 80, 120], yfmt: v => String(v) });
    c.bars(obs.map((y, i) => ({ x: i + 1 - 0.18, y, fill: "var(--s1)" })), { ratio: 0.33, maxW: 48 });
    c.bars(exp.map((y, i) => ({ x: i + 1 + 0.18, y, fill: "var(--s2)" })), { ratio: 0.33, maxW: 48 }).forEach(r => r.setAttribute("fill-opacity", .55));
    obs.forEach((y, i) => c.text(i + 1 - 0.18, y + 5, String(y), { class: "svg-strong", style: "fill:var(--s1)" }));
    exp.forEach((y, i) => c.text(i + 1 + 0.18, y + 5, String(y), { class: "svg-strong", style: "fill:var(--s2)" }));
    c.text(2.4, 140, "■ đếm được", { "text-anchor": "start", style: "fill:var(--s1);font-size:12.5px;font-weight:700" });
    c.text(2.4, 124, "■ lẽ ra (theo H₀)", { "text-anchor": "start", style: "fill:var(--s2);font-size:12.5px;font-weight:700" });
  });

  /* ---------------- 4.2 XẾP HẠNG TỪNG BƯỚC ---------------- */
  if ($("rankWidget")) {
    const pain = [3, 5, 2, 5, 7, 3, 5, 8, 1, 6], rk = ranks(pain);
    const order = pain.map((v, i) => i).sort((i, j) => pain[i] - pain[j] || i - j);
    const tieCol = { 3: "var(--s2)", 5: "var(--s3)" };
    const read = [
      "Mười bệnh nhân theo thứ tự khám, số trong ô là điểm đau.",
      "Sắp xếp tăng dần, đánh <b>vị trí</b> 1 → 10. Hai số 3 đứng ở vị trí 3, 4; ba số 5 ở vị trí 5, 6, 7 — chưa công bằng.",
      "Giá trị trùng nhận <b>trung bình các vị trí</b>: hai số 3 → $\\frac{3+4}{2}=3{,}5$; ba số 5 → $\\frac{5+6+7}{3}=6$.",
      "Trả hạng về đúng bệnh nhân. Tổng hạng $=3{,}5+6+2+6+9+3{,}5+6+10+1+8=55=\\frac{10\\cdot11}{2}$ ✓."
    ];
    const render = step => {
      $("rankPlot").innerHTML = "";
      const svg = svgBox($("rankPlot"), 620, 150, 660);
      const seq = step === 1 || step === 4 ? pain.map((v, i) => i) : order;
      seq.forEach((idx, pos) => {
        const x = 15 + pos * 60, v = pain[idx];
        const col = step === 3 && tieCol[v] ? tieCol[v] : "var(--s1)";
        X.el("rect", { x, y: 22, width: 52, height: 52, rx: 8, fill: col, "fill-opacity": step === 3 && tieCol[v] ? .35 : .14, stroke: col, "stroke-width": 2 }, svg);
        txt(svg, x + 26, 57, String(v), { class: "svg-strong", style: "font-size:24px" });
        let lab;
        if (step === 1) lab = "BN" + (idx + 1);
        else if (step === 2) lab = String(pos + 1);
        else lab = f(rk[idx], 1, true);
        txt(svg, x + 26, 108, lab, step === 1 ? { style: "font-size:20px" } : { class: "svg-strong", style: `font-size:20px;fill:${step === 2 ? "var(--text-2)" : "var(--s7)"}` });
      });
      txt(svg, 310, 140, ["số thứ tự bệnh nhân", "vị trí sau khi sắp xếp", "hạng (trung bình nếu trùng)", "hạng của từng bệnh nhân"][step - 1], { style: "font-size:20px" });
      $("rankRead").innerHTML = read[step - 1];
      math($("rankRead"));
    };
    seg("rankStep", render);
    render(1);
  }

  /* ---------------- 5.3 PHÂN PHỐI CỦA T+ ---------------- */
  if ($("srWidget")) {
    let lv = 0, k = 9;
    const render = () => {
      const p = srDist(k), M = k * (k + 1) / 2, cc = PL7[k][lv];
      const top = Math.max(...p);
      const c = X.chart($("srPlot"), { height: 240, xmin: -1, xmax: M + 1, ymin: 0, ymax: top * 1.3 });
      c.axes({ xticks: X.niceTicks(0, M, 6), noy: true, nogrid: true, xlabel: "T⁺" });
      c.bars(p.map((y, t) => ({ x: t, y, fill: cc && (t <= cc[0] || t >= cc[1]) ? "var(--s8)" : "var(--s1)" })), { ratio: 0.8, maxW: 16 });
      if (cc) {
        c.vline(cc[0] + 0.5, { stroke: "var(--s8)" }, 0, top * 1.12);
        c.vline(cc[1] - 0.5, { stroke: "var(--s8)" }, 0, top * 1.12);
        c.text(cc[0] + 0.5, top * 1.18, `C₁ = ${cc[0]}`, { "text-anchor": "end", dx: -3, style: "fill:var(--s8);font-size:12px;font-weight:700" });
        c.text(cc[1] - 0.5, top * 1.18, `C₂ = ${cc[1]}`, { "text-anchor": "start", dx: 3, style: "fill:var(--s8);font-size:12px;font-weight:700" });
      }
      let html;
      if (cc) {
        const pl = sumTo(p, 0, cc[0]), pr = sumTo(p, cc[1], M);
        const rnd = ROUND7[k + "-" + lv] ? ` <span class="small">(ô này bảng gốc làm tròn xác suất nên nhỉnh hơn $${tf(ALPHA[lv], 3, true)}$ một chút)</span>` : "";
        html = `<div class="row"><span class="kv">cột $${LVTEX[lv]}$, $k=${k}$: $(C_1;C_2)=(${cc[0]};${cc[1]})$</span><span class="kv">$C_1+C_2=${M}=\\frac{${k}\\cdot${k + 1}}{2}$</span></div><div class="row"><span class="kv">$P(T^+\\le C_1)=${tf(pl, 4)}$</span><span class="kv">$P(T^+\\ge C_2)=${tf(pr, 4)}$</span><span class="kv">mỗi đuôi so với $${tf(ALPHA[lv], 3, true)}$</span></div>${rnd}`;
      } else {
        html = `<div class="row"><span class="kv">cột $${LVTEX[lv]}$, $k=${k}$: <b>ô trống</b></span><span class="kv">kể cả $T^+=0$ cũng có $P=\\frac{1}{2^{${k}}}\\approx${tf(p[0], 4)}&gt;${tf(ALPHA[lv], 3, true)}$ → không thể bác bỏ</span></div>`;
      }
      $("srRead").innerHTML = html;
      math($("srRead"));
    };
    seg("srLv", h => { lv = h; render(); });
    X.bind(["srK"], o => { k = o.srK; render(); }, { srK: x => String(x) });
    X.responsive($("srPlot"), render);
  }

  /* ---------------- 7.1 TRỘN HAI NHÓM ---------------- */
  if ($("mixFig")) {
    const A = [88, 95, 105, 110, 120, 132], L = [118, 120, 128, 140, 150, 155, 165, 175];
    const rk = ranks(A.concat(L));
    const svg = svgBox($("mixFig"), 600, 232, 660);
    const xs = v => 40 + (v - 85) * 540 / 95;
    X.el("line", { x1: 30, x2: 585, y1: 118, y2: 118, stroke: "var(--text-2)", "stroke-width": 1.5 }, svg);
    [90, 100, 110, 120, 130, 140, 150, 160, 170].forEach(v => {
      X.el("line", { x1: xs(v), x2: xs(v), y1: 118, y2: 125, stroke: "var(--text-2)" }, svg);
      txt(svg, xs(v), 146, String(v), { style: "font-size:19px" });
    });
    txt(svg, 585, 146, "giây", { "text-anchor": "end", style: "font-size:19px" });
    txt(svg, 30, 26, "● articaine (nhóm 1)", { "text-anchor": "start", class: "svg-strong", style: "font-size:19px;fill:var(--s1)" });
    txt(svg, 330, 26, "● lidocaine (nhóm 2)", { "text-anchor": "start", class: "svg-strong", style: "font-size:19px;fill:var(--s2)" });
    A.forEach((v, i) => {
      X.el("circle", { cx: xs(v), cy: 84, r: 8, fill: "var(--s1)" }, svg);
      txt(svg, xs(v), 66, f(rk[i], 1, true), { class: "svg-strong", style: "font-size:19px;fill:var(--s1)" });
    });
    L.forEach((v, i) => {
      X.el("circle", { cx: xs(v), cy: 180, r: 8, fill: "var(--s2)" }, svg);
      const lab = f(rk[A.length + i], 1, true);
      const attrs = v === 118 ? { "text-anchor": "end" } : v === 120 ? { "text-anchor": "start" } : {};
      const dx = v === 118 ? -4 : v === 120 ? 4 : 0;
      txt(svg, xs(v) + dx, 214, lab, Object.assign({ class: "svg-strong", style: "font-size:19px;fill:var(--s2)" }, attrs));
    });
  }

  /* ---------------- 7.3 PHÂN PHỐI CỦA T1 ---------------- */
  if ($("rsWidget")) {
    let lv = 0, a = 6, b = 8;
    const render = () => {
      const n1 = Math.min(a, b), n2 = Math.max(a, b), N = n1 + n2;
      const p = rsDist(n1, N), lo = n1 * (n1 + 1) / 2, hi = n1 * (2 * N - n1 + 1) / 2;
      const cc = PL8[n2][lv][n1 - 4];
      let top = 0; for (let s = lo; s <= hi; s++) top = Math.max(top, p[s]);
      const c = X.chart($("rsPlot"), { height: 240, xmin: lo - 1, xmax: hi + 1, ymin: 0, ymax: top * 1.3 });
      c.axes({ xticks: X.niceTicks(lo, hi, 6), noy: true, nogrid: true, xlabel: "T₁" });
      const data = [];
      for (let s = lo; s <= hi; s++) data.push({ x: s, y: p[s], fill: cc && (s <= cc[0] || s >= cc[1]) ? "var(--s8)" : "var(--s1)" });
      c.bars(data, { ratio: 0.8, maxW: 16 });
      if (cc) {
        c.vline(cc[0] + 0.5, { stroke: "var(--s8)" }, 0, top * 1.12);
        c.vline(cc[1] - 0.5, { stroke: "var(--s8)" }, 0, top * 1.12);
        c.text(cc[0] + 0.5, top * 1.18, `C₁ = ${cc[0]}`, { "text-anchor": "end", dx: -3, style: "fill:var(--s8);font-size:12px;font-weight:700" });
        c.text(cc[1] - 0.5, top * 1.18, `C₂ = ${cc[1]}`, { "text-anchor": "start", dx: 3, style: "fill:var(--s8);font-size:12px;font-weight:700" });
      }
      const sw = a > b ? `<span class="kv">đã đổi chỗ để $n_1\\le n_2$</span>` : "";
      let html = `<div class="row"><span class="kv">$n_1=${n1}$, $n_2=${n2}$, $N=${N}$</span><span class="kv">kỳ vọng $\\frac{n_1(N+1)}{2}=${tf(n1 * (N + 1) / 2, 1, true)}$</span>${sw}</div>`;
      if (cc) {
        html += `<div class="row"><span class="kv">một bên $${tf(ALPHA[lv], 3, true)}$ (hai bên $${tf(2 * ALPHA[lv], 2, true)}$): $(C_1;C_2)=(${cc[0]};${cc[1]})$</span><span class="kv">$C_1+C_2=${cc[0] + cc[1]}=n_1(N+1)$</span><span class="kv">$P(T_1\\le C_1)=${tf(sumTo(p, lo, cc[0]), 4)}$</span></div>`;
      } else {
        html += `<div class="row"><span class="kv">ô trống: ngay cả $T_1$ nhỏ nhất ($${lo}$) cũng có xác suất $${tf(p[lo], 4)}&gt;${tf(ALPHA[lv], 3, true)}$</span></div>`;
      }
      $("rsRead").innerHTML = html;
      math($("rsRead"));
    };
    seg("rsLv", h => { lv = h; render(); });
    X.bind(["rsN1", "rsN2"], o => { a = o.rsN1; b = o.rsN2; render(); }, { rsN1: x => String(x), rsN2: x => String(x) });
    X.responsive($("rsPlot"), render);
  }

  /* ---------------- 8.3 KRUSKAL–WALLIS ---------------- */
  if ($("kwFig")) {
    const G = [[2.1, 2.8, 1.9, 3.0, 2.4], [3.2, 2.8, 3.9, 3.5, 4.1, 3.0], [4.6, 3.8, 5.2, 4.9, 4.3]];
    const names = ["Nano", "Hạt lai", "Siêu nhỏ"], cols = ["var(--s1)", "var(--s3)", "var(--s2)"];
    const all = G.flat(), rk = ranks(all);
    const svg = svgBox($("kwFig"), 600, 372, 660);
    const xs = v => 120 + (v - 1.7) * 130;
    const rowY = [62, 136, 210];
    let off = 0;
    const means = [];
    G.forEach((g, gi) => {
      txt(svg, 8, rowY[gi] + 7, names[gi], { "text-anchor": "start", class: "svg-strong", style: `font-size:19px;fill:${cols[gi]}` });
      X.el("line", { x1: 115, x2: 590, y1: rowY[gi], y2: rowY[gi], stroke: "var(--border)" }, svg);
      let sum = 0;
      g.forEach((v, i) => {
        const r = rk[off + i]; sum += r;
        X.el("circle", { cx: xs(v), cy: rowY[gi], r: 8, fill: cols[gi] }, svg);
        /* 2,8 và 3,0 sát nhau: nhãn của 3,0 đặt dưới chấm cho khỏi đè */
        const below = v === 3.0;
        txt(svg, xs(v), below ? rowY[gi] + 30 : rowY[gi] - 14, f(r, 1, true), { class: "svg-strong", style: `font-size:19px;fill:${cols[gi]}` });
      });
      means.push(sum / g.length);
      off += g.length;
    });
    X.el("line", { x1: 115, x2: 590, y1: 250, y2: 250, stroke: "var(--text-2)", "stroke-width": 1.5 }, svg);
    [2, 3, 4, 5].forEach(v => { X.el("line", { x1: xs(v), x2: xs(v), y1: 250, y2: 257, stroke: "var(--text-2)" }, svg); txt(svg, xs(v), 277, f(v, 1), { style: "font-size:19px" }); });
    txt(svg, 590, 277, "ΔE", { "text-anchor": "end", style: "font-size:19px" });
    /* hạng trung bình trên thang 1 → 16 */
    const rs = r => 120 + (r - 1) * 465 / 15;
    X.el("line", { x1: rs(1), x2: rs(16), y1: 340, y2: 340, stroke: "var(--text-2)", "stroke-width": 1.5 }, svg);
    [1, 4, 8, 12, 16].forEach(r => { X.el("line", { x1: rs(r), x2: rs(r), y1: 340, y2: 346, stroke: "var(--text-2)" }, svg); txt(svg, rs(r), 366, String(r), { style: "font-size:19px" }); });
    txt(svg, 8, 346, "hạng TB", { "text-anchor": "start", class: "svg-strong", style: "font-size:19px" });
    X.el("line", { x1: rs(8.5), x2: rs(8.5), y1: 296, y2: 340, stroke: "var(--text-2)", "stroke-dasharray": "5 4", "stroke-width": 1.5 }, svg);
    means.forEach((m, gi) => {
      X.el("circle", { cx: rs(m), cy: 340, r: 8, fill: cols[gi] }, svg);
      txt(svg, rs(m) + (gi === 1 ? 26 : 0), 318, f(m, 1, true), { class: "svg-strong", style: `font-size:19px;fill:${cols[gi]}` });
    });
  }
});
