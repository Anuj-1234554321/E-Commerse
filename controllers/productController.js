const Product = require('../models/productModel');
const category_Controller = require('../controllers/categoryController');
const store_Controller = require('../controllers/storeController')
// const category_Controller = 
const add_product = async(req,res)=>{
    try {
       
        const productImg = [];
        for(let i = 0;i<req.files.length;i++){
            productImg[i] = req.files[i].filename;
        }

        const productData = await new  Product({
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            name:req.body.name,
            price:req.body.price,
            discount:req.body.discount,
            category_id:req.body.category_id,
            subcat_id:req.body.subcat_id,
            Images:productImg
        })
      
        const productSaved = await productData.save();
        res.status(200).send({success:true,message:"product saved successfully",data:productSaved});
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
        
    }
}
const get_products = async(req,res)=>{
    try {
        const send_data = [];
        const  cat_data = await category_Controller.get_categories();
    if(cat_data.length > 0){
        for(let i = 0;i<cat_data.length;i++){
            const product_data = [];
            const cat_id = cat_data[i]['_id'].toString();
            const cat_pro = await Product.find({category_id:cat_id});
            for(let j = 0;j<cat_pro.length;j++){
                const store_data = await store_Controller.get_store(cat_pro[j]['store_id']);
                product_data.push({
                    "product_name":cat_pro[j]['name'],
                    "Images":cat_pro[j]['Images'],
                    // "store_address":store_data[j]['address']
                })
            }
            send_data.push({
                "category_name":cat_data[i]['category'],
                "product_data":product_data
            })
        }
        res.status(200).send({success:true,message:"product get successfully",data:send_data});

    }else{
        res.status(400).send({success:false,message:"data not found"});
    }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
        
    }

}
const search_products = async(req,res)=>{
    try{
        const search = req.query.search || '';
        const searchString = String(search);
        const product_data = await Product.find({ "name": { $regex: searchString, $options: 'i' } });
        if(product_data){
            res.status(200).send({success:true,data:product_data})

        }else{
            res.status(400).send({success:false,message:"Products not found"})
        }
        

    }catch(error){
        res.status(400).send({success:false,message:error.message});
    }
}
const paginate = async (req, res) => {
    try {
        const { page = 1, sort } = req.body;
        const limit = 2; // Number of items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip

        // Aggregation pipeline stages
        const pipeline = [];

        // Stage to add a lowercased version of 'name' field for case-insensitive sorting
        pipeline.push({ $addFields: { name_lower: { $toLower: "$name" } } });

        // Stage to sort based on the provided 'sort' parameter
        if (sort === 'name') {
            pipeline.push({ $sort: { name_lower: 1 } }); // Sort by name in ascending order
        } else if (sort === '_id') {
            pipeline.push({ $sort: { _id: 1 } }); // Sort by _id in ascending order
        } else {
            pipeline.push({ $sort: { _id: 1 } }); // Default sort by _id if no valid 'sort' parameter is provided
        }

        // Stage to skip and limit results for pagination
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Execute the aggregation pipeline
        const product_data = await Product.aggregate(pipeline);

        res.status(200).json({ success: true, data: product_data });
    } catch (error) {
        
        res.status(400).json({ success: false, message: error.message });
    }
};
module.exports = {add_product,get_products,search_products,paginate}