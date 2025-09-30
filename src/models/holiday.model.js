const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    days:{
      type: Number,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

// Add plugins for JSON conversion and pagination
holidaySchema.plugin(toJSON);
holidaySchema.plugin(paginate);

/**
 * Check if an holiday exists by username or email
 * @param {string} username
 * @param {string} email
 * @param {ObjectId} [excludeId] - Optional id to exclude from the query
 * @returns {Promise<boolean>}
 */
holidaySchema.statics.doesHolidayExist = async function (name, excludeId) {
  const holiday = await this.findOne({
    name,
    _id: { $ne: excludeId },
  });
  return !!holiday;
};

// Enable virtuals in JSON and object outputs
holidaySchema.set("toObject", { virtuals: true });
holidaySchema.set("toJSON", { virtuals: true });

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
