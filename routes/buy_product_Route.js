const express = require('express');
const buy_product_route = express.Router();
const bodyParser = require('body-parser');
buy_product_route.use(bodyParser.json());
buy_product_route.use(bodyParser.urlencoded({ extended: true }));
const buy_product_Controller = require('../controllers/buyproductController');
const path = require('path');
const auth = require('../middleware/auth')

buy_product_route.post('/buy_product',auth,buy_product_Controller.buy_product);

module.exports = buy_product_route;