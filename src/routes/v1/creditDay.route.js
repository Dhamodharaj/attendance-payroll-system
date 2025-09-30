const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const creditDayController = require("../../controllers/creditDay.controller");
const creditDayValidation = require("../../validations/creditDay.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageCreditDays"),
    validate(creditDayValidation.createCreditDay),
    creditDayController.createCreditDay
  )
  .get(
    auth("getCreditDays"),
    validate(creditDayValidation.getCreditDays),
    creditDayController.getAllCreditDays
  );

router
  .route("/:creditDayId")
  .get(
    auth("getCreditDays"),
    validate(creditDayValidation.getCreditDay),
    creditDayController.getCreditDay
  )
  .put(
    auth("manageCreditDays"),
    validate(creditDayValidation.updateCreditDay),
    creditDayController.updateCreditDay
  )
  .delete(
    auth("deleteCreditDays"),
    validate(creditDayValidation.deleteCreditDay),
    creditDayController.deleteCreditDay
  );

module.exports = router;
