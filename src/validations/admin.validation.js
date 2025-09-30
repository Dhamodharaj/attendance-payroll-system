const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { password } = require("./custom.validation");

const createAdmin = {
  body: Joi.object().keys({
    admin_id: Joi.string().optional(),
    admin_name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }),
};

const getAdmins = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId).required(),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      admin_name: Joi.string().optional(),
      username: Joi.string().optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
    })
    .min(1),
};

const changePassword = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

const deleteAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId).required(), // Validate admin ID
  }),
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
};
