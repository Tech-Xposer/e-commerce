const mongoose = require("mongoose")

const verificationSchema = mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId ,
        ref:'user',
        required:true
    },
    uuid:{
        type: String,
        requried: true,
        unique: true
    }
},{ timestamps: true } )

module.exports = mongoose.model('verification_uuid', verificationSchema)
