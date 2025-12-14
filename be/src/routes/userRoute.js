const express = require('express');
const router = express.Router(); // Tạo một cái biển chỉ dẫn (Router)
const userController = require('../controllers/userController');


router.get('/users', userController.getUsers);

router.get('/users/customers', userController.getCustomers);
router.get('/users/restaurants', userController.getRestaurants);
router.get('/users/shippers', userController.getShippers);

router.get('/users/count-customers', userController.countCustomers);
router.post('/users', userController.createNewUser);


module.exports = router;