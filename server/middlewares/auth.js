const userModel = require("../model/userModel");
const { verifyToken } = require("../services/auth")

const restrictToAdminOnly = async (req, res, next) => {
    next();
}

const checkUserAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (authorization && authorization.startsWith('Bearer')) {
            const token = authorization.split(" ")[1];
            const userId = verifyToken(token)
            if (!userId) {
                return res.status(401).send({
                    status: "FAILED",
                    message: "invalid token"
                })
            }
            const user = await userModel.findById(userId._id).select('email name')
            console.log(user);
            if (!user) {
                return res.status(401).send({
                    status: "FAILED",
                    message: "user not found"
                })
            }
            req.user = user
            next();

        } else {
            return res.status(401).send({
                status: "FAILED",
                message: "please login first"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { restrictToAdminOnly, checkUserAuth }