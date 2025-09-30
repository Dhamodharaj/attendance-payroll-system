const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const holidayController = require('../../controllers/holiday.controller');
const holidayValidation = require('../../validations/holiday.validation');

const router = express.Router();

router
  .route('/')
  .post(auth('manageHolidays'), validate(holidayValidation.createHoliday), holidayController.createHoliday)
  .get(auth('getHolidays'), validate(holidayValidation.getHolidays), holidayController.getAllHolidays);

router
  .route('/:holidayId')
  .get(auth('getHolidays'), validate(holidayValidation.getHoliday), holidayController.getHoliday)
  .put(auth('manageHolidays'), validate(holidayValidation.updateHoliday), holidayController.updateHoliday)
  .delete(auth('deleteHolidays'), validate(holidayValidation.deleteHoliday), holidayController.deleteHoliday);

module.exports = router;
