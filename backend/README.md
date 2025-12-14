# BK Food API (Spring Boot + MySQL)

API Spring Boot dùng MySQL để phục vụ đăng nhập email/password hoặc Google OAuth2 cho ứng dụng BK Food.

## Chạy nhanh

```bash
# Tạo DB + user MySQL (điều chỉnh mật khẩu phù hợp)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bk_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" \
  -e "CREATE USER IF NOT EXISTS 'bk_food_user'@'%' IDENTIFIED BY 'your_strong_password';" \
  -e "GRANT ALL PRIVILEGES ON bk_food.* TO 'bk_food_user'@'%'; FLUSH PRIVILEGES;"

# Cấu hình biến môi trường
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bk_food?useSSL=false&serverTimezone=UTC
export SPRING_DATASOURCE_USERNAME=bk_food_user
export SPRING_DATASOURCE_PASSWORD=your_strong_password
export SECURITY_JWT_SECRET=<base64-encoded-256bit-secret>
export GOOGLE_CLIENT_ID=<google-oauth-client-id>

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
