const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPaymentData = {
  body: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).required(),
    base_salary: Joi.number().precision(3).required(),
    totalWorkHours: Joi.number().precision(3).required(),
    workedDays: Joi.number().required(),
    totalAbsent: Joi.number().required(),
    perDaySalary: Joi.number().precision(3).required(),
    salary: Joi.number().precision(3).required(),
    sundays: Joi.number().required(),
    totalDays: Joi.number().required(),
    holidayDays: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    date: Joi.date().required(),
  }),
};

const getPaymentData = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPaymentDataById = {
  params: Joi.object().keys({
    paymentDataId: Joi.string().custom(objectId).required(),
  }),
};

const updatePaymentData = {
  params: Joi.object().keys({
    paymentDataId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      emp_id: Joi.string().custom(objectId).optional(),
      base_salary: Joi.number().precision(3).optional(),
      totalWorkHours: Joi.number().precision(3).optional(),
      workedDays: Joi.number().optional(),
      totalAbsent: Joi.number().optional(),
      perDaySalary: Joi.number().precision(3).optional(),
      salary: Joi.number().precision(3).optional(),
      sundays: Joi.number().optional(),
      totalDays: Joi.number().optional(),
      holidayDays: Joi.number().optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      date: Joi.date().optional(),
    })
    .min(1),
};

const deletePaymentData = {
  params: Joi.object().keys({
    paymentDataId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createPaymentData,
  getPaymentData,
  getPaymentDataById,
  updatePaymentData,
  deletePaymentData,
};
