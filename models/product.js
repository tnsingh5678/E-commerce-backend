const mongoose = require('mongoose');

const DescriptionSchema = new mongoose.Schema({
  title: String,
  Manufacturer : {type: String},
  manufacturingDate : {type: Date},
  warranty: { type: Number, required: true }, // taking in months
  Certifications : {type: String},
  
}) 


const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  category: String,
  rating: Number,
  productId: { type: String, unique: true }, // Added productId field
  inStockValue: Number, // Available stock value
  soldStockValue: Number, // Number of items sold
  visibility: { type: String, default: 'on' }, // Visibility field with default 'on'
  Description: { type: DescriptionSchema, required:true}
},{timestamps:true});



const Product = mongoose.model('Product', productSchema);
module.exports = Product;