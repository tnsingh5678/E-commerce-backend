const express = require('express');
const router = express.Router();
const { createOrder, getShippingRates, trackShipment, generateLabel } = require('./ShipRocket.js');


router.post('/create-order', async (req, res) => {
  try {
    const orderDetails = req.body;
    const order = await createOrder(orderDetails);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});


router.post('/get-shipping-rates', async (req, res) => {
  try {
    const shippingDetails = req.body;
    const rates = await getShippingRates(shippingDetails);
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipping rates', error: error.message });
  }
});


router.get('/track-shipment/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const status = await trackShipment(trackingNumber);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error tracking shipment', error: error.message });
  }
});


router.post('/generate-label/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const label = await generateLabel(orderId);
    res.status(200).json(label);
  } catch (error) {
    res.status(500).json({ message: 'Error generating label', error: error.message });
  }
});

module.exports = router;
