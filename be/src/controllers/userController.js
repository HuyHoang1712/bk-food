const UserModel = require('../models/userModel');

const formatUser = (user) => {
  let userData = {
    id: "u" + user.ID,
    name: user.FULL_NAME,
    email: user.EMAIL,
    role: user.ROLE.toLowerCase(),
    phone: user.PHONE,
    address: user.ADDRESS,
  };
  if (user.ROLE === 'SHIPPER') userData.vehicleType = user.VEHICLE_TYPE;
  if (user.ROLE === 'CUSTOMER') userData.points = user.POINTS;
  if (user.ROLE === 'RESTAURANT') {
    userData.description = user.DESCRIPTION;
    userData.restaurantId = String(user.ID);
  }
  return userData;
};

const userController = {
  getUsers: async (req, res) => {
    try {
      const usersRaw = await UserModel.getAllUsers();
      const usersFormatted = usersRaw.map(user => {
        return formatUser(user);
      });

      return res.status(200).json(usersFormatted);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getCustomers: async (req, res) => {
    try {
      const rawData = await UserModel.getUsersByRole('CUSTOMER');
      const data = rawData.map(formatUser); 
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getRestaurants: async (req, res) => {
    try {
      const rawData = await UserModel.getUsersByRole('RESTAURANT');
      const data = rawData.map(formatUser);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getShippers: async (req, res) => {
    try {
      const rawData = await UserModel.getUsersByRole('SHIPPER');
      const data = rawData.map(formatUser);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  countCustomers: async (req, res) => {
    try {
      const total = await UserModel.countCustomers();
      return res.status(200).json({ total_customers: total });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  },

  createNewUser: async (req, res) => {
    try {
      // 1. Lấy dữ liệu người dùng gửi lên
      const { name, email, password, phone, address, role } = req.body;

      // 2. Validate cơ bản (Kiểm tra xem có thiếu gì không)
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
      }

      // 3. Gọi Model để tạo
      const newUserId = await UserModel.createUser({
        name, email, password, phone, address, role
      });

      // 4. Trả về thành công
      return res.status(201).json({ 
        message: 'Tạo tài khoản thành công!', 
        userId: newUserId 
      });

    } catch (error) {
      // Xử lý lỗi trùng Email (Mã lỗi MySQL cho duplicate entry là 1062)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại!' });
      }
      return res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
  }


};

module.exports = userController;