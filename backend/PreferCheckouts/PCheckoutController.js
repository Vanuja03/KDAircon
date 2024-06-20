const PCheckout = require('./PCheckoutModel');



const addPCheckout = async (req, res) => {
    try {

        const { pname, psize, pTubeSize, mobile, pGasType, quantity, userMail } = req.body;

        const pChekout = new PCheckout({
            pname,
            psize,
            pTubeSize,
            mobile,
            pGasType,
            quantity,
            userMail,
        });

        await pChekout.save();

        res.json({ success: true, message: 'Checkout saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internel server error : ', error });
    }
};


const getPCheckout = async (req, res) => {

    PCheckout.find()
        .then(checkout => {
            res.json(checkout);
        })
        .catch(error => {
            console.error('Error fetching checkout:', error);
            res.status(500).json({ message: 'Internal server error ' });
        });
};


const deletePCheckout = async (req, res) => {

    const { _id } = req.body;
    try {
        const deleteCheckout = await PCheckout.findOneAndDelete({ _id: _id });

        if (deleteCheckout) {
            return res.status(200).json(deleteCheckout);
        } else {
            return res.status(404).json({ message: 'Checkout not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

const statusPupdate = async (req, res) => {

    const { _id, status } = req.body;

    try {
        const updatestatus = await PCheckout.findByIdAndUpdate(
            _id,
            { status: status },
            { new: true }
        )

        if (updatestatus) {
            res.status(200).json(updatestatus);
        } else {
            res.status(404).json({ message: 'Checkout not found' });
        }
    } catch (error) {
        console.error('Error updating status: ', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}

exports.addPCheckout = addPCheckout;
exports.getPCheckout = getPCheckout;
exports.statusPupdate = statusPupdate;
exports.deletePCheckout = deletePCheckout;