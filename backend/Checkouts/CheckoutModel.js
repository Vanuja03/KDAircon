const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckoutSchema = new Schema({

    pname: String,
    pprice: Number,
    quantity: Number,
    mobile: Number,
    userMail: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
},
    {
        collection: "Checkout",
        timestamps: true,
    });

const Checkout = mongoose.model('Checkout', CheckoutSchema);
module.exports = Checkout;