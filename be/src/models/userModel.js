const db = require('../config/database');

const UserModel = {
  // Hàm lấy tất cả user kèm thông tin chi tiết
  getAllUsers: async () => {
    try {
      const query = `
        SELECT 
          u.ID, u.FULL_NAME, u.EMAIL, u.ROLE, u.PHONE, u.ADDRESS,
          c.POINTS,                  -- Lấy điểm nếu là Customer
          s.VEHICLE_TYPE,            -- Lấy loại xe nếu là Shipper
          r.DESCRIPTION, r.IMAGE     -- Lấy mô tả nếu là Restaurant
        FROM USERS u
        LEFT JOIN CUSTOMERS c ON u.ID = c.USER_ID
        LEFT JOIN SHIPPERS s ON u.ID = s.USER_ID
        LEFT JOIN RESTAURANTS r ON u.ID = r.USER_ID
        ORDER BY u.ID ASC
      `;
      
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getUsersByRole: async (role) => {
    try {
      // Câu query giống hệt getAllUsers nhưng thêm WHERE
      const query = `
        SELECT 
          u.ID, u.FULL_NAME, u.EMAIL, u.ROLE, u.PHONE, u.ADDRESS,
          c.POINTS,
          s.VEHICLE_TYPE,
          r.DESCRIPTION, r.IMAGE
        FROM USERS u
        LEFT JOIN CUSTOMERS c ON u.ID = c.USER_ID
        LEFT JOIN SHIPPERS s ON u.ID = s.USER_ID
        LEFT JOIN RESTAURANTS r ON u.ID = r.USER_ID
        WHERE u.ROLE = ?  -- Chỗ này để lọc
      `;
      const [rows] = await db.query(query, [role]); // Truyền role vào dấu ?
      return rows;
    } catch (error) { throw error; }
  },

  // 2. Hàm đếm số lượng Customer
  countCustomers: async () => {
    try {
      const query = "SELECT COUNT(*) as total FROM USERS WHERE ROLE = 'CUSTOMER'";
      const [rows] = await db.query(query);
      return rows[0].total;
    } catch (error) { throw error; }
  },

  createUser: async (newUser) => {
    try {
      // 1. Thêm vào bảng USERS trước
      const queryUser = `
        INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD, ROLE, PHONE, ADDRESS) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(queryUser, [
        newUser.name, 
        newUser.email, 
        newUser.password, 
        newUser.role, // Ví dụ: 'CUSTOMER'
        newUser.phone,
        newUser.address
      ]);

      const newId = result.insertId; // Lấy ID vừa tạo

      // 2. Nếu là CUSTOMER thì thêm vào bảng CUSTOMERS
      if (newUser.role === 'CUSTOMER') {
        await db.query("INSERT INTO CUSTOMERS (USER_ID, POINTS) VALUES (?, 0)", [newId]);
      }

      // (Sau này nếu muốn thêm logic cho Restaurant/Shipper thì if/else ở đây)

      return newId; // Trả về ID người dùng mới
    } catch (error) {
      throw error;
    }
  }


};

module.exports = UserModel;