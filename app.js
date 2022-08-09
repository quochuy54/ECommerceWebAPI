const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./route/index');
require('dotenv/config');

//Middleware
app.use(express.json());
app.use('/public/uploads', express.static(__dirname + "\\public\\uploads"));

console.log(process.env.DB_URL)
// Connect MongoDB
mongoose.connect(process.env.DB_URL, {
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

