
require("dotenv").config();

const path = require('path');
const express = require('express');
const app= express();
const PORT = 4700;
const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));






app.use(cors( 
    {
    origin: 'http://localhost:3000', credentials: true,
    withCredentials: true
    }
))

// app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require('mongoose');




// app.post('/',(req,res)=>{

//     console.log('here',req.body);
//     // res.send('hello');
    
// })


const session = require('express-session')
const MongoDBsession = require('connect-mongodb-session')(session);//use with session

const store = new MongoDBsession({
    uri: process.env.MONGODB_URL,
    collection: "mysessions"
});

app.use(cookieParser())

app.use(
    session({
        secret:'secret key for cookie',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie:{secure:false}
    })
);

const landingpageRouter = require('./routes/landingpage.js');
app.use('/', landingpageRouter);

app.get('/',(req,res)=>{
// res.send('hello');
})


// app.listen(PORT, () => {
//     console.log(`http://localhost:` + PORT);
// })


mongoose.connect(process.env.MONGODB_URL ,{
    //    useNewUrlParser: true,
    //    useUnifiedTopology: true,
       // useCreateIndex: true
    })
        .then(() => {
            app.listen(PORT, () => {
                console.log(`http://localhost:` + PORT);
            })
        })
        .catch(err => {console.error(err);});