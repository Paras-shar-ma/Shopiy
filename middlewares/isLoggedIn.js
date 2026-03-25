const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');

module.exports= async (req,res,next)=>{
    if(!req.cookies.userid){
        return res.redirect("/register?message=You+are+not+logged+in&type=error");
    }

    try{
        let decoded=jwt.verify(req.cookies.userid,process.env.JWT_KEY);

        const isOwner=await ownerModel.findOne({email:decoded.email})
        const Model=isOwner?ownerModel:userModel;
        let user=await Model.findOne({email:decoded.email})
        .select("-password");
        req.user=user;
        next();
    }catch(err){
        res.clearCookie("userid");
        return res.redirect('/?message=something+went+wrong&type=error');
    }
}