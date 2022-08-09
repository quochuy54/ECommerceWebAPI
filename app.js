const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route = require('./route/index');
require('dotenv/config');
const cors=require("cors");

//Middleware
app.use(express.json());
app.use('/public/uploads', express.static(__dirname + "\\public\\uploads"));
//COR
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
app.use(cors(corsOptions)) // Use this after the variable declaration

// Connect MongoDB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
})
.then(() => {console.log('Connect DB successfully!')})
.catch((e) => {console.log('Connect DB failure: ', e)});

//Router
app.use('/api/v1', route);


const PORT = process.env.PORT || '3000';
app.listen(PORT, () => {
    console.log(`Server is listing at ${PORT}`)
});

