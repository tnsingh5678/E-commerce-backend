const express = require('express')
const router = express.Router()
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/product.js'); 

const storage = multer.memoryStorage(); // Store files in memory, will be uploaded to Cloudinary
const upload = multer({ storage: storage }).array('images', 5); // Allow up to 5 images

// Route to add a product with images
router.post('/addproduct', upload, async (req, res) => {
  try {
    const { name, price, category, rating, productId, inStockValue, soldStockValue, visibility , Description} = req.body;

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map(async (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'products', // Optional folder for better organization
          resource_type: 'image', // For image uploads
        }, (error, result) => {
          if (error) {
            reject('Error uploading image to Cloudinary');
          } else {
            resolve(result.secure_url); // Return the secure URL of the uploaded image
          }
        }).end(file.buffer); // Upload the image buffer to Cloudinary
      });
    });

    const imageUrls = await Promise.all(imageUploadPromises); // Get all image URLs

    // Create new product
    const newProduct = new Product({
      name,
      price,
      img: imageUrls, // Store the URLs of the uploaded images
      category,
      rating,
      productId,
      inStockValue,
      soldStockValue,
      visibility,
      Description
    });

    await newProduct.save();

    res.status(200).json({
      success: true,
      message: 'Product added successfully with images',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message,
    });
  }
});

router.post('/deleteProduct', async(req,res)=>{
    const {productId} = req.body;
    try{
        const product = await Product.findByIDAndDelete(productId);
        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Item not found',
                error: error.message
            })
        }
        res.status(200).json()({
            success: true,
            message: 'Item deleted seccessfully'
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error while deleting the product',
            error: error.message,
        })
    }
})

module.exports = router;

