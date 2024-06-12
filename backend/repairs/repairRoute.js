const express = require('express');
const Rcontrol = require('./repairController');
const routerR = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });

routerR.post('/addRepair', upload.array("images", 5), Rcontrol.addRepair);
routerR.get('/repair/:userMail', Rcontrol.getRepair);
routerR.get('/Allrepairs', Rcontrol.getAllRepair);
routerR.post('/deleteRepair', Rcontrol.deleteRepair);
routerR.post('/updateRepair', Rcontrol.updateRepair);

module.exports = routerR;