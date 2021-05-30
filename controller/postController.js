const postModel = require("../model/postModel");

async function createPost(req, res){
    try{
        let postObject = req.body;

        if(req.file){
            let postPicPath = req.file.destination.substring(6) + "/" + req.file.filename;
            postObject.postImage = postPicPath;
        }     
        let postCreated = await postModel.create(postObject);

        res.json({
            message:"Successfully created post",
            postCreated
        })
    }
    catch(error){
        res.json({
            message:"Failed to create Post",
            error
        })
    }

}
async function getAllPosts(req, res){
    try{
       let allPosts = await postModel.find();
       res.json({
           message:"Successfully got all posts",
           allPosts
       })
    }
    catch(error){
        res.json({
            message:"Failed to get all posts",
            error
        })
    }
}
async function getMyPosts(req, res){
    try{
        let uid = req.params.uid;
        let posts = await postModel.find({uid:uid}).exec();
        res.json({
            message:"Successfully got all posts",
            posts
        })
    }
    catch(error){
        res.json({
            message:"Failed to get all Posts",
            error
        })
    }
}

module.exports.createPost = createPost;
module.exports.getAllPosts = getAllPosts;
module.exports.getMyPosts = getMyPosts;