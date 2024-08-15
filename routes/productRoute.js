const express = require('express');
const product_route = express.Router();
const bodyParser = require('body-parser');
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
product_route.use(express.static('public'));
const product_Controller = require('../controllers/productController')


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'),(error,success)=>{
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

product_route.post('/add_product',upload.array('Images'),auth,product_Controller.add_product)
product_route.get('/get_products',auth,product_Controller.get_products);
product_route.get('/search_products',auth,product_Controller.search_products);
product_route.post('/paginate',auth,product_Controller.paginate)

module.exports = product_route;