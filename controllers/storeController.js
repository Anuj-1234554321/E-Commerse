
const Store = require('../models/storeModel')
const User = require('../models/userModel');

create_store = async(req,res)=>{
    try {
       
       const userData = await User.findOne({ _id: req.body.vendor_id });
      
      
       
        if(userData){
           
            if(!req.body.latitude || !req.body.longitude){
                res.status(200).send({success:false,message:"please enter latitude and longitude"});

            }else{
                const vendorData = await Store.findOne({vendor_id:req.body.vendor_id})
                if(vendorData){
                    res.status(200).send({success:false,message:" the vendor id is already exist"})

                }else{
                    const store = new Store({
                        vendor_id:req.body.vendor_id,
                        logo:req.file.filename,
                        business_email:req.body.business_email,
                        address:req.body.address,
                        pin:req.body.pin,
                        location:{
                            type:"Point",
                            coordinates:[parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
                        }
                    })
                    const savedStore = await store.save()
                    res.status(200).send({success:true,message:"the data is successfully stored ",data:savedStore});

                }
            }

        }else{
            res.status(200).send({succeess:false,message:"Vendor _id id not exist"});
        }
        
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
        
    }

}
const get_store = (id)=>{
    try {
        return Store.find({_id:id})
        
    } catch (error) {
        res.status(400).send({success: false, message:error.message});
        
    }
}
const nearest_store = async(req,res)=>{
    const latitude = req.body.longitude;
    const longitude = req.body.latitude;
    const store_data = await Store.aggregate([{
        $geoNear:{ 
            near:{type:"Point",coordinates:[parseFloat(latitude),parseFloat(longitude)]},
            key:"location",
            maxDistance:parseFloat(1000)*1609,
            distanceField:"dist.calculated",spherical:true
        }
    }]);
    res.status(200).send({success:true,message:"nearest location",data:store_data});


}
module.exports = {
    create_store,get_store,nearest_store
}