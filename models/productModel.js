const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    vendor_id:{
        type:String,
        required:true

    },
    store_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    category_id:{
        type:String,
        required:true

    },
    subcat_id:{
        type:String,
        required:true
    },
    Images:{
        type:Array,
        
        validate:[arrayLimit,'you can add 5 products only']
    }

})
function arrayLimit(val){
    return val.length<=5;
}
module.exports = mongoose.model('Product', productSchema);