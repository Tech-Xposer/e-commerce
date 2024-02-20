const { getUser, getUserMap } = require("../services/auth")

const restrictToAdminOnly = async (req,res,next)=>{
    const currentUser = getUser(req.cookies?.uid);
    if(!currentUser){
        
        return res.status(400).json({
            status:"FAILED",
            message:"please login first"
        })
    }
    next();
}

module.exports = {restrictToAdminOnly}