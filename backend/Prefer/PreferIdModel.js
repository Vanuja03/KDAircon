const mongoose = require('mongoose');
const idSchema = mongoose.Schema;

const BautoId = {
    id: {
        type : String
    },
    seq:{
        type : Number
    }
}

const AutoIdModel = mongoose.model("POrderAutoId", BautoId);
module.exports = AutoIdModel;