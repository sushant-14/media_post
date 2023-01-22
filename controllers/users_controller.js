const User=require('../models/user');

module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/about');
    }

    return res.render("user_sign_up",{
        title:"Sign Up | page"
    })
}

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/about');
    }
    return res.render("user_sign_in",{
        title:"Sign In | page"
    })
}

// module.exports.about=function(req,res){
//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id,function(err,user){
//             if(User){
//                 return res.render('about',{
//                     title:"about page is this",
//                     user:user
//                 })
//             }else{
//                 return res.redirect('/sign-in')
//             }
//         });
//     }else{
//         return res.redirect('/sign-in')
//     }
// }

module.exports.about=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('about',{
            title:"about page is this",
            profile_user:user
        })

    })
}

module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            req.flash('success','update name/email')
            return res.redirect('back');
        })
    }else{
        req.flash('error', 'Unauthorized!');
       return res.status(401).send('Unauthorized') ;
    }
}

// module.exports.create=function(req,res){
//     console.log(req.body);
//     User.create({
//         email:req.body.email,
//         password:req.body.password,
//         name:req.body.name
//     },function(err,signup){
//         if(err){
//             console.log(`error in sign up ${err}`)
//             return;
//         }
//         console.log("sign up:",signup)
//         return res.redirect('back')
//     })
// }
module.exports.create=function(req,res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            // console.log("error in finding user signing up");
            req.flash('error', err); 
            return
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    req.flash('error', err); 
                    // console.log('error in creating');
                    return;
                }
                return res.redirect('/users/sign-in')
            })
        }
        else{
            req.flash('success', 'You have signed up, login to continue!');
            
            return res.redirect('back')
        }
    })
}





// sign created session
// module.exports.createSession=function(req,res){
//     // STEP TO authenticate
//     // find the user
//     User.findOne({email:req.body.email},function(err,user){
//         if(err){console.log("error in finding user signin"); return}
//         // handel the user
//         if(user){
//             if(user.password != req.body.password){
//                 return res.redirect('back')
//             }
//             //  handel session
//             res.cookie('user_id',user.id)
//             return res.redirect('/about')
//         }else{
//             // handel user not found
//             return res.redirect('back')
//         }    
//     })
// }

// for passport
module.exports.createSession = function(req, res){
    req.flash('success','Looged in Successfully')
    return res.redirect('/')
}

module.exports.destroySession=function(req,res){
    // req.logout();
    // return res.redirect('/');
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','You have logged out!')
        res.redirect('/');
      });
}


