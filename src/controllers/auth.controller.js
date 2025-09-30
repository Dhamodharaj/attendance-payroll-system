const catchAsync = require("../utils/catchAsync"); //, emailService, customerService, smsService
const { authService, tokenService } = require("../services");

const adminLogin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const admin = await authService.loginAdminWithEmailAndPassword(
    username,
    password
  );
  const tokens = await tokenService.generateAuthTokens(admin);
  res.send({ admin, tokens });
});

const employeeLogin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const employee = await authService.loginEmployeeWithEmailAndPassword(
    username,
    password
  );
  const tokens = await tokenService.generateAuthTokens(employee);
  res.send({ employee, tokens });
});

const sendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.sendOtp(email);
  res.send({ status: "OTP has been sent to your registered email" });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const token = await authService.verifyOtp(email, otp);
  res.send(token);
});

const changePassword = catchAsync(async (req, res) => {
  const { token, new_password } = req.body;
  const result = await authService.changePassword(token, new_password);
  res.send(result);
});

module.exports = {
  adminLogin,
  employeeLogin,
  sendOtp,
  verifyOtp,
  changePassword,
};
