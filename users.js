const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.signUp = async(req,res) =>{
    try{
    let {username , email , password} = req.body;
    let newUser = new User({username , email});
    let registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.login(registeredUser , (err) =>{
        if(err){
           return next(err);
        }
        req.flash("success" , "Welcome to WanderLust");
        res.redirect("/listings");         
    })
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) =>{
    res.render("../views/users/login.ejs");
}

module.exports.login = async(req,res) =>{
    req.flash("success", "Welcome back to Wanderlust"); 
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next) =>{
    req.logOut((err) => {
        if(err){
            next(err);
        } 
        req.flash("success" , "succesfully logged out!");
        res.redirect("/listings");
    })
}