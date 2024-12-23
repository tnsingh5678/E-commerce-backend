const axios = require('axios');
require('dotenv').config();

// Shiprocket API credentials
const API_KEY = process.env.SHIPROCKET_API_KEY;
const API_SECRET = process.env.SHIPROCKET_API_SECRET;
const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';


const shiprocketApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,  
  },
});

const createOrder = async (orderDetails) => {
    try {
      const response = await shiprocketApi.post('/orders/create/adhoc', orderDetails);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
    }
};

const getShippingRates = async (shippingDetails) => {
    try {
      const response = await shiprocketApi.post('/courier/estimate', shippingDetails);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping rates:', error.response?.data || error.message);
      throw error;
    }
};

const trackShipment = async (trackingNumber) => {
    try {
      const response = await shiprocketApi.get(`/track/shipments/${trackingNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error tracking shipment:', error.response?.data || error.message);
      throw error;
    }
};

const generateLabel = async (orderId) => {
    try {
      const response = await shiprocketApi.post(`/orders/${orderId}/generate/label`);
      return response.data;
    } catch (error) {
      console.error('Error generating shipping label:', error.response?.data || error.message);
      throw error;
    }
};


module.exports= {createOrder,generateLabel,getShippingRates,trackShipment};
