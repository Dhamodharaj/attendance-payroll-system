const crypto = require('crypto');
const emailService = require('./email.service');
const { OTP } = require('../models');

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3; // Maximum attempts allowed

const generateOTP = async (identifier, emailId) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  // Delete existing OTP & reset attempts
  await OTP.deleteOne({ identifier });

  // Save new OTP in MongoDB with attempts reset to 0
  await OTP.create({ identifier, otp, expiresAt: new Date(Date.now() + OTP_EXPIRY), attempts: 0 });

  console.log(`Generated OTP for ${identifier}:`, otp);
  await emailService.sendEmailOTP(emailId, otp);
};

const verifyOTP = async (identifier, userOTP) => {
  const otpData = await OTP.findOne({ identifier });

  if (!otpData) return { status: false, message: 'OTP expired or not found' };

  // Check if max attempts exceeded
  if (otpData.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ identifier }); // Block further attempts
    return { status: false, message: 'Too many failed attempts. Request a new OTP.' };
  }

  // Check if OTP has expired
  if (otpData.expiresAt < new Date()) {
    await OTP.deleteOne({ identifier }); // Delete expired OTP
    return { status: false, message: 'OTP expired. Request a new one.' };
  }

  // Check if OTP matches
  if (otpData.otp !== userOTP) {
    await OTP.updateOne({ identifier }, { $inc: { attempts: 1 } }); // Increment attempts
    return { status: false, message: `Incorrect OTP. ${MAX_ATTEMPTS - (otpData.attempts + 1)} attempts remaining.` };
  }

  // OTP is correct - delete and return status
  await OTP.deleteOne({ identifier });
  return { status: true, message: 'OTP verified successfully!' };
};

module.exports = {
  generateOTP,
  verifyOTP,
};
