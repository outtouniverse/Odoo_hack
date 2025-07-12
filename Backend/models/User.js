const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, minlength: 3, maxlength: 30 },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  location: { type: String, maxlength: 100 },
  profilePhoto: { type: String }, // URL or file path
  skillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  skillsWanted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  availability: { type: String, maxlength: 200 },
  isPublic: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  completedSwaps: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema); 