/* ==========================================================
   bai1.js — các hình vẽ và phần tương tác của Bài 1
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const T = s => X.tex(s);
  const f = (v, d = 4) => X.fmt(v, d);
  const tf = (v, d = 4) => X.tfmt(v, d);
  let uid = 0;

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm1")) X.mindmap($("mm1"), {
    t: "Bài 1<br>Các công thức xác suất",
    c: [
      { t: "Nền tảng", c: [{ t: "Biến cố đối $\\overline{S}$" }, { t: "De Morgan: gạch gãy, dấu lật" }, { t: "$P=\\frac{m}{n}$, $P(\\overline S)=1-P(S)$" }] },
      { t: "Có điều kiện", c: [{ t: "$P(V\\mid S)=\\frac{P(SV)}{P(S)}$" }, { t: "Độc lập: $P(SV)=P(S)P(V)$" }] },
      { t: "Nhân — “VÀ”", c: [{ t: "$P(SV)=P(S)P(V\\mid S)$" }, { t: "Cây: nhân dọc nhánh" }] },
      { t: "Cộng — “HOẶC”", c: [{ t: "$P(S)+P(V)-P(SV)$" }, { t: "Ít nhất một $=1-P(\\text{không ai})$" }] },
      { t: "Toàn phần & Bayes", c: [{ t: "Hệ đầy đủ (cắt bánh)" }, { t: "Toàn phần: cộng các nhánh" }, { t: "Bayes: 1 nhánh ÷ tổng" }] },
      { t: "Xét nghiệm", c: [{ t: "Se, Sp: đọc theo cột" }, { t: "PV⁺, PV⁻: đọc theo hàng" }, { t: "Bài toán ngược: ẩn $x=P(T^+)$" }] },
      { t: "Bernoulli", c: [{ t: "$C_n^m p^m q^{n-m}$" }, { t: "Ít nhất / nhiều nhất" }, { t: "Tìm $n$: logarit" }] }
    ]
  }, { colW: 250 });

  /* ---------------- SƠ ĐỒ VENN 2 TẬP ----------------
     vùng: s = chỉ S, b = cả hai, v = chỉ V, n = không bệnh nào */
  function venn2(host, o = {}) {
    const id = "vn" + (++uid);
    const W = 420, H = 250;
    host.innerHTML = "";
    const svg = X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: "width:100%;height:auto;display:block", role: "img", "aria-label": o.aria || "Sơ đồ Venn" }, host);
    const defs = X.el("defs", {}, svg);
    const S = { cx: 162, cy: 128, r: 86 }, V = { cx: 258, cy: 128, r: 86 };
    const cp = X.el("clipPath", { id: id + "cS" }, defs); X.el("circle", S, cp);
    const mk = (name, circles) => {
      const m = X.el("mask", { id: id + name }, defs);
      X.el("rect", { x: 0, y: 0, width: W, height: H, fill: "#fff" }, m);
      circles.forEach(c => X.el("circle", Object.assign({ fill: "#000" }, c), m));
    };
    mk("nS", [S]); mk("nV", [V]); mk("out", [S, V]);
    const fill = o.fills || {};
    const reg = {};
    reg.n = X.el("rect", { x: 10, y: 10, width: W - 20, height: H - 20, rx: 10, mask: `url(#${id}out)`, fill: fill.n || "transparent" }, svg);
    reg.s = X.el("circle", Object.assign({ mask: `url(#${id}nV)`, fill: fill.s || "transparent" }, S), svg);
    reg.v = X.el("circle", Object.assign({ mask: `url(#${id}nS)`, fill: fill.v || "transparent" }, V), svg);
    reg.b = X.el("circle", Object.assign({ "clip-path": `url(#${id}cS)`, fill: fill.b || "transparent" }, V), svg);
    Object.values(reg).forEach(r => r.style.transition = "fill .25s");
    X.el("rect", { x: 10, y: 10, width: W - 20, height: H - 20, rx: 10, fill: "none", stroke: "var(--border-strong)", "stroke-width": 1.5 }, svg);
    X.el("circle", Object.assign({ fill: "none", stroke: "var(--s1)", "stroke-width": 2.2 }, S), svg);
    X.el("circle", Object.assign({ fill: "none", stroke: "var(--s2)", "stroke-width": 2.2 }, V), svg);
    const txt = (x, y, s, cls = "svg-strong", extra = {}) => { const t = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: cls }, extra), svg); t.textContent = s; return t; };
    txt(96, 52, o.nameS || "S", "svg-strong", { style: "fill:var(--s1);font-size:17px" });
    txt(324, 52, o.nameV || "V", "svg-strong", { style: "fill:var(--s2);font-size:17px" });
    txt(30, 34, "Ω", "svg-text", { style: "font-size:15px" });
    const pos = { s: [118, 133], b: [210, 133], v: [302, 133], n: [372, 226] };
    if (o.texts) for (const k in o.texts) txt(pos[k][0], pos[k][1], o.texts[k], "svg-strong");
    return { svg, reg, set(on, color = "var(--s7)") { for (const k in reg) reg[k].setAttribute("fill", on.includes(k) ? color : "transparent"); reg.n.setAttribute("fill-opacity", .5); reg.s.setAttribute("fill-opacity", .5); reg.v.setAttribute("fill-opacity", .5); reg.b.setAttribute("fill-opacity", .5); } };
  }

  /* Widget tô vùng */
  if ($("vennWidget")) {
    const rows = [
      { name: "Luật 1", items: [
        { tex: "\\overline{S\\cup V}", set: "n", say: "không phải (sâu răng hoặc viêm nướu) — tức là không mắc bệnh nào" },
        { tex: "\\overline{S}\\cap\\overline{V}", set: "n", say: "không sâu răng VÀ không viêm nướu — không mắc bệnh nào" }] },
      { name: "Luật 2", items: [
        { tex: "\\overline{S\\cap V}", set: "svn", say: "không phải (vừa sâu răng vừa viêm nướu) — không mắc đồng thời hai bệnh" },
        { tex: "\\overline{S}\\cup\\overline{V}", set: "svn", say: "không sâu răng HOẶC không viêm nướu — ít nhất một bệnh vắng mặt" }] },
      { name: "Cơ bản", items: [
        { tex: "S\\cup V", set: "sbv", say: "mắc ít nhất một trong hai bệnh" },
        { tex: "S\\cap V", set: "b", say: "mắc cả hai bệnh" },
        { tex: "\\overline{S}", set: "vn", say: "không sâu răng (có thể viêm nướu hoặc không)" },
        { tex: "\\overline{V}", set: "sn", say: "không viêm nướu" }] },
      { name: "Khác", items: [
        { tex: "S\\cap\\overline{V}", set: "s", say: "chỉ bị sâu răng" },
        { tex: "(S\\cap\\overline V)\\cup(\\overline S\\cap V)", set: "sv", say: "mắc đúng một bệnh" }] }
    ];
    const vz = venn2($("vennPlot"), { aria: "Sơ đồ Venn sâu răng và viêm nướu" });
    const nameOf = { s: "① chỉ S", b: "② cả hai", v: "③ chỉ V", n: "④ không bệnh" };
    const btnWrap = $("vennBtns");
    btnWrap.style.display = "grid"; btnWrap.style.gap = "8px";
    const all = [];
    rows.forEach(r => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;align-items:center";
      row.innerHTML = `<span class="small muted" style="min-width:64px;font-weight:700">${r.name}</span>`;
      r.items.forEach(it => {
        const b = document.createElement("button");
        b.innerHTML = T(it.tex);
        b.addEventListener("click", () => pick(it, b));
        row.appendChild(b); all.push([it, b]);
      });
      btnWrap.appendChild(row);
    });
    function pick(it, b) {
      all.forEach(([, bb]) => bb.classList.remove("on"));
      b.classList.add("on");
      vz.set(it.set);
      $("vennRead").innerHTML = `${T(it.tex)} = <b>${it.say}</b><br><span class="muted">Vùng được tô: ${it.set.split("").map(k => nameOf[k]).join(", ")}</span>`;
    }
    pick(all[0][0], all[0][1]);
  }

  /* Hình 2.1 — hai luật */
  if ($("vennLaws")) {
    const host = $("vennLaws");
    const items = [
      ["\\overline{S\\cup V}", "n", "Luật 1 — vế trái"], ["\\overline{S}\\cap\\overline{V}", "n", "Luật 1 — vế phải"],
      ["\\overline{S\\cap V}", "svn", "Luật 2 — vế trái"], ["\\overline{S}\\cup\\overline{V}", "svn", "Luật 2 — vế phải"]
    ];
    items.forEach(([tex, set, cap]) => {
      const d = document.createElement("div");
      d.innerHTML = `<div class="center small"><b>${cap}:</b> ${T(tex)}</div><div class="vv"></div>`;
      host.appendChild(d);
      venn2(d.querySelector(".vv")).set(set, set === "n" ? "var(--s1)" : "var(--s2)");
    });
  }

  /* Hình 6.1 — vì sao phải trừ phần giao */
  if ($("vennAdd")) {
    const host = $("vennAdd");
    const svg = X.el("svg", { viewBox: "0 0 460 250", style: "width:100%;height:auto;display:block" }, host);
    X.el("rect", { x: 10, y: 10, width: 440, height: 230, rx: 10, fill: "none", stroke: "var(--border-strong)" }, svg);
    X.el("circle", { cx: 180, cy: 128, r: 88, fill: "var(--s1)", "fill-opacity": .28, stroke: "var(--s1)", "stroke-width": 2 }, svg);
    X.el("circle", { cx: 280, cy: 128, r: 88, fill: "var(--s2)", "fill-opacity": .28, stroke: "var(--s2)", "stroke-width": 2 }, svg);
    const t = (x, y, s, st = "") => { const e = X.el("text", { x, y, "text-anchor": "middle", class: "svg-strong", style: st }, svg); e.textContent = s; };
    t(130, 133, "P(S)", "fill:var(--s1)"); t(330, 133, "P(V)", "fill:var(--s2)");
    t(230, 122, "đếm"); t(230, 142, "2 lần");
    t(230, 232, "→ trừ đi P(S ∩ V) một lần", "font-weight:600;font-size:13px");
  }

  /* Ví dụ 6.1 — 4 vùng có số */
  if ($("vennEx61")) venn2($("vennEx61"), {
    texts: { s: "0,30", b: "0,30", v: "0,15", n: "0,25" },
    fills: { s: "var(--s1-soft)", v: "var(--s2-soft)", b: "var(--s7-soft)" }
  });

  /* ---------------- BAO HÀM – LOẠI TRỪ (3 tập) ---------------- */
  if ($("incWidget")) {
    const host = $("incPlot");
    const svg = X.el("svg", { viewBox: "0 0 420 300", style: "width:100%;height:auto;display:block" }, host);
    const C = [{ cx: 170, cy: 118, c: "var(--s1)", n: "X" }, { cx: 250, cy: 118, c: "var(--s2)", n: "Y" }, { cx: 210, cy: 188, c: "var(--s3)", n: "Z" }];
    C.forEach(c => X.el("circle", { cx: c.cx, cy: c.cy, r: 82, fill: c.c, "fill-opacity": .14, stroke: c.c, "stroke-width": 2 }, svg));
    [[92, 46], [328, 46], [210, 292]].forEach((p, i) => { const e = X.el("text", { x: p[0], y: p[1], "text-anchor": "middle", class: "svg-strong", style: `fill:${C[i].c};font-size:16px` }, svg); e.textContent = C[i].n; });
    const regs = [
      { k: "x", p: [128, 100], deg: 1 }, { k: "y", p: [292, 100], deg: 1 }, { k: "z", p: [210, 250], deg: 1 },
      { k: "xy", p: [210, 84], deg: 2 }, { k: "xz", p: [163, 172], deg: 2 }, { k: "yz", p: [257, 172], deg: 2 },
      { k: "xyz", p: [210, 140], deg: 3 }
    ];
    const labels = regs.map(r => { const e = X.el("text", { x: r.p[0], y: r.p[1] + 6, "text-anchor": "middle", style: "font:800 19px var(--font)" }, svg); return e; });
    const steps = [
      { b: "Bước 1: + 3 đơn", cnt: d => d, say: "Cộng $P(X)+P(Y)+P(Z)$: vùng chỉ thuộc 1 tập được tính 1 lần, vùng thuộc 2 tập bị tính <b>2 lần</b>, vùng giữa bị tính <b>3 lần</b>." },
      { b: "Bước 2: − 3 đôi", cnt: d => d - (d === 2 ? 1 : d === 3 ? 3 : 0), say: "Trừ $P(XY)+P(XZ)+P(YZ)$: mỗi vùng “đôi” bớt 1 lần (còn 1), nhưng vùng giữa nằm trong cả 3 giao đôi nên bị trừ 3 lần → còn <b>0</b>." },
      { b: "Bước 3: + bộ ba", cnt: d => 1, say: "Cộng lại $P(XYZ)$: vùng giữa trở về 1 lần. Mọi vùng đều được tính đúng 1 lần ✓." }
    ];
    const seg = $("incBtns");
    steps.forEach((s, i) => { const b = document.createElement("button"); b.textContent = s.b; b.onclick = () => go(i); seg.appendChild(b); });
    function go(i) {
      [...seg.children].forEach((b, j) => b.classList.toggle("on", j === i));
      regs.forEach((r, j) => { const v = steps[i].cnt(r.deg); labels[j].textContent = v; labels[j].setAttribute("fill", v === 1 ? "var(--s3)" : "var(--s8)"); });
      $("incRead").innerHTML = steps[i].say; window.renderMath($("incRead"));
    }
    go(0);
  }

  /* ---------------- LƯỚI 100 BỆNH NHÂN ---------------- */
  if ($("condWidget")) {
    const grid = $("condGrid");
    const people = [];
    const push = (n, h, nn) => { for (let i = 0; i < n; i++) people.push({ H: h, N: nn }); };
    push(20, true, true); push(20, true, false); push(10, false, true); push(50, false, false);
    people.forEach(p => {
      const d = document.createElement("div"); d.className = "d";
      d.style.background = p.N ? "var(--s2)" : "var(--surface-3)";
      if (p.H) d.style.boxShadow = "inset 0 0 0 3px var(--text)";
      d.title = (p.H ? "Hút thuốc" : "Không hút thuốc") + " · " + (p.N ? "bị nha chu" : "không nha chu");
      grid.appendChild(d); p.el = d;
    });
    const conds = [
      { b: "Chưa biết gì", f: () => true, txt: (k, n) => `Xét cả ${n} người: ${k} người bị nha chu → ${T(`P(N)=\\frac{${k}}{${n}}=${X.tfmt(k / n, 4, true)}`)}` },
      { b: "Biết: hút thuốc (H)", f: p => p.H, txt: (k, n) => `Chỉ còn ${n} người hút thuốc, trong đó ${k} người bị nha chu → ${T(`P(N\\mid H)=\\frac{${k}}{${n}}=${X.tfmt(k / n, 4, true)}`)}` },
      { b: "Biết: không hút thuốc", f: p => !p.H, txt: (k, n) => `Chỉ còn ${n} người không hút thuốc, ${k} người bị nha chu → ${T(`P(N\\mid \\overline{H})=\\frac{${k}}{${n}}\\approx${tf(k / n)}`)}` },
      { b: "Biết: bị nha chu (N)", f: p => p.N, txt: (k, n) => `Chỉ còn ${n} người bị nha chu, trong đó ${k} người hút thuốc → ${T(`P(H\\mid N)=\\frac{${k}}{${n}}\\approx${tf(k / n)}`)} <span class="muted">(khác ${T("P(N\\mid H)")}!)</span>` }
    ];
    const seg = $("condBtns");
    conds.forEach((c, i) => { const b = document.createElement("button"); b.textContent = c.b; b.onclick = () => go(i); seg.appendChild(b); });
    function go(i) {
      [...seg.children].forEach((b, j) => b.classList.toggle("on", j === i));
      const c = conds[i]; let n = 0, k = 0;
      people.forEach(p => { const inn = c.f(p); p.el.classList.toggle("dim", !inn); if (inn) { n++; if (i === 3 ? p.H : p.N) k++; } });
      $("condRead").innerHTML = c.txt(k, n);
    }
    go(0);
  }

  /* ---------------- CÂY XÁC SUẤT ---------------- */
  const drawTrees = () => {
    if ($("treeTubes")) X.tree($("treeTubes"), {
      rowH: 62,
      branches: [
        { label: "T_1", p: "\\dfrac{9}{12}", hl: true, children: [
          { label: "T_2", p: "\\dfrac{8}{11}", hl: true, leaf: "\\dfrac{9}{12}\\cdot\\dfrac{8}{11}=\\dfrac{72}{132}" },
          { label: "\\overline{T_2}", p: "\\dfrac{3}{11}", leaf: "\\dfrac{9}{12}\\cdot\\dfrac{3}{11}=\\dfrac{27}{132}" }] },
        { label: "\\overline{T_1}", p: "\\dfrac{3}{12}", children: [
          { label: "T_2", p: "\\dfrac{9}{11}", leaf: "\\dfrac{3}{12}\\cdot\\dfrac{9}{11}=\\dfrac{27}{132}" },
          { label: "\\overline{T_2}", p: "\\dfrac{2}{11}", leaf: "\\dfrac{3}{12}\\cdot\\dfrac{2}{11}=\\dfrac{6}{132}" }] }
      ]
    });
    if ($("treeFill")) X.tree($("treeFill"), {
      rowH: 44,
      branches: [
        { label: "M", p: "0{,}5", children: [{ label: "B", p: "0{,}04", hl: true, leaf: "0{,}5\\cdot0{,}04=0{,}020" }, { label: "\\overline B", p: "0{,}96", leaf: "0{,}480" }] },
        { label: "L", p: "0{,}3", children: [{ label: "B", p: "0{,}06", hl: true, leaf: "0{,}3\\cdot0{,}06=0{,}018" }, { label: "\\overline B", p: "0{,}94", leaf: "0{,}282" }] },
        { label: "H", p: "0{,}2", children: [{ label: "B", p: "0{,}10", hl: true, leaf: "0{,}2\\cdot0{,}10=0{,}020" }, { label: "\\overline B", p: "0{,}90", leaf: "0{,}180" }] }
      ]
    });
    if ($("treeBayes")) X.tree($("treeBayes"), {
      rowH: 66, x1: 0.3, x2: 0.52,
      branches: [
        { label: "M", p: "0{,}5", children: [{ label: "B", p: "0{,}04", leaf: "0{,}020\\;\\Rightarrow\\;\\dfrac{0{,}020}{0{,}058}\\approx0{,}345" }] },
        { label: "L", p: "0{,}3", children: [{ label: "B", p: "0{,}06", leaf: "0{,}018\\;\\Rightarrow\\;\\dfrac{0{,}018}{0{,}058}\\approx0{,}310" }] },
        { label: "H", p: "0{,}2", hl: true, children: [{ label: "B", p: "0{,}10", hl: true, leaf: "0{,}020\\;\\Rightarrow\\;\\dfrac{0{,}020}{0{,}058}\\approx0{,}345" }] }
      ]
    });
  };
  drawTrees();
  let tw = window.innerWidth;
  window.addEventListener("resize", () => { if (Math.abs(window.innerWidth - tw) > 30) { tw = window.innerWidth; drawTrees(); } });

  /* ---------------- MOSAIC TOÀN PHẦN / BAYES ---------------- */
  if ($("bayesWidget")) {
    const names = ["Minh", "Lan", "Hòa"], cols = ["var(--s1)", "var(--s2)", "var(--s3)"], soft = ["var(--s1-soft)", "var(--s2-soft)", "var(--s3-soft)"];
    let st = {};
    const render = () => {
      let w1 = st.bw1, w2 = st.bw2;
      if (w1 + w2 > 0.95) { w2 = Math.max(0.05, 0.95 - w1); }
      const w = [w1, w2, Math.max(0, 1 - w1 - w2)], r = [st.br1, st.br2, st.br3];
      const area = w.map((wi, i) => wi * r[i]); const PB = area.reduce((a, b) => a + b, 0);
      const host = $("bayesPlot");
      const c = X.chart(host, { height: 250, xmin: 0, xmax: 1, ymin: 0, ymax: 0.3, margin: { left: 46, bottom: 34, top: 30 } });
      c.axes({ xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [0, 0.1, 0.2, 0.3], xfmt: v => Math.round(v * 100) + "%", yfmt: v => Math.round(v * 100) + "%", nogrid: false });
      let x0 = 0;
      w.forEach((wi, i) => {
        if (wi <= 0) return;
        const g = X.el("g", {}, c.svg);
        X.el("rect", { x: c.x(x0) + 1, y: c.y(0.3), width: Math.max(0, c.x(x0 + wi) - c.x(x0) - 2), height: c.y(0) - c.y(0.3), fill: soft[i] }, g);
        const top = c.y(r[i]);
        X.el("rect", { x: c.x(x0) + 1, y: top, width: Math.max(0, c.x(x0 + wi) - c.x(x0) - 2), height: c.y(0) - top, fill: cols[i], rx: 3 }, g);
        const tt = X.el("title", {}, g); tt.textContent = `BS ${names[i]}: tỉ trọng ${f(wi, 2)}, tỉ lệ bong ${f(r[i], 2)} → diện tích ${f(area[i], 4)}`;
        const lab = X.el("text", { x: c.x(x0 + wi / 2), y: c.m.top - 10, "text-anchor": "middle", class: "svg-strong" }, c.svg);
        lab.textContent = `${names[i]} ${Math.round(wi * 100)}%`;
        x0 += wi;
      });
      const rows = w.map((wi, i) => `<tr><td class="left"><span class="sw" style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${cols[i]};margin-right:6px"></span>BS ${names[i]}</td><td>${f(wi, 2)}</td><td>${f(r[i], 2)}</td><td>${f(area[i], 4)}</td><td><b>${PB > 0 ? f(area[i] / PB, 4) : "—"}</b></td></tr>`).join("");
      $("bayesRead").innerHTML =
        `<div>Toàn phần: ${T(`P(B)=${w.map((wi, i) => `${tf(wi, 2)}\\cdot${tf(r[i], 2)}`).join("+")}=${tf(PB, 4)}`)}</div>
         <div class="table-wrap" style="margin:8px 0 0"><table class="compact"><tr><th class="left">Nguồn</th><th>${T("P(H_i)")}</th><th>${T("P(B\\mid H_i)")}</th><th>Diện tích ${T("P(H_i)P(B\\mid H_i)")}</th><th>Hậu nghiệm ${T("P(H_i\\mid B)")}</th></tr>${rows}</table></div>`;
    };
    const fm = { bw1: v => f(v, 2), bw2: v => f(v, 2), br1: v => f(v, 2), br2: v => f(v, 2), br3: v => f(v, 2) };
    const b = X.bind(["bw1", "bw2", "br1", "br2", "br3"], v => { st = v; render(); }, fm);
    X.responsive($("bayesPlot"), render);
  }

  /* ---------------- 1000 NGƯỜI XÉT NGHIỆM ---------------- */
  if ($("testWidget")) {
    const grid = $("testGrid"); const dots = [];
    for (let i = 0; i < 1000; i++) { const d = document.createElement("div"); d.className = "d"; grid.appendChild(d); dots.push(d); }
    const col = { tp: "var(--s3)", fn: "var(--s4)", fp: "var(--s2)", tn: "color-mix(in srgb, var(--s1) 35%, var(--surface))" };
    X.bind(["tPrev", "tSe", "tSp"], v => {
      const D = Math.round(1000 * v.tPrev), Hh = 1000 - D;
      const TP = Math.round(D * v.tSe), FN = D - TP, TN = Math.round(Hh * v.tSp), FP = Hh - TN;
      const seq = [].concat(Array(TP).fill("tp"), Array(FN).fill("fn"), Array(FP).fill("fp"), Array(TN).fill("tn"));
      dots.forEach((d, i) => { d.style.background = col[seq[i]]; d.title = { tp: "Dương thật", fn: "Âm giả", fp: "Dương giả", tn: "Âm thật" }[seq[i]]; });
      const pvp = v.tPrev * v.tSe / (v.tPrev * v.tSe + (1 - v.tPrev) * (1 - v.tSp));
      const pvn = (1 - v.tPrev) * v.tSp / ((1 - v.tPrev) * v.tSp + v.tPrev * (1 - v.tSe));
      const acc = v.tPrev * v.tSe + (1 - v.tPrev) * v.tSp;
      $("testRead").innerHTML = `
        <div class="table-wrap" style="margin:0 0 8px"><table class="compact">
          <tr><th></th><th>${T("M^+")} (${D})</th><th>${T("M^-")} (${Hh})</th><th>Tổng</th></tr>
          <tr><th>${T("T^+")}</th><td class="tp">${TP}</td><td class="fp">${FP}</td><td>${TP + FP}</td></tr>
          <tr><th>${T("T^-")}</th><td class="fn">${FN}</td><td class="tn">${TN}</td><td>${FN + TN}</td></tr></table></div>
        <div class="row">
          <span class="kv">${T("PV^+=\\frac{" + TP + "}{" + (TP + FP) + "}")} ≈ <b>${f(pvp, 4)}</b></span>
          <span class="kv">${T("PV^-=\\frac{" + TN + "}{" + (FN + TN) + "}")} ≈ <b>${f(pvn, 4)}</b></span>
          <span class="kv">Chẩn đoán đúng ≈ <b>${f(acc, 4)}</b></span>
          <span class="kv">${T("P(T^+)")} ≈ <b>${f((TP + FP) / 1000, 3)}</b></span>
        </div>
        <div class="small muted" style="margin-top:6px">Số người được làm tròn; các giá trị ${T("PV")} tính theo công thức Bayes nên chính xác hơn tỉ số đếm.</div>`;
    }, { tPrev: v => (v * 100).toFixed(1).replace(".", ",") + "%", tSe: v => f(v, 2), tSp: v => f(v, 2) });
  }

  /* ---------------- 8 DÃY KẾT QUẢ (n = 3) ---------------- */
  if ($("seqFig")) {
    const host = $("seqFig");
    host.className = "grid2"; host.style.gridTemplateColumns = "repeat(auto-fill,minmax(190px,1fr))";
    for (let m = 7; m >= 0; m--) {
      const bits = [4, 2, 1].map(b => (m & b) ? 1 : 0); const k = bits.reduce((a, b) => a + b, 0);
      const hl = k === 2;
      const card = document.createElement("div"); card.className = "card";
      card.style.cssText = `display:flex;align-items:center;gap:10px;${hl ? "border:2px solid var(--s2);background:var(--s2-soft)" : ""}`;
      const circles = bits.map(b => `<span style="display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;font-weight:800;font-size:13px;${b ? "background:var(--s3);color:#fff" : "border:2px solid var(--border-strong);color:var(--muted)"}">${b ? "K" : "K̄"}</span>`).join("");
      const prob = bits.map(b => b ? "p" : "q").join("\\cdot ");
      card.innerHTML = `<span style="display:flex;gap:4px">${circles}</span><span class="small">${T(prob)}</span>`;
      host.appendChild(card);
    }
    const note = document.createElement("p"); note.className = "small muted"; note.style.gridColumn = "1/-1";
    note.innerHTML = "Ba ô viền cam là các dãy có đúng 2 lần thành công — mỗi dãy có xác suất " + T("p^2q") + ".";
    host.appendChild(note);
  }

  /* ---------------- BIỂU ĐỒ BERNOULLI ---------------- */
  if ($("binWidget")) {
    const modes = [["eq", "Đúng k"], ["ge", "Ít nhất k"], ["le", "Nhiều nhất k"]];
    let mode = "ge"; let st = null;
    const seg = $("binMode");
    modes.forEach(([k, lab]) => { const b = document.createElement("button"); b.textContent = lab; b.dataset.k = k; b.onclick = () => { mode = k; [...seg.children].forEach(x => x.classList.toggle("on", x.dataset.k === k)); render(); }; seg.appendChild(b); });
    [...seg.children].forEach(x => x.classList.toggle("on", x.dataset.k === mode));
    const render = () => {
      if (!st) return;
      const n = st.bn, p = st.bp; const kEl = $("bk"); kEl.max = n; let k = Math.min(st.bk, n);
      if (+kEl.value > n) { kEl.value = n; } k = +kEl.value; document.querySelector('output[for="bk"]').textContent = k;
      const P = []; for (let m = 0; m <= n; m++) P.push(X.binom(m, n, p));
      const sel = m => mode === "eq" ? m === k : mode === "ge" ? m >= k : m <= k;
      const ymax = Math.max(...P) * 1.15;
      const c = X.chart($("binPlot"), { height: 250, xmin: -0.7, xmax: n + 0.7, ymin: 0, ymax, margin: { left: 50 } });
      const step = n > 20 ? 5 : n > 10 ? 2 : 1; const xt = []; for (let m = 0; m <= n; m += step) xt.push(m);
      c.axes({ xticks: xt, xfmt: v => String(v), ycount: 4 });
      c.bars(P.map((v, m) => ({ x: m, y: v, fill: sel(m) ? "var(--s2)" : "color-mix(in srgb, var(--s1) 40%, var(--surface))" })), { maxW: 40 });
      c.hover(xv => { const m = Math.round(xv); if (m < 0 || m > n) return null; return `m = ${m}: P = ${f(P[m], 4)}`; }, { snap: v => Math.round(v), ty: xv => c.y(P[Math.max(0, Math.min(n, Math.round(xv)))] || 0) });
      const tot = P.reduce((a, v, m) => a + (sel(m) ? v : 0), 0);
      const q = 1 - p;
      let expr;
      if (mode === "eq") expr = `P_{${n}}(${k})=C_{${n}}^{${k}}\\,${tf(p, 2)}^{${k}}\\,${tf(q, 2)}^{${n - k}}`;
      else if (mode === "ge") expr = k === 0 ? `P(\\ge 0)=1` : `P(\\ge ${k})=\\sum_{m=${k}}^{${n}}P_{${n}}(m)` + (k <= n / 2 ? `=1-\\sum_{m=0}^{${k - 1}}P_{${n}}(m)` : "");
      else expr = `P(\\le ${k})=\\sum_{m=0}^{${k}}P_{${n}}(m)` + (k >= n / 2 && k < n ? `=1-\\sum_{m=${k + 1}}^{${n}}P_{${n}}(m)` : "");
      const lo = n * p - q, hi = n * p + p; const m0s = []; for (let m = Math.ceil(lo - 1e-9); m <= Math.floor(hi + 1e-9); m++) if (m >= 0 && m <= n) m0s.push(m);
      $("binRead").innerHTML = `<div>${T(expr)} ≈ <b>${f(tot, 4)}</b></div>
        <div class="small muted" style="margin-top:4px">Số lần có khả năng nhất: ${T(`${tf(lo, 2)}\\le m_0\\le ${tf(hi, 2)}`)} → ${T("m_0=" + m0s.join(";\\ "))} · Tổng chiều cao mọi cột = 1.</div>`;
    };
    X.bind(["bn", "bp", "bk"], v => { st = v; render(); }, { bn: v => String(v), bp: v => f(v, 2), bk: v => String(v) });
    X.responsive($("binPlot"), render);
  }

  /* ---------------- ĐỒ THỊ y = ln x ---------------- */
  if ($("lnPlot")) {
    const host = $("lnPlot");
    const neg = v => f(v, 3).replace("-", "−");
    const render = () => {
      const c = X.chart(host, { height: 270, xmin: 0, xmax: 3, ymin: -3.2, ymax: 1.4, margin: { left: 40, bottom: 34, top: 14 }, aria: "đồ thị y = ln x" });
      c.axes({ xticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], yticks: [-3, -2, -1, 0, 1], yfmt: v => String(v).replace("-", "−") });
      X.el("rect", { x: c.x(0), y: c.y(0), width: c.x(1) - c.x(0), height: c.y(-3.2) - c.y(0), fill: "var(--s2-soft)", opacity: .8 }, c.g);
      c.hline(0, { "stroke-dasharray": null, stroke: "var(--border-strong)", "stroke-width": 1.4 });
      c.curve(Math.log, 0.045, 3);
      const pts = [
        { x: 0.05, s: "ln 0,05 ≈ −3,00", a: { dx: 10, dy: 5, "text-anchor": "start" } },
        { x: 0.7, s: "ln 0,7 ≈ −0,357", a: { dx: 10, dy: 18, "text-anchor": "start" } },
        { x: 1, s: "ln 1 = 0", a: { dx: -8, dy: -8, "text-anchor": "end" } },
        { x: Math.E, s: "ln e = 1", a: { dx: -10, dy: -6, "text-anchor": "end" } }
      ];
      pts.forEach(p => { c.dot(p.x, Math.log(p.x)); c.text(p.x, Math.log(p.x), p.s, p.a); });
      c.text(0.5, -2.2, "0 < x < 1:", { class: "svg-strong", style: "fill:var(--s2)" });
      c.text(0.5, -2.2, "ln x âm", { dy: 17, class: "svg-strong", style: "fill:var(--s2)" });
      c.hover(xv => {
        if (xv < 0.04 || xv > 3) return null;
        const y = Math.log(xv);
        return `x = ${f(xv, 2)} → ln x ≈ ${neg(y)}<br><span style="opacity:.75">vì e<sup>${neg(y)}</sup> ≈ ${f(xv, 2)}</span>`;
      }, { snap: v => Math.round(v * 100) / 100, ty: xv => c.y(Math.max(-3.1, Math.min(1.3, Math.log(Math.max(xv, 0.04))))) });
    };
    X.responsive(host, render);
  }

  /* ---------------- TÌM n NHỎ NHẤT ---------------- */
  if ($("nminWidget")) {
    const t2 = v => X.tfmt(v, 2, true);
    let st = null;
    const render = () => {
      if (!st) return;
      const p = Math.round(st.nmP * 100) / 100, g = Math.round(st.nmG * 100) / 100;
      const q = Math.round((1 - p) * 100) / 100, r = Math.round((1 - g) * 100) / 100;
      let nmin = 1; while (q ** nmin > r + 1e-12) nmin++;
      const N = Math.max(10, nmin + 3);
      const vals = []; for (let n = 1; n <= N; n++) vals.push(1 - q ** n);
      const c = X.chart($("nminPlot"), { height: 250, xmin: 0.3, xmax: N + 0.7, ymin: 0, ymax: 1.05, margin: { left: 44 } });
      const step = N > 30 ? 5 : N > 15 ? 2 : 1; const xt = []; for (let n = step; n <= N; n += step) xt.push(n);
      c.axes({ xticks: xt, xfmt: v => String(v), yticks: [0, 0.25, 0.5, 0.75, 1] });
      c.bars(vals.map((v, i) => ({ x: i + 1, y: v, fill: i + 1 === nmin ? "var(--s3)" : i + 1 > nmin ? "color-mix(in srgb, var(--s3) 40%, var(--surface))" : "color-mix(in srgb, var(--s1) 40%, var(--surface))" })), { maxW: 34 });
      c.hline(g, { stroke: "var(--s2)", "stroke-width": 1.6 });
      c.text(0.3, g, `γ = ${f(g, 2)}`, { dx: 4, dy: -6, "text-anchor": "start", class: "svg-strong", style: "fill:var(--s2)" });
      c.hover(xv => { const n = Math.round(xv); if (n < 1 || n > N) return null; return `n = ${n}: 1 − ${f(q, 2, true)}<sup>${n}</sup> ≈ ${f(vals[n - 1], 4)}${n === nmin ? " ← lần đầu đạt mốc" : ""}`; },
        { snap: v => Math.round(v), ty: xv => c.y(vals[Math.max(1, Math.min(N, Math.round(xv))) - 1]) });
      const lr = Math.log(r), lq = Math.log(q), ratio = lr / lq;
      $("nminRead").innerHTML =
        `<div>${T(`1-${t2(q)}^n\\ge${t2(g)}\\iff ${t2(q)}^n\\le${t2(r)}\\iff n\\ge\\dfrac{\\ln${t2(r)}}{\\ln${t2(q)}}=\\dfrac{${tf(lr)}}{${tf(lq)}}\\approx${tf(ratio, 3)}`)} → ${T(`n_{\\min}=${nmin}`)}</div>
         <div class="small muted" style="margin-top:4px">Thử lại: ${nmin > 1 ? T(`${t2(q)}^{${nmin - 1}}\\approx${tf(q ** (nmin - 1))}>${t2(r)}`) + " (chưa đủ), " : ""}${T(`${t2(q)}^{${nmin}}\\approx${tf(q ** nmin)}\\le${t2(r)}`)} ✓ — sau ${nmin} lần, xác suất có ít nhất một lần thành công ≈ ${f(1 - q ** nmin)}.</div>`;
    };
    X.bind(["nmP", "nmG"], v => { st = v; render(); }, { nmP: v => f(v, 2), nmG: v => f(v, 2) });
    X.responsive($("nminPlot"), render);
  }
});
