const mongoose = require('mongoose');


const ownerSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: Buffer
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }]

})

const ownerModel = mongoose.model('owner', ownerSchema);
module.exports = ownerModel;