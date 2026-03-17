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
      enum: ['text', 'voice', 'image'],
      required: true,
    },
    content: { type: String },
    audioUrl: { type: String },
    imageUrl: { type: String },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        emoji: { type: String, required: true },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
