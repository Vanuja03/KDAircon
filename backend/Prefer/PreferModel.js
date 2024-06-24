const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PreferBookingSchema = new Schema({

    pname: String,
    psize: { type: String, default: '-' },
    pTubeSize: { type: String, default: '-' },
    pGasType: { type: String, default: '-' },
    quantity: Number,
    userMail: String,
    o_id: String,
},
    {
        collection: "PreferBooking"
    });

const Prefer = mongoose.model('PreferBooking', PreferBookingSchema);
module.exports = Prefer;