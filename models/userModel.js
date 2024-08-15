const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false

    },
    mobile:{
        type: String,
        required: false,
        
    },
    type:{
        type:Number,
        require: false
    },
    token:{
        type:String,
        default:''
    }
    
});

const User = mongoose.model('User', userSchema);
module.exports = User;