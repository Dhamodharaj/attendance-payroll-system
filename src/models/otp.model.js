const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true }, // Email or Phone
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 300 }, // Auto-delete after 5 mins
  attempts: { type: Number, default: 0 }, // Track OTP attempts
});

module.exports = mongoose.model("OTP", otpSchema);
