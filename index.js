const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
require('dotenv').config();

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

 
app.use('/api/v1/user',userRouter);
app.use('/api/v1/course',courseRouter);
app.use('/api/v1/admin',adminRouter);


async function main(){
    await mongoose.connect(process.env.mongoURL);
    app.listen(8000);
    console.log("listening on port 8000");
}

main();