const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer=require('../mailers/comments_mailer');
const commentEmailWorker= require('../workers/comment_email_worker');
const queue = require('../config/kue');

// module.exports.create=function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id
//             },function(err,comment){
//                 post.comments.push(comment);
//                 post.save();                 
//                 return res.redirect('/')
//             });
//         }
//     })
// }

// above code is converted into async and await
module.exports.create=async function(req,res){
    try{
        let post=await Post.findById(req.body.post)
        if(post){
            let comment= await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            post.comments.push(comment);
            post.save();
            comment=await comment.populate('user','email');
            console.log(comment);
            // commentMailer.newComment(comment);
            // comment above line and add worker 
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('error in creating a queue',err);
                    return;
                }
                console.log('job enqueued',job.id)
            });

            req.flash('success','You have create a new comment')
        
            return res.redirect('/')
        }
    }catch(err){
        req.flash('error','You have an error for creating a new comment')
       return;
        // console.log('error in comment creation',err)
        }    
}


// module.exports.destroy=function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user==req.user.id){
//             let postId=comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
//                 return res.redirect('back');    
//             })
//         }else{
//             return res.redirect('back');  
//         }
//     })
// }

// // above code is converted into async and await
module.exports.destroy=async function(req,res){
    try{
        let comment= await Comment.findById(req.params.id)
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();
            // await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
            let post= Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}})
            req.flash('success','Comments deleted!');  
           
            return res.redirect('back');    
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');  
        }

    }catch(err){
        req.flash('error',err)
        return;
        // console.log('error in comment destroy',err)
    }

   
}
