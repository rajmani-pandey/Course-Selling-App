const {Router}=require("express");
const courseRouter=Router();
const {usermiddleware}=require('../middleware/user');
const { PurchaseModel, CourseModel } = require("../db");

courseRouter.post('/purchase',usermiddleware,async function(req,res){
    const userid=req.userid;
    const courseId=req.body.courseid;

    try{
        const alreadypurchased=await PurchaseModel.findOne({userId:userid,courseId:courseId});
        if(alreadypurchased){
            res.send({
                message:"you have already purchased this course"
            })
            return;
        }
        await PurchaseModel.create({
            userId:userid,
            courseId:courseId
        })

        res.send({
            message:"course purchased successfully"
        })
    }

    catch(err){
        console.log("error",err);
        res.send({
            message:"internal server error"
        })
    }
})


courseRouter.get('/preview',async function(req,res){
        const courses=await CourseModel.find({});
        res.json({
            courses:courses
        })
})


module.exports={
    courseRouter
}