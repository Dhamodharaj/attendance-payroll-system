const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { paymentDataService } = require("../services");

const createPaymentData = catchAsync(async (req, res) => {
  const paymentData = await paymentDataService.createPaymentData(req.body);
  res.status(httpStatus.CREATED).send(paymentData);
});

const getAllPaymentData = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "emp_id",
    "start_date",
    "end_date"
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await paymentDataService.queryPaymentData(filter, options);
  res.send(result);
});

const getPaymentData = catchAsync(async (req, res) => {
  const paymentData = await paymentDataService.getPaymentDataById(req.params.paymentDataId);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
  }
  res.send(paymentData);
});

const updatePaymentData = catchAsync(async (req, res) => {
  const { params, body } = req;
  const paymentData = await paymentDataService.updatePaymentDataById(params.paymentDataId, body);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
  }
  res.send(paymentData);
});

const deletePaymentData = catchAsync(async (req, res) => {
  const paymentData = await paymentDataService.deletePaymentDataById(req.params.paymentDataId);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPaymentData,
  getAllPaymentData,
  getPaymentData,
  updatePaymentData,
  deletePaymentData,
};
