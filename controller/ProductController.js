const Catelogy = require('../model/catelogy');
const Product  = require('../model/product');
const mongoose = require('mongoose');

class ProductController{

    //Get All Product
    async getAllProduct(req, res) {
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
    }

    //Get Random Feature Product
    async getRandomFeatureProduct(req, res) {
        try{
            const productList = await Product.aggregate([
                { $match: {isFeatured: true} },
                { $sample: {size : 5} }
            ]);
            res.status(200).json(productList);
        }catch(e) {
            res.status(500).json(e);
        }
    }

    //Get A Product
    async getAproduct(req, res){
        try{
            if (!mongoose.Types.ObjectId.isValid(req.params.id)){
                return res.status(400).json("ProductID is not valid");
            };
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
    }

    // Post Product
    async addProduct (req, res){
        try{      
            let catelogyId = req.body.catelogy;
            if (!mongoose.Types.ObjectId.isValid(catelogyId)){
                return res.status(400).json("CatelogyID is not valid");
            };
    
            const catelogy = await Catelogy.findById(catelogyId);
            if(!catelogy) {return res.status(404).json("Not found Catelogy");};
    
            if(!req.file) {return res.status(401).json('The file is required');}
    
            // file url
            // const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
            const product = new Product({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.file.location,
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
        
    }

    //Update Product 
    async updateProduct(req, res){
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
                imgPath = req.file.location;
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
    }

    //Update Gallery of Product 
    async updateGalleryProduct(req, res) {
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
                    imgPaths.push(file.location);
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
    }

    // Delete Product
    async deleteProduct(req, res) {
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
    }

}

module.exports = new ProductController();