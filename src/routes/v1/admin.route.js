const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/admin.controller');
const adminValidation = require('../../validations/admin.validation');

const router = express.Router();

router
  .route('/')
  .post(validate(adminValidation.createAdmin), adminController.createAdmin)
  .get(auth('getAdmins'), validate(adminValidation.getAdmins), adminController.getAllAdmins);

router
  .route('/changePassword/:adminId')
  .put(auth('manageAdmins'), validate(adminValidation.changePassword), adminController.changePassword);

router
  .route('/:adminId')
  .get(auth('getAdmins'), validate(adminValidation.getAdmin), adminController.getAdmin)
  .put(auth('manageAdmins'), validate(adminValidation.updateAdmin), adminController.updateAdmin)
  .delete(auth('deleteAdmins'), validate(adminValidation.deleteAdmin), adminController.deleteAdmin);

module.exports = router;
