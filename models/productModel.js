const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: {
        type: Buffer
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    isOutOfStock: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('product', productSchema);