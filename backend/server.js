const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./products/productRoute');
const appP = require('./products/productsApp');
const routerB = require('./cart/cartRoute');
const { addBooking } = require('./cart/cartController');
const routerP = require('./Prefer/PreferRoute');
const routerR = require('./repairs/repairRoute');
const routerF = require('./feedbacks/feedbackroute');

dotenv.config();
//rest

const app = express();

const uri = 'mongodb+srv://vanuja2003:2003vanuja@cluster0.xyfwuiv.mongodb.net/?retryWrites=true&w=majority';

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to mongodb databse');
    } catch (error) {
        console.log('MongoDb error: ', error);
    }
};

connect();

app.use(cors());

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to KD Aircon server',
    });
});

app.use(express.json());

//port
const PORT = process.env.PORT || 4000;

//run
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
})

app.use('/api', router);
app.use('/api', routerB);
app.use('/api', routerP);
app.use('/api', routerR);
app.use('/api', routerF);
