const passport=require('passport')
const LocalStrategy= require('passport-local').Strategy;
const User=require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        // find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                // console.log('error in finding usetr --> passport')
                req.flash('error',err);
                return done(err);
            }
            if (!user || user.password != password){
                // console.log('invalid username/Password');
                req.flash('error','Invalid Username/Password');
                return done(null,false);
            }
            return done(null,user);
        })
    }

));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});


// deseralizing the user from the key in the cookises
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("error in finding user-> pasport")
            return done(err);
        }
        return done(null,user);
    })
})


passport.checkAuthentication=function(req,res,next){
    // if the user is signed in, then pass on the request to the next function controller's action
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;