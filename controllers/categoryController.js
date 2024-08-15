const  Category = require('../models/categoryModel');
const add_category = async(req,res)=>{
    try{

        const existingCategory = await Category.findOne({category:req.body.category})
        if(existingCategory){
            res.status(200).send({success:true,message:"Category is already exist"})

        }else{
            const category = new Category({
                category:req.body.category
            })
    
            const cat_data = await category.save()
            res.status(200).send({success:true,message:"category saved successfully"})
        }

    }catch(error){
        res.status(400).send({success:false,message:error.message});
    }
}

const get_categories = async(req,res)=>{
    try {
        return Category.find();
        
    } catch (error) {
        res.status(400).send({success: false, message:error.message});
        
    }
}
module.exports = {
    add_category, get_categories
}