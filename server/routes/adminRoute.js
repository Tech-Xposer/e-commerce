const express = require("express")
const { createUser, resetPassword, deleteUser, getAllUsersDetails, getUserDetails} = require("../controller/adminController")

const adminRouter = express.Router()

adminRouter.post('/createuser', createUser)

adminRouter.get('/allusers',getAllUsersDetails)

adminRouter.route('/:id').get(getUserDetails).patch(resetPassword).delete(deleteUser)


module.exports = adminRouter 