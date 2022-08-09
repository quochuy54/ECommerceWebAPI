const express = require('express');
const route = express.Router();
const Catelogy = require('../model/catelogy');
const mongoose = require('mongoose');
const {isAuthen, isAdmin} = require('../auth/isAuth');

// Get All Catelogy
route.get('/', async (req, res) => {
    try{
        const catelogyList = await Catelogy.find();
        res.status(200).json(catelogyList);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Post Catelogy
route.post('/', isAuthen, isAdmin, async (req, res) => {
    try{
        const catelogy = new Catelogy({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        });
        const catelogyAdd = await catelogy.save();
        res.status(200).json(catelogyAdd);
    }catch(e) {
        res.status(500).json(e);
    }
});

// Update Catelogy
route.put('/:id', isAuthen, isAdmin, async (req, res) => {
    try{
        const catelogyUpdate = await Catelogy.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});
        if(catelogyUpdate){
            res.status(200).json(catelogyUpdate);
        }
        else{
            return res.status(404).json("Not Found Catelogy");
        }
    }catch(e) {
        res.status(500).json(e);
    }
});

// Delete Catelogy
route.delete('/:id', isAuthen, isAdmin, async (req, res) => {
    try{
        let catelogyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(catelogyId)){
            return res.status(400).json("Id is not valid");
        };
        const deleteCatelogy = await Catelogy.findById(req.params.id);
        if(!deleteCatelogy) {return res.status(404).json("Not found Catelogy");};
        await Catelogy.deleteOne({_id: req.params.id});
        console.log(a)
        res.status(200).json(" 1 task Deleted");
    }catch(e) {
        res.status(500).json(e);
    }
});

module.exports = route;
