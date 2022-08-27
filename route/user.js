const express = require('express');
const route = express.Router();
const {isAuthen, isAdmin} = require('../auth/isAuth');
const UserController = require('../controller/UserController');


// Regist User
route.post('/register', UserController.registUser);

// Login User
route.post('/login', UserController.loginUser);

//Refresh Token when AccessToken expires
route.post('/refreshToken', isAuthen, UserController.refreshToken)

// Get user
route.get('/', isAuthen, isAdmin, UserController.getUser);

//get quanlity of users
route.get('/get/quanlity-user', isAuthen, isAdmin, UserController.getQuanlityUsers);


module.exports = route;
