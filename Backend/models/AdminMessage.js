const mongoose = require('mongoose');

const AdminMessageSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 100 },
  message: { type: String, required: true, minlength: 10, maxlength: 1000 },
  type: { type: String, enum: ['info', 'warning', 'alert'], default: 'info' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminMessage', AdminMessageSchema); 