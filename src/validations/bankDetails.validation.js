const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createBankDetail = {
  body: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).required(),
    date: Joi.date().required(),
    account_no: Joi.string().required(),
    ifsc_code: Joi.string().required(),
    bank_name: Joi.string().required(),
    email_id: Joi.string().email().required(),
    branch_name: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

const getBankDetails = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBankDetail = {
  params: Joi.object().keys({
    bankDetailId: Joi.string().custom(objectId).required(),
  }),
};

const updateBankDetail = {
  params: Joi.object().keys({
    bankDetailId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      emp_id: Joi.string().custom(objectId).optional(),
      date: Joi.date().optional(),
      account_no: Joi.string().optional(),
      ifsc_code: Joi.string().optional(),
      bank_name: Joi.string().optional(),
      email_id: Joi.string().email().optional(),
      branch_name: Joi.string().optional(),
      address: Joi.string().optional(),
    })
    .min(1),
};

const deleteBankDetail = {
  params: Joi.object().keys({
    bankDetailId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createBankDetail,
  getBankDetails,
  getBankDetail,
  updateBankDetail,
  deleteBankDetail,
};
