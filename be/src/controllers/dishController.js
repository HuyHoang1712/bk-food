const DishModel = require('../models/dishModel');

// Hàm phụ trợ: Format dữ liệu cho giống Mock Data
const formatDish = (dish) => {
  return {
    id: "m" + dish.ID, // Biến ID số thành chuỗi "m1"
    restaurantId: String(dish.RESTAURANT_ID),
    name: dish.NAME,
    price: dish.PRICE,
    description: dish.DESCRIPTION,
    image: dish.IMAGE,
    category: dish.CATEGORY_ID, // Hoặc query thêm tên category nếu cần
    available: dish.IS_AVAILABLE === 1 // Chuyển 1/0 thành true/false
  };
};

const dishController = {
  // 1. API: Lấy tất cả món
  getAllDishes: async (req, res) => {
    try {
      const rawData = await DishModel.getAllDishes();
      const data = rawData.map(formatDish);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // 2. API: Lấy menu của một quán cụ thể
  getMenuByRestaurant: async (req, res) => {
    try {
      const { restaurantId } = req.params; // Lấy ID từ URL
      const rawData = await DishModel.getDishesByRestaurantId(restaurantId);
      const data = rawData.map(formatDish);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // 3. API: Tạo món mới
  createDish: async (req, res) => {
    try {
      const { restaurantId, categoryId, name, price, image, description } = req.body;

      if (!restaurantId || !name || !price) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
      }

      const newId = await DishModel.createDish({
        restaurantId, categoryId, name, price, image, description
      });

      return res.status(201).json({ message: 'Thêm món thành công!', dishId: newId });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
  }
};

module.exports = dishController;