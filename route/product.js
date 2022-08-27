const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const multer = require('multer');
const productController = require('../controller/ProductController');

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
