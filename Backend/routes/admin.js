const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Swap = require('../models/Swap');
const Skill = require('../models/Skill');
const { verifyToken, userExists } = require('../middleware/auth');

// Admin middleware - check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get admin statistics
router.get('/stats', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    console.log('Getting admin stats...');
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const pendingSwaps = await Swap.countDocuments({ status: 'pending' });
    const completedSwaps = await Swap.countDocuments({ status: 'completed' });
    const acceptedSwaps = await Swap.countDocuments({ status: 'accepted' });
    const rejectedSwaps = await Swap.countDocuments({ status: 'rejected' });
    
    // Get average rating
    const users = await User.find({}, 'rating');
    const averageRating = users.length > 0 
      ? users.reduce((acc, user) => acc + (user.rating || 0), 0) / users.length 
      : 0;
    
    // Get recent activity (last 10 swaps)
    const recentSwaps = await Swap.find()
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('offeredSkill', 'name')
      .populate('requestedSkill', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Get user statistics
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const activeUsers = totalUsers - bannedUsers;
    
    const stats = {
      totalUsers,
      activeUsers,
      bannedUsers,
      totalSwaps,
      pendingSwaps,
      acceptedSwaps,
      completedSwaps,
      rejectedSwaps,
      averageRating: parseFloat(averageRating.toFixed(2)),
      recentActivity: recentSwaps.map(swap => ({
        id: swap._id.toString(),
        fromUser: swap.fromUser || { _id: 'Unknown', name: 'Unknown User', email: 'No email' },
        toUser: swap.toUser || { _id: 'Unknown', name: 'Unknown User', email: 'No email' },
        offeredSkill: swap.offeredSkill || { name: 'Unknown Skill' },
        requestedSkill: swap.requestedSkill || { name: 'Unknown Skill' },
        status: swap.status || 'pending',
        createdAt: swap.createdAt || new Date(),
        updatedAt: swap.updatedAt || new Date()
      }))
    };
    
    console.log('Admin stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    console.log('Getting all users for admin...');
    
    const users = await User.find()
      .populate('skillsOffered', 'name description type')
      .populate('skillsWanted', 'name description type')
      .select('-password')
      .lean();
    
    // Ensure all users have required fields based on User model
    const processedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(), // Add id field for frontend compatibility
      rating: user.rating || 5.0,
      isBanned: user.isBanned || false,
      isAdmin: user.isAdmin || false,
      isPublic: user.isPublic || true,
      name: user.name || 'Unknown User',
      email: user.email || 'No email',
      username: user.username || 'unknown',
      location: user.location || '',
      profilePhoto: user.profilePhoto || '',
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
      availability: user.availability || [],
      completedSwaps: user.completedSwaps || 0,
      joinedDate: user.joinedDate || user.createdAt || new Date(),
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    }));
    
    console.log(`Found ${processedUsers.length} users`);
    res.json(processedUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban user
router.put('/users/:userId/ban', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Banning user: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isAdmin) {
      return res.status(403).json({ error: 'Cannot ban admin users' });
    }
    
    user.isBanned = true;
    user.updatedAt = new Date();
    await user.save();
    
    console.log(`User ${userId} banned successfully`);
    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unban user
router.put('/users/:userId/unban', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Unbanning user: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isBanned = false;
    user.updatedAt = new Date();
    await user.save();
    
    console.log(`User ${userId} unbanned successfully`);
    res.json({ message: 'User unbanned successfully', user });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all swaps (admin only)
router.get('/swaps', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    console.log('Getting all swaps for admin...');
    
    const swaps = await Swap.find()
      .populate('fromUser', 'name email username')
      .populate('toUser', 'name email username')
      .populate('offeredSkill', 'name description type')
      .populate('requestedSkill', 'name description type')
      .sort({ createdAt: -1 })
      .lean();
    
    // Ensure all swaps have required fields based on Swap model
    const processedSwaps = swaps.map(swap => ({
      ...swap,
      _id: swap._id.toString(),
      id: swap._id.toString(), // Add id field for frontend compatibility
      fromUserId: swap.fromUser?._id?.toString() || swap.fromUser || 'Unknown',
      toUserId: swap.toUser?._id?.toString() || swap.toUser || 'Unknown',
      skillOffered: swap.offeredSkill?.name || 'Unknown Skill',
      skillRequested: swap.requestedSkill?.name || 'Unknown Skill',
      fromUser: swap.fromUser || { _id: 'Unknown', name: 'Unknown User', email: 'No email' },
      toUser: swap.toUser || { _id: 'Unknown', name: 'Unknown User', email: 'No email' },
      offeredSkill: swap.offeredSkill || { name: 'Unknown Skill' },
      requestedSkill: swap.requestedSkill || { name: 'Unknown Skill' },
      status: swap.status || 'pending',
      message: swap.message || '',
      createdAt: swap.createdAt || new Date(),
      updatedAt: swap.updatedAt || new Date()
    }));
    
    console.log(`Found ${processedSwaps.length} swaps`);
    res.json(processedSwaps);
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete swap (admin only)
router.delete('/swaps/:swapId', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    const { swapId } = req.params;
    console.log(`Deleting swap: ${swapId}`);
    
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    
    await Swap.findByIdAndDelete(swapId);
    
    console.log(`Swap ${swapId} deleted successfully`);
    res.json({ message: 'Swap deleted successfully' });
  } catch (error) {
    console.error('Delete swap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform analytics
router.get('/analytics', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    console.log('Getting platform analytics...');
    
    // Get date range for analytics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // User growth
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Swap activity
    const totalSwaps = await Swap.countDocuments();
    const swapsThisMonth = await Swap.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Status distribution
    const swapStatuses = await Swap.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top skills
    const topSkills = await Skill.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    const analytics = {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        growthRate: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(2) : 0
      },
      swaps: {
        total: totalSwaps,
        thisMonth: swapsThisMonth,
        statusDistribution: swapStatuses.reduce((acc, status) => {
          acc[status._id] = status.count;
          return acc;
        }, {})
      },
      skills: {
        topSkills: topSkills.map(skill => ({
          name: skill._id,
          count: skill.count
        }))
      },
      period: {
        start: thirtyDaysAgo.toISOString(),
        end: new Date().toISOString()
      }
    };
    
    console.log('Analytics:', analytics);
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send platform message (placeholder for future implementation)
router.post('/messages', verifyToken, userExists, requireAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // TODO: Implement platform messaging system
    console.log('Platform message:', { title, message, type });
    
    res.json({ message: 'Platform message sent successfully' });
  } catch (error) {
    console.error('Send platform message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 