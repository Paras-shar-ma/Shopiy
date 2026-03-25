const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');

module.exports= async (req,res,next)=>{
    if(!req.cookies.userid){
       return next();
    }

    try{
        let decoded=jwt.verify(req.cookies.userid,process.env.JWT_KEY);

        const isOwner=await ownerModel.findOne({email:decoded.email})
        const Model=isOwner?ownerModel:userModel;
        let user=await Model.findOne({email:decoded.email})
        .select("-password");
        req.details=user;
        res.locals.localData=user;
        req.model=Model;
        next();
    }catch(err){
        res.locals.localData=null
        return res.redirect('/?message=something+went+wrong&type=error');
    }
}