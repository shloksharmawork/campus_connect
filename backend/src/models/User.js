const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@mitsgwl\.ac\.in$/, 'Please use a valid mitsgwl.ac.in email'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    collegeId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['student'],
      default: 'student',
    },
    onlineStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
