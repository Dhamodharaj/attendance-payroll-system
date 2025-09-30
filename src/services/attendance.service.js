const httpStatus = require("http-status");
const { Attendance, CreditDay } = require("../models");
const { Holiday } = require("../models");

const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
/**
 * Create an attendance record
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (attendanceBody) => {
  const { start_time, end_time, emp_id, date } = attendanceBody;

  const existing = await Attendance.findOne({ emp_id, date });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "attendance already exist");
  }

  if (start_time && end_time) {
    attendanceBody.workHrs = getHourDifference(start_time, end_time);
  }
  const attendance = await Attendance.create(attendanceBody);
  return attendance;
};

const createMultiple = async (attendanceBody) => {
  const attemdanceRecords = await Promise.all(
    attendanceBody.map(async (attendance) => {
      const { start_time, end_time, emp_id, date } = attendance;
      const existing = await Attendance.findOne({ emp_id, date });
      if (existing) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `attendance already exist ${emp_id} , ${date}`
        );
      }
      let workHrs = 0;
      if (start_time && end_time) {
        workHrs = getHourDifference(start_time, end_time);
      }
      return { ...attendance, workHrs };
    })
  );

  return await Attendance.insertMany(attemdanceRecords);
};

// const workReport = async (start_date, end_date, emp_id) => {
//   const pipeline = [
//     {
//       $match: {
//         ...(emp_id && { emp_id: ObjectId(emp_id) }),
//         date: {
//           $gte: new Date(start_date),
//           $lt: new Date(
//             new Date(end_date).setDate(new Date(end_date).getDate() + 1)
//           ),
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "employees",
//         localField: "emp_id",
//         foreignField: "_id",
//         as: "employeeDetails",
//       },
//     },
//     { $unwind: { path: "$employeeDetails", preserveNullAndEmptyArray: true } },
//     {
//       $addFields: {
//         workday: {
//           $cond: [
//             { $gte: ["$workHrs", 8] },
//             1,
//             {
//               $cond: [{ $gte: ["$workHrs", 4] }, 0.5, 0],
//             },
//           ],
//         },
//       },
//     },

//     {
//       $group: {
//         _id: { emp_id: "$emp_id", emp_name: "$employeeDetails.employee_name" },
//         totalWorkHours: { $sum: "$workHrs" },
//         totalWorkdays: { $sum: "$workday" },
//         totalAbsent: { $sum: { $cond: [{ $eq: ["$isAbsent", true] }, 1, 0] } },
//         totalDays: { $sum: 1 },
//         details: {
//           $push: {
//             date: "$date",
//             start_time: "$start_time",
//             end_time: "$end_time",
//             workHrs: "$workHrs",
//           },
//         },
//       },
//     },
//   ];

//   const pipeline2 = [
//     {
//       $match: {
//         from_date: { $lte: new Date(end_date) },
//         to_date: { $gte: new Date(start_date) },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         HolidaysDays: { $sum: "$days" },
//       },
//     },
//   ];

//   const [records, holidays] = await Promise.all([
//     Attendance.aggregate(pipeline),
//     Holiday.aggregate(pipeline2),
//   ]);

//   return { workRecords:records, holidays:holidays[0] || {} };
// };

function getWorkingDaysExcludingSundays(start, end) {
  let current = new Date(start);
  let workingDayCounts = 0;
  let sundayCounts = 0;
  let totalDays = 0;
  let sundays = [];

  while (current <= end) {
    if (current.getDay() !== 0) {
      // 0 = Sunday
      workingDayCounts++;
    } else {
      sundays.push(current);
      sundayCounts++;
    }
    totalDays++;
    current.setDate(current.getDate() + 1);
  }

  return { workingDayCounts, sundayCounts, totalDays, sundays };
}

const workReport = async (start_date, end_date, emp_id) => {
  const fromDate = new Date(start_date);
  const toDate = new Date(end_date);

  if (fromDate > toDate) {
    throw new Error("start_date cannot be greater than end_date");
  }

  // Get total days, Sundays, working days excluding Sundays
  const daysCount = getWorkingDaysExcludingSundays(fromDate, toDate);
  const totalPossibleWorkdays = daysCount.workingDayCounts;

  const holidayRecords = await Holiday.aggregate([
    {
      $match: {
        from_date: { $lte: toDate },
        to_date: { $gte: fromDate },
      },
    },
    {
      $addFields: {
        allDates: {
          $map: {
            input: {
              $range: [
                0,
                {
                  $add: [
                    {
                      $divide: [
                        { $subtract: ["$to_date", "$from_date"] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            as: "offset",
            in: {
              $add: [
                "$from_date",
                { $multiply: ["$$offset", 1000 * 60 * 60 * 24] },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        nonSundayDates: {
          $filter: {
            input: "$allDates",
            as: "date",
            cond: { $ne: [{ $dayOfWeek: "$$date" }, 1] }, // 1 = Sunday
          },
        },
      },
    },
    { $unwind: "$nonSundayDates" },
    { $replaceRoot: { newRoot: "$nonSundayDates" } },
  ]);

  let holidayDatesSet = new Set(
    holidayRecords.map((d) => new Date(d).toDateString())
  );

  for (const sunday of daysCount.sundays) {
    holidayDatesSet.add(sunday.toISOString().split("T")[0]);
  }
  const holidayDatesArray = Array.from(holidayDatesSet);

  // Attendance aggregation
  const attendancePipeline = [
    {
      $match: {
        ...(emp_id && { emp_id: new ObjectId(emp_id) }),
        date: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "emp_id",
        foreignField: "_id",
        as: "employeeDetails",
      },
    },
    { $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        workday: {
          $cond: [
            { $gte: ["$workHrs", 8] },
            1,
            { $cond: [{ $gte: ["$workHrs", 4] }, 0.5, 0] },
          ],
        },
        isHoliday: {
          $in: [
            { $dateToString: { date: "$date", format: "%Y-%m-%d" } },
            holidayDatesArray,
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          emp_id: "$emp_id",
          emp_name: "$employeeDetails.employee_name",
          base_salary: "$employeeDetails.base_salary",
          empid: "$employeeDetails.emp_id",
          designation: "$employeeDetails.designation",
        },
        totalWorkHours: {
          $sum: { $cond: [{ $eq: ["$isHoliday", false] }, "$workHrs", 0] },
        },
        extraHours: {
          $sum: { $cond: [{ $eq: ["$isHoliday", true] }, "$workHrs", 0] },
        },
        totalWorkdaysFromAttendance: {
          $sum: { $cond: [{ $eq: ["$isHoliday", false] }, "$workday", 0] },
        },
        extraWorkedDays: {
          $sum: { $cond: [{ $eq: ["$isHoliday", true] }, "$workday", 0] },
        },
        totalAbsent: { $sum: { $cond: [{ $eq: ["$isAbsent", true] }, 1, 0] } },
        details: {
          $push: {
            date: "$date",
            start_time: "$start_time",
            end_time: "$end_time",
            workHrs: "$workHrs",
            workday: "$workday",
          },
        },
      },
    },
    // Lookup creditdays for each employee
    {
      $lookup: {
        from: "creditdays",
        let: { empId: "$_id.emp_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$emp_id", "$$empId"] },
                  { $eq: ["$used", false] },
                  { $lte: ["$date", toDate] },
                ],
              },
            },
          },
          { $group: { _id: null, totalcredits: { $sum: 1 } } },
        ],
        as: "credits",
      },
    },
    // Safely get the first element of credits array, default 0
    {
      $addFields: {
        empTotalcredits: {
          $ifNull: [{ $arrayElemAt: ["$credits.totalcredits", 0] }, 0],
        },
      },
    },
  ];

  // Holiday aggregation excluding Sundays
  const holidayPipeline = [
    {
      $match: {
        from_date: { $lte: toDate },
        to_date: { $gte: fromDate },
      },
    },
    {
      $addFields: {
        allDates: {
          $map: {
            input: {
              $range: [
                0,
                {
                  $add: [
                    {
                      $divide: [
                        { $subtract: ["$to_date", "$from_date"] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            as: "offset",
            in: {
              $add: [
                "$from_date",
                { $multiply: ["$$offset", 1000 * 60 * 60 * 24] },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        nonSundayDates: {
          $filter: {
            input: "$allDates",
            as: "date",
            cond: { $ne: [{ $dayOfWeek: "$$date" }, 1] }, // 1 = Sunday
          },
        },
      },
    },
    {
      $project: {
        days: { $size: "$nonSundayDates" },
      },
    },
    {
      $group: {
        _id: null,
        holidayDays: { $sum: "$days" },
      },
    },
  ];

  const creditPipeline = [
    {
      $match: {
        used: false,
        date: { $lte: fromDate },
      },
    },
    {
      $group: {
        _id: "$emp_id",
        totalCredits: { $sum: 1 },
      },
    },
  ];

  const [attendanceRecords, holidays, prevCredits] = await Promise.all([
    Attendance.aggregate(attendancePipeline),
    Holiday.aggregate(holidayPipeline),
    CreditDay.aggregate(creditPipeline),
  ]);
  const prevCreditsDoc = Object.fromEntries(
    prevCredits.map((data) => [data._id.toString(), data.totalCredits])
  );

  const holidayDays = holidays[0]?.holidayDays || 0;

  return attendanceRecords.map((record) => {
    const base_salary = record?._id?.base_salary || 0;
    const totalWorkdays = totalPossibleWorkdays - holidayDays;
    let perDaySalary = 0;
    let salary = 0;
    let empCredit = 0;
    let extraDays = 0;
    const empPrevCredits = prevCreditsDoc[record._id.emp_id.toString()] || 0;

    if (base_salary > 0 && totalWorkdays > 0) {
      empCredit = record.empTotalcredits + empPrevCredits;

      extraDays = Math.min(
        empCredit,
        totalWorkdays - record.totalWorkdaysFromAttendance
      );

      perDaySalary = base_salary / totalWorkdays;
      salary = perDaySalary * (record.totalWorkdaysFromAttendance + extraDays);
    }

    return {
      ...record,
      totalWorkdays,
      perDaySalary: Number(perDaySalary.toFixed(3)),
      salary: Number(salary.toFixed(3)),
      sundays: daysCount.sundayCounts,
      totalDays: daysCount.totalDays,
      holidayDays,
      empCredit,
      extraDays,
      empPrevCredits,
    };
  });
};

function getHourDifference(startTime, endTime) {
  // Parse time strings into Date objects with today's date
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  // Calculate difference in milliseconds
  let diff = end - start;

  // If end is before start (overnight shift), add 24 hours
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  // Convert milliseconds to hours (decimal)
  const diffInHours = diff / (1000 * 60 * 60);

  return diffInHours;
}

/**
 * Query attendances
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - sortField:(desc|asc)
 * @param {number} [options.limit] - max results per page
 * @param {number} [options.page] - current page
 * @returns {Promise<QueryResult>}
 */
