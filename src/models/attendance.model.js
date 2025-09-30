const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const attendanceSchema = new mongoose.Schema(
  {
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
    },
    end_time: {
      type: String,
    },
    notes: {
      type: String,
    },
    workHrs:{
      type:Number,
      default:0
    },
    isAbsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

// Add plugins for JSON conversion and pagination
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);

/**
 * Check if an attendance exists by username or email
 * @param {string} username
 * @param {string} email
 * @param {ObjectId} [excludeId] - Optional id to exclude from the query
 * @returns {Promise<boolean>}
 */
attendanceSchema.statics.doesAttendanceExist = async function (
  emp_id,
  date,
  excludeId
) {
  const attendance = await this.findOne({
    emp_id,
    date,
    _id: { $ne: excludeId },
  });
  return !!attendance;
};

attendanceSchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "emp_id",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals in JSON and object outputs
attendanceSchema.set("toObject", { virtuals: true });
attendanceSchema.set("toJSON", { virtuals: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
