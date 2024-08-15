const express = require('express');
const user_router = express.Router();
const bodyParser = require("body-parser");
user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({ extended: true }));
user_router.use(express.static('public'));
const multer = require('multer');
const path = require('path');
const user_Controller = require('../controllers/userController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'),(error,success)=>{
            if(error) throw error;

       }
   )},
   filename:function(req,file,cb){
    const name = Date.now()+'-'+file.originalname;
    cb(null,name,(error,success)=>{
        if(error) throw error;
    })
   }
    
})
const upload = multer({storage: storage})
user_router.post('/register',upload.single('Image'),user_Controller.register_user );
user_router.post('/login',user_Controller.user_login);
user_router.get('/test',auth,function(req,res){
    res.status(200).json({
        success:true,message:"User authenticated successfully"
    })
})

user_router.post('/forget_password',user_Controller.forget_password);

user_router.post('/update_password',auth, user_Controller.update_password);
user_router.post('/reset_password',user_Controller.reset_password);
user_router.post('/refresh_token',auth,user_Controller.refresh_token);
module.exports = user_router;