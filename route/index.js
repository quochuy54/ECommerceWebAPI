const express = require('express');
const route = express.Router();
const catelogyRoute = require('./catelogy');
const productRoute = require('./product');
const userRoute = require('./user');
const orderRoute = require('./order');

route.use('/catelogy', catelogyRoute);
route.use('/product', productRoute);
route.use('/user', userRoute);
route.use('/order', orderRoute);

module.exports = route;