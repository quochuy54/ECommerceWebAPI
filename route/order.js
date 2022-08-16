const express = require('express');
const route = express.Router();
const Order = require('../model/order');
const OrderItem = require('../model/orderItem');
const mongoose = require('mongoose');
const {isAuthen, isAdmin} = require('../auth/isAuth');

//Get All Order
route.get('/',  isAuthen, async (req, res) => {
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
route.get('/:id', isAuthen, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(!order) { return res.status(404).json('Not found order')};
        res.status(200).json(order);
    }catch(e) {
        res.status(500).json(e);
    }
})

//Add Order
route.post('/', isAuthen, async (req, res) => {
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

        const totalPriceArray = await Promise.all(orderItemsResult.map( async orderItemId => {
            let orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            let price = orderItem.quantily*orderItem.product.price;
            return price;
        })); 

        // Sum prices in totalPriceArray
        const totalPrice = totalPriceArray.reduce(
                (total, currentValue) => { return total + currentValue}
            , 0)

        const order = new Order({
            orderItems: orderItemsResult,
    
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
            dateOrder: req.body.dateOrder
        });
        const neworder = await order.save();
        res.status(200).json(neworder);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Update Order
route.put('/:id', isAuthen, async (req, res) => {
    try{
        const orderUpdate = await Order.findByIdAndUpdate(req.params.id, {
            $set: {status: req.body.status}
        }, {new: true});
        res.status(200).json(orderUpdate);
    }catch(e) {
        res.status(500).json(e);
    }
})

// Delete Order
route.delete('/:id', isAuthen, async (req, res) => {
    try{
        let orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json("Id is not valid");
        };
        const order = await Order.findById(orderId);
        if(!order) {return res.status(404).json("Not found Order");};

        // delete order and after that delete orderItems of this order
        Order.findByIdAndDelete(req.params.id)
        .then( async orderDelete => {
           await orderDelete.orderItems.map( async orderitem => {
                await OrderItem.findByIdAndDelete(orderitem);
            });
        });

        // Order.findByIdAndDelete(req.params.id)
        // .then(  orderDelete => {
        //     Promise.all(orderDelete.orderItems.map( orderitem => {
        //         return OrderItem.findByIdAndDelete(orderitem);
        //     })).then(() => {
        //         res.status(200).json("1 order is deleted")
        //     });
        // });
    }catch(e) {
        res.status(500).json(e);
    }
})

//Get quanlity of order
route.get('/get/quanlity-order', isAuthen, isAdmin, async (req, res) => {
    try{
        const numberOrder = await Order.countDocuments();
        res.status(200).json({"Number of Order": numberOrder});
    }catch(e){
        res.status(500).json(e);
    }
});

// Get SumPrice all Order (Admin)
route.get('/get/sum-sale', isAuthen, isAdmin, async (req,res) => {
    try{
        const totalSaleTable = await Order.aggregate([
            {
                $group: {_id: null, totalsale: {$sum: '$totalPrice'} }
            }
        ]);
        res.status(200).json({totalsale: totalSaleTable.pop().totalsale});
    } catch(e){
        console.log(e)
        res.status(500).json(e);
    }
});

// Get orders of an user (for user can see their orders)
route.get('/get/user-order/:userid', isAuthen, async (req,res) => {
    try{
        const userOrder = await Order.find({user: req.params.userid})
        .populate('user', 'name -_id')
        .populate({path: "orderItems", populate: {
            path: "product", populate: {
                path: "catelogy"}}});
        res.status(200).json(userOrder);
    } catch(e){
        res.status(500).json({message: e});
    }
});

module.exports = route
