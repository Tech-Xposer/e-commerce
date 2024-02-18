const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        requried: true,
        unique: true
    },
    password:{
        type:String,
        requried:true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    contact:{
        type:Number,
        requried:true
    }
},{ timestamps: true } )

module.exports = mongoose.model('user', userSchema)