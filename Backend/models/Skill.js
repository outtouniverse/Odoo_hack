const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  type: { type: String, enum: ['offered', 'wanted'], required: true },
  approved: { type: Boolean, default: false }, // For admin approval
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', SkillSchema); 