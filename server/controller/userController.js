const session = require('express-session')
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../services/nodeMailer');
const VerificationCode = require('../model/verificationModel')
const VerifyID = require("../model/verificationModel");
const User = require('../model/userModel');
const { createToken, verifyToken } = require('../services/auth');

const createUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;
        if(!name || !email || !password || !contact) {
            return res.status(400).json({
                status:"FAILED",
                message:"all fields required!"
            })
        }
        if(password.length <8){
            return res.status(400).json({
                status:"FAILED",
                message:"Password must be atleast 8 character long!"
            })
        }
        const checkUserAlreadyRegistered = await User.findOne({email});
        if(checkUserAlreadyRegistered) return res.status(400).json({
            status:"FAILED",
            message:"user already registered!"
        })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log(`Hashed Password: ${hashedPassword}`);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            contact
        })
        console.log(`New User: ${newUser}`);
        if (newUser) {
            const verification_uuid = uuidv4();
            await VerificationCode.create({
                user_id: newUser._id,
                uuid:verification_uuid
            }) 
            const verificationLink = `http://localhost:3000/auth/activate/${verification_uuid}`;
            
            const verifyMail = {
                subject: 'Email Verification | CodeWithAsh',
                text: 'Please verify your email address with the link below.',
                content: `
                    <h2>Greetings of the day!</h2>
                    <p><b>Please verify your email address by clicking <a href='${verificationLink}'>here</a>.</b></p>
                    <p><strong>Caution:</strong> Please do not share this email with anyone for security reasons. This link is unique to your account and should not be shared.</p>
                    <p>If you did not register for an account with us, please ignore this email.</p>
                    <p><h3>Thanks,</h3><h3>Team CWA</h3></p>
                `
            }
            
            nodeMailer(email, verifyMail.subject, verifyMail.text, verifyMail.content)
            return res.status(201).json({
                status: "SUCCESS",
                message: "user created",
                data: newUser,
                verification_link:verificationLink
            })
        }
        return res.status(400).json({ msg: "bad request" })

    } catch (error) {
        return res.status(500).send('Internal Server Error: ' + error)
    }
}

const userLogin = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({
                status:"FAILED",
                message:"incorrect email"
            })
        if(!user.isVerified){
            return res.status(400).json({
                status:"FAILED",
                message:"please verify your mail first"
            })
        }
        const passwordCheck =  await bcrypt.compare(password, user.password)
        if(passwordCheck){
            const token = createToken(user._id);
            console.log('Token: ',token);
            if(token)
                return res.status(200).send({
                    status:"SUCCESSFULL",
                    message:"login successfully",
                    token:token
                })
        }
        return res.status(400).json({
            status:"FAILED",
            message:"incorrect credentials"
        })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

const userLogout = async (req,res)=>{
    if(req.session){
        req.session.destroy();
        
        res.status(200).json({
            status:"SUCCESS",
            message:"logout successfully"
        })
    }
    res.status(400).json({
        status:"FAILED",
        message:"unable to logout"
    })
}

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


module.exports = { createUser, userLogin, verifyUser, userLogout }
