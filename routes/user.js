const {Router}=require("express");
const { UserModel, PurchaseModel,CourseModel } = require("../db");
const userRouter=Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_USER_SECRET;    
const {usermiddleware}=require('../middleware/user');

userRouter.post('/signup',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    try{
            const existinguser=await UserModel.findOne({email:email});
            if(existinguser){
                res.status(400).send({
                    message:"user already exist"
                })

                return;
            }

            const hashedpassword=await bcrypt.hash(password,10);
            UserModel.create({
                email:email,
                password:hashedpassword
            })

            res.status(201).send({
                message:"you are signed up!"
            })
    }

    catch(err){
        console.log("signup err",err);
        res.status(400).send({
            message:"internal server error"
        })
    }
})


userRouter.post('/signin',async function(req,res){
        const email=req.body.email;
        const password=req.body.password;

        try{
            const user=await UserModel.findOne({email:email});
            if(!user){
                res.status(400).send({
                    message:"user not found"
                })
                return;
            }

            const ispassword=await bcrypt.compare(password,user.password);
            if(!ispassword){
                res.status(400).send({
                    message:"invalid password"
                })

                return;
            }


            const userid=user._id;
            const token=jwt.sign({
                userid:userid
            },JWT_SECRET);

            res.status(200).send({
                token:token,
                message:"you are signed in"
            })
        }

        catch(err){
            console.log("signin error",err);
            res.status(500).send({
                message:"internal server error"
            })
        }
})


userRouter.get('/purchase',usermiddleware,async function(req,res){
    const userid=req.userid;
    const purchasedcourses=await PurchaseModel.find({userId:userid});
    let purchasedcourseids=[];
    for(let i=0;i<purchasedcourses.length;i++){
        purchasedcourseids.push(purchasedcourses[i].courseId);
    }

    const coursesdata=await CourseModel.find({
        _id:{$in:purchasedcourseids}
    })

    res.send({
        courses:coursesdata
    })
})


module.exports={
    userRouter
}