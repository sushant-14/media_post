const { session } = require("passport")
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
            pass:'xbnsxlhebiuowjjb'
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

const production={
    name:'production',
    assest_path:process.env.CODIAL_ASSET_PATH,
    // session_cookie_key:'5yoRvBiUKexcoigRKk26FqDzc44X8fpg',
    session_cookie_key:process.env.codeial_session_cookie,
    db:process.env.codeial_database,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.codeial_mail,
            pass:process.env.codeial_password
        }
    },
    google_client_id:process.env.codeial_google_client_id,
    google_client_secret:process.env.codeial_google_client_secret,
    google_callback_url:process.env.codeial_google_callback_url,
    jwt_secret:process.env.codeial_jwt_secret,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}


// module.exports = development;
// agr ye undefined ho rha hai too isko development kr do nhi too codeail production hone do
module.exports=eval(process.env.codeial_environment) == undefined ? development : eval(process.env.codeial_environment)


// If you are using windows OS you can directly use dotenv npm package 
// for using environment variables.      
// for installing npm type on terminal npm install dotenv.      
// after installation add inside index.js on top of everything 
// require('dotenv').config();.     
//  Now create a file on root folder named .env there is dot
//   before env.      Now you can add environment variables inside that file.   
// for access it write process.env.Variable_name.  
//  make sure it should not have comma at the end.

// for any more information you can check out there official website - dotenv npm