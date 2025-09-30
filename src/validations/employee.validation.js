const Joi = require("joi");
const { objectId } = require("./custom.validation"); // Ensure custom validation for object IDs
const { password } = require("./custom.validation");
const { BankDetails } = require("../models");

const createEmployee = {
  body: Joi.object().keys({
    employee_name: Joi.string().required(),
    address: Joi.string().optional(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    contact_no: Joi.string().required(),
    designation: Joi.string().optional(),
    about: Joi.string().optional(),
    socialMedia: Joi.array().items(
      Joi.object().keys({
        handle: Joi.string().required(),
        url: Joi.string().required(),
      })
    ),
    dob: Joi.date().optional(),
    status: Joi.number().default(1).optional(),
    base_salary: Joi.number().optional(),
    email: Joi.string().email().required(),
    blood_group: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "B")
      .optional()
      .allow(null, ""),
    join_date: Joi.date().optional(),
    bankDetail_id: Joi.string().custom(objectId).optional(),
  }),
};

const getEmployees = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId).required(),
  }),
};

const updateEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId).required(), // Validating employee ID in params
  }),
  body: Joi.object()
    .keys({
      employee_name: Joi.string().optional(),
      address: Joi.string().optional(),
      username: Joi.string().optional(),
      contact_no: Joi.string().optional(),
      designation: Joi.string().optional(),
      about: Joi.string().optional(),
      socialMedia: Joi.array().items(
        Joi.object().keys({
          handle: Joi.string().required(),
          url: Joi.string().required(),
        })
      ),
      dob: Joi.date().optional(),
      status: Joi.number().default(1).optional(),
      email: Joi.string().email().optional(),
      base_salary: Joi.number().optional(),
      blood_group: Joi.string()
        .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "B")
        .optional()
        .allow(null, ""),
      join_date: Joi.date().optional(),
      emp_id: Joi.string().custom(objectId),
      bankDetail_id: Joi.string().custom(objectId).optional(),
    })
    .min(1), // At least one field must be present for update
};

const deleteEmployee = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId).required(), // Validating employee ID
  }),
};

const updatePassword = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId).required(), // Validating employee ID in params
  }),
  body: Joi.object()
    .keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    })
    .min(1),
};

module.exports = {
  updatePassword,
  createEmployee,
  updateEmployee,
  getEmployee,
  getEmployees,
  deleteEmployee,
};
