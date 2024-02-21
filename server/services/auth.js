const jwt = require('jsonwebtoken');

const createToken = (_id, email, name)=>{
    return jwt.sign({
        _id
    },
    process.env.APP_SECRET,
    {expiresIn:"7d"})
}

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.APP_SECRET)
}

module.exports= {createToken, verifyToken}