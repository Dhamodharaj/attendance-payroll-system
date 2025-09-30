const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(config.email.smtp);

const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Your OTP Code',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: center;">
        <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
        <p style="font-size: 16px; color: #333;">Use the following OTP to verify your identity:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ff5722; background: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #666;">This OTP will expire in <strong>5 minutes</strong>.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = {
  sendEmailOTP,
};
