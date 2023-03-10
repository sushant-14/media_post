const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const development={
    name:'development',
    assest_path:'./assests',
    session_cookie_key:'blahsomething',
    db:'deve_passport_del',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user: 'sushan14t@gmail.com',
            pass: 'gvifhvwwyzgldjpi'
        }
    },
    google_client_id:"751492571518-sk9sud1ebedkprngl80pomrs0vr9uig0.apps.googleusercontent.com",
    google_client_secret:'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',
    google_callback_url:'http://localhost:8007/users/auth/google/callback',
    jwt_secret:'codeial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }   
}


module.exports=development;