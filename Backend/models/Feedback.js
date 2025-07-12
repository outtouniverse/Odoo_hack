const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  swap: { type: mongoose.Schema.Types.ObjectId, ref: 'Swap', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, minlength: 10, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for better query performance
FeedbackSchema.index({ swap: 1, fromUser: 1 }, { unique: true }); // One feedback per swap per user
FeedbackSchema.index({ toUser: 1 }); // For finding all feedback for a user
FeedbackSchema.index({ swap: 1 }); // For finding all feedback for a swap

module.exports = mongoose.model('Feedback', FeedbackSchema); 