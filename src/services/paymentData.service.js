const httpStatus = require("http-status");
const { PaymentData } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create payment data
 * @param {Object} paymentBody
 * @returns {Promise<PaymentData>}
 */
const createPaymentData = async (paymentBody) => {
  // Optional: Prevent duplicate for same emp_id and date range
  const exists = await PaymentData.findOne({
    emp_id: paymentBody.emp_id,
    start_date: paymentBody.start_date,
    end_date: paymentBody.end_date,
  });
  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment data for this employee and period already exists!"
    );
  }

  const paymentData = await PaymentData.create(paymentBody);
  return paymentData;
};

/**
 * Query payment data
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryPaymentData = async (filter, options) => {
  options.populate = "employeeDetails";
  options.lean = true;
  const paymentDataList = await PaymentData.paginate(filter, options);
  return paymentDataList;
};

/**
 * Get payment data by ID
 * @param {ObjectId} id
 * @returns {Promise<PaymentData>}
 */
const getPaymentDataById = async (id) => {
  return PaymentData.findById(id).populate("employeeDetails");
};

/**
 * Update payment data by ID
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<PaymentData>}
 */
const updatePaymentDataById = async (id, updateBody) => {
  const paymentData = await getPaymentDataById(id);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
  }

  // Optional: prevent duplicate entry for same emp_id and date range
  if (
    (updateBody.start_date || updateBody.end_date) &&
    (await PaymentData.findOne({
      emp_id: updateBody.emp_id || paymentData.emp_id,
      start_date: updateBody.start_date || paymentData.start_date,
      end_date: updateBody.end_date || paymentData.end_date,
      _id: { $ne: id },
    }))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment data for this employee and period already exists!"
    );
  }

  Object.assign(paymentData, updateBody);
  await paymentData.save();
  return paymentData;
};

/**
 * Delete payment data by ID
 * @param {ObjectId} id
 * @returns {Promise<PaymentData>}
 */
const deletePaymentDataById = async (id) => {
  const paymentData = await getPaymentDataById(id);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
  }
  await paymentData.deleteOne();
  return paymentData;
};

module.exports = {
  createPaymentData,
  queryPaymentData,
  getPaymentDataById,
  updatePaymentDataById,
  deletePaymentDataById,
};
