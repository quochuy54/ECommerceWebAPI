const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const catelogyController = require('../controller/CatelogyController')

// Get All Catelogy
route.get('/', catelogyController.getAllCatelogy);

// Post Catelogy
route.post('/', isAuthen, isAdmin, catelogyController.addCatelogy);

// Update Catelogy
route.put('/:id', isAuthen, isAdmin, catelogyController.updateCatelogy);

// Delete Catelogy
route.delete('/:id', isAuthen, isAdmin, catelogyController.deleteCatelogy);

module.exports = route;
