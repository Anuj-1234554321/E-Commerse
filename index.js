const express = require('express');
const app = express();
// const router = express.Router();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
mongoose.connect("mongodb://localhost:27017/Ecom")
const userRoutes = require('./routes/userRoute');
const storeRoutes = require('./routes/storeRoute');
const categoryRoute = require('./routes/categoryRoute');
const subcategoryRoute = require('./routes/subcat_Route');
const productRoute = require('./routes/productRoute');
const commonRoute = require('./routes/commonRoute')
const cartRoute = require('./routes/cartRoute')
const addressRoute = require('./routes/addressRoute');
const buy_productRoute = require('./routes/buy_product_Route')
app.use('/api',userRoutes);
app.use('/api',storeRoutes);
app.use('/api',categoryRoute);
app.use('/api',subcategoryRoute);
app.use('/api',productRoute);
app.use('/api',commonRoute);
app.use('/api',cartRoute);
app.use('/api',addressRoute);
app.use('/api',buy_productRoute)
app.listen(PORT,function(){
    console.log(`listening on port ${PORT}`);
})
    
