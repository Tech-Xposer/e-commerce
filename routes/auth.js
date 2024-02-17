const express = require('express');
const { verifyUser } = require('../controller/auth');

const authRouter = express.Router();

authRouter.get("/activate/:uuid",verifyUser);

module.exports = authRouter