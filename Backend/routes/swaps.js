const express = require('express');
const router = express.Router();
const Swap = require('../models/Swap');
const Skill = require('../models/Skill');
const User = require('../models/User');
const { verifyToken, userExists } = require('../middleware/auth');
const { validateSwapRequest } = require('../middleware/validation');

// Get all swaps (for admin or general access)
router.get('/', verifyToken, userExists, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { fromUser: req.user.userId },
        { toUser: req.user.userId }
      ]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .populate('offeredSkill', 'name description type')
    .populate('requestedSkill', 'name description type')
    .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all swaps for current user
router.get('/my-swaps', verifyToken, userExists, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { fromUser: req.user.userId },
        { toUser: req.user.userId }
      ]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .populate('offeredSkill', 'name description type')
    .populate('requestedSkill', 'name description type')
    .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error('Get my swaps error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get swap by ID
router.get('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('offeredSkill', 'name description type')
      .populate('requestedSkill', 'name description type');

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (swap.fromUser._id.toString() !== req.user.userId && 
        swap.toUser._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(swap);
  } catch (error) {
    console.error('Get swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create swap request
router.post('/', verifyToken, userExists, validateSwapRequest, async (req, res) => {
  try {
    const { toUserId, offeredSkillId, requestedSkillId, message } = req.body;

    // Check if skills exist and belong to the correct users
    const offeredSkill = await Skill.findById(offeredSkillId);
    const requestedSkill = await Skill.findById(requestedSkillId);

    if (!offeredSkill || !requestedSkill) {
      return res.status(404).json({ error: 'One or both skills not found' });
    }

    if (offeredSkill.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You can only offer your own skills' });
    }

    if (requestedSkill.user.toString() !== toUserId) {
      return res.status(403).json({ error: 'Requested skill does not belong to the specified user' });
    }

    // Check if swap already exists
    const existingSwap = await Swap.findOne({
      fromUser: req.user.userId,
      toUser: toUserId,
      offeredSkill: offeredSkillId,
      requestedSkill: requestedSkillId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingSwap) {
      return res.status(400).json({ error: 'Swap request already exists' });
    }

    const swap = new Swap({
      fromUser: req.user.userId,
      toUser: toUserId,
      offeredSkill: offeredSkillId,
      requestedSkill: requestedSkillId,
      message
    });

    await swap.save();

    const populatedSwap = await swap.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'offeredSkill', select: 'name description type' },
      { path: 'requestedSkill', select: 'name description type' }
    ]);

    res.status(201).json(populatedSwap);
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept swap request
router.put('/:id/accept', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the recipient can accept swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap request is not pending' });
    }

    swap.status = 'accepted';
    swap.updatedAt = new Date();
    await swap.save();

    const populatedSwap = await swap.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'offeredSkill', select: 'name description type' },
      { path: 'requestedSkill', select: 'name description type' }
    ]);

    res.json(populatedSwap);
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject swap request
router.put('/:id/reject', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the recipient can reject swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap request is not pending' });
    }

    swap.status = 'rejected';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap request rejected successfully' });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel swap request (only by sender)
router.put('/:id/cancel', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the sender can cancel swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending swaps can be cancelled' });
    }

    swap.status = 'cancelled';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap request cancelled successfully' });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete swap
router.put('/:id/complete', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ error: 'Only accepted swaps can be completed' });
    }

    // Check if user is part of this swap
    if (swap.fromUser.toString() !== req.user.userId && 
        swap.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    swap.status = 'completed';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap completed successfully' });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// General update swap route
router.put('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (swap.fromUser.toString() !== req.user.userId && 
        swap.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update allowed fields
    const { status } = req.body;
    if (status) {
      swap.status = status;
      swap.updatedAt = new Date();
    }

    await swap.save();

    const populatedSwap = await swap.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'offeredSkill', select: 'name description type' },
      { path: 'requestedSkill', select: 'name description type' }
    ]);

    res.json(populatedSwap);
  } catch (error) {
    console.error('Update swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete swap (only by sender if pending)
router.delete('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the sender can delete swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending swaps can be deleted' });
    }

    await Swap.findByIdAndDelete(req.params.id);

    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    console.error('Delete swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 