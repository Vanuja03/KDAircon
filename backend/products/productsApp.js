const express = require('express');
const app = express();
const cors = require('cors');
const pcontroller = require('./productController');

app.use(cors());

app.use(
    express.urlencoded({
        extended:true,
    })
);

app.use(express.json());

app.post('/addProduct' , (req,res) => {
    pcontroller.addProduct(req,res,next => {
        res.send();
    });
});

module.exports = app;