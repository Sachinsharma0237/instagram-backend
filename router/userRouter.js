const { createUser, getUserById, updateUserById, deleteUserById, getAllUsers } = require("../controller/userController");
const userRouter = require("express").Router();
const multer = require("multer");
const path = require("path");

//----------------------**********************Multer********************------------------------------------------------------------------

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/users')
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





userRouter.route("")
.post( upload.single('photo'), createUser)
.get( getAllUsers );



userRouter.route("/:uid")
.get(getUserById)
.patch( upload.single('photo'), updateUserById)
.delete(deleteUserById);


module.exports.userRouter = userRouter;
