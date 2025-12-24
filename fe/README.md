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

## Thiết lập môi trường & API (Supabase hoặc MySQL)

### Biến môi trường cho Next.js
Tạo file `.env.local` trong thư mục `fe/` và thêm các biến sau tuỳ theo cách bạn xác thực:

- **Dùng Supabase (mặc định của màn hình đăng nhập):**
  - `NEXT_PUBLIC_SUPABASE_URL` = URL dự án Supabase.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key của dự án Supabase.
- **Dùng Spring Boot + MySQL (không qua Supabase):**
  - `NEXT_PUBLIC_API_BASE_URL` = base URL backend (ví dụ: `http://localhost:8080`). Front-end sẽ gọi các API bảo vệ đến đây.

### Biến môi trường cho Spring Boot (MySQL)
Thêm vào `application.properties` hoặc `.env` của backend:

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bk_food?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=bk_food_user
SPRING_DATASOURCE_PASSWORD=your_strong_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
```

Bạn có thể tạo database và user nhanh bằng MySQL CLI:

```
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bk_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" \
  -e "CREATE USER IF NOT EXISTS 'bk_food_user'@'%' IDENTIFIED BY 'your_strong_password';" \
  -e "GRANT ALL PRIVILEGES ON bk_food.* TO 'bk_food_user'@'%'; FLUSH PRIVILEGES;"
```

Nếu tự triển khai Google OAuth tại backend, khai báo thêm (ví dụ):

```
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT-ID=... 
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT-SECRET=...
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_REDIRECT-URI={baseUrl}/api/auth/google/callback
```

### Gợi ý luồng API khi dùng MySQL
1. **Đăng nhập email/password**: Front-end gửi `POST ${NEXT_PUBLIC_API_BASE_URL}/api/auth/login` với body `{ "email": "...", "password": "..." }`; backend trả JWT/Session và cookie (HttpOnly) để dùng cho các API tiếp theo.
2. **Đăng nhập Google**: Front-end mở `${NEXT_PUBLIC_API_BASE_URL}/api/auth/oauth2/authorize/google?redirect_uri=<URL_FRONT>`; backend xử lý Google OAuth2, tạo user (provider=google) và redirect về `redirect_uri?token=<JWT>`.
3. **Hoặc gửi Google ID token**: nếu front-end lấy được `idToken` từ Google Identity, gọi `POST /api/auth/google` với `{ "idToken": "..." }`.
4. **Gọi API bảo vệ**: thêm header `Authorization: Bearer <jwt>`; ví dụ lấy hồ sơ user `GET ${NEXT_PUBLIC_API_BASE_URL}/api/users/me`.
5. **Đồng bộ UI đăng nhập**: nếu không dùng Supabase, màn hình login đã tự động chuyển sang gọi API Spring Boot khi `NEXT_PUBLIC_API_BASE_URL` có giá trị.

### Chạy backend Spring Boot

```
cd backend
mvn spring-boot:run
```

Đảm bảo đã cấu hình biến môi trường ở trên và đã tạo database MySQL trước khi chạy.

