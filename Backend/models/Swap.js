const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  requestedSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  message: { type: String, minlength: 10, maxlength: 500 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Swap', SwapSchema); 