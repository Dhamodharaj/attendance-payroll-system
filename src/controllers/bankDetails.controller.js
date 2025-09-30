const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { bankDetailsService } = require("../services");

const createBankDetail = catchAsync(async (req, res) => {
  const bankDetail = await bankDetailsService.createBankDetails(req.body);
  res.status(httpStatus.CREATED).send(bankDetail);
});

const getAllBankDetails = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["emp_id", "bank_name", "branch_name"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await bankDetailsService.queryBankDetails(filter, options);
  res.send(result);
});

const getBankDetail = catchAsync(async (req, res) => {
  const bankDetail = await bankDetailsService.getBankDetailsById(req.params.bankDetailId);
  if (!bankDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank detail not found");
  }
  res.send(bankDetail);
});

const updateBankDetail = catchAsync(async (req, res) => {
  const { params, body } = req;
  const bankDetail = await bankDetailsService.updateBankDetailsById(params.bankDetailId, body);
  if (!bankDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank detail not found");
  }
  res.send(bankDetail);
});

const deleteBankDetail = catchAsync(async (req, res) => {
  const bankDetail = await bankDetailsService.deleteBankDetailsById(req.params.bankDetailId);
  if (!bankDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank detail not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBankDetail,
  getAllBankDetails,
  getBankDetail,
  updateBankDetail,
  deleteBankDetail,
};
