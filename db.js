const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;
const User=new Schema({
    email:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String
})


const Admin=new Schema({
    email:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String
})

//hiii 
const Course=new Schema({
    title:String,
    description:String,
    price:Number,
    imageurl:String,
    creatorId:ObjectId
})


const Purchase=new Schema({
    courseId:ObjectId,
    userId:ObjectId
})


const UserModel=mongoose.model("users",User);
const AdminModel=mongoose.model("admins",Admin);
const CourseModel=mongoose.model("courses",Course);
const PurchaseModel=mongoose.model("purchases",Purchase);


module.exports={
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}