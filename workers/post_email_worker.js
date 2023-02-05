const queue= require('../config/kue');

const postMailer=require('../mailers/posts_mailer');

queue.process('emails',function(job,done){
    console.log('post emails worker is processing a job',job.data);
    postMailer.newPost(job.data);
    done();
})