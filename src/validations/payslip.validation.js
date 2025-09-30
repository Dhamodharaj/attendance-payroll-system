const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPayslip = {
  body: Joi.object().keys({
    emp_id: Joi.string().custom(objectId).required(),
    emp_name: Joi.string().required(),
    designation: Joi.string().required(),
    transaction_id: Joi.string().required(),
    bank_id: Joi.string().custom(objectId).required(),
    incentive: Joi.number().precision(3).required(),
    deduction: Joi.number().precision(3).required(),
    esi: Joi.number().precision(3).required(),
    pf: Joi.number().precision(3).required(),
    base_salary: Joi.number().precision(3).required(),
    total_salary: Joi.number().precision(3).required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    payslip_date: Joi.date().required(),
    total_work_days: Joi.number().integer().required(),
    worked_days: Joi.number().integer().required(),
    salary: Joi.number().precision(3).required(),
  }),
};

const getPayslips = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayslip = {
  params: Joi.object().keys({
    payslipId: Joi.string().custom(objectId).required(),
  }),
};

const updatePayslip = {
  params: Joi.object().keys({
    payslipId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      emp_id: Joi.string().custom(objectId).optional(),
      emp_name: Joi.string().optional(),
      designation: Joi.string().optional(),
      transaction_id: Joi.string().optional(),
      bank_id: Joi.string().custom(objectId).optional(),
      incentive: Joi.number().precision(3).optional(),
      deduction: Joi.number().precision(3).optional(),
      esi: Joi.number().precision(3).optional(),
      pf: Joi.number().precision(3).optional(),
      base_salary: Joi.number().precision(3).optional(),
      total_salary: Joi.number().precision(3).optional(),
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      payslip_date: Joi.date().optional(),
      total_work_days: Joi.number().integer().optional(),
      worked_days: Joi.number().integer().optional(),
      salary: Joi.number().precision(3).optional(),
    })
    .min(1),
};

const deletePayslip = {
  params: Joi.object().keys({
    payslipId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createPayslip,
  getPayslips,
  getPayslip,
  updatePayslip,
  deletePayslip,
};
