const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  swap: { type: mongoose.Schema.Types.ObjectId, ref: 'Swap', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, minlength: 10, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema); 