-- Tạo database và user cho BK Food (có thể chạy bằng MySQL CLI: `mysql -u root -p < backend/sql/mysql-init.sql`)
CREATE DATABASE IF NOT EXISTS bk_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Đặt mật khẩu mạnh thay cho 'changeme' trước khi dùng thật
CREATE USER IF NOT EXISTS 'bk_food_user'@'%' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON bk_food.* TO 'bk_food_user'@'%';
FLUSH PRIVILEGES;
