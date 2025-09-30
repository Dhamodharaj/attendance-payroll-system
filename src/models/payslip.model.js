const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const payslipSchema = new mongoose.Schema(
  {
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    emp_name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    transactionid: {
      type: String,
    },
    bank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
      required: true,
    },
    incentive: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    esi: {
      type: Number,
      default: 0,
    },
    pf: {
      type: Number,
      default: 0,
    },
    base_salary: {
      type: Number,
      required: true,
    },
    total_salary: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    payslip_date: {
      type: Date,
      default: Date.now,
    },
    total_work_days: {
      type: Number,
      required: true,
    },
    worked_days: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

// Plugins
payslipSchema.plugin(toJSON);
payslipSchema.plugin(paginate);

// Virtuals for related employee & bank details
payslipSchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "emp_id",
  foreignField: "_id",
  justOne: true,
});

payslipSchema.virtual("bankDetails", {
  ref: "BankDetails",
  localField: "bank_id",
  foreignField: "_id",
  justOne: true,
});

payslipSchema.set("toObject", { virtuals: true });
payslipSchema.set("toJSON", { virtuals: true });

const Payslip = mongoose.model("Payslip", payslipSchema);

module.exports = Payslip;
