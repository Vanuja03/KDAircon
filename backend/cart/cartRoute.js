const express = require('express');
const routerB = express.Router();
const Bcontroller = require('./cartController');

routerB.get('/Booking/:userMail' , Bcontroller.getBooking);
routerB.post('/addBooking' , Bcontroller.addBooking);
routerB.post('/updateBooking' , Bcontroller.updateBooking);
routerB.post('/deleteBooking' , Bcontroller.deleteBooking);

module.exports = routerB;