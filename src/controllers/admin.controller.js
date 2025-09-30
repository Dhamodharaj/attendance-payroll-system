const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { adminService } = require("../services");

const createAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  res.status(httpStatus.CREATED).send(admin);
});

const getAllAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await adminService.queryAdmins(filter, options);
  res.send(result);
});

const getAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminById(req.params.adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  res.send(admin);
});

const updateAdmin = catchAsync(async (req, res) => {
  const { params, body } = req;
  const admin = await adminService.updateAdminById(params.adminId, body);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  res.send(admin);
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await adminService.changePassword(
    req.params.adminId,
    oldPassword,
    newPassword
  );
  res.send(admin);
});

const deleteAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.deleteAdminById(req.params.adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
};
