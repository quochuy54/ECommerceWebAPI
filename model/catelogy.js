const mongoose = require('mongoose');

const CatelogySchame = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: String,
    icon: String
})

module.exports = mongoose.model('Catelogy', CatelogySchame);
