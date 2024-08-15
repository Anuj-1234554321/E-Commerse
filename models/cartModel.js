const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number, required: true },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
});

module.exports = mongoose.model('Cart', cartSchema);
