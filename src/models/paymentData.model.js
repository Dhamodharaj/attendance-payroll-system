const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const paymentDataSchema = new mongoose.Schema(
  {
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    base_salary: {
      type: Number,
    },
    totalWorkHours: {
      type: Number,
      required: true,
    },
    workedDays: {
      type: Number,
      required: true,
    },
    totalAbsent: {
      type: Number,
    },
    perDaySalary: {
      type: Number,
    },
    salary: {
      type: Number,
      required: true,
    },
    sundays: {
      type: Number,
    },
    totalDays: {
      type: Number,
    },
    holidayDays: {
      type: Number,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

// Plugins
paymentDataSchema.plugin(toJSON);
paymentDataSchema.plugin(paginate);

// Virtual populate
paymentDataSchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "emp_id",
  foreignField: "_id",
  justOne: true,
});

paymentDataSchema.set("toObject", { virtuals: true });
paymentDataSchema.set("toJSON", { virtuals: true });

const PaymentData = mongoose.model("PaymentData", paymentDataSchema);

module.exports = PaymentData;
