const httpStatus = require("http-status");
const { CreditDay } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a credit day
 * @param {Object} creditDayBody
 * @returns {Promise<CreditDay>}
 */
const createCreditDay = async (creditDayBody) => {
  // Optional: check if credit day already exists for this emp_id and date
  const exists = await CreditDay.findOne({
    emp_id: creditDayBody.emp_id,
    date: creditDayBody.date,
  });
  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Credit day for this employee and date already exists!"
    );
  }

  const creditDay = await CreditDay.create(creditDayBody);
  return creditDay;
};

/**
 * Query credit days
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryCreditDays = async (filter, options) => {
  options.lean = true;
  // If you want to populate employee details, you can add:
  // options.populate = "employeeDetails";
  const creditDaysList = await CreditDay.paginate(filter, options);
  return creditDaysList;
};

/**
 * Get a credit day by ID
 * @param {ObjectId} id
 * @returns {Promise<CreditDay>}
 */
const getCreditDayById = async (id) => {
  return CreditDay.findById(id); // optionally populate employee details
};

/**
 * Update a credit day by ID
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<CreditDay>}
 */
const updateCreditDayById = async (id, updateBody) => {
  const creditDay = await getCreditDayById(id);
  if (!creditDay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credit day not found");
  }

  // Optional: prevent duplicate for same emp_id and date
  if (
    updateBody.emp_id || updateBody.date
  ) {
    const duplicate = await CreditDay.findOne({
      emp_id: updateBody.emp_id || creditDay.emp_id,
      date: updateBody.date || creditDay.date,
      _id: { $ne: id },
    });
    if (duplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Credit day for this employee and date already exists!"
      );
    }
  }

  Object.assign(creditDay, updateBody);
  await creditDay.save();
  return creditDay;
};

/**
 * Delete a credit day by ID
 * @param {ObjectId} id
 * @returns {Promise<CreditDay>}
 */
const deleteCreditDayById = async (id) => {
  const creditDay = await getCreditDayById(id);
  if (!creditDay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Credit day not found");
  }
  await creditDay.deleteOne();
  return creditDay;
};

module.exports = {
  createCreditDay,
  queryCreditDays,
  getCreditDayById,
  updateCreditDayById,
  deleteCreditDayById,
};
