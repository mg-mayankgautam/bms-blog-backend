
require("dotenv").config();

//require { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
//const S3Client = require('S3Client')
const { S3Client,PutObjectCommand  } = require("@aws-sdk/client-s3");
const multer  = require('multer')
const path = require('path');
const express = require('express');
const app= express();
const PORT = 4700;
const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const crypto = require('crypto');


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {  GetObjectCommand } = require("@aws-sdk/client-s3");



const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

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



const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


const blogDB = require("./models/blogDB.js");
const approvedblogDB = require("./models/approvedblogDB.js");

app.post('/blogdata', upload.single('image'),async(req,res)=>{

    console.log('here',req.body);
    console.log('here',req.file);
    // res.send('hello');

    const fileName = generateFileName();
  
    const uploadParams = {
    Bucket: bucketName,
    Body: req.file.buffer,
    Key: fileName,
    ContentType: req.file.mimetype
  }

  // Send the upload to S3
  await s3Client.send(new PutObjectCommand(uploadParams));

  const name = req.body.name;
  const text = req.body.text;
  const title = req.body.title;
  const datestring = req.body.datestring
  const publishtime = req.body.publishtime
  const s3name = fileName;


  let newBlog = new blogDB ({name,text,title,datestring,publishtime,s3name});
  newBlog.save()
     
       .catch(err =>{console.log(err);});
    
})
//blogs-bucket-demo

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

app.get('/getblogs', async(req,res)=>{

    console.log('idhrrrrrrrrrrrrr')
    try{
    let blogs = await blogDB.find({});
    console.log(blogs)

    for(const blog of blogs){
        console.log('anap',blog)
      
        const getObjectParams ={

            Bucket:bucketName,
            Key:blog.s3name,
        }
        const command = new GetObjectCommand(getObjectParams);
        var url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('inside array',url);
        var propertyName = "imageurl";
        blog[propertyName]=url;
        //blog.text=url;
    }
    res.send(blogs);
}
catch(e){console.log(e);}
   // const client = new S3Client(clientParams);
    



    
})


app.post('/approveblog',async(req,res)=>{
   
    const id=req.body.id;
    var name        = '';
    var text        = '';
    var title       = '';
    var s3name      = '';
    var datestring  = ''
    var publishtime = '';

    try{
    let blogs = await blogDB.findOneAndDelete({ _id: id })

    var name        = blogs.name;
    var text        = blogs.text;
    var title       = blogs.title;
    var s3name      = blogs.s3name;
    var datestring  = blogs.datestring
    var publishtime = blogs.publishtime
    console.log(blogs,'this is from unaproved blogdb')
}
    catch(e){console.log(e)}
   

    

    let newapprovedBlog = new approvedblogDB ({name,text,title,datestring,publishtime,s3name});
    newapprovedBlog.save()
       
         .catch(err =>{console.log(err);});

     

    res.redirect('/getapprovedblogs')
         

    



})


app.get('/getapprovedblogs', async(req,res)=>{

    let approvedblogs = await approvedblogDB.find({});
    

    res.send(approvedblogs);
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