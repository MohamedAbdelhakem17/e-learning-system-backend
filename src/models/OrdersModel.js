const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    cart_item: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        required: true,
    },
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total_price: {
        type: Number,
        required: true,
        min: 0,
    },
    is_Paid: {
        type: Boolean,
        default: true
    },
    payment_at: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
