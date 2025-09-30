const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { holidayService } = require("../services");

const createHoliday = catchAsync(async (req, res) => {
  const holiday = await holidayService.createHoliday(req.body);
  res.status(httpStatus.CREATED).send(holiday);
});

const getAllHolidays = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "name", "from_date", "to_date"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await holidayService.queryHolidays(filter, options);
  res.send(result);
});

const getHoliday = catchAsync(async (req, res) => {
  const holiday = await holidayService.getHolidayById(req.params.holidayId);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found");
  }
  res.send(holiday);
});

const updateHoliday = catchAsync(async (req, res) => {
  const { params, body } = req;
  const holiday = await holidayService.updateHolidayById(params.holidayId, body);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found");
  }
  res.send(holiday);
});

const deleteHoliday = catchAsync(async (req, res) => {
  const holiday = await holidayService.deleteHolidayById(req.params.holidayId);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createHoliday,
  getAllHolidays,
  getHoliday,
  updateHoliday,
  deleteHoliday,
};
