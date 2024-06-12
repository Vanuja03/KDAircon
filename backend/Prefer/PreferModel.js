const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PreferBookingSchema = new Schema({

    pname : String,
    psize : String,
    pTubeSize : String,
    pGasType : String,
    quantity : Number,
    userMail : String,
    o_id : String,
},
{
    collection : "PreferBooking"
});

const Prefer = mongoose.model('PreferBooking' , PreferBookingSchema);
module.exports = Prefer;