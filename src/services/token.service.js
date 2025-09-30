const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
//const storeService = require('./store.service');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};




/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyOtpToken = async (token, type) => {
  const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (id) => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};


const verifyResetPasswordToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (payload.type !== tokenTypes.RESET_PASSWORD) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    const tokenDoc = await Token.findOne({
      token,
      type: tokenTypes.RESET_PASSWORD,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found or blacklisted');
    }
    return payload.sub;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
};



/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
/* const generateStoreResetPasswordToken = async (email) => {
  const store = await storeService.getStoreByEmail(email);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No stores found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(store.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, store.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};
 */
/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

/**
 * Generate verify otp token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyOtpToken = async (user) => {
  const expires = moment().add(config.verifyOtpExpirationMinutes, 'minutes');
  const otpToken = Math.floor(100000 + Math.random() * 900000);
  await saveToken(otpToken, user.id, expires, tokenTypes.VERIFY_OTP);
  return otpToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  verifyOtpToken,
  generateAuthTokens,
  generateResetPasswordToken,

  generateVerifyEmailToken,
  generateVerifyOtpToken,
  verifyResetPasswordToken
};
