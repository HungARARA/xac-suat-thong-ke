# Xác suất – Thống kê Y học · tài liệu tự học

Trang web tự học theo giáo trình *Xác suất – Thống kê Y học*: mỗi bài được giảng lại từ đầu, có hình vẽ tương tác, ví dụ mới giải từng bước và bài tập chia 3 mức (thông hiểu → vận dụng → vận dụng cao).

- `index.html` — trang chủ, liệt kê các bài.
- `bai-1.html` — Bài 1. Xác suất (De Morgan, có điều kiện, nhân, cộng, toàn phần, Bayes, xét nghiệm, Bernoulli).
- `bai-2.html` — Bài 2. Phân phối xác suất của biến ngẫu nhiên (tích phân từ con số 0, mật độ, hàm phân phối, kỳ vọng, phương sai, nhị thức, chuẩn, chuẩn tắc, χ², Student, Fisher, tra bảng).

## Xem trên máy

Mở `index.html` bằng trình duyệt (cần mạng để tải phông chữ và KaTeX hiển thị công thức). Hoặc chạy một máy chủ tĩnh trong thư mục này:

```bash
py -m http.server 8765
```

rồi vào `http://localhost:8765`.

## Thêm bài mới (Bài 3, Bài 4, …)

1. Sao chép `bai-2.html` thành `bai-3.html`, sửa `<title>`, `data-lesson="bai-3"` ở thẻ `<body>`, phần tiêu đề và nội dung.
2. Nếu bài có phần tương tác riêng, tạo `assets/js/bai3.js` và đổi dòng `<script defer src="assets/js/bai2.js">` thành `bai3.js`.
3. Trong `assets/js/site.js`, chuyển bài đó từ mảng `COMING` sang mảng `LESSONS` (điền `id`, `href`, `no`, `title`, `desc`, `chips`). Trang chủ, thanh điều hướng và nút “Bài trước / Bài tiếp” tự cập nhật.

## Cấu trúc

```
assets/css/style.css   giao diện chung (sáng / tối, điện thoại)
assets/js/site.js      danh sách bài, mục lục tự động, KaTeX, đổi giao diện
assets/js/plot.js      hàm toán (chuẩn, nhị thức, χ², Student, Fisher) + vẽ biểu đồ SVG, cây xác suất, sơ đồ tư duy
assets/js/bai1.js      phần tương tác của Bài 1
assets/js/bai2.js      phần tương tác của Bài 2
```
