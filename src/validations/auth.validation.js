const Joi = require("joi");
const { password } = require("./custom.validation");

const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    otp: Joi.string().required(),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    new_password: Joi.string().required().custom(password),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const employeeLogin = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  adminLogin,
  sendOtp,
  verifyOtp,
  changePassword,
  employeeLogin
};
