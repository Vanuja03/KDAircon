const mongoose = require('mongoose');

const AddProduct = new mongoose.Schema({
    pid: Number,
    pname: String,
    pdescription: String,
    pprice: Number,
    pquantity: Number,
    image: String,
},
{
    collection : "Products"
});

const Product = mongoose.model('Products',AddProduct);
module.exports = Product;
