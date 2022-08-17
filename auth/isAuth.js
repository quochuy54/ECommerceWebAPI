const jwtHelper = require('../helper/jwt');
const User = require('../model/user');

// Authentication
exports.isAuthen = async function(req, res, next){
    const secretToken = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = req.headers.x_authorization;
    if(!accessToken){return res.status(400).json('Access Token not found')};
    try{
        const decoded = await jwtHelper.verifyToken(accessToken, secretToken);
        const user = await User.findOne({_id: decoded.userId});
        req.user = user;
        return next();
    } catch(err){
        console.log(err)
        return res.status(500).json(err);
        console.log(123)
    }
    
};

// Authortication
exports.isAdmin = function (req, res, next){
    const isAdmin = req.user.isAdmin;
    if(isAdmin){
        return next();
    }
    return res.status(403).json("Ban khong co quyen thuc hien tinh nang nay");
}