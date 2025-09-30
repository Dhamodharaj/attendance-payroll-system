const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const payslipController = require("../../controllers/payslip.controller");
const payslipValidation = require("../../validations/payslip.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("managePayslips"),
    validate(payslipValidation.createPayslip),
    payslipController.createPayslip
  )
  .get(
    auth("getPayslips"),
    validate(payslipValidation.getPayslips),
    payslipController.getAllPayslips
  );

router
  .route("/:payslipId")
  .get(
    auth("getPayslips"),
    validate(payslipValidation.getPayslip),
    payslipController.getPayslip
  )
  .put(
    auth("managePayslips"),
    validate(payslipValidation.updatePayslip),
    payslipController.updatePayslip
  )
  .delete(
    auth("deletePayslips"),
    validate(payslipValidation.deletePayslip),
    payslipController.deletePayslip
  );

module.exports = router;
