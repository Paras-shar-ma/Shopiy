module.exports=async (req,res,next)=>{
    res.locals.userid=req.cookies.userid || null;
    next();
}