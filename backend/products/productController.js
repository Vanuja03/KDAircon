const mongoose = require('mongoose');
const Product = require('./productModel');
const multer = require('multer');
const path = require('path');
const { error } = require('console');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const absolutePath = path.resolve(__dirname, '../../frontend/src/images/');
        cb(null, absolutePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        upload.single('image')(req, res, async (error) => {
            if (error) {
                console.error('Error uploading image: ', error);
                return res.status(500).json({ success: false, message: 'Error uploading image' });
            }
            console.log('req.file:', req.file);
            const imageFileName = req.file.filename;
            const { pid, pname, pdescription, pprice, pquantity } = req.body;
            const newProduct = new Product({
                pid,
                pname,
                pdescription,
                pprice,
                pquantity,
                image: imageFileName,
            });

            await newProduct.save();
            res.json({ success: true, message: 'Product added successfully' });
        });
    } catch (error) {
        console.error('Error adding product: ', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getProduct = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json({ allProducts });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const updateProduct = async (req, res) => {

    try {

        const { pid, pname, pdescription, pprice, pquantity } = req.body;

        const updatedProduct = await Product.findOneAndUpdate({ pid }, {
            pid,
            pname,
            pdescription,
            pprice,
            pquantity,
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const fs = require('fs');


const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.body;

        // Find the product to be deleted
        const deletedProduct = await Product.findOneAndDelete({ pid });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete the corresponding image from the frontend images folder
        const imagePath = path.resolve(__dirname, `../../frontend/src/images/${deletedProduct.image}`);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
                return res.status(500).json({ success: false, message: 'Error deleting image' });
            }
            console.log('Image deleted successfully');
        });

        res.json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
exports.addProduct = addProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;