const express = require('express');
const category_route = express.Router();
const category_Controller = require('../controllers/categoryController');
const bodyParser = require('body-parser');
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({ extended: true }));

const auth = require('../middleware/auth')
category_route.post('/add_category',auth,category_Controller.add_category)
module.exports = category_route