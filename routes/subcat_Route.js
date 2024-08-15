const express = require('express');
const subcat_route = express.Router();
const bodyParser = require('body-parser');
subcat_route.use(bodyParser.json());
subcat_route.use(bodyParser.urlencoded({ extended:true}));
const auth = require('../middleware/auth')  
const sub_Controller = require('../controllers/subcat_Controller')
subcat_route.post('/sub_category',auth,sub_Controller.create_subcategory) 

module.exports = subcat_route;
