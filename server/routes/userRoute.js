const express = require("express")
const { createUser, userLogin,loadLoginPage, verifyUser, userLogout } = require("../controller/userController")

const userRouter = express.Router()

userRouter.post('/createuser', createUser)

userRouter.route('/login').get(loadLoginPage).post(userLogin)

userRouter.delete('/logout', userLogout)

userRouter.get("/auth/activate/:uuid",verifyUser);

module.exports = userRouter 