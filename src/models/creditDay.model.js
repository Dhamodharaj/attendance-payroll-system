const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const creditDaySchema = new mongoose.Schema(
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
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'dateAdded', updatedAt: 'dateUpdated' },
  }
);

// Add plugins for JSON conversion and pagination
creditDaySchema.plugin(toJSON);
creditDaySchema.plugin(paginate);

// Virtual to populate employee details
creditDaySchema.virtual("employeeDetails", {
  ref: "Employee",
  localField: "emp_id",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals in JSON and object outputs
creditDaySchema.set('toObject', { virtuals: true });
creditDaySchema.set('toJSON', { virtuals: true });

const CreditDay = mongoose.model('CreditDay', creditDaySchema);

module.exports = CreditDay;
