const httpStatus = require("http-status");
const { BankDetails } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create bank details
 * @param {Object} bankBody
 * @returns {Promise<BankDetails>}
 */
const createBankDetails = async (bankBody) => {
  // Optional: check if bank details already exist for this emp_id or account_no
  const exists = await BankDetails.findOne({
    emp_id: bankBody.emp_id,
    account_no: bankBody.account_no,
  });
  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Bank details for this employee or account already exist!"
    );
  }

  const bankDetails = await BankDetails.create(bankBody);
  return bankDetails;
};

/**
 * Query bank details
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryBankDetails = async (filter, options) => {
  options.populate = "employeeDetails";
  options.lean = true;
  const bankDetailsList = await BankDetails.paginate(filter, options);
  return bankDetailsList;
};

/**
 * Get bank details by ID
 * @param {ObjectId} id
 * @returns {Promise<BankDetails>}
 */
const getBankDetailsById = async (id) => {
  return BankDetails.findById(id).populate("employeeDetails");
};

/**
 * Update bank details by ID
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<BankDetails>}
 */
const updateBankDetailsById = async (id, updateBody) => {
  const bankDetails = await getBankDetailsById(id);
  if (!bankDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank details not found");
  }

  // Optional: prevent duplicate account numbers for same emp_id
  if (
    updateBody.account_no &&
    (await BankDetails.findOne({
      emp_id: updateBody.emp_id || bankDetails.emp_id,
      account_no: updateBody.account_no,
      _id: { $ne: id },
    }))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Bank details with this account number already exist!"
    );
  }

  Object.assign(bankDetails, updateBody);
  await bankDetails.save();
  return bankDetails;
};

/**
 * Delete bank details by ID
 * @param {ObjectId} id
 * @returns {Promise<BankDetails>}
 */
const deleteBankDetailsById = async (id) => {
  const bankDetails = await getBankDetailsById(id);
  if (!bankDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank details not found");
  }
  await bankDetails.deleteOne();
  return bankDetails;
};

module.exports = {
  createBankDetails,
  queryBankDetails,
  getBankDetailsById,
  updateBankDetailsById,
  deleteBankDetailsById,
};
