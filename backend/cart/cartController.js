const Booking = require('./cartModel');
const OrderAutoId = require('./cartIdModel');
const { response } = require('../products/productsApp');

const getBooking = async(req,res) => {
    
    const userMail = req.params.userMail;

    Booking.find({ userMail : userMail})
           .then(bookings => {
            if(bookings.length == 0){
                return res.status(404).json({ message : 'No bookings found for this user'});
            }
            res.json(bookings);
           })
           .catch(error => {
            console.error('Error fetching booking:' , error);
            res.status(500).json({ message : 'Internal server error '});
           });
};

const addBooking = async(req,res) => {

    try{
        const cd = await OrderAutoId.findOneAndUpdate(
            { id : "autoval" },
            { $inc : { "seq" : 1 }},
            { new : true}
        );

        let seqId;
        if (!cd){
            const newval = new OrderAutoId({ id : "autoval", seq : 1});
            await newval.save();
            seqId = 1;
        }else{
            seqId = cd.seq;
        }
        const { pname , pprice , quantity , userMail } = req.body;

        const offset = 5.5; // +5.30 is 5 hours and 30 minutes ahead of UTC
        const utcMilliseconds = new Date().getTime();
        const localOffset = new Date().getTimezoneOffset();
        const localMilliseconds = utcMilliseconds - (localOffset * 60000);
        const targetMilliseconds = localMilliseconds + (offset * 3600000);
        const createdAt = new Date(targetMilliseconds);

        const booking = new Booking({
            pname,
            pprice,
            quantity,
            userMail,
            o_id : seqId,
            createdAt
        });

        const response = await booking.save();
        res.json({ success : true , message : 'Product added to cart successfully '});
    }catch(error){
            console.error('Error adding product to cart: ' , error);
            res.status(500).json({ success : false , message : 'Internal server error'});
    }
};

const updateBooking = async(req,res) => {

    const { o_id , quantity } = req.body;
    Booking.updateOne({ o_id : o_id} , { $set : { quantity : quantity}})

    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({error});
    });
};

const deleteBooking = async(req,res) => {

    const {o_id} = req.body;
    try{
        const deletedBooking = await Booking.findOneAndDelete({ o_id : o_id});

        if(deletedBooking){
            return res.status(200).json(deletedBooking);
        }else{
            return res.status(404).json({ message : 'Order not found'});
        }
    }catch(error){
        return res.status(500).json({ message : 'Internal server error' , error : error});
    }
}

exports.getBooking = getBooking;
exports.addBooking = addBooking;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;