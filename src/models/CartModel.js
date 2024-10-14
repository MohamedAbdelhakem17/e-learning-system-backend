const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    course: {
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
    discounted_price: {
        type: Number,
        min: 0,
        validate: {
            validator: function (value) { return value <= this.price; },
            message: "Discounted price must be less than or equal to the original price",
        },
    }
}, { timestamps: true });


const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
