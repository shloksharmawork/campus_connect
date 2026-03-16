const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'voice'],
      required: true,
    },
    content: {
      type: String,
      // Optional, as voice notes might only have audioUrl
    },
    audioUrl: {
      type: String,
      // Optional, as text posts might not have an audioUrl
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
