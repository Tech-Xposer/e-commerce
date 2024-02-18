const User = require("../model/userModel");
const VerifyID = require("../model/verificationModel");
const userRouter = require("../routes/userRoute");

const verifyUser = async (req,res)=>{
    const {uuid} = req.params;
    const verificationDetails = await VerifyID.findOne({uuid});
     
    if(!verificationDetails){
        return res.status(404).json({
            status:"FAILED",
            message:"already verified or invalid link"
        })
    }
    const user_id = verificationDetails.user_id;

    const result = await User.findByIdAndUpdate(user_id,{isVerified:true});
    if(result) await VerifyID.deleteOne({uuid});
    res.status(200).json({
        status:"SUCCESS",
        messgae:"user verified successfully",
        
    })
}
module.exports = {verifyUser}