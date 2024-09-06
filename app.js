if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');  //only works with post
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser("secretcode"));



main()
    .then(()=> console.log("connected to db"))
    .catch((err)=> console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderers");
}


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    // cookie options
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req,res) =>{
//     console.log("hii i am root");
// })

// use before requiring listing n review routes 
app.use(session(sessionOptions));
app.use(flash());

// single session so not login more than once need session for passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next(); 
})

app.get("/demouser" , async(req,res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "student1",
    })
    
    let registeredUser = await User.register(fakeUser , "helloworld");
    res.send(registeredUser);
})



app.use("/listings" , listingsRoute);
app.use("/listings/:id/reviews" , reviewsRoute);
app.use("/" , usersRoute);



// when no route is matched
app.all("*" , (req,res) => {
    throw new ExpressError(404 , "page not found");
})

app.use ((err,req,res,next) =>{
    let {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).render("errors.ejs" , {message});
})

const port = 8080
app.listen(port , ()=>{
    console.log(`server is listening on port ${port}`);
})