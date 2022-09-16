const Catelogy = require('../model/catelogy');
const mongoose = require('mongoose');

class CatelogyController {
    // Get All Catelogy
    async getAllCatelogy(req, res){
        try{
            const catelogyList = await Catelogy.find();
            res.status(200).json(catelogyList);
        }catch(e) {
            res.status(500).json(e);
        }
    }

    // Post Catelogy
    async addCatelogy(req, res) {
        try{
            const catelogy = new Catelogy({
                name: req.body.name,
                icon: req.file.location,
                color: req.body.color,
            });
            const catelogyAdd = await catelogy.save();
            res.status(200).json(catelogyAdd);
        }catch(e) {
            res.status(500).json(e);
        }
    }

    // Update Catelogy
    async updateCatelogy(req, res) {
        try{
            let imgPath;
            if(fileImg){
                imgPath = req.file.location;
            }
            else {
                imgPath = product.image;
            }
            const catelogyUpdate = await Catelogy.findByIdAndUpdate(
                {_id: req.params.id},
                {$set:  {name: req.body.name,
                        icon: req.imgPath,
                        color: req.body.color}
                },
                {new: true});
            if(catelogyUpdate){
                res.status(200).json(catelogyUpdate);
            }
            else{
                return res.status(404).json("Not Found Catelogy");
            }
        }catch(e) {
            res.status(500).json(e);
        }
    }

    //Delete Catelogy
    async deleteCatelogy(req, res) {
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
    }

}

module.exports = new CatelogyController();
