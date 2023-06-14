const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    owner: {type: String, default: 'admin'},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    code: {type: String, unique: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    status: {type: Boolean, default: true, required: true} 
}, {versionKey: false})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;