/* ==========================================================
   plot.js — hàm toán (phân phối xác suất) + vẽ biểu đồ SVG
   Không phụ thuộc thư viện ngoài (trừ KaTeX để in công thức).
   ========================================================== */
(function () {
  const X = {};

  /* ---------------- ĐỊNH DẠNG SỐ (dấu phẩy thập phân) ---------------- */
  X.fmt = function (v, d = 4, trim = false) {
    if (!isFinite(v)) return "∞";
    let s = Number(v).toFixed(d);
    if (trim && s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    if (s === "-0" || /^-0\.0*$/.test(s)) s = s.slice(1);
    return s.replace(".", ",");
  };
  /* dạng dùng trong KaTeX: 0{,}25 */
  X.tfmt = function (v, d = 4, trim = false) { return X.fmt(v, d, trim).replace(",", "{,}"); };
  X.tex = function (s, display = false) {
    if (!window.katex) return s;
    return window.katex.renderToString(s, { throwOnError: false, displayMode: display });
  };

  /* ---------------- HÀM TOÁN ---------------- */
  /* Hàm phân phối chuẩn tắc G(x) = P(Z < x)  (thuật toán Hart/West, sai số ~1e-15) */
  X.normCdf = function (x, mu = 0, s = 1) {
    const z = (x - mu) / s;
    const a = Math.abs(z);
    let c;
    if (a > 37) c = 0;
    else {
      const e = Math.exp(-a * a / 2);
      if (a < 7.07106781186547) {
        let b = 3.52624965998911e-02 * a + 0.700383064443688;
        b = b * a + 6.37396220353165; b = b * a + 33.912866078383; b = b * a + 112.079291497871;
        b = b * a + 221.213596169931; b = b * a + 220.206867912376;
        c = e * b;
        b = 8.83883476483184e-02 * a + 1.75566716318264;
        b = b * a + 16.064177579207; b = b * a + 86.7807322029461; b = b * a + 296.564248779674;
        b = b * a + 637.333633378831; b = b * a + 793.826512519948; b = b * a + 440.413735824752;
        c = c / b;
      } else {
        let b = a + 0.65; b = a + 4 / b; b = a + 3 / b; b = a + 2 / b; b = a + 1 / b;
        c = e / b / 2.506628274631;
      }
    }
    return z > 0 ? 1 - c : c;
  };
  X.normPdf = (x, mu = 0, s = 1) => Math.exp(-0.5 * ((x - mu) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  /* Tích phân Laplace φ(x) = ∫_0^x l(t) dt = G(x) − 0,5 */
  X.phi = x => X.normCdf(x) - 0.5;
  /* Phân vị chuẩn tắc z_α: P(Z < z_α) = α  (Acklam + 1 bước Newton) */
  X.invNorm = function (p) {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425; let x, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    else if (p <= 1 - pl) { q = p - 0.5; r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    else { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    const e = X.normCdf(x) - p; const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
    return x - u / (1 + x * u / 2);
  };

  X.lgamma = function lg(x) {
    const g = 7, C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lg(1 - x);
    x -= 1; let s = C[0]; const t = x + g + 0.5;
    for (let i = 1; i < 9; i++) s += C[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(s);
  };
  X.comb = function (n, k) {
    if (k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r) === r || r > 1e15 ? r : Math.round(r);
  };
  X.binom = (k, n, p) => {
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0; if (p === 1) return k === n ? 1 : 0;
    return Math.exp(X.lgamma(n + 1) - X.lgamma(k + 1) - X.lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  };

  /* Hàm gamma chính quy (cho χ²) và beta chính quy (cho Student, Fisher) */
  function gammp(a, x) {
    if (x <= 0) return 0;
    const lnPre = -x + a * Math.log(x) - X.lgamma(a);
    if (x < a + 1) {
      let ap = a, sum = 1 / a, del = sum;
      for (let n = 0; n < 1000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return sum * Math.exp(lnPre);
    }
    let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (let i = 1; i < 1000; i++) {
      const an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return 1 - Math.exp(lnPre) * h;
  }
  function betacf(a, b, x) {
    const FP = 1e-300; const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d;
    for (let m = 1; m <= 1000; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function betai(a, b, x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(X.lgamma(a + b) - X.lgamma(a) - X.lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  X.chi2Pdf = (x, k) => x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - X.lgamma(k / 2));
  X.chi2Cdf = (x, k) => gammp(k / 2, x / 2);
  X.tPdf = (x, n) => Math.exp(X.lgamma((n + 1) / 2) - X.lgamma(n / 2) - 0.5 * Math.log(n * Math.PI) - (n + 1) / 2 * Math.log(1 + x * x / n));
  X.tCdf = (t, n) => { const p = 0.5 * betai(n / 2, 0.5, n / (n + t * t)); return t > 0 ? 1 - p : p; };
  X.fPdf = (x, m, n) => x <= 0 ? 0 : Math.exp(0.5 * (m * Math.log(m * x) + n * Math.log(n) - (m + n) * Math.log(m * x + n)) - Math.log(x) - (X.lgamma(m / 2) + X.lgamma(n / 2) - X.lgamma((m + n) / 2)));
  X.fCdf = (x, m, n) => x <= 0 ? 0 : betai(m / 2, n / 2, m * x / (m * x + n));
  /* phân vị bằng chia đôi */
  X.quantile = function (cdf, p, lo, hi) {
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (cdf(mid) < p) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  X.chi2Inv = (p, k) => X.quantile(x => X.chi2Cdf(x, k), p, 0, 1000);
  X.tInv = (p, n) => X.quantile(x => X.tCdf(x, n), p, -1000, 1000);
  X.fInv = (p, m, n) => X.quantile(x => X.fCdf(x, m, n), p, 0, 1e5);

  /* ---------------- SVG CƠ BẢN ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  X.el = function (tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  X.niceTicks = function (lo, hi, count = 6) {
    const span = hi - lo; if (span <= 0) return [lo];
    const raw = span / count; const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / mag; const step = (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
    const out = []; for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };

  /* Tạo một khung đồ thị theo bề rộng thực tế của phần tử chứa */
  X.chart = function (host, o) {
    host.innerHTML = "";
    host.classList.add("plot");
    const W = Math.max(o.minWidth || 280, host.clientWidth || 600);
    const H = o.height || 260;
    const m = Object.assign({ top: 16, right: 18, bottom: 40, left: 50 }, o.margin || {});
    const svg = X.el("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.aria || "đồ thị" }, host);
    const c = { host, svg, W, H, m, xmin: o.xmin, xmax: o.xmax, ymin: o.ymin ?? 0, ymax: o.ymax };
    c.x = v => m.left + (v - c.xmin) / (c.xmax - c.xmin) * (W - m.left - m.right);
    c.y = v => H - m.bottom - (v - c.ymin) / (c.ymax - c.ymin) * (H - m.top - m.bottom);
    c.xinv = px => c.xmin + (px - m.left) / (W - m.left - m.right) * (c.xmax - c.xmin);
    c.g = X.el("g", {}, svg);

    c.axes = function (opt = {}) {
      const ax = X.el("g", { class: "ax" }, svg);
      const xt = opt.xticks || X.niceTicks(c.xmin, c.xmax, opt.xcount || Math.max(3, Math.floor((W - m.left - m.right) / 70)));
      const yt = opt.yticks || X.niceTicks(c.ymin, c.ymax, opt.ycount || 4);
      if (!opt.nogrid) yt.forEach(v => X.el("line", { class: "gridline", x1: m.left, x2: W - m.right, y1: c.y(v), y2: c.y(v) }, ax));
      X.el("line", { x1: m.left, x2: W - m.right, y1: c.y(c.ymin), y2: c.y(c.ymin) }, ax);
      xt.forEach(v => {
        X.el("line", { x1: c.x(v), x2: c.x(v), y1: c.y(c.ymin), y2: c.y(c.ymin) + 5 }, ax);
        const t = X.el("text", { x: c.x(v), y: c.y(c.ymin) + 19, "text-anchor": "middle" }, ax);
        t.textContent = opt.xfmt ? opt.xfmt(v) : X.fmt(v, 4, true);
      });
      if (!opt.noy) yt.forEach(v => {
        const t = X.el("text", { x: m.left - 8, y: c.y(v) + 4, "text-anchor": "end" }, ax);
        t.textContent = opt.yfmt ? opt.yfmt(v) : X.fmt(v, 4, true);
      });
      if (opt.xlabel) { const t = X.el("text", { x: W - m.right, y: H - 4, "text-anchor": "end" }, ax); t.textContent = opt.xlabel; }
      if (opt.ylabel) { const t = X.el("text", { x: 4, y: m.top - 4, "text-anchor": "start" }, ax); t.textContent = opt.ylabel; }
      return ax;
    };
    c.curve = function (fn, a, b, attrs = {}, n = 300) {
      a = Math.max(a, c.xmin); b = Math.min(b, c.xmax);
      let d = "";
      for (let i = 0; i <= n; i++) {
        const xv = a + (b - a) * i / n; let yv = fn(xv);
        if (!isFinite(yv)) continue; yv = Math.min(yv, c.ymax * 1.6);
        d += (d ? "L" : "M") + c.x(xv).toFixed(2) + "," + c.y(yv).toFixed(2);
      }
      return X.el("path", Object.assign({ d, fill: "none", stroke: "var(--s1)", "stroke-width": 2.2, "stroke-linejoin": "round" }, attrs), c.g);
    };
    c.area = function (fn, a, b, attrs = {}, n = 200) {
      a = Math.max(a, c.xmin); b = Math.min(b, c.xmax); if (b <= a) return null;
      let d = `M${c.x(a)},${c.y(0)}`;
      for (let i = 0; i <= n; i++) { const xv = a + (b - a) * i / n; let yv = fn(xv); if (!isFinite(yv)) yv = c.ymax; yv = Math.min(yv, c.ymax * 1.6); d += `L${c.x(xv).toFixed(2)},${c.y(yv).toFixed(2)}`; }
      d += `L${c.x(b)},${c.y(0)}Z`;
      return X.el("path", Object.assign({ d, fill: "var(--s1)", "fill-opacity": .22, stroke: "none" }, attrs), c.g);
    };
    c.vline = function (xv, attrs = {}, y1, y2) {
      return X.el("line", Object.assign({ x1: c.x(xv), x2: c.x(xv), y1: c.y(y1 ?? c.ymin), y2: c.y(y2 ?? c.ymax), stroke: "var(--text-2)", "stroke-width": 1.2, "stroke-dasharray": "4 4" }, attrs), c.g);
    };
    c.hline = function (yv, attrs = {}) {
      return X.el("line", Object.assign({ x1: m.left, x2: W - m.right, y1: c.y(yv), y2: c.y(yv), stroke: "var(--text-2)", "stroke-width": 1.2, "stroke-dasharray": "4 4" }, attrs), c.g);
    };
    c.text = function (xv, yv, s, attrs = {}) {
      const t = X.el("text", Object.assign({ x: c.x(xv), y: c.y(yv), class: "svg-text", "text-anchor": "middle" }, attrs), c.g);
      t.textContent = s; return t;
    };
    c.dot = function (xv, yv, attrs = {}) {
      return X.el("circle", Object.assign({ cx: c.x(xv), cy: c.y(yv), r: 4.5, fill: "var(--s1)", stroke: "var(--surface)", "stroke-width": 2 }, attrs), c.g);
    };
    /* cột: data = [{x, y, fill, label}] */
    c.bars = function (data, opt = {}) {
      const step = data.length > 1 ? Math.abs(c.x(data[1].x) - c.x(data[0].x)) : 40;
      const bw = Math.max(2, Math.min(opt.maxW || 46, step * (opt.ratio || 0.72)));
      const rects = [];
      data.forEach(dt => {
        const x0 = c.x(dt.x) - bw / 2, y0 = c.y(Math.max(0, dt.y)), hh = Math.max(0, c.y(0) - y0);
        const r = Math.min(4, bw / 2, hh);
        const d = hh <= 0 ? "" : `M${x0},${c.y(0)}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${c.y(0)}Z`;
        rects.push(X.el("path", { d, fill: dt.fill || "var(--s1)", "data-x": dt.x }, c.g));
      });
      return rects;
    };
    /* lớp di chuột: fn(xValue) trả về chuỗi HTML hoặc null */
    c.hover = function (fn, opt = {}) {
      const tip = document.createElement("div"); tip.className = "tooltip"; host.appendChild(tip);
      const cross = X.el("line", { y1: m.top, y2: H - m.bottom, stroke: "var(--text-2)", "stroke-width": 1, opacity: 0 }, svg);
      const ov = X.el("rect", { x: m.left, y: m.top, width: W - m.left - m.right, height: H - m.top - m.bottom, fill: "transparent", style: "cursor:crosshair" }, svg);
      function move(ev) {
        const r = svg.getBoundingClientRect();
        const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
        let xv = c.xinv(px);
        if (opt.snap) xv = opt.snap(xv);
        const html = fn(xv);
        if (html == null) { tip.classList.remove("show"); cross.setAttribute("opacity", 0); return; }
        tip.innerHTML = html;
        const ty = opt.ty ? opt.ty(xv) : m.top + 30;
        tip.style.left = Math.min(W - 60, Math.max(60, c.x(xv))) + "px";
        tip.style.top = ty + "px";
        tip.classList.add("show");
        if (!opt.nocross) { cross.setAttribute("x1", c.x(xv)); cross.setAttribute("x2", c.x(xv)); cross.setAttribute("opacity", .5); }
      }
      ov.addEventListener("mousemove", move);
      ov.addEventListener("touchmove", e => { move(e); }, { passive: true });
      ov.addEventListener("mouseleave", () => { tip.classList.remove("show"); cross.setAttribute("opacity", 0); });
      return ov;
    };
    return c;
  };

  /* Vẽ lại khi đổi kích thước hoặc đổi giao diện */
  X.responsive = function (host, render) {
    let w = 0, t;
    const ro = new ResizeObserver(() => {
      const nw = host.clientWidth;
      if (Math.abs(nw - w) > 4) { w = nw; clearTimeout(t); t = setTimeout(render, 60); }
    });
    ro.observe(host);
    document.addEventListener("themechange", () => render());
    render();
  };

  /* Liên kết thanh trượt với ô hiển thị giá trị */
  X.bind = function (ids, onChange, fmtMap = {}) {
    const get = () => { const o = {}; ids.forEach(id => { const e = document.getElementById(id); o[id] = e.type === "range" || e.type === "number" ? parseFloat(e.value) : e.value; }); return o; };
    const upd = () => {
      ids.forEach(id => {
        const e = document.getElementById(id); const out = document.querySelector(`output[for="${id}"]`);
        if (out) out.textContent = fmtMap[id] ? fmtMap[id](parseFloat(e.value)) : X.fmt(parseFloat(e.value), 2, true);
      });
      onChange(get());
    };
    ids.forEach(id => document.getElementById(id).addEventListener("input", upd));
    upd();
    return { get, update: upd };
  };

  /* ---------------- CÂY XÁC SUẤT ----------------
     spec = { root: "TeX", rootLabel: "chữ", branches: [ {label:"TeX", p:"TeX", hl:bool,
              children:[{label:"TeX", p:"TeX", leaf:"TeX", hl:bool}] } ] }               */
  X.tree = function (host, spec) {
    host.innerHTML = "";
    host.classList.add("scroll-x");
    const W = Math.max(spec.minWidth || 600, host.clientWidth || 640);
    const leaves = [];
    spec.branches.forEach((b, i) => (b.children && b.children.length ? b.children : [null]).forEach((c, j) => leaves.push({ i, j })));
    const rowH = spec.rowH || 52, pad = 18;
    const H = leaves.length * rowH + pad * 2;
    const wrap = document.createElement("div");
    wrap.style.cssText = `position:relative;width:${W}px;height:${H}px;`;
    host.appendChild(wrap);
    const svg = X.el("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: "position:absolute;left:0;top:0" }, wrap);
    const x0 = 34, x1 = W * (spec.x1 || 0.34), x2 = W * (spec.x2 || 0.62);
    const y0 = H / 2;
    let leafIdx = 0;
    const lab = (x, y, html, cls = "", style = "") => {
      const d = document.createElement("div");
      d.className = "tree-lab " + cls;
      d.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);white-space:nowrap;${style}`;
      d.innerHTML = html; wrap.appendChild(d); return d;
    };
    const line = (xa, ya, xb, yb, hl) => X.el("path", {
      d: `M${xa},${ya} C${(xa + xb) / 2},${ya} ${(xa + xb) / 2},${yb} ${xb},${yb}`,
      fill: "none", stroke: hl ? "var(--s2)" : "var(--border-strong)", "stroke-width": hl ? 3 : 1.6
    }, svg);
    spec.branches.forEach((b, i) => {
      const kids = b.children && b.children.length ? b.children : [];
      const n = Math.max(1, kids.length);
      const yb = pad + (leafIdx + n / 2) * rowH;
      line(x0 + 14, y0, x1 - 18, yb, b.hl);
      lab(x0 + (x1 - x0) * 0.62, y0 + (yb - y0) * 0.85 - 13, X.tex(b.p), "tree-p", "font-size:13px;color:var(--text-2);background:var(--surface);padding:0 4px;border-radius:4px");
      lab(x1, yb, X.tex(b.label), "tree-node", `padding:3px 9px;border-radius:999px;border:1.5px solid ${b.hl ? "var(--s2)" : "var(--border-strong)"};background:var(--surface);font-weight:600`);
      kids.forEach((c, j) => {
        const yl = pad + (leafIdx + j + 0.5) * rowH;
        line(x1 + 22, yb, x2 - 18, yl, c.hl);
        lab(x1 + 22 + (x2 - x1 - 40) * 0.7, yb + (yl - yb) * 0.93 - 12, X.tex(c.p), "tree-p", "font-size:13px;color:var(--text-2);background:var(--surface);padding:0 4px;border-radius:4px");
        lab(x2, yl, X.tex(c.label), "tree-node", `padding:3px 9px;border-radius:999px;border:1.5px solid ${c.hl ? "var(--s2)" : "var(--border-strong)"};background:var(--surface);font-weight:600`);
        if (c.leaf) {
          const d = lab(x2 + 30, yl, X.tex(c.leaf), "tree-leaf", `transform:translate(0,-50%);font-size:14px;color:${c.hl ? "var(--s2)" : "var(--text-2)"};${c.hl ? "font-weight:700" : ""}`);
        }
      });
      leafIdx += n;
    });
    lab(x0, y0, spec.root ? X.tex(spec.root) : "●", "tree-root", "width:30px;height:30px;border-radius:50%;background:var(--text);color:var(--bg);display:grid;place-items:center;font-size:12px;font-weight:700");
  };

  /* ---------------- SƠ ĐỒ TƯ DUY ----------------
     data = { t: "chữ (có thể chứa $TeX$)", c: [ {t, c:[...]}, ... ] }                 */
  X.mindmap = function (host, data, opt = {}) {
    host.innerHTML = "";
    host.classList.add("mindmap");
    const colors = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s7)", "var(--s8)", "var(--s4)", "var(--s5)"];
    const colW = opt.colW || 230, gapY = opt.gapY || 10;
    const wrap = document.createElement("div");
    wrap.style.position = "relative";
    host.appendChild(wrap);
    const nodes = [];
    (function walk(n, depth, color) {
      n.depth = depth; n.color = color;
      const d = document.createElement("div");
      const isRoot = depth === 0;
      const leaf = !n.c || !n.c.length;
      d.style.cssText = `position:absolute;max-width:${isRoot ? 200 : leaf ? (opt.leafW || 280) : colW - 34}px;padding:${isRoot ? "10px 14px" : "5px 11px"};border-radius:${isRoot ? 14 : 10}px;` +
        `font-size:${isRoot ? 15 : depth === 1 ? 14 : 13.2}px;line-height:1.35;font-weight:${depth <= 1 ? 700 : 500};` +
        (isRoot ? "background:var(--text);color:var(--bg);" :
          depth === 1 ? `background:var(--surface);border:2px solid ${color};color:var(--text);` :
            `background:var(--surface-2);border:1px solid var(--border);color:var(--text-2);`);
      d.innerHTML = n.t;
      wrap.appendChild(d);
      if (window.renderMath) window.renderMath(d);
      n.div = d; nodes.push(n);
      (n.c || []).forEach((k, i) => walk(k, depth + 1, depth === 0 ? colors[i % colors.length] : color));
    })(data, 0, "var(--text)");
    let svg = null;
    function layout() {
      nodes.forEach(n => { n.w = n.div.offsetWidth; n.h = n.div.offsetHeight; });
      let cursor = 0;
      (function place(n) {
        n.x = n.depth === 0 ? 0 : 220 + (n.depth - 1) * colW;
        if (!n.c || !n.c.length) { n.y = cursor + n.h / 2; cursor += n.h + gapY; }
        else { n.c.forEach(place); n.y = (n.c[0].y + n.c[n.c.length - 1].y) / 2; if (n.depth === 1) cursor += 8; }
      })(data);
      const maxX = Math.max(...nodes.map(n => n.x + n.w)) + 10;
      const H = cursor;
      wrap.style.width = maxX + "px"; wrap.style.height = H + "px";
      if (svg) svg.remove();
      svg = X.el("svg", { width: maxX, height: H, style: "position:absolute;left:0;top:0;overflow:visible" });
      wrap.insertBefore(svg, wrap.firstChild);
      nodes.forEach(n => {
        n.div.style.left = n.x + "px"; n.div.style.top = (n.y - n.h / 2) + "px";
        (n.c || []).forEach(k => {
          const xa = n.x + n.w, xb = k.x, mx = (xa + xb) / 2;
          X.el("path", { d: `M${xa},${n.y} C${mx},${n.y} ${mx},${k.y} ${xb},${k.y}`, fill: "none", stroke: k.color, "stroke-width": k.depth === 1 ? 2.4 : 1.6, opacity: k.depth === 1 ? .9 : .6 }, svg);
        });
      });
    }
    layout();
    /* phông chữ tải xong thì chữ có thể dài/ngắn hơn → sắp xếp lại */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    setTimeout(layout, 800);
  };

  window.XS = X;
})();
