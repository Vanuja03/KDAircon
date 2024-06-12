const Prefer = require('./PreferModel');
const POrderAutoId = require('./PreferIdModel');


const addPrefer = async(req,res) => {
    try{
        const cd = await POrderAutoId.findOneAndUpdate(
            { id : "autoval" },
            { $inc : { "seq" : 1 }},
            { new : true}
        );

        let seqId;
        if (!cd){
            const newval = new POrderAutoId({ id : "autoval", seq : 1});
            await newval.save();
            seqId = 1;
        }else{
            seqId = cd.seq;
        }
        const offset = 5.5; // +5.30 is 5 hours and 30 minutes ahead of UTC
        const utcMilliseconds = new Date().getTime();
        const localOffset = new Date().getTimezoneOffset();
        const localMilliseconds = utcMilliseconds - (localOffset * 60000);
        const targetMilliseconds = localMilliseconds + (offset * 3600000);
        const createdAt = new Date(targetMilliseconds);

        const { pname, psize , pTubeSize , pGasType , quantity , userMail } = req.body;

        const prefer = new Prefer({
            pname,
            psize,
            pTubeSize,
            pGasType,
            quantity,
            userMail,
            o_id : seqId,
        });

        await prefer.save();

        res.json({ success : true , message : 'Product saved successfully'});
    }catch(error){
        res.status(500).json({ success : false , message : 'Internel server error : ' , error});
    }
};


const getPrefer = async(req,res) => {
    const userMail = req.params.userMail;
    Prefer.find({ userMail : userMail})
          .then(prefer => {
            if(prefer.length == 0){
                return res.status(404).json({ message : 'No bookings found for this user'});
            }
            res.json(prefer);
          })
          .catch(error => {
            console.error('Error fetching booking:' , error);
            res.status(500).json({ message : 'Internal server error '});
           });
}

const updatePrefer = async(req,res) => {
    const { o_id , quantity} = req.body;
    Prefer.updateOne({ o_id : o_id} , { $set : { quantity : quantity}})

    .then(response => {
        res.json({response});
    })
    .catch(error => {
        res.json({error});
    });
};

const deletePrefer = async(req,res) => {
    const {o_id} = req.body;

    try{
        const deletedBooking = await Prefer.findOneAndDelete({ o_id : o_id});
        if(deletedBooking){
            return res.status(200).json(deletedBooking);
        }else{
            return res.status(404).json({ message : 'Order not found'});
        }
    }catch(error){
        return res.status(500).json({ message : 'Internal server error' , error : error});
    }
}

exports.addPrefer = addPrefer;
exports.getPrefer = getPrefer;
exports.updatePrefer = updatePrefer;
exports.deletePrefer = deletePrefer;