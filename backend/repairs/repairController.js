const Repair = require('./repairModel');
const multer = require('multer');
const path = require('path');

const addRepair = async (req, res) => {

    try {

        const { cname, billNo, billDate, pname, description, mobile, userMail } = req.body;

        const formattedBillDate = Array.isArray(billDate) ? billDate.join(', ') : billDate;

        const imagesData = req.files.map(file => ({
            data: file.buffer.toString('base64'),
            contentType: file.mimetype,
        }
        ));

        const newRepair = new Repair({
            cname,
            billNo,
            billDate: formattedBillDate,
            pname,
            description,
            userMail,
            images: imagesData,
            mobile,
        });

        await newRepair.save();
        res.json({ success: true, message: 'Repair submitted successfully' });

    } catch (error) {
        console.error('Error repair product: ', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getRepair = async (req, res) => {
    try {
        const userMail = req.params.userMail;
        Repair.find({ userMail: userMail })
            .then(repair => {
                if (repair.length == 0) {
                    return res.status(404).json({ message: 'No Repairs found for this user' });
                }
                res.json(repair);
            })
            .catch(error => {
                console.error('Error fetching repair:', error);
                res.status(500).json({ message: 'Internal server error ' });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getAllRepair = async (req, res) => {
    try {
        const allRepairs = await Repair.find();
        res.status(200).json(allRepairs);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const updateRepair = async (req, res) => {

    try {

        const { _id, cname, billNo, billDate, pname, description, mobile } = req.body;
        const formattedBillDate = Array.isArray(billDate) ? billDate.join(', ') : billDate;

        const updatedRepair = await Repair.findOneAndUpdate({ _id }, {
            _id,
            cname,
            billNo,
            billDate: formattedBillDate,
            pname,
            description,
            mobile,
        }, { new: true });

        if (!updatedRepair) {
            return res.status(404).json({ success: false, message: 'Repair not found' });
        }
        res.json({ success: true, message: 'Repair updated successfully', data: updatedRepair });
    } catch (error) {
        console.error('Error updating repair:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const deleteRepair = async (req, res) => {
    const { _id } = req.body;

    try {
        const deletedRepair = await Repair.findOneAndDelete({ _id: _id });
        if (deletedRepair) {
            return res.status(200).json(deletedRepair);
        } else {
            return res.status(404).json({ message: 'Repair not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

const repairstatusupdate = async (req, res) => {

    const { _id, status } = req.body;

    try {
        const updatestatus = await Repair.findByIdAndUpdate(
            _id,
            { status: status },
            { new: true }
        )

        if (updatestatus) {
            res.status(200).json(updatestatus);
        } else {
            res.status(404).json({ message: 'Repair not found' });
        }
    } catch (error) {
        console.error('Error updating status: ', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}

exports.addRepair = addRepair;
exports.getRepair = getRepair;
exports.deleteRepair = deleteRepair;
exports.updateRepair = updateRepair;
exports.getAllRepair = getAllRepair;
exports.repairstatusupdate = repairstatusupdate;
