const Post= require('../models/post');
const Comment= require('../models/comment');
const postMailer=require('../mailers/posts_mailer');
const postEmailWorker=require('../workers/post_email_worker');
const queue=require('../config/kue')
// const fs=require('fs');
// const path=require('path');

// module.exports.create=function(req,res){
//    Post.create({
//         content:req.body.content,
//         user: req.user._id
//    },function(err,post){
//     if(err){
//         console.log('error in creation a post');
//         return;
//     }
//     return res.redirect('back');
//    }); 
// }

// above code is converted into async and await
module.exports.create=async function(req,res){
    try{
        let post=await Post.create({
            content:req.body.content,
            user: req.user._id
       });
       post = await post.populate('user');
    //    postMailer.newPost(post);
       let job = queue.create('emails',post).save(function(err){
        if(err){
            console.log('error in creating a queue post',err);
            return;
        }
        console.log('job enqueued post',job.id)
       })
       if(req.xhr){
        return res.status(200).json({
            data:{
                post:post
            },
            message:'Post created!'
        });
       }

       req.flash('success','Post published')
        return res.redirect('back');

    }catch(err){
        req.flash('error',err)
        return res.redirect('back');
        // console.log('error in creation post',err)
    }  
}
// module.exports.create=async function(req,res){
//     try{
//             let post = await Post.create({
//                 content:req.body.content,
//                 avatar:req.avatar,
//                 user: req.user._id
//            });
//         //    Post.uploadAvatar(req,res,function(err){
//         //     if(err){console.log('****Multer Error b',err)}
//         //     content=req.body.content
//         //     avatar=req.avatar
//         //     user=req.user._id
//         //        if(req.file){
//         //            console.log("dds",req.file)
//         //        }

//         //    })

       
//        console.log('post',post)
//        post = await post.populate('user');
//        if(req.xhr){
//         return res.status(200).json({
//             data:{
//                 post:post
//             },
//             message:'Post created!'
//         });
//        }

//        req.flash('success','You have create a new post')
//         return res.redirect('back');

//     }catch(err){
//         req.flash('error',err)
//         return res.redirect('back');
//         // console.log('error in creation post',err)
//     }  
// }



// module.exports.destroy=function(req,res){
//     Post.findById(req.params.id,function(err,post){
//         // .id means converting the object id into string
//         if(post.user==req.user.id){
//             post.remove();

//             Comment.deleteMany({post:req.params.id},function(err){
//                 return res.redirect('back')
//             });
//         }else{
//             return res.redirect('back');
//         }
//     })
// }

// above code is converted into async and await
module.exports.destroy=async function(req,res){
    try{
        let post= await Post.findById(req.params.id);
        // .id means converting the object id into string
        if(post.user==req.user.id){
            
            post.remove();
            
            await Comment.deleteMany({post:req.params.id});

            // if(req.xhr){
            //     return res.status(200).json({
            //         data:{
            //             post_id: req.params.id
            //         },
            //         message: "Post deleted"
            //     });
            // }
            req.flash('success','Post and associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error','you cannot delete this post')
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
        // console.log('error for post controller in destroy',err)
    }
}
