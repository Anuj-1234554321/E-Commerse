const Address = require('../models/addressModel');

const add_address = async(req,res)=>{
    try{
        const data = await Address.findOne({user_id:req.body.user_id});
        if(data){
            const add_address = [];
            for(let i = 0;i<data.address.length;i++){
                add_address.push(data.address[i]);
            }
            add_address.push(req.body.address);
            const updated_data = await Address.findOneAndUpdate({user_id:req.body.user_id},{$set:{address:add_address}},
                {returnDocument:"after"}
            );
            res.status(200).send({success:true,message:"Address updated successfully",data:updated_data});

        }else{
            const address_data = await new Address({
                user_id:req.body.user_id,
                address:req.body.address
            })
            const address_saved = await address_data.save();
            res.status(200).send({success:true,message:"Address saved successfully",data:address_saved});   

        }
       

    }catch(error){
        res.status(400).send({success:false,message:error.message});

    }

}
module.exports = {add_address}