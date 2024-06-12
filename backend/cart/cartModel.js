const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    pname : String,
    pprice : Number,
    quantity : Number,
    userMail : String,
    o_id : String,
   // createdAt: { type : Date , default: Date.now }
},
{
    collection : "Booking",
    timestamps:true,
});

const Booking = mongoose.model('Booking' , bookingSchema);
module.exports = Booking;