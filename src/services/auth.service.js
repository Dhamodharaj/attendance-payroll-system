const httpStatus = require("http-status");
const tokenService = require("./token.service");
const adminService = require("./admin.service");
const employeeService = require("./employee.service");

const otpVerificationService = require("./otpVerification.service");
const { Admin } = require("../models");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");

const loginAdminWithEmailAndPassword = async (email, password) => {
  const admin = await adminService.getAdminByEmailPwd(email, password);
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return admin;
};

const loginEmployeeWithEmailAndPassword = async (email, password) => {
  const employee = await employeeService.getEmployeeByEmailPwd(email, password);
  if (!employee || !(await employee.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return employee;
};

const sendOtp = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  await otpVerificationService.generateOTP(admin._id.toString(), email);
};

const verifyOtp = async (email, otp) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  const result = await otpVerificationService.verifyOTP(
    admin._id.toString(),
    otp
  );
  if (result.status == false) {
    return result;
  }
  const token = await tokenService.generateResetPasswordToken(admin._id);
  return { status: true, token };
};

const changePassword = async (token, new_password) => {
  const adminId = await tokenService.verifyResetPasswordToken(token);
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }
  admin.password = new_password;
  await admin.save();
  await Token.deleteOne({ token });
  return { status: true, admin };
};

module.exports = {
  loginAdminWithEmailAndPassword,
  loginEmployeeWithEmailAndPassword,
  sendOtp,
  verifyOtp,
  changePassword,
};
