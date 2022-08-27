const Order = require('../model/order');
const OrderItem = require('../model/orderItem');
const mongoose = require('mongoose');

class OrderController{

    //Get All Order
    async getAllOrder(req, res) {
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
    }

    //Get An Order
    async getAnOrder(req, res) {
        try{
            if (!mongoose.Types.ObjectId.isValid(req.params.id)){
                return res.status(400).json("OrderID is not valid");
            };
            const order = await Order.findById(req.params.id);
            if(!order) { return res.status(404).json('Not found order')};
            res.status(200).json(order);
        }catch(e) {
            res.status(500).json(e);
        }
    }

    //Add Order
    async addOrder(req, res) {
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
            const totalPrice = totalPriceArray.reduce((total, currentValue) => { return total + currentValue}
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
    }

    // Update Order
    async updateOrder(req, res) {
        try{
            if (!mongoose.Types.ObjectId.isValid(req.params.id)){
                return res.status(400).json("OrderID is not valid");
            };
            
            const orderUpdate = await Order.findByIdAndUpdate(req.params.id, {
                $set: {status: req.body.status}
            }, {new: true});
            res.status(200).json(orderUpdate);
        }catch(e) {
            res.status(500).json(e);
        }
    }

    //Delete Order 
    async deleteOrder(req, res) {
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
                res.status(200).json("1 order is deleted")
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
    }

    //Get quanlity of order
    async getQuanlityOrder(req, res) {
        try{
            const numberOrder = await Order.countDocuments();
            res.status(200).json({"Number of Order": numberOrder});
        }catch(e){
            res.status(500).json(e);
        }
    }

    // Get SumPrice all Order (Admin)
    async getSumPriceAllOrder (req,res) {
        try{
            const totalSaleTable = await Order.aggregate([
                {
                    $group: {_id: null, totalsale: {$sum: '$totalPrice'} }
                }
            ]);
            res.status(200).json({totalsale: totalSaleTable.pop().totalsale});
        } catch(e){
            res.status(500).json(e);
        }
    }

    // Get orders of an user (for user can see their orders)
    async getOrdersOfAnUser(req,res) {
        try{
            if (!mongoose.Types.ObjectId.isValid(req.params.userid)){
                return res.status(400).json("UserID is not valid");
            };
    
            const userOrder = await Order.find({user: req.params.userid})
            .populate('user', 'name -_id')
            .populate({path: "orderItems", populate: {
                path: "product", populate: {
                    path: "catelogy"}}});
            res.status(200).json(userOrder);
        } catch(e){
            res.status(500).json({message: e});
        }
    }

}

module.exports = new OrderController();