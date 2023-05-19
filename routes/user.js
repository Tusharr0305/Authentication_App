const express= require("express");
const router=express.Router();

const {signup,login}= require("../controller/Auth");
const {auth,isStudent,isAdmin}=require("../middleWARE/auth")

router.post("/signup",signup);
router.post("/login",login);

router.get("/auth",auth,(req,res)=>{
    res.status(500).json({
    sucess:true,
    message:`welcome to test route`
    });
})

router.get("/student",auth,isStudent,(req,res)=>{
    res.status(500).json({
    sucess:true,
    message:`welcome to student section`
    });
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.status(500).json({
    sucess:true,
    message:`welcome to  Admin section`
    });
})
module.exports=router;
