const { mongoose } = require("./db");

const postSchema = mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    postImage:{
        type:String,
        default:"../public/images/users/default.png",
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    likes: [ { type:String } ],
    comments: [ { uid:String, comment:String } ]
})

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;