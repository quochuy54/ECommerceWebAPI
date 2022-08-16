const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const jwtHelper = require('../helper/jwt');
const {isAuthen, isAdmin} = require('../auth/isAuth');


// Regist User
route.post('/register', async (req, res) => {
    try{
        let password = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: password,
            street: req.body.street,
            phone: req.body.phone,
            zip: req.body.zip,
            city: req.body.city,
            isAdmin: req.body.isAdmin,
        });

        const newUser = await user.save();
        res.status(200).json(newUser);

    }catch(e) {
        res.status(500).json(e);
    }
});

// Login User
route.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){return res.status(404).json("User Not Found")}
        else{
            const passwordValid = await bcrypt.compare(req.body.password, user.password)
            if(passwordValid){
                const token = await jwtHelper.generateToken(user._id, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
                let refreshToken = await jwtHelper.generateToken(user._id,process.env.ACCESS_REFRESHTOKEN_SECRET, process.env.ACCESS_REFRESHTOKEN_LIFE);
                //console.log(process.env.ACCESS_REFRESHTOKEN_LIFE)

                // Kiem tra xem user co refreshToken trong DB chua, neu chua thi them vao
                if(!user.refreshToken){
                    await User.findByIdAndUpdate(user._id, {$set: {refreshToken: refreshToken}});
                }
                else{
                    refreshToken = user.refreshToken;
                }
                // console.log(123)
                // jwt.sign({
                //     userId: user._id
                // },
                // process.env.ACCESS_TOKEN_SECRET, // luu o bien env
                // {   expiresIn: process.env.ACCESS_TOKEN_LIFE,
                //     algorithm: 'HS256'
                // });
                res.status(200).json({user: user.email, token: token, refreshToken: refreshToken});
            }
            else{
                return res.status(400).json("Wrong Password");
            }

        };
        
    }catch(e) {
        res.status(500).json(e);
    }
});

//Refresh Token when AccessToken expires
route.post('/refreshToken', isAuthen, async(req, res) => {
    try{
        const accessToken = req.headers.x_authorization;
        if(!accessToken){ return res.status(401).json('Token not found')};

        const refreshToken = req.body.refreshToken;
        
        if(!refreshToken) {return res.status(401).json('RefreshToken not found')}
        else{
            const decoded = await jwtHelper.verifyTokenWithoutExpire(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // console.log(decoded)
            const user = await User.findOne({id: decoded.userId});
            if(refreshToken !== user.refreshToken){
                return res.status(404).json('RefreshToken is not valid!');
            }
            else{
                // Kiem tra refreshToken da het han chua
                // Lay decode refreshToken
                const valid = await jwt.decode(refreshToken)
                // Kiem tra thoi gian het han so voi thoi gian hien tai (Date.getTime tinh ms nen /1000 => s)
                if(valid.exp - Math.ceil(new Date().getTime()/1000) <0)
                {
                    // xoa refresh het han trong DB va thong bao
                    await User.findByIdAndUpdate(user._id, {$set: {refreshToken: ''}})
                    return res.status(401).json("RefreshToken expires, please login again");
                }
                const newToken = await jwtHelper.generateToken(user._id, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
                res.status(200)
                    .json(
                    {   user: user,
                        token: newToken
                    })
            }
        }

    }catch(e){
        res.status(500).json(e);
    }
})

// Get user
route.get('/', isAuthen, isAdmin, async (req, res) => {
    try{
        const UserList = await User.find().select('-password');
        res.status(200).json(UserList);

    }catch(e) {
        res.status(500).json(e);
    }
});

// Delete user
route.delete('/:id', isAuthen, isAdmin, async (req, res) => {
    try{
        await User.deleteOne({_id: req.params.id});
        res.status(200).json("1 user deleted");
    }catch(e) {
        res.status(500).json(e);
    }
});

//get quanlity of users
route.get('/get/quanlity-user', isAuthen, isAdmin, async (req, res) => {
    try{
        const numberUser = await User.countDocuments();
        res.status(200).json({"Number of user": numberUser});
    }catch(e) {
        res.status(500).json(e);
    }
});


module.exports = route;
