const { mongoose } = require("./db");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:"hey, I'm new on Instagram"
    },
    isPublic:{
        type:Boolean,
        default:true
    },
    profilePic:{
        type:String,
        default:'default.png'
    }
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
