const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const orderController = require('../controller/OrderController');

//Get All Order
route.get('/',  isAuthen, orderController.getAllOrder);

//Get An Order
route.get('/:id', isAuthen, orderController.getAnOrder);

//Add Order
route.post('/', isAuthen, orderController.addOrder);

// Update Order
route.put('/:id', isAuthen, orderController.updateOrder);

// Delete Order
route.delete('/:id', isAuthen, orderController.deleteOrder)

//Get quanlity of order
route.get('/get/quanlity-order', isAuthen, isAdmin, orderController.getQuanlityOrder);

// Get SumPrice all Order (Admin)
route.get('/get/sum-sale', isAuthen, isAdmin, orderController.getSumPriceAllOrder);

// Get orders of an user (for user can see their orders)
route.get('/get/user-order/:userid', isAuthen, orderController.getOrdersOfAnUser);

module.exports = route
