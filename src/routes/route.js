const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const orderController = require('../controllers/orderController');

router.post('/customer', customerController.customerCreation);
router.post('/orders', orderController.orderCreation);

router.get('/getCustomer/:customerId', customerController.getCustomer);
router.get('/getOrder/:customerId', orderController.getOrder);

module.exports = router;