const express = require("express");
const { createUser, userLogin, verifyUser, userLogout } = require("../controller/userController");

const userRouter = express.Router()
;
userRouter.post('/createuser', createUser);

userRouter.post('/login', userLogin);

userRouter.delete('/logout', userLogout);

userRouter.get("/auth/activate/:uuid",verifyUser);

module.exports = userRouter 