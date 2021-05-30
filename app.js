const express = require("express");
const cookie = require("cookie-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { CLIENT_ID, CLIENT_PW } = require('./config/secrets');
const { postRouter } = require("./router/postRouter");
const { requestRouter } = require("./router/requestRouter");
const { userRouter } = require("./router/userRouter");
const userModel = require("./model/userModel");
const { authRouter } = require("./router/authRouter");
const app = express();
app.use( express.static("public") );
app.use(  express.json() );


/** Cookie-Session */
app.use( cookie({
    maxAge: 24*24*100,
    keys: ["2jkfjkaanfw349421"]
}))
app.use( passport.initialize() );
app.use( passport.session() );


/** Serialize */
passport.serializeUser( function(user, done){
    console.log("Inside Serialize User");
    done( null, user );
})
 
/** Deserialize */
passport.deserializeUser( function(user, done){
    console.log("Inside Deserialize User");
    done( null, user );
})


//----------------------------------------Passport oAuth Code-----------------------------------------//
passport.use(
    new GoogleStrategy({
    clientID:     CLIENT_ID,
    clientSecret: CLIENT_PW,
    callbackURL: "https://sachinsharma-instagram.herokuapp.com/auth/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done){
      try{
            let email = profile.email;
            let data = await userModel.find({email:email}).exec();
            if( data.length ){
                /**User Already Exist*/
                console.log("Inside Already Signed Up");
                done( null, data[0]);
            }else{
                /**User Doesn't Exist, Create User*/
                let userObject = {
                    name: profile.displayName,
                    username: profile.email,
                    email: profile.email,
                    bio: "Hello Guys, I'm New On Sachin's Instagram",
                    password:"0123456789"
                }
                let userCreated = await userModel.create(userObject);
                done(null, userCreated)
            }
      }
      catch(error){
            done( error );
      }
  }
));
//----------------------------------------Passport oAuth Code-----------------------------------------//




app.use("/api/user", userRouter);
app.use("/api/request", requestRouter);
app.use("/api/post", postRouter);
app.use("/auth", authRouter);


let port = process.env.PORT || 4000
app.listen(port, function(req, res){
    console.log(`Server Started at ${port}`);
})