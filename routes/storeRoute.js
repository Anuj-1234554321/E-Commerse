const express = require('express');
const store_router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
store_router.use(bodyParser.json());
store_router.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
store_router.use(express.static('public'));
const multer = require('multer');
const auth = require('../middleware/auth');
const store_Controller = require('../controllers/storeController');
const { router } = require('./userRoute');

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
store_router.post('/create_store',auth,upload.single('logo'),store_Controller.create_store)
store_router.post('/nearest_store',auth,store_Controller.nearest_store)

module.exports = store_router;