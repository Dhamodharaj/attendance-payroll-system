const allRoles = {
  Admin: [
    "manageAdmins",
    "getAdmins",
    "deleteAdmins",
    "manageEmployees",
    "getEmployees",
    "deleteEmployees",
    "manageHolidays",
    "getHolidays",
    "deleteHolidays",
    "manageAttendance",
    "getAttendance",
    "deleteAttendance",
    "getBankDetails",
    "manageBankDetails",
    "deleteBankDetails",
    "managePayslips",
    "getPayslips",
    "deletePayslips",
    "managePaymentData",
    "getPaymentData",
    "deletePaymentData",
    "manageCreditDays",
    "getCreditDays",
    "deleteCreditDays"
  ],
  Employee: ["getAdmins", "manageEmployees", "getEmployees"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
