const express=require("express");
const path=require('path');
require('dotenv').config();
const db=require("./config/mongoose-connect");
const userRouter=require('./routers/userRouter');
const productRouter=require('./routers/productRouter');
const ownerRouter=require('./routers/ownerRouter');
const homeRouter=require("./routers/homeRouter");
const profileOrRegister=require("./middlewares/profileOrRegister");
const cookieParser = require("cookie-parser");
const userDetails = require("./middlewares/userDetails");

const app=express();

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser())
app.use(userDetails)
app.use(profileOrRegister)

app.use('/',homeRouter);
app.use('/user',userRouter);
app.use('/owner',ownerRouter);
app.use('/products',productRouter);

app.listen(3000,()=>{
    console.log("server is awake at 3000");
});

module.exports = app;