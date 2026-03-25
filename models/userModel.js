const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        required: true
    },
    username: {
        type: String,
        trim: true,
        minLength: 3,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: Buffer
    },
    price: {
        type: Number
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    orders: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]

})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;