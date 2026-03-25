const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownerModel");
const userModel = require("../models/userModel");

module.exports= async function isOwner(req,res,next){
   try{ 
    if(!req.cookies.userid){
       return next();
    }
    const token = req.cookies.userid;
    
    const decoded=jwt.verify(token,process.env.JWT_KEY)
    const isOwner=await ownerModel.findOne({email:decoded.email}).select("-password")

    isOwner?
    res.locals.isOwner=isOwner:
    res.locals.isOwner=null;
    
    next();
} catch(err){
    res.locals.localData = null;
    res.locals.isOwner = false;  // <— when not logged in
    res.clearCookie("userid");
    return res.redirect('/?message=something+went+wrong&type=error');
}
};
