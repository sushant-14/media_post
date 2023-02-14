const mongoose = require('mongoose');

// const multer = require('multer');
// const path= require('path');
// const AVATAR_PATH = path.join('/uploads/posts/avatars')

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    // avatar:{
    //     type:String
    // },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // include the array of ids of all comments in this post schema itself
    comments:
        {
            type:[mongoose.Schema.Types.ObjectId],
            ref:'Comment'
        }
    ,
    // add likes for 
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
},{
    timestamps:true
})

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,"..",AVATAR_PATH))
//     },
//     filename:function(req,file,cb){
//         const uniqueSuffix=Data.now()+'-'+Math.round(Math.random() *1E9)
//         cb(null,file.fieldname+'-'+uniqueSuffix)
//     }
// });



// postSchema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
// postSchema.statics.avatarPath=AVATAR_PATH;

const Post=mongoose.model('Post',postSchema)
module.exports=Post;