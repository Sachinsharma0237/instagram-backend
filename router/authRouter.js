const authRouter = require("express").Router();
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { CLIENT_ID, CLIENT_PW } = require('../config/secrets');
const passport = require("passport");

authRouter.route("/google").get( passport.authenticate('google', {scope:['email', 'profile']}), (req, res)=>{

});
authRouter.route("/callback").get( passport.authenticate('google'), (req, res)=>{
    res.redirect("http://localhost:3000/");
});
authRouter.route("/destroyCookie").get((req,res)=>{
    req.session = null;
    res.json({
        message: "Logged Out"
    })
});
authRouter.route("/checkAuth").get((req, res)=>{
    if( req.user ){
        res.json({
            message:"You're Logged In",
            user: req.user,
            isAuth: true
        })
    }else{
        res.json({
            message:"You're not Logged In",
            isAuth: false
        })
    }
});


module.exports.authRouter = authRouter;