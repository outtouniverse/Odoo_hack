const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, userExists } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');

// Get all public users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isPublic: true, isBanned: false })
      .select('-password')
      .populate('skillsOffered', 'name description type')
      .populate('skillsWanted', 'name description type');
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('skillsOffered', 'name description type')
      .populate('skillsWanted', 'name description type');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isPublic && req.user?.userId !== user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, userExists, validateProfileUpdate, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    console.log('User ID:', req.user.userId);
    console.log('Availability type:', typeof req.body.availability, 'Value:', req.body.availability);
    
    const { name, location, availability, isPublic, skillsOffered, skillsWanted, profilePhoto } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (availability !== undefined) {
      // Filter out empty strings from availability array
      if (Array.isArray(availability)) {
        updates.availability = availability.filter(item => item && item.trim() !== '');
      } else {
        updates.availability = availability;
      }
    }
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (skillsOffered !== undefined) updates.skillsOffered = skillsOffered;
    if (skillsWanted !== undefined) updates.skillsWanted = skillsWanted;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;

    console.log('Updates to apply:', updates);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password').populate('skillsOffered', 'name description type').populate('skillsWanted', 'name description type');

    console.log('User updated successfully:', updatedUser);
    console.log('Updated user availability:', updatedUser.availability);
    
    // Verify the data was actually saved
    const verifyUser = await User.findById(req.user.userId).select('availability');
    console.log('Database verification - availability:', verifyUser.availability);

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile photo (base64)
router.post('/upload-photo', verifyToken, userExists, async (req, res) => {
  try {
    const { photoData } = req.body;
    
    if (!photoData) {
      return res.status(400).json({ error: 'Photo data is required' });
    }

    // Validate base64 data
    if (!photoData.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Update user with photo data
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        profilePhoto: photoData,
        updatedAt: new Date() 
      },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Profile photo uploaded successfully',
      photoUrl: photoData 
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user skills
router.put('/skills', verifyToken, userExists, async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;
    const updates = {};

    if (skillsOffered !== undefined) updates.skillsOffered = skillsOffered;
    if (skillsWanted !== undefined) updates.skillsWanted = skillsWanted;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password').populate('skillsOffered', 'name description type').populate('skillsWanted', 'name description type');

    res.json(updatedUser);
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users by skill
router.get('/search/skill', async (req, res) => {
  try {
    const { skill } = req.query;
    
    if (!skill) {
      return res.status(400).json({ error: 'Skill parameter is required' });
    }

    const users = await User.find({
      isPublic: true,
      isBanned: false,
      $or: [
        { 'skillsOffered': { $in: await require('../models/Skill').find({ name: { $regex: skill, $options: 'i' } }).select('_id') } },
        { 'skillsWanted': { $in: await require('../models/Skill').find({ name: { $regex: skill, $options: 'i' } }).select('_id') } }
      ]
    })
    .select('-password')
    .populate('skillsOffered', 'name description type')
    .populate('skillsWanted', 'name description type');

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 