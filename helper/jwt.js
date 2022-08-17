const jwt = require('jsonwebtoken');


// Tao Token
const generateToken = function (userId, secretToken, tokeLife){
    return new Promise((resolve, reject) => {
        jwt.sign({
           userId: userId 
        }, 
        secretToken, 
        {
            expiresIn: tokeLife,
            algorithm: 'HS256'
        },
        (err, token) => {
            if(err){
                return reject(err);
            }
            resolve(token);
        });
    });
};

//Xac thuc token

const verifyToken = function (token, secretToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretToken, (err, decoded) => {
            if(err){
                return reject(err);
            }
            resolve(decoded)
        });
    });
}

const verifyTokenWithoutExpire = function (token, secretToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretToken, {ignoreExpiration: true}, (err, decoded) => {
            if(err){
                return reject(err);
            }
            resolve(decoded)
        });
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    verifyTokenWithoutExpire: verifyTokenWithoutExpire
};
