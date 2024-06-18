const express = require('express');
const routerCh = express.Router();
const CheckoutController = require('./CheckoutController');

routerCh.post('/addCheckout', CheckoutController.addCheckout);
routerCh.get('/Checkout', CheckoutController.getCheckout);
routerCh.post('/deleteCheckout', CheckoutController.deleteCheckout);
routerCh.post('/statusupdate', CheckoutController.statusupdate);

module.exports = routerCh;