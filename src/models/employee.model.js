const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
  {
    emp_id: {
      type: String,
    },
    employee_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Employee",
    },
    bankDetail_id: {
      type: mongoose.Types.ObjectId,
      ref: "BankDetails",
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    contact_no: {
      type: String,
    },
    about: {
      type: String,
    },
    socialMedia: [
      {
        handle: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    join_date: {
      type: Date,
    },
    dob: {
      type: Date,
    },
    base_salary: {
      type: Number,
    },
    designation: {
      type: String,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    blood_group: {
      type: String,
    },
    // pic: {
    //   type: String,
    // },
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

// Add plugins for JSON conversion and pagination
employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

/**
 * Check if an employee exists by username or email
 * @param {string} username
 * @param {string} email
 * @param {ObjectId} [excludeId] - Optional id to exclude from the query
 * @returns {Promise<boolean>}
 */
employeeSchema.statics.doesEmployeeExist = async function (
  username,
  email,
  excludeId
) {
  const employee = await this.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: excludeId },
  });
  return !!employee;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
employeeSchema.methods.isPasswordMatch = async function (password) {
  const employee = this;
  return bcrypt.compare(password, employee.password);
};

employeeSchema.pre("save", async function (next) {
  const employee = this;
  if (employee.isModified("password")) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});
employeeSchema.virtual("bankDetails", {
  ref: "BankDetails",
  localField: "bankDetail_id",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals in JSON and object outputs
employeeSchema.set("toObject", { virtuals: true });
employeeSchema.set("toJSON", { virtuals: true });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
