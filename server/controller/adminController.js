const session = require('express-session')
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../services/nodeMailer');
const VerificationCode = require('../model/verificationModel')
const User = require('../model/userModel');

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
        const hashedPassword = await bcrypt.hash(password, 10)
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
            const verificationLink = `http://localhost:3008/user/auth/activate/${verification_uuid}`;
            
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

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: "All fields are required!" })
        }
        const result = await User.findById(id);
        if (result) {
            return res.status(200).json({
                status: "SUCCESSFUL",
                result: result
            })
        }
        return res.status(400).json({
            status: "FAILED",
            message: "user not found or invalid user_id"
        })
    } catch (error) {
        return res.status(500).json({ msg: `Error: ${error.message}` })
    }
}

const getAllUsersDetails = async (req, res) => {
    result = await User.find();
    return res.status(200).json({
        status: "SUCCESS",
        total_users: result.length,
        data: result
    })
}

const resetPassword = async (req, res) => {

}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: "All fields are required!" })
        }
        const result = await User.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({
                status: "SUCCESS",
                message: "user deleted",
                result: {email:result.email, name: result.name}
            })
        }
        return res.status(400).json({
            status: "FAILED",
            message: "user not found"
        })
    } catch (error) {
        return res.status(500).json({ msg: `Error: ${error.message}` })
    }
}

const getTotalLoggedInUsers = async(req,res)=>{
    
    res.status(200).status({
        status:"SUCCESSFULL"
    });

}

module.exports = { createUser, getAllUsersDetails, resetPassword, deleteUser, getUserDetails, getTotalLoggedInUsers }
