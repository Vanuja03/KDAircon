const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    data: String,
    contentType: String,
    image: Buffer,
});

const AddRepair = new mongoose.Schema({

    billNo: String,
    billDate: String,
    pname: String,
    description: String,
    userMail: String,
    images: [imageSchema],
    mobile: String,
    status: { type: String, default: 'Pending' }
}
    ,
    {
        collection: 'Repairs'
    });

const Repair = mongoose.model('Repairs', AddRepair);
module.exports = Repair;