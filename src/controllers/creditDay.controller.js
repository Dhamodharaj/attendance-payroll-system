const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { creditDayService } = require("../services");

const createCreditDay = catchAsync(async (req, res) => {
  const creditDay = await creditDayService.createCreditDay(req.body);
  res.status(httpStatus.CREATED).send(creditDay);
});

const getAllCreditDays = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["emp_id", "isUsed", "date"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await creditDayService.queryCreditDays(filter, options);
  res.send(result);
});

const getCreditDay = catchAsync(async (req, res) => {
  const creditDay = await creditDayService.getCreditDayById(req.params.creditDayId);
  if (!creditDay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credit day not found");
  }
  res.send(creditDay);
});

const updateCreditDay = catchAsync(async (req, res) => {
  const { params, body } = req;
  const creditDay = await creditDayService.updateCreditDayById(params.creditDayId, body);
  if (!creditDay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credit day not found");
  }
  res.send(creditDay);
});

const deleteCreditDay = catchAsync(async (req, res) => {
  const creditDay = await creditDayService.deleteCreditDayById(req.params.creditDayId);
  if (!creditDay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credit day not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCreditDay,
  getAllCreditDays,
  getCreditDay,
  updateCreditDay,
  deleteCreditDay,
};
