const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    model:{
        type: String,
        unique: true,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    availability:{
        type: Boolean,
        required: true
    },
    image:{
        type: String,
        required: true
    }
},
{ timestamps: true } );

module.exports = mongoose.model('product', productSchema)