const express = require('express');
const Catelogy = require('../model/catelogy');
const route = express.Router();
const Product  = require('../model/product');
const mongoose = require('mongoose');
const {isAuthen, isAdmin} = require('../auth/isAuth');
const multer = require('multer');

const FILE_EXTENSION = {
    'image/jpeg': '.jpeg',
    'image/jpg': '.jpg',
    'image/png': '.png',
}

// Config Disk in multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let err = new Error('Type file is not valid');
        const isValidFileName = FILE_EXTENSION[file.mimetype];
        if(isValidFileName){
            err = null;
        }
        cb(err, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const extension = FILE_EXTENSION[file.mimetype];
        const filename = file.originalname.replace(' ', '-');
        cb(null, `${filename}-${Date.now()}${extension}`)
    }
})

const upload = multer({ storage: storage });


//Get All Product and Filter by catelogy
route.get('/', async (req, res) => {
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
route.post('/', isAuthen, isAdmin, upload.single('image'), async (req, res) => {
    try{
        let catelogyId = req.body.catelogy;

        if (!mongoose.Types.ObjectId.isValid(catelogyId)){
            return res.status(400).json("CatelogyID is not valid");
        };

        const catelogy = await Catelogy.findById(catelogyId);
        if(!catelogy) {return res.status(404).json("Not found Catelogy");};

        if(!req.file) {return res.status(401).json('The file is required');}

        // file url
        const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: fileUrl,
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
route.put('/:id', isAuthen, isAdmin, upload.single('image'),async (req, res) => {
    try{
        let catelogyId = req.body.catelogy;
        if (!mongoose.Types.ObjectId.isValid(catelogyId)){
            return res.status(400).json("CatelogyID is not valid");
        };

        const catelogy = await Catelogy.findById(catelogyId);
        if(!catelogy) {return res.status(404).json("Not found Catelogy");};
        const product = await Product.findById(req.params.id);
        if(!product) {return res.status(404).json('Product not found')};

        const fileImg = req.file;
        let imgPath;
        if(fileImg){
            imgPath = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        }
        else {
            imgPath = product.image;
        }

        const productUpdate = await Product.findByIdAndUpdate({_id: req.params.id}, 
            {$set: {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imgPath,
                brand: req.body.brand,
                price: req.body.price,
                catelogy: req.body.catelogy,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                dateCreated: req.body.dateCreated,
            }},
             {new: true});
        res.status(200).json(productUpdate);
    }catch(e) {
        res.status(500).json(e);
    }
});

//Update Gallery of Product 
route.put('/gallery-images/:id', isAuthen, isAdmin, upload.array('images'),async (req, res) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json("ProductID is not valid");
        };
        
        const product = await Product.findById(req.params.id);
        if(!product) {return res.status(404).json('Product not found')};
        if(req.files.length === 0) {return res.status(401).json('The files is required');}

        const fileImgs = req.files;
        let imgPaths = [];
        if(fileImgs){
            fileImgs.map(file => {
                imgPaths.push(`${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`);
            })
        }
        else {
            imgPaths = product.images;
        }

        const productUpdate = await Product.findByIdAndUpdate({_id: req.params.id}, 
            {$push: {
                images: imgPaths
            }},
             {new: true});
        res.status(200).json(productUpdate);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Delete Product
route.delete('/:id', isAuthen, isAdmin, async (req, res) => {
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