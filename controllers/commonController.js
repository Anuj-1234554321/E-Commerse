const Product = require('../models/productModel');
const User = require('../models/userModel');
const Store = require('../models/storeModel');
const Category   = require('../models/categoryModel');
const subCategory  = require('../models/categoryModel'); 


const count_data = async(req,res)=>{
    const count_data = [];
    try{
        const product_data =await Product.find().count();
        const vendor_data = await User.find({type:1}).count();
        const store_data = await Store.find().count();
        const category_data = await Category.find().count();
        const subcategory_data = await subCategory.find().count();

        count_data.push({
           product:product_data,
           vendor:vendor_data,
           store:store_data,
           category:category_data,
           subcategory:subcategory_data
        })
        res.status(200).send({success:true,message:"data fetched successfully",data:count_data});

    }catch(error){
        res.status(400).send({success:false,message:error.message});
    }

}
module.exports = {count_data};