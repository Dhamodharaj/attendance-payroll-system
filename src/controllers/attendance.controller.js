const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { attendanceService } = require("../services");

const createAttendance = catchAsync(async (req, res) => {
  const attendance = await attendanceService.createAttendance(req.body);
  res.status(httpStatus.CREATED).send(attendance);
});

const createMultiple = catchAsync(async (req, res) => {
  const { data } = req.body;
  const attendance = await attendanceService.createMultiple(data);
  res.status(httpStatus.CREATED).send(attendance);
});

const workReport = catchAsync(async (req, res) => {
  const { start_date, end_date, emp_id } = req.query;
  const result = await attendanceService.workReport(
    start_date,
    end_date,
    emp_id
  );
  res.send(result);
});

const getAllAttendances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["emp_id", "date", "isAbsent"]);
  const { start_date, end_date } = req.query;
  if (start_date && end_date) {
    filter.date = {
      $gte: new Date(start_date),
      $lte: new Date(end_date),
    };
  }
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await attendanceService.queryAttendances(filter, options);
  res.send(result);
});

const getAttendance = catchAsync(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(
    req.params.attendanceId
  );
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }
  res.send(attendance);
});

const updateAttendance = catchAsync(async (req, res) => {
  const { params, body } = req;
  const attendance = await attendanceService.updateAttendanceById(
    params.attendanceId,
    body
  );
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }
  res.send(attendance);
});

const deleteAttendance = catchAsync(async (req, res) => {
  const attendance = await attendanceService.deleteAttendanceById(
    req.params.attendanceId
  );
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAttendance,
  getAllAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  createMultiple,
  workReport,
};
