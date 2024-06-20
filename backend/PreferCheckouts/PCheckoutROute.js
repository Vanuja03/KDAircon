const express = require('express');
const routerPCh = express.Router();
const PCheckoutController = require('./PCheckoutController');

routerPCh.post('/addPCheckout', PCheckoutController.addPCheckout);
routerPCh.get('/PCheckout', PCheckoutController.getPCheckout);
routerPCh.post('/deletePCheckout', PCheckoutController.deletePCheckout);
routerPCh.post('/statusPupdate', PCheckoutController.statusPupdate);

module.exports = routerPCh;