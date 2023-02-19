const express=require('express');
const env= require('./config/environment');
const logger=require('morgan');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app=express();
const port= process.env.port;
// set layout
const ejsLayout=require('express-ejs-layouts');

// set database and model
const db=require('./config/mongoose')
// user for session cookies
const session = require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport.google.oauth2-strategy');
// not use the session beacause update is are and goto session part on this page
const MongoStore=require('connect-mongo');
const model=require('./models/user');
const kue=require('kue');
// setting sass
const sassMiddleware=require('node-sass-middleware');   

const flash=require('connect-flash');
const customMware=require('./config/middleware');

// setup the chat serer to be used with socket.io
const chatServer=require('http').Server(app);
const chatScokets=require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listing on port 5000');

const path = require('path');

// setting sass
// for development mode we need to run sass middle ware
if(env.name=='development'){
    app.use(sassMiddleware({
        // src:'./assests/scss',
        src:path.join(__dirname,env.assest_path,'scss'),
        // dest:'./assests/css',
        dest:path.join(__dirname,env.assest_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }))
}


// app.use(express.urlencoded());

app.use(cookieParser())

// cut the assests and use in the enviormnent for config
// app.use(express.static('./assests'));
app.use(express.static(env.assest_path));


// make the upload path avialable to browser avatar
app.use('/uploads',express.static(__dirname +'/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options))
// use layout
app.use(ejsLayout);

// extract style and script for differnt sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// main is routing and use
// const router=require('./routes/index')

app.use(bodyParser.urlencoded({extended:false}));


// set engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name:'Codial',
    secret: env.session_cookie_key,
    // secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    // remove new and add .create and mongoURL
    store:MongoStore.create(
        {
            // mongoUrl add and locate the path from mongoose.js
            mongoUrl:`mongodb://localhost/${env.db}`,
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok')
        }
        
    )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setflash);
// app.use('/',router);
app.use('/',require('./routes'));



app.listen(port,function(err){
    if(err){
        console.log(`error in routing ${err}`)
        return;
    }
    console.log(`server is running on port ${port}`);
});


kue.app.listen(4000);