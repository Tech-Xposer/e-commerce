const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const { nodeMailer } = require('../services/nodeMailer');
const VerificationCode = require('../model/verificationModel')
const User = require('../model/userModel');
const createUser = async (req, res) => {
    try {
        // const userName = req.body.name;
        // const userEmail = req.body.email;
        // const userPassword = req.body.password;
        // const userContact = req.body.contact;

        const { name, email, password, contact } = req.body;
        if(!name || !email || !password || !contact) return res.status(400).json({
            status:"FAILED",
            message:"all fields required!"
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
            const verificationLink = `http://localhost:3000/auth/activate/${verification_uuid}`;
            
            const verifyMail = {
                subject: 'Email Verification | CodeWithAsh',
                text: 'Please verify your email address with below link.',
                content: `<h2>Greetings of the day!</h2> </br><b>Please verify your email address by clicking <a href='${verificationLink}'> here</a> </br>  <h3>Thanks</h3><h3>Team CWA</h3>`
            }
            // nodeMailer(email, subject, text, content)
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

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: "All fields are required!" })
        }
        const result = await User.findById(id);
        if (result) {
            return res.status(200).json({
                status: "DONE",
                result: result
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

const getAllUsers = async (req, res) => {
    result = await User.find();
    return res.status(200).json({
        status: "SUCCESS",
        total_users: result.length,
        data: result
    })
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

const updateUser = async (req, res) => {

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
                result: result
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

module.exports = { createUser, userLogin, getUser, updateUser, deleteUser, getAllUsers }