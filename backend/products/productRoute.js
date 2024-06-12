const express = require('express');
const pcontroller = require('./productController');
const router = express.Router();

router.get('/products' , pcontroller.getProduct);
router.post('/addProduct' , pcontroller.addProduct);
router.post('/updateProduct' , pcontroller.updateProduct);
router.post('/deleteProduct' , pcontroller.deleteProduct);

module.exports = router;