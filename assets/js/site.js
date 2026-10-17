/* ==========================================================
   site.js — phần dùng chung cho mọi trang
   - Danh sách bài học (thêm bài mới: thêm 1 dòng vào LESSONS)
   - Đổi giao diện sáng/tối, mục lục tự động, thanh tiến độ
   - Gọi KaTeX để hiển thị công thức
   ========================================================== */

/* Muốn thêm Bài 3, Bài 4…: tạo file bai-3.html (copy từ bai-2.html),
   rồi thêm một dòng vào mảng này. Trang chủ và nút chuyển bài tự cập nhật. */
const LESSONS = [
  {
    id: "bai-1", href: "bai-1.html", no: "Bài 1", title: "Xác suất",
    desc: "Xác suất có điều kiện, công thức nhân – cộng, xác suất toàn phần, Bayes, độ nhạy – độ đặc hiệu – giá trị tiên đoán, công thức Bernoulli.",
    chips: ["De Morgan", "Bayes", "Xét nghiệm", "Bernoulli"]
  },
  {
    id: "bai-2", href: "bai-2.html", no: "Bài 2", title: "Phân phối xác suất của biến ngẫu nhiên",
    desc: "Biến ngẫu nhiên rời rạc – liên tục, tích phân từ con số 0, kỳ vọng – phương sai, nhị thức, chuẩn, chuẩn tắc, χ², Student, Fisher, cách tra bảng.",
    chips: ["Tích phân", "E(X), D(X)", "Phân phối chuẩn", "Tra bảng"]
  }
];

/* Trang phụ (không phải bài học): hiện ở thanh điều hướng, sau các bài. */
const EXTRA_PAGES = [
  { id: "phu-luc", href: "phu-luc.html", no: "Bảng phụ lục" }
];

/* Các bài sắp học (hiện mờ trên trang chủ). Khi làm xong bài nào thì chuyển nó lên LESSONS. */
const COMING = [
  { no: "Bài 3", title: "Giới thiệu thống kê – Thu thập, trình bày dữ liệu – Phân bố của các tham số trên mẫu" },
  { no: "Bài 4", title: "Ước lượng tham số tổng thể" },
  { no: "Bài 5", title: "Kiểm định giả thuyết thống kê" },
  { no: "Bài 6", title: "Phép kiểm phi tham số" },
  { no: "Bài 7", title: "Phân tích phương sai" },
  { no: "Bài 8", title: "Hồi quy và tương quan" }
];

(function () {
  const root = document.documentElement;

  /* ---------- giao diện sáng / tối ---------- */
  function currentTheme() {
    const t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("xstk-theme", t); } catch (e) { /* bỏ qua */ }
    const b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
    document.dispatchEvent(new CustomEvent("themechange"));
  }

  /* ---------- tạo slug cho tiêu đề ---------- */
  function slug(s) {
    return s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function buildTopnav() {
    const nav = document.getElementById("topnav");
    if (!nav) return;
    const cur = document.body.dataset.lesson;
    nav.innerHTML = [...LESSONS, ...EXTRA_PAGES].map(l =>
      `<a href="${l.href}" class="${l.id === cur ? "active" : ""}">${l.no}</a>`).join("");
  }

  function buildPager() {
    const el = document.getElementById("pager");
    if (!el) return;
    const cur = document.body.dataset.lesson;
    const i = LESSONS.findIndex(l => l.id === cur);
    if (i < 0) return;
    const prev = LESSONS[i - 1], next = LESSONS[i + 1];
    let h = "";
    h += prev
      ? `<a class="prev" href="${prev.href}"><div class="dir">← Bài trước</div><div class="ttl">${prev.no}. ${prev.title}</div></a>`
      : `<a class="prev" href="index.html"><div class="dir">← Về</div><div class="ttl">Trang chủ</div></a>`;
    if (next) h += `<a class="next" href="${next.href}"><div class="dir">Bài tiếp →</div><div class="ttl">${next.no}. ${next.title}</div></a>`;
    el.innerHTML = h;
  }

  function buildHome() {
    const el = document.getElementById("lessonList");
    if (!el) return;
    let h = LESSONS.map(l => `
      <a class="lesson-card" href="${l.href}">
        <span class="go">→</span>
        <span class="no">${l.no}</span>
        <h3>${l.title}</h3>
        <p>${l.desc}</p>
        <div class="chips">${(l.chips || []).map(c => `<span class="chip">${c}</span>`).join("")}</div>
      </a>`).join("");
    h += COMING.map(c => `
      <div class="lesson-card soon" aria-disabled="true">
        <span class="no">${c.no} · sắp có</span>
        <h3>${c.title}</h3>
      </div>`).join("");
    el.innerHTML = h;
  }

  /* ---------- mục lục tự động ---------- */
  function buildToc() {
    const toc = document.getElementById("tocList");
    const content = document.querySelector(".content");
    if (!toc || !content) return [];
    const heads = [...content.querySelectorAll("h2, h3")].filter(h => !h.closest(".ex, .box, .widget, details"));
    const used = new Set();
    toc.innerHTML = heads.map(h => {
      if (!h.id) {
        let s = slug(h.textContent) || "muc";
        while (used.has(s)) s += "-x";
        h.id = s;
      }
      used.add(h.id);
      const label = h.dataset.toc || h.textContent.trim();
      return `<li class="${h.tagName === "H3" ? "lv3" : "lv2"}"><a href="#${h.id}">${label}</a></li>`;
    }).join("");
    toc.addEventListener("click", e => {
      if (e.target.closest("a")) document.body.classList.remove("toc-open");
    });
    return heads;
  }

  function scrollSpy(heads) {
    const links = new Map();
    document.querySelectorAll("#tocList a").forEach(a => links.set(a.getAttribute("href").slice(1), a));
    const bar = document.getElementById("progress");
    let ticking = false;
    function update() {
      ticking = false;
      const y = window.scrollY + 120;
      let cur = null;
      for (const h of heads) { if (h.offsetTop <= y) cur = h; else break; }
      links.forEach(a => a.classList.remove("active"));
      if (cur && links.get(cur.id)) {
        const a = links.get(cur.id);
        a.classList.add("active");
      }
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
      }
    }
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- KaTeX ---------- */
  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el || document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        ignoredClasses: ["no-math"],
        throwOnError: false
      });
    }
  }
  window.renderMath = renderMath;

  document.addEventListener("DOMContentLoaded", () => {
    const b = document.getElementById("themeBtn");
    if (b) {
      b.textContent = currentTheme() === "dark" ? "☀" : "☾";
      b.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
    }
    const tb = document.getElementById("tocBtn");
    if (tb) tb.addEventListener("click", () => document.body.classList.toggle("toc-open"));

    buildTopnav();
    buildPager();
    buildHome();
    const heads = buildToc();          /* lấy chữ tiêu đề trước khi KaTeX đổi công thức */
    renderMath(document.body);
    if (heads.length) scrollSpy(heads);
    document.dispatchEvent(new CustomEvent("siteready"));

    /* In ra giấy: mở hết lời giải */
    window.addEventListener("beforeprint", () => document.querySelectorAll("details").forEach(d => d.setAttribute("open", "")));
  });
})();
