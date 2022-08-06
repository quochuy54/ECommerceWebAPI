const express = require('express');
const Catelogy = require('../model/catelogy');
const route = express.Router();
const Product  = require('../model/product');
const mongoose = require('mongoose');
const {isAuthen, isAdmin} = require('../auth/isAuth');

//Get All Product and Filter by catelogy
route.get('/', isAuthen, isAdmin, async (req, res) => {
    try{
        let filter = {};
        if(req.query.catelogy){ 
            filter.catelogy = req.query.catelogy
        };
        const productList = await Product.find(filter).populate("catelogy");
        res.status(200).json(productList);
    }catch(e) {
        res.status(500).json(e);
    }
})

//Get A Product
route.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate("catelogy");
        if(product){
            res.status(200).json(product);
        }
        else{
            return res.status(404).json("Not found Product");
        }
    }catch(e) {
        res.status(500).json(e);
    }
})

// Post Product
route.post('/', async (req, res) => {
    try{
        let catelogyId = req.body.catelogy;

        if (!mongoose.Types.ObjectId.isValid(catelogyId)){
            return res.status(400).json("Id is not valid");
        };

        const catelogy = await Catelogy.findById(catelogyId);
        if(!catelogy) {return res.status(404).json("Not found Catelogy");};

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            catelogy: req.body.catelogy,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,

        });
        const newProduct = await product.save();
        res.status(200).json(newProduct);
    } catch(e) {
        res.status(500).json(e);
    }
    
});


//Update Product 
route.put('/:id', async (req, res) => {
    try{
        let catelogyId = req.body.catelogy;

        if (!mongoose.Types.ObjectId.isValid(catelogyId)){
            return res.status(400).json("Id is not valid");
        };

        const catelogy = await Catelogy.findById(catelogyId);
        if(!catelogy) {return res.status(404).json("Not found Catelogy");};

        const productUpdate = await Product.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        res.status(200).json(productUpdate);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Delete Product
route.delete('/:id', async (req, res) => {
    try{
        let productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json("Id is not valid");
        };
        const deleteProduct = await Product.findById(req.params.id);
        if(!deleteProduct) {return res.status(404).json("Not found Product");};
        await Product.deleteOne({_id: req.params.id});
        res.status(200).json(" 1 product Deleted");
    }catch(e) {
        res.status(500).json(e);
    }
});
module.exports = route;