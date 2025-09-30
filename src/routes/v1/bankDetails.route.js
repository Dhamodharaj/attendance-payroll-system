const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const bankDetailsController = require("../../controllers/bankDetails.controller");
const bankDetailsValidation = require("../../validations/bankDetails.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageBankDetails"),
    validate(bankDetailsValidation.createBankDetail),
    bankDetailsController.createBankDetail
  )
  .get(
    auth("getBankDetails"),
    validate(bankDetailsValidation.getBankDetails),
    bankDetailsController.getAllBankDetails
  );

router
  .route("/:bankDetailId")
  .get(
    auth("getBankDetails"),
    validate(bankDetailsValidation.getBankDetail),
    bankDetailsController.getBankDetail
  )
  .put(
    auth("manageBankDetails"),
    validate(bankDetailsValidation.updateBankDetail),
    bankDetailsController.updateBankDetail
  )
  .delete(
    auth("deleteBankDetails"),
    validate(bankDetailsValidation.deleteBankDetail),
    bankDetailsController.deleteBankDetail
  );

module.exports = router;
