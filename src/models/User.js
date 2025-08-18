const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 3,
  },
  schoolName: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
    description: 'Professional title or role (e.g., Principal, Assistant Principal, Teacher, Staff)'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for better query performance
UserSchema.index({ email: 1, isActive: 1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);