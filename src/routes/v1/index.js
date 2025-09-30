const express = require("express");

const adminRoute = require("./admin.route");
const employeeRoute = require("./employee.route");
const authRoute = require("./auth.route");
const attendanceRoute = require("./attendance.route");
const bankDetailsRoute = require("./bankDetails.route");

const paymentDataRoute = require("./paymentData.route");

const payslipRoute = require("./payslip.route");

const holidayRoute = require("./holiday.route");
const creditDayRoute = require("./creditDay.route");

const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/employee",
    route: employeeRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/holiday",
    route: holidayRoute,
  },
  {
    path: "/creditDay",
    route: creditDayRoute,
  },
  {
    path: "/attendance",
    route: attendanceRoute,
  },
  {
    path: "/bankDetails",
    route: bankDetailsRoute,
  },
  {
    path: "/payslip",
    route: payslipRoute,
  },
  {
    path: "/paymentData",
    route: paymentDataRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  /*   {
    path: '/docs',
    route: docsRoute,
  }, */
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
