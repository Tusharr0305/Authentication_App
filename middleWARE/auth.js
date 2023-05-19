// will create middlewares 
const jwt= require("jsonwebtoken");
const user = require("../models/user");
require("dotenv").config();

exports.auth= (req,res,next)=>{
    try{
        // // token can be fetched using 
        // console.log("cookie" , req.cookies.token);
        // console.log("body" , req.body.token);
        // console.log("header", req.header("Authorization"));
       
        // const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
       const token=req.body.token;
       if(!token){
        return res.status(500).json({
            sucess:false,
            message:"token is Missing"
        });
       }
       try{
        const payload= jwt.verify(token,process.env.JWT_PASSWORD);
        console.log(payload);
        req.user=payload;
       }
       catch(error){
        return res.status(500).json({
            sucess:false,
            error:error.message,
            message:`token expired`,
        });
       }
     next();
    }
    catch(error){
        return res.status(400).json({
            sucess:false,
            message:`error in finding token`
        });
    }
}

exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role !== "student"){
            return res.status(401).json({
            sucess:false,
            message:`access denied user doest match`
            });
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            sucess:false,
            message:`role is missing`
        })
    }
}

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
            sucess:false,
            message:`access denied user doest match`
            });
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            sucess:false,
            message:`role is missing`
        })
    }
}