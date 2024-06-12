const express = require('express');
const routerP = express.Router();
const preController = require('./PreferController');

routerP.post('/addprefer' , preController.addPrefer);
routerP.get('/Prefer/:userMail' , preController.getPrefer);
routerP.post('/updateprefer' , preController.updatePrefer);
routerP.post('/deleteprefer' , preController.deletePrefer);

module.exports = routerP;