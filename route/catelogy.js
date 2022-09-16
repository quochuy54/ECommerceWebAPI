const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const catelogyController = require('../controller/CatelogyController')
const upload = require('../helper/uploadMulter');

// Get All Catelogy
route.get('/', catelogyController.getAllCatelogy);

// Post Catelogy
route.post('/', isAuthen, isAdmin, upload.single('icon'), catelogyController.addCatelogy);

// Update Catelogy
route.put('/:id', isAuthen, isAdmin, upload.single('icon'),catelogyController.updateCatelogy);

// Delete Catelogy
route.delete('/:id', isAuthen, isAdmin, catelogyController.deleteCatelogy);

module.exports = route;
