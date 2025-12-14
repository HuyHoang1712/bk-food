# Student food delivery
# BK Food

## Overview
Ứng dụng web mô phỏng nền tảng giao đồ ăn cho sinh viên Bách Khoa

## Tính năng chính
- **Khách hàng**: tìm kiếm và lọc nhà hàng, xem menu chi tiết, thêm món vào giỏ, đặt đơn và xem lịch sử đơn hàng.
- **Nhà hàng**: xem thống kê nhanh, quản lý thực đơn hiển thị, theo dõi trạng thái đơn và cập nhật tiến độ chuẩn bị/giao hàng.
- **Đơn vị vận chuyển**: xem danh sách đơn được giao, trạng thái/ETA và lộ trình dự kiến từng chặng.

## Deployment
## Công nghệ
- **Next.js 16** với thư mục `app/` và React Server Components.
- **Tailwind CSS 4** (kèm `tailwindcss-animate`) cho giao diện.

## Cấu trúc thư mục nổi bật
- `app/`: các trang chủ, khách hàng (`customer`), nhà hàng (`restaurant`), đơn vị giao hàng (`delivery`).
- `components/` & `components/ui/`: thành phần giao diện tái sử dụng.
- `lib/`: dữ liệu giả lập, store Zustand và helpers (`utils/format.ts`...).
- `public/`: hình ảnh mẫu minh họa nhà hàng/món ăn.
- `styles/` và `app/globals.css`: cấu hình Tailwind và style global.

## Build your app
## Yêu cầu môi trường
- Node.js **>= 18**.
- NPM đã được cài sẵn 

## Hướng dẫn chạy nhanh
1. Cài phụ thuộc (các thư viện ): `npm install`
2. Chạy môi trường phát triển: `npm run dev` và truy cập localhost
.

