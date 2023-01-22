const { render } = require('ejs');
// model.js file import
const Post= require("../models/post");
const User=require('../models/user')

// // this is the normal use way and their is a second way to use async and  await 
// module.exports.home=function(req,res){
//     // populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comments',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(function(err, posts){        
//         User.find({},function(err,users){
//             return res.render('home', {
//                 title: "Codeial | Home",
//                 posts:  posts,
//                 all_users:users
//             });
//         })
//     })
// }


// use the above comment code to async and await
module.exports.home=async function(req,res){
    try{
        // populate the user of each post
        let posts= await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
        
        let users= await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users:users
        });
        
    }catch(err){
        console.log('error',err);
        return;
    }}
    


