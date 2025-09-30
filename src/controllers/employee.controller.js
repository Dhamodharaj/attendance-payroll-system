const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { employeeService } = require("../services");

// Controller to create a new employee
const createEmployee = catchAsync(async (req, res) => {
  const { body } = req;
  const employee = await employeeService.createEmployee(body);
  res.status(httpStatus.CREATED).send(employee);
});

const getAllEmployees = catchAsync(async (req, res) => {
  const filter = {
    ...pick(req.query, ["email", "status"]),
  };
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.limit = options.limit
    ? parseInt(options.limit)
    : Number.MAX_SAFE_INTEGER;

  const result = await employeeService.queryEmployees(filter, options);
  res.send(result);
});

const getEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  res.send(employee);
});

const updateEmployee = catchAsync(async (req, res) => {
  const { params, body } = req;

  const employee = await employeeService.updateEmployeeById(
    params.employeeId,
    body
  );
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  res.send(employee);
});

const deleteEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.deleteEmployeeById(
    req.params.employeeId
  );
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const updatePassword = catchAsync(async (req, res) => {
  const id = req.params.employeeId;

  const { oldPassword, newPassword } = req.body;
  const employee = await employeeService.updatePassword(
    id,
    oldPassword,
    newPassword
  );
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  res.send(employee);
});

module.exports = {
  updatePassword,
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
