const nodemailer=require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment=(comment)=>{
    // console.log('inside newComment mailer');
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from:'sushan14t@gmail.com',
        to: comment.user.email,
        subject:"New Comment Published!",
        // html:"<h1>Yup, your comment is now publisher</h1>"
        html:htmlString

    }, (err,info) =>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }

        console.log('message sent',info);
        return;
    })
}