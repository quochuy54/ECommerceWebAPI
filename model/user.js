const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require
    },
    email: {
        type: String,
        require
    },
    password: {
        type: String,
        require
    },
    street: {
        type: String,
        require
    },
    city: {
        type: String,
        require
    },
    phone: Number,
    isAdmin: {
        type: Boolean,
        require
    },
    zip: String,
    refreshToken: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model("User", UserSchema);
