/** CRUD =================>>>>>>>>>>>>>>>>> Create Read Update Delete */
const userModel = require("../model/userModel");

async function createUser(req, res){
    try{
        let userObject = req.body;
        if(req.file){
            let profilePicPath = req.file.destination.substring(6) + "/" + req.file.filename;
            userObject.profilePic = profilePicPath;
        } 
        let userCreated = await userModel.create(userObject);
        res.json({
            message:"User Created Successfully",
            userCreated
        })
    }
    catch(error){
        res.json({
            message:"Failed to create user",
            error
        })
    }
}

async function getUserById(req, res){
    try{
        let uid = req.params.uid;
        let user = await userModel.findById(uid);
        res.json({
            message:"Got User Successfully !!!",
            user
        })
    }
    catch(error){
        res.json({
            message:"Failed to get user",
            error
        })
    }
}

async function updateUserById(req, res){
    try{
        let uid = req.params.uid;
        let updateObject = req.body;
        let user = await userModel.findById(uid);
        for(let key in updateObject){
            user[key] = updateObject[key];
        }
        if(req.file){
            let profilePicPath = req.file.destination.substring(6) + "/" + req.file.filename;
            user.profilePic = profilePicPath;
        } 
        let updatedUser = await user.save();
        res.json({
            message:"User Updated Successfully",
            updatedUser
        })
    }
    catch(error){
        res.json({
            message:"Failed to update user",
            error
        })
    }
}

async function deleteUserById(req, res){
    try{
        let uid = req.params.uid;
        let deletedUser = await userModel.findByIdAndDelete(uid);
        res.json({
            message:"User Deleted Successfully !!!",
            deletedUser
        })
    }
    catch(error){
        res.json({
            message:"Failed to delete user",
            error
        })
    }
}

async function getAllUsers(req, res){
    try{
        let allUsers = await userModel.find();
        res.json({
            message:"Successfully Got All Users",
            allUsers
        })
    }
    catch(error){
        res.json({
            message:"Failed to Get All Users",
            error
        })
    }
}


module.exports.createUser = createUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
module.exports.deleteUserById = deleteUserById;
module.exports.getAllUsers = getAllUsers;