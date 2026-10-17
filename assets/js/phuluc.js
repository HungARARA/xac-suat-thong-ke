/* ==========================================================
   phuluc.js — dựng các bảng phụ lục, mỗi bảng hai bản:
   bản theo giáo trình (ô in sai tô đỏ) và bản đã sửa (ô sửa tô xanh + ghi chú)
   Mỗi <div data-pl="…"> trong phu-luc.html nhận một cặp bảng;
   dữ liệu lấy từ phuluc-data.js (window.PHU_LUC).
   ========================================================== */
(function () {
  const DATA = {};
  (window.PHU_LUC || []).forEach(t => { DATA[t.id] = t; });
  const num = s => parseFloat(s.replace(",", "."));

  /* tên ô dùng trong ghi chú */
  function cellName(t, r, c) {
    if (t.kind === "z") return `α = ${t.pairs[r][0]}`;
    const R = t.rows[r], C = t.cols[c];
    if (t.kind === "l" || t.kind === "phi") {
      const x = (num(R) + num(C)).toFixed(2).replace(".", ",");
      return (t.kind === "l" ? "l(" : "φ(") + x + ")";
    }
    if (t.kind === "f") return `m = ${C}, n = ${R}`;
    return `n = ${R}, α = ${C}`;
  }

  /* đánh số ghi chú theo thứ tự trên bảng; các ô cùng nhóm dùng chung một số */
  function collectFixes(t) {
    const map = new Map(), notes = [], groupNo = {};
    t.fix.forEach(f => {
      const isZ = t.kind === "z";
      const r = f[0], c = isZ ? 0 : f[1], v = isZ ? f[1] : f[2], extra = isZ ? undefined : f[3];
      const printed = isZ ? t.pairs[r][1] : t.cells[r][c];
      let no;
      if (typeof extra === "number") {
        if (!groupNo[extra]) { notes.push(t.groups[extra]); groupNo[extra] = notes.length; }
        no = groupNo[extra];
      } else {
        notes.push(`${cellName(t, r, c)}: giáo trình in <b>${printed}</b> → đúng <b>${v}</b>.` + (extra ? " " + extra : ""));
        no = notes.length;
      }
      map.set(isZ ? String(r) : r + "," + c, { v, no });
    });
    return { map, notes };
  }

  function cell(s, f, fixed) {
    if (!f) return `<td>${s}</td>`;
    return fixed
      ? `<td class="pl-fix" title="Giáo trình in: ${s}">${f.v}<sup>${f.no}</sup></td>`
      : `<td class="pl-bad" title="In sai — giá trị đúng: ${f.v}">${s}<sup>${f.no}</sup></td>`;
  }

  function gridTable(t, fx, fixed) {
    const head = `<tr><th>${t.corner}</th>${t.cols.map(c => `<th>${c}</th>`).join("")}</tr>`;
    const body = t.rows.map((R, r) =>
      `<tr><th scope="row">${R}</th>${t.cells[r].map((s, c) => cell(s, fx.get(r + "," + c), fixed)).join("")}</tr>`).join("");
    return `<table class="compact pl"><thead>${head}</thead><tbody>${body}</tbody><tfoot>${head}</tfoot></table>`;
  }

  /* bảng z in thành 4 cặp cột (α | z_α) như trong sách */
  function zTable(t, fx, fixed) {
    const per = Math.ceil(t.pairs.length / 4);
    const head = `<tr>${"<th>α</th><th>z<sub>α</sub></th>".repeat(4)}</tr>`;
    let body = "";
    for (let i = 0; i < per; i++) {
      body += "<tr>";
      for (let g = 0; g < 4; g++) {
        const k = g * per + i, p = t.pairs[k];
        body += p ? `<th scope="row">${p[0]}</th>${cell(p[1], fx.get(String(k)), fixed)}` : "<td></td><td></td>";
      }
      body += "</tr>";
    }
    return `<table class="compact pl"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  }

  function render(host) {
    const t = DATA[host.dataset.pl];
    if (!t) return;
    const { map, notes } = collectFixes(t);
    const table = fixed => `<div class="table-wrap">${(t.kind === "z" ? zTable : gridTable)(t, map, fixed)}</div>`;
    host.innerHTML = `
      <div class="pl-ver pl-book">
        <p class="pl-cap"><span class="pl-tag book">① Theo giáo trình</span><span class="small muted">chép nguyên văn từng ô; ô đỏ là ô in sai</span></p>
        ${table(false)}
      </div>
      <div class="pl-ver pl-fixed">
        <p class="pl-cap"><span class="pl-tag fixed">② Đã sửa lỗi in</span><span class="small muted">ô xanh là ô đã sửa; số nhỏ ứng với ghi chú bên dưới</span></p>
        ${table(true)}
        ${notes.length ? `<div class="pl-notes"><b>Ghi chú sửa (${t.fix.length} ô)</b><ol>${notes.map(n => `<li>${n}</li>`).join("")}</ol></div>`
                       : `<p class="small muted">Không có ô in sai.</p>`}
      </div>`;
  }

  /* chọn xem cả hai bản hay chỉ một bản (nhớ lựa chọn trên máy này) */
  function bindView() {
    const seg = document.getElementById("plView");
    if (!seg) return;
    const set = v => {
      document.body.dataset.plView = v;
      [...seg.children].forEach(b => b.classList.toggle("on", b.dataset.v === v));
      try { localStorage.setItem("xstk-pl-view", v); } catch (e) { /* bỏ qua */ }
    };
    seg.addEventListener("click", e => { const b = e.target.closest("button"); if (b) set(b.dataset.v); });
    let v = "both";
    try { v = localStorage.getItem("xstk-pl-view") || "both"; } catch (e) { /* bỏ qua */ }
    set(v);
  }

  /* chạy ngay (script defer): bảng có sẵn trước khi site.js dựng mục lục và nhảy tới #neo */
  document.querySelectorAll("[data-pl]").forEach(render);
  bindView();
})();
