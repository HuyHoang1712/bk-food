const db = require('../config/database');

const DishModel = {
  // 1. Lấy tất cả món ăn (kèm tên quán)
  getAllDishes: async () => {
    try {
      const query = `
        SELECT d.*, r.IMAGE as RESTAURANT_IMAGE, u.FULL_NAME as RESTAURANT_NAME
        FROM DISHES d
        JOIN RESTAURANTS r ON d.RESTAURANT_ID = r.USER_ID
        JOIN USERS u ON r.USER_ID = u.ID
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) { throw error; }
  },

  // 2. Lấy món ăn theo ID nhà hàng (Quan trọng cho trang chi tiết quán)
  getDishesByRestaurantId: async (restaurantId) => {
    try {
      const query = "SELECT * FROM DISHES WHERE RESTAURANT_ID = ?";
      const [rows] = await db.query(query, [restaurantId]);
      return rows;
    } catch (error) { throw error; }
  },

  // 3. Tạo món ăn mới
  createDish: async (dish) => {
    try {
      const query = `
        INSERT INTO DISHES (RESTAURANT_ID, CATEGORY_ID, NAME, PRICE, IMAGE, DESCRIPTION, IS_AVAILABLE)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [
        dish.restaurantId,
        dish.categoryId, // Có thể để null nếu chưa có category
        dish.name,
        dish.price,
        dish.image,
        dish.description,
        dish.isAvailable || true
      ]);
      return result.insertId;
    } catch (error) { throw error; }
  }
};

module.exports = DishModel;