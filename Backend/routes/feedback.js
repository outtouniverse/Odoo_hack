const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Swap = require('../models/Swap');
const User = require('../models/User');
const { verifyToken, userExists } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

// Get all feedback for a user
router.get('/user/:userId', verifyToken, userExists, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      $or: [
        { fromUser: req.params.userId },
        { toUser: req.params.userId }
      ]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .populate('swap', 'offeredSkill requestedSkill')
    .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback for a specific swap
router.get('/swap/:swapId', verifyToken, userExists, async (req, res) => {
  try {
    const feedback = await Feedback.find({ swap: req.params.swapId })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('swap', 'offeredSkill requestedSkill');

    res.json(feedback);
  } catch (error) {
    console.error('Get swap feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create feedback
router.post('/', verifyToken, userExists, validateFeedback, async (req, res) => {
  try {
    const { swapId, toUserId, rating, comment } = req.body;

    // Check if swap exists and user is part of it
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (swap.fromUser.toString() !== req.user.userId && 
        swap.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if feedback already exists for this swap from this user
    const existingFeedback = await Feedback.findOne({
      swap: swapId,
      fromUser: req.user.userId
    });

    if (existingFeedback) {
      return res.status(400).json({ error: 'Feedback already submitted for this swap' });
    }

    // Check if swap is completed
    if (swap.status !== 'completed') {
      return res.status(400).json({ error: 'Can only leave feedback for completed swaps' });
    }

    // Create feedback
    const feedback = new Feedback({
      swap: swapId,
      fromUser: req.user.userId,
      toUser: toUserId,
      rating,
      comment: comment.trim()
    });

    await feedback.save();

    // Update user's average rating
    const userFeedback = await Feedback.find({ toUser: toUserId });
    const averageRating = userFeedback.reduce((acc, f) => acc + f.rating, 0) / userFeedback.length;

    await User.findByIdAndUpdate(toUserId, {
      rating: averageRating,
      $inc: { completedSwaps: 1 }
    });

    const populatedFeedback = await feedback.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'swap', select: 'offeredSkill requestedSkill' }
    ]);

    res.status(201).json(populatedFeedback);
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback by ID
router.get('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('swap', 'offeredSkill requestedSkill');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feedback (only by the author)
router.put('/:id', verifyToken, userExists, validateFeedback, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (feedback.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the author can update feedback' });
    }

    const { rating, comment } = req.body;
    feedback.rating = rating;
    feedback.comment = comment.trim();
    await feedback.save();

    // Recalculate user's average rating
    const userFeedback = await Feedback.find({ toUser: feedback.toUser });
    const averageRating = userFeedback.reduce((acc, f) => acc + f.rating, 0) / userFeedback.length;

    await User.findByIdAndUpdate(feedback.toUser, {
      rating: averageRating
    });

    const populatedFeedback = await feedback.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'swap', select: 'offeredSkill requestedSkill' }
    ]);

    res.json(populatedFeedback);
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete feedback (only by the author)
router.delete('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (feedback.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the author can delete feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    // Recalculate user's average rating
    const userFeedback = await Feedback.find({ toUser: feedback.toUser });
    const averageRating = userFeedback.length > 0 
      ? userFeedback.reduce((acc, f) => acc + f.rating, 0) / userFeedback.length 
      : 0;

    await User.findByIdAndUpdate(feedback.toUser, {
      rating: averageRating,
      $inc: { completedSwaps: -1 }
    });

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 