const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const paymentDataController = require("../../controllers/paymentData.controller");
const paymentDataValidation = require("../../validations/paymentData.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("managePaymentData"),
    validate(paymentDataValidation.createPaymentData),
    paymentDataController.createPaymentData
  )
  .get(
    auth("getPaymentData"),
    validate(paymentDataValidation.getPaymentData),
    paymentDataController.getAllPaymentData
  );

router
  .route("/:paymentDataId")
  .get(
    auth("getPaymentData"),
    validate(paymentDataValidation.getPaymentDataById),
    paymentDataController.getPaymentData
  )
  .put(
    auth("managePaymentData"),
    validate(paymentDataValidation.updatePaymentData),
    paymentDataController.updatePaymentData
  )
  .delete(
    auth("deletePaymentData"),
    validate(paymentDataValidation.deletePaymentData),
    paymentDataController.deletePaymentData
  );

module.exports = router;
