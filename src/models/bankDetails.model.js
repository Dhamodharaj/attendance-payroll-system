const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bankDetailsSchema = new mongoose.Schema(
  {
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    account_no: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    email_id: {
      type: String,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'dateAdded', updatedAt: 'dateUpdated' },
  }
);

// Add plugins for JSON conversion and pagination
bankDetailsSchema.plugin(toJSON);
bankDetailsSchema.plugin(paginate);

bankDetailsSchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "emp_id",
  foreignField: "_id",
  justOne: true,
});


// Enable virtuals in JSON and object outputs
bankDetailsSchema.set('toObject', { virtuals: true });
bankDetailsSchema.set('toJSON', { virtuals: true });

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);

module.exports = BankDetails;
