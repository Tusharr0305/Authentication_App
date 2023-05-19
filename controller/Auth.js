const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken");

require("dotenv").config();

exports.signup= async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;

        const existinguser= await User.findOne({email});
        if(existinguser){
          return res.status(400).json({
            sucess:false,
            message:`user already exists`,
          });
        }
        // console.log("")

         //secure password
         let hashedPassword;
         try{
             hashedPassword = await bcrypt.hash(password, 10);
         }
         catch(err) {
             return res.status(500).json({
                 success:false,
                 message:'Error inn hashing Password',
             });
         }
         // creating entry for new user into database
        //  const user = new User.create({name,email,password:hashedPassword,role});
        const user = await User.create({
            name,email,password:hashedPassword,role
        })
         return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });

    }
    catch(err){
        return res.status(500).json({
            sucess:false,
            error:err.message,
            message :`error in entry creation`,

        });
    }

};
exports.login =  async (req,res) => {

    try{

     const {email,password}=req.body;

     if(!email || !password){
        return res.status(500).json({
            sucess:false,
            message:` please fill details carefully`
        });
     }
     let user= await User.findOne({email});

     if(!user){
        return res.status(200).json({
            message:`user doesnt exist`,
        });
     }
    
     const payload={
        email:user.email,
        id:user._id,
        role:user.role
     };
     if(await bcrypt.compare(password,user.password)){
        //if password match hua to jwt create kerenge
       const token=jwt.sign(payload,process.env.JWT_PASSWORD,{
       expiresIn:"2h",
       });
       
       user=user.toObject();
       user.token=token;
       user.password=undefined;
       
       // for cookie process 
       const options={
        expires: new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly:true,
       }

       //sending cookiee
       //cookie ka nam fir cookie ka data fir cookie ki expiery
       res.cookie("TusharCookie",token,options).status(200).json({
       sucess:true,
       token,
       user,
       message:`user logged in sucessully`
       });

    
     
    }
    else {
        //passwsord do not match
        return res.status(403).json({
            success:false,
            // message:error.message,
            message:"Password Incorrect",
        });
    }
    }
    catch(err){
        return res.status(500).json({
            sucess:false,
            error:err.message,
            message:`error in login please try after sometime`
        });
    }

}