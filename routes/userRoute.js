const express = require("express")
const { createUser, userLogin, getUser, updateUser, deleteUser, getAllUsers } = require("../controller/userController")

const userRouter = express.Router()

userRouter.post('/createuser', createUser)

userRouter.post('/login',userLogin)

userRouter.get('/allusers',getAllUsers)

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)


module.exports = userRouter 