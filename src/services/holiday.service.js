const httpStatus = require("http-status");
const { Holiday } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a holiday
 * @param {Object} holidayBody
 * @returns {Promise<Holiday>}
 */
const createHoliday = async (holidayBody) => {
  const existing = await Holiday.findOne({
    name: holidayBody.name,
    from_date: holidayBody.from_date,
    to_date: holidayBody.to_date,
  });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "holiday already exist");
  }

  const fromDate = new Date(holidayBody.from_date);
  const toDate = new Date(holidayBody.to_date);

  if (fromDate > toDate) {
    throw new Error("from_date cannot be greater than to_date");
  }

  const days = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

  console.log(days);
  holidayBody.days = days;

  const holiday = await Holiday.create(holidayBody);
  return holiday;
};

/**
 * Query for holidays
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - sortField:(desc|asc)
 * @param {number} [options.limit] - max results per page
 * @param {number} [options.page] - current page
 * @returns {Promise<QueryResult>}
 */
const queryHolidays = async (filter, options) => {
  options.lean = true;
  const holidays = await Holiday.paginate(filter, options);
  return holidays;
};

/**
 * Get holiday by id
 * @param {ObjectId} id
 * @returns {Promise<Holiday>}
 */
const getHolidayById = async (id) => {
  return Holiday.findById(id);
};

/**
 * Update holiday by id
 * @param {ObjectId} holidayId
 * @param {Object} updateBody
 * @returns {Promise<Holiday>}
 */
const updateHolidayById = async (holidayId, updateBody) => {
  const holiday = await getHolidayById(holidayId);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found");
  }

  const fromDate = new Date(updateBody.from_date);
  const toDate = new Date(updateBody.to_date);

  if (fromDate > toDate) {
    throw new Error("from_date cannot be greater than to_date");
  }

  const days = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

  console.log(days);
  updateBody.days = days;

  Object.assign(holiday, updateBody);
  await holiday.save();
  return holiday;
};

/**
 * Delete holiday by id
 * @param {ObjectId} holidayId
 * @returns {Promise<Holiday>}
 */
const deleteHolidayById = async (holidayId) => {
  const holiday = await getHolidayById(holidayId);
  if (!holiday) {
    throw new ApiError(httpStatus.NOT_FOUND, "Holiday not found");
  }
  await holiday.deleteOne();
  return holiday;
};

module.exports = {
  createHoliday,
  queryHolidays,
  getHolidayById,
  updateHolidayById,
  deleteHolidayById,
};
