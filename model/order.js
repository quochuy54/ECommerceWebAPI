const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],

    shippingAddress1: String,
    shippingAddress2: String,
    city: String,
    zip: String,
    country: String,
    phone: Number,
    status: {
        type: String,
        default: 'Pending'
    },
    totalPrice: Number,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    dateOrder:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Order', OrderSchema);
