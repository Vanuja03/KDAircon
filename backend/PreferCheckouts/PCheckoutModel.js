const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PCheckoutSchema = new Schema({

    pname: String,
    psize: String,
    pTubeSize: String,
    pGasType: String,
    mobile: Number,
    quantity: Number,
    userMail: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
},
    {
        collection: "PCheckout"
    });

const PCheckout = mongoose.model('PCheckout', PCheckoutSchema);
module.exports = PCheckout;