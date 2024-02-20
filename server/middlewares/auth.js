const { getUser, getUserMap } = require("../services/auth")

const restrictToAdminOnly = async (req,res,next)=>{
    const userUid = req.cookies.uid;
    if(!userUid){        
        return res.status(400).json({
            status:"FAILED",
            message:"please login first"
        })
    }
    const currentUser = getUser(userUid);
    if(!currentUser){  
        return res.status(400).json({
            status:"FAILED",
            message:"please login first"
        })
    }
    next();
}

const isUserAlreadyLogin = async(req,res,next)=>{
    const userUid = req.cookies.uid;

    if(getUser(userUid)){
        return res.status(400).json({
            status:"FAILED",
            message:"user already login"
        })
    }
    next();
}



module.exports = {restrictToAdminOnly, isUserAlreadyLogin}