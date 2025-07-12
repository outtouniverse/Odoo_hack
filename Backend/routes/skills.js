const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');
const { verifyToken, userExists } = require('../middleware/auth');
const { validateSkill } = require('../middleware/validation');

// Get all approved skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ approved: true })
      .populate('user', 'name email location');
    
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get skills by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({ 
      user: req.params.userId,
      approved: true 
    }).populate('user', 'name email location');
    
    res.json(skills);
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new skill
router.post('/', verifyToken, userExists, validateSkill, async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    const skill = new Skill({
      user: req.user.userId,
      name,
      description,
      type
    });

    await skill.save();

    // Update user's skills arrays
    const user = await User.findById(req.user.userId);
    if (type === 'offered') {
      user.skillsOffered.push(skill._id);
    } else {
      user.skillsWanted.push(skill._id);
    }
    await user.save();

    const populatedSkill = await skill.populate('user', 'name email location');
    res.status(201).json(populatedSkill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill
router.put('/:id', verifyToken, userExists, validateSkill, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('user', 'name email location');

    res.json(updatedSkill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill
router.delete('/:id', verifyToken, userExists, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove from user's skills arrays
    const user = await User.findById(req.user.userId);
    user.skillsOffered = user.skillsOffered.filter(id => id.toString() !== req.params.id);
    user.skillsWanted = user.skillsWanted.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search skills
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const skills = await Skill.find({
      approved: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).populate('user', 'name email location');

    res.json(skills);
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 