const queryAttendances = async (filter, options) => {
  options.lean = true;
  const attendances = await Attendance.paginate(filter, options);
  return attendances;
};

/**
 * Get attendance by id
 * @param {ObjectId} id
 * @returns {Promise<Attendance>}
 */
const getAttendanceById = async (id) => {
  return Attendance.findById(id);
};

/**
 * Update attendance by id
 * @param {ObjectId} attendanceId
 * @param {Object} updateBody
 * @returns {Promise<Attendance>}
 */
const updateAttendanceById = async (attendanceId, updateBody) => {
  const attendance = await getAttendanceById(attendanceId);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }

  const start_time = updateBody.start_time ?? attendance.start_time;
  const end_time = updateBody.end_time ?? attendance.end_time;

  if (start_time && end_time) {
    updateBody.workHrs = getHourDifference(start_time, end_time);
  }

  Object.assign(attendance, updateBody);
  await attendance.save();

  return attendance;
};

/**
 * Delete attendance by id
 * @param {ObjectId} attendanceId
 * @returns {Promise<Attendance>}
 */
const deleteAttendanceById = async (attendanceId) => {
  const attendance = await getAttendanceById(attendanceId);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Attendance record not found");
  }
  await attendance.deleteOne();
  return attendance;
};

module.exports = {
  createAttendance,
  queryAttendances,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  createMultiple,
  workReport,
};
