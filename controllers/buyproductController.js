const BuyProduct = require('../models/buy_product_Model');

const buy_product = async (req, res) => {
    try {
        const { product_id,transaction_id,vendor_id,store_id,customer_id} = req.body;
        const product_data = new BuyProduct({
            product_id,
            transaction_id,
            vendor_id,
            store_id,
            customer_id
        });

        const productSaved = await product_data.save();

        
        res.status(200).send({ success: true, message: "Buy product Details", data: productSaved });
    } catch (error) {
       
        res.status(400).send({ success: false, message: error.message });
    }
}

module.exports = { buy_product };
