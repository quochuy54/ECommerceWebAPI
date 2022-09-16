const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const productController = require('../controller/ProductController');
const upload = require('../helper/uploadMulter');

//Get All Product and Filter by catelogy
route.get('/', productController.getAllProduct);

// Get Random Feature Product
route.get('/random-product', productController.getRandomFeatureProduct)

//Get A Product
route.get('/:id',productController.getAproduct)

// Post Product
route.post('/', isAuthen, isAdmin, upload.single('image'), productController.addProduct);

//Update Product 
route.put('/:id', isAuthen, isAdmin, upload.single('image'), productController.updateProduct);

//Update Gallery of Product 
route.put('/gallery-images/:id', isAuthen, isAdmin, upload.array('images'), productController.updateGalleryProduct);

// Delete Product
route.delete('/:id', isAuthen, isAdmin, productController.deleteProduct);
module.exports = route;
