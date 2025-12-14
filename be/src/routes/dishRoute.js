const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// GET: Lấy tất cả món
router.get('/dishes', dishController.getAllDishes);

// GET: Lấy món theo ID quán (Ví dụ: /dishes/restaurant/2)
router.get('/dishes/restaurant/:restaurantId', dishController.getMenuByRestaurant);

// POST: Tạo món mới
router.post('/dishes', dishController.createDish);

module.exports = router;