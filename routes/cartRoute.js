const express = require('express');
const cart_route = express.Router();
const bodyParser = require('body-parser');
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
const auth = require('../middleware/auth')
const cart_controller = require('../controllers/cartController');

cart_route.post('/add_to_cart', auth, cart_controller.add_to_cart);

module.exports = cart_route;
