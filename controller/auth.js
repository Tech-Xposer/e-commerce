const User = require("../model/userModel");
const VerifyID = require("../model/verificationModel");
const userRouter = require("../routes/userRoute");

const verifyUser = async (req,res)=>{
    const {uuid} = req.params;
    const verificationDetails = await VerifyID.findOne({uuid});
    const user_id = verificationDetails.user_id
    console.log(user_id);
    const result = await User.findByIdAndUpdate(user_id,{isVerified:true})
    res.status(200).json({
        status:"SUCCESS",
        messgae:"user verified successfully",
        result:result
    })
}
module.exports = {verifyUser}