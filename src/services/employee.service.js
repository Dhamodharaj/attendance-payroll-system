const httpStatus = require("http-status");
const { Employee } = require("../models"); // Adjust the model path as necessary
const ApiError = require("../utils/ApiError");

const createEmployee = async (employeeBody) => {
  if (
    await Employee.doesEmployeeExist(employeeBody.username, employeeBody.email)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Employee with this ID already exists!"
    );
  }

  const prevEmp = await Employee.aggregate([
    {
      $addFields: {
        empNum: {
          $toInt: {
            $arrayElemAt: [{ $split: ["$emp_id", "-"] }, 1],
          },
        },
      },
    },
    { $sort: { empNum: -1 } },
    { $limit: 1 },
  ]);

  console.log("prevEmp:", prevEmp);

  let label = "";
  const START_NUMBER = 27; 

  if (prevEmp.length > 0) {
    const lastemp = prevEmp[0]?.empNum || START_NUMBER - 1;
    label = `MI-${String(lastemp + 1).padStart(4, "0")}`;
  } else {
    label = `MI-${String(START_NUMBER).padStart(4, "0")}`;
  }

  employeeBody.emp_id = label;
  const employee = await Employee.create(employeeBody);
  return employee;
};


/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryEmployees = async (filter, options) => {
  options.populate = "bankDetails";
  options.lean = true;
  const employees = await Employee.paginate(filter, options);
  return employees;
};

/**
 * Get employee by id
 * @param {ObjectId} id
 * @returns {Promise<Employee>}
 */
const getEmployeeById = async (id) => {
  return Employee.findById(id).populate("bankDetails");
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getEmployeeByEmailPwd = async (username) => {
  return Employee.findOne({ username });
};

/**
 * Update employee by id
 * @param {ObjectId} employeeId
 * @param {Object} updateBody
 * @returns {Promise<Employee>}
 */
const updateEmployeeById = async (employeeId, updateBody) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }

  if (
    updateBody.empid &&
    (await Employee.doesEmployeeExist(
      updateBody.username,
      updateBody.email,
      employeeId
    ))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Employee with this ID already exists!"
    );
  }

  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Delete employee by id
 * @param {ObjectId} employeeId
 * @returns {Promise<Employee>}
 */
const deleteEmployeeById = async (employeeId) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  await employee.deleteOne();
  return employee;
};

const updatePassword = async (id, oldPassword, newPassword) => {
  const employee = await Employee.findById(id);
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password must be different from the old password"
    );
  }

  const isMatch = await employee.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  employee.password = newPassword;

  await employee.save();
  return employee;
};

module.exports = {
  updatePassword,
  createEmployee,
  queryEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeeByEmailPwd,
};
