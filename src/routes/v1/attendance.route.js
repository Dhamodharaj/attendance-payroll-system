const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const attendanceController = require("../../controllers/attendance.controller");
const attendanceValidation = require("../../validations/attendance.validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageAttendance"),
    validate(attendanceValidation.createAttendance),
    attendanceController.createAttendance
  )
  .get(
    auth("getAttendance"),
    validate(attendanceValidation.getAttendances),
    attendanceController.getAllAttendances
  );

router
  .route("/createMultiple")
  .post(
    auth("manageAttendance"),
    validate(attendanceValidation.createMultiple),
    attendanceController.createMultiple
  );

router
  .route("/workReport")
  .get(
    auth("getAttendance"),
    validate(attendanceValidation.workReport),
    attendanceController.workReport
  );

router
  .route("/:attendanceId")
  .get(
    auth("getAttendance"),
    validate(attendanceValidation.getAttendance),
    attendanceController.getAttendance
  )
  .put(
    auth("manageAttendance"),
    validate(attendanceValidation.updateAttendance),
    attendanceController.updateAttendance
  )
  .delete(
    auth("deleteAttendance"),
    validate(attendanceValidation.deleteAttendance),
    attendanceController.deleteAttendance
  );

module.exports = router;
