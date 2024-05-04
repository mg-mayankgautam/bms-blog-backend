const blogDB = require("../models/blogDB.js");
const approvedblogDB = require("../models/approvedblogDB.js");
const archivedblogDB = require("../models/archivedblogDB.js");

module.exports.getBlogs =async(req,res)=>{
          try{
          let blogs = await blogDB.find({});
          //console.log(blogs)
      
          for(const blog of blogs){
             // console.log('anap',blog)
            
              const getObjectParams ={
      
                  Bucket:bucketName,
                  Key:blog.s3name,
              }
              const command = new GetObjectCommand(getObjectParams);
              var url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
              //console.log('inside array',url);
              //var propertyName = "imageurl";
             // blog[propertyName]=url;
              blog.url=url;
          }
          res.send(blogs);
          }
          catch(e){console.log(e);}
         // const client = new S3Client(clientParams);
}

module.exports.approveBlog =async(req,res)=>{
   
    const id=req.body.id;
    var name        = '';
    var text        = '';
    var title       = '';
    var s3name      = '';
    var datestring  = ''
    var publishtime = '';
    var url =''

    try{
    let blogs = await blogDB.findOneAndDelete({ _id: id })

    var name        = blogs.name;
    var text        = blogs.text;
    var title       = blogs.title;
    var s3name      = blogs.s3name;
    var datestring  = blogs.datestring
    var publishtime = blogs.publishtime
    var url = blogs.url
   // console.log(blogs,'this is from unaproved blogdb')
    }
    catch(e){console.log(e)}
   

    

    let newapprovedBlog = new approvedblogDB ({name,text,title,datestring,publishtime,s3name,url});
    newapprovedBlog.save()
       
         .catch(err =>{console.log(err);});

     

    res.redirect('/getapprovedblogs')
         

    



}

module.exports.getApprovedBlogs = async(req,res)=>{
    try{
    let approvedblogs = await approvedblogDB.find({});
    

    for(const blog of approvedblogs){
        // console.log('anap',blog)
       
         const getObjectParams ={
 
             Bucket:bucketName,
             Key:blog.s3name,
         }
         const command = new GetObjectCommand(getObjectParams);
         var url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
         //console.log('inside array',url);
         //var propertyName = "imageurl";
        // blog[propertyName]=url;
         blog.url=url;
     }


    res.send(approvedblogs);
    }
    catch(e){console.log(e)}

    
}

module.exports.archiveBlog =async(req, res)=>{
    console.log(req.body)

    const id=req.body.id;
    var name        = '';
    var text        = '';
    var title       = '';
    var s3name      = '';
    var datestring  = ''
    var publishtime = '';
    var url =''

     try{
     let blogs = await approvedblogDB.findOneAndDelete({ _id: id })

    var name        = blogs.name;
    var text        = blogs.text;
    var title       = blogs.title;
    var s3name      = blogs.s3name;
    var datestring  = blogs.datestring
    var publishtime = blogs.publishtime
    var url= blogs.url
    //     console.log(blogs,'this is from unaproved blogdb')
    }
    catch(e){console.log(e)}
   

    

     let newarchivedblog = new archivedblogDB ({name,text,title,datestring,publishtime,s3name, url});
     newarchivedblog.save()
       
        .catch(err =>{console.log(err);});

     
    res.redirect('/getarchiveblog')
         

    

}

module.exports.deletearchive= async(req,res)=>{

    console.log('yehwali id',req.body)

 var id= req.body.id
 try{
    let blogs = await archivedblogDB.findOneAndDelete({ _id: id })

 }
catch(e){console.log(e)}
  
res.redirect('/getarchiveblog');
    
}

module.exports.getArchiveBlog =async(req, res) =>{
    
    try{
        let archivedblogdata = await archivedblogDB.find({});
        
    
        res.send(archivedblogdata);}
    
        catch(e){console.log(e)}
}




const { S3Client,PutObjectCommand  } = require("@aws-sdk/client-s3");
const multer  = require('multer')
const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const crypto = require('crypto');


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {  GetObjectCommand } = require("@aws-sdk/client-s3");

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

module.exports.postBlog= async(req,res)=>{

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
  const url =''


  let newBlog = new blogDB ({name,text,title,datestring,publishtime,s3name, url});
  newBlog.save()
     
       .catch(err =>{console.log(err);});
    
}




