// models/OrdersModel.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    cartItem: [{
        course: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
            required: true,
        },
        price: Number
    }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    isPaid: {
        type: Boolean,
        default: true
    },
    paymentAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

OrderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "cartItem.course",
        select: "name description slug imageCover ratingsAverage ratingsQuantity total_student_enrolled",
    });
    next();
});
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
