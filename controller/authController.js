const usersDB = require("../models/usersDB.js");

module.exports.signUp = async (req,res)=>{

    // const {create_username,create_password}=req.body; 
    const Username=req.body.create_username;
    const Password=req.body.create_password;
    

    let newUser = new usersDB ({Username,Password});
    newUser.save()
     
       .catch(err =>{console.log(err);});

}


module.exports.logIn = async (req,res)=>{

    const {Username,Password}=req.body; 
    //console.log(req.body);

    let user = await usersDB.findOne({Username,Password});
   
   

    
    if(user){
       // console.log('exists', user );
        req.session.Username=Username;
        //req.session.UserID=user._id.toString();
        res.json({Username:req.session.Username})
        
    }

    else if(!user){
        console.log('doesnt exists' );
        res.json(false)
    }
}