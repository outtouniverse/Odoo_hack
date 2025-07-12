const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const Swap = require('../models/Swap');
const Feedback = require('../models/Feedback');
const AdminMessage = require('../models/AdminMessage');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateAdminMessage } = require('../middleware/validation');

// Middleware: Only admin
router.use(verifyToken, isAdmin);

// Get all pending skills for approval
router.get('/skills/pending', async (req, res) => {
  try {
    const skills = await Skill.find({ approved: false });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve or reject a skill
router.put('/skills/:id/approve', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/skills/:id/reject', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill rejected and deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban or unban a user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { banned: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/users/:id/unban', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { banned: false }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Monitor swaps
router.get('/swaps', async (req, res) => {
  try {
    const swaps = await Swap.find().populate('fromUser toUser offeredSkill requestedSkill');
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send platform-wide message
router.post('/messages', validateAdminMessage, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const adminMessage = new AdminMessage({ title, message, type });
    await adminMessage.save();
    res.status(201).json(adminMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all admin messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await AdminMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Download reports (user activity, feedback logs, swap stats)
router.get('/reports', async (req, res) => {
  try {
    const users = await User.find();
    const feedbacks = await Feedback.find();
    const swaps = await Swap.find();
    res.json({ users, feedbacks, swaps });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 