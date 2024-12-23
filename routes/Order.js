const express = require('express')
const router = express.Router()
const Product = require('../models/product.js')
const {getShippingRates,createOrder} = require('./ShipRocket.js')

router.post('/setPrice', async(req,res)=>{
    const {productId,shippingDetails} = req.body;
    const product = await Product.findById(productId)
    if(!product){
        return res.status(400).json({
            success: false,
            message: 'Item not found',
            error: error.message
        })
    }

    try{
        if(product.price>499){

            product.price = product.price * 0.9;
            await product.save();
            res.status(200).json({
                success : true,
                message: 'Discount applied and price updated successfully'
            })
        }else{

            const rates = await getShippingRates(shippingDetails);
            product.price += rates
            await product.save();
            res.status(200).json({
                success : true,
                message: 'Delivery and discount provided to user successfully'
            })
        }

    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error while ordering the item',
            error: error.message
        })
    }
})

module.exports = router