const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const bcrypt = require('bcryptjs');


const adminSchema = new mongoose.Schema(
  {
    admin_id: {
      type: String,
    },
    admin_name: {
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
      default:'Admin'
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
   
  },
  {
    timestamps: { createdAt: 'dateAdded', updatedAt: 'dateUpdated' },
  }
);

// Add plugins for JSON conversion and pagination
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * Check if an admin exists by username or email
 * @param {string} username
 * @param {string} email
 * @param {ObjectId} [excludeId] - Optional id to exclude from the query
 * @returns {Promise<boolean>}
 */
adminSchema.statics.doesAdminExist = async function (username, email, excludeId) {
  const admin = await this.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: excludeId },
  });
  return !!admin;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
adminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};


adminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

// Enable virtuals in JSON and object outputs
adminSchema.set('toObject', { virtuals: true });
adminSchema.set('toJSON', { virtuals: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
