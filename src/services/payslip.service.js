const httpStatus = require("http-status");
const { Payslip } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a payslip
 * @param {Object} payslipBody
 * @returns {Promise<Payslip>}
 */
const createPayslip = async (payslipBody) => {
  // Optional: Check if a payslip already exists for the same employee and date range
  const exists = await Payslip.findOne({
    emp_id: payslipBody.emp_id,
    start_date: payslipBody.start_date,
    end_date: payslipBody.end_date,
  });
  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payslip for this employee and date range already exists!"
    );
  }

  const payslip = await Payslip.create(payslipBody);
  return payslip;
};

/**
 * Query payslips
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryPayslips = async (filter, options) => {
  options.populate = "bankDetails"; // assuming bank_id references bankDetails collection
  options.lean = true;
  const payslipList = await Payslip.paginate(filter, options);
  return payslipList;
};

/**
 * Get payslip by ID
 * @param {ObjectId} id
 * @returns {Promise<Payslip>}
 */
const getPayslipById = async (id) => {
  return Payslip.findById(id).populate("bankDetails");
};

/**
 * Update payslip by ID
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Payslip>}
 */
const updatePayslipById = async (id, updateBody) => {
  const payslip = await getPayslipById(id);
  if (!payslip) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payslip not found");
  }

  // Optional: Prevent duplicate for same emp_id & date range
  if (
    updateBody.start_date &&
    updateBody.end_date &&
    (await Payslip.findOne({
      emp_id: updateBody.emp_id || payslip.emp_id,
      start_date: updateBody.start_date,
      end_date: updateBody.end_date,
      _id: { $ne: id },
    }))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payslip for this date range already exists!"
    );
  }

  Object.assign(payslip, updateBody);
  await payslip.save();
  return payslip;
};

/**
 * Delete payslip by ID
 * @param {ObjectId} id
 * @returns {Promise<Payslip>}
 */
const deletePayslipById = async (id) => {
  const payslip = await getPayslipById(id);
  if (!payslip) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payslip not found");
  }
  await payslip.deleteOne();
  return payslip;
};

module.exports = {
  createPayslip,
  queryPayslips,
  getPayslipById,
  updatePayslipById,
  deletePayslipById,
};
