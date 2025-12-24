# BK Food API (Spring Boot + MySQL)

API Spring Boot dùng MySQL để phục vụ đăng nhập email/password hoặc Google OAuth2 cho ứng dụng BK Food.

> **Cơ sở dữ liệu nằm ở đâu?**
> File khởi tạo MySQL được đặt tại `backend/sql/mysql-init.sql`. Chạy lệnh `mysql -u root -p < backend/sql/mysql-init.sql` để tạo database `bk_food` và user `bk_food_user` nhanh chóng (đừng quên đổi mật khẩu trong file trước khi dùng thật).

## Chạy nhanh

```bash
# 1) Tạo DB + user MySQL từ script có sẵn (điều chỉnh mật khẩu trong file trước):
mysql -u root -p < backend/sql/mysql-init.sql

# 2) Đặt biến môi trường
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bk_food?useSSL=false&serverTimezone=UTC
export SPRING_DATASOURCE_USERNAME=bk_food_user
export SPRING_DATASOURCE_PASSWORD=<mat_khau_ban_da_doi>
export SECURITY_JWT_SECRET=<base64-encoded-256bit-secret>
export GOOGLE_CLIENT_ID=<google-oauth-client-id>

# 3) Chạy backend
cd backend
mvn spring-boot:run
```

## API chính
- `POST /api/auth/register` – body `{ email, password, fullName, role }`.
- `POST /api/auth/login` – body `{ email, password }` trả về JWT.
- `POST /api/auth/google` – body `{ idToken }` nếu front-end thu được Google ID token (Google Identity).
- `GET /api/auth/oauth2/authorize/google?redirect_uri=<...>` – luồng redirect Google OAuth2; backend tạo user và redirect về `redirect_uri?token=<JWT>`.
- `GET /api/users/me` – yêu cầu header `Authorization: Bearer <token>`.

## Cấu hình bổ sung
- Điều chỉnh `application.properties` để mở rộng CORS hoặc TTL JWT (`security.jwt.expiration-minutes`).
- Thay đổi `app.oauth2.redirect-uri` nếu muốn redirect mặc định khác khi thiếu tham số `redirect_uri`.
