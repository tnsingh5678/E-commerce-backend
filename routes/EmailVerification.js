const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Seller = require('../models/seller.js')// Import your Seller model
const express = require('express')
const router = express.Router()

// Setup email transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Can use other services like SMTP
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password
  },
});

// Function to send verification email
const sendVerificationEmail = async (seller) => {
  // Generate a verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  // Set expiration time for the token (e.g., 1 hour)
  const tokenExpiry = Date.now() + 3600000; // 1 hour from now
  
  // Save the token and expiry to the seller document
  seller.verificationToken = verificationToken;
  seller.tokenExpiry = tokenExpiry;
  await seller.save();

  // Create the verification link
  const verificationLink = `http://yourdomain.com/verify-email?token=${verificationToken}`;

  // Set up email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: seller.email,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
      // Find the seller by verification token
      const seller = await Seller.findOne({
        verificationToken: token,
        tokenExpiry: { $gt: Date.now() }, // Check if token is not expired
      });
  
      if (!seller) {
        return res.status(400).json({
          error: 'Invalid or expired token',
          details: 'The verification token is invalid or has expired',
        });
      }
  
      // Mark email as verified
      seller.emailVerified = true;
      seller.verificationToken = undefined; // Clear the token after successful verification
      seller.tokenExpiry = undefined; // Clear the expiry
      await seller.save();
  
      res.status(200).json({
        success: true,
        message: 'Email successfully verified. You can now log in.',
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error verifying email',
        details: error.message,
      });
    }
});

module.exports = router;
  
