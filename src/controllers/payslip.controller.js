const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { payslipService } = require("../services");

// Create Payslip
const createPayslip = catchAsync(async (req, res) => {
  const payslip = await payslipService.createPayslip(req.body);
  res.status(httpStatus.CREATED).send(payslip);
});

// Get All Payslips
const getAllPayslips = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "emp_id",
    "emp_name",
    "designation",
    "bank_id",
    "payslip_date"
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await payslipService.queryPayslips(filter, options);
  res.send(result);
});

// Get Single Payslip
const getPayslip = catchAsync(async (req, res) => {
  const payslip = await payslipService.getPayslipById(req.params.payslipId);
  if (!payslip) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payslip not found");
  }
  res.send(payslip);
});

// Update Payslip
const updatePayslip = catchAsync(async (req, res) => {
  const { params, body } = req;
  const payslip = await payslipService.updatePayslipById(params.payslipId, body);
  if (!payslip) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payslip not found");
  }
  res.send(payslip);
});

// Delete Payslip
const deletePayslip = catchAsync(async (req, res) => {
  const payslip = await payslipService.deletePayslipById(req.params.payslipId);
  if (!payslip) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payslip not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPayslip,
  getAllPayslips,
  getPayslip,
  updatePayslip,
  deletePayslip,
};
