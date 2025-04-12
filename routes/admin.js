const {Router}=require("express");
const { AdminModel, CourseModel } = require("../db");
const adminRouter=Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_ADMIN_SECRET;
const{ adminmiddleware }=require('../middleware/admin.js');


adminRouter.post('/signup',async function(req,res){
        const email=req.body.email;
        const password=req.body.password;

        try{
            const existingadmin=await AdminModel.findOne({email:email});

            if(existingadmin){
                res.status(400).send({
                    message:"this email already exist"
                });
                return;
            }

           const hashedpassword=await bcrypt.hash(password,10);
           await AdminModel.create({
                email:email,
                password:hashedpassword
            })

            res.status(201).send({
                message:"you are signed up!"
            });

        }

        catch(err){
            console.log("signup error",err);
            res.status(500).send({
                message:"internal server error"
            });
        }
})




adminRouter.post('/signin',async function(req,res){
       const email=req.body.email;
       const password=req.body.password;
       
       try{
            const admin=await AdminModel.findOne({
                email:email
            })

            if(!admin){
                res.status(404).jsonsend({
                    message:"no such admin found"
                })
                return;
            }

            
        const isPasswordValid = await bcrypt.compare(password, admin.password); 

        if (!isPasswordValid) {
            res.status(401).send({
                message: "invalid password"
            });
            return;
        }

            const adminid=admin._id;

            const token=jwt.sign({
                adminid:adminid
            },JWT_SECRET)

            res.status(200).send({
                token:token,
                message:"you are signed in"
            })
       }

       catch(err){
        console.log("signin error",err);
        res.send({
            message:"internal server error"
        })
       }

})



adminRouter.post('/course',adminmiddleware,async function(req,res){
        const adminid=req.adminid;
        const { title,description,price,imageurl }=req.body;
        try{
            const course=await CourseModel.create({
                title:title,
                description:description,
                price:price,
                imageurl:imageurl,
                creatorId:adminid  
            })

            res.send({
                message:"course created sucessfully",
                courseid:course._id
            })
        }

        catch(err){
            console.log("error",err);
            res.send({
                message:"could not create courses"
            })
        }
})



adminRouter.put('/course',adminmiddleware,async function(req,res){
    const adminid=req.adminid;
    const { courseId, title, description, price, imageurl } = req.body;

    try{
        const course=await CourseModel.findOne({_id:courseId,creatorId:adminid});
        if(!course){
            res.status(400).send({
                message:"No course found"
            })
            return;
        }

        course.title=title;
        course.description=description;
        course.price=price;
        course.imageurl=imageurl;

        await course.save();
        res.status(201).send({
            message:"Course updated successfully"
        })
    }

    catch(err){
        console.log("error in updating",err);
        res.status(500).send({
            message: "Could not update course"
        });
    }
})


adminRouter.get('/course/bulk', adminmiddleware, async function (req, res) {
    const adminid = req.adminid;
  
    try {
      const courses = await CourseModel.find({ creatorId: adminid });
  
      if (!courses || courses.length === 0) {
        return res.status(200).send({
          message: "You have not created any courses",
          courses: []
        });
      }
  
      res.status(200).send({
        message: "Courses fetched successfully",
        courses: courses
      });
  
    } catch (err) {
      console.error("Error fetching courses:", err);
      res.status(500).send({
        message: "Internal server error"
      });
    }
  });
  

module.exports={
    adminRouter
}
