# AI Vibe Coding & Automation Master Class 2026

Landing page tối giản được xây dựng với triết lý **Vibe Coding** - Sử dụng AI để tạo ra sản phẩm nhanh chóng, hiệu quả và thẩm mỹ cao mà không cần build step phức tạp.

## 🚀 Hướng dẫn Deploy lên Vercel

Dự án này là một **Static Site** (HTML/CSS/JS thuần), việc deploy cực kỳ đơn giản:

1.  **Push code** lên GitHub repository của bạn.
2.  Truy cập [Vercel](https://vercel.com) và nhấn **Add New Project**.
3.  **Import** repository này.
4.  Tại phần **Framework Preset**, chọn: `Other`.
5.  Để trống phần `Build Command` và `Output Directory`.
6.  Nhấn **Deploy**.

## 🛠️ Cấu trúc kỹ thuật
- **index.html**: File duy nhất chứa toàn bộ Logic, Style và Markup.
- **Tailwind CSS**: Sử dụng qua CDN để tối ưu tốc độ phát triển.
- **Google Apps Script**: Xử lý lưu trữ data và kiểm tra trạng thái thanh toán (Backendless).
- **Sepay API**: Tạo mã QR thanh toán tự động theo thời gian thực.

## 📝 Lưu ý quan trọng
- Hệ thống tự động kiểm tra thanh toán (Polling) mỗi 10 giây một lần sau khi người dùng điền form.
- Dữ liệu được đẩy trực tiếp về Google Sheet thông qua App Script URL cấu hình sẵn.

---
*Designed for the Bold - Nguyễn Phước Vĩnh Hưng*