/* ==========================================================
   bai3.js — các hình vẽ và phần tương tác của Bài 3
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const T = s => X.tex(s);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const ft = (v, d = 4) => X.fmt(v, d, true);

  /* số ngẫu nhiên có hạt giống (để hình cố định giữa các lần tải trang) */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  /* khung SVG co giãn theo bề rộng, toạ độ cố định theo viewBox */
  const svgBox = (host, W, H, maxW) => X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: `width:100%;height:auto;display:block;max-width:${maxW || W}px;margin:0 auto` }, host);
  const txt = (svg, x, y, s, attrs = {}) => { const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg); e.textContent = s; return e; };
  const arrowDef = (svg, id, color) => {
    const defs = X.el("defs", {}, svg);
    const m = X.el("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    X.el("path", { d: "M0,0 L10,5 L0,10 z", fill: color }, m);
  };

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm3")) X.mindmap($("mm3"), {
    t: "Bài 3<br>Thống kê mô tả<br>& phân bố mẫu",
    c: [
      { t: "Khái niệm", c: [{ t: "Tổng thể $N$ ↔ mẫu $n$" }, { t: "$\\mu,\\sigma,p$ ↔ $\\overline x,s,f$" }, { t: "Định tính / định lượng" }, { t: "4 thang đo: danh, bậc, khoảng, tỉ lệ" }] },
      { t: "Thu thập & chọn mẫu", c: [{ t: "Sơ cấp / thứ cấp; trực tiếp / gián tiếp" }, { t: "Xác suất: đơn giản, hệ thống $k=\\frac Nn$, cụm, phân tầng" }, { t: "Phi xác suất: thuận tiện, phán đoán, định mức" }] },
      { t: "Bảng & biểu đồ", c: [{ t: "Tần số, tần suất, tích lũy" }, { t: "Phân lớp: $k=\\sqrt[3]{2n}$, $h=\\frac{R}{k}$" }, { t: "Histogram, đa giác, thân–lá, thanh, tròn" }] },
      { t: "Điểm giữa", c: [{ t: "$\\overline x=\\frac{\\sum n_ix_i}{n}$" }, { t: "Trung vị $M_e$, mod $M_o$" }, { t: "Phân vị $P_p$, $Q_1,Q_2,Q_3$" }] },
      { t: "Độ phân tán", c: [{ t: "$R$, $R_Q=Q_3-Q_1$" }, { t: "$s^2$ chia $n-1$; $\\sigma^2$ chia $N$" }, { t: "$C_v=\\frac{s}{\\overline x}$" }] },
      { t: "Phân bố mẫu", c: [{ t: "$\\overline X\\sim N\\big(\\mu;\\frac{\\sigma^2}{n}\\big)$" }, { t: "Giới hạn trung tâm $n\\ge30$" }, { t: "$f\\approx N\\big(p;\\frac{p(1-p)}{n}\\big)$" }, { t: "FPC khi $\\frac nN&gt;0{,}05$" }] }
    ]
  }, { colW: 250 });

  /* ---------------- HÌNH 1.1: hai chiều xác suất – thống kê ---------------- */
  if ($("twoWays")) {
    const svg = svgBox($("twoWays"), 600, 230, 640);
    arrowDef(svg, "aw1", "var(--s1)"); arrowDef(svg, "aw2", "var(--s2)");
    X.el("rect", { x: 20, y: 40, width: 200, height: 150, rx: 18, fill: "var(--surface-2)", stroke: "var(--border-strong)" }, svg);
    X.el("rect", { x: 400, y: 70, width: 180, height: 90, rx: 18, fill: "var(--surface-2)", stroke: "var(--border-strong)" }, svg);
    txt(svg, 120, 95, "TỔNG THỂ", { class: "svg-strong", style: "font-size:15px" });
    txt(svg, 120, 120, "mọi trẻ 12 tuổi của tỉnh", { style: "font-size:12.5px" });
    txt(svg, 120, 150, "tỉ lệ sâu răng p", { style: "font-size:13px" });
    txt(svg, 490, 105, "MẪU", { class: "svg-strong", style: "font-size:15px" });
    txt(svg, 490, 130, "150 trẻ được khám", { style: "font-size:12.5px" });
    X.el("path", { d: "M228,80 C300,40 340,40 392,88", fill: "none", stroke: "var(--s1)", "stroke-width": 2.4, "marker-end": "url(#aw1)" }, svg);
    X.el("path", { d: "M392,150 C340,200 300,200 228,152", fill: "none", stroke: "var(--s2)", "stroke-width": 2.4, "marker-end": "url(#aw2)" }, svg);
    txt(svg, 310, 34, "XÁC SUẤT: biết p → đoán mẫu", { style: "font-size:12.5px;fill:var(--s1);font-weight:600" });
    txt(svg, 310, 214, "THỐNG KÊ: nhìn mẫu → đoán p", { style: "font-size:12.5px;fill:var(--s2);font-weight:600" });
  }

  /* ---------------- KHUNG: lấy mẫu thử ---------------- */
  if ($("sampleWidget")) {
    const r = rng(2026);
    const N = 400, caries = [];
    for (let i = 0; i < N; i++) caries.push(i < 240);
    for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [caries[i], caries[j]] = [caries[j], caries[i]]; }
    const grid = $("smGrid"), dots = [];
    for (let i = 0; i < N; i++) { const d = document.createElement("div"); d.className = "d"; d.style.background = caries[i] ? "var(--s2)" : "var(--surface-3)"; grid.appendChild(d); dots.push(d); }
    let hist = [], n = 10;
    const rr = rng(77);
    const show = (sel, label) => {
      const set = new Set(sel);
      dots.forEach((d, i) => d.classList.toggle("dim", !set.has(i)));
      const k = sel.filter(i => caries[i]).length;
      hist.push({ f: k / sel.length, b: label === "lệch" });
      if (hist.length > 14) hist.shift();
      $("smRead").innerHTML = `<div class="row"><span class="kv">Mẫu vừa lấy (${label}): <b>${k}/${sel.length}</b> trẻ sâu răng → tỉ lệ mẫu f = <b>${f(k / sel.length, 3)}</b></span><span class="kv">Tỉ lệ thật p = <b>0,6</b></span></div>` +
        `<div class="small" style="margin-top:6px">Lịch sử (mới nhất bên phải): ${hist.map(h => `<span style="color:${h.b ? "var(--s8)" : "var(--text)"}">${f(h.f, 2)}</span>`).join(" · ")}</div>`;
    };
    const draw = biased => {
      const idx = [...Array(N).keys()], w = idx.map(i => biased ? (caries[i] ? 3 : 1) : 1), sel = [];
      for (let t = 0; t < n; t++) {
        let tot = 0; idx.forEach(i => { if (w[i] > 0) tot += w[i]; });
        let u = rr() * tot, pick = -1;
        for (const i of idx) { if (w[i] <= 0) continue; u -= w[i]; if (u <= 0) { pick = i; break; } }
        if (pick < 0) pick = idx.find(i => w[i] > 0);
        sel.push(pick); w[pick] = 0;
      }
      show(sel, biased ? "lệch" : "ngẫu nhiên");
    };
    X.bind(["smN"], v => { n = v.smN; }, { smN: v => String(v) });
    $("smBtns").addEventListener("click", e => {
      const a = e.target.dataset.a; if (!a) return;
      if (a === "reset") { hist = []; dots.forEach(d => d.classList.remove("dim")); $("smRead").innerHTML = "Đã xoá lịch sử. Bấm “Lấy mẫu ngẫu nhiên”."; return; }
      draw(a === "bias");
    });
    $("smRead").innerHTML = "Bấm “Lấy mẫu ngẫu nhiên” vài lần với $n=10$, rồi kéo $n$ lên 150 và bấm lại.";
    if (window.renderMath) window.renderMath($("smRead"));
  }

  /* ---------------- HÌNH 2.1: ba tầng tổng thể ---------------- */
  if ($("popLayers")) {
    const svg = svgBox($("popLayers"), 620, 190, 660);
    arrowDef(svg, "pl1", "var(--text-2)");
    const ell = (cx, rx, ry, fill, t1, t2) => {
      X.el("ellipse", { cx, cy: 95, rx, ry, fill, stroke: "var(--border-strong)", "stroke-width": 1.5 }, svg);
      txt(svg, cx, 90, t1, { class: "svg-strong", style: "font-size:13.5px" });
      txt(svg, cx, 110, t2, { style: "font-size:12px" });
    };
    ell(110, 100, 80, "var(--surface-2)", "Tổng thể mục tiêu", "mọi trẻ 12 tuổi");
    ell(330, 92, 62, "color-mix(in srgb, var(--s1) 14%, var(--surface))", "Tổng thể chọn mẫu", "trẻ có trong danh sách");
    ell(530, 72, 40, "color-mix(in srgb, var(--s2) 22%, var(--surface))", "Mẫu", "trẻ được khám");
    [[212, 236], [424, 456]].forEach(([a, b]) => {
      X.el("line", { x1: a, y1: 80, x2: b, y2: 80, stroke: "var(--text-2)", "stroke-width": 1.6, "marker-end": "url(#pl1)" }, svg);
      X.el("line", { x1: b, y1: 112, x2: a, y2: 112, stroke: "var(--text-2)", "stroke-width": 1.6, "marker-end": "url(#pl1)" }, svg);
    });
    txt(svg, 224, 70, "chọn", { style: "font-size:11px" }); txt(svg, 224, 128, "suy rộng", { style: "font-size:11px" });
    txt(svg, 440, 70, "chọn", { style: "font-size:11px" }); txt(svg, 440, 128, "suy rộng", { style: "font-size:11px" });
  }

  /* ---------------- HÌNH 3.1: quy trình nghiên cứu ---------------- */
  if ($("studyFlow")) {
    const steps = ["1. Xác định mục tiêu, nội dung, đối tượng", "2. Xây dựng khái niệm, chỉ tiêu thống kê", "3. Thu thập dữ liệu", "4. Xử lý số liệu", "5. Phân tích và diễn giải kết quả", "6. Báo cáo kết quả nghiên cứu"];
    const svg = svgBox($("studyFlow"), 560, 410, 600);
    arrowDef(svg, "sf1", "var(--text-2)"); arrowDef(svg, "sf2", "var(--s2)");
    const bx = 70, bw = 380, bh = 42, gap = 24;
    steps.forEach((s, i) => {
      const y = 12 + i * (bh + gap);
      X.el("rect", { x: bx, y, width: bw, height: bh, rx: 10, fill: i === 2 || i === 3 || i === 4 ? "color-mix(in srgb, var(--s1) 12%, var(--surface))" : "var(--surface-2)", stroke: "var(--border-strong)" }, svg);
      txt(svg, bx + bw / 2, y + 26, s, { style: "font-size:13.5px", class: "svg-strong" });
      if (i < steps.length - 1) X.el("line", { x1: bx + bw / 2 - 10, y1: y + bh, x2: bx + bw / 2 - 10, y2: y + bh + gap - 2, stroke: "var(--text-2)", "stroke-width": 1.6, "marker-end": "url(#sf1)" }, svg);
    });
    const y = i => 12 + i * (bh + gap);
    [[3, 2], [4, 3]].forEach(([a, b]) => X.el("line", { x1: bx + bw / 2 + 12, y1: y(a) - 2, x2: bx + bw / 2 + 12, y2: y(b) + bh + 2, stroke: "var(--s2)", "stroke-width": 1.5, "stroke-dasharray": "4 3", "marker-end": "url(#sf2)" }, svg));
    X.el("path", { d: `M${bx + bw},${y(5) + bh / 2} H${bx + bw + 40} V${y(0) + bh / 2} H${bx + bw + 4}`, fill: "none", stroke: "var(--s2)", "stroke-width": 1.5, "stroke-dasharray": "4 3", "marker-end": "url(#sf2)" }, svg);
    txt(svg, bx + bw + 52, y(3), "quay lại", { style: "font-size:11px;fill:var(--s2)", transform: `rotate(90 ${bx + bw + 52} ${y(3)})` });
  }

  /* ---------------- HÌNH 4.1: bậc thang thang đo ---------------- */
  if ($("scaleLadder")) {
    const svg = svgBox($("scaleLadder"), 620, 280, 660);
    const st = [
      { n: "Định danh", ops: "= ≠ (phân loại)", c: "var(--s3)" },
      { n: "Thứ bậc", ops: "+ thứ tự < >", c: "var(--s1)" },
      { n: "Khoảng cách", ops: "+ hiệu (cộng, trừ)", c: "var(--s7)" },
      { n: "Tỉ lệ", ops: "+ tỉ số (×, ÷), số 0 thật", c: "var(--s2)" }
    ];
    const w = 145, hstep = 55;
    st.forEach((s, i) => {
      const x = 12 + i * w, y = 270 - (i + 1) * hstep;
      X.el("rect", { x, y, width: w - 6, height: (i + 1) * hstep, rx: 8, fill: `color-mix(in srgb, ${s.c} 18%, var(--surface))`, stroke: s.c, "stroke-width": 1.6 }, svg);
      txt(svg, x + (w - 6) / 2, y + 22, `Bậc ${i + 1}`, { style: `font-size:11.5px;fill:${s.c};font-weight:700` });
      txt(svg, x + (w - 6) / 2, y + 42, s.n, { class: "svg-strong", style: "font-size:14px" });
      txt(svg, x + (w - 6) / 2, y + 62 > 262 ? 262 : y + 62, s.ops, { style: "font-size:11px" });
    });
  }

  /* ---------------- HÌNH 6.1: các phương pháp lấy mẫu ---------------- */
  if ($("samplingTree")) X.mindmap($("samplingTree"), {
    t: "Lấy mẫu",
    c: [
      { t: "Xác suất (ngẫu nhiên)", c: [{ t: "Ngẫu nhiên đơn giản: bốc thăm" }, { t: "Hệ thống: cách đều $k=\\frac Nn$" }, { t: "Cụm / nhiều giai đoạn: chọn cả nhóm" }, { t: "Phân tầng: chia tầng, chọn ngẫu nhiên trong tầng" }] },
      { t: "Phi xác suất", c: [{ t: "Thuận tiện: ai dễ gặp" }, { t: "Phán đoán: người điều tra tự chọn" }, { t: "Định mức: chia lớp + chọn thuận tiện" }] }
    ]
  }, { colW: 230, leafW: 300 });

  /* ---------------- KHUNG: lấy mẫu hệ thống ---------------- */
  if ($("sysWidget")) {
    const grid = $("sysGrid");
    const upd = v => {
      const N = v.sysN, n = Math.min(v.sysn, N), k = Math.max(1, Math.floor(N / n));
      const rEl = $("sysr"); rEl.max = k; let r = Math.min(Math.max(1, v.sysr), k);
      if (+rEl.value !== r) { rEl.value = r; const o = document.querySelector('output[for="sysr"]'); if (o) o.textContent = r; }
      const sel = new Set(); for (let j = 0; j < n; j++) { const s = r + j * k; if (s <= N) sel.add(s); }
      grid.innerHTML = "";
      for (let i = 1; i <= N; i++) { const d = document.createElement("div"); d.className = "d"; d.title = String(i); d.style.background = sel.has(i) ? "var(--s2)" : (i <= k ? "color-mix(in srgb, var(--s1) 30%, var(--surface))" : "var(--surface-3)"); grid.appendChild(d); }
      const list = [...sel].sort((a, b) => a - b);
      const exact = N % n === 0;
      $("sysRead").innerHTML = `<div class="row"><span class="kv">$k=\\frac{N}{n}=\\frac{${N}}{${n}}${exact ? "=" : "\\approx"}${exact ? k : ft(N / n, 2)}$ → dùng $k=${k}$</span><span class="kv">bắt đầu $r=${r}$ (chọn trong ${k} ô xanh nhạt đầu tiên)</span></div>` +
        `<div class="small" style="margin-top:6px">Các đơn vị được chọn (${list.length}): ${list.join(", ")}</div>` +
        (exact ? "" : `<div class="small muted">$N$ không chia hết cho $n$: làm tròn $k$ xuống để chắc chắn đủ ${n} đơn vị; phần cuối danh sách có thể không được chọn.</div>`);
      if (window.renderMath) window.renderMath($("sysRead"));
    };
    X.bind(["sysN", "sysn", "sysr"], upd, { sysN: v => String(v), sysn: v => String(v), sysr: v => String(v) });
  }

  /* ---------------- KHUNG: phân bổ phân tầng ---------------- */
  if ($("stratWidget")) {
    const Ns = [180, 150, 120, 90, 60], N = 600, names = ["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Năm 5"];
    const alloc = (n, w) => { // làm tròn theo phần lẻ lớn nhất
      const raw = w.map(x => n * x), fl = raw.map(Math.floor); let rest = n - fl.reduce((a, b) => a + b, 0);
      raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { fl[i]++; rest--; } });
      return { raw, v: fl };
    };
    let n = 80;
    const render = () => {
      const prop = alloc(n, Ns.map(x => x / N)), eq = alloc(n, Ns.map(() => 1 / 5));
      const ymax = Math.max(...prop.v, ...eq.v) * 1.25 + 1;
      const c = X.chart($("stratPlot"), { height: 230, xmin: -0.6, xmax: 4.6, ymin: 0, ymax });
      c.axes({ xticks: [0, 1, 2, 3, 4], xfmt: v => names[v] || "", yticks: X.niceTicks(0, ymax, 4) });
      const ppu = c.x(1) - c.x(0), bw = Math.min(26, ppu * 0.32), off = (bw / 2 + 1) / ppu;
      [0, 1, 2, 3, 4].forEach(i => {
        [[prop.v[i], "var(--s2)", -1], [eq.v[i], "var(--s1)", 1]].forEach(([val, col, side]) => {
          const x0 = c.x(i) + (side < 0 ? -bw - 1 : 1);
          X.el("rect", { x: x0, y: c.y(val), width: bw, height: c.y(0) - c.y(val), fill: col, rx: 3 }, c.g);
          c.text(i + side * off, val, String(val), { dy: -5, class: "svg-strong", style: "font-size:12px" });
        });
      });
      $("stratRead").innerHTML = `<div class="legend"><span><span class="sw" style="background:var(--s2)"></span>Theo tỉ lệ ($n_i=\\frac{n}{N}N_i$)</span><span><span class="sw" style="background:var(--s1)"></span>Đều ($\\frac{n}{k}$)</span></div>` +
        `<div class="small">Theo tỉ lệ: ${prop.raw.map((x, i) => `${names[i]} $=${ft(x, 2).replace(",", "{,}")}\\to${prop.v[i]}$`).join("; ")}. Trọng số khi phân bổ đều: ${Ns.map((x, i) => `$${ft((x / N) / (eq.v[i] / n), 2).replace(",", "{,}")}$`).join(", ")}.</div>`;
      if (window.renderMath) window.renderMath($("stratRead"));
    };
    X.bind(["stn"], v => { n = v.stn; render(); }, { stn: v => String(v) });
    X.responsive($("stratPlot"), render);
  }

  /* ---------------- DỮ LIỆU HUYẾT ÁP (Ví dụ 8.1) ---------------- */
  const BP = [123, 134, 115, 126, 105, 104, 131, 121, 140, 134, 118, 124, 141, 133, 162, 132, 124, 138, 149, 123, 119, 135, 134, 134, 130, 132, 117, 105, 130, 115, 124, 126, 129, 133, 121, 119, 98, 115, 143, 131];
  const bpMean = BP.reduce((a, b) => a + b, 0) / BP.length;
  const bpSd = Math.sqrt(BP.reduce((a, b) => a + (b - bpMean) ** 2, 0) / (BP.length - 1));
  const classes = (k, a0 = 98) => {
    const h = Math.ceil((162 - 98) / k); const out = [];
    for (let i = 0; i < k; i++) { const lo = a0 + i * h, hi = lo + h; out.push({ lo, hi, n: BP.filter(x => x >= lo && x < hi).length }); }
    return { h, out };
  };
  /* vẽ histogram: mode n | f | d ; poly: đa giác */
  function drawHist(host, k, mode, poly, height = 260) {
    const { h, out } = classes(k);
    const val = c => mode === "n" ? c.n : mode === "f" ? c.n / 40 : c.n / 40 / h;
    const lo = out[0].lo - (poly ? h : 4), hi = out[out.length - 1].hi + (poly ? h : 4);
    let ymax = Math.max(...out.map(val));
    if (mode === "d") ymax = Math.max(ymax, X.normPdf(bpMean, bpMean, bpSd));
    ymax *= 1.18;
    const c = X.chart(host, { height, xmin: lo, xmax: hi, ymin: 0, ymax, margin: { left: 56 } });
    const xt = out.map(o => o.lo).concat([out[out.length - 1].hi]);
    c.axes({ xticks: xt, xfmt: v => String(v), yticks: X.niceTicks(0, ymax, 4), yfmt: v => mode === "n" ? String(v) : X.fmt(v, mode === "d" ? 3 : 2, true), xlabel: "mmHg" });
    out.forEach(o => {
      const y = val(o);
      X.el("rect", { x: c.x(o.lo), y: c.y(y), width: c.x(o.hi) - c.x(o.lo), height: c.y(0) - c.y(y), fill: "color-mix(in srgb, var(--s1) 45%, var(--surface))", stroke: "var(--s1)", "stroke-width": 1.2 }, c.g);
      if (o.n > 0 && mode === "n") c.text((o.lo + o.hi) / 2, y, String(o.n), { dy: -5, class: "svg-strong", style: "font-size:12px" });
    });
    if (mode === "d") c.curve(x => X.normPdf(x, bpMean, bpSd), lo, hi, { stroke: "var(--s8)", "stroke-width": 2 });
    if (poly) {
      const pts = [{ x: out[0].lo - h / 2, y: 0 }].concat(out.map(o => ({ x: (o.lo + o.hi) / 2, y: val(o) }))).concat([{ x: out[out.length - 1].hi + h / 2, y: 0 }]);
      X.el("path", { d: pts.map((p, i) => (i ? "L" : "M") + c.x(p.x) + "," + c.y(p.y)).join(""), fill: "none", stroke: "var(--s2)", "stroke-width": 2.4 }, c.g);
      pts.forEach(p => c.dot(p.x, p.y, { fill: "var(--s2)", r: 4 }));
    }
    return { h, out };
  }
  if ($("histWidget")) {
    let k = 5, mode = "n", poly = false;
    const render = () => {
      const { h, out } = drawHist($("histPlot"), k, mode, poly);
      const area = out.reduce((a, o) => a + o.n / 40, 0);
      $("histRead").innerHTML = `<div class="row"><span class="kv">$k=${k}$ lớp, $h=\\lceil\\frac{64}{${k}}\\rceil=${h}$</span>${mode === "d" ? `<span class="kv">Tổng diện tích các cột $=${ft(area, 3)}$ — giống điều kiện (ii) của hàm mật độ; đường đỏ là chuông chuẩn cùng trung bình, độ lệch chuẩn</span>` : ""}</div>` +
        `<div class="small" style="margin-top:6px">${out.map(o => `$[${o.lo};${o.hi})$: <b>${o.n}</b>`).join(" · ")}</div>`;
      if (window.renderMath) window.renderMath($("histRead"));
    };
    X.bind(["hk"], v => { k = v.hk; render(); }, { hk: v => String(v) });
    $("hMode").addEventListener("click", e => {
      const m = e.target.dataset.m; if (!m) return;
      if (m === "poly") { poly = !poly; e.target.classList.toggle("on", poly); }
      else { mode = m; $("hMode").querySelectorAll("button[data-m]").forEach(b => { if (b.dataset.m !== "poly") b.classList.toggle("on", b.dataset.m === m); }); }
      render();
    });
    X.responsive($("histPlot"), render);
  }
  if ($("histFig")) X.responsive($("histFig"), () => drawHist($("histFig"), 5, "n", false, 240));
  if ($("polyFig")) X.responsive($("polyFig"), () => drawHist($("polyFig"), 5, "n", true, 240));

  /* ---------------- THANH ĐỨNG & TRÒN (khớp cắn) ---------------- */
  const ANG = [{ t: "Loại I", n: 110, c: "var(--s1)" }, { t: "Loại II", n: 60, c: "var(--s2)" }, { t: "Loại III", n: 30, c: "var(--s3)" }];
  if ($("barFig")) X.responsive($("barFig"), () => {
    const c = X.chart($("barFig"), { height: 230, xmin: -0.7, xmax: 2.7, ymin: 0, ymax: 130 });
    c.axes({ xticks: [0, 1, 2], xfmt: v => ANG[v] ? ANG[v].t : "", yticks: [0, 40, 80, 120], xlabel: "" });
    c.bars(ANG.map((a, i) => ({ x: i, y: a.n, fill: a.c })), { maxW: 70, ratio: 0.5 });
    ANG.forEach((a, i) => c.text(i, a.n, `${a.n} em`, { dy: -6, class: "svg-strong", style: "font-size:12.5px" }));
  });
  if ($("pieFig")) {
    const svg = svgBox($("pieFig"), 420, 240, 460);
    const cx = 120, cy = 120, R = 100; let a0 = -Math.PI / 2;
    ANG.forEach(a => {
      const frac = a.n / 200, a1 = a0 + frac * 2 * Math.PI;
      const p = (ang, rr = R) => [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      X.el("path", { d: `M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${frac > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`, fill: a.c, "fill-opacity": .8, stroke: "var(--surface)", "stroke-width": 2 }, svg);
      const [lx, ly] = p((a0 + a1) / 2, R * 0.62);
      txt(svg, lx, ly + 4, `${Math.round(frac * 100)}%`, { class: "svg-strong", style: "font-size:13px;fill:#fff" });
      a0 = a1;
    });
    ANG.forEach((a, i) => {
      X.el("rect", { x: 260, y: 70 + i * 34, width: 14, height: 14, rx: 3, fill: a.c }, svg);
      txt(svg, 282, 82 + i * 34, `${a.t}: ${a.n / 200 * 360}°`, { "text-anchor": "start", style: "font-size:13px" });
    });
  }

  /* ---------------- HÌNH 10.1: đường tích lũy, đọc trung vị ---------------- */
  if ($("ogiveFig")) X.responsive($("ogiveFig"), () => {
    const pts = [[10, 0], [20, 4], [30, 16], [40, 34], [50, 45], [60, 50]];
    const c = X.chart($("ogiveFig"), { height: 250, xmin: 5, xmax: 65, ymin: 0, ymax: 55 });
    c.axes({ xticks: [10, 20, 30, 40, 50, 60], yticks: [0, 10, 20, 25, 30, 40, 50], xlabel: "phút" });
    X.el("path", { d: pts.map((p, i) => (i ? "L" : "M") + c.x(p[0]) + "," + c.y(p[1])).join(""), fill: "none", stroke: "var(--s1)", "stroke-width": 2.4 }, c.g);
    pts.forEach(p => c.dot(p[0], p[1]));
    X.el("line", { x1: c.x(5), x2: c.x(35), y1: c.y(25), y2: c.y(25), stroke: "var(--s2)", "stroke-width": 1.6, "stroke-dasharray": "5 4" }, c.g);
    X.el("line", { x1: c.x(35), x2: c.x(35), y1: c.y(25), y2: c.y(0), stroke: "var(--s2)", "stroke-width": 1.6, "stroke-dasharray": "5 4" }, c.g);
    c.dot(35, 25, { fill: "var(--s2)" });
    c.text(35, 3, "Mₑ = 35", { "text-anchor": "start", dx: 6, class: "svg-strong", style: "fill:var(--s2)" });
    c.text(8, 25, "n/2 = 25", { dy: -6, "text-anchor": "start", style: "font-size:12px;fill:var(--s2)" });
  });

  /* ---------------- KHUNG: trung bình vs trung vị ---------------- */
  if ($("mmWidget")) {
    let last = 30;
    const render = () => {
      const d = [4, 5, 5, 6, 7, 8, last], mean = d.reduce((a, b) => a + b, 0) / 7, med = 6;
      const c = X.chart($("mmPlot"), { height: 170, xmin: 0, xmax: 62, ymin: 0, ymax: 3.2, margin: { left: 20 } });
      c.axes({ xticks: [0, 10, 20, 30, 40, 50, 60], noy: true, nogrid: true, xlabel: "ngày" });
      const seen = {};
      d.forEach(v => { seen[v] = (seen[v] || 0) + 1; c.dot(v, 0.45 * seen[v], { fill: v === last ? "var(--s8)" : "var(--text-2)", r: 6 }); });
      c.vline(mean, { stroke: "var(--s1)", "stroke-width": 2.2, "stroke-dasharray": "" }, 0, 2.6);
      c.vline(med, { stroke: "var(--s2)", "stroke-width": 2.2, "stroke-dasharray": "" }, 0, 2.6);
      c.text(mean, 2.75, `x̄ = ${f(mean, 2)}`, { class: "svg-strong", style: "fill:var(--s1);font-size:12.5px" });
      c.text(med, 3.05, `Mₑ = 6`, { class: "svg-strong", style: "fill:var(--s2);font-size:12.5px" });
      $("mmRead").innerHTML = `<div class="row"><span class="kv">Dãy: 4, 5, 5, 6, 7, 8, <b style="color:var(--s8)">${last}</b></span><span class="kv">Trung bình <b style="color:var(--s1)">${f(mean, 2)}</b></span><span class="kv">Trung vị <b style="color:var(--s2)">6</b></span></div>`;
    };
    X.bind(["mmv"], v => { last = v.mmv; render(); }, { mmv: v => String(v) });
    X.responsive($("mmPlot"), render);
  }

  /* ---------------- HÌNH 11.1: nội suy ---------------- */
  if ($("interpFig")) {
    const svg = svgBox($("interpFig"), 600, 170, 640);
    const vals = [5, 8, 10, 12, 12], xs = v => 40 + (v - 4) * 52;
    X.el("line", { x1: 30, x2: 570, y1: 110, y2: 110, stroke: "var(--border-strong)", "stroke-width": 1.5 }, svg);
    for (let v = 4; v <= 14; v++) { X.el("line", { x1: xs(v), x2: xs(v), y1: 106, y2: 114, stroke: "var(--border-strong)" }, svg); txt(svg, xs(v), 132, String(v), { style: "font-size:12px" }); }
    txt(svg, 572, 152, "giá trị (phút)", { "text-anchor": "end", style: "font-size:11.5px" });
    vals.forEach((v, i) => {
      if (i === 4) return;
      X.el("circle", { cx: xs(v), cy: 110, r: 6, fill: i === 1 || i === 2 ? "var(--s1)" : "var(--text-2)" }, svg);
      txt(svg, xs(v), 88, `vị trí ${i + 1}`, { style: "font-size:12px", class: i === 1 || i === 2 ? "svg-strong" : "svg-text" });
    });
    txt(svg, xs(12), 70, "(vị trí 4, 5)", { style: "font-size:11px" });
    X.el("line", { x1: xs(8), x2: xs(8.8), y1: 110, y2: 110, stroke: "var(--s2)", "stroke-width": 5, "stroke-linecap": "round" }, svg);
    X.el("circle", { cx: xs(8.8), cy: 110, r: 7, fill: "var(--s2)", stroke: "var(--surface)", "stroke-width": 2 }, svg);
    txt(svg, xs(8.8), 40, "vị trí 2,4 → 8 + 0,4·(10 − 8) = 8,8", { class: "svg-strong", style: "font-size:13px;fill:var(--s2)" });
    X.el("line", { x1: xs(8.8), x2: xs(8.8), y1: 48, y2: 100, stroke: "var(--s2)", "stroke-dasharray": "3 3" }, svg);
  }

  /* ---------------- HÌNH 11.2: biểu đồ hộp ---------------- */
  if ($("boxFig")) X.responsive($("boxFig"), () => {
    const d = [28, 31, 33, 35, 36, 38, 40, 41, 43, 46, 50, 55];
    const c = X.chart($("boxFig"), { height: 190, xmin: 25, xmax: 58, ymin: 0, ymax: 4, margin: { left: 20 } });
    c.axes({ xticks: [25, 30, 35, 40, 45, 50, 55], noy: true, nogrid: true, xlabel: "kg" });
    const yb = 2.4, hh = 0.7;
    X.el("rect", { x: c.x(33.5), y: c.y(yb + hh / 2), width: c.x(45.25) - c.x(33.5), height: c.y(yb - hh / 2) - c.y(yb + hh / 2), fill: "color-mix(in srgb, var(--s1) 22%, var(--surface))", stroke: "var(--s1)", "stroke-width": 2 }, c.g);
    X.el("line", { x1: c.x(39), x2: c.x(39), y1: c.y(yb + hh / 2), y2: c.y(yb - hh / 2), stroke: "var(--s2)", "stroke-width": 3 }, c.g);
    [[28, 33.5], [45.25, 55]].forEach(([a, b]) => X.el("line", { x1: c.x(a), x2: c.x(b), y1: c.y(yb), y2: c.y(yb), stroke: "var(--text-2)", "stroke-width": 1.6 }, c.g));
    [28, 55].forEach(v => X.el("line", { x1: c.x(v), x2: c.x(v), y1: c.y(yb + 0.25), y2: c.y(yb - 0.25), stroke: "var(--text-2)", "stroke-width": 1.6 }, c.g));
    d.forEach(v => c.dot(v, 0.7, { r: 4, fill: "var(--text-2)" }));
    [[28, "min 28"], [33.5, "Q₁ 33,5"], [39, "Mₑ 39"], [45.25, "Q₃ 45,25"], [55, "max 55"]].forEach(([v, s], i) => c.text(v, yb + 0.55 + (i % 2) * 0.42, s, { style: "font-size:11.5px" }));
  });

  /* ---------------- KHUNG: chia n hay n−1 ---------------- */
  if ($("varWidget")) {
    let n = 3, seed = 11;
    const run = () => {
      const r = rng(seed++); let a = 0, b = 0; const M = 2000;
      for (let t = 0; t < M; t++) {
        const s = []; for (let i = 0; i < n; i++) s.push(120 + 10 * gauss(r));
        const m = s.reduce((p, q) => p + q, 0) / n, ss = s.reduce((p, q) => p + (q - m) ** 2, 0);
        a += ss / (n - 1); b += ss / n;
      }
      a /= M; b /= M;
      const c = X.chart($("varPlot"), { height: 220, xmin: -0.8, xmax: 1.8, ymin: 0, ymax: 130 });
      c.axes({ xticks: [0, 1], xfmt: v => v === 0 ? "chia n − 1" : "chia n", yticks: [0, 25, 50, 75, 100, 125] });
      c.bars([{ x: 0, y: a, fill: "var(--s3)" }, { x: 1, y: b, fill: "var(--s8)" }], { maxW: 80, ratio: 0.5 });
      c.hline(100, { stroke: "var(--s1)", "stroke-width": 2 });
      c.text(1.55, 100, "σ² = 100", { dy: -6, style: "fill:var(--s1);font-size:12px", "text-anchor": "end" });
      c.text(0, a, f(a, 1), { dy: -6, class: "svg-strong" }); c.text(1, b, f(b, 1), { dy: -6, class: "svg-strong" });
      $("varRead").innerHTML = `<div class="row"><span class="kv">Trung bình của $s^2$ (chia $n-1$): <b>${f(a, 1)}</b></span><span class="kv">Chia $n$: <b>${f(b, 1)}</b> ≈ ${T(`\\tfrac{${n - 1}}{${n}}`)}·100 = ${f((n - 1) / n * 100, 1)}</span></div>`;
      if (window.renderMath) window.renderMath($("varRead"));
    };
    X.bind(["vn"], v => { n = v.vn; run(); }, { vn: v => String(v) });
    $("vBtns").addEventListener("click", e => { if (e.target.dataset.a) run(); });
    document.addEventListener("themechange", run);
  }

  /* ---------------- HÌNH 13.1: X và X̄ ---------------- */
  if ($("xbarFig")) X.responsive($("xbarFig"), () => {
    const c = X.chart($("xbarFig"), { height: 250, xmin: 15, xmax: 105, ymin: 0, ymax: 0.088 });
    c.axes({ xticks: [15, 30, 45, 60, 75, 90, 105], yticks: [0, 0.02, 0.04, 0.06, 0.08], yfmt: v => X.fmt(v, 2, true), xlabel: "phút" });
    c.area(x => X.normPdf(x, 60, 15), 70, 105, { fill: "var(--s1)", "fill-opacity": .25 });
    c.area(x => X.normPdf(x, 60, 5), 70, 105, { fill: "var(--s2)", "fill-opacity": .55 });
    c.curve(x => X.normPdf(x, 60, 15), 15, 105, { stroke: "var(--s1)" });
    c.curve(x => X.normPdf(x, 60, 5), 15, 105, { stroke: "var(--s2)", "stroke-width": 2.6 });
    c.vline(70);
    c.text(84, 0.022, "1 bệnh nhân: 25%", { style: "fill:var(--s1);font-size:12px", "text-anchor": "start" });
    c.text(72, 0.06, "trung bình 9 người: 2%", { style: "fill:var(--s2);font-size:12px", "text-anchor": "start" });
  });

  /* ---------------- KHUNG: giới hạn trung tâm ---------------- */
  if ($("cltWidget")) {
    let n = 1;
    const render = () => {
      const r = rng(500 + n), M = 3000, mu = 20, sig = 20, se = sig / Math.sqrt(n);
      const means = [];
      for (let t = 0; t < M; t++) { let s = 0; for (let i = 0; i < n; i++) s += -mu * Math.log(1 - r()); means.push(s / n); }
      const lo = Math.max(0, mu - 4 * se), hi = Math.min(110, mu + (n === 1 ? 4.5 : 4.5) * se + (n < 4 ? 15 : 0));
      const B = 36, bw = (hi - lo) / B, cnt = new Array(B).fill(0);
      means.forEach(v => { const i = Math.floor((v - lo) / bw); if (i >= 0 && i < B) cnt[i]++; });
      const dens = cnt.map(c => c / M / bw);
      const ymax = Math.max(...dens, X.normPdf(mu, mu, se)) * 1.15;
      const c = X.chart($("cltPlot"), { height: 250, xmin: lo, xmax: hi, ymin: 0, ymax, margin: { left: 54 } });
      c.axes({ yticks: X.niceTicks(0, ymax, 4), yfmt: v => X.fmt(v, 3, true), xlabel: "trung bình mẫu (phút)" });
      dens.forEach((d, i) => X.el("rect", { x: c.x(lo + i * bw), y: c.y(d), width: Math.max(0.5, c.x(lo + (i + 1) * bw) - c.x(lo + i * bw) - 0.5), height: c.y(0) - c.y(d), fill: "color-mix(in srgb, var(--s1) 50%, var(--surface))" }, c.g));
      c.curve(x => X.normPdf(x, mu, se), lo, hi, { stroke: "var(--s2)", "stroke-width": 2.6 });
      const m = means.reduce((a, b) => a + b, 0) / M, sd = Math.sqrt(means.reduce((a, b) => a + (b - m) ** 2, 0) / (M - 1));
      $("cltRead").innerHTML = `<div class="row"><span class="kv">Trung bình của 3000 giá trị $\\overline x$: <b>${f(m, 2)}</b> (lý thuyết $\\mu=20$)</span><span class="kv">Độ lệch chuẩn của chúng: <b>${f(sd, 2)}</b> (lý thuyết $\\frac{20}{\\sqrt{${n}}}=${X.tfmt(se, 2)}$)</span></div>`;
      if (window.renderMath) window.renderMath($("cltRead"));
    };
    X.bind(["cn"], v => { n = v.cn; render(); }, { cn: v => String(v) });
    X.responsive($("cltPlot"), render);
  }
});
