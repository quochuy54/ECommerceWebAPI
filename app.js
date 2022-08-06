const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./route/index');
require('dotenv/config');

//Middleware
app.use(express.json());
// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/ECommerce', {
    useNewUrlParser: true,
})
.then(() => {console.log('Connect DB successfully!')})
.catch(() => {console.log('Connect DB failure')});

//Router
app.use('/api/v1', route);


const PORT = process.env.PORT || '3000';
app.listen(PORT, () => {
    console.log(`Server is listing at ${PORT}`)
});

