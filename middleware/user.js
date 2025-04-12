const jwt=require('jsonwebtoken');

function usermiddleware(req,res,next){
    const token=req.headers.token;
    const response=jwt.verify(token,process.env.JWT_USER_SECRET);
    if(!response){
        res.send({
            message:"You are not signed in"
        })
    }

    req.userid=response.userid;
    next();
}

module.exports={
    usermiddleware
}