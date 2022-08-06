const express = require('express');
const route = express.Router();
const Order = require('../model/order');
const OrderItem = require('../model/orderItem');

//Get All Order
route.get('/',  async (req, res) => {
    const sort = {};
    const query = [];

    query.sortType = req.query.sortType;
    query.sortField = req.query.sortField;
    if(query.sortField) {sort[query.sortField] = query.sortType};
    try{
        const orderList = await Order.find()
        .sort(sort)
        .populate("user", "name")
        .populate({
            path: 'orderItems', populate: {
                path: "product", populate: "catelogy"} 
                });
        res.status(200).json(orderList);
    }catch(e) {
        res.status(500).json(e);
    }
})

//Get An Order
route.get('/:id',  async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        res.status(200).json(order);
    }catch(e) {
        res.status(500).json(e);
    }
})

//Add Order
route.post('/',  async (req, res) => {
    try{
        const orderItems = Promise.all(
            req.body.orderItems.map( async orderItem => {
            const newOrderItem = new OrderItem({
                quantily: orderItem.quantily,
                product: orderItem.product
            });
            await newOrderItem.save();
            return newOrderItem._id;
        }));
        orderItemsResult = await orderItems;
        const order = new Order({
            orderItems: orderItemsResult,
    
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
            dateOrder: req.body.dateOrder
        });
        const neworder = await order.save();
        res.status(200).json(neworder);
    }catch(e) {
        res.status(500).json(e);
    }
})

module.exports = route
