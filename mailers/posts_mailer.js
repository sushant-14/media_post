const nodemailer=require('../config/nodemailer');

exports.newPost = (post) => {
    console.log('inside newpost mailer',post)
    let htmlString=nodemailer.renderTemplate({post:post},'/posts/new_post.ejs')

    nodemailer.transporter.sendMail({
        from:'sushan14t@gmail.com',
        to: post.user.email,
        subject: "New Post Published!",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail post',err);
            return;
        }
        console.log('message sent post',info);
        return;
    })
}