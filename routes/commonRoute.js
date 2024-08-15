
const express = require('express');
const count_data = express.Router();
const bodyParser = require('body-parser');
count_data.use(bodyParser.json());
count_data.use(bodyParser.urlencoded({extended:true}))
const auth = require('../middleware/auth');
const common_Controller = require('../controllers/commonController')
 

count_data.get('/count_data',auth,common_Controller.count_data);
module.exports = count_data;