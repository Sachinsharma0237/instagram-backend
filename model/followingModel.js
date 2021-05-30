const { mongoose } = require("./db");

const followingSchema = mongoose.Schema({
    uid:{
        type : String,
        required : true
    },
    followId:{
        type : String,
        required : true
    },
    isAccepted:{
        type : Boolean,
        default : true
    }
})

let followingModel = mongoose.model('following', followingSchema);
module.exports.followingModel = followingModel;