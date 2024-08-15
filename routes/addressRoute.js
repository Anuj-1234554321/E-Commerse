const express = require('express');
const address_route =  express.Router();
const bodyParser = require('body-parser');
address_route.use(bodyParser.json());
address_route.use(bodyParser.urlencoded({ extended: true }));
const path  = require('path');
const auth = require('../middleware/auth');
const address_Controller = require('../controllers/addressController');

address_route.post('/add_address',auth,address_Controller.add_address);
module.exports = address_route;