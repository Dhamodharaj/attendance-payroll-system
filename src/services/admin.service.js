const httpStatus = require("http-status");
const { Admin } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create an admin
 * @param {Object} adminBody
 * @returns {Promise<Admin>}
 */
const createAdmin = async (adminBody) => {
  if (await Admin.doesAdminExist(adminBody.username, adminBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Admin with this username or email already exists!"
    );
  }

  const admin = await Admin.create(adminBody);
  return admin;
};

/**
 * Query for admins
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAdmins = async (filter, options) => {
  options.lean = true;
  const admins = await Admin.paginate(filter, options);
  return admins;
};

/**
 * Get admin by id
 * @param {ObjectId} id
 * @returns {Promise<Admin>}
 */
const getAdminById = async (id) => {
  return Admin.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getAdminByEmailPwd = async (username) => {
  return Admin.findOne({ username });
};
/**
 * Update admin by id
 * @param {ObjectId} adminId
 * @param {Object} updateBody
 * @returns {Promise<Admin>}
 */
const updateAdminById = async (adminId, updateBody) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  // Check for uniqueness if username is being updated
  if (
    updateBody.username &&
    updateBody.email &&
    (await Admin.doesAdminExist(updateBody.username, updateBody.email, adminId))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Admin with this username already exists!"
    );
  }

  Object.assign(admin, updateBody);
  await admin.save();
  return admin;
};

/**
 * Delete admin by id
 * @param {ObjectId} adminId
 * @returns {Promise<Admin>}
 */
const deleteAdminById = async (adminId, admin_id, user) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  await admin.deleteOne();
  return admin;
};

const changePassword = async (adminId, oldPassword, newPassword) => {
  const admin = await getAdminById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password must be different from the old password"
    );
  }
  const isMatch = await admin.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  admin.password = newPassword;
  await admin.save();

  return { status: "Password updated successfully." };
};

module.exports = {
  getAdminByEmailPwd,
  createAdmin,
  queryAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  changePassword,
};
