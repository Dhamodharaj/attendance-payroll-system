const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/admin-login', validate(authValidation.adminLogin), authController.adminLogin);
router.post('/employee-login', validate(authValidation.employeeLogin), authController.employeeLogin);
router.post('/sendOtp', validate(authValidation.sendOtp), authController.sendOtp);
router.post('/verifyOtp', validate(authValidation.verifyOtp), authController.verifyOtp);
router.post('/changePassword', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;

