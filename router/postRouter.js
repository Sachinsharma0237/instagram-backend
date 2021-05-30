const { createPost, getAllPosts, getMyPosts } = require("../controller/postController");
const postRouter = require("express").Router();
const multer = require("multer");
const path = require("path");





//----------------------**********************Multer********************------------------------------------------------------------------

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/posts')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + path.extname(file.originalname))
    }
});

const fileFilter = function(req, file, cb){
    if( file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/png" ){
        cb(null, true);
    }else{
        cb(null, false);
    }
} 

let upload = multer({ storage: storage , fileFilter : fileFilter});

//----------------------**********************Multer*****************************------------------------------------------------------------------



postRouter.route("")
.post( upload.single('post') , createPost)
.get( getAllPosts );

postRouter.route("/:uid")
.get(getMyPosts);





module.exports.postRouter = postRouter;

