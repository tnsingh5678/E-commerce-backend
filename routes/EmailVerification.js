const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Seller = require('../models/seller.js')
const express = require('express')
const router = express.Router()


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


const sendVerificationEmail = async (seller) => {
  
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  const tokenExpiry = Date.now() + 3600000; 
  seller.verificationToken = verificationToken;
  seller.tokenExpiry = tokenExpiry;
  await seller.save();

  const verificationLink = `http://yourdomain.com/verify-email?token=${verificationToken}`;

 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: seller.email,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`,
  };

  
  await transporter.sendMail(mailOptions);
};

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
  
    try {
      
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
      seller.verificationToken = undefined; 
      seller.tokenExpiry = undefined;
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

module.exports = router,{sendVerificationEmail};
  
