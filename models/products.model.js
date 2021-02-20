const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    id: Number,
    brand: String,
    description: String,
    image: String,
    price: Number
});

ProductSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Product', ProductSchema);