const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const employeeController = require('../../controllers/employee.controller');
const employeeValidation = require('../../validations/employee.validation');
const router = express.Router();

router
  .route('/')
  .post(auth('manageEmployees'), validate(employeeValidation.createEmployee), employeeController.createEmployee)
  .get(auth('getEmployees'), validate(employeeValidation.getEmployees), employeeController.getAllEmployees);

router
  .route('/updatePassword/:employeeId')
  .put(auth('manageEmployees'), validate(employeeValidation.updatePassword), employeeController.updatePassword);

router
  .route('/:employeeId')
  .get(auth('getEmployees'), validate(employeeValidation.getEmployee), employeeController.getEmployee)
  .put(auth('manageEmployees'), validate(employeeValidation.updateEmployee), employeeController.updateEmployee)
  .delete(auth('deleteEmployees'), validate(employeeValidation.deleteEmployee), employeeController.deleteEmployee);

module.exports = router;

