const mongoose = require('mongoose');

const OrderItemSchema = mongoose.Schema({
    quantily: Number,
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
