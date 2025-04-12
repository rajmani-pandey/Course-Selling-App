const jwt=require('jsonwebtoken');


function adminmiddleware(req,res,next){
    const token=req.headers.token;
    const response=jwt.verify(token,process.env.JWT_ADMIN_SECRET);

    if(!response){
        res.status(400).send({
            message:"You are not sign in"
        })
    }

    req.adminid=response.adminid;
    next();

}

module.exports={
    adminmiddleware
